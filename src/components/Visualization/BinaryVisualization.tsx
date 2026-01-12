import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ExecutionStep } from '@/types'
import styles from './BinaryVisualization.module.css'

interface BinaryVisualizationProps {
  step: ExecutionStep
}

interface BitOperation {
  operator: string
  operand1: { name: string; value: number }
  operand2?: { name: string; value: number }
  result: number
  type: 'binary' | 'unary' | 'shift'
}

/**
 * Parse step description to extract bit operation details
 */
function parseBitOperation(step: ExecutionStep): BitOperation | null {
  const desc = step.description

  // Match binary operations: "a ^ b: 5 ^ 3 → 6" or "result ^ nums[i]: 0 ^ 4 → 4"
  const binaryMatch = desc.match(
    /([^:]+):\s*(-?\d+)\s*(\^|&|\|)\s*(-?\d+)\s*→\s*(-?\d+)/
  )
  if (binaryMatch) {
    const [, expr, val1, op, val2, result] = binaryMatch
    const parts = expr.split(/\s*[\^&|]\s*/)
    return {
      operator: op,
      operand1: { name: parts[0]?.trim() || 'a', value: parseInt(val1) },
      operand2: { name: parts[1]?.trim() || 'b', value: parseInt(val2) },
      result: parseInt(result),
      type: 'binary',
    }
  }

  // Match shift operations: "n >> 1: 5 >> 1 → 2"
  const shiftMatch = desc.match(
    /([^:]+):\s*(-?\d+)\s*(<<|>>|>>>)\s*(\d+)\s*→\s*(-?\d+)/
  )
  if (shiftMatch) {
    const [, expr, val1, op, val2, result] = shiftMatch
    const parts = expr.split(/\s*(?:<<|>>|>>>)\s*/)
    return {
      operator: op,
      operand1: { name: parts[0]?.trim() || 'n', value: parseInt(val1) },
      operand2: { name: parts[1]?.trim() || 'shift', value: parseInt(val2) },
      result: parseInt(result),
      type: 'shift',
    }
  }

  // Match unary NOT: "~n → -6"
  const unaryMatch = desc.match(/~\s*(\w+).*→\s*(-?\d+)/)
  if (unaryMatch) {
    return {
      operator: '~',
      operand1: { name: unaryMatch[1], value: 0 }, // We don't have the original value easily
      result: parseInt(unaryMatch[2]),
      type: 'unary',
    }
  }

  // Check if description mentions bit operations
  if (desc.includes('XOR') || desc.includes('^')) {
    const nums = desc.match(/-?\d+/g)
    if (nums && nums.length >= 2) {
      return {
        operator: '^',
        operand1: { name: 'a', value: parseInt(nums[0]) },
        operand2: { name: 'b', value: parseInt(nums[1]) },
        result: nums[2] ? parseInt(nums[2]) : parseInt(nums[0]) ^ parseInt(nums[1]),
        type: 'binary',
      }
    }
  }

  return null
}

/**
 * Convert number to binary string with padding
 */
function toBinary(num: number, bits: number = 8): string {
  if (num < 0) {
    // Handle negative numbers (two's complement)
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

/**
 * Get bits that are set (1) in a number
 */
function getSetBits(num: number, bits: number): Set<number> {
  const setBits = new Set<number>()
  for (let i = 0; i < bits; i++) {
    if ((num >> i) & 1) {
      setBits.add(bits - 1 - i)
    }
  }
  return setBits
}

interface BinaryRowProps {
  label: string
  value: number
  bits: number
  highlightBits?: Set<number>
  highlightType?: 'active' | 'result' | 'changed'
}

function BinaryRow({ label, value, bits, highlightBits, highlightType = 'active' }: BinaryRowProps) {
  const binary = toBinary(value, bits)

  return (
    <div className={styles.binaryRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.decimal}>{value}</span>
      <span className={styles.equals}>=</span>
      <div className={styles.bits}>
        {binary.split('').map((bit, idx) => {
          const isHighlighted = highlightBits?.has(idx)
          return (
            <motion.span
              key={idx}
              className={`${styles.bit} ${bit === '1' ? styles.one : styles.zero} ${isHighlighted ? styles[highlightType] : ''}`}
              initial={{ scale: 1 }}
              animate={{
                scale: isHighlighted ? [1, 1.2, 1] : 1,
                transition: { duration: 0.3 }
              }}
            >
              {bit}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

export function BinaryVisualization({ step }: BinaryVisualizationProps) {
  const operation = useMemo(() => parseBitOperation(step), [step])

  if (!operation) {
    return null
  }

  // Determine number of bits to display
  const maxVal = Math.max(
    Math.abs(operation.operand1.value),
    Math.abs(operation.operand2?.value || 0),
    Math.abs(operation.result)
  )
  const bits = Math.max(8, Math.ceil(Math.log2(maxVal + 1) / 4) * 4) // Round up to nearest 4

  // Calculate which bits to highlight
  const op1SetBits = getSetBits(operation.operand1.value, bits)
  const op2SetBits = operation.operand2 ? getSetBits(operation.operand2.value, bits) : new Set<number>()
  const resultSetBits = getSetBits(operation.result, bits)

  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case '^': return 'XOR'
      case '&': return 'AND'
      case '|': return 'OR'
      case '~': return 'NOT'
      case '<<': return 'LEFT SHIFT'
      case '>>': return 'RIGHT SHIFT'
      case '>>>': return 'UNSIGNED RIGHT SHIFT'
      default: return op
    }
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <span className={styles.title}>Bitwise Operation</span>
        <span className={styles.operatorBadge}>{getOperatorSymbol(operation.operator)}</span>
      </div>

      <div className={styles.visualization}>
        {/* First operand */}
        <BinaryRow
          label={operation.operand1.name}
          value={operation.operand1.value}
          bits={bits}
          highlightBits={op1SetBits}
          highlightType="active"
        />

        {/* Operator line */}
        {operation.operand2 && (
          <>
            <div className={styles.operatorRow}>
              <span className={styles.operatorSymbol}>{operation.operator}</span>
            </div>

            {/* Second operand */}
            <BinaryRow
              label={operation.operand2.name}
              value={operation.operand2.value}
              bits={bits}
              highlightBits={op2SetBits}
              highlightType="active"
            />
          </>
        )}

        {/* Divider */}
        <div className={styles.divider} />

        {/* Result */}
        <BinaryRow
          label="result"
          value={operation.result}
          bits={bits}
          highlightBits={resultSetBits}
          highlightType="result"
        />
      </div>

      {/* Bit position labels */}
      <div className={styles.bitLabels}>
        <span className={styles.bitLabelSpacer} />
        <div className={styles.bitPositions}>
          {Array.from({ length: bits }, (_, i) => (
            <span key={i} className={styles.bitPosition}>{bits - 1 - i}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.one}`} />
          <span>1 bit</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.zero}`} />
          <span>0 bit</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.result}`} />
          <span>Result</span>
        </div>
      </div>
    </motion.div>
  )
}
