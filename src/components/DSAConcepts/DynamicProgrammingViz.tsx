'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface MemoEntry {
  key: number
  value: number | null
  status: 'empty' | 'computing' | 'cached' | 'hit'
}

interface TreeNode {
  id: string
  label: string
  x: number
  y: number
  status: 'default' | 'active' | 'computed' | 'cache-hit' | 'pruned'
  result?: number
}

interface TreeEdge {
  from: string
  to: string
}

interface FibStep {
  id: number
  description: string
  memo: MemoEntry[]
  nodes: TreeNode[]
  edges: TreeEdge[]
  activeNodeId?: string
  callStack: string[]
}

interface DPCell {
  index: number
  value: number | null
  status: 'empty' | 'filling' | 'filled' | 'current' | 'dependency'
  coinUsed?: number
}

interface CoinStep {
  id: number
  description: string
  cells: DPCell[]
  currentIndex?: number
  currentCoin?: number
  coins: number[]
}

interface Example {
  id: string
  title: string
  type: 'memoization' | 'tabulation'
}

const FIB_N = 5

const fibNodes: TreeNode[] = [
  { id: 'f5', label: 'fib(5)', x: 50, y: 5, status: 'default' },
  { id: 'f4', label: 'fib(4)', x: 28, y: 22, status: 'default' },
  { id: 'f3a', label: 'fib(3)', x: 72, y: 22, status: 'default' },
  { id: 'f3b', label: 'fib(3)', x: 14, y: 39, status: 'default' },
  { id: 'f2a', label: 'fib(2)', x: 42, y: 39, status: 'default' },
  { id: 'f2b', label: 'fib(2)', x: 60, y: 39, status: 'default' },
  { id: 'f1a', label: 'fib(1)', x: 84, y: 39, status: 'default' },
  { id: 'f2c', label: 'fib(2)', x: 7, y: 56, status: 'default' },
  { id: 'f1b', label: 'fib(1)', x: 21, y: 56, status: 'default' },
  { id: 'f1c', label: 'fib(1)', x: 35, y: 56, status: 'default' },
  { id: 'f0a', label: 'fib(0)', x: 49, y: 56, status: 'default' },
  { id: 'f1d', label: 'fib(1)', x: 7, y: 73, status: 'default' },
  { id: 'f0b', label: 'fib(0)', x: 21, y: 73, status: 'default' },
]

const fibEdges: TreeEdge[] = [
  { from: 'f5', to: 'f4' }, { from: 'f5', to: 'f3a' },
  { from: 'f4', to: 'f3b' }, { from: 'f4', to: 'f2a' },
  { from: 'f3a', to: 'f2b' }, { from: 'f3a', to: 'f1a' },
  { from: 'f3b', to: 'f2c' }, { from: 'f3b', to: 'f1b' },
  { from: 'f2a', to: 'f1c' }, { from: 'f2a', to: 'f0a' },
  { from: 'f2c', to: 'f1d' }, { from: 'f2c', to: 'f0b' },
]

function createInitialMemo(): MemoEntry[] {
  return Array.from({ length: FIB_N + 1 }, (_, i) => ({
    key: i,
    value: null,
    status: 'empty' as const,
  }))
}

function setMemo(memo: MemoEntry[], key: number, value: number, status: MemoEntry['status']): MemoEntry[] {
  return memo.map(e => e.key === key ? { ...e, value, status } : e)
}

function setMemoStatus(memo: MemoEntry[], key: number, status: MemoEntry['status']): MemoEntry[] {
  return memo.map(e => e.key === key ? { ...e, status } : e)
}

function setNodeStatus(nodes: TreeNode[], id: string, status: TreeNode['status'], result?: number): TreeNode[] {
  return nodes.map(n => n.id === id ? { ...n, status, result: result ?? n.result } : n)
}

function setMultiNodeStatus(nodes: TreeNode[], ids: string[], status: TreeNode['status']): TreeNode[] {
  const idSet = new Set(ids)
  return nodes.map(n => idSet.has(n.id) ? { ...n, status } : n)
}

const fibSteps: FibStep[] = (() => {
  const steps: FibStep[] = []
  let memo = createInitialMemo()
  let nodes = [...fibNodes]

  steps.push({
    id: 0,
    description: 'Start: Compute fib(5) using memoization. Cache is empty.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)'],
  })

  nodes = setNodeStatus(nodes, 'f5', 'active')
  steps.push({
    id: 1,
    description: 'Call fib(5). Not in cache, so recurse into fib(4) and fib(3).',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f5',
    callStack: ['fib(5)'],
  })

  nodes = setNodeStatus(nodes, 'f5', 'default')
  nodes = setNodeStatus(nodes, 'f4', 'active')
  steps.push({
    id: 2,
    description: 'Call fib(4). Not in cache, recurse into fib(3) and fib(2).',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f4',
    callStack: ['fib(5)', 'fib(4)'],
  })

  nodes = setNodeStatus(nodes, 'f4', 'default')
  nodes = setNodeStatus(nodes, 'f3b', 'active')
  steps.push({
    id: 3,
    description: 'Call fib(3). Not in cache, recurse into fib(2) and fib(1).',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f3b',
    callStack: ['fib(5)', 'fib(4)', 'fib(3)'],
  })

  nodes = setNodeStatus(nodes, 'f3b', 'default')
  nodes = setNodeStatus(nodes, 'f2c', 'active')
  steps.push({
    id: 4,
    description: 'Call fib(2). Not in cache, recurse into fib(1) and fib(0).',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f2c',
    callStack: ['fib(5)', 'fib(4)', 'fib(3)', 'fib(2)'],
  })

  nodes = setNodeStatus(nodes, 'f1d', 'computed', 1)
  nodes = setNodeStatus(nodes, 'f0b', 'computed', 0)
  memo = setMemo(memo, 0, 0, 'cached')
  memo = setMemo(memo, 1, 1, 'cached')
  steps.push({
    id: 5,
    description: 'Base cases: fib(1)=1, fib(0)=0. Cache both.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)', 'fib(4)', 'fib(3)', 'fib(2)'],
  })

  nodes = setNodeStatus(nodes, 'f2c', 'computed', 1)
  memo = setMemo(memo, 2, 1, 'cached')
  steps.push({
    id: 6,
    description: 'fib(2) = fib(1) + fib(0) = 1. Cache fib(2)=1.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)', 'fib(4)', 'fib(3)'],
  })

  nodes = setNodeStatus(nodes, 'f1b', 'computed', 1)
  memo = setMemoStatus(memo, 1, 'hit')
  steps.push({
    id: 7,
    description: 'fib(1) = 1 (cache hit!). No recursion needed.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)', 'fib(4)', 'fib(3)'],
  })

  nodes = setNodeStatus(nodes, 'f3b', 'computed', 2)
  memo = setMemoStatus(memo, 1, 'cached')
  memo = setMemo(memo, 3, 2, 'cached')
  steps.push({
    id: 8,
    description: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2. Cache fib(3)=2.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)', 'fib(4)'],
  })

  nodes = setNodeStatus(nodes, 'f2a', 'cache-hit', 1)
  memo = setMemoStatus(memo, 2, 'hit')
  steps.push({
    id: 9,
    description: 'fib(2) = 1 (cache hit!). Saved an entire subtree of computation.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f2a',
    callStack: ['fib(5)', 'fib(4)'],
  })

  nodes = setNodeStatus(nodes, 'f1c', 'pruned')
  nodes = setNodeStatus(nodes, 'f0a', 'pruned')
  memo = setMemoStatus(memo, 2, 'cached')
  nodes = setNodeStatus(nodes, 'f4', 'computed', 3)
  memo = setMemo(memo, 4, 3, 'cached')
  steps.push({
    id: 10,
    description: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3. Cache fib(4)=3.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: ['fib(5)'],
  })

  nodes = setNodeStatus(nodes, 'f3a', 'cache-hit', 2)
  nodes = setNodeStatus(nodes, 'f2b', 'pruned')
  nodes = setNodeStatus(nodes, 'f1a', 'pruned')
  memo = setMemoStatus(memo, 3, 'hit')
  steps.push({
    id: 11,
    description: 'fib(3) = 2 (cache hit!). Entire right subtree pruned.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    activeNodeId: 'f3a',
    callStack: ['fib(5)'],
  })

  memo = setMemoStatus(memo, 3, 'cached')
  nodes = setNodeStatus(nodes, 'f5', 'computed', 5)
  memo = setMemo(memo, 5, 5, 'cached')
  steps.push({
    id: 12,
    description: 'fib(5) = fib(4) + fib(3) = 3 + 2 = 5. Done! Only 9 calls instead of 15.',
    memo: [...memo],
    nodes: [...nodes],
    edges: fibEdges,
    callStack: [],
  })

  return steps
})()

const COINS = [1, 3, 4]
const AMOUNT = 6

const coinSteps: CoinStep[] = (() => {
  const steps: CoinStep[] = []
  const createCells = (): DPCell[] =>
    Array.from({ length: AMOUNT + 1 }, (_, i) => ({
      index: i,
      value: null,
      status: 'empty' as const,
    }))

  let cells = createCells()

  steps.push({
    id: 0,
    description: `Coin Change: coins = [${COINS.join(', ')}], amount = ${AMOUNT}. dp[i] = min coins for amount i.`,
    cells: [...cells],
    coins: COINS,
  })

  cells = cells.map(c => c.index === 0 ? { ...c, value: 0, status: 'filled' as const } : c)
  steps.push({
    id: 1,
    description: 'Base case: dp[0] = 0. Zero coins needed for amount 0.',
    cells: [...cells],
    coins: COINS,
    currentIndex: 0,
  })

  const dpValues = [0, 1, 2, 1, 1, 2, 2]
  const dpCoins = [0, 1, 1, 3, 4, 4, 3]
  const dpExplanations = [
    '',
    'dp[1]: Try coin 1 → dp[0]+1=1. Best = 1.',
    'dp[2]: Try coin 1 → dp[1]+1=2. Best = 2.',
    'dp[3]: Try coin 1 → dp[2]+1=3; coin 3 → dp[0]+1=1. Best = 1 (use coin 3).',
    'dp[4]: Try coin 1 → dp[3]+1=2; coin 3 → dp[1]+1=2; coin 4 → dp[0]+1=1. Best = 1 (use coin 4).',
    'dp[5]: Try coin 1 → dp[4]+1=2; coin 3 → dp[2]+1=3; coin 4 → dp[1]+1=2. Best = 2.',
    'dp[6]: Try coin 1 → dp[5]+1=3; coin 3 → dp[3]+1=2; coin 4 → dp[2]+1=3. Best = 2 (use coin 3).',
  ]

  for (let i = 1; i <= AMOUNT; i++) {
    const depIndices = COINS.filter(c => c <= i).map(c => i - c)
    cells = cells.map(c => {
      if (c.index === i) return { ...c, status: 'current' as const }
      if (depIndices.includes(c.index)) return { ...c, status: 'dependency' as const }
      if (c.value !== null) return { ...c, status: 'filled' as const }
      return c
    })

    steps.push({
      id: steps.length,
      description: dpExplanations[i],
      cells: [...cells],
      coins: COINS,
      currentIndex: i,
      currentCoin: dpCoins[i],
    })

    cells = cells.map(c => {
      if (c.index === i) return { ...c, value: dpValues[i], status: 'filled' as const, coinUsed: dpCoins[i] }
      if (c.value !== null) return { ...c, status: 'filled' as const }
      return c
    })
  }

  steps.push({
    id: steps.length,
    description: `Answer: dp[${AMOUNT}] = ${dpValues[AMOUNT]}. Minimum ${dpValues[AMOUNT]} coins needed (coins 3+3).`,
    cells: [...cells],
    coins: COINS,
  })

  return steps
})()

const examples: Example[] = [
  { id: 'fib', title: 'Fibonacci (Memoization)', type: 'memoization' },
  { id: 'coin', title: 'Coin Change (Tabulation)', type: 'tabulation' },
]

function getNodeColor(status: TreeNode['status']): string {
  switch (status) {
    case 'active': return 'var(--color-action-access)'
    case 'computed': return 'var(--color-action-success)'
    case 'cache-hit': return 'var(--color-accent-yellow)'
    case 'pruned': return 'var(--color-gray-600)'
    default: return 'var(--color-white-15)'
  }
}

function getCellColor(status: DPCell['status']): string {
  switch (status) {
    case 'current': return 'var(--color-action-access)'
    case 'filling': return 'var(--color-action-compare)'
    case 'filled': return 'var(--color-action-success)'
    case 'dependency': return 'var(--color-accent-yellow)'
    default: return 'var(--color-white-10)'
  }
}

function getMemoColor(status: MemoEntry['status']): string {
  switch (status) {
    case 'computing': return 'var(--color-action-access)'
    case 'cached': return 'var(--color-action-success)'
    case 'hit': return 'var(--color-accent-yellow)'
    default: return 'var(--color-white-10)'
  }
}

export function DynamicProgrammingViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const isFib = currentExample.type === 'memoization'
  const steps = isFib ? fibSteps : coinSteps
  const totalSteps = steps.length

  const handleExampleChange = (index: number): void => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = (): void => {
    if (stepIndex < totalSteps - 1) setStepIndex(s => s + 1)
  }
  const handlePrev = (): void => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }
  const handleReset = (): void => setStepIndex(0)

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

      {isFib ? (
        <FibVisualization step={fibSteps[stepIndex]} />
      ) : (
        <CoinVisualization step={coinSteps[stepIndex]} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black-30 rounded-lg border-l-[3px] border-brand-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="text-base text-gray-300 leading-normal">
            {steps[stepIndex].description}
          </span>
        </motion.div>
      </AnimatePresence>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < totalSteps - 1}
        stepInfo={{ current: stepIndex + 1, total: totalSteps }}
      />

      <div className="p-3 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-brand-light">Key Insight:</strong>{' '}
        {isFib
          ? 'Memoization prunes redundant subtrees by caching results. The recursion tree shrinks from O(2^n) nodes to O(n).'
          : 'Tabulation builds the solution bottom-up, filling each cell exactly once. No recursion overhead or stack overflow risk.'}
      </div>
    </div>
  )
}

function FibVisualization({ step }: { step: FibStep }): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-black-30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recursion Tree</span>
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-success)' }} />
              Computed
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-accent-yellow)' }} />
              Cache Hit
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-gray-600)' }} />
              Pruned
            </span>
          </div>
        </div>
        <svg viewBox="0 0 100 82" className="w-full max-w-[600px] mx-auto" style={{ height: 'auto' }}>
          {step.edges.map((edge) => {
            const fromNode = step.nodes.find(n => n.id === edge.from)
            const toNode = step.nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x}
                y1={fromNode.y + 3}
                x2={toNode.x}
                y2={toNode.y - 3}
                stroke="var(--color-white-15)"
                strokeWidth={0.4}
              />
            )
          })}
          {step.nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={4.5}
                fill="var(--color-black-30)"
                stroke={getNodeColor(node.status)}
                strokeWidth={0.6}
                animate={{
                  stroke: getNodeColor(node.status),
                  opacity: node.status === 'pruned' ? 0.3 : 1,
                }}
              />
              <text
                x={node.x}
                y={node.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.status === 'pruned' ? 'var(--color-gray-600)' : 'var(--color-text-secondary)'}
                fontSize={2.2}
                fontFamily="monospace"
              >
                {node.label.replace('fib(', '').replace(')', '')}
              </text>
              {node.result !== undefined && (
                <text
                  x={node.x}
                  y={node.y + 7}
                  textAnchor="middle"
                  fill={node.status === 'cache-hit' ? 'var(--color-accent-yellow)' : 'var(--color-action-success)'}
                  fontSize={2}
                  fontWeight="bold"
                >
                  ={node.result}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="bg-black-30 rounded-lg p-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Memo Cache</span>
        <div className="flex gap-2 flex-wrap">
          {step.memo.map((entry) => (
            <motion.div
              key={entry.key}
              className="flex flex-col items-center bg-black-30 border-2 rounded-lg overflow-hidden min-w-[52px]"
              animate={{
                borderColor: getMemoColor(entry.status),
                background: entry.status !== 'empty' ? `${getMemoColor(entry.status)}20` : 'rgba(0,0,0,0.3)',
              }}
            >
              <div className="px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-white-5 w-full text-center border-b border-white-5">
                [{entry.key}]
              </div>
              <div className="px-2 py-2 font-mono text-lg font-bold text-white text-center min-h-[36px] flex items-center justify-center">
                {entry.value !== null ? entry.value : '—'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {step.callStack.length > 0 && (
        <div className="bg-black-30 rounded-lg p-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Call Stack</span>
          <div className="flex gap-1.5 flex-wrap">
            {step.callStack.map((call, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs font-mono rounded bg-brand-primary/15 text-brand-light border border-brand-primary/30"
              >
                {call}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CoinVisualization({ step }: { step: CoinStep }): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-black-30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            DP Table — coins = [{step.coins.join(', ')}]
          </span>
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-access)' }} />
              Current
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-accent-yellow)' }} />
              Dependency
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-success)' }} />
              Filled
            </span>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <AnimatePresence mode="popLayout">
            {step.cells.map((cell) => (
              <motion.div
                key={cell.index}
                className="flex-shrink-0 w-[70px] max-sm:w-[56px] bg-black-30 border-2 border-white-10 rounded-lg overflow-hidden"
                animate={{
                  borderColor: getCellColor(cell.status),
                  background: cell.status !== 'empty' ? `${getCellColor(cell.status)}20` : 'rgba(0,0,0,0.3)',
                }}
                layout
              >
                <div className="px-1.5 py-1 font-mono text-[10px] text-gray-500 text-center bg-white-5 border-b border-white-5">
                  dp[{cell.index}]
                </div>
                <div className="px-2 py-3 font-mono text-xl max-sm:text-base font-bold text-white text-center">
                  {cell.value !== null ? cell.value : '∞'}
                </div>
                <div className="px-1.5 py-1 font-mono text-xs text-center bg-white-5 border-t border-white-5">
                  {cell.coinUsed !== undefined ? (
                    <span className="text-brand-primary">+{cell.coinUsed}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-black-30 rounded-lg p-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Available Coins</span>
        <div className="flex gap-2">
          {step.coins.map((coin) => (
            <div
              key={coin}
              className={`px-3 py-1.5 rounded-full text-sm font-mono font-bold border ${
                step.currentCoin === coin
                  ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-light'
                  : 'bg-white-5 border-white-10 text-gray-400'
              }`}
            >
              {coin}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
