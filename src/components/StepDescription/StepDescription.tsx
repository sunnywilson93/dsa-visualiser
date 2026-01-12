import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep, useExecutionStore, useExecutionProgress } from '@/store'
import type { StepType } from '@/types'
import styles from './StepDescription.module.css'

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
    return '#10b981' // emerald for console output
  }

  switch (type) {
    case 'declaration':
    case 'assignment':
      return '#60a5fa' // blue
    case 'call':
    case 'return':
      return '#8b5cf6' // purple
    case 'loop-start':
    case 'loop-iteration':
    case 'loop-end':
      return '#f59e0b' // amber
    case 'branch':
      return '#ec4899' // pink
    case 'array-access':
    case 'array-modify':
      return '#10b981' // emerald
    case 'comparison':
      return '#ef4444' // red
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
      <div className={styles.container}>
        <div className={styles.idle}>
          Press <kbd>Space</kbd> to run code
        </div>
      </div>
    )
  }

  if (!currentStep) {
    return null
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          className={styles.content}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          <div className={styles.badges}>
            <span className={styles.stepBadge}>
              Step {current}/{total}
            </span>
            <span
              className={styles.typeBadge}
              style={{ background: getStepTypeColor(currentStep.type, currentStep.description) }}
            >
              {getStepTypeLabel(currentStep.type, currentStep.description)}
            </span>
            <span className={styles.lineBadge}>
              Line {currentStep.location.line}
            </span>
          </div>
          <div className={styles.description}>
            {currentStep.description}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
