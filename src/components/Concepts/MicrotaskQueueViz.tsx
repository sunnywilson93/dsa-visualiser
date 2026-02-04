'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, AlertTriangle } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface QueueItem {
  id: string
  source: 'Promise.then' | 'queueMicrotask' | 'MutationObserver' | 'async/await'
  label: string
}

interface Step {
  description: string
  codeLine: number
  microQueue: QueueItem[]
  macroQueue: QueueItem[]
  currentlyDraining: boolean
  spawnedDuringDrain: string[]
  output: string[]
  phase: 'sync' | 'draining' | 'spawning' | 'macro-waiting' | 'complete'
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
      id: 'promise-vs-timeout',
      title: 'Microtask Priority',
      code: [
        "console.log('1');",
        '',
        "setTimeout(() => console.log('timeout'), 0);",
        '',
        'Promise.resolve()',
        "  .then(() => console.log('promise'));",
        '',
        "console.log('2');",
      ],
      steps: [
        {
          description: 'Script starts executing synchronously.',
          codeLine: 0,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'setTimeout schedules a macrotask (callback added to macrotask queue).',
          codeLine: 2,
          microQueue: [],
          macroQueue: [{ id: '1', source: 'Promise.then', label: 'timeout cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'Promise.then() schedules a microtask.',
          codeLine: 4,
          microQueue: [{ id: '2', source: 'Promise.then', label: 'promise cb' }],
          macroQueue: [{ id: '1', source: 'Promise.then', label: 'timeout cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1'],
          phase: 'sync',
        },
        {
          description: 'Synchronous code finishes.',
          codeLine: 7,
          microQueue: [{ id: '2', source: 'Promise.then', label: 'promise cb' }],
          macroQueue: [{ id: '1', source: 'Promise.then', label: 'timeout cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1', '2'],
          phase: 'sync',
        },
        {
          description: 'DRAINING: Microtask queue drains COMPLETELY before any macrotask!',
          codeLine: 5,
          microQueue: [],
          macroQueue: [{ id: '1', source: 'Promise.then', label: 'timeout cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['1', '2', 'promise'],
          phase: 'draining',
        },
        {
          description: 'Microtask queue empty. NOW macrotask can run.',
          codeLine: 2,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1', '2', 'promise', 'timeout'],
          phase: 'macro-waiting',
        },
        {
          description: 'Complete! Notice: microtask ran BEFORE macrotask despite setTimeout(0).',
          codeLine: -1,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['1', '2', 'promise', 'timeout'],
          phase: 'complete',
        },
      ],
      insight: 'Microtasks ALWAYS run before macrotasks. setTimeout(0) means "next macrotask tick", not "immediately"!'
    },
    {
      id: 'multiple-microtasks',
      title: 'Complete Drain',
      code: [
        'Promise.resolve()',
        "  .then(() => console.log('first'));",
        '',
        'Promise.resolve()',
        "  .then(() => console.log('second'));",
        '',
        'Promise.resolve()',
        "  .then(() => console.log('third'));",
        '',
        "setTimeout(() => console.log('macro'), 0);",
      ],
      steps: [
        {
          description: 'All three Promise.then() calls queue microtasks.',
          codeLine: 0,
          microQueue: [
            { id: '1', source: 'Promise.then', label: 'first cb' },
            { id: '2', source: 'Promise.then', label: 'second cb' },
            { id: '3', source: 'Promise.then', label: 'third cb' },
          ],
          macroQueue: [{ id: '4', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DRAINING starts: All microtasks must complete before macrotask.',
          codeLine: 1,
          microQueue: [
            { id: '2', source: 'Promise.then', label: 'second cb' },
            { id: '3', source: 'Promise.then', label: 'third cb' },
          ],
          macroQueue: [{ id: '4', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['first'],
          phase: 'draining',
        },
        {
          description: 'Second microtask executes.',
          codeLine: 4,
          microQueue: [
            { id: '3', source: 'Promise.then', label: 'third cb' },
          ],
          macroQueue: [{ id: '4', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['first', 'second'],
          phase: 'draining',
        },
        {
          description: 'Third microtask executes. Queue now empty.',
          codeLine: 7,
          microQueue: [],
          macroQueue: [{ id: '4', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['first', 'second', 'third'],
          phase: 'draining',
        },
        {
          description: 'Microtask queue completely drained. Now macrotask runs.',
          codeLine: 9,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['first', 'second', 'third', 'macro'],
          phase: 'macro-waiting',
        },
      ],
      insight: 'The microtask queue drains COMPLETELY before ANY macrotask runs. All 3 microtasks run first!'
    },
  ],
  intermediate: [
    {
      id: 'spawning-during-drain',
      title: 'Spawning During Drain',
      code: [
        'Promise.resolve()',
        '  .then(() => {',
        "    console.log('first');",
        '    // Spawns NEW microtask during drain!',
        '    Promise.resolve()',
        "      .then(() => console.log('spawned'));",
        '  });',
        '',
        "setTimeout(() => console.log('macro'), 0);",
      ],
      steps: [
        {
          description: 'Initial microtask and macrotask queued.',
          codeLine: 0,
          microQueue: [{ id: '1', source: 'Promise.then', label: 'first cb' }],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DRAINING: First microtask starts executing...',
          codeLine: 2,
          microQueue: [],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['first'],
          phase: 'draining',
        },
        {
          description: 'NEW microtask spawned DURING drain! It joins the queue immediately.',
          codeLine: 4,
          microQueue: [{ id: '3', source: 'Promise.then', label: 'spawned cb' }],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: ['spawned cb'],
          output: ['first'],
          phase: 'spawning',
        },
        {
          description: 'Spawned microtask runs in SAME drain cycle. Macrotask still waits!',
          codeLine: 5,
          microQueue: [],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['first', 'spawned'],
          phase: 'draining',
        },
        {
          description: 'NOW queue is empty. Macrotask can finally run.',
          codeLine: 8,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['first', 'spawned', 'macro'],
          phase: 'macro-waiting',
        },
      ],
      insight: 'Microtasks spawned DURING drain run in the SAME drain cycle. Macrotasks continue to wait!'
    },
    {
      id: 'queue-microtask-api',
      title: 'queueMicrotask API',
      code: [
        'queueMicrotask(() => {',
        "  console.log('micro 1');",
        '  queueMicrotask(() => {',
        "    console.log('micro 2');",
        '  });',
        '});',
        '',
        "setTimeout(() => console.log('macro'), 0);",
      ],
      steps: [
        {
          description: 'queueMicrotask() directly schedules a microtask (no Promise wrapper).',
          codeLine: 0,
          microQueue: [{ id: '1', source: 'queueMicrotask', label: 'micro 1' }],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DRAINING: First microtask executes.',
          codeLine: 1,
          microQueue: [],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['micro 1'],
          phase: 'draining',
        },
        {
          description: 'Nested queueMicrotask() spawns another during drain!',
          codeLine: 2,
          microQueue: [{ id: '3', source: 'queueMicrotask', label: 'micro 2' }],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: ['micro 2'],
          output: ['micro 1'],
          phase: 'spawning',
        },
        {
          description: 'Spawned microtask runs immediately (same drain cycle).',
          codeLine: 3,
          microQueue: [],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['micro 1', 'micro 2'],
          phase: 'draining',
        },
        {
          description: 'Drain complete. Macrotask runs.',
          codeLine: 7,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['micro 1', 'micro 2', 'macro'],
          phase: 'macro-waiting',
        },
      ],
      insight: 'queueMicrotask() is the explicit API for scheduling microtasks. Same priority as Promise.then()!'
    },
  ],
  advanced: [
    {
      id: 'starvation-warning',
      title: 'Starvation Danger',
      code: [
        '// DANGER: This would block forever!',
        'function recursive() {',
        '  queueMicrotask(() => {',
        '    recursive(); // Infinite microtasks!',
        '  });',
        '}',
        '',
        "// Safe version: limited iterations",
        'let count = 0;',
        'function limited() {',
        '  if (count++ < 3) {',
        '    queueMicrotask(limited);',
        '  }',
        '}',
        'limited();',
        "setTimeout(() => console.log('macro'), 0);",
      ],
      steps: [
        {
          description: 'Safe version: limited() queues first microtask.',
          codeLine: 14,
          microQueue: [{ id: '1', source: 'queueMicrotask', label: 'limited (1)' }],
          macroQueue: [{ id: 'm', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DRAINING: count=1, spawns another microtask.',
          codeLine: 11,
          microQueue: [{ id: '2', source: 'queueMicrotask', label: 'limited (2)' }],
          macroQueue: [{ id: 'm', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: ['limited (2)'],
          output: [],
          phase: 'spawning',
        },
        {
          description: 'count=2, spawns another microtask.',
          codeLine: 11,
          microQueue: [{ id: '3', source: 'queueMicrotask', label: 'limited (3)' }],
          macroQueue: [{ id: 'm', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: ['limited (3)'],
          output: [],
          phase: 'spawning',
        },
        {
          description: 'count=3, condition fails. No more spawning!',
          codeLine: 10,
          microQueue: [],
          macroQueue: [{ id: 'm', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: [],
          phase: 'draining',
        },
        {
          description: 'Drain complete. Macrotask finally runs!',
          codeLine: 15,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['macro'],
          phase: 'macro-waiting',
        },
      ],
      insight: 'DANGER: Infinite microtasks block macrotasks FOREVER. Always have an exit condition!'
    },
    {
      id: 'mutation-observer',
      title: 'MutationObserver Microtasks',
      code: [
        '// MutationObserver callbacks are microtasks',
        'const observer = new MutationObserver(() => {',
        "  console.log('mutation');",
        '});',
        '',
        'observer.observe(document.body, {',
        '  childList: true',
        '});',
        '',
        'document.body.appendChild(document.createElement("div"));',
        '',
        "setTimeout(() => console.log('macro'), 0);",
      ],
      steps: [
        {
          description: 'MutationObserver set up to watch DOM changes.',
          codeLine: 1,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DOM mutation triggers observer. Callback queued as MICROTASK!',
          codeLine: 9,
          microQueue: [{ id: '1', source: 'MutationObserver', label: 'mutation cb' }],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'DRAINING: MutationObserver callback runs before macrotask.',
          codeLine: 2,
          microQueue: [],
          macroQueue: [{ id: '2', source: 'Promise.then', label: 'macro cb' }],
          currentlyDraining: true,
          spawnedDuringDrain: [],
          output: ['mutation'],
          phase: 'draining',
        },
        {
          description: 'Drain complete. Macrotask runs.',
          codeLine: 11,
          microQueue: [],
          macroQueue: [],
          currentlyDraining: false,
          spawnedDuringDrain: [],
          output: ['mutation', 'macro'],
          phase: 'macro-waiting',
        },
      ],
      insight: 'MutationObserver callbacks are microtasks! They run before setTimeout even with DOM updates.'
    },
  ],
}

export function MicrotaskQueueViz() {
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
      case 'draining': return 'DRAINING'
      case 'spawning': return 'SPAWNING'
      case 'macro-waiting': return 'Macrotask'
      case 'complete': return 'Complete'
    }
  }

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return '#64748b'
      case 'draining': return 'var(--color-purple-500)'
      case 'spawning': return 'var(--color-amber-500)'
      case 'macro-waiting': return 'var(--color-amber-500)'
      case 'complete': return 'var(--color-emerald-500)'
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
        {/* Microtask Queue */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: currentStep.currentlyDraining
              ? 'var(--gradient-neon-purple)'
              : 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
            <Zap size={14} className="text-purple-400" />
            Microtask Queue
            {currentStep.currentlyDraining && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full animate-pulse">
                DRAINING
              </span>
            )}
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[160px] p-[var(--spacing-md)] pt-8">
            <div className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {currentStep.microQueue.length === 0 ? (
                  <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(empty)</div>
                ) : (
                  currentStep.microQueue.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-md font-mono text-xs text-center border
                        ${currentStep.spawnedDuringDrain.includes(item.label)
                          ? 'bg-[var(--color-amber-15)] border-[var(--color-amber-40)] text-[var(--color-amber-400)]'
                          : 'bg-[var(--color-brand-primary-15)] border-[var(--color-brand-primary-40)] text-[var(--color-brand-light)]'
                        }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xs opacity-60">{item.source}</span>
                        <span>{item.label}</span>
                      </div>
                      {currentStep.spawnedDuringDrain.includes(item.label) && (
                        <div className="text-2xs text-amber-400 mt-1">SPAWNED DURING DRAIN</div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Macrotask Queue */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: currentStep.currentlyDraining
              ? 'linear-gradient(135deg, #4b5563, #6b7280)'
              : 'var(--gradient-neon-amber)'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
            Macrotask Queue
            {currentStep.currentlyDraining && (
              <span className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded-full">
                WAITING
              </span>
            )}
          </div>
          <div className={`bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[160px] p-[var(--spacing-md)] pt-8 ${currentStep.currentlyDraining ? 'opacity-50' : ''}`}>
            <div className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {currentStep.macroQueue.length === 0 ? (
                  <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(empty)</div>
                ) : (
                  currentStep.macroQueue.map((item) => (
                    <motion.div
                      key={item.id}
                      className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-15)] border border-[var(--color-amber-40)] rounded-md font-mono text-xs text-[var(--color-amber-400)] text-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item.label}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {currentStep.currentlyDraining && currentStep.macroQueue.length > 0 && (
              <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <AlertTriangle size={12} />
                Blocked until microtasks drain
              </div>
            )}
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
