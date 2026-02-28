'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'tagged-templates' | 'class-features' | 'proxy' | 'regex'

interface Step {
  label: string
  desc: string
  visual: string[]
  highlight?: number
}

const tabs: Record<Tab, { title: string; steps: Step[] }> = {
  'tagged-templates': {
    title: 'Tagged Templates',
    steps: [
      { label: 'Template', desc: 'A tagged template literal is called', visual: ['highlight`Hello ${name}!`'] },
      { label: 'Split', desc: 'Engine splits into strings and values', visual: ['strings: ["Hello ", "!"]', 'values: ["Alice"]'] },
      { label: 'Tag Runs', desc: 'Tag function receives parts separately', visual: ['function highlight(strings, ...values)', '  strings[0] + wrap(values[0]) + strings[1]'] },
      { label: 'Result', desc: 'Tag function returns the final result', visual: ['=> "Hello <b>Alice</b>!"'] },
    ]
  },
  'class-features': {
    title: 'Class Features',
    steps: [
      { label: 'Base', desc: 'Define a class with a private field', visual: ['class Animal {', '  #sound;            // private', '  constructor(s) { this.#sound = s; }', '}'], highlight: 1 },
      { label: 'Static', desc: 'Static methods belong to the class itself', visual: ['class Animal {', '  static create(s) { return new Animal(s); }', '}', 'Animal.create("woof") // no new needed'], highlight: 1 },
      { label: 'Extends', desc: 'Subclass inherits and extends', visual: ['class Dog extends Animal {', '  fetch() { return "ball"; }', '}', 'dog.fetch()   // "ball"', 'dog.speak()   // inherited'] },
      { label: 'Private', desc: 'Private fields are truly inaccessible', visual: ['const d = new Dog("woof");', 'd.#sound  // SyntaxError!', 'd.speak() // "woof" (via method)'] },
    ]
  },
  proxy: {
    title: 'Proxy & Reflect',
    steps: [
      { label: 'Create', desc: 'Wrap an object with a Proxy and handler', visual: ['const target = { name: "Alice", age: 25 };', 'const handler = { get(t, prop) {...} };', 'const proxy = new Proxy(target, handler);'] },
      { label: 'Access', desc: 'Reading a property triggers the get trap', visual: ['proxy.name', '  => handler.get(target, "name")', '  => "Alice"'], highlight: 1 },
      { label: 'Validate', desc: 'Set trap can validate before writing', visual: ['handler.set(t, prop, val) {', '  if (prop === "age" && val < 0) throw Error;', '  Reflect.set(t, prop, val);', '}'] },
      { label: 'Reflect', desc: 'Reflect performs the default operation', visual: ['proxy.age = -1  // Error!', 'proxy.age = 30  // OK => Reflect.set(...)'] },
    ]
  },
  regex: {
    title: 'Regex Matching',
    steps: [
      { label: 'Pattern', desc: 'Define a regex pattern', visual: ['Pattern: /\\d{3}-\\d{4}/', '\\d = digit, {3} = exactly 3 times'] },
      { label: 'Input', desc: 'Test against a string', visual: ['Input: "Call 555-1234 today"', '       -----^^^^^^^-------'] },
      { label: 'Match', desc: 'Engine finds the match', visual: ['"Call 555-1234 today"', '      ^^^^^^^^', 'match[0] = "555-1234"  index: 5'] },
      { label: 'Groups', desc: 'Capture groups extract parts', visual: ['/(\\d{3})-(\\d{4})/', 'group[1] = "555"', 'group[2] = "1234"'] },
    ]
  }
}

const tabKeys: Tab[] = ['tagged-templates', 'class-features', 'proxy', 'regex']

interface AdvancedPatternsVizProps {
  mode?: Tab
}

export function AdvancedPatternsViz({ mode }: AdvancedPatternsVizProps) {
  const [tab, setTab] = useState<Tab>(mode ?? 'tagged-templates')
  const [step, setStep] = useState(0)

  const current = tabs[tab]
  const s = current.steps[step]

  const switchTab = (t: Tab) => { setTab(t); setStep(0) }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>

      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] flex-wrap">
        {tabKeys.map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${
              t === tab ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]' : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          >
            {tabs[t].title}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        {current.steps.map((st, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 mx-1 p-2 rounded-lg text-left transition-all ${
              i === step ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-black-30 border border-white-10 opacity-50'
            }`}
          >
            <div className="text-xs text-gray-500">Step {i + 1}</div>
            <div className="text-sm font-semibold text-white">{st.label}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${tab}-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-xl bg-black-30 border border-white-10"
        >
          <div className="text-gray-300 text-sm mb-3">{s.desc}</div>
          <pre className="font-mono text-sm text-blue-300 bg-black-50 p-3 rounded-lg whitespace-pre-wrap">
            {s.visual.map((line, i) => (
              <div key={i} className={s.highlight === i ? 'bg-blue-500/20 -mx-3 px-3 rounded' : ''}>{line}</div>
            ))}
          </pre>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-white-5 text-gray-400 disabled:opacity-30 hover:bg-white-10 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(Math.min(current.steps.length - 1, step + 1))}
          disabled={step === current.steps.length - 1}
          className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
