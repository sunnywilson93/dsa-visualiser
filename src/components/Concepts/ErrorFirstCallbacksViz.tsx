'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, GitBranch } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface CallbackChainItem {
  name: string
  received: 'error' | 'data' | 'pending'
}

interface Step {
  description: string
  highlightLines: number[]
  errorPath: { active: boolean; errorValue?: string }
  successPath: { active: boolean; value?: string }
  callbackChain: CallbackChainItem[]
  output: string[]
  phase: 'calling' | 'error-check' | 'success' | 'error'
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'basic-success',
      title: 'Basic Error Check (Success)',
      code: [
        "const fs = require('fs');",
        '',
        "fs.readFile('data.txt', 'utf8', (err, data) => {",
        '  if (err) {',
        '    console.log("Error:", err.message);',
        '    return;',
        '  }',
        '  console.log("Data:", data);',
        '});',
      ],
      steps: [
        {
          description: 'We call fs.readFile with a callback that follows the (err, data) signature.',
          highlightLines: [2],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'File read completes successfully. Node.js calls our callback with (null, "file contents").',
          highlightLines: [2],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'data' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'First, we check if err exists. Since file was read successfully, err is null.',
          highlightLines: [3],
          errorPath: { active: false },
          successPath: { active: true, value: '"Hello World"' },
          callbackChain: [{ name: 'readFile callback', received: 'data' }],
          output: [],
          phase: 'error-check',
        },
        {
          description: 'err is null (falsy), so we skip the error block and continue to success path.',
          highlightLines: [7],
          errorPath: { active: false },
          successPath: { active: true, value: '"Hello World"' },
          callbackChain: [{ name: 'readFile callback', received: 'data' }],
          output: ['Data: Hello World'],
          phase: 'success',
        },
      ],
      insight: 'The error-first pattern: always check err FIRST. If null/undefined, proceed with data.'
    },
    {
      id: 'basic-error',
      title: 'Error Handling (Failure)',
      code: [
        "const fs = require('fs');",
        '',
        "fs.readFile('missing.txt', 'utf8', (err, data) => {",
        '  if (err) {',
        '    console.log("Error:", err.message);',
        '    return;',
        '  }',
        '  console.log("Data:", data);',
        '});',
      ],
      steps: [
        {
          description: 'We try to read a file that does not exist.',
          highlightLines: [2],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'File not found! Node.js calls our callback with (Error, undefined).',
          highlightLines: [2],
          errorPath: { active: true, errorValue: 'ENOENT: no such file' },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'error' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'We check if err exists. err is truthy (an Error object)!',
          highlightLines: [3],
          errorPath: { active: true, errorValue: 'ENOENT: no such file' },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'error' }],
          output: [],
          phase: 'error-check',
        },
        {
          description: 'Error path taken: log the error and return early. Success code never runs.',
          highlightLines: [4, 5],
          errorPath: { active: true, errorValue: 'ENOENT: no such file' },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'error' }],
          output: ['Error: ENOENT: no such file'],
          phase: 'error',
        },
      ],
      insight: 'When an error occurs, err is truthy. Always return/exit after handling to prevent running success code.'
    },
  ],
  intermediate: [
    {
      id: 'chained-callbacks',
      title: 'Chained Callbacks',
      code: [
        "fs.readFile('config.json', 'utf8', (err, data) => {",
        '  if (err) return handleError(err);',
        '',
        '  const config = JSON.parse(data);',
        '',
        '  db.connect(config.dbUrl, (err, conn) => {',
        '    if (err) return handleError(err);',
        '',
        '    console.log("Connected:", conn.id);',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'First callback: read a config file.',
          highlightLines: [0],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [
            { name: 'readFile', received: 'pending' },
            { name: 'db.connect', received: 'pending' },
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'File read succeeds. err is null, data contains JSON.',
          highlightLines: [1],
          errorPath: { active: false },
          successPath: { active: true, value: '{"dbUrl": "..."}' },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'pending' },
          ],
          output: [],
          phase: 'error-check',
        },
        {
          description: 'Parse config and call the next async operation in the chain.',
          highlightLines: [3, 5],
          errorPath: { active: false },
          successPath: { active: true, value: '{"dbUrl": "..."}' },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'pending' },
          ],
          output: [],
          phase: 'success',
        },
        {
          description: 'Second callback: db.connect completes successfully.',
          highlightLines: [6],
          errorPath: { active: false },
          successPath: { active: true, value: 'Connection object' },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'data' },
          ],
          output: [],
          phase: 'error-check',
        },
        {
          description: 'Both operations succeeded. Chain complete!',
          highlightLines: [8],
          errorPath: { active: false },
          successPath: { active: true, value: 'Connection object' },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'data' },
          ],
          output: ['Connected: conn_123'],
          phase: 'success',
        },
      ],
      insight: 'Each callback in a chain must check err independently. Pattern: if (err) return handleError(err);'
    },
    {
      id: 'error-propagation',
      title: 'Error Propagation',
      code: [
        "fs.readFile('config.json', 'utf8', (err, data) => {",
        '  if (err) return handleError(err);',
        '',
        '  const config = JSON.parse(data);',
        '',
        '  db.connect(config.dbUrl, (err, conn) => {',
        '    if (err) return handleError(err);  // Error here!',
        '',
        '    console.log("Connected:", conn.id);',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'First operation: read config file.',
          highlightLines: [0],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [
            { name: 'readFile', received: 'pending' },
            { name: 'db.connect', received: 'pending' },
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'File read succeeds. Moving to next operation.',
          highlightLines: [3, 5],
          errorPath: { active: false },
          successPath: { active: true, value: '{"dbUrl": "..."}' },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'pending' },
          ],
          output: [],
          phase: 'success',
        },
        {
          description: 'db.connect FAILS! Error passed to callback: (Error, undefined).',
          highlightLines: [5],
          errorPath: { active: true, errorValue: 'Connection refused' },
          successPath: { active: false },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'error' },
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Error check catches the failure. Error propagates to handler.',
          highlightLines: [6],
          errorPath: { active: true, errorValue: 'Connection refused' },
          successPath: { active: false },
          callbackChain: [
            { name: 'readFile', received: 'data' },
            { name: 'db.connect', received: 'error' },
          ],
          output: ['[handleError] Connection refused'],
          phase: 'error',
        },
      ],
      insight: 'Errors can occur at ANY point in the chain. Each callback must handle its own errors.'
    },
  ],
  advanced: [
    {
      id: 'try-catch-fails',
      title: 'Why try-catch Fails',
      code: [
        'try {',
        "  fs.readFile('data.txt', (err, data) => {",
        '    if (err) throw err;  // This throws!',
        '    console.log(data);',
        '  });',
        '} catch (e) {',
        '  // This NEVER catches the error!',
        '  console.log("Caught:", e);',
        '}',
        'console.log("try-catch exited");',
      ],
      steps: [
        {
          description: 'We wrap async code in try-catch, expecting to catch errors.',
          highlightLines: [0, 1],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'fs.readFile is async. It registers callback and RETURNS IMMEDIATELY.',
          highlightLines: [4],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'try-catch exits! The callback has not run yet. Sync code continues.',
          highlightLines: [9],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'pending' }],
          output: ['try-catch exited'],
          phase: 'success',
        },
        {
          description: 'LATER: File read fails. Callback runs with err. throw err executes...',
          highlightLines: [2],
          errorPath: { active: true, errorValue: 'ENOENT: no such file' },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'error' }],
          output: ['try-catch exited'],
          phase: 'error-check',
        },
        {
          description: 'UNCAUGHT EXCEPTION! try-catch already exited. Error crashes the process.',
          highlightLines: [2],
          errorPath: { active: true, errorValue: 'ENOENT: no such file' },
          successPath: { active: false },
          callbackChain: [{ name: 'readFile callback', received: 'error' }],
          output: ['try-catch exited', '[CRASH] Uncaught Error: ENOENT'],
          phase: 'error',
        },
      ],
      insight: 'try-catch is SYNCHRONOUS. Callbacks run LATER, outside the try block. Use error-first pattern instead!'
    },
    {
      id: 'why-error-first',
      title: 'Why Error Comes First',
      code: [
        '// Error-first enables partial application:',
        'function handleResult(err, data) {',
        '  if (err) return console.error(err);',
        '  process(data);',
        '}',
        '',
        '// Create specialized handlers:',
        'const logError = (err) => err && console.error(err);',
        '',
        '// Chain operations easily:',
        'fs.readFile("a.txt", (err, a) => {',
        '  if (err) return logError(err);',
        '  fs.readFile("b.txt", (err, b) => {',
        '    if (err) return logError(err);',
        '    console.log(a + b);',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'The (err, data) convention: error is ALWAYS first parameter.',
          highlightLines: [1],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Why first? It enables consistent error checking at the TOP of every callback.',
          highlightLines: [2, 3],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [],
          output: [],
          phase: 'error-check',
        },
        {
          description: 'You can create reusable error handlers that work with any callback.',
          highlightLines: [7],
          errorPath: { active: false },
          successPath: { active: false },
          callbackChain: [],
          output: [],
          phase: 'success',
        },
        {
          description: 'Chained operations: each level checks err with the same pattern.',
          highlightLines: [10, 11, 12, 13],
          errorPath: { active: false },
          successPath: { active: true },
          callbackChain: [
            { name: 'readFile a.txt', received: 'pending' },
            { name: 'readFile b.txt', received: 'pending' },
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Both succeed: the pattern scales to any depth (though Promises are cleaner!).',
          highlightLines: [14],
          errorPath: { active: false },
          successPath: { active: true, value: 'Combined data' },
          callbackChain: [
            { name: 'readFile a.txt', received: 'data' },
            { name: 'readFile b.txt', received: 'data' },
          ],
          output: ['ContentA + ContentB'],
          phase: 'success',
        },
      ],
      insight: 'Error-first is a CONVENTION. Consistent position = consistent handling = fewer bugs.'
    },
  ],
}

export function ErrorFirstCallbacksViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine >= 0 && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

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
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'calling': return '#64748b'
      case 'error-check': return 'var(--color-amber-500)'
      case 'success': return 'var(--color-emerald-500)'
      case 'error': return 'var(--color-red-500)'
    }
  }

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'calling': return 'Calling'
      case 'error-check': return 'Checking err'
      case 'success': return 'Success Path'
      case 'error': return 'Error Path'
    }
  }

  const getReceivedColor = (received: CallbackChainItem['received']) => {
    switch (received) {
      case 'error': return { bg: 'var(--color-red-15)', border: 'var(--color-red-40)', text: 'var(--color-red-400)' }
      case 'data': return { bg: 'var(--color-emerald-15)', border: 'var(--color-emerald-40)', text: 'var(--color-emerald-400)' }
      case 'pending': return { bg: 'var(--color-white-5)', border: 'var(--color-white-15)', text: 'var(--color-gray-500)' }
    }
  }

  return (
    <div className="flex flex-col gap-5 text-[var(--js-viz-text)]">
      {/* Level selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
              ${level === lvl
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full transition-all duration-150 cursor-pointer
              ${exampleIndex === i
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-[1fr_1fr] gap-[var(--spacing-lg)] max-md:grid-cols-1">
        {/* Path Taken - Fork Visualization */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--color-amber-500), var(--color-orange-400))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
            <GitBranch size={14} />
            Path Taken
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[180px] p-[var(--spacing-md)] pt-8 flex gap-[var(--spacing-md)]">
            {/* Error Path Branch */}
            <div
              className={`flex-1 rounded-lg p-[var(--spacing-md)] border-2 transition-all duration-300 ${
                currentStep.errorPath.active
                  ? 'border-[var(--color-red-500)] bg-[var(--color-red-10)] shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-[var(--color-white-10)] bg-[var(--color-white-3)] opacity-40'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className={currentStep.errorPath.active ? 'text-[var(--color-red-400)]' : 'text-[var(--color-gray-600)]'} />
                <span className={`font-semibold text-sm ${currentStep.errorPath.active ? 'text-[var(--color-red-400)]' : 'text-[var(--color-gray-600)]'}`}>
                  Error Path
                </span>
              </div>
              <AnimatePresence mode="wait">
                {currentStep.errorPath.active && currentStep.errorPath.errorValue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-[var(--spacing-sm)] bg-[var(--color-red-20)] rounded-md border border-[var(--color-red-40)]"
                  >
                    <div className="text-2xs text-[var(--color-red-300)] mb-1">err =</div>
                    <div className="font-mono text-xs text-[var(--color-red-400)]">
                      {currentStep.errorPath.errorValue}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!currentStep.errorPath.active && (
                <div className="text-xs text-[var(--color-gray-700)] italic">
                  (not taken)
                </div>
              )}
            </div>

            {/* Success Path Branch */}
            <div
              className={`flex-1 rounded-lg p-[var(--spacing-md)] border-2 transition-all duration-300 ${
                currentStep.successPath.active
                  ? 'border-[var(--color-emerald-500)] bg-[var(--color-emerald-10)] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'border-[var(--color-white-10)] bg-[var(--color-white-3)] opacity-40'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className={currentStep.successPath.active ? 'text-[var(--color-emerald-400)]' : 'text-[var(--color-gray-600)]'} />
                <span className={`font-semibold text-sm ${currentStep.successPath.active ? 'text-[var(--color-emerald-400)]' : 'text-[var(--color-gray-600)]'}`}>
                  Success Path
                </span>
              </div>
              <AnimatePresence mode="wait">
                {currentStep.successPath.active && currentStep.successPath.value && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-[var(--spacing-sm)] bg-[var(--color-emerald-20)] rounded-md border border-[var(--color-emerald-40)]"
                  >
                    <div className="text-2xs text-[var(--color-emerald-300)] mb-1">data =</div>
                    <div className="font-mono text-xs text-[var(--color-emerald-400)]">
                      {currentStep.successPath.value}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!currentStep.successPath.active && (
                <div className="text-xs text-[var(--color-gray-700)] italic">
                  (not taken)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Callback Chain */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Callback Chain
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[180px] p-[var(--spacing-md)] pt-8">
            {currentStep.callbackChain.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[var(--color-gray-700)] text-sm">
                (no callbacks)
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {currentStep.callbackChain.map((cb, i) => {
                    const colors = getReceivedColor(cb.received)
                    return (
                      <motion.div
                        key={cb.name + i}
                        className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-md border"
                        style={{
                          background: colors.bg,
                          borderColor: colors.border,
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <span className="font-mono text-xs" style={{ color: colors.text }}>
                          {cb.name}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-2xs font-semibold uppercase"
                          style={{
                            background: cb.received === 'error' ? 'var(--color-red-500)'
                              : cb.received === 'data' ? 'var(--color-emerald-500)'
                              : 'var(--color-gray-600)',
                            color: 'white',
                          }}
                        >
                          {cb.received}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] shadow-[0_10px_24px_rgba(2,4,10,0.35)] overflow-hidden">
        <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-3)]">
          <span className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
            Code
          </span>
          <span className="px-[var(--spacing-sm)] py-0.5 rounded-full text-2xs font-semibold text-white" style={{ background: getPhaseColor(currentStep.phase) }}>
            {getPhaseLabel(currentStep.phase)}
          </span>
        </div>
        <pre className="m-0 py-[var(--spacing-sm)] max-h-48 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${
                currentStep.highlightLines.includes(i)
                  ? currentStep.phase === 'error'
                    ? 'bg-[var(--color-red-20)]'
                    : currentStep.phase === 'success'
                    ? 'bg-[var(--color-emerald-20)]'
                    : 'bg-[var(--color-brand-primary-20)]'
                  : ''
              }`}
            >
              <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${
                currentStep.highlightLines.includes(i)
                  ? currentStep.phase === 'error'
                    ? 'text-[var(--color-red-400)]'
                    : currentStep.phase === 'success'
                    ? 'text-[var(--color-emerald-400)]'
                    : 'text-[var(--color-brand-light)]'
                  : 'text-[var(--color-gray-300)]'
              }`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Output Section */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
        <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
          Output
        </div>
        <div className="font-mono text-sm min-h-6">
          {currentStep.output.length === 0 ? (
            <span className="text-[var(--color-gray-800)]">-</span>
          ) : (
            currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className={`py-0.5 ${
                  item.includes('Error') || item.includes('CRASH')
                    ? 'text-[var(--color-red-400)]'
                    : 'text-[var(--difficulty-1)]'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-[var(--spacing-md)] py-2.5 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-lg text-base text-[var(--js-viz-muted)] text-center"
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-xs text-[var(--color-gray-500)] text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
