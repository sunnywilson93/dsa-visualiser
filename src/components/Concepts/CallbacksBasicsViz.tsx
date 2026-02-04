'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface RegisteredCallback {
  name: string
  status: 'waiting' | 'invoked'
}

interface Step {
  description: string
  codeLine: number
  executingFunction: string | null
  registeredCallbacks: RegisteredCallback[]
  output: string[]
  phase: 'sync' | 'registering' | 'invoking'
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
      id: 'simple-callback',
      title: 'Simple Callback',
      code: [
        'function greet(callback) {',
        "  console.log('Hello!');",
        '  callback();',
        '}',
        '',
        'function sayGoodbye() {',
        "  console.log('Goodbye!');",
        '}',
        '',
        'greet(sayGoodbye);',
      ],
      steps: [
        {
          description: 'Script starts. Functions greet and sayGoodbye are defined.',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'greet(sayGoodbye) is called. We pass sayGoodbye as the callback argument.',
          codeLine: 9,
          executingFunction: 'greet',
          registeredCallbacks: [{ name: 'sayGoodbye', status: 'waiting' }],
          output: [],
          phase: 'registering',
        },
        {
          description: "Inside greet: console.log('Hello!') executes immediately.",
          codeLine: 1,
          executingFunction: 'greet',
          registeredCallbacks: [{ name: 'sayGoodbye', status: 'waiting' }],
          output: ['Hello!'],
          phase: 'sync',
        },
        {
          description: 'callback() is invoked. This calls the sayGoodbye function we passed in.',
          codeLine: 2,
          executingFunction: 'greet > sayGoodbye',
          registeredCallbacks: [{ name: 'sayGoodbye', status: 'invoked' }],
          output: ['Hello!'],
          phase: 'invoking',
        },
        {
          description: "Inside sayGoodbye: console.log('Goodbye!') executes.",
          codeLine: 6,
          executingFunction: 'sayGoodbye',
          registeredCallbacks: [{ name: 'sayGoodbye', status: 'invoked' }],
          output: ['Hello!', 'Goodbye!'],
          phase: 'sync',
        },
        {
          description: 'Both functions complete. The callback pattern lets greet control when sayGoodbye runs!',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [{ name: 'sayGoodbye', status: 'invoked' }],
          output: ['Hello!', 'Goodbye!'],
          phase: 'sync',
        },
      ],
      insight: 'A callback is just a function passed to another function. The receiving function decides WHEN to call it.'
    },
    {
      id: 'callback-with-data',
      title: 'Callback with Data',
      code: [
        'const numbers = [1, 2, 3];',
        '',
        'function double(n) {',
        '  return n * 2;',
        '}',
        '',
        'const result = numbers.map(double);',
        'console.log(result);',
      ],
      steps: [
        {
          description: 'Script starts. Array [1, 2, 3] is created, double function is defined.',
          codeLine: 0,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'numbers.map(double) is called. The double function is registered as callback.',
          codeLine: 6,
          executingFunction: 'map',
          registeredCallbacks: [{ name: 'double', status: 'waiting' }],
          output: [],
          phase: 'registering',
        },
        {
          description: 'map invokes double(1). Callback receives first element.',
          codeLine: 3,
          executingFunction: 'map > double',
          registeredCallbacks: [{ name: 'double (1)', status: 'invoked' }],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'map invokes double(2). Callback receives second element.',
          codeLine: 3,
          executingFunction: 'map > double',
          registeredCallbacks: [
            { name: 'double (1)', status: 'invoked' },
            { name: 'double (2)', status: 'invoked' }
          ],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'map invokes double(3). Callback receives third element.',
          codeLine: 3,
          executingFunction: 'map > double',
          registeredCallbacks: [
            { name: 'double (1)', status: 'invoked' },
            { name: 'double (2)', status: 'invoked' },
            { name: 'double (3)', status: 'invoked' }
          ],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'map returns [2, 4, 6]. console.log outputs the result.',
          codeLine: 7,
          executingFunction: null,
          registeredCallbacks: [
            { name: 'double (1)', status: 'invoked' },
            { name: 'double (2)', status: 'invoked' },
            { name: 'double (3)', status: 'invoked' }
          ],
          output: ['[2, 4, 6]'],
          phase: 'sync',
        },
      ],
      insight: 'Array methods like map, filter, forEach call your callback ONCE PER ELEMENT. You provide the logic, they handle iteration.'
    },
  ],
  intermediate: [
    {
      id: 'nested-callbacks',
      title: 'Nested Callbacks',
      code: [
        'function first(cb) {',
        "  console.log('First');",
        '  cb();',
        '}',
        '',
        'function second(cb) {',
        "  console.log('Second');",
        '  cb();',
        '}',
        '',
        'first(function() {',
        '  second(function() {',
        "    console.log('Done!');",
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'Script starts. first and second functions are defined.',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'first() is called with an anonymous callback function.',
          codeLine: 10,
          executingFunction: 'first',
          registeredCallbacks: [{ name: 'anonymous (outer)', status: 'waiting' }],
          output: [],
          phase: 'registering',
        },
        {
          description: "Inside first: console.log('First') runs.",
          codeLine: 1,
          executingFunction: 'first',
          registeredCallbacks: [{ name: 'anonymous (outer)', status: 'waiting' }],
          output: ['First'],
          phase: 'sync',
        },
        {
          description: 'first invokes its callback (cb). The anonymous outer function starts.',
          codeLine: 2,
          executingFunction: 'first > callback',
          registeredCallbacks: [{ name: 'anonymous (outer)', status: 'invoked' }],
          output: ['First'],
          phase: 'invoking',
        },
        {
          description: 'Inside outer callback: second() is called with another anonymous callback.',
          codeLine: 11,
          executingFunction: 'second',
          registeredCallbacks: [
            { name: 'anonymous (outer)', status: 'invoked' },
            { name: 'anonymous (inner)', status: 'waiting' }
          ],
          output: ['First'],
          phase: 'registering',
        },
        {
          description: "Inside second: console.log('Second') runs.",
          codeLine: 6,
          executingFunction: 'second',
          registeredCallbacks: [
            { name: 'anonymous (outer)', status: 'invoked' },
            { name: 'anonymous (inner)', status: 'waiting' }
          ],
          output: ['First', 'Second'],
          phase: 'sync',
        },
        {
          description: 'second invokes its callback (cb). The anonymous inner function starts.',
          codeLine: 7,
          executingFunction: 'second > callback',
          registeredCallbacks: [
            { name: 'anonymous (outer)', status: 'invoked' },
            { name: 'anonymous (inner)', status: 'invoked' }
          ],
          output: ['First', 'Second'],
          phase: 'invoking',
        },
        {
          description: "Inside inner callback: console.log('Done!') runs. All complete!",
          codeLine: 12,
          executingFunction: null,
          registeredCallbacks: [
            { name: 'anonymous (outer)', status: 'invoked' },
            { name: 'anonymous (inner)', status: 'invoked' }
          ],
          output: ['First', 'Second', 'Done!'],
          phase: 'sync',
        },
      ],
      insight: 'Nesting callbacks creates a chain of control: first controls when outer runs, outer controls when second runs, second controls when inner runs.'
    },
    {
      id: 'callbacks-with-return',
      title: 'Callbacks with Return',
      code: [
        'const items = [',
        "  { name: 'apple', price: 1 },",
        "  { name: 'banana', price: 2 },",
        "  { name: 'cherry', price: 3 }",
        '];',
        '',
        'const names = items.map(item => {',
        '  return item.name;',
        '});',
        '',
        'console.log(names);',
      ],
      steps: [
        {
          description: 'Script starts. Array of items is created.',
          codeLine: 0,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'items.map() is called with an arrow function callback.',
          codeLine: 6,
          executingFunction: 'map',
          registeredCallbacks: [{ name: 'arrow fn', status: 'waiting' }],
          output: [],
          phase: 'registering',
        },
        {
          description: 'Callback invoked with {name: "apple", price: 1}. Returns "apple".',
          codeLine: 7,
          executingFunction: 'map > callback',
          registeredCallbacks: [{ name: 'returns: "apple"', status: 'invoked' }],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'Callback invoked with {name: "banana", price: 2}. Returns "banana".',
          codeLine: 7,
          executingFunction: 'map > callback',
          registeredCallbacks: [
            { name: 'returns: "apple"', status: 'invoked' },
            { name: 'returns: "banana"', status: 'invoked' }
          ],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'Callback invoked with {name: "cherry", price: 3}. Returns "cherry".',
          codeLine: 7,
          executingFunction: 'map > callback',
          registeredCallbacks: [
            { name: 'returns: "apple"', status: 'invoked' },
            { name: 'returns: "banana"', status: 'invoked' },
            { name: 'returns: "cherry"', status: 'invoked' }
          ],
          output: [],
          phase: 'invoking',
        },
        {
          description: 'map collects all return values into a new array. console.log outputs it.',
          codeLine: 10,
          executingFunction: null,
          registeredCallbacks: [
            { name: 'returns: "apple"', status: 'invoked' },
            { name: 'returns: "banana"', status: 'invoked' },
            { name: 'returns: "cherry"', status: 'invoked' }
          ],
          output: ['["apple", "banana", "cherry"]'],
          phase: 'sync',
        },
      ],
      insight: 'With map(), what your callback RETURNS matters! Each return value becomes part of the new array.'
    },
  ],
  advanced: [
    {
      id: 'event-handlers',
      title: 'Event Handlers',
      code: [
        "const btn = document.querySelector('button');",
        '',
        'function handleClick() {',
        "  console.log('Clicked!');",
        '}',
        '',
        "btn.addEventListener('click', handleClick);",
        '',
        '// User clicks button...',
        '// handleClick is invoked',
      ],
      steps: [
        {
          description: 'Script starts. A button element is selected from the DOM.',
          codeLine: 0,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'handleClick function is defined.',
          codeLine: 2,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: "addEventListener registers handleClick as a PERSISTENT callback for 'click' events.",
          codeLine: 6,
          executingFunction: 'addEventListener',
          registeredCallbacks: [{ name: 'handleClick (persistent)', status: 'waiting' }],
          output: [],
          phase: 'registering',
        },
        {
          description: 'Synchronous code completes. handleClick stays registered, waiting for events.',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [{ name: 'handleClick (persistent)', status: 'waiting' }],
          output: [],
          phase: 'sync',
        },
        {
          description: '...Time passes... User clicks the button!',
          codeLine: 8,
          executingFunction: 'Event: click',
          registeredCallbacks: [{ name: 'handleClick (persistent)', status: 'waiting' }],
          output: [],
          phase: 'invoking',
        },
        {
          description: "Browser invokes handleClick. console.log('Clicked!') runs.",
          codeLine: 3,
          executingFunction: 'handleClick',
          registeredCallbacks: [{ name: 'handleClick (persistent)', status: 'invoked' }],
          output: ['Clicked!'],
          phase: 'invoking',
        },
        {
          description: 'handleClick completes. But it STAYS registered for future clicks!',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [{ name: 'handleClick (persistent)', status: 'waiting' }],
          output: ['Clicked!'],
          phase: 'sync',
        },
      ],
      insight: 'Event handlers are PERSISTENT callbacks - they stay registered and can be invoked multiple times, unlike one-time callbacks.'
    },
    {
      id: 'error-callbacks',
      title: 'Error Callbacks',
      code: [
        'function fetchData(url, onSuccess, onError) {',
        '  // Simulating async operation',
        '  const success = Math.random() > 0.5;',
        '  ',
        '  if (success) {',
        "    onSuccess({ data: 'result' });",
        '  } else {',
        "    onError(new Error('Failed'));",
        '  }',
        '}',
        '',
        'fetchData(',
        "  '/api/data',",
        '  (data) => console.log(data),',
        '  (err) => console.log(err.message)',
        ');',
      ],
      steps: [
        {
          description: 'Script starts. fetchData function is defined with two callback parameters.',
          codeLine: 0,
          executingFunction: null,
          registeredCallbacks: [],
          output: [],
          phase: 'sync',
        },
        {
          description: 'fetchData is called with a URL, success callback, and error callback.',
          codeLine: 11,
          executingFunction: 'fetchData',
          registeredCallbacks: [
            { name: 'onSuccess', status: 'waiting' },
            { name: 'onError', status: 'waiting' }
          ],
          output: [],
          phase: 'registering',
        },
        {
          description: 'Inside fetchData: random check determines success or failure.',
          codeLine: 2,
          executingFunction: 'fetchData',
          registeredCallbacks: [
            { name: 'onSuccess', status: 'waiting' },
            { name: 'onError', status: 'waiting' }
          ],
          output: [],
          phase: 'sync',
        },
        {
          description: 'SUCCESS PATH: onSuccess callback is invoked with the data.',
          codeLine: 5,
          executingFunction: 'fetchData > onSuccess',
          registeredCallbacks: [
            { name: 'onSuccess', status: 'invoked' },
            { name: 'onError', status: 'waiting' }
          ],
          output: ['{ data: "result" }'],
          phase: 'invoking',
        },
        {
          description: 'ERROR PATH: onError callback is invoked with the error.',
          codeLine: 7,
          executingFunction: 'fetchData > onError',
          registeredCallbacks: [
            { name: 'onSuccess', status: 'waiting' },
            { name: 'onError', status: 'invoked' }
          ],
          output: ['Failed'],
          phase: 'invoking',
        },
        {
          description: 'Only ONE callback is invoked based on the result. This is the dual-callback error pattern.',
          codeLine: -1,
          executingFunction: null,
          registeredCallbacks: [
            { name: 'onSuccess', status: 'invoked' },
            { name: 'onError', status: 'invoked' }
          ],
          output: ['(depends on random)'],
          phase: 'sync',
        },
      ],
      insight: 'The dual-callback pattern (onSuccess/onError) handles both outcomes. This evolved into Promises with .then()/.catch().'
    },
  ],
}

export function CallbacksBasicsViz() {
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

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return 'var(--color-purple-500)'
      case 'registering': return '#3b82f6'
      case 'invoking': return 'var(--color-emerald-500)'
    }
  }

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'sync': return 'Sync'
      case 'registering': return 'Registering'
      case 'invoking': return 'Invoking'
    }
  }

  return (
    <div className="flex flex-col gap-5 text-[var(--js-viz-text)]">
      {/* Level selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
              ${level === lvl
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full transition-all duration-150 cursor-pointer
              ${exampleIndex === i
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-2 gap-[var(--spacing-lg)] max-md:grid-cols-1">
        {/* Current Function Box */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--color-orange-500), var(--color-amber-400))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Current Function
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[120px] p-[var(--spacing-md)] pt-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentStep.executingFunction ? (
                <motion.div
                  key={currentStep.executingFunction}
                  className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-brand-primary-15)] border border-[var(--color-brand-primary-40)] rounded-lg font-mono text-sm text-[var(--color-brand-light)] text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {currentStep.executingFunction}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="text-[var(--color-gray-800)] text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  (idle)
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Registered Callbacks Box */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Registered Callbacks
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[120px] p-[var(--spacing-md)] pt-6">
            <div className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {currentStep.registeredCallbacks.length === 0 ? (
                  <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(none)</div>
                ) : (
                  currentStep.registeredCallbacks.map((cb, i) => (
                    <motion.div
                      key={cb.name + i}
                      className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-md font-mono text-xs text-center flex items-center justify-between gap-2 ${
                        cb.status === 'invoked'
                          ? 'bg-[var(--color-emerald-15)] border border-[var(--color-emerald-40)] text-[var(--color-emerald-400)]'
                          : 'bg-[var(--color-amber-15)] border border-[var(--color-amber-40)] text-[var(--color-amber-400)]'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <span>{cb.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-2xs ${
                        cb.status === 'invoked'
                          ? 'bg-[var(--color-emerald-500)] text-black'
                          : 'bg-[var(--color-amber-500)] text-black'
                      }`}>
                        {cb.status}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] shadow-[0_10px_24px_rgba(2,4,10,0.35)] overflow-hidden">
        <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-3)]">
          <span className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
            Code
          </span>
          <span className="px-[var(--spacing-sm)] py-0.5 rounded-full text-2xs font-semibold text-black" style={{ background: getPhaseColor(currentStep.phase) }}>
            {getPhaseLabel(currentStep.phase)}
          </span>
        </div>
        <pre className="m-0 py-[var(--spacing-sm)] max-h-48 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${currentStep.codeLine === i ? 'bg-[var(--color-brand-primary-20)]' : ''}`}
            >
              <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${currentStep.codeLine === i ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-gray-300)]'}`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Output Section */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
        <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
          Output
        </div>
        <div className="font-mono text-sm text-[var(--difficulty-1)] min-h-6">
          {currentStep.output.length === 0 ? (
            <span className="text-[var(--color-gray-800)]">-</span>
          ) : (
            currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className="py-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-[var(--spacing-md)] py-2.5 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-lg text-base text-[var(--js-viz-muted)] text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="inline-block px-[var(--spacing-xs)] py-0.5 bg-[var(--color-brand-primary-30)] rounded-md text-2xs font-semibold text-[var(--color-brand-light)] mr-[var(--spacing-sm)]">
            Step {stepIndex + 1}/{currentExample.steps.length}
          </span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Key insight */}
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-xs text-[var(--color-gray-500)] text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
