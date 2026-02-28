'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'getters' | 'methods' | 'strict' | 'clone'

const content = {
  getters: {
    title: 'Getters & Setters',
    before: 'const user = { first: "Alice", last: "Smith" };\nconst full = user.first + " " + user.last;\n// Must compute manually every time',
    after: 'const user = {\n  first: "Alice", last: "Smith",\n  get fullName() {\n    return this.first + " " + this.last;\n  }\n};\nuser.fullName; // "Alice Smith"',
    highlight: 'get',
    explanation: 'Getters compute values on access -- looks like a property, runs like a function',
  },
  methods: {
    title: 'Object Static Methods',
    obj: '{ name: "Alice", age: 25, role: "dev" }',
  },
  strict: {
    title: 'Strict Mode',
    sloppy: 'x = 5;\nconsole.log(x); // 5\n// Created global variable!\n// No error -- silent bug',
    strict: '"use strict";\nx = 5;\n// ReferenceError!\n// x is not defined\n// Catches the mistake',
  },
  clone: {
    title: 'Structured Clone',
    shallow: 'const copy = { ...original };\ncopy.nested.value = "changed";\n// original.nested.value\n// also "changed"!',
    deep: 'const copy = structuredClone(original);\ncopy.nested.value = "changed";\n// original.nested.value\n// still "original"!',
  },
}

const objectMethods = [
  { label: 'Object.keys()', result: '["name", "age", "role"]' },
  { label: 'Object.values()', result: '["Alice", 25, "dev"]' },
  { label: 'Object.entries()', result: '[["name","Alice"], ["age",25], ["role","dev"]]' },
  { label: 'Object.freeze()', result: 'Object is now immutable! Assignments silently fail.' },
]

export function ObjectPatternsViz() {
  const [tab, setTab] = useState<Tab>('getters')
  const [showResult, setShowResult] = useState(false)
  const [methodResult, setMethodResult] = useState('')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'getters', label: 'Get/Set' },
    { id: 'methods', label: 'Object.*' },
    { id: 'strict', label: 'Strict' },
    { id: 'clone', label: 'Clone' },
  ]

  const reset = () => { setShowResult(false); setMethodResult('') }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">Object Patterns</h3>

      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem]">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); reset() }} className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${tab === t.id ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'getters' && (
          <motion.div key="getters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white-10 bg-black-30 p-4">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Old Way</div>
                <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap">{content.getters.before}</pre>
              </div>
              <motion.div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4" animate={{ borderColor: showResult ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.2)' }}>
                <div className="text-xs text-blue-400 mb-2 uppercase tracking-wide">Modern Way</div>
                {showResult ? (
                  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-blue-300 whitespace-pre-wrap">
                    {content.getters.after.split(content.getters.highlight).map((part, i, arr) => (
                      <span key={i}>{part}{i < arr.length - 1 && <span className="bg-blue-500/30 text-blue-200 px-1 rounded">{content.getters.highlight}</span>}</span>
                    ))}
                  </motion.pre>
                ) : <div className="h-20 flex items-center justify-center text-gray-600">Click transform to see</div>}
              </motion.div>
            </div>
            {showResult && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-gray-300 text-sm">{content.getters.explanation}</motion.div>}
            <button onClick={() => setShowResult(!showResult)} className="mx-auto px-6 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
              {showResult ? 'Reset' : 'Transform'}
            </button>
          </motion.div>
        )}

        {tab === 'methods' && (
          <motion.div key="methods" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="rounded-xl border border-white-10 bg-black-30 p-4 text-center">
              <span className="font-mono text-sm text-blue-300">{content.methods.obj}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {objectMethods.map(m => (
                <button key={m.label} onClick={() => setMethodResult(m.result)} className={`p-3 rounded-lg text-left transition-all ${methodResult === m.result ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-black-30 border border-white-10 hover:bg-white-5'}`}>
                  <div className="font-mono text-sm text-blue-300">{m.label}</div>
                </button>
              ))}
            </div>
            {methodResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 font-mono text-sm text-emerald-400 text-center break-all">{methodResult}</motion.div>}
          </motion.div>
        )}

        {tab === 'strict' && (
          <motion.div key="strict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="text-xs text-amber-400 mb-2 uppercase tracking-wide">Sloppy Mode</div>
                <pre className="font-mono text-sm text-amber-300/80 whitespace-pre-wrap">{content.strict.sloppy}</pre>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="text-xs text-emerald-400 mb-2 uppercase tracking-wide">Strict Mode</div>
                <pre className="font-mono text-sm text-emerald-300/80 whitespace-pre-wrap">{content.strict.strict}</pre>
              </div>
            </div>
            <div className="text-center text-sm text-gray-300 bg-blue-500/10 border border-blue-500/20 rounded-lg py-2 px-4">Strict mode catches silent errors and prevents unsafe actions</div>
          </motion.div>
        )}

        {tab === 'clone' && (
          <motion.div key="clone" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
            <div className="flex justify-center gap-3 mb-1">
              {['original', 'nested'].map(label => (
                <div key={label} className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 font-mono text-xs text-purple-300">
                  {label === 'original' ? '{ nested: { value: "original" } }' : '{ value: "original" }'}
                  <div className="text-[10px] text-gray-500 mt-1">{label === 'original' ? 'outer object' : 'inner ref'}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="text-xs text-amber-400 mb-2 uppercase tracking-wide">Spread (shallow)</div>
                <pre className="font-mono text-xs text-amber-300/80 whitespace-pre-wrap">{content.clone.shallow}</pre>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="text-xs text-emerald-400 mb-2 uppercase tracking-wide">structuredClone (deep)</div>
                <pre className="font-mono text-xs text-emerald-300/80 whitespace-pre-wrap">{content.clone.deep}</pre>
              </div>
            </div>
            <div className="text-center text-sm text-gray-300 bg-blue-500/10 border border-blue-500/20 rounded-lg py-2 px-4">Shallow copies share nested references -- deep copies are fully independent</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
