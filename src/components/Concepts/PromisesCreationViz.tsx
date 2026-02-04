'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface PromiseState {
  id: string
  label: string
  state: 'pending' | 'fulfilled' | 'rejected'
  value?: string
  reason?: string
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  promises: PromiseState[]
  executorPhase: 'not-started' | 'running' | 'complete'
  resolveRejectCalled: 'none' | 'resolve' | 'reject'
  output: string[]
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
      id: 'sync-executor',
      title: 'Sync Executor',
      code: [
        'const p = new Promise((resolve, reject) => {',
        '  console.log("Executor runs!");',
        '  resolve("Done");',
        '});',
        '',
        'console.log("After Promise");'
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Promise constructor is called - executor function will run immediately',
          highlightLines: [0],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'not-started',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'Executor',
          description: 'Executor runs SYNCHRONOUSLY! This console.log happens immediately',
          highlightLines: [1],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: ['Executor runs!']
        },
        {
          id: 2,
          phase: 'Resolve',
          description: 'resolve() is called - Promise state changes from pending to fulfilled',
          highlightLines: [2],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"Done"' }],
          executorPhase: 'running',
          resolveRejectCalled: 'resolve',
          output: ['Executor runs!']
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Executor completes, code continues. "After Promise" logs AFTER executor!',
          highlightLines: [5],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"Done"' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: ['Executor runs!', 'After Promise']
        }
      ],
      insight: 'The executor function runs SYNCHRONOUSLY when you create a Promise. Code after new Promise() runs AFTER the executor completes.'
    },
    {
      id: 'async-executor',
      title: 'Async Executor',
      code: [
        'const p = new Promise((resolve, reject) => {',
        '  console.log("Executor starts");',
        '  setTimeout(() => {',
        '    resolve("Async done!");',
        '  }, 1000);',
        '});',
        '',
        'console.log("After Promise");'
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Promise created - executor will run immediately',
          highlightLines: [0],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'not-started',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'Executor',
          description: 'Executor runs synchronously, logs message',
          highlightLines: [1],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: ['Executor starts']
        },
        {
          id: 2,
          phase: 'Schedule',
          description: 'setTimeout schedules resolve() for later - executor completes but Promise still pending',
          highlightLines: [2, 3, 4],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'none',
          output: ['Executor starts']
        },
        {
          id: 3,
          phase: 'Continue',
          description: 'Code after Promise runs while Promise is still pending',
          highlightLines: [7],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'none',
          output: ['Executor starts', 'After Promise']
        },
        {
          id: 4,
          phase: 'Async Resolve',
          description: 'After 1 second, setTimeout fires and resolve() is called',
          highlightLines: [3],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"Async done!"' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: ['Executor starts', 'After Promise']
        }
      ],
      insight: 'Even when the executor starts async work (setTimeout), the executor itself completes synchronously. The Promise stays pending until resolve/reject is called.'
    }
  ],
  intermediate: [
    {
      id: 'resolve-vs-reject',
      title: 'Resolve vs Reject',
      code: [
        'const success = true;',
        '',
        'const p = new Promise((resolve, reject) => {',
        '  if (success) {',
        '    resolve("It worked!");',
        '  } else {',
        '    reject("It failed!");',
        '  }',
        '});'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'success is true - this determines which path we take',
          highlightLines: [0],
          promises: [],
          executorPhase: 'not-started',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'Creation',
          description: 'Promise created, executor starts running',
          highlightLines: [2],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 2,
          phase: 'Branch',
          description: 'Condition checked: success is true, so we go to resolve() branch',
          highlightLines: [3, 4],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 3,
          phase: 'Resolve',
          description: 'resolve() called - Promise fulfilled with "It worked!"',
          highlightLines: [4],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"It worked!"' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: []
        }
      ],
      insight: 'resolve() and reject() are just functions! You call one or the other based on your logic. They\'re the "controls" to settle the Promise.'
    },
    {
      id: 'multiple-resolve',
      title: 'Multiple Resolve Calls',
      code: [
        'const p = new Promise((resolve, reject) => {',
        '  resolve("First");',
        '  resolve("Second");  // ignored!',
        '  reject("Error");    // also ignored!',
        '  console.log("Still runs");',
        '});'
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Promise created, executor starts',
          highlightLines: [0],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'First Resolve',
          description: 'First resolve() call - Promise is now FULFILLED with "First"',
          highlightLines: [1],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"First"' }],
          executorPhase: 'running',
          resolveRejectCalled: 'resolve',
          output: []
        },
        {
          id: 2,
          phase: 'Ignored',
          description: 'Second resolve() - IGNORED! Promise already settled, cannot change',
          highlightLines: [2],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"First"' }],
          executorPhase: 'running',
          resolveRejectCalled: 'resolve',
          output: []
        },
        {
          id: 3,
          phase: 'Ignored',
          description: 'reject() call - ALSO IGNORED! Once settled, state is locked',
          highlightLines: [3],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"First"' }],
          executorPhase: 'running',
          resolveRejectCalled: 'resolve',
          output: []
        },
        {
          id: 4,
          phase: 'Continue',
          description: 'Executor keeps running! resolve/reject don\'t "return" - code continues',
          highlightLines: [4],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"First"' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: ['Still runs']
        }
      ],
      insight: 'A Promise can only settle ONCE. Additional resolve/reject calls are silently ignored. Also: resolve/reject don\'t stop execution - use return if needed!'
    }
  ],
  advanced: [
    {
      id: 'executor-throws',
      title: 'Executor Throws',
      code: [
        'const p = new Promise((resolve, reject) => {',
        '  console.log("Starting...");',
        '  throw new Error("Oops!");',
        '  resolve("Done");  // never reached',
        '});',
        '',
        'p.catch(e => console.log(e.message));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Promise created, executor begins',
          highlightLines: [0],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'Executor',
          description: 'First line of executor runs normally',
          highlightLines: [1],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: ['Starting...']
        },
        {
          id: 2,
          phase: 'Throw',
          description: 'throw in executor = automatic REJECTION! Promise catches it',
          highlightLines: [2],
          promises: [{ id: 'p', label: 'p', state: 'rejected', reason: 'Error: Oops!' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'reject',
          output: ['Starting...']
        },
        {
          id: 3,
          phase: 'Handle',
          description: '.catch() handles the rejection',
          highlightLines: [6],
          promises: [{ id: 'p', label: 'p', state: 'rejected', reason: 'Error: Oops!' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'reject',
          output: ['Starting...', 'Oops!']
        }
      ],
      insight: 'If the executor throws an error, the Promise automatically rejects with that error. This is why Promises are safe - errors don\'t crash your app!'
    },
    {
      id: 'thenable-resolution',
      title: 'Thenable Resolution',
      code: [
        'const inner = new Promise(r => {',
        '  setTimeout(() => r("inner"), 100);',
        '});',
        '',
        'const outer = new Promise(resolve => {',
        '  resolve(inner);  // resolve with a Promise!',
        '});',
        '',
        'outer.then(v => console.log(v));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Create Inner',
          description: 'Inner Promise created, will resolve after 100ms',
          highlightLines: [0, 1, 2],
          promises: [{ id: 'inner', label: 'inner', state: 'pending' }],
          executorPhase: 'complete',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 1,
          phase: 'Create Outer',
          description: 'Outer Promise created, executor starts',
          highlightLines: [4],
          promises: [
            { id: 'inner', label: 'inner', state: 'pending' },
            { id: 'outer', label: 'outer', state: 'pending' }
          ],
          executorPhase: 'running',
          resolveRejectCalled: 'none',
          output: []
        },
        {
          id: 2,
          phase: 'Resolve with Promise',
          description: 'resolve(inner) called - outer "adopts" inner\'s state (still pending!)',
          highlightLines: [5],
          promises: [
            { id: 'inner', label: 'inner', state: 'pending' },
            { id: 'outer', label: 'outer', state: 'pending' }
          ],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: []
        },
        {
          id: 3,
          phase: 'Inner Resolves',
          description: 'After 100ms, inner resolves - outer automatically resolves too!',
          highlightLines: [1],
          promises: [
            { id: 'inner', label: 'inner', state: 'fulfilled', value: '"inner"' },
            { id: 'outer', label: 'outer', state: 'fulfilled', value: '"inner"' }
          ],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: []
        },
        {
          id: 4,
          phase: 'Then Runs',
          description: '.then() callback runs with the unwrapped value',
          highlightLines: [8],
          promises: [
            { id: 'inner', label: 'inner', state: 'fulfilled', value: '"inner"' },
            { id: 'outer', label: 'outer', state: 'fulfilled', value: '"inner"' }
          ],
          executorPhase: 'complete',
          resolveRejectCalled: 'resolve',
          output: ['inner']
        }
      ],
      insight: 'If you resolve() with another Promise (or thenable), the outer Promise "adopts" the inner one\'s eventual state. This is called Promise unwrapping.'
    }
  ]
}

export function PromisesCreationViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Creation': return 'var(--color-blue-400)'
      case 'Executor': return 'var(--color-amber-500)'
      case 'Resolve': return 'var(--color-emerald-500)'
      case 'Complete': return 'var(--color-emerald-500)'
      case 'Schedule': return 'var(--color-violet-300-40)'
      case 'Continue': return '#94a3b8'
      case 'Async Resolve': return 'var(--color-emerald-500)'
      case 'Setup': return 'var(--color-blue-400)'
      case 'Branch': return 'var(--color-amber-500)'
      case 'First Resolve': return 'var(--color-emerald-500)'
      case 'Ignored': return '#6b7280'
      case 'Throw': return 'var(--color-red-500)'
      case 'Handle': return 'var(--color-emerald-500)'
      case 'Create Inner': return 'var(--color-blue-400)'
      case 'Create Outer': return '#818cf8'
      case 'Resolve with Promise': return 'var(--color-amber-500)'
      case 'Inner Resolves': return 'var(--color-emerald-500)'
      case 'Then Runs': return 'var(--color-emerald-500)'
      default: return 'var(--color-gray-500)'
    }
  }

  const getPromiseStateColor = (state: 'pending' | 'fulfilled' | 'rejected') => {
    switch (state) {
      case 'pending': return 'var(--color-amber-500)'
      case 'fulfilled': return 'var(--color-emerald-500)'
      case 'rejected': return 'var(--color-red-500)'
    }
  }

  const getExecutorPhaseLabel = (phase: 'not-started' | 'running' | 'complete') => {
    switch (phase) {
      case 'not-started': return 'Not Started'
      case 'running': return 'Running'
      case 'complete': return 'Complete'
    }
  }

  const getExecutorPhaseColor = (phase: 'not-started' | 'running' | 'complete') => {
    switch (phase) {
      case 'not-started': return '#6b7280'
      case 'running': return 'var(--color-amber-500)'
      case 'complete': return 'var(--color-emerald-500)'
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

      {/* Executor Function Box */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-400">Executor Function</span>
          <div className="flex items-center gap-2">
            {currentStep.executorPhase === 'running' && (
              <motion.span
                className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-black"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                SYNCHRONOUS!
              </motion.span>
            )}
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                background: `${getExecutorPhaseColor(currentStep.executorPhase)}20`,
                color: getExecutorPhaseColor(currentStep.executorPhase)
              }}
            >
              {getExecutorPhaseLabel(currentStep.executorPhase)}
            </span>
          </div>
        </div>

        {/* resolve/reject indicators */}
        <div className="flex justify-center gap-4">
          <div
            className={`rounded-lg border-2 px-4 py-2 text-center transition-all ${
              currentStep.resolveRejectCalled === 'resolve'
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-gray-600 bg-gray-800/50 opacity-50'
            }`}
          >
            <div className="font-mono text-sm font-bold text-emerald-400">resolve()</div>
            {currentStep.resolveRejectCalled === 'resolve' && (
              <motion.div
                className="mt-1 text-xs text-emerald-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Called!
              </motion.div>
            )}
          </div>
          <div
            className={`rounded-lg border-2 px-4 py-2 text-center transition-all ${
              currentStep.resolveRejectCalled === 'reject'
                ? 'border-red-500 bg-red-500/20'
                : 'border-gray-600 bg-gray-800/50 opacity-50'
            }`}
          >
            <div className="font-mono text-sm font-bold text-red-400">reject()</div>
            {currentStep.resolveRejectCalled === 'reject' && (
              <motion.div
                className="mt-1 text-xs text-red-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Called!
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.codeHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase}
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.highlightLines.includes(i) ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Promise State Visualization */}
      <div className={styles.promiseContainer}>
        <div className={styles.promiseHeader}>Promise State</div>
        <div className={styles.promiseGrid}>
          <AnimatePresence mode="popLayout">
            {currentStep.promises.length === 0 ? (
              <div className="text-sm text-gray-500">No Promise created yet</div>
            ) : (
              currentStep.promises.map(p => (
                <motion.div
                  key={p.id}
                  className={styles.promiseCard}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  style={{
                    borderColor: getPromiseStateColor(p.state),
                    boxShadow: `0 0 20px ${getPromiseStateColor(p.state)}40`
                  }}
                >
                  <div className={styles.promiseLabel}>{p.label}</div>
                  <motion.div
                    className={styles.promiseState}
                    style={{ color: getPromiseStateColor(p.state) }}
                    key={p.state}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {p.state.toUpperCase()}
                  </motion.div>
                  {p.value && (
                    <motion.div
                      className={styles.promiseValue}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {p.value}
                    </motion.div>
                  )}
                  {p.reason && (
                    <motion.div
                      className={styles.promiseReason}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {p.reason}
                    </motion.div>
                  )}
                  <div
                    className={styles.stateIndicator}
                    style={{ background: getPromiseStateColor(p.state) }}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
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
