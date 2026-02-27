'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModernJSVizProps {
  mode?: 'destructuring' | 'spread' | 'rest' | 'template' | 'optional-chain' | 'nullish' | 'logical-assign'
}

const contentMap = {
  destructuring: {
    title: 'Destructuring',
    before: 'const user = { name: "Alice", age: 25 };\nconst name = user.name;\nconst age = user.age;',
    after: 'const user = { name: "Alice", age: 25 };\nconst { name, age } = user;',
    explanation: 'Extract multiple properties in one line',
    highlight: '{ name, age }'
  },
  spread: {
    title: 'Spread Operator',
    before: 'const arr1 = [1, 2];\nconst arr2 = [3, 4];\n// How to combine?',
    after: 'const arr1 = [1, 2];\nconst arr2 = [3, 4];\nconst combined = [...arr1, ...arr2];\n// [1, 2, 3, 4]',
    explanation: 'Expand arrays/objects with ...',
    highlight: '...'
  },
  rest: {
    title: 'Rest Parameters',
    before: 'function sum(a, b, c) {\n  return a + b + c;\n}',
    after: 'function sum(...numbers) {\n  return numbers.reduce((a, b) => a + b);\n}',
    explanation: 'Collect remaining arguments into array',
    highlight: '...numbers'
  },
  template: {
    title: 'Template Literals',
    before: 'const name = "Alice";\nconst msg = "Hello, " + name + "!";',
    after: 'const name = "Alice";\nconst msg = `Hello, ${name}!`;',
    explanation: 'String interpolation with backticks',
    highlight: '${name}'
  },
  'optional-chain': {
    title: 'Optional Chaining',
    before: 'const city = user && user.address && user.address.city;',
    after: 'const city = user?.address?.city;',
    explanation: 'Safe nested property access with ?.',
    highlight: '?.'
  },
  nullish: {
    title: 'Nullish Coalescing',
    before: 'const value = 0 || 100; // 100 (wrong!)',
    after: 'const value = 0 ?? 100; // 0 (correct!)',
    explanation: 'Only for null/undefined, not all falsy',
    highlight: '??'
  },
  'logical-assign': {
    title: 'Logical Assignment',
    before: 'if (count === null) {\n  count = 0;\n}',
    after: 'count ??= 0; // Assign only if nullish',
    explanation: '??= assigns only if null/undefined',
    highlight: '??='
  }
}

export function ModernJSViz({ mode = 'destructuring' }: ModernJSVizProps) {
  const [showResult, setShowResult] = useState(false)

  const current = contentMap[mode]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="rounded-xl border border-white-10 bg-black-30 p-4">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Old Way</div>
          <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap">{current.before}</pre>
        </div>

        {/* After */}
        <motion.div 
          className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4"
          animate={{ borderColor: showResult ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)' }}
        >
          <div className="text-xs text-blue-400 mb-2 uppercase tracking-wide">Modern Way</div>
          <AnimatePresence>
            {showResult ? (
              <motion.pre 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-blue-300 whitespace-pre-wrap"
              >
                {current.after.split(current.highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="bg-blue-500/30 text-blue-200 px-1 rounded">{current.highlight}</span>
                    )}
                  </span>
                ))}
              </motion.pre>
            ) : (
              <div className="h-20 flex items-center justify-center text-gray-600">
                Click transform to see
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-300 text-sm"
          >
            {current.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setShowResult(!showResult)}
        className="mx-auto px-6 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
      >
        {showResult ? 'Reset' : 'Transform ✨'}
      </button>
    </div>
  )
}
