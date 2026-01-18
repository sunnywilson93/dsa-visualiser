// Custom hook for search functionality

import { useState, useMemo, useCallback } from 'react'
import type { SearchFilters, SearchResult, SearchableItem, Difficulty, ConceptSource } from './types'
import { getAllSearchableItems, getSearchableItemsBySource, searchAndFilterConcepts } from './searchUtils'

interface UseSearchOptions {
  source?: ConceptSource // Limit to specific source
  initialFilters?: Partial<SearchFilters>
}

interface UseSearchReturn {
  // State
  query: string
  filters: SearchFilters
  results: SearchResult[]
  isSearching: boolean
  hasResults: boolean

  // Actions
  setQuery: (query: string) => void
  setDifficulty: (difficulty: Difficulty | 'all') => void
  setCategory: (category: string | 'all') => void
  setSource: (source: ConceptSource | 'all') => void
  clearFilters: () => void

  // Data
  allItems: SearchableItem[]
}

const defaultFilters: SearchFilters = {
  query: '',
  difficulty: 'all',
  category: 'all',
  source: 'all',
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { source, initialFilters } = options

  // Get base items based on source option
  const allItems = useMemo(() => {
    return source ? getSearchableItemsBySource(source) : getAllSearchableItems()
  }, [source])

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters,
    source: source || initialFilters?.source || 'all',
  })

  // Memoized search results
  const results = useMemo(() => {
    return searchAndFilterConcepts(allItems, filters)
  }, [allItems, filters])

  // Derived state
  const isSearching = filters.query.trim().length > 0
  const hasResults = results.length > 0

  // Actions
  const setQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }))
  }, [])

  const setDifficulty = useCallback((difficulty: Difficulty | 'all') => {
    setFilters(prev => ({ ...prev, difficulty }))
  }, [])

  const setCategory = useCallback((category: string | 'all') => {
    setFilters(prev => ({ ...prev, category }))
  }, [])

  const setSource = useCallback((newSource: ConceptSource | 'all') => {
    setFilters(prev => ({ ...prev, source: newSource }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      source: source || 'all',
    })
  }, [source])

  return {
    query: filters.query,
    filters,
    results,
    isSearching,
    hasResults,
    setQuery,
    setDifficulty,
    setCategory,
    setSource,
    clearFilters,
    allItems,
  }
}
