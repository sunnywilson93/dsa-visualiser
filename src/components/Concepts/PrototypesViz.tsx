import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PrototypesViz.module.css'

interface HeapObject {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string }[]
  protoRef: string | null
  color: string
}

interface Step {
  description: string
  lookupProp: string
  foundAt: string | null
  checkedObjects: string[]
  heap: HeapObject[]
}

const baseHeap: HeapObject[] = [
  {
    id: 'dog',
    name: 'dog',
    type: 'instance',
    props: [
      { name: 'name', value: '"Rex"' },
      { name: 'bark', value: 'fn()' },
    ],
    protoRef: 'Animal.prototype',
    color: '#667eea',
  },
  {
    id: 'Animal.prototype',
    name: 'Animal.prototype',
    type: 'prototype',
    props: [
      { name: 'speak', value: 'fn()' },
      { name: 'eat', value: 'fn()' },
    ],
    protoRef: 'Object.prototype',
    color: '#8b5cf6',
  },
  {
    id: 'Object.prototype',
    name: 'Object.prototype',
    type: 'prototype',
    props: [
      { name: 'toString', value: 'fn()' },
      { name: 'hasOwnProperty', value: 'fn()' },
    ],
    protoRef: 'null',
    color: '#f59e0b',
  },
  {
    id: 'null',
    name: 'null',
    type: 'null',
    props: [],
    protoRef: null,
    color: '#ef4444',
  },
]

const lookups: Record<string, Step[]> = {
  name: [
    { description: 'Looking for "name" on dog...', lookupProp: 'name', foundAt: null, checkedObjects: ['dog'], heap: baseHeap },
    { description: '✓ Found "name" directly on dog! Value: "Rex"', lookupProp: 'name', foundAt: 'dog', checkedObjects: ['dog'], heap: baseHeap },
  ],
  speak: [
    { description: 'Looking for "speak" on dog...', lookupProp: 'speak', foundAt: null, checkedObjects: ['dog'], heap: baseHeap },
    { description: 'Not on dog. Following __proto__ to Animal.prototype...', lookupProp: 'speak', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'], heap: baseHeap },
    { description: '✓ Found "speak" on Animal.prototype!', lookupProp: 'speak', foundAt: 'Animal.prototype', checkedObjects: ['dog', 'Animal.prototype'], heap: baseHeap },
  ],
  toString: [
    { description: 'Looking for "toString" on dog...', lookupProp: 'toString', foundAt: null, checkedObjects: ['dog'], heap: baseHeap },
    { description: 'Not on dog. Following __proto__ to Animal.prototype...', lookupProp: 'toString', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'], heap: baseHeap },
    { description: 'Not on Animal.prototype. Following __proto__ to Object.prototype...', lookupProp: 'toString', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'], heap: baseHeap },
    { description: '✓ Found "toString" on Object.prototype!', lookupProp: 'toString', foundAt: 'Object.prototype', checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'], heap: baseHeap },
  ],
  fly: [
    { description: 'Looking for "fly" on dog...', lookupProp: 'fly', foundAt: null, checkedObjects: ['dog'], heap: baseHeap },
    { description: 'Not on dog. Following __proto__ to Animal.prototype...', lookupProp: 'fly', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'], heap: baseHeap },
    { description: 'Not on Animal.prototype. Following __proto__ to Object.prototype...', lookupProp: 'fly', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'], heap: baseHeap },
    { description: 'Not on Object.prototype. Following __proto__ to null...', lookupProp: 'fly', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype', 'null'], heap: baseHeap },
    { description: '✗ Property "fly" not found! Returns undefined', lookupProp: 'fly', foundAt: 'NOT_FOUND', checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype', 'null'], heap: baseHeap },
  ],
}

export function PrototypesViz() {
  const [selectedProp, setSelectedProp] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const currentSteps = selectedProp ? lookups[selectedProp] : null
  const currentStep = currentSteps?.[stepIndex]

  const handlePropSelect = (prop: string) => {
    setSelectedProp(prop)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (currentSteps && stepIndex < currentSteps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handleReset = () => {
    setSelectedProp(null)
    setStepIndex(0)
  }

  return (
    <div className={styles.container}>
      {/* Property selector */}
      <div className={styles.propSelector}>
        <span className={styles.propLabel}>Look up:</span>
        {['name', 'speak', 'toString', 'fly'].map(prop => (
          <button
            key={prop}
            className={`${styles.propBtn} ${selectedProp === prop ? styles.active : ''}`}
            onClick={() => handlePropSelect(prop)}
          >
            dog.{prop}
          </button>
        ))}
        {selectedProp && (
          <button className={styles.resetBtn} onClick={handleReset}>
            ↻ Reset
          </button>
        )}
      </div>

      {/* Heap visualization */}
      <div className={styles.heapContainer}>
        <div className={styles.heapHeader}>Heap Memory (Prototype Chain)</div>
        <div className={styles.heap}>
          {baseHeap.map((obj, index) => (
            <div key={obj.id}>
              <motion.div
                className={`${styles.heapObject} ${currentStep?.checkedObjects.includes(obj.id) ? styles.checking : ''} ${currentStep?.foundAt === obj.id ? styles.found : ''}`}
                style={{
                  borderColor: currentStep?.checkedObjects.includes(obj.id) ? obj.color : 'rgba(255,255,255,0.1)',
                }}
                animate={{
                  scale: currentStep?.foundAt === obj.id ? 1.02 : 1,
                }}
              >
                <div className={styles.objectHeader} style={{ background: obj.color }}>
                  {obj.name}
                </div>
                <div className={styles.objectContent}>
                  {obj.type === 'null' ? (
                    <div className={styles.nullValue}>End of chain</div>
                  ) : (
                    <>
                      <div className={styles.propsSection}>
                        {obj.props.map(p => (
                          <div
                            key={p.name}
                            className={`${styles.prop} ${currentStep?.lookupProp === p.name && currentStep?.foundAt === obj.id ? styles.foundProp : ''}`}
                          >
                            <span className={styles.propName}>{p.name}:</span>
                            <span className={styles.propValue}>{p.value}</span>
                          </div>
                        ))}
                      </div>
                      {obj.protoRef && (
                        <div className={styles.protoRef}>
                          __proto__: → {obj.protoRef}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {currentStep?.foundAt === obj.id && currentStep.foundAt !== 'NOT_FOUND' && (
                  <motion.div
                    className={styles.foundBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓ Found!
                  </motion.div>
                )}
              </motion.div>
              {index < baseHeap.length - 1 && (
                <div
                  className={styles.arrow}
                  style={{
                    color: currentStep?.checkedObjects.includes(obj.id) &&
                           currentStep?.checkedObjects.includes(baseHeap[index + 1].id)
                      ? obj.color
                      : '#444',
                  }}
                >
                  ↓ __proto__
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step description */}
      {currentStep && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedProp}-${stepIndex}`}
            className={`${styles.description} ${currentStep.foundAt === 'NOT_FOUND' ? styles.notFound : ''}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentSteps?.length}</span>
            {currentStep.description}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Controls */}
      {currentSteps && (
        <div className={styles.controls}>
          <motion.button
            className={styles.btnPrimary}
            onClick={handleNext}
            disabled={stepIndex >= currentSteps.length - 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {stepIndex >= currentSteps.length - 1 ? 'Done' : 'Next →'}
          </motion.button>
        </div>
      )}

      {/* Insight */}
      <div className={styles.insight}>
        <strong>Prototype Chain:</strong> When accessing a property, JS first checks the object itself,
        then walks up the __proto__ chain until it finds the property or reaches null.
      </div>
    </div>
  )
}
