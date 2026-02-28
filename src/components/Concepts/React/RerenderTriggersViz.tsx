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
    id: 'state-changes',
    label: 'State Changes',
    steps: [
      {
        title: 'setState Always Triggers a Re-render',
        code: `function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return <button onClick={increment}>{count}</button>
}`,
        explanation: 'Calling a state setter (setCount) schedules a re-render. React will call your component function again with the new state value, producing a fresh VDOM tree to diff against the previous one.',
        output: ['Click -> setCount(1) -> re-render -> DOM: "1"'],
      },
      {
        title: 'Same Value = Bail Out',
        code: `const [count, setCount] = useState(0)

setCount(0)  // same value, React bails out

// React uses Object.is() to compare:
Object.is(0, 0)   // true -> skip re-render
Object.is(0, 1)   // false -> re-render`,
        explanation: 'If you call setState with the same value (checked via Object.is), React skips the re-render entirely. This optimization applies to primitives. For objects, a new reference always triggers a render.',
      },
      {
        title: 'Object State: Reference Matters',
        code: `const [user, setUser] = useState({ name: 'Alice' })

// This does NOT trigger re-render:
user.name = 'Bob'
setUser(user)  // same reference!

// This DOES trigger re-render:
setUser({ ...user, name: 'Bob' })  // new ref`,
        explanation: 'React compares state by reference (Object.is). Mutating an existing object and passing it back looks identical to React. You must create a new object or array to signal a change.',
        output: [
          'Object.is(oldUser, oldUser) -> true  (skip)',
          'Object.is(oldUser, {...})   -> false (render)',
        ],
      },
      {
        title: 'Batched Updates in Event Handlers',
        code: `function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  setName('updated')
  // All three updates batched into ONE render
}

// React 18+: batching works everywhere
// including setTimeout, promises, and
// native event handlers`,
        explanation: 'React 18 automatically batches all state updates within the same synchronous scope into a single re-render. This prevents unnecessary intermediate renders and improves performance.',
        output: ['3 setState calls -> 1 re-render'],
      },
    ],
  },
  {
    id: 'prop-changes',
    label: 'Prop Changes',
    steps: [
      {
        title: 'New Props from Parent',
        code: `function Parent() {
  const [name, setName] = useState('Alice')
  return <Child name={name} />
}

function Child({ name }) {
  return <span>{name}</span>
}`,
        explanation: 'When a parent re-renders and passes different prop values, the child re-renders with the new props. React sees the child in the new VDOM tree with updated props and calls the child function again.',
      },
      {
        title: 'Inline Objects Create New References',
        code: `function Parent() {
  return (
    <Child
      style={{ color: 'red' }}
      config={{ theme: 'dark' }}
    />
  )
}`,
        explanation: 'Every time Parent renders, new object literals are created for style and config. Even if the values inside are identical, the references are different, causing Child to re-render every time.',
        output: [
          '{ color: "red" } === { color: "red" } -> false',
          'New reference on every render!',
        ],
      },
      {
        title: 'Stabilize References with useMemo',
        code: `function Parent() {
  const style = useMemo(
    () => ({ color: 'red' }),
    []
  )
  const handleClick = useCallback(
    () => console.log('click'),
    []
  )
  return <Child style={style} onClick={handleClick} />
}`,
        explanation: 'useMemo and useCallback preserve the same object or function reference across renders when dependencies have not changed. This prevents unnecessary child re-renders when combined with React.memo.',
      },
      {
        title: 'React.memo Skips Unchanged Props',
        code: `const Child = React.memo(function Child({ name }) {
  return <span>{name}</span>
})

// Parent re-renders with same name="Alice"
// React.memo does shallow comparison:
// prevProps.name === nextProps.name -> skip`,
        explanation: 'React.memo wraps a component to skip re-rendering when all props are shallowly equal to the previous render. It is the function component equivalent of PureComponent.',
        output: ['Props unchanged -> Child render skipped'],
      },
    ],
  },
  {
    id: 'parent-renders',
    label: 'Parent Renders',
    steps: [
      {
        title: 'Parent Render Cascades to All Children',
        code: `function Parent() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <span>{count}</span>
      <ChildA />
      <ChildB />
    </div>
  )
}`,
        explanation: 'When Parent re-renders, React re-renders ChildA and ChildB even if they receive no props. By default, a parent render causes all descendant components in its subtree to re-render.',
        output: [
          'Parent renders -> ChildA renders',
          'Parent renders -> ChildB renders',
          '(even with zero prop changes)',
        ],
      },
      {
        title: 'Why This Happens',
        code: `// React has no way to know in advance
// whether a child's output will change.
//
// Calling the function is the only way to
// find out what the new VDOM looks like.
//
// The diff then determines if DOM updates
// are actually needed.`,
        explanation: 'React takes a "render everything, diff the result" approach. Calling your component function is cheap compared to DOM operations. The real cost savings come from the diffing step, which prevents unnecessary DOM mutations.',
      },
      {
        title: 'Preventing Unnecessary Child Renders',
        code: `// Option 1: React.memo
const ChildA = React.memo(function ChildA() {
  return <div>Static content</div>
})

// Option 2: Move state down
function Parent() {
  return (
    <div>
      <Counter />
      <ChildA />
    </div>
  )
}`,
        explanation: 'Two strategies: (1) Wrap children in React.memo to bail out when props are unchanged. (2) Move state into a smaller component so the re-render scope is narrower and fewer children are affected.',
      },
      {
        title: 'Children as Props Pattern',
        code: `function Wrapper({ children }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <span>{count}</span>
      {children}
    </div>
  )
}

// Usage: <Wrapper><ExpensiveChild /></Wrapper>`,
        explanation: 'When children are passed as props, they are created by the grandparent, not by Wrapper. When Wrapper re-renders due to its own state change, the children prop reference stays the same, so React can skip re-rendering ExpensiveChild.',
        output: [
          'Wrapper re-renders -> count updates',
          'ExpensiveChild does NOT re-render',
        ],
      },
    ],
  },
  {
    id: 'context-changes',
    label: 'Context Changes',
    steps: [
      {
        title: 'Context Provides Shared State',
        code: `const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  )
}`,
        explanation: 'Context lets you pass values deep into the component tree without prop drilling. Any component below the Provider can subscribe to changes by calling useContext.',
      },
      {
        title: 'Context Change Re-renders All Consumers',
        code: `function Header() {
  const theme = useContext(ThemeContext)
  return <header className={theme}>...</header>
}

function Sidebar() {
  const theme = useContext(ThemeContext)
  return <aside className={theme}>...</aside>
}`,
        explanation: 'When the Provider value changes, every component that calls useContext for that context re-renders. React.memo cannot prevent this -- context changes bypass the memo check entirely.',
        output: [
          'theme: "light" -> "dark"',
          'Header re-renders (consumer)',
          'Sidebar re-renders (consumer)',
        ],
      },
      {
        title: 'Object Values Cause Extra Renders',
        code: `// Problem: new object on every render
<ThemeCtx.Provider value={{ theme, font }}>

// Fix: memoize the value
const value = useMemo(
  () => ({ theme, font }),
  [theme, font]
)
<ThemeCtx.Provider value={value}>`,
        explanation: 'If the Provider value is an inline object, every parent render creates a new reference, forcing all consumers to re-render even when the actual data has not changed. Always memoize object context values.',
      },
      {
        title: 'Split Contexts for Performance',
        code: `// Instead of one big context:
const AppContext = createContext({ theme, user, locale })

// Split into focused contexts:
const ThemeContext = createContext(theme)
const UserContext = createContext(user)
const LocaleContext = createContext(locale)`,
        explanation: 'A single context with multiple values re-renders all consumers when any value changes. Splitting into separate contexts lets components subscribe only to the values they need, reducing unnecessary re-renders.',
        output: [
          'Combined: theme change -> re-renders user consumers too',
          'Split: theme change -> only theme consumers re-render',
        ],
      },
    ],
  },
]

export function RerenderTriggersViz(): JSX.Element {
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
