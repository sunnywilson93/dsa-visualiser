'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reorder } from 'framer-motion'
import { Settings2 } from 'lucide-react'
import { PanelIcon } from '@/components/Icons'
import { useExecutionStore, useCurrentStep, useVisibleConsoleOutput, usePanelStore, PANELS } from '@/store'
import type { RuntimeValue, ArrayValue, ExecutionStep } from '@/types'
import { ArrayVisualization } from '@/components/Visualization/ArrayVisualization'
import { BinaryVisualization } from '@/components/Visualization/BinaryVisualization'
import { HeapVisualization } from '@/components/Visualization/HeapVisualization'
import { DraggablePanel, PanelSettings } from './DraggablePanel'
import { VariablesPanel } from './VariablesPanel'

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
        <PanelIcon panelId="visualization" size="xl" className="text-brand-primary" />
      </div>
      <p className="text-lg font-medium text-text-secondary">Click Analyze to visualize</p>
      <p className="text-sm mt-1">See step-by-step execution, variables, and output</p>
    </div>
  )
}

// Panel Content Components
function MainVisualization({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  const arrays = useMemo(() => step ? extractArrays(step) : [], [step])
  const showBitwise = useMemo(() => step ? isBitwiseOperation(step) : false, [step])
  const hasContent = arrays.length > 0 || showBitwise
  
  if (!step || !hasContent) {
    return (
      <div className="p-4 text-center text-sm text-text-muted">
        No algorithm visualization for this step
      </div>
    )
  }
  
  return (
    <div className="p-4 space-y-4">
      {showBitwise && <BinaryVisualization step={step} />}
      {arrays.map(({ name, array }) => (
        <ArrayVisualization key={array.id} array={array} step={step} varName={name} />
      ))}
    </div>
  )
}

function CallStack({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  if (!step || step.callStack.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-text-muted">
        Call stack is empty
      </div>
    )
  }
  
  return (
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
  )
}

function ConsoleOutput() {
  const consoleOutput = useVisibleConsoleOutput()
  const status = useExecutionStore(state => state.status)
  
  if (status === 'idle') {
    return (
      <div className="p-4 text-center text-sm text-text-muted">
        Console output will appear here
      </div>
    )
  }
  
  return (
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
  )
}

// --- Main Component ---
export function UnifiedVisualization() {
  const currentStep = useCurrentStep()
  const status = useExecutionStore(state => state.status)
  const isIdle = status === 'idle'
  const [showSettings, setShowSettings] = useState(false)
  
  const { order, collapsed, toggleCollapsed, movePanel } = usePanelStore()
  
  // Handle reorder from Reorder.Group
  const handleReorder = (newOrder: typeof order) => {
    // Find what moved
    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i] !== order[i]) {
        const oldIndex = order.indexOf(newOrder[i])
        if (oldIndex !== -1 && oldIndex !== i) {
          movePanel(oldIndex, i)
          break
        }
      }
    }
  }
  
  // Render panel content based on type
  const renderPanelContent = (panelId: string) => {
    switch (panelId) {
      case 'heap-memory':
        return currentStep ? <HeapVisualization step={currentStep} /> : null
      case 'visualization':
        return <MainVisualization step={currentStep} />
      case 'call-stack':
        return <CallStack step={currentStep} />
      case 'variables':
        return <VariablesPanel step={currentStep} />
      case 'console-output':
        return <ConsoleOutput />
      default:
        return null
    }
  }
  
  // On mobile, show a compact placeholder when idle
  if (isIdle) {
    return (
      <div className="h-full flex flex-col relative">
        {/* Mobile: show compact hint */}
        <div className="lg:hidden flex items-center justify-center gap-2 p-3 bg-bg-tertiary/50 border-b border-border-primary text-sm text-text-muted">
          <PanelIcon panelId="visualization" size="sm" className="text-brand-primary" />
          <span>Tap <span className="text-brand-primary font-medium">Analyze</span> to see visualization</span>
        </div>
        
        {/* Desktop: show full empty state */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-6">
          <EmptyState />
        </div>
        
        {/* Mobile: show variable placeholders */}
        <div className="lg:hidden flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="bg-bg-secondary rounded-lg border border-border-primary p-3">
            <div className="flex items-center gap-2 text-xs text-text-muted uppercase mb-2">
              <PanelIcon panelId="variables" size="sm" />
              <span>Variables</span>
            </div>
            <p className="text-sm text-text-muted">Run code to see variables</p>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border-primary p-3">
            <div className="flex items-center gap-2 text-xs text-text-muted uppercase mb-2">
              <PanelIcon panelId="console-output" size="sm" />
              <span>Output</span>
            </div>
            <p className="text-sm text-text-muted">Console output will appear here</p>
          </div>
        </div>
        
        {/* Settings Button (even when idle) */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-bg-secondary border border-border-primary text-text-muted hover:text-text-bright hover:border-brand-primary transition-colors"
          title="Panel Settings"
        >
          <Settings2 size={16} />
        </button>
        
        <AnimatePresence>
          {showSettings && <PanelSettings onClose={() => setShowSettings(false)} />}
        </AnimatePresence>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Settings Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`
            p-2 rounded-lg border transition-all
            ${showSettings 
              ? 'bg-brand-primary text-white border-brand-primary' 
              : 'bg-bg-secondary text-text-muted hover:text-text-bright border-border-primary hover:border-brand-primary'
            }
          `}
          title="Panel Settings"
        >
          <Settings2 size={16} />
        </button>
      </div>
      
      {/* Draggable Panels */}
      <div className="flex-1 overflow-y-auto p-4 pt-12">
        <Reorder.Group 
          axis="y" 
          values={order} 
          onReorder={handleReorder}
          className="space-y-3"
        >
          {order.map((panelId) => {
            const panel = PANELS.find(p => p.id === panelId)
            if (!panel) return null
            
            const content = renderPanelContent(panelId)
            if (!content) return null
            
            return (
              <Reorder.Item
                key={panelId}
                value={panelId}
                className="cursor-grab active:cursor-grabbing"
              >
                <DraggablePanel
                  id={panelId}
                  label={panel.label}
                  isCollapsed={collapsed[panelId]}
                  onToggle={() => toggleCollapsed(panelId)}
                >
                  {content}
                </DraggablePanel>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && <PanelSettings onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
