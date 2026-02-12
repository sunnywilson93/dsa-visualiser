import { describe, it, expect } from 'vitest'
import {
  codeExamples,
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

describe('FAANG string curriculum mapping', () => {
  const curriculumToProblemId = [
    { question: 'Valid Anagram', id: 'valid-anagram' },
    { question: 'Is Subsequence', id: 'is-subsequence' },
    { question: 'Find the Index of the First Occurrence', id: 'find-index-first-occurrence' },
    { question: 'Longest Common Prefix', id: 'longest-common-prefix' },
    { question: 'Reverse String', id: 'reverse-string' },
    { question: 'Reverse Words in a String', id: 'reverse-words-in-a-string' },
    { question: 'Length of Last Word', id: 'length-of-last-word' },
    { question: 'Valid Palindrome', id: 'valid-palindrome' },
    { question: 'Valid Palindrome II', id: 'valid-palindrome-ii' },
    { question: 'Reverse Vowels of a String', id: 'reverse-vowels-of-a-string' },
    { question: 'First Unique Character in a String', id: 'first-unique-character' },
    { question: 'Ransom Note', id: 'ransom-note' },
    { question: 'Group Anagrams', id: 'group-anagrams' },
    { question: 'Find All Anagrams in a String', id: 'find-all-anagrams-in-a-string' },
    { question: 'Minimum Window Substring', id: 'min-window-substring' },
    { question: 'Longest Substring Without Repeating Characters', id: 'longest-substring-no-repeat' },
    { question: 'Longest Repeating Character Replacement', id: 'longest-repeating-char-replacement' },
    { question: 'Permutation in String', id: 'permutation-in-string' },
    { question: 'Check Inclusion', id: 'permutation-in-string' },
    { question: 'Palindromic Substrings', id: 'palindromic-substrings' },
    { question: 'Longest Palindromic Substring', id: 'longest-palindromic-substring' },
    { question: 'Count Binary Substrings', id: 'count-binary-substrings' },
    { question: 'Decode String', id: 'decode-string' },
    { question: 'String to Integer (atoi)', id: 'string-to-integer-atoi' },
    { question: 'Multiply Strings', id: 'multiply-strings' },
    { question: 'Basic Calculator II', id: 'basic-calculator-ii' },
    { question: 'Simplify Path', id: 'simplify-path' },
    { question: 'Text Justification', id: 'text-justification' },
    { question: 'Edit Distance', id: 'edit-distance' },
    { question: 'Regular Expression Matching', id: 'regular-expression-matching' },
  ] as const

  it('maps every planned curriculum question to an existing problem id', () => {
    const ids = new Set(codeExamples.map((problem) => problem.id))

    curriculumToProblemId.forEach(({ question, id }) => {
      expect(ids.has(id), `${question} -> ${id} should exist`).toBe(true)
    })
  })

  it('uses permutation-in-string as the explicit alias target for Check Inclusion', () => {
    const ids = new Set(codeExamples.map((problem) => problem.id))
    expect(ids.has('permutation-in-string')).toBe(true)
    expect(ids.has('check-inclusion')).toBe(false)
  })
})
