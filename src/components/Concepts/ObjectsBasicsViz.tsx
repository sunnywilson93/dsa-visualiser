import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface ObjectProperty {
  key: string
  value: string | number | boolean
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'deleted' | 'none'
}

interface HeapObject {
  id: string
  type: 'object'
  properties: ObjectProperty[]
  label: string
  highlight?: 'mutated' | 'new' | 'none'
}

interface DestructureState {
  sourceRefId: string
  extractedProps: {
    propKey: string
    targetVar: string
    value: string
    status: 'pending' | 'extracting' | 'complete'
  }[]
}

interface ObjectStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'destructure' | 'spread' | 'result'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
  destructureState?: DestructureState
}

interface ObjectExample {
  id: string
  title: string
  code: string[]
  steps: ObjectStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, ObjectExample[]> = {
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
        'let obj1 = { name: "Alice" }',
        'let obj2 = obj1',
        'obj2.name = "Bob"',
        'console.log(obj1.name)',
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
          description: 'let obj1 = { name: "Alice" } - Object created in HEAP. obj1 stores a REFERENCE to it.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }], label: '#1', highlight: 'new' },
          ],
          output: ['5 10'],
        },
        {
          id: 6,
          codeLine: 6,
          description: 'let obj2 = obj1 - The REFERENCE is copied, not the object! Both point to the SAME heap object.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }], label: '#1' },
          ],
          output: ['5 10'],
        },
        {
          id: 7,
          codeLine: 7,
          description: 'obj2.name = "Bob" - Mutates the heap object. Since obj1 and obj2 point to the same object, obj1 sees the change!',
          phase: 'mutate',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }], label: '#1', highlight: 'mutated' },
          ],
          output: ['5 10'],
        },
        {
          id: 8,
          codeLine: 8,
          description: 'console.log(obj1.name) outputs "Bob". obj1 sees the change made through obj2!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Bob' }], label: '#1' },
          ],
          output: ['5 10', 'Bob'],
        },
      ],
      insight: 'Primitives are copied by VALUE (independent). Objects are copied by REFERENCE (shared)!',
    },
    {
      id: 'mutation-through-reference',
      title: 'Mutation through reference',
      code: [
        'let original = { name: "Alice", age: 25 }',
        'let copy = original',
        '',
        'copy.name = "Bob"',
        '',
        'console.log(original.name)',
        'console.log(copy.name)',
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
          description: 'let original = { name: "Alice", age: 25 } - Object created in heap, original points to it.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = original - copy now points to the SAME object. No new object created!',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy.name = "Bob" - Modifying through copy mutates the shared object!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }, { key: 'age', value: 25 }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original.name) outputs "Bob". The original sees the change!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Bob'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy.name) also outputs "Bob". Both see the same data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Bob', 'Bob'],
        },
      ],
      insight: 'When two variables reference the same object, mutation through either affects both!',
    },
    {
      id: 'multiple-references',
      title: 'Multiple references',
      code: [
        'let data = { count: 0 }',
        'let ref1 = data',
        'let ref2 = data',
        'let ref3 = data',
        '',
        'ref2.count = 999',
        '',
        'console.log(data.count)',
        'console.log(ref1.count)',
        'console.log(ref3.count)',
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
          description: 'let data = { count: 0 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let ref1 = data - ref1 now points to the same object.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'let ref2 = data - ref2 also points to the same object.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'let ref3 = data - Now 4 variables all point to the SAME object!',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'ref2.count = 999 - Mutating through ref2 affects the shared object.',
          phase: 'mutate',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999, highlight: 'changed' }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 7,
          description: 'console.log(data.count) outputs 999 - data sees the mutation.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999'],
        },
        {
          id: 7,
          codeLine: 8,
          description: 'console.log(ref1.count) also outputs 999 - ref1 sees it too.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999', '999'],
        },
        {
          id: 8,
          codeLine: 9,
          description: 'console.log(ref3.count) outputs 999 - ALL references see the same change!',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999', '999', '999'],
        },
      ],
      insight: 'Any number of variables can reference the same object. They all see the same data!',
    },
  ],
  intermediate: [
    {
      id: 'spread-creates-copy',
      title: 'Spread creates a copy',
      code: [
        'let original = { name: "Alice", age: 25 }',
        'let copy = { ...original }',
        '',
        'copy.name = "Bob"',
        '',
        'console.log(original.name)',
        'console.log(copy.name)',
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
          description: 'let original = { name: "Alice", age: 25 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = { ...original } - Spread creates a NEW object #2 with COPIED values!',
          phase: 'spread',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy.name = "Bob" - Only modifies #2. original (#1) is NOT affected!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }, { key: 'age', value: 25 }], label: '#2', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original.name) outputs "Alice" - original is unchanged!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#2' },
          ],
          output: ['Alice'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy.name) outputs "Bob" - copy has its own independent data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#2' },
          ],
          output: ['Alice', 'Bob'],
        },
      ],
      insight: 'Spread { ...obj } creates a NEW object. Changes to the copy don\'t affect the original!',
    },
    {
      id: 'adding-deleting-properties',
      title: 'Adding and deleting properties',
      code: [
        'let user = { name: "Alice" }',
        '',
        'user.email = "alice@test.com"',
        '',
        'delete user.name',
        '',
        'console.log(user)',
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
          description: 'let user = { name: "Alice" } - Object created with one property.',
          phase: 'reference',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'user.email = "alice@test.com" - Adding a NEW property to the object.',
          phase: 'mutate',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'email', value: 'alice@test.com', highlight: 'new' }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'delete user.name - Marking the name property for deletion...',
          phase: 'mutate',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice', highlight: 'deleted' }, { key: 'email', value: 'alice@test.com' }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 4,
          description: 'delete user.name - Property removed! The object now only has email.',
          phase: 'mutate',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'email', value: 'alice@test.com' }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(user) outputs the modified object.',
          phase: 'result',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'email', value: 'alice@test.com' }], label: '#1' },
          ],
          output: ['{ email: "alice@test.com" }'],
        },
      ],
      insight: 'Adding and deleting properties modifies the object. All references see the changes!',
    },
    {
      id: 'shallow-copy-warning',
      title: 'Shallow copy warning',
      code: [
        'let person = {',
        '  name: "Alice",',
        '  address: { city: "NYC" }',
        '}',
        '',
        'let copy = { ...person }',
        '',
        'copy.address.city = "LA"',
        '',
        'console.log(person.address.city)',
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
          description: 'Creating person object with nested address object...',
          phase: 'reference',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person', highlight: 'new' },
          ],
          heap: [
            { id: 'address', type: 'object', properties: [{ key: 'city', value: 'NYC' }], label: '#2', highlight: 'new' },
            { id: 'person', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 5,
          description: 'let copy = { ...person } - Spread creates a NEW object #3, but ONLY copies top-level values!',
          phase: 'spread',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person' },
            { name: 'copy', value: '-> #3', isReference: true, refId: 'copy', highlight: 'new' },
          ],
          heap: [
            { id: 'address', type: 'object', properties: [{ key: 'city', value: 'NYC' }], label: '#2' },
            { id: 'person', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#1' },
            { id: 'copy', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address', highlight: 'new' }], label: '#3', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 5,
          description: 'Notice: Both person and copy point to the SAME address object #2! This is shallow copy.',
          phase: 'spread',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person' },
            { name: 'copy', value: '-> #3', isReference: true, refId: 'copy' },
          ],
          heap: [
            { id: 'address', type: 'object', properties: [{ key: 'city', value: 'NYC' }], label: '#2' },
            { id: 'person', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#1' },
            { id: 'copy', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#3' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 7,
          description: 'copy.address.city = "LA" - Mutating nested object #2 affects BOTH person and copy!',
          phase: 'mutate',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person' },
            { name: 'copy', value: '-> #3', isReference: true, refId: 'copy' },
          ],
          heap: [
            { id: 'address', type: 'object', properties: [{ key: 'city', value: 'LA', highlight: 'changed' }], label: '#2', highlight: 'mutated' },
            { id: 'person', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#1' },
            { id: 'copy', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#3' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 9,
          description: 'console.log(person.address.city) outputs "LA" - person sees the change made through copy!',
          phase: 'result',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person' },
            { name: 'copy', value: '-> #3', isReference: true, refId: 'copy' },
          ],
          heap: [
            { id: 'address', type: 'object', properties: [{ key: 'city', value: 'LA' }], label: '#2' },
            { id: 'person', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#1' },
            { id: 'copy', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'address', value: '-> #2', isReference: true, refId: 'address' }], label: '#3' },
          ],
          output: ['LA'],
        },
      ],
      insight: 'Spread creates a SHALLOW copy. Nested objects are still shared references!',
    },
  ],
  advanced: [
    {
      id: 'basic-destructuring',
      title: 'Basic destructuring',
      code: [
        'const person = { name: "Alice", age: 25 }',
        'const { name, age } = person',
        '',
        'console.log(name)',
        'console.log(age)',
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
          description: 'const person = { name: "Alice", age: 25 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1', highlight: 'new' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'const { name, age } = person - Destructuring begins. Extracting "name" from person...',
          phase: 'destructure',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice', highlight: 'changed' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'person1',
            extractedProps: [
              { propKey: 'name', targetVar: 'name', value: '"Alice"', status: 'extracting' },
              { propKey: 'age', targetVar: 'age', value: '25', status: 'pending' },
            ],
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: 'Continuing destructuring. "name" extracted, now extracting "age"...',
          phase: 'destructure',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25, highlight: 'changed' }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'person1',
            extractedProps: [
              { propKey: 'name', targetVar: 'name', value: '"Alice"', status: 'complete' },
              { propKey: 'age', targetVar: 'age', value: '25', status: 'extracting' },
            ],
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Destructuring complete! New variables "name" and "age" created with COPIES of the values.',
          phase: 'destructure',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
            { name: 'name', value: '"Alice"', highlight: 'new' },
            { name: 'age', value: '25', highlight: 'new' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'console.log(name) outputs "Alice" - reading from the destructured variable.',
          phase: 'result',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
            { name: 'name', value: '"Alice"' },
            { name: 'age', value: '25' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Alice'],
        },
        {
          id: 6,
          codeLine: 4,
          description: 'console.log(age) outputs 25 - another independent copy.',
          phase: 'result',
          stack: [
            { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
            { name: 'name', value: '"Alice"' },
            { name: 'age', value: '25' },
          ],
          heap: [
            { id: 'person1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Alice', '25'],
        },
      ],
      insight: 'Destructuring extracts properties into standalone variables. They hold copies of the primitive values!',
    },
    {
      id: 'destructuring-renaming',
      title: 'Destructuring with renaming',
      code: [
        'const user = { name: "Alice", id: 42 }',
        'const { name: userName, id: userId } = user',
        '',
        'console.log(userName)',
        'console.log(userId)',
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
          description: 'const user = { name: "Alice", id: 42 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1', highlight: 'new' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'id', value: 42 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'const { name: userName } = ... - "name: userName" means extract "name", store as "userName".',
          phase: 'destructure',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice', highlight: 'changed' }, { key: 'id', value: 42 }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'user1',
            extractedProps: [
              { propKey: 'name', targetVar: 'userName', value: '"Alice"', status: 'extracting' },
              { propKey: 'id', targetVar: 'userId', value: '42', status: 'pending' },
            ],
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: '"name" extracted as "userName". Now extracting "id" as "userId"...',
          phase: 'destructure',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'id', value: 42, highlight: 'changed' }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'user1',
            extractedProps: [
              { propKey: 'name', targetVar: 'userName', value: '"Alice"', status: 'complete' },
              { propKey: 'id', targetVar: 'userId', value: '42', status: 'extracting' },
            ],
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Complete! Note: stack shows "userName" and "userId" - the renamed variables, NOT "name" and "id".',
          phase: 'destructure',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1' },
            { name: 'userName', value: '"Alice"', highlight: 'new' },
            { name: 'userId', value: '42', highlight: 'new' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'id', value: 42 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'console.log(userName) outputs "Alice" - using the renamed variable.',
          phase: 'result',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1' },
            { name: 'userName', value: '"Alice"' },
            { name: 'userId', value: '42' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'id', value: 42 }], label: '#1' },
          ],
          output: ['Alice'],
        },
        {
          id: 6,
          codeLine: 4,
          description: 'console.log(userId) outputs 42.',
          phase: 'result',
          stack: [
            { name: 'user', value: '-> #1', isReference: true, refId: 'user1' },
            { name: 'userName', value: '"Alice"' },
            { name: 'userId', value: '42' },
          ],
          heap: [
            { id: 'user1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'id', value: 42 }], label: '#1' },
          ],
          output: ['Alice', '42'],
        },
      ],
      insight: '{ name: userName } extracts the "name" property but stores it in a variable called "userName".',
    },
    {
      id: 'destructuring-defaults',
      title: 'Destructuring with defaults',
      code: [
        'const config = { theme: "dark" }',
        'const { theme, language = "en" } = config',
        '',
        'console.log(theme)',
        'console.log(language)',
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
          description: 'const config = { theme: "dark" } - Object created with theme property.',
          phase: 'reference',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config', highlight: 'new' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark' }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'const { theme, language = "en" } = config - Extracting theme...',
          phase: 'destructure',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark', highlight: 'changed' }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'config',
            extractedProps: [
              { propKey: 'theme', targetVar: 'theme', value: '"dark"', status: 'extracting' },
              { propKey: 'language', targetVar: 'language', value: '"en" (default)', status: 'pending' },
            ],
          },
        },
        {
          id: 3,
          codeLine: 1,
          description: '"theme" found on object. Now checking "language"... NOT found on config!',
          phase: 'destructure',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark' }], label: '#1' },
          ],
          output: [],
          destructureState: {
            sourceRefId: 'config',
            extractedProps: [
              { propKey: 'theme', targetVar: 'theme', value: '"dark"', status: 'complete' },
              { propKey: 'language', targetVar: 'language', value: '"en" (default)', status: 'extracting' },
            ],
          },
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Default value "en" used for language since config has no language property.',
          phase: 'destructure',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config' },
            { name: 'theme', value: '"dark"', highlight: 'new' },
            { name: 'language', value: '"en"', highlight: 'new' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark' }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'console.log(theme) outputs "dark".',
          phase: 'result',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config' },
            { name: 'theme', value: '"dark"' },
            { name: 'language', value: '"en"' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark' }], label: '#1' },
          ],
          output: ['dark'],
        },
        {
          id: 6,
          codeLine: 4,
          description: 'console.log(language) outputs "en" (the default).',
          phase: 'result',
          stack: [
            { name: 'config', value: '-> #1', isReference: true, refId: 'config' },
            { name: 'theme', value: '"dark"' },
            { name: 'language', value: '"en"' },
          ],
          heap: [
            { id: 'config', type: 'object', properties: [{ key: 'theme', value: 'dark' }], label: '#1' },
          ],
          output: ['dark', 'en'],
        },
      ],
      insight: 'Default values provide fallback when destructuring properties that don\'t exist on the object.',
    },
  ],
}

export function ObjectsBasicsViz() {
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

  const handleReset = () => setStepIndex(0)

  return (
    <div className="flex flex-col gap-5" style={{ '--js-viz-accent': 'var(--color-brand-secondary)' } as React.CSSProperties}>
      {/* Level selector */}
      <div className="flex gap-2 justify-center flex-wrap bg-black/30 border border-white/10 rounded-full p-1.5">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 font-mono text-sm font-medium rounded-full transition-all min-h-11 ${
              level === lvl ? 'text-white' : 'bg-white/5 border border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example tabs */}
      <div className="flex gap-2 flex-wrap justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full transition-all min-h-11 ${
              exampleIndex === i
                ? 'bg-teal-500/20 border border-teal-500/70 text-white shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Code Panel */}
        <CodePanel
          code={currentExample.code}
          highlightedLine={currentStep.codeLine}
        />

        {/* Memory Panel */}
        <div className="flex flex-col gap-4">
          {/* Stack */}
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5 uppercase tracking-wider">
              Stack
            </div>
            <div className="p-4 flex flex-col gap-2 min-h-[100px]">
              {currentStep.stack.length === 0 ? (
                <div className="text-gray-600 italic text-sm text-center py-4">(empty)</div>
              ) : (
                currentStep.stack.map((item, i) => (
                  <motion.div
                    key={`${item.name}-${i}`}
                    className={`flex justify-between items-center px-4 py-2 bg-black/30 border rounded-md font-mono text-sm transition-all ${
                      item.isReference ? 'border-teal-400/40 bg-teal-500/10' : 'border-white/10'
                    } ${item.highlight === 'new' ? 'border-emerald-500/70 bg-emerald-500/15' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-gray-400">{item.name}</span>
                    <span className={`${item.isReference ? 'text-teal-400 font-semibold' : 'text-gray-300'}`}>
                      {item.value}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Heap */}
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5 uppercase tracking-wider">
              Heap
            </div>
            <div className="p-4 flex flex-col gap-3 min-h-[100px]">
              {currentStep.heap.length === 0 ? (
                <div className="text-gray-600 italic text-sm text-center py-4">(empty)</div>
              ) : (
                currentStep.heap.map((obj) => (
                  <motion.div
                    key={obj.id}
                    className={`flex flex-col gap-1 p-4 bg-teal-500/10 border-2 rounded-lg font-mono transition-all min-w-0 overflow-x-auto ${
                      obj.highlight === 'new' ? 'border-emerald-500/70 bg-emerald-500/15' : 'border-teal-400/40'
                    } ${obj.highlight === 'mutated' ? 'border-teal-400 bg-teal-500/20' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-xs font-semibold text-teal-400">{obj.label}</div>
                    <div className="flex flex-col gap-1">
                      {obj.properties.map((prop) => (
                        <div
                          key={prop.key}
                          className={`flex gap-2 py-1 font-mono text-sm ${
                            prop.highlight === 'new' ? 'bg-emerald-500/15 rounded px-2 -mx-2' : ''
                          } ${prop.highlight === 'changed' ? 'bg-teal-500/15 rounded px-2 -mx-2' : ''}
                          ${prop.highlight === 'deleted' ? 'line-through opacity-50 bg-red-500/10' : ''}`}
                        >
                          <span className="text-gray-500">{prop.key}:</span>
                          <span className="text-gray-300">
                            {prop.isReference ? `-> ${prop.value}` : String(prop.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5 uppercase tracking-wider">
          Output
        </div>
        <div className="p-4 min-h-[60px]">
          {currentStep.output.length === 0 ? (
            <span className="text-gray-600 italic text-sm">(no output)</span>
          ) : (
            currentStep.output.map((line, i) => (
              <motion.div
                key={i}
                className="font-mono text-sm text-emerald-500 py-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {line}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Destructure panel (if applicable) */}
      {currentStep.destructureState && (
        <div className="bg-black/40 border-2 border-teal-400/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2 bg-teal-500/15 border-b border-teal-400/30">
            <span className="font-mono text-sm font-bold text-white bg-teal-500 px-2.5 py-1 rounded-md">
              Destructuring
            </span>
            <span className="font-mono text-sm text-gray-400">
              from {currentStep.destructureState.sourceRefId}
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {currentStep.destructureState.extractedProps.map((prop, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-2 bg-black/30 border rounded-md font-mono text-sm ${
                  prop.status === 'pending' ? 'opacity-50 border-white/10' : ''
                } ${prop.status === 'extracting' ? 'border-teal-400 bg-teal-500/10' : ''}
                ${prop.status === 'complete' ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}
              >
                <span className="text-gray-400 min-w-20">{prop.propKey}</span>
                <span className="text-teal-400 font-bold">→</span>
                <span className="text-gray-300 font-semibold min-w-20">{prop.targetVar}</span>
                <span className="text-emerald-500">{prop.value}</span>
                {prop.status === 'complete' && (
                  <span className="text-emerald-500 font-bold ml-auto">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step progress */}
      <StepProgress
        current={stepIndex}
        total={currentExample.steps.length}
        description={currentStep.description}
      />

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
      />

      {/* Insight */}
      <div className="px-4 py-2.5 bg-teal-500/10 border border-teal-400/20 rounded-lg text-sm text-gray-400 text-center">
        <span className="font-semibold text-teal-400 mr-2">Key Insight:</span>
        {currentExample.insight}
      </div>
    </div>
  )
}
