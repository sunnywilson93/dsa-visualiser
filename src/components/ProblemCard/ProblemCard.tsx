'use client'

import Link from 'next/link'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import type { CodeExample } from '@/data/examples'
import styles from './ProblemCard.module.css'

interface ProblemCategory {
  id: string
  name: string
}

interface ProblemCardBaseProps {
  problem: CodeExample
  category?: ProblemCategory
  onCategoryClick?: () => void
  categoryAriaLabel?: string
  showCategory?: boolean
}

interface ProblemCardLinkProps extends ProblemCardBaseProps {
  href: string
  onClick?: never
}

interface ProblemCardButtonProps extends ProblemCardBaseProps {
  href?: never
  onClick: () => void
}

type ProblemCardProps = ProblemCardLinkProps | ProblemCardButtonProps

export function ProblemCard({
  problem,
  href,
  onClick,
  category,
  onCategoryClick,
  categoryAriaLabel,
  showCategory = true,
}: ProblemCardProps) {
  const cardContent = (
    <div className={styles.content}>
      <div className={styles.header}>
        <span className={styles.name}>{problem.name}</span>
        <DifficultyIndicator level={problem.difficulty} size="sm" />
      </div>
      {showCategory && category && (
        <div className={styles.meta}>
          {onCategoryClick ? (
            <button
              type="button"
              className={`${styles.category} ${styles.categoryButton}`}
              onClick={(e) => {
                e.stopPropagation()
                onCategoryClick()
              }}
              aria-label={categoryAriaLabel || `Filter to ${category.name}`}
            >
              <ConceptIcon conceptId={category.id} size={14} />
              {category.name}
            </button>
          ) : (
            <span className={styles.category}>
              <ConceptIcon conceptId={category.id} size={14} />
              {category.name}
            </span>
          )}
        </div>
      )}
      <p className={styles.description}>{problem.description}</p>
    </div>
  )

  if (href) {
    return (
      <div className={styles.card}>
        <Link href={href} className={styles.link} aria-label={`Open ${problem.name}`} />
        {cardContent}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Open ${problem.name}`}
    >
      {cardContent}
    </button>
  )
}
