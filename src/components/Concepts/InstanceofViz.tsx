'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { StepControls } from '@/components/SharedViz'

interface InstanceofStep {
  description: string
  object: string
  constructor: string
  targetPrototype: string
  currentlyChecking: string | null
  checkedPrototypes: string[]
  result: boolean | null
  phase: 'setup' | 'checking' | 'result'
}

interface ChainNode {
  id: string
  name: string
  isInstance?: boolean
}

interface InstanceofExample {
  id: string
  title: string
  code: string
  chain: ChainNode[]
  targetPrototype: string
  steps: InstanceofStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, InstanceofExample[]> = {
  beginner: [
    {
      id: 'direct-match',
      title: 'Direct Match (true)',
      code: 'dog instanceof Animal',
      chain: [
        { id: 'dog', name: 'dog', isInstance: true },
        { id: 'Animal.prototype', name: 'Animal.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Animal.prototype',
      steps: [
        {
          description: 'Evaluating: dog instanceof Animal',
          object: 'dog',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Get the target: Animal.prototype (what we\'re looking for)',
          object: 'dog',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: dog.__proto__ === Animal.prototype?',
          object: 'dog',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Match found! dog.__proto__ IS Animal.prototype',
          object: 'dog',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'instanceof returns true when Constructor.prototype is found anywhere in the object\'s prototype chain.'
    },
    {
      id: 'chain-walk',
      title: 'Found Up Chain (true)',
      code: 'dog instanceof Object',
      chain: [
        { id: 'dog', name: 'dog', isInstance: true },
        { id: 'Animal.prototype', name: 'Animal.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Object.prototype',
      steps: [
        {
          description: 'Evaluating: dog instanceof Object',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Get the target: Object.prototype (what we\'re looking for)',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: dog.__proto__ === Object.prototype?',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'No match. dog.__proto__ is Animal.prototype, not Object.prototype',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Checking: Animal.prototype.__proto__ === Object.prototype?',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'Object.prototype',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Match found! Object.prototype exists in dog\'s prototype chain',
          object: 'dog',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'Object.prototype',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'Almost everything in JavaScript is an instanceof Object (arrays, functions, custom objects).'
    },
    {
      id: 'not-found',
      title: 'Not In Chain (false)',
      code: 'dog instanceof Array',
      chain: [
        { id: 'dog', name: 'dog', isInstance: true },
        { id: 'Animal.prototype', name: 'Animal.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Array.prototype',
      steps: [
        {
          description: 'Evaluating: dog instanceof Array',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Get the target: Array.prototype (what we\'re looking for)',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: dog.__proto__ === Array.prototype?',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'No match. Continue walking the chain...',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Checking: Animal.prototype.__proto__ === Array.prototype?',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Object.prototype',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'No match. Continue walking the chain...',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Object.prototype',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Checking: Object.prototype.__proto__ === Array.prototype?',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'null',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype', 'null'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Reached null (end of chain). Array.prototype was never found.',
          object: 'dog',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'null',
          checkedPrototypes: ['Animal.prototype', 'Object.prototype', 'null'],
          result: false,
          phase: 'result'
        }
      ],
      insight: 'instanceof returns false when the target prototype is not in the chain, or when chain ends at null.'
    }
  ],
  intermediate: [
    {
      id: 'class-extends',
      title: 'Class Inheritance',
      code: 'golden instanceof Dog\ngolden instanceof Animal\ngolden instanceof Object',
      chain: [
        { id: 'golden', name: 'golden', isInstance: true },
        { id: 'Dog.prototype', name: 'Dog.prototype' },
        { id: 'Animal.prototype', name: 'Animal.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Animal.prototype',
      steps: [
        {
          description: 'class Dog extends Animal creates a 3-level prototype chain',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Testing: golden instanceof Animal',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: golden.__proto__ === Animal.prototype?',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Dog.prototype',
          checkedPrototypes: ['Dog.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'No - golden.__proto__ is Dog.prototype. Continue...',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Dog.prototype',
          checkedPrototypes: ['Dog.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Checking: Dog.prototype.__proto__ === Animal.prototype?',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Dog.prototype', 'Animal.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Yes! Dog.prototype.__proto__ IS Animal.prototype. Result: true',
          object: 'golden',
          constructor: 'Animal',
          targetPrototype: 'Animal.prototype',
          currentlyChecking: 'Animal.prototype',
          checkedPrototypes: ['Dog.prototype', 'Animal.prototype'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'With class inheritance, instanceof returns true for parent classes. golden is Dog, Animal, AND Object.'
    },
    {
      id: 'primitives',
      title: 'Primitives vs Objects',
      code: '"hello" instanceof String  // false\nnew String("hello") instanceof String  // true',
      chain: [
        { id: '"hello"', name: '"hello" (primitive)', isInstance: true },
        { id: 'no-chain', name: '(primitives have no __proto__ for instanceof)' }
      ],
      targetPrototype: 'String.prototype',
      steps: [
        {
          description: 'Testing: "hello" instanceof String',
          object: '"hello"',
          constructor: 'String',
          targetPrototype: 'String.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: '"hello" is a primitive string, not an object',
          object: '"hello"',
          constructor: 'String',
          targetPrototype: 'String.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'checking'
        },
        {
          description: 'instanceof only works on objects. Primitives return false.',
          object: '"hello"',
          constructor: 'String',
          targetPrototype: 'String.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: false,
          phase: 'result'
        },
        {
          description: 'But new String("hello") creates a String object...',
          object: 'new String("hello")',
          constructor: 'String',
          targetPrototype: 'String.prototype',
          currentlyChecking: 'String.prototype',
          checkedPrototypes: ['String.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'new String("hello") instanceof String = true',
          object: 'new String("hello")',
          constructor: 'String',
          targetPrototype: 'String.prototype',
          currentlyChecking: 'String.prototype',
          checkedPrototypes: ['String.prototype'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'Use typeof for primitives, instanceof for objects. "hello".method() works due to auto-boxing.'
    },
    {
      id: 'array-check',
      title: 'Array Detection',
      code: '[1,2,3] instanceof Array  // true\n[1,2,3] instanceof Object // true',
      chain: [
        { id: 'arr', name: '[1, 2, 3]', isInstance: true },
        { id: 'Array.prototype', name: 'Array.prototype' },
        { id: 'Object.prototype', name: 'Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Array.prototype',
      steps: [
        {
          description: 'Testing: [1,2,3] instanceof Array',
          object: '[1,2,3]',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Get the target: Array.prototype',
          object: '[1,2,3]',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: [1,2,3].__proto__ === Array.prototype?',
          object: '[1,2,3]',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Array.prototype',
          checkedPrototypes: ['Array.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Yes! Direct match. Result: true',
          object: '[1,2,3]',
          constructor: 'Array',
          targetPrototype: 'Array.prototype',
          currentlyChecking: 'Array.prototype',
          checkedPrototypes: ['Array.prototype'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'Arrays are Objects too! Prefer Array.isArray() for reliable array detection across realms.'
    }
  ],
  advanced: [
    {
      id: 'cross-realm',
      title: 'Cross-Realm Issue',
      code: '// iframe.contentWindow.Array !== window.Array\niframeArr instanceof Array  // false!',
      chain: [
        { id: 'iframeArr', name: 'iframeArr (from iframe)', isInstance: true },
        { id: 'iframe.Array.prototype', name: 'iframe.Array.prototype' },
        { id: 'iframe.Object.prototype', name: 'iframe.Object.prototype' },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'window.Array.prototype',
      steps: [
        {
          description: 'Testing: iframeArr instanceof Array (from parent window)',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Target: window.Array.prototype (parent window\'s Array)',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: iframeArr.__proto__ === window.Array.prototype?',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: 'iframe.Array.prototype',
          checkedPrototypes: ['iframe.Array.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'No! iframe.Array.prototype !== window.Array.prototype',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: 'iframe.Array.prototype',
          checkedPrototypes: ['iframe.Array.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Each realm (iframe, worker) has its own global objects',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: 'iframe.Object.prototype',
          checkedPrototypes: ['iframe.Array.prototype', 'iframe.Object.prototype'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Reaches null. window.Array.prototype never found. Result: false',
          object: 'iframeArr',
          constructor: 'Array',
          targetPrototype: 'window.Array.prototype',
          currentlyChecking: 'null',
          checkedPrototypes: ['iframe.Array.prototype', 'iframe.Object.prototype', 'null'],
          result: false,
          phase: 'result'
        }
      ],
      insight: 'Cross-realm instanceof fails! Use Array.isArray() or Object.prototype.toString.call() instead.'
    },
    {
      id: 'symbol-hasinstance',
      title: 'Symbol.hasInstance',
      code: 'class Even {\n  static [Symbol.hasInstance](x) {\n    return x % 2 === 0\n  }\n}\n4 instanceof Even  // true!',
      chain: [
        { id: '4', name: '4 (number)', isInstance: true },
        { id: 'custom-check', name: 'Even[Symbol.hasInstance](4)' }
      ],
      targetPrototype: 'Even.prototype',
      steps: [
        {
          description: 'Testing: 4 instanceof Even',
          object: '4',
          constructor: 'Even',
          targetPrototype: 'Even.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Check if Even has Symbol.hasInstance method...',
          object: '4',
          constructor: 'Even',
          targetPrototype: 'Even.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Found! Calling Even[Symbol.hasInstance](4)',
          object: '4',
          constructor: 'Even',
          targetPrototype: 'Even.prototype',
          currentlyChecking: 'custom-check',
          checkedPrototypes: ['custom-check'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'Custom check: return 4 % 2 === 0 → true',
          object: '4',
          constructor: 'Even',
          targetPrototype: 'Even.prototype',
          currentlyChecking: 'custom-check',
          checkedPrototypes: ['custom-check'],
          result: true,
          phase: 'result'
        }
      ],
      insight: 'Symbol.hasInstance lets you customize instanceof behavior. Powerful for type guards and validators!'
    },
    {
      id: 'object-create-null',
      title: 'null Prototype',
      code: 'const dict = Object.create(null)\ndict instanceof Object  // false!',
      chain: [
        { id: 'dict', name: 'dict (no prototype)', isInstance: true },
        { id: 'null', name: 'null' }
      ],
      targetPrototype: 'Object.prototype',
      steps: [
        {
          description: 'Testing: dict instanceof Object',
          object: 'dict',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Object.create(null) creates object with __proto__ = null',
          object: 'dict',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: null,
          checkedPrototypes: [],
          result: null,
          phase: 'setup'
        },
        {
          description: 'Checking: dict.__proto__ === Object.prototype?',
          object: 'dict',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'null',
          checkedPrototypes: ['null'],
          result: null,
          phase: 'checking'
        },
        {
          description: 'dict.__proto__ is null immediately. No chain to walk.',
          object: 'dict',
          constructor: 'Object',
          targetPrototype: 'Object.prototype',
          currentlyChecking: 'null',
          checkedPrototypes: ['null'],
          result: false,
          phase: 'result'
        }
      ],
      insight: 'Object.create(null) objects are NOT instanceof Object! Great for dictionaries without prototype pollution.'
    }
  ]
}

export function InstanceofViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]
  const totalSteps = currentExample.steps.length

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
    if (stepIndex < totalSteps - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => {
    setStepIndex(0)
  }

  const isMatch = currentStep.result === true
  const isNoMatch = currentStep.result === false
  const isChecking = currentStep.phase === 'checking' && currentStep.result === null

  return (
    <div className="flex flex-col gap-5">
      {/* Level selector */}
      <div className="flex gap-2 justify-center bg-black-30 border border-white-10 rounded-full p-1.5 flex-wrap">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              level === lvl ? 'text-white' : 'bg-white-5 border border-transparent text-gray-500 hover:bg-white-10 hover:text-gray-300'
            }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap justify-center bg-black-30 border border-white-10 rounded-full p-1.5">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full transition-all ${
              exampleIndex === i
                ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white-5 border border-white-10 text-gray-500 hover:bg-white-10 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code display */}
      <div className="px-4 py-2 bg-black-40 border border-white-10 rounded-lg font-mono text-sm text-cyan-400 whitespace-pre-wrap">
        {currentExample.code}
      </div>

      {/* Main visualization: Chain + Target side by side */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* Left: Prototype Chain */}
        <div className="relative rounded-xl p-[2px]" style={{ background: 'var(--gradient-neon-purple)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gray-900 rounded-b-lg text-xs font-semibold text-white whitespace-nowrap z-10">
            Prototype Chain
          </div>
          <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-6">
            <div className="flex flex-col items-center gap-1">
              {currentExample.chain.map((node, index) => {
                const isCurrentlyChecking = currentStep.currentlyChecking === node.id
                const wasChecked = currentStep.checkedPrototypes.includes(node.id)
                const isFoundHere = isMatch && currentStep.currentlyChecking === node.id
                const isNull = node.id === 'null'
                const isNullAndFailed = isNull && isNoMatch

                return (
                  <div key={node.id} className="w-full max-w-[220px]">
                    <motion.div
                      className={`w-full border-2 rounded-lg overflow-hidden transition-all relative ${
                        isFoundHere
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : isNullAndFailed
                          ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : isCurrentlyChecking
                          ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : wasChecked
                          ? 'bg-white-5 border-gray-500'
                          : 'bg-black-30 border-white-10'
                      }`}
                      animate={{
                        scale: isCurrentlyChecking || isFoundHere ? 1.02 : 1
                      }}
                    >
                      <div
                        className={`px-2 py-1.5 text-xs font-semibold text-center ${
                          node.isInstance ? 'bg-purple-500 text-black' :
                          isNull ? 'bg-gray-700 text-gray-400' :
                          'bg-purple-500/50 text-white'
                        }`}
                      >
                        {node.name}
                      </div>
                      {!node.isInstance && !isNull && (
                        <div className="px-2 py-1 text-2xs text-gray-500 text-center">
                          prototype object
                        </div>
                      )}
                      {node.isInstance && (
                        <div className="px-2 py-1 text-2xs text-gray-500 text-center">
                          instance
                        </div>
                      )}
                      {isNull && (
                        <div className="px-2 py-1 text-2xs text-gray-600 text-center italic">
                          end of chain
                        </div>
                      )}
                      {isFoundHere && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check size={14} className="text-black" />
                        </motion.div>
                      )}
                      {isNullAndFailed && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <X size={14} className="text-black" />
                        </motion.div>
                      )}
                    </motion.div>
                    {index < currentExample.chain.length - 1 && (
                      <div
                        className={`text-center text-xs py-0.5 transition-colors ${
                          wasChecked && currentStep.checkedPrototypes.includes(currentExample.chain[index + 1]?.id)
                            ? 'text-purple-400'
                            : 'text-gray-700'
                        }`}
                      >
                        __proto__
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle: Comparison indicator */}
        <div className="hidden md:flex flex-col items-center justify-center h-full py-8">
          <AnimatePresence mode="wait">
            {isChecking && (
              <motion.div
                key="checking"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-2xl text-amber-500 font-mono">===?</div>
                <div className="text-xs text-gray-500">comparing</div>
              </motion.div>
            )}
            {isMatch && (
              <motion.div
                key="match"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-2xl text-emerald-500 font-mono">===</div>
                <div className="text-xs text-emerald-500 font-semibold">MATCH!</div>
              </motion.div>
            )}
            {isNoMatch && (
              <motion.div
                key="nomatch"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-2xl text-red-500 font-mono">!==</div>
                <div className="text-xs text-red-500 font-semibold">NOT FOUND</div>
              </motion.div>
            )}
            {currentStep.phase === 'setup' && (
              <motion.div
                key="setup"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-xl text-gray-500 font-mono">...</div>
                <div className="text-xs text-gray-500">setup</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Target prototype */}
        <div className="relative rounded-xl p-[2px]" style={{ background: 'var(--gradient-neon-cyan)' }}>
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gray-900 rounded-b-lg text-xs font-semibold text-white whitespace-nowrap z-10">
            Target (looking for)
          </div>
          <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-6 flex flex-col items-center justify-center">
            <motion.div
              className={`w-full max-w-[200px] border-2 rounded-lg overflow-hidden transition-all ${
                isMatch
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : isNoMatch
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-cyan-500 bg-cyan-500/10'
              }`}
              animate={{ scale: isMatch ? 1.05 : 1 }}
            >
              <div className="px-3 py-2 bg-cyan-500/30 text-cyan-300 text-sm font-semibold text-center">
                {currentStep.targetPrototype}
              </div>
              <div className="px-2 py-1.5 text-2xs text-gray-500 text-center">
                {currentStep.constructor}.prototype
              </div>
            </motion.div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              from: {currentStep.object} instanceof {currentStep.constructor}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile comparison indicator */}
      <div className="flex md:hidden justify-center">
        <AnimatePresence mode="wait">
          {isChecking && (
            <motion.div
              key="checking-mobile"
              className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Comparing === ?
            </motion.div>
          )}
          {isMatch && (
            <motion.div
              key="match-mobile"
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 text-sm font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              MATCH! ===
            </motion.div>
          )}
          {isNoMatch && (
            <motion.div
              key="nomatch-mobile"
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              NOT FOUND !==
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={`px-4 py-2.5 border rounded-lg text-base text-center ${
            isMatch
              ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400'
              : isNoMatch
              ? 'bg-red-500/10 border-red-400/20 text-red-400'
              : 'bg-black-30 border-white-10 text-gray-300'
          }`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Result badge */}
      {currentStep.result !== null && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={`px-6 py-2 rounded-full text-lg font-bold flex items-center gap-2 ${
            isMatch
              ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
              : 'bg-red-500/20 border-2 border-red-500 text-red-400'
          }`}>
            {isMatch ? <Check size={20} /> : <X size={20} />}
            {isMatch ? 'true' : 'false'}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < totalSteps - 1}
        stepInfo={{ current: stepIndex + 1, total: totalSteps }}
      />

      {/* Insight */}
      <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-400/20 rounded-lg text-sm text-gray-400 text-center">
        <strong className="text-amber-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
