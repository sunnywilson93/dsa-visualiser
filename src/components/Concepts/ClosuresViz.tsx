import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ClosuresViz.module.css'

interface ExecutionContext {
  id: string
  name: string
  variables: { name: string; value: string }[]
  outerRef: string | null
}

interface HeapObject {
  id: string
  label: string
  type: 'scope' | 'function'
  vars: { name: string; value: string }[]
  scopeRef?: string
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  callStack: ExecutionContext[]
  heap: HeapObject[]
  output: string[]
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
      id: 'basic-closure',
      title: 'Basic Closure',
      code: [
        'function outer() {',
        '  let x = 10;',
        '  function inner() {',
        '    return x;',
        '  }',
        '  return inner;',
        '}',
        '',
        'const fn = outer();',
        'fn();  // 10',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created - outer function is defined',
          highlightLines: [],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'undefined' }], outerRef: null }],
          heap: [],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'outer() is called - new EC pushed onto stack',
          highlightLines: [8],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'undefined' }], outerRef: null },
            { id: 'outer', name: 'outer() EC', variables: [], outerRef: 'global' }
          ],
          heap: [],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'let x = 10 - x is stored in outer\'s scope (will live in heap)',
          highlightLines: [1],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'undefined' }], outerRef: null },
            { id: 'outer', name: 'outer() EC', variables: [{ name: 'x', value: '10' }], outerRef: 'global' }
          ],
          heap: [{ id: 'scope1', label: 'outer Scope', type: 'scope', vars: [{ name: 'x', value: '10' }] }],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'inner function is created - it captures reference to outer\'s scope via [[Scope]]',
          highlightLines: [2, 3, 4],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'undefined' }], outerRef: null },
            { id: 'outer', name: 'outer() EC', variables: [{ name: 'x', value: '10' }], outerRef: 'global' }
          ],
          heap: [
            { id: 'scope1', label: 'outer Scope', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'innerFn', label: 'inner Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ outer Scope' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Return',
          description: 'outer() returns inner - EC is destroyed, but outer\'s Scope survives! This is the CLOSURE',
          highlightLines: [5],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'fn()' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'outer Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'innerFn', label: 'fn Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ outer Scope' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 5,
          phase: 'Execution',
          description: 'fn() is called - it can still access x through its [[Scope]] reference!',
          highlightLines: [9],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'fn', value: 'fn()' }], outerRef: null },
            { id: 'fn1', name: 'fn() EC', variables: [], outerRef: 'scope1' }
          ],
          heap: [
            { id: 'scope1', label: 'outer Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'innerFn', label: 'fn Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ outer Scope' }], scopeRef: 'scope1' }
          ],
          output: ['→ 10'],
        },
      ],
      insight: 'A closure is formed when an inner function is returned from an outer function, maintaining access to the outer function\'s variables even after the outer function has completed.'
    },
    {
      id: 'counter',
      title: 'Counter',
      code: [
        'function createCounter() {',
        '  let count = 0;',
        '  return function() {',
        '    count++;',
        '    return count;',
        '  };',
        '}',
        '',
        'const counter = createCounter();',
        'counter();  // 1',
        'counter();  // 2',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created',
          highlightLines: [],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null }],
          heap: [],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'createCounter() is called',
          highlightLines: [8],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
            { id: 'createCounter', name: 'createCounter() EC', variables: [], outerRef: 'global' }
          ],
          heap: [],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'count = 0 is initialized in createCounter\'s scope',
          highlightLines: [1],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
            { id: 'createCounter', name: 'createCounter() EC', variables: [{ name: 'count', value: '0' }], outerRef: 'global' }
          ],
          heap: [{ id: 'scope1', label: 'createCounter Scope', type: 'scope', vars: [{ name: 'count', value: '0' }] }],
          output: [],
        },
        {
          id: 3,
          phase: 'Return',
          description: 'Function returned with closure over count. EC destroyed, scope preserved!',
          highlightLines: [2, 3, 4, 5],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'createCounter Scope (CLOSED)', type: 'scope', vars: [{ name: 'count', value: '0' }] },
            { id: 'counterFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'counter() called - count++ modifies the closed-over variable!',
          highlightLines: [9],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
            { id: 'counter1', name: 'counter() EC', variables: [], outerRef: 'scope1' }
          ],
          heap: [
            { id: 'scope1', label: 'createCounter Scope (CLOSED)', type: 'scope', vars: [{ name: 'count', value: '1' }] },
            { id: 'counterFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
          ],
          output: ['→ 1'],
        },
        {
          id: 5,
          phase: 'Execution',
          description: 'counter() called again - same closure scope, count is now 2!',
          highlightLines: [10],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'fn()' }], outerRef: null },
            { id: 'counter2', name: 'counter() EC', variables: [], outerRef: 'scope1' }
          ],
          heap: [
            { id: 'scope1', label: 'createCounter Scope (CLOSED)', type: 'scope', vars: [{ name: 'count', value: '2' }] },
            { id: 'counterFn', label: 'counter Function', type: 'function', vars: [{ name: '[[Scope]]', value: '→ createCounter Scope' }], scopeRef: 'scope1' }
          ],
          output: ['→ 1', '→ 2'],
        },
      ],
      insight: 'The closure allows count to persist between function calls, creating private state that only the returned function can access and modify.'
    },
  ],
  intermediate: [
    {
      id: 'private-vars',
      title: 'Private Variables',
      code: [
        'function createPerson(name) {',
        '  let _age = 0;  // private!',
        '  return {',
        '    getName: () => name,',
        '    getAge: () => _age,',
        '    birthday: () => _age++',
        '  };',
        '}',
        '',
        'const person = createPerson("Alice");',
        'person.birthday();',
        'person.getAge();  // 1',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'createPerson is defined in global scope',
          highlightLines: [],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'person', value: 'undefined' }], outerRef: null }],
          heap: [],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'createPerson("Alice") called - name parameter captured',
          highlightLines: [9],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'person', value: 'undefined' }], outerRef: null },
            { id: 'createPerson', name: 'createPerson() EC', variables: [{ name: 'name', value: '"Alice"' }, { name: '_age', value: '0' }], outerRef: 'global' }
          ],
          heap: [{ id: 'scope1', label: 'createPerson Scope', type: 'scope', vars: [{ name: 'name', value: '"Alice"' }, { name: '_age', value: '0' }] }],
          output: [],
        },
        {
          id: 2,
          phase: 'Return',
          description: 'Object with 3 methods returned - ALL close over the same scope!',
          highlightLines: [2, 3, 4, 5, 6],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'person', value: '{...}' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'createPerson Scope (PRIVATE)', type: 'scope', vars: [{ name: 'name', value: '"Alice"' }, { name: '_age', value: '0' }] },
            { id: 'obj', label: 'person Object', type: 'function', vars: [{ name: 'getName', value: 'fn → scope' }, { name: 'getAge', value: 'fn → scope' }, { name: 'birthday', value: 'fn → scope' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'person.birthday() - modifies _age through closure. _age is truly private!',
          highlightLines: [10],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'person', value: '{...}' }], outerRef: null },
            { id: 'birthday', name: 'birthday() EC', variables: [], outerRef: 'scope1' }
          ],
          heap: [
            { id: 'scope1', label: 'createPerson Scope (PRIVATE)', type: 'scope', vars: [{ name: 'name', value: '"Alice"' }, { name: '_age', value: '1' }] },
            { id: 'obj', label: 'person Object', type: 'function', vars: [{ name: 'getName', value: 'fn → scope' }, { name: 'getAge', value: 'fn → scope' }, { name: 'birthday', value: 'fn → scope' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'person.getAge() returns 1 - accessing private _age through closure',
          highlightLines: [11],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'person', value: '{...}' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'createPerson Scope (PRIVATE)', type: 'scope', vars: [{ name: 'name', value: '"Alice"' }, { name: '_age', value: '1' }] },
            { id: 'obj', label: 'person Object', type: 'function', vars: [{ name: 'getName', value: 'fn → scope' }, { name: 'getAge', value: 'fn → scope' }, { name: 'birthday', value: 'fn → scope' }], scopeRef: 'scope1' }
          ],
          output: ['→ 1'],
        },
      ],
      insight: 'Closures enable the module pattern - _age cannot be accessed directly from outside. This was JS\'s way of creating private members before class private fields (#).'
    },
    {
      id: 'multiple-closures',
      title: 'Multiple Closures',
      code: [
        'function makeAdder(x) {',
        '  return (y) => x + y;',
        '}',
        '',
        'const add5 = makeAdder(5);',
        'const add10 = makeAdder(10);',
        '',
        'add5(3);   // 8',
        'add10(3);  // 13',
      ],
      steps: [
        {
          id: 0,
          phase: 'Execution',
          description: 'makeAdder(5) called - creates closure with x = 5',
          highlightLines: [4],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'undefined' }, { name: 'add10', value: 'undefined' }], outerRef: null },
            { id: 'makeAdder1', name: 'makeAdder(5) EC', variables: [{ name: 'x', value: '5' }], outerRef: 'global' }
          ],
          heap: [{ id: 'scope1', label: 'makeAdder Scope #1', type: 'scope', vars: [{ name: 'x', value: '5' }] }],
          output: [],
        },
        {
          id: 1,
          phase: 'Return',
          description: 'add5 gets function with closure over x=5',
          highlightLines: [4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'fn()' }, { name: 'add10', value: 'undefined' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'Closure #1 (x=5)', type: 'scope', vars: [{ name: 'x', value: '5' }] },
            { id: 'add5Fn', label: 'add5', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #1' }], scopeRef: 'scope1' }
          ],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'makeAdder(10) called - creates SEPARATE closure with x = 10',
          highlightLines: [5],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'fn()' }, { name: 'add10', value: 'undefined' }], outerRef: null },
            { id: 'makeAdder2', name: 'makeAdder(10) EC', variables: [{ name: 'x', value: '10' }], outerRef: 'global' }
          ],
          heap: [
            { id: 'scope1', label: 'Closure #1 (x=5)', type: 'scope', vars: [{ name: 'x', value: '5' }] },
            { id: 'add5Fn', label: 'add5', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #1' }], scopeRef: 'scope1' },
            { id: 'scope2', label: 'Closure #2 (x=10)', type: 'scope', vars: [{ name: 'x', value: '10' }] }
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Return',
          description: 'Two independent closures now exist - each with its own x!',
          highlightLines: [5],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'fn()' }, { name: 'add10', value: 'fn()' }], outerRef: null }],
          heap: [
            { id: 'scope1', label: 'Closure #1 (x=5)', type: 'scope', vars: [{ name: 'x', value: '5' }] },
            { id: 'add5Fn', label: 'add5', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #1' }], scopeRef: 'scope1' },
            { id: 'scope2', label: 'Closure #2 (x=10)', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'add10Fn', label: 'add10', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #2' }], scopeRef: 'scope2' }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'add5(3) uses closure #1 where x=5: 5+3=8',
          highlightLines: [7],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'fn()' }, { name: 'add10', value: 'fn()' }], outerRef: null },
            { id: 'add5Call', name: 'add5(3) EC', variables: [{ name: 'y', value: '3' }], outerRef: 'scope1' }
          ],
          heap: [
            { id: 'scope1', label: 'Closure #1 (x=5)', type: 'scope', vars: [{ name: 'x', value: '5' }] },
            { id: 'add5Fn', label: 'add5', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #1' }], scopeRef: 'scope1' },
            { id: 'scope2', label: 'Closure #2 (x=10)', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'add10Fn', label: 'add10', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #2' }], scopeRef: 'scope2' }
          ],
          output: ['→ 8'],
        },
        {
          id: 5,
          phase: 'Execution',
          description: 'add10(3) uses closure #2 where x=10: 10+3=13',
          highlightLines: [8],
          callStack: [
            { id: 'global', name: 'Global EC', variables: [{ name: 'add5', value: 'fn()' }, { name: 'add10', value: 'fn()' }], outerRef: null },
            { id: 'add10Call', name: 'add10(3) EC', variables: [{ name: 'y', value: '3' }], outerRef: 'scope2' }
          ],
          heap: [
            { id: 'scope1', label: 'Closure #1 (x=5)', type: 'scope', vars: [{ name: 'x', value: '5' }] },
            { id: 'add5Fn', label: 'add5', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #1' }], scopeRef: 'scope1' },
            { id: 'scope2', label: 'Closure #2 (x=10)', type: 'scope', vars: [{ name: 'x', value: '10' }] },
            { id: 'add10Fn', label: 'add10', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Closure #2' }], scopeRef: 'scope2' }
          ],
          output: ['→ 8', '→ 13'],
        },
      ],
      insight: 'Each call to makeAdder creates a NEW closure scope. add5 and add10 don\'t share state - they each have their own captured x value.'
    },
  ],
  advanced: [
    {
      id: 'loop-closure',
      title: 'Loop Closure Bug',
      code: [
        '// Classic interview gotcha!',
        'for (var i = 0; i < 3; i++) {',
        '  setTimeout(() => {',
        '    console.log(i);',
        '  }, 100);',
        '}',
        '// Output: 3, 3, 3 (not 0, 1, 2!)',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'var i is hoisted to function/global scope - only ONE i exists',
          highlightLines: [1],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '0' }], outerRef: null }],
          heap: [],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'Loop iteration 1: setTimeout schedules callback, closure captures reference to i (not value!)',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '0' }], outerRef: null }],
          heap: [{ id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] }],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Loop iteration 2: Another callback, SAME i reference',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '1' }], outerRef: null }],
          heap: [
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] },
            { id: 'cb2', label: 'Callback #2', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] }
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'Loop iteration 3: Third callback, still referencing same i',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '2' }], outerRef: null }],
          heap: [
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] },
            { id: 'cb2', label: 'Callback #2', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] },
            { id: 'cb3', label: 'Callback #3', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i)' }] }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'Loop ends: i is now 3 (exit condition). All callbacks still reference this same i!',
          highlightLines: [1],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '3' }], outerRef: null }],
          heap: [
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i=3)' }] },
            { id: 'cb2', label: 'Callback #2', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i=3)' }] },
            { id: 'cb3', label: 'Callback #3', type: 'function', vars: [{ name: '[[Scope]]', value: '→ global (i=3)' }] }
          ],
          output: [],
        },
        {
          id: 5,
          phase: 'Execution',
          description: 'After 100ms: All callbacks run, all read i which is 3. Output: 3, 3, 3!',
          highlightLines: [6],
          callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'i', value: '3' }], outerRef: null }],
          heap: [],
          output: ['3', '3', '3'],
        },
      ],
      insight: 'var creates ONE variable for all iterations. Closures capture REFERENCES not values. Fix: use let (block-scoped) or create new scope with IIFE.'
    },
    {
      id: 'loop-fix',
      title: 'Loop Fix (let)',
      code: [
        '// Fixed with let!',
        'for (let i = 0; i < 3; i++) {',
        '  setTimeout(() => {',
        '    console.log(i);',
        '  }, 100);',
        '}',
        '// Output: 0, 1, 2',
      ],
      steps: [
        {
          id: 0,
          phase: 'Execution',
          description: 'let creates a NEW binding for each iteration! i=0 for this iteration',
          highlightLines: [1],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [{ id: 'block1', label: 'Block Scope (iter 1)', type: 'scope', vars: [{ name: 'i', value: '0' }] }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'Callback #1 captures block scope with i=0',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [
            { id: 'block1', label: 'Block Scope (i=0)', type: 'scope', vars: [{ name: 'i', value: '0' }] },
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Block (i=0)' }], scopeRef: 'block1' }
          ],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Iteration 2: NEW block scope created with i=1',
          highlightLines: [1],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [
            { id: 'block1', label: 'Block Scope (i=0)', type: 'scope', vars: [{ name: 'i', value: '0' }] },
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Block (i=0)' }], scopeRef: 'block1' },
            { id: 'block2', label: 'Block Scope (i=1)', type: 'scope', vars: [{ name: 'i', value: '1' }] }
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'Callback #2 captures its OWN block scope with i=1',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [
            { id: 'block1', label: 'Block Scope (i=0)', type: 'scope', vars: [{ name: 'i', value: '0' }] },
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Block (i=0)' }], scopeRef: 'block1' },
            { id: 'block2', label: 'Block Scope (i=1)', type: 'scope', vars: [{ name: 'i', value: '1' }] },
            { id: 'cb2', label: 'Callback #2', type: 'function', vars: [{ name: '[[Scope]]', value: '→ Block (i=1)' }], scopeRef: 'block2' }
          ],
          output: [],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'Iteration 3 creates block scope i=2, callback #3 captures it',
          highlightLines: [2, 3, 4],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [
            { id: 'block1', label: 'Closure (i=0)', type: 'scope', vars: [{ name: 'i', value: '0' }] },
            { id: 'cb1', label: 'Callback #1', type: 'function', vars: [{ name: '[[Scope]]', value: '→ (i=0)' }], scopeRef: 'block1' },
            { id: 'block2', label: 'Closure (i=1)', type: 'scope', vars: [{ name: 'i', value: '1' }] },
            { id: 'cb2', label: 'Callback #2', type: 'function', vars: [{ name: '[[Scope]]', value: '→ (i=1)' }], scopeRef: 'block2' },
            { id: 'block3', label: 'Closure (i=2)', type: 'scope', vars: [{ name: 'i', value: '2' }] },
            { id: 'cb3', label: 'Callback #3', type: 'function', vars: [{ name: '[[Scope]]', value: '→ (i=2)' }], scopeRef: 'block3' }
          ],
          output: [],
        },
        {
          id: 5,
          phase: 'Execution',
          description: 'After 100ms: Each callback reads its OWN i. Output: 0, 1, 2!',
          highlightLines: [6],
          callStack: [{ id: 'global', name: 'Global EC', variables: [], outerRef: null }],
          heap: [],
          output: ['0', '1', '2'],
        },
      ],
      insight: 'let creates a fresh binding per iteration. Each callback has its own closure scope with its own i value. This is why let is preferred in loops.'
    },
  ],
}

export function ClosuresViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

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

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Creation': return '#60a5fa'
      case 'Execution': return '#10b981'
      case 'Return': return '#f59e0b'
      default: return '#888'
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

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.codeHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase} Phase
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.highlightLines.includes(i) ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Memory visualization */}
      <div className={styles.memoryContainer}>
        {/* Call Stack - Neon Box */}
        <div className={`${styles.neonBox} ${styles.callStackBox}`}>
          <div className={styles.neonBoxHeader}>Call Stack</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.stack}>
              <AnimatePresence mode="popLayout">
                {currentStep.callStack.slice().reverse().map((ec) => (
                  <motion.div
                    key={ec.id}
                    className={`${styles.executionContext} ${ec.id === 'global' ? styles.globalEc : ''}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                  >
                    <div className={styles.ecHeader}>{ec.name}</div>
                    <div className={styles.ecContent}>
                      <div className={styles.ecSection}>
                        <span className={styles.ecLabel}>Variables:</span>
                        {ec.variables.length > 0 ? (
                          ec.variables.map(v => (
                            <div key={v.name} className={styles.ecVar}>
                              <span className={styles.ecVarName}>{v.name}</span>
                              <span className={styles.ecVarValue}>{v.value}</span>
                            </div>
                          ))
                        ) : (
                          <span className={styles.ecEmpty}>(none)</span>
                        )}
                      </div>
                      {ec.outerRef && (
                        <div className={styles.ecSection}>
                          <span className={styles.ecLabel}>Outer:</span>
                          <span className={styles.ecRef}>→ {ec.outerRef}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Heap Memory - Neon Box */}
        <div className={`${styles.neonBox} ${styles.heapBox}`}>
          <div className={styles.neonBoxHeader}>Heap Memory</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.heap}>
              <AnimatePresence mode="popLayout">
                {currentStep.heap.length === 0 ? (
                  <motion.div key="empty" className={styles.emptyHeap} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    (empty)
                  </motion.div>
                ) : (
                  currentStep.heap.map((obj) => (
                    <motion.div
                      key={obj.id}
                      className={`${styles.heapBlock} ${obj.type === 'scope' ? styles.scopeBlock : styles.functionBlock}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <div className={styles.heapLabel}>{obj.label}</div>
                      <div className={styles.heapVars}>
                        {obj.vars.map((v) => (
                          <div key={v.name} className={styles.heapVar}>
                            <span className={styles.heapVarName}>{v.name}:</span>
                            <motion.span
                              key={v.value}
                              className={styles.heapVarValue}
                              initial={{ scale: 1.2, color: '#f59e0b' }}
                              animate={{ scale: 1, color: v.name === '[[Scope]]' ? '#a855f7' : '#10b981' }}
                            >
                              {v.value}
                            </motion.span>
                          </div>
                        ))}
                      </div>
                      {obj.label.includes('CLOSED') && (
                        <div className={styles.closureBadge}>Closure!</div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Output - Neon Box */}
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Output</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.output}>
              {currentStep.output.length === 0 ? (
                <span className={styles.emptyOutput}>—</span>
              ) : (
                currentStep.output.map((o, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={styles.outputLine}>
                    {o}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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
        <button className={styles.btnSecondary} onClick={handleReset}>
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
