import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './V8EngineViz.module.css'

interface PipelineStage {
  name: string
  content: string
  active: boolean
  optimized?: boolean
}

interface Step {
  description: string
  codeLine: number
  pipeline: PipelineStage[]
  hiddenClass?: string
  callCount?: number
  output: string[]
  phase: 'parsing' | 'interpreting' | 'optimizing' | 'deoptimizing' | 'idle'
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'compilation-pipeline',
      title: 'Compilation Pipeline',
      code: [
        'function add(a, b) {',
        '  return a + b;',
        '}',
        '',
        '// First call: Interpreted',
        'add(1, 2);',
        '',
        '// Many calls: Gets optimized!',
        'for (let i = 0; i < 1000; i++) {',
        '  add(i, i);',
        '}',
      ],
      steps: [
        {
          description: 'V8 receives your JavaScript source code',
          codeLine: -1,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: true },
            { name: 'Parser', content: '...', active: false },
            { name: 'AST', content: '...', active: false },
            { name: 'Ignition', content: '...', active: false },
            { name: 'TurboFan', content: '...', active: false },
          ],
          output: [],
          phase: 'idle',
        },
        {
          description: 'Parser tokenizes and parses the code',
          codeLine: 0,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Tokenizing...', active: true },
            { name: 'AST', content: '...', active: false },
            { name: 'Ignition', content: '...', active: false },
            { name: 'TurboFan', content: '...', active: false },
          ],
          output: [],
          phase: 'parsing',
        },
        {
          description: 'Abstract Syntax Tree (AST) is built',
          codeLine: 0,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: true },
            { name: 'Ignition', content: '...', active: false },
            { name: 'TurboFan', content: '...', active: false },
          ],
          output: [],
          phase: 'parsing',
        },
        {
          description: 'Ignition compiles AST to bytecode',
          codeLine: 0,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: false },
            { name: 'Ignition', content: 'Ldar a0\\nAdd a1\\nReturn', active: true },
            { name: 'TurboFan', content: '...', active: false },
          ],
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'First call: add(1, 2) - Interpreted via bytecode',
          codeLine: 5,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: false },
            { name: 'Ignition', content: 'Executing bytecode...', active: true },
            { name: 'TurboFan', content: 'Waiting...', active: false },
          ],
          callCount: 1,
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'Loop runs many times - V8 tracks call frequency',
          codeLine: 8,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: false },
            { name: 'Ignition', content: 'Profiling...', active: true },
            { name: 'TurboFan', content: 'Function is HOT!', active: false },
          ],
          callCount: 500,
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'Function is "hot" - TurboFan kicks in to optimize!',
          codeLine: 9,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: false },
            { name: 'Ignition', content: 'Handing off...', active: false },
            { name: 'TurboFan', content: 'Optimizing for numbers!', active: true, optimized: true },
          ],
          callCount: 1000,
          output: [],
          phase: 'optimizing',
        },
        {
          description: 'TurboFan generates optimized machine code. Future calls are FAST!',
          codeLine: -1,
          pipeline: [
            { name: 'Source', content: 'function add(a, b) {...}', active: false },
            { name: 'Parser', content: 'Done', active: false },
            { name: 'AST', content: 'FunctionDecl → ReturnStmt → BinaryExpr', active: false },
            { name: 'Ignition', content: 'Bypassed', active: false },
            { name: 'TurboFan', content: 'Native x64 code!', active: true, optimized: true },
          ],
          callCount: 1000,
          output: [],
          phase: 'optimizing',
        },
      ],
      insight: 'V8 uses two compilers: Ignition (fast startup) and TurboFan (fast execution). Hot code gets optimized!'
    },
    {
      id: 'jit-basics',
      title: 'JIT Compilation',
      code: [
        '// JIT = Just-In-Time compilation',
        '',
        'function multiply(x) {',
        '  return x * 2;',
        '}',
        '',
        '// Cold: Interpreted',
        'multiply(5);',
        '',
        '// Hot: Compiled to machine code',
        'for (let i = 0; i < 10000; i++) {',
        '  multiply(i);',
        '}',
      ],
      steps: [
        {
          description: 'JIT compiles code "just in time" - not ahead of time',
          codeLine: 0,
          pipeline: [
            { name: 'Source', content: 'multiply(x) {...}', active: true },
            { name: 'Ignition', content: 'Ready', active: false },
            { name: 'TurboFan', content: 'Waiting', active: false },
          ],
          output: [],
          phase: 'idle',
        },
        {
          description: 'First call: multiply(5) - Runs as interpreted bytecode',
          codeLine: 7,
          pipeline: [
            { name: 'Source', content: 'multiply(x) {...}', active: false },
            { name: 'Ignition', content: 'Interpreting...', active: true },
            { name: 'TurboFan', content: 'Collecting data', active: false },
          ],
          callCount: 1,
          output: ['10'],
          phase: 'interpreting',
        },
        {
          description: 'V8 profiles: "multiply always receives numbers"',
          codeLine: 10,
          pipeline: [
            { name: 'Source', content: 'multiply(x) {...}', active: false },
            { name: 'Ignition', content: 'Profiling types...', active: true },
            { name: 'TurboFan', content: 'Learning patterns', active: false },
          ],
          callCount: 100,
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'Hot function detected! TurboFan optimizes assuming x is always a number',
          codeLine: 11,
          pipeline: [
            { name: 'Source', content: 'multiply(x) {...}', active: false },
            { name: 'Ignition', content: 'Handing off', active: false },
            { name: 'TurboFan', content: 'Optimizing: x is Number', active: true, optimized: true },
          ],
          callCount: 10000,
          output: [],
          phase: 'optimizing',
        },
        {
          description: 'Optimized! Now multiply runs as native machine code',
          codeLine: -1,
          pipeline: [
            { name: 'Source', content: 'multiply(x) {...}', active: false },
            { name: 'Ignition', content: 'Bypassed', active: false },
            { name: 'TurboFan', content: 'OPTIMIZED!', active: true, optimized: true },
          ],
          callCount: 10000,
          output: [],
          phase: 'optimizing',
        },
      ],
      insight: 'JIT = Just-In-Time. V8 interprets first, then optimizes hot paths based on actual usage patterns.'
    },
  ],
  intermediate: [
    {
      id: 'hidden-classes',
      title: 'Hidden Classes',
      code: [
        'function Point(x, y) {',
        '  this.x = x;',
        '  this.y = y;',
        '}',
        '',
        'let p1 = new Point(1, 2);',
        'let p2 = new Point(3, 4);',
        '',
        '// Same hidden class = fast!',
        'console.log(p1.x, p2.x);',
      ],
      steps: [
        {
          description: 'V8 creates hidden classes (shapes) for objects',
          codeLine: -1,
          pipeline: [
            { name: 'Object', content: '{}', active: true },
            { name: 'Hidden Class', content: 'C0 (empty)', active: true },
          ],
          hiddenClass: 'C0: {}',
          output: [],
          phase: 'idle',
        },
        {
          description: 'new Point(1, 2) - Empty object created with class C0',
          codeLine: 5,
          pipeline: [
            { name: 'Object', content: 'p1 = {}', active: true },
            { name: 'Hidden Class', content: 'C0', active: true },
          ],
          hiddenClass: 'C0: {}',
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'this.x = 1 - Transition to new hidden class C1',
          codeLine: 1,
          pipeline: [
            { name: 'Object', content: 'p1 = { x: 1 }', active: true },
            { name: 'Hidden Class', content: 'C0 → C1', active: true },
          ],
          hiddenClass: 'C1: { x: @offset0 }',
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'this.y = 2 - Transition to hidden class C2',
          codeLine: 2,
          pipeline: [
            { name: 'Object', content: 'p1 = { x: 1, y: 2 }', active: true },
            { name: 'Hidden Class', content: 'C1 → C2', active: true },
          ],
          hiddenClass: 'C2: { x: @0, y: @1 }',
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'new Point(3, 4) - p2 follows SAME transition path!',
          codeLine: 6,
          pipeline: [
            { name: 'Object', content: 'p2 = { x: 3, y: 4 }', active: true },
            { name: 'Hidden Class', content: 'C2 (reused!)', active: true, optimized: true },
          ],
          hiddenClass: 'C2: { x: @0, y: @1 }',
          output: [],
          phase: 'optimizing',
        },
        {
          description: 'Both p1 and p2 share hidden class C2 - V8 can optimize!',
          codeLine: 9,
          pipeline: [
            { name: 'p1', content: 'Class: C2', active: true, optimized: true },
            { name: 'p2', content: 'Class: C2', active: true, optimized: true },
          ],
          hiddenClass: 'Shared C2: FAST property access!',
          output: ['1, 3'],
          phase: 'optimizing',
        },
      ],
      insight: 'Objects with same property order share hidden classes. This enables fast property access like static languages!'
    },
    {
      id: 'breaking-hidden-class',
      title: 'Breaking Hidden Classes',
      code: [
        'function Point(x, y) {',
        '  this.x = x;',
        '  this.y = y;',
        '}',
        '',
        'let p1 = new Point(1, 2);',
        'let p2 = new Point(3, 4);',
        '',
        '// BAD: Adding property!',
        'p1.z = 5;',
        '',
        '// Now p1 and p2 have different classes',
      ],
      steps: [
        {
          description: 'Both points created with same hidden class C2',
          codeLine: 6,
          pipeline: [
            { name: 'p1', content: '{ x: 1, y: 2 }', active: true },
            { name: 'p2', content: '{ x: 3, y: 4 }', active: true },
            { name: 'Class', content: 'Both: C2', active: true, optimized: true },
          ],
          hiddenClass: 'C2: { x: @0, y: @1 }',
          output: [],
          phase: 'optimizing',
        },
        {
          description: 'p1.z = 5 - Oops! p1 transitions to NEW class C3',
          codeLine: 9,
          pipeline: [
            { name: 'p1', content: '{ x: 1, y: 2, z: 5 }', active: true },
            { name: 'p2', content: '{ x: 3, y: 4 }', active: false },
            { name: 'Class', content: 'p1: C3, p2: C2', active: true },
          ],
          hiddenClass: 'DIFFERENT CLASSES!',
          output: [],
          phase: 'deoptimizing',
        },
        {
          description: 'V8 cannot optimize operations on p1 and p2 together anymore',
          codeLine: 11,
          pipeline: [
            { name: 'p1', content: 'Class: C3', active: true },
            { name: 'p2', content: 'Class: C2', active: true },
            { name: 'Status', content: 'Polymorphic (slow)', active: true },
          ],
          hiddenClass: 'Polymorphic: Multiple shapes!',
          output: [],
          phase: 'deoptimizing',
        },
        {
          description: 'TIP: Initialize ALL properties in constructor to keep classes stable',
          codeLine: -1,
          pipeline: [
            { name: 'Good', content: 'this.z = null', active: true, optimized: true },
            { name: 'Bad', content: 'obj.z = 5 later', active: true },
          ],
          hiddenClass: 'Initialize all props upfront!',
          output: [],
          phase: 'idle',
        },
      ],
      insight: 'Adding properties after creation breaks hidden class sharing. Initialize ALL properties in the constructor!'
    },
  ],
  advanced: [
    {
      id: 'deoptimization',
      title: 'Deoptimization',
      code: [
        'function add(a, b) {',
        '  return a + b;',
        '}',
        '',
        '// Optimize for numbers',
        'for (let i = 0; i < 10000; i++) {',
        '  add(i, i);',
        '}',
        '',
        '// Type change triggers DEOPT!',
        'add("hello", "world");',
      ],
      steps: [
        {
          description: 'Function add() gets called many times with numbers',
          codeLine: 5,
          pipeline: [
            { name: 'Ignition', content: 'Profiling...', active: true },
            { name: 'Type Feedback', content: 'a: Number, b: Number', active: true },
            { name: 'TurboFan', content: 'Watching...', active: false },
          ],
          callCount: 100,
          output: [],
          phase: 'interpreting',
        },
        {
          description: 'TurboFan optimizes assuming a and b are ALWAYS numbers',
          codeLine: 6,
          pipeline: [
            { name: 'Ignition', content: 'Handing off', active: false },
            { name: 'Type Feedback', content: 'a: Number, b: Number', active: true },
            { name: 'TurboFan', content: 'Optimized for Number + Number', active: true, optimized: true },
          ],
          callCount: 10000,
          output: [],
          phase: 'optimizing',
        },
        {
          description: 'add("hello", "world") - STRINGS! Assumption violated!',
          codeLine: 10,
          pipeline: [
            { name: 'Ignition', content: 'Standby', active: false },
            { name: 'Type Feedback', content: 'a: String?!', active: true },
            { name: 'TurboFan', content: 'BAILOUT!', active: true },
          ],
          callCount: 10001,
          output: [],
          phase: 'deoptimizing',
        },
        {
          description: 'DEOPTIMIZATION: V8 throws away optimized code, returns to interpreter',
          codeLine: 10,
          pipeline: [
            { name: 'Ignition', content: 'Taking over again', active: true },
            { name: 'Type Feedback', content: 'Now polymorphic', active: true },
            { name: 'TurboFan', content: 'Discarded', active: false },
          ],
          output: ['helloworld'],
          phase: 'deoptimizing',
        },
        {
          description: 'V8 may re-optimize later with new type assumptions',
          codeLine: -1,
          pipeline: [
            { name: 'Ignition', content: 'Interpreting again', active: true },
            { name: 'Type Feedback', content: 'Relearning...', active: true },
            { name: 'TurboFan', content: 'Will try again', active: false },
          ],
          output: ['helloworld'],
          phase: 'interpreting',
        },
      ],
      insight: 'Deoptimization happens when runtime behavior differs from optimization assumptions. Keep types consistent!'
    },
    {
      id: 'inline-caching',
      title: 'Inline Caching',
      code: [
        'function getX(obj) {',
        '  return obj.x;',
        '}',
        '',
        '// Monomorphic: Same shape',
        'let a = { x: 1, y: 2 };',
        'let b = { x: 3, y: 4 };',
        'getX(a); getX(b);',
        '',
        '// Polymorphic: Different shapes',
        'let c = { x: 5 };',
        'getX(c);  // Slower!',
      ],
      steps: [
        {
          description: 'getX(obj) accesses obj.x - V8 caches the lookup',
          codeLine: 0,
          pipeline: [
            { name: 'Inline Cache', content: 'Empty', active: true },
            { name: 'Lookup', content: 'Unknown shape', active: false },
          ],
          output: [],
          phase: 'idle',
        },
        {
          description: 'getX(a) - First call, V8 learns shape of a',
          codeLine: 7,
          pipeline: [
            { name: 'Inline Cache', content: 'Shape: {x,y} → offset 0', active: true },
            { name: 'Status', content: 'MONOMORPHIC', active: true, optimized: true },
          ],
          output: ['1'],
          phase: 'optimizing',
        },
        {
          description: 'getX(b) - Same shape as a! Cache HIT, super fast',
          codeLine: 7,
          pipeline: [
            { name: 'Inline Cache', content: 'HIT! Same shape', active: true, optimized: true },
            { name: 'Status', content: 'MONOMORPHIC', active: true, optimized: true },
          ],
          output: ['1', '3'],
          phase: 'optimizing',
        },
        {
          description: 'getX(c) - Different shape {x only}! Cache becomes polymorphic',
          codeLine: 11,
          pipeline: [
            { name: 'Inline Cache', content: 'Shape 1: {x,y}\\nShape 2: {x}', active: true },
            { name: 'Status', content: 'POLYMORPHIC (slower)', active: true },
          ],
          output: ['1', '3', '5'],
          phase: 'deoptimizing',
        },
        {
          description: 'More shapes = more checks = slower. Keep object shapes consistent!',
          codeLine: -1,
          pipeline: [
            { name: 'Monomorphic', content: '1 shape = FAST', active: true, optimized: true },
            { name: 'Polymorphic', content: '2-4 shapes = OK', active: true },
            { name: 'Megamorphic', content: '5+ shapes = SLOW', active: true },
          ],
          output: [],
          phase: 'idle',
        },
      ],
      insight: 'Inline caching remembers property locations. Monomorphic (one shape) is fastest, megamorphic (many shapes) is slowest.'
    },
  ],
}

export function V8EngineViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const highlightedLine = currentStep.codeLine
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'parsing': return '#3b82f6'
      case 'interpreting': return '#a855f7'
      case 'optimizing': return '#10b981'
      case 'deoptimizing': return '#ef4444'
      case 'idle': return '#555'
    }
  }

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.panelHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase.charAt(0).toUpperCase() + currentStep.phase.slice(1)}
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Pipeline visualization - Neon Box */}
      <div className={`${styles.neonBox} ${styles.pipelineBox}`}>
        <div className={styles.neonBoxHeader}>V8 Pipeline</div>
        <div className={styles.neonBoxInner}>
          <div className={styles.pipelineContainer}>
            <AnimatePresence mode="popLayout">
              {currentStep.pipeline.map((stage, i) => (
                <motion.div
                  key={stage.name + i}
                  className={`${styles.pipelineStage} ${stage.active ? styles.active : ''} ${stage.optimized ? styles.optimized : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <div className={styles.stageName}>{stage.name}</div>
                  <div className={styles.stageContent}>{stage.content}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Call count & hidden class info - Neon Box */}
      {(currentStep.callCount !== undefined || currentStep.hiddenClass) && (
        <div className={`${styles.neonBox} ${styles.infoBox}`}>
          <div className={styles.neonBoxHeader}>Runtime Info</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.infoRow}>
              {currentStep.callCount !== undefined && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Call Count:</span>
                  <span className={styles.infoValue}>{currentStep.callCount.toLocaleString()}</span>
                </div>
              )}
              {currentStep.hiddenClass && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Hidden Class:</span>
                  <span className={styles.infoValue}>{currentStep.hiddenClass}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Output - Neon Box */}
      {currentStep.output.length > 0 && (
        <div className={`${styles.neonBox} ${styles.outputBox}`}>
          <div className={styles.neonBoxHeader}>Console Output</div>
          <div className={styles.neonBoxInner}>
            <div className={styles.output}>
              <span className={styles.outputLabel}>Output:</span>
              {currentStep.output.map((item, i) => (
                <span key={i} className={styles.outputItem}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
