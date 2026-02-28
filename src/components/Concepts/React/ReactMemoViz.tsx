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
    id: 'shallow-comparison',
    label: 'Shallow Comparison',
    steps: [
      {
        title: 'Wrapping a Component with React.memo',
        code: `const UserCard = React.memo(function UserCard({
  name,
  role,
}: {
  name: string
  role: string
}) {
  console.log('UserCard rendered')
  return <div>{name} - {role}</div>
})`,
        explanation: 'React.memo is a higher-order component that memoizes the rendered output. If the props have not changed since the last render, React skips re-rendering this component and reuses the previous result.',
      },
      {
        title: 'Parent Re-renders, Child Skips',
        code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <UserCard name="Alice" role="Admin" />
    </div>
  )
}`,
        explanation: 'When the parent re-renders due to count changing, React.memo compares the previous props { name: "Alice", role: "Admin" } with the new props. Since they are identical strings, UserCard skips re-rendering entirely.',
        output: ['Click button: App renders, UserCard does NOT render'],
      },
      {
        title: 'How Shallow Comparison Works',
        code: `// React.memo does this internally:
// Object.is(prevProps.name, nextProps.name)
// Object.is(prevProps.role, nextProps.role)

// Primitives compare by value:
'Alice' === 'Alice'  // true -> skip render

// Objects compare by reference:
{ x: 1 } === { x: 1 }  // false -> re-render!`,
        explanation: 'Shallow comparison checks each prop with Object.is(). Primitives like strings and numbers are compared by value. Objects, arrays, and functions are compared by reference, meaning a new object literal always triggers a re-render even if the contents are identical.',
        output: ['Primitives: compared by value', 'Objects: compared by reference'],
      },
    ],
  },
  {
    id: 'when-it-helps',
    label: 'When It Helps',
    steps: [
      {
        title: 'Expensive Child with Stable Props',
        code: `const ExpensiveChart = React.memo(function ExpensiveChart({
  data,
}: {
  data: number[]
}) {
  // Simulates a heavy render (complex SVG, canvas)
  const processed = heavyCalculation(data)
  return <svg>{/* render chart */}</svg>
})`,
        explanation: 'React.memo shines when the wrapped component is expensive to render but its props change infrequently. The cost of the shallow comparison is negligible compared to the avoided re-render.',
      },
      {
        title: 'Stable Reference with useMemo',
        code: `function Dashboard() {
  const [filter, setFilter] = useState('all')
  const [data] = useState([10, 20, 30, 40])

  // data reference is stable across re-renders
  return (
    <div>
      <select onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
      </select>
      <ExpensiveChart data={data} />
    </div>
  )
}`,
        explanation: 'When filter changes, Dashboard re-renders. But the data array reference stays the same because useState preserves it. React.memo detects that data has not changed by reference and skips re-rendering ExpensiveChart.',
        output: ['Filter changes: Dashboard renders', 'ExpensiveChart: skipped (same data ref)'],
      },
      {
        title: 'List Items That Rarely Change',
        code: `const TodoItem = React.memo(function TodoItem({
  text,
  done,
}: {
  text: string
  done: boolean
}) {
  return (
    <li style={{ textDecoration: done ? 'line-through' : 'none' }}>
      {text}
    </li>
  )
})

function TodoList({ items }: { items: Todo[] }) {
  return items.map(item => (
    <TodoItem key={item.id} text={item.text} done={item.done} />
  ))
}`,
        explanation: 'In a list of 100 items, editing one item causes the parent to re-render all 100. With React.memo, only the changed item re-renders. The other 99 items have the same text and done values, so they are skipped.',
        output: ['Edit item 5: only TodoItem #5 re-renders', '99 items skipped'],
      },
    ],
  },
  {
    id: 'custom-compare',
    label: 'Custom Compare',
    steps: [
      {
        title: 'Default vs Custom Comparison',
        code: `// Default: shallow comparison of ALL props
const Card = React.memo(CardComponent)

// Custom: you decide what matters
const Card = React.memo(CardComponent, arePropsEqual)

function arePropsEqual(
  prev: CardProps,
  next: CardProps
): boolean {
  // Return true to SKIP re-render
  // Return false to RE-RENDER
  return prev.id === next.id && prev.title === next.title
}`,
        explanation: 'The second argument to React.memo is a custom comparison function. It receives the previous and next props and returns true if they are "equal" (skip render) or false if they differ (re-render). This lets you ignore props that do not affect the visual output.',
      },
      {
        title: 'Ignoring Callback Props',
        code: `interface ListItemProps {
  id: number
  label: string
  onClick: (id: number) => void
}

const ListItem = React.memo(
  function ListItem({ id, label, onClick }: ListItemProps) {
    return <div onClick={() => onClick(id)}>{label}</div>
  },
  (prev, next) => {
    return prev.id === next.id && prev.label === next.label
  }
)`,
        explanation: 'If the parent creates a new onClick function on every render (common with inline arrows), the default shallow comparison would always re-render. The custom comparator ignores onClick and only checks data props that actually affect the rendered output.',
        output: ['Parent re-renders: onClick ref changes', 'Custom compare ignores it: skip re-render'],
      },
      {
        title: 'Deep Comparison for Objects',
        code: `interface ChartProps {
  config: { color: string; size: number }
  data: number[]
}

const Chart = React.memo(
  ChartComponent,
  (prev, next) => {
    return (
      prev.config.color === next.config.color &&
      prev.config.size === next.config.size &&
      prev.data.length === next.data.length &&
      prev.data.every((v, i) => v === next.data[i])
    )
  }
)`,
        explanation: 'For object props, you can write a custom deep comparison that checks the specific fields you care about. Be careful: deep comparisons on large data structures can become more expensive than just re-rendering.',
      },
    ],
  },
  {
    id: 'pitfalls',
    label: 'Pitfalls',
    steps: [
      {
        title: 'Inline Objects Break Memoization',
        code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <MemoizedChild
      style={{ color: 'red' }}  // new object every render!
      config={{ theme: 'dark' }} // new object every render!
    />
  )
}`,
        explanation: 'Every render creates new object literals for style and config. Even though the values inside are identical, the references are different. React.memo sees new references and re-renders, defeating the purpose entirely.',
        output: ['{ color: "red" } === { color: "red" }', 'false -> re-renders every time'],
      },
      {
        title: 'Inline Functions Break Memoization',
        code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <MemoizedChild
      onClick={() => console.log('clicked')}
    />
    // Fix: wrap with useCallback
  )
}

// Fixed version:
function App() {
  const [count, setCount] = useState(0)
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <MemoizedChild onClick={handleClick} />
}`,
        explanation: 'Arrow functions defined inline create a new function reference on every render. useCallback returns the same function reference across renders as long as its dependencies do not change, allowing React.memo to work correctly.',
      },
      {
        title: 'Children Prop Breaks Memoization',
        code: `// This ALWAYS re-renders despite React.memo:
function App() {
  const [count, setCount] = useState(0)

  return (
    <MemoizedContainer>
      <span>Static content</span>
    </MemoizedContainer>
  )
}

// JSX children compile to createElement calls,
// creating new objects on every render.
// Fix: move children outside the re-rendering parent`,
        explanation: 'JSX children are compiled into React.createElement() calls, which produce new objects each time. Even static children create new references, so React.memo on a wrapper component with children rarely helps without restructuring.',
        output: ['<span>Static</span> -> new object every render', 'React.memo comparison: fails'],
      },
      {
        title: 'When NOT to Use React.memo',
        code: `// 1. Component re-renders with different props anyway
const Display = React.memo(({ value }) => <div>{value}</div>)
// value changes every render -> memo is overhead

// 2. Component is cheap to render
const Label = React.memo(({ text }) => <span>{text}</span>)
// Comparison cost > render cost

// 3. Component uses context that changes often
const Theme = React.memo(({ children }) => {
  const theme = useContext(ThemeContext) // re-renders anyway
  return <div className={theme}>{children}</div>
})`,
        explanation: 'React.memo adds overhead: it must store the previous props and run the comparison on every render. If the component usually receives new props, is cheap to render, or consumes frequently-changing context, the comparison is wasted work.',
        output: ['Rule of thumb: profile first, memo second'],
      },
    ],
  },
]

export function ReactMemoViz(): JSX.Element {
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
