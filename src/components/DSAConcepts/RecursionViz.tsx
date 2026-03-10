'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface StackFrame {
  id: number
  label: string
  args: string
  returnValue?: string
  status: 'active' | 'waiting' | 'returned'
}

interface TreeCall {
  id: number
  label: string
  x: number
  y: number
  result?: string
  status: 'default' | 'active' | 'computing' | 'returned'
  parentId?: number
}

interface Step {
  id: number
  action: 'call' | 'base' | 'return' | 'compute' | 'complete'
  description: string
  stack: StackFrame[]
  tree: TreeCall[]
  output?: string
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const examples: Example[] = [
  {
    id: 'factorial',
    title: 'Factorial',
    steps: [
      {
        id: 0, action: 'call', description: 'Call factorial(4). Push frame onto call stack.',
        stack: [{ id: 1, label: 'fact(4)', args: 'n=4', status: 'active' }],
        tree: [{ id: 1, label: 'fact(4)', x: 200, y: 20, status: 'active' }],
      },
      {
        id: 1, action: 'call', description: 'n != 0, so call factorial(3). Push new frame.',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', status: 'active' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, status: 'active', parentId: 1 },
        ],
      },
      {
        id: 2, action: 'call', description: 'n != 0, call factorial(2).',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', status: 'waiting' },
          { id: 3, label: 'fact(2)', args: 'n=2', status: 'active' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, status: 'active', parentId: 2 },
        ],
      },
      {
        id: 3, action: 'call', description: 'n != 0, call factorial(1).',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', status: 'waiting' },
          { id: 3, label: 'fact(2)', args: 'n=2', status: 'waiting' },
          { id: 4, label: 'fact(1)', args: 'n=1', status: 'active' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, status: 'computing', parentId: 2 },
          { id: 4, label: 'fact(1)', x: 200, y: 230, status: 'active', parentId: 3 },
        ],
      },
      {
        id: 4, action: 'base', description: 'n=1, base case! Return 1.',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', status: 'waiting' },
          { id: 3, label: 'fact(2)', args: 'n=2', status: 'waiting' },
          { id: 4, label: 'fact(1)', args: 'n=1', returnValue: '1', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, status: 'computing', parentId: 2 },
          { id: 4, label: 'fact(1)', x: 200, y: 230, result: '1', status: 'returned', parentId: 3 },
        ],
      },
      {
        id: 5, action: 'return', description: 'fact(1) returned 1. Pop stack. fact(2) computes 2 * 1 = 2.',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', status: 'waiting' },
          { id: 3, label: 'fact(2)', args: 'n=2', returnValue: '2', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, result: '2', status: 'returned', parentId: 2 },
          { id: 4, label: 'fact(1)', x: 200, y: 230, result: '1', status: 'returned', parentId: 3 },
        ],
      },
      {
        id: 6, action: 'return', description: 'fact(2) returned 2. fact(3) computes 3 * 2 = 6.',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fact(3)', args: 'n=3', returnValue: '6', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, result: '6', status: 'returned', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, result: '2', status: 'returned', parentId: 2 },
          { id: 4, label: 'fact(1)', x: 200, y: 230, result: '1', status: 'returned', parentId: 3 },
        ],
      },
      {
        id: 7, action: 'complete', description: 'fact(3) returned 6. fact(4) computes 4 * 6 = 24. Done!',
        stack: [
          { id: 1, label: 'fact(4)', args: 'n=4', returnValue: '24', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fact(4)', x: 200, y: 20, result: '24', status: 'returned' },
          { id: 2, label: 'fact(3)', x: 200, y: 90, result: '6', status: 'returned', parentId: 1 },
          { id: 3, label: 'fact(2)', x: 200, y: 160, result: '2', status: 'returned', parentId: 2 },
          { id: 4, label: 'fact(1)', x: 200, y: 230, result: '1', status: 'returned', parentId: 3 },
        ],
        output: '24',
      },
    ],
    insight: 'Factorial is linear recursion — one call per level. Stack depth = n, so O(n) space. Each call waits for the next to return before computing.'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci',
    steps: [
      {
        id: 0, action: 'call', description: 'Call fib(4). This branches into fib(3) + fib(2).',
        stack: [{ id: 1, label: 'fib(4)', args: 'n=4', status: 'active' }],
        tree: [{ id: 1, label: 'fib(4)', x: 200, y: 20, status: 'active' }],
      },
      {
        id: 1, action: 'call', description: 'fib(4) calls fib(3) first (left branch).',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fib(3)', args: 'n=3', status: 'active' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, status: 'active', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, status: 'default', parentId: 1 },
        ],
      },
      {
        id: 2, action: 'call', description: 'fib(3) calls fib(2) first.',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fib(3)', args: 'n=3', status: 'waiting' },
          { id: 4, label: 'fib(2)', args: 'n=2', status: 'active' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, status: 'default', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, status: 'active', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, status: 'default', parentId: 2 },
        ],
      },
      {
        id: 3, action: 'base', description: 'fib(2) = fib(1) + fib(0) = 1 + 0 = 1. Base cases!',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fib(3)', args: 'n=3', status: 'waiting' },
          { id: 4, label: 'fib(2)', args: 'n=2', returnValue: '1', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, status: 'default', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, result: '1', status: 'returned', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, status: 'default', parentId: 2 },
        ],
      },
      {
        id: 4, action: 'base', description: 'Now fib(3) calls fib(1). Base case: returns 1.',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fib(3)', args: 'n=3', status: 'waiting' },
          { id: 5, label: 'fib(1)', args: 'n=1', returnValue: '1', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, status: 'computing', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, status: 'default', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, result: '1', status: 'returned', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, result: '1', status: 'returned', parentId: 2 },
        ],
      },
      {
        id: 5, action: 'return', description: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2. Return to fib(4).',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 2, label: 'fib(3)', args: 'n=3', returnValue: '2', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, result: '2', status: 'returned', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, status: 'active', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, result: '1', status: 'returned', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, result: '1', status: 'returned', parentId: 2 },
        ],
      },
      {
        id: 6, action: 'base', description: 'Now fib(4) calls fib(2). fib(2) = 1 (same calculation repeated!).',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', status: 'waiting' },
          { id: 3, label: 'fib(2)', args: 'n=2', returnValue: '1', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, status: 'computing' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, result: '2', status: 'returned', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, result: '1', status: 'returned', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, result: '1', status: 'returned', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, result: '1', status: 'returned', parentId: 2 },
        ],
      },
      {
        id: 7, action: 'complete', description: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3. Notice: fib(2) was computed twice!',
        stack: [
          { id: 1, label: 'fib(4)', args: 'n=4', returnValue: '3', status: 'returned' },
        ],
        tree: [
          { id: 1, label: 'fib(4)', x: 200, y: 20, result: '3', status: 'returned' },
          { id: 2, label: 'fib(3)', x: 120, y: 90, result: '2', status: 'returned', parentId: 1 },
          { id: 3, label: 'fib(2)', x: 280, y: 90, result: '1', status: 'returned', parentId: 1 },
          { id: 4, label: 'fib(2)', x: 70, y: 160, result: '1', status: 'returned', parentId: 2 },
          { id: 5, label: 'fib(1)', x: 170, y: 160, result: '1', status: 'returned', parentId: 2 },
        ],
        output: '3',
      },
    ],
    insight: 'Fibonacci is tree recursion — each call branches into two. Without memoization it is O(2^n) because subproblems are recomputed. This is why Dynamic Programming exists!'
  },
]

const getFrameColor = (status: StackFrame['status']): string => {
  switch (status) {
    case 'active': return 'var(--color-action-access)'
    case 'waiting': return 'var(--color-action-compare)'
    case 'returned': return 'var(--color-action-success)'
  }
}

const getCallColor = (status: TreeCall['status']): string => {
  switch (status) {
    case 'active': return 'var(--color-action-access)'
    case 'computing': return 'var(--color-action-compare)'
    case 'returned': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'call': return 'var(--color-action-access)'
    case 'base': return 'var(--color-action-search)'
    case 'return': return 'var(--color-action-insert)'
    case 'compute': return 'var(--color-action-compare)'
    case 'complete': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

export function RecursionViz() {
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

  const treeById = new Map(currentStep.tree.map(c => [c.id, c]))

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

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        <div className="bg-black-20 rounded-lg p-4 min-w-[180px]">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Call Stack</div>
          <div className="flex flex-col-reverse gap-1.5 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {currentStep.stack.length === 0 ? (
                <motion.div
                  key="empty"
                  className="text-gray-600 text-sm text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Empty
                </motion.div>
              ) : (
                currentStep.stack.map((frame) => {
                  const color = getFrameColor(frame.status)
                  return (
                    <motion.div
                      key={frame.id}
                      className="px-3 py-2 border-2 rounded-md bg-black-30"
                      style={{
                        borderColor: color,
                        background: `${color}15`,
                      }}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      layout
                    >
                      <div className="font-mono text-sm font-bold text-white">{frame.label}</div>
                      <div className="flex justify-between items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{frame.args}</span>
                        {frame.returnValue && (
                          <span
                            className="text-xs font-semibold px-1.5 py-0.5 rounded"
                            style={{ color, background: `${color}25` }}
                          >
                            = {frame.returnValue}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-black-20 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recursion Tree</div>
          <div className="relative min-h-[280px] overflow-x-auto">
            <svg width="400" height="280" viewBox="0 0 400 280" className="absolute inset-0 w-full max-w-[400px]">
              {currentStep.tree.map(call => {
                if (call.parentId === undefined) return null
                const parent = treeById.get(call.parentId)
                if (!parent) return null
                return (
                  <line
                    key={`edge-${call.parentId}-${call.id}`}
                    x1={parent.x}
                    y1={parent.y + 30}
                    x2={call.x}
                    y2={call.y}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />
                )
              })}
            </svg>
            {currentStep.tree.map(call => {
              const color = getCallColor(call.status)
              const isActive = call.status === 'active'
              return (
                <motion.div
                  key={call.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `calc(${(call.x / 400) * 100}% - 32px)`,
                    top: `${call.y}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div
                    className="px-2 py-1 rounded-md border-2 font-mono text-xs font-semibold text-white whitespace-nowrap"
                    style={{
                      borderColor: color,
                      background: call.status !== 'default' ? `${color}20` : 'rgba(0,0,0,0.5)',
                      boxShadow: isActive ? `0 0 12px ${color}44` : 'none',
                    }}
                  >
                    {call.label}
                  </div>
                  {call.result && (
                    <motion.span
                      className="mt-0.5 text-xs font-bold"
                      style={{ color }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      = {call.result}
                    </motion.span>
                  )}
                </motion.div>
              )
            })}
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
