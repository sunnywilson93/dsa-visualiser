'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface Bucket {
  index: number
  items: { key: string; value: string }[]
}

interface Step {
  id: number
  action: 'hash' | 'insert' | 'lookup' | 'collision' | 'found' | 'not-found'
  description: string
  key: string
  value?: string
  hashValue?: number
  bucketIndex?: number
  highlight?: number
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const BUCKET_COUNT = 7

// Simple hash function for visualization
function simpleHash(key: string, size: number): number {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i)
  }
  return hash % size
}

const examples: Example[] = [
  {
    id: 'basic-insert',
    title: 'Insert & Lookup',
    steps: [
      { id: 0, action: 'hash', description: 'Hash "cat" → sum ASCII values (99+97+116=312) → 312 % 7 = 4', key: 'cat', value: 'meow', hashValue: 312 },
      { id: 1, action: 'insert', description: 'Insert ("cat", "meow") into bucket 4', key: 'cat', value: 'meow', bucketIndex: 4 },
      { id: 2, action: 'hash', description: 'Hash "dog" → (100+111+103=314) → 314 % 7 = 6', key: 'dog', value: 'woof', hashValue: 314 },
      { id: 3, action: 'insert', description: 'Insert ("dog", "woof") into bucket 6', key: 'dog', value: 'woof', bucketIndex: 6 },
      { id: 4, action: 'hash', description: 'Lookup "cat" → hash gives bucket 4', key: 'cat', hashValue: 312 },
      { id: 5, action: 'found', description: 'Found "cat" in bucket 4! Return "meow"', key: 'cat', bucketIndex: 4 },
    ],
    insight: 'Hash tables achieve O(1) average lookup by using a hash function to directly compute where to store/find values.'
  },
  {
    id: 'collision',
    title: 'Collision Handling',
    steps: [
      { id: 0, action: 'hash', description: 'Hash "cat" → 312 % 7 = 4', key: 'cat', value: 'meow', hashValue: 312 },
      { id: 1, action: 'insert', description: 'Insert ("cat", "meow") into bucket 4', key: 'cat', value: 'meow', bucketIndex: 4 },
      { id: 2, action: 'hash', description: 'Hash "act" → (97+99+116=312) → 312 % 7 = 4 — same as "cat"!', key: 'act', value: 'play', hashValue: 312 },
      { id: 3, action: 'collision', description: 'Collision! Bucket 4 already has "cat". Use chaining...', key: 'act', value: 'play', bucketIndex: 4 },
      { id: 4, action: 'insert', description: 'Add ("act", "play") to the chain in bucket 4', key: 'act', value: 'play', bucketIndex: 4 },
      { id: 5, action: 'hash', description: 'Lookup "act" → hash gives bucket 4', key: 'act', hashValue: 312 },
      { id: 6, action: 'found', description: 'Search chain in bucket 4... found "act"! Return "play"', key: 'act', bucketIndex: 4 },
    ],
    insight: 'Collisions occur when different keys hash to the same bucket. Chaining stores multiple items in a list at each bucket.'
  },
  {
    id: 'two-sum',
    title: 'Two Sum Pattern',
    steps: [
      { id: 0, action: 'hash', description: 'Two Sum: nums=[2,7,11,15], target=9. Check if (9-2=7) exists...', key: '7', hashValue: 0 },
      { id: 1, action: 'not-found', description: '7 not in map. Store nums[0]: map[2] = 0', key: '2', value: '0', bucketIndex: 2 },
      { id: 2, action: 'insert', description: 'Inserted (2 → index 0)', key: '2', value: '0', bucketIndex: 2 },
      { id: 3, action: 'hash', description: 'Check if (9-7=2) exists in map...', key: '2', hashValue: 0 },
      { id: 4, action: 'found', description: 'Found 2 in map! Return [map[2], 1] = [0, 1]', key: '2', bucketIndex: 2 },
    ],
    insight: 'Hash maps turn O(n²) brute force into O(n) by storing "what we\'ve seen" and checking complements in O(1).'
  },
]

export function HashTableViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [buckets, setBuckets] = useState<Bucket[]>(
    Array(BUCKET_COUNT).fill(null).map((_, i) => ({ index: i, items: [] }))
  )

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
    setBuckets(Array(BUCKET_COUNT).fill(null).map((_, i) => ({ index: i, items: [] })))
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) {
      const nextStep = currentExample.steps[stepIndex + 1]
      if (nextStep.action === 'insert' && nextStep.bucketIndex !== undefined) {
        setBuckets(prev => {
          const newBuckets = [...prev]
          const bucket = { ...newBuckets[nextStep.bucketIndex!] }
          bucket.items = [...bucket.items, { key: nextStep.key, value: nextStep.value || '' }]
          newBuckets[nextStep.bucketIndex!] = bucket
          return newBuckets
        })
      }
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      const prevStepIndex = stepIndex - 1
      // Rebuild buckets up to this step
      const newBuckets: Bucket[] = Array(BUCKET_COUNT).fill(null).map((_, i) => ({ index: i, items: [] }))
      for (let i = 0; i <= prevStepIndex; i++) {
        const step = currentExample.steps[i]
        if (step.action === 'insert' && step.bucketIndex !== undefined) {
          newBuckets[step.bucketIndex].items.push({ key: step.key, value: step.value || '' })
        }
      }
      setBuckets(newBuckets)
      setStepIndex(prevStepIndex)
    }
  }

  const handleReset = () => {
    setStepIndex(0)
    setBuckets(Array(BUCKET_COUNT).fill(null).map((_, i) => ({ index: i, items: [] })))
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'hash': return 'var(--color-action-access)'
      case 'insert': return 'var(--color-action-insert)'
      case 'lookup': return 'var(--color-action-search)'
      case 'collision': return 'var(--color-action-error)'
      case 'found': return 'var(--color-action-success)'
      case 'not-found': return 'var(--color-gray-600)'
      default: return 'var(--color-gray-600)'
    }
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

      {/* Hash function visualization */}
      <div className="bg-black/30 rounded-lg p-4">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hash Function</div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-lg text-amber-400 bg-amber-500/10 px-2 py-1 rounded">&quot;{currentStep.key}&quot;</span>
            <span className="text-gray-600 text-xl">→</span>
            <span className="font-mono text-[0.95rem] text-gray-300">
              {currentStep.hashValue !== undefined && (
                <>
                  <span className="text-blue-400">{currentStep.hashValue}</span>
                  <span className="text-gray-500"> % {BUCKET_COUNT}</span>
                  <span className="text-gray-600"> = </span>
                  <motion.span
                    key={currentStep.id}
                    className="text-xl font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded"
                    initial={{ scale: 1.5, color: 'var(--color-action-search)' }}
                    animate={{ scale: 1, color: 'var(--color-action-success)' }}
                  >
                    {currentStep.hashValue % BUCKET_COUNT}
                  </motion.span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Buckets visualization */}
      <div className="bg-black/20 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Buckets (Array)</div>
        <div className="grid grid-cols-7 max-sm:grid-cols-4 max-[400px]:grid-cols-3 gap-2">
          {buckets.map((bucket, i) => (
            <motion.div
              key={i}
              className={`bg-black/30 border-2 border-white/10 rounded-lg min-h-[80px] max-sm:min-h-[70px] flex flex-col transition-all duration-200 ${currentStep.bucketIndex === i ? 'shadow-[0_0_20px_rgba(var(--color-brand-primary-rgb),0.3)]' : ''}`}
              animate={{
                borderColor: currentStep.bucketIndex === i
                  ? getActionColor(currentStep.action)
                  : 'rgba(255,255,255,0.1)',
                background: currentStep.bucketIndex === i
                  ? `${getActionColor(currentStep.action)}15`
                  : 'rgba(0,0,0,0.3)'
              }}
            >
              <div className="px-1.5 py-1 text-xs font-semibold text-brand-primary text-center bg-brand-primary/10 border-b border-white/5">{i}</div>
              <div className="flex-1 p-1 flex flex-col items-center gap-1">
                <AnimatePresence mode="popLayout">
                  {bucket.items.length === 0 ? (
                    <span className="text-gray-600 text-base">—</span>
                  ) : (
                    bucket.items.map((item, j) => (
                      <motion.div
                        key={`${item.key}-${j}`}
                        className="flex items-center gap-0.5 px-1 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded font-mono text-[10px]"
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <span className="text-amber-400 font-semibold">{item.key}</span>
                        {item.value && (
                          <>
                            <span className="text-gray-600">:</span>
                            <span className="text-emerald-400">{item.value}</span>
                          </>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
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

      {/* Key insight */}
      <div className="p-3 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-brand-light">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
