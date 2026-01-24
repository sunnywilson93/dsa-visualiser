import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './FunctionsViz.module.css'

interface CallStackFrame {
  id: string
  name: string
  params: Record<string, string>
  locals: Record<string, string>
  thisValue: string
  outerRef: string | null
  status: 'creating' | 'active' | 'returning' | 'destroyed'
}

interface ParameterBinding {
  argumentIndex: number
  argumentValue: string
  argumentLabel: string
  parameterName: string
  boundValue: string
  status: 'waiting' | 'flowing' | 'bound'
  isDefault: boolean
  isExtra: boolean
  isMissing: boolean
}

interface FunctionStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'call' | 'enter' | 'execute' | 'return' | 'cleanup'
  callStack: CallStackFrame[]
  output: string[]
  parameterBindings?: ParameterBinding[]
}

interface FunctionExample {
  id: string
  title: string
  code: string[]
  steps: FunctionStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, FunctionExample[]> = {
  beginner: [
    {
      id: 'simple-call',
      title: 'Simple function call',
      code: [
        'function greet(name) {',
        '  return "Hello, " + name',
        '}',
        '',
        'const result = greet("Alice")',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function greet is defined. It exists in memory but has not been called yet.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 4,
          description: 'We call greet("Alice"). JavaScript pushes a new frame onto the call stack.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 0,
          description: 'Execution context created for greet(). The parameter name is bound to "Alice".',
          phase: 'enter',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 1,
          description: 'The function body executes. It returns "Hello, " + name which is "Hello, Alice".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 4,
          description: 'greet() returns. Its execution context is destroyed and popped from the stack.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Alice"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'console.log outputs the result. Only the global execution context remains.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Alice"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['Hello, Alice'],
        },
      ],
      insight: 'Every function call creates a new execution context (frame) that is pushed onto the call stack. When the function returns, the context is destroyed and popped off.',
    },
    {
      id: 'nested-calls',
      title: 'Nested function calls',
      code: [
        'function outer() {',
        '  console.log("outer start")',
        '  inner()',
        '  console.log("outer end")',
        '}',
        '',
        'function inner() {',
        '  console.log("inner")',
        '}',
        '',
        'outer()',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Functions outer and inner are defined in global scope.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 10,
          description: 'We call outer(). A new execution context is pushed onto the stack.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'outer() begins executing. It logs "outer start".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: ['outer start'],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'outer() calls inner(). A THIRD frame is pushed. Stack grows: global -> outer -> inner.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' },
            { id: 'inner-1', name: 'inner()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: ['outer start'],
        },
        {
          id: 4,
          codeLine: 7,
          description: 'inner() executes its body and logs "inner".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' },
            { id: 'inner-1', name: 'inner()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: ['outer start', 'inner'],
        },
        {
          id: 5,
          codeLine: 8,
          description: 'inner() finishes. Its context is popped. Stack shrinks: global -> outer.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: ['outer start', 'inner'],
        },
        {
          id: 6,
          codeLine: 3,
          description: 'outer() resumes after inner() returned. It logs "outer end".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'outer-1', name: 'outer()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: ['outer start', 'inner', 'outer end'],
        },
        {
          id: 7,
          codeLine: 10,
          description: 'outer() finishes. Its context is popped. Only global remains.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { outer: 'fn', inner: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['outer start', 'inner', 'outer end'],
        },
      ],
      insight: 'The call stack follows LIFO (Last In, First Out). inner() was called last but finishes first. outer() waits for inner() to complete before continuing.',
    },
    {
      id: 'local-variables',
      title: 'Function with local variables',
      code: [
        'function calculateArea(width, height) {',
        '  const area = width * height',
        '  const label = "Area: "',
        '  return label + area',
        '}',
        '',
        'const result = calculateArea(5, 3)',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function calculateArea is defined. Its code exists but local variables do not exist yet.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 6,
          description: 'We call calculateArea(5, 3). A new execution context is created.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'calc-1', name: 'calculateArea()', params: { width: '5', height: '3' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 0,
          description: 'Execution context is ready. Parameters width=5 and height=3 are bound.',
          phase: 'enter',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'calc-1', name: 'calculateArea()', params: { width: '5', height: '3' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 1,
          description: 'const area = 5 * 3. Local variable "area" is created with value 15.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'calc-1', name: 'calculateArea()', params: { width: '5', height: '3' }, locals: { area: '15' }, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 2,
          description: 'const label = "Area: ". Another local variable is added to this context.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'calc-1', name: 'calculateArea()', params: { width: '5', height: '3' }, locals: { area: '15', label: '"Area: "' }, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'return label + area returns "Area: 15". The function prepares to exit.',
          phase: 'return',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'calc-1', name: 'calculateArea()', params: { width: '5', height: '3' }, locals: { area: '15', label: '"Area: "' }, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 6,
          description: 'Context destroyed! All local variables (area, label) are gone. They only existed inside the function.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn', result: '"Area: 15"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 7,
          codeLine: 7,
          description: 'console.log outputs "Area: 15". The local variables from calculateArea no longer exist.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { calculateArea: 'fn', result: '"Area: 15"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['Area: 15'],
        },
      ],
      insight: 'Each execution context has its own local variables. When the function returns, those variables are destroyed. This is why you cannot access local variables from outside the function.',
    },
  ],
  intermediate: [
    {
      id: 'basic-binding',
      title: 'Basic parameter binding',
      code: [
        'function greet(name, greeting) {',
        '  return greeting + ", " + name',
        '}',
        '',
        'const result = greet("Alice", "Hello")',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function greet is defined with two parameters: name and greeting.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 4,
          description: 'Call initiated: greet("Alice", "Hello"). Arguments ready to be bound to parameters.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Alice"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Alice"', status: 'waiting', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '"Hello"', argumentLabel: 'arg 2', parameterName: 'greeting', boundValue: '"Hello"', status: 'waiting', isDefault: false, isExtra: false, isMissing: false }
          ],
        },
        {
          id: 2,
          codeLine: 4,
          description: 'First argument "Alice" flows into parameter name.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Alice"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Alice"', status: 'flowing', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '"Hello"', argumentLabel: 'arg 2', parameterName: 'greeting', boundValue: '"Hello"', status: 'waiting', isDefault: false, isExtra: false, isMissing: false }
          ],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'Second argument "Hello" flows into parameter greeting.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Alice"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Alice"', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '"Hello"', argumentLabel: 'arg 2', parameterName: 'greeting', boundValue: '"Hello"', status: 'flowing', isDefault: false, isExtra: false, isMissing: false }
          ],
        },
        {
          id: 4,
          codeLine: 0,
          description: 'Both parameters bound. Execution context is now active.',
          phase: 'enter',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Alice"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Alice"', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '"Hello"', argumentLabel: 'arg 2', parameterName: 'greeting', boundValue: '"Hello"', status: 'bound', isDefault: false, isExtra: false, isMissing: false }
          ],
        },
        {
          id: 5,
          codeLine: 1,
          description: 'Execute body: return greeting + ", " + name returns "Hello, Alice".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Alice"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 4,
          description: 'greet() returns. Execution context destroyed, result assigned to variable.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Alice"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 7,
          codeLine: 5,
          description: 'console.log outputs the result.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Alice"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['Hello, Alice'],
        },
      ],
      insight: 'Arguments are bound to parameters in order: first argument to first parameter, second to second, and so on. This mapping happens during function call setup.',
    },
    {
      id: 'missing-args',
      title: 'Missing arguments (undefined)',
      code: [
        'function add(a, b) {',
        '  return a + b',
        '}',
        '',
        'const result = add(5)',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function add is defined with two parameters: a and b.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 4,
          description: 'Call add(5) with only ONE argument. But add expects TWO parameters!',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'add-1', name: 'add()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '5', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '5', status: 'waiting', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'b', boundValue: 'undefined', status: 'waiting', isDefault: false, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 2,
          codeLine: 4,
          description: 'Argument 5 flows into parameter a normally.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'add-1', name: 'add()', params: { a: '5' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '5', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '5', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'b', boundValue: 'undefined', status: 'waiting', isDefault: false, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'No second argument provided. Parameter b receives undefined automatically.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'add-1', name: 'add()', params: { a: '5', b: 'undefined' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '5', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '5', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'b', boundValue: 'undefined', status: 'bound', isDefault: false, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Execute: a + b = 5 + undefined = NaN. Adding number to undefined produces NaN!',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'add-1', name: 'add()', params: { a: '5', b: 'undefined' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 4,
          description: 'Function returns NaN. This is a common bug from missing arguments.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn', result: 'NaN' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 5,
          description: 'console.log outputs NaN. The missing argument caused unexpected behavior.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { add: 'fn', result: 'NaN' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['NaN'],
        },
      ],
      insight: 'Missing arguments become undefined. JavaScript does not throw an error for missing arguments - it silently assigns undefined, which can lead to bugs like NaN.',
    },
    {
      id: 'extra-args',
      title: 'Extra arguments (ignored)',
      code: [
        'function first(a) {',
        '  return a',
        '}',
        '',
        'const result = first(1, 2, 3)',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function first is defined with only ONE parameter: a.',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 4,
          description: 'Call first(1, 2, 3) with THREE arguments. But first only has ONE parameter!',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'first-1', name: 'first()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '1', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '1', status: 'waiting', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '2', argumentLabel: 'arg 2', parameterName: '', boundValue: '2', status: 'waiting', isDefault: false, isExtra: true, isMissing: false },
            { argumentIndex: 2, argumentValue: '3', argumentLabel: 'arg 3', parameterName: '', boundValue: '3', status: 'waiting', isDefault: false, isExtra: true, isMissing: false }
          ],
        },
        {
          id: 2,
          codeLine: 4,
          description: 'First argument 1 binds to parameter a. This is the only parameter.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'first-1', name: 'first()', params: { a: '1' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '1', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '1', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '2', argumentLabel: 'arg 2', parameterName: '', boundValue: '2', status: 'bound', isDefault: false, isExtra: true, isMissing: false },
            { argumentIndex: 2, argumentValue: '3', argumentLabel: 'arg 3', parameterName: '', boundValue: '3', status: 'bound', isDefault: false, isExtra: true, isMissing: false }
          ],
        },
        {
          id: 3,
          codeLine: 0,
          description: 'Arguments 2 and 3 are ignored - no parameters to receive them. Context active.',
          phase: 'enter',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'first-1', name: 'first()', params: { a: '1' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '1', argumentLabel: 'arg 1', parameterName: 'a', boundValue: '1', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: 1, argumentValue: '2', argumentLabel: 'arg 2', parameterName: '', boundValue: '2', status: 'bound', isDefault: false, isExtra: true, isMissing: false },
            { argumentIndex: 2, argumentValue: '3', argumentLabel: 'arg 3', parameterName: '', boundValue: '3', status: 'bound', isDefault: false, isExtra: true, isMissing: false }
          ],
        },
        {
          id: 4,
          codeLine: 1,
          description: 'Execute: return a returns 1. The extra arguments (2, 3) were simply ignored.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'first-1', name: 'first()', params: { a: '1' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 4,
          description: 'Function returns 1. Extra arguments were silently discarded.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn', result: '1' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 5,
          description: 'console.log outputs 1. Arguments 2 and 3 were completely ignored.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { first: 'fn', result: '1' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['1'],
        },
      ],
      insight: 'JavaScript ignores extra arguments silently. No error is thrown. However, extra arguments are accessible via the special "arguments" object (in non-arrow functions).',
    },
    {
      id: 'default-params',
      title: 'Default parameters',
      code: [
        'function greet(name, greeting = "Hello") {',
        '  return greeting + ", " + name',
        '}',
        '',
        'const result = greet("Bob")',
        'console.log(result)',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'Function greet has a default parameter: greeting = "Hello".',
          phase: 'setup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 1,
          codeLine: 4,
          description: 'Call greet("Bob") with only ONE argument. greeting parameter has a default value.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: {}, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Bob"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Bob"', status: 'waiting', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'greeting', boundValue: '"Hello"', status: 'waiting', isDefault: true, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 2,
          codeLine: 4,
          description: 'Argument "Bob" flows into parameter name normally.',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Bob"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Bob"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Bob"', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'greeting', boundValue: '"Hello"', status: 'waiting', isDefault: true, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 3,
          codeLine: 4,
          description: 'No argument for greeting. DEFAULT value "Hello" is used instead of undefined!',
          phase: 'call',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Bob"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'creating' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Bob"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Bob"', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'greeting', boundValue: '"Hello"', status: 'bound', isDefault: true, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 4,
          codeLine: 0,
          description: 'Both parameters bound. name="Bob", greeting="Hello" (from default).',
          phase: 'enter',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Bob"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'active' }
          ],
          output: [],
          parameterBindings: [
            { argumentIndex: 0, argumentValue: '"Bob"', argumentLabel: 'arg 1', parameterName: 'name', boundValue: '"Bob"', status: 'bound', isDefault: false, isExtra: false, isMissing: false },
            { argumentIndex: -1, argumentValue: '', argumentLabel: 'missing', parameterName: 'greeting', boundValue: '"Hello"', status: 'bound', isDefault: true, isExtra: false, isMissing: true }
          ],
        },
        {
          id: 5,
          codeLine: 1,
          description: 'Execute: return greeting + ", " + name returns "Hello, Bob".',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn' }, thisValue: 'window', outerRef: null, status: 'active' },
            { id: 'greet-1', name: 'greet()', params: { name: '"Bob"', greeting: '"Hello"' }, locals: {}, thisValue: 'undefined', outerRef: 'global', status: 'returning' }
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 4,
          description: 'Function returns "Hello, Bob". Default parameter prevented undefined.',
          phase: 'cleanup',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Bob"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: [],
        },
        {
          id: 7,
          codeLine: 5,
          description: 'console.log outputs the result. Default parameters make functions more robust.',
          phase: 'execute',
          callStack: [
            { id: 'global', name: 'global()', params: {}, locals: { greet: 'fn', result: '"Hello, Bob"' }, thisValue: 'window', outerRef: null, status: 'active' }
          ],
          output: ['Hello, Bob'],
        },
      ],
      insight: 'Default parameters (ES6) provide fallback values when arguments are missing or undefined. They prevent the common bug of undefined creeping into your code.',
    },
  ],
  advanced: [],
}

export function FunctionsViz() {
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

        <div className={styles.callStackPanel}>
          <div className={styles.panelHeader}>Call Stack</div>
          <div className={styles.stackFrames}>
            <AnimatePresence mode="popLayout">
              {currentStep.callStack.slice().reverse().map((frame) => (
                <motion.div
                  key={frame.id}
                  className={`${styles.stackFrame} ${styles[frame.status]}`}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  layout
                >
                  <div className={styles.frameName}>{frame.name}</div>
                  {Object.keys(frame.params).length > 0 && (
                    <div className={styles.frameSection}>
                      <span className={styles.sectionLabel}>params:</span>
                      {Object.entries(frame.params).map(([k, v]) => (
                        <span key={k} className={styles.variable}>{k}: {v}</span>
                      ))}
                    </div>
                  )}
                  {Object.keys(frame.locals).length > 0 && (
                    <div className={styles.frameSection}>
                      <span className={styles.sectionLabel}>locals:</span>
                      {Object.entries(frame.locals).map(([k, v]) => (
                        <span key={k} className={styles.variable}>{k}: {v}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.frameSection}>
                    <span className={styles.sectionLabel}>this:</span>
                    <span className={styles.thisValue}>{frame.thisValue}</span>
                  </div>
                  {frame.outerRef && (
                    <div className={styles.frameSection}>
                      <span className={styles.sectionLabel}>outer:</span>
                      <span className={styles.outerRef}>{frame.outerRef}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
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
