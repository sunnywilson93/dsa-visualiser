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
  defaultValues?: (Node | null)[]
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

// ============================================================================
// Concept Visualization Types
// ============================================================================

export type ConceptType =
  | 'two-pointers-converge'    // ← array →
  | 'two-pointers-same-dir'    // → → (slow/fast)
  | 'two-pointers-partition'   // [0s | 1s | 2s]
  | 'hash-map'                 // Key-value lookups
  | 'bit-manipulation'         // Binary grid operations
  | 'sliding-window'           // Frame over array
  | 'binary-search'            // Halving search space
  | 'linked-list'              // Node chains with pointers
  | 'sorting'                  // Sort + scan/partition operations

export interface ConceptStep {
  id: number
  title: string
  description: string
  visual: ConceptVisualState
}

export interface ConceptVisualState {
  array?: (number | string)[]        // Numbers or characters (for string problems)
  pointers?: Record<string, number>  // { left: 0, right: 4 }
  highlights?: number[]              // Indices to highlight
  binary?: BinaryConceptState
  hashMap?: HashMapVisualState
  linkedList?: LinkedListVisualState
  annotations?: string[]             // Text annotations on the visual
  result?: number | string | boolean | (number | string)[]
}

export interface HashMapEntry {
  key: string
  value: number
  isNew?: boolean
  isLookup?: boolean
  isDecrement?: boolean
  lookupResult?: 'found' | 'not-found'
}

export interface HashMapVisualState {
  entries: HashMapEntry[]
  currentIndex?: number
  secondArray?: (number | string)[]
  secondArrayIndex?: number
  phase?: string
  lookupKey?: string
  lookupResult?: 'found' | 'not-found'
}

export interface LinkedListNodeState {
  id: string
  value: number | string
  next: string | null
}

export interface LinkedListVisualState {
  nodes: LinkedListNodeState[]
  pointers?: Record<string, string>
  highlightNodes?: string[]
  highlightEdges?: [string, string][]
  cycleTarget?: string
  secondList?: LinkedListNodeState[]
  detachedNodes?: LinkedListNodeState[]
  annotations?: string[]
}

export interface BinaryConceptState {
  numbers: { label: string; value: number }[]
  operator?: '&' | '|' | '^' | '<<' | '>>' | '~'
  result?: number
  activeBits?: number[]  // Which bit positions to highlight
  annotations?: string[]
}

export interface CategoryConcept {
  id: string
  title: string
  description: string
  type: ConceptType
  steps: ConceptStep[]
}

export interface ProblemInsight {
  keyInsight: string           // One-liner insight
  pattern: ConceptType         // Which visualization pattern
  customSteps?: ConceptStep[]  // Override category steps if needed
}
