// React Concepts - Interactive Learning Module

export interface ReactConceptExample {
  title: string
  code: string
  explanation: string
}

export interface ReactConceptQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type ReactConceptCategory =
  | 'react-foundations'
  | 'hooks-basic'
  | 'hooks-advanced'
  | 'rendering'
  | 'patterns'
  | 'react-performance'

export interface ReactConcept {
  id: string
  title: string
  category: ReactConceptCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: ReactConceptExample[]
  commonMistakes: string[]
  interviewTips: string[]
  interviewFrequency: 'very-high' | 'high' | 'medium' | 'low'
  estimatedReadTime: number
  prerequisites: string[]
  nextConcepts: string[]
}

export interface ReactConceptCategoryInfo {
  id: ReactConceptCategory
  label: string
  order: number
}

export const reactConceptCategories: ReactConceptCategoryInfo[] = [
  { id: 'react-foundations', label: 'Foundations', order: 0 },
  { id: 'hooks-basic', label: 'Basic Hooks', order: 1 },
  { id: 'hooks-advanced', label: 'Advanced Hooks', order: 2 },
  { id: 'rendering', label: 'Rendering', order: 3 },
  { id: 'patterns', label: 'Patterns', order: 4 },
  { id: 'react-performance', label: 'Performance', order: 5 },
]

export const reactConcepts: ReactConcept[] = [
  // ==========================================================================
  // REACT FOUNDATIONS
  // ==========================================================================
  {
    id: 'jsx-rendering',
    title: 'JSX & Rendering',
    category: 'react-foundations',
    difficulty: 'beginner',
    description: 'JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. A compiler transforms each JSX element into React.createElement() calls that produce plain objects describing the UI tree. Understanding JSX is essential because every React component returns JSX.',
    shortDescription: 'HTML-like syntax that compiles to JavaScript',
    keyPoints: [
      'JSX compiles to React.createElement() or the jsx() runtime function',
      'Curly braces {} embed JavaScript expressions inside JSX',
      'JSX expressions must return a single root element or Fragment',
      'Attributes use camelCase: className, htmlFor, onClick',
      'JSX prevents injection attacks by escaping embedded values',
      'Components must start with an uppercase letter to distinguish from HTML tags',
    ],
    examples: [
      {
        title: 'JSX Compilation',
        code: `// JSX syntax
const element = <h1 className="title">Hello</h1>

// Compiles to (classic runtime)
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello'
)

// React 17+ automatic runtime
import { jsx } from 'react/jsx-runtime'
const element = jsx('h1', {
  className: 'title',
  children: 'Hello'
})`,
        explanation: 'JSX is syntactic sugar that compilers like Babel or SWC transform into function calls producing plain objects',
      },
      {
        title: 'Embedding Expressions',
        code: `interface UserProps {
  name: string
  age: number
  isAdmin: boolean
}

function UserCard({ name, age, isAdmin }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Born around {new Date().getFullYear() - age}</p>
      {isAdmin ? <span>Admin</span> : <span>User</span>}
      {age >= 18 && <p>Eligible to vote</p>}
    </div>
  )
}`,
        explanation: 'Curly braces accept any JavaScript expression including variables, function calls, and ternaries for conditional rendering',
      },
      {
        title: 'Fragments',
        code: `import { Fragment } from 'react'

function Greeting() {
  return (
    <>
      <h1>Hello</h1>
      <p>Welcome back</p>
    </>
  )
}

// Explicit Fragment with key for lists
function Glossary({ items }: { items: Item[] }) {
  return (
    <dl>
      {items.map((item) => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.definition}</dd>
        </Fragment>
      ))}
    </dl>
  )
}`,
        explanation: 'Fragments group elements without adding extra DOM nodes, and the explicit syntax supports the key prop for lists',
      },
    ],
    commonMistakes: [
      'Using class instead of className for CSS classes',
      'Forgetting that JSX expressions must have a single root element',
      'Using if statements inside JSX instead of ternary expressions or && operator',
    ],
    interviewTips: [
      'Explain that JSX is not HTML but compiles to JavaScript function calls',
      'Know the difference between the classic and automatic JSX transform',
      'Be ready to explain why React uses className instead of class',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: [],
    nextConcepts: ['components-props', 'conditional-rendering'],
  },
  {
    id: 'components-props',
    title: 'Components & Props',
    category: 'react-foundations',
    difficulty: 'beginner',
    description: 'Components are the building blocks of React applications. They are JavaScript functions that accept props as input and return JSX describing what should appear on screen. Props flow one way from parent to child, creating a predictable data flow.',
    shortDescription: 'Reusable UI building blocks with one-way data',
    keyPoints: [
      'Components are functions that return JSX',
      'Props are read-only and flow from parent to child',
      'Component names must start with an uppercase letter',
      'Props should be typed with a dedicated interface',
      'Default props can be set via destructuring defaults',
      'Props are the mechanism for component reusability and configuration',
      'Prop changes trigger a re-render of the component',
    ],
    examples: [
      {
        title: 'Typed Component with Props',
        code: `interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
  onClick: () => void
  disabled?: boolean
}

function Button({
  label,
  variant = 'primary',
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={variant}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

// Usage
<Button label="Save" onClick={handleSave} />
<Button label="Cancel" variant="secondary" onClick={handleCancel} />`,
        explanation: 'Props are typed with an interface and destructured in the function signature with optional defaults',
      },
      {
        title: 'Passing Data Down',
        code: `interface User {
  id: string
  name: string
  email: string
}

interface UserProfileProps {
  user: User
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <Avatar name={user.name} />
      <UserDetails name={user.name} email={user.email} />
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  return <div>{name[0]}</div>
}

function UserDetails({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  )
}`,
        explanation: 'Data flows down from parent to child through props, each component receiving only the data it needs',
      },
    ],
    commonMistakes: [
      'Mutating props directly instead of treating them as read-only',
      'Passing too many individual props when an object prop would be cleaner',
      'Not providing TypeScript interfaces for component props',
    ],
    interviewTips: [
      'Explain the one-way data flow and why React enforces it',
      'Discuss when to lift state up versus use context to avoid prop drilling',
      'Know the difference between props and state',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 7,
    prerequisites: ['jsx-rendering'],
    nextConcepts: ['children-composition', 'use-state'],
  },
  {
    id: 'children-composition',
    title: 'Children & Composition',
    category: 'react-foundations',
    difficulty: 'beginner',
    description: 'Composition is React\'s primary pattern for building complex UIs from simple components. The children prop lets components wrap arbitrary content without knowing what that content will be, enabling flexible and reusable layouts.',
    shortDescription: 'Building complex UIs from simple parts',
    keyPoints: [
      'children is a special prop containing nested JSX elements',
      'Composition is preferred over inheritance in React',
      'Components can accept render functions as children for flexibility',
      'ReactNode type covers all valid children values',
      'Slot patterns use named props for multiple content areas',
      'Composition keeps components focused and reusable',
    ],
    examples: [
      {
        title: 'Basic Composition with children',
        code: `import { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Card title="Profile">
      <img src="/avatar.png" alt="avatar" />
      <p>Hello, world!</p>
    </Card>
  )
}`,
        explanation: 'The Card component wraps any content passed as children, making it reusable for different layouts',
      },
      {
        title: 'Slot Pattern with Named Props',
        code: `import { ReactNode } from 'react'

interface PageLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

function PageLayout({ header, sidebar, children }: PageLayoutProps) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  )
}

function Dashboard() {
  return (
    <PageLayout
      header={<NavBar />}
      sidebar={<FilterPanel />}
    >
      <DataGrid />
    </PageLayout>
  )
}`,
        explanation: 'Named props act as slots for multiple content areas, giving consumers full control over each section',
      },
    ],
    commonMistakes: [
      'Using inheritance to share behavior between components instead of composition',
      'Typing children as JSX.Element instead of ReactNode which excludes strings and numbers',
      'Creating monolithic components instead of composing smaller ones',
    ],
    interviewTips: [
      'Explain why React favors composition over inheritance',
      'Give examples of the slot pattern for complex layouts',
      'Discuss how children composition relates to the open-closed principle',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 6,
    prerequisites: ['components-props'],
    nextConcepts: ['conditional-rendering', 'compound-components'],
  },
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    category: 'react-foundations',
    difficulty: 'beginner',
    description: 'Conditional rendering in React works the same way conditions work in JavaScript. You use ternary operators, logical && short-circuit evaluation, or early returns to decide which elements to render based on component state or props.',
    shortDescription: 'Rendering different UI based on conditions',
    keyPoints: [
      'Ternary operator renders one of two elements based on a condition',
      'Logical && renders an element only when the condition is truthy',
      'Early return exits the component before rendering for guard clauses',
      'Returning null from a component renders nothing',
      'Switch statements or object maps handle multiple conditions cleanly',
      'Be careful with && and falsy numbers: 0 && <X/> renders 0',
    ],
    examples: [
      {
        title: 'Conditional Patterns',
        code: `interface StatusProps {
  isLoggedIn: boolean
  isAdmin: boolean
  notifications: number
}

function StatusBar({ isLoggedIn, isAdmin, notifications }: StatusProps) {
  // Early return guard
  if (!isLoggedIn) {
    return <button>Sign In</button>
  }

  return (
    <div>
      {/* Ternary for two branches */}
      {isAdmin ? <AdminPanel /> : <UserPanel />}

      {/* && for conditional rendering (safe with > 0) */}
      {notifications > 0 && (
        <span>You have {notifications} new messages</span>
      )}
    </div>
  )
}`,
        explanation: 'Early returns handle guard conditions, ternaries handle two branches, and && handles optional elements',
      },
      {
        title: 'Mapping Conditions to Components',
        code: `type Status = 'loading' | 'error' | 'success'

interface StatusViewProps {
  status: Status
  data?: string
  error?: string
}

const statusComponents: Record<Status, React.FC<StatusViewProps>> = {
  loading: () => <div>Loading...</div>,
  error: ({ error }) => <div>Error: {error}</div>,
  success: ({ data }) => <div>Data: {data}</div>,
}

function DataView(props: StatusViewProps) {
  const Component = statusComponents[props.status]
  return <Component {...props} />
}`,
        explanation: 'An object map cleanly replaces long if-else or switch chains when mapping a finite set of conditions to components',
      },
    ],
    commonMistakes: [
      'Using 0 && <Component /> which renders the number 0 instead of nothing',
      'Complex nested ternaries that should be refactored into separate components',
      'Forgetting that && evaluates the left side and returns it when falsy',
    ],
    interviewTips: [
      'Explain the 0 && gotcha and how to fix it with Boolean() or > 0',
      'Discuss when to use early returns vs ternaries vs && for clarity',
      'Know that returning null hides a component completely',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 6,
    prerequisites: ['jsx-rendering'],
    nextConcepts: ['lists-keys', 'use-state'],
  },
  {
    id: 'lists-keys',
    title: 'Lists & Keys',
    category: 'react-foundations',
    difficulty: 'beginner',
    description: 'Rendering lists is fundamental to React applications. The key prop helps React identify which items changed, were added, or removed during reconciliation. Using stable, unique keys is critical for correct behavior and performance.',
    shortDescription: 'Rendering arrays with identity tracking',
    keyPoints: [
      'Use .map() to transform arrays into lists of JSX elements',
      'Every element in a list needs a unique key prop',
      'Keys must be stable, unique among siblings, and not change between renders',
      'Database IDs or UUIDs make good keys; array indices do not for dynamic lists',
      'Using index as key causes bugs when items are reordered, inserted, or deleted',
      'Keys are not passed as props to the child component',
      'React uses keys to match old and new elements during reconciliation',
    ],
    examples: [
      {
        title: 'Rendering a List with Keys',
        code: `interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
}

function TodoList({ todos, onToggle }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => onToggle(todo.id)}
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'Each list item uses the todo.id as its key, letting React track items correctly even when the list is reordered',
      },
      {
        title: 'Why Index Keys Break',
        code: `// BAD: index as key causes state mismatches on reorder
function BadList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <input defaultValue={item} />
        </li>
      ))}
    </ul>
  )
}

// GOOD: stable ID preserves state correctly
function GoodList({ items }: { items: { id: string; text: string }[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <input defaultValue={item.text} />
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'When items reorder, index keys make React match the wrong item to the wrong DOM node, causing input values to stick to the wrong rows',
      },
    ],
    commonMistakes: [
      'Using array index as key for lists that can be reordered or filtered',
      'Using non-unique keys like item.name when names can repeat',
      'Generating keys with Math.random() which changes every render and destroys all state',
    ],
    interviewTips: [
      'Explain the reconciliation algorithm and why keys help React diff efficiently',
      'Describe concrete bugs that happen with index keys in dynamic lists',
      'Know that keys only need to be unique among siblings, not globally',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 7,
    prerequisites: ['jsx-rendering'],
    nextConcepts: ['virtual-dom', 'use-state'],
  },

  // ==========================================================================
  // HOOKS - BASIC
  // ==========================================================================
  {
    id: 'use-state',
    title: 'useState & State Updates',
    category: 'hooks-basic',
    difficulty: 'beginner',
    description: 'useState is the fundamental hook for adding local state to functional components. It returns a state value and a setter function. State updates are asynchronous and batched, and using the updater function form ensures correct updates when the new value depends on the previous one.',
    shortDescription: 'Adding and updating local component state',
    keyPoints: [
      'Returns a [value, setter] tuple, initialized with the argument',
      'Setter triggers a re-render with the new value',
      'Use updater function form when new state depends on previous: setValue(prev => prev + 1)',
      'State updates are batched in React 18+ for all event types',
      'Lazy initialization accepts a function to avoid expensive computation on every render',
      'State identity check uses Object.is() — same value skips re-render',
      'Objects and arrays must be replaced, not mutated, to trigger re-renders',
    ],
    examples: [
      {
        title: 'Counter with Updater Function',
        code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    // Updater form: correct when called multiple times
    setCount((prev) => prev + 1)
  }

  const incrementThrice = () => {
    // All three updates use the latest value
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
    // count will increase by 3
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={incrementThrice}>+3</button>
    </div>
  )
}`,
        explanation: 'The updater function receives the latest pending state, ensuring correct results when multiple updates are batched',
      },
      {
        title: 'Object State with Immutable Updates',
        code: `import { useState } from 'react'

interface FormData {
  name: string
  email: string
  age: number
}

function ProfileForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
  })

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form>
      <input
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <input
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
    </form>
  )
}`,
        explanation: 'Object state must be replaced with a new object using spread syntax, never mutated directly',
      },
      {
        title: 'Lazy Initialization',
        code: `import { useState } from 'react'

function ExpensiveComponent() {
  // Function is only called on initial render
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('app-data')
    return stored ? JSON.parse(stored) as Record<string, unknown> : {}
  })

  return <div>{JSON.stringify(data)}</div>
}`,
        explanation: 'Passing a function to useState defers expensive computation to the first render only, avoiding it on every re-render',
      },
    ],
    commonMistakes: [
      'Mutating state objects directly instead of creating new references',
      'Using setCount(count + 1) inside loops or async code instead of the updater function',
      'Expecting state to update synchronously right after calling the setter',
    ],
    interviewTips: [
      'Explain batching: React 18 batches all state updates, not just event handlers',
      'Know why Object.is() comparison means you must create new references for objects',
      'Discuss when to use useState vs useReducer for complex state',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 9,
    prerequisites: ['components-props'],
    nextConcepts: ['use-effect', 'use-reducer'],
  },
  {
    id: 'use-effect',
    title: 'useEffect & Side Effects',
    category: 'hooks-basic',
    difficulty: 'beginner',
    description: 'useEffect synchronizes a component with an external system — network requests, DOM manipulation, timers, or subscriptions. It runs after the browser paints, and its cleanup function runs before the next effect or on unmount. The dependency array controls when the effect re-runs.',
    shortDescription: 'Synchronizing components with external systems',
    keyPoints: [
      'Runs after render and browser paint (asynchronous)',
      'Dependency array controls when the effect re-runs',
      'Empty dependency array [] means run only on mount',
      'No dependency array means run after every render',
      'Cleanup function runs before re-running the effect and on unmount',
      'Each render has its own effect with captured values from that render',
      'StrictMode in development runs effects twice to detect missing cleanups',
    ],
    examples: [
      {
        title: 'Data Fetching with Cleanup',
        code: `import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then((res) => res.json() as Promise<User>)
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [userId])

  if (loading) return <div>Loading...</div>
  return <div>{user?.name}</div>
}`,
        explanation: 'AbortController in the cleanup function cancels the previous fetch when userId changes, preventing race conditions',
      },
      {
        title: 'Event Listener Subscription',
        code: `import { useState, useEffect } from 'react'

function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <p>{size.width} x {size.height}</p>
}`,
        explanation: 'The empty dependency array ensures the listener is added once on mount and removed on unmount via the cleanup return',
      },
    ],
    commonMistakes: [
      'Omitting dependencies that are used inside the effect, causing stale closures',
      'Adding object or function dependencies that change every render, causing infinite loops',
      'Forgetting the cleanup function for subscriptions, timers, or event listeners',
    ],
    interviewTips: [
      'Explain the mental model: effects synchronize with external systems, not lifecycle events',
      'Know how to prevent race conditions with AbortController or an ignore flag',
      'Discuss why useEffect runs after paint and when useLayoutEffect is needed instead',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 10,
    prerequisites: ['use-state'],
    nextConcepts: ['use-ref', 'use-layout-effect', 'custom-hooks'],
  },
  {
    id: 'use-ref',
    title: 'useRef & Mutable References',
    category: 'hooks-basic',
    difficulty: 'beginner',
    description: 'useRef returns a mutable ref object whose .current property persists across renders without triggering re-renders. It serves two purposes: accessing DOM elements directly and storing mutable values that need to survive re-renders but should not cause them.',
    shortDescription: 'Persistent mutable values without re-renders',
    keyPoints: [
      'Returns an object with a .current property that persists for the component lifetime',
      'Mutating .current does NOT trigger a re-render',
      'Use ref attribute on JSX elements to access the underlying DOM node',
      'Common for focus management, measuring dimensions, and storing interval IDs',
      'Can store any mutable value like a class instance field',
      'Refs are the escape hatch from React\'s declarative model to imperative DOM access',
    ],
    examples: [
      {
        title: 'DOM Access and Focus',
        code: `import { useRef, useEffect } from 'react'

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} type="text" placeholder="Search..." />
}`,
        explanation: 'The ref attribute connects the JSX element to the ref object, giving direct access to the DOM node for imperative operations like focusing',
      },
      {
        title: 'Storing Mutable Values',
        code: `import { useRef, useState, useCallback } from 'react'

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const start = useCallback(() => {
    startTimeRef.current = Date.now() - elapsed
    intervalRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current)
    }, 10)
  }, [elapsed])

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setElapsed(0)
  }, [stop])

  return (
    <div>
      <p>{(elapsed / 1000).toFixed(2)}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
        explanation: 'Interval IDs and timestamps are stored in refs because they need to persist across renders but changes should not trigger re-renders',
      },
      {
        title: 'Previous Value Tracking',
        code: `import { useRef, useEffect } from 'react'

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

function PriceDisplay({ price }: { price: number }) {
  const prevPrice = usePrevious(price)
  const direction = prevPrice !== undefined
    ? price > prevPrice ? 'up' : price < prevPrice ? 'down' : 'same'
    : 'same'

  return <span className={direction}>{price}</span>
}`,
        explanation: 'Refs can track previous render values because the effect updates .current after render, returning the old value during the current render',
      },
    ],
    commonMistakes: [
      'Reading or writing ref.current during render, which makes the component impure',
      'Using refs to store values that should cause re-renders when changed',
      'Forgetting that ref.current is null until the component mounts and the DOM element is created',
    ],
    interviewTips: [
      'Explain the difference between useRef and useState for persisting values',
      'Know when refs are appropriate vs when state is more correct',
      'Discuss forwardRef for passing refs through component boundaries',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 7,
    prerequisites: ['use-state', 'use-effect'],
    nextConcepts: ['refs-dom-access', 'use-layout-effect'],
  },
  {
    id: 'use-context',
    title: 'useContext & Context API',
    category: 'hooks-basic',
    difficulty: 'beginner',
    description: 'useContext reads a value from a React Context, letting you pass data through the component tree without prop drilling. A Provider component supplies the value, and any descendant that calls useContext receives it. Context is ideal for global or semi-global state like themes, auth, or locale.',
    shortDescription: 'Sharing data without prop drilling',
    keyPoints: [
      'createContext creates a context with an optional default value',
      'Provider wraps a subtree and supplies the context value',
      'useContext reads the nearest Provider value above in the tree',
      'All consumers re-render when the Provider value changes',
      'Split large contexts into smaller focused ones to reduce unnecessary re-renders',
      'Custom hooks wrapping useContext provide better error messages and abstraction',
    ],
    examples: [
      {
        title: 'Theme Context',
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemeButton() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Current: {theme}</button>
}`,
        explanation: 'A custom hook wraps useContext with a null check, providing a clean API and helpful error if used outside the provider',
      },
      {
        title: 'Avoiding Re-renders with Split Contexts',
        code: `import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

interface UserContextType {
  user: string | null
  setUser: (u: string | null) => void
}

interface ThemeContextType {
  theme: string
  setTheme: (t: string) => void
}

const UserContext = createContext<UserContextType | null>(null)
const ThemeContext = createContext<ThemeContextType | null>(null)

function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [theme, setTheme] = useState('light')

  const userValue = useMemo(() => ({ user, setUser }), [user])
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme])

  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}`,
        explanation: 'Splitting context and memoizing values ensures that theme changes do not re-render user-only consumers and vice versa',
      },
    ],
    commonMistakes: [
      'Putting everything in a single context causing all consumers to re-render on any change',
      'Not memoizing the context value object, which creates a new reference every render',
      'Using context for high-frequency updates like mouse position that should use state or refs',
    ],
    interviewTips: [
      'Explain the re-render behavior: all consumers re-render when the provider value changes',
      'Discuss strategies to mitigate context re-renders: splitting, memoizing, selectors',
      'Know when to use context vs a state management library like Zustand',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 9,
    prerequisites: ['components-props', 'use-state'],
    nextConcepts: ['context-patterns', 'use-reducer'],
  },

  // ==========================================================================
  // HOOKS - ADVANCED
  // ==========================================================================
  {
    id: 'use-reducer',
    title: 'useReducer & State Machines',
    category: 'hooks-advanced',
    difficulty: 'intermediate',
    description: 'useReducer manages complex state logic by dispatching actions to a reducer function. It is preferred over useState when state transitions depend on previous state, when multiple sub-values are related, or when you want to centralize state logic for testing and reasoning.',
    shortDescription: 'Managing complex state with dispatch and actions',
    keyPoints: [
      'Takes a reducer function and initial state, returns [state, dispatch]',
      'Reducer is a pure function: (state, action) => newState',
      'Actions describe what happened, the reducer decides how state changes',
      'TypeScript discriminated unions make actions type-safe',
      'Reducers are easy to test in isolation since they are pure functions',
      'useReducer can be combined with Context to create a mini state management system',
    ],
    examples: [
      {
        title: 'Typed Reducer with Discriminated Unions',
        code: `import { useReducer } from 'react'

interface TodoState {
  todos: { id: number; text: string; done: boolean }[]
  nextId: number
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        todos: [...state.todos, { id: state.nextId, text: action.text, done: false }],
        nextId: state.nextId + 1,
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      }
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    nextId: 1,
  })

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', text: 'New todo' })}>
        Add
      </button>
      {state.todos.map((todo) => (
        <div key={todo.id}>
          <span
            onClick={() => dispatch({ type: 'TOGGLE', id: todo.id })}
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  )
}`,
        explanation: 'Discriminated union actions ensure TypeScript narrows the payload type in each case, making invalid actions impossible to dispatch',
      },
      {
        title: 'Async State Machine',
        code: `import { useReducer } from 'react'

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

type AsyncAction<T> =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; data: T }
  | { type: 'REJECT'; error: string }
  | { type: 'RESET' }

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'FETCH': return { status: 'loading' }
    case 'RESOLVE': return { status: 'success', data: action.data }
    case 'REJECT': return { status: 'error', error: action.error }
    case 'RESET': return { status: 'idle' }
  }
}

function useAsync<T>() {
  return useReducer(asyncReducer<T>, { status: 'idle' } as AsyncState<T>)
}`,
        explanation: 'Discriminated union state types make invalid states unrepresentable, guaranteeing data exists only when status is success',
      },
    ],
    commonMistakes: [
      'Mutating the state object inside the reducer instead of returning a new one',
      'Using useReducer for simple toggle or counter state where useState is cleaner',
      'Putting async logic inside the reducer which must be a pure function',
    ],
    interviewTips: [
      'Compare useState vs useReducer: useReducer shines when state transitions are complex or interdependent',
      'Explain how discriminated unions prevent invalid state combinations at the type level',
      'Discuss the pattern of useReducer + Context as a lightweight Redux alternative',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 9,
    prerequisites: ['use-state'],
    nextConcepts: ['use-context', 'custom-hooks'],
  },
  {
    id: 'use-memo',
    title: 'useMemo & Computed Values',
    category: 'hooks-advanced',
    difficulty: 'intermediate',
    description: 'useMemo caches the result of an expensive computation between re-renders, recomputing only when its dependencies change. It prevents unnecessary recalculations and maintains referential stability for objects and arrays passed as props or used in dependency arrays.',
    shortDescription: 'Caching expensive computations between renders',
    keyPoints: [
      'Accepts a function and dependency array, returns the memoized result',
      'Only recomputes when a dependency changes (shallow comparison)',
      'Primary use: skip expensive recalculations like sorting or filtering large lists',
      'Secondary use: maintain stable object/array references for React.memo or effect dependencies',
      'Not free: has overhead from dependency comparison and memory for cached values',
      'React may drop the cache in the future, so code must work without it',
    ],
    examples: [
      {
        title: 'Expensive Computation',
        code: `import { useMemo, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  const filteredAndSorted = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    )
    return filtered.sort((a, b) =>
      sortBy === 'price'
        ? a.price - b.price
        : a.name.localeCompare(b.name)
    )
  }, [products, filter, sortBy])

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <button onClick={() => setSortBy('price')}>Sort by Price</button>
      {filteredAndSorted.map((p) => (
        <div key={p.id}>{p.name}: \${p.price}</div>
      ))}
    </div>
  )
}`,
        explanation: 'Filtering and sorting only recompute when products, filter, or sortBy change, not on every render from unrelated state updates',
      },
      {
        title: 'Stable Reference for Child Components',
        code: `import { useMemo } from 'react'

interface ChartData {
  labels: string[]
  values: number[]
}

interface DashboardProps {
  revenue: number[]
  months: string[]
}

function Dashboard({ revenue, months }: DashboardProps) {
  // Without useMemo, this creates a new object every render,
  // causing MemoizedChart to re-render unnecessarily
  const chartData: ChartData = useMemo(
    () => ({ labels: months, values: revenue }),
    [months, revenue]
  )

  return <MemoizedChart data={chartData} />
}`,
        explanation: 'useMemo keeps the same object reference between renders so memoized children can skip re-rendering via shallow prop comparison',
      },
    ],
    commonMistakes: [
      'Wrapping every computation in useMemo even when the cost is trivial',
      'Omitting dependencies or including stale references in the dependency array',
      'Using useMemo where useCallback is more appropriate for memoizing functions',
    ],
    interviewTips: [
      'Explain that useMemo is an optimization, not a semantic guarantee',
      'Discuss when NOT to use useMemo: simple calculations, primitive values, rarely changing data',
      'Know that React may drop memoized values in the future to free memory',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 8,
    prerequisites: ['use-state', 'use-effect'],
    nextConcepts: ['use-callback', 'react-memo'],
  },
  {
    id: 'use-callback',
    title: 'useCallback & Function Stability',
    category: 'hooks-advanced',
    difficulty: 'intermediate',
    description: 'useCallback returns a memoized version of a callback function that only changes when its dependencies change. It is primarily useful when passing callbacks to memoized child components or when functions appear in effect dependency arrays, preventing unnecessary re-renders or effect re-runs.',
    shortDescription: 'Memoizing functions to prevent unnecessary re-renders',
    keyPoints: [
      'useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)',
      'Without useCallback, a new function reference is created every render',
      'Primary use: prevent re-renders of React.memo children receiving callback props',
      'Secondary use: stabilize functions used in useEffect dependency arrays',
      'Only beneficial when paired with React.memo or dependency arrays',
      'Adds overhead from closure creation and dependency comparison',
    ],
    examples: [
      {
        title: 'Preventing Child Re-renders',
        code: `import { useState, useCallback, memo } from 'react'

interface ItemProps {
  id: string
  name: string
  onDelete: (id: string) => void
}

const ExpensiveItem = memo(function ExpensiveItem({
  id,
  name,
  onDelete,
}: ItemProps) {
  return (
    <div>
      <span>{name}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  )
})

function ItemList({ items }: { items: { id: string; name: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  // Without useCallback, onDelete changes every render,
  // defeating React.memo on ExpensiveItem
  const handleDelete = useCallback((id: string) => {
    // delete logic here
  }, [])

  return (
    <div>
      <p>Selected: {selected}</p>
      {items.map((item) => (
        <ExpensiveItem
          key={item.id}
          id={item.id}
          name={item.name}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}`,
        explanation: 'useCallback keeps the same function reference so ExpensiveItem wrapped in React.memo can skip re-rendering when selected changes',
      },
      {
        title: 'Stable Function in Effect Dependencies',
        code: `import { useState, useCallback, useEffect } from 'react'

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([])

  const fetchResults = useCallback(async () => {
    const res = await fetch(\`/api/search?q=\${query}\`)
    const data = await res.json() as string[]
    setResults(data)
  }, [query])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  return (
    <ul>
      {results.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  )
}`,
        explanation: 'useCallback makes fetchResults change only when query changes, so the effect does not re-run on every render',
      },
    ],
    commonMistakes: [
      'Using useCallback on every function even when no child uses React.memo',
      'Forgetting to include all used variables in the dependency array',
      'Using useCallback without React.memo on children, providing no benefit',
    ],
    interviewTips: [
      'Explain that useCallback without React.memo on children is pointless overhead',
      'Know that useCallback(fn, deps) is syntactic sugar for useMemo(() => fn, deps)',
      'Discuss the upcoming React Compiler which auto-memoizes and may make useCallback unnecessary',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 8,
    prerequisites: ['use-memo', 'use-effect'],
    nextConcepts: ['react-memo', 'react-performance'],
  },
  {
    id: 'use-layout-effect',
    title: 'useLayoutEffect & Synchronous Effects',
    category: 'hooks-advanced',
    difficulty: 'intermediate',
    description: 'useLayoutEffect fires synchronously after DOM mutations but before the browser paints, allowing you to read layout and apply changes without visual flicker. It has the same signature as useEffect but different timing, making it essential for DOM measurements and position calculations.',
    shortDescription: 'Synchronous DOM reads before browser paint',
    keyPoints: [
      'Same API as useEffect but runs synchronously after DOM mutation, before paint',
      'Use for DOM measurements that must happen before the user sees the frame',
      'Prevents visual flicker when reading and immediately writing to the DOM',
      'Blocks painting, so overuse degrades performance',
      'Emits a warning during SSR because the server has no DOM to measure',
      'The vast majority of effects should use useEffect instead',
    ],
    examples: [
      {
        title: 'Tooltip Positioning',
        code: `import { useLayoutEffect, useRef, useState } from 'react'

interface TooltipProps {
  targetRef: React.RefObject<HTMLElement | null>
  text: string
}

function Tooltip({ targetRef, text }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return
    const rect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    setPosition({
      top: rect.bottom + 8,
      left: rect.left + (rect.width - tooltipRect.width) / 2,
    })
  }, [targetRef, text])

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: position.top, left: position.left }}
    >
      {text}
    </div>
  )
}`,
        explanation: 'useLayoutEffect measures the target element and positions the tooltip before the browser paints, preventing the tooltip from flashing at the wrong position',
      },
      {
        title: 'Auto-scrolling Container',
        code: `import { useLayoutEffect, useRef } from 'react'

function ChatMessages({ messages }: { messages: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  return (
    <div ref={containerRef} style={{ height: 400, overflow: 'auto' }}>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  )
}`,
        explanation: 'Scrolling happens synchronously before paint so the user never sees the old scroll position when new messages arrive',
      },
    ],
    commonMistakes: [
      'Using useLayoutEffect for all effects instead of only when flicker prevention is needed',
      'Performing expensive work inside useLayoutEffect that blocks rendering',
      'Using useLayoutEffect in SSR code where it causes hydration warnings',
    ],
    interviewTips: [
      'Draw the timeline: render -> DOM mutation -> useLayoutEffect -> paint -> useEffect',
      'Give concrete examples where useEffect causes flicker and useLayoutEffect fixes it',
      'Know the SSR workaround: check typeof window or use useEffect with isomorphic fallback',
    ],
    interviewFrequency: 'low',
    estimatedReadTime: 7,
    prerequisites: ['use-effect', 'use-ref'],
    nextConcepts: ['refs-dom-access'],
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    category: 'hooks-advanced',
    difficulty: 'intermediate',
    description: 'Custom hooks extract reusable stateful logic into functions that start with "use". They allow you to share behavior between components without changing the component hierarchy. Each component calling a custom hook gets its own independent copy of the state.',
    shortDescription: 'Reusable stateful logic extracted into functions',
    keyPoints: [
      'Must start with "use" to follow the rules of hooks',
      'Can call other hooks inside them including useState, useEffect, and other custom hooks',
      'Each component using the hook gets independent state',
      'Replace render props and HOCs for sharing stateful logic',
      'Should do one thing well and be composable with other hooks',
      'Test by testing the component that uses them or with renderHook from testing library',
    ],
    examples: [
      {
        title: 'useLocalStorage Hook',
        code: `import { useState, useEffect } from 'react'

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) as T : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored))
    } catch {
      // Storage full or unavailable
    }
  }, [key, stored])

  return [stored, setStored]
}

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16)

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <input
        type="range"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
    </div>
  )
}`,
        explanation: 'The hook encapsulates localStorage read/write logic that any component can reuse, each getting its own independent value',
      },
      {
        title: 'useDebounce Hook',
        code: `import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function SearchBar() {
  const [input, setInput] = useState('')
  const debouncedQuery = useDebounce(input, 300)

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch results only after user stops typing
      fetch(\`/api/search?q=\${debouncedQuery}\`)
    }
  }, [debouncedQuery])

  return (
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search..."
    />
  )
}`,
        explanation: 'useDebounce delays updating the returned value until the input has been stable for the specified delay, reducing API calls',
      },
      {
        title: 'useMediaQuery Hook',
        code: `import { useState, useEffect } from 'react'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(query).matches
      : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mql.addEventListener('change', handler)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <HamburgerMenu /> : <DesktopNav />
}`,
        explanation: 'The hook subscribes to a CSS media query, returning a reactive boolean that updates when the viewport crosses the breakpoint',
      },
    ],
    commonMistakes: [
      'Not starting the function name with "use" which disables lint rules for hook ordering',
      'Assuming custom hooks share state between components that call them',
      'Creating custom hooks that do too many things instead of composable single-purpose hooks',
    ],
    interviewTips: [
      'Explain that custom hooks share logic but not state between components',
      'Compare custom hooks to HOCs and render props as patterns for code reuse',
      'Be ready to write a custom hook from scratch such as useFetch or useDebounce',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 10,
    prerequisites: ['use-state', 'use-effect', 'use-ref'],
    nextConcepts: ['render-props', 'higher-order-components'],
  },

  // ==========================================================================
  // RENDERING
  // ==========================================================================
  {
    id: 'virtual-dom',
    title: 'Virtual DOM & Reconciliation',
    category: 'rendering',
    difficulty: 'intermediate',
    description: 'The virtual DOM is a lightweight JavaScript object representation of the real DOM. When state changes, React creates a new virtual DOM tree, diffs it against the previous one, and computes the minimal set of DOM mutations needed. This reconciliation process uses O(n) heuristics to make updates efficient.',
    shortDescription: 'Efficient UI updates through tree diffing',
    keyPoints: [
      'Virtual DOM is a plain JS object tree describing the UI',
      'React diffs the new virtual tree against the previous one',
      'O(n) heuristics: different element types rebuild entire subtrees',
      'Keys help React identify moved, added, or removed children',
      'Batched DOM updates minimize expensive real DOM operations',
      'React Fiber architecture breaks reconciliation into interruptible work units',
      'Declarative model: describe what the UI should be, React figures out how',
    ],
    examples: [
      {
        title: 'How Reconciliation Works',
        code: `// Same type: React updates props, keeps the DOM node
// Before: <button className="blue">OK</button>
// After:  <button className="red">OK</button>
// React only updates className on the existing button

// Different type: React destroys and rebuilds
// Before: <div><Counter /></div>
// After:  <section><Counter /></section>
// Counter state is lost because the parent type changed

function App({ useSection }: { useSection: boolean }) {
  // Changing the wrapper type destroys Counter state
  const Wrapper = useSection ? 'section' : 'div'
  return (
    <Wrapper>
      <Counter />
    </Wrapper>
  )
}`,
        explanation: 'Same element types are updated in place; different element types cause the old subtree to be torn down and rebuilt from scratch',
      },
      {
        title: 'Key-based Reconciliation',
        code: `interface Item {
  id: string
  name: string
}

function ReorderableList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        // Key tells React which DOM nodes correspond to which data
        <li key={item.id}>
          <input defaultValue={item.name} />
        </li>
      ))}
    </ul>
  )
}

// When items reorder: [A, B, C] -> [C, A, B]
// With keys: React moves DOM nodes (state preserved)
// Without keys: React updates content in place (state mismatched)`,
        explanation: 'Keys let React track list items across renders by identity rather than position, correctly moving DOM nodes when lists reorder',
      },
    ],
    commonMistakes: [
      'Thinking the virtual DOM makes React faster than vanilla JS in all cases',
      'Changing element types accidentally and losing child component state',
      'Not understanding that reconciliation is per-component, not global',
    ],
    interviewTips: [
      'Explain the two heuristics: different types rebuild subtrees, keys match list children',
      'Discuss why O(n) is achievable instead of O(n^3) generic tree diff',
      'Know that React Fiber made reconciliation interruptible for concurrent features',
    ],
    interviewFrequency: 'very-high',
    estimatedReadTime: 10,
    prerequisites: ['jsx-rendering', 'lists-keys'],
    nextConcepts: ['rerender-triggers', 'component-lifecycle'],
  },
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle',
    category: 'rendering',
    difficulty: 'intermediate',
    description: 'Functional components have a lifecycle managed through hooks. A component mounts when it first appears in the tree, updates when its state or props change, and unmounts when removed. useEffect\'s setup and cleanup functions map to these phases, replacing class lifecycle methods.',
    shortDescription: 'Mount, update, and unmount phases in hooks',
    keyPoints: [
      'Mount: component appears in the tree, initial render occurs',
      'Update: re-render triggered by state change, prop change, or parent re-render',
      'Unmount: component removed from the tree, cleanup runs',
      'useEffect setup runs after mount and after every update matching dependencies',
      'useEffect cleanup runs before the next effect and on unmount',
      'StrictMode double-invokes effects in development to detect impure code',
      'Think in terms of synchronization, not lifecycle events',
    ],
    examples: [
      {
        title: 'Lifecycle with useEffect',
        code: `import { useState, useEffect } from 'react'

function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    // Setup: runs on mount and when roomId changes
    const connection = createConnection(roomId)
    connection.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg])
    })

    // Cleanup: runs before re-connecting and on unmount
    return () => {
      connection.disconnect()
    }
  }, [roomId])

  return (
    <ul>
      {messages.map((msg, i) => <li key={i}>{msg}</li>)}
    </ul>
  )
}

function createConnection(roomId: string) {
  return {
    on: (_event: string, _cb: (msg: string) => void) => {},
    disconnect: () => {},
  }
}`,
        explanation: 'When roomId changes, cleanup disconnects from the old room before setup connects to the new room, preventing leaked connections',
      },
      {
        title: 'Mount-Only and Unmount Logic',
        code: `import { useEffect, useRef } from 'react'

function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mount: initialize animation library
    const animation = startAnimation(elementRef.current)

    return () => {
      // Unmount: clean up animation
      animation.destroy()
    }
  }, []) // Empty deps: mount + unmount only

  return <div ref={elementRef}>Animated content</div>
}

function startAnimation(_el: HTMLDivElement | null) {
  return { destroy: () => {} }
}`,
        explanation: 'An empty dependency array makes the effect run only on mount with cleanup only on unmount, similar to componentDidMount and componentWillUnmount',
      },
    ],
    commonMistakes: [
      'Thinking in lifecycle methods instead of effect synchronization',
      'Not understanding that effects run after render, not during',
      'Missing cleanup for subscriptions causing memory leaks after unmount',
    ],
    interviewTips: [
      'Map class lifecycle methods to hooks: componentDidMount -> useEffect with [], componentDidUpdate -> useEffect with deps',
      'Explain the shift from lifecycle thinking to synchronization thinking',
      'Discuss how StrictMode double-mounting helps catch missing cleanups',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: ['use-effect'],
    nextConcepts: ['rerender-triggers', 'virtual-dom'],
  },
  {
    id: 'rerender-triggers',
    title: 'Re-render Triggers',
    category: 'rendering',
    difficulty: 'intermediate',
    description: 'Understanding what causes React components to re-render is critical for performance and debugging. A component re-renders when its state changes, when its parent re-renders, or when a context it consumes changes. Knowing these triggers helps you prevent unnecessary renders.',
    shortDescription: 'What causes components to re-render',
    keyPoints: [
      'State change: calling setState with a new value triggers a re-render',
      'Parent re-render: all children re-render by default when a parent re-renders',
      'Context change: all consumers of a context re-render when the provider value changes',
      'Same state value: React bails out if the new state is the same reference (Object.is)',
      'Props alone do not trigger re-renders; the parent re-rendering does',
      'React.memo wraps a component to skip re-rendering when props have not changed',
      'forceUpdate in class components has no functional component equivalent',
    ],
    examples: [
      {
        title: 'Identifying Re-render Causes',
        code: `import { useState, memo } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Alice')

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </button>

      {/* Re-renders on every count change even though it only uses name */}
      <Child name={name} />

      {/* Skips re-render when name has not changed */}
      <MemoizedChild name={name} />
    </div>
  )
}

function Child({ name }: { name: string }) {
  return <div>Hello {name}</div>
}

const MemoizedChild = memo(function MemoizedChild({ name }: { name: string }) {
  return <div>Hello {name}</div>
})`,
        explanation: 'Child re-renders every time Parent re-renders regardless of which state changed; MemoizedChild skips re-rendering when its name prop has not changed',
      },
      {
        title: 'State Bailout',
        code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    // Setting the same value: React bails out, no re-render
    setCount(0) // No re-render if count is already 0

    // New reference: always triggers re-render
    // setData({ ...data }) // Creates a new object, triggers re-render
    // setData(data)        // Same reference, bails out
  }

  return <button onClick={handleClick}>Count: {count}</button>
}`,
        explanation: 'React uses Object.is to compare the new value with the current value; if they are the same, the re-render is skipped',
      },
    ],
    commonMistakes: [
      'Creating new object or array references on every render that break memoization',
      'Assuming props changes cause re-renders when it is actually the parent re-rendering',
      'Placing rapidly changing state high in the tree causing the entire subtree to re-render',
    ],
    interviewTips: [
      'List the three triggers: state change, parent re-render, context change',
      'Explain why passing inline objects or functions as props breaks React.memo',
      'Discuss the composition pattern of moving state closer to where it is used',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: ['use-state', 'virtual-dom'],
    nextConcepts: ['react-memo', 'react-performance'],
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled & Uncontrolled Components',
    category: 'rendering',
    difficulty: 'intermediate',
    description: 'Controlled components have their form values managed by React state, making React the single source of truth. Uncontrolled components let the DOM manage the value, accessed via refs. Understanding when to use each approach is important for building forms effectively.',
    shortDescription: 'React-managed vs DOM-managed form values',
    keyPoints: [
      'Controlled: value prop + onChange handler, React state is the source of truth',
      'Uncontrolled: defaultValue + ref, DOM is the source of truth',
      'Controlled gives full programmatic control for validation, formatting, and conditional logic',
      'Uncontrolled is simpler for basic forms where you only need the value on submit',
      'Setting value without onChange creates a read-only input that React warns about',
      'File inputs are always uncontrolled because their value is read-only for security',
    ],
    examples: [
      {
        title: 'Controlled vs Uncontrolled',
        code: `import { useState, useRef, type FormEvent } from 'react'

function ControlledForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setError(value.includes('@') ? '' : 'Invalid email')
  }

  return (
    <div>
      <input value={email} onChange={handleChange} />
      {error && <span>{error}</span>}
    </div>
  )
}

function UncontrolledForm() {
  const emailRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = emailRef.current?.value ?? ''
    // Validate only on submit
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  )
}`,
        explanation: 'Controlled components validate on every keystroke while uncontrolled components read the value only when needed',
      },
    ],
    commonMistakes: [
      'Providing value without onChange, creating a frozen input that cannot be typed into',
      'Switching between controlled and uncontrolled by toggling between value and defaultValue',
      'Trying to control file inputs which are always uncontrolled for security reasons',
    ],
    interviewTips: [
      'Explain the trade-off: controlled gives more power but more boilerplate',
      'Discuss when uncontrolled is actually the better choice like simple search forms',
      'Know that React warns when switching between controlled and uncontrolled modes',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 7,
    prerequisites: ['use-state', 'use-ref'],
    nextConcepts: ['use-reducer'],
  },
  {
    id: 'refs-dom-access',
    title: 'Refs & DOM Access',
    category: 'rendering',
    difficulty: 'intermediate',
    description: 'Refs provide an escape hatch from React\'s declarative model to access and manipulate DOM nodes directly. This includes focus management, scroll positioning, measuring elements, and integrating with non-React DOM libraries. forwardRef passes refs through component boundaries.',
    shortDescription: 'Direct DOM manipulation via refs',
    keyPoints: [
      'useRef creates a ref attached to a DOM element via the ref attribute',
      'Ref.current is null until the component mounts',
      'forwardRef allows parent components to ref a child\'s inner DOM element',
      'useImperativeHandle customizes what the forwarded ref exposes',
      'Callback refs run a function when the ref is attached or detached',
      'In React 19, ref is available as a regular prop without forwardRef',
    ],
    examples: [
      {
        title: 'forwardRef for Reusable Components',
        code: `import { forwardRef, useRef, useImperativeHandle } from 'react'

interface InputProps {
  label: string
  placeholder?: string
}

const FancyInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder }, ref) => (
    <label>
      {label}
      <input ref={ref} placeholder={placeholder} />
    </label>
  )
)
FancyInput.displayName = 'FancyInput'

function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <FancyInput ref={inputRef} label="Name" />
      <button onClick={() => inputRef.current?.focus()}>
        Focus Input
      </button>
    </div>
  )
}`,
        explanation: 'forwardRef passes the parent ref through to the inner input element, letting the parent focus it directly',
      },
      {
        title: 'useImperativeHandle for Custom API',
        code: `import { forwardRef, useRef, useImperativeHandle } from 'react'

interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  seekTo: (time: number) => void
}

const VideoPlayer = forwardRef<VideoPlayerHandle, { src: string }>(
  ({ src }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      seekTo: (time: number) => {
        if (videoRef.current) videoRef.current.currentTime = time
      },
    }))

    return <video ref={videoRef} src={src} />
  }
)
VideoPlayer.displayName = 'VideoPlayer'

function MediaPage() {
  const playerRef = useRef<VideoPlayerHandle>(null)

  return (
    <div>
      <VideoPlayer ref={playerRef} src="/video.mp4" />
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.seekTo(0)}>Restart</button>
    </div>
  )
}`,
        explanation: 'useImperativeHandle exposes a limited API instead of the raw DOM element, keeping the component encapsulated',
      },
    ],
    commonMistakes: [
      'Accessing ref.current during render before the DOM element is attached',
      'Exposing the entire DOM node when only specific methods are needed',
      'Forgetting to set displayName on forwardRef components for debugging',
    ],
    interviewTips: [
      'Explain why refs are an escape hatch and when declarative solutions are better',
      'Know useImperativeHandle for exposing a controlled API through refs',
      'Discuss how React 19 simplifies ref forwarding by making ref a regular prop',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: ['use-ref'],
    nextConcepts: ['use-layout-effect'],
  },

  // ==========================================================================
  // PATTERNS
  // ==========================================================================
  {
    id: 'compound-components',
    title: 'Compound Components',
    category: 'patterns',
    difficulty: 'advanced',
    description: 'Compound components are related components that share implicit state through Context, forming a cohesive API. The parent manages state and children consume it, giving users full control over rendering order and composition while hiding internal wiring. Libraries like Radix UI use this pattern extensively.',
    shortDescription: 'Related components sharing implicit state via context',
    keyPoints: [
      'Parent component manages shared state via Context Provider',
      'Child components consume the shared context to coordinate behavior',
      'Consumers control rendering order and composition freely',
      'Internal state sharing is hidden from the public API',
      'Validation can enforce that children are used within the correct parent',
      'Named sub-components (e.g., Tabs.Panel) provide a clear API',
    ],
    examples: [
      {
        title: 'Tabs Compound Component',
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab components must be used within Tabs')
  return ctx
}

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext()
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext()
  return activeTab === id ? <div role="tabpanel">{children}</div> : null
}

// Usage
function App() {
  return (
    <Tabs defaultTab="overview">
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="details">Details</Tab>
      </TabList>
      <TabPanel id="overview">Overview content</TabPanel>
      <TabPanel id="details">Details content</TabPanel>
    </Tabs>
  )
}`,
        explanation: 'Each sub-component consumes the shared TabsContext, allowing consumers to freely compose and reorder Tab and TabPanel elements',
      },
    ],
    commonMistakes: [
      'Using compound components for simple cases where props would be cleaner',
      'Not providing a helpful error message when child components are used outside the parent',
      'Exposing too much internal state through the shared context',
    ],
    interviewTips: [
      'Compare compound components to configuration-based APIs and explain the flexibility trade-off',
      'Reference real-world libraries like Radix UI or Headless UI that use this pattern',
      'Discuss how context keeps the internal wiring hidden from consumers',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 10,
    prerequisites: ['use-context', 'children-composition'],
    nextConcepts: ['context-patterns', 'render-props'],
  },
  {
    id: 'render-props',
    title: 'Render Props',
    category: 'patterns',
    difficulty: 'advanced',
    description: 'Render props is a pattern where a component accepts a function that returns JSX, calling it with internal state or logic. This inverts control so the logic-owning component does not own the UI. While largely replaced by custom hooks, render props remain useful when the shared logic involves JSX structure.',
    shortDescription: 'Sharing logic via functions that return JSX',
    keyPoints: [
      'A function prop (often children) receives internal state and returns JSX',
      'Inverts control: logic component provides data, consumer provides UI',
      'Largely replaced by custom hooks for sharing stateful logic',
      'Still useful when the shared logic involves DOM structure or wrapper elements',
      'Can cause unnecessary nesting if overused',
      'TypeScript can fully type the render function parameters',
    ],
    examples: [
      {
        title: 'Mouse Tracker Render Prop',
        code: `import { useState, type ReactNode } from 'react'

interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  children: (pos: MousePosition) => ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100%' }}>
      {children(pos)}
    </div>
  )
}

function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          <p>Cursor at ({x}, {y})</p>
          <div
            style={{
              position: 'absolute',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'blue',
            }}
          />
        </div>
      )}
    </MouseTracker>
  )
}`,
        explanation: 'MouseTracker manages the mouse position state while the consumer decides how to render it through the children function',
      },
      {
        title: 'Render Prop vs Custom Hook',
        code: `import { useState, useEffect } from 'react'

// Render prop approach
interface FetchRenderProps<T> {
  url: string
  children: (state: { data: T | null; loading: boolean }) => ReactNode
}

function Fetch<T>({ url, children }: FetchRenderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then((r) => r.json() as Promise<T>)
      .then((d) => { setData(d); setLoading(false) })
  }, [url])

  return <>{children({ data, loading })}</>
}

// Custom hook approach (usually preferred)
function useFetch<T>(url: string): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then((r) => r.json() as Promise<T>)
      .then((d) => { setData(d); setLoading(false) })
  }, [url])

  return { data, loading }
}`,
        explanation: 'Custom hooks are generally cleaner for sharing logic, but render props are still useful when the shared code needs to render wrapper elements',
      },
    ],
    commonMistakes: [
      'Creating deeply nested render prop callbacks that are hard to read',
      'Using render props when a custom hook would be simpler and cleaner',
      'Not typing the render function parameters properly in TypeScript',
    ],
    interviewTips: [
      'Explain the historical context: render props solved the same problem custom hooks do now',
      'Know when render props are still useful over custom hooks (when JSX structure is shared)',
      'Be able to convert a render prop component into a custom hook',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: ['children-composition', 'custom-hooks'],
    nextConcepts: ['higher-order-components'],
  },
  {
    id: 'higher-order-components',
    title: 'Higher-Order Components',
    category: 'patterns',
    difficulty: 'advanced',
    description: 'A Higher-Order Component (HOC) is a function that takes a component and returns a new enhanced component. HOCs add behavior like authentication checks, data injection, or logging without modifying the original component. While largely replaced by hooks, HOCs remain in many codebases and libraries.',
    shortDescription: 'Functions that enhance components with extra behavior',
    keyPoints: [
      'A function that takes a component and returns a new component',
      'Does not modify the input component, wraps it instead',
      'Convention: prefix with "with" (withAuth, withLoading)',
      'Must forward refs and hoist statics for transparency',
      'Composition of multiple HOCs can create wrapper hell in the React tree',
      'Largely replaced by custom hooks but still common in older codebases',
    ],
    examples: [
      {
        title: 'withAuth HOC',
        code: `import { type ComponentType } from 'react'

interface WithAuthProps {
  isAuthenticated: boolean
  userName: string
}

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  function WithAuthComponent(props: Omit<P, keyof WithAuthProps>) {
    const isAuthenticated = useAuthStatus()
    const userName = useUserName()

    if (!isAuthenticated) {
      return <div>Please log in to view this page.</div>
    }

    return (
      <WrappedComponent
        {...(props as P)}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />
    )
  }

  WithAuthComponent.displayName =
    \`withAuth(\${WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'})\`

  return WithAuthComponent
}

// Usage
interface DashboardProps extends WithAuthProps {
  data: string[]
}

function Dashboard({ userName, data }: DashboardProps) {
  return <div>Welcome {userName}. Items: {data.length}</div>
}

const ProtectedDashboard = withAuth(Dashboard)`,
        explanation: 'The HOC checks authentication and renders a fallback or passes auth data as injected props to the wrapped component',
      },
      {
        title: 'withLoading HOC',
        code: `import { type ComponentType } from 'react'

interface WithLoadingProps {
  isLoading: boolean
}

function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  function WithLoadingComponent(
    props: P & WithLoadingProps
  ) {
    const { isLoading, ...rest } = props as WithLoadingProps & Record<string, unknown>
    if (isLoading) return <div>Loading...</div>
    return <WrappedComponent {...(rest as P)} />
  }

  WithLoadingComponent.displayName =
    \`withLoading(\${WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'})\`

  return WithLoadingComponent
}

interface UserListProps {
  users: string[]
}

function UserList({ users }: UserListProps) {
  return <ul>{users.map((u) => <li key={u}>{u}</li>)}</ul>
}

const UserListWithLoading = withLoading(UserList)
// <UserListWithLoading isLoading={true} users={[]} />`,
        explanation: 'The HOC conditionally renders a loading state or the wrapped component based on the isLoading prop',
      },
    ],
    commonMistakes: [
      'Applying HOCs inside render which creates a new component every render and destroys state',
      'Not setting displayName, making debugging in React DevTools difficult',
      'Stacking many HOCs that create deeply nested wrapper components in the tree',
    ],
    interviewTips: [
      'Compare HOCs to hooks: hooks are simpler, compose better, and do not add wrapper elements',
      'Know real-world examples like Redux connect() or React Router withRouter()',
      'Explain the problems HOCs create: wrapper hell, prop collisions, and difficult typing',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 9,
    prerequisites: ['components-props'],
    nextConcepts: ['custom-hooks'],
  },
  {
    id: 'error-boundaries',
    title: 'Error Boundaries',
    category: 'patterns',
    difficulty: 'intermediate',
    description: 'Error boundaries are React components that catch JavaScript errors in their child component tree during rendering, in lifecycle methods, and in constructors, then display a fallback UI. They prevent a single component crash from taking down the entire application.',
    shortDescription: 'Catching render errors with fallback UI',
    keyPoints: [
      'Implemented as class components using getDerivedStateFromError and componentDidCatch',
      'Catch errors during rendering, lifecycle methods, and constructors',
      'Do NOT catch errors in event handlers, async code, or SSR',
      'Place boundaries strategically: route-level, feature-level, or widget-level',
      'componentDidCatch receives error info including the component stack trace',
      'Cannot be implemented as functional components (no hook equivalent yet)',
    ],
    examples: [
      {
        title: 'Error Boundary Component',
        code: `import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// Usage: isolate crash zones
function App() {
  return (
    <ErrorBoundary fallback={<p>App crashed. Please refresh.</p>}>
      <Header />
      <ErrorBoundary fallback={<p>Widget failed to load.</p>}>
        <UnstableWidget />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  )
}`,
        explanation: 'Nested boundaries let you isolate failures: a widget crash shows a local fallback without taking down the header or footer',
      },
      {
        title: 'Resettable Error Boundary',
        code: `import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ResettableErrorBoundaryProps {
  children: ReactNode
  resetKey: string | number
}

interface ResettableErrorBoundaryState {
  hasError: boolean
}

class ResettableErrorBoundary extends Component<
  ResettableErrorBoundaryProps,
  ResettableErrorBoundaryState
> {
  state: ResettableErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ResettableErrorBoundaryState {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: ResettableErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <button onClick={() => this.setState({ hasError: false })}>Retry</button>
    }
    return this.props.children
  }
}`,
        explanation: 'A resetKey prop lets the boundary recover when data changes, and a retry button lets users attempt recovery manually',
      },
    ],
    commonMistakes: [
      'Expecting error boundaries to catch errors in event handlers or async code',
      'Placing a single boundary at the root instead of granular boundaries around risky features',
      'Not logging errors to an external service in componentDidCatch',
    ],
    interviewTips: [
      'Know exactly what error boundaries catch and what they do not',
      'Explain the strategy of multiple boundaries at different granularity levels',
      'Discuss how to handle errors in event handlers with try-catch and local state',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 8,
    prerequisites: ['components-props', 'component-lifecycle'],
    nextConcepts: ['suspense'],
  },
  {
    id: 'context-patterns',
    title: 'Context Patterns',
    category: 'patterns',
    difficulty: 'advanced',
    description: 'Context patterns go beyond basic useContext to solve real-world problems: avoiding unnecessary re-renders, composing multiple providers, separating read and write contexts, and building type-safe context with custom hooks. These patterns form the foundation of scalable React state architecture.',
    shortDescription: 'Advanced context composition and optimization',
    keyPoints: [
      'Split state and dispatch into separate contexts to avoid re-renders on dispatch-only consumers',
      'Compose providers with a single wrapper to avoid provider nesting',
      'Custom hooks with null checks provide type-safe context access',
      'Context selectors (via useSyncExternalStore) prevent re-renders from unrelated changes',
      'Module-level context factories create reusable context+provider+hook bundles',
      'Context is best for low-frequency state like theme, auth, and locale',
    ],
    examples: [
      {
        title: 'Split State and Dispatch Contexts',
        code: `import { createContext, useContext, useReducer, type ReactNode } from 'react'

interface AppState {
  user: string | null
  theme: 'light' | 'dark'
}

type AppAction =
  | { type: 'LOGIN'; user: string }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }

const StateContext = createContext<AppState | null>(null)
const DispatchContext = createContext<React.Dispatch<AppAction> | null>(null)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.user }
    case 'LOGOUT': return { ...state, user: null }
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }
  }
}

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, { user: null, theme: 'light' })
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function useAppState(): AppState {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('useAppState must be within AppProvider')
  return ctx
}

function useAppDispatch(): React.Dispatch<AppAction> {
  const ctx = useContext(DispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be within AppProvider')
  return ctx
}

// LogoutButton only needs dispatch — does not re-render when state changes
function LogoutButton() {
  const dispatch = useAppDispatch()
  return <button onClick={() => dispatch({ type: 'LOGOUT' })}>Logout</button>
}`,
        explanation: 'Separating state and dispatch contexts means components that only dispatch actions never re-render when the state changes',
      },
      {
        title: 'Composing Multiple Providers',
        code: `import { type ReactNode } from 'react'

function ComposeProviders({
  providers,
  children,
}: {
  providers: Array<React.ComponentType<{ children: ReactNode }>>
  children: ReactNode
}) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  )
}

function App() {
  return (
    <ComposeProviders
      providers={[ThemeProvider, AuthProvider, NotificationProvider]}
    >
      <MainContent />
    </ComposeProviders>
  )
}`,
        explanation: 'A provider compositor flattens deeply nested providers into a clean, readable array',
      },
    ],
    commonMistakes: [
      'Putting all app state into a single context causing every consumer to re-render on any change',
      'Not memoizing context values, creating new object references on every provider render',
      'Using context for high-frequency state like animations or scroll position',
    ],
    interviewTips: [
      'Explain the split state/dispatch pattern and why it reduces unnecessary re-renders',
      'Discuss when to reach for a library like Zustand over raw context',
      'Know the tradeoffs: context is built-in but lacks selectors and middleware',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 10,
    prerequisites: ['use-context', 'use-reducer'],
    nextConcepts: ['compound-components'],
  },
  {
    id: 'portals',
    title: 'Portals',
    category: 'patterns',
    difficulty: 'advanced',
    description: 'Portals render children into a DOM node outside the parent component\'s DOM hierarchy using createPortal. They are essential for modals, tooltips, and dropdowns that must visually escape overflow or z-index stacking contexts while maintaining React tree behavior like event bubbling and context access.',
    shortDescription: 'Rendering outside the parent DOM hierarchy',
    keyPoints: [
      'createPortal(children, domNode) renders into any DOM node',
      'Portal children escape overflow:hidden and z-index stacking contexts',
      'Events still bubble through the React tree, not the DOM tree',
      'Context is still accessible from the React tree position',
      'Common for modals, tooltips, toasts, and dropdown menus',
      'The target DOM node must exist before the portal renders',
    ],
    examples: [
      {
        title: 'Modal Portal',
        code: `import { createPortal } from 'react-dom'
import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

function Modal({ children, isOpen, onClose }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
      }}
    >
      <div>{children}</div>
    </div>,
    document.body
  )
}

function App() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Modal Title</h2>
        <p>This escapes overflow:hidden</p>
      </Modal>
    </div>
  )
}`,
        explanation: 'The modal renders into document.body via a portal, escaping any overflow or stacking context from its parent hierarchy',
      },
    ],
    commonMistakes: [
      'Forgetting that the portal target DOM node must exist before rendering',
      'Not handling keyboard events like Escape for accessibility',
      'Assuming portal events follow the DOM hierarchy instead of the React tree',
    ],
    interviewTips: [
      'Explain that events bubble through the React tree, not the DOM tree, for portals',
      'Know the use cases: modals, tooltips, toasts, anything that needs to escape stacking contexts',
      'Discuss accessibility requirements for portal-based modals like focus trapping',
    ],
    interviewFrequency: 'low',
    estimatedReadTime: 7,
    prerequisites: ['jsx-rendering', 'use-effect'],
    nextConcepts: ['error-boundaries'],
  },

  // ==========================================================================
  // PERFORMANCE
  // ==========================================================================
  {
    id: 'react-memo',
    title: 'React.memo & Shallow Comparison',
    category: 'react-performance',
    difficulty: 'advanced',
    description: 'React.memo is a higher-order component that memoizes a functional component, skipping re-renders when props have not changed. It uses shallow comparison by default and can accept a custom comparator. It is the primary tool for preventing unnecessary re-renders in child components.',
    shortDescription: 'Skipping re-renders when props are unchanged',
    keyPoints: [
      'Wraps a component to skip re-render when props are shallowly equal',
      'Shallow comparison: checks top-level property references, not deep equality',
      'Must be paired with useCallback/useMemo for object and function props',
      'Custom comparator function can override the default shallow comparison',
      'Not useful if the component re-renders due to its own state or context changes',
      'Has overhead from the comparison, so only use for components that re-render often with the same props',
    ],
    examples: [
      {
        title: 'Memoizing an Expensive Component',
        code: `import { memo, useState, useCallback } from 'react'

interface DataGridProps {
  rows: Array<{ id: string; values: number[] }>
  onRowClick: (id: string) => void
}

const DataGrid = memo(function DataGrid({ rows, onRowClick }: DataGridProps) {
  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row.id)}>
            {row.values.map((v, i) => <td key={i}>{v}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
})

function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rows] = useState(() => generateRows())

  const handleRowClick = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  return (
    <div>
      <p>Selected: {selectedId}</p>
      {/* DataGrid skips re-render when selectedId changes */}
      <DataGrid rows={rows} onRowClick={handleRowClick} />
    </div>
  )
}

function generateRows() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    values: [i, i * 2, i * 3],
  }))
}`,
        explanation: 'React.memo plus useCallback ensures DataGrid only re-renders when rows or onRowClick actually change, not when selectedId changes',
      },
      {
        title: 'Custom Comparator',
        code: `import { memo } from 'react'

interface ChartProps {
  data: number[]
  width: number
  height: number
  label: string
}

const Chart = memo(
  function Chart({ data, width, height, label }: ChartProps) {
    return <canvas width={width} height={height} data-label={label} />
  },
  (prevProps, nextProps) => {
    // Only re-render if data or dimensions change, ignore label
    return (
      prevProps.data === nextProps.data &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height
    )
  }
)`,
        explanation: 'A custom comparator lets you control exactly which prop changes should trigger a re-render, ignoring irrelevant props',
      },
    ],
    commonMistakes: [
      'Wrapping every component in memo without profiling to see if it actually helps',
      'Passing new object or function references on every render which defeats memoization',
      'Using memo on components that almost always receive different props',
    ],
    interviewTips: [
      'Explain that memo is an optimization and should be guided by profiling',
      'Know the full chain: memo + useCallback + useMemo work together',
      'Discuss when the React Compiler will make manual memoization unnecessary',
    ],
    interviewFrequency: 'high',
    estimatedReadTime: 8,
    prerequisites: ['rerender-triggers', 'use-callback'],
    nextConcepts: ['code-splitting', 'react-performance'],
  },
  {
    id: 'code-splitting',
    title: 'Code Splitting & Lazy Loading',
    category: 'react-performance',
    difficulty: 'advanced',
    description: 'Code splitting breaks your application bundle into smaller chunks loaded on demand, reducing the initial JavaScript download. React.lazy with dynamic import() creates lazy-loaded components, and Suspense provides the loading fallback. This is critical for large applications to maintain fast initial load times.',
    shortDescription: 'Loading code on demand to reduce bundle size',
    keyPoints: [
      'React.lazy accepts a function returning a dynamic import() promise',
      'The bundler automatically creates a separate chunk for the lazy component',
      'Suspense wraps lazy components and displays a fallback during loading',
      'Route-level splitting is the highest-impact optimization',
      'React.lazy only supports default exports; use re-export for named exports',
      'Preloading chunks on hover or route prefetch improves perceived performance',
    ],
    examples: [
      {
        title: 'Route-Level Code Splitting',
        code: `import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))
const Analytics = lazy(() => import('./Analytics'))

function LoadingSpinner() {
  return <div>Loading...</div>
}

function App({ currentRoute }: { currentRoute: string }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {currentRoute === 'dashboard' && <Dashboard />}
      {currentRoute === 'settings' && <Settings />}
      {currentRoute === 'analytics' && <Analytics />}
    </Suspense>
  )
}`,
        explanation: 'Each route component is a separate chunk that loads only when that route is visited, keeping the initial bundle small',
      },
      {
        title: 'Named Export and Preloading',
        code: `import { lazy, Suspense, useState } from 'react'

// Lazy load named export by re-exporting as default
const Chart = lazy(() =>
  import('./Charts').then((mod) => ({ default: mod.PieChart }))
)

// Preload on hover for instant navigation
const preloadSettings = () => import('./Settings')

function Nav() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button
        onMouseEnter={preloadSettings}
        onClick={() => { /* navigate to settings */ }}
      >
        Settings
      </button>

      <button onClick={() => setShowChart(true)}>Show Chart</button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart />
        </Suspense>
      )}
    </div>
  )
}`,
        explanation: 'Preloading on hover starts the download before the user clicks, making the transition feel instant',
      },
    ],
    commonMistakes: [
      'Not wrapping lazy components in a Suspense boundary causing a runtime error',
      'Splitting too aggressively, creating many tiny chunks that hurt performance with HTTP overhead',
      'Not handling chunk load failures with an error boundary',
    ],
    interviewTips: [
      'Explain route-level vs component-level splitting and when each is appropriate',
      'Know how to handle load failures with error boundaries for lazy components',
      'Discuss prefetching strategies to improve perceived performance',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 8,
    prerequisites: ['components-props'],
    nextConcepts: ['suspense'],
  },
  {
    id: 'suspense',
    title: 'Suspense & Data Loading',
    category: 'react-performance',
    difficulty: 'advanced',
    description: 'Suspense is a React component that displays a fallback while its children are loading. Originally for code splitting with React.lazy, Suspense now supports data fetching in React 18+ through frameworks like Next.js. It provides a declarative way to handle async loading states without manual isLoading flags.',
    shortDescription: 'Declarative loading states for async operations',
    keyPoints: [
      'Suspense shows a fallback prop while children are suspended',
      'Works with React.lazy for code splitting',
      'Works with data fetching in frameworks like Next.js via Server Components',
      'Eliminates manual loading state management for supported data sources',
      'Nested Suspense boundaries control loading granularity',
      'SuspenseList (experimental) coordinates reveal order of multiple suspended items',
    ],
    examples: [
      {
        title: 'Nested Suspense Boundaries',
        code: `import { Suspense, lazy } from 'react'

const UserProfile = lazy(() => import('./UserProfile'))
const UserPosts = lazy(() => import('./UserPosts'))
const Sidebar = lazy(() => import('./Sidebar'))

function UserPage() {
  return (
    <div>
      {/* Outer boundary: entire page skeleton */}
      <Suspense fallback={<PageSkeleton />}>
        <UserProfile />

        {/* Inner boundary: posts load independently */}
        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts />
        </Suspense>

        {/* Another independent boundary */}
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
      </Suspense>
    </div>
  )
}

function PageSkeleton() {
  return <div>Loading page...</div>
}

function PostsSkeleton() {
  return <div>Loading posts...</div>
}

function SidebarSkeleton() {
  return <div>Loading sidebar...</div>
}`,
        explanation: 'Each Suspense boundary independently shows its fallback, letting the profile load and display while posts and sidebar are still loading',
      },
      {
        title: 'Suspense with Server Components (Next.js)',
        code: `import { Suspense } from 'react'

// Server Component that fetches data
async function UserData({ userId }: { userId: string }) {
  const user = await fetch(\`/api/users/\${userId}\`).then(
    (r) => r.json() as Promise<{ name: string; bio: string }>
  )

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  )
}

// Parent wraps the async component in Suspense
function UserPage({ userId }: { userId: string }) {
  return (
    <div>
      <h1>User Profile</h1>
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserData userId={userId} />
      </Suspense>
    </div>
  )
}`,
        explanation: 'In the Server Components model, async components suspend automatically while awaiting data, and Suspense provides the loading UI',
      },
    ],
    commonMistakes: [
      'Placing the Suspense boundary too high, showing a single spinner for the entire page',
      'Not providing meaningful skeleton fallbacks that match the content layout',
      'Expecting Suspense to work with arbitrary promises without framework support',
    ],
    interviewTips: [
      'Explain the evolution: Suspense for code splitting first, then for data fetching',
      'Discuss how Suspense eliminates waterfall loading with parallel data fetching',
      'Know that Suspense for data fetching requires framework integration, not raw fetch',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 9,
    prerequisites: ['code-splitting', 'error-boundaries'],
    nextConcepts: ['concurrent-features', 'server-components'],
  },
  {
    id: 'concurrent-features',
    title: 'Concurrent Features',
    category: 'react-performance',
    difficulty: 'advanced',
    description: 'React 18 introduced concurrent rendering, allowing React to prepare multiple versions of the UI simultaneously and interrupt rendering to handle more urgent updates. useTransition and useDeferredValue let you mark updates as non-urgent, keeping the UI responsive during expensive operations.',
    shortDescription: 'Non-blocking UI updates with priority scheduling',
    keyPoints: [
      'Concurrent rendering lets React pause, resume, and abandon renders',
      'useTransition marks state updates as non-urgent transitions',
      'useDeferredValue defers re-rendering with a stale value until urgent work completes',
      'Transitions keep the current UI visible while the next one prepares in the background',
      'isPending from useTransition indicates when a transition is in progress',
      'Automatic batching in React 18 groups all state updates, not just event handlers',
    ],
    examples: [
      {
        title: 'useTransition for Expensive Updates',
        code: `import { useState, useTransition } from 'react'

function SearchWithTransition() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Urgent: update the input immediately
    setQuery(value)

    // Non-urgent: update the filtered list in the background
    startTransition(() => {
      const filtered = heavyFilter(value)
      setResults(filtered)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating...</span>}
      <ul>
        {results.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  )
}

function heavyFilter(query: string): string[] {
  const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`)
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  )
}`,
        explanation: 'The input stays responsive because the expensive filter is wrapped in startTransition, which React interrupts for urgent input updates',
      },
      {
        title: 'useDeferredValue for Derived Content',
        code: `import { useState, useDeferredValue, memo } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  )
}

const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  const results = heavySearch(query)
  return (
    <ul>
      {results.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  )
})

function heavySearch(query: string): string[] {
  const items = Array.from({ length: 5000 }, (_, i) => \`Result \${i}\`)
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  )
}`,
        explanation: 'useDeferredValue keeps showing old results while new ones compute in the background, with opacity dimming to indicate staleness',
      },
    ],
    commonMistakes: [
      'Wrapping every state update in startTransition when only expensive ones benefit',
      'Forgetting to use memo with useDeferredValue which is needed to skip re-rendering with the stale value',
      'Using transitions for time-sensitive updates like animations that need immediate feedback',
    ],
    interviewTips: [
      'Explain the difference between useTransition (wraps the setter) and useDeferredValue (wraps the value)',
      'Know that concurrent rendering is opt-in via createRoot and transitions',
      'Discuss real use cases: search filtering, tab switching, heavy list rendering',
    ],
    interviewFrequency: 'low',
    estimatedReadTime: 10,
    prerequisites: ['use-state', 'react-memo'],
    nextConcepts: ['server-components'],
  },
  {
    id: 'server-components',
    title: 'Server Components',
    category: 'react-performance',
    difficulty: 'advanced',
    description: 'React Server Components execute on the server and send rendered output to the client with zero JavaScript bundle cost. They can directly access databases, file systems, and server APIs. Combined with Client Components for interactivity, they enable a hybrid architecture that minimizes client-side JavaScript.',
    shortDescription: 'Zero-bundle components that run on the server',
    keyPoints: [
      'Server Components run only on the server with no client-side JavaScript',
      'They can directly access databases, file systems, and server-only APIs',
      'Cannot use hooks, state, effects, or browser APIs',
      'Client Components are marked with "use client" and include JavaScript in the bundle',
      'Server Components can import and render Client Components',
      'Client Components cannot import Server Components but can accept them as children',
    ],
    examples: [
      {
        title: 'Server and Client Component Composition',
        code: `// Server Component (default in Next.js App Router)
// No "use client" directive
async function ProductPage({ id }: { id: string }) {
  // Direct database access on the server
  const product = await db.products.findById(id)
  const reviews = await db.reviews.findByProduct(id)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: \${product.price}</p>

      {/* Client Component for interactivity */}
      <AddToCartButton productId={id} price={product.price} />

      {/* Server-rendered list with no client JS */}
      <ReviewList reviews={reviews} />
    </div>
  )
}

function ReviewList({ reviews }: { reviews: { id: string; text: string; rating: number }[] }) {
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.id}>
          {'★'.repeat(r.rating)} {r.text}
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'The product page and review list are Server Components with zero client JS; only AddToCartButton ships JavaScript for the click handler',
      },
      {
        title: 'Client Component with use client',
        code: `'use client'

import { useState } from 'react'

interface AddToCartButtonProps {
  productId: string
  price: number
}

function AddToCartButton({ productId, price }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAdd = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
    setAdded(true)
  }

  if (added) return <span>Added to cart!</span>

  return (
    <div>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <button onClick={handleAdd}>
        Add to Cart - \${(price * quantity).toFixed(2)}
      </button>
    </div>
  )
}

export { AddToCartButton }`,
        explanation: 'The "use client" directive marks this as a Client Component that includes JavaScript for state management and event handling',
      },
    ],
    commonMistakes: [
      'Adding "use client" to components that do not need interactivity, inflating the bundle',
      'Trying to use hooks or browser APIs in Server Components',
      'Importing Server Components into Client Components instead of passing them as children',
    ],
    interviewTips: [
      'Explain the serialization boundary between Server and Client Components',
      'Know that Server Components can render Client Components but not vice versa',
      'Discuss the bundle size benefits and the new mental model for deciding server vs client',
    ],
    interviewFrequency: 'medium',
    estimatedReadTime: 10,
    prerequisites: ['components-props', 'use-state'],
    nextConcepts: [],
  },
]

export function getReactConceptById(id: string): ReactConcept | undefined {
  return reactConcepts.find((c) => c.id === id)
}

export function getReactConceptsByCategory(category: ReactConceptCategory): ReactConcept[] {
  return reactConcepts.filter((c) => c.category === category)
}

