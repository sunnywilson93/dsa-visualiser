'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

const actionColors: Record<string, { bg: string; border: string; text: string }> = {
  setTimeout: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  setInterval: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  timeout: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  setImmediate: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', text: 'var(--color-blue-400)' },
  immediate: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', text: 'var(--color-blue-400)' },
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
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-center mb-1 p-1.5 bg-[var(--color-black-30)] border border-white/8 rounded-full">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
              level === lvl 
                ? 'text-[var(--color-text-bright)]' 
                : 'bg-white/4 border border-white/8 text-gray-500 hover:bg-white/8 hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-[var(--color-black-30)] border border-white/8 rounded-full">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full cursor-pointer transition-all duration-200 ${
              exampleIndex === i 
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[0_0_20px_var(--color-neon-viz-25)]' 
                : 'bg-white/4 border border-white/8 text-gray-500 hover:bg-white/8 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-black-40)] border border-white/8 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
          <span>Code</span>
          <span className="px-2 py-0.5 rounded-full text-2xs font-semibold text-[var(--difficulty-1)] bg-[var(--color-emerald-20)]">
            {currentStep.currentPhase}
          </span>
        </div>
        <pre className="m-0 py-2 max-h-[160px] overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-3 py-0.5 transition-colors duration-200 ${
                currentStep.codeLine === i ? 'bg-[var(--color-brand-primary-20)]' : ''
              }`}
            >
              <span className="w-6 text-gray-800 font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${
                currentStep.codeLine === i ? 'text-[var(--color-brand-light)]' : 'text-gray-300'
              }`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div 
          className="relative rounded-xl p-[3px]"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))' }}
        >
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[60px] p-4 pt-6 relative">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
              process.nextTick
            </div>
            <div className="flex flex-wrap gap-1 min-h-12 justify-center items-center">
              <AnimatePresence mode="popLayout">
                {currentStep.nextTickQueue.length === 0 ? (
                  <div className="text-gray-800 text-2xs w-full text-center">(empty)</div>
                ) : (
                  currentStep.nextTickQueue.map((item, i) => {
                    const colors = getActionColor(item)
                    return (
                      <motion.div
                        key={item + i}
                        className="px-2 py-0.5 rounded border font-mono text-xs transition-all duration-200"
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

        <div 
          className="relative rounded-xl p-[3px]"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-secondary), var(--color-red-500))' }}
        >
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[60px] p-4 pt-6 relative">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
              Promise Queue
            </div>
            <div className="flex flex-wrap gap-1 min-h-12 justify-center items-center">
              <AnimatePresence mode="popLayout">
                {currentStep.promiseQueue.length === 0 ? (
                  <div className="text-gray-800 text-2xs w-full text-center">(empty)</div>
                ) : (
                  currentStep.promiseQueue.map((item, i) => {
                    const colors = getActionColor(item)
                    return (
                      <motion.div
                        key={item + i}
                        className="px-2 py-0.5 rounded border font-mono text-xs transition-all duration-200"
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

      <div 
        className="relative rounded-xl p-[3px]"
        style={{ background: 'linear-gradient(135deg, var(--color-blue-500), var(--color-brand-primary))' }}
      >
        <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[60px] p-4 pt-6 relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Event Loop Phases
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {currentStep.phases.map((phase) => (
              <motion.div
                key={phase.name}
                className={`flex-1 min-w-[70px] rounded-md overflow-hidden border transition-all duration-300 max-sm:min-w-auto max-sm:w-full ${
                  phase.active 
                    ? 'border-[var(--color-emerald-60)] bg-[var(--color-emerald-10)] shadow-[0_0_10px_var(--color-emerald-20)]' 
                    : 'border-white/10 bg-white/5'
                }`}
                animate={{
                  scale: phase.active ? 1.02 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`px-1 py-0.5 text-xs font-semibold text-center ${
                  phase.active 
                    ? 'text-[var(--difficulty-1)] bg-[var(--color-emerald-15)]' 
                    : 'text-gray-700 bg-white/5'
                }`}>
                  {phase.name}
                </div>
                <div className="p-1 min-h-[50px] flex flex-col gap-0.5">
                  <AnimatePresence mode="popLayout">
                    {phase.items.length === 0 ? (
                      <span className="text-gray-700 text-2xs text-center">-</span>
                    ) : (
                      phase.items.map((item, i) => {
                        const colors = getActionColor(item)
                        return (
                          <motion.div
                            key={item + i}
                            className="px-1 py-0.5 rounded font-mono text-2xs text-center"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            style={{
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {currentStep.output.length > 0 && (
        <div 
          className="relative rounded-xl p-[3px]"
          style={{ background: 'linear-gradient(135deg, var(--difficulty-1), var(--color-accent-cyan))' }}
        >
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[50px] p-4 pt-6 flex items-center gap-3 relative">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
              Console Output
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <span className="text-gray-500 text-2xs">Output:</span>
              {currentStep.output.map((item, i) => (
                <span key={i} className="font-mono text-xs text-[var(--difficulty-1)]">{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-20)] rounded-lg text-base text-gray-300 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-1 bg-white/10 rounded-sm overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      <div className="text-center text-2xs text-gray-800">
        <span className="px-2 py-0.5 bg-white/3 rounded">Use ← → keys to navigate, R to reset</span>
      </div>

      <div className="px-4 py-2 bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
