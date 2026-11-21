import { WebSpeechService } from './webSpeechService'
import type { ISpeechService } from './types'

export type { ISpeechService, SpeechCapability, SpeechSpeakOptions } from './types'

/**
 * Active speech service instance.
 * Swap to a VOICEVOX / cloud TTS adapter here without touching UI components.
 */
export const speechService: ISpeechService = new WebSpeechService()
