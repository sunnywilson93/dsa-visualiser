import { motion } from 'framer-motion'
import type { ConceptStep } from '@/types'

interface BitManipulationConceptProps {
  step: ConceptStep
}

function toBinary(num: number, bits: number = 8): string {
  if (num < 0) {
    // Two's complement for negative numbers
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

function getOperatorSymbol(op: string): string {
  switch (op) {
    case '&': return 'AND'
    case '|': return 'OR'
    case '^': return 'XOR'
    case '<<': return 'LEFT SHIFT'
    case '>>': return 'RIGHT SHIFT'
    case '~': return 'NOT'
    default: return op
  }
}

export function BitManipulationConcept({ step }: BitManipulationConceptProps) {
  const { visual } = step
  const binary = visual.binary

  if (!binary) {
    return <div className="text-gray-500 text-sm">No binary data</div>
  }

  const { numbers, operator, result, activeBits = [] } = binary
  const bits = 8

  const renderBitRow = (
    label: string,
    value: number,
    isResult: boolean = false,
    highlightBits: number[] = []
  ) => {
    const binaryStr = toBinary(value, bits)

    return (
      <div 
        className="grid items-center gap-2 font-mono"
        style={{ 
          gridTemplateColumns: '60px var(--spacing-3xl) var(--spacing-md) auto',
        }}
      >
        <div className="w-[60px] text-[10px] text-cyan-400 font-medium text-right overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </div>
        <div className="text-[11px] text-white font-semibold text-right">
          {value}
        </div>
        <span className="text-gray-500 text-[10px] text-center">=</span>
        <div className="flex gap-[2px]">
          {binaryStr.split('').map((bit, i) => {
            const bitPosition = bits - 1 - i
            const isActive = activeBits.includes(bitPosition)
            const isHighlighted = highlightBits.includes(bitPosition)
            const isOne = bit === '1'

            return (
              <motion.div
                key={i}
                className={`
                  flex items-center justify-center w-5 h-[22px] text-sm font-semibold rounded-sm transition-all duration-fast
                  ${isOne 
                    ? 'bg-blue-400/25 text-blue-400 border border-blue-400/50 shadow-[0_0_4px_rgba(96,165,250,0.2)]' 
                    : 'bg-[var(--color-bg-elevated)] text-gray-500 border border-white/10'
                  }
                  ${isActive ? 'scale-[1.08] shadow-[0_0_12px_rgba(96,165,250,0.5)]' : ''}
                  ${isHighlighted ? 'bg-amber-400/25 text-amber-400 border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.3)]' : ''}
                  ${isResult && isOne ? 'bg-emerald-500/35 text-emerald-400 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}
                  ${isResult && !isOne ? 'bg-emerald-500/25 text-emerald-400 border-emerald-500/50' : ''}
                `}
                initial={isResult ? { scale: 0.8, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: isResult ? i * 0.05 : 0 }}
              >
                {bit}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col items-center gap-2 w-full text-white"
      style={{ '--label-width': '60px', '--decimal-width': 'var(--spacing-3xl)', '--equals-width': 'var(--spacing-md)' } as React.CSSProperties}
    >
      {/* Operator badge */}
      {operator && (
        <div className="text-[10px] font-semibold px-2.5 py-[3px] bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white rounded-full tracking-wide shadow-[0_0_10px_var(--color-brand-primary-40)]">
          {getOperatorSymbol(operator)}
        </div>
      )}

      <div className="flex flex-col gap-1 p-2 bg-black/30 border border-dashed border-white/10 rounded-lg">
        {/* Input numbers */}
        {numbers.map((num, i) => (
          <div key={i}>
            {renderBitRow(num.label, num.value, false, activeBits)}
            {i < numbers.length - 1 && operator && (
              <div 
                className="grid items-center gap-2"
                style={{ 
                  gridTemplateColumns: '60px var(--spacing-3xl) var(--spacing-md) auto',
                }}
              >
                <span 
                  className="text-sm font-bold text-[var(--color-brand-light)] justify-self-end"
                  style={{ gridColumn: 2, textShadow: '0 0 6px rgba(196, 181, 253, 0.4)' }}
                >
                  {operator}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Divider before result */}
        {result !== undefined && (
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent my-1 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
        )}

        {/* Result */}
        {result !== undefined && (
          <div className="mt-1">
            {renderBitRow('result', result, true, activeBits)}
          </div>
        )}
      </div>

      {/* Bit position labels */}
      <div 
        className="grid items-center gap-2"
        style={{ 
          gridTemplateColumns: '60px var(--spacing-3xl) var(--spacing-md) auto',
        }}
      >
        <div className="col-span-3" />
        <div className="flex gap-[2px]">
          {Array.from({ length: bits }, (_, i) => bits - 1 - i).map((pos) => (
            <span
              key={pos}
              className={`
                w-5 text-center text-sm font-mono
                ${activeBits.includes(pos) ? 'text-blue-400 font-semibold' : 'text-gray-600'}
              `}
              style={activeBits.includes(pos) ? { textShadow: '0 0 4px rgba(96, 165, 250, 0.4)' } : {}}
            >
              {pos}
            </span>
          ))}
        </div>
      </div>

      {/* Annotations */}
      {visual.annotations && visual.annotations.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {visual.annotations.map((text, i) => (
            <span 
              key={i} 
              className="text-[10px] font-medium text-[var(--color-brand-light)] px-2.5 py-[3px] bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-25)] rounded-full"
            >
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Result display */}
      {visual.result !== undefined && (
        <motion.div
          className="text-base font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded-md shadow-[0_0_8px_rgba(16,185,129,0.2)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {String(visual.result)}
        </motion.div>
      )}
    </div>
  )
}
