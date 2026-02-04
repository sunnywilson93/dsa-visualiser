'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface ArrayItem {
  id: number
  value: number
  address: string
}

interface Step {
  id: number
  action: 'access' | 'search' | 'insert' | 'delete' | 'shift' | 'found' | 'not-found'
  description: string
  array: ArrayItem[]
  highlightIndex?: number
  highlightIndices?: number[]
  pointer?: number
  output?: string
  formula?: string
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const createArray = (values: number[], startAddr: number = 1000): ArrayItem[] =>
  values.map((value, i) => ({
    id: i,
    value,
    address: `0x${(startAddr + i * 4).toString(16)}`
  }))

const examples: Example[] = [
  {
    id: 'access',
    title: 'Index Access O(1)',
    steps: [
      {
        id: 0,
        action: 'access',
        description: 'Array stored in contiguous memory. Each element is 4 bytes apart.',
        array: createArray([10, 20, 30, 40, 50]),
        formula: 'address = base + (index × size)'
      },
      {
        id: 1,
        action: 'access',
        description: 'Access arr[2]: Calculate address = 0x3e8 + (2 × 4) = 0x3f0',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 2,
        formula: '0x3e8 + (2 × 4) = 0x3f0'
      },
      {
        id: 2,
        action: 'found',
        description: 'Direct jump to memory address! No iteration needed. O(1)',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 2,
        output: '30'
      },
      {
        id: 3,
        action: 'access',
        description: 'Access arr[4]: Calculate address = 0x3e8 + (4 × 4) = 0x3f8',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 4,
        formula: '0x3e8 + (4 × 4) = 0x3f8'
      },
      {
        id: 4,
        action: 'found',
        description: 'Instant access regardless of array size! This is why arrays are fast for random access.',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 4,
        output: '50'
      },
    ],
    insight: 'Arrays provide O(1) access because memory address can be calculated directly from the index. No need to traverse!'
  },
  {
    id: 'search',
    title: 'Linear Search O(n)',
    steps: [
      {
        id: 0,
        action: 'search',
        description: 'Search for value 40 in unsorted array. Must check each element...',
        array: createArray([10, 50, 30, 40, 20]),
        pointer: 0
      },
      {
        id: 1,
        action: 'search',
        description: 'Check index 0: arr[0] = 10. Not 40, move to next.',
        array: createArray([10, 50, 30, 40, 20]),
        pointer: 0,
        highlightIndex: 0
      },
      {
        id: 2,
        action: 'search',
        description: 'Check index 1: arr[1] = 50. Not 40, move to next.',
        array: createArray([10, 50, 30, 40, 20]),
        pointer: 1,
        highlightIndex: 1
      },
      {
        id: 3,
        action: 'search',
        description: 'Check index 2: arr[2] = 30. Not 40, move to next.',
        array: createArray([10, 50, 30, 40, 20]),
        pointer: 2,
        highlightIndex: 2
      },
      {
        id: 4,
        action: 'found',
        description: 'Check index 3: arr[3] = 40. Found it! Took 4 comparisons.',
        array: createArray([10, 50, 30, 40, 20]),
        pointer: 3,
        highlightIndex: 3,
        output: 'index: 3'
      },
    ],
    insight: 'Without knowing where an element is, we must scan. Worst case checks all n elements → O(n).'
  },
  {
    id: 'insert-middle',
    title: 'Insert in Middle O(n)',
    steps: [
      {
        id: 0,
        action: 'insert',
        description: 'Insert 25 at index 2. Current array: [10, 20, 30, 40, 50]',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 2
      },
      {
        id: 1,
        action: 'shift',
        description: 'Must shift elements to make room. Move 50 → index 5',
        array: createArray([10, 20, 30, 40, 50, 0]),
        highlightIndices: [4, 5]
      },
      {
        id: 2,
        action: 'shift',
        description: 'Move 40 → index 4',
        array: createArray([10, 20, 30, 40, 40, 50]),
        highlightIndices: [3, 4]
      },
      {
        id: 3,
        action: 'shift',
        description: 'Move 30 → index 3',
        array: createArray([10, 20, 30, 30, 40, 50]),
        highlightIndices: [2, 3]
      },
      {
        id: 4,
        action: 'insert',
        description: 'Now index 2 is free. Insert 25!',
        array: createArray([10, 20, 25, 30, 40, 50]),
        highlightIndex: 2,
        output: 'Done!'
      },
    ],
    insight: 'Inserting in middle requires shifting all elements after. Insert at index 0 shifts ALL elements → O(n) worst case.'
  },
  {
    id: 'delete-middle',
    title: 'Delete from Middle O(n)',
    steps: [
      {
        id: 0,
        action: 'delete',
        description: 'Delete element at index 1 (value 20). Array: [10, 20, 30, 40, 50]',
        array: createArray([10, 20, 30, 40, 50]),
        highlightIndex: 1
      },
      {
        id: 1,
        action: 'delete',
        description: 'Remove 20. Now there\'s a gap at index 1.',
        array: [
          { id: 0, value: 10, address: '0x3e8' },
          { id: 1, value: -1, address: '0x3ec' }, // gap shown as -1
          { id: 2, value: 30, address: '0x3f0' },
          { id: 3, value: 40, address: '0x3f4' },
          { id: 4, value: 50, address: '0x3f8' },
        ],
        highlightIndex: 1
      },
      {
        id: 2,
        action: 'shift',
        description: 'Shift 30 ← to index 1 to fill the gap',
        array: createArray([10, 30, 30, 40, 50]),
        highlightIndices: [1, 2]
      },
      {
        id: 3,
        action: 'shift',
        description: 'Shift 40 ← to index 2',
        array: createArray([10, 30, 40, 40, 50]),
        highlightIndices: [2, 3]
      },
      {
        id: 4,
        action: 'shift',
        description: 'Shift 50 ← to index 3. Array compacted!',
        array: createArray([10, 30, 40, 50]),
        highlightIndex: 3,
        output: 'Done!'
      },
    ],
    insight: 'Deletion requires shifting elements left to fill the gap. Delete at index 0 → shift entire array → O(n).'
  },
]

export function ArrayViz() {
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'access': return 'var(--color-action-access)'
      case 'search': return 'var(--color-action-search)'
      case 'insert': return 'var(--color-action-insert)'
      case 'delete': return 'var(--color-action-delete)'
      case 'shift': return 'var(--color-action-compare)'
      case 'found': return 'var(--color-action-success)'
      case 'not-found': return 'var(--color-gray-600)'
      default: return 'var(--color-gray-600)'
    }
  }

  const isHighlighted = (index: number) => {
    if (currentStep.highlightIndex === index) return true
    if (currentStep.highlightIndices?.includes(index)) return true
    return false
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Example selector */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white ${exampleIndex === i ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-light' : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Memory visualization */}
      <div className="bg-black/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Memory Layout (Contiguous)</span>
          {currentStep.formula && (
            <span className="font-mono text-sm text-blue-400 bg-sky-500/10 px-2 py-0.5 rounded">{currentStep.formula}</span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <AnimatePresence mode="popLayout">
            {currentStep.array.map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                className={`flex-shrink-0 w-[70px] max-sm:w-[60px] bg-black/30 border-2 border-white/10 rounded-lg overflow-hidden transition-all duration-200 ${isHighlighted(i) ? 'shadow-[0_0_20px_rgba(var(--color-brand-primary-rgb),0.4)]' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderColor: isHighlighted(i)
                    ? getActionColor(currentStep.action)
                    : 'rgba(255,255,255,0.1)',
                  background: isHighlighted(i)
                    ? `${getActionColor(currentStep.action)}20`
                    : 'rgba(0,0,0,0.3)'
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <div className="px-1.5 py-1 font-mono text-[10px] text-gray-500 text-center bg-white/5 border-b border-white/5">{item.address}</div>
                <div className="px-2 py-3 font-mono text-xl max-sm:text-base max-sm:p-2 font-bold text-white text-center">
                  {item.value === -1 ? (
                    <span className="text-xs text-red-400 font-semibold">GAP</span>
                  ) : (
                    item.value
                  )}
                </div>
                <div className="px-1.5 py-1 font-mono text-xs text-brand-primary text-center bg-brand-primary/10">[{i}]</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {currentStep.pointer !== undefined && (
          <div className="relative h-8 mt-2">
            <motion.div
              className="absolute text-xs text-emerald-400 font-semibold text-center -translate-x-1/2"
              animate={{ left: `${currentStep.pointer * 80 + 30}px` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              ↑ checking
            </motion.div>
          </div>
        )}
      </div>

      {/* Output */}
      {currentStep.output && (
        <motion.div
          className="flex items-center gap-3 p-3 px-4 bg-black/30 border-2 border-emerald-500 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: getActionColor(currentStep.action) }}
        >
          <span className="text-base text-gray-500">Result:</span>
          <span className="font-mono text-xl font-bold text-emerald-400">{currentStep.output}</span>
        </motion.div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black/30 rounded-lg border-l-[3px] border-brand-primary"
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
