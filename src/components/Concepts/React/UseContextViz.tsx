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
    id: 'context-basics',
    label: 'Context Basics',
    steps: [
      {
        title: 'The Prop Drilling Problem',
        code: `// Without context: passing theme through
// every component in the tree
function App() {
  const [theme, setTheme] = useState('dark')
  return <Page theme={theme} />
}

function Page({ theme }) {
  return <Sidebar theme={theme} />
}

function Sidebar({ theme }) {
  return <Button theme={theme} />
}

function Button({ theme }) {
  return <button className={theme}>Click</button>
}`,
        explanation: 'Prop drilling is when you pass data through many intermediate components that do not use it themselves. Page and Sidebar do not need theme; they just pass it down. This makes code harder to maintain and components tightly coupled to their parent structure.',
      },
      {
        title: 'Creating a Context',
        code: `import { createContext } from 'react'

const ThemeContext = createContext('light')
//                                  ^
//                          default value

// The default is used ONLY when a component
// reads the context without a Provider above
// it in the tree.`,
        explanation: 'createContext creates a context object with a default value. The default value is a fallback for when no Provider wraps the consuming component. It is commonly used in tests or when rendering a component in isolation outside of its expected tree.',
      },
      {
        title: 'Providing Context',
        code: `function App() {
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  )
}

// Page no longer needs theme prop!
function Page() {
  return <Sidebar />
}`,
        explanation: 'The Provider component makes the context value available to all descendants in the tree. Any component below the Provider can read the value without receiving it as a prop. The intermediate components (Page, Sidebar) no longer need to forward the prop.',
      },
      {
        title: 'Consuming with useContext',
        code: `import { useContext } from 'react'

function Button() {
  const theme = useContext(ThemeContext)

  return (
    <button className={theme}>
      Click me
    </button>
  )
}

// Button reads theme directly from context,
// no matter how deep in the tree it sits.`,
        explanation: 'useContext reads the nearest Provider value above the component in the tree. The component subscribes to context changes: when the Provider value updates, every component that calls useContext for that context will re-render with the new value.',
        output: ['theme = "dark" (from Provider)'],
      },
    ],
  },
  {
    id: 'provider-pattern',
    label: 'Provider Pattern',
    steps: [
      {
        title: 'Provider with State and Actions',
        code: `const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  const toggle = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}`,
        explanation: 'A common pattern is creating a Provider component that owns the state and exposes both the value and updater functions through context. This encapsulates all the state logic in one place, and consumers get both reading and writing capabilities.',
      },
      {
        title: 'Custom Hook for Consuming',
        code: `function useTheme() {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    )
  }

  return context
}

function Button() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>{theme}</button>
}`,
        explanation: 'Wrapping useContext in a custom hook adds a guard against missing Providers and provides a cleaner API. The null check turns a silent bug (undefined values) into an immediate, descriptive error. Consumers import useTheme instead of knowing about ThemeContext directly.',
        output: ['Without Provider: Error thrown', 'With Provider: { theme, toggle }'],
      },
      {
        title: 'Wrapping the App',
        code: `function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Page />
      </AuthProvider>
    </ThemeProvider>
  )
}

// Any component inside can call:
// const { theme, toggle } = useTheme()
// const { user, login } = useAuth()`,
        explanation: 'Providers compose by nesting. Each Provider creates its own independent context layer. Components inside can consume any or all of the contexts above them. The order of nesting matters only if one Provider depends on another context value.',
      },
    ],
  },
  {
    id: 'multiple-contexts',
    label: 'Multiple Contexts',
    steps: [
      {
        title: 'Separate Contexts for Separate Concerns',
        code: `const ThemeContext = createContext('dark')
const UserContext = createContext(null)
const LanguageContext = createContext('en')

function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <LanguageContext.Provider value={lang}>
          <Dashboard />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}`,
        explanation: 'Keep contexts focused on a single concern. Splitting theme, user, and language into separate contexts means a theme change only re-renders theme consumers, not user or language consumers. This gives you fine-grained control over which components re-render.',
      },
      {
        title: 'Consuming Multiple Contexts',
        code: `function Greeting() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const lang = useContext(LanguageContext)

  const text = lang === 'en'
    ? 'Hello ' + user.name
    : 'Hola ' + user.name

  return (
    <p className={theme}>{text}</p>
  )
}`,
        explanation: 'A single component can consume as many contexts as it needs. Each useContext call subscribes to that specific context. The component re-renders when any of its consumed contexts change. This is why splitting contexts matters for performance.',
        output: ['theme="dark", user="Alice", lang="en"', 'Result: <p class="dark">Hello Alice</p>'],
      },
      {
        title: 'Nested Providers Override',
        code: `function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
      <ThemeContext.Provider value="light">
        <Sidebar />
      </ThemeContext.Provider>
    </ThemeContext.Provider>
  )
}

// Page reads "dark"
// Sidebar reads "light"`,
        explanation: 'You can nest Providers of the same context. A component reads from the nearest Provider above it in the tree. This is useful for overriding values in specific subtrees, like having a dark page but a light sidebar, without additional props or state.',
        output: ['<Page>: theme = "dark"', '<Sidebar>: theme = "light"'],
      },
    ],
  },
  {
    id: 'performance-gotcha',
    label: 'Performance Gotcha',
    steps: [
      {
        title: 'The Re-render Problem',
        code: `function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Every render creates a NEW object:
// { theme, setTheme } !== { theme, setTheme }
// All consumers re-render on EVERY parent render!`,
        explanation: 'When the Provider parent re-renders, a new object literal is created each time. Even if theme has not changed, the new object has a different reference identity. React sees a different value and re-renders all consumers. This is the most common context performance mistake.',
        output: ['Parent renders -> new { theme, setTheme }', 'All consumers re-render (unnecessary!)'],
      },
      {
        title: 'Fix: useMemo the Context Value',
        code: `function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}`,
        explanation: 'Wrapping the value in useMemo ensures the same object reference is reused unless theme actually changes. Now consumers only re-render when theme changes, not on every parent render. setTheme is stable (from useState) so it does not need to be a dependency.',
        output: ['Parent renders, theme same -> same object ref', 'Consumers: no re-render!', 'theme changes -> new object -> consumers update'],
      },
      {
        title: 'Splitting Read and Write Contexts',
        code: `const ThemeValueCtx = createContext('dark')
const ThemeSetterCtx = createContext(() => {})

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeSetterCtx.Provider value={setTheme}>
      <ThemeValueCtx.Provider value={theme}>
        {children}
      </ThemeValueCtx.Provider>
    </ThemeSetterCtx.Provider>
  )
}

// Components that only toggle theme:
const setTheme = useContext(ThemeSetterCtx)
// Won't re-render when theme value changes!`,
        explanation: 'Splitting into two contexts gives even more control. Components that only need to change the theme (like a toggle button) subscribe to the setter context, which never changes. Components that display the theme subscribe to the value context. Each group only re-renders when relevant.',
        output: ['Theme changes: value consumers re-render', 'Theme changes: setter consumers stay put'],
      },
      {
        title: 'When Context is Not the Answer',
        code: `// Context is great for:
// - Themes, locale, auth (low frequency)
// - Data that many components need

// Consider alternatives for:
// - High-frequency updates (use Zustand/Jotai)
// - Server state (use React Query/SWR)
// - Form state (use React Hook Form)

// Rule of thumb:
// If context re-renders cause lag,
// move to a dedicated state library.`,
        explanation: 'Context is designed for values that change infrequently and are needed by many components. For state that updates rapidly (mouse position, animations) or has complex server synchronization needs (caching, refetching), dedicated libraries offer better performance because they can update subscribers independently without re-rendering the entire subtree.',
      },
    ],
  },
]

export function UseContextViz(): JSX.Element {
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
