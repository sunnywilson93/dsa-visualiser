'use client'

import { useState, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ExpandableGridProps {
  children: ReactNode
  className?: string
  collapsedClassName?: string
  showAllText?: string
  showLessText?: string
}

export function ExpandableGrid({
  children,
  className = '',
  collapsedClassName = '',
  showAllText = 'Show All',
  showLessText = 'Show Less',
}: ExpandableGridProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div
        className={clsx(
          className,
          !isExpanded && ['overflow-hidden', collapsedClassName]
        )}
      >
        {children}
      </div>
      <button
        className="flex items-center justify-center gap-2 py-2 px-4 bg-surface-card border border-border-card rounded-lg text-text-muted text-base cursor-pointer transition-all duration-150 ease-out self-center hover:bg-brand-primary-10 hover:border-brand-primary-30 hover:text-brand-light"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? showLessText : showAllText}
        <span
          className={clsx(
            'transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        >
          ↓
        </span>
      </button>
    </div>
  )
}
