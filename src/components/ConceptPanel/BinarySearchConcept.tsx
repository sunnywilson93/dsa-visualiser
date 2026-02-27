import { motion } from 'framer-motion'
import type { ConceptStep } from '@/types'

interface BinarySearchConceptProps {
  step: ConceptStep
}

export function BinarySearchConcept({ step }: BinarySearchConceptProps) {
  const { visual } = step
  const array = visual.array || []
  const pointers = visual.pointers || {}
  const highlights = visual.highlights || []
  const annotations = visual.annotations || []

  const left = pointers.left ?? -1
  const right = pointers.right ?? -1
  const mid = pointers.mid ?? -1
  const hasRange = left >= 0 && right >= 0

  const isInSearchSpace = (index: number): boolean =>
    hasRange && index >= left && index <= right

  const isEliminated = (index: number): boolean =>
    hasRange && (index < left || index > right)

  const getPointerColor = (name: string): string => {
    switch (name) {
      case 'L': return 'bg-[var(--color-accent-blue)]'
      case 'R': return 'bg-[var(--color-accent-purple)]'
      case 'M': return 'bg-[var(--color-accent-green)]'
      default: return 'bg-gray-500'
    }
  }

  const getArrowColor = (name: string): string => {
    switch (name) {
      case 'L': return 'border-t-[var(--color-accent-blue)]'
      case 'R': return 'border-t-[var(--color-accent-purple)]'
      case 'M': return 'border-t-[var(--color-accent-green)]'
      default: return 'border-t-gray-500'
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full text-white">
      {annotations.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {annotations.map((text, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-[var(--color-brand-light)] px-2.5 py-[3px] bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-25)] rounded-full"
            >
              {text}
            </span>
          ))}
        </div>
      )}

      <div className="relative flex flex-col items-center w-full">
        {/* Pointer labels above array */}
        <div className="flex items-end justify-center flex-wrap gap-[3px] px-2 mb-0.5 max-w-full">
          {array.map((_, index) => {
            const pointerNames: string[] = []
            if (pointers.left === index) pointerNames.push('L')
            if (pointers.mid === index) pointerNames.push('M')
            if (pointers.right === index) pointerNames.push('R')

            return (
              <div key={index} className="flex flex-col items-center min-w-7 px-1">
                <div className="h-6 flex flex-row items-end justify-center gap-0.5">
                  {pointerNames.map((name) => (
                    <motion.div
                      key={name}
                      className={`
                        relative text-[9px] font-semibold font-mono text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-[0_0_8px_rgba(255,255,255,0.2)]
                        ${getPointerColor(name)}
                      `}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      {name}
                      <div
                        className={`
                          absolute -bottom-1.5 left-1/2 -translate-x-1/2
                          w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent
                          ${getArrowColor(name)}
                        `}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Array cells */}
        <div className="flex items-end justify-center flex-wrap gap-[3px] p-2 max-w-full">
          {array.map((value, index) => {
            const inSpace = isInSearchSpace(index)
            const eliminated = isEliminated(index)
            const isHighlighted = highlights.includes(index)
            const isMid = mid === index

            return (
              <div key={index} className="flex flex-col items-center gap-0.5">
                <motion.div
                  className={`
                    flex items-center justify-center min-w-7 h-7 px-1 rounded-md transition-all duration-150
                    ${isHighlighted
                      ? 'bg-emerald-400/25 border-2 border-emerald-400'
                      : isMid
                        ? 'bg-[var(--color-accent-green)]/20 border-2 border-[var(--color-accent-green)]/70'
                        : eliminated
                          ? 'bg-white-3 border-2 border-white-8'
                          : inSpace
                            ? 'bg-[var(--color-brand-primary-15)] border-2 border-[var(--color-brand-primary-50)]'
                            : 'bg-[var(--color-bg-elevated)] border-2 border-white-15'
                    }
                  `}
                  animate={{
                    scale: isHighlighted ? 1.08 : isMid ? 1.05 : 1,
                    opacity: eliminated ? 0.35 : 1,
                    boxShadow: isHighlighted
                      ? '0 0 12px rgba(52, 211, 153, 0.5)'
                      : isMid
                        ? '0 0 10px rgba(74, 222, 128, 0.3)'
                        : '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className={`text-[13px] font-semibold font-mono ${eliminated ? 'text-gray-600 line-through' : 'text-white'}`}>
                    {value}
                  </span>
                </motion.div>

                <span className={`text-[9px] font-mono ${eliminated ? 'text-gray-700' : 'text-gray-500'}`}>{index}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search space indicator */}
      {hasRange && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            Search space: [{left}..{right}]
          </span>
          {mid >= 0 && (
            <span className="text-[10px] font-mono text-[var(--color-accent-green)]">
              mid={mid}
            </span>
          )}
        </div>
      )}

      {visual.result !== undefined && (
        <motion.div
          className="text-base font-medium text-gray-400 mt-2 px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded-md shadow-[0_0_8px_rgba(16,185,129,0.2)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Result: <span className="font-mono font-semibold text-emerald-400">{String(visual.result)}</span>
        </motion.div>
      )}
    </div>
  )
}
