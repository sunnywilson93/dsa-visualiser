'use client'

import { Search } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { concepts, conceptCategories } from '@/data/concepts'

export default function JSConceptsClient() {
  const search = usePageSearch('js')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'JavaScript' }
      ]} />

      <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-[2.5rem] font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-[0_0_20px_var(--color-brand-primary-30)] max-lg:text-3xl max-md:text-[1.75rem]">
            JavaScript Concepts
          </h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Core JS mechanics: Closures, Event Loop, Prototypes, This keyword, and runtime internals.
          </p>
        </header>

        <PageSearchControls
          search={search}
          placeholder="Search JavaScript concepts..."
        />

        {hasActiveFilters ? (
          <section className="mb-12">
            <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
              <span className="text-xl drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                <Search size={20} />
              </span>
              Search Results
              <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
                {search.results.length} {search.results.length === 1 ? 'concept' : 'concepts'} found
              </span>
            </h2>
            <div className="bg-bg-page-secondary/50 border border-brand-primary-20 rounded-xl p-2">
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
                <section key={category.id} className="mb-12">
                  <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                    <span className="text-xl drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                      <ConceptIcon conceptId={category.id} size={20} />
                    </span>
                    {category.name}
                    <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
                      {category.description}
                    </span>
                  </h2>

                  <CardCarousel itemCount={categoryConcepts.length}>
                    {categoryConcepts.map((concept, index) => (
                      <Card
                        key={concept.id}
                        href={`/concepts/${concept.id}`}
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
          </>
        )}
      </main>

      <footer className="text-center p-8 text-text-muted text-base max-md:p-6">
        <p>More concepts coming soon!</p>
      </footer>
    </div>
  )
}
