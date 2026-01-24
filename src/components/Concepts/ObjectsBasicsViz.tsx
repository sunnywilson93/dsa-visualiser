import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './ObjectsBasicsViz.module.css'

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface ObjectProperty {
  key: string
  value: string | number | boolean
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'deleted' | 'none'
}

interface HeapObject {
  id: string
  type: 'object'
  properties: ObjectProperty[]
  label: string
  highlight?: 'mutated' | 'new' | 'none'
}

interface ObjectStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'destructure' | 'spread' | 'result'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
}

interface ObjectExample {
  id: string
  title: string
  code: string[]
  steps: ObjectStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, ObjectExample[]> = {
  beginner: [],
  intermediate: [],
  advanced: []
}

export function ObjectsBasicsViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample?.steps[stepIndex]

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const getSharedRefWarning = () => {
    if (!currentStep || currentStep.phase !== 'mutate') return null

    const refCounts = new Map<string, string[]>()
    currentStep.stack.forEach(item => {
      if (item.isReference && item.refId) {
        const existing = refCounts.get(item.refId) || []
        existing.push(item.name)
        refCounts.set(item.refId, existing)
      }
    })

    for (const [, names] of refCounts) {
      if (names.length > 1) {
        return names
      }
    }
    return null
  }

  const sharedRefVars = getSharedRefWarning()

  if (!currentStep) {
    return (
      <div className={styles.container}>
        <div className={styles.levelSelector}>
          {(Object.keys(levelInfo) as Level[]).map(lvl => (
            <button
              key={lvl}
              className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
              onClick={() => handleLevelChange(lvl)}
              disabled={examples[lvl].length === 0}
              style={{
                borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
                background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
              }}
            >
              <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }} />
              {levelInfo[lvl].label}
            </button>
          ))}
        </div>
        <div className={styles.emptyState}>No examples available for this level yet.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            disabled={examples[lvl].length === 0}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      <div className={styles.exampleTabs}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleTab} ${exampleIndex === i ? styles.activeTab : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <CodePanel
          code={currentExample.code}
          highlightedLine={currentStep.codeLine}
          title="Code"
        />

        <div className={styles.memoryPanel}>
          <div className={styles.stackSection}>
            <div className={styles.sectionHeader}>Stack</div>
            <div className={styles.stackItems}>
              <AnimatePresence mode="popLayout">
                {currentStep.stack.length === 0 ? (
                  <div className={styles.emptySection}>(empty)</div>
                ) : (
                  currentStep.stack.slice().reverse().map((item) => (
                    <motion.div
                      key={item.name}
                      className={`${styles.stackItem} ${item.isReference ? styles.reference : ''} ${item.highlight === 'new' ? styles.highlightNew : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <span className={styles.varName}>{item.name}</span>
                      <span className={styles.varValue}>{item.value}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.heapSection}>
            <div className={styles.sectionHeader}>Heap</div>
            <div className={styles.heapObjects}>
              <AnimatePresence>
                {sharedRefVars && (
                  <motion.div
                    className={styles.warningBadge}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <span className={styles.warningIcon}>!</span>
                    <span className={styles.warningText}>
                      Both {sharedRefVars.join(' and ')} affected!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {currentStep.heap.length === 0 ? (
                  <div className={styles.emptySection}>(empty)</div>
                ) : (
                  currentStep.heap.map((obj) => (
                    <motion.div
                      key={obj.id}
                      className={`${styles.heapObject} ${obj.highlight === 'mutated' ? styles.highlightMutated : ''} ${obj.highlight === 'new' ? styles.highlightNew : ''}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <div className={styles.objectLabel}>{obj.label}</div>
                      <div className={styles.objectProperties}>
                        {obj.properties.map(prop => (
                          <div
                            key={prop.key}
                            className={`${styles.property} ${prop.highlight === 'new' ? styles.highlightNew : ''} ${prop.highlight === 'changed' ? styles.highlightChanged : ''} ${prop.highlight === 'deleted' ? styles.highlightDeleted : ''}`}
                          >
                            <span className={styles.propKey}>{prop.key}:</span>
                            <span className={styles.propValue}>
                              {prop.isReference ? prop.value : JSON.stringify(prop.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.outputBox}>
        <div className={styles.boxHeader}>Console Output</div>
        <div className={styles.outputContent}>
          <AnimatePresence>
            {currentStep.output.length === 0 ? (
              <span className={styles.placeholder}>No output yet</span>
            ) : (
              currentStep.output.map((line, i) => (
                <motion.div
                  key={i}
                  className={styles.outputLine}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {line}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <StepProgress
        current={stepIndex}
        total={currentExample.steps.length}
        description={currentStep.description}
      />

      <StepControls
        onPrev={() => setStepIndex(s => s - 1)}
        onNext={() => setStepIndex(s => s + 1)}
        onReset={() => setStepIndex(0)}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
      />

      <div className={styles.insightBox}>
        <span className={styles.insightLabel}>Key Insight:</span>
        {currentExample.insight}
      </div>
    </div>
  )
}
