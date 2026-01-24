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

interface FunctionStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'call' | 'enter' | 'execute' | 'return' | 'cleanup'
  callStack: CallStackFrame[]
  output: string[]
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
  intermediate: [],
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
