import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import styles from './EventLoopViz.module.css'

interface Step {
  description: string
  codeLine: number
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  phase: 'sync' | 'micro' | 'macro' | 'idle'
  activeWebApi?: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const webApis = [
  { name: 'fetch', highlight: false },
  { name: 'setTimeout', highlight: true },
  { name: 'URL', highlight: false },
  { name: 'localStorage', highlight: false },
  { name: 'sessionStorage', highlight: false },
  { name: 'HTMLDivElement', highlight: false },
  { name: 'document', highlight: false },
  { name: 'indexedDB', highlight: false },
  { name: 'XMLHttpRequest', highlight: false },
]

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'promise-vs-timeout',
      title: 'Promise vs setTimeout',
      code: [
        "console.log('1');",
        '',
        "setTimeout(() => {",
        "  console.log('timeout');",
        '}, 0);',
        '',
        'Promise.resolve()',
        "  .then(() => console.log('promise'));",
        '',
        "console.log('2');",
      ],
      steps: [
        {
          description: 'Script starts executing. Global EC pushed to call stack.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('1') executes immediately (synchronous)",
          codeLine: 0,
          callStack: ['<script>', "console.log('1')"],
          microQueue: [],
          macroQueue: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'setTimeout registers callback in Web APIs, adds to macrotask queue',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['1'],
          phase: 'sync',
          activeWebApi: 'setTimeout',
        },
        {
          description: 'Promise.then() registers callback in microtask queue',
          codeLine: 6,
          callStack: ['<script>'],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: "console.log('2') executes immediately (synchronous)",
          codeLine: 9,
          callStack: ['<script>', "console.log('2')"],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['1', '2'],
          phase: 'sync',
        },
        {
          description: 'Synchronous code done. Script pops off. Event loop checks microtasks FIRST!',
          codeLine: -1,
          callStack: [],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['1', '2'],
          phase: 'idle',
        },
        {
          description: 'Microtask runs: Promise callback executes',
          codeLine: 7,
          callStack: ['promise cb'],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['1', '2', 'promise'],
          phase: 'micro',
        },
        {
          description: 'Microtask queue empty. Now event loop processes macrotask queue.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['1', '2', 'promise'],
          phase: 'idle',
        },
        {
          description: 'Macrotask runs: setTimeout callback executes',
          codeLine: 3,
          callStack: ['timeout cb'],
          microQueue: [],
          macroQueue: [],
          output: ['1', '2', 'promise', 'timeout'],
          phase: 'macro',
        },
        {
          description: 'All queues empty. Event loop waits for new tasks.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['1', '2', 'promise', 'timeout'],
          phase: 'idle',
        },
      ],
      insight: 'Microtasks (Promises) always run before macrotasks (setTimeout), even with 0ms delay!'
    },
    {
      id: 'sync-only',
      title: 'Sync Code Flow',
      code: [
        "console.log('start');",
        '',
        'function greet(name) {',
        '  console.log("Hello " + name);',
        '}',
        '',
        "greet('World');",
        '',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts. Global execution context pushed.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs synchronously",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'greet function is defined (hoisted to memory)',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: "greet('World') called - new EC pushed to stack",
          codeLine: 6,
          callStack: ['<script>', 'greet'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'Inside greet: console.log runs',
          codeLine: 3,
          callStack: ['<script>', 'greet', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'Hello World'],
          phase: 'sync',
        },
        {
          description: 'greet completes, pops off the stack',
          codeLine: 4,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'Hello World'],
          phase: 'sync',
        },
        {
          description: "console.log('end') runs",
          codeLine: 8,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'Hello World', 'end'],
          phase: 'sync',
        },
        {
          description: 'All synchronous code complete. Stack is empty.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'Hello World', 'end'],
          phase: 'idle',
        },
      ],
      insight: 'Synchronous code executes line by line. Each function call adds to the call stack (LIFO).'
    },
  ],
  intermediate: [
    {
      id: 'chained-promises',
      title: 'Chained Promises',
      code: [
        "console.log('start');",
        '',
        'Promise.resolve()',
        "  .then(() => console.log('then 1'))",
        "  .then(() => console.log('then 2'))",
        "  .then(() => console.log('then 3'));",
        '',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts executing.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs synchronously",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'Promise.resolve() creates resolved promise, first .then() queued',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: ['then 1 cb'],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: "console.log('end') runs synchronously",
          codeLine: 7,
          callStack: ['<script>', 'console.log'],
          microQueue: ['then 1 cb'],
          macroQueue: [],
          output: ['start', 'end'],
          phase: 'sync',
        },
        {
          description: 'Sync code done. Event loop processes microtask queue.',
          codeLine: -1,
          callStack: [],
          microQueue: ['then 1 cb'],
          macroQueue: [],
          output: ['start', 'end'],
          phase: 'idle',
        },
        {
          description: 'First .then() runs, queues the next .then()',
          codeLine: 3,
          callStack: ['then 1 cb'],
          microQueue: ['then 2 cb'],
          macroQueue: [],
          output: ['start', 'end', 'then 1'],
          phase: 'micro',
        },
        {
          description: 'Second .then() runs, queues the third .then()',
          codeLine: 4,
          callStack: ['then 2 cb'],
          microQueue: ['then 3 cb'],
          macroQueue: [],
          output: ['start', 'end', 'then 1', 'then 2'],
          phase: 'micro',
        },
        {
          description: 'Third .then() runs. Microtask queue now empty.',
          codeLine: 5,
          callStack: ['then 3 cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'then 1', 'then 2', 'then 3'],
          phase: 'micro',
        },
        {
          description: 'All done! Event loop waits.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'then 1', 'then 2', 'then 3'],
          phase: 'idle',
        },
      ],
      insight: 'Each .then() only queues its callback when the previous promise resolves. They run sequentially in microtask phase.'
    },
    {
      id: 'async-await',
      title: 'async/await',
      code: [
        'async function fetchData() {',
        "  console.log('fetching');",
        '  await Promise.resolve();',
        "  console.log('done');",
        '}',
        '',
        "console.log('start');",
        'fetchData();',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts. async function is defined.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs synchronously",
          codeLine: 6,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'fetchData() called - function starts executing',
          codeLine: 7,
          callStack: ['<script>', 'fetchData'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: "Inside fetchData: console.log('fetching') runs (before await)",
          codeLine: 1,
          callStack: ['<script>', 'fetchData', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'fetching'],
          phase: 'sync',
        },
        {
          description: 'await pauses fetchData! Rest of function queued as microtask.',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: ['fetchData continuation'],
          macroQueue: [],
          output: ['start', 'fetching'],
          phase: 'sync',
        },
        {
          description: "console.log('end') runs - script continues after await!",
          codeLine: 8,
          callStack: ['<script>', 'console.log'],
          microQueue: ['fetchData continuation'],
          macroQueue: [],
          output: ['start', 'fetching', 'end'],
          phase: 'sync',
        },
        {
          description: 'Sync code done. Microtask queue processed.',
          codeLine: -1,
          callStack: [],
          microQueue: ['fetchData continuation'],
          macroQueue: [],
          output: ['start', 'fetching', 'end'],
          phase: 'idle',
        },
        {
          description: 'fetchData resumes after await, logs "done"',
          codeLine: 3,
          callStack: ['fetchData continuation'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'fetching', 'end', 'done'],
          phase: 'micro',
        },
        {
          description: 'All complete!',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'fetching', 'end', 'done'],
          phase: 'idle',
        },
      ],
      insight: 'await PAUSES the async function and queues its continuation as a microtask. Code AFTER the call continues immediately!'
    },
    {
      id: 'nested-timeout',
      title: 'Nested setTimeout',
      code: [
        "console.log('start');",
        '',
        'setTimeout(() => {',
        "  console.log('outer');",
        '  setTimeout(() => {',
        "    console.log('inner');",
        '  }, 0);',
        '}, 0);',
        '',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'Outer setTimeout registered, callback queued as macrotask',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: ['outer cb'],
          output: ['start'],
          phase: 'sync',
          activeWebApi: 'setTimeout',
        },
        {
          description: "console.log('end') runs",
          codeLine: 9,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: ['outer cb'],
          output: ['start', 'end'],
          phase: 'sync',
        },
        {
          description: 'Sync done. Event loop picks ONE macrotask.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: ['outer cb'],
          output: ['start', 'end'],
          phase: 'idle',
        },
        {
          description: 'Outer callback runs, logs "outer"',
          codeLine: 3,
          callStack: ['outer cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'outer'],
          phase: 'macro',
        },
        {
          description: 'Inner setTimeout registered during outer callback!',
          codeLine: 4,
          callStack: ['outer cb'],
          microQueue: [],
          macroQueue: ['inner cb'],
          output: ['start', 'end', 'outer'],
          phase: 'macro',
          activeWebApi: 'setTimeout',
        },
        {
          description: 'Outer callback done. Check microtasks (empty), then next macrotask.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: ['inner cb'],
          output: ['start', 'end', 'outer'],
          phase: 'idle',
        },
        {
          description: 'Inner callback runs, logs "inner"',
          codeLine: 5,
          callStack: ['inner cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'outer', 'inner'],
          phase: 'macro',
        },
        {
          description: 'All done!',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'outer', 'inner'],
          phase: 'idle',
        },
      ],
      insight: 'Nested setTimeout creates a new macrotask. The event loop runs ONE macrotask per iteration, then checks all microtasks.'
    },
  ],
  advanced: [
    {
      id: 'micro-in-macro',
      title: 'Microtask in Macrotask',
      code: [
        "console.log('start');",
        '',
        'setTimeout(() => {',
        "  console.log('timeout');",
        "  Promise.resolve().then(() => {",
        "    console.log('promise in timeout');",
        '  });',
        '}, 0);',
        '',
        "Promise.resolve().then(() => {",
        "  console.log('promise');",
        '});',
        '',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'setTimeout queues macrotask',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['start'],
          phase: 'sync',
          activeWebApi: 'setTimeout',
        },
        {
          description: 'Promise.then() queues microtask',
          codeLine: 9,
          callStack: ['<script>'],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: "console.log('end') runs",
          codeLine: 13,
          callStack: ['<script>', 'console.log'],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['start', 'end'],
          phase: 'sync',
        },
        {
          description: 'Sync done. Process ALL microtasks first!',
          codeLine: -1,
          callStack: [],
          microQueue: ['promise cb'],
          macroQueue: ['timeout cb'],
          output: ['start', 'end'],
          phase: 'idle',
        },
        {
          description: 'Microtask runs: logs "promise"',
          codeLine: 10,
          callStack: ['promise cb'],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['start', 'end', 'promise'],
          phase: 'micro',
        },
        {
          description: 'Microtask queue empty. Now process ONE macrotask.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: ['timeout cb'],
          output: ['start', 'end', 'promise'],
          phase: 'idle',
        },
        {
          description: 'Macrotask runs: logs "timeout"',
          codeLine: 3,
          callStack: ['timeout cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'promise', 'timeout'],
          phase: 'macro',
        },
        {
          description: 'Inside macrotask: Promise queues NEW microtask!',
          codeLine: 4,
          callStack: ['timeout cb'],
          microQueue: ['nested promise cb'],
          macroQueue: [],
          output: ['start', 'end', 'promise', 'timeout'],
          phase: 'macro',
        },
        {
          description: 'Macrotask done. Check microtasks - there is one!',
          codeLine: -1,
          callStack: [],
          microQueue: ['nested promise cb'],
          macroQueue: [],
          output: ['start', 'end', 'promise', 'timeout'],
          phase: 'idle',
        },
        {
          description: 'Nested microtask runs: logs "promise in timeout"',
          codeLine: 5,
          callStack: ['nested promise cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'promise', 'timeout', 'promise in timeout'],
          phase: 'micro',
        },
        {
          description: 'All done!',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'promise', 'timeout', 'promise in timeout'],
          phase: 'idle',
        },
      ],
      insight: 'Microtasks created DURING a macrotask run BEFORE the next macrotask! Each macrotask gets its own microtask checkpoint.'
    },
    {
      id: 'queue-microtask',
      title: 'queueMicrotask',
      code: [
        "console.log('1');",
        '',
        'queueMicrotask(() => {',
        "  console.log('microtask 1');",
        '  queueMicrotask(() => {',
        "    console.log('microtask 2');",
        '  });',
        '});',
        '',
        "console.log('2');",
      ],
      steps: [
        {
          description: 'Script starts.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('1') runs",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'queueMicrotask adds callback directly to microtask queue',
          codeLine: 2,
          callStack: ['<script>'],
          microQueue: ['microtask 1'],
          macroQueue: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: "console.log('2') runs",
          codeLine: 9,
          callStack: ['<script>', 'console.log'],
          microQueue: ['microtask 1'],
          macroQueue: [],
          output: ['1', '2'],
          phase: 'sync',
        },
        {
          description: 'Sync done. Process microtask queue.',
          codeLine: -1,
          callStack: [],
          microQueue: ['microtask 1'],
          macroQueue: [],
          output: ['1', '2'],
          phase: 'idle',
        },
        {
          description: 'First microtask runs, logs "microtask 1"',
          codeLine: 3,
          callStack: ['microtask 1'],
          microQueue: [],
          macroQueue: [],
          output: ['1', '2', 'microtask 1'],
          phase: 'micro',
        },
        {
          description: 'First microtask queues ANOTHER microtask!',
          codeLine: 4,
          callStack: ['microtask 1'],
          microQueue: ['microtask 2'],
          macroQueue: [],
          output: ['1', '2', 'microtask 1'],
          phase: 'micro',
        },
        {
          description: 'First microtask done. Queue not empty - continue!',
          codeLine: -1,
          callStack: [],
          microQueue: ['microtask 2'],
          macroQueue: [],
          output: ['1', '2', 'microtask 1'],
          phase: 'micro',
        },
        {
          description: 'Second microtask runs, logs "microtask 2"',
          codeLine: 5,
          callStack: ['microtask 2'],
          microQueue: [],
          macroQueue: [],
          output: ['1', '2', 'microtask 1', 'microtask 2'],
          phase: 'micro',
        },
        {
          description: 'All done!',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['1', '2', 'microtask 1', 'microtask 2'],
          phase: 'idle',
        },
      ],
      insight: 'queueMicrotask() is like Promise.then() but more explicit. Microtasks can queue more microtasks - all run before ANY macrotask!'
    },
    {
      id: 'starvation',
      title: 'Microtask Starvation',
      code: [
        "console.log('start');",
        '',
        'function recursive() {',
        '  return Promise.resolve().then(() => {',
        '    // This would starve macrotasks!',
        '    // recursive();  // Dangerous!',
        "    console.log('micro');",
        '  });',
        '}',
        '',
        "setTimeout(() => console.log('macro'), 0);",
        'recursive();',
        "console.log('end');",
      ],
      steps: [
        {
          description: 'Script starts.',
          codeLine: -1,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "console.log('start') runs",
          codeLine: 0,
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          macroQueue: [],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: 'setTimeout queues macrotask',
          codeLine: 10,
          callStack: ['<script>'],
          microQueue: [],
          macroQueue: ['macro cb'],
          output: ['start'],
          phase: 'sync',
          activeWebApi: 'setTimeout',
        },
        {
          description: 'recursive() called, queues microtask via Promise.then()',
          codeLine: 11,
          callStack: ['<script>', 'recursive'],
          microQueue: ['recursive micro'],
          macroQueue: ['macro cb'],
          output: ['start'],
          phase: 'sync',
        },
        {
          description: "console.log('end') runs",
          codeLine: 12,
          callStack: ['<script>', 'console.log'],
          microQueue: ['recursive micro'],
          macroQueue: ['macro cb'],
          output: ['start', 'end'],
          phase: 'sync',
        },
        {
          description: 'Sync done. ALL microtasks run first!',
          codeLine: -1,
          callStack: [],
          microQueue: ['recursive micro'],
          macroQueue: ['macro cb'],
          output: ['start', 'end'],
          phase: 'idle',
        },
        {
          description: 'Microtask runs, logs "micro"',
          codeLine: 6,
          callStack: ['recursive micro'],
          microQueue: [],
          macroQueue: ['macro cb'],
          output: ['start', 'end', 'micro'],
          phase: 'micro',
        },
        {
          description: 'Microtask queue empty. Now run macrotask.',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: ['macro cb'],
          output: ['start', 'end', 'micro'],
          phase: 'idle',
        },
        {
          description: 'Macrotask runs, logs "macro"',
          codeLine: 10,
          callStack: ['macro cb'],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'micro', 'macro'],
          phase: 'macro',
        },
        {
          description: 'All done!',
          codeLine: -1,
          callStack: [],
          microQueue: [],
          macroQueue: [],
          output: ['start', 'end', 'micro', 'macro'],
          phase: 'idle',
        },
      ],
      insight: 'DANGER: Infinite microtasks block macrotasks forever! This is "microtask starvation". setTimeout, DOM events, etc. would never run.'
    },
  ],
}

export function EventLoopViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  // Auto-scroll to highlighted line
  useEffect(() => {
    const highlightedLine = currentStep.codeLine
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return '#a855f7'
      case 'micro': return '#a855f7'
      case 'macro': return '#f59e0b'
      case 'idle': return '#555'
    }
  }

  const getEventLoopClass = () => {
    if (currentStep.phase === 'idle') return styles.idle
    if (currentStep.phase === 'micro' || currentStep.phase === 'macro') return styles.active
    return ''
  }

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className={styles.vizContainer}>
        {/* Call Stack */}
        <div className={`${styles.neonBox} ${styles.callStackBox}`}>
          <div className={styles.neonBoxHeader}>Call Stack</div>
          <div className={styles.neonBoxInner}>
            <AnimatePresence mode="popLayout">
              {currentStep.callStack.length === 0 ? (
                <div className={styles.emptyStack}>(empty)</div>
              ) : (
                currentStep.callStack.slice().reverse().map((item, i) => (
                  <motion.div
                    key={item + i}
                    className={styles.stackItem}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                  >
                    {item}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Web APIs */}
        <div className={`${styles.neonBox} ${styles.webApisBox}`}>
          <div className={styles.neonBoxHeader}>Web APIs</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.webApisGrid}>
              {webApis.map((api) => (
                <div
                  key={api.name}
                  className={`${styles.webApiItem} ${
                    currentStep.activeWebApi === api.name ? styles.active : ''
                  } ${api.highlight ? styles.highlight : ''}`}
                >
                  {api.name}
                </div>
              ))}
              <div className={styles.manyMore}>Many more...</div>
            </div>
          </div>
        </div>

        {/* Event Loop */}
        <div className={`${styles.neonBox} ${styles.eventLoopBox}`}>
          <div className={styles.neonBoxHeader}>Event Loop</div>
          <div className={styles.neonBoxInner}>
            <div className={`${styles.eventLoopIcon} ${getEventLoopClass()}`}>
              <RefreshCw size={28} />
            </div>
          </div>
        </div>

        {/* Task Queue (Macrotasks) */}
        <div className={`${styles.neonBox} ${styles.taskQueueBox}`}>
          <div className={styles.neonBoxHeader}>Task Queue</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {currentStep.macroQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  currentStep.macroQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className={styles.macroItem}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Microtask Queue */}
        <div className={`${styles.neonBox} ${styles.microtaskBox}`}>
          <div className={styles.neonBoxHeader}>Microtask Queue</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {currentStep.microQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  currentStep.microQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className={styles.microItem}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelHeaderLeft}>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase === 'sync' ? 'Sync' :
             currentStep.phase === 'micro' ? 'Microtask' :
             currentStep.phase === 'macro' ? 'Macrotask' : 'Idle'}
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Output Section */}
      <div className={styles.outputSection}>
        <div className={styles.outputHeader}>Output</div>
        <div className={styles.outputContent}>
          {currentStep.output.length === 0 ? (
            <span className={styles.outputEmpty}>—</span>
          ) : (
            currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className={styles.outputItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          ↻ Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
