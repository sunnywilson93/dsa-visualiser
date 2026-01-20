'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, BookOpen } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import {
  exampleCategories,
  dsaSubcategories,
  getExamplesByCategory,
  type CodeExample,
} from '@/data/examples'
import styles from './page.module.css'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

// Map subcategories to related DSA concepts
const subcategoryToConcept: Record<string, { id: string; name: string }> = {
  'bit-manipulation': { id: 'binary-system', name: 'Binary & Bit Manipulation' },
  'arrays-hashing': { id: 'hash-tables', name: 'Hash Tables' },
  'stack': { id: 'stacks', name: 'Stacks' },
  'linked-list': { id: 'linked-lists', name: 'Linked Lists' },
  'trees': { id: 'trees', name: 'Trees' },
  'heap': { id: 'heaps', name: 'Heaps' },
  'graphs': { id: 'graphs', name: 'Graphs' },
}

export default function CategoryPageClient() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const category = exampleCategories.find((c) => c.id === categoryId)
  const isDsa = categoryId === 'dsa'

  const allProblems = useMemo(() => {
    if (!categoryId) return []
    return getExamplesByCategory(categoryId)
  }, [categoryId])

  // Problems for selected subcategory (before search/difficulty filters)
  const subcategoryProblems = useMemo(() => {
    if (!selectedSubcategory) return allProblems
    return allProblems.filter((p) => p.category === selectedSubcategory)
  }, [allProblems, selectedSubcategory])

  const filteredProblems = useMemo(() => {
    let problems = subcategoryProblems

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      problems = problems.filter((p) => p.difficulty === selectedDifficulty)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      problems = problems.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    return problems
  }, [subcategoryProblems, selectedDifficulty, searchQuery])

  // Check if subcategory has no problems at all (Coming Soon)
  const isComingSoon = selectedSubcategory && subcategoryProblems.length === 0

  const handleSelectProblem = (problem: CodeExample) => {
    router.push(`/${categoryId}/${problem.id}`)
  }

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

  return (
    <div className={styles.container}>
      <NavBar breadcrumbs={[{ label: category.name }]} />

      <header className={styles.header}>
        <span className={styles.icon}>
          <ConceptIcon conceptId={category.id} size={32} />
        </span>
        <div>
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.subtitle}>{category.description}</p>
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.difficultyFilter}>
          <button
            className={`${styles.difficultyBtn} ${selectedDifficulty === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedDifficulty('all')}
            title="All difficulties"
          >
            <span className={styles.filterDots}>
              <span className={styles.filterDot} style={{ background: 'var(--difficulty-1)' }} />
              <span className={styles.filterDot} style={{ background: 'var(--difficulty-2)' }} />
              <span className={styles.filterDot} style={{ background: 'var(--difficulty-3)' }} />
            </span>
          </button>
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              className={`${styles.difficultyBtn} ${styles[diff]} ${
                selectedDifficulty === diff ? styles.active : ''
              }`}
              onClick={() => setSelectedDifficulty(diff)}
              title={diff}
            >
              <DifficultyIndicator level={diff} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {isDsa && (
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
              className={`${styles.subcatBtn} ${
                selectedSubcategory === sub.id ? styles.active : ''
              }`}
              onClick={() => setSelectedSubcategory(sub.id)}
            >
              <ConceptIcon conceptId={sub.id} size={16} />
              <span>{sub.name}</span>
            </button>
          ))}
        </div>
      )}

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

      <main className={styles.main}>
        {!isComingSoon && filteredProblems.length > 0 && (
          <div className={styles.problemCount}>
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
          </div>
        )}

        {isComingSoon ? (
          <div className={styles.comingSoon}>
            <div className={styles.comingSoonIcon}>
              <Clock size={48} strokeWidth={1.5} />
            </div>
            <h3 className={styles.comingSoonTitle}>Coming Soon</h3>
            <p className={styles.comingSoonText}>
              We&apos;re working on adding {dsaSubcategories.find(s => s.id === selectedSubcategory)?.name || 'these'} problems.
              <br />
              Check back soon!
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className={styles.empty}>No problems match your filters</div>
        ) : (
          <div className={styles.problemGrid}>
            {filteredProblems.map((problem) => (
              <button
                key={problem.id}
                className={styles.problemCard}
                onClick={() => handleSelectProblem(problem)}
              >
                <div className={styles.problemHeader}>
                  <span className={styles.problemName}>{problem.name}</span>
                  <DifficultyIndicator level={problem.difficulty} size="sm" />
                </div>
                <p className={styles.problemDesc}>{problem.description}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
