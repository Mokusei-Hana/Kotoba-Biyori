import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  BookA,
  Bookmark,
  CheckCircle2,
  Globe,
  Layers,
  Loader2,
  PlusCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FuriganaText } from '@/components/common/FuriganaText'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { useLearning } from '@/context/LearningContext'
import { getSubtopicLabel, TOPIC_MAP } from '@/data/topics'
import {
  searchOnlineDictionary,
  type OnlineDictionaryResult,
  type OnlineDictionaryWord,
} from '@/services/dictionary/dictionaryService'
import { cn, getTodayKey } from '@/lib/utils'

const QUICK_SEARCH_EXAMPLES = [
  '推し',
  'チェキ',
  '特典会',
  'ありがとう',
  '食べる',
  '门票',
  '生诞祭',
  '握手会',
]

export function DictionaryPage() {
  const {
    state,
    allVocab,
    toggleVocabBookmark,
    saveDictionaryVocab,
  } = useLearning()

  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [onlineResult, setOnlineResult] = useState<OnlineDictionaryResult>({
    words: [],
    sentences: [],
  })
  const [isSearchingOnline, setIsSearchingOnline] = useState(false)
  const [onlineError, setOnlineError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const today = getTodayKey()

  // Instant local search across all verified built-in + custom vocab (supports JA / Kana / Romaji / Chinese)
  const localMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allVocab
      .filter(
        (item) =>
          item.plainJa.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.romaji.toLowerCase().includes(q) ||
          item.zh.toLowerCase().includes(q),
      )
      .slice(0, 20)
  }, [allVocab, query])

  const runOnlineSearch = async (rawQuery: string) => {
    const q = rawQuery.trim()
    setSubmittedQuery(q)
    if (!q) {
      setOnlineResult({ words: [], sentences: [] })
      setOnlineError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsSearchingOnline(true)
    setOnlineError(null)
    try {
      const res = await searchOnlineDictionary(q, controller.signal)
      if (!controller.signal.aborted) {
        setOnlineResult(res)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setOnlineError(
        err instanceof Error
          ? `${err.message}（本地已核验词库仍可离线检索）`
          : '在线词典暂时不可用，本地已核验词库仍可离线检索。',
      )
      setOnlineResult({ words: [], sentences: [] })
    } finally {
      if (!controller.signal.aborted) {
        setIsSearchingOnline(false)
      }
    }
  }

  // Debounced live online search
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      abortRef.current?.abort()
      setSubmittedQuery('')
      setOnlineResult({ words: [], sentences: [] })
      setOnlineError(null)
      setIsSearchingOnline(false)
      return
    }
    const timer = window.setTimeout(() => {
      void runOnlineSearch(q)
    }, 380)
    return () => window.clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void runOnlineSearch(query)
  }

  const findExistingVocab = (word: OnlineDictionaryWord) => {
    return allVocab.find((v) => v.plainJa === word.kanji && v.reading === word.kana)
  }

  const handleSaveOnlineWord = async (
    word: OnlineDictionaryWord,
    options: { bookmark?: boolean; addToSrs?: boolean },
  ) => {
    const allPos = Array.from(new Set(word.senses.flatMap((s) => s.pos)))
    const glossSummary = word.senses
      .slice(0, 2)
      .map((s) => s.glosses.slice(0, 3).join(' / '))
      .join('；')

    // Attach a matching real Tatoeba sentence if one contains this word
    const matchingSentence = onlineResult.sentences.find(
      (s) => s.content.includes(word.kanji) || (word.kana && s.content.includes(word.kana)),
    )

    await saveDictionaryVocab(
      {
        plainJa: word.kanji,
        reading: word.kana || word.kanji,
        segments: word.segments,
        zh: glossSummary,
        partOfSpeech: allPos,
        exampleJa: matchingSentence?.content,
        exampleZh: matchingSentence?.translation,
        sourceUrl: word.sourceUrl,
        license: `${word.sourceName} (${word.license})`,
      },
      options,
    )
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookA className="size-6 text-primary" />
          日语智能词典
        </h1>
        <p className="text-sm text-muted-foreground">
          支持日语汉字、假名、罗马音与中文检索；本地已核验词库实时匹配，联动 JMdict 与 Tatoeba 真实词条与例句，一键收藏或加入 SRS 复习。
        </p>
      </div>

      {/* Search Form */}
      <Card className="p-4 sm:p-5 space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入日语、平假名、片假名、罗马音或中文，如：推し / おし / 门票..."
              className="pl-9 pr-9 h-10"
            />
            {query && (
              <button
                type="button"
                aria-label="清空搜索"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={!query.trim() || isSearchingOnline}>
            {isSearchingOnline ? <Loader2 className="size-4 animate-spin" /> : '查询'}
          </Button>
        </form>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">试试查：</span>
          {QUICK_SEARCH_EXAMPLES.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => setQuery(word)}
              className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
            >
              {word}
            </button>
          ))}
        </div>
      </Card>

      {/* Initial Empty Hint */}
      {!hasQuery ? (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="输入任意词句开始查询"
          description="本地已核验词库支持中/日/假名/罗马音秒查；在线词典实时对接真实 JMdict 词条与 Tatoeba 语料例句，所有收藏与 SRS 记录自动同步至账号。"
        />
      ) : (
        <div className="space-y-6">
          {/* Section 1: Local Verified Vocab Matches */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                <Layers className="size-4 text-primary" />
                内置与自建词库匹配
                <Badge variant="secondary">{localMatches.length}</Badge>
              </h2>
              <span className="text-xs text-muted-foreground">支持中文 / 日语 / 假名 / 罗马音</span>
            </div>

            {localMatches.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
                本地词库中暂无匹配「{query.trim()}」的词条，可查看下方在线真实词典结果。
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {localMatches.map((item) => {
                  const isBookmarked = state.bookmarkedVocab.includes(item.id)
                  const rec = state.srsRecords[item.id]
                  const isDue = !rec || rec.nextReviewDate <= today
                  const subLabel = getSubtopicLabel(item.topic, item.subtopic)

                  return (
                    <Card key={item.id} className="p-4 flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-[11px]">
                              {TOPIC_MAP[item.topic]?.label}
                            </Badge>
                            {subLabel && (
                              <Badge variant="muted" className="text-[11px]">
                                {subLabel}
                              </Badge>
                            )}
                            {item.usageScope && (
                              <Badge variant="outline" className="text-[11px]">
                                {item.usageScope}
                              </Badge>
                            )}
                            {item.partOfSpeech?.slice(0, 2).map((pos) => (
                              <Badge key={pos} variant="outline" className="text-[11px]">
                                {pos}
                              </Badge>
                            ))}
                          </div>
                          <p className="font-display text-lg font-bold pt-0.5">
                            <FuriganaText
                              segments={item.segments}
                              showFurigana={state.preferences.showFurigana}
                            />
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.reading}
                            {item.romaji ? ` · ${item.romaji}` : ''}
                          </p>
                          <p className="text-sm text-foreground">{item.zh}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <SpeechButton id={`dict-local-${item.id}`} text={item.plainJa} />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="收藏词条"
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

                      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                        <span>
                          {rec
                            ? rec.lastRating === 'good' && rec.repetitions >= 2
                              ? 'SRS：已熟练'
                              : isDue
                                ? 'SRS：今日待复习'
                                : `SRS：下次复习 ${rec.nextReviewDate}`
                            : 'SRS：已在待复习队列中'}
                        </span>
                        {!isDue && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[11px] text-primary"
                            onClick={() =>
                              void saveDictionaryVocab(
                                {
                                  plainJa: item.plainJa,
                                  reading: item.reading,
                                  segments: item.segments,
                                  zh: item.zh,
                                },
                                { addToSrs: true },
                              )
                            }
                          >
                            重新加入今日复习
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          {/* Section 2: Online Real Dictionary (JMdict via Jotoba) */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                <Globe className="size-4 text-primary" />
                在线权威词典（EDRDG JMdict）
                {!isSearchingOnline && submittedQuery && (
                  <Badge variant="outline">{onlineResult.words.length}</Badge>
                )}
              </h2>
              <span className="text-xs text-muted-foreground">
                真实词典释义与词性 · 不含 AI 生成内容
              </span>
            </div>

            {isSearchingOnline ? (
              <Card className="p-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                正在检索 JMdict 词典与 Tatoeba 真实语料...
              </Card>
            ) : onlineError ? (
              <Card className="p-4 border-warning/40 bg-warning/5 flex items-center gap-2 text-xs text-foreground">
                <AlertCircle className="size-4 text-warning shrink-0" />
                <span>{onlineError}</span>
              </Card>
            ) : onlineResult.words.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
                在线 JMdict 词典未返回「{submittedQuery || query.trim()}」的词条（在线词典主要支持日语汉字、假名、罗马音与英文检索；中文关键词优先使用上方本地已核验词库）。
              </p>
            ) : (
              <div className="space-y-3">
                {onlineResult.words.map((word) => {
                  const existing = findExistingVocab(word)
                  const isBookmarked = existing ? state.bookmarkedVocab.includes(existing.id) : false
                  const inSrs = Boolean(existing)

                  return (
                    <Card key={word.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-xl font-bold">
                              <FuriganaText
                                segments={word.segments}
                                showFurigana={state.preferences.showFurigana}
                              />
                            </p>
                            {word.common && (
                              <Badge variant="success" className="text-[10px]">
                                常用词
                              </Badge>
                            )}
                            {inSrs && (
                              <Badge variant="secondary" className="text-[10px] gap-1">
                                <CheckCircle2 className="size-3" />
                                已在词库 / SRS
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>读音：{word.kana}</span>
                            {word.pitch && word.pitch.length > 0 && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[11px]">
                                音调：
                                {word.pitch.map((p, idx) => (
                                  <span
                                    key={idx}
                                    className={cn(
                                      p.high
                                        ? 'border-t border-primary text-foreground font-medium'
                                        : 'text-muted-foreground',
                                    )}
                                  >
                                    {p.part}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions: Audio, Bookmark, Add to SRS */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <SpeechButton id={`dict-on-${word.id}`} text={word.kanji} />
                          <Button
                            size="sm"
                            variant={isBookmarked ? 'secondary' : 'outline'}
                            className="h-8 gap-1 text-xs"
                            onClick={() => {
                              if (existing) {
                                void toggleVocabBookmark(existing.id)
                              } else {
                                void handleSaveOnlineWord(word, { bookmark: true })
                              }
                            }}
                          >
                            <Bookmark
                              className={cn('size-3.5', isBookmarked && 'fill-primary text-primary')}
                            />
                            {isBookmarked ? '已收藏' : '收藏'}
                          </Button>
                          <Button
                            size="sm"
                            variant={inSrs ? 'outline' : 'default'}
                            className="h-8 gap-1 text-xs"
                            onClick={() => void handleSaveOnlineWord(word, { addToSrs: true })}
                          >
                            <PlusCircle className="size-3.5" />
                            {inSrs ? '加入今日复习' : '加入 SRS'}
                          </Button>
                        </div>
                      </div>

                      {/* Real JMdict Senses & Parts of Speech */}
                      <ol className="space-y-2 border-t border-border/70 pt-3 text-sm">
                        {word.senses.slice(0, 4).map((sense, sIdx) => (
                          <li key={sIdx} className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-semibold text-primary">
                                {sIdx + 1}.
                              </span>
                              {sense.pos.map((p) => (
                                <Badge key={p} variant="muted" className="text-[10px] py-0">
                                  {p}
                                </Badge>
                              ))}
                              {sense.misc && (
                                <Badge variant="outline" className="text-[10px] py-0">
                                  {sense.misc}
                                </Badge>
                              )}
                            </div>
                            <p className="text-foreground/90 pl-4">{sense.glosses.join('; ')}</p>
                          </li>
                        ))}
                      </ol>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          {/* Section 3: Real Tatoeba Corpus Example Sentences */}
          {!isSearchingOnline && onlineResult.sentences.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold">
                  真实语料例句（Tatoeba）
                </h2>
                <Badge variant="outline">{onlineResult.sentences.length} 句</Badge>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {onlineResult.sentences.map((sent) => (
                  <Card key={sent.id} className="p-3.5 flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed">
                        <FuriganaText
                          segments={sent.segments}
                          showFurigana={state.preferences.showFurigana}
                        />
                      </p>
                      {sent.translation && (
                        <p className="text-xs text-muted-foreground">{sent.translation}</p>
                      )}
                    </div>
                    <SpeechButton id={`dict-sent-${sent.id}`} text={sent.content} />
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
