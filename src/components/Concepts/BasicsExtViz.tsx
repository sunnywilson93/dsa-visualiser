'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Step {
  label: string
  code: string
  output: string[]
}

interface TabData {
  id: string
  label: string
  title: string
  steps: Step[]
}

const tabs: TabData[] = [
  {
    id: 'strings',
    label: 'Strings',
    title: 'String Immutability',
    steps: [
      { label: 'Create', code: 'let str = "hello";', output: ['"hello"'] },
      { label: 'Mutate?', code: 'str[0] = "H";', output: ['No error — silently ignored'] },
      { label: 'Check', code: 'console.log(str);', output: ['"hello"  // unchanged!'] },
      { label: 'Instead', code: 'str = "H" + str.slice(1);', output: ['"Hello"  // create a new string'] },
    ],
  },
  {
    id: 'equality',
    label: 'Equality',
    title: '== vs === Comparison',
    steps: [
      { label: 'Loose ==', code: '"5" == 5;', output: ['true', '// == coerces "5" → 5, then compares'] },
      { label: 'Strict ===', code: '"5" === 5;', output: ['false', '// === checks type first: string ≠ number'] },
      { label: 'Objects', code: '[] == false;   // true\n[] === false;  // false', output: ['Loose: [] → "" → 0, false → 0', 'Strict: different types, no coercion'] },
      { label: 'Rule', code: '// Always prefer ===\nif (x === 5) { ... }', output: ['Avoids unexpected type coercion bugs'] },
    ],
  },
  {
    id: 'json',
    label: 'JSON',
    title: 'JSON Parse & Stringify',
    steps: [
      { label: 'Stringify', code: 'const obj = { name: "Alice", age: 25 };\nJSON.stringify(obj);', output: ['\'{"name":"Alice","age":25}\''] },
      { label: 'Parse', code: 'const str = \'{"x":1}\';\nJSON.parse(str);', output: ['{ x: 1 }  // string → object'] },
      { label: 'Deep Copy', code: 'const a = { nested: { val: 1 } };\nconst b = JSON.parse(JSON.stringify(a));\nb.nested.val = 99;', output: ['a.nested.val → 1  // untouched!', 'Full deep copy via round-trip'] },
      { label: 'Limits', code: 'JSON.stringify({\n  fn: () => {},\n  undef: undefined,\n  date: new Date()\n});', output: ['fn → omitted (functions lost)', 'undef → omitted', 'date → string (not Date object)'] },
    ],
  },
  {
    id: 'typeof',
    label: 'typeof',
    title: 'typeof Operator',
    steps: [
      { label: 'Basics', code: 'typeof 42;\ntypeof "hello";\ntypeof true;', output: ['"number"', '"string"', '"boolean"'] },
      { label: 'Gotcha: null', code: 'typeof null;', output: ['"object"  // historical bug!', 'Fix: val === null'] },
      { label: 'Gotcha: array', code: 'typeof [];', output: ['"object"  // arrays are objects', 'Fix: Array.isArray([]) → true'] },
      { label: 'Gotcha: NaN', code: 'typeof NaN;', output: ['"number"  // NaN is numeric type', 'Fix: Number.isNaN(NaN) → true'] },
    ],
  },
  {
    id: 'short-circuit',
    label: 'Short-Circuit',
    title: 'Short-Circuit Evaluation',
    steps: [
      { label: '&& (AND)', code: 'false && expensive();\ntrue && getValue();', output: ['false  // right side never runs', 'getValue()  // runs only if left is truthy'] },
      { label: '|| (OR)', code: '"" || "default";\n"hello" || "default";', output: ['"default"  // first truthy value', '"hello"    // already truthy, stops'] },
      { label: '?? (Nullish)', code: 'null ?? "fallback";\n0 ?? "fallback";\n"" ?? "fallback";', output: ['"fallback"  // null triggers ??', '0           // 0 is NOT null/undefined', '""          // "" is NOT null/undefined'] },
      { label: 'Difference', code: '// || treats 0, "", false as falsy\n0 || "default"   → "default"\n// ?? only checks null/undefined\n0 ?? "default"   → 0', output: ['Use || for general fallback', 'Use ?? when 0 or "" are valid values'] },
    ],
  },
]

interface BasicsExtVizProps {
  mode?: 'strings-methods' | 'equality-comparisons' | 'json' | 'typeof-type-checking' | 'short-circuit-evaluation'
}

const modeToTab: Record<string, string> = {
  'strings-methods': 'strings',
  'equality-comparisons': 'equality',
  json: 'json',
  'typeof-type-checking': 'typeof',
  'short-circuit-evaluation': 'short-circuit',
}

export function BasicsExtViz({ mode }: BasicsExtVizProps) {
  const initialTab = mode ? (modeToTab[mode] ?? 'strings') : 'strings'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [step, setStep] = useState(0)

  const current = tabs.find(t => t.id === activeTab) ?? tabs[0]
  const totalSteps = current.steps.length

  const switchTab = (id: string): void => { setActiveTab(id); setStep(0) }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col gap-3"
        >
          <div className="text-xs text-gray-500 text-center uppercase tracking-wide">
            Step {step + 1}: {current.steps[step].label}
          </div>

          <div className="rounded-xl border border-white-10 bg-black-30 p-4">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap m-0">{current.steps[step].code}</pre>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3">
            <div className="text-xs text-blue-400 mb-1.5 uppercase tracking-wide">Output</div>
            <div className="flex flex-col gap-1">
              {current.steps[step].output.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="font-mono text-sm text-blue-300"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2 justify-center items-center">
        <button
          className="px-4 py-2 text-xs bg-white-5 border border-white-10 rounded-lg text-gray-400 cursor-pointer transition-all duration-200 hover:bg-white-10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500 px-4">{step + 1} / {totalSteps}</span>
        <button
          className="px-4 py-2 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
          disabled={step === totalSteps - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
