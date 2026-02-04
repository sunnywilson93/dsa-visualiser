'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface PromiseItem {
  id: string
  label: string
  state: 'pending' | 'fulfilled' | 'rejected'
  settleOrder?: number
  value?: string
  reason?: string
}

interface MethodResult {
  state: 'pending' | 'fulfilled' | 'rejected'
  value?: string
  reason?: string
  allSettledValue?: { status: string; value?: string; reason?: string }[]
  aggregateError?: string[]
}

interface Step {
  description: string
  highlightLines: number[]
  inputPromises: PromiseItem[]
  results: {
    all: MethodResult
    race: MethodResult
    allSettled: MethodResult
    any: MethodResult
  }
  output: string[]
  phase: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'all-fulfill',
      title: 'All Fulfill',
      code: [
        'const p1 = Promise.resolve("A");',
        'const p2 = Promise.resolve("B");',
        'const p3 = Promise.resolve("C");',
        '',
        '// Compare all four methods:',
        'Promise.all([p1, p2, p3])',
        'Promise.race([p1, p2, p3])',
        'Promise.allSettled([p1, p2, p3])',
        'Promise.any([p1, p2, p3])'
      ],
      steps: [
        {
          description: 'Three promises created - all immediately fulfilled',
          highlightLines: [0, 1, 2],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"A"' },
            { id: 'p2', label: 'p2', state: 'fulfilled', settleOrder: 2, value: '"B"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"C"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'Promise.race settles first - it returns the FIRST settled promise (p1)',
          highlightLines: [6],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"A"' },
            { id: 'p2', label: 'p2', state: 'fulfilled', settleOrder: 2, value: '"B"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"C"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"A"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['race: "A"'],
          phase: 'Race Settles'
        },
        {
          description: 'Promise.any also settles - first FULFILLED promise (same as race here)',
          highlightLines: [8],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"A"' },
            { id: 'p2', label: 'p2', state: 'fulfilled', settleOrder: 2, value: '"B"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"C"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"A"' },
            allSettled: { state: 'pending' },
            any: { state: 'fulfilled', value: '"A"' }
          },
          output: ['race: "A"', 'any: "A"'],
          phase: 'Any Settles'
        },
        {
          description: 'Promise.all and allSettled wait for ALL promises to settle',
          highlightLines: [5, 7],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"A"' },
            { id: 'p2', label: 'p2', state: 'fulfilled', settleOrder: 2, value: '"B"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"C"' }
          ],
          results: {
            all: { state: 'fulfilled', value: '["A", "B", "C"]' },
            race: { state: 'fulfilled', value: '"A"' },
            allSettled: { state: 'fulfilled', allSettledValue: [
              { status: 'fulfilled', value: '"A"' },
              { status: 'fulfilled', value: '"B"' },
              { status: 'fulfilled', value: '"C"' }
            ]},
            any: { state: 'fulfilled', value: '"A"' }
          },
          output: ['race: "A"', 'any: "A"', 'all: ["A", "B", "C"]', 'allSettled: [...]'],
          phase: 'Complete'
        }
      ],
      insight: 'When all promises fulfill: race and any return the first value, all returns an array of all values, allSettled returns status objects.'
    },
    {
      id: 'race-first-wins',
      title: 'Race: First Wins',
      code: [
        '// Simulated delays:',
        'const slow = /* 2000ms */ Promise.resolve("slow");',
        'const medium = /* 1000ms */ Promise.resolve("medium");',
        'const fast = /* 500ms */ Promise.resolve("fast");',
        '',
        'Promise.race([slow, medium, fast])',
        '// Who settles first?'
      ],
      steps: [
        {
          description: 'Three promises with different settlement times - all pending',
          highlightLines: [1, 2, 3],
          inputPromises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'medium', label: 'medium', state: 'pending' },
            { id: 'fast', label: 'fast', state: 'pending' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'After 500ms: "fast" settles first - Promise.race and Promise.any immediately resolve!',
          highlightLines: [3, 5],
          inputPromises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'medium', label: 'medium', state: 'pending' },
            { id: 'fast', label: 'fast', state: 'fulfilled', settleOrder: 1, value: '"fast"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"fast"' },
            allSettled: { state: 'pending' },
            any: { state: 'fulfilled', value: '"fast"' }
          },
          output: ['race: "fast"', 'any: "fast"'],
          phase: '500ms'
        },
        {
          description: 'After 1000ms: "medium" settles - race and any already done (ignored)',
          highlightLines: [2],
          inputPromises: [
            { id: 'slow', label: 'slow', state: 'pending' },
            { id: 'medium', label: 'medium', state: 'fulfilled', settleOrder: 2, value: '"medium"' },
            { id: 'fast', label: 'fast', state: 'fulfilled', settleOrder: 1, value: '"fast"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"fast"' },
            allSettled: { state: 'pending' },
            any: { state: 'fulfilled', value: '"fast"' }
          },
          output: ['race: "fast"', 'any: "fast"'],
          phase: '1000ms'
        },
        {
          description: 'After 2000ms: all settled - Promise.all and allSettled now complete',
          highlightLines: [1],
          inputPromises: [
            { id: 'slow', label: 'slow', state: 'fulfilled', settleOrder: 3, value: '"slow"' },
            { id: 'medium', label: 'medium', state: 'fulfilled', settleOrder: 2, value: '"medium"' },
            { id: 'fast', label: 'fast', state: 'fulfilled', settleOrder: 1, value: '"fast"' }
          ],
          results: {
            all: { state: 'fulfilled', value: '["slow", "medium", "fast"]' },
            race: { state: 'fulfilled', value: '"fast"' },
            allSettled: { state: 'fulfilled', allSettledValue: [
              { status: 'fulfilled', value: '"slow"' },
              { status: 'fulfilled', value: '"medium"' },
              { status: 'fulfilled', value: '"fast"' }
            ]},
            any: { state: 'fulfilled', value: '"fast"' }
          },
          output: ['race: "fast"', 'any: "fast"', 'all: ["slow", "medium", "fast"]', 'allSettled: [...]'],
          phase: 'Complete'
        }
      ],
      insight: 'Promise.race settles with the FIRST promise to settle (fulfill OR reject). Useful for timeouts!'
    }
  ],
  intermediate: [
    {
      id: 'mixed-results',
      title: 'Mixed Fulfill/Reject',
      code: [
        'const p1 = Promise.resolve("Success");',
        'const p2 = Promise.reject("Error!");',
        'const p3 = Promise.resolve("Another");',
        '',
        'Promise.all([p1, p2, p3])     // ?',
        'Promise.race([p1, p2, p3])    // ?',
        'Promise.allSettled([p1, p2, p3]) // ?',
        'Promise.any([p1, p2, p3])     // ?'
      ],
      steps: [
        {
          description: 'Mixed promises: p1 and p3 fulfill, p2 rejects',
          highlightLines: [0, 1, 2],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"Success"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error!"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Another"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'Promise.race: p1 settled first (fulfilled) - returns "Success"',
          highlightLines: [5],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"Success"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error!"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Another"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"Success"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['race: "Success"'],
          phase: 'Race'
        },
        {
          description: 'Promise.any: First FULFILLED (ignores rejections) - also "Success"',
          highlightLines: [7],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"Success"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error!"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Another"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'fulfilled', value: '"Success"' },
            allSettled: { state: 'pending' },
            any: { state: 'fulfilled', value: '"Success"' }
          },
          output: ['race: "Success"', 'any: "Success"'],
          phase: 'Any'
        },
        {
          description: 'Promise.all: REJECTS immediately when p2 rejects - "fail fast"',
          highlightLines: [4],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"Success"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error!"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Another"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Error!"' },
            race: { state: 'fulfilled', value: '"Success"' },
            allSettled: { state: 'pending' },
            any: { state: 'fulfilled', value: '"Success"' }
          },
          output: ['race: "Success"', 'any: "Success"', 'all: REJECTED "Error!"'],
          phase: 'All Rejects'
        },
        {
          description: 'Promise.allSettled: NEVER rejects - waits for all, reports each status',
          highlightLines: [6],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'fulfilled', settleOrder: 1, value: '"Success"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error!"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Another"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Error!"' },
            race: { state: 'fulfilled', value: '"Success"' },
            allSettled: { state: 'fulfilled', allSettledValue: [
              { status: 'fulfilled', value: '"Success"' },
              { status: 'rejected', reason: '"Error!"' },
              { status: 'fulfilled', value: '"Another"' }
            ]},
            any: { state: 'fulfilled', value: '"Success"' }
          },
          output: ['race: "Success"', 'any: "Success"', 'all: REJECTED', 'allSettled: [{...}, {...}, {...}]'],
          phase: 'Complete'
        }
      ],
      insight: 'Key difference: Promise.all fails fast on ANY rejection, while Promise.allSettled always waits for everything and never rejects!'
    },
    {
      id: 'any-ignores-rejections',
      title: 'Any Ignores Rejections',
      code: [
        '// p1 rejects first, p2 rejects second',
        'const p1 = Promise.reject("Fail 1");',
        'const p2 = Promise.reject("Fail 2");',
        'const p3 = Promise.resolve("Success!");',
        '',
        '// Promise.any ignores rejections',
        '// until it finds a fulfillment',
        'Promise.any([p1, p2, p3])'
      ],
      steps: [
        {
          description: 'Two rejections come first, then one fulfillment',
          highlightLines: [1, 2, 3],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Fail 1"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Fail 2"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Success!"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'p1 rejects first - Promise.race REJECTS immediately!',
          highlightLines: [1],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Fail 1"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Fail 2"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Success!"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Fail 1"' },
            race: { state: 'rejected', reason: '"Fail 1"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['race: REJECTED "Fail 1"', 'all: REJECTED "Fail 1"'],
          phase: 'First Reject'
        },
        {
          description: 'p2 rejects - Promise.any still waiting (ignoring rejections)',
          highlightLines: [2],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Fail 1"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Fail 2"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Success!"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Fail 1"' },
            race: { state: 'rejected', reason: '"Fail 1"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['race: REJECTED "Fail 1"', 'all: REJECTED "Fail 1"', 'any: still waiting...'],
          phase: 'Second Reject'
        },
        {
          description: 'p3 fulfills - Promise.any finally succeeds with "Success!"',
          highlightLines: [3, 7],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Fail 1"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Fail 2"' },
            { id: 'p3', label: 'p3', state: 'fulfilled', settleOrder: 3, value: '"Success!"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Fail 1"' },
            race: { state: 'rejected', reason: '"Fail 1"' },
            allSettled: { state: 'fulfilled', allSettledValue: [
              { status: 'rejected', reason: '"Fail 1"' },
              { status: 'rejected', reason: '"Fail 2"' },
              { status: 'fulfilled', value: '"Success!"' }
            ]},
            any: { state: 'fulfilled', value: '"Success!"' }
          },
          output: ['race: REJECTED "Fail 1"', 'all: REJECTED "Fail 1"', 'any: "Success!"', 'allSettled: [...]'],
          phase: 'Complete'
        }
      ],
      insight: 'Promise.any is optimistic - it keeps looking for success even when others fail. Promise.race is neutral - first to settle wins.'
    }
  ],
  advanced: [
    {
      id: 'all-reject',
      title: 'All Reject (AggregateError)',
      code: [
        '// ALL promises reject',
        'const p1 = Promise.reject("Error A");',
        'const p2 = Promise.reject("Error B");',
        'const p3 = Promise.reject("Error C");',
        '',
        'Promise.any([p1, p2, p3]).catch(err => {',
        '  console.log(err instanceof AggregateError);',
        '  console.log(err.errors);',
        '});'
      ],
      steps: [
        {
          description: 'Three promises - ALL will reject',
          highlightLines: [1, 2, 3],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Error A"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error B"' },
            { id: 'p3', label: 'p3', state: 'rejected', settleOrder: 3, reason: '"Error C"' }
          ],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'p1 rejects - Promise.all and Promise.race fail immediately',
          highlightLines: [1],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Error A"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error B"' },
            { id: 'p3', label: 'p3', state: 'rejected', settleOrder: 3, reason: '"Error C"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Error A"' },
            race: { state: 'rejected', reason: '"Error A"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['all: REJECTED "Error A"', 'race: REJECTED "Error A"'],
          phase: 'First Reject'
        },
        {
          description: 'p2 and p3 reject - Promise.any still hoping for success...',
          highlightLines: [2, 3],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Error A"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error B"' },
            { id: 'p3', label: 'p3', state: 'rejected', settleOrder: 3, reason: '"Error C"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Error A"' },
            race: { state: 'rejected', reason: '"Error A"' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['all: REJECTED', 'race: REJECTED', 'any: waiting...'],
          phase: 'All Rejected'
        },
        {
          description: 'No fulfillments found! Promise.any throws AggregateError with ALL errors',
          highlightLines: [5, 6, 7],
          inputPromises: [
            { id: 'p1', label: 'p1', state: 'rejected', settleOrder: 1, reason: '"Error A"' },
            { id: 'p2', label: 'p2', state: 'rejected', settleOrder: 2, reason: '"Error B"' },
            { id: 'p3', label: 'p3', state: 'rejected', settleOrder: 3, reason: '"Error C"' }
          ],
          results: {
            all: { state: 'rejected', reason: '"Error A"' },
            race: { state: 'rejected', reason: '"Error A"' },
            allSettled: { state: 'fulfilled', allSettledValue: [
              { status: 'rejected', reason: '"Error A"' },
              { status: 'rejected', reason: '"Error B"' },
              { status: 'rejected', reason: '"Error C"' }
            ]},
            any: { state: 'rejected', aggregateError: ['"Error A"', '"Error B"', '"Error C"'] }
          },
          output: ['all: REJECTED "Error A"', 'race: REJECTED "Error A"', 'any: AggregateError', 'err.errors: ["Error A", "Error B", "Error C"]'],
          phase: 'AggregateError'
        }
      ],
      insight: 'When ALL promises reject, Promise.any throws an AggregateError containing ALL rejection reasons. This is unique to Promise.any!'
    },
    {
      id: 'empty-array',
      title: 'Edge Case: Empty Array',
      code: [
        '// What happens with empty arrays?',
        '',
        'Promise.all([])       // ?',
        'Promise.race([])      // ?',
        'Promise.allSettled([])// ?',
        'Promise.any([])       // ?'
      ],
      steps: [
        {
          description: 'Passing empty arrays to each method - edge case behavior',
          highlightLines: [0],
          inputPromises: [],
          results: {
            all: { state: 'pending' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: [],
          phase: 'Setup'
        },
        {
          description: 'Promise.all([]) - Fulfills immediately with empty array []',
          highlightLines: [2],
          inputPromises: [],
          results: {
            all: { state: 'fulfilled', value: '[]' },
            race: { state: 'pending' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['all: []'],
          phase: 'All'
        },
        {
          description: 'Promise.race([]) - NEVER settles! Forever pending (no promises to race)',
          highlightLines: [3],
          inputPromises: [],
          results: {
            all: { state: 'fulfilled', value: '[]' },
            race: { state: 'pending', value: 'forever pending!' },
            allSettled: { state: 'pending' },
            any: { state: 'pending' }
          },
          output: ['all: []', 'race: pending forever!'],
          phase: 'Race'
        },
        {
          description: 'Promise.allSettled([]) - Fulfills with empty array []',
          highlightLines: [4],
          inputPromises: [],
          results: {
            all: { state: 'fulfilled', value: '[]' },
            race: { state: 'pending', value: 'forever pending!' },
            allSettled: { state: 'fulfilled', allSettledValue: [] },
            any: { state: 'pending' }
          },
          output: ['all: []', 'race: pending forever!', 'allSettled: []'],
          phase: 'AllSettled'
        },
        {
          description: 'Promise.any([]) - REJECTS immediately with AggregateError (no winners possible)',
          highlightLines: [5],
          inputPromises: [],
          results: {
            all: { state: 'fulfilled', value: '[]' },
            race: { state: 'pending', value: 'forever pending!' },
            allSettled: { state: 'fulfilled', allSettledValue: [] },
            any: { state: 'rejected', aggregateError: [] }
          },
          output: ['all: []', 'race: pending forever!', 'allSettled: []', 'any: AggregateError (empty)'],
          phase: 'Complete'
        }
      ],
      insight: 'Edge cases reveal intent: all() succeeds vacuously, race() needs a winner, allSettled() just reports, any() needs at least one success.'
    }
  ]
}

export function PromisesStaticViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Setup': return 'var(--color-blue-400)'
      case 'Race Settles':
      case 'Race':
      case 'First Reject':
      case 'Second Reject':
        return 'var(--color-amber-500)'
      case 'Any Settles':
      case 'Any':
        return 'var(--color-violet-300-40)'
      case 'All Rejects':
      case 'All Rejected':
      case 'AggregateError':
        return 'var(--color-red-500)'
      case 'AllSettled':
        return '#818cf8'
      case 'All':
        return 'var(--color-emerald-500)'
      case '500ms':
      case '1000ms':
        return 'var(--color-amber-500)'
      case 'Complete': return 'var(--color-emerald-500)'
      default: return 'var(--color-gray-500)'
    }
  }

  const getStateColor = (state: 'pending' | 'fulfilled' | 'rejected') => {
    switch (state) {
      case 'pending': return 'var(--color-amber-500)'
      case 'fulfilled': return 'var(--color-emerald-500)'
      case 'rejected': return 'var(--color-red-500)'
    }
  }

  const getStateBgColor = (state: 'pending' | 'fulfilled' | 'rejected') => {
    switch (state) {
      case 'pending': return 'rgba(245, 158, 11, 0.15)'
      case 'fulfilled': return 'rgba(16, 185, 129, 0.15)'
      case 'rejected': return 'rgba(239, 68, 68, 0.15)'
    }
  }

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.codeHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase}
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.highlightLines.includes(i) ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Input Promises */}
      {currentStep.inputPromises.length > 0 && (
        <div className={styles.promiseContainer}>
          <div className={styles.promiseHeader}>Input Promises</div>
          <div className={styles.promiseGrid}>
            <AnimatePresence mode="popLayout">
              {currentStep.inputPromises.map(p => (
                <motion.div
                  key={p.id}
                  className={styles.promiseCard}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  style={{
                    borderColor: getStateColor(p.state),
                    boxShadow: `0 0 20px ${getStateColor(p.state)}40`
                  }}
                >
                  <div className={styles.promiseLabel}>{p.label}</div>
                  <motion.div
                    className={styles.promiseState}
                    style={{ color: getStateColor(p.state) }}
                    key={p.state}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {p.state.toUpperCase()}
                  </motion.div>
                  {p.value && (
                    <motion.div
                      className={styles.promiseValue}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {p.value}
                    </motion.div>
                  )}
                  {p.reason && (
                    <motion.div
                      className={styles.promiseReason}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {p.reason}
                    </motion.div>
                  )}
                  {p.settleOrder !== undefined && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: getStateColor(p.state),
                        color: '#000',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {p.settleOrder}
                    </motion.div>
                  )}
                  <div
                    className={styles.stateIndicator}
                    style={{ background: getStateColor(p.state) }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Method Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-md)'
      }}>
        {(['all', 'race', 'allSettled', 'any'] as const).map(method => {
          const result = currentStep.results[method]
          const methodColors: Record<string, string> = {
            all: 'var(--color-emerald-500)',
            race: 'var(--color-amber-500)',
            allSettled: '#818cf8',
            any: '#c4b5fd'
          }
          const methodColor = methodColors[method]

          return (
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--color-black-40)',
                border: `2px solid ${result.state !== 'pending' ? getStateColor(result.state) : 'var(--color-white-10)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-md)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Method name badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: methodColor,
                  background: `${methodColor}20`,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  .{method}
                </span>
              </div>

              {/* State indicator */}
              <motion.div
                key={`${method}-${result.state}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-md)',
                  background: getStateBgColor(result.state),
                  marginBottom: 'var(--spacing-sm)'
                }}
              >
                <div style={{
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: getStateColor(result.state)
                }}>
                  {result.state}
                </div>
              </motion.div>

              {/* Result value */}
              <AnimatePresence mode="wait">
                {result.state === 'fulfilled' && result.value && (
                  <motion.div
                    key="value"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--color-emerald-500)',
                      wordBreak: 'break-word',
                      textAlign: 'center'
                    }}
                  >
                    {result.value}
                  </motion.div>
                )}
                {result.state === 'fulfilled' && result.allSettledValue && (
                  <motion.div
                    key="allsettled"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: 'var(--text-2xs)'
                    }}
                  >
                    {result.allSettledValue.length === 0 ? (
                      <span style={{ color: 'var(--color-gray-500)', textAlign: 'center' }}>[]</span>
                    ) : (
                      result.allSettledValue.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: item.status === 'fulfilled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: item.status === 'fulfilled' ? 'var(--color-emerald-500)' : 'var(--color-red-500)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px'
                          }}
                        >
                          {item.status}: {item.value || item.reason}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
                {result.state === 'rejected' && result.reason && (
                  <motion.div
                    key="reason"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--color-red-500)',
                      wordBreak: 'break-word',
                      textAlign: 'center'
                    }}
                  >
                    {result.reason}
                  </motion.div>
                )}
                {result.state === 'rejected' && result.aggregateError && (
                  <motion.div
                    key="aggregate"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 600,
                      color: 'var(--color-red-500)',
                      textAlign: 'center',
                      marginBottom: '2px'
                    }}>
                      AggregateError
                    </div>
                    {result.aggregateError.length === 0 ? (
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '10px', textAlign: 'center' }}>
                        (empty)
                      </span>
                    ) : (
                      result.aggregateError.map((err, i) => (
                        <div
                          key={i}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: '#fca5a5',
                            padding: '2px 6px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'center'
                          }}
                        >
                          {err}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
                {result.state === 'pending' && result.value && (
                  <motion.div
                    key="pending-note"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: '10px',
                      color: 'var(--color-gray-500)',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}
                  >
                    {result.value}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: result.state !== 'pending' ? getStateColor(result.state) : 'var(--color-white-10)'
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Console Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>-</span>
          ) : (
            currentStep.output.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.outputLine}
              >
                {o}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
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
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
