'use client'

import { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import { useCurrentStep, useExecutionStore } from '@/store'
import type { ArrayValue, RuntimeValue, ExecutionStep } from '@/types'
import { ArrayVisualization } from './ArrayVisualization'
import { BinaryVisualization } from './BinaryVisualization'
import { HeapVisualization } from './HeapVisualization'

interface DetectedArray {
  name: string
  array: ArrayValue
}

/**
 * Extract all arrays from the current execution state
 */
function extractArrays(step: ReturnType<typeof useCurrentStep>): DetectedArray[] {
  if (!step) return []

  const arrays: DetectedArray[] = []
  const seen = new Set<string>()

  // Helper to check and add array
  const checkValue = (name: string, value: RuntimeValue) => {
    if (value.type === 'array' && !seen.has(value.id)) {
      seen.add(value.id)
      arrays.push({ name, array: value })
    }
  }

  // Check all scopes
  for (const scope of step.scopes) {
    for (const [name, value] of Object.entries(scope.variables)) {
      checkValue(name, value)
    }
  }

  // Check call stack frames
  for (const frame of step.callStack) {
    for (const [name, value] of Object.entries(frame.params)) {
      checkValue(name, value)
    }
    for (const [name, value] of Object.entries(frame.locals)) {
      checkValue(name, value)
    }
  }

  return arrays
}

/**
 * Check if the current step involves a bitwise operation
 */
function isBitwiseOperation(step: ExecutionStep | undefined): boolean {
  if (!step) return false

  const desc = step.description

  // Check for bitwise operators in the description
  const bitwisePatterns = [
    /\d+\s*\^\s*\d+/,      // XOR: 5 ^ 3
    /\d+\s*&\s*\d+/,       // AND: 5 & 3 (but not &&)
    /\d+\s*\|\s*\d+/,      // OR: 5 | 3 (but not ||)
    /\d+\s*<<\s*\d+/,      // Left shift
    /\d+\s*>>\s*\d+/,      // Right shift
    /~\s*\w+/,             // NOT
    /XOR|AND|OR/i,         // Explicit mentions
  ]

  // Make sure we're not matching && or ||
  if (desc.includes('&&') || desc.includes('||')) {
    return false
  }

  return bitwisePatterns.some(pattern => pattern.test(desc))
}

export function VisualizationPanel() {
  const currentStep = useCurrentStep()
  const status = useExecutionStore(state => state.status)

  const arrays = useMemo(
    () => extractArrays(currentStep),
    [currentStep]
  )

  const showBitwise = useMemo(
    () => isBitwiseOperation(currentStep),
    [currentStep]
  )

  const showHeap = status !== 'idle' && currentStep !== null
  const hasContent = arrays.length > 0 || showBitwise || showHeap
  const isEmpty = status === 'idle' || !hasContent

  // Don't render if empty - save space
  if (isEmpty) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-semibold uppercase tracking-tight text-text-secondary">
          Visualization
        </span>
        <div className="flex gap-1">
          {arrays.length > 0 && (
            <span className="text-xs font-medium py-0.5 px-2 rounded-sm bg-bg-elevated text-text-muted">
              {arrays.length} array{arrays.length !== 1 ? 's' : ''}
            </span>
          )}
          {showBitwise && (
            <span className="text-xs font-medium py-0.5 px-2 rounded-sm bg-brand-primary-20 text-accent-purple">
              Binary
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {currentStep && (
          <div className="flex flex-col gap-2">
            {/* Heap memory visualization */}
            {showHeap && (
              <HeapVisualization step={currentStep} />
            )}

            {/* Binary visualization for bitwise operations */}
            {showBitwise && (
              <BinaryVisualization step={currentStep} />
            )}

            {/* Array visualizations */}
            {arrays.map(({ name, array }) => (
              <ArrayVisualization
                key={array.id}
                array={array}
                step={currentStep}
                varName={name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
