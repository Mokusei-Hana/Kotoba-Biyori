import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  AudioWaveform,
  BookA,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Info,
  Languages,
  Loader2,
  PlusCircle,
  Search,
  ShieldCheck,
  Volume2,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FuriganaText } from '@/components/common/FuriganaText'
import { PitchAccentChart } from '@/components/common/PitchAccentChart'
import { SpeechButton } from '@/components/common/SpeechButton'
import { useLearning } from '@/context/LearningContext'
import {
  HOMOPHONE_CONTRAST_GROUPS,
  VERIFIED_PITCH_ENTRIES,
} from '@/data/verifiedPitchDict'
import type { AppRoute } from '@/hooks/useHashRoute'
import {
  formatKanaWithDownstep,
  PITCH_TYPE_META,
  type PitchType,
} from '@/services/pitch/pitchParser'
import {
  convertVerifiedEntry,
  searchLocalVerifiedPitch,
  searchPitchDictionary,
  type PitchDictionaryItem,
  type PitchSearchResult,
} from '@/services/pitch/pitchService'
import { cn } from '@/lib/utils'

const QUICK_PITCH_EXAMPLES = [
  'はし',
  'あめ',
  '桜',
  '食べる',
  '男',
  '日本',
  'ありがとう',
  '推し',
]

const PITCH_TYPE_ORDER: PitchType[] = ['heiban', 'atamadaka', 'nakadaka', 'odaka']

interface PitchDictionaryPageProps {
  initialQuery?: string
  navigate: (route: AppRoute, param?: string) => void
}

export function PitchDictionaryPage({ initialQuery, navigate }: PitchDictionaryPageProps) {
  const { state, allVocab, toggleVocabBookmark, saveDictionaryVocab } = useLearning()

  const decodedInitial = initialQuery ? decodeURIComponent(initialQuery) : ''
  const [query, setQuery] = useState(decodedInitial)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [activeContrastId, setActiveContrastId] = useState(HOMOPHONE_CONTRAST_GROUPS[0].id)

  const [result, setResult] = useState<PitchSearchResult>({
    verifiedItems: [],
    unverifiedItems: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (initialQuery) {
      setQuery(decodeURIComponent(initialQuery))
    }
  }, [initialQuery])

  // Instant local verified matches while online dictionary loads
  const instantLocalItems = useMemo(() => searchLocalVerifiedPitch(query), [query])

  const runSearch = async (rawQuery: string) => {
    const q = rawQuery.trim()
    setSubmittedQuery(q)
    if (!q) {
      setResult({ verifiedItems: [], unverifiedItems: [] })
      setSearchError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsSearching(true)
    setSearchError(null)
    try {
      const res = await searchPitchDictionary(q, controller.signal)
      if (!controller.signal.aborted) {
        setResult(res)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      // Online failed: gracefully fall back to verified local items without fabricating anything
      const localOnly = searchLocalVerifiedPitch(q)
      setResult({ verifiedItems: localOnly, unverifiedItems: [] })
      setSearchError(
        err instanceof Error
          ? `${err.message}（当前展示内置已核验音调词库）`
          : '在线音调词典暂时不可用，当前仅展示内置已核验音调词库。',
      )
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false)
      }
    }
  }

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      abortRef.current?.abort()
      setSubmittedQuery('')
      setResult({ verifiedItems: [], unverifiedItems: [] })
      setSearchError(null)
      setIsSearching(false)
      return
    }
    const timer = window.setTimeout(() => {
      void runSearch(q)
    }, 360)
    return () => window.clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void runSearch(query)
  }

  // Active contrast group items for empty-query showcase
  const activeContrastGroup = useMemo(
    () =>
      HOMOPHONE_CONTRAST_GROUPS.find((g) => g.id === activeContrastId) ??
      HOMOPHONE_CONTRAST_GROUPS[0],
    [activeContrastId],
  )

  const contrastItems = useMemo(() => {
    return activeContrastGroup.entryIds
      .map((id) => VERIFIED_PITCH_ENTRIES.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map(convertVerifiedEntry)
  }, [activeContrastGroup])

  const findExistingVocab = (item: PitchDictionaryItem) =>
    allVocab.find((v) => v.plainJa === item.kanji && v.reading === item.kana)

  const handleSaveItem = async (
    item: PitchDictionaryItem,
    options: { bookmark?: boolean; addToSrs?: boolean },
  ) => {
    const summary = item.zhSummary || item.enFallback || item.kana
    await saveDictionaryVocab(
      {
        plainJa: item.kanji,
        reading: item.kana || item.kanji,
        segments: item.segments,
        zh: summary,
        partOfSpeech: item.pos,
        sourceUrl: item.sourceUrl,
        license: item.sourceName,
      },
      options,
    )
  }

  const hasQuery = query.trim().length > 0
  const displayVerifiedItems =
    isSearching && result.verifiedItems.length === 0 ? instantLocalItems : result.verifiedItems

  const renderPitchCard = (item: PitchDictionaryItem, compactContrast = false) => {
    const existing = findExistingVocab(item)
    const isBookmarked = existing ? state.bookmarkedVocab.includes(existing.id) : false
    const inSrs = Boolean(existing)

    return (
      <Card
        key={item.id}
        className={cn('p-4 sm:p-5 space-y-4', compactContrast && 'flex flex-col justify-between')}
      >
        {/* Top Word Header + Audio Controls */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xl font-bold tracking-tight">
                <FuriganaText
                  segments={item.segments}
                  showFurigana={state.preferences.showFurigana}
                />
              </p>
              {item.common && (
                <Badge variant="success" className="text-[10px]">
                  常用词
                </Badge>
              )}
              {inSrs && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <CheckCircle2 className="size-3" />
                  已在词库
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/85">{item.kana}</span>
              {item.pos.slice(0, 3).map((p) => (
                <Badge key={p} variant="muted" className="text-[10px] py-0">
                  {p}
                </Badge>
              ))}
            </div>

            {(item.zhSummary || item.enFallback) && (
              <p className="text-sm text-foreground/90 pt-0.5 leading-relaxed">
                {item.zhSummary || item.enFallback}
              </p>
            )}
          </div>

          {/* Audio Playback Controls: Normal / Slow 0.7x / With Particle が */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <SpeechButton
              id={`pitch-play-${item.id}`}
              text={item.kanji}
              label="朗读"
              variant="soft"
            />
            <SpeechButton
              id={`pitch-slow-${item.id}`}
              text={item.kanji}
              rateOverride={0.7}
              label="慢速"
              variant="outline"
            />
            {item.isNoun && (
              <SpeechButton
                id={`pitch-particle-${item.id}`}
                text={`${item.kanji}が`}
                label="带助词"
                variant="outline"
              />
            )}
          </div>
        </div>

        {/* Verified Pitch Accent Patterns & High/Low SVG Curves */}
        <div className="space-y-3">
          {item.patterns.map((pattern, pIdx) => {
            const meta = PITCH_TYPE_META[pattern.type]
            const kanaMarked = formatKanaWithDownstep(pattern)
            return (
              <div
                key={`${item.id}-pat-${pattern.accentNumber}-${pIdx}`}
                className="rounded-xl border border-border/80 bg-background/80 p-3.5 sm:p-4 space-y-3"
              >
                {/* Pitch Number + Type + Mora Count */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-sm font-bold leading-none',
                        meta.bgClass,
                        meta.colorClass,
                      )}
                    >
                      [{pattern.accentNumber}] {meta.zhLabel}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {kanaMarked}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      共 {pattern.morae.length} 拍
                      {pattern.downstepIndex !== null
                        ? ` · 第 ${pattern.downstepIndex + 1} 拍后下降`
                        : ' · 无下降核'}
                    </span>
                  </div>
                </div>

                {/* High-Low Pitch SVG Curve */}
                <PitchAccentChart
                  pattern={pattern}
                  size="lg"
                  showParticle={true}
                  particleLabel="が"
                />

                {/* Concise Pronunciation Rule */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.note && pIdx === 0 ? item.note : meta.shortRule}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions & Cross-Module Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('dictionary', encodeURIComponent(item.kanji))}
            >
              <BookA className="size-3.5 text-primary" />
              智能词典详情
            </Button>
            {item.verbClass && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('conjugation', encodeURIComponent(item.kanji))}
              >
                <Languages className="size-3.5 text-primary" />
                动词活用
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              size="sm"
              variant={isBookmarked ? 'secondary' : 'outline'}
              className="h-7 px-2.5 gap-1 text-xs"
              onClick={() => {
                if (existing) {
                  void toggleVocabBookmark(existing.id)
                } else {
                  void handleSaveItem(item, { bookmark: true })
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
              className="h-7 px-2.5 gap-1 text-xs"
              onClick={() => void handleSaveItem(item, { addToSrs: true })}
            >
              <PlusCircle className="size-3.5" />
              {inSrs ? '今日复习' : '加入复习'}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <AudioWaveform className="size-6 text-primary" />
            日语音调词典
          </h1>
          <p className="text-sm text-muted-foreground">
            查询标准东京音调类型与音调数字，通过高低音曲线与音频朗读直观掌握发音变化。仅展示可核验辞典数据，绝不由 AI 猜测音调。
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 shrink-0"
          onClick={() =>
            navigate('dictionary', query.trim() ? encodeURIComponent(query.trim()) : undefined)
          }
        >
          <BookA className="size-4 text-primary" />
          前往智能词典
        </Button>
      </div>

      {/* Search Card */}
      <Card className="p-4 sm:p-5 space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入日语汉字、假名、罗马音或中文查音调，如：はし / 橋 / 食べる / 桜..."
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
          <Button type="submit" disabled={!query.trim() || isSearching}>
            {isSearching ? <Loader2 className="size-4 animate-spin" /> : '查音调'}
          </Button>
        </form>

        {/* Quick Examples */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">常用示例：</span>
          {QUICK_PITCH_EXAMPLES.map((word) => (
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

      {/* Main Content: Empty Showcase vs Search Results */}
      {!hasQuery ? (
        <div className="space-y-6">
          {/* Interactive Homophone Contrast Showcase */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                  <Volume2 className="size-4 text-primary" />
                  经典同音异调对比
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  点击切换对比组，直接观察高低音曲线与「带助词朗读」的听感差别
                </p>
              </div>
            </div>

            {/* Group Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {HOMOPHONE_CONTRAST_GROUPS.map((group) => {
                const active = group.id === activeContrastGroup.id
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveContrastId(group.id)}
                    className={cn(
                      'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                      active
                        ? 'border-primary/40 bg-secondary text-secondary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                    )}
                  >
                    {group.title}
                  </button>
                )
              })}
            </div>

            <p className="text-xs text-muted-foreground">{activeContrastGroup.summary}</p>

            <div className="grid gap-3.5 lg:grid-cols-2">
              {contrastItems.map((item) => renderPitchCard(item, true))}
            </div>
          </section>

          {/* 4 Pitch Types Quick Guide */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                <Info className="size-4 text-primary" />
                东京标准音调 4 大类型速览
              </h2>
              <span className="text-xs text-muted-foreground">数字即「下降核」所在拍数</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PITCH_TYPE_ORDER.map((typeKey) => {
                const meta = PITCH_TYPE_META[typeKey]
                return (
                  <Card key={typeKey} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
                          meta.bgClass,
                          meta.colorClass,
                        )}
                      >
                        {meta.badgeText}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{meta.jaLabel}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{meta.detailRule}</p>
                    <p className="text-[11px] text-muted-foreground">示例：{meta.example}</p>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Status / Error Banner */}
          {searchError && (
            <Card className="p-3.5 border-warning/40 bg-warning/5 flex items-center gap-2 text-xs text-foreground">
              <AlertCircle className="size-4 text-warning shrink-0" />
              <span>{searchError}</span>
            </Card>
          )}

          {/* Section 1: Verified Pitch Entries */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                音调结果
                {!isSearching && (
                  <Badge variant="secondary">{displayVerifiedItems.length}</Badge>
                )}
              </h2>
            </div>

            {isSearching && displayVerifiedItems.length === 0 ? (
              <Card className="p-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                正在检索可核验音调词典...
              </Card>
            ) : displayVerifiedItems.length === 0 ? (
              <Card className="p-5 border-dashed space-y-2 text-center">
                <p className="text-sm font-medium text-foreground">
                  暂未检索到「{submittedQuery || query.trim()}」的可核验标准音调数据
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  为确保发音准确，Kotoba-Biyori 绝不由 AI 猜测或生成音调。建议尝试输入日语原型/假名，或前往权威辞典进一步核查。
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => navigate('dictionary', encodeURIComponent(query.trim()))}
                  >
                    <BookA className="size-3.5 text-primary" />
                    去智能词典查释义
                  </Button>
                  <a
                    href={`https://zh.wiktionary.org/wiki/${encodeURIComponent(query.trim())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    Wiktionary 查证
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </Card>
            ) : (
              <div className="space-y-3.5">
                {displayVerifiedItems.map((item) => renderPitchCard(item))}
              </div>
            )}
          </section>

          {/* Section 2: Matched dictionary words without verified pitch (Transparent, Zero AI Guessing) */}
          {!isSearching && result.unverifiedItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                  <Info className="size-4" />
                  词典已收录但暂缺标准音调标注
                  <Badge variant="outline">{result.unverifiedItems.length}</Badge>
                </h2>
                <span className="text-[11px] text-muted-foreground">
                  不进行 AI 猜测，仅展示基础读音与释义
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {result.unverifiedItems.map((item) => (
                  <Card key={item.id} className="p-4 space-y-2.5 bg-card/60">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-display text-base font-bold">
                          <FuriganaText
                            segments={item.segments}
                            showFurigana={state.preferences.showFurigana}
                          />
                        </p>
                        <p className="text-xs text-muted-foreground">{item.kana}</p>
                      </div>
                      <SpeechButton id={`pitch-unv-${item.id}`} text={item.kanji} />
                    </div>
                    {(item.zhSummary || item.enFallback) && (
                      <p className="text-xs text-foreground/85 line-clamp-2">
                        {item.zhSummary || item.enFallback}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                      <span>暂无可核验音调数据</span>
                      <button
                        type="button"
                        onClick={() => navigate('dictionary', encodeURIComponent(item.kanji))}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        在智能词典查看 →
                      </button>
                    </div>
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
