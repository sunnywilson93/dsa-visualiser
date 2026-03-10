'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

type BarStatus = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot'

interface BarItem {
  id: number
  value: number
  status: BarStatus
}

interface Step {
  id: number
  action: 'compare' | 'swap' | 'sorted' | 'pivot' | 'merge' | 'complete'
  description: string
  bars: BarItem[]
  comparisons: number
  swaps: number
  output?: string
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const createBars = (values: number[], statuses?: BarStatus[]): BarItem[] =>
  values.map((value, i) => ({
    id: i,
    value,
    status: statuses?.[i] ?? 'default',
  }))

const examples: Example[] = [
  {
    id: 'bubble',
    title: 'Bubble Sort',
    steps: [
      { id: 0, action: 'compare', description: 'Bubble Sort: Repeatedly swap adjacent elements if out of order. Array: [5, 3, 8, 1, 4]', bars: createBars([5, 3, 8, 1, 4]), comparisons: 0, swaps: 0 },
      { id: 1, action: 'compare', description: 'Compare 5 and 3. 5 > 3, so swap them.', bars: createBars([5, 3, 8, 1, 4], ['comparing', 'comparing', 'default', 'default', 'default']), comparisons: 1, swaps: 0 },
      { id: 2, action: 'swap', description: 'Swapped! [3, 5, 8, 1, 4]. Compare 5 and 8.', bars: createBars([3, 5, 8, 1, 4], ['default', 'comparing', 'comparing', 'default', 'default']), comparisons: 2, swaps: 1 },
      { id: 3, action: 'compare', description: '5 < 8, no swap. Compare 8 and 1.', bars: createBars([3, 5, 8, 1, 4], ['default', 'default', 'comparing', 'comparing', 'default']), comparisons: 3, swaps: 1 },
      { id: 4, action: 'swap', description: '8 > 1, swap! [3, 5, 1, 8, 4]. Compare 8 and 4.', bars: createBars([3, 5, 1, 8, 4], ['default', 'default', 'default', 'comparing', 'comparing']), comparisons: 4, swaps: 2 },
      { id: 5, action: 'swap', description: '8 > 4, swap! 8 bubbled to end. [3, 5, 1, 4, 8]', bars: createBars([3, 5, 1, 4, 8], ['default', 'default', 'default', 'default', 'sorted']), comparisons: 4, swaps: 3 },
      { id: 6, action: 'compare', description: 'Pass 2: Compare 3 and 5. No swap. Compare 5 and 1.', bars: createBars([3, 5, 1, 4, 8], ['default', 'comparing', 'comparing', 'default', 'sorted']), comparisons: 6, swaps: 3 },
      { id: 7, action: 'swap', description: '5 > 1, swap! Compare 5 and 4, swap!', bars: createBars([3, 1, 4, 5, 8], ['default', 'default', 'default', 'sorted', 'sorted']), comparisons: 8, swaps: 5 },
      { id: 8, action: 'complete', description: 'Continue passes until sorted. Final: [1, 3, 4, 5, 8]', bars: createBars([1, 3, 4, 5, 8], ['sorted', 'sorted', 'sorted', 'sorted', 'sorted']), comparisons: 10, swaps: 7, output: '1, 3, 4, 5, 8' },
    ],
    insight: 'Bubble Sort is O(n^2) — simple but slow. Each pass "bubbles" the largest unsorted element to its final position.'
  },
  {
    id: 'merge',
    title: 'Merge Sort',
    steps: [
      { id: 0, action: 'compare', description: 'Merge Sort: Divide array in half, sort each half, then merge. [5, 3, 8, 1]', bars: createBars([5, 3, 8, 1]), comparisons: 0, swaps: 0 },
      { id: 1, action: 'compare', description: 'Split: [5, 3] and [8, 1]', bars: createBars([5, 3, 8, 1], ['comparing', 'comparing', 'pivot', 'pivot']), comparisons: 0, swaps: 0 },
      { id: 2, action: 'compare', description: 'Split [5, 3] into [5] and [3]. Compare: 3 < 5.', bars: createBars([5, 3, 8, 1], ['comparing', 'comparing', 'default', 'default']), comparisons: 1, swaps: 0 },
      { id: 3, action: 'merge', description: 'Merge [5] and [3] into [3, 5].', bars: createBars([3, 5, 8, 1], ['sorted', 'sorted', 'default', 'default']), comparisons: 1, swaps: 0 },
      { id: 4, action: 'compare', description: 'Split [8, 1] into [8] and [1]. Compare: 1 < 8.', bars: createBars([3, 5, 8, 1], ['sorted', 'sorted', 'comparing', 'comparing']), comparisons: 2, swaps: 0 },
      { id: 5, action: 'merge', description: 'Merge [8] and [1] into [1, 8].', bars: createBars([3, 5, 1, 8], ['sorted', 'sorted', 'sorted', 'sorted']), comparisons: 2, swaps: 0 },
      { id: 6, action: 'merge', description: 'Merge [3, 5] and [1, 8]: Compare 3 and 1. Take 1.', bars: createBars([1, 3, 5, 8], ['comparing', 'comparing', 'default', 'comparing']), comparisons: 4, swaps: 0 },
      { id: 7, action: 'complete', description: 'Final merged result: [1, 3, 5, 8]. Done!', bars: createBars([1, 3, 5, 8], ['sorted', 'sorted', 'sorted', 'sorted']), comparisons: 5, swaps: 0, output: '1, 3, 5, 8' },
    ],
    insight: 'Merge Sort is O(n log n) — divide and conquer. It always has guaranteed O(n log n) time but uses O(n) extra space.'
  },
  {
    id: 'quick',
    title: 'Quick Sort',
    steps: [
      { id: 0, action: 'pivot', description: 'Quick Sort: Pick pivot, partition around it. Array: [5, 3, 8, 1, 4]. Pivot = 4 (last).', bars: createBars([5, 3, 8, 1, 4], ['default', 'default', 'default', 'default', 'pivot']), comparisons: 0, swaps: 0 },
      { id: 1, action: 'compare', description: 'Scan: 5 > 4? Yes (skip). 3 < 4? Yes (swap position).', bars: createBars([5, 3, 8, 1, 4], ['comparing', 'comparing', 'default', 'default', 'pivot']), comparisons: 2, swaps: 0 },
      { id: 2, action: 'compare', description: '8 > 4? Yes (skip). 1 < 4? Yes.', bars: createBars([3, 5, 8, 1, 4], ['sorted', 'comparing', 'comparing', 'comparing', 'pivot']), comparisons: 4, swaps: 1 },
      { id: 3, action: 'swap', description: 'Partition done. Place pivot: [3, 1, 4, 5, 8]. 4 is in final position!', bars: createBars([3, 1, 4, 5, 8], ['default', 'default', 'sorted', 'default', 'default']), comparisons: 4, swaps: 2 },
      { id: 4, action: 'pivot', description: 'Recurse left [3, 1]. Pivot = 1.', bars: createBars([3, 1, 4, 5, 8], ['comparing', 'pivot', 'sorted', 'default', 'default']), comparisons: 5, swaps: 2 },
      { id: 5, action: 'swap', description: '3 > 1. Swap to get [1, 3]. Both in final position.', bars: createBars([1, 3, 4, 5, 8], ['sorted', 'sorted', 'sorted', 'default', 'default']), comparisons: 5, swaps: 3 },
      { id: 6, action: 'pivot', description: 'Recurse right [5, 8]. Pivot = 8. 5 < 8, already sorted.', bars: createBars([1, 3, 4, 5, 8], ['sorted', 'sorted', 'sorted', 'comparing', 'pivot']), comparisons: 6, swaps: 3 },
      { id: 7, action: 'complete', description: 'All elements in place! Final: [1, 3, 4, 5, 8]', bars: createBars([1, 3, 4, 5, 8], ['sorted', 'sorted', 'sorted', 'sorted', 'sorted']), comparisons: 6, swaps: 3, output: '1, 3, 4, 5, 8' },
    ],
    insight: 'Quick Sort is O(n log n) average — fast in practice. Partition around a pivot, then recurse on each side. Worst case O(n^2) with bad pivot choices.'
  },
]

const getStatusColor = (status: BarStatus): string => {
  switch (status) {
    case 'comparing': return 'var(--color-action-search)'
    case 'swapping': return 'var(--color-action-delete)'
    case 'sorted': return 'var(--color-action-success)'
    case 'pivot': return 'var(--color-action-compare)'
    default: return 'var(--color-action-access)'
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'compare': return 'var(--color-action-search)'
    case 'swap': return 'var(--color-action-delete)'
    case 'sorted': return 'var(--color-action-success)'
    case 'pivot': return 'var(--color-action-compare)'
    case 'merge': return 'var(--color-action-insert)'
    case 'complete': return 'var(--color-action-success)'
    default: return 'var(--color-gray-600)'
  }
}

export function SortingViz() {
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

  const maxValue = Math.max(...currentStep.bars.map(b => b.value))

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
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Array</span>
          <div className="flex gap-4">
            <span className="text-xs text-gray-400">
              Comparisons: <strong className="text-white">{currentStep.comparisons}</strong>
            </span>
            <span className="text-xs text-gray-400">
              Swaps: <strong className="text-white">{currentStep.swaps}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-end gap-3 justify-center min-h-[180px] px-2">
          <AnimatePresence mode="popLayout">
            {currentStep.bars.map((bar) => {
              const heightPercent = (bar.value / maxValue) * 100
              const color = getStatusColor(bar.status)
              return (
                <motion.div
                  key={bar.id}
                  className="flex flex-col items-center gap-2 flex-1 max-w-[80px]"
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <span className="font-mono text-sm font-bold text-white">{bar.value}</span>
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${Math.max(heightPercent * 1.4, 20)}px`,
                      background: color,
                      boxShadow: bar.status !== 'default' ? `0 0 12px ${color}55` : 'none',
                    }}
                    animate={{
                      height: `${Math.max(heightPercent * 1.4, 20)}px`,
                      background: color,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 justify-center mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-search)' }} />
            Comparing
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-compare)' }} />
            Pivot
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-action-success)' }} />
            Sorted
          </span>
        </div>
      </div>

      {currentStep.output && (
        <motion.div
          className="flex items-center gap-3 p-3 px-4 bg-black-30 border-2 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: 'var(--color-action-success)' }}
        >
          <span className="text-base text-gray-500">Sorted:</span>
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
