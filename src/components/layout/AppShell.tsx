import React from 'react'
import {
  BookOpenText,
  Flower2,
  Grid2x2,
  Home,
  Layers,
  MessageCircleHeart,
  Moon,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorBanner } from '@/components/common/StateViews'
import { SettingsDialog } from '@/components/layout/SettingsDialog'
import { useLearning } from '@/context/LearningContext'
import type { AppRoute } from '@/hooks/useHashRoute'
import { cn } from '@/lib/utils'

interface AppShellProps {
  route: AppRoute
  navigate: (route: AppRoute, param?: string) => void
  children: React.ReactNode
}

const PRIMARY_NAV: { id: AppRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: '今日学习', icon: Home },
  { id: 'dialogues', label: '场景对话', icon: MessageCircleHeart },
  { id: 'flashcards', label: '口语闪卡', icon: Layers },
  { id: 'grammar', label: '实用句型', icon: BookOpenText },
]

export function AppShell({ route, navigate, children }: AppShellProps) {
  const { state, updatePreferences, speechError, clearSpeechError, toast } = useLearning()
  const isDark = state.preferences.theme === 'dark'

  const toggleTheme = () => {
    void updatePreferences({ theme: isDark ? 'light' : 'dark' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Desktop & Mobile Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-200 group-hover:scale-105">
              <Flower2 className="size-4.5" />
            </span>
            <div className="leading-tight">
              <span className="font-display text-base font-bold tracking-wide text-foreground">
                ことば日和
              </span>
              <span className="hidden sm:block text-[11px] text-muted-foreground">
                日常日语口语手账
              </span>
            </div>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="主导航">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon
              const active = route === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer',
                    active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                >
                  <Icon className={cn('size-4', active && 'text-primary')} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant={route === 'kana' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => navigate('kana')}
              className="gap-1.5 text-xs"
              title="五十音轻量速查表"
            >
              <Grid2x2 className="size-3.5 text-primary" />
              <span className="hidden sm:inline">五十音速查</span>
              <span className="sm:hidden">五十音</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label={isDark ? '切换为淡樱浅色模式' : '切换为夜樱深色模式'}
              title={isDark ? '浅色模式' : '夜樱深色模式'}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <SettingsDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-12">
        {speechError && (
          <div className="mb-5">
            <ErrorBanner message={speechError} onDismiss={clearSpeechError} />
          </div>
        )}
        {children}
      </main>

      {/* Subtle Footer (Desktop) */}
      <footer className="hidden md:block border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        ことば日和 · 毎日すこしずつ、自然な日本語へ
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="移动端导航"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      >
        <div className="grid grid-cols-4 h-16 px-2">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            const active = route === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors cursor-pointer',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                    active && 'bg-secondary',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Lightweight Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'fixed right-4 bottom-20 md:bottom-6 z-50 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-md transition-all',
            toast.tone === 'success'
              ? 'border-success/30 bg-popover text-foreground'
              : toast.tone === 'error'
                ? 'border-destructive/30 bg-destructive text-destructive-foreground'
                : 'border-border bg-popover text-popover-foreground',
          )}
        >
          {toast.text}
        </div>
      )}
    </div>
  )
}
