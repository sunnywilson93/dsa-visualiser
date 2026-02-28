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
    id: 'mount',
    label: 'Mount Phase',
    steps: [
      {
        title: 'Component is Created',
        code: `class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { seconds: 0 }
  }
}`,
        explanation: 'When a component first appears in the tree, React creates an instance (for classes) or calls the function (for function components). The constructor initializes state before anything renders.',
      },
      {
        title: 'First Render',
        code: `render() {
  return (
    <div>
      <span>Seconds: {this.state.seconds}</span>
    </div>
  )
}`,
        explanation: 'React calls render() to produce the VDOM tree. This must be a pure function -- no side effects, no setState calls. React uses the returned VDOM to create real DOM nodes.',
        output: ['DOM created: <div><span>Seconds: 0</span></div>'],
      },
      {
        title: 'DOM is Ready: componentDidMount',
        code: `componentDidMount() {
  this.interval = setInterval(() => {
    this.setState(s => ({
      seconds: s.seconds + 1
    }))
  }, 1000)
}`,
        explanation: 'After React inserts the DOM nodes, componentDidMount fires exactly once. This is the right place for side effects: API calls, subscriptions, timers, or measuring DOM elements.',
        output: ['Timer started: interval ID 42'],
      },
      {
        title: 'Mount Phase Summary',
        code: `// Class component mount order:
// 1. constructor(props)
// 2. static getDerivedStateFromProps()
// 3. render()
// 4. DOM updated
// 5. componentDidMount()`,
        explanation: 'The mount phase runs top-to-bottom in a predictable order. getDerivedStateFromProps is rarely needed -- it lets you sync state to props before render. Most components skip it entirely.',
      },
    ],
  },
  {
    id: 'update',
    label: 'Update Phase',
    steps: [
      {
        title: 'Something Triggers a Re-render',
        code: `// Any of these triggers an update:
this.setState({ seconds: 1 })
// or parent re-renders with new props
// or context value changes
// or forceUpdate()`,
        explanation: 'A component re-renders when its state changes, when it receives new props, when a consumed context changes, or when forceUpdate is called. Each trigger starts the update cycle.',
      },
      {
        title: 'shouldComponentUpdate (Bail Out?)',
        code: `shouldComponentUpdate(nextProps, nextState) {
  // Only re-render if seconds changed
  return nextState.seconds !== this.state.seconds
}

// PureComponent does shallow comparison
// automatically for all props and state`,
        explanation: 'Before re-rendering, React checks shouldComponentUpdate. Returning false skips the render and all children. PureComponent implements this with a shallow equality check on props and state.',
      },
      {
        title: 'Re-render and Diff',
        code: `render() {
  // Called again with new state
  return (
    <div>
      <span>Seconds: {this.state.seconds}</span>
    </div>
  )
}
// React diffs old VDOM vs new VDOM
// Patches only the text node: 0 -> 1`,
        explanation: 'If the update proceeds, render() is called again producing a new VDOM tree. React diffs this against the previous tree and applies only the minimal DOM changes.',
        output: ['DOM patch: textContent "0" -> "1"'],
      },
      {
        title: 'componentDidUpdate',
        code: `componentDidUpdate(prevProps, prevState) {
  if (prevState.seconds !== this.state.seconds) {
    document.title = 'Seconds: ' + this.state.seconds
  }
}`,
        explanation: 'After the DOM is updated, componentDidUpdate fires with the previous props and state. This is where you respond to changes -- sync external systems, trigger animations, or make conditional API calls.',
      },
    ],
  },
  {
    id: 'unmount',
    label: 'Unmount Phase',
    steps: [
      {
        title: 'Component is Removed from Tree',
        code: `function App() {
  const [show, setShow] = useState(true)
  return (
    <div>
      {show && <Timer />}
      <button onClick={() => setShow(false)}>
        Remove Timer
      </button>
    </div>
  )
}`,
        explanation: 'When a parent stops rendering a child (conditional rendering, route change, list item removal), React needs to clean up that component and remove its DOM nodes.',
      },
      {
        title: 'componentWillUnmount: Cleanup',
        code: `componentWillUnmount() {
  clearInterval(this.interval)
}`,
        explanation: 'Before removing the DOM nodes, React calls componentWillUnmount. This is your last chance to clean up: cancel timers, unsubscribe from events, abort pending requests, and release resources.',
        output: ['Timer cleared: interval ID 42', 'DOM nodes removed'],
      },
      {
        title: 'What Happens If You Forget Cleanup',
        code: `// If you skip componentWillUnmount:
// - setInterval keeps firing
// - setState called on unmounted component
// - Memory leak: old component stays in memory
// - Console warning in development mode`,
        explanation: 'Forgetting cleanup causes memory leaks. The timer keeps a reference to the component instance, preventing garbage collection. The interval fires setState on an unmounted component, which is a no-op but wastes resources.',
      },
      {
        title: 'Unmount Order in Nested Trees',
        code: `// Given: <Parent> -> <Child> -> <GrandChild>
// Unmount order (bottom-up):
// 1. GrandChild.componentWillUnmount()
// 2. Child.componentWillUnmount()
// 3. Parent.componentWillUnmount()
// 4. All DOM nodes removed`,
        explanation: 'React unmounts children before parents (bottom-up). This ensures child cleanup code can still access the DOM and parent context during its componentWillUnmount call.',
      },
    ],
  },
  {
    id: 'hooks',
    label: 'Hooks Equivalents',
    steps: [
      {
        title: 'useEffect = Mount + Update + Unmount',
        code: `function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <span>Seconds: {seconds}</span>
}`,
        explanation: 'useEffect with an empty dependency array runs after mount (like componentDidMount). The returned cleanup function runs on unmount (like componentWillUnmount). One hook replaces two lifecycle methods.',
      },
      {
        title: 'useEffect with Dependencies = componentDidUpdate',
        code: `useEffect(() => {
  document.title = 'Count: ' + count
}, [count])

// Runs after mount AND after every render
// where count has changed
// Equivalent to componentDidUpdate with a
// prevState comparison`,
        explanation: 'When you pass dependencies, the effect runs on mount and whenever any dependency changes. This replaces the componentDidUpdate pattern of comparing previous and current values.',
      },
      {
        title: 'useLayoutEffect = Synchronous After DOM',
        code: `useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPosition({ x: rect.left, y: rect.top })
}, [])

// Fires synchronously after DOM mutations
// but BEFORE the browser paints
// Use for measuring DOM or preventing flicker`,
        explanation: 'useLayoutEffect fires synchronously after DOM changes but before the browser paints. It replaces the synchronous timing of componentDidMount and componentDidUpdate for measurements that must not cause visual flicker.',
      },
      {
        title: 'Lifecycle to Hooks Mapping',
        code: `// constructor       -> useState(initialValue)
// componentDidMount -> useEffect(fn, [])
// componentDidUpdate -> useEffect(fn, [deps])
// componentWillUnmount -> useEffect cleanup
// shouldComponentUpdate -> React.memo()
// getDerivedStateFromProps -> useState + useEffect
// getSnapshotBeforeUpdate -> no hook equivalent`,
        explanation: 'Hooks consolidate lifecycle logic by concern rather than by timing. Instead of spreading related code across multiple lifecycle methods, a single useEffect groups the setup and teardown for one feature together.',
        output: [
          'Class: 3 methods for 1 subscription',
          'Hooks: 1 useEffect for 1 subscription',
        ],
      },
    ],
  },
]

export function ComponentLifecycleViz(): JSX.Element {
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
