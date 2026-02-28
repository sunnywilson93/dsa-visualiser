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
    id: 'mutable-container',
    label: 'Mutable Container',
    steps: [
      {
        title: 'useRef Creates a Persistent Box',
        code: `import { useRef } from 'react'

function Timer() {
  const intervalRef = useRef(null)
  //                         ^
  //                  initial value

  // intervalRef = { current: null }
}`,
        explanation: 'useRef returns a plain object with a single property: current. Unlike state, this object persists across renders without triggering re-renders when changed. Think of it as a box you can put any value into and read back later.',
      },
      {
        title: 'Mutating .current is Free',
        code: `function Timer() {
  const intervalRef = useRef(null)

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log('tick')
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
  }
}`,
        explanation: 'You can read and write ref.current freely without causing re-renders. This makes refs perfect for storing values that your component needs to remember but that should not trigger a visual update when they change: timer IDs, WebSocket instances, animation frame handles.',
        output: ['start(): intervalRef.current = 42', 'stop(): clearInterval(42)', 'No re-renders triggered!'],
      },
      {
        title: 'Ref Value Survives Re-renders',
        code: `function Counter() {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <div>
      <p>Count: {count}</p>
      <p>Renders: {renderCount.current}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  )
}`,
        explanation: 'The ref persists across re-renders. Each time the component re-renders, renderCount.current retains its value from the last render and increments. State changes cause re-renders; ref changes do not. But you can read the ref during render to display it.',
        output: ['Click: Count: 1, Renders: 2', 'Click: Count: 2, Renders: 3'],
      },
    ],
  },
  {
    id: 'dom-references',
    label: 'DOM References',
    steps: [
      {
        title: 'Attaching Refs to DOM Elements',
        code: `function SearchBar() {
  const inputRef = useRef(null)

  return (
    <input
      ref={inputRef}
      placeholder="Search..."
    />
  )
  // After mount:
  // inputRef.current = <input> DOM node
}`,
        explanation: 'When you pass a ref to a JSX element via the ref attribute, React sets ref.current to the actual DOM node after mounting. Before mount, it is null. This gives you direct access to the underlying DOM element.',
      },
      {
        title: 'Focusing an Input Programmatically',
        code: `function SearchBar() {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search" />
      <button onClick={handleClick}>
        Focus Input
      </button>
    </div>
  )
}`,
        explanation: 'The most common use for DOM refs is calling imperative DOM methods like focus(), scrollIntoView(), or measuring element dimensions with getBoundingClientRect(). The optional chaining (?) guards against the ref being null before mount.',
      },
      {
        title: 'Scrolling to an Element',
        code: `function Chat() {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <div>
      {messages.map(m => <Message key={m.id} />)}
      <div ref={bottomRef} />
    </div>
  )
}`,
        explanation: 'Placing an invisible element at the bottom and scrolling to it is a common pattern for chat UIs. The effect runs whenever messages change, scrolling the user to the latest message. This is an imperative DOM operation that React cannot do declaratively.',
      },
      {
        title: 'Measuring Elements',
        code: `function Tooltip({ children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [])

  return (
    <div ref={ref}>
      {children}
      <span>Height: {height}px</span>
    </div>
  )
}`,
        explanation: 'DOM refs let you measure elements after they render. getBoundingClientRect() returns the element size and position. This is essential for positioning tooltips, calculating layouts, or implementing virtual scrolling.',
        output: ['After mount: height = 48'],
      },
    ],
  },
  {
    id: 'previous-value',
    label: 'Previous Value',
    steps: [
      {
        title: 'Tracking the Previous State',
        code: `function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef(0)

  useEffect(() => {
    prevCountRef.current = count
  })

  return (
    <p>
      Now: {count},
      Before: {prevCountRef.current}
    </p>
  )
}`,
        explanation: 'This pattern stores the previous value using a ref and an effect. During render, prevCountRef still holds the old value (the effect has not run yet). After render, the effect updates the ref to the current value, ready for the next render cycle.',
        output: ['Click: Now: 1, Before: 0', 'Click: Now: 2, Before: 1'],
      },
      {
        title: 'Custom usePrevious Hook',
        code: `function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return <p>Now: {count}, Was: {prevCount}</p>
}`,
        explanation: 'Extracting this into a custom hook makes it reusable. The ref stores the previous value, and the effect updates it after each render. The returned ref.current always lags one render behind, giving you the previous value.',
        output: ['Now: 5, Was: 4'],
      },
      {
        title: 'Detecting Changes Between Renders',
        code: `function UserProfile({ userId }) {
  const prevUserId = usePrevious(userId)

  useEffect(() => {
    if (prevUserId !== userId) {
      logAnalytics('user_switch', {
        from: prevUserId,
        to: userId
      })
    }
  }, [userId, prevUserId])

  return <Profile id={userId} />
}`,
        explanation: 'Comparing current and previous values lets you detect transitions and respond to specific changes. This is useful for analytics, animations triggered by value changes, or conditional side effects that only run on certain transitions.',
        output: ['userId: 1 -> 2: logAnalytics("user_switch")'],
      },
    ],
  },
  {
    id: 'ref-vs-state',
    label: 'Ref vs State',
    steps: [
      {
        title: 'State: Triggers Re-render',
        code: `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  )
  // setCount(1) -> re-render -> UI shows 1
  // setCount(2) -> re-render -> UI shows 2
}`,
        explanation: 'State is for values that should be reflected in the UI. When state changes, React re-renders the component and the user sees the update. State is the primary way to make your UI reactive.',
        output: ['setCount(1) -> re-render -> "1"', 'setCount(2) -> re-render -> "2"'],
      },
      {
        title: 'Ref: Silent Updates',
        code: `function Stopwatch() {
  const countRef = useRef(0)

  const handleClick = () => {
    countRef.current += 1
    console.log(countRef.current)
    // UI still shows stale value!
  }

  return (
    <button onClick={handleClick}>
      {countRef.current}
    </button>
  )
}`,
        explanation: 'Refs update silently. When you change ref.current, no re-render happens, so the UI does not update. The button still shows 0 even though the ref holds 3 internally. Refs are for values your component needs internally but does not display.',
        output: ['Click: console says 1, button says 0', 'Click: console says 2, button says 0'],
      },
      {
        title: 'Decision Guide',
        code: `// Use STATE when:
// - Value is displayed in the UI
// - Change should trigger a re-render
// - Example: form inputs, toggle visibility

// Use REF when:
// - Storing DOM references
// - Timer/interval IDs
// - Values needed across renders but
//   NOT displayed in UI
// - Mutable values that shouldn't
//   cause re-renders`,
        explanation: 'The key question is: does this value affect what the user sees? If yes, use state. If the value is an implementation detail that the UI does not depend on, use a ref. Using state where a ref suffices causes unnecessary re-renders. Using a ref where state is needed causes stale UI.',
      },
      {
        title: 'Combining Both',
        code: `function Stopwatch() {
  const [time, setTime] = useState(0)
  const intervalRef = useRef(null)

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
  }

  return <p>{time}s</p>
}`,
        explanation: 'State and refs work together. The displayed time is state because the UI depends on it. The interval ID is a ref because it is an implementation detail used only to stop the timer. This is the idiomatic pattern for managing imperative operations alongside reactive UI.',
        output: ['start: time=1, time=2, time=3...', 'stop: clearInterval(ref)'],
      },
    ],
  },
]

export function UseRefViz(): JSX.Element {
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
