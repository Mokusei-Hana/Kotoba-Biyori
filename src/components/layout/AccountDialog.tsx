import React, { useState } from 'react'
import { Cloud, CloudAlert, LogOut, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'
import { useLearning } from '@/context/LearningContext'
import { cn } from '@/lib/utils'

export function AccountDialog() {
  const {
    isConfigured,
    user,
    syncSnapshot,
    signInWithPassword,
    signUpWithPassword,
    signOut,
  } = useAuth()
  const { reload, showToast } = useLearning()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setNotice(null)

    if (!email.trim() || password.length < 6) {
      setFormError('请输入有效邮箱，且密码不少于 6 位。')
      return
    }

    setSubmitting(true)
    try {
      const res =
        mode === 'login'
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password)

      if (res.error) {
        setFormError(res.error)
      } else if (res.notice) {
        setNotice(res.notice)
        setPassword('')
      } else {
        setPassword('')
        setOpen(false)
        showToast('已登录并开启 Supabase 云端同步', 'success')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    showToast('已退出登录，切换回本地存储模式')
    setOpen(false)
  }

  const handleManualSync = async () => {
    await reload()
    showToast('已从云端拉取最新学习记录', 'success')
  }

  const isError = syncSnapshot.status === 'error'
  const isSynced = Boolean(user) && syncSnapshot.status === 'synced'

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setFormError(null)
          setNotice(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={user ? '云端账号与同步状态' : '登录开启云端同步'}
          title={user ? `已登录：${user.email}` : 'Supabase 云同步'}
          className="relative"
        >
          {isError ? (
            <CloudAlert className="size-4 text-destructive" />
          ) : (
            <Cloud className={cn('size-4', isSynced ? 'text-success' : user && 'text-primary')} />
          )}
          {user && !isError && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-success" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supabase 云端同步</DialogTitle>
          <DialogDescription>
            登录账号后，你的打卡记录、闪卡间隔进度与自定义词句会自动同步到云端。
          </DialogDescription>
        </DialogHeader>

        {!isConfigured ? (
          <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">尚未检测到 Supabase 环境变量</p>
            <p>
              请在项目根目录的 <code>.env.local</code> 中配置{' '}
              <code>VITE_SUPABASE_URL</code> 与{' '}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> 后重启开发服务器。
            </p>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">当前登录账号</span>
                <Badge
                  variant={
                    syncSnapshot.status === 'error'
                      ? 'destructive'
                      : syncSnapshot.status === 'synced'
                        ? 'success'
                        : 'secondary'
                  }
                >
                  {syncSnapshot.status === 'syncing'
                    ? '同步中...'
                    : syncSnapshot.status === 'synced'
                      ? '云端已同步'
                      : syncSnapshot.status === 'error'
                        ? '同步异常'
                        : '已连接'}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground break-all">{user.email}</p>
              {syncSnapshot.lastSyncedAt && (
                <p className="text-xs text-muted-foreground">
                  上次同步：{new Date(syncSnapshot.lastSyncedAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            {syncSnapshot.errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-xs text-destructive leading-relaxed">
                {syncSnapshot.errorMessage}
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => void handleManualSync()}>
                <RefreshCw className="size-3.5" />
                立即同步
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="size-3.5" />
                退出登录
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as 'login' | 'signup')
              setFormError(null)
              setNotice(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">账号登录</TabsTrigger>
              <TabsTrigger value="signup">注册新账号</TabsTrigger>
            </TabsList>

            <TabsContent value={mode} className="mt-4">
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium">邮箱</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">密码（至少 6 位）</label>
                  <Input
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                  />
                </div>

                {formError && <p className="text-xs text-destructive">{formError}</p>}
                {notice && <p className="text-xs text-success">{notice}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting
                    ? '提交中...'
                    : mode === 'login'
                      ? '登录并同步进度'
                      : '注册账号'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
