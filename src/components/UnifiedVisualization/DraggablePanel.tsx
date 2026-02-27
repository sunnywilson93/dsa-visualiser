'use client'

import { useState } from 'react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Settings2,
  RotateCcw,
  ChevronUp,
  ChevronDown as ChevronDownIcon
} from 'lucide-react'
import { usePanelStore, PANELS } from '@/store'
import { PanelIcon, getPanelLabel, type PanelType } from '@/components/Icons'

interface DraggablePanelProps {
  id: PanelType
  label: string
  children: React.ReactNode
  isCollapsed: boolean
  onToggle: () => void
}

export function DraggablePanel({ 
  id, 
  label, 
  children, 
  isCollapsed,
  onToggle 
}: DraggablePanelProps) {
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden group"
    >
      {/* Draggable Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-tertiary border-b border-border-primary cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripVertical 
            size={14} 
            className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" 
          />
          <PanelIcon panelId={id} size="sm" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {label}
          </span>
        </div>
        
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-white-10 text-text-muted hover:text-text-bright transition-colors"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      
      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface PanelSettingsProps {
  onClose: () => void
}

export function PanelSettings({ onClose }: PanelSettingsProps) {
  const { order, movePanel, expandAll, collapseAll, resetToDefault } = usePanelStore()
  const [isReordering, setIsReordering] = useState(false)
  
  const handleReorder = (newOrder: PanelType[]) => {
    // Find what changed and move accordingly
    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i] !== order[i]) {
        const oldIndex = order.indexOf(newOrder[i])
        if (oldIndex !== -1) {
          movePanel(oldIndex, i)
        }
        break
      }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-4 right-4 z-50 w-72 bg-bg-secondary rounded-xl border border-border-primary shadow-xl"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-semibold text-text-bright">Panel Settings</span>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-bright"
          aria-label="Close settings"
        >
          ×
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Reorder Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary uppercase">Order</span>
            <button
              onClick={() => setIsReordering(!isReordering)}
              className="text-xs text-brand-primary hover:text-brand-secondary"
            >
              {isReordering ? 'Done' : 'Edit'}
            </button>
          </div>
          
          {isReordering ? (
            <Reorder.Group 
              axis="y" 
              values={order} 
              onReorder={handleReorder}
              className="space-y-1"
            >
              {order.map((panelId) => {
                const label = getPanelLabel(panelId)
                
                return (
                  <Reorder.Item
                    key={panelId}
                    value={panelId}
                    className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={14} className="text-text-muted" />
                    <PanelIcon panelId={panelId} size="sm" />
                    <span className="text-sm text-text-secondary">{label}</span>
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
          ) : (
            <div className="space-y-1">
              {order.map((panelId, index) => {
                const label = getPanelLabel(panelId)
                
                return (
                  <div
                    key={panelId}
                    className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary/50 rounded-lg"
                  >
                    <span className="text-xs text-text-muted w-4">{index + 1}</span>
                    <PanelIcon panelId={panelId} size="sm" />
                    <span className="text-sm text-text-secondary">{label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="pt-3 border-t border-border-primary">
          <span className="text-xs font-medium text-text-secondary uppercase block mb-2">
            Quick Actions
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={expandAll}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-tertiary rounded-lg hover:bg-white-10 transition-colors"
            >
              <ChevronUp size={12} />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-tertiary rounded-lg hover:bg-white-10 transition-colors"
            >
              <ChevronDownIcon size={12} />
              Collapse All
            </button>
            <button
              onClick={resetToDefault}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-tertiary rounded-lg hover:bg-white-10 transition-colors col-span-2"
            >
              <RotateCcw size={12} />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
