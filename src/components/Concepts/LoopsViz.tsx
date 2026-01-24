import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './LoopsViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type LoopPhase = 'init' | 'condition' | 'body' | 'update' | 'done'

interface LoopBinding {
  iteration: number
  variableName: string
  value: number | string
  callbacks?: string[]
}

interface LoopStep {
  id: number
  codeLine: number
  description: string
  phase: LoopPhase
  loopState: {
    iteration: number
    variable: string
    value: number | string
    condition: string
    conditionMet: boolean
  }
  output: string[]
  currentOutputIndex?: number
  bindings?: LoopBinding[]
}

interface LoopExample {
  id: string
  title: string
  loopType: 'for' | 'while' | 'do-while' | 'for-of' | 'for-in'
  code: string[]
  steps: LoopStep[]
  insight: string
  whyItMatters?: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, LoopExample[]> = {
  beginner: [
    {
      id: 'basic-for',
      title: 'Basic for loop',
      loopType: 'for',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        '',
        'for (let i = 0; i < fruits.length; i++) {',
        '  console.log(fruits[i])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits. This is the data we want to loop through.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'The loop initializes i to 0. This variable will track which element we are on.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'Condition check: is 0 < 3? Yes! Since the condition is true, we enter the loop body.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "The loop body executes console.log(fruits[0]), which outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'After the body, i++ runs. i is now 1. This is the update step.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 2,
          description: 'Condition check: is 1 < 3? Yes! We enter the loop body again.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log(fruits[1]) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'i++ runs again. i is now 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 2,
          description: 'Condition check: is 2 < 3? Yes! One more iteration.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log(fruits[2]) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'i++ runs. i is now 3.',
          phase: 'update',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: 2,
          description: 'Condition check: is 3 < 3? No! The condition is false, so the loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Loop complete! We successfully printed all 3 fruits.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'The for loop has 3 parts: initialization (let i = 0), condition (i < length), and update (i++). The condition is checked BEFORE each iteration.',
      whyItMatters: 'for loops are perfect when you know exactly how many times to iterate.',
    },
    {
      id: 'while-loop',
      title: 'while loop',
      loopType: 'while',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        'let i = 0',
        '',
        'while (i < fruits.length) {',
        '  console.log(fruits[i])',
        '  i++',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We declare i = 0 OUTSIDE the loop. This is how while loops differ from for loops.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 3,
          description: 'Condition check: is 0 < 3? Yes! We enter the loop body.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 4,
          description: "console.log(fruits[0]) outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 5,
          description: 'We manually increment i. In while loops, YOU control the update.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'Back to the condition: is 1 < 3? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 4,
          description: "console.log(fruits[1]) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 5,
          description: 'i++ makes i = 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 3,
          description: 'Condition check: is 2 < 3? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 4,
          description: "console.log(fruits[2]) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 5,
          description: 'i++ makes i = 3.',
          phase: 'update',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: 3,
          description: 'Condition check: is 3 < 3? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Loop complete! while loops are great when you do not know how many iterations you need.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'while loops check the condition BEFORE each iteration. You must manage the loop variable yourself - forgetting i++ causes infinite loops!',
      whyItMatters: 'Use while when you do not know the number of iterations upfront.',
    },
    {
      id: 'for-of',
      title: 'for...of array',
      loopType: 'for-of',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        '',
        'for (const fruit of fruits) {',
        '  console.log(fruit)',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'fruit', value: '-', condition: 'has next?', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'for...of starts. Does the array have a first item? Yes!',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'fruit', value: '-', condition: 'has next?', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: "fruit gets the VALUE 'apple' directly. No index needed!",
          phase: 'init',
          loopState: { iteration: 1, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log(fruit) outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Does the array have another item? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 2,
          description: "fruit gets the next VALUE 'banana'.",
          phase: 'update',
          loopState: { iteration: 2, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log(fruit) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'Does the array have another item? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 2,
          description: "fruit gets the last VALUE 'cherry'.",
          phase: 'update',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log(fruit) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Does the array have another item? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: -1,
          description: 'Loop complete! for...of is the cleanest way to iterate array VALUES.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'for...of gives you VALUES directly. No index variable, no bounds checking. Perfect for when you just want each item.',
      whyItMatters: 'Use for...of for cleaner code when you do not need the index.',
    },
    {
      id: 'for-in',
      title: 'for...in object',
      loopType: 'for-in',
      code: [
        "const person = { name: 'Alice', age: 25, city: 'NYC' }",
        '',
        'for (const key in person) {',
        '  console.log(key, person[key])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an object with 3 properties: name, age, and city.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'key', value: '-', condition: 'has key?', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'for...in starts. Does the object have a first key? Yes!',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'key', value: '-', condition: 'has key?', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: "key gets the KEY 'name' (not the value!).",
          phase: 'init',
          loopState: { iteration: 1, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log('name', person['name']) outputs 'name Alice'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Does the object have another key? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
        },
        {
          id: 5,
          codeLine: 2,
          description: "key gets the next KEY 'age'.",
          phase: 'update',
          loopState: { iteration: 2, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log('age', person['age']) outputs 'age 25'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'Does the object have another key? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
        },
        {
          id: 8,
          codeLine: 2,
          description: "key gets the last KEY 'city'.",
          phase: 'update',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log('city', person['city']) outputs 'city NYC'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25', 'city NYC'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Does the object have another key? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: false },
          output: ['name Alice', 'age 25', 'city NYC'],
        },
        {
          id: 11,
          codeLine: -1,
          description: 'Loop complete! for...in iterates over KEYS (property names), not values.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: false },
          output: ['name Alice', 'age 25', 'city NYC'],
        },
      ],
      insight: 'for...in gives you KEYS (property names). Use person[key] to get values. Warning: Do not use for...in on arrays - use for...of instead!',
      whyItMatters: 'Use for...in for objects. It iterates over enumerable properties.',
    },
  ],
  intermediate: [
    {
      id: 'for-break',
      title: 'for with break',
      loopType: 'for',
      code: [
        'const nums = [1, 2, 3, 4, 5]',
        '',
        'for (let i = 0; i < nums.length; i++) {',
        '  if (nums[i] === 3) break',
        '  console.log(nums[i])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Array initialized with 5 numbers.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 5', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'Loop init: i = 0.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 5', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'Condition: 0 < 5 = true, enter loop.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 5', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'Check: nums[0] === 3? No (1 !== 3). Continue.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 5', conditionMet: true },
          output: [],
        },
        {
          id: 4,
          codeLine: 4,
          description: 'Log nums[0] = 1.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 5', conditionMet: true },
          output: ['1'],
          currentOutputIndex: 0,
        },
        {
          id: 5,
          codeLine: 2,
          description: 'Update: i++ makes i = 1.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 5', conditionMet: false },
          output: ['1'],
        },
        {
          id: 6,
          codeLine: 2,
          description: 'Condition: 1 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 5', conditionMet: true },
          output: ['1'],
        },
        {
          id: 7,
          codeLine: 3,
          description: 'Check: nums[1] === 3? No (2 !== 3). Continue.',
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 5', conditionMet: true },
          output: ['1'],
        },
        {
          id: 8,
          codeLine: 4,
          description: 'Log nums[1] = 2.',
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 5', conditionMet: true },
          output: ['1', '2'],
          currentOutputIndex: 1,
        },
        {
          id: 9,
          codeLine: 2,
          description: 'Update: i++ makes i = 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 5', conditionMet: false },
          output: ['1', '2'],
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Condition: 2 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 5', conditionMet: true },
          output: ['1', '2'],
        },
        {
          id: 11,
          codeLine: 3,
          description: 'Check: nums[2] === 3? YES! break encountered.',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 5', conditionMet: true },
          output: ['1', '2'],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'break exits the entire loop immediately. Remaining elements (4, 5) never checked.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: 'break', conditionMet: false },
          output: ['1', '2'],
        },
      ],
      insight: 'break immediately exits the entire loop, not just the current iteration.',
      whyItMatters: 'Use break for early termination when you found what you need.',
    },
    {
      id: 'for-continue',
      title: 'for with continue',
      loopType: 'for',
      code: [
        'const nums = [1, 2, 3, 4, 5]',
        '',
        'for (let i = 0; i < nums.length; i++) {',
        '  if (nums[i] === 3) continue',
        '  console.log(nums[i])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Array initialized.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 5', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'Loop init: i = 0.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 5', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'Condition: 0 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 5', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'nums[0] !== 3, log 1.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 5', conditionMet: true },
          output: ['1'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Update: i = 1. Condition: 1 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 5', conditionMet: true },
          output: ['1'],
        },
        {
          id: 5,
          codeLine: 4,
          description: 'nums[1] !== 3, log 2.',
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 5', conditionMet: true },
          output: ['1', '2'],
          currentOutputIndex: 1,
        },
        {
          id: 6,
          codeLine: 2,
          description: 'Update: i = 2. Condition: 2 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 5', conditionMet: true },
          output: ['1', '2'],
        },
        {
          id: 7,
          codeLine: 3,
          description: 'nums[2] === 3! continue: skip remaining body, jump to update.',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 5', conditionMet: true },
          output: ['1', '2'],
        },
        {
          id: 8,
          codeLine: 2,
          description: 'Update: i = 3. Condition: 3 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 4, variable: 'i', value: 3, condition: '3 < 5', conditionMet: true },
          output: ['1', '2'],
        },
        {
          id: 9,
          codeLine: 4,
          description: 'nums[3] !== 3, log 4.',
          phase: 'body',
          loopState: { iteration: 4, variable: 'i', value: 3, condition: '3 < 5', conditionMet: true },
          output: ['1', '2', '4'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Update: i = 4. Condition: 4 < 5 = true.',
          phase: 'condition',
          loopState: { iteration: 5, variable: 'i', value: 4, condition: '4 < 5', conditionMet: true },
          output: ['1', '2', '4'],
        },
        {
          id: 11,
          codeLine: 4,
          description: 'nums[4] !== 3, log 5.',
          phase: 'body',
          loopState: { iteration: 5, variable: 'i', value: 4, condition: '4 < 5', conditionMet: true },
          output: ['1', '2', '4', '5'],
          currentOutputIndex: 3,
        },
        {
          id: 12,
          codeLine: 2,
          description: 'Update: i = 5. Condition: 5 < 5 = false. Loop exits.',
          phase: 'condition',
          loopState: { iteration: 5, variable: 'i', value: 5, condition: '5 < 5', conditionMet: false },
          output: ['1', '2', '4', '5'],
        },
        {
          id: 13,
          codeLine: -1,
          description: 'Done. continue skipped only iteration 3 (the value 3). Loop completed all iterations.',
          phase: 'done',
          loopState: { iteration: 5, variable: 'i', value: 5, condition: '5 < 5', conditionMet: false },
          output: ['1', '2', '4', '5'],
        },
      ],
      insight: 'continue skips to the next iteration, not breaking out of the loop.',
      whyItMatters: 'Use continue to skip specific items while processing the rest.',
    },
    {
      id: 'while-complex',
      title: 'while with complex condition',
      loopType: 'while',
      code: [
        'let count = 0',
        'let found = false',
        '',
        'while (count < 5 && !found) {',
        '  if (count === 3) found = true',
        '  console.log(count)',
        '  count++',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Initialize count = 0.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'count', value: 0, condition: 'count < 5 && !found', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 1,
          description: 'Initialize found = false.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'found', value: 'false', condition: 'count < 5 && !found', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 3,
          description: 'Condition: 0 < 5 (true) && !false (true) = true.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'count', value: 0, condition: '0 < 5 && !false', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'count !== 3, found stays false.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'count', value: 0, condition: '0 < 5 && !false', conditionMet: true },
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'Log count = 0.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'count', value: 0, condition: '0 < 5 && !false', conditionMet: true },
          output: ['0'],
          currentOutputIndex: 0,
        },
        {
          id: 5,
          codeLine: 6,
          description: 'count++ makes count = 1.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'count', value: 1, condition: 'count < 5 && !found', conditionMet: false },
          output: ['0'],
        },
        {
          id: 6,
          codeLine: 3,
          description: 'Condition: 1 < 5 (true) && !false (true) = true.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'count', value: 1, condition: '1 < 5 && !false', conditionMet: true },
          output: ['0'],
        },
        {
          id: 7,
          codeLine: 5,
          description: 'Log count = 1.',
          phase: 'body',
          loopState: { iteration: 2, variable: 'count', value: 1, condition: '1 < 5 && !false', conditionMet: true },
          output: ['0', '1'],
          currentOutputIndex: 1,
        },
        {
          id: 8,
          codeLine: 6,
          description: 'count++ makes count = 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'count', value: 2, condition: 'count < 5 && !found', conditionMet: false },
          output: ['0', '1'],
        },
        {
          id: 9,
          codeLine: 3,
          description: 'Condition: 2 < 5 (true) && !false (true) = true.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'count', value: 2, condition: '2 < 5 && !false', conditionMet: true },
          output: ['0', '1'],
        },
        {
          id: 10,
          codeLine: 5,
          description: 'Log count = 2.',
          phase: 'body',
          loopState: { iteration: 3, variable: 'count', value: 2, condition: '2 < 5 && !false', conditionMet: true },
          output: ['0', '1', '2'],
          currentOutputIndex: 2,
        },
        {
          id: 11,
          codeLine: 6,
          description: 'count++ makes count = 3.',
          phase: 'update',
          loopState: { iteration: 3, variable: 'count', value: 3, condition: 'count < 5 && !found', conditionMet: false },
          output: ['0', '1', '2'],
        },
        {
          id: 12,
          codeLine: 3,
          description: 'Condition: 3 < 5 (true) && !false (true) = true.',
          phase: 'condition',
          loopState: { iteration: 4, variable: 'count', value: 3, condition: '3 < 5 && !false', conditionMet: true },
          output: ['0', '1', '2'],
        },
        {
          id: 13,
          codeLine: 4,
          description: 'count === 3! Set found = true.',
          phase: 'body',
          loopState: { iteration: 4, variable: 'found', value: 'true', condition: '3 < 5 && !true', conditionMet: true },
          output: ['0', '1', '2'],
        },
        {
          id: 14,
          codeLine: 5,
          description: 'Log count = 3.',
          phase: 'body',
          loopState: { iteration: 4, variable: 'count', value: 3, condition: '3 < 5 && !true', conditionMet: true },
          output: ['0', '1', '2', '3'],
          currentOutputIndex: 3,
        },
        {
          id: 15,
          codeLine: 6,
          description: 'count++ makes count = 4.',
          phase: 'update',
          loopState: { iteration: 4, variable: 'count', value: 4, condition: 'count < 5 && !found', conditionMet: false },
          output: ['0', '1', '2', '3'],
        },
        {
          id: 16,
          codeLine: 3,
          description: 'Condition: 4 < 5 (true) && !true (false) = FALSE. Loop exits!',
          phase: 'condition',
          loopState: { iteration: 4, variable: 'count', value: 4, condition: '4 < 5 && !true', conditionMet: false },
          output: ['0', '1', '2', '3'],
        },
        {
          id: 17,
          codeLine: -1,
          description: 'Done. The && condition short-circuited when found became true.',
          phase: 'done',
          loopState: { iteration: 4, variable: 'count', value: 4, condition: 'false', conditionMet: false },
          output: ['0', '1', '2', '3'],
        },
      ],
      insight: 'Multiple conditions can control loop termination - useful for search patterns.',
      whyItMatters: 'Combine conditions with && or || to create flexible loop termination.',
    },
    {
      id: 'for-of-entries',
      title: 'for...of with index',
      loopType: 'for-of',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        '',
        'for (const [index, fruit] of fruits.entries()) {',
        '  console.log(index, fruit)',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Array initialized with 3 fruits.',
          phase: 'init',
          loopState: { iteration: 0, variable: '[index, fruit]', value: '-', condition: 'has next entry?', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'entries() returns iterator of [index, value] pairs.',
          phase: 'init',
          loopState: { iteration: 0, variable: '[index, fruit]', value: 'iterator', condition: 'has next entry?', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'First entry: [0, "apple"]. Destructure: index=0, fruit="apple".',
          phase: 'condition',
          loopState: { iteration: 1, variable: '[0, apple]', value: 'destructured', condition: 'has next entry?', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'Log: 0 apple.',
          phase: 'body',
          loopState: { iteration: 1, variable: '[0, apple]', value: 'logged', condition: 'has next entry?', conditionMet: true },
          output: ['0 apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Next entry: [1, "banana"]. Destructure: index=1, fruit="banana".',
          phase: 'condition',
          loopState: { iteration: 2, variable: '[1, banana]', value: 'destructured', condition: 'has next entry?', conditionMet: true },
          output: ['0 apple'],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'Log: 1 banana.',
          phase: 'body',
          loopState: { iteration: 2, variable: '[1, banana]', value: 'logged', condition: 'has next entry?', conditionMet: true },
          output: ['0 apple', '1 banana'],
          currentOutputIndex: 1,
        },
        {
          id: 6,
          codeLine: 2,
          description: 'Next entry: [2, "cherry"]. Destructure: index=2, fruit="cherry".',
          phase: 'condition',
          loopState: { iteration: 3, variable: '[2, cherry]', value: 'destructured', condition: 'has next entry?', conditionMet: true },
          output: ['0 apple', '1 banana'],
        },
        {
          id: 7,
          codeLine: 3,
          description: 'Log: 2 cherry.',
          phase: 'body',
          loopState: { iteration: 3, variable: '[2, cherry]', value: 'logged', condition: 'has next entry?', conditionMet: true },
          output: ['0 apple', '1 banana', '2 cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 8,
          codeLine: 2,
          description: 'No more entries. Iterator exhausted.',
          phase: 'condition',
          loopState: { iteration: 3, variable: '[2, cherry]', value: 'done', condition: 'has next entry?', conditionMet: false },
          output: ['0 apple', '1 banana', '2 cherry'],
        },
        {
          id: 9,
          codeLine: -1,
          description: 'Done. entries() + destructuring gives both index AND value cleanly.',
          phase: 'done',
          loopState: { iteration: 3, variable: '[2, cherry]', value: 'done', condition: 'complete', conditionMet: false },
          output: ['0 apple', '1 banana', '2 cherry'],
        },
      ],
      insight: 'entries() gives you both index and value - best of both worlds.',
      whyItMatters: 'When you need the index with for...of, use entries() instead of a separate counter.',
    },
  ],
  advanced: [
    {
      id: 'nested-loop',
      title: 'Nested for loops',
      loopType: 'for',
      code: [
        'for (let i = 0; i < 2; i++) {',
        '  for (let j = 0; j < 2; j++) {',
        '    console.log(i, j)',
        '  }',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Outer loop init: i = 0.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 2', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'Outer condition: 0 < 2 = true. Enter outer loop.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 2', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'Inner loop init: j = 0.',
          phase: 'init',
          loopState: { iteration: 1, variable: 'j', value: 0, condition: 'j < 2', conditionMet: false },
          output: [],
        },
        {
          id: 3,
          codeLine: 1,
          description: 'Inner condition: 0 < 2 = true. Enter inner loop.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'j', value: 0, condition: '0 < 2', conditionMet: true },
          output: [],
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Log: i=0, j=0.',
          phase: 'body',
          loopState: { iteration: 1, variable: '[i,j]', value: '[0,0]', condition: 'inner', conditionMet: true },
          output: ['0 0'],
          currentOutputIndex: 0,
        },
        {
          id: 5,
          codeLine: 1,
          description: 'Inner j++: j = 1. Condition: 1 < 2 = true.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'j', value: 1, condition: '1 < 2', conditionMet: true },
          output: ['0 0'],
        },
        {
          id: 6,
          codeLine: 2,
          description: 'Log: i=0, j=1.',
          phase: 'body',
          loopState: { iteration: 1, variable: '[i,j]', value: '[0,1]', condition: 'inner', conditionMet: true },
          output: ['0 0', '0 1'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 1,
          description: 'Inner j++: j = 2. Condition: 2 < 2 = false. Inner loop exits.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'j', value: 2, condition: '2 < 2', conditionMet: false },
          output: ['0 0', '0 1'],
        },
        {
          id: 8,
          codeLine: 0,
          description: 'Outer i++: i = 1. Condition: 1 < 2 = true.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 2', conditionMet: true },
          output: ['0 0', '0 1'],
        },
        {
          id: 9,
          codeLine: 1,
          description: 'Inner loop RESTARTS: j = 0 again.',
          phase: 'init',
          loopState: { iteration: 2, variable: 'j', value: 0, condition: 'j < 2', conditionMet: false },
          output: ['0 0', '0 1'],
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Log: i=1, j=0.',
          phase: 'body',
          loopState: { iteration: 2, variable: '[i,j]', value: '[1,0]', condition: 'inner', conditionMet: true },
          output: ['0 0', '0 1', '1 0'],
          currentOutputIndex: 2,
        },
        {
          id: 11,
          codeLine: 2,
          description: 'Log: i=1, j=1.',
          phase: 'body',
          loopState: { iteration: 2, variable: '[i,j]', value: '[1,1]', condition: 'inner', conditionMet: true },
          output: ['0 0', '0 1', '1 0', '1 1'],
          currentOutputIndex: 3,
        },
        {
          id: 12,
          codeLine: 0,
          description: 'Inner exits. Outer i++: i = 2. Condition: 2 < 2 = false. Outer exits.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: '2 < 2', conditionMet: false },
          output: ['0 0', '0 1', '1 0', '1 1'],
        },
        {
          id: 13,
          codeLine: -1,
          description: 'Done. 2x2 = 4 total iterations. Inner completes fully for EACH outer iteration.',
          phase: 'done',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'complete', conditionMet: false },
          output: ['0 0', '0 1', '1 0', '1 1'],
        },
      ],
      insight: 'Inner loop completes ALL iterations for EACH outer iteration.',
      whyItMatters: 'Nested loops multiply: O(n) * O(m) = O(n*m). Be careful with performance!',
    },
    {
      id: 'closure-bug-var',
      title: 'Closure Bug (var)',
      loopType: 'for',
      code: [
        'for (var i = 0; i < 3; i++) {',
        '  setTimeout(() => {',
        '    console.log(i)',
        '  }, 100)',
        '}',
        '// Later: 3, 3, 3',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Loop init: var i = 0. var creates ONE binding in function/global scope.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: [] }],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'Condition: 0 < 3 = true. Enter loop.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: [] }],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'Callback 1 created. Captures i by REFERENCE (not value!).',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] }],
        },
        {
          id: 3,
          codeLine: 0,
          description: 'i++: i = 1. Same binding, updated value.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 1, callbacks: ['cb1'] }],
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Callback 2 created. SAME i reference as callback 1!',
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 1, callbacks: ['cb1', 'cb2'] }],
        },
        {
          id: 5,
          codeLine: 0,
          description: 'i++: i = 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 2, callbacks: ['cb1', 'cb2'] }],
        },
        {
          id: 6,
          codeLine: 1,
          description: 'Callback 3 created. Still the SAME i reference!',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 2, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 7,
          codeLine: 0,
          description: 'i++: i = 3. Condition: 3 < 3 = false. Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 8,
          codeLine: 5,
          description: 'All 3 callbacks share ONE binding. That binding now holds i = 3.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'shared binding', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 9,
          codeLine: 2,
          description: 'After 100ms: Callback 1 runs, reads i = 3. Logs 3 (not 0!).',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'cb1 fires', conditionMet: false },
          output: ['3'],
          currentOutputIndex: 0,
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Callback 2 runs, reads same i = 3. Logs 3 (not 1!).',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'cb2 fires', conditionMet: false },
          output: ['3', '3'],
          currentOutputIndex: 1,
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 11,
          codeLine: 2,
          description: 'Callback 3 runs, reads same i = 3. Logs 3 (not 2!).',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'cb3 fires', conditionMet: false },
          output: ['3', '3', '3'],
          currentOutputIndex: 2,
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Result: 3, 3, 3. This is the classic closure bug! All callbacks shared one binding.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'BUG!', conditionMet: false },
          output: ['3', '3', '3'],
          bindings: [{ iteration: 0, variableName: 'i', value: 3, callbacks: ['cb1', 'cb2', 'cb3'] }],
        },
      ],
      insight: 'var creates ONE binding for the entire loop - all callbacks share it.',
      whyItMatters: 'This is a CLASSIC interview question. Closures capture REFERENCES not values!',
    },
    {
      id: 'closure-fix-let',
      title: 'Closure Fix (let)',
      loopType: 'for',
      code: [
        'for (let i = 0; i < 3; i++) {',
        '  setTimeout(() => {',
        '    console.log(i)',
        '  }, 100)',
        '}',
        '// Later: 0, 1, 2',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Loop init: let i = 0. let creates a NEW binding for each iteration.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: [] }],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'Condition: 0 < 3 = true. Enter loop with binding for i=0.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: [] }],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'Callback 1 created. Captures this iteration\'s binding (i=0).',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
          bindings: [{ iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] }],
        },
        {
          id: 3,
          codeLine: 0,
          description: 'i++: NEW binding created for i=1. Previous binding (i=0) preserved!',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: [] },
          ],
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Callback 2 created. Captures ITS OWN binding (i=1).',
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
          ],
        },
        {
          id: 5,
          codeLine: 0,
          description: 'i++: NEW binding for i=2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: [] },
          ],
        },
        {
          id: 6,
          codeLine: 1,
          description: 'Callback 3 created. Captures ITS OWN binding (i=2).',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 7,
          codeLine: 0,
          description: 'Loop exits. 3 SEPARATE bindings exist, each with its captured value.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 8,
          codeLine: 5,
          description: 'Each callback has its OWN binding with the value at that iteration.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: '-', condition: 'separate bindings', conditionMet: false },
          output: [],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 9,
          codeLine: 2,
          description: 'After 100ms: Callback 1 reads its binding: i = 0. Logs 0!',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 0, condition: 'cb1 fires', conditionMet: false },
          output: ['0'],
          currentOutputIndex: 0,
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Callback 2 reads its binding: i = 1. Logs 1!',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 1, condition: 'cb2 fires', conditionMet: false },
          output: ['0', '1'],
          currentOutputIndex: 1,
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 11,
          codeLine: 2,
          description: 'Callback 3 reads its binding: i = 2. Logs 2!',
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: 'cb3 fires', conditionMet: false },
          output: ['0', '1', '2'],
          currentOutputIndex: 2,
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Result: 0, 1, 2. let creates per-iteration bindings - the fix!',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: '-', condition: 'FIXED!', conditionMet: true },
          output: ['0', '1', '2'],
          bindings: [
            { iteration: 0, variableName: 'i', value: 0, callbacks: ['cb1'] },
            { iteration: 1, variableName: 'i', value: 1, callbacks: ['cb2'] },
            { iteration: 2, variableName: 'i', value: 2, callbacks: ['cb3'] },
          ],
        },
      ],
      insight: 'let creates a NEW binding for EACH iteration - each callback gets its own.',
      whyItMatters: 'This is why let is preferred in modern JS. Per-iteration bindings prevent closure bugs.',
    },
    {
      id: 'do-while',
      title: 'do-while loop',
      loopType: 'do-while',
      code: [
        'let i = 5',
        '',
        'do {',
        '  console.log(i)',
        '  i++',
        '} while (i < 3)',
        '',
        '// Logs 5 (runs once even though 5 > 3!)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Initialize i = 5. Note: 5 is already >= 3!',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 5, condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'do-while: body executes FIRST, before any condition check.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 5, condition: '(not checked yet)', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 3,
          description: 'Log i = 5. Body runs unconditionally on first pass.',
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 5, condition: '(not checked yet)', conditionMet: true },
          output: ['5'],
          currentOutputIndex: 0,
        },
        {
          id: 3,
          codeLine: 4,
          description: 'i++ makes i = 6.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 6, condition: 'i < 3', conditionMet: false },
          output: ['5'],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'NOW condition is checked: 6 < 3 = false. Loop exits.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 6, condition: '6 < 3', conditionMet: false },
          output: ['5'],
        },
        {
          id: 5,
          codeLine: -1,
          description: 'Done. Body ran ONCE even though initial value (5) failed condition (< 3).',
          phase: 'done',
          loopState: { iteration: 1, variable: 'i', value: 6, condition: 'complete', conditionMet: false },
          output: ['5'],
        },
      ],
      insight: 'do-while ALWAYS executes the body at least once, then checks condition.',
      whyItMatters: 'Use do-while when you need at least one execution (e.g., input validation prompts).',
    },
  ],
}

export function LoopsViz() {
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

        <div className={styles.loopStateBox}>
          <div className={styles.boxHeader}>Loop State</div>
          <div className={styles.boxContent}>
            <div className={styles.stateRow}>
              <span className={styles.stateLabel}>Iteration:</span>
              <motion.span
                key={currentStep.loopState.iteration}
                className={styles.stateValue}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {currentStep.loopState.iteration}
              </motion.span>
            </div>
            <div className={styles.stateRow}>
              <span className={styles.stateLabel}>{currentStep.loopState.variable}:</span>
              <motion.span
                key={String(currentStep.loopState.value)}
                className={styles.stateValue}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {currentStep.loopState.value}
              </motion.span>
            </div>
            <div className={styles.conditionRow}>
              <span className={`${styles.condition} ${currentStep.loopState.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
                {currentStep.loopState.condition} = {currentStep.loopState.conditionMet ? 'true' : 'false'}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                  className={`${styles.outputLine} ${i === currentStep.currentOutputIndex ? styles.currentOutput : ''}`}
                  initial={i === currentStep.currentOutputIndex ? { opacity: 0, x: -10 } : undefined}
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
