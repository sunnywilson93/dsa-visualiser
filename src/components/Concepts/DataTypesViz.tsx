import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './DataTypesViz.module.css'

interface TypeInfo {
  id: string
  name: string
  color: string
  examples: string[]
  typeof: string
  note?: string
}

const primitives: TypeInfo[] = [
  { id: 'string', name: 'String', color: '#10b981', examples: ['"hello"', "'world'", '`template`'], typeof: '"string"' },
  { id: 'number', name: 'Number', color: '#3b82f6', examples: ['42', '3.14', 'Infinity', 'NaN'], typeof: '"number"' },
  { id: 'boolean', name: 'Boolean', color: '#f59e0b', examples: ['true', 'false'], typeof: '"boolean"' },
  { id: 'null', name: 'null', color: '#ef4444', examples: ['null'], typeof: '"object"', note: 'Bug: typeof null is "object"!' },
  { id: 'undefined', name: 'undefined', color: '#8b5cf6', examples: ['undefined'], typeof: '"undefined"' },
  { id: 'symbol', name: 'Symbol', color: '#ec4899', examples: ['Symbol("id")'], typeof: '"symbol"' },
  { id: 'bigint', name: 'BigInt', color: '#06b6d4', examples: ['9007199254740991n'], typeof: '"bigint"' },
]

const referenceTypes: TypeInfo[] = [
  { id: 'object', name: 'Object', color: '#667eea', examples: ['{ key: "value" }'], typeof: '"object"' },
  { id: 'array', name: 'Array', color: '#a855f7', examples: ['[1, 2, 3]'], typeof: '"object"', note: 'Arrays are objects!' },
  { id: 'function', name: 'Function', color: '#f97316', examples: ['function() {}', '() => {}'], typeof: '"function"' },
]

type Tab = 'primitives' | 'reference' | 'compare'

interface CompareStep {
  title: string
  code: string
  explanation: string
  highlight: 'value' | 'reference'
}

const compareSteps: CompareStep[] = [
  {
    title: 'Primitives: Copy by Value',
    code: `let a = 10;
let b = a;     // b gets a COPY
b = 20;
console.log(a); // 10 (unchanged!)`,
    explanation: 'Primitives are copied by value. Changing b does not affect a.',
    highlight: 'value',
  },
  {
    title: 'Objects: Copy by Reference',
    code: `let obj1 = { x: 10 };
let obj2 = obj1; // Same object!
obj2.x = 20;
console.log(obj1.x); // 20 (changed!)`,
    explanation: 'Objects are copied by reference. Both variables point to the same object.',
    highlight: 'reference',
  },
  {
    title: 'Comparing Primitives',
    code: `let a = "hello";
let b = "hello";
console.log(a === b); // true
// Same value = equal`,
    explanation: 'Primitives are compared by their actual value.',
    highlight: 'value',
  },
  {
    title: 'Comparing Objects',
    code: `let obj1 = { x: 1 };
let obj2 = { x: 1 };
console.log(obj1 === obj2); // false!
// Different objects in memory`,
    explanation: 'Objects are compared by reference, not by their contents.',
    highlight: 'reference',
  },
]

export function DataTypesViz() {
  const [activeTab, setActiveTab] = useState<Tab>('primitives')
  const [selectedType, setSelectedType] = useState<TypeInfo | null>(null)
  const [compareStep, setCompareStep] = useState(0)

  return (
    <div className={styles.container}>
      {/* Tab selector */}
      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'primitives' ? styles.active : ''}`}
          onClick={() => setActiveTab('primitives')}
        >
          7 Primitives
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'reference' ? styles.active : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          Reference Types
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'compare' ? styles.active : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Value vs Reference
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'primitives' && (
          <motion.div
            key="primitives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.typesContainer}
          >
            <div className={styles.typeGrid}>
              {primitives.map(type => (
                <motion.button
                  key={type.id}
                  className={`${styles.typeCard} ${selectedType?.id === type.id ? styles.active : ''}`}
                  style={{ borderColor: selectedType?.id === type.id ? type.color : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.typeIcon} style={{ background: type.color }} />
                  <span className={styles.typeName}>{type.name}</span>
                </motion.button>
              ))}
            </div>

            {selectedType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.typeDetail}
                style={{ borderColor: selectedType.color }}
              >
                <h3 style={{ color: selectedType.color }}>{selectedType.name}</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Examples:</span>
                  <div className={styles.examples}>
                    {selectedType.examples.map((ex, i) => (
                      <code key={i} className={styles.example}>{ex}</code>
                    ))}
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>typeof:</span>
                  <code className={styles.typeofValue}>{selectedType.typeof}</code>
                </div>
                {selectedType.note && (
                  <div className={styles.noteBox}>
                    {selectedType.note}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'reference' && (
          <motion.div
            key="reference"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.typesContainer}
          >
            <div className={styles.typeGrid}>
              {referenceTypes.map(type => (
                <motion.button
                  key={type.id}
                  className={`${styles.typeCard} ${selectedType?.id === type.id ? styles.active : ''}`}
                  style={{ borderColor: selectedType?.id === type.id ? type.color : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.typeIcon} style={{ background: type.color }} />
                  <span className={styles.typeName}>{type.name}</span>
                </motion.button>
              ))}
            </div>

            {selectedType && referenceTypes.find(t => t.id === selectedType.id) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.typeDetail}
                style={{ borderColor: selectedType.color }}
              >
                <h3 style={{ color: selectedType.color }}>{selectedType.name}</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Examples:</span>
                  <div className={styles.examples}>
                    {selectedType.examples.map((ex, i) => (
                      <code key={i} className={styles.example}>{ex}</code>
                    ))}
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>typeof:</span>
                  <code className={styles.typeofValue}>{selectedType.typeof}</code>
                </div>
                {selectedType.note && (
                  <div className={styles.noteBox}>
                    {selectedType.note}
                  </div>
                )}
              </motion.div>
            )}

            <div className={styles.insight}>
              Everything that isn&apos;t a primitive is an object - including arrays and functions!
            </div>
          </motion.div>
        )}

        {activeTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.compareContainer}
          >
            <div className={styles.compareCard}>
              <h3 className={styles.compareTitle}>
                {compareSteps[compareStep].title}
              </h3>
              <pre className={styles.compareCode}>
                <code>{compareSteps[compareStep].code}</code>
              </pre>
              <p className={styles.compareExplanation}>
                {compareSteps[compareStep].explanation}
              </p>
              <div className={styles.memoryViz}>
                {compareSteps[compareStep].highlight === 'value' ? (
                  <div className={styles.memoryBoxes}>
                    <div className={styles.memoryBox} style={{ borderColor: '#10b981' }}>
                      <span className={styles.memoryLabel}>Variable A</span>
                      <span className={styles.memoryValue}>Value</span>
                    </div>
                    <div className={styles.memoryBox} style={{ borderColor: '#3b82f6' }}>
                      <span className={styles.memoryLabel}>Variable B</span>
                      <span className={styles.memoryValue}>Copy</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.memoryBoxes}>
                    <div className={styles.memoryBox} style={{ borderColor: '#f59e0b' }}>
                      <span className={styles.memoryLabel}>obj1</span>
                      <span className={styles.memoryArrow}>→</span>
                    </div>
                    <div className={styles.memoryBox} style={{ borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                      <span className={styles.memoryLabel}>Object</span>
                      <span className={styles.memoryValue}>&#123; x: ... &#125;</span>
                    </div>
                    <div className={styles.memoryBox} style={{ borderColor: '#f59e0b' }}>
                      <span className={styles.memoryLabel}>obj2</span>
                      <span className={styles.memoryArrow}>→</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.controls}>
              <button
                className={styles.btnSecondary}
                onClick={() => setCompareStep(s => Math.max(0, s - 1))}
                disabled={compareStep === 0}
              >
                Prev
              </button>
              <span className={styles.stepIndicator}>{compareStep + 1} / {compareSteps.length}</span>
              <button
                className={styles.btnPrimary}
                onClick={() => setCompareStep(s => Math.min(compareSteps.length - 1, s + 1))}
                disabled={compareStep === compareSteps.length - 1}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
