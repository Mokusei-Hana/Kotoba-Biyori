import type { LearningState, SrsRecord, UserPreferences, VocabItem } from '@/types/learning'
import type { ILearningRepository } from './types'

const STORAGE_KEY = 'kotoba_biyori_state_v1'
const CURRENT_VERSION = 1

export function createDefaultLearningState(): LearningState {
  return {
    version: CURRENT_VERSION,
    preferences: {
      theme: 'light',
      showFurigana: true,
      showRomaji: false,
      speechRate: 1,
      dailyGoal: 12,
    },
    completedDialogues: [],
    masteredGrammar: [],
    bookmarkedVocab: [],
    srsRecords: {},
    customVocab: [],
    dailyActivities: {},
  }
}

function mergeWithDefaults(parsed: Partial<LearningState>): LearningState {
  const defaults = createDefaultLearningState()
  return {
    version: CURRENT_VERSION,
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

export class LocalLearningRepository implements ILearningRepository {
  private readSync(): LearningState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return createDefaultLearningState()
      const parsed = JSON.parse(raw) as Partial<LearningState>
      return mergeWithDefaults(parsed)
    } catch {
      return createDefaultLearningState()
    }
  }

  private writeSync(state: LearningState): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  async loadState(): Promise<LearningState> {
    return this.readSync()
  }

  async saveState(state: LearningState): Promise<void> {
    this.writeSync(state)
  }

  async updatePreferences(partial: Partial<UserPreferences>): Promise<LearningState> {
    const current = this.readSync()
    const next: LearningState = {
      ...current,
      preferences: { ...current.preferences, ...partial },
    }
    this.writeSync(next)
    return next
  }

  async recordDailyAction(dateKey: string, amount = 1): Promise<LearningState> {
    const current = this.readSync()
    const prevCount = current.dailyActivities[dateKey] ?? 0
    const next: LearningState = {
      ...current,
      dailyActivities: {
        ...current.dailyActivities,
        [dateKey]: prevCount + amount,
      },
    }
    this.writeSync(next)
    return next
  }

  async toggleDialogueCompleted(scenarioId: string): Promise<LearningState> {
    const current = this.readSync()
    const exists = current.completedDialogues.includes(scenarioId)
    const next: LearningState = {
      ...current,
      completedDialogues: exists
        ? current.completedDialogues.filter((id) => id !== scenarioId)
        : [...current.completedDialogues, scenarioId],
    }
    this.writeSync(next)
    return next
  }

  async toggleGrammarMastered(grammarId: string): Promise<LearningState> {
    const current = this.readSync()
    const exists = current.masteredGrammar.includes(grammarId)
    const next: LearningState = {
      ...current,
      masteredGrammar: exists
        ? current.masteredGrammar.filter((id) => id !== grammarId)
        : [...current.masteredGrammar, grammarId],
    }
    this.writeSync(next)
    return next
  }

  async toggleVocabBookmark(vocabId: string): Promise<LearningState> {
    const current = this.readSync()
    const exists = current.bookmarkedVocab.includes(vocabId)
    const next: LearningState = {
      ...current,
      bookmarkedVocab: exists
        ? current.bookmarkedVocab.filter((id) => id !== vocabId)
        : [...current.bookmarkedVocab, vocabId],
    }
    this.writeSync(next)
    return next
  }

  async upsertSrsRecord(record: SrsRecord): Promise<LearningState> {
    const current = this.readSync()
    const next: LearningState = {
      ...current,
      srsRecords: {
        ...current.srsRecords,
        [record.itemId]: record,
      },
    }
    this.writeSync(next)
    return next
  }

  async addCustomVocab(item: VocabItem): Promise<LearningState> {
    const current = this.readSync()
    const next: LearningState = {
      ...current,
      customVocab: [item, ...current.customVocab],
    }
    this.writeSync(next)
    return next
  }

  async deleteCustomVocab(id: string): Promise<LearningState> {
    const current = this.readSync()
    const { [id]: _removed, ...restSrs } = current.srsRecords
    const next: LearningState = {
      ...current,
      customVocab: current.customVocab.filter((v) => v.id !== id),
      bookmarkedVocab: current.bookmarkedVocab.filter((b) => b !== id),
      srsRecords: restSrs,
    }
    this.writeSync(next)
    return next
  }

  async exportBackupJson(): Promise<string> {
    const current = this.readSync()
    return JSON.stringify(current, null, 2)
  }

  async importBackupJson(rawJson: string): Promise<LearningState> {
    let parsed: unknown
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      throw new Error('JSON 格式无效，请检查备份文件内容。')
    }
    if (!parsed || typeof parsed !== 'object' || !('preferences' in parsed)) {
      throw new Error('备份文件结构不符合「ことば日和」的数据格式。')
    }
    const merged = mergeWithDefaults(parsed as Partial<LearningState>)
    this.writeSync(merged)
    return merged
  }

  async resetAll(): Promise<LearningState> {
    const fresh = createDefaultLearningState()
    this.writeSync(fresh)
    return fresh
  }
}
