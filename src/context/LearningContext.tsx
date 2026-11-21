import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BUILTIN_VOCAB } from '@/data/vocabulary'
import { preloadAppFonts, preloadFontChars } from '@/lib/fontPreloader'
import { addDaysToKey, getTodayKey } from '@/lib/utils'
import { createDefaultLearningState, learningRepository } from '@/services/repository'
import { speechService } from '@/services/speech'
import type {
  LearningState,
  SrsRecord,
  UserPreferences,
  VocabItem,
} from '@/types/learning'

export type SrsRating = 'again' | 'hard' | 'good'

interface ToastMessage {
  id: number
  text: string
  tone: 'default' | 'success' | 'error'
}

interface LearningContextValue {
  state: LearningState
  allVocab: VocabItem[]
  isLoading: boolean
  error: string | null
  todayCount: number
  streakDays: number
  dueVocabCount: number
  weakVocab: VocabItem[]
  speakingId: string | null
  speechError: string | null
  toast: ToastMessage | null
  clearSpeechError: () => void
  reload: () => Promise<void>
  updatePreferences: (partial: Partial<UserPreferences>) => Promise<void>
  toggleDialogueCompleted: (scenarioId: string) => Promise<void>
  toggleGrammarMastered: (grammarId: string) => Promise<void>
  toggleVocabBookmark: (vocabId: string) => Promise<void>
  rateVocab: (itemId: string, rating: SrsRating) => Promise<void>
  addCustomVocab: (input: {
    plainJa: string
    reading: string
    romaji: string
    zh: string
    exampleJa: string
    exampleZh: string
    register: '礼貌' | '简体' | '通用'
  }) => Promise<void>
  saveDictionaryVocab: (
    input: {
      plainJa: string
      reading: string
      segments: VocabItem['segments']
      zh: string
      partOfSpeech?: string[]
      exampleJa?: string
      exampleZh?: string
      sourceUrl?: string
      license?: string
    },
    options?: { bookmark?: boolean; addToSrs?: boolean },
  ) => Promise<string>
  deleteCustomVocab: (id: string) => Promise<void>
  exportBackup: () => Promise<string>
  importBackup: (rawJson: string) => Promise<void>
  resetAllData: () => Promise<void>
  speakText: (id: string, text: string, rateOverride?: number) => void
  stopSpeech: () => void
  showToast: (text: string, tone?: 'default' | 'success' | 'error') => void
}

const LearningContext = createContext<LearningContextValue | null>(null)

function calculateStreak(activities: Record<string, number>): number {
  const today = getTodayKey()
  const yesterday = addDaysToKey(today, -1)

  let cursor = (activities[today] ?? 0) > 0 ? today : (activities[yesterday] ?? 0) > 0 ? yesterday : null
  if (!cursor) return 0

  let streak = 0
  while (cursor && (activities[cursor] ?? 0) > 0) {
    streak += 1
    cursor = addDaysToKey(cursor, -1)
  }
  return streak
}

function computeNextSrs(prev: SrsRecord | undefined, itemId: string, rating: SrsRating): SrsRecord {
  const today = getTodayKey()
  const prevInterval = prev?.interval ?? 0
  const prevEase = prev?.easeFactor ?? 2.3
  const prevReps = prev?.repetitions ?? 0

  let interval = 1
  let easeFactor = prevEase
  let repetitions = prevReps

  if (rating === 'again') {
    interval = 0
    repetitions = 0
    easeFactor = Math.max(1.3, prevEase - 0.2)
  } else if (rating === 'hard') {
    interval = prevInterval <= 1 ? 1 : Math.max(2, Math.round(prevInterval * 1.2))
    repetitions = prevReps + 1
    easeFactor = Math.max(1.4, prevEase - 0.05)
  } else {
    repetitions = prevReps + 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 3
    else interval = Math.max(4, Math.round(prevInterval * prevEase))
    easeFactor = Math.min(2.8, prevEase + 0.1)
  }

  return {
    itemId,
    interval,
    easeFactor,
    repetitions,
    nextReviewDate: addDaysToKey(today, interval),
    lastRating: rating,
    updatedAt: new Date().toISOString(),
  }
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAuth()
  const [state, setState] = useState<LearningState>(() => createDefaultLearningState())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = useCallback((text: string, tone: 'default' | 'success' | 'error' = 'default') => {
    const id = Date.now()
    setToast({ id, text, tone })
    window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev))
    }, 2800)
  }, [])

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const loaded = await learningRepository.loadState()
      setState(loaded)
      await preloadAppFonts(loaded.customVocab)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载学习数据时发生错误。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    void reload()
  }, [reload, isAuthLoading, user?.id])

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', state.preferences.theme === 'dark')
  }, [state.preferences.theme])

  // Stop speech when unmounting
  useEffect(() => {
    return () => speechService.stop()
  }, [])

  const allVocab = useMemo(
    () => [...state.customVocab, ...BUILTIN_VOCAB],
    [state.customVocab],
  )

  const todayKey = getTodayKey()
  const todayCount = state.dailyActivities[todayKey] ?? 0
  const streakDays = useMemo(() => calculateStreak(state.dailyActivities), [state.dailyActivities])

  const dueVocabCount = useMemo(() => {
    return allVocab.filter((item) => {
      const rec = state.srsRecords[item.id]
      if (!rec) return true
      return rec.nextReviewDate <= todayKey
    }).length
  }, [allVocab, state.srsRecords, todayKey])

  const weakVocab = useMemo(() => {
    return allVocab.filter((item) => {
      const rec = state.srsRecords[item.id]
      return rec && (rec.lastRating === 'again' || rec.lastRating === 'hard')
    })
  }, [allVocab, state.srsRecords])

  const updatePreferences = useCallback(async (partial: Partial<UserPreferences>) => {
    const next = await learningRepository.updatePreferences(partial)
    setState(next)
  }, [])

  const toggleDialogueCompleted = useCallback(
    async (scenarioId: string) => {
      const wasDone = state.completedDialogues.includes(scenarioId)
      let next = await learningRepository.toggleDialogueCompleted(scenarioId)
      if (!wasDone) {
        next = await learningRepository.recordDailyAction(getTodayKey(), 3)
        showToast('已完成场景对话练习 +3 活力', 'success')
      }
      setState(next)
    },
    [state.completedDialogues, showToast],
  )

  const toggleGrammarMastered = useCallback(
    async (grammarId: string) => {
      const wasDone = state.masteredGrammar.includes(grammarId)
      let next = await learningRepository.toggleGrammarMastered(grammarId)
      if (!wasDone) {
        next = await learningRepository.recordDailyAction(getTodayKey(), 2)
        showToast('已标记掌握该句型 +2 活力', 'success')
      }
      setState(next)
    },
    [state.masteredGrammar, showToast],
  )

  const toggleVocabBookmark = useCallback(
    async (vocabId: string) => {
      const wasSaved = state.bookmarkedVocab.includes(vocabId)
      const next = await learningRepository.toggleVocabBookmark(vocabId)
      setState(next)
      showToast(wasSaved ? '已移出生词收藏' : '已加入生词收藏')
    },
    [state.bookmarkedVocab, showToast],
  )

  const rateVocab = useCallback(async (itemId: string, rating: SrsRating) => {
    const record = computeNextSrs(state.srsRecords[itemId], itemId, rating)
    await learningRepository.upsertSrsRecord(record)
    const next = await learningRepository.recordDailyAction(getTodayKey(), 1)
    setState(next)
  }, [state.srsRecords])

  const addCustomVocab = useCallback(
    async (input: {
      plainJa: string
      reading: string
      romaji: string
      zh: string
      exampleJa: string
      exampleZh: string
      register: '礼貌' | '简体' | '通用'
    }) => {
      const item: VocabItem = {
        id: `custom-${Date.now()}`,
        topic: 'custom',
        segments: input.reading.trim()
          ? [{ text: input.plainJa.trim(), reading: input.reading.trim() }]
          : [{ text: input.plainJa.trim() }],
        plainJa: input.plainJa.trim(),
        reading: input.reading.trim() || input.plainJa.trim(),
        romaji: input.romaji.trim(),
        zh: input.zh.trim(),
        register: input.register,
        exampleJa: input.exampleJa.trim() || undefined,
        exampleZh: input.exampleZh.trim() || undefined,
        isCustom: true,
      }
      const next = await learningRepository.addCustomVocab(item)
      setState(next)
      void preloadFontChars(
        `${item.plainJa}${item.reading}${item.zh}${item.exampleJa ?? ''}${item.exampleZh ?? ''}`,
      )
      showToast('已添加到自定义词句', 'success')
    },
    [showToast],
  )

  const saveDictionaryVocab = useCallback(
    async (
      input: {
        plainJa: string
        reading: string
        segments: VocabItem['segments']
        zh: string
        partOfSpeech?: string[]
        exampleJa?: string
        exampleZh?: string
        sourceUrl?: string
        license?: string
      },
      options?: { bookmark?: boolean; addToSrs?: boolean },
    ) => {
      const existing = allVocab.find(
        (v) => v.plainJa === input.plainJa.trim() && v.reading === input.reading.trim(),
      )
      let targetId = existing?.id
      let latestState = state

      if (!targetId) {
        const newItem: VocabItem = {
          id: `dict-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          topic: 'custom',
          segments: input.segments,
          plainJa: input.plainJa.trim(),
          reading: input.reading.trim() || input.plainJa.trim(),
          romaji: '',
          zh: input.zh.trim(),
          partOfSpeech: input.partOfSpeech,
          register: '通用',
          exampleJa: input.exampleJa?.trim() || undefined,
          exampleZh: input.exampleZh?.trim() || undefined,
          sourceUrl: input.sourceUrl,
          license: input.license,
          isCustom: true,
        }
        targetId = newItem.id
        latestState = await learningRepository.addCustomVocab(newItem)
        void preloadFontChars(
          `${newItem.plainJa}${newItem.reading}${newItem.zh}${newItem.exampleJa ?? ''}`,
        )
      }

      if (options?.bookmark && !latestState.bookmarkedVocab.includes(targetId)) {
        latestState = await learningRepository.toggleVocabBookmark(targetId)
      }

      if (options?.addToSrs) {
        const existingRec = latestState.srsRecords[targetId]
        const today = getTodayKey()
        if (existingRec && existingRec.nextReviewDate > today) {
          latestState = await learningRepository.upsertSrsRecord({
            ...existingRec,
            nextReviewDate: today,
            updatedAt: new Date().toISOString(),
          })
        }
      }

      setState(latestState)
      if (options?.bookmark && options?.addToSrs) {
        showToast('已收藏并加入今日复习', 'success')
      } else if (options?.bookmark) {
        showToast('已收藏该词条', 'success')
      } else if (options?.addToSrs) {
        showToast('已加入闪卡复习', 'success')
      }
      return targetId
    },
    [allVocab, state, showToast],
  )

  const deleteCustomVocab = useCallback(
    async (id: string) => {
      const next = await learningRepository.deleteCustomVocab(id)
      setState(next)
      showToast('已删除该自定义词句')
    },
    [showToast],
  )

  const exportBackup = useCallback(async () => {
    return learningRepository.exportBackupJson()
  }, [])

  const importBackup = useCallback(
    async (rawJson: string) => {
      const next = await learningRepository.importBackupJson(rawJson)
      setState(next)
      void preloadAppFonts(next.customVocab)
      showToast('学习记录已成功导入恢复', 'success')
    },
    [showToast],
  )

  const resetAllData = useCallback(async () => {
    const next = await learningRepository.resetAll()
    setState(next)
    showToast('已重置所有本地学习记录')
  }, [showToast])

  const speakText = useCallback(
    (id: string, text: string, rateOverride?: number) => {
      setSpeechError(null)
      if (speakingId === id) {
        speechService.stop()
        setSpeakingId(null)
        return
      }
      speechService.speak(text, {
        rate: rateOverride ?? state.preferences.speechRate,
        onStart: () => setSpeakingId(id),
        onEnd: () => setSpeakingId((cur) => (cur === id ? null : cur)),
        onError: (msg) => {
          setSpeakingId(null)
          setSpeechError(msg)
        },
      })
    },
    [speakingId, state.preferences.speechRate],
  )

  const stopSpeech = useCallback(() => {
    speechService.stop()
    setSpeakingId(null)
  }, [])

  const clearSpeechError = useCallback(() => setSpeechError(null), [])

  const value: LearningContextValue = {
    state,
    allVocab,
    isLoading,
    error,
    todayCount,
    streakDays,
    dueVocabCount,
    weakVocab,
    speakingId,
    speechError,
    toast,
    clearSpeechError,
    reload,
    updatePreferences,
    toggleDialogueCompleted,
    toggleGrammarMastered,
    toggleVocabBookmark,
    rateVocab,
    addCustomVocab,
    saveDictionaryVocab,
    deleteCustomVocab,
    exportBackup,
    importBackup,
    resetAllData,
    speakText,
    stopSpeech,
    showToast,
  }

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
}

export function useLearning() {
  const ctx = useContext(LearningContext)
  if (!ctx) throw new Error('useLearning must be used inside LearningProvider')
  return ctx
}
