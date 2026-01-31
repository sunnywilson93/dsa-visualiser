'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useCurrentScopes, useExecutionStore } from '@/store'
import { formatValue } from '@/engine'
import type { RuntimeValue, Scope } from '@/types'

interface ValueDisplayProps {
  value: RuntimeValue
  expanded?: boolean
  onToggle?: () => void
}

function ValueDisplay({ value, expanded, onToggle }: ValueDisplayProps) {
  const isExpandable = value.type === 'array' || value.type === 'object'

  if (!isExpandable) {
    const valueClass =
      value.type === 'primitive'
        ? 'text-accent-yellow'
        : value.type === 'function'
        ? 'text-accent-green italic'
        : value.type === 'null' || value.type === 'undefined'
        ? 'text-text-muted italic'
        : 'text-text-secondary'

    return <span className={`break-all ${valueClass}`}>{formatValue(value)}</span>
  }

  const typeClass = value.type === 'array' || value.type === 'object' ? 'text-accent-purple' : 'text-text-secondary'

  return (
    <div className="flex flex-wrap items-start gap-1">
      <button
        className="flex items-center justify-center w-4 h-4 p-0 bg-transparent border-none text-text-muted cursor-pointer shrink-0 hover:text-text-primary"
        onClick={onToggle}
      >
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      <span className={`break-all ${typeClass}`}>{expanded ? '' : formatValue(value, true)}</span>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="w-full pl-4 border-l border-border-secondary ml-1 mt-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {value.type === 'array' && (
              <div className="flex flex-col gap-0.5">
                {value.elements.map((el, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-text-muted min-w-6 shrink-0">[{i}]</span>
                    <ValueDisplay value={el} />
                  </div>
                ))}
                {value.elements.length === 0 && (
                  <span className="text-text-muted italic text-xs">empty array</span>
                )}
              </div>
            )}

            {value.type === 'object' && (
              <div className="flex flex-col gap-0.5">
                {Object.entries(value.properties).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-accent-orange shrink-0">{key}:</span>
                    <ValueDisplay value={val} />
                  </div>
                ))}
                {Object.keys(value.properties).length === 0 && (
                  <span className="text-text-muted italic text-xs">empty object</span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface VariableRowProps {
  name: string
  value: RuntimeValue
}

function VariableRow({ name, value }: VariableRowProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex items-start gap-1 py-1 font-mono text-sm">
      <span className="text-accent-cyan font-medium shrink-0">{name}</span>
      <span className="text-text-muted shrink-0">=</span>
      <ValueDisplay value={value} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
    </div>
  )
}

interface ScopeSectionProps {
  scope: Scope
  isActive: boolean
}

function ScopeSection({ scope, isActive }: ScopeSectionProps) {
  const [collapsed, setCollapsed] = useState(false)
  const variables = Object.entries(scope.variables)

  if (variables.length === 0) return null

  return (
    <div
      className={`mb-2 bg-bg-tertiary border border-border-primary rounded-md overflow-hidden ${
        isActive ? 'border-accent-blue' : ''
      }`}
    >
      <button
        className="flex items-center gap-2 w-full py-2 px-3 bg-transparent border-none text-text-primary cursor-pointer text-left transition-colors duration-150 hover:bg-bg-elevated"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        <span className="font-semibold text-sm">{scope.name}</span>
        <span className="text-2xs text-text-muted py-px px-1.5 bg-bg-primary rounded-sm uppercase">
          {scope.type}
        </span>
        <span className="ml-auto text-xs text-text-muted">{variables.length}</span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="py-2 px-3 border-t border-border-secondary overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {variables.map(([name, value]) => (
              <VariableRow key={name} name={name} value={value} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Variables() {
  const scopes = useCurrentScopes()
  const status = useExecutionStore(state => state.status)

  const isEmpty = scopes.length === 0 || scopes.every(s => Object.keys(s.variables).length === 0)

  return (
    <div className="flex flex-col h-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-semibold uppercase tracking-tight text-text-secondary">
          Variables
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {status === 'idle' && (
          <div className="flex items-center justify-center p-6 text-text-muted text-base text-center">
            <p>Run code to see variables</p>
          </div>
        )}

        {status !== 'idle' && isEmpty && (
          <div className="flex items-center justify-center p-6 text-text-muted text-base text-center">
            <p>No variables in scope</p>
          </div>
        )}

        {scopes.map((scope, index) => (
          <ScopeSection
            key={scope.id}
            scope={scope}
            isActive={index === scopes.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
