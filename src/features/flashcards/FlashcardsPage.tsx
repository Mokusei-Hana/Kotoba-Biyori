import React, { useEffect, useMemo, useState } from 'react'
import {
  Bookmark,
  CheckCircle2,
  Layers,
  List,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FuriganaText } from '@/components/common/FuriganaText'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { useLearning, type SrsRating } from '@/context/LearningContext'
import { TOPIC_MAP, TOPICS } from '@/data/topics'
import type { TopicId } from '@/types/learning'
import { cn, getTodayKey } from '@/lib/utils'

type FilterKey = 'due' | 'all' | 'bookmarked' | TopicId

export function FlashcardsPage() {
  const {
    state,
    allVocab,
    rateVocab,
    toggleVocabBookmark,
    addCustomVocab,
    deleteCustomVocab,
  } = useLearning()

  const [mode, setMode] = useState<'study' | 'browse'>('study')
  const [filter, setFilter] = useState<FilterKey>('due')
  const [searchQuery, setSearchQuery] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [sessionReviewed, setSessionReviewed] = useState(0)

  const today = getTodayKey()

  const filteredItems = useMemo(() => {
    let list = allVocab

    if (filter === 'due') {
      list = list.filter((item) => {
        const rec = state.srsRecords[item.id]
        return !rec || rec.nextReviewDate <= today
      })
    } else if (filter === 'bookmarked') {
      list = list.filter((item) => state.bookmarkedVocab.includes(item.id))
    } else if (filter !== 'all') {
      list = list.filter((item) => item.topic === filter)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q && mode === 'browse') {
      list = list.filter(
        (item) =>
          item.plainJa.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.zh.toLowerCase().includes(q) ||
          item.romaji.toLowerCase().includes(q),
      )
    }

    return list
  }, [allVocab, filter, state.srsRecords, state.bookmarkedVocab, today, searchQuery, mode])

  // Keep index in bounds when filter changes
  useEffect(() => {
    setCardIndex(0)
    setFlipped(false)
  }, [filter])

  const currentCard = filteredItems[cardIndex] ?? filteredItems[0]

  const handleRate = async (rating: SrsRating) => {
    if (!currentCard) return
    await rateVocab(currentCard.id, rating)
    setSessionReviewed((c) => c + 1)
    setFlipped(false)

    // In 'due' filter, the rated item drops out if rating !== 'again'
    if (filter === 'due') {
      if (rating === 'again') {
        setCardIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0))
      } else {
        setCardIndex((prev) => (prev >= filteredItems.length - 1 ? 0 : prev))
      }
    } else {
      setCardIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">口语词汇与短句闪卡</h1>
          <p className="text-sm text-muted-foreground">
            用间隔重复记住最常用的聊天词句，也可以随时录入自己遇到的地道表达。
          </p>
        </div>

        <AddCustomVocabDialog onAdd={addCustomVocab} />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'due', label: '今日待复习' },
            { key: 'all', label: `全部 (${allVocab.length})` },
            { key: 'bookmarked', label: `生词收藏 (${state.bookmarkedVocab.length})` },
            ...TOPICS.map((t) => ({ key: t.id, label: t.label })),
          ] as { key: FilterKey; label: string }[]
        ).map((pill) => {
          const active = filter === pill.key
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => setFilter(pill.key)}
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

      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'study' | 'browse')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="study">
              <Layers className="size-3.5" />
              闪卡记忆
            </TabsTrigger>
            <TabsTrigger value="browse">
              <List className="size-3.5" />
              词表浏览
            </TabsTrigger>
          </TabsList>

          {mode === 'study' && sessionReviewed > 0 && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              本次已复习 {sessionReviewed} 张
            </Badge>
          )}
        </div>

        {/* Study Mode */}
        <TabsContent value="study" className="mt-5">
          {!currentCard ? (
            <EmptyState
              icon={<Sparkles className="size-5" />}
              title={filter === 'due' ? '今日待复习已全部清空！' : '当前分类下还没有词句'}
              description={
                filter === 'due'
                  ? '太棒了，今天的口语词卡已经全部过完。可以切换到「全部」继续巩固，或去练一段场景对话。'
                  : '切换其他分类，或点击右上角「添加自定义词句」记录新表达。'
              }
              action={
                filter !== 'all' ? (
                  <Button size="sm" variant="secondary" onClick={() => setFilter('all')}>
                    浏览全部词卡
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="mx-auto max-w-xl space-y-5">
              {/* Progress indicator */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>
                  第 {Math.min(cardIndex + 1, filteredItems.length)} / {filteredItems.length} 张
                </span>
                <span>点击卡片翻转查看释义与例句</span>
              </div>

              {/* Interactive Flashcard */}
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
                className="group relative min-h-[290px] w-full cursor-pointer rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {/* Top row: badges + audio + bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary">{TOPIC_MAP[currentCard.topic]?.label}</Badge>
                    <Badge variant="outline">{currentCard.register}</Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <SpeechButton
                      id={`fc-main-${currentCard.id}`}
                      text={currentCard.plainJa}
                    />
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

                {/* Center content */}
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
                      点击翻面查看中文意思
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

                    <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-primary">对话例句</span>
                        <SpeechButton
                          id={`fc-ex-${currentCard.id}`}
                          text={currentCard.exampleJa}
                        />
                      </div>
                      <p className="text-sm font-medium text-foreground">{currentCard.exampleJa}</p>
                      <p className="text-xs text-muted-foreground">{currentCard.exampleZh}</p>
                    </div>

                    {currentCard.tip && (
                      <p className="text-xs text-muted-foreground text-center">
                        贴士：{currentCard.tip}
                      </p>
                    )}
                  </div>
                )}

                <div className="h-1" />
              </div>

              {/* SRS Action Buttons */}
              {flipped ? (
                <div className="grid grid-cols-3 gap-2.5">
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-2.5 border-destructive/30 hover:bg-destructive/8 hover:text-destructive"
                    onClick={() => void handleRate('again')}
                  >
                    <span className="text-sm font-semibold">不认识</span>
                    <span className="text-[11px] text-muted-foreground">今天再见</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-2.5 border-warning/40 hover:bg-warning/10"
                    onClick={() => void handleRate('hard')}
                  >
                    <span className="text-sm font-semibold">有点模糊</span>
                    <span className="text-[11px] text-muted-foreground">明天复习</span>
                  </Button>
                  <Button
                    variant="default"
                    className="flex-col h-auto py-2.5"
                    onClick={() => void handleRate('good')}
                  >
                    <span className="text-sm font-semibold">记住了</span>
                    <span className="text-[11px] opacity-85">延长间隔</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => setFlipped(true)}
                >
                  显示答案与例句
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Browse Mode */}
        <TabsContent value="browse" className="mt-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索日语、假名、罗马音或中文释义..."
              className="pl-9"
            />
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState
              icon={<Search className="size-5" />}
              title="没有找到匹配的词句"
              description="试试更换关键词或切换上方的分类标签。"
              action={
                searchQuery ? (
                  <Button size="sm" variant="outline" onClick={() => setSearchQuery('')}>
                    清空搜索
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredItems.map((item) => {
                const isBookmarked = state.bookmarkedVocab.includes(item.id)
                const rec = state.srsRecords[item.id]
                return (
                  <Card key={item.id} className="p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className="text-[11px]">
                            {TOPIC_MAP[item.topic]?.label}
                          </Badge>
                          <Badge variant="outline" className="text-[11px]">
                            {item.register}
                          </Badge>
                          {rec && rec.lastRating === 'good' && (
                            <Badge variant="success" className="text-[11px]">
                              已熟悉
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg font-bold font-display pt-0.5">
                          <FuriganaText
                            segments={item.segments}
                            showFurigana={state.preferences.showFurigana}
                          />
                        </p>
                        <p className="text-sm text-foreground/90">{item.zh}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <SpeechButton id={`list-${item.id}`} text={item.plainJa} />
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
                        {item.isCustom && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="删除自定义词句"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => void deleteCustomVocab(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg bg-background border border-border/70 px-3 py-2 text-xs space-y-0.5">
                      <p className="text-foreground/90">{item.exampleJa}</p>
                      <p className="text-muted-foreground">{item.exampleZh}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AddCustomVocabDialogProps {
  onAdd: (input: {
    plainJa: string
    reading: string
    romaji: string
    zh: string
    exampleJa: string
    exampleZh: string
    register: '礼貌' | '简体' | '通用'
  }) => Promise<void>
}

function AddCustomVocabDialog({ onAdd }: AddCustomVocabDialogProps) {
  const [open, setOpen] = useState(false)
  const [plainJa, setPlainJa] = useState('')
  const [reading, setReading] = useState('')
  const [romaji, setRomaji] = useState('')
  const [zh, setZh] = useState('')
  const [exampleJa, setExampleJa] = useState('')
  const [exampleZh, setExampleZh] = useState('')
  const [register, setRegister] = useState<'礼貌' | '简体' | '通用'>('通用')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plainJa.trim() || !zh.trim()) {
      setFormError('请至少填写「日语词句」和「中文释义」。')
      return
    }
    await onAdd({ plainJa, reading, romaji, zh, exampleJa, exampleZh, register })
    setPlainJa('')
    setReading('')
    setRomaji('')
    setZh('')
    setExampleJa('')
    setExampleZh('')
    setRegister('通用')
    setFormError(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          添加自定义词句
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>记录新的口语词句</DialogTitle>
          <DialogDescription>
            把平时看动漫、聊天时遇到的实用表达记下来，加入间隔重复闪卡队列。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">日语词句 *</label>
              <Input
                value={plainJa}
                onChange={(e) => setPlainJa(e.target.value)}
                placeholder="例如：なるほどね"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">平假名读音（可选）</label>
              <Input
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                placeholder="例如：なるほどね"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">中文释义 *</label>
              <Input
                value={zh}
                onChange={(e) => setZh(e.target.value)}
                placeholder="例如：原来如此呀"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">使用语气</label>
              <Select
                value={register}
                onValueChange={(v) => setRegister(v as '礼貌' | '简体' | '通用')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="通用">通用</SelectItem>
                  <SelectItem value="礼貌">礼貌体</SelectItem>
                  <SelectItem value="简体">朋友简体</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">罗马音（可选）</label>
            <Input
              value={romaji}
              onChange={(e) => setRomaji(e.target.value)}
              placeholder="例如：naruhodo ne"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">对话例句（可选）</label>
            <Textarea
              value={exampleJa}
              onChange={(e) => setExampleJa(e.target.value)}
              placeholder="例如：なるほどね、そういう意味か！"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">例句翻译（可选）</label>
            <Input
              value={exampleZh}
              onChange={(e) => setExampleZh(e.target.value)}
              placeholder="例如：原来如此，是那个意思呀！"
            />
          </div>

          {formError && <p className="text-xs text-destructive">{formError}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">保存词句</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
