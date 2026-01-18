'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import {
  exampleCategories,
  dsaSubcategories,
  getExamplesByCategory,
  type CodeExample,
} from '@/data/examples'
import styles from './page.module.css'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

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

  const filteredProblems = useMemo(() => {
    let problems = allProblems

    // Filter by subcategory (for DSA)
    if (selectedSubcategory) {
      problems = problems.filter((p) => p.category === selectedSubcategory)
    }

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
  }, [allProblems, selectedSubcategory, selectedDifficulty, searchQuery])

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
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              className={`${styles.difficultyBtn} ${styles[diff]} ${
                selectedDifficulty === diff ? styles.active : ''
              }`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
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

      <main className={styles.main}>
        <div className={styles.problemCount}>
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
        </div>

        {filteredProblems.length === 0 ? (
          <div className={styles.empty}>No problems found</div>
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
                  <span
                    className={`${styles.difficultyBadge} ${styles[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
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
