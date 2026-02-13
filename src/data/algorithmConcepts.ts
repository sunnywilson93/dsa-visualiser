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

  'valid-palindrome-ii': {
    title: 'Valid Palindrome II',
    keyInsight: 'On mismatch try skipping left or right — if either substring is palindrome, return true.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Check if "abca" can be palindrome with at most one deletion. left=0, right=3.',
        visual: {
          array: ['a', 'b', 'c', 'a'],
          pointers: { left: 0, right: 3 },
          highlights: [0, 3],
          annotations: ['a == a ✓'],
        },
      },
      {
        id: 2,
        title: 'Move Inward',
        description: 'Outer chars match. Move inward: left=1, right=2. Mismatch found.',
        visual: {
          array: ['a', 'b', 'c', 'a'],
          pointers: { left: 1, right: 2 },
          highlights: [1, 2],
          annotations: ['b ≠ c — mismatch!'],
        },
      },
      {
        id: 3,
        title: 'Try Skip Left',
        description: 'Skip left char: check substring s[2..2] = "c". Single char is palindrome ✓',
        visual: {
          array: ['a', 'b', 'c', 'a'],
          highlights: [2],
          annotations: ['Skip b → "c" is palindrome ✓'],
        },
      },
      {
        id: 4,
        title: 'Try Skip Right',
        description: 'Skip right char: check substring s[1..1] = "b". Single char is palindrome ✓',
        visual: {
          array: ['a', 'b', 'c', 'a'],
          highlights: [1],
          annotations: ['Skip c → "b" is palindrome ✓'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'At most one deletion needed. Either skip produces a palindrome.',
        visual: {
          array: ['a', 'b', 'c', 'a'],
          highlights: [0, 2, 3],
          result: true,
        },
      },
    ],
  },

  'boats-to-save-people': {
    title: 'Boats to Save People',
    keyInsight: 'Sort people by weight. Pair lightest with heaviest if under limit, otherwise heaviest rides alone.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Sort Array',
        description: 'Sort people by weight. Limit = 3. Use two pointers at ends.',
        visual: {
          array: [1, 2, 2, 3],
          pointers: { left: 0, right: 3 },
          annotations: ['Sorted, limit = 3'],
        },
      },
      {
        id: 2,
        title: 'Heaviest Alone',
        description: 'left=0 (1) + right=3 (3) = 4 > 3. Heaviest rides alone. boats=1.',
        visual: {
          array: [1, 2, 2, 3],
          pointers: { left: 0, right: 2 },
          highlights: [3],
          annotations: ['1+3=4 > 3, alone. boats=1'],
        },
      },
      {
        id: 3,
        title: 'Pair Found',
        description: 'left=0 (1) + right=2 (2) = 3 ≤ 3. Pair them! boats=2.',
        visual: {
          array: [1, 2, 2, 3],
          pointers: { left: 1, right: 1 },
          highlights: [0, 2],
          annotations: ['1+2=3 ≤ 3, pair! boats=2'],
        },
      },
      {
        id: 4,
        title: 'One Person Left',
        description: 'left=1, right=1. One person remaining. boats=3.',
        visual: {
          array: [1, 2, 2, 3],
          highlights: [1],
          annotations: ['One person left, boats=3'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: '3 boats needed to save all 4 people.',
        visual: {
          array: [1, 2, 2, 3],
          result: 'Boats: 3',
        },
      },
    ],
  },

  'rotate-array': {
    title: 'Rotate Array',
    keyInsight: 'Triple reverse: reverse all → reverse first k → reverse rest. Each reverse uses two pointers.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Rotate [1,2,3,4,5,6,7] right by k=3. Last 3 elements move to front.',
        visual: {
          array: [1, 2, 3, 4, 5, 6, 7],
          highlights: [4, 5, 6],
          annotations: ['k=3, rotate right'],
        },
      },
      {
        id: 2,
        title: 'Reverse All',
        description: 'Reverse entire array using two pointers converging.',
        visual: {
          array: [7, 6, 5, 4, 3, 2, 1],
          pointers: { left: 0, right: 6 },
          annotations: ['Reverse all'],
        },
      },
      {
        id: 3,
        title: 'Reverse First k',
        description: 'Reverse first k=3 elements to restore their order.',
        visual: {
          array: [5, 6, 7, 4, 3, 2, 1],
          pointers: { left: 0, right: 2 },
          highlights: [0, 1, 2],
          annotations: ['Reverse [0..2]'],
        },
      },
      {
        id: 4,
        title: 'Reverse Rest',
        description: 'Reverse remaining elements from index k to end.',
        visual: {
          array: [5, 6, 7, 1, 2, 3, 4],
          pointers: { left: 3, right: 6 },
          highlights: [3, 4, 5, 6],
          annotations: ['Reverse [3..6]'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Array rotated right by 3. Triple reverse achieves O(1) space.',
        visual: {
          array: [5, 6, 7, 1, 2, 3, 4],
          result: '[5,6,7,1,2,3,4]',
        },
      },
    ],
  },

  'four-sum': {
    title: 'Four Sum',
    keyInsight: 'Fix two numbers with nested loops, then use converging two pointers for the remaining pair. Sort + skip duplicates.',
    pattern: 'two-pointers-converge',
    steps: [
      {
        id: 1,
        title: 'Sort Array',
        description: 'Sort array. Target=0. Fix two outer indices, use two pointers inside.',
        visual: {
          array: [-2, -1, 0, 1, 2],
          annotations: ['Sorted, target = 0'],
        },
      },
      {
        id: 2,
        title: 'First Window',
        description: 'Fix i=0 (-2), j=1 (-1). left=2, right=4. Sum=-2+-1+0+2=-1 < 0, left++.',
        visual: {
          array: [-2, -1, 0, 1, 2],
          pointers: { left: 2, right: 4 },
          highlights: [0, 1, 2, 4],
          annotations: ['i=0, j=1, sum=-1 < 0'],
        },
      },
      {
        id: 3,
        title: 'Quadruplet Found',
        description: 'left=3, right=4. Sum=-2+-1+1+2=0 ✓ Found [-2,-1,1,2]!',
        visual: {
          array: [-2, -1, 0, 1, 2],
          pointers: { left: 3, right: 4 },
          highlights: [0, 1, 3, 4],
          annotations: ['Sum=0 ✓ Found!'],
        },
      },
      {
        id: 4,
        title: 'Skip Duplicates',
        description: 'Skip duplicates, advance pointers. Move to next j. Continue searching.',
        visual: {
          array: [-2, -1, 0, 1, 2],
          pointers: { left: 3, right: 4 },
          highlights: [0, 2],
          annotations: ['Skip duplicates, next j'],
        },
      },
      {
        id: 5,
        title: 'Continue Search',
        description: 'i=0, j=2 (0), left=3, right=4. Sum=-2+0+1+2=1 > 0, right--.',
        visual: {
          array: [-2, -1, 0, 1, 2],
          pointers: { left: 3, right: 4 },
          highlights: [0, 2, 3, 4],
          annotations: ['i=0, j=2, sum=1 > 0'],
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Only quadruplet summing to 0 is [-2,-1,1,2].',
        visual: {
          array: [-2, -1, 0, 1, 2],
          highlights: [0, 1, 3, 4],
          result: '[[-2,-1,1,2]]',
        },
      },
    ],
  },

  'long-pressed-name': {
    title: 'Long Pressed Name',
    keyInsight: 'Walk both strings: match advances both pointers. Long-press (repeat of previous) advances typed pointer only.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'name="alex", typed="aaleex". i=0 on name, j=0 on typed.',
        visual: {
          array: ['a', 'a', 'l', 'e', 'e', 'x'],
          pointers: { i: 0, j: 0 },
          annotations: ['name="alex"'],
        },
      },
      {
        id: 2,
        title: 'First Match',
        description: 'typed[0]="a" matches name[0]="a". Both advance. i=1, j=1.',
        visual: {
          array: ['a', 'a', 'l', 'e', 'e', 'x'],
          pointers: { i: 1, j: 1 },
          highlights: [0],
          annotations: ['Match! a == a'],
        },
      },
      {
        id: 3,
        title: 'Long Press Detected',
        description: 'typed[1]="a" ≠ name[1]="l", but matches previous typed "a" (long press). j++ only.',
        visual: {
          array: ['a', 'a', 'l', 'e', 'e', 'x'],
          pointers: { i: 1, j: 2 },
          highlights: [1],
          annotations: ['Long press — extra "a"'],
        },
      },
      {
        id: 4,
        title: 'Continue Matching',
        description: 'typed[2]="l" matches name[1]="l". Both advance. Continue through e, e (long press), x.',
        visual: {
          array: ['a', 'a', 'l', 'e', 'e', 'x'],
          pointers: { i: 3, j: 5 },
          highlights: [0, 2, 3, 5],
          annotations: ['Matched l, e, x'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'All name chars matched. Extra typed chars are valid long presses.',
        visual: {
          array: ['a', 'a', 'l', 'e', 'e', 'x'],
          highlights: [0, 2, 3, 5],
          result: true,
        },
      },
    ],
  },

  'intersection-of-two-arrays-ii': {
    title: 'Intersection of Two Arrays II',
    keyInsight: 'Sort both arrays. Equal elements → add to result and advance both. Otherwise advance the smaller pointer.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Sort Both',
        description: 'Sort both arrays. nums1=[1,1,2,2], nums2=[2,2]. Use two pointers.',
        visual: {
          array: [1, 1, 2, 2],
          pointers: { i: 0, j: 0 },
          annotations: ['nums2: [2, 2]'],
        },
      },
      {
        id: 2,
        title: 'Advance Smaller',
        description: 'i=0: nums1[0]=1 < nums2[0]=2. Advance i.',
        visual: {
          array: [1, 1, 2, 2],
          pointers: { i: 1, j: 0 },
          highlights: [0],
          annotations: ['1 < 2, advance i'],
        },
      },
      {
        id: 3,
        title: 'Still Smaller',
        description: 'i=1: nums1[1]=1 < nums2[0]=2. Advance i again.',
        visual: {
          array: [1, 1, 2, 2],
          pointers: { i: 2, j: 0 },
          highlights: [1],
          annotations: ['1 < 2, advance i'],
        },
      },
      {
        id: 4,
        title: 'Match Found',
        description: 'i=2: nums1[2]=2 == nums2[0]=2. Match! Add 2. Both advance. Then 2==2 again.',
        visual: {
          array: [1, 1, 2, 2],
          pointers: { i: 3, j: 1 },
          highlights: [2, 3],
          annotations: ['2 == 2, match! ×2'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Intersection with duplicates preserved: [2, 2].',
        visual: {
          array: [1, 1, 2, 2],
          highlights: [2, 3],
          result: '[2, 2]',
        },
      },
    ],
  },

  'remove-duplicates-sorted-ii': {
    title: 'Remove Duplicates from Sorted Array II',
    keyInsight: 'Compare nums[fast] with nums[slow-2]. If different, it is safe to keep — allows at most 2 of each value.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Allow at most 2 of each value. slow=2, fast=2. First 2 elements always kept.',
        visual: {
          array: [1, 1, 1, 2, 2, 3],
          pointers: { slow: 2, fast: 2 },
          highlights: [0, 1],
          annotations: ['First 2 always kept'],
        },
      },
      {
        id: 2,
        title: 'Third Duplicate',
        description: 'fast=2: nums[2]=1, nums[slow-2]=nums[0]=1. Same! Skip third 1.',
        visual: {
          array: [1, 1, 1, 2, 2, 3],
          pointers: { slow: 2, fast: 3 },
          highlights: [0, 2],
          annotations: ['1 == 1, skip!'],
        },
      },
      {
        id: 3,
        title: 'New Value',
        description: 'fast=3: nums[3]=2, nums[slow-2]=nums[0]=1. Different! Copy 2 to slow.',
        visual: {
          array: [1, 1, 2, 2, 2, 3],
          pointers: { slow: 3, fast: 4 },
          highlights: [2, 3],
          annotations: ['2 ≠ 1, keep!'],
        },
      },
      {
        id: 4,
        title: 'Second Copy',
        description: 'fast=4: nums[4]=2, nums[slow-2]=nums[1]=1. Different! Copy 2.',
        visual: {
          array: [1, 1, 2, 2, 2, 3],
          pointers: { slow: 4, fast: 5 },
          highlights: [3, 4],
          annotations: ['2 ≠ 1, keep!'],
        },
      },
      {
        id: 5,
        title: 'Last Value',
        description: 'fast=5: nums[5]=3, nums[slow-2]=nums[2]=2. Different! Copy 3.',
        visual: {
          array: [1, 1, 2, 2, 3, 3],
          pointers: { slow: 5, fast: 5 },
          highlights: [4],
          annotations: ['3 ≠ 2, keep!'],
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Length 5. Array contains [1,1,2,2,3] — at most 2 of each.',
        visual: {
          array: [1, 1, 2, 2, 3, 3],
          highlights: [0, 1, 2, 3, 4],
          result: 'Length: 5',
        },
      },
    ],
  },

  'backspace-string-compare': {
    title: 'Backspace String Compare',
    keyInsight: 'Process from end: count # as skips, find next valid char in each string, compare them.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 's="ab#c", t="ad#c". Process from end using skip counters.',
        visual: {
          array: ['a', 'b', '#', 'c'],
          pointers: { i: 3, j: 3 },
          annotations: ['t="ad#c"'],
        },
      },
      {
        id: 2,
        title: 'Compare Last Chars',
        description: 's[3]="c", t[3]="c". Match! Decrement both. i=2, j=2.',
        visual: {
          array: ['a', 'b', '#', 'c'],
          pointers: { i: 2, j: 2 },
          highlights: [3],
          annotations: ['c == c ✓'],
        },
      },
      {
        id: 3,
        title: 'Process Backspaces',
        description: 's[2]="#" → skip count=1, skip "b", land on i=0. t[2]="#" → skip "d", land on j=0.',
        visual: {
          array: ['a', 'b', '#', 'c'],
          pointers: { i: 0, j: 0 },
          highlights: [1, 2],
          annotations: ['# skips "b" and "d"'],
        },
      },
      {
        id: 4,
        title: 'Final Compare',
        description: 's[0]="a", t[0]="a". Match! Both pointers exhausted.',
        visual: {
          array: ['a', 'b', '#', 'c'],
          pointers: { i: 0, j: 0 },
          highlights: [0],
          annotations: ['a == a ✓'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Both strings reduce to "ac". They are equal.',
        visual: {
          array: ['a', 'b', '#', 'c'],
          highlights: [0, 3],
          result: true,
        },
      },
    ],
  },

  'string-compression': {
    title: 'String Compression',
    keyInsight: 'Read pointer counts consecutive groups. Write pointer writes char then count digits in-place.',
    pattern: 'two-pointers-same-dir',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Compress ["a","a","b","b","c","c","c"] in-place. write=0, read=0.',
        visual: {
          array: ['a', 'a', 'b', 'b', 'c', 'c', 'c'],
          pointers: { slow: 0, fast: 0 },
          annotations: ['Scan consecutive groups'],
        },
      },
      {
        id: 2,
        title: 'Group "a"',
        description: 'Count 2 consecutive "a"s. Write "a" at [0], "2" at [1]. write=2.',
        visual: {
          array: ['a', '2', 'b', 'b', 'c', 'c', 'c'],
          pointers: { slow: 2, fast: 2 },
          highlights: [0, 1],
          annotations: ['Write a, 2'],
        },
      },
      {
        id: 3,
        title: 'Group "b"',
        description: 'Count 2 consecutive "b"s. Write "b" at [2], "2" at [3]. write=4.',
        visual: {
          array: ['a', '2', 'b', '2', 'c', 'c', 'c'],
          pointers: { slow: 4, fast: 4 },
          highlights: [2, 3],
          annotations: ['Write b, 2'],
        },
      },
      {
        id: 4,
        title: 'Group "c"',
        description: 'Count 3 consecutive "c"s. Write "c" at [4], "3" at [5]. write=6.',
        visual: {
          array: ['a', '2', 'b', '2', 'c', '3', 'c'],
          pointers: { slow: 6, fast: 6 },
          highlights: [4, 5],
          annotations: ['Write c, 3'],
        },
      },
      {
        id: 5,
        title: 'Truncate',
        description: 'Only first 6 characters are valid. Last element is leftover.',
        visual: {
          array: ['a', '2', 'b', '2', 'c', '3', 'c'],
          highlights: [0, 1, 2, 3, 4, 5],
          annotations: ['First 6 valid'],
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Compressed length is 6: ["a","2","b","2","c","3"].',
        visual: {
          array: ['a', '2', 'b', '2', 'c', '3', 'c'],
          highlights: [0, 1, 2, 3, 4, 5],
          result: 'Length: 6',
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

  // ==================== TRIE PROBLEMS ====================

  'implement-trie-prefix-tree': {
    title: 'Implement Trie (Prefix Tree)',
    keyInsight: 'Store each word as a path of characters; inserts and lookups follow the same walk.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Create the Root',
        description: 'Start with an empty root node.',
        visual: {
          hashMap: { entries: [] },
          annotations: ['No characters yet'],
        },
      },
      {
        id: 2,
        title: 'Insert Words',
        description: 'Insert "cat" and "car" by walking each character path.',
        visual: {
          array: ['cat', 'car'],
          hashMap: {
            entries: [
              { key: 'c', value: 1, isNew: true },
              { key: 'ca', value: 2, isNew: true },
              { key: 'cat', value: 3, isNew: true },
              { key: 'car', value: 3, isNew: true },
            ],
          },
          annotations: ['Share prefix c-a between both words'],
        },
      },
      {
        id: 3,
        title: 'Search and Prefix',
        description: '"search(\"cat\")" requires full path + terminal node, "startsWith(\"ca\")" only needs the path.',
        visual: {
          array: ['c', 'a', 't'],
          highlights: [0, 1, 2],
          hashMap: {
            entries: [
              { key: 'cat', value: 3, isLookup: true },
              { key: 'ca', value: 2, isLookup: true },
            ],
          },
          result: 'search=true, startsWith=true',
        },
      },
    ],
  },

  'design-add-and-search-words-data-structure': {
    title: 'Design Add and Search Words Data Structure',
    keyInsight: 'Literal characters use one trie child; "." wildcards branch to all children once at that level.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Add Dictionary Words',
        description: 'Insert bad, dad, and mad into the trie.',
        visual: {
          array: ['bad', 'dad', 'mad'],
          hashMap: {
            entries: [
              { key: 'b', value: 1, isNew: true },
              { key: 'd', value: 1, isNew: true },
              { key: 'm', value: 1, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Exact Match',
        description: 'search(\"bad\") follows a single path b-a-d and must land at terminal node.',
        visual: {
          array: ['b', 'a', 'd'],
          hashMap: {
            entries: [
              { key: 'bad', value: 3, isLookup: true },
            ],
            lookupKey: 'bad',
            lookupResult: 'found',
          },
          result: true,
        },
      },
      {
        id: 3,
        title: 'Wildcard Match',
        description: 'search(\".ad\") branches at first char and validates all child options in parallel.',
        visual: {
          array: ['.', 'a', 'd'],
          hashMap: {
            entries: [
              { key: 'bad', value: 3, isLookup: true },
              { key: 'dad', value: 3, isLookup: true },
              { key: 'mad', value: 3, isLookup: true },
            ],
            lookupKey: '.',
            lookupResult: 'found',
          },
          result: true,
        },
      },
    ],
  },

  'replace-words': {
    title: 'Replace Words',
    keyInsight: 'Insert all roots first, then for each sentence word return first prefix that is terminal in the trie.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Build Root Set',
        description: 'Insert cat, bat, rat into trie.',
        visual: {
          array: ['cat', 'bat', 'rat'],
          hashMap: {
            entries: [
              { key: 'cat', value: 3, isNew: true },
              { key: 'bat', value: 3, isNew: true },
              { key: 'rat', value: 3, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Replace Each Token',
        description: 'For "cattle", scan chars and stop at first terminal root "cat".',
        visual: {
          array: ['cattle', 'cattle', 'rattled'],
          highlights: [0],
          hashMap: {
            entries: [
              { key: 'cat', value: 3, isLookup: true },
              { key: 'bat', value: 3, isLookup: true },
              { key: 'rat', value: 3, isLookup: true },
            ],
          },
          result: 'cat',
        },
      },
      {
        id: 3,
        title: 'Final Sentence',
        description: 'Only words with no matching root stay unchanged.',
        visual: {
          array: ['the', 'cattle', 'was', 'rattled', 'by', 'the', 'battery'],
          highlights: [1, 3, 6],
          result: 'the cat was rat by the bat',
        },
      },
    ],
  },

  'search-suggestions-system': {
    title: 'Search Suggestions System',
    keyInsight: 'Store products in trie and keep best suggestions at each node to avoid rescanning the full word list.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Insert Sorted Products',
        description: 'mobile, mouse, moneypot, monitor are inserted and each node keeps top 3 candidates.',
        visual: {
          array: ['mobile', 'mouse', 'moneypot', 'monitor'],
          hashMap: {
            entries: [
              { key: 'm', value: 4, isNew: true },
              { key: 'mo', value: 4, isNew: true },
              { key: 'mon', value: 2, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Type "mo"',
        description: 'Traverse to node "mo" and read precomputed suggestion list.',
        visual: {
          array: ['mobile', 'moneypot', 'monitor', 'mouse'],
          highlights: [0, 1, 2],
          hashMap: {
            entries: [
              { key: 'mo', value: 3, isLookup: true },
              { key: 'mob', value: 1, isLookup: true },
            ],
          },
          result: ['mobile', 'moneypot', 'monitor'],
        },
      },
      {
        id: 3,
        title: 'Continue Typing',
        description: 'Longer prefix narrows to fewer matches but still reads direct top-3 cache.',
        visual: {
          array: ['mobile', 'mouse'],
          highlights: [0, 1],
          hashMap: {
            entries: [
              { key: 'mou', value: 2, isLookup: true },
            ],
          },
          result: ['mobile', 'mouse'],
        },
      },
    ],
  },

  'stream-of-characters': {
    title: 'Stream of Characters',
    keyInsight: 'Insert reversed dictionary words, then check stream suffixes by walking backward through the reversed trie.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Build Reversed Trie',
        description: 'cd, f, kl become dc, f, lk in storage.',
        visual: {
          array: ['cd', 'f', 'kl'],
          hashMap: {
            entries: [
              { key: 'dc', value: 2, isNew: true },
              { key: 'f', value: 1, isNew: true },
              { key: 'lk', value: 2, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Query Stream',
        description: 'Letters arrive one by one; each query tests reversed suffixes up to max word length.',
        visual: {
          array: ['a', 'c', 'd'],
          highlights: [2],
          hashMap: {
            entries: [
              { key: 'dc', value: 2, lookupResult: 'not-found' },
              { key: 'cd', value: 2, isLookup: true },
            ],
            lookupKey: 'cd',
            lookupResult: 'found',
          },
          result: false,
        },
      },
      {
        id: 3,
        title: 'Match Detection',
        description: 'Next character that creates suffix \"cd\" returns true.',
        visual: {
          array: ['c', 'd', 'c'],
          hashMap: {
            entries: [
              { key: 'dc', value: 2, isLookup: true },
            ],
            lookupKey: 'cd',
            lookupResult: 'found',
          },
          result: true,
        },
      },
    ],
  },

  'word-search-ii': {
    title: 'Word Search II',
    keyInsight: 'Prune DFS on board cells by checking whether the current path exists as trie prefix.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Build Word Trie',
        description: 'Insert oath, pea, eat, and rain before DFS.',
        visual: {
          array: ['oath', 'pea', 'eat', 'rain'],
          hashMap: {
            entries: [
              { key: 'o', value: 1, isNew: true },
              { key: 'p', value: 1, isNew: true },
              { key: 'e', value: 1, isNew: true },
              { key: 'r', value: 1, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Start DFS with Prefix',
        description: 'Cell "o" is valid start because trie has that edge.',
        visual: {
          array: ['o', 'a', 't', 'h'],
          highlights: [0, 1, 2, 3],
          hashMap: {
            entries: [
              { key: 'o', value: 1 },
              { key: 'oa', value: 1 },
              { key: 'oat', value: 1 },
              { key: 'oath', value: 1, isLookup: true },
            ],
          },
        },
      },
      {
        id: 3,
        title: 'Emit Found Word',
        description: 'When prefix hits a word node, record result and backtrack to explore remaining paths.',
        visual: {
          result: ['oath'],
          hashMap: {
            entries: [
              { key: 'oath', value: 1, isLookup: true },
            ],
          },
        },
      },
    ],
  },

  'short-encoding-of-words': {
    title: 'Short Encoding of Words',
    keyInsight: 'A word that is a suffix of another adds no new nodes in reversed trie, so it contributes 0 length.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Insert Reversed Words',
        description: 'time, me, bell become reversed words for suffix checking.',
        visual: {
          array: ['time', 'me', 'bell'],
          hashMap: {
            entries: [
              { key: 'time', value: 4, isNew: true },
              { key: 'me', value: 2, isNew: true },
              { key: 'bell', value: 4, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Add New Nodes for time',
        description: 'time adds full path, so it contributes length+1 (5).',
        visual: {
          array: ['t', 'i', 'm', 'e'],
          hashMap: {
            entries: [
              { key: 'e', value: 1, isNew: true },
              { key: 'em', value: 2, isNew: true },
              { key: 'emi', value: 3, isNew: true },
            ],
          },
          result: 5,
        },
      },
      {
        id: 3,
        title: 'Skip Existing Suffix Nodes',
        description: 'me is already present as suffix of time, so it adds no extra nodes.',
        visual: {
          array: ['m', 'e'],
          hashMap: {
            entries: [
              { key: 'e', value: 1 },
              { key: 'em', value: 2 },
            ],
          },
          result: 5,
        },
      },
    ],
  },

  'magic-dictionary': {
    title: 'Magic Dictionary',
    keyInsight: 'While scanning searchWord, allow exactly one changed character in the trie path.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Build Dictionary',
        description: 'Store hello, hallo, leetcode as words.',
        visual: {
          hashMap: {
            entries: [
              { key: 'hello', value: 1, isNew: true },
              { key: 'hallo', value: 1, isNew: true },
              { key: 'leetcode', value: 1, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Search with One Mismatch',
        description: 'hhllo: first mismatch used at index 1, then exact match continues.',
        visual: {
          array: ['h', 'h', 'l', 'l', 'o'],
          highlights: [1],
          hashMap: {
            entries: [
              { key: 'hello', value: 1 },
              { key: 'hallo', value: 1, isLookup: true },
              { key: 'mismatchUsed', value: 1, isLookup: true },
            ],
          },
          result: true,
        },
      },
      {
        id: 3,
        title: 'Reject Exact Match as-is',
        description: 'search(\"hello\") requires one mismatch, exact path alone is not accepted.',
        visual: {
          array: ['h', 'e', 'l', 'l', 'o'],
          hashMap: {
            entries: [
              { key: 'hello', value: 1 },
              { key: 'mismatchUsed', value: 0 },
            ],
          },
          result: true,
          annotations: ['\"hell\" no change => false for exactly same word'],
        },
      },
    ],
  },

  'maximum-xor-of-two-numbers-trie': {
    title: 'Maximum XOR of Two Numbers',
    keyInsight: 'At each bit level, prefer the opposite bit in trie to maximize XOR contribution.',
    pattern: 'bit-manipulation',
    steps: [
      {
        id: 1,
        title: 'Start with First Value',
        description: 'Build trie from 3 (00000011).',
        visual: {
          binary: {
            numbers: [{ label: '3', value: 3 }],
            annotations: ['Only one number in trie, so no pair to compare yet.'],
          },
        },
      },
      {
        id: 2,
        title: 'Add 10 and Query',
        description: 'Insert 10 (00001010), then query it. Greedy opposite-bit traversal gives 9.',
        visual: {
          binary: {
            numbers: [
              { label: '3', value: 3 },
              { label: 'query:10', value: 10 },
              { label: 'best:', value: 9 },
            ],
            operator: '^',
            result: 9,
            activeBits: [3, 2, 1],
            annotations: ['10 ^ 3 = 9', 'Current max = 9'],
          },
        },
      },
      {
        id: 3,
        title: 'Insert 5 and Improve',
        description: 'Insert 5 (00000101) and query it. Best partner becomes 10 -> xor 15.',
        visual: {
          binary: {
            numbers: [
              { label: '10', value: 10 },
              { label: 'query:5', value: 5 },
              { label: 'best:', value: 15 },
            ],
            operator: '^',
            result: 15,
            activeBits: [3, 2, 1, 0],
            annotations: ['5 ^ 10 = 15', 'Current max updates to 15'],
          },
        },
      },
      {
        id: 4,
        title: 'Insert 25 for Global Maximum',
        description: 'Insert 25 (11001). Querying it finds partner 5 with xor 28, the final maximum.',
        visual: {
          binary: {
            numbers: [
              { label: '5', value: 5 },
              { label: 'query:25', value: 25 },
              { label: 'best:', value: 28 },
            ],
            operator: '^',
            result: 28,
            activeBits: [4, 3, 2],
            annotations: ['25 ^ 5 = 28', 'Global max becomes 28'],
          },
        },
      },
    ],
  },

  'longest-word-in-dictionary': {
    title: 'Longest Word in Dictionary',
    keyInsight: 'Only traverse trie nodes marked as end of word; every prefix on the route must be valid.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Insert Words',
        description: 'Mark terminals for all words in trie.',
        visual: {
          array: ['w', 'wo', 'wor', 'worl', 'world', 'hello', 'hell', 'he'],
          hashMap: {
            entries: [
              { key: 'w', value: 1, isNew: true },
              { key: 'wo', value: 2, isNew: true },
              { key: 'wor', value: 3, isNew: true },
              { key: 'worl', value: 4, isNew: true },
              { key: 'world', value: 5, isNew: true },
              { key: 'h', value: 1, isNew: true },
              { key: 'he', value: 2, isNew: true },
            ],
          },
        },
      },
      {
        id: 2,
        title: 'Validate Prefixes',
        description: 'Skip branches where prefix is not terminal (hello has missing intermediate terminal at h/e/l/l)',
        visual: {
          array: ['world', 'hello'],
          highlights: [0],
          hashMap: {
            entries: [
              { key: 'w', value: 1 },
              { key: 'wo', value: 1 },
              { key: 'wor', value: 1 },
              { key: 'worl', value: 1 },
              { key: 'world', value: 1, isLookup: true },
            ],
          },
        },
      },
      {
        id: 3,
        title: 'Select Best Answer',
        description: 'Compare valid candidates and keep longest, then lexicographically smallest on ties.',
        visual: {
          hashMap: {
            entries: [
              { key: 'world', value: 5, isLookup: true },
              { key: 'hell', value: 4 },
            ],
          },
          result: 'world',
        },
      },
    ],
  },

  // ==================== SLIDING WINDOW PROBLEMS ====================

  'max-sum-subarray-k': {
    title: 'Maximum Sum Subarray of Size K',
    keyInsight: 'Fixed window of size k: slide by adding right element and removing left element',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Build Initial Window',
        description: 'Sum the first k elements to form the initial window.',
        visual: {
          array: [2, 1, 5, 1, 3, 2],
          pointers: { left: 0, right: 2 },
          highlights: [0, 1, 2],
          annotations: ['Window sum: 8', 'k = 3'],
        },
      },
      {
        id: 2,
        title: 'Slide Window Right',
        description: 'Add the next element and remove the leftmost to slide the window.',
        visual: {
          array: [2, 1, 5, 1, 3, 2],
          pointers: { left: 1, right: 3 },
          highlights: [3],
          annotations: ['Add 1, Remove 2', 'Sum: 8 + 1 - 2 = 7'],
        },
      },
      {
        id: 3,
        title: 'Continue Sliding',
        description: 'Slide again: add right element, remove left element.',
        visual: {
          array: [2, 1, 5, 1, 3, 2],
          pointers: { left: 2, right: 4 },
          highlights: [4],
          annotations: ['Add 3, Remove 1', 'Sum: 7 + 3 - 1 = 9'],
        },
      },
      {
        id: 4,
        title: 'Last Window',
        description: 'Slide to the final position and compare.',
        visual: {
          array: [2, 1, 5, 1, 3, 2],
          pointers: { left: 3, right: 5 },
          highlights: [5],
          annotations: ['Add 2, Remove 5', 'Sum: 9 + 2 - 5 = 6'],
        },
      },
      {
        id: 5,
        title: 'Maximum Found',
        description: 'The maximum sum window is [5, 1, 3] with sum 9.',
        visual: {
          array: [2, 1, 5, 1, 3, 2],
          pointers: { left: 2, right: 4 },
          highlights: [2, 3, 4],
          result: 'Max Sum: 9',
        },
      },
    ],
  },

  'longest-substring-no-repeat': {
    title: 'Longest Substring Without Repeating Characters',
    keyInsight: 'Expand right to add characters. On duplicate, jump left past last occurrence',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Start Window',
        description: 'Begin with a single character window at the start.',
        visual: {
          array: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
          pointers: { left: 0, right: 0 },
          highlights: [0],
          annotations: ["Window: 'a'", 'Length: 1'],
        },
      },
      {
        id: 2,
        title: 'Expand Window',
        description: 'Expand right while all characters are unique.',
        visual: {
          array: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
          pointers: { left: 0, right: 2 },
          highlights: [0, 1, 2],
          annotations: ["Window: 'abc'", 'Length: 3'],
        },
      },
      {
        id: 3,
        title: "Duplicate Found: 'a'",
        description: "Character 'a' at index 3 was already seen at index 0.",
        visual: {
          array: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
          pointers: { left: 0, right: 3 },
          highlights: [0, 3],
          annotations: ["'a' seen at index 0", 'Move left to 1'],
        },
      },
      {
        id: 4,
        title: 'Window After Jump',
        description: 'Left jumps past the duplicate. Window is now valid again.',
        visual: {
          array: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
          pointers: { left: 1, right: 3 },
          highlights: [1, 2, 3],
          annotations: ["Window: 'bca'", 'Length: 3'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'The longest substring without repeating characters has length 3.',
        visual: {
          array: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
          pointers: { left: 1, right: 2 },
          highlights: [0, 1, 2],
          result: 'Longest: 3',
        },
      },
    ],
  },

  'min-size-subarray-sum': {
    title: 'Minimum Size Subarray Sum',
    keyInsight: 'Expand right to grow sum. When sum >= target, shrink left to find minimum length',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Start Expanding',
        description: 'Begin with a single element. Sum is less than target, keep expanding.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 0, right: 0 },
          annotations: ['Target: 7', 'Sum: 2'],
        },
      },
      {
        id: 2,
        title: 'Keep Expanding',
        description: 'Expand until the window sum meets or exceeds the target.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 0, right: 3 },
          highlights: [0, 1, 2, 3],
          annotations: ['Sum: 8 >= 7 \u2713', 'Length: 4'],
        },
      },
      {
        id: 3,
        title: 'Shrink Left',
        description: 'Remove left element to try a shorter window.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 1, right: 3 },
          highlights: [1, 2, 3],
          annotations: ['Remove 2, Sum: 6', 'Sum < 7, expand'],
        },
      },
      {
        id: 4,
        title: 'Expand Again',
        description: 'Sum dropped below target. Expand right to include more elements.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 1, right: 4 },
          highlights: [1, 2, 3, 4],
          annotations: ['Sum: 10 >= 7 \u2713', 'Length: 4'],
        },
      },
      {
        id: 5,
        title: 'Shrink to Minimum',
        description: 'Keep shrinking left to find the smallest valid window.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 3, right: 4 },
          highlights: [3, 4],
          annotations: ['Sum: 6... expand more'],
        },
      },
      {
        id: 6,
        title: 'Found Minimum',
        description: 'Window [4, 3] sums to 7 with length 2. This is the minimum.',
        visual: {
          array: [2, 3, 1, 2, 4, 3],
          pointers: { left: 4, right: 5 },
          highlights: [4, 5],
          annotations: ['Sum: 7 >= 7 \u2713'],
          result: 'Min Length: 2',
        },
      },
    ],
  },

  'max-consecutive-ones-iii': {
    title: 'Max Consecutive Ones III',
    keyInsight: 'Maintain window with at most k zeros. Shrink left when zero count exceeds k',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Start Window',
        description: 'Begin expanding. First three elements are all ones.',
        visual: {
          array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          pointers: { left: 0, right: 2 },
          highlights: [0, 1, 2],
          annotations: ['All ones', 'Zeros: 0, k: 2'],
        },
      },
      {
        id: 2,
        title: 'Hit Zeros',
        description: 'Window now contains two zeros, which equals our budget k.',
        visual: {
          array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          pointers: { left: 0, right: 4 },
          highlights: [3, 4],
          annotations: ['Two zeros in window', 'Zeros: 2 = k'],
        },
      },
      {
        id: 3,
        title: 'Too Many Zeros',
        description: 'Third zero encountered. Zero count exceeds k, must shrink.',
        visual: {
          array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          pointers: { left: 0, right: 5 },
          highlights: [5],
          annotations: ['Zeros: 3 > k!', 'Shrink left'],
        },
      },
      {
        id: 4,
        title: 'Shrink Past Zeros',
        description: 'Move left past zeros until count is back within budget.',
        visual: {
          array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          pointers: { left: 3, right: 8 },
          highlights: [3, 4, 5, 6, 7, 8],
          annotations: ['Zeros: 2 = k', 'Length: 6'],
        },
      },
      {
        id: 5,
        title: 'Maximum Window',
        description: 'The longest window with at most 2 zeros has length 6.',
        visual: {
          array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          pointers: { left: 3, right: 8 },
          highlights: [3, 4, 5, 6, 7, 8],
          result: 'Max Length: 6',
        },
      },
    ],
  },

  'permutation-in-string': {
    title: 'Permutation in String',
    keyInsight: 'Fixed window of s1.length over s2. Window is a permutation when character frequencies match',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Build Target Frequency',
        description: 'Count character frequencies of s1 to know what to match.',
        visual: {
          array: ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'],
          annotations: ["s1 = 'ab'", 'Need: a:1, b:1'],
        },
      },
      {
        id: 2,
        title: 'First Window',
        description: 'Check the first window of size 2.',
        visual: {
          array: ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'],
          pointers: { left: 0, right: 1 },
          highlights: [0, 1],
          annotations: ["Window: 'ei'", 'No match'],
        },
      },
      {
        id: 3,
        title: 'Slide Window',
        description: 'Slide the window and check frequencies again.',
        visual: {
          array: ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'],
          pointers: { left: 1, right: 2 },
          highlights: [1, 2],
          annotations: ["Window: 'id'", 'No match'],
        },
      },
      {
        id: 4,
        title: 'Found Match!',
        description: 'Window contains b and a — frequencies match s1.',
        visual: {
          array: ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'],
          pointers: { left: 3, right: 4 },
          highlights: [3, 4],
          annotations: ["Window: 'ba'", 'Frequencies match! \u2713'],
        },
      },
      {
        id: 5,
        title: 'Permutation Found',
        description: 'A permutation of s1 exists in s2.',
        visual: {
          array: ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'],
          pointers: { left: 3, right: 4 },
          highlights: [3, 4],
          result: true,
        },
      },
    ],
  },

  'min-window-substring': {
    title: 'Minimum Window Substring',
    keyInsight: 'Expand right until all target characters covered, then shrink left to minimize',
    pattern: 'sliding-window',
    steps: [
      {
        id: 1,
        title: 'Target Characters',
        description: 'Identify which characters we need to cover from string t.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          annotations: ['Need: A:1, B:1, C:1'],
        },
      },
      {
        id: 2,
        title: 'Expand to Cover',
        description: 'Expand right until all target characters are in the window.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          pointers: { left: 0, right: 5 },
          highlights: [0, 3, 5],
          annotations: ['Have A, B, C', "Window: 'ADOBEC'"],
        },
      },
      {
        id: 3,
        title: 'Shrink Left',
        description: 'Try to shrink from left. Removing A loses coverage.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          pointers: { left: 3, right: 5 },
          highlights: [3, 5],
          annotations: ['Lost A at 0', 'Need A again'],
        },
      },
      {
        id: 4,
        title: 'Expand More',
        description: 'Expand right to find another A and restore coverage.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          pointers: { left: 3, right: 10 },
          highlights: [3, 5, 10],
          annotations: ['Have A, B, C again', "Window: 'BECODEBA'"],
        },
      },
      {
        id: 5,
        title: 'Shrink to Minimum',
        description: 'Shrink left aggressively. Window BANC covers all characters.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          pointers: { left: 9, right: 12 },
          highlights: [9, 10, 11, 12],
          annotations: ["Window: 'BANC'", 'All chars covered'],
        },
      },
      {
        id: 6,
        title: 'Minimum Window',
        description: 'BANC is the shortest substring containing A, B, and C.',
        visual: {
          array: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
          pointers: { left: 9, right: 12 },
          highlights: [9, 10, 11, 12],
          result: "Min Window: 'BANC'",
        },
      },
    ],
  },

  // ==================== BINARY SEARCH PROBLEMS ====================

  'binary-search-basic': {
    title: 'Binary Search (Classic)',
    keyInsight: 'Compare mid with target. If target < mid, search left half. If target > mid, search right half.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize Pointers',
        description: 'Set left=0, right=5. Target is 9.',
        visual: {
          array: [-1, 0, 3, 5, 9, 12],
          pointers: { left: 0, right: 5 },
          annotations: ['Target: 9'],
        },
      },
      {
        id: 2,
        title: 'First Mid Calculation',
        description: 'mid=(0+5)/2=2, arr[2]=3. 3 < 9, search right half.',
        visual: {
          array: [-1, 0, 3, 5, 9, 12],
          pointers: { left: 0, right: 5, mid: 2 },
          highlights: [2],
          annotations: ['arr[2] = 3 < 9', 'Search right half →'],
        },
      },
      {
        id: 3,
        title: 'Narrow to Right',
        description: 'left=3, mid=(3+5)/2=4, arr[4]=9. Found!',
        visual: {
          array: [-1, 0, 3, 5, 9, 12],
          pointers: { left: 3, right: 5, mid: 4 },
          highlights: [4],
          annotations: ['arr[4] = 9 = target ✓'],
        },
      },
      {
        id: 4,
        title: 'Target Found',
        description: 'arr[4]=9 equals target. Return index 4.',
        visual: {
          array: [-1, 0, 3, 5, 9, 12],
          pointers: { left: 3, right: 5, mid: 4 },
          highlights: [4],
          result: 'Found at index 4',
        },
      },
      {
        id: 5,
        title: 'Why O(log n)',
        description: 'Halved from 6→3→1. Only 2 comparisons for 6 elements.',
        visual: {
          array: [-1, 0, 3, 5, 9, 12],
          highlights: [4],
          annotations: ['6 elements → 2 comparisons', 'O(log n) time'],
          result: 'Index: 4',
        },
      },
    ],
  },

  'search-insert-position': {
    title: 'Search Insert Position',
    keyInsight: 'When target is not found, left pointer lands exactly at the insertion point.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize',
        description: 'left=0, right=3. Searching for 2.',
        visual: {
          array: [1, 3, 5, 6],
          pointers: { left: 0, right: 3 },
          annotations: ['Target: 2'],
        },
      },
      {
        id: 2,
        title: 'First Mid',
        description: 'mid=1, arr[1]=3. 3 > 2, search left.',
        visual: {
          array: [1, 3, 5, 6],
          pointers: { left: 0, right: 3, mid: 1 },
          highlights: [1],
          annotations: ['arr[1] = 3 > 2', '← Search left half'],
        },
      },
      {
        id: 3,
        title: 'Narrow Left',
        description: 'right=0, mid=0, arr[0]=1. 1 < 2, search right.',
        visual: {
          array: [1, 3, 5, 6],
          pointers: { left: 0, right: 0, mid: 0 },
          highlights: [0],
          annotations: ['arr[0] = 1 < 2', 'Search right half →'],
        },
      },
      {
        id: 4,
        title: 'Loop Ends',
        description: 'left=1, right=0. left > right, loop exits. left=1 is insertion point.',
        visual: {
          array: [1, 3, 5, 6],
          pointers: { left: 1, right: 0 },
          annotations: ['left > right → loop ends', 'left = 1 is insert position'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Insert 2 at index 1 to maintain sorted order: [1, 2, 3, 5, 6]',
        visual: {
          array: [1, 3, 5, 6],
          highlights: [1],
          annotations: ['[1, 2, 3, 5, 6]'],
          result: 'Insert at index 1',
        },
      },
    ],
  },

  'first-last-position': {
    title: 'Find First and Last Position',
    keyInsight: 'Run binary search twice: left-biased keeps searching left after finding target, right-biased keeps searching right.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Find first and last occurrence of 8 in sorted array.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 0, right: 5 },
          annotations: ['Target: 8', 'Phase 1: Find first occurrence'],
        },
      },
      {
        id: 2,
        title: 'Find First: Mid=2',
        description: 'arr[2]=7 < 8, search right.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 0, right: 5, mid: 2 },
          highlights: [2],
          annotations: ['arr[2] = 7 < 8', 'Search right half →'],
        },
      },
      {
        id: 3,
        title: 'Find First: Mid=4',
        description: 'arr[4]=8 = target! But keep searching LEFT for earlier occurrence.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 3, right: 5, mid: 4 },
          highlights: [4],
          annotations: ['arr[4] = 8 = target', 'Keep searching left for first'],
        },
      },
      {
        id: 4,
        title: 'Find First: Result',
        description: 'right=3, mid=3, arr[3]=8 = target. left=3, right=2. First occurrence at index 3.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 3, right: 3, mid: 3 },
          highlights: [3],
          annotations: ['First 8 at index 3'],
          result: 'First: index 3',
        },
      },
      {
        id: 5,
        title: 'Find Last: Reset',
        description: 'Start Phase 2. left=0, right=5. Now search right-biased.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 0, right: 5 },
          annotations: ['Phase 2: Find last occurrence'],
        },
      },
      {
        id: 6,
        title: 'Find Last: Mid=4',
        description: 'arr[4]=8 = target! Keep searching RIGHT for later occurrence.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          pointers: { left: 3, right: 5, mid: 4 },
          highlights: [4],
          annotations: ['arr[4] = 8 = target', 'Keep searching right for last'],
        },
      },
      {
        id: 7,
        title: 'Result',
        description: 'First at 3, Last at 4.',
        visual: {
          array: [5, 7, 7, 8, 8, 10],
          highlights: [3, 4],
          annotations: ['Range: [3, 4]'],
          result: '[3, 4]',
        },
      },
    ],
  },

  'search-rotated-array': {
    title: 'Search in Rotated Sorted Array',
    keyInsight: 'After rotation, one half around mid is always sorted. Check if target falls in the sorted half.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize',
        description: 'Rotated array. left=0, right=6. Looking for 0.',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          pointers: { left: 0, right: 6 },
          annotations: ['Target: 0', 'Rotated at index 4'],
        },
      },
      {
        id: 2,
        title: 'Mid=3, arr[3]=7',
        description: 'Left half [4,5,6,7] is sorted (arr[0]=4 <= arr[3]=7). Is target in [4..7]? No (0 < 4). Search right.',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          pointers: { left: 0, right: 6, mid: 3 },
          highlights: [3],
          annotations: ['Left half [4,5,6,7] is sorted', '0 not in [4..7] → search right'],
        },
      },
      {
        id: 3,
        title: 'Narrow Right',
        description: 'left=4, right=6, mid=5, arr[5]=1. Left half [0,1] is sorted (arr[4]=0 <= arr[5]=1). Is 0 in [0..1]? Yes! Search left.',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          pointers: { left: 4, right: 6, mid: 5 },
          highlights: [5],
          annotations: ['Left half [0,1] is sorted', '0 is in [0..1] → search left'],
        },
      },
      {
        id: 4,
        title: 'Found',
        description: 'left=4, right=4, mid=4, arr[4]=0 = target!',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          pointers: { left: 4, right: 4, mid: 4 },
          highlights: [4],
          annotations: ['arr[4] = 0 = target ✓'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Target 0 found at index 4.',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          highlights: [4],
          result: 'Found at index 4',
        },
      },
      {
        id: 6,
        title: 'Key Takeaway',
        description: 'One half is always sorted. Check if target is in the sorted range to decide direction.',
        visual: {
          array: [4, 5, 6, 7, 0, 1, 2],
          annotations: ['One half is ALWAYS sorted', 'Check sorted half range to decide'],
          result: 'Index: 4',
        },
      },
    ],
  },

  'find-min-rotated': {
    title: 'Find Minimum in Rotated Sorted Array',
    keyInsight: 'If arr[mid] > arr[right], the minimum is in the right half (rotation point is there). Otherwise, it is in the left half including mid.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize',
        description: 'Rotated sorted array. Minimum is at the rotation point.',
        visual: {
          array: [3, 4, 5, 1, 2],
          pointers: { left: 0, right: 4 },
          annotations: ['Find rotation point (minimum)'],
        },
      },
      {
        id: 2,
        title: 'Mid=2, arr[2]=5',
        description: 'arr[2]=5 > arr[4]=2. Minimum must be in right half.',
        visual: {
          array: [3, 4, 5, 1, 2],
          pointers: { left: 0, right: 4, mid: 2 },
          highlights: [2],
          annotations: ['arr[2]=5 > arr[4]=2', 'Min is in right half →'],
        },
      },
      {
        id: 3,
        title: 'Narrow Right',
        description: 'left=3, right=4, mid=3, arr[3]=1. arr[3]=1 <= arr[4]=2. Min is at mid or left of mid.',
        visual: {
          array: [3, 4, 5, 1, 2],
          pointers: { left: 3, right: 4, mid: 3 },
          highlights: [3],
          annotations: ['arr[3]=1 ≤ arr[4]=2', '← Min is at mid or left'],
        },
      },
      {
        id: 4,
        title: 'Converged',
        description: 'right=3, left=3. Pointers converge. arr[3]=1 is the minimum.',
        visual: {
          array: [3, 4, 5, 1, 2],
          pointers: { left: 3, right: 3 },
          highlights: [3],
          annotations: ['Converged at index 3'],
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Minimum is 1 at index 3 (the rotation point).',
        visual: {
          array: [3, 4, 5, 1, 2],
          highlights: [3],
          annotations: ['Rotation point found'],
          result: 'Minimum: 1',
        },
      },
    ],
  },

  'find-peak-element': {
    title: 'Find Peak Element',
    keyInsight: 'If the right neighbor is larger, a peak must exist to the right (array drops to -∞ at boundary). Always move uphill.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize',
        description: 'Find any peak (greater than both neighbors). nums[-1] = nums[n] = -∞.',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          pointers: { left: 0, right: 6 },
          annotations: ['Any peak works', 'Boundary = -∞'],
        },
      },
      {
        id: 2,
        title: 'Mid=3, arr[3]=3',
        description: 'arr[4]=5 > arr[3]=3. Going uphill to the right. Peak must exist right.',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          pointers: { left: 0, right: 6, mid: 3 },
          highlights: [3],
          annotations: ['arr[4]=5 > arr[3]=3', 'Uphill right → peak exists right'],
        },
      },
      {
        id: 3,
        title: 'Narrow Right',
        description: 'left=4, right=6, mid=5, arr[5]=6. arr[6]=4 < arr[5]=6. Going downhill right. Peak is at mid or left.',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          pointers: { left: 4, right: 6, mid: 5 },
          highlights: [5],
          annotations: ['arr[6]=4 < arr[5]=6', 'Downhill right → peak at/before mid'],
        },
      },
      {
        id: 4,
        title: 'Narrow Left',
        description: 'left=4, right=5, mid=4, arr[4]=5. arr[5]=6 > arr[4]=5. Uphill right.',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          pointers: { left: 4, right: 5, mid: 4 },
          highlights: [4],
          annotations: ['arr[5]=6 > arr[4]=5', 'Uphill right →'],
        },
      },
      {
        id: 5,
        title: 'Converged',
        description: 'left=5, right=5. arr[5]=6 is a peak (6 > 5 and 6 > 4).',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          pointers: { left: 5, right: 5 },
          highlights: [5],
          annotations: ['6 > 5 (left) and 6 > 4 (right)'],
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Peak found at index 5, value 6.',
        visual: {
          array: [1, 2, 1, 3, 5, 6, 4],
          highlights: [5],
          annotations: ['Always move uphill', 'Guaranteed to find a peak'],
          result: 'Peak at index 5 (value: 6)',
        },
      },
    ],
  },

  'first-bad-version': {
    title: 'First Bad Version',
    keyInsight: 'Binary search the version space and keep the earliest index where isBadVersion(mid) is true.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Initialize',
        description: 'Versions 1..n, with all good versions before the first bad version.',
        visual: {
          array: [1, 2, 3, 4, 5, 6, 7],
          pointers: { left: 0, right: 6 },
          annotations: ['False ... false ... true ... true'],
        },
      },
      {
        id: 2,
        title: 'First Mid Check',
        description: 'mid=3, isBadVersion(4)=true, so first bad is at 4 or earlier.',
        visual: {
          array: [1, 2, 3, 4, 5, 6, 7],
          pointers: { left: 0, right: 6, mid: 3 },
          highlights: [3],
          annotations: ['Move right to mid'],
        },
      },
      {
        id: 3,
        title: 'Second Check',
        description: 'mid=1, isBadVersion(2)=false, so first bad is after 2.',
        visual: {
          array: [1, 2, 3, 4, 5, 6, 7],
          pointers: { left: 2, right: 3, mid: 1 },
          highlights: [1],
          annotations: ['Move left to mid + 1'],
        },
      },
      {
        id: 4,
        title: 'Converge',
        description: 'left and right meet at first bad version index.',
        visual: {
          array: [1, 2, 3, 4, 5, 6, 7],
          pointers: { left: 4, right: 4, mid: 4 },
          highlights: [4],
          result: 'First bad = 4',
        },
      },
    ],
  },

  'search-rotated-array-ii': {
    title: 'Search in Rotated Sorted Array II',
    keyInsight: 'Use normal rotated-array logic, but shrink both ends when duplicates block ordering.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Find target in [2, 5, 6, 0, 0, 1, 2].',
        visual: {
          array: [2, 5, 6, 0, 0, 1, 2],
          pointers: { left: 0, right: 6 },
          annotations: ['Rotated with duplicates'],
        },
      },
      {
        id: 2,
        title: 'Mid=3, Value=0',
        description: 'mid is not target. Boundaries and mid differ, so decide sorted half as normal.',
        visual: {
          array: [2, 5, 6, 0, 0, 1, 2],
          pointers: { left: 0, right: 6, mid: 3 },
          highlights: [3],
          annotations: ['arr[mid] = 0'],
        },
      },
      {
        id: 3,
        title: 'Target Found',
        description: 'arr[3] == target, so return true.',
        visual: {
          array: [2, 5, 6, 0, 0, 1, 2],
          highlights: [3],
          annotations: ['Target found at 3'],
          result: 'true',
        },
      },
    ],
  },

  'peak-index-in-mountain-array': {
    title: 'Peak Index in Mountain Array',
    keyInsight: 'Compare middle with next element; if it is increasing, peak is right; else peak is at mid or left.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Mountain array [0, 2, 3, 5, 4, 1].',
        visual: {
          array: [0, 2, 3, 5, 4, 1],
          pointers: { left: 0, right: 5 },
          annotations: ['Increasing then decreasing'],
        },
      },
      {
        id: 2,
        title: 'Mid=2, Value=3',
        description: '3 < 5 (next), move left boundary to mid + 1.',
        visual: {
          array: [0, 2, 3, 5, 4, 1],
          pointers: { left: 3, right: 5, mid: 2 },
          highlights: [2, 3],
          annotations: ['Ascending slope, peak right'],
        },
      },
      {
        id: 3,
        title: 'Converged',
        description: 'left meets right at index 3, the peak index.',
        visual: {
          array: [0, 2, 3, 5, 4, 1],
          pointers: { left: 3, right: 3 },
          highlights: [3],
          result: 'Peak index 3',
        },
      },
    ],
  },

  'find-smallest-divisor': {
    title: 'Smallest Divisor Given a Threshold',
    keyInsight: 'Binary search divisor; feasibility is monotonic because larger divisors never increase required sum.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Binary search divisor from 1 to max(nums).',
        visual: {
          array: [1, 2, 5, 9],
          pointers: { left: 1, right: 9 },
          annotations: ['Threshold = 6'],
        },
      },
      {
        id: 2,
        title: 'Try mid=5',
        description: 'Compute ceil(1/5)+ceil(2/5)+ceil(5/5)+ceil(9/5)=1+1+1+2=5 <= 6. Try smaller.',
        visual: {
          array: [1, 2, 5, 9],
          pointers: { left: 1, right: 4 },
          annotations: ['5 works, try smaller'],
        },
      },
      {
        id: 3,
        title: 'Converge',
        description: 'Move through search space until smallest valid divisor remains.',
        visual: {
          array: [1, 2, 5, 9],
          pointers: { left: 4, right: 5 },
          highlights: [4],
          annotations: ['Answer = 4'],
          result: 'Smallest divisor: 4',
        },
      },
    ],
  },

  'minimum-number-of-days': {
    title: 'Minimum Number of Days to Make m Bouquets',
    keyInsight: 'Monotonic predicate: if day d is feasible, any later day is feasible.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Binary Search Days',
        description: 'Search days in the min..max bloom range.',
        visual: {
          array: [1, 10, 3, 10, 2],
          pointers: { left: 1, right: 10 },
          annotations: ['m=3, k=1'],
        },
      },
      {
        id: 2,
        title: 'Day 5 Feasible',
        description: 'All bloom days <=5 form 3 bouquets of size 1, so 5 is feasible.',
        visual: {
          array: [1, 10, 3, 10, 2],
          pointers: { left: 1, right: 4 },
          highlights: [0, 2, 4],
          annotations: ['3 blooms available'],
        },
      },
      {
        id: 3,
        title: 'Result',
        description: 'Converge to smallest feasible day.',
        visual: {
          array: [1, 10, 3, 10, 2],
          pointers: { left: 3, right: 3 },
          highlights: [0, 2, 4],
          result: 'Minimum day: 3',
        },
      },
    ],
  },

  'magnetic-force-between-balls': {
    title: 'Magnetic Force Between Two Balls',
    keyInsight: 'Binary search minimum distance and greedily place balls whenever spacing is large enough.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Sort and Search',
        description: 'Positions [1, 2, 3, 4, 7], m=3. Search distance from 1..6.',
        visual: {
          array: [1, 2, 3, 4, 7],
          pointers: { left: 1, right: 6 },
          annotations: ['Greedy placement check'],
        },
      },
      {
        id: 2,
        title: 'Try mid=3',
        description: 'Place at 1 and 4 gives distance 3; place next at 7 gives distance 3. Feasible.',
        visual: {
          array: [1, 2, 3, 4, 7],
          highlights: [0, 3, 4],
          pointers: { left: 4, right: 6 },
          annotations: ['Distance 3 works'],
        },
      },
      {
        id: 3,
        title: 'Try larger distance',
        description: 'Move to higher candidate. Distance 4 still feasible, then narrow.',
        visual: {
          array: [1, 2, 3, 4, 7],
          highlights: [0, 4],
          pointers: { left: 4, right: 6 },
          annotations: ['Answer max distance = 3'],
          result: 'Max min distance: 3',
        },
      },
    ],
  },

  'search-2d-matrix-ii': {
    title: 'Search a 2D Matrix II',
    keyInsight: 'Start top-right and eliminate one row/column per comparison.',
    pattern: 'binary-search',
    steps: [
      {
        id: 1,
        title: 'Start at Top-Right',
        description: 'Move from (0,4) in a matrix sorted by rows and columns.',
        visual: {
          array: [1, 4, 7, 11, 15, 2, 5, 8, 12, 19, 3, 6, 9, 16, 22, 10, 13, 14, 17, 24, 18, 21, 23, 26, 30],
          pointers: { row: 0, col: 4 },
          annotations: ['Target=5'],
          highlights: [4],
        },
      },
      {
        id: 2,
        title: 'Move Left',
        description: '15 > 5 so eliminate first row by moving left.',
        visual: {
          array: [1, 4, 7, 11, 15, 2, 5, 8, 12, 19, 3, 6, 9, 16, 22, 10, 13, 14, 17, 24, 18, 21, 23, 26, 30],
          pointers: { row: 0, col: 3 },
          annotations: ['15 too high, move left'],
          highlights: [3],
        },
      },
      {
        id: 3,
        title: 'Move Down',
        description: '11 > 5, move left again to 7. then 7 > 5, move down to 3rd row? continue until target found.',
        visual: {
          array: [1, 4, 7, 11, 15, 2, 5, 8, 12, 19, 3, 6, 9, 16, 22, 10, 13, 14, 17, 24, 18, 21, 23, 26, 30],
          pointers: { row: 1, col: 1 },
          highlights: [6],
          annotations: ['Found 5 at row 1, col 1'],
          result: 'Found',
        },
      },
    ],
  },

  // ==================== LINKED LIST PROBLEMS ====================

  'reverse-linked-list': {
    title: 'Reverse Linked List',
    keyInsight: 'Three pointers (prev, curr, next) walk through the list, flipping each arrow backward',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Initialize prev = null, curr = head. We will flip each arrow from curr to prev.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { prev: 'null', curr: 'n1' },
            highlightNodes: ['n1'],
          },
        },
      },
      {
        id: 2,
        title: 'Reverse First Arrow',
        description: 'Save next = 2. Point 1→null. Move prev to 1, curr to 2.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: null },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { prev: 'n1', curr: 'n2' },
            highlightNodes: ['n1', 'n2'],
            highlightEdges: [['n1', 'null']],
            annotations: ['1 → null'],
          },
        },
      },
      {
        id: 3,
        title: 'Reverse Second Arrow',
        description: 'Save next = 3. Point 2→1. Move prev to 2, curr to 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: null },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { prev: 'n2', curr: 'n3' },
            highlightNodes: ['n2', 'n3'],
            highlightEdges: [['n2', 'n1']],
            annotations: ['2 → 1'],
          },
        },
      },
      {
        id: 4,
        title: 'Reverse Third Arrow',
        description: 'Save next = 4. Point 3→2. Move prev to 3, curr to 4.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: null },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { prev: 'n3', curr: 'n4' },
            highlightNodes: ['n3', 'n4'],
            highlightEdges: [['n3', 'n2']],
            annotations: ['3 → 2'],
          },
        },
      },
      {
        id: 5,
        title: 'Reverse Fourth Arrow',
        description: 'Save next = 5. Point 4→3. Move prev to 4, curr to 5.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: null },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { prev: 'n4', curr: 'n5' },
            highlightNodes: ['n4', 'n5'],
            highlightEdges: [['n4', 'n3']],
            annotations: ['4 → 3'],
          },
        },
      },
      {
        id: 6,
        title: 'Done — List Reversed',
        description: 'Point 5→4. curr becomes null, prev is the new head.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n5', value: 5, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: null },
            ],
            pointers: { head: 'n5' },
            highlightNodes: ['n5'],
            annotations: ['New head = 5'],
          },
          result: '5 → 4 → 3 → 2 → 1',
        },
      },
    ],
  },

  'merge-two-sorted-lists': {
    title: 'Merge Two Sorted Lists',
    keyInsight: 'Dummy head eliminates edge cases; always attach the smaller node',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Two sorted lists and a dummy node. Tail pointer starts at dummy.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: null },
            ],
            secondList: [
              { id: 'm1', value: 2, next: 'm2' },
              { id: 'm2', value: 4, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            detachedNodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 3, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            pointers: { tail: 'd0', p1: 'n1', p2: 'm1' },
            annotations: ['List 1: [1,3,5]', 'List 2: [2,4,6]'],
          },
        },
      },
      {
        id: 2,
        title: 'Compare 1 vs 2',
        description: '1 < 2, attach node 1 to tail. Advance p1 to 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: null },
            ],
            secondList: [
              { id: 'm1', value: 2, next: 'm2' },
              { id: 'm2', value: 4, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            detachedNodes: [
              { id: 'n2', value: 3, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            pointers: { tail: 'n1', p1: 'n2', p2: 'm1' },
            highlightNodes: ['n1'],
            annotations: ['1 < 2 → attach 1'],
          },
        },
      },
      {
        id: 3,
        title: 'Compare 3 vs 2',
        description: '2 < 3, attach node 2. Advance p2 to 4.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 2, next: null },
            ],
            secondList: [
              { id: 'm2', value: 4, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            detachedNodes: [
              { id: 'n2', value: 3, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            pointers: { tail: 'm1', p1: 'n2', p2: 'm2' },
            highlightNodes: ['m1'],
            annotations: ['2 < 3 → attach 2'],
          },
        },
      },
      {
        id: 4,
        title: 'Compare 3 vs 4',
        description: '3 < 4, attach node 3. Advance p1 to 5.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 2, next: 'n2' },
              { id: 'n2', value: 3, next: null },
            ],
            secondList: [
              { id: 'm2', value: 4, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            detachedNodes: [
              { id: 'n3', value: 5, next: null },
            ],
            pointers: { tail: 'n2', p1: 'n3', p2: 'm2' },
            highlightNodes: ['n2'],
            annotations: ['3 < 4 → attach 3'],
          },
        },
      },
      {
        id: 5,
        title: 'Attach Remaining',
        description: 'Continue comparing: 4 < 5 → attach 4, then 5 < 6 → attach 5, then attach 6.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 2, next: 'n2' },
              { id: 'n2', value: 3, next: 'm2' },
              { id: 'm2', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            pointers: { tail: 'm3' },
            highlightNodes: ['m2', 'n3', 'm3'],
            annotations: ['4, 5, 6 attached in order'],
          },
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Return dummy.next. Merged list is sorted.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 2, next: 'n2' },
              { id: 'n2', value: 3, next: 'm2' },
              { id: 'm2', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: 'm3' },
              { id: 'm3', value: 6, next: null },
            ],
            pointers: { head: 'n1' },
            highlightNodes: ['n1'],
          },
          result: '1 → 2 → 3 → 4 → 5 → 6',
        },
      },
    ],
  },

  'linked-list-cycle': {
    title: 'Linked List Cycle',
    keyInsight: 'Fast moves 2x; if there\'s a cycle, fast laps slow — they MUST meet',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'List has a cycle: 5→3. Slow and fast both start at head.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: 'n3' },
            ],
            pointers: { slow: 'n1', fast: 'n1' },
            cycleTarget: 'n3',
            annotations: ['Cycle: 5 → 3'],
          },
        },
      },
      {
        id: 2,
        title: 'Step 1',
        description: 'Slow moves to 2. Fast moves to 3 (two steps).',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: 'n3' },
            ],
            pointers: { slow: 'n2', fast: 'n3' },
            cycleTarget: 'n3',
            highlightNodes: ['n2', 'n3'],
            annotations: ['Slow: 1→2', 'Fast: 1→2→3'],
          },
        },
      },
      {
        id: 3,
        title: 'Step 2',
        description: 'Slow moves to 3. Fast moves to 5 (two steps: 3→4→5).',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: 'n3' },
            ],
            pointers: { slow: 'n3', fast: 'n5' },
            cycleTarget: 'n3',
            highlightNodes: ['n3', 'n5'],
            annotations: ['Slow: 2→3', 'Fast: 3→4→5'],
          },
        },
      },
      {
        id: 4,
        title: 'They Meet!',
        description: 'Slow moves to 4. Fast moves to 4 (two steps: 5→3→4). They collide at node 4.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: 'n3' },
            ],
            pointers: { slow: 'n4', fast: 'n4' },
            cycleTarget: 'n3',
            highlightNodes: ['n4'],
            annotations: ['Slow: 3→4', 'Fast: 5→3→4', 'COLLISION!'],
          },
        },
      },
      {
        id: 5,
        title: 'Cycle Detected',
        description: 'Slow and fast met, confirming a cycle exists. Return true.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: 'n3' },
            ],
            cycleTarget: 'n3',
            highlightNodes: ['n3', 'n4', 'n5'],
            annotations: ['Cycle in nodes 3→4→5→3'],
          },
          result: true,
        },
      },
    ],
  },

  'middle-of-linked-list': {
    title: 'Middle of Linked List',
    keyInsight: 'When fast reaches the end, slow is exactly at the middle',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Both slow and fast start at head node 1.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { slow: 'n1', fast: 'n1' },
            highlightNodes: ['n1'],
          },
        },
      },
      {
        id: 2,
        title: 'Step 1',
        description: 'Slow moves to 2. Fast jumps to 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { slow: 'n2', fast: 'n3' },
            highlightNodes: ['n2', 'n3'],
            annotations: ['Slow +1', 'Fast +2'],
          },
        },
      },
      {
        id: 3,
        title: 'Step 2',
        description: 'Slow moves to 3. Fast jumps to 5.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { slow: 'n3', fast: 'n5' },
            highlightNodes: ['n3', 'n5'],
            annotations: ['Slow +1', 'Fast +2'],
          },
        },
      },
      {
        id: 4,
        title: 'Fast at End',
        description: 'Fast has reached the last node (no next). Slow is at the middle.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { slow: 'n3', fast: 'n5' },
            highlightNodes: ['n3'],
            annotations: ['Fast at end → slow is middle'],
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Middle node is 3. Return the sublist starting from node 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightNodes: ['n3', 'n4', 'n5'],
            annotations: ['Middle → [3, 4, 5]'],
          },
          result: 'Middle node: 3',
        },
      },
    ],
  },

  'remove-nth-from-end': {
    title: 'Remove Nth Node From End',
    keyInsight: 'Create an N-node gap between two pointers, then the trailing pointer lands at the target',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup with Dummy',
        description: 'Add dummy before head. Both pointers start at dummy. n=2 means remove 2nd from end.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { fast: 'd0', slow: 'd0' },
            annotations: ['n = 2'],
          },
        },
      },
      {
        id: 2,
        title: 'Advance Fast by N',
        description: 'Move fast 2 steps ahead to create the gap.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { fast: 'n2', slow: 'd0' },
            highlightNodes: ['n2'],
            annotations: ['Gap = 2 nodes'],
          },
        },
      },
      {
        id: 3,
        title: 'Move Both Together',
        description: 'Move both pointers one step at a time until fast reaches the end.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { fast: 'n4', slow: 'n2' },
            highlightNodes: ['n2', 'n4'],
            annotations: ['Both move together'],
          },
        },
      },
      {
        id: 4,
        title: 'Fast at End',
        description: 'Fast at node 5 (last). Slow is at node 3, one before the target.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { fast: 'n5', slow: 'n3' },
            highlightNodes: ['n3', 'n4', 'n5'],
            annotations: ['Slow.next = target (4)'],
          },
        },
      },
      {
        id: 5,
        title: 'Remove Node',
        description: 'Set slow.next = slow.next.next, skipping node 4.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { slow: 'n3' },
            highlightNodes: ['n3', 'n5'],
            highlightEdges: [['n3', 'n5']],
            annotations: ['3.next = 5 (skip 4)'],
          },
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'Node 4 removed. Return dummy.next as new head.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { head: 'n1' },
          },
          result: '1 → 2 → 3 → 5',
        },
      },
    ],
  },

  'add-two-numbers': {
    title: 'Add Two Numbers',
    keyInsight: 'Process digit by digit with carry, like grade-school addition on linked lists',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Two numbers in reverse digit order: 342 as [2,4,3] and 465 as [5,6,4].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 2, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'm1', value: 5, next: 'm2' },
              { id: 'm2', value: 6, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            pointers: { p1: 'n1', p2: 'm1' },
            annotations: ['342 + 465 = ?', 'carry = 0'],
          },
        },
      },
      {
        id: 2,
        title: 'Digit 1: 2 + 5 = 7',
        description: '2 + 5 + carry(0) = 7. No carry. Create result node 7.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 2, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'm1', value: 5, next: 'm2' },
              { id: 'm2', value: 6, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 7, next: null },
            ],
            pointers: { p1: 'n2', p2: 'm2' },
            highlightNodes: ['n1', 'm1', 'r1'],
            annotations: ['2 + 5 = 7', 'carry = 0'],
          },
        },
      },
      {
        id: 3,
        title: 'Digit 2: 4 + 6 = 10',
        description: '4 + 6 + carry(0) = 10. Write 0, carry 1.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 2, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'm1', value: 5, next: 'm2' },
              { id: 'm2', value: 6, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 7, next: 'r2' },
              { id: 'r2', value: 0, next: null },
            ],
            pointers: { p1: 'n3', p2: 'm3' },
            highlightNodes: ['n2', 'm2', 'r2'],
            annotations: ['4 + 6 = 10', 'carry = 1'],
          },
        },
      },
      {
        id: 4,
        title: 'Digit 3: 3 + 4 + 1 = 8',
        description: '3 + 4 + carry(1) = 8. No carry. Create result node 8.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 2, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'm1', value: 5, next: 'm2' },
              { id: 'm2', value: 6, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 7, next: 'r2' },
              { id: 'r2', value: 0, next: 'r3' },
              { id: 'r3', value: 8, next: null },
            ],
            highlightNodes: ['n3', 'm3', 'r3'],
            annotations: ['3 + 4 + 1 = 8', 'carry = 0'],
          },
        },
      },
      {
        id: 5,
        title: 'All Digits Processed',
        description: 'Both lists exhausted, no remaining carry.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'r1', value: 7, next: 'r2' },
              { id: 'r2', value: 0, next: 'r3' },
              { id: 'r3', value: 8, next: null },
            ],
            pointers: { head: 'r1' },
            highlightNodes: ['r1', 'r2', 'r3'],
            annotations: ['Result: 807'],
          },
        },
      },
      {
        id: 6,
        title: 'Result',
        description: '342 + 465 = 807, stored as [7, 0, 8] in reverse order.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'r1', value: 7, next: 'r2' },
              { id: 'r2', value: 0, next: 'r3' },
              { id: 'r3', value: 8, next: null },
            ],
            pointers: { head: 'r1' },
          },
          result: '7 → 0 → 8 (807)',
        },
      },
    ],
  },

  'reorder-list': {
    title: 'Reorder List',
    keyInsight: 'Find middle → reverse second half → merge alternating = three classic patterns in one',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Original List',
        description: 'We need to reorder [1,2,3,4,5] into [1,5,2,4,3].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            annotations: ['Goal: L0→Ln→L1→Ln-1→...'],
          },
        },
      },
      {
        id: 2,
        title: 'Find Middle',
        description: 'Use slow/fast pointers. Middle is node 3. Split into [1,2,3] and [4,5].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightNodes: ['n3'],
            annotations: ['First half: [1,2,3]', 'Second half: [4,5]'],
          },
        },
      },
      {
        id: 3,
        title: 'Reverse Second Half',
        description: 'Reverse [4,5] to get [5,4].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            secondList: [
              { id: 'n5', value: 5, next: 'n4' },
              { id: 'n4', value: 4, next: null },
            ],
            highlightNodes: ['n5', 'n4'],
            annotations: ['Reversed: [5,4]'],
          },
        },
      },
      {
        id: 4,
        title: 'Merge Step 1',
        description: 'Interleave: take 1 from first, 5 from second, 2 from first, 4 from second.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n5' },
              { id: 'n5', value: 5, next: 'n2' },
              { id: 'n2', value: 2, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            highlightNodes: ['n1', 'n5', 'n2', 'n4'],
            highlightEdges: [['n1', 'n5'], ['n5', 'n2'], ['n2', 'n4']],
            annotations: ['1→5→2→4→...'],
          },
        },
      },
      {
        id: 5,
        title: 'Merge Step 2',
        description: 'Node 3 is the last remaining node, attached at the end.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n5' },
              { id: 'n5', value: 5, next: 'n2' },
              { id: 'n2', value: 2, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            highlightNodes: ['n3'],
            highlightEdges: [['n4', 'n3']],
            annotations: ['...4→3'],
          },
        },
      },
      {
        id: 6,
        title: 'Done',
        description: 'List reordered in-place to [1,5,2,4,3].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n5' },
              { id: 'n5', value: 5, next: 'n2' },
              { id: 'n2', value: 2, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            pointers: { head: 'n1' },
          },
          result: '1 → 5 → 2 → 4 → 3',
        },
      },
    ],
  },

  'swap-nodes-in-pairs': {
    title: 'Swap Nodes in Pairs',
    keyInsight: 'Rewire prev→second→first→rest for each pair; a dummy node handles the head swap',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup with Dummy',
        description: 'Add dummy before [1,2,3,4]. prev starts at dummy.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n1' },
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: null },
            ],
            pointers: { prev: 'd0' },
            annotations: ['Pairs: (1,2) and (3,4)'],
          },
        },
      },
      {
        id: 2,
        title: 'Swap Pair (1, 2)',
        description: 'first=1, second=2. Rewire: D→2→1→3. prev moves to node 1.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: null },
            ],
            pointers: { prev: 'n1' },
            highlightNodes: ['n1', 'n2'],
            highlightEdges: [['d0', 'n2'], ['n2', 'n1'], ['n1', 'n3']],
            annotations: ['D→2→1→3'],
          },
        },
      },
      {
        id: 3,
        title: 'Swap Pair (3, 4)',
        description: 'first=3, second=4. Rewire: 1→4→3→null. prev moves to node 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            pointers: { prev: 'n3' },
            highlightNodes: ['n3', 'n4'],
            highlightEdges: [['n1', 'n4'], ['n4', 'n3']],
            annotations: ['1→4→3→null'],
          },
        },
      },
      {
        id: 4,
        title: 'No More Pairs',
        description: 'No more nodes to swap. All pairs are processed.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'd0', value: 'D', next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            annotations: ['All pairs swapped'],
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Return dummy.next. [1,2,3,4] became [2,1,4,3].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            pointers: { head: 'n2' },
          },
          result: '2 → 1 → 4 → 3',
        },
      },
    ],
  },

  'copy-list-random-pointer': {
    title: 'Copy List with Random Pointer',
    keyInsight: 'Hash map from original→clone lets you wire random pointers in a second pass',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Original List',
        description: 'Each node has next and random pointers. Random: 1→3, 2→1, 3→2.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            annotations: ['Random: 1→3, 2→1, 3→2'],
          },
        },
      },
      {
        id: 2,
        title: 'Pass 1: Create Clone Nodes',
        description: 'Iterate through the list, create a clone for each node. Store original→clone in a map.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 1, next: null },
              { id: 'r2', value: 2, next: null },
              { id: 'r3', value: 3, next: null },
            ],
            highlightNodes: ['r1', 'r2', 'r3'],
            annotations: ['Map: n1→r1, n2→r2, n3→r3'],
          },
        },
      },
      {
        id: 3,
        title: 'Pass 2: Wire Next Pointers',
        description: 'For each original node, set clone.next = map[original.next].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 1, next: 'r2' },
              { id: 'r2', value: 2, next: 'r3' },
              { id: 'r3', value: 3, next: null },
            ],
            highlightEdges: [['r1', 'r2'], ['r2', 'r3']],
            annotations: ['Next pointers wired'],
          },
        },
      },
      {
        id: 4,
        title: 'Pass 2: Wire Random Pointers',
        description: 'For each original node, set clone.random = map[original.random].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 1, next: 'r2' },
              { id: 'r2', value: 2, next: 'r3' },
              { id: 'r3', value: 3, next: null },
            ],
            highlightNodes: ['r1', 'r2', 'r3'],
            annotations: ['Random: r1→r3, r2→r1, r3→r2', 'Deep copy complete'],
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'Return the cloned head. Deep copy with both next and random pointers.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'r1', value: 1, next: 'r2' },
              { id: 'r2', value: 2, next: 'r3' },
              { id: 'r3', value: 3, next: null },
            ],
            pointers: { head: 'r1' },
            annotations: ['Random: 1→3, 2→1, 3→2'],
          },
          result: 'Deep copy with random pointers',
        },
      },
    ],
  },

  'reverse-nodes-k-group': {
    title: 'Reverse Nodes in K-Group',
    keyInsight: 'Count k nodes ahead, reverse that segment, connect to the result of the next group',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'List [1,2,3,4,5] with k=3. Reverse groups of 3.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            annotations: ['k = 3', 'Group 1: [1,2,3]', 'Remaining: [4,5]'],
          },
        },
      },
      {
        id: 2,
        title: 'Count K=3 Nodes',
        description: 'Count ahead: 1, 2, 3. We have k nodes, so reverse this group.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 2, next: 'n3' },
              { id: 'n3', value: 3, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightNodes: ['n1', 'n2', 'n3'],
            annotations: ['3 nodes found → reverse'],
          },
        },
      },
      {
        id: 3,
        title: 'Reverse Group 1',
        description: 'Reverse [1,2,3] to [3,2,1]. Node 1 will later connect to the next group.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: null },
            ],
            secondList: [
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightNodes: ['n3', 'n2', 'n1'],
            highlightEdges: [['n3', 'n2'], ['n2', 'n1']],
            annotations: ['Group 1 reversed: [3,2,1]'],
          },
        },
      },
      {
        id: 4,
        title: 'Connect Groups',
        description: 'Link the tail of reversed group (node 1) to the next group (node 4).',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightEdges: [['n1', 'n4']],
            annotations: ['1 → 4 (connect groups)'],
          },
        },
      },
      {
        id: 5,
        title: 'Check Remaining',
        description: 'Count ahead from node 4: only 2 nodes (4, 5). Less than k=3, so leave as-is.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            highlightNodes: ['n4', 'n5'],
            annotations: ['Only 2 nodes < k=3', 'Keep original order'],
          },
        },
      },
      {
        id: 6,
        title: 'Result',
        description: 'First group reversed, remaining nodes unchanged.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n3', value: 3, next: 'n2' },
              { id: 'n2', value: 2, next: 'n1' },
              { id: 'n1', value: 1, next: 'n4' },
              { id: 'n4', value: 4, next: 'n5' },
              { id: 'n5', value: 5, next: null },
            ],
            pointers: { head: 'n3' },
          },
          result: '3 → 2 → 1 → 4 → 5',
        },
      },
    ],
  },

  'merge-k-sorted-lists': {
    title: 'Merge K Sorted Lists',
    keyInsight: 'Divide-and-conquer: merge pairs of lists, halving the count each round',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Initial K=3 Lists',
        description: 'Three sorted lists: [1,4,5], [1,3,4], and [2,6].',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            secondList: [
              { id: 'm1', value: 1, next: 'm2' },
              { id: 'm2', value: 3, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 2, next: 'r2' },
              { id: 'r2', value: 6, next: null },
            ],
            annotations: ['List 0: [1,4,5]', 'List 1: [1,3,4]', 'List 2: [2,6]'],
          },
        },
      },
      {
        id: 2,
        title: 'Round 1: Merge Lists 0 + 1',
        description: 'Merge [1,4,5] and [1,3,4] using standard two-list merge.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'n2' },
              { id: 'n2', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            secondList: [
              { id: 'm1', value: 1, next: 'm2' },
              { id: 'm2', value: 3, next: 'm3' },
              { id: 'm3', value: 4, next: null },
            ],
            highlightNodes: ['n1', 'm1'],
            annotations: ['Merging pair: List 0 + List 1'],
          },
        },
      },
      {
        id: 3,
        title: 'Round 1 Result',
        description: 'Lists 0+1 merged into [1,1,3,4,4,5]. List 2 [2,6] waits for next round.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 1, next: 'm2' },
              { id: 'm2', value: 3, next: 'n2' },
              { id: 'n2', value: 4, next: 'm3' },
              { id: 'm3', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 2, next: 'r2' },
              { id: 'r2', value: 6, next: null },
            ],
            highlightNodes: ['n1', 'm1', 'm2', 'n2', 'm3', 'n3'],
            annotations: ['Merged: [1,1,3,4,4,5]', 'Waiting: [2,6]'],
          },
        },
      },
      {
        id: 4,
        title: 'Round 2: Merge Result + List 2',
        description: 'Merge [1,1,3,4,4,5] with [2,6] to produce the final sorted list.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 1, next: 'm2' },
              { id: 'm2', value: 3, next: 'n2' },
              { id: 'n2', value: 4, next: 'm3' },
              { id: 'm3', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: null },
            ],
            detachedNodes: [
              { id: 'r1', value: 2, next: 'r2' },
              { id: 'r2', value: 6, next: null },
            ],
            highlightNodes: ['n1', 'r1'],
            annotations: ['Final merge round'],
          },
        },
      },
      {
        id: 5,
        title: 'Result',
        description: 'All three lists merged into one sorted list.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n1', value: 1, next: 'm1' },
              { id: 'm1', value: 1, next: 'r1' },
              { id: 'r1', value: 2, next: 'm2' },
              { id: 'm2', value: 3, next: 'n2' },
              { id: 'n2', value: 4, next: 'm3' },
              { id: 'm3', value: 4, next: 'n3' },
              { id: 'n3', value: 5, next: 'r2' },
              { id: 'r2', value: 6, next: null },
            ],
            pointers: { head: 'n1' },
          },
          result: '1 → 1 → 2 → 3 → 4 → 4 → 5 → 6',
        },
      },
    ],
  },

  'top-k-frequent': {
    title: 'Top K Frequent Elements',
    keyInsight: 'Count each value first, then select K values with largest frequency; frequency drives the ranking order.',
    pattern: 'hash-map',
    steps: [
      {
        id: 1,
        title: 'Count Frequencies',
        description: 'Scan nums and store counts per value.',
        visual: {
          hashMap: {
            entries: [
              { key: '1', value: 3 },
              { key: '2', value: 2 },
              { key: '3', value: 1 },
            ],
            phase: 'frequency count',
            secondArray: [1, 2, 3],
            currentIndex: 3,
            lookupKey: '1',
          },
          annotations: ['freq(1)=3', 'freq(2)=2', 'freq(3)=1'],
        },
      },
      {
        id: 2,
        title: 'Build Ranked List',
        description: 'Convert map entries to (value, frequency) pairs and order by frequency descending.',
        visual: {
          array: ['1:3', '2:2', '3:1'],
          highlights: [0, 1],
          annotations: ['Sort by frequency first', '1 and 2 are top candidates'],
        },
      },
      {
        id: 3,
        title: 'Take Top K',
        description: 'Keep only first K pairs and return their values.',
        visual: {
          array: [1, 2],
          result: '[1, 2]',
          annotations: ['K=2 → answer = [1, 2]'],
        },
      },
    ],
  },

  'network-delay-time': {
    title: 'Network Delay Time',
    keyInsight: 'This is weighted shortest path from one source: repeatedly finalize the nearest unreached node and relax its outgoing edges.',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Initialize Distances',
        description: 'Start with source distance 0 and others as infinity.',
        visual: {
          array: [0, '∞', '∞', '∞', '∞'],
          annotations: ['dist[source=1] = 0', 'Others unknown'],
        },
      },
      {
        id: 2,
        title: 'Relax Edges from Closest Node',
        description: 'Pick current closest unreached node and update neighbors if we can improve their distances.',
        visual: {
          array: [0, 2, 4, 6, '∞'],
          highlights: [1, 2, 3],
          pointers: { node: 0 },
          annotations: [
            'Visit node 1',
            'Edge 1→2 with weight 2 updates dist(2)',
            'Edge 1→3 with weight 4 updates dist(3)',
          ],
        },
      },
      {
        id: 3,
        title: 'Finish with Minimum Total Time',
        description: 'After all reachable nodes are finalized, the answer is the maximum of finite distances.',
        visual: {
          array: [0, 2, 4, 6, 3],
          highlights: [0, 1, 2, 3],
          result: 'max distance = 6',
        },
      },
    ],
  },

  'meeting-rooms-ii': {
    title: 'Meeting Rooms II',
    keyInsight: 'Sort starts and ends; sweep with two pointers to count how many meetings overlap at any time.',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Sort Start and End Arrays',
        description: 'Start list: [0, 5, 15], end list: [10, 10, 20] after sorting.',
        visual: {
          array: ['[0,5,15]', '[10,10,20]'],
          annotations: ['starts sorted', 'ends sorted'],
        },
      },
      {
        id: 2,
        title: 'Sweep and Allocate',
        description: 'Compare current start with current end. If start < end, overlaps require one more room.',
        visual: {
          array: ['0', '5', '15', '30'],
          pointers: { start: 0, end: 0 },
          annotations: ['0 >=? 10 → new room'],
        },
      },
      {
        id: 3,
        title: 'Release and Continue',
        description: 'When a meeting ends, reuse that room by moving end pointer.',
        visual: {
          array: ['0', '5', '15', '30'],
          pointers: { start: 1, end: 1 },
          highlights: [0],
          annotations: ['Start pointer meets an end', 'Rooms can be reused'],
        },
      },
      {
        id: 4,
        title: 'Result',
        description: 'The peak concurrent count is the minimum rooms needed.',
        visual: {
          array: ['0', '5', '15', '30'],
          result: 'rooms = 2',
        },
      },
    ],
  },

  'lru-cache': {
    title: 'LRU Cache',
    keyInsight: 'Doubly linked list orders by recency; hash map gives O(1) lookup — together they make O(1) LRU',
    pattern: 'linked-list',
    steps: [
      {
        id: 1,
        title: 'Setup Empty Cache',
        description: 'Capacity = 2. Doubly linked list with head/tail sentinels. Hash map is empty.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            annotations: ['Capacity: 2', 'Map: {}', 'H ↔ T (sentinels)'],
          },
        },
      },
      {
        id: 2,
        title: 'put(1, 1)',
        description: 'Insert key=1. Add node after head sentinel. Map: {1→node}.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            highlightNodes: ['n1'],
            annotations: ['Map: {1→node}', 'Size: 1/2'],
          },
        },
      },
      {
        id: 3,
        title: 'put(2, 2)',
        description: 'Insert key=2. Add after head (most recent). Map: {1→node, 2→node}.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n2' },
              { id: 'n2', value: '2:2', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            highlightNodes: ['n2'],
            annotations: ['Map: {1, 2}', 'Size: 2/2 (full)'],
          },
        },
      },
      {
        id: 4,
        title: 'get(1) → Move to Front',
        description: 'Key 1 found via map. Remove from current position, re-insert after head.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n2' },
              { id: 'n2', value: '2:2', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            highlightNodes: ['n1'],
            annotations: ['get(1) = 1', '1 moved to front', '2 is now LRU'],
          },
        },
      },
      {
        id: 5,
        title: 'put(3, 3) — Evict LRU',
        description: 'Cache full. Evict LRU (node before tail = key 2). Insert key 3 after head.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n3' },
              { id: 'n3', value: '3:3', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            highlightNodes: ['n3'],
            annotations: ['Evicted key 2', 'Map: {1, 3}', 'Size: 2/2'],
          },
        },
      },
      {
        id: 6,
        title: 'get(2) → -1',
        description: 'Key 2 not in map (was evicted). Return -1.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n3' },
              { id: 'n3', value: '3:3', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            annotations: ['get(2) = -1', 'Key 2 was evicted'],
          },
        },
      },
      {
        id: 7,
        title: 'Final State',
        description: 'Cache holds keys 3 and 1. Key 3 is most recent, key 1 is LRU.',
        visual: {
          linkedList: {
            nodes: [
              { id: 'n0', value: 'H', next: 'n3' },
              { id: 'n3', value: '3:3', next: 'n1' },
              { id: 'n1', value: '1:1', next: 'n9' },
              { id: 'n9', value: 'T', next: null },
            ],
            pointers: { head: 'n0', tail: 'n9' },
            annotations: ['Most recent: 3', 'LRU: 1'],
          },
          result: 'O(1) get and put via map + doubly linked list',
        },
      },
    ],
  },

  // ==================== SORTING PROBLEMS ====================

  'merge-sort': {
    title: 'Merge Sort',
    keyInsight: 'Divide in half recursively, then merge sorted halves back together',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Start: Unsorted Array',
        description: 'Split the array in half recursively until single elements.',
        visual: {
          array: [38, 27, 43, 3, 9, 82, 10],
          annotations: ['Split into halves'],
        },
      },
      {
        id: 2,
        title: 'Divide Left Half',
        description: '[38, 27, 43] splits into [38] and [27, 43], then [27] and [43].',
        visual: {
          array: [38, 27, 43, 3, 9, 82, 10],
          highlights: [0, 1, 2],
          annotations: ['[38] [27] [43] \u2014 base cases'],
        },
      },
      {
        id: 3,
        title: 'Merge [27] + [43]',
        description: 'Compare front elements: 27 < 43. Result: [27, 43].',
        visual: {
          array: [38, 27, 43, 3, 9, 82, 10],
          highlights: [1, 2],
          annotations: ['27 < 43 \u2192 [27, 43]'],
        },
      },
      {
        id: 4,
        title: 'Merge [38] + [27, 43]',
        description: '27 < 38 \u2192 take 27. Then 38 < 43 \u2192 take 38. Then 43. Result: [27, 38, 43].',
        visual: {
          array: [27, 38, 43, 3, 9, 82, 10],
          highlights: [0, 1, 2],
          annotations: ['Left half sorted: [27, 38, 43]'],
        },
      },
      {
        id: 5,
        title: 'Merge Right Half Similarly',
        description: '[3, 9, 82, 10] \u2192 [3, 9] + [10, 82] \u2192 [3, 9, 10, 82].',
        visual: {
          array: [27, 38, 43, 3, 9, 10, 82],
          highlights: [3, 4, 5, 6],
          annotations: ['Right half sorted: [3, 9, 10, 82]'],
        },
      },
      {
        id: 6,
        title: 'Final Merge',
        description: 'Merge [27, 38, 43] + [3, 9, 10, 82]. Compare front elements repeatedly.',
        visual: {
          array: [3, 9, 10, 27, 38, 43, 82],
          highlights: [0, 1, 2, 3, 4, 5, 6],
          result: 'Sorted: [3, 9, 10, 27, 38, 43, 82]',
        },
      },
    ],
  },

  'quick-sort': {
    title: 'Quick Sort (Partition)',
    keyInsight: 'Partition places pivot in correct position \u2014 elements left are smaller, right are larger',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Choose Pivot',
        description: 'Pick last element (70) as pivot. Goal: put everything < 70 left, > 70 right.',
        visual: {
          array: [10, 80, 30, 90, 40, 50, 70],
          highlights: [6],
          pointers: { i: 0, j: 0 },
          annotations: ['Pivot: 70'],
        },
      },
      {
        id: 2,
        title: 'Scan: 10 < 70',
        description: '10 < pivot. Swap arr[i] with arr[j], advance i. (10 stays in place)',
        visual: {
          array: [10, 80, 30, 90, 40, 50, 70],
          highlights: [0, 6],
          pointers: { i: 1, j: 1 },
          annotations: ['10 < 70 \u2192 keep left'],
        },
      },
      {
        id: 3,
        title: 'Scan: 80 \u2265 70',
        description: '80 \u2265 pivot. Skip (j advances but i stays).',
        visual: {
          array: [10, 80, 30, 90, 40, 50, 70],
          highlights: [1, 6],
          pointers: { i: 1, j: 2 },
          annotations: ['80 \u2265 70 \u2192 skip'],
        },
      },
      {
        id: 4,
        title: 'Scan: 30 < 70',
        description: '30 < pivot. Swap 30 with 80 (swap arr[i] and arr[j]).',
        visual: {
          array: [10, 30, 80, 90, 40, 50, 70],
          highlights: [1, 2, 6],
          pointers: { i: 2, j: 3 },
          annotations: ['Swap 80 \u2194 30'],
        },
      },
      {
        id: 5,
        title: 'Continue Scanning',
        description: '90 \u2265 70 skip. 40 < 70 swap with 80. 50 < 70 swap with 90.',
        visual: {
          array: [10, 30, 40, 50, 80, 90, 70],
          highlights: [2, 3, 6],
          pointers: { i: 4, j: 6 },
          annotations: ['After all scans'],
        },
      },
      {
        id: 6,
        title: 'Place Pivot',
        description: 'Swap pivot (70) with arr[i] (80). Pivot is now at index 4 \u2014 its CORRECT position!',
        visual: {
          array: [10, 30, 40, 50, 70, 90, 80],
          highlights: [4],
          annotations: ['70 is in correct final position!', '< 70: [10,30,40,50]', '> 70: [90,80]'],
        },
      },
      {
        id: 7,
        title: 'Recurse Both Sides',
        description: 'Recursively quicksort [10, 30, 40, 50] and [90, 80]. Each partition places one more element.',
        visual: {
          array: [10, 30, 40, 50, 70, 80, 90],
          highlights: [0, 1, 2, 3, 4, 5, 6],
          result: 'Sorted: [10, 30, 40, 50, 70, 80, 90]',
        },
      },
    ],
  },

  'merge-intervals': {
    title: 'Merge Intervals',
    keyInsight: 'Sort by start time, then merge overlapping by comparing prev.end with curr.start',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Input Intervals',
        description: 'Unsorted intervals: [[1,3], [2,6], [8,10], [15,18]]',
        visual: {
          array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
          annotations: ['Already sorted by start in this example'],
        },
      },
      {
        id: 2,
        title: 'Start with First',
        description: 'Add [1,3] to result. Now check next interval.',
        visual: {
          array: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
          highlights: [0],
          annotations: ['Result: [[1,3]]'],
        },
      },
      {
        id: 3,
        title: '[2,6] Overlaps with [1,3]',
        description: '2 \u2264 3 (curr.start \u2264 prev.end) \u2192 overlap! Merge to [1, max(3,6)] = [1,6].',
        visual: {
          array: ['[1,6]', '[2,6]', '[8,10]', '[15,18]'],
          highlights: [0, 1],
          annotations: ['Merged: [1,3] + [2,6] = [1,6]'],
        },
      },
      {
        id: 4,
        title: '[8,10] No Overlap',
        description: '8 > 6 (curr.start > prev.end) \u2192 no overlap. Add [8,10] as new.',
        visual: {
          array: ['[1,6]', '[8,10]', '[15,18]'],
          highlights: [1],
          annotations: ['Result: [[1,6], [8,10]]'],
        },
      },
      {
        id: 5,
        title: '[15,18] No Overlap',
        description: '15 > 10 \u2192 no overlap. Add [15,18].',
        visual: {
          array: ['[1,6]', '[8,10]', '[15,18]'],
          highlights: [0, 1, 2],
          result: 'Merged: [[1,6], [8,10], [15,18]]',
        },
      },
    ],
  },

  'kth-largest-element': {
    title: 'Kth Largest (QuickSelect)',
    keyInsight: 'Partition once, then only recurse into the side containing the target index',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Setup',
        description: 'Find 2nd largest in [3, 2, 1, 5, 6, 4]. That\'s index 4 in sorted order.',
        visual: {
          array: [3, 2, 1, 5, 6, 4],
          annotations: ['k=2, target index = 6-2 = 4'],
        },
      },
      {
        id: 2,
        title: 'First Partition (pivot=4)',
        description: 'Partition around 4. Elements < 4 go left, \u2265 4 go right.',
        visual: {
          array: [3, 2, 1, 4, 6, 5],
          highlights: [3],
          annotations: ['Pivot 4 at index 3', 'Target is index 4 \u2192 go RIGHT'],
        },
      },
      {
        id: 3,
        title: 'Recurse Right [6, 5]',
        description: 'Only search [6, 5]. Partition around 5.',
        visual: {
          array: [3, 2, 1, 4, 5, 6],
          highlights: [4],
          annotations: ['Pivot 5 at index 4', 'Index 4 == target!'],
        },
      },
      {
        id: 4,
        title: 'Found!',
        description: 'Pivot landed at index 4 = our target. The 2nd largest is 5.',
        visual: {
          array: [3, 2, 1, 4, 5, 6],
          highlights: [4],
          result: '2nd largest = 5',
        },
      },
    ],
  },

  'largest-number': {
    title: 'Largest Number',
    keyInsight: 'Compare by concatenation: "9"+"34"="934" vs "34"+"9"="349" \u2192 9 comes first',
    pattern: 'sorting',
    steps: [
      {
        id: 1,
        title: 'Input Numbers',
        description: 'Arrange [3, 30, 34, 5, 9] to form the largest number.',
        visual: {
          array: [3, 30, 34, 5, 9],
          annotations: ['Convert to strings for comparison'],
        },
      },
      {
        id: 2,
        title: 'Compare 3 vs 30',
        description: '"330" vs "303". 330 > 303, so 3 comes before 30.',
        visual: {
          array: ['3', '30', '34', '5', '9'],
          highlights: [0, 1],
          annotations: ['"3"+"30"="330" > "30"+"3"="303"'],
        },
      },
      {
        id: 3,
        title: 'Compare 5 vs 9',
        description: '"59" vs "95". 95 > 59, so 9 comes before 5.',
        visual: {
          array: ['3', '30', '34', '5', '9'],
          highlights: [3, 4],
          annotations: ['"9"+"5"="95" > "5"+"9"="59"'],
        },
      },
      {
        id: 4,
        title: 'After Full Sort',
        description: 'Custom comparator sorts: [9, 5, 34, 3, 30].',
        visual: {
          array: ['9', '5', '34', '3', '30'],
          highlights: [0, 1, 2, 3, 4],
          annotations: ['Each pair: ab > ba means a first'],
        },
      },
      {
        id: 5,
        title: 'Join Result',
        description: 'Concatenate: "9" + "5" + "34" + "3" + "30" = "9534330".',
        visual: {
          array: ['9', '5', '34', '3', '30'],
          result: '"9534330"',
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
