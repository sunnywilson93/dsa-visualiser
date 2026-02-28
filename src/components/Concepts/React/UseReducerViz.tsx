'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import { CodeBlock } from '@/components/ui'

interface Step {
  title: string
  code: string
  explanation: string
  output?: string[]
}

interface Tab {
  id: string
  label: string
  steps: Step[]
}

const tabs: Tab[] = [
  {
    id: 'basic-reducer',
    label: 'Basic Reducer',
    steps: [
      {
        title: 'The Reducer Function',
        code: `function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}`,
        explanation: 'A reducer is a pure function that takes the current state and an action, then returns a new state. It never mutates the original state — it always returns a fresh object.',
      },
      {
        title: 'Wiring It Up with useReducer',
        code: `import { useReducer } from 'react'

function Counter() {
  const [state, dispatch] = useReducer(
    counterReducer,
    { count: 0 }
  )

  return <span>{state.count}</span>
}`,
        explanation: 'useReducer takes the reducer function and an initial state. It returns the current state and a dispatch function. This is analogous to Redux\'s pattern but scoped to a single component.',
      },
      {
        title: 'Dispatching Actions',
        code: `function Counter() {
  const [state, dispatch] = useReducer(
    counterReducer, { count: 0 }
  )

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>
    </div>
  )
}`,
        explanation: 'Instead of calling setState directly, you dispatch action objects. The reducer decides how to transform state based on the action type. This creates a predictable, traceable flow.',
        output: ['Click + => dispatch({ type: "increment" })', 'Reducer: { count: 0 } => { count: 1 }'],
      },
    ],
  },
  {
    id: 'action-types',
    label: 'Action Types',
    steps: [
      {
        title: 'Plain String Actions',
        code: `dispatch({ type: 'increment' })
dispatch({ type: 'decrement' })
dispatch({ type: 'reset' })`,
        explanation: 'The simplest actions carry just a type string. The reducer uses a switch statement to handle each type. This works for simple state transitions without additional data.',
      },
      {
        title: 'Actions with Payloads',
        code: `dispatch({ type: 'add', payload: 5 })
dispatch({ type: 'set', payload: 42 })

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { count: state.count + action.payload }
    case 'set':
      return { count: action.payload }
    default:
      return state
  }
}`,
        explanation: 'Actions can carry a payload — extra data the reducer needs to compute the next state. The payload convention keeps action objects predictable and easy to log or replay.',
        output: ['dispatch({ type: "add", payload: 5 })', '{ count: 0 } => { count: 5 }'],
      },
      {
        title: 'TypeScript Action Unions',
        code: `type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set'; payload: number }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'set':
      return { count: action.payload }
      // action.payload is number here
  }
}`,
        explanation: 'TypeScript discriminated unions make actions type-safe. Inside each case branch, TypeScript narrows the action type so you get autocomplete and type checking on the payload.',
      },
    ],
  },
  {
    id: 'complex-state',
    label: 'Complex State',
    steps: [
      {
        title: 'A Form with Multiple Fields',
        code: `const initialState = {
  name: '',
  email: '',
  age: 0,
  isSubmitting: false,
  error: null
}`,
        explanation: 'When state has many interrelated fields, useState with individual setters becomes unwieldy. A reducer centralizes all state transitions in one place, making the logic easier to follow.',
      },
      {
        title: 'Form Reducer',
        code: `function formReducer(state, action) {
  switch (action.type) {
    case 'field_change':
      return {
        ...state,
        [action.field]: action.value
      }
    case 'submit_start':
      return { ...state, isSubmitting: true }
    case 'submit_success':
      return { ...initialState }
    case 'submit_error':
      return {
        ...state, isSubmitting: false,
        error: action.error
      }
  }
}`,
        explanation: 'Each action describes what happened, not how state should change. The reducer handles all the details. This makes it trivial to add new actions or change how a specific transition works.',
      },
      {
        title: 'Using the Form Reducer',
        code: `function Form() {
  const [state, dispatch] = useReducer(
    formReducer, initialState
  )

  const handleChange = (e) => {
    dispatch({
      type: 'field_change',
      field: e.target.name,
      value: e.target.value
    })
  }

  const handleSubmit = async () => {
    dispatch({ type: 'submit_start' })
    try {
      await api.submit(state)
      dispatch({ type: 'submit_success' })
    } catch (err) {
      dispatch({ type: 'submit_error', error: err })
    }
  }
}`,
        explanation: 'The component dispatches semantic events. The reducer owns the state logic. This separation means you can test the reducer independently — pass in state and action, assert on the output.',
        output: ['field_change => updates one field', 'submit_start => isSubmitting: true', 'submit_success => resets form'],
      },
    ],
  },
  {
    id: 'vs-usestate',
    label: 'useReducer vs useState',
    steps: [
      {
        title: 'useState: Simple & Direct',
        code: `function Toggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <button onClick={() => setIsOn(prev => !prev)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}`,
        explanation: 'useState is ideal when state is a single primitive or the transitions are simple. One state variable, one setter, one line of logic. No need for a reducer here.',
      },
      {
        title: 'When useState Gets Messy',
        code: `function DataFetcher() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await api.fetch()
      setData(result)
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
  }
}`,
        explanation: 'Three interdependent state variables, updated together in multiple places. It is easy to forget one setter or update them in the wrong order, creating impossible states like loading=true with error set.',
      },
      {
        title: 'useReducer: Impossible States Eliminated',
        code: `type State =
  | { status: 'idle'; data: null }
  | { status: 'loading'; data: null }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error }

function reducer(state, action) {
  switch (action.type) {
    case 'fetch':
      return { status: 'loading', data: null }
    case 'success':
      return { status: 'success', data: action.data }
    case 'error':
      return { status: 'error', error: action.error }
  }
}`,
        explanation: 'A discriminated union state type makes impossible combinations unrepresentable. You cannot have status: "loading" and data set simultaneously. The reducer enforces valid transitions.',
      },
      {
        title: 'Rule of Thumb',
        code: `// Use useState when:
// - State is a single value
// - Transitions are simple (toggle, set)
// - No interdependent variables

// Use useReducer when:
// - State is an object with multiple fields
// - Next state depends on previous state
// - Transitions have complex logic
// - You want testable state logic`,
        explanation: 'Neither is universally better. useState is simpler for simple cases. useReducer shines when state transitions are the core complexity of your component — it moves that logic into a testable, pure function.',
      },
    ],
  },
]

export function UseReducerViz(): JSX.Element {
  const [activeTab, setActiveTab] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentTab = tabs[activeTab]
  const currentStep = currentTab.steps[stepIndex]

  const handleTabChange = (index: number): void => {
    setActiveTab(index)
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap justify-center">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === i
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                : 'bg-[var(--color-white-5)] border border-[var(--color-white-10)] text-[var(--color-text-muted)] hover:bg-[var(--color-white-10)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.h3
          key={`${activeTab}-${stepIndex}`}
          className="text-center text-lg font-semibold text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {currentStep.title}
        </motion.h3>
      </AnimatePresence>

      <div className="rounded-xl border border-[var(--color-white-10)] overflow-hidden">
        <CodeBlock code={currentStep.code} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`exp-${activeTab}-${stepIndex}`}
          className="text-base leading-relaxed text-[var(--color-text-muted)] bg-[var(--color-black-30)] border border-[var(--color-white-10)] rounded-lg px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentStep.explanation}
        </motion.p>
      </AnimatePresence>

      {currentStep.output && currentStep.output.length > 0 && (
        <div className="bg-[var(--color-black-40)] border border-[var(--color-emerald-500)]/30 rounded-lg px-4 py-3">
          <div className="text-xs font-semibold text-[var(--color-emerald-500)] mb-1">Output</div>
          <div className="font-mono text-sm text-[var(--color-emerald-400)]">
            {currentStep.output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}

      <StepControls
        onPrev={() => setStepIndex(s => s - 1)}
        onNext={() => setStepIndex(s => s + 1)}
        onReset={() => setStepIndex(0)}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentTab.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentTab.steps.length }}
      />
    </div>
  )
}
