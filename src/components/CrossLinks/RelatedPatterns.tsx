'use client'

import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { getRelatedPatterns } from '@/utils/getCrossLinks'
import styles from './RelatedPatterns.module.css'

interface Props {
  problemId: string
}

export function RelatedPatterns({ problemId }: Props) {
  const patterns = getRelatedPatterns(problemId)

  if (patterns.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Learn the Pattern</h3>
      <div className={styles.links}>
        {patterns.map((pattern) => (
          <Link
            key={pattern.id}
            href={pattern.href}
            className={styles.patternLink}
          >
            <Lightbulb size={18} className={styles.icon} />
            <div className={styles.patternInfo}>
              <span className={styles.patternName}>{pattern.name}</span>
              {pattern.description && (
                <span className={styles.patternDescription}>
                  {pattern.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
