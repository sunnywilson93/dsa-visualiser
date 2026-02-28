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
    id: 'class-component',
    label: 'Class Component',
    steps: [
      {
        title: 'Why Class Components?',
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>
    }
    return this.props.children
  }
}`,
        explanation: 'Error boundaries must be class components because they rely on two lifecycle methods that have no hook equivalents: getDerivedStateFromError and componentDidCatch. There is no useErrorBoundary hook in React.',
      },
      {
        title: 'getDerivedStateFromError',
        code: `static getDerivedStateFromError(error) {
  // Called during render phase
  // Must return new state
  return {
    hasError: true,
    error: error,
  }
}`,
        explanation: 'This static method is called when a descendant throws during rendering. It receives the error and must return a state update. React calls this during the render phase, so side effects are not allowed here.',
      },
      {
        title: 'componentDidCatch',
        code: `componentDidCatch(error, errorInfo) {
  // Called during commit phase
  // Side effects are allowed here

  console.error('Caught by boundary:', error)
  console.error('Component stack:', errorInfo.componentStack)

  // Send to error monitoring service
  logErrorToService(error, errorInfo)
}`,
        explanation: 'componentDidCatch runs during the commit phase after the fallback UI is rendered. It receives the error and an errorInfo object with the component stack trace. Use it for logging, analytics, or error reporting.',
        output: ['errorInfo.componentStack:', '  at BrokenComponent', '  at Dashboard', '  at ErrorBoundary', '  at App'],
      },
    ],
  },
  {
    id: 'catching-errors',
    label: 'Catching Errors',
    steps: [
      {
        title: 'Errors That ARE Caught',
        code: `function BrokenComponent() {
  // Throw during render -> CAUGHT
  throw new Error('Render failed!')
}

class BrokenClass extends React.Component {
  constructor(props) {
    super(props)
    // Throw in constructor -> CAUGHT
    throw new Error('Constructor failed!')
  }

  componentDidMount() {
    // Throw in lifecycle -> CAUGHT
    throw new Error('Lifecycle failed!')
  }
}`,
        explanation: 'Error boundaries catch errors thrown during rendering, in lifecycle methods, and in constructors of the entire tree below them. This covers the most common sources of component errors.',
        output: ['Caught: render errors', 'Caught: lifecycle errors', 'Caught: constructor errors'],
      },
      {
        title: 'Errors That Are NOT Caught',
        code: `function MyComponent() {
  const handleClick = () => {
    // Event handler -> NOT caught
    throw new Error('Click failed!')
  }

  useEffect(() => {
    // Async code -> NOT caught
    setTimeout(() => {
      throw new Error('Timeout failed!')
    }, 1000)

    fetch('/api').catch(err => {
      // Must handle manually
    })
  }, [])

  return <button onClick={handleClick}>Click</button>
}`,
        explanation: 'Event handlers, async code (setTimeout, Promises, fetch), and server-side rendering errors are NOT caught by error boundaries. For these, use try/catch directly or state-based error handling.',
        output: ['NOT caught: event handlers', 'NOT caught: async code (setTimeout, fetch)', 'NOT caught: server-side rendering'],
      },
      {
        title: 'Placement Matters',
        code: `<App>
  <ErrorBoundary>
    <Header />
  </ErrorBoundary>

  <ErrorBoundary>
    <Sidebar />
    <MainContent />
  </ErrorBoundary>

  <ErrorBoundary>
    <Footer />
  </ErrorBoundary>
</App>`,
        explanation: 'Place error boundaries strategically. If Header crashes, only it shows a fallback while Sidebar, MainContent, and Footer keep working. Granular boundaries prevent one broken component from taking down the entire page.',
      },
    ],
  },
  {
    id: 'fallback-ui',
    label: 'Fallback UI',
    steps: [
      {
        title: 'Simple Fallback',
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Oops! Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}`,
        explanation: 'The simplest fallback is a static message. When hasError is true, the boundary renders the fallback instead of its children. This prevents the user from seeing a blank screen or a cryptic error.',
      },
      {
        title: 'Customizable Fallback Prop',
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
        ? this.props.fallback(this.state.error)
        : <p>Something went wrong.</p>
    }
    return this.props.children
  }
}

// Usage:
<ErrorBoundary
  fallback={(err) => <Alert message={err.message} />}
>
  <Dashboard />
</ErrorBoundary>`,
        explanation: 'Accepting a fallback prop or render function makes the boundary reusable. Different parts of the app can show different error UIs. The fallback receives the error so it can display relevant information.',
      },
      {
        title: 'Error Details in Development',
        code: `function ErrorFallback({ error, resetError }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      {process.env.NODE_ENV === 'development' && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {error.message}
          {error.stack}
        </pre>
      )}
      <button onClick={resetError}>
        Try again
      </button>
    </div>
  )
}`,
        explanation: 'In development, showing the full error message and stack trace speeds up debugging. In production, show a user-friendly message. The resetError function lets users attempt recovery without a full page reload.',
      },
    ],
  },
  {
    id: 'recovery',
    label: 'Recovery Patterns',
    steps: [
      {
        title: 'Reset via Key Prop',
        code: `function App() {
  const [key, setKey] = useState(0)

  return (
    <ErrorBoundary
      key={key}
      onReset={() => setKey(k => k + 1)}
      fallback={({ reset }) => (
        <div>
          <p>Something broke!</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <Dashboard />
    </ErrorBoundary>
  )
}`,
        explanation: 'Changing the key prop forces React to unmount and remount the ErrorBoundary, clearing the error state. When the user clicks Retry, the key increments, giving the children a fresh start.',
      },
      {
        title: 'Reset with State Method',
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  resetError = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        reset: this.resetError,
      })
    }
    return this.props.children
  }
}`,
        explanation: 'The boundary can expose a reset method that clears the error state internally. When called, React re-renders and attempts to render the children again. If the underlying cause is fixed, the component recovers.',
      },
      {
        title: 'Combining with Suspense',
        code: `<ErrorBoundary
  fallback={<ErrorMessage />}
>
  <Suspense fallback={<Spinner />}>
    <AsyncDashboard />
  </Suspense>
</ErrorBoundary>`,
        explanation: 'ErrorBoundary and Suspense work together. Suspense handles the loading state while data is being fetched. If fetching fails and throws, the error boundary above catches it and shows the error fallback.',
        output: ['Loading... -> Suspense fallback', 'Success -> AsyncDashboard renders', 'Failure -> ErrorBoundary fallback'],
      },
    ],
  },
]

export function ErrorBoundariesViz(): JSX.Element {
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
