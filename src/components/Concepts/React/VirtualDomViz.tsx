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
    id: 'what-is-vdom',
    label: 'What is VDOM',
    steps: [
      {
        title: 'The Real DOM is Expensive',
        code: `const element = document.createElement('div')
element.className = 'card'
element.textContent = 'Hello'
document.body.appendChild(element)`,
        explanation: 'Every real DOM operation triggers the browser to recalculate styles, layout, and repaint. These operations are slow because the DOM is a complex, cross-language bridge between JavaScript and the rendering engine.',
      },
      {
        title: 'The Virtual DOM is a Plain Object',
        code: `const vNode = {
  type: 'div',
  props: { className: 'card' },
  children: ['Hello']
}`,
        explanation: 'React represents UI as plain JavaScript objects called virtual DOM nodes. Creating and comparing JS objects is orders of magnitude faster than touching the real DOM.',
      },
      {
        title: 'JSX Compiles to createElement Calls',
        code: `// You write:
<div className="card">Hello</div>

// React sees:
React.createElement(
  'div',
  { className: 'card' },
  'Hello'
)`,
        explanation: 'JSX is syntactic sugar. Babel or SWC transforms each JSX element into a React.createElement call, which returns a virtual DOM object describing what the UI should look like.',
      },
      {
        title: 'A Component Tree Becomes a VDOM Tree',
        code: `function App() {
  return (
    <main>
      <Header />
      <Content items={data} />
    </main>
  )
}`,
        explanation: 'When React renders your app, it recursively calls your components and builds a full tree of virtual DOM objects. This tree mirrors the structure of your component hierarchy.',
        output: [
          '{ type: "main", children: [',
          '  { type: Header, ... },',
          '  { type: Content, ... }',
          ']}',
        ],
      },
    ],
  },
  {
    id: 'diffing',
    label: 'Diffing Algorithm',
    steps: [
      {
        title: 'Two Trees to Compare',
        code: `// Previous render
{ type: 'ul', children: [
  { type: 'li', key: 'a', children: ['Apple'] },
  { type: 'li', key: 'b', children: ['Banana'] }
]}

// New render
{ type: 'ul', children: [
  { type: 'li', key: 'a', children: ['Apple'] },
  { type: 'li', key: 'b', children: ['Blueberry'] },
  { type: 'li', key: 'c', children: ['Cherry'] }
]}`,
        explanation: 'On every render, React produces a new VDOM tree. It then compares this new tree with the previous one to find the minimum set of changes needed to update the real DOM.',
      },
      {
        title: 'Same Type: Update Props',
        code: `// Old
<button className="primary">Save</button>

// New
<button className="secondary">Save</button>

// React patches only the className attribute
// in the real DOM. The element is reused.`,
        explanation: 'If two elements have the same type, React keeps the same DOM node and only updates the changed attributes. This avoids destroying and recreating the element.',
      },
      {
        title: 'Different Type: Tear Down & Rebuild',
        code: `// Old
<div><Counter /></div>

// New
<section><Counter /></section>

// React destroys <div> and its subtree,
// mounts a fresh <section> with a new Counter`,
        explanation: 'When the element type changes, React assumes the entire subtree is different. It unmounts the old tree (running cleanup effects) and mounts a brand new tree from scratch.',
      },
      {
        title: 'Keys Enable Efficient List Diffing',
        code: `// Without keys: React compares by index
// Inserting at start re-renders EVERY item

// With keys: React matches by key
<li key="a">Apple</li>   // matched, no change
<li key="b">Banana</li>  // matched, no change
<li key="c">Cherry</li>  // new, insert only this`,
        explanation: 'Keys let React identify which items changed, were added, or removed. Without keys, inserting at the beginning causes every subsequent element to be re-rendered unnecessarily.',
      },
    ],
  },
  {
    id: 'reconciliation',
    label: 'Reconciliation',
    steps: [
      {
        title: 'Step 1: Render Phase (Pure)',
        code: `function Counter({ count }) {
  return <span>{count}</span>
}

// React calls Counter({ count: 5 })
// Gets back: { type: 'span', children: [5] }`,
        explanation: 'In the render phase, React calls your component functions to build the new VDOM tree. This phase is pure -- it has no side effects and can be paused or restarted by React.',
      },
      {
        title: 'Step 2: Diff the Trees',
        code: `// Old tree:  { type: 'span', children: [4] }
// New tree:  { type: 'span', children: [5] }

// Diff result:
// UPDATE text content: 4 -> 5`,
        explanation: 'React walks both trees simultaneously, comparing nodes at each position. It collects a list of the minimum DOM mutations needed -- attribute changes, text updates, insertions, and deletions.',
      },
      {
        title: 'Step 3: Commit Phase (Side Effects)',
        code: `// React applies collected mutations:
spanElement.textContent = '5'

// Then runs effects:
useEffect(() => {
  document.title = 'Count: 5'
}, [count])`,
        explanation: 'In the commit phase, React applies all collected DOM mutations in one synchronous batch. After the DOM is updated, it runs layout effects, then schedules passive effects (useEffect).',
      },
      {
        title: 'Batching Multiple Updates',
        code: `function handleClick() {
  setCount(c => c + 1)  // queued
  setFlag(f => !f)      // queued
  setText('done')       // queued
  // React batches all 3 into ONE re-render
}`,
        explanation: 'React batches multiple state updates within the same event handler into a single re-render. This means one diff, one set of DOM mutations, and one commit -- not three separate cycles.',
        output: ['Renders: 1 (not 3)'],
      },
    ],
  },
  {
    id: 'fiber',
    label: 'Fiber Architecture',
    steps: [
      {
        title: 'The Problem with Stack Reconciliation',
        code: `// Before Fiber (React 15):
// Reconciliation was recursive and synchronous
reconcile(tree) {
  for (child of tree.children) {
    reconcile(child)  // can't pause!
  }
}
// A large tree blocks the main thread`,
        explanation: 'Before React 16, reconciliation used the call stack recursively. Once it started, it had to finish the entire tree before the browser could handle user input, causing jank on large updates.',
      },
      {
        title: 'Fiber: A Unit of Work',
        code: `// Each Fiber node is a plain object:
{
  type: Counter,
  stateNode: domElement,
  child: firstChildFiber,
  sibling: nextSiblingFiber,
  return: parentFiber,
  pendingProps: { count: 5 },
  memoizedState: hooksList
}`,
        explanation: 'A Fiber is a JavaScript object representing a unit of work. It forms a linked list (child, sibling, return pointers) instead of a recursive tree, allowing React to pause and resume traversal.',
      },
      {
        title: 'Work Loop: Incremental Rendering',
        code: `function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop)
  }
}`,
        explanation: 'The Fiber work loop processes one unit at a time, checking if the browser needs the main thread. If time runs out, React yields control and resumes later, keeping the UI responsive.',
      },
      {
        title: 'Priority Lanes',
        code: `// React assigns priority lanes:
// SyncLane        -> urgent (click, input)
// InputContinuous -> hover, scroll
// DefaultLane     -> data fetching
// TransitionLane  -> startTransition()
// IdleLane        -> offscreen, low priority`,
        explanation: 'Fiber enables priority-based scheduling. Urgent updates (typing, clicking) interrupt lower-priority work (data fetching, transitions). This is how concurrent features like startTransition work under the hood.',
        output: [
          'Click handler  -> SyncLane (immediate)',
          'startTransition -> TransitionLane (deferrable)',
        ],
      },
    ],
  },
]

export function VirtualDomViz(): JSX.Element {
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
