'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { ProblemCard } from '@/components/ProblemCard'
import {
  exampleCategories,
  getAllJsExamples,
  type CodeExample,
} from '@/data/examples'
import styles from '../[categoryId]/page.module.css'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

const jsCategories = exampleCategories.filter((category) => category.id !== 'dsa')
const jsCategoryMap = new Map(jsCategories.map((category) => [category.id, category]))

const getProblemCategories = (problem: CodeExample) => problem.categories || [problem.category]

export default function JSProblemsPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allProblems = useMemo(() => getAllJsExamples(), [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProblems.forEach((problem) => {
      getProblemCategories(problem).forEach((categoryId) => {
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })
    })
    return counts
  }, [allProblems])

  const filteredProblems = useMemo(() => {
    let problems = allProblems

    if (selectedCategory) {
      problems = problems.filter((problem) =>
        getProblemCategories(problem).includes(selectedCategory)
      )
    }

    if (selectedDifficulty !== 'all') {
      problems = problems.filter((problem) => problem.difficulty === selectedDifficulty)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      problems = problems.filter(
        (problem) =>
          problem.name.toLowerCase().includes(query) ||
          problem.description.toLowerCase().includes(query)
      )
    }

    return problems
  }, [allProblems, searchQuery, selectedCategory, selectedDifficulty])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedDifficulty !== 'all' || Boolean(selectedCategory)

  return (
    <div className={styles.container}>
      <NavBar breadcrumbs={[{ label: 'All JS Problems' }]} />

      <header className={styles.header}>
        <span className={styles.icon}>
          <ConceptIcon conceptId="js-core" size={32} />
        </span>
        <div>
          <h1 className={styles.title}>All JavaScript Problems</h1>
          <p className={styles.subtitle}>
            {allProblems.length} problems across {jsCategories.length} categories
          </p>
        </div>
      </header>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search problems"
        />

        <div className={styles.divider} />

        <div className={styles.filterChips}>
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              className={`${styles.chip} ${selectedDifficulty === diff ? styles.chipActive : ''}`}
              onClick={() => setSelectedDifficulty(diff)}
              data-difficulty={diff}
            >
              {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <span className={styles.resultCount}>{filteredProblems.length}</span>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              setSearchQuery('')
              setSelectedDifficulty('all')
              setSelectedCategory(null)
            }}
            aria-label="Clear filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className={styles.subcategories}>
        <button
          className={`${styles.subcatBtn} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
          <span className={styles.subcatCount}>({allProblems.length})</span>
        </button>
        {jsCategories.map((category) => (
          <button
            key={category.id}
            className={`${styles.subcatBtn} ${
              selectedCategory === category.id ? styles.active : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <ConceptIcon conceptId={category.id} size={16} />
            <span>{category.name}</span>
            <span className={styles.subcatCount}>
              ({categoryCounts[category.id] || 0})
            </span>
          </button>
        ))}
      </div>

      <main className={styles.main}>
        {filteredProblems.length > 0 && (
          <div className={styles.problemCount}>
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
          </div>
        )}

        {filteredProblems.length === 0 ? (
          <div className={styles.empty}>No problems match your filters</div>
        ) : (
          <div className={styles.problemGrid}>
            {filteredProblems.map((problem) => {
              const category = jsCategoryMap.get(problem.category)
              const targetCategory = selectedCategory || problem.category
              const problemHref = `/${targetCategory}/${problem.id}`
              const categoryMeta = {
                id: category?.id || 'js-core',
                name: category?.name || 'JavaScript',
              }
              return (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  href={problemHref}
                  category={categoryMeta}
                  onCategoryClick={
                    category?.id
                      ? () => {
                          setSelectedCategory((current) =>
                            current === category.id ? null : category.id
                          )
                        }
                      : undefined
                  }
                  categoryAriaLabel={
                    category?.name ? `Filter to ${category.name}` : undefined
                  }
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
