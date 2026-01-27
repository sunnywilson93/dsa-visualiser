'use client'

import { Search, X } from 'lucide-react'
import type { Difficulty } from '@/lib/search'

const difficulties: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Easy' },
  { value: 'intermediate', label: 'Medium' },
  { value: 'advanced', label: 'Hard' },
]

interface SearchState {
  query: string
  filters: {
    query: string
    difficulty?: Difficulty | 'all'
    category?: string | 'all'
    source?: 'js' | 'dsa' | 'all'
  }
  results: { item: unknown; score: number; matchedFields: string[] }[]
  isSearching: boolean
  setQuery: (query: string) => void
  setDifficulty: (difficulty: Difficulty | 'all') => void
  setSource: (source: 'js' | 'dsa' | 'all') => void
  clearFilters: () => void
}

interface PageSearchControlsProps {
  search: SearchState
  showSourceFilter?: boolean
  placeholder?: string
}

export function PageSearchControls({
  search,
  showSourceFilter = false,
  placeholder = 'Search concepts...',
}: PageSearchControlsProps) {
  const { query, filters, results, isSearching, setQuery, setDifficulty, setSource, clearFilters } = search

  const hasActiveFilters = filters.difficulty !== 'all' || filters.source !== 'all'
  const showClear = query || hasActiveFilters

  const handleClear = () => {
    setQuery('')
    clearFilters()
  }

  return (
    <div className="group flex items-center gap-3 bg-bg-secondary border border-border-primary rounded-xl px-4 py-3 mb-6 transition-all focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary/50 flex-wrap md:flex-nowrap">
      <Search size={18} className="text-text-muted shrink-0 transition-colors group-focus-within:text-accent-primary order-0" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] md:min-w-0 bg-transparent border-0 outline-none text-base text-text-primary placeholder:text-text-muted order-1 md:order-1"
        aria-label="Search concepts"
      />

      <div className="hidden md:block w-px h-5 bg-border-primary shrink-0 order-2" />

      <div className="flex items-center gap-1 shrink-0 order-3 md:order-3">
        {difficulties.map((diff) => (
          <button
            key={diff.value}
            type="button"
            onClick={() => setDifficulty(diff.value)}
            className={`flex items-center justify-center bg-transparent border-0 text-sm font-medium px-3 py-1 rounded-md cursor-pointer transition-all ${
              filters.difficulty === diff.value
                ? diff.value === 'beginner'
                  ? 'bg-success/20 text-success'
                  : diff.value === 'intermediate'
                    ? 'bg-warning/20 text-warning'
                    : diff.value === 'advanced'
                      ? 'bg-error/20 text-error'
                      : 'bg-accent-primary/20 text-accent-primary'
                : 'text-text-muted hover:bg-accent-primary/5 hover:text-text-secondary'
            }`}
          >
            {diff.label}
          </button>
        ))}

        {showSourceFilter && (
          <>
            <div className="hidden md:block w-px h-5 bg-border-primary shrink-0 mx-1" />
            <button
              type="button"
              onClick={() => setSource('js')}
              className={`flex items-center justify-center bg-transparent border-0 text-xs font-medium px-2 py-1 rounded-md cursor-pointer transition-all ${
                filters.source === 'js'
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-text-muted hover:bg-accent-primary/5 hover:text-text-secondary'
              }`}
            >
              JS
            </button>
            <button
              type="button"
              onClick={() => setSource('dsa')}
              className={`flex items-center justify-center bg-transparent border-0 text-xs font-medium px-2 py-1 rounded-md cursor-pointer transition-all ${
                filters.source === 'dsa'
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-text-muted hover:bg-accent-primary/5 hover:text-text-secondary'
              }`}
            >
              DSA
            </button>
          </>
        )}
      </div>

      {(isSearching || hasActiveFilters) && (
        <span className="text-xs font-medium text-text-muted bg-accent-primary/10 px-2 py-1 rounded shrink-0 order-4 md:order-4">
          {results.length}
        </span>
      )}

      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center bg-transparent border-0 text-text-muted hover:text-error hover:bg-error/10 cursor-pointer p-1 rounded-md transition-all shrink-0 order-2 md:order-5 ml-auto md:ml-0"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
