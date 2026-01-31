/**
 * Shared level/difficulty information for visualization components.
 * All colors reference @theme CSS custom properties for consistency.
 */

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelConfig {
  label: string
  color: string      // Primary text/icon color
  bg: string         // Background (15% opacity)
  border: string     // Border (40% opacity)
  description?: string  // Optional description for tooltips
}

export const LEVEL_INFO: Record<Level, LevelConfig> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-15)',
    border: 'var(--color-emerald-40)',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-amber-500)',
    bg: 'var(--color-amber-15)',
    border: 'var(--color-amber-40)',
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-red-500)',
    bg: 'var(--color-red-15)',
    border: 'var(--color-red-40)',
  },
} as const
