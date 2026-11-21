import type { RubySegment } from '@/types/learning'

export interface DictionarySense {
  glosses: string[]
  pos: string[]
  misc?: string
}

export interface DictionaryPitchPart {
  part: string
  high: boolean
}

export interface OnlineDictionaryWord {
  id: string
  kanji: string
  kana: string
  segments: RubySegment[]
  common: boolean
  senses: DictionarySense[]
  pitch?: DictionaryPitchPart[]
  sourceName: 'EDRDG JMdict'
  sourceUrl: string
  license: 'CC BY-SA 4.0'
}

export interface OnlineDictionarySentence {
  id: string
  content: string
  segments: RubySegment[]
  translation: string
  sourceName: 'Tatoeba'
  license: 'CC BY 2.0 FR'
}

export interface OnlineDictionaryResult {
  words: OnlineDictionaryWord[]
  sentences: OnlineDictionarySentence[]
}

/**
 * Parse Jotoba furigana syntax like "[推|お]し" or "チケットは[残|のこ]ってた？"
 * into Kotoba-Biyori RubySegment[] for <FuriganaText>.
 */
export function parseJotobaFurigana(furigana: string | undefined, fallback: string): RubySegment[] {
  if (!furigana) return [{ text: fallback }]
  const segments: RubySegment[] = []
  const regex = /\[([^|\]]+)\|([^\]]+)\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(furigana)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: furigana.slice(lastIndex, match.index) })
    }
    const base = match[1]
    const read = match[2]
    // Handle multi-part ruby like [日|に][本|ほん] or [今日|きょ|う]
    const cleanRead = read.replace(/\|/g, '')
    segments.push({ text: base, reading: cleanRead })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < furigana.length) {
    segments.push({ text: furigana.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ text: fallback }]
}

/**
 * Convert JMdict / Jotoba structured POS tags into concise Chinese labels.
 */
function mapSinglePos(pos: unknown): string | null {
  if (typeof pos === 'string') {
    const map: Record<string, string> = {
      Adverb: '副词',
      AdverbTo: '副词',
      Conjunction: '接续词',
      Counter: '量词',
      Expr: '惯用表达',
      Interjection: '感叹词',
      Particle: '助词',
      Prefix: '前缀',
      Pronoun: '代词',
      Suffix: '后缀',
      Unclassified: '其他',
    }
    return map[pos] ?? pos
  }
  if (pos && typeof pos === 'object') {
    const [key, val] = Object.entries(pos as Record<string, unknown>)[0] ?? []
    if (key === 'Noun') {
      if (val === 'Suffix') return '名词（后缀）'
      if (val === 'Prefix') return '名词（前缀）'
      return '名词'
    }
    if (key === 'Adjective') {
      if (val === 'I') return 'い形容词'
      if (val === 'Na') return 'な形容词'
      if (val === 'No') return 'の形容词'
      return '形容词'
    }
    if (key === 'Verb') {
      if (typeof val === 'string') {
        if (val.includes('Ichidan')) return '一段动词'
        if (val.includes('Godan')) return '五段动词'
        if (val.includes('Suru')) return 'サ变动词'
      }
      if (val && typeof val === 'object') {
        const subKey = Object.keys(val as Record<string, unknown>)[0]
        if (subKey === 'Godan') return '五段动词'
        if (subKey === 'Ichidan') return '一段动词'
        if (subKey === 'Suru') return 'サ变动词'
      }
      return '动词'
    }
    return key ?? null
  }
  return null
}

export function formatJmdictPos(posList: unknown[] | undefined): string[] {
  if (!Array.isArray(posList)) return []
  const labels = posList.map(mapSinglePos).filter((x): x is string => Boolean(x))
  return Array.from(new Set(labels))
}

interface RawJotobaWord {
  reading?: {
    kana?: string
    kanji?: string
    furigana?: string
  }
  common?: boolean
  senses?: {
    glosses?: string[]
    pos?: unknown[]
    misc?: string
  }[]
  pitch?: DictionaryPitchPart[]
}

interface RawJotobaSentence {
  content?: string
  furigana?: string
  translation?: string
}

/**
 * Query real open-licensed dictionary data via Jotoba (EDRDG JMdict + Tatoeba).
 * Zero AI fabrication: returns only real dictionary entries and corpus sentences.
 */
export async function searchOnlineDictionary(
  query: string,
  signal?: AbortSignal,
): Promise<OnlineDictionaryResult> {
  const trimmed = query.trim()
  if (!trimmed) return { words: [], sentences: [] }

  const [wordRes, sentenceRes] = await Promise.all([
    fetch('https://jotoba.de/api/search/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, language: 'English', no_english: false }),
      signal,
    }),
    fetch('https://jotoba.de/api/search/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, language: 'English' }),
      signal,
    }).catch(() => null),
  ])

  if (!wordRes.ok) {
    throw new Error(`在线词典请求失败 (HTTP ${wordRes.status})`)
  }

  const wordJson = (await wordRes.json()) as { words?: RawJotobaWord[] }
  const rawWords = Array.isArray(wordJson.words) ? wordJson.words.slice(0, 15) : []

  const words: OnlineDictionaryWord[] = rawWords
    .map((w, idx) => {
      const kana = w.reading?.kana?.trim() || ''
      const kanji = w.reading?.kanji?.trim() || kana
      if (!kanji && !kana) return null
      const senses: DictionarySense[] = (w.senses ?? [])
        .map((s) => ({
          glosses: Array.isArray(s.glosses) ? s.glosses : [],
          pos: formatJmdictPos(s.pos),
          misc: typeof s.misc === 'string' ? s.misc : undefined,
        }))
        .filter((s) => s.glosses.length > 0)

      if (senses.length === 0) return null

      return {
        id: `jmdict-${kanji}-${kana}-${idx}`,
        kanji,
        kana,
        segments: parseJotobaFurigana(w.reading?.furigana, kanji),
        common: Boolean(w.common),
        senses,
        pitch: Array.isArray(w.pitch) ? w.pitch : undefined,
        sourceName: 'EDRDG JMdict' as const,
        sourceUrl: `https://jisho.org/word/${encodeURIComponent(kanji)}`,
        license: 'CC BY-SA 4.0' as const,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  let sentences: OnlineDictionarySentence[] = []
  if (sentenceRes && sentenceRes.ok) {
    const sentJson = (await sentenceRes.json()) as { sentences?: RawJotobaSentence[] }
    const rawSents = Array.isArray(sentJson.sentences) ? sentJson.sentences.slice(0, 6) : []
    sentences = rawSents
      .map((s, idx) => {
        const content = s.content?.trim() || ''
        if (!content) return null
        return {
          id: `tatoeba-${idx}-${content.slice(0, 12)}`,
          content,
          segments: parseJotobaFurigana(s.furigana, content),
          translation: s.translation?.trim() || '',
          sourceName: 'Tatoeba' as const,
          license: 'CC BY 2.0 FR' as const,
        }
      })
      .filter((item): item is OnlineDictionarySentence => item !== null)
  }

  return { words, sentences }
}
