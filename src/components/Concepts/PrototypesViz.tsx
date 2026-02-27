import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface HeapObject {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string }[]
  protoRef: string | null
  color: string
}

interface Lookup {
  prop: string
  label: string
  steps: {
    description: string
    foundAt: string | null
    checkedObjects: string[]
  }[]
}

interface Example {
  id: string
  title: string
  heap: HeapObject[]
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
      id: 'basic-chain',
      title: 'Basic Prototype Chain',
      heap: [
        {
          id: 'dog',
          name: 'dog',
          type: 'instance',
          props: [
            { name: 'name', value: '"Rex"' },
            { name: 'bark', value: 'fn()' },
          ],
          protoRef: 'Animal.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Animal.prototype',
          name: 'Animal.prototype',
          type: 'prototype',
          props: [
            { name: 'speak', value: 'fn()' },
            { name: 'eat', value: 'fn()' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
            { name: 'hasOwnProperty', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'name',
          label: 'dog.name',
          steps: [
            { description: 'Looking for "name" on dog...', foundAt: null, checkedObjects: ['dog'] },
            { description: '✓ Found "name" directly on dog! Value: "Rex"', foundAt: 'dog', checkedObjects: ['dog'] },
          ],
        },
        {
          prop: 'speak',
          label: 'dog.speak',
          steps: [
            { description: 'Looking for "speak" on dog...', foundAt: null, checkedObjects: ['dog'] },
            { description: 'Not on dog. Following __proto__ to Animal.prototype...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'] },
            { description: '✓ Found "speak" on Animal.prototype!', foundAt: 'Animal.prototype', checkedObjects: ['dog', 'Animal.prototype'] },
          ],
        },
        {
          prop: 'toString',
          label: 'dog.toString',
          steps: [
            { description: 'Looking for "toString" on dog...', foundAt: null, checkedObjects: ['dog'] },
            { description: 'Not on dog. Following __proto__ to Animal.prototype...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'] },
            { description: 'Not on Animal.prototype. Following to Object.prototype...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'] },
            { description: '✓ Found "toString" on Object.prototype!', foundAt: 'Object.prototype', checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'] },
          ],
        },
        {
          prop: 'fly',
          label: 'dog.fly',
          steps: [
            { description: 'Looking for "fly" on dog...', foundAt: null, checkedObjects: ['dog'] },
            { description: 'Not on dog. Following __proto__ to Animal.prototype...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype'] },
            { description: 'Not on Animal.prototype. Following to Object.prototype...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype'] },
            { description: 'Not on Object.prototype. Following __proto__ to null...', foundAt: null, checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype', 'null'] },
            { description: '✗ Property "fly" not found! Returns undefined', foundAt: 'NOT_FOUND', checkedObjects: ['dog', 'Animal.prototype', 'Object.prototype', 'null'] },
          ],
        },
      ],
      insight: 'Prototype Chain: JS walks up __proto__ links until it finds the property or hits null.',
    },
    {
      id: 'simple-object',
      title: 'Simple Object Literal',
      heap: [
        {
          id: 'user',
          name: 'user',
          type: 'instance',
          props: [
            { name: 'name', value: '"Alice"' },
            { name: 'age', value: '25' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
            { name: 'valueOf', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'name',
          label: 'user.name',
          steps: [
            { description: 'Looking for "name" on user...', foundAt: null, checkedObjects: ['user'] },
            { description: '✓ Found "name" directly on user! Value: "Alice"', foundAt: 'user', checkedObjects: ['user'] },
          ],
        },
        {
          prop: 'toString',
          label: 'user.toString',
          steps: [
            { description: 'Looking for "toString" on user...', foundAt: null, checkedObjects: ['user'] },
            { description: 'Not on user. Following __proto__ to Object.prototype...', foundAt: null, checkedObjects: ['user', 'Object.prototype'] },
            { description: '✓ Found "toString" on Object.prototype!', foundAt: 'Object.prototype', checkedObjects: ['user', 'Object.prototype'] },
          ],
        },
      ],
      insight: 'Every object literal inherits directly from Object.prototype (shorter chain than constructor instances).',
    },
  ],
  intermediate: [
    {
      id: 'object-create',
      title: 'Object.create()',
      heap: [
        {
          id: 'child',
          name: 'child',
          type: 'instance',
          props: [
            { name: 'childProp', value: '"own"' },
          ],
          protoRef: 'parent',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'parent',
          name: 'parent',
          type: 'prototype',
          props: [
            { name: 'sharedMethod', value: 'fn()' },
            { name: 'parentProp', value: '"inherited"' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'childProp',
          label: 'child.childProp',
          steps: [
            { description: 'Looking for "childProp" on child...', foundAt: null, checkedObjects: ['child'] },
            { description: '✓ Found "childProp" directly on child!', foundAt: 'child', checkedObjects: ['child'] },
          ],
        },
        {
          prop: 'parentProp',
          label: 'child.parentProp',
          steps: [
            { description: 'Looking for "parentProp" on child...', foundAt: null, checkedObjects: ['child'] },
            { description: 'Not on child. Following __proto__ to parent...', foundAt: null, checkedObjects: ['child', 'parent'] },
            { description: '✓ Found "parentProp" on parent!', foundAt: 'parent', checkedObjects: ['child', 'parent'] },
          ],
        },
        {
          prop: 'sharedMethod',
          label: 'child.sharedMethod',
          steps: [
            { description: 'Looking for "sharedMethod" on child...', foundAt: null, checkedObjects: ['child'] },
            { description: 'Not on child. Following __proto__ to parent...', foundAt: null, checkedObjects: ['child', 'parent'] },
            { description: '✓ Found "sharedMethod" on parent! Methods are shared.', foundAt: 'parent', checkedObjects: ['child', 'parent'] },
          ],
        },
      ],
      insight: 'Object.create(proto) creates object with proto as its __proto__. Great for delegation patterns.',
    },
    {
      id: 'shadowing',
      title: 'Property Shadowing',
      heap: [
        {
          id: 'child',
          name: 'child',
          type: 'instance',
          props: [
            { name: 'toString', value: '"custom fn()"' },
            { name: 'name', value: '"child"' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: '[native]' },
            { name: 'valueOf', value: '[native]' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'toString',
          label: 'child.toString',
          steps: [
            { description: 'Looking for "toString" on child...', foundAt: null, checkedObjects: ['child'] },
            { description: '✓ Found "toString" directly on child! (SHADOWS Object.prototype.toString)', foundAt: 'child', checkedObjects: ['child'] },
          ],
        },
        {
          prop: 'valueOf',
          label: 'child.valueOf',
          steps: [
            { description: 'Looking for "valueOf" on child...', foundAt: null, checkedObjects: ['child'] },
            { description: 'Not on child. Following __proto__ to Object.prototype...', foundAt: null, checkedObjects: ['child', 'Object.prototype'] },
            { description: '✓ Found "valueOf" on Object.prototype (not shadowed)', foundAt: 'Object.prototype', checkedObjects: ['child', 'Object.prototype'] },
          ],
        },
      ],
      insight: 'Shadowing: When child has same property as parent, child\'s property is found first (hides parent).',
    },
    {
      id: 'constructor-fn',
      title: 'Constructor Function',
      heap: [
        {
          id: 'person',
          name: 'person (instance)',
          type: 'instance',
          props: [
            { name: 'name', value: '"Bob"' },
            { name: 'age', value: '30' },
          ],
          protoRef: 'Person.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Person.prototype',
          name: 'Person.prototype',
          type: 'prototype',
          props: [
            { name: 'greet', value: 'fn()' },
            { name: 'constructor', value: 'Person' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'greet',
          label: 'person.greet',
          steps: [
            { description: 'Looking for "greet" on person...', foundAt: null, checkedObjects: ['person'] },
            { description: 'Not on person. Following __proto__ to Person.prototype...', foundAt: null, checkedObjects: ['person', 'Person.prototype'] },
            { description: '✓ Found "greet" on Person.prototype! Shared by all Person instances.', foundAt: 'Person.prototype', checkedObjects: ['person', 'Person.prototype'] },
          ],
        },
        {
          prop: 'constructor',
          label: 'person.constructor',
          steps: [
            { description: 'Looking for "constructor" on person...', foundAt: null, checkedObjects: ['person'] },
            { description: 'Not on person. Following __proto__ to Person.prototype...', foundAt: null, checkedObjects: ['person', 'Person.prototype'] },
            { description: '✓ Found "constructor" - points back to Person function!', foundAt: 'Person.prototype', checkedObjects: ['person', 'Person.prototype'] },
          ],
        },
      ],
      insight: 'Constructor functions: new Person() creates instances that inherit from Person.prototype.',
    },
  ],
  advanced: [
    {
      id: 'hasOwnProperty',
      title: 'hasOwnProperty Check',
      heap: [
        {
          id: 'obj',
          name: 'obj',
          type: 'instance',
          props: [
            { name: 'own', value: '"mine"' },
          ],
          protoRef: 'proto',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'proto',
          name: 'proto',
          type: 'prototype',
          props: [
            { name: 'inherited', value: '"shared"' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'hasOwnProperty', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'own',
          label: 'hasOwnProperty("own")',
          steps: [
            { description: 'obj.hasOwnProperty("own") - checking ONLY obj...', foundAt: null, checkedObjects: ['obj'] },
            { description: '✓ Returns TRUE - "own" exists directly on obj', foundAt: 'obj', checkedObjects: ['obj'] },
          ],
        },
        {
          prop: 'inherited',
          label: 'hasOwnProperty("inherited")',
          steps: [
            { description: 'obj.hasOwnProperty("inherited") - checking ONLY obj...', foundAt: null, checkedObjects: ['obj'] },
            { description: '✗ Returns FALSE - "inherited" is NOT on obj itself', foundAt: 'NOT_FOUND', checkedObjects: ['obj'] },
          ],
        },
        {
          prop: 'in-inherited',
          label: '"inherited" in obj',
          steps: [
            { description: '"inherited" in obj - searches entire chain...', foundAt: null, checkedObjects: ['obj'] },
            { description: 'Not on obj. Following __proto__ to proto...', foundAt: null, checkedObjects: ['obj', 'proto'] },
            { description: '✓ Returns TRUE - "inherited" found on prototype chain', foundAt: 'proto', checkedObjects: ['obj', 'proto'] },
          ],
        },
      ],
      insight: 'hasOwnProperty() only checks the object itself. "in" operator checks the entire prototype chain.',
    },
    {
      id: 'null-proto',
      title: 'Object.create(null)',
      heap: [
        {
          id: 'dict',
          name: 'dict (no prototype)',
          type: 'instance',
          props: [
            { name: 'key1', value: '"value1"' },
            { name: 'key2', value: '"value2"' },
          ],
          protoRef: 'null',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'key1',
          label: 'dict.key1',
          steps: [
            { description: 'Looking for "key1" on dict...', foundAt: null, checkedObjects: ['dict'] },
            { description: '✓ Found "key1" directly on dict!', foundAt: 'dict', checkedObjects: ['dict'] },
          ],
        },
        {
          prop: 'toString',
          label: 'dict.toString',
          steps: [
            { description: 'Looking for "toString" on dict...', foundAt: null, checkedObjects: ['dict'] },
            { description: 'Not on dict. Following __proto__... it\'s null!', foundAt: null, checkedObjects: ['dict', 'null'] },
            { description: '✗ Returns undefined - NO Object.prototype methods!', foundAt: 'NOT_FOUND', checkedObjects: ['dict', 'null'] },
          ],
        },
        {
          prop: 'hasOwnProperty',
          label: 'dict.hasOwnProperty',
          steps: [
            { description: 'Looking for "hasOwnProperty" on dict...', foundAt: null, checkedObjects: ['dict'] },
            { description: 'Not on dict. Following __proto__... it\'s null!', foundAt: null, checkedObjects: ['dict', 'null'] },
            { description: '✗ Returns undefined - dict has NO inherited methods!', foundAt: 'NOT_FOUND', checkedObjects: ['dict', 'null'] },
          ],
        },
      ],
      insight: 'Object.create(null) creates a truly empty object - perfect for dictionaries, avoids prototype pollution.',
    },
    {
      id: 'class-syntax',
      title: 'Class Syntax (ES6)',
      heap: [
        {
          id: 'instance',
          name: 'new Animal()',
          type: 'instance',
          props: [
            { name: 'name', value: '"Spot"' },
          ],
          protoRef: 'Animal.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Animal.prototype',
          name: 'Animal.prototype',
          type: 'prototype',
          props: [
            { name: 'speak', value: 'fn()' },
            { name: 'constructor', value: 'class Animal' },
          ],
          protoRef: 'Object.prototype',
          color: 'var(--color-purple-500)',
        },
        {
          id: 'Object.prototype',
          name: 'Object.prototype',
          type: 'prototype',
          props: [
            { name: 'toString', value: 'fn()' },
          ],
          protoRef: 'null',
          color: 'var(--color-amber-500)',
        },
        {
          id: 'null',
          name: 'null',
          type: 'null',
          props: [],
          protoRef: null,
          color: 'var(--color-red-500)',
        },
      ],
      lookups: [
        {
          prop: 'speak',
          label: 'instance.speak',
          steps: [
            { description: 'Looking for "speak" on instance...', foundAt: null, checkedObjects: ['instance'] },
            { description: 'Not on instance. Following __proto__ to Animal.prototype...', foundAt: null, checkedObjects: ['instance', 'Animal.prototype'] },
            { description: '✓ Found "speak" - ES6 class methods go on prototype!', foundAt: 'Animal.prototype', checkedObjects: ['instance', 'Animal.prototype'] },
          ],
        },
        {
          prop: 'name',
          label: 'instance.name',
          steps: [
            { description: 'Looking for "name" on instance...', foundAt: null, checkedObjects: ['instance'] },
            { description: '✓ Found "name" - instance props from constructor stay on instance!', foundAt: 'instance', checkedObjects: ['instance'] },
          ],
        },
      ],
      insight: 'ES6 class is syntactic sugar over prototypes. Methods → prototype, instance props → instance.',
    },
  ],
}

export function PrototypesViz() {
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

  const handleReset = () => {
    setSelectedLookup(null)
    setStepIndex(0)
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

      {/* Heap visualization - Neon Box */}
      <div className="relative rounded-xl p-[3px]" style={{ background: 'var(--gradient-neon-purple)' }}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
          Prototype Chain
        </div>
        <div className="bg-gray-900 rounded-lg min-h-[100px] p-4 pt-6">
          <div className="flex flex-col items-center gap-1">
            {currentExample.heap.map((obj, index) => (
              <div key={obj.id} className="w-full max-w-[280px]">
                <motion.div
                  className={`w-full bg-black-30 border-2 rounded-lg overflow-hidden transition-all relative ${
                    currentStep?.checkedObjects.includes(obj.id) ? 'bg-white-5' : 'border-white-10'
                  } ${currentStep?.foundAt === obj.id ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}`}
                  style={{ borderColor: currentStep?.checkedObjects.includes(obj.id) ? obj.color : 'var(--color-white-10)' }}
                  animate={{ scale: currentStep?.foundAt === obj.id ? 1.02 : 1 }}
                >
                  <div className="px-2 py-1 text-2xs font-semibold text-black text-center" style={{ background: obj.color }}>
                    {obj.name}
                  </div>
                  <div className="p-2">
                    {obj.type === 'null' ? (
                      <div className="text-center text-xs text-gray-600 italic">End of chain</div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1 mb-2">
                          {obj.props.map(p => (
                            <div
                              key={p.name}
                              className={`flex justify-between px-1 py-0.5 bg-black-30 rounded font-mono text-2xs ${
                                currentLookup?.prop === p.name && currentStep?.foundAt === obj.id ? 'bg-emerald-500/20 outline outline-1 outline-emerald-500' : ''
                              }`}
                            >
                              <span className="text-gray-500">{p.name}:</span>
                              <span className="text-emerald-500">{p.value}</span>
                            </div>
                          ))}
                        </div>
                        {obj.protoRef && (
                          <div className="font-mono text-xs text-purple-400 pt-1 border-t border-white-5">
                            __proto__: → {obj.protoRef}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {currentStep?.foundAt === obj.id && currentStep.foundAt !== 'NOT_FOUND' && (
                    <motion.div
                      className="absolute -top-2 right-2 px-1.5 py-0.5 bg-emerald-500 rounded text-xs font-bold text-black"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓ Found!
                    </motion.div>
                  )}
                </motion.div>
                {index < currentExample.heap.length - 1 && (
                  <div
                    className="text-center text-xs py-0.5 transition-colors"
                    style={{
                      color: currentStep?.checkedObjects.includes(obj.id) &&
                             currentStep?.checkedObjects.includes(currentExample.heap[index + 1].id)
                        ? obj.color
                        : '#444',
                    }}
                  >
                    ↓ __proto__
                  </div>
                )}
              </div>
            ))}
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

      {/* Controls */}
      {currentLookup && (
        <StepControls
          onPrev={() => setStepIndex(s => Math.max(0, s - 1))}
          onNext={handleNext}
          onReset={handleReset}
          canPrev={stepIndex > 0}
          canNext={stepIndex < currentLookup.steps.length - 1}
          stepInfo={{ current: stepIndex + 1, total: currentLookup.steps.length }}
        />
      )}

      {/* Insight */}
      <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-400/20 rounded-lg text-xs text-gray-500 text-center">
        <strong className="text-amber-500">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
