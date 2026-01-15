'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/NavBar'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import styles from '../page.module.css'

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function DSAConceptsPage() {
  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'DSA' }
      ]} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>DSA Concepts</h1>
          <p className={styles.subtitle}>
            Master the fundamentals of Data Structures &amp; Algorithms.
            <br />
            Build a strong foundation before tackling patterns and problems.
          </p>
        </header>

        {dsaConceptCategories.map((category) => {
          const categoryConcepts = dsaConcepts.filter(c => c.category === category.id)
          if (categoryConcepts.length === 0) return null

          return (
            <section key={category.id} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>{category.icon}</span>
                {category.name}
                <span className={styles.sectionDescription}>{category.description}</span>
              </h2>

              <div className={styles.grid}>
                {categoryConcepts.map((concept, index) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/concepts/dsa/${concept.id}`} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>{concept.icon}</span>
                        <span
                          className={styles.difficulty}
                          style={{ background: difficultyColors[concept.difficulty] }}
                        >
                          {concept.difficulty}
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>{concept.title}</h3>
                      <p className={styles.cardDescription}>{concept.shortDescription}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.keyPoints}>
                          {concept.keyPoints.length} key points
                        </span>
                        <span className={styles.examples}>
                          {concept.examples.length} examples
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <footer className={styles.footer}>
        <p>Patterns &amp; advanced concepts coming soon!</p>
      </footer>
    </div>
  )
}
