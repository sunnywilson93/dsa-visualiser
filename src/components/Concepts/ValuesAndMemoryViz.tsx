'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepProgress, StepControls } from '@/components/SharedViz'

interface MemoryBox {
  id: string
  value: string
  type: 'number' | 'string' | 'boolean' | 'object' | 'undefined'
  isNew?: boolean
  isChanged?: boolean
}

interface Variable {
  name: string
  pointsTo: string
  isNew?: boolean
}

interface Step {
  id: number
  description: string
  memory: MemoryBox[]
  variables: Variable[]
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const typeColors: Record<string, { color: string; bg: string }> = {
  number: { color: 'var(--color-blue-400)', bg: 'var(--color-blue-10)' },
  string: { color: 'var(--color-emerald-500)', bg: 'var(--color-emerald-10)' },
  boolean: { color: 'var(--color-purple-400)', bg: 'var(--color-accent-purple-15)' },
  object: { color: 'var(--color-amber-500)', bg: 'var(--color-amber-10)' },
  undefined: { color: 'var(--color-gray-500)', bg: 'var(--color-white-5)' },
}

const examples: Example[] = [
  {
    id: 'variables-point',
    title: 'Variables Point to Memory',
    steps: [
      {
        id: 0,
        description: 'Memory is like a warehouse with boxes. Each box has an address and can hold a value.',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean' },
        ],
        variables: [],
      },
      {
        id: 1,
        description: 'Variables are labels that POINT to memory boxes. They don\'t contain values themselves.',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean' },
        ],
        variables: [{ name: 'age', pointsTo: 'box1', isNew: true }],
      },
      {
        id: 2,
        description: 'let age = 42 creates a box with 42 and makes "age" point to it.',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean' },
        ],
        variables: [
          { name: 'age', pointsTo: 'box1' },
          { name: 'name', pointsTo: 'box2', isNew: true },
        ],
      },
      {
        id: 3,
        description: 'Reading a variable means "look at what this label points to and get the value".',
        memory: [
          { id: 'box1', value: '42', type: 'number', isChanged: true },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean' },
        ],
        variables: [
          { name: 'age', pointsTo: 'box1' },
          { name: 'name', pointsTo: 'box2' },
        ],
      },
    ],
    insight: 'Variables are labels, not containers. They point to where values live in memory.',
  },
  {
    id: 'copying-primitives',
    title: 'Copying Primitives',
    steps: [
      {
        id: 0,
        description: 'let x = 10 creates a box with 10 and labels it x.',
        memory: [{ id: 'box1', value: '10', type: 'number', isNew: true }],
        variables: [{ name: 'x', pointsTo: 'box1', isNew: true }],
      },
      {
        id: 1,
        description: 'let y = x copies the VALUE 10 into a NEW box. y points to the new box.',
        memory: [
          { id: 'box1', value: '10', type: 'number' },
          { id: 'box2', value: '10', type: 'number', isNew: true },
        ],
        variables: [
          { name: 'x', pointsTo: 'box1' },
          { name: 'y', pointsTo: 'box2', isNew: true },
        ],
      },
      {
        id: 2,
        description: 'x = 20 changes x\'s box to 20. y still points to its own box with 10!',
        memory: [
          { id: 'box1', value: '20', type: 'number', isChanged: true },
          { id: 'box2', value: '10', type: 'number' },
        ],
        variables: [
          { name: 'x', pointsTo: 'box1' },
          { name: 'y', pointsTo: 'box2' },
        ],
      },
      {
        id: 3,
        description: 'Result: x = 20, y = 10. They have separate boxes - changing x doesn\'t affect y.',
        memory: [
          { id: 'box1', value: '20', type: 'number' },
          { id: 'box2', value: '10', type: 'number' },
        ],
        variables: [
          { name: 'x', pointsTo: 'box1' },
          { name: 'y', pointsTo: 'box2' },
        ],
      },
    ],
    insight: 'For primitives (numbers, strings, booleans), copying creates a new independent box.',
  },
  {
    id: 'value-types',
    title: 'Types of Values',
    steps: [
      {
        id: 0,
        description: 'Numbers are for math operations: 42, 3.14, -7',
        memory: [{ id: 'box1', value: '42', type: 'number', isNew: true }],
        variables: [{ name: 'count', pointsTo: 'box1', isNew: true }],
      },
      {
        id: 1,
        description: 'Strings are for text: "hello", \'world\', `template`',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string', isNew: true },
        ],
        variables: [
          { name: 'count', pointsTo: 'box1' },
          { name: 'greeting', pointsTo: 'box2', isNew: true },
        ],
      },
      {
        id: 2,
        description: 'Booleans are for yes/no decisions: true, false',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean', isNew: true },
        ],
        variables: [
          { name: 'count', pointsTo: 'box1' },
          { name: 'greeting', pointsTo: 'box2' },
          { name: 'isReady', pointsTo: 'box3', isNew: true },
        ],
      },
      {
        id: 3,
        description: 'Objects hold multiple values together: { name: "Alice", age: 25 }',
        memory: [
          { id: 'box1', value: '42', type: 'number' },
          { id: 'box2', value: '"hello"', type: 'string' },
          { id: 'box3', value: 'true', type: 'boolean' },
          { id: 'box4', value: '{ ... }', type: 'object', isNew: true },
        ],
        variables: [
          { name: 'count', pointsTo: 'box1' },
          { name: 'greeting', pointsTo: 'box2' },
          { name: 'isReady', pointsTo: 'box3' },
          { name: 'user', pointsTo: 'box4', isNew: true },
        ],
      },
    ],
    insight: 'Every value has a type. The type determines what operations make sense.',
  },
]

export function ValuesAndMemoryViz() {
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

      {/* Main Grid - Variables & Memory */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-[var(--spacing-lg)] p-[var(--spacing-lg)] bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl">
        {/* Variables Column */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)] mb-3">
            Variables (Labels)
          </div>
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <AnimatePresence mode="popLayout">
              {currentStep.variables.length === 0 ? (
                <span className="text-[var(--color-gray-800)] text-sm italic">No variables yet</span>
              ) : (
                currentStep.variables.map(v => (
                  <motion.div
                    key={v.name}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center gap-[var(--spacing-sm)] px-3 py-2 rounded-lg border transition-all ${
                      v.isNew
                        ? 'bg-[var(--color-emerald-15)] border-[var(--color-emerald-500)] shadow-[0_0_10px_var(--color-emerald-30)]'
                        : 'bg-[var(--color-black-20)] border-[var(--color-white-10)]'
                    }`}
                  >
                    <span className="text-white font-mono text-sm">{v.name}</span>
                    <motion.span
                      className="text-[var(--color-brand-primary)]"
                      animate={{ x: v.isNew ? [0, 5, 0] : 0 }}
                      transition={{ repeat: v.isNew ? Infinity : 0, duration: 0.8 }}
                    >
                      →
                    </motion.span>
                    {v.isNew && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-emerald-20)] text-[var(--color-emerald-500)] font-medium ml-auto">
                        new
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Memory Column */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)] mb-3">
            Memory (Boxes)
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {currentStep.memory.map(box => {
                const pointingVars = currentStep.variables.filter(v => v.pointsTo === box.id)
                const colors = typeColors[box.type]

                return (
                  <motion.div
                    key={box.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative flex flex-col items-center"
                  >
                    <motion.div
                      className={`w-20 h-20 flex items-center justify-center rounded-lg border-2 font-mono text-sm transition-all ${
                        box.isNew
                          ? 'shadow-[0_0_20px_var(--color-emerald-40)]'
                          : box.isChanged
                            ? 'shadow-[0_0_20px_var(--color-amber-40)]'
                            : ''
                      }`}
                      style={{
                        borderColor: box.isNew ? 'var(--color-emerald-500)' : box.isChanged ? 'var(--color-amber-500)' : colors.color,
                        backgroundColor: colors.bg,
                        color: colors.color,
                      }}
                    >
                      {box.value}
                    </motion.div>
                    <div className="mt-1 text-[10px] text-[var(--color-gray-500)]">{box.type}</div>
                    {pointingVars.length > 0 && (
                      <div className="absolute -top-6 text-xs text-[var(--color-gray-400)]">
                        {pointingVars.map(v => v.name).join(', ')}
                      </div>
                    )}
                    {box.isNew && (
                      <span className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-emerald-500)] text-white font-medium">
                        new
                      </span>
                    )}
                    {box.isChanged && (
                      <span className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-amber-500)] text-white font-medium">
                        changed
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-emerald-10)] border border-[var(--color-emerald-30)] rounded-lg text-sm text-[var(--color-emerald-400)] text-center">
        <span className="font-semibold text-[var(--color-emerald-500)] mr-[var(--spacing-sm)]">💡 Key Insight:</span>
        {currentExample.insight}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-[var(--color-gray-500)] flex-wrap justify-center p-[var(--spacing-sm)] bg-[var(--color-black-20)] rounded-lg">
        {Object.entries(typeColors).map(([type, colors]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: colors.color }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}
