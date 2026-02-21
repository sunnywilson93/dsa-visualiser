import { describe, it, expect } from 'vitest'
import { htmlInterviewQuestions, filterHTMLQuestions } from '@/data/htmlInterviewQuestions'

describe('htmlInterviewQuestions', () => {
  it('has exactly 100 questions', () => {
    expect(htmlInterviewQuestions).toHaveLength(100)
  })

  describe('topic distribution', () => {
    it('has 27 core-fundamentals questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.topic === 'core-fundamentals').length
      expect(count).toBe(27)
    })

    it('has 26 semantic-accessibility questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.topic === 'semantic-accessibility').length
      expect(count).toBe(26)
    })

    it('has 25 forms-media questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.topic === 'forms-media').length
      expect(count).toBe(25)
    })

    it('has 22 modern-apis questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.topic === 'modern-apis').length
      expect(count).toBe(22)
    })
  })

  describe('difficulty distribution', () => {
    it('has 30 easy questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.difficulty === 'easy').length
      expect(count).toBe(30)
    })

    it('has 40 medium questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.difficulty === 'medium').length
      expect(count).toBe(40)
    })

    it('has 30 hard questions', () => {
      const count = htmlInterviewQuestions.filter((q) => q.difficulty === 'hard').length
      expect(count).toBe(30)
    })
  })

  describe('ID integrity', () => {
    it('has all unique IDs', () => {
      const ids = htmlInterviewQuestions.map((q) => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(100)
    })

    it('has sequential IDs from 1 to 100', () => {
      htmlInterviewQuestions.forEach((q, index) => {
        expect(q.id).toBe(index + 1)
      })
    })
  })

  describe('required fields', () => {
    it('every question has a non-empty title', () => {
      htmlInterviewQuestions.forEach((q) => {
        expect(q.title).toBeTruthy()
        expect(typeof q.title).toBe('string')
        expect(q.title.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty answer', () => {
      htmlInterviewQuestions.forEach((q) => {
        expect(q.answer).toBeTruthy()
        expect(typeof q.answer).toBe('string')
        expect(q.answer.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty followUp', () => {
      htmlInterviewQuestions.forEach((q) => {
        expect(q.followUp).toBeTruthy()
        expect(typeof q.followUp).toBe('string')
        expect(q.followUp.length).toBeGreaterThan(0)
      })
    })

    it('every question has a non-empty keyTakeaway', () => {
      htmlInterviewQuestions.forEach((q) => {
        expect(q.keyTakeaway).toBeTruthy()
        expect(typeof q.keyTakeaway).toBe('string')
        expect(q.keyTakeaway.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('filterHTMLQuestions', () => {
  it('returns all questions when filters are both "all"', () => {
    const result = filterHTMLQuestions(htmlInterviewQuestions, 'all', 'all')
    expect(result).toHaveLength(100)
  })

  it('filters by topic correctly', () => {
    const result = filterHTMLQuestions(htmlInterviewQuestions, 'all', 'core-fundamentals')
    expect(result).toHaveLength(27)
    result.forEach((q) => {
      expect(q.topic).toBe('core-fundamentals')
    })
  })

  it('filters by difficulty correctly', () => {
    const result = filterHTMLQuestions(htmlInterviewQuestions, 'easy', 'all')
    expect(result).toHaveLength(30)
    result.forEach((q) => {
      expect(q.difficulty).toBe('easy')
    })
  })

  it('filters by both topic and difficulty correctly', () => {
    const result = filterHTMLQuestions(htmlInterviewQuestions, 'hard', 'modern-apis')
    expect(result.length).toBeGreaterThan(0)
    result.forEach((q) => {
      expect(q.topic).toBe('modern-apis')
      expect(q.difficulty).toBe('hard')
    })
  })

  it('returns empty array when no questions match', () => {
    const emptyResult = filterHTMLQuestions([], 'easy', 'core-fundamentals')
    expect(emptyResult).toHaveLength(0)
  })
})
