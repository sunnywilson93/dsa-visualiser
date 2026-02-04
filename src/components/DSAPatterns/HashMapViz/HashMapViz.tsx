import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import { LevelSelector, type Level, defaultLevelConfig } from '@/components/ui/LevelSelector'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { ExampleTabs } from '@/components/ui/ExampleTabs'

type Variant = 'complement-lookup' | 'frequency-counter' | 'index-storage'
type Phase = 'read-key' | 'calculate-hash' | 'access-bucket' | 'return-value' | 'done'

interface HashMapStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  currentKey?: string | number
  currentValue?: number | string
  hashCalculation?: {
    key: string
    charCodes: number[]
    sum: number
    bucketCount: number
    result: number
  }
  buckets: Bucket[]
  highlightedBucket?: number
  highlightedEntry?: string | number
  decision?: {
    condition: string
    conditionMet: boolean
    action: string
  }
  input?: (number | string)[]
  currentInputIndex?: number
  output?: string[]
}

interface Bucket {
  index: number
  entries: BucketEntry[]
}

interface BucketEntry {
  key: string | number
  value: number | string
  originalIndex?: number
  isNew?: boolean
  isHighlighted?: boolean
}

interface HashMapExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: HashMapStep[]
  insight: string
}

const variantConfig: Record<Variant, { label: string; description: string }> = {
  'complement-lookup': {
    label: 'Complement Lookup',
    description: 'Store complement values to find pairs in single pass'
  },
  'frequency-counter': {
    label: 'Frequency Counter',
    description: 'Count occurrences of each element'
  },
  'index-storage': {
    label: 'Index Storage',
    description: 'Store indices of elements for later reference'
  }
}

const variants: Variant[] = ['complement-lookup', 'frequency-counter', 'index-storage']
const levels: Level[] = ['beginner', 'intermediate', 'advanced']

function createEmptyBuckets(count: number = 8): Bucket[] {
  return Array.from({ length: count }, (_, i) => ({ index: i, entries: [] }))
}

const examples: Record<Variant, Record<Level, HashMapExample[]>> = {
  'complement-lookup': {
    beginner: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        variant: 'complement-lookup',
        code: [
          'function twoSum(nums, target) {',
          '  const map = new Map()',
          '',
          '  for (let i = 0; i < nums.length; i++) {',
          '    const complement = target - nums[i]',
          '',
          '    if (map.has(complement)) {',
          '      return [map.get(complement), i]',
          '    }',
          '',
          '    map.set(nums[i], i)',
          '  }',
          '  return []',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Find two numbers that add up to target 9. We use a hash map to store numbers we\'ve seen.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: [2, 7, 11, 15],
            output: ['Input: [2, 7, 11, 15]', 'Target: 9']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Create an empty hash map to store {number -> index} pairs.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: [2, 7, 11, 15],
            output: ['Map: {} (empty)']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Start iterating. i=0, nums[0]=2.',
            phase: 'read-key',
            currentKey: 2,
            buckets: createEmptyBuckets(),
            input: [2, 7, 11, 15],
            currentInputIndex: 0,
            output: ['Processing: nums[0] = 2']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Calculate complement: target - nums[0] = 9 - 2 = 7.',
            phase: 'calculate-hash',
            currentKey: 7,
            hashCalculation: {
              key: '7',
              charCodes: [55],
              sum: 55,
              bucketCount: 8,
              result: 7
            },
            buckets: createEmptyBuckets(),
            highlightedBucket: 7,
            input: [2, 7, 11, 15],
            currentInputIndex: 0,
            output: ['complement = 9 - 2 = 7']
          },
          {
            id: 4,
            codeLine: 6,
            description: 'Check if complement (7) exists in map. Hash(7) -> bucket 7.',
            phase: 'access-bucket',
            currentKey: 7,
            buckets: createEmptyBuckets(),
            highlightedBucket: 7,
            decision: {
              condition: 'Is 7 in the map?',
              conditionMet: false,
              action: 'No, store current number instead'
            },
            input: [2, 7, 11, 15],
            currentInputIndex: 0,
            output: ['Bucket 7 is empty', '7 not found']
          },
          {
            id: 5,
            codeLine: 10,
            description: 'Store nums[0]=2 with index 0. Hash(2) -> bucket 2.',
            phase: 'calculate-hash',
            currentKey: 2,
            hashCalculation: {
              key: '2',
              charCodes: [50],
              sum: 50,
              bucketCount: 8,
              result: 2
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0, isNew: true }]
              return b
            })(),
            highlightedBucket: 2,
            input: [2, 7, 11, 15],
            currentInputIndex: 0,
            output: ['map.set(2, 0)', 'Map: {2 -> 0}']
          },
          {
            id: 6,
            codeLine: 3,
            description: 'Next iteration. i=1, nums[1]=7.',
            phase: 'read-key',
            currentKey: 7,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0 }]
              return b
            })(),
            input: [2, 7, 11, 15],
            currentInputIndex: 1,
            output: ['Processing: nums[1] = 7']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'Calculate complement: target - nums[1] = 9 - 7 = 2.',
            phase: 'calculate-hash',
            currentKey: 2,
            hashCalculation: {
              key: '2',
              charCodes: [50],
              sum: 50,
              bucketCount: 8,
              result: 2
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0 }]
              return b
            })(),
            highlightedBucket: 2,
            input: [2, 7, 11, 15],
            currentInputIndex: 1,
            output: ['complement = 9 - 7 = 2']
          },
          {
            id: 8,
            codeLine: 6,
            description: 'Check if complement (2) exists in map. Hash(2) -> bucket 2. Found!',
            phase: 'access-bucket',
            currentKey: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 2,
            highlightedEntry: 2,
            decision: {
              condition: 'Is 2 in the map?',
              conditionMet: true,
              action: 'Yes! Return indices'
            },
            input: [2, 7, 11, 15],
            currentInputIndex: 1,
            output: ['Found 2 at bucket 2!', 'map.get(2) = 0']
          },
          {
            id: 9,
            codeLine: 7,
            description: 'Return [map.get(2), i] = [0, 1]. Numbers at indices 0 and 1 sum to 9!',
            phase: 'return-value',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 2,
            input: [2, 7, 11, 15],
            currentInputIndex: 1,
            output: ['return [0, 1]', 'nums[0] + nums[1] = 2 + 7 = 9']
          },
          {
            id: 10,
            codeLine: 7,
            description: 'Done! Found pair in O(n) time using hash map for O(1) lookup.',
            phase: 'done',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[2].entries = [{ key: 2, value: 0 }]
              return b
            })(),
            input: [2, 7, 11, 15],
            output: ['Result: [0, 1]', 'Answer: [2, 7]']
          }
        ],
        insight: 'Store each number with its index. For each new number, check if its complement (target - num) was already stored. One pass = O(n) time.'
      }
    ],
    intermediate: [],
    advanced: []
  },
  'frequency-counter': {
    beginner: [
      {
        id: 'count-elements',
        title: 'Count Elements',
        variant: 'frequency-counter',
        code: [
          'function countFrequency(nums) {',
          '  const freq = new Map()',
          '',
          '  for (const num of nums) {',
          '    if (freq.has(num)) {',
          '      freq.set(num, freq.get(num) + 1)',
          '    } else {',
          '      freq.set(num, 1)',
          '    }',
          '  }',
          '  return freq',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Count how many times each number appears. Hash map stores {number -> count}.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: [1, 2, 2, 3, 3, 3],
            output: ['Input: [1, 2, 2, 3, 3, 3]']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Create empty frequency map.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: [1, 2, 2, 3, 3, 3],
            output: ['freq: {} (empty)']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Process first element: num = 1.',
            phase: 'read-key',
            currentKey: 1,
            buckets: createEmptyBuckets(),
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 0,
            output: ['Processing: 1']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Check if 1 exists in map. Hash(1) -> bucket 1.',
            phase: 'calculate-hash',
            currentKey: 1,
            hashCalculation: {
              key: '1',
              charCodes: [49],
              sum: 49,
              bucketCount: 8,
              result: 1
            },
            buckets: createEmptyBuckets(),
            highlightedBucket: 1,
            decision: {
              condition: 'Is 1 in the map?',
              conditionMet: false,
              action: 'No, set count to 1'
            },
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 0,
            output: ['1 not found in map']
          },
          {
            id: 4,
            codeLine: 7,
            description: 'Set freq[1] = 1. First occurrence of 1.',
            phase: 'access-bucket',
            currentKey: 1,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 1,
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 0,
            output: ['freq.set(1, 1)', 'freq: {1: 1}']
          },
          {
            id: 5,
            codeLine: 3,
            description: 'Process next element: num = 2.',
            phase: 'read-key',
            currentKey: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              return b
            })(),
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 1,
            output: ['Processing: 2']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'Check if 2 exists. Hash(2) -> bucket 2. Not found.',
            phase: 'calculate-hash',
            currentKey: 2,
            hashCalculation: {
              key: '2',
              charCodes: [50],
              sum: 50,
              bucketCount: 8,
              result: 2
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              return b
            })(),
            highlightedBucket: 2,
            decision: {
              condition: 'Is 2 in the map?',
              conditionMet: false,
              action: 'No, set count to 1'
            },
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 1,
            output: ['2 not found in map']
          },
          {
            id: 7,
            codeLine: 7,
            description: 'Set freq[2] = 1. First occurrence of 2.',
            phase: 'access-bucket',
            currentKey: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 2,
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 1,
            output: ['freq.set(2, 1)', 'freq: {1: 1, 2: 1}']
          },
          {
            id: 8,
            codeLine: 3,
            description: 'Process next element: num = 2 (again).',
            phase: 'read-key',
            currentKey: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 1 }]
              return b
            })(),
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 2,
            output: ['Processing: 2']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'Check if 2 exists. Hash(2) -> bucket 2. Found!',
            phase: 'calculate-hash',
            currentKey: 2,
            hashCalculation: {
              key: '2',
              charCodes: [50],
              sum: 50,
              bucketCount: 8,
              result: 2
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 1, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 2,
            highlightedEntry: 2,
            decision: {
              condition: 'Is 2 in the map?',
              conditionMet: true,
              action: 'Yes, increment count'
            },
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 2,
            output: ['2 found! Current count: 1']
          },
          {
            id: 10,
            codeLine: 5,
            description: 'Increment: freq[2] = 1 + 1 = 2.',
            phase: 'access-bucket',
            currentKey: 2,
            currentValue: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 2,
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 2,
            output: ['freq.set(2, 2)', 'freq: {1: 1, 2: 2}']
          },
          {
            id: 11,
            codeLine: 3,
            description: 'Process next element: num = 3.',
            phase: 'read-key',
            currentKey: 3,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2 }]
              return b
            })(),
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 3,
            output: ['Processing: 3']
          },
          {
            id: 12,
            codeLine: 7,
            description: '3 not found. Set freq[3] = 1. Hash(3) -> bucket 3.',
            phase: 'access-bucket',
            currentKey: 3,
            hashCalculation: {
              key: '3',
              charCodes: [51],
              sum: 51,
              bucketCount: 8,
              result: 3
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2 }]
              b[3].entries = [{ key: 3, value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 3,
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 3,
            output: ['freq.set(3, 1)', 'freq: {1: 1, 2: 2, 3: 1}']
          },
          {
            id: 13,
            codeLine: 5,
            description: 'Process num = 3 again. Found, increment to 2.',
            phase: 'access-bucket',
            currentKey: 3,
            currentValue: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2 }]
              b[3].entries = [{ key: 3, value: 2, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 3,
            decision: {
              condition: 'Is 3 in the map?',
              conditionMet: true,
              action: 'Yes, increment count'
            },
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 4,
            output: ['freq.set(3, 2)', 'freq: {1: 1, 2: 2, 3: 2}']
          },
          {
            id: 14,
            codeLine: 5,
            description: 'Process num = 3 again. Found, increment to 3.',
            phase: 'access-bucket',
            currentKey: 3,
            currentValue: 3,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2 }]
              b[3].entries = [{ key: 3, value: 3, isHighlighted: true }]
              return b
            })(),
            highlightedBucket: 3,
            decision: {
              condition: 'Is 3 in the map?',
              conditionMet: true,
              action: 'Yes, increment count'
            },
            input: [1, 2, 2, 3, 3, 3],
            currentInputIndex: 5,
            output: ['freq.set(3, 3)', 'freq: {1: 1, 2: 2, 3: 3}']
          },
          {
            id: 15,
            codeLine: 10,
            description: 'Done! Return frequency map. 1 appears once, 2 appears twice, 3 appears three times.',
            phase: 'done',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 1, value: 1 }]
              b[2].entries = [{ key: 2, value: 2 }]
              b[3].entries = [{ key: 3, value: 3 }]
              return b
            })(),
            input: [1, 2, 2, 3, 3, 3],
            output: ['return freq', 'Result: {1: 1, 2: 2, 3: 3}']
          }
        ],
        insight: 'Check if key exists: Yes -> increment count, No -> set count to 1. O(n) time to count all elements, O(1) lookup for each.'
      }
    ],
    intermediate: [],
    advanced: []
  },
  'index-storage': {
    beginner: [],
    intermediate: [],
    advanced: []
  }
}

export function HashMapViz() {
  const [variant, setVariant] = useState<Variant>('complement-lookup')
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[variant][level]
  const hasExamples = currentExamples.length > 0
  const currentExample = hasExamples ? currentExamples[exampleIndex] : null
  const currentStep = currentExample ? currentExample.steps[stepIndex] : null

  const handleVariantChange = (newVariant: Variant) => {
    setVariant(newVariant)
    setLevel('beginner')
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  // Compute disabled levels (those with no examples for current variant)
  const disabledLevels = useMemo(() =>
    levels.filter(lvl => examples[variant][lvl].length === 0),
    [variant]
  )

  // Convert current examples to ExampleTabs format
  const exampleTabs = useMemo(() =>
    currentExamples.map(ex => ({ id: ex.id, title: ex.title })),
    [currentExamples]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Variant Selector */}
      <VariantSelector
        value={variant}
        onChange={handleVariantChange}
        variants={variants}
        config={variantConfig}
        accentColor="var(--color-emerald-500)"
      />

      {/* Level Selector */}
      <LevelSelector
        value={level}
        onChange={handleLevelChange}
        levels={levels}
        config={defaultLevelConfig}
        disabledLevels={disabledLevels}
      />

      {/* Example Tabs */}
      {hasExamples && currentExamples.length > 1 && (
        <ExampleTabs
          tabs={exampleTabs}
          activeIndex={exampleIndex}
          onChange={handleExampleChange}
          variant="mono"
        />
      )}

      {!hasExamples ? (
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-8 text-center">
          <p className="text-sm text-gray-500">
            Examples coming soon for {variantConfig[variant].label} - {defaultLevelConfig[level].label}.
          </p>
        </div>
      ) : currentExample && currentStep && (
        <>
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CodePanel
              code={currentExample.code}
              highlightedLine={currentStep.codeLine}
              title="Code"
            />

            <div className="flex flex-col gap-4">
              {/* Decision Panel */}
              <AnimatePresence mode="wait">
                {currentStep.decision && (
                  <motion.div
                    key={`decision-${currentStep.id}`}
                    className="flex flex-col gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-mono text-sm text-gray-400">
                      {currentStep.decision.condition}
                    </span>
                    <span
                      className={cn(
                        'rounded-md px-2 py-1 font-mono text-sm',
                        currentStep.decision.conditionMet
                          ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-500'
                          : 'border border-red-500/30 bg-red-500/15 text-red-500'
                      )}
                    >
                      {currentStep.decision.conditionMet ? 'Yes' : 'No'} {'\u2192'} {currentStep.decision.action}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hash Calculation */}
              <AnimatePresence mode="wait">
                {currentStep.hashCalculation && (
                  <motion.div
                    key={`hash-${currentStep.id}`}
                    className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/10 p-4 font-mono text-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-semibold text-amber-500">
                      &quot;{currentStep.hashCalculation.key}&quot;
                    </span>
                    <span className="text-gray-500">{'\u2192'}</span>
                    {currentStep.hashCalculation.key.length <= 4 && (
                      <>
                        <span className="text-xs text-gray-400">
                          [{currentStep.hashCalculation.charCodes.join(', ')}]
                        </span>
                        <span className="text-gray-500">{'\u2192'}</span>
                      </>
                    )}
                    <span className="text-brand-primary">
                      {currentStep.hashCalculation.sum} % {currentStep.hashCalculation.bucketCount}
                    </span>
                    <span className="text-gray-500">=</span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-500">
                      bucket[{currentStep.hashCalculation.result}]
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Array */}
              {currentStep.input && (
                <div className="rounded-lg border border-white/[0.08] bg-black/40 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Input Array
                  </div>
                  <div className="flex flex-nowrap justify-center gap-2 overflow-x-auto">
                    {currentStep.input.map((val, idx) => (
                      <motion.div
                        key={idx}
                        className={cn(
                          'flex h-11 w-11 flex-col items-center justify-center rounded-md border transition-all',
                          currentStep.currentInputIndex === idx
                            ? 'border-emerald-500/60 bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : currentStep.currentInputIndex !== undefined && idx < currentStep.currentInputIndex
                              ? 'border-white/[0.08] bg-white/5 opacity-40'
                              : 'border-white/[0.08] bg-white/5'
                        )}
                        animate={{
                          scale: currentStep.currentInputIndex === idx ? 1.1 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="font-mono text-sm font-semibold text-white">{val}</span>
                        <span className="font-mono text-[10px] text-gray-600">{idx}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bucket Grid */}
              <div className="grid grid-cols-4 gap-2 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:grid-cols-2 md:grid-cols-4">
                {currentStep.buckets.map(bucket => (
                  <motion.div
                    key={bucket.index}
                    className={cn(
                      'flex flex-col overflow-hidden rounded-md border transition-all',
                      currentStep.highlightedBucket === bucket.index
                        ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.2)]'
                        : 'border-white/[0.08] bg-[var(--surface-card)]'
                    )}
                    animate={{
                      scale: currentStep.highlightedBucket === bucket.index ? 1.02 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-b border-white/[0.08] bg-white/5 px-2 py-1 text-center font-mono text-xs font-semibold text-gray-500">
                      {bucket.index}
                    </div>
                    <div className="flex min-h-12 flex-col items-center justify-center gap-1 p-1">
                      {bucket.entries.length === 0 ? (
                        <span className="font-mono text-xs italic text-gray-700">empty</span>
                      ) : (
                        bucket.entries.map((entry, entryIdx) => (
                          <motion.div
                            key={`${entry.key}-${entryIdx}`}
                            className={cn(
                              'flex items-center gap-1 rounded px-2 py-1 font-mono text-xs transition-all',
                              entry.isHighlighted
                                ? 'bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                : 'bg-white/[0.08]'
                            )}
                            initial={entry.isNew ? { opacity: 0, scale: 0.8 } : false}
                            animate={{
                              opacity: 1,
                              scale: entry.isHighlighted ? 1.05 : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="font-semibold text-amber-500">{entry.key}</span>
                            <span className="text-[10px] text-gray-600">{'\u2192'}</span>
                            <motion.span
                              className="font-medium text-emerald-500"
                              key={`${entry.key}-${entry.value}`}
                              initial={entry.isHighlighted ? { scale: 1.2, color: 'var(--color-emerald-500)' } : false}
                              animate={{ scale: 1, color: 'var(--color-emerald-500)' }}
                              transition={{ duration: 0.3 }}
                            >
                              {entry.value}
                            </motion.span>
                            {entry.originalIndex !== undefined && (
                              <span className="ml-0.5 text-[10px] text-gray-600">@{entry.originalIndex}</span>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Output Box */}
              {currentStep.output && currentStep.output.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-black/40">
                  <div className="bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Output
                  </div>
                  <div className="p-2">
                    {currentStep.output.map((line, i) => (
                      <motion.div
                        key={i}
                        className="font-mono text-sm text-emerald-500"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <StepProgress
            current={stepIndex}
            total={currentExample.steps.length}
            description={currentStep.description}
          />

          <StepControls
            onPrev={() => setStepIndex(s => s - 1)}
            onNext={() => setStepIndex(s => s + 1)}
            onReset={() => setStepIndex(0)}
            canPrev={stepIndex > 0}
            canNext={stepIndex < currentExample.steps.length - 1}
            stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
          />

          {/* Insight Box */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-4 py-2 text-center text-sm text-gray-400">
            <span className="mr-2 font-semibold text-emerald-500">Key Insight:</span>
            {currentExample.insight}
          </div>
        </>
      )}
    </div>
  )
}
