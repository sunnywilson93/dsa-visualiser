'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Step {
  label: string
  code: string
  output: string[]
}

interface Tab {
  id: string
  label: string
  title: string
  steps: Step[]
}

const tabs: Tab[] = [
  {
    id: 'for-in-of',
    label: 'for...in vs for...of',
    title: 'for...in vs for...of',
    steps: [
      { label: 'Setup', code: 'const obj = { a: 1, b: 2 };\nconst arr = [10, 20, 30];', output: [] },
      { label: 'for...in on object', code: 'for (let key in obj)\n  console.log(key);', output: ['"a"', '"b"'] },
      { label: 'for...in on array', code: 'for (let idx in arr)\n  console.log(idx);', output: ['"0"', '"1"', '"2"  // string indices!'] },
      { label: 'for...of on array', code: 'for (let val of arr)\n  console.log(val);', output: ['10', '20', '30  // actual values'] },
      { label: 'for...of on object', code: 'for (let v of obj)\n  console.log(v);', output: ['TypeError: obj is not iterable'] },
    ],
  },
  {
    id: 'iterators',
    label: 'Iterators',
    title: 'The Iterator Protocol',
    steps: [
      { label: 'Get iterator', code: 'const arr = [10, 20];\nconst it = arr[Symbol.iterator]();', output: ['Iterator { }'] },
      { label: 'First next()', code: 'it.next();', output: ['{ value: 10, done: false }'] },
      { label: 'Second next()', code: 'it.next();', output: ['{ value: 20, done: false }'] },
      { label: 'Exhausted', code: 'it.next();', output: ['{ value: undefined, done: true }'] },
      { label: 'Custom iterator', code: 'const range = {\n  *[Symbol.iterator]() {\n    yield 1; yield 2; yield 3;\n  }\n};', output: ['for (let n of range)', '  // 1, 2, 3'] },
    ],
  },
  {
    id: 'higher-order',
    label: 'Higher-Order',
    title: 'map / filter / reduce Pipeline',
    steps: [
      { label: 'Input', code: 'const nums = [1, 2, 3, 4, 5];', output: ['[1, 2, 3, 4, 5]'] },
      { label: 'filter', code: 'nums.filter(n => n > 2);', output: ['[3, 4, 5]  // keep matches'] },
      { label: 'map', code: '.map(n => n * 10);', output: ['[30, 40, 50]  // transform'] },
      { label: 'reduce', code: '.reduce((sum, n) => sum + n, 0);', output: ['120  // accumulate to single value'] },
      { label: 'Chained', code: 'nums\n  .filter(n => n > 2)\n  .map(n => n * 10)\n  .reduce((s, n) => s + n, 0);', output: ['120'] },
    ],
  },
  {
    id: 'async-iter',
    label: 'Async Iteration',
    title: 'for await...of',
    steps: [
      { label: 'Async source', code: 'async function* fetchPages() {\n  yield fetch("/page/1");\n  yield fetch("/page/2");\n}', output: ['AsyncGenerator { }'] },
      { label: 'Iteration start', code: 'for await (let resp of fetchPages()) {', output: ['Awaiting page 1...'] },
      { label: 'First yield', code: '  console.log(resp.status);', output: ['200  // page 1 resolved'] },
      { label: 'Second yield', code: '  console.log(resp.status);', output: ['200  // page 2 resolved'] },
      { label: 'Done', code: '}', output: ['Loop complete', 'Each yield was awaited in order'] },
    ],
  },
]

interface IterationVizProps {
  mode?: 'for-in-vs-for-of' | 'iterators-generators' | 'async-iterators' | 'higher-order-functions'
}

const modeToTab: Record<string, string> = {
  'for-in-vs-for-of': 'for-in-of',
  'iterators-generators': 'iterators',
  'async-iterators': 'async-iter',
  'higher-order-functions': 'higher-order',
}

export function IterationViz({ mode }: IterationVizProps) {
  const initialTab = mode ? (modeToTab[mode] ?? 'for-in-of') : 'for-in-of'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [step, setStep] = useState(0)

  const current = tabs.find(t => t.id === activeTab) ?? tabs[0]
  const totalSteps = current.steps.length

  const switchTab = (id: string): void => { setActiveTab(id); setStep(0) }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col gap-3"
        >
          <div className="text-xs text-gray-500 text-center uppercase tracking-wide">
            Step {step + 1}: {current.steps[step].label}
          </div>

          <div className="rounded-xl border border-white-10 bg-black-30 p-4">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap m-0">{current.steps[step].code}</pre>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3">
            <div className="text-xs text-blue-400 mb-1.5 uppercase tracking-wide">Output</div>
            <div className="flex flex-col gap-1">
              {current.steps[step].output.length > 0 ? (
                current.steps[step].output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`font-mono text-sm ${
                      line.startsWith('TypeError') ? 'text-red-400' : 'text-blue-300'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))
              ) : (
                <span className="text-gray-600 text-sm">No output yet</span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2 justify-center items-center">
        <button
          className="px-4 py-2 text-xs bg-white-5 border border-white-10 rounded-lg text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white-10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500 px-4">{step + 1} / {totalSteps}</span>
        <button
          className="px-4 py-2 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
          disabled={step === totalSteps - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
