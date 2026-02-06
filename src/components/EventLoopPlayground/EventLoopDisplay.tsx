'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import type { EventLoopStep } from '@/engine/eventLoopAnalyzer'

interface EventLoopDisplayProps {
  step: EventLoopStep
}

const webApis = [
  { name: 'fetch', highlight: false },
  { name: 'setTimeout', highlight: true },
  { name: 'URL', highlight: false },
  { name: 'localStorage', highlight: false },
  { name: 'XMLHttpRequest', highlight: false },
  { name: 'document', highlight: false },
]

export function EventLoopDisplay({ step }: EventLoopDisplayProps) {
  const isSpinning = step.phase === 'micro' || step.phase === 'macro'

  const getEventLoopClass = () => {
    if (step.phase === 'idle') return 'text-gray-800'
    if (isSpinning)
      return 'text-sky-400 animate-spin drop-shadow-[0_0_6px_var(--color-sky-400-60)]'
    return 'text-sky-400'
  }

  const getPhaseLabel = () => {
    switch (step.phase) {
      case 'sync': return 'Executing sync code'
      case 'micro': return 'Draining microtasks'
      case 'macro': return 'Processing task queue'
      default: return 'Waiting...'
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>[style]]:--neon-start:initial [&>[style]]:--neon-end:initial"
        style={{
          gridTemplateAreas: `"callstack webapis" "eventloop taskqueue" "microtask microtask"`,
        }}
      >
        {/* Call Stack */}
        <div
          className="relative rounded-lg p-0.5 transition-all duration-300"
          style={{
            gridArea: 'callstack',
            background: step.callStack.length > 0
              ? 'var(--color-brand-primary-50)'
              : 'var(--color-border-primary)',
          }}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-tertiary rounded-b-md text-2xs font-semibold text-white whitespace-nowrap z-10">
            Call Stack
          </div>
          <div className="bg-page-secondary rounded-lg min-h-[100px] pt-5 px-2.5 pb-2.5 flex flex-col gap-1 min-h-[140px]">
            <AnimatePresence mode="popLayout">
              {step.callStack.length === 0 ? (
                <div className="flex items-center justify-center flex-1 text-gray-800 text-xs">
                  (empty)
                </div>
              ) : (
                step.callStack.slice().reverse().map((item, i) => (
                  <motion.div
                    key={item + i}
                    className="px-2.5 py-1.5 bg-brand-primary/15 border border-brand-primary/40 rounded font-mono text-2xs text-brand-light text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                  >
                    {item}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Web APIs */}
        <div
          className="relative rounded-lg p-0.5 transition-all duration-300"
          style={{
            gridArea: 'webapis',
            background: step.activeWebApi
              ? 'var(--color-brand-secondary-50)'
              : 'var(--color-border-primary)',
          }}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-tertiary rounded-b-md text-2xs font-semibold text-white whitespace-nowrap z-10">
            Web APIs
          </div>
          <div className="bg-page-secondary rounded-lg min-h-[100px] pt-5 px-2.5 pb-2.5 min-h-[140px]">
            <div className="flex flex-wrap gap-1.5">
              {webApis.map((api) => (
                <div
                  key={api.name}
                  className={`px-2.5 py-1.5 rounded font-mono text-xs transition-colors ${
                    step.activeWebApi === api.name
                      ? 'bg-brand-primary/20 border border-brand-primary/50 text-brand-light'
                      : 'text-gray-800 bg-white-3'
                  }`}
                >
                  {api.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Loop */}
        <div
          className="relative rounded-lg p-0.5 transition-all duration-300"
          style={{
            gridArea: 'eventloop',
            background: step.phase !== 'idle'
              ? 'var(--color-sky-50)'
              : 'var(--color-border-primary)',
          }}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-tertiary rounded-b-md text-2xs font-semibold text-white whitespace-nowrap z-10">
            Event Loop
          </div>
          <div className="bg-page-secondary rounded-lg min-h-[80px] pt-5 px-2.5 pb-2.5 flex flex-col items-center justify-center gap-2">
            <div className={getEventLoopClass()}>
              <RefreshCw size={24} />
            </div>
            <span className={`text-2xs font-medium ${step.phase !== 'idle' ? 'text-sky-400' : 'text-gray-800'}`}>
              {getPhaseLabel()}
            </span>
          </div>
        </div>

        {/* Task Queue (Macrotasks) */}
        <div
          className="relative rounded-lg p-0.5 transition-all duration-300"
          style={{
            gridArea: 'taskqueue',
            background: step.macroQueue.length > 0
              ? 'var(--color-amber-50)'
              : 'var(--color-border-primary)',
          }}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-tertiary rounded-b-md text-2xs font-semibold text-white whitespace-nowrap z-10">
            Task Queue
          </div>
          <div className="bg-page-secondary rounded-lg min-h-[80px] pt-5 px-2.5 pb-2.5">
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {step.macroQueue.length === 0 ? (
                  <div className="text-gray-800 text-xs text-center py-4">
                    (empty)
                  </div>
                ) : (
                  step.macroQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className="px-2.5 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded font-mono text-2xs text-white text-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Microtask Queue */}
        <div
          className="relative rounded-lg p-0.5 transition-all duration-300"
          style={{
            gridArea: 'microtask',
            background: step.microQueue.length > 0
              ? 'var(--color-emerald-50)'
              : 'var(--color-border-primary)',
          }}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 bg-tertiary rounded-b-md text-2xs font-semibold text-white whitespace-nowrap z-10">
            Microtask Queue
          </div>
          <div className="bg-page-secondary rounded-lg min-h-[60px] pt-5 px-2.5 pb-2.5">
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {step.microQueue.length === 0 ? (
                  <div className="text-gray-800 text-xs text-center py-4">
                    (empty)
                  </div>
                ) : (
                  step.microQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className="px-2.5 py-1.5 bg-emerald-20 border border-emerald-40 rounded font-mono text-2xs text-white text-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <motion.div
        key={step.output.length}
        className="bg-bg-page-secondary border border-white-10 border-l-2 border-l-emerald-40 rounded-lg p-2.5 flex-shrink-0"
        initial={step.output.length > 0 ? { backgroundColor: 'rgba(16, 185, 129, 0.08)' } : false}
        animate={{ backgroundColor: 'rgba(16, 185, 129, 0)' }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-200 bg-brand-primary-10 border border-brand-primary-30 rounded-full">
          Output
        </div>
        <div className="font-mono text-xs text-difficulty-1 min-h-[1.2rem]">
          {step.output.length === 0 ? (
            <span className="text-gray-800">—</span>
          ) : (
            step.output.map((item, i) => (
              <motion.div
                key={i}
                className="py-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
