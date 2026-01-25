'use client'

import { Search, Layers } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList, usePageSearch, PageSearchControls } from '@/components/Search'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import styles from '../page.module.css'

export default function DSAConceptsClient() {
  const search = usePageSearch('dsa')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

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

        <PageSearchControls
          search={search}
          placeholder="Search DSA concepts..."
        />

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
                emptyMessage="No DSA concepts match your search criteria"
              />
            </div>
          </section>
        ) : (
          <>
            {dsaConceptCategories.map((category) => {
              const categoryConcepts = dsaConcepts.filter(c => c.category === category.id)
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

                  <CardCarousel itemCount={categoryConcepts.length}>
                    {categoryConcepts.map((concept, index) => (
                      <Card
                        key={concept.id}
                        href={`/concepts/dsa/${concept.id}`}
                        title={concept.title}
                        description={concept.shortDescription}
                        icon={<ConceptIcon conceptId={concept.id} size={32} />}
                        difficulty={concept.difficulty}
                        stats={[
                          { label: 'key points', value: concept.keyPoints.length },
                          { label: 'examples', value: concept.examples.length },
                        ]}
                        index={index}
                        isActive={index === 0}
                      />
                    ))}
                  </CardCarousel>
                </section>
              )
            })}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>
                  <Layers size={20} />
                </span>
                Algorithm Patterns
                <span className={styles.sectionDescription}>
                  Step-by-step visualizations of common algorithm patterns
                </span>
              </h2>

              <CardCarousel itemCount={dsaPatterns.length}>
                {dsaPatterns.map((pattern, index) => (
                  <Card
                    key={pattern.id}
                    href={`/concepts/dsa/patterns/${pattern.slug}`}
                    title={pattern.name}
                    description={pattern.description}
                    icon={<ConceptIcon conceptId={pattern.id} size={32} />}
                    difficulty="intermediate"
                    stats={[
                      { label: `Time: ${pattern.complexity.time}`, value: '' },
                      { label: 'variants', value: pattern.variants.length },
                    ]}
                    index={index}
                    isActive={index === 0}
                  />
                ))}
              </CardCarousel>
            </section>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>More patterns coming soon!</p>
      </footer>
    </div>
  )
}
