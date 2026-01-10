import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Code } from 'lucide-react'
import { useExecutionStore } from '@/store'
import { codeExamples, exampleCategories, type CodeExample } from '@/data/examples'
import styles from './ExampleSelector.module.css'

export function ExampleSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const setCode = useExecutionStore(state => state.setCode)
  const reset = useExecutionStore(state => state.reset)
  const status = useExecutionStore(state => state.status)

  const handleSelectExample = (example: CodeExample) => {
    if (status !== 'idle') {
      reset()
    }
    setCode(example.code)
    setIsOpen(false)
    setSelectedCategory(null)
  }

  const filteredExamples = selectedCategory
    ? codeExamples.filter(e => e.category === selectedCategory)
    : codeExamples

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Load example code"
        aria-label="Load example code"
        aria-expanded={isOpen}
      >
        <Code size={16} />
        <span className={styles.triggerText}>Examples</span>
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Categories */}
            <div className={styles.categories}>
              <button
                className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {exampleCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Examples list */}
            <div className={styles.examples}>
              {filteredExamples.map(example => (
                <button
                  key={example.id}
                  className={styles.exampleBtn}
                  onClick={() => handleSelectExample(example)}
                >
                  <div className={styles.exampleName}>{example.name}</div>
                  <div className={styles.exampleDesc}>{example.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => {
            setIsOpen(false)
            setSelectedCategory(null)
          }}
        />
      )}
    </div>
  )
}
