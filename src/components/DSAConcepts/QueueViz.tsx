'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './QueueViz.module.css'

interface QueueItem {
  id: number
  value: string
}

interface Step {
  id: number
  action: 'enqueue' | 'dequeue' | 'peek' | 'process' | 'error'
  description: string
  queueState: QueueItem[]
  output?: string
  highlightIndex?: number
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const examples: Example[] = [
  {
    id: 'basic-ops',
    title: 'Enqueue & Dequeue',
    steps: [
      { id: 0, action: 'enqueue', description: 'enqueue(1) - Add 1 to the back of the queue', queueState: [{ id: 1, value: '1' }] },
      { id: 1, action: 'enqueue', description: 'enqueue(2) - Add 2 behind 1', queueState: [{ id: 1, value: '1' }, { id: 2, value: '2' }] },
      { id: 2, action: 'enqueue', description: 'enqueue(3) - Add 3 to the back', queueState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }] },
      { id: 3, action: 'peek', description: 'peek() - Look at front element (1) without removing it', queueState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }], output: '1' },
      { id: 4, action: 'dequeue', description: 'dequeue() - Remove and return front element (1)', queueState: [{ id: 2, value: '2' }, { id: 3, value: '3' }], output: '1' },
      { id: 5, action: 'enqueue', description: 'enqueue(4) - Add 4 behind 3', queueState: [{ id: 2, value: '2' }, { id: 3, value: '3' }, { id: 4, value: '4' }] },
      { id: 6, action: 'dequeue', description: 'dequeue() - Remove 2 from the front', queueState: [{ id: 3, value: '3' }, { id: 4, value: '4' }], output: '2' },
      { id: 7, action: 'dequeue', description: 'dequeue() - Remove 3. Order is preserved (FIFO).', queueState: [{ id: 4, value: '4' }], output: '3' },
      { id: 8, action: 'dequeue', description: 'dequeue() - Remove last element. Queue is empty.', queueState: [], output: '4' },
    ],
    insight: 'FIFO (First-In-First-Out): the oldest element leaves first, like a real-world line.'
  },
  {
    id: 'bfs',
    title: 'BFS Traversal',
    steps: [
      { id: 0, action: 'enqueue', description: 'Start BFS: enqueue root A', queueState: [{ id: 1, value: 'A' }] },
      { id: 1, action: 'process', description: 'Dequeue A, visit it, enqueue B and C', queueState: [{ id: 2, value: 'B' }, { id: 3, value: 'C' }], output: 'A' },
      { id: 2, action: 'process', description: 'Dequeue B, visit it, enqueue D and E', queueState: [{ id: 3, value: 'C' }, { id: 4, value: 'D' }, { id: 5, value: 'E' }], output: 'A -> B' },
      { id: 3, action: 'process', description: 'Dequeue C, visit it, enqueue F', queueState: [{ id: 4, value: 'D' }, { id: 5, value: 'E' }, { id: 6, value: 'F' }], output: 'A -> B -> C' },
      { id: 4, action: 'process', description: 'Dequeue D, visit it', queueState: [{ id: 5, value: 'E' }, { id: 6, value: 'F' }], output: 'A -> B -> C -> D' },
      { id: 5, action: 'process', description: 'Dequeue E, visit it', queueState: [{ id: 6, value: 'F' }], output: 'A -> B -> C -> D -> E' },
      { id: 6, action: 'process', description: 'Dequeue F, visit it. Queue is empty - done!', queueState: [], output: 'A -> B -> C -> D -> E -> F' },
    ],
    insight: 'BFS explores level-by-level because the queue always serves the oldest nodes first.'
  },
  {
    id: 'empty-queue',
    title: 'Empty Queue',
    steps: [
      { id: 0, action: 'error', description: 'dequeue() on empty queue - nothing to remove', queueState: [], output: 'null' },
      { id: 1, action: 'enqueue', description: 'enqueue("X") - Add X to the back', queueState: [{ id: 1, value: 'X' }] },
      { id: 2, action: 'dequeue', description: 'dequeue() - Remove X', queueState: [], output: 'X' },
      { id: 3, action: 'error', description: 'peek() on empty queue - no front element', queueState: [], output: 'null' },
    ],
    insight: 'Check isEmpty before dequeue/peek to avoid underflow.'
  },
]

export function QueueViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState<number>(0)
  const [stepIndex, setStepIndex] = useState<number>(0)

  const currentExample: Example = examples[exampleIndex]
  const currentStep: Step = currentExample.steps[stepIndex]

  const handleExampleChange = (index: number): void => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = (): void => {
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex((s: number) => s + 1)
    }
  }

  const handlePrev = (): void => {
    if (stepIndex > 0) {
      setStepIndex((s: number) => s - 1)
    }
  }

  const handleReset = (): void => setStepIndex(0)

  const getActionColor = (action: Step['action']): string => {
    switch (action) {
      case 'enqueue': return '#10b981'
      case 'dequeue': return '#f59e0b'
      case 'peek': return '#60a5fa'
      case 'process': return '#8b5cf6'
      case 'error': return '#ef4444'
      default: return '#888'
    }
  }

  const getHighlightIndex = (step: Step): number | undefined => {
    if (step.highlightIndex !== undefined) {
      return step.highlightIndex
    }
    if (step.action === 'enqueue') return step.queueState.length - 1
    if (step.action === 'dequeue' || step.action === 'peek' || step.action === 'process') return 0
    return undefined
  }

  const highlightIndex: number | undefined = currentStep.queueState.length > 0
    ? getHighlightIndex(currentStep)
    : undefined
  const actionColor: string = getActionColor(currentStep.action)
  const isFrontAction: boolean = currentStep.action === 'dequeue'
    || currentStep.action === 'peek'
    || currentStep.action === 'process'
    || currentStep.action === 'error'
  const isBackAction: boolean = currentStep.action === 'enqueue'
  const frontIndicatorStyle: CSSProperties = isFrontAction
    ? { borderColor: actionColor, color: actionColor, background: `${actionColor}12` }
    : {}
  const backIndicatorStyle: CSSProperties = isBackAction
    ? { borderColor: actionColor, color: actionColor, background: `${actionColor}12` }
    : {}

  const getItemLabel = (index: number, length: number): string | undefined => {
    if (length === 1) return 'Front/Back'
    if (index === 0) return 'Front'
    if (index === length - 1) return 'Back'
    return undefined
  }

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {examples.map((ex: Example, i: number) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Queue visualization */}
      <div className={styles.queueSection}>
        <div className={styles.queueContainer}>
          <div className={styles.queueLabel}>Queue</div>
          <div className={styles.queue}>
            <div className={styles.queueLegend}>
              <div
                className={`${styles.queueEnd} ${isFrontAction ? styles.queueEndActive : ''}`}
                style={frontIndicatorStyle}
              >
                <span className={styles.queueEndTitle}>Front</span>
                <span className={styles.queueEndHint}>dequeue / peek</span>
              </div>
              <div className={styles.queueOrder}>Oldest -&gt; Newest</div>
              <div
                className={`${styles.queueEnd} ${isBackAction ? styles.queueEndActive : ''}`}
                style={backIndicatorStyle}
              >
                <span className={styles.queueEndTitle}>Back</span>
                <span className={styles.queueEndHint}>enqueue</span>
              </div>
            </div>
            <div className={styles.queueItems}>
              <AnimatePresence mode="popLayout">
                {currentStep.queueState.length === 0 ? (
                  <motion.div
                    key="empty"
                    className={styles.emptyQueue}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Empty
                  </motion.div>
                ) : (
                  currentStep.queueState.map((item: QueueItem, i: number) => {
                    const isActive: boolean = i === highlightIndex
                    const label: string | undefined = getItemLabel(i, currentStep.queueState.length)
                    return (
                      <motion.div
                        key={item.id}
                        className={`${styles.queueItem} ${isActive ? styles.activeItem : ''}`}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        layout
                        style={{
                          borderColor: isActive ? actionColor : 'rgba(255,255,255,0.1)',
                          background: isActive ? `${actionColor}15` : 'rgba(0,0,0,0.3)'
                        }}
                      >
                        <span className={styles.queueIndex}>#{i + 1}</span>
                        <span className={styles.queueValue}>{item.value}</span>
                        {label && <span className={styles.queueItemLabel}>{label}</span>}
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
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
              <span className={styles.outputEmpty}>-</span>
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
          style={{ borderLeftColor: actionColor }}
        >
          <span
            className={styles.actionBadge}
            style={{ background: actionColor }}
          >
            {currentStep.action}
          </span>
          <span className={styles.stepText}>{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          &lt;- Prev
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
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next ->'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
