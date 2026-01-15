import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { ExpandableGrid } from '@/components/ExpandableGrid'
import { exampleCategories, getExamplesByCategory } from '@/data/examples'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import styles from './page.module.css'

// JS implementation categories (exclude DSA - it gets its own section)
const jsCategories = exampleCategories.filter(c => c.id !== 'dsa')
const dsaCategory = exampleCategories.find(c => c.id === 'dsa')!
const dsaProblems = getExamplesByCategory('dsa')

export default function HomePage() {
  return (
    <div className={styles.container}>
      <NavBar />

      <header className={styles.header}>
        <h1 className={styles.title}>JS Interview Prep</h1>
        <p className={styles.subtitle}>
          Master JavaScript for frontend interviews with interactive visualizations
        </p>
      </header>

      <main className={styles.main}>
        {/* Section 1: UNDERSTAND - Concepts */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1</span>
                Understand
              </h2>
              <p className={styles.sectionDescription}>
                What interviewers ask you to <strong>explain</strong>
              </p>
            </div>
            <Link href="/concepts" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {/* Two concept category cards */}
          <div className={styles.conceptCategoryGrid}>
            <Link href="/concepts/dsa" className={styles.conceptCategoryCard}>
              <div className={styles.conceptCategoryHeader}>
                <span className={styles.conceptCategoryIcon}>🏗️</span>
                <span className={styles.conceptCategoryBadge}>{dsaConcepts.length} topics</span>
              </div>
              <h3 className={styles.conceptCategoryTitle}>DSA Fundamentals</h3>
              <p className={styles.conceptCategoryDescription}>
                Big O, Arrays, Hash Tables, Stacks, Queues, Linked Lists
              </p>
              <div className={styles.conceptCategoryTopics}>
                {dsaConcepts.slice(0, 4).map(c => (
                  <span key={c.id} className={styles.topicTag}>{c.title}</span>
                ))}
                {dsaConcepts.length > 4 && (
                  <span className={styles.topicMore}>+{dsaConcepts.length - 4}</span>
                )}
              </div>
            </Link>

            <Link href="/concepts" className={styles.conceptCategoryCard}>
              <div className={styles.conceptCategoryHeader}>
                <span className={styles.conceptCategoryIcon}>⚡</span>
                <span className={styles.conceptCategoryBadge}>{concepts.length} topics</span>
              </div>
              <h3 className={styles.conceptCategoryTitle}>JavaScript Deep Dive</h3>
              <p className={styles.conceptCategoryDescription}>
                Closures, Event Loop, Prototypes, This, V8 Engine
              </p>
              <div className={styles.conceptCategoryTopics}>
                {concepts.slice(0, 4).map(c => (
                  <span key={c.id} className={styles.topicTag}>{c.title}</span>
                ))}
                {concepts.length > 4 && (
                  <span className={styles.topicMore}>+{concepts.length - 4}</span>
                )}
              </div>
            </Link>
          </div>
        </section>

        {/* Section 2: BUILD - JavaScript Implementations */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2</span>
                Build
              </h2>
              <p className={styles.sectionDescription}>
                What interviewers ask you to <strong>implement</strong>
              </p>
            </div>
          </div>

          <ExpandableGrid
            className={styles.buildGrid}
            collapsedClassName={styles.buildGridCollapsed}
            showAllText={`Show All (${jsCategories.length})`}
          >
            {jsCategories.map((category) => {
              const problems = getExamplesByCategory(category.id)
              return (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className={styles.buildCard}
                >
                  <span className={styles.buildIcon}>{category.icon}</span>
                  <div className={styles.buildContent}>
                    <h3 className={styles.buildTitle}>{category.name}</h3>
                    <p className={styles.buildDescription}>{category.description}</p>
                  </div>
                  <span className={styles.buildCount}>{problems.length}</span>
                </Link>
              )
            })}
          </ExpandableGrid>
        </section>

        {/* Section 3: SOLVE - Data Structures & Algorithms */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3</span>
                Solve
              </h2>
              <p className={styles.sectionDescription}>
                For <strong>algorithm-focused</strong> interview rounds
              </p>
            </div>
          </div>

          <Link href="/dsa" className={styles.dsaBanner}>
            <div className={styles.dsaContent}>
              <div className={styles.dsaLeft}>
                <span className={styles.dsaIcon}>{dsaCategory.icon}</span>
                <div>
                  <h3 className={styles.dsaTitle}>Data Structures & Algorithms</h3>
                  <p className={styles.dsaDescription}>
                    Arrays, Trees, Graphs, Dynamic Programming, and more
                  </p>
                </div>
              </div>
              <div className={styles.dsaRight}>
                <div className={styles.dsaStats}>
                  <span className={styles.dsaCount}>{dsaProblems.length}</span>
                  <span className={styles.dsaLabel}>Problems</span>
                </div>
                <div className={styles.dsaStats}>
                  <span className={styles.dsaCount}>19</span>
                  <span className={styles.dsaLabel}>Topics</span>
                </div>
              </div>
            </div>
            <div className={styles.dsaTopics}>
              {['Arrays', 'Two Pointers', 'Binary Search', 'Trees', 'Graphs', 'DP'].map(topic => (
                <span key={topic} className={styles.dsaTopic}>{topic}</span>
              ))}
              <span className={styles.dsaMore}>+13 more</span>
            </div>
            <span className={styles.dsaCta}>Explore DSA Problems →</span>
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Understand concepts → Build implementations → Solve problems</p>
      </footer>
    </div>
  )
}
