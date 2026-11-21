import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  AudioWaveform,
  BookA,
  Bookmark,
  CheckCircle2,
  Globe,
  Languages,
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
import { PitchAccentChart } from '@/components/common/PitchAccentChart'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { useLearning } from '@/context/LearningContext'
import { getSubtopicLabel, TOPIC_MAP } from '@/data/topics'
import type { AppRoute } from '@/hooks/useHashRoute'
import {
  searchOnlineDictionary,
  type OnlineDictionaryResult,
  type OnlineDictionaryWord,
} from '@/services/dictionary/dictionaryService'
import {
  extractVerifiedPitchPatterns,
  findLocalVerifiedPitchForWord,
} from '@/services/pitch/pitchService'
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

interface DictionaryPageProps {
  initialQuery?: string
  navigate?: (route: AppRoute, param?: string) => void
}

export function DictionaryPage({ initialQuery, navigate }: DictionaryPageProps) {
  const {
    state,
    allVocab,
    toggleVocabBookmark,
    saveDictionaryVocab,
  } = useLearning()

  const decodedInitial = initialQuery ? decodeURIComponent(initialQuery) : ''
  const [query, setQuery] = useState(decodedInitial)
  const [submittedQuery, setSubmittedQuery] = useState('')

  useEffect(() => {
    if (initialQuery) {
      setQuery(decodeURIComponent(initialQuery))
    }
  }, [initialQuery])
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
    const existing = findExistingVocab(word)
    const zhSummary =
      word.zhDefinitions.length > 0
        ? word.zhDefinitions.slice(0, 3).join('；')
        : existing?.zh ||
          word.senses
            .slice(0, 2)
            .map((s) => s.glosses.slice(0, 3).join(' / '))
            .join('；')

    // Prefer real Japanese-Chinese example from Wiktionary; otherwise real Tatoeba sentence
    const wiktEx = word.zhExamples[0]
    const matchingTatoeba = onlineResult.sentences.find(
      (s) => s.content.includes(word.kanji) || (word.kana && s.content.includes(word.kana)),
    )

    await saveDictionaryVocab(
      {
        plainJa: word.kanji,
        reading: word.kana || word.kanji,
        segments: word.segments,
        zh: zhSummary,
        partOfSpeech: allPos,
        exampleJa: wiktEx?.ja ?? matchingTatoeba?.content,
        exampleZh: wiktEx?.zh ?? matchingTatoeba?.translation,
        sourceUrl: word.zhSourceUrl ?? word.sourceUrl,
        license: word.zhSourceUrl
          ? '中文维基词典 (CC BY-SA 4.0) / EDRDG JMdict (CC BY-SA 4.0)'
          : `${word.sourceName} (${word.license})`,
      },
      options,
    )
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookA className="size-6 text-primary" />
            日语智能词典
          </h1>
          <p className="text-sm text-muted-foreground">
            支持日语、假名、罗马音与中文查词，查看读音、词性、中文释义与真实例句，随时收藏或加入闪卡复习。
          </p>
        </div>

        {navigate && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                navigate('pitch', query.trim() ? encodeURIComponent(query.trim()) : undefined)
              }
            >
              <AudioWaveform className="size-4 text-primary" />
              音调词典
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                navigate('conjugation', query.trim() ? encodeURIComponent(query.trim()) : undefined)
              }
            >
              <Languages className="size-4 text-primary" />
              动词活用查询器
            </Button>
          </div>
        )}
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
          description="输入日语、假名或中文即可查词；查到的生词可以一键收藏或加入闪卡复习，学习记录自动同步。"
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
                  const verifiedPitch = findLocalVerifiedPitchForWord(item.plainJa, item.reading)

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
                          {verifiedPitch && (
                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              <PitchAccentChart pattern={verifiedPitch} size="sm" />
                              {navigate && (
                                <button
                                  type="button"
                                  onClick={() => navigate('pitch', encodeURIComponent(item.plainJa))}
                                  className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                                >
                                  音调曲线 →
                                </button>
                              )}
                            </div>
                          )}
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
                              ? '复习状态：已熟练'
                              : isDue
                                ? '复习状态：今日待复习'
                                : `下次复习：${rec.nextReviewDate}`
                            : '复习状态：待复习'}
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

          {/* Section 2: Online Real Dictionary (Wiktionary ZH + JMdict) */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                <Globe className="size-4 text-primary" />
                在线词典结果
                {!isSearchingOnline && submittedQuery && (
                  <Badge variant="outline">{onlineResult.words.length}</Badge>
                )}
              </h2>
              <span className="text-xs text-muted-foreground">
                优先展示中文释义，附真实词典例句
              </span>
            </div>

            {isSearchingOnline ? (
              <Card className="p-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                正在查询词典与例句...
              </Card>
            ) : onlineError ? (
              <Card className="p-4 border-warning/40 bg-warning/5 flex items-center gap-2 text-xs text-foreground">
                <AlertCircle className="size-4 text-warning shrink-0" />
                <span>{onlineError}</span>
              </Card>
            ) : onlineResult.words.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
                在线词典暂未查到「{submittedQuery || query.trim()}」的词条（在线查询主要支持日语、假名、罗马音与英文，中文查词请参考上方内置词库）。
              </p>
            ) : (
              <div className="space-y-3">
                {onlineResult.words.map((word) => {
                  const existing = findExistingVocab(word)
                  const isBookmarked = existing ? state.bookmarkedVocab.includes(existing.id) : false
                  const inSrs = Boolean(existing)
                  const pitchPatterns = extractVerifiedPitchPatterns(word)
                  const primaryPitch = pitchPatterns[0] ?? null

                  return (
                    <Card key={word.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
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
                                已加入词库
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>读音：{word.kana}</span>
                            {primaryPitch && (
                              <PitchAccentChart pattern={primaryPitch} size="sm" />
                            )}
                          </div>
                        </div>

                        {/* Actions: Audio, Pitch, Conjugation (if verb), Bookmark, Add to SRS */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <SpeechButton id={`dict-on-${word.id}`} text={word.kanji} />
                          {navigate && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 text-xs"
                              onClick={() => navigate('pitch', encodeURIComponent(word.kanji))}
                            >
                              <AudioWaveform className="size-3.5 text-primary" />
                              {primaryPitch ? '音调曲线' : '查音调'}
                            </Button>
                          )}
                          {word.verbClass && navigate && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 text-xs"
                              onClick={() =>
                                navigate('conjugation', encodeURIComponent(word.kanji))
                              }
                            >
                              <Languages className="size-3.5 text-primary" />
                              查看活用
                            </Button>
                          )}
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
                            {inSrs ? '今日复习' : '加入复习'}
                          </Button>
                        </div>
                      </div>

                      {/* Default Chinese Definitions (Wiktionary CC BY-SA 4.0 / Local Verified) */}
                      {(() => {
                        const allPos = Array.from(new Set(word.senses.flatMap((s) => s.pos)))
                        const primaryZhDefs =
                          word.zhDefinitions.length > 0
                            ? word.zhDefinitions
                            : existing?.zh
                              ? [existing.zh]
                              : []
                        const zhSourceLabel =
                          word.zhDefinitions.length > 0
                            ? '中文维基词典'
                            : existing?.zh
                              ? '内置词库'
                              : null

                        return (
                          <div className="space-y-3 border-t border-border/70 pt-3 text-sm">
                            {allPos.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {allPos.slice(0, 4).map((p) => (
                                  <Badge key={p} variant="muted" className="text-[10px] py-0">
                                    {p}
                                  </Badge>
                                ))}
                                {zhSourceLabel && (
                                  <span className="text-[11px] text-muted-foreground ml-auto">
                                    {zhSourceLabel}
                                  </span>
                                )}
                              </div>
                            )}

                            {primaryZhDefs.length > 0 ? (
                              <>
                                <ol className="space-y-1.5">
                                  {primaryZhDefs.slice(0, 5).map((def, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2">
                                      <span className="text-xs font-semibold text-primary pt-0.5 shrink-0">
                                        {dIdx + 1}.
                                      </span>
                                      <span className="text-foreground leading-relaxed">{def}</span>
                                    </li>
                                  ))}
                                </ol>

                                {/* Real Japanese-Chinese examples from Wiktionary */}
                                {word.zhExamples.length > 0 && (
                                  <div className="space-y-1.5 pt-1">
                                    {word.zhExamples.slice(0, 2).map((ex, eIdx) => (
                                      <div
                                        key={eIdx}
                                        className="rounded-lg bg-background border border-border/70 px-3 py-2 flex items-start justify-between gap-2 text-xs"
                                      >
                                        <div className="space-y-0.5 min-w-0">
                                          <p className="font-medium text-foreground">{ex.ja}</p>
                                          <p className="text-muted-foreground">{ex.zh}</p>
                                        </div>
                                        <SpeechButton
                                          id={`dict-wikt-ex-${word.id}-${eIdx}`}
                                          text={ex.ja}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Collapsible JMdict English reference */}
                                <details className="pt-1 text-xs text-muted-foreground">
                                  <summary className="cursor-pointer select-none hover:text-foreground">
                                    查看英文对照释义
                                  </summary>
                                  <ol className="mt-2 space-y-1 pl-4 list-decimal">
                                    {word.senses.slice(0, 4).map((sense, sIdx) => (
                                      <li key={sIdx}>{sense.glosses.join('; ')}</li>
                                    ))}
                                  </ol>
                                </details>
                              </>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[11px] text-muted-foreground">
                                  暂无中文释义，以下为英文词典参考：
                                </p>
                                <ol className="space-y-1.5">
                                  {word.senses.slice(0, 4).map((sense, sIdx) => (
                                    <li key={sIdx} className="space-y-0.5">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-xs font-semibold text-primary">
                                          {sIdx + 1}.
                                        </span>
                                        {sense.misc && (
                                          <Badge variant="outline" className="text-[10px] py-0">
                                            {sense.misc}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-foreground/90 pl-4">
                                        {sense.glosses.join('; ')}
                                      </p>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        )
                      })()}
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
                <h2 className="font-display text-base font-bold">常见例句</h2>
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
