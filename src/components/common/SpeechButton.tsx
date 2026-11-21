import { Square, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLearning } from '@/context/LearningContext'
import { cn } from '@/lib/utils'

interface SpeechButtonProps {
  id: string
  text: string
  rateOverride?: number
  label?: string
  size?: 'sm' | 'icon' | 'icon-sm'
  variant?: 'soft' | 'ghost' | 'outline'
  className?: string
}

export function SpeechButton({
  id,
  text,
  rateOverride,
  label,
  size = 'icon-sm',
  variant = 'soft',
  className,
}: SpeechButtonProps) {
  const { speakingId, speakText } = useLearning()
  const isPlaying = speakingId === id

  return (
    <Button
      type="button"
      size={label ? 'sm' : size}
      variant={isPlaying ? 'default' : variant}
      onClick={(e) => {
        e.stopPropagation()
        speakText(id, text, rateOverride)
      }}
      aria-label={isPlaying ? '停止朗读' : `朗读：${text}`}
      className={cn(isPlaying && 'ring-2 ring-primary/30', className)}
    >
      {isPlaying ? (
        <Square className="size-3.5 fill-current" />
      ) : (
        <Volume2 className="size-3.5" />
      )}
      {label && <span>{isPlaying ? '停止' : label}</span>}
    </Button>
  )
}
