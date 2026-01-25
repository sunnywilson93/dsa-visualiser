import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './TwoPointersViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'converging' | 'same-direction' | 'partition'
type Phase = 'init' | 'compare' | 'move' | 'done'

interface TwoPointerStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  pointers: {
    left: number
    right: number
    mid?: number
  }
  decision?: {
    condition: string
    conditionMet: boolean
    action: string
  }
  array: (number | string)[]
  highlightedCells?: number[]
  output?: string[]
}

interface TwoPointerExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: TwoPointerStep[]
  insight: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const variantInfo: Record<Variant, { label: string; description: string }> = {
  converging: {
    label: 'Converging',
    description: 'Two pointers moving towards each other from opposite ends'
  },
  'same-direction': {
    label: 'Same Direction',
    description: 'Two pointers moving in the same direction (slow/fast)'
  },
  partition: {
    label: 'Partition',
    description: 'Pointers partitioning array into regions'
  }
}

const examples: Record<Variant, Record<Level, TwoPointerExample[]>> = {
  converging: {
    beginner: [
      {
        id: 'two-sum-ii',
        title: 'Two Sum II',
        variant: 'converging',
        code: [
          'function twoSum(nums, target) {',
          '  let left = 0',
          '  let right = nums.length - 1',
          '',
          '  while (left < right) {',
          '    const sum = nums[left] + nums[right]',
          '',
          '    if (sum === target) {',
          '      return [left, right]',
          '    } else if (sum < target) {',
          '      left++',
          '    } else {',
          '      right--',
          '    }',
          '  }',
          '  return []',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'We need to find two numbers in this SORTED array that add up to 9. Two pointers let us search efficiently.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [1, 3, 4, 5, 7, 10, 11]
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at the start (index 0, value 1).',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0]
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at the end (index 6, value 11).',
            phase: 'init',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6]
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Check: is left (0) < right (6)? Yes, so we enter the loop.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6]
          },
          {
            id: 4,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[6] = 1 + 11 = 12.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is 12 === 9?',
              conditionMet: false,
              action: 'No match, check if too large or small'
            }
          },
          {
            id: 5,
            codeLine: 9,
            description: 'Sum (12) > target (9). Since array is sorted, we need a smaller sum.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is 12 > 9?',
              conditionMet: true,
              action: 'Move right pointer left to decrease sum'
            }
          },
          {
            id: 6,
            codeLine: 12,
            description: 'Move right pointer left: right-- (6 to 5, now pointing to 10).',
            phase: 'move',
            pointers: { left: 0, right: 5 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 5]
          },
          {
            id: 7,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[5] = 1 + 10 = 11.',
            phase: 'compare',
            pointers: { left: 0, right: 5 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 5],
            decision: {
              condition: 'Is 11 > 9?',
              conditionMet: true,
              action: 'Still too large, move right pointer left again'
            }
          },
          {
            id: 8,
            codeLine: 12,
            description: 'Move right pointer left: right-- (5 to 4, now pointing to 7).',
            phase: 'move',
            pointers: { left: 0, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 4]
          },
          {
            id: 9,
            codeLine: 5,
            description: 'Calculate sum: nums[0] + nums[4] = 1 + 7 = 8.',
            phase: 'compare',
            pointers: { left: 0, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [0, 4],
            decision: {
              condition: 'Is 8 < 9?',
              conditionMet: true,
              action: 'Too small now, move left pointer right to increase sum'
            }
          },
          {
            id: 10,
            codeLine: 10,
            description: 'Move left pointer right: left++ (0 to 1, now pointing to 3).',
            phase: 'move',
            pointers: { left: 1, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 4]
          },
          {
            id: 11,
            codeLine: 5,
            description: 'Calculate sum: nums[1] + nums[4] = 3 + 7 = 10.',
            phase: 'compare',
            pointers: { left: 1, right: 4 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 4],
            decision: {
              condition: 'Is 10 > 9?',
              conditionMet: true,
              action: 'Too large, move right pointer left'
            }
          },
          {
            id: 12,
            codeLine: 12,
            description: 'Move right pointer left: right-- (4 to 3, now pointing to 5).',
            phase: 'move',
            pointers: { left: 1, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 3]
          },
          {
            id: 13,
            codeLine: 5,
            description: 'Calculate sum: nums[1] + nums[3] = 3 + 5 = 8.',
            phase: 'compare',
            pointers: { left: 1, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [1, 3],
            decision: {
              condition: 'Is 8 < 9?',
              conditionMet: true,
              action: 'Too small, move left pointer right'
            }
          },
          {
            id: 14,
            codeLine: 10,
            description: 'Move left pointer right: left++ (1 to 2, now pointing to 4).',
            phase: 'move',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3]
          },
          {
            id: 15,
            codeLine: 5,
            description: 'Calculate sum: nums[2] + nums[3] = 4 + 5 = 9. This equals our target!',
            phase: 'compare',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3],
            decision: {
              condition: 'Is 9 === 9?',
              conditionMet: true,
              action: 'Found the pair!'
            }
          },
          {
            id: 16,
            codeLine: 8,
            description: 'Return [2, 3]. Found indices of elements that sum to target!',
            phase: 'done',
            pointers: { left: 2, right: 3 },
            array: [1, 3, 4, 5, 7, 10, 11],
            highlightedCells: [2, 3],
            output: ['[2, 3]']
          }
        ],
        insight: 'Two pointers on sorted array avoids O(n^2) nested loops - we eliminate candidates from both ends simultaneously.'
      },
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        variant: 'converging',
        code: [
          'function isPalindrome(s) {',
          '  let left = 0',
          '  let right = s.length - 1',
          '',
          '  while (left < right) {',
          '    if (s[left] !== s[right]) {',
          '      return false',
          '    }',
          '    left++',
          '    right--',
          '  }',
          '  return true',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Check if "racecar" is a palindrome. A palindrome reads the same forwards and backwards.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at start (index 0, character "r").',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0]
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at end (index 6, character "r").',
            phase: 'init',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6]
          },
          {
            id: 3,
            codeLine: 4,
            description: 'Check: is left (0) < right (6)? Yes, enter the loop.',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6]
          },
          {
            id: 4,
            codeLine: 5,
            description: 'Compare characters: s[0]="r" vs s[6]="r".',
            phase: 'compare',
            pointers: { left: 0, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [0, 6],
            decision: {
              condition: 'Is "r" === "r"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 5,
            codeLine: 8,
            description: 'Move left pointer right: left++ (0 to 1).',
            phase: 'move',
            pointers: { left: 1, right: 6 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1]
          },
          {
            id: 6,
            codeLine: 9,
            description: 'Move right pointer left: right-- (6 to 5).',
            phase: 'move',
            pointers: { left: 1, right: 5 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1, 5]
          },
          {
            id: 7,
            codeLine: 5,
            description: 'Compare characters: s[1]="a" vs s[5]="a".',
            phase: 'compare',
            pointers: { left: 1, right: 5 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [1, 5],
            decision: {
              condition: 'Is "a" === "a"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 8,
            codeLine: 8,
            description: 'Move pointers: left++ (1 to 2), right-- (5 to 4).',
            phase: 'move',
            pointers: { left: 2, right: 4 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [2, 4]
          },
          {
            id: 9,
            codeLine: 5,
            description: 'Compare characters: s[2]="c" vs s[4]="c".',
            phase: 'compare',
            pointers: { left: 2, right: 4 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [2, 4],
            decision: {
              condition: 'Is "c" === "c"?',
              conditionMet: true,
              action: 'Match! Move both pointers inward'
            }
          },
          {
            id: 10,
            codeLine: 8,
            description: 'Move pointers: left++ (2 to 3), right-- (4 to 3). They meet at the center!',
            phase: 'move',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3]
          },
          {
            id: 11,
            codeLine: 4,
            description: 'Check: is left (3) < right (3)? No! Pointers have met or crossed.',
            phase: 'compare',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3]
          },
          {
            id: 12,
            codeLine: 11,
            description: 'All character pairs matched! Return true - "racecar" is a palindrome.',
            phase: 'done',
            pointers: { left: 3, right: 3 },
            array: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
            highlightedCells: [3],
            output: ['true']
          }
        ],
        insight: 'Converging pointers check symmetry in O(n) time - we only need to check each position once from both ends.'
      }
    ],
    intermediate: [
      {
        id: 'container-most-water',
        title: 'Container With Most Water',
        variant: 'converging',
        code: [
          'function maxArea(height) {',
          '  let left = 0',
          '  let right = height.length - 1',
          '  let maxArea = 0',
          '',
          '  while (left < right) {',
          '    const width = right - left',
          '    const h = Math.min(height[left], height[right])',
          '    const area = width * h',
          '    maxArea = Math.max(maxArea, area)',
          '',
          '    if (height[left] < height[right]) {',
          '      left++',
          '    } else {',
          '      right--',
          '    }',
          '  }',
          '  return maxArea',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Find max water area between two heights. Width = distance between lines, height = shorter of the two.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            output: ['maxArea = 0']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at start (index 0, height 1).',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [0],
            output: ['maxArea = 0']
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at end (index 8, height 7).',
            phase: 'init',
            pointers: { left: 0, right: 8 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [0, 8],
            output: ['maxArea = 0']
          },
          {
            id: 3,
            codeLine: 5,
            description: 'Check: left (0) < right (8)? Yes, enter loop.',
            phase: 'compare',
            pointers: { left: 0, right: 8 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [0, 8],
            output: ['maxArea = 0']
          },
          {
            id: 4,
            codeLine: 8,
            description: 'Calculate area: width=8, min(1,7)=1, area=8*1=8. Update maxArea to 8.',
            phase: 'compare',
            pointers: { left: 0, right: 8 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [0, 8],
            output: ['maxArea = 8'],
            decision: {
              condition: 'Is height[left]=1 < height[right]=7?',
              conditionMet: true,
              action: 'Move left pointer right (shorter side limits area)'
            }
          },
          {
            id: 5,
            codeLine: 12,
            description: 'Move left pointer right: left++ (0 to 1, now height 8).',
            phase: 'move',
            pointers: { left: 1, right: 8 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 8],
            output: ['maxArea = 8']
          },
          {
            id: 6,
            codeLine: 8,
            description: 'Calculate area: width=7, min(8,7)=7, area=7*7=49. Update maxArea to 49!',
            phase: 'compare',
            pointers: { left: 1, right: 8 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 8],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=7?',
              conditionMet: false,
              action: 'Move right pointer left (right side is shorter)'
            }
          },
          {
            id: 7,
            codeLine: 14,
            description: 'Move right pointer left: right-- (8 to 7, now height 3).',
            phase: 'move',
            pointers: { left: 1, right: 7 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 7],
            output: ['maxArea = 49']
          },
          {
            id: 8,
            codeLine: 8,
            description: 'Calculate area: width=6, min(8,3)=3, area=6*3=18. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 7 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 7],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=3?',
              conditionMet: false,
              action: 'Move right pointer left (right side is shorter)'
            }
          },
          {
            id: 9,
            codeLine: 14,
            description: 'Move right pointer left: right-- (7 to 6, now height 8).',
            phase: 'move',
            pointers: { left: 1, right: 6 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 6],
            output: ['maxArea = 49']
          },
          {
            id: 10,
            codeLine: 8,
            description: 'Calculate area: width=5, min(8,8)=8, area=5*8=40. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 6 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 6],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=8?',
              conditionMet: false,
              action: 'Heights equal, move right pointer left (either works)'
            }
          },
          {
            id: 11,
            codeLine: 14,
            description: 'Move right pointer left: right-- (6 to 5, now height 4).',
            phase: 'move',
            pointers: { left: 1, right: 5 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 5],
            output: ['maxArea = 49']
          },
          {
            id: 12,
            codeLine: 8,
            description: 'Calculate area: width=4, min(8,4)=4, area=4*4=16. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 5 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 5],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=4?',
              conditionMet: false,
              action: 'Move right pointer left'
            }
          },
          {
            id: 13,
            codeLine: 14,
            description: 'Move right pointer left: right-- (5 to 4, now height 5).',
            phase: 'move',
            pointers: { left: 1, right: 4 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 4],
            output: ['maxArea = 49']
          },
          {
            id: 14,
            codeLine: 8,
            description: 'Calculate area: width=3, min(8,5)=5, area=3*5=15. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 4 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 4],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=5?',
              conditionMet: false,
              action: 'Move right pointer left'
            }
          },
          {
            id: 15,
            codeLine: 14,
            description: 'Move right pointer left: right-- (4 to 3, now height 2).',
            phase: 'move',
            pointers: { left: 1, right: 3 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 3],
            output: ['maxArea = 49']
          },
          {
            id: 16,
            codeLine: 8,
            description: 'Calculate area: width=2, min(8,2)=2, area=2*2=4. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 3 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 3],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=2?',
              conditionMet: false,
              action: 'Move right pointer left'
            }
          },
          {
            id: 17,
            codeLine: 14,
            description: 'Move right pointer left: right-- (3 to 2, now height 6).',
            phase: 'move',
            pointers: { left: 1, right: 2 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 2],
            output: ['maxArea = 49']
          },
          {
            id: 18,
            codeLine: 8,
            description: 'Calculate area: width=1, min(8,6)=6, area=1*6=6. maxArea stays 49.',
            phase: 'compare',
            pointers: { left: 1, right: 2 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1, 2],
            output: ['maxArea = 49'],
            decision: {
              condition: 'Is height[left]=8 < height[right]=6?',
              conditionMet: false,
              action: 'Move right pointer left'
            }
          },
          {
            id: 19,
            codeLine: 14,
            description: 'Move right pointer left: right-- (2 to 1). Pointers meet!',
            phase: 'move',
            pointers: { left: 1, right: 1 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1],
            output: ['maxArea = 49']
          },
          {
            id: 20,
            codeLine: 5,
            description: 'Check: left (1) < right (1)? No! Loop terminates.',
            phase: 'compare',
            pointers: { left: 1, right: 1 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1],
            output: ['maxArea = 49']
          },
          {
            id: 21,
            codeLine: 17,
            description: 'Return maxArea = 49. Best container was between indices 1 (height 8) and 8 (height 7).',
            phase: 'done',
            pointers: { left: 1, right: 1 },
            array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlightedCells: [1],
            output: ['maxArea = 49', 'return 49']
          }
        ],
        insight: 'Moving the shorter side gives a chance for larger area; moving the taller side can only decrease or maintain the area since height is limited by the shorter side.'
      },
      {
        id: '3sum',
        title: '3Sum',
        variant: 'converging',
        code: [
          'function threeSum(nums) {',
          '  nums.sort((a, b) => a - b)',
          '  const result = []',
          '',
          '  for (let i = 0; i < nums.length - 2; i++) {',
          '    if (i > 0 && nums[i] === nums[i - 1]) continue',
          '    let left = i + 1',
          '    let right = nums.length - 1',
          '',
          '    while (left < right) {',
          '      const sum = nums[i] + nums[left] + nums[right]',
          '      if (sum === 0) {',
          '        result.push([nums[i], nums[left], nums[right]])',
          '        left++',
          '        while (left < right && nums[left] === nums[left-1]) left++',
          '      } else if (sum < 0) {',
          '        left++',
          '      } else {',
          '        right--',
          '      }',
          '    }',
          '  }',
          '  return result',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Find all unique triplets that sum to zero. We fix one element and use two pointers for the other two.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [-1, 0, 1, 2, -1, -4],
            output: ['Input: [-1, 0, 1, 2, -1, -4]']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Sort the array first. Sorting enables the two pointer approach and helps skip duplicates.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [-4, -1, -1, 0, 1, 2],
            output: ['Sorted: [-4, -1, -1, 0, 1, 2]']
          },
          {
            id: 2,
            codeLine: 4,
            description: 'Fix i=0 (value -4). Now find two numbers in remaining array that sum to 4 (to make total 0).',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0],
            output: ['Fixed: nums[0] = -4', 'Need: left + right = 4']
          },
          {
            id: 3,
            codeLine: 6,
            description: 'Initialize left pointer at i+1=1 (value -1) and right at end=5 (value 2).',
            phase: 'init',
            pointers: { left: 1, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 1, 5],
            output: ['Fixed: -4', 'left=1, right=5']
          },
          {
            id: 4,
            codeLine: 10,
            description: 'Calculate sum: nums[0] + nums[1] + nums[5] = -4 + (-1) + 2 = -3.',
            phase: 'compare',
            pointers: { left: 1, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 1, 5],
            output: ['Sum = -4 + (-1) + 2 = -3'],
            decision: {
              condition: 'Is -3 < 0?',
              conditionMet: true,
              action: 'Sum too small, move left pointer right'
            }
          },
          {
            id: 5,
            codeLine: 16,
            description: 'Move left pointer right: left++ (1 to 2, now value -1).',
            phase: 'move',
            pointers: { left: 2, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 2, 5],
            output: ['Sum = -4 + (-1) + 2 = -3']
          },
          {
            id: 6,
            codeLine: 10,
            description: 'Calculate sum: -4 + (-1) + 2 = -3. Still too small.',
            phase: 'compare',
            pointers: { left: 2, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 2, 5],
            output: ['Sum = -4 + (-1) + 2 = -3'],
            decision: {
              condition: 'Is -3 < 0?',
              conditionMet: true,
              action: 'Sum too small, move left pointer right'
            }
          },
          {
            id: 7,
            codeLine: 16,
            description: 'Move left pointer right: left++ (2 to 3, now value 0).',
            phase: 'move',
            pointers: { left: 3, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 3, 5],
            output: ['Sum = -4 + 0 + 2 = -2']
          },
          {
            id: 8,
            codeLine: 10,
            description: 'Calculate sum: -4 + 0 + 2 = -2. Still too small.',
            phase: 'compare',
            pointers: { left: 3, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 3, 5],
            output: ['Sum = -4 + 0 + 2 = -2'],
            decision: {
              condition: 'Is -2 < 0?',
              conditionMet: true,
              action: 'Sum too small, move left pointer right'
            }
          },
          {
            id: 9,
            codeLine: 16,
            description: 'Move left pointer right: left++ (3 to 4, now value 1).',
            phase: 'move',
            pointers: { left: 4, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 4, 5],
            output: ['Sum = -4 + 1 + 2 = -1']
          },
          {
            id: 10,
            codeLine: 10,
            description: 'Calculate sum: -4 + 1 + 2 = -1. Still too small, but left will meet right.',
            phase: 'compare',
            pointers: { left: 4, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 4, 5],
            output: ['Sum = -4 + 1 + 2 = -1'],
            decision: {
              condition: 'Is -1 < 0?',
              conditionMet: true,
              action: 'Sum too small, move left pointer right'
            }
          },
          {
            id: 11,
            codeLine: 16,
            description: 'left++ makes left=5, which equals right. Inner loop ends for i=0.',
            phase: 'move',
            pointers: { left: 5, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [0, 5],
            output: ['No triplet found with -4']
          },
          {
            id: 12,
            codeLine: 4,
            description: 'Move to i=1 (value -1). Find two numbers that sum to 1.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1],
            output: ['Fixed: nums[1] = -1', 'Need: left + right = 1']
          },
          {
            id: 13,
            codeLine: 6,
            description: 'Initialize left=2 (value -1) and right=5 (value 2).',
            phase: 'init',
            pointers: { left: 2, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 2, 5],
            output: ['Fixed: -1', 'left=2, right=5']
          },
          {
            id: 14,
            codeLine: 10,
            description: 'Calculate sum: -1 + (-1) + 2 = 0. Found a triplet!',
            phase: 'compare',
            pointers: { left: 2, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 2, 5],
            output: ['Sum = -1 + (-1) + 2 = 0'],
            decision: {
              condition: 'Is 0 === 0?',
              conditionMet: true,
              action: 'Found triplet! Add to result, move left and skip duplicates'
            }
          },
          {
            id: 15,
            codeLine: 12,
            description: 'Add [-1, -1, 2] to result. Move left pointer and skip duplicates.',
            phase: 'move',
            pointers: { left: 3, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 3, 5],
            output: ['Result: [[-1, -1, 2]]', 'left moved to 3']
          },
          {
            id: 16,
            codeLine: 10,
            description: 'Calculate sum: -1 + 0 + 2 = 1. Too large.',
            phase: 'compare',
            pointers: { left: 3, right: 5 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 3, 5],
            output: ['Sum = -1 + 0 + 2 = 1'],
            decision: {
              condition: 'Is 1 > 0?',
              conditionMet: true,
              action: 'Sum too large, move right pointer left'
            }
          },
          {
            id: 17,
            codeLine: 18,
            description: 'Move right pointer left: right-- (5 to 4, now value 1).',
            phase: 'move',
            pointers: { left: 3, right: 4 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 3, 4],
            output: ['Result: [[-1, -1, 2]]']
          },
          {
            id: 18,
            codeLine: 10,
            description: 'Calculate sum: -1 + 0 + 1 = 0. Found another triplet!',
            phase: 'compare',
            pointers: { left: 3, right: 4 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 3, 4],
            output: ['Sum = -1 + 0 + 1 = 0'],
            decision: {
              condition: 'Is 0 === 0?',
              conditionMet: true,
              action: 'Found triplet! Add to result'
            }
          },
          {
            id: 19,
            codeLine: 12,
            description: 'Add [-1, 0, 1] to result. Move pointers.',
            phase: 'move',
            pointers: { left: 4, right: 4 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1, 4],
            output: ['Result: [[-1, -1, 2], [-1, 0, 1]]']
          },
          {
            id: 20,
            codeLine: 9,
            description: 'left=4, right=4. Pointers meet, inner loop ends for i=1.',
            phase: 'compare',
            pointers: { left: 4, right: 4 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [1],
            output: ['Result: [[-1, -1, 2], [-1, 0, 1]]']
          },
          {
            id: 21,
            codeLine: 5,
            description: 'i=2 has value -1, same as i=1. Skip to avoid duplicate triplets.',
            phase: 'compare',
            pointers: { left: -1, right: -1 },
            array: [-4, -1, -1, 0, 1, 2],
            highlightedCells: [2],
            output: ['Skip: nums[2] === nums[1]'],
            decision: {
              condition: 'Is nums[2] === nums[1]?',
              conditionMet: true,
              action: 'Skip duplicate to avoid duplicate triplets'
            }
          },
          {
            id: 22,
            codeLine: 4,
            description: 'Remaining i values (3,4) would only have 1-2 elements right, not enough for triplets.',
            phase: 'done',
            pointers: { left: -1, right: -1 },
            array: [-4, -1, -1, 0, 1, 2],
            output: ['Result: [[-1, -1, 2], [-1, 0, 1]]', 'return result']
          }
        ],
        insight: 'Fix one element, use two pointers for the other two. Sorting enables O(n^2) instead of O(n^3) and makes duplicate skipping simple.'
      }
    ],
    advanced: [
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        variant: 'converging',
        code: [
          'function trap(height) {',
          '  let left = 0',
          '  let right = height.length - 1',
          '  let leftMax = 0, rightMax = 0',
          '  let total = 0',
          '',
          '  while (left < right) {',
          '    if (height[left] < height[right]) {',
          '      if (height[left] >= leftMax) {',
          '        leftMax = height[left]',
          '      } else {',
          '        total += leftMax - height[left]',
          '      }',
          '      left++',
          '    } else {',
          '      if (height[right] >= rightMax) {',
          '        rightMax = height[right]',
          '      } else {',
          '        total += rightMax - height[right]',
          '      }',
          '      right--',
          '    }',
          '  }',
          '  return total',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Calculate total water trapped between bars. Water at position i = min(leftMax, rightMax) - height[i].',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            output: ['Input: heights = [0,1,0,2,1,0,1,3,2,1,2,1]']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize left pointer at start (index 0, height 0).',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0],
            output: ['left=0']
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize right pointer at end (index 11, height 1).',
            phase: 'init',
            pointers: { left: 0, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0, 11],
            output: ['left=0, right=11']
          },
          {
            id: 3,
            codeLine: 3,
            description: 'Initialize leftMax=0, rightMax=0, total=0. Track max heights seen from each side.',
            phase: 'init',
            pointers: { left: 0, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0, 11],
            output: ['leftMax=0, rightMax=0', 'total=0']
          },
          {
            id: 4,
            codeLine: 6,
            description: 'Check: left (0) < right (11)? Yes, enter loop.',
            phase: 'compare',
            pointers: { left: 0, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0, 11],
            output: ['leftMax=0, rightMax=0', 'total=0']
          },
          {
            id: 5,
            codeLine: 7,
            description: 'Compare heights: height[left]=0 vs height[right]=1.',
            phase: 'compare',
            pointers: { left: 0, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0, 11],
            output: ['leftMax=0, rightMax=0', 'total=0'],
            decision: {
              condition: 'Is height[left]=0 < height[right]=1?',
              conditionMet: true,
              action: 'Process left side (shorter side is bounded by taller right)'
            }
          },
          {
            id: 6,
            codeLine: 8,
            description: 'Check if height[left]=0 >= leftMax=0. Yes! Update leftMax.',
            phase: 'compare',
            pointers: { left: 0, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [0],
            output: ['leftMax=0 (updated)', 'rightMax=0', 'total=0', 'No water at index 0 (height equals leftMax)']
          },
          {
            id: 7,
            codeLine: 13,
            description: 'Move left pointer right: left++ (0 to 1).',
            phase: 'move',
            pointers: { left: 1, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [1, 11],
            output: ['leftMax=0, rightMax=0', 'total=0']
          },
          {
            id: 8,
            codeLine: 7,
            description: 'Compare heights: height[left]=1 vs height[right]=1.',
            phase: 'compare',
            pointers: { left: 1, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [1, 11],
            output: ['leftMax=0, rightMax=0', 'total=0'],
            decision: {
              condition: 'Is height[left]=1 < height[right]=1?',
              conditionMet: false,
              action: 'Heights equal, process right side'
            }
          },
          {
            id: 9,
            codeLine: 15,
            description: 'Check if height[right]=1 >= rightMax=0. Yes! Update rightMax to 1.',
            phase: 'compare',
            pointers: { left: 1, right: 11 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [11],
            output: ['leftMax=0', 'rightMax=1 (updated)', 'total=0', 'No water at index 11']
          },
          {
            id: 10,
            codeLine: 20,
            description: 'Move right pointer left: right-- (11 to 10).',
            phase: 'move',
            pointers: { left: 1, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [1, 10],
            output: ['leftMax=0, rightMax=1', 'total=0']
          },
          {
            id: 11,
            codeLine: 7,
            description: 'Compare: height[left]=1 < height[right]=2.',
            phase: 'compare',
            pointers: { left: 1, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [1, 10],
            output: ['leftMax=0, rightMax=1', 'total=0'],
            decision: {
              condition: 'Is height[left]=1 < height[right]=2?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 12,
            codeLine: 8,
            description: 'height[left]=1 >= leftMax=0? Yes! Update leftMax to 1.',
            phase: 'compare',
            pointers: { left: 1, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [1],
            output: ['leftMax=1 (updated)', 'rightMax=1', 'total=0', 'No water at index 1']
          },
          {
            id: 13,
            codeLine: 13,
            description: 'Move left: left++ (1 to 2).',
            phase: 'move',
            pointers: { left: 2, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [2, 10],
            output: ['leftMax=1, rightMax=1', 'total=0']
          },
          {
            id: 14,
            codeLine: 7,
            description: 'Compare: height[left]=0 < height[right]=2.',
            phase: 'compare',
            pointers: { left: 2, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [2, 10],
            output: ['leftMax=1, rightMax=1', 'total=0'],
            decision: {
              condition: 'Is height[left]=0 < height[right]=2?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 15,
            codeLine: 10,
            description: 'height[left]=0 < leftMax=1. Water can be trapped! Add leftMax - height = 1 - 0 = 1.',
            phase: 'compare',
            pointers: { left: 2, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [2],
            output: ['leftMax=1, rightMax=1', 'Water at index 2: 1-0 = 1', 'total=1']
          },
          {
            id: 16,
            codeLine: 13,
            description: 'Move left: left++ (2 to 3).',
            phase: 'move',
            pointers: { left: 3, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 10],
            output: ['leftMax=1, rightMax=1', 'total=1']
          },
          {
            id: 17,
            codeLine: 7,
            description: 'Compare: height[left]=2 < height[right]=2? No, process right.',
            phase: 'compare',
            pointers: { left: 3, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 10],
            output: ['leftMax=1, rightMax=1', 'total=1'],
            decision: {
              condition: 'Is height[left]=2 < height[right]=2?',
              conditionMet: false,
              action: 'Process right side'
            }
          },
          {
            id: 18,
            codeLine: 15,
            description: 'height[right]=2 >= rightMax=1? Yes! Update rightMax to 2.',
            phase: 'compare',
            pointers: { left: 3, right: 10 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [10],
            output: ['leftMax=1', 'rightMax=2 (updated)', 'total=1', 'No water at index 10']
          },
          {
            id: 19,
            codeLine: 20,
            description: 'Move right: right-- (10 to 9).',
            phase: 'move',
            pointers: { left: 3, right: 9 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 9],
            output: ['leftMax=1, rightMax=2', 'total=1']
          },
          {
            id: 20,
            codeLine: 7,
            description: 'Compare: height[left]=2 < height[right]=1? No.',
            phase: 'compare',
            pointers: { left: 3, right: 9 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 9],
            output: ['leftMax=1, rightMax=2', 'total=1'],
            decision: {
              condition: 'Is height[left]=2 < height[right]=1?',
              conditionMet: false,
              action: 'Process right side'
            }
          },
          {
            id: 21,
            codeLine: 17,
            description: 'height[right]=1 < rightMax=2. Trap water! Add 2 - 1 = 1.',
            phase: 'compare',
            pointers: { left: 3, right: 9 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [9],
            output: ['leftMax=1, rightMax=2', 'Water at index 9: 2-1 = 1', 'total=2']
          },
          {
            id: 22,
            codeLine: 20,
            description: 'Move right: right-- (9 to 8).',
            phase: 'move',
            pointers: { left: 3, right: 8 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 8],
            output: ['leftMax=1, rightMax=2', 'total=2']
          },
          {
            id: 23,
            codeLine: 7,
            description: 'Compare: height[left]=2 < height[right]=2? No.',
            phase: 'compare',
            pointers: { left: 3, right: 8 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 8],
            output: ['leftMax=1, rightMax=2', 'total=2'],
            decision: {
              condition: 'Is height[left]=2 < height[right]=2?',
              conditionMet: false,
              action: 'Process right side'
            }
          },
          {
            id: 24,
            codeLine: 15,
            description: 'height[right]=2 >= rightMax=2? Yes! rightMax stays 2. No water.',
            phase: 'compare',
            pointers: { left: 3, right: 8 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [8],
            output: ['leftMax=1, rightMax=2', 'total=2', 'No water at index 8']
          },
          {
            id: 25,
            codeLine: 20,
            description: 'Move right: right-- (8 to 7).',
            phase: 'move',
            pointers: { left: 3, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 7],
            output: ['leftMax=1, rightMax=2', 'total=2']
          },
          {
            id: 26,
            codeLine: 7,
            description: 'Compare: height[left]=2 < height[right]=3? Yes.',
            phase: 'compare',
            pointers: { left: 3, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3, 7],
            output: ['leftMax=1, rightMax=2', 'total=2'],
            decision: {
              condition: 'Is height[left]=2 < height[right]=3?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 27,
            codeLine: 8,
            description: 'height[left]=2 >= leftMax=1? Yes! Update leftMax to 2.',
            phase: 'compare',
            pointers: { left: 3, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [3],
            output: ['leftMax=2 (updated)', 'rightMax=2', 'total=2', 'No water at index 3']
          },
          {
            id: 28,
            codeLine: 13,
            description: 'Move left: left++ (3 to 4).',
            phase: 'move',
            pointers: { left: 4, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [4, 7],
            output: ['leftMax=2, rightMax=2', 'total=2']
          },
          {
            id: 29,
            codeLine: 7,
            description: 'Compare: height[left]=1 < height[right]=3? Yes.',
            phase: 'compare',
            pointers: { left: 4, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [4, 7],
            output: ['leftMax=2, rightMax=2', 'total=2'],
            decision: {
              condition: 'Is height[left]=1 < height[right]=3?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 30,
            codeLine: 10,
            description: 'height[left]=1 < leftMax=2. Trap water! Add 2 - 1 = 1.',
            phase: 'compare',
            pointers: { left: 4, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [4],
            output: ['leftMax=2, rightMax=2', 'Water at index 4: 2-1 = 1', 'total=3']
          },
          {
            id: 31,
            codeLine: 13,
            description: 'Move left: left++ (4 to 5).',
            phase: 'move',
            pointers: { left: 5, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [5, 7],
            output: ['leftMax=2, rightMax=2', 'total=3']
          },
          {
            id: 32,
            codeLine: 7,
            description: 'Compare: height[left]=0 < height[right]=3? Yes.',
            phase: 'compare',
            pointers: { left: 5, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [5, 7],
            output: ['leftMax=2, rightMax=2', 'total=3'],
            decision: {
              condition: 'Is height[left]=0 < height[right]=3?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 33,
            codeLine: 10,
            description: 'height[left]=0 < leftMax=2. Trap water! Add 2 - 0 = 2.',
            phase: 'compare',
            pointers: { left: 5, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [5],
            output: ['leftMax=2, rightMax=2', 'Water at index 5: 2-0 = 2', 'total=5']
          },
          {
            id: 34,
            codeLine: 13,
            description: 'Move left: left++ (5 to 6).',
            phase: 'move',
            pointers: { left: 6, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [6, 7],
            output: ['leftMax=2, rightMax=2', 'total=5']
          },
          {
            id: 35,
            codeLine: 7,
            description: 'Compare: height[left]=1 < height[right]=3? Yes.',
            phase: 'compare',
            pointers: { left: 6, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [6, 7],
            output: ['leftMax=2, rightMax=2', 'total=5'],
            decision: {
              condition: 'Is height[left]=1 < height[right]=3?',
              conditionMet: true,
              action: 'Process left side'
            }
          },
          {
            id: 36,
            codeLine: 10,
            description: 'height[left]=1 < leftMax=2. Trap water! Add 2 - 1 = 1.',
            phase: 'compare',
            pointers: { left: 6, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [6],
            output: ['leftMax=2, rightMax=2', 'Water at index 6: 2-1 = 1', 'total=6']
          },
          {
            id: 37,
            codeLine: 13,
            description: 'Move left: left++ (6 to 7). Now left equals right!',
            phase: 'move',
            pointers: { left: 7, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [7],
            output: ['leftMax=2, rightMax=2', 'total=6']
          },
          {
            id: 38,
            codeLine: 6,
            description: 'Check: left (7) < right (7)? No! Loop terminates.',
            phase: 'compare',
            pointers: { left: 7, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            highlightedCells: [7],
            output: ['leftMax=2, rightMax=2', 'total=6', 'Loop complete']
          },
          {
            id: 39,
            codeLine: 23,
            description: 'Return total = 6 units of water trapped!',
            phase: 'done',
            pointers: { left: 7, right: 7 },
            array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            output: ['Total water trapped: 6', 'return 6']
          }
        ],
        insight: 'Process the shorter side - it is bounded by a taller bar on the other side. Track max heights to calculate water at each position.'
      }
    ]
  },
  'same-direction': {
    beginner: [],
    intermediate: [
      {
        id: 'remove-duplicates',
        title: 'Remove Duplicates',
        variant: 'same-direction',
        code: [
          'function removeDuplicates(nums) {',
          '  if (nums.length === 0) return 0',
          '  let slow = 0',
          '',
          '  for (let fast = 1; fast < nums.length; fast++) {',
          '    if (nums[fast] !== nums[slow]) {',
          '      slow++',
          '      nums[slow] = nums[fast]',
          '    }',
          '  }',
          '  return slow + 1',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Remove duplicates from sorted array in-place. Return the count of unique elements.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            output: ['Input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]']
          },
          {
            id: 1,
            codeLine: 2,
            description: 'Initialize slow pointer at 0. Slow marks the last position of unique elements.',
            phase: 'init',
            pointers: { left: 0, right: -1 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [0],
            output: ['slow=0 (write position)']
          },
          {
            id: 2,
            codeLine: 4,
            description: 'Initialize fast pointer at 1. Fast scans ahead looking for new unique values.',
            phase: 'init',
            pointers: { left: 0, right: 1 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [0, 1],
            output: ['slow=0, fast=1']
          },
          {
            id: 3,
            codeLine: 5,
            description: 'Compare nums[fast]=0 with nums[slow]=0.',
            phase: 'compare',
            pointers: { left: 0, right: 1 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [0, 1],
            output: ['Comparing: nums[1]=0 vs nums[0]=0'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: false,
              action: 'Same value, just advance fast (skip duplicate)'
            }
          },
          {
            id: 4,
            codeLine: 4,
            description: 'fast++ (1 to 2). Fast advances to find next unique value.',
            phase: 'move',
            pointers: { left: 0, right: 2 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [0, 2],
            output: ['slow=0, fast=2']
          },
          {
            id: 5,
            codeLine: 5,
            description: 'Compare nums[fast]=1 with nums[slow]=0.',
            phase: 'compare',
            pointers: { left: 0, right: 2 },
            array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [0, 2],
            output: ['Comparing: nums[2]=1 vs nums[0]=0'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: true,
              action: 'New value found! Increment slow and copy value'
            }
          },
          {
            id: 6,
            codeLine: 6,
            description: 'slow++ (0 to 1). Copy nums[fast]=1 to nums[slow]=nums[1].',
            phase: 'move',
            pointers: { left: 1, right: 2 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 2],
            output: ['Copied: nums[1] = 1', 'Unique so far: [0, 1]']
          },
          {
            id: 7,
            codeLine: 4,
            description: 'fast++ (2 to 3). Continue scanning.',
            phase: 'move',
            pointers: { left: 1, right: 3 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 3],
            output: ['slow=1, fast=3']
          },
          {
            id: 8,
            codeLine: 5,
            description: 'Compare nums[fast]=1 with nums[slow]=1.',
            phase: 'compare',
            pointers: { left: 1, right: 3 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 3],
            output: ['Comparing: nums[3]=1 vs nums[1]=1'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: false,
              action: 'Same value, skip duplicate'
            }
          },
          {
            id: 9,
            codeLine: 4,
            description: 'fast++ (3 to 4). Skip duplicate.',
            phase: 'move',
            pointers: { left: 1, right: 4 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 4],
            output: ['slow=1, fast=4']
          },
          {
            id: 10,
            codeLine: 5,
            description: 'Compare nums[fast]=1 with nums[slow]=1. Still a duplicate.',
            phase: 'compare',
            pointers: { left: 1, right: 4 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 4],
            output: ['Comparing: nums[4]=1 vs nums[1]=1'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: false,
              action: 'Same value, skip duplicate'
            }
          },
          {
            id: 11,
            codeLine: 4,
            description: 'fast++ (4 to 5). Continue scanning.',
            phase: 'move',
            pointers: { left: 1, right: 5 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 5],
            output: ['slow=1, fast=5']
          },
          {
            id: 12,
            codeLine: 5,
            description: 'Compare nums[fast]=2 with nums[slow]=1.',
            phase: 'compare',
            pointers: { left: 1, right: 5 },
            array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [1, 5],
            output: ['Comparing: nums[5]=2 vs nums[1]=1'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: true,
              action: 'New value found! Increment slow and copy value'
            }
          },
          {
            id: 13,
            codeLine: 6,
            description: 'slow++ (1 to 2). Copy nums[fast]=2 to nums[slow]=nums[2].',
            phase: 'move',
            pointers: { left: 2, right: 5 },
            array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [2, 5],
            output: ['Copied: nums[2] = 2', 'Unique so far: [0, 1, 2]']
          },
          {
            id: 14,
            codeLine: 4,
            description: 'fast++ (5 to 6). Continue scanning.',
            phase: 'move',
            pointers: { left: 2, right: 6 },
            array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [2, 6],
            output: ['slow=2, fast=6']
          },
          {
            id: 15,
            codeLine: 5,
            description: 'Compare nums[fast]=2 with nums[slow]=2. Duplicate.',
            phase: 'compare',
            pointers: { left: 2, right: 6 },
            array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [2, 6],
            output: ['Comparing: nums[6]=2 vs nums[2]=2'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: false,
              action: 'Same value, skip duplicate'
            }
          },
          {
            id: 16,
            codeLine: 4,
            description: 'fast++ (6 to 7). Continue scanning.',
            phase: 'move',
            pointers: { left: 2, right: 7 },
            array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [2, 7],
            output: ['slow=2, fast=7']
          },
          {
            id: 17,
            codeLine: 5,
            description: 'Compare nums[fast]=3 with nums[slow]=2.',
            phase: 'compare',
            pointers: { left: 2, right: 7 },
            array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4],
            highlightedCells: [2, 7],
            output: ['Comparing: nums[7]=3 vs nums[2]=2'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: true,
              action: 'New value found! Increment slow and copy value'
            }
          },
          {
            id: 18,
            codeLine: 6,
            description: 'slow++ (2 to 3). Copy nums[fast]=3 to nums[slow]=nums[3].',
            phase: 'move',
            pointers: { left: 3, right: 7 },
            array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4],
            highlightedCells: [3, 7],
            output: ['Copied: nums[3] = 3', 'Unique so far: [0, 1, 2, 3]']
          },
          {
            id: 19,
            codeLine: 4,
            description: 'fast++ (7 to 8). Continue scanning.',
            phase: 'move',
            pointers: { left: 3, right: 8 },
            array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4],
            highlightedCells: [3, 8],
            output: ['slow=3, fast=8']
          },
          {
            id: 20,
            codeLine: 5,
            description: 'Compare nums[fast]=3 with nums[slow]=3. Duplicate.',
            phase: 'compare',
            pointers: { left: 3, right: 8 },
            array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4],
            highlightedCells: [3, 8],
            output: ['Comparing: nums[8]=3 vs nums[3]=3'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: false,
              action: 'Same value, skip duplicate'
            }
          },
          {
            id: 21,
            codeLine: 4,
            description: 'fast++ (8 to 9). Continue scanning.',
            phase: 'move',
            pointers: { left: 3, right: 9 },
            array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4],
            highlightedCells: [3, 9],
            output: ['slow=3, fast=9']
          },
          {
            id: 22,
            codeLine: 5,
            description: 'Compare nums[fast]=4 with nums[slow]=3.',
            phase: 'compare',
            pointers: { left: 3, right: 9 },
            array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4],
            highlightedCells: [3, 9],
            output: ['Comparing: nums[9]=4 vs nums[3]=3'],
            decision: {
              condition: 'Is nums[fast] !== nums[slow]?',
              conditionMet: true,
              action: 'New value found! Increment slow and copy value'
            }
          },
          {
            id: 23,
            codeLine: 6,
            description: 'slow++ (3 to 4). Copy nums[fast]=4 to nums[slow]=nums[4].',
            phase: 'move',
            pointers: { left: 4, right: 9 },
            array: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4],
            highlightedCells: [4, 9],
            output: ['Copied: nums[4] = 4', 'Unique so far: [0, 1, 2, 3, 4]']
          },
          {
            id: 24,
            codeLine: 4,
            description: 'fast would be 10, but array length is 10. Loop ends.',
            phase: 'compare',
            pointers: { left: 4, right: 9 },
            array: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4],
            highlightedCells: [4],
            output: ['Loop complete']
          },
          {
            id: 25,
            codeLine: 10,
            description: 'Return slow + 1 = 5. First 5 elements are unique: [0, 1, 2, 3, 4].',
            phase: 'done',
            pointers: { left: 4, right: -1 },
            array: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4],
            highlightedCells: [0, 1, 2, 3, 4],
            output: ['Unique elements: [0, 1, 2, 3, 4]', 'return 5']
          }
        ],
        insight: 'Slow pointer marks the end of unique elements; fast scans ahead finding new values. This in-place approach uses O(1) extra space.'
      }
    ],
    advanced: []
  },
  partition: {
    beginner: [],
    intermediate: [],
    advanced: [
      {
        id: 'sort-colors',
        title: 'Sort Colors (Dutch Flag)',
        variant: 'partition',
        code: [
          'function sortColors(nums) {',
          '  let low = 0',
          '  let mid = 0',
          '  let high = nums.length - 1',
          '',
          '  while (mid <= high) {',
          '    if (nums[mid] === 0) {',
          '      [nums[low], nums[mid]] = [nums[mid], nums[low]]',
          '      low++',
          '      mid++',
          '    } else if (nums[mid] === 1) {',
          '      mid++',
          '    } else {',
          '      [nums[mid], nums[high]] = [nums[high], nums[mid]]',
          '      high--',
          '    }',
          '  }',
          '}'
        ],
        steps: [
          {
            id: 0,
            codeLine: 0,
            description: 'Sort array of 0s, 1s, 2s in-place with a single pass. Three pointers partition into three regions.',
            phase: 'init',
            pointers: { left: -1, right: -1 },
            array: [2, 0, 2, 1, 1, 0],
            output: ['Input: [2, 0, 2, 1, 1, 0]', 'Goal: [0, 0, 1, 1, 2, 2]']
          },
          {
            id: 1,
            codeLine: 1,
            description: 'Initialize low pointer at 0. Everything left of low will be 0s.',
            phase: 'init',
            pointers: { left: 0, right: -1, mid: -1 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0],
            output: ['low=0 (0s boundary)']
          },
          {
            id: 2,
            codeLine: 2,
            description: 'Initialize mid pointer at 0. Mid scans through the array.',
            phase: 'init',
            pointers: { left: 0, right: -1, mid: 0 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0],
            output: ['low=0, mid=0']
          },
          {
            id: 3,
            codeLine: 3,
            description: 'Initialize high pointer at 5 (last index). Everything right of high will be 2s.',
            phase: 'init',
            pointers: { left: 0, right: 5, mid: 0 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0, 5],
            output: ['low=0, mid=0, high=5']
          },
          {
            id: 4,
            codeLine: 5,
            description: 'Check: is mid (0) <= high (5)? Yes, enter the loop.',
            phase: 'compare',
            pointers: { left: 0, right: 5, mid: 0 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0],
            output: ['mid <= high: 0 <= 5 ✓']
          },
          {
            id: 5,
            codeLine: 6,
            description: 'Check nums[mid]=nums[0]=2.',
            phase: 'compare',
            pointers: { left: 0, right: 5, mid: 0 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0],
            output: ['nums[mid] = 2'],
            decision: {
              condition: 'Is nums[mid] === 0?',
              conditionMet: false,
              action: 'Check if nums[mid] === 1'
            }
          },
          {
            id: 6,
            codeLine: 10,
            description: 'Check if nums[mid] === 1.',
            phase: 'compare',
            pointers: { left: 0, right: 5, mid: 0 },
            array: [2, 0, 2, 1, 1, 0],
            highlightedCells: [0],
            output: ['nums[mid] = 2'],
            decision: {
              condition: 'Is nums[mid] === 1?',
              conditionMet: false,
              action: 'nums[mid] === 2, swap with high and decrement high'
            }
          },
          {
            id: 7,
            codeLine: 13,
            description: 'Swap nums[mid] with nums[high]: swap 2 and 0. Decrement high.',
            phase: 'move',
            pointers: { left: 0, right: 4, mid: 0 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [0, 5],
            output: ['Swapped: [0, 0, 2, 1, 1, 2]', 'high-- → 4', 'Note: mid stays (new value needs checking)']
          },
          {
            id: 8,
            codeLine: 5,
            description: 'Check: is mid (0) <= high (4)? Yes, continue.',
            phase: 'compare',
            pointers: { left: 0, right: 4, mid: 0 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [0],
            output: ['mid <= high: 0 <= 4 ✓']
          },
          {
            id: 9,
            codeLine: 6,
            description: 'Check nums[mid]=nums[0]=0.',
            phase: 'compare',
            pointers: { left: 0, right: 4, mid: 0 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [0],
            output: ['nums[mid] = 0'],
            decision: {
              condition: 'Is nums[mid] === 0?',
              conditionMet: true,
              action: 'Swap with low, increment both low and mid'
            }
          },
          {
            id: 10,
            codeLine: 7,
            description: 'Swap nums[mid] with nums[low] (same position). Increment both low and mid.',
            phase: 'move',
            pointers: { left: 1, right: 4, mid: 1 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [0, 1],
            output: ['Swapped (same pos): [0, 0, 2, 1, 1, 2]', 'low++ → 1, mid++ → 1']
          },
          {
            id: 11,
            codeLine: 5,
            description: 'Check: is mid (1) <= high (4)? Yes, continue.',
            phase: 'compare',
            pointers: { left: 1, right: 4, mid: 1 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [1],
            output: ['mid <= high: 1 <= 4 ✓']
          },
          {
            id: 12,
            codeLine: 6,
            description: 'Check nums[mid]=nums[1]=0.',
            phase: 'compare',
            pointers: { left: 1, right: 4, mid: 1 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [1],
            output: ['nums[mid] = 0'],
            decision: {
              condition: 'Is nums[mid] === 0?',
              conditionMet: true,
              action: 'Swap with low, increment both low and mid'
            }
          },
          {
            id: 13,
            codeLine: 7,
            description: 'Swap nums[mid] with nums[low] (same position). Increment both.',
            phase: 'move',
            pointers: { left: 2, right: 4, mid: 2 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [1, 2],
            output: ['Swapped (same pos): [0, 0, 2, 1, 1, 2]', 'low++ → 2, mid++ → 2']
          },
          {
            id: 14,
            codeLine: 5,
            description: 'Check: is mid (2) <= high (4)? Yes, continue.',
            phase: 'compare',
            pointers: { left: 2, right: 4, mid: 2 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [2],
            output: ['mid <= high: 2 <= 4 ✓']
          },
          {
            id: 15,
            codeLine: 6,
            description: 'Check nums[mid]=nums[2]=2.',
            phase: 'compare',
            pointers: { left: 2, right: 4, mid: 2 },
            array: [0, 0, 2, 1, 1, 2],
            highlightedCells: [2],
            output: ['nums[mid] = 2'],
            decision: {
              condition: 'Is nums[mid] === 2?',
              conditionMet: true,
              action: 'Swap with high, decrement high (mid stays)'
            }
          },
          {
            id: 16,
            codeLine: 13,
            description: 'Swap nums[mid] with nums[high]: swap 2 and 1. Decrement high.',
            phase: 'move',
            pointers: { left: 2, right: 3, mid: 2 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [2, 4],
            output: ['Swapped: [0, 0, 1, 1, 2, 2]', 'high-- → 3']
          },
          {
            id: 17,
            codeLine: 5,
            description: 'Check: is mid (2) <= high (3)? Yes, continue.',
            phase: 'compare',
            pointers: { left: 2, right: 3, mid: 2 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [2],
            output: ['mid <= high: 2 <= 3 ✓']
          },
          {
            id: 18,
            codeLine: 6,
            description: 'Check nums[mid]=nums[2]=1.',
            phase: 'compare',
            pointers: { left: 2, right: 3, mid: 2 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [2],
            output: ['nums[mid] = 1'],
            decision: {
              condition: 'Is nums[mid] === 1?',
              conditionMet: true,
              action: 'Just increment mid (1s stay in middle)'
            }
          },
          {
            id: 19,
            codeLine: 11,
            description: 'Increment mid only. 1s belong in the middle region.',
            phase: 'move',
            pointers: { left: 2, right: 3, mid: 3 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [3],
            output: ['mid++ → 3']
          },
          {
            id: 20,
            codeLine: 5,
            description: 'Check: is mid (3) <= high (3)? Yes, continue.',
            phase: 'compare',
            pointers: { left: 2, right: 3, mid: 3 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [3],
            output: ['mid <= high: 3 <= 3 ✓']
          },
          {
            id: 21,
            codeLine: 6,
            description: 'Check nums[mid]=nums[3]=1.',
            phase: 'compare',
            pointers: { left: 2, right: 3, mid: 3 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [3],
            output: ['nums[mid] = 1'],
            decision: {
              condition: 'Is nums[mid] === 1?',
              conditionMet: true,
              action: 'Just increment mid'
            }
          },
          {
            id: 22,
            codeLine: 11,
            description: 'Increment mid.',
            phase: 'move',
            pointers: { left: 2, right: 3, mid: 4 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [4],
            output: ['mid++ → 4']
          },
          {
            id: 23,
            codeLine: 5,
            description: 'Check: is mid (4) <= high (3)? No! mid has passed high, loop terminates.',
            phase: 'compare',
            pointers: { left: 2, right: 3, mid: 4 },
            array: [0, 0, 1, 1, 2, 2],
            output: ['mid <= high: 4 <= 3 ✗', 'Loop complete']
          },
          {
            id: 24,
            codeLine: 16,
            description: 'Array is sorted! 0s are left of low, 1s between low and high, 2s right of high.',
            phase: 'done',
            pointers: { left: 2, right: 3, mid: 4 },
            array: [0, 0, 1, 1, 2, 2],
            highlightedCells: [0, 1, 2, 3, 4, 5],
            output: ['Result: [0, 0, 1, 1, 2, 2]', 'Sorted in single pass!']
          }
        ],
        insight: 'Three-way partition keeps 0s left of low, 2s right of high. Mid scans once through the array - O(n) time, O(1) space.'
      }
    ]
  }
}

export function TwoPointersViz() {
  const [variant, setVariant] = useState<Variant>('converging')
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[variant][level]
  const hasExamples = currentExamples.length > 0
  const currentExample = hasExamples ? currentExamples[exampleIndex] : null
  const currentStep = currentExample ? currentExample.steps[stepIndex] : null

  const handleVariantChange = (newVariant: Variant) => {
    setVariant(newVariant)
    setLevel('beginner')
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const getPointerLabel = (index: number) => {
    if (!currentStep) return null
    const { left, right, mid } = currentStep.pointers

    if (variant === 'partition' && mid !== undefined) {
      const labels: string[] = []
      if (left === index) labels.push('low')
      if (mid === index) labels.push('mid')
      if (right === index) labels.push('high')
      return labels.length > 0 ? labels.join(',') : null
    }

    const isSameDirection = variant === 'same-direction'
    const leftLabel = isSameDirection ? 'slow' : 'L'
    const rightLabel = isSameDirection ? 'fast' : 'R'
    if (left === index && right === index) {
      return isSameDirection ? 'slow,fast' : 'L,R'
    }
    if (left === index) return leftLabel
    if (right === index) return rightLabel
    return null
  }

  const getCellState = (index: number) => {
    if (!currentStep) return ''
    const { left, right, mid } = currentStep.pointers
    if (currentStep.highlightedCells?.includes(index)) return styles.active

    if (variant === 'partition' && mid !== undefined && mid >= 0) {
      if (index < left) return styles.processed
      if (index > right) return styles.processed
      return ''
    }

    if (left >= 0 && right >= 0 && index < left) return styles.processed
    if (left >= 0 && right >= 0 && index > right) return styles.processed
    return ''
  }

  return (
    <div className={styles.container}>
      <div className={styles.variantSelector}>
        {(Object.keys(variantInfo) as Variant[]).map(v => (
          <button
            key={v}
            className={`${styles.variantBtn} ${variant === v ? styles.activeVariant : ''}`}
            onClick={() => handleVariantChange(v)}
            title={variantInfo[v].description}
          >
            {variantInfo[v].label}
          </button>
        ))}
      </div>

      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            disabled={examples[variant][lvl].length === 0}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {hasExamples && currentExamples.length > 1 && (
        <div className={styles.exampleTabs}>
          {currentExamples.map((ex, i) => (
            <button
              key={ex.id}
              className={`${styles.exampleTab} ${exampleIndex === i ? styles.activeTab : ''}`}
              onClick={() => handleExampleChange(i)}
            >
              {ex.title}
            </button>
          ))}
        </div>
      )}

      {!hasExamples ? (
        <div className={styles.emptyState}>
          <p>Examples coming soon for {variantInfo[variant].label} - {levelInfo[level].label}.</p>
        </div>
      ) : currentExample && currentStep && (
        <>
          <div className={styles.mainGrid}>
            <CodePanel
              code={currentExample.code}
              highlightedLine={currentStep.codeLine}
              title="Code"
            />

            <div className={styles.vizPanel}>
              <AnimatePresence mode="wait">
                {currentStep.decision && (
                  <motion.div
                    key={`decision-${currentStep.id}`}
                    className={styles.decisionPanel}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.decisionQuestion}>{currentStep.decision.condition}</span>
                    <span className={`${styles.decisionAnswer} ${currentStep.decision.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
                      {currentStep.decision.conditionMet ? 'Yes' : 'No'} {'\u2192'} {currentStep.decision.action}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.arrayContainer}>
                {currentStep.array.map((value, index) => (
                  <div key={index} className={styles.cellWrapper}>
                    <motion.div
                      className={`${styles.cell} ${getCellState(index)}`}
                      initial={false}
                      animate={{
                        scale: currentStep.highlightedCells?.includes(index) ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className={styles.cellValue}>{value}</span>
                      <span className={styles.cellIndex}>{index}</span>
                    </motion.div>
                    <AnimatePresence mode="wait">
                      {getPointerLabel(index) && (
                        <motion.div
                          key={`pointer-${index}-${getPointerLabel(index)}`}
                          className={styles.pointerContainer}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className={styles.pointerArrow}>{'\u2191'}</span>
                          <span className={styles.pointerLabel}>{getPointerLabel(index)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {currentStep.output && currentStep.output.length > 0 && (
                <div className={styles.outputBox}>
                  <div className={styles.outputHeader}>Output</div>
                  <div className={styles.outputContent}>
                    {currentStep.output.map((line, i) => (
                      <motion.div
                        key={i}
                        className={styles.outputLine}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <StepProgress
            current={stepIndex}
            total={currentExample.steps.length}
            description={currentStep.description}
          />

          <StepControls
            onPrev={() => setStepIndex(s => s - 1)}
            onNext={() => setStepIndex(s => s + 1)}
            onReset={() => setStepIndex(0)}
            canPrev={stepIndex > 0}
            canNext={stepIndex < currentExample.steps.length - 1}
          />

          <div className={styles.insightBox}>
            <span className={styles.insightLabel}>Key Insight:</span>
            {currentExample.insight}
          </div>
        </>
      )}
    </div>
  )
}
