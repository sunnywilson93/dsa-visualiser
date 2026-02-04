'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './VariablesViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'

type VariableState =
  | 'not-declared'
  | 'hoisted-undefined'
  | 'hoisted-tdz'
  | 'initialized'
  | 'error'

interface Variable {
  name: string
  keyword: 'var' | 'let' | 'const'
  value: string | undefined
  state: VariableState
  scope: string
  scopeLevel: number
}

interface Scope {
  id: string
  type: 'global' | 'function' | 'block'
  name: string
  level: number
  variables: string[]
}

interface HoistingAnimation {
  variableName: string
  keyword: 'var' | 'let' | 'const'
  fromLine: number
  toPosition: 'top'
}

interface VariableStep {
  id: number
  codeLine: number
  description: string
  phase: 'creation' | 'execution'
  action: 'declare' | 'hoist' | 'access' | 'assign' | 'lookup' | 'error'
  variables: Variable[]
  scopes?: Scope[]
  lookupPath?: string[]
  output: string[]
  error?: string
  hoistingAnimation?: HoistingAnimation
}

interface VariableExample {
  id: string
  title: string
  code: string[]
  steps: VariableStep[]
  insight: string
  whyItMatters?: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const stateColors: Record<VariableState, string> = {
  'not-declared': '#6b7280',
  'hoisted-undefined': 'var(--color-amber-500)',
  'hoisted-tdz': 'var(--color-red-500)',
  'initialized': 'var(--color-emerald-500)',
  'error': 'var(--color-red-500)'
}

const keywordColors: Record<'var' | 'let' | 'const', string> = {
  var: 'var(--color-amber-500)',
  let: '#3b82f6',
  const: 'var(--color-emerald-500)'
}

const stateLabels: Record<VariableState, string> = {
  'not-declared': 'not declared',
  'hoisted-undefined': 'hoisted',
  'hoisted-tdz': 'TDZ',
  'initialized': 'initialized',
  'error': 'error'
}

const examples: Record<Level, VariableExample[]> = {
  beginner: [
    {
      id: 'var-declaration',
      title: 'var hoisting',
      code: [
        'console.log(x);',
        'var x = 5;',
        'console.log(x);',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Before execution starts, JavaScript scans the code and hoists var declarations to the top.',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 0,
          description: 'We try to access x before its declaration line. Because var hoists, x exists but is undefined.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined']
        },
        {
          id: 2,
          codeLine: 1,
          description: 'Now we reach the actual declaration. The assignment happens: x gets the value 5.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined']
        },
        {
          id: 3,
          codeLine: 2,
          description: 'Accessing x again now returns 5, since the assignment has happened.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined', '5']
        },
        {
          id: 4,
          codeLine: -1,
          description: 'Done! var hoists the declaration but NOT the assignment. That is why we saw undefined first.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined', '5']
        }
      ],
      insight: 'var declarations are hoisted to the top of their scope and initialized with undefined. The assignment stays where you wrote it.',
      whyItMatters: 'Understanding hoisting prevents confusing bugs where variables seem to exist before declaration.'
    },
    {
      id: 'let-declaration',
      title: 'let basics',
      code: [
        'let y = 10;',
        'console.log(y);',
        'y = 20;',
        'console.log(y);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'let declares and initializes y with the value 10 in one step.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'y', keyword: 'let', value: '10', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We access y. It exists and has the value 10.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '10', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10']
        },
        {
          id: 2,
          codeLine: 2,
          description: 'We reassign y to a new value. let allows reassignment (unlike const).',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10']
        },
        {
          id: 3,
          codeLine: 3,
          description: 'Accessing y again shows the updated value 20.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10', '20']
        },
        {
          id: 4,
          codeLine: -1,
          description: 'Done! let creates block-scoped variables that can be reassigned but not redeclared.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10', '20']
        }
      ],
      insight: 'let creates block-scoped variables. Unlike var, let does not hoist in a usable way - accessing before declaration throws an error.',
      whyItMatters: 'let is the modern choice for variables that need to change. It prevents accidental redeclaration.'
    },
    {
      id: 'const-declaration',
      title: 'const with objects',
      code: [
        "const person = { name: 'Alice' };",
        "person.name = 'Bob';",
        'console.log(person.name);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'const creates a constant binding. The variable person now points to an object.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Alice' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We modify a property INSIDE the object. This is allowed! const only prevents reassigning the variable itself.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 2,
          description: "Accessing person.name shows 'Bob'. The object's internals changed, but person still points to the same object.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['Bob']
        },
        {
          id: 3,
          codeLine: -1,
          description: 'Done! const prevents reassignment (person = something), but object mutations are allowed.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['Bob']
        }
      ],
      insight: 'const creates a constant BINDING, not a constant VALUE. You cannot reassign the variable, but you CAN mutate objects and arrays.',
      whyItMatters: 'This is a common gotcha! Many developers think const makes objects immutable - it does not.'
    },
    {
      id: 'basic-block-scope',
      title: 'Block scope',
      code: [
        "let x = 'outer';",
        'if (true) {',
        "  let x = 'inner';",
        '  console.log(x);',
        '}',
        'console.log(x);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: "We declare x in the outer (global) scope with the value 'outer'.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We enter the if block. This creates a new block scope.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: [] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 2,
          description: "Inside the block, we declare a NEW x. This shadows (hides) the outer x within this block.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'block:1', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log(x) inside the block finds the inner x first. It logs 'inner'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'block:1', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: ['x'] }
          ],
          lookupPath: ['block:1', 'global'],
          output: ['inner']
        },
        {
          id: 4,
          codeLine: 4,
          description: 'We exit the if block. The inner x is destroyed - it only existed within that block.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['inner']
        },
        {
          id: 5,
          codeLine: 5,
          description: "console.log(x) outside the block finds the outer x. It logs 'outer'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['inner', 'outer']
        },
        {
          id: 6,
          codeLine: -1,
          description: 'Done! let creates block-scoped variables. The inner x only existed inside the if block.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['inner', 'outer']
        }
      ],
      insight: 'let and const are block-scoped. Variables declared inside {} only exist within that block. This prevents accidental variable collisions.',
      whyItMatters: 'Block scope is why let/const are preferred. Each block can have its own isolated variables.'
    }
  ],
  intermediate: [
    {
      id: 'var-vs-let-hoisting',
      title: 'var vs let hoisting',
      code: [
        'console.log(a);',
        '// console.log(b); // Would be TDZ error',
        'var a = 1;',
        'let b = 2;',
        'console.log(a, b);',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Creation phase: JavaScript scans the code. var declarations are hoisted with value undefined. let declarations are hoisted but placed in the Temporal Dead Zone (TDZ).',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 0,
          description: 'Execution: We access a before its declaration line. Because var hoists with undefined, this works - it logs undefined.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          lookupPath: ['global'],
          output: ['undefined']
        },
        {
          id: 2,
          codeLine: 1,
          description: 'If we tried to access b here, we would get a ReferenceError! let variables exist in the TDZ from the start of the scope until their declaration.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 3,
          codeLine: 2,
          description: 'We reach the var declaration. The assignment happens: a gets the value 1.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 4,
          codeLine: 3,
          description: 'We reach the let declaration. NOW b exits the TDZ and gets initialized with 2. Only now is b accessible.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 5,
          codeLine: 4,
          description: 'Now both a and b are initialized. We can access both safely and log their values.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          lookupPath: ['global'],
          output: ['undefined', '1 2']
        },
        {
          id: 6,
          codeLine: -1,
          description: 'Done! Both var and let hoist, but var initializes to undefined while let stays in the TDZ until its declaration.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined', '1 2']
        }
      ],
      insight: 'Both var and let are hoisted, but var is initialized with undefined while let stays in the Temporal Dead Zone (TDZ) until its declaration line.',
      whyItMatters: 'The TDZ makes let/const safer - accessing before declaration throws an error instead of silently giving undefined.'
    },
    {
      id: 'function-vs-block-scope',
      title: 'function vs block scope',
      code: [
        'function test() {',
        '  if (true) {',
        '    var x = 1;',
        '    let y = 2;',
        '  }',
        '  console.log(x);',
        '  // console.log(y); // Error!',
        '}',
        'test();',
      ],
      steps: [
        {
          id: 0,
          codeLine: 8,
          description: 'We call test(). A new function scope is created. JavaScript hoists var x to the function scope (not block scope).',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We enter the if block. This creates a new block scope. let y will be scoped here.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] },
            { id: 'block:if', type: 'block', name: 'if block', level: 2, variables: [] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 2,
          description: 'var x = 1 assigns to x. Note: x lives in the FUNCTION scope, not the block. var ignores block boundaries!',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] },
            { id: 'block:if', type: 'block', name: 'if block', level: 2, variables: [] }
          ],
          output: []
        },
        {
          id: 3,
          codeLine: 3,
          description: 'let y = 2 creates y in the BLOCK scope. y only exists inside this if block.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'function:test', scopeLevel: 1 },
            { name: 'y', keyword: 'let', value: '2', state: 'initialized', scope: 'block:if', scopeLevel: 2 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] },
            { id: 'block:if', type: 'block', name: 'if block', level: 2, variables: ['y'] }
          ],
          output: []
        },
        {
          id: 4,
          codeLine: 4,
          description: 'We exit the if block. The block scope is destroyed - y is GONE. But x survives in the function scope!',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 5,
          codeLine: 5,
          description: 'console.log(x) works! var x escaped the block and exists in the function scope. It logs 1.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] }
          ],
          lookupPath: ['function:test', 'global'],
          output: ['1']
        },
        {
          id: 6,
          codeLine: 6,
          description: 'If we tried console.log(y), we would get ReferenceError: y is not defined. y died with the block.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'function:test', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] },
            { id: 'function:test', type: 'function', name: 'function: test', level: 1, variables: ['x'] }
          ],
          output: ['1']
        },
        {
          id: 7,
          codeLine: -1,
          description: 'Done! var is function-scoped (escapes blocks), while let is block-scoped (stays contained). This is a key difference!',
          phase: 'execution',
          action: 'access',
          variables: [],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] }
          ],
          output: ['1']
        }
      ],
      insight: 'var is function-scoped - it ignores block boundaries like if/for/while. let and const are block-scoped - they are contained within {}.',
      whyItMatters: 'This is why let/const are preferred in modern JS. var leaking out of blocks causes many subtle bugs.'
    },
    {
      id: 'scope-chain-lookup',
      title: 'scope chain lookup',
      code: [
        "let name = 'Alice';",
        'function greet() {',
        '  console.log(name);',
        '}',
        'greet();',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: "We declare name in the global scope with value 'Alice'.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'The greet function is defined. It has access to the global scope through the scope chain.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 4,
          description: "We call greet(). A new function scope is created. It's empty but linked to global scope.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] },
            { id: 'function:greet', type: 'function', name: 'function: greet', level: 1, variables: [] }
          ],
          output: []
        },
        {
          id: 3,
          codeLine: 2,
          description: "console.log(name) - we need to find 'name'. First we search the function scope... not found!",
          phase: 'execution',
          action: 'lookup',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] },
            { id: 'function:greet', type: 'function', name: 'function: greet', level: 1, variables: [] }
          ],
          lookupPath: ['function:greet'],
          output: []
        },
        {
          id: 4,
          codeLine: 2,
          description: "Not in function scope, so we follow the scope chain UP to global scope. Found name = 'Alice'!",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] },
            { id: 'function:greet', type: 'function', name: 'function: greet', level: 1, variables: [] }
          ],
          lookupPath: ['function:greet', 'global'],
          output: ['Alice']
        },
        {
          id: 5,
          codeLine: -1,
          description: 'Done! JavaScript searches from innermost scope outward. This is the scope chain - how closures work!',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'name', keyword: 'let', value: "'Alice'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['name'] }
          ],
          output: ['Alice']
        }
      ],
      insight: 'When accessing a variable, JavaScript searches from the current scope outward through the scope chain until it finds the variable or reaches global scope.',
      whyItMatters: 'This is the foundation of closures - inner functions can access outer variables through the scope chain.'
    },
    {
      id: 'variable-shadowing',
      title: 'variable shadowing',
      code: [
        "let x = 'outer';",
        'function inner() {',
        "  let x = 'inner';",
        '  console.log(x);',
        '}',
        'inner();',
        'console.log(x);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: "We declare x in the global scope with value 'outer'.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'The inner function is defined. When called, it will create its own scope.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 5,
          description: 'We call inner(). A new function scope is created, linked to global scope.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'function:inner', type: 'function', name: 'function: inner', level: 1, variables: [] }
          ],
          output: []
        },
        {
          id: 3,
          codeLine: 2,
          description: "let x = 'inner' creates a NEW x in the function scope. This SHADOWS (hides) the outer x. Both variables exist!",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'function:inner', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'function:inner', type: 'function', name: 'function: inner', level: 1, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 4,
          codeLine: 3,
          description: "console.log(x) - we search for x. Found immediately in function scope! The outer x is shadowed. Logs 'inner'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'function:inner', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'function:inner', type: 'function', name: 'function: inner', level: 1, variables: ['x'] }
          ],
          lookupPath: ['function:inner'],
          output: ['inner']
        },
        {
          id: 5,
          codeLine: 4,
          description: 'inner() returns. The function scope is destroyed, along with the inner x. Only global x remains.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['inner']
        },
        {
          id: 6,
          codeLine: 6,
          description: "console.log(x) in global scope. The global x was never modified - it's still 'outer'. Logs 'outer'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          lookupPath: ['global'],
          output: ['inner', 'outer']
        },
        {
          id: 7,
          codeLine: -1,
          description: 'Done! Shadowing creates a new variable with the same name in an inner scope. It hides but does NOT modify the outer variable.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['inner', 'outer']
        }
      ],
      insight: 'Variable shadowing occurs when an inner scope declares a variable with the same name as an outer scope. The inner variable hides (shadows) the outer one.',
      whyItMatters: 'Understanding shadowing prevents confusion about which variable you are modifying. The outer variable is NOT changed by the inner one.'
    }
  ],
  advanced: [
    {
      id: 'tdz-error',
      title: 'TDZ error',
      code: [
        'console.log(x);  // ReferenceError!',
        'let x = 5;',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Creation phase: JavaScript hoists let x, but places it in the Temporal Dead Zone (TDZ). It exists but cannot be accessed yet.',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'x', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 0,
          description: 'Execution: We try to access x before its declaration. x is in the TDZ - this throws a ReferenceError!',
          phase: 'execution',
          action: 'error',
          variables: [
            { name: 'x', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: [],
          error: "ReferenceError: Cannot access 'x' before initialization"
        }
      ],
      insight: 'The Temporal Dead Zone (TDZ) is the period between entering a scope and the let/const declaration being processed. Accessing the variable during TDZ throws a ReferenceError.',
      whyItMatters: 'The TDZ catches bugs where you accidentally use a variable before declaring it. With var, you would silently get undefined instead.'
    },
    {
      id: 'const-reassignment-error',
      title: 'const reassignment',
      code: [
        'const pi = 3.14;',
        'pi = 3.14159;  // TypeError!',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'const declares pi with the value 3.14. This creates a constant binding - the variable cannot be reassigned.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'pi', keyword: 'const', value: '3.14', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['pi'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We try to reassign pi to a new value. const bindings cannot be reassigned - this throws a TypeError!',
          phase: 'execution',
          action: 'error',
          variables: [
            { name: 'pi', keyword: 'const', value: '3.14', state: 'error', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['pi'] }
          ],
          output: [],
          error: 'TypeError: Assignment to constant variable'
        }
      ],
      insight: 'const creates a constant BINDING, not a constant value. You cannot point the variable to something else, but you CAN mutate objects/arrays.',
      whyItMatters: 'Use const by default - it prevents accidental reassignment. Only use let when you genuinely need to reassign.'
    },
    {
      id: 'var-redeclaration',
      title: 'var redeclaration',
      code: [
        'var x = 1;',
        'console.log(x);  // 1',
        'var x = 2;       // No error!',
        'console.log(x);  // 2',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Creation phase: JavaScript hoists var x. Even though x is declared twice, hoisting merges them into one variable.',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 0,
          description: 'First var x = 1 assigns the value 1 to x.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 1,
          description: 'console.log(x) outputs 1.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['1']
        },
        {
          id: 3,
          codeLine: 2,
          description: 'Second var x = 2 - this is allowed with var! It just reassigns x to 2. With let, this would be a SyntaxError.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'x', keyword: 'var', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['1']
        },
        {
          id: 4,
          codeLine: 3,
          description: 'console.log(x) outputs 2. The redeclaration silently overwrote the first value.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['1', '2']
        },
        {
          id: 5,
          codeLine: -1,
          description: 'Done! var allows redeclaration in the same scope, which can cause subtle bugs. let/const throw an error if you try to redeclare.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['1', '2']
        }
      ],
      insight: 'var allows redeclaring the same variable in the same scope. This can silently overwrite values and cause hard-to-find bugs.',
      whyItMatters: 'let and const prevent redeclaration, catching copy-paste errors and variable name collisions at compile time.'
    },
    {
      id: 'hoisting-comparison',
      title: 'hoisting comparison',
      code: [
        '// Creation Phase (hoisting)',
        '// var a -> undefined',
        '// let b -> TDZ',
        '',
        'console.log(a);  // undefined',
        '// console.log(b);  // ReferenceError',
        '',
        'var a = 1;',
        'let b = 2;',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Creation phase begins. JavaScript scans for declarations. First, it finds var a on line 8.',
          phase: 'creation',
          action: 'hoist',
          variables: [],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: [] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 7,
          description: 'var a is hoisted to the top of the scope with value undefined. Watch it "float up" to the top!',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a'] }
          ],
          hoistingAnimation: { variableName: 'a', keyword: 'var', fromLine: 8, toPosition: 'top' },
          output: []
        },
        {
          id: 2,
          codeLine: 8,
          description: 'let b is also hoisted, but it enters the Temporal Dead Zone (TDZ). It exists but cannot be accessed until its declaration.',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          hoistingAnimation: { variableName: 'b', keyword: 'let', fromLine: 9, toPosition: 'top' },
          output: []
        },
        {
          id: 3,
          codeLine: -1,
          description: 'Creation phase complete. Now execution begins from the top. var a = undefined, let b is in TDZ.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: []
        },
        {
          id: 4,
          codeLine: 4,
          description: 'console.log(a) - a exists and is undefined (hoisted). This works! Logs undefined.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          lookupPath: ['global'],
          output: ['undefined']
        },
        {
          id: 5,
          codeLine: 5,
          description: 'If we tried console.log(b) here, we would get ReferenceError! b exists but is in the TDZ - it cannot be accessed yet.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 6,
          codeLine: 7,
          description: 'We reach var a = 1. The assignment happens - a changes from undefined to 1.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: undefined, state: 'hoisted-tdz', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 7,
          codeLine: 8,
          description: 'We reach let b = 2. NOW b exits the TDZ and gets initialized with 2. Only now is b safely accessible.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['a', 'b'] }
          ],
          output: ['undefined']
        },
        {
          id: 8,
          codeLine: -1,
          description: 'Done! Both var and let hoist, but var initializes to undefined while let stays in the TDZ. This is why let is safer!',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'a', keyword: 'var', value: '1', state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'b', keyword: 'let', value: '2', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined']
        }
      ],
      insight: 'Both var and let are hoisted during creation phase, but var is initialized with undefined while let stays in the Temporal Dead Zone until its declaration.',
      whyItMatters: 'The TDZ makes let/const safer - accessing before declaration throws an error instead of silently giving undefined.'
    }
  ]
}

export function VariablesViz() {
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

  const isAtEnd = stepIndex >= currentExample.steps.length - 1 || !!currentStep?.error

  if (!currentExample || !currentStep) {
    return <div className={styles.container}>No examples available for this level.</div>
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

      {currentStep.hoistingAnimation && (
        <motion.div
          className={styles.hoistingAnimation}
          key={`hoist-${currentStep.id}-${currentStep.hoistingAnimation.variableName}`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        >
          <div className={styles.hoistingLabel}>Hoisting to top of scope</div>
          <div className={styles.hoistingVar}>
            <span style={{ color: keywordColors[currentStep.hoistingAnimation.keyword] }}>
              {currentStep.hoistingAnimation.keyword}
            </span>
            {' '}{currentStep.hoistingAnimation.variableName} ={' '}
            <span className={styles.hoistingValue}>
              {currentStep.hoistingAnimation.keyword === 'var' ? 'undefined' : 'TDZ'}
            </span>
          </div>
          <motion.div
            className={styles.hoistingArrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ^
          </motion.div>
        </motion.div>
      )}

      <div className={styles.mainGrid}>
        <div className={styles.codeColumn}>
          <div className={styles.codePanelWrapper}>
            <div className={styles.codePanelHeader}>
              <span>Code</span>
              <span
                className={styles.phaseBadge}
                style={{
                  background: currentStep.phase === 'creation' ? 'var(--color-blue-400)' : 'var(--color-emerald-500)'
                }}
              >
                {currentStep.phase === 'creation' ? 'Creation' : 'Execution'} Phase
              </span>
            </div>
            <CodePanel
              code={currentExample.code}
              highlightedLine={currentStep.codeLine}
              title=""
            />
          </div>
        </div>

        <div className={styles.variablesBox}>
          <div className={styles.boxHeader}>
            Variables
            {currentStep.phase === 'creation' && (
              <span className={styles.creatingIndicator}>Creating...</span>
            )}
          </div>
          <div className={styles.boxContent}>
            <AnimatePresence mode="popLayout">
              {currentStep.variables.length === 0 ? (
                <span className={styles.placeholder}>No variables yet</span>
              ) : (
                currentStep.variables.map((v, idx) => (
                  <motion.div
                    key={`${v.name}-${v.scope}-${idx}`}
                    className={styles.variable}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{ borderColor: keywordColors[v.keyword] }}
                    layout
                  >
                    <span
                      className={styles.varKeyword}
                      style={{ color: keywordColors[v.keyword] }}
                    >
                      {v.keyword}
                    </span>
                    <span className={styles.varName}>{v.name}</span>
                    <span className={styles.varEquals}>=</span>
                    <motion.span
                      key={v.value}
                      className={styles.varValue}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      {v.value}
                    </motion.span>
                    <span
                      className={styles.varState}
                      style={{
                        background: `${stateColors[v.state]}20`,
                        color: stateColors[v.state],
                        borderColor: `${stateColors[v.state]}40`
                      }}
                    >
                      {stateLabels[v.state]}
                    </span>
                    {v.scopeLevel > 0 && (
                      <span className={styles.varScope}>
                        {v.scope}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {currentStep.error && (
        <motion.div
          className={styles.errorPanel}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.errorIcon}>!</div>
          <div className={styles.errorType}>
            {currentStep.error.includes('ReferenceError') ? 'ReferenceError' : 'TypeError'}
          </div>
          <div className={styles.errorMessage}>
            {currentStep.error}
          </div>
          <div className={styles.errorHint}>
            {currentStep.error.includes('before initialization')
              ? 'Variable is in the Temporal Dead Zone (TDZ)'
              : currentStep.error.includes('constant')
                ? 'const bindings cannot be reassigned'
                : ''
            }
          </div>
        </motion.div>
      )}

      {currentStep.scopes && currentStep.scopes.length > 0 && (
        <div className={styles.scopeChainPanel}>
          <div className={styles.boxHeader}>Scope Chain</div>
          <div className={styles.scopeChainContent}>
            {currentStep.scopes.map((scope, idx) => {
              const isBeingSearched = currentStep.lookupPath?.includes(scope.id)
              const isCurrentSearch = currentStep.lookupPath?.[currentStep.lookupPath.length - 1] === scope.id
              const scopeVariables = currentStep.variables.filter(v => v.scope === scope.id)

              return (
                <motion.div
                  key={scope.id}
                  className={`${styles.scopeBox} ${
                    isBeingSearched ? styles.scopeSearched : ''
                  } ${
                    isCurrentSearch ? styles.scopeCurrentSearch : ''
                  }`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    borderColor: isCurrentSearch
                      ? 'var(--color-emerald-500)'
                      : isBeingSearched
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(148, 163, 184, 0.2)',
                    boxShadow: isCurrentSearch
                      ? '0 0 15px rgba(16, 185, 129, 0.4)'
                      : 'none'
                  }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{
                    marginLeft: `${scope.level * 1.5}rem`
                  }}
                >
                  <div className={styles.scopeHeader}>
                    <span className={`${styles.scopeLabel} ${styles[scope.type]}`}>
                      {scope.type}
                    </span>
                    <span className={styles.scopeName}>{scope.name}</span>
                    {isBeingSearched && (
                      <motion.span
                        className={styles.searchingIndicator}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {isCurrentSearch ? 'found!' : 'searching...'}
                      </motion.span>
                    )}
                  </div>
                  {scopeVariables.length > 0 && (
                    <div className={styles.scopeVariables}>
                      {scopeVariables.map((v, vIdx) => (
                        <div key={`${v.name}-${vIdx}`} className={styles.scopeVar}>
                          <span style={{ color: keywordColors[v.keyword] }}>
                            {v.keyword}
                          </span>{' '}
                          <span className={styles.scopeVarName}>{v.name}</span>
                          {' = '}
                          <span className={styles.scopeVarValue}>
                            {v.value ?? 'undefined'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {scope.variables.length > 0 && scopeVariables.length === 0 && (
                    <div className={styles.scopeVarsHint}>
                      [{scope.variables.join(', ')}]
                    </div>
                  )}
                </motion.div>
              )
            })}
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
                  key={`output-${i}`}
                  className={`${styles.outputLine} ${
                    i === currentStep.output.length - 1 &&
                    currentStep.action === 'access'
                      ? styles.currentOutput
                      : ''
                  }`}
                  initial={
                    i === currentStep.output.length - 1
                      ? { opacity: 0, x: -10 }
                      : undefined
                  }
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
        canNext={!isAtEnd}
      />

      <div className={styles.insightBox}>
        <span className={styles.insightLabel}>Key Insight:</span>
        {currentExample.insight}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <span className={styles.legendTitle}>Keywords:</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.var }} />
            <span>var (function scope)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.let }} />
            <span>let (block scope)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.const }} />
            <span>const (constant)</span>
          </div>
        </div>
        <div className={styles.legendSection}>
          <span className={styles.legendTitle}>States:</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: stateColors['hoisted-undefined'] }} />
            <span>hoisted</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: stateColors['hoisted-tdz'] }} />
            <span>TDZ</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: stateColors['initialized'] }} />
            <span>initialized</span>
          </div>
        </div>
      </div>
    </div>
  )
}
