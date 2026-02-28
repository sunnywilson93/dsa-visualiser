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
    id: 'function-components',
    label: 'Function Components',
    steps: [
      {
        title: 'The Simplest Component',
        code: `function Greeting() {
  return <h1>Hello, world!</h1>
}`,
        explanation: 'A React component is just a JavaScript function that returns JSX. The function name must start with an uppercase letter so React can distinguish it from HTML elements.',
      },
      {
        title: 'Using a Component',
        code: `function Greeting() {
  return <h1>Hello, world!</h1>
}

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  )
}`,
        explanation: 'Components are used like custom HTML tags. Each <Greeting /> call creates an independent instance of that component. Components are reusable building blocks.',
        output: ['Hello, world!', 'Hello, world!'],
      },
      {
        title: 'Arrow Function Components',
        code: `const Greeting = () => {
  return <h1>Hello, world!</h1>
}

const Badge = () => <span>New</span>`,
        explanation: 'Arrow functions work identically for components. Single-expression components can use the implicit return syntax for brevity. Both forms are equally valid.',
      },
      {
        title: 'Components Return a Tree',
        code: `function UserCard() {
  return (
    <div className="card">
      <img src="avatar.png" alt="User" />
      <h2>Jane Doe</h2>
      <p>Software Engineer</p>
      <button>Follow</button>
    </div>
  )
}`,
        explanation: 'Components can return complex UI trees. This composability is the core idea of React — build small, focused components, then combine them into larger interfaces.',
      },
    ],
  },
  {
    id: 'props-flow',
    label: 'Props Flow',
    steps: [
      {
        title: 'Passing Props',
        code: `function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

function App() {
  return <Greeting name="Alice" />
}`,
        explanation: 'Props are how parent components pass data to their children. They flow in one direction only: parent to child. This is called "one-way data flow" and makes your app predictable.',
        output: ['Hello, Alice!'],
      },
      {
        title: 'Multiple Props',
        code: `function UserBadge({ name, role, isOnline }) {
  return (
    <div>
      <span>{name}</span>
      <span>{role}</span>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  )
}

<UserBadge name="Bob" role="Admin" isOnline={true} />`,
        explanation: 'Components can accept any number of props. String values use quotes, but all other types (numbers, booleans, objects, arrays) use curly braces.',
        output: ['Bob | Admin | Online'],
      },
      {
        title: 'Props Are Read-Only',
        code: `function Counter({ count }) {
  // This would be a bug:
  // count = count + 1

  return <span>Count: {count}</span>
}`,
        explanation: 'A component must never modify its own props. Props are read-only — they belong to the parent. If a component needs to change data, it should use state instead (covered in a later topic).',
      },
      {
        title: 'Passing Dynamic Values',
        code: `function App() {
  const user = { name: 'Carol', score: 42 }

  return (
    <div>
      <ScoreCard
        player={user.name}
        points={user.score}
        isHighScore={user.score > 40}
      />
    </div>
  )
}`,
        explanation: 'Props can be any JavaScript expression. Here we pass a string, a number, and a computed boolean. The child component receives these values without knowing how they were calculated.',
      },
    ],
  },
  {
    id: 'destructuring',
    label: 'Destructuring Props',
    steps: [
      {
        title: 'The Props Object',
        code: `function Greeting(props) {
  return (
    <h1>
      Hello, {props.name}!
      You are {props.age} years old.
    </h1>
  )
}`,
        explanation: 'React passes all props as a single object. Without destructuring, you access each prop via the props parameter. This works but gets verbose with many props.',
      },
      {
        title: 'Parameter Destructuring',
        code: `function Greeting({ name, age }) {
  return (
    <h1>
      Hello, {name}!
      You are {age} years old.
    </h1>
  )
}`,
        explanation: 'Destructuring in the parameter list extracts specific props directly. This is the most common pattern in React — it makes props usage clearer and the code more concise.',
      },
      {
        title: 'Renaming and Rest Props',
        code: `function Button({ label, onClick, ...rest }) {
  return (
    <button onClick={onClick} {...rest}>
      {label}
    </button>
  )
}

<Button label="Save" onClick={save} disabled={true} />`,
        explanation: 'The rest operator (...rest) collects all remaining props into an object. Spreading them onto an element passes them through. This pattern is essential for building reusable wrapper components.',
      },
      {
        title: 'TypeScript Props Interface',
        code: `interface GreetingProps {
  name: string
  age: number
  isVIP?: boolean
}

function Greeting({ name, age, isVIP }: GreetingProps) {
  return (
    <h1>
      {isVIP && 'VIP: '}Hello, {name}! ({age})
    </h1>
  )
}`,
        explanation: 'In TypeScript, define an interface for your props. This gives you autocomplete, compile-time type checking, and self-documenting component APIs. The ? marks optional props.',
      },
    ],
  },
  {
    id: 'default-props',
    label: 'Default Props',
    steps: [
      {
        title: 'Defaults via Destructuring',
        code: `function Button({ variant = 'primary', size = 'md' }) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      Click me
    </button>
  )
}

<Button />
<Button variant="secondary" size="lg" />`,
        explanation: 'JavaScript default parameter values are the standard way to define defaults in React. If a prop is not provided (or is undefined), the default value is used.',
        output: ['<button class="btn btn-primary btn-md">', '<button class="btn btn-secondary btn-lg">'],
      },
      {
        title: 'Defaults with TypeScript',
        code: `interface AlertProps {
  message: string
  severity?: 'info' | 'warning' | 'error'
  dismissible?: boolean
}

function Alert({
  message,
  severity = 'info',
  dismissible = false
}: AlertProps) {
  return (
    <div className={\`alert alert-\${severity}\`}>
      {message}
      {dismissible && <button>Dismiss</button>}
    </div>
  )
}`,
        explanation: 'Combine TypeScript optional props (?) with default values for a robust API. Required props have no ?, optional props get defaults. Callers see exactly what they must provide.',
      },
      {
        title: 'Object and Array Defaults',
        code: `function DataTable({
  data = [],
  config = { sortable: true, pageSize: 10 }
}) {
  return (
    <table>
      {data.map(row => (
        <tr key={row.id}>
          <td>{row.name}</td>
        </tr>
      ))}
    </table>
  )
}`,
        explanation: 'Default objects and arrays are created on each render if the prop is missing. For expensive defaults, consider useMemo. Simple defaults like these are fine as-is.',
      },
    ],
  },
]

export function ComponentsPropsViz(): JSX.Element {
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
