import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ArraysBasicsViz.module.css'

type Tab = 'access' | 'methods' | 'transform'

interface ArrayMethod {
  name: string
  description: string
  mutates: boolean
  code: string
  result: string
}

const mutatingMethods: ArrayMethod[] = [
  { name: 'push(4)', description: 'Add to end', mutates: true, code: 'arr.push(4)', result: '[1, 2, 3, 4]' },
  { name: 'pop()', description: 'Remove from end', mutates: true, code: 'arr.pop()', result: '[1, 2]' },
  { name: 'unshift(0)', description: 'Add to beginning', mutates: true, code: 'arr.unshift(0)', result: '[0, 1, 2, 3]' },
  { name: 'shift()', description: 'Remove from beginning', mutates: true, code: 'arr.shift()', result: '[2, 3]' },
]

const transformMethods: ArrayMethod[] = [
  { name: 'map(x => x * 2)', description: 'Transform each element', mutates: false, code: 'arr.map(x => x * 2)', result: '[2, 4, 6]' },
  { name: 'filter(x => x > 1)', description: 'Keep matching elements', mutates: false, code: 'arr.filter(x => x > 1)', result: '[2, 3]' },
  { name: 'reduce((a,b) => a+b, 0)', description: 'Combine into one value', mutates: false, code: 'arr.reduce((a,b) => a+b, 0)', result: '6' },
]

export function ArraysBasicsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('access')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const baseArray = [1, 2, 3]

  return (
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'access' ? styles.active : ''}`}
          onClick={() => { setActiveTab('access'); setSelectedIndex(null) }}
        >
          Accessing
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'methods' ? styles.active : ''}`}
          onClick={() => { setActiveTab('methods'); setSelectedMethod(null) }}
        >
          Add / Remove
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'transform' ? styles.active : ''}`}
          onClick={() => { setActiveTab('transform'); setSelectedMethod(null) }}
        >
          Transform
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'access' && (
          <motion.div
            key="access"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.arrayViz}>
              <div className={styles.arrayLabel}>const fruits = </div>
              <div className={styles.arrayBracket}>[</div>
              {['apple', 'banana', 'cherry'].map((item, i) => (
                <motion.button
                  key={i}
                  className={`${styles.arrayItem} ${selectedIndex === i ? styles.active : ''}`}
                  onClick={() => setSelectedIndex(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.indexLabel}>[{i}]</span>
                  <span className={styles.itemValue}>&quot;{item}&quot;</span>
                </motion.button>
              ))}
              <div className={styles.arrayBracket}>]</div>
            </div>

            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.accessResult}
              >
                <code className={styles.accessCode}>
                  fruits[{selectedIndex}]
                </code>
                <span className={styles.accessArrow}>→</span>
                <code className={styles.accessValue}>
                  &quot;{['apple', 'banana', 'cherry'][selectedIndex]}&quot;
                </code>
              </motion.div>
            )}

            <div className={styles.tip}>
              Click an item to see how to access it. Arrays are zero-indexed!
            </div>
          </motion.div>
        )}

        {activeTab === 'methods' && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.baseArray}>
              <span className={styles.baseLabel}>Starting array:</span>
              <code>[1, 2, 3]</code>
            </div>

            <div className={styles.methodGrid}>
              {mutatingMethods.map(method => (
                <motion.button
                  key={method.name}
                  className={`${styles.methodCard} ${selectedMethod === method.name ? styles.active : ''}`}
                  onClick={() => setSelectedMethod(method.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <code className={styles.methodName}>{method.name}</code>
                  <span className={styles.methodDesc}>{method.description}</span>
                </motion.button>
              ))}
            </div>

            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.methodResult}
              >
                {(() => {
                  const method = mutatingMethods.find(m => m.name === selectedMethod)!
                  return (
                    <>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Code:</span>
                        <code>{method.code}</code>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Result:</span>
                        <code className={styles.resultValue}>{method.result}</code>
                      </div>
                      <div className={styles.mutatesTag}>
                        Mutates original array
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'transform' && (
          <motion.div
            key="transform"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.baseArray}>
              <span className={styles.baseLabel}>Starting array:</span>
              <code>[1, 2, 3]</code>
            </div>

            <div className={styles.methodGrid}>
              {transformMethods.map(method => (
                <motion.button
                  key={method.name}
                  className={`${styles.methodCard} ${selectedMethod === method.name ? styles.active : ''}`}
                  onClick={() => setSelectedMethod(method.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <code className={styles.methodName}>{method.name}</code>
                  <span className={styles.methodDesc}>{method.description}</span>
                </motion.button>
              ))}
            </div>

            {selectedMethod && transformMethods.find(m => m.name === selectedMethod) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.methodResult}
              >
                {(() => {
                  const method = transformMethods.find(m => m.name === selectedMethod)!
                  return (
                    <>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Code:</span>
                        <code>{method.code}</code>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Returns:</span>
                        <code className={styles.resultValue}>{method.result}</code>
                      </div>
                      <div className={styles.noMutateTag}>
                        Returns new array (doesn&apos;t mutate)
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
