import { test, expect } from '@playwright/test'

// Static routes that always exist
const staticRoutes = [
  { path: '/', name: 'home' },
  { path: '/concepts', name: 'concepts' },
  { path: '/concepts/js', name: 'concepts-js' },
  { path: '/concepts/dsa', name: 'concepts-dsa' },
  { path: '/js-problems', name: 'js-problems' },
]

// DSA pattern routes
const patternRoutes = [
  { path: '/concepts/dsa/patterns/two-pointers', name: 'pattern-two-pointers' },
  { path: '/concepts/dsa/patterns/hash-map', name: 'pattern-hash-map' },
  { path: '/concepts/dsa/patterns/bit-manipulation', name: 'pattern-bit-manipulation' },
]

// JS concept routes from src/data/concepts.ts
const jsConceptIds = [
  'js-philosophy',
  'variables',
  'data-types',
  'operators',
  'functions',
  'conditionals',
  'loops',
  'arrays-basics',
  'objects-basics',
  'hoisting',
  'type-coercion',
  'closures',
  'this-keyword',
  'event-loop',
  'prototypes',
  'recursion',
  'memory-model',
  'v8-engine',
  'nodejs-event-loop',
  'streams-buffers',
  'critical-render-path',
  'web-workers',
  'web-evolution',
  'module-evolution',
  'async-evolution',
  'state-evolution',
  'build-tools-evolution',
  'promises-deep-dive',
  'function-composition',
  'timing-control',
  'memoization',
]

const jsConceptRoutes = jsConceptIds.map(id => ({
  path: `/concepts/${id}`,
  name: `concept-${id}`,
}))

// DSA concept routes from src/data/dsaConcepts.ts
const dsaConceptIds = [
  'big-o-notation',
  'binary-system',
  'arrays',
  'hash-tables',
  'stacks',
  'queues',
  'linked-lists',
]

const dsaConceptRoutes = dsaConceptIds.map(id => ({
  path: `/concepts/dsa/${id}`,
  name: `concept-dsa-${id}`,
}))

// Category routes from src/data/examples.ts (exampleCategories)
const categoryIds = [
  'js-core',
  'async-js',
  'array-polyfills',
  'utility-functions',
  'functional-js',
  'dom-events',
  'object-utils',
  'promise-polyfills',
  'dsa',
]

const categoryRoutes = categoryIds.map(id => ({
  path: `/${id}`,
  name: `category-${id}`,
}))

// DSA subcategory routes from src/data/examples.ts (dsaSubcategories)
const dsaSubcategoryIds = [
  'arrays-hashing',
  'two-pointers',
  'sliding-window',
  'stack',
  'binary-search',
  'linked-list',
  'strings',
  'sorting',
  'recursion',
  'dynamic-programming',
  'greedy',
  'backtracking',
  'graphs',
  'trees',
  'trie',
  'heap',
  'intervals',
  'bit-manipulation',
  'math',
]

const dsaSubcategoryRoutes = dsaSubcategoryIds.map(id => ({
  path: `/${id}`,
  name: `category-${id}`,
}))

// Problem concept pages from src/data/algorithmConcepts.ts
// These are problems that have concept visualizations at /[category]/[problem]/concept
const problemConceptIds = [
  'two-sum-ii',
  'valid-palindrome',
  'reverse-string',
  'remove-duplicates-sorted',
  'move-zeroes',
  'squares-sorted-array',
  'container-with-most-water',
  'three-sum',
  'sort-colors',
  'remove-element',
  'is-subsequence',
  'merge-sorted-array',
  'partition-labels',
  'trapping-rain-water',
  'three-sum-closest',
  'single-number',
  'number-of-1-bits',
  'counting-bits',
  'reverse-bits',
  'missing-number',
  'power-of-two',
  'sum-of-two-integers',
  'single-number-ii',
  'single-number-iii',
  'bitwise-and-range',
  'number-complement',
  'power-of-four',
  'alternating-bits',
  'hamming-distance',
  'maximum-xor',
  'two-sum',
  'valid-anagram',
  'group-anagrams',
]

// Problem concept routes - we'll map them to their primary categories
// Most two-pointer problems are in two-pointers category
// Most bit manipulation problems are in bit-manipulation category
const problemConceptRoutes = [
  // Two pointers category
  { path: '/two-pointers/two-sum-ii/concept', name: 'concept-two-sum-ii' },
  { path: '/two-pointers/valid-palindrome/concept', name: 'concept-valid-palindrome' },
  { path: '/two-pointers/reverse-string/concept', name: 'concept-reverse-string' },
  { path: '/two-pointers/remove-duplicates-sorted/concept', name: 'concept-remove-duplicates-sorted' },
  { path: '/two-pointers/move-zeroes/concept', name: 'concept-move-zeroes' },
  { path: '/two-pointers/squares-sorted-array/concept', name: 'concept-squares-sorted-array' },
  { path: '/two-pointers/container-with-most-water/concept', name: 'concept-container-with-most-water' },
  { path: '/two-pointers/three-sum/concept', name: 'concept-three-sum' },
  { path: '/two-pointers/sort-colors/concept', name: 'concept-sort-colors' },
  { path: '/two-pointers/remove-element/concept', name: 'concept-remove-element' },
  { path: '/two-pointers/is-subsequence/concept', name: 'concept-is-subsequence' },
  { path: '/two-pointers/merge-sorted-array/concept', name: 'concept-merge-sorted-array' },
  { path: '/two-pointers/partition-labels/concept', name: 'concept-partition-labels' },
  { path: '/two-pointers/trapping-rain-water/concept', name: 'concept-trapping-rain-water' },
  { path: '/two-pointers/three-sum-closest/concept', name: 'concept-three-sum-closest' },
  
  // Bit manipulation category
  { path: '/bit-manipulation/single-number/concept', name: 'concept-single-number' },
  { path: '/bit-manipulation/number-of-1-bits/concept', name: 'concept-number-of-1-bits' },
  { path: '/bit-manipulation/counting-bits/concept', name: 'concept-counting-bits' },
  { path: '/bit-manipulation/reverse-bits/concept', name: 'concept-reverse-bits' },
  { path: '/bit-manipulation/missing-number/concept', name: 'concept-missing-number' },
  { path: '/bit-manipulation/power-of-two/concept', name: 'concept-power-of-two' },
  { path: '/bit-manipulation/sum-of-two-integers/concept', name: 'concept-sum-of-two-integers' },
  { path: '/bit-manipulation/single-number-ii/concept', name: 'concept-single-number-ii' },
  { path: '/bit-manipulation/single-number-iii/concept', name: 'concept-single-number-iii' },
  { path: '/bit-manipulation/bitwise-and-range/concept', name: 'concept-bitwise-and-range' },
  { path: '/bit-manipulation/number-complement/concept', name: 'concept-number-complement' },
  { path: '/bit-manipulation/power-of-four/concept', name: 'concept-power-of-four' },
  { path: '/bit-manipulation/alternating-bits/concept', name: 'concept-alternating-bits' },
  { path: '/bit-manipulation/hamming-distance/concept', name: 'concept-hamming-distance' },
  { path: '/bit-manipulation/maximum-xor/concept', name: 'concept-maximum-xor' },
  
  // Arrays & Hashing category
  { path: '/arrays-hashing/two-sum/concept', name: 'concept-two-sum' },
  { path: '/arrays-hashing/valid-anagram/concept', name: 'concept-valid-anagram' },
  { path: '/arrays-hashing/group-anagrams/concept', name: 'concept-group-anagrams' },
]

// Combine all routes
const allRoutes = [
  ...staticRoutes,
  ...patternRoutes,
  ...jsConceptRoutes,
  ...dsaConceptRoutes,
  ...categoryRoutes,
  ...dsaSubcategoryRoutes,
  ...problemConceptRoutes,
]

test.describe('Visual Regression', () => {
  for (const route of allRoutes) {
    test(`${route.name} renders correctly`, async ({ page }) => {
      await page.goto(route.path)
      // Wait for content to load and animations to settle
      await page.waitForLoadState('networkidle')
      // Additional wait for any CSS transitions to complete
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
      })
    })
  }
})
