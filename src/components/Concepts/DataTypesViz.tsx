import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypeInfo {
  id: string
  name: string
  color: string
  examples: string[]
  typeof: string
  note?: string
}

const primitives: TypeInfo[] = [
  { id: 'string', name: 'String', color: '#10b981', examples: ['"hello"', "'world'", '`template`'], typeof: '"string"' },
  { id: 'number', name: 'Number', color: '#3b82f6', examples: ['42', '3.14', 'Infinity', 'NaN'], typeof: '"number"' },
  { id: 'boolean', name: 'Boolean', color: '#f59e0b', examples: ['true', 'false'], typeof: '"boolean"' },
  { id: 'null', name: 'null', color: '#ef4444', examples: ['null'], typeof: '"object"', note: 'Bug: typeof null is "object"!' },
  { id: 'undefined', name: 'undefined', color: '#a855f7', examples: ['undefined'], typeof: '"undefined"' },
  { id: 'symbol', name: 'Symbol', color: '#ec4899', examples: ['Symbol("id")'], typeof: '"symbol"' },
  { id: 'bigint', name: 'BigInt', color: '#06b6d4', examples: ['9007199254740991n'], typeof: '"bigint"' },
]

const referenceTypes: TypeInfo[] = [
  { id: 'object', name: 'Object', color: '#a855f7', examples: ['{ key: "value" }'], typeof: '"object"' },
  { id: 'array', name: 'Array', color: '#a855f7', examples: ['[1, 2, 3]'], typeof: '"object"', note: 'Arrays are objects!' },
  { id: 'function', name: 'Function', color: '#f97316', examples: ['function() {}', '() => {}'], typeof: '"function"' },
]

type Tab = 'primitives' | 'reference' | 'compare'

interface CompareStep {
  title: string
  code: string
  explanation: string
  highlight: 'value' | 'reference'
}

const compareSteps: CompareStep[] = [
  {
    title: 'Primitives: Copy by Value',
    code: `let a = 10;
let b = a;     // b gets a COPY
b = 20;
console.log(a); // 10 (unchanged!)`,
    explanation: 'Primitives are copied by value. Changing b does not affect a.',
    highlight: 'value',
  },
  {
    title: 'Objects: Copy by Reference',
    code: `let obj1 = { x: 10 };
let obj2 = obj1; // Same object!
obj2.x = 20;
console.log(obj1.x); // 20 (changed!)`,
    explanation: 'Objects are copied by reference. Both variables point to the same object.',
    highlight: 'reference',
  },
  {
    title: 'Comparing Primitives',
    code: `let a = "hello";
let b = "hello";
console.log(a === b); // true
// Same value = equal`,
    explanation: 'Primitives are compared by their actual value.',
    highlight: 'value',
  },
  {
    title: 'Comparing Objects',
    code: `let obj1 = { x: 1 };
let obj2 = { x: 1 };
console.log(obj1 === obj2); // false!
// Different objects in memory`,
    explanation: 'Objects are compared by reference, not by their contents.',
    highlight: 'reference',
  },
]

export function DataTypesViz() {
  const [activeTab, setActiveTab] = useState<Tab>('primitives')
  const [selectedType, setSelectedType] = useState<TypeInfo | null>(null)
  const [compareStep, setCompareStep] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      {/* Tab selector */}
      <div className="flex gap-2 justify-center p-1.5 bg-black/30 border border-white/[0.08] rounded-full">
        <button
          className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
            activeTab === 'primitives'
              ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
              : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('primitives')}
        >
          7 Primitives
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
            activeTab === 'reference'
              ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
              : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('reference')}
        >
          Reference Types
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ${
            activeTab === 'compare'
              ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
              : 'bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:bg-white/[0.08] hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('compare')}
        >
          Value vs Reference
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'primitives' && (
          <motion.div
            key="primitives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
              {primitives.map(type => (
                <motion.button
                  key={type.id}
                  className={`flex flex-col items-center gap-1.5 p-4 bg-black/30 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                    selectedType?.id === type.id ? 'bg-white/[0.08]' : ''
                  }`}
                  style={{ borderColor: selectedType?.id === type.id ? type.color : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="w-4 h-4 rounded-full" style={{ background: type.color }} />
                  <span className="text-sm font-medium text-gray-300">{type.name}</span>
                </motion.button>
              ))}
            </div>

            {selectedType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-black/40 border-2 rounded-xl"
                style={{ borderColor: selectedType.color }}
              >
                <h3 className="text-base font-semibold m-0 mb-3" style={{ color: selectedType.color }}>{selectedType.name}</h3>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs text-gray-500 min-w-[70px]">Examples:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedType.examples.map((ex, i) => (
                      <code key={i} className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{ex}</code>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs text-gray-500 min-w-[70px]">typeof:</span>
                  <code className="font-mono text-sm text-blue-300">{selectedType.typeof}</code>
                </div>
                {selectedType.note && (
                  <div className="mt-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-500">
                    {selectedType.note}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'reference' && (
          <motion.div
            key="reference"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
              {referenceTypes.map(type => (
                <motion.button
                  key={type.id}
                  className={`flex flex-col items-center gap-1.5 p-4 bg-black/30 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                    selectedType?.id === type.id ? 'bg-white/[0.08]' : ''
                  }`}
                  style={{ borderColor: selectedType?.id === type.id ? type.color : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="w-4 h-4 rounded-full" style={{ background: type.color }} />
                  <span className="text-sm font-medium text-gray-300">{type.name}</span>
                </motion.button>
              ))}
            </div>

            {selectedType && referenceTypes.find(t => t.id === selectedType.id) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-black/40 border-2 rounded-xl"
                style={{ borderColor: selectedType.color }}
              >
                <h3 className="text-base font-semibold m-0 mb-3" style={{ color: selectedType.color }}>{selectedType.name}</h3>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs text-gray-500 min-w-[70px]">Examples:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedType.examples.map((ex, i) => (
                      <code key={i} className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{ex}</code>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs text-gray-500 min-w-[70px]">typeof:</span>
                  <code className="font-mono text-sm text-blue-300">{selectedType.typeof}</code>
                </div>
                {selectedType.note && (
                  <div className="mt-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-500">
                    {selectedType.note}
                  </div>
                )}
              </motion.div>
            )}

            <div className="px-6 py-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-300 text-center">
              Everything that isn&apos;t a primitive is an object - including arrays and functions!
            </div>
          </motion.div>
        )}

        {activeTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="p-6 bg-black/40 border border-white/10 rounded-xl">
              <h3 className="text-base font-semibold text-white m-0 mb-3 text-center">
                {compareSteps[compareStep].title}
              </h3>
              <pre className="bg-black/40 rounded-lg p-4 m-0 mb-3 overflow-x-auto">
                <code className="font-mono text-xs text-gray-300 whitespace-pre">{compareSteps[compareStep].code}</code>
              </pre>
              <p className="text-base text-gray-400 text-center m-0 mb-4">
                {compareSteps[compareStep].explanation}
              </p>
              <div className="flex justify-center">
                {compareSteps[compareStep].highlight === 'value' ? (
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col items-center gap-1 px-6 py-2 bg-black/30 border-2 border-emerald-500 rounded-lg">
                      <span className="text-[10px] text-gray-500">Variable A</span>
                      <span className="font-mono text-sm text-emerald-500">Value</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-6 py-2 bg-black/30 border-2 border-blue-500 rounded-lg">
                      <span className="text-[10px] text-gray-500">Variable B</span>
                      <span className="font-mono text-sm text-blue-500">Copy</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col items-center gap-1 px-6 py-2 bg-black/30 border-2 border-amber-500 rounded-lg">
                      <span className="text-[10px] text-gray-500">obj1</span>
                      <span className="text-base text-gray-500">→</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-6 py-2 bg-purple-500/10 border-2 border-purple-500 rounded-lg">
                      <span className="text-[10px] text-gray-500">Object</span>
                      <span className="font-mono text-sm text-purple-400">&#123; x: ... &#125;</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-6 py-2 bg-black/30 border-2 border-amber-500 rounded-lg">
                      <span className="text-[10px] text-gray-500">obj2</span>
                      <span className="text-base text-gray-500">→</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-center items-center">
              <button
                className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setCompareStep(s => Math.max(0, s - 1))}
                disabled={compareStep === 0}
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 px-4">{compareStep + 1} / {compareSteps.length}</span>
              <button
                className="px-6 py-2 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 border-0 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCompareStep(s => Math.min(compareSteps.length - 1, s + 1))}
                disabled={compareStep === compareSteps.length - 1}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
