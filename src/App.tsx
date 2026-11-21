import { AppShell } from '@/components/layout/AppShell'
import { ErrorBanner, LoadingView } from '@/components/common/StateViews'
import { AuthProvider } from '@/context/AuthContext'
import { LearningProvider, useLearning } from '@/context/LearningContext'
import { ConjugationPage } from '@/features/conjugation/ConjugationPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { DialoguesPage } from '@/features/dialogues/DialoguesPage'
import { DictionaryPage } from '@/features/dictionary/DictionaryPage'
import { FlashcardsPage } from '@/features/flashcards/FlashcardsPage'
import { GrammarPage } from '@/features/grammar/GrammarPage'
import { KanaPage } from '@/features/kana/KanaPage'
import { MistakesPage } from '@/features/mistakes/MistakesPage'
import { PitchDictionaryPage } from '@/features/pitch/PitchDictionaryPage'
import { useHashRoute } from '@/hooks/useHashRoute'

function AppContent() {
  const { route, param, navigate } = useHashRoute()
  const { isLoading, error, reload } = useLearning()

  return (
    <AppShell route={route} navigate={navigate}>
      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => void reload()} />
      ) : route === 'dashboard' ? (
        <DashboardPage navigate={navigate} />
      ) : route === 'dialogues' ? (
        <DialoguesPage
          selectedId={param}
          onSelectScenario={(id) => navigate('dialogues', id)}
        />
      ) : route === 'flashcards' ? (
        <FlashcardsPage />
      ) : route === 'grammar' ? (
        <GrammarPage />
      ) : route === 'dictionary' ? (
        <DictionaryPage initialQuery={param} navigate={navigate} />
      ) : route === 'pitch' ? (
        <PitchDictionaryPage initialQuery={param} navigate={navigate} />
      ) : route === 'conjugation' ? (
        <ConjugationPage initialVerb={param} navigate={navigate} />
      ) : route === 'mistakes' ? (
        <MistakesPage navigate={navigate} />
      ) : (
        <KanaPage />
      )}
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppContent />
      </LearningProvider>
    </AuthProvider>
  )
}
