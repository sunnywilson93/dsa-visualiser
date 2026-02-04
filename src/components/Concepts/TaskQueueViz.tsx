'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Clock, Zap, CheckCircle } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface MacroTask {
  id: string
  source: 'setTimeout' | 'setInterval' | 'I/O' | 'UI rendering'
  label: string
  delay?: number
}

interface Step {
  description: string
  codeLine: number
  macroQueue: MacroTask[]
  microQueue: string[]
  currentMacrotask?: string
  microCheckpoint: boolean
  output: string[]
  phase: 'sync' | 'macro' | 'micro-check' | 'idle'
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
      id: 'setTimeout-ordering',
      title: 'setTimeout Ordering',
      code: [
        "setTimeout(() => console.log('first'), 100);",
        "setTimeout(() => console.log('second'), 50);",
        "setTimeout(() => console.log('third'), 0);",
        '',
        "console.log('sync');",
      ],
      steps: [
        {
          description: 'All setTimeout calls registered. Callbacks ordered by delay time.',
          codeLine: 0,
          macroQueue: [
            { id: '3', source: 'setTimeout', label: 'third', delay: 0 },
            { id: '2', source: 'setTimeout', label: 'second', delay: 50 },
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: [],
          phase: 'sync',
        },
        {
          description: 'Synchronous code runs first, regardless of timeouts.',
          codeLine: 4,
          macroQueue: [
            { id: '3', source: 'setTimeout', label: 'third', delay: 0 },
            { id: '2', source: 'setTimeout', label: 'second', delay: 50 },
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: ['sync'],
          phase: 'sync',
        },
        {
          description: 'First macrotask: setTimeout(0) callback runs.',
          codeLine: 2,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'second', delay: 50 },
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          currentMacrotask: 'third',
          microCheckpoint: false,
          output: ['sync', 'third'],
          phase: 'macro',
        },
        {
          description: 'Microtask checkpoint between macrotasks (queue is empty).',
          codeLine: -1,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'second', delay: 50 },
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['sync', 'third'],
          phase: 'micro-check',
        },
        {
          description: 'Second macrotask: 50ms timeout callback.',
          codeLine: 1,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          currentMacrotask: 'second',
          microCheckpoint: false,
          output: ['sync', 'third', 'second'],
          phase: 'macro',
        },
        {
          description: 'Microtask checkpoint again.',
          codeLine: -1,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'first', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['sync', 'third', 'second'],
          phase: 'micro-check',
        },
        {
          description: 'Third macrotask: 100ms timeout callback.',
          codeLine: 0,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'first',
          microCheckpoint: false,
          output: ['sync', 'third', 'second', 'first'],
          phase: 'macro',
        },
        {
          description: 'All macrotasks complete. Order was based on delay!',
          codeLine: -1,
          macroQueue: [],
          microQueue: [],
          microCheckpoint: false,
          output: ['sync', 'third', 'second', 'first'],
          phase: 'idle',
        },
      ],
      insight: 'Macrotasks execute ONE at a time, ordered by when their timer expires, not registration order!'
    },
    {
      id: 'setTimeout-zero',
      title: 'setTimeout(0) Myth',
      code: [
        "console.log('1');",
        '',
        "setTimeout(() => {",
        "  console.log('timeout');",
        '}, 0);',
        '',
        "console.log('2');",
      ],
      steps: [
        {
          description: 'console.log("1") runs synchronously.',
          codeLine: 0,
          macroQueue: [],
          microQueue: [],
          microCheckpoint: false,
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'setTimeout(0) registers a macrotask. 0 does NOT mean "now"!',
          codeLine: 2,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'timeout cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'console.log("2") runs before timeout because it\'s synchronous.',
          codeLine: 6,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'timeout cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: ['1', '2'],
          phase: 'sync',
        },
        {
          description: 'Sync complete. NOW the macrotask can run.',
          codeLine: 3,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'timeout cb',
          microCheckpoint: false,
          output: ['1', '2', 'timeout'],
          phase: 'macro',
        },
      ],
      insight: 'setTimeout(0) means "next macrotask tick after current execution completes", NOT "immediately"!'
    },
  ],
  intermediate: [
    {
      id: 'micro-checkpoint',
      title: 'Microtask Checkpoint',
      code: [
        "setTimeout(() => {",
        "  console.log('macro 1');",
        "  Promise.resolve().then(() => console.log('micro'));",
        '}, 0);',
        '',
        "setTimeout(() => console.log('macro 2'), 0);",
      ],
      steps: [
        {
          description: 'Two macrotasks scheduled.',
          codeLine: 0,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'macro 1 cb', delay: 0 },
            { id: '2', source: 'setTimeout', label: 'macro 2 cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: [],
          phase: 'sync',
        },
        {
          description: 'First macrotask runs, logs "macro 1".',
          codeLine: 1,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'macro 2 cb', delay: 0 },
          ],
          microQueue: [],
          currentMacrotask: 'macro 1 cb',
          microCheckpoint: false,
          output: ['macro 1'],
          phase: 'macro',
        },
        {
          description: 'First macrotask queues a microtask!',
          codeLine: 2,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'macro 2 cb', delay: 0 },
          ],
          microQueue: ['micro cb'],
          currentMacrotask: 'macro 1 cb',
          microCheckpoint: false,
          output: ['macro 1'],
          phase: 'macro',
        },
        {
          description: 'CHECKPOINT: Microtasks drain before next macrotask!',
          codeLine: 2,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'macro 2 cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['macro 1', 'micro'],
          phase: 'micro-check',
        },
        {
          description: 'NOW second macrotask can run.',
          codeLine: 5,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'macro 2 cb',
          microCheckpoint: false,
          output: ['macro 1', 'micro', 'macro 2'],
          phase: 'macro',
        },
      ],
      insight: 'After EACH macrotask, the microtask queue drains completely before the next macrotask!'
    },
    {
      id: 'multiple-checkpoints',
      title: 'Multiple Checkpoints',
      code: [
        "setTimeout(() => {",
        "  console.log('m1');",
        "  Promise.resolve().then(() => console.log('p1'));",
        '}, 0);',
        '',
        "setTimeout(() => {",
        "  console.log('m2');",
        "  Promise.resolve().then(() => console.log('p2'));",
        '}, 0);',
        '',
        "setTimeout(() => console.log('m3'), 0);",
      ],
      steps: [
        {
          description: 'Three macrotasks queued.',
          codeLine: 0,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'm1 cb', delay: 0 },
            { id: '2', source: 'setTimeout', label: 'm2 cb', delay: 0 },
            { id: '3', source: 'setTimeout', label: 'm3 cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: [],
          phase: 'sync',
        },
        {
          description: 'Macrotask 1 runs, queues microtask.',
          codeLine: 1,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'm2 cb', delay: 0 },
            { id: '3', source: 'setTimeout', label: 'm3 cb', delay: 0 },
          ],
          microQueue: ['p1 cb'],
          currentMacrotask: 'm1 cb',
          microCheckpoint: false,
          output: ['m1'],
          phase: 'macro',
        },
        {
          description: 'CHECKPOINT #1: Microtask runs before m2.',
          codeLine: 2,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'm2 cb', delay: 0 },
            { id: '3', source: 'setTimeout', label: 'm3 cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['m1', 'p1'],
          phase: 'micro-check',
        },
        {
          description: 'Macrotask 2 runs, queues microtask.',
          codeLine: 6,
          macroQueue: [
            { id: '3', source: 'setTimeout', label: 'm3 cb', delay: 0 },
          ],
          microQueue: ['p2 cb'],
          currentMacrotask: 'm2 cb',
          microCheckpoint: false,
          output: ['m1', 'p1', 'm2'],
          phase: 'macro',
        },
        {
          description: 'CHECKPOINT #2: Microtask runs before m3.',
          codeLine: 7,
          macroQueue: [
            { id: '3', source: 'setTimeout', label: 'm3 cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['m1', 'p1', 'm2', 'p2'],
          phase: 'micro-check',
        },
        {
          description: 'Macrotask 3 runs (no microtask queued).',
          codeLine: 10,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'm3 cb',
          microCheckpoint: false,
          output: ['m1', 'p1', 'm2', 'p2', 'm3'],
          phase: 'macro',
        },
      ],
      insight: 'Pattern: macro -> micro drain -> macro -> micro drain. One at a time with checkpoints!'
    },
  ],
  advanced: [
    {
      id: 'setInterval',
      title: 'setInterval Stacking',
      code: [
        'let count = 0;',
        '',
        'const id = setInterval(() => {',
        '  count++;',
        '  console.log("tick " + count);',
        '  if (count >= 3) clearInterval(id);',
        '}, 100);',
        '',
        "console.log('started');",
      ],
      steps: [
        {
          description: 'setInterval registers recurring macrotask every 100ms.',
          codeLine: 2,
          macroQueue: [
            { id: '1', source: 'setInterval', label: 'interval tick', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: ['started'],
          phase: 'sync',
        },
        {
          description: 'First interval tick: count=1',
          codeLine: 4,
          macroQueue: [
            { id: '2', source: 'setInterval', label: 'interval tick', delay: 100 },
          ],
          microQueue: [],
          currentMacrotask: 'interval tick',
          microCheckpoint: false,
          output: ['started', 'tick 1'],
          phase: 'macro',
        },
        {
          description: 'Microtask checkpoint (empty queue).',
          codeLine: -1,
          macroQueue: [
            { id: '2', source: 'setInterval', label: 'interval tick', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['started', 'tick 1'],
          phase: 'micro-check',
        },
        {
          description: 'Second interval tick: count=2',
          codeLine: 4,
          macroQueue: [
            { id: '3', source: 'setInterval', label: 'interval tick', delay: 100 },
          ],
          microQueue: [],
          currentMacrotask: 'interval tick',
          microCheckpoint: false,
          output: ['started', 'tick 1', 'tick 2'],
          phase: 'macro',
        },
        {
          description: 'Microtask checkpoint.',
          codeLine: -1,
          macroQueue: [
            { id: '3', source: 'setInterval', label: 'interval tick', delay: 100 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['started', 'tick 1', 'tick 2'],
          phase: 'micro-check',
        },
        {
          description: 'Third tick: count=3, clearInterval stops it.',
          codeLine: 5,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'interval tick',
          microCheckpoint: false,
          output: ['started', 'tick 1', 'tick 2', 'tick 3'],
          phase: 'macro',
        },
        {
          description: 'Interval cleared. No more macrotasks queued.',
          codeLine: -1,
          macroQueue: [],
          microQueue: [],
          microCheckpoint: false,
          output: ['started', 'tick 1', 'tick 2', 'tick 3'],
          phase: 'idle',
        },
      ],
      insight: 'setInterval queues a new macrotask each interval. If callback takes too long, ticks can stack up!'
    },
    {
      id: 'render-timing',
      title: 'Render Timing',
      code: [
        '// Browser rendering happens BETWEEN macrotasks',
        "setTimeout(() => {",
        "  document.body.style.background = 'red';",
        "  console.log('painted red');",
        '}, 0);',
        '',
        "setTimeout(() => {",
        "  document.body.style.background = 'blue';",
        "  console.log('painted blue');",
        '}, 0);',
      ],
      steps: [
        {
          description: 'Two macrotasks scheduled to change background color.',
          codeLine: 1,
          macroQueue: [
            { id: '1', source: 'setTimeout', label: 'red cb', delay: 0 },
            { id: '2', source: 'setTimeout', label: 'blue cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: false,
          output: [],
          phase: 'sync',
        },
        {
          description: 'First macrotask: set background red.',
          codeLine: 2,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'blue cb', delay: 0 },
          ],
          microQueue: [],
          currentMacrotask: 'red cb',
          microCheckpoint: false,
          output: ['painted red'],
          phase: 'macro',
        },
        {
          description: 'Microtask checkpoint, then RENDER opportunity!',
          codeLine: -1,
          macroQueue: [
            { id: '2', source: 'setTimeout', label: 'blue cb', delay: 0 },
          ],
          microQueue: [],
          microCheckpoint: true,
          output: ['painted red'],
          phase: 'micro-check',
        },
        {
          description: 'Second macrotask: set background blue.',
          codeLine: 7,
          macroQueue: [],
          microQueue: [],
          currentMacrotask: 'blue cb',
          microCheckpoint: false,
          output: ['painted red', 'painted blue'],
          phase: 'macro',
        },
        {
          description: 'Browser may repaint between macrotasks (60fps target).',
          codeLine: -1,
          macroQueue: [],
          microQueue: [],
          microCheckpoint: false,
          output: ['painted red', 'painted blue'],
          phase: 'idle',
        },
      ],
      insight: 'Rendering happens between macrotasks (after microtask drain). This is why requestAnimationFrame exists!'
    },
  ],
}

const getSourceIcon = (source: MacroTask['source']) => {
  switch (source) {
    case 'setTimeout': return <Timer size={12} />
    case 'setInterval': return <Clock size={12} />
    default: return null
  }
}

export function TaskQueueViz() {
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

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return 'Sync'
      case 'macro': return 'Macrotask'
      case 'micro-check': return 'Checkpoint'
      case 'idle': return 'Idle'
    }
  }

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return '#64748b'
      case 'macro': return 'var(--color-amber-500)'
      case 'micro-check': return 'var(--color-purple-500)'
      case 'idle': return 'var(--color-emerald-500)'
    }
  }

  return (
    <div className="flex flex-col gap-5 text-[var(--js-viz-text)]">
      {/* Level selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
              ${level === lvl
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full transition-all duration-150 cursor-pointer
              ${exampleIndex === i
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Queue Visualization */}
      <div className="grid grid-cols-2 gap-[var(--spacing-lg)] max-md:grid-cols-1">
        {/* Macrotask Queue */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: currentStep.phase === 'macro'
              ? 'var(--gradient-neon-amber)'
              : 'linear-gradient(135deg, var(--color-amber-600), #f59e0b)'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
            <Timer size={14} className="text-amber-400" />
            Macrotask Queue
            {currentStep.phase === 'macro' && (
              <span className="px-2 py-0.5 bg-amber-500 text-black text-xs rounded-full font-bold">
                ONE AT A TIME
              </span>
            )}
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[180px] p-[var(--spacing-md)] pt-8">
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {currentStep.macroQueue.length === 0 ? (
                  <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(empty)</div>
                ) : (
                  currentStep.macroQueue.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-md font-mono text-xs border
                        ${index === 0 && currentStep.phase === 'macro'
                          ? 'bg-[var(--color-amber-20)] border-[var(--color-amber-50)] text-[var(--color-amber-300)] ring-2 ring-amber-500/50'
                          : 'bg-[var(--color-amber-15)] border-[var(--color-amber-40)] text-[var(--color-amber-400)]'
                        }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(task.source)}
                          <span className="text-2xs opacity-60">{task.source}</span>
                        </div>
                        <span>{task.label}</span>
                        {task.delay !== undefined && (
                          <span className="text-2xs opacity-50">{task.delay}ms</span>
                        )}
                      </div>
                      {index === 0 && currentStep.phase === 'macro' && (
                        <div className="text-2xs text-amber-300 mt-1 flex items-center gap-1">
                          <span className="animate-pulse">PROCESSING</span>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Microtask Queue (Checkpoint Indicator) */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: currentStep.microCheckpoint
              ? 'var(--gradient-neon-purple)'
              : 'linear-gradient(135deg, #6b7280, #9ca3af)'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
            <Zap size={14} className={currentStep.microCheckpoint ? 'text-purple-400' : 'text-gray-400'} />
            Microtask Checkpoint
            {currentStep.microCheckpoint && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full animate-pulse">
                DRAINING
              </span>
            )}
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[180px] p-[var(--spacing-md)] pt-8 flex flex-col">
            <div className="flex-1 flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {currentStep.microQueue.length === 0 ? (
                  <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-md)]">
                    {currentStep.microCheckpoint ? (
                      <div className="flex items-center justify-center gap-2 text-purple-400">
                        <CheckCircle size={16} />
                        Queue empty - checkpoint complete
                      </div>
                    ) : (
                      '(empty)'
                    )}
                  </div>
                ) : (
                  currentStep.microQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-brand-primary-15)] border border-[var(--color-brand-primary-40)] rounded-md font-mono text-xs text-[var(--color-brand-light)] text-center"
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

            {/* Visual indicator of checkpoint behavior */}
            <div className={`mt-4 pt-4 border-t border-[var(--color-white-10)] text-center text-xs ${currentStep.microCheckpoint ? 'text-purple-400' : 'text-gray-600'}`}>
              {currentStep.microCheckpoint ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  Microtasks drain before next macrotask
                </div>
              ) : (
                <span>Checkpoint runs after each macrotask</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] shadow-[0_10px_24px_rgba(2,4,10,0.35)] overflow-hidden">
        <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-3)]">
          <span className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
            Code
          </span>
          <span className="px-[var(--spacing-sm)] py-0.5 rounded-full text-2xs font-semibold text-black" style={{ background: getPhaseColor(currentStep.phase) }}>
            {getPhaseLabel(currentStep.phase)}
          </span>
        </div>
        <pre className="m-0 py-[var(--spacing-sm)] max-h-40 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${currentStep.codeLine === i ? 'bg-[var(--color-brand-primary-20)]' : ''}`}
            >
              <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${currentStep.codeLine === i ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-gray-300)]'}`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Output Section */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
        <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
          Output
        </div>
        <div className="font-mono text-sm text-[var(--difficulty-1)] min-h-6">
          {currentStep.output.length === 0 ? (
            <span className="text-[var(--color-gray-800)]">-</span>
          ) : (
            currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className="py-0.5"
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
          className="px-[var(--spacing-md)] py-2.5 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-lg text-base text-[var(--js-viz-muted)] text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-xs text-[var(--color-gray-500)] text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
