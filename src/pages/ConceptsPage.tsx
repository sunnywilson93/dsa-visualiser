import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/NavBar'
import { concepts, conceptCategories } from '@/data/concepts'
import styles from './ConceptsPage.module.css'

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export function ConceptsPage() {
  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[{ label: 'Concepts' }]} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>JavaScript Concepts</h1>
          <p className={styles.subtitle}>
            Visual, interactive explanations of core JS concepts.
            <br />
            Understand the "why" before practicing the "how".
          </p>
        </header>

        {conceptCategories.map((category) => {
          const categoryConcepts = concepts.filter(c => c.category === category.id)
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
                    <Link to={`/concepts/${concept.id}`} className={styles.card}>
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
        <p>More concepts coming soon!</p>
      </footer>
    </div>
  )
}
