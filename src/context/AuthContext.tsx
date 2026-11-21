import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { subscribeCloudSync, type CloudSyncSnapshot } from '@/services/repository'

interface AuthActionResult {
  error: string | null
  notice?: string
}

interface AuthContextValue {
  isConfigured: boolean
  isAuthLoading: boolean
  session: Session | null
  user: User | null
  syncSnapshot: CloudSyncSnapshot
  signInWithPassword: (email: string, password: string) => Promise<AuthActionResult>
  signUpWithPassword: (email: string, password: string) => Promise<AuthActionResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured)
  const [syncSnapshot, setSyncSnapshot] = useState<CloudSyncSnapshot>({
    status: 'idle',
    lastSyncedAt: null,
    errorMessage: null,
  })

  useEffect(() => {
    return subscribeCloudSync(setSyncSnapshot)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false)
      return
    }

    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setIsAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthActionResult> => {
      if (!supabase) return { error: '未检测到 Supabase 环境变量配置。' }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const signUpWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthActionResult> => {
      if (!supabase) return { error: '未检测到 Supabase 环境变量配置。' }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })
      if (error) return { error: error.message }
      if (!data.session) {
        return {
          error: null,
          notice: '注册成功！请前往邮箱查收验证邮件，完成验证后即可登录云端同步。',
        }
      }
      return { error: null, notice: '注册并登录成功，已开启云端同步。' }
    },
    [],
  )

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isConfigured: isSupabaseConfigured,
        isAuthLoading,
        session,
        user: session?.user ?? null,
        syncSnapshot,
        signInWithPassword,
        signUpWithPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
