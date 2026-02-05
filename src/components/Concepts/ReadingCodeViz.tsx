'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepProgress, StepControls } from '@/components/SharedViz'

interface Annotation {
  lineIndex: number
  type: 'input' | 'output' | 'happyPath' | 'edgeCase' | 'comment'
  text: string
}

interface Step {
  id: number
  description: string
  code: string[]
  annotations: Annotation[]
  focusLines?: number[]
}

interface Example {
  id: string
  title: string
  steps: Step[]
  insight: string
}

const annotationColors: Record<string, { color: string; bg: string; border: string; label: string }> = {
  input: {
    color: 'var(--color-blue-400)',
    bg: 'var(--color-blue-10)',
    border: 'var(--color-blue-30)',
    label: 'Input',
  },
  output: {
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-10)',
    border: 'var(--color-emerald-30)',
    label: 'Output',
  },
  happyPath: {
    color: 'var(--color-amber-500)',
    bg: 'var(--color-amber-10)',
    border: 'var(--color-amber-30)',
    label: 'Happy Path',
  },
  edgeCase: {
    color: 'var(--color-gray-500)',
    bg: 'var(--color-white-5)',
    border: 'var(--color-white-10)',
    label: 'Edge Case',
  },
  comment: {
    color: 'var(--color-purple-400)',
    bg: 'var(--color-accent-purple-15)',
    border: 'var(--color-accent-purple-25)',
    label: 'Comment',
  },
}

const examples: Example[] = [
  {
    id: 'inputs-outputs',
    title: 'Step 1: Inputs & Outputs',
    steps: [
      {
        id: 0,
        description: 'Start by identifying WHAT goes in and WHAT comes out. Ignore the body for now.',
        code: [
          'function calculateTotal(items, taxRate) {',
          '  let subtotal = 0;',
          '  for (const item of items) {',
          '    subtotal += item.price;',
          '  }',
          '  return subtotal * (1 + taxRate);',
          '}',
        ],
        annotations: [],
        focusLines: [0, 6],
      },
      {
        id: 1,
        description: 'INPUTS: items (an array) and taxRate (a number). This tells us what we\'re working with.',
        code: [
          'function calculateTotal(items, taxRate) {',
          '  let subtotal = 0;',
          '  for (const item of items) {',
          '    subtotal += item.price;',
          '  }',
          '  return subtotal * (1 + taxRate);',
          '}',
        ],
        annotations: [
          { lineIndex: 0, type: 'input', text: 'INPUT: items (array), taxRate (number)' },
        ],
        focusLines: [0],
      },
      {
        id: 2,
        description: 'OUTPUT: returns a number (subtotal with tax). Now we know the function\'s contract.',
        code: [
          'function calculateTotal(items, taxRate) {',
          '  let subtotal = 0;',
          '  for (const item of items) {',
          '    subtotal += item.price;',
          '  }',
          '  return subtotal * (1 + taxRate);',
          '}',
        ],
        annotations: [
          { lineIndex: 0, type: 'input', text: 'INPUT: items (array), taxRate (number)' },
          { lineIndex: 5, type: 'output', text: 'OUTPUT: number (total with tax)' },
        ],
        focusLines: [5],
      },
    ],
    insight: 'Before reading the body, understand the contract: what goes in, what comes out.',
  },
  {
    id: 'happy-path',
    title: 'Step 2: Find the Happy Path',
    steps: [
      {
        id: 0,
        description: 'Edge cases (error handling) can distract. Find the "normal success" path first.',
        code: [
          'function getUserData(userId) {',
          '  if (!userId) return null;',
          '  if (cache.has(userId)) return cache.get(userId);',
          '',
          '  const user = database.find(userId);',
          '  cache.set(userId, user);',
          '  return user;',
          '}',
        ],
        annotations: [],
      },
      {
        id: 1,
        description: 'Lines 2-3 handle edge cases. Skip these on first read.',
        code: [
          'function getUserData(userId) {',
          '  if (!userId) return null;',
          '  if (cache.has(userId)) return cache.get(userId);',
          '',
          '  const user = database.find(userId);',
          '  cache.set(userId, user);',
          '  return user;',
          '}',
        ],
        annotations: [
          { lineIndex: 1, type: 'edgeCase', text: 'EDGE CASE: no userId provided' },
          { lineIndex: 2, type: 'edgeCase', text: 'EDGE CASE: already cached' },
        ],
      },
      {
        id: 2,
        description: 'Lines 5-7 are the HAPPY PATH: find user, cache it, return it. This is the main logic.',
        code: [
          'function getUserData(userId) {',
          '  if (!userId) return null;',
          '  if (cache.has(userId)) return cache.get(userId);',
          '',
          '  const user = database.find(userId);',
          '  cache.set(userId, user);',
          '  return user;',
          '}',
        ],
        annotations: [
          { lineIndex: 1, type: 'edgeCase', text: 'EDGE CASE: no userId provided' },
          { lineIndex: 2, type: 'edgeCase', text: 'EDGE CASE: already cached' },
          { lineIndex: 4, type: 'happyPath', text: 'HAPPY PATH: fetch from database' },
          { lineIndex: 5, type: 'happyPath', text: 'HAPPY PATH: store in cache' },
          { lineIndex: 6, type: 'happyPath', text: 'HAPPY PATH: return user' },
        ],
        focusLines: [4, 5, 6],
      },
    ],
    insight: 'Understand what happens when everything works BEFORE worrying about what can go wrong.',
  },
  {
    id: 'read-names',
    title: 'Step 3: Read Names Carefully',
    steps: [
      {
        id: 0,
        description: 'Good developers choose names carefully. Read them as documentation.',
        code: [
          'const isValidEmail = email.includes("@");',
          'const hasPermission = user.role === "admin";',
          'const shouldRetry = attempts < maxAttempts;',
          '',
          'function sendWelcomeEmail(newUser) { ... }',
          'function calculateShippingCost(order) { ... }',
        ],
        annotations: [],
      },
      {
        id: 1,
        description: 'Boolean names tell you what they mean: isX, hasX, shouldX, canX',
        code: [
          'const isValidEmail = email.includes("@");',
          'const hasPermission = user.role === "admin";',
          'const shouldRetry = attempts < maxAttempts;',
          '',
          'function sendWelcomeEmail(newUser) { ... }',
          'function calculateShippingCost(order) { ... }',
        ],
        annotations: [
          { lineIndex: 0, type: 'comment', text: '"is" prefix → boolean about validity' },
          { lineIndex: 1, type: 'comment', text: '"has" prefix → boolean about possession' },
          { lineIndex: 2, type: 'comment', text: '"should" prefix → boolean about action' },
        ],
      },
      {
        id: 2,
        description: 'Function names are verb phrases that describe the action.',
        code: [
          'const isValidEmail = email.includes("@");',
          'const hasPermission = user.role === "admin";',
          'const shouldRetry = attempts < maxAttempts;',
          '',
          'function sendWelcomeEmail(newUser) { ... }',
          'function calculateShippingCost(order) { ... }',
        ],
        annotations: [
          { lineIndex: 0, type: 'comment', text: '"is" prefix → boolean about validity' },
          { lineIndex: 1, type: 'comment', text: '"has" prefix → boolean about possession' },
          { lineIndex: 2, type: 'comment', text: '"should" prefix → boolean about action' },
          { lineIndex: 4, type: 'comment', text: 'verb "send" + what "WelcomeEmail"' },
          { lineIndex: 5, type: 'comment', text: 'verb "calculate" + what "ShippingCost"' },
        ],
        focusLines: [4, 5],
      },
    ],
    insight: 'Names are chosen deliberately. Trust them as the author\'s explanation.',
  },
]

export function ReadingCodeViz() {
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

      {/* Code Panel */}
      <div className="p-[var(--spacing-lg)] bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl">
        <div className="font-mono text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${exampleIndex}-${stepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {currentStep.code.map((line, i) => {
                const annotation = currentStep.annotations.find(a => a.lineIndex === i)
                const isFocused = currentStep.focusLines?.includes(i)
                const colors = annotation ? annotationColors[annotation.type] : null

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-[var(--spacing-sm)] px-3 py-1.5 rounded-lg transition-all ${
                      isFocused ? 'bg-[var(--color-brand-primary-20)]' : ''
                    }`}
                  >
                    <span className="w-6 text-[var(--color-gray-700)] text-right select-none font-mono">
                      {i + 1}
                    </span>
                    <span className={`flex-1 ${
                      isFocused ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-gray-300)]'
                    }`}>
                      {line || ' '}
                    </span>
                    {annotation && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs px-2 py-1 rounded-md border whitespace-nowrap"
                        style={{
                          backgroundColor: colors?.bg,
                          borderColor: colors?.border,
                          color: colors?.color,
                        }}
                      >
                        {annotation.text}
                      </motion.span>
                    )}
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-accent-purple-15)] border border-[var(--color-accent-purple-25)] rounded-lg text-sm text-[var(--color-purple-300)] text-center">
        <span className="font-semibold text-[var(--color-purple-400)] mr-[var(--spacing-sm)]">💡 Key Insight:</span>
        {currentExample.insight}
      </div>

      {/* Legend */}
      <div className="flex gap-[var(--spacing-md)] justify-center flex-wrap p-[var(--spacing-sm)] bg-[var(--color-black-20)] rounded-lg">
        {Object.entries(annotationColors).map(([type, colors]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              color: colors.color,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: colors.color }} />
            {colors.label}
          </div>
        ))}
      </div>
    </div>
  )
}
