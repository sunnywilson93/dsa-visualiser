'use client'

import Link from 'next/link'
import { getRelatedProblems } from '@/utils/getCrossLinks'
import styles from './RelatedProblems.module.css'

interface Props {
  patternId: string
}

export function RelatedProblems({ patternId }: Props) {
  const problems = getRelatedProblems(patternId)

  if (problems.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Practice this Pattern</h2>
      <div className={styles.grid}>
        {problems.map((problem) => (
          <div key={problem.id} className={styles.card}>
            <Link href={problem.href} className={styles.link}>
              <span className={styles.srOnly}>Go to {problem.name}</span>
            </Link>
            <div className={styles.content}>
              <h3 className={styles.name}>{problem.name}</h3>
              {problem.description && (
                <p className={styles.description}>{problem.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
