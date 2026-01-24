import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './ArraysBasicsViz.module.css'

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface HeapObject {
  id: string
  type: 'array'
  elements: (string | number)[]
  label: string
  highlight?: 'mutated' | 'new' | 'none'
}

interface IterationState {
  method: 'map' | 'filter' | 'reduce'
  currentIndex: number
  accumulator?: string | number
  resultArray?: (string | number)[]
  rejected?: number[]
}

interface ArrayStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'result' | 'iterate'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
  iterationState?: IterationState
}

interface ArrayExample {
  id: string
  title: string
  code: string[]
  steps: ArrayStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, ArrayExample[]> = {
  beginner: [
    {
      id: 'value-vs-reference',
      title: 'Value vs Reference copy',
      code: [
        'let a = 5',
        'let b = a',
        'b = 10',
        'console.log(a, b)',
        '',
        'let arr1 = [1, 2, 3]',
        'let arr2 = arr1',
        'arr2.push(4)',
        'console.log(arr1)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let a = 5 - Primitive value stored directly in the stack.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5', highlight: 'new' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let b = a - The VALUE 5 is COPIED to b. They are independent.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '5', highlight: 'new' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'b = 10 - Only b changes. a is still 5 because they have separate copies.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10', highlight: 'changed' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'console.log(a, b) outputs: 5, 10. Primitives are independent!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
          ],
          heap: [],
          output: ['5 10'],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'let arr1 = [1,2,3] - Array created in HEAP. arr1 stores a REFERENCE to it.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: ['5 10'],
        },
        {
          id: 6,
          codeLine: 6,
          description: 'let arr2 = arr1 - The REFERENCE is copied, not the array! Both point to the SAME heap object.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: ['5 10'],
        },
        {
          id: 7,
          codeLine: 7,
          description: 'arr2.push(4) - Mutates the heap array. Since arr1 and arr2 point to the same array, arr1 sees the change!',
          phase: 'mutate',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1', highlight: 'mutated' },
          ],
          output: ['5 10'],
        },
        {
          id: 8,
          codeLine: 8,
          description: 'console.log(arr1) outputs [1,2,3,4]. arr1 sees the change made through arr2!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: ['5 10', '[1, 2, 3, 4]'],
        },
      ],
      insight: 'Primitives are copied by VALUE (independent). Arrays are copied by REFERENCE (shared)!',
    },
    {
      id: 'mutation-through-reference',
      title: 'Mutation through reference',
      code: [
        'let original = [1, 2, 3]',
        'let copy = original',
        '',
        'copy[0] = 99',
        '',
        'console.log(original[0])',
        'console.log(copy[0])',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let original = [1, 2, 3] - Array created in heap, original points to it.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = original - copy now points to the SAME array. No new array created!',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy[0] = 99 - Modifying through copy mutates the shared array!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original[0]) outputs 99. The original sees the change!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1' },
          ],
          output: ['99'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy[0]) also outputs 99. Both see the same data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1' },
          ],
          output: ['99', '99'],
        },
      ],
      insight: 'When two variables reference the same array, mutation through either affects both!',
    },
    {
      id: 'multiple-references',
      title: 'Multiple references',
      code: [
        'let data = [10, 20, 30]',
        'let ref1 = data',
        'let ref2 = data',
        'let ref3 = data',
        '',
        'ref2[1] = 999',
        '',
        'console.log(data[1])',
        'console.log(ref1[1])',
        'console.log(ref3[1])',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let data = [10, 20, 30] - Array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let ref1 = data - ref1 now points to the same array.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'let ref2 = data - ref2 also points to the same array.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'let ref3 = data - Now 4 variables all point to the SAME array!',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'ref2[1] = 999 - Mutating through ref2 affects the shared array.',
          phase: 'mutate',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 7,
          description: 'console.log(data[1]) outputs 999 - data sees the mutation.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999'],
        },
        {
          id: 7,
          codeLine: 8,
          description: 'console.log(ref1[1]) also outputs 999 - ref1 sees it too.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999', '999'],
        },
        {
          id: 8,
          codeLine: 9,
          description: 'console.log(ref3[1]) outputs 999 - ALL references see the same change!',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999', '999', '999'],
        },
      ],
      insight: 'Any number of variables can reference the same array. They all see the same data!',
    },
  ],
  intermediate: [
    {
      id: 'spread-creates-copy',
      title: 'Spread creates a copy',
      code: [
        'let arr1 = [1, 2, 3]',
        'let arr2 = [...arr1]',
        '',
        'arr2.push(4)',
        '',
        'console.log(arr1)',
        'console.log(arr2)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let arr1 = [1, 2, 3] - Array created in heap as #1.',
          phase: 'reference',
          stack: [
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let arr2 = [...arr1] - Spread creates a NEW array in heap as #2! Elements are copied, but it\'s a different object.',
          phase: 'reference',
          stack: [
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #2', isReference: true, refId: 'array2', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'arr2.push(4) - Only #2 is mutated. #1 remains unchanged because they are different arrays!',
          phase: 'mutate',
          stack: [
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3, 4], label: '#2', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(arr1) outputs [1, 2, 3] - Original unaffected!',
          phase: 'result',
          stack: [
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3, 4], label: '#2' },
          ],
          output: ['[1, 2, 3]'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(arr2) outputs [1, 2, 3, 4] - Only the copy has the new element.',
          phase: 'result',
          stack: [
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3, 4], label: '#2' },
          ],
          output: ['[1, 2, 3]', '[1, 2, 3, 4]'],
        },
      ],
      insight: 'The spread operator [...arr] creates a NEW array in memory. Changes to the copy don\'t affect the original!',
    },
    {
      id: 'reference-vs-spread',
      title: 'Reference copy vs Spread copy',
      code: [
        'let original = [1, 2, 3]',
        '',
        'let refCopy = original',
        'let spreadCopy = [...original]',
        '',
        'refCopy.push(4)',
        'spreadCopy.push(5)',
        '',
        'console.log(original)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let original = [1, 2, 3] - Array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'let refCopy = original - Reference copy! refCopy points to the SAME array #1.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'refCopy', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'let spreadCopy = [...original] - Spread creates a NEW array #2! Independent copy.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'refCopy', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'spreadCopy', value: '-> #2', isReference: true, refId: 'array2', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'refCopy.push(4) - Mutates #1. Both original AND refCopy see this change!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'refCopy', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'spreadCopy', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1', highlight: 'mutated' },
            { id: 'array2', type: 'array', elements: [1, 2, 3], label: '#2' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'spreadCopy.push(5) - Only mutates #2. original is NOT affected.',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'refCopy', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'spreadCopy', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3, 5], label: '#2', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 8,
          description: 'console.log(original) outputs [1, 2, 3, 4] - The refCopy mutation affected it, but spreadCopy mutation did not!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'refCopy', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'spreadCopy', value: '-> #2', isReference: true, refId: 'array2' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
            { id: 'array2', type: 'array', elements: [1, 2, 3, 5], label: '#2' },
          ],
          output: ['[1, 2, 3, 4]'],
        },
      ],
      insight: 'Reference copy (=) shares the same array. Spread copy ([...]) creates an independent array.',
    },
    {
      id: 'shallow-copy-warning',
      title: 'Shallow copy warning',
      code: [
        'let matrix = [[1, 2], [3, 4]]',
        'let copy = [...matrix]',
        '',
        'copy[0].push(99)',
        '',
        'console.log(matrix[0])',
        'console.log(copy[0])',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let matrix = [[1, 2], [3, 4]] - Nested arrays! Outer array #1 contains references to inner arrays #2 and #3.',
          phase: 'reference',
          stack: [
            { name: 'matrix', value: '-> #1', isReference: true, refId: 'outer1', highlight: 'new' },
          ],
          heap: [
            { id: 'outer1', type: 'array', elements: ['-> #2', '-> #3'], label: '#1', highlight: 'new' },
            { id: 'inner1', type: 'array', elements: [1, 2], label: '#2', highlight: 'new' },
            { id: 'inner2', type: 'array', elements: [3, 4], label: '#3', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = [...matrix] - Spread creates NEW outer array #4, but the inner arrays #2 and #3 are NOT copied!',
          phase: 'reference',
          stack: [
            { name: 'matrix', value: '-> #1', isReference: true, refId: 'outer1' },
            { name: 'copy', value: '-> #4', isReference: true, refId: 'outer2', highlight: 'new' },
          ],
          heap: [
            { id: 'outer1', type: 'array', elements: ['-> #2', '-> #3'], label: '#1' },
            { id: 'inner1', type: 'array', elements: [1, 2], label: '#2' },
            { id: 'inner2', type: 'array', elements: [3, 4], label: '#3' },
            { id: 'outer2', type: 'array', elements: ['-> #2', '-> #3'], label: '#4', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy[0].push(99) - Mutates #2. Both matrix AND copy share this inner array!',
          phase: 'mutate',
          stack: [
            { name: 'matrix', value: '-> #1', isReference: true, refId: 'outer1' },
            { name: 'copy', value: '-> #4', isReference: true, refId: 'outer2' },
          ],
          heap: [
            { id: 'outer1', type: 'array', elements: ['-> #2', '-> #3'], label: '#1' },
            { id: 'inner1', type: 'array', elements: [1, 2, 99], label: '#2', highlight: 'mutated' },
            { id: 'inner2', type: 'array', elements: [3, 4], label: '#3' },
            { id: 'outer2', type: 'array', elements: ['-> #2', '-> #3'], label: '#4' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(matrix[0]) outputs [1, 2, 99] - matrix sees the change even though we modified through copy!',
          phase: 'result',
          stack: [
            { name: 'matrix', value: '-> #1', isReference: true, refId: 'outer1' },
            { name: 'copy', value: '-> #4', isReference: true, refId: 'outer2' },
          ],
          heap: [
            { id: 'outer1', type: 'array', elements: ['-> #2', '-> #3'], label: '#1' },
            { id: 'inner1', type: 'array', elements: [1, 2, 99], label: '#2' },
            { id: 'inner2', type: 'array', elements: [3, 4], label: '#3' },
            { id: 'outer2', type: 'array', elements: ['-> #2', '-> #3'], label: '#4' },
          ],
          output: ['[1, 2, 99]'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy[0]) also outputs [1, 2, 99] - Same inner array!',
          phase: 'result',
          stack: [
            { name: 'matrix', value: '-> #1', isReference: true, refId: 'outer1' },
            { name: 'copy', value: '-> #4', isReference: true, refId: 'outer2' },
          ],
          heap: [
            { id: 'outer1', type: 'array', elements: ['-> #2', '-> #3'], label: '#1' },
            { id: 'inner1', type: 'array', elements: [1, 2, 99], label: '#2' },
            { id: 'inner2', type: 'array', elements: [3, 4], label: '#3' },
            { id: 'outer2', type: 'array', elements: ['-> #2', '-> #3'], label: '#4' },
          ],
          output: ['[1, 2, 99]', '[1, 2, 99]'],
        },
      ],
      insight: 'Spread creates a SHALLOW copy. Nested arrays/objects are still shared references!',
    },
  ],
  advanced: [
    {
      id: 'map-transforms',
      title: 'map() transforms each element',
      code: [
        'const nums = [1, 2, 3]',
        'const doubled = nums.map(n => n * 2)',
        '',
        'console.log(doubled)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. We will see how map() processes each element.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'const nums = [1, 2, 3] - Source array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'map() starts - Processing index 0. Callback receives 1, returns 1 * 2 = 2.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'map',
            currentIndex: 0,
            resultArray: [2],
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: 'map() continues - Processing index 1. Callback receives 2, returns 2 * 2 = 4.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'map',
            currentIndex: 1,
            resultArray: [2, 4],
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'map() continues - Processing index 2. Callback receives 3, returns 3 * 2 = 6.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'map',
            currentIndex: 2,
            resultArray: [2, 4, 6],
          },
        },
        {
          id: 5,
          codeLine: 1,
          description: 'map() complete! New array [2, 4, 6] is created and assigned to doubled.',
          phase: 'reference',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'doubled', value: '-> #2', isReference: true, refId: 'doubled', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'doubled', type: 'array', elements: [2, 4, 6], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 3,
          description: 'console.log(doubled) outputs [2, 4, 6]. Original array is unchanged!',
          phase: 'result',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'doubled', value: '-> #2', isReference: true, refId: 'doubled' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3], label: '#1' },
            { id: 'doubled', type: 'array', elements: [2, 4, 6], label: '#2' },
          ],
          output: ['[2, 4, 6]'],
        },
      ],
      insight: 'map() creates a NEW array by transforming each element. The original array is never modified!',
    },
    {
      id: 'filter-keeps',
      title: 'filter() keeps matching elements',
      code: [
        'const nums = [1, 2, 3, 4, 5]',
        'const evens = nums.filter(n => n % 2 === 0)',
        '',
        'console.log(evens)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. We will see how filter() tests each element.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'const nums = [1, 2, 3, 4, 5] - Source array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'filter() starts - Index 0: 1 % 2 === 0 is FALSE. Element REJECTED.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'filter',
            currentIndex: 0,
            resultArray: [],
            rejected: [0],
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: 'filter() continues - Index 1: 2 % 2 === 0 is TRUE. Element KEPT!',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'filter',
            currentIndex: 1,
            resultArray: [2],
            rejected: [0],
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'filter() continues - Index 2: 3 % 2 === 0 is FALSE. Element REJECTED.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'filter',
            currentIndex: 2,
            resultArray: [2],
            rejected: [0, 2],
          },
        },
        {
          id: 5,
          codeLine: 1,
          description: 'filter() continues - Index 3: 4 % 2 === 0 is TRUE. Element KEPT!',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'filter',
            currentIndex: 3,
            resultArray: [2, 4],
            rejected: [0, 2],
          },
        },
        {
          id: 6,
          codeLine: 1,
          description: 'filter() continues - Index 4: 5 % 2 === 0 is FALSE. Element REJECTED.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'filter',
            currentIndex: 4,
            resultArray: [2, 4],
            rejected: [0, 2, 4],
          },
        },
        {
          id: 7,
          codeLine: 1,
          description: 'filter() complete! New array [2, 4] with only elements that passed the test.',
          phase: 'reference',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'evens', value: '-> #2', isReference: true, refId: 'evens', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
            { id: 'evens', type: 'array', elements: [2, 4], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 8,
          codeLine: 3,
          description: 'console.log(evens) outputs [2, 4]. Only even numbers made it through!',
          phase: 'result',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'evens', value: '-> #2', isReference: true, refId: 'evens' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4, 5], label: '#1' },
            { id: 'evens', type: 'array', elements: [2, 4], label: '#2' },
          ],
          output: ['[2, 4]'],
        },
      ],
      insight: 'filter() tests each element and creates a NEW array with only the elements that pass. Rejected elements are excluded.',
    },
    {
      id: 'reduce-accumulates',
      title: 'reduce() accumulates to single value',
      code: [
        'const nums = [1, 2, 3, 4]',
        'const sum = nums.reduce((acc, n) => acc + n, 0)',
        '',
        'console.log(sum)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. We will see how reduce() accumulates a single value.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'const nums = [1, 2, 3, 4] - Source array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'reduce() starts with initial value 0. Index 0: acc=0, n=1. Returns 0 + 1 = 1.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'reduce',
            currentIndex: 0,
            accumulator: 1,
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: 'reduce() continues - Index 1: acc=1, n=2. Returns 1 + 2 = 3.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'reduce',
            currentIndex: 1,
            accumulator: 3,
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'reduce() continues - Index 2: acc=3, n=3. Returns 3 + 3 = 6.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'reduce',
            currentIndex: 2,
            accumulator: 6,
          },
        },
        {
          id: 5,
          codeLine: 1,
          description: 'reduce() continues - Index 3: acc=6, n=4. Returns 6 + 4 = 10.',
          phase: 'iterate',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: [],
          iterationState: {
            method: 'reduce',
            currentIndex: 3,
            accumulator: 10,
          },
        },
        {
          id: 6,
          codeLine: 1,
          description: 'reduce() complete! Final accumulator value 10 is assigned to sum.',
          phase: 'setup',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'sum', value: '10', highlight: 'new' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: [],
        },
        {
          id: 7,
          codeLine: 3,
          description: 'console.log(sum) outputs 10. The entire array reduced to a single value!',
          phase: 'result',
          stack: [
            { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
            { name: 'sum', value: '10' },
          ],
          heap: [
            { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: ['10'],
        },
      ],
      insight: 'reduce() processes each element to build a single accumulated value. The accumulator carries forward through each iteration.',
    },
  ]
}

export function ArraysBasicsViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample?.steps[stepIndex]

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const getSharedRefWarning = () => {
    if (!currentStep || currentStep.phase !== 'mutate') return null

    const refCounts = new Map<string, string[]>()
    currentStep.stack.forEach(item => {
      if (item.isReference && item.refId) {
        const existing = refCounts.get(item.refId) || []
        existing.push(item.name)
        refCounts.set(item.refId, existing)
      }
    })

    for (const [, names] of refCounts) {
      if (names.length > 1) {
        return names
      }
    }
    return null
  }

  const sharedRefVars = getSharedRefWarning()

  if (!currentStep) {
    return (
      <div className={styles.container}>
        <div className={styles.levelSelector}>
          {(Object.keys(levelInfo) as Level[]).map(lvl => (
            <button
              key={lvl}
              className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
              onClick={() => handleLevelChange(lvl)}
              disabled={examples[lvl].length === 0}
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
        <div className={styles.emptyState}>No examples available for this level yet.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            disabled={examples[lvl].length === 0}
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

      <div className={styles.mainGrid}>
        <CodePanel
          code={currentExample.code}
          highlightedLine={currentStep.codeLine}
          title="Code"
        />

        <div className={styles.memoryPanel}>
          <div className={styles.stackSection}>
            <div className={styles.sectionHeader}>Stack</div>
            <div className={styles.stackItems}>
              <AnimatePresence mode="popLayout">
                {currentStep.stack.length === 0 ? (
                  <div className={styles.emptySection}>(empty)</div>
                ) : (
                  currentStep.stack.slice().reverse().map((item) => (
                    <motion.div
                      key={item.name}
                      className={`${styles.stackItem} ${item.isReference ? styles.reference : ''} ${item.highlight === 'new' ? styles.highlightNew : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <span className={styles.varName}>{item.name}</span>
                      <span className={styles.varValue}>{item.value}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.heapSection}>
            <div className={styles.sectionHeader}>Heap</div>
            <div className={styles.heapObjects}>
              <AnimatePresence>
                {sharedRefVars && (
                  <motion.div
                    className={styles.warningBadge}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <span className={styles.warningIcon}>!</span>
                    <span className={styles.warningText}>
                      Both {sharedRefVars.join(' and ')} affected!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {currentStep.heap.length === 0 ? (
                  <div className={styles.emptySection}>(empty)</div>
                ) : (
                  currentStep.heap.map((obj) => (
                    <motion.div
                      key={obj.id}
                      className={`${styles.heapObject} ${obj.highlight === 'mutated' ? styles.highlightMutated : ''} ${obj.highlight === 'new' ? styles.highlightNew : ''}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <div className={styles.objectLabel}>{obj.label}</div>
                      <div className={styles.arrayElements}>
                        [{obj.elements.join(', ')}]
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {currentStep.iterationState && (
        <div className={styles.iterationPanel}>
          <div className={styles.iterationHeader}>
            <span className={styles.methodBadge}>
              {currentStep.iterationState.method}()
            </span>
            <span className={styles.iterationIndex}>
              Index {currentStep.iterationState.currentIndex}
            </span>
          </div>

          <div className={styles.iterationContent}>
            <div className={styles.sourceArraySection}>
              <div className={styles.iterationLabel}>Source Array</div>
              <div className={styles.sourceElements}>
                {currentStep.heap[0]?.elements.map((el, idx) => {
                  const isCurrent = idx === currentStep.iterationState!.currentIndex
                  const isRejected = currentStep.iterationState!.rejected?.includes(idx)
                  const isPast = idx < currentStep.iterationState!.currentIndex
                  return (
                    <motion.div
                      key={idx}
                      className={`${styles.sourceElement} ${isCurrent ? styles.currentElement : ''} ${isRejected ? styles.rejectedElement : ''} ${isPast && !isRejected ? styles.processedElement : ''}`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={styles.elementIndex}>[{idx}]</span>
                      <span className={styles.elementValue}>{el}</span>
                      {currentStep.iterationState!.method === 'filter' && isPast && (
                        <span className={isRejected ? styles.filterMark : styles.filterKeep}>
                          {isRejected ? '\u00D7' : '\u2713'}
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {currentStep.iterationState.method === 'reduce' && currentStep.iterationState.accumulator !== undefined && (
              <div className={styles.accumulatorSection}>
                <div className={styles.iterationLabel}>Accumulator</div>
                <motion.div
                  className={styles.accumulatorValue}
                  key={currentStep.iterationState.accumulator}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {currentStep.iterationState.accumulator}
                </motion.div>
              </div>
            )}

            {(currentStep.iterationState.method === 'map' || currentStep.iterationState.method === 'filter') && currentStep.iterationState.resultArray && (
              <div className={styles.resultArraySection}>
                <div className={styles.iterationLabel}>Result Array</div>
                <div className={styles.resultElements}>
                  <span className={styles.bracket}>[</span>
                  <AnimatePresence mode="popLayout">
                    {currentStep.iterationState.resultArray.map((el, idx) => (
                      <motion.span
                        key={`${idx}-${el}`}
                        className={styles.resultElement}
                        initial={{ opacity: 0, scale: 0.5, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {idx > 0 && <span className={styles.comma}>, </span>}
                        {el}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {currentStep.iterationState.resultArray.length === 0 && (
                    <span className={styles.emptyResult}>empty</span>
                  )}
                  <span className={styles.bracket}>]</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.outputBox}>
        <div className={styles.boxHeader}>Console Output</div>
        <div className={styles.outputContent}>
          <AnimatePresence>
            {currentStep.output.length === 0 ? (
              <span className={styles.placeholder}>No output yet</span>
            ) : (
              currentStep.output.map((line, i) => (
                <motion.div
                  key={i}
                  className={styles.outputLine}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {line}
                </motion.div>
              ))
            )}
          </AnimatePresence>
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
    </div>
  )
}
