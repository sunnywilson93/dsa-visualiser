'use client'

import { cn } from '@/utils/cn'

export interface StepBadgeProps {
  step: number
  total?: number
  label?: string
  className?: string
}

export function StepBadge({ step, total, label, className }: StepBadgeProps) {
  const displayText = label || (total ? `Step ${step}/${total}` : `Step ${step}`)

  return (
    <span
      className={cn(
        'inline-block px-1 py-px bg-brand-primary/30 rounded text-2xs font-semibold text-brand-light mr-2',
        className
      )}
    >
      {displayText}
    </span>
  )
}
