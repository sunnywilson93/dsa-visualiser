'use client'

import { Search, X, Filter } from 'lucide-react'
import type { Difficulty } from '@/lib/search'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import styles from './PageSearch.module.css'

const difficulties: { value: Difficulty | 'all'; level?: Difficulty }[] = [
  { value: 'all' },
  { value: 'beginner', level: 'beginner' },
  { value: 'intermediate', level: 'intermediate' },
  { value: 'advanced', level: 'advanced' },
]

// Type for the search hook return value
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

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={styles.input}
            aria-label="Search concepts"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className={styles.clearButton}
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
            className={styles.clearFiltersButton}
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <Filter size={14} className={styles.filterIcon} />
          <span className={styles.filterLabel}>Level:</span>
          <div className={styles.chips}>
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setDifficulty(diff.value)}
                className={`${styles.chip} ${styles.difficultyChip} ${filters.difficulty === diff.value ? styles.chipActive : ''}`}
                title={diff.value}
              >
                {diff.level ? (
                  <DifficultyIndicator level={diff.level} size="sm" />
                ) : (
                  <span className={styles.allDots}>
                    <span className={styles.allDot} style={{ background: 'var(--difficulty-1)' }} />
                    <span className={styles.allDot} style={{ background: 'var(--difficulty-2)' }} />
                    <span className={styles.allDot} style={{ background: 'var(--difficulty-3)' }} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {showSourceFilter && (
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Type:</span>
            <div className={styles.chips}>
              <button
                type="button"
                onClick={() => setSource('all')}
                className={`${styles.chip} ${filters.source === 'all' ? styles.chipActive : ''}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSource('js')}
                className={`${styles.chip} ${filters.source === 'js' ? styles.chipActive : ''}`}
                data-source="js"
              >
                JavaScript
              </button>
              <button
                type="button"
                onClick={() => setSource('dsa')}
                className={`${styles.chip} ${filters.source === 'dsa' ? styles.chipActive : ''}`}
                data-source="dsa"
              >
                DSA
              </button>
            </div>
          </div>
        )}
      </div>

      {(isSearching || hasActiveFilters) && (
        <div className={styles.resultCount}>
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </div>
      )}
    </div>
  )
}
