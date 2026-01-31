import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StackItem {
  name: string
  value: string | number
  isReference?: boolean
  refId?: string
}

interface HeapObject {
  id: string
  type: 'object' | 'array' | 'function'
  label: string
  properties?: Record<string, string | number>
  elements?: (string | number)[]
  marked?: boolean // for GC visualization
}

interface Step {
  description: string
  codeLine: number
  stack: StackItem[]
  heap: HeapObject[]
  gcPhase?: 'none' | 'mark' | 'sweep'
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
      id: 'primitives-vs-objects',
      title: 'Primitives vs Objects',
      code: [
        '// Primitives (stored in Stack)',
        'let a = 10;',
        'let b = a;',
        'b = 20;',
        '',
        '// Objects (stored in Heap)',
        'let obj1 = { x: 1 };',
        'let obj2 = obj1;',
        'obj2.x = 99;',
        '',
        'console.log(a, obj1.x);',
      ],
      steps: [
        {
          description: 'Script starts. Stack is empty.',
          codeLine: -1,
          stack: [],
          heap: [],
          output: [],
        },
        {
          description: 'let a = 10 - Primitive stored directly in stack',
          codeLine: 1,
          stack: [{ name: 'a', value: 10 }],
          heap: [],
          output: [],
        },
        {
          description: 'let b = a - Value 10 is COPIED to b (independent)',
          codeLine: 2,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 10 },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'b = 20 - Only b changes, a is unaffected',
          codeLine: 3,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 20 },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'let obj1 = { x: 1 } - Object created in Heap, reference stored in Stack',
          codeLine: 6,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 20 },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { x: 1 } },
          ],
          output: [],
        },
        {
          description: 'let obj2 = obj1 - Reference is copied, BOTH point to same object!',
          codeLine: 7,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 20 },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { x: 1 } },
          ],
          output: [],
        },
        {
          description: 'obj2.x = 99 - Modifies shared object. obj1 sees the change!',
          codeLine: 8,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 20 },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { x: 99 } },
          ],
          output: [],
        },
        {
          description: 'console.log outputs: a=10 (primitive unchanged), obj1.x=99 (modified via obj2)',
          codeLine: 10,
          stack: [
            { name: 'a', value: 10 },
            { name: 'b', value: 20 },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { x: 99 } },
          ],
          output: ['10, 99'],
        },
      ],
      insight: 'Primitives are copied by VALUE (independent). Objects are copied by REFERENCE (shared)!'
    },
    {
      id: 'stack-frames',
      title: 'Stack Frames',
      code: [
        'function outer() {',
        '  let x = 1;',
        '  inner();',
        '}',
        '',
        'function inner() {',
        '  let y = 2;',
        '  console.log(y);',
        '}',
        '',
        'outer();',
      ],
      steps: [
        {
          description: 'Script starts. Global frame on stack.',
          codeLine: -1,
          stack: [{ name: '(global)', value: 'frame' }],
          heap: [],
          output: [],
        },
        {
          description: 'outer() called - new stack frame pushed',
          codeLine: 10,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'Inside outer: let x = 1 - x stored in outer frame',
          codeLine: 1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
            { name: '  x', value: 1 },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'inner() called - another frame pushed on top',
          codeLine: 2,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
            { name: '  x', value: 1 },
            { name: 'inner()', value: 'frame' },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'Inside inner: let y = 2 - y stored in inner frame',
          codeLine: 6,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
            { name: '  x', value: 1 },
            { name: 'inner()', value: 'frame' },
            { name: '  y', value: 2 },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'console.log(y) outputs 2',
          codeLine: 7,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
            { name: '  x', value: 1 },
            { name: 'inner()', value: 'frame' },
            { name: '  y', value: 2 },
          ],
          heap: [],
          output: ['2'],
        },
        {
          description: 'inner() returns - frame popped, y is destroyed',
          codeLine: 8,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'outer()', value: 'frame' },
            { name: '  x', value: 1 },
          ],
          heap: [],
          output: ['2'],
        },
        {
          description: 'outer() returns - frame popped, x is destroyed',
          codeLine: 3,
          stack: [
            { name: '(global)', value: 'frame' },
          ],
          heap: [],
          output: ['2'],
        },
      ],
      insight: 'Each function call creates a stack frame. Variables live only while their frame exists. LIFO order!'
    },
  ],
  intermediate: [
    {
      id: 'closure-memory',
      title: 'Closures in Memory',
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
        'counter();',
        'counter();',
      ],
      steps: [
        {
          description: 'Script starts',
          codeLine: -1,
          stack: [{ name: '(global)', value: 'frame' }],
          heap: [],
          output: [],
        },
        {
          description: 'createCounter() called - frame pushed',
          codeLine: 8,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'createCounter()', value: 'frame' },
          ],
          heap: [],
          output: [],
        },
        {
          description: 'let count = 0 - but count will live in closure (heap)!',
          codeLine: 1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'createCounter()', value: 'frame' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 0 } },
          ],
          output: [],
        },
        {
          description: 'Inner function created, captures closure',
          codeLine: 2,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'createCounter()', value: 'frame' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 0 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
        {
          description: 'createCounter returns. Frame popped but closure SURVIVES in heap!',
          codeLine: 8,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'counter', value: '-> fn', isReference: true, refId: 'fn' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 0 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
        {
          description: 'counter() called - accesses count from closure',
          codeLine: 9,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'counter', value: '-> fn', isReference: true, refId: 'fn' },
            { name: 'counter()', value: 'frame' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 1 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
        {
          description: 'First call done, count is now 1',
          codeLine: 9,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'counter', value: '-> fn', isReference: true, refId: 'fn' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 1 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
        {
          description: 'counter() called again - count increments to 2',
          codeLine: 10,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'counter', value: '-> fn', isReference: true, refId: 'fn' },
            { name: 'counter()', value: 'frame' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 2 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
        {
          description: 'Done! Closure keeps count alive as long as counter exists',
          codeLine: -1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'counter', value: '-> fn', isReference: true, refId: 'fn' },
          ],
          heap: [
            { id: 'closure', type: 'object', label: 'Closure', properties: { count: 2 } },
            { id: 'fn', type: 'function', label: 'function()' },
          ],
          output: [],
        },
      ],
      insight: 'Closures keep variables alive in the heap even after the function returns. Memory lives as long as closure is reachable!'
    },
    {
      id: 'arrays-objects',
      title: 'Arrays & Objects',
      code: [
        'let arr = [1, 2, 3];',
        'let obj = { a: arr };',
        '',
        'arr.push(4);',
        '',
        'console.log(obj.a);',
      ],
      steps: [
        {
          description: 'Script starts',
          codeLine: -1,
          stack: [{ name: '(global)', value: 'frame' }],
          heap: [],
          output: [],
        },
        {
          description: 'let arr = [1,2,3] - Array created in heap',
          codeLine: 0,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'arr', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', label: '#1 Array', elements: [1, 2, 3] },
          ],
          output: [],
        },
        {
          description: 'let obj = { a: arr } - Object stores reference to SAME array',
          codeLine: 1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'arr', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'obj', value: '-> #2', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'arr', type: 'array', label: '#1 Array', elements: [1, 2, 3] },
            { id: 'obj', type: 'object', label: '#2', properties: { a: '-> #1' } },
          ],
          output: [],
        },
        {
          description: 'arr.push(4) - Modifies the array. obj.a sees it too!',
          codeLine: 3,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'arr', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'obj', value: '-> #2', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'arr', type: 'array', label: '#1 Array', elements: [1, 2, 3, 4] },
            { id: 'obj', type: 'object', label: '#2', properties: { a: '-> #1' } },
          ],
          output: [],
        },
        {
          description: 'console.log(obj.a) - Shows modified array [1,2,3,4]',
          codeLine: 5,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'arr', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'obj', value: '-> #2', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'arr', type: 'array', label: '#1 Array', elements: [1, 2, 3, 4] },
            { id: 'obj', type: 'object', label: '#2', properties: { a: '-> #1' } },
          ],
          output: ['[1, 2, 3, 4]'],
        },
      ],
      insight: 'Arrays and objects can reference each other. Mutations are visible through ALL references!'
    },
  ],
  advanced: [
    {
      id: 'garbage-collection',
      title: 'Garbage Collection',
      code: [
        'let obj = { data: "important" };',
        'let ref = obj;',
        '',
        '// Remove one reference',
        'obj = null;',
        '',
        '// Object still reachable via ref',
        '',
        '// Remove last reference',
        'ref = null;',
        '',
        '// GC can now collect!',
      ],
      steps: [
        {
          description: 'Script starts',
          codeLine: -1,
          stack: [{ name: '(global)', value: 'frame' }],
          heap: [],
          gcPhase: 'none',
          output: [],
        },
        {
          description: 'let obj = { data: "important" } - Object created in heap',
          codeLine: 0,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: true },
          ],
          gcPhase: 'none',
          output: [],
        },
        {
          description: 'let ref = obj - Two references to same object',
          codeLine: 1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'ref', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: true },
          ],
          gcPhase: 'none',
          output: [],
        },
        {
          description: 'obj = null - One reference removed, but ref still points to object',
          codeLine: 4,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: true },
          ],
          gcPhase: 'none',
          output: [],
        },
        {
          description: 'GC runs MARK phase - Object is reachable via ref, so it is MARKED',
          codeLine: -1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: true },
          ],
          gcPhase: 'mark',
          output: [],
        },
        {
          description: 'ref = null - Last reference removed!',
          codeLine: 9,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: 'null' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: false },
          ],
          gcPhase: 'none',
          output: [],
        },
        {
          description: 'GC runs MARK phase - Object is NOT reachable, not marked',
          codeLine: -1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: 'null' },
          ],
          heap: [
            { id: 'obj1', type: 'object', label: '#1', properties: { data: '"important"' }, marked: false },
          ],
          gcPhase: 'mark',
          output: [],
        },
        {
          description: 'GC runs SWEEP phase - Unmarked objects are collected!',
          codeLine: -1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: 'null' },
          ],
          heap: [],
          gcPhase: 'sweep',
          output: [],
        },
        {
          description: 'Memory freed! Heap is clean.',
          codeLine: -1,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'obj', value: 'null' },
            { name: 'ref', value: 'null' },
          ],
          heap: [],
          gcPhase: 'none',
          output: [],
        },
      ],
      insight: 'GC uses Mark-and-Sweep: MARK reachable objects, SWEEP (delete) unmarked ones. Object dies when ALL references are gone!'
    },
    {
      id: 'memory-leak',
      title: 'Memory Leak',
      code: [
        'const cache = [];',
        '',
        'function processData(data) {',
        '  cache.push(data);',
        '  return data.value * 2;',
        '}',
        '',
        'processData({ value: 1 });',
        'processData({ value: 2 });',
        'processData({ value: 3 });',
        '// cache keeps growing forever!',
      ],
      steps: [
        {
          description: 'Script starts. cache array created.',
          codeLine: 0,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'cache', value: '-> #1', isReference: true, refId: 'cache' },
          ],
          heap: [
            { id: 'cache', type: 'array', label: 'cache', elements: [] },
          ],
          output: [],
        },
        {
          description: 'processData({ value: 1 }) - Object added to cache',
          codeLine: 7,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'cache', value: '-> #1', isReference: true, refId: 'cache' },
          ],
          heap: [
            { id: 'cache', type: 'array', label: 'cache', elements: ['obj1'] },
            { id: 'obj1', type: 'object', label: '#2', properties: { value: 1 } },
          ],
          output: [],
        },
        {
          description: 'processData({ value: 2 }) - Another object added',
          codeLine: 8,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'cache', value: '-> #1', isReference: true, refId: 'cache' },
          ],
          heap: [
            { id: 'cache', type: 'array', label: 'cache', elements: ['obj1', 'obj2'] },
            { id: 'obj1', type: 'object', label: '#2', properties: { value: 1 } },
            { id: 'obj2', type: 'object', label: '#3', properties: { value: 2 } },
          ],
          output: [],
        },
        {
          description: 'processData({ value: 3 }) - Cache keeps growing!',
          codeLine: 9,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'cache', value: '-> #1', isReference: true, refId: 'cache' },
          ],
          heap: [
            { id: 'cache', type: 'array', label: 'cache', elements: ['obj1', 'obj2', 'obj3'] },
            { id: 'obj1', type: 'object', label: '#2', properties: { value: 1 } },
            { id: 'obj2', type: 'object', label: '#3', properties: { value: 2 } },
            { id: 'obj3', type: 'object', label: '#4', properties: { value: 3 } },
          ],
          output: [],
        },
        {
          description: "MEMORY LEAK: Objects in cache are always reachable, never GC'd!",
          codeLine: 10,
          stack: [
            { name: '(global)', value: 'frame' },
            { name: 'cache', value: '-> #1', isReference: true, refId: 'cache' },
          ],
          heap: [
            { id: 'cache', type: 'array', label: 'cache (LEAK!)', elements: ['...'] },
            { id: 'obj1', type: 'object', label: '#2', properties: { value: 1 }, marked: true },
            { id: 'obj2', type: 'object', label: '#3', properties: { value: 2 }, marked: true },
            { id: 'obj3', type: 'object', label: '#4', properties: { value: 3 }, marked: true },
          ],
          gcPhase: 'mark',
          output: [],
        },
      ],
      insight: 'Memory leaks occur when objects remain reachable but unused. Unbounded caches, event listeners, and closures are common culprits!'
    },
  ],
}

export function MemoryModelViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const highlightedLine = currentStep.codeLine
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

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

  const getGcPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'mark': return '#a855f7'
      case 'sweep': return '#ef4444'
      default: return '#555'
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Level selector */}
      <div className="flex gap-2 justify-center mb-1 p-1.5 bg-black/30 border border-white/[0.08] rounded-full">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
              level === lvl
                ? 'text-white'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : undefined,
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span className="w-4 h-4 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-black/30 border border-white/[0.08] rounded-full">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full cursor-pointer transition-all duration-200 ${
              exampleIndex === i
                ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
        <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
          <span>Code</span>
          {currentStep.gcPhase && currentStep.gcPhase !== 'none' && (
            <span 
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ background: getGcPhaseColor(currentStep.gcPhase) }}
            >
              GC: {currentStep.gcPhase.toUpperCase()}
            </span>
          )}
        </div>
        <pre className="m-0 py-2 px-0 max-h-[180px] overflow-y-auto font-mono">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-3 py-0.5 transition-colors duration-200 ${
                currentStep.codeLine === i ? 'bg-blue-500/20' : ''
              }`}
            >
              <span className="w-6 text-gray-600 font-mono text-[10px] select-none">{i + 1}</span>
              <span className={`font-mono text-[10px] ${currentStep.codeLine === i ? 'text-blue-300' : 'text-gray-300'}`}>
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Memory visualization */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
        {/* Stack - Neon Box */}
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-orange)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Stack
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[140px] p-4 pt-6">
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {currentStep.stack.length === 0 ? (
                  <div className="text-[10px] text-gray-600 text-center py-2">(empty)</div>
                ) : (
                  currentStep.stack.slice().reverse().map((item, i) => (
                    <motion.div
                      key={item.name + i}
                      className={`flex justify-between px-3 py-1 font-mono text-[10px] rounded border ${
                        item.isReference 
                          ? 'bg-amber-500/10 border-amber-500/50' 
                          : 'bg-blue-500/15 border-blue-500/30'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <span className="text-blue-300">{item.name}</span>
                      <span className={item.isReference ? 'text-amber-400' : 'text-emerald-500'}>{item.value}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Heap - Neon Box */}
        <div className="relative rounded-xl p-[3px]" style={{ background: 'linear-gradient(135deg, var(--color-brand-primary, #3b82f6), var(--color-brand-secondary, #8b5cf6))' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Heap
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[140px] p-4 pt-6">
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {currentStep.heap.length === 0 ? (
                  <div className="text-[10px] text-gray-600 text-center py-2">(empty)</div>
                ) : (
                  currentStep.heap.map((obj) => (
                    <motion.div
                      key={obj.id}
                      className={`px-2 py-1 font-mono text-xs rounded border ${
                        obj.marked === false 
                          ? 'bg-red-500/10 border-red-500/60 opacity-70' 
                          : obj.marked === true 
                          ? 'bg-blue-500/15 border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                          : 'bg-amber-500/15 border-amber-500/40'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <div className="font-semibold text-amber-400 mb-1">{obj.label}</div>
                      {obj.type === 'object' && obj.properties && (
                        <div className="flex flex-col gap-0.5">
                          {Object.entries(obj.properties).map(([key, val]) => (
                            <div key={key} className="text-gray-300 text-[10px]">
                              <span className="text-blue-300">{key}:</span> <span className="text-emerald-500">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {obj.type === 'array' && obj.elements && (
                        <div className="text-blue-300 text-[10px]">
                          [{obj.elements.join(', ')}]
                        </div>
                      )}
                      {obj.type === 'function' && (
                        <div className="text-purple-400 italic text-[10px]">fn</div>
                      )}
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
        <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-emerald)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Output
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[50px] p-4 pt-6 flex gap-3 items-center">
            {currentStep.output.map((item, i) => (
              <span key={i} className="font-mono text-xs text-emerald-500">{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-black/30 border border-white/[0.08] rounded-lg text-base text-gray-300 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="inline-block px-1.5 py-0.5 bg-blue-500/30 rounded text-[10px] font-semibold text-blue-300 mr-2">
            Step {stepIndex + 1}/{currentExample.steps.length}
          </span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button 
          className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handlePrev} 
          disabled={stepIndex === 0}
        >
          Prev
        </button>
        <motion.button
          className="px-6 py-2 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 border-0 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next'}
        </motion.button>
        <button 
          className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Key insight */}
      <div className="px-4 py-2 bg-blue-500/[0.08] border border-blue-500/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-blue-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
