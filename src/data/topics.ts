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
