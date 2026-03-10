'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface TreeNode {
  id: number
  value: string
  left?: number
  right?: number
  x: number
  y: number
}

type NodeStatus = 'default' | 'current' | 'visited'

interface Step {
  id: number
  action: 'visit' | 'traverse' | 'enqueue' | 'dequeue' | 'complete'
  description: string
  nodeStates: Record<number, NodeStatus>
  currentNodeId?: number
  visitedOrder: string[]
  queueOrStack?: string[]
  output?: string
}

interface Example {
  id: string
  title: string
  nodes: TreeNode[]
  steps: Step[]
  insight: string
}

const treeNodes: TreeNode[] = [
  { id: 1, value: '1', left: 2, right: 3, x: 200, y: 30 },
  { id: 2, value: '2', left: 4, right: 5, x: 100, y: 110 },
  { id: 3, value: '3', left: 6, right: 7, x: 300, y: 110 },
  { id: 4, value: '4', x: 50, y: 190 },
  { id: 5, value: '5', x: 150, y: 190 },
  { id: 6, value: '6', x: 250, y: 190 },
  { id: 7, value: '7', x: 350, y: 190 },
]

const defaultStates = (): Record<number, NodeStatus> =>
  Object.fromEntries(treeNodes.map(n => [n.id, 'default' as NodeStatus]))

const examples: Example[] = [
  {
    id: 'dfs-inorder',
    title: 'DFS (In-order)',
    nodes: treeNodes,
    steps: [
      { id: 0, action: 'traverse', description: 'In-order DFS: visit left subtree, then node, then right subtree. Start at root (1).', nodeStates: { ...defaultStates(), 1: 'current' }, currentNodeId: 1, visitedOrder: [], queueOrStack: ['1'] },
      { id: 1, action: 'traverse', description: 'Go left from 1 to 2. Push onto call stack.', nodeStates: { ...defaultStates(), 1: 'current', 2: 'current' }, currentNodeId: 2, visitedOrder: [], queueOrStack: ['1', '2'] },
      { id: 2, action: 'traverse', description: 'Go left from 2 to 4. Push onto call stack.', nodeStates: { ...defaultStates(), 1: 'current', 2: 'current', 4: 'current' }, currentNodeId: 4, visitedOrder: [], queueOrStack: ['1', '2', '4'] },
      { id: 3, action: 'visit', description: 'Node 4 has no left child. Visit 4.', nodeStates: { ...defaultStates(), 1: 'current', 2: 'current', 4: 'visited' }, currentNodeId: 4, visitedOrder: ['4'], queueOrStack: ['1', '2'] },
      { id: 4, action: 'visit', description: 'Back to 2. Left done, visit 2.', nodeStates: { ...defaultStates(), 1: 'current', 2: 'visited', 4: 'visited' }, currentNodeId: 2, visitedOrder: ['4', '2'], queueOrStack: ['1'] },
      { id: 5, action: 'visit', description: 'Go right from 2 to 5. Visit 5 (no children).', nodeStates: { ...defaultStates(), 1: 'current', 2: 'visited', 4: 'visited', 5: 'visited' }, currentNodeId: 5, visitedOrder: ['4', '2', '5'], queueOrStack: ['1'] },
      { id: 6, action: 'visit', description: 'Back to 1. Left subtree done, visit 1.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 4: 'visited', 5: 'visited' }, currentNodeId: 1, visitedOrder: ['4', '2', '5', '1'], queueOrStack: [] },
      { id: 7, action: 'traverse', description: 'Go right from 1 to 3. Process right subtree.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'current', 4: 'visited', 5: 'visited' }, currentNodeId: 3, visitedOrder: ['4', '2', '5', '1'], queueOrStack: ['3'] },
      { id: 8, action: 'visit', description: 'Go left from 3 to 6. Visit 6 (no children).', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'current', 4: 'visited', 5: 'visited', 6: 'visited' }, currentNodeId: 6, visitedOrder: ['4', '2', '5', '1', '6'], queueOrStack: ['3'] },
      { id: 9, action: 'visit', description: 'Back to 3. Visit 3.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'visited', 4: 'visited', 5: 'visited', 6: 'visited' }, currentNodeId: 3, visitedOrder: ['4', '2', '5', '1', '6', '3'], queueOrStack: [] },
      { id: 10, action: 'complete', description: 'Go right from 3 to 7. Visit 7. In-order complete!', nodeStates: Object.fromEntries(treeNodes.map(n => [n.id, 'visited' as NodeStatus])), currentNodeId: 7, visitedOrder: ['4', '2', '5', '1', '6', '3', '7'], output: '4, 2, 5, 1, 6, 3, 7' },
    ],
    insight: 'In-order DFS visits left subtree, then node, then right subtree. For a BST this produces sorted order!'
  },
  {
    id: 'bfs-level',
    title: 'BFS (Level-order)',
    nodes: treeNodes,
    steps: [
      { id: 0, action: 'enqueue', description: 'BFS uses a queue. Enqueue root (1).', nodeStates: { ...defaultStates(), 1: 'current' }, currentNodeId: 1, visitedOrder: [], queueOrStack: ['1'] },
      { id: 1, action: 'dequeue', description: 'Dequeue 1, visit it. Enqueue children 2 and 3.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'current', 3: 'current' }, currentNodeId: 1, visitedOrder: ['1'], queueOrStack: ['2', '3'] },
      { id: 2, action: 'dequeue', description: 'Dequeue 2, visit it. Enqueue children 4 and 5.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'current', 4: 'current', 5: 'current' }, currentNodeId: 2, visitedOrder: ['1', '2'], queueOrStack: ['3', '4', '5'] },
      { id: 3, action: 'dequeue', description: 'Dequeue 3, visit it. Enqueue children 6 and 7.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'visited', 4: 'current', 5: 'current', 6: 'current', 7: 'current' }, currentNodeId: 3, visitedOrder: ['1', '2', '3'], queueOrStack: ['4', '5', '6', '7'] },
      { id: 4, action: 'dequeue', description: 'Dequeue 4, visit it. No children.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'visited', 4: 'visited', 5: 'current', 6: 'current', 7: 'current' }, currentNodeId: 4, visitedOrder: ['1', '2', '3', '4'], queueOrStack: ['5', '6', '7'] },
      { id: 5, action: 'dequeue', description: 'Dequeue 5, visit it. No children.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'visited', 4: 'visited', 5: 'visited', 6: 'current', 7: 'current' }, currentNodeId: 5, visitedOrder: ['1', '2', '3', '4', '5'], queueOrStack: ['6', '7'] },
      { id: 6, action: 'dequeue', description: 'Dequeue 6, visit it. No children.', nodeStates: { ...defaultStates(), 1: 'visited', 2: 'visited', 3: 'visited', 4: 'visited', 5: 'visited', 6: 'visited', 7: 'current' }, currentNodeId: 6, visitedOrder: ['1', '2', '3', '4', '5', '6'], queueOrStack: ['7'] },
      { id: 7, action: 'complete', description: 'Dequeue 7, visit it. Queue empty. BFS complete!', nodeStates: Object.fromEntries(treeNodes.map(n => [n.id, 'visited' as NodeStatus])), currentNodeId: 7, visitedOrder: ['1', '2', '3', '4', '5', '6', '7'], queueOrStack: [], output: '1, 2, 3, 4, 5, 6, 7' },
    ],
    insight: 'BFS visits level by level using a queue. It always finds the shortest path in an unweighted graph/tree.'
  },
]

const getStatusColor = (status: NodeStatus): string => {
  switch (status) {
    case 'current': return 'var(--color-action-access)'
    case 'visited': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'visit': return 'var(--color-action-success)'
    case 'traverse': return 'var(--color-action-access)'
    case 'enqueue': return 'var(--color-action-insert)'
    case 'dequeue': return 'var(--color-action-search)'
    case 'complete': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

export function TreeViz() {
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

  const nodesById = new Map(currentExample.nodes.map(n => [n.id, n]))

  const getEdges = (): Array<{ from: TreeNode; to: TreeNode }> => {
    const edges: Array<{ from: TreeNode; to: TreeNode }> = []
    currentExample.nodes.forEach(node => {
      if (node.left) {
        const child = nodesById.get(node.left)
        if (child) edges.push({ from: node, to: child })
      }
      if (node.right) {
        const child = nodesById.get(node.right)
        if (child) edges.push({ from: node, to: child })
      }
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
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Binary Tree</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-access)' }} />
              Current
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-success)' }} />
              Visited
            </span>
          </div>
        </div>

        <div className="relative overflow-x-auto pb-2">
          <svg width="400" height="240" viewBox="0 0 400 240" className="w-full max-w-[400px] mx-auto">
            {getEdges().map(({ from, to }) => (
              <line
                key={`${from.id}-${to.id}`}
                x1={from.x}
                y1={from.y + 20}
                x2={to.x}
                y2={to.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="absolute inset-0">
            {currentExample.nodes.map(node => {
              const status = currentStep.nodeStates[node.id] ?? 'default'
              const isCurrent = currentStep.currentNodeId === node.id
              const color = getStatusColor(status)
              return (
                <motion.div
                  key={node.id}
                  className="absolute flex items-center justify-center w-10 h-10 rounded-full border-2 font-mono text-base font-bold text-white"
                  style={{
                    left: `calc(${(node.x / 400) * 100}% - 20px)`,
                    top: `calc(${(node.y / 240) * 100}% - 0px)`,
                    borderColor: color,
                    background: status !== 'default' ? `${color}20` : 'rgba(0,0,0,0.5)',
                  }}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    boxShadow: isCurrent ? `0 0 20px ${color}55` : '0 0 0 transparent',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black-30 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {currentExample.id === 'bfs-level' ? 'Queue' : 'Call Stack'}
          </div>
          <div className="flex gap-1.5 flex-wrap min-h-[36px] items-center">
            <AnimatePresence mode="popLayout">
              {currentStep.queueOrStack && currentStep.queueOrStack.length > 0 ? (
                currentStep.queueOrStack.map((val, i) => (
                  <motion.span
                    key={`${val}-${i}`}
                    className="px-3 py-1.5 bg-black-30 border border-white-10 rounded-md font-mono text-sm text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {val}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-600 text-sm">Empty</span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-black-30 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Visited Order</div>
          <div className="flex gap-1.5 flex-wrap min-h-[36px] items-center">
            <AnimatePresence mode="popLayout">
              {currentStep.visitedOrder.length > 0 ? (
                currentStep.visitedOrder.map((val, i) => (
                  <motion.span
                    key={`visited-${val}-${i}`}
                    className="px-3 py-1.5 border rounded-md font-mono text-sm"
                    style={{
                      borderColor: 'var(--color-action-success)',
                      color: 'var(--color-action-success)',
                      background: 'var(--color-emerald-10)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {val}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-600 text-sm">None yet</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {currentStep.output && (
        <motion.div
          className="flex items-center gap-3 p-3 px-4 bg-black-30 border-2 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: 'var(--color-action-success)' }}
        >
          <span className="text-base text-gray-500">Result:</span>
          <span className="font-mono text-xl font-bold" style={{ color: 'var(--color-action-success)' }}>{currentStep.output}</span>
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
