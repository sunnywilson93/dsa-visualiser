'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, BookOpen, Box, Zap } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { concepts, conceptCategories } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import styles from './page.module.css'

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function ConceptsPage() {
  const search = usePageSearch()
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[{ label: 'Concepts' }]} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Learn Concepts</h1>
          <p className={styles.subtitle}>
            Visual, interactive explanations of core concepts.
            <br />
            Understand the &quot;why&quot; before practicing the &quot;how&quot;.
          </p>
        </header>

        {/* Page-level search with filters */}
        <PageSearchControls
          search={search}
          showSourceFilter
          placeholder="Search all concepts..."
        />

        {/* Show filtered results when searching/filtering */}
        {hasActiveFilters ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                <Search size={20} />
              </span>
              Search Results
              <span className={styles.sectionDescription}>
                {search.results.length} {search.results.length === 1 ? 'concept' : 'concepts'} found
              </span>
            </h2>
            <div className={styles.searchResults}>
              <SearchResultsList
                results={search.results}
                emptyMessage="No concepts match your search criteria"
              />
            </div>
          </section>
        ) : (
          <>
            {/* DSA & JS Concept Categories */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>
                  <BookOpen size={20} />
                </span>
                Choose Your Path
              </h2>
              <div className={styles.grid}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Link href="/concepts/dsa" className={styles.card}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>
                          <Box size={28} />
                        </span>
                        <span
                          className={styles.difficulty}
                          style={{ background: '#667eea' }}
                        >
                          {dsaConcepts.length} topics
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>DSA Concepts</h3>
                      <p className={styles.cardDescription}>
                        Data Structures &amp; Algorithms fundamentals. Arrays, Hash Tables, Stacks, Queues, Big O, and more.
                      </p>
                      <div className={styles.cardFooter}>
                        <span className={styles.keyPoints}>Foundations first</span>
                        <span className={styles.examples}>Then patterns</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Link href="#js-concepts" className={styles.card}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>
                          <Zap size={28} />
                        </span>
                        <span
                          className={styles.difficulty}
                          style={{ background: '#f59e0b' }}
                        >
                          {concepts.length} topics
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>JavaScript Concepts</h3>
                      <p className={styles.cardDescription}>
                        Core JS mechanics. Closures, Event Loop, Prototypes, This keyword, and runtime internals.
                      </p>
                      <div className={styles.cardFooter}>
                        <span className={styles.keyPoints}>Language deep-dive</span>
                        <span className={styles.examples}>Interview essentials</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* JS Concepts Section */}
            <div id="js-concepts"></div>

            {conceptCategories.map((category) => {
              const categoryConcepts = concepts.filter(c => c.category === category.id)
              if (categoryConcepts.length === 0) return null

              return (
                <section key={category.id} className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>
                      <ConceptIcon conceptId={category.id} size={20} />
                    </span>
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
                        <Link href={`/concepts/${concept.id}`} className={styles.card}>
                          <div className={styles.cardInner}>
                            <div className={styles.cardHeader}>
                              <span className={styles.cardIcon}>
                                <ConceptIcon conceptId={concept.id} size={28} />
                              </span>
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
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>More concepts coming soon!</p>
      </footer>
    </div>
  )
}
