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
    id: 'jsx-basics',
    label: 'JSX Basics',
    steps: [
      {
        title: 'JSX Looks Like HTML',
        code: `const element = <h1>Hello, world!</h1>`,
        explanation: 'JSX lets you write HTML-like syntax directly in JavaScript. This is not a string or HTML — it is a JavaScript expression that produces a React element.',
      },
      {
        title: 'JSX Must Have One Root',
        code: `const element = (
  <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>
)`,
        explanation: 'Every JSX expression must return a single root element. Wrap sibling elements in a parent container like a <div>, or use a Fragment.',
      },
      {
        title: 'Self-Closing Tags Are Required',
        code: `const element = (
  <div>
    <img src="photo.jpg" alt="Photo" />
    <input type="text" />
    <br />
  </div>
)`,
        explanation: 'Unlike HTML, JSX requires all tags to be explicitly closed. Elements without children must use the self-closing /> syntax.',
      },
      {
        title: 'className Instead of class',
        code: `const element = (
  <div className="container">
    <label htmlFor="name">Name</label>
    <input id="name" tabIndex={0} />
  </div>
)`,
        explanation: 'Since JSX compiles to JavaScript, reserved words like "class" and "for" are replaced with "className" and "htmlFor". Attribute names use camelCase.',
      },
    ],
  },
  {
    id: 'jsx-vs-createelement',
    label: 'JSX vs createElement',
    steps: [
      {
        title: 'What You Write (JSX)',
        code: `const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
)`,
        explanation: 'This is the JSX you write in your source code. It looks like HTML but it is actually syntactic sugar that gets compiled by tools like Babel or SWC.',
      },
      {
        title: 'What Gets Compiled',
        code: `const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
)`,
        explanation: 'The JSX compiler transforms your JSX into React.createElement() calls. The first argument is the tag, the second is props, and the rest are children.',
        output: ['React.createElement(type, props, ...children)'],
      },
      {
        title: 'Nested Elements Compile Recursively',
        code: `// JSX:
<div>
  <h1>Title</h1>
  <p>Text</p>
</div>

// Compiles to:
React.createElement('div', null,
  React.createElement('h1', null, 'Title'),
  React.createElement('p', null, 'Text')
)`,
        explanation: 'Nested JSX becomes nested createElement calls. Each child element is passed as an additional argument. This is why JSX needs a single root — createElement takes one type.',
      },
      {
        title: 'The Virtual DOM Object',
        code: `// createElement returns a plain object:
{
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
}`,
        explanation: 'React.createElement returns a lightweight JavaScript object describing what to render. This is a "virtual DOM" node. React uses these objects to efficiently update the real DOM.',
        output: ['JSX -> createElement -> Virtual DOM -> Real DOM'],
      },
    ],
  },
  {
    id: 'expressions',
    label: 'Expressions in JSX',
    steps: [
      {
        title: 'Embedding Variables',
        code: `const name = 'Alice'
const element = <h1>Hello, {name}!</h1>`,
        explanation: 'Curly braces {} in JSX create an "escape hatch" to JavaScript. Any valid JavaScript expression can go inside them. Here we embed a variable value.',
        output: ['Hello, Alice!'],
      },
      {
        title: 'Calling Functions',
        code: `function formatName(user) {
  return user.first + ' ' + user.last
}

const user = { first: 'Jane', last: 'Doe' }

const element = (
  <h1>Hello, {formatName(user)}!</h1>
)`,
        explanation: 'You can call functions inside curly braces. The return value of the function is rendered in place. This is powerful for formatting data before display.',
        output: ['Hello, Jane Doe!'],
      },
      {
        title: 'Inline Math and Logic',
        code: `const price = 29.99
const quantity = 3

const element = (
  <div>
    <p>Total: ${'{'}(price * quantity).toFixed(2){'}'}</p>
    <p>Status: {quantity > 0 ? 'In Stock' : 'Sold Out'}</p>
  </div>
)`,
        explanation: 'Expressions include arithmetic, method calls, and ternary operators. Anything that produces a value works. Statements like if/else and for loops do NOT work directly in JSX.',
        output: ['Total: $89.97', 'Status: In Stock'],
      },
      {
        title: 'Dynamic Attributes',
        code: `const isActive = true
const theme = 'dark'

const element = (
  <button
    className={isActive ? 'btn-active' : 'btn'}
    disabled={!isActive}
    style={{ color: theme === 'dark' ? '#fff' : '#000' }}
  >
    Click me
  </button>
)`,
        explanation: 'Expressions work in attribute positions too. This lets you dynamically set className, disabled, style, and any other prop based on your application state.',
      },
    ],
  },
  {
    id: 'fragments',
    label: 'Fragment Syntax',
    steps: [
      {
        title: 'The Problem: Extra DOM Nodes',
        code: `function Columns() {
  return (
    <div>
      <td>Column 1</td>
      <td>Column 2</td>
    </div>
  )
}`,
        explanation: 'Wrapping siblings in a <div> adds an unnecessary DOM node. In a <table>, this creates invalid HTML because <div> cannot be a child of <tr>.',
        output: ['<tr><div><td>...</td><td>...</td></div></tr>'],
      },
      {
        title: 'Solution: React.Fragment',
        code: `import { Fragment } from 'react'

function Columns() {
  return (
    <Fragment>
      <td>Column 1</td>
      <td>Column 2</td>
    </Fragment>
  )
}`,
        explanation: 'Fragment lets you group children without adding extra nodes to the DOM. The children are rendered directly as siblings in the parent element.',
        output: ['<tr><td>...</td><td>...</td></tr>'],
      },
      {
        title: 'Short Syntax: Empty Tags',
        code: `function Columns() {
  return (
    <>
      <td>Column 1</td>
      <td>Column 2</td>
    </>
  )
}`,
        explanation: 'The <></> shorthand is the most common way to write Fragments. It behaves identically to <Fragment> but is more concise. Use this whenever you need to return multiple elements.',
      },
      {
        title: 'Keyed Fragments',
        code: `function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  )
}`,
        explanation: 'When mapping over a list, you need a key prop. The <></> shorthand does not support key — you must use the explicit <Fragment key={...}> syntax in these cases.',
      },
    ],
  },
]

export function JsxRenderingViz(): JSX.Element {
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
