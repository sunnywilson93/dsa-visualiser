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

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string; description: string }> = {
  beginner: {
    label: 'Beginner',
    color: '#10b981',
    description: 'Basic hoisting concepts'
  },
  intermediate: {
    label: 'Intermediate',
    color: '#f59e0b',
    description: 'TDZ and comparisons'
  },
  advanced: {
    label: 'Advanced',
    color: '#ef4444',
    description: 'Edge cases and gotchas'
  }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'var-basic',
      title: 'var Hoisting',
      code: [
        'console.log(x);  // ???',
        'var x = 5;',
        'console.log(x);  // ???',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created. JS scans for declarations and hoists var x to the top with value undefined',
          codeLine: -1,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(x) executes - x exists but is undefined because only the declaration was hoisted, not the assignment',
          codeLine: 0,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: ['undefined'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'var x = 5 executes - now x gets its actual value assigned',
          codeLine: 1,
          variables: [{ name: 'x', value: '5', status: 'initialized' }],
          output: ['undefined'],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'console.log(x) executes - x is now 5',
          codeLine: 2,
          variables: [{ name: 'x', value: '5', status: 'initialized' }],
          output: ['undefined', '5'],
        },
      ],
    },
    {
      id: 'function-basic',
      title: 'Function Declaration',
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
          description: 'Global EC created. Function declarations are FULLY hoisted - both the name and the entire function body!',
          codeLine: -1,
          variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'greet() is called - it works! The function is fully available because function declarations are completely hoisted',
          codeLine: 0,
          variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
          output: ['Hello!'],
        },
      ],
    },
  ],
  intermediate: [
    {
      id: 'let-tdz',
      title: 'let & TDZ',
      code: [
        'console.log(y);  // ???',
        'let y = 10;',
        'console.log(y);  // ???',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created. let y IS hoisted, but placed in Temporal Dead Zone (TDZ) - it exists but cannot be accessed',
          codeLine: -1,
          variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(y) - y is in TDZ! Accessing it throws ReferenceError. This is the key difference from var',
          codeLine: 0,
          variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
          output: [],
          error: "ReferenceError: Cannot access 'y' before initialization",
        },
      ],
    },
    {
      id: 'var-vs-let',
      title: 'var vs let',
      code: [
        'console.log(a);  // var',
        'console.log(b);  // let',
        'var a = 1;',
        'let b = 2;',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Both a and b are hoisted, but with different behaviors: var → undefined, let → TDZ',
          codeLine: -1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(a) works! var variables are initialized with undefined during hoisting',
          codeLine: 0,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'console.log(b) fails! let variables are in TDZ until their declaration is reached',
          codeLine: 1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined'],
          error: "ReferenceError: Cannot access 'b' before initialization",
        },
      ],
    },
    {
      id: 'func-expression',
      title: 'Function Expression',
      code: [
        'greet();  // ???',
        '',
        'var greet = function() {',
        '  console.log("Hi!");',
        '};',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'greet is hoisted as a VAR (undefined), NOT as a function! The function body is NOT hoisted',
          codeLine: -1,
          variables: [{ name: 'greet', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'greet() fails! greet is undefined at this point - you cannot call undefined as a function',
          codeLine: 0,
          variables: [{ name: 'greet', value: 'undefined', status: 'hoisted' }],
          output: [],
          error: "TypeError: greet is not a function",
        },
      ],
    },
  ],
  advanced: [
    {
      id: 'mixed',
      title: 'Mixed Declarations',
      code: [
        'console.log(a, fn());',
        'var a = 1;',
        'let b = 2;',
        'function fn() { return 42; }',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Hoisting priority: 1) Functions (fully), 2) var (undefined), 3) let/const (TDZ)',
          codeLine: -1,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(a, fn()) - a is undefined, fn() returns 42. Functions are ready immediately!',
          codeLine: 0,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined 42'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'var a = 1 - a gets its value',
          codeLine: 1,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined 42'],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'let b = 2 - b leaves TDZ and gets initialized',
          codeLine: 2,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b', value: '2', status: 'initialized' },
          ],
          output: ['undefined 42'],
        },
      ],
    },
    {
      id: 'redeclaration',
      title: 'var Redeclaration',
      code: [
        'var x = 1;',
        'var x = 2;',
        'console.log(x);',
        '',
        '// let y = 1;',
        '// let y = 2; // SyntaxError!',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'var allows redeclaration in same scope - x is hoisted once. let/const would throw SyntaxError!',
          codeLine: -1,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'First var x = 1 executes',
          codeLine: 0,
          variables: [{ name: 'x', value: '1', status: 'initialized' }],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Second var x = 2 simply reassigns x. No error with var!',
          codeLine: 1,
          variables: [{ name: 'x', value: '2', status: 'initialized' }],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'console.log(x) outputs 2. This is why let/const are preferred - they catch accidental redeclarations',
          codeLine: 2,
          variables: [{ name: 'x', value: '2', status: 'initialized' }],
          output: ['2'],
        },
      ],
    },
    {
      id: 'block-scope',
      title: 'Block Scope',
      code: [
        'var a = 1;',
        'let b = 2;',
        '{',
        '  var a = 10;  // same a!',
        '  let b = 20;  // new b!',
        '  console.log(a, b);',
        '}',
        'console.log(a, b);',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'var is function-scoped (ignores blocks), let is block-scoped. Two different behaviors!',
          codeLine: -1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b (outer)', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'var a = 1, let b = 2 - outer variables initialized',
          codeLine: 1,
          variables: [
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
          ],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Entering block: var a = 10 OVERWRITES outer a, but let b = 20 creates NEW block-scoped b',
          codeLine: 4,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
            { name: 'b (block)', value: '20', status: 'initialized' },
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'Inside block: console.log(a, b) → 10, 20 (uses block-scoped b)',
          codeLine: 5,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
            { name: 'b (block)', value: '20', status: 'initialized' },
          ],
          output: ['10 20'],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'Outside block: a is still 10 (var leaked!), but b is 2 (block b is gone). This is why let is safer!',
          codeLine: 7,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
          ],
          output: ['10 20', '10 2'],
        },
      ],
    },
  ],
}

export function HoistingViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
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
      <div className={styles.selector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.selectorBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
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

        {/* Variables panel - Neon Box */}
        <div className={`${styles.neonBox} ${styles.variablesBox}`}>
          <div className={styles.neonBoxHeader}>Variable Environment</div>
          <div className={styles.neonBoxInner}>
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

        {/* Output panel - Neon Box */}
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Output</div>
          <div className={styles.neonBoxInner}>
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
                {currentStep.error}
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
          Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
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
