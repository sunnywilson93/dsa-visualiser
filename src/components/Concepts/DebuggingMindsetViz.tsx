'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepProgress, StepControls } from '@/components/SharedViz'

interface DebugStep {
  id: number
  phase: 'observe' | 'hypothesis' | 'test' | 'learn'
  description: string
  code?: string[]
  errorMessage?: string
  consoleOutput?: string[]
  hypothesis?: string
  learning?: string
}

interface Example {
  id: string
  title: string
  bugDescription: string
  steps: DebugStep[]
  insight: string
}

const phaseInfo: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  observe: {
    label: 'Observe',
    color: 'var(--color-blue-400)',
    bg: 'var(--color-blue-10)',
    border: 'var(--color-blue-30)',
    icon: '👀',
  },
  hypothesis: {
    label: 'Hypothesis',
    color: 'var(--color-amber-500)',
    bg: 'var(--color-amber-10)',
    border: 'var(--color-amber-30)',
    icon: '🤔',
  },
  test: {
    label: 'Test',
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-10)',
    border: 'var(--color-emerald-30)',
    icon: '🧪',
  },
  learn: {
    label: 'Learn',
    color: 'var(--color-purple-400)',
    bg: 'var(--color-accent-purple-15)',
    border: 'var(--color-accent-purple-25)',
    icon: '💡',
  },
}

const examples: Example[] = [
  {
    id: 'read-error',
    title: 'Reading Error Messages',
    bugDescription: 'Code crashes with a confusing error',
    steps: [
      {
        id: 0,
        phase: 'observe',
        description: 'First, READ the error message carefully. It tells you WHAT, WHERE, and hints at WHY.',
        errorMessage: `TypeError: Cannot read property 'name' of undefined
    at getUsername (app.js:15:20)
    at processUser (app.js:42:10)`,
      },
      {
        id: 1,
        phase: 'observe',
        description: 'WHAT: Tried to access .name on undefined. WHERE: Line 15 of app.js, in getUsername.',
        errorMessage: `TypeError: Cannot read property 'name' of undefined
    at getUsername (app.js:15:20)  ← LINE 15
    at processUser (app.js:42:10)`,
      },
      {
        id: 2,
        phase: 'hypothesis',
        description: 'Form a hypothesis: "Something that should be an object is actually undefined."',
        hypothesis: 'The user object passed to getUsername is undefined',
        code: [
          'function getUsername(user) {',
          '  return user.name;  // <- crash here',
          '}',
        ],
      },
      {
        id: 3,
        phase: 'test',
        description: 'Test with console.log BEFORE the crash to see what user actually is.',
        code: [
          'function getUsername(user) {',
          '  console.log("user is:", user);  // ADD THIS',
          '  return user.name;',
          '}',
        ],
        consoleOutput: ['user is: undefined'],
      },
      {
        id: 4,
        phase: 'learn',
        description: 'Confirmed! user is undefined. Now trace back: WHO calls getUsername with bad data?',
        learning: 'The caller (processUser at line 42) is passing undefined. Check that function next.',
      },
    ],
    insight: 'Error messages are clues, not insults. WHAT failed, WHERE it failed, and the stack trace shows HOW you got there.',
  },
  {
    id: 'wrong-value',
    title: 'The Debugging Cycle',
    bugDescription: 'Function returns wrong value',
    steps: [
      {
        id: 0,
        phase: 'observe',
        description: 'The add function returns wrong values. Let\'s debug systematically.',
        code: [
          'function add(a, b) {',
          '  return a - b;  // Bug is here!',
          '}',
          '',
          'console.log(add(5, 3));  // Expected 8, got 2',
        ],
        consoleOutput: ['2'],
      },
      {
        id: 1,
        phase: 'hypothesis',
        description: 'Hypothesis 1: "Maybe the inputs are wrong"',
        hypothesis: 'The arguments a and b might not be what we expect',
      },
      {
        id: 2,
        phase: 'test',
        description: 'Test by logging the inputs:',
        code: [
          'function add(a, b) {',
          '  console.log("a:", a, "b:", b);  // Test inputs',
          '  return a - b;',
          '}',
          '',
          'console.log(add(5, 3));',
        ],
        consoleOutput: ['a: 5 b: 3', '2'],
      },
      {
        id: 3,
        phase: 'learn',
        description: 'Inputs are correct (5 and 3). Hypothesis rejected. New hypothesis needed.',
        learning: 'Inputs are fine. The bug must be in the calculation itself.',
      },
      {
        id: 4,
        phase: 'hypothesis',
        description: 'Hypothesis 2: "The operation is wrong"',
        hypothesis: 'Check the operator: is it + or something else?',
      },
      {
        id: 5,
        phase: 'test',
        description: 'Look at line 2... Found it! Using - instead of +',
        code: [
          'function add(a, b) {',
          '  return a - b;  // WRONG: using minus!',
          '}',
        ],
      },
      {
        id: 6,
        phase: 'learn',
        description: 'Bug found! Simple typo: - instead of +. Fix and verify.',
        learning: 'Change a - b to a + b. The cycle works!',
        code: [
          'function add(a, b) {',
          '  return a + b;  // FIXED',
          '}',
          '',
          'console.log(add(5, 3));  // Now outputs 8 ✓',
        ],
        consoleOutput: ['8'],
      },
    ],
    insight: 'Each hypothesis either finds the bug or eliminates a possibility. Systematic beats random.',
  },
  {
    id: 'rubber-duck',
    title: 'Rubber Duck Debugging',
    bugDescription: 'Code seems right but doesn\'t work',
    steps: [
      {
        id: 0,
        phase: 'observe',
        description: 'You\'ve stared at this code for 20 minutes. It looks right but crashes.',
        code: [
          'function processUsers(users) {',
          '  for (const user of users) {',
          '    sendEmail(user.email);',
          '  }',
          '}',
        ],
        errorMessage: 'TypeError: Cannot read property "email" of undefined',
      },
      {
        id: 1,
        phase: 'hypothesis',
        description: 'Time for rubber duck debugging: explain the code OUT LOUD to anyone (or anything).',
        hypothesis: 'Explaining forces you to think through each step carefully',
      },
      {
        id: 2,
        phase: 'test',
        description: '"This function takes a users array... loops through each user... gets their email..."',
        code: [
          '// "I loop through users..."',
          'for (const user of users) {',
          '  // "...and access user.email"',
          '  sendEmail(user.email);',
          '}',
        ],
      },
      {
        id: 3,
        phase: 'learn',
        description: '"Wait - what if some users are undefined? I never checked!"',
        learning: 'The array might contain undefined values. I assumed all entries are valid users.',
        code: [
          '// users might be: [user1, undefined, user2]',
          'const users = [',
          '  { email: "a@b.com" },',
          '  undefined,  // ← This causes the crash!',
          '  { email: "c@d.com" }',
          '];',
        ],
      },
      {
        id: 4,
        phase: 'learn',
        description: 'Fix: Filter out bad values or check before accessing.',
        code: [
          'function processUsers(users) {',
          '  for (const user of users) {',
          '    if (user && user.email) {  // Guard clause',
          '      sendEmail(user.email);',
          '    }',
          '  }',
          '}',
        ],
        learning: 'The act of explaining revealed an assumption I hadn\'t questioned.',
      },
    ],
    insight: 'Explaining code forces you to articulate assumptions. Hidden bugs live in unquestioned assumptions.',
  },
]

export function DebuggingMindsetViz() {
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

      {/* Bug Description Banner */}
      <div className="flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-red-10)] border border-[var(--color-red-30)] rounded-lg">
        <span className="text-lg">🐛</span>
        <span className="text-[var(--color-red-400)] text-sm font-medium">{currentExample.bugDescription}</span>
      </div>

      {/* Phase Indicator */}
      <div className="flex gap-[var(--spacing-sm)] justify-center flex-wrap">
        {Object.entries(phaseInfo).map(([key, info]) => {
          const isActive = currentStep.phase === key

          return (
            <motion.div
              key={key}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border-2 transition-all"
              style={{
                backgroundColor: isActive ? info.bg : 'var(--color-white-4)',
                borderColor: isActive ? info.color : 'transparent',
                color: isActive ? info.color : 'var(--color-gray-600)',
                opacity: isActive ? 1 : 0.5,
              }}
              animate={{ scale: isActive ? 1.05 : 1 }}
            >
              <span>{info.icon}</span>
              <span className="font-medium">{info.label}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${exampleIndex}-${stepIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-[var(--spacing-lg)] bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl space-y-[var(--spacing-md)]"
        >
          {/* Error Message */}
          {currentStep.errorMessage && (
            <div className="p-3 bg-[var(--color-red-10)] border border-[var(--color-red-30)] rounded-lg font-mono text-xs text-[var(--color-red-400)] whitespace-pre-wrap">
              {currentStep.errorMessage}
            </div>
          )}

          {/* Hypothesis */}
          {currentStep.hypothesis && (
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: phaseInfo.hypothesis.bg,
                borderColor: phaseInfo.hypothesis.border,
              }}
            >
              <div
                className="text-xs font-semibold mb-1"
                style={{ color: phaseInfo.hypothesis.color }}
              >
                HYPOTHESIS:
              </div>
              <div className="text-[var(--color-amber-300)]">{currentStep.hypothesis}</div>
            </div>
          )}

          {/* Code Block */}
          {currentStep.code && (
            <div className="p-3 bg-[var(--color-black-20)] rounded-lg font-mono text-sm">
              {currentStep.code.map((line, i) => (
                <div key={i} className="text-[var(--color-gray-300)]">{line || ' '}</div>
              ))}
            </div>
          )}

          {/* Console Output */}
          {currentStep.consoleOutput && (
            <div className="p-3 bg-[var(--color-black-60)] rounded-lg font-mono text-sm">
              <div className="text-xs text-[var(--color-gray-600)] mb-1">Console:</div>
              {currentStep.consoleOutput.map((line, i) => (
                <div key={i} className="text-[var(--color-emerald-500)]">{'>'} {line}</div>
              ))}
            </div>
          )}

          {/* Learning */}
          {currentStep.learning && (
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: phaseInfo.learn.bg,
                borderColor: phaseInfo.learn.border,
              }}
            >
              <div
                className="text-xs font-semibold mb-1"
                style={{ color: phaseInfo.learn.color }}
              >
                LEARNING:
              </div>
              <div className="text-[var(--color-purple-300)]">{currentStep.learning}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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

      {/* Legend - Debugging Cycle */}
      <div className="flex gap-[var(--spacing-md)] justify-center flex-wrap p-[var(--spacing-sm)] bg-[var(--color-black-20)] rounded-lg">
        <span className="text-xs text-[var(--color-gray-500)]">The Debugging Cycle:</span>
        {Object.entries(phaseInfo).map(([key, info], i) => (
          <div key={key} className="flex items-center gap-1 text-xs">
            <span style={{ color: info.color }}>{info.icon}</span>
            <span style={{ color: info.color }}>{info.label}</span>
            {i < Object.keys(phaseInfo).length - 1 && (
              <span className="text-[var(--color-gray-600)] ml-1">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
