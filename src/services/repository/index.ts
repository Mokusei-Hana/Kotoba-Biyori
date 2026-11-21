import { LocalLearningRepository } from './localRepository'
import type { ILearningRepository } from './types'

export type { ILearningRepository } from './types'
export { createDefaultLearningState } from './localRepository'

/**
 * Active repository instance.
 * Replace this single export with a remote API implementation when adding a backend.
 */
export const learningRepository: ILearningRepository = new LocalLearningRepository()
