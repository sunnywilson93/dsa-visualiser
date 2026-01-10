import { create } from 'zustand'
import type {
  ExecutionStore,
  PlaybackSpeed,
  Breakpoint,
  WatchExpression,
  ExecutionStep,
  RuntimeValue,
} from '@/types'
import { parseCode, createInterpreter } from '@/engine'

const EXAMPLE_CODE = `// Bubble Sort Example
function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

let numbers = [64, 34, 25, 12, 22];
console.log("Before:", numbers);

let sorted = bubbleSort(numbers);
console.log("After:", sorted);
`

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  // Initial state
  code: EXAMPLE_CODE,
  parsedAST: null,
  parseError: null,
  status: 'idle',
  currentStep: 0,
  steps: [],
  maxSteps: 10000,
  breakpoints: [],
  watchExpressions: [],
  playbackSpeed: 'medium',
  isPlaying: false,
  consoleOutput: [],
  activeVisualization: null,

  // Code actions
  setCode: (code: string) => {
    set({ code, parseError: null })
  },

  parseCode: () => {
    const { code } = get()
    const result = parseCode(code)

    if (result.success && result.ast) {
      set({ parsedAST: result.ast, parseError: null })
      return true
    } else {
      set({ parsedAST: null, parseError: result.error })
      return false
    }
  },

  // Execution control
  startExecution: () => {
    const { code } = get()

    // Parse code
    const result = parseCode(code)
    if (!result.success || !result.ast) {
      set({ parseError: result.error, status: 'error' })
      return
    }

    // Execute and collect steps
    const interpreter = createInterpreter()
    const steps = interpreter.execute(result.ast)
    const consoleOutput = interpreter.getConsoleOutput()

    set({
      parsedAST: result.ast,
      parseError: null,
      steps,
      currentStep: 0,
      status: steps.length > 0 ? 'paused' : 'completed',
      consoleOutput,
    })
  },

  stepForward: () => {
    const { currentStep, steps, breakpoints } = get()

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      const step = steps[nextStep]

      // Check for breakpoint
      const hitBreakpoint = breakpoints.some(
        bp => bp.enabled && bp.line === step.location.line
      )

      set({
        currentStep: nextStep,
        status: hitBreakpoint ? 'paused' : 'stepping',
      })
    } else {
      set({ status: 'completed' })
    }
  },

  stepBackward: () => {
    const { currentStep } = get()

    if (currentStep > 0) {
      set({ currentStep: currentStep - 1, status: 'paused' })
    }
  },

  runToBreakpoint: () => {
    const { currentStep, steps, breakpoints } = get()

    let nextStep = currentStep

    while (nextStep < steps.length - 1) {
      nextStep++
      const step = steps[nextStep]

      const hitBreakpoint = breakpoints.some(
        bp => bp.enabled && bp.line === step.location.line
      )

      if (hitBreakpoint) {
        set({ currentStep: nextStep, status: 'paused' })
        return
      }
    }

    set({ currentStep: steps.length - 1, status: 'completed' })
  },

  runToCompletion: () => {
    const { steps } = get()
    set({ currentStep: steps.length - 1, status: 'completed' })
  },

  pause: () => {
    set({ status: 'paused', isPlaying: false })
  },

  reset: () => {
    set({
      currentStep: 0,
      status: 'idle',
      steps: [],
      isPlaying: false,
      consoleOutput: [],
    })
  },

  // Breakpoints
  toggleBreakpoint: (line: number) => {
    const { breakpoints } = get()
    const existing = breakpoints.find(bp => bp.line === line)

    if (existing) {
      set({
        breakpoints: breakpoints.filter(bp => bp.line !== line),
      })
    } else {
      const newBreakpoint: Breakpoint = {
        id: generateId(),
        line,
        enabled: true,
      }
      set({ breakpoints: [...breakpoints, newBreakpoint] })
    }
  },

  setBreakpointCondition: (id: string, condition: string) => {
    const { breakpoints } = get()
    set({
      breakpoints: breakpoints.map(bp =>
        bp.id === id ? { ...bp, condition } : bp
      ),
    })
  },

  clearAllBreakpoints: () => {
    set({ breakpoints: [] })
  },

  // Watch expressions
  addWatchExpression: (expression: string) => {
    const { watchExpressions, currentStep, steps } = get()

    // Try to evaluate the expression at current step
    let currentValue: RuntimeValue | undefined
    let error: string | undefined

    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      // Look for the variable in scopes
      for (const scope of step.scopes) {
        if (expression in scope.variables) {
          currentValue = scope.variables[expression]
          break
        }
      }

      if (!currentValue) {
        error = 'Variable not found'
      }
    }

    const newWatch: WatchExpression = {
      id: generateId(),
      expression,
      currentValue,
      error,
    }

    set({ watchExpressions: [...watchExpressions, newWatch] })
  },

  removeWatchExpression: (id: string) => {
    const { watchExpressions } = get()
    set({
      watchExpressions: watchExpressions.filter(w => w.id !== id),
    })
  },

  // Playback
  setPlaybackSpeed: (speed: PlaybackSpeed) => {
    set({ playbackSpeed: speed })
  },

  togglePlayback: () => {
    const { isPlaying } = get()

    if (isPlaying) {
      set({ isPlaying: false, status: 'paused' })
    } else {
      set({ isPlaying: true, status: 'running' })
    }
  },

  // Step navigation
  jumpToStep: (step: number) => {
    const { steps } = get()

    if (step >= 0 && step < steps.length) {
      set({ currentStep: step, status: 'paused' })
    }
  },
}))

// Selector hooks for performance
export const useCurrentStep = () => useExecutionStore(state => {
  const { currentStep, steps } = state
  return steps[currentStep] as ExecutionStep | undefined
})

export const useCallStack = () => useExecutionStore(state => {
  const { currentStep, steps } = state
  return steps[currentStep]?.callStack ?? []
})

export const useCurrentScopes = () => useExecutionStore(state => {
  const { currentStep, steps } = state
  return steps[currentStep]?.scopes ?? []
})

export const useExecutionProgress = () => useExecutionStore(state => ({
  current: state.currentStep,
  total: state.steps.length,
  percentage: state.steps.length > 0 ? (state.currentStep / (state.steps.length - 1)) * 100 : 0,
}))
