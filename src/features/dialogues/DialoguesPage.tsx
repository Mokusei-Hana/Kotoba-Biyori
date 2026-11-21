import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  EyeOff,
  Lightbulb,
  Play,
  Square,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { FuriganaText } from '@/components/common/FuriganaText'
import { SpeechButton } from '@/components/common/SpeechButton'
import { useLearning } from '@/context/LearningContext'
import { DIALOGUE_SCENARIOS } from '@/data/dialogues'
import { TOPIC_MAP } from '@/data/topics'
import { speechService } from '@/services/speech'
import type { DialogueScenario, SpeechRate, TopicId } from '@/types/learning'
import { cn } from '@/lib/utils'

interface DialoguesPageProps {
  selectedId?: string
  onSelectScenario: (id?: string) => void
}

const DIALOGUE_TOPICS: ('all' | Exclude<TopicId, 'custom'>)[] = [
  'all',
  'intro',
  'greeting',
  'hobby',
  'dining',
  'konbini',
  'hangout',
]

export function DialoguesPage({ selectedId, onSelectScenario }: DialoguesPageProps) {
  const { state, toggleDialogueCompleted, updatePreferences, stopSpeech } = useLearning()
  const [topicFilter, setTopicFilter] = useState<'all' | Exclude<TopicId, 'custom'>>('all')

  const activeScenario = useMemo(
    () => DIALOGUE_SCENARIOS.find((s) => s.id === selectedId),
    [selectedId],
  )

  const filteredScenarios = useMemo(() => {
    if (topicFilter === 'all') return DIALOGUE_SCENARIOS
    return DIALOGUE_SCENARIOS.filter((s) => s.topic === topicFilter)
  }, [topicFilter])

  if (activeScenario) {
    return (
      <DialogueStudio
        scenario={activeScenario}
        isCompleted={state.completedDialogues.includes(activeScenario.id)}
        showFurigana={state.preferences.showFurigana}
        showRomaji={state.preferences.showRomaji}
        speechRate={state.preferences.speechRate}
        onToggleFurigana={(v) => void updatePreferences({ showFurigana: v })}
        onChangeRate={(r) => void updatePreferences({ speechRate: r })}
        onToggleCompleted={() => void toggleDialogueCompleted(activeScenario.id)}
        onBack={() => {
          stopSpeech()
          onSelectScenario(undefined)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight">场景对话演练</h1>
        <p className="text-sm text-muted-foreground">
          精选 6 个和日本人日常聊天的高频场景，支持振假名开关、语速调节与角色掩盖跟读。
        </p>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {DIALOGUE_TOPICS.map((t) => {
          const active = topicFilter === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTopicFilter(t)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
              )}
            >
              {t === 'all' ? '全部场景' : TOPIC_MAP[t].label}
            </button>
          )
        })}
      </div>

      {/* Scenario Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredScenarios.map((scenario) => {
          const done = state.completedDialogues.includes(scenario.id)
          return (
            <Card
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className="group cursor-pointer transition-all hover:border-primary/45 hover:bg-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary">{TOPIC_MAP[scenario.topic].label}</Badge>
                    <Badge variant="outline">{scenario.register}</Badge>
                  </div>
                  {done ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-3" />
                      已练完
                    </Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      约 {scenario.estimatedMinutes} 分钟
                    </span>
                  )}
                </div>
                <CardTitle className="pt-2 group-hover:text-primary transition-colors">
                  {scenario.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{scenario.jpTitle}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{scenario.subtitle}</CardDescription>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>共 {scenario.lines.length} 句对话</span>
                  <span className="font-medium text-primary">开始跟读 →</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface DialogueStudioProps {
  scenario: DialogueScenario
  isCompleted: boolean
  showFurigana: boolean
  showRomaji: boolean
  speechRate: SpeechRate
  onToggleFurigana: (value: boolean) => void
  onChangeRate: (rate: SpeechRate) => void
  onToggleCompleted: () => void
  onBack: () => void
}

function DialogueStudio({
  scenario,
  isCompleted,
  showFurigana,
  showRomaji,
  speechRate,
  onToggleFurigana,
  onChangeRate,
  onToggleCompleted,
  onBack,
}: DialogueStudioProps) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [rolePlayMask, setRolePlayMask] = useState(false)
  const [revealedIds, setRevealedIds] = useState<string[]>([])
  const [playingAllIndex, setPlayingAllIndex] = useState<number | null>(null)
  const cancelPlayAllRef = useRef(false)

  useEffect(() => {
    return () => {
      cancelPlayAllRef.current = true
      speechService.stop()
    }
  }, [scenario.id])

  const toggleRevealLine = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handlePlayAll = () => {
    if (playingAllIndex !== null) {
      cancelPlayAllRef.current = true
      speechService.stop()
      setPlayingAllIndex(null)
      return
    }

    cancelPlayAllRef.current = false
    const playStep = (index: number) => {
      if (cancelPlayAllRef.current || index >= scenario.lines.length) {
        setPlayingAllIndex(null)
        return
      }
      setPlayingAllIndex(index)
      speechService.speak(scenario.lines[index].plainJa, {
        rate: speechRate,
        onEnd: () => {
          if (!cancelPlayAllRef.current) {
            window.setTimeout(() => playStep(index + 1), 380)
          }
        },
        onError: () => {
          setPlayingAllIndex(null)
        },
      })
    }

    playStep(0)
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="size-4" />
          返回场景列表
        </Button>

        <Button
          variant={isCompleted ? 'secondary' : 'default'}
          size="sm"
          onClick={onToggleCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="size-4 text-success" />
              已完成本场景
            </>
          ) : (
            <>
              <Circle className="size-4" />
              标记为已完成
            </>
          )}
        </Button>
      </div>

      {/* Scenario Intro Header */}
      <Card className="sakura-soft-glow p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{TOPIC_MAP[scenario.topic].label}</Badge>
          <Badge variant="outline">{scenario.register}</Badge>
          <Badge variant="muted">{scenario.level}</Badge>
        </div>
        <div>
          <h1 className="font-display text-xl font-bold sm:text-2xl">{scenario.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{scenario.jpTitle}</p>
        </div>
        <p className="text-sm leading-relaxed text-foreground/85 rounded-xl bg-background/80 border border-border/70 px-4 py-3">
          {scenario.situation}
        </p>
      </Card>

      {/* Studio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <Switch checked={showFurigana} onCheckedChange={onToggleFurigana} />
            <span>振假名</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <Switch checked={showTranslation} onCheckedChange={setShowTranslation} />
            <span>中文译文</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <Switch
              checked={rolePlayMask}
              onCheckedChange={(checked) => {
                setRolePlayMask(checked)
                setRevealedIds([])
              }}
            />
            <span>角色掩盖（练「あなた」）</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            {([0.75, 1] as SpeechRate[]).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onChangeRate(rate)}
                className={cn(
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer',
                  speechRate === rate
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {rate === 0.75 ? '0.75x 慢' : '1.0x 正常'}
              </button>
            ))}
          </div>

          <Button size="sm" variant={playingAllIndex !== null ? 'default' : 'soft'} onClick={handlePlayAll}>
            {playingAllIndex !== null ? (
              <>
                <Square className="size-3.5 fill-current" />
                停止连读
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                整段连读
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Chat Conversation Lines */}
      <div className="space-y-3.5">
        {scenario.lines.map((line, index) => {
          const isUserRole = line.speaker === 'B'
          const isMasked = rolePlayMask && isUserRole && !revealedIds.includes(line.id)
          const isCurrentlyPlayingAll = playingAllIndex === index

          return (
            <div
              key={line.id}
              className={cn('flex flex-col', isUserRole ? 'items-end' : 'items-start')}
            >
              <div
                className={cn(
                  'w-full max-w-xl rounded-2xl border p-4 transition-all',
                  isUserRole
                    ? 'border-primary/25 bg-secondary/45'
                    : 'border-border bg-card',
                  isCurrentlyPlayingAll && 'ring-2 ring-primary/40 border-primary/50',
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium',
                        isUserRole
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {line.speakerName}
                    </span>
                    {rolePlayMask && isUserRole && (
                      <button
                        type="button"
                        onClick={() => toggleRevealLine(line.id)}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                      >
                        {isMasked ? (
                          <>
                            <Eye className="size-3" />
                            查看日语提示
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3" />
                            重新遮盖
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <SpeechButton
                    id={`dlg-line-${line.id}`}
                    text={line.plainJa}
                    rateOverride={speechRate}
                  />
                </div>

                {isMasked ? (
                  <button
                    type="button"
                    onClick={() => toggleRevealLine(line.id)}
                    className="w-full rounded-xl border border-dashed border-primary/35 bg-background/80 px-3.5 py-3 text-left transition-colors hover:bg-background cursor-pointer"
                  >
                    <p className="text-xs font-medium text-primary mb-1">试着用日语说出这句话：</p>
                    <p className="text-sm text-foreground">{line.zh}</p>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-base sm:text-[17px] font-medium text-foreground">
                      <FuriganaText segments={line.segments} showFurigana={showFurigana} />
                    </p>
                    {showRomaji && (
                      <p className="text-xs text-muted-foreground/85">{line.romaji}</p>
                    )}
                    {showTranslation && (
                      <p className="text-sm text-muted-foreground">{line.zh}</p>
                    )}
                    {line.note && (
                      <p className="mt-2 rounded-lg bg-background/80 px-3 py-2 text-xs text-muted-foreground border border-border/60">
                        <span className="font-medium text-primary">口语贴士：</span>
                        {line.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Separator />

      {/* Key Phrases & Cultural Tip */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold font-display">
            <Sparkles className="size-4 text-primary" />
            <span>本课核心表达</span>
          </div>
          <ul className="space-y-2.5">
            {scenario.keyPhrases.map((kp, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-xl bg-background border border-border/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{kp.ja}</p>
                  <p className="text-xs text-muted-foreground">
                    {kp.reading} · {kp.zh}
                  </p>
                </div>
                <SpeechButton id={`kp-${scenario.id}-${i}`} text={kp.ja} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold font-display">
            <Lightbulb className="size-4 text-primary" />
            <span>日本聊天小贴士</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{scenario.culturalTip}</p>
        </Card>
      </div>
    </div>
  )
}
