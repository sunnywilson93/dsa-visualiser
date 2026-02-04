import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface Variable {
  name: string
  value: string
  status: 'hoisted' | 'initialized' | 'tdz'
}

interface Step {
  id: number
  phase: 'Creation' | 'Execution'
  description: string
  codeLine: number
  variables: Variable[]
  output: string[]
  error?: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string; description: string }> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-emerald-500)',
    description: 'Basic hoisting concepts'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-amber-500)',
    description: 'TDZ and comparisons'
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-red-500)',
    description: 'Edge cases and gotchas'
  }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'var-basic',
      title: 'var Hoisting',
      code: [
        'console.log(x);  // ???',
        'var x = 5;',
        'console.log(x);  // ???',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created. JS scans for declarations and hoists var x to the top with value undefined',
          codeLine: -1,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(x) executes - x exists but is undefined because only the declaration was hoisted, not the assignment',
          codeLine: 0,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: ['undefined'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'var x = 5 executes - now x gets its actual value assigned',
          codeLine: 1,
          variables: [{ name: 'x', value: '5', status: 'initialized' }],
          output: ['undefined'],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'console.log(x) executes - x is now 5',
          codeLine: 2,
          variables: [{ name: 'x', value: '5', status: 'initialized' }],
          output: ['undefined', '5'],
        },
      ],
    },
    {
      id: 'function-basic',
      title: 'Function Declaration',
      code: [
        'greet();  // ???',
        '',
        'function greet() {',
        '  console.log("Hello!");',
        '}',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created. Function declarations are FULLY hoisted - both the name and the entire function body!',
          codeLine: -1,
          variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'greet() is called - it works! The function is fully available because function declarations are completely hoisted',
          codeLine: 0,
          variables: [{ name: 'greet', value: 'fn()', status: 'initialized' }],
          output: ['Hello!'],
        },
      ],
    },
  ],
  intermediate: [
    {
      id: 'let-tdz',
      title: 'let & TDZ',
      code: [
        'console.log(y);  // ???',
        'let y = 10;',
        'console.log(y);  // ???',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Global EC created. let y IS hoisted, but placed in Temporal Dead Zone (TDZ) - it exists but cannot be accessed',
          codeLine: -1,
          variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(y) - y is in TDZ! Accessing it throws ReferenceError. This is the key difference from var',
          codeLine: 0,
          variables: [{ name: 'y', value: '<TDZ>', status: 'tdz' }],
          output: [],
          error: "ReferenceError: Cannot access 'y' before initialization",
        },
      ],
    },
    {
      id: 'var-vs-let',
      title: 'var vs let',
      code: [
        'console.log(a);  // var',
        'console.log(b);  // let',
        'var a = 1;',
        'let b = 2;',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Both a and b are hoisted, but with different behaviors: var → undefined, let → TDZ',
          codeLine: -1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(a) works! var variables are initialized with undefined during hoisting',
          codeLine: 0,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'console.log(b) fails! let variables are in TDZ until their declaration is reached',
          codeLine: 1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined'],
          error: "ReferenceError: Cannot access 'b' before initialization",
        },
      ],
    },
    {
      id: 'func-expression',
      title: 'Function Expression',
      code: [
        'greet();  // ???',
        '',
        'var greet = function() {',
        '  console.log("Hi!");',
        '};',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'greet is hoisted as a VAR (undefined), NOT as a function! The function body is NOT hoisted',
          codeLine: -1,
          variables: [{ name: 'greet', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'greet() fails! greet is undefined at this point - you cannot call undefined as a function',
          codeLine: 0,
          variables: [{ name: 'greet', value: 'undefined', status: 'hoisted' }],
          output: [],
          error: "TypeError: greet is not a function",
        },
      ],
    },
  ],
  advanced: [
    {
      id: 'mixed',
      title: 'Mixed Declarations',
      code: [
        'console.log(a, fn());',
        'var a = 1;',
        'let b = 2;',
        'function fn() { return 42; }',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'Hoisting priority: 1) Functions (fully), 2) var (undefined), 3) let/const (TDZ)',
          codeLine: -1,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'console.log(a, fn()) - a is undefined, fn() returns 42. Functions are ready immediately!',
          codeLine: 0,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined 42'],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'var a = 1 - a gets its value',
          codeLine: 1,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b', value: '<TDZ>', status: 'tdz' },
          ],
          output: ['undefined 42'],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'let b = 2 - b leaves TDZ and gets initialized',
          codeLine: 2,
          variables: [
            { name: 'fn', value: 'fn()', status: 'initialized' },
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b', value: '2', status: 'initialized' },
          ],
          output: ['undefined 42'],
        },
      ],
    },
    {
      id: 'redeclaration',
      title: 'var Redeclaration',
      code: [
        'var x = 1;',
        'var x = 2;',
        'console.log(x);',
        '',
        '// let y = 1;',
        '// let y = 2; // SyntaxError!',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'var allows redeclaration in same scope - x is hoisted once. let/const would throw SyntaxError!',
          codeLine: -1,
          variables: [{ name: 'x', value: 'undefined', status: 'hoisted' }],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'First var x = 1 executes',
          codeLine: 0,
          variables: [{ name: 'x', value: '1', status: 'initialized' }],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Second var x = 2 simply reassigns x. No error with var!',
          codeLine: 1,
          variables: [{ name: 'x', value: '2', status: 'initialized' }],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'console.log(x) outputs 2. This is why let/const are preferred - they catch accidental redeclarations',
          codeLine: 2,
          variables: [{ name: 'x', value: '2', status: 'initialized' }],
          output: ['2'],
        },
      ],
    },
    {
      id: 'block-scope',
      title: 'Block Scope',
      code: [
        'var a = 1;',
        'let b = 2;',
        '{',
        '  var a = 10;  // same a!',
        '  let b = 20;  // new b!',
        '  console.log(a, b);',
        '}',
        'console.log(a, b);',
      ],
      steps: [
        {
          id: 0,
          phase: 'Creation',
          description: 'var is function-scoped (ignores blocks), let is block-scoped. Two different behaviors!',
          codeLine: -1,
          variables: [
            { name: 'a', value: 'undefined', status: 'hoisted' },
            { name: 'b (outer)', value: '<TDZ>', status: 'tdz' },
          ],
          output: [],
        },
        {
          id: 1,
          phase: 'Execution',
          description: 'var a = 1, let b = 2 - outer variables initialized',
          codeLine: 1,
          variables: [
            { name: 'a', value: '1', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
          ],
          output: [],
        },
        {
          id: 2,
          phase: 'Execution',
          description: 'Entering block: var a = 10 OVERWRITES outer a, but let b = 20 creates NEW block-scoped b',
          codeLine: 4,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
            { name: 'b (block)', value: '20', status: 'initialized' },
          ],
          output: [],
        },
        {
          id: 3,
          phase: 'Execution',
          description: 'Inside block: console.log(a, b) → 10, 20 (uses block-scoped b)',
          codeLine: 5,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
            { name: 'b (block)', value: '20', status: 'initialized' },
          ],
          output: ['10 20'],
        },
        {
          id: 4,
          phase: 'Execution',
          description: 'Outside block: a is still 10 (var leaked!), but b is 2 (block b is gone). This is why let is safer!',
          codeLine: 7,
          variables: [
            { name: 'a', value: '10', status: 'initialized' },
            { name: 'b (outer)', value: '2', status: 'initialized' },
          ],
          output: ['10 20', '10 2'],
        },
      ],
    },
  ],
}

export function HoistingViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  // Auto-scroll to highlighted line
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
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getStatusColor = (status: Variable['status']) => {
    switch (status) {
      case 'hoisted': return 'var(--color-amber-500)'
      case 'initialized': return 'var(--color-emerald-500)'
      case 'tdz': return 'var(--color-red-500)'
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

      {/* Main visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridTemplateAreas: '"code variables" "output output"' }}>
        {/* Code panel */}
        <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40" style={{ gridArea: 'code' }}>
          <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
            <span>Code</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-black"
              style={{ background: currentStep.phase === 'Creation' ? 'var(--color-blue-400)' : 'var(--color-emerald-500)' }}
            >
              {currentStep.phase} Phase
            </span>
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
                <span className={`font-mono text-xs ${currentStep.codeLine === i ? 'text-blue-300' : 'text-gray-300'}`}>
                  {line || ' '}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Variables panel - Neon Box */}
        <div className="relative rounded-xl p-[3px]" style={{ gridArea: 'variables', background: 'var(--gradient-neon-blue)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Variable Environment
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[180px] p-4 pt-6">
            <div className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout">
                {currentStep.variables.map(v => (
                  <motion.div
                    key={v.name}
                    className="flex items-center gap-3 px-2.5 py-2 bg-black/30 border-l-[3px] rounded-md"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ borderColor: getStatusColor(v.status) }}
                    layout
                  >
                    <span className="font-mono text-sm text-blue-300 min-w-[50px]">{v.name}</span>
                    <motion.span
                      key={v.value}
                      className="font-mono text-sm font-semibold flex-1"
                      style={{ color: getStatusColor(v.status) }}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {v.value}
                    </motion.span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-black uppercase"
                      style={{ background: getStatusColor(v.status) }}
                    >
                      {v.status === 'tdz' ? 'TDZ' : v.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Output panel - Neon Box */}
        <div className="relative rounded-xl p-[3px] md:col-span-2" style={{ gridArea: 'output', background: 'var(--gradient-neon-emerald)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1 bg-gray-800 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Output
          </div>
          <div className="bg-[var(--color-bg-page-secondary,#0f172a)] rounded-lg min-h-[80px] p-4 pt-6 flex flex-col gap-1">
            {currentStep.output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-base text-emerald-500 py-0.5"
              >
                {line}
              </motion.div>
            ))}
            {currentStep.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs text-red-500 break-words"
              >
                {currentStep.error}
              </motion.div>
            )}
            {currentStep.output.length === 0 && !currentStep.error && (
              <span className="text-sm text-gray-600">—</span>
            )}
          </div>
        </div>
      </div>

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
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Legend */}
      <div className="flex gap-6 justify-center flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-4 h-4 rounded-full bg-amber-500" />
          <span>Hoisted (undefined)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-4 h-4 rounded-full bg-red-500" />
          <span>TDZ (cannot access)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-4 h-4 rounded-full bg-emerald-500" />
          <span>Initialized</span>
        </div>
      </div>
    </div>
  )
}
