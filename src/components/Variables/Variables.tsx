'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useCurrentScopes, useExecutionStore } from '@/store'
import { formatValue } from '@/engine'
import type { RuntimeValue, Scope } from '@/types'
import styles from './Variables.module.css'

interface ValueDisplayProps {
  value: RuntimeValue
  expanded?: boolean
  onToggle?: () => void
}

function ValueDisplay({ value, expanded, onToggle }: ValueDisplayProps) {
  const isExpandable = value.type === 'array' || value.type === 'object'

  if (!isExpandable) {
    return (
      <span className={`${styles.value} ${styles[value.type]}`}>
        {formatValue(value)}
      </span>
    )
  }

  return (
    <div className={styles.expandableValue}>
      <button className={styles.expandBtn} onClick={onToggle}>
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      <span className={`${styles.value} ${styles[value.type]}`}>
        {expanded ? '' : formatValue(value, true)}
      </span>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.expandedContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {value.type === 'array' && (
              <div className={styles.arrayItems}>
                {value.elements.map((el, i) => (
                  <div key={i} className={styles.arrayItem}>
                    <span className={styles.index}>[{i}]</span>
                    <ValueDisplay value={el} />
                  </div>
                ))}
                {value.elements.length === 0 && (
                  <span className={styles.empty}>empty array</span>
                )}
              </div>
            )}

            {value.type === 'object' && (
              <div className={styles.objectProps}>
                {Object.entries(value.properties).map(([key, val]) => (
                  <div key={key} className={styles.objectProp}>
                    <span className={styles.propKey}>{key}:</span>
                    <ValueDisplay value={val} />
                  </div>
                ))}
                {Object.keys(value.properties).length === 0 && (
                  <span className={styles.empty}>empty object</span>
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
    <div className={styles.variableRow}>
      <span className={styles.varName}>{name}</span>
      <span className={styles.equals}>=</span>
      <ValueDisplay
        value={value}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />
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
    <div className={`${styles.scope} ${isActive ? styles.active : ''}`}>
      <button
        className={styles.scopeHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        <span className={styles.scopeName}>{scope.name}</span>
        <span className={styles.scopeType}>{scope.type}</span>
        <span className={styles.varCount}>{variables.length}</span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className={styles.scopeContent}
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
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Variables</span>
      </div>

      <div className={styles.content}>
        {status === 'idle' && (
          <div className={styles.empty}>
            <p>Run code to see variables</p>
          </div>
        )}

        {status !== 'idle' && isEmpty && (
          <div className={styles.empty}>
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
