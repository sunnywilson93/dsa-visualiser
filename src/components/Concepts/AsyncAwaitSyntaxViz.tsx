'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, CheckCircle } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface AsyncFunction {
  name: string
  state: 'running' | 'suspended' | 'completed'
  awaitLine?: number
}

interface Step {
  description: string
  codeLine: number
  asyncFunctions: AsyncFunction[]
  callStack: string[]
  microQueue: string[]
  output: string[]
  phase: 'sync' | 'await' | 'resume' | 'complete'
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
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'basic-await',
      title: 'Basic Await',
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
          description: 'Script starts. The async function is defined but not called yet.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('start') runs synchronously - first output!",
          codeLine: 6,
          asyncFunctions: [],
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          output: ['start'],
          phase: 'sync'
        },
        {
          description: 'fetchData() is called - the async function begins executing.',
          codeLine: 7,
          asyncFunctions: [{ name: 'fetchData', state: 'running' }],
          callStack: ['<script>', 'fetchData'],
          microQueue: [],
          output: ['start'],
          phase: 'sync'
        },
        {
          description: "Inside fetchData: console.log('fetching') runs synchronously (before await).",
          codeLine: 1,
          asyncFunctions: [{ name: 'fetchData', state: 'running' }],
          callStack: ['<script>', 'fetchData', 'console.log'],
          microQueue: [],
          output: ['start', 'fetching'],
          phase: 'sync'
        },
        {
          description: "AWAIT! The function SUSPENDS here. The rest becomes a microtask continuation.",
          codeLine: 2,
          asyncFunctions: [{ name: 'fetchData', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>'],
          microQueue: ['fetchData continuation'],
          output: ['start', 'fetching'],
          phase: 'await'
        },
        {
          description: "Control returns to caller! console.log('end') runs BEFORE 'done'.",
          codeLine: 8,
          asyncFunctions: [{ name: 'fetchData', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>', 'console.log'],
          microQueue: ['fetchData continuation'],
          output: ['start', 'fetching', 'end'],
          phase: 'sync'
        },
        {
          description: 'Synchronous code complete. Event loop checks microtask queue.',
          codeLine: -1,
          asyncFunctions: [{ name: 'fetchData', state: 'suspended', awaitLine: 2 }],
          callStack: [],
          microQueue: ['fetchData continuation'],
          output: ['start', 'fetching', 'end'],
          phase: 'await'
        },
        {
          description: "fetchData RESUMES from microtask queue. console.log('done') runs.",
          codeLine: 3,
          asyncFunctions: [{ name: 'fetchData', state: 'running' }],
          callStack: ['fetchData continuation'],
          microQueue: [],
          output: ['start', 'fetching', 'end', 'done'],
          phase: 'resume'
        },
        {
          description: 'fetchData completes. All done!',
          codeLine: 4,
          asyncFunctions: [{ name: 'fetchData', state: 'completed' }],
          callStack: [],
          microQueue: [],
          output: ['start', 'fetching', 'end', 'done'],
          phase: 'complete'
        }
      ],
      insight: "await PAUSES the async function and schedules its continuation as a microtask. Code AFTER the call continues immediately - that's why 'end' prints before 'done'!"
    },
    {
      id: 'no-await',
      title: 'Without Await',
      code: [
        'async function syncTask() {',
        "  console.log('inside');",
        "  return 'done';",
        '}',
        '',
        "console.log('before');",
        'syncTask();',
        "console.log('after');",
      ],
      steps: [
        {
          description: 'Script starts. The async function is defined.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('before') runs synchronously.",
          codeLine: 5,
          asyncFunctions: [],
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          output: ['before'],
          phase: 'sync'
        },
        {
          description: 'syncTask() is called - async function starts.',
          codeLine: 6,
          asyncFunctions: [{ name: 'syncTask', state: 'running' }],
          callStack: ['<script>', 'syncTask'],
          microQueue: [],
          output: ['before'],
          phase: 'sync'
        },
        {
          description: "Inside syncTask: console.log('inside') runs. No await = no pause!",
          codeLine: 1,
          asyncFunctions: [{ name: 'syncTask', state: 'running' }],
          callStack: ['<script>', 'syncTask', 'console.log'],
          microQueue: [],
          output: ['before', 'inside'],
          phase: 'sync'
        },
        {
          description: "return 'done' - function completes synchronously (no await used).",
          codeLine: 2,
          asyncFunctions: [{ name: 'syncTask', state: 'completed' }],
          callStack: ['<script>'],
          microQueue: [],
          output: ['before', 'inside'],
          phase: 'sync'
        },
        {
          description: "console.log('after') runs. Output is in order!",
          codeLine: 7,
          asyncFunctions: [{ name: 'syncTask', state: 'completed' }],
          callStack: ['<script>', 'console.log'],
          microQueue: [],
          output: ['before', 'inside', 'after'],
          phase: 'sync'
        },
        {
          description: 'All done. Without await, async function runs synchronously!',
          codeLine: -1,
          asyncFunctions: [{ name: 'syncTask', state: 'completed' }],
          callStack: [],
          microQueue: [],
          output: ['before', 'inside', 'after'],
          phase: 'complete'
        }
      ],
      insight: 'Without await, an async function runs completely synchronously! The async keyword only enables await - it doesn\'t automatically make code asynchronous.'
    }
  ],
  intermediate: [
    {
      id: 'multiple-awaits',
      title: 'Multiple Awaits',
      code: [
        'async function process() {',
        "  console.log('step 1');",
        '  await Promise.resolve();',
        "  console.log('step 2');",
        '  await Promise.resolve();',
        "  console.log('step 3');",
        '}',
        '',
        'process();',
        "console.log('outside');",
      ],
      steps: [
        {
          description: 'Script starts. async function is defined.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: 'process() is called - async function starts executing.',
          codeLine: 8,
          asyncFunctions: [{ name: 'process', state: 'running' }],
          callStack: ['<script>', 'process'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('step 1') runs synchronously (before first await).",
          codeLine: 1,
          asyncFunctions: [{ name: 'process', state: 'running' }],
          callStack: ['<script>', 'process', 'console.log'],
          microQueue: [],
          output: ['step 1'],
          phase: 'sync'
        },
        {
          description: 'FIRST AWAIT! process() suspends. Continuation queued as microtask.',
          codeLine: 2,
          asyncFunctions: [{ name: 'process', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>'],
          microQueue: ['process continuation #1'],
          output: ['step 1'],
          phase: 'await'
        },
        {
          description: "Control returns to script. console.log('outside') runs!",
          codeLine: 9,
          asyncFunctions: [{ name: 'process', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>', 'console.log'],
          microQueue: ['process continuation #1'],
          output: ['step 1', 'outside'],
          phase: 'sync'
        },
        {
          description: 'Script complete. Event loop processes microtask queue.',
          codeLine: -1,
          asyncFunctions: [{ name: 'process', state: 'suspended', awaitLine: 2 }],
          callStack: [],
          microQueue: ['process continuation #1'],
          output: ['step 1', 'outside'],
          phase: 'await'
        },
        {
          description: "process() RESUMES. console.log('step 2') runs.",
          codeLine: 3,
          asyncFunctions: [{ name: 'process', state: 'running' }],
          callStack: ['process continuation #1'],
          microQueue: [],
          output: ['step 1', 'outside', 'step 2'],
          phase: 'resume'
        },
        {
          description: 'SECOND AWAIT! process() suspends AGAIN. New continuation queued.',
          codeLine: 4,
          asyncFunctions: [{ name: 'process', state: 'suspended', awaitLine: 4 }],
          callStack: [],
          microQueue: ['process continuation #2'],
          output: ['step 1', 'outside', 'step 2'],
          phase: 'await'
        },
        {
          description: "process() RESUMES from second await. console.log('step 3') runs.",
          codeLine: 5,
          asyncFunctions: [{ name: 'process', state: 'running' }],
          callStack: ['process continuation #2'],
          microQueue: [],
          output: ['step 1', 'outside', 'step 2', 'step 3'],
          phase: 'resume'
        },
        {
          description: 'process() completes. Each await created a suspension point!',
          codeLine: 6,
          asyncFunctions: [{ name: 'process', state: 'completed' }],
          callStack: [],
          microQueue: [],
          output: ['step 1', 'outside', 'step 2', 'step 3'],
          phase: 'complete'
        }
      ],
      insight: 'Each await creates a NEW suspension point. The function can pause and resume multiple times, each time queuing a continuation as a microtask.'
    },
    {
      id: 'nested-async',
      title: 'Nested Async Calls',
      code: [
        'async function inner() {',
        "  console.log('inner before');",
        '  await Promise.resolve();',
        "  console.log('inner after');",
        '}',
        '',
        'async function outer() {',
        "  console.log('outer before');",
        '  await inner();',
        "  console.log('outer after');",
        '}',
        '',
        'outer();',
        "console.log('main');",
      ],
      steps: [
        {
          description: 'Script starts. Both async functions are defined.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: 'outer() is called.',
          codeLine: 12,
          asyncFunctions: [{ name: 'outer', state: 'running' }],
          callStack: ['<script>', 'outer'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('outer before') runs.",
          codeLine: 7,
          asyncFunctions: [{ name: 'outer', state: 'running' }],
          callStack: ['<script>', 'outer', 'console.log'],
          microQueue: [],
          output: ['outer before'],
          phase: 'sync'
        },
        {
          description: 'await inner() - inner() is called first.',
          codeLine: 8,
          asyncFunctions: [
            { name: 'outer', state: 'running' },
            { name: 'inner', state: 'running' }
          ],
          callStack: ['<script>', 'outer', 'inner'],
          microQueue: [],
          output: ['outer before'],
          phase: 'sync'
        },
        {
          description: "Inside inner: console.log('inner before') runs.",
          codeLine: 1,
          asyncFunctions: [
            { name: 'outer', state: 'running' },
            { name: 'inner', state: 'running' }
          ],
          callStack: ['<script>', 'outer', 'inner', 'console.log'],
          microQueue: [],
          output: ['outer before', 'inner before'],
          phase: 'sync'
        },
        {
          description: "inner() hits await! It suspends. outer() also suspends (awaiting inner's result).",
          codeLine: 2,
          asyncFunctions: [
            { name: 'outer', state: 'suspended', awaitLine: 8 },
            { name: 'inner', state: 'suspended', awaitLine: 2 }
          ],
          callStack: ['<script>'],
          microQueue: ['inner continuation'],
          output: ['outer before', 'inner before'],
          phase: 'await'
        },
        {
          description: "Control returns to main script. console.log('main') runs!",
          codeLine: 13,
          asyncFunctions: [
            { name: 'outer', state: 'suspended', awaitLine: 8 },
            { name: 'inner', state: 'suspended', awaitLine: 2 }
          ],
          callStack: ['<script>', 'console.log'],
          microQueue: ['inner continuation'],
          output: ['outer before', 'inner before', 'main'],
          phase: 'sync'
        },
        {
          description: 'Script complete. Process microtask queue.',
          codeLine: -1,
          asyncFunctions: [
            { name: 'outer', state: 'suspended', awaitLine: 8 },
            { name: 'inner', state: 'suspended', awaitLine: 2 }
          ],
          callStack: [],
          microQueue: ['inner continuation'],
          output: ['outer before', 'inner before', 'main'],
          phase: 'await'
        },
        {
          description: "inner() resumes. console.log('inner after') runs.",
          codeLine: 3,
          asyncFunctions: [
            { name: 'outer', state: 'suspended', awaitLine: 8 },
            { name: 'inner', state: 'running' }
          ],
          callStack: ['inner continuation'],
          microQueue: [],
          output: ['outer before', 'inner before', 'main', 'inner after'],
          phase: 'resume'
        },
        {
          description: 'inner() completes. This resolves outer\'s await!',
          codeLine: 4,
          asyncFunctions: [
            { name: 'outer', state: 'suspended', awaitLine: 8 },
            { name: 'inner', state: 'completed' }
          ],
          callStack: [],
          microQueue: ['outer continuation'],
          output: ['outer before', 'inner before', 'main', 'inner after'],
          phase: 'await'
        },
        {
          description: "outer() resumes. console.log('outer after') runs.",
          codeLine: 9,
          asyncFunctions: [
            { name: 'outer', state: 'running' },
            { name: 'inner', state: 'completed' }
          ],
          callStack: ['outer continuation'],
          microQueue: [],
          output: ['outer before', 'inner before', 'main', 'inner after', 'outer after'],
          phase: 'resume'
        },
        {
          description: 'outer() completes. All done!',
          codeLine: 10,
          asyncFunctions: [
            { name: 'outer', state: 'completed' },
            { name: 'inner', state: 'completed' }
          ],
          callStack: [],
          microQueue: [],
          output: ['outer before', 'inner before', 'main', 'inner after', 'outer after'],
          phase: 'complete'
        }
      ],
      insight: 'When you await another async function, both suspend! The outer waits for inner to complete. When inner resolves, outer\'s continuation is queued.'
    }
  ],
  advanced: [
    {
      id: 'promise-creation',
      title: 'Await Creates Promise',
      code: [
        'async function demo() {',
        "  console.log('a');",
        "  await 'hello';  // await wraps in Promise!",
        "  console.log('b');",
        '}',
        '',
        'demo();',
        "console.log('c');",
      ],
      steps: [
        {
          description: 'Script starts. async function is defined.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: 'demo() is called.',
          codeLine: 6,
          asyncFunctions: [{ name: 'demo', state: 'running' }],
          callStack: ['<script>', 'demo'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('a') runs synchronously.",
          codeLine: 1,
          asyncFunctions: [{ name: 'demo', state: 'running' }],
          callStack: ['<script>', 'demo', 'console.log'],
          microQueue: [],
          output: ['a'],
          phase: 'sync'
        },
        {
          description: "await 'hello' - JavaScript wraps this in Promise.resolve('hello')!",
          codeLine: 2,
          asyncFunctions: [{ name: 'demo', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>'],
          microQueue: ['demo continuation'],
          output: ['a'],
          phase: 'await'
        },
        {
          description: "Even though 'hello' resolves immediately, await still suspends!",
          codeLine: 7,
          asyncFunctions: [{ name: 'demo', state: 'suspended', awaitLine: 2 }],
          callStack: ['<script>', 'console.log'],
          microQueue: ['demo continuation'],
          output: ['a', 'c'],
          phase: 'sync'
        },
        {
          description: 'Script complete. Process microtask.',
          codeLine: -1,
          asyncFunctions: [{ name: 'demo', state: 'suspended', awaitLine: 2 }],
          callStack: [],
          microQueue: ['demo continuation'],
          output: ['a', 'c'],
          phase: 'await'
        },
        {
          description: "demo() resumes. console.log('b') runs.",
          codeLine: 3,
          asyncFunctions: [{ name: 'demo', state: 'running' }],
          callStack: ['demo continuation'],
          microQueue: [],
          output: ['a', 'c', 'b'],
          phase: 'resume'
        },
        {
          description: 'demo() completes.',
          codeLine: 4,
          asyncFunctions: [{ name: 'demo', state: 'completed' }],
          callStack: [],
          microQueue: [],
          output: ['a', 'c', 'b'],
          phase: 'complete'
        }
      ],
      insight: 'await ALWAYS creates a Promise internally (via Promise.resolve). Even for immediate values like strings, await suspends and schedules a microtask!'
    },
    {
      id: 'return-value',
      title: 'Async Return Value',
      code: [
        'async function getValue() {',
        "  return 'result';",
        '}',
        '',
        'async function main() {',
        "  console.log('before');",
        '  const val = await getValue();',
        '  console.log(val);',
        '}',
        '',
        'main();',
        "console.log('after');",
      ],
      steps: [
        {
          description: 'Script starts. Both async functions are defined.',
          codeLine: -1,
          asyncFunctions: [],
          callStack: ['<script>'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: 'main() is called.',
          codeLine: 10,
          asyncFunctions: [{ name: 'main', state: 'running' }],
          callStack: ['<script>', 'main'],
          microQueue: [],
          output: [],
          phase: 'sync'
        },
        {
          description: "console.log('before') runs.",
          codeLine: 5,
          asyncFunctions: [{ name: 'main', state: 'running' }],
          callStack: ['<script>', 'main', 'console.log'],
          microQueue: [],
          output: ['before'],
          phase: 'sync'
        },
        {
          description: "getValue() is called. It returns 'result' immediately (no await inside).",
          codeLine: 6,
          asyncFunctions: [
            { name: 'main', state: 'running' },
            { name: 'getValue', state: 'running' }
          ],
          callStack: ['<script>', 'main', 'getValue'],
          microQueue: [],
          output: ['before'],
          phase: 'sync'
        },
        {
          description: "getValue() returns. Its return value is wrapped in a Promise automatically!",
          codeLine: 1,
          asyncFunctions: [
            { name: 'main', state: 'running' },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: ['<script>', 'main'],
          microQueue: [],
          output: ['before'],
          phase: 'sync'
        },
        {
          description: 'await the returned Promise. main() suspends, continuation queued.',
          codeLine: 6,
          asyncFunctions: [
            { name: 'main', state: 'suspended', awaitLine: 6 },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: ['<script>'],
          microQueue: ['main continuation'],
          output: ['before'],
          phase: 'await'
        },
        {
          description: "console.log('after') runs while main() is suspended.",
          codeLine: 11,
          asyncFunctions: [
            { name: 'main', state: 'suspended', awaitLine: 6 },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: ['<script>', 'console.log'],
          microQueue: ['main continuation'],
          output: ['before', 'after'],
          phase: 'sync'
        },
        {
          description: 'Script complete. Process microtask.',
          codeLine: -1,
          asyncFunctions: [
            { name: 'main', state: 'suspended', awaitLine: 6 },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: [],
          microQueue: ['main continuation'],
          output: ['before', 'after'],
          phase: 'await'
        },
        {
          description: "main() resumes. val is now 'result'. console.log(val) runs.",
          codeLine: 7,
          asyncFunctions: [
            { name: 'main', state: 'running' },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: ['main continuation'],
          microQueue: [],
          output: ['before', 'after', 'result'],
          phase: 'resume'
        },
        {
          description: 'main() completes.',
          codeLine: 8,
          asyncFunctions: [
            { name: 'main', state: 'completed' },
            { name: 'getValue', state: 'completed' }
          ],
          callStack: [],
          microQueue: [],
          output: ['before', 'after', 'result'],
          phase: 'complete'
        }
      ],
      insight: 'async functions ALWAYS return a Promise. Even "return \'result\'" becomes a Promise that resolves with \'result\'. await unwraps that Promise to get the value.'
    }
  ]
}

export function AsyncAwaitSyntaxViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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
      case 'sync': return 'var(--color-purple-500)'
      case 'await': return 'var(--color-amber-500)'
      case 'resume': return 'var(--color-emerald-500)'
      case 'complete': return '#6b7280'
    }
  }

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return 'Synchronous'
      case 'await': return 'Suspended'
      case 'resume': return 'Resuming'
      case 'complete': return 'Complete'
    }
  }

  const getStateColor = (state: AsyncFunction['state']) => {
    switch (state) {
      case 'running': return 'var(--color-emerald-500)'
      case 'suspended': return 'var(--color-amber-500)'
      case 'completed': return '#6b7280'
    }
  }

  const getStateIcon = (state: AsyncFunction['state']) => {
    switch (state) {
      case 'running': return <Play size={14} className="inline" />
      case 'suspended': return <Pause size={14} className="inline" />
      case 'completed': return <CheckCircle size={14} className="inline" />
    }
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

      {/* Main grid: Code + State panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.codeHeader}>
            <span>Code</span>
            <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
              {getPhaseLabel(currentStep.phase)}
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

        {/* Async Function State Panel */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
          <div className="mb-3 text-center text-sm font-semibold text-purple-400">
            Async Function State
          </div>
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {currentStep.asyncFunctions.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  No async functions running
                </div>
              ) : (
                currentStep.asyncFunctions.map((fn, i) => (
                  <motion.div
                    key={fn.name}
                    className="rounded-lg border-2 px-4 py-3"
                    style={{
                      borderColor: getStateColor(fn.state),
                      background: `${getStateColor(fn.state)}15`
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-white">
                        {fn.name}()
                      </span>
                      <span
                        className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{
                          background: `${getStateColor(fn.state)}30`,
                          color: getStateColor(fn.state)
                        }}
                      >
                        {getStateIcon(fn.state)}
                        {fn.state.toUpperCase()}
                      </span>
                    </div>
                    {fn.state === 'suspended' && fn.awaitLine !== undefined && (
                      <motion.div
                        className="mt-2 text-xs text-amber-300"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Paused at await (line {fn.awaitLine + 1})
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Call Stack and Microtask Queue side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Call Stack */}
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="mb-3 text-center text-sm font-semibold text-orange-400">
            Call Stack
          </div>
          <div className="flex min-h-[100px] flex-col gap-1.5">
            <AnimatePresence mode="popLayout">
              {currentStep.callStack.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-sm text-gray-600">
                  (empty)
                </div>
              ) : (
                currentStep.callStack.slice().reverse().map((item, i) => (
                  <motion.div
                    key={`${item}-${i}`}
                    className="rounded-md border border-orange-500/40 bg-orange-500/15 px-3 py-2 text-center font-mono text-xs text-orange-300"
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

        {/* Microtask Queue */}
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
          <div className="mb-3 text-center text-sm font-semibold text-sky-400">
            Microtask Queue
          </div>
          <div className="flex min-h-[100px] flex-col gap-1.5">
            <AnimatePresence mode="popLayout">
              {currentStep.microQueue.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-sm text-gray-600">
                  (empty)
                </div>
              ) : (
                currentStep.microQueue.map((item, i) => (
                  <motion.div
                    key={`${item}-${i}`}
                    className="rounded-md border border-sky-500/40 bg-sky-500/15 px-3 py-2 text-center font-mono text-xs text-sky-300"
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

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Console Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>-</span>
          ) : (
            currentStep.output.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.outputLine}
              >
                {o}
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
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
