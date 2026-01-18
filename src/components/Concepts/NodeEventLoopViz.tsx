import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './NodeEventLoopViz.module.css'

// Action type colors for visual distinction
const actionColors: Record<string, { bg: string; border: string; text: string }> = {
  setTimeout: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  setInterval: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  timeout: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  setImmediate: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', text: '#60a5fa' },
  immediate: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', text: '#60a5fa' },
  Promise: { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.5)', text: '#f472b6' },
  promise: { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.5)', text: '#f472b6' },
  nextTick: { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.5)', text: '#c084fc' },
  recurse: { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.5)', text: '#c084fc' },
  io: { bg: 'rgba(6, 182, 212, 0.2)', border: 'rgba(6, 182, 212, 0.5)', text: '#22d3ee' },
  file: { bg: 'rgba(6, 182, 212, 0.2)', border: 'rgba(6, 182, 212, 0.5)', text: '#22d3ee' },
  network: { bg: 'rgba(6, 182, 212, 0.2)', border: 'rgba(6, 182, 212, 0.5)', text: '#22d3ee' },
  close: { bg: 'rgba(100, 116, 139, 0.2)', border: 'rgba(100, 116, 139, 0.5)', text: '#94a3b8' },
  socket: { bg: 'rgba(100, 116, 139, 0.2)', border: 'rgba(100, 116, 139, 0.5)', text: '#94a3b8' },
}

function getActionColor(item: string): { bg: string; border: string; text: string } {
  const lowerItem = item.toLowerCase()
  for (const [key, colors] of Object.entries(actionColors)) {
    if (lowerItem.includes(key.toLowerCase())) {
      return colors
    }
  }
  // Default color
  return { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.3)', text: '#c4b5fd' }
}

interface PhaseQueue {
  name: string
  items: string[]
  active: boolean
}

interface Step {
  description: string
  codeLine: number
  phases: PhaseQueue[]
  nextTickQueue: string[]
  promiseQueue: string[]
  output: string[]
  currentPhase: string
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

const createPhases = (activePhase?: string): PhaseQueue[] => [
  { name: 'Timers', items: [], active: activePhase === 'timers' },
  { name: 'Pending', items: [], active: activePhase === 'pending' },
  { name: 'Poll', items: [], active: activePhase === 'poll' },
  { name: 'Check', items: [], active: activePhase === 'check' },
  { name: 'Close', items: [], active: activePhase === 'close' },
]

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'settimeout-vs-setimmediate',
      title: 'setTimeout vs setImmediate',
      code: [
        "setTimeout(() => {",
        "  console.log('timeout');",
        "}, 0);",
        "",
        "setImmediate(() => {",
        "  console.log('immediate');",
        "});",
        "",
        "console.log('sync');",
      ],
      steps: [
        {
          description: 'Script starts. Node.js event loop initializes.',
          codeLine: -1,
          phases: createPhases(),
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'setTimeout schedules callback in TIMERS phase',
          codeLine: 0,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'setImmediate schedules callback in CHECK phase',
          codeLine: 4,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: "console.log('sync') runs immediately",
          codeLine: 8,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['sync'],
          currentPhase: 'sync',
        },
        {
          description: 'Sync code done. Event loop starts. Order may vary!',
          codeLine: -1,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: true },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['sync'],
          currentPhase: 'timers',
        },
        {
          description: 'In main module: setTimeout and setImmediate order is NON-DETERMINISTIC',
          codeLine: -1,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['sync', 'timeout (or immediate)', 'immediate (or timeout)'],
          currentPhase: 'idle',
        },
      ],
      insight: 'In main module, setTimeout vs setImmediate order varies! Inside I/O callbacks, setImmediate always runs first.'
    },
    {
      id: 'six-phases',
      title: 'The 6 Phases',
      code: [
        '// Node.js Event Loop Phases:',
        '// 1. Timers: setTimeout, setInterval',
        '// 2. Pending: I/O callbacks deferred',
        '// 3. Idle/Prepare: internal use',
        '// 4. Poll: retrieve new I/O events',
        '// 5. Check: setImmediate callbacks',
        '// 6. Close: socket.on("close")',
      ],
      steps: [
        {
          description: 'Phase 1 - TIMERS: Execute setTimeout/setInterval callbacks',
          codeLine: 1,
          phases: [
            { name: 'Timers', items: ['setTimeout', 'setInterval'], active: true },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'timers',
        },
        {
          description: 'Phase 2 - PENDING: I/O callbacks deferred from previous cycle',
          codeLine: 2,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: ['deferred I/O'], active: true },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'pending',
        },
        {
          description: 'Phase 4 - POLL: Retrieve new I/O events (fs, network, etc.)',
          codeLine: 4,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: ['file read', 'network'], active: true },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'poll',
        },
        {
          description: 'Phase 5 - CHECK: setImmediate callbacks execute here',
          codeLine: 5,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['setImmediate'], active: true },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'check',
        },
        {
          description: 'Phase 6 - CLOSE: Close event callbacks (socket.destroy)',
          codeLine: 6,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: ['socket.close'], active: true },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'close',
        },
      ],
      insight: 'Node.js has 6 phases! process.nextTick and Promises run BETWEEN each phase.'
    },
  ],
  intermediate: [
    {
      id: 'nexttick-priority',
      title: 'process.nextTick Priority',
      code: [
        "Promise.resolve().then(() => {",
        "  console.log('promise');",
        "});",
        "",
        "process.nextTick(() => {",
        "  console.log('nextTick');",
        "});",
        "",
        "console.log('sync');",
      ],
      steps: [
        {
          description: 'Script starts executing',
          codeLine: -1,
          phases: createPhases(),
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'Promise.then() adds callback to Promise microtask queue',
          codeLine: 0,
          phases: createPhases(),
          nextTickQueue: [],
          promiseQueue: ['promise cb'],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'process.nextTick() adds callback to nextTick queue (HIGHER priority!)',
          codeLine: 4,
          phases: createPhases(),
          nextTickQueue: ['nextTick cb'],
          promiseQueue: ['promise cb'],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: "console.log('sync') runs",
          codeLine: 8,
          phases: createPhases(),
          nextTickQueue: ['nextTick cb'],
          promiseQueue: ['promise cb'],
          output: ['sync'],
          currentPhase: 'sync',
        },
        {
          description: 'Sync done. nextTick queue runs FIRST (before Promises!)',
          codeLine: 5,
          phases: createPhases(),
          nextTickQueue: [],
          promiseQueue: ['promise cb'],
          output: ['sync', 'nextTick'],
          currentPhase: 'nextTick',
        },
        {
          description: 'nextTick queue empty. Now Promise microtasks run.',
          codeLine: 1,
          phases: createPhases(),
          nextTickQueue: [],
          promiseQueue: [],
          output: ['sync', 'nextTick', 'promise'],
          currentPhase: 'microtask',
        },
      ],
      insight: 'process.nextTick() has HIGHER priority than Promises! It runs between every phase.'
    },
    {
      id: 'io-callback-order',
      title: 'I/O Callback Order',
      code: [
        "const fs = require('fs');",
        "",
        "fs.readFile('file.txt', () => {",
        "  setTimeout(() => {",
        "    console.log('timeout');",
        "  }, 0);",
        "",
        "  setImmediate(() => {",
        "    console.log('immediate');",
        "  });",
        "});",
      ],
      steps: [
        {
          description: 'fs.readFile schedules I/O operation',
          codeLine: 2,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: ['file read'], active: true },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'poll',
        },
        {
          description: 'File read completes. Inside I/O callback...',
          codeLine: 3,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: true },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'poll',
        },
        {
          description: 'setTimeout adds to Timers, setImmediate adds to Check',
          codeLine: 7,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: true },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: [],
          currentPhase: 'poll',
        },
        {
          description: 'Poll done. CHECK phase is NEXT! setImmediate runs first.',
          codeLine: 8,
          phases: [
            { name: 'Timers', items: ['timeout cb'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: true },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['immediate'],
          currentPhase: 'check',
        },
        {
          description: 'Next cycle: Timers phase, setTimeout runs',
          codeLine: 4,
          phases: [
            { name: 'Timers', items: [], active: true },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['immediate', 'timeout'],
          currentPhase: 'timers',
        },
      ],
      insight: 'Inside I/O callbacks, setImmediate ALWAYS runs before setTimeout because CHECK comes right after POLL!'
    },
  ],
  advanced: [
    {
      id: 'nexttick-starvation',
      title: 'nextTick Starvation',
      code: [
        "function recurse() {",
        "  process.nextTick(recurse);",
        "}",
        "",
        "recurse();",
        "",
        "// This NEVER runs!",
        "setImmediate(() => {",
        "  console.log('immediate');",
        "});",
      ],
      steps: [
        {
          description: 'recurse() calls process.nextTick(recurse)',
          codeLine: 4,
          phases: createPhases(),
          nextTickQueue: ['recurse'],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'setImmediate schedules callback for Check phase',
          codeLine: 7,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: ['recurse'],
          promiseQueue: [],
          output: [],
          currentPhase: 'sync',
        },
        {
          description: 'Sync done. nextTick queue processes...',
          codeLine: 1,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: ['recurse', 'recurse'],
          promiseQueue: [],
          output: [],
          currentPhase: 'nextTick',
        },
        {
          description: 'DANGER: Each nextTick adds another nextTick!',
          codeLine: 1,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: ['recurse', 'recurse', 'recurse', '...'],
          promiseQueue: [],
          output: [],
          currentPhase: 'nextTick',
        },
        {
          description: 'nextTick queue NEVER empties! Event loop phases STARVED!',
          codeLine: -1,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['immediate cb (BLOCKED!)'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: ['recurse', 'recurse', 'recurse', '...infinity'],
          promiseQueue: [],
          output: ['(nothing - server frozen!)'],
          currentPhase: 'nextTick',
        },
      ],
      insight: 'Recursive nextTick starves the event loop! I/O, timers, and setImmediate NEVER run. Use setImmediate for safe recursion.'
    },
    {
      id: 'mixed-async',
      title: 'Mixed Async Order',
      code: [
        "setImmediate(() => console.log('1'));",
        "setTimeout(() => console.log('2'), 0);",
        "Promise.resolve().then(() => console.log('3'));",
        "process.nextTick(() => console.log('4'));",
        "console.log('5');",
      ],
      steps: [
        {
          description: 'All async operations scheduled during sync phase',
          codeLine: 4,
          phases: [
            { name: 'Timers', items: ['log 2'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['log 1'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: ['log 4'],
          promiseQueue: ['log 3'],
          output: ['5'],
          currentPhase: 'sync',
        },
        {
          description: 'Sync done. nextTick runs FIRST (highest priority)',
          codeLine: 3,
          phases: [
            { name: 'Timers', items: ['log 2'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['log 1'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: ['log 3'],
          output: ['5', '4'],
          currentPhase: 'nextTick',
        },
        {
          description: 'Promise microtasks run SECOND',
          codeLine: 2,
          phases: [
            { name: 'Timers', items: ['log 2'], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['log 1'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['5', '4', '3'],
          currentPhase: 'microtask',
        },
        {
          description: 'Event loop starts. Timers phase (setTimeout)',
          codeLine: 1,
          phases: [
            { name: 'Timers', items: [], active: true },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: ['log 1'], active: false },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['5', '4', '3', '2'],
          currentPhase: 'timers',
        },
        {
          description: 'Check phase (setImmediate)',
          codeLine: 0,
          phases: [
            { name: 'Timers', items: [], active: false },
            { name: 'Pending', items: [], active: false },
            { name: 'Poll', items: [], active: false },
            { name: 'Check', items: [], active: true },
            { name: 'Close', items: [], active: false },
          ],
          nextTickQueue: [],
          promiseQueue: [],
          output: ['5', '4', '3', '2', '1'],
          currentPhase: 'check',
        },
      ],
      insight: 'Order: sync → nextTick → Promises → Timers → Check. nextTick always has highest priority!'
    },
  ],
}

export function NodeEventLoopViz() {
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

  const handleNext = useCallback(() => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }, [stepIndex, currentExample.steps.length])

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }, [stepIndex])

  const handleReset = useCallback(() => setStepIndex(0), [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        handleReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleReset])

  const isLastStep = stepIndex >= currentExample.steps.length - 1
  const progressPercent = ((stepIndex + 1) / currentExample.steps.length) * 100

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

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge}>
            {currentStep.currentPhase}
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

      {/* Priority Queues - Neon Boxes */}
      <div className={styles.priorityQueues}>
        <div className={`${styles.neonBox} ${styles.nextTickBox}`}>
          <div className={styles.neonBoxHeader}>process.nextTick</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {currentStep.nextTickQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  currentStep.nextTickQueue.map((item, i) => {
                    const colors = getActionColor(item)
                    return (
                      <motion.div
                        key={item + i}
                        className={styles.queueItem}
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        style={{
                          background: colors.bg,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        {item}
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className={`${styles.neonBox} ${styles.promiseBox}`}>
          <div className={styles.neonBoxHeader}>Promise Queue</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {currentStep.promiseQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  currentStep.promiseQueue.map((item, i) => {
                    const colors = getActionColor(item)
                    return (
                      <motion.div
                        key={item + i}
                        className={styles.queueItem}
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        style={{
                          background: colors.bg,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        {item}
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Event Loop Phases - Neon Box */}
      <div className={`${styles.neonBox} ${styles.phasesBox}`}>
        <div className={styles.neonBoxHeader}>Event Loop Phases</div>
        <div className={styles.neonBoxInner}>
          <div className={styles.phasesContainer}>
            {currentStep.phases.map((phase) => (
              <motion.div
                key={phase.name}
                className={`${styles.phase} ${phase.active ? styles.activePhase : ''}`}
                animate={{
                  scale: phase.active ? 1.02 : 1,
                  boxShadow: phase.active
                    ? '0 0 20px rgba(16, 185, 129, 0.3)'
                    : '0 0 0px rgba(0, 0, 0, 0)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.phaseName}>{phase.name}</div>
                <div className={styles.phaseContent}>
                  <AnimatePresence mode="popLayout">
                    {phase.items.length === 0 ? (
                      <span className={styles.emptyPhase}>-</span>
                    ) : (
                      phase.items.map((item, i) => {
                        const colors = getActionColor(item)
                        return (
                          <motion.div
                            key={item + i}
                            className={styles.phaseItem}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            style={{
                              background: colors.bg,
                              borderColor: colors.border,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {item}
                          </motion.div>
                        )
                      })
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Console Output</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.output}>
              <span className={styles.outputLabel}>Output:</span>
              {currentStep.output.map((item, i) => (
                <span key={i} className={styles.outputItem}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <span className={styles.progressText}>
          Step {stepIndex + 1} / {currentExample.steps.length}
        </span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.btnSecondary}
          onClick={handlePrev}
          disabled={stepIndex === 0}
        >
          ← Prev
        </button>
        <motion.button
          className={`${styles.btnPrimary} ${isLastStep ? styles.btnDone : ''}`}
          onClick={isLastStep ? handleReset : handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLastStep ? '✓ Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Keyboard hint */}
      <div className={styles.keyboardHint}>
        <span>Use ← → keys to navigate, R to reset</span>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
