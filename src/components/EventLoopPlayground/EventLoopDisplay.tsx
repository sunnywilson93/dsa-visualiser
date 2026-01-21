'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import type { EventLoopStep } from '@/engine/eventLoopAnalyzer'
import styles from './EventLoopDisplay.module.css'

interface EventLoopDisplayProps {
  step: EventLoopStep
}

const webApis = [
  { name: 'fetch', highlight: false },
  { name: 'setTimeout', highlight: true },
  { name: 'URL', highlight: false },
  { name: 'localStorage', highlight: false },
  { name: 'XMLHttpRequest', highlight: false },
  { name: 'document', highlight: false },
]

export function EventLoopDisplay({ step }: EventLoopDisplayProps) {
  const getEventLoopClass = () => {
    if (step.phase === 'idle') return styles.idle
    if (step.phase === 'micro' || step.phase === 'macro') return styles.active
    return ''
  }

  return (
    <div className={styles.container}>
      {/* Main Visualization Grid */}
      <div className={styles.vizContainer}>
        {/* Call Stack */}
        <div className={`${styles.neonBox} ${styles.callStackBox}`}>
          <div className={styles.neonBoxHeader}>Call Stack</div>
          <div className={styles.neonBoxInner}>
            <AnimatePresence mode="popLayout">
              {step.callStack.length === 0 ? (
                <div className={styles.emptyStack}>(empty)</div>
              ) : (
                step.callStack.slice().reverse().map((item, i) => (
                  <motion.div
                    key={item + i}
                    className={styles.stackItem}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                  >
                    {item}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Web APIs */}
        <div className={`${styles.neonBox} ${styles.webApisBox}`}>
          <div className={styles.neonBoxHeader}>Web APIs</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.webApisGrid}>
              {webApis.map((api) => (
                <div
                  key={api.name}
                  className={`${styles.webApiItem} ${
                    step.activeWebApi === api.name ? styles.active : ''
                  } ${api.highlight ? styles.highlight : ''}`}
                >
                  {api.name}
                </div>
              ))}
              <div className={styles.manyMore}>Many more...</div>
            </div>
          </div>
        </div>

        {/* Event Loop */}
        <div className={`${styles.neonBox} ${styles.eventLoopBox}`}>
          <div className={styles.neonBoxHeader}>Event Loop</div>
          <div className={styles.neonBoxInner}>
            <div className={`${styles.eventLoopIcon} ${getEventLoopClass()}`}>
              <RefreshCw size={24} />
            </div>
          </div>
        </div>

        {/* Task Queue (Macrotasks) */}
        <div className={`${styles.neonBox} ${styles.taskQueueBox}`}>
          <div className={styles.neonBoxHeader}>Task Queue</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {step.macroQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  step.macroQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className={styles.macroItem}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Microtask Queue */}
        <div className={`${styles.neonBox} ${styles.microtaskBox}`}>
          <div className={styles.neonBoxHeader}>Microtask Queue</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.queueContent}>
              <AnimatePresence mode="popLayout">
                {step.microQueue.length === 0 ? (
                  <div className={styles.emptyQueue}>(empty)</div>
                ) : (
                  step.microQueue.map((item, i) => (
                    <motion.div
                      key={item + i}
                      className={styles.microItem}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className={styles.outputSection}>
        <div className={styles.outputHeader}>Output</div>
        <div className={styles.outputContent}>
          {step.output.length === 0 ? (
            <span className={styles.outputEmpty}>—</span>
          ) : (
            step.output.map((item, i) => (
              <motion.div
                key={i}
                className={styles.outputItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
