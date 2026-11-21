export type TopicId =
  | 'intro'
  | 'greeting'
  | 'hobby'
  | 'dining'
  | 'konbini'
  | 'hangout'
  | 'custom'

export interface TopicMeta {
  id: TopicId
  label: string
  jpLabel: string
  description: string
}

/** A token for rendering optional furigana via <ruby> */
export interface RubySegment {
  text: string
  reading?: string
}

export interface DialogueLine {
  id: string
  speaker: 'A' | 'B'
  speakerName: string
  segments: RubySegment[]
  plainJa: string
  romaji: string
  zh: string
  note?: string
}

export interface DialogueScenario {
  id: string
  topic: Exclude<TopicId, 'custom'>
  title: string
  jpTitle: string
  subtitle: string
  level: '入门' | '实用' | '进阶'
  register: '礼貌体' | '朋友简体' | '混合'
  estimatedMinutes: number
  situation: string
  lines: DialogueLine[]
  keyPhrases: {
    ja: string
    reading: string
    zh: string
  }[]
  culturalTip: string
}

export interface VocabItem {
  id: string
  topic: TopicId
  segments: RubySegment[]
  plainJa: string
  reading: string
  romaji: string
  zh: string
  register: '礼貌' | '简体' | '通用'
  exampleJa: string
  exampleZh: string
  tip?: string
  isCustom?: boolean
}

export interface GrammarExample {
  politeJa: string
  politeReading: string
  casualJa: string
  casualReading: string
  zh: string
}

export interface GrammarPattern {
  id: string
  title: string
  meaning: string
  category: '表达意愿' | '请求许可' | '日常搭话' | '连接转折' | '礼貌与简体'
  formation: string
  nuance: string
  examples: GrammarExample[]
  chatTip: string
}

export interface SrsRecord {
  itemId: string
  /** Days until next review */
  interval: number
  easeFactor: number
  repetitions: number
  /** YYYY-MM-DD */
  nextReviewDate: string
  lastRating: 'again' | 'hard' | 'good'
  updatedAt: string
}

export type ThemeMode = 'light' | 'dark'
export type SpeechRate = 0.75 | 1 | 1.15

export interface UserPreferences {
  theme: ThemeMode
  showFurigana: boolean
  showRomaji: boolean
  speechRate: SpeechRate
  dailyGoal: number
}

export interface DailyActivity {
  date: string
  actions: number
}

export interface LearningState {
  version: number
  preferences: UserPreferences
  completedDialogues: string[]
  masteredGrammar: string[]
  bookmarkedVocab: string[]
  srsRecords: Record<string, SrsRecord>
  customVocab: VocabItem[]
  dailyActivities: Record<string, number>
  lastVisitedRoute?: string
}
