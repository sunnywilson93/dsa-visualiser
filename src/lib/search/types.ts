// Search Types for Concepts

export type ConceptSource = 'js' | 'dsa'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// Unified searchable item combining JS and DSA concepts
export interface SearchableItem {
  id: string
  title: string
  category: string
  difficulty: Difficulty
  description: string
  shortDescription: string
  keyPoints: string[]
  source: ConceptSource
  href: string
}

// Search filters
export interface SearchFilters {
  query: string
  difficulty?: Difficulty | 'all'
  category?: string | 'all'
  source?: ConceptSource | 'all'
}

// Search result with score for ranking
export interface SearchResult {
  item: SearchableItem
  score: number
  matchedFields: string[]
}

// Categories for filters
export interface CategoryOption {
  id: string
  name: string
  source: ConceptSource
}
