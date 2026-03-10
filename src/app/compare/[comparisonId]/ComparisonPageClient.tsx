'use client'

import Link from 'next/link'
import type { Comparison } from '@/data/comparisons'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import styles from './ComparisonPageClient.module.css'

interface ComparisonPageClientProps {
  comparison: Comparison
}

export function ComparisonPageClient({ comparison }: ComparisonPageClientProps) {
  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  const domainLabel = comparison.domain === 'js' ? 'JavaScript' : comparison.domain === 'react' ? 'React' : 'DSA'
  const domainPath = comparison.domain === 'js' ? 'js' : comparison.domain

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/concepts" className={styles.breadcrumbLink}>Concepts</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{domainLabel}</span>
        </div>
        <h1 className={styles.title}>{comparison.title}</h1>
        <p className={styles.description}>{comparison.shortDescription}</p>
      </header>

      {/* Comparison Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Side-by-Side Comparison</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.dimensionHeader}>Feature</th>
                {comparison.items.map((item) => (
                  <th key={item.id} className={styles.itemHeader}>{item.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.dimensions.map((dim) => (
                <tr key={dim.dimension}>
                  <td className={styles.dimensionCell}>{dim.dimension}</td>
                  {comparison.items.map((item) => (
                    <td key={item.id} className={styles.aspectCell}>
                      {dim.aspects[item.id] || '\u2014'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Examples */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Code Examples</h2>
        <div className={styles.codeGrid}>
          {comparison.items.map((item) => (
            <div key={item.id} className={styles.codeCard}>
              <h3 className={styles.codeCardTitle}>{item.title}</h3>
              <ul className={styles.keyPoints}>
                {item.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <pre className={styles.codeBlock}>
                <code>{item.codeExample}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* When to Use */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>When to Use Which</h2>
        <div className={styles.guidanceList}>
          {comparison.whenToUse.map((wu) => {
            const item = comparison.items.find((i) => i.id === wu.itemId)
            return (
              <div key={wu.itemId} className={styles.guidanceCard}>
                <h3 className={styles.guidanceTitle}>{item?.title || wu.itemId}</h3>
                <p className={styles.guidanceText}>{wu.guidance}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Common Mistakes */}
      {comparison.commonMistakes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Mistakes</h2>
          <ul className={styles.mistakesList}>
            {comparison.commonMistakes.map((mistake, i) => (
              <li key={i} className={styles.mistakeItem}>{mistake}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Interview Questions */}
      {comparison.interviewQuestions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interview Questions</h2>
          <div className={styles.faqList}>
            {comparison.interviewQuestions.map((q, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{q.question}</summary>
                <p className={styles.faqAnswer}>{q.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Concepts */}
      {comparison.relatedConceptIds.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Deep Dive</h2>
          <div className={styles.relatedLinks}>
            {comparison.relatedConceptIds.map((id) => (
              <Link
                key={id}
                href={`/concepts/${domainPath}/${id}`}
                className={styles.relatedLink}
              >
                {id.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Last Updated */}
      <div className={styles.footer}>
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Last updated {formattedDate}</time>
      </div>
    </main>
  )
}
