import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './TwoPointersViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'converging' | 'same-direction' | 'partition'
type Phase = 'init' | 'compare' | 'move' | 'done'

interface TwoPointerStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  pointers: {
    left: number
    right: number
  }
  decision?: {
    condition: string
    conditionMet: boolean
    action: string
  }
  array: (number | string)[]
  highlightedCells?: number[]
  output?: string[]
}

interface TwoPointerExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: TwoPointerStep[]
  insight: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const variantInfo: Record<Variant, { label: string; description: string }> = {
  converging: {
    label: 'Converging',
    description: 'Two pointers moving towards each other from opposite ends'
  },
  'same-direction': {
    label: 'Same Direction',
    description: 'Two pointers moving in the same direction (slow/fast)'
  },
  partition: {
    label: 'Partition',
    description: 'Pointers partitioning array into regions'
  }
}

const examples: Record<Variant, Record<Level, TwoPointerExample[]>> = {
  converging: {
    beginner: [
      {
        id: 'two-sum-ii',
        title: 'Two Sum II',
        variant: 'converging',
        code: [
          'function twoSum(nums, target) {',
          '  let left = 0',
          '  let right = nums.length - 1',
          '',
          '  while (left < right) {',
          '    const sum = nums[left] + nums[right]',
          '',
          '    if (sum === target) {',
          '      return [left, right]',
          '    } else if (sum < target) {',
          '      left++',
          '    } else {',
          '      right--',
          '    }',
          '  }',
          '  return []',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'We need to find two numbers in this SORTED array that add up to 9. Two pointers let us search efficiently.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [1, 3, 4, 5, 7, 10, 11]
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at the start (index 0, value 1).',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0]
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at the end (index 6, value 11).',
            phase: 'init',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6]
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Check: is left (0) < right (6)? Yes, so we enter the loop.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6]
          },
          {
            id: 4,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[6] = 1 + 11 = 12.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is 12 === 9?',
              conditionMet: false,
              action: 'No match, check if too large or small'
            }
          },
          {
            id: 5,
            codeLine: 9,
            description: 'Sum (12) > target (9). Since array is sorted, we need a smaller sum.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is 12 > 9?',
              conditionMet: true,
              action: 'Move right pointer left to decrease sum'
            }
          },
          {
            id: 6,
            codeLine: 12,
            description: 'Move right pointer left: right-- (6 to 5, now pointing to 10).',
            phase: 'move',
            pointers: { left: 0, right: 5 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 5]
          },
          {
            id: 7,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[5] = 1 + 10 = 11.',
            phase: 'compare',
            pointers: { left: 0, right: 5 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 5],
            decision: {
              condition: 'Is 11 > 9?',
              conditionMet: true,
              action: 'Still too large, move right pointer left again'
            }
          },
          {
            id: 8,
            codeLine: 12,
            description: 'Move right pointer left: right-- (5 to 4, now pointing to 7).',
            phase: 'move',
            pointers: { left: 0, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 4]
          },
          {
            id: 9,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[4] = 1 + 7 = 8.',
            phase: 'compare',
            pointers: { left: 0, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 4],
            decision: {
              condition: 'Is 8 < 9?',
              conditionMet: true,
              action: 'Too small now, move left pointer right to increase sum'
            }
          },
          {
            id: 10,
            codeLine: 10,
            description: 'Move left pointer right: left++ (0 to 1, now pointing to 3).',
            phase: 'move',
            pointers: { left: 1, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 4]
          },
          {
            id: 11,
            codeLine: 5,
            description: 'Calculate sum: nums[1] + nums[4] = 3 + 7 = 10.',
            phase: 'compare',
            pointers: { left: 1, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 4],
            decision: {
              condition: 'Is 10 > 9?',
              conditionMet: true,
              action: 'Too large, move right pointer left'
            }
          },
          {
            id: 12,
            codeLine: 12,
            description: 'Move right pointer left: right-- (4 to 3, now pointing to 5).',
            phase: 'move',
            pointers: { left: 1, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 3]
          },
          {
            id: 13,
            codeLine: 5,
            description: 'Calculate sum: nums[1] + nums[3] = 3 + 5 = 8.',
            phase: 'compare',
            pointers: { left: 1, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 3],
            decision: {
              condition: 'Is 8 < 9?',
              conditionMet: true,
              action: 'Too small, move left pointer right'
            }
          },
          {
            id: 14,
            codeLine: 10,
            description: 'Move left pointer right: left++ (1 to 2, now pointing to 4).',
            phase: 'move',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3]
          },
          {
            id: 15,
            codeLine: 5,
            description: 'Calculate sum: nums[2] + nums[3] = 4 + 5 = 9. This equals our target!',
            phase: 'compare',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3],
            decision: {
              condition: 'Is 9 === 9?',
              conditionMet: true,
              action: 'Found the pair!'
            }
          },
          {
            id: 16,
            codeLine: 8,
            description: 'Return [2, 3]. Found indices of elements that sum to target!',
            phase: 'done',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3],
            output: ['[2, 3]']
          }
        ],
        insight: 'Two pointers on sorted array avoids O(n^2) nested loops - we eliminate candidates from both ends simultaneously.'
      },
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        variant: 'converging',
        code: [
          'function isPalindrome(s) {',
          '  let left = 0',
          '  let right = s.length - 1',
          '',
          '  while (left < right) {',
          '    if (s[left] !== s[right]) {',
          '      return false',
          '    }',
          '    left++',
          '    right--',
          '  }',
          '  return true',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Check if "racecar" is a palindrome. A palindrome reads the same forwards and backwards.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at start (index 0, character "r").',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0]
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at end (index 6, character "r").',
            phase: 'init',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6]
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Check: is left (0) < right (6)? Yes, enter the loop.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6]
          },
          {
            id: 4,
            codeLine: 5,
            description: 'Compare characters: s[0]="r" vs s[6]="r".',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is "r" === "r"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 5,
            codeLine: 8,
            description: 'Move left pointer right: left++ (0 to 1).',
            phase: 'move',
            pointers: { left: 1, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1]
          },
          {
            id: 6,
            codeLine: 9,
            description: 'Move right pointer left: right-- (6 to 5).',
            phase: 'move',
            pointers: { left: 1, right: 5 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1, 5]
          },
          {
            id: 7,
            codeLine: 5,
            description: 'Compare characters: s[1]="a" vs s[5]="a".',
            phase: 'compare',
            pointers: { left: 1, right: 5 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1, 5],
            decision: {
              condition: 'Is "a" === "a"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 8,
            codeLine: 8,
            description: 'Move pointers: left++ (1 to 2), right-- (5 to 4).',
            phase: 'move',
            pointers: { left: 2, right: 4 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [2, 4]
          },
          {
            id: 9,
            codeLine: 5,
            description: 'Compare characters: s[2]="c" vs s[4]="c".',
            phase: 'compare',
            pointers: { left: 2, right: 4 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [2, 4],
            decision: {
              condition: 'Is "c" === "c"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 10,
            codeLine: 8,
            description: 'Move pointers: left++ (2 to 3), right-- (4 to 3). They meet at the center!',
            phase: 'move',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3]
          },
          {
            id: 11,
            codeLine: 4,
            description: 'Check: is left (3) < right (3)? No! Pointers have met or crossed.',
            phase: 'compare',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3]
          },
          {
            id: 12,
            codeLine: 11,
            description: 'All character pairs matched! Return true - "racecar" is a palindrome.',
            phase: 'done',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3],
            output: ['true']
          }
        ],
        insight: 'Converging pointers check symmetry in O(n) time - we only need to check each position once from both ends.'
      }
    ],
    intermediate: [],
    advanced: []
  },
  'same-direction': {
    beginner: [],
    intermediate: [],
    advanced: []
  },
  partition: {
    beginner: [],
    intermediate: [],
    advanced: []
  }
}

export function TwoPointersViz() {
  const [variant, setVariant] = useState<Variant>('converging')
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

  const getPointerLabel = (index: number) => {
    if (!currentStep) return null
    const { left, right } = currentStep.pointers
    if (left === index && right === index) return 'L,R'
    if (left === index) return 'L'
    if (right === index) return 'R'
    return null
  }

  const getCellState = (index: number) => {
    if (!currentStep) return ''
    const { left, right } = currentStep.pointers
    if (currentStep.highlightedCells?.includes(index)) return styles.active
    if (left >= 0 && right >= 0 && index < left) return styles.processed
    if (left >= 0 && right >= 0 && index > right) return styles.processed
    return ''
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

              <div className={styles.arrayContainer}>
                {currentStep.array.map((value, index) => (
                  <div key={index} className={styles.cellWrapper}>
                    <motion.div
                      className={`${styles.cell} ${getCellState(index)}`}
                      initial={false}
                      animate={{
                        scale: currentStep.highlightedCells?.includes(index) ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className={styles.cellValue}>{value}</span>
                      <span className={styles.cellIndex}>{index}</span>
                    </motion.div>
                    <AnimatePresence mode="wait">
                      {getPointerLabel(index) && (
                        <motion.div
                          key={`pointer-${index}-${getPointerLabel(index)}`}
                          className={styles.pointerContainer}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className={styles.pointerArrow}>{'\u2191'}</span>
                          <span className={styles.pointerLabel}>{getPointerLabel(index)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
