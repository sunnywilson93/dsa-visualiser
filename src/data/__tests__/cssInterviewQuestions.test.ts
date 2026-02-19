import { describe, it, expect } from 'vitest'
import { cssInterviewQuestions, filterCSSQuestions } from '@/data/cssInterviewQuestions'

describe('cssInterviewQuestions', () => {
  it('has exactly 105 questions', () => {
    expect(cssInterviewQuestions).toHaveLength(105)
  })

  describe('topic distribution', () => {
    it('has 30 core-fundamentals questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.topic === 'core-fundamentals').length
      expect(count).toBe(30)
    })

    it('has 28 layout-systems questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.topic === 'layout-systems').length
      expect(count).toBe(28)
    })

    it('has 25 modern-css questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.topic === 'modern-css').length
      expect(count).toBe(25)
    })

    it('has 22 architecture-performance questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.topic === 'architecture-performance').length
      expect(count).toBe(22)
    })
  })

  describe('difficulty distribution', () => {
    it('has 30 easy questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.difficulty === 'easy').length
      expect(count).toBe(30)
    })

    it('has 42 medium questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.difficulty === 'medium').length
      expect(count).toBe(42)
    })

    it('has 33 hard questions', () => {
      const count = cssInterviewQuestions.filter((q) => q.difficulty === 'hard').length
      expect(count).toBe(33)
    })
  })

  describe('ID integrity', () => {
    it('has all unique IDs', () => {
      const ids = cssInterviewQuestions.map((q) => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(105)
    })

    it('has sequential IDs from 1 to 105', () => {
      cssInterviewQuestions.forEach((q, index) => {
        expect(q.id).toBe(index + 1)
      })
    })
  })

  describe('required fields', () => {
    it('every question has a non-empty title', () => {
      cssInterviewQuestions.forEach((q) => {
        expect(q.title).toBeTruthy()
        expect(typeof q.title).toBe('string')
        expect(q.title.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty answer', () => {
      cssInterviewQuestions.forEach((q) => {
        expect(q.answer).toBeTruthy()
        expect(typeof q.answer).toBe('string')
        expect(q.answer.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty followUp', () => {
      cssInterviewQuestions.forEach((q) => {
        expect(q.followUp).toBeTruthy()
        expect(typeof q.followUp).toBe('string')
        expect(q.followUp.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty keyTakeaway', () => {
      cssInterviewQuestions.forEach((q) => {
        expect(q.keyTakeaway).toBeTruthy()
        expect(typeof q.keyTakeaway).toBe('string')
        expect(q.keyTakeaway.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('filterCSSQuestions', () => {
  it('returns all questions when filters are both "all"', () => {
    const result = filterCSSQuestions(cssInterviewQuestions, 'all', 'all')
    expect(result).toHaveLength(105)
  })

  it('filters by topic correctly', () => {
    const result = filterCSSQuestions(cssInterviewQuestions, 'all', 'core-fundamentals')
    expect(result).toHaveLength(30)
    result.forEach((q) => {
      expect(q.topic).toBe('core-fundamentals')
    })
  })

  it('filters by difficulty correctly', () => {
    const result = filterCSSQuestions(cssInterviewQuestions, 'easy', 'all')
    expect(result).toHaveLength(30)
    result.forEach((q) => {
      expect(q.difficulty).toBe('easy')
    })
  })

  it('filters by both topic and difficulty correctly', () => {
    const result = filterCSSQuestions(cssInterviewQuestions, 'hard', 'modern-css')
    expect(result.length).toBeGreaterThan(0)
    result.forEach((q) => {
      expect(q.topic).toBe('modern-css')
      expect(q.difficulty).toBe('hard')
    })
  })

  it('returns empty array when no questions match', () => {
    const noMatch = cssInterviewQuestions.filter(
      (q) => q.topic === 'core-fundamentals' && q.difficulty === 'easy',
    )
    expect(noMatch.length).toBeGreaterThan(0)

    const emptyResult = filterCSSQuestions([], 'easy', 'core-fundamentals')
    expect(emptyResult).toHaveLength(0)
  })
})
