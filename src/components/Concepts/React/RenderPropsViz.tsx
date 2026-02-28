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
        title: 'What Are Render Props?',
        code: `<MouseTracker
  render={(pos) => (
    <p>Mouse is at ({pos.x}, {pos.y})</p>
  )}
/>`,
        explanation: 'A render prop is a prop whose value is a function that returns JSX. The component calls this function with its internal data, letting the consumer decide what to render with that data.',
      },
      {
        title: 'The Component That Shares Logic',
        code: `function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div onMouseMove={handleMove}>
      {render(pos)}
    </div>
  )
}`,
        explanation: 'MouseTracker owns the mouse-tracking logic and state. Instead of rendering a fixed UI, it calls the render function with the current position. The caller controls the visual output.',
      },
      {
        title: 'Different Renderings, Same Logic',
        code: `<MouseTracker render={(pos) => (
  <div className="tooltip"
    style={{ left: pos.x, top: pos.y }}>
    Tooltip follows cursor
  </div>
)} />

<MouseTracker render={(pos) => (
  <canvas
    data-cursor-x={pos.x}
    data-cursor-y={pos.y}
  />
)} />`,
        explanation: 'Two consumers use the same MouseTracker but render completely different UIs. One shows a tooltip, the other passes coordinates to a canvas. The tracking logic is written once and reused.',
      },
    ],
  },
  {
    id: 'sharing-logic',
    label: 'Sharing Logic',
    steps: [
      {
        title: 'A Toggle Render Prop',
        code: `function Toggle({ render }) {
  const [isOn, setIsOn] = useState(false)
  const toggle = () => setIsOn(prev => !prev)

  return render({ isOn, toggle })
}`,
        explanation: 'Toggle encapsulates on/off state and a toggle function. It passes both values to the render function. Any component can use this logic to build switches, accordions, or dropdowns.',
      },
      {
        title: 'Using Toggle for a Switch',
        code: `<Toggle render={({ isOn, toggle }) => (
  <button onClick={toggle}>
    {isOn ? 'ON' : 'OFF'}
  </button>
)} />`,
        explanation: 'The consumer receives isOn and toggle, then renders a simple button. The Toggle component does not know or care that it is being used as a switch. It only manages the boolean state.',
        output: ['Click: OFF -> ON -> OFF -> ON'],
      },
      {
        title: 'Using Toggle for a Dropdown',
        code: `<Toggle render={({ isOn, toggle }) => (
  <div>
    <button onClick={toggle}>
      {isOn ? 'Close Menu' : 'Open Menu'}
    </button>
    {isOn && (
      <ul className="dropdown">
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    )}
  </div>
)} />`,
        explanation: 'The same Toggle component now powers a dropdown menu. The logic (boolean state + toggler) is identical, but the rendered output is entirely different. This is the power of render props.',
      },
    ],
  },
  {
    id: 'children-fn',
    label: 'Children as Function',
    steps: [
      {
        title: 'Children Instead of Named Prop',
        code: `<Toggle>
  {({ isOn, toggle }) => (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>`,
        explanation: 'Instead of a "render" prop, you can pass the function as children. This reads more naturally and avoids naming debates. The component calls props.children as a function.',
      },
      {
        title: 'Implementing Children as Function',
        code: `function Toggle({ children }) {
  const [isOn, setIsOn] = useState(false)
  const toggle = () => setIsOn(prev => !prev)

  return children({ isOn, toggle })
}`,
        explanation: 'The implementation is nearly identical. Instead of calling props.render, you call props.children. TypeScript types children as a function: children: (state: ToggleState) => ReactNode.',
      },
      {
        title: 'Fetch Component Pattern',
        code: `<Fetch url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error msg={error} />
    return <UserList users={data} />
  }}
</Fetch>`,
        explanation: 'A classic use of children-as-function: the Fetch component handles the request lifecycle and the consumer handles rendering each state. This pattern was common before hooks existed.',
      },
    ],
  },
  {
    id: 'vs-hooks',
    label: 'vs Custom Hooks',
    steps: [
      {
        title: 'Render Prop Version',
        code: `<WindowSize render={({ width, height }) => (
  <div>
    Window: {width} x {height}
  </div>
)} />`,
        explanation: 'The render prop pattern works but introduces nesting. Each render prop adds another level of indentation. When you compose multiple render props together, the code becomes deeply nested.',
      },
      {
        title: 'Custom Hook Equivalent',
        code: `function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener(
      'resize', handler
    )
  }, [])

  return size
}`,
        explanation: 'Custom hooks extract the same logic without wrapper components. The hook returns data directly, no function-as-children needed. This is cleaner and composes better than render props.',
      },
      {
        title: 'Hook in Action',
        code: `function Dashboard() {
  const { width } = useWindowSize()
  const { data } = useFetch('/api/stats')
  const { isOn, toggle } = useToggle()

  return (
    <div>
      <p>Width: {width}</p>
      <button onClick={toggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}`,
        explanation: 'Hooks compose flat, not nested. Three pieces of reusable logic are combined at the same indentation level. This is why custom hooks have largely replaced render props for sharing stateful logic in modern React.',
        output: ['Render props: nested wrappers', 'Custom hooks: flat composition'],
      },
      {
        title: 'When Render Props Still Win',
        code: `<List
  items={users}
  renderItem={(user) => (
    <UserCard key={user.id} user={user} />
  )}
  renderEmpty={() => <p>No users found</p>}
/>`,
        explanation: 'Render props are still useful when you need to customize what a component renders at specific slots. This "slot" pattern (renderItem, renderHeader, renderEmpty) is not about sharing logic but about inversion of control for rendering.',
      },
    ],
  },
]

export function RenderPropsViz(): JSX.Element {
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
