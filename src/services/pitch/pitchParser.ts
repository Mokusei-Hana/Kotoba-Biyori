import type { DictionaryPitchPart } from '@/services/dictionary/dictionaryService'

export type PitchType = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka'

export interface PitchPattern {
  /** 标准东京音调数字：0=平板型，1=头高型，2..N-1=中高型，N=尾高型 */
  accentNumber: number
  /** 音调类型 */
  type: PitchType
  /** 切分后的每一拍（拗音小假名与前一假名合并为一拍） */
  morae: string[]
  /** 每一拍的高低状态（true=高音 H，false=低音 L） */
  moraLevels: boolean[]
  /** 后续接助词（如 が）时的高低状态（true=高，false=低） */
  particleHigh: boolean
  /** 音调下降核所在的 0-based 拍索引（平板型无下降核，为 null） */
  downstepIndex: number | null
  /** 数据来源标注 */
  source: string
  /** 是否已精确核验（绝不由 AI 猜测） */
  verified: true
}

export interface PitchTypeMeta {
  id: PitchType
  zhLabel: string
  jaLabel: string
  badgeText: string
  shortRule: string
  detailRule: string
  example: string
  colorClass: string
  bgClass: string
}

export const PITCH_TYPE_META: Record<PitchType, PitchTypeMeta> = {
  heiban: {
    id: 'heiban',
    zhLabel: '平板型',
    jaLabel: '平板型（へいばんがた）',
    badgeText: '0型 · 平板',
    shortRule: '第1拍低，第2拍起保持高音，接助词也不下降',
    detailRule: '音调数字为 [0]。第 1 拍低，从第 2 拍开始升高并一直保持高音，后续接「が / は」等助词时依然保持高音。',
    example: '桜（さくら）[0]・飴（あめ）[0]',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-500/10 border-emerald-500/25',
  },
  atamadaka: {
    id: 'atamadaka',
    zhLabel: '头高型',
    jaLabel: '頭高型（あたまだかがた）',
    badgeText: '1型 · 头高',
    shortRule: '第1拍高，第2拍立即下降并保持低音',
    detailRule: '音调数字为 [1]。只有第 1 拍为高音，从第 2 拍开始立即降为低音，一直低到词尾及后续助词。',
    example: '雨（あめ）[1]・箸（はし）[1]',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10 border-primary/25',
  },
  nakadaka: {
    id: 'nakadaka',
    zhLabel: '中高型',
    jaLabel: '中高型（なかだかがた）',
    badgeText: '中高型',
    shortRule: '第1拍低，中间升高，在词尾之前下降',
    detailRule: '音调数字为 [2] 至 [N-1]。第 1 拍低，第 2 拍升高，在第 n 拍之后下降，词尾与后续助词为低音。',
    example: '食べる（たべる）[2]・日本（にほん）[2]',
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-500/10 border-amber-500/25',
  },
  odaka: {
    id: 'odaka',
    zhLabel: '尾高型',
    jaLabel: '尾高型（おだかがた）',
    badgeText: '尾高型',
    shortRule: '第1拍低，升至词尾，接助词时明显下降',
    detailRule: '音调数字等于总拍数 [N]。单读时与平板型相似，但在最后一拍后存在下降核，接「が / は」等助词时会明显降为低音。',
    example: '橋（はし）[2]・男（おとこ）[3]',
    colorClass: 'text-sky-700 dark:text-sky-300',
    bgClass: 'bg-sky-500/10 border-sky-500/25',
  },
}

/** 拗音等依附于前一假名、不独立占拍的小假名（注意：促音 っ/ッ 独立占 1 拍，不在此集合内） */
const COMBINING_SMALL_KANA = new Set([
  'ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゎ',
  'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ヮ', 'ヵ', 'ヶ',
])

/**
 * 将假名读音切分为日语标准「拍（Mora）」数组。
 * - 拗音小假名（ゃゅょぁぃぅぇぉ等）与前一假名合并为 1 拍；
 * - 促音（っ/ッ）、拨音（ん/ン）、长音（ー）各自独立占 1 拍。
 */
export function splitIntoMorae(kana: string): string[] {
  const cleaned = kana.replace(/[\s・･\-‐‑]/g, '')
  if (!cleaned) return []

  const morae: string[] = []
  for (const ch of Array.from(cleaned)) {
    if (COMBINING_SMALL_KANA.has(ch) && morae.length > 0) {
      morae[morae.length - 1] += ch
    } else {
      morae.push(ch)
    }
  }
  return morae
}

/**
 * 根据总拍数和标准东京音调数字确定音调类型。
 */
export function classifyPitchType(accentNumber: number, moraCount: number): PitchType {
  if (accentNumber <= 0) return 'heiban'
  if (accentNumber === 1) return 'atamadaka'
  if (accentNumber >= moraCount) return 'odaka'
  return 'nakadaka'
}

/**
 * 由已核验的假名读音和标准东京音调数字（0..N）确定性构造高低音曲线数据。
 * 严格依据东京方言标准音调规则，不猜测音调数字。
 */
export function buildPitchPatternFromNumber(
  kana: string,
  accentNumber: number,
  source: string,
): PitchPattern | null {
  const morae = splitIntoMorae(kana)
  const n = morae.length
  if (n === 0 || accentNumber < 0 || accentNumber > n) return null

  const type = classifyPitchType(accentNumber, n)
  let moraLevels: boolean[]
  let particleHigh: boolean
  let downstepIndex: number | null

  if (accentNumber === 0) {
    // 平板型：L H H ... H (+ H)
    moraLevels = morae.map((_, i) => i > 0)
    particleHigh = true
    downstepIndex = null
  } else if (accentNumber === 1) {
    // 头高型：H L L ... L (+ L)
    moraLevels = morae.map((_, i) => i === 0)
    particleHigh = false
    downstepIndex = 0
  } else {
    // 中高型 / 尾高型：L H ... H(第accentNumber拍) L ... L (+ L)
    moraLevels = morae.map((_, i) => i >= 1 && i < accentNumber)
    particleHigh = false
    downstepIndex = accentNumber - 1
  }

  return {
    accentNumber,
    type,
    morae,
    moraLevels,
    particleHigh,
    downstepIndex,
    source,
    verified: true,
  }
}

/**
 * 精确解析 Jotoba API（底层为 Kanjium CC BY-SA 4.0）返回的 pitch 字段。
 * 实测格式：
 * - 平板型（桜 さくら）：[{part:"さ",high:false},{part:"くら",high:true}] -> [0]
 * - 头高型（箸 はし）：[{part:"は",high:true},{part:"し",high:false}] -> [1]
 * - 中高型（食べる たべる）：[{part:"た",high:false},{part:"べ",high:true},{part:"る",high:false}] -> [2]
 * - 尾高型（橋 はし）：[{part:"は",high:false},{part:"し",high:true},{part:"",high:false}] -> [2]
 */
export function parseJotobaPitch(
  kana: string,
  pitchParts: DictionaryPitchPart[] | undefined,
  source = 'Kanjium / Jotoba (CC BY-SA 4.0)',
): PitchPattern | null {
  if (!Array.isArray(pitchParts) || pitchParts.length === 0) return null

  const morae: string[] = []
  const moraLevels: boolean[] = []
  let hasTrailingDrop = false

  for (let i = 0; i < pitchParts.length; i += 1) {
    const seg = pitchParts[i]
    const partText = (seg.part ?? '').trim()
    if (!partText) {
      // 末尾空段且 high === false 表示最后一拍后存在下降核（尾高型）
      if (seg.high === false && morae.length > 0) {
        hasTrailingDrop = true
      }
      continue
    }
    const segMorae = splitIntoMorae(partText)
    for (const m of segMorae) {
      morae.push(m)
      moraLevels.push(Boolean(seg.high))
    }
  }

  if (morae.length === 0) {
    return null
  }

  const n = morae.length
  // 查找第一次从高（true）降到低（false）的位置
  let downstepIndex: number | null = null
  for (let i = 0; i < n - 1; i += 1) {
    if (moraLevels[i] && !moraLevels[i + 1]) {
      downstepIndex = i
      break
    }
  }

  // 若词内未下降，但存在末尾下降标记且最后一拍为高，则为尾高型（下降核在最后一拍）
  if (downstepIndex === null && hasTrailingDrop && moraLevels[n - 1]) {
    downstepIndex = n - 1
  }

  const accentNumber = downstepIndex === null ? 0 : downstepIndex + 1
  const type = classifyPitchType(accentNumber, n)
  const particleHigh = downstepIndex === null

  // 若传入的 kana 与解析出的 morae 拼接一致，保留精细逐拍；否则仍以解析结果为准
  void kana

  return {
    accentNumber,
    type,
    morae,
    moraLevels,
    particleHigh,
    downstepIndex,
    source,
    verified: true,
  }
}

/**
 * 格式化简明音调数字标签，例如 "[0] 平板型"、"[2] 中高型"。
 */
export function formatPitchBadge(pattern: Pick<PitchPattern, 'accentNumber' | 'type'>): string {
  const meta = PITCH_TYPE_META[pattern.type]
  return `[${pattern.accentNumber}] ${meta.zhLabel}`
}

/**
 * 生成带下降核符号 ┐ 的假名文本表示（如 "たべ┐る"、"はし┐"）。
 */
export function formatKanaWithDownstep(pattern: PitchPattern): string {
  if (pattern.downstepIndex === null) {
    return pattern.morae.join('')
  }
  return pattern.morae
    .map((m, idx) => (idx === pattern.downstepIndex ? `${m}┐` : m))
    .join('')
}
