import { useMemo, useState } from 'react'
import {
  Award,
  BarChart3,
  BookMarked,
  CalendarDays,
  CheckCircle2,
  Flame,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLearning } from '@/context/LearningContext'
import { DIALOGUE_SCENARIOS } from '@/data/dialogues'
import { GRAMMAR_PATTERNS } from '@/data/grammar'
import type { AppRoute } from '@/hooks/useHashRoute'
import { addDaysToKey, cn, formatShortDate, getTodayKey } from '@/lib/utils'

interface LearningStatsSectionProps {
  navigate: (route: AppRoute, param?: string) => void
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function getWeekdayIndex(dateKey: string): number {
  return parseDateKey(dateKey).getDay()
}

function calculateLongestStreak(activities: Record<string, number>): number {
  const activeDates = Object.entries(activities)
    .filter(([, count]) => count > 0)
    .map(([date]) => date)
    .sort()

  if (activeDates.length === 0) return 0

  let longest = 1
  let current = 1
  for (let i = 1; i < activeDates.length; i += 1) {
    if (addDaysToKey(activeDates[i - 1], 1) === activeDates[i]) {
      current += 1
      if (current > longest) longest = current
    } else {
      current = 1
    }
  }
  return longest
}

function getHeatLevel(count: number, dailyGoal: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  const ratio = count / Math.max(1, dailyGoal)
  if (ratio < 0.35) return 1
  if (ratio < 0.7) return 2
  if (ratio < 1) return 3
  return 4
}

const HEAT_CELL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-muted/80 hover:bg-muted',
  1: 'bg-primary/20 hover:bg-primary/30',
  2: 'bg-primary/45 hover:bg-primary/55',
  3: 'bg-primary/70 hover:bg-primary/80',
  4: 'bg-primary hover:bg-primary/90',
}

export function LearningStatsSection({ navigate }: LearningStatsSectionProps) {
  const { state, allVocab, streakDays, dueVocabCount } = useLearning()
  const today = getTodayKey()
  const dailyGoal = state.preferences.dailyGoal
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [trendMode, setTrendMode] = useState<'history' | 'forecast'>('history')

  // 1. Core aggregate stats
  const summary = useMemo(() => {
    const entries = Object.entries(state.dailyActivities).filter(([, v]) => v > 0)
    const activeDays = entries.length
    const totalActions = entries.reduce((sum, [, v]) => sum + v, 0)
    const goalMetDays = entries.filter(([, v]) => v >= dailyGoal).length
    const longestStreak = calculateLongestStreak(state.dailyActivities)

    let last7Actions = 0
    for (let i = 0; i < 7; i += 1) {
      last7Actions += state.dailyActivities[addDaysToKey(today, -i)] ?? 0
    }

    return {
      activeDays,
      totalActions,
      goalMetDays,
      longestStreak,
      last7Actions,
    }
  }, [state.dailyActivities, dailyGoal, today])

  // 2. Vocabulary mastery breakdown
  const mastery = useMemo(() => {
    let mastered = 0
    let learning = 0
    let needsReview = 0
    let unstarted = 0

    for (const item of allVocab) {
      const rec = state.srsRecords[item.id]
      if (!rec) {
        unstarted += 1
      } else if (rec.repetitions >= 2 && rec.lastRating === 'good') {
        mastered += 1
      } else if (rec.lastRating === 'again') {
        needsReview += 1
      } else {
        learning += 1
      }
    }

    const total = allVocab.length || 1
    return {
      total: allVocab.length,
      mastered,
      learning,
      needsReview,
      unstarted,
      studied: mastered + learning + needsReview,
      masteredPct: Math.round((mastered / total) * 100),
      learningPct: Math.round((learning / total) * 100),
      needsReviewPct: Math.round((needsReview / total) * 100),
    }
  }, [allVocab, state.srsRecords])

  // 3. 12-week (84-day) review calendar grid aligned by Sunday..Saturday columns
  const calendarWeeks = useMemo(() => {
    const todayDow = getWeekdayIndex(today)
    // End of current week (Saturday), total 12 weeks = 84 cells
    const endOfWeek = addDaysToKey(today, 6 - todayDow)
    const startDay = addDaysToKey(endOfWeek, -83)

    // Pre-index SRS reviewed-on-day counts by updatedAt YYYY-MM-DD
    const reviewedByDay: Record<string, number> = {}
    for (const rec of Object.values(state.srsRecords)) {
      if (rec.updatedAt) {
        const dayKey = rec.updatedAt.slice(0, 10)
        reviewedByDay[dayKey] = (reviewedByDay[dayKey] ?? 0) + 1
      }
    }

    const weeks: {
      dateKey: string
      count: number
      reviewedCount: number
      level: 0 | 1 | 2 | 3 | 4
      isFuture: boolean
      isToday: boolean
      monthLabel?: string
    }[][] = []

    let lastMonth = ''
    for (let w = 0; w < 12; w += 1) {
      const col: (typeof weeks)[number] = []
      for (let d = 0; d < 7; d += 1) {
        const dateKey = addDaysToKey(startDay, w * 7 + d)
        const isFuture = dateKey > today
        const count = isFuture ? 0 : (state.dailyActivities[dateKey] ?? 0)
        const month = `${Number(dateKey.slice(5, 7))}月`
        const showMonth = d === 0 && month !== lastMonth
        if (showMonth) lastMonth = month

        col.push({
          dateKey,
          count,
          reviewedCount: reviewedByDay[dateKey] ?? 0,
          level: isFuture ? 0 : getHeatLevel(count, dailyGoal),
          isFuture,
          isToday: dateKey === today,
          monthLabel: showMonth ? month : undefined,
        })
      }
      weeks.push(col)
    }

    return weeks
  }, [today, state.dailyActivities, state.srsRecords, dailyGoal])

  const selectedDayInfo = useMemo(() => {
    const count = state.dailyActivities[selectedDate] ?? 0
    const weekday = WEEKDAY_LABELS[getWeekdayIndex(selectedDate)]
    let reviewedCards = 0
    let scheduledCards = 0
    for (const rec of Object.values(state.srsRecords)) {
      if (rec.updatedAt?.slice(0, 10) === selectedDate) reviewedCards += 1
      if (rec.nextReviewDate === selectedDate) scheduledCards += 1
    }
    return {
      dateKey: selectedDate,
      weekday,
      count,
      goalMet: count >= dailyGoal,
      reviewedCards,
      scheduledCards,
      isToday: selectedDate === today,
    }
  }, [selectedDate, state.dailyActivities, state.srsRecords, dailyGoal, today])

  // 4. Last 14 days activity trend
  const last14Days = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const dateKey = addDaysToKey(today, -(13 - i))
      const count = state.dailyActivities[dateKey] ?? 0
      return {
        dateKey,
        label: formatShortDate(dateKey),
        count,
        isToday: dateKey === today,
        goalMet: count >= dailyGoal,
      }
    })
    const maxCount = Math.max(dailyGoal, ...days.map((d) => d.count), 1)
    return { days, maxCount }
  }, [today, state.dailyActivities, dailyGoal])

  // 5. Upcoming 7 days SRS review forecast
  const forecast7Days = useMemo(() => {
    const countsByDate: Record<string, number> = {}
    let overdueOrToday = 0
    for (const item of allVocab) {
      const rec = state.srsRecords[item.id]
      if (!rec) continue
      if (rec.nextReviewDate <= today) {
        overdueOrToday += 1
      } else {
        countsByDate[rec.nextReviewDate] = (countsByDate[rec.nextReviewDate] ?? 0) + 1
      }
    }

    const days = Array.from({ length: 7 }, (_, i) => {
      const dateKey = addDaysToKey(today, i)
      const count = i === 0 ? overdueOrToday : (countsByDate[dateKey] ?? 0)
      return {
        dateKey,
        label: i === 0 ? '今日' : i === 1 ? '明日' : formatShortDate(dateKey),
        count,
        isToday: i === 0,
      }
    })
    const maxCount = Math.max(...days.map((d) => d.count), 5)
    return { days, maxCount }
  }, [allVocab, state.srsRecords, today])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">学习统计与复习日历</h2>
          <p className="text-xs text-muted-foreground">
            自动汇总本地与云端同步的学习记录、连续打卡、词汇掌握度与复习趋势
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <CalendarDays className="size-3 text-primary" />
          已打卡 {summary.activeDays} 天
        </Badge>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>连续打卡</span>
            <Flame className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold">{streakDays}</span>
            <span className="text-xs text-muted-foreground">天</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            历史最长 {summary.longestStreak} 天
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>累计学习活力</span>
            <Award className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold">{summary.totalActions}</span>
            <span className="text-xs text-muted-foreground">点</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            近 7 天 +{summary.last7Actions} · 达标 {summary.goalMetDays} 天
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>词汇掌握进度</span>
            <BookMarked className="size-4 text-success" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold">{mastery.mastered}</span>
            <span className="text-xs text-muted-foreground">/ {mastery.total} 词</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            已学习 {mastery.studied} 词 · 熟练率 {mastery.masteredPct}%
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>课程完成度</span>
            <CheckCircle2 className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold">
              {state.completedDialogues.length + state.masteredGrammar.length}
            </span>
            <span className="text-xs text-muted-foreground">
              / {DIALOGUE_SCENARIOS.length + GRAMMAR_PATTERNS.length} 项
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            对话 {state.completedDialogues.length}/{DIALOGUE_SCENARIOS.length} · 句型{' '}
            {state.masteredGrammar.length}/{GRAMMAR_PATTERNS.length}
          </p>
        </Card>
      </div>

      {/* Main Analytics Grid: Review Calendar + Trend & Mastery */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left: 12-week Review Calendar Heatmap */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">复习日历（近 12 周）</CardTitle>
                <CardDescription>点击任意日期查看当天学习活力与复习记录</CardDescription>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>少</span>
                {([0, 1, 2, 3, 4] as const).map((lvl) => (
                  <span
                    key={lvl}
                    className={cn('size-2.5 rounded-[3px]', HEAT_CELL_CLASSES[lvl].split(' ')[0])}
                  />
                ))}
                <span>多</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="overflow-x-auto pb-1">
              <div className="inline-flex flex-col gap-1.5 min-w-full">
                {/* Month labels row */}
                <div className="flex gap-1.5 pl-6">
                  {calendarWeeks.map((week, wIdx) => (
                    <div
                      key={wIdx}
                      className="w-4 sm:w-5 text-[10px] text-muted-foreground truncate"
                    >
                      {week[0]?.monthLabel ?? ''}
                    </div>
                  ))}
                </div>

                {/* Grid rows (Sun..Sat) */}
                <div className="flex gap-1.5">
                  {/* Weekday column */}
                  <div className="flex flex-col justify-between py-0.5 pr-1 text-[10px] text-muted-foreground w-5 shrink-0">
                    <span>日</span>
                    <span>二</span>
                    <span>四</span>
                    <span>六</span>
                  </div>

                  {/* 12 week columns */}
                  <div className="flex gap-1.5">
                    {calendarWeeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1.5">
                        {week.map((cell) => {
                          const isSelected = selectedDate === cell.dateKey
                          return (
                            <button
                              key={cell.dateKey}
                              type="button"
                              disabled={cell.isFuture}
                              onClick={() => setSelectedDate(cell.dateKey)}
                              title={
                                cell.isFuture
                                  ? `${cell.dateKey}（未来日期）`
                                  : `${cell.dateKey}：学习活力 ${cell.count}`
                              }
                              className={cn(
                                'size-4 sm:size-5 rounded-[4px] transition-all',
                                cell.isFuture
                                  ? 'bg-muted/30 cursor-default opacity-40'
                                  : cn(HEAT_CELL_CLASSES[cell.level], 'cursor-pointer'),
                                cell.isToday && 'ring-1 ring-primary/70 ring-offset-1 ring-offset-card',
                                isSelected && 'ring-2 ring-foreground/70 ring-offset-1 ring-offset-card',
                              )}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Day Inspector */}
            <div className="rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {selectedDayInfo.dateKey}（周{selectedDayInfo.weekday}）
                </span>
                {selectedDayInfo.isToday && (
                  <Badge variant="secondary" className="text-[10px] py-0">
                    今天
                  </Badge>
                )}
                {selectedDayInfo.goalMet && (
                  <Badge variant="success" className="text-[10px] py-0">
                    已达标
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <span>
                  学习活力 <strong className="text-foreground">{selectedDayInfo.count}</strong> /{' '}
                  {dailyGoal}
                </span>
                <span>
                  复习卡片{' '}
                  <strong className="text-foreground">{selectedDayInfo.reviewedCards}</strong> 张
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Vocabulary Mastery + Review Trend */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Vocabulary Mastery Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">词汇掌握分布</CardTitle>
                <span className="text-xs text-muted-foreground">共 {mastery.total} 词</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Multi-segment bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
                {mastery.mastered > 0 && (
                  <div
                    style={{ width: `${(mastery.mastered / Math.max(1, mastery.total)) * 100}%` }}
                    className="bg-success transition-all"
                    title={`已熟练：${mastery.mastered} 词`}
                  />
                )}
                {mastery.learning > 0 && (
                  <div
                    style={{ width: `${(mastery.learning / Math.max(1, mastery.total)) * 100}%` }}
                    className="bg-primary transition-all"
                    title={`巩固中：${mastery.learning} 词`}
                  />
                )}
                {mastery.needsReview > 0 && (
                  <div
                    style={{
                      width: `${(mastery.needsReview / Math.max(1, mastery.total)) * 100}%`,
                    }}
                    className="bg-warning transition-all"
                    title={`需加强：${mastery.needsReview} 词`}
                  />
                )}
              </div>

              {/* Legend breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-background border border-border/70 px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-success" />
                    已熟练
                  </span>
                  <span className="font-semibold text-foreground">{mastery.mastered}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-background border border-border/70 px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" />
                    巩固中
                  </span>
                  <span className="font-semibold text-foreground">{mastery.learning}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-background border border-border/70 px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-warning" />
                    需加强
                  </span>
                  <span className="font-semibold text-foreground">{mastery.needsReview}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-background border border-border/70 px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-muted-foreground/30" />
                    未开始
                  </span>
                  <span className="font-semibold text-foreground">{mastery.unstarted}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Trend Card (14-day history / 7-day forecast toggle) */}
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-1.5">
                  {trendMode === 'history' ? (
                    <TrendingUp className="size-4 text-primary" />
                  ) : (
                    <BarChart3 className="size-4 text-primary" />
                  )}
                  {trendMode === 'history' ? '近 14 天学习趋势' : '未来 7 天复习预报'}
                </CardTitle>
                <div className="inline-flex rounded-lg bg-muted p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTrendMode('history')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-medium transition-colors cursor-pointer',
                      trendMode === 'history'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    趋势
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendMode('forecast')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-medium transition-colors cursor-pointer',
                      trendMode === 'forecast'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    预报
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {trendMode === 'history' ? (
                <>
                  <div className="relative h-24 flex items-end gap-1 pt-2">
                    {/* Daily goal reference dashed line */}
                    <div
                      style={{
                        bottom: `${Math.min(100, (dailyGoal / last14Days.maxCount) * 100)}%`,
                      }}
                      className="pointer-events-none absolute inset-x-0 border-t border-dashed border-primary/35"
                      title={`每日目标：${dailyGoal}`}
                    />
                    {last14Days.days.map((d) => {
                      const heightPct =
                        d.count > 0 ? Math.max(10, Math.round((d.count / last14Days.maxCount) * 100)) : 4
                      return (
                        <button
                          key={d.dateKey}
                          type="button"
                          onClick={() => setSelectedDate(d.dateKey)}
                          title={`${d.dateKey}：学习活力 ${d.count}`}
                          className="group flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
                        >
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={cn(
                              'w-full rounded-t-[4px] transition-all',
                              d.count === 0
                                ? 'bg-muted/70'
                                : d.goalMet
                                  ? 'bg-primary group-hover:bg-primary/85'
                                  : 'bg-primary/45 group-hover:bg-primary/65',
                              d.isToday && 'ring-1 ring-primary/60',
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{last14Days.days[0]?.label}</span>
                    <span>虚线为每日目标 ({dailyGoal})</span>
                    <span>今日</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-24 flex items-end gap-2 pt-2">
                    {forecast7Days.days.map((d) => {
                      const heightPct =
                        d.count > 0
                          ? Math.max(12, Math.round((d.count / forecast7Days.maxCount) * 100))
                          : 5
                      return (
                        <div
                          key={d.dateKey}
                          className="flex-1 h-full flex flex-col justify-end items-center gap-1"
                          title={`${d.dateKey}：计划复习 ${d.count} 词`}
                        >
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {d.count > 0 ? d.count : ''}
                          </span>
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={cn(
                              'w-full rounded-t-[4px] transition-all',
                              d.count === 0
                                ? 'bg-muted/70'
                                : d.isToday
                                  ? 'bg-primary'
                                  : 'bg-primary/50',
                            )}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-muted-foreground">
                    {forecast7Days.days.map((d) => (
                      <span key={d.dateKey} className={cn(d.isToday && 'text-primary font-medium')}>
                        {d.label}
                      </span>
                    ))}
                  </div>
                  {dueVocabCount > 0 && (
                    <div className="pt-1 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-primary"
                        onClick={() => navigate('flashcards')}
                      >
                        今日共 {dueVocabCount} 词待复习（含未学新词） →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
