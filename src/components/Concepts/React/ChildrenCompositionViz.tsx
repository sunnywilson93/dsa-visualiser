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
    id: 'children-prop',
    label: 'children Prop',
    steps: [
      {
        title: 'What Are Children?',
        code: `function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  )
}

<Card>
  <h2>Title</h2>
  <p>Some content here</p>
</Card>`,
        explanation: 'Anything placed between the opening and closing tags of a component is passed as the special "children" prop. The component decides where to render those children in its layout.',
        output: ['<div class="card"><h2>Title</h2><p>Some content here</p></div>'],
      },
      {
        title: 'Children Can Be Anything',
        code: `<Card>
  <h2>Text children</h2>
</Card>

<Card>
  {users.map(u => <UserRow key={u.id} user={u} />)}
</Card>

<Card>
  {isLoading ? <Spinner /> : <Content />}
</Card>`,
        explanation: 'Children can be text, elements, arrays from .map(), conditional expressions, or even other components. React is flexible about what you pass as children.',
      },
      {
        title: 'Typed Children in TypeScript',
        code: `import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  )
}`,
        explanation: 'Use ReactNode as the type for children — it covers strings, numbers, elements, arrays, fragments, and null. This is the most flexible and commonly used type for the children prop.',
      },
    ],
  },
  {
    id: 'composition',
    label: 'Composition vs Inheritance',
    steps: [
      {
        title: 'The Inheritance Approach (Avoid)',
        code: `// Anti-pattern: don't do this in React
class FancyButton extends Button {
  render() {
    return (
      <button className="fancy">
        {super.render()}
      </button>
    )
  }
}`,
        explanation: 'Class inheritance creates rigid hierarchies that are hard to change. If FancyButton extends Button, adding a third variation means restructuring the chain. React explicitly recommends against this.',
      },
      {
        title: 'The Composition Approach (Preferred)',
        code: `function Button({ children, variant = 'default' }) {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  )
}

<Button variant="fancy">Click me</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Learn more</Button>`,
        explanation: 'With composition, one component handles all variants through props. No inheritance hierarchy — just a single flexible component. Adding new variants means adding a prop value, not a new class.',
      },
      {
        title: 'Composing Specialized Components',
        code: `function Dialog({ children, title }) {
  return (
    <div className="overlay">
      <div className="dialog">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <Dialog title="Are you sure?">
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </Dialog>
  )
}`,
        explanation: 'Specialized components wrap generic ones, passing specific content through children and props. ConfirmDialog IS-NOT-A Dialog subclass — it USES Dialog through composition.',
      },
      {
        title: 'Why Composition Wins',
        code: `function Layout({ sidebar, content, footer }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
      <footer>{footer}</footer>
    </div>
  )
}

<Layout
  sidebar={<Nav items={links} />}
  content={<Article text={body} />}
  footer={<Copyright year={2024} />}
/>`,
        explanation: 'Composition lets you plug any component into any slot. Each piece is independent, testable, and replaceable. This flexibility is impossible to achieve with inheritance.',
      },
    ],
  },
  {
    id: 'slots',
    label: 'Slots Pattern',
    steps: [
      {
        title: 'Named Slots via Props',
        code: `function PageLayout({ header, sidebar, children }) {
  return (
    <div className="page">
      <header>{header}</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  )
}`,
        explanation: 'Use named props to create "slots" where parent components can inject content. This is React\'s answer to Vue/Svelte named slots. The children prop acts as the default slot.',
      },
      {
        title: 'Using Named Slots',
        code: `<PageLayout
  header={<NavBar user={currentUser} />}
  sidebar={
    <ul>
      <li>Dashboard</li>
      <li>Settings</li>
    </ul>
  }
>
  <h1>Welcome back!</h1>
  <p>Here is your dashboard content.</p>
</PageLayout>`,
        explanation: 'The parent component controls what goes in each slot. The layout component does not know or care what content it receives — it just places things in the right positions.',
      },
      {
        title: 'Conditional Slots',
        code: `function Card({ icon, title, children, footer }) {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <span className="icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
      {footer && (
        <div className="card-footer">{footer}</div>
      )}
    </div>
  )
}`,
        explanation: 'Slots can be optional. Check if a slot prop is provided before rendering its container. This keeps the DOM clean when optional sections are not needed.',
      },
    ],
  },
  {
    id: 'render-functions',
    label: 'Render Functions',
    steps: [
      {
        title: 'Function as Children',
        code: `function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e =>
      setPos({ x: e.clientX, y: e.clientY })
    }>
      {children(pos)}
    </div>
  )
}

<MouseTracker>
  {({ x, y }) => <p>Mouse: {x}, {y}</p>}
</MouseTracker>`,
        explanation: 'Instead of passing JSX as children, pass a function. The parent component calls that function with data, and the child function decides how to render it. This inverts control of rendering.',
        output: ['Mouse: 120, 340'],
      },
      {
        title: 'Render Prop Pattern',
        code: `function DataFetcher({ url, render }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [url])

  return render({ data, loading })
}

<DataFetcher
  url="/api/users"
  render={({ data, loading }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
/>`,
        explanation: 'The "render prop" pattern passes a function via a named prop (often called "render"). The component handles logic (fetching, tracking) and delegates UI rendering to the caller.',
      },
      {
        title: 'Modern Alternative: Custom Hooks',
        code: `function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) =>
      setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () =>
      window.removeEventListener('mousemove', handler)
  }, [])

  return pos
}

function App() {
  const { x, y } = useMousePosition()
  return <p>Mouse: {x}, {y}</p>
}`,
        explanation: 'Custom hooks have largely replaced render props for sharing stateful logic. Hooks are simpler, avoid nesting, and are more composable. Render props are still useful for specific UI injection patterns.',
      },
    ],
  },
]

export function ChildrenCompositionViz(): JSX.Element {
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
