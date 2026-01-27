'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Layers, Box, BarChart3, ChevronDown, ChevronRight } from 'lucide-react'
import { useExecutionStore, useCurrentStep, useVisibleConsoleOutput } from '@/store'
import type { RuntimeValue, ArrayValue, ExecutionStep } from '@/types'
import { ArrayVisualization } from '@/components/Visualization/ArrayVisualization'
import { BinaryVisualization } from '@/components/Visualization/BinaryVisualization'

// --- Value Formatting ---
function formatValue(value: RuntimeValue): string {
  switch (value.type) {
    case 'primitive':
      if (value.dataType === 'string') return `"${value.value}"`
      return String(value.value)
    case 'undefined':
      return 'undefined'
    case 'null':
      return 'null'
    case 'function':
      return `ƒ ${value.name || 'anonymous'}()`
    case 'array':
      return `[${value.elements.length} items]`
    case 'object':
      return '{...}'
    default:
      return String((value as { value?: unknown }).value ?? 'unknown')
  }
}

function getValueColor(value: RuntimeValue): string {
  switch (value.type) {
    case 'primitive':
      if (value.dataType === 'number') return 'text-accent-purple'
      if (value.dataType === 'string') return 'text-accent-green'
      if (value.dataType === 'boolean') return 'text-accent-blue'
      return 'text-text-primary'
    case 'function':
      return 'text-accent-yellow'
    case 'array':
    case 'object':
      return 'text-text-secondary'
    default:
      return 'text-text-primary'
  }
}

// --- Visualization Detection ---
interface DetectedArray {
  name: string
  array: ArrayValue
}

function extractArrays(step: ReturnType<typeof useCurrentStep>): DetectedArray[] {
  if (!step) return []
  
  const arrays: DetectedArray[] = []
  const seen = new Set<string>()
  
  const checkValue = (name: string, value: RuntimeValue) => {
    if (value.type === 'array' && !seen.has(value.id)) {
      seen.add(value.id)
      arrays.push({ name, array: value })
    }
  }
  
  for (const scope of step.scopes) {
    for (const [name, value] of Object.entries(scope.variables)) {
      checkValue(name, value)
    }
  }
  
  for (const frame of step.callStack) {
    for (const [name, value] of Object.entries(frame.params)) {
      checkValue(name, value)
    }
    for (const [name, value] of Object.entries(frame.locals)) {
      checkValue(name, value)
    }
  }
  
  return arrays
}

function isBitwiseOperation(step: ExecutionStep | undefined): boolean {
  if (!step) return false
  const desc = step.description
  const bitwisePatterns = [
    /\d+\s*\^\s*\d+/,
    /\d+\s*&\s*\d+/,
    /\d+\s*\|\s*\d+/,
    /\d+\s*<<\s*\d+/,
    /\d+\s*>>\s*\d+/,
    /~\s*\w+/,
    /XOR|AND|OR/i,
  ]
  if (desc.includes('&&') || desc.includes('||')) return false
  return bitwisePatterns.some(pattern => pattern.test(desc))
}

// --- Components ---
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-text-muted">
      <div className="w-16 h-16 mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
        <BarChart3 size={32} className="text-brand-primary" />
      </div>
      <p className="text-lg font-medium text-text-secondary">Click Analyze to visualize</p>
      <p className="text-sm mt-1">See step-by-step execution, variables, and output</p>
    </div>
  )
}

function MainVisualization({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  const arrays = useMemo(() => step ? extractArrays(step) : [], [step])
  const showBitwise = useMemo(() => step ? isBitwiseOperation(step) : false, [step])
  const hasContent = arrays.length > 0 || showBitwise
  
  if (!step || !hasContent) return null
  
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary border-b border-border-primary">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Visualization</span>
        {showBitwise && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple">
            Bitwise Operation
          </span>
        )}
      </div>
      <div className="p-4 space-y-4">
        {showBitwise && <BinaryVisualization step={step} />}
        {arrays.map(({ name, array }) => (
          <ArrayVisualization key={array.id} array={array} step={step} varName={name} />
        ))}
      </div>
    </div>
  )
}

function CallStack({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  if (!step || step.callStack.length === 0) return null
  
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border-b border-border-primary">
        <Layers size={14} className="text-text-muted" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Call Stack</span>
      </div>
      <div className="p-3 space-y-2">
        {step.callStack.map((frame, index) => (
          <div
            key={frame.id}
            className={`p-3 rounded-lg border ${
              index === 0 
                ? 'bg-accent-blue/10 border-accent-blue/30' 
                : 'bg-bg-tertiary/50 border-border-primary'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-text-muted">#{index}</span>
              <span className="font-mono text-sm text-text-primary font-medium">{frame.name}()</span>
            </div>
            
            {Object.entries(frame.params).length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {Object.entries(frame.params).map(([name, value]) => (
                  <span key={name} className="font-mono">
                    <span className="text-text-muted">{name}:</span>{' '}
                    <span className={getValueColor(value)}>{formatValue(value)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Variables({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  if (!step) return null
  
  // Collect all variables from scopes
  const scopes = step.scopes.map((scope, idx) => ({
    id: scope.type === 'global' ? 'global' : `scope-${idx}`,
    name: scope.type === 'global' ? 'Global' : scope.name || 'Local',
    variables: Object.entries(scope.variables),
  })).filter(s => s.variables.length > 0)
  
  if (scopes.length === 0) return null
  
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border-b border-border-primary">
        <Box size={14} className="text-text-muted" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Variables</span>
      </div>
      <div className="p-3 space-y-3">
        {scopes.map(scope => (
          <div key={scope.id}>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              {scope.name}
            </div>
            <div className="space-y-1">
              {scope.variables.map(([name, value]) => (
                <div key={name} className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-text-secondary">{name}</span>
                  <span className="text-text-muted">=</span>
                  <span className={getValueColor(value)}>{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsoleOutput() {
  const consoleOutput = useVisibleConsoleOutput()
  const status = useExecutionStore(state => state.status)
  
  if (status === 'idle') {
    return (
      <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border-b border-border-primary">
          <Terminal size={14} className="text-accent-green" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Output</span>
        </div>
        <div className="p-4 text-sm text-text-muted text-center">
          Console output will appear here
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-accent-green" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Output</span>
        </div>
        {consoleOutput.length > 0 && (
          <span className="text-xs text-text-muted">{consoleOutput.length} lines</span>
        )}
      </div>
      <div className="p-3 font-mono text-sm max-h-40 overflow-y-auto">
        {consoleOutput.length === 0 ? (
          <span className="text-text-muted">No output yet</span>
        ) : (
          <div className="space-y-1">
            {consoleOutput.map((line, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-text-muted select-none w-6 text-right">{idx + 1}</span>
                <span className="text-text-primary">{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main Component ---
export function UnifiedVisualization() {
  const currentStep = useCurrentStep()
  const status = useExecutionStore(state => state.status)
  const isIdle = status === 'idle'
  
  if (isIdle) {
    return (
      <div className="h-full p-6">
        <EmptyState />
      </div>
    )
  }
  
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Main Algorithm Visualization */}
      <MainVisualization step={currentStep} />
      
      {/* Call Stack */}
      <CallStack step={currentStep} />
      
      {/* Variables */}
      <Variables step={currentStep} />
      
      {/* Console Output */}
      <ConsoleOutput />
    </div>
  )
}
