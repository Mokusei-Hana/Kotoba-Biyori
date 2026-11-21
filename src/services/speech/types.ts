export interface SpeechSpeakOptions {
  rate?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (message: string) => void
}

export interface SpeechCapability {
  supported: boolean
  hasJapaneseVoice: boolean
  voiceName?: string
}

/**
 * Pluggable speech synthesis service interface.
 * Implement this interface to connect VOICEVOX, Azure Neural TTS, or OpenAI TTS in the future.
 */
export interface ISpeechService {
  getCapability(): SpeechCapability
  speak(text: string, options?: SpeechSpeakOptions): void
  stop(): void
}
