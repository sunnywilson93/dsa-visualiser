import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './HashMapViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
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

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const variantInfo: Record<Variant, { label: string; description: string }> = {
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
    intermediate: [
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        variant: 'frequency-counter',
        code: [
          'function isAnagram(s, t) {',
          '  if (s.length !== t.length) return false',
          '',
          '  const charCount = {}',
          '',
          '  for (const char of s) {',
          '    charCount[char] = (charCount[char] || 0) + 1',
          '  }',
          '',
          '  for (const char of t) {',
          '    if (!charCount[char]) return false',
          '    charCount[char]--',
          '  }',
          '',
          '  return true',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Check if two strings are anagrams. Count chars in first string, then verify second string has same counts.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            output: ['s = "anagram"', 't = "nagaram"']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Check if lengths match. 7 === 7, continue.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            decision: {
              condition: 's.length === t.length?',
              conditionMet: true,
              action: 'Yes (7 === 7), continue'
            },
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            output: ['Length check: 7 === 7', 'Strings could be anagrams']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Create empty character count map.',
            phase: 'read-key',
            buckets: createEmptyBuckets(),
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            output: ['charCount = {}']
          },
          {
            id: 3,
            codeLine: 5,
            description: 'First loop: count characters in s. Process char = "a".',
            phase: 'read-key',
            currentKey: 'a',
            buckets: createEmptyBuckets(),
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 0,
            output: ['Processing s[0] = "a"']
          },
          {
            id: 4,
            codeLine: 6,
            description: 'Hash("a") = 97 % 8 = 1. Insert "a" with count 1.',
            phase: 'calculate-hash',
            currentKey: 'a',
            hashCalculation: {
              key: 'a',
              charCodes: [97],
              sum: 97,
              bucketCount: 8,
              result: 1
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 1,
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 0,
            output: ['charCount["a"] = 1', '{a: 1}']
          },
          {
            id: 5,
            codeLine: 5,
            description: 'Process char = "n".',
            phase: 'read-key',
            currentKey: 'n',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 1 }]
              return b
            })(),
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 1,
            output: ['Processing s[1] = "n"']
          },
          {
            id: 6,
            codeLine: 6,
            description: 'Hash("n") = 110 % 8 = 6. Insert "n" with count 1.',
            phase: 'calculate-hash',
            currentKey: 'n',
            hashCalculation: {
              key: 'n',
              charCodes: [110],
              sum: 110,
              bucketCount: 8,
              result: 6
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 1 }]
              b[6].entries = [{ key: 'n', value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 6,
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 1,
            output: ['charCount["n"] = 1', '{a: 1, n: 1}']
          },
          {
            id: 7,
            codeLine: 5,
            description: 'Process char = "a" again.',
            phase: 'read-key',
            currentKey: 'a',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 1 }]
              b[6].entries = [{ key: 'n', value: 1 }]
              return b
            })(),
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 2,
            output: ['Processing s[2] = "a"']
          },
          {
            id: 8,
            codeLine: 6,
            description: '"a" exists, increment to 2.',
            phase: 'access-bucket',
            currentKey: 'a',
            currentValue: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 2, isHighlighted: true }]
              b[6].entries = [{ key: 'n', value: 1 }]
              return b
            })(),
            highlightedBucket: 1,
            highlightedEntry: 'a',
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 2,
            output: ['charCount["a"] = 2', '{a: 2, n: 1}']
          },
          {
            id: 9,
            codeLine: 6,
            description: 'Process "g". Hash("g") = 103 % 8 = 7. Insert with count 1.',
            phase: 'calculate-hash',
            currentKey: 'g',
            hashCalculation: {
              key: 'g',
              charCodes: [103],
              sum: 103,
              bucketCount: 8,
              result: 7
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 2 }]
              b[6].entries = [{ key: 'n', value: 1 }]
              b[7].entries = [{ key: 'g', value: 1, isNew: true }]
              return b
            })(),
            highlightedBucket: 7,
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 3,
            output: ['charCount["g"] = 1', '{a: 2, n: 1, g: 1}']
          },
          {
            id: 10,
            codeLine: 6,
            description: 'Process "r". Hash("r") = 114 % 8 = 2. Insert with count 1.',
            phase: 'calculate-hash',
            currentKey: 'r',
            hashCalculation: {
              key: 'r',
              charCodes: [114],
              sum: 114,
              bucketCount: 8,
              result: 2
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 2 }]
              b[2].entries = [{ key: 'r', value: 1, isNew: true }]
              b[6].entries = [{ key: 'n', value: 1 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 2,
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 4,
            output: ['charCount["r"] = 1', '{a: 2, n: 1, g: 1, r: 1}']
          },
          {
            id: 11,
            codeLine: 6,
            description: 'Process "a" again. Increment to 3.',
            phase: 'access-bucket',
            currentKey: 'a',
            currentValue: 3,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3, isHighlighted: true }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[6].entries = [{ key: 'n', value: 1 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 1,
            highlightedEntry: 'a',
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 5,
            output: ['charCount["a"] = 3', '{a: 3, n: 1, g: 1, r: 1}']
          },
          {
            id: 12,
            codeLine: 6,
            description: 'Process "m". Hash("m") = 109 % 8 = 5. Insert with count 1.',
            phase: 'calculate-hash',
            currentKey: 'm',
            hashCalculation: {
              key: 'm',
              charCodes: [109],
              sum: 109,
              bucketCount: 8,
              result: 5
            },
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3 }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1, isNew: true }]
              b[6].entries = [{ key: 'n', value: 1 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 5,
            input: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
            currentInputIndex: 6,
            output: ['charCount["m"] = 1', '{a: 3, n: 1, g: 1, r: 1, m: 1}']
          },
          {
            id: 13,
            codeLine: 9,
            description: 'First loop done. Now verify t = "nagaram" has same character counts.',
            phase: 'read-key',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3 }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1 }]
              b[6].entries = [{ key: 'n', value: 1 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            output: ['Counts built: {a:3, n:1, g:1, r:1, m:1}', 'Now checking t = "nagaram"']
          },
          {
            id: 14,
            codeLine: 10,
            description: 'Process t[0] = "n". Check if charCount["n"] is truthy.',
            phase: 'access-bucket',
            currentKey: 'n',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3 }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1 }]
              b[6].entries = [{ key: 'n', value: 1, isHighlighted: true }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 6,
            highlightedEntry: 'n',
            decision: {
              condition: 'Is charCount["n"] truthy?',
              conditionMet: true,
              action: 'Yes (count=1), decrement'
            },
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            currentInputIndex: 0,
            output: ['charCount["n"] = 1', 'Truthy, decrement']
          },
          {
            id: 15,
            codeLine: 11,
            description: 'Decrement charCount["n"] to 0.',
            phase: 'access-bucket',
            currentKey: 'n',
            currentValue: 0,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3 }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1 }]
              b[6].entries = [{ key: 'n', value: 0, isHighlighted: true }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 6,
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            currentInputIndex: 0,
            output: ['charCount["n"]--', '{a: 3, n: 0, g: 1, r: 1, m: 1}']
          },
          {
            id: 16,
            codeLine: 10,
            description: 'Process t[1] = "a". charCount["a"] = 3, truthy.',
            phase: 'access-bucket',
            currentKey: 'a',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 3, isHighlighted: true }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1 }]
              b[6].entries = [{ key: 'n', value: 0 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 1,
            highlightedEntry: 'a',
            decision: {
              condition: 'Is charCount["a"] truthy?',
              conditionMet: true,
              action: 'Yes (count=3), decrement'
            },
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            currentInputIndex: 1,
            output: ['charCount["a"] = 3', 'Truthy, decrement']
          },
          {
            id: 17,
            codeLine: 11,
            description: 'Decrement charCount["a"] to 2.',
            phase: 'access-bucket',
            currentKey: 'a',
            currentValue: 2,
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 2, isHighlighted: true }]
              b[2].entries = [{ key: 'r', value: 1 }]
              b[5].entries = [{ key: 'm', value: 1 }]
              b[6].entries = [{ key: 'n', value: 0 }]
              b[7].entries = [{ key: 'g', value: 1 }]
              return b
            })(),
            highlightedBucket: 1,
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            currentInputIndex: 1,
            output: ['charCount["a"]--', '{a: 2, n: 0, g: 1, r: 1, m: 1}']
          },
          {
            id: 18,
            codeLine: 11,
            description: 'Process "g", "a", "r", "a", "m" - decrement each. All counts reach 0.',
            phase: 'access-bucket',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 0 }]
              b[2].entries = [{ key: 'r', value: 0 }]
              b[5].entries = [{ key: 'm', value: 0 }]
              b[6].entries = [{ key: 'n', value: 0 }]
              b[7].entries = [{ key: 'g', value: 0 }]
              return b
            })(),
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            currentInputIndex: 6,
            output: ['All chars processed', '{a: 0, n: 0, g: 0, r: 0, m: 0}']
          },
          {
            id: 19,
            codeLine: 14,
            description: 'All counts are 0, meaning both strings have identical character frequencies. Return true!',
            phase: 'done',
            buckets: (() => {
              const b = createEmptyBuckets()
              b[1].entries = [{ key: 'a', value: 0 }]
              b[2].entries = [{ key: 'r', value: 0 }]
              b[5].entries = [{ key: 'm', value: 0 }]
              b[6].entries = [{ key: 'n', value: 0 }]
              b[7].entries = [{ key: 'g', value: 0 }]
              return b
            })(),
            input: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            output: ['return true', '"anagram" and "nagaram" are anagrams!']
          }
        ],
        insight: 'Count characters in first string (+1), then decrement for second string (-1). If all counts reach 0, strings are anagrams. O(n) time, O(1) space (26 letters max).'
      }
    ],
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

  return (
    <div className={styles.container}>
      <div className={styles.variantSelector}>
        {(Object.keys(variantInfo) as Variant[]).map(v => (
          <button
            key={v}
            className={`${styles.variantBtn} ${variant === v ? styles.activeVariant : ''}`}
            onClick={() => handleVariantChange(v)}
            title={variantInfo[v].description}
          >
            {variantInfo[v].label}
          </button>
        ))}
      </div>

      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            disabled={examples[variant][lvl].length === 0}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {hasExamples && currentExamples.length > 1 && (
        <div className={styles.exampleTabs}>
          {currentExamples.map((ex, i) => (
            <button
              key={ex.id}
              className={`${styles.exampleTab} ${exampleIndex === i ? styles.activeTab : ''}`}
              onClick={() => handleExampleChange(i)}
            >
              {ex.title}
            </button>
          ))}
        </div>
      )}

      {!hasExamples ? (
        <div className={styles.emptyState}>
          <p>Examples coming soon for {variantInfo[variant].label} - {levelInfo[level].label}.</p>
        </div>
      ) : currentExample && currentStep && (
        <>
          <div className={styles.mainGrid}>
            <CodePanel
              code={currentExample.code}
              highlightedLine={currentStep.codeLine}
              title="Code"
            />

            <div className={styles.vizPanel}>
              <AnimatePresence mode="wait">
                {currentStep.decision && (
                  <motion.div
                    key={`decision-${currentStep.id}`}
                    className={styles.decisionPanel}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.decisionQuestion}>{currentStep.decision.condition}</span>
                    <span className={`${styles.decisionAnswer} ${currentStep.decision.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
                      {currentStep.decision.conditionMet ? 'Yes' : 'No'} {'\u2192'} {currentStep.decision.action}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentStep.hashCalculation && (
                  <motion.div
                    key={`hash-${currentStep.id}`}
                    className={styles.hashCalculation}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.hashKey}>&quot;{currentStep.hashCalculation.key}&quot;</span>
                    <span className={styles.hashArrow}>{'\u2192'}</span>
                    {currentStep.hashCalculation.key.length <= 4 && (
                      <>
                        <span className={styles.hashCharCodes}>
                          [{currentStep.hashCalculation.charCodes.join(', ')}]
                        </span>
                        <span className={styles.hashArrow}>{'\u2192'}</span>
                      </>
                    )}
                    <span className={styles.hashFormula}>
                      {currentStep.hashCalculation.sum} % {currentStep.hashCalculation.bucketCount}
                    </span>
                    <span className={styles.hashArrow}>=</span>
                    <span className={styles.hashResult}>
                      bucket[{currentStep.hashCalculation.result}]
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentStep.input && (
                <div className={styles.inputArray}>
                  <div className={styles.inputLabel}>Input Array</div>
                  <div className={styles.inputCells}>
                    {currentStep.input.map((val, idx) => (
                      <motion.div
                        key={idx}
                        className={`${styles.inputCell} ${
                          currentStep.currentInputIndex === idx ? styles.activeInput : ''
                        } ${
                          currentStep.currentInputIndex !== undefined && idx < currentStep.currentInputIndex ? styles.processedInput : ''
                        }`}
                        animate={{
                          scale: currentStep.currentInputIndex === idx ? 1.1 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={styles.inputValue}>{val}</span>
                        <span className={styles.inputIndex}>{idx}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.bucketGrid}>
                {currentStep.buckets.map(bucket => (
                  <motion.div
                    key={bucket.index}
                    className={`${styles.bucket} ${
                      currentStep.highlightedBucket === bucket.index ? styles.activeBucket : ''
                    }`}
                    animate={{
                      scale: currentStep.highlightedBucket === bucket.index ? 1.02 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.bucketIndex}>{bucket.index}</div>
                    <div className={styles.bucketEntries}>
                      {bucket.entries.length === 0 ? (
                        <span className={styles.emptyBucket}>empty</span>
                      ) : (
                        bucket.entries.map((entry, entryIdx) => (
                          <motion.div
                            key={`${entry.key}-${entryIdx}`}
                            className={`${styles.entry} ${entry.isHighlighted ? styles.highlightedEntry : ''}`}
                            initial={entry.isNew ? { opacity: 0, scale: 0.8 } : false}
                            animate={{
                              opacity: 1,
                              scale: entry.isHighlighted ? 1.05 : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className={styles.entryKey}>{entry.key}</span>
                            <span className={styles.entryArrow}>{'\u2192'}</span>
                            <motion.span
                              className={styles.entryValue}
                              key={`${entry.key}-${entry.value}`}
                              initial={entry.isHighlighted ? { scale: 1.2, color: '#10b981' } : false}
                              animate={{ scale: 1, color: 'inherit' }}
                              transition={{ duration: 0.3 }}
                            >
                              {entry.value}
                            </motion.span>
                            {entry.originalIndex !== undefined && (
                              <span className={styles.entryOriginalIndex}>@{entry.originalIndex}</span>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {currentStep.output && currentStep.output.length > 0 && (
                <div className={styles.outputBox}>
                  <div className={styles.outputHeader}>Output</div>
                  <div className={styles.outputContent}>
                    {currentStep.output.map((line, i) => (
                      <motion.div
                        key={i}
                        className={styles.outputLine}
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
          />

          <div className={styles.insightBox}>
            <span className={styles.insightLabel}>Key Insight:</span>
            {currentExample.insight}
          </div>
        </>
      )}
    </div>
  )
}
