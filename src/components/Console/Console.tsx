import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { useExecutionStore, useVisibleConsoleOutput } from '@/store'
import styles from './Console.module.css'

export function Console() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const status = useExecutionStore(state => state.status)
  // Use filtered output based on current step (progressive reveal)
  const consoleOutput = useVisibleConsoleOutput()

  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [consoleOutput])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Terminal size={14} className={styles.icon} />
          <span className={styles.title}>Console</span>
        </div>
        {consoleOutput.length > 0 && (
          <span className={styles.count}>{consoleOutput.length}</span>
        )}
      </div>

      <div className={styles.content} ref={scrollRef}>
        {consoleOutput.length === 0 && (
          <div className={styles.empty}>
            {status === 'idle' ? (
              <p>Console output will appear here</p>
            ) : (
              <p>No console output yet</p>
            )}
          </div>
        )}

        <AnimatePresence>
          {consoleOutput.map((line, index) => (
            <motion.div
              key={index}
              className={styles.line}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className={styles.lineNumber}>{index + 1}</span>
              <span className={styles.lineContent}>{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
