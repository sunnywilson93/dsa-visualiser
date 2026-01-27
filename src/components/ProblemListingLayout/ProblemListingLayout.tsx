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
    const baseClasses = 'flex items-center justify-center bg-transparent border-none font-medium text-sm py-1 px-2.5 rounded-md cursor-pointer transition-all duration-fast'
    
    if (selectedDifficulty !== diff) {
      return `${baseClasses} text-text-muted hover:bg-brand-primary-5 hover:text-text-secondary`
    }
    
    // Active states
    if (diff === 'easy') {
      return `${baseClasses} bg-[rgba(34,197,94,0.15)] text-[#22c55e]`
    }
    if (diff === 'medium') {
      return `${baseClasses} bg-[rgba(234,179,8,0.15)] text-[#eab308]`
    }
    if (diff === 'hard') {
      return `${baseClasses} bg-[rgba(239,68,68,0.15)] text-[#ef4444]`
    }
    return `${baseClasses} bg-brand-primary-20 text-brand-light`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-page to-bg-page-secondary flex flex-col">
      <NavBar breadcrumbs={config.breadcrumbs} />

      <header className="flex items-center gap-4 py-6 px-8 max-w-[1200px] mx-auto w-full max-lg:py-5 max-lg:px-6 max-md:p-4">
        <span className="text-[2.5rem] max-md:text-3xl">
          <ConceptIcon conceptId={config.iconId} size={32} />
        </span>
        <div>
          <h1 className="text-[1.75rem] font-semibold text-white m-0 max-md:text-2xl">{config.title}</h1>
          <p className="text-gray-500 text-base mt-1 m-0">{config.subtitle}</p>
        </div>
      </header>

      <div className="flex items-center gap-3 bg-[rgba(15,15,26,0.8)] border border-brand-primary-25 rounded-xl py-2.5 px-4 my-4 mx-auto max-w-[calc(1200px-4rem)] w-[calc(100%-4rem)] transition-all duration-normal focus-within:border-brand-primary-50 focus-within:shadow-[0_0_0_1px_rgba(168,85,247,0.1),0_0_20px_rgba(168,85,247,0.15)] max-lg:max-w-[calc(100%-3rem)] max-lg:w-[calc(100%-3rem)] max-md:flex-wrap max-md:gap-3 max-md:p-3 max-md:max-w-[calc(100%-2rem)] max-md:w-[calc(100%-2rem)]">
        <Search size={18} className="text-text-muted flex-shrink-0 transition-colors duration-normal group-focus-within:text-brand-primary max-md:order-0" />
        <input
          type="text"
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-[0.95rem] text-text-bright placeholder:text-text-muted max-md:order-1 max-md:flex-1 max-md:min-w-full"
          aria-label="Search problems"
        />

        <div className="w-px h-5 bg-[rgba(255,255,255,0.08)] flex-shrink-0 max-md:hidden" />

        <div className="flex items-center gap-1 flex-shrink-0 max-md:order-3 max-md:flex-1">
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
          className={`flex items-center justify-center bg-transparent border-none text-text-muted cursor-pointer p-1.5 rounded-md transition-all duration-fast flex-shrink-0 hover:text-text-secondary hover:bg-brand-primary-5 max-md:order-2 max-md:ml-auto ${sortOrder !== 'none' ? 'text-brand-light bg-brand-primary-10' : ''} ${selectedDifficulty !== 'all' ? 'invisible pointer-events-none' : ''}`}
          onClick={cycleSortOrder}
          aria-label={`Sort by difficulty: ${sortOrder === 'none' ? 'unsorted' : sortOrder === 'asc' ? 'easy to hard' : 'hard to easy'}`}
          title={sortOrder === 'none' ? 'Sort by difficulty' : sortOrder === 'asc' ? 'Easy → Hard' : 'Hard → Easy'}
          tabIndex={selectedDifficulty !== 'all' ? -1 : undefined}
        >
          <SortIcon size={16} />
        </button>

        <span className={`text-xs font-medium text-text-muted bg-brand-primary-10 py-1 px-2 rounded-sm flex-shrink-0 min-w-8 text-center max-md:order-4 ${!hasActiveFilters ? 'invisible pointer-events-none' : ''}`}>
          {filteredProblems.length}
        </span>

        <button
          type="button"
          className={`flex items-center justify-center bg-transparent border-none text-text-muted cursor-pointer p-1.5 rounded-md transition-all duration-fast flex-shrink-0 hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.15)] max-md:order-2 ${!hasActiveFilters ? 'invisible pointer-events-none' : ''}`}
          onClick={clearFilters}
          aria-label="Clear filters"
          tabIndex={!hasActiveFilters ? -1 : undefined}
        >
          <X size={16} />
        </button>
      </div>

      {categoryFilters && categoryFilters.length > 0 && (
        <div className="py-4 px-8 flex gap-3 flex-wrap max-w-[1200px] mx-auto w-full max-lg:p-4 max-lg:px-6 max-md:p-3 max-md:px-4">
          <button
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-3xl border border-white-10 bg-transparent text-gray-500 text-sm cursor-pointer transition-all duration-fast hover:border-white-20 hover:text-gray-300 ${!selectedCategory ? 'bg-brand-primary-15 border-brand-primary-40 text-brand-primary' : ''}`}
            onClick={() => onCategoryFilterChange?.(null)}
          >
            All Categories
            <span className="opacity-70">({problems.length})</span>
          </button>
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-3xl border border-white-10 bg-transparent text-gray-500 text-sm cursor-pointer transition-all duration-fast hover:border-white-20 hover:text-gray-300 ${selectedCategory === cat.id ? 'bg-brand-primary-15 border-brand-primary-40 text-brand-primary' : ''}`}
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

      <main className="flex-1 py-6 px-8 pb-8 max-w-[1200px] mx-auto w-full min-h-[400px] max-lg:p-5 max-lg:px-6 max-md:p-4">
        <div className="text-gray-700 text-base mb-4">
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
        </div>

        {filteredProblems.length === 0 ? (
          emptyState || <div className="text-center py-12 text-gray-700">No problems match your filters</div>
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
      </main>
    </div>
  )
}
