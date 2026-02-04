'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ErrorHandlingVizProps {
  mode?: 'try-catch' | 'types' | 'custom'
}

const tryCatchContent = {
  title: 'Try/Catch/Finally Flow',
  steps: [
    { phase: 'try', desc: 'Code executes normally', color: 'blue' as const },
    { phase: 'error', desc: 'Error thrown!', color: 'red' as const },
    { phase: 'catch', desc: 'Error is caught and handled', color: 'yellow' as const },
    { phase: 'finally', desc: 'Cleanup always runs', color: 'green' as const },
  ]
}

const typesContent = {
  title: 'Error Type Hierarchy',
  types: [
    { name: 'Error', desc: 'Base error type', color: 'gray' },
    { name: 'TypeError', desc: 'Wrong type operation', color: 'red' },
    { name: 'ReferenceError', desc: 'Undefined variable', color: 'orange' },
    { name: 'SyntaxError', desc: 'Invalid syntax', color: 'yellow' },
    { name: 'RangeError', desc: 'Number out of range', color: 'purple' },
  ]
}

const customContent = {
  title: 'Custom Error Class',
  code: `class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

throw new ValidationError(
  "Invalid email", 
  "email"
);`,
  fields: ['name: "ValidationError"', 'message: "Invalid email"', 'field: "email"']
}

export function ErrorHandlingViz({ mode = 'try-catch' }: ErrorHandlingVizProps) {
  const [step, setStep] = useState(0)

  if (mode === 'try-catch') {
    const s = tryCatchContent.steps[step]
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-white">{tryCatchContent.title}</h3>
        
        {/* Flow Visualization */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {tryCatchContent.steps.map((st, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                animate={{ 
                  scale: i === step ? 1.1 : 1,
                  opacity: i <= step ? 1 : 0.3
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold ${
                  st.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  st.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  st.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}
              >
                {st.phase}
              </motion.div>
              {i < tryCatchContent.steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? 'bg-green-500/50' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Description */}
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-300"
        >
          {s.desc}
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setStep(Math.min(tryCatchContent.steps.length - 1, step + 1))}
            disabled={step === tryCatchContent.steps.length - 1}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'types') {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-white">{typesContent.title}</h3>
        <div className="space-y-2">
          {typesContent.types.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10"
            >
              <div className="w-3 h-3 rounded-full" style={{ 
                backgroundColor: t.color === 'gray' ? '#6b7280' : 
                  t.color === 'purple' ? 'var(--color-purple-500)' : 
                  t.color === 'orange' ? '#f97316' :
                  t.color === 'yellow' ? '#eab308' : 'var(--color-red-500)'
              }} />
              <span className="font-mono text-sm font-semibold text-white w-32">{t.name}</span>
              <span className="text-sm text-gray-400">{t.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // custom mode
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{customContent.title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <pre className="p-4 rounded-lg bg-black/30 border border-white/10 font-mono text-sm text-gray-300 whitespace-pre-wrap">
          {customContent.code}
        </pre>
        
        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <div className="text-xs text-blue-400 mb-3 uppercase tracking-wide">Error Instance</div>
          <div className="space-y-2">
            {customContent.fields.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="font-mono text-sm text-blue-300"
              >
                {f}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
