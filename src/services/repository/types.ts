import type { LearningState, SrsRecord, UserPreferences, VocabItem } from '@/types/learning'

/**
 * Repository abstraction for learning persistence.
 * Async signatures allow swapping LocalStorage for a REST/Supabase backend
 * without changing any UI components.
 */
export interface ILearningRepository {
  loadState(): Promise<LearningState>
  saveState(state: LearningState): Promise<void>
  updatePreferences(partial: Partial<UserPreferences>): Promise<LearningState>
  recordDailyAction(dateKey: string, amount?: number): Promise<LearningState>
  toggleDialogueCompleted(scenarioId: string): Promise<LearningState>
  toggleGrammarMastered(grammarId: string): Promise<LearningState>
  toggleVocabBookmark(vocabId: string): Promise<LearningState>
  upsertSrsRecord(record: SrsRecord): Promise<LearningState>
  addCustomVocab(item: VocabItem): Promise<LearningState>
  deleteCustomVocab(id: string): Promise<LearningState>
  exportBackupJson(): Promise<string>
  importBackupJson(rawJson: string): Promise<LearningState>
  resetAll(): Promise<LearningState>
}
