'use client'

import { motion, AnimatePresence } from 'framer-motion'
import styles from './StepProgress.module.css'

export interface StepProgressProps {
  current: number
  total: number
  description: string
  animated?: boolean
}

export function StepProgress({
  current,
  total,
  description,
  animated = true,
}: StepProgressProps) {
  const content = (
    <>
      <span className={styles.stepBadge}>
        Step {current + 1}/{total}
      </span>
      {description}
    </>
  )

  if (!animated) {
    return <div className={styles.description}>{content}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        className={styles.description}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}
