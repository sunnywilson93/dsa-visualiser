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
    id: 'extracting-logic',
    label: 'Extracting Logic',
    steps: [
      {
        title: 'Duplicated Stateful Logic',
        code: `function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(prev => !prev)
  return (
    <nav>
      <button onClick={toggle}>Menu</button>
      {isOpen && <Menu />}
    </nav>
  )
}

function FAQ() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(prev => !prev)
  return (
    <div>
      <button onClick={toggle}>Answer</button>
      {isOpen && <p>The answer is...</p>}
    </div>
  )
}`,
        explanation: 'Both components have identical toggle logic: a boolean state and a function that flips it. This is duplicated stateful logic — the exact problem custom hooks solve.',
      },
      {
        title: 'Extract Into a Custom Hook',
        code: `function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(
    () => setValue(prev => !prev), []
  )
  return [value, toggle] as const
}`,
        explanation: 'A custom hook is a function that starts with "use" and calls other hooks. It encapsulates the state and logic, returning whatever the consumer needs. Each component that calls useToggle gets its own independent state.',
      },
      {
        title: 'Using the Custom Hook',
        code: `function Header() {
  const [isOpen, toggle] = useToggle()
  return (
    <nav>
      <button onClick={toggle}>Menu</button>
      {isOpen && <Menu />}
    </nav>
  )
}

function FAQ() {
  const [isOpen, toggle] = useToggle()
  return (
    <div>
      <button onClick={toggle}>Answer</button>
      {isOpen && <p>The answer is...</p>}
    </div>
  )
}`,
        explanation: 'Both components now use useToggle. The duplicated logic lives in one place. If you need to add "close after 5 seconds" behavior, you change the hook once and every consumer gets it.',
        output: ['Header: own isOpen state', 'FAQ: own isOpen state', 'Independent instances, shared logic'],
      },
    ],
  },
  {
    id: 'use-toggle',
    label: 'useToggle Example',
    steps: [
      {
        title: 'Basic useToggle',
        code: `function useToggle(
  initialValue = false
): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  return [value, toggle]
}`,
        explanation: 'The simplest useful custom hook. It returns a tuple: the current boolean value and a stable toggle function. useCallback ensures toggle never changes identity, making it safe to pass as a prop.',
      },
      {
        title: 'Enhanced useToggle',
        code: `function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const handlers = useMemo(() => ({
    toggle: () => setValue(prev => !prev),
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    reset: () => setValue(initialValue)
  }), [initialValue])

  return [value, handlers] as const
}`,
        explanation: 'A more complete version returns an object of stable handlers. The consumer can toggle, explicitly set true/false, or reset. useMemo ensures the handler object reference is stable.',
      },
      {
        title: 'Using the Enhanced Version',
        code: `function Modal() {
  const [isOpen, { toggle, setFalse }] = useToggle()

  return (
    <div>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <Dialog onClose={setFalse}>
          <p>Modal content</p>
        </Dialog>
      )}
    </div>
  )
}`,
        explanation: 'Destructuring gives clean access to exactly the handlers needed. The Dialog receives setFalse directly as its onClose prop — no wrapper function needed, and the reference is stable for React.memo.',
        output: ['toggle => flips open/closed', 'setFalse => always closes', 'No inline arrow functions needed'],
      },
    ],
  },
  {
    id: 'use-fetch',
    label: 'useFetch Example',
    steps: [
      {
        title: 'The Interface',
        code: `interface UseFetchResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

function useFetch<T>(url: string): UseFetchResult<T> {
  // ...
}`,
        explanation: 'The hook takes a URL and returns an object with data, error, and loading state. The generic type parameter T lets consumers specify the shape of the expected response data.',
      },
      {
        title: 'The Implementation',
        code: `function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, error, isLoading }
}`,
        explanation: 'The effect fetches data when the URL changes. AbortController cancels in-flight requests on cleanup — preventing race conditions when the URL changes rapidly. The cleanup function runs before each new effect and on unmount.',
      },
      {
        title: 'Using useFetch',
        code: `interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  const { data, error, isLoading } = useFetch<User>(
    \`/api/users/\${userId}\`
  )

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return null

  return <div>{data.name} ({data.email})</div>
}`,
        explanation: 'The consumer specifies User as the generic type, so data is typed as User | null. After the loading and error checks, TypeScript narrows data to User. The component focuses purely on rendering — all fetch logic is in the hook.',
        output: ['userId=1: loading -> User data', 'userId=2: abort prev, loading -> new data', 'Unmount: abort in-flight request'],
      },
    ],
  },
  {
    id: 'composition',
    label: 'Composition',
    steps: [
      {
        title: 'Hooks Calling Hooks',
        code: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(value), delay
    )
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`,
        explanation: 'useDebounce is a custom hook that delays updating a value until a pause in changes. It uses useState and useEffect internally. This hook becomes a building block for more complex hooks.',
      },
      {
        title: 'Composing Hooks Together',
        code: `function useDebouncedSearch<T>(
  url: string,
  query: string,
  delay = 300
) {
  const debouncedQuery = useDebounce(query, delay)

  const searchUrl = debouncedQuery
    ? \`\${url}?q=\${encodeURIComponent(debouncedQuery)}\`
    : null

  const result = useFetch<T[]>(searchUrl ?? '')

  return {
    ...result,
    isStale: query !== debouncedQuery
  }
}`,
        explanation: 'useDebouncedSearch composes useDebounce and useFetch. The query is debounced first, then the debounced value drives the fetch. isStale indicates the displayed results are for an older query while a new one is pending.',
      },
      {
        title: 'Using the Composed Hook',
        code: `function SearchPage() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isStale } = useDebouncedSearch<Product>(
    '/api/search',
    query,
    300
  )

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {(isLoading || isStale) && <Spinner />}
      {data?.map(p => <ProductCard key={p.id} item={p} />)}
    </div>
  )
}`,
        explanation: 'The component is clean and declarative. All the complexity — debouncing, fetching, abort handling, loading states — is composed from small, testable hooks. Each hook does one thing well and they chain naturally together.',
        output: ['Type "shoes" fast:', '"s" -> debounce...', '"sh" -> debounce...', '"shoes" -> wait 300ms -> fetch'],
      },
      {
        title: 'Rules for Custom Hooks',
        code: `// 1. Name starts with "use"
function useWindowSize() { ... }

// 2. Can call other hooks
function useAuth() {
  const [user] = useState(null)
  useEffect(() => { ... }, [])
  return user
}

// 3. Each call gets independent state
const a = useToggle()  // own state
const b = useToggle()  // separate state

// 4. Follow the Rules of Hooks
// - Only call at the top level
// - Only call from React functions`,
        explanation: 'Custom hooks follow the same rules as built-in hooks. The "use" prefix is a convention that lets React check for rule violations. Each call site gets its own state — hooks share logic, not state.',
      },
    ],
  },
]

export function CustomHooksViz(): JSX.Element {
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
