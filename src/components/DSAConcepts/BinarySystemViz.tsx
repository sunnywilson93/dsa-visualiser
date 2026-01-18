'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BitManipulationConcept } from '@/components/ConceptPanel'
import type { ConceptStep } from '@/types'
import styles from './BinarySystemViz.module.css'

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
    <div className={styles.container}>
      <div className={styles.exampleSelector}>
        {examples.map((example, index) => (
          <button
            key={example.id}
            className={`${styles.exampleBtn} ${exampleIndex === index ? styles.active : ''}`}
            onClick={() => handleExampleChange(index)}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className={styles.stepHeader}>
        <span className={styles.stepCount}>
          Step {stepIndex + 1} / {currentExample.steps.length}
        </span>
        <span className={styles.stepTitle}>{currentStep.title}</span>
      </div>

      <div className={styles.visualizationPanel}>
        <BitManipulationConcept step={currentStep} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepText}>{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      <div className={styles.insightBox}>
        <span className={styles.insightLabel}>Why it matters</span>
        <p className={styles.insightText}>{currentExample.insight}</p>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.btnSecondary}
          onClick={handlePrev}
          disabled={stepIndex === 0}
        >
          Prev
        </button>
        <span className={styles.stepCounter}>
          {stepIndex + 1} / {currentExample.steps.length}
        </span>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
        <button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex === currentExample.steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
