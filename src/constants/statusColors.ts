/**
 * Shared variable state colors for scope/hoisting visualization components.
 * All colors reference @theme CSS custom properties.
 *
 * Status colors are organized by semantic meaning:
 * - Declaration/Hoisted: amber (warning - not yet initialized)
 * - TDZ/Error: red (danger - accessing causes error)
 * - Initialized/Active: emerald (success - usable)
 * - Creation/Undefined: blue (neutral - early state)
 * - Special states: purple (captured, shadowed)
 *
 * Used by: HoistingViz, VariablesViz, RecursionViz, WebWorkersViz
 */

// Variable lifecycle states from HoistingViz
export type HoistingStatus = 'hoisted' | 'initialized' | 'tdz'

// Variable states from VariablesViz
export type VariableState =
  | 'not-declared'
  | 'hoisted-undefined'
  | 'hoisted-tdz'
  | 'initialized'
  | 'error'

// Stack frame status from RecursionViz
export type StackFrameStatus = 'active' | 'waiting' | 'returning'

// Thread status from WebWorkersViz
export type ThreadStatus = 'idle' | 'busy' | 'blocked' | 'waiting'

// Combined union of all status types
export type VariableStatus =
  | HoistingStatus
  | VariableState
  | StackFrameStatus
  | ThreadStatus

export const STATUS_COLORS: Record<VariableStatus, string> = {
  // HoistingViz statuses
  hoisted: 'var(--color-amber-500)',
  initialized: 'var(--color-emerald-500)',
  tdz: 'var(--color-red-500)',

  // VariablesViz statuses
  'not-declared': 'var(--color-gray-600)',
  'hoisted-undefined': 'var(--color-amber-500)',
  'hoisted-tdz': 'var(--color-red-500)',
  error: 'var(--color-red-500)',

  // RecursionViz statuses
  active: 'var(--color-accent-purple)',
  waiting: 'var(--color-amber-500)',
  returning: 'var(--color-emerald-500)',

  // WebWorkersViz statuses
  idle: 'var(--color-emerald-500)',
  busy: 'var(--color-blue-500)',
  blocked: 'var(--color-red-500)',
} as const

/**
 * Get the CSS variable reference for a status.
 * Returns a fallback gray color for unknown statuses.
 */
export const getStatusColor = (status: VariableStatus | string): string => {
  return STATUS_COLORS[status as VariableStatus] ?? 'var(--color-gray-400)'
}

/**
 * Background variants (15% opacity) for status badges.
 * Use these for badge/pill backgrounds with the main color as text.
 */
export const STATUS_BG_COLORS: Record<VariableStatus, string> = {
  // HoistingViz statuses
  hoisted: 'var(--color-amber-15)',
  initialized: 'var(--color-emerald-15)',
  tdz: 'var(--color-red-15)',

  // VariablesViz statuses
  'not-declared': 'var(--color-white-8)',
  'hoisted-undefined': 'var(--color-amber-15)',
  'hoisted-tdz': 'var(--color-red-15)',
  error: 'var(--color-red-15)',

  // RecursionViz statuses
  active: 'var(--color-accent-purple-15)',
  waiting: 'var(--color-amber-15)',
  returning: 'var(--color-emerald-15)',

  // WebWorkersViz statuses
  idle: 'var(--color-emerald-15)',
  busy: 'var(--color-blue-15)',
  blocked: 'var(--color-red-15)',
} as const

/**
 * Get the CSS variable reference for a status background.
 * Returns a fallback gray color for unknown statuses.
 */
export const getStatusBgColor = (status: VariableStatus | string): string => {
  return STATUS_BG_COLORS[status as VariableStatus] ?? 'var(--color-white-8)'
}

/**
 * Border variants (40% opacity) for status badges.
 * Use these for badge/pill borders.
 */
export const STATUS_BORDER_COLORS: Record<VariableStatus, string> = {
  // HoistingViz statuses
  hoisted: 'var(--color-amber-40)',
  initialized: 'var(--color-emerald-40)',
  tdz: 'var(--color-red-40)',

  // VariablesViz statuses
  'not-declared': 'var(--color-white-15)',
  'hoisted-undefined': 'var(--color-amber-40)',
  'hoisted-tdz': 'var(--color-red-40)',
  error: 'var(--color-red-40)',

  // RecursionViz statuses
  active: 'var(--color-accent-purple-25)',
  waiting: 'var(--color-amber-40)',
  returning: 'var(--color-emerald-40)',

  // WebWorkersViz statuses
  idle: 'var(--color-emerald-40)',
  busy: 'var(--color-blue-40)',
  blocked: 'var(--color-red-40)',
} as const

/**
 * Get the CSS variable reference for a status border.
 * Returns a fallback gray color for unknown statuses.
 */
export const getStatusBorderColor = (status: VariableStatus | string): string => {
  return STATUS_BORDER_COLORS[status as VariableStatus] ?? 'var(--color-white-15)'
}
