'use client'

interface DifficultyMiniBarProps {
  easy: number
  medium: number
  hard: number
}

export function DifficultyMiniBar({ easy, medium, hard }: DifficultyMiniBarProps) {
  const total = easy + medium + hard
  if (total === 0) return null

  return (
    <div
      className="flex h-1.5 flex-1 rounded-full overflow-hidden bg-white-10"
      role="img"
      aria-label={`${easy} easy, ${medium} medium, ${hard} hard problems`}
    >
      {easy > 0 && (
        <div
          className="h-full"
          style={{
            width: `${(easy / total) * 100}%`,
            backgroundColor: 'var(--difficulty-1)'
          }}
        />
      )}
      {medium > 0 && (
        <div
          className="h-full"
          style={{
            width: `${(medium / total) * 100}%`,
            backgroundColor: 'var(--difficulty-2)'
          }}
        />
      )}
      {hard > 0 && (
        <div
          className="h-full"
          style={{
            width: `${(hard / total) * 100}%`,
            backgroundColor: 'var(--difficulty-3)'
          }}
        />
      )}
    </div>
  )
}
