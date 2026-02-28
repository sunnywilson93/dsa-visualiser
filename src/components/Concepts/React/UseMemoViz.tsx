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
    id: 'expensive-computation',
    label: 'Expensive Computation',
    steps: [
      {
        title: 'The Problem: Recalculating Every Render',
        code: `function ProductList({ products, query }) {
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query)
  )
  const sorted = filtered.sort((a, b) =>
    a.price - b.price
  )

  return sorted.map(p => <Product key={p.id} item={p} />)
}`,
        explanation: 'Every time this component renders — even if only an unrelated piece of state changed — the entire filter-and-sort pipeline runs again. With thousands of products, this is noticeably slow.',
      },
      {
        title: 'Memoizing the Expensive Work',
        code: `import { useMemo } from 'react'

function ProductList({ products, query }) {
  const sorted = useMemo(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query)
    )
    return filtered.sort((a, b) => a.price - b.price)
  }, [products, query])

  return sorted.map(p => <Product key={p.id} item={p} />)
}`,
        explanation: 'useMemo caches the result of the computation. It only re-runs the function when products or query change. If neither dependency changed, React returns the cached result instantly.',
      },
      {
        title: 'How the Cache Works',
        code: `// Render 1: query = "shoe"
// => Runs computation, caches result

// Render 2: query = "shoe" (same)
// => Returns cached result, skips computation

// Render 3: query = "boot" (changed!)
// => Runs computation, caches new result`,
        explanation: 'useMemo keeps exactly one cached value. When dependencies change, it discards the old cache and runs the function again. It is a single-entry cache — not a full memoization table.',
        output: ['Render 1: computed (cached)', 'Render 2: cache hit', 'Render 3: computed (new cache)'],
      },
    ],
  },
  {
    id: 'reference-stability',
    label: 'Reference Stability',
    steps: [
      {
        title: 'Objects Recreated Every Render',
        code: `function Chart({ data }) {
  const options = {
    xAxis: { type: 'time' },
    yAxis: { min: 0 },
    series: data
  }

  return <ExpensiveChart options={options} />
}`,
        explanation: 'Even though options has the same values each render, it is a new object in memory every time. ExpensiveChart receives a "new" prop on every render and re-renders unnecessarily.',
      },
      {
        title: 'Stabilizing the Reference',
        code: `function Chart({ data }) {
  const options = useMemo(() => ({
    xAxis: { type: 'time' },
    yAxis: { min: 0 },
    series: data
  }), [data])

  return <ExpensiveChart options={options} />
}`,
        explanation: 'useMemo returns the same object reference as long as data has not changed. ExpensiveChart sees the same prop reference and can skip re-rendering (when wrapped in React.memo).',
      },
      {
        title: 'Why Reference Identity Matters',
        code: `// Without useMemo:
const a = { x: 1 }  // render 1
const b = { x: 1 }  // render 2
a === b  // false (different objects!)

// With useMemo:
const a = useMemo(() => ({ x: 1 }), [])
// render 1: a => { x: 1 } (new)
// render 2: a => { x: 1 } (same reference)`,
        explanation: 'JavaScript compares objects by reference, not by value. Two objects with identical contents are still !== to each other. useMemo preserves the reference so downstream equality checks pass.',
        output: ['{ x: 1 } === { x: 1 }  // false', 'memo === memo         // true'],
      },
    ],
  },
  {
    id: 'when-to-use',
    label: 'When to Use',
    steps: [
      {
        title: 'Good Use Case: Derived Data',
        code: `function Dashboard({ transactions }) {
  const summary = useMemo(() => ({
    total: transactions.reduce(
      (sum, t) => sum + t.amount, 0
    ),
    average: transactions.reduce(
      (sum, t) => sum + t.amount, 0
    ) / transactions.length,
    count: transactions.length
  }), [transactions])

  return <SummaryCard data={summary} />
}`,
        explanation: 'Deriving aggregate data from a large collection is a textbook useMemo case. The computation scales with data size, and recalculating on every keystroke in an unrelated input would waste cycles.',
      },
      {
        title: 'Good Use Case: Stable Hook Dependencies',
        code: `function SearchResults({ items, filters }) {
  const filtered = useMemo(
    () => applyFilters(items, filters),
    [items, filters]
  )

  useEffect(() => {
    analytics.track('results', filtered.length)
  }, [filtered])

  return <List items={filtered} />
}`,
        explanation: 'When a memoized value is used as a dependency in useEffect, useMemo prevents the effect from running on every render. Without it, filtered would be a new array each time, triggering the effect unnecessarily.',
      },
      {
        title: 'When NOT to Use: Simple Values',
        code: `function Greeting({ firstName, lastName }) {
  const fullName = useMemo(
    () => firstName + ' ' + lastName,
    [firstName, lastName]
  )
  return <h1>{fullName}</h1>
}`,
        explanation: 'String concatenation is trivially cheap. The overhead of useMemo (comparing dependencies, storing the cache) costs more than just doing the concatenation. Do not memoize simple expressions.',
        output: ['String concat: ~0.001ms', 'useMemo overhead: ~0.01ms', 'Net effect: slower with useMemo'],
      },
    ],
  },
  {
    id: 'pitfalls',
    label: 'Pitfalls',
    steps: [
      {
        title: 'Pitfall: Unstable Dependencies',
        code: `function List({ items }) {
  const config = { sortBy: 'name', order: 'asc' }

  const sorted = useMemo(
    () => sortItems(items, config),
    [items, config]
  )
}`,
        explanation: 'config is a new object every render, so the dependency always changes and useMemo never caches. Move config outside the component, or memoize it too, or inline the primitive values in the dependency array.',
      },
      {
        title: 'Fix: Stable Dependencies',
        code: `const config = { sortBy: 'name', order: 'asc' }

function List({ items }) {
  const sorted = useMemo(
    () => sortItems(items, config),
    [items]
  )
}

// OR inline primitives:
function List({ items }) {
  const sorted = useMemo(
    () => sortItems(items, 'name', 'asc'),
    [items]
  )
}`,
        explanation: 'Moving the constant outside the component or using primitive dependency values ensures the dependency array is stable. useMemo can now properly cache the result between renders.',
      },
      {
        title: 'Pitfall: Memoizing Everything',
        code: `function App() {
  const a = useMemo(() => 1 + 1, [])
  const b = useMemo(() => 'hello', [])
  const c = useMemo(() => true, [])

  return <div>{a} {b} {String(c)}</div>
}`,
        explanation: 'React does not guarantee useMemo will keep its cache forever — it may discard cached values to free memory. Treat useMemo as a performance optimization, not a semantic guarantee. Only use it when you have measured a real performance problem.',
        output: ['Premature optimization', 'adds complexity without benefit', 'measure first, memoize second'],
      },
    ],
  },
]

export function UseMemoViz(): JSX.Element {
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
