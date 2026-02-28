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
    id: 'suspense-basics',
    label: 'Suspense Basics',
    steps: [
      {
        title: 'The Problem: Loading State Everywhere',
        code: `function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />
  return <div>{user.name}</div>
}`,
        explanation: 'Traditional data fetching requires manually tracking loading and error states in every component. This leads to repetitive boilerplate and scattered loading logic throughout the component tree.',
        output: ['Every component manages its own loading state', 'Boilerplate: useState + useEffect + if(loading)'],
      },
      {
        title: 'Suspense Declares Loading Boundaries',
        code: `import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Profile />
    </Suspense>
  )
}

function Profile() {
  const user = use(fetchUser())
  return <div>{user.name}</div>
}`,
        explanation: 'Suspense inverts the loading pattern. Instead of each component managing its own loading state, you declare a boundary. When any child "suspends" (throws a promise), React catches it and renders the fallback until the data resolves.',
      },
      {
        title: 'How Suspense Works Internally',
        code: `// 1. Profile calls use(fetchUser())
// 2. fetchUser() returns an unresolved promise
// 3. use() throws the promise
// 4. React catches it at the nearest Suspense
// 5. Suspense renders <Spinner /> fallback
// 6. When the promise resolves:
// 7. React retries rendering Profile
// 8. use() now returns the resolved data
// 9. Profile renders with the user data`,
        explanation: 'Suspense uses a "throw and retry" mechanism. A suspending component throws a promise, which React catches at the nearest Suspense boundary. React displays the fallback, waits for the promise to resolve, then retries the render.',
        output: ['throw Promise -> catch at Suspense -> show fallback', 'resolve -> retry render -> show content'],
      },
    ],
  },
  {
    id: 'loading-states',
    label: 'Loading States',
    steps: [
      {
        title: 'Skeleton Fallbacks',
        code: `function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-12 bg-gray-700 rounded-full" />
      <div className="h-4 w-32 bg-gray-700 rounded mt-2" />
      <div className="h-3 w-48 bg-gray-700 rounded mt-1" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile />
    </Suspense>
  )
}`,
        explanation: 'Instead of generic spinners, skeleton screens show the shape of upcoming content. They reduce perceived loading time by giving users a preview of the layout. The fallback can be any React component.',
      },
      {
        title: 'Streaming with Suspense in Next.js',
        code: `// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}`,
        explanation: 'Next.js uses Suspense for streaming server-side rendering. The shell (h1, layout) sends immediately. Each Suspense boundary streams its content as the data resolves, progressively revealing the page without waiting for all data.',
        output: ['Instant: shell + skeletons', '200ms: Stats streams in', '400ms: Chart streams in', '600ms: Orders streams in'],
      },
      {
        title: 'Avoiding Flash of Loading State',
        code: `// React 18+ can avoid flashing a fallback
// for very fast loads using transitions:

function SearchResults() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSearch(text: string) {
    startTransition(() => {
      setQuery(text)
    })
  }

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <Suspense fallback={<ResultsSkeleton />}>
          <Results query={query} />
        </Suspense>
      </div>
    </div>
  )
}`,
        explanation: 'Wrapping state updates in startTransition tells React to keep showing the current content (with reduced opacity) instead of immediately showing the Suspense fallback. This prevents jarring flashes for fast-resolving data.',
        output: ['Without transition: flash skeleton on every keystroke', 'With transition: dim current results, swap when ready'],
      },
    ],
  },
  {
    id: 'nested-suspense',
    label: 'Nested Suspense',
    steps: [
      {
        title: 'Single Boundary: All or Nothing',
        code: `<Suspense fallback={<FullPageSpinner />}>
  <Header />      {/* fast: 50ms */}
  <Sidebar />     {/* medium: 300ms */}
  <MainContent /> {/* slow: 1500ms */}
</Suspense>`,
        explanation: 'A single Suspense boundary around everything shows the fallback until the slowest child resolves. The user sees nothing for 1500ms even though Header data was ready in 50ms. This creates a poor perceived performance.',
        output: ['0-1500ms: FullPageSpinner', '1500ms: everything appears at once'],
      },
      {
        title: 'Nested Boundaries: Progressive Reveal',
        code: `<div>
  <Suspense fallback={<HeaderSkeleton />}>
    <Header />
  </Suspense>

  <div className="flex">
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />
    </Suspense>

    <Suspense fallback={<ContentSkeleton />}>
      <MainContent />
    </Suspense>
  </div>
</div>`,
        explanation: 'Each Suspense boundary is independent. Header appears at 50ms, Sidebar at 300ms, and MainContent at 1500ms. The page builds up progressively, keeping the user engaged as content arrives.',
        output: ['50ms: Header appears', '300ms: Sidebar appears', '1500ms: MainContent appears'],
      },
      {
        title: 'Grouping Related Content',
        code: `<div>
  <Suspense fallback={<NavSkeleton />}>
    <Header />
  </Suspense>

  <Suspense fallback={<DashboardSkeleton />}>
    {/* These load together or not at all */}
    <StatsBar />
    <RevenueChart />
    <ActivityFeed />
  </Suspense>
</div>`,
        explanation: 'Group components that should appear together in the same Suspense boundary. StatsBar, RevenueChart, and ActivityFeed are all dashboard content that makes more sense appearing as a unit rather than popping in one at a time.',
        output: ['Header: loads independently (fast)', 'Dashboard group: appears when slowest child resolves'],
      },
    ],
  },
  {
    id: 'error-suspense',
    label: 'Error + Suspense',
    steps: [
      {
        title: 'ErrorBoundary Catches Render Errors',
        code: `import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback: ReactNode }
interface State { hasError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}`,
        explanation: 'ErrorBoundary is a class component that catches JavaScript errors during rendering. When a child throws an error (not a promise), getDerivedStateFromError switches to the error fallback UI instead of crashing the entire app.',
      },
      {
        title: 'Combining Error and Loading States',
        code: `function App() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Spinner />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  )
}

// Flow:
// 1. UserProfile throws Promise -> Suspense catches -> Spinner
// 2. Promise resolves -> UserProfile renders with data
// 3. If fetch fails -> Promise rejects -> Error thrown
// 4. ErrorBoundary catches -> ErrorMessage`,
        explanation: 'ErrorBoundary wraps Suspense to handle both loading and error states. Suspense handles the loading phase (thrown promises), while ErrorBoundary handles failures (thrown errors). Together they cover the entire async lifecycle.',
        output: ['Loading: Suspense -> Spinner', 'Success: Suspense -> UserProfile', 'Failure: ErrorBoundary -> ErrorMessage'],
      },
      {
        title: 'Granular Error Recovery',
        code: `function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<p>Stats failed</p>}>
        <Suspense fallback={<StatsSkeleton />}>
          <Stats />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Chart failed</p>}>
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}`,
        explanation: 'Wrapping each section in its own ErrorBoundary + Suspense pair means a failure in Stats does not take down the entire page. RevenueChart continues to load and render normally even if Stats throws an error.',
        output: ['Stats fetch fails: "Stats failed" message', 'Chart: loads normally, unaffected'],
      },
    ],
  },
]

export function SuspenseViz(): JSX.Element {
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
