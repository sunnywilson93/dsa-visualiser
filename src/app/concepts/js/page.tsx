'use client'

import { Search } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { ConceptCarousel } from '@/components/ConceptCarousel'
import { concepts, conceptCategories } from '@/data/concepts'
import styles from '../page.module.css'

export default function JSConceptsPage() {
  const search = usePageSearch('js')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'JavaScript' }
      ]} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>JavaScript Concepts</h1>
          <p className={styles.subtitle}>
            Core JS mechanics: Closures, Event Loop, Prototypes, This keyword, and runtime internals.
          </p>
        </header>

        <PageSearchControls
          search={search}
          placeholder="Search JavaScript concepts..."
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
                emptyMessage="No JavaScript concepts match your search criteria"
              />
            </div>
          </section>
        ) : (
          <>
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

                  <ConceptCarousel concepts={categoryConcepts} />
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
