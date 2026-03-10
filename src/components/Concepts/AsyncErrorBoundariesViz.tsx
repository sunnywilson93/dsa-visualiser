'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface ErrorFlowNode {
  id: string
  label: string
  state: 'idle' | 'executing' | 'error' | 'caught' | 'propagating' | 'fallback'
  errorMsg?: string
}

interface Step {
  description: string
  codeLine: number
  nodes: ErrorFlowNode[]
  output: string[]
  phase: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

const examples: Example[] = [
  {
    id: 'error-propagation',
    title: 'Error Propagation',
    code: [
      'async function getUser(id) {',
      '  const res = await fetch("/api/users/" + id)',
      '  if (!res.ok) throw new Error("Not found")',
      '  return res.json()',
      '}',
      '',
      'async function getUserPosts(id) {',
      '  const user = await getUser(id)  // throws!',
      '  return fetch("/api/posts/" + user.id)',
      '}',
      '',
      'try {',
      '  const posts = await getUserPosts(999)',
      '} catch (error) {',
      '  console.error(error.message)',
      '}',
    ],
    steps: [
      {
        description: 'getUserPosts(999) is called. It calls getUser(999) internally.',
        codeLine: 12,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'executing' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'executing' },
          { id: 'getUser', label: 'getUser()', state: 'idle' },
        ],
        output: [],
        phase: 'Calling',
      },
      {
        description: 'getUser(999) fetches the API. Server responds with 404.',
        codeLine: 1,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'executing' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'executing' },
          { id: 'getUser', label: 'getUser()', state: 'executing' },
        ],
        output: [],
        phase: 'Fetching',
      },
      {
        description: 'res.ok is false! getUser() throws new Error("Not found"). Error originates here.',
        codeLine: 2,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'executing' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'executing' },
          { id: 'getUser', label: 'getUser()', state: 'error', errorMsg: 'Error: Not found' },
        ],
        output: [],
        phase: 'Error Thrown',
      },
      {
        description: 'getUser() has no try/catch, so the error PROPAGATES UP to getUserPosts().',
        codeLine: 7,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'executing' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'propagating', errorMsg: 'Error bubbles up' },
          { id: 'getUser', label: 'getUser()', state: 'error', errorMsg: 'Error: Not found' },
        ],
        output: [],
        phase: 'Propagating',
      },
      {
        description: 'getUserPosts() also has no try/catch. Error continues propagating to the caller.',
        codeLine: 12,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'propagating', errorMsg: 'Error arrives' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'propagating', errorMsg: 'No catch here' },
          { id: 'getUser', label: 'getUser()', state: 'error', errorMsg: 'Error: Not found' },
        ],
        output: [],
        phase: 'Propagating',
      },
      {
        description: 'The try/catch block CATCHES the error! It originated 2 levels deep but is handled here.',
        codeLine: 14,
        nodes: [
          { id: 'caller', label: 'try/catch block', state: 'caught', errorMsg: 'Caught!' },
          { id: 'getUserPosts', label: 'getUserPosts()', state: 'error' },
          { id: 'getUser', label: 'getUser()', state: 'error' },
        ],
        output: ['Error: Not found'],
        phase: 'Caught',
      },
    ],
    insight: 'Async errors propagate up through the call chain until a try/catch handles them — just like synchronous exceptions. If nothing catches them, they become unhandled rejections.',
  },
  {
    id: 'graceful-degradation',
    title: 'Graceful Degradation',
    code: [
      'async function loadDashboard(userId) {',
      '  // Critical — must succeed',
      '  const user = await fetchUser(userId)',
      '',
      '  // Non-critical — use fallbacks',
      '  const [avatar, prefs] = await Promise.allSettled([',
      '    fetchAvatar(userId)',
      '      .catch(() => "/default-avatar.png"),',
      '    fetchPreferences(userId)',
      '      .catch(() => ({ theme: "dark" })),',
      '  ])',
      '',
      '  return {',
      '    ...user,',
      '    avatar: avatar.value,',
      '    prefs: prefs.value,',
      '  }',
      '}',
    ],
    steps: [
      {
        description: 'loadDashboard() starts. First, fetch the critical user data.',
        codeLine: 2,
        nodes: [
          { id: 'user', label: 'fetchUser()', state: 'executing' },
          { id: 'avatar', label: 'fetchAvatar()', state: 'idle' },
          { id: 'prefs', label: 'fetchPreferences()', state: 'idle' },
        ],
        output: [],
        phase: 'Critical Fetch',
      },
      {
        description: 'User data loaded successfully. Now fetch non-critical data in parallel.',
        codeLine: 5,
        nodes: [
          { id: 'user', label: 'fetchUser()', state: 'caught', errorMsg: 'Success ✓' },
          { id: 'avatar', label: 'fetchAvatar()', state: 'executing' },
          { id: 'prefs', label: 'fetchPreferences()', state: 'executing' },
        ],
        output: ['User data loaded'],
        phase: 'Non-Critical Fetch',
      },
      {
        description: 'fetchAvatar() FAILS! But .catch() provides a fallback default avatar path.',
        codeLine: 7,
        nodes: [
          { id: 'user', label: 'fetchUser()', state: 'caught', errorMsg: 'Success ✓' },
          { id: 'avatar', label: 'fetchAvatar()', state: 'fallback', errorMsg: 'Using default' },
          { id: 'prefs', label: 'fetchPreferences()', state: 'executing' },
        ],
        output: ['User data loaded', 'Avatar failed → using default'],
        phase: 'Fallback',
      },
      {
        description: 'fetchPreferences() succeeds. Promise.allSettled() resolves with all results.',
        codeLine: 8,
        nodes: [
          { id: 'user', label: 'fetchUser()', state: 'caught', errorMsg: 'Success ✓' },
          { id: 'avatar', label: 'fetchAvatar()', state: 'fallback', errorMsg: 'Default avatar' },
          { id: 'prefs', label: 'fetchPreferences()', state: 'caught', errorMsg: 'Success ✓' },
        ],
        output: ['User data loaded', 'Avatar failed → using default', 'Preferences loaded'],
        phase: 'Resolved',
      },
      {
        description: 'Dashboard assembled! User sees their profile with a default avatar. App did not crash.',
        codeLine: 12,
        nodes: [
          { id: 'user', label: 'fetchUser()', state: 'caught', errorMsg: '✓' },
          { id: 'avatar', label: 'fetchAvatar()', state: 'fallback', errorMsg: 'Default ✓' },
          { id: 'prefs', label: 'fetchPreferences()', state: 'caught', errorMsg: '✓' },
        ],
        output: [
          'User data loaded',
          'Avatar failed → using default',
          'Preferences loaded',
          'Dashboard rendered successfully!',
        ],
        phase: 'Complete',
      },
    ],
    insight: 'Separate critical operations (user data) from non-critical ones (avatar, preferences). Non-critical failures use fallbacks so the app stays functional.',
  },
  {
    id: 'unhandled-rejections',
    title: 'Unhandled Rejections',
    code: [
      'async function riskyOperation() {',
      '  throw new Error("Something broke!")',
      '}',
      '',
      '// WRONG: no await, no .catch()',
      'riskyOperation()',
      '',
      '// The error is LOST — no one handles it!',
      '',
      '// Global safety net:',
      'window.addEventListener(',
      '  "unhandledrejection",',
      '  (event) => {',
      '    console.error("Caught:", event.reason)',
      '    reportToErrorService(event.reason)',
      '  }',
      ')',
    ],
    steps: [
      {
        description: 'riskyOperation() is defined as an async function that always throws.',
        codeLine: 0,
        nodes: [
          { id: 'fn', label: 'riskyOperation()', state: 'idle' },
          { id: 'caller', label: 'Script (no await)', state: 'idle' },
          { id: 'global', label: 'Global Handler', state: 'idle' },
        ],
        output: [],
        phase: 'Setup',
      },
      {
        description: 'riskyOperation() is called WITHOUT await or .catch(). It runs fire-and-forget.',
        codeLine: 5,
        nodes: [
          { id: 'fn', label: 'riskyOperation()', state: 'executing' },
          { id: 'caller', label: 'Script (no await)', state: 'executing' },
          { id: 'global', label: 'Global Handler', state: 'idle' },
        ],
        output: [],
        phase: 'Called',
      },
      {
        description: 'riskyOperation() throws! But nobody is awaiting or catching the returned Promise.',
        codeLine: 1,
        nodes: [
          { id: 'fn', label: 'riskyOperation()', state: 'error', errorMsg: 'Error: Something broke!' },
          { id: 'caller', label: 'Script (no await)', state: 'executing' },
          { id: 'global', label: 'Global Handler', state: 'idle' },
        ],
        output: [],
        phase: 'Error Thrown',
      },
      {
        description: 'The rejected Promise has no handler. It becomes an UNHANDLED REJECTION.',
        codeLine: 7,
        nodes: [
          { id: 'fn', label: 'riskyOperation()', state: 'error', errorMsg: 'Unhandled!' },
          { id: 'caller', label: 'Script (no await)', state: 'propagating', errorMsg: 'No catch!' },
          { id: 'global', label: 'Global Handler', state: 'idle' },
        ],
        output: ['⚠ UnhandledPromiseRejection: Something broke!'],
        phase: 'Unhandled',
      },
      {
        description: 'The global unhandledrejection handler catches it as a safety net. Error is logged and reported.',
        codeLine: 13,
        nodes: [
          { id: 'fn', label: 'riskyOperation()', state: 'error', errorMsg: 'Something broke!' },
          { id: 'caller', label: 'Script (no await)', state: 'error', errorMsg: 'Missed error' },
          { id: 'global', label: 'Global Handler', state: 'caught', errorMsg: 'Caught!' },
        ],
        output: [
          '⚠ UnhandledPromiseRejection: Something broke!',
          'Global handler caught: "Something broke!"',
          'Error reported to monitoring service',
        ],
        phase: 'Safety Net',
      },
    ],
    insight: 'Calling an async function without await or .catch() silently swallows errors. The global unhandledrejection handler is a safety net, not a substitute for proper error handling.',
  },
]

const getNodeColor = (state: ErrorFlowNode['state']): string => {
  switch (state) {
    case 'idle': return 'var(--color-gray-600)'
    case 'executing': return 'var(--color-blue-400)'
    case 'error': return 'var(--color-red-500)'
    case 'caught': return 'var(--color-emerald-500)'
    case 'propagating': return 'var(--color-amber-500)'
    case 'fallback': return 'var(--color-violet-300-40)'
  }
}

const getPhaseColor = (phase: string): string => {
  if (phase.includes('Complete') || phase.includes('Caught') || phase.includes('Resolved') || phase.includes('Safety')) return 'var(--color-emerald-500)'
  if (phase.includes('Error') || phase.includes('Unhandled')) return 'var(--color-red-500)'
  if (phase.includes('Propagating') || phase.includes('Fallback')) return 'var(--color-amber-500)'
  return 'var(--color-blue-400)'
}

export function AsyncErrorBoundariesViz(): JSX.Element {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExample = examples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const line = currentStep.codeLine
    if (line >= 0 && lineRefs.current[line]) {
      lineRefs.current[line]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  const handleExampleChange = (index: number): void => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = (): void => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = (): void => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = (): void => setStepIndex(0)

  return (
    <div className={styles.container}>
      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {examples.map((ex, i) => (
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
              className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Error flow visualization */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <div className="mb-3 text-center text-sm font-semibold text-red-400">
          Error Flow
        </div>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {currentStep.nodes.map((node, i) => (
              <motion.div
                key={node.id}
                className="flex items-center justify-between rounded-lg border-2 px-4 py-3"
                style={{
                  borderColor: getNodeColor(node.state),
                  background: `color-mix(in srgb, ${getNodeColor(node.state)} 10%, transparent)`,
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                layout
              >
                <span className="font-mono text-sm font-bold text-white">
                  {node.label}
                </span>
                <div className="flex items-center gap-3">
                  {node.errorMsg && (
                    <motion.span
                      className="rounded-md px-2 py-0.5 font-mono text-xs"
                      style={{
                        color: getNodeColor(node.state),
                        background: `color-mix(in srgb, ${getNodeColor(node.state)} 20%, transparent)`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {node.errorMsg}
                    </motion.span>
                  )}
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase"
                    style={{
                      color: getNodeColor(node.state),
                      background: `color-mix(in srgb, ${getNodeColor(node.state)} 25%, transparent)`,
                    }}
                  >
                    {node.state}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Propagation arrow between error nodes */}
          {currentStep.nodes.some(n => n.state === 'propagating') && (
            <motion.div
              className="py-1 text-center text-xs font-semibold text-amber-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Error propagating upward through the call chain
            </motion.div>
          )}
        </div>
      </div>

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Console Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>-</span>
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
          key={`${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
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
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
