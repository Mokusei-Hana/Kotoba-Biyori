import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BookA,
  Bookmark,
  CheckCircle2,
  Languages,
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
import type { AppRoute } from '@/hooks/useHashRoute'
import {
  conjugateVerb,
  findCuratedVerb,
  inferVerbGroup,
  VERB_GROUP_META,
  type VerbGroup,
} from '@/services/conjugation/verbConjugator'
import {
  searchOnlineDictionary,
  type OnlineDictionarySentence,
  type OnlineDictionaryWord,
} from '@/services/dictionary/dictionaryService'
import { cn } from '@/lib/utils'

interface ConjugationPageProps {
  initialVerb?: string
  navigate: (route: AppRoute, param?: string) => void
}

const EXAMPLE_GROUPS: { label: string; verbs: string[] }[] = [
  { label: '五段', verbs: ['行く', '買う', '話す', '推す', '飲む'] },
  { label: '一段', verbs: ['食べる', '見る', '降りる'] },
  { label: '例外 / 特殊', verbs: ['帰る', '入る', 'ある', 'おっしゃる', 'くれる'] },
  { label: '不规则', verbs: ['する', '来る', '応援する'] },
]

export function ConjugationPage({ initialVerb, navigate }: ConjugationPageProps) {
  const { state, allVocab, toggleVocabBookmark, saveDictionaryVocab } = useLearning()

  const decodedInitial = initialVerb ? decodeURIComponent(initialVerb) : '食べる'
  const [input, setInput] = useState(decodedInitial)
  const [activeQuery, setActiveQuery] = useState(decodedInitial)
  const [manualGroup, setManualGroup] = useState<VerbGroup | null>(null)

  const [onlineWord, setOnlineWord] = useState<OnlineDictionaryWord | null>(null)
  const [sentences, setSentences] = useState<OnlineDictionarySentence[]>([])
  const [isLoadingDict, setIsLoadingDict] = useState(false)
  const [dictError, setDictError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (initialVerb) {
      const decoded = decodeURIComponent(initialVerb)
      setInput(decoded)
      setActiveQuery(decoded)
      setManualGroup(null)
    }
  }, [initialVerb])

  // Fetch authoritative JMdict verb class, reading, glosses & Tatoeba sentences
  useEffect(() => {
    const q = activeQuery.trim()
    if (!q) {
      setOnlineWord(null)
      setSentences([])
      setDictError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoadingDict(true)
    setDictError(null)

    searchOnlineDictionary(q, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        // Prefer exact kanji/kana verb match with JMdict verbClass
        const exactVerb =
          res.words.find((w) => w.verbClass && (w.kanji === q || w.kana === q)) ??
          res.words.find((w) => w.verbClass) ??
          res.words.find((w) => w.kanji === q || w.kana === q) ??
          null
        setOnlineWord(exactVerb)
        setSentences(res.sentences.slice(0, 4))
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setOnlineWord(null)
        setSentences([])
        setDictError('在线词典暂不可用，当前已使用本地规则计算活用。')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDict(false)
        }
      })

    return () => controller.abort()
  }, [activeQuery])

  const curated = useMemo(() => findCuratedVerb(activeQuery), [activeQuery])
  const localVocabMatch = useMemo(
    () =>
      allVocab.find(
        (v) =>
          v.plainJa === activeQuery.trim() ||
          v.reading === activeQuery.trim() ||
          (onlineWord && v.plainJa === onlineWord.kanji),
      ),
    [allVocab, activeQuery, onlineWord],
  )

  // Determine canonical kanji, kana, verb group, and provenance source
  const resolved = useMemo(() => {
    const q = activeQuery.trim()
    if (!q) return null

    const kanji = curated?.kanji ?? onlineWord?.kanji ?? q
    const kana = curated?.kana ?? onlineWord?.kana ?? q
    const detectedGroup =
      manualGroup ??
      curated?.group ??
      onlineWord?.verbClass ??
      inferVerbGroup(kanji, kana)

    if (!detectedGroup) {
      return {
        valid: false as const,
        kanji,
        kana,
      }
    }

    const sourceLabel = manualGroup
      ? '手动切换词类预览'
      : curated
        ? '常用动词库'
        : onlineWord?.verbClass
          ? '词典已核验'
          : '规则自动识别'

    const zhMeaning =
      curated?.zh ??
      localVocabMatch?.zh ??
      (onlineWord?.zhDefinitions.length
        ? onlineWord.zhDefinitions.slice(0, 3).join('；')
        : onlineWord
          ? onlineWord.senses
              .slice(0, 2)
              .map((s) => s.glosses.slice(0, 3).join(' / '))
              .join('；')
          : undefined)

    const { rows, specialNotes } = conjugateVerb(kanji, kana, detectedGroup)
    const allSpecialNotes = Array.from(
      new Set([...(curated?.exceptionNote ? [curated.exceptionNote] : []), ...specialNotes]),
    )

    return {
      valid: true as const,
      kanji,
      kana,
      group: detectedGroup,
      sourceLabel,
      zhMeaning,
      rows,
      specialNotes: allSpecialNotes,
    }
  }, [activeQuery, curated, onlineWord, localVocabMatch, manualGroup])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setManualGroup(null)
    setActiveQuery(input.trim())
  }

  const handleQuickSelect = (verb: string) => {
    setInput(verb)
    setManualGroup(null)
    setActiveQuery(verb)
  }

  const existingVocab = useMemo(() => {
    if (!resolved || !resolved.valid) return undefined
    return allVocab.find(
      (v) => v.plainJa === resolved.kanji && (v.reading === resolved.kana || !resolved.kana),
    )
  }, [allVocab, resolved])

  const isBookmarked = existingVocab ? state.bookmarkedVocab.includes(existingVocab.id) : false

  const handleSaveVerb = async (options: { bookmark?: boolean; addToSrs?: boolean }) => {
    if (!resolved || !resolved.valid) return
    if (existingVocab && options.bookmark && !options.addToSrs) {
      await toggleVocabBookmark(existingVocab.id)
      return
    }
    const segs =
      onlineWord?.segments ??
      (resolved.kanji !== resolved.kana
        ? [{ text: resolved.kanji, reading: resolved.kana }]
        : [{ text: resolved.kanji }])

    await saveDictionaryVocab(
      {
        plainJa: resolved.kanji,
        reading: resolved.kana,
        segments: segs,
        zh: resolved.zhMeaning ?? `${VERB_GROUP_META[resolved.group].label}`,
        partOfSpeech: [VERB_GROUP_META[resolved.group].label],
        exampleJa: sentences[0]?.content,
        exampleZh: sentences[0]?.translation,
        sourceUrl: onlineWord?.sourceUrl,
        license: onlineWord ? 'EDRDG JMdict (CC BY-SA 4.0)' : undefined,
      },
      options,
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <Languages className="size-6 text-primary" />
          日语动词活用查询器
        </h1>
        <p className="text-sm text-muted-foreground">
          输入日语动词（汉字或假名），自动识别五段、一段、不规则与例外动词，一站查看 13 种常用变形、读音与用法。
        </p>
      </div>

      {/* Search & Quick Examples */}
      <Card className="p-4 sm:p-5 space-y-3.5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入日语动词原形，如：食べる / 行く / 帰る / 来る / 応援する..."
              className="pl-9 pr-9 h-10"
            />
            {input && (
              <button
                type="button"
                aria-label="清空输入"
                onClick={() => setInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={!input.trim()}>
            查询活用
          </Button>
        </form>

        <div className="space-y-1.5">
          {EXAMPLE_GROUPS.map((g) => (
            <div key={g.label} className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-medium text-muted-foreground w-16 shrink-0">
                {g.label}：
              </span>
              {g.verbs.map((v) => {
                const isActive = activeQuery.trim() === v
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleQuickSelect(v)}
                    className={cn(
                      'rounded-full px-2.5 py-0.5 transition-colors cursor-pointer',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                    )}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Result Body */}
      {!resolved ? (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="输入动词开始查询活用"
          description="支持五段动词、一段动词、サ变/カ变不规则动词，以及 行く、帰る、ある、おっしゃる 等常见例外。"
        />
      ) : !resolved.valid ? (
        <Card className="p-6 text-center space-y-2">
          <p className="font-display text-base font-bold">
            未能将「{resolved.kanji}」识别为日语动词原形
          </p>
          <p className="text-xs text-muted-foreground">
            请输入动词的辞书形（以 う・く・ぐ・す・つ・ぬ・ぶ・む・る 或 する 结尾），例如「食べる」「行く」「勉強する」。
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Verb Overview Header Card */}
          <Card className="p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">{VERB_GROUP_META[resolved.group].label}</Badge>
                  <Badge variant="outline">{resolved.sourceLabel}</Badge>
                  {isLoadingDict && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Loader2 className="size-3 animate-spin" />
                      同步词典释义与例句...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-baseline gap-2.5 pt-0.5">
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    <FuriganaText
                      segments={
                        onlineWord?.segments ??
                        (resolved.kanji !== resolved.kana
                          ? [{ text: resolved.kanji, reading: resolved.kana }]
                          : [{ text: resolved.kanji }])
                      }
                      showFurigana={state.preferences.showFurigana}
                    />
                  </h2>
                  <span className="text-sm text-muted-foreground">（{resolved.kana}）</span>
                </div>

                {resolved.zhMeaning ? (
                  <p className="text-sm text-foreground/90">{resolved.zhMeaning}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    暂无中文释义记录（可点击右侧「在词典查看」检索详细释义）。
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {VERB_GROUP_META[resolved.group].summary}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <SpeechButton id={`conj-head-${resolved.kanji}`} text={resolved.kanji} />
                <Button
                  size="sm"
                  variant={isBookmarked ? 'secondary' : 'outline'}
                  className="h-8 gap-1 text-xs"
                  onClick={() => void handleSaveVerb({ bookmark: true })}
                >
                  <Bookmark
                    className={cn('size-3.5', isBookmarked && 'fill-primary text-primary')}
                  />
                  {isBookmarked ? '已收藏' : '收藏'}
                </Button>
                <Button
                  size="sm"
                  variant={existingVocab ? 'outline' : 'default'}
                  className="h-8 gap-1 text-xs"
                  onClick={() => void handleSaveVerb({ addToSrs: true })}
                >
                  {existingVocab ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      今日复习
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-3.5" />
                      加入复习
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 text-xs text-primary"
                  onClick={() => navigate('dictionary', encodeURIComponent(resolved.kanji))}
                >
                  <BookA className="size-3.5" />
                  词典详情
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>

            {/* Special / Exception Notes */}
            {resolved.specialNotes.length > 0 && (
              <div className="rounded-xl border border-warning/35 bg-warning/8 px-3.5 py-2.5 text-xs space-y-1">
                <p className="font-semibold text-warning flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 shrink-0" />
                  特殊变形 / 例外说明
                </p>
                {resolved.specialNotes.map((note, idx) => (
                  <p key={idx} className="text-foreground/90 pl-5">
                    {note}
                  </p>
                ))}
              </div>
            )}

            {/* Manual group override for ru-verbs if user wants to compare */}
            {resolved.kana.endsWith('る') && resolved.group !== 'kuru' && resolved.group !== 'suru' && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span>对照切换（る尾动词）：</span>
                <button
                  type="button"
                  onClick={() => setManualGroup('godan')}
                  className={cn(
                    'rounded-md px-2 py-0.5 cursor-pointer transition-colors',
                    resolved.group === 'godan'
                      ? 'bg-secondary text-secondary-foreground font-medium'
                      : 'bg-muted hover:bg-secondary/60',
                  )}
                >
                  按五段查看
                </button>
                <button
                  type="button"
                  onClick={() => setManualGroup('ichidan')}
                  className={cn(
                    'rounded-md px-2 py-0.5 cursor-pointer transition-colors',
                    resolved.group === 'ichidan'
                      ? 'bg-secondary text-secondary-foreground font-medium'
                      : 'bg-muted hover:bg-secondary/60',
                  )}
                >
                  按一段查看
                </button>
                {manualGroup && (
                  <button
                    type="button"
                    onClick={() => setManualGroup(null)}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    恢复自动识别
                  </button>
                )}
              </div>
            )}
          </Card>

          {dictError && (
            <p className="text-xs text-muted-foreground px-1">{dictError}</p>
          )}

          {/* 13 Conjugation Forms Grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">
                完整活用一览（{resolved.rows.length} 种形态）
              </h3>
              <span className="text-xs text-muted-foreground">点击喇叭可听每种活用发音</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resolved.rows.map((row) => (
                <Card
                  key={row.key}
                  className={cn(
                    'p-4 flex flex-col justify-between gap-2.5',
                    row.isSpecial && 'border-warning/40 bg-warning/5',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[11px]">
                          {row.name}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{row.jpName}</span>
                        {row.isSpecial && (
                          <Badge variant="warning" className="text-[10px] py-0">
                            特殊
                          </Badge>
                        )}
                      </div>
                      <p className="font-display text-xl font-bold text-foreground pt-0.5">
                        {row.form}
                      </p>
                      <p className="text-xs text-muted-foreground">{row.reading}</p>
                    </div>
                    <SpeechButton id={`conj-${resolved.kanji}-${row.key}`} text={row.form} />
                  </div>

                  <div className="space-y-1 border-t border-border/60 pt-2 text-xs">
                    <p className="font-medium text-primary">{row.rule}</p>
                    <p className="text-muted-foreground">{row.note}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Real Examples (Wiktionary Chinese-Japanese + Tatoeba) */}
          {((onlineWord?.zhExamples.length ?? 0) > 0 || sentences.length > 0) && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold">常见例句</h3>
                <Badge variant="outline">
                  {(onlineWord?.zhExamples.length ?? 0) + sentences.length} 句
                </Badge>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(onlineWord?.zhExamples ?? []).slice(0, 3).map((ex, idx) => (
                  <Card key={`wikt-${idx}`} className="p-3.5 flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed">{ex.ja}</p>
                      <p className="text-xs text-muted-foreground">{ex.zh}</p>
                    </div>
                    <SpeechButton id={`conj-wikt-${idx}`} text={ex.ja} />
                  </Card>
                ))}
                {sentences.map((sent) => (
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
                    <SpeechButton id={`conj-sent-${sent.id}`} text={sent.content} />
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
