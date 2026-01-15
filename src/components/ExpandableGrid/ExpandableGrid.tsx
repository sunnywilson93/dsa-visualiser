'use client'

import { useState, ReactNode } from 'react'
import styles from './ExpandableGrid.module.css'

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
    <div className={styles.container}>
      <div
        className={`${className} ${!isExpanded ? `${styles.collapsed} ${collapsedClassName}` : ''}`}
      >
        {children}
      </div>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? showLessText : showAllText}
        <span className={`${styles.arrow} ${isExpanded ? styles.arrowUp : ''}`}>
          ↓
        </span>
      </button>
    </div>
  )
}
