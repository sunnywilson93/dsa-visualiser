import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ThisKeywordViz.module.css'

interface Step {
  description: string
  thisValue: string
  thisExplanation: string
  highlightLine?: number
}

interface Example {
  id: string
  title: string
  bindingType: string
  color: string
  code: string[]
  steps: Step[]
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
      id: 'implicit',
      title: 'Object Method',
      bindingType: 'Implicit Binding',
      color: '#10b981',
      code: [
        'const person = {',
        '  name: "Alice",',
        '  greet() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'person.greet();  // "Alice"',
      ],
      steps: [
        { description: 'person.greet() is called - look at what\'s LEFT of the dot', thisValue: 'person', thisExplanation: 'Rule: Object before dot = this', highlightLine: 7 },
        { description: 'Inside greet(), this refers to person', thisValue: '{ name: "Alice", greet: fn }', thisExplanation: 'this.name → "Alice"', highlightLine: 3 },
      ],
    },
    {
      id: 'default',
      title: 'Standalone Function',
      bindingType: 'Default Binding',
      color: '#ef4444',
      code: [
        'function showThis() {',
        '  console.log(this);',
        '}',
        '',
        'showThis();  // No object!',
      ],
      steps: [
        { description: 'showThis() called without any object (no dot)', thisValue: 'window', thisExplanation: 'No object → falls back to global', highlightLine: 4 },
        { description: 'In strict mode ("use strict"), this would be undefined', thisValue: 'undefined (strict)', thisExplanation: 'Strict mode prevents accidental global access', highlightLine: 1 },
      ],
    },
  ],
  intermediate: [
    {
      id: 'call-apply',
      title: 'call() / apply()',
      bindingType: 'Explicit Binding',
      color: '#667eea',
      code: [
        'function greet(greeting) {',
        '  console.log(greeting, this.name);',
        '}',
        '',
        'const bob = { name: "Bob" };',
        'const sue = { name: "Sue" };',
        '',
        'greet.call(bob, "Hello");',
        'greet.apply(sue, ["Hi"]);',
      ],
      steps: [
        { description: 'greet.call(bob, "Hello") - first arg becomes this', thisValue: 'bob', thisExplanation: 'call() sets this explicitly', highlightLine: 7 },
        { description: 'Output: "Hello Bob" - this.name is bob.name', thisValue: '{ name: "Bob" }', thisExplanation: 'Overrides default binding', highlightLine: 1 },
        { description: 'greet.apply(sue, ["Hi"]) - same but args in array', thisValue: 'sue', thisExplanation: 'apply() is call() with array args', highlightLine: 8 },
      ],
    },
    {
      id: 'bind',
      title: 'bind()',
      bindingType: 'Hard Binding',
      color: '#8b5cf6',
      code: [
        'const person = {',
        '  name: "Dave",',
        '  greet() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'const greet = person.greet;',
        'greet();  // undefined!',
        '',
        'const boundGreet = person.greet.bind(person);',
        'boundGreet();  // "Dave"',
      ],
      steps: [
        { description: 'Extracting method loses the object context', thisValue: 'window', thisExplanation: 'greet is just a function now', highlightLine: 7 },
        { description: 'Calling extracted greet() - no object, default binding', thisValue: 'window', thisExplanation: 'this.name → undefined', highlightLine: 8 },
        { description: 'bind() creates new function with this permanently set', thisValue: 'person', thisExplanation: 'bind() returns a bound function', highlightLine: 10 },
        { description: 'boundGreet() always uses person as this', thisValue: '{ name: "Dave" }', thisExplanation: 'Cannot be overridden!', highlightLine: 11 },
      ],
    },
    {
      id: 'arrow',
      title: 'Arrow Functions',
      bindingType: 'Lexical this',
      color: '#f59e0b',
      code: [
        'const person = {',
        '  name: "Eve",',
        '  greet: () => {',
        '    console.log(this.name);',
        '  },',
        '  greetRegular() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'person.greet();     // undefined!',
        'person.greetRegular(); // "Eve"',
      ],
      steps: [
        { description: 'Arrow functions DON\'T have their own this', thisValue: 'window (lexical)', thisExplanation: 'Ignores the dot rule entirely', highlightLine: 2 },
        { description: 'person.greet() - arrow looks UP to find this', thisValue: 'window', thisExplanation: 'Inherits from enclosing scope (global)', highlightLine: 10 },
        { description: 'Regular method works normally - dot rule applies', thisValue: 'person', thisExplanation: 'greetRegular uses implicit binding', highlightLine: 11 },
      ],
    },
  ],
  advanced: [
    {
      id: 'new-binding',
      title: 'new Keyword',
      bindingType: 'Constructor Binding',
      color: '#f59e0b',
      code: [
        'function Person(name) {',
        '  // 1. Empty object created',
        '  // 2. this = new object',
        '  this.name = name;',
        '  this.greet = function() {',
        '    console.log(this.name);',
        '  };',
        '  // 3. Object returned',
        '}',
        '',
        'const p = new Person("Carol");',
      ],
      steps: [
        { description: 'new creates an empty object and sets it as this', thisValue: '{ }', thisExplanation: 'Fresh object created automatically', highlightLine: 10 },
        { description: 'this.name = name adds property to new object', thisValue: '{ name: "Carol" }', thisExplanation: 'Building the new instance', highlightLine: 3 },
        { description: 'this.greet adds method to the new object', thisValue: '{ name, greet }', thisExplanation: 'Method added to instance', highlightLine: 4 },
        { description: 'The constructed object is returned and assigned to p', thisValue: 'p = { name, greet }', thisExplanation: 'new binding has highest priority', highlightLine: 10 },
      ],
    },
    {
      id: 'callback-lost',
      title: 'Lost Binding',
      bindingType: 'Common Bug',
      color: '#ef4444',
      code: [
        'const user = {',
        '  name: "Frank",',
        '  fetchData() {',
        '    setTimeout(function() {',
        '      console.log(this.name);',
        '    }, 100);',
        '  }',
        '};',
        '',
        'user.fetchData();  // undefined!',
      ],
      steps: [
        { description: 'user.fetchData() is called - implicit binding', thisValue: 'user', thisExplanation: 'So far so good...', highlightLine: 9 },
        { description: 'setTimeout receives the callback function', thisValue: 'user', thisExplanation: 'Callback is passed, not called yet', highlightLine: 3 },
        { description: 'Later: callback invoked by setTimeout (no dot!)', thisValue: 'window', thisExplanation: 'Callback loses its context!', highlightLine: 4 },
        { description: 'this.name is undefined - common source of bugs', thisValue: 'window', thisExplanation: 'Fix: use arrow fn or bind()', highlightLine: 4 },
      ],
    },
    {
      id: 'callback-fix',
      title: 'Fixed with Arrow',
      bindingType: 'Arrow Solution',
      color: '#10b981',
      code: [
        'const user = {',
        '  name: "Grace",',
        '  fetchData() {',
        '    setTimeout(() => {',
        '      console.log(this.name);',
        '    }, 100);',
        '  }',
        '};',
        '',
        'user.fetchData();  // "Grace"',
      ],
      steps: [
        { description: 'user.fetchData() - implicit binding, this = user', thisValue: 'user', thisExplanation: 'Method called with dot notation', highlightLine: 9 },
        { description: 'Arrow function created - captures this from fetchData', thisValue: 'user (captured)', thisExplanation: 'Arrow inherits enclosing this', highlightLine: 3 },
        { description: 'Later: arrow callback runs, uses captured this', thisValue: 'user', thisExplanation: 'Arrow "remembers" the this value', highlightLine: 4 },
        { description: 'this.name = "Grace" - problem solved!', thisValue: '{ name: "Grace" }', thisExplanation: 'Arrow fns are perfect for callbacks', highlightLine: 4 },
      ],
    },
  ],
}

export function ThisKeywordViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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

      {/* Main visualization */}
      <div className={styles.mainGrid}>
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.panelHeader} style={{ borderColor: currentExample.color }}>
            <span>Code</span>
            <span className={styles.badge} style={{ background: currentExample.color }}>{currentExample.bindingType}</span>
          </div>
          <pre className={styles.code}>
            {currentExample.code.map((line, i) => (
              <div
                key={i}
                className={`${styles.codeLine} ${currentStep.highlightLine === i ? styles.activeLine : ''}`}
              >
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
                  key={`${level}-${exampleIndex}-${stepIndex}-${currentStep.thisValue}`}
                  className={styles.thisValue}
                  style={{ borderColor: currentExample.color, color: currentExample.color }}
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
        <button className={styles.btnSecondary} onClick={() => setStepIndex(0)}>
          ↻ Reset
        </button>
      </div>

      {/* Priority note */}
      <div className={styles.priorityNote}>
        <strong>Binding Priority:</strong> new → explicit (call/apply/bind) → implicit (dot) → default (global).
        Arrow functions inherit this lexically from enclosing scope.
      </div>
    </div>
  )
}
