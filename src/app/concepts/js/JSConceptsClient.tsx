'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { SearchResultsList } from '@/components/Search'
import { usePageSearch } from '@/components/Search'
import { PageSearchControls } from '@/components/Search/PageSearchControls'
import { ConceptIcon } from '@/components/Icons'
import { Card, CardCarousel } from '@/components/Card'
import { concepts, conceptCategories, subcategories } from '@/data/concepts'

// Subcategory grouping component
function SubcategoryAccordion({ 
  subcategoryId, 
  subcategory, 
  concepts 
}: { 
  subcategoryId: string
  subcategory: { name: string; description: string; order: number }
  concepts: typeof import('@/data/concepts').concepts
}) {
  const [isOpen, setIsOpen] = useState(subcategory.order === 1) // Open first by default

  if (concepts.length === 0) return null

  return (
    <div className="mb-6 border border-white/10 rounded-xl overflow-hidden bg-black/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            <ConceptIcon conceptId={concepts[0]?.id || subcategoryId} size={24} />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-white">{subcategory.name}</h3>
            <p className="text-sm text-gray-400">{subcategory.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{concepts.length} concepts</span>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0">
          <CardCarousel itemCount={concepts.length}>
            {concepts.map((concept, index) => (
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
      )}
    </div>
  )
}

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

      <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-[2.5rem] font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-[0_0_20px_var(--color-brand-primary-30)] max-lg:text-3xl max-md:text-[1.75rem]">
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

              // Special handling for fundamentals - use accordion by subcategory
              if (category.id === 'fundamentals') {
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

                    {subcategoriesList.map(([subcategoryId, subcategory]) => {
                      const subcategoryConcepts = fundamentalsConcepts.filter(
                        c => c.subcategory === subcategoryId
                      )
                      if (subcategoryConcepts.length === 0) return null

                      return (
                        <SubcategoryAccordion
                          key={subcategoryId}
                          subcategoryId={subcategoryId}
                          subcategory={subcategory}
                          concepts={subcategoryConcepts}
                        />
                      )
                    })}
                  </section>
                )
              }

              // Default handling for other categories
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
