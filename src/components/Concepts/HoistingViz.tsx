import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HoistingViz.module.css'

interface Variable {
  name: string
  value: string
  status: 'hoisted' | 'initialized' | 'tdz'
}

interface Step {
  id: number
  phase: 'Creation' | 'Execution'
  description: string
  codeLine: number
  variables: Variable[]
  output: string[]
  error?: string
}

type Example = 'var' | 'let' | 'function' | 'mixed'

const examples: Record<Example, { code: string[]; steps: Step[] }> = {
  var: {
    code: [
      'console.log(x);  // ???',
      'var x = 5;',
      'console.log(x);  // ???',
    ],
    steps: [
      {
        id: 0,
        phase: 'Creation',
        description: 'Global EC created. JS scans for declarations and hoists var x',
        codeLine: -1,
        variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
        output: [],
      },
      {
        id: 1,
        phase: 'Execution',
        description: 'console.log(x) - x exists but is undefined (hoisted)',
        codeLine: 0,
        variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
        output: ['undefined'],
      },
      {
        id: 2,
        phase: 'Execution',
        description: 'var x = 5 - now x gets its value assigned',
        codeLine: 1,
        variables: [{ name: 'x', value: '5', status: 'initialized' }],
        output: ['undefined'],
      },
      {
        id: 3,
        phase: 'Execution',
        description: 'console.log(x) - x is now 5',
        codeLine: 2,
        variables: [{ name: 'x', value: '5', status: 'initialized' }],
        output: ['undefined', '5'],
      },
    ],
  },
  let: {
    code: [
      'console.log(y);  // ???',
      'let y = 10;',
      'console.log(y);  // ???',
    ],
    steps: [
      {
        id: 0,
        phase: 'Creation',
        description: 'Global EC created. let y is hoisted but in Temporal Dead Zone (TDZ)',
        codeLine: -1,
        variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
        output: [],
      },
      {
        id: 1,
        phase: 'Execution',
        description: 'console.log(y) - y is in TDZ! ReferenceError thrown',
        codeLine: 0,
        variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
        output: [],
        error: "ReferenceError: Cannot access 'y' before initialization",
      },
    ],
  },
  function: {
    code: [
      'greet();  // ???',
      '',
      'function greet() {',
      '  console.log("Hello!");',
      '}',
    ],
    steps: [
      {
        id: 0,
        phase: 'Creation',
        description: 'Global EC created. Function declaration is FULLY hoisted with its body',
        codeLine: -1,
        variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
        output: [],
      },
      {
        id: 1,
        phase: 'Execution',
        description: 'greet() - function exists and can be called!',
        codeLine: 0,
        variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
        output: ['Hello!'],
      },
    ],
  },
  mixed: {
    code: [
      'console.log(a, b, fn);',
      'var a = 1;',
      'let b = 2;',
      'function fn() {}',
    ],
    steps: [
      {
        id: 0,
        phase: 'Creation',
        description: 'Scanning declarations: var a hoisted, let b in TDZ, function fn fully hoisted',
        codeLine: -1,
        variables: [
          { name: 'a', value: 'undefined', status: 'hoisted' },
          { name: 'b', value: '<TDZ>', status: 'tdz' },
          { name: 'fn', value: 'fn()', status: 'initialized' },
        ],
        output: [],
      },
      {
        id: 1,
        phase: 'Execution',
        description: 'console.log(a, b, fn) - b is in TDZ! ReferenceError',
        codeLine: 0,
        variables: [
          { name: 'a', value: 'undefined', status: 'hoisted' },
          { name: 'b', value: '<TDZ>', status: 'tdz' },
          { name: 'fn', value: 'fn()', status: 'initialized' },
        ],
        output: [],
        error: "ReferenceError: Cannot access 'b' before initialization",
      },
    ],
  },
}

export function HoistingViz() {
  const [selectedExample, setSelectedExample] = useState<Example>('var')
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const example = examples[selectedExample]
  const currentStep = example.steps[stepIndex]

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

  const handleExampleChange = (ex: Example) => {
    setSelectedExample(ex)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < example.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getStatusColor = (status: Variable['status']) => {
    switch (status) {
      case 'hoisted': return '#f59e0b'
      case 'initialized': return '#10b981'
      case 'tdz': return '#ef4444'
    }
  }

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.selector}>
        {(['var', 'let', 'function', 'mixed'] as Example[]).map(ex => (
          <button
            key={ex}
            className={`${styles.selectorBtn} ${selectedExample === ex ? styles.active : ''}`}
            onClick={() => handleExampleChange(ex)}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <div className={styles.mainGrid}>
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.panelHeader}>
            <span>Code</span>
            <span
              className={styles.phaseBadge}
              style={{ background: currentStep.phase === 'Creation' ? '#60a5fa' : '#10b981' }}
            >
              {currentStep.phase} Phase
            </span>
          </div>
          <pre className={styles.code}>
            {example.code.map((line, i) => (
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

        {/* Memory panel */}
        <div className={styles.memoryPanel}>
          <div className={styles.panelHeader}>
            <span>Global Execution Context</span>
          </div>
          <div className={styles.ecContent}>
            <div className={styles.ecSection}>
              <div className={styles.ecLabel}>Variable Environment</div>
              <div className={styles.variables}>
                <AnimatePresence mode="popLayout">
                  {currentStep.variables.map(v => (
                    <motion.div
                      key={v.name}
                      className={styles.variable}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ borderColor: getStatusColor(v.status) }}
                      layout
                    >
                      <span className={styles.varName}>{v.name}</span>
                      <motion.span
                        key={v.value}
                        className={styles.varValue}
                        style={{ color: getStatusColor(v.status) }}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {v.value}
                      </motion.span>
                      <span
                        className={styles.varStatus}
                        style={{ background: getStatusColor(v.status) }}
                      >
                        {v.status === 'tdz' ? 'TDZ' : v.status}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className={styles.outputPanel}>
          <div className={styles.panelHeader}>Output</div>
          <div className={styles.output}>
            {currentStep.output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.outputLine}
              >
                {line}
              </motion.div>
            ))}
            {currentStep.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.errorLine}
              >
                ❌ {currentStep.error}
              </motion.div>
            )}
            {currentStep.output.length === 0 && !currentStep.error && (
              <span className={styles.placeholder}>—</span>
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
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{example.steps.length}</span>
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
          disabled={stepIndex >= example.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= example.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          ↻ Reset
        </button>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#f59e0b' }}></span>
          <span>Hoisted (undefined)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#ef4444' }}></span>
          <span>TDZ (cannot access)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#10b981' }}></span>
          <span>Initialized</span>
        </div>
      </div>
    </div>
  )
}
