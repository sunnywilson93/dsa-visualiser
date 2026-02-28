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
    id: 'timing-difference',
    label: 'Timing Difference',
    steps: [
      {
        title: 'useEffect: After Paint',
        code: `function Component() {
  useEffect(() => {
    // Runs AFTER the browser paints
    // The user sees the initial render first
    console.log('useEffect fired')
  })

  return <div>Hello</div>
}`,
        explanation: 'useEffect runs asynchronously after the browser has painted the screen. React renders the component, the browser paints pixels, then useEffect fires. The user sees the initial state before the effect runs.',
        output: ['1. React renders component', '2. Browser paints pixels to screen', '3. useEffect callback fires'],
      },
      {
        title: 'useLayoutEffect: Before Paint',
        code: `function Component() {
  useLayoutEffect(() => {
    // Runs BEFORE the browser paints
    // Blocks painting until complete
    console.log('useLayoutEffect fired')
  })

  return <div>Hello</div>
}`,
        explanation: 'useLayoutEffect runs synchronously after React has updated the DOM but before the browser paints. The browser waits for your code to finish before showing anything to the user.',
        output: ['1. React renders component', '2. useLayoutEffect callback fires', '3. Browser paints pixels to screen'],
      },
      {
        title: 'Side-by-Side Timeline',
        code: `// React render cycle:

// useEffect:
// render -> DOM update -> PAINT -> effect

// useLayoutEffect:
// render -> DOM update -> effect -> PAINT

// The difference: does the user see the
// intermediate state or not?`,
        explanation: 'The critical distinction is whether the browser paints between the DOM update and your effect. useLayoutEffect lets you modify the DOM before the user sees anything, preventing visual glitches.',
      },
    ],
  },
  {
    id: 'dom-measurements',
    label: 'DOM Measurements',
    steps: [
      {
        title: 'Measuring After Render',
        code: `function Tooltip({ targetRef, children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    const targetRect = targetRef.current
      .getBoundingClientRect()
    const tooltipRect = tooltipRef.current
      .getBoundingClientRect()

    setPosition({
      x: targetRect.left + (targetRect.width / 2)
        - (tooltipRect.width / 2),
      y: targetRect.top - tooltipRect.height - 8
    })
  }, [targetRef])

  return (
    <div ref={tooltipRef} style={{
      left: position.x, top: position.y
    }}>
      {children}
    </div>
  )
}`,
        explanation: 'The tooltip needs to measure its own size to center itself above the target. useLayoutEffect runs after the DOM is updated (so the tooltip element exists) but before paint (so the user never sees it at position 0,0).',
      },
      {
        title: 'Why useEffect Would Fail Here',
        code: `// With useEffect instead:

// Frame 1: Tooltip appears at (0, 0) -- FLASH!
// Paint happens...
// Effect runs, measures DOM
// setState triggers re-render

// Frame 2: Tooltip appears at correct position

// The user sees a brief flash of the tooltip
// at the wrong position. This is the "flicker".`,
        explanation: 'useEffect would cause a visible jump. The tooltip renders at its default position, the browser paints that, then the effect measures and repositions, causing another paint. The user sees the tooltip teleport.',
        output: ['Frame 1: tooltip at (0, 0) - visible!', 'Effect fires, measures, sets position', 'Frame 2: tooltip at (120, 45) - jumps!'],
      },
      {
        title: 'Reading Computed Styles',
        code: `function AutoSizeInput({ value }) {
  const inputRef = useRef(null)
  const measureRef = useRef(null)

  useLayoutEffect(() => {
    const measuredWidth = measureRef.current
      .getBoundingClientRect().width
    inputRef.current.style.width =
      measuredWidth + 'px'
  }, [value])

  return (
    <>
      <input ref={inputRef} value={value} />
      <span ref={measureRef} className="invisible absolute">
        {value}
      </span>
    </>
  )
}`,
        explanation: 'A hidden span measures the text width, then the input is resized to match. useLayoutEffect ensures the input is the correct width before the user sees it — no width jump on each keystroke.',
      },
    ],
  },
  {
    id: 'preventing-flicker',
    label: 'Preventing Flicker',
    steps: [
      {
        title: 'The Flicker Problem',
        code: `function AnimatedHeight({ children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState('auto')

  useEffect(() => {
    const measured = ref.current.scrollHeight
    setHeight(measured + 'px')
  }, [children])

  return (
    <div style={{ height, overflow: 'hidden' }}>
      <div ref={ref}>{children}</div>
    </div>
  )
}`,
        explanation: 'With useEffect, the container first renders with height: "auto" (full height), the browser paints, then the effect measures and sets a fixed height. The user sees a brief flash of the full content before it collapses.',
      },
      {
        title: 'The Fix: useLayoutEffect',
        code: `function AnimatedHeight({ children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const measured = ref.current.scrollHeight
    setHeight(measured)
  }, [children])

  return (
    <div style={{
      height, overflow: 'hidden',
      transition: 'height 300ms ease'
    }}>
      <div ref={ref}>{children}</div>
    </div>
  )
}`,
        explanation: 'useLayoutEffect measures the content height before the browser paints. The container renders with the correct height on the very first frame. No flicker, smooth transitions from the start.',
        output: ['useEffect: auto -> paint -> measure -> fixed', 'useLayoutEffect: measure -> fixed -> paint', 'Zero visual flicker'],
      },
      {
        title: 'Conditional Rendering Based on Measurement',
        code: `function TruncatedText({ text, maxLines }) {
  const ref = useRef(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    setIsTruncated(el.scrollHeight > el.clientHeight)
  }, [text, maxLines])

  return (
    <div>
      <p ref={ref} style={{
        WebkitLineClamp: maxLines,
        overflow: 'hidden'
      }}>
        {text}
      </p>
      {isTruncated && <button>Show more</button>}
    </div>
  )
}`,
        explanation: 'The "Show more" button should only appear if the text is actually truncated. useLayoutEffect checks before paint, so the button either appears or does not on the first visible frame — no popping in.',
      },
    ],
  },
  {
    id: 'when-to-use',
    label: 'When to Use',
    steps: [
      {
        title: 'Use useLayoutEffect For',
        code: `// 1. DOM measurements that affect layout
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPosition({ x: rect.left, y: rect.top })
}, [])

// 2. Synchronous DOM mutations before paint
useLayoutEffect(() => {
  ref.current.scrollTop = ref.current.scrollHeight
}, [messages])

// 3. Preventing visual flicker
useLayoutEffect(() => {
  ref.current.style.opacity = '1'
}, [])`,
        explanation: 'useLayoutEffect is the right choice when you need to read from the DOM and synchronously write back before the user sees anything. Measurements, scroll position restoration, and flicker prevention are the primary use cases.',
      },
      {
        title: 'Use useEffect For Everything Else',
        code: `// Data fetching
useEffect(() => {
  fetchData().then(setData)
}, [id])

// Event listeners
useEffect(() => {
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])

// Analytics, logging
useEffect(() => {
  analytics.pageView(path)
}, [path])`,
        explanation: 'The vast majority of side effects should use useEffect. Data fetching, subscriptions, analytics, and event listeners do not need to block painting. useLayoutEffect should be rare in your codebase.',
      },
      {
        title: 'Performance Warning',
        code: `// useLayoutEffect blocks painting!

useLayoutEffect(() => {
  // If this takes 100ms...
  const result = expensiveCalculation()
  // ...the screen is frozen for 100ms
  // The user sees a blank/stale screen
}, [data])

// Rule: keep useLayoutEffect callbacks FAST
// If it does not need to block paint, use useEffect`,
        explanation: 'Because useLayoutEffect blocks the browser from painting, slow code inside it causes visible jank. The user sees the screen freeze. Keep useLayoutEffect callbacks short — measure, set a value, done. Move heavy work to useEffect.',
        output: ['useEffect: non-blocking, async', 'useLayoutEffect: blocking, sync', 'Default to useEffect, opt into useLayoutEffect'],
      },
    ],
  },
]

export function UseLayoutEffectViz(): JSX.Element {
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
