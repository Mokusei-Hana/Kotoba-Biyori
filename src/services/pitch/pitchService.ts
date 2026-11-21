import {
  VERIFIED_PITCH_ENTRIES,
  type VerifiedPitchEntry,
} from '@/data/verifiedPitchDict'
import {
  searchOnlineDictionary,
  type JmdictVerbClass,
  type OnlineDictionaryWord,
} from '@/services/dictionary/dictionaryService'
import {
  buildPitchPatternFromNumber,
  parseJotobaPitch,
  type PitchPattern,
} from '@/services/pitch/pitchParser'
import type { RubySegment } from '@/types/learning'

export interface PitchDictionaryItem {
  id: string
  kanji: string
  kana: string
  segments: RubySegment[]
  common?: boolean
  pos: string[]
  zhSummary: string
  enFallback?: string
  /** 该词条经过核验的所有标准音调模式（空数组表示暂未收录可靠音调，绝不猜测） */
  patterns: PitchPattern[]
  note?: string
  /** 是否为名词（用于提供「带助词 が 朗读」对比） */
  isNoun: boolean
  verbClass?: JmdictVerbClass
  sourceName: string
  sourceUrl: string
  origin: 'local-verified' | 'online-verified' | 'online-unverified'
}

export interface PitchSearchResult {
  /** 包含可靠、可核验音调数据的词条 */
  verifiedItems: PitchDictionaryItem[]
  /** 在线词典查到该词，但暂未收录可靠音调数据（不进行 AI 猜测） */
  unverifiedItems: PitchDictionaryItem[]
}

/**
 * 将本地内置可核验词条转换为 PitchDictionaryItem。
 */
export function convertVerifiedEntry(entry: VerifiedPitchEntry): PitchDictionaryItem {
  const patterns = entry.accents
    .map((num) => buildPitchPatternFromNumber(entry.kana, num, entry.source))
    .filter((p): p is PitchPattern => p !== null)

  return {
    id: entry.id,
    kanji: entry.kanji,
    kana: entry.kana,
    segments:
      entry.kanji === entry.kana
        ? [{ text: entry.kanji }]
        : [{ text: entry.kanji, reading: entry.kana }],
    common: true,
    pos: entry.pos,
    zhSummary: entry.zh,
    patterns,
    note: entry.note,
    isNoun: Boolean(entry.isNoun),
    sourceName: entry.source,
    sourceUrl: entry.sourceUrl,
    origin: 'local-verified',
  }
}

/**
 * 在内置核验音调词库中快速查找匹配的词条（支持精确/模糊匹配汉字、假名或中文）。
 */
export function searchLocalVerifiedPitch(query: string): PitchDictionaryItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const exact: VerifiedPitchEntry[] = []
  const partial: VerifiedPitchEntry[] = []

  for (const entry of VERIFIED_PITCH_ENTRIES) {
    if (
      entry.kanji.toLowerCase() === q ||
      entry.kana.toLowerCase() === q
    ) {
      exact.push(entry)
    } else if (
      entry.kanji.toLowerCase().includes(q) ||
      entry.kana.toLowerCase().includes(q) ||
      entry.zh.toLowerCase().includes(q)
    ) {
      partial.push(entry)
    }
  }

  return [...exact, ...partial].map(convertVerifiedEntry)
}

/**
 * 根据汉字或假名，从内置核验词库中精确查找唯一对应的音调模式（供智能词典本地词条联动使用）。
 */
export function findLocalVerifiedPitchForWord(
  kanji: string,
  kana?: string,
): PitchPattern | null {
  const match = VERIFIED_PITCH_ENTRIES.find(
    (e) =>
      e.kanji === kanji &&
      (!kana || e.kana === kana),
  )
  if (!match || match.accents.length === 0) return null
  return buildPitchPatternFromNumber(match.kana, match.accents[0], match.source)
}

/**
 * 从单条 OnlineDictionaryWord 中提取所有可核验的音调模式（优先 Kanjium/Jotoba，补充 Wiktionary 东京音调）。
 * 绝不猜测或生成未核验音调。
 */
export function extractVerifiedPitchPatterns(word: OnlineDictionaryWord): PitchPattern[] {
  const patterns: PitchPattern[] = []
  const seenNumbers = new Set<number>()

  // 1. Primary: Kanjium via Jotoba API
  const jotobaPattern = parseJotobaPitch(word.kana, word.pitch)
  if (jotobaPattern) {
    patterns.push(jotobaPattern)
    seenNumbers.add(jotobaPattern.accentNumber)
  }

  // 2. Secondary: Verified Tokyo pitch accents from Wiktionary (CC BY-SA 4.0)
  if (Array.isArray(word.zhPitchAccents) && word.kana) {
    for (const accNum of word.zhPitchAccents) {
      if (seenNumbers.has(accNum)) continue
      const wkPattern = buildPitchPatternFromNumber(
        word.kana,
        accNum,
        '中文维基词典 (CC BY-SA 4.0)',
      )
      if (wkPattern) {
        patterns.push(wkPattern)
        seenNumbers.add(accNum)
      }
    }
  }

  return patterns
}

/**
 * 执行双层可靠音调检索：
 * 1) 本地已核验核心音调词库（离线即时可用）
 * 2) 在线 Jotoba (Kanjium / EDRDG JMdict) + 中文维基词典补充
 * 严禁 AI 猜测音调：若均无可靠记录，则归入 unverifiedItems 并如实告知用户。
 */
export async function searchPitchDictionary(
  query: string,
  signal?: AbortSignal,
): Promise<PitchSearchResult> {
  const trimmed = query.trim()
  if (!trimmed) return { verifiedItems: [], unverifiedItems: [] }

  const localItems = searchLocalVerifiedPitch(trimmed)
  const localKeySet = new Set(localItems.map((item) => `${item.kanji}|${item.kana}`))

  const onlineRes = await searchOnlineDictionary(trimmed, signal)

  const onlineVerified: PitchDictionaryItem[] = []
  const onlineUnverified: PitchDictionaryItem[] = []

  for (const word of onlineRes.words) {
    const key = `${word.kanji}|${word.kana}`
    const patterns = extractVerifiedPitchPatterns(word)
    const allPos = Array.from(new Set(word.senses.flatMap((s) => s.pos)))
    const isNoun = allPos.some((p) => p.includes('名词'))
    const zhSummary =
      word.zhDefinitions.length > 0
        ? word.zhDefinitions.slice(0, 3).join('；')
        : ''
    const enFallback = word.senses
      .slice(0, 2)
      .map((s) => s.glosses.slice(0, 3).join(' / '))
      .join('；')

    // 若本地核验库已有完全相同的词条，将在线补充的额外音调（如有）和动词类别合并，避免重复卡片
    if (localKeySet.has(key)) {
      const target = localItems.find((i) => `${i.kanji}|${i.kana}` === key)
      if (target) {
        if (!target.verbClass && word.verbClass) target.verbClass = word.verbClass
        const existingNums = new Set(target.patterns.map((p) => p.accentNumber))
        for (const p of patterns) {
          if (!existingNums.has(p.accentNumber)) {
            target.patterns.push(p)
            existingNums.add(p.accentNumber)
          }
        }
      }
      continue
    }

    const item: PitchDictionaryItem = {
      id: `pitch-${word.id}`,
      kanji: word.kanji,
      kana: word.kana || word.kanji,
      segments: word.segments,
      common: word.common,
      pos: allPos,
      zhSummary,
      enFallback,
      patterns,
      isNoun,
      verbClass: word.verbClass,
      sourceName:
        patterns.length > 0
          ? patterns[0].source
          : `${word.sourceName} (${word.license})`,
      sourceUrl: word.zhSourceUrl ?? word.sourceUrl,
      origin: patterns.length > 0 ? 'online-verified' : 'online-unverified',
    }

    if (patterns.length > 0) {
      onlineVerified.push(item)
    } else {
      onlineUnverified.push(item)
    }
  }

  return {
    verifiedItems: [...localItems, ...onlineVerified],
    unverifiedItems: onlineUnverified.slice(0, 6),
  }
}
