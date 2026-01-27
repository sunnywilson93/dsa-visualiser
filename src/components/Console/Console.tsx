'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { useExecutionStore, useVisibleConsoleOutput } from '@/store'

export function Console() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const status = useExecutionStore(state => state.status)
  // Use filtered output based on current step (progressive reveal)
  const consoleOutput = useVisibleConsoleOutput()

  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [consoleOutput])

  return (
    <div className="flex flex-col h-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-accent-green" />
          <span className="text-sm font-semibold uppercase tracking-tight text-text-secondary">
            Console
          </span>
        </div>
        {consoleOutput.length > 0 && (
          <span className="text-xs font-medium py-0.5 px-2 bg-bg-elevated rounded-sm text-text-muted">
            {consoleOutput.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-mono text-sm" ref={scrollRef}>
        {consoleOutput.length === 0 && (
          <div className="flex items-center justify-center h-full text-text-muted text-sm font-sans">
            {status === 'idle' ? (
              <p>Console output will appear here</p>
            ) : (
              <p>No console output yet</p>
            )}
          </div>
        )}

        <AnimatePresence>
          {consoleOutput.map((line, index) => (
            <motion.div
              key={index}
              className="flex gap-3 py-1 px-2 rounded-sm transition-colors duration-fast hover:bg-bg-tertiary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-text-muted min-w-[20px] text-right select-none">
                {index + 1}
              </span>
              <span className="text-text-primary break-all">{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
