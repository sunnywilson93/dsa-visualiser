'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep, useExecutionStore, useExecutionProgress } from '@/store'
import type { StepType } from '@/types'

function getStepTypeLabel(type: StepType, description: string): string {
  // Check for console.log specifically
  if (type === 'call' && description.startsWith('console.log')) {
    return 'Console'
  }

  switch (type) {
    case 'declaration': return 'Declaration'
    case 'assignment': return 'Assignment'
    case 'expression': return 'Expression'
    case 'call': return 'Function Call'
    case 'return': return 'Return'
    case 'branch': return 'Branch'
    case 'loop-start': return 'Loop Start'
    case 'loop-iteration': return 'Loop'
    case 'loop-end': return 'Loop End'
    case 'array-access': return 'Array Access'
    case 'array-modify': return 'Array Modify'
    case 'object-access': return 'Object Access'
    case 'object-modify': return 'Object Modify'
    case 'comparison': return 'Comparison'
    default: return 'Step'
  }
}

function getStepTypeColor(type: StepType, description: string): string {
  // Console.log gets a distinct color
  if (type === 'call' && description.startsWith('console.log')) {
    return 'var(--color-emerald-500)' // emerald for console output
  }

  switch (type) {
    case 'declaration':
    case 'assignment':
      return 'var(--color-blue-400)' // blue
    case 'call':
    case 'return':
      return '#a855f7' // purple
    case 'loop-start':
    case 'loop-iteration':
    case 'loop-end':
      return 'var(--color-amber-500)' // amber
    case 'branch':
      return '#ec4899' // pink
    case 'array-access':
    case 'array-modify':
      return 'var(--color-emerald-500)' // emerald
    case 'comparison':
      return 'var(--color-red-500)' // red
    default:
      return '#888'
  }
}

export function StepDescription() {
  const currentStep = useCurrentStep()
  const status = useExecutionStore(state => state.status)
  const { current, total } = useExecutionProgress()

  if (status === 'idle') {
    return (
      <div className="p-[var(--spacing-md)] bg-[var(--color-black-30)] rounded-[var(--radius-lg)] border border-[var(--color-white-8)]">
        <div className="text-center text-[color:var(--color-gray-700)] text-[length:var(--text-base)]">
          Press <kbd className="inline-block px-[var(--spacing-xs)] py-[2px] bg-[var(--color-white-10)] border border-[var(--color-white-20)] rounded-[var(--radius-sm)] font-mono text-[length:var(--text-xs)] text-[color:var(--color-gray-500)]">Space</kbd> to run code
        </div>
      </div>
    )
  }

  if (!currentStep) {
    return null
  }

  return (
    <div className="p-[var(--spacing-md)] bg-[var(--color-black-30)] rounded-[var(--radius-lg)] border border-[var(--color-white-8)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          className="flex flex-col gap-[var(--spacing-sm)]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-[var(--spacing-sm)] flex-wrap">
            <span className="px-[var(--spacing-sm)] py-[2px] bg-[var(--color-brand-primary-20)] border border-[var(--color-brand-primary-30)] rounded-[var(--radius-sm)] text-[length:var(--text-2xs)] font-semibold text-[color:var(--color-brand-light)]">
              Step {current}/{total}
            </span>
            <span
              className="px-[var(--spacing-sm)] py-[2px] rounded-[var(--radius-sm)] text-[length:var(--text-2xs)] font-semibold text-[color:var(--color-black)]"
              style={{ background: getStepTypeColor(currentStep.type, currentStep.description) }}
            >
              {getStepTypeLabel(currentStep.type, currentStep.description)}
            </span>
            <span className="px-[var(--spacing-sm)] py-[2px] bg-[var(--color-white-5)] border border-[var(--color-white-10)] rounded-[var(--radius-sm)] text-[length:var(--text-2xs)] font-medium text-[color:var(--color-gray-700)] font-mono">
              Line {currentStep.location.line}
            </span>
          </div>
          <div className="text-[length:var(--text-base)] text-[color:var(--color-gray-300)] leading-[var(--leading-snug)] [&_code]:font-mono [&_code]:bg-[var(--color-brand-primary-15)] [&_code]:px-[3px] [&_code]:py-[2px] [&_code]:rounded-[var(--radius-sm)] [&_code]:text-[color:var(--color-brand-light)]">
            {currentStep.description}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
