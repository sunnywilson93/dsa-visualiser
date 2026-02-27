'use client'

import { useMemo, useState, ReactNode } from 'react'
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { ProblemCard } from '@/components/ProblemCard'
import type { CodeExample } from '@/data/examples'

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

  const getDifficultyChipClasses = (diff: Difficulty) => {
    const baseClasses = 'flex items-center justify-center bg-transparent border-none font-medium text-sm py-1 px-2.5 rounded-md cursor-pointer transition-all duration-150'
    
    if (selectedDifficulty !== diff) {
      return `${baseClasses} text-text-muted hover:bg-brand-primary-5 hover:text-text-secondary`
    }
    
    // Active states
    if (diff === 'easy') {
      return `${baseClasses} bg-[var(--difficulty-easy-bg)] text-[color:var(--difficulty-easy)]`
    }
    if (diff === 'medium') {
      return `${baseClasses} bg-[var(--difficulty-medium-bg)] text-[color:var(--difficulty-medium)]`
    }
    if (diff === 'hard') {
      return `${baseClasses} bg-[var(--difficulty-hard-bg)] text-[color:var(--difficulty-hard)]`
    }
    return `${baseClasses} bg-brand-primary-20 text-brand-light`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-page to-bg-page-secondary flex flex-col">
      <NavBar breadcrumbs={config.breadcrumbs} />

      <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-[2.5rem] font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-[0_0_20px_var(--color-brand-primary-30)] max-lg:text-3xl max-md:text-[1.75rem]">
            {config.title}
          </h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            {config.subtitle}
          </p>
        </header>

        <div className="group flex items-center gap-3 bg-bg-secondary border border-border-primary rounded-xl px-4 py-3 mb-6 transition-all focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary/50 flex-wrap md:flex-nowrap">
          <Search size={18} className="text-text-muted shrink-0 transition-colors group-focus-within:text-accent-primary order-0" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[120px] md:min-w-0 bg-transparent border-0 outline-none text-base text-text-primary placeholder:text-text-muted order-1 md:order-1"
            aria-label="Search problems"
          />

          <div className="hidden md:block w-px h-5 bg-border-primary shrink-0 order-2" />

          <div className="flex items-center gap-1 shrink-0 order-3 md:order-3">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                className={getDifficultyChipClasses(diff)}
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
            className={`flex items-center justify-center bg-transparent border-0 text-text-muted cursor-pointer p-1.5 rounded-md transition-all shrink-0 hover:text-text-secondary hover:bg-brand-primary-5 order-5 md:order-5 ${sortOrder !== 'none' ? 'text-brand-light bg-brand-primary-10' : ''} ${selectedDifficulty !== 'all' ? 'invisible pointer-events-none' : ''}`}
            onClick={cycleSortOrder}
            aria-label={`Sort by difficulty: ${sortOrder === 'none' ? 'unsorted' : sortOrder === 'asc' ? 'easy to hard' : 'hard to easy'}`}
            title={sortOrder === 'none' ? 'Sort by difficulty' : sortOrder === 'asc' ? 'Easy → Hard' : 'Hard → Easy'}
            tabIndex={selectedDifficulty !== 'all' ? -1 : undefined}
          >
            <SortIcon size={16} />
          </button>

          {(hasActiveFilters) && (
            <span className="text-xs font-medium text-text-primary bg-bg-tertiary border border-border-primary px-2 py-1 rounded-md shrink-0 order-4 md:order-4 min-w-[1.5rem] text-center tabular-nums">
              {filteredProblems.length}
            </span>
          )}

          <button
            type="button"
            className={`flex items-center justify-center bg-transparent border-0 text-text-muted hover:text-error hover:bg-error/10 cursor-pointer p-1 rounded-md transition-all shrink-0 order-2 md:order-6 ml-auto md:ml-0 ${!hasActiveFilters ? 'invisible pointer-events-none' : ''}`}
            onClick={clearFilters}
            aria-label="Clear filters"
            tabIndex={!hasActiveFilters ? -1 : undefined}
          >
            <X size={16} />
          </button>
        </div>

      {categoryFilters && categoryFilters.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-border-primary bg-transparent text-text-muted text-sm cursor-pointer transition-all hover:border-border-secondary hover:text-text-secondary ${!selectedCategory ? 'bg-accent-primary/15 border-accent-primary/40 text-accent-primary' : ''}`}
            onClick={() => onCategoryFilterChange?.(null)}
          >
            All Categories
            <span className="opacity-70">({problems.length})</span>
          </button>
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-border-primary bg-transparent text-text-muted text-sm cursor-pointer transition-all hover:border-border-secondary hover:text-text-secondary ${selectedCategory === cat.id ? 'bg-accent-primary/15 border-accent-primary/40 text-accent-primary' : ''}`}
              onClick={() => onCategoryFilterChange?.(cat.id)}
            >
              <ConceptIcon conceptId={cat.id} size={16} />
              <span>{cat.name}</span>
              <span className="opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      )}

      {renderBeforeGrid}

      <section>
        <h2 className="flex items-center gap-4 text-xl font-semibold text-text-bright m-0 mb-4 max-md:flex-wrap">
          <span className="text-xl drop-shadow-glow-white-sm">
            <ConceptIcon conceptId={config.iconId} size={20} />
          </span>
          Problems
          <span className="text-base font-normal text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:mt-1">
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
          </span>
        </h2>

        {filteredProblems.length === 0 ? (
          emptyState || <div className="text-center py-12 text-text-muted">No problems match your filters</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 max-md:gap-3">
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
      </section>
      </main>
    </div>
  )
}
