import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import { LevelSelector, type Level, defaultLevelConfig } from '@/components/ui/LevelSelector'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { ExampleTabs } from '@/components/ui/ExampleTabs'

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

const variantConfig: Record<Variant, { label: string; description: string }> = {
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

const variants: Variant[] = ['xor-tricks', 'bit-masks', 'shift-operations']
const levels: Level[] = ['beginner', 'intermediate', 'advanced']

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
    beginner: [],
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

  const getBitSizeClasses = (bitWidth: 4 | 8 | 16 | 32) => {
    switch (bitWidth) {
      case 4:
      case 8:
        return 'w-8 h-8 text-sm'
      case 16:
        return 'w-[18px] h-[18px] text-xs'
      case 32:
        return 'w-3.5 h-3.5 text-[6px]'
      default:
        return 'w-8 h-8 text-sm'
    }
  }

  const getBitPositionClasses = (bitWidth: 4 | 8 | 16 | 32) => {
    switch (bitWidth) {
      case 4:
      case 8:
        return 'w-8 text-xs'
      case 16:
        return 'w-[18px] text-[10px]'
      case 32:
        return 'w-3.5 text-[6px]'
      default:
        return 'w-8 text-xs'
    }
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
      <div className={cn('flex items-center justify-center gap-2', isResult && 'pt-1')}>
        <div className="min-w-[60px] text-right font-mono text-sm font-semibold text-amber-500">
          {label}
        </div>
        <div className="min-w-12 text-right font-mono text-sm text-gray-400">
          {value}
        </div>
        <span className="font-mono text-sm text-gray-600">=</span>
        <div className="flex gap-0.5">
          {binaryStr.split('').map((bit, i) => {
            const bitPosition = bitWidth - 1 - i
            const isActive = activeBits.includes(bitPosition)
            const isOne = bit === '1'

            return (
              <motion.div
                key={i}
                className={cn(
                  'flex items-center justify-center rounded font-mono font-semibold transition-all',
                  getBitSizeClasses(bitWidth),
                  isOne
                    ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-500'
                    : 'border border-white/[0.08] bg-white-5 text-gray-600',
                  isActive && 'scale-110 border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                )}
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
    <div className="mt-1 flex items-center justify-center gap-2">
      <div className="min-w-[120px]" />
      <div className="flex gap-0.5">
        {Array.from({ length: bitWidth }, (_, i) => bitWidth - 1 - i).map((pos) => (
          <span
            key={pos}
            className={cn(
              'flex items-center justify-center font-mono',
              getBitPositionClasses(bitWidth),
              activeBits.includes(pos) ? 'font-semibold text-emerald-500' : 'text-gray-600'
            )}
          >
            {pos}
          </span>
        ))}
      </div>
    </div>
  )

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
        <div className="rounded-xl border border-white/[0.08] bg-black-30 p-8 text-center">
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
                    className="flex flex-col gap-1 rounded-lg border border-white/[0.08] bg-black-40 p-4"
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

              {/* Operator Badge */}
              {currentStep.operator && (
                <div className="flex justify-center">
                  <span className="rounded-full border border-brand-primary/40 bg-brand-primary/15 px-4 py-1 font-mono text-sm font-semibold text-brand-primary">
                    {getOperatorSymbol(currentStep.operator)}
                  </span>
                </div>
              )}

              {/* Bit Grid */}
              <div className="relative overflow-x-auto rounded-xl border border-white/[0.08] bg-black-40 p-4 md:p-6">
                {/* Bit Width Badge */}
                <div className="absolute -top-0 right-2 -translate-y-1/2 rounded-full border border-white/[0.08] bg-white/[0.08] px-2 py-0.5 font-mono text-xs text-gray-500">
                  {currentStep.bitWidth}-bit
                </div>

                <div className="flex flex-col gap-2">
                  {currentStep.numbers.map((num, idx) => (
                    <div key={num.label}>
                      {renderBitRow(
                        num.label,
                        num.value,
                        currentStep.bitWidth,
                        currentStep.activeBits,
                        false
                      )}
                    </div>
                  ))}

                  {/* Operator Row */}
                  {currentStep.operator && (
                    <div className="flex justify-center py-1">
                      <span className="font-mono text-lg font-bold text-brand-primary">
                        {currentStep.operator}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  {currentStep.result !== undefined && (
                    <div
                      className="my-1 h-px"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 20%, rgba(59,130,246,0.5) 80%, transparent 100%)'
                      }}
                    />
                  )}

                  {/* Result Row */}
                  {currentStep.result !== undefined && (
                    <div className="pt-1">
                      {renderBitRow(
                        'result',
                        currentStep.result,
                        currentStep.bitWidth,
                        currentStep.activeBits,
                        true
                      )}
                    </div>
                  )}
                </div>

                {/* Bit Positions */}
                {renderBitPositions(currentStep.bitWidth, currentStep.activeBits)}
              </div>

              {/* Output Box */}
              {currentStep.output && currentStep.output.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-black-40">
                  <div className="bg-white-5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
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
