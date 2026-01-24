import type { DSAPattern } from '@/components/DSAPatterns/types'

export const DSA_PATTERN_IDS = ['two-pointers', 'hash-map', 'bit-manipulation'] as const
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
]

export function getPatternById(id: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.id === id)
}

export function getPatternBySlug(slug: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.slug === slug)
}
