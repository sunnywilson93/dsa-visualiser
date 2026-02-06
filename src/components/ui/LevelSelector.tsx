'use client'

import { cn } from '@/utils/cn'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelConfig {
  label: string
  color: string
}

export const defaultLevelConfig: Record<Level, LevelConfig> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' },
}

export interface LevelSelectorProps {
  value: Level
  onChange: (level: Level) => void
  levels?: Level[]
  config?: Record<Level, LevelConfig>
  disabledLevels?: Level[]
  className?: string
}

export function LevelSelector({
  value,
  onChange,
  levels = ['beginner', 'intermediate', 'advanced'],
  config = defaultLevelConfig,
  disabledLevels = [],
  className,
}: LevelSelectorProps) {
  return (
    <div
      className={cn(
        'flex gap-2 flex-wrap justify-center bg-black/30 border border-white/8 rounded-full p-[var(--spacing-pill)]',
        className
      )}
    >
      {levels.map((level) => {
        const { label, color } = config[level]
        const isActive = value === level
        const isDisabled = disabledLevels.includes(level)

        return (
          <button
            key={level}
            type="button"
            onClick={() => !isDisabled && onChange(level)}
            disabled={isDisabled}
            className={cn(
              'flex items-center gap-[var(--spacing-1\\.5)] min-h-[44px] px-3 py-1.5 text-sm font-medium rounded-full transition-all border-2 touch-manipulation',
              'disabled:cursor-not-allowed disabled:opacity-40',
              isActive
                ? 'text-white'
                : 'border-transparent bg-white/5 text-gray-500 hover:bg-white/8 hover:text-gray-300'
            )}
            style={
              isActive
                ? {
                    borderColor: color,
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                    boxShadow: `0 0 12px color-mix(in srgb, ${color} 25%, transparent)`,
                  }
                : undefined
            }
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: color }}
            />
            {label}
          </button>
        )
      })}
    </div>
  )
}
