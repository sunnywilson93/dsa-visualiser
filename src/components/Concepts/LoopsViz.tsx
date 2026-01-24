import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './LoopsViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type LoopPhase = 'init' | 'condition' | 'body' | 'update' | 'done'

interface LoopStep {
  id: number
  codeLine: number
  description: string
  phase: LoopPhase
  loopState: {
    iteration: number
    variable: string
    value: number | string
    condition: string
    conditionMet: boolean
  }
  output: string[]
  currentOutputIndex?: number
}

interface LoopExample {
  id: string
  title: string
  loopType: 'for' | 'while' | 'do-while' | 'for-of' | 'for-in'
  code: string[]
  steps: LoopStep[]
  insight: string
  whyItMatters?: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, LoopExample[]> = {
  beginner: [
    {
      id: 'basic-for',
      title: 'Basic for loop',
      loopType: 'for',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        '',
        'for (let i = 0; i < fruits.length; i++) {',
        '  console.log(fruits[i])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits. This is the data we want to loop through.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'The loop initializes i to 0. This variable will track which element we are on.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: 'Condition check: is 0 < 3? Yes! Since the condition is true, we enter the loop body.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "The loop body executes console.log(fruits[0]), which outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'After the body, i++ runs. i is now 1. This is the update step.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 2,
          description: 'Condition check: is 1 < 3? Yes! We enter the loop body again.',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log(fruits[1]) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'i++ runs again. i is now 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 2,
          description: 'Condition check: is 2 < 3? Yes! One more iteration.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log(fruits[2]) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'i++ runs. i is now 3.',
          phase: 'update',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: 2,
          description: 'Condition check: is 3 < 3? No! The condition is false, so the loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Loop complete! We successfully printed all 3 fruits.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'The for loop has 3 parts: initialization (let i = 0), condition (i < length), and update (i++). The condition is checked BEFORE each iteration.',
      whyItMatters: 'for loops are perfect when you know exactly how many times to iterate.',
    },
    {
      id: 'while-loop',
      title: 'while loop',
      loopType: 'while',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        'let i = 0',
        '',
        'while (i < fruits.length) {',
        '  console.log(fruits[i])',
        '  i++',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: '-', condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We declare i = 0 OUTSIDE the loop. This is how while loops differ from for loops.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'i', value: 0, condition: 'i < 3', conditionMet: false },
          output: [],
        },
        {
          id: 2,
          codeLine: 3,
          description: 'Condition check: is 0 < 3? Yes! We enter the loop body.',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 4,
          description: "console.log(fruits[0]) outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'i', value: 0, condition: '0 < 3', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 5,
          description: 'We manually increment i. In while loops, YOU control the update.',
          phase: 'update',
          loopState: { iteration: 1, variable: 'i', value: 1, condition: 'i < 3', conditionMet: false },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 3,
          description: 'Back to the condition: is 1 < 3? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 4,
          description: "console.log(fruits[1]) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'i', value: 1, condition: '1 < 3', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 5,
          description: 'i++ makes i = 2.',
          phase: 'update',
          loopState: { iteration: 2, variable: 'i', value: 2, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 3,
          description: 'Condition check: is 2 < 3? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 4,
          description: "console.log(fruits[2]) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'i', value: 2, condition: '2 < 3', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 5,
          description: 'i++ makes i = 3.',
          phase: 'update',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: 'i < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: 3,
          description: 'Condition check: is 3 < 3? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 12,
          codeLine: -1,
          description: 'Loop complete! while loops are great when you do not know how many iterations you need.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'i', value: 3, condition: '3 < 3', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'while loops check the condition BEFORE each iteration. You must manage the loop variable yourself - forgetting i++ causes infinite loops!',
      whyItMatters: 'Use while when you do not know the number of iterations upfront.',
    },
    {
      id: 'for-of',
      title: 'for...of array',
      loopType: 'for-of',
      code: [
        "const fruits = ['apple', 'banana', 'cherry']",
        '',
        'for (const fruit of fruits) {',
        '  console.log(fruit)',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an array with 3 fruits.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'fruit', value: '-', condition: 'has next?', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'for...of starts. Does the array have a first item? Yes!',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'fruit', value: '-', condition: 'has next?', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: "fruit gets the VALUE 'apple' directly. No index needed!",
          phase: 'init',
          loopState: { iteration: 1, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log(fruit) outputs 'apple'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: ['apple'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Does the array have another item? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'fruit', value: 'apple', condition: 'has next?', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 5,
          codeLine: 2,
          description: "fruit gets the next VALUE 'banana'.",
          phase: 'update',
          loopState: { iteration: 2, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log(fruit) outputs 'banana'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'Does the array have another item? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'fruit', value: 'banana', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 8,
          codeLine: 2,
          description: "fruit gets the last VALUE 'cherry'.",
          phase: 'update',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log(fruit) outputs 'cherry'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: true },
          output: ['apple', 'banana', 'cherry'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Does the array have another item? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
        {
          id: 11,
          codeLine: -1,
          description: 'Loop complete! for...of is the cleanest way to iterate array VALUES.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'fruit', value: 'cherry', condition: 'has next?', conditionMet: false },
          output: ['apple', 'banana', 'cherry'],
        },
      ],
      insight: 'for...of gives you VALUES directly. No index variable, no bounds checking. Perfect for when you just want each item.',
      whyItMatters: 'Use for...of for cleaner code when you do not need the index.',
    },
    {
      id: 'for-in',
      title: 'for...in object',
      loopType: 'for-in',
      code: [
        "const person = { name: 'Alice', age: 25, city: 'NYC' }",
        '',
        'for (const key in person) {',
        '  console.log(key, person[key])',
        '}',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'We create an object with 3 properties: name, age, and city.',
          phase: 'init',
          loopState: { iteration: 0, variable: 'key', value: '-', condition: 'has key?', conditionMet: false },
          output: [],
        },
        {
          id: 1,
          codeLine: 2,
          description: 'for...in starts. Does the object have a first key? Yes!',
          phase: 'condition',
          loopState: { iteration: 1, variable: 'key', value: '-', condition: 'has key?', conditionMet: true },
          output: [],
        },
        {
          id: 2,
          codeLine: 2,
          description: "key gets the KEY 'name' (not the value!).",
          phase: 'init',
          loopState: { iteration: 1, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: [],
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log('name', person['name']) outputs 'name Alice'.",
          phase: 'body',
          loopState: { iteration: 1, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
          currentOutputIndex: 0,
        },
        {
          id: 4,
          codeLine: 2,
          description: 'Does the object have another key? Yes!',
          phase: 'condition',
          loopState: { iteration: 2, variable: 'key', value: 'name', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
        },
        {
          id: 5,
          codeLine: 2,
          description: "key gets the next KEY 'age'.",
          phase: 'update',
          loopState: { iteration: 2, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice'],
        },
        {
          id: 6,
          codeLine: 3,
          description: "console.log('age', person['age']) outputs 'age 25'.",
          phase: 'body',
          loopState: { iteration: 2, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
          currentOutputIndex: 1,
        },
        {
          id: 7,
          codeLine: 2,
          description: 'Does the object have another key? Yes!',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'key', value: 'age', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
        },
        {
          id: 8,
          codeLine: 2,
          description: "key gets the last KEY 'city'.",
          phase: 'update',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25'],
        },
        {
          id: 9,
          codeLine: 3,
          description: "console.log('city', person['city']) outputs 'city NYC'.",
          phase: 'body',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: true },
          output: ['name Alice', 'age 25', 'city NYC'],
          currentOutputIndex: 2,
        },
        {
          id: 10,
          codeLine: 2,
          description: 'Does the object have another key? No! Loop exits.',
          phase: 'condition',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: false },
          output: ['name Alice', 'age 25', 'city NYC'],
        },
        {
          id: 11,
          codeLine: -1,
          description: 'Loop complete! for...in iterates over KEYS (property names), not values.',
          phase: 'done',
          loopState: { iteration: 3, variable: 'key', value: 'city', condition: 'has key?', conditionMet: false },
          output: ['name Alice', 'age 25', 'city NYC'],
        },
      ],
      insight: 'for...in gives you KEYS (property names). Use person[key] to get values. Warning: Do not use for...in on arrays - use for...of instead!',
      whyItMatters: 'Use for...in for objects. It iterates over enumerable properties.',
    },
  ],
  intermediate: [],
  advanced: [],
}

export function LoopsViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
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

        <div className={styles.loopStateBox}>
          <div className={styles.boxHeader}>Loop State</div>
          <div className={styles.boxContent}>
            <div className={styles.stateRow}>
              <span className={styles.stateLabel}>Iteration:</span>
              <motion.span
                key={currentStep.loopState.iteration}
                className={styles.stateValue}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {currentStep.loopState.iteration}
              </motion.span>
            </div>
            <div className={styles.stateRow}>
              <span className={styles.stateLabel}>{currentStep.loopState.variable}:</span>
              <motion.span
                key={String(currentStep.loopState.value)}
                className={styles.stateValue}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {currentStep.loopState.value}
              </motion.span>
            </div>
            <div className={styles.conditionRow}>
              <span className={`${styles.condition} ${currentStep.loopState.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
                {currentStep.loopState.condition} = {currentStep.loopState.conditionMet ? 'true' : 'false'}
              </span>
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
                  className={`${styles.outputLine} ${i === currentStep.currentOutputIndex ? styles.currentOutput : ''}`}
                  initial={i === currentStep.currentOutputIndex ? { opacity: 0, x: -10 } : undefined}
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
