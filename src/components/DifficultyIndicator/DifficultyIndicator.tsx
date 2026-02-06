'use client'

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'

interface DifficultyIndicatorProps {
  level: DifficultyLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const levelToFilled: Record<DifficultyLevel, number> = {
  easy: 1,
  beginner: 1,
  medium: 2,
  intermediate: 2,
  hard: 3,
  advanced: 3,
}

const levelToLabel: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  beginner: 'Easy',
  medium: 'Med',
  intermediate: 'Med',
  hard: 'Hard',
  advanced: 'Hard',
}

const levelToColor: Record<DifficultyLevel, string> = {
  easy: 'var(--difficulty-1)',
  beginner: 'var(--difficulty-1)',
  medium: 'var(--difficulty-2)',
  intermediate: 'var(--difficulty-2)',
  hard: 'var(--difficulty-3)',
  advanced: 'var(--difficulty-3)',
}

const TOTAL_BARS = 3

const barSizes = {
  sm: { width: 3, height: 10, gap: 2, fontSize: 'text-2xs' },
  md: { width: 4, height: 12, gap: 2, fontSize: 'text-xs' },
  lg: { width: 5, height: 14, gap: 3, fontSize: 'text-xs' },
}

export function DifficultyIndicator({
  level,
  size = 'md',
  showLabel = true,
}: DifficultyIndicatorProps) {
  const filled = levelToFilled[level]
  const label = levelToLabel[level]
  const color = levelToColor[level]
  const dims = barSizes[size]

  return (
    <span
      className="inline-flex items-center"
      style={{ gap: dims.gap + 4 }}
      role="status"
      aria-label={`Difficulty: ${level}`}
    >
      <span
        className="inline-flex items-end"
        style={{ gap: dims.gap }}
        aria-hidden="true"
      >
        {Array.from({ length: TOTAL_BARS }, (_, i) => {
          const isFilled = i < filled
          return (
            <span
              key={i}
              style={{
                width: dims.width,
                height: dims.height - (TOTAL_BARS - 1 - i) * 2,
                borderRadius: 1,
                backgroundColor: isFilled ? color : 'rgba(255,255,255,0.1)',
                boxShadow: isFilled ? `0 0 6px ${color}` : 'none',
                transition: 'all 0.2s ease',
              }}
            />
          )
        })}
      </span>
      {showLabel && (
        <span
          className={`${dims.fontSize} font-semibold leading-none`}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
