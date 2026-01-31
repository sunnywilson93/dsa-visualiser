import { motion } from 'framer-motion'
import type { ConceptStep, ConceptType } from '@/types'

interface TwoPointersConceptProps {
  step: ConceptStep
  type: ConceptType
}

export function TwoPointersConcept({ step, type }: TwoPointersConceptProps) {
  const { visual } = step
  const array = visual.array || []
  const pointers = visual.pointers || {}
  const highlights = visual.highlights || []
  const annotations = visual.annotations || []

  const getPointerStyle = (name: string): 'left' | 'right' | 'slow' | 'fast' | 'mid' | 'default' => {
    const lowerName = name.toLowerCase()
    if (lowerName === 'left' || lowerName === 'l' || lowerName === 'low') return 'left'
    if (lowerName === 'right' || lowerName === 'r' || lowerName === 'high') return 'right'
    if (lowerName === 'slow' || lowerName === 'i') return 'slow'
    if (lowerName === 'fast' || lowerName === 'j') return 'fast'
    if (lowerName === 'mid' || lowerName === 'm') return 'mid'
    return 'default'
  }

  const getPointerColor = (style: string): string => {
    switch (style) {
      case 'left':
      case 'slow':
        return 'bg-[var(--color-accent-blue)]'
      case 'right':
      case 'fast':
        return 'bg-[var(--color-accent-purple)]'
      case 'mid':
        return 'bg-[var(--color-accent-green)]'
      default:
        return 'bg-[var(--color-accent-cyan)]'
    }
  }

  const getPointerBorderColor = (style: string): string => {
    switch (style) {
      case 'left':
      case 'slow':
        return 'border-t-[var(--color-accent-blue)]'
      case 'right':
      case 'fast':
        return 'border-t-[var(--color-accent-purple)]'
      case 'mid':
        return 'border-t-[var(--color-accent-green)]'
      default:
        return 'border-t-[var(--color-accent-cyan)]'
    }
  }

  // Group pointers by index for rendering
  const pointersByIndex: Record<number, string[]> = {}
  Object.entries(pointers).forEach(([name, index]) => {
    if (!pointersByIndex[index]) pointersByIndex[index] = []
    pointersByIndex[index].push(name)
  })

  return (
    <div className="flex flex-col items-center gap-2 w-full text-white">
      {/* Annotations above array */}
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

      {/* Array visualization */}
      <div className="flex items-end justify-center flex-wrap gap-[3px] p-2 max-w-full">
        {array.map((value, index) => {
          const pointersAtIndex = pointersByIndex[index] || []
          const isHighlighted = highlights.includes(index)
          const hasPointer = pointersAtIndex.length > 0

          return (
            <div key={index} className="flex flex-col items-center gap-0.5">
              {/* Pointers above */}
              <div className="h-7 flex flex-col items-center justify-end gap-0.5">
                {pointersAtIndex.map((name) => {
                  const style = getPointerStyle(name)
                  const colorClass = getPointerColor(style)
                  const borderColorClass = getPointerBorderColor(style)
                  return (
                    <motion.div
                      key={name}
                      className={`
                        relative text-[9px] font-semibold font-mono text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-[0_0_8px_rgba(255,255,255,0.2)]
                        ${colorClass}
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
                          ${borderColorClass}
                        `} 
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Array element */}
              <motion.div
                className={`
                  flex items-center justify-center min-w-7 h-7 px-1 rounded-md transition-all duration-150
                  ${isHighlighted 
                    ? 'bg-blue-400/20 border-2 border-blue-400' 
                    : 'bg-[var(--color-bg-elevated)] border-2 border-white/15'
                  }
                  ${hasPointer ? 'border-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.25)]' : ''}
                `}
                animate={{
                  scale: isHighlighted ? 1.05 : 1,
                  boxShadow: isHighlighted
                    ? '0 0 12px rgba(96, 165, 250, 0.5)'
                    : '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="text-[13px] font-semibold font-mono text-white">{value}</span>
              </motion.div>

              {/* Index below */}
              <span className="text-[9px] font-mono text-gray-500">{index}</span>
            </div>
          )
        })}
      </div>

      {/* Pointer direction indicator for converging pattern */}
      {type === 'two-pointers-converge' && Object.keys(pointers).length >= 2 && (
        <div className="flex items-center gap-1 mt-1">
          <motion.span
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent-blue)', filter: 'drop-shadow(0 0 4px currentColor)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">converge</span>
          <motion.span
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent-purple)', filter: 'drop-shadow(0 0 4px currentColor)' }}
            animate={{ x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ←
          </motion.span>
        </div>
      )}

      {/* Same direction indicator */}
      {type === 'two-pointers-same-dir' && Object.keys(pointers).length >= 2 && (
        <div className="flex items-center gap-1 mt-1">
          <motion.span
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent-blue)', filter: 'drop-shadow(0 0 4px currentColor)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          >
            →
          </motion.span>
          <motion.span
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent-purple)', filter: 'drop-shadow(0 0 4px currentColor)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide ml-1">same direction</span>
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
