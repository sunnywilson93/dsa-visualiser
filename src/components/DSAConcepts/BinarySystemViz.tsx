'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BitManipulationConcept } from '@/components/ConceptPanel'
import { StepControls } from '@/components/SharedViz'
import { cn } from '@/utils/cn'
import type { ConceptStep } from '@/types'

interface BinaryExample {
  id: string
  title: string
  steps: ConceptStep[]
  insight: string
}

const examples: BinaryExample[] = [
  {
    id: 'place-values',
    title: 'Place Values',
    insight: 'Binary numbers are just sums of powers of two. Knowing bit positions makes mask math fast.',
    steps: [
      {
        id: 1,
        title: 'Pick a number',
        description: '13 in binary sets bits 3, 2, and 0.',
        visual: {
          binary: {
            numbers: [{ label: '13', value: 13 }],
            activeBits: [3, 2, 0],
          },
          annotations: ['13 = 8 + 4 + 1'],
        },
      },
      {
        id: 2,
        title: 'Build with shifts',
        description: 'OR powers of two to turn on those bits.',
        visual: {
          binary: {
            numbers: [
              { label: '1<<3', value: 8 },
              { label: '1<<2', value: 4 },
              { label: '1<<0', value: 1 },
            ],
            operator: '|',
            result: 13,
            activeBits: [3, 2, 0],
          },
          annotations: ['8 | 4 | 1 = 13'],
        },
      },
      {
        id: 3,
        title: 'Read the bits',
        description: 'Binary digits from MSB to LSB give 00001101.',
        visual: {
          binary: {
            numbers: [{ label: '13', value: 13 }],
            activeBits: [3, 2, 0],
          },
          annotations: ['Binary: 00001101'],
          result: '0b1101',
        },
      },
    ],
  },
  {
    id: 'bitwise-ops',
    title: 'AND / OR / XOR',
    insight: 'Bitwise operators combine bits independently, which is perfect for masks and toggles.',
    steps: [
      {
        id: 1,
        title: 'AND keeps shared 1s',
        description: '1100 & 1010 = 1000',
        visual: {
          binary: {
            numbers: [{ label: '12', value: 12 }, { label: '10', value: 10 }],
            operator: '&',
            result: 8,
            activeBits: [3],
          },
          annotations: ['Only bits set in both remain'],
        },
      },
      {
        id: 2,
        title: 'OR combines 1s',
        description: '1100 | 1010 = 1110',
        visual: {
          binary: {
            numbers: [{ label: '12', value: 12 }, { label: '10', value: 10 }],
            operator: '|',
            result: 14,
            activeBits: [3, 2, 1],
          },
          annotations: ['Any 1 bit stays set'],
        },
      },
      {
        id: 3,
        title: 'XOR toggles differences',
        description: '1100 ^ 1010 = 0110',
        visual: {
          binary: {
            numbers: [{ label: '12', value: 12 }, { label: '10', value: 10 }],
            operator: '^',
            result: 6,
            activeBits: [2, 1],
          },
          annotations: ['Different bits become 1'],
        },
      },
    ],
  },
  {
    id: 'shifts-masks',
    title: 'Shifts & Masks',
    insight: 'Shifts move bit positions; masks let you test, set, or toggle specific bits in O(1).',
    steps: [
      {
        id: 1,
        title: 'Left shift',
        description: 'Shift left by 1 doubles the value.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            operator: '<<',
            result: 10,
            activeBits: [3, 1],
          },
          annotations: ['5 << 1 = 10'],
        },
      },
      {
        id: 2,
        title: 'Right shift',
        description: 'Shift right by 1 halves (floor).',
        visual: {
          binary: {
            numbers: [{ label: '10', value: 10 }],
            operator: '>>',
            result: 5,
            activeBits: [2, 0],
          },
          annotations: ['10 >> 1 = 5'],
        },
      },
      {
        id: 3,
        title: 'Test a bit',
        description: 'Use AND with a mask to check a bit.',
        visual: {
          binary: {
            numbers: [{ label: '10', value: 10 }, { label: '1<<1', value: 2 }],
            operator: '&',
            result: 2,
            activeBits: [1],
          },
          annotations: ['Bit 1 is set'],
        },
      },
      {
        id: 4,
        title: 'Set a bit',
        description: 'Use OR with a mask to set a bit.',
        visual: {
          binary: {
            numbers: [{ label: '8', value: 8 }, { label: '1<<1', value: 2 }],
            operator: '|',
            result: 10,
            activeBits: [3, 1],
          },
          annotations: ['8 | 2 = 10'],
        },
      },
      {
        id: 5,
        title: 'Toggle a bit',
        description: 'Use XOR with a mask to toggle a bit.',
        visual: {
          binary: {
            numbers: [{ label: '10', value: 10 }, { label: '1<<3', value: 8 }],
            operator: '^',
            result: 2,
            activeBits: [1],
          },
          annotations: ['10 ^ 8 = 2'],
        },
      },
    ],
  },
]

export function BinarySystemViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState<number>(0)
  const [stepIndex, setStepIndex] = useState<number>(0)

  const currentExample: BinaryExample = examples[exampleIndex]
  const currentStep: ConceptStep = currentExample.steps[stepIndex]

  const handleExampleChange = (index: number): void => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = (): void => {
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex((prev) => prev + 1)
    }
  }

  const handlePrev = (): void => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    }
  }

  const handleReset = (): void => {
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {examples.map((example, index) => (
          <button
            key={example.id}
            className={cn(
              'px-4 py-2 text-base font-medium bg-white/5 border border-white/10 rounded-md text-gray-500 transition-all duration-200 hover:bg-white/10 hover:text-white',
              exampleIndex === index && 'bg-[var(--color-brand-primary-15)] border-[var(--color-brand-primary-40)] text-cyan-200'
            )}
            onClick={() => handleExampleChange(index)}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Step {stepIndex + 1} / {currentExample.steps.length}
        </span>
        <span className="text-base font-semibold text-white">{currentStep.title}</span>
      </div>

      <div className="bg-black/30 border border-white/8 rounded-lg p-4">
        <BitManipulationConcept step={currentStep} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="p-4 bg-black/30 rounded-lg border-l-[3px] border-l-[var(--color-brand-primary)]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="text-base text-gray-300 leading-normal">{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      <div className="bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-30)] rounded-lg p-4">
        <span className="inline-block text-xs font-bold tracking-wider uppercase text-cyan-200 mb-2">Why it matters</span>
        <p className="m-0 text-base text-gray-300 leading-normal">{currentExample.insight}</p>
      </div>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />
    </div>
  )
}
