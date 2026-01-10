import { motion, AnimatePresence } from 'framer-motion'
import { useCallStack, useExecutionStore } from '@/store'
import { formatValue } from '@/engine'
import type { StackFrame, RuntimeValue } from '@/types'
import styles from './CallStack.module.css'

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
  return (
    <div className={`${styles.variable} ${styles[type]}`}>
      <span className={styles.varName}>{name}</span>
      <span className={styles.varEquals}>=</span>
      <span className={styles.varValue}>{formatValue(value, true)}</span>
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
      className={`${styles.frame} ${isActive ? styles.active : ''}`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ '--frame-color': color } as React.CSSProperties}
    >
      <div className={styles.frameHeader}>
        <div className={styles.frameIndicator} />
        <span className={styles.frameName}>{frame.name}</span>
        <span className={styles.frameDepth}>#{frame.depth}</span>
        {isRecursive && (
          <span className={styles.recursiveBadge} title="Recursive call">
            ↻
          </span>
        )}
      </div>

      {/* Parameters */}
      {Object.keys(frame.params).length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Parameters</div>
          <div className={styles.variables}>
            {Object.entries(frame.params).map(([name, value]) => (
              <VariableDisplay
                key={name}
                name={name}
                value={value}
                type="param"
              />
            ))}
          </div>
        </div>
      )}

      {/* Local Variables */}
      {Object.keys(frame.locals).length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Locals</div>
          <div className={styles.variables}>
            {Object.entries(frame.locals).map(([name, value]) => (
              <VariableDisplay
                key={name}
                name={name}
                value={value}
                type="local"
              />
            ))}
          </div>
        </div>
      )}

      {/* Return Value */}
      {frame.returnValue && (
        <div className={styles.returnSection}>
          <span className={styles.returnLabel}>return</span>
          <span className={styles.returnValue}>
            {formatValue(frame.returnValue)}
          </span>
        </div>
      )}

      {/* Call Site */}
      {frame.callSite && (
        <div className={styles.callSite}>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Call Stack</span>
        <span className={styles.badge}>
          {callStack.length} frame{callStack.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.content}>
        {isEmpty && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌸</div>
            <p>Run your code to see the call stack</p>
          </div>
        )}

        {status === 'completed' && callStack.length === 0 && (
          <div className={styles.completed}>
            <div className={styles.completedIcon}>✓</div>
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
            className={styles.warning}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ Deep recursion detected ({callStack.length} frames)
          </motion.div>
        )}
      </div>

      {/* Stack visualization bar */}
      {callStack.length > 0 && (
        <div className={styles.stackBar}>
          <div className={styles.stackBarLabel}>Depth</div>
          <div className={styles.stackBarTrack}>
            <motion.div
              className={styles.stackBarFill}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (callStack.length / 20) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor:
                  callStack.length > 15
                    ? 'var(--accent-red)'
                    : callStack.length > 8
                    ? 'var(--accent-yellow)'
                    : 'var(--accent-blue)',
              }}
            />
          </div>
          <div className={styles.stackBarValue}>{callStack.length}</div>
        </div>
      )}
    </div>
  )
}
