import type { DSAPattern } from '@/components/DSAPatterns/types'

export const DSA_PATTERN_IDS = ['two-pointers', 'hash-map', 'bit-manipulation', 'binary-search', 'sorting', 'heap'] as const
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
    relatedProblems: ['binary-search-basic', 'search-insert-position', 'first-last-position', 'first-bad-version', 'search-rotated-array', 'search-rotated-array-ii', 'find-min-rotated', 'find-peak-element', 'peak-index-in-mountain-array', 'koko-eating-bananas', 'capacity-to-ship', 'find-smallest-divisor', 'minimum-number-of-days', 'magnetic-force-between-balls', 'search-2d-matrix', 'search-2d-matrix-ii', 'split-array-largest-sum', 'median-two-sorted-arrays'],
  },
  {
    id: 'sorting',
    name: 'Sorting',
    slug: 'sorting',
    description: 'Use sorting as a preprocessing step to simplify problems, or apply partition logic for in-place rearrangement. Many interview problems become trivial once the array is sorted.',
    whenToUse: [
      'Interval problems (merge, insert, non-overlapping)',
      'Finding closest pairs or grouping adjacent elements',
      'Problems requiring custom ordering (largest number, frequency sort)',
      'In-place partitioning (sort colors, sort by parity)',
    ],
    variants: [
      {
        id: 'sort-and-scan',
        name: 'Sort + Linear Scan',
        description: 'Sort the array first, then scan linearly to find the answer. Sorting makes adjacent elements comparable.',
        whenToUse: 'Merge intervals, meeting rooms, 3Sum, closest pairs',
      },
      {
        id: 'custom-comparator',
        name: 'Custom Comparator',
        description: 'Define a custom sort order using a comparator function. The key insight is choosing what to compare.',
        whenToUse: 'Largest number, sort by frequency, relative sort, custom ordering',
      },
      {
        id: 'partition',
        name: 'Partition / Dutch Flag',
        description: 'Rearrange elements in-place by partitioning around a condition without fully sorting.',
        whenToUse: 'Sort colors (0s, 1s, 2s), sort by parity, QuickSelect for Kth element',
      },
      {
        id: 'bucket-counting',
        name: 'Bucket / Counting Sort',
        description: 'When values are bounded, use counting or bucket sort for O(n) time instead of O(n log n).',
        whenToUse: 'Top K frequent, sort characters by frequency, bounded integer sorting',
      },
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(1) to O(n)',
    },
    relatedProblems: ['merge-intervals', 'meeting-rooms', 'largest-number', 'sort-colors', 'kth-largest-element', 'sort-characters-by-frequency'],
  },
  {
    id: 'heap',
    name: 'Heap',
    slug: 'heap',
    description: 'Use a heap (priority queue) when you repeatedly need the minimum or maximum of a changing set while also inserting and deleting values efficiently.',
    whenToUse: [
      'Finding top-k frequent or top-k largest elements',
      'Merging multiple sorted streams or linked lists',
      'Scheduling tasks by earliest deadline or smallest processing time',
      'Shortest-path variants where you need a dynamic smallest-distance choice',
    ],
    variants: [
      {
        id: 'min-heap',
        name: 'Min-Heap (Priority Queue)',
        description: 'Keep the smallest element available in O(1) and rebalance neighbors in O(log n) after insert/remove.',
        whenToUse: 'Need frequent minimum extraction like earliest end time, shortest distance, or smallest remaining value',
      },
      {
        id: 'max-heap',
        name: 'Max-Heap (Priority Queue)',
        description: 'Keep the largest element available quickly and drop smaller ones when capacity is limited.',
        whenToUse: 'Need running maximums or top-k selection while scanning a stream',
      },
      {
        id: 'heap-selection',
        name: 'Heap Selection',
        description: 'When sorting is overkill, keep only a bounded heap of size k and maintain the best candidates.',
        whenToUse: 'Top-k, kth element, and streaming order-statistics without full sort',
      },
    ],
    complexity: {
      time: 'O(log n)',
      space: 'O(n)',
    },
    relatedProblems: ['top-k-frequent', 'kth-largest-element', 'merge-k-sorted-lists', 'meeting-rooms-ii', 'network-delay-time'],
  },
]

export function getPatternById(id: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.id === id)
}

export function getPatternBySlug(slug: string): DSAPattern | undefined {
  return dsaPatterns.find(pattern => pattern.slug === slug)
}
