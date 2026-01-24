'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './VariablesViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'

type VariableState =
  | 'not-declared'
  | 'hoisted-undefined'
  | 'hoisted-tdz'
  | 'initialized'
  | 'error'

interface Variable {
  name: string
  keyword: 'var' | 'let' | 'const'
  value: string | undefined
  state: VariableState
  scope: string
  scopeLevel: number
}

interface Scope {
  id: string
  type: 'global' | 'function' | 'block'
  name: string
  level: number
  variables: string[]
}

interface VariableStep {
  id: number
  codeLine: number
  description: string
  phase: 'creation' | 'execution'
  action: 'declare' | 'hoist' | 'access' | 'assign' | 'lookup' | 'error'
  variables: Variable[]
  scopes?: Scope[]
  lookupPath?: string[]
  output: string[]
  error?: string
}

interface VariableExample {
  id: string
  title: string
  code: string[]
  steps: VariableStep[]
  insight: string
  whyItMatters?: string
}

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const stateColors: Record<VariableState, string> = {
  'not-declared': '#6b7280',
  'hoisted-undefined': '#f59e0b',
  'hoisted-tdz': '#ef4444',
  'initialized': '#10b981',
  'error': '#ef4444'
}

const keywordColors: Record<'var' | 'let' | 'const', string> = {
  var: '#f59e0b',
  let: '#3b82f6',
  const: '#10b981'
}

const stateLabels: Record<VariableState, string> = {
  'not-declared': 'not declared',
  'hoisted-undefined': 'hoisted',
  'hoisted-tdz': 'TDZ',
  'initialized': 'initialized',
  'error': 'error'
}

const examples: Record<Level, VariableExample[]> = {
  beginner: [
    {
      id: 'var-declaration',
      title: 'var hoisting',
      code: [
        'console.log(x);',
        'var x = 5;',
        'console.log(x);',
      ],
      steps: [
        {
          id: 0,
          codeLine: -1,
          description: 'Before execution starts, JavaScript scans the code and hoists var declarations to the top.',
          phase: 'creation',
          action: 'hoist',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 0,
          description: 'We try to access x before its declaration line. Because var hoists, x exists but is undefined.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: 'undefined', state: 'hoisted-undefined', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined']
        },
        {
          id: 2,
          codeLine: 1,
          description: 'Now we reach the actual declaration. The assignment happens: x gets the value 5.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined']
        },
        {
          id: 3,
          codeLine: 2,
          description: 'Accessing x again now returns 5, since the assignment has happened.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined', '5']
        },
        {
          id: 4,
          codeLine: -1,
          description: 'Done! var hoists the declaration but NOT the assignment. That is why we saw undefined first.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'var', value: '5', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['undefined', '5']
        }
      ],
      insight: 'var declarations are hoisted to the top of their scope and initialized with undefined. The assignment stays where you wrote it.',
      whyItMatters: 'Understanding hoisting prevents confusing bugs where variables seem to exist before declaration.'
    },
    {
      id: 'let-declaration',
      title: 'let basics',
      code: [
        'let y = 10;',
        'console.log(y);',
        'y = 20;',
        'console.log(y);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'let declares and initializes y with the value 10 in one step.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'y', keyword: 'let', value: '10', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We access y. It exists and has the value 10.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '10', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10']
        },
        {
          id: 2,
          codeLine: 2,
          description: 'We reassign y to a new value. let allows reassignment (unlike const).',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10']
        },
        {
          id: 3,
          codeLine: 3,
          description: 'Accessing y again shows the updated value 20.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10', '20']
        },
        {
          id: 4,
          codeLine: -1,
          description: 'Done! let creates block-scoped variables that can be reassigned but not redeclared.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'y', keyword: 'let', value: '20', state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['10', '20']
        }
      ],
      insight: 'let creates block-scoped variables. Unlike var, let does not hoist in a usable way - accessing before declaration throws an error.',
      whyItMatters: 'let is the modern choice for variables that need to change. It prevents accidental redeclaration.'
    },
    {
      id: 'const-declaration',
      title: 'const with objects',
      code: [
        "const person = { name: 'Alice' };",
        "person.name = 'Bob';",
        'console.log(person.name);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: 'const creates a constant binding. The variable person now points to an object.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Alice' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We modify a property INSIDE the object. This is allowed! const only prevents reassigning the variable itself.',
          phase: 'execution',
          action: 'assign',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 2,
          description: "Accessing person.name shows 'Bob'. The object's internals changed, but person still points to the same object.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['Bob']
        },
        {
          id: 3,
          codeLine: -1,
          description: 'Done! const prevents reassignment (person = something), but object mutations are allowed.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'person', keyword: 'const', value: "{ name: 'Bob' }", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['Bob']
        }
      ],
      insight: 'const creates a constant BINDING, not a constant VALUE. You cannot reassign the variable, but you CAN mutate objects and arrays.',
      whyItMatters: 'This is a common gotcha! Many developers think const makes objects immutable - it does not.'
    },
    {
      id: 'basic-block-scope',
      title: 'Block scope',
      code: [
        "let x = 'outer';",
        'if (true) {',
        "  let x = 'inner';",
        '  console.log(x);',
        '}',
        'console.log(x);',
      ],
      steps: [
        {
          id: 0,
          codeLine: 0,
          description: "We declare x in the outer (global) scope with the value 'outer'.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 1,
          codeLine: 1,
          description: 'We enter the if block. This creates a new block scope.',
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: [] }
          ],
          output: []
        },
        {
          id: 2,
          codeLine: 2,
          description: "Inside the block, we declare a NEW x. This shadows (hides) the outer x within this block.",
          phase: 'execution',
          action: 'declare',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'block:1', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: ['x'] }
          ],
          output: []
        },
        {
          id: 3,
          codeLine: 3,
          description: "console.log(x) inside the block finds the inner x first. It logs 'inner'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 },
            { name: 'x', keyword: 'let', value: "'inner'", state: 'initialized', scope: 'block:1', scopeLevel: 1 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] },
            { id: 'block:1', type: 'block', name: 'if block', level: 1, variables: ['x'] }
          ],
          lookupPath: ['block:1', 'global'],
          output: ['inner']
        },
        {
          id: 4,
          codeLine: 4,
          description: 'We exit the if block. The inner x is destroyed - it only existed within that block.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['inner']
        },
        {
          id: 5,
          codeLine: 5,
          description: "console.log(x) outside the block finds the outer x. It logs 'outer'.",
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          scopes: [
            { id: 'global', type: 'global', name: 'Global', level: 0, variables: ['x'] }
          ],
          output: ['inner', 'outer']
        },
        {
          id: 6,
          codeLine: -1,
          description: 'Done! let creates block-scoped variables. The inner x only existed inside the if block.',
          phase: 'execution',
          action: 'access',
          variables: [
            { name: 'x', keyword: 'let', value: "'outer'", state: 'initialized', scope: 'global', scopeLevel: 0 }
          ],
          output: ['inner', 'outer']
        }
      ],
      insight: 'let and const are block-scoped. Variables declared inside {} only exist within that block. This prevents accidental variable collisions.',
      whyItMatters: 'Block scope is why let/const are preferred. Each block can have its own isolated variables.'
    }
  ],
  intermediate: [],
  advanced: []
}

export function VariablesViz() {
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

  if (!currentExample || !currentStep) {
    return <div className={styles.container}>No examples available for this level.</div>
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

        <div className={styles.variablesBox}>
          <div className={styles.boxHeader}>Variables</div>
          <div className={styles.boxContent}>
            <AnimatePresence mode="popLayout">
              {currentStep.variables.length === 0 ? (
                <span className={styles.placeholder}>No variables yet</span>
              ) : (
                currentStep.variables.map((v, idx) => (
                  <motion.div
                    key={`${v.name}-${v.scope}-${idx}`}
                    className={styles.variable}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{ borderColor: keywordColors[v.keyword] }}
                    layout
                  >
                    <span
                      className={styles.varKeyword}
                      style={{ color: keywordColors[v.keyword] }}
                    >
                      {v.keyword}
                    </span>
                    <span className={styles.varName}>{v.name}</span>
                    <span className={styles.varEquals}>=</span>
                    <motion.span
                      key={v.value}
                      className={styles.varValue}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      {v.value}
                    </motion.span>
                    <span
                      className={styles.varState}
                      style={{
                        background: `${stateColors[v.state]}20`,
                        color: stateColors[v.state],
                        borderColor: `${stateColors[v.state]}40`
                      }}
                    >
                      {stateLabels[v.state]}
                    </span>
                    {v.scopeLevel > 0 && (
                      <span className={styles.varScope}>
                        {v.scope}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {currentStep.scopes && currentStep.scopes.length > 1 && (
        <div className={styles.scopesPanel}>
          <div className={styles.boxHeader}>Scope Chain</div>
          <div className={styles.scopesContent}>
            {currentStep.scopes.map((scope, idx) => (
              <motion.div
                key={scope.id}
                className={styles.scopeBox}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  marginLeft: `${scope.level * 1.5}rem`
                }}
              >
                <span className={styles.scopeType}>{scope.type}</span>
                <span className={styles.scopeName}>{scope.name}</span>
                {scope.variables.length > 0 && (
                  <span className={styles.scopeVars}>
                    [{scope.variables.join(', ')}]
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.outputBox}>
        <div className={styles.boxHeader}>Console Output</div>
        <div className={styles.outputContent}>
          <AnimatePresence>
            {currentStep.output.length === 0 ? (
              <span className={styles.placeholder}>No output yet</span>
            ) : (
              currentStep.output.map((line, i) => (
                <motion.div
                  key={`output-${i}`}
                  className={`${styles.outputLine} ${
                    i === currentStep.output.length - 1 &&
                    currentStep.action === 'access'
                      ? styles.currentOutput
                      : ''
                  }`}
                  initial={
                    i === currentStep.output.length - 1
                      ? { opacity: 0, x: -10 }
                      : undefined
                  }
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

      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <span className={styles.legendTitle}>Keywords:</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.var }} />
            <span>var (function scope)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.let }} />
            <span>let (block scope)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: keywordColors.const }} />
            <span>const (constant)</span>
          </div>
        </div>
        <div className={styles.legendSection}>
          <span className={styles.legendTitle}>States:</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: stateColors['hoisted-undefined'] }} />
            <span>hoisted</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: stateColors['initialized'] }} />
            <span>initialized</span>
          </div>
        </div>
      </div>
    </div>
  )
}
