import React, { useRef, useState } from 'react'
import { Download, RotateCcw, Settings2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLearning } from '@/context/LearningContext'
import type { SpeechRate } from '@/types/learning'

export function SettingsDialog() {
  const {
    state,
    updatePreferences,
    exportBackup,
    importBackup,
    resetAllData,
    showToast,
  } = useLearning()
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const json = await exportBackup()
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kotoba-biyori-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast('已导出学习数据备份 JSON', 'success')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    try {
      const text = await file.text()
      await importBackup(text)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : '导入失败，请检查文件格式。')
    } finally {
      e.target.value = ''
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setImportError(null)
          setConfirmReset(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="偏好设置与数据备份" title="设置与备份">
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>学习偏好与数据备份</DialogTitle>
          <DialogDescription>
            调整注音显示、朗读语速，或导出/导入本地学习记录。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">显示汉字振假名（ふりがな）</p>
              <p className="text-xs text-muted-foreground">在汉字上方标注平假名读音</p>
            </div>
            <Switch
              checked={state.preferences.showFurigana}
              onCheckedChange={(checked) => void updatePreferences({ showFurigana: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">辅助显示罗马音</p>
              <p className="text-xs text-muted-foreground">适合初学阶段快速核对发音</p>
            </div>
            <Switch
              checked={state.preferences.showRomaji}
              onCheckedChange={(checked) => void updatePreferences({ showRomaji: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">默认朗读语速</p>
              <p className="text-xs text-muted-foreground">跟读时推荐 0.75x 慢速起步</p>
            </div>
            <Select
              value={String(state.preferences.speechRate)}
              onValueChange={(val) =>
                void updatePreferences({ speechRate: Number(val) as SpeechRate })
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.75">0.75x 慢速</SelectItem>
                <SelectItem value="1">1.0x 标准</SelectItem>
                <SelectItem value="1.15">1.15x 稍快</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">每日学习活力目标</p>
              <p className="text-xs text-muted-foreground">每完成词卡复习或对话练习自动累计</p>
            </div>
            <Select
              value={String(state.preferences.dailyGoal)}
              onValueChange={(val) => void updatePreferences({ dailyGoal: Number(val) })}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">轻松 · 8</SelectItem>
                <SelectItem value="12">标准 · 12</SelectItem>
                <SelectItem value="20">进阶 · 20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium">本地数据备份（JSON）</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => void handleExport()}>
                <Download className="size-3.5" />
                导出备份
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-3.5" />
                导入恢复
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => void handleFileChange(e)}
              />
            </div>

            {importError && (
              <p className="text-xs text-destructive">{importError}</p>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              如需重新开始，可清空所有本地进度与自定义词句。
            </p>
            {confirmReset ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  void resetAllData()
                  setConfirmReset(false)
                }}
              >
                确认清空
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setConfirmReset(true)}
              >
                <RotateCcw className="size-3.5" />
                重置数据
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
