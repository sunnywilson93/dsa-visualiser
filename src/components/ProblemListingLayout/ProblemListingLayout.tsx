'use client'

import { useMemo, useState, ReactNode } from 'react'
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { ProblemCard } from '@/components/ProblemCard'
import type { CodeExample } from '@/data/examples'
import styles from './ProblemListingLayout.module.css'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'
type SortOrder = 'none' | 'asc' | 'desc'

const difficultyOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 }

export interface CategoryInfo {
  id: string
  name: string
}

export interface ProblemListingConfig {
  title: string
  subtitle: string
  iconId: string
  breadcrumbs: Array<{ label: string; href?: string }>
}

export interface ProblemListingLayoutProps {
  config: ProblemListingConfig
  problems: CodeExample[]
  getCategoryForProblem: (problem: CodeExample) => CategoryInfo
  getProblemHref?: (problem: CodeExample) => string
  onProblemClick?: (problem: CodeExample) => void
  onCategoryClick?: (problem: CodeExample, category: CategoryInfo) => void
  categoryFilters?: Array<{ id: string; name: string; count: number }>
  selectedCategory?: string | null
  onCategoryFilterChange?: (categoryId: string | null) => void
  renderBeforeGrid?: ReactNode
  emptyState?: ReactNode
}

export function ProblemListingLayout({
  config,
  problems,
  getCategoryForProblem,
  getProblemHref,
  onProblemClick,
  onCategoryClick,
  categoryFilters,
  selectedCategory,
  onCategoryFilterChange,
  renderBeforeGrid,
  emptyState,
}: ProblemListingLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')

  const filteredProblems = useMemo(() => {
    let result = problems

    if (selectedDifficulty !== 'all') {
      result = result.filter((p) => p.difficulty === selectedDifficulty)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    if (selectedDifficulty === 'all' && sortOrder !== 'none') {
      result = [...result].sort((a, b) => {
        const diff = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        return sortOrder === 'asc' ? diff : -diff
      })
    }

    return result
  }, [problems, searchQuery, selectedDifficulty, sortOrder])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedDifficulty !== 'all'

  const cycleSortOrder = () => {
    setSortOrder((current) => {
      if (current === 'none') return 'asc'
      if (current === 'asc') return 'desc'
      return 'none'
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDifficulty('all')
    setSortOrder('none')
  }

  const SortIcon = sortOrder === 'asc' ? ArrowUp : sortOrder === 'desc' ? ArrowDown : ArrowUpDown

  return (
    <div className={styles.container}>
      <NavBar breadcrumbs={config.breadcrumbs} />

      <header className={styles.header}>
        <span className={styles.icon}>
          <ConceptIcon conceptId={config.iconId} size={32} />
        </span>
        <div>
          <h1 className={styles.title}>{config.title}</h1>
          <p className={styles.subtitle}>{config.subtitle}</p>
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
              onClick={() => {
                setSelectedDifficulty(diff)
                if (diff !== 'all') setSortOrder('none')
              }}
              data-difficulty={diff}
            >
              {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.sortButton} ${sortOrder !== 'none' ? styles.sortActive : ''} ${selectedDifficulty !== 'all' ? styles.hidden : ''}`}
          onClick={cycleSortOrder}
          aria-label={`Sort by difficulty: ${sortOrder === 'none' ? 'unsorted' : sortOrder === 'asc' ? 'easy to hard' : 'hard to easy'}`}
          title={sortOrder === 'none' ? 'Sort by difficulty' : sortOrder === 'asc' ? 'Easy → Hard' : 'Hard → Easy'}
          tabIndex={selectedDifficulty !== 'all' ? -1 : undefined}
        >
          <SortIcon size={16} />
        </button>

        <span className={`${styles.resultCount} ${!hasActiveFilters ? styles.hidden : ''}`}>
          {filteredProblems.length}
        </span>

        <button
          type="button"
          className={`${styles.clearButton} ${!hasActiveFilters ? styles.hidden : ''}`}
          onClick={clearFilters}
          aria-label="Clear filters"
          tabIndex={!hasActiveFilters ? -1 : undefined}
        >
          <X size={16} />
        </button>
      </div>

      {categoryFilters && categoryFilters.length > 0 && (
        <div className={styles.categoryFilters}>
          <button
            className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => onCategoryFilterChange?.(null)}
          >
            All Categories
            <span className={styles.categoryCount}>({problems.length})</span>
          </button>
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
              onClick={() => onCategoryFilterChange?.(cat.id)}
            >
              <ConceptIcon conceptId={cat.id} size={16} />
              <span>{cat.name}</span>
              <span className={styles.categoryCount}>({cat.count})</span>
            </button>
          ))}
        </div>
      )}

      {renderBeforeGrid}

      <main className={styles.main}>
        <div className={styles.problemCount}>
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
        </div>

        {filteredProblems.length === 0 ? (
          emptyState || <div className={styles.empty}>No problems match your filters</div>
        ) : (
          <div className={styles.problemGrid}>
            {filteredProblems.map((problem) => {
              const category = getCategoryForProblem(problem)
              const href = getProblemHref?.(problem)
              const commonProps = {
                problem,
                category,
                onCategoryClick: onCategoryClick
                  ? () => onCategoryClick(problem, category)
                  : undefined,
                categoryAriaLabel: `Filter to ${category.name}`,
              }

              return href ? (
                <ProblemCard key={problem.id} {...commonProps} href={href} />
              ) : (
                <ProblemCard
                  key={problem.id}
                  {...commonProps}
                  onClick={() => onProblemClick?.(problem)}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
