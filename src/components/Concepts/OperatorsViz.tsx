import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './OperatorsViz.module.css'

type Tab = 'arithmetic' | 'comparison' | 'logical'

interface Operation {
  expression: string
  result: string
  explanation: string
}

const arithmeticOps: Operation[] = [
  { expression: '10 + 3', result: '13', explanation: 'Addition' },
  { expression: '10 - 3', result: '7', explanation: 'Subtraction' },
  { expression: '10 * 3', result: '30', explanation: 'Multiplication' },
  { expression: '10 / 3', result: '3.333...', explanation: 'Division' },
  { expression: '10 % 3', result: '1', explanation: 'Remainder (modulo)' },
  { expression: '10 ** 3', result: '1000', explanation: 'Exponentiation' },
]

const comparisonOps: Operation[] = [
  { expression: '"5" == 5', result: 'true', explanation: 'Loose equality (coerces types)' },
  { expression: '"5" === 5', result: 'false', explanation: 'Strict equality (no coercion)' },
  { expression: '0 == false', result: 'true', explanation: 'Both become 0' },
  { expression: '0 === false', result: 'false', explanation: 'Different types' },
  { expression: 'null == undefined', result: 'true', explanation: 'Special loose equality case' },
  { expression: 'null === undefined', result: 'false', explanation: 'Different types' },
]

const logicalOps: Operation[] = [
  { expression: 'true && "hello"', result: '"hello"', explanation: '&& returns last truthy or first falsy' },
  { expression: 'false && "hello"', result: 'false', explanation: 'Short-circuits at false' },
  { expression: 'false || "hello"', result: '"hello"', explanation: '|| returns first truthy or last falsy' },
  { expression: '"" || "default"', result: '"default"', explanation: 'Empty string is falsy' },
  { expression: 'null ?? "default"', result: '"default"', explanation: '?? only checks null/undefined' },
  { expression: '0 ?? "default"', result: '0', explanation: '0 is NOT null/undefined' },
]

export function OperatorsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('arithmetic')
  const [selectedOp, setSelectedOp] = useState(0)

  const getOps = () => {
    switch (activeTab) {
      case 'arithmetic': return arithmeticOps
      case 'comparison': return comparisonOps
      case 'logical': return logicalOps
    }
  }

  const ops = getOps()

  return (
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'arithmetic' ? styles.active : ''}`}
          onClick={() => { setActiveTab('arithmetic'); setSelectedOp(0) }}
        >
          Arithmetic
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'comparison' ? styles.active : ''}`}
          onClick={() => { setActiveTab('comparison'); setSelectedOp(0) }}
        >
          Comparison
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'logical' ? styles.active : ''}`}
          onClick={() => { setActiveTab('logical'); setSelectedOp(0) }}
        >
          Logical
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={styles.content}
        >
          {/* Operation list */}
          <div className={styles.opList}>
            {ops.map((op, i) => (
              <motion.button
                key={i}
                className={`${styles.opItem} ${selectedOp === i ? styles.active : ''}`}
                onClick={() => setSelectedOp(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <code className={styles.opExpression}>{op.expression}</code>
              </motion.button>
            ))}
          </div>

          {/* Result display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOp}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.resultCard}
            >
              <div className={styles.expression}>
                <code>{ops[selectedOp].expression}</code>
              </div>
              <div className={styles.equals}>=</div>
              <div className={styles.result}>
                <code className={ops[selectedOp].result === 'true' ? styles.resultTrue : ops[selectedOp].result === 'false' ? styles.resultFalse : ''}>
                  {ops[selectedOp].result}
                </code>
              </div>
              <p className={styles.explanation}>{ops[selectedOp].explanation}</p>
            </motion.div>
          </AnimatePresence>

          {/* Tips */}
          {activeTab === 'comparison' && (
            <div className={styles.tip}>
              Always use <code>===</code> (strict equality) to avoid type coercion bugs!
            </div>
          )}
          {activeTab === 'logical' && (
            <div className={styles.tip}>
              <code>&&</code> and <code>||</code> return actual values, not just booleans!
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
