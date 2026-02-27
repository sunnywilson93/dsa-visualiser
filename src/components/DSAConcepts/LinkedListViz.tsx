'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

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
  head: 'var(--color-action-access)',
  tail: 'var(--color-action-search)',
  current: 'var(--color-action-success)',
  prev: 'var(--color-action-compare)',
  slow: 'var(--color-accent-cyan)',
  fast: 'var(--color-orange-500)',
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
      case 'visit': return 'var(--color-action-visit)'
      case 'insert': return 'var(--color-action-insert)'
      case 'update': return 'var(--color-action-update)'
      case 'found': return 'var(--color-action-success)'
      case 'error': return 'var(--color-action-error)'
      default: return 'var(--color-gray-600)'
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {examples.map((example: Example, index: number) => (
          <button
            key={example.id}
            className={`px-4 py-2 text-sm font-medium bg-white-5 border border-white-10 rounded-md text-gray-500 cursor-pointer transition-all duration-150 hover:bg-white-10 hover:text-white ${exampleIndex === index ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-light' : ''}`}
            onClick={() => handleExampleChange(index)}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="bg-black-20 rounded-lg p-4">
          <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Linked List</div>
            <div className="flex flex-wrap gap-1.5">
              {pointerEntries.map((pointerName: PointerName) => (
                <div key={pointerName} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white-10 bg-black-30 text-[10px] text-gray-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: pointerColors[pointerName] }}
                  />
                  <span className="font-semibold uppercase tracking-wide">{pointerLabels[pointerName]}</span>
                  <span className="text-white font-semibold">
                    {getPointerValueLabel(currentStep.pointers[pointerName])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 p-3 bg-black-30 border-2 border-white-10 rounded-lg min-h-[160px]">
            {currentStep.nodes.map((node: ListNode, index: number) => {
              const isHighlighted: boolean = highlightSet.has(node.id)
              const pointerTags = pointerTagsByNodeId.get(node.id) ?? []
              const accent = getNodeAccent(node.id)
              return (
                <div key={node.id} className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center gap-1">
                    {pointerTags.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-center">
                        {pointerTags.map((pointerName: PointerName) => (
                          <span
                            key={pointerName}
                            className="text-xs px-1 py-0.5 border rounded-full uppercase tracking-wide"
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
                      className={`flex items-stretch border-2 border-white-10 rounded-lg bg-black-30 min-w-[140px] max-sm:min-w-[120px] overflow-hidden ${isHighlighted ? 'shadow-[0_0_18px_rgba(var(--color-brand-primary-rgb),0.2)]' : ''}`}
                      style={getNodeCardStyle(accent, isHighlighted)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <div className="min-w-[60px] px-4 py-2.5 font-mono text-[1.2rem] max-sm:text-base font-bold text-white text-center">{node.value}</div>
                      <div className="w-px bg-white-10" />
                      <div className="flex flex-col justify-center px-2.5 py-1.5 min-w-[70px]">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">next</span>
                        <span className="font-mono text-base text-slate-200">{getNextLabel(node.nextId)}</span>
                      </div>
                    </motion.div>
                  </div>
                  {index < currentStep.nodes.length - 1 && (
                    <div className="w-6 h-0.5 bg-white-20 relative flex-shrink-0 after:content-[''] after:absolute after:right-0.5 after:-top-1 after:border-[5px] after:border-transparent after:border-l-white/40" />
                  )}
                </div>
              )
            })}
            <div className="text-xs text-gray-600 border border-dashed border-white-20 rounded-full px-2 py-0.5 uppercase tracking-wide">null</div>
          </div>

          {currentStep.detachedNode && (
            <div className="mt-4 p-3 bg-black-40 rounded-lg border border-dashed border-white-10">
              <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Detached Node</div>
              <div className="flex items-center gap-3">
                <motion.div
                  className={`flex items-stretch border-2 border-white-10 rounded-lg bg-black-30 min-w-[140px] max-sm:min-w-[120px] overflow-hidden ${currentStep.detachedHighlight ? 'shadow-[0_0_18px_rgba(var(--color-brand-primary-rgb),0.2)]' : ''}`}
                  style={getNodeCardStyle(actionColor, currentStep.detachedHighlight ?? false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="min-w-[60px] px-4 py-2.5 font-mono text-[1.2rem] max-sm:text-base font-bold text-white text-center">{currentStep.detachedNode.value}</div>
                  <div className="w-px bg-white-10" />
                  <div className="flex flex-col justify-center px-2.5 py-1.5 min-w-[70px]">
                    <span className="text-xs text-gray-600 uppercase tracking-wide">next</span>
                    <span className="font-mono text-base text-slate-200">
                      {getNextLabel(currentStep.detachedNode.nextId)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-black-30 rounded-lg p-4 min-w-[120px]">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Output</div>
          <div className="flex items-center justify-center min-h-[50px]">
            {currentStep.output ? (
              <motion.span
                key={`${stepIndex}-${currentStep.output}`}
                initial={{ scale: 1.2, color: 'var(--color-action-search)' }}
                animate={{ scale: 1, color: currentStep.action === 'error' ? 'var(--color-action-error)' : 'var(--color-action-success)' }}
                className="font-mono text-2xl font-bold"
              >
                {currentStep.output}
              </motion.span>
            ) : (
              <span className="text-gray-600 text-xl">-</span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black-30 rounded-lg border-l-[3px] border-brand-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{ borderLeftColor: actionColor }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded text-white"
            style={{ background: actionColor }}
          >
            {currentStep.action}
          </span>
          <span className="text-base text-gray-300 leading-normal">{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      <div className="p-3 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-brand-light">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
