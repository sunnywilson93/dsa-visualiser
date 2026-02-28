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
    id: 'ternary',
    label: 'Ternary Operator',
    steps: [
      {
        title: 'Basic Ternary',
        code: `function Greeting({ isLoggedIn }) {
  return (
    <h1>
      {isLoggedIn ? 'Welcome back!' : 'Please sign in.'}
    </h1>
  )
}`,
        explanation: 'The ternary operator (condition ? a : b) is the most common way to conditionally render in JSX. It works inline because it is an expression, not a statement.',
        output: ['isLoggedIn=true  -> "Welcome back!"', 'isLoggedIn=false -> "Please sign in."'],
      },
      {
        title: 'Rendering Different Elements',
        code: `function Dashboard({ user }) {
  return (
    <div>
      {user ? (
        <div>
          <h1>Hello, {user.name}</h1>
          <LogoutButton />
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}`,
        explanation: 'Ternaries can render entirely different component trees for each branch. Wrap multi-line JSX in parentheses for readability. Each branch can contain any valid JSX.',
      },
      {
        title: 'Ternary in Attributes',
        code: `function StatusBadge({ isActive }) {
  return (
    <span
      className={isActive ? 'badge-green' : 'badge-gray'}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}`,
        explanation: 'Ternaries work in prop positions too. Use them to toggle className, style, disabled, or any other prop based on state. This keeps your JSX declarative and readable.',
      },
      {
        title: 'Nested Ternaries (Use Sparingly)',
        code: `function StatusMessage({ status }) {
  return (
    <p>
      {status === 'loading'
        ? 'Loading...'
        : status === 'error'
          ? 'Something went wrong'
          : 'Data loaded successfully'}
    </p>
  )
}`,
        explanation: 'Nested ternaries work but become hard to read quickly. If you have more than two conditions, consider extracting the logic into a variable or using early returns instead.',
      },
    ],
  },
  {
    id: 'logical-and',
    label: 'Logical AND (&&)',
    steps: [
      {
        title: 'Show or Hide Elements',
        code: `function Mailbox({ unreadCount }) {
  return (
    <div>
      <h1>Messages</h1>
      {unreadCount > 0 && (
        <span>You have {unreadCount} unread messages</span>
      )}
    </div>
  )
}`,
        explanation: 'The && pattern renders the right side only when the left side is truthy. When false, React renders nothing. Use this when there is no "else" case — you either show something or nothing.',
        output: ['unreadCount=5 -> Shows badge', 'unreadCount=0 -> Renders nothing'],
      },
      {
        title: 'The Zero Gotcha',
        code: `function Items({ items }) {
  return (
    <div>
      {items.length && <ItemList items={items} />}
    </div>
  )
}`,
        explanation: 'When items is an empty array, items.length is 0. JavaScript short-circuits and returns 0, which React renders as the text "0" on screen. This is a common bug that surprises developers.',
        output: ['items=[]  -> Renders "0" on screen!', 'items=[a] -> Renders <ItemList />'],
      },
      {
        title: 'Fixing the Zero Gotcha',
        code: `function Items({ items }) {
  return (
    <div>
      {items.length > 0 && <ItemList items={items} />}
    </div>
  )
}

// Or use Boolean():
{Boolean(items.length) && <ItemList items={items} />}

// Or use a ternary:
{items.length ? <ItemList items={items} /> : null}`,
        explanation: 'Always ensure the left side of && evaluates to a boolean, not a number. Compare explicitly (> 0) or convert with Boolean(). This prevents React from rendering "0" as text.',
        output: ['items=[]  -> Renders nothing (correct!)', 'items=[a] -> Renders <ItemList />'],
      },
      {
        title: 'Chaining && for Multiple Conditions',
        code: `function AdminPanel({ user }) {
  return (
    <div>
      {user && user.isAdmin && (
        <div>
          <h2>Admin Controls</h2>
          <DeleteButton />
          <BanUserButton />
        </div>
      )}
    </div>
  )
}`,
        explanation: 'You can chain multiple && conditions. All must be truthy for the element to render. Consider optional chaining (user?.isAdmin) as a cleaner alternative for property access.',
      },
    ],
  },
  {
    id: 'if-else',
    label: 'if/else Pattern',
    steps: [
      {
        title: 'Early Return Pattern',
        code: `function UserProfile({ user, isLoading }) {
  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    return <p>User not found</p>
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}`,
        explanation: 'Early returns handle edge cases at the top of your component. Each condition returns a completely different UI. This is clean, readable, and avoids deeply nested ternaries.',
      },
      {
        title: 'Variable Assignment Pattern',
        code: `function Notification({ type, message }) {
  let icon
  if (type === 'success') {
    icon = <CheckIcon />
  } else if (type === 'error') {
    icon = <ErrorIcon />
  } else {
    icon = <InfoIcon />
  }

  return (
    <div className={\`notification \${type}\`}>
      {icon}
      <span>{message}</span>
    </div>
  )
}`,
        explanation: 'Assign JSX to a variable before the return statement. This works well when only part of the UI changes based on conditions. The main structure stays in a single return.',
      },
      {
        title: 'IIFE Pattern (Less Common)',
        code: `function StatusBar({ status }) {
  return (
    <div>
      {(() => {
        if (status === 'loading') return <Spinner />
        if (status === 'error') return <ErrorMsg />
        return <Content />
      })()}
    </div>
  )
}`,
        explanation: 'An Immediately Invoked Function Expression (IIFE) lets you use if/else directly inside JSX. This works but is uncommon — prefer early returns or variable assignment for better readability.',
      },
    ],
  },
  {
    id: 'switch-map',
    label: 'Switch/Map Pattern',
    steps: [
      {
        title: 'Switch Statement',
        code: `function Icon({ name }) {
  switch (name) {
    case 'home':
      return <HomeIcon />
    case 'settings':
      return <SettingsIcon />
    case 'profile':
      return <ProfileIcon />
    default:
      return <DefaultIcon />
  }
}`,
        explanation: 'A switch statement in the component body works great for mapping a value to different components. Each case returns early, making the flow clear. Always include a default case.',
      },
      {
        title: 'Object Map Pattern',
        code: `const STATUS_CONFIG = {
  idle: { color: 'gray', label: 'Idle' },
  loading: { color: 'blue', label: 'Loading...' },
  success: { color: 'green', label: 'Complete' },
  error: { color: 'red', label: 'Failed' },
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={\`badge badge-\${config.color}\`}>
      {config.label}
    </span>
  )
}`,
        explanation: 'An object map replaces switch statements with a data-driven lookup. Define the mapping outside the component so it is not recreated on each render. This pattern scales well with many variants.',
      },
      {
        title: 'Component Map Pattern',
        code: `const STEP_COMPONENTS = {
  info: InfoStep,
  form: FormStep,
  review: ReviewStep,
  confirm: ConfirmStep,
}

function Wizard({ currentStep }) {
  const StepComponent = STEP_COMPONENTS[currentStep]

  if (!StepComponent) {
    return <p>Unknown step</p>
  }

  return <StepComponent />
}`,
        explanation: 'Map string keys to component references. Look up the component dynamically and render it. Always add a guard for unknown keys. This is ideal for wizards, tab panels, and routers.',
      },
      {
        title: 'Combining Patterns',
        code: `function Page({ route, user }) {
  if (!user) {
    return <LoginPage />
  }

  const PAGES = {
    dashboard: () => <Dashboard user={user} />,
    settings: () => <Settings user={user} />,
    profile: () => <Profile user={user} />,
  }

  const renderPage = PAGES[route]
  return renderPage ? renderPage() : <NotFound />
}`,
        explanation: 'Real components often combine patterns. Use early returns for guard clauses, then an object map for the main routing logic. Each pattern handles what it does best.',
      },
    ],
  },
]

export function ConditionalRenderingViz(): JSX.Element {
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
