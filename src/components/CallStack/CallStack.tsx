'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallStack, useExecutionStore } from '@/store'
import { formatValue } from '@/engine'
import type { StackFrame, RuntimeValue } from '@/types'

const FRAME_COLORS = [
  'var(--stack-frame-1)',
  'var(--stack-frame-2)',
  'var(--stack-frame-3)',
  'var(--stack-frame-4)',
  'var(--stack-frame-5)',
]

function getFrameColor(depth: number): string {
  return FRAME_COLORS[depth % FRAME_COLORS.length]
}

interface VariableDisplayProps {
  name: string
  value: RuntimeValue
  type: 'param' | 'local'
}

function VariableDisplay({ name, value, type }: VariableDisplayProps) {
  const varNameClass = type === 'param' ? 'text-accent-cyan' : 'text-accent-purple'

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <span className={`font-medium ${varNameClass}`}>{name}</span>
      <span className="text-text-muted">=</span>
      <span className="text-text-secondary">{formatValue(value, true)}</span>
    </div>
  )
}

interface StackFrameCardProps {
  frame: StackFrame
  isActive: boolean
  total: number
}

function StackFrameCard({ frame, isActive, total }: StackFrameCardProps) {
  const color = getFrameColor(frame.depth)
  const isRecursive = total > 1 && frame.depth > 0

  return (
    <motion.div
      className={`bg-bg-tertiary border border-border-primary rounded-md p-2 px-3 transition-all duration-150 ${
        isActive ? 'bg-bg-elevated shadow-[0_0_0_1px_var(--frame-color)]' : ''
      }`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ '--frame-color': color, borderLeftColor: color, borderLeftWidth: '3px' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-mono text-base font-semibold text-text-primary">{frame.name}</span>
        <span className="text-2xs text-text-muted ml-auto">#{frame.depth}</span>
        {isRecursive && (
          <span className="text-base text-accent-purple cursor-help" title="Recursive call">
            ↻
          </span>
        )}
      </div>

      {/* Parameters */}
      {Object.keys(frame.params).length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-secondary">
          <div className="text-2xs font-semibold uppercase tracking-tight text-text-muted mb-1">
            Parameters
          </div>
          <div className="flex flex-wrap gap-1 gap-x-4">
            {Object.entries(frame.params).map(([name, value]) => (
              <VariableDisplay key={name} name={name} value={value} type="param" />
            ))}
          </div>
        </div>
      )}

      {/* Local Variables */}
      {Object.keys(frame.locals).length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-secondary">
          <div className="text-2xs font-semibold uppercase tracking-tight text-text-muted mb-1">
            Locals
          </div>
          <div className="flex flex-wrap gap-1 gap-x-4">
            {Object.entries(frame.locals).map(([name, value]) => (
              <VariableDisplay key={name} name={name} value={value} type="local" />
            ))}
          </div>
        </div>
      )}

      {/* Return Value */}
      {frame.returnValue && (
        <div className="flex items-center gap-2 mt-2 py-1 px-2 bg-accent-green-15 rounded-sm font-mono text-sm">
          <span className="text-accent-green font-medium">return</span>
          <span className="text-text-primary">{formatValue(frame.returnValue)}</span>
        </div>
      )}

      {/* Call Site */}
      {frame.callSite && (
        <div className="mt-2 text-2xs text-text-muted">
          Line {frame.callSite.line}
        </div>
      )}
    </motion.div>
  )
}

export function CallStack() {
  const callStack = useCallStack()
  const status = useExecutionStore(state => state.status)

  const isEmpty = callStack.length === 0 && status === 'idle'

  // Reverse to show newest at top
  const reversedStack = [...callStack].reverse()

  // Calculate bar color
  const barColor =
    callStack.length > 15
      ? 'var(--color-accent-red)'
      : callStack.length > 8
      ? 'var(--color-accent-yellow)'
      : 'var(--color-accent-blue)'

  return (
    <div className="flex flex-col h-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between py-2 px-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-semibold uppercase tracking-tight text-text-secondary">
          Call Stack
        </span>
        <span className="text-xs font-medium py-0.5 px-2 rounded-sm bg-bg-elevated text-text-muted">
          {callStack.length} frame{callStack.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-text-muted text-base">
            <div className="text-2xl mb-2 opacity-50">⌸</div>
            <p>Run your code to see the call stack</p>
          </div>
        )}

        {status === 'completed' && callStack.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-text-muted text-base">
            <div className="text-2xl mb-2 text-accent-green">✓</div>
            <p>Execution completed</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {reversedStack.map((frame, index) => (
            <StackFrameCard
              key={frame.id}
              frame={frame}
              isActive={index === 0}
              total={reversedStack.length}
            />
          ))}
        </AnimatePresence>

        {/* Stack overflow warning */}
        {callStack.length >= 50 && (
          <motion.div
            className="p-2 px-3 bg-accent-yellow-30 border border-accent-yellow-30 rounded-md text-accent-yellow text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ Deep recursion detected ({callStack.length} frames)
          </motion.div>
        )}
      </div>

      {/* Stack visualization bar */}
      {callStack.length > 0 && (
        <div className="flex items-center gap-2 py-2 px-3 bg-bg-tertiary border-t border-border-primary">
          <div className="text-2xs font-semibold uppercase text-text-muted">Depth</div>
          <div className="flex-1 h-1 bg-bg-primary rounded-xs overflow-hidden">
            <motion.div
              className="h-full rounded-xs transition-colors duration-150"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (callStack.length / 20) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: barColor }}
            />
          </div>
          <div className="font-mono text-xs text-text-secondary min-w-[20px] text-right">
            {callStack.length}
          </div>
        </div>
      )}
    </div>
  )
}
