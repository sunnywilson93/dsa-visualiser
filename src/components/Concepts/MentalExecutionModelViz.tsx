'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

type Phase = 'before' | 'executing' | 'complete'

interface StateEntry {
  name: string
  value: string
  isNew?: boolean
  isChanged?: boolean
}

interface ExecutionStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  state: StateEntry[]
  output: string[]
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: ExecutionStep[]
  insight: string
}

const phaseInfo: Record<Phase, { label: string; color: string; bgColor: string }> = {
  before: { label: 'Before Execution', color: 'var(--color-blue-400)', bgColor: 'var(--color-blue-20)' },
  executing: { label: 'Executing', color: 'var(--color-emerald-500)', bgColor: 'var(--color-emerald-20)' },
  complete: { label: 'Complete', color: 'var(--color-purple-400)', bgColor: 'var(--color-accent-purple-20)' },
}

const examples: Example[] = [
  {
    id: 'basic-trace',
    title: 'Tracing Variables',
    code: [
      'let x = 5;',
      'let y = x + 3;',
      'x = x + 1;',
      'console.log(x);',
      'console.log(y);',
    ],
    steps: [
      {
        id: 0,
        codeLine: -1,
        description: 'Before execution, state is empty. The engine will process each line top-to-bottom.',
        phase: 'before',
        state: [],
        output: [],
      },
      {
        id: 1,
        codeLine: 0,
        description: 'let x = 5 creates variable x and stores 5. State now tracks x.',
        phase: 'executing',
        state: [{ name: 'x', value: '5', isNew: true }],
        output: [],
      },
      {
        id: 2,
        codeLine: 1,
        description: 'let y = x + 3. Engine looks up x (5), adds 3, stores 8 in new variable y.',
        phase: 'executing',
        state: [{ name: 'x', value: '5' }, { name: 'y', value: '8', isNew: true }],
        output: [],
      },
      {
        id: 3,
        codeLine: 2,
        description: 'x = x + 1. Engine reads x (5), adds 1, writes 6 back to x. Note: y is unchanged!',
        phase: 'executing',
        state: [{ name: 'x', value: '6', isChanged: true }, { name: 'y', value: '8' }],
        output: [],
      },
      {
        id: 4,
        codeLine: 3,
        description: 'console.log(x) reads x (6) and outputs it.',
        phase: 'executing',
        state: [{ name: 'x', value: '6' }, { name: 'y', value: '8' }],
        output: ['6'],
      },
      {
        id: 5,
        codeLine: 4,
        description: 'console.log(y) outputs 8. y hasn\'t changed since it was created.',
        phase: 'complete',
        state: [{ name: 'x', value: '6' }, { name: 'y', value: '8' }],
        output: ['6', '8'],
      },
    ],
    insight: 'Variables store values, not links. When y = x + 3, y gets 8, not "whatever x is + 3".',
  },
  {
    id: 'order-matters',
    title: 'Order Matters',
    code: [
      '// This works:',
      'let a = 10;',
      'let b = a * 2;',
      'console.log(b);',
      '',
      '// Error if reversed!',
    ],
    steps: [
      {
        id: 0,
        codeLine: -1,
        description: 'Code executes top-to-bottom. Each line can only use what\'s defined above it.',
        phase: 'before',
        state: [],
        output: [],
      },
      {
        id: 1,
        codeLine: 0,
        description: 'Comment line - the engine skips this entirely.',
        phase: 'executing',
        state: [],
        output: [],
      },
      {
        id: 2,
        codeLine: 1,
        description: 'let a = 10 creates a. Now a exists for future lines to use.',
        phase: 'executing',
        state: [{ name: 'a', value: '10', isNew: true }],
        output: [],
      },
      {
        id: 3,
        codeLine: 2,
        description: 'let b = a * 2. a exists (10), so b = 10 * 2 = 20. Works!',
        phase: 'executing',
        state: [{ name: 'a', value: '10' }, { name: 'b', value: '20', isNew: true }],
        output: [],
      },
      {
        id: 4,
        codeLine: 3,
        description: 'console.log(b) outputs 20.',
        phase: 'executing',
        state: [{ name: 'a', value: '10' }, { name: 'b', value: '20' }],
        output: ['20'],
      },
      {
        id: 5,
        codeLine: 5,
        description: 'If we tried b = a * 2 BEFORE let a = 10, it would crash. Order matters!',
        phase: 'complete',
        state: [{ name: 'a', value: '10' }, { name: 'b', value: '20' }],
        output: ['20'],
      },
    ],
    insight: 'Variables must be declared before use. Reading top-to-bottom is how the engine reads it.',
  },
  {
    id: 'function-trace',
    title: 'Tracing Functions',
    code: [
      'function double(n) {',
      '  return n * 2;',
      '}',
      '',
      'let result = double(5);',
      'console.log(result);',
    ],
    steps: [
      {
        id: 0,
        codeLine: -1,
        description: 'Functions are defined first, then called later. Let\'s trace the execution.',
        phase: 'before',
        state: [{ name: 'double', value: 'ƒ()' }],
        output: [],
      },
      {
        id: 1,
        codeLine: 4,
        description: 'let result = double(5). Engine sees double(5), so it jumps INTO the function.',
        phase: 'executing',
        state: [{ name: 'double', value: 'ƒ()' }],
        output: [],
      },
      {
        id: 2,
        codeLine: 0,
        description: 'Inside double: n = 5 (the argument we passed).',
        phase: 'executing',
        state: [{ name: 'double', value: 'ƒ()' }, { name: 'n', value: '5', isNew: true }],
        output: [],
      },
      {
        id: 3,
        codeLine: 1,
        description: 'return n * 2 → return 5 * 2 → return 10. The function gives back 10.',
        phase: 'executing',
        state: [{ name: 'double', value: 'ƒ()' }],
        output: [],
      },
      {
        id: 4,
        codeLine: 4,
        description: 'Back to line 5: result = 10 (what double returned). n is gone (function ended).',
        phase: 'executing',
        state: [{ name: 'double', value: 'ƒ()' }, { name: 'result', value: '10', isNew: true }],
        output: [],
      },
      {
        id: 5,
        codeLine: 5,
        description: 'console.log(result) outputs 10.',
        phase: 'complete',
        state: [{ name: 'double', value: 'ƒ()' }, { name: 'result', value: '10' }],
        output: ['10'],
      },
    ],
    insight: 'When calling a function, trace INSIDE it, then return to where you called from.',
  },
]

export function MentalExecutionModelViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]
  const isAtEnd = stepIndex >= currentExample.steps.length - 1
  const phase = phaseInfo[currentStep.phase]

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* Example Tabs */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full border transition-all min-h-[44px] ${
              exampleIndex === i
                ? 'bg-[var(--color-brand-primary-20)] border-[var(--color-brand-primary)] text-white shadow-[0_0_12px_var(--color-brand-primary-30)]'
                : 'bg-[var(--color-white-4)] border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-lg)]">
        {/* Code Panel */}
        <div className="bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-5)] text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">
            <span>Code</span>
            <span
              className="text-sm font-semibold px-2.5 py-1 rounded-xl text-white uppercase tracking-wider"
              style={{ backgroundColor: phase.bgColor, color: phase.color }}
            >
              {phase.label}
            </span>
          </div>
          <CodePanel
            code={currentExample.code}
            highlightedLine={currentStep.codeLine}
            title=""
          />
        </div>

        {/* State Panel */}
        <div className="flex flex-col gap-[var(--spacing-md)]">
          {/* Current State Box */}
          <div className="bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl overflow-hidden">
            <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-5)] text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">
              Current State
            </div>
            <div className="p-[var(--spacing-md)] min-h-[100px]">
              <div className="flex flex-wrap gap-[var(--spacing-sm)]">
                <AnimatePresence mode="popLayout">
                  {currentStep.state.length === 0 ? (
                    <span className="text-sm text-[var(--color-gray-800)] italic">Empty (no variables yet)</span>
                  ) : (
                    currentStep.state.map((entry) => (
                      <motion.div
                        key={entry.name}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`flex items-center gap-[var(--spacing-xs)] px-2.5 py-1.5 rounded-md border transition-all ${
                          entry.isNew
                            ? 'bg-[var(--color-emerald-15)] border-[var(--color-emerald-500)] shadow-[0_0_10px_var(--color-emerald-30)]'
                            : entry.isChanged
                              ? 'bg-[var(--color-amber-15)] border-[var(--color-amber-500)] shadow-[0_0_10px_var(--color-amber-30)]'
                              : 'bg-[var(--color-slate-500-50)] border-[var(--color-white-10)]'
                        }`}
                      >
                        <span className="font-mono text-sm text-[var(--color-blue-400)]">{entry.name}</span>
                        <span className="text-[var(--color-gray-700)] text-sm">=</span>
                        <motion.span
                          key={entry.value}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="font-mono text-sm font-semibold text-[var(--color-emerald-500)]"
                        >
                          {entry.value}
                        </motion.span>
                        {entry.isNew && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-emerald-20)] text-[var(--color-emerald-500)] font-medium">
                            new
                          </span>
                        )}
                        {entry.isChanged && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-amber-15)] text-[var(--color-amber-500)] font-medium">
                            changed
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Console Output Box */}
          <div className="bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl overflow-hidden">
            <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-5)] text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">
              Console Output
            </div>
            <div className="p-[var(--spacing-md)] font-mono text-sm min-h-[80px]">
              <AnimatePresence>
                {currentStep.output.length === 0 ? (
                  <span className="text-[var(--color-gray-800)] italic">No output yet</span>
                ) : (
                  currentStep.output.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={i === currentStep.output.length - 1 ? { opacity: 0, x: -10 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      className={`py-[var(--spacing-xs)] ${
                        i === currentStep.output.length - 1
                          ? 'text-[var(--color-amber-400)] bg-[var(--color-amber-10)] border-l-2 border-[var(--color-amber-500)] pl-[var(--spacing-sm)] -ml-[var(--spacing-sm)]'
                          : 'text-[var(--color-gray-400)]'
                      }`}
                    >
                      <span className="text-[var(--color-gray-600)] mr-[var(--spacing-xs)]">{'>'}</span>
                      {line}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress & Controls */}
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

      {/* Insight Box */}
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] rounded-lg text-sm text-[var(--color-amber-200)] text-center">
        <span className="font-semibold text-[var(--color-amber-500)] mr-[var(--spacing-sm)]">💡 Key Insight:</span>
        {currentExample.insight}
      </div>

      {/* Legend */}
      <div className="flex gap-[var(--spacing-xl)] justify-center flex-wrap p-[var(--spacing-sm)] bg-[var(--color-black-20)] rounded-lg">
        <div className="flex items-center gap-[var(--spacing-md)] flex-wrap">
          <span className="text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">State:</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full bg-[var(--color-emerald-500)]" />
            <span>new variable</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full bg-[var(--color-amber-500)]" />
            <span>value changed</span>
          </div>
        </div>
        <div className="flex items-center gap-[var(--spacing-md)] flex-wrap">
          <span className="text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">Phase:</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full bg-[var(--color-blue-400)]" />
            <span>before</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full bg-[var(--color-emerald-500)]" />
            <span>executing</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full bg-[var(--color-purple-400)]" />
            <span>complete</span>
          </div>
        </div>
      </div>
    </div>
  )
}
