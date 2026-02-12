import { motion } from 'framer-motion'
import type { ConceptStep, ConceptType, LinkedListNodeState } from '@/types'

interface LinkedListConceptProps {
  step: ConceptStep
  type: ConceptType
}

const POINTER_COLORS: Record<string, { bg: string; border: string }> = {
  prev: { bg: 'bg-[var(--color-accent-purple)]', border: 'border-t-[var(--color-accent-purple)]' },
  curr: { bg: 'bg-[var(--color-accent-blue)]', border: 'border-t-[var(--color-accent-blue)]' },
  next: { bg: 'bg-[var(--color-accent-cyan)]', border: 'border-t-[var(--color-accent-cyan)]' },
  slow: { bg: 'bg-[var(--color-accent-green)]', border: 'border-t-[var(--color-accent-green)]' },
  fast: { bg: 'bg-[var(--color-accent-orange)]', border: 'border-t-[var(--color-accent-orange)]' },
  p1: { bg: 'bg-[var(--color-accent-blue)]', border: 'border-t-[var(--color-accent-blue)]' },
  p2: { bg: 'bg-[var(--color-accent-purple)]', border: 'border-t-[var(--color-accent-purple)]' },
  head: { bg: 'bg-[var(--color-accent-green)]', border: 'border-t-[var(--color-accent-green)]' },
  tail: { bg: 'bg-[var(--color-accent-orange)]', border: 'border-t-[var(--color-accent-orange)]' },
  dummy: { bg: 'bg-gray-500', border: 'border-t-gray-500' },
  carry: { bg: 'bg-[var(--color-accent-orange)]', border: 'border-t-[var(--color-accent-orange)]' },
  mid: { bg: 'bg-[var(--color-accent-cyan)]', border: 'border-t-[var(--color-accent-cyan)]' },
}

const DEFAULT_POINTER_COLOR = { bg: 'bg-gray-500', border: 'border-t-gray-500' }

function getPointerStyle(name: string): { bg: string; border: string } {
  return POINTER_COLORS[name] ?? DEFAULT_POINTER_COLOR
}

function NodeChain({
  nodes,
  pointers,
  highlightNodes,
  highlightEdges,
  cycleTarget,
  label,
}: {
  nodes: LinkedListNodeState[]
  pointers?: Record<string, string>
  highlightNodes?: string[]
  highlightEdges?: [string, string][]
  cycleTarget?: string
  label?: string
}): React.JSX.Element {
  const ptrs = pointers ?? {}
  const hlNodes = highlightNodes ?? []
  const hlEdges = highlightEdges ?? []

  const isEdgeHighlighted = (fromId: string, toId: string): boolean =>
    hlEdges.some(([f, t]) => f === fromId && t === toId)

  const getPointersForNode = (nodeId: string): string[] => {
    return Object.entries(ptrs)
      .filter(([, id]) => id === nodeId)
      .map(([name]) => name)
  }

  return (
    <div className="flex flex-col items-start gap-0.5 w-full">
      {label && (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
          {label}
        </span>
      )}
      <div className="flex items-center gap-0 flex-wrap">
        {nodes.map((node, i) => {
          const isHighlighted = hlNodes.includes(node.id)
          const ptrNames = getPointersForNode(node.id)
          const nextNode = nodes[i + 1]
          const edgeHl = nextNode ? isEdgeHighlighted(node.id, nextNode.id) : false
          const isCycleSource = i === nodes.length - 1 && cycleTarget

          return (
            <div key={node.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Pointer labels */}
                <div className="h-5 flex flex-row items-end justify-center gap-0.5 mb-0.5">
                  {ptrNames.map((name) => {
                    const style = getPointerStyle(name)
                    return (
                      <motion.div
                        key={name}
                        className={`relative text-[8px] font-semibold font-mono text-white px-1 py-px rounded-sm whitespace-nowrap shadow-[0_0_6px_rgba(255,255,255,0.15)] ${style.bg}`}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {name}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${style.border}`} />
                      </motion.div>
                    )
                  })}
                </div>

                {/* Node box */}
                <motion.div
                  className={`
                    flex items-center justify-center min-w-8 h-8 px-1.5 rounded-md
                    ${isHighlighted
                      ? 'bg-emerald-400/25 border-2 border-emerald-400'
                      : 'bg-[var(--color-bg-elevated)] border-2 border-white/15'
                    }
                  `}
                  animate={{
                    scale: isHighlighted ? 1.08 : 1,
                    boxShadow: isHighlighted
                      ? '0 0 12px rgba(52, 211, 153, 0.5)'
                      : '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="text-[13px] font-semibold font-mono text-white">
                    {node.value}
                  </span>
                </motion.div>
              </div>

              {/* Arrow to next node */}
              {node.next !== null && nextNode && (
                <div className="flex items-center mx-0.5 mt-5">
                  <motion.div
                    className={`h-0.5 w-4 ${edgeHl ? 'bg-emerald-400' : 'bg-white/25'}`}
                    animate={{
                      backgroundColor: edgeHl ? 'rgba(52, 211, 153, 0.9)' : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: edgeHl ? '0 0 6px rgba(52, 211, 153, 0.5)' : 'none',
                    }}
                  />
                  <motion.div
                    className={`w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent ${edgeHl ? 'border-l-emerald-400' : 'border-l-white/25'}`}
                  />
                </div>
              )}

              {/* Null terminator */}
              {node.next === null && !isCycleSource && (
                <div className="flex items-center mx-0.5 mt-5">
                  <div className="h-0.5 w-3 bg-white/15" />
                  <span className="text-[9px] font-mono text-gray-600 ml-0.5">null</span>
                </div>
              )}

              {/* Cycle back-edge indicator */}
              {isCycleSource && (
                <div className="flex items-center mx-0.5 mt-5">
                  <div className="h-0.5 w-3 bg-red-400/60" />
                  <motion.span
                    className="text-[9px] font-mono text-red-400 ml-0.5"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ↩ cycle
                  </motion.span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LinkedListConcept({ step }: LinkedListConceptProps) {
  const { visual } = step
  const ll = visual.linkedList

  if (!ll) {
    return (
      <div className="text-sm text-gray-500 text-center">
        No linked list data for this step.
      </div>
    )
  }

  const annotations = ll.annotations ?? visual.annotations ?? []

  return (
    <div className="flex flex-col items-center gap-2 w-full text-white">
      {/* Annotations */}
      {annotations.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {annotations.map((text, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-[var(--color-brand-light)] px-2.5 py-[3px] bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-25)] rounded-full"
            >
              {text}
            </span>
          ))}
        </div>
      )}

      {/* Primary list */}
      <NodeChain
        nodes={ll.nodes}
        pointers={ll.pointers}
        highlightNodes={ll.highlightNodes}
        highlightEdges={ll.highlightEdges}
        cycleTarget={ll.cycleTarget}
      />

      {/* Second list (merge problems) */}
      {ll.secondList && ll.secondList.length > 0 && (
        <NodeChain
          nodes={ll.secondList}
          pointers={ll.pointers}
          highlightNodes={ll.highlightNodes}
          highlightEdges={ll.highlightEdges}
          label="List 2"
        />
      )}

      {/* Detached nodes (construction) */}
      {ll.detachedNodes && ll.detachedNodes.length > 0 && (
        <div className="flex flex-col items-start gap-0.5 w-full">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
            New nodes
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {ll.detachedNodes.map((node) => {
              const isHl = ll.highlightNodes?.includes(node.id) ?? false
              return (
                <motion.div
                  key={node.id}
                  className={`
                    flex items-center justify-center min-w-8 h-8 px-1.5 rounded-md
                    ${isHl
                      ? 'bg-amber-400/20 border-2 border-amber-400/60'
                      : 'bg-[var(--color-bg-elevated)] border-2 border-dashed border-white/15'
                    }
                  `}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="text-[13px] font-semibold font-mono text-white">
                    {node.value}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Result */}
      {visual.result !== undefined && (
        <motion.div
          className="text-base font-medium text-gray-400 mt-2 px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded-md shadow-[0_0_8px_rgba(16,185,129,0.2)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Result: <span className="font-mono font-semibold text-emerald-400">{String(visual.result)}</span>
        </motion.div>
      )}
    </div>
  )
}
