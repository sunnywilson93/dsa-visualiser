import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  result?: string
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
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'promise-states',
      title: 'Promise States',
      code: [
        'const p = new Promise((resolve, reject) => {',
        '  setTimeout(() => {',
        '    resolve("Success!");',
        '  }, 1000);',
        '});',
        '',
        'p.then(value => {',
        '  console.log(value);',
        '});'
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Promise created - starts in PENDING state',
          highlightLines: [0, 1, 2, 3, 4],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          output: []
        },
        {
          id: 1,
          phase: 'Waiting',
          description: '.then() handler registered - Promise still pending',
          highlightLines: [6, 7, 8],
          promises: [{ id: 'p', label: 'p', state: 'pending' }],
          output: []
        },
        {
          id: 2,
          phase: 'Settling',
          description: 'After 1 second, resolve() called - Promise is FULFILLED',
          highlightLines: [2],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"Success!"' }],
          output: []
        },
        {
          id: 3,
          phase: 'Execution',
          description: '.then() callback runs with the resolved value',
          highlightLines: [7],
          promises: [{ id: 'p', label: 'p', state: 'fulfilled', value: '"Success!"' }],
          output: ['Success!']
        }
      ],
      insight: 'A Promise transitions from pending → fulfilled (or rejected) exactly once. Once settled, it never changes.'
    },
    {
      id: 'promise-chaining',
      title: 'Promise Chaining',
      code: [
        'Promise.resolve(1)',
        '  .then(x => x + 1)',
        '  .then(x => x * 2)',
        '  .then(x => console.log(x));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Start',
          description: 'Promise.resolve(1) creates a fulfilled Promise with value 1',
          highlightLines: [0],
          promises: [{ id: 'p1', label: 'P1', state: 'fulfilled', value: '1' }],
          output: []
        },
        {
          id: 1,
          phase: 'Chain',
          description: 'First .then() returns a NEW Promise with x + 1 = 2',
          highlightLines: [1],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '2' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Chain',
          description: 'Second .then() returns another Promise with x * 2 = 4',
          highlightLines: [2],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '4' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Final .then() logs the result: 4',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '4' }
          ],
          output: ['4']
        }
      ],
      insight: 'Each .then() returns a NEW Promise, enabling chains. The value flows through like water in pipes.'
    }
  ],
  intermediate: [
    {
      id: 'promise-all',
      title: 'Promise.all() - Fail Fast',
      code: [
        'const p1 = Promise.resolve(1);',
        'const p2 = Promise.resolve(2);',
        'const p3 = Promise.reject("Error!");',
        '',
        'Promise.all([p1, p2, p3])',
        '  .then(r => console.log(r))',
        '  .catch(e => console.log(e));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Three Promises created - p1 and p2 fulfilled, p3 rejected',
          highlightLines: [0, 1, 2],
          promises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'p2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'p3', state: 'rejected', reason: '"Error!"' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'Promise.all() checks all Promises in parallel',
          highlightLines: [4],
          promises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'p2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'p3', state: 'rejected', reason: '"Error!"' },
            { id: 'all', label: 'all', state: 'pending' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Fail Fast',
          description: 'p3 is rejected! Promise.all() immediately rejects - doesn\'t wait for others',
          highlightLines: [4],
          promises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'p2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'p3', state: 'rejected', reason: '"Error!"' },
            { id: 'all', label: 'all', state: 'rejected', reason: '"Error!"' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Catch',
          description: '.catch() handles the rejection',
          highlightLines: [6],
          promises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', value: '1' },
            { id: 'p2', label: 'p2', state: 'fulfilled', value: '2' },
            { id: 'p3', label: 'p3', state: 'rejected', reason: '"Error!"' },
            { id: 'all', label: 'all', state: 'rejected', reason: '"Error!"' }
          ],
          output: ['Error!']
        }
      ],
      insight: 'Promise.all() "fails fast" - one rejection immediately rejects the whole thing. Use allSettled() if you need all results.'
    },
    {
      id: 'promise-race',
      title: 'Promise.race() - First Wins',
      code: [
        'const slow = new Promise(r =>',
        '  setTimeout(() => r("slow"), 2000)',
        ');',
        'const fast = new Promise(r =>',
        '  setTimeout(() => r("fast"), 500)',
        ');',
        '',
        'Promise.race([slow, fast])',
        '  .then(r => console.log(r));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Two Promises: slow (2s) and fast (500ms) - both start pending',
          highlightLines: [0, 1, 2, 3, 4, 5],
          promises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'fast', label: 'fast', state: 'pending' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Racing',
          description: 'Promise.race() starts - waiting for first to settle',
          highlightLines: [7],
          promises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'fast', label: 'fast', state: 'pending' },
            { id: 'race', label: 'race', state: 'pending' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Winner',
          description: 'After 500ms, fast resolves first - race immediately resolves!',
          highlightLines: [4],
          promises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'fast', label: 'fast', state: 'fulfilled', value: '"fast"' },
            { id: 'race', label: 'race', state: 'fulfilled', value: '"fast"' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Result logged. (slow still resolves later but is ignored)',
          highlightLines: [8],
          promises: [
            { id: 'slow', label: 'slow', state: 'fulfilled', value: '"slow"' },
            { id: 'fast', label: 'fast', state: 'fulfilled', value: '"fast"' },
            { id: 'race', label: 'race', state: 'fulfilled', value: '"fast"' }
          ],
          output: ['fast']
        }
      ],
      insight: 'Promise.race() resolves/rejects with the FIRST Promise to settle. Great for timeouts!'
    }
  ],
  advanced: [
    {
      id: 'promise-allsettled',
      title: 'Promise.allSettled()',
      code: [
        'const promises = [',
        '  Promise.resolve("A"),',
        '  Promise.reject("B"),',
        '  Promise.resolve("C")',
        '];',
        '',
        'Promise.allSettled(promises)',
        '  .then(results => {',
        '    console.log(results);',
        '  });'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Mix of fulfilled and rejected Promises',
          highlightLines: [0, 1, 2, 3, 4],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"A"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"B"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"C"' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Waiting',
          description: 'allSettled() waits for ALL Promises (no short-circuit)',
          highlightLines: [6],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"A"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"B"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"C"' },
            { id: 'as', label: 'settled', state: 'pending' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Complete',
          description: 'allSettled() always fulfills with array of result objects',
          highlightLines: [6],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"A"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"B"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"C"' },
            { id: 'as', label: 'settled', state: 'fulfilled', value: '[...]' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Result',
          description: 'Each result has status + value/reason',
          highlightLines: [8],
          promises: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '"A"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"B"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"C"' }
          ],
          output: [
            '{ status: "fulfilled", value: "A" }',
            '{ status: "rejected", reason: "B" }',
            '{ status: "fulfilled", value: "C" }'
          ]
        }
      ],
      insight: 'allSettled() NEVER rejects. It waits for all Promises and gives you the complete picture.'
    },
    {
      id: 'promise-any',
      title: 'Promise.any() - First Success',
      code: [
        'const promises = [',
        '  Promise.reject("Err1"),',
        '  Promise.reject("Err2"),',
        '  Promise.resolve("Success!"),',
        '  Promise.reject("Err3")',
        '];',
        '',
        'Promise.any(promises)',
        '  .then(r => console.log(r));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Mix of rejections and one fulfillment',
          highlightLines: [0, 1, 2, 3, 4, 5],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"Err1"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"Err2"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"Success!"' },
            { id: 'p4', label: 'P4', state: 'rejected', reason: '"Err3"' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Searching',
          description: 'any() ignores rejections, looking for first success',
          highlightLines: [7],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"Err1"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"Err2"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"Success!"' },
            { id: 'p4', label: 'P4', state: 'rejected', reason: '"Err3"' },
            { id: 'any', label: 'any', state: 'pending' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Found',
          description: 'P3 is fulfilled! any() immediately resolves with "Success!"',
          highlightLines: [3],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"Err1"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"Err2"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"Success!"' },
            { id: 'p4', label: 'P4', state: 'rejected', reason: '"Err3"' },
            { id: 'any', label: 'any', state: 'fulfilled', value: '"Success!"' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Result logged',
          highlightLines: [8],
          promises: [
            { id: 'p1', label: 'P1', state: 'rejected', reason: '"Err1"' },
            { id: 'p2', label: 'P2', state: 'rejected', reason: '"Err2"' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '"Success!"' },
            { id: 'p4', label: 'P4', state: 'rejected', reason: '"Err3"' }
          ],
          output: ['Success!']
        }
      ],
      insight: 'Promise.any() finds the first SUCCESS. Only throws AggregateError if ALL fail.'
    }
  ]
}

export function PromisesViz() {
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
      case 'Creation': return '#60a5fa'
      case 'Waiting': return '#f59e0b'
      case 'Settling': return '#10b981'
      case 'Execution': return '#10b981'
      case 'Start': return '#60a5fa'
      case 'Chain': return '#a78bfa'
      case 'Setup': return '#60a5fa'
      case 'Racing': return '#f59e0b'
      case 'Winner': return '#10b981'
      case 'Fail Fast': return '#ef4444'
      case 'Catch': return '#ef4444'
      case 'Searching': return '#f59e0b'
      case 'Found': return '#10b981'
      case 'Result': return '#10b981'
      case 'Complete': return '#10b981'
      default: return '#888'
    }
  }

  const getPromiseStateColor = (state: 'pending' | 'fulfilled' | 'rejected') => {
    switch (state) {
      case 'pending': return '#f59e0b'
      case 'fulfilled': return '#10b981'
      case 'rejected': return '#ef4444'
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

      {/* Promise State Visualization */}
      <div className={styles.promiseContainer}>
        <div className={styles.promiseHeader}>Promise States</div>
        <div className={styles.promiseGrid}>
          <AnimatePresence mode="popLayout">
            {currentStep.promises.map(p => (
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
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Console Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>—</span>
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
