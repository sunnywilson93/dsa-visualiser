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
    id: 'provider-pattern',
    label: 'Provider Pattern',
    steps: [
      {
        title: 'Creating a Context',
        code: `interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<
  ThemeContextValue | null
>(null)`,
        explanation: 'createContext defines a channel for passing data through the component tree. The generic type ensures consumers get proper TypeScript types. Initializing with null makes it clear when the context is used outside its provider.',
      },
      {
        title: 'Building the Provider',
        code: `function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    'dark'
  )

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}`,
        explanation: 'The Provider component wraps a subtree and supplies the context value. useMemo prevents creating a new object on every render, which would cause all consumers to re-render unnecessarily.',
      },
      {
        title: 'Custom Hook for Consuming',
        code: `function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    )
  }
  return ctx
}

function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  )
}`,
        explanation: 'Wrapping useContext in a custom hook adds a runtime check and removes the null type from the return value. Consumers call useTheme() and get a guaranteed non-null ThemeContextValue.',
        output: ['Current: dark', 'Click -> Current: light'],
      },
    ],
  },
  {
    id: 'state-dispatch',
    label: 'State + Dispatch',
    steps: [
      {
        title: 'Defining Actions and Reducer',
        code: `type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'DELETE_TODO'; id: number }

interface TodoState {
  todos: { id: number; text: string; done: boolean }[]
  nextId: number
}

function todoReducer(
  state: TodoState, action: Action
): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        nextId: state.nextId + 1,
        todos: [...state.todos, {
          id: state.nextId,
          text: action.text,
          done: false,
        }],
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id
            ? { ...t, done: !t.done }
            : t
        ),
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(
          t => t.id !== action.id
        ),
      }
  }
}`,
        explanation: 'A discriminated union of actions and a pure reducer function form the state management core. Each action type is handled explicitly with immutable updates. This is the same pattern as Redux but built with React primitives.',
      },
      {
        title: 'Provider with useReducer',
        code: `const TodoContext = createContext<{
  state: TodoState
  dispatch: React.Dispatch<Action>
} | null>(null)

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(
    todoReducer,
    { todos: [], nextId: 1 }
  )

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}`,
        explanation: 'The provider combines useReducer with context. State and dispatch are passed together so any descendant can both read state and send actions. This scales better than passing individual callbacks.',
      },
      {
        title: 'Consuming State and Dispatch',
        code: `function TodoList() {
  const { state, dispatch } = useTodos()

  return (
    <ul>
      {state.todos.map(todo => (
        <li key={todo.id}>
          <span
            onClick={() => dispatch({
              type: 'TOGGLE_TODO', id: todo.id
            })}
          >
            {todo.done ? '\u2705' : '\u2B1C'} {todo.text}
          </span>
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'Components read state to render the list and dispatch actions to modify it. TOGGLE_TODO flips the done flag. The reducer handles the immutable update and React re-renders the affected components.',
        output: ['dispatch({ type: "ADD_TODO", text: "Learn React" })', 'dispatch({ type: "TOGGLE_TODO", id: 1 })'],
      },
    ],
  },
  {
    id: 'split-contexts',
    label: 'Split Contexts',
    steps: [
      {
        title: 'The Re-render Problem',
        code: `const AppContext = createContext({
  user: null,
  theme: 'dark',
  setTheme: () => {},
  notifications: [],
  markRead: () => {},
})

function Sidebar() {
  const { theme } = useContext(AppContext)
  // Re-renders when notifications change
  // even though Sidebar only uses theme!
  return <nav className={theme}>...</nav>
}`,
        explanation: 'When all state lives in one context, any change re-renders every consumer. Sidebar only reads theme but re-renders when notifications update because the context value object changes. This is the most common context performance trap.',
      },
      {
        title: 'Split Into Separate Contexts',
        code: `const ThemeContext = createContext<ThemeValue>(null)
const UserContext = createContext<UserValue>(null)
const NotificationContext = createContext<
  NotifValue
>(null)

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  )
}`,
        explanation: 'Splitting into separate contexts means each consumer only subscribes to what it needs. When notifications change, only components using NotificationContext re-render. Theme consumers remain unaffected.',
      },
      {
        title: 'Targeted Consumption',
        code: `function Sidebar() {
  const { theme } = useTheme()
  // Only re-renders when theme changes
  return <nav className={theme}>...</nav>
}

function NotificationBell() {
  const { notifications } = useNotifications()
  // Only re-renders when notifications change
  return <span>({notifications.length})</span>
}

function UserMenu() {
  const { user } = useUser()
  const { theme } = useTheme()
  // Re-renders when user OR theme changes
  return <div className={theme}>{user.name}</div>
}`,
        explanation: 'Each component subscribes to exactly the contexts it needs. Sidebar ignores notifications and user. NotificationBell ignores theme and user. Components that need multiple contexts opt into re-renders from each.',
        output: ['Theme change: Sidebar, UserMenu re-render', 'New notification: only NotificationBell re-renders'],
      },
    ],
  },
  {
    id: 'selector-pattern',
    label: 'Selector Pattern',
    steps: [
      {
        title: 'The Derived Data Problem',
        code: `function TodoCount() {
  const { state } = useTodos()
  const activeCount = state.todos.filter(
    t => !t.done
  ).length

  // Recalculates filter on EVERY render,
  // even if todos did not change
  return <span>{activeCount} remaining</span>
}`,
        explanation: 'Computing derived data inside the component means it recalculates on every render, even from unrelated state changes. For expensive computations or large lists, this causes noticeable performance issues.',
      },
      {
        title: 'useMemo as a Selector',
        code: `function TodoCount() {
  const { state } = useTodos()

  const activeCount = useMemo(
    () => state.todos.filter(t => !t.done).length,
    [state.todos]
  )

  return <span>{activeCount} remaining</span>
}`,
        explanation: 'useMemo memoizes the derived value and only recalculates when state.todos changes. This is the simplest selector pattern. The dependency array acts as the cache key.',
      },
      {
        title: 'Extracted Selector Functions',
        code: `const selectActiveTodos = (state: TodoState) =>
  state.todos.filter(t => !t.done)

const selectTodoCount = (state: TodoState) =>
  state.todos.length

const selectActiveTodoCount = (state: TodoState) =>
  selectActiveTodos(state).length

function TodoStats() {
  const { state } = useTodos()
  const total = useMemo(
    () => selectTodoCount(state), [state]
  )
  const active = useMemo(
    () => selectActiveTodoCount(state), [state]
  )

  return <p>{active} of {total} remaining</p>
}`,
        explanation: 'Extracting selectors into standalone functions makes them reusable and testable. Multiple components can use the same selector. Selectors can compose by calling other selectors, keeping logic DRY.',
        output: ['selectActiveTodoCount(state) -> 3', 'selectTodoCount(state) -> 5', '3 of 5 remaining'],
      },
      {
        title: 'use() with Selector (React 19+)',
        code: `const TodoContext = createContext<TodoState>(
  initialState
)

function TodoStats() {
  const state = use(TodoContext)
  const active = state.todos.filter(
    t => !t.done
  ).length

  return <p>{active} remaining</p>
}`,
        explanation: 'React 19 introduces the use() hook which can read context values. While it does not add built-in selectors, it simplifies context consumption. For fine-grained subscriptions, libraries like Zustand or Jotai remain more efficient.',
      },
    ],
  },
]

export function ContextPatternsViz(): JSX.Element {
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
