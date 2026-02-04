'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Play, Pause } from 'lucide-react'
import { StepControls, useAutoPlay } from '@/components/SharedViz'

interface Step {
  description: string
  codeLine: number
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  currentPhase: 'idle' | 'task' | 'microtasks' | 'render' | 'idle-callbacks'
  loopIteration: number
  output: string[]
  phaseDetail: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string; message: string }> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-emerald-500)',
    message: 'JavaScript is single-threaded - one task at a time'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-amber-500)',
    message: 'Microtasks have priority - they ALL run before any macrotask'
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-red-500)',
    message: 'Render step ensures smooth animations between tasks'
  }
}

const phaseColors: Record<Step['currentPhase'], { bg: string; border: string; text: string; glow: string }> = {
  idle: { bg: 'rgba(107,114,128,0.2)', border: '#6b7280', text: '#9ca3af', glow: 'rgba(107,114,128,0.4)' },
  task: { bg: 'rgba(245,158,11,0.2)', border: 'var(--color-amber-500)', text: '#fbbf24', glow: 'rgba(245,158,11,0.5)' },
  microtasks: { bg: 'rgba(168,85,247,0.2)', border: 'var(--color-purple-500)', text: '#c084fc', glow: 'rgba(168,85,247,0.5)' },
  render: { bg: 'rgba(6,182,212,0.2)', border: '#06b6d4', text: '#22d3ee', glow: 'rgba(6,182,212,0.5)' },
  'idle-callbacks': { bg: 'rgba(107,114,128,0.15)', border: '#4b5563', text: '#9ca3af', glow: 'rgba(107,114,128,0.3)' }
}

const phaseLabels: Record<Step['currentPhase'], string> = {
  idle: 'Idle',
  task: 'Task',
  microtasks: 'Microtasks',
  render: 'Render',
  'idle-callbacks': 'Idle Callbacks'
}

const beginnerExamples: Example[] = [
  {
    id: 'simple-task',
    title: 'One Task at a Time',
    code: [
      "console.log('start');",
      '',
      'setTimeout(() => {',
      "  console.log('task 1');",
      '}, 0);',
      '',
      'setTimeout(() => {',
      "  console.log('task 2');",
      '}, 0);',
      '',
      "console.log('end');",
    ],
    steps: [
      {
        description: 'Script starts - this is the first task on the call stack',
        codeLine: 0,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Running synchronous code'
      },
      {
        description: 'console.log runs - JavaScript executes one line at a time',
        codeLine: 0,
        callStack: ['<script>', 'console.log'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Sync execution'
      },
      {
        description: 'setTimeout schedules a task for later - adds to task queue',
        codeLine: 2,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['task 1 cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Scheduling task'
      },
      {
        description: 'Second setTimeout also schedules for later',
        codeLine: 6,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['task 1 cb', 'task 2 cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Scheduling task'
      },
      {
        description: 'Last console.log runs',
        codeLine: 10,
        callStack: ['<script>', 'console.log'],
        microQueue: [],
        macroQueue: ['task 1 cb', 'task 2 cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start', 'end'],
        phaseDetail: 'Sync execution'
      },
      {
        description: 'Script done - call stack empty. Event loop checks for work.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['task 1 cb', 'task 2 cb'],
        currentPhase: 'idle',
        loopIteration: 1,
        output: ['start', 'end'],
        phaseDetail: 'Check queues'
      },
      {
        description: 'Loop iteration 2: Pick ONE task from queue and run it',
        codeLine: 3,
        callStack: ['task 1 cb'],
        microQueue: [],
        macroQueue: ['task 2 cb'],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['start', 'end', 'task 1'],
        phaseDetail: 'Run one task'
      },
      {
        description: 'Task 1 done. Check queues again.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['task 2 cb'],
        currentPhase: 'idle',
        loopIteration: 2,
        output: ['start', 'end', 'task 1'],
        phaseDetail: 'Check queues'
      },
      {
        description: 'Loop iteration 3: Pick next task',
        codeLine: 7,
        callStack: ['task 2 cb'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 3,
        output: ['start', 'end', 'task 1', 'task 2'],
        phaseDetail: 'Run one task'
      },
      {
        description: 'All done! Event loop waits for new work.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'idle',
        loopIteration: 3,
        output: ['start', 'end', 'task 1', 'task 2'],
        phaseDetail: 'Waiting'
      }
    ],
    insight: 'The event loop runs ONE task per iteration, then checks for more work. JavaScript never runs two things at once!'
  }
]

const intermediateExamples: Example[] = [
  {
    id: 'micro-priority',
    title: 'Microtask Priority',
    code: [
      "console.log('start');",
      '',
      'setTimeout(() => {',
      "  console.log('macro');",
      '}, 0);',
      '',
      'Promise.resolve().then(() => {',
      "  console.log('micro 1');",
      '});',
      '',
      'Promise.resolve().then(() => {',
      "  console.log('micro 2');",
      '});',
      '',
      "console.log('end');",
    ],
    steps: [
      {
        description: 'Script task begins',
        codeLine: 0,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Running script'
      },
      {
        description: 'setTimeout adds callback to macro queue',
        codeLine: 2,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['macro cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Scheduling macro'
      },
      {
        description: 'First Promise.then adds to microtask queue',
        codeLine: 6,
        callStack: ['<script>'],
        microQueue: ['micro 1'],
        macroQueue: ['macro cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Scheduling micro'
      },
      {
        description: 'Second Promise.then also adds to microtask queue',
        codeLine: 10,
        callStack: ['<script>'],
        microQueue: ['micro 1', 'micro 2'],
        macroQueue: ['macro cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start'],
        phaseDetail: 'Scheduling micro'
      },
      {
        description: 'Script finishes with console.log',
        codeLine: 14,
        callStack: ['<script>'],
        microQueue: ['micro 1', 'micro 2'],
        macroQueue: ['macro cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['start', 'end'],
        phaseDetail: 'Script ending'
      },
      {
        description: 'Task done! Now drain ALL microtasks before next task',
        codeLine: -1,
        callStack: [],
        microQueue: ['micro 1', 'micro 2'],
        macroQueue: ['macro cb'],
        currentPhase: 'microtasks',
        loopIteration: 1,
        output: ['start', 'end'],
        phaseDetail: 'Draining microtasks'
      },
      {
        description: 'Run micro 1 - queue not empty, keep going!',
        codeLine: 7,
        callStack: ['micro 1'],
        microQueue: ['micro 2'],
        macroQueue: ['macro cb'],
        currentPhase: 'microtasks',
        loopIteration: 1,
        output: ['start', 'end', 'micro 1'],
        phaseDetail: 'Processing micro'
      },
      {
        description: 'Run micro 2 - now queue is empty',
        codeLine: 11,
        callStack: ['micro 2'],
        microQueue: [],
        macroQueue: ['macro cb'],
        currentPhase: 'microtasks',
        loopIteration: 1,
        output: ['start', 'end', 'micro 1', 'micro 2'],
        phaseDetail: 'Processing micro'
      },
      {
        description: 'Microtask queue empty. NOW we can run next macrotask.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['macro cb'],
        currentPhase: 'idle',
        loopIteration: 1,
        output: ['start', 'end', 'micro 1', 'micro 2'],
        phaseDetail: 'Check macro queue'
      },
      {
        description: 'Loop iteration 2: Run the waiting macrotask',
        codeLine: 3,
        callStack: ['macro cb'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['start', 'end', 'micro 1', 'micro 2', 'macro'],
        phaseDetail: 'Running task'
      },
      {
        description: 'All done!',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'idle',
        loopIteration: 2,
        output: ['start', 'end', 'micro 1', 'micro 2', 'macro'],
        phaseDetail: 'Complete'
      }
    ],
    insight: 'ALL microtasks run before the next macrotask. This is why Promise.then() always beats setTimeout(fn, 0)!'
  },
  {
    id: 'micro-in-macro',
    title: 'Microtask in Macrotask',
    code: [
      'setTimeout(() => {',
      "  console.log('macro');",
      '  Promise.resolve().then(() => {',
      "    console.log('micro in macro');",
      '  });',
      '}, 0);',
      '',
      "console.log('sync');",
    ],
    steps: [
      {
        description: 'Script starts',
        codeLine: 7,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Script starting'
      },
      {
        description: 'setTimeout schedules callback',
        codeLine: 0,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Schedule macro'
      },
      {
        description: 'Sync log runs',
        codeLine: 7,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['sync'],
        phaseDetail: 'Sync execution'
      },
      {
        description: 'Script done. Check microtasks - empty. Check macros.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'idle',
        loopIteration: 1,
        output: ['sync'],
        phaseDetail: 'Check queues'
      },
      {
        description: 'Loop iteration 2: Run timeout callback',
        codeLine: 1,
        callStack: ['timeout cb'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['sync', 'macro'],
        phaseDetail: 'Running macro'
      },
      {
        description: 'Inside macro: Promise.then adds NEW microtask!',
        codeLine: 2,
        callStack: ['timeout cb'],
        microQueue: ['nested micro'],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['sync', 'macro'],
        phaseDetail: 'Scheduling micro'
      },
      {
        description: 'Macro done. Drain microtasks created DURING this macro.',
        codeLine: -1,
        callStack: [],
        microQueue: ['nested micro'],
        macroQueue: [],
        currentPhase: 'microtasks',
        loopIteration: 2,
        output: ['sync', 'macro'],
        phaseDetail: 'Draining micros'
      },
      {
        description: 'Run the nested microtask',
        codeLine: 3,
        callStack: ['nested micro'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'microtasks',
        loopIteration: 2,
        output: ['sync', 'macro', 'micro in macro'],
        phaseDetail: 'Processing micro'
      },
      {
        description: 'All done!',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'idle',
        loopIteration: 2,
        output: ['sync', 'macro', 'micro in macro'],
        phaseDetail: 'Complete'
      }
    ],
    insight: 'Each macrotask gets its own microtask checkpoint. Micros created during a macro run before the NEXT macro!'
  }
]

const advancedExamples: Example[] = [
  {
    id: 'full-tick',
    title: 'Full Tick Cycle',
    code: [
      "console.log('task');",
      '',
      'Promise.resolve().then(() => {',
      "  console.log('micro');",
      '});',
      '',
      'requestAnimationFrame(() => {',
      "  console.log('render');",
      '});',
      '',
      'setTimeout(() => {',
      "  console.log('next task');",
      '}, 0);',
    ],
    steps: [
      {
        description: 'Script task begins',
        codeLine: 0,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['task'],
        phaseDetail: 'Running script'
      },
      {
        description: 'Promise schedules microtask',
        codeLine: 2,
        callStack: ['<script>'],
        microQueue: ['micro cb'],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['task'],
        phaseDetail: 'Schedule micro'
      },
      {
        description: 'rAF schedules render callback',
        codeLine: 6,
        callStack: ['<script>'],
        microQueue: ['micro cb'],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['task'],
        phaseDetail: 'Schedule render'
      },
      {
        description: 'setTimeout schedules next task',
        codeLine: 10,
        callStack: ['<script>'],
        microQueue: ['micro cb'],
        macroQueue: ['timeout cb'],
        currentPhase: 'task',
        loopIteration: 1,
        output: ['task'],
        phaseDetail: 'Schedule task'
      },
      {
        description: 'Task done. FIRST: Drain microtask queue',
        codeLine: -1,
        callStack: [],
        microQueue: ['micro cb'],
        macroQueue: ['timeout cb'],
        currentPhase: 'microtasks',
        loopIteration: 1,
        output: ['task'],
        phaseDetail: 'Draining micros'
      },
      {
        description: 'Run microtask',
        codeLine: 3,
        callStack: ['micro cb'],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'microtasks',
        loopIteration: 1,
        output: ['task', 'micro'],
        phaseDetail: 'Processing micro'
      },
      {
        description: 'Micros done. SECOND: Render step (rAF callbacks)',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'render',
        loopIteration: 1,
        output: ['task', 'micro'],
        phaseDetail: 'Render phase'
      },
      {
        description: 'Run rAF callback - this is when DOM updates paint',
        codeLine: 7,
        callStack: ['rAF cb'],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'render',
        loopIteration: 1,
        output: ['task', 'micro', 'render'],
        phaseDetail: 'Animation frame'
      },
      {
        description: 'Render done. Check for idle time...',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout cb'],
        currentPhase: 'idle-callbacks',
        loopIteration: 1,
        output: ['task', 'micro', 'render'],
        phaseDetail: 'Idle check'
      },
      {
        description: 'Loop iteration 2: Next macrotask',
        codeLine: 11,
        callStack: ['timeout cb'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['task', 'micro', 'render', 'next task'],
        phaseDetail: 'Running task'
      },
      {
        description: 'All done!',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'idle',
        loopIteration: 2,
        output: ['task', 'micro', 'render', 'next task'],
        phaseDetail: 'Complete'
      }
    ],
    insight: 'Full cycle: Task -> Microtasks (all) -> Render (rAF + paint) -> Idle callbacks -> Next Task'
  },
  {
    id: 'raf-timing',
    title: 'requestAnimationFrame Timing',
    code: [
      'setTimeout(() => {',
      "  console.log('timeout 1');",
      '}, 0);',
      '',
      'requestAnimationFrame(() => {',
      "  console.log('rAF');",
      '});',
      '',
      'setTimeout(() => {',
      "  console.log('timeout 2');",
      '}, 0);',
    ],
    steps: [
      {
        description: 'Script runs, schedules first timeout',
        codeLine: 0,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['timeout 1'],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Schedule macro'
      },
      {
        description: 'rAF scheduled for next render',
        codeLine: 4,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['timeout 1'],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Schedule render'
      },
      {
        description: 'Second timeout scheduled',
        codeLine: 8,
        callStack: ['<script>'],
        microQueue: [],
        macroQueue: ['timeout 1', 'timeout 2'],
        currentPhase: 'task',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Schedule macro'
      },
      {
        description: 'Script done. Check micros (empty). Go to render.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout 1', 'timeout 2'],
        currentPhase: 'render',
        loopIteration: 1,
        output: [],
        phaseDetail: 'Render phase'
      },
      {
        description: 'Run rAF before any timeouts!',
        codeLine: 5,
        callStack: ['rAF cb'],
        microQueue: [],
        macroQueue: ['timeout 1', 'timeout 2'],
        currentPhase: 'render',
        loopIteration: 1,
        output: ['rAF'],
        phaseDetail: 'Animation frame'
      },
      {
        description: 'Render complete. Now check macro queue.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout 1', 'timeout 2'],
        currentPhase: 'idle',
        loopIteration: 1,
        output: ['rAF'],
        phaseDetail: 'Check tasks'
      },
      {
        description: 'Loop iteration 2: Run timeout 1',
        codeLine: 1,
        callStack: ['timeout 1'],
        microQueue: [],
        macroQueue: ['timeout 2'],
        currentPhase: 'task',
        loopIteration: 2,
        output: ['rAF', 'timeout 1'],
        phaseDetail: 'Running task'
      },
      {
        description: 'Task done. Check render (no new rAF).',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: ['timeout 2'],
        currentPhase: 'idle',
        loopIteration: 2,
        output: ['rAF', 'timeout 1'],
        phaseDetail: 'Check queues'
      },
      {
        description: 'Loop iteration 3: Run timeout 2',
        codeLine: 9,
        callStack: ['timeout 2'],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'task',
        loopIteration: 3,
        output: ['rAF', 'timeout 1', 'timeout 2'],
        phaseDetail: 'Running task'
      },
      {
        description: 'All done!',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: [],
        currentPhase: 'idle',
        loopIteration: 3,
        output: ['rAF', 'timeout 1', 'timeout 2'],
        phaseDetail: 'Complete'
      }
    ],
    insight: 'rAF runs during render phase, which happens AFTER the current task ends but BEFORE the next macrotask!'
  }
]

const examples: Record<Level, Example[]> = {
  beginner: beginnerExamples,
  intermediate: intermediateExamples,
  advanced: advancedExamples
}

function getVisiblePhases(level: Level): Step['currentPhase'][] {
  switch (level) {
    case 'beginner':
      return ['idle', 'task']
    case 'intermediate':
      return ['idle', 'task', 'microtasks']
    case 'advanced':
      return ['task', 'microtasks', 'render', 'idle-callbacks']
  }
}

function CircularDiagram({
  currentPhase,
  level,
  loopIteration
}: {
  currentPhase: Step['currentPhase']
  level: Level
  loopIteration: number
}) {
  const phases = getVisiblePhases(level)
  const totalPhases = phases.length
  const anglePerPhase = 360 / totalPhases
  const radius = 70
  const strokeWidth = 16
  const center = 100

  const getPhaseArc = (index: number) => {
    const startAngle = (index * anglePerPhase - 90) * (Math.PI / 180)
    const endAngle = ((index + 1) * anglePerPhase - 90) * (Math.PI / 180)
    const gap = 0.05

    const x1 = center + radius * Math.cos(startAngle + gap)
    const y1 = center + radius * Math.sin(startAngle + gap)
    const x2 = center + radius * Math.cos(endAngle - gap)
    const y2 = center + radius * Math.sin(endAngle - gap)

    const largeArcFlag = anglePerPhase > 180 ? 1 : 0

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }

  const getLabelPosition = (index: number) => {
    const midAngle = ((index + 0.5) * anglePerPhase - 90) * (Math.PI / 180)
    const labelRadius = radius + 30
    return {
      x: center + labelRadius * Math.cos(midAngle),
      y: center + labelRadius * Math.sin(midAngle)
    }
  }

  const currentPhaseIndex = phases.indexOf(currentPhase)
  const indicatorAngle = currentPhaseIndex >= 0
    ? ((currentPhaseIndex + 0.5) * anglePerPhase - 90) * (Math.PI / 180)
    : -90 * (Math.PI / 180)
  const indicatorX = center + (radius - strokeWidth / 2 - 5) * Math.cos(indicatorAngle)
  const indicatorY = center + (radius - strokeWidth / 2 - 5) * Math.sin(indicatorAngle)

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
        {phases.map((phase, index) => {
          const isActive = phase === currentPhase
          const colors = phaseColors[phase]

          return (
            <g key={phase}>
              <motion.path
                d={getPhaseArc(index)}
                fill="none"
                stroke={colors.border}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  filter: isActive ? `drop-shadow(0 0 8px ${colors.glow})` : 'none'
                }}
                transition={{ duration: 0.3 }}
              />
              <text
                x={getLabelPosition(index).x}
                y={getLabelPosition(index).y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-current"
                style={{ fill: isActive ? colors.text : 'var(--color-gray-500-tw)' }}
              >
                {phaseLabels[phase]}
              </text>
            </g>
          )
        })}

        <motion.circle
          cx={indicatorX}
          cy={indicatorY}
          r={6}
          fill="#fff"
          initial={false}
          animate={{
            cx: indicatorX,
            cy: indicatorY,
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))'
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />

        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          className="text-xs fill-gray-500"
        >
          Loop
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="text-2xl font-bold fill-white"
        >
          {loopIteration}
        </text>
      </svg>
    </div>
  )
}

export function EventLoopTickViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  const { isPlaying, toggle } = useAutoPlay(
    currentExample.steps.length,
    stepIndex,
    setStepIndex
  )

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => {
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-5 text-[var(--js-viz-text)]">
      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all cursor-pointer
              ${level === lvl
                ? 'border-2 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : undefined,
              background: level === lvl ? `${levelInfo[lvl].color}20` : undefined
            }}
            onClick={() => handleLevelChange(lvl)}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: levelInfo[lvl].color }}
            />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-400 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
        {levelInfo[level].message}
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer
              ${exampleIndex === i
                ? 'bg-[var(--color-brand-primary-20)] border border-[var(--color-brand-primary-50)] text-[var(--color-brand-light)]'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-[var(--color-bg-page-secondary)] rounded-xl border border-white/10">
          <CircularDiagram
            currentPhase={currentStep.currentPhase}
            level={level}
            loopIteration={currentStep.loopIteration}
          />
          <div className="mt-3 text-center">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: phaseColors[currentStep.currentPhase].bg,
                color: phaseColors[currentStep.currentPhase].text,
                border: `1px solid ${phaseColors[currentStep.currentPhase].border}`
              }}
            >
              {currentStep.currentPhase === 'idle' && currentStep.callStack.length === 0 ? (
                <Pause size={14} />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={14} />
                </motion.div>
              )}
              {currentStep.phaseDetail}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3 bg-[var(--color-bg-page-secondary)] rounded-lg border border-white/10">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Call Stack</div>
            <div className="min-h-[80px] flex flex-col-reverse gap-1">
              <AnimatePresence mode="popLayout">
                {currentStep.callStack.length === 0 ? (
                  <div className="text-gray-700 text-sm text-center py-4">(empty)</div>
                ) : (
                  currentStep.callStack.map((item, i) => (
                    <motion.div
                      key={`${item}-${i}`}
                      className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 font-mono text-xs text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      layout
                    >
                      {item}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[var(--color-bg-page-secondary)] rounded-lg border border-white/10">
              <div className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">Microtasks</div>
              <div className="min-h-[60px] flex flex-col gap-1">
                <AnimatePresence mode="popLayout">
                  {currentStep.microQueue.length === 0 ? (
                    <div className="text-gray-700 text-xs text-center py-2">(empty)</div>
                  ) : (
                    currentStep.microQueue.map((item, i) => (
                      <motion.div
                        key={`${item}-${i}`}
                        className="px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 font-mono text-2xs text-center"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        layout
                      >
                        {item}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-3 bg-[var(--color-bg-page-secondary)] rounded-lg border border-white/10">
              <div className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">Task Queue</div>
              <div className="min-h-[60px] flex flex-col gap-1">
                <AnimatePresence mode="popLayout">
                  {currentStep.macroQueue.length === 0 ? (
                    <div className="text-gray-700 text-xs text-center py-2">(empty)</div>
                  ) : (
                    currentStep.macroQueue.map((item, i) => (
                      <motion.div
                        key={`${item}-${i}`}
                        className="px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 font-mono text-2xs text-center"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        layout
                      >
                        {item}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-page-secondary)] border border-white/10 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-3 py-2 bg-white/5">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Code</span>
          <span className="text-xs text-gray-500">Line {currentStep.codeLine >= 0 ? currentStep.codeLine + 1 : '-'}</span>
        </div>
        <pre className="m-0 py-2 max-h-32 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              className={`flex px-2 py-0.5 transition-colors ${
                currentStep.codeLine === i ? 'bg-[var(--color-brand-primary-20)]' : ''
              }`}
            >
              <span className="w-6 text-gray-700 font-mono text-xs text-right select-none mr-2">{i + 1}</span>
              <span className={`font-mono text-xs ${
                currentStep.codeLine === i ? 'text-[var(--color-brand-light)]' : 'text-gray-400'
              }`}>
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 p-3 bg-[var(--color-bg-page-secondary)] rounded-lg border border-white/10">
          <div className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wider">Output</div>
          <div className="font-mono text-sm text-green-300 min-h-[24px]">
            {currentStep.output.length === 0 ? (
              <span className="text-gray-700">-</span>
            ) : (
              currentStep.output.join(', ')
            )}
          </div>
        </div>

        <div className="flex-1 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Step {stepIndex + 1}/{currentExample.steps.length}
          </div>
          <div className="text-sm text-gray-300">{currentStep.description}</div>
        </div>
      </div>

      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        isPlaying={isPlaying}
        onPlayPause={toggle}
        showPlayPause={true}
      />

      <div className="px-4 py-3 bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-30)] rounded-lg text-sm text-gray-400">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
