import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CompositionViz.module.css'

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
  position: number // 0-100 representing position in the pipeline
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
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
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
      case 'Setup': return '#60a5fa'
      case 'Compose': return '#a78bfa'
      case 'Execute': return '#10b981'
      case 'Complete': return '#10b981'
      case 'Partial': return '#f59e0b'
      case 'Curry': return '#f59e0b'
      case 'Flexible': return '#a78bfa'
      case 'Pipe': return '#60a5fa'
      case 'Create': return '#60a5fa'
      case 'First Call': return '#10b981'
      case 'Second Call': return '#a78bfa'
      case 'Register': return '#60a5fa'
      case 'Handle': return '#f59e0b'
      case 'Chain': return '#a78bfa'
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
            {currentStep.phase}
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

      {/* Function Pipeline Visualization */}
      <div className={styles.pipelineContainer}>
        <div className={styles.pipelineHeader}>Function Pipeline</div>
        <div className={styles.pipeline}>
          <AnimatePresence mode="popLayout">
            {currentStep.functions.map((fn, idx) => (
              <motion.div
                key={fn.id}
                className={`${styles.functionBox} ${fn.isActive ? styles.activeFn : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <div className={styles.fnName}>{fn.name}</div>
                {fn.args && (
                  <div className={styles.fnArgs}>
                    ({fn.filledArgs ? fn.filledArgs.join(', ') : fn.args.join(', ')})
                  </div>
                )}
                {fn.result && (
                  <motion.div
                    className={styles.fnResult}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    → {fn.result}
                  </motion.div>
                )}
                {idx < currentStep.functions.length - 1 && (
                  <div className={styles.arrow}>→</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Data flow indicator */}
          {currentStep.dataFlow && (
            <motion.div
              className={styles.dataFlow}
              initial={{ left: '0%' }}
              animate={{ left: `${currentStep.dataFlow.position}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <span className={styles.dataValue}>{currentStep.dataFlow.value}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>—</span>
          ) : (
            currentStep.output.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.outputLine}
              >
                {o}
              </motion.div>
            ))
          )}
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
