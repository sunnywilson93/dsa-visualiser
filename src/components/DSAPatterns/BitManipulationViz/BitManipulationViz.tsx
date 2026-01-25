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
    intermediate: [
      {
        id: 'missing-number',
        title: 'Missing Number',
        variant: 'xor-tricks',
        code: [
          'function missingNumber(nums) {',
          '  let result = nums.length',
          '',
          '  for (let i = 0; i < nums.length; i++) {',
          '    result ^= i ^ nums[i]',
          '  }',
          '',
          '  return result',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Find the missing number from 0 to n. XOR trick: pair all indices with values, unpaired one remains.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: [3, 0, 1]', 'Range: 0 to 3, one is missing']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize result = nums.length = 3. This represents index 3 (which has no value to pair with).',
            phase: 'show-binary',
            numbers: [{ label: 'result', value: 3 }],
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['result = 3 = 00000011', 'Index 3 starts unpaired']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Loop i=0: XOR result with index 0 and value nums[0]=3.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 3 },
              { label: 'i', value: 0 },
              { label: 'nums[0]', value: 3 }
            ],
            bitWidth: 8,
            output: ['i = 0, nums[0] = 3', 'result ^= 0 ^ 3']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'First: result ^ i = 3 ^ 0 = 3. XOR with 0 leaves value unchanged.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 3 },
              { label: 'i', value: 0 }
            ],
            operator: '^',
            result: 3,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'XOR with 0',
              conditionMet: true,
              action: 'a ^ 0 = a (no change)'
            },
            output: ['3 ^ 0 = 3']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'Then: 3 ^ nums[0] = 3 ^ 3 = 0. The 3s cancel each other!',
            phase: 'apply-operation',
            numbers: [
              { label: 'temp', value: 3 },
              { label: 'nums[0]', value: 3 }
            ],
            operator: '^',
            result: 0,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'XOR same values',
              conditionMet: true,
              action: 'a ^ a = 0 (cancels!)'
            },
            output: ['3 ^ 3 = 0', 'Value 3 paired with index 3!']
          },
          {
            id: 5,
            codeLine: 3,
            description: 'Loop i=1: result=0, XOR with index 1 and value nums[1]=0.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 0 },
              { label: 'i', value: 1 },
              { label: 'nums[1]', value: 0 }
            ],
            bitWidth: 8,
            output: ['i = 1, nums[1] = 0', 'result ^= 1 ^ 0']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'result ^ i ^ nums[i] = 0 ^ 1 ^ 0 = 1. Index 1 has no matching value yet.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 0 },
              { label: 'i', value: 1 }
            ],
            operator: '^',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: '0 ^ 1 ^ 0',
              conditionMet: true,
              action: 'Index 1 now in result'
            },
            output: ['0 ^ 1 = 1, then 1 ^ 0 = 1', 'result = 1']
          },
          {
            id: 7,
            codeLine: 3,
            description: 'Loop i=2: result=1, XOR with index 2 and value nums[2]=1.',
            phase: 'read-value',
            numbers: [
              { label: 'result', value: 1 },
              { label: 'i', value: 2 },
              { label: 'nums[2]', value: 1 }
            ],
            bitWidth: 8,
            output: ['i = 2, nums[2] = 1', 'result ^= 2 ^ 1']
          },
          {
            id: 8,
            codeLine: 4,
            description: 'First: result ^ i = 1 ^ 2 = 3 (binary: 01 ^ 10 = 11).',
            phase: 'apply-operation',
            numbers: [
              { label: 'result', value: 1 },
              { label: 'i', value: 2 }
            ],
            operator: '^',
            result: 3,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: '1 ^ 2',
              conditionMet: true,
              action: 'Bit 0 and bit 1 differ'
            },
            output: ['1 ^ 2 = 3']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'Then: 3 ^ nums[2] = 3 ^ 1 = 2. Value 1 cancels with index 1 from earlier!',
            phase: 'apply-operation',
            numbers: [
              { label: 'temp', value: 3 },
              { label: 'nums[2]', value: 1 }
            ],
            operator: '^',
            result: 2,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: '3 ^ 1',
              conditionMet: true,
              action: 'Bit 0 cancels, bit 1 remains'
            },
            output: ['3 ^ 1 = 2', 'Value 1 paired, index 2 unpaired']
          },
          {
            id: 10,
            codeLine: 4,
            description: 'result = 2. Index 2 has no matching value in the array!',
            phase: 'show-result',
            numbers: [{ label: 'result', value: 2 }],
            activeBits: [1],
            bitWidth: 8,
            output: ['result = 2 = 00000010', 'Only unpaired number remains']
          },
          {
            id: 11,
            codeLine: 7,
            description: 'Return 2. All paired indices/values canceled, leaving only the missing number!',
            phase: 'done',
            numbers: [{ label: 'result', value: 2 }],
            bitWidth: 8,
            output: ['return 2', '2 is missing from [3, 0, 1]!']
          }
        ],
        insight: 'XOR all indices 0..n with all values. Each index-value pair cancels (a ^ a = 0), leaving only the missing number unpaired.'
      }
    ],
    advanced: [
      {
        id: 'single-number-ii',
        title: 'Single Number II',
        variant: 'xor-tricks',
        code: [
          'function singleNumber(nums) {',
          '  let ones = 0, twos = 0',
          '',
          '  for (const num of nums) {',
          '    ones = (ones ^ num) & ~twos',
          '    twos = (twos ^ num) & ~ones',
          '  }',
          '',
          '  return ones',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Every element appears 3 times except one. Track bits seen once (ones) and twice (twos).',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: [2, 2, 3, 2]', 'Find: element appearing once']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize ones = 0 (bits seen 1 time) and twos = 0 (bits seen 2 times).',
            phase: 'show-binary',
            numbers: [
              { label: 'ones', value: 0 },
              { label: 'twos', value: 0 }
            ],
            bitWidth: 8,
            output: ['ones = 0, twos = 0', 'Track bit occurrences mod 3']
          },
          {
            id: 2,
            codeLine: 3,
            description: 'Process num = 2 (binary: 00000010). Bit 1 appears for the first time.',
            phase: 'show-binary',
            numbers: [
              { label: 'num', value: 2 },
              { label: 'ones', value: 0 },
              { label: 'twos', value: 0 }
            ],
            activeBits: [1],
            bitWidth: 8,
            output: ['Processing: num = 2', 'First occurrence of value 2']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'ones = (0 ^ 2) & ~0 = 2 & 1 = 2. Bit 1 is now in ones (seen once).',
            phase: 'apply-operation',
            numbers: [
              { label: 'ones^num', value: 2 },
              { label: '~twos', value: 255 }
            ],
            operator: '&',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: '(ones ^ num) & ~twos',
              conditionMet: true,
              action: 'Bit 1 added to ones'
            },
            output: ['(0 ^ 2) & ~0 = 2', 'ones = 2']
          },
          {
            id: 4,
            codeLine: 5,
            description: 'twos = (0 ^ 2) & ~2 = 2 & 253 = 0. Bit 1 not in twos (masked by ones).',
            phase: 'apply-operation',
            numbers: [
              { label: 'twos^num', value: 2 },
              { label: '~ones', value: 253 }
            ],
            operator: '&',
            result: 0,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: '(twos ^ num) & ~ones',
              conditionMet: false,
              action: 'Bit 1 blocked by ones'
            },
            output: ['(0 ^ 2) & ~2 = 0', 'twos = 0']
          },
          {
            id: 5,
            codeLine: 3,
            description: 'Process num = 2 again (second occurrence). Currently ones=2, twos=0.',
            phase: 'show-binary',
            numbers: [
              { label: 'num', value: 2 },
              { label: 'ones', value: 2 },
              { label: 'twos', value: 0 }
            ],
            activeBits: [1],
            bitWidth: 8,
            output: ['Processing: num = 2 (2nd time)', 'Bit 1 currently in ones']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'ones = (2 ^ 2) & ~0 = 0 & 255 = 0. Bit 1 leaves ones (XOR cancels).',
            phase: 'apply-operation',
            numbers: [
              { label: 'ones^num', value: 0 },
              { label: '~twos', value: 255 }
            ],
            operator: '&',
            result: 0,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: '(ones ^ num) & ~twos',
              conditionMet: false,
              action: 'Bit 1 removed from ones'
            },
            output: ['(2 ^ 2) & ~0 = 0', 'ones = 0']
          },
          {
            id: 7,
            codeLine: 5,
            description: 'twos = (0 ^ 2) & ~0 = 2 & 255 = 2. Bit 1 moves to twos (seen twice).',
            phase: 'apply-operation',
            numbers: [
              { label: 'twos^num', value: 2 },
              { label: '~ones', value: 255 }
            ],
            operator: '&',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: '(twos ^ num) & ~ones',
              conditionMet: true,
              action: 'Bit 1 added to twos'
            },
            output: ['(0 ^ 2) & ~0 = 2', 'twos = 2']
          },
          {
            id: 8,
            codeLine: 3,
            description: 'Process num = 3 (binary: 00000011). New number with bits 0 and 1.',
            phase: 'show-binary',
            numbers: [
              { label: 'num', value: 3 },
              { label: 'ones', value: 0 },
              { label: 'twos', value: 2 }
            ],
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['Processing: num = 3', 'Bits 0 and 1 set']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'ones = (0 ^ 3) & ~2 = 3 & 253 = 1. Only bit 0 goes to ones (bit 1 blocked by twos).',
            phase: 'apply-operation',
            numbers: [
              { label: 'ones^num', value: 3 },
              { label: '~twos', value: 253 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: '3 & ~2',
              conditionMet: true,
              action: 'Bit 0 to ones, bit 1 blocked'
            },
            output: ['(0 ^ 3) & ~2 = 1', 'ones = 1 (bit 0 only)']
          },
          {
            id: 10,
            codeLine: 5,
            description: 'twos = (2 ^ 3) & ~1 = 1 & 254 = 0. Bit 1 leaves twos (third occurrence clears).',
            phase: 'apply-operation',
            numbers: [
              { label: 'twos^num', value: 1 },
              { label: '~ones', value: 254 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'Third occurrence',
              conditionMet: true,
              action: 'Bit 1 cleared from twos'
            },
            output: ['(2 ^ 3) & ~1 = 0', 'twos = 0, bit 1 cleared!']
          },
          {
            id: 11,
            codeLine: 3,
            description: 'Process num = 2 (third occurrence). ones=1, twos=0.',
            phase: 'show-binary',
            numbers: [
              { label: 'num', value: 2 },
              { label: 'ones', value: 1 },
              { label: 'twos', value: 0 }
            ],
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['Processing: num = 2 (3rd time)', 'This completes the triple']
          },
          {
            id: 12,
            codeLine: 4,
            description: 'ones = (1 ^ 2) & ~0 = 3 & 255 = 3. Wait, this adds bit 1 to ones temporarily.',
            phase: 'apply-operation',
            numbers: [
              { label: 'ones^num', value: 3 },
              { label: '~twos', value: 255 }
            ],
            operator: '&',
            result: 3,
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['(1 ^ 2) & ~0 = 3', 'ones = 3 (temporary)']
          },
          {
            id: 13,
            codeLine: 5,
            description: 'twos = (0 ^ 2) & ~3 = 2 & 252 = 0. Bit 1 blocked by ones. Both ones and twos reject it!',
            phase: 'apply-operation',
            numbers: [
              { label: 'twos^num', value: 2 },
              { label: '~ones', value: 252 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'Third occurrence logic',
              conditionMet: true,
              action: 'Value 2 now appears 3x'
            },
            output: ['(0 ^ 2) & ~3 = 0', 'twos = 0']
          },
          {
            id: 14,
            codeLine: 4,
            description: 'Correction: ones recalculated. Since twos=0, ones = 3 & ~0 = 3. But bit 1 appeared 3x...',
            phase: 'show-result',
            numbers: [
              { label: 'ones', value: 3 },
              { label: 'twos', value: 0 }
            ],
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['State: ones=3, twos=0', 'Hmm, we expected ones=3']
          },
          {
            id: 15,
            codeLine: 8,
            description: 'Return ones = 3. The single number appearing once is 3!',
            phase: 'done',
            numbers: [{ label: 'ones', value: 3 }],
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['return 3', '3 appears once, 2 appears 3x!']
          }
        ],
        insight: 'Track bits appearing 1x (ones) and 2x (twos). Third appearance clears both. After processing, ones holds the unique number.'
      }
    ]
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
    intermediate: [
      {
        id: 'counting-bits',
        title: 'Counting Bits',
        variant: 'bit-masks',
        code: [
          'function hammingWeight(n) {',
          '  let count = 0',
          '',
          '  while (n !== 0) {',
          '    count += n & 1',
          '    n = n >> 1',
          '  }',
          '',
          '  return count',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Count the number of 1-bits (set bits) in a number. Also called Hamming Weight.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: n = 11', 'Count: how many 1-bits?']
          },
          {
            id: 1,
            codeLine: 0,
            description: 'n = 11 in binary: 00001011. We can see bits 0, 1, and 3 are set (three 1s).',
            phase: 'show-binary',
            numbers: [{ label: 'n', value: 11 }],
            activeBits: [0, 1, 3],
            bitWidth: 8,
            output: ['n = 11 = 00001011', '1-bits at positions 0, 1, 3']
          },
          {
            id: 2,
            codeLine: 1,
            description: 'Initialize count = 0. We will increment this for each 1-bit found.',
            phase: 'show-binary',
            numbers: [{ label: 'count', value: 0 }],
            bitWidth: 8,
            output: ['count = 0']
          },
          {
            id: 3,
            codeLine: 3,
            description: 'While loop: n = 11 !== 0, so enter loop. Check the lowest bit.',
            phase: 'read-value',
            numbers: [{ label: 'n', value: 11 }],
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'Is n !== 0?',
              conditionMet: true,
              action: 'Yes (11 !== 0), enter loop'
            },
            output: ['n = 11 !== 0', 'Check lowest bit (position 0)']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'n & 1 = 11 & 1 = 1. The mask 00000001 isolates bit 0, which is 1.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 11 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'AND with 1 (bit mask)',
              conditionMet: true,
              action: 'Bit 0 is 1, add to count'
            },
            output: ['11 & 1 = 1', 'count += 1, count = 1']
          },
          {
            id: 5,
            codeLine: 5,
            description: 'Right shift: n = n >> 1 = 11 >> 1 = 5. Bits shift right, lowest bit falls off.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 11 }],
            operator: '>>',
            result: 5,
            activeBits: [0, 1, 2, 3],
            bitWidth: 8,
            decision: {
              condition: 'Right shift by 1',
              conditionMet: true,
              action: 'Bit 0 removed, all bits shift right'
            },
            output: ['11 >> 1 = 5', 'n = 5 = 00000101']
          },
          {
            id: 6,
            codeLine: 3,
            description: 'Loop continues: n = 5 !== 0. Check next lowest bit.',
            phase: 'read-value',
            numbers: [{ label: 'n', value: 5 }],
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'Is n !== 0?',
              conditionMet: true,
              action: 'Yes (5 !== 0), continue'
            },
            output: ['n = 5', 'count = 1']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'n & 1 = 5 & 1 = 1. Bit 0 is 1, so count becomes 2.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 5 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'n & 1',
              conditionMet: true,
              action: 'Bit 0 is 1, add to count'
            },
            output: ['5 & 1 = 1', 'count = 2']
          },
          {
            id: 8,
            codeLine: 5,
            description: 'Right shift: n = 5 >> 1 = 2. Now n = 00000010.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 5 }],
            operator: '>>',
            result: 2,
            activeBits: [0, 1, 2],
            bitWidth: 8,
            output: ['5 >> 1 = 2', 'n = 2 = 00000010']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'n & 1 = 2 & 1 = 0. Bit 0 is 0, count stays at 2.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 2 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'n & 1',
              conditionMet: false,
              action: 'Bit 0 is 0, skip'
            },
            output: ['2 & 1 = 0', 'count = 2 (no change)']
          },
          {
            id: 10,
            codeLine: 5,
            description: 'Right shift: n = 2 >> 1 = 1. One more bit to check.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 2 }],
            operator: '>>',
            result: 1,
            activeBits: [0, 1],
            bitWidth: 8,
            output: ['2 >> 1 = 1', 'n = 1 = 00000001']
          },
          {
            id: 11,
            codeLine: 4,
            description: 'n & 1 = 1 & 1 = 1. Final 1-bit found! count becomes 3.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 1 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'n & 1',
              conditionMet: true,
              action: 'Bit 0 is 1, add to count'
            },
            output: ['1 & 1 = 1', 'count = 3']
          },
          {
            id: 12,
            codeLine: 5,
            description: 'Right shift: n = 1 >> 1 = 0. All bits processed.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 1 }],
            operator: '>>',
            result: 0,
            activeBits: [0],
            bitWidth: 8,
            output: ['1 >> 1 = 0', 'n = 0, loop will exit']
          },
          {
            id: 13,
            codeLine: 8,
            description: 'Return count = 3. The number 11 (00001011) has exactly 3 set bits.',
            phase: 'done',
            numbers: [{ label: 'count', value: 3 }],
            bitWidth: 8,
            output: ['return 3', '11 has 3 one-bits!']
          }
        ],
        insight: 'Check lowest bit with n & 1, then right shift to check next bit. Repeat until n becomes 0. Each shift "pops off" the rightmost bit.'
      }
    ],
    advanced: [
      {
        id: 'subset-generation',
        title: 'Subset Generation',
        variant: 'bit-masks',
        code: [
          'function subsets(nums) {',
          '  const n = nums.length',
          '  const result = []',
          '',
          '  for (let mask = 0; mask < (1 << n); mask++) {',
          '    const subset = []',
          '    for (let i = 0; i < n; i++) {',
          '      if (mask & (1 << i)) subset.push(nums[i])',
          '    }',
          '    result.push(subset)',
          '  }',
          '  return result',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Generate all subsets using bit masking. Each bit represents include/exclude.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 4,
            output: ['Input: nums = [a, b, c]', '2^3 = 8 possible subsets']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'n = 3 elements. We will iterate mask from 0 to 7 (000 to 111).',
            phase: 'show-binary',
            numbers: [{ label: '1 << n', value: 8 }],
            bitWidth: 4,
            output: ['n = 3, 1 << 3 = 8', 'Masks: 0 to 7']
          },
          {
            id: 2,
            codeLine: 4,
            description: 'mask = 0 (binary: 000). No bits set means no elements included.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 0 }],
            bitWidth: 4,
            decision: {
              condition: 'Which bits are set?',
              conditionMet: false,
              action: 'None - empty subset'
            },
            output: ['mask = 0 = 000', 'subset = []']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'mask = 1 (binary: 001). Bit 0 set means include nums[0] = a.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 1 }],
            activeBits: [0],
            bitWidth: 4,
            decision: {
              condition: 'mask & (1 << 0)?',
              conditionMet: true,
              action: 'Bit 0 set, include a'
            },
            output: ['mask = 1 = 001', 'subset = [a]']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'mask = 2 (binary: 010). Bit 1 set means include nums[1] = b.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 2 }],
            activeBits: [1],
            bitWidth: 4,
            decision: {
              condition: 'mask & (1 << 1)?',
              conditionMet: true,
              action: 'Bit 1 set, include b'
            },
            output: ['mask = 2 = 010', 'subset = [b]']
          },
          {
            id: 5,
            codeLine: 4,
            description: 'mask = 3 (binary: 011). Bits 0 and 1 set means include a and b.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 3 }],
            activeBits: [0, 1],
            bitWidth: 4,
            decision: {
              condition: 'Which bits are set?',
              conditionMet: true,
              action: 'Bits 0,1 - include a,b'
            },
            output: ['mask = 3 = 011', 'subset = [a, b]']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'mask = 4 (binary: 100). Bit 2 set means include nums[2] = c.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 4 }],
            activeBits: [2],
            bitWidth: 4,
            decision: {
              condition: 'mask & (1 << 2)?',
              conditionMet: true,
              action: 'Bit 2 set, include c'
            },
            output: ['mask = 4 = 100', 'subset = [c]']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'mask = 5 (binary: 101). Bits 0 and 2 set means include a and c.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 5 }],
            activeBits: [0, 2],
            bitWidth: 4,
            decision: {
              condition: 'Which bits are set?',
              conditionMet: true,
              action: 'Bits 0,2 - include a,c'
            },
            output: ['mask = 5 = 101', 'subset = [a, c]']
          },
          {
            id: 8,
            codeLine: 4,
            description: 'mask = 6 (binary: 110). Bits 1 and 2 set means include b and c.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 6 }],
            activeBits: [1, 2],
            bitWidth: 4,
            decision: {
              condition: 'Which bits are set?',
              conditionMet: true,
              action: 'Bits 1,2 - include b,c'
            },
            output: ['mask = 6 = 110', 'subset = [b, c]']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'mask = 7 (binary: 111). All bits set means include all elements.',
            phase: 'show-binary',
            numbers: [{ label: 'mask', value: 7 }],
            activeBits: [0, 1, 2],
            bitWidth: 4,
            decision: {
              condition: 'All bits set?',
              conditionMet: true,
              action: 'Full set - include a,b,c'
            },
            output: ['mask = 7 = 111', 'subset = [a, b, c]']
          },
          {
            id: 10,
            codeLine: 7,
            description: 'Check inclusion: mask & (1 << i). If bit i is set, include nums[i].',
            phase: 'apply-operation',
            numbers: [
              { label: 'mask', value: 5 },
              { label: '1 << 0', value: 1 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0],
            bitWidth: 4,
            decision: {
              condition: '5 & 1 = ?',
              conditionMet: true,
              action: 'Non-zero, include nums[0]'
            },
            output: ['Example: mask=5, i=0', '5 & 1 = 1 (include a)']
          },
          {
            id: 11,
            codeLine: 7,
            description: 'Continue check: 5 & (1 << 1) = 5 & 2 = 0. Bit 1 not set, skip b.',
            phase: 'apply-operation',
            numbers: [
              { label: 'mask', value: 5 },
              { label: '1 << 1', value: 2 }
            ],
            operator: '&',
            result: 0,
            activeBits: [1],
            bitWidth: 4,
            decision: {
              condition: '5 & 2 = ?',
              conditionMet: false,
              action: 'Zero, skip nums[1]'
            },
            output: ['5 & 2 = 0', 'Skip b']
          },
          {
            id: 12,
            codeLine: 11,
            description: 'All 8 subsets generated: [], [a], [b], [a,b], [c], [a,c], [b,c], [a,b,c].',
            phase: 'done',
            numbers: [{ label: 'total', value: 8 }],
            bitWidth: 4,
            output: ['return result', '8 subsets generated!']
          }
        ],
        insight: 'Each bit position represents include/exclude for that element. 2^n masks enumerate all 2^n possible subsets. Bit manipulation makes subset generation O(n * 2^n).'
      }
    ]
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
    intermediate: [
      {
        id: 'reverse-bits',
        title: 'Reverse Bits',
        variant: 'shift-operations',
        code: [
          'function reverseBits(n) {',
          '  let result = 0',
          '',
          '  for (let i = 0; i < 8; i++) {',
          '    result = (result << 1) | (n & 1)',
          '    n = n >> 1',
          '  }',
          '',
          '  return result',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Reverse the bits of a number. Extract from right of input, insert from left into result.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: n = 13', 'Goal: reverse its 8-bit representation']
          },
          {
            id: 1,
            codeLine: 0,
            description: 'n = 13 in binary: 00001101. We want to produce 10110000 (176).',
            phase: 'show-binary',
            numbers: [{ label: 'n', value: 13 }],
            activeBits: [0, 2, 3],
            bitWidth: 8,
            output: ['n = 13 = 00001101', 'Reversed: 10110000 = 176']
          },
          {
            id: 2,
            codeLine: 1,
            description: 'Initialize result = 0. Bits will be shifted in from the left.',
            phase: 'show-binary',
            numbers: [
              { label: 'n', value: 13 },
              { label: 'result', value: 0 }
            ],
            bitWidth: 8,
            output: ['result = 0']
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Iteration 1: Extract n & 1 = 13 & 1 = 1 (lowest bit is 1).',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 13 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'Extract lowest bit',
              conditionMet: true,
              action: 'n & 1 = 1'
            },
            output: ['13 & 1 = 1', 'Extracted bit: 1']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'result = (0 << 1) | 1 = 0 | 1 = 1. Shift result left, OR in extracted bit.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result<<1', value: 0 },
              { label: 'bit', value: 1 }
            ],
            operator: '|',
            result: 1,
            activeBits: [0],
            bitWidth: 8,
            output: ['(0 << 1) | 1 = 1', 'result = 1']
          },
          {
            id: 5,
            codeLine: 5,
            description: 'Shift n right: n = 13 >> 1 = 6. Processed bit falls off.',
            phase: 'apply-operation',
            numbers: [{ label: 'n', value: 13 }],
            operator: '>>',
            result: 6,
            activeBits: [0],
            bitWidth: 8,
            output: ['13 >> 1 = 6', 'n = 6 = 00000110']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'Iteration 2: n & 1 = 6 & 1 = 0. Lowest bit is 0.',
            phase: 'apply-operation',
            numbers: [
              { label: 'n', value: 6 },
              { label: 'mask', value: 1 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0],
            bitWidth: 8,
            decision: {
              condition: 'Extract lowest bit',
              conditionMet: false,
              action: 'n & 1 = 0'
            },
            output: ['6 & 1 = 0', 'Extracted bit: 0']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'result = (1 << 1) | 0 = 2 | 0 = 2. Previous bits shift left.',
            phase: 'apply-operation',
            numbers: [
              { label: 'result<<1', value: 2 },
              { label: 'bit', value: 0 }
            ],
            operator: '|',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            output: ['(1 << 1) | 0 = 2', 'result = 2 = 00000010']
          },
          {
            id: 8,
            codeLine: 5,
            description: 'n = 6 >> 1 = 3. Continue processing.',
            phase: 'show-result',
            numbers: [
              { label: 'n', value: 3 },
              { label: 'result', value: 2 }
            ],
            bitWidth: 8,
            output: ['n = 3 = 00000011', 'result = 2 = 00000010']
          },
          {
            id: 9,
            codeLine: 4,
            description: 'Iterations 3-4: Extract 1, then 1 from n=3. result becomes 11 (00001011).',
            phase: 'show-result',
            numbers: [
              { label: 'n (after)', value: 0 },
              { label: 'result', value: 11 }
            ],
            activeBits: [0, 1, 3],
            bitWidth: 8,
            output: ['After 4 iterations:', 'result = 11 = 00001011']
          },
          {
            id: 10,
            codeLine: 4,
            description: 'Iterations 5-8: n is 0, so we extract 0s. result shifts left 4 more times.',
            phase: 'show-result',
            numbers: [
              { label: 'result', value: 176 }
            ],
            activeBits: [4, 5, 7],
            bitWidth: 8,
            output: ['After 8 iterations:', 'result = 176 = 10110000']
          },
          {
            id: 11,
            codeLine: 8,
            description: 'Return 176. Original 00001101 reversed to 10110000!',
            phase: 'done',
            numbers: [
              { label: 'original', value: 13 },
              { label: 'reversed', value: 176 }
            ],
            bitWidth: 8,
            output: ['return 176', '13 reversed = 176']
          }
        ],
        insight: 'Extract bits from right of input (n & 1), insert from left into result (result << 1 | bit). Both shift each iteration, bits swap positions.'
      }
    ],
    advanced: [
      {
        id: 'find-two-numbers',
        title: 'Find Two Non-Repeating',
        variant: 'shift-operations',
        code: [
          'function findTwoNumbers(nums) {',
          '  let xorAll = 0',
          '  for (const num of nums) xorAll ^= num',
          '',
          '  const diffBit = xorAll & -xorAll',
          '',
          '  let a = 0, b = 0',
          '  for (const num of nums) {',
          '    if (num & diffBit) a ^= num',
          '    else b ^= num',
          '  }',
          '  return [a, b]',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Array where every element appears twice except two. Find both unique elements.',
            phase: 'read-value',
            numbers: [],
            bitWidth: 8,
            output: ['Input: [1, 2, 1, 3, 2, 5]', 'Find: two unique numbers']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'XOR all elements. Pairs cancel, leaving 3 ^ 5.',
            phase: 'show-binary',
            numbers: [{ label: 'xorAll', value: 0 }],
            bitWidth: 8,
            output: ['xorAll = 0', 'Will XOR all elements']
          },
          {
            id: 2,
            codeLine: 2,
            description: 'After XORing all: 1^2^1^3^2^5 = 3^5 = 6. The 1s and 2s canceled.',
            phase: 'apply-operation',
            numbers: [
              { label: '3', value: 3 },
              { label: '5', value: 5 }
            ],
            operator: '^',
            result: 6,
            activeBits: [1, 2],
            bitWidth: 8,
            decision: {
              condition: 'XOR all elements',
              conditionMet: true,
              action: 'Pairs cancel, 3 ^ 5 remains'
            },
            output: ['1^2^1^3^2^5 = 6', 'xorAll = 6 = 00000110']
          },
          {
            id: 3,
            codeLine: 2,
            description: 'xorAll = 6 (binary: 00000110). Bits 1 and 2 are set - these are where 3 and 5 differ!',
            phase: 'show-binary',
            numbers: [{ label: 'xorAll', value: 6 }],
            activeBits: [1, 2],
            bitWidth: 8,
            decision: {
              condition: 'Set bits meaning',
              conditionMet: true,
              action: 'These bits differ between the two unique numbers'
            },
            output: ['xorAll = 6 = 00000110', 'Bits 1,2 differ in 3 and 5']
          },
          {
            id: 4,
            codeLine: 4,
            description: 'Find lowest set bit: diffBit = xorAll & -xorAll. This isolates rightmost 1-bit.',
            phase: 'show-binary',
            numbers: [
              { label: 'xorAll', value: 6 },
              { label: '-xorAll', value: -6 }
            ],
            activeBits: [1],
            bitWidth: 8,
            output: ['6 in binary: 00000110', '-6 in binary: 11111010']
          },
          {
            id: 5,
            codeLine: 4,
            description: 'diffBit = 6 & -6 = 2. Binary: 00000010. This bit separates 3 from 5.',
            phase: 'apply-operation',
            numbers: [
              { label: 'xorAll', value: 6 },
              { label: '-xorAll', value: -6 }
            ],
            operator: '&',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'Isolate lowest set bit',
              conditionMet: true,
              action: 'diffBit = 2 (bit position 1)'
            },
            output: ['6 & -6 = 2', 'diffBit = 2 = 00000010']
          },
          {
            id: 6,
            codeLine: 4,
            description: 'Why does n & -n work? -n is twos complement: flips bits and adds 1, preserving only lowest 1.',
            phase: 'show-result',
            numbers: [{ label: 'diffBit', value: 2 }],
            activeBits: [1],
            bitWidth: 8,
            output: ['n & -n trick:', 'Isolates rightmost set bit']
          },
          {
            id: 7,
            codeLine: 6,
            description: 'Initialize a = 0, b = 0. Partition numbers by diffBit, XOR each partition.',
            phase: 'show-binary',
            numbers: [
              { label: 'a', value: 0 },
              { label: 'b', value: 0 },
              { label: 'diffBit', value: 2 }
            ],
            bitWidth: 8,
            output: ['a = 0, b = 0', 'Split by bit 1']
          },
          {
            id: 8,
            codeLine: 8,
            description: 'Check 1: 1 & 2 = 0. Bit 1 not set in 1, so 1 goes to group b.',
            phase: 'apply-operation',
            numbers: [
              { label: 'num', value: 1 },
              { label: 'diffBit', value: 2 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'num & diffBit',
              conditionMet: false,
              action: '1 goes to group b'
            },
            output: ['1 & 2 = 0', 'b ^= 1, b = 1']
          },
          {
            id: 9,
            codeLine: 8,
            description: 'Check 2: 2 & 2 = 2. Bit 1 is set in 2, so 2 goes to group a.',
            phase: 'apply-operation',
            numbers: [
              { label: 'num', value: 2 },
              { label: 'diffBit', value: 2 }
            ],
            operator: '&',
            result: 2,
            activeBits: [1],
            bitWidth: 8,
            decision: {
              condition: 'num & diffBit',
              conditionMet: true,
              action: '2 goes to group a'
            },
            output: ['2 & 2 = 2', 'a ^= 2, a = 2']
          },
          {
            id: 10,
            codeLine: 8,
            description: 'Check 3: 3 & 2 = 2. Bit 1 is set in 3, so 3 goes to group a.',
            phase: 'apply-operation',
            numbers: [
              { label: 'num', value: 3 },
              { label: 'diffBit', value: 2 }
            ],
            operator: '&',
            result: 2,
            activeBits: [0, 1],
            bitWidth: 8,
            decision: {
              condition: 'num & diffBit',
              conditionMet: true,
              action: '3 goes to group a'
            },
            output: ['3 & 2 = 2', 'a ^= 3, a = 2 ^ 3 = 1']
          },
          {
            id: 11,
            codeLine: 8,
            description: 'Check 5: 5 & 2 = 0. Bit 1 not set in 5, so 5 goes to group b.',
            phase: 'apply-operation',
            numbers: [
              { label: 'num', value: 5 },
              { label: 'diffBit', value: 2 }
            ],
            operator: '&',
            result: 0,
            activeBits: [0, 2],
            bitWidth: 8,
            decision: {
              condition: 'num & diffBit',
              conditionMet: false,
              action: '5 goes to group b'
            },
            output: ['5 & 2 = 0', 'b ^= 5']
          },
          {
            id: 12,
            codeLine: 8,
            description: 'After all: Group a has [2,1,2,3] and Group b has [1,1,5]. Pairs cancel in each!',
            phase: 'show-result',
            numbers: [
              { label: 'group a', value: 0 },
              { label: 'group b', value: 0 }
            ],
            bitWidth: 8,
            output: ['Group a: 2^1^2^3 = 3', 'Group b: 1^1^5 = 5']
          },
          {
            id: 13,
            codeLine: 8,
            description: 'XOR within groups: a = 2^1^2^3 = 3, b = 1^1^5 = 5. Pairs canceled!',
            phase: 'apply-operation',
            numbers: [
              { label: 'a', value: 3 },
              { label: 'b', value: 5 }
            ],
            bitWidth: 8,
            activeBits: [0, 1, 2],
            decision: {
              condition: 'Within each group',
              conditionMet: true,
              action: 'Pairs cancel, unique remains'
            },
            output: ['a = 3, b = 5', 'The two unique numbers!']
          },
          {
            id: 14,
            codeLine: 11,
            description: 'Return [3, 5]. XOR all to get combined diff, partition by any differing bit, XOR each partition.',
            phase: 'done',
            numbers: [
              { label: 'a', value: 3 },
              { label: 'b', value: 5 }
            ],
            bitWidth: 8,
            output: ['return [3, 5]', 'Found both unique numbers!']
          }
        ],
        insight: 'XOR all gives a^b. Find a bit where they differ (using n & -n). Partition all numbers by that bit - each group has exactly one unique number. XOR each group.'
      }
    ]
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
