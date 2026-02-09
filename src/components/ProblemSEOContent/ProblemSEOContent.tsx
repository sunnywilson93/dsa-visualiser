import type { CodeExample } from '@/data/examples'
import styles from './ProblemSEOContent.module.css'

interface ProblemSEOContentProps {
  problem: CodeExample
}

export function ProblemSEOContent({ problem }: ProblemSEOContentProps) {
  if (!problem.approach) return null

  return (
    <section className={styles.container}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Solution Guide: {problem.name}</h2>

        <div className={styles.section}>
          <h3 className={styles.subheading}>Approach</h3>
          <p className={styles.text}>{problem.approach}</p>
        </div>

        {(problem.timeComplexity || problem.spaceComplexity) && (
          <div className={styles.section}>
            <h3 className={styles.subheading}>Complexity Analysis</h3>
            <dl className={styles.complexityGrid}>
              {problem.timeComplexity && (
                <div className={styles.complexityItem}>
                  <dt className={styles.complexityLabel}>Time</dt>
                  <dd className={styles.complexityValue}>{problem.timeComplexity}</dd>
                </div>
              )}
              {problem.spaceComplexity && (
                <div className={styles.complexityItem}>
                  <dt className={styles.complexityLabel}>Space</dt>
                  <dd className={styles.complexityValue}>{problem.spaceComplexity}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {problem.patternName && (
          <div className={styles.section}>
            <h3 className={styles.subheading}>Pattern</h3>
            <span className={styles.badge}>{problem.patternName}</span>
          </div>
        )}

        {problem.whyItWorks && (
          <div className={styles.section}>
            <h3 className={styles.subheading}>Why It Works</h3>
            <p className={styles.text}>{problem.whyItWorks}</p>
          </div>
        )}
      </div>
    </section>
  )
}
