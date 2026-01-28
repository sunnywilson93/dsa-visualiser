'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Box, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  ChevronRight,
  ChevronDown,
  Hash,
  Type,
  Binary,
  ToggleLeft,
  Braces,
  SquareFunction
} from 'lucide-react'
import type { RuntimeValue, ExecutionStep } from '@/types'

interface VariablesPanelProps {
  step: ExecutionStep | null | undefined
}

// Type icons for variables
const TYPE_ICONS = {
  number: Hash,
  string: Type,
  boolean: ToggleLeft,
  array: Braces,
  object: Box,
  function: SquareFunction,
  undefined: EyeOff,
  null: EyeOff,
} as const

const TYPE_COLORS: Record<string, string> = {
  number: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  string: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  boolean: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  array: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
  object: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
  function: 'text-accent-pink bg-accent-pink/10 border-accent-pink/20',
  undefined: 'text-text-muted bg-bg-tertiary border-border-primary',
  null: 'text-text-muted bg-bg-tertiary border-border-primary',
}

function getTypeInfo(value: RuntimeValue): { type: string; icon: typeof Box; color: string } {
  let type: keyof typeof TYPE_ICONS = 'object'
  
  switch (value.type) {
    case 'primitive':
      type = value.dataType as keyof typeof TYPE_ICONS
      break
    case 'array':
      type = 'array'
      break
    case 'object':
      type = 'object'
      break
    case 'function':
      type = 'function'
      break
    case 'undefined':
      type = 'undefined'
      break
    case 'null':
      type = 'null'
      break
  }
  
  return {
    type,
    icon: TYPE_ICONS[type] || Box,
    color: TYPE_COLORS[type] || TYPE_COLORS.object,
  }
}

function formatValueDetailed(value: RuntimeValue): { short: string; full: string } {
  switch (value.type) {
    case 'primitive':
      const str = value.dataType === 'string' ? `"${value.value}"` : String(value.value)
      return { short: str, full: str }
    case 'undefined':
      return { short: 'undefined', full: 'undefined' }
    case 'null':
      return { short: 'null', full: 'null' }
    case 'function':
      return { 
        short: `ƒ ${value.name || 'anonymous'}()`, 
        full: `function ${value.name || 'anonymous'}(${value.params.join(', ')}) { ... }` 
      }
    case 'array':
      const elements = value.elements.map(e => formatValueDetailed(e).short).join(', ')
      return { 
        short: `[${value.elements.length}]`, 
        full: `[${elements}]` 
      }
    case 'object':
      const keys = Object.keys(value.properties)
      return { 
        short: `{${keys.length}}`, 
        full: `{ ${keys.join(', ')} }` 
      }
    default:
      return { short: String(value), full: String(value) }
  }
}

interface VariableRowProps {
  name: string
  value: RuntimeValue
  depth?: number
}

function VariableRow({ name, value, depth = 0 }: VariableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { type, icon: Icon, color } = getTypeInfo(value)
  const { short, full } = formatValueDetailed(value)
  const isExpandable = value.type === 'array' || value.type === 'object'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${name} = ${full}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  
  // Get nested properties/elements
  const nestedItems = value.type === 'array' 
    ? value.elements.map((el, i) => ({ name: `[${i}]`, value: el }))
    : value.type === 'object'
    ? Object.entries(value.properties).map(([k, v]) => ({ name: k, value: v }))
    : []
  
  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded-lg
          hover:bg-white-5 transition-colors group
          ${depth > 0 ? 'ml-4 border-l border-border-primary pl-4' : ''}
        `}
      >
        {/* Expand/Collapse button */}
        {isExpandable ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-white-10 text-text-muted"
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        {/* Type Icon */}
        <div className={`p-1 rounded-md ${color}`}>
          <Icon size={12} />
        </div>
        
        {/* Variable Name */}
        <span className="text-sm font-mono text-text-secondary min-w-[60px]">
          {name}
        </span>
        
        {/* Equals */}
        <span className="text-text-muted">=</span>
        
        {/* Value */}
        <span 
          className="text-sm font-mono flex-1 truncate"
          title={full}
        >
          {isExpandable ? (
            <span className={color.split(' ')[0]}>{short}</span>
          ) : (
            <span className={color.split(' ')[0]}>{short}</span>
          )}
        </span>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`
            opacity-0 group-hover:opacity-100 
            p-1 rounded hover:bg-white-10 
            text-text-muted hover:text-text-bright
            transition-all
          `}
          title="Copy value"
        >
          {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
        </button>
      </div>
      
      {/* Nested items */}
      <AnimatePresence>
        {isExpanded && nestedItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {nestedItems.map((item, idx) => (
              <VariableRow 
                key={idx}
                name={item.name}
                value={item.value}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function VariablesPanel({ step }: VariablesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedScopes, setExpandedScopes] = useState<Record<string, boolean>>({
    global: true,
  })
  
  if (!step) return null
  
  // Collect all variables from scopes
  const scopes = step.scopes.map((scope, idx) => ({
    id: scope.type === 'global' ? 'global' : `scope-${idx}`,
    name: scope.type === 'global' ? 'Global' : scope.name || 'Local',
    variables: Object.entries(scope.variables),
  })).filter(s => s.variables.length > 0)
  
  // Filter variables by search
  const filteredScopes = scopes.map(scope => ({
    ...scope,
    variables: scope.variables.filter(([name]) => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(s => s.variables.length > 0)
  
  if (scopes.length === 0) return null
  
  return (
    <div className="p-3 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search variables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-bg-tertiary border border-border-primary rounded-lg text-text-bright placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-bright"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Scopes */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredScopes.map(scope => (
          <div key={scope.id} className="rounded-lg border border-border-primary/50 overflow-hidden">
            {/* Scope Header */}
            <button
              onClick={() => setExpandedScopes(prev => ({
                ...prev,
                [scope.id]: !prev[scope.id]
              }))}
              className="w-full flex items-center justify-between px-3 py-2 bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedScopes[scope.id] !== false ? (
                  <ChevronDown size={14} className="text-text-muted" />
                ) : (
                  <ChevronRight size={14} className="text-text-muted" />
                )}
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {scope.name}
                </span>
                <span className="text-xs text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">
                  {scope.variables.length}
                </span>
              </div>
            </button>
            
            {/* Scope Variables */}
            <AnimatePresence>
              {expandedScopes[scope.id] !== false && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-1">
                    {scope.variables.map(([name, value]) => (
                      <VariableRow key={name} name={name} value={value} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        
        {filteredScopes.length === 0 && searchTerm && (
          <div className="text-center py-4 text-sm text-text-muted">
            No variables match &ldquo;{searchTerm}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}
