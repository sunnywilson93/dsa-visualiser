import { describe, it, expect } from 'vitest'
import { codeExamples, getExampleCategoryIds, isDsaSubcategory } from './examples'
import { problemConcepts } from './algorithmConcepts'
import { conceptCoverageBaseline } from './conceptCoverageBaseline'
import type { ConceptType } from '@/types'

const validPatternTypes: ConceptType[] = [
  'two-pointers-converge',
  'two-pointers-same-dir',
  'two-pointers-partition',
  'hash-map',
  'bit-manipulation',
  'sliding-window',
  'binary-search',
  'linked-list',
  'sorting',
]

const problemIds = new Set(codeExamples.map((problem) => problem.id))
const dsaProblemIds = new Set(
  codeExamples
    .filter((problem) => getExampleCategoryIds(problem).some(isDsaSubcategory))
    .map((problem) => problem.id),
)
const conceptIds = new Set(Object.keys(problemConcepts))

describe('trie algorithm concept analyses', () => {
  const trieProblemIds = [
    'implement-trie-prefix-tree',
    'design-add-and-search-words-data-structure',
    'replace-words',
    'search-suggestions-system',
    'stream-of-characters',
    'word-search-ii',
    'short-encoding-of-words',
    'magic-dictionary',
    'maximum-xor-of-two-numbers-trie',
    'longest-word-in-dictionary',
  ]

  it('includes all trie curriculum problems in problemConcepts', () => {
    for (const id of trieProblemIds) {
      expect(problemConcepts[id]).toBeDefined()
    }
  })

  it('defines concept steps for each trie problem', () => {
    for (const id of trieProblemIds) {
      const concept = problemConcepts[id]

      expect(concept).toBeDefined()
      expect(concept?.steps.length).toBeGreaterThan(0)
      expect(concept?.keyInsight).toBeTypeOf('string')
    }
  })

  it('maps all trie category problems to concept analysis', () => {
    const conceptIds = new Set(Object.keys(problemConcepts))
    const trieExamples = codeExamples
      .filter((problem) => getExampleCategoryIds(problem).includes('trie'))
      .map((problem) => problem.id)

    trieExamples.forEach((id) => {
      expect(conceptIds.has(id)).toBe(true)
    })
  })
})

describe('problem concept integrity', () => {
  it('references only existing problems', () => {
    for (const conceptId of conceptIds) {
      expect(problemIds.has(conceptId)).toBe(true)
    }
  })

  it('defines valid and non-empty concept steps for every mapped problem', () => {
    for (const [problemId, concept] of Object.entries(problemConcepts)) {
      expect(problemId).toBeTruthy()
      expect(concept.title).toBeTruthy()
      expect(concept.title.trim().length).toBeGreaterThan(0)
      expect(concept.keyInsight).toBeTruthy()
      expect(concept.keyInsight.trim().length).toBeGreaterThan(0)
      expect(validPatternTypes).toContain(concept.pattern)
      expect(Array.isArray(concept.steps)).toBe(true)
      expect(concept.steps.length).toBeGreaterThan(0)

      concept.steps.forEach((step, index) => {
        expect(step.id).toBeTypeOf('number')
        expect(step.id).toBeGreaterThan(0)
        expect(Number.isInteger(step.id)).toBe(true)
        expect(step.title.trim().length).toBeGreaterThan(0)
        expect(step.description.trim().length).toBeGreaterThan(0)
      })
    }
  })

  it('is mapped to by all DSA-tagged problems (regression budget)', () => {
    const mappedDsaCount = [...dsaProblemIds].filter((id) => conceptIds.has(id)).length
    const unmappedDsaCount = dsaProblemIds.size - mappedDsaCount

    expect(dsaProblemIds.size).toBeGreaterThanOrEqual(
      conceptCoverageBaseline.dsaProblemCount,
    )
    expect(conceptIds.size).toBeGreaterThanOrEqual(
      conceptCoverageBaseline.problemConceptCount,
    )
    expect(mappedDsaCount).toBeGreaterThanOrEqual(
      conceptCoverageBaseline.mappedDsaProblemCount,
    )
    expect(unmappedDsaCount).toBeLessThanOrEqual(
      conceptCoverageBaseline.unmappedDsaProblemCount,
    )
  })
})
