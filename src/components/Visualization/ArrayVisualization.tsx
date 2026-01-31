'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { RuntimeValue, ArrayValue, ExecutionStep } from '@/types'
import { formatValue } from '@/engine'

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
    comparing.push(...resolvedIndices.slice(0, 2))
  } else if (stepType === 'array-modify' && resolvedIndices.length > 0) {
    swapping.push(resolvedIndices[0])
  } else if (stepType === 'array-access' && resolvedIndices.length > 0) {
    accessed.push(...resolvedIndices)
  } else if (resolvedIndices.length > 0) {
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
  for (const scope of step.scopes) {
    if (name in scope.variables) {
      const val = scope.variables[name]
      if (val.type === 'primitive' && val.dataType === 'number') {
        return val.value as number
      }
    }
  }

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
 * Resolve an index expression
 */
function resolveIndex(expr: string, step: ExecutionStep): number | null {
  expr = expr.trim()

  const num = parseInt(expr, 10)
  if (!isNaN(num) && String(num) === expr) return num

  const simpleVar = lookupVariable(expr, step)
  if (simpleVar !== null) return simpleVar

  const exprMatch = expr.match(/^(\w+)\s*([+\-])\s*(\d+)$/)
  if (exprMatch) {
    const [, varName, operator, numStr] = exprMatch
    const varValue = lookupVariable(varName, step)
    const numValue = parseInt(numStr, 10)

    if (varValue !== null && !isNaN(numValue)) {
      return operator === '+' ? varValue + numValue : varValue - numValue
    }
  }

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
 * Detect pointer variables
 */
function detectPointers(step: ExecutionStep, arrayLength: number): Pointer[] {
  const pointers: Pointer[] = []
  const seen = new Set<string>()

  const pointerNames = ['i', 'j', 'k', 'l', 'left', 'right', 'start', 'end', 'low', 'high', 'mid', 'slow', 'fast', 'p1', 'p2']
  const primaryPointers = new Set(['i', 'left', 'start', 'low', 'slow', 'p1'])

  for (const scope of step.scopes) {
    for (const [name, value] of Object.entries(scope.variables)) {
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

  const isNumeric = array.elements.every(
    el => el.type === 'primitive' && el.dataType === 'number'
  )

  const maxValue = isNumeric
    ? Math.max(...array.elements.map(el =>
        el.type === 'primitive' ? Math.abs(el.value as number) : 0
      ), 1)
    : 1

  return (
    <div className="flex flex-col gap-1 p-2 bg-bg-tertiary rounded-md">
      <div className="flex items-center gap-1 font-mono text-xs">
        <span className="text-accent-cyan font-semibold">{varName}</span>
        <span className="text-text-muted">[{array.elements.length}]</span>
      </div>

      <div className="flex items-end gap-[3px] min-h-20 p-2 pt-6 bg-bg-primary rounded-sm overflow-x-auto">
        {elements.map(({ value, index, state }) => {
          const numericValue = value.type === 'primitive' && value.dataType === 'number'
            ? (value.value as number)
            : null

          const heightPercent = numericValue !== null
            ? (Math.abs(numericValue) / maxValue) * 100
            : 50

          const elementPointers = pointersByIndex.get(index) || []

          const stateClasses = {
            default: '',
            comparing: '[&_.bar]:bg-accent-yellow [&_.value]:bg-accent-yellow-30 [&_.value]:border-accent-yellow [&_.value]:text-accent-yellow',
            swapping: '[&_.bar]:bg-accent-green [&_.value]:bg-accent-green-20 [&_.value]:border-accent-green [&_.value]:text-accent-green',
            accessed: '[&_.bar]:bg-accent-purple [&_.value]:bg-accent-purple-20 [&_.value]:border-accent-purple [&_.value]:text-accent-purple',
            sorted: '[&_.bar]:bg-accent-green [&_.bar]:opacity-60',
          }

          return (
            <motion.div
              key={index}
              className={`flex flex-col items-center min-w-8 flex-1 max-w-12 relative ${stateClasses[state]}`}
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
              {elementPointers.length > 0 && (
                <div className="absolute -top-[18px] flex gap-px z-10">
                  {elementPointers.map((ptr) => (
                    <motion.span
                      key={ptr.name}
                      className={`font-mono text-2xs font-semibold py-px px-1 rounded-xs whitespace-nowrap animate-pointer-pulse ${
                        ptr.type === 'primary' ? 'bg-accent-blue text-white' : 'bg-accent-purple text-white'
                      }`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {ptr.name}
                    </motion.span>
                  ))}
                </div>
              )}

              {isNumeric && (
                <motion.div
                  className="bar w-full min-h-1 bg-accent-blue rounded-t-xs transition-colors duration-150"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="value py-px px-1 font-mono text-xs font-semibold text-text-primary bg-bg-secondary border border-border-primary rounded-xs mt-0.5 transition-all duration-150">
                {formatValue(value, true)}
              </div>

              <div className="font-mono text-2xs text-text-muted mt-px">{index}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 pt-1 border-t border-border-secondary">
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <div className="w-2 h-2 rounded-xs bg-accent-yellow" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <div className="w-2 h-2 rounded-xs bg-accent-green" />
          <span>Modifying</span>
        </div>
        <div className="flex items-center gap-1 text-2xs text-text-muted">
          <div className="w-2 h-2 rounded-xs bg-accent-purple" />
          <span>Accessed</span>
        </div>
      </div>
    </div>
  )
}
