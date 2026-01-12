import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { RuntimeValue, ArrayValue, ExecutionStep } from '@/types'
import { formatValue } from '@/engine'
import styles from './ArrayVisualization.module.css'

interface ArrayVisualizationProps {
  array: ArrayValue
  step: ExecutionStep
  varName: string
}

interface ElementState {
  value: RuntimeValue
  index: number
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'accessed'
}

interface Pointer {
  name: string
  index: number
  type: 'primary' | 'secondary'
}

/**
 * Parse the step description to detect which indices are being operated on
 */
function parseStepForHighlights(step: ExecutionStep, varName: string): {
  comparing: number[]
  swapping: number[]
  accessed: number[]
} {
  const comparing: number[] = []
  const swapping: number[] = []
  const accessed: number[] = []

  const desc = step.description
  const stepType = step.type

  // Escape the variable name for regex
  const escapedName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Find all array accesses like arr[...] - capture the expression inside brackets
  const allAccessPattern = new RegExp(`${escapedName}\\[([^\\]]+)\\]`, 'g')
  const allMatches: string[] = []
  let match

  while ((match = allAccessPattern.exec(desc)) !== null) {
    allMatches.push(match[1])
  }

  // Resolve all found indices
  const resolvedIndices = allMatches
    .map(expr => resolveIndex(expr.trim(), step))
    .filter((idx): idx is number => idx !== null)

  // Categorize based on step type
  if (stepType === 'comparison' && resolvedIndices.length >= 2) {
    // Comparison step - first two indices are being compared
    comparing.push(...resolvedIndices.slice(0, 2))
  } else if (stepType === 'array-modify' && resolvedIndices.length > 0) {
    // Modification step
    swapping.push(resolvedIndices[0])
  } else if (stepType === 'array-access' && resolvedIndices.length > 0) {
    // Access step
    accessed.push(...resolvedIndices)
  } else if (resolvedIndices.length > 0) {
    // Fallback: check description for clues
    if (desc.includes('>') || desc.includes('<') || desc.includes('===') || desc.includes('==')) {
      comparing.push(...resolvedIndices)
    } else if (desc.includes('=') && !desc.includes('==')) {
      swapping.push(...resolvedIndices)
    } else {
      accessed.push(...resolvedIndices)
    }
  }

  return { comparing, swapping, accessed }
}

/**
 * Look up a variable's value from the step's scopes and call stack
 */
function lookupVariable(name: string, step: ExecutionStep): number | null {
  // Try to find the variable in current scopes
  for (const scope of step.scopes) {
    if (name in scope.variables) {
      const val = scope.variables[name]
      if (val.type === 'primitive' && val.dataType === 'number') {
        return val.value as number
      }
    }
  }

  // Check call stack frame params/locals
  for (const frame of step.callStack) {
    if (name in frame.params) {
      const val = frame.params[name]
      if (val.type === 'primitive' && val.dataType === 'number') {
        return val.value as number
      }
    }
    if (name in frame.locals) {
      const val = frame.locals[name]
      if (val.type === 'primitive' && val.dataType === 'number') {
        return val.value as number
      }
    }
  }

  return null
}

/**
 * Resolve an index expression (could be a number, variable, or simple expression like "j + 1")
 */
function resolveIndex(expr: string, step: ExecutionStep): number | null {
  expr = expr.trim()

  // If it's already a number
  const num = parseInt(expr, 10)
  if (!isNaN(num) && String(num) === expr) return num

  // If it's a simple variable
  const simpleVar = lookupVariable(expr, step)
  if (simpleVar !== null) return simpleVar

  // Try to evaluate simple expressions like "j + 1" or "i - 1"
  const exprMatch = expr.match(/^(\w+)\s*([+\-])\s*(\d+)$/)
  if (exprMatch) {
    const [, varName, operator, numStr] = exprMatch
    const varValue = lookupVariable(varName, step)
    const numValue = parseInt(numStr, 10)

    if (varValue !== null && !isNaN(numValue)) {
      return operator === '+' ? varValue + numValue : varValue - numValue
    }
  }

  // Try expression like "n - i - 1"
  const complexMatch = expr.match(/^(\w+)\s*-\s*(\w+)\s*-\s*(\d+)$/)
  if (complexMatch) {
    const [, var1, var2, numStr] = complexMatch
    const val1 = lookupVariable(var1, step)
    const val2 = lookupVariable(var2, step)
    const numValue = parseInt(numStr, 10)

    if (val1 !== null && val2 !== null && !isNaN(numValue)) {
      return val1 - val2 - numValue
    }
  }

  return null
}

/**
 * Detect pointer variables (i, j, left, right, etc.) that reference array indices
 */
function detectPointers(step: ExecutionStep, arrayLength: number): Pointer[] {
  const pointers: Pointer[] = []
  const seen = new Set<string>()

  // Common pointer variable names
  const pointerNames = ['i', 'j', 'k', 'l', 'left', 'right', 'start', 'end', 'low', 'high', 'mid', 'slow', 'fast', 'p1', 'p2']
  const primaryPointers = new Set(['i', 'left', 'start', 'low', 'slow', 'p1'])

  // Check all scopes for pointer variables
  for (const scope of step.scopes) {
    for (const [name, value] of Object.entries(scope.variables)) {
      if (pointerNames.includes(name) && !seen.has(name)) {
        if (value.type === 'primitive' && value.dataType === 'number') {
          const idx = value.value as number
          // Only include if it's a valid array index
          if (idx >= 0 && idx < arrayLength) {
            seen.add(name)
            pointers.push({
              name,
              index: idx,
              type: primaryPointers.has(name) ? 'primary' : 'secondary',
            })
          }
        }
      }
    }
  }

  // Check call stack frame params/locals
  for (const frame of step.callStack) {
    for (const [name, value] of Object.entries(frame.params)) {
      if (pointerNames.includes(name) && !seen.has(name)) {
        if (value.type === 'primitive' && value.dataType === 'number') {
          const idx = value.value as number
          if (idx >= 0 && idx < arrayLength) {
            seen.add(name)
            pointers.push({
              name,
              index: idx,
              type: primaryPointers.has(name) ? 'primary' : 'secondary',
            })
          }
        }
      }
    }
    for (const [name, value] of Object.entries(frame.locals)) {
      if (pointerNames.includes(name) && !seen.has(name)) {
        if (value.type === 'primitive' && value.dataType === 'number') {
          const idx = value.value as number
          if (idx >= 0 && idx < arrayLength) {
            seen.add(name)
            pointers.push({
              name,
              index: idx,
              type: primaryPointers.has(name) ? 'primary' : 'secondary',
            })
          }
        }
      }
    }
  }

  return pointers
}

export function ArrayVisualization({ array, step, varName }: ArrayVisualizationProps) {
  const highlights = useMemo(
    () => parseStepForHighlights(step, varName),
    [step, varName]
  )

  const pointers = useMemo(
    () => detectPointers(step, array.elements.length),
    [step, array.elements.length]
  )

  // Group pointers by index for rendering
  const pointersByIndex = useMemo(() => {
    const map = new Map<number, Pointer[]>()
    for (const ptr of pointers) {
      const existing = map.get(ptr.index) || []
      existing.push(ptr)
      map.set(ptr.index, existing)
    }
    return map
  }, [pointers])

  const elements: ElementState[] = array.elements.map((value, index) => {
    let state: ElementState['state'] = 'default'

    if (highlights.swapping.includes(index)) {
      state = 'swapping'
    } else if (highlights.comparing.includes(index)) {
      state = 'comparing'
    } else if (highlights.accessed.includes(index)) {
      state = 'accessed'
    }

    return { value, index, state }
  })

  // Calculate bar heights for numeric arrays
  const isNumeric = array.elements.every(
    el => el.type === 'primitive' && el.dataType === 'number'
  )

  const maxValue = isNumeric
    ? Math.max(...array.elements.map(el =>
        el.type === 'primitive' ? Math.abs(el.value as number) : 0
      ), 1)
    : 1

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.varName}>{varName}</span>
        <span className={styles.length}>[{array.elements.length}]</span>
      </div>

      <div className={styles.arrayContainer}>
        {elements.map(({ value, index, state }) => {
          const numericValue = value.type === 'primitive' && value.dataType === 'number'
            ? (value.value as number)
            : null

          const heightPercent = numericValue !== null
            ? (Math.abs(numericValue) / maxValue) * 100
            : 50

          const elementPointers = pointersByIndex.get(index) || []

          return (
            <motion.div
              key={index}
              className={`${styles.element} ${styles[state]}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: state === 'swapping' ? -8 : 0,
              }}
              transition={{
                duration: 0.2,
                layout: { duration: 0.3 },
              }}
            >
              {/* Pointer labels above element */}
              {elementPointers.length > 0 && (
                <div className={styles.pointers}>
                  {elementPointers.map((ptr) => (
                    <motion.span
                      key={ptr.name}
                      className={`${styles.pointer} ${styles[ptr.type]}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {ptr.name}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Bar visualization for numeric values */}
              {isNumeric && (
                <motion.div
                  className={styles.bar}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Value label */}
              <div className={styles.value}>
                {formatValue(value, true)}
              </div>

              {/* Index label */}
              <div className={styles.index}>{index}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.comparing}`} />
          <span>Comparing</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.swapping}`} />
          <span>Modifying</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.accessed}`} />
          <span>Accessed</span>
        </div>
      </div>
    </div>
  )
}
