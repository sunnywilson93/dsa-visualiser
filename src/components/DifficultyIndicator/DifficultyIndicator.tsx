'use client'

import styles from './DifficultyIndicator.module.css'

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

export function DifficultyIndicator({
  level,
  size = 'md',
  showLabel = false,
}: DifficultyIndicatorProps) {
  const numericLevel = levelToNumber[level]
  const color = levelToColor[numericLevel]
  const totalDots = 3

  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      role="img"
      aria-label={`Difficulty: ${level}`}
      title={level}
    >
      <div className={styles.dots}>
        {Array.from({ length: totalDots }, (_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < numericLevel ? styles.filled : styles.empty}`}
            style={i < numericLevel ? { backgroundColor: color, boxShadow: `0 0 6px ${color}` } : undefined}
          />
        ))}
      </div>
      {showLabel && (
        <span className={styles.label} style={{ color }}>
          {numericLevel === 1 ? 'I' : numericLevel === 2 ? 'II' : 'III'}
        </span>
      )}
    </div>
  )
}
