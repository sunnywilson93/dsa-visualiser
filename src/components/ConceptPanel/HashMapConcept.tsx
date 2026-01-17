'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ConceptStep } from '@/types'
import styles from './HashMapConcept.module.css'

interface HashMapConceptProps {
  step: ConceptStep
}

export function HashMapConcept({ step }: HashMapConceptProps) {
  const { visual } = step
  const array = visual.array || []
  const highlights = visual.highlights || []
  const annotations = visual.annotations || []
  const hashMap = visual.hashMap || { entries: [] }
  const currentIndex = hashMap.currentIndex
  const secondArray = hashMap.secondArray
  const secondArrayIndex = hashMap.secondArrayIndex
  const phase = hashMap.phase

  // Determine which array is active based on phase
  const showBothArrays = secondArray && secondArray.length > 0
  const isCheckPhase = phase === 'check'

  return (
    <div className={styles.container}>
      {/* Annotations */}
      {annotations.length > 0 && (
        <div className={styles.annotations}>
          {annotations.map((text, i) => (
            <span key={i} className={styles.annotation}>
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Two arrays side by side for anagram-like problems */}
      {showBothArrays ? (
        <div className={styles.dualArraySection}>
          {/* First array (s) */}
          <div className={styles.arraySection}>
            <span className={`${styles.sectionLabel} ${!isCheckPhase ? styles.activeLabel : ''}`}>
              String s {!isCheckPhase && '(building)'}
            </span>
            <div className={styles.arrayContainer}>
              {array.map((value, index) => {
                const isCurrent = !isCheckPhase && currentIndex === index
                return (
                  <div key={index} className={styles.elementWrapper}>
                    {isCurrent && (
                      <motion.div
                        className={styles.currentPointer}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        i
                        <div className={styles.pointerArrow} />
                      </motion.div>
                    )}
                    {!isCurrent && <div className={styles.pointerPlaceholder} />}
                    <motion.div
                      className={`${styles.element} ${isCurrent ? styles.current : ''} ${isCheckPhase ? styles.dimmed : ''}`}
                    >
                      <span className={styles.value}>{value}</span>
                    </motion.div>
                    <span className={styles.index}>{index}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Second array (t) */}
          <div className={styles.arraySection}>
            <span className={`${styles.sectionLabel} ${isCheckPhase ? styles.activeLabel : ''}`}>
              String t {isCheckPhase && '(checking)'}
            </span>
            <div className={styles.arrayContainer}>
              {secondArray.map((value, index) => {
                const isCurrent = isCheckPhase && secondArrayIndex === index
                const isHighlighted = highlights.includes(index) && isCheckPhase
                return (
                  <div key={index} className={styles.elementWrapper}>
                    {isCurrent && (
                      <motion.div
                        className={`${styles.currentPointer} ${styles.checkPointer}`}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        j
                        <div className={styles.pointerArrow} />
                      </motion.div>
                    )}
                    {!isCurrent && <div className={styles.pointerPlaceholder} />}
                    <motion.div
                      className={`${styles.element} ${isCurrent ? styles.currentCheck : ''} ${!isCheckPhase ? styles.dimmed : ''} ${isHighlighted ? styles.highlighted : ''}`}
                      animate={{
                        scale: isHighlighted ? 1.1 : 1,
                      }}
                    >
                      <span className={styles.value}>{value}</span>
                    </motion.div>
                    <span className={styles.index}>{index}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Single array visualization */
        <div className={styles.arraySection}>
          <span className={styles.sectionLabel}>Array</span>
          <div className={styles.arrayContainer}>
            {array.map((value, index) => {
              const isHighlighted = highlights.includes(index)
              const isCurrent = currentIndex === index

              return (
                <div key={index} className={styles.elementWrapper}>
                  {isCurrent && (
                    <motion.div
                      className={styles.currentPointer}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      i
                      <div className={styles.pointerArrow} />
                    </motion.div>
                  )}
                  {!isCurrent && <div className={styles.pointerPlaceholder} />}

                  <motion.div
                    className={`${styles.element} ${isHighlighted ? styles.highlighted : ''} ${isCurrent ? styles.current : ''}`}
                    animate={{
                      scale: isHighlighted ? 1.1 : 1,
                      boxShadow: isHighlighted
                        ? '0 0 16px rgba(16, 185, 128, 0.6)'
                        : '0 1px 2px rgba(0, 0, 0, 0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className={styles.value}>{value}</span>
                  </motion.div>

                  <span className={styles.index}>{index}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Hash Map visualization */}
      <div className={styles.hashMapSection}>
        <span className={styles.sectionLabel}>HashMap</span>
        <div className={styles.hashMapContainer}>
          {hashMap.entries.length === 0 ? (
            <div className={styles.emptyMap}>
              <span className={styles.emptyText}>Empty</span>
            </div>
          ) : (
            <div className={styles.entriesGrid}>
              <AnimatePresence mode="popLayout">
                {hashMap.entries.map((entry) => (
                  <motion.div
                    key={`${entry.key}-${entry.value}`}
                    className={`${styles.entry} ${entry.isNew ? styles.newEntry : ''} ${entry.isLookup ? styles.lookupEntry : ''} ${entry.isDecrement ? styles.decrementEntry : ''}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, delay: entry.isNew ? 0.1 : 0 }}
                  >
                    <span className={styles.entryKey}>{entry.key}</span>
                    <span className={styles.entryArrow}>:</span>
                    <span className={`${styles.entryValue} ${entry.isDecrement ? styles.decrementValue : ''} ${entry.value === 0 ? styles.zeroValue : ''}`}>
                      {entry.value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Lookup status */}
      {hashMap.lookupKey !== undefined && (
        <motion.div
          className={styles.lookupStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={styles.lookupLabel}>Looking for:</span>
          <span className={styles.lookupKey}>{hashMap.lookupKey}</span>
          {hashMap.lookupResult === 'found' && (
            <motion.span
              className={styles.lookupFound}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              Found!
            </motion.span>
          )}
          {hashMap.lookupResult === 'not-found' && (
            <span className={styles.lookupNotFound}>Not in map</span>
          )}
        </motion.div>
      )}

      {/* Result display */}
      {visual.result !== undefined && (
        <motion.div
          className={styles.result}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className={styles.resultValue}>{String(visual.result)}</span>
        </motion.div>
      )}
    </div>
  )
}
