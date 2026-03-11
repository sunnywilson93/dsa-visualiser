'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

type PatternCategory = 'creational' | 'structural' | 'behavioral'

interface PatternStep {
  label: string
  desc: string
  boxes: BoxNode[]
  arrows: Arrow[]
}

interface BoxNode {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  color: 'primary' | 'accent' | 'muted' | 'success' | 'warning'
}

interface Arrow {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

const colorMap: Record<BoxNode['color'], { bg: string; border: string; text: string }> = {
  primary: {
    bg: 'var(--color-neon-viz-18)',
    border: 'var(--color-neon-viz-70)',
    text: 'var(--color-text-bright)',
  },
  accent: {
    bg: 'var(--color-accent-primary-10)',
    border: 'var(--color-accent-blue)',
    text: 'var(--color-accent-blue)',
  },
  muted: {
    bg: 'var(--color-white-5)',
    border: 'var(--color-white-15)',
    text: 'var(--color-text-muted)',
  },
  success: {
    bg: 'rgba(52, 211, 153, 0.1)',
    border: 'var(--color-accent-green)',
    text: 'var(--color-accent-green)',
  },
  warning: {
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'var(--color-accent-yellow)',
    text: 'var(--color-accent-yellow)',
  },
}

const patterns: Record<PatternCategory, { title: string; steps: PatternStep[] }> = {
  creational: {
    title: 'Creational Patterns',
    steps: [
      {
        label: 'Module',
        desc: 'IIFE creates private scope, returns public API via closure',
        boxes: [
          { id: 'iife', label: 'IIFE Scope', x: 20, y: 10, w: 160, h: 50, color: 'muted' },
          { id: 'private', label: 'private vars', x: 40, y: 70, w: 120, h: 36, color: 'warning' },
          { id: 'api', label: 'Public API', x: 220, y: 30, w: 130, h: 50, color: 'primary' },
          { id: 'caller', label: 'Consumer', x: 400, y: 30, w: 110, h: 50, color: 'accent' },
        ],
        arrows: [
          { from: 'iife', to: 'api', label: 'returns' },
          { from: 'api', to: 'private', label: 'closes over', dashed: true },
          { from: 'caller', to: 'api', label: 'calls' },
        ],
      },
      {
        label: 'Singleton',
        desc: 'Ensures a single instance with a global access point',
        boxes: [
          { id: 'instance', label: 'Instance', x: 200, y: 10, w: 130, h: 50, color: 'primary' },
          { id: 'a', label: 'Client A', x: 40, y: 90, w: 110, h: 40, color: 'accent' },
          { id: 'b', label: 'Client B', x: 210, y: 90, w: 110, h: 40, color: 'accent' },
          { id: 'c', label: 'Client C', x: 380, y: 90, w: 110, h: 40, color: 'accent' },
        ],
        arrows: [
          { from: 'a', to: 'instance', label: 'getInstance()' },
          { from: 'b', to: 'instance' },
          { from: 'c', to: 'instance' },
        ],
      },
      {
        label: 'Factory',
        desc: 'Factory function delegates creation based on type parameter',
        boxes: [
          { id: 'caller', label: 'Caller', x: 20, y: 40, w: 110, h: 45, color: 'accent' },
          { id: 'factory', label: 'Factory', x: 180, y: 40, w: 120, h: 45, color: 'primary' },
          { id: 'prodA', label: 'Product A', x: 360, y: 10, w: 120, h: 36, color: 'success' },
          { id: 'prodB', label: 'Product B', x: 360, y: 55, w: 120, h: 36, color: 'warning' },
          { id: 'prodC', label: 'Product C', x: 360, y: 100, w: 120, h: 36, color: 'muted' },
        ],
        arrows: [
          { from: 'caller', to: 'factory', label: 'create(type)' },
          { from: 'factory', to: 'prodA' },
          { from: 'factory', to: 'prodB' },
          { from: 'factory', to: 'prodC' },
        ],
      },
    ],
  },
  structural: {
    title: 'Structural Patterns',
    steps: [
      {
        label: 'Decorator',
        desc: 'Wraps an object/function to add behavior while preserving the interface',
        boxes: [
          { id: 'caller', label: 'Caller', x: 20, y: 35, w: 100, h: 45, color: 'accent' },
          { id: 'decA', label: 'withLogging', x: 155, y: 35, w: 120, h: 45, color: 'warning' },
          { id: 'decB', label: 'withCache', x: 310, y: 35, w: 110, h: 45, color: 'success' },
          { id: 'orig', label: 'Original fn', x: 460, y: 35, w: 110, h: 45, color: 'primary' },
        ],
        arrows: [
          { from: 'caller', to: 'decA', label: 'calls' },
          { from: 'decA', to: 'decB', label: 'wraps' },
          { from: 'decB', to: 'orig', label: 'wraps' },
        ],
      },
      {
        label: 'Proxy',
        desc: 'Intercepts operations on a target via handler traps',
        boxes: [
          { id: 'client', label: 'Client', x: 20, y: 35, w: 100, h: 50, color: 'accent' },
          { id: 'proxy', label: 'Proxy', x: 175, y: 15, w: 130, h: 50, color: 'primary' },
          { id: 'handler', label: 'Handler (traps)', x: 175, y: 80, w: 130, h: 36, color: 'warning' },
          { id: 'target', label: 'Target Object', x: 370, y: 35, w: 130, h: 50, color: 'success' },
        ],
        arrows: [
          { from: 'client', to: 'proxy', label: 'obj.prop' },
          { from: 'proxy', to: 'handler', label: 'intercepts', dashed: true },
          { from: 'proxy', to: 'target', label: 'Reflect.*' },
        ],
      },
    ],
  },
  behavioral: {
    title: 'Behavioral Patterns',
    steps: [
      {
        label: 'Observer',
        desc: 'Subject notifies all subscribed observers on state change',
        boxes: [
          { id: 'subject', label: 'Subject', x: 180, y: 10, w: 130, h: 45, color: 'primary' },
          { id: 'obsA', label: 'Observer A', x: 30, y: 85, w: 120, h: 40, color: 'accent' },
          { id: 'obsB', label: 'Observer B', x: 190, y: 85, w: 120, h: 40, color: 'success' },
          { id: 'obsC', label: 'Observer C', x: 350, y: 85, w: 120, h: 40, color: 'warning' },
        ],
        arrows: [
          { from: 'subject', to: 'obsA', label: 'notify' },
          { from: 'subject', to: 'obsB', label: 'notify' },
          { from: 'subject', to: 'obsC', label: 'notify' },
        ],
      },
      {
        label: 'Strategy',
        desc: 'Context delegates to interchangeable algorithm functions',
        boxes: [
          { id: 'context', label: 'Context', x: 20, y: 35, w: 120, h: 50, color: 'primary' },
          { id: 'stratA', label: 'Strategy A', x: 210, y: 5, w: 120, h: 36, color: 'accent' },
          { id: 'stratB', label: 'Strategy B', x: 210, y: 50, w: 120, h: 36, color: 'success' },
          { id: 'stratC', label: 'Strategy C', x: 210, y: 95, w: 120, h: 36, color: 'warning' },
          { id: 'result', label: 'Result', x: 400, y: 35, w: 100, h: 50, color: 'muted' },
        ],
        arrows: [
          { from: 'context', to: 'stratA', dashed: true },
          { from: 'context', to: 'stratB', label: 'delegates' },
          { from: 'context', to: 'stratC', dashed: true },
          { from: 'stratB', to: 'result' },
        ],
      },
      {
        label: 'Mediator',
        desc: 'Components communicate through a central hub, not directly',
        boxes: [
          { id: 'mediator', label: 'Event Bus', x: 190, y: 10, w: 130, h: 45, color: 'primary' },
          { id: 'compA', label: 'Publisher', x: 30, y: 85, w: 120, h: 40, color: 'warning' },
          { id: 'compB', label: 'Subscriber 1', x: 190, y: 85, w: 120, h: 40, color: 'accent' },
          { id: 'compC', label: 'Subscriber 2', x: 350, y: 85, w: 120, h: 40, color: 'success' },
        ],
        arrows: [
          { from: 'compA', to: 'mediator', label: 'publish' },
          { from: 'mediator', to: 'compB', label: 'notify' },
          { from: 'mediator', to: 'compC', label: 'notify' },
        ],
      },
    ],
  },
}

const categoryKeys: PatternCategory[] = ['creational', 'structural', 'behavioral']

function getBoxCenter(box: BoxNode): { cx: number; cy: number } {
  return { cx: box.x + box.w / 2, cy: box.y + box.h / 2 }
}

function renderArrow(
  arrow: Arrow,
  boxes: BoxNode[],
  idx: number,
): JSX.Element | null {
  const fromBox = boxes.find(b => b.id === arrow.from)
  const toBox = boxes.find(b => b.id === arrow.to)
  if (!fromBox || !toBox) return null

  const from = getBoxCenter(fromBox)
  const to = getBoxCenter(toBox)

  const dx = to.cx - from.cx
  const dy = to.cy - from.cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return null

  const ux = dx / dist
  const uy = dy / dist

  const startX = from.cx + ux * (fromBox.w / 2 + 2)
  const startY = from.cy + uy * (fromBox.h / 2 + 2)
  const endX = to.cx - ux * (toBox.w / 2 + 6)
  const endY = to.cy - uy * (toBox.h / 2 + 6)

  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  return (
    <g key={`arrow-${idx}`}>
      <defs>
        <marker
          id={`arrowhead-${idx}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-white-30)"
          />
        </marker>
      </defs>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="var(--color-white-20)"
        strokeWidth={1.5}
        strokeDasharray={arrow.dashed ? '5,4' : undefined}
        markerEnd={`url(#arrowhead-${idx})`}
      />
      {arrow.label && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill="var(--color-text-muted)"
          fontSize={11}
          fontFamily="inherit"
        >
          {arrow.label}
        </text>
      )}
    </g>
  )
}

export function DesignPatternsViz(): JSX.Element {
  const [category, setCategory] = useState<PatternCategory>('creational')
  const [step, setStep] = useState(0)

  const current = patterns[category]
  const s = current.steps[step]

  const switchCategory = (cat: PatternCategory): void => {
    setCategory(cat)
    setStep(0)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <h3 className="text-center text-lg font-semibold text-text-bright">{current.title}</h3>

      <div className="flex gap-[var(--spacing-sm)] justify-center bg-[var(--color-black-30)] border border-[var(--color-white-8)] rounded-full p-[0.35rem] flex-wrap">
        {categoryKeys.map(cat => (
          <button
            key={cat}
            onClick={() => switchCategory(cat)}
            className={`px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-sm font-medium rounded-full transition-all duration-150 ${
              cat === category
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--color-white-8)] text-[var(--color-gray-500)] hover:bg-[var(--color-white-8)] hover:text-[var(--color-gray-300)]'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-[var(--spacing-xs)]">
        {current.steps.map((st, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 p-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left transition-all duration-[var(--transition-fast)] ${
              i === step
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)]'
                : 'bg-[var(--color-black-30)] border border-[var(--color-white-10)] opacity-50 hover:opacity-75'
            }`}
          >
            <div className="text-xs text-[color:var(--color-text-muted)]">Step {i + 1}</div>
            <div className="text-sm font-semibold text-[color:var(--color-text-bright)]">{st.label}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-[var(--radius-xl)] bg-[var(--color-black-30)] border border-[var(--color-white-10)] p-[var(--spacing-lg)]"
        >
          <div className="text-sm text-[color:var(--color-text-muted)] mb-[var(--spacing-md)]">{s.desc}</div>

          <svg
            viewBox="0 0 540 140"
            className="w-full"
            style={{ maxHeight: 200 }}
          >
            {s.arrows.map((arrow, i) => renderArrow(arrow, s.boxes, i))}

            {s.boxes.map((box) => {
              const c = colorMap[box.color]
              return (
                <motion.g
                  key={box.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    rx={8}
                    fill={c.bg}
                    stroke={c.border}
                    strokeWidth={1.5}
                  />
                  <text
                    x={box.x + box.w / 2}
                    y={box.y + box.h / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={c.text}
                    fontSize={12}
                    fontWeight={600}
                    fontFamily="inherit"
                  >
                    {box.label}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      <StepControls
        onPrev={() => setStep(Math.max(0, step - 1))}
        onNext={() => setStep(Math.min(current.steps.length - 1, step + 1))}
        onReset={() => setStep(0)}
        canPrev={step > 0}
        canNext={step < current.steps.length - 1}
        stepInfo={{ current: step + 1, total: current.steps.length }}
      />
    </div>
  )
}
