import React from 'react'
import {
  AlertTriangle,
  BookA,
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
import { AccountDialog } from '@/components/layout/AccountDialog'
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
  { id: 'dictionary', label: '智能词典', icon: BookA },
]

export function AppShell({ route, navigate, children }: AppShellProps) {
  const { state, weakVocab, updatePreferences, speechError, clearSpeechError, toast } = useLearning()
  const isDark = state.preferences.theme === 'dark'

  const toggleTheme = () => {
    void updatePreferences({ theme: isDark ? 'light' : 'dark' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Desktop & Mobile Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xs">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-6">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="flex shrink-0 items-center gap-2 text-left cursor-pointer group whitespace-nowrap"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-200 group-hover:scale-105">
              <Flower2 className="size-4.5" />
            </span>
            <div className="leading-tight">
              <span className="font-display text-[15px] font-bold tracking-wide text-foreground whitespace-nowrap">
                ことば日和
              </span>
              <span className="hidden xl:block text-[10px] text-muted-foreground whitespace-nowrap">
                日常日语口语手账
              </span>
            </div>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0" aria-label="主导航">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon
              const active = route === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
                    active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                >
                  <Icon className={cn('hidden lg:block size-3.5 shrink-0', active && 'text-primary')} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Learning Tools: Mistakes & Kana */}
            <Button
              variant={route === 'mistakes' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => navigate('mistakes')}
              className="relative h-8 px-2 lg:px-2.5 gap-1.5 text-xs whitespace-nowrap shrink-0"
              aria-label="错词本"
              title="错词本（集中复习不认识与模糊词）"
            >
              <AlertTriangle className="size-3.5 shrink-0 text-warning" />
              <span className="hidden lg:inline">错词本</span>
              {weakVocab.length > 0 && (
                <span className="rounded-full bg-warning/15 px-1.5 py-0 text-[10px] font-semibold leading-4 text-warning">
                  {weakVocab.length}
                </span>
              )}
            </Button>

            <Button
              variant={route === 'kana' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => navigate('kana')}
              className="h-8 px-2 lg:px-2.5 gap-1.5 text-xs whitespace-nowrap shrink-0"
              aria-label="五十音速查"
              title="五十音轻量速查表"
            >
              <Grid2x2 className="size-3.5 shrink-0 text-primary" />
              <span className="hidden lg:inline">五十音</span>
            </Button>

            <span className="hidden sm:block mx-0.5 h-4 w-px bg-border/80" aria-hidden="true" />

            {/* System Controls */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label={isDark ? '切换为淡樱浅色模式' : '切换为夜樱深色模式'}
              title={isDark ? '浅色模式' : '夜樱深色模式'}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <AccountDialog />

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
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
      >
        <div className="grid grid-cols-5 h-16 px-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            const active = route === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer',
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
