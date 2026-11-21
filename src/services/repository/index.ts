import { SupabaseLearningRepository } from './supabaseRepository'
import type { ILearningRepository } from './types'

export type { ILearningRepository } from './types'
export type { CloudSyncSnapshot, CloudSyncStatus } from './supabaseRepository'
export { createDefaultLearningState } from './localRepository'

const supabaseRepository = new SupabaseLearningRepository()

/**
 * Active repository instance.
 * Uses LocalStorage seamlessly when offline/signed out, and syncs to Supabase when signed in.
 */
export const learningRepository: ILearningRepository = supabaseRepository

export const subscribeCloudSync = supabaseRepository.subscribeSync.bind(supabaseRepository)
