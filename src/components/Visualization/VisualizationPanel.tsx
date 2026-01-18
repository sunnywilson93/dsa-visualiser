'use client'

import { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import { useCurrentStep, useExecutionStore } from '@/store'
import type { ArrayValue, RuntimeValue, ExecutionStep } from '@/types'
import { ArrayVisualization } from './ArrayVisualization'
import { BinaryVisualization } from './BinaryVisualization'
import styles from './VisualizationPanel.module.css'

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

  const hasContent = arrays.length > 0 || showBitwise
  const isEmpty = status === 'idle' || !hasContent

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Visualization</span>
        <div className={styles.badges}>
          {arrays.length > 0 && (
            <span className={styles.badge}>{arrays.length} array{arrays.length !== 1 ? 's' : ''}</span>
          )}
          {showBitwise && (
            <span className={`${styles.badge} ${styles.bitwise}`}>Binary</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isEmpty && status === 'idle' && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <BarChart3 size={32} />
            </div>
            <p>Run code to visualize data structures</p>
          </div>
        )}

        {isEmpty && status !== 'idle' && (
          <div className={styles.empty}>
            <p>No visualizations for current step</p>
          </div>
        )}

        {!isEmpty && currentStep && (
          <div className={styles.visualizations}>
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
