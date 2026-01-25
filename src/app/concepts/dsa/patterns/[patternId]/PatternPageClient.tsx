'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, HardDrive, CheckCircle } from 'lucide-react'
import { getPatternBySlug } from '@/data/dsaPatterns'
import { TwoPointersViz, HashMapViz } from '@/components/DSAPatterns'
import styles from './page.module.css'

interface Props {
  patternId: string
}

export default function PatternPageClient({ patternId }: Props) {
  const pattern = getPatternBySlug(patternId)

  if (!pattern) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <Link href="/concepts" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Concepts
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{pattern.name}</h1>
        <p className={styles.description}>{pattern.description}</p>

        <div className={styles.complexity}>
          <span className={styles.complexityItem}>
            <Clock size={14} />
            Time: {pattern.complexity.time}
          </span>
          <span className={styles.complexityItem}>
            <HardDrive size={14} />
            Space: {pattern.complexity.space}
          </span>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>When to Use</h2>
        <ul className={styles.list}>
          {pattern.whenToUse.map((use, index) => (
            <li key={index} className={styles.listItem}>
              <CheckCircle size={14} className={styles.listIcon} />
              {use}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern Variants</h2>
        <div className={styles.variants}>
          {pattern.variants.map((variant) => (
            <div key={variant.id} className={styles.variantCard}>
              <h3 className={styles.variantName}>{variant.name}</h3>
              <p className={styles.variantDescription}>{variant.description}</p>
              <p className={styles.variantUse}>
                <strong>Use for:</strong> {variant.whenToUse}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Interactive Visualization</h2>
        {patternId === 'two-pointers' ? (
          <TwoPointersViz />
        ) : patternId === 'hash-map' ? (
          <HashMapViz />
        ) : (
          <div className={styles.vizPlaceholder}>
            <p>Step-through visualization coming soon...</p>
            <p className={styles.vizHint}>
              This will include beginner, intermediate, and advanced examples with code highlighting.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
