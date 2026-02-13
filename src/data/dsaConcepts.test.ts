import { describe, it, expect } from 'vitest'
import { codeExamples } from './examples'
import { dsaConcepts, getDSAConceptById } from './dsaConcepts'

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

describe('DSA concepts integrity', () => {
  const problemIds = new Set(codeExamples.map((problem) => problem.id))

  it('all concept relatedProblems IDs exist in code examples', () => {
    for (const concept of dsaConcepts) {
      if (!concept.relatedProblems || concept.relatedProblems.length === 0) continue

      for (const problemId of concept.relatedProblems) {
        expect(problemIds.has(problemId)).toBe(true)
      }
    }
  })

  it('all learning path IDs exist in code examples', () => {
    for (const concept of dsaConcepts) {
      if (!concept.learningPath || concept.learningPath.length === 0) continue

      for (const stage of concept.learningPath) {
        expect(stage.problemIds.length).toBeGreaterThan(0)
        for (const problemId of stage.problemIds) {
          expect(problemIds.has(problemId)).toBe(true)
        }
      }
    }
  })
})

describe('trees concept integrity', () => {
  const treesConcept = getDSAConceptById('trees')
  const problemIds = new Set(codeExamples.map((problem) => problem.id))

  it('exists and has related problems', () => {
    expect(treesConcept).toBeDefined()
    expect(treesConcept?.relatedProblems?.length).toBeGreaterThan(0)
  })

  it('maps every related problem to an existing problem id', () => {
    treesConcept?.relatedProblems?.forEach((problemId) => {
      expect(problemIds.has(problemId)).toBe(true)
    })
  })

  it('defines a learning path with valid problem IDs', () => {
    expect(treesConcept?.learningPath?.length).toBeGreaterThan(0)
    treesConcept?.learningPath?.forEach((stage) => {
      expect(stage.problemIds.length).toBeGreaterThan(0)
      stage.problemIds.forEach((problemId) => {
        expect(problemIds.has(problemId)).toBe(true)
      })
    })
  })
})
