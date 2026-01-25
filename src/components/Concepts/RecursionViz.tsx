import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './RecursionViz.module.css'

interface StackFrame {
  fn: string
  args: string
  returnValue?: string
  status: 'active' | 'waiting' | 'returning'
}

interface Step {
  description: string
  codeLine: number
  stack: StackFrame[]
  output: string[]
  phase: 'calling' | 'returning' | 'complete'
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'factorial',
      title: 'Factorial',
      code: [
        'function factorial(n) {',
        '  if (n <= 1) return 1;',
        '  return n * factorial(n - 1);',
        '}',
        '',
        'factorial(4);  // 24',
      ],
      steps: [
        { description: 'factorial(4) is called. Stack grows.', codeLine: 5, stack: [{ fn: 'factorial', args: '4', status: 'active' }], output: [], phase: 'calling' },
        { description: 'n=4, not base case. Calls factorial(3).', codeLine: 2, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', status: 'active' }], output: [], phase: 'calling' },
        { description: 'n=3, not base case. Calls factorial(2).', codeLine: 2, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', status: 'waiting' }, { fn: 'factorial', args: '2', status: 'active' }], output: [], phase: 'calling' },
        { description: 'n=2, not base case. Calls factorial(1).', codeLine: 2, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', status: 'waiting' }, { fn: 'factorial', args: '2', status: 'waiting' }, { fn: 'factorial', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! n=1, returns 1. Stack unwinds.', codeLine: 1, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', status: 'waiting' }, { fn: 'factorial', args: '2', status: 'waiting' }, { fn: 'factorial', args: '1', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'factorial(2) returns 2 * 1 = 2', codeLine: 2, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', status: 'waiting' }, { fn: 'factorial', args: '2', returnValue: '2', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'factorial(3) returns 3 * 2 = 6', codeLine: 2, stack: [{ fn: 'factorial', args: '4', status: 'waiting' }, { fn: 'factorial', args: '3', returnValue: '6', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'factorial(4) returns 4 * 6 = 24', codeLine: 2, stack: [{ fn: 'factorial', args: '4', returnValue: '24', status: 'returning' }], output: ['24'], phase: 'complete' },
      ],
      insight: 'Recursion = function calling itself. Every recursive function needs a BASE CASE to stop!'
    },
    {
      id: 'countdown',
      title: 'Countdown',
      code: [
        'function countdown(n) {',
        '  if (n <= 0) {',
        '    console.log("Done!");',
        '    return;',
        '  }',
        '  console.log(n);',
        '  countdown(n - 1);',
        '}',
        '',
        'countdown(3);',
      ],
      steps: [
        { description: 'countdown(3) starts', codeLine: 9, stack: [{ fn: 'countdown', args: '3', status: 'active' }], output: [], phase: 'calling' },
        { description: 'n=3 > 0, prints 3, then calls countdown(2)', codeLine: 5, stack: [{ fn: 'countdown', args: '3', status: 'waiting' }, { fn: 'countdown', args: '2', status: 'active' }], output: ['3'], phase: 'calling' },
        { description: 'n=2 > 0, prints 2, then calls countdown(1)', codeLine: 5, stack: [{ fn: 'countdown', args: '3', status: 'waiting' }, { fn: 'countdown', args: '2', status: 'waiting' }, { fn: 'countdown', args: '1', status: 'active' }], output: ['3', '2'], phase: 'calling' },
        { description: 'n=1 > 0, prints 1, then calls countdown(0)', codeLine: 5, stack: [{ fn: 'countdown', args: '3', status: 'waiting' }, { fn: 'countdown', args: '2', status: 'waiting' }, { fn: 'countdown', args: '1', status: 'waiting' }, { fn: 'countdown', args: '0', status: 'active' }], output: ['3', '2', '1'], phase: 'calling' },
        { description: 'BASE CASE! n=0, prints "Done!" and returns', codeLine: 2, stack: [{ fn: 'countdown', args: '3', status: 'waiting' }, { fn: 'countdown', args: '2', status: 'waiting' }, { fn: 'countdown', args: '1', status: 'waiting' }, { fn: 'countdown', args: '0', returnValue: 'void', status: 'returning' }], output: ['3', '2', '1', 'Done!'], phase: 'returning' },
        { description: 'All calls return, stack empties', codeLine: -1, stack: [], output: ['3', '2', '1', 'Done!'], phase: 'complete' },
      ],
      insight: 'Each recursive call waits for the next one to finish before continuing. The stack grows, then shrinks.'
    },
  ],
  intermediate: [
    {
      id: 'fibonacci',
      title: 'Fibonacci',
      code: [
        'function fib(n) {',
        '  if (n <= 1) return n;',
        '  return fib(n-1) + fib(n-2);',
        '}',
        '',
        'fib(4);  // 3',
      ],
      steps: [
        { description: 'fib(4) called - needs TWO recursive calls!', codeLine: 5, stack: [{ fn: 'fib', args: '4', status: 'active' }], output: [], phase: 'calling' },
        { description: 'fib(4) = fib(3) + fib(2). First, call fib(3).', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'active' }], output: [], phase: 'calling' },
        { description: 'fib(3) = fib(2) + fib(1). Call fib(2).', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', status: 'active' }], output: [], phase: 'calling' },
        { description: 'fib(2) = fib(1) + fib(0). Call fib(1).', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', status: 'waiting' }, { fn: 'fib', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! fib(1) = 1', codeLine: 1, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', status: 'waiting' }, { fn: 'fib', args: '1', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Back to fib(2) - now call SECOND branch: fib(0)', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', status: 'waiting' }, { fn: 'fib', args: '0', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! fib(0) = 0', codeLine: 1, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', status: 'waiting' }, { fn: 'fib', args: '0', returnValue: '0', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'fib(2) has both branches! Returns 1 + 0 = 1', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '2', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Back to fib(3) - now call SECOND branch: fib(1)', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! fib(1) = 1', codeLine: 1, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', status: 'waiting' }, { fn: 'fib', args: '1', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'fib(3) has both branches! Returns 1 + 1 = 2', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '3', returnValue: '2', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Back to fib(4) - now call SECOND branch: fib(2)', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '2', status: 'active' }], output: [], phase: 'calling' },
        { description: 'fib(2) = 1 (calculated again! Overlapping subproblem)', codeLine: 2, stack: [{ fn: 'fib', args: '4', status: 'waiting' }, { fn: 'fib', args: '2', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'fib(4) has both branches! Returns 2 + 1 = 3', codeLine: 2, stack: [{ fn: 'fib', args: '4', returnValue: '3', status: 'returning' }], output: ['3'], phase: 'complete' },
      ],
      insight: 'Branching recursion: each call makes TWO recursive calls. fib(2) calculated twice - this is why memoization helps!'
    },
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      code: [
        'function climb(n) {',
        '  if (n <= 1) return 1;',
        '  return climb(n-1) + climb(n-2);',
        '}',
        '',
        'climb(3);  // 3 ways',
      ],
      steps: [
        { description: 'climb(3): How many ways to climb 3 stairs?', codeLine: 5, stack: [{ fn: 'climb', args: '3', status: 'active' }], output: [], phase: 'calling' },
        { description: 'Either take 1 step → climb(2), or 2 steps → climb(1)', codeLine: 2, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', status: 'active' }], output: [], phase: 'calling' },
        { description: 'climb(2): Take 1 step → climb(1), or 2 steps → climb(0)', codeLine: 2, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', status: 'waiting' }, { fn: 'climb', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! climb(1) = 1 way (just take 1 step)', codeLine: 1, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', status: 'waiting' }, { fn: 'climb', args: '1', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Second branch of climb(2): climb(0)', codeLine: 2, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', status: 'waiting' }, { fn: 'climb', args: '0', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! climb(0) = 1 way (already at top!)', codeLine: 1, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', status: 'waiting' }, { fn: 'climb', args: '0', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'climb(2) = 1 + 1 = 2 ways', codeLine: 2, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '2', returnValue: '2', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Second branch of climb(3): climb(1)', codeLine: 2, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! climb(1) = 1 way', codeLine: 1, stack: [{ fn: 'climb', args: '3', status: 'waiting' }, { fn: 'climb', args: '1', returnValue: '1', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'climb(3) = 2 + 1 = 3 ways! (1+1+1, 1+2, 2+1)', codeLine: 2, stack: [{ fn: 'climb', args: '3', returnValue: '3', status: 'returning' }], output: ['3 ways'], phase: 'complete' },
      ],
      insight: 'Classic DP problem! At each step you have 2 choices (1 or 2 steps), creating branching recursion.'
    },
    {
      id: 'max-depth',
      title: 'Max Tree Depth',
      code: [
        'function maxDepth(node) {',
        '  if (!node) return 0;',
        '  let left = maxDepth(node.left);',
        '  let right = maxDepth(node.right);',
        '  return Math.max(left, right) + 1;',
        '}',
        '//   1       depth=2',
        '//  / \\',
        '// 2   3',
      ],
      steps: [
        { description: 'maxDepth(1): Find depth of tree rooted at node 1', codeLine: 8, stack: [{ fn: 'maxDepth', args: '1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'First, recurse LEFT to find left subtree depth', codeLine: 2, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', status: 'active' }], output: [], phase: 'calling' },
        { description: 'Node 2 has no left child, recurse on null', codeLine: 2, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', status: 'waiting' }, { fn: 'maxDepth', args: 'null', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! null node has depth 0', codeLine: 1, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', status: 'waiting' }, { fn: 'maxDepth', args: 'null', returnValue: '0', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Node 2 now recurses RIGHT (also null)', codeLine: 3, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', status: 'waiting' }, { fn: 'maxDepth', args: 'null', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! null returns 0', codeLine: 1, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', status: 'waiting' }, { fn: 'maxDepth', args: 'null', returnValue: '0', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'Node 2: max(0, 0) + 1 = 1', codeLine: 4, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '2', returnValue: '1', status: 'returning' }], output: ['left=1'], phase: 'returning' },
        { description: 'Back to node 1, now recurse RIGHT to node 3', codeLine: 3, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '3', status: 'active' }], output: ['left=1'], phase: 'calling' },
        { description: 'Node 3 is a leaf, both children are null → returns 1', codeLine: 4, stack: [{ fn: 'maxDepth', args: '1', status: 'waiting' }, { fn: 'maxDepth', args: '3', returnValue: '1', status: 'returning' }], output: ['left=1', 'right=1'], phase: 'returning' },
        { description: 'Node 1: max(1, 1) + 1 = 2', codeLine: 4, stack: [{ fn: 'maxDepth', args: '1', returnValue: '2', status: 'returning' }], output: ['depth = 2'], phase: 'complete' },
      ],
      insight: 'Tree problems often use branching recursion: recurse on left AND right, then combine results.'
    },
  ],
  advanced: [
    {
      id: 'subsets',
      title: 'Subsets (Power Set)',
      code: [
        'function subsets(nums, i=0, curr=[]) {',
        '  if (i === nums.length) {',
        '    return [curr.slice()];',
        '  }',
        '  // Branch 1: EXCLUDE nums[i]',
        '  let without = subsets(nums, i+1, curr);',
        '  // Branch 2: INCLUDE nums[i]',
        '  curr.push(nums[i]);',
        '  let with_ = subsets(nums, i+1, curr);',
        '  curr.pop();',
        '  return [...without, ...with_];',
        '}',
        'subsets([1, 2]);',
      ],
      steps: [
        { description: 'subsets([1,2], i=0): Include or exclude 1?', codeLine: 12, stack: [{ fn: 'subsets', args: 'i=0, curr=[]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'Branch 1: EXCLUDE 1, recurse with i=1', codeLine: 5, stack: [{ fn: 'subsets', args: 'i=0, curr=[]', status: 'waiting' }, { fn: 'subsets', args: 'i=1, curr=[]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'i=1: Include or exclude 2? EXCLUDE first.', codeLine: 5, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1, curr=[]', status: 'waiting' }, { fn: 'subsets', args: 'i=2, curr=[]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! i=2 = length. Return [[]]', codeLine: 2, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', status: 'waiting' }, { fn: 'subsets', args: 'i=2', returnValue: '[[]]', status: 'returning' }], output: ['[[]]'], phase: 'returning' },
        { description: 'Back at i=1: Now INCLUDE 2, recurse', codeLine: 8, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1, curr=[2]', status: 'waiting' }, { fn: 'subsets', args: 'i=2, curr=[2]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'BASE CASE! Return [[2]]', codeLine: 2, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', status: 'waiting' }, { fn: 'subsets', args: 'i=2', returnValue: '[[2]]', status: 'returning' }], output: ['[[2]]'], phase: 'returning' },
        { description: 'i=1 combines: [[], [2]]', codeLine: 10, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', returnValue: '[[], [2]]', status: 'returning' }], output: ['[[], [2]]'], phase: 'returning' },
        { description: 'Back at i=0: Now INCLUDE 1, recurse', codeLine: 8, stack: [{ fn: 'subsets', args: 'i=0, curr=[1]', status: 'waiting' }, { fn: 'subsets', args: 'i=1, curr=[1]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'i=1 with curr=[1]: EXCLUDE 2 → [[1]]', codeLine: 5, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', status: 'waiting' }], output: ['[[1]]'], phase: 'calling' },
        { description: 'i=1 with curr=[1]: INCLUDE 2 → [[1,2]]', codeLine: 8, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', status: 'waiting' }], output: ['[[1,2]]'], phase: 'calling' },
        { description: 'i=1 combines: [[1], [1,2]]', codeLine: 10, stack: [{ fn: 'subsets', args: 'i=0', status: 'waiting' }, { fn: 'subsets', args: 'i=1', returnValue: '[[1],[1,2]]', status: 'returning' }], output: ['[[1], [1,2]]'], phase: 'returning' },
        { description: 'i=0 combines all: [[], [2], [1], [1,2]]', codeLine: 10, stack: [{ fn: 'subsets', args: 'i=0', returnValue: '4 subsets', status: 'returning' }], output: ['[[], [2], [1], [1,2]]'], phase: 'complete' },
      ],
      insight: 'Include/Exclude pattern: at each element, branch into 2 paths. Creates 2^n subsets!'
    },
    {
      id: 'flatten',
      title: 'Flatten Array',
      code: [
        'function flatten(arr) {',
        '  let result = [];',
        '  for (let item of arr) {',
        '    if (Array.isArray(item)) {',
        '      result.push(...flatten(item));',
        '    } else {',
        '      result.push(item);',
        '    }',
        '  }',
        '  return result;',
        '}',
        '',
        'flatten([1, [2, [3]]]);',
      ],
      steps: [
        { description: 'flatten([1, [2, [3]]]) starts', codeLine: 12, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'active' }], output: [], phase: 'calling' },
        { description: 'item=1 is not array, push 1', codeLine: 6, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'active' }], output: ['result: [1]'], phase: 'calling' },
        { description: 'item=[2,[3]] IS array, recurse!', codeLine: 4, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', status: 'active' }], output: ['result: [1]'], phase: 'calling' },
        { description: 'item=2 is not array, push 2', codeLine: 6, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', status: 'active' }], output: ['inner: [2]'], phase: 'calling' },
        { description: 'item=[3] IS array, recurse deeper!', codeLine: 4, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', status: 'waiting' }, { fn: 'flatten', args: '[3]', status: 'active' }], output: ['inner: [2]'], phase: 'calling' },
        { description: 'item=3 is not array, push 3', codeLine: 6, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', status: 'waiting' }, { fn: 'flatten', args: '[3]', status: 'active' }], output: ['deepest: [3]'], phase: 'calling' },
        { description: 'flatten([3]) returns [3]', codeLine: 9, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', status: 'waiting' }, { fn: 'flatten', args: '[3]', returnValue: '[3]', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'flatten([2,[3]]) spreads [3], returns [2,3]', codeLine: 9, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', status: 'waiting' }, { fn: 'flatten', args: '[2, [3]]', returnValue: '[2, 3]', status: 'returning' }], output: [], phase: 'returning' },
        { description: 'flatten([1,[2,[3]]]) spreads [2,3], returns [1,2,3]', codeLine: 9, stack: [{ fn: 'flatten', args: '[1, [2, [3]]]', returnValue: '[1, 2, 3]', status: 'returning' }], output: ['[1, 2, 3]'], phase: 'complete' },
      ],
      insight: 'Nested structures need recursive handling. Check type, recurse if nested, combine results.'
    },
    {
      id: 'memoization',
      title: 'Memoization',
      code: [
        'function fibMemo(n, memo = {}) {',
        '  if (n in memo) return memo[n];',
        '  if (n <= 1) return n;',
        '  memo[n] = fibMemo(n-1, memo)',
        '         + fibMemo(n-2, memo);',
        '  return memo[n];',
        '}',
        '',
        'fibMemo(5);  // 5',
      ],
      steps: [
        { description: 'fibMemo(5) starts with empty memo', codeLine: 8, stack: [{ fn: 'fibMemo', args: '5', status: 'active' }], output: ['memo: {}'], phase: 'calling' },
        { description: '5 not in memo, not base case. Calls fibMemo(4)', codeLine: 3, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'active' }], output: ['memo: {}'], phase: 'calling' },
        { description: 'Continues down... fibMemo(3), (2), (1)', codeLine: 3, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'waiting' }, { fn: 'fibMemo', args: '3', status: 'waiting' }, { fn: 'fibMemo', args: '2', status: 'waiting' }, { fn: 'fibMemo', args: '1', status: 'active' }], output: ['memo: {}'], phase: 'calling' },
        { description: 'BASE CASE! fib(1)=1, fib(0)=0', codeLine: 2, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'waiting' }, { fn: 'fibMemo', args: '3', status: 'waiting' }, { fn: 'fibMemo', args: '2', status: 'waiting' }], output: ['memo: {}'], phase: 'returning' },
        { description: 'fib(2)=1, STORES in memo!', codeLine: 3, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'waiting' }, { fn: 'fibMemo', args: '3', status: 'waiting' }, { fn: 'fibMemo', args: '2', returnValue: '1', status: 'returning' }], output: ['memo: {2: 1}'], phase: 'returning' },
        { description: 'fib(3) needs fib(1)... already know it! Returns 2', codeLine: 3, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'waiting' }, { fn: 'fibMemo', args: '3', returnValue: '2', status: 'returning' }], output: ['memo: {2:1, 3:2}'], phase: 'returning' },
        { description: 'fib(4) needs fib(2)... IN MEMO! Skip recursion!', codeLine: 1, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', status: 'active' }], output: ['memo: {2:1, 3:2}', 'CACHE HIT!'], phase: 'returning' },
        { description: 'fib(4) = 3, stored in memo', codeLine: 3, stack: [{ fn: 'fibMemo', args: '5', status: 'waiting' }, { fn: 'fibMemo', args: '4', returnValue: '3', status: 'returning' }], output: ['memo: {2:1, 3:2, 4:3}'], phase: 'returning' },
        { description: 'fib(5) needs fib(3)... IN MEMO! Skip!', codeLine: 1, stack: [{ fn: 'fibMemo', args: '5', status: 'active' }], output: ['memo: {2:1, 3:2, 4:3}', 'CACHE HIT!'], phase: 'returning' },
        { description: 'fib(5) = 3 + 2 = 5', codeLine: 5, stack: [{ fn: 'fibMemo', args: '5', returnValue: '5', status: 'returning' }], output: ['memo: {2:1, 3:2, 4:3, 5:5}', 'Result: 5'], phase: 'complete' },
      ],
      insight: 'Memoization = caching results. Turns O(2^n) into O(n) by avoiding recalculation!'
    },
    {
      id: 'tree-dfs',
      title: 'Tree DFS',
      code: [
        'function dfs(node) {',
        '  if (!node) return;',
        '  console.log(node.val);',
        '  dfs(node.left);',
        '  dfs(node.right);',
        '}',
        '',
        '//     1',
        '//    / \\',
        '//   2   3',
        'dfs(root);  // 1, 2, 3',
      ],
      steps: [
        { description: 'dfs(1) called on root', codeLine: 10, stack: [{ fn: 'dfs', args: 'node=1', status: 'active' }], output: [], phase: 'calling' },
        { description: 'Print 1, then go LEFT first', codeLine: 2, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=2', status: 'active' }], output: ['1'], phase: 'calling' },
        { description: 'Print 2, go left (null)', codeLine: 2, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=2', status: 'waiting' }, { fn: 'dfs', args: 'null', status: 'active' }], output: ['1', '2'], phase: 'calling' },
        { description: 'BASE CASE! null returns immediately', codeLine: 1, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=2', status: 'waiting' }, { fn: 'dfs', args: 'null', returnValue: 'void', status: 'returning' }], output: ['1', '2'], phase: 'returning' },
        { description: 'Back at node 2, go right (null)', codeLine: 4, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=2', status: 'waiting' }, { fn: 'dfs', args: 'null', status: 'active' }], output: ['1', '2'], phase: 'calling' },
        { description: 'null returns, node 2 done', codeLine: 1, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=2', returnValue: 'void', status: 'returning' }], output: ['1', '2'], phase: 'returning' },
        { description: 'Back at root, now go RIGHT to node 3', codeLine: 4, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=3', status: 'active' }], output: ['1', '2'], phase: 'calling' },
        { description: 'Print 3, left=null, right=null', codeLine: 2, stack: [{ fn: 'dfs', args: 'node=1', status: 'waiting' }, { fn: 'dfs', args: 'node=3', status: 'active' }], output: ['1', '2', '3'], phase: 'calling' },
        { description: 'Node 3 done, back to root, all done!', codeLine: -1, stack: [], output: ['1', '2', '3'], phase: 'complete' },
      ],
      insight: 'Tree recursion = process node, then recurse on children. DFS uses the call stack naturally!'
    },
  ],
}

export function RecursionViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'calling': return '#a855f7'
      case 'returning': return '#10b981'
      case 'complete': return '#a855f7'
    }
  }

  const getStatusColor = (status: StackFrame['status']) => {
    switch (status) {
      case 'active': return '#a855f7'
      case 'waiting': return '#f59e0b'
      case 'returning': return '#10b981'
    }
  }

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className={styles.mainGrid}>
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.panelHeader}>
            <span>Code</span>
            <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
              {currentStep.phase === 'calling' ? 'Calling ↓' :
               currentStep.phase === 'returning' ? 'Returning ↑' : 'Complete ✓'}
            </span>
          </div>
          <pre className={styles.code}>
            {currentExample.code.map((line, i) => (
              <div
                key={i}
                className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
              >
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={styles.lineCode}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Call Stack - Neon Box */}
        <div className={`${styles.neonBox} ${styles.stackBox}`}>
          <div className={styles.neonBoxHeader}>Call Stack ({currentStep.stack.length})</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.stack}>
              <AnimatePresence mode="popLayout">
                {currentStep.stack.length === 0 ? (
                  <div className={styles.emptyStack}>Stack empty</div>
                ) : (
                  currentStep.stack.slice().reverse().map((frame, i) => (
                    <motion.div
                      key={`${frame.fn}-${frame.args}-${i}`}
                      className={styles.stackFrame}
                      style={{ borderLeftColor: getStatusColor(frame.status) }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <div className={styles.frameFn}>{frame.fn}({frame.args})</div>
                      {frame.returnValue && (
                        <div className={styles.frameReturn}>
                          → {frame.returnValue}
                        </div>
                      )}
                      <div
                        className={styles.frameStatus}
                        style={{ color: getStatusColor(frame.status) }}
                      >
                        {frame.status}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Output</div>
          <div className={styles.neonBoxInner}>
            {currentStep.output.map((o, i) => (
              <span key={i} className={styles.outputItem}>{o}</span>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={() => setStepIndex(0)}>
          ↻ Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
