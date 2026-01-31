/**
 * Shared gradient constants for visualization components.
 * All gradients reference CSS custom properties defined in globals.css.
 *
 * Usage:
 *   import { getGradient, GRADIENTS } from '@/constants'
 *   style={{ background: getGradient('neon-purple') }}
 */

export type GradientType =
  | 'neon-orange'
  | 'neon-blue'
  | 'neon-purple'
  | 'neon-emerald'
  | 'neon-cyan'
  | 'neon-gray'
  | 'neon-amber'
  | 'neon-danger'

export const GRADIENTS: Record<GradientType, string> = {
  'neon-orange': 'var(--gradient-neon-orange)',
  'neon-blue': 'var(--gradient-neon-blue)',
  'neon-purple': 'var(--gradient-neon-purple)',
  'neon-emerald': 'var(--gradient-neon-emerald)',
  'neon-cyan': 'var(--gradient-neon-cyan)',
  'neon-gray': 'var(--gradient-neon-gray)',
  'neon-amber': 'var(--gradient-neon-amber)',
  'neon-danger': 'var(--gradient-neon-danger)',
} as const

/**
 * Get the CSS variable reference for a gradient.
 * Returns a fallback gray gradient for unknown types.
 */
export const getGradient = (type: GradientType | string): string => {
  return GRADIENTS[type as GradientType] ?? 'var(--gradient-neon-gray)'
}
