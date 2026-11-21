import { useMemo } from 'react'
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Flame,
  Layers,
  MessageCircleHeart,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FuriganaText } from '@/components/common/FuriganaText'
import { SpeechButton } from '@/components/common/SpeechButton'
import { EmptyState } from '@/components/common/StateViews'
import { LearningStatsSection } from '@/features/dashboard/LearningStatsSection'
import { useLearning } from '@/context/LearningContext'
import { DIALOGUE_SCENARIOS } from '@/data/dialogues'
import { GRAMMAR_PATTERNS } from '@/data/grammar'
import { TOPIC_MAP } from '@/data/topics'
import type { AppRoute } from '@/hooks/useHashRoute'
import { addDaysToKey, cn, formatShortDate, getTodayKey } from '@/lib/utils'

interface DashboardPageProps {
  navigate: (route: AppRoute, param?: string) => void
}

function getTimeGreeting(): { ja: string; zh: string } {
  const hour = new Date().getHours()
  if (hour < 11) return { ja: 'おはようございます', zh: '早安，开启元气满满的日语清晨' }
  if (hour < 18) return { ja: 'こんにちは', zh: '午安，抽几分钟轻松开口练几句吧' }
  return { ja: 'こんばんは', zh: '晚上好，睡前温习几张口语卡片刚刚好' }
}

export function DashboardPage({ navigate }: DashboardPageProps) {
  const { state, allVocab, todayCount, streakDays, dueVocabCount, weakVocab } = useLearning()
  const greeting = useMemo(() => getTimeGreeting(), [])

  const goal = state.preferences.dailyGoal
  const goalPercent = Math.min(100, Math.round((todayCount / goal) * 100))

  const nextScenario = useMemo(() => {
    return (
      DIALOGUE_SCENARIOS.find((s) => !state.completedDialogues.includes(s.id)) ??
      DIALOGUE_SCENARIOS[0]
    )
  }, [state.completedDialogues])

  const last7Days = useMemo(() => {
    const today = getTodayKey()
    return Array.from({ length: 7 }, (_, i) => {
      const dateKey = addDaysToKey(today, -(6 - i))
      return {
        dateKey,
        label: formatShortDate(dateKey),
        count: state.dailyActivities[dateKey] ?? 0,
        isToday: dateKey === today,
      }
    })
  }, [state.dailyActivities])

  const masteredVocabCount = Object.values(state.srsRecords).filter(
    (r) => r.repetitions >= 2 && r.lastRating === 'good',
  ).length

  return (
    <div className="space-y-8">
      {/* Hero & Daily Check-in Card */}
      <section className="sakura-soft-glow rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Flame className="size-3 text-primary" />
                连续打卡 {streakDays} 天
              </Badge>
              {goalPercent >= 100 && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  今日目标已达成
                </Badge>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting.ja}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">{greeting.zh}</p>
          </div>

          {/* Daily Goal Progress Box */}
          <div className="w-full lg:w-80 rounded-xl border border-border/80 bg-background/85 p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground">今日学习活力</span>
              <span className="text-sm font-semibold">
                <span className="text-primary">{todayCount}</span> / {goal}
              </span>
            </div>
            <Progress value={goalPercent} />
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {last7Days.map((day) => {
                const active = day.count > 0
                return (
                  <div key={day.dateKey} className="flex flex-col items-center gap-1">
                    <div
                      title={`${day.dateKey}：活力 ${day.count}`}
                      className={cn(
                        'h-2.5 w-full rounded-full transition-colors',
                        active ? 'bg-primary' : 'bg-muted',
                        day.isToday && 'ring-1 ring-primary/50 ring-offset-1 ring-offset-background',
                      )}
                    />
                    <span className="text-[10px] text-muted-foreground">{day.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Learning Modules Entry */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">开始今日练习</h2>
          <span className="text-xs text-muted-foreground">
            推荐顺序：对话跟读 → 闪卡巩固 → 句型拆解
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Scenario Dialogue Card */}
          <Card className="flex flex-col justify-between hover:border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MessageCircleHeart className="size-4.5" />
                </span>
                <Badge variant="outline">
                  已完成 {state.completedDialogues.length}/{DIALOGUE_SCENARIOS.length}
                </Badge>
              </div>
              <CardTitle className="pt-2">场景对话演练</CardTitle>
              <CardDescription>
                推荐下一课：<span className="text-foreground font-medium">{nextScenario.title}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                className="w-full justify-between"
                onClick={() => navigate('dialogues', nextScenario.id)}
              >
                <span>进入对话跟读</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Flashcards Card */}
          <Card className="flex flex-col justify-between hover:border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Layers className="size-4.5" />
                </span>
                <Badge variant={dueVocabCount > 0 ? 'secondary' : 'success'}>
                  待复习 {dueVocabCount} 词
                </Badge>
              </div>
              <CardTitle className="pt-2">口语词汇闪卡</CardTitle>
              <CardDescription>
                共 {allVocab.length} 条高频表达，已熟练掌握 {masteredVocabCount} 条
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={() => navigate('flashcards')}
              >
                <span>开始间隔记忆</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Grammar Card */}
          <Card className="flex flex-col justify-between hover:border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <BookOpenText className="size-4.5" />
                </span>
                <Badge variant="outline">
                  已掌握 {state.masteredGrammar.length}/{GRAMMAR_PATTERNS.length}
                </Badge>
              </div>
              <CardTitle className="pt-2">实用口语句型</CardTitle>
              <CardDescription>
                聚焦日常聊天高频句型，对照礼貌体与朋友简体
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => navigate('grammar')}
              >
                <span>浏览句型卡片</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Statistics & Review Calendar */}
      <LearningStatsSection navigate={navigate} />

      {/* Weak Items Quick Review */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">薄弱词句回顾</h2>
            <p className="text-xs text-muted-foreground">
              闪卡中标记为「不认识」或「模糊」的表达会自动汇集在这里
            </p>
          </div>
          {weakVocab.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('flashcards')}>
              去闪卡复习
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>

        {weakVocab.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="暂无薄弱项"
            description="在「口语闪卡」中复习时，标记不熟练的词句会自动出现在这里，方便睡前快速回顾。"
            action={
              <Button size="sm" variant="secondary" onClick={() => navigate('flashcards')}>
                先刷几张闪卡
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weakVocab.slice(0, 6).map((item) => (
              <Card key={item.id} className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="muted" className="text-[11px]">
                      {TOPIC_MAP[item.topic]?.label}
                    </Badge>
                    <Badge variant="warning" className="text-[11px]">
                      {state.srsRecords[item.id]?.lastRating === 'again' ? '需重点记' : '略模糊'}
                    </Badge>
                  </div>
                  <p className="text-base font-medium">
                    <FuriganaText
                      segments={item.segments}
                      showFurigana={state.preferences.showFurigana}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.zh}</p>
                </div>
                <SpeechButton id={`weak-${item.id}`} text={item.plainJa} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
