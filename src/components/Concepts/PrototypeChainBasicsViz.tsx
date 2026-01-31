'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChainNode {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string }[]
  protoRef: string | null
  color: string
}

interface Step {
  description: string
  visibleNodes: string[]
  highlightNode?: string
  output: string[]
  phase: 'creation' | 'chain-reveal' | 'complete'
}

interface Example {
  id: string
  title: string
  chain: ChainNode[]
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
      id: 'dog-chain',
      title: 'Constructor Chain',
      chain: [
        {
          id: 'dog',
          name: 'dog',
          type: 'instance',
          props: [
            { name: 'name', value: '"Rex"' },
            { name: 'bark', value: 'fn()' }
          ],
          protoRef: 'Animal.prototype',
          color: '#a855f7'
        },
        {
          id: 'Animal.prototype',
          name: 'Animal.prototype',
          type: 'prototype',
          props: [
            { name: 'speak', value: 'fn()' },
            { name: 'eat', value: 'fn()' }
          ],
          protoRef: 'Object.prototype',
          color: '#a855f7'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
            { name: 'hasOwnProperty', value: 'fn()' }
          ],
          protoRef: 'null',
          color: '#f59e0b'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'Creating dog instance with new Animal("Rex")',
          visibleNodes: ['dog'],
          highlightNode: 'dog',
          output: ['const dog = new Animal("Rex")'],
          phase: 'creation'
        },
        {
          description: 'dog.__proto__ points to Animal.prototype (shared methods)',
          visibleNodes: ['dog', 'Animal.prototype'],
          highlightNode: 'Animal.prototype',
          output: ['dog.__proto__ === Animal.prototype // true'],
          phase: 'chain-reveal'
        },
        {
          description: 'Animal.prototype.__proto__ points to Object.prototype (base methods)',
          visibleNodes: ['dog', 'Animal.prototype', 'Object.prototype'],
          highlightNode: 'Object.prototype',
          output: ['Animal.prototype.__proto__ === Object.prototype // true'],
          phase: 'chain-reveal'
        },
        {
          description: 'Object.prototype.__proto__ is null - end of chain!',
          visibleNodes: ['dog', 'Animal.prototype', 'Object.prototype', 'null'],
          highlightNode: 'null',
          output: ['Object.prototype.__proto__ === null // true'],
          phase: 'complete'
        }
      ],
      insight: 'Every constructor instance links through Constructor.prototype to Object.prototype to null.'
    },
    {
      id: 'object-literal',
      title: 'Object Literal Chain',
      chain: [
        {
          id: 'user',
          name: 'user',
          type: 'instance',
          props: [
            { name: 'name', value: '"Alice"' },
            { name: 'age', value: '25' }
          ],
          protoRef: 'Object.prototype',
          color: '#a855f7'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
            { name: 'valueOf', value: 'fn()' }
          ],
          protoRef: 'null',
          color: '#f59e0b'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'Creating user with object literal { name, age }',
          visibleNodes: ['user'],
          highlightNode: 'user',
          output: ['const user = { name: "Alice", age: 25 }'],
          phase: 'creation'
        },
        {
          description: 'Object literals link directly to Object.prototype',
          visibleNodes: ['user', 'Object.prototype'],
          highlightNode: 'Object.prototype',
          output: ['user.__proto__ === Object.prototype // true'],
          phase: 'chain-reveal'
        },
        {
          description: 'Object.prototype.__proto__ is null - shorter chain!',
          visibleNodes: ['user', 'Object.prototype', 'null'],
          highlightNode: 'null',
          output: ['Object.prototype.__proto__ === null // true'],
          phase: 'complete'
        }
      ],
      insight: 'Object literals have a shorter chain - they inherit directly from Object.prototype.'
    }
  ],
  intermediate: [
    {
      id: 'object-create',
      title: 'Object.create() Chain',
      chain: [
        {
          id: 'child',
          name: 'child',
          type: 'instance',
          props: [{ name: 'childProp', value: '"own"' }],
          protoRef: 'parent',
          color: '#a855f7'
        },
        {
          id: 'parent',
          name: 'parent',
          type: 'prototype',
          props: [
            { name: 'parentMethod', value: 'fn()' },
            { name: 'shared', value: '"inherited"' }
          ],
          protoRef: 'grandparent',
          color: '#06b6d4'
        },
        {
          id: 'grandparent',
          name: 'grandparent',
          type: 'prototype',
          props: [{ name: 'ancestorProp', value: '"ancient"' }],
          protoRef: 'Object.prototype',
          color: '#14b8a6'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [{ name: 'toString', value: 'fn()' }],
          protoRef: 'null',
          color: '#f59e0b'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'Creating grandparent object',
          visibleNodes: ['grandparent'],
          highlightNode: 'grandparent',
          output: ['const grandparent = { ancestorProp: "ancient" }'],
          phase: 'creation'
        },
        {
          description: 'Creating parent with Object.create(grandparent)',
          visibleNodes: ['parent', 'grandparent'],
          highlightNode: 'parent',
          output: ['const parent = Object.create(grandparent)', 'parent.parentMethod = fn()'],
          phase: 'creation'
        },
        {
          description: 'Creating child with Object.create(parent)',
          visibleNodes: ['child', 'parent', 'grandparent'],
          highlightNode: 'child',
          output: ['const child = Object.create(parent)', 'child.childProp = "own"'],
          phase: 'creation'
        },
        {
          description: 'grandparent links to Object.prototype',
          visibleNodes: ['child', 'parent', 'grandparent', 'Object.prototype'],
          highlightNode: 'Object.prototype',
          output: ['grandparent.__proto__ === Object.prototype'],
          phase: 'chain-reveal'
        },
        {
          description: 'Complete chain: child -> parent -> grandparent -> Object.prototype -> null',
          visibleNodes: ['child', 'parent', 'grandparent', 'Object.prototype', 'null'],
          highlightNode: 'null',
          output: ['// Multi-level inheritance chain complete'],
          phase: 'complete'
        }
      ],
      insight: 'Object.create() lets you build custom prototype chains with any object as prototype.'
    },
    {
      id: 'class-chain',
      title: 'Class Inheritance Chain',
      chain: [
        {
          id: 'dog',
          name: 'dog (instance)',
          type: 'instance',
          props: [
            { name: 'name', value: '"Spot"' },
            { name: 'breed', value: '"Labrador"' }
          ],
          protoRef: 'Dog.prototype',
          color: '#a855f7'
        },
        {
          id: 'Dog.prototype',
          name: 'Dog.prototype',
          type: 'prototype',
          props: [
            { name: 'bark', value: 'fn()' },
            { name: 'constructor', value: 'Dog' }
          ],
          protoRef: 'Animal.prototype',
          color: '#a855f7'
        },
        {
          id: 'Animal.prototype',
          name: 'Animal.prototype',
          type: 'prototype',
          props: [
            { name: 'speak', value: 'fn()' },
            { name: 'constructor', value: 'Animal' }
          ],
          protoRef: 'Object.prototype',
          color: '#06b6d4'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [{ name: 'toString', value: 'fn()' }],
          protoRef: 'null',
          color: '#f59e0b'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'class Dog extends Animal creates prototype chain linkage',
          visibleNodes: ['Dog.prototype', 'Animal.prototype'],
          highlightNode: 'Dog.prototype',
          output: ['class Dog extends Animal { ... }', 'Dog.prototype.__proto__ === Animal.prototype'],
          phase: 'creation'
        },
        {
          description: 'Creating dog instance with new Dog("Spot")',
          visibleNodes: ['dog', 'Dog.prototype', 'Animal.prototype'],
          highlightNode: 'dog',
          output: ['const dog = new Dog("Spot", "Labrador")'],
          phase: 'creation'
        },
        {
          description: 'dog inherits bark() from Dog.prototype',
          visibleNodes: ['dog', 'Dog.prototype', 'Animal.prototype'],
          highlightNode: 'Dog.prototype',
          output: ['dog.bark() // "Woof!" - from Dog.prototype'],
          phase: 'chain-reveal'
        },
        {
          description: 'dog inherits speak() from Animal.prototype',
          visibleNodes: ['dog', 'Dog.prototype', 'Animal.prototype'],
          highlightNode: 'Animal.prototype',
          output: ['dog.speak() // "Spot makes a sound" - from Animal.prototype'],
          phase: 'chain-reveal'
        },
        {
          description: 'Full chain ends at Object.prototype -> null',
          visibleNodes: ['dog', 'Dog.prototype', 'Animal.prototype', 'Object.prototype', 'null'],
          highlightNode: 'null',
          output: ['// Complete: dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null'],
          phase: 'complete'
        }
      ],
      insight: 'ES6 class extends creates prototype chains: Child.prototype.__proto__ === Parent.prototype'
    }
  ],
  advanced: [
    {
      id: 'null-prototype',
      title: 'Object.create(null)',
      chain: [
        {
          id: 'dict',
          name: 'dict (no prototype)',
          type: 'instance',
          props: [
            { name: 'key1', value: '"value1"' },
            { name: 'key2', value: '"value2"' }
          ],
          protoRef: 'null',
          color: '#a855f7'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'Object.create(null) creates object with NO prototype',
          visibleNodes: ['dict'],
          highlightNode: 'dict',
          output: ['const dict = Object.create(null)', 'dict.key1 = "value1"'],
          phase: 'creation'
        },
        {
          description: 'dict.__proto__ is null directly - no Object.prototype!',
          visibleNodes: ['dict', 'null'],
          highlightNode: 'null',
          output: ['dict.__proto__ === null // true', 'dict.toString // undefined!'],
          phase: 'complete'
        }
      ],
      insight: 'Object.create(null) creates truly empty objects - perfect for dictionaries, avoids prototype pollution.'
    },
    {
      id: 'function-chain',
      title: 'Function Prototype Chain',
      chain: [
        {
          id: 'myFunc',
          name: 'myFunc (function)',
          type: 'instance',
          props: [
            { name: 'name', value: '"myFunc"' },
            { name: 'length', value: '2' }
          ],
          protoRef: 'Function.prototype',
          color: '#a855f7'
        },
        {
          id: 'Function.prototype',
          name: 'Function.prototype',
          type: 'prototype',
          props: [
            { name: 'call', value: 'fn()' },
            { name: 'apply', value: 'fn()' },
            { name: 'bind', value: 'fn()' }
          ],
          protoRef: 'Object.prototype',
          color: '#06b6d4'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
            { name: 'valueOf', value: 'fn()' }
          ],
          protoRef: 'null',
          color: '#f59e0b'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: '#ef4444'
        }
      ],
      steps: [
        {
          description: 'Functions are objects too! They have their own prototype chain.',
          visibleNodes: ['myFunc'],
          highlightNode: 'myFunc',
          output: ['function myFunc(a, b) { return a + b }'],
          phase: 'creation'
        },
        {
          description: 'Functions inherit from Function.prototype (call, apply, bind)',
          visibleNodes: ['myFunc', 'Function.prototype'],
          highlightNode: 'Function.prototype',
          output: ['myFunc.__proto__ === Function.prototype // true', 'myFunc.call, myFunc.apply, myFunc.bind'],
          phase: 'chain-reveal'
        },
        {
          description: 'Function.prototype inherits from Object.prototype',
          visibleNodes: ['myFunc', 'Function.prototype', 'Object.prototype'],
          highlightNode: 'Object.prototype',
          output: ['Function.prototype.__proto__ === Object.prototype // true'],
          phase: 'chain-reveal'
        },
        {
          description: 'Functions have the same chain ending: Object.prototype -> null',
          visibleNodes: ['myFunc', 'Function.prototype', 'Object.prototype', 'null'],
          highlightNode: 'null',
          output: ['// myFunc -> Function.prototype -> Object.prototype -> null'],
          phase: 'complete'
        }
      ],
      insight: 'Functions are objects with an extra link: Function.prototype provides call/apply/bind methods.'
    }
  ]
}

export function PrototypeChainBasicsViz() {
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
    if (stepIndex < currentExample.steps.length - 1) {
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

  return (
    <div className="flex flex-col gap-5">
      {/* Level selector */}
      <div className="flex gap-2 justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              level === lvl ? 'text-white' : 'bg-white/5 border border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
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
      <div className="flex gap-2 flex-wrap justify-center bg-black/30 border border-white/10 rounded-full p-1.5">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-4 py-1.5 font-mono text-sm rounded-full transition-all ${
              exampleIndex === i
                ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
            }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Chain visualization - Neon Box */}
      <div className="relative rounded-xl p-[3px]" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
          Prototype Chain
        </div>
        <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-6">
          <div className="flex flex-col items-center gap-1">
            {currentExample.chain.map((node, index) => {
              const isVisible = currentStep.visibleNodes.includes(node.id)
              const isHighlighted = currentStep.highlightNode === node.id

              if (!isVisible) return null

              return (
                <div key={node.id} className="w-full max-w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={node.id}
                      className={`w-full bg-black/30 border-2 rounded-lg overflow-hidden transition-all relative ${
                        isHighlighted ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''
                      }`}
                      style={{
                        borderColor: isHighlighted ? node.color : 'rgba(255,255,255,0.1)'
                      }}
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: isHighlighted ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="px-2 py-1 text-2xs font-semibold text-black text-center"
                        style={{ background: node.color }}
                      >
                        {node.name}
                      </div>
                      <div className="p-2">
                        {node.type === 'null' ? (
                          <div className="text-center text-xs text-gray-600 italic">End of chain</div>
                        ) : (
                          <>
                            <div className="flex flex-col gap-1 mb-2">
                              {node.props.map(p => (
                                <div
                                  key={p.name}
                                  className="flex justify-between px-1 py-0.5 bg-black/30 rounded font-mono text-2xs"
                                >
                                  <span className="text-gray-500">{p.name}:</span>
                                  <span className="text-emerald-500">{p.value}</span>
                                </div>
                              ))}
                            </div>
                            {node.protoRef && (
                              <div className="font-mono text-xs text-purple-400 pt-1 border-t border-white/5">
                                __proto__: → {node.protoRef}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {isHighlighted && currentStep.phase === 'complete' && node.type === 'null' && (
                        <motion.div
                          className="absolute -top-2 right-2 px-1.5 py-0.5 bg-emerald-500 rounded text-xs font-bold text-black"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          Chain Complete!
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Arrow to next node */}
                  {index < currentExample.chain.length - 1 &&
                    currentStep.visibleNodes.includes(currentExample.chain[index + 1].id) && (
                    <motion.div
                      className="text-center text-xs py-0.5"
                      style={{ color: node.color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ↓ __proto__
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-base text-center text-gray-300"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className="inline-block px-1.5 py-0.5 bg-purple-500/30 rounded text-2xs font-semibold text-purple-300 mr-2">
            Step {stepIndex + 1}/{currentExample.steps.length}
          </span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Output */}
      <div className="px-3 py-2 bg-black/40 border border-white/5 rounded-lg font-mono text-xs text-emerald-400">
        {currentStep.output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <motion.button
          className="px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-md text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={stepIndex === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Prev
        </motion.button>
        <motion.button
          className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-500 hover:bg-white/10 hover:text-gray-400 transition-colors"
          onClick={handleReset}
        >
          ↻ Reset
        </motion.button>
        <motion.button
          className="px-6 py-2 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
      </div>

      {/* Insight */}
      <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-400/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-amber-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
