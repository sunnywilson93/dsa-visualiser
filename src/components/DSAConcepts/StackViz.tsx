'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './StackViz.module.css'

interface StackItem {
  id: number
  value: string
  label?: string
}

interface Step {
  id: number
  action: 'push' | 'pop' | 'peek' | 'compare' | 'match' | 'error'
  description: string
  stackState: StackItem[]
  input?: string
  inputIndex?: number
  output?: string
  highlight?: number
}

interface Example {
  id: string
  title: string
  input: string
  steps: Step[]
  insight: string
}

const examples: Example[] = [
  {
    id: 'basic-ops',
    title: 'Push & Pop',
    input: '',
    steps: [
      { id: 0, action: 'push', description: 'push(1) — Add 1 to the top of the stack', stackState: [{ id: 1, value: '1' }] },
      { id: 1, action: 'push', description: 'push(2) — Add 2 on top of 1', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }] },
      { id: 2, action: 'push', description: 'push(3) — Add 3 on top. Stack grows upward.', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }] },
      { id: 3, action: 'peek', description: 'peek() — Look at top element (3) without removing it', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }], output: '3' },
      { id: 4, action: 'pop', description: 'pop() — Remove and return top element (3). LIFO!', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }], output: '3' },
      { id: 5, action: 'pop', description: 'pop() — Remove 2. Note: We can\'t access 1 without removing 2 first.', stackState: [{ id: 1, value: '1' }], output: '2' },
      { id: 6, action: 'pop', description: 'pop() — Remove last element. Stack is now empty.', stackState: [], output: '1' },
    ],
    insight: 'LIFO (Last-In-First-Out): The last element pushed is the first one popped. Like a stack of plates!'
  },
  {
    id: 'valid-parens',
    title: 'Valid Parentheses',
    input: '([{}])',
    steps: [
      { id: 0, action: 'push', description: '"(" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }], inputIndex: 0 },
      { id: 1, action: 'push', description: '"[" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 1 },
      { id: 2, action: 'push', description: '"{" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }, { id: 3, value: '{' }], inputIndex: 2 },
      { id: 3, action: 'compare', description: '"}" — Closing bracket, check if matches top of stack...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }, { id: 3, value: '{' }], inputIndex: 3 },
      { id: 4, action: 'match', description: '"{" matches "}"! Pop the stack.', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 3 },
      { id: 5, action: 'compare', description: '"]" — Check if matches top...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 4 },
      { id: 6, action: 'match', description: '"[" matches "]"! Pop the stack.', stackState: [{ id: 1, value: '(' }], inputIndex: 4 },
      { id: 7, action: 'compare', description: '")" — Check if matches top...', stackState: [{ id: 1, value: '(' }], inputIndex: 5 },
      { id: 8, action: 'match', description: '"(" matches ")"! Stack is empty = Valid!', stackState: [], inputIndex: 5, output: 'true' },
    ],
    insight: 'Stack is perfect for matching pairs because the most recent opening bracket must match the next closing bracket.'
  },
  {
    id: 'invalid-parens',
    title: 'Invalid Case',
    input: '([)]',
    steps: [
      { id: 0, action: 'push', description: '"(" — Push opening bracket', stackState: [{ id: 1, value: '(' }], inputIndex: 0 },
      { id: 1, action: 'push', description: '"[" — Push opening bracket', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 1 },
      { id: 2, action: 'compare', description: '")" — Check if matches top "[" ...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 2 },
      { id: 3, action: 'error', description: '"[" does NOT match ")"! Invalid brackets.', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 2, output: 'false' },
    ],
    insight: 'When a closing bracket doesn\'t match the top of the stack, the string is invalid — we found a mismatch!'
  },
]

export function StackViz() {
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
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => setStepIndex(0)

  const getActionColor = (action: string) => {
    switch (action) {
      case 'push': return '#10b981'
      case 'pop': return '#f59e0b'
      case 'peek': return '#60a5fa'
      case 'compare': return '#8b5cf6'
      case 'match': return '#10b981'
      case 'error': return '#ef4444'
      default: return '#888'
    }
  }

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Input display (for parentheses examples) */}
      {currentExample.input && (
        <div className={styles.inputSection}>
          <div className={styles.inputLabel}>Input String</div>
          <div className={styles.inputChars}>
            {currentExample.input.split('').map((char, i) => (
              <motion.span
                key={i}
                className={`${styles.inputChar} ${currentStep.inputIndex === i ? styles.activeChar : ''} ${currentStep.inputIndex !== undefined && i < currentStep.inputIndex ? styles.processedChar : ''}`}
                animate={{
                  scale: currentStep.inputIndex === i ? 1.2 : 1,
                  color: currentStep.inputIndex === i
                    ? getActionColor(currentStep.action)
                    : currentStep.inputIndex !== undefined && i < currentStep.inputIndex
                      ? '#555'
                      : '#ccc'
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Stack visualization */}
      <div className={styles.stackSection}>
        <div className={styles.stackContainer}>
          <div className={styles.stackLabel}>Stack</div>
          <div className={styles.stack}>
            <div className={styles.stackTop}>← Top</div>
            <div className={styles.stackItems}>
              <AnimatePresence mode="popLayout">
                {currentStep.stackState.length === 0 ? (
                  <motion.div
                    key="empty"
                    className={styles.emptyStack}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Empty
                  </motion.div>
                ) : (
                  [...currentStep.stackState].reverse().map((item, i) => (
                    <motion.div
                      key={item.id}
                      className={`${styles.stackItem} ${i === 0 ? styles.topItem : ''}`}
                      initial={{ opacity: 0, x: -30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.8 }}
                      layout
                      style={{
                        borderColor: i === 0 ? getActionColor(currentStep.action) : 'rgba(255,255,255,0.1)',
                        background: i === 0 ? `${getActionColor(currentStep.action)}15` : 'rgba(0,0,0,0.3)'
                      }}
                    >
                      <span className={styles.stackValue}>{item.value}</span>
                      {item.label && <span className={styles.stackItemLabel}>{item.label}</span>}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            <div className={styles.stackBottom}>← Bottom</div>
          </div>
        </div>

        {/* Output */}
        <div className={styles.outputSection}>
          <div className={styles.outputLabel}>Output</div>
          <div className={styles.output}>
            {currentStep.output ? (
              <motion.span
                key={`${stepIndex}-${currentStep.output}`}
                initial={{ scale: 1.2, color: '#f59e0b' }}
                animate={{ scale: 1, color: currentStep.action === 'error' ? '#ef4444' : '#10b981' }}
                className={styles.outputValue}
              >
                {currentStep.output}
              </motion.span>
            ) : (
              <span className={styles.outputEmpty}>—</span>
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
          style={{ borderLeftColor: getActionColor(currentStep.action) }}
        >
          <span
            className={styles.actionBadge}
            style={{ background: getActionColor(currentStep.action) }}
          >
            {currentStep.action}
          </span>
          <span className={styles.stepText}>{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <span className={styles.stepCounter}>
          {stepIndex + 1} / {currentExample.steps.length}
        </span>
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
          ↻
        </button>
      </div>

      {/* Insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
