import type { ConceptType, ConceptStep } from '@/types'

// ============================================================================
// Problem-Level Concept Visualizations
// ============================================================================

export interface ProblemConcept {
  title: string
  keyInsight: string
  pattern: ConceptType
  steps: ConceptStep[]
}

export const problemConcepts: Record<string, ProblemConcept> = {
  // ==================== TWO POINTER PROBLEMS ====================

  'two-sum-ii': {
    title: 'Two Sum II (Sorted Array)',
    keyInsight: 'In sorted array: sum < target → move left right, sum > target → move right left',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup: Find two numbers summing to 9',
        description: 'Array is sorted. Place left pointer at start, right at end.',
        visual: {
          array: [2, 7, 11, 15],
          pointers: { left: 0, right: 3 },
          annotations: ['Target: 9'],
        },
      },
      {
        id: 2,
        title: 'Check Sum',
        description: '2 + 15 = 17. Sum is greater than 9, so move right pointer left.',
        visual: {
          array: [2, 7, 11, 15],
          pointers: { left: 0, right: 3 },
          highlights: [0, 3],
          annotations: ['2 + 15 = 17 > 9'],
        },
      },
      {
        id: 3,
        title: 'Move Right Pointer',
        description: 'Right moves to index 2. Now check 2 + 11.',
        visual: {
          array: [2, 7, 11, 15],
          pointers: { left: 0, right: 2 },
          highlights: [0, 2],
          annotations: ['2 + 11 = 13 > 9'],
        },
      },
      {
        id: 4,
        title: 'Continue Moving',
        description: 'Still too large. Right moves to index 1.',
        visual: {
          array: [2, 7, 11, 15],
          pointers: { left: 0, right: 1 },
          highlights: [0, 1],
          annotations: ['2 + 7 = 9 ✓'],
        },
      },
      {
        id: 5,
        title: 'Found!',
        description: '2 + 7 = 9. Return indices [0, 1].',
        visual: {
          array: [2, 7, 11, 15],
          pointers: { left: 0, right: 1 },
          highlights: [0, 1],
          result: 'Indices: [0, 1]',
        },
      },
    ],
  },

  'valid-palindrome': {
    title: 'Valid Palindrome',
    keyInsight: 'Compare characters from both ends, skip non-alphanumeric, move inward',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Clean String',
        description: '"A man, a plan, a canal: Panama" → "amanaplanacanalpanama"',
        visual: {
          array: ['a', 'm', 'a', 'n', 'a', 'p', 'l', 'a', 'n', 'a', 'c', 'a', 'n', 'a', 'l', 'p', 'a', 'n', 'a', 'm', 'a'],
          pointers: { left: 0, right: 20 },
        },
      },
      {
        id: 2,
        title: 'Compare Ends',
        description: 'Compare "a" at left with "a" at right. They match!',
        visual: {
          array: ['a', 'm', 'a', 'n', 'a', 'p', 'l', 'a', 'n', 'a', 'c', 'a', 'n', 'a', 'l', 'p', 'a', 'n', 'a', 'm', 'a'],
          pointers: { left: 0, right: 20 },
          highlights: [0, 20],
          annotations: ['a == a ✓'],
        },
      },
      {
        id: 3,
        title: 'Move Inward',
        description: 'Both pointers move. Compare "m" with "m".',
        visual: {
          array: ['a', 'm', 'a', 'n', 'a', 'p', 'l', 'a', 'n', 'a', 'c', 'a', 'n', 'a', 'l', 'p', 'a', 'n', 'a', 'm', 'a'],
          pointers: { left: 1, right: 19 },
          highlights: [1, 19],
          annotations: ['m == m ✓'],
        },
      },
      {
        id: 4,
        title: 'Continue to Center',
        description: 'Keep comparing until pointers meet at center.',
        visual: {
          array: ['a', 'm', 'a', 'n', 'a', 'p', 'l', 'a', 'n', 'a', 'c', 'a', 'n', 'a', 'l', 'p', 'a', 'n', 'a', 'm', 'a'],
          pointers: { left: 10, right: 10 },
          highlights: [10],
          annotations: ['Pointers met!'],
        },
      },
      {
        id: 5,
        title: 'Valid Palindrome',
        description: 'All pairs matched. It\'s a palindrome!',
        visual: {
          array: ['a', 'm', 'a', 'n', 'a', 'p', 'l', 'a', 'n', 'a', 'c', 'a', 'n', 'a', 'l', 'p', 'a', 'n', 'a', 'm', 'a'],
          result: true,
        },
      },
    ],
  },

  'reverse-string': {
    title: 'Reverse String',
    keyInsight: 'Swap left and right elements, move both pointers inward until they meet',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Initial Array',
        description: 'Place pointers at both ends of the character array.',
        visual: {
          array: ['h', 'e', 'l', 'l', 'o'],
          pointers: { left: 0, right: 4 },
        },
      },
      {
        id: 2,
        title: 'First Swap',
        description: 'Swap "h" and "o".',
        visual: {
          array: ['o', 'e', 'l', 'l', 'h'],
          pointers: { left: 0, right: 4 },
          highlights: [0, 4],
          annotations: ['Swap h ↔ o'],
        },
      },
      {
        id: 3,
        title: 'Move & Swap',
        description: 'Move pointers, swap "e" and "l".',
        visual: {
          array: ['o', 'l', 'l', 'e', 'h'],
          pointers: { left: 1, right: 3 },
          highlights: [1, 3],
          annotations: ['Swap e ↔ l'],
        },
      },
      {
        id: 4,
        title: 'Pointers Meet',
        description: 'Pointers cross - we\'re done!',
        visual: {
          array: ['o', 'l', 'l', 'e', 'h'],
          pointers: { left: 2, right: 2 },
          highlights: [2],
        },
      },
      {
        id: 5,
        title: 'Reversed!',
        description: '"hello" → "olleh"',
        visual: {
          array: ['o', 'l', 'l', 'e', 'h'],
          result: '"olleh"',
        },
      },
    ],
  },

  'remove-duplicates-sorted': {
    title: 'Remove Duplicates (Sorted)',
    keyInsight: 'Slow pointer marks unique position, fast scans for new unique values',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Slow at 0 (position for unique), Fast starts scanning from 1.',
        visual: {
          array: [0, 0, 1, 1, 2],
          pointers: { slow: 0, fast: 1 },
        },
      },
      {
        id: 2,
        title: 'Duplicate Found',
        description: 'nums[fast]=0 equals nums[slow]=0. Skip, move fast only.',
        visual: {
          array: [0, 0, 1, 1, 2],
          pointers: { slow: 0, fast: 1 },
          highlights: [0, 1],
          annotations: ['0 == 0, skip'],
        },
      },
      {
        id: 3,
        title: 'New Unique Found',
        description: 'nums[fast]=1 ≠ nums[slow]=0. Move slow, copy value.',
        visual: {
          array: [0, 1, 1, 1, 2],
          pointers: { slow: 1, fast: 2 },
          highlights: [1, 2],
          annotations: ['Found 1, copy to slow'],
        },
      },
      {
        id: 4,
        title: 'Another Unique',
        description: 'nums[fast]=2 ≠ nums[slow]=1. Move slow, copy value.',
        visual: {
          array: [0, 1, 2, 1, 2],
          pointers: { slow: 2, fast: 4 },
          highlights: [2, 4],
          annotations: ['Found 2, copy to slow'],
        },
      },
      {
        id: 5,
        title: 'Done',
        description: 'New length = slow + 1 = 3. First 3 elements are unique.',
        visual: {
          array: [0, 1, 2, 1, 2],
          highlights: [0, 1, 2],
          result: 'Length: 3',
        },
      },
    ],
  },

  'move-zeroes': {
    title: 'Move Zeroes',
    keyInsight: 'Slow marks position for non-zero, swap when fast finds non-zero',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Both pointers start at 0. Fast scans for non-zeros.',
        visual: {
          array: [0, 1, 0, 3, 12],
          pointers: { slow: 0, fast: 0 },
        },
      },
      {
        id: 2,
        title: 'Found Non-Zero',
        description: 'fast=1 has value 1. Swap with slow position.',
        visual: {
          array: [1, 0, 0, 3, 12],
          pointers: { slow: 0, fast: 1 },
          highlights: [0, 1],
          annotations: ['Swap: put 1 at front'],
        },
      },
      {
        id: 3,
        title: 'Continue',
        description: 'fast=3 has value 3. Swap with slow=1.',
        visual: {
          array: [1, 3, 0, 0, 12],
          pointers: { slow: 1, fast: 3 },
          highlights: [1, 3],
          annotations: ['Swap: put 3 next'],
        },
      },
      {
        id: 4,
        title: 'Last Non-Zero',
        description: 'fast=4 has value 12. Swap with slow=2.',
        visual: {
          array: [1, 3, 12, 0, 0],
          pointers: { slow: 2, fast: 4 },
          highlights: [2, 4],
          annotations: ['Swap: put 12 next'],
        },
      },
      {
        id: 5,
        title: 'Done',
        description: 'All non-zeros moved to front, zeros at end.',
        visual: {
          array: [1, 3, 12, 0, 0],
          result: '[1, 3, 12, 0, 0]',
        },
      },
    ],
  },

  'squares-sorted-array': {
    title: 'Squares of Sorted Array',
    keyInsight: 'Largest squares at ends (negatives). Compare ends, fill result from back.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Array has negatives. Largest squares are at the ends.',
        visual: {
          array: [-4, -1, 0, 3, 10],
          pointers: { left: 0, right: 4 },
          annotations: ['(-4)²=16, 10²=100'],
        },
      },
      {
        id: 2,
        title: 'Compare Squares',
        description: '(-4)²=16 vs 10²=100. 100 is larger, place at end.',
        visual: {
          array: [-4, -1, 0, 3, 10],
          pointers: { left: 0, right: 4 },
          highlights: [4],
          annotations: ['Result: [_,_,_,_,100]'],
        },
      },
      {
        id: 3,
        title: 'Next Comparison',
        description: '(-4)²=16 vs 3²=9. 16 is larger.',
        visual: {
          array: [-4, -1, 0, 3, 10],
          pointers: { left: 0, right: 3 },
          highlights: [0],
          annotations: ['Result: [_,_,_,16,100]'],
        },
      },
      {
        id: 4,
        title: 'Continue',
        description: '(-1)²=1 vs 3²=9. 9 is larger.',
        visual: {
          array: [-4, -1, 0, 3, 10],
          pointers: { left: 1, right: 3 },
          highlights: [3],
          annotations: ['Result: [_,_,9,16,100]'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Sorted squares: [0, 1, 9, 16, 100]',
        visual: {
          array: [0, 1, 9, 16, 100],
          result: '[0, 1, 9, 16, 100]',
        },
      },
    ],
  },

  'container-with-most-water': {
    title: 'Container With Most Water',
    keyInsight: 'Area = min(heights) × width. Move shorter line inward to potentially increase area.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Start with widest container. Heights: 1 and 7.',
        visual: {
          array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: { left: 0, right: 8 },
          annotations: ['Area = min(1,7) × 8 = 8'],
        },
      },
      {
        id: 2,
        title: 'Move Shorter Side',
        description: 'Left is shorter (1). Move left to find taller line.',
        visual: {
          array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: { left: 1, right: 8 },
          highlights: [1, 8],
          annotations: ['Area = min(8,7) × 7 = 49'],
        },
      },
      {
        id: 3,
        title: 'New Max',
        description: 'Area 49 > 8. This is our new maximum!',
        visual: {
          array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: { left: 1, right: 8 },
          annotations: ['Max so far: 49'],
        },
      },
      {
        id: 4,
        title: 'Continue',
        description: 'Right is shorter (7). Move right. Continue until pointers meet.',
        visual: {
          array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: { left: 1, right: 6 },
          annotations: ['Area = min(8,8) × 5 = 40'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Maximum area found: 49',
        visual: {
          array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          highlights: [1, 8],
          result: 'Max Area: 49',
        },
      },
    ],
  },

  'three-sum': {
    title: '3Sum',
    keyInsight: 'Sort first. Fix one element, use two pointers for remaining two. Skip duplicates.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Sort Array',
        description: '[-1, 0, 1, 2, -1, -4] → [-4, -1, -1, 0, 1, 2]',
        visual: {
          array: [-4, -1, -1, 0, 1, 2],
          annotations: ['Sorted for two-pointer'],
        },
      },
      {
        id: 2,
        title: 'Fix First Element',
        description: 'Fix i=0 (value -4). Use two pointers for rest.',
        visual: {
          array: [-4, -1, -1, 0, 1, 2],
          pointers: { i: 0, left: 1, right: 5 },
          highlights: [0],
          annotations: ['-4 + (-1) + 2 = -3 < 0'],
        },
      },
      {
        id: 3,
        title: 'Next Fixed Element',
        description: 'Fix i=1 (value -1). Now search for sum = 1.',
        visual: {
          array: [-4, -1, -1, 0, 1, 2],
          pointers: { i: 1, left: 2, right: 5 },
          highlights: [1],
          annotations: ['-1 + (-1) + 2 = 0 ✓'],
        },
      },
      {
        id: 4,
        title: 'Found Triplet!',
        description: '[-1, -1, 2] sums to 0. Skip duplicates, continue.',
        visual: {
          array: [-4, -1, -1, 0, 1, 2],
          pointers: { i: 1, left: 3, right: 4 },
          highlights: [1, 3, 4],
          annotations: ['-1 + 0 + 1 = 0 ✓'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Found triplets: [[-1,-1,2], [-1,0,1]]',
        visual: {
          array: [-4, -1, -1, 0, 1, 2],
          result: '[[-1,-1,2], [-1,0,1]]',
        },
      },
    ],
  },

  'sort-colors': {
    title: 'Sort Colors (Dutch Flag)',
    keyInsight: 'Three pointers: low for 0s, mid scans, high for 2s. One pass O(n).',
    pattern: 'two-pointers-partition',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'low=0 (0s go here), mid=0 (scanner), high=5 (2s go here)',
        visual: {
          array: [2, 0, 2, 1, 1, 0],
          pointers: { low: 0, mid: 0, high: 5 },
        },
      },
      {
        id: 2,
        title: 'Found 2',
        description: 'mid=0 sees 2. Swap with high. Decrease high.',
        visual: {
          array: [0, 0, 2, 1, 1, 2],
          pointers: { low: 0, mid: 0, high: 4 },
          highlights: [0, 5],
          annotations: ['Swap 2 to end'],
        },
      },
      {
        id: 3,
        title: 'Found 0',
        description: 'mid=0 sees 0. Swap with low. Increase both.',
        visual: {
          array: [0, 0, 2, 1, 1, 2],
          pointers: { low: 1, mid: 1, high: 4 },
          highlights: [0],
          annotations: ['0 in place'],
        },
      },
      {
        id: 4,
        title: 'Found 1',
        description: 'mid sees 1. It\'s in the right zone. Just move mid.',
        visual: {
          array: [0, 0, 1, 1, 2, 2],
          pointers: { low: 2, mid: 4, high: 4 },
          annotations: ['1s stay in middle'],
        },
      },
      {
        id: 5,
        title: 'Done',
        description: 'mid > high, sorting complete!',
        visual: {
          array: [0, 0, 1, 1, 2, 2],
          result: '[0,0,1,1,2,2]',
        },
      },
    ],
  },

  'remove-element': {
    title: 'Remove Element',
    keyInsight: 'Slow pointer builds result, fast scans. Copy non-target values to slow position.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Remove all 3s from [3,2,2,3]. slow=0, fast scans.',
        visual: {
          array: [3, 2, 2, 3],
          pointers: { slow: 0, fast: 0 },
          annotations: ['Remove value: 3'],
        },
      },
      {
        id: 2,
        title: 'Skip Target',
        description: 'fast=0 is 3 (target). Skip it.',
        visual: {
          array: [3, 2, 2, 3],
          pointers: { slow: 0, fast: 0 },
          highlights: [0],
          annotations: ['Skip 3'],
        },
      },
      {
        id: 3,
        title: 'Keep Non-Target',
        description: 'fast=1 is 2. Copy to slow position.',
        visual: {
          array: [2, 2, 2, 3],
          pointers: { slow: 1, fast: 2 },
          highlights: [0, 1],
          annotations: ['Keep 2'],
        },
      },
      {
        id: 4,
        title: 'Keep Another',
        description: 'fast=2 is 2. Copy to slow=1.',
        visual: {
          array: [2, 2, 2, 3],
          pointers: { slow: 2, fast: 3 },
          highlights: [1],
        },
      },
      {
        id: 5,
        title: 'Done',
        description: 'New length = 2. First 2 elements are valid.',
        visual: {
          array: [2, 2, 2, 3],
          highlights: [0, 1],
          result: 'Length: 2',
        },
      },
    ],
  },

  'is-subsequence': {
    title: 'Is Subsequence',
    keyInsight: 'Two pointers: advance s-pointer only on match. If s-pointer reaches end, it\'s a subsequence.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Is "abc" a subsequence of "ahbgdc"?',
        visual: {
          array: ['a', 'h', 'b', 'g', 'd', 'c'],
          pointers: { i: 0, j: 0 },
          annotations: ['s="abc", t="ahbgdc"'],
        },
      },
      {
        id: 2,
        title: 'First Match',
        description: 's[0]="a" matches t[0]="a". Advance both.',
        visual: {
          array: ['a', 'h', 'b', 'g', 'd', 'c'],
          pointers: { i: 1, j: 1 },
          highlights: [0],
          annotations: ['Matched "a"'],
        },
      },
      {
        id: 3,
        title: 'No Match',
        description: 's[1]="b" ≠ t[1]="h". Advance j only.',
        visual: {
          array: ['a', 'h', 'b', 'g', 'd', 'c'],
          pointers: { i: 1, j: 2 },
          annotations: ['Skip "h"'],
        },
      },
      {
        id: 4,
        title: 'Match Found',
        description: 's[1]="b" matches t[2]="b". Advance both.',
        visual: {
          array: ['a', 'h', 'b', 'g', 'd', 'c'],
          pointers: { i: 2, j: 5 },
          highlights: [0, 2, 5],
          annotations: ['Matched "a", "b", "c"'],
        },
      },
      {
        id: 5,
        title: 'Is Subsequence',
        description: 'i reached end of s. "abc" IS a subsequence!',
        visual: {
          array: ['a', 'h', 'b', 'g', 'd', 'c'],
          highlights: [0, 2, 5],
          result: true,
        },
      },
    ],
  },

  'merge-sorted-array': {
    title: 'Merge Sorted Array',
    keyInsight: 'Start from end to avoid overwriting. Compare and place larger element at back.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'nums1=[1,2,3,0,0,0], nums2=[2,5,6]. Fill from end.',
        visual: {
          array: [1, 2, 3, 0, 0, 0],
          pointers: { p1: 2, p2: 2, pos: 5 },
          annotations: ['nums2=[2,5,6]'],
        },
      },
      {
        id: 2,
        title: 'Compare Ends',
        description: '3 vs 6. 6 is larger, place at position 5.',
        visual: {
          array: [1, 2, 3, 0, 0, 6],
          pointers: { p1: 2, p2: 1, pos: 4 },
          highlights: [5],
          annotations: ['Place 6'],
        },
      },
      {
        id: 3,
        title: 'Next Compare',
        description: '3 vs 5. 5 is larger, place at position 4.',
        visual: {
          array: [1, 2, 3, 0, 5, 6],
          pointers: { p1: 2, p2: 0, pos: 3 },
          highlights: [4],
          annotations: ['Place 5'],
        },
      },
      {
        id: 4,
        title: 'Continue',
        description: '3 vs 2. 3 is larger, place at position 3.',
        visual: {
          array: [1, 2, 3, 3, 5, 6],
          pointers: { p1: 1, p2: 0, pos: 2 },
          highlights: [3],
          annotations: ['Place 3'],
        },
      },
      {
        id: 5,
        title: 'Done',
        description: 'Merged: [1, 2, 2, 3, 5, 6]',
        visual: {
          array: [1, 2, 2, 3, 5, 6],
          result: '[1,2,2,3,5,6]',
        },
      },
    ],
  },

  'partition-labels': {
    title: 'Partition Labels',
    keyInsight: 'Track last occurrence of each char. Extend partition until index equals end.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Track Last Occurrences',
        description: 'For "ababcbaca": a→8, b→5, c→7',
        visual: {
          array: ['a', 'b', 'a', 'b', 'c', 'b', 'a', 'c', 'a'],
          annotations: ['last: a=8, b=5, c=7'],
        },
      },
      {
        id: 2,
        title: 'Start Partition',
        description: 'At i=0, char="a", last=8. End must be at least 8.',
        visual: {
          array: ['a', 'b', 'a', 'b', 'c', 'b', 'a', 'c', 'a'],
          pointers: { start: 0, end: 8 },
          highlights: [0],
          annotations: ['Partition end: 8'],
        },
      },
      {
        id: 3,
        title: 'Check All Chars',
        description: 'All chars between 0-8 have last occurrence ≤ 8.',
        visual: {
          array: ['a', 'b', 'a', 'b', 'c', 'b', 'a', 'c', 'a'],
          pointers: { start: 0, end: 8 },
          highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
      {
        id: 4,
        title: 'Partition Complete',
        description: 'When i reaches end (8), partition is complete. Size=9.',
        visual: {
          array: ['a', 'b', 'a', 'b', 'c', 'b', 'a', 'c', 'a'],
          highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          annotations: ['Size: 9'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Only one partition of size 9 for this example.',
        visual: {
          array: ['a', 'b', 'a', 'b', 'c', 'b', 'a', 'c', 'a'],
          result: '[9]',
        },
      },
    ],
  },

  'trapping-rain-water': {
    title: 'Trapping Rain Water',
    keyInsight: 'Water at i = min(maxLeft, maxRight) - height[i]. Track max from both sides.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Track maxLeft and maxRight as pointers move inward.',
        visual: {
          array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: { left: 0, right: 11 },
          annotations: ['maxL=0, maxR=0'],
        },
      },
      {
        id: 2,
        title: 'Process Left',
        description: 'height[0]=0 < height[11]=1. Update maxL, no water at 0.',
        visual: {
          array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: { left: 1, right: 11 },
          annotations: ['maxL=0, water=0'],
        },
      },
      {
        id: 3,
        title: 'Water Trapped',
        description: 'At position 2: height=0, maxL=1. Water = 1-0 = 1.',
        visual: {
          array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: { left: 2, right: 11 },
          highlights: [2],
          annotations: ['Trap 1 unit at pos 2'],
        },
      },
      {
        id: 4,
        title: 'Continue',
        description: 'Process all positions. Track total water.',
        visual: {
          array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: { left: 5, right: 8 },
          highlights: [2, 4, 5, 6, 9],
          annotations: ['Total so far: 5'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Total trapped water: 6 units',
        visual: {
          array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          result: 'Water: 6',
        },
      },
    ],
  },

  'three-sum-closest': {
    title: '3Sum Closest',
    keyInsight: 'Like 3Sum but track |sum - target|. Update closest when difference decreases.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Sort Array',
        description: '[-1, 2, 1, -4] → [-4, -1, 1, 2]. Target = 1.',
        visual: {
          array: [-4, -1, 1, 2],
          annotations: ['Target: 1'],
        },
      },
      {
        id: 2,
        title: 'Fix i=0',
        description: '-4 + (-1) + 2 = -3. Diff from target = |−3−1| = 4.',
        visual: {
          array: [-4, -1, 1, 2],
          pointers: { i: 0, left: 1, right: 3 },
          highlights: [0, 1, 3],
          annotations: ['Sum=-3, diff=4'],
        },
      },
      {
        id: 3,
        title: 'Fix i=1',
        description: '-1 + 1 + 2 = 2. Diff = |2−1| = 1. Closer!',
        visual: {
          array: [-4, -1, 1, 2],
          pointers: { i: 1, left: 2, right: 3 },
          highlights: [1, 2, 3],
          annotations: ['Sum=2, diff=1 ✓'],
        },
      },
      {
        id: 4,
        title: 'Best Found',
        description: 'Sum 2 is closest to target 1 (diff=1).',
        visual: {
          array: [-4, -1, 1, 2],
          highlights: [1, 2, 3],
          annotations: ['Closest: 2'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Closest sum to 1 is 2.',
        visual: {
          array: [-4, -1, 1, 2],
          result: 'Closest: 2',
        },
      },
    ],
  },

  // ==================== BIT MANIPULATION PROBLEMS ====================

  'single-number': {
    title: 'Single Number',
    keyInsight: 'XOR all elements. Pairs cancel (a^a=0), single remains (a^0=a).',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'XOR Property',
        description: 'a ^ a = 0 (same numbers cancel)',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '5', value: 5 }],
            operator: '^',
            result: 0,
          },
          annotations: ['5 ^ 5 = 0'],
        },
      },
      {
        id: 2,
        title: 'Identity Property',
        description: 'a ^ 0 = a (XOR with 0 keeps the number)',
        visual: {
          binary: {
            numbers: [{ label: '3', value: 3 }, { label: '0', value: 0 }],
            operator: '^',
            result: 3,
          },
          annotations: ['3 ^ 0 = 3'],
        },
      },
      {
        id: 3,
        title: 'Apply to Array',
        description: 'Array [2, 3, 2]. XOR all: 2 ^ 3 ^ 2',
        visual: {
          binary: {
            numbers: [{ label: '2^3', value: 1 }],
          },
          annotations: ['2 ^ 3 = 1'],
        },
      },
      {
        id: 4,
        title: 'Pairs Cancel',
        description: '(2 ^ 2) ^ 3 = 0 ^ 3 = 3',
        visual: {
          binary: {
            numbers: [{ label: '1^2', value: 3 }],
            result: 3,
          },
          annotations: ['1 ^ 2 = 3'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'The single number is 3!',
        visual: {
          binary: {
            numbers: [{ label: 'result', value: 3 }],
            result: 3,
          },
          result: 3,
        },
      },
    ],
  },

  'number-of-1-bits': {
    title: 'Number of 1 Bits',
    keyInsight: 'n & (n-1) clears the lowest 1-bit. Count iterations until n=0.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Input',
        description: 'Count 1-bits in 11 (binary: 1011)',
        visual: {
          binary: {
            numbers: [{ label: 'n', value: 11 }],
          },
          annotations: ['1011 has ? ones'],
        },
      },
      {
        id: 2,
        title: 'First Clear',
        description: '11 & 10 = 10. Cleared lowest bit. Count=1.',
        visual: {
          binary: {
            numbers: [{ label: 'n', value: 11 }, { label: 'n-1', value: 10 }],
            operator: '&',
            result: 10,
            activeBits: [0],
          },
          annotations: ['Count: 1'],
        },
      },
      {
        id: 3,
        title: 'Second Clear',
        description: '10 & 9 = 8. Count=2.',
        visual: {
          binary: {
            numbers: [{ label: 'n', value: 10 }, { label: 'n-1', value: 9 }],
            operator: '&',
            result: 8,
            activeBits: [1],
          },
          annotations: ['Count: 2'],
        },
      },
      {
        id: 4,
        title: 'Third Clear',
        description: '8 & 7 = 0. Count=3. n is now 0.',
        visual: {
          binary: {
            numbers: [{ label: 'n', value: 8 }, { label: 'n-1', value: 7 }],
            operator: '&',
            result: 0,
            activeBits: [3],
          },
          annotations: ['Count: 3'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '11 has 3 one-bits.',
        visual: {
          binary: {
            numbers: [{ label: '11', value: 11 }],
            activeBits: [0, 1, 3],
          },
          result: 3,
        },
      },
    ],
  },

  'counting-bits': {
    title: 'Counting Bits',
    keyInsight: 'bits[i] = bits[i >> 1] + (i & 1). Use previously computed values.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Base Case',
        description: 'bits[0] = 0 (no 1-bits in 0)',
        visual: {
          binary: {
            numbers: [{ label: '0', value: 0 }],
          },
          annotations: ['bits[0] = 0'],
        },
      },
      {
        id: 2,
        title: 'Formula',
        description: 'bits[i] = bits[i/2] + (i mod 2)',
        visual: {
          binary: {
            numbers: [{ label: '3', value: 3 }],
          },
          annotations: ['bits[3] = bits[1] + 1'],
        },
      },
      {
        id: 3,
        title: 'Example: i=5',
        description: '5>>1=2, 5&1=1. bits[5] = bits[2] + 1 = 1+1 = 2',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            activeBits: [0, 2],
          },
          annotations: ['bits[5] = 2'],
        },
      },
      {
        id: 4,
        title: 'Build Array',
        description: 'For n=5: [0,1,1,2,1,2]',
        visual: {
          array: [0, 1, 1, 2, 1, 2],
          annotations: ['Bits count for 0..5'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'O(n) solution using DP!',
        visual: {
          array: [0, 1, 1, 2, 1, 2],
          result: '[0,1,1,2,1,2]',
        },
      },
    ],
  },

  'reverse-bits': {
    title: 'Reverse Bits',
    keyInsight: 'Extract LSB with (n & 1), shift result left, OR to add bit. Repeat 32 times.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Input',
        description: 'Reverse bits of 13 (binary: 1101)',
        visual: {
          binary: {
            numbers: [{ label: 'input', value: 13 }],
          },
          annotations: ['8-bit: 00001101'],
        },
      },
      {
        id: 2,
        title: 'Extract LSB',
        description: '13 & 1 = 1. Add to result.',
        visual: {
          binary: {
            numbers: [{ label: 'n', value: 13 }, { label: '1', value: 1 }],
            operator: '&',
            result: 1,
            activeBits: [0],
          },
        },
      },
      {
        id: 3,
        title: 'Build Result',
        description: 'Shift result left, extract next bit, OR it in.',
        visual: {
          binary: {
            numbers: [{ label: 'building', value: 176 }],
          },
          annotations: ['Result: 10110000'],
        },
      },
      {
        id: 4,
        title: 'Continue',
        description: 'Repeat for all 8 bits (or 32 for full int).',
        visual: {
          binary: {
            numbers: [{ label: 'result', value: 176 }],
          },
          annotations: ['1101 → 1011'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '00001101 reversed = 10110000 (176)',
        visual: {
          binary: {
            numbers: [{ label: '176', value: 176 }],
          },
          result: 176,
        },
      },
    ],
  },

  'missing-number': {
    title: 'Missing Number',
    keyInsight: 'XOR all indices (0..n) with all array values. Pairs cancel, missing remains.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Array [3,0,1] is missing one number from [0,1,2,3].',
        visual: {
          array: [3, 0, 1],
          annotations: ['Missing from 0..3'],
        },
      },
      {
        id: 2,
        title: 'XOR Indices',
        description: 'XOR indices: 0 ^ 1 ^ 2 ^ 3 = 0',
        visual: {
          binary: {
            numbers: [{ label: '0^1^2^3', value: 0 }],
          },
          annotations: ['Indices XOR'],
        },
      },
      {
        id: 3,
        title: 'XOR Values',
        description: 'XOR array values: 3 ^ 0 ^ 1 = 2',
        visual: {
          binary: {
            numbers: [{ label: '3^0^1', value: 2 }],
          },
          annotations: ['Values XOR'],
        },
      },
      {
        id: 4,
        title: 'Combine',
        description: '(0^1^2^3) ^ (3^0^1) = 2. Pairs cancel!',
        visual: {
          binary: {
            numbers: [{ label: 'all XOR', value: 2 }],
            result: 2,
          },
          annotations: ['0,1,3 cancel out'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Missing number is 2!',
        visual: {
          binary: {
            numbers: [{ label: 'missing', value: 2 }],
          },
          result: 2,
        },
      },
    ],
  },

  'power-of-two': {
    title: 'Power of Two',
    keyInsight: 'Power of 2 has exactly one 1-bit. n & (n-1) == 0 for powers of 2.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Powers of 2',
        description: '1, 2, 4, 8... all have exactly one 1-bit.',
        visual: {
          binary: {
            numbers: [{ label: '8', value: 8 }],
            activeBits: [3],
          },
          annotations: ['8 = 1000'],
        },
      },
      {
        id: 2,
        title: 'The Trick',
        description: 'n & (n-1) clears the lowest 1-bit.',
        visual: {
          binary: {
            numbers: [{ label: '8', value: 8 }, { label: '7', value: 7 }],
            operator: '&',
            result: 0,
          },
          annotations: ['1000 & 0111 = 0'],
        },
      },
      {
        id: 3,
        title: 'Power of 2: Yes',
        description: 'If result is 0, it\'s a power of 2!',
        visual: {
          binary: {
            numbers: [{ label: '8&7', value: 0 }],
            result: 0,
          },
          annotations: ['8 IS power of 2'],
        },
      },
      {
        id: 4,
        title: 'Not Power of 2',
        description: '6 & 5 = 4 ≠ 0. Not a power of 2.',
        visual: {
          binary: {
            numbers: [{ label: '6', value: 6 }, { label: '5', value: 5 }],
            operator: '&',
            result: 4,
          },
          annotations: ['0110 & 0101 = 0100'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'n > 0 && (n & (n-1)) == 0',
        visual: {
          binary: {
            numbers: [{ label: '16', value: 16 }],
            activeBits: [4],
          },
          result: true,
        },
      },
    ],
  },

  'sum-of-two-integers': {
    title: 'Sum Without + or -',
    keyInsight: 'XOR gives sum without carry. AND << 1 gives carry. Repeat until no carry.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Add 5 + 3 without using + or -.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '3', value: 3 }],
          },
          annotations: ['0101 + 0011'],
        },
      },
      {
        id: 2,
        title: 'XOR (Sum without carry)',
        description: '5 ^ 3 = 6. This is sum ignoring carries.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '3', value: 3 }],
            operator: '^',
            result: 6,
          },
          annotations: ['0101 ^ 0011 = 0110'],
        },
      },
      {
        id: 3,
        title: 'AND << 1 (Carry)',
        description: '(5 & 3) << 1 = 2. These are the carry bits.',
        visual: {
          binary: {
            numbers: [{ label: '5&3', value: 1 }, { label: '<<1', value: 2 }],
          },
          annotations: ['Carry: 0010'],
        },
      },
      {
        id: 4,
        title: 'Repeat',
        description: '6 ^ 2 = 4, (6 & 2) << 1 = 4',
        visual: {
          binary: {
            numbers: [{ label: '6^2', value: 4 }, { label: 'carry', value: 4 }],
          },
          annotations: ['Continue...'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'When carry = 0, answer is 8!',
        visual: {
          binary: {
            numbers: [{ label: '5+3', value: 8 }],
            result: 8,
          },
          result: 8,
        },
      },
    ],
  },

  'single-number-ii': {
    title: 'Single Number II',
    keyInsight: 'Count bits at each position mod 3. Remaining bits form the single number.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: '[2,2,3,2] - find element appearing once (others appear 3x).',
        visual: {
          array: [2, 2, 3, 2],
          annotations: ['Find the single'],
        },
      },
      {
        id: 2,
        title: 'Count Bit 0',
        description: '2=10, 3=11. Bit 0: 0+0+1+0=1. 1%3=1.',
        visual: {
          binary: {
            numbers: [{ label: '2', value: 2 }, { label: '3', value: 3 }],
            activeBits: [0],
          },
          annotations: ['Bit 0 sum: 1'],
        },
      },
      {
        id: 3,
        title: 'Count Bit 1',
        description: 'Bit 1: 1+1+1+1=4. 4%3=1.',
        visual: {
          binary: {
            numbers: [{ label: '2', value: 2 }, { label: '3', value: 3 }],
            activeBits: [1],
          },
          annotations: ['Bit 1 sum: 4%3=1'],
        },
      },
      {
        id: 4,
        title: 'Build Result',
        description: 'Bit 0=1, Bit 1=1 → binary 11 = 3',
        visual: {
          binary: {
            numbers: [{ label: 'result', value: 3 }],
            activeBits: [0, 1],
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'The single number is 3!',
        visual: {
          binary: {
            numbers: [{ label: '3', value: 3 }],
          },
          result: 3,
        },
      },
    ],
  },

  'single-number-iii': {
    title: 'Single Number III',
    keyInsight: 'XOR all gives a^b. Find a differing bit to split array into two groups.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: '[1,2,1,3,2,5] - find two singles.',
        visual: {
          array: [1, 2, 1, 3, 2, 5],
          annotations: ['Find 3 and 5'],
        },
      },
      {
        id: 2,
        title: 'XOR All',
        description: 'XOR everything = 3 ^ 5 = 6 (0110)',
        visual: {
          binary: {
            numbers: [{ label: '3^5', value: 6 }],
            activeBits: [1, 2],
          },
          annotations: ['Pairs cancel'],
        },
      },
      {
        id: 3,
        title: 'Find Differing Bit',
        description: 'Bit 1 is set. Use it to split array.',
        visual: {
          binary: {
            numbers: [{ label: 'diff', value: 6 }],
            activeBits: [1],
          },
          annotations: ['Split on bit 1'],
        },
      },
      {
        id: 4,
        title: 'Split & XOR',
        description: 'Group A (bit1=0): 1,1,5→5. Group B (bit1=1): 2,2,3→3.',
        visual: {
          binary: {
            numbers: [{ label: 'A', value: 5 }, { label: 'B', value: 3 }],
          },
          annotations: ['Two groups'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'The two singles are 3 and 5!',
        visual: {
          binary: {
            numbers: [{ label: '3', value: 3 }, { label: '5', value: 5 }],
          },
          result: '[3, 5]',
        },
      },
    ],
  },

  'bitwise-and-range': {
    title: 'Bitwise AND of Range',
    keyInsight: 'Find common prefix of left and right. Bits that differ will become 0.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'AND all numbers from 5 to 7.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '6', value: 6 }, { label: '7', value: 7 }],
          },
        },
      },
      {
        id: 2,
        title: 'Compare Endpoints',
        description: '5=101, 7=111. Find common prefix.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '7', value: 7 }],
            activeBits: [2],
          },
          annotations: ['Common: bit 2'],
        },
      },
      {
        id: 3,
        title: 'Right Shift Both',
        description: 'Shift until left == right.',
        visual: {
          binary: {
            numbers: [{ label: '5>>1', value: 2 }, { label: '7>>1', value: 3 }],
          },
          annotations: ['Still different'],
        },
      },
      {
        id: 4,
        title: 'Found Prefix',
        description: '2>>1=1, 3>>1=1. Same! Shift back.',
        visual: {
          binary: {
            numbers: [{ label: 'prefix', value: 1 }],
          },
          annotations: ['Shifts: 2'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '1 << 2 = 4. AND of 5..7 is 4!',
        visual: {
          binary: {
            numbers: [{ label: 'result', value: 4 }],
          },
          result: 4,
        },
      },
    ],
  },

  'number-complement': {
    title: 'Number Complement',
    keyInsight: 'XOR with mask of all 1s (same bit length). Flips all bits.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Find complement of 5 (101 → 010).',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
          },
          annotations: ['101 → ?'],
        },
      },
      {
        id: 2,
        title: 'Find Bit Length',
        description: '5 needs 3 bits (101).',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            activeBits: [0, 2],
          },
          annotations: ['3 bits'],
        },
      },
      {
        id: 3,
        title: 'Create Mask',
        description: 'Mask = (1 << 3) - 1 = 7 (111)',
        visual: {
          binary: {
            numbers: [{ label: 'mask', value: 7 }],
            activeBits: [0, 1, 2],
          },
          annotations: ['All 1s mask'],
        },
      },
      {
        id: 4,
        title: 'XOR with Mask',
        description: '5 ^ 7 = 2. Flips all bits!',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '7', value: 7 }],
            operator: '^',
            result: 2,
          },
          annotations: ['101 ^ 111 = 010'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Complement of 5 is 2!',
        visual: {
          binary: {
            numbers: [{ label: '2', value: 2 }],
          },
          result: 2,
        },
      },
    ],
  },

  'power-of-four': {
    title: 'Power of Four',
    keyInsight: 'Must be power of 2 AND have 1-bit at even position. Use mask 0x55555555.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Powers of 4',
        description: '1, 4, 16, 64... 1-bit at positions 0, 2, 4, 6...',
        visual: {
          binary: {
            numbers: [{ label: '16', value: 16 }],
            activeBits: [4],
          },
          annotations: ['Pos 4 (even)'],
        },
      },
      {
        id: 2,
        title: 'Check Power of 2',
        description: 'First: n & (n-1) == 0?',
        visual: {
          binary: {
            numbers: [{ label: '16', value: 16 }, { label: '15', value: 15 }],
            operator: '&',
            result: 0,
          },
          annotations: ['Is power of 2 ✓'],
        },
      },
      {
        id: 3,
        title: 'Even Position Mask',
        description: '0x55555555 = 01010101... (even positions)',
        visual: {
          binary: {
            numbers: [{ label: 'mask', value: 85 }],
            activeBits: [0, 2, 4, 6],
          },
          annotations: ['Even pos only'],
        },
      },
      {
        id: 4,
        title: 'Check Position',
        description: '16 & mask = 16 ≠ 0. Bit is at even position!',
        visual: {
          binary: {
            numbers: [{ label: '16', value: 16 }, { label: 'mask', value: 85 }],
            operator: '&',
            result: 16,
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '16 IS a power of 4!',
        visual: {
          binary: {
            numbers: [{ label: '16', value: 16 }],
          },
          result: true,
        },
      },
    ],
  },

  'alternating-bits': {
    title: 'Alternating Bits',
    keyInsight: 'n ^ (n >> 1) should be all 1s if bits alternate. Check (x & (x+1)) == 0.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Does 5 (101) have alternating bits?',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            activeBits: [0, 2],
          },
          annotations: ['101 - alternating?'],
        },
      },
      {
        id: 2,
        title: 'XOR with Shifted',
        description: '5 ^ (5 >> 1) = 5 ^ 2 = 7',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }, { label: '5>>1', value: 2 }],
            operator: '^',
            result: 7,
          },
          annotations: ['101 ^ 010 = 111'],
        },
      },
      {
        id: 3,
        title: 'Check All 1s',
        description: 'If all 1s: x & (x+1) == 0',
        visual: {
          binary: {
            numbers: [{ label: '7', value: 7 }, { label: '8', value: 8 }],
            operator: '&',
            result: 0,
          },
          annotations: ['111 & 1000 = 0 ✓'],
        },
      },
      {
        id: 4,
        title: 'Counter Example',
        description: '7 (111) → 7 ^ 3 = 4 (100). Not all 1s.',
        visual: {
          binary: {
            numbers: [{ label: '7^3', value: 4 }],
          },
          annotations: ['Not alternating'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '5 HAS alternating bits!',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            activeBits: [0, 2],
          },
          result: true,
        },
      },
    ],
  },

  'hamming-distance': {
    title: 'Hamming Distance',
    keyInsight: 'XOR gives 1s where bits differ. Count the 1s in the XOR result.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Hamming distance between 1 and 4.',
        visual: {
          binary: {
            numbers: [{ label: '1', value: 1 }, { label: '4', value: 4 }],
          },
          annotations: ['001 vs 100'],
        },
      },
      {
        id: 2,
        title: 'XOR',
        description: '1 ^ 4 = 5. 1s show differing positions.',
        visual: {
          binary: {
            numbers: [{ label: '1', value: 1 }, { label: '4', value: 4 }],
            operator: '^',
            result: 5,
          },
          annotations: ['001 ^ 100 = 101'],
        },
      },
      {
        id: 3,
        title: 'Count 1s',
        description: '5 = 101 has two 1-bits.',
        visual: {
          binary: {
            numbers: [{ label: '5', value: 5 }],
            activeBits: [0, 2],
          },
          annotations: ['Two 1-bits'],
        },
      },
      {
        id: 4,
        title: 'Use n & (n-1)',
        description: '5 & 4 = 4, 4 & 3 = 0. Count = 2.',
        visual: {
          binary: {
            numbers: [{ label: '5&4', value: 4 }],
          },
          annotations: ['Count: 2'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Hamming distance = 2',
        visual: {
          binary: {
            numbers: [{ label: '1', value: 1 }, { label: '4', value: 4 }],
          },
          result: 2,
        },
      },
    ],
  },

  'maximum-xor': {
    title: 'Maximum XOR',
    keyInsight: 'XOR is maximized when bits differ most. Compare all pairs (optimal: Trie).',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Problem',
        description: 'Find max XOR of any two numbers in [3, 10, 5, 25, 2, 8].',
        visual: {
          array: [3, 10, 5, 25, 2, 8],
        },
      },
      {
        id: 2,
        title: 'Key Insight',
        description: 'XOR is max when MSBs differ. 25 starts with 1 at bit 4.',
        visual: {
          binary: {
            numbers: [{ label: '25', value: 25 }, { label: '5', value: 5 }],
            activeBits: [4],
          },
          annotations: ['25: 11001'],
        },
      },
      {
        id: 3,
        title: 'Try Pairs',
        description: '25 ^ 5 = 28. High XOR because MSBs differ.',
        visual: {
          binary: {
            numbers: [{ label: '25', value: 25 }, { label: '5', value: 5 }],
            operator: '^',
            result: 28,
          },
          annotations: ['11001 ^ 00101 = 11100'],
        },
      },
      {
        id: 4,
        title: 'Compare More',
        description: '25 ^ 2 = 27. Not quite as high.',
        visual: {
          binary: {
            numbers: [{ label: '25^2', value: 27 }],
          },
          annotations: ['27 < 28'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Maximum XOR = 28 (from 25 ^ 5)',
        visual: {
          binary: {
            numbers: [{ label: '28', value: 28 }],
          },
          result: 28,
        },
      },
    ],
  },

  'two-sum': {
    title: 'Two Sum',
    keyInsight: 'Use hash map to store complements. For each num, check if (target - num) exists.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Create empty hash map to store {value: index}. Target = 9.',
        visual: {
          array: [2, 7, 11, 15],
          hashMap: { entries: [] },
          annotations: ['Find two numbers summing to 9'],
        },
      },
      {
        id: 2,
        title: 'Check First Element',
        description: 'num=2. Complement = 9-2 = 7. Not in map. Store {2: 0}.',
        visual: {
          array: [2, 7, 11, 15],
          highlights: [0],
          hashMap: {
            entries: [{ key: '2', value: 0, isNew: true }],
            currentIndex: 0,
            lookupKey: '7',
            lookupResult: 'not-found',
          },
          annotations: ['7 not found, store 2'],
        },
      },
      {
        id: 3,
        title: 'Check Second Element',
        description: 'num=7. Complement = 9-7 = 2. Found at index 0!',
        visual: {
          array: [2, 7, 11, 15],
          highlights: [0, 1],
          hashMap: {
            entries: [{ key: '2', value: 0, isLookup: true }],
            currentIndex: 1,
            lookupKey: '2',
            lookupResult: 'found',
          },
          annotations: ['2 found! Return [0, 1]'],
        },
      },
      {
        id: 4,
        title: 'Result',
        description: 'Return indices [0, 1]. nums[0] + nums[1] = 2 + 7 = 9.',
        visual: {
          array: [2, 7, 11, 15],
          highlights: [0, 1],
          result: '[0, 1]',
        },
      },
    ],
  },

  'valid-anagram': {
    title: 'Valid Anagram',
    keyInsight: 'Count character frequencies. Anagrams have identical frequency maps.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Count First String',
        description: 'Count frequencies in "anagram": a=3, n=1, g=1, r=1, m=1',
        visual: {
          array: ['a', 'n', 'a', 'g', 'r', 'a', 'm'],
          hashMap: {
            entries: [
              { key: 'a', value: 3 },
              { key: 'n', value: 1 },
              { key: 'g', value: 1 },
              { key: 'r', value: 1 },
              { key: 'm', value: 1 },
            ],
            phase: 'build',
          },
          annotations: ['Frequency map for "anagram"'],
        },
      },
      {
        id: 2,
        title: 'Count Second String',
        description: 'Count frequencies in "nagaram": a=3, n=1, g=1, r=1, m=1',
        visual: {
          array: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
          hashMap: {
            entries: [
              { key: 'a', value: 3 },
              { key: 'n', value: 1 },
              { key: 'g', value: 1 },
              { key: 'r', value: 1 },
              { key: 'm', value: 1 },
            ],
            secondArray: ['n', 'a', 'g', 'a', 'r', 'a', 'm'],
            phase: 'check',
          },
          annotations: ['Frequency map for "nagaram"'],
        },
      },
      {
        id: 3,
        title: 'Compare Maps',
        description: 'Both maps are identical. Same characters, same counts.',
        visual: {
          hashMap: {
            entries: [
              { key: 'a', value: 3 },
              { key: 'n', value: 1 },
              { key: 'g', value: 1 },
              { key: 'r', value: 1 },
              { key: 'm', value: 1 },
            ],
          },
          annotations: ['Maps match!'],
        },
      },
      {
        id: 4,
        title: 'Result',
        description: '"anagram" and "nagaram" ARE anagrams!',
        visual: {
          result: true,
        },
      },
    ],
  },

  'group-anagrams': {
    title: 'Group Anagrams',
    keyInsight: 'Use sorted string as key. All anagrams sort to the same key.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Sort Each Word',
        description: '"eat" -> "aet", "tea" -> "aet", "tan" -> "ant"',
        visual: {
          array: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
          annotations: ['Sort each word to get key'],
        },
      },
      {
        id: 2,
        title: 'Group by Key',
        description: 'Use sorted string as hash map key.',
        visual: {
          hashMap: {
            entries: [
              { key: 'aet', value: 1, isNew: true },
              { key: 'ant', value: 1, isNew: true },
            ],
          },
          annotations: ['Building groups...'],
        },
      },
      {
        id: 3,
        title: 'Continue Grouping',
        description: '"tea" sorts to "aet" - add to existing group.',
        visual: {
          hashMap: {
            entries: [
              { key: 'aet', value: 3 },
              { key: 'ant', value: 2 },
              { key: 'abt', value: 1 },
            ],
          },
          annotations: ['Anagrams grouped together'],
        },
      },
      {
        id: 4,
        title: 'Result',
        description: 'Return all groups as array of arrays.',
        visual: {
          result: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]',
        },
      },
    ],
  },
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getConceptForProblem(problemId: string, _category: string): {
  categoryConcept: ProblemConcept | null
  insight: { keyInsight: string; pattern: ConceptType } | null
} {
  const concept = problemConcepts[problemId]

  if (!concept) {
    return { categoryConcept: null, insight: null }
  }

  return {
    categoryConcept: concept,
    insight: {
      keyInsight: concept.keyInsight,
      pattern: concept.pattern,
    },
  }
}

export function getConceptSteps(problemId: string, _category: string): ConceptStep[] {
  const concept = problemConcepts[problemId]
  return concept?.steps || []
}
