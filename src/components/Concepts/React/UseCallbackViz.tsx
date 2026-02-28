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
    id: 'function-identity',
    label: 'Function Identity',
    steps: [
      {
        title: 'Functions Are Objects',
        code: `function Parent() {
  const handleClick = () => {
    console.log('clicked')
  }

  return <Child onClick={handleClick} />
}`,
        explanation: 'Every time Parent renders, a new handleClick function is created. Even though the code inside is identical, it is a brand new object in memory with a different reference.',
      },
      {
        title: 'New Reference Every Render',
        code: `// Render 1:
const handleClick_v1 = () => console.log('clicked')

// Render 2:
const handleClick_v2 = () => console.log('clicked')

handleClick_v1 === handleClick_v2  // false!`,
        explanation: 'JavaScript compares functions by reference identity, not by their source code. Two arrow functions with identical bodies are still different objects. This means Child sees a "new" prop every render.',
        output: ['Render 1: handleClick => 0xA1B2', 'Render 2: handleClick => 0xC3D4', 'Same code, different identity'],
      },
      {
        title: 'Why This Matters',
        code: `function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = () => console.log('clicked')

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        +
      </button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  )
}`,
        explanation: 'When count changes, Parent re-renders. handleClick is recreated with a new reference. ExpensiveChild receives a "changed" onClick prop and re-renders too — even though the function does the same thing.',
      },
    ],
  },
  {
    id: 'stable-callbacks',
    label: 'Stable Callbacks',
    steps: [
      {
        title: 'useCallback Preserves Identity',
        code: `import { useCallback } from 'react'

function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <Child onClick={handleClick} />
}`,
        explanation: 'useCallback returns the same function reference between renders as long as the dependencies have not changed. The empty dependency array means this function is created once and reused forever.',
      },
      {
        title: 'The Cache in Action',
        code: `// Render 1:
const fn = useCallback(() => { ... }, [])
// Creates function, caches it

// Render 2:
const fn = useCallback(() => { ... }, [])
// Dependencies unchanged => returns cached fn

// fn from render 1 === fn from render 2  // true!`,
        explanation: 'useCallback is syntactic sugar for useMemo(() => fn, deps). It memoizes the function itself rather than its return value. The cached function persists across renders until a dependency changes.',
        output: ['Render 1: fn => 0xA1B2 (new)', 'Render 2: fn => 0xA1B2 (cached)', 'Same reference!'],
      },
      {
        title: 'With Dependencies',
        code: `function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = useCallback(() => {
    onSearch(query)
  }, [query, onSearch])

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </form>
  )
}`,
        explanation: 'When the callback uses values from the component scope, those values must be in the dependency array. The function is recreated only when query or onSearch changes — not on every render.',
      },
    ],
  },
  {
    id: 'with-memo',
    label: 'With React.memo',
    steps: [
      {
        title: 'React.memo Without useCallback',
        code: `const ExpensiveList = React.memo(
  function ExpensiveList({ items, onSelect }) {
    return items.map(item => (
      <div key={item.id} onClick={() => onSelect(item)}>
        {item.name}
      </div>
    ))
  }
)

function Parent() {
  const onSelect = (item) => console.log(item)
  return <ExpensiveList items={items} onSelect={onSelect} />
}`,
        explanation: 'React.memo wraps a component to skip re-rendering when props are shallowly equal. But onSelect is a new function every render, so the shallow comparison always fails. React.memo is defeated.',
        output: ['Parent renders => new onSelect ref', 'memo check: prev.onSelect !== next.onSelect', 'ExpensiveList re-renders anyway'],
      },
      {
        title: 'React.memo With useCallback',
        code: `function Parent() {
  const onSelect = useCallback((item) => {
    console.log(item)
  }, [])

  return <ExpensiveList items={items} onSelect={onSelect} />
}`,
        explanation: 'Now onSelect has a stable reference. When Parent re-renders, React.memo compares the old and new onSelect and finds them identical. ExpensiveList skips re-rendering. The optimization actually works.',
        output: ['Parent renders => same onSelect ref', 'memo check: prev.onSelect === next.onSelect', 'ExpensiveList skips render'],
      },
      {
        title: 'The Complete Pattern',
        code: `const Child = React.memo(function Child({ data, onClick }) {
  console.log('Child rendered')
  return <button onClick={onClick}>{data.label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const data = useMemo(() => ({ label: 'Click me' }), [])
  const onClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child data={data} onClick={onClick} />
    </div>
  )
}`,
        explanation: 'The full optimization requires three pieces: React.memo on the child, useCallback for function props, and useMemo for object props. Missing any one link breaks the chain.',
      },
    ],
  },
  {
    id: 'dependency-patterns',
    label: 'Dependency Patterns',
    steps: [
      {
        title: 'Empty Dependencies',
        code: `const handleReset = useCallback(() => {
  setCount(0)
  setQuery('')
}, [])`,
        explanation: 'Empty dependencies mean the function is created once. This works because setCount and setQuery are stable references from useState — they never change, so they do not need to be listed.',
      },
      {
        title: 'State Updater Pattern',
        code: `const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])

const decrement = useCallback(() => {
  setCount(prev => prev - 1)
}, [])`,
        explanation: 'Using the functional updater form (prev => prev + 1) removes the need to include count in the dependency array. The callback does not read count from the closure — it receives the latest value as an argument.',
        output: ['Without updater: [count] dep needed', 'With updater: [] deps sufficient', 'Stable reference forever'],
      },
      {
        title: 'Ref Pattern for Latest Values',
        code: `function useEventCallback(fn) {
  const ref = useRef(fn)
  ref.current = fn

  return useCallback((...args) => {
    return ref.current(...args)
  }, [])
}

function Search({ onSearch }) {
  const [query, setQuery] = useState('')
  const handleSearch = useEventCallback(() => {
    onSearch(query)
  })
}`,
        explanation: 'The ref always holds the latest function but the returned callback never changes. This is an escape hatch for when you need a stable reference but the function body depends on frequently changing values.',
      },
      {
        title: 'When NOT to useCallback',
        code: `function SimpleButton() {
  return (
    <button onClick={() => console.log('clicked')}>
      Click me
    </button>
  )
}`,
        explanation: 'If the child is a plain DOM element (not wrapped in React.memo), useCallback provides zero benefit. DOM elements always re-render when their parent renders regardless of prop stability. Only optimize when there is a measurable problem.',
        output: ['DOM elements: no memo check', 'useCallback here: wasted overhead', 'Profile first, optimize second'],
      },
    ],
  },
]

export function UseCallbackViz(): JSX.Element {
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
