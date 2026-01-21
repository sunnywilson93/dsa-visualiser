'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import {
  ProblemListingLayout,
  type CategoryInfo,
} from '@/components/ProblemListingLayout'
import {
  exampleCategories,
  dsaSubcategories,
  getExamplesByCategory,
  type CodeExample,
} from '@/data/examples'
import styles from './page.module.css'

const subcategoryToConcept: Record<string, { id: string; name: string }> = {
  'bit-manipulation': { id: 'binary-system', name: 'Binary & Bit Manipulation' },
  'arrays-hashing': { id: 'hash-tables', name: 'Hash Tables' },
  'stack': { id: 'stacks', name: 'Stacks' },
  'linked-list': { id: 'linked-lists', name: 'Linked Lists' },
  'trees': { id: 'trees', name: 'Trees' },
  'heap': { id: 'heaps', name: 'Heaps' },
  'graphs': { id: 'graphs', name: 'Graphs' },
}

const dsaSubcategoryMap = new Map(dsaSubcategories.map((s) => [s.id, s]))
const categoryMap = new Map(exampleCategories.map((c) => [c.id, c]))

export default function CategoryPageClient() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const category = exampleCategories.find((c) => c.id === categoryId)
  const isDsa = categoryId === 'dsa'

  const allProblems = useMemo(() => {
    if (!categoryId) return []
    return getExamplesByCategory(categoryId)
  }, [categoryId])

  const subcategoryProblems = useMemo(() => {
    if (!selectedSubcategory) return allProblems
    return allProblems.filter((p) => p.category === selectedSubcategory)
  }, [allProblems, selectedSubcategory])

  const isComingSoon = selectedSubcategory && subcategoryProblems.length === 0

  const getCategoryForProblem = useCallback((problem: CodeExample): CategoryInfo => {
    const subcat = dsaSubcategoryMap.get(problem.category)
    const mainCat = categoryMap.get(problem.category)
    if (subcat) return { id: subcat.id, name: subcat.name }
    if (mainCat) return { id: mainCat.id, name: mainCat.name }
    return { id: problem.category, name: problem.category }
  }, [])

  const handleProblemClick = useCallback(
    (problem: CodeExample) => {
      router.push(`/${categoryId}/${problem.id}`)
    },
    [categoryId, router]
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
      <div className={styles.container}>
        <NavBar />
        <div className={styles.notFound}>
          <h2>Category not found</h2>
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const renderDsaSubcategories = isDsa ? (
    <>
      <div className={styles.subcategories}>
        <button
          className={`${styles.subcatBtn} ${!selectedSubcategory ? styles.active : ''}`}
          onClick={() => setSelectedSubcategory(null)}
        >
          All Topics
        </button>
        {dsaSubcategories.map((sub) => (
          <button
            key={sub.id}
            className={`${styles.subcatBtn} ${selectedSubcategory === sub.id ? styles.active : ''}`}
            onClick={() => setSelectedSubcategory(sub.id)}
          >
            <ConceptIcon conceptId={sub.id} size={16} />
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {selectedSubcategory && subcategoryToConcept[selectedSubcategory] && (
        <div className={styles.conceptLinkWrapper}>
          <Link
            href={`/concepts/dsa/${subcategoryToConcept[selectedSubcategory].id}`}
            className={styles.conceptLink}
          >
            <BookOpen size={14} />
            <span>Learn {subcategoryToConcept[selectedSubcategory].name}</span>
            <span className={styles.conceptLinkArrow}>→</span>
          </Link>
        </div>
      )}
    </>
  ) : null

  const comingSoonState = isComingSoon ? (
    <div className={styles.comingSoon}>
      <div className={styles.comingSoonIcon}>
        <Clock size={48} strokeWidth={1.5} />
      </div>
      <h3 className={styles.comingSoonTitle}>Coming Soon</h3>
      <p className={styles.comingSoonText}>
        We&apos;re working on adding{' '}
        {dsaSubcategories.find((s) => s.id === selectedSubcategory)?.name || 'these'}{' '}
        problems.
        <br />
        Check back soon!
      </p>
    </div>
  ) : undefined

  return (
    <ProblemListingLayout
      config={{
        title: category.name,
        subtitle: category.description,
        iconId: category.id,
        breadcrumbs: [{ label: category.name }],
      }}
      problems={subcategoryProblems}
      getCategoryForProblem={getCategoryForProblem}
      onProblemClick={handleProblemClick}
      onCategoryClick={isDsa ? handleCategoryClick : undefined}
      renderBeforeGrid={renderDsaSubcategories}
      emptyState={comingSoonState}
    />
  )
}
