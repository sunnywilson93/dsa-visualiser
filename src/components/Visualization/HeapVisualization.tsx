'use client'

import { useMemo } from 'react'
import { Database, Layers, FunctionSquare, Hash } from 'lucide-react'
import type { RuntimeValue, ExecutionStep, ArrayValue, ObjectValue } from '@/types'
import { formatValue } from '@/engine/runtime'

interface HeapObject {
  id: string
  address: string
  type: 'array' | 'object' | 'function' | 'map' | 'set'
  name: string
  size: number
  refs: number
  data: RuntimeValue[] | Record<string, RuntimeValue> | null
}

interface HeapVisualizationProps {
  step: ExecutionStep
}

function calculateSize(value: RuntimeValue): number {
  switch (value.type) {
    case 'primitive':
      return value.dataType === 'string' 
        ? 4 + (String(value.value).length * 2) // String overhead + chars
        : 8 // Number/boolean
    case 'array':
      return 24 + value.elements.length * 8 // Array overhead + references
    case 'object':
      return 24 + Object.keys(value.properties).length * 16 // Object overhead + entries
    case 'function':
      return 32 // Function object overhead
    default:
      return 8
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function HeapVisualization({ step }: HeapVisualizationProps) {
  const heapObjects = useMemo(() => {
    const objects: HeapObject[] = []
    const seen = new Set<string>()
    const refs = new Map<string, number>()

    // Count references
    const countRefs = (value: RuntimeValue) => {
      if (value.type === 'array' || value.type === 'object') {
        const addr = value.heapAddress || value.id
        refs.set(addr, (refs.get(addr) || 0) + 1)
        
        if (value.type === 'array') {
          value.elements.forEach(countRefs)
        } else {
          Object.values(value.properties).forEach(countRefs)
        }
      }
    }

    // Scan all scopes and call stack for heap objects
    step.scopes.forEach(scope => {
      Object.values(scope.variables).forEach(countRefs)
    })
    
    step.callStack.forEach(frame => {
      Object.values(frame.params).forEach(countRefs)
      Object.values(frame.locals).forEach(countRefs)
    })

    // Extract unique heap objects
    const extractObjects = (value: RuntimeValue, name: string) => {
      if (value.type === 'array' || value.type === 'object') {
        const addr = value.heapAddress || value.id
        if (seen.has(addr)) return
        seen.add(addr)

        // Check if it's a Map (has __mapData)
        const mapData = (value as unknown as Record<string, unknown>).__mapData as Map<string | number, RuntimeValue> | undefined
        const setData = (value as unknown as Record<string, unknown>).__setData as Set<RuntimeValue> | undefined
        
        let displayData: RuntimeValue[] | Record<string, RuntimeValue> | null
        let displayType: 'array' | 'object' | 'function' | 'map' | 'set' = value.type
        
        if (mapData) {
          // Convert Map to object for display
          const mapObj: Record<string, RuntimeValue> = {}
          for (const [k, v] of mapData.entries()) {
            mapObj[String(k)] = v
          }
          displayData = mapObj
          displayType = 'map'
        } else if (setData) {
          // Convert Set to array for display
          displayData = Array.from(setData)
          displayType = 'set'
        } else {
          displayData = value.type === 'array' 
            ? (value as ArrayValue).elements 
            : (value as ObjectValue).properties
        }

        objects.push({
          id: value.id,
          address: addr,
          type: displayType,
          name,
          size: calculateSize(value),
          refs: refs.get(addr) || 0,
          data: displayData
        })

        // Recursively extract nested objects
        if (value.type === 'array') {
          (value as ArrayValue).elements.forEach((el, i) => 
            extractObjects(el, `${name}[${i}]`)
          )
        } else {
          Object.entries((value as ObjectValue).properties).forEach(([key, val]) => 
            extractObjects(val, `${name}.${key}`)
          )
        }
      }
    }

    // Scan all values
    step.scopes.forEach(scope => {
      Object.entries(scope.variables).forEach(([name, value]) => 
        extractObjects(value, name)
      )
    })

    step.callStack.forEach(frame => {
      Object.entries(frame.params).forEach(([name, value]) => 
        extractObjects(value, name)
      )
      Object.entries(frame.locals).forEach(([name, value]) => 
        extractObjects(value, name)
      )
    })

    return objects.sort((a, b) => b.size - a.size)
  }, [step])

  const totalHeapSize = heapObjects.reduce((sum, obj) => sum + obj.size, 0)

  if (heapObjects.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Heap Summary */}
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary rounded-lg border border-border-primary">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-brand-primary" />
          <span className="text-sm font-medium text-text-bright">Heap Memory</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-text-secondary">
            <span className="text-text-bright font-semibold">{heapObjects.length}</span> objects
          </span>
          <span className="text-text-secondary">
            <span className="text-text-bright font-semibold">{formatBytes(totalHeapSize)}</span> allocated
          </span>
        </div>
      </div>

      {/* Heap Objects */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
        {heapObjects.map((obj) => (
          <div
            key={obj.id}
            className="flex flex-col gap-2 p-3 bg-bg-page rounded-lg border border-border-primary hover:border-brand-primary-30 transition-colors"
          >
            {/* Object Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {obj.type === 'array' ? (
                  <Layers size={14} className="text-accent-blue" />
                ) : obj.type === 'function' ? (
                  <FunctionSquare size={14} className="text-accent-green" />
                ) : obj.type === 'map' ? (
                  <Hash size={14} className="text-brand-primary" />
                ) : obj.type === 'set' ? (
                  <Layers size={14} className="text-accent-purple" />
                ) : (
                  <Hash size={14} className="text-accent-orange" />
                )}
                <span className="text-sm font-medium text-text-bright">{obj.name}</span>
                <span className="text-xs font-mono text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">
                  0x{obj.address.slice(-6).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-text-secondary">{formatBytes(obj.size)}</span>
            </div>

            {/* Object Preview */}
            <div className="text-xs text-text-secondary font-mono truncate">
              {obj.type === 'array' && Array.isArray(obj.data) ? (
                <span className="text-accent-blue">[{obj.data.length} items]</span>
              ) : obj.type === 'map' && obj.data ? (
                <span className="text-brand-primary">
                  {'{ '}{Object.entries(obj.data).map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ')}{' }'}
                </span>
              ) : obj.type === 'set' && Array.isArray(obj.data) ? (
                <span className="text-accent-purple">
                  {'{ '}{obj.data.map(v => formatValue(v)).join(', ')}{' }'}
                </span>
              ) : obj.type === 'object' && obj.data ? (
                <span className="text-accent-orange">
                  {'{ '}{Object.keys(obj.data).join(', ')}{' }'}
                </span>
              ) : (
                <span className="text-text-muted">[empty]</span>
              )}
            </div>

            {/* Reference Count Bar */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-muted">refs:</span>
              <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all"
                  style={{ width: `${Math.min(obj.refs * 20, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-brand-primary">{obj.refs}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
