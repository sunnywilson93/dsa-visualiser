import type { DSAPattern } from '@/components/DSAPatterns/types'

export const DSA_PATTERN_IDS = ['two-pointers', 'hash-map', 'bit-manipulation', 'binary-search'] as const
export type DSAPatternId = typeof DSA_PATTERN_IDS[number]

export const dsaPatterns: DSAPattern[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    slug: 'two-pointers',
    description: 'Use two pointers to traverse an array or string, reducing time complexity from O(n^2) to O(n) for problems involving pairs or subarrays.',
    whenToUse: [
      'Finding pairs that satisfy a condition (sum, product)',
      'Removing duplicates from sorted array',
      'Reversing or partitioning arrays in-place',
      'Detecting cycles in linked lists (slow/fast)',
    ],
    variants: [
      {
        id: 'converging',
        name: 'Converging Pointers',
        description: 'Start pointers at opposite ends, move toward each other based on comparison.',
        whenToUse: 'Sorted arrays, pair sum problems, palindrome checks',
      },
      {
        id: 'same-direction',
        name: 'Same Direction (Slow/Fast)',
        description: 'Both pointers start at beginning, fast pointer moves ahead to find patterns.',
        whenToUse: 'Remove duplicates, cycle detection, find middle element',
      },
      {
        id: 'partition',
        name: 'Partition (Dutch Flag)',
        description: 'Three-way partition using two pointers to separate elements into regions.',
        whenToUse: 'Sort colors (0s, 1s, 2s), partition around pivot',
      },
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    relatedProblems: ['two-sum', 'three-sum', 'container-with-most-water'],
  },
  {
    id: 'hash-map',
    name: 'Hash Map',
    slug: 'hash-map',
    description: 'Use a hash map for O(1) lookup to track seen elements, frequencies, or complement values during array traversal.',
    whenToUse: [
      'Finding pairs/triplets with target sum',
      'Counting frequency of elements',
      'Checking for duplicates or anagrams',
      'Storing indices for later lookup',
    ],
    variants: [
      {
        id: 'complement-lookup',
        name: 'Complement Lookup',
        description: 'Store complement values (target - current) to find pairs in single pass.',
        whenToUse: 'Two Sum, pair with target sum',
      },
      {
        id: 'frequency-counter',
        name: 'Frequency Counter',
        description: 'Count occurrences of each element for comparison or finding duplicates.',
        whenToUse: 'Valid Anagram, first unique character, majority element',
      },
      {
        id: 'index-storage',
        name: 'Index Storage',
        description: 'Store indices of elements for later reference or constraint checking.',
        whenToUse: 'Contains Duplicate II, finding subarrays with constraints',
      },
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
    relatedProblems: ['two-sum', 'valid-anagram', 'group-anagrams'],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    slug: 'bit-manipulation',
    description: 'Use bitwise operations to solve problems efficiently by treating integers as arrays of bits.',
    whenToUse: [
      'Finding single/missing numbers without extra space',
      'Checking if number is power of two',
      'Counting set bits or toggling specific bits',
      'XOR tricks for finding unpaired elements',
    ],
    variants: [
      {
        id: 'xor-tricks',
        name: 'XOR Tricks',
        description: 'Use XOR properties: a ^ a = 0, a ^ 0 = a to find unique elements.',
        whenToUse: 'Single Number, missing number from sequence',
      },
      {
        id: 'bit-masks',
        name: 'Bit Masks',
        description: 'Use AND, OR masks to check, set, or clear specific bit positions.',
        whenToUse: 'Power of two checks, counting bits, subset generation',
      },
      {
        id: 'shift-operations',
        name: 'Shift Operations',
        description: 'Use left/right shifts to multiply/divide by powers of 2 or extract bits.',
        whenToUse: 'Reverse bits, counting leading zeros, bit extraction',
      },
    ],
    complexity: {
      time: 'O(1) or O(log n)',
      space: 'O(1)',
    },
    relatedProblems: ['single-number', 'counting-bits', 'reverse-bits'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    slug: 'binary-search',
    description: 'Eliminate half the search space each iteration by comparing the midpoint against a condition, reducing O(n) linear scans to O(log n).',
    whenToUse: [
      'Searching for a target in a sorted array or matrix',
      'Finding the first or last occurrence of a value (boundary finding)',
      'Searching in a rotated sorted array',
      'Optimizing over a monotonic answer space (minimize maximum, maximize minimum)',
    ],
    variants: [
      {
        id: 'classic',
        name: 'Classic Sorted Array',
        description: 'Search for an exact target in a sorted array by comparing the midpoint and eliminating the irrelevant half.',
        whenToUse: 'Target exists or does not exist in sorted array, search insert position',
      },
      {
        id: 'boundary-finding',
        name: 'Boundary Finding (First/Last)',
        description: 'Find the leftmost or rightmost position where a condition changes. Continue searching even after finding a match.',
        whenToUse: 'First/last occurrence, first bad version, search range, finding transition point',
      },
      {
        id: 'rotated-array',
        name: 'Rotated Array Search',
        description: 'At least one half is always sorted after rotation. Determine which half is sorted, then decide which half to search.',
        whenToUse: 'Search in rotated sorted array, find minimum in rotated array',
      },
      {
        id: 'answer-space',
        name: 'Binary Search on Answer',
        description: 'When the answer itself is monotonic (if X works, X+1 also works), binary search the answer space instead of a data structure.',
        whenToUse: 'Koko eating bananas, capacity to ship packages, split array largest sum, minimize maximum',
      },
    ],
    complexity: {
      time: 'O(log n)',
      space: 'O(1)',
    },
    relatedProblems: ['binary-search-basic', 'search-insert-position', 'first-last-position', 'search-rotated-array', 'find-min-rotated', 'koko-eating-bananas'],
  },
]

export function getPatternById(id: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.id === id)
}

export function getPatternBySlug(slug: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.slug === slug)
}
