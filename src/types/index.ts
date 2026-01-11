import type { Node } from 'acorn'

// ============================================================================
// Execution State Types
// ============================================================================

export interface StackFrame {
  id: string
  name: string
  params: Record<string, RuntimeValue>
  locals: Record<string, RuntimeValue>
  returnValue?: RuntimeValue
  callSite?: SourceLocation
  startLine: number
  depth: number
}

export interface SourceLocation {
  line: number
  column: number
  start: number
  end: number
}

export interface ExecutionStep {
  id: number
  type: StepType
  node: Node
  location: SourceLocation
  callStack: StackFrame[]
  scopes: ScopeChain
  description: string
  highlightedElements?: string[]
  consoleOutput?: string
  consoleOutputCount: number // How many console outputs existed at this step
}

export type StepType =
  | 'declaration'
  | 'assignment'
  | 'expression'
  | 'call'
  | 'return'
  | 'branch'
  | 'loop-start'
  | 'loop-iteration'
  | 'loop-end'
  | 'array-access'
  | 'array-modify'
  | 'object-access'
  | 'object-modify'
  | 'comparison'

// ============================================================================
// Runtime Value Types
// ============================================================================

export type RuntimeValue =
  | PrimitiveValue
  | ArrayValue
  | ObjectValue
  | FunctionValue
  | NullValue
  | UndefinedValue

export interface PrimitiveValue {
  type: 'primitive'
  dataType: 'number' | 'string' | 'boolean'
  value: number | string | boolean
}

export interface ArrayValue {
  type: 'array'
  id: string
  elements: RuntimeValue[]
  heapAddress: string
}

export interface ObjectValue {
  type: 'object'
  id: string
  properties: Record<string, RuntimeValue>
  heapAddress: string
}

export interface FunctionValue {
  type: 'function'
  name: string
  params: string[]
  body: Node
  closure: ScopeChain
}

export interface NullValue {
  type: 'null'
}

export interface UndefinedValue {
  type: 'undefined'
}

// ============================================================================
// Scope and Memory Types
// ============================================================================

export interface Scope {
  id: string
  type: 'global' | 'function' | 'block'
  name: string
  variables: Record<string, RuntimeValue>
  parent?: string
}

export type ScopeChain = Scope[]

export interface HeapObject {
  id: string
  type: 'array' | 'object'
  data: RuntimeValue[] | Record<string, RuntimeValue>
  refCount: number
}

export interface MemoryState {
  heap: Record<string, HeapObject>
  nextHeapId: number
}

// ============================================================================
// Breakpoint Types
// ============================================================================

export interface Breakpoint {
  id: string
  line: number
  enabled: boolean
  condition?: string
}

export interface WatchExpression {
  id: string
  expression: string
  currentValue?: RuntimeValue
  error?: string
}

// ============================================================================
// Execution Control Types
// ============================================================================

export type ExecutionStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'stepping'
  | 'completed'
  | 'error'

export type PlaybackSpeed = 'slow' | 'medium' | 'fast'

export interface ExecutionError {
  message: string
  line?: number
  column?: number
  stack?: string
}

// ============================================================================
// Data Structure Visualization Types
// ============================================================================

export interface VisualizationNode {
  id: string
  value: RuntimeValue
  x: number
  y: number
  highlighted: boolean
  label?: string
}

export interface VisualizationEdge {
  id: string
  from: string
  to: string
  label?: string
  highlighted: boolean
}

export interface DataStructureVisualization {
  type: 'array' | 'linked-list' | 'tree' | 'graph' | 'stack' | 'queue' | 'heap'
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
  metadata?: Record<string, unknown>
}

// ============================================================================
// Store Types
// ============================================================================

export interface ExecutionState {
  // Code
  code: string
  parsedAST: Node | null
  parseError: ExecutionError | null

  // Execution
  status: ExecutionStatus
  currentStep: number
  steps: ExecutionStep[]
  maxSteps: number

  // Debugging
  breakpoints: Breakpoint[]
  watchExpressions: WatchExpression[]

  // Playback
  playbackSpeed: PlaybackSpeed
  isPlaying: boolean

  // Console
  consoleOutput: string[]

  // Visualization
  activeVisualization: DataStructureVisualization | null
}

export interface ExecutionActions {
  // Code actions
  setCode: (code: string) => void
  parseCode: () => boolean

  // Execution control
  startExecution: () => void
  stepForward: () => void
  stepBackward: () => void
  runToBreakpoint: () => void
  runToCompletion: () => void
  pause: () => void
  reset: () => void

  // Breakpoints
  toggleBreakpoint: (line: number) => void
  setBreakpointCondition: (id: string, condition: string) => void
  clearAllBreakpoints: () => void

  // Watch expressions
  addWatchExpression: (expression: string) => void
  removeWatchExpression: (id: string) => void

  // Playback
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  togglePlayback: () => void

  // Step navigation
  jumpToStep: (step: number) => void
}

export type ExecutionStore = ExecutionState & ExecutionActions
