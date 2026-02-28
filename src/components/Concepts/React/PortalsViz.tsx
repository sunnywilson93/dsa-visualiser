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
    id: 'createportal-basics',
    label: 'createPortal Basics',
    steps: [
      {
        title: 'What Is a Portal?',
        code: `import { createPortal } from 'react-dom'

function MyComponent() {
  return createPortal(
    <div className="overlay">Portal content</div>,
    document.body
  )
}`,
        explanation: 'createPortal renders a React element into a different DOM node than its parent component. The first argument is the JSX to render, the second is the target DOM node. The element appears in document.body but logically belongs to MyComponent.',
      },
      {
        title: 'Without a Portal',
        code: `function Card() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <h2>Card Title</h2>
      <div className="dropdown">
        {/* This dropdown gets clipped by
            the parent overflow: hidden */}
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      </div>
    </div>
  )
}`,
        explanation: 'When a parent has overflow: hidden, position: relative, or a z-index stacking context, child elements cannot visually escape. Dropdowns, tooltips, and modals get clipped or hidden behind other content.',
        output: ['DOM: <div overflow:hidden>', '        <div class="dropdown"> <- clipped!'],
      },
      {
        title: 'With a Portal',
        code: `function Card() {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div style={{ overflow: 'hidden' }}>
      <h2>Card Title</h2>
      <button onClick={() => setShowDropdown(true)}>
        Open
      </button>
      {showDropdown && createPortal(
        <ul className="dropdown">
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>,
        document.body
      )}
    </div>
  )
}`,
        explanation: 'The dropdown renders in document.body, escaping the overflow: hidden container. It is no longer clipped. The portal content still receives React context and state from Card, even though it lives elsewhere in the DOM.',
        output: ['DOM: <body>', '       <div overflow:hidden> (Card)', '       <ul class="dropdown"> (Portal)'],
      },
    ],
  },
  {
    id: 'modal-pattern',
    label: 'Modal Pattern',
    steps: [
      {
        title: 'The Modal Container',
        code: `<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>`,
        explanation: 'A dedicated DOM node for modals keeps them separate from the app root. This makes it easy to manage z-index layering and ensures modals always render above the main content. Some teams add portal-root instead.',
      },
      {
        title: 'Building the Modal Component',
        code: `function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}`,
        explanation: 'The modal renders a backdrop and content into modal-root. Clicking the backdrop closes the modal. stopPropagation on the content div prevents clicks inside the modal from bubbling to the backdrop and closing it.',
      },
      {
        title: 'Using the Modal',
        code: `function Settings() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Delete Account
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2>Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <button onClick={handleDelete}>
          Confirm Delete
        </button>
      </Modal>
    </div>
  )
}`,
        explanation: 'The modal is controlled by local state in Settings. Even though the modal DOM node lives in modal-root, the component logic stays in Settings. State, event handlers, and context all work as if the modal were a direct child.',
      },
      {
        title: 'Accessibility: Focus Trap',
        code: `function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const el = modalRef.current
    const previousFocus = document.activeElement

    el?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener(
        'keydown', handleKeyDown
      )
      previousFocus?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div ref={modalRef} role="dialog" tabIndex={-1}>
      {children}
    </div>,
    document.getElementById('modal-root')
  )
}`,
        explanation: 'Accessible modals must trap focus, handle Escape to close, and restore focus to the previously focused element on unmount. The role="dialog" attribute tells screen readers this is a modal dialog.',
      },
    ],
  },
  {
    id: 'event-bubbling',
    label: 'Event Bubbling',
    steps: [
      {
        title: 'React Tree vs DOM Tree',
        code: `function Parent() {
  const handleClick = () => {
    console.log('Parent caught click!')
  }

  return (
    <div onClick={handleClick}>
      <h1>Parent Component</h1>
      <Child />
    </div>
  )
}

function Child() {
  return createPortal(
    <button>Click me (in portal)</button>,
    document.body
  )
}`,
        explanation: 'The button renders in document.body via a portal, but it is still a child of Parent in the React component tree. React uses its own synthetic event system that follows the React tree, not the DOM tree.',
        output: ['DOM tree: body > button (no parent div)', 'React tree: Parent > Child > button', 'Click bubbles through React tree!'],
      },
      {
        title: 'Events Bubble Through React Tree',
        code: `// When button in portal is clicked:

// 1. DOM: click on <button> in <body>
//    Does NOT bubble to Parent's <div>
//    because they are not DOM ancestors

// 2. React: click bubbles from Child -> Parent
//    Parent's onClick fires!
//    Because Child is a React child of Parent

console.log('Parent caught click!')
// This WILL log, even though the button
// is in document.body`,
        explanation: 'This is the key insight: events in portals bubble through the React component hierarchy, not the DOM hierarchy. Parent catches the click because Child is its React child, regardless of where the portal DOM node lives.',
      },
      {
        title: 'Stopping Portal Event Bubbling',
        code: `function Child() {
  const handleClick = (e) => {
    e.stopPropagation()
    console.log('Only Child handles this')
  }

  return createPortal(
    <button onClick={handleClick}>
      Click me
    </button>,
    document.body
  )
}`,
        explanation: 'If you do not want portal events to bubble up the React tree, call e.stopPropagation() in the portal child. This prevents the synthetic event from reaching parent React components while still allowing native DOM event bubbling.',
      },
    ],
  },
  {
    id: 'tooltip-pattern',
    label: 'Tooltip Pattern',
    steps: [
      {
        title: 'The Overflow Problem',
        code: `function TableCell({ text, tooltip }) {
  const [show, setShow] = useState(false)

  return (
    <td
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {text}
      {show && (
        <div className="tooltip">{tooltip}</div>
      )}
    </td>
  )
}

// The table has overflow: auto
// Tooltip gets clipped at table edges!`,
        explanation: 'Tables, scrollable containers, and cards often have overflow constraints. Tooltips rendered as children get clipped at the container boundary. The user sees a cut-off tooltip or nothing at all.',
      },
      {
        title: 'Portal Tooltip',
        code: `function Tooltip({ text, targetRect }) {
  if (!targetRect) return null

  return createPortal(
    <div
      className="tooltip"
      style={{
        position: 'fixed',
        left: targetRect.left + targetRect.width / 2,
        top: targetRect.top - 8,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {text}
    </div>,
    document.body
  )
}`,
        explanation: 'The tooltip renders in document.body with position: fixed. It uses the target element getBoundingClientRect coordinates for positioning. Since it is outside all containers, no overflow can clip it.',
      },
      {
        title: 'Complete Tooltip Hook',
        code: `function useTooltip() {
  const [rect, setRect] = useState(null)
  const ref = useRef(null)

  const show = () => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect())
    }
  }
  const hide = () => setRect(null)

  return { ref, rect, show, hide }
}

function TableCell({ text, tooltip }) {
  const { ref, rect, show, hide } = useTooltip()

  return (
    <td
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {text}
      <Tooltip text={tooltip} targetRect={rect} />
    </td>
  )
}`,
        explanation: 'A useTooltip hook encapsulates the ref, positioning logic, and show/hide state. The Tooltip component receives coordinates and renders via portal. This pattern works regardless of the parent container CSS.',
        output: ['Hover -> getBoundingClientRect()', 'Portal renders at exact position', 'No overflow clipping'],
      },
      {
        title: 'Repositioning on Scroll',
        code: `function Tooltip({ text, targetRef, isVisible }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isVisible || !targetRef.current) return

    const update = () => {
      const rect = targetRef.current
        .getBoundingClientRect()
      setPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [isVisible, targetRef])

  if (!isVisible) return null

  return createPortal(
    <div
      style={{ position: 'fixed', left: pos.x, top: pos.y }}
    >
      {text}
    </div>,
    document.body
  )
}`,
        explanation: 'Portal tooltips need to follow their target when the page scrolls or resizes. Adding scroll (with capture: true for nested scroll containers) and resize listeners ensures the tooltip stays anchored to its target element.',
      },
    ],
  },
]

export function PortalsViz(): JSX.Element {
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
