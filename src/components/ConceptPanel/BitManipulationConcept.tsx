import { motion } from 'framer-motion'
import type { ConceptStep } from '@/types'
import styles from './BitManipulationConcept.module.css'

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
    return <div className={styles.empty}>No binary data</div>
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
      <div className={`${styles.bitRow} ${isResult ? styles.resultRow : ''}`}>
        <div className={styles.label}>{label}</div>
        <div className={styles.decimal}>{value}</div>
        <span className={styles.equals}>=</span>
        <div className={styles.bits}>
          {binaryStr.split('').map((bit, i) => {
            const bitPosition = bits - 1 - i
            const isActive = activeBits.includes(bitPosition)
            const isHighlighted = highlightBits.includes(bitPosition)
            const isOne = bit === '1'

            return (
              <motion.div
                key={i}
                className={`${styles.bit} ${isOne ? styles.one : styles.zero} ${isActive ? styles.active : ''} ${isHighlighted ? styles.highlighted : ''} ${isResult ? styles.resultBit : ''}`}
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
    <div className={styles.container}>
      {/* Operator badge */}
      {operator && (
        <div className={styles.operatorBadge}>
          {getOperatorSymbol(operator)}
        </div>
      )}

      <div className={styles.visualization}>
        {/* Input numbers */}
        {numbers.map((num, i) => (
          <div key={i}>
            {renderBitRow(num.label, num.value, false, activeBits)}
            {i < numbers.length - 1 && operator && (
              <div className={styles.operatorRow}>
                <span className={styles.operatorSymbol}>{operator}</span>
              </div>
            )}
          </div>
        ))}

        {/* Divider before result */}
        {result !== undefined && (
          <div className={styles.divider} />
        )}

        {/* Result */}
        {result !== undefined && renderBitRow('result', result, true, activeBits)}
      </div>

      {/* Bit position labels */}
      <div className={styles.bitPositions}>
        <div className={styles.bitPositionsSpacer} />
        <div className={styles.bitPositionsRow}>
          {Array.from({ length: bits }, (_, i) => bits - 1 - i).map((pos) => (
            <span
              key={pos}
              className={`${styles.bitPosition} ${activeBits.includes(pos) ? styles.activeBitPos : ''}`}
            >
              {pos}
            </span>
          ))}
        </div>
      </div>

      {/* Annotations */}
      {visual.annotations && visual.annotations.length > 0 && (
        <div className={styles.annotations}>
          {visual.annotations.map((text, i) => (
            <span key={i} className={styles.annotation}>
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Result display */}
      {visual.result !== undefined && (
        <motion.div
          className={styles.resultDisplay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {String(visual.result)}
        </motion.div>
      )}
    </div>
  )
}
