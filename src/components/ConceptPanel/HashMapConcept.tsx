'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ConceptStep } from '@/types'

interface HashMapConceptProps {
  step: ConceptStep
}

export function HashMapConcept({ step }: HashMapConceptProps) {
  const { visual } = step
  const array = visual.array || []
  const highlights = visual.highlights || []
  const annotations = visual.annotations || []
  const hashMap = visual.hashMap || { entries: [] }
  const currentIndex = hashMap.currentIndex
  const secondArray = hashMap.secondArray
  const secondArrayIndex = hashMap.secondArrayIndex
  const phase = hashMap.phase

  // Determine which array is active based on phase
  const showBothArrays = secondArray && secondArray.length > 0
  const isCheckPhase = phase === 'check'

  return (
    <div className="flex flex-col items-center gap-4 w-full text-white">
      {/* Annotations */}
      {annotations.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {annotations.map((text, i) => (
            <span 
              key={i} 
              className="text-xs font-medium text-[var(--color-brand-light)] px-2.5 py-[3px] bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-25)] rounded-full"
            >
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Two arrays side by side for anagram-like problems */}
      {showBothArrays ? (
        <div className="flex flex-wrap gap-4 justify-center w-full">
          {/* First array (s) */}
          <div className="flex flex-col items-center gap-1">
            <span className={`text-2xs font-semibold uppercase tracking-wide ${!isCheckPhase ? 'text-blue-400' : 'text-gray-500'}`}>
              String s {!isCheckPhase && '(building)'}
            </span>
            <div className="flex flex-wrap items-end justify-center gap-1">
              {array.map((value, index) => {
                const isCurrent = !isCheckPhase && currentIndex === index
                return (
                  <div key={index} className="flex flex-col items-center gap-0.5">
                    {isCurrent ? (
                      <motion.div
                        className="relative text-2xs font-semibold font-mono text-white px-2 py-0.5 bg-blue-400 rounded-sm shadow-[var(--glow-md)_var(--color-accent-blue-40)]"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        i
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-400" />
                      </motion.div>
                    ) : (
                      <div className="h-8" />
                    )}
                    <motion.div
                      className={`
                        flex items-center justify-center min-w-9 h-9 px-2 bg-[var(--color-bg-elevated)] border-2 rounded-md
                        ${isCurrent ? 'border-blue-400 bg-blue-400/20 shadow-[var(--glow-md)_var(--color-accent-blue-30)]' : 'border-white-15'}
                        ${isCheckPhase ? 'opacity-40' : ''}
                      `}
                    >
                      <span className="text-base font-semibold font-mono text-white">{value}</span>
                    </motion.div>
                    <span className="text-2xs font-mono text-gray-600">{index}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Second array (t) */}
          <div className="flex flex-col items-center gap-1">
            <span className={`text-2xs font-semibold uppercase tracking-wide ${isCheckPhase ? 'text-blue-400' : 'text-gray-500'}`}>
              String t {isCheckPhase && '(checking)'}
            </span>
            <div className="flex flex-wrap items-end justify-center gap-1">
              {secondArray.map((value, index) => {
                const isCurrent = isCheckPhase && secondArrayIndex === index
                const isHighlighted = highlights.includes(index) && isCheckPhase
                return (
                  <div key={index} className="flex flex-col items-center gap-0.5">
                    {isCurrent ? (
                      <motion.div
                        className="relative text-2xs font-semibold font-mono text-white px-2 py-0.5 bg-[var(--color-brand-primary)] rounded-sm shadow-[var(--glow-md)_var(--color-brand-primary-40)]"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        j
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--color-brand-primary)]" />
                      </motion.div>
                    ) : (
                      <div className="h-8" />
                    )}
                    <motion.div
                      className={`
                        flex items-center justify-center min-w-9 h-9 px-2 bg-[var(--color-bg-elevated)] border-2 rounded-md
                        ${isCurrent ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary-15)] shadow-[var(--glow-md)_var(--color-brand-primary-30)]' : 'border-white-15'}
                        ${!isCheckPhase ? 'opacity-40' : ''}
                        ${isHighlighted ? 'bg-emerald-500/20 border-emerald-400 shadow-[var(--glow-md)_var(--color-emerald-30)]' : ''}
                      `}
                      animate={{
                        scale: isHighlighted ? 1.1 : 1,
                      }}
                    >
                      <span className="text-base font-semibold font-mono text-white">{value}</span>
                    </motion.div>
                    <span className="text-2xs font-mono text-gray-600">{index}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Single array visualization */
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xs font-semibold uppercase tracking-wide text-gray-500">Array</span>
          <div className="flex flex-wrap items-end justify-center gap-1">
            {array.map((value, index) => {
              const isHighlighted = highlights.includes(index)
              const isCurrent = currentIndex === index

              return (
                <div key={index} className="flex flex-col items-center gap-0.5">
                  {isCurrent ? (
                    <motion.div
                      className="relative text-2xs font-semibold font-mono text-white px-2 py-0.5 bg-blue-400 rounded-sm shadow-[var(--glow-md)_var(--color-accent-blue-40)]"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      i
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-400" />
                    </motion.div>
                  ) : (
                    <div className="h-8" />
                  )}

                  <motion.div
                    className={`
                      flex items-center justify-center min-w-9 h-9 px-2 bg-[var(--color-bg-elevated)] border-2 rounded-md transition-all duration-150
                      ${isHighlighted ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)]' : 'border-white-15'}
                      ${isCurrent ? 'border-blue-400 bg-blue-400/20 shadow-[var(--glow-md)_var(--color-accent-blue-30)]' : ''}
                    `}
                    animate={{
                      scale: isHighlighted ? 1.1 : 1,
                      boxShadow: isHighlighted
                        ? '0 0 16px rgba(16, 185, 129, 0.6)'
                        : '0 1px 2px rgba(0, 0, 0, 0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="text-base font-semibold font-mono text-white">{value}</span>
                  </motion.div>

                  <span className="text-2xs font-mono text-gray-600">{index}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Hash Map visualization */}
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-2xs font-semibold uppercase tracking-wide text-gray-500">HashMap</span>
        <div className="flex justify-center w-full min-h-[50px]">
          {hashMap.entries.length === 0 ? (
            <div className="flex items-center justify-center px-4 py-2 bg-black-20 border border-dashed border-white-15 rounded-lg">
              <span className="text-xs text-gray-500 italic">Empty</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 justify-center">
              <AnimatePresence mode="popLayout">
                {hashMap.entries.map((entry) => (
                  <motion.div
                    key={`${entry.key}-${entry.value}`}
                    className={`
                      flex items-center gap-1 px-4 py-[5px] bg-[var(--color-bg-elevated)] border rounded-md transition-all duration-150
                      ${entry.isNew ? 'bg-[var(--color-brand-primary-20)] border-[var(--color-brand-primary-50)] shadow-[var(--glow-md)_var(--color-brand-primary-30)]' : 'border-white-10'}
                      ${entry.isLookup ? 'bg-amber-500/20 border-amber-400/40 shadow-[var(--glow-md)_var(--color-amber-30)]' : ''}
                      ${entry.isDecrement ? 'bg-orange-500/30 border-orange-400/40 shadow-[var(--glow-md)_var(--color-accent-orange-30)]' : ''}
                    `}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, delay: entry.isNew ? 0.1 : 0 }}
                  >
                    <span className="text-sm font-semibold font-mono text-cyan-400">{entry.key}</span>
                    <span className="text-2xs text-gray-500">:</span>
                    <span className={`
                      text-sm font-medium font-mono
                      ${entry.isDecrement ? 'text-orange-400' : 'text-gray-400'}
                      ${entry.value === 0 ? 'text-emerald-400 font-bold' : ''}
                    `}
                    style={entry.value === 0 ? { textShadow: 'var(--glow-xs) var(--color-emerald-30)' } : {}}
                    >
                      {entry.value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Lookup status */}
      {hashMap.lookupKey !== undefined && (
        <motion.div
          className="flex items-center gap-2 px-4 py-1 bg-black-20 border border-white-10 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs text-gray-500">Looking for:</span>
          <span className="text-base font-semibold font-mono text-amber-400 px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-sm">
            {hashMap.lookupKey}
          </span>
          {hashMap.lookupResult === 'found' && (
            <motion.span
              className="text-xs font-semibold text-emerald-400 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              Found!
            </motion.span>
          )}
          {hashMap.lookupResult === 'not-found' && (
            <span className="text-xs text-gray-500">Not in map</span>
          )}
        </motion.div>
      )}

      {/* Result display */}
      {visual.result !== undefined && (
        <motion.div
          className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/50 rounded-lg shadow-[var(--glow-lg)_var(--color-emerald-20)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-base font-semibold font-mono text-emerald-400">{String(visual.result)}</span>
        </motion.div>
      )}
    </div>
  )
}
