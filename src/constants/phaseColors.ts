/**
 * Shared execution phase colors for async/promise visualization components.
 * All colors reference @theme CSS custom properties.
 *
 * Phase colors are organized by semantic meaning:
 * - Creation/Setup phases: blue tones
 * - Execution/Processing phases: amber tones
 * - Success/Complete phases: emerald tones
 * - Error/Reject phases: red tones
 * - Scheduling/Queue phases: purple tones
 * - Wait/Pending phases: gray tones
 */

// Union of all phase names used across visualization components
// Collected from: PromisesViz, V8EngineViz, CallbacksBasicsViz, TimingViz,
// CompositionViz, PromisesChainingViz, TaskQueueViz, AsyncAwaitSyntaxViz,
// MicrotaskQueueViz, EventLoopViz, CallbackHellViz, ErrorFirstCallbacksViz,
// RecursionViz, AsyncAwaitErrorsViz, PromisesCreationViz, ClosuresViz,
// MemoizationViz, PromisesThenCatchViz, PromisesStaticViz, EventLoopTickViz
export type Phase =
  // Creation/Setup phases
  | 'Creation' | 'Setup' | 'Start' | 'Create' | 'Create Inner' | 'Create Outer'
  | 'Fetch' | 'Fetch User' | 'Register' | 'Usage' | 'Why' | 'Build'
  // Execution phases
  | 'Executor' | 'Execute' | 'Run' | 'Execution' | 'Branch'
  | 'Process' | 'parsing' | 'registering' | 'refactored' | 'try'
  // Success/Complete phases
  | 'Resolve' | 'Complete' | 'Async Resolve' | 'Settled' | 'Return'
  | 'Settling' | 'Winner' | 'Found' | 'Result' | 'First Resolve'
  | 'Then Runs' | 'Inner Resolves' | 'Handle' | 'Success' | 'returning'
  | 'Settle' | 'Output' | 'Recover' | 'Hit' | 'Access' | 'All'
  // Scheduling/Queue phases
  | 'Schedule' | 'Chain' | 'Compose' | 'Parse' | 'Data' | 'Posts'
  | 'Comments' | 'Memo' | 'Flexible' | 'First .then()' | 'Second .then()'
  | '.then()' | 'Any Settles' | 'Any' | 'Add D' | 'Add E' | 'Trailing'
  | 'Debounce' | 'draining' | 'interpreting'
  // Wait/Pending phases
  | 'Continue' | 'Wait' | 'Waiting' | 'Pending' | '.finally()' | 'complete'
  // Error phases
  | 'Error' | 'Reject' | 'Fail Fast' | 'Catch' | 'Throw' | 'Miss'
  | 'Problem' | 'Cancel' | 'All Rejects' | 'All Rejected' | 'AggregateError'
  | 'error' | 'pyramid'
  // Processing/Transform phases
  | 'Filter' | 'Flatten' | 'Map' | 'Extract' | 'Count' | 'Calculate' | 'Reduce'
  | 'Call 1' | 'Call 2' | 'Call 3' | 'Call 4' | 'Fill' | 'Racing' | 'Searching'
  | 'spawning' | 'macro-waiting' | 'Throttle' | 'nested' | 'await'
  | 'Race Settles' | 'Race' | 'First Reject' | 'Second Reject'
  | '500ms' | '1000ms' | 'Partial' | 'Curry' | 'error-check' | 'catch'
  | 'Resolve with Promise'
  // Sync/Async markers
  | 'sync' | 'Sync' | 'micro' | 'macro' | 'micro-check'
  // Stack operations
  | 'calling' | 'First Call' | 'Second Call' | 'invoking'
  // Special phases
  | 'idle' | 'Idle' | 'Ignored' | 'Skip' | 'React' | 'Summary'
  | 'Pipe' | 'User' | 'normal' | 'resume' | 'optimizing' | 'deoptimizing'
  | 'AllSettled' | 'propagate' | 'finally'
  // EventLoopTickViz specific
  | 'task' | 'microtasks' | 'render' | 'idle-callbacks'

export const PHASE_COLORS: Record<Phase, string> = {
  // Creation/Setup phases (blue-400: #60a5fa)
  Creation: 'var(--color-blue-400)',
  Setup: 'var(--color-blue-400)',
  Start: 'var(--color-blue-400)',
  Create: 'var(--color-blue-400)',
  'Create Inner': 'var(--color-blue-400)',
  Fetch: 'var(--color-blue-400)',
  'Fetch User': 'var(--color-blue-400)',
  Register: 'var(--color-blue-400)',
  Usage: 'var(--color-blue-400)',
  Why: 'var(--color-blue-400)',
  Build: 'var(--color-amber-500)',
  Pipe: 'var(--color-blue-400)',
  User: 'var(--color-blue-400)',

  // Creation with different shade (indigo: #818cf8)
  'Create Outer': 'var(--color-brand-light)',
  AllSettled: 'var(--color-brand-light)',

  // Parsing/Interpreting phases (blue-500: #3b82f6)
  parsing: 'var(--color-blue-500)',
  registering: 'var(--color-blue-500)',
  refactored: 'var(--color-blue-500)',
  try: 'var(--color-blue-500)',

  // Execution phases (amber-500: #f59e0b)
  Executor: 'var(--color-amber-500)',
  Execute: 'var(--color-amber-500)',
  Run: 'var(--color-amber-500)',
  Execution: 'var(--color-emerald-500)',
  Branch: 'var(--color-amber-500)',
  Process: 'var(--color-amber-500)',

  // Success/Complete phases (emerald-500: #10b981)
  Resolve: 'var(--color-emerald-500)',
  Complete: 'var(--color-emerald-500)',
  'Async Resolve': 'var(--color-emerald-500)',
  Settled: 'var(--color-emerald-500)',
  Return: 'var(--color-amber-500)',
  Settling: 'var(--color-emerald-500)',
  Winner: 'var(--color-emerald-500)',
  Found: 'var(--color-emerald-500)',
  Result: 'var(--color-emerald-500)',
  'First Resolve': 'var(--color-emerald-500)',
  'Then Runs': 'var(--color-emerald-500)',
  'Inner Resolves': 'var(--color-emerald-500)',
  Handle: 'var(--color-amber-500)',
  Success: 'var(--color-emerald-500)',
  returning: 'var(--color-emerald-500)',
  Settle: 'var(--color-emerald-500)',
  Output: 'var(--color-emerald-500)',
  Recover: 'var(--color-emerald-500)',
  Hit: 'var(--color-emerald-500)',
  Access: 'var(--color-emerald-500)',
  All: 'var(--color-emerald-500)',
  resume: 'var(--color-emerald-500)',
  optimizing: 'var(--color-emerald-500)',
  invoking: 'var(--color-emerald-500)',

  // Scheduling/Queue phases (purple: #c4b5fd / #a855f7)
  Schedule: 'var(--color-accent-purple)',
  Chain: 'var(--color-accent-purple)',
  Compose: 'var(--color-accent-purple)',
  Parse: 'var(--color-accent-purple)',
  Data: 'var(--color-accent-purple)',
  Posts: 'var(--color-accent-purple)',
  Comments: 'var(--color-accent-purple)',
  Memo: 'var(--color-accent-purple)',
  Flexible: 'var(--color-accent-purple)',
  'First .then()': 'var(--color-accent-purple)',
  'Second .then()': 'var(--color-accent-purple)',
  '.then()': 'var(--color-accent-purple)',
  'Any Settles': 'var(--color-accent-purple)',
  Any: 'var(--color-accent-purple)',
  'Add D': 'var(--color-accent-purple)',
  'Add E': 'var(--color-accent-purple)',
  Trailing: 'var(--color-accent-purple)',
  Debounce: 'var(--color-accent-purple)',
  draining: 'var(--color-accent-purple)',
  interpreting: 'var(--color-accent-purple)',
  'First Call': 'var(--color-emerald-500)',
  'Second Call': 'var(--color-accent-purple)',

  // Wait/Pending phases (gray-400: #94a3b8)
  Continue: 'var(--color-gray-400)',
  Wait: 'var(--color-gray-500)',
  Waiting: 'var(--color-amber-500)',
  Pending: 'var(--color-gray-400)',
  '.finally()': 'var(--color-gray-400)',
  complete: 'var(--color-gray-600)',

  // Error phases (red-500: #ef4444 / #f43f5e)
  Error: 'var(--color-red-500)',
  Reject: 'var(--color-red-500)',
  'Fail Fast': 'var(--color-red-500)',
  Catch: 'var(--color-red-500)',
  Throw: 'var(--color-red-500)',
  Miss: 'var(--color-red-500)',
  Problem: 'var(--color-red-500)',
  Cancel: 'var(--color-red-500)',
  'All Rejects': 'var(--color-red-500)',
  'All Rejected': 'var(--color-red-500)',
  AggregateError: 'var(--color-red-500)',
  error: 'var(--color-red-500)',
  pyramid: 'var(--color-red-500)',
  deoptimizing: 'var(--color-red-500)',
  catch: 'var(--color-amber-500)',

  // Processing/Transform phases (amber-500: #f59e0b)
  Filter: 'var(--color-amber-500)',
  Flatten: 'var(--color-amber-500)',
  Map: 'var(--color-amber-500)',
  Extract: 'var(--color-amber-500)',
  Count: 'var(--color-amber-500)',
  Calculate: 'var(--color-amber-500)',
  Reduce: 'var(--color-amber-500)',
  'Call 1': 'var(--color-amber-500)',
  'Call 2': 'var(--color-amber-500)',
  'Call 3': 'var(--color-amber-500)',
  'Call 4': 'var(--color-amber-500)',
  Fill: 'var(--color-amber-500)',
  Racing: 'var(--color-amber-500)',
  Searching: 'var(--color-amber-500)',
  spawning: 'var(--color-amber-500)',
  'macro-waiting': 'var(--color-amber-500)',
  Throttle: 'var(--color-amber-500)',
  nested: 'var(--color-amber-500)',
  await: 'var(--color-amber-500)',
  'Race Settles': 'var(--color-amber-500)',
  Race: 'var(--color-amber-500)',
  'First Reject': 'var(--color-amber-500)',
  'Second Reject': 'var(--color-amber-500)',
  '500ms': 'var(--color-amber-500)',
  '1000ms': 'var(--color-amber-500)',
  Partial: 'var(--color-amber-500)',
  Curry: 'var(--color-amber-500)',
  'error-check': 'var(--color-amber-500)',
  'Resolve with Promise': 'var(--color-amber-500)',

  // Sync/Async markers
  sync: 'var(--color-accent-purple)',
  Sync: 'var(--color-accent-purple)',
  micro: 'var(--color-accent-purple)',
  macro: 'var(--color-amber-500)',
  'micro-check': 'var(--color-accent-purple)',

  // Stack operations (slate-500: #64748b for muted, purple for calling)
  calling: 'var(--color-gray-500)',

  // Special/Idle phases (gray-500: #6b7280)
  idle: 'var(--color-gray-800)',
  Idle: 'var(--color-gray-600)',
  Ignored: 'var(--color-gray-600)',
  Skip: 'var(--color-gray-600)',
  normal: 'var(--color-emerald-500)',

  // Framework-specific
  React: 'var(--color-accent-cyan)',
  Summary: 'var(--color-emerald-500)',

  // Error handling flow (pink: #ec4899, violet: #8b5cf6)
  propagate: 'var(--color-red-400)',
  finally: 'var(--color-accent-purple)',

  // EventLoopTickViz phases - these use custom objects, listed for reference
  task: 'var(--color-amber-500)',
  microtasks: 'var(--color-accent-purple)',
  render: 'var(--color-accent-cyan)',
  'idle-callbacks': 'var(--color-gray-600)',
} as const

/**
 * Get the CSS variable reference for a phase.
 * Returns a fallback gray color for unknown phases.
 */
export const getPhaseColor = (phase: Phase | string): string => {
  return PHASE_COLORS[phase as Phase] ?? 'var(--color-gray-500)'
}
