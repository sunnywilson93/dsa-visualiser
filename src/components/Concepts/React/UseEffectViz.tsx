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
    id: 'side-effects',
    label: 'Side Effects',
    steps: [
      {
        title: 'What Are Side Effects?',
        code: `function Profile({ userId }) {
  // These are all side effects:
  // - Fetching data from an API
  // - Setting up a subscription
  // - Manually changing the DOM
  // - Setting a timer

  // They can't go in the render body
  // because rendering should be pure.
}`,
        explanation: 'A side effect is anything that reaches outside the component to interact with the world: network requests, DOM manipulation, timers, logging, etc. React components should be pure functions during rendering, so side effects need a dedicated place to live.',
      },
      {
        title: 'useEffect is the Escape Hatch',
        code: `import { useEffect } from 'react'

function Profile({ userId }) {
  useEffect(() => {
    document.title = 'Profile: ' + userId
  })

  return <h1>Profile</h1>
}`,
        explanation: 'useEffect lets you run side effects after React has updated the DOM. The function you pass to useEffect runs after every render by default. React first renders the component, updates the DOM, then runs your effect.',
        output: ['Render -> DOM update -> Effect runs'],
      },
      {
        title: 'Effect Timing: After Paint',
        code: `function App() {
  console.log('1. Render')

  useEffect(() => {
    console.log('3. Effect runs')
  })

  console.log('2. Return JSX')
  return <div>Hello</div>
}`,
        explanation: 'Effects run after the browser has painted the screen. This means the user sees the UI first, then the effect runs. This prevents effects from blocking the visual update. The execution order is: render body, return JSX, browser paint, then effect.',
        output: ['1. Render', '2. Return JSX', '-- browser paints --', '3. Effect runs'],
      },
    ],
  },
  {
    id: 'dependency-array',
    label: 'Dependency Array',
    steps: [
      {
        title: 'No Dependency Array: Every Render',
        code: `useEffect(() => {
  console.log('Runs after EVERY render')
})`,
        explanation: 'Without a dependency array, the effect runs after the initial render and after every re-render. This is rarely what you want because it can cause performance issues or infinite loops if the effect triggers state updates.',
        output: ['Render 1: effect runs', 'Render 2: effect runs', 'Render 3: effect runs'],
      },
      {
        title: 'Empty Array: Mount Only',
        code: `useEffect(() => {
  console.log('Runs ONCE after first render')

  const ws = new WebSocket('/chat')
  ws.onmessage = (e) => handleMessage(e)
}, [])  // <-- empty array`,
        explanation: 'An empty dependency array tells React this effect has no reactive dependencies. It runs once after the initial render (mount) and never again. This is the pattern for one-time setup like establishing WebSocket connections or initializing third-party libraries.',
        output: ['Mount: effect runs', 'Re-render: (skipped)', 'Re-render: (skipped)'],
      },
      {
        title: 'Specific Dependencies',
        code: `useEffect(() => {
  console.log('userId changed to:', userId)
  fetchUserData(userId)
}, [userId])  // <-- only re-run when userId changes`,
        explanation: 'Listing specific dependencies makes the effect re-run only when those values change. React compares each dependency with its previous value using Object.is(). If nothing changed, the effect is skipped. Always include every reactive value that the effect reads.',
        output: ['userId = 1: effect runs', 'userId = 1: (skipped)', 'userId = 2: effect runs'],
      },
      {
        title: 'Multiple Dependencies',
        code: `useEffect(() => {
  const results = search(query, filters)
  setResults(results)
}, [query, filters])
// Re-runs when EITHER query OR filters change`,
        explanation: 'You can list multiple dependencies. The effect re-runs if any single dependency changes. React checks each one individually. This is how you synchronize your component with external data that depends on multiple reactive values.',
        output: ['query changes: effect runs', 'filters changes: effect runs', 'neither changes: (skipped)'],
      },
    ],
  },
  {
    id: 'cleanup',
    label: 'Cleanup Function',
    steps: [
      {
        title: 'Why Cleanup Matters',
        code: `useEffect(() => {
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  // Without cleanup: interval keeps
  // running even after component unmounts!
  // Memory leak + errors on unmounted state
}, [])`,
        explanation: 'When a component unmounts or before an effect re-runs, any ongoing subscriptions, timers, or listeners from the previous effect must be stopped. Without cleanup, you get memory leaks and attempts to update state on unmounted components.',
        output: ['Component mounts: tick tick tick...', 'Component unmounts: tick tick (leak!)'],
      },
      {
        title: 'Returning a Cleanup Function',
        code: `useEffect(() => {
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => {
    clearInterval(id)  // cleanup!
  }
}, [])`,
        explanation: 'Return a function from your effect to tell React how to clean up. React calls this cleanup function before re-running the effect and when the component unmounts. Think of it as the undo button for your effect.',
        output: ['Mount: interval starts', 'Unmount: clearInterval called'],
      },
      {
        title: 'Cleanup on Re-run',
        code: `useEffect(() => {
  const conn = createConnection(roomId)
  conn.connect()

  return () => {
    conn.disconnect()  // clean up old room
  }
}, [roomId])`,
        explanation: 'When dependencies change, React first runs the cleanup from the previous effect, then runs the new effect. This ensures you disconnect from the old room before connecting to the new one. The sequence is: old cleanup, then new effect.',
        output: [
          'roomId = "general": connect',
          'roomId -> "random": disconnect "general"',
          'roomId = "random": connect',
        ],
      },
      {
        title: 'Event Listener Pattern',
        code: `useEffect(() => {
  const handleResize = () => {
    setWidth(window.innerWidth)
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])`,
        explanation: 'Adding and removing event listeners is one of the most common cleanup patterns. Always remove the exact same function reference you added. This prevents accumulating duplicate listeners across re-renders.',
      },
    ],
  },
  {
    id: 'common-patterns',
    label: 'Common Patterns',
    steps: [
      {
        title: 'Data Fetching',
        code: `useEffect(() => {
  let cancelled = false

  async function fetchData() {
    const res = await fetch('/api/user/' + id)
    const data = await res.json()

    if (!cancelled) {
      setUser(data)
    }
  }

  fetchData()
  return () => { cancelled = true }
}, [id])`,
        explanation: 'The boolean flag pattern prevents setting state from a stale request. If id changes before the fetch completes, the cleanup sets cancelled = true, so the old response is ignored. This avoids race conditions where a slow early request overwrites a fast later one.',
        output: ['id=1: fetch starts', 'id=2: cancel id=1, fetch id=2', 'id=2: setUser(data)'],
      },
      {
        title: 'Debounced Search',
        code: `useEffect(() => {
  const timer = setTimeout(() => {
    searchAPI(query)
  }, 300)

  return () => clearTimeout(timer)
}, [query])`,
        explanation: 'Each keystroke changes query, which triggers the effect. But the cleanup clears the previous timer before setting a new one. The API call only fires when the user stops typing for 300ms. This is a natural debounce using the effect cleanup cycle.',
        output: ['Type "r": set timer', 'Type "re": clear, set timer', 'Type "rea": clear, set timer', '300ms pause: searchAPI("rea")'],
      },
      {
        title: 'Syncing with External Store',
        code: `useEffect(() => {
  function handleChange() {
    setIsOnline(navigator.onLine)
  }

  window.addEventListener('online', handleChange)
  window.addEventListener('offline', handleChange)

  handleChange()

  return () => {
    window.removeEventListener('online', handleChange)
    window.removeEventListener('offline', handleChange)
  }
}, [])`,
        explanation: 'This pattern synchronizes React state with a browser API. The effect sets up listeners, reads the initial value, and cleans up on unmount. For this specific case, useSyncExternalStore is often better, but the pattern illustrates how effects bridge React and the outside world.',
      },
    ],
  },
]

export function UseEffectViz(): JSX.Element {
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
