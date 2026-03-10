'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface ArrayElement {
  value: number | string
  inWindow: boolean
  isLeft: boolean
  isRight: boolean
}

interface WindowState {
  left: number
  right: number
  windowContent: string
  calculation: string
}

interface Step {
  id: number
  description: string
  array: ArrayElement[]
  window: WindowState
  result: string
  output?: string
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

function buildArrayElements(
  values: (number | string)[],
  left: number,
  right: number,
): ArrayElement[] {
  return values.map((value, i) => ({
    value,
    inWindow: i >= left && i <= right,
    isLeft: i === left,
    isRight: i === right,
  }))
}

const fixedWindowData = [2, 1, 5, 1, 3, 2]
const K = 3

const fixedSteps: Step[] = (() => {
  const steps: Step[] = []
  const arr = fixedWindowData

  steps.push({
    id: 0,
    description: `Find max sum of subarray of size k=${K}. Initialize window with first ${K} elements.`,
    array: buildArrayElements(arr, 0, K - 1),
    window: { left: 0, right: K - 1, windowContent: `[${arr.slice(0, K).join(', ')}]`, calculation: `${arr.slice(0, K).join(' + ')} = ${arr[0] + arr[1] + arr[2]}` },
    result: `maxSum = ${arr[0] + arr[1] + arr[2]}`,
  })

  const sums: number[] = []
  for (let i = 0; i <= arr.length - K; i++) {
    sums.push(arr.slice(i, i + K).reduce((a, b) => a + b, 0))
  }

  let maxSoFar = sums[0]
  for (let i = 1; i <= arr.length - K; i++) {
    const left = i
    const right = i + K - 1
    const removing = arr[i - 1]
    const adding = arr[right]
    const windowSum = sums[i]
    maxSoFar = Math.max(maxSoFar, windowSum)

    steps.push({
      id: i,
      description: `Slide: remove arr[${i - 1}]=${removing}, add arr[${right}]=${adding}. Window sum = ${windowSum}.${windowSum === maxSoFar && windowSum > sums[i - 1] ? ' New max!' : ''}`,
      array: buildArrayElements(arr, left, right),
      window: {
        left,
        right,
        windowContent: `[${arr.slice(left, right + 1).join(', ')}]`,
        calculation: `${arr.slice(left, right + 1).join(' + ')} = ${windowSum}`,
      },
      result: `maxSum = ${maxSoFar}`,
      output: windowSum === maxSoFar && i === arr.length - K ? `${maxSoFar}` : undefined,
    })
  }

  steps.push({
    id: steps.length,
    description: `Done! Maximum sum subarray of size ${K} is ${Math.max(...sums)}.`,
    array: buildArrayElements(arr, sums.indexOf(Math.max(...sums)), sums.indexOf(Math.max(...sums)) + K - 1),
    window: {
      left: sums.indexOf(Math.max(...sums)),
      right: sums.indexOf(Math.max(...sums)) + K - 1,
      windowContent: `[${arr.slice(sums.indexOf(Math.max(...sums)), sums.indexOf(Math.max(...sums)) + K).join(', ')}]`,
      calculation: `Max = ${Math.max(...sums)}`,
    },
    result: `Answer: ${Math.max(...sums)}`,
    output: `${Math.max(...sums)}`,
  })

  return steps
})()

const varString = 'abcabcbb'

const varSteps: Step[] = (() => {
  const steps: Step[] = []
  const chars = varString.split('')

  const stateSequence: Array<{
    left: number
    right: number
    desc: string
    maxLen: number
    seen: string
  }> = [
    { left: 0, right: 0, desc: 'Start: expand right. Window = "a". No duplicates.', maxLen: 1, seen: 'a' },
    { left: 0, right: 1, desc: 'Expand right to "b". Window = "ab". No duplicates.', maxLen: 2, seen: 'a,b' },
    { left: 0, right: 2, desc: 'Expand right to "c". Window = "abc". No duplicates. maxLen=3.', maxLen: 3, seen: 'a,b,c' },
    { left: 1, right: 3, desc: 'Right hits "a" (duplicate). Shrink left past previous "a". Window = "bca".', maxLen: 3, seen: 'b,c,a' },
    { left: 2, right: 4, desc: 'Right hits "b" (duplicate). Shrink left past previous "b". Window = "cab".', maxLen: 3, seen: 'c,a,b' },
    { left: 3, right: 5, desc: 'Right hits "c" (duplicate). Shrink left past previous "c". Window = "abc".', maxLen: 3, seen: 'a,b,c' },
    { left: 5, right: 6, desc: 'Right hits "b" (duplicate). Shrink left past previous "b". Window = "cb".', maxLen: 3, seen: 'c,b' },
    { left: 7, right: 7, desc: 'Right hits "b" (duplicate). Shrink left past previous "b". Window = "b".', maxLen: 3, seen: 'b' },
  ]

  for (let i = 0; i < stateSequence.length; i++) {
    const s = stateSequence[i]
    steps.push({
      id: i,
      description: s.desc,
      array: buildArrayElements(chars, s.left, s.right),
      window: {
        left: s.left,
        right: s.right,
        windowContent: `"${chars.slice(s.left, s.right + 1).join('')}"`,
        calculation: `unique: {${s.seen}} len=${s.right - s.left + 1}`,
      },
      result: `maxLen = ${s.maxLen}`,
      output: i === stateSequence.length - 1 ? `${s.maxLen}` : undefined,
    })
  }

  steps.push({
    id: steps.length,
    description: 'Done! Longest substring without repeating characters is "abc" with length 3.',
    array: buildArrayElements(chars, 0, 2),
    window: {
      left: 0,
      right: 2,
      windowContent: '"abc"',
      calculation: 'Answer: length 3',
    },
    result: 'Answer: 3',
    output: '3',
  })

  return steps
})()

const examples: Example[] = [
  {
    id: 'fixed',
    title: 'Fixed Window (Max Sum)',
    steps: fixedSteps,
    insight: 'Fixed-size windows slide by adding the incoming element and removing the outgoing one — O(n) instead of recalculating the entire window sum each time.',
  },
  {
    id: 'variable',
    title: 'Variable Window (Longest Substring)',
    steps: varSteps,
    insight: 'Variable windows expand right to include new elements and shrink left when a constraint is violated. Each pointer moves at most n times, so total work is O(n).',
  },
]

function getElementBg(el: ArrayElement): string {
  if (el.isLeft || el.isRight) return 'var(--color-action-access)'
  if (el.inWindow) return 'var(--color-accent-blue-25)'
  return 'var(--color-white-5)'
}

function getElementBorder(el: ArrayElement): string {
  if (el.isLeft || el.isRight) return 'var(--color-action-access)'
  if (el.inWindow) return 'var(--color-accent-blue-40)'
  return 'var(--color-white-10)'
}

export function SlidingWindowViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const handleExampleChange = (index: number): void => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = (): void => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
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

      <div className="bg-black-30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Array</span>
          <span className="font-mono text-sm text-blue-400 bg-sky-500/10 px-2 py-0.5 rounded">
            {currentStep.window.calculation}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          <AnimatePresence mode="popLayout">
            {currentStep.array.map((el, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-[56px] max-sm:w-[48px] rounded-lg overflow-hidden border-2 relative"
                animate={{
                  borderColor: getElementBorder(el),
                  background: `${getElementBg(el)}`,
                }}
                layout
              >
                <div className="px-1.5 py-1 font-mono text-[10px] text-gray-500 text-center bg-white-5 border-b border-white-5">
                  [{i}]
                </div>
                <div className="px-2 py-3 font-mono text-xl max-sm:text-base font-bold text-white text-center">
                  {el.value}
                </div>
                {el.isLeft && (
                  <motion.div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    L
                  </motion.div>
                )}
                {el.isRight && (
                  <motion.div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-400 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    R
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded border-2" style={{ borderColor: 'var(--color-action-access)', background: 'var(--color-accent-blue-25)' }} />
            Window boundary
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded" style={{ background: 'var(--color-accent-blue-25)' }} />
            In window
          </span>
        </div>
      </div>

      <div className="flex gap-4 max-sm:flex-col">
        <div className="flex-1 bg-black-30 rounded-lg p-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Window State</span>
          <div className="flex flex-col gap-1.5 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">left:</span>
              <span className="text-emerald-400">{currentStep.window.left}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">right:</span>
              <span className="text-sky-400">{currentStep.window.right}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">window:</span>
              <span className="text-white">{currentStep.window.windowContent}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black-30 rounded-lg p-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Result</span>
          <div className="text-lg font-mono font-bold text-brand-light">
            {currentStep.result}
          </div>
        </div>
      </div>

      {currentStep.output && (
        <motion.div
          className="flex items-center gap-3 p-3 px-4 bg-black-30 border-2 border-emerald-500 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-base text-gray-500">Answer:</span>
          <span className="font-mono text-xl font-bold text-emerald-400">{currentStep.output}</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black-30 rounded-lg border-l-[3px] border-brand-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
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
