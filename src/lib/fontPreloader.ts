import { DIALOGUE_SCENARIOS } from '@/data/dialogues'
import { GRAMMAR_PATTERNS } from '@/data/grammar'
import { BASIC_KANA_ROWS, DAKUTEN_KANA_ROWS, YOON_KANA_ROWS } from '@/data/kana'
import { TOPICS } from '@/data/topics'
import { VERIFIED_PITCH_ENTRIES } from '@/data/verifiedPitchDict'
import { BUILTIN_VOCAB } from '@/data/vocabulary'
import type { VocabItem } from '@/types/learning'

const UI_COMMON_TEXT =
  'ことば日和日常日语口语手账今日学习场景对话口语闪卡实用句型智能词典音调词典动词活用错词本五十音速查' +
  'おはようございますこんにちはこんばんは连续打卡天今日目标已达成学习活力' +
  '推荐下一课进入对话跟读待复习词开始间隔记忆浏览句型卡片薄弱词句回顾' +
  '振假名中文译文角色掩盖整段连读停止连读核心表达日本聊天小贴士' +
  '闪卡记忆词表浏览今日待复习全部生词收藏添加自定义词句不认识有点模糊记住了' +
  '礼貌体朋友简体对照清音浊音半浊音拗音罗马音设置备份' +
  '标准东京音调类型数字高低音曲线平板型头高型中高型尾高型经典同音异调对比朗读慢速带助词'

const FONT_SPECS = [
  '400 16px "Noto Sans SC"',
  '500 16px "Noto Sans SC"',
  '600 16px "Noto Sans SC"',
  '700 16px "Noto Sans SC"',
  '400 16px "Noto Sans JP"',
  '500 16px "Noto Sans JP"',
  '600 16px "Noto Sans JP"',
  '700 16px "Noto Sans JP"',
  '500 20px "Zen Maru Gothic"',
  '700 20px "Zen Maru Gothic"',
]

let baseCorpusCache: string | null = null

function getBaseCorpus(): string {
  if (baseCorpusCache) return baseCorpusCache

  const parts: string[] = [UI_COMMON_TEXT]

  for (const t of TOPICS) {
    parts.push(t.label, t.jpLabel, t.description)
    for (const sub of t.subtopics ?? []) {
      parts.push(sub.label, sub.jpLabel ?? '')
    }
  }

  for (const s of DIALOGUE_SCENARIOS) {
    parts.push(s.title, s.jpTitle, s.subtitle, s.situation, s.culturalTip)
    for (const line of s.lines) {
      parts.push(line.speakerName, line.plainJa, line.zh, line.note ?? '')
      for (const seg of line.segments) {
        parts.push(seg.text, seg.reading ?? '')
      }
    }
    for (const kp of s.keyPhrases) {
      parts.push(kp.ja, kp.reading, kp.zh)
    }
  }

  for (const v of BUILTIN_VOCAB) {
    parts.push(v.plainJa, v.reading, v.zh, v.exampleJa ?? '', v.exampleZh ?? '', v.tip ?? '')
  }

  for (const g of GRAMMAR_PATTERNS) {
    parts.push(g.title, g.meaning, g.category, g.formation, g.nuance, g.chatTip)
    for (const ex of g.examples) {
      parts.push(ex.politeJa, ex.politeReading, ex.casualJa, ex.casualReading, ex.zh)
    }
  }

  for (const row of [...BASIC_KANA_ROWS, ...DAKUTEN_KANA_ROWS, ...YOON_KANA_ROWS]) {
    parts.push(row.rowLabel)
    for (const cell of row.cells) {
      if (cell) parts.push(cell.hiragana, cell.katakana)
    }
  }

  for (const p of VERIFIED_PITCH_ENTRIES) {
    parts.push(p.kanji, p.kana, p.zh, p.note ?? '')
  }

  baseCorpusCache = Array.from(new Set(parts.join(''))).join('')
  return baseCorpusCache
}

/**
 * Eagerly loads all Google Fonts unicode-range subsets needed for the given text
 * so flashcards and pages never flash fallback fonts when new kanji appear.
 */
export async function preloadFontChars(text: string, timeoutMs = 2500): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return
  const uniqueChars = Array.from(new Set(text)).join('')
  if (!uniqueChars) return

  const loadPromise = Promise.allSettled(
    FONT_SPECS.map((spec) => document.fonts.load(spec, uniqueChars)),
  ).then(() => undefined)

  const timeoutPromise = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs)
  })

  await Promise.race([loadPromise, timeoutPromise])
}

export async function preloadAppFonts(customVocab: VocabItem[] = []): Promise<void> {
  const extra = customVocab
    .map((v) => `${v.plainJa}${v.reading}${v.zh}${v.exampleJa ?? ''}${v.exampleZh ?? ''}`)
    .join('')
  await preloadFontChars(getBaseCorpus() + extra)
}
