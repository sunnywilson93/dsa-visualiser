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
    id: 'before-compiler',
    label: 'Before (Manual)',
    steps: [
      {
        title: 'Manual Memoization with useMemo',
        code: `import { useMemo, useCallback, memo, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

function ProductList({ products, category }: {
  products: Product[]
  category: string
}) {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // Must manually memoize filtered list
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  )

  // Must manually memoize sorted list
  const sorted = useMemo(
    () => [...filtered].sort((a, b) =>
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : a.price - b.price
    ),
    [filtered, sortBy]
  )

  return (
    <div>
      <SortControls sortBy={sortBy} onSort={setSortBy} />
      {sorted.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}`,
        explanation: 'Without the React Compiler, you must manually wrap every derived computation in useMemo to prevent recalculating on every render. Missing even one dependency causes stale data; adding unnecessary dependencies causes wasted work.',
        output: ['2 useMemo calls for derived data', 'Manual dependency arrays to maintain'],
      },
      {
        title: 'Manual useCallback for Event Handlers',
        code: `function ProductList({ products, category }: {
  products: Product[]
  category: string
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Must wrap in useCallback to prevent child re-renders
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  // Must wrap in useCallback for memoized children
  const handleRemove = useCallback((id: string) => {
    // remove product logic
  }, [])

  // Must wrap in useCallback
  const handleFavorite = useCallback((id: string) => {
    // favorite logic
  }, [])

  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          isSelected={selectedId === p.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  )
}

// Must wrap component in memo
const ProductCard = memo(function ProductCard({
  product, isSelected, onSelect, onRemove, onFavorite,
}: {
  product: Product
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onFavorite: (id: string) => void
}) {
  return (
    <div onClick={() => onSelect(product.id)}>
      <h3>{product.name}</h3>
      <button onClick={() => onRemove(product.id)}>Remove</button>
      <button onClick={() => onFavorite(product.id)}>Favorite</button>
    </div>
  )
})`,
        explanation: 'Every callback passed to a memoized child must be wrapped in useCallback. The child must be wrapped in React.memo. Forgetting any part of this chain (memo + useCallback) makes the entire optimization useless. This is error-prone boilerplate.',
        output: ['3 useCallback hooks', '1 memo wrapper', '4 things to keep in sync'],
      },
      {
        title: 'The Real Cost of Manual Memoization',
        code: `// Problems with manual memoization:

// 1. Easy to get wrong
const filtered = useMemo(
  () => products.filter(p => p.category === category),
  [products]  // BUG: forgot 'category' dependency!
)

// 2. Over-memoization wastes memory
const value = useMemo(() => a + b, [a, b])
// Memoizing a simple addition is slower than recomputing

// 3. Viral complexity
// If ProductCard is memo'd, EVERY parent must:
//   - useCallback for all function props
//   - useMemo for all object/array props
//   - This propagates up the entire tree

// 4. Stale closure bugs
const handleClick = useCallback(() => {
  console.log(count) // Always logs initial count!
}, []) // Missing 'count' in deps

// 5. Code review burden
// Reviewers must verify every dependency array
// is correct — a cognitive tax on the whole team`,
        explanation: 'Manual memoization introduces bugs (stale closures, missing deps), wastes memory (over-memoization), creates viral complexity (every parent must memoize), and increases review burden. The React Compiler eliminates all of these problems.',
      },
    ],
  },
  {
    id: 'after-compiler',
    label: 'After (Compiler)',
    steps: [
      {
        title: 'The Same Code, Zero Boilerplate',
        code: `// With React Compiler — just write plain React!

function ProductList({ products, category }: {
  products: Product[]
  category: string
}) {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // No useMemo needed — compiler memoizes automatically
  const filtered = products.filter(p => p.category === category)

  // No useMemo needed — compiler tracks dependencies
  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : a.price - b.price
  )

  return (
    <div>
      <SortControls sortBy={sortBy} onSort={setSortBy} />
      {sorted.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}`,
        explanation: 'With the React Compiler, you write plain JavaScript without any memoization hooks. The compiler analyzes your code at build time and automatically inserts the optimal memoization. The output is the same as if you perfectly placed every useMemo and useCallback.',
        output: ['0 useMemo calls', '0 useCallback calls', '0 dependency arrays to maintain'],
      },
      {
        title: 'Callbacks and Children Auto-Optimized',
        code: `// With React Compiler:

function ProductList({ products, category }: {
  products: Product[]
  category: string
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // No useCallback needed!
  const handleSelect = (id: string) => {
    setSelectedId(id)
  }

  const handleRemove = (id: string) => {
    // remove product logic
  }

  const handleFavorite = (id: string) => {
    // favorite logic
  }

  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          isSelected={selectedId === p.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  )
}

// No memo wrapper needed!
function ProductCard({
  product, isSelected, onSelect, onRemove, onFavorite,
}: {
  product: Product
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onFavorite: (id: string) => void
}) {
  return (
    <div onClick={() => onSelect(product.id)}>
      <h3>{product.name}</h3>
      <button onClick={() => onRemove(product.id)}>Remove</button>
      <button onClick={() => onFavorite(product.id)}>Favorite</button>
    </div>
  )
}`,
        explanation: 'The compiler automatically memoizes both the callback functions and the child component. It analyzes which values each function closes over and inserts caching at the exact right granularity. No memo() wrapper, no useCallback, no dependency arrays.',
        output: ['Compiler output: auto-memoized callbacks', 'Compiler output: auto-memoized JSX elements', 'Zero manual optimization code'],
      },
      {
        title: 'How the Compiler Works Under the Hood',
        code: `// What you write:
function Greeting({ name }: { name: string }) {
  const text = \`Hello, \${name}!\`
  return <h1>{text}</h1>
}

// What the compiler outputs (simplified):
function Greeting({ name }: { name: string }) {
  const $ = useMemoCache(2)

  let text
  if ($[0] !== name) {
    text = \`Hello, \${name}!\`
    $[0] = name
    $[1] = <h1>{text}</h1>
  }

  return $[1]
}

// The compiler:
// 1. Analyzes data flow at build time
// 2. Identifies values that depend on each input
// 3. Inserts a cache (useMemoCache) with slots
// 4. Checks if inputs changed before recomputing
// 5. Returns cached result when inputs are the same`,
        explanation: 'The React Compiler is a build-time tool that uses static analysis to understand data dependencies. It inserts an internal useMemoCache hook that tracks inputs and caches outputs at a fine-grained level. This is more precise than manual useMemo because it operates on individual expressions, not entire blocks.',
        output: ['Build-time: static analysis of data flow', 'Runtime: fine-grained cache checks', 'Result: optimal memoization with zero developer effort'],
      },
      {
        title: 'Requirements and Limitations',
        code: `// React Compiler requires:
// 1. React 19+
// 2. Components follow the Rules of React

// Rules the compiler enforces:
// - Components are pure (same inputs = same output)
// - Props, state, and context are immutable
// - Hook calls are unconditional and top-level
// - Side effects are in useEffect, not during render

// What the compiler CANNOT optimize:
// - Code that mutates external variables during render
// - Components that read from mutable refs during render
// - Non-idiomatic React patterns

// The 'use no memo' directive opts out:
function RealTimeChart({ data }: { data: number[] }) {
  'use no memo'
  // Compiler skips this component
  // (e.g., for performance-critical animation code)
  return <canvas />
}

// eslint-plugin-react-compiler catches violations
// Add to your ESLint config:
// { plugins: ['react-compiler'],
//   rules: { 'react-compiler/react-compiler': 'error' } }`,
        explanation: 'The compiler works with idiomatic React code that follows the Rules of React. Mutations during render, reading mutable refs in render, and other non-standard patterns will either be skipped or flagged. The eslint plugin catches violations during development.',
      },
    ],
  },
]

export function ReactCompilerViz(): JSX.Element {
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
