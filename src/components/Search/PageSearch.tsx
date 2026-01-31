'use client'

import { Search, X, Filter } from 'lucide-react'
import { useSearch, type ConceptSource, type Difficulty } from '@/lib/search'

const difficulties: { value: Difficulty | 'all'; label: string; color?: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner', color: '#10b981' },
  { value: 'intermediate', label: 'Intermediate', color: '#f59e0b' },
  { value: 'advanced', label: 'Advanced', color: '#ef4444' },
]

interface PageSearchProps {
  source?: ConceptSource
  showSourceFilter?: boolean
  placeholder?: string
  onResultsChange?: (count: number, isSearching: boolean) => void
}

export function PageSearch({
  source,
  showSourceFilter = false,
  placeholder = 'Search concepts...',
  onResultsChange,
}: PageSearchProps) {
  const {
    query,
    filters,
    results,
    isSearching,
    setQuery,
    setDifficulty,
    setSource,
    clearFilters,
  } = useSearch({ source })

  // Report results back to parent
  if (onResultsChange) {
    onResultsChange(results.length, isSearching || filters.difficulty !== 'all')
  }

  const hasActiveFilters = filters.difficulty !== 'all' || filters.source !== 'all'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 flex items-center">
          <Search size={18} className="absolute left-3 text-text-muted shrink-0 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full py-2 pl-10 pr-8 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
            aria-label="Search concepts"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 p-1 rounded hover:bg-accent-primary/10 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-text-primary bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          <span className="text-sm text-text-secondary">Difficulty:</span>
          <div className="flex items-center gap-1">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setDifficulty(diff.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filters.difficulty === diff.value
                    ? diff.color
                      ? 'text-white'
                      : 'bg-accent-primary text-white'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'
                }`}
                style={
                  filters.difficulty === diff.value && diff.color
                    ? { backgroundColor: diff.color }
                    : undefined
                }
              >
                {diff.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: filters.difficulty === diff.value ? 'var(--color-white)' : diff.color }}
                  />
                )}
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {showSourceFilter && !source && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Type:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSource('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filters.source === 'all'
                    ? 'bg-accent-primary text-white'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSource('js')}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filters.source === 'js'
                    ? 'bg-accent-primary text-white'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                JavaScript
              </button>
              <button
                type="button"
                onClick={() => setSource('dsa')}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filters.source === 'dsa'
                    ? 'bg-accent-primary text-white'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                DSA
              </button>
            </div>
          </div>
        )}
      </div>

      {(isSearching || hasActiveFilters) && (
        <div className="text-xs text-text-muted">
          <span className="inline-block min-w-[1ch] text-right tabular-nums">{results.length}</span> {results.length === 1 ? 'result' : 'results'} found
        </div>
      )}
    </div>
  )
}

// Export a hook-based version for more control
export function usePageSearch(source?: ConceptSource) {
  return useSearch({ source })
}
