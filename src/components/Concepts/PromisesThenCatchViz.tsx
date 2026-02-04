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

interface ValueFlow {
  from: string
  to: string
  value: string
  type: 'return' | 'throw'
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  promises: PromiseState[]
  valueFlows: ValueFlow[]
  activeHandler: 'then' | 'catch' | 'finally' | null
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
      id: 'single-then',
      title: 'Single .then()',
      code: [
        'const p1 = Promise.resolve(1);',
        '',
        'const p2 = p1.then(x => {',
        '  return x + 1;',
        '});',
        '',
        'p2.then(v => console.log(v));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Promise.resolve(1) creates P1, already fulfilled with value 1',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'fulfilled', value: '1' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: 'Chain',
          description: '.then() is called - this creates a NEW Promise (P2) in pending state',
          highlightLines: [2, 3, 4],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [],
          activeHandler: 'then',
          output: []
        },
        {
          id: 2,
          phase: 'Execute',
          description: '.then() handler runs with P1\'s value (1). It returns 1 + 1 = 2',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '2', type: 'return' }],
          activeHandler: 'then',
          output: []
        },
        {
          id: 3,
          phase: 'Settle',
          description: 'P2 fulfills with the returned value: 2',
          highlightLines: [4],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '2' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '2', type: 'return' }],
          activeHandler: null,
          output: []
        },
        {
          id: 4,
          phase: 'Output',
          description: 'Final .then() logs P2\'s value: 2',
          highlightLines: [6],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '2' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '2', type: 'return' }],
          activeHandler: null,
          output: ['2']
        }
      ],
      insight: 'Every .then() creates a NEW Promise. The handler\'s return value becomes that new Promise\'s fulfillment value.'
    },
    {
      id: 'single-catch',
      title: 'Single .catch()',
      code: [
        'const p1 = Promise.reject("error!");',
        '',
        'const p2 = p1.catch(e => {',
        '  return "handled: " + e;',
        '});',
        '',
        'p2.then(v => console.log(v));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Promise.reject("error!") creates P1 in rejected state',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'rejected', reason: '"error!"' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: 'Chain',
          description: '.catch() is called - creates a NEW Promise (P2) in pending state',
          highlightLines: [2, 3, 4],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"error!"' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [],
          activeHandler: 'catch',
          output: []
        },
        {
          id: 2,
          phase: 'Execute',
          description: '.catch() handler receives the rejection reason and returns a recovery value',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"error!"' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '"handled: error!"', type: 'return' }],
          activeHandler: 'catch',
          output: []
        },
        {
          id: 3,
          phase: 'Settle',
          description: 'P2 FULFILLS (not rejects!) with the returned value. Catch recovered the error!',
          highlightLines: [4],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"error!"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"handled: error!"' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '"handled: error!"', type: 'return' }],
          activeHandler: null,
          output: []
        },
        {
          id: 4,
          phase: 'Output',
          description: '.then() runs with P2\'s fulfilled value',
          highlightLines: [6],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"error!"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"handled: error!"' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '"handled: error!"', type: 'return' }],
          activeHandler: null,
          output: ['handled: error!']
        }
      ],
      insight: '.catch() returns a NEW Promise. If the handler returns a value (not throws), that Promise FULFILLS - this is how you recover from errors!'
    }
  ],
  intermediate: [
    {
      id: 'then-returns-value',
      title: '.then() Returns Value',
      code: [
        'Promise.resolve(10)',
        '  .then(x => x * 2)     // returns 20',
        '  .then(x => x + 5)     // returns 25',
        '  .then(x => console.log(x));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Start',
          description: 'Promise.resolve(10) creates P1 with value 10',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'fulfilled', value: '10' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: 'First .then()',
          description: 'First .then() creates P2. Handler receives 10, returns 10 * 2 = 20',
          highlightLines: [1],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '10' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '20' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '20', type: 'return' }],
          activeHandler: 'then',
          output: []
        },
        {
          id: 2,
          phase: 'Second .then()',
          description: 'Second .then() creates P3. Handler receives 20, returns 20 + 5 = 25',
          highlightLines: [2],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '10' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '20' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '25' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: '20', type: 'return' },
            { from: 'p2', to: 'p3', value: '25', type: 'return' }
          ],
          activeHandler: 'then',
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Final .then() logs the transformed value: 25',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '10' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '20' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '25' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: '20', type: 'return' },
            { from: 'p2', to: 'p3', value: '25', type: 'return' }
          ],
          activeHandler: null,
          output: ['25']
        }
      ],
      insight: 'Values flow through the chain like data through pipes. Each .then() transforms the value and passes it to the next.'
    },
    {
      id: 'catch-recovery',
      title: '.catch() Recovery',
      code: [
        'Promise.reject("DB error")',
        '  .catch(e => {',
        '    console.log("Caught:", e);',
        '    return "default data";  // Recovery!',
        '  })',
        '  .then(data => {',
        '    console.log("Got:", data);',
        '  });'
      ],
      steps: [
        {
          id: 0,
          phase: 'Error',
          description: 'Promise starts rejected with "DB error"',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'rejected', reason: '"DB error"' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: 'Catch',
          description: '.catch() handler catches the rejection. First logs the error.',
          highlightLines: [1, 2],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"DB error"' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [],
          activeHandler: 'catch',
          output: ['Caught: DB error']
        },
        {
          id: 2,
          phase: 'Recover',
          description: 'Handler returns "default data" - this RECOVERS the chain!',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"DB error"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"default data"' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '"default data"', type: 'return' }],
          activeHandler: 'catch',
          output: ['Caught: DB error']
        },
        {
          id: 3,
          phase: 'Continue',
          description: 'The next .then() runs because P2 is fulfilled (recovered)!',
          highlightLines: [5, 6],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"DB error"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"default data"' },
            { id: 'p3', label: 'P3', state: 'fulfilled' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: '"default data"', type: 'return' },
            { from: 'p2', to: 'p3', value: '', type: 'return' }
          ],
          activeHandler: 'then',
          output: ['Caught: DB error', 'Got: default data']
        }
      ],
      insight: 'After .catch() returns a value, the chain continues in SUCCESS path! This is how you recover from errors and continue processing.'
    }
  ],
  advanced: [
    {
      id: 'finally-usage',
      title: '.finally() Usage',
      code: [
        'let loading = true;',
        '',
        'Promise.resolve("data")',
        '  .then(d => {',
        '    console.log("Data:", d);',
        '    return d.toUpperCase();',
        '  })',
        '  .finally(() => {',
        '    loading = false;',
        '    console.log("Loading:", loading);',
        '  })',
        '  .then(d => console.log("Final:", d));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Loading flag set to true, Promise resolves with "data"',
          highlightLines: [0, 2],
          promises: [{ id: 'p1', label: 'P1', state: 'fulfilled', value: '"data"' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: '.then()',
          description: '.then() transforms data to uppercase',
          highlightLines: [3, 4, 5, 6],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"data"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"DATA"' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: '"DATA"', type: 'return' }],
          activeHandler: 'then',
          output: ['Data: data']
        },
        {
          id: 2,
          phase: '.finally()',
          description: '.finally() runs but does NOT receive the value. Sets loading = false.',
          highlightLines: [7, 8, 9, 10],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"data"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"DATA"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"DATA"' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: '"DATA"', type: 'return' },
            { from: 'p2', to: 'p3', value: '(pass-through)', type: 'return' }
          ],
          activeHandler: 'finally',
          output: ['Data: data', 'Loading: false']
        },
        {
          id: 3,
          phase: 'Complete',
          description: '.finally() passes through the PREVIOUS value unchanged. "DATA" continues!',
          highlightLines: [11],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"data"' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '"DATA"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"DATA"' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: '"DATA"', type: 'return' },
            { from: 'p2', to: 'p3', value: '"DATA"', type: 'return' }
          ],
          activeHandler: null,
          output: ['Data: data', 'Loading: false', 'Final: DATA']
        }
      ],
      insight: '.finally() is for cleanup (loading states, closing connections). It does NOT receive a value and does NOT change the chain\'s value (unless it throws).'
    },
    {
      id: 'throw-in-then',
      title: 'Throw in .then()',
      code: [
        'Promise.resolve("ok")',
        '  .then(v => {',
        '    console.log("Got:", v);',
        '    throw new Error("Oops!");',
        '  })',
        '  .then(v => {',
        '    console.log("Never runs");',
        '  })',
        '  .catch(e => {',
        '    console.log("Caught:", e.message);',
        '  });'
      ],
      steps: [
        {
          id: 0,
          phase: 'Start',
          description: 'Promise resolves with "ok"',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'fulfilled', value: '"ok"' }],
          valueFlows: [],
          activeHandler: null,
          output: []
        },
        {
          id: 1,
          phase: 'Execute',
          description: 'First .then() runs, logs the value...',
          highlightLines: [1, 2],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"ok"' },
            { id: 'p2', label: 'P2', state: 'pending' }
          ],
          valueFlows: [],
          activeHandler: 'then',
          output: ['Got: ok']
        },
        {
          id: 2,
          phase: 'Throw',
          description: 'Handler throws an error! P2 becomes REJECTED.',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"ok"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: 'Error: Oops!' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: 'Error: Oops!', type: 'throw' }],
          activeHandler: 'then',
          output: ['Got: ok']
        },
        {
          id: 3,
          phase: 'Skip',
          description: 'The next .then() is SKIPPED because P2 is rejected!',
          highlightLines: [5, 6, 7],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"ok"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: 'Error: Oops!' }
          ],
          valueFlows: [{ from: 'p1', to: 'p2', value: 'Error: Oops!', type: 'throw' }],
          activeHandler: null,
          output: ['Got: ok']
        },
        {
          id: 4,
          phase: 'Catch',
          description: '.catch() handles the rejection from P2',
          highlightLines: [8, 9, 10],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"ok"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: 'Error: Oops!' },
            { id: 'p3', label: 'P3', state: 'fulfilled' }
          ],
          valueFlows: [
            { from: 'p1', to: 'p2', value: 'Error: Oops!', type: 'throw' },
            { from: 'p2', to: 'p3', value: 'handled', type: 'return' }
          ],
          activeHandler: 'catch',
          output: ['Got: ok', 'Caught: Oops!']
        }
      ],
      insight: 'Throwing in a .then() handler rejects that Promise! Rejections skip all .then()s until a .catch() handles them.'
    }
  ]
}

export function PromisesThenCatchViz() {
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
      case 'Setup': return 'var(--color-blue-400)'
      case 'Start': return 'var(--color-blue-400)'
      case 'Chain': return 'var(--color-violet-300-40)'
      case 'Execute': return 'var(--color-amber-500)'
      case 'Settle': return 'var(--color-emerald-500)'
      case 'Output': return 'var(--color-emerald-500)'
      case 'Error': return 'var(--color-red-500)'
      case 'Catch': return 'var(--color-red-500)'
      case 'Recover': return 'var(--color-emerald-500)'
      case 'Continue': return 'var(--color-emerald-500)'
      case 'First .then()': return 'var(--color-violet-300-40)'
      case 'Second .then()': return 'var(--color-violet-300-40)'
      case '.then()': return 'var(--color-violet-300-40)'
      case '.finally()': return '#94a3b8'
      case 'Throw': return 'var(--color-red-500)'
      case 'Skip': return '#6b7280'
      case 'Complete': return 'var(--color-emerald-500)'
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

  const getHandlerColor = (handler: 'then' | 'catch' | 'finally') => {
    switch (handler) {
      case 'then': return 'var(--color-violet-300-40)'
      case 'catch': return 'var(--color-red-500)'
      case 'finally': return '#94a3b8'
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

      {/* Promise Chain Visualization */}
      <div className={styles.promiseContainer}>
        <div className={styles.promiseHeader}>
          Promise Chain
          {currentStep.activeHandler && (
            <span style={{
              marginLeft: '12px',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--font-weight-semibold)',
              background: `${getHandlerColor(currentStep.activeHandler)}30`,
              color: getHandlerColor(currentStep.activeHandler),
              border: `1px solid ${getHandlerColor(currentStep.activeHandler)}50`
            }}>
              .{currentStep.activeHandler}() executing
            </span>
          )}
        </div>
        <div className={styles.promiseGrid} style={{ alignItems: 'center' }}>
          <AnimatePresence mode="popLayout">
            {currentStep.promises.map((p, idx) => (
              <motion.div
                key={p.id}
                style={{ display: 'flex', alignItems: 'center' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                {/* Promise card */}
                <motion.div
                  className={styles.promiseCard}
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

                {/* Arrow with value flow */}
                {idx < currentStep.promises.length - 1 && (
                  <motion.div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      margin: '0 8px'
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Value flow label */}
                    {currentStep.valueFlows.find(f => f.from === p.id) && (
                      <motion.div
                        style={{
                          fontSize: 'var(--text-2xs)',
                          fontFamily: 'var(--font-mono)',
                          color: currentStep.valueFlows.find(f => f.from === p.id)?.type === 'throw'
                            ? 'var(--color-red-500)'
                            : 'var(--color-emerald-500)',
                          marginBottom: '2px',
                          padding: '1px 6px',
                          background: currentStep.valueFlows.find(f => f.from === p.id)?.type === 'throw'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(16, 185, 129, 0.15)',
                          borderRadius: '4px'
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {currentStep.valueFlows.find(f => f.from === p.id)?.value || ''}
                      </motion.div>
                    )}
                    {/* Arrow */}
                    <motion.div
                      style={{
                        fontSize: '20px',
                        color: currentStep.valueFlows.find(f => f.from === p.id)?.type === 'throw'
                          ? 'var(--color-red-500)'
                          : 'var(--color-gray-500)'
                      }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
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
