'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LinkedListViz.module.css'

interface ListNode {
  id: number
  value: string
  nextId: number | null
}

type PointerName = 'head' | 'tail' | 'current' | 'prev' | 'slow' | 'fast'

interface PointerState {
  head?: number | null
  tail?: number | null
  current?: number | null
  prev?: number | null
  slow?: number | null
  fast?: number | null
}

type StepAction = 'visit' | 'insert' | 'update' | 'found' | 'error'

interface Step {
  id: number
  action: StepAction
  description: string
  nodes: ListNode[]
  pointers: PointerState
  output?: string
  highlightNodeIds?: number[]
  detachedNode?: ListNode
  detachedHighlight?: boolean
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const createLinearList = (values: string[], startId: number): ListNode[] => {
  return values.map((value, index) => ({
    id: startId + index,
    value,
    nextId: index < values.length - 1 ? startId + index + 1 : null
  }))
}

const pointerOrder: PointerName[] = ['head', 'tail', 'current', 'prev', 'slow', 'fast']

const pointerLabels: Record<PointerName, string> = {
  head: 'Head',
  tail: 'Tail',
  current: 'Current',
  prev: 'Prev',
  slow: 'Slow',
  fast: 'Fast',
}

const pointerColors: Record<PointerName, string> = {
  head: '#60a5fa',
  tail: '#f59e0b',
  current: '#10b981',
  prev: '#a855f7',
  slow: '#22d3ee',
  fast: '#f97316',
}

const accessList: ListNode[] = createLinearList(['A', 'B', 'C', 'D'], 1)
const insertBase: ListNode[] = createLinearList(['2', '3', '4'], 10)
const insertResult: ListNode[] = [
  { id: 9, value: '1', nextId: 10 },
  ...insertBase,
]
const middleList: ListNode[] = createLinearList(['1', '2', '3', '4', '5'], 20)

const examples: Example[] = [
  {
    id: 'traversal',
    title: 'Traverse to Access',
    steps: [
      {
        id: 0,
        action: 'visit',
        description: 'Start at head. Current points to A while searching for D.',
        nodes: accessList,
        pointers: { head: 1, tail: 4, current: 1 },
        highlightNodeIds: [1],
      },
      {
        id: 1,
        action: 'visit',
        description: 'Move current to next: B.',
        nodes: accessList,
        pointers: { head: 1, tail: 4, current: 2 },
        highlightNodeIds: [2],
      },
      {
        id: 2,
        action: 'visit',
        description: 'Move current to next: C.',
        nodes: accessList,
        pointers: { head: 1, tail: 4, current: 3 },
        highlightNodeIds: [3],
      },
      {
        id: 3,
        action: 'visit',
        description: 'Move current to next: D.',
        nodes: accessList,
        pointers: { head: 1, tail: 4, current: 4 },
        highlightNodeIds: [4],
      },
      {
        id: 4,
        action: 'found',
        description: 'Reached D. Access requires walking the list (O(n)).',
        nodes: accessList,
        pointers: { head: 1, tail: 4, current: 4 },
        output: 'Found D',
        highlightNodeIds: [4],
      },
    ],
    insight: 'Linked lists do not allow random access. You must traverse from head until you reach the target.'
  },
  {
    id: 'insert-head',
    title: 'Insert at Head',
    steps: [
      {
        id: 0,
        action: 'insert',
        description: 'Create new node (1). It is not linked yet.',
        nodes: insertBase,
        pointers: { head: 10, tail: 12 },
        detachedNode: { id: 9, value: '1', nextId: null },
        detachedHighlight: true,
      },
      {
        id: 1,
        action: 'update',
        description: 'Set new.next to the old head (2).',
        nodes: insertBase,
        pointers: { head: 10, tail: 12 },
        detachedNode: { id: 9, value: '1', nextId: 10 },
        detachedHighlight: true,
        highlightNodeIds: [10],
      },
      {
        id: 2,
        action: 'insert',
        description: 'Move head to the new node (1). Done in O(1).',
        nodes: insertResult,
        pointers: { head: 9, tail: 12 },
        output: 'Head updated',
        highlightNodeIds: [9],
      },
    ],
    insight: 'Insert at head is always O(1) because you only update two pointers.'
  },
  {
    id: 'find-middle',
    title: 'Find Middle (Slow/Fast)',
    steps: [
      {
        id: 0,
        action: 'visit',
        description: 'Initialize slow and fast at head.',
        nodes: middleList,
        pointers: { head: 20, tail: 24, slow: 20, fast: 20 },
        highlightNodeIds: [20],
      },
      {
        id: 1,
        action: 'visit',
        description: 'Move slow +1, fast +2.',
        nodes: middleList,
        pointers: { head: 20, tail: 24, slow: 21, fast: 22 },
        highlightNodeIds: [21, 22],
      },
      {
        id: 2,
        action: 'visit',
        description: 'Move slow +1, fast +2 again.',
        nodes: middleList,
        pointers: { head: 20, tail: 24, slow: 22, fast: 24 },
        highlightNodeIds: [22, 24],
      },
      {
        id: 3,
        action: 'found',
        description: 'Fast reached tail. Slow is at the middle.',
        nodes: middleList,
        pointers: { head: 20, tail: 24, slow: 22, fast: 24 },
        output: 'Middle = 3',
        highlightNodeIds: [22],
      },
    ],
    insight: 'Fast/slow pointers find the middle in one pass with O(1) space.'
  },
]

export function LinkedListViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState<number>(0)
  const [stepIndex, setStepIndex] = useState<number>(0)

  const currentExample: Example = examples[exampleIndex]
  const currentStep: Step = currentExample.steps[stepIndex]

  const nodesById: Map<number, ListNode> = new Map()
  currentStep.nodes.forEach((node: ListNode) => {
    nodesById.set(node.id, node)
  })

  const highlightSet: Set<number> = new Set(currentStep.highlightNodeIds ?? [])

  const pointerTagsByNodeId: Map<number, PointerName[]> = new Map()
  pointerOrder.forEach((pointerName: PointerName) => {
    const pointerValue = currentStep.pointers[pointerName]
    if (typeof pointerValue === 'number') {
      const tags = pointerTagsByNodeId.get(pointerValue) ?? []
      tags.push(pointerName)
      pointerTagsByNodeId.set(pointerValue, tags)
    }
  })

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

  const getActionColor = (action: StepAction): string => {
    switch (action) {
      case 'visit': return '#60a5fa'
      case 'insert': return '#10b981'
      case 'update': return '#f59e0b'
      case 'found': return '#10b981'
      case 'error': return '#ef4444'
      default: return '#888'
    }
  }

  const getNextLabel = (nextId: number | null): string => {
    if (nextId === null) return 'null'
    const nextNode = nodesById.get(nextId)
    return nextNode ? nextNode.value : `#${nextId}`
  }

  const getPointerValueLabel = (value: number | null | undefined): string => {
    if (value === null) return 'null'
    if (value === undefined) return '-'
    const node = nodesById.get(value)
    return node ? node.value : `#${value}`
  }

  const actionColor: string = getActionColor(currentStep.action)

  const pointerEntries: PointerName[] = pointerOrder.filter((pointerName: PointerName) => {
    return currentStep.pointers[pointerName] !== undefined
  })

  const getNodeAccent = (nodeId: number): string => {
    if (highlightSet.has(nodeId)) return actionColor
    const tags = pointerTagsByNodeId.get(nodeId)
    if (tags && tags.length > 0) {
      return pointerColors[tags[0]]
    }
    return 'rgba(255,255,255,0.1)'
  }

  const getNodeCardStyle = (accent: string, isActive: boolean): CSSProperties => {
    return {
      borderColor: accent,
      boxShadow: isActive ? `0 0 16px ${accent}55` : undefined
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.exampleSelector}>
        {examples.map((example: Example, index: number) => (
          <button
            key={example.id}
            className={`${styles.exampleBtn} ${exampleIndex === index ? styles.active : ''}`}
            onClick={() => handleExampleChange(index)}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className={styles.listSection}>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <div className={styles.listLabel}>Linked List</div>
            <div className={styles.pointerLegend}>
              {pointerEntries.map((pointerName: PointerName) => (
                <div key={pointerName} className={styles.pointerChip}>
                  <span
                    className={styles.pointerDot}
                    style={{ background: pointerColors[pointerName] }}
                  />
                  <span className={styles.pointerName}>{pointerLabels[pointerName]}</span>
                  <span className={styles.pointerValue}>
                    {getPointerValueLabel(currentStep.pointers[pointerName])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.listRow}>
            {currentStep.nodes.map((node: ListNode, index: number) => {
              const isHighlighted: boolean = highlightSet.has(node.id)
              const pointerTags = pointerTagsByNodeId.get(node.id) ?? []
              const accent = getNodeAccent(node.id)
              return (
                <div key={node.id} className={styles.nodeGroup}>
                  <div className={styles.nodeWrapper}>
                    {pointerTags.length > 0 && (
                      <div className={styles.pointerTags}>
                        {pointerTags.map((pointerName: PointerName) => (
                          <span
                            key={pointerName}
                            className={styles.pointerTag}
                            style={{
                              borderColor: pointerColors[pointerName],
                              color: pointerColors[pointerName],
                              background: `${pointerColors[pointerName]}22`,
                            }}
                          >
                            {pointerLabels[pointerName]}
                          </span>
                        ))}
                      </div>
                    )}
                    <motion.div
                      className={`${styles.nodeCard} ${isHighlighted ? styles.nodeCardActive : ''}`}
                      style={getNodeCardStyle(accent, isHighlighted)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <div className={styles.nodeValue}>{node.value}</div>
                      <div className={styles.nodeDivider} />
                      <div className={styles.nodeNext}>
                        <span className={styles.nextLabel}>next</span>
                        <span className={styles.nextValue}>{getNextLabel(node.nextId)}</span>
                      </div>
                    </motion.div>
                  </div>
                  {index < currentStep.nodes.length - 1 && (
                    <div className={styles.connector} />
                  )}
                </div>
              )
            })}
            <div className={styles.nullTerminator}>null</div>
          </div>

          {currentStep.detachedNode && (
            <div className={styles.detachedSection}>
              <div className={styles.detachedLabel}>Detached Node</div>
              <div className={styles.detachedRow}>
                <motion.div
                  className={`${styles.nodeCard} ${currentStep.detachedHighlight ? styles.nodeCardActive : ''}`}
                  style={getNodeCardStyle(actionColor, currentStep.detachedHighlight ?? false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.nodeValue}>{currentStep.detachedNode.value}</div>
                  <div className={styles.nodeDivider} />
                  <div className={styles.nodeNext}>
                    <span className={styles.nextLabel}>next</span>
                    <span className={styles.nextValue}>
                      {getNextLabel(currentStep.detachedNode.nextId)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

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

      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
