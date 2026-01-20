'use client'

import { Search, X } from 'lucide-react'
import type { Difficulty } from '@/lib/search'
import styles from './PageSearch.module.css'

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
    <div className={styles.searchBar}>
      <Search size={18} className={styles.searchIcon} />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search concepts"
      />

      <div className={styles.divider} />

      <div className={styles.filterChips}>
        {difficulties.map((diff) => (
          <button
            key={diff.value}
            type="button"
            onClick={() => setDifficulty(diff.value)}
            className={`${styles.chip} ${filters.difficulty === diff.value ? styles.chipActive : ''}`}
            data-difficulty={diff.value}
          >
            {diff.label}
          </button>
        ))}

        {showSourceFilter && (
          <>
            <div className={styles.divider} />
            <button
              type="button"
              onClick={() => setSource('js')}
              className={`${styles.chip} ${styles.textChip} ${filters.source === 'js' ? styles.chipActive : ''}`}
            >
              JS
            </button>
            <button
              type="button"
              onClick={() => setSource('dsa')}
              className={`${styles.chip} ${styles.textChip} ${filters.source === 'dsa' ? styles.chipActive : ''}`}
            >
              DSA
            </button>
          </>
        )}
      </div>

      {(isSearching || hasActiveFilters) && (
        <span className={styles.resultCount}>{results.length}</span>
      )}

      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
