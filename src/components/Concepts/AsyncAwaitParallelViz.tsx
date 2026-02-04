'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Zap, Clock } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface PromiseItem {
  id: string
  label: string
  state: 'idle' | 'pending' | 'fulfilled'
  duration: number
  startTime: number
  endTime?: number
}

interface Step {
  description: string
  highlightLines: number[]
  mode: 'sequential' | 'parallel'
  promises: PromiseItem[]
  totalTime?: number
  currentlyAwaiting?: string
  output: string[]
  phase: string
  elapsed: number
}

interface Example {
  id: string
  title: string
  sequentialCode: string[]
  parallelCode: string[]
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
      id: 'two-fetches',
      title: 'Two API Fetches',
      sequentialCode: [
        'async function sequential() {',
        '  const user = await fetchUser();    // 2s',
        '  const posts = await fetchPosts();  // 2s',
        '  return { user, posts };',
        '}',
        '// Total: 4 seconds (2 + 2)',
      ],
      parallelCode: [
        'async function parallel() {',
        '  const [user, posts] = await Promise.all([',
        '    fetchUser(),   // 2s',
        '    fetchPosts(),  // 2s (runs at same time!)',
        '  ]);',
        '  return { user, posts };',
        '}',
        '// Total: 2 seconds (max of 2, 2)',
      ],
      steps: [
        {
          description: 'Sequential: We start fetchUser() and WAIT for it to complete before starting anything else.',
          highlightLines: [1],
          mode: 'sequential',
          promises: [
            { id: 'user', label: 'fetchUser()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'posts', label: 'fetchPosts()', state: 'idle', duration: 2000, startTime: 2000 },
          ],
          currentlyAwaiting: 'fetchUser()',
          output: [],
          phase: 'sequential-1',
          elapsed: 0,
        },
        {
          description: 'Sequential: fetchUser() completes after 2s. NOW we can start fetchPosts().',
          highlightLines: [1, 2],
          mode: 'sequential',
          promises: [
            { id: 'user', label: 'fetchUser()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'posts', label: 'fetchPosts()', state: 'pending', duration: 2000, startTime: 2000 },
          ],
          currentlyAwaiting: 'fetchPosts()',
          output: ['user = { name: "Alice" }'],
          phase: 'sequential-2',
          elapsed: 2000,
        },
        {
          description: 'Sequential: fetchPosts() completes at 4s total. Both done after 4 seconds.',
          highlightLines: [2, 3],
          mode: 'sequential',
          promises: [
            { id: 'user', label: 'fetchUser()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'posts', label: 'fetchPosts()', state: 'fulfilled', duration: 2000, startTime: 2000, endTime: 4000 },
          ],
          totalTime: 4000,
          output: ['user = { name: "Alice" }', 'posts = [...]'],
          phase: 'sequential-done',
          elapsed: 4000,
        },
        {
          description: 'Parallel: Promise.all starts BOTH fetches at the SAME TIME!',
          highlightLines: [1, 2, 3],
          mode: 'parallel',
          promises: [
            { id: 'user', label: 'fetchUser()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'posts', label: 'fetchPosts()', state: 'pending', duration: 2000, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.all',
          output: [],
          phase: 'parallel-start',
          elapsed: 0,
        },
        {
          description: 'Parallel: Both complete at 2s! We only waited for the slower one.',
          highlightLines: [4, 5],
          mode: 'parallel',
          promises: [
            { id: 'user', label: 'fetchUser()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'posts', label: 'fetchPosts()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
          ],
          totalTime: 2000,
          output: ['user = { name: "Alice" }', 'posts = [...]'],
          phase: 'parallel-done',
          elapsed: 2000,
        },
      ],
      insight: 'Sequential: 4s (2+2). Parallel: 2s (max). When operations are independent, use Promise.all!'
    },
  ],
  intermediate: [
    {
      id: 'three-operations',
      title: 'Three Independent Operations',
      sequentialCode: [
        'async function sequential() {',
        '  const a = await taskA();  // 1s',
        '  const b = await taskB();  // 2s',
        '  const c = await taskC();  // 1.5s',
        '  return [a, b, c];',
        '}',
        '// Total: 4.5 seconds',
      ],
      parallelCode: [
        'async function parallel() {',
        '  const [a, b, c] = await Promise.all([',
        '    taskA(),  // 1s',
        '    taskB(),  // 2s',
        '    taskC(),  // 1.5s',
        '  ]);',
        '  return [a, b, c];',
        '}',
        '// Total: 2 seconds (slowest task)',
      ],
      steps: [
        {
          description: 'Sequential: Start taskA and wait...',
          highlightLines: [1],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'pending', duration: 1000, startTime: 0 },
            { id: 'b', label: 'taskB()', state: 'idle', duration: 2000, startTime: 1000 },
            { id: 'c', label: 'taskC()', state: 'idle', duration: 1500, startTime: 3000 },
          ],
          currentlyAwaiting: 'taskA()',
          output: [],
          phase: 'seq-1',
          elapsed: 0,
        },
        {
          description: 'Sequential: taskA done at 1s. Now start taskB...',
          highlightLines: [2],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 1000 },
            { id: 'c', label: 'taskC()', state: 'idle', duration: 1500, startTime: 3000 },
          ],
          currentlyAwaiting: 'taskB()',
          output: ['a = "result A"'],
          phase: 'seq-2',
          elapsed: 1000,
        },
        {
          description: 'Sequential: taskB done at 3s. Now start taskC...',
          highlightLines: [3],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 1000, endTime: 3000 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 3000 },
          ],
          currentlyAwaiting: 'taskC()',
          output: ['a = "result A"', 'b = "result B"'],
          phase: 'seq-3',
          elapsed: 3000,
        },
        {
          description: 'Sequential: All done at 4.5s total (1 + 2 + 1.5).',
          highlightLines: [4],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 1000, endTime: 3000 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 3000, endTime: 4500 },
          ],
          totalTime: 4500,
          output: ['a = "result A"', 'b = "result B"', 'c = "result C"'],
          phase: 'seq-done',
          elapsed: 4500,
        },
        {
          description: 'Parallel: All three start at the same time!',
          highlightLines: [1, 2, 3, 4],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'pending', duration: 1000, startTime: 0 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.all',
          output: [],
          phase: 'par-start',
          elapsed: 0,
        },
        {
          description: 'Parallel: taskA finishes first at 1s, but we wait for all...',
          highlightLines: [2],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.all (waiting...)',
          output: [],
          phase: 'par-mid1',
          elapsed: 1000,
        },
        {
          description: 'Parallel: taskC finishes at 1.5s, taskB still running...',
          highlightLines: [4],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          currentlyAwaiting: 'Promise.all (waiting...)',
          output: [],
          phase: 'par-mid2',
          elapsed: 1500,
        },
        {
          description: 'Parallel: All done at 2s! Only waited for the slowest (taskB).',
          highlightLines: [5, 6],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          totalTime: 2000,
          output: ['a = "result A"', 'b = "result B"', 'c = "result C"'],
          phase: 'par-done',
          elapsed: 2000,
        },
      ],
      insight: 'Sequential: 4.5s vs Parallel: 2s. The more independent operations, the bigger the parallel savings!'
    },
  ],
  advanced: [
    {
      id: 'error-handling',
      title: 'Error Handling Comparison',
      sequentialCode: [
        'async function sequential() {',
        '  try {',
        '    const a = await taskA();      // succeeds',
        '    const b = await taskB();      // FAILS!',
        '    const c = await taskC();      // never runs',
        '  } catch (e) {',
        '    // Error at 3s (1s + 2s)',
        '  }',
        '}',
      ],
      parallelCode: [
        'async function parallel() {',
        '  try {',
        '    const [a, b, c] = await Promise.all([',
        '      taskA(),  // succeeds at 1s',
        '      taskB(),  // FAILS at 2s',
        '      taskC(),  // succeeds at 1.5s',
        '    ]);',
        '  } catch (e) {',
        '    // Error at 2s (fail-fast)',
        '  }',
        '}',
      ],
      steps: [
        {
          description: 'Sequential: Start taskA...',
          highlightLines: [2],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'pending', duration: 1000, startTime: 0 },
            { id: 'b', label: 'taskB()', state: 'idle', duration: 2000, startTime: 1000 },
            { id: 'c', label: 'taskC()', state: 'idle', duration: 1500, startTime: 3000 },
          ],
          currentlyAwaiting: 'taskA()',
          output: [],
          phase: 'seq-1',
          elapsed: 0,
        },
        {
          description: 'Sequential: taskA succeeds at 1s. Now start taskB...',
          highlightLines: [3],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 1000 },
            { id: 'c', label: 'taskC()', state: 'idle', duration: 1500, startTime: 3000 },
          ],
          currentlyAwaiting: 'taskB()',
          output: ['a = "result A"'],
          phase: 'seq-2',
          elapsed: 1000,
        },
        {
          description: 'Sequential: taskB FAILS at 3s! taskC never started.',
          highlightLines: [3, 5, 6],
          mode: 'sequential',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 1000, endTime: 3000 },
            { id: 'c', label: 'taskC()', state: 'idle', duration: 1500, startTime: 3000 },
          ],
          totalTime: 3000,
          output: ['a = "result A"', 'Error: taskB failed!'],
          phase: 'seq-error',
          elapsed: 3000,
        },
        {
          description: 'Parallel: All three start together at time 0...',
          highlightLines: [2, 3, 4, 5],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'pending', duration: 1000, startTime: 0 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.all',
          output: [],
          phase: 'par-start',
          elapsed: 0,
        },
        {
          description: 'Parallel: taskA succeeds at 1s, but Promise.all keeps waiting...',
          highlightLines: [3],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.all',
          output: [],
          phase: 'par-mid1',
          elapsed: 1000,
        },
        {
          description: 'Parallel: taskC succeeds at 1.5s...',
          highlightLines: [5],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          currentlyAwaiting: 'Promise.all',
          output: [],
          phase: 'par-mid2',
          elapsed: 1500,
        },
        {
          description: 'Parallel: taskB FAILS at 2s! Promise.all rejects IMMEDIATELY (fail-fast).',
          highlightLines: [4, 7, 8],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          totalTime: 2000,
          output: ['Error: taskB failed!'],
          phase: 'par-error',
          elapsed: 2000,
        },
      ],
      insight: 'Promise.all is fail-fast: first rejection = immediate rejection. Consider Promise.allSettled if you need all results.'
    },
    {
      id: 'allsettled',
      title: 'Promise.allSettled Pattern',
      sequentialCode: [
        '// If you need ALL results regardless of failures:',
        'async function withAllSettled() {',
        '  const results = await Promise.allSettled([',
        '    taskA(),  // succeeds',
        '    taskB(),  // fails',
        '    taskC(),  // succeeds',
        '  ]);',
        '  // results is array of {status, value} or {status, reason}',
        '}',
      ],
      parallelCode: [
        'const results = [',
        '  { status: "fulfilled", value: "A" },',
        '  { status: "rejected", reason: Error },',
        '  { status: "fulfilled", value: "C" },',
        '];',
        '',
        '// Handle each result individually',
        'results.forEach(r => {',
        '  r.status === "fulfilled" ? use(r.value) : log(r.reason);',
        '});',
      ],
      steps: [
        {
          description: 'Promise.allSettled waits for ALL promises, success OR failure.',
          highlightLines: [1, 2, 3, 4, 5],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'pending', duration: 1000, startTime: 0 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.allSettled',
          output: [],
          phase: 'settled-start',
          elapsed: 0,
        },
        {
          description: 'taskA completes at 1s (success)...',
          highlightLines: [3],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'pending', duration: 1500, startTime: 0 },
          ],
          currentlyAwaiting: 'Promise.allSettled',
          output: [],
          phase: 'settled-1',
          elapsed: 1000,
        },
        {
          description: 'taskC completes at 1.5s (success)...',
          highlightLines: [5],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'pending', duration: 2000, startTime: 0 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          currentlyAwaiting: 'Promise.allSettled',
          output: [],
          phase: 'settled-2',
          elapsed: 1500,
        },
        {
          description: 'taskB fails at 2s. But allSettled does NOT reject! It waits for all.',
          highlightLines: [4],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          totalTime: 2000,
          output: [],
          phase: 'settled-3',
          elapsed: 2000,
        },
        {
          description: 'allSettled resolves with ARRAY of results. Each has status + value/reason.',
          highlightLines: [6, 7],
          mode: 'parallel',
          promises: [
            { id: 'a', label: 'taskA()', state: 'fulfilled', duration: 1000, startTime: 0, endTime: 1000 },
            { id: 'b', label: 'taskB()', state: 'fulfilled', duration: 2000, startTime: 0, endTime: 2000 },
            { id: 'c', label: 'taskC()', state: 'fulfilled', duration: 1500, startTime: 0, endTime: 1500 },
          ],
          totalTime: 2000,
          output: [
            '{ status: "fulfilled", value: "A" }',
            '{ status: "rejected", reason: Error }',
            '{ status: "fulfilled", value: "C" }',
          ],
          phase: 'settled-done',
          elapsed: 2000,
        },
      ],
      insight: 'Promise.all = fail-fast (one failure = done). Promise.allSettled = wait for all, get all results including failures.'
    },
  ],
}

export function AsyncAwaitParallelViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const maxTime = Math.max(...currentStep.promises.map(p => (p.endTime ?? (p.startTime + p.duration))))

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

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`

  const getTimelineWidth = (promise: PromiseItem) => {
    const end = promise.endTime ?? (promise.state === 'pending' ? currentStep.elapsed : promise.startTime + promise.duration)
    const width = ((end - promise.startTime) / maxTime) * 100
    return Math.min(width, 100)
  }

  const getTimelineLeft = (promise: PromiseItem) => {
    return (promise.startTime / maxTime) * 100
  }

  const getModeColor = (mode: 'sequential' | 'parallel') => {
    return mode === 'sequential'
      ? { bg: 'var(--color-amber-500)', text: 'var(--color-amber-400)', bgLight: 'var(--color-amber-15)' }
      : { bg: 'var(--color-emerald-500)', text: 'var(--color-emerald-400)', bgLight: 'var(--color-emerald-15)' }
  }

  const modeColors = getModeColor(currentStep.mode)

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

      {/* Timeline Visualization */}
      <div className="relative rounded-xl p-[3px]"
        style={{
          background: `linear-gradient(135deg, ${modeColors.bg}, ${currentStep.mode === 'sequential' ? 'var(--color-orange-400)' : 'var(--color-teal-400)'})`
        }}>
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10 flex items-center gap-2">
          {currentStep.mode === 'sequential' ? <Clock size={14} /> : <Zap size={14} />}
          {currentStep.mode === 'sequential' ? 'Sequential' : 'Parallel'} Execution
        </div>
        <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[160px] p-[var(--spacing-lg)] pt-10">
          {/* Timeline header */}
          <div className="flex justify-between mb-4 text-xs text-[var(--color-gray-500)]">
            <span>0s</span>
            <span>{formatTime(maxTime / 2)}</span>
            <span>{formatTime(maxTime)}</span>
          </div>

          {/* Promise timelines */}
          <div className="flex flex-col gap-3">
            {currentStep.promises.map((promise, i) => (
              <div key={promise.id} className="flex items-center gap-3">
                <div className="w-24 text-xs font-mono text-[var(--color-gray-400)] truncate">
                  {promise.label}
                </div>
                <div className="flex-1 h-8 bg-[var(--color-white-5)] rounded-md relative overflow-hidden">
                  {/* Timeline bar */}
                  <motion.div
                    className="absolute top-0 h-full rounded-md flex items-center justify-end pr-2"
                    style={{
                      left: `${getTimelineLeft(promise)}%`,
                      background: promise.state === 'idle'
                        ? 'var(--color-gray-700)'
                        : promise.state === 'pending'
                        ? `linear-gradient(90deg, ${modeColors.bg}, ${modeColors.bg}88)`
                        : modeColors.bg,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getTimelineWidth(promise)}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {promise.state === 'fulfilled' && (
                      <span className="text-white text-2xs font-semibold">
                        {formatTime(promise.endTime ?? promise.duration)}
                      </span>
                    )}
                  </motion.div>

                  {/* State badge */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-2xs font-semibold uppercase ${
                        promise.state === 'idle'
                          ? 'bg-[var(--color-gray-600)] text-[var(--color-gray-400)]'
                          : promise.state === 'pending'
                          ? 'bg-[var(--color-blue-500)] text-white'
                          : 'bg-[var(--color-emerald-500)] text-white'
                      }`}
                    >
                      {promise.state}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total time indicator */}
          <div className="mt-4 pt-3 border-t border-[var(--color-white-10)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Timer size={16} className="text-[var(--color-gray-500)]" />
              <span className="text-[var(--color-gray-500)]">Elapsed:</span>
              <span className="font-mono font-semibold" style={{ color: modeColors.text }}>
                {formatTime(currentStep.elapsed)}
              </span>
            </div>
            {currentStep.totalTime && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-gray-500)]">Total time:</span>
                <span
                  className="px-3 py-1 rounded-full font-mono font-bold text-sm text-white"
                  style={{ background: modeColors.bg }}
                >
                  {formatTime(currentStep.totalTime)}
                </span>
              </div>
            )}
            {currentStep.currentlyAwaiting && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--color-gray-600)]">Awaiting:</span>
                <span className="font-mono" style={{ color: modeColors.text }}>
                  {currentStep.currentlyAwaiting}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code comparison */}
      <div className="grid grid-cols-[1fr_1fr] gap-[var(--spacing-md)] max-md:grid-cols-1">
        {/* Sequential code */}
        <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] overflow-hidden">
          <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-15)] border-b border-[var(--color-amber-30)]">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-amber-400)]">
              <Clock size={14} />
              Sequential
            </span>
          </div>
          <pre className="m-0 py-[var(--spacing-sm)] max-h-48 overflow-y-auto">
            {currentExample.sequentialCode.map((line, i) => (
              <div
                key={i}
                ref={el => { lineRefs.current[i] = el }}
                className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${
                  currentStep.mode === 'sequential' && currentStep.highlightLines.includes(i)
                    ? 'bg-[var(--color-amber-20)]'
                    : ''
                }`}
              >
                <span className="w-5 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
                <span className={`font-mono text-2xs ${
                  currentStep.mode === 'sequential' && currentStep.highlightLines.includes(i)
                    ? 'text-[var(--color-amber-400)]'
                    : 'text-[var(--color-gray-400)]'
                }`}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Parallel code */}
        <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] overflow-hidden">
          <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-emerald-15)] border-b border-[var(--color-emerald-30)]">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-emerald-400)]">
              <Zap size={14} />
              Parallel
            </span>
          </div>
          <pre className="m-0 py-[var(--spacing-sm)] max-h-48 overflow-y-auto">
            {currentExample.parallelCode.map((line, i) => (
              <div
                key={i}
                className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${
                  currentStep.mode === 'parallel' && currentStep.highlightLines.includes(i)
                    ? 'bg-[var(--color-emerald-20)]'
                    : ''
                }`}
              >
                <span className="w-5 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
                <span className={`font-mono text-2xs ${
                  currentStep.mode === 'parallel' && currentStep.highlightLines.includes(i)
                    ? 'text-[var(--color-emerald-400)]'
                    : 'text-[var(--color-gray-400)]'
                }`}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Output Section */}
      {currentStep.output.length > 0 && (
        <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
          <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
            Output
          </div>
          <div className="font-mono text-sm">
            {currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className={`py-0.5 ${
                  item.includes('Error') || item.includes('rejected')
                    ? 'text-[var(--color-red-400)]'
                    : 'text-[var(--difficulty-1)]'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      )}

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
