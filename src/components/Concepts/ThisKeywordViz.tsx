import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface Step {
  description: string
  thisValue: string
  thisExplanation: string
  highlightLine?: number
}

interface Example {
  id: string
  title: string
  bindingType: string
  color: string
  code: string[]
  steps: Step[]
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'implicit',
      title: 'Object Method',
      bindingType: 'Implicit Binding',
      color: 'var(--color-emerald-500)',
      code: [
        'const person = {',
        '  name: "Alice",',
        '  greet() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'person.greet();  // "Alice"',
      ],
      steps: [
        { description: 'person.greet() is called - look at what\'s LEFT of the dot', thisValue: 'person', thisExplanation: 'Rule: Object before dot = this', highlightLine: 7 },
        { description: 'Inside greet(), this refers to person', thisValue: '{ name: "Alice", greet: fn }', thisExplanation: 'this.name → "Alice"', highlightLine: 3 },
      ],
    },
    {
      id: 'default',
      title: 'Standalone Function',
      bindingType: 'Default Binding',
      color: 'var(--color-red-500)',
      code: [
        'function showThis() {',
        '  console.log(this);',
        '}',
        '',
        'showThis();  // No object!',
      ],
      steps: [
        { description: 'showThis() called without any object (no dot)', thisValue: 'window', thisExplanation: 'No object → falls back to global', highlightLine: 4 },
        { description: 'In strict mode ("use strict"), this would be undefined', thisValue: 'undefined (strict)', thisExplanation: 'Strict mode prevents accidental global access', highlightLine: 1 },
      ],
    },
  ],
  intermediate: [
    {
      id: 'call-apply',
      title: 'call() / apply()',
      bindingType: 'Explicit Binding',
      color: 'var(--color-purple-500)',
      code: [
        'function greet(greeting) {',
        '  console.log(greeting, this.name);',
        '}',
        '',
        'const bob = { name: "Bob" };',
        'const sue = { name: "Sue" };',
        '',
        'greet.call(bob, "Hello");',
        'greet.apply(sue, ["Hi"]);',
      ],
      steps: [
        { description: 'greet.call(bob, "Hello") - first arg becomes this', thisValue: 'bob', thisExplanation: 'call() sets this explicitly', highlightLine: 7 },
        { description: 'Output: "Hello Bob" - this.name is bob.name', thisValue: '{ name: "Bob" }', thisExplanation: 'Overrides default binding', highlightLine: 1 },
        { description: 'greet.apply(sue, ["Hi"]) - same but args in array', thisValue: 'sue', thisExplanation: 'apply() is call() with array args', highlightLine: 8 },
      ],
    },
    {
      id: 'bind',
      title: 'bind()',
      bindingType: 'Hard Binding',
      color: 'var(--color-purple-500)',
      code: [
        'const person = {',
        '  name: "Dave",',
        '  greet() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'const greet = person.greet;',
        'greet();  // undefined!',
        '',
        'const boundGreet = person.greet.bind(person);',
        'boundGreet();  // "Dave"',
      ],
      steps: [
        { description: 'Extracting method loses the object context', thisValue: 'window', thisExplanation: 'greet is just a function now', highlightLine: 7 },
        { description: 'Calling extracted greet() - no object, default binding', thisValue: 'window', thisExplanation: 'this.name → undefined', highlightLine: 8 },
        { description: 'bind() creates new function with this permanently set', thisValue: 'person', thisExplanation: 'bind() returns a bound function', highlightLine: 10 },
        { description: 'boundGreet() always uses person as this', thisValue: '{ name: "Dave" }', thisExplanation: 'Cannot be overridden!', highlightLine: 11 },
      ],
    },
    {
      id: 'arrow',
      title: 'Arrow Functions',
      bindingType: 'Lexical this',
      color: 'var(--color-amber-500)',
      code: [
        'const person = {',
        '  name: "Eve",',
        '  greet: () => {',
        '    console.log(this.name);',
        '  },',
        '  greetRegular() {',
        '    console.log(this.name);',
        '  }',
        '};',
        '',
        'person.greet();     // undefined!',
        'person.greetRegular(); // "Eve"',
      ],
      steps: [
        { description: 'Arrow functions DON\'T have their own this', thisValue: 'window (lexical)', thisExplanation: 'Ignores the dot rule entirely', highlightLine: 2 },
        { description: 'person.greet() - arrow looks UP to find this', thisValue: 'window', thisExplanation: 'Inherits from enclosing scope (global)', highlightLine: 10 },
        { description: 'Regular method works normally - dot rule applies', thisValue: 'person', thisExplanation: 'greetRegular uses implicit binding', highlightLine: 11 },
      ],
    },
  ],
  advanced: [
    {
      id: 'new-binding',
      title: 'new Keyword',
      bindingType: 'Constructor Binding',
      color: 'var(--color-amber-500)',
      code: [
        'function Person(name) {',
        '  // 1. Empty object created',
        '  // 2. this = new object',
        '  this.name = name;',
        '  this.greet = function() {',
        '    console.log(this.name);',
        '  };',
        '  // 3. Object returned',
        '}',
        '',
        'const p = new Person("Carol");',
      ],
      steps: [
        { description: 'new creates an empty object and sets it as this', thisValue: '{ }', thisExplanation: 'Fresh object created automatically', highlightLine: 10 },
        { description: 'this.name = name adds property to new object', thisValue: '{ name: "Carol" }', thisExplanation: 'Building the new instance', highlightLine: 3 },
        { description: 'this.greet adds method to the new object', thisValue: '{ name, greet }', thisExplanation: 'Method added to instance', highlightLine: 4 },
        { description: 'The constructed object is returned and assigned to p', thisValue: 'p = { name, greet }', thisExplanation: 'new binding has highest priority', highlightLine: 10 },
      ],
    },
    {
      id: 'callback-lost',
      title: 'Lost Binding',
      bindingType: 'Common Bug',
      color: 'var(--color-red-500)',
      code: [
        'const user = {',
        '  name: "Frank",',
        '  fetchData() {',
        '    setTimeout(function() {',
        '      console.log(this.name);',
        '    }, 100);',
        '  }',
        '};',
        '',
        'user.fetchData();  // undefined!',
      ],
      steps: [
        { description: 'user.fetchData() is called - implicit binding', thisValue: 'user', thisExplanation: 'So far so good...', highlightLine: 9 },
        { description: 'setTimeout receives the callback function', thisValue: 'user', thisExplanation: 'Callback is passed, not called yet', highlightLine: 3 },
        { description: 'Later: callback invoked by setTimeout (no dot!)', thisValue: 'window', thisExplanation: 'Callback loses its context!', highlightLine: 4 },
        { description: 'this.name is undefined - common source of bugs', thisValue: 'window', thisExplanation: 'Fix: use arrow fn or bind()', highlightLine: 4 },
      ],
    },
    {
      id: 'callback-fix',
      title: 'Fixed with Arrow',
      bindingType: 'Arrow Solution',
      color: 'var(--color-emerald-500)',
      code: [
        'const user = {',
        '  name: "Grace",',
        '  fetchData() {',
        '    setTimeout(() => {',
        '      console.log(this.name);',
        '    }, 100);',
        '  }',
        '};',
        '',
        'user.fetchData();  // "Grace"',
      ],
      steps: [
        { description: 'user.fetchData() - implicit binding, this = user', thisValue: 'user', thisExplanation: 'Method called with dot notation', highlightLine: 9 },
        { description: 'Arrow function created - captures this from fetchData', thisValue: 'user (captured)', thisExplanation: 'Arrow inherits enclosing this', highlightLine: 3 },
        { description: 'Later: arrow callback runs, uses captured this', thisValue: 'user', thisExplanation: 'Arrow "remembers" the this value', highlightLine: 4 },
        { description: 'this.name = "Grace" - problem solved!', thisValue: '{ name: "Grace" }', thisExplanation: 'Arrow fns are perfect for callbacks', highlightLine: 4 },
      ],
    },
  ],
}

export function ThisKeywordViz() {
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

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* Level selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
              ${level === lvl 
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
                : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
              }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full transition-all duration-150 cursor-pointer
              ${exampleIndex === i 
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
                : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <div className="grid grid-cols-2 gap-[var(--spacing-lg)] max-sm:grid-cols-1">
        {/* Code panel */}
        <div className="bg-[var(--color-black-40)] border border-[var(--color-white-8)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b" style={{ borderColor: currentExample.color }}>
            <span className="text-xs font-semibold text-[var(--color-gray-500)]">Code</span>
            <span className="px-[var(--spacing-sm)] py-0.5 rounded-full text-2xs font-semibold text-black" style={{ background: currentExample.color }}>{currentExample.bindingType}</span>
          </div>
          <pre className="m-0 py-[var(--spacing-sm)] max-h-52 overflow-y-auto">
            {currentExample.code.map((line, i) => (
              <div
                key={i}
                className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${currentStep.highlightLine === i ? 'bg-[var(--color-brand-primary-20)]' : ''}`}
              >
                <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
                <span className={`font-mono text-2xs ${currentStep.highlightLine === i ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-gray-300)]'}`}>{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Execution Context - Neon Box */}
        <div className="relative rounded-xl p-[3px]"
          style={{ background: 'linear-gradient(135deg, var(--color-blue-500), var(--color-brand-primary))' }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Execution Context
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[140px] p-[var(--spacing-md)] pt-6 flex flex-col items-center justify-center gap-[var(--spacing-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <div className="font-mono text-base text-[var(--color-gray-500)]">this =</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${level}-${exampleIndex}-${stepIndex}-${currentStep.thisValue}`}
                  className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] bg-[var(--color-black-40)] border-2 rounded-lg font-mono text-base font-semibold"
                  style={{ borderColor: currentExample.color, color: currentExample.color }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  {currentStep.thisValue}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-sm text-[var(--color-gray-500)] text-center">
              {currentStep.thisExplanation}
            </div>
          </div>
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-[var(--spacing-md)] py-2.5 bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-lg text-base text-[var(--color-gray-300)] text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={() => setStepIndex(0)}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Priority note */}
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-8)] border border-[var(--color-amber-20)] rounded-lg text-xs text-[var(--color-gray-500)] text-center">
        <strong className="text-[var(--difficulty-2)]">Binding Priority:</strong> new → explicit (call/apply/bind) → implicit (dot) → default (global).
        Arrow functions inherit this lexically from enclosing scope.
      </div>
    </div>
  )
}
