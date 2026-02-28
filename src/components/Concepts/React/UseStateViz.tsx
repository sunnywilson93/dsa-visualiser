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
    id: 'basic-counter',
    label: 'Basic Counter',
    steps: [
      {
        title: 'Declaring State with useState',
        code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  //     ^        ^                  ^
  //  value   setter fn      initial value
}`,
        explanation: 'useState returns a pair: the current state value and a function to update it. The argument to useState is the initial value, used only on the first render. React preserves this state between re-renders.',
      },
      {
        title: 'Reading and Displaying State',
        code: `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  )
}`,
        explanation: 'You read state by using the first value from the destructured array. Every time the component renders, count holds the current state value. On the initial render, count is 0.',
        output: ['Count: 0'],
      },
      {
        title: 'Updating State Triggers Re-render',
        code: `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`,
        explanation: 'Calling setCount with a new value tells React to re-render the component. On the next render, useState returns the updated value. The old value is replaced, not mutated.',
        output: ['Click: Count: 0 -> Count: 1 -> Count: 2'],
      },
      {
        title: 'State is Isolated Per Component',
        code: `function App() {
  return (
    <>
      <Counter />  {/* count: 3 */}
      <Counter />  {/* count: 0 */}
    </>
  )
}`,
        explanation: 'Each component instance gets its own independent state. If you render two Counter components, each has its own count that changes independently. State is local to the component instance, not shared.',
      },
    ],
  },
  {
    id: 'object-state',
    label: 'Object State',
    steps: [
      {
        title: 'State Can Hold Objects',
        code: `const [user, setUser] = useState({
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
})`,
        explanation: 'useState can hold any value: numbers, strings, booleans, arrays, or objects. When holding an object, you need to be careful about how you update it.',
      },
      {
        title: 'Never Mutate State Directly',
        code: `// WRONG - mutating state directly
user.name = 'Bob'

// React does NOT re-render because
// the object reference hasn't changed.
// user is still the same object in memory.`,
        explanation: 'React uses Object.is() to compare old and new state. If you mutate the existing object, the reference stays the same and React skips the re-render. This is the most common useState bug with objects.',
      },
      {
        title: 'Create a New Object with Spread',
        code: `// CORRECT - create new object
setUser({
  ...user,           // copy all existing fields
  name: 'Bob'        // override just this one
})

// New object reference -> React re-renders`,
        explanation: 'The spread operator creates a shallow copy of the object, then you override the fields you want to change. This produces a new object reference, which React detects as a state change and triggers a re-render.',
        output: ['{ name: "Bob", age: 25, email: "alice@..." }'],
      },
      {
        title: 'Updating Nested Objects',
        code: `const [form, setForm] = useState({
  personal: { name: 'Alice', age: 25 },
  address: { city: 'NYC', zip: '10001' }
})

setForm({
  ...form,
  personal: {
    ...form.personal,
    name: 'Bob'
  }
})`,
        explanation: 'For nested objects, you must spread at every level that contains a change. This can get verbose, which is why libraries like Immer exist. Each level produces a new object reference while keeping unchanged branches the same.',
        output: ['{ personal: { name: "Bob", age: 25 }, ... }'],
      },
    ],
  },
  {
    id: 'functional-updates',
    label: 'Functional Updates',
    steps: [
      {
        title: 'The Stale State Problem',
        code: `function Counter() {
  const [count, setCount] = useState(0)

  const handleTripleClick = () => {
    setCount(count + 1)  // count = 0, sets 1
    setCount(count + 1)  // count = 0, sets 1
    setCount(count + 1)  // count = 0, sets 1
  }
}`,
        explanation: 'All three setCount calls see the same count value (0) from the current render. React queues these updates, but each one uses the stale closure value. The result is count = 1, not 3.',
        output: ['Expected: 3', 'Actual: 1'],
      },
      {
        title: 'Functional Updates to the Rescue',
        code: `const handleTripleClick = () => {
  setCount(prev => prev + 1)  // 0 -> 1
  setCount(prev => prev + 1)  // 1 -> 2
  setCount(prev => prev + 1)  // 2 -> 3
}`,
        explanation: 'When you pass a function to setCount, React calls it with the latest pending state value. Each updater function receives the result of the previous one, so they chain correctly. This is the pattern for any update that depends on the previous value.',
        output: ['Result: 3'],
      },
      {
        title: 'When to Use Functional Updates',
        code: `// Use functional form when new state
// depends on previous state:
setCount(prev => prev + 1)
setItems(prev => [...prev, newItem])
setEnabled(prev => !prev)

// Direct value is fine when new state
// is independent of previous:
setName('Alice')
setColor('blue')
setVisible(true)`,
        explanation: 'Use the functional form whenever the next state is computed from the previous state. Use direct values when setting state to a completely independent value. This prevents bugs from stale closures in event handlers and effects.',
      },
    ],
  },
  {
    id: 'batching',
    label: 'Batching',
    steps: [
      {
        title: 'React Batches State Updates',
        code: `function Form() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    setName('Alice')
    setAge(25)
    setEmail('alice@dev.io')
    // Only ONE re-render happens here!
  }
}`,
        explanation: 'React batches multiple setState calls within the same event handler into a single re-render. This is an optimization: instead of rendering three times, React waits until all state updates are processed, then renders once with all the new values.',
        output: ['Re-renders: 1 (not 3)'],
      },
      {
        title: 'Batching in React 18+',
        code: `// React 18: batching works everywhere!
setTimeout(() => {
  setCount(1)
  setFlag(true)
  // One re-render (React 18+)
}, 1000)

fetch('/api/data').then(data => {
  setData(data)
  setLoading(false)
  // One re-render (React 18+)
})`,
        explanation: 'Before React 18, batching only worked in React event handlers. React 18 introduced automatic batching for all updates, including setTimeout, promises, and native event handlers. This means fewer re-renders across your entire app.',
        output: ['All updates batched -> 1 render each'],
      },
      {
        title: 'Forcing Immediate Re-render',
        code: `import { flushSync } from 'react-dom'

const handleClick = () => {
  flushSync(() => {
    setCount(1)
  })
  // DOM is updated here

  flushSync(() => {
    setFlag(true)
  })
  // DOM is updated here
}`,
        explanation: 'In rare cases where you need the DOM to update between state changes (e.g., for measurements), you can use flushSync to force React to flush updates synchronously. This is uncommon and should be avoided unless necessary.',
        output: ['Re-renders: 2 (forced)'],
      },
    ],
  },
]

export function UseStateViz(): JSX.Element {
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
                : 'bg-white-5 border border-white-10 text-text-muted hover:bg-white-10'
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

      <div className="rounded-xl border border-white-10 overflow-hidden">
        <CodeBlock code={currentStep.code} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`exp-${activeTab}-${stepIndex}`}
          className="text-base leading-relaxed text-text-muted bg-black-30 border border-white-10 rounded-lg px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentStep.explanation}
        </motion.p>
      </AnimatePresence>

      {currentStep.output && currentStep.output.length > 0 && (
        <div className="bg-black-40 border border-emerald-30 rounded-lg px-4 py-3">
          <div className="text-xs font-semibold text-emerald-500 mb-1">Output</div>
          <div className="font-mono text-sm text-emerald-400">
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
