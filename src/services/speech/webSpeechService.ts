import type { ISpeechService, SpeechCapability, SpeechSpeakOptions } from './types'

export class WebSpeechService implements ISpeechService {
  private pickJapaneseVoice(): SpeechSynthesisVoice | undefined {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return undefined
    }
    const voices = window.speechSynthesis.getVoices()
    const jaVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('ja'))
    if (jaVoices.length === 0) return undefined

    // Prefer natural / Google / Microsoft Japanese voices when available
    return (
      jaVoices.find((v) => /nanami|haruka|google|kyoko|otoya/i.test(v.name)) ??
      jaVoices[0]
    )
  }

  getCapability(): SpeechCapability {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { supported: false, hasJapaneseVoice: false }
    }
    const jaVoice = this.pickJapaneseVoice()
    return {
      supported: true,
      hasJapaneseVoice: Boolean(jaVoice),
      voiceName: jaVoice?.name,
    }
  }

  speak(text: string, options?: SpeechSpeakOptions): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.('当前浏览器不支持原生语音朗读功能。')
      return
    }

    const cleaned = text.trim()
    if (!cleaned) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.lang = 'ja-JP'
    utterance.rate = options?.rate ?? 1

    const voice = this.pickJapaneseVoice()
    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => {
      options?.onStart?.()
    }
    utterance.onend = () => {
      options?.onEnd?.()
    }
    utterance.onerror = (event) => {
      // 'interrupted' or 'canceled' happens normally when user clicks another line
      if (event.error === 'interrupted' || event.error === 'canceled') {
        options?.onEnd?.()
        return
      }
      options?.onError?.('日语朗读未能播放，请确认系统已安装日语语音包或尝试更换浏览器。')
    }

    window.speechSynthesis.speak(utterance)
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}
