import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './BitManipulationViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'xor-tricks' | 'bit-masks' | 'shift-operations'
type Phase = 'read-value' | 'show-binary' | 'apply-operation' | 'show-result' | 'done'

interface BitStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  numbers: BinaryNumber[]
  operator?: '&' | '|' | '^' | '<<' | '>>' | '~'
  result?: number
  activeBits?: number[]
  bitWidth: 4 | 8 | 16 | 32
  decision?: {
    condition: string
    conditionMet: boolean
    action: string
  }
  output?: string[]
}

interface BinaryNumber {
  label: string
  value: number
}

interface BitExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: BitStep[]
  insight: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const variantInfo: Record<Variant, { label: string; description: string }> = {
  'xor-tricks': {
    label: 'XOR Tricks',
    description: 'Use XOR properties to find unique elements'
  },
  'bit-masks': {
    label: 'Bit Masks',
    description: 'Check, set, or clear specific bits'
  },
  'shift-operations': {
    label: 'Shift Operations',
    description: 'Multiply/divide by powers of 2'
  }
}

function toBinary(num: number, bits: number): string {
  if (num < 0) {
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

function getOperatorSymbol(op: string): string {
  const ops: Record<string, string> = {
    '&': 'AND',
    '|': 'OR',
    '^': 'XOR',
    '<<': 'LEFT SHIFT',
    '>>': 'RIGHT SHIFT',
    '~': 'NOT'
  }
  return ops[op] || op
}

const examples: Record<Variant, Record<Level, BitExample[]>> = {
  'xor-tricks': {
    beginner: [
      {
        id: 'single-number',
        title: 'Single Number',
        variant: 'xor-tricks',
        code: [
          'function singleNumber(nums) {',
          '  let result = 0',
          '',
          '  for (const num of nums) {',
          '    result = result ^ num',
          '  }',
          '',
          '  return result',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Find the number that appears only once. XOR trick: a ^ a = 0 and a ^ 0 = a.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: [2, 1, 2]', 'Find: unique number']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize result = 0. In binary: 00000000.',
            phase: 'show-binary',
            numbers: [{ label: 'result', value: 0 }],
            bitWidth: 8,
            output: ['result = 0']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'First iteration: num = 2. In binary: 00000010.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 0 },
              { label: 'num', value: 2 }
            ],
            bitWidth: 8,
            output: ['Processing: num = 2']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'XOR: 0 ^ 2. Bit 1 differs, so it becomes 1 in result.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 0 },
              { label: 'num', value: 2 }
            ],
            operator: '^',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'XOR: different bits become 1',
              conditionMet: true,
              action: 'Bit 1: 0 ^ 1 = 1'
            },
            output: ['0 ^ 2 = 2']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'result = 2 (binary: 00000010).',
            phase: 'show-result',
            numbers: [{ label: 'result', value: 2 }],
            bitWidth: 8,
            output: ['result = 2']
          },
          {
            id: 5,
            codeLine: 3,
            description: 'Second iteration: num = 1. In binary: 00000001.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 2 },
              { label: 'num', value: 1 }
            ],
            bitWidth: 8,
            output: ['Processing: num = 1']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'XOR: 2 ^ 1. Bits 0 and 1 differ between the numbers.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 2 },
              { label: 'num', value: 1 }
            ],
            operator: '^',
            result: 3,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'XOR: different bits become 1',
              conditionMet: true,
              action: 'Bit 0: 0 ^ 1 = 1, Bit 1: 1 ^ 0 = 1'
            },
            output: ['2 ^ 1 = 3']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'result = 3 (binary: 00000011).',
            phase: 'show-result',
            numbers: [{ label: 'result', value: 3 }],
            bitWidth: 8,
            output: ['result = 3']
          },
          {
            id: 8,
            codeLine: 3,
            description: 'Third iteration: num = 2. In binary: 00000010.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 3 },
              { label: 'num', value: 2 }
            ],
            bitWidth: 8,
            output: ['Processing: num = 2 (again)']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'XOR: 3 ^ 2. Bit 1 is same in both, so it cancels to 0!',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 3 },
              { label: 'num', value: 2 }
            ],
            operator: '^',
            result: 1,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'XOR: same bits cancel out',
              conditionMet: true,
              action: 'Bit 1: 1 ^ 1 = 0 (canceled!)'
            },
            output: ['3 ^ 2 = 1', 'The 2s canceled out!']
          },
          {
            id: 10,
            codeLine: 4,
            description: 'result = 1 (binary: 00000001). Only the unique number remains!',
            phase: 'show-result',
            numbers: [{ label: 'result', value: 1 }],
            bitWidth: 8,
            output: ['result = 1']
          },
          {
            id: 11,
            codeLine: 7,
            description: 'Return 1. XOR canceled all pairs, leaving only the single number!',
            phase: 'done',
            numbers: [{ label: 'result', value: 1 }],
            bitWidth: 8,
            output: ['return 1', 'The single number is 1!']
          }
        ],
        insight: 'XOR cancels paired numbers: a ^ a = 0. After XORing all elements, only the single number remains because its pair is missing.'
      }
    ],
    intermediate: [],
    advanced: []
  },
  'bit-masks': {
    beginner: [
      {
        id: 'power-of-two',
        title: 'Power of Two',
        variant: 'bit-masks',
        code: [
          'function isPowerOfTwo(n) {',
          '  if (n <= 0) return false',
          '',
          '  return (n & (n - 1)) === 0',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Check if n = 8 is a power of two. Key insight: powers of 2 have exactly one bit set.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: n = 8', 'Check: is 8 a power of 2?']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Check if n > 0. Since 8 > 0, continue.',
            phase: 'read-value',
            numbers: [{ label: 'n', value: 8 }],
            bitWidth: 8,
            decision: {
              condition: 'Is n > 0?',
              conditionMet: true,
              action: 'Yes (8 > 0), continue'
            },
            output: ['8 > 0, continue']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Show n = 8 in binary: 00001000. Notice only bit 3 is set (single 1-bit).',
            phase: 'show-binary',
            numbers: [{ label: 'n', value: 8 }],
            activeBits: [3],
            bitWidth: 8,
            decision: {
              condition: 'Power of 2 property',
              conditionMet: true,
              action: 'Only ONE bit is set (bit 3)'
            },
            output: ['n = 8 = 00001000', 'Single bit at position 3']
          },
          {
            id: 3,
            codeLine: 3,
            description: 'Calculate n - 1 = 7. In binary: 00000111. All bits below bit 3 become 1.',
            phase: 'show-binary',
            numbers: [
              { label: 'n', value: 8 },
              { label: 'n - 1', value: 7 }
            ],
            activeBits: [0, 1, 2],
            bitWidth: 8,
            decision: {
              condition: 'Subtract 1 effect',
              conditionMet: true,
              action: 'Flips all bits at and below the lowest 1'
            },
            output: ['n - 1 = 7 = 00000111', 'All lower bits become 1']
          },
          {
            id: 4,
            codeLine: 3,
            description: 'Now AND: n & (n - 1) = 8 & 7. Compare bit by bit.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 8 },
              { label: 'n - 1', value: 7 }
            ],
            operator: '&',
            activeBits: [0, 1, 2, 3],
            bitWidth: 8,
            decision: {
              condition: 'AND: both must be 1',
              conditionMet: false,
              action: 'No position has 1 in both numbers!'
            },
            output: ['8 & 7 = ?', '00001000 & 00000111']
          },
          {
            id: 5,
            codeLine: 3,
            description: 'Bit 3: 1 & 0 = 0. Bits 2,1,0: 0 & 1 = 0. All bits become 0!',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 8 },
              { label: 'n - 1', value: 7 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0, 1, 2, 3],
            bitWidth: 8,
            decision: {
              condition: 'AND result',
              conditionMet: true,
              action: 'No overlapping 1-bits!'
            },
            output: ['8 & 7 = 0', 'The 1-bits dont overlap!']
          },
          {
            id: 6,
            codeLine: 3,
            description: 'Result = 0. Since 0 === 0 is true, 8 is a power of two!',
            phase: 'show-result',
            numbers: [{ label: 'result', value: 0 }],
            bitWidth: 8,
            decision: {
              condition: 'Is result === 0?',
              conditionMet: true,
              action: 'Yes! 8 is a power of 2'
            },
            output: ['(8 & 7) === 0', '0 === 0 is true']
          },
          {
            id: 7,
            codeLine: 3,
            description: 'Return true. n & (n-1) clears the lowest set bit. For powers of 2, that leaves 0.',
            phase: 'done',
            numbers: [{ label: 'n', value: 8 }],
            activeBits: [3],
            bitWidth: 8,
            output: ['return true', '8 = 2^3 is a power of two!']
          }
        ],
        insight: 'Power of 2 has exactly one 1-bit. n & (n-1) clears the lowest set bit. If result is 0, n was power of 2 (had only one bit to clear).'
      }
    ],
    intermediate: [],
    advanced: []
  },
  'shift-operations': {
    beginner: [
      {
        id: 'multiply-divide',
        title: 'Multiply & Divide by 2',
        variant: 'shift-operations',
        code: [
          'function multiplyDivide(n) {',
          '  const doubled = n << 1',
          '  const halved = n >> 1',
          '',
          '  return { doubled, halved }',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Learn bit shifts: << multiplies by 2, >> divides by 2. Using n = 5.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: n = 5', 'Goal: double and halve using shifts']
          },
          {
            id: 1,
            codeLine: 0,
            description: 'Show n = 5 in binary: 00000101. Bits 0 and 2 are set.',
            phase: 'show-binary',
            numbers: [{ label: 'n', value: 5 }],
            activeBits: [0, 2],
            bitWidth: 8,
            output: ['n = 5 = 00000101', 'Bits at positions 0 and 2']
          },
          {
            id: 2,
            codeLine: 1,
            description: 'Left shift: n << 1. Every bit moves one position to the left.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 5 }],
            operator: '<<',
            activeBits: [0, 1, 2, 3, 4, 5, 6, 7],
            bitWidth: 8,
            decision: {
              condition: 'Left shift << 1',
              conditionMet: true,
              action: 'All bits move left, 0 fills right'
            },
            output: ['5 << 1 = ?', 'Shifting all bits left by 1']
          },
          {
            id: 3,
            codeLine: 1,
            description: 'Result: 00001010 = 10. The original 1s moved from positions 0,2 to 1,3.',
            phase: 'show-result',
            numbers: [
              { label: 'n', value: 5 },
              { label: 'doubled', value: 10 }
            ],
            operator: '<<',
            result: 10,
            activeBits: [1, 3],
            bitWidth: 8,
            decision: {
              condition: 'Left shift = multiply by 2',
              conditionMet: true,
              action: '5 * 2 = 10'
            },
            output: ['5 << 1 = 10', 'doubled = 10']
          },
          {
            id: 4,
            codeLine: 1,
            description: 'Why does left shift multiply by 2? Each bit position is worth 2x the previous.',
            phase: 'show-result',
            numbers: [{ label: 'doubled', value: 10 }],
            activeBits: [1, 3],
            bitWidth: 8,
            decision: {
              condition: 'Position value doubles each step',
              conditionMet: true,
              action: 'bit0=1, bit1=2, bit2=4, bit3=8...'
            },
            output: ['Original: 2^0 + 2^2 = 1 + 4 = 5', 'Shifted: 2^1 + 2^3 = 2 + 8 = 10']
          },
          {
            id: 5,
            codeLine: 2,
            description: 'Now right shift: n >> 1. Every bit moves one position to the right.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 5 }],
            operator: '>>',
            activeBits: [0, 1, 2, 3, 4, 5, 6, 7],
            bitWidth: 8,
            decision: {
              condition: 'Right shift >> 1',
              conditionMet: true,
              action: 'All bits move right, rightmost bit falls off'
            },
            output: ['5 >> 1 = ?', 'Shifting all bits right by 1']
          },
          {
            id: 6,
            codeLine: 2,
            description: 'Bit 0 (value 1) falls off! Bit 2 moves to position 1.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 5 }],
            operator: '>>',
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'Rightmost bit lost',
              conditionMet: true,
              action: 'Bit 0 (value 1) is discarded'
            },
            output: ['Bit at position 0 falls off', 'This is like integer division']
          },
          {
            id: 7,
            codeLine: 2,
            description: 'Result: 00000010 = 2. The 1 at position 2 moved to position 1.',
            phase: 'show-result',
            numbers: [
              { label: 'n', value: 5 },
              { label: 'halved', value: 2 }
            ],
            operator: '>>',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'Right shift = divide by 2 (floor)',
              conditionMet: true,
              action: 'floor(5 / 2) = 2'
            },
            output: ['5 >> 1 = 2', 'halved = 2']
          },
          {
            id: 8,
            codeLine: 2,
            description: 'Note: 5 / 2 = 2.5, but right shift gives floor(2.5) = 2. The 0.5 was the lost bit.',
            phase: 'show-result',
            numbers: [{ label: 'halved', value: 2 }],
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'Integer division',
              conditionMet: true,
              action: 'Remainder (odd bit) is discarded'
            },
            output: ['5 / 2 = 2.5', '5 >> 1 = 2 (floor)']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'Return { doubled: 10, halved: 2 }. Bit shifts are faster than multiply/divide!',
            phase: 'done',
            numbers: [
              { label: 'doubled', value: 10 },
              { label: 'halved', value: 2 }
            ],
            bitWidth: 8,
            output: ['return { doubled: 10, halved: 2 }', '<< and >> are O(1) operations!']
          }
        ],
        insight: 'Left shift << 1 multiplies by 2 (adds zero on right). Right shift >> 1 divides by 2 (drops rightmost bit). Both are faster than arithmetic!'
      }
    ],
    intermediate: [],
    advanced: []
  }
}

export function BitManipulationViz() {
  const [variant, setVariant] = useState<Variant>('xor-tricks')
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

  const renderBitRow = (
    label: string,
    value: number,
    bitWidth: 4 | 8 | 16 | 32,
    activeBits: number[] = [],
    isResult: boolean = false
  ) => {
    const binaryStr = toBinary(value, bitWidth)

    return (
      <div className={`${styles.bitRow} ${isResult ? styles.resultRow : ''}`}>
        <div className={styles.rowLabel}>{label}</div>
        <div className={styles.decimal}>{value}</div>
        <span className={styles.equals}>=</span>
        <div className={styles.bits}>
          {binaryStr.split('').map((bit, i) => {
            const bitPosition = bitWidth - 1 - i
            const isActive = activeBits.includes(bitPosition)
            const isOne = bit === '1'

            return (
              <motion.div
                key={i}
                className={`${styles.bit} ${isOne ? styles.one : styles.zero} ${isActive ? styles.active : ''} ${styles[`width${bitWidth}`]}`}
                initial={isResult ? { scale: 0.8, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: isResult ? i * 0.05 : 0 }}
              >
                {bit}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBitPositions = (bitWidth: 4 | 8 | 16 | 32, activeBits: number[] = []) => (
    <div className={styles.bitPositions}>
      <div className={styles.bitPositionsSpacer} />
      <div className={styles.bitPositionsRow}>
        {Array.from({ length: bitWidth }, (_, i) => bitWidth - 1 - i).map((pos) => (
          <span
            key={pos}
            className={`${styles.bitPosition} ${activeBits.includes(pos) ? styles.activeBitPos : ''} ${styles[`width${bitWidth}`]}`}
          >
            {pos}
          </span>
        ))}
      </div>
    </div>
  )

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
                {currentStep.operator && (
                  <motion.div
                    key={`operator-${currentStep.id}`}
                    className={styles.operatorBadge}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getOperatorSymbol(currentStep.operator)}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.bitGrid}>
                <div className={styles.bitWidthBadge}>{currentStep.bitWidth}-bit</div>

                {currentStep.numbers.map((num, i) => (
                  <div key={i}>
                    {renderBitRow(num.label, num.value, currentStep.bitWidth, currentStep.activeBits)}
                    {i < currentStep.numbers.length - 1 && currentStep.operator && (
                      <div className={styles.operatorRow}>
                        <span className={styles.operatorSymbol}>{currentStep.operator}</span>
                      </div>
                    )}
                  </div>
                ))}

                {currentStep.result !== undefined && (
                  <>
                    <div className={styles.divider} />
                    {renderBitRow('result', currentStep.result, currentStep.bitWidth, currentStep.activeBits, true)}
                  </>
                )}

                {renderBitPositions(currentStep.bitWidth, currentStep.activeBits)}
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
