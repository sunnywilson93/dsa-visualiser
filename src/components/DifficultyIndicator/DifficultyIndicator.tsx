'use client'

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'

interface DifficultyIndicatorProps {
  level: DifficultyLevel
  size?: 'sm' | 'md' | 'lg'
}

const levelToDisplay: Record<DifficultyLevel, string> = {
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

const sizeClasses = {
  sm: 'text-xs py-0.5 px-1.5',
  md: 'text-xs py-0.5 px-2',
  lg: 'text-sm py-1 px-2.5',
}

export function DifficultyIndicator({
  level,
  size = 'md',
}: DifficultyIndicatorProps) {
  const displayText = levelToDisplay[level]
  const color = levelToColor[level]

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md ${sizeClasses[size]}`}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
      role="status"
      aria-label={`Difficulty: ${level}`}
    >
      {displayText}
    </span>
  )
}
