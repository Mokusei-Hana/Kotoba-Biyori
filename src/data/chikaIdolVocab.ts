import type { VocabItem } from '@/types/learning'

/**
 * 地下偶像 / 推活已核验词库（共 122 条）
 *
 * 来源说明：
 * - genba-ikitai.com/glossary/（109 条，仅提取客观词汇、读音与用法事实，原创简明中文释义）
 * - EDRDG JMdict（CC BY-SA 4.0，72 条交叉核验 + 13 条独立补充）
 * - Tatoeba（CC BY 2.0 FR，12 条合规真实日语例句；其余词条留空例句，不编造）
 */
export const CHIKA_IDOL_VOCAB: VocabItem[] = [
  {
    "id": "v-ci-adv",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "ADV / 前売",
        "reading": "アドバンス・まえうり"
      }
    ],
    "plainJa": "ADV / 前売",
    "reading": "アドバンス・まえうり",
    "romaji": "adobansu / maeuri",
    "zh": "预售票（Advance）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#adv",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "前売り券をここで取り扱っていますか。",
    "exampleZh": "这里有卖预售票吗？",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/140937"
  },
  {
    "id": "v-ci-door",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "DOOR / 当日",
        "reading": "ドア・とうじつ"
      }
    ],
    "plainJa": "DOOR / 当日",
    "reading": "ドア・とうじつ",
    "romaji": "doa / toujitsu",
    "zh": "当日票（Door）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#door",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-drink",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "D 代 / ドリンク代",
        "reading": "ディーだい"
      }
    ],
    "plainJa": "D 代 / ドリンク代",
    "reading": "ディーだい",
    "romaji": "diidai",
    "zh": "入场饮料费（1 Drink 代）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#drink",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-musen",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "無銭 / 無料公演",
        "reading": "むせん"
      }
    ],
    "plainJa": "無銭 / 無料公演",
    "reading": "むせん",
    "romaji": "musen",
    "zh": "免费公演（通常仍需饮料费）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#musen",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "入場料は無料です。",
    "exampleZh": "入场免费。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/10545241"
  },
  {
    "id": "v-ci-nagesen",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "投げ銭",
        "reading": "なげせん"
      }
    ],
    "plainJa": "投げ銭",
    "reading": "なげせん",
    "romaji": "nagesen",
    "zh": "打赏制 / 随喜付费",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#nagesen",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-seiban",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "整番 / 整理番号",
        "reading": "せいばん"
      }
    ],
    "plainJa": "整番 / 整理番号",
    "reading": "せいばん",
    "romaji": "seiban",
    "zh": "入场整理编号",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#seiban",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-yusen",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "優先入場",
        "reading": "ゆうせんにゅうじょう"
      }
    ],
    "plainJa": "優先入場",
    "reading": "ゆうせんにゅうじょう",
    "romaji": "yuusennyuujou",
    "zh": "优先入场",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#yusen",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-meate",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "目当て / 推し枠",
        "reading": "めあて"
      }
    ],
    "plainJa": "目当て / 推し枠",
    "reading": "めあて",
    "romaji": "meate",
    "zh": "目标出演组合 / 购票指名框",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#meate",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-torioki",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "取り置き",
        "reading": "とりおき"
      }
    ],
    "plainJa": "取り置き",
    "reading": "とりおき",
    "romaji": "torioki",
    "zh": "预留票（按预售价当日现场付款）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#torioki",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kanbai",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "完売 / SOLD OUT",
        "reading": "かんばい"
      }
    ],
    "plainJa": "完売 / SOLD OUT",
    "reading": "かんばい",
    "romaji": "kanbai",
    "zh": "售罄（SOLD OUT）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kanbai",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "チケットは完売です。",
    "exampleZh": "门票已经售罄了。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/9698765"
  },
  {
    "id": "v-ci-tojitsuken",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "当日券",
        "reading": "とうじつけん"
      }
    ],
    "plainJa": "当日券",
    "reading": "とうじつけん",
    "romaji": "toujitsuken",
    "zh": "当日券",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#tojitsuken",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "当日券はありますか。",
    "exampleZh": "有当日票吗？",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/123962"
  },
  {
    "id": "v-ci-ticket-site",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "TIGET / LivePocket",
        "reading": "チゲット・ライブポケット"
      }
    ],
    "plainJa": "TIGET / LivePocket",
    "reading": "チゲット・ライブポケット",
    "romaji": "chigetto / raibupoketto",
    "zh": "地下偶像常用票务平台（TIGET / LivePocket）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#ticket-site",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-open-start",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "OPEN / START",
        "reading": "オープン・スタート"
      }
    ],
    "plainJa": "OPEN / START",
    "reading": "オープン・スタート",
    "romaji": "oopun / sutaato",
    "zh": "开场时间（OPEN）/ 开演时间（START）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#open-start",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-nyujoretsu",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "入場列",
        "reading": "にゅうじょうれつ"
      }
    ],
    "plainJa": "入場列",
    "reading": "にゅうじょうれつ",
    "romaji": "nyuujouretsu",
    "zh": "入场排队队列",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#nyujoretsu",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-capa",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "キャパ"
      }
    ],
    "plainJa": "キャパ",
    "reading": "キャパ",
    "romaji": "kyapa",
    "zh": "场馆容纳人数（Capacity）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#capa",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-hako",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "箱",
        "reading": "はこ"
      }
    ],
    "plainJa": "箱",
    "reading": "はこ",
    "romaji": "hako",
    "zh": "Livehouse 演出场馆（“箱”）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#hako",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-floor",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "フロア"
      }
    ],
    "plainJa": "フロア",
    "reading": "フロア",
    "romaji": "furoa",
    "zh": "观众区 / 站席区（Floor）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#floor",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-saizen",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "最前",
        "reading": "さいぜん"
      }
    ],
    "plainJa": "最前",
    "reading": "さいぜん",
    "romaji": "saizen",
    "zh": "最前排",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#saizen",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "彼らはコンサートホールの最前列に座ってオーケストラを聞いた。",
    "exampleZh": "他们坐在音乐厅的最前排听管弦乐演出。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/98068"
  },
  {
    "id": "v-ci-saku",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "柵",
        "reading": "さく"
      }
    ],
    "plainJa": "柵",
    "reading": "さく",
    "romaji": "saku",
    "zh": "舞台与观众区之间的护栏",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#saku",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-shimote-kamite",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "下手 / 上手",
        "reading": "しもて・かみて"
      }
    ],
    "plainJa": "下手 / 上手",
    "reading": "しもて・かみて",
    "romaji": "shimote / kamite",
    "zh": "舞台左侧（下手）/ 舞台右侧（上手，以观众视角）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#shimote-kamite",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-cloak",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "クローク"
      }
    ],
    "plainJa": "クローク",
    "reading": "クローク",
    "romaji": "kurooku",
    "zh": "场馆行李寄存处",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#cloak",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "私は鞄と傘をクロークに預けた。",
    "exampleZh": "我把包和伞寄存在了衣帽寄存处。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/1054563"
  },
  {
    "id": "v-ci-sainyujo",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "再入場",
        "reading": "さいにゅうじょう"
      }
    ],
    "plainJa": "再入場",
    "reading": "さいにゅうじょう",
    "romaji": "sainyuujou",
    "zh": "再次入场",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sainyujo",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-buppan",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "物販",
        "reading": "ぶっぱん"
      }
    ],
    "plainJa": "物販",
    "reading": "ぶっぱん",
    "romaji": "buppan",
    "zh": "周边 / 拍立得券售卖区（物贩）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#buppan",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-tenkan",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "転換",
        "reading": "てんかん"
      }
    ],
    "plainJa": "転換",
    "reading": "てんかん",
    "romaji": "tenkan",
    "zh": "拼盘演出中组合换场间隙",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#tenkan",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-maesetsu",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "前説",
        "reading": "まえせつ"
      }
    ],
    "plainJa": "前説",
    "reading": "まえせつ",
    "romaji": "maesetsu",
    "zh": "开演前注意事项播报 / 暖场",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#maesetsu",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-taiban",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "対バン",
        "reading": "たいバン"
      }
    ],
    "plainJa": "対バン",
    "reading": "たいバン",
    "romaji": "taiban",
    "zh": "拼盘演出（多组艺人同场）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#taiban",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-oneman",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "ワンマン / 単独",
        "reading": "ワンマン・たんどく"
      }
    ],
    "plainJa": "ワンマン / 単独",
    "reading": "ワンマン・たんどく",
    "romaji": "wanman / tandoku",
    "zh": "专场演出（单组艺人）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oneman",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-teiki",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "定期公演",
        "reading": "ていきこうえん"
      }
    ],
    "plainJa": "定期公演",
    "reading": "ていきこうえん",
    "romaji": "teikikouen",
    "zh": "定期公演",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#teiki",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-seitan",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "生誕 / 生誕祭",
        "reading": "せいたん"
      }
    ],
    "plainJa": "生誕 / 生誕祭",
    "reading": "せいたん",
    "romaji": "seitan",
    "zh": "成员生诞祭 / 生日专场公演",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#seitan",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-shunen",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "周年",
        "reading": "しゅうねん"
      }
    ],
    "plainJa": "周年",
    "reading": "しゅうねん",
    "romaji": "shuunen",
    "zh": "周年纪念公演",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#shunen",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-nibusei",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "2 部制 / 昼夜",
        "reading": "にぶせい"
      }
    ],
    "plainJa": "2 部制 / 昼夜",
    "reading": "にぶせい",
    "romaji": "nibusei",
    "zh": "两部制（午场 / 晚场）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#nibusei",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-riri-ibe",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "リリイベ"
      }
    ],
    "plainJa": "リリイベ",
    "reading": "リリイベ",
    "romaji": "ririibe",
    "zh": "新碟 / 作品发行纪念活动（Release Event）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#riri-ibe",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-ohirome",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "お披露目",
        "reading": "おひろめ"
      }
    ],
    "plainJa": "お披露目",
    "reading": "おひろめ",
    "romaji": "ohirome",
    "zh": "首次公开亮相演出",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#ohirome",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-sotsugyo-koen",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "卒業公演 / ラスト",
        "reading": "そつぎょうこうえん"
      }
    ],
    "plainJa": "卒業公演 / ラスト",
    "reading": "そつぎょうこうえん",
    "romaji": "sotsugyoukouen",
    "zh": "毕业公演 / 最终场",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sotsugyo-koen",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-fes",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "フェス"
      }
    ],
    "plainJa": "フェス",
    "reading": "フェス",
    "romaji": "fesu",
    "zh": "大型拼盘音乐节 / 偶像节",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#fes",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-shusai",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "主催 / 企画",
        "reading": "しゅさい"
      }
    ],
    "plainJa": "主催 / 企画",
    "reading": "しゅさい",
    "romaji": "shusai",
    "zh": "主办演出 / 企划公演",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#shusai",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-setori",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "セトリ"
      }
    ],
    "plainJa": "セトリ",
    "reading": "セトリ",
    "romaji": "setori",
    "zh": "演出歌单（Setlist）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#setori",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-encore",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "アンコール / アンコ",
        "reading": "アンコール"
      }
    ],
    "plainJa": "アンコール / アンコ",
    "reading": "アンコール",
    "romaji": "ankooru",
    "zh": "安可 / 返场演出",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#encore",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)",
    "exampleJa": "そのピアニストはアンコールに応えて２曲弾いた。",
    "exampleZh": "这位钢琴家回应安可演奏了两首曲子。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/212708"
  },
  {
    "id": "v-ci-call",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "コール"
      }
    ],
    "plainJa": "コール",
    "reading": "コール",
    "romaji": "kooru",
    "zh": "观众应援口号（Call）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#call",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-mix",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "MIX",
        "reading": "ミックス"
      }
    ],
    "plainJa": "MIX",
    "reading": "ミックス",
    "romaji": "mikkusu",
    "zh": "歌曲间奏固定应援口号（MIX）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#mix",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-mix-ja",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "日本語 MIX",
        "reading": "にほんごミックス"
      }
    ],
    "plainJa": "日本語 MIX",
    "reading": "にほんごミックス",
    "romaji": "nihongomikkusu",
    "zh": "日语版 MIX（虎火发动等）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#mix-ja",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-mix-ainu",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "アイヌ語 MIX",
        "reading": "アイヌごミックス"
      }
    ],
    "plainJa": "アイヌ語 MIX",
    "reading": "アイヌごミックス",
    "romaji": "ainugomikkusu",
    "zh": "阿伊努语版 MIX（チャペ・アペ等）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#mix-ainu",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-mix-es",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "スペイン語 MIX",
        "reading": "スペインごミックス"
      }
    ],
    "plainJa": "スペイン語 MIX",
    "reading": "スペインごミックス",
    "romaji": "supeingomikkusu",
    "zh": "西班牙语版 MIX（バモス等）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#mix-es",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-sandan-mix",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "三連 MIX / 三段 MIX",
        "reading": "さんれんミックス"
      }
    ],
    "plainJa": "三連 MIX / 三段 MIX",
    "reading": "さんれんミックス",
    "romaji": "sanrenmikkusu",
    "zh": "三连 / 三段 MIX",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sandan-mix",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-chispa-kahen",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "チスパ可変",
        "reading": "チスパかへん"
      }
    ],
    "plainJa": "チスパ可変",
    "reading": "チスパかへん",
    "romaji": "chisupakahen",
    "zh": "可变节奏 MIX 之一（チスパ可変）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#chispa-kahen",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-yosshaikuzo",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "あーよっしゃいくぞー！"
      }
    ],
    "plainJa": "あーよっしゃいくぞー！",
    "reading": "あーよっしゃいくぞー！",
    "romaji": "aayosshaikuzoo!",
    "zh": "MIX 发动前的起头喊声",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#yosshaikuzo",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-kojo",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "口上",
        "reading": "こうじょう"
      }
    ],
    "plainJa": "口上",
    "reading": "こうじょう",
    "romaji": "koujou",
    "zh": "歌曲特定段落齐声念诵的应援词（口上）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kojo",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-gachikoi-kojo",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ガチ恋口上",
        "reading": "ガチこいこうじょう"
      }
    ],
    "plainJa": "ガチ恋口上",
    "reading": "ガチこいこうじょう",
    "romaji": "gachikoikoujou",
    "zh": "真爱口上（固定表白式应援词）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#gachikoi-kojo",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-iettaiga",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "家虎（イエッタイガー）",
        "reading": "いえとら"
      }
    ],
    "plainJa": "家虎（イエッタイガー）",
    "reading": "いえとら",
    "romaji": "ietora",
    "zh": "副歌前插入的“家虎（イエッタイガー）”喊声",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#iettaiga",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-ppph",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "PPPH",
        "reading": "ピーピーピーエイチ"
      }
    ],
    "plainJa": "PPPH",
    "reading": "ピーピーピーエイチ",
    "romaji": "piipiipiieichi",
    "zh": "拍手与跳跃组合节奏应援（オー！ハイ！）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#ppph",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-oioi",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "オイ！オイ！"
      }
    ],
    "plainJa": "オイ！オイ！",
    "reading": "オイオイ",
    "romaji": "oioi",
    "zh": "跟随节拍齐喊“Oi! Oi!”的应援",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oioi",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-furikopi",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "振りコピ",
        "reading": "ふりコピ"
      }
    ],
    "plainJa": "振りコピ",
    "reading": "ふりコピ",
    "romaji": "furikopi",
    "zh": "台下观众模仿台上成员的舞蹈动作",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#furikopi",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-wiper",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ワイパー"
      }
    ],
    "plainJa": "ワイパー",
    "reading": "ワイパー",
    "romaji": "waipaa",
    "zh": "随节奏左右挥手 / 应援棒（雨刷动作）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#wiper",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kecha",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ケチャ"
      }
    ],
    "plainJa": "ケチャ",
    "reading": "ケチャ",
    "romaji": "kecha",
    "zh": "副歌慢板处向台上伸手捧场的应援动作",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kecha",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-wotagei",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ヲタ芸",
        "reading": "ヲタげい"
      }
    ],
    "plainJa": "ヲタ芸",
    "reading": "ヲタげい",
    "romaji": "wotagei",
    "zh": "御宅艺（特定应援舞蹈与动作）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#wotagei",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-oshijan",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "推しジャン",
        "reading": "おしジャン"
      }
    ],
    "plainJa": "推しジャン",
    "reading": "おしジャン",
    "romaji": "oshijan",
    "zh": "在推的演唱段落起跳（推しジャン）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oshijan",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-masai",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "マサイ"
      }
    ],
    "plainJa": "マサイ",
    "reading": "マサイ",
    "romaji": "masai",
    "zh": "原地反复高跳应援（マサイ）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#masai",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-lift",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "リフト"
      }
    ],
    "plainJa": "リフト",
    "reading": "リフト",
    "romaji": "rifuto",
    "zh": "由他人托举起肩膀观看 / 应援（多地禁止）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#lift",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-mosh",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "モッシュ"
      }
    ],
    "plainJa": "モッシュ",
    "reading": "モッシュ",
    "romaji": "mosshu",
    "zh": "观众区推搡碰撞（多地禁止）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#mosh",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-circle",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "サークル"
      }
    ],
    "plainJa": "サークル",
    "reading": "サークル",
    "romaji": "saakuru",
    "zh": "观众区围圈跑动（多地禁止）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#circle",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-dive",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ダイブ"
      }
    ],
    "plainJa": "ダイブ",
    "reading": "ダイブ",
    "romaji": "daibu",
    "zh": "跳入人群由众人托举（多地禁止）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#dive",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-jizo",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "地蔵",
        "reading": "じぞう"
      }
    ],
    "plainJa": "地蔵",
    "reading": "じぞう",
    "romaji": "jizou",
    "zh": "全程安静站立不动观演的观众（地藏）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#jizo",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-waku",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "沸く / 沸き曲",
        "reading": "わく"
      }
    ],
    "plainJa": "沸く / 沸き曲",
    "reading": "わく",
    "romaji": "waku",
    "zh": "情绪高涨 / 嗨起来；易带动气氛的曲目（沸き曲）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#waku",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-penlight",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "ペンライト / サイリウム",
        "reading": "ペンライト"
      }
    ],
    "plainJa": "ペンライト / サイリウム",
    "reading": "ペンライト",
    "romaji": "penraito",
    "zh": "LED 应援棒 / 荧光棒",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#penlight",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kabu",
    "topic": "chika-idol",
    "subtopic": "call",
    "segments": [
      {
        "text": "被り",
        "reading": "かぶり"
      }
    ],
    "plainJa": "被り",
    "reading": "かぶり",
    "romaji": "kaburi",
    "zh": "多场演出时间重叠；或与其他人应援撞车",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kabu",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-oshi",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "推し",
        "reading": "おし"
      }
    ],
    "plainJa": "推し",
    "reading": "おし",
    "romaji": "oshi",
    "zh": "最喜欢并重点支持的成员（推）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oshi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-oshihen",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "推し変",
        "reading": "おしへん"
      }
    ],
    "plainJa": "推し変",
    "reading": "おしへん",
    "romaji": "oshihen",
    "zh": "更换主推成员（推变）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oshihen",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-hakooshi",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "箱推し",
        "reading": "はこおし"
      }
    ],
    "plainJa": "箱推し",
    "reading": "はこおし",
    "romaji": "hakooshi",
    "zh": "支持整个团体而非单人（箱推）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#hakooshi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-tannin",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "単推し",
        "reading": "たんおし"
      }
    ],
    "plainJa": "単推し",
    "reading": "たんおし",
    "romaji": "tanoshi",
    "zh": "只推团内某一位成员（单推）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#tannin",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-dd",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "DD",
        "reading": "ディーディー"
      }
    ],
    "plainJa": "DD",
    "reading": "ディーディー",
    "romaji": "diidii",
    "zh": "谁都喜欢 / 多推（誰でも大好き）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#dd",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-to",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "TO（トップオタ）",
        "reading": "ティーオー"
      }
    ],
    "plainJa": "TO（トップオタ）",
    "reading": "ティーオー",
    "romaji": "tiioo",
    "zh": "核心头号粉丝（Top Ota）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#to",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-kosan-shinki",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "古参 / 新規",
        "reading": "こさん・しんき"
      }
    ],
    "plainJa": "古参 / 新規",
    "reading": "こさん・しんき",
    "romaji": "kosan / shinki",
    "zh": "老粉（古参）/ 新粉（新規）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kosan-shinki",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-ninchi",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "認知",
        "reading": "にんち"
      }
    ],
    "plainJa": "認知",
    "reading": "にんち",
    "romaji": "ninchi",
    "zh": "被偶像记住长相或名字（认知）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#ninchi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-res",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "レス"
      }
    ],
    "plainJa": "レス",
    "reading": "レス",
    "romaji": "resu",
    "zh": "台上成员给台下的眼神 / 挥手等回应（Response）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#res",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-okini",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "オキニ"
      }
    ],
    "plainJa": "オキニ",
    "reading": "オキニ",
    "romaji": "okini",
    "zh": "偶像特别偏爱 / 熟络的粉丝（お気に入り）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#okini",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kareshizura",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "彼氏ヅラ",
        "reading": "かれしヅラ"
      }
    ],
    "plainJa": "彼氏ヅラ",
    "reading": "かれしヅラ",
    "romaji": "kareshizura",
    "zh": "以男友自居般的过度占有欲态度",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kareshizura",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-gachikoi",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "ガチ恋",
        "reading": "ガチこい"
      }
    ],
    "plainJa": "ガチ恋",
    "reading": "ガチこい",
    "romaji": "gachikoi",
    "zh": "对偶像抱有真实恋爱感情（真爱粉 / ガチ恋）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#gachikoi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-koho-kareshizura",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "後方彼氏面",
        "reading": "こうほうかれしヅラ"
      }
    ],
    "plainJa": "後方彼氏面",
    "reading": "こうほうかれしヅラ",
    "romaji": "kouhoukareshizura",
    "zh": "站在后排抱臂静观的“后方男友脸”姿态",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#koho-kareshizura",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-yakkai",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "厄介",
        "reading": "やっかい"
      }
    ],
    "plainJa": "厄介",
    "reading": "やっかい",
    "romaji": "yakkai",
    "zh": "在现场制造麻烦、破坏秩序的粉丝（厄介）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#yakkai",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-renban",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "連番",
        "reading": "れんばん"
      }
    ],
    "plainJa": "連番",
    "reading": "れんばん",
    "romaji": "renban",
    "zh": "与朋友购买连号票结伴观演（连番）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#renban",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-zaitaku",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "在宅",
        "reading": "ざいたく"
      }
    ],
    "plainJa": "在宅",
    "reading": "ざいたく",
    "romaji": "zaitaku",
    "zh": "不去现场、仅在线上关注支持的粉丝（在宅）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#zaitaku",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-chanoma",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "茶の間",
        "reading": "ちゃのま"
      }
    ],
    "plainJa": "茶の間",
    "reading": "ちゃのま",
    "romaji": "chanoma",
    "zh": "仅通过电视或网络轻度关注的观众（茶の間）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#chanoma",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-genba",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "現場",
        "reading": "げんば"
      }
    ],
    "plainJa": "現場",
    "reading": "げんば",
    "romaji": "genba",
    "zh": "偶像演出与特典会的线下活动现场",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#genba",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-shugenba",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "主現場",
        "reading": "しゅげんば"
      }
    ],
    "plainJa": "主現場",
    "reading": "しゅげんば",
    "romaji": "shugenba",
    "zh": "最常去的固定主力现场（主现场）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#shugenba",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-ensei",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "遠征",
        "reading": "えんせい"
      }
    ],
    "plainJa": "遠征",
    "reading": "えんせい",
    "romaji": "ensei",
    "zh": "跨城市 / 跨地区赴外地看演出（远征）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#ensei",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-oriru",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "降りる",
        "reading": "おりる"
      }
    ],
    "plainJa": "降りる",
    "reading": "おりる",
    "romaji": "oriru",
    "zh": "退坑 / 不再支持某团体或成员（降りる）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#oriru",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-dotan",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "同担",
        "reading": "どうたん"
      }
    ],
    "plainJa": "同担",
    "reading": "どうたん",
    "romaji": "doutan",
    "zh": "推同一位成员的其他粉丝（同担）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#dotan",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kameko",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "カメコ"
      }
    ],
    "plainJa": "カメコ",
    "reading": "カメコ",
    "romaji": "kameko",
    "zh": "在允许拍摄的现场专注拍图的摄影粉（カメコ）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kameko",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-tokutenkai",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "特典会",
        "reading": "とくてんかい"
      }
    ],
    "plainJa": "特典会",
    "reading": "とくてんかい",
    "romaji": "tokutenkai",
    "zh": "演出后的拍立得合影与互动环节（特典会）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#tokutenkai",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-cheki",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "チェキ"
      }
    ],
    "plainJa": "チェキ",
    "reading": "チェキ",
    "romaji": "cheki",
    "zh": "拍立得相纸 / 合影（Cheki）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#cheki",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-cheki-ken",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "チェキ券",
        "reading": "チェキけん"
      }
    ],
    "plainJa": "チェキ券",
    "reading": "チェキけん",
    "romaji": "chekiken",
    "zh": "拍立得拍摄兑换券",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#cheki-ken",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-sign-cheki",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "サイン入り / 落書き",
        "reading": "サインいり・らくがき"
      }
    ],
    "plainJa": "サイン入り / 落書き",
    "reading": "サインいり・らくがき",
    "romaji": "sainiri / rakugaki",
    "zh": "带成员签名或涂鸦留言的拍立得",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sign-cheki",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-lane",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "レーン"
      }
    ],
    "plainJa": "レーン",
    "reading": "レーン",
    "romaji": "reen",
    "zh": "特典会上按成员分设的排队通道",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#lane",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-hagashi",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "剥がし",
        "reading": "はがし"
      }
    ],
    "plainJa": "剥がし",
    "reading": "はがし",
    "romaji": "hagashi",
    "zh": "特典会时间到时引导粉丝离场的工作人员（剥がし）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#hagashi",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-loop",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "ループ"
      }
    ],
    "plainJa": "ループ",
    "reading": "ループ",
    "romaji": "ruupu",
    "zh": "在同一成员的特典会队列中反复重新排队（Loop）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#loop",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-sesshoku",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "接触",
        "reading": "せっしょく"
      }
    ],
    "plainJa": "接触",
    "reading": "せっしょく",
    "romaji": "sesshoku",
    "zh": "与成员面对面互动交流的活动统称（接触）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sesshoku",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-buppan-taio",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "物販対応",
        "reading": "ぶっぱんたいおう"
      }
    ],
    "plainJa": "物販対応",
    "reading": "ぶっぱんたいおう",
    "romaji": "buppantaiou",
    "zh": "由成员本人站在物贩桌前售卖周边 / 券",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#buppan-taio",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-namashashin",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "生写真",
        "reading": "なましゃしん"
      }
    ],
    "plainJa": "生写真",
    "reading": "なましゃしん",
    "romaji": "namashashin",
    "zh": "冲印版成员照片周边（生写，JMdict 亦记 なまじゃしん）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#namashashin",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-randomcheki",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "ランチェキ"
      }
    ],
    "plainJa": "ランチェキ",
    "reading": "ランチェキ",
    "romaji": "rancheki",
    "zh": "随机盲抽的成员预拍拍立得（ランチェキ）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#randomcheki",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-pincheki",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "ピンチェキ / ソロチェキ",
        "reading": "ピンチェキ"
      }
    ],
    "plainJa": "ピンチェキ / ソロチェキ",
    "reading": "ピンチェキ",
    "romaji": "pincheki",
    "zh": "仅拍摄成员单人的拍立得（不含粉丝合影）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#pincheki",
    "license": "genba-ikitai (事实核验，原创简明释义)"
  },
  {
    "id": "v-ci-unei",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "運営",
        "reading": "うんえい"
      }
    ],
    "plainJa": "運営",
    "reading": "うんえい",
    "romaji": "unei",
    "zh": "团体运营方 / 事务所团队",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#unei",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-release",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "リリース"
      }
    ],
    "plainJa": "リリース",
    "reading": "リリース",
    "romaji": "ririisu",
    "zh": "CD 或数字音源发行",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#release",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-sotsugyo-dattai",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "卒業 / 脱退",
        "reading": "そつぎょう・だったい"
      }
    ],
    "plainJa": "卒業 / 脱退",
    "reading": "そつぎょう・だったい",
    "romaji": "sotsugyou / dattai",
    "zh": "成员毕业（通常友好离队）/ 退团（脱退）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#sotsugyo-dattai",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kaisan",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "解散",
        "reading": "かいさん"
      }
    ],
    "plainJa": "解散",
    "reading": "かいさん",
    "romaji": "kaisan",
    "zh": "团体解散",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kaisan",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-shintaisei",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "新体制",
        "reading": "しんたいせい"
      }
    ],
    "plainJa": "新体制",
    "reading": "しんたいせい",
    "romaji": "shintaisei",
    "zh": "成员增减后的新阵容体制",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#shintaisei",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kenkyusei",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "研究生 / 候補生",
        "reading": "けんきゅうせい・こうほせい"
      }
    ],
    "plainJa": "研究生 / 候補生",
    "reading": "けんきゅうせい・こうほせい",
    "romaji": "kenkyuusei / kouhosei",
    "zh": "正式出道 / 升格前的预备成员（研究生 / 候补生）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kenkyusei",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-katsudo-kyushi",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "活動休止",
        "reading": "かつどうきゅうし"
      }
    ],
    "plainJa": "活動休止",
    "reading": "かつどうきゅうし",
    "romaji": "katsudoukyuushi",
    "zh": "成员或团体暂时停止活动",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#katsudo-kyushi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-chika-idol",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "地下アイドル / ライブアイドル",
        "reading": "ちかアイドル"
      }
    ],
    "plainJa": "地下アイドル / ライブアイドル",
    "reading": "ちかアイドル",
    "romaji": "chikaaidoru",
    "zh": "以 Livehouse 演出与特典会为核心活动的地下偶像 / Live 偶像",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://genba-ikitai.com/glossary/#chika-idol",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-kokuchi",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "告知",
        "reading": "こくち"
      }
    ],
    "plainJa": "告知",
    "reading": "こくち",
    "romaji": "kokuchi",
    "zh": "通过 X 等渠道发布演出 / 票务 / 特典会公告",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://genba-ikitai.com/glossary/#kokuchi",
    "license": "EDRDG JMdict (CC BY-SA 4.0) / genba-ikitai (事实核验)"
  },
  {
    "id": "v-ci-jm-oshikatsu",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "推し活",
        "reading": "おしかつ"
      }
    ],
    "plainJa": "推し活",
    "reading": "おしかつ",
    "romaji": "oshikatsu",
    "zh": "推活（为支持本命 / 偶像进行的各类应援消费与活动）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E6%8E%A8%E3%81%97%E6%B4%BB",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-oshimen",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "推しメン",
        "reading": "おしメン"
      }
    ],
    "plainJa": "推しメン",
    "reading": "おしメン",
    "romaji": "oshimen",
    "zh": "本命成员 / 最推的团员",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E6%8E%A8%E3%81%97%E3%83%A1%E3%83%B3",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-osu",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "推す",
        "reading": "おす"
      }
    ],
    "plainJa": "推す",
    "reading": "おす",
    "romaji": "osu",
    "zh": "推荐、支持、应援（推）",
    "register": "通用",
    "usageScope": "现场特化",
    "sourceUrl": "https://jisho.org/word/%E6%8E%A8%E3%81%99",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-doruota",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "ドルオタ"
      }
    ],
    "plainJa": "ドルオタ",
    "reading": "ドルオタ",
    "romaji": "doruota",
    "zh": "偶像宅（アイドルオタク 缩略）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E3%83%89%E3%83%AB%E3%82%AA%E3%82%BF",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-fansa",
    "topic": "chika-idol",
    "subtopic": "fandom",
    "segments": [
      {
        "text": "ファンサ"
      }
    ],
    "plainJa": "ファンサ",
    "reading": "ファンサ",
    "romaji": "fansa",
    "zh": "粉丝福利 / 互动回应（ファンサービス 缩略）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E3%83%95%E3%82%A1%E3%83%B3%E3%82%B5",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-akushukai",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "握手会",
        "reading": "あくしゅかい"
      }
    ],
    "plainJa": "握手会",
    "reading": "あくしゅかい",
    "romaji": "akushukai",
    "zh": "握手会",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E6%8F%A1%E6%89%8B%E4%BC%9A",
    "license": "EDRDG JMdict (CC BY-SA 4.0)",
    "exampleJa": "先週の金曜日に握手会がありました。",
    "exampleZh": "上周五举行了握手会。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/13055757"
  },
  {
    "id": "v-ci-jm-kamitaio",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "神対応",
        "reading": "かみたいおう"
      }
    ],
    "plainJa": "神対応",
    "reading": "かみたいおう",
    "romaji": "kamitaiou",
    "zh": "神对应（偶像对粉丝极其热情周到的回应）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E7%A5%9E%E5%AF%BE%E5%BF%9C",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-shiotaio",
    "topic": "chika-idol",
    "subtopic": "tokuten",
    "segments": [
      {
        "text": "塩対応",
        "reading": "しおたいおう"
      }
    ],
    "plainJa": "塩対応",
    "reading": "しおたいおう",
    "romaji": "shiotaiou",
    "zh": "盐对应（偶像对粉丝冷淡敷衍的回应）",
    "register": "通用",
    "usageScope": "圈内特有",
    "sourceUrl": "https://jisho.org/word/%E5%A1%A9%E5%AF%BE%E5%BF%9C",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-livehouse",
    "topic": "chika-idol",
    "subtopic": "venue",
    "segments": [
      {
        "text": "ライブハウス"
      }
    ],
    "plainJa": "ライブハウス",
    "reading": "ライブハウス",
    "romaji": "raibuhausu",
    "zh": "Livehouse（中小型现场演出场馆）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://jisho.org/word/%E3%83%A9%E3%82%A4%E3%83%96%E3%83%8F%E3%82%A6%E3%82%B9",
    "license": "EDRDG JMdict (CC BY-SA 4.0)",
    "exampleJa": "トークライブを専門とするライブハウスは他にもあるが、ここは特にアングラなラインナップで常連客を集めている。",
    "exampleZh": "以脱口秀现场为主的 Livehouse 还有不少，但这家靠尤其地下的演出阵容吸引着常客。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/1112534"
  },
  {
    "id": "v-ci-jm-idol",
    "topic": "chika-idol",
    "subtopic": "scene",
    "segments": [
      {
        "text": "アイドル"
      }
    ],
    "plainJa": "アイドル",
    "reading": "アイドル",
    "romaji": "aidoru",
    "zh": "偶像",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://jisho.org/word/%E3%82%A2%E3%82%A4%E3%83%89%E3%83%AB",
    "license": "EDRDG JMdict (CC BY-SA 4.0)",
    "exampleJa": "また新しいアイドルが出てきた。",
    "exampleZh": "又有新的偶像出现了。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/11044546"
  },
  {
    "id": "v-ci-jm-live",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "ライブ"
      }
    ],
    "plainJa": "ライブ",
    "reading": "ライブ",
    "romaji": "raibu",
    "zh": "现场演出（Live）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://jisho.org/word/%E3%83%A9%E3%82%A4%E3%83%96",
    "license": "EDRDG JMdict (CC BY-SA 4.0)"
  },
  {
    "id": "v-ci-jm-goods",
    "topic": "chika-idol",
    "subtopic": "show",
    "segments": [
      {
        "text": "グッズ"
      }
    ],
    "plainJa": "グッズ",
    "reading": "グッズ",
    "romaji": "guzzu",
    "zh": "周边商品（Goods）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://jisho.org/word/%E3%82%B0%E3%83%83%E3%82%BA",
    "license": "EDRDG JMdict (CC BY-SA 4.0)",
    "exampleJa": "今回のグッズは、全29種類のラインナップとなっています。",
    "exampleZh": "本次周边商品共有 29 种款式阵容。",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/13479253"
  },
  {
    "id": "v-ci-jm-ticket",
    "topic": "chika-idol",
    "subtopic": "ticket",
    "segments": [
      {
        "text": "チケット"
      }
    ],
    "plainJa": "チケット",
    "reading": "チケット",
    "romaji": "chiketto",
    "zh": "门票（Ticket）",
    "register": "通用",
    "usageScope": "演出通用",
    "sourceUrl": "https://jisho.org/word/%E3%83%81%E3%82%B1%E3%83%83%E3%83%88",
    "license": "EDRDG JMdict (CC BY-SA 4.0)",
    "exampleJa": "もうチケット買った？",
    "exampleZh": "你已经买了票吗？",
    "exampleSourceUrl": "https://tatoeba.org/en/sentences/show/11455796"
  }
]
