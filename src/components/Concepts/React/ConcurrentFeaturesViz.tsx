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
    id: 'start-transition',
    label: 'startTransition',
    steps: [
      {
        title: 'The Problem: Blocking Updates',
        code: `function FilterableList() {
  const [query, setQuery] = useState('')
  const [items] = useState(generateLargeList(10000))

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <List items={filtered} />
    </div>
  )
}`,
        explanation: 'Typing in the input triggers a state update that re-renders the entire list. Filtering 10,000 items is slow, so the input becomes unresponsive. Each keystroke must wait for the expensive filter and render to complete before the UI updates.',
        output: ['Type "a": input freezes for 200ms', 'Type "ab": another 200ms freeze', 'User perceives lag and jank'],
      },
      {
        title: 'Separating Urgent from Non-Urgent',
        code: `import { useState, startTransition } from 'react'

function FilterableList() {
  const [query, setQuery] = useState('')
  const [deferredQuery, setDeferredQuery] = useState('')
  const [items] = useState(generateLargeList(10000))

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(deferredQuery.toLowerCase())
  )

  function handleChange(text: string) {
    setQuery(text)              // urgent: update input NOW
    startTransition(() => {
      setDeferredQuery(text)    // non-urgent: can wait
    })
  }

  return (
    <div>
      <input value={query} onChange={e => handleChange(e.target.value)} />
      <List items={filtered} />
    </div>
  )
}`,
        explanation: 'startTransition marks the list filter update as non-urgent. React processes the input update immediately so the user sees their keystrokes without delay. The expensive list re-render happens in the background and can be interrupted by new keystrokes.',
        output: ['Type "a": input updates instantly', 'List re-render starts in background', 'Type "b": interrupts previous render, restarts'],
      },
      {
        title: 'Transitions Are Interruptible',
        code: `// Without startTransition:
// "a" -> render 10K items -> "b" -> render 10K items
// Total blocking: 400ms, user sees stutter

// With startTransition:
// "a" -> input updates -> start rendering list...
// "ab" typed -> ABORT list render -> input updates
//            -> start rendering list for "ab"...
// "abc" typed -> ABORT again -> input updates
//             -> start rendering list for "abc"
// User stops typing -> finish list render for "abc"`,
        explanation: 'This is the key insight of concurrent rendering. React can pause a non-urgent render in progress when a new urgent update arrives. The expensive list render for "a" is abandoned as soon as the user types "b", preventing wasted work.',
        output: ['Urgent: always processed immediately', 'Transition: rendered when idle, interruptible'],
      },
    ],
  },
  {
    id: 'use-deferred-value',
    label: 'useDeferredValue',
    steps: [
      {
        title: 'Deferring an Expensive Computation',
        code: `import { useState, useDeferredValue } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ResultsList query={deferredQuery} />
    </div>
  )
}`,
        explanation: 'useDeferredValue accepts a value and returns a "deferred" copy. During urgent updates (typing), React keeps the old deferred value and renders the input immediately. Once the urgent render finishes, React re-renders in the background with the new deferred value.',
        output: ['query: updates immediately on keystroke', 'deferredQuery: lags behind, updates when idle'],
      },
      {
        title: 'Showing Stale Content During Update',
        code: `function SearchResults() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <ResultsList query={deferredQuery} />
      </div>
    </div>
  )
}`,
        explanation: 'Comparing query to deferredQuery tells you if the displayed results are stale. You can dim the old results to signal that an update is in progress. This is better than showing a loading spinner because the user still sees the previous results.',
        output: ['User types: input updates, results dim to 60%', 'Deferred render completes: results update, full opacity'],
      },
      {
        title: 'useDeferredValue vs startTransition',
        code: `// useDeferredValue: defers a VALUE
const deferredQuery = useDeferredValue(query)
// Use when you receive a value from a parent
// or cannot control the state update

// startTransition: defers a STATE UPDATE
startTransition(() => {
  setFilteredItems(filter(items, query))
})
// Use when you own the state setter
// and can separate urgent from non-urgent updates

// Both produce the same concurrent behavior:
// urgent updates are not blocked by transitions`,
        explanation: 'useDeferredValue is useful when you receive a prop from above and cannot control when it updates. startTransition is useful when you own the state and can explicitly mark certain updates as non-urgent. Both achieve interruptible rendering.',
        output: ['useDeferredValue: defer received values', 'startTransition: defer state updates you control'],
      },
    ],
  },
  {
    id: 'prioritized-updates',
    label: 'Prioritized Updates',
    steps: [
      {
        title: 'React Update Priorities',
        code: `// URGENT (synchronous, cannot be interrupted):
// - Typing in an input
// - Clicking a button
// - Pressing a key

// TRANSITION (can be interrupted):
// - Filtering a large list
// - Switching tabs with heavy content
// - Navigating to a new page

// React processes urgent updates first,
// then works on transitions when idle`,
        explanation: 'React assigns priorities to state updates. Direct user interactions like typing and clicking are always urgent. Updates wrapped in startTransition are lower priority and can be deferred or interrupted without blocking the UI.',
      },
      {
        title: 'Priority in Action: Tab Switching',
        code: `function Tabs() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab)  // non-urgent
    })
  }

  return (
    <div>
      <TabBar
        activeTab={tab}
        onSelect={selectTab}
        isPending={isPending}
      />
      <TabContent tab={tab} />
    </div>
  )
}`,
        explanation: 'Clicking a tab triggers a transition. React immediately highlights the clicked tab (urgent UI feedback) but defers rendering the heavy tab content. If the user clicks a different tab before the first one finishes rendering, React abandons the first render.',
        output: ['Click "Posts": tab highlights instantly', 'Heavy content renders in background', 'Click "Photos": abandons Posts render, starts Photos'],
      },
      {
        title: 'How Rendering Is Interrupted',
        code: `// React 18 concurrent renderer:
//
// 1. Start rendering transition (Tab content)
// 2. After each component, check for urgent updates
// 3. If urgent update found:
//    a. Pause transition render
//    b. Process urgent update immediately
//    c. Resume transition (or restart if state changed)
//
// This "time-slicing" happens automatically.
// Each component is a potential yield point.
//
// React 17 (legacy): renders are synchronous
// React 18 (concurrent): renders are interruptible`,
        explanation: 'The concurrent renderer breaks rendering into small chunks. After rendering each component, React checks if any urgent updates are pending. If so, it pauses the transition and processes the urgent update first. This cooperative scheduling prevents long renders from blocking user interaction.',
        output: ['React 17: one render blocks the thread', 'React 18: renders yield to urgent updates'],
      },
    ],
  },
  {
    id: 'use-transition',
    label: 'useTransition',
    steps: [
      {
        title: 'useTransition Returns isPending',
        code: `import { useState, useTransition } from 'react'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  function handleSearch(text: string) {
    setQuery(text)
    startTransition(() => {
      setResults(searchDatabase(text))
    })
  }

  return (
    <div>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending && <p>Updating results...</p>}
      <ResultsList results={results} />
    </div>
  )
}`,
        explanation: 'useTransition is the hook version of startTransition. It returns [isPending, startTransition]. isPending is true while the transition is in progress, letting you show loading indicators without replacing the existing content with a fallback.',
        output: ['isPending: true while transition renders', 'isPending: false when transition completes'],
      },
      {
        title: 'isPending for Visual Feedback',
        code: `function Navigation() {
  const [page, setPage] = useState('/home')
  const [isPending, startTransition] = useTransition()

  function navigate(path: string) {
    startTransition(() => {
      setPage(path)
    })
  }

  return (
    <div>
      <nav style={{ opacity: isPending ? 0.7 : 1 }}>
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/posts')}>Posts</button>
      </nav>
      {isPending && <ProgressBar />}
      <PageContent page={page} />
    </div>
  )
}`,
        explanation: 'isPending enables smooth visual transitions. Instead of showing a blank loading state, dim the current content and show a progress bar. The user sees continuous feedback while the new page renders in the background.',
        output: ['Click "Posts": nav dims, progress bar appears', 'Posts page ready: full opacity, progress bar gone'],
      },
      {
        title: 'startTransition vs useTransition',
        code: `// startTransition: standalone function
import { startTransition } from 'react'

startTransition(() => {
  setItems(filterItems(query))
})
// No isPending available

// useTransition: hook with pending state
import { useTransition } from 'react'

const [isPending, startTransition] = useTransition()

startTransition(() => {
  setItems(filterItems(query))
})
// isPending tracks the transition state`,
        explanation: 'Use startTransition when you only need to mark an update as non-urgent. Use useTransition when you also need to track whether the transition is still in progress, which is common when you want to show loading indicators.',
        output: ['startTransition: fire and forget', 'useTransition: fire and track with isPending'],
      },
    ],
  },
]

export function ConcurrentFeaturesViz(): JSX.Element {
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
