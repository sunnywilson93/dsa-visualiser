import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ClosuresViz.module.css'

interface ExecutionContext {
  id: string
  name: string
  variables: { name: string; value: string }[]
  outerRef: string | null
}

interface HeapObject {
  id: string
  label: string
  type: 'scope' | 'function'
  vars: { name: string; value: string }[]
  scopeRef?: string
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  callStack: ExecutionContext[]
  heap: HeapObject[]
  output: string[]
}

const codeLines = [
  'function createCounter() {',
  '  let count = 0;',
  '  return function() {',
  '    count++;',
  '    return count;',
  '  };',
  '}',
  '',
  'const counter = createCounter();',
  'counter();  // 1',
  'counter();  // 2',
]

const steps: Step[] = [
  {
    id: 0,
    phase: 'Creation',
    description: 'Global Execution Context is created and pushed onto the stack',
    highlightLines: [],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null }
    ],
    heap: [],
    output: [],
  },
  {
    id: 1,
    phase: 'Execution',
    description: 'createCounter() is invoked - new Execution Context created',
    highlightLines: [8],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
      { id: 'createCounter', name: 'createCounter() EC', variables: [], outerRef: 'global' }
    ],
    heap: [],
    output: [],
  },
  {
    id: 2,
    phase: 'Creation',
    description: 'createCounter EC Creation Phase: count is hoisted with undefined',
    highlightLines: [0],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
      { id: 'createCounter', name: 'createCounter() EC', variables: [{ name: 'count', value: 'undefined' }], outerRef: 'global' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope', type: 'scope', vars: [{ name: 'count', value: 'undefined' }] }
    ],
    output: [],
  },
  {
    id: 3,
    phase: 'Execution',
    description: 'Execution Phase: count = 0 is assigned',
    highlightLines: [1],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
      { id: 'createCounter', name: 'createCounter() EC', variables: [{ name: 'count', value: '0' }], outerRef: 'global' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope', type: 'scope', vars: [{ name: 'count', value: '0' }] }
    ],
    output: [],
  },
  {
    id: 4,
    phase: 'Execution',
    description: 'Inner function object created in heap with [[Scope]] reference',
    highlightLines: [2, 3, 4, 5],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
      { id: 'createCounter', name: 'createCounter() EC', variables: [{ name: 'count', value: '0' }], outerRef: 'global' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope', type: 'scope', vars: [{ name: 'count', value: '0' }] },
      { id: 'innerFn', label: 'Function Object', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: [],
  },
  {
    id: 5,
    phase: 'Return',
    description: 'createCounter() returns & pops. EC destroyed, but Scope survives in heap!',
    highlightLines: [6],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '0' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: [],
  },
  {
    id: 6,
    phase: 'Execution',
    description: 'counter() called - new EC created, linked to closed-over scope',
    highlightLines: [9],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
      { id: 'counter1', name: 'counter() EC', variables: [], outerRef: 'scope1' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '0' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: [],
  },
  {
    id: 7,
    phase: 'Execution',
    description: 'count++ - looks up scope chain, finds count in closure, increments',
    highlightLines: [3],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
      { id: 'counter1', name: 'counter() EC', variables: [], outerRef: 'scope1' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '1' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: ['→ 1'],
  },
  {
    id: 8,
    phase: 'Return',
    description: 'counter() returns 1 and pops. Closure scope still alive!',
    highlightLines: [9],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '1' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: ['→ 1'],
  },
  {
    id: 9,
    phase: 'Execution',
    description: 'counter() called again - new EC, same closure scope!',
    highlightLines: [10],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
      { id: 'counter2', name: 'counter() EC', variables: [], outerRef: 'scope1' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '1' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: ['→ 1'],
  },
  {
    id: 10,
    phase: 'Execution',
    description: 'count++ again - same variable in closure! 1 → 2',
    highlightLines: [3],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
      { id: 'counter2', name: 'counter() EC', variables: [], outerRef: 'scope1' }
    ],
    heap: [
      { id: 'scope1', label: 'createCounter Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'count', value: '2' }] },
      { id: 'innerFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
    ],
    output: ['→ 1', '→ 2'],
  },
]

export function ClosuresViz() {
  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = steps[stepIndex]
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-scroll to highlighted line
  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Creation': return '#60a5fa'
      case 'Execution': return '#10b981'
      case 'Return': return '#f59e0b'
      default: return '#888'
    }
  }

  return (
    <div className={styles.container}>
      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.codeHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase} Phase
          </span>
        </div>
        <pre className={styles.code}>
          {codeLines.map((line, i) => (
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

      {/* Memory visualization */}
      <div className={styles.memoryContainer}>
        {/* Call Stack with Execution Contexts */}
        <div className={styles.stackSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📚</span>
            Call Stack
          </div>
          <div className={styles.stack}>
            <AnimatePresence mode="popLayout">
              {currentStep.callStack.slice().reverse().map((ec) => (
                <motion.div
                  key={ec.id}
                  className={`${styles.executionContext} ${ec.id === 'global' ? styles.globalEc : ''}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                  layout
                >
                  <div className={styles.ecHeader}>{ec.name}</div>
                  <div className={styles.ecContent}>
                    <div className={styles.ecSection}>
                      <span className={styles.ecLabel}>Variables:</span>
                      {ec.variables.length > 0 ? (
                        ec.variables.map(v => (
                          <div key={v.name} className={styles.ecVar}>
                            <span className={styles.ecVarName}>{v.name}</span>
                            <span className={styles.ecVarValue}>{v.value}</span>
                          </div>
                        ))
                      ) : (
                        <span className={styles.ecEmpty}>(none)</span>
                      )}
                    </div>
                    {ec.outerRef && (
                      <div className={styles.ecSection}>
                        <span className={styles.ecLabel}>Outer:</span>
                        <span className={styles.ecRef}>→ {ec.outerRef}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Heap Memory */}
        <div className={styles.heapSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🗄️</span>
            Heap Memory
          </div>
          <div className={styles.heap}>
            <AnimatePresence mode="popLayout">
              {currentStep.heap.length === 0 ? (
                <motion.div
                  key="empty"
                  className={styles.emptyHeap}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  (empty)
                </motion.div>
              ) : (
                currentStep.heap.map((obj) => (
                  <motion.div
                    key={obj.id}
                    className={`${styles.heapBlock} ${obj.type === 'scope' ? styles.scopeBlock : styles.functionBlock}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <div className={styles.heapLabel}>{obj.label}</div>
                    <div className={styles.heapVars}>
                      {obj.vars.map((v) => (
                        <div key={v.name} className={styles.heapVar}>
                          <span className={styles.heapVarName}>{v.name}:</span>
                          <motion.span
                            key={v.value}
                            className={styles.heapVarValue}
                            initial={{ scale: 1.2, color: '#f59e0b' }}
                            animate={{ scale: 1, color: v.name === '[[Scope]]' ? '#667eea' : '#10b981' }}
                          >
                            {v.value}
                          </motion.span>
                        </div>
                      ))}
                    </div>
                    {obj.label.includes('CLOSED OVER') && (
                      <div className={styles.closureBadge}>Closure!</div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Output */}
        <div className={styles.outputSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📤</span>
            Output
          </div>
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
        <strong>Execution Context</strong> = Variable Environment + Lexical Environment (outer reference) + this binding.
        Each function call creates a new EC pushed onto the stack. When it returns, the EC is destroyed —
        but if an inner function references outer variables, that <em>scope object stays in the heap</em> as a closure!
      </div>
    </div>
  )
}
