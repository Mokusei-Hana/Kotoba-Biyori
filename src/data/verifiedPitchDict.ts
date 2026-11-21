export interface VerifiedPitchEntry {
  id: string
  kanji: string
  kana: string
  zh: string
  pos: string[]
  /** 经过权威辞典核验的标准东京音调数字列表（按常见度排序） */
  accents: number[]
  /** 可选对比提示或发音要点 */
  note?: string
  /** 是否适合演示接助词「が」的音高变化（名词类） */
  isNoun?: boolean
  /** 可核验数据来源 */
  source: string
  sourceUrl: string
}

export interface HomophoneContrastGroup {
  id: string
  kana: string
  title: string
  summary: string
  entryIds: string[]
}

/**
 * 内置可核验标准东京音调核心词库（用于离线检索、经典同音异调对比与高频词速查）。
 * 全部词条均核验自 Kanjium / Wiktionary（CC BY-SA 4.0）标准东京音调标注，绝不由 AI 猜测。
 */
export const VERIFIED_PITCH_ENTRIES: VerifiedPitchEntry[] = [
  // === 经典同音异调组 1：はし（橋 / 箸 / 端）===
  {
    id: 'vp-hashi-bridge',
    kanji: '橋',
    kana: 'はし',
    zh: '桥、桥梁',
    pos: ['名词'],
    accents: [2],
    note: '尾高型 [2]：单读像「は↑し」，接助词「橋が」时「が」明显降为低音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E6%A9%8B',
  },
  {
    id: 'vp-hashi-chopsticks',
    kanji: '箸',
    kana: 'はし',
    zh: '筷子',
    pos: ['名词'],
    accents: [1],
    note: '头高型 [1]：第 1 拍「は」高，第 2 拍「し」立刻降为低音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%AE%B8',
  },
  {
    id: 'vp-hashi-edge',
    kanji: '端',
    kana: 'はし',
    zh: '边缘、尽头、一端',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：第 1 拍低，第 2 拍升为高音，接助词「端が」时「が」保持高音不降。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%AB%AF',
  },

  // === 经典同音异调组 2：あめ（雨 / 飴）===
  {
    id: 'vp-ame-rain',
    kanji: '雨',
    kana: 'あめ',
    zh: '雨、雨水',
    pos: ['名词'],
    accents: [1],
    note: '头高型 [1]：「あ」高、「め」低，与「飴[0]」构成最经典的 2 拍对比。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E9%9B%A8',
  },
  {
    id: 'vp-ame-candy',
    kanji: '飴',
    kana: 'あめ',
    zh: '糖果、麦芽糖',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：「あ」低、「め」高，接「飴が」时助词仍保持高音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E9%A3%B4',
  },

  // === 经典同音异调组 3：かき（柿 / 牡蠣 / 夏季）===
  {
    id: 'vp-kaki-persimmon',
    kanji: '柿',
    kana: 'かき',
    zh: '柿子',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：接「柿が」时助词保持高音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E6%9F%BF',
  },
  {
    id: 'vp-kaki-oyster',
    kanji: '牡蠣',
    kana: 'かき',
    zh: '牡蛎、生蚝',
    pos: ['名词'],
    accents: [1],
    note: '头高型 [1]：第 1 拍「か」高，第 2 拍「き」下降。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%89%A1%E8%A0%A3',
  },

  // === 经典同音异调组 4：いま（今 / 居間）===
  {
    id: 'vp-ima-now',
    kanji: '今',
    kana: 'いま',
    zh: '现在、此刻',
    pos: ['名词', '副词'],
    accents: [1],
    note: '头高型 [1]：「い」高、「ま」低。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E4%BB%8A',
  },
  {
    id: 'vp-ima-living',
    kanji: '居間',
    kana: 'いま',
    zh: '客厅、起居室',
    pos: ['名词'],
    accents: [2],
    note: '尾高型 [2]：「い」低、「ま」高，接助词「居間が」时「が」下降。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E5%B1%85%E9%96%93',
  },

  // === 经典同音异调组 5：あつい（熱い / 厚い）===
  {
    id: 'vp-atsui-hot',
    kanji: '熱い',
    kana: 'あつい',
    zh: '烫的、热烈的',
    pos: ['い形容词'],
    accents: [2],
    note: '中高型 [2]：第 2 拍「つ」达到最高后，在「い」降下。',
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%86%B1%E3%81%84',
  },
  {
    id: 'vp-atsui-thick',
    kanji: '厚い',
    kana: 'あつい',
    zh: '厚的、深厚的',
    pos: ['い形容词'],
    accents: [0],
    note: '平板型 [0]：从「つ」开始平稳保持高音。',
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E5%8E%9A%E3%81%84',
  },

  // === 高频代表词（覆盖平板 / 头高 / 中高 / 尾高 & 推活高频）===
  {
    id: 'vp-sakura',
    kanji: '桜',
    kana: 'さくら',
    zh: '樱花',
    pos: ['名词'],
    accents: [0],
    note: '最经典的 3 拍平板型 [0] 示例词。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E6%A1%9C',
  },
  {
    id: 'vp-taberu',
    kanji: '食べる',
    kana: 'たべる',
    zh: '吃、进食',
    pos: ['一段动词'],
    accents: [2],
    note: '常见 3 拍中高型 [2] 动词。',
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E9%A3%9F%E3%81%B9%E3%82%8B',
  },
  {
    id: 'vp-otoko',
    kanji: '男',
    kana: 'おとこ',
    zh: '男子、男性',
    pos: ['名词'],
    accents: [3],
    note: '经典 3 拍尾高型 [3]：接「男が」时助词「が」下降。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%94%B7',
  },
  {
    id: 'vp-nihon',
    kanji: '日本',
    kana: 'にほん',
    zh: '日本',
    pos: ['名词'],
    accents: [2],
    note: '中高型 [2]：「に」低、「ほ」高、「ん」降为低音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E6%97%A5%E6%9C%AC',
  },
  {
    id: 'vp-arigatou',
    kanji: 'ありがとう',
    kana: 'ありがとう',
    zh: '谢谢',
    pos: ['感叹词'],
    accents: [2],
    note: '中高型 [2]：第 2 拍「り」后下降，后三拍「がとう」保持低音。',
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E3%81%82%E3%82%8A%E3%81%8C%E3%81%A8%E3%81%86',
  },
  {
    id: 'vp-oshi',
    kanji: '推し',
    kana: 'おし',
    zh: '推、最喜爱的偶像或角色',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：推活高频词，接「推しが」时助词保持高音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E6%8E%A8%E3%81%97',
  },
  {
    id: 'vp-ouen',
    kanji: '応援',
    kana: 'おうえん',
    zh: '应援、加油助威',
    pos: ['名词', 'サ变动词'],
    accents: [0],
    note: '平板型 [0]：4 拍词「お・う・え・ん」，第 2 拍起平稳高音。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E5%BF%9C%E6%8F%B4',
  },
  {
    id: 'vp-tokuten',
    kanji: '特典',
    kana: 'とくてん',
    zh: '特典、特别赠品或优待',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：常用于「特典会」等现场复合表达。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E7%89%B9%E5%85%B8',
  },
  {
    id: 'vp-gakkou',
    kanji: '学校',
    kana: 'がっこう',
    zh: '学校',
    pos: ['名词'],
    accents: [0],
    note: '平板型 [0]：促音「っ」独立占 1 拍（が・っ・こ・う 共 4 拍）。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E5%AD%A6%E6%A0%A1',
  },
  {
    id: 'vp-kyou',
    kanji: '今日',
    kana: 'きょう',
    zh: '今天',
    pos: ['名词'],
    accents: [1],
    note: '头高型 [1]：拗音「きょ」合为 1 拍，共 2 拍（きょ・う）。',
    isNoun: true,
    source: 'Kanjium / Wiktionary (CC BY-SA 4.0)',
    sourceUrl: 'https://zh.wiktionary.org/wiki/%E4%BB%8A%E6%97%A5',
  },
]

export const HOMOPHONE_CONTRAST_GROUPS: HomophoneContrastGroup[] = [
  {
    id: 'grp-hashi',
    kana: 'はし',
    title: '橋 [2] · 箸 [1] · 端 [0]',
    summary: '同为 はし，一次看懂尾高型、头高型与平板型的区别',
    entryIds: ['vp-hashi-bridge', 'vp-hashi-chopsticks', 'vp-hashi-edge'],
  },
  {
    id: 'grp-ame',
    kana: 'あめ',
    title: '雨 [1] · 飴 [0]',
    summary: '最经典的头高型 vs 平板型 2 拍对照',
    entryIds: ['vp-ame-rain', 'vp-ame-candy'],
  },
  {
    id: 'grp-ima',
    kana: 'いま',
    title: '今 [1] · 居間 [2]',
    summary: '头高型与尾高型在单读和接助词时的差异',
    entryIds: ['vp-ima-now', 'vp-ima-living'],
  },
  {
    id: 'grp-atsui',
    kana: 'あつい',
    title: '熱い [2] · 厚い [0]',
    summary: 'い形容词中高型与平板型的听感对比',
    entryIds: ['vp-atsui-hot', 'vp-atsui-thick'],
  },
]
