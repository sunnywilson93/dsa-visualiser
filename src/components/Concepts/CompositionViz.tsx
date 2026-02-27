'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface FunctionBox {
  id: string
  name: string
  args?: string[]
  filledArgs?: string[]
  result?: string
  isActive?: boolean
}

interface DataFlow {
  value: string
  position: number
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  functions: FunctionBox[]
  dataFlow?: DataFlow
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
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'pipe-basic',
      title: 'Pipe Basics',
      code: [
        'const add10 = x => x + 10;',
        'const mult2 = x => x * 2;',
        'const sub5 = x => x - 5;',
        '',
        'const pipe = (...fns) =>',
        '  x => fns.reduce((v, f) => f(v), x);',
        '',
        'const transform = pipe(add10, mult2, sub5);',
        'transform(5);  // ((5+10)*2)-5 = 25'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Three simple functions defined: add10, mult2, sub5',
          highlightLines: [0, 1, 2],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: 'x + 10' },
            { id: 'mult2', name: 'mult2', args: ['x'], result: 'x * 2' },
            { id: 'sub5', name: 'sub5', args: ['x'], result: 'x - 5' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Compose',
          description: 'pipe() combines functions left-to-right',
          highlightLines: [7],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: 'x + 10' },
            { id: 'mult2', name: 'mult2', args: ['x'], result: 'x * 2' },
            { id: 'sub5', name: 'sub5', args: ['x'], result: 'x - 5' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Execute',
          description: 'Input 5 enters the pipeline',
          highlightLines: [8],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: 'x + 10', isActive: true },
            { id: 'mult2', name: 'mult2', args: ['x'], result: 'x * 2' },
            { id: 'sub5', name: 'sub5', args: ['x'], result: 'x - 5' }
          ],
          dataFlow: { value: '5', position: 0 },
          output: []
        },
        {
          id: 3,
          phase: 'Execute',
          description: 'add10(5) = 15, result flows to next function',
          highlightLines: [8],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: '15' },
            { id: 'mult2', name: 'mult2', args: ['x'], result: 'x * 2', isActive: true },
            { id: 'sub5', name: 'sub5', args: ['x'], result: 'x - 5' }
          ],
          dataFlow: { value: '15', position: 33 },
          output: []
        },
        {
          id: 4,
          phase: 'Execute',
          description: 'mult2(15) = 30, result flows to next function',
          highlightLines: [8],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: '15' },
            { id: 'mult2', name: 'mult2', args: ['x'], result: '30' },
            { id: 'sub5', name: 'sub5', args: ['x'], result: 'x - 5', isActive: true }
          ],
          dataFlow: { value: '30', position: 66 },
          output: []
        },
        {
          id: 5,
          phase: 'Complete',
          description: 'sub5(30) = 25, final result!',
          highlightLines: [8],
          functions: [
            { id: 'add10', name: 'add10', args: ['x'], result: '15' },
            { id: 'mult2', name: 'mult2', args: ['x'], result: '30' },
            { id: 'sub5', name: 'sub5', args: ['x'], result: '25' }
          ],
          dataFlow: { value: '25', position: 100 },
          output: ['25']
        }
      ],
      insight: 'pipe() flows data left-to-right like reading: add10 → mult2 → sub5. Each function receives the previous result.'
    },
    {
      id: 'partial-basic',
      title: 'Partial Application',
      code: [
        'function partial(fn, ...preset) {',
        '  return (...later) => fn(...preset, ...later);',
        '}',
        '',
        'const greet = (greeting, name) =>',
        '  `${greeting}, ${name}!`;',
        '',
        'const sayHello = partial(greet, "Hello");',
        'sayHello("Alice");  // "Hello, Alice!"'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'greet takes two arguments: greeting and name',
          highlightLines: [4, 5],
          functions: [
            { id: 'greet', name: 'greet', args: ['greeting', 'name'], result: '`${greeting}, ${name}!`' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Partial',
          description: 'partial() fixes "Hello" as the first argument',
          highlightLines: [7],
          functions: [
            { id: 'greet', name: 'greet', args: ['greeting', 'name'], filledArgs: ['"Hello"', '?'], result: '`${greeting}, ${name}!`' },
            { id: 'sayHello', name: 'sayHello', args: ['name'], result: 'greet("Hello", name)' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Execute',
          description: 'Call sayHello("Alice") - fills in the remaining argument',
          highlightLines: [8],
          functions: [
            { id: 'greet', name: 'greet', args: ['greeting', 'name'], filledArgs: ['"Hello"', '"Alice"'], result: '"Hello, Alice!"', isActive: true },
            { id: 'sayHello', name: 'sayHello', args: ['name'], filledArgs: ['"Alice"'], result: 'greet("Hello", "Alice")' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'Result: "Hello, Alice!"',
          highlightLines: [8],
          functions: [
            { id: 'greet', name: 'greet', args: ['greeting', 'name'], filledArgs: ['"Hello"', '"Alice"'], result: '"Hello, Alice!"' },
            { id: 'sayHello', name: 'sayHello', args: ['name'] }
          ],
          output: ['"Hello, Alice!"']
        }
      ],
      insight: 'Partial application "pre-fills" some arguments, returning a new function that takes the rest.'
    }
  ],
  intermediate: [
    {
      id: 'curry',
      title: 'Currying',
      code: [
        'function curry(fn) {',
        '  return function curried(...args) {',
        '    if (args.length >= fn.length) {',
        '      return fn.apply(this, args);',
        '    }',
        '    return (...more) => curried(...args, ...more);',
        '  };',
        '}',
        '',
        'const add = curry((a, b, c) => a + b + c);',
        'add(1)(2)(3);  // 6',
        'add(1, 2)(3);  // 6'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'add takes 3 arguments. curry() transforms it.',
          highlightLines: [9],
          functions: [
            { id: 'add', name: 'add', args: ['a', 'b', 'c'], result: 'a + b + c' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Curry',
          description: 'add(1) - not enough args, returns function waiting for more',
          highlightLines: [10],
          functions: [
            { id: 'add', name: 'add', args: ['a', 'b', 'c'], filledArgs: ['1', '?', '?'], result: 'waiting...' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Curry',
          description: 'add(1)(2) - still not enough, waiting for c',
          highlightLines: [10],
          functions: [
            { id: 'add', name: 'add', args: ['a', 'b', 'c'], filledArgs: ['1', '2', '?'], result: 'waiting...' }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Execute',
          description: 'add(1)(2)(3) - all args filled, executes!',
          highlightLines: [10],
          functions: [
            { id: 'add', name: 'add', args: ['a', 'b', 'c'], filledArgs: ['1', '2', '3'], result: '6', isActive: true }
          ],
          output: ['6']
        },
        {
          id: 4,
          phase: 'Flexible',
          description: 'Or call add(1, 2)(3) - multiple args at once!',
          highlightLines: [11],
          functions: [
            { id: 'add', name: 'add', args: ['a', 'b', 'c'], filledArgs: ['1', '2', '3'], result: '6', isActive: true }
          ],
          output: ['6']
        }
      ],
      insight: 'Currying transforms f(a, b, c) into f(a)(b)(c). Each call returns a function until all args are provided.'
    },
    {
      id: 'compose',
      title: 'Compose vs Pipe',
      code: [
        'const pipe = (...fns) =>',
        '  x => fns.reduce((v, f) => f(v), x);',
        '',
        'const compose = (...fns) =>',
        '  x => fns.reduceRight((v, f) => f(v), x);',
        '',
        '// pipe: left to right (reading order)',
        'pipe(f, g, h)(x)    // h(g(f(x)))',
        '',
        '// compose: right to left (math notation)',
        'compose(f, g, h)(x) // f(g(h(x)))'
      ],
      steps: [
        {
          id: 0,
          phase: 'Pipe',
          description: 'pipe uses reduce: left-to-right order',
          highlightLines: [0, 1],
          functions: [
            { id: 'f', name: 'f', isActive: true },
            { id: 'g', name: 'g' },
            { id: 'h', name: 'h' }
          ],
          dataFlow: { value: 'x', position: 0 },
          output: []
        },
        {
          id: 1,
          phase: 'Pipe',
          description: 'x flows through f first',
          highlightLines: [7],
          functions: [
            { id: 'f', name: 'f', result: 'f(x)' },
            { id: 'g', name: 'g', isActive: true },
            { id: 'h', name: 'h' }
          ],
          dataFlow: { value: 'f(x)', position: 33 },
          output: []
        },
        {
          id: 2,
          phase: 'Pipe',
          description: 'Then g, then h: h(g(f(x)))',
          highlightLines: [7],
          functions: [
            { id: 'f', name: 'f', result: 'f(x)' },
            { id: 'g', name: 'g', result: 'g(f(x))' },
            { id: 'h', name: 'h', result: 'h(g(f(x)))', isActive: true }
          ],
          dataFlow: { value: 'h(g(f(x)))', position: 100 },
          output: []
        },
        {
          id: 3,
          phase: 'Compose',
          description: 'compose uses reduceRight: right-to-left order',
          highlightLines: [3, 4],
          functions: [
            { id: 'f', name: 'f' },
            { id: 'g', name: 'g' },
            { id: 'h', name: 'h', isActive: true }
          ],
          dataFlow: { value: 'x', position: 100 },
          output: []
        },
        {
          id: 4,
          phase: 'Compose',
          description: 'x flows through h first (rightmost)',
          highlightLines: [10],
          functions: [
            { id: 'f', name: 'f' },
            { id: 'g', name: 'g', isActive: true },
            { id: 'h', name: 'h', result: 'h(x)' }
          ],
          dataFlow: { value: 'h(x)', position: 66 },
          output: []
        },
        {
          id: 5,
          phase: 'Compose',
          description: 'Then g, then f: f(g(h(x))) - matches math notation!',
          highlightLines: [10],
          functions: [
            { id: 'f', name: 'f', result: 'f(g(h(x)))', isActive: true },
            { id: 'g', name: 'g', result: 'g(h(x))' },
            { id: 'h', name: 'h', result: 'h(x)' }
          ],
          dataFlow: { value: 'f(g(h(x)))', position: 0 },
          output: []
        }
      ],
      insight: 'pipe = reading order (left→right). compose = math notation (right→left). Same result, different mental model!'
    }
  ],
  advanced: [
    {
      id: 'once',
      title: '_.once() Pattern',
      code: [
        'function once(fn) {',
        '  let called = false;',
        '  let result;',
        '',
        '  return function(...args) {',
        '    if (!called) {',
        '      called = true;',
        '      result = fn.apply(this, args);',
        '    }',
        '    return result;',
        '  };',
        '}',
        '',
        'const init = once(() => "Initialized!");',
        'init();  // "Initialized!"',
        'init();  // "Initialized!" (cached)'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'once() wraps a function with closure state',
          highlightLines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          functions: [
            { id: 'closure', name: 'Closure State', args: ['called: false', 'result: undefined'] }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Create',
          description: 'init = once(fn) creates the wrapped function',
          highlightLines: [13],
          functions: [
            { id: 'closure', name: 'Closure State', args: ['called: false', 'result: undefined'] },
            { id: 'init', name: 'init', result: '→ once(fn)' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'First Call',
          description: 'init() - called is false, so fn executes!',
          highlightLines: [14],
          functions: [
            { id: 'closure', name: 'Closure State', args: ['called: true', 'result: "Initialized!"'], isActive: true },
            { id: 'init', name: 'init', result: '"Initialized!"' }
          ],
          output: ['"Initialized!"']
        },
        {
          id: 3,
          phase: 'Second Call',
          description: 'init() again - called is true, returns cached result!',
          highlightLines: [15],
          functions: [
            { id: 'closure', name: 'Closure State', args: ['called: true', 'result: "Initialized!"'] },
            { id: 'init', name: 'init', result: '"Initialized!" (cached)' }
          ],
          output: ['"Initialized!" (cached)']
        }
      ],
      insight: 'once() uses closure to track state. The inner function closes over "called" and "result", persisting between calls.'
    },
    {
      id: 'middleware',
      title: 'Middleware Pattern',
      code: [
        'function createApp() {',
        '  const middlewares = [];',
        '',
        '  return {',
        '    use(fn) { middlewares.push(fn); },',
        '    async handle(req) {',
        '      let i = 0;',
        '      const next = async () => {',
        '        if (i < middlewares.length)',
        '          await middlewares[i++](req, next);',
        '      };',
        '      await next();',
        '      return req;',
        '    }',
        '  };',
        '}'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Create app with empty middleware array',
          highlightLines: [0, 1],
          functions: [
            { id: 'app', name: 'App', args: ['middlewares: []'] }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Register',
          description: 'app.use() adds middleware functions to the chain',
          highlightLines: [4],
          functions: [
            { id: 'app', name: 'App', args: ['middlewares: [mw1, mw2, mw3]'] },
            { id: 'mw1', name: 'mw1' },
            { id: 'mw2', name: 'mw2' },
            { id: 'mw3', name: 'mw3' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Handle',
          description: 'handle(req) starts the chain with next()',
          highlightLines: [5, 6, 7, 8, 9, 10, 11],
          functions: [
            { id: 'mw1', name: 'mw1', isActive: true },
            { id: 'mw2', name: 'mw2' },
            { id: 'mw3', name: 'mw3' }
          ],
          dataFlow: { value: 'req', position: 0 },
          output: []
        },
        {
          id: 3,
          phase: 'Chain',
          description: 'mw1 runs, calls next() → mw2 runs',
          highlightLines: [9],
          functions: [
            { id: 'mw1', name: 'mw1', result: 'done' },
            { id: 'mw2', name: 'mw2', isActive: true },
            { id: 'mw3', name: 'mw3' }
          ],
          dataFlow: { value: 'req', position: 50 },
          output: []
        },
        {
          id: 4,
          phase: 'Complete',
          description: 'mw2 calls next() → mw3 → done! Request flows through all',
          highlightLines: [12],
          functions: [
            { id: 'mw1', name: 'mw1', result: 'done' },
            { id: 'mw2', name: 'mw2', result: 'done' },
            { id: 'mw3', name: 'mw3', result: 'done' }
          ],
          dataFlow: { value: 'req', position: 100 },
          output: ['Request processed through mw1 → mw2 → mw3']
        }
      ],
      insight: 'Middleware chains functions with next() control. Each middleware can modify req, call next(), or stop the chain.'
    }
  ]
}

export function CompositionViz() {
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
      case 'Setup': return 'var(--color-blue-400)'
      case 'Compose': return 'var(--color-violet-300-40)'
      case 'Execute': return 'var(--color-emerald-500)'
      case 'Complete': return 'var(--color-emerald-500)'
      case 'Partial': return 'var(--color-amber-500)'
      case 'Curry': return 'var(--color-amber-500)'
      case 'Flexible': return 'var(--color-violet-300-40)'
      case 'Pipe': return 'var(--color-blue-400)'
      case 'Create': return 'var(--color-blue-400)'
      case 'First Call': return 'var(--color-emerald-500)'
      case 'Second Call': return 'var(--color-violet-300-40)'
      case 'Register': return 'var(--color-blue-400)'
      case 'Handle': return 'var(--color-amber-500)'
      case 'Chain': return 'var(--color-violet-300-40)'
      default: return 'var(--color-gray-500)'
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-center mb-1 p-1.5 bg-[var(--color-black-30)] border border-white-8 rounded-full">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
              level === lvl 
                ? 'text-[var(--color-text-bright)] shadow-[0_0_20px_var(--color-neon-viz-25)]' 
                : 'bg-white-4 border border-white-8 text-gray-500 hover:bg-white-8 hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : undefined,
              background: level === lvl ? `${levelInfo[lvl].color}15` : undefined
            }}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ background: levelInfo[lvl].color }}
            />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-[var(--color-black-30)] border border-white-8 rounded-full">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full cursor-pointer transition-all duration-200 ${
              exampleIndex === i 
                ? 'text-[var(--color-text-bright)] shadow-[0_0_20px_var(--color-neon-viz-25)]' 
                : 'bg-white-4 border border-white-8 text-gray-500 hover:bg-white-8 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
            style={{
              borderColor: exampleIndex === i ? 'var(--color-neon-viz-70)' : undefined,
              background: exampleIndex === i ? 'var(--color-neon-viz-18)' : undefined
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-black-40)] border border-white-8 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white-5">
          <span>Code</span>
          <span 
            className="px-2 py-0.5 rounded-full text-2xs font-semibold text-black"
            style={{ background: getPhaseColor(currentStep.phase) }}
          >
            {currentStep.phase}
          </span>
        </div>
        <pre className="m-0 py-2 max-h-[200px] overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-3 py-0.5 transition-colors duration-200 ${
                currentStep.highlightLines.includes(i) ? 'bg-[var(--color-brand-primary-20)]' : ''
              }`}
            >
              <span className="w-6 text-gray-800 font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-xs ${
                currentStep.highlightLines.includes(i) ? 'text-[var(--color-brand-light)]' : 'text-gray-300'
              }`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      <div className="bg-[var(--color-black-30)] border border-white-8 rounded-xl p-4 relative">
        <div className="text-sm font-medium text-gray-400 mb-4 text-center">Function Pipeline</div>
        <div className="flex flex-wrap gap-3 justify-center items-center relative min-h-[100px] p-4">
          <AnimatePresence mode="popLayout">
            {currentStep.functions.map((fn, idx) => (
              <motion.div
                key={fn.id}
                className={`relative min-w-[120px] p-4 bg-[var(--color-black-40)] border-2 rounded-lg text-center transition-all duration-300 ${
                  fn.isActive 
                    ? 'border-[var(--color-brand-light)] shadow-[0_0_20px_rgba(167,139,250,0.4)] bg-[rgba(167,139,250,0.1)]' 
                    : 'border-[rgba(167,139,250,0.3)]'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <div className="font-mono text-sm font-bold text-[var(--color-brand-light)] mb-1">{fn.name}</div>
                {fn.args && (
                  <div className="font-mono text-xs text-gray-400">
                    ({fn.filledArgs ? fn.filledArgs.join(', ') : fn.args.join(', ')})
                  </div>
                )}
                {fn.result && (
                  <motion.div
                    className="mt-1 font-mono text-xs text-emerald-500"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    → {fn.result}
                  </motion.div>
                )}
                {idx < currentStep.functions.length - 1 && (
                  <div className="absolute -right-5 top-1/2 -translate-y-1/2 text-lg text-gray-500">→</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {currentStep.dataFlow && (
            <motion.div
              className="absolute -bottom-1 -translate-x-1/2 z-10"
              initial={{ left: '0%' }}
              animate={{ left: `${currentStep.dataFlow.position}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full font-mono text-xs text-white whitespace-nowrap">
                {currentStep.dataFlow.value}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-black-40)] border border-white-8 rounded-xl overflow-hidden">
        <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-white-5">Output</div>
        <div className="p-4 min-h-[50px]">
          {currentStep.output.length === 0 ? (
            <span className="text-gray-700">—</span>
          ) : (
            currentStep.output.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-sm text-emerald-500 py-0.5"
              >
                {o}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-30)] rounded-lg p-4 text-sm text-gray-300 leading-normal"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      <div className="bg-[var(--color-emerald-10)] border border-[var(--color-emerald-30)] rounded-lg p-4 text-sm text-gray-300 leading-normal">
        <strong className="text-emerald-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
