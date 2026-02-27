'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EventLoopGranularVizProps {
  mode?: 'call-stack' | 'task-queue' | 'microtask' | 'tick' | 'starvation'
}

const tickContent = {
  title: 'Event Loop Tick',
  desc: 'One complete loop iteration',
  steps: ['1. Execute Stack', '2. Execute Microtasks', '3. Render', '4. Execute Macrotask']
}

const starvationContent = {
  title: 'Microtask Starvation',
  desc: 'Recursive microtasks can block',
  warning: 'while (true) queueMicrotask(fn) blocks the event loop!'
}

export function EventLoopGranularViz({ mode = 'call-stack' }: EventLoopGranularVizProps) {
  const [items, setItems] = useState<string[]>([])

  if (mode === 'tick') {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-white">{tickContent.title}</h3>
        <p className="text-center text-gray-400">{tickContent.desc}</p>
        
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {tickContent.steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="px-4 py-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm"
              >
                {step}
              </motion.div>
              {i < tickContent.steps.length - 1 && (
                <div className="mx-2 text-gray-600">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'starvation') {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-white">{starvationContent.title}</h3>
        <p className="text-center text-gray-400">{starvationContent.desc}</p>
        
        <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-semibold">Warning</span>
          </div>
          <code className="text-red-300 font-mono">{starvationContent.warning}</code>
        </div>
        
        <div className="text-sm text-gray-500 text-center">
          Microtasks execute before the next macrotask, but if you keep adding microtasks recursively, macrotasks never run.
        </div>
      </div>
    )
  }

  // Call stack, task queue, microtask modes
  const content = {
    'call-stack': {
      title: 'Call Stack',
      desc: 'LIFO - Last In, First Out',
      color: 'blue' as const,
      actions: [
        { label: 'Push fn()', add: 'fn()' },
        { label: 'Push nested()', add: 'nested()' },
        { label: 'Pop', remove: true },
      ]
    },
    'task-queue': {
      title: 'Task Queue (Macrotasks)',
      desc: 'setTimeout, setInterval, I/O',
      color: 'yellow' as const,
      actions: [
        { label: 'setTimeout', add: 'timeout callback' },
        { label: 'setInterval', add: 'interval callback' },
        { label: 'Execute', remove: true },
      ]
    },
    'microtask': {
      title: 'Microtask Queue',
      desc: 'Promises, queueMicrotask - Higher priority',
      color: 'green' as const,
      actions: [
        { label: 'Promise.resolve', add: 'promise callback' },
        { label: 'queueMicrotask', add: 'microtask' },
        { label: 'Execute All', remove: true },
      ]
    }
  }

  const current = content[mode]

  const handleAction = (action: { add?: string; remove?: boolean }) => {
    if (action.add) {
      setItems(prev => [...prev, action.add as string])
    } else if (action.remove && items.length > 0) {
      setItems(prev => prev.slice(0, -1))
    }
  }

  const getBgColor = () => {
    switch (current.color) {
      case 'blue': return 'bg-blue-500/20 text-blue-300'
      case 'yellow': return 'bg-yellow-500/20 text-yellow-300'
      case 'green': return 'bg-green-500/20 text-green-300'
      default: return 'bg-blue-500/20 text-blue-300'
    }
  }

  const getBorderColor = () => {
    switch (current.color) {
      case 'blue': return 'border-blue-500/30 bg-blue-500/5'
      case 'yellow': return 'border-yellow-500/30 bg-yellow-500/5'
      case 'green': return 'border-green-500/30 bg-green-500/5'
      default: return 'border-blue-500/30 bg-blue-500/5'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold text-white">{current.title}</h3>
      <p className="text-center text-gray-400">{current.desc}</p>
      
      {/* Visual Display */}
      <div className="flex justify-center">
        <div className={`flex flex-col-reverse gap-2 p-4 rounded-lg border min-h-[200px] min-w-[200px] ${getBorderColor()}`}>
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={`${item}-${i}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`px-4 py-2 rounded font-mono text-sm text-center ${getBgColor()}`}
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              {mode === 'call-stack' ? 'Stack empty' : 'Queue empty'}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        {current.actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              action.remove 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setItems([])}
        className="mx-auto px-4 py-2 rounded-lg bg-white-5 text-gray-400 hover:bg-white-10 transition-colors text-sm"
      >
        Clear
      </button>
    </div>
  )
}
