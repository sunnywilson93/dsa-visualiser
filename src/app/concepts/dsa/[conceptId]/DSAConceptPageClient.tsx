'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, AlertTriangle, Award, Clock } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { getDSAConceptById, getRelatedDSAConcepts } from '@/data/dsaConcepts'
import { HashTableViz, StackViz, BigOViz, ArrayViz, QueueViz, LinkedListViz } from '@/components/DSAConcepts'
import styles from '../../[conceptId]/page.module.css'
import localStyles from './page.module.css'

// Map concept IDs to their visualization components
const visualizations: Record<string, React.ComponentType> = {
  'big-o-notation': BigOViz,
  'arrays': ArrayViz,
  'hash-tables': HashTableViz,
  'stacks': StackViz,
  'queues': QueueViz,
  'linked-lists': LinkedListViz,
}

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function DSAConceptPageClient() {
  const params = useParams()
  const router = useRouter()
  const conceptId = params.conceptId as string

  const concept = conceptId ? getDSAConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.notFound}>
          <h1>Concept not found</h1>
          <Link href="/concepts/dsa">Back to DSA Concepts</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavBar
        breadcrumbs={[
          { label: 'Concepts', path: '/concepts' },
          { label: 'DSA', path: '/concepts/dsa' },
          { label: concept.title },
        ]}
      />

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.push('/concepts/dsa')}>
            <ArrowLeft size={18} />
            <span>All DSA Concepts</span>
          </button>

          <div className={styles.titleRow}>
            <span className={styles.icon}>{concept.icon}</span>
            <h1 className={styles.title}>{concept.title}</h1>
            <span
              className={styles.difficulty}
              style={{ background: difficultyColors[concept.difficulty] }}
            >
              {concept.difficulty}
            </span>
          </div>

          <p className={styles.description}>{concept.description}</p>
        </header>

        {/* Interactive Visualization */}
        {(() => {
          const Visualization = visualizations[concept.id]
          if (!Visualization) return null
          return (
            <section className={styles.vizSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎮</span>
                Interactive Visualization
              </h2>
              <div className={styles.vizContainer}>
                <Visualization />
              </div>
            </section>
          )
        })()}

        {/* Complexity Table (for data structures) */}
        {concept.complexity && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Clock size={20} className={styles.sectionIconSvg} />
              Time Complexity
            </h2>
            <div className={localStyles.complexityTable}>
              <table>
                <thead>
                  <tr>
                    <th>Operation</th>
                    {concept.complexity.average && <th>Average</th>}
                    {concept.complexity.worst && <th>Worst</th>}
                    {concept.complexity.best && <th>Best</th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(concept.complexity.average || concept.complexity.worst || {}).map((op) => (
                    <tr key={op}>
                      <td>{op}</td>
                      {concept.complexity?.average && (
                        <td className={localStyles.complexityCell}>
                          {concept.complexity.average[op]}
                        </td>
                      )}
                      {concept.complexity?.worst && (
                        <td className={localStyles.complexityCellWorse}>
                          {concept.complexity.worst[op]}
                        </td>
                      )}
                      {concept.complexity?.best && (
                        <td className={localStyles.complexityCellBest}>
                          {concept.complexity.best[op]}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Key Points */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={20} className={styles.sectionIconSvg} />
            Key Points
          </h2>
          <ul className={styles.keyPoints}>
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Code Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>💻</span>
            Code Examples
          </h2>
          <div className={styles.examples}>
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className={styles.example}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className={styles.exampleTitle}>{example.title}</h3>
                <pre className={styles.code}>
                  <code>{example.code}</code>
                </pre>
                <p className={styles.explanation}>{example.explanation}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} className={styles.sectionIconSvg} />
              Common Mistakes
            </h2>
            <ul className={styles.mistakes}>
              {concept.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Award size={20} className={styles.sectionIconSvg} />
              Interview Tips
            </h2>
            <ul className={styles.tips}>
              {concept.interviewTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Problems */}
        {concept.relatedProblems && concept.relatedProblems.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🎯</span>
              Practice Problems
            </h2>
            <div className={localStyles.relatedProblems}>
              {concept.relatedProblems.map((problemId) => (
                <Link
                  key={problemId}
                  href={`/arrays-hashing/${problemId}`}
                  className={localStyles.problemLink}
                >
                  {problemId.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Concepts */}
        {(() => {
          const relatedConcepts = getRelatedDSAConcepts(concept.id)
          if (relatedConcepts.length === 0) return null
          return (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🔗</span>
                Related Concepts
              </h2>
              <div className={styles.relatedConcepts}>
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/concepts/dsa/${related.id}`}
                    className={styles.relatedCard}
                  >
                    <span className={styles.relatedIcon}>{related.icon}</span>
                    <div className={styles.relatedInfo}>
                      <h3 className={styles.relatedTitle}>{related.title}</h3>
                      <p className={styles.relatedDesc}>{related.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
      </main>
    </div>
  )
}
