'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StackItem {
  id: number
  value: string
  label?: string
}

interface Step {
  id: number
  action: 'push' | 'pop' | 'peek' | 'compare' | 'match' | 'error'
  description: string
  stackState: StackItem[]
  input?: string
  inputIndex?: number
  output?: string
  highlight?: number
}

interface Example {
  id: string
  title: string
  input: string
  steps: Step[]
  insight: string
}

const examples: Example[] = [
  {
    id: 'basic-ops',
    title: 'Push & Pop',
    input: '',
    steps: [
      { id: 0, action: 'push', description: 'push(1) — Add 1 to the top of the stack', stackState: [{ id: 1, value: '1' }] },
      { id: 1, action: 'push', description: 'push(2) — Add 2 on top of 1', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }] },
      { id: 2, action: 'push', description: 'push(3) — Add 3 on top. Stack grows upward.', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }] },
      { id: 3, action: 'peek', description: 'peek() — Look at top element (3) without removing it', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }], output: '3' },
      { id: 4, action: 'pop', description: 'pop() — Remove and return top element (3). LIFO!', stackState: [{ id: 1, value: '1' }, { id: 2, value: '2' }], output: '3' },
      { id: 5, action: 'pop', description: 'pop() — Remove 2. Note: We can\'t access 1 without removing 2 first.', stackState: [{ id: 1, value: '1' }], output: '2' },
      { id: 6, action: 'pop', description: 'pop() — Remove last element. Stack is now empty.', stackState: [], output: '1' },
    ],
    insight: 'LIFO (Last-In-First-Out): The last element pushed is the first one popped. Like a stack of plates!'
  },
  {
    id: 'valid-parens',
    title: 'Valid Parentheses',
    input: '([{}])',
    steps: [
      { id: 0, action: 'push', description: '"(" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }], inputIndex: 0 },
      { id: 1, action: 'push', description: '"[" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 1 },
      { id: 2, action: 'push', description: '"{" — Opening bracket, push to stack', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }, { id: 3, value: '{' }], inputIndex: 2 },
      { id: 3, action: 'compare', description: '"}" — Closing bracket, check if matches top of stack...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }, { id: 3, value: '{' }], inputIndex: 3 },
      { id: 4, action: 'match', description: '"{" matches "}"! Pop the stack.', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 3 },
      { id: 5, action: 'compare', description: '"]" — Check if matches top...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 4 },
      { id: 6, action: 'match', description: '"[" matches "]"! Pop the stack.', stackState: [{ id: 1, value: '(' }], inputIndex: 4 },
      { id: 7, action: 'compare', description: '")" — Check if matches top...', stackState: [{ id: 1, value: '(' }], inputIndex: 5 },
      { id: 8, action: 'match', description: '"(" matches ")"! Stack is empty = Valid!', stackState: [], inputIndex: 5, output: 'true' },
    ],
    insight: 'Stack is perfect for matching pairs because the most recent opening bracket must match the next closing bracket.'
  },
  {
    id: 'invalid-parens',
    title: 'Invalid Case',
    input: '([)]',
    steps: [
      { id: 0, action: 'push', description: '"(" — Push opening bracket', stackState: [{ id: 1, value: '(' }], inputIndex: 0 },
      { id: 1, action: 'push', description: '"[" — Push opening bracket', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 1 },
      { id: 2, action: 'compare', description: '")" — Check if matches top "[" ...', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 2 },
      { id: 3, action: 'error', description: '"[" does NOT match ")"! Invalid brackets.', stackState: [{ id: 1, value: '(' }, { id: 2, value: '[' }], inputIndex: 2, output: 'false' },
    ],
    insight: 'When a closing bracket doesn\'t match the top of the stack, the string is invalid — we found a mismatch!'
  },
]

export function StackViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

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
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => setStepIndex(0)

  const getActionColor = (action: string) => {
    switch (action) {
      case 'push': return 'var(--color-action-insert)'
      case 'pop': return 'var(--color-action-search)'
      case 'peek': return 'var(--color-action-access)'
      case 'compare': return 'var(--color-action-compare)'
      case 'match': return 'var(--color-action-success)'
      case 'error': return 'var(--color-action-error)'
      default: return 'var(--color-gray-600)'
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Example selector */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white ${exampleIndex === i ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-light' : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Input display (for parentheses examples) */}
      {currentExample.input && (
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Input String</div>
          <div className="flex gap-2 justify-center">
            {currentExample.input.split('').map((char, i) => (
              <motion.span
                key={i}
                className={`font-mono text-2xl font-semibold w-12 h-12 flex items-center justify-center bg-black/30 rounded-md transition-all duration-200 ${currentStep.inputIndex === i ? 'bg-brand-primary/20 shadow-[0_0_15px_rgba(var(--color-brand-primary-rgb),0.4)]' : ''} ${currentStep.inputIndex !== undefined && i < currentStep.inputIndex ? 'opacity-40' : ''}`}
                animate={{
                  scale: currentStep.inputIndex === i ? 1.2 : 1,
                  color: currentStep.inputIndex === i
                    ? getActionColor(currentStep.action)
                    : currentStep.inputIndex !== undefined && i < currentStep.inputIndex
                      ? '#555'
                      : '#ccc'
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Stack visualization */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Stack</div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-800 py-1">← Top</div>
            <div className="flex flex-col gap-1.5 min-h-[180px] p-3 bg-black/30 border-2 border-white/10 rounded-lg">
              <AnimatePresence mode="popLayout">
                {currentStep.stackState.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="text-gray-600 text-base text-center p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Empty
                  </motion.div>
                ) : (
                  [...currentStep.stackState].reverse().map((item, i) => (
                    <motion.div
                      key={item.id}
                      className={`flex items-center justify-center gap-2 px-4 py-3 bg-black/30 border-2 border-white/10 rounded-md transition-all duration-200 ${i === 0 ? 'shadow-[0_0_15px_rgba(var(--color-brand-primary-rgb),0.2)]' : ''}`}
                      initial={{ opacity: 0, x: -30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.8 }}
                      layout
                      style={{
                        borderColor: i === 0 ? getActionColor(currentStep.action) : 'rgba(255,255,255,0.1)',
                        background: i === 0 ? `${getActionColor(currentStep.action)}15` : 'rgba(0,0,0,0.3)'
                      }}
                    >
                      <span className="font-mono text-xl font-semibold text-white">{item.value}</span>
                      {item.label && <span className="text-xs text-gray-500">{item.label}</span>}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            <div className="text-xs text-gray-800 py-1">← Bottom</div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-black/30 rounded-lg p-4 min-w-[100px]">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Output</div>
          <div className="flex items-center justify-center min-h-[50px]">
            {currentStep.output ? (
              <motion.span
                key={`${stepIndex}-${currentStep.output}`}
                initial={{ scale: 1.2, color: 'var(--color-action-search)' }}
                animate={{ scale: 1, color: currentStep.action === 'error' ? 'var(--color-action-error)' : 'var(--color-action-success)' }}
                className="font-mono text-2xl font-bold"
              >
                {currentStep.output}
              </motion.span>
            ) : (
              <span className="text-gray-600 text-xl">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          className="flex items-start gap-3 p-3 px-4 bg-black/30 rounded-lg border-l-[3px] border-brand-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{ borderLeftColor: getActionColor(currentStep.action) }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded text-white"
            style={{ background: getActionColor(currentStep.action) }}
          >
            {currentStep.action}
          </span>
          <span className="text-base text-gray-300 leading-normal">{currentStep.description}</span>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button 
          className="px-3 py-2 text-base bg-white/5 border border-white/10 rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" 
          onClick={handlePrev} 
          disabled={stepIndex === 0}
        >
          ← Prev
        </button>
        <span className="text-base text-gray-600 min-w-[50px] text-center">
          {stepIndex + 1} / {currentExample.steps.length}
        </span>
        <motion.button
          className="px-6 py-2.5 text-base font-medium bg-gradient-to-r from-brand-primary to-brand-secondary border-0 rounded-md text-white cursor-pointer transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button 
          className="px-3 py-2 text-base bg-white/5 border border-white/10 rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white" 
          onClick={handleReset}
        >
          ↻
        </button>
      </div>

      {/* Insight */}
      <div className="p-3 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-base text-gray-300 leading-normal">
        <strong className="text-brand-light">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
