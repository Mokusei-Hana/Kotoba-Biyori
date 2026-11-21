import { supabase } from '@/lib/supabase'
import type { LearningState, SrsRecord, UserPreferences, VocabItem } from '@/types/learning'
import { createDefaultLearningState, LocalLearningRepository } from './localRepository'
import type { ILearningRepository } from './types'

const TABLE_NAME = 'user_learning_states'

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface CloudSyncSnapshot {
  status: CloudSyncStatus
  lastSyncedAt: string | null
  errorMessage: string | null
}

type SyncListener = (snapshot: CloudSyncSnapshot) => void

function mergeWithDefaults(parsed: Partial<LearningState> | null | undefined): LearningState {
  const defaults = createDefaultLearningState()
  if (!parsed || typeof parsed !== 'object') return defaults
  return {
    version: defaults.version,
    preferences: {
      ...defaults.preferences,
      ...(parsed.preferences ?? {}),
    },
    completedDialogues: Array.isArray(parsed.completedDialogues) ? parsed.completedDialogues : [],
    masteredGrammar: Array.isArray(parsed.masteredGrammar) ? parsed.masteredGrammar : [],
    bookmarkedVocab: Array.isArray(parsed.bookmarkedVocab) ? parsed.bookmarkedVocab : [],
    srsRecords: parsed.srsRecords && typeof parsed.srsRecords === 'object' ? parsed.srsRecords : {},
    customVocab: Array.isArray(parsed.customVocab) ? parsed.customVocab : [],
    dailyActivities:
      parsed.dailyActivities && typeof parsed.dailyActivities === 'object'
        ? parsed.dailyActivities
        : {},
    lastVisitedRoute: parsed.lastVisitedRoute,
  }
}

function formatSupabaseError(error: { code?: string; message?: string }): string {
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return '尚未在 Supabase 中创建 user_learning_states 表，请在 SQL Editor 执行 supabase/schema.sql。'
  }
  return error.message || '云端同步失败，当前已保留本地记录。'
}

/**
 * Local-first + Supabase cloud-synced repository.
 * - Signed out / unconfigured: transparently uses LocalStorage.
 * - Signed in: reads & upserts user_learning_states in Supabase while keeping LocalStorage cached.
 */
export class SupabaseLearningRepository implements ILearningRepository {
  private readonly local = new LocalLearningRepository()
  private readonly listeners = new Set<SyncListener>()
  private snapshot: CloudSyncSnapshot = {
    status: 'idle',
    lastSyncedAt: null,
    errorMessage: null,
  }

  subscribeSync(listener: SyncListener): () => void {
    this.listeners.add(listener)
    listener(this.snapshot)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(partial: Partial<CloudSyncSnapshot>) {
    this.snapshot = { ...this.snapshot, ...partial }
    for (const listener of this.listeners) {
      listener(this.snapshot)
    }
  }

  private async getSignedInUserId(): Promise<string | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.user?.id ?? null
  }

  private async pushToCloud(userId: string, state: LearningState): Promise<void> {
    if (!supabase) return
    this.emit({ status: 'syncing', errorMessage: null })
    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        user_id: userId,
        state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

    if (error) {
      this.emit({ status: 'error', errorMessage: formatSupabaseError(error) })
      return
    }
    this.emit({
      status: 'synced',
      lastSyncedAt: new Date().toISOString(),
      errorMessage: null,
    })
  }

  async loadState(): Promise<LearningState> {
    const localState = await this.local.loadState()
    const userId = await this.getSignedInUserId()
    if (!userId || !supabase) {
      this.emit({ status: 'idle', errorMessage: null })
      return localState
    }

    this.emit({ status: 'syncing', errorMessage: null })
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('state')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      this.emit({ status: 'error', errorMessage: formatSupabaseError(error) })
      return localState
    }

    if (data?.state) {
      const merged = mergeWithDefaults(data.state as Partial<LearningState>)
      await this.local.saveState(merged)
      this.emit({
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        errorMessage: null,
      })
      return merged
    }

    // First-time cloud login: upload existing local progress to Supabase
    await this.pushToCloud(userId, localState)
    return localState
  }

  async saveState(state: LearningState): Promise<void> {
    await this.local.saveState(state)
    const userId = await this.getSignedInUserId()
    if (userId) {
      await this.pushToCloud(userId, state)
    }
  }

  private async mutate(action: () => Promise<LearningState>): Promise<LearningState> {
    const next = await action()
    const userId = await this.getSignedInUserId()
    if (userId) {
      void this.pushToCloud(userId, next)
    }
    return next
  }

  async updatePreferences(partial: Partial<UserPreferences>): Promise<LearningState> {
    return this.mutate(() => this.local.updatePreferences(partial))
  }

  async recordDailyAction(dateKey: string, amount?: number): Promise<LearningState> {
    return this.mutate(() => this.local.recordDailyAction(dateKey, amount))
  }

  async toggleDialogueCompleted(scenarioId: string): Promise<LearningState> {
    return this.mutate(() => this.local.toggleDialogueCompleted(scenarioId))
  }

  async toggleGrammarMastered(grammarId: string): Promise<LearningState> {
    return this.mutate(() => this.local.toggleGrammarMastered(grammarId))
  }

  async toggleVocabBookmark(vocabId: string): Promise<LearningState> {
    return this.mutate(() => this.local.toggleVocabBookmark(vocabId))
  }

  async upsertSrsRecord(record: SrsRecord): Promise<LearningState> {
    return this.mutate(() => this.local.upsertSrsRecord(record))
  }

  async addCustomVocab(item: VocabItem): Promise<LearningState> {
    return this.mutate(() => this.local.addCustomVocab(item))
  }

  async deleteCustomVocab(id: string): Promise<LearningState> {
    return this.mutate(() => this.local.deleteCustomVocab(id))
  }

  async exportBackupJson(): Promise<string> {
    return this.local.exportBackupJson()
  }

  async importBackupJson(rawJson: string): Promise<LearningState> {
    const next = await this.local.importBackupJson(rawJson)
    const userId = await this.getSignedInUserId()
    if (userId) {
      await this.pushToCloud(userId, next)
    }
    return next
  }

  async resetAll(): Promise<LearningState> {
    const fresh = createDefaultLearningState()
    await this.local.saveState(fresh)
    const userId = await this.getSignedInUserId()
    if (userId) {
      await this.pushToCloud(userId, fresh)
    }
    return fresh
  }
}
