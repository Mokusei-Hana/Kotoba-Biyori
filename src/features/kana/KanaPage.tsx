import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLearning } from '@/context/LearningContext'
import {
  BASIC_KANA_ROWS,
  DAKUTEN_KANA_ROWS,
  YOON_KANA_ROWS,
  type KanaRow,
} from '@/data/kana'
import { cn } from '@/lib/utils'

export function KanaPage() {
  const { speakingId, speakText } = useLearning()
  const [scriptMode, setScriptMode] = useState<'both' | 'hiragana' | 'katakana'>('both')
  const [showRomaji, setShowRomaji] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight">五十音轻量速查表</h1>
            <Badge variant="outline">辅助复习</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            点击任意假名即可朗读发音，方便在练习对话和记词时快速核对片假名或拗音。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
            {(
              [
                { id: 'both', label: '平+片对照' },
                { id: 'hiragana', label: '平假名' },
                { id: 'katakana', label: '片假名' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setScriptMode(opt.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
                  scriptMode === opt.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <Switch checked={showRomaji} onCheckedChange={setShowRomaji} />
            <span>罗马音</span>
          </label>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">清音（46音）</TabsTrigger>
          <TabsTrigger value="dakuten">浊音・半浊音</TabsTrigger>
          <TabsTrigger value="yoon">拗音</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <KanaGrid
            rows={BASIC_KANA_ROWS}
            columns={5}
            scriptMode={scriptMode}
            showRomaji={showRomaji}
            speakingId={speakingId}
            onSpeak={speakText}
          />
        </TabsContent>

        <TabsContent value="dakuten">
          <KanaGrid
            rows={DAKUTEN_KANA_ROWS}
            columns={5}
            scriptMode={scriptMode}
            showRomaji={showRomaji}
            speakingId={speakingId}
            onSpeak={speakText}
          />
        </TabsContent>

        <TabsContent value="yoon">
          <KanaGrid
            rows={YOON_KANA_ROWS}
            columns={3}
            scriptMode={scriptMode}
            showRomaji={showRomaji}
            speakingId={speakingId}
            onSpeak={speakText}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface KanaGridProps {
  rows: KanaRow[]
  columns: 3 | 5
  scriptMode: 'both' | 'hiragana' | 'katakana'
  showRomaji: boolean
  speakingId: string | null
  onSpeak: (id: string, text: string) => void
}

function KanaGrid({
  rows,
  columns,
  scriptMode,
  showRomaji,
  speakingId,
  onSpeak,
}: KanaGridProps) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.rowLabel}
          className="grid items-center gap-2"
          style={{
            gridTemplateColumns: `3.5rem repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          <span className="text-xs font-medium text-muted-foreground">{row.rowLabel}</span>
          {row.cells.map((cell, idx) => {
            if (!cell) {
              return <div key={idx} className="h-16 rounded-xl bg-muted/30" />
            }
            const id = `kana-${cell.hiragana}`
            const active = speakingId === id
            return (
              <button
                key={cell.hiragana}
                type="button"
                onClick={() => onSpeak(id, cell.hiragana)}
                className={cn(
                  'group relative flex h-16 flex-col items-center justify-center rounded-xl border border-border bg-card transition-all cursor-pointer hover:border-primary/45 hover:bg-secondary/40 active:scale-[0.97]',
                  active && 'border-primary bg-secondary ring-2 ring-primary/25',
                )}
              >
                <div className="flex items-baseline gap-1.5">
                  {(scriptMode === 'both' || scriptMode === 'hiragana') && (
                    <span className="font-display text-lg font-bold text-foreground">
                      {cell.hiragana}
                    </span>
                  )}
                  {(scriptMode === 'both' || scriptMode === 'katakana') && (
                    <span
                      className={cn(
                        'font-display font-bold',
                        scriptMode === 'both'
                          ? 'text-xs text-muted-foreground'
                          : 'text-lg text-foreground',
                      )}
                    >
                      {cell.katakana}
                    </span>
                  )}
                </div>
                {showRomaji && (
                  <span className="text-[11px] text-muted-foreground">{cell.romaji}</span>
                )}
                <Volume2 className="absolute right-1.5 top-1.5 size-3 text-primary opacity-0 transition-opacity group-hover:opacity-75" />
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
