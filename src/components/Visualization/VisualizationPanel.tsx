import { useMemo } from 'react'
import { useCurrentStep, useExecutionStore } from '@/store'
import type { ArrayValue, RuntimeValue } from '@/types'
import { ArrayVisualization } from './ArrayVisualization'
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

export function VisualizationPanel() {
  const currentStep = useCurrentStep()
  const status = useExecutionStore(state => state.status)

  const arrays = useMemo(
    () => extractArrays(currentStep),
    [currentStep]
  )

  const isEmpty = status === 'idle' || arrays.length === 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Data Structures</span>
        {arrays.length > 0 && (
          <span className={styles.badge}>{arrays.length} array{arrays.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className={styles.content}>
        {isEmpty && status === 'idle' && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📊</div>
            <p>Run code to visualize data structures</p>
          </div>
        )}

        {isEmpty && status !== 'idle' && (
          <div className={styles.empty}>
            <p>No arrays in current scope</p>
          </div>
        )}

        {!isEmpty && currentStep && (
          <div className={styles.visualizations}>
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
