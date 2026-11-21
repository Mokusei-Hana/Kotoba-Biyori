import { cn } from '@/lib/utils'
import {
  formatPitchBadge,
  PITCH_TYPE_META,
  type PitchPattern,
} from '@/services/pitch/pitchParser'

interface PitchAccentChartProps {
  pattern: PitchPattern
  /** lg = 音调词典完整高低音曲线图；sm = 智能词典卡片内嵌紧凑版 */
  size?: 'sm' | 'lg'
  /** 是否在末尾显示后续助词（如 が）的高低虚线节点，默认在 lg 模式下显示 */
  showParticle?: boolean
  particleLabel?: string
  className?: string
}

/**
 * 日语标准音调（Pitch Accent）高低音曲线可视化组件。
 * 严格渲染经过核验的逐拍高低序列与下降核位置。
 */
export function PitchAccentChart({
  pattern,
  size = 'lg',
  showParticle,
  particleLabel = 'が',
  className,
}: PitchAccentChartProps) {
  const meta = PITCH_TYPE_META[pattern.type]
  const includeParticle = showParticle ?? size === 'lg'

  if (size === 'sm') {
    return (
      <div className={cn('inline-flex flex-wrap items-center gap-2', className)}>
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold leading-none',
            meta.bgClass,
            meta.colorClass,
          )}
        >
          {formatPitchBadge(pattern)}
        </span>

        {/* Inline compact mora pitch line */}
        <span
          lang="ja"
          className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 text-xs font-medium tracking-wide"
          aria-label={`音调曲线：${pattern.morae.join('')}`}
        >
          {pattern.morae.map((mora, idx) => {
            const isHigh = pattern.moraLevels[idx]
            const isDownstep = pattern.downstepIndex === idx
            const prevHigh = idx > 0 ? pattern.moraLevels[idx - 1] : null
            const roseHere = prevHigh === false && isHigh

            return (
              <span
                key={`${mora}-${idx}`}
                className={cn(
                  'relative inline-block px-0.5 leading-snug',
                  isHigh ? 'text-foreground font-semibold' : 'text-muted-foreground',
                )}
              >
                {/* Top high-pitch bar */}
                {isHigh && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-primary',
                      roseHere && 'left-0',
                    )}
                  />
                )}
                {/* Rising vertical step */}
                {roseHere && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 bottom-[3px] w-[1.5px] bg-primary/65"
                  />
                )}
                {/* Downstep vertical drop bar */}
                {isDownstep && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 bottom-[2px] w-[1.5px] bg-primary"
                  />
                )}
                {mora}
              </span>
            )
          })}
          {includeParticle && (
            <span
              className={cn(
                'relative inline-block pl-1 text-[11px] opacity-70',
                pattern.particleHigh ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {pattern.particleHigh && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0.5 top-0 border-t border-dashed border-primary/70"
                />
              )}
              ({particleLabel})
            </span>
          )}
        </span>
      </div>
    )
  }

  // Full SVG pitch curve (lg)
  const moraCount = pattern.morae.length
  const totalNodes = includeParticle ? moraCount + 1 : moraCount
  const stepX = moraCount >= 7 ? 48 : 58
  const padLeft = 36
  const padRight = 24
  const width = Math.max(220, padLeft + padRight + (totalNodes - 1) * stepX + 20)
  const highY = 24
  const lowY = 58
  const labelY = 84
  const indexY = 100
  const height = 110

  const points = pattern.morae.map((mora, idx) => ({
    x: padLeft + idx * stepX,
    y: pattern.moraLevels[idx] ? highY : lowY,
    high: pattern.moraLevels[idx],
    mora,
    isDownstep: pattern.downstepIndex === idx,
    isParticle: false,
  }))

  if (includeParticle) {
    points.push({
      x: padLeft + moraCount * stepX,
      y: pattern.particleHigh ? highY : lowY,
      high: pattern.particleHigh,
      mora: particleLabel,
      isDownstep: false,
      isParticle: true,
    })
  }

  // Build SVG path segments between consecutive nodes
  const wordLinePoints = points.slice(0, moraCount)
  const wordPathD = wordLinePoints
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ')

  const lastWordPt = wordLinePoints[wordLinePoints.length - 1]
  const particlePt = includeParticle ? points[points.length - 1] : null

  return (
    <div className={cn('w-full overflow-x-auto pb-1', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${pattern.morae.join('')} 的高低音调曲线：${formatPitchBadge(pattern)}`}
        className="block select-none font-ja"
      >
        {/* Subtle High / Low reference guide lines */}
        <line
          x1={padLeft - 14}
          y1={highY}
          x2={width - 12}
          y2={highY}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
        <line
          x1={padLeft - 14}
          y1={lowY}
          x2={width - 12}
          y2={lowY}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeDasharray="3 4"
          strokeWidth="1"
        />

        {/* High / Low axis labels */}
        <text
          x={10}
          y={highY + 3.5}
          fontSize="10"
          className="fill-primary/80 font-medium"
        >
          高
        </text>
        <text
          x={10}
          y={lowY + 3.5}
          fontSize="10"
          className="fill-muted-foreground/75"
        >
          低
        </text>

        {/* Main word pitch curve */}
        {wordLinePoints.length > 1 && (
          <path
            d={wordPathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dashed connector to following particle (distinguishes 平板 vs 尾高) */}
        {lastWordPt && particlePt && (
          <line
            x1={lastWordPt.x}
            y1={lastWordPt.y}
            x2={particlePt.x}
            y2={particlePt.y}
            stroke="var(--primary)"
            strokeOpacity={pattern.downstepIndex === moraCount - 1 ? '0.85' : '0.45'}
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        )}

        {/* Downstep drop highlight marker */}
        {pattern.downstepIndex !== null && (() => {
          const fromPt = points[pattern.downstepIndex]
          const toPt = points[pattern.downstepIndex + 1]
          if (!fromPt || !toPt) return null
          const midX = (fromPt.x + toPt.x) / 2
          const midY = (fromPt.y + toPt.y) / 2
          return (
            <g aria-hidden="true">
              <circle
                cx={midX}
                cy={midY}
                r="7"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
              <path
                d={`M ${midX - 2.6} ${midY - 1.2} L ${midX} ${midY + 2} L ${midX + 2.6} ${midY - 1.2}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )
        })()}

        {/* Nodes & Mora Labels */}
        {points.map((pt, idx) => (
          <g key={`${pt.mora}-${idx}`}>
            {/* Downstep outer halo */}
            {pt.isDownstep && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="10"
                fill="var(--primary)"
                fillOpacity="0.14"
              />
            )}

            {/* Node circle */}
            {pt.isParticle ? (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5.5"
                fill="var(--card)"
                stroke={pt.high ? 'var(--primary)' : 'var(--muted-foreground)'}
                strokeWidth="1.8"
                strokeDasharray="2.5 2"
              />
            ) : (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.isDownstep ? '6.5' : '5.5'}
                fill={pt.high ? 'var(--primary)' : 'var(--card)'}
                stroke={pt.high ? 'var(--primary)' : 'var(--muted-foreground)'}
                strokeWidth="2"
              />
            )}

            {/* Kana label */}
            <text
              x={pt.x}
              y={labelY}
              textAnchor="middle"
              fontSize={pt.isParticle ? '13' : '15'}
              className={cn(
                pt.isParticle
                  ? 'fill-muted-foreground'
                  : pt.high
                    ? 'fill-foreground font-bold'
                    : 'fill-muted-foreground font-medium',
              )}
            >
              {pt.isParticle ? `(${pt.mora})` : pt.mora}
              {pt.isDownstep ? '┐' : ''}
            </text>

            {/* Mora index or particle caption */}
            <text
              x={pt.x}
              y={indexY}
              textAnchor="middle"
              fontSize="10"
              className={cn(
                pt.isDownstep ? 'fill-primary font-semibold' : 'fill-muted-foreground/70',
              )}
            >
              {pt.isParticle ? '助词' : `${idx + 1}`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
