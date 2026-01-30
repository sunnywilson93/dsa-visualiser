'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScopeHoistingVizProps {
  mode?: 'scope' | 'hoisting-vars' | 'hoisting-funcs' | 'tdz' | 'lexical'
}

interface Step {
  title: string
  desc: string
  vars: string[]
  hasError: boolean
  errorMsg?: string
}

interface Content {
  title: string
  steps: Step[]
}

const scopeContent: Content = {
  title: 'Scope Nesting',
  steps: [
    { title: 'Global Scope', desc: 'Variables declared outside any function/block', vars: ['globalVar'], hasError: false },
    { title: 'Function Scope', desc: 'Variables declared inside a function', vars: ['globalVar', 'funcVar'], hasError: false },
    { title: 'Block Scope', desc: 'Variables declared inside {} (let/const only)', vars: ['globalVar', 'funcVar', 'blockVar'], hasError: false },
  ]
}

const hoistingVarsContent: Content = {
  title: 'Variable Hoisting',
  steps: [
    { title: 'var hoisting', desc: 'var x is hoisted with value undefined', vars: ['x: undefined'], hasError: false },
    { title: 'let hoisting', desc: 'let y is hoisted but in TDZ', vars: ['x: undefined', 'y: <TDZ>'], hasError: false },
    { title: 'const hoisting', desc: 'const z behaves like let', vars: ['x: undefined', 'y: <TDZ>', 'z: <TDZ>'], hasError: false },
  ]
}

const hoistingFuncsContent: Content = {
  title: 'Function Hoisting',
  steps: [
    { title: 'Declaration', desc: 'function greet() is fully hoisted', vars: ['greet: fn()'], hasError: false },
    { title: 'Expression', desc: 'var greet = fn is NOT hoisted as function', vars: ['greet: undefined'], hasError: false },
    { title: 'Arrow Function', desc: 'const greet = () => same as let/const', vars: ['greet: <TDZ>'], hasError: false },
  ]
}

const tdzContent: Content = {
  title: 'Temporal Dead Zone',
  steps: [
    { title: 'Before Declaration', desc: 'Accessing let/const throws ReferenceError', vars: ['x: <TDZ>'], hasError: true, errorMsg: 'ReferenceError: Cannot access x before initialization' },
    { title: 'At Declaration', desc: 'TDZ ends when declaration is reached', vars: ['x: undefined'], hasError: false },
    { title: 'After Initialization', desc: 'Variable is now usable', vars: ['x: 5'], hasError: false },
  ]
}

const lexicalContent: Content = {
  title: 'Lexical Scope',
  steps: [
    { title: 'Static Scope', desc: 'Scope is determined by code structure, not runtime', vars: ['outer: "global"'], hasError: false },
    { title: 'Nested Functions', desc: 'Inner function has access to outer scope', vars: ['outer: "global"', 'inner: "local"'], hasError: false },
    { title: 'Scope Chain', desc: 'JS looks up variables through parent scopes', vars: ['outer: "global"', 'inner: "local"', 'lookup: found in outer'], hasError: false },
  ]
}

export function ScopeHoistingViz({ mode = 'scope' }: ScopeHoistingVizProps) {
  const [activeStep, setActiveStep] = useState(0)

  const getContent = (): Content => {
    switch (mode) {
      case 'scope': return scopeContent
      case 'hoisting-vars': return hoistingVarsContent
      case 'hoisting-funcs': return hoistingFuncsContent
      case 'tdz': return tdzContent
      case 'lexical': return lexicalContent
      default: return scopeContent
    }
  }

  const current = getContent()
  const step = current.steps[activeStep]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      
      {/* Step Visualizer */}
      <div className="relative min-h-[200px] rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex justify-between mb-4">
          {current.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex-1 mx-1 py-2 rounded-lg text-sm font-medium transition-all ${
                i === activeStep 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-white/5 text-gray-500 hover:bg-white/10'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-gray-300 mb-4">{step.desc}</p>
            
            {/* Variable Display */}
            <div className="flex flex-wrap justify-center gap-2">
              {step.vars.map((v, i) => (
                <motion.div
                  key={v}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-4 py-2 rounded-lg font-mono text-sm border ${
                    v.includes('<TDZ>') 
                      ? 'border-red-500/50 bg-red-500/10 text-red-400'
                      : v.includes('undefined')
                      ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                      : 'border-green-500/50 bg-green-500/10 text-green-400'
                  }`}
                >
                  {v}
                </motion.div>
              ))}
            </div>

            {step.hasError && step.errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm"
              >
                ⚠ {step.errorMsg}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setActiveStep(Math.min(current.steps.length - 1, activeStep + 1))}
          disabled={activeStep === current.steps.length - 1}
          className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 disabled:opacity-30 hover:bg-blue-500/30 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
