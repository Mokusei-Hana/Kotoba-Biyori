import type { RubySegment } from '@/types/learning'
import { cn } from '@/lib/utils'

interface FuriganaTextProps {
  segments: RubySegment[]
  showFurigana: boolean
  className?: string
}

export function FuriganaText({ segments, showFurigana, className }: FuriganaTextProps) {
  return (
    <span lang="ja" className={cn('leading-loose', className)}>
      {segments.map((seg, idx) =>
        seg.reading && showFurigana ? (
          <ruby key={idx}>
            {seg.text}
            <rp>(</rp>
            <rt>{seg.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={idx}>{seg.text}</span>
        ),
      )}
    </span>
  )
}
