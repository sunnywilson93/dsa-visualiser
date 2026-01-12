import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ThisKeywordViz.module.css'

interface Step {
  description: string
  thisValue: string
  thisExplanation: string
}

interface Rule {
  id: string
  name: string
  color: string
  code: string[]
  steps: Step[]
  priority: number
}

const rules: Rule[] = [
  {
    id: 'implicit',
    name: 'Implicit Binding',
    color: '#10b981',
    priority: 3,
    code: [
      'const person = {',
      '  name: "Alice",',
      '  greet() {',
      '    console.log(this.name);',
      '  }',
      '};',
      '',
      'person.greet();',
    ],
    steps: [
      { description: 'person.greet() is called with object left of dot', thisValue: 'person', thisExplanation: 'Object before the dot becomes `this`' },
      { description: 'Inside greet(), this.name resolves to person.name', thisValue: 'person', thisExplanation: 'this.name → "Alice"' },
    ],
  },
  {
    id: 'explicit',
    name: 'Explicit Binding',
    color: '#667eea',
    priority: 2,
    code: [
      'function greet() {',
      '  console.log(this.name);',
      '}',
      '',
      'const bob = { name: "Bob" };',
      '',
      'greet.call(bob);',
    ],
    steps: [
      { description: 'greet.call(bob) explicitly sets this to bob', thisValue: 'bob', thisExplanation: 'call/apply/bind lets you specify `this`' },
      { description: 'this.name resolves to bob.name', thisValue: 'bob', thisExplanation: 'this.name → "Bob"' },
    ],
  },
  {
    id: 'new',
    name: 'new Binding',
    color: '#f59e0b',
    priority: 1,
    code: [
      'function Person(name) {',
      '  this.name = name;',
      '  this.greet = function() {',
      '    console.log(this.name);',
      '  };',
      '}',
      '',
      'const p = new Person("Carol");',
    ],
    steps: [
      { description: 'new Person() creates a fresh empty object', thisValue: '{ }', thisExplanation: 'New object created automatically' },
      { description: 'this.name = name assigns to the new object', thisValue: '{ name: "Carol" }', thisExplanation: 'Properties added to new object' },
      { description: 'The new object is automatically returned', thisValue: '{ name, greet }', thisExplanation: 'p now references this object' },
    ],
  },
  {
    id: 'default',
    name: 'Default Binding',
    color: '#ef4444',
    priority: 4,
    code: [
      'function showThis() {',
      '  console.log(this);',
      '}',
      '',
      'showThis();  // No object!',
    ],
    steps: [
      { description: 'showThis() called without any object context', thisValue: 'window (global)', thisExplanation: 'Falls back to global object' },
      { description: 'In strict mode, this would be undefined', thisValue: 'undefined', thisExplanation: '"use strict" → undefined' },
    ],
  },
  {
    id: 'arrow',
    name: 'Arrow Function',
    color: '#8b5cf6',
    priority: 0,
    code: [
      'const person = {',
      '  name: "Dave",',
      '  greet: () => {',
      '    console.log(this.name);',
      '  }',
      '};',
      '',
      'person.greet();',
    ],
    steps: [
      { description: 'Arrow functions do NOT have their own this', thisValue: 'window (lexical)', thisExplanation: 'Inherits from enclosing scope' },
      { description: 'this.name is undefined (not person.name!)', thisValue: 'window', thisExplanation: 'Arrow ignores the dot rule!' },
    ],
  },
]

export function ThisKeywordViz() {
  const [selectedId, setSelectedId] = useState('implicit')
  const [stepIndex, setStepIndex] = useState(0)

  const rule = rules.find(r => r.id === selectedId)!
  const currentStep = rule.steps[stepIndex]

  const handleRuleChange = (id: string) => {
    setSelectedId(id)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < rule.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  return (
    <div className={styles.container}>
      {/* Rule selector */}
      <div className={styles.ruleSelector}>
        {rules.map(r => (
          <button
            key={r.id}
            className={`${styles.ruleBtn} ${selectedId === r.id ? styles.active : ''}`}
            onClick={() => handleRuleChange(r.id)}
            style={{ '--rule-color': r.color } as React.CSSProperties}
          >
            <span className={styles.rulePriority}>#{r.priority}</span>
            <span className={styles.ruleName}>{r.name}</span>
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <div className={styles.mainGrid}>
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.panelHeader} style={{ borderColor: rule.color }}>
            <span>Code</span>
            <span className={styles.badge} style={{ background: rule.color }}>{rule.name}</span>
          </div>
          <pre className={styles.code}>
            {rule.code.map((line, i) => (
              <div key={i} className={styles.codeLine}>
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={styles.lineCode}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Execution Context */}
        <div className={styles.ecPanel}>
          <div className={styles.panelHeader}>
            <span>Execution Context</span>
          </div>
          <div className={styles.ecContent}>
            <div className={styles.thisBinding}>
              <div className={styles.thisLabel}>this =</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.thisValue}
                  className={styles.thisValue}
                  style={{ borderColor: rule.color, color: rule.color }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  {currentStep.thisValue}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={styles.thisExplanation}>
              {currentStep.thisExplanation}
            </div>
          </div>
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedId}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{rule.steps.length}</span>
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
          disabled={stepIndex >= rule.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= rule.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={() => setStepIndex(0)}>
          ↻ Reset
        </button>
      </div>

      {/* Priority note */}
      <div className={styles.priorityNote}>
        <strong>Binding Priority:</strong> new (#1) → explicit (#2) → implicit (#3) → default (#4).
        Arrow functions (#0) don't have their own `this` at all.
      </div>
    </div>
  )
}
