'use client'

import { motion, AnimatePresence } from 'framer-motion'

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
      <span className="inline-block px-1.5 py-0.5 bg-brand-primary-10 border border-brand-primary-30 rounded-full text-2xs font-semibold text-brand-light mr-2">
        Step {current + 1}/{total}
      </span>
      {description}
    </>
  )

  if (!animated) {
    return (
      <div className="px-3 py-3 bg-black-50 border border-border-card rounded-lg text-base text-text-muted text-center">
        {content}
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        className="px-3 py-3 bg-black-50 border border-border-card rounded-lg text-base text-text-muted text-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}
