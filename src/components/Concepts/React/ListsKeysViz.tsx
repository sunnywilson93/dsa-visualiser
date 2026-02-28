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
    id: 'map-rendering',
    label: 'map() Rendering',
    steps: [
      {
        title: 'Rendering an Array',
        code: `const fruits = ['Apple', 'Banana', 'Cherry']

function FruitList() {
  return (
    <ul>
      {fruits.map(fruit => (
        <li>{fruit}</li>
      ))}
    </ul>
  )
}`,
        explanation: 'The .map() method transforms each item in an array into a JSX element. React renders the resulting array of elements. This is the standard pattern for rendering dynamic lists in React.',
        output: ['- Apple', '- Banana', '- Cherry'],
      },
      {
        title: 'Rendering Objects',
        code: `const users = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' },
  { id: 3, name: 'Carol', role: 'Viewer' },
]

function UserTable() {
  return (
    <table>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}`,
        explanation: 'Real-world lists are usually arrays of objects. Destructure the properties you need inside the .map() callback. Each mapped element needs a unique key prop for React to track it.',
        output: ['Alice  | Admin', 'Bob    | Editor', 'Carol  | Viewer'],
      },
      {
        title: 'Filtering Before Mapping',
        code: `function ActiveUsers({ users }) {
  return (
    <ul>
      {users
        .filter(user => user.isActive)
        .map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
    </ul>
  )
}`,
        explanation: 'Chain .filter() before .map() to render a subset. The filter runs first, removing items that do not match, then map transforms the remaining items into JSX. This is a common and clean pattern.',
      },
      {
        title: 'Extracting List Item Components',
        code: `function UserCard({ user }) {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>{user.role}</span>
    </div>
  )
}

function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}`,
        explanation: 'When list items are complex, extract them into a separate component. The key prop goes on the component in the .map() call, not inside the extracted component.',
      },
    ],
  },
  {
    id: 'key-prop',
    label: 'Key Prop',
    steps: [
      {
        title: 'Why Keys Matter',
        code: `// Without keys, React re-renders every item
<ul>
  <li>Alice</li>    {/* Was this moved? */}
  <li>Bob</li>      {/* Or was this added? */}
  <li>Carol</li>    {/* React can't tell */}
</ul>

// With keys, React knows exactly what changed
<ul>
  <li key="a">Alice</li>   {/* Matched by key */}
  <li key="b">Bob</li>     {/* Matched by key */}
  <li key="c">Carol</li>   {/* New! Only this renders */}
</ul>`,
        explanation: 'Keys help React identify which items changed, were added, or were removed. Without keys, React must compare every element by position, which is slow and can cause bugs with state.',
      },
      {
        title: 'How React Uses Keys',
        code: `// Before update:
<ul>
  <li key="1">Apple</li>
  <li key="2">Banana</li>
</ul>

// After update (Cherry added at start):
<ul>
  <li key="3">Cherry</li>   {/* New - insert */}
  <li key="1">Apple</li>    {/* key="1" matched - keep */}
  <li key="2">Banana</li>   {/* key="2" matched - keep */}
</ul>`,
        explanation: 'React compares old and new lists by key. Items with matching keys are reused (moved if needed). Items with new keys are created. Items with missing keys are destroyed. This is called "reconciliation".',
        output: ['Only Cherry is actually mounted', 'Apple and Banana are reused (moved)'],
      },
      {
        title: 'Keys Must Be Unique Among Siblings',
        code: `// GOOD: unique keys among siblings
<ul>
  <li key="apple">Apple</li>
  <li key="banana">Banana</li>
</ul>

// BAD: duplicate keys cause bugs
<ul>
  <li key="fruit">Apple</li>
  <li key="fruit">Banana</li>  {/* Collision! */}
</ul>

// OK: same keys in different lists
<ul><li key="1">List A item</li></ul>
<ol><li key="1">List B item</li></ol>`,
        explanation: 'Keys only need to be unique among siblings in the same array. Different lists can use the same key values. React warns in the console if it finds duplicate keys in the same list.',
      },
    ],
  },
  {
    id: 'index-key-problem',
    label: 'Index as Key Problem',
    steps: [
      {
        title: 'Index Keys Seem to Work',
        code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          <input type="checkbox" />
          {todo.text}
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'Using the array index as a key seems convenient. For static lists that never change order, it works fine. But it breaks when items are added, removed, or reordered.',
      },
      {
        title: 'The Bug: Reordering',
        code: `// Initial list (keys match indices):
// key=0: "Buy milk"    [checked]
// key=1: "Walk dog"    [unchecked]
// key=2: "Clean house" [unchecked]

// After removing "Buy milk":
// key=0: "Walk dog"    [checked] BUG!
// key=1: "Clean house" [unchecked]`,
        explanation: 'When "Buy milk" is removed, "Walk dog" takes index 0. React sees key=0 exists and reuses its DOM (with the checkbox still checked). The state is now attached to the wrong item.',
        output: ['"Walk dog" inherits "Buy milk" checked state', 'User sees the wrong item checked!'],
      },
      {
        title: 'Visual: What Goes Wrong',
        code: `// Before deletion:
// Index 0 -> DOM node A (checked) -> "Buy milk"
// Index 1 -> DOM node B            -> "Walk dog"
// Index 2 -> DOM node C            -> "Clean house"

// After deleting index 0:
// Index 0 -> DOM node A (checked) -> "Walk dog"
//   React reuses DOM node A because key=0 still exists
//   The checkbox state stays! Wrong item is checked.

// Index 1 -> DOM node B            -> "Clean house"
//   DOM node C is destroyed (key=2 is gone)`,
        explanation: 'React matches by key, not by content. Key 0 existed before and after, so React reuses the DOM node (including its internal state). The text changes but the checkbox does not reset.',
      },
      {
        title: 'When Index Keys Are Safe',
        code: `// SAFE: static list, no reordering
const colors = ['Red', 'Green', 'Blue']
colors.map((c, i) => <li key={i}>{c}</li>)

// SAFE: display-only, no interactive state
items.map((item, i) => (
  <li key={i}>{item.name}</li>
))

// UNSAFE: has inputs, checkboxes, or state
// UNSAFE: items can be added/removed/reordered
// Always use unique IDs for these cases`,
        explanation: 'Index keys are safe only for static, display-only lists that never reorder. If items have form inputs, internal state, or can be reordered, always use stable unique identifiers.',
      },
    ],
  },
  {
    id: 'stable-keys',
    label: 'Stable Keys',
    steps: [
      {
        title: 'Use Database IDs',
        code: `const users = [
  { id: 'usr_a1b2', name: 'Alice' },
  { id: 'usr_c3d4', name: 'Bob' },
  { id: 'usr_e5f6', name: 'Carol' },
]

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
        explanation: 'Database IDs are the ideal key. They are unique, stable (do not change between renders), and already available in your data. UUID, auto-increment IDs, or slugs all work well.',
      },
      {
        title: 'Generate IDs for Client-Side Data',
        code: `import { useId } from 'react'
import { nanoid } from 'nanoid'

function TodoApp() {
  const [todos, setTodos] = useState([])

  const addTodo = (text) => {
    setTodos(prev => [
      ...prev,
      { id: nanoid(), text, done: false }
    ])
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}`,
        explanation: 'For client-created items, generate a unique ID at creation time (not at render time). Libraries like nanoid or crypto.randomUUID() produce short, unique IDs. Assign the ID once when the item is created.',
      },
      {
        title: 'Composite Keys',
        code: `const schedule = [
  { day: 'Monday', time: '9:00', event: 'Standup' },
  { day: 'Monday', time: '14:00', event: 'Review' },
  { day: 'Tuesday', time: '9:00', event: 'Standup' },
]

function Schedule() {
  return (
    <ul>
      {schedule.map(item => (
        <li key={\`\${item.day}-\${item.time}\`}>
          {item.day} {item.time}: {item.event}
        </li>
      ))}
    </ul>
  )
}`,
        explanation: 'When no single field is unique, combine multiple fields into a composite key. The combination must be unique among siblings. Template literals make this easy to express.',
      },
      {
        title: 'Key Rules Summary',
        code: `// Rule 1: Keys must be stable
// BAD:  key={Math.random()}  (changes every render)
// GOOD: key={item.id}       (same between renders)

// Rule 2: Keys must be unique among siblings
// BAD:  duplicate keys cause reconciliation bugs
// GOOD: each sibling has a distinct key

// Rule 3: Keys should be predictable
// BAD:  key={index}  (changes when list reorders)
// GOOD: key={item.id} (tied to the data, not position)

// Rule 4: Keys are not passed as props
// key={id} is consumed by React, not your component
// Pass id={id} separately if the child needs it`,
        explanation: 'Stable, unique, and predictable keys let React efficiently update lists. Keys are internal to React and never passed to your component as a prop — if you need the value, pass it as a separate prop.',
      },
    ],
  },
]

export function ListsKeysViz(): JSX.Element {
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
