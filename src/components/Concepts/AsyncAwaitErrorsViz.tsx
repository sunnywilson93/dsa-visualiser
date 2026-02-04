'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, GitBranch } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface AsyncChainItem {
  name: string
  state: 'pending' | 'success' | 'error'
}

interface Step {
  description: string
  highlightLines: number[]
  errorPath: { active: boolean; errorValue?: string; caught?: boolean }
  successPath: { active: boolean; value?: string }
  asyncChain: AsyncChainItem[]
  output: string[]
  phase: 'calling' | 'try' | 'catch' | 'success' | 'error' | 'propagate' | 'finally'
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
      id: 'basic-try-catch',
      title: 'Basic try/catch with await',
      code: [
        'async function fetchUser(id) {',
        '  try {',
        '    const response = await fetch(`/api/users/${id}`);',
        '    const user = await response.json();',
        '    console.log("User:", user.name);',
        '    return user;',
        '  } catch (error) {',
        '    console.log("Error:", error.message);',
        '    return null;',
        '  }',
        '}',
        '',
        'fetchUser(123);  // Success case',
      ],
      steps: [
        {
          description: 'We call fetchUser(123). The async function starts executing.',
          highlightLines: [12],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchUser', state: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Execution enters the try block. await pauses while fetch runs.',
          highlightLines: [1, 2],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'pending' }
          ],
          output: [],
          phase: 'try',
        },
        {
          description: 'fetch() resolves successfully! We get a Response object.',
          highlightLines: [2],
          errorPath: { active: false },
          successPath: { active: true, value: 'Response { ok: true }' },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'success' }
          ],
          output: [],
          phase: 'try',
        },
        {
          description: 'await response.json() parses the JSON. Also succeeds!',
          highlightLines: [3],
          errorPath: { active: false },
          successPath: { active: true, value: '{ name: "Alice" }' },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'success' },
            { name: 'json()', state: 'success' }
          ],
          output: [],
          phase: 'try',
        },
        {
          description: 'Success path: we log the user and return. catch block is skipped.',
          highlightLines: [4, 5],
          errorPath: { active: false },
          successPath: { active: true, value: '{ name: "Alice" }' },
          asyncChain: [{ name: 'fetchUser', state: 'success' }],
          output: ['User: Alice'],
          phase: 'success',
        },
      ],
      insight: 'try/catch with await catches both sync errors AND rejected promises - all in one place!'
    },
    {
      id: 'basic-error-caught',
      title: 'Error Caught in catch',
      code: [
        'async function fetchUser(id) {',
        '  try {',
        '    const response = await fetch(`/api/users/${id}`);',
        '    const user = await response.json();',
        '    console.log("User:", user.name);',
        '    return user;',
        '  } catch (error) {',
        '    console.log("Error:", error.message);',
        '    return null;',
        '  }',
        '}',
        '',
        'fetchUser(999);  // User not found!',
      ],
      steps: [
        {
          description: 'We call fetchUser(999). This user ID does not exist.',
          highlightLines: [12],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchUser', state: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Execution enters try block. await fetch() begins...',
          highlightLines: [1, 2],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'pending' }
          ],
          output: [],
          phase: 'try',
        },
        {
          description: 'Network error! fetch() rejects. The await THROWS the error.',
          highlightLines: [2],
          errorPath: { active: true, errorValue: 'NetworkError' },
          successPath: { active: false },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'error' }
          ],
          output: [],
          phase: 'error',
        },
        {
          description: 'Execution jumps to catch block! Error is caught locally.',
          highlightLines: [6, 7],
          errorPath: { active: true, errorValue: 'NetworkError', caught: true },
          successPath: { active: false },
          asyncChain: [
            { name: 'fetchUser', state: 'pending' },
            { name: 'fetch()', state: 'error' }
          ],
          output: ['Error: NetworkError'],
          phase: 'catch',
        },
        {
          description: 'catch block returns null. Error was handled - no crash!',
          highlightLines: [8],
          errorPath: { active: true, errorValue: 'NetworkError', caught: true },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchUser', state: 'success' }],
          output: ['Error: NetworkError'],
          phase: 'catch',
        },
      ],
      insight: 'When await encounters a rejected promise, it throws. catch block catches it just like synchronous errors.'
    },
  ],
  intermediate: [
    {
      id: 'error-propagation',
      title: 'Error Propagation Chain',
      code: [
        'async function getUser(id) {',
        '  const res = await fetch(`/api/users/${id}`);',
        '  return res.json();',
        '}',
        '',
        'async function getUserPosts(userId) {',
        '  const user = await getUser(userId);  // Error here!',
        '  const posts = await fetch(`/api/posts?user=${user.id}`);',
        '  return posts.json();',
        '}',
        '',
        'async function main() {',
        '  try {',
        '    const posts = await getUserPosts(999);',
        '    console.log("Posts:", posts);',
        '  } catch (error) {',
        '    console.log("Caught in main:", error.message);',
        '  }',
        '}',
        '',
        'main();',
      ],
      steps: [
        {
          description: 'main() calls getUserPosts(999) inside a try block.',
          highlightLines: [12, 13],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'pending' },
            { name: 'getUserPosts', state: 'pending' }
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'getUserPosts calls getUser(999). No try/catch here!',
          highlightLines: [6],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'pending' },
            { name: 'getUserPosts', state: 'pending' },
            { name: 'getUser', state: 'pending' }
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'getUser awaits fetch(). Network fails for user 999!',
          highlightLines: [1],
          errorPath: { active: true, errorValue: 'User not found' },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'pending' },
            { name: 'getUserPosts', state: 'pending' },
            { name: 'getUser', state: 'error' }
          ],
          output: [],
          phase: 'error',
        },
        {
          description: 'getUser has no try/catch. Error propagates UP to getUserPosts.',
          highlightLines: [6],
          errorPath: { active: true, errorValue: 'User not found' },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'pending' },
            { name: 'getUserPosts', state: 'error' },
            { name: 'getUser', state: 'error' }
          ],
          output: [],
          phase: 'propagate',
        },
        {
          description: 'getUserPosts also has no try/catch. Error propagates UP to main.',
          highlightLines: [13],
          errorPath: { active: true, errorValue: 'User not found' },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'pending' },
            { name: 'getUserPosts', state: 'error' },
            { name: 'getUser', state: 'error' }
          ],
          output: [],
          phase: 'propagate',
        },
        {
          description: 'main has try/catch! Error is finally caught here.',
          highlightLines: [15, 16],
          errorPath: { active: true, errorValue: 'User not found', caught: true },
          successPath: { active: false },
          asyncChain: [
            { name: 'main', state: 'success' },
            { name: 'getUserPosts', state: 'error' },
            { name: 'getUser', state: 'error' }
          ],
          output: ['Caught in main: User not found'],
          phase: 'catch',
        },
      ],
      insight: 'Uncaught errors in async functions bubble up through the call chain until caught or become unhandled rejections.'
    },
    {
      id: 'rethrow-with-context',
      title: 'Re-throwing with Context',
      code: [
        'async function fetchConfig() {',
        '  try {',
        '    const res = await fetch("/api/config");',
        '    return res.json();',
        '  } catch (error) {',
        '    // Add context before re-throwing',
        '    throw new Error(`Config fetch failed: ${error.message}`);',
        '  }',
        '}',
        '',
        'async function initApp() {',
        '  try {',
        '    const config = await fetchConfig();',
        '    console.log("App started with:", config);',
        '  } catch (error) {',
        '    console.log("Init failed:", error.message);',
        '  }',
        '}',
        '',
        'initApp();',
      ],
      steps: [
        {
          description: 'initApp() starts and calls fetchConfig() inside try block.',
          highlightLines: [11, 12],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'initApp', state: 'pending' },
            { name: 'fetchConfig', state: 'pending' }
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'fetchConfig tries to fetch. Request fails!',
          highlightLines: [2],
          errorPath: { active: true, errorValue: 'NetworkError' },
          successPath: { active: false },
          asyncChain: [
            { name: 'initApp', state: 'pending' },
            { name: 'fetchConfig', state: 'pending' },
            { name: 'fetch()', state: 'error' }
          ],
          output: [],
          phase: 'error',
        },
        {
          description: 'fetchConfig catches the error locally in its catch block.',
          highlightLines: [4, 5],
          errorPath: { active: true, errorValue: 'NetworkError', caught: true },
          successPath: { active: false },
          asyncChain: [
            { name: 'initApp', state: 'pending' },
            { name: 'fetchConfig', state: 'pending' }
          ],
          output: [],
          phase: 'catch',
        },
        {
          description: 'Instead of swallowing, it RE-THROWS with added context.',
          highlightLines: [6],
          errorPath: { active: true, errorValue: 'Config fetch failed: NetworkError' },
          successPath: { active: false },
          asyncChain: [
            { name: 'initApp', state: 'pending' },
            { name: 'fetchConfig', state: 'error' }
          ],
          output: [],
          phase: 'propagate',
        },
        {
          description: 'New error propagates to initApp. Caught with enriched message!',
          highlightLines: [14, 15],
          errorPath: { active: true, errorValue: 'Config fetch failed: NetworkError', caught: true },
          successPath: { active: false },
          asyncChain: [
            { name: 'initApp', state: 'success' },
            { name: 'fetchConfig', state: 'error' }
          ],
          output: ['Init failed: Config fetch failed: NetworkError'],
          phase: 'catch',
        },
      ],
      insight: 'Catch-and-rethrow pattern: catch error, add context (which function, what operation), then rethrow for caller to handle.'
    },
  ],
  advanced: [
    {
      id: 'finally-cleanup',
      title: 'finally for Cleanup',
      code: [
        'async function processFile(path) {',
        '  const file = await openFile(path);',
        '  try {',
        '    const data = await file.read();',
        '    await processData(data);',
        '    console.log("Processing complete");',
        '  } catch (error) {',
        '    console.log("Error:", error.message);',
        '    throw error;  // Re-throw after logging',
        '  } finally {',
        '    await file.close();  // ALWAYS runs!',
        '    console.log("File closed");',
        '  }',
        '}',
      ],
      steps: [
        {
          description: 'processFile opens a file handle, then enters try block.',
          highlightLines: [1, 2],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [
            { name: 'processFile', state: 'pending' },
            { name: 'openFile', state: 'success' }
          ],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Inside try: read file and process. processing fails!',
          highlightLines: [3, 4],
          errorPath: { active: true, errorValue: 'Invalid data format' },
          successPath: { active: false },
          asyncChain: [
            { name: 'processFile', state: 'pending' },
            { name: 'read()', state: 'success' },
            { name: 'processData', state: 'error' }
          ],
          output: [],
          phase: 'error',
        },
        {
          description: 'Error caught! We log and re-throw to let caller know.',
          highlightLines: [6, 7, 8],
          errorPath: { active: true, errorValue: 'Invalid data format', caught: true },
          successPath: { active: false },
          asyncChain: [
            { name: 'processFile', state: 'pending' },
            { name: 'processData', state: 'error' }
          ],
          output: ['Error: Invalid data format'],
          phase: 'catch',
        },
        {
          description: 'BEFORE the re-throw propagates, finally block runs!',
          highlightLines: [9, 10, 11],
          errorPath: { active: true, errorValue: 'Invalid data format' },
          successPath: { active: false },
          asyncChain: [
            { name: 'processFile', state: 'pending' },
            { name: 'close()', state: 'success' }
          ],
          output: ['Error: Invalid data format', 'File closed'],
          phase: 'finally',
        },
        {
          description: 'finally completes. NOW the error propagates up.',
          highlightLines: [8],
          errorPath: { active: true, errorValue: 'Invalid data format' },
          successPath: { active: false },
          asyncChain: [{ name: 'processFile', state: 'error' }],
          output: ['Error: Invalid data format', 'File closed'],
          phase: 'propagate',
        },
      ],
      insight: 'finally ALWAYS runs - success or error. Perfect for cleanup: closing files, connections, releasing locks.'
    },
    {
      id: 'unhandled-rejection',
      title: 'Unhandled Promise Rejection',
      code: [
        'async function fetchData() {',
        '  const res = await fetch("/api/data");',
        '  return res.json();',
        '}',
        '',
        '// Calling WITHOUT await or .catch()',
        'fetchData();  // Fire and forget - DANGEROUS!',
        '',
        '// Later, somewhere else...',
        'console.log("App continues...");',
        '',
        '// Even later: fetch fails',
        '// [UnhandledPromiseRejection warning!]',
      ],
      steps: [
        {
          description: 'fetchData() is called but not awaited or caught.',
          highlightLines: [6],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchData', state: 'pending' }],
          output: [],
          phase: 'calling',
        },
        {
          description: 'Main thread continues! fetchData runs in background.',
          highlightLines: [9],
          errorPath: { active: false },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchData', state: 'pending' }],
          output: ['App continues...'],
          phase: 'calling',
        },
        {
          description: 'Background: fetch starts but network fails!',
          highlightLines: [1],
          errorPath: { active: true, errorValue: 'NetworkError' },
          successPath: { active: false },
          asyncChain: [
            { name: 'fetchData', state: 'pending' },
            { name: 'fetch()', state: 'error' }
          ],
          output: ['App continues...'],
          phase: 'error',
        },
        {
          description: 'Error thrown but NO ONE is listening. Promise rejected with no handler!',
          highlightLines: [12],
          errorPath: { active: true, errorValue: 'NetworkError' },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchData', state: 'error' }],
          output: ['App continues...', '[UnhandledPromiseRejection]'],
          phase: 'propagate',
        },
        {
          description: 'Runtime detects unhandled rejection. In Node: process warning. In browser: console error.',
          highlightLines: [12],
          errorPath: { active: true, errorValue: 'NetworkError' },
          successPath: { active: false },
          asyncChain: [{ name: 'fetchData', state: 'error' }],
          output: ['App continues...', '[UnhandledPromiseRejection]', 'Warning: NetworkError'],
          phase: 'error',
        },
      ],
      insight: 'Every async call needs handling: await it, .catch() it, or pass to error boundary. Fire-and-forget causes silent failures!'
    },
  ],
}

export function AsyncAwaitErrorsViz() {
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
      case 'try': return '#3b82f6'
      case 'catch': return 'var(--color-amber-500)'
      case 'success': return 'var(--color-emerald-500)'
      case 'error': return 'var(--color-red-500)'
      case 'propagate': return '#ec4899'
      case 'finally': return '#8b5cf6'
    }
  }

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'calling': return 'Calling'
      case 'try': return 'try block'
      case 'catch': return 'catch block'
      case 'success': return 'Success'
      case 'error': return 'Error!'
      case 'propagate': return 'Propagating'
      case 'finally': return 'finally block'
    }
  }

  const getChainStateColor = (state: AsyncChainItem['state']) => {
    switch (state) {
      case 'error': return { bg: 'var(--color-red-15)', border: 'var(--color-red-40)', text: 'var(--color-red-400)' }
      case 'success': return { bg: 'var(--color-emerald-15)', border: 'var(--color-emerald-40)', text: 'var(--color-emerald-400)' }
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
                    <div className="text-2xs text-[var(--color-red-300)] mb-1">error =</div>
                    <div className="font-mono text-xs text-[var(--color-red-400)]">
                      {currentStep.errorPath.errorValue}
                    </div>
                    {currentStep.errorPath.caught && (
                      <div className="mt-2 text-2xs text-[var(--color-amber-400)] font-semibold uppercase">
                        Caught!
                      </div>
                    )}
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
                    <div className="text-2xs text-[var(--color-emerald-300)] mb-1">result =</div>
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

        {/* Async Call Chain */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Async Call Chain
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[180px] p-[var(--spacing-md)] pt-8">
            {currentStep.asyncChain.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[var(--color-gray-700)] text-sm">
                (no async calls)
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {currentStep.asyncChain.map((item, i) => {
                    const colors = getChainStateColor(item.state)
                    return (
                      <motion.div
                        key={item.name + i}
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
                          {item.name}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-2xs font-semibold uppercase"
                          style={{
                            background: item.state === 'error' ? 'var(--color-red-500)'
                              : item.state === 'success' ? 'var(--color-emerald-500)'
                              : 'var(--color-gray-600)',
                            color: 'white',
                          }}
                        >
                          {item.state}
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
        <pre className="m-0 py-[var(--spacing-sm)] max-h-64 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${
                currentStep.highlightLines.includes(i)
                  ? currentStep.phase === 'error' || currentStep.phase === 'propagate'
                    ? 'bg-[var(--color-red-20)]'
                    : currentStep.phase === 'success'
                    ? 'bg-[var(--color-emerald-20)]'
                    : currentStep.phase === 'catch'
                    ? 'bg-[var(--color-amber-20)]'
                    : currentStep.phase === 'finally'
                    ? 'bg-[var(--color-purple-20)]'
                    : 'bg-[var(--color-brand-primary-20)]'
                  : ''
              }`}
            >
              <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${
                currentStep.highlightLines.includes(i)
                  ? currentStep.phase === 'error' || currentStep.phase === 'propagate'
                    ? 'text-[var(--color-red-400)]'
                    : currentStep.phase === 'success'
                    ? 'text-[var(--color-emerald-400)]'
                    : currentStep.phase === 'catch'
                    ? 'text-[var(--color-amber-400)]'
                    : currentStep.phase === 'finally'
                    ? 'text-[var(--color-purple-400)]'
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
                  item.includes('Error') || item.includes('Unhandled') || item.includes('Warning')
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
