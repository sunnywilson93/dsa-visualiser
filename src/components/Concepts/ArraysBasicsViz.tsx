import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './ArraysBasicsViz.module.css'

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface HeapObject {
  id: string
  type: 'array'
  elements: (string | number)[]
  label: string
  highlight?: 'mutated' | 'new' | 'none'
}

interface ArrayStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'result'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
}

interface ArrayExample {
  id: string
  title: string
  code: string[]
  steps: ArrayStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, ArrayExample[]> = {
  beginner: [
    {
      id: 'value-vs-reference',
      title: 'Value vs Reference copy',
      code: [
        'let a = 5',
        'let b = a',
        'b = 10',
        'console.log(a, b)',
        '',
        'let arr1 = [1, 2, 3]',
        'let arr2 = arr1',
        'arr2.push(4)',
        'console.log(arr1)',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let a = 5 - Primitive value stored directly in the stack.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5', highlight: 'new' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let b = a - The VALUE 5 is COPIED to b. They are independent.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '5', highlight: 'new' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'b = 10 - Only b changes. a is still 5 because they have separate copies.',
          phase: 'setup',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10', highlight: 'changed' },
          ],
          heap: [],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'console.log(a, b) outputs: 5, 10. Primitives are independent!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
          ],
          heap: [],
          output: ['5 10'],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'let arr1 = [1,2,3] - Array created in HEAP. arr1 stores a REFERENCE to it.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: ['5 10'],
        },
        {
          id: 6,
          codeLine: 6,
          description: 'let arr2 = arr1 - The REFERENCE is copied, not the array! Both point to the SAME heap object.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: ['5 10'],
        },
        {
          id: 7,
          codeLine: 7,
          description: 'arr2.push(4) - Mutates the heap array. Since arr1 and arr2 point to the same array, arr1 sees the change!',
          phase: 'mutate',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1', highlight: 'mutated' },
          ],
          output: ['5 10'],
        },
        {
          id: 8,
          codeLine: 8,
          description: 'console.log(arr1) outputs [1,2,3,4]. arr1 sees the change made through arr2!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
            { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1' },
          ],
          heap: [
            { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1' },
          ],
          output: ['5 10', '[1, 2, 3, 4]'],
        },
      ],
      insight: 'Primitives are copied by VALUE (independent). Arrays are copied by REFERENCE (shared)!',
    },
    {
      id: 'mutation-through-reference',
      title: 'Mutation through reference',
      code: [
        'let original = [1, 2, 3]',
        'let copy = original',
        '',
        'copy[0] = 99',
        '',
        'console.log(original[0])',
        'console.log(copy[0])',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let original = [1, 2, 3] - Array created in heap, original points to it.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = original - copy now points to the SAME array. No new array created!',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [1, 2, 3], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy[0] = 99 - Modifying through copy mutates the shared array!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original[0]) outputs 99. The original sees the change!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1' },
          ],
          output: ['99'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy[0]) also outputs 99. Both see the same data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [99, 2, 3], label: '#1' },
          ],
          output: ['99', '99'],
        },
      ],
      insight: 'When two variables reference the same array, mutation through either affects both!',
    },
    {
      id: 'multiple-references',
      title: 'Multiple references',
      code: [
        'let data = [10, 20, 30]',
        'let ref1 = data',
        'let ref2 = data',
        'let ref3 = data',
        '',
        'ref2[1] = 999',
        '',
        'console.log(data[1])',
        'console.log(ref1[1])',
        'console.log(ref3[1])',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Script starts. Stack and heap are empty.',
          phase: 'setup',
          stack: [],
          heap: [],
          output: [],
        },
        {
          id: 1,
          codeLine: 0,
          description: 'let data = [10, 20, 30] - Array created in heap.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let ref1 = data - ref1 now points to the same array.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'let ref2 = data - ref2 also points to the same array.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'let ref3 = data - Now 4 variables all point to the SAME array!',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr', highlight: 'new' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 20, 30], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'ref2[1] = 999 - Mutating through ref2 affects the shared array.',
          phase: 'mutate',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 7,
          description: 'console.log(data[1]) outputs 999 - data sees the mutation.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999'],
        },
        {
          id: 7,
          codeLine: 8,
          description: 'console.log(ref1[1]) also outputs 999 - ref1 sees it too.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999', '999'],
        },
        {
          id: 8,
          codeLine: 9,
          description: 'console.log(ref3[1]) outputs 999 - ALL references see the same change!',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'arr' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'arr' },
          ],
          heap: [
            { id: 'arr', type: 'array', elements: [10, 999, 30], label: '#1' },
          ],
          output: ['999', '999', '999'],
        },
      ],
      insight: 'Any number of variables can reference the same array. They all see the same data!',
    },
  ],
  intermediate: [],
  advanced: []
}

export function ArraysBasicsViz() {
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
                      <div className={styles.arrayElements}>
                        [{obj.elements.join(', ')}]
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
