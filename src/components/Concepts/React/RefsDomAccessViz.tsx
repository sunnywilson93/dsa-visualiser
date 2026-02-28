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
    id: 'creating-refs',
    label: 'Creating Refs',
    steps: [
      {
        title: 'useRef Creates a Persistent Container',
        code: `function Timer() {
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('tick')
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])
}`,
        explanation: 'useRef returns a mutable object { current: initialValue } that persists for the entire lifetime of the component. Unlike state, mutating .current does not trigger a re-render.',
      },
      {
        title: 'Ref vs State: When to Use Which',
        code: `function Component() {
  const renderCount = useRef(0)
  const [count, setCount] = useState(0)

  renderCount.current += 1

  // renderCount changes silently (no re-render)
  // count changes trigger a re-render
}`,
        explanation: 'Use state when changing a value should update the UI. Use refs when you need to persist a value between renders without causing re-renders -- timer IDs, previous values, DOM references, or instance variables.',
        output: [
          'setCount(1) -> triggers re-render',
          'ref.current = 1 -> no re-render',
        ],
      },
      {
        title: 'Storing Previous Values',
        code: `function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

function Counter({ count }) {
  const prevCount = usePrevious(count)
  return <span>{prevCount} -> {count}</span>
}`,
        explanation: 'Refs let you remember values from previous renders. The effect runs after render, so ref.current still holds the old value during the current render. This is a common pattern for tracking "what changed."',
        output: ['First render: undefined -> 0', 'After increment: 0 -> 1'],
      },
      {
        title: 'createRef for Class Components',
        code: `class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  focusInput = () => {
    this.inputRef.current.focus()
  }

  render() {
    return <input ref={this.inputRef} />
  }
}`,
        explanation: 'In class components, use React.createRef() in the constructor. It creates the same { current: null } object. For function components, always prefer useRef which preserves the same ref object across re-renders.',
      },
    ],
  },
  {
    id: 'accessing-dom',
    label: 'Accessing DOM',
    steps: [
      {
        title: 'Focus an Input Programmatically',
        code: `function AutoFocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return <input ref={inputRef} placeholder="Type..." />
}`,
        explanation: 'Pass a ref to a DOM element via the ref attribute. After React mounts the element, ref.current points to the actual DOM node. You can call any DOM API on it -- focus(), blur(), scrollIntoView(), etc.',
        output: ['After mount: inputRef.current = <input />'],
      },
      {
        title: 'Measuring Element Dimensions',
        code: `function MeasuredBox() {
  const boxRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const rect = boxRef.current.getBoundingClientRect()
    setSize({ w: rect.width, h: rect.height })
  }, [])

  return (
    <div ref={boxRef}>
      {size.w}px x {size.h}px
    </div>
  )
}`,
        explanation: 'useLayoutEffect fires synchronously after DOM mutations but before paint. This lets you measure an element and update state without the user seeing a flash of incorrect values.',
        output: ['Layout effect reads: 200px x 100px'],
      },
      {
        title: 'Scrolling to Elements',
        code: `function ChatWindow({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <div className="chat">
      {messages.map(m => <Message key={m.id} {...m} />)}
      <div ref={bottomRef} />
    </div>
  )
}`,
        explanation: 'Attach a ref to a sentinel element at the bottom of a scrollable container. Whenever messages change, scroll that element into view. This is a common chat UI pattern for auto-scrolling to new messages.',
      },
      {
        title: 'Integrating with Non-React Libraries',
        code: `function Chart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const chart = new ChartLib(ctx, {
      type: 'line',
      data: data
    })
    return () => chart.destroy()
  }, [data])

  return <canvas ref={canvasRef} />
}`,
        explanation: 'When integrating D3, Chart.js, or other DOM-manipulating libraries, refs give you direct access to the DOM node those libraries need. Always clean up in the effect return to prevent memory leaks.',
      },
    ],
  },
  {
    id: 'forwarding-refs',
    label: 'Forwarding Refs',
    steps: [
      {
        title: 'The Problem: Refs Do Not Pass Through',
        code: `function FancyInput(props) {
  return <input className="fancy" {...props} />
}

function Parent() {
  const ref = useRef(null)
  // ref.current will be null!
  return <FancyInput ref={ref} />
}`,
        explanation: 'By default, ref is not a regular prop. React handles it specially and does not pass it to function components. The parent wants to access the inner input, but the ref has nowhere to go.',
        output: ['ref.current = null (ref was not forwarded)'],
      },
      {
        title: 'forwardRef Passes Refs Through',
        code: `const FancyInput = forwardRef(function FancyInput(
  props,
  ref
) {
  return <input className="fancy" ref={ref} {...props} />
})

function Parent() {
  const ref = useRef(null)
  // Now ref.current = <input /> element
  return <FancyInput ref={ref} />
}`,
        explanation: 'forwardRef creates a component that receives a second ref argument. You attach this ref to the inner DOM element you want to expose. The parent can now access the real input element directly.',
        output: ['ref.current = <input class="fancy" />'],
      },
      {
        title: 'useImperativeHandle: Custom Ref API',
        code: `const FancyInput = forwardRef(function FancyInput(
  props,
  ref
) {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' }
  }))

  return <input ref={inputRef} {...props} />
})`,
        explanation: 'useImperativeHandle lets you customize what the parent sees through the ref. Instead of exposing the raw DOM node, you expose a controlled API. This encapsulates the implementation and prevents misuse.',
        output: [
          'ref.current.focus() -> works',
          'ref.current.style = ... -> not exposed',
        ],
      },
      {
        title: 'React 19: ref as a Regular Prop',
        code: `// React 19+ (no forwardRef needed)
function FancyInput({ ref, ...props }) {
  return <input className="fancy" ref={ref} {...props} />
}

// Parent usage is the same:
<FancyInput ref={myRef} />`,
        explanation: 'Starting in React 19, ref is passed as a regular prop to function components. forwardRef is no longer needed for new code. This simplifies the API significantly and reduces boilerplate.',
      },
    ],
  },
  {
    id: 'callback-refs',
    label: 'Callback Refs',
    steps: [
      {
        title: 'Ref as a Function',
        code: `function MeasuredText() {
  const [height, setHeight] = useState(0)

  const measuredRef = (node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }

  return <div ref={measuredRef}>Hello, world</div>
}`,
        explanation: 'Instead of a ref object, you can pass a function. React calls it with the DOM node when the component mounts and with null when it unmounts. This lets you run logic the moment a node attaches or detaches.',
        output: ['Mount: measuredRef(<div>) called', 'Unmount: measuredRef(null) called'],
      },
      {
        title: 'Callback Refs for Dynamic Lists',
        code: `function ItemList({ items }) {
  const itemRefs = useRef(new Map())

  const scrollToItem = (id) => {
    const node = itemRefs.current.get(id)
    node?.scrollIntoView({ behavior: 'smooth' })
  }

  return items.map(item => (
    <div
      key={item.id}
      ref={(node) => {
        if (node) itemRefs.current.set(item.id, node)
        else itemRefs.current.delete(item.id)
      }}
    >
      {item.name}
    </div>
  ))
}`,
        explanation: 'Callback refs let you build a dynamic Map of DOM nodes keyed by ID. As items mount and unmount, the map stays in sync. This is impossible with useRef alone since you cannot create a variable number of refs.',
      },
      {
        title: 'Avoiding Inline Callback Ref Pitfalls',
        code: `// Problem: inline function recreated each render
// React calls with null then node on every render
<div ref={(node) => { /* runs twice per render */ }} />

// Fix: use useCallback to stabilize the ref
const stableRef = useCallback((node) => {
  if (node) {
    node.focus()
  }
}, [])

<div ref={stableRef} />`,
        explanation: 'An inline callback ref is a new function on every render. React detaches the old ref (calling it with null) and attaches the new one (calling it with the node). useCallback stabilizes the reference so it only runs on mount/unmount.',
        output: [
          'Inline: null -> node on EVERY render',
          'useCallback: null -> node only on mount/unmount',
        ],
      },
      {
        title: 'React 19: Cleanup Function from Callback Refs',
        code: `// React 19+: return a cleanup function
function VideoPlayer({ src }) {
  const videoRef = useCallback((node) => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.play()
        else node.pause()
      }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <video ref={videoRef} src={src} />
}`,
        explanation: 'In React 19, callback refs can return a cleanup function (like useEffect). React calls the cleanup when the node unmounts or the ref changes, eliminating the need to track null checks manually.',
      },
    ],
  },
]

export function RefsDomAccessViz(): JSX.Element {
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
