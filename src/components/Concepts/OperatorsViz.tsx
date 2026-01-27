import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'arithmetic' | 'comparison' | 'logical'

interface Operation {
  expression: string
  result: string
  explanation: string
}

const arithmeticOps: Operation[] = [
  { expression: '10 + 3', result: '13', explanation: 'Addition' },
  { expression: '10 - 3', result: '7', explanation: 'Subtraction' },
  { expression: '10 * 3', result: '30', explanation: 'Multiplication' },
  { expression: '10 / 3', result: '3.333...', explanation: 'Division' },
  { expression: '10 % 3', result: '1', explanation: 'Remainder (modulo)' },
  { expression: '10 ** 3', result: '1000', explanation: 'Exponentiation' },
]

const comparisonOps: Operation[] = [
  { expression: '"5" == 5', result: 'true', explanation: 'Loose equality (coerces types)' },
  { expression: '"5" === 5', result: 'false', explanation: 'Strict equality (no coercion)' },
  { expression: '0 == false', result: 'true', explanation: 'Both become 0' },
  { expression: '0 === false', result: 'false', explanation: 'Different types' },
  { expression: 'null == undefined', result: 'true', explanation: 'Special loose equality case' },
  { expression: 'null === undefined', result: 'false', explanation: 'Different types' },
]

const logicalOps: Operation[] = [
  { expression: 'true && "hello"', result: '"hello"', explanation: '&& returns last truthy or first falsy' },
  { expression: 'false && "hello"', result: 'false', explanation: 'Short-circuits at false' },
  { expression: 'false || "hello"', result: '"hello"', explanation: '|| returns first truthy or last falsy' },
  { expression: '"" || "default"', result: '"default"', explanation: 'Empty string is falsy' },
  { expression: 'null ?? "default"', result: '"default"', explanation: '?? only checks null/undefined' },
  { expression: '0 ?? "default"', result: '0', explanation: '0 is NOT null/undefined' },
]

export function OperatorsViz() {
  const [activeTab, setActiveTab] = useState<Tab>('arithmetic')
  const [selectedOp, setSelectedOp] = useState(0)

  const getOps = () => {
    switch (activeTab) {
      case 'arithmetic': return arithmeticOps
      case 'comparison': return comparisonOps
      case 'logical': return logicalOps
    }
  }

  const ops = getOps()

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* Tab selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-fast cursor-pointer
            ${activeTab === 'arithmetic' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => { setActiveTab('arithmetic'); setSelectedOp(0) }}
        >
          Arithmetic
        </button>
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-fast cursor-pointer
            ${activeTab === 'comparison' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => { setActiveTab('comparison'); setSelectedOp(0) }}
        >
          Comparison
        </button>
        <button
          className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-fast cursor-pointer
            ${activeTab === 'logical' 
              ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' 
              : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          onClick={() => { setActiveTab('logical'); setSelectedOp(0) }}
        >
          Logical
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col gap-[var(--spacing-lg)]"
        >
          {/* Operation list */}
          <div className="grid grid-cols-3 gap-[var(--spacing-sm)] max-sm:grid-cols-2">
            {ops.map((op, i) => (
              <motion.button
                key={i}
                className={`p-2.5 bg-[var(--color-black-30)] border-2 rounded-lg cursor-pointer transition-all duration-fast
                  ${selectedOp === i 
                    ? 'bg-[var(--color-neon-viz-18)] border-[rgba(130,100,255,0.5)]' 
                    : 'border-[var(--color-white-8)] hover:bg-[var(--color-white-5)] hover:border-white/15'
                  }`}
                onClick={() => setSelectedOp(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <code className="font-mono text-xs text-[var(--color-gray-300)]">{op.expression}</code>
              </motion.button>
            ))}
          </div>

          {/* Result display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOp}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-[var(--spacing-sm)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] bg-[var(--color-black-40)] border-2 border-[var(--color-brand-primary-30)] rounded-xl"
            >
              <div className="font-mono text-xl text-[var(--color-brand-light)]">
                <code>{ops[selectedOp].expression}</code>
              </div>
              <div className="text-[length:var(--text-2xl)] text-[var(--color-gray-800)]">=</div>
              <div className="font-mono text-[length:var(--text-2xl)] font-semibold text-[var(--difficulty-1)]">
                <code className={ops[selectedOp].result === 'true' ? 'text-[var(--difficulty-1)]' : ops[selectedOp].result === 'false' ? 'text-[var(--color-accent-red)]' : ''}>
                  {ops[selectedOp].result}
                </code>
              </div>
              <p className="text-base text-[var(--color-gray-500)] m-2">{ops[selectedOp].explanation}</p>
            </motion.div>
          </AnimatePresence>

          {/* Tips */}
          {activeTab === 'comparison' && (
            <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] text-sm text-[var(--difficulty-2)] text-center">
              Always use <code className="bg-[var(--color-black-30)] px-1 py-0.5 rounded">===</code> (strict equality) to avoid type coercion bugs!
            </div>
          )}
          {activeTab === 'logical' && (
            <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-lg bg-[var(--color-amber-10)] border border-[var(--color-amber-30)] text-sm text-[var(--difficulty-2)] text-center">
              <code className="bg-[var(--color-black-30)] px-1 py-0.5 rounded">&&</code> and <code className="bg-[var(--color-black-30)] px-1 py-0.5 rounded">||</code> return actual values, not just booleans!
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
