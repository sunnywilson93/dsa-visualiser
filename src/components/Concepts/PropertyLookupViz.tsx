'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface Property {
  name: string
  value: string
  shadowed?: boolean
}

interface ChainNode {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: Property[]
  protoRef: string | null
  color: string
}

interface LookupStep {
  description: string
  searchProperty: string
  currentlyChecking: string | null
  checkedObjects: string[]
  foundAt: string | null
  shadowedIn?: string
  output: string[]
  phase: 'searching' | 'found' | 'not-found'
}

interface Lookup {
  prop: string
  label: string
  steps: LookupStep[]
}

interface Example {
  id: string
  title: string
  chain: ChainNode[]
  lookups: Lookup[]
  insight: string
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
      id: 'own-property',
      title: 'Own Property',
      chain: [
        {
          id: 'dog',
          name: 'dog',
          type: 'instance',
          props: [
            { name: 'name', value: '"Rex"' },
            { name: 'age', value: '3' }
          ],
          protoRef: 'Animal.prototype',
          color: 'var(--color-purple-500)'
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
          color: 'var(--color-purple-500)'
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
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'name',
          label: 'dog.name',
          steps: [
            {
              description: 'Looking for "name" property...',
              searchProperty: 'name',
              currentlyChecking: 'dog',
              checkedObjects: ['dog'],
              foundAt: null,
              output: ['dog.name // checking dog...'],
              phase: 'searching'
            },
            {
              description: 'Found "name" directly on dog!',
              searchProperty: 'name',
              currentlyChecking: null,
              checkedObjects: ['dog'],
              foundAt: 'dog',
              output: ['dog.name // "Rex"', '// Own property - no chain walk needed!'],
              phase: 'found'
            }
          ]
        },
        {
          prop: 'age',
          label: 'dog.age',
          steps: [
            {
              description: 'Looking for "age" property...',
              searchProperty: 'age',
              currentlyChecking: 'dog',
              checkedObjects: ['dog'],
              foundAt: null,
              output: ['dog.age // checking dog...'],
              phase: 'searching'
            },
            {
              description: 'Found "age" directly on dog!',
              searchProperty: 'age',
              currentlyChecking: null,
              checkedObjects: ['dog'],
              foundAt: 'dog',
              output: ['dog.age // 3', '// Own property - found immediately!'],
              phase: 'found'
            }
          ]
        }
      ],
      insight: 'Own properties are found immediately without walking the prototype chain.'
    },
    {
      id: 'inherited-property',
      title: 'Inherited Property',
      chain: [
        {
          id: 'dog',
          name: 'dog',
          type: 'instance',
          props: [
            { name: 'name', value: '"Rex"' }
          ],
          protoRef: 'Animal.prototype',
          color: 'var(--color-purple-500)'
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
          color: 'var(--color-purple-500)'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' }
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'speak',
          label: 'dog.speak',
          steps: [
            {
              description: 'Looking for "speak" on dog...',
              searchProperty: 'speak',
              currentlyChecking: 'dog',
              checkedObjects: ['dog'],
              foundAt: null,
              output: ['dog.speak // checking dog...'],
              phase: 'searching'
            },
            {
              description: 'Not on dog. Following __proto__ to Animal.prototype...',
              searchProperty: 'speak',
              currentlyChecking: 'Animal.prototype',
              checkedObjects: ['dog', 'Animal.prototype'],
              foundAt: null,
              output: ['// Not on dog', '// Following __proto__ to Animal.prototype...'],
              phase: 'searching'
            },
            {
              description: 'Found "speak" on Animal.prototype!',
              searchProperty: 'speak',
              currentlyChecking: null,
              checkedObjects: ['dog', 'Animal.prototype'],
              foundAt: 'Animal.prototype',
              output: ['dog.speak // fn()', '// Inherited from Animal.prototype'],
              phase: 'found'
            }
          ]
        },
        {
          prop: 'toString',
          label: 'dog.toString',
          steps: [
            {
              description: 'Looking for "toString" on dog...',
              searchProperty: 'toString',
              currentlyChecking: 'dog',
              checkedObjects: ['dog'],
              foundAt: null,
              output: ['dog.toString // checking dog...'],
              phase: 'searching'
            },
            {
              description: 'Not on dog. Checking Animal.prototype...',
              searchProperty: 'toString',
              currentlyChecking: 'Animal.prototype',
              checkedObjects: ['dog', 'Animal.prototype'],
              foundAt: null,
              output: ['// Not on dog', '// Checking Animal.prototype...'],
              phase: 'searching'
            },
            {
              description: 'Not on Animal.prototype. Checking Object.prototype...',
              searchProperty: 'toString',
              currentlyChecking: 'Object.prototype',
              checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'],
              foundAt: null,
              output: ['// Not on Animal.prototype', '// Checking Object.prototype...'],
              phase: 'searching'
            },
            {
              description: 'Found "toString" on Object.prototype!',
              searchProperty: 'toString',
              currentlyChecking: null,
              checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'],
              foundAt: 'Object.prototype',
              output: ['dog.toString // fn()', '// Inherited from Object.prototype (3 levels up!)'],
              phase: 'found'
            }
          ]
        }
      ],
      insight: 'Property lookup walks up the __proto__ chain until the property is found or null is reached.'
    }
  ],
  intermediate: [
    {
      id: 'shadowing',
      title: 'Property Shadowing',
      chain: [
        {
          id: 'child',
          name: 'child',
          type: 'instance',
          props: [
            { name: 'value', value: '4' },
            { name: 'name', value: '"child"' }
          ],
          protoRef: 'parent',
          color: 'var(--color-purple-500)'
        },
        {
          id: 'parent',
          name: 'parent',
          type: 'prototype',
          props: [
            { name: 'value', value: '2' },
            { name: 'shared', value: '"common"' }
          ],
          protoRef: 'Object.prototype',
          color: '#06b6d4'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' }
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'value',
          label: 'child.value',
          steps: [
            {
              description: 'Looking for "value" on child...',
              searchProperty: 'value',
              currentlyChecking: 'child',
              checkedObjects: ['child'],
              foundAt: null,
              output: ['child.value // checking child...'],
              phase: 'searching'
            },
            {
              description: 'Found "value" on child! Parent\'s "value" is SHADOWED.',
              searchProperty: 'value',
              currentlyChecking: null,
              checkedObjects: ['child'],
              foundAt: 'child',
              shadowedIn: 'parent',
              output: ['child.value // 4', '// parent.value (2) is SHADOWED - unreachable!'],
              phase: 'found'
            }
          ]
        },
        {
          prop: 'shared',
          label: 'child.shared',
          steps: [
            {
              description: 'Looking for "shared" on child...',
              searchProperty: 'shared',
              currentlyChecking: 'child',
              checkedObjects: ['child'],
              foundAt: null,
              output: ['child.shared // checking child...'],
              phase: 'searching'
            },
            {
              description: 'Not on child. Checking parent...',
              searchProperty: 'shared',
              currentlyChecking: 'parent',
              checkedObjects: ['child', 'parent'],
              foundAt: null,
              output: ['// Not on child', '// Checking parent...'],
              phase: 'searching'
            },
            {
              description: 'Found "shared" on parent! (Not shadowed)',
              searchProperty: 'shared',
              currentlyChecking: null,
              checkedObjects: ['child', 'parent'],
              foundAt: 'parent',
              output: ['child.shared // "common"', '// Inherited from parent - not shadowed'],
              phase: 'found'
            }
          ]
        }
      ],
      insight: 'Shadowing: child\'s own property "hides" the parent\'s property with the same name.'
    },
    {
      id: 'not-found',
      title: 'Property Not Found',
      chain: [
        {
          id: 'obj',
          name: 'obj',
          type: 'instance',
          props: [
            { name: 'name', value: '"test"' }
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' }
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'missing',
          label: 'obj.missing',
          steps: [
            {
              description: 'Looking for "missing" on obj...',
              searchProperty: 'missing',
              currentlyChecking: 'obj',
              checkedObjects: ['obj'],
              foundAt: null,
              output: ['obj.missing // checking obj...'],
              phase: 'searching'
            },
            {
              description: 'Not on obj. Checking Object.prototype...',
              searchProperty: 'missing',
              currentlyChecking: 'Object.prototype',
              checkedObjects: ['obj', 'Object.prototype'],
              foundAt: null,
              output: ['// Not on obj', '// Checking Object.prototype...'],
              phase: 'searching'
            },
            {
              description: 'Not on Object.prototype. Reaching null...',
              searchProperty: 'missing',
              currentlyChecking: 'null',
              checkedObjects: ['obj', 'Object.prototype', 'null'],
              foundAt: null,
              output: ['// Not on Object.prototype', '// Reached null - end of chain!'],
              phase: 'searching'
            },
            {
              description: 'Property "missing" not found anywhere! Returns undefined.',
              searchProperty: 'missing',
              currentlyChecking: null,
              checkedObjects: ['obj', 'Object.prototype', 'null'],
              foundAt: 'NOT_FOUND',
              output: ['obj.missing // undefined', '// Entire chain searched - property does not exist'],
              phase: 'not-found'
            }
          ]
        }
      ],
      insight: 'If a property is not found anywhere in the chain, undefined is returned (no error thrown).'
    }
  ],
  advanced: [
    {
      id: 'hasOwnProperty-vs-in',
      title: 'hasOwnProperty vs "in"',
      chain: [
        {
          id: 'obj',
          name: 'obj',
          type: 'instance',
          props: [
            { name: 'own', value: '"mine"' }
          ],
          protoRef: 'proto',
          color: 'var(--color-purple-500)'
        },
        {
          id: 'proto',
          name: 'proto',
          type: 'prototype',
          props: [
            { name: 'inherited', value: '"shared"' }
          ],
          protoRef: 'Object.prototype',
          color: '#06b6d4'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'hasOwnProperty', value: 'fn()' }
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'own-hasOwn',
          label: 'hasOwnProperty("own")',
          steps: [
            {
              description: 'hasOwnProperty ONLY checks the object itself...',
              searchProperty: 'own',
              currentlyChecking: 'obj',
              checkedObjects: ['obj'],
              foundAt: null,
              output: ['obj.hasOwnProperty("own")', '// Only checking obj directly...'],
              phase: 'searching'
            },
            {
              description: 'TRUE - "own" is an own property of obj',
              searchProperty: 'own',
              currentlyChecking: null,
              checkedObjects: ['obj'],
              foundAt: 'obj',
              output: ['obj.hasOwnProperty("own") // true', '// "own" exists directly on obj'],
              phase: 'found'
            }
          ]
        },
        {
          prop: 'inherited-hasOwn',
          label: 'hasOwnProperty("inherited")',
          steps: [
            {
              description: 'hasOwnProperty ONLY checks obj (not the chain)...',
              searchProperty: 'inherited',
              currentlyChecking: 'obj',
              checkedObjects: ['obj'],
              foundAt: null,
              output: ['obj.hasOwnProperty("inherited")', '// Only checking obj...'],
              phase: 'searching'
            },
            {
              description: 'FALSE - "inherited" is NOT on obj itself',
              searchProperty: 'inherited',
              currentlyChecking: null,
              checkedObjects: ['obj'],
              foundAt: 'NOT_FOUND',
              output: ['obj.hasOwnProperty("inherited") // false', '// Does NOT walk the chain!'],
              phase: 'not-found'
            }
          ]
        },
        {
          prop: 'inherited-in',
          label: '"inherited" in obj',
          steps: [
            {
              description: '"in" operator searches the entire chain...',
              searchProperty: 'inherited',
              currentlyChecking: 'obj',
              checkedObjects: ['obj'],
              foundAt: null,
              output: ['"inherited" in obj', '// Checking obj...'],
              phase: 'searching'
            },
            {
              description: 'Not on obj. Checking proto...',
              searchProperty: 'inherited',
              currentlyChecking: 'proto',
              checkedObjects: ['obj', 'proto'],
              foundAt: null,
              output: ['// Not on obj', '// Checking proto...'],
              phase: 'searching'
            },
            {
              description: 'TRUE - "inherited" found on proto!',
              searchProperty: 'inherited',
              currentlyChecking: null,
              checkedObjects: ['obj', 'proto'],
              foundAt: 'proto',
              output: ['"inherited" in obj // true', '// "in" walks the chain - found on proto!'],
              phase: 'found'
            }
          ]
        }
      ],
      insight: 'hasOwnProperty() only checks the object. "in" operator walks the entire prototype chain.'
    },
    {
      id: 'multi-level-shadow',
      title: 'Multi-Level Shadowing',
      chain: [
        {
          id: 'child',
          name: 'child',
          type: 'instance',
          props: [
            { name: 'name', value: '"child"' },
            { name: 'level', value: '3' }
          ],
          protoRef: 'parent',
          color: 'var(--color-purple-500)'
        },
        {
          id: 'parent',
          name: 'parent',
          type: 'prototype',
          props: [
            { name: 'name', value: '"parent"' },
            { name: 'level', value: '2' }
          ],
          protoRef: 'grandparent',
          color: '#06b6d4'
        },
        {
          id: 'grandparent',
          name: 'grandparent',
          type: 'prototype',
          props: [
            { name: 'name', value: '"grandparent"' },
            { name: 'level', value: '1' },
            { name: 'ancestor', value: '"root"' }
          ],
          protoRef: 'Object.prototype',
          color: '#14b8a6'
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' }
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)'
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)'
        }
      ],
      lookups: [
        {
          prop: 'name',
          label: 'child.name',
          steps: [
            {
              description: 'Looking for "name" - exists at all 3 levels!',
              searchProperty: 'name',
              currentlyChecking: 'child',
              checkedObjects: ['child'],
              foundAt: null,
              output: ['child.name // checking child...'],
              phase: 'searching'
            },
            {
              description: 'Found "name" on child! Parent and grandparent "name" both SHADOWED.',
              searchProperty: 'name',
              currentlyChecking: null,
              checkedObjects: ['child'],
              foundAt: 'child',
              shadowedIn: 'parent',
              output: ['child.name // "child"', '// Shadows parent.name ("parent") AND grandparent.name ("grandparent")'],
              phase: 'found'
            }
          ]
        },
        {
          prop: 'ancestor',
          label: 'child.ancestor',
          steps: [
            {
              description: 'Looking for "ancestor" - only exists on grandparent',
              searchProperty: 'ancestor',
              currentlyChecking: 'child',
              checkedObjects: ['child'],
              foundAt: null,
              output: ['child.ancestor // checking child...'],
              phase: 'searching'
            },
            {
              description: 'Not on child. Checking parent...',
              searchProperty: 'ancestor',
              currentlyChecking: 'parent',
              checkedObjects: ['child', 'parent'],
              foundAt: null,
              output: ['// Not on child', '// Checking parent...'],
              phase: 'searching'
            },
            {
              description: 'Not on parent. Checking grandparent...',
              searchProperty: 'ancestor',
              currentlyChecking: 'grandparent',
              checkedObjects: ['child', 'parent', 'grandparent'],
              foundAt: null,
              output: ['// Not on parent', '// Checking grandparent...'],
              phase: 'searching'
            },
            {
              description: 'Found "ancestor" on grandparent! No shadowing.',
              searchProperty: 'ancestor',
              currentlyChecking: null,
              checkedObjects: ['child', 'parent', 'grandparent'],
              foundAt: 'grandparent',
              output: ['child.ancestor // "root"', '// Inherited from grandparent - walked 2 levels'],
              phase: 'found'
            }
          ]
        }
      ],
      insight: 'Shadowing works at multiple levels - the nearest property in the chain always wins.'
    }
  ]
}

export function PropertyLookupViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [selectedLookup, setSelectedLookup] = useState<number | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentLookup = selectedLookup !== null ? currentExample.lookups[selectedLookup] : null
  const currentStep = currentLookup?.steps[stepIndex]

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setSelectedLookup(null)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setSelectedLookup(null)
    setStepIndex(0)
  }

  const handleLookupSelect = (index: number) => {
    setSelectedLookup(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (currentLookup && stepIndex < currentLookup.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => {
    setSelectedLookup(null)
    setStepIndex(0)
  }

  const getShadowedProps = (nodeId: string): string[] => {
    if (!currentStep?.shadowedIn || currentStep.foundAt === 'NOT_FOUND') return []
    if (currentStep.phase !== 'found') return []

    const shadowedPropName = currentStep.searchProperty
    const foundAtIndex = currentExample.chain.findIndex(n => n.id === currentStep.foundAt)
    const nodeIndex = currentExample.chain.findIndex(n => n.id === nodeId)

    if (nodeIndex > foundAtIndex && nodeIndex !== -1 && foundAtIndex !== -1) {
      const node = currentExample.chain[nodeIndex]
      if (node.props.some(p => p.name === shadowedPropName)) {
        return [shadowedPropName]
      }
    }
    return []
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Level selector */}
      <div className="flex gap-2 justify-center bg-black-30 border border-white-10 rounded-full p-1.5">
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

      {/* Property selector */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-sm text-gray-500">Look up:</span>
        {currentExample.lookups.map((lookup, i) => (
          <button
            key={lookup.prop}
            className={`px-3 py-1 font-mono text-sm rounded-full transition-all ${
              selectedLookup === i
                ? 'bg-purple-500/20 border border-purple-500/70 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white-5 border border-white-10 text-gray-500 hover:bg-white-10 hover:text-gray-300'
            }`}
            onClick={() => handleLookupSelect(i)}
          >
            {lookup.label}
          </button>
        ))}
        {selectedLookup !== null && (
          <button
            className="px-2.5 py-1 text-xs bg-white-5 border border-white-10 rounded-full text-gray-500 hover:bg-white-10 hover:text-gray-400 transition-colors"
            onClick={handleReset}
          >
            ↻ Reset
          </button>
        )}
      </div>

      {/* Chain visualization - Neon Box */}
      <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-purple)' }}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
          Property Lookup
        </div>
        <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-6">
          <div className="flex flex-col items-center gap-1">
            {currentExample.chain.map((node, index) => {
              const isCurrentlyChecking = currentStep?.currentlyChecking === node.id
              const isChecked = currentStep?.checkedObjects.includes(node.id)
              const isFoundAt = currentStep?.foundAt === node.id && currentStep.foundAt !== 'NOT_FOUND'
              const isNotFoundTarget = currentStep?.foundAt === 'NOT_FOUND' && node.type === 'null'
              const shadowedProps = getShadowedProps(node.id)

              return (
                <div key={node.id} className="w-full max-w-[280px]">
                  <motion.div
                    className={`w-full bg-black-30 border-2 rounded-lg overflow-hidden transition-all relative ${
                      isChecked ? 'bg-white-5' : 'border-white-10'
                    } ${isFoundAt ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''} ${
                      isNotFoundTarget ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''
                    }`}
                    style={{
                      borderColor: isCurrentlyChecking
                        ? 'var(--color-amber-500)'
                        : isFoundAt
                        ? 'var(--color-emerald-500)'
                        : isNotFoundTarget
                        ? 'var(--color-red-500)'
                        : isChecked
                        ? node.color
                        : 'rgba(255,255,255,0.1)'
                    }}
                    animate={{
                      scale: isFoundAt || isNotFoundTarget ? 1.02 : isCurrentlyChecking ? 1.01 : 1
                    }}
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
                            {node.props.map(p => {
                              const isShadowed = shadowedProps.includes(p.name)
                              const isSearchedProp = currentStep?.searchProperty === p.name
                              const isFoundProp = isSearchedProp && isFoundAt

                              return (
                                <div
                                  key={p.name}
                                  className={`flex justify-between items-center px-1 py-0.5 rounded font-mono text-2xs ${
                                    isShadowed
                                      ? 'bg-gray-500/10 line-through'
                                      : isFoundProp
                                      ? 'bg-emerald-500/20 outline outline-1 outline-emerald-500'
                                      : 'bg-black-30'
                                  }`}
                                >
                                  <span className={isShadowed ? 'text-gray-600' : 'text-gray-500'}>
                                    {p.name}:
                                  </span>
                                  <span className={isShadowed ? 'text-gray-600' : 'text-emerald-500'}>
                                    {p.value}
                                  </span>
                                  {isShadowed && (
                                    <span className="text-2xs text-amber-500 ml-1">(shadowed)</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {node.protoRef && (
                            <div className="font-mono text-xs text-purple-400 pt-1 border-t border-white-5">
                              __proto__: → {node.protoRef}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Currently checking indicator */}
                    {isCurrentlyChecking && (
                      <motion.div
                        className="absolute -top-2 right-2 px-1.5 py-0.5 bg-amber-500 rounded text-xs font-bold text-black"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        Checking...
                      </motion.div>
                    )}

                    {/* Found badge */}
                    {isFoundAt && (
                      <motion.div
                        className="absolute -top-2 right-2 px-1.5 py-0.5 bg-emerald-500 rounded text-xs font-bold text-black"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        Found!
                      </motion.div>
                    )}

                    {/* Not Found badge */}
                    {isNotFoundTarget && (
                      <motion.div
                        className="absolute -top-2 right-2 px-1.5 py-0.5 bg-red-500 rounded text-xs font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        Not Found
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Arrow to next node */}
                  {index < currentExample.chain.length - 1 && (
                    <div
                      className="text-center text-xs py-0.5 transition-colors"
                      style={{
                        color:
                          isChecked &&
                          currentStep?.checkedObjects.includes(currentExample.chain[index + 1].id)
                            ? node.color
                            : '#444'
                      }}
                    >
                      ↓ __proto__
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step description */}
      {currentStep && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${level}-${exampleIndex}-${selectedLookup}-${stepIndex}`}
            className={`px-4 py-2.5 border rounded-lg text-base text-center ${
              currentStep.foundAt === 'NOT_FOUND'
                ? 'bg-red-500/10 border-red-400/20 text-red-400'
                : currentStep.phase === 'found'
                ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400'
                : 'bg-black-30 border-white-10 text-gray-300'
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {currentStep.description}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Output */}
      {currentStep && (
        <div className={`px-3 py-2 border rounded-lg font-mono text-xs ${
          currentStep.foundAt === 'NOT_FOUND'
            ? 'bg-red-500/5 border-red-500/20 text-red-400'
            : 'bg-black-40 border-white-5 text-emerald-400'
        }`}>
          {currentStep.output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* Controls */}
      {currentLookup && (
        <StepControls
          onPrev={handlePrev}
          onNext={handleNext}
          onReset={handleReset}
          canPrev={stepIndex > 0}
          canNext={stepIndex < currentLookup.steps.length - 1}
          stepInfo={{ current: stepIndex + 1, total: currentLookup.steps.length }}
        />
      )}

      {/* Start prompt */}
      {!currentLookup && (
        <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center text-sm text-purple-300">
          Select a property above to see the lookup animation
        </div>
      )}

      {/* Insight */}
      <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-400/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-amber-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
