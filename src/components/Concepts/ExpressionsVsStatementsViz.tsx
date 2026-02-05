'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepProgress, StepControls } from '@/components/SharedViz'

interface CodeItem {
  code: string
  type: 'expression' | 'statement'
  evaluatesTo?: string
  explanation: string
}

interface Step {
  id: number
  description: string
  items: CodeItem[]
  highlightIndex?: number
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const typeInfo = {
  expression: {
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-10)',
    border: 'var(--color-emerald-30)',
    label: 'Expression',
    description: 'Produces a value',
  },
  statement: {
    color: 'var(--color-purple-400)',
    bg: 'var(--color-accent-purple-15)',
    border: 'var(--color-accent-purple-25)',
    label: 'Statement',
    description: 'Performs an action',
  },
}

const examples: Example[] = [
  {
    id: 'basic-difference',
    title: 'The Difference',
    steps: [
      {
        id: 0,
        description: 'Expressions PRODUCE values. You can replace them with their result.',
        items: [
          { code: '5 + 3', type: 'expression', evaluatesTo: '8', explanation: 'Evaluates to 8' },
          { code: '"hello"', type: 'expression', evaluatesTo: '"hello"', explanation: 'Evaluates to the string' },
          { code: 'Math.max(1, 5)', type: 'expression', evaluatesTo: '5', explanation: 'Evaluates to 5' },
        ],
        highlightIndex: 0,
      },
      {
        id: 1,
        description: 'Statements PERFORM actions. They don\'t produce a value you can use.',
        items: [
          { code: 'let x = 5;', type: 'statement', explanation: 'Declares a variable (action)' },
          { code: 'if (x > 0) { ... }', type: 'statement', explanation: 'Branches execution (action)' },
          { code: 'for (let i = 0; ...) { }', type: 'statement', explanation: 'Loops (action)' },
        ],
        highlightIndex: 0,
      },
      {
        id: 2,
        description: 'Key test: Can you assign it to a variable? Expressions: yes. Statements: no.',
        items: [
          { code: 'let result = 5 + 3;', type: 'expression', evaluatesTo: '8', explanation: '✓ Works! 5 + 3 → 8' },
          { code: 'let result = if (x > 0) { 1 };', type: 'statement', explanation: '✗ ERROR! if is a statement' },
        ],
        highlightIndex: 1,
      },
    ],
    insight: 'Expressions evaluate to values; statements perform actions. This explains where code can go.',
  },
  {
    id: 'ternary-vs-if',
    title: 'Ternary vs If/Else',
    steps: [
      {
        id: 0,
        description: 'if/else is a STATEMENT - it branches execution but produces no value.',
        items: [
          { code: 'let status;', type: 'statement', explanation: 'Declare variable' },
          { code: 'if (age >= 18) {', type: 'statement', explanation: 'if statement begins' },
          { code: '  status = "adult";', type: 'statement', explanation: 'Assignment inside if' },
          { code: '} else {', type: 'statement', explanation: 'else branch' },
          { code: '  status = "minor";', type: 'statement', explanation: 'Assignment inside else' },
          { code: '}', type: 'statement', explanation: 'End of if/else' },
        ],
      },
      {
        id: 1,
        description: 'Ternary (? :) is an EXPRESSION - it evaluates to one of two values.',
        items: [
          { code: 'let status = age >= 18 ? "adult" : "minor";', type: 'expression', evaluatesTo: '"adult" or "minor"', explanation: 'Single line that produces a value!' },
        ],
        highlightIndex: 0,
      },
      {
        id: 2,
        description: 'This is why ternary works in places if/else can\'t - like JSX or template literals.',
        items: [
          { code: 'return <div>{isAdmin ? "Admin" : "User"}</div>', type: 'expression', evaluatesTo: '"Admin" or "User"', explanation: '✓ Ternary in JSX' },
          { code: '`Hello, ${isAdmin ? "Admin" : "User"}`', type: 'expression', evaluatesTo: 'string', explanation: '✓ Ternary in template literal' },
        ],
      },
    ],
    insight: 'Use ternary when you need a VALUE. Use if/else when you need branching LOGIC.',
  },
  {
    id: 'console-log',
    title: 'Why console.log Needs Expressions',
    steps: [
      {
        id: 0,
        description: 'console.log() displays a VALUE. Its argument must be an expression.',
        items: [
          { code: 'console.log(5 + 3);', type: 'expression', evaluatesTo: '8', explanation: '✓ 5 + 3 → 8 → logged' },
          { code: 'console.log("hello");', type: 'expression', evaluatesTo: '"hello"', explanation: '✓ String literal is an expression' },
          { code: 'console.log(x > 5);', type: 'expression', evaluatesTo: 'true/false', explanation: '✓ Comparison produces boolean' },
        ],
      },
      {
        id: 1,
        description: 'Statements don\'t produce values, so they can\'t be arguments.',
        items: [
          { code: 'console.log(let y = 5);', type: 'statement', explanation: '✗ ERROR! Declaration is a statement' },
          { code: 'console.log(if (x) { 1 });', type: 'statement', explanation: '✗ ERROR! if is a statement' },
        ],
        highlightIndex: 0,
      },
      {
        id: 2,
        description: 'Quick trick: If it can go inside console.log(), it\'s an expression!',
        items: [
          { code: 'x = 5', type: 'expression', evaluatesTo: '5', explanation: '✓ Assignment IS an expression (returns the value)' },
          { code: 'function() { }', type: 'expression', evaluatesTo: 'function', explanation: '✓ Function expression produces a function' },
        ],
      },
    ],
    insight: 'console.log needs something that produces a value. That\'s what expressions do.',
  },
]

export function ExpressionsVsStatementsViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]
  const isAtEnd = stepIndex >= currentExample.steps.length - 1

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

      {/* Type Comparison Header */}
      <div className="p-[var(--spacing-lg)] bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl">
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          {Object.entries(typeInfo).map(([key, info]) => (
            <div
              key={key}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: info.bg, borderColor: info.border }}
            >
              <div className="font-semibold" style={{ color: info.color }}>{info.label}</div>
              <div className="text-xs text-[var(--color-gray-500)]">{info.description}</div>
            </div>
          ))}
        </div>

        {/* Code Items */}
        <div className="flex flex-col gap-[var(--spacing-sm)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${exampleIndex}-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-[var(--spacing-sm)]"
            >
              {currentStep.items.map((item, i) => {
                const info = typeInfo[item.type]
                const isHighlighted = currentStep.highlightIndex === i

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, scale: isHighlighted ? 1.02 : 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isHighlighted ? 'ring-2 ring-white/20' : ''
                    }`}
                    style={{ backgroundColor: info.bg, borderColor: info.border }}
                  >
                    <code className="font-mono text-sm flex-1" style={{ color: info.color }}>
                      {item.code}
                    </code>

                    {item.evaluatesTo && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--color-gray-500)]">→</span>
                        <span className="px-2 py-0.5 bg-[var(--color-emerald-20)] rounded text-[var(--color-emerald-500)] font-mono">
                          {item.evaluatesTo}
                        </span>
                      </div>
                    )}

                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{ backgroundColor: `${info.color}20`, color: info.color }}
                    >
                      {item.type}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-blue-10)] border border-[var(--color-blue-30)] rounded-lg text-sm text-[var(--color-blue-400)] text-center">
        <span className="font-semibold text-[var(--color-blue-500)] mr-[var(--spacing-sm)]">💡 Key Insight:</span>
        {currentExample.insight}
      </div>

      {/* Legend */}
      <div className="flex gap-[var(--spacing-xl)] justify-center flex-wrap p-[var(--spacing-sm)] bg-[var(--color-black-20)] rounded-lg">
        {Object.entries(typeInfo).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
            <span className="w-3 h-3 rounded" style={{ background: info.color }} />
            <span>{info.label}: {info.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
