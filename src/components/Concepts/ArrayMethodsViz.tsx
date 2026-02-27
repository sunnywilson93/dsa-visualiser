'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ArrayMethodsVizProps {
  mode?: 'mutation' | 'iteration' | 'transformation' | 'searching' | 'sorting' | 'reduce'
}

export function ArrayMethodsViz({ mode = 'mutation' }: ArrayMethodsVizProps) {
  const [array, setArray] = useState([1, 2, 3])
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const methods = {
    mutation: [
      { name: 'push(4)', desc: 'Add to end', effect: (arr: number[]) => [...arr, 4] },
      { name: 'pop()', desc: 'Remove from end', effect: (arr: number[]) => arr.slice(0, -1) },
      { name: 'shift()', desc: 'Remove from start', effect: (arr: number[]) => arr.slice(1) },
      { name: 'unshift(0)', desc: 'Add to start', effect: (arr: number[]) => [0, ...arr] },
      { name: 'splice(1, 1)', desc: 'Remove at index', effect: (arr: number[]) => arr.filter((_, i) => i !== 1) },
    ],
    iteration: [
      { name: 'forEach', desc: 'Execute for each', effect: (arr: number[]) => arr },
      { name: 'map(x => x * 2)', desc: 'Transform each', effect: (arr: number[]) => arr.map(x => x * 2) },
      { name: 'filter(x => x > 1)', desc: 'Keep matching', effect: (arr: number[]) => arr.filter(x => x > 1) },
    ],
    transformation: [
      { name: 'map', desc: 'One-to-one transform', effect: (arr: number[]) => arr.map(x => x * 2) },
      { name: 'filter', desc: 'Keep some elements', effect: (arr: number[]) => arr.filter(x => x > 1) },
      { name: 'flat', desc: 'Flatten nested', effect: (arr: number[]) => arr },
    ],
    searching: [
      { name: 'find', desc: 'First match', effect: (arr: number[]) => [arr.find(x => x > 1) || 0] },
      { name: 'indexOf', desc: 'Find index', effect: (arr: number[]) => [arr.indexOf(2)] },
      { name: 'includes', desc: 'Check existence', effect: (arr: number[]) => [arr.includes(2) ? 1 : 0] },
    ],
    sorting: [
      { name: 'sort()', desc: 'Alphabetical sort', effect: (arr: number[]) => [...arr].sort() },
      { name: 'sort((a,b) => a-b)', desc: 'Numeric sort', effect: (arr: number[]) => [...arr].sort((a, b) => a - b) },
      { name: 'reverse()', desc: 'Reverse order', effect: (arr: number[]) => [...arr].reverse() },
    ],
    reduce: [
      { name: 'sum', desc: 'Accumulate sum', effect: (arr: number[]) => [arr.reduce((a, b) => a + b, 0)] },
      { name: 'max', desc: 'Find maximum', effect: (arr: number[]) => [Math.max(...arr)] },
      { name: 'group', desc: 'Group by condition', effect: (arr: number[]) => arr },
    ]
  }

  const currentMethods = methods[mode]

  const handleMethodClick = (method: typeof currentMethods[0]) => {
    setSelectedMethod(method.name)
    setArray(method.effect(array))
  }

  const reset = () => {
    setArray([1, 2, 3])
    setSelectedMethod(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white capitalize">{mode} Methods</h3>
      
      {/* Array Display */}
      <div className="flex justify-center gap-2">
        <AnimatePresence mode="popLayout">
          {array.map((item, i) => (
            <motion.div
              key={`${i}-${item}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-mono text-xl text-blue-300"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Method Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {currentMethods.map((m) => (
          <button
            key={m.name}
            onClick={() => handleMethodClick(m)}
            className={`p-3 rounded-lg text-left transition-all ${
              selectedMethod === m.name
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-black-30 border border-white-10 hover:bg-white-5'
            }`}
          >
            <div className="font-mono text-sm text-blue-300">{m.name}</div>
            <div className="text-xs text-gray-500">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="mx-auto px-4 py-2 rounded-lg bg-white-5 text-gray-400 hover:bg-white-10 transition-colors"
      >
        Reset Array
      </button>
    </div>
  )
}
