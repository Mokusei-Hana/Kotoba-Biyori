import { useMemo, useState } from 'react'
import { CheckCircle2, Circle, Lightbulb, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { useLearning } from '@/context/LearningContext'
import { GRAMMAR_PATTERNS } from '@/data/grammar'
import type { GrammarPattern } from '@/types/learning'
import { cn } from '@/lib/utils'

const CATEGORIES: ('全部' | GrammarPattern['category'])[] = [
  '全部',
  '表达意愿',
  '请求许可',
  '日常搭话',
  '连接转折',
  '礼貌与简体',
]

export function GrammarPage() {
  const { state, toggleGrammarMastered } = useLearning()
  const [category, setCategory] = useState<'全部' | GrammarPattern['category']>('全部')
  const [registerView, setRegisterView] = useState<'both' | 'polite' | 'casual'>('both')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return GRAMMAR_PATTERNS.filter((item) => {
      if (category !== '全部' && item.category !== category) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.nuance.toLowerCase().includes(q)
      )
    })
  }, [category, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">实用口语句型卡片</h1>
          <p className="text-sm text-muted-foreground">
            不背枯燥语法术语，聚焦聊天高频句型，并清晰对照「礼貌体」与「朋友简体」。
          </p>
        </div>

        <Badge variant="secondary" className="text-xs py-1 px-3">
          已掌握 {state.masteredGrammar.length} / {GRAMMAR_PATTERNS.length}
        </Badge>
      </div>

      {/* Controls: Category + Search + Register Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
            {(
              [
                { id: 'both', label: '对照' },
                { id: 'polite', label: '礼貌体' },
                { id: 'casual', label: '朋友简体' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRegisterView(opt.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
                  registerView === opt.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索句型、中文意思..."
          className="pl-9"
        />
      </div>

      {/* Grammar Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title="没有找到匹配的句型"
          description="试试清空搜索词或切换到「全部」分类。"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch('')
                setCategory('全部')
              }}
            >
              重置筛选
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const mastered = state.masteredGrammar.includes(item.id)
            return (
              <Card key={item.id} className="overflow-hidden scroll-card-item">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground">{item.formation}</span>
                      </div>
                      <CardTitle className="text-lg pt-1">
                        {item.title}
                        <span className="ml-2 font-sans text-sm font-normal text-primary">
                          — {item.meaning}
                        </span>
                      </CardTitle>
                    </div>

                    <Button
                      size="sm"
                      variant={mastered ? 'secondary' : 'outline'}
                      onClick={() => void toggleGrammarMastered(item.id)}
                    >
                      {mastered ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-success" />
                          已掌握
                        </>
                      ) : (
                        <>
                          <Circle className="size-3.5" />
                          标记掌握
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">{item.nuance}</p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2.5">
                    {item.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/80 bg-background p-3.5 space-y-2.5"
                      >
                        <div
                          className={cn(
                            'grid gap-3',
                            registerView === 'both' ? 'md:grid-cols-2' : 'grid-cols-1',
                          )}
                        >
                          {(registerView === 'both' || registerView === 'polite') && (
                            <div className="flex items-start justify-between gap-2 rounded-lg bg-card p-2.5 border border-border/60">
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  礼貌体（初识 / 店员）
                                </span>
                                <p className="text-sm font-medium text-foreground">{ex.politeJa}</p>
                                {state.preferences.showFurigana && (
                                  <p className="text-xs text-muted-foreground">{ex.politeReading}</p>
                                )}
                              </div>
                              <SpeechButton id={`gr-p-${item.id}-${idx}`} text={ex.politeJa} />
                            </div>
                          )}

                          {(registerView === 'both' || registerView === 'casual') && (
                            <div className="flex items-start justify-between gap-2 rounded-lg bg-secondary/35 p-2.5 border border-primary/15">
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-medium text-primary">
                                  朋友简体（タメ口）
                                </span>
                                <p className="text-sm font-medium text-foreground">{ex.casualJa}</p>
                                {state.preferences.showFurigana && (
                                  <p className="text-xs text-muted-foreground">{ex.casualReading}</p>
                                )}
                              </div>
                              <SpeechButton id={`gr-c-${item.id}-${idx}`} text={ex.casualJa} />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground px-1">译：{ex.zh}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-muted/60 px-3.5 py-2.5 text-xs text-muted-foreground">
                    <Lightbulb className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item.chatTip}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
