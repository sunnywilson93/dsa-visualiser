'use client'

import Link from 'next/link'
import { Search, Layers, ArrowRight, Map } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList, usePageSearch, PageSearchControls } from '@/components/Search'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'

export default function DSAConceptsClient() {
  const search = usePageSearch('dsa')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'DSA' }
      ]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-glow-brand max-lg:text-3xl max-md:text-[1.75rem]">
            DSA Concepts
          </h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Master the fundamentals of Data Structures &amp; Algorithms.
            <br />
            Build a strong foundation before tackling patterns and problems.
          </p>
        </header>

        <Link
          href="/concepts/dsa/roadmap"
          className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border border-brand-primary-20 bg-brand-primary-5 no-underline transition-all duration-200 hover:border-brand-primary-40 hover:bg-brand-primary-10 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
        >
          <Map size={18} className="text-brand-primary shrink-0" />
          <span className="text-sm font-medium text-text-bright">DSA Learning Roadmap</span>
          <span className="text-xs text-text-muted hidden sm:inline">Step-by-step path from foundations to advanced patterns</span>
          <ArrowRight size={14} className="text-brand-primary ml-auto shrink-0" />
        </Link>

        <PageSearchControls
          search={search}
          placeholder="Search DSA concepts..."
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
                <section key={category.id} className="mb-12">
                  <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                    <span className="text-xl text-brand-primary drop-shadow-glow-white-sm">
                      <ConceptIcon conceptId={category.id} size={20} />
                    </span>
                    {category.name}
                    <span className="text-xs font-medium text-text-muted bg-white-5 px-2 py-0.5 rounded-full">
                      {categoryConcepts.length}
                    </span>
                    <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
                      {category.description}
                    </span>
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

            <section className="mb-12">
              <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                <span className="text-xl drop-shadow-glow-white-sm">
                  <Layers size={20} />
                </span>
                Algorithm Patterns
                <span className="text-xs font-medium text-text-muted bg-white-5 px-2 py-0.5 rounded-full">
                  {dsaPatterns.length}
                </span>
                <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
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

      <footer className="text-center p-8 text-text-muted text-base max-md:p-6">
        <p className="m-0 mb-2">
          {dsaConcepts.length} concepts across {dsaConceptCategories.length} topics &middot; {dsaPatterns.length} algorithm patterns
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
