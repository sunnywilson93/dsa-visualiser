'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HashTableViz.module.css'

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
      case 'hash': return '#60a5fa'
      case 'insert': return '#10b981'
      case 'lookup': return '#f59e0b'
      case 'collision': return '#ef4444'
      case 'found': return '#10b981'
      case 'not-found': return '#888'
      default: return '#888'
    }
  }

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Hash function visualization */}
      <div className={styles.hashSection}>
        <div className={styles.hashFunction}>
          <div className={styles.hashLabel}>Hash Function</div>
          <div className={styles.hashFormula}>
            <span className={styles.hashKey}>"{currentStep.key}"</span>
            <span className={styles.hashArrow}>→</span>
            <span className={styles.hashCalc}>
              {currentStep.hashValue !== undefined && (
                <>
                  <span className={styles.hashSum}>{currentStep.hashValue}</span>
                  <span className={styles.hashMod}> % {BUCKET_COUNT}</span>
                  <span className={styles.hashEquals}> = </span>
                  <motion.span
                    key={currentStep.id}
                    className={styles.hashResult}
                    initial={{ scale: 1.5, color: '#f59e0b' }}
                    animate={{ scale: 1, color: '#10b981' }}
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
      <div className={styles.bucketsContainer}>
        <div className={styles.bucketsLabel}>Buckets (Array)</div>
        <div className={styles.buckets}>
          {buckets.map((bucket, i) => (
            <motion.div
              key={i}
              className={`${styles.bucket} ${currentStep.bucketIndex === i ? styles.activeBucket : ''}`}
              animate={{
                borderColor: currentStep.bucketIndex === i
                  ? getActionColor(currentStep.action)
                  : 'rgba(255,255,255,0.1)',
                background: currentStep.bucketIndex === i
                  ? `${getActionColor(currentStep.action)}15`
                  : 'rgba(0,0,0,0.3)'
              }}
            >
              <div className={styles.bucketIndex}>{i}</div>
              <div className={styles.bucketItems}>
                <AnimatePresence mode="popLayout">
                  {bucket.items.length === 0 ? (
                    <span className={styles.empty}>—</span>
                  ) : (
                    bucket.items.map((item, j) => (
                      <motion.div
                        key={`${item.key}-${j}`}
                        className={styles.bucketItem}
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <span className={styles.itemKey}>{item.key}</span>
                        {item.value && (
                          <>
                            <span className={styles.itemArrow}>:</span>
                            <span className={styles.itemValue}>{item.value}</span>
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
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{ borderLeftColor: getActionColor(currentStep.action) }}
        >
          <span
            className={styles.actionBadge}
            style={{ background: getActionColor(currentStep.action) }}
          >
            {currentStep.action}
          </span>
          <span className={styles.stepText}>{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <span className={styles.stepCounter}>
          {stepIndex + 1} / {currentExample.steps.length}
        </span>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          ↻
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
