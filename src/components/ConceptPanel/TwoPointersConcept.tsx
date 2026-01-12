import { motion } from 'framer-motion'
import type { ConceptStep, ConceptType } from '@/types'
import styles from './TwoPointersConcept.module.css'

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

  const getPointerColor = (style: string) => {
    switch (style) {
      case 'left':
      case 'slow':
        return 'var(--accent-blue)'
      case 'right':
      case 'fast':
        return 'var(--accent-purple)'
      case 'mid':
        return 'var(--accent-green)'
      default:
        return 'var(--accent-cyan)'
    }
  }

  // Group pointers by index for rendering
  const pointersByIndex: Record<number, string[]> = {}
  Object.entries(pointers).forEach(([name, index]) => {
    if (!pointersByIndex[index]) pointersByIndex[index] = []
    pointersByIndex[index].push(name)
  })

  return (
    <div className={styles.container}>
      {/* Annotations above array */}
      {annotations.length > 0 && (
        <div className={styles.annotations}>
          {annotations.map((text, i) => (
            <span key={i} className={styles.annotation}>
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Array visualization */}
      <div className={styles.arrayContainer}>
        {array.map((value, index) => {
          const pointersAtIndex = pointersByIndex[index] || []
          const isHighlighted = highlights.includes(index)
          const hasPointer = pointersAtIndex.length > 0

          return (
            <div key={index} className={styles.elementWrapper}>
              {/* Pointers above */}
              <div className={styles.pointerArea}>
                {pointersAtIndex.map((name) => {
                  const style = getPointerStyle(name)
                  const color = getPointerColor(style)
                  return (
                    <motion.div
                      key={name}
                      className={styles.pointer}
                      style={{ backgroundColor: color }}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      {name}
                      <div className={styles.pointerArrow} style={{ borderTopColor: color }} />
                    </motion.div>
                  )
                })}
              </div>

              {/* Array element */}
              <motion.div
                className={`${styles.element} ${isHighlighted ? styles.highlighted : ''} ${hasPointer ? styles.hasPointer : ''}`}
                animate={{
                  scale: isHighlighted ? 1.1 : 1,
                  boxShadow: isHighlighted
                    ? '0 0 12px rgba(96, 165, 250, 0.5)'
                    : '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className={styles.value}>{value}</span>
              </motion.div>

              {/* Index below */}
              <span className={styles.index}>{index}</span>
            </div>
          )
        })}
      </div>

      {/* Pointer direction indicator for converging pattern */}
      {type === 'two-pointers-converge' && Object.keys(pointers).length >= 2 && (
        <div className={styles.directionIndicator}>
          <motion.span
            className={styles.arrow}
            style={{ color: 'var(--accent-blue)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          <span className={styles.directionText}>converge</span>
          <motion.span
            className={styles.arrow}
            style={{ color: 'var(--accent-purple)' }}
            animate={{ x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ←
          </motion.span>
        </div>
      )}

      {/* Same direction indicator */}
      {type === 'two-pointers-same-dir' && Object.keys(pointers).length >= 2 && (
        <div className={styles.directionIndicator}>
          <motion.span
            className={styles.arrow}
            style={{ color: 'var(--accent-blue)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          >
            →
          </motion.span>
          <motion.span
            className={styles.arrow}
            style={{ color: 'var(--accent-purple)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          <span className={styles.directionText}>same direction</span>
        </div>
      )}

      {/* Result display */}
      {visual.result !== undefined && (
        <motion.div
          className={styles.result}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Result: <span className={styles.resultValue}>{String(visual.result)}</span>
        </motion.div>
      )}
    </div>
  )
}
