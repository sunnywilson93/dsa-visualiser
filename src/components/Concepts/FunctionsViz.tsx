import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './FunctionsViz.module.css'

type FunctionType = 'declaration' | 'expression' | 'arrow'

interface FunctionInfo {
  id: FunctionType
  name: string
  color: string
  syntax: string
  features: string[]
  hoisted: boolean
  hasThis: boolean
}

const functionTypes: FunctionInfo[] = [
  {
    id: 'declaration',
    name: 'Function Declaration',
    color: '#10b981',
    syntax: `function greet(name) {
  return "Hello, " + name;
}

// Can call BEFORE definition
greet("Alice"); // Works!`,
    features: ['Hoisted (can call before definition)', 'Has its own "this"', 'Can be named'],
    hoisted: true,
    hasThis: true,
  },
  {
    id: 'expression',
    name: 'Function Expression',
    color: '#3b82f6',
    syntax: `const greet = function(name) {
  return "Hello, " + name;
};

// Must define BEFORE calling
// greet("Alice"); // Error if above!`,
    features: ['NOT hoisted', 'Has its own "this"', 'Can be anonymous or named'],
    hoisted: false,
    hasThis: true,
  },
  {
    id: 'arrow',
    name: 'Arrow Function',
    color: '#8b5cf6',
    syntax: `const greet = (name) => {
  return "Hello, " + name;
};

// Short syntax (implicit return)
const greet2 = name => "Hello, " + name;`,
    features: ['NOT hoisted', 'NO own "this" (inherits)', 'Concise syntax', 'Implicit return option'],
    hoisted: false,
    hasThis: false,
  },
]

interface Step {
  code: string[]
  description: string
  highlight: number
  output?: string
}

const currentStepss: Record<FunctionType, Step[]> = {
  declaration: [
    {
      code: ['greet("Alice");  // Works!', '', 'function greet(name) {', '  return "Hello, " + name;', '}'],
      description: 'Function declarations are HOISTED. We can call greet() before it\'s defined!',
      highlight: 0,
    },
    {
      code: ['greet("Alice");  // Works!', '', 'function greet(name) {', '  return "Hello, " + name;', '}'],
      description: 'The function receives "Alice" as the name parameter.',
      highlight: 2,
    },
    {
      code: ['greet("Alice");  // Works!', '', 'function greet(name) {', '  return "Hello, " + name;', '}'],
      description: 'Returns the concatenated string "Hello, Alice".',
      highlight: 3,
      output: '"Hello, Alice"',
    },
  ],
  expression: [
    {
      code: ['// greet("Alice"); // Error!', '', 'const greet = function(name) {', '  return "Hello, " + name;', '};', '', 'greet("Bob");  // Works here'],
      description: 'Function expressions are NOT hoisted. Calling before definition throws an error!',
      highlight: 0,
    },
    {
      code: ['// greet("Alice"); // Error!', '', 'const greet = function(name) {', '  return "Hello, " + name;', '};', '', 'greet("Bob");  // Works here'],
      description: 'The function is assigned to the variable greet. Now it can be called.',
      highlight: 2,
    },
    {
      code: ['// greet("Alice"); // Error!', '', 'const greet = function(name) {', '  return "Hello, " + name;', '};', '', 'greet("Bob");  // Works here'],
      description: 'After definition, we can call greet() normally.',
      highlight: 6,
      output: '"Hello, Bob"',
    },
  ],
  arrow: [
    {
      code: ['const greet = (name) => {', '  return "Hello, " + name;', '};', '', 'const short = name => "Hi, " + name;', '', 'greet("Carol");'],
      description: 'Arrow functions use => syntax. They can have a block body with explicit return.',
      highlight: 0,
    },
    {
      code: ['const greet = (name) => {', '  return "Hello, " + name;', '};', '', 'const short = name => "Hi, " + name;', '', 'greet("Carol");'],
      description: 'Single-expression arrows can omit {} and return. This is implicit return.',
      highlight: 4,
    },
    {
      code: ['const greet = (name) => {', '  return "Hello, " + name;', '};', '', 'const short = name => "Hi, " + name;', '', 'greet("Carol");'],
      description: 'Arrow functions do NOT have their own "this" - they inherit from parent scope.',
      highlight: 6,
      output: '"Hello, Carol"',
    },
  ],
}

export function FunctionsViz() {
  const [selectedType, setSelectedType] = useState<FunctionType>('declaration')
  const [stepIndex, setStepIndex] = useState(0)
  const [showCall, setShowCall] = useState(false)

  const currentType = functionTypes.find(t => t.id === selectedType)!
  const currentSteps = currentStepss[selectedType]

  const handleTypeChange = (type: FunctionType) => {
    setSelectedType(type)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentSteps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  return (
    <div className={styles.container}>
      {/* Type selector */}
      <div className={styles.typeSelector}>
        {functionTypes.map(type => (
          <button
            key={type.id}
            className={`${styles.typeBtn} ${selectedType === type.id ? styles.active : ''}`}
            style={{
              borderColor: selectedType === type.id ? type.color : 'transparent',
              background: selectedType === type.id ? `${type.color}15` : 'transparent'
            }}
            onClick={() => handleTypeChange(type.id)}
          >
            <span className={styles.typeDot} style={{ background: type.color }} />
            {type.name}
          </button>
        ))}
      </div>

      <div className={styles.toggleRow}>
        <button
          className={`${styles.toggleBtn} ${!showCall ? styles.active : ''}`}
          onClick={() => setShowCall(false)}
        >
          Syntax
        </button>
        <button
          className={`${styles.toggleBtn} ${showCall ? styles.active : ''}`}
          onClick={() => { setShowCall(true); setStepIndex(0) }}
        >
          How Calls Work
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showCall ? (
          <motion.div
            key="syntax"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.codeCard} style={{ borderColor: currentType.color }}>
              <pre className={styles.code}>
                <code>{currentType.syntax}</code>
              </pre>
            </div>

            <div className={styles.features}>
              <h4 className={styles.featuresTitle}>Features</h4>
              <div className={styles.featureList}>
                {currentType.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className={styles.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className={styles.featureIcon} style={{ background: currentType.color }}>&#x2713;</span>
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={styles.badges}>
              <span className={`${styles.badge} ${currentType.hoisted ? styles.badgeGreen : styles.badgeRed}`}>
                {currentType.hoisted ? 'Hoisted' : 'Not Hoisted'}
              </span>
              <span className={`${styles.badge} ${currentType.hasThis ? styles.badgeBlue : styles.badgePurple}`}>
                {currentType.hasThis ? 'Has own "this"' : 'Inherits "this"'}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="call"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.callContent}
          >
            <div className={styles.codeCard}>
              <pre className={styles.code}>
                {currentSteps[stepIndex].code.map((line, i) => (
                  <div
                    key={i}
                    className={`${styles.codeLine} ${currentSteps[stepIndex].highlight === i ? styles.activeLine : ''}`}
                  >
                    {line || ' '}
                  </div>
                ))}
              </pre>
            </div>

            <div className={styles.description}>
              <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentSteps.length}</span>
              {currentSteps[stepIndex].description}
            </div>

            {currentSteps[stepIndex].output && (
              <div className={styles.outputBox}>
                <span className={styles.outputLabel}>Return value:</span>
                <code className={styles.outputValue}>{currentSteps[stepIndex].output}</code>
              </div>
            )}

            <div className={styles.controls}>
              <button
                className={styles.btnSecondary}
                onClick={handlePrev}
                disabled={stepIndex === 0}
              >
                Prev
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleNext}
                disabled={stepIndex === currentSteps.length - 1}
              >
                Next
              </button>
              <button
                className={styles.btnSecondary}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
