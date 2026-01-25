import { dsaPatterns } from '@/data/dsaPatterns'
import { problemConcepts } from '@/data/algorithmConcepts'
import { codeExamples } from '@/data/examples'

export interface CrossLink {
  type: 'pattern' | 'problem'
  id: string
  name: string
  href: string
  description?: string
}

/**
 * Get related patterns for a problem
 * Uses problemConcepts to find which pattern a problem belongs to
 */
export function getRelatedPatterns(problemId: string): CrossLink[] {
  const concept = problemConcepts[problemId]
  if (!concept) return []

  // Extract base pattern from concept.pattern (e.g., 'two-pointers-converge' -> 'two-pointers')
  const patternBase = concept.pattern.split('-').slice(0, 2).join('-')

  // Find matching patterns
  return dsaPatterns
    .filter(pattern =>
      pattern.id === patternBase ||
      concept.pattern.startsWith(pattern.id) ||
      pattern.relatedProblems?.includes(problemId)
    )
    .map(pattern => ({
      type: 'pattern' as const,
      id: pattern.id,
      name: pattern.name,
      href: `/concepts/dsa/patterns/${pattern.slug}`,
      description: pattern.description,
    }))
}

/**
 * Get related problems for a pattern
 * Uses both explicit relatedProblems and problemConcepts pattern matching
 */
export function getRelatedProblems(patternId: string): CrossLink[] {
  const pattern = dsaPatterns.find(p => p.id === patternId)
  if (!pattern) return []

  // Find problems that use this pattern via problemConcepts
  const problemsByPattern = Object.entries(problemConcepts)
    .filter(([, concept]) => concept.pattern.startsWith(patternId))
    .map(([id]) => id)

  // Combine with explicitly listed related problems
  const allRelatedIds = new Set([
    ...problemsByPattern,
    ...(pattern.relatedProblems || [])
  ])

  const links: CrossLink[] = []
  for (const problemId of allRelatedIds) {
    const problem = codeExamples.find(p => p.id === problemId)
    if (problem) {
      links.push({
        type: 'problem',
        id: problem.id,
        name: problem.name,
        href: `/${problem.category}/${problem.id}`,
        description: problem.description,
      })
    }
  }
  return links
}

/**
 * Unified cross-link getter for any context
 */
export function getCrossLinks(
  context: { type: 'problem' | 'pattern'; id: string }
): { patterns: CrossLink[]; problems: CrossLink[] } {
  if (context.type === 'problem') {
    return {
      patterns: getRelatedPatterns(context.id),
      problems: [],
    }
  }

  return {
    patterns: [],
    problems: getRelatedProblems(context.id),
  }
}
