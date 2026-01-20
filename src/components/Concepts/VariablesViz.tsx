import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './VariablesViz.module.css'

interface Variable {
  name: string
  keyword: 'var' | 'let' | 'const'
  value: string
  scope: 'global' | 'function' | 'block'
}

interface Step {
  id: number
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

const examples: Example[] = [
  {
    id: 'declaration',
    title: 'var vs let vs const',
    code: [
      'var a = 1;    // var: function-scoped',
      'let b = 2;    // let: block-scoped',
      'const c = 3;  // const: cannot reassign',
      '',
      'a = 10;  // OK',
      'b = 20;  // OK',
      '// c = 30; // Error!',
    ],
    steps: [
      {
        id: 0,
        description: 'var creates a function-scoped variable. It can be redeclared and reassigned.',
        codeLine: 0,
        variables: [{ name: 'a', keyword: 'var', value: '1', scope: 'function' }],
        output: [],
      },
      {
        id: 1,
        description: 'let creates a block-scoped variable. Cannot be redeclared in same scope.',
        codeLine: 1,
        variables: [
          { name: 'a', keyword: 'var', value: '1', scope: 'function' },
          { name: 'b', keyword: 'let', value: '2', scope: 'block' },
        ],
        output: [],
      },
      {
        id: 2,
        description: 'const creates a constant binding. Must be initialized and cannot be reassigned.',
        codeLine: 2,
        variables: [
          { name: 'a', keyword: 'var', value: '1', scope: 'function' },
          { name: 'b', keyword: 'let', value: '2', scope: 'block' },
          { name: 'c', keyword: 'const', value: '3', scope: 'block' },
        ],
        output: [],
      },
      {
        id: 3,
        description: 'var and let can be reassigned to new values.',
        codeLine: 4,
        variables: [
          { name: 'a', keyword: 'var', value: '10', scope: 'function' },
          { name: 'b', keyword: 'let', value: '2', scope: 'block' },
          { name: 'c', keyword: 'const', value: '3', scope: 'block' },
        ],
        output: [],
      },
      {
        id: 4,
        description: 'let can be reassigned too.',
        codeLine: 5,
        variables: [
          { name: 'a', keyword: 'var', value: '10', scope: 'function' },
          { name: 'b', keyword: 'let', value: '20', scope: 'block' },
          { name: 'c', keyword: 'const', value: '3', scope: 'block' },
        ],
        output: [],
      },
    ],
  },
  {
    id: 'const-objects',
    title: 'const with Objects',
    code: [
      'const person = { name: "Alice" };',
      '',
      '// Mutating the object works!',
      'person.name = "Bob";',
      'person.age = 25;',
      '',
      '// Reassigning fails!',
      '// person = {}; // TypeError!',
    ],
    steps: [
      {
        id: 0,
        description: 'const creates a constant BINDING to the object, not an immutable object.',
        codeLine: 0,
        variables: [{ name: 'person', keyword: 'const', value: '{ name: "Alice" }', scope: 'block' }],
        output: [],
      },
      {
        id: 1,
        description: 'We can change properties inside the object - const only prevents reassigning the variable.',
        codeLine: 3,
        variables: [{ name: 'person', keyword: 'const', value: '{ name: "Bob" }', scope: 'block' }],
        output: [],
      },
      {
        id: 2,
        description: 'Adding new properties also works - we\'re modifying the object, not the binding.',
        codeLine: 4,
        variables: [{ name: 'person', keyword: 'const', value: '{ name: "Bob", age: 25 }', scope: 'block' }],
        output: [],
      },
      {
        id: 3,
        description: 'But reassigning person to a new object would fail - that changes the binding!',
        codeLine: 7,
        variables: [{ name: 'person', keyword: 'const', value: '{ name: "Bob", age: 25 }', scope: 'block' }],
        output: [],
        error: 'TypeError: Assignment to constant variable',
      },
    ],
  },
  {
    id: 'block-scope',
    title: 'Block Scope',
    code: [
      'let x = "outer";',
      '',
      'if (true) {',
      '  let x = "inner";  // new x!',
      '  console.log(x);   // "inner"',
      '}',
      '',
      'console.log(x);     // "outer"',
    ],
    steps: [
      {
        id: 0,
        description: 'Create x in the outer scope.',
        codeLine: 0,
        variables: [{ name: 'x (outer)', keyword: 'let', value: '"outer"', scope: 'block' }],
        output: [],
      },
      {
        id: 1,
        description: 'Inside the if block, we create a NEW x that shadows the outer x.',
        codeLine: 3,
        variables: [
          { name: 'x (outer)', keyword: 'let', value: '"outer"', scope: 'block' },
          { name: 'x (block)', keyword: 'let', value: '"inner"', scope: 'block' },
        ],
        output: [],
      },
      {
        id: 2,
        description: 'Inside the block, we see the inner x.',
        codeLine: 4,
        variables: [
          { name: 'x (outer)', keyword: 'let', value: '"outer"', scope: 'block' },
          { name: 'x (block)', keyword: 'let', value: '"inner"', scope: 'block' },
        ],
        output: ['"inner"'],
      },
      {
        id: 3,
        description: 'Outside the block, the inner x is gone. We see the outer x again.',
        codeLine: 7,
        variables: [{ name: 'x (outer)', keyword: 'let', value: '"outer"', scope: 'block' }],
        output: ['"inner"', '"outer"'],
      },
    ],
  },
]

const keywordColors = {
  var: '#f59e0b',
  let: '#3b82f6',
  const: '#10b981',
}

export function VariablesViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.selector}>
        {examples.map((ex, i) => (
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
          <div className={styles.panelHeader}>Code</div>
          <pre className={styles.code}>
            {currentExample.code.map((line, i) => (
              <div
                key={i}
                className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
              >
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={styles.lineCode}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Variables panel */}
        <div className={styles.neonBox}>
          <div className={styles.neonBoxHeader}>Variables</div>
          <div className={styles.neonBoxInner}>
            <AnimatePresence mode="popLayout">
              {currentStep.variables.map(v => (
                <motion.div
                  key={v.name}
                  className={styles.variable}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ borderColor: keywordColors[v.keyword] }}
                  layout
                >
                  <span className={styles.varKeyword} style={{ color: keywordColors[v.keyword] }}>
                    {v.keyword}
                  </span>
                  <span className={styles.varName}>{v.name}</span>
                  <span className={styles.varEquals}>=</span>
                  <motion.span
                    key={v.value}
                    className={styles.varValue}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    {v.value}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Output panel */}
        <div className={styles.outputBox}>
          <div className={styles.neonBoxHeader}>Console</div>
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
          key={`${exampleIndex}-${stepIndex}`}
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
          <span className={styles.legendDot} style={{ background: keywordColors.var }} />
          <span>var (function scope)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: keywordColors.let }} />
          <span>let (block scope)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: keywordColors.const }} />
          <span>const (constant)</span>
        </div>
      </div>
    </div>
  )
}
