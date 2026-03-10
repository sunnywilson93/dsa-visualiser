'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

type NodeStatus = 'default' | 'current' | 'comparing' | 'swapping' | 'settled'

interface HeapNode {
  value: number
  status: NodeStatus
}

interface HeapTreePosition {
  x: number
  y: number
}

interface Step {
  id: number
  action: 'insert' | 'compare' | 'swap' | 'extract' | 'settle' | 'complete'
  description: string
  heap: HeapNode[]
  highlightIndices?: number[]
  formula?: string
  output?: string
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const makeHeap = (values: number[], statuses?: NodeStatus[]): HeapNode[] =>
  values.map((value, i) => ({
    value,
    status: statuses?.[i] ?? 'default',
  }))

const examples: Example[] = [
  {
    id: 'insert',
    title: 'Insert into Max Heap',
    steps: [
      { id: 0, action: 'insert', description: 'Start with max heap [50, 30, 40, 10, 20]. Insert 60.', heap: makeHeap([50, 30, 40, 10, 20]), formula: 'parent = floor((i-1)/2)' },
      { id: 1, action: 'insert', description: 'Add 60 at the end (index 5). Now check parent.', heap: makeHeap([50, 30, 40, 10, 20, 60], ['default', 'default', 'default', 'default', 'default', 'current']), formula: 'parent(5) = floor(4/2) = 2' },
      { id: 2, action: 'compare', description: 'Compare 60 with parent at index 2 (value 40). 60 > 40, swap!', heap: makeHeap([50, 30, 40, 10, 20, 60], ['default', 'default', 'comparing', 'default', 'default', 'comparing']), formula: '60 > 40 → swap' },
      { id: 3, action: 'swap', description: 'Swapped: 60 is now at index 2. Check new parent.', heap: makeHeap([50, 30, 60, 10, 20, 40], ['default', 'default', 'current', 'default', 'default', 'settled']), formula: 'parent(2) = floor(1/2) = 0' },
      { id: 4, action: 'compare', description: 'Compare 60 with parent at index 0 (value 50). 60 > 50, swap!', heap: makeHeap([50, 30, 60, 10, 20, 40], ['comparing', 'default', 'comparing', 'default', 'default', 'settled']), formula: '60 > 50 → swap' },
      { id: 5, action: 'complete', description: '60 bubbled up to root! Heap property restored: [60, 30, 50, 10, 20, 40]', heap: makeHeap([60, 30, 50, 10, 20, 40], ['settled', 'default', 'settled', 'default', 'default', 'settled']), output: 'Insert O(log n)' },
    ],
    insight: 'Insert adds at the end and "bubbles up" by swapping with parent until heap property is satisfied. O(log n) since tree height is log n.'
  },
  {
    id: 'extract',
    title: 'Extract Max',
    steps: [
      { id: 0, action: 'extract', description: 'Extract max from [60, 30, 50, 10, 20, 40]. Max is root (60).', heap: makeHeap([60, 30, 50, 10, 20, 40], ['current', 'default', 'default', 'default', 'default', 'default']) },
      { id: 1, action: 'swap', description: 'Move last element (40) to root. Remove old root.', heap: makeHeap([40, 30, 50, 10, 20], ['current', 'default', 'default', 'default', 'default']), output: 'Extracted: 60' },
      { id: 2, action: 'compare', description: 'Heapify down: Compare 40 with children. Left=30, Right=50. Max child is 50.', heap: makeHeap([40, 30, 50, 10, 20], ['comparing', 'default', 'comparing', 'default', 'default']), formula: 'left=2(0)+1=1, right=2(0)+2=2' },
      { id: 3, action: 'swap', description: '50 > 40, swap! 40 moves to index 2.', heap: makeHeap([50, 30, 40, 10, 20], ['settled', 'default', 'current', 'default', 'default']), formula: 'Check children of index 2' },
      { id: 4, action: 'compare', description: 'Children of index 2: left=index 5 (out of bounds). No more children.', heap: makeHeap([50, 30, 40, 10, 20], ['settled', 'default', 'comparing', 'default', 'default']), formula: 'left=2(2)+1=5 (none)' },
      { id: 5, action: 'complete', description: 'Heap property restored: [50, 30, 40, 10, 20]. Done!', heap: makeHeap([50, 30, 40, 10, 20], ['settled', 'default', 'settled', 'default', 'default']), output: 'Extract O(log n)' },
    ],
    insight: 'Extract removes root, replaces with last element, then "bubbles down" by swapping with the larger child. O(log n).'
  },
]

const getStatusColor = (status: NodeStatus): string => {
  switch (status) {
    case 'current': return 'var(--color-action-access)'
    case 'comparing': return 'var(--color-action-search)'
    case 'swapping': return 'var(--color-action-delete)'
    case 'settled': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'insert': return 'var(--color-action-insert)'
    case 'compare': return 'var(--color-action-search)'
    case 'swap': return 'var(--color-action-delete)'
    case 'extract': return 'var(--color-action-access)'
    case 'settle': return 'var(--color-action-compare)'
    case 'complete': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

const getTreePositions = (count: number): HeapTreePosition[] => {
  const positions: HeapTreePosition[] = []
  const levelWidths = [400, 200, 100]
  for (let i = 0; i < count; i++) {
    const level = Math.floor(Math.log2(i + 1))
    const posInLevel = i - (Math.pow(2, level) - 1)
    const nodesInLevel = Math.pow(2, level)
    const spacing = (levelWidths[0] ?? 400) / (nodesInLevel + 1)
    positions.push({
      x: spacing * (posInLevel + 1),
      y: 30 + level * 80,
    })
  }
  return positions
}

export function HeapViz() {
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

  const positions = getTreePositions(currentStep.heap.length)

  const getEdges = (): Array<{ from: number; to: number }> => {
    const edges: Array<{ from: number; to: number }> = []
    currentStep.heap.forEach((_, i) => {
      const left = 2 * i + 1
      const right = 2 * i + 2
      if (left < currentStep.heap.length) edges.push({ from: i, to: left })
      if (right < currentStep.heap.length) edges.push({ from: i, to: right })
    })
    return edges
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-2 text-sm font-medium bg-white-5 border border-white-10 rounded-md text-gray-500 cursor-pointer transition-all duration-150 hover:bg-white-10 hover:text-white ${exampleIndex === i ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-light' : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="bg-black-30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Heap (Tree View)</span>
          {currentStep.formula && (
            <span className="font-mono text-sm text-blue-400 bg-sky-500/10 px-2 py-0.5 rounded">{currentStep.formula}</span>
          )}
        </div>

        <div className="relative overflow-x-auto pb-2">
          <svg width="400" height={currentStep.heap.length > 3 ? 270 : 150} viewBox={`0 0 400 ${currentStep.heap.length > 3 ? 270 : 150}`} className="w-full max-w-[400px] mx-auto">
            {getEdges().map(({ from, to }) => {
              const fromPos = positions[from]
              const toPos = positions[to]
              if (!fromPos || !toPos) return null
              return (
                <line
                  key={`${from}-${to}`}
                  x1={fromPos.x}
                  y1={fromPos.y + 20}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0">
            {currentStep.heap.map((node, i) => {
              const pos = positions[i]
              if (!pos) return null
              const color = getStatusColor(node.status)
              const isActive = node.status !== 'default'
              return (
                <motion.div
                  key={`node-${i}`}
                  className="absolute flex items-center justify-center w-10 h-10 rounded-full border-2 font-mono text-base font-bold text-white"
                  style={{
                    left: `calc(${(pos.x / 400) * 100}% - 20px)`,
                    top: `${pos.y}px`,
                    borderColor: color,
                    background: isActive ? `${color}20` : 'rgba(0,0,0,0.5)',
                  }}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    boxShadow: isActive ? `0 0 16px ${color}55` : '0 0 0 transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {node.value}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-black-30 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Array Representation</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {currentStep.heap.map((node, i) => {
            const color = getStatusColor(node.status)
            const isActive = node.status !== 'default'
            return (
              <motion.div
                key={`arr-${i}`}
                className="flex-shrink-0 w-[56px] bg-black-30 border-2 rounded-lg overflow-hidden"
                style={{
                  borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                  background: isActive ? `${color}15` : 'rgba(0,0,0,0.3)',
                }}
                animate={{ scale: isActive ? 1.05 : 1 }}
              >
                <div className="px-1.5 py-2 font-mono text-lg font-bold text-white text-center">
                  {node.value}
                </div>
                <div className="px-1.5 py-1 font-mono text-xs text-brand-primary text-center bg-brand-primary/10">[{i}]</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {currentStep.output && (
        <motion.div
          className="flex items-center gap-3 p-3 px-4 bg-black-30 border-2 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: getActionColor(currentStep.action) }}
        >
          <span className="text-base text-gray-500">Result:</span>
          <span className="font-mono text-xl font-bold" style={{ color: getActionColor(currentStep.action) }}>{currentStep.output}</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black-30 rounded-lg border-l-[3px] border-brand-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{ borderLeftColor: getActionColor(currentStep.action) }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded text-white"
            style={{ background: getActionColor(currentStep.action) }}
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
