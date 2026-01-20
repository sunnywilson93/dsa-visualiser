import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoopsViz.module.css'

type LoopType = 'for' | 'while' | 'forof' | 'forin'

interface LoopInfo {
  id: LoopType
  name: string
  color: string
  bestFor: string
}

const loopTypes: LoopInfo[] = [
  { id: 'for', name: 'for', color: '#10b981', bestFor: 'When you know how many iterations' },
  { id: 'while', name: 'while', color: '#3b82f6', bestFor: 'When condition-based (unknown iterations)' },
  { id: 'forof', name: 'for...of', color: '#8b5cf6', bestFor: 'Iterating array VALUES' },
  { id: 'forin', name: 'for...in', color: '#f59e0b', bestFor: 'Iterating object KEYS' },
]

export function LoopsViz() {
  const [loopType, setLoopType] = useState<LoopType>('for')
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [output, setOutput] = useState<string[]>([])

  const items = loopType === 'forin'
    ? ['name', 'age', 'city']
    : ['apple', 'banana', 'cherry']

  const values = loopType === 'forin'
    ? ['Alice', '25', 'NYC']
    : items

  useEffect(() => {
    setCurrentIndex(-1)
    setOutput([])
    setIsRunning(false)
  }, [loopType])

  const runLoop = () => {
    setIsRunning(true)
    setCurrentIndex(-1)
    setOutput([])

    let i = 0
    const interval = setInterval(() => {
      if (i < items.length) {
        setCurrentIndex(i)
        if (loopType === 'forin') {
          setOutput(prev => [...prev, `${items[i]}: ${values[i]}`])
        } else {
          setOutput(prev => [...prev, items[i]])
        }
        i++
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 800)
  }

  const getCode = () => {
    switch (loopType) {
      case 'for':
        return `const fruits = ["apple", "banana", "cherry"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`
      case 'while':
        return `const fruits = ["apple", "banana", "cherry"];
let i = 0;

while (i < fruits.length) {
  console.log(fruits[i]);
  i++;
}`
      case 'forof':
        return `const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log(fruit);  // Gets VALUES directly
}`
      case 'forin':
        return `const person = { name: "Alice", age: 25, city: "NYC" };

for (const key in person) {
  console.log(key, person[key]);  // Gets KEYS
}`
    }
  }

  const currentLoop = loopTypes.find(l => l.id === loopType)!

  return (
    <div className={styles.container}>
      {/* Loop type selector */}
      <div className={styles.loopSelector}>
        {loopTypes.map(loop => (
          <button
            key={loop.id}
            className={`${styles.loopBtn} ${loopType === loop.id ? styles.active : ''}`}
            style={{
              borderColor: loopType === loop.id ? loop.color : 'transparent',
              background: loopType === loop.id ? `${loop.color}15` : 'transparent'
            }}
            onClick={() => setLoopType(loop.id)}
          >
            <span className={styles.loopDot} style={{ background: loop.color }} />
            {loop.name}
          </button>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Code panel */}
        <div className={styles.codePanel}>
          <div className={styles.panelHeader}>Code</div>
          <pre className={styles.code}>
            <code>{getCode()}</code>
          </pre>
        </div>

        {/* Visualization */}
        <div className={styles.vizPanel}>
          <div className={styles.panelHeader}>
            {loopType === 'forin' ? 'Object Keys' : 'Array Items'}
          </div>
          <div className={styles.itemsRow}>
            {items.map((item, i) => (
              <motion.div
                key={i}
                className={`${styles.item} ${currentIndex === i ? styles.active : ''}`}
                style={{ borderColor: currentIndex === i ? currentLoop.color : 'rgba(255,255,255,0.1)' }}
                animate={{
                  scale: currentIndex === i ? 1.1 : 1,
                  boxShadow: currentIndex === i ? `0 0 15px ${currentLoop.color}40` : 'none'
                }}
              >
                {loopType === 'forin' ? (
                  <>
                    <span className={styles.itemKey}>{item}</span>
                    <span className={styles.itemValue}>{values[i]}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.itemIndex}>[{i}]</span>
                    <span className={styles.itemValue}>{item}</span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className={styles.outputPanel}>
          <div className={styles.panelHeader}>Console Output</div>
          <div className={styles.outputContent}>
            <AnimatePresence>
              {output.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.outputLine}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
            {output.length === 0 && (
              <span className={styles.placeholder}>Click &quot;Run Loop&quot; to see output</span>
            )}
          </div>
        </div>
      </div>

      {/* Best for */}
      <div className={styles.bestFor}>
        <span className={styles.bestForLabel}>Best for:</span>
        {currentLoop.bestFor}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <motion.button
          className={styles.runBtn}
          onClick={runLoop}
          disabled={isRunning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ background: `linear-gradient(135deg, ${currentLoop.color}, ${currentLoop.color}dd)` }}
        >
          {isRunning ? 'Running...' : 'Run Loop'}
        </motion.button>
      </div>

      {/* Warning for for...in */}
      {loopType === 'forin' && (
        <div className={styles.warning}>
          Don&apos;t use for...in on arrays! It gives indices as strings, not numbers.
        </div>
      )}
    </div>
  )
}
