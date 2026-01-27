'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ExecutionStep } from '@/types'

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

function parseBitOperation(step: ExecutionStep): BitOperation | null {
  const desc = step.description

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

  const unaryMatch = desc.match(/~\s*(\w+).*→\s*(-?\d+)/)
  if (unaryMatch) {
    return {
      operator: '~',
      operand1: { name: unaryMatch[1], value: 0 },
      result: parseInt(unaryMatch[2]),
      type: 'unary',
    }
  }

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

function toBinary(num: number, bits: number = 8): string {
  if (num < 0) {
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

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
    <div className="flex items-center gap-2 font-mono">
      <span className="min-w-16 text-xs text-accent-cyan font-medium text-right overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      <span className="min-w-10 text-xs text-text-primary font-semibold text-right">
        {value}
      </span>
      <span className="text-text-muted text-xs">=</span>
      <div className="flex gap-px">
        {binary.split('').map((bit, idx) => {
          const isHighlighted = highlightBits?.has(idx)
          const baseClass = bit === '1'
            ? 'bg-accent-blue-20 text-accent-blue border-accent-blue'
            : 'bg-bg-secondary text-text-muted border-border-primary'
          const highlightClass = isHighlighted
            ? highlightType === 'result'
              ? 'bg-accent-green-20 text-accent-green border-accent-green scale-105 shadow-[0_0_8px_var(--color-accent-green-40)]'
              : 'scale-105 shadow-[0_0_8px_var(--color-accent-blue-40)]'
            : ''

          return (
            <motion.span
              key={idx}
              className={`flex items-center justify-center w-[18px] h-5 text-xs font-semibold rounded-xs border transition-all duration-fast ${baseClass} ${highlightClass}`}
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

  const maxVal = Math.max(
    Math.abs(operation.operand1.value),
    Math.abs(operation.operand2?.value || 0),
    Math.abs(operation.result)
  )
  const bits = Math.max(8, Math.ceil(Math.log2(maxVal + 1) / 4) * 4)

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
      className="flex flex-col gap-1 p-2 bg-bg-tertiary rounded-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-semibold text-text-secondary">Bitwise Operation</span>
        <span className="text-xs font-semibold py-px px-1.5 rounded-sm bg-accent-purple text-white tracking-tight">
          {getOperatorSymbol(operation.operator)}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 p-2 bg-bg-primary rounded-sm overflow-x-auto">
        <BinaryRow
          label={operation.operand1.name}
          value={operation.operand1.value}
          bits={bits}
          highlightBits={op1SetBits}
          highlightType="active"
        />

        {operation.operand2 && (
          <>
            <div className="flex items-center pl-16 ml-2">
              <span className="text-sm font-bold text-accent-purple min-w-10 text-right pr-2">
                {operation.operator}
              </span>
            </div>

            <BinaryRow
              label={operation.operand2.name}
              value={operation.operand2.value}
              bits={bits}
              highlightBits={op2SetBits}
              highlightType="active"
            />
          </>
        )}

        <div
          className="h-px my-0.5"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-accent-green), transparent)',
            marginLeft: 'calc(64px + 8px)',
          }}
        />

        <BinaryRow
          label="result"
          value={operation.result}
          bits={bits}
          highlightBits={resultSetBits}
          highlightType="result"
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 pt-1 border-t border-border-secondary">
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <span className="w-2 h-2 rounded-xs bg-accent-blue-30 border border-accent-blue" />
          <span>1 bit</span>
        </div>
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <span className="w-2 h-2 rounded-xs bg-bg-secondary border border-border-primary" />
          <span>0 bit</span>
        </div>
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <span className="w-2 h-2 rounded-xs bg-accent-green-30 border border-accent-green" />
          <span>Result</span>
        </div>
      </div>
    </motion.div>
  )
}
