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
        'let obj1 = { name: "Alice" }',
        'let obj2 = obj1',
        'obj2.name = "Bob"',
        'console.log(obj1.name)',
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
          description: 'let obj1 = { name: "Alice" } - Object created in HEAP. obj1 stores a REFERENCE to it.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }], label: '#1', highlight: 'new' },
          ],
          output: ['5 10'],
        },
        {
          id: 6,
          codeLine: 6,
          description: 'let obj2 = obj1 - The REFERENCE is copied, not the object! Both point to the SAME heap object.',
          phase: 'reference',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }], label: '#1' },
          ],
          output: ['5 10'],
        },
        {
          id: 7,
          codeLine: 7,
          description: 'obj2.name = "Bob" - Mutates the heap object. Since obj1 and obj2 point to the same object, obj1 sees the change!',
          phase: 'mutate',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }], label: '#1', highlight: 'mutated' },
          ],
          output: ['5 10'],
        },
        {
          id: 8,
          codeLine: 8,
          description: 'console.log(obj1.name) outputs "Bob". obj1 sees the change made through obj2!',
          phase: 'result',
          stack: [
            { name: 'a', value: '5' },
            { name: 'b', value: '10' },
            { name: 'obj1', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'obj2', value: '-> #1', isReference: true, refId: 'obj1' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Bob' }], label: '#1' },
          ],
          output: ['5 10', 'Bob'],
        },
      ],
      insight: 'Primitives are copied by VALUE (independent). Objects are copied by REFERENCE (shared)!',
    },
    {
      id: 'mutation-through-reference',
      title: 'Mutation through reference',
      code: [
        'let original = { name: "Alice", age: 25 }',
        'let copy = original',
        '',
        'copy.name = "Bob"',
        '',
        'console.log(original.name)',
        'console.log(copy.name)',
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
          description: 'let original = { name: "Alice", age: 25 } - Object created in heap, original points to it.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = original - copy now points to the SAME object. No new object created!',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy.name = "Bob" - Modifying through copy mutates the shared object!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }, { key: 'age', value: 25 }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original.name) outputs "Bob". The original sees the change!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Bob'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy.name) also outputs "Bob". Both see the same data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'copy', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#1' },
          ],
          output: ['Bob', 'Bob'],
        },
      ],
      insight: 'When two variables reference the same object, mutation through either affects both!',
    },
    {
      id: 'multiple-references',
      title: 'Multiple references',
      code: [
        'let data = { count: 0 }',
        'let ref1 = data',
        'let ref2 = data',
        'let ref3 = data',
        '',
        'ref2.count = 999',
        '',
        'console.log(data.count)',
        'console.log(ref1.count)',
        'console.log(ref3.count)',
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
          description: 'let data = { count: 0 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let ref1 = data - ref1 now points to the same object.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 2,
          description: 'let ref2 = data - ref2 also points to the same object.',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 3,
          description: 'let ref3 = data - Now 4 variables all point to the SAME object!',
          phase: 'reference',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj', highlight: 'new' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 0 }], label: '#1' },
          ],
          output: [],
        },
        {
          id: 5,
          codeLine: 5,
          description: 'ref2.count = 999 - Mutating through ref2 affects the shared object.',
          phase: 'mutate',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999, highlight: 'changed' }], label: '#1', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 6,
          codeLine: 7,
          description: 'console.log(data.count) outputs 999 - data sees the mutation.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999'],
        },
        {
          id: 7,
          codeLine: 8,
          description: 'console.log(ref1.count) also outputs 999 - ref1 sees it too.',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999', '999'],
        },
        {
          id: 8,
          codeLine: 9,
          description: 'console.log(ref3.count) outputs 999 - ALL references see the same change!',
          phase: 'result',
          stack: [
            { name: 'data', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref1', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref2', value: '-> #1', isReference: true, refId: 'obj' },
            { name: 'ref3', value: '-> #1', isReference: true, refId: 'obj' },
          ],
          heap: [
            { id: 'obj', type: 'object', properties: [{ key: 'count', value: 999 }], label: '#1' },
          ],
          output: ['999', '999', '999'],
        },
      ],
      insight: 'Any number of variables can reference the same object. They all see the same data!',
    },
  ],
  intermediate: [
    {
      id: 'spread-creates-copy',
      title: 'Spread creates a copy',
      code: [
        'let original = { name: "Alice", age: 25 }',
        'let copy = { ...original }',
        '',
        'copy.name = "Bob"',
        '',
        'console.log(original.name)',
        'console.log(copy.name)',
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
          description: 'let original = { name: "Alice", age: 25 } - Object created in heap.',
          phase: 'reference',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 2,
          codeLine: 1,
          description: 'let copy = { ...original } - Spread creates a NEW object #2 with COPIED values!',
          phase: 'spread',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2', highlight: 'new' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#2', highlight: 'new' },
          ],
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: 'copy.name = "Bob" - Only modifies #2. original (#1) is NOT affected!',
          phase: 'mutate',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob', highlight: 'changed' }, { key: 'age', value: 25 }], label: '#2', highlight: 'mutated' },
          ],
          output: [],
        },
        {
          id: 4,
          codeLine: 5,
          description: 'console.log(original.name) outputs "Alice" - original is unchanged!',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#2' },
          ],
          output: ['Alice'],
        },
        {
          id: 5,
          codeLine: 6,
          description: 'console.log(copy.name) outputs "Bob" - copy has its own independent data.',
          phase: 'result',
          stack: [
            { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
            { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2' },
          ],
          heap: [
            { id: 'obj1', type: 'object', properties: [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }], label: '#1' },
            { id: 'obj2', type: 'object', properties: [{ key: 'name', value: 'Bob' }, { key: 'age', value: 25 }], label: '#2' },
          ],
          output: ['Alice', 'Bob'],
        },
      ],
      insight: 'Spread { ...obj } creates a NEW object. Changes to the copy don\'t affect the original!',
    },
  ],
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
