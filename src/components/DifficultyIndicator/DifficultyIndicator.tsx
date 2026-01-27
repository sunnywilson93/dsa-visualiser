'use client'

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'

interface DifficultyIndicatorProps {
  level: DifficultyLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const levelToNumber: Record<DifficultyLevel, number> = {
  easy: 1,
  beginner: 1,
  medium: 2,
  intermediate: 2,
  hard: 3,
  advanced: 3,
}

const levelToColor: Record<number, string> = {
  1: 'var(--difficulty-1)',
  2: 'var(--difficulty-2)',
  3: 'var(--difficulty-3)',
}

const sizeClasses = {
  sm: {
    dot: 'w-[5px] h-[5px]',
    dotsGap: 'gap-0.5',
    label: 'text-xs',
  },
  md: {
    dot: 'w-[7px] h-[7px]',
    dotsGap: 'gap-[3px]',
    label: 'text-2xs',
  },
  lg: {
    dot: 'w-[9px] h-[9px]',
    dotsGap: 'gap-1',
    label: 'text-sm',
  },
}

export function DifficultyIndicator({
  level,
  size = 'md',
  showLabel = false,
}: DifficultyIndicatorProps) {
  const numericLevel = levelToNumber[level]
  const color = levelToColor[numericLevel]
  const totalDots = 3
  const sizes = sizeClasses[size]

  return (
    <div
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={`Difficulty: ${level}`}
      title={level}
    >
      <div className={`flex items-center ${sizes.dotsGap}`}>
        {Array.from({ length: totalDots }, (_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-fast ${sizes.dot} ${
              i < numericLevel ? '' : 'bg-white-15'
            }`}
            style={
              i < numericLevel
                ? { backgroundColor: color, boxShadow: `0 0 6px ${color}` }
                : undefined
            }
          />
        ))}
      </div>
      {showLabel && (
        <span className={`font-bold tracking-tight ${sizes.label}`} style={{ color }}>
          {numericLevel === 1 ? 'I' : numericLevel === 2 ? 'II' : 'III'}
        </span>
      )}
    </div>
  )
}
