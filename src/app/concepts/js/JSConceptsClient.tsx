'use client'

import { Search } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { concepts, conceptCategories, subcategories } from '@/data/concepts'

export default function JSConceptsClient() {
  const search = usePageSearch('js')
  const hasActiveFilters = search.isSearching || search.filters.difficulty !== 'all'

  // Group fundamentals by subcategory
  const fundamentalsConcepts = concepts.filter(c => c.category === 'fundamentals')
  const subcategoriesList = Object.entries(subcategories)
    .sort((a, b) => a[1].order - b[1].order)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'JavaScript' }
      ]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-glow-brand max-lg:text-3xl max-md:text-[1.75rem]">
            JavaScript Concepts
          </h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Master JavaScript through organized learning paths. Explore concepts by topic.
          </p>
        </header>

        <PageSearchControls
          search={search}
          placeholder="Search JavaScript concepts..."
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
                emptyMessage="No JavaScript concepts match your search criteria"
              />
            </div>
          </section>
        ) : (
          <>
            {conceptCategories.map((category) => {
              const categoryConcepts = concepts.filter(c => c.category === category.id)
              if (categoryConcepts.length === 0) return null

              // Special handling for fundamentals - use accordion by subcategory
              if (category.id === 'fundamentals') {
                return (
                  <section key={category.id} className="mb-12">
                    <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                      <span className="text-xl drop-shadow-glow-white-sm">
                        <ConceptIcon conceptId={category.id} size={20} />
                      </span>
                      {category.name}
                      <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
                        {category.description}
                      </span>
                    </h2>

                    {subcategoriesList.map(([subcategoryId, subcategory]) => {
                      const subcategoryConcepts = fundamentalsConcepts.filter(
                        c => c.subcategory === subcategoryId
                      )
                      if (subcategoryConcepts.length === 0) return null

                      return (
                        <div key={subcategoryId} className="mb-8">
                          <h3 className="flex items-center gap-3 text-lg font-semibold text-text-bright m-0 mb-3">
                            <ConceptIcon conceptId={subcategoryConcepts[0]?.id || subcategoryId} size={20} />
                            {subcategory.name}
                            <span className="text-sm font-normal text-text-muted ml-auto">
                              {subcategory.description}
                            </span>
                          </h3>
                          <CardCarousel itemCount={subcategoryConcepts.length}>
                            {subcategoryConcepts.map((concept, index) => (
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
                        </div>
                      )
                    })}
                  </section>
                )
              }

              // Default handling for other categories
              return (
                <section key={category.id} className="mb-12">
                  <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
                    <span className="text-xl drop-shadow-glow-white-sm">
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
