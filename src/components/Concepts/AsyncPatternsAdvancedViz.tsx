'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface TimelineEntry {
  label: string
  state: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed'
  detail?: string
}

interface Step {
  description: string
  codeLine: number
  timeline: TimelineEntry[]
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
    id: 'race-condition',
    title: 'Race Condition',
    code: [
      'let currentId = 0',
      '',
      'async function search(query) {',
      '  const id = ++currentId',
      '  const res = await fetch("/api?q=" + query)',
      '  const data = await res.json()',
      '  if (id === currentId) {',
      '    updateUI(data)  // Only latest!',
      '  }',
      '}',
      '',
      'search("a")    // id: 1',
      'search("ab")   // id: 2',
      'search("abc")  // id: 3',
    ],
    steps: [
      {
        description: 'User starts typing. search("a") fires — currentId becomes 1.',
        codeLine: 3,
        timeline: [
          { label: 'search("a")', state: 'active', detail: 'id: 1' },
        ],
        output: [],
        phase: 'Request #1',
      },
      {
        description: 'User types another letter. search("ab") fires — currentId becomes 2. Request #1 is still in-flight.',
        codeLine: 3,
        timeline: [
          { label: 'search("a")', state: 'pending', detail: 'id: 1' },
          { label: 'search("ab")', state: 'active', detail: 'id: 2' },
        ],
        output: [],
        phase: 'Request #2',
      },
      {
        description: 'User types again. search("abc") fires — currentId becomes 3. Two requests still in-flight.',
        codeLine: 3,
        timeline: [
          { label: 'search("a")', state: 'pending', detail: 'id: 1' },
          { label: 'search("ab")', state: 'pending', detail: 'id: 2' },
          { label: 'search("abc")', state: 'active', detail: 'id: 3' },
        ],
        output: [],
        phase: 'Request #3',
      },
      {
        description: 'search("a") response arrives first (server was fast). But id(1) !== currentId(3) — DISCARDED!',
        codeLine: 6,
        timeline: [
          { label: 'search("a")', state: 'cancelled', detail: 'Stale: 1 !== 3' },
          { label: 'search("ab")', state: 'pending', detail: 'id: 2' },
          { label: 'search("abc")', state: 'pending', detail: 'id: 3' },
        ],
        output: ['search("a") response discarded (stale)'],
        phase: 'Stale Check',
      },
      {
        description: 'search("abc") response arrives. id(3) === currentId(3) — UI UPDATES with correct results!',
        codeLine: 7,
        timeline: [
          { label: 'search("a")', state: 'cancelled', detail: 'Discarded' },
          { label: 'search("ab")', state: 'pending', detail: 'id: 2' },
          { label: 'search("abc")', state: 'completed', detail: 'id: 3 ✓' },
        ],
        output: ['search("a") response discarded (stale)', 'updateUI(results for "abc")'],
        phase: 'UI Updated',
      },
      {
        description: 'search("ab") response arrives last (slow server). id(2) !== currentId(3) — discarded. No stale data!',
        codeLine: 6,
        timeline: [
          { label: 'search("a")', state: 'cancelled', detail: 'Discarded' },
          { label: 'search("ab")', state: 'cancelled', detail: 'Stale: 2 !== 3' },
          { label: 'search("abc")', state: 'completed', detail: 'Used ✓' },
        ],
        output: [
          'search("a") response discarded (stale)',
          'updateUI(results for "abc")',
          'search("ab") response discarded (stale)',
        ],
        phase: 'Complete',
      },
    ],
    insight: 'Responses arrive out of order! The sequence ID pattern ensures only the latest request updates the UI, preventing stale data from overwriting fresh results.',
  },
  {
    id: 'retry-backoff',
    title: 'Retry with Backoff',
    code: [
      'async function fetchWithRetry(url, max = 3) {',
      '  for (let i = 0; i < max; i++) {',
      '    try {',
      '      const res = await fetch(url)',
      '      if (!res.ok) throw new Error("HTTP " + res.status)',
      '      return await res.json()',
      '    } catch (err) {',
      '      if (i === max - 1) throw err',
      '      const delay = Math.pow(2, i) * 1000',
      '      await new Promise(r => setTimeout(r, delay))',
      '    }',
      '  }',
      '}',
    ],
    steps: [
      {
        description: 'Attempt #1: fetch the URL. Server is experiencing issues...',
        codeLine: 3,
        timeline: [
          { label: 'Attempt 1', state: 'active', detail: 'Fetching...' },
        ],
        output: [],
        phase: 'Attempt 1',
      },
      {
        description: 'Attempt #1 FAILS with HTTP 503. Not the last attempt, so we retry.',
        codeLine: 4,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
        ],
        output: ['Error: HTTP 503'],
        phase: 'Failed',
      },
      {
        description: 'Wait 1 second (2^0 * 1000ms) before retry. Exponential backoff kicks in.',
        codeLine: 9,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
          { label: 'Backoff', state: 'active', detail: 'Waiting 1s...' },
        ],
        output: ['Error: HTTP 503', 'Waiting 1000ms before retry...'],
        phase: 'Backoff 1s',
      },
      {
        description: 'Attempt #2: try again. Server is still struggling...',
        codeLine: 3,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
          { label: 'Attempt 2', state: 'active', detail: 'Fetching...' },
        ],
        output: ['Error: HTTP 503', 'Waiting 1000ms before retry...'],
        phase: 'Attempt 2',
      },
      {
        description: 'Attempt #2 FAILS again. Still not the last attempt.',
        codeLine: 4,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
          { label: 'Attempt 2', state: 'failed', detail: 'HTTP 503' },
        ],
        output: ['Error: HTTP 503', 'Waiting 1000ms before retry...', 'Error: HTTP 503'],
        phase: 'Failed',
      },
      {
        description: 'Wait 2 seconds (2^1 * 1000ms). Backoff doubles each time!',
        codeLine: 9,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
          { label: 'Attempt 2', state: 'failed', detail: 'HTTP 503' },
          { label: 'Backoff', state: 'active', detail: 'Waiting 2s...' },
        ],
        output: ['Error: HTTP 503', 'Waiting 1000ms before retry...', 'Error: HTTP 503', 'Waiting 2000ms before retry...'],
        phase: 'Backoff 2s',
      },
      {
        description: 'Attempt #3 (final): Server recovered! Request succeeds.',
        codeLine: 5,
        timeline: [
          { label: 'Attempt 1', state: 'failed', detail: 'HTTP 503' },
          { label: 'Attempt 2', state: 'failed', detail: 'HTTP 503' },
          { label: 'Attempt 3', state: 'completed', detail: 'HTTP 200 ✓' },
        ],
        output: [
          'Error: HTTP 503',
          'Waiting 1000ms before retry...',
          'Error: HTTP 503',
          'Waiting 2000ms before retry...',
          'Success! Data received.',
        ],
        phase: 'Success',
      },
    ],
    insight: 'Exponential backoff (1s, 2s, 4s, 8s...) gives the server time to recover. Without backoff, rapid retries can make outages worse (thundering herd problem).',
  },
  {
    id: 'abort-controller',
    title: 'AbortController',
    code: [
      'let current = null',
      '',
      'function onInput(query) {',
      '  if (current) current.cancel()',
      '',
      '  const ctrl = new AbortController()',
      '  current = {',
      '    cancel: () => ctrl.abort(),',
      '  }',
      '',
      '  fetch("/api?q=" + query, {',
      '    signal: ctrl.signal,',
      '  })',
      '    .then(r => r.json())',
      '    .then(data => updateUI(data))',
      '    .catch(err => {',
      '      if (err.name !== "AbortError") throw err',
      '    })',
      '}',
    ],
    steps: [
      {
        description: 'User types "a". First fetch starts with a new AbortController signal.',
        codeLine: 5,
        timeline: [
          { label: 'fetch("a")', state: 'active', detail: 'Signal: active' },
        ],
        output: [],
        phase: 'Fetch #1',
      },
      {
        description: 'User types "ab". Previous request is ABORTED via controller.abort().',
        codeLine: 3,
        timeline: [
          { label: 'fetch("a")', state: 'cancelled', detail: 'AbortError thrown' },
        ],
        output: ['fetch("a") aborted (AbortError caught & ignored)'],
        phase: 'Abort #1',
      },
      {
        description: 'New fetch for "ab" starts with a fresh AbortController.',
        codeLine: 5,
        timeline: [
          { label: 'fetch("a")', state: 'cancelled', detail: 'Aborted' },
          { label: 'fetch("ab")', state: 'active', detail: 'Signal: active' },
        ],
        output: ['fetch("a") aborted (AbortError caught & ignored)'],
        phase: 'Fetch #2',
      },
      {
        description: 'User types "abc". Previous request aborted again, new fetch starts.',
        codeLine: 3,
        timeline: [
          { label: 'fetch("a")', state: 'cancelled', detail: 'Aborted' },
          { label: 'fetch("ab")', state: 'cancelled', detail: 'Aborted' },
          { label: 'fetch("abc")', state: 'active', detail: 'Signal: active' },
        ],
        output: [
          'fetch("a") aborted (AbortError caught & ignored)',
          'fetch("ab") aborted (AbortError caught & ignored)',
        ],
        phase: 'Fetch #3',
      },
      {
        description: 'fetch("abc") completes. No more typing, so it is not aborted. UI updates!',
        codeLine: 14,
        timeline: [
          { label: 'fetch("a")', state: 'cancelled', detail: 'Aborted' },
          { label: 'fetch("ab")', state: 'cancelled', detail: 'Aborted' },
          { label: 'fetch("abc")', state: 'completed', detail: 'Data received ✓' },
        ],
        output: [
          'fetch("a") aborted (AbortError caught & ignored)',
          'fetch("ab") aborted (AbortError caught & ignored)',
          'updateUI(results for "abc")',
        ],
        phase: 'Complete',
      },
    ],
    insight: 'AbortController cancels the actual HTTP request (saving bandwidth), unlike sequence IDs which only discard the response. The browser stops the network request entirely.',
  },
]

const getStateColor = (state: TimelineEntry['state']): string => {
  switch (state) {
    case 'pending': return 'var(--color-gray-500)'
    case 'active': return 'var(--color-amber-500)'
    case 'completed': return 'var(--color-emerald-500)'
    case 'cancelled': return 'var(--color-gray-600)'
    case 'failed': return 'var(--color-red-500)'
  }
}

const getPhaseColor = (phase: string): string => {
  if (phase.includes('Complete') || phase.includes('Success') || phase.includes('Updated')) return 'var(--color-emerald-500)'
  if (phase.includes('Failed') || phase.includes('Stale')) return 'var(--color-red-500)'
  if (phase.includes('Backoff') || phase.includes('Abort')) return 'var(--color-amber-500)'
  return 'var(--color-blue-400)'
}

export function AsyncPatternsAdvancedViz(): JSX.Element {
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

      {/* Timeline visualization */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
        <div className="mb-3 text-center text-sm font-semibold text-purple-400">
          Async Timeline
        </div>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {currentStep.timeline.map((entry, i) => (
              <motion.div
                key={`${entry.label}-${i}`}
                className="flex items-center justify-between rounded-lg border-2 px-4 py-3"
                style={{
                  borderColor: getStateColor(entry.state),
                  background: `color-mix(in srgb, ${getStateColor(entry.state)} 10%, transparent)`,
                  opacity: entry.state === 'cancelled' ? 0.6 : 1,
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: entry.state === 'cancelled' ? 0.6 : 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                layout
              >
                <span
                  className="font-mono text-sm font-bold"
                  style={{
                    color: entry.state === 'cancelled' ? 'var(--color-gray-500)' : 'var(--color-text-bright)',
                    textDecoration: entry.state === 'cancelled' ? 'line-through' : 'none',
                  }}
                >
                  {entry.label}
                </span>
                <div className="flex items-center gap-3">
                  {entry.detail && (
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-xs"
                      style={{
                        color: getStateColor(entry.state),
                        background: `color-mix(in srgb, ${getStateColor(entry.state)} 20%, transparent)`,
                      }}
                    >
                      {entry.detail}
                    </span>
                  )}
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase"
                    style={{
                      color: getStateColor(entry.state),
                      background: `color-mix(in srgb, ${getStateColor(entry.state)} 25%, transparent)`,
                    }}
                  >
                    {entry.state}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
