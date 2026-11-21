import { AppShell } from '@/components/layout/AppShell'
import { ErrorBanner, LoadingView } from '@/components/common/StateViews'
import { AuthProvider } from '@/context/AuthContext'
import { LearningProvider, useLearning } from '@/context/LearningContext'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { DialoguesPage } from '@/features/dialogues/DialoguesPage'
import { FlashcardsPage } from '@/features/flashcards/FlashcardsPage'
import { GrammarPage } from '@/features/grammar/GrammarPage'
import { KanaPage } from '@/features/kana/KanaPage'
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
