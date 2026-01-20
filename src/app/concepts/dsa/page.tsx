'use client'

import { Search } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList, usePageSearch, PageSearchControls } from '@/components/Search'
import { ConceptIcon } from '@/components/Icons'
import { ConceptCarousel } from '@/components/ConceptCarousel'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import styles from '../page.module.css'

export default function DSAConceptsPage() {
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

        {/* Page-level search */}
        <PageSearchControls
          search={search}
          placeholder="Search DSA concepts..."
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

                  <ConceptCarousel concepts={categoryConcepts} basePath="/concepts/dsa" />
                </section>
              )
            })}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Patterns &amp; advanced concepts coming soon!</p>
      </footer>
    </div>
  )
}
