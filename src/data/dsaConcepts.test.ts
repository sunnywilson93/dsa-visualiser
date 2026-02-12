import { describe, it, expect } from 'vitest'
import { codeExamples } from './examples'
import { getDSAConceptById } from './dsaConcepts'

describe('linked-lists concept integrity', () => {
  const linkedListConcept = getDSAConceptById('linked-lists')
  const problemIds = new Set(codeExamples.map((problem) => problem.id))

  it('defines relatedProblems that map to real practice problems', () => {
    expect(linkedListConcept).toBeDefined()
    expect(linkedListConcept?.relatedProblems?.length).toBeGreaterThan(0)

    linkedListConcept?.relatedProblems?.forEach((problemId) => {
      expect(problemIds.has(problemId)).toBe(true)
    })
  })

  it('defines a learning path with problem IDs that all exist', () => {
    expect(linkedListConcept?.learningPath?.length).toBeGreaterThan(0)

    linkedListConcept?.learningPath?.forEach((stage) => {
      expect(stage.problemIds.length).toBeGreaterThan(0)
      stage.problemIds.forEach((problemId) => {
        expect(problemIds.has(problemId)).toBe(true)
      })
    })
  })
})
