'use client'

import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { reactConcepts, reactConceptCategories } from '@/data/reactConcepts'

export default function ReactConceptsClient() {
  const search = usePageSearch('react')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'React' }
      ]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-glow-brand max-lg:text-3xl max-md:text-[1.75rem]">
            React Concepts
          </h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Master React through interactive visualizations. Explore hooks, rendering, patterns, and performance.
          </p>
        </header>

        <PageSearchControls
          search={search}
          placeholder="Search React concepts..."
        />

        {hasActiveFilters ? (
          <section className="mb-12">
            <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
              <span className="text-xl drop-shadow-glow-white-sm">
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
                emptyMessage="No React concepts match your search criteria"
              />
            </div>
          </section>
        ) : (
          <>
            {reactConceptCategories.map((category) => {
              const categoryConcepts = reactConcepts.filter(c => c.category === category.id)
              if (categoryConcepts.length === 0) return null

              return (
                <section key={category.id} className="mb-12">
                  <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                    <span className="text-xl drop-shadow-glow-white-sm">
                      <ConceptIcon conceptId={category.id} size={20} />
                    </span>
                    {category.label}
                    <span className="text-xs font-medium text-text-muted bg-white-5 px-2 py-0.5 rounded-full">
                      {categoryConcepts.length}
                    </span>
                  </h2>

                  <CardCarousel itemCount={categoryConcepts.length}>
                    {categoryConcepts.map((concept, index) => (
                      <Card
                        key={concept.id}
                        href={`/concepts/react/${concept.id}`}
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
        <p className="m-0 mb-2">
          {reactConcepts.length} concepts across {reactConceptCategories.length} topics
        </p>
        <Link
          href="/concepts/js"
          className="inline-flex items-center gap-1.5 text-brand-primary hover:text-brand-secondary transition-colors no-underline text-sm font-medium"
        >
          Explore JavaScript Concepts
          <ArrowRight size={14} />
        </Link>
      </footer>
    </div>
  )
}
