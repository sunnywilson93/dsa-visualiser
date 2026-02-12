import { describe, it, expect } from 'vitest'
import {
  getExamplesByCategory,
  getExampleCategoryIds,
  hasCategory,
  type CodeExample,
} from './examples'

describe('examples category helpers', () => {
  it('falls back to primary category when categories[] is missing', () => {
    const example: CodeExample = {
      id: 'primary-only',
      name: 'Primary Only',
      category: 'stack',
      difficulty: 'easy',
      description: 'primary category only',
      code: 'console.log("x")',
    }

    expect(getExampleCategoryIds(example)).toEqual(['stack'])
    expect(hasCategory(example, 'stack')).toBe(true)
    expect(hasCategory(example, 'strings')).toBe(false)
  })

  it('uses all category tags when categories[] exists', () => {
    const example: CodeExample = {
      id: 'multi-category',
      name: 'Multi Category',
      category: 'two-pointers',
      categories: ['two-pointers', 'strings', 'stack'],
      difficulty: 'medium',
      description: 'multiple categories',
      code: 'console.log("x")',
    }

    expect(getExampleCategoryIds(example)).toEqual(['two-pointers', 'strings', 'stack'])
    expect(hasCategory(example, 'stack')).toBe(true)
    expect(hasCategory(example, 'two-pointers')).toBe(true)
    expect(hasCategory(example, 'heap')).toBe(false)
  })
})

describe('getExamplesByCategory', () => {
  it('includes stack-tagged problems even when stack is not the primary category', () => {
    const stackProblems = getExamplesByCategory('stack')
    const stackIds = stackProblems.map((problem) => problem.id)

    expect(stackIds).toContain('trapping-rain-water')
    expect(stackIds).toContain('backspace-string-compare')
  })

  it('includes the expanded stack problem set', () => {
    const stackProblems = getExamplesByCategory('stack')
    const stackIds = stackProblems.map((problem) => problem.id)

    const expectedNewIds = [
      'valid-parentheses',
      'min-stack',
      'evaluate-rpn',
      'daily-temperatures',
      'next-greater-element-i',
      'next-greater-element-ii',
      'largest-rectangle-in-histogram',
      'car-fleet',
      'simplify-path',
      'remove-k-digits',
      'decode-string',
      'basic-calculator-ii',
    ]

    expectedNewIds.forEach((id) => {
      expect(stackIds).toContain(id)
    })
  })
})
