import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ConditionalsViz.module.css'

type Tab = 'ifelse' | 'ternary' | 'truthy'

interface FalsyValue {
  value: string
  display: string
  isFalsy: boolean
}

const falsyValues: FalsyValue[] = [
  { value: 'false', display: 'false', isFalsy: true },
  { value: '0', display: '0', isFalsy: true },
  { value: '""', display: '""', isFalsy: true },
  { value: 'null', display: 'null', isFalsy: true },
  { value: 'undefined', display: 'undefined', isFalsy: true },
  { value: 'NaN', display: 'NaN', isFalsy: true },
  { value: '"0"', display: '"0"', isFalsy: false },
  { value: '[]', display: '[]', isFalsy: false },
  { value: '{}', display: '{}', isFalsy: false },
  { value: '"false"', display: '"false"', isFalsy: false },
]

interface IfElseStep {
  age: number
  highlighted: 'if' | 'elseif' | 'else' | 'none'
  output: string
}

export function ConditionalsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('ifelse')
  const [age, setAge] = useState(18)
  const [ternaryValue, setTernaryValue] = useState(20)
  const [selectedFalsy, setSelectedFalsy] = useState<string | null>(null)

  const getIfElseResult = (): IfElseStep => {
    if (age >= 21) {
      return { age, highlighted: 'if', output: 'Can drink' }
    } else if (age >= 18) {
      return { age, highlighted: 'elseif', output: 'Can vote' }
    } else {
      return { age, highlighted: 'else', output: 'Too young' }
    }
  }

  const result = getIfElseResult()

  return (
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'ifelse' ? styles.active : ''}`}
          onClick={() => setActiveTab('ifelse')}
        >
          if / else
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'ternary' ? styles.active : ''}`}
          onClick={() => setActiveTab('ternary')}
        >
          Ternary ? :
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'truthy' ? styles.active : ''}`}
          onClick={() => setActiveTab('truthy')}
        >
          Truthy / Falsy
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ifelse' && (
          <motion.div
            key="ifelse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>age = {age}</label>
              <input
                type="range"
                min="10"
                max="30"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.codeCard}>
              <pre className={styles.code}>
                <div className={`${styles.codeLine} ${result.highlighted === 'if' ? styles.activeLine : ''}`}>
                  {`if (age >= 21) {`}
                </div>
                <div className={`${styles.codeLine} ${result.highlighted === 'if' ? styles.activeLine : ''}`}>
                  {`  console.log("Can drink");`}
                </div>
                <div className={`${styles.codeLine} ${result.highlighted === 'elseif' ? styles.activeLine : ''}`}>
                  {`} else if (age >= 18) {`}
                </div>
                <div className={`${styles.codeLine} ${result.highlighted === 'elseif' ? styles.activeLine : ''}`}>
                  {`  console.log("Can vote");`}
                </div>
                <div className={`${styles.codeLine} ${result.highlighted === 'else' ? styles.activeLine : ''}`}>
                  {`} else {`}
                </div>
                <div className={`${styles.codeLine} ${result.highlighted === 'else' ? styles.activeLine : ''}`}>
                  {`  console.log("Too young");`}
                </div>
                <div className={styles.codeLine}>{`}`}</div>
              </pre>
            </div>

            <div className={styles.outputBox}>
              <span className={styles.outputLabel}>Output:</span>
              <motion.code
                key={result.output}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={styles.outputValue}
              >
                &quot;{result.output}&quot;
              </motion.code>
            </div>
          </motion.div>
        )}

        {activeTab === 'ternary' && (
          <motion.div
            key="ternary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>age = {ternaryValue}</label>
              <input
                type="range"
                min="10"
                max="30"
                value={ternaryValue}
                onChange={e => setTernaryValue(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.ternaryViz}>
              <div className={styles.ternaryPart}>
                <span className={styles.ternaryLabel}>condition</span>
                <code className={ternaryValue >= 18 ? styles.ternaryTrue : styles.ternaryFalse}>
                  age &gt;= 18
                </code>
              </div>
              <span className={styles.ternarySymbol}>?</span>
              <div className={styles.ternaryPart}>
                <span className={styles.ternaryLabel}>if true</span>
                <code className={ternaryValue >= 18 ? styles.ternaryActive : ''}>
                  &quot;adult&quot;
                </code>
              </div>
              <span className={styles.ternarySymbol}>:</span>
              <div className={styles.ternaryPart}>
                <span className={styles.ternaryLabel}>if false</span>
                <code className={ternaryValue < 18 ? styles.ternaryActive : ''}>
                  &quot;minor&quot;
                </code>
              </div>
            </div>

            <div className={styles.outputBox}>
              <span className={styles.outputLabel}>Result:</span>
              <motion.code
                key={ternaryValue >= 18 ? 'adult' : 'minor'}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={styles.outputValue}
              >
                &quot;{ternaryValue >= 18 ? 'adult' : 'minor'}&quot;
              </motion.code>
            </div>
          </motion.div>
        )}

        {activeTab === 'truthy' && (
          <motion.div
            key="truthy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <p className={styles.intro}>Click a value to test it in an if statement:</p>

            <div className={styles.falsyGrid}>
              {falsyValues.map(item => (
                <motion.button
                  key={item.value}
                  className={`${styles.falsyItem} ${selectedFalsy === item.value ? styles.active : ''}`}
                  style={{
                    borderColor: selectedFalsy === item.value
                      ? (item.isFalsy ? '#ef4444' : '#10b981')
                      : 'rgba(255,255,255,0.1)'
                  }}
                  onClick={() => setSelectedFalsy(item.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <code>{item.display}</code>
                </motion.button>
              ))}
            </div>

            {selectedFalsy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.falsyResult}
              >
                <code>if ({selectedFalsy})</code>
                <span className={styles.arrow}>→</span>
                <span className={falsyValues.find(f => f.value === selectedFalsy)?.isFalsy ? styles.falsyTag : styles.truthyTag}>
                  {falsyValues.find(f => f.value === selectedFalsy)?.isFalsy ? 'FALSY (skips block)' : 'TRUTHY (runs block)'}
                </span>
              </motion.div>
            )}

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#ef4444' }} />
                <span>Falsy (6 values)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#10b981' }} />
                <span>Truthy (everything else)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
