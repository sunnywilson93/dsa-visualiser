import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './EventLoopViz.module.css'

interface Step {
  description: string
  codeLine: number
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  phase: 'sync' | 'micro' | 'macro' | 'idle'
}

const code = [
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
]

const steps: Step[] = [
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
]

export function EventLoopViz() {
  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = steps[stepIndex]
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

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

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return '#667eea'
      case 'micro': return '#8b5cf6'
      case 'macro': return '#f59e0b'
      case 'idle': return '#555'
    }
  }

  return (
    <div className={styles.container}>
      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase === 'sync' ? 'Sync' :
             currentStep.phase === 'micro' ? 'Microtask' :
             currentStep.phase === 'macro' ? 'Macrotask' : 'Idle'}
          </span>
        </div>
        <pre className={styles.code}>
          {code.map((line, i) => (
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

      {/* Queues visualization */}
      <div className={styles.queuesGrid}>
        {/* Call Stack */}
        <div className={styles.queue}>
          <div className={styles.queueHeader} style={{ background: '#667eea' }}>
            📚 Call Stack
          </div>
          <div className={styles.queueContent}>
            <AnimatePresence mode="popLayout">
              {currentStep.callStack.length === 0 ? (
                <div className={styles.emptyQueue}>(empty)</div>
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

        {/* Microtask Queue */}
        <div className={styles.queue}>
          <div className={styles.queueHeader} style={{ background: '#8b5cf6' }}>
            ⚡ Microtasks
          </div>
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

        {/* Macrotask Queue */}
        <div className={styles.queue}>
          <div className={styles.queueHeader} style={{ background: '#f59e0b' }}>
            ⏰ Macrotasks
          </div>
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

        {/* Output */}
        <div className={styles.queue}>
          <div className={styles.queueHeader} style={{ background: '#10b981' }}>
            📤 Output
          </div>
          <div className={styles.queueContent}>
            {currentStep.output.length === 0 ? (
              <div className={styles.emptyQueue}>—</div>
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
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{steps.length}</span>
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
          disabled={stepIndex >= steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          ↻ Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Priority Order:</strong> Sync code → ALL microtasks → ONE macrotask → repeat.
        Microtasks (Promises) always run before macrotasks (setTimeout)!
      </div>
    </div>
  )
}
