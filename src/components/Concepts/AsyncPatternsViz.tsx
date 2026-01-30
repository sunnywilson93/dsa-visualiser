'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AsyncPatternsVizProps {
  mode?: 'callbacks' | 'promises' | 'async-await' | 'parallel'
}

export function AsyncPatternsViz({ mode = 'callbacks' }: AsyncPatternsVizProps) {
  const [step, setStep] = useState(0)

  const content = {
    callbacks: {
      title: 'Callback Pattern',
      steps: [
        { title: 'Initiate', desc: 'Call async function with callback', code: 'readFile("data.txt", callback)' },
        { title: 'Wait', desc: 'Operation executes asynchronously', code: '// ... waiting ...' },
        { title: 'Complete', desc: 'Callback executed with result', code: 'callback(null, data)' },
      ]
    },
    promises: {
      title: 'Promise Lifecycle',
      steps: [
        { title: 'Pending', desc: 'Promise created, operation in progress', code: 'new Promise((resolve, reject) => {...})' },
        { title: 'Fulfilled', desc: 'Operation succeeded', code: '.then(result => {...})' },
        { title: 'Rejected', desc: 'Operation failed', code: '.catch(error => {...})' },
      ]
    },
    'async-await': {
      title: 'Async/Await Sugar',
      compare: [
        { promise: 'fetch("/api").then(r => r.json())', async: 'const r = await fetch("/api")\nconst data = await r.json()' }
      ],
      explanation: 'Async/await is syntactic sugar over promises'
    },
    parallel: {
      title: 'Parallel Execution',
      steps: [
        { title: 'Start All', desc: 'All promises start simultaneously', code: 'Promise.all([p1, p2, p3])' },
        { title: 'Wait', desc: 'Wait for all to complete', code: '// ... all running ...' },
        { title: 'Results', desc: 'All results available together', code: '[result1, result2, result3]' },
      ]
    }
  }

  if (mode === 'async-await') {
    const current = content['async-await']
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <div className="text-xs text-yellow-500 mb-2 uppercase">Promises</div>
            <pre className="font-mono text-sm text-yellow-300">{current.compare[0].promise}</pre>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="text-xs text-blue-400 mb-2 uppercase">Async/Await</div>
            <pre className="font-mono text-sm text-blue-300">{current.compare[0].async}</pre>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm">{current.explanation}</p>
      </div>
    )
  }

  const current = content[mode]

  // For callbacks, promises, and parallel modes
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      
      {/* Progress Steps */}
      <div className="flex justify-between">
        {current.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 mx-1 p-3 rounded-lg text-left transition-all ${
              i === step 
                ? 'bg-blue-500/20 border border-blue-500/30' 
                : 'bg-black/30 border border-white/10 opacity-50'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">Step {i + 1}</div>
            <div className="font-semibold text-white">{s.title}</div>
          </button>
        ))}
      </div>

      {/* Active Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg bg-black/30 border border-white/10"
        >
          <div className="text-gray-300 mb-3">{current.steps[step].desc}</div>
          <pre className="font-mono text-sm text-blue-300 bg-black/50 p-3 rounded">
            {current.steps[step].code}
          </pre>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(Math.min(current.steps.length - 1, step + 1))}
          disabled={step === current.steps.length - 1}
          className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
