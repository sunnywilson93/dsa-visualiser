/**
 * Shared constants for visualization components.
 *
 * Usage:
 *   import { LEVEL_INFO, getPhaseColor, getStatusColor, getGradient } from '@/constants'
 *
 * All color values reference @theme CSS custom properties defined in globals.css.
 */

// Level/difficulty information
export { LEVEL_INFO } from './levelInfo'
export type { Level, LevelConfig } from './levelInfo'

// Execution phase colors
export { PHASE_COLORS, getPhaseColor } from './phaseColors'
export type { Phase } from './phaseColors'

// Variable state colors
export {
  STATUS_COLORS,
  STATUS_BG_COLORS,
  STATUS_BORDER_COLORS,
  getStatusColor,
  getStatusBgColor,
  getStatusBorderColor,
} from './statusColors'
export type {
  HoistingStatus,
  VariableState,
  StackFrameStatus,
  ThreadStatus,
  VariableStatus,
} from './statusColors'

// Gradient constants
export { GRADIENTS, getGradient } from './gradients'
export type { GradientType } from './gradients'
