'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Layers, Box, ChevronDown, ChevronRight } from 'lucide-react'
import { useExecutionStore, useCurrentStep, useVisibleConsoleOutput } from '@/store'
import type { RuntimeValue } from '@/types'

type Tab = 'variables' | 'stack' | 'console'

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
    case 'undefined':
    case 'null':
      return 'text-text-muted'
    default:
      return 'text-text-primary'
  }
}

function VariablesTab() {
  const currentStep = useCurrentStep()
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set(['global', 'local']))

  if (!currentStep) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <Box size={32} className="mb-2 opacity-30" />
        <p className="text-sm">Run code to see variables</p>
      </div>
    )
  }

  const toggleScope = (scopeId: string) => {
    const newSet = new Set(expandedScopes)
    if (newSet.has(scopeId)) {
      newSet.delete(scopeId)
    } else {
      newSet.add(scopeId)
    }
    setExpandedScopes(newSet)
  }

  // Group variables by scope
  const scopes = currentStep.scopes.map((scope, index) => ({
    id: scope.type === 'global' ? 'global' : `scope-${index}`,
    name: scope.type === 'global' ? 'Global' : scope.type === 'function' ? scope.name || 'Function' : 'Block',
    type: scope.type,
    variables: Object.entries(scope.variables),
  }))

  // Add call stack frame variables
  currentStep.callStack.forEach((frame, index) => {
    const frameVars = [
      ...Object.entries(frame.params),
      ...Object.entries(frame.locals),
    ]
    if (frameVars.length > 0) {
      scopes.push({
        id: `frame-${index}`,
        name: frame.name,
        type: 'function',
        variables: frameVars,
      })
    }
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {scopes.map(scope => (
        <div key={scope.id} className="border-b border-border-primary last:border-0">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-bg-tertiary/50 transition-colors"
            onClick={() => toggleScope(scope.id)}
          >
            {expandedScopes.has(scope.id) ? (
              <ChevronDown size={14} className="text-text-muted" />
            ) : (
              <ChevronRight size={14} className="text-text-muted" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {scope.name}
            </span>
            <span className="text-xs text-text-muted ml-auto">
              {scope.variables.length} vars
            </span>
          </button>

          <AnimatePresence>
            {expandedScopes.has(scope.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                {scope.variables.map(([name, value]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 px-3 py-1.5 pl-8 hover:bg-bg-tertiary/30 transition-colors"
                  >
                    <span className="text-sm font-mono text-text-secondary">{name}</span>
                    <span className="text-text-muted">=</span>
                    <span className={`text-sm font-mono ${getValueColor(value)}`}>
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
                {scope.variables.length === 0 && (
                  <div className="px-3 py-2 pl-8 text-xs text-text-muted italic">
                    No variables
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function StackTab() {
  const currentStep = useCurrentStep()

  if (!currentStep || currentStep.callStack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <Layers size={32} className="mb-2 opacity-30" />
        <p className="text-sm">Run code to see call stack</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2 gap-2">
      {currentStep.callStack.map((frame, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${
            index === 0
              ? 'bg-accent-blue/10 border-accent-blue/30'
              : 'bg-bg-tertiary/50 border-border-primary'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-text-muted">#{index}</span>
            <span className="font-mono text-sm text-text-primary">{frame.name}()</span>
          </div>
          
          {Object.entries(frame.params).length > 0 && (
            <div className="mb-1">
              <span className="text-xs text-text-muted uppercase">Params</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(frame.params).map(([name, value]) => (
                  <span key={name} className="text-xs font-mono">
                    <span className="text-text-secondary">{name}:</span>{' '}
                    <span className={getValueColor(value)}>{formatValue(value)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-text-muted mt-2">
            Line {frame.startLine}
          </div>
        </div>
      ))}
    </div>
  )
}

function ConsoleTab() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const consoleOutput = useVisibleConsoleOutput()
  const status = useExecutionStore(state => state.status)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [consoleOutput])

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <Terminal size={32} className="mb-2 opacity-30" />
        <p className="text-sm">Console output will appear here</p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto p-2 font-mono text-sm">
      {consoleOutput.length === 0 ? (
        <div className="flex items-center justify-center h-full text-text-muted text-sm font-sans">
          <p>No console output yet</p>
        </div>
      ) : (
        consoleOutput.map((line, index) => (
          <div
            key={index}
            className="flex gap-3 py-1 px-2 rounded hover:bg-bg-tertiary/30 transition-colors"
          >
            <span className="text-text-muted min-w-[24px] text-right select-none text-xs">
              {index + 1}
            </span>
            <span className="text-text-primary break-all">{line}</span>
          </div>
        ))
      )}
    </div>
  )
}

export function StatePanel() {
  const [activeTab, setActiveTab] = useState<Tab>('variables')
  const consoleOutput = useVisibleConsoleOutput()

  const tabs: { id: Tab; label: string; icon: typeof Box; count?: number }[] = [
    { id: 'variables', label: 'State', icon: Box },
    { id: 'stack', label: 'Stack', icon: Layers },
    { id: 'console', label: 'Console', icon: Terminal, count: consoleOutput.length },
  ]

  return (
    <div className="flex flex-col h-full bg-bg-secondary border-t border-border-primary">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-bg-tertiary border-b border-border-primary">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-bg-secondary text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary/50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs bg-bg-elevated px-1.5 py-0.5 rounded text-text-muted">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.1 }}
            className="h-full"
          >
            {activeTab === 'variables' && <VariablesTab />}
            {activeTab === 'stack' && <StackTab />}
            {activeTab === 'console' && <ConsoleTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
