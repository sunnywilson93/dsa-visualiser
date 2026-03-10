'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface GraphNode {
  id: string
  x: number
  y: number
}

interface GraphEdge {
  from: string
  to: string
}

type NodeStatus = 'default' | 'current' | 'queued' | 'visited'

interface Step {
  id: number
  action: 'init' | 'visit' | 'enqueue' | 'push' | 'complete'
  description: string
  nodeStates: Record<string, NodeStatus>
  currentNodeId?: string
  visitedOrder: string[]
  frontier: string[]
  output?: string
}

interface Example {
  id: string
  title: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  steps: Step[]
  insight: string
}

const graphNodes: GraphNode[] = [
  { id: 'A', x: 200, y: 30 },
  { id: 'B', x: 80, y: 110 },
  { id: 'C', x: 320, y: 110 },
  { id: 'D', x: 40, y: 200 },
  { id: 'E', x: 160, y: 200 },
  { id: 'F', x: 280, y: 200 },
]

const graphEdges: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'E' },
  { from: 'C', to: 'F' },
]

const defaultNodeStates = (): Record<string, NodeStatus> =>
  Object.fromEntries(graphNodes.map(n => [n.id, 'default' as NodeStatus]))

const examples: Example[] = [
  {
    id: 'bfs',
    title: 'BFS from A',
    nodes: graphNodes,
    edges: graphEdges,
    steps: [
      { id: 0, action: 'init', description: 'BFS: Start at node A. Enqueue A into the queue.', nodeStates: { ...defaultNodeStates(), A: 'current' }, currentNodeId: 'A', visitedOrder: [], frontier: ['A'] },
      { id: 1, action: 'visit', description: 'Dequeue A, mark visited. Enqueue neighbors B and C.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'queued', C: 'queued' }, currentNodeId: 'A', visitedOrder: ['A'], frontier: ['B', 'C'] },
      { id: 2, action: 'visit', description: 'Dequeue B, mark visited. Enqueue unvisited neighbors D and E.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'queued', D: 'queued', E: 'queued' }, currentNodeId: 'B', visitedOrder: ['A', 'B'], frontier: ['C', 'D', 'E'] },
      { id: 3, action: 'visit', description: 'Dequeue C, mark visited. E already queued, enqueue F.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'visited', D: 'queued', E: 'queued', F: 'queued' }, currentNodeId: 'C', visitedOrder: ['A', 'B', 'C'], frontier: ['D', 'E', 'F'] },
      { id: 4, action: 'visit', description: 'Dequeue D, mark visited. No unvisited neighbors.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'visited', D: 'visited', E: 'queued', F: 'queued' }, currentNodeId: 'D', visitedOrder: ['A', 'B', 'C', 'D'], frontier: ['E', 'F'] },
      { id: 5, action: 'visit', description: 'Dequeue E, mark visited. No unvisited neighbors.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'visited', D: 'visited', E: 'visited', F: 'queued' }, currentNodeId: 'E', visitedOrder: ['A', 'B', 'C', 'D', 'E'], frontier: ['F'] },
      { id: 6, action: 'complete', description: 'Dequeue F, mark visited. Queue empty. BFS complete!', nodeStates: Object.fromEntries(graphNodes.map(n => [n.id, 'visited' as NodeStatus])), currentNodeId: 'F', visitedOrder: ['A', 'B', 'C', 'D', 'E', 'F'], frontier: [], output: 'A, B, C, D, E, F' },
    ],
    insight: 'BFS explores neighbors first (breadth), using a queue. It finds the shortest path in unweighted graphs.'
  },
  {
    id: 'dfs',
    title: 'DFS from A',
    nodes: graphNodes,
    edges: graphEdges,
    steps: [
      { id: 0, action: 'init', description: 'DFS: Start at node A. Push A onto the stack.', nodeStates: { ...defaultNodeStates(), A: 'current' }, currentNodeId: 'A', visitedOrder: [], frontier: ['A'] },
      { id: 1, action: 'visit', description: 'Pop A, mark visited. Push neighbors C and B (B on top).', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'queued', C: 'queued' }, currentNodeId: 'A', visitedOrder: ['A'], frontier: ['C', 'B'] },
      { id: 2, action: 'visit', description: 'Pop B, mark visited. Push neighbors E and D.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'queued', D: 'queued', E: 'queued' }, currentNodeId: 'B', visitedOrder: ['A', 'B'], frontier: ['C', 'E', 'D'] },
      { id: 3, action: 'visit', description: 'Pop D, mark visited. No unvisited neighbors.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'queued', D: 'visited', E: 'queued' }, currentNodeId: 'D', visitedOrder: ['A', 'B', 'D'], frontier: ['C', 'E'] },
      { id: 4, action: 'visit', description: 'Pop E, mark visited. No unvisited neighbors.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'queued', D: 'visited', E: 'visited' }, currentNodeId: 'E', visitedOrder: ['A', 'B', 'D', 'E'], frontier: ['C'] },
      { id: 5, action: 'visit', description: 'Pop C, mark visited. Push unvisited neighbor F.', nodeStates: { ...defaultNodeStates(), A: 'visited', B: 'visited', C: 'visited', D: 'visited', E: 'visited', F: 'queued' }, currentNodeId: 'C', visitedOrder: ['A', 'B', 'D', 'E', 'C'], frontier: ['F'] },
      { id: 6, action: 'complete', description: 'Pop F, mark visited. Stack empty. DFS complete!', nodeStates: Object.fromEntries(graphNodes.map(n => [n.id, 'visited' as NodeStatus])), currentNodeId: 'F', visitedOrder: ['A', 'B', 'D', 'E', 'C', 'F'], frontier: [], output: 'A, B, D, E, C, F' },
    ],
    insight: 'DFS explores as deep as possible first (depth), using a stack. It is useful for detecting cycles and topological sorting.'
  },
]

const getStatusColor = (status: NodeStatus): string => {
  switch (status) {
    case 'current': return 'var(--color-action-access)'
    case 'queued': return 'var(--color-action-compare)'
    case 'visited': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'init': return 'var(--color-action-access)'
    case 'visit': return 'var(--color-action-success)'
    case 'enqueue': return 'var(--color-action-insert)'
    case 'push': return 'var(--color-action-insert)'
    case 'complete': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

export function GraphViz() {
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

  const nodePositions = new Map(currentExample.nodes.map(n => [n.id, n]))

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
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Graph</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-access)' }} />
              Current
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-compare)' }} />
              In Queue/Stack
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-success)' }} />
              Visited
            </span>
          </div>
        </div>

        <div className="relative overflow-x-auto pb-2">
          <svg width="400" height="240" viewBox="0 0 400 240" className="w-full max-w-[400px] mx-auto">
            {currentExample.edges.map(edge => {
              const from = nodePositions.get(edge.from)
              const to = nodePositions.get(edge.to)
              if (!from || !to) return null
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y + 20}
                  x2={to.x}
                  y2={to.y + 20}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                />
              )
            })}
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
                    top: `calc(${(node.y / 240) * 100}%)`,
                    borderColor: color,
                    background: status !== 'default' ? `${color}20` : 'rgba(0,0,0,0.5)',
                  }}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    boxShadow: isCurrent ? `0 0 20px ${color}55` : '0 0 0 transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {node.id}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black-30 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {currentExample.id === 'bfs' ? 'Queue (FIFO)' : 'Stack (LIFO)'}
          </div>
          <div className="flex gap-1.5 flex-wrap min-h-[36px] items-center">
            <AnimatePresence mode="popLayout">
              {currentStep.frontier.length > 0 ? (
                currentStep.frontier.map((val, i) => (
                  <motion.span
                    key={`${val}-${i}`}
                    className="px-3 py-1.5 bg-black-30 border rounded-md font-mono text-sm"
                    style={{
                      borderColor: 'var(--color-action-compare)',
                      color: 'var(--color-action-compare)',
                    }}
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
