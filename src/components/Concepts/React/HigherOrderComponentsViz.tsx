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
    id: 'the-pattern',
    label: 'The Pattern',
    steps: [
      {
        title: 'What Is a Higher-Order Component?',
        code: `const EnhancedComponent = withFeature(BaseComponent)`,
        explanation: 'A Higher-Order Component (HOC) is a function that takes a component and returns a new component with additional behavior. It does not modify the original; it wraps it. The naming convention is "with" followed by the feature name.',
      },
      {
        title: 'Anatomy of an HOC',
        code: `function withLogger(WrappedComponent) {
  return function WithLogger(props) {
    useEffect(() => {
      console.log('Rendered:', WrappedComponent.name)
    })

    return <WrappedComponent {...props} />
  }
}`,
        explanation: 'An HOC is a plain function. It receives a component, defines a new component that adds behavior (here, logging), then renders the original with all its props passed through. The wrapper is transparent to the consumer.',
      },
      {
        title: 'Using the HOC',
        code: `function UserProfile({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  )
}

const LoggedUserProfile = withLogger(UserProfile)

// Usage: <LoggedUserProfile name="Alice" email="..." />`,
        explanation: 'You call the HOC at module level to create an enhanced version. The result is a regular component that can be used anywhere. LoggedUserProfile behaves like UserProfile but also logs when it renders.',
        output: ['Rendered: UserProfile'],
      },
    ],
  },
  {
    id: 'with-auth',
    label: 'withAuth Example',
    steps: [
      {
        title: 'The Authorization Problem',
        code: `function AdminDashboard() {
  const { user } = useAuth()
  if (!user) return <Redirect to="/login" />
  if (!user.isAdmin) return <Forbidden />
  return <div>Dashboard content</div>
}

function Settings() {
  const { user } = useAuth()
  if (!user) return <Redirect to="/login" />
  return <div>Settings content</div>
}`,
        explanation: 'Multiple components repeat the same auth check logic. Each one fetches the user, checks authentication, handles the redirect. This duplication is error-prone and tedious to maintain.',
      },
      {
        title: 'Building withAuth',
        code: `function withAuth(WrappedComponent, options = {}) {
  return function WithAuth(props) {
    const { user, loading } = useAuth()

    if (loading) return <Spinner />
    if (!user) return <Redirect to="/login" />
    if (options.adminOnly && !user.isAdmin) {
      return <Forbidden />
    }

    return <WrappedComponent {...props} user={user} />
  }
}`,
        explanation: 'withAuth encapsulates all auth logic in one place. It handles loading, redirect, and optional admin checks. It also injects the user as a prop so the wrapped component always has access to it.',
      },
      {
        title: 'Clean Protected Components',
        code: `function AdminDashboard({ user }) {
  return <div>Welcome, {user.name}</div>
}

function Settings({ user }) {
  return <div>{user.name} settings</div>
}

const ProtectedDashboard = withAuth(
  AdminDashboard, { adminOnly: true }
)
const ProtectedSettings = withAuth(Settings)`,
        explanation: 'Now each component only handles its own rendering. The auth concern is fully extracted. Adding protection to a new page is a one-liner. The user prop is guaranteed to exist inside the wrapped component.',
      },
    ],
  },
  {
    id: 'prop-forwarding',
    label: 'Prop Forwarding',
    steps: [
      {
        title: 'Spreading Props Through',
        code: `function withTheme(WrappedComponent) {
  return function WithTheme(props) {
    const theme = useTheme()
    return <WrappedComponent {...props} theme={theme} />
  }
}`,
        explanation: 'The spread operator {...props} forwards all incoming props to the wrapped component. Without this, the HOC would swallow props and break the component. Always spread props in your HOC wrapper.',
      },
      {
        title: 'Forwarding Refs',
        code: `function withTheme(WrappedComponent) {
  const WithTheme = forwardRef((props, ref) => {
    const theme = useTheme()
    return (
      <WrappedComponent
        {...props}
        ref={ref}
        theme={theme}
      />
    )
  })

  WithTheme.displayName =
    \`WithTheme(\${WrappedComponent.displayName
      || WrappedComponent.name})\`

  return WithTheme
}`,
        explanation: 'Refs do not pass through regular components because ref is not a prop. You must use React.forwardRef to forward the ref. Setting displayName helps with debugging in React DevTools.',
      },
      {
        title: 'TypeScript Props',
        code: `interface WithThemeProps {
  theme: Theme
}

function withTheme<P extends WithThemeProps>(
  Component: ComponentType<P>
) {
  type OuterProps = Omit<P, keyof WithThemeProps>

  const Wrapped = (props: OuterProps) => {
    const theme = useTheme()
    return (
      <Component
        {...(props as P)}
        theme={theme}
      />
    )
  }
  return Wrapped
}`,
        explanation: 'TypeScript HOCs use generics to preserve type safety. The Omit type removes injected props (theme) from the external API. Consumers do not need to pass theme, but the wrapped component receives it.',
        output: ['<ThemedButton label="Save" />', '// theme is injected, not required from consumer'],
      },
    ],
  },
  {
    id: 'pitfalls',
    label: 'Pitfalls',
    steps: [
      {
        title: 'Lost displayName',
        code: `function withData(Component) {
  function Wrapper(props) {
    return <Component {...props} />
  }
  return Wrapper
}

const Enhanced = withData(UserList)
// React DevTools shows: <Wrapper>
// Should show: <WithData(UserList)>`,
        explanation: 'Without setting displayName, React DevTools shows the wrapper function name instead of something meaningful. Always set displayName on the returned component to indicate which HOC was applied and to which component.',
      },
      {
        title: 'Never Apply HOCs Inside Render',
        code: `function App() {
  // BUG: creates a new component every render
  const Enhanced = withLogger(MyComponent)
  return <Enhanced />
}

// CORRECT: apply at module level
const Enhanced = withLogger(MyComponent)

function App() {
  return <Enhanced />
}`,
        explanation: 'Calling an HOC inside render creates a new component type on every render. React unmounts and remounts it each time, destroying all state and DOM. Always apply HOCs outside the component body at module level.',
      },
      {
        title: 'Prop Name Collisions',
        code: `const Enhanced = withAuth(
  withTheme(
    withLogger(MyComponent)
  )
)

// If withAuth injects { data: userData }
// and withTheme injects { data: themeData }
// themeData overwrites userData!`,
        explanation: 'When stacking multiple HOCs, injected prop names can collide. Each HOC spreads its own props, and later ones overwrite earlier ones. Use unique prop names or namespace injected props to avoid this.',
        output: ['withAuth: { user: ... }', 'withTheme: { theme: ... }', 'Unique names prevent collisions'],
      },
      {
        title: 'Hooks Are Usually Better',
        code: `// HOC approach (wrapper nesting)
const Component = withAuth(
  withTheme(
    withLogger(BaseComponent)
  )
)

// Hook approach (flat composition)
function Component() {
  const user = useAuth()
  const theme = useTheme()
  useLogger('Component')
  return <div>...</div>
}`,
        explanation: 'Custom hooks solve the same problems without wrapper components, prop collisions, or displayName issues. Hooks compose flat rather than nesting. HOCs are still seen in older codebases and some libraries, but hooks are preferred for new code.',
      },
    ],
  },
]

export function HigherOrderComponentsViz(): JSX.Element {
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
