import { motion } from 'framer-motion'
import type { ConceptStep } from '@/types'

interface SlidingWindowConceptProps {
  step: ConceptStep
}

export function SlidingWindowConcept({ step }: SlidingWindowConceptProps) {
  const { visual } = step
  const array = visual.array || []
  const pointers = visual.pointers || {}
  const highlights = visual.highlights || []
  const annotations = visual.annotations || []

  const left = pointers.left ?? -1
  const right = pointers.right ?? -1
  const hasWindow = left >= 0 && right >= 0 && left <= right

  const isInWindow = (index: number) =>
    hasWindow && index >= left && index <= right

  return (
    <div className="flex flex-col items-center gap-2 w-full text-white">
      {/* Annotations (window state: sum, count, etc.) */}
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

      {/* Array with window bracket */}
      <div className="relative flex flex-col items-center w-full">
        {/* Pointer labels above array */}
        <div className="flex items-end justify-center flex-wrap gap-[3px] px-2 mb-0.5 max-w-full">
          {array.map((_, index) => {
            const pointerNames: string[] = []
            if (pointers.left === index) pointerNames.push('L')
            if (pointers.right === index) pointerNames.push('R')

            return (
              <div key={index} className="flex flex-col items-center min-w-7 px-1">
                <div className="h-6 flex flex-col items-center justify-end gap-0.5">
                  {pointerNames.map((name) => (
                    <motion.div
                      key={name}
                      className={`
                        relative text-[9px] font-semibold font-mono text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-[0_0_8px_rgba(255,255,255,0.2)]
                        ${name === 'L' ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-accent-purple)]'}
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
                          ${name === 'L' ? 'border-t-[var(--color-accent-blue)]' : 'border-t-[var(--color-accent-purple)]'}
                        `}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Window bracket top */}
        {hasWindow && (
          <motion.div
            className="absolute flex items-stretch pointer-events-none"
            style={{
              left: `calc(50% - ${(array.length * 31) / 2}px + ${left * 31}px)`,
              width: `${(right - left + 1) * 31}px`,
              top: '26px',
              height: 'calc(100% - 38px)',
            }}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-md bg-cyan-400/8" />
          </motion.div>
        )}

        {/* Array cells */}
        <div className="flex items-end justify-center flex-wrap gap-[3px] p-2 max-w-full">
          {array.map((value, index) => {
            const inWindow = isInWindow(index)
            const isHighlighted = highlights.includes(index)

            return (
              <div key={index} className="flex flex-col items-center gap-0.5">
                <motion.div
                  className={`
                    flex items-center justify-center min-w-7 h-7 px-1 rounded-md transition-all duration-150
                    ${isHighlighted
                      ? 'bg-emerald-400/25 border-2 border-emerald-400'
                      : inWindow
                        ? 'bg-cyan-400/15 border-2 border-cyan-400/60'
                        : 'bg-[var(--color-bg-elevated)] border-2 border-white-15'
                    }
                  `}
                  animate={{
                    scale: isHighlighted ? 1.08 : inWindow ? 1.02 : 1,
                    boxShadow: isHighlighted
                      ? '0 0 12px rgba(52, 211, 153, 0.5)'
                      : inWindow
                        ? '0 0 8px rgba(34, 211, 238, 0.2)'
                        : '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className={`text-[13px] font-semibold font-mono ${inWindow ? 'text-white' : 'text-gray-400'}`}>
                    {value}
                  </span>
                </motion.div>

                <span className="text-[9px] font-mono text-gray-500">{index}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Window direction indicator */}
      {hasWindow && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <motion.span
            className="text-sm font-bold font-mono"
            style={{ color: 'var(--color-accent-cyan)', filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            [
          </motion.span>
          <motion.span
            className="text-xs font-mono"
            style={{ color: 'var(--color-accent-cyan)' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ———
          </motion.span>
          <motion.span
            className="text-sm font-bold font-mono"
            style={{ color: 'var(--color-accent-cyan)', filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            ]
          </motion.span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide ml-1">window</span>
        </div>
      )}

      {/* Result display */}
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
