import type { JmdictVerbClass } from '@/services/dictionary/dictionaryService'

export type VerbGroup = JmdictVerbClass

export interface ConjugationRow {
  key: string
  name: string
  jpName: string
  form: string
  reading: string
  rule: string
  note: string
  isSpecial?: boolean
}

export interface CuratedVerbEntry {
  kanji: string
  kana: string
  group: VerbGroup
  zh: string
  isException?: boolean
  exceptionNote?: string
}

export const VERB_GROUP_META: Record<
  VerbGroup,
  { label: string; jpLabel: string; summary: string }
> = {
  godan: {
    label: '五段动词（1 类）',
    jpLabel: '五段活用',
    summary: '词尾假名在 あ・い・う・え・お 五段间变化，て/た形依词尾产生音便。',
  },
  ichidan: {
    label: '一段动词（2 类）',
    jpLabel: '一段活用',
    summary: '以「い段 / え段 + る」结尾，变形时直接去掉词尾「る」接续各形态。',
  },
  suru: {
    label: 'サ变动词（不规则）',
    jpLabel: 'サ行変格活用',
    summary: '「する」及「名词 + する」构成，词干在 し・す・さ 间变化，可能形为「できる」。',
  },
  kuru: {
    label: 'カ变动词（不规则）',
    jpLabel: 'カ行変格活用',
    summary: '「来る（くる）」及其复合词，汉字「来」的读音随活用在 く・き・こ 间切换。',
  },
}

/**
 * 常见「形似一段但实为五段」的例外动词（精确列出，杜绝规则误判）
 */
export const GODAN_RU_EXCEPTIONS = new Set<string>([
  '帰る', 'かえる',
  '入る', 'はいる',
  '走る', 'はしる',
  '切る', 'きる',
  '知る', 'しる',
  '要る', 'いる',
  '減る', 'へる',
  '喋る', 'しゃべる',
  '滑る', 'すべる',
  '焦る', 'あせる',
  '限る', 'かぎる',
  '蹴る', 'ける',
  '散る', 'ちる',
  '照る', 'てる',
  '握る', 'にぎる',
  '練る', 'ねる',
  '参る', 'まいる',
  '混じる', 'まじる',
  '嘲る', 'あざける',
  '覆る', 'くつがえる',
  '遮る', 'さえぎる',
  '茂る', 'しげる',
  '湿る', 'しめる',
  '罵る', 'ののしる',
  '捻る', 'ひねる',
  '翻る', 'ひるがえる',
  '蘇る', 'よみがえる',
  '裏切る', 'うらぎる',
  '区切る', 'くぎる',
  '千切る', 'ちぎる',
  '横切る', 'よこぎる',
  '思い切る', 'おもいきる',
  '割り切る', 'わりきる',
  'いらっしゃる', 'おっしゃる', 'くださる', 'なさる', 'ござる',
])

/**
 * 精选高频与代表性动词核验表（提供精准中文释义、读音与特殊变形标注）
 */
export const CURATED_VERBS: CuratedVerbEntry[] = [
  { kanji: '食べる', kana: 'たべる', group: 'ichidan', zh: '吃' },
  { kanji: '見る', kana: 'みる', group: 'ichidan', zh: '看、观看' },
  { kanji: '起きる', kana: 'おきる', group: 'ichidan', zh: '起床、发生' },
  { kanji: '降りる', kana: 'おりる', group: 'ichidan', zh: '下车；退坑（推活）' },
  { kanji: '温める', kana: 'あたためる', group: 'ichidan', zh: '加热' },
  { kanji: 'くれる', kana: 'くれる', group: 'ichidan', zh: '给（我/我方）', isException: true, exceptionNote: '命令形特殊：为「くれ」（非「くれろ」）。' },
  { kanji: '行く', kana: 'いく', group: 'godan', zh: '去、前往', isException: true, exceptionNote: 'て/た形特殊：发生促音便「行って / 行った」（非「行いて」）。' },
  { kanji: '帰る', kana: 'かえる', group: 'godan', zh: '回去、回家', isException: true, exceptionNote: '形似一段（え段+る）但实为五段动词（帰ります / 帰らない）。' },
  { kanji: '入る', kana: 'はいる', group: 'godan', zh: '进入、加入', isException: true, exceptionNote: '形似一段（い段+る）但实为五段动词（入ります / 入らない）。' },
  { kanji: '走る', kana: 'はしる', group: 'godan', zh: '跑、奔跑', isException: true, exceptionNote: '形似一段（い段+る）但实为五段动词（走ります / 走らない）。' },
  { kanji: '知る', kana: 'しる', group: 'godan', zh: '知道、认识', isException: true, exceptionNote: '形似一段（い段+る）但实为五段动词（知ります / 知らない）。' },
  { kanji: '切る', kana: 'きる', group: 'godan', zh: '切、剪、挂断', isException: true, exceptionNote: '形似一段（い段+る）但实为五段动词（切ります / 切らない）。' },
  { kanji: '買う', kana: 'かう', group: 'godan', zh: '买、购买' },
  { kanji: '書く', kana: 'かく', group: 'godan', zh: '写、书写' },
  { kanji: '泳ぐ', kana: 'およぐ', group: 'godan', zh: '游泳' },
  { kanji: '話す', kana: 'はなす', group: 'godan', zh: '说话、交谈' },
  { kanji: '推す', kana: 'おす', group: 'godan', zh: '推荐、支持、应援（推）' },
  { kanji: '待つ', kana: 'まつ', group: 'godan', zh: '等待' },
  { kanji: '死ぬ', kana: 'しぬ', group: 'godan', zh: '死（现代日语唯一ぬ尾五段动词）' },
  { kanji: '遊ぶ', kana: 'あそぶ', group: 'godan', zh: '玩、游玩' },
  { kanji: '飲む', kana: 'のむ', group: 'godan', zh: '喝、饮用' },
  { kanji: '読む', kana: 'よむ', group: 'godan', zh: '读、阅读' },
  { kanji: 'ある', kana: 'ある', group: 'godan', zh: '有、存在（无生命）', isException: true, exceptionNote: 'ない形特殊：直接变为「ない」（非「あらない」）。' },
  { kanji: '問う', kana: 'とう', group: 'godan', zh: '询问、追究', isException: true, exceptionNote: 'て/た形特殊：发生ウ音便「問うて / 問うた」（非促音便）。' },
  { kanji: 'おっしゃる', kana: 'おっしゃる', group: 'godan', zh: '说（尊他语）', isException: true, exceptionNote: '敬语特殊五段：ます形为「おっしゃいます」，命令形为「おっしゃい」。' },
  { kanji: 'くださる', kana: 'くださる', group: 'godan', zh: '给（尊他语）', isException: true, exceptionNote: '敬语特殊五段：ます形为「くださいます」，命令形为「ください」。' },
  { kanji: 'いらっしゃる', kana: 'いらっしゃる', group: 'godan', zh: '在 / 来 / 去（尊他语）', isException: true, exceptionNote: '敬语特殊五段：ます形为「いらっしゃいます」，命令形为「いらっしゃい」。' },
  { kanji: 'する', kana: 'する', group: 'suru', zh: '做、干', isException: true, exceptionNote: 'サ行变格动词，可能形为「できる」。' },
  { kanji: '勉強する', kana: 'べんきょうする', group: 'suru', zh: '学习' },
  { kanji: '応援する', kana: 'おうえんする', group: 'suru', zh: '加油、应援、支持' },
  { kanji: '来る', kana: 'くる', group: 'kuru', zh: '来、到来', isException: true, exceptionNote: 'カ行变格动词，「来」读音随活用在 く / き / こ 间变化。' },
]

const GODAN_TABLE: Record<
  string,
  {
    a: string
    i: string
    e: string
    o: string
    te: string
    ta: string
    teRule: string
  }
> = {
  う: { a: 'わ', i: 'い', e: 'え', o: 'おう', te: 'って', ta: 'った', teRule: 'う → って（促音便）' },
  く: { a: 'か', i: 'き', e: 'け', o: 'こう', te: 'いて', ta: 'いた', teRule: 'く → いて（イ音便）' },
  ぐ: { a: 'が', i: 'ぎ', e: 'げ', o: 'ごう', te: 'いで', ta: 'いだ', teRule: 'ぐ → いで（イ音便+浊音）' },
  す: { a: 'さ', i: 'し', e: 'せ', o: 'そう', te: 'して', ta: 'した', teRule: 'す → して' },
  つ: { a: 'た', i: 'ち', e: 'て', o: 'とう', te: 'って', ta: 'った', teRule: 'つ → って（促音便）' },
  ぬ: { a: 'な', i: 'に', e: 'ね', o: 'のう', te: 'んで', ta: 'んだ', teRule: 'ぬ → んで（拨音便）' },
  ぶ: { a: 'ば', i: 'び', e: 'べ', o: 'ぼう', te: 'んで', ta: 'んだ', teRule: 'ぶ → んで（拨音便）' },
  む: { a: 'ま', i: 'み', e: 'め', o: 'もう', te: 'んで', ta: 'んだ', teRule: 'む → んで（拨音便）' },
  る: { a: 'ら', i: 'り', e: 'れ', o: 'ろう', te: 'って', ta: 'った', teRule: 'る → って（促音便）' },
}

const I_OR_E_ROW = new Set([
  'い', 'き', 'ぎ', 'し', 'じ', 'ち', 'ぢ', 'に', 'ひ', 'び', 'ぴ', 'み', 'り',
  'え', 'け', 'げ', 'せ', 'ぜ', 'て', 'で', 'ね', 'へ', 'べ', 'ぺ', 'め', 'れ',
])

const HONORIFIC_GODAN = new Set([
  'いらっしゃる',
  'おっしゃる',
  'くださる',
  '下さる',
  'なさる',
  '為さる',
  'ござる',
])

const U_ONBIN_VERBS = new Set(['問う', 'とう', '請う', 'こう', '厭う', 'いとう'])

export function findCuratedVerb(query: string): CuratedVerbEntry | undefined {
  const q = query.trim()
  return CURATED_VERBS.find((v) => v.kanji === q || v.kana === q)
}

/**
 * Deterministic verb group inference when JMdict metadata is unavailable.
 */
export function inferVerbGroup(kanji: string, kana: string): VerbGroup | null {
  const w = kanji.trim()
  const k = (kana || kanji).trim()
  if (!k) return null

  const curated = findCuratedVerb(w) || findCuratedVerb(k)
  if (curated) return curated.group

  if (w === '来る' || w === 'くる' || w.endsWith('て来る') || w.endsWith('てくる')) {
    return 'kuru'
  }
  if (w === 'する' || k.endsWith('する')) {
    return 'suru'
  }
  const last = k.slice(-1)
  if (!GODAN_TABLE[last]) return null

  if (last === 'る') {
    if (GODAN_RU_EXCEPTIONS.has(w) || GODAN_RU_EXCEPTIONS.has(k)) {
      return 'godan'
    }
    const prev = k.slice(-2, -1)
    if (I_OR_E_ROW.has(prev)) {
      return 'ichidan'
    }
    return 'godan'
  }

  return 'godan'
}

function isIkuVerb(kanji: string, kana: string): boolean {
  return (
    kanji === '行く' ||
    kanji === 'いく' ||
    kanji.endsWith('て行く') ||
    kanji.endsWith('ていく') ||
    kana === 'いく' ||
    kana.endsWith('ていく')
  )
}

function isAruVerb(kanji: string, kana: string): boolean {
  return kanji === 'ある' || kanji === '有る' || kanji === '在る' || kana === 'ある'
}

/**
 * Pure deterministic Japanese verb conjugation engine.
 */
export function conjugateVerb(
  kanjiInput: string,
  kanaInput: string,
  group: VerbGroup,
): { rows: ConjugationRow[]; specialNotes: string[] } {
  const kanji = kanjiInput.trim()
  const kana = (kanaInput || kanjiInput).trim()
  const specialNotes: string[] = []

  // 1. カ变动词 (来る / 〜来る)
  if (group === 'kuru') {
    const usesKanji = kanji.endsWith('来る')
    const kanjiPrefix = usesKanji ? kanji.slice(0, -2) : kanji.slice(0, -2)
    const kanaPrefix = kana.endsWith('くる') ? kana.slice(0, -2) : kana.slice(0, -2)
    const fmt = (kanjiTail: string, kanaTail: string) => ({
      form: usesKanji ? `${kanjiPrefix}来${kanjiTail}` : `${kanjiPrefix}${kanaTail}`,
      reading: `${kanaPrefix}${kanaTail}`,
    })

    specialNotes.push('カ行变格动词（不规则）：「来」的读音随活用在 く・き・こ 之间切换。')

    return {
      specialNotes,
      rows: [
        { key: 'dict', name: '辞书形', jpName: '辞書形', ...fmt('る', 'くる'), rule: '原形', note: '词典收录形式、简体现在/将来肯定' },
        { key: 'masu', name: 'ます形', jpName: 'ます形', ...fmt('ます', 'きます'), rule: 'くる → きます', note: '礼貌体肯定，日常会话最常用', isSpecial: true },
        { key: 'te', name: 'て形', jpName: 'て形', ...fmt('て', 'きて'), rule: 'くる → きて', note: '连接动作、请求（〜てください）、进行态', isSpecial: true },
        { key: 'ta', name: 'た形', jpName: 'た形', ...fmt('た', 'きた'), rule: 'くる → きた', note: '简体过去肯定', isSpecial: true },
        { key: 'nai', name: 'ない形', jpName: 'ない形', ...fmt('ない', 'こない'), rule: 'くる → こない', note: '简体否定（注意读音变为 こない）', isSpecial: true },
        { key: 'potential', name: '可能形', jpName: '可能形', ...fmt('られる', 'こられる'), rule: 'くる → こられる', note: '表示“能够来”（口语偶见 こられる→これる）', isSpecial: true },
        { key: 'passive', name: '被动形', jpName: '受身形', ...fmt('られる', 'こられる'), rule: 'くる → こられる', note: '表示被动或受损被动（如“被突然造访”）', isSpecial: true },
        { key: 'causative', name: '使役形', jpName: '使役形', ...fmt('させる', 'こさせる'), rule: 'くる → こさせる', note: '表示“让/使某人来”', isSpecial: true },
        { key: 'causativePassive', name: '使役被动形', jpName: '使役受身形', ...fmt('させられる', 'こさせられる'), rule: 'くる → こさせられる', note: '表示“被迫前来”', isSpecial: true },
        { key: 'volitional', name: '意向形', jpName: '意向形', ...fmt('よう', 'こよう'), rule: 'くる → こよう', note: '表示意志或提议“来吧”', isSpecial: true },
        { key: 'imperative', name: '命令形', jpName: '命令形', ...fmt('い', 'こい'), rule: 'くる → こい', note: '强烈命令（语气较强，日常慎用）', isSpecial: true },
        { key: 'prohibitive', name: '禁止形', jpName: '禁止形', ...fmt('るな', 'くるな'), rule: '辞书形 + な', note: '强烈禁止“别来”' },
        { key: 'conditional', name: '条件形', jpName: 'ば形', ...fmt('れば', 'くれば'), rule: 'くる → くれば', note: '假定条件“如果来的话”' },
      ],
    }
  }

  // 2. サ变动词 (する / 〜する)
  if (group === 'suru') {
    const kStem = kanji.endsWith('する') ? kanji.slice(0, -2) : kanji
    const rStem = kana.endsWith('する') ? kana.slice(0, -2) : kana
    const fmt = (tail: string) => ({ form: `${kStem}${tail}`, reading: `${rStem}${tail}` })

    specialNotes.push('サ行变格动词（不规则）：可能形特殊，直接变为「〜できる」。')

    return {
      specialNotes,
      rows: [
        { key: 'dict', name: '辞书形', jpName: '辞書形', ...fmt('する'), rule: '原形', note: '词典收录形式、简体现在/将来肯定' },
        { key: 'masu', name: 'ます形', jpName: 'ます形', ...fmt('します'), rule: 'する → します', note: '礼貌体肯定' },
        { key: 'te', name: 'て形', jpName: 'て形', ...fmt('して'), rule: 'する → して', note: '连接动作、请求（〜してください）' },
        { key: 'ta', name: 'た形', jpName: 'た形', ...fmt('した'), rule: 'する → した', note: '简体过去肯定' },
        { key: 'nai', name: 'ない形', jpName: 'ない形', ...fmt('しない'), rule: 'する → しない', note: '简体否定' },
        { key: 'potential', name: '可能形', jpName: '可能形', ...fmt('できる'), rule: 'する → できる', note: '表示“能够做……”（特殊变形）', isSpecial: true },
        { key: 'passive', name: '被动形', jpName: '受身形', ...fmt('される'), rule: 'する → される', note: '表示被动“被……”' },
        { key: 'causative', name: '使役形', jpName: '使役形', ...fmt('させる'), rule: 'する → させる', note: '表示“让/使……”' },
        { key: 'causativePassive', name: '使役被动形', jpName: '使役受身形', ...fmt('させられる'), rule: 'する → させられる', note: '表示“被迫做……”' },
        { key: 'volitional', name: '意向形', jpName: '意向形', ...fmt('しよう'), rule: 'する → しよう', note: '表示意志或提议“做吧”' },
        { key: 'imperative', name: '命令形', jpName: '命令形', ...fmt('しろ'), rule: 'する → しろ（书面：せよ）', note: '强烈命令' },
        { key: 'prohibitive', name: '禁止形', jpName: '禁止形', ...fmt('するな'), rule: '辞书形 + な', note: '强烈禁止“别做”' },
        { key: 'conditional', name: '条件形', jpName: 'ば形', ...fmt('すれば'), rule: 'する → すれば', note: '假定条件“如果做的话”' },
      ],
    }
  }

  // 3. 一段动词 (Ichidan)
  if (group === 'ichidan') {
    const kStem = kanji.endsWith('る') ? kanji.slice(0, -1) : kanji
    const rStem = kana.endsWith('る') ? kana.slice(0, -1) : kana
    const fmt = (tail: string) => ({ form: `${kStem}${tail}`, reading: `${rStem}${tail}` })
    const isKureru = kanji === 'くれる' || kana === 'くれる'

    if (isKureru) {
      specialNotes.push('「くれる」为特殊一段动词：命令形为「くれ」（而非「くれろ」）。')
    }

    return {
      specialNotes,
      rows: [
        { key: 'dict', name: '辞书形', jpName: '辞書形', form: kanji, reading: kana, rule: '原形（い/え段 + る）', note: '词典收录形式、简体现在/将来肯定' },
        { key: 'masu', name: 'ます形', jpName: 'ます形', ...fmt('ます'), rule: '去 る + ます', note: '礼貌体肯定' },
        { key: 'te', name: 'て形', jpName: 'て形', ...fmt('て'), rule: '去 る + て', note: '连接动作、请求、进行态' },
        { key: 'ta', name: 'た形', jpName: 'た形', ...fmt('た'), rule: '去 る + た', note: '简体过去肯定' },
        { key: 'nai', name: 'ない形', jpName: 'ない形', ...fmt('ない'), rule: '去 る + ない', note: '简体否定' },
        { key: 'potential', name: '可能形', jpName: '可能形', ...fmt('られる'), rule: '去 る + られる', note: '表示能力/可能（口语常见去ら形「〜れる」，标准语用「られる」）' },
        { key: 'passive', name: '被动形', jpName: '受身形', ...fmt('られる'), rule: '去 る + られる', note: '与可能形同形，依上下文区分' },
        { key: 'causative', name: '使役形', jpName: '使役形', ...fmt('させる'), rule: '去 る + させる', note: '表示“让/使……”' },
        { key: 'causativePassive', name: '使役被动形', jpName: '使役受身形', ...fmt('させられる'), rule: '去 る + させられる', note: '表示“被迫……”' },
        { key: 'volitional', name: '意向形', jpName: '意向形', ...fmt('よう'), rule: '去 る + よう', note: '表示意志或提议' },
        {
          key: 'imperative',
          name: '命令形',
          jpName: '命令形',
          ...(isKureru ? fmt('') : fmt('ろ')),
          rule: isKureru ? '特殊：くれる → くれ' : '去 る + ろ（书面：よ）',
          note: isKureru ? '「くれる」的特殊命令形' : '强烈命令',
          isSpecial: isKureru,
        },
        { key: 'prohibitive', name: '禁止形', jpName: '禁止形', form: `${kanji}な`, reading: `${kana}な`, rule: '辞书形 + な', note: '强烈禁止' },
        { key: 'conditional', name: '条件形', jpName: 'ば形', ...fmt('れば'), rule: '去 る + れば', note: '假定条件“如果……的话”' },
      ],
    }
  }

  // 4. 五段动词 (Godan)
  const last = kana.slice(-1)
  const col = GODAN_TABLE[last] ?? GODAN_TABLE['る']
  const kStem = kanji.slice(0, -1)
  const rStem = kana.slice(0, -1)
  const fmt = (tail: string) => ({ form: `${kStem}${tail}`, reading: `${rStem}${tail}` })

  const iku = isIkuVerb(kanji, kana)
  const aru = isAruVerb(kanji, kana)
  const honorific = HONORIFIC_GODAN.has(kanji) || HONORIFIC_GODAN.has(kana)
  const uOnbin = U_ONBIN_VERBS.has(kanji) || U_ONBIN_VERBS.has(kana)
  const isRuException = last === 'る' && (GODAN_RU_EXCEPTIONS.has(kanji) || GODAN_RU_EXCEPTIONS.has(kana))

  if (iku) {
    specialNotes.push('「行く」特殊音便：て形/た形为促音便「行って / 行った」（非「行いて」）。')
  }
  if (aru) {
    specialNotes.push('「ある」特殊否定：ない形直接为「ない」（非「あらない」）。')
  }
  if (honorific) {
    specialNotes.push('敬语特殊五段动词：ます形词尾由「り」变为「い」，命令形亦省去「れ」。')
  }
  if (uOnbin) {
    specialNotes.push('特殊ウ音便五段动词：て/た形为「〜うて / 〜うた」而非促音便。')
  }
  if (isRuException && !honorific) {
    specialNotes.push('形似一段（い/え段 + る）但实为五段动词（例外五段），变形须按五段规则。')
  }

  const masuForm = honorific ? fmt('います') : fmt(`${col.i}ます`)
  const teForm = iku ? fmt('って') : uOnbin ? fmt('うて') : fmt(col.te)
  const taForm = iku ? fmt('った') : uOnbin ? fmt('うた') : fmt(col.ta)
  const naiForm = aru ? { form: 'ない', reading: 'ない' } : fmt(`${col.a}ない`)
  const imperativeForm = honorific ? fmt('い') : fmt(col.e)

  // 五段使役被动：す尾仅「させられる」，其他五段常见缩约形「〜される」
  const causativePassive =
    last === 'す'
      ? { ...fmt(`${col.a}せられる`), rule: `${last} → ${col.a}せられる`, note: 'す尾五段不缩约' }
      : {
          ...fmt(`${col.a}せられる`),
          rule: `${last} → ${col.a}せられる（口语缩约：${kStem}${col.a}される）`,
          note: '表示“被迫……”，口语中常缩约为「〜される」',
        }

  return {
    specialNotes,
    rows: [
      { key: 'dict', name: '辞书形', jpName: '辞書形', form: kanji, reading: kana, rule: `原形（${last}尾五段）`, note: '词典收录形式、简体现在/将来肯定' },
      {
        key: 'masu',
        name: 'ます形',
        jpName: 'ます形',
        ...masuForm,
        rule: honorific ? '特殊：る → います' : `${last} → ${col.i} + ます`,
        note: '礼貌体肯定',
        isSpecial: honorific,
      },
      {
        key: 'te',
        name: 'て形',
        jpName: 'て形',
        ...teForm,
        rule: iku ? '特殊：く → って（促音便）' : uOnbin ? '特殊：う → うて（ウ音便）' : col.teRule,
        note: '连接动作、请求、进行态',
        isSpecial: iku || uOnbin,
      },
      {
        key: 'ta',
        name: 'た形',
        jpName: 'た形',
        ...taForm,
        rule: iku ? '特殊：く → った（促音便）' : uOnbin ? '特殊：う → うた（ウ音便）' : `${last} → ${col.ta}`,
        note: '简体过去肯定',
        isSpecial: iku || uOnbin,
      },
      {
        key: 'nai',
        name: 'ない形',
        jpName: 'ない形',
        ...naiForm,
        rule: aru ? '特殊：ある → ない' : last === 'う' ? '特殊：う → わ + ない' : `${last} → ${col.a} + ない`,
        note: '简体否定',
        isSpecial: aru || last === 'う',
      },
      {
        key: 'potential',
        name: '可能形',
        jpName: '可能形',
        ...(aru ? { form: 'あり得る', reading: 'ありえる' } : fmt(`${col.e}る`)),
        rule: aru ? '通常不直接变可能形，常用「あり得る」' : `${last} → ${col.e} + る`,
        note: aru ? '表示“有可能存在/发生”' : '表示能力/可能（变形后按一段动词活用）',
        isSpecial: aru,
      },
      {
        key: 'passive',
        name: '被动形',
        jpName: '受身形',
        ...fmt(`${col.a}れる`),
        rule: `${last} → ${col.a} + れる`,
        note: '表示被动或受损被动',
      },
      {
        key: 'causative',
        name: '使役形',
        jpName: '使役形',
        ...fmt(`${col.a}せる`),
        rule: `${last} → ${col.a} + せる`,
        note: '表示“让/使……”',
      },
      {
        key: 'causativePassive',
        name: '使役被动形',
        jpName: '使役受身形',
        ...causativePassive,
      },
      {
        key: 'volitional',
        name: '意向形',
        jpName: '意向形',
        ...fmt(col.o),
        rule: `${last} → ${col.o}`,
        note: '表示意志或提议“……吧”',
      },
      {
        key: 'imperative',
        name: '命令形',
        jpName: '命令形',
        ...imperativeForm,
        rule: honorific ? '特殊：る → い' : `${last} → ${col.e}`,
        note: honorific ? '敬语命令形（常用作礼貌请求如「ください」）' : '强烈命令',
        isSpecial: honorific,
      },
      {
        key: 'prohibitive',
        name: '禁止形',
        jpName: '禁止形',
        form: `${kanji}な`,
        reading: `${kana}な`,
        rule: '辞书形 + な',
        note: '强烈禁止',
      },
      {
        key: 'conditional',
        name: '条件形',
        jpName: 'ば形',
        ...fmt(`${col.e}ば`),
        rule: `${last} → ${col.e} + ば`,
        note: '假定条件“如果……的话”',
      },
    ],
  }
}
