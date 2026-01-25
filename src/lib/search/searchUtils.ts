// Search utility functions

import { concepts, conceptCategories } from '@/data/concepts'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import type { SearchableItem, SearchFilters, SearchResult, CategoryOption, ConceptSource } from './types'

// Convert JS concepts to searchable items
function normalizeJSConcepts(): SearchableItem[] {
  return concepts.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    difficulty: c.difficulty,
    description: c.description,
    shortDescription: c.shortDescription,
    keyPoints: c.keyPoints,
    source: 'js' as ConceptSource,
    href: `/concepts/${c.id}`,
  }))
}

// Convert DSA concepts to searchable items
function normalizeDSAConcepts(): SearchableItem[] {
  return dsaConcepts.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    difficulty: c.difficulty,
    description: c.description,
    shortDescription: c.shortDescription,
    keyPoints: c.keyPoints,
    source: 'dsa' as ConceptSource,
    href: `/concepts/dsa/${c.id}`,
  }))
}

// Convert DSA patterns to searchable items
function normalizeDSAPatterns(): SearchableItem[] {
  return dsaPatterns.map(p => ({
    id: p.id,
    title: p.name,
    category: 'patterns',
    difficulty: 'intermediate' as const,
    description: p.description,
    shortDescription: p.description.slice(0, 80) + '...',
    keyPoints: p.whenToUse,
    source: 'dsa' as ConceptSource,
    href: `/concepts/dsa/patterns/${p.slug}`,
  }))
}

// Get all searchable items
export function getAllSearchableItems(): SearchableItem[] {
  return [...normalizeJSConcepts(), ...normalizeDSAConcepts(), ...normalizeDSAPatterns()]
}

// Get items by source
export function getSearchableItemsBySource(source: ConceptSource): SearchableItem[] {
  return source === 'js'
    ? normalizeJSConcepts()
    : [...normalizeDSAConcepts(), ...normalizeDSAPatterns()]
}

// Get all category options for filters
export function getAllCategories(): CategoryOption[] {
  const jsCategories = conceptCategories.map(c => ({
    id: c.id,
    name: c.name,
    source: 'js' as ConceptSource,
  }))

  const dsaCategories = dsaConceptCategories.map(c => ({
    id: c.id,
    name: c.name,
    source: 'dsa' as ConceptSource,
  }))

  return [...jsCategories, ...dsaCategories]
}

// Score a text match
function scoreMatch(text: string, query: string, weight: number): number {
  if (!text || !query) return 0
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // Exact match at start (highest priority)
  if (lowerText.startsWith(lowerQuery)) return weight * 2

  // Word boundary match
  const words = lowerText.split(/\s+/)
  if (words.some(word => word.startsWith(lowerQuery))) return weight * 1.5

  // Contains match
  if (lowerText.includes(lowerQuery)) return weight

  return 0
}

// Search concepts with scoring
export function searchConcepts(items: SearchableItem[], query: string): SearchResult[] {
  if (!query.trim()) {
    return items.map(item => ({ item, score: 0, matchedFields: [] }))
  }

  const normalizedQuery = query.trim().toLowerCase()

  const results: SearchResult[] = items
    .map(item => {
      const matchedFields: string[] = []
      let totalScore = 0

      // Score different fields with different weights
      const titleScore = scoreMatch(item.title, normalizedQuery, 100)
      if (titleScore > 0) {
        matchedFields.push('title')
        totalScore += titleScore
      }

      const shortDescScore = scoreMatch(item.shortDescription, normalizedQuery, 50)
      if (shortDescScore > 0) {
        matchedFields.push('shortDescription')
        totalScore += shortDescScore
      }

      const descScore = scoreMatch(item.description, normalizedQuery, 10)
      if (descScore > 0) {
        matchedFields.push('description')
        totalScore += descScore
      }

      // Check key points
      for (const point of item.keyPoints) {
        const pointScore = scoreMatch(point, normalizedQuery, 25)
        if (pointScore > 0) {
          if (!matchedFields.includes('keyPoints')) {
            matchedFields.push('keyPoints')
          }
          totalScore += pointScore
          break // Only count once
        }
      }

      // Check category name
      const categoryScore = scoreMatch(item.category, normalizedQuery, 20)
      if (categoryScore > 0) {
        matchedFields.push('category')
        totalScore += categoryScore
      }

      return { item, score: totalScore, matchedFields }
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)

  return results
}

// Filter concepts by criteria
export function filterConcepts(items: SearchableItem[], filters: SearchFilters): SearchableItem[] {
  return items.filter(item => {
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (item.difficulty !== filters.difficulty) return false
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      if (item.category !== filters.category) return false
    }

    // Filter by source
    if (filters.source && filters.source !== 'all') {
      if (item.source !== filters.source) return false
    }

    return true
  })
}

// Combined search and filter
export function searchAndFilterConcepts(
  items: SearchableItem[],
  filters: SearchFilters
): SearchResult[] {
  // First filter
  const filteredItems = filterConcepts(items, filters)

  // Then search
  return searchConcepts(filteredItems, filters.query)
}
