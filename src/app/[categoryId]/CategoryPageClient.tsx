'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { PageLayout } from '@/components/ui'
import { ConceptIcon } from '@/components/Icons'
import {
  ProblemListingLayout,
  type CategoryInfo,
} from '@/components/ProblemListingLayout'
import {
  exampleCategories,
  dsaSubcategories,
  getExamplesByCategory,
  hasCategory,
  getExampleCategoryIds,
  type CodeExample,
} from '@/data/examples'


const subcategoryToConcept: Record<string, { id: string; name: string }> = {
  'bit-manipulation': { id: 'binary-system', name: 'Binary & Bit Manipulation' },
  'arrays-hashing': { id: 'hash-tables', name: 'Hash Tables' },
  'recursion': { id: 'recursion', name: 'Recursion' },
  'backtracking': { id: 'backtracking', name: 'Backtracking' },
  'stack': { id: 'stacks', name: 'Stacks' },
  'linked-list': { id: 'linked-lists', name: 'Linked Lists' },
  'trees': { id: 'trees', name: 'Trees' },
  'heap': { id: 'heap', name: 'Heap' },
  'graphs': { id: 'graphs', name: 'Graphs' },
}

const dsaSubcategoryMap = new Map(dsaSubcategories.map((s) => [s.id, s]))
const categoryMap = new Map(exampleCategories.map((c) => [c.id, c]))

// Check if a category ID is a DSA subcategory
const isDsaSubcategoryId = (id: string) => dsaSubcategoryMap.has(id)

// Find category from either main categories or DSA subcategories
const findCategory = (id: string) => {
  const mainCat = exampleCategories.find((c) => c.id === id)
  if (mainCat) return mainCat
  const subCat = dsaSubcategories.find((s) => s.id === id)
  if (subCat) return { ...subCat, description: `Practice ${subCat.name} problems` }
  return null
}

export default function CategoryPageClient() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const category = findCategory(categoryId)
  const isDsa = categoryId === 'dsa'
  const isSubcategoryPage = isDsaSubcategoryId(categoryId)

  const allProblems = useMemo(() => {
    if (!categoryId) return []
    return getExamplesByCategory(categoryId)
  }, [categoryId])

  const subcategoryProblems = useMemo(() => {
    // If viewing a subcategory page directly, show all problems for that subcategory
    if (isSubcategoryPage) return allProblems
    // If on DSA page with subcategory filter selected
    if (!selectedSubcategory) return allProblems
    return allProblems.filter((p) => hasCategory(p, selectedSubcategory))
  }, [allProblems, selectedSubcategory, isSubcategoryPage])

  const isComingSoon = (selectedSubcategory || isSubcategoryPage) && subcategoryProblems.length === 0

  const getCategoryForProblem = useCallback((problem: CodeExample): CategoryInfo => {
    if (isSubcategoryPage && hasCategory(problem, categoryId)) {
      const directSubcat = dsaSubcategoryMap.get(categoryId)
      if (directSubcat) return { id: directSubcat.id, name: directSubcat.name }
    }

    if (selectedSubcategory && hasCategory(problem, selectedSubcategory)) {
      const selected = dsaSubcategoryMap.get(selectedSubcategory)
      if (selected) return { id: selected.id, name: selected.name }
    }

    const directSubcategory = getExampleCategoryIds(problem).find((cat) => isDsaSubcategoryId(cat))
    if (directSubcategory) {
      const dsaSub = dsaSubcategoryMap.get(directSubcategory)
      if (dsaSub) return { id: dsaSub.id, name: dsaSub.name }
    }

    const subcat = dsaSubcategoryMap.get(problem.category)
    const mainCat = categoryMap.get(problem.category)
    if (subcat) return { id: subcat.id, name: subcat.name }
    if (mainCat) return { id: mainCat.id, name: mainCat.name }
    return { id: problem.category, name: problem.category }
  }, [categoryId, isSubcategoryPage, selectedSubcategory])

  const handleProblemClick = useCallback(
    (problem: CodeExample) => {
      const urlCategory =
        isDsa && selectedSubcategory && hasCategory(problem, selectedSubcategory)
          ? selectedSubcategory
          : categoryId
      router.push(`/${urlCategory}/${problem.id}`)
    },
    [categoryId, isDsa, router, selectedSubcategory]
  )

  const handleCategoryClick = useCallback(
    (_problem: CodeExample, category: CategoryInfo) => {
      if (isDsa) {
        setSelectedSubcategory((current) =>
          current === category.id ? null : category.id
        )
      }
    },
    [isDsa]
  )

  if (!category) {
    return (
      <PageLayout variant="wide">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-text-muted">
          <h2 className="text-text-bright">Category not found</h2>
          <Link href="/" className="text-brand-primary no-underline text-base">
            Back to Home
          </Link>
        </div>
      </PageLayout>
    )
  }

  // Show subcategory filters only on the main DSA page, not on individual subcategory pages
  const renderDsaSubcategories = isDsa ? (
    <>
      <div className="py-4 px-8 flex gap-2 flex-wrap container-default mx-auto w-full max-lg:py-3 max-lg:px-6 max-md:py-3 max-md:px-4">
        <button
          className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-3xl border border-white-10 bg-transparent text-text-muted text-sm cursor-pointer transition-all duration-150 hover:border-white-20 hover:text-text-secondary ${!selectedSubcategory ? 'bg-brand-primary-15 border-brand-primary-40 text-brand-primary' : ''}`}
          onClick={() => setSelectedSubcategory(null)}
        >
          All Topics
        </button>
        {dsaSubcategories.map((sub) => (
          <button
            key={sub.id}
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-3xl border border-white-10 bg-transparent text-text-muted text-sm cursor-pointer transition-all duration-150 hover:border-white-20 hover:text-text-secondary ${selectedSubcategory === sub.id ? 'bg-brand-primary-15 border-brand-primary-40 text-brand-primary' : ''}`}
            onClick={() => setSelectedSubcategory(sub.id)}
          >
            <ConceptIcon conceptId={sub.id} size={16} />
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {selectedSubcategory && subcategoryToConcept[selectedSubcategory] && (
        <div className="py-3 px-8 container-default mx-auto w-full max-lg:px-6 max-md:px-4">
          <Link
            href={`/concepts/dsa/${subcategoryToConcept[selectedSubcategory].id}`}
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-brand-primary-10 border border-brand-primary-25 rounded-md text-brand-light text-base font-medium no-underline transition-all duration-150 hover:bg-brand-primary-20 hover:border-brand-primary-40 hover:text-brand-light group"
          >
            <BookOpen size={14} />
            <span>Learn {subcategoryToConcept[selectedSubcategory].name}</span>
            <span className="opacity-60 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">→</span>
          </Link>
        </div>
      )}
    </>
  ) : null

  // Show "Learn X" link on subcategory pages if a concept exists
  const renderSubcategoryLearnLink = isSubcategoryPage && subcategoryToConcept[categoryId] ? (
    <div className="py-3 px-8 container-default mx-auto w-full max-lg:px-6 max-md:px-4">
      <Link
        href={`/concepts/dsa/${subcategoryToConcept[categoryId].id}`}
        className="inline-flex items-center gap-2 py-2 px-3.5 bg-brand-primary-10 border border-brand-primary-25 rounded-md text-brand-light text-base font-medium no-underline transition-all duration-150 hover:bg-brand-primary-20 hover:border-brand-primary-40 hover:text-brand-light group"
      >
        <BookOpen size={14} />
        <span>Learn {subcategoryToConcept[categoryId].name}</span>
        <span className="opacity-60 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">→</span>
      </Link>
    </div>
  ) : null

  const comingSoonState = isComingSoon ? (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gradient-to-br from-brand-primary-8 to-brand-primary-8 border border-dashed border-brand-primary-30 rounded-2xl">
      <div className="text-brand-primary-50 mb-4">
        <Clock size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-brand-light m-0 mb-2">Coming Soon</h3>
      <p className="text-base text-text-muted m-0 leading-relaxed">
        We&apos;re working on adding{' '}
        {dsaSubcategories.find((s) => s.id === selectedSubcategory)?.name || 'these'}{' '}
        problems.
        <br />
        Check back soon!
      </p>
    </div>
  ) : undefined

  // Build breadcrumbs based on page type
  const breadcrumbs = isSubcategoryPage
    ? [{ label: 'DSA', path: '/dsa' }, { label: category.name }]
    : [{ label: category.name }]

  return (
    <ProblemListingLayout
      config={{
        title: category.name,
        subtitle: category.description,
        iconId: category.id,
        breadcrumbs,
      }}
      problems={subcategoryProblems}
      getCategoryForProblem={getCategoryForProblem}
      onProblemClick={handleProblemClick}
      onCategoryClick={isDsa ? handleCategoryClick : undefined}
      renderBeforeGrid={isSubcategoryPage ? renderSubcategoryLearnLink : renderDsaSubcategories}
      emptyState={comingSoonState}
    />
  )
}
