// Pattern difficulty levels (matches JS concepts pattern)
export type PatternDifficulty = 'beginner' | 'intermediate' | 'advanced'

// Pattern variant (e.g., converging vs same-direction for two-pointers)
export interface DSAPatternVariant {
  id: string
  name: string
  description: string
  whenToUse: string
}

// Main pattern definition
export interface DSAPattern {
  id: string
  name: string
  slug: string  // URL-safe identifier (e.g., 'two-pointers')
  description: string
  whenToUse: string[]
  variants: DSAPatternVariant[]
  complexity: {
    time: string
    space: string
  }
  relatedProblems?: string[]  // Problem IDs from examples.ts
}
