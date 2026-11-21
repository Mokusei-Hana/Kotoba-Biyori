import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Layers,
  List,
  RotateCw,
  Search,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FuriganaText } from '@/components/common/FuriganaText'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { useLearning, type SrsRating } from '@/context/LearningContext'
import { getSubtopicLabel, TOPIC_MAP } from '@/data/topics'
import type { AppRoute } from '@/hooks/useHashRoute'
import type { TopicId } from '@/types/learning'
import { cn } from '@/lib/utils'

interface MistakesPageProps {
  navigate: (route: AppRoute, param?: string) => void
}

type SeverityFilter = 'all' | 'again' | 'hard'

export function MistakesPage({ navigate }: MistakesPageProps) {
  const { state, weakVocab, rateVocab, toggleVocabBookmark } = useLearning()

  const [mode, setMode] = useState<'list' | 'review'>('list')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [topicFilter, setTopicFilter] = useState<'all' | TopicId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [clearedCount, setClearedCount] = useState(0)

  // Sort mistakes: 'again' first, then 'hard'; within same severity, newest first
  const sortedMistakes = useMemo(() => {
    return [...weakVocab].sort((a, b) => {
      const ra = state.srsRecords[a.id]
      const rb = state.srsRecords[b.id]
      const weightA = ra?.lastRating === 'again' ? 0 : 1
      const weightB = rb?.lastRating === 'again' ? 0 : 1
      if (weightA !== weightB) return weightA - weightB
      return (rb?.updatedAt ?? '').localeCompare(ra?.updatedAt ?? '')
    })
  }, [weakVocab, state.srsRecords])

  const counts = useMemo(() => {
    let again = 0
    let hard = 0
    const topics = new Map<TopicId, number>()
    for (const item of sortedMistakes) {
      const rating = state.srsRecords[item.id]?.lastRating
      if (rating === 'again') again += 1
      else if (rating === 'hard') hard += 1
      topics.set(item.topic, (topics.get(item.topic) ?? 0) + 1)
    }
    return { total: sortedMistakes.length, again, hard, topics }
  }, [sortedMistakes, state.srsRecords])

  const filteredMistakes = useMemo(() => {
    let list = sortedMistakes
    if (severityFilter !== 'all') {
      list = list.filter((item) => state.srsRecords[item.id]?.lastRating === severityFilter)
    }
    if (topicFilter !== 'all') {
      list = list.filter((item) => item.topic === topicFilter)
    }
    const q = searchQuery.trim().toLowerCase()
    if (q && mode === 'list') {
      list = list.filter(
        (item) =>
          item.plainJa.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.zh.toLowerCase().includes(q) ||
          item.romaji.toLowerCase().includes(q),
      )
    }
    return list
  }, [sortedMistakes, severityFilter, topicFilter, searchQuery, mode, state.srsRecords])

  useEffect(() => {
    setCardIndex(0)
    setFlipped(false)
  }, [severityFilter, topicFilter])

  const currentCard = filteredMistakes[cardIndex] ?? filteredMistakes[0]

  const handleReviewRate = async (rating: SrsRating) => {
    if (!currentCard) return
    await rateVocab(currentCard.id, rating)
    setFlipped(false)
    if (rating === 'good') {
      setClearedCount((c) => c + 1)
      setCardIndex((prev) => (prev >= filteredMistakes.length - 1 ? 0 : prev))
    } else {
      setCardIndex((prev) => (prev + 1 < filteredMistakes.length ? prev + 1 : 0))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="size-6 text-warning" />
            错词本
          </h1>
          <p className="text-sm text-muted-foreground">
            自动收集 SRS 闪卡中标记为「不认识」和「有点模糊」的词句，支持按程度与主题筛选并集中攻克。
          </p>
        </div>

        {filteredMistakes.length > 0 && mode === 'list' && (
          <Button size="sm" onClick={() => setMode('review')}>
            <Layers className="size-4" />
            开始集中复习 ({filteredMistakes.length})
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3.5 space-y-0.5">
          <p className="text-xs text-muted-foreground">当前错词总数</p>
          <p className="font-display text-2xl font-bold">{counts.total}</p>
        </Card>
        <Card className="p-3.5 space-y-0.5 border-destructive/25">
          <p className="text-xs text-muted-foreground">不认识（重点）</p>
          <p className="font-display text-2xl font-bold text-destructive">{counts.again}</p>
        </Card>
        <Card className="p-3.5 space-y-0.5 border-warning/30">
          <p className="text-xs text-muted-foreground">有点模糊</p>
          <p className="font-display text-2xl font-bold text-warning">{counts.hard}</p>
        </Card>
      </div>

      {/* Filters */}
      {counts.total > 0 && (
        <div className="space-y-2.5">
          {/* Severity filter */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: 'all', label: `全部错词 (${counts.total})` },
                { key: 'again', label: `不认识 (${counts.again})` },
                { key: 'hard', label: `有点模糊 (${counts.hard})` },
              ] as { key: SeverityFilter; label: string }[]
            ).map((pill) => {
              const active = severityFilter === pill.key
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setSeverityFilter(pill.key)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                  )}
                >
                  {pill.label}
                </button>
              )
            })}
          </div>

          {/* Dynamic topic filter */}
          {counts.topics.size > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1 border-l-2 border-primary/30">
              <span className="text-[11px] font-medium text-muted-foreground px-1">按主题：</span>
              <button
                type="button"
                onClick={() => setTopicFilter('all')}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                  topicFilter === 'all'
                    ? 'bg-secondary text-secondary-foreground ring-1 ring-primary/40'
                    : 'bg-muted/60 text-muted-foreground hover:bg-secondary/70',
                )}
              >
                全部主题
              </button>
              {Array.from(counts.topics.entries()).map(([tid, cnt]) => (
                <button
                  key={tid}
                  type="button"
                  onClick={() => setTopicFilter(tid)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                    topicFilter === tid
                      ? 'bg-secondary text-secondary-foreground ring-1 ring-primary/40'
                      : 'bg-muted/60 text-muted-foreground hover:bg-secondary/70',
                  )}
                >
                  {TOPIC_MAP[tid]?.label ?? tid} ({cnt})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode Tabs */}
      {counts.total === 0 ? (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title={clearedCount > 0 ? `太棒了！本次已攻克 ${clearedCount} 个错词` : '错词本目前是空的'}
          description="在「口语闪卡」复习时，标记为「不认识」或「有点模糊」的词条会自动收录到这里，方便集中巩固。"
          action={
            <Button size="sm" variant="secondary" onClick={() => navigate('flashcards')}>
              前往口语闪卡复习
            </Button>
          }
        />
      ) : (
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'list' | 'review')}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="list">
                <List className="size-3.5" />
                错词清单
              </TabsTrigger>
              <TabsTrigger value="review">
                <Layers className="size-3.5" />
                集中复习
              </TabsTrigger>
            </TabsList>

            {clearedCount > 0 && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="size-3" />
                本次已攻克 {clearedCount} 词
              </Badge>
            )}
          </div>

          {/* List Mode */}
          <TabsContent value="list" className="mt-5 space-y-4">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索错词的日语、假名、罗马音或中文..."
                className="pl-9"
              />
            </div>

            {filteredMistakes.length === 0 ? (
              <EmptyState
                icon={<Search className="size-5" />}
                title="当前筛选条件下没有错词"
                description="可以切换上方的程度或主题标签，或清空搜索关键词。"
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSeverityFilter('all')
                      setTopicFilter('all')
                      setSearchQuery('')
                    }}
                  >
                    重置筛选
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredMistakes.map((item) => {
                  const rec = state.srsRecords[item.id]
                  const isAgain = rec?.lastRating === 'again'
                  const isBookmarked = state.bookmarkedVocab.includes(item.id)
                  const subLabel = getSubtopicLabel(item.topic, item.subtopic)

                  return (
                    <Card key={item.id} className="p-4 flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant={isAgain ? 'destructive' : 'warning'}
                              className="text-[11px]"
                            >
                              {isAgain ? '不认识' : '有点模糊'}
                            </Badge>
                            <Badge variant="secondary" className="text-[11px]">
                              {TOPIC_MAP[item.topic]?.label}
                            </Badge>
                            {subLabel && (
                              <Badge variant="muted" className="text-[11px]">
                                {subLabel}
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-bold font-display pt-0.5">
                            <FuriganaText
                              segments={item.segments}
                              showFurigana={state.preferences.showFurigana}
                            />
                          </p>
                          <p className="text-xs text-muted-foreground">{item.reading}</p>
                          <p className="text-sm text-foreground/90">{item.zh}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <SpeechButton id={`mistake-list-${item.id}`} text={item.plainJa} />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="收藏"
                            onClick={() => void toggleVocabBookmark(item.id)}
                          >
                            <Bookmark
                              className={cn(
                                'size-4',
                                isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground',
                              )}
                            />
                          </Button>
                        </div>
                      </div>

                      {item.exampleJa && (
                        <div className="rounded-lg bg-background border border-border/70 px-3 py-2 text-xs space-y-0.5">
                          <p className="text-foreground/90">{item.exampleJa}</p>
                          {item.exampleZh && (
                            <p className="text-muted-foreground">{item.exampleZh}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-border/50">
                        <span className="text-[11px] text-muted-foreground">
                          下次复习：{rec?.nextReviewDate ?? '今日'}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-success hover:text-success"
                          onClick={async () => {
                            await rateVocab(item.id, 'good')
                            setClearedCount((c) => c + 1)
                          }}
                        >
                          <CheckCircle2 className="size-3.5" />
                          标记已记住
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Focused Review Mode */}
          <TabsContent value="review" className="mt-5">
            {!currentCard ? (
              <EmptyState
                icon={<Sparkles className="size-5" />}
                title="当前筛选范围的错词已全部攻克！"
                description="可以切换回「全部错词」或去「口语闪卡」继续巩固其他词汇。"
                action={
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSeverityFilter('all')
                      setTopicFilter('all')
                    }}
                  >
                    查看全部错词
                  </Button>
                }
              />
            ) : (
              <div className="mx-auto max-w-xl space-y-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>
                    错词集中复习：第 {Math.min(cardIndex + 1, filteredMistakes.length)} /{' '}
                    {filteredMistakes.length} 张
                  </span>
                  <span>标记「记住了」即可移出错词本</span>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setFlipped((f) => !f)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      setFlipped((f) => !f)
                    }
                  }}
                  className="group relative min-h-[280px] w-full cursor-pointer rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={
                          state.srsRecords[currentCard.id]?.lastRating === 'again'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {state.srsRecords[currentCard.id]?.lastRating === 'again'
                          ? '不认识'
                          : '有点模糊'}
                      </Badge>
                      <Badge variant="secondary">{TOPIC_MAP[currentCard.topic]?.label}</Badge>
                      {getSubtopicLabel(currentCard.topic, currentCard.subtopic) && (
                        <Badge variant="muted">
                          {getSubtopicLabel(currentCard.topic, currentCard.subtopic)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <SpeechButton id={`mistake-fc-${currentCard.id}`} text={currentCard.plainJa} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="收藏词句"
                        onClick={(e) => {
                          e.stopPropagation()
                          void toggleVocabBookmark(currentCard.id)
                        }}
                      >
                        <Bookmark
                          className={cn(
                            'size-4',
                            state.bookmarkedVocab.includes(currentCard.id)
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground',
                          )}
                        />
                      </Button>
                    </div>
                  </div>

                  {!flipped ? (
                    <div className="my-8 text-center space-y-3">
                      <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                        <FuriganaText
                          segments={currentCard.segments}
                          showFurigana={state.preferences.showFurigana}
                        />
                      </p>
                      {state.preferences.showRomaji && currentCard.romaji && (
                        <p className="text-sm text-muted-foreground">{currentCard.romaji}</p>
                      )}
                      <p className="pt-2 text-xs text-muted-foreground/80 inline-flex items-center gap-1">
                        <RotateCw className="size-3" />
                        点击翻面查看释义
                      </p>
                    </div>
                  ) : (
                    <div className="my-5 space-y-4">
                      <div className="text-center space-y-1">
                        <p className="text-sm text-muted-foreground">{currentCard.reading}</p>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {currentCard.zh}
                        </p>
                      </div>

                      {currentCard.exampleJa && (
                        <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-primary">真实语料例句</span>
                            <SpeechButton
                              id={`mistake-ex-${currentCard.id}`}
                              text={currentCard.exampleJa}
                            />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {currentCard.exampleJa}
                          </p>
                          {currentCard.exampleZh && (
                            <p className="text-xs text-muted-foreground">{currentCard.exampleZh}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="h-1" />
                </div>

                {flipped ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-2.5 border-destructive/30 hover:bg-destructive/8 hover:text-destructive"
                      onClick={() => void handleReviewRate('again')}
                    >
                      <span className="text-sm font-semibold">仍不认识</span>
                      <span className="text-[11px] text-muted-foreground">留在错词本</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-2.5 border-warning/40 hover:bg-warning/10"
                      onClick={() => void handleReviewRate('hard')}
                    >
                      <span className="text-sm font-semibold">还是模糊</span>
                      <span className="text-[11px] text-muted-foreground">明天继续</span>
                    </Button>
                    <Button
                      variant="default"
                      className="flex-col h-auto py-2.5"
                      onClick={() => void handleReviewRate('good')}
                    >
                      <span className="text-sm font-semibold">记住了</span>
                      <span className="text-[11px] opacity-85">移出错词本</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => setFlipped(true)}
                  >
                    显示答案
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
