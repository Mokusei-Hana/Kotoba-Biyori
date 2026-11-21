import type { TopicMeta } from '@/types/learning'

export const TOPICS: TopicMeta[] = [
  {
    id: 'intro',
    label: '自我介绍',
    jpLabel: '自己紹介',
    description: '初次见面破冰、介绍名字与来自哪里',
  },
  {
    id: 'greeting',
    label: '日常寒暄',
    jpLabel: 'あいさつ',
    description: '早晚问候、聊天气与近况',
  },
  {
    id: 'hobby',
    label: '兴趣爱好',
    jpLabel: '趣味の話',
    description: '聊动漫、音乐、旅行与周末日常',
  },
  {
    id: 'dining',
    label: '餐厅点餐',
    jpLabel: 'お店で注文',
    description: '入座、点单、询问推荐与结账',
  },
  {
    id: 'konbini',
    label: '便利店购物',
    jpLabel: 'コンビニ',
    description: '加热便当、购物袋与电子支付',
  },
  {
    id: 'hangout',
    label: '约饭出行',
    jpLabel: 'お出かけ',
    description: '约时间地点、发消息与道别',
  },
  {
    id: 'chika-idol',
    label: '地下偶像・推活',
    jpLabel: '地下アイドル・推し活',
    description: 'Livehouse 票务入场、公演类型、应援打 Call、特典会与推活文化实词',
    subtopics: [
      { id: 'ticket', label: '票务与料金', jpLabel: 'チケット・料金' },
      { id: 'venue', label: '入场与场馆', jpLabel: '入場・会場' },
      { id: 'show', label: '公演与演出', jpLabel: '公演・ライブ' },
      { id: 'call', label: '打 Call 与应援', jpLabel: 'コール・フロア' },
      { id: 'fandom', label: '推活与人际', jpLabel: '推し活・人と関係' },
      { id: 'tokuten', label: '特典会与接触', jpLabel: '特典会・接触' },
      { id: 'scene', label: '运营与活动', jpLabel: '活動・シーン' },
    ],
  },
  {
    id: 'custom',
    label: '自定义词句',
    jpLabel: 'マイノート',
    description: '自己记录的实用表达与生词',
  },
]

export const TOPIC_MAP = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<
  TopicMeta['id'],
  TopicMeta
>

export function getSubtopicLabel(topicId: TopicMeta['id'], subtopicId?: string): string | undefined {
  if (!subtopicId) return undefined
  return TOPIC_MAP[topicId]?.subtopics?.find((s) => s.id === subtopicId)?.label
}
