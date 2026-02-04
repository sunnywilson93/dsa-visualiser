'use client'

import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

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
      case 'enqueue': return 'var(--color-action-insert)'
      case 'dequeue': return 'var(--color-action-search)'
      case 'peek': return 'var(--color-action-access)'
      case 'process': return 'var(--color-action-compare)'
      case 'error': return 'var(--color-action-error)'
      default: return 'var(--color-gray-600)'
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
    <div className="flex flex-col gap-5">
      {/* Example selector */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex: Example, i: number) => (
          <button
            key={ex.id}
            className={`px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white ${exampleIndex === i ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-light' : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Queue visualization */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Queue</div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-3 py-1 max-md:grid-cols-1 max-md:gap-2">
              <div
                className={`flex flex-col gap-0.5 px-2.5 py-1 border border-white/5 rounded-md text-gray-500 text-center min-w-[120px] max-md:min-w-0 transition-all ${isFrontAction ? 'shadow-[0_0_12px_currentColor]' : ''}`}
                style={frontIndicatorStyle}
              >
                <span className="text-xs font-bold uppercase tracking-wide">Front</span>
                <span className={`text-[10px] uppercase tracking-wide ${isFrontAction ? 'opacity-85' : 'text-gray-600'}`}>dequeue / peek</span>
              </div>
              <div className="text-center text-[10px] text-gray-600 uppercase tracking-wide">Oldest -&gt; Newest</div>
              <div
                className={`flex flex-col gap-0.5 px-2.5 py-1 border border-white/5 rounded-md text-gray-500 text-center min-w-[120px] max-md:min-w-0 transition-all ${isBackAction ? 'shadow-[0_0_12px_currentColor]' : ''}`}
                style={backIndicatorStyle}
              >
                <span className="text-xs font-bold uppercase tracking-wide">Back</span>
                <span className={`text-[10px] uppercase tracking-wide ${isBackAction ? 'opacity-85' : 'text-gray-600'}`}>enqueue</span>
              </div>
            </div>
            <div className="flex gap-2 items-center min-h-[120px] p-3 bg-black/30 border-2 border-white/10 rounded-lg overflow-x-auto">
              <AnimatePresence mode="popLayout">
                {currentStep.queueState.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="text-gray-600 text-base text-center p-8 w-full"
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
                        className={`flex flex-col items-center justify-center gap-1 min-w-[70px] px-4 py-3 bg-black/30 border-2 border-white/10 rounded-md transition-all duration-200 ${isActive ? 'shadow-[0_0_15px_rgba(var(--color-brand-primary-rgb),0.2)]' : ''}`}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        layout
                        style={{
                          borderColor: isActive ? actionColor : 'rgba(255,255,255,0.1)',
                          background: isActive ? `${actionColor}15` : 'rgba(0,0,0,0.3)'
                        }}
                      >
                        <span className="text-[10px] text-slate-400 tracking-wide">#{i + 1}</span>
                        <span className="font-mono text-xl font-semibold text-white">{item.value}</span>
                        {label && <span className="text-[10px] text-brand-light uppercase tracking-wide">{label}</span>}
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-black/30 rounded-lg p-4 min-w-[120px]">
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

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black/30 rounded-lg border-l-[3px] border-brand-primary"
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

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Insight */}
      <div className="p-3 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-brand-light">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
