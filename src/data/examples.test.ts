import { describe, it, expect } from 'vitest'
import {
  codeExamples,
  getExamplesByCategory,
  getExampleCategoryIds,
  isDsaSubcategory,
  hasCategory,
  type CodeExample,
} from './examples'
import { conceptCoverageBaseline } from './conceptCoverageBaseline'

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

describe('FAANG tree curriculum mapping', () => {
  const curriculumToProblemId = [
    { question: 'Find Node in DOM Trees', id: 'find-node-in-tree' },
    { question: 'Get DOM Tree Height', id: 'dom-tree-height' },
    { question: 'Get All DOM Tags', id: 'get-dom-tags' },
    { question: 'Inorder Traversal', id: 'binary-tree-inorder-traversal' },
    { question: 'Preorder Traversal', id: 'binary-tree-preorder-traversal' },
    { question: 'Postorder Traversal', id: 'binary-tree-postorder-traversal' },
    { question: 'Maximum Depth of Binary Tree', id: 'maximum-depth-binary-tree' },
    { question: 'Symmetric Tree', id: 'symmetric-tree' },
    { question: 'Binary Tree Level Order Traversal', id: 'binary-tree-level-order' },
    { question: 'Binary Tree Right Side View', id: 'binary-tree-right-side-view' },
    { question: 'Same Tree', id: 'same-tree' },
    { question: 'Invert Binary Tree', id: 'invert-binary-tree' },
    { question: 'Path Sum', id: 'path-sum' },
    { question: 'Path Sum III', id: 'path-sum-iii' },
    { question: 'Diameter of Binary Tree', id: 'diameter-of-binary-tree' },
    { question: 'Validate Binary Search Tree', id: 'validate-bst' },
    { question: 'Lowest Common Ancestor in BST', id: 'lowest-common-ancestor-bst' },
    { question: 'Kth Smallest in BST', id: 'kth-smallest-in-bst' },
    { question: 'Construct BST from Sorted Array', id: 'construct-bst-from-sorted-array' },
  ] as const

  it('maps every planned tree curriculum question to an existing problem id', () => {
    const ids = new Set(codeExamples.map((problem) => problem.id))

    curriculumToProblemId.forEach(({ question, id }) => {
      expect(ids.has(id), `${question} -> ${id} should exist`).toBe(true)
    })
  })

  it('includes tree questions in trees subcategory and preserves multi-topic tagging', () => {
    const treesProblems = getExamplesByCategory('trees').map((problem) => problem.id)
    expect(treesProblems).toContain('dom-tree-height')
    expect(treesProblems).toContain('find-node-in-tree')
    expect(treesProblems).toContain('construct-bst-from-sorted-array')
    expect(treesProblems).toContain('path-sum-iii')
  })
})

describe('FAANG trie curriculum mapping', () => {
  const curriculumToProblemId = [
    { question: 'Implement Trie (Prefix Tree)', id: 'implement-trie-prefix-tree' },
    { question: 'Design Add and Search Words Data Structure', id: 'design-add-and-search-words-data-structure' },
    { question: 'Replace Words', id: 'replace-words' },
    { question: 'Search Suggestions System', id: 'search-suggestions-system' },
    { question: 'Stream of Characters', id: 'stream-of-characters' },
    { question: 'Word Search II', id: 'word-search-ii' },
    { question: 'Short Encoding of Words', id: 'short-encoding-of-words' },
    { question: 'Magic Dictionary', id: 'magic-dictionary' },
    { question: 'Maximum XOR of Two Numbers (Trie)', id: 'maximum-xor-of-two-numbers-trie' },
    { question: 'Longest Word in Dictionary', id: 'longest-word-in-dictionary' },
  ] as const

  it('maps every planned trie curriculum question to an existing problem id', () => {
    const ids = new Set(codeExamples.map((problem) => problem.id))

    curriculumToProblemId.forEach(({ question, id }) => {
      expect(ids.has(id), `${question} -> ${id} should exist`).toBe(true)
    })
  })

  it('preserves trie problem tagging and multi-topic overlap', () => {
    const trieProblems = getExamplesByCategory('trie').map((problem) => problem.id)
    expect(trieProblems).toContain('search-suggestions-system')
    expect(trieProblems).toContain('word-search-ii')

    const wordSearch = getExamplesByCategory('strings').find((problem) => problem.id === 'word-search-ii')
    expect(wordSearch?.categories).toContain('backtracking')

    const maxXor = getExamplesByCategory('bit-manipulation').find((problem) => problem.id === 'maximum-xor-of-two-numbers-trie')
    expect(maxXor).toBeDefined()
  })
})

describe('code example corpus health', () => {
  it('maintains baseline corpus size and identifier uniqueness', () => {
    const ids = codeExamples.map((problem) => problem.id)
    const uniqueIds = new Set(ids)
    const duplicateCount = ids.length - uniqueIds.size

    expect(ids.length).toBeGreaterThanOrEqual(conceptCoverageBaseline.totalCodeExamples)
    expect(uniqueIds.size).toBeGreaterThanOrEqual(conceptCoverageBaseline.uniqueCodeExamples)
    expect(duplicateCount).toBeLessThanOrEqual(
      conceptCoverageBaseline.totalCodeExamples - conceptCoverageBaseline.uniqueCodeExamples,
    )
  })

  it('tracks DSA tagged example coverage at expected scale', () => {
    const dsaProblemIds = new Set(
      codeExamples
        .filter((problem) => getExampleCategoryIds(problem).some(isDsaSubcategory))
        .map((problem) => problem.id),
    )

    expect(dsaProblemIds.size).toBeGreaterThanOrEqual(
      conceptCoverageBaseline.dsaProblemCount,
    )
  })
})
