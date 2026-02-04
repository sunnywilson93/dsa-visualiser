'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './PromisesViz.module.css'

interface ChainedPromise {
  id: string
  label: string
  state: 'pending' | 'fulfilled' | 'rejected'
  value?: string
  waitingFor?: string
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  promiseChain: ChainedPromise[]
  currentlyExecuting: string | null
  output: string[]
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'var(--color-emerald-500)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-amber-500)' },
  advanced: { label: 'Advanced', color: 'var(--color-red-500)' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'two-step-chain',
      title: 'Two-Step Chain',
      code: [
        'fetch("/api/user")',
        '  .then(response => response.json())',
        '  .then(data => console.log(data));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Start',
          description: 'fetch() returns a Promise (P1) - starts pending while network request happens',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1 (fetch)', state: 'pending' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Resolve',
          description: 'Network response arrives. P1 fulfills with Response object.',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1 (fetch)', state: 'fulfilled', value: 'Response' }
          ],
          currentlyExecuting: null,
          output: []
        },
        {
          id: 2,
          phase: 'Parse',
          description: 'First .then() creates P2. response.json() returns another Promise (async parsing).',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1 (fetch)', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2 (json)', state: 'pending', waitingFor: 'JSON parsing' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 3,
          phase: 'Data',
          description: 'JSON parsing completes. P2 fulfills with parsed data.',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1 (fetch)', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2 (json)', state: 'fulfilled', value: '{user}' }
          ],
          currentlyExecuting: null,
          output: []
        },
        {
          id: 4,
          phase: 'Complete',
          description: 'Final .then() receives the parsed data and logs it.',
          highlightLines: [2],
          promiseChain: [
            { id: 'p1', label: 'P1 (fetch)', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2 (json)', state: 'fulfilled', value: '{user}' },
            { id: 'p3', label: 'P3 (log)', state: 'fulfilled' }
          ],
          currentlyExecuting: 'p3',
          output: ['{ id: 1, name: "Alice" }']
        }
      ],
      insight: 'Each .then() waits for the previous Promise to settle. The chain executes sequentially, step by step.'
    },
    {
      id: 'three-step-chain',
      title: 'Three-Step Chain',
      code: [
        'fetch("/api/data")',
        '  .then(r => r.json())          // Parse',
        '  .then(d => d.items)            // Extract',
        '  .then(items => items.length)   // Count',
        '  .then(count => console.log(count));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Fetch',
          description: 'fetch() starts the request. P1 is pending.',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'pending', waitingFor: 'Network' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Parse',
          description: 'P1 resolves. .json() parses the response.',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2', state: 'pending', waitingFor: 'P1' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 2,
          phase: 'Extract',
          description: 'P2 resolves with data. Next step extracts .items array.',
          highlightLines: [2],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '{data}' },
            { id: 'p3', label: 'P3', state: 'pending', waitingFor: 'P2' }
          ],
          currentlyExecuting: 'p3',
          output: []
        },
        {
          id: 3,
          phase: 'Count',
          description: 'P3 resolves with items array. Next step gets .length.',
          highlightLines: [3],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '{data}' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '[items]' },
            { id: 'p4', label: 'P4', state: 'pending', waitingFor: 'P3' }
          ],
          currentlyExecuting: 'p4',
          output: []
        },
        {
          id: 4,
          phase: 'Complete',
          description: 'P4 resolves with count. Final .then() logs it.',
          highlightLines: [4],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: 'Response' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '{data}' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '[items]' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '5' }
          ],
          currentlyExecuting: null,
          output: ['5']
        }
      ],
      insight: 'Data flows and transforms through the chain. Each step receives the previous step\'s result and transforms it further.'
    }
  ],
  intermediate: [
    {
      id: 'async-in-chain',
      title: 'Async in Chain',
      code: [
        'getUser(1)',
        '  .then(user => getPosts(user.id))',
        '  .then(posts => getComments(posts[0].id))',
        '  .then(comments => console.log(comments));'
      ],
      steps: [
        {
          id: 0,
          phase: 'User',
          description: 'getUser(1) returns Promise. Fetching user from database...',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'pending', waitingFor: 'DB query' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Posts',
          description: 'User fetched! Now getPosts() returns ANOTHER Promise. P2 waits for it.',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (posts)', state: 'pending', waitingFor: 'getPosts()' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 2,
          phase: 'Comments',
          description: 'Posts fetched! Now getComments() returns yet ANOTHER Promise. P3 waits.',
          highlightLines: [2],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (posts)', state: 'fulfilled', value: '[posts]' },
            { id: 'p3', label: 'P3 (comments)', state: 'pending', waitingFor: 'getComments()' }
          ],
          currentlyExecuting: 'p3',
          output: []
        },
        {
          id: 3,
          phase: 'Complete',
          description: 'All async operations complete! Comments logged.',
          highlightLines: [3],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (posts)', state: 'fulfilled', value: '[posts]' },
            { id: 'p3', label: 'P3 (comments)', state: 'fulfilled', value: '[comments]' }
          ],
          currentlyExecuting: null,
          output: ['[{ id: 1, text: "Great post!" }, ...]']
        }
      ],
      insight: 'When .then() returns a Promise, the chain WAITS for that Promise. This enables sequential async operations.'
    },
    {
      id: 'data-transformation',
      title: 'Data Transformation',
      code: [
        'fetchProducts()',
        '  .then(products => products.filter(p => p.inStock))',
        '  .then(inStock => inStock.map(p => p.price))',
        '  .then(prices => prices.reduce((a, b) => a + b, 0))',
        '  .then(total => console.log("Total:", total));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Fetch',
          description: 'Fetching all products from API...',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'pending', waitingFor: 'API' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Filter',
          description: 'Got 10 products. Filter keeps only in-stock items (7 remain).',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '[10 items]' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '[7 items]' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 2,
          phase: 'Map',
          description: 'Extract just the prices from filtered items.',
          highlightLines: [2],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '[10 items]' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '[7 items]' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '[prices]' }
          ],
          currentlyExecuting: 'p3',
          output: []
        },
        {
          id: 3,
          phase: 'Reduce',
          description: 'Sum all prices with reduce().',
          highlightLines: [3],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '[10 items]' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '[7 items]' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '[prices]' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '349.93' }
          ],
          currentlyExecuting: 'p4',
          output: []
        },
        {
          id: 4,
          phase: 'Output',
          description: 'Final total logged. Chain complete!',
          highlightLines: [4],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '[10 items]' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '[7 items]' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '[prices]' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '349.93' }
          ],
          currentlyExecuting: null,
          output: ['Total: 349.93']
        }
      ],
      insight: 'Promise chains are perfect for data pipelines: fetch, transform, transform, output. Each step is clear and isolated.'
    }
  ],
  advanced: [
    {
      id: 'long-chain',
      title: 'Long Pipeline',
      code: [
        'fetchOrders(userId)',
        '  .then(orders => orders.filter(o => o.status === "completed"))',
        '  .then(completed => completed.flatMap(o => o.items))',
        '  .then(items => items.map(i => ({ name: i.name, total: i.qty * i.price })))',
        '  .then(totals => totals.sort((a, b) => b.total - a.total))',
        '  .then(sorted => sorted.slice(0, 5))',
        '  .then(top5 => console.log("Top 5 purchases:", top5));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Fetch',
          description: 'Step 1: Fetch all orders for user from database',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'pending', waitingFor: 'Database' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Filter',
          description: 'Step 2: Keep only completed orders (filter)',
          highlightLines: [1],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 2,
          phase: 'Flatten',
          description: 'Step 3: Extract all items from orders (flatMap)',
          highlightLines: [2],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '47 items' }
          ],
          currentlyExecuting: 'p3',
          output: []
        },
        {
          id: 3,
          phase: 'Calculate',
          description: 'Step 4: Calculate total for each item (map)',
          highlightLines: [3],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '47 items' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '[{totals}]' }
          ],
          currentlyExecuting: 'p4',
          output: []
        },
        {
          id: 4,
          phase: 'Sort',
          description: 'Step 5: Sort by total, highest first (sort)',
          highlightLines: [4],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '47 items' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '[{totals}]' },
            { id: 'p5', label: 'P5', state: 'fulfilled', value: '[sorted]' }
          ],
          currentlyExecuting: 'p5',
          output: []
        },
        {
          id: 5,
          phase: 'Slice',
          description: 'Step 6: Take top 5 items (slice)',
          highlightLines: [5],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '47 items' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '[{totals}]' },
            { id: 'p5', label: 'P5', state: 'fulfilled', value: '[sorted]' },
            { id: 'p6', label: 'P6', state: 'fulfilled', value: '[top 5]' }
          ],
          currentlyExecuting: 'p6',
          output: []
        },
        {
          id: 6,
          phase: 'Output',
          description: 'Step 7: Log final result!',
          highlightLines: [6],
          promiseChain: [
            { id: 'p1', label: 'P1', state: 'fulfilled', value: '23 orders' },
            { id: 'p2', label: 'P2', state: 'fulfilled', value: '18 completed' },
            { id: 'p3', label: 'P3', state: 'fulfilled', value: '47 items' },
            { id: 'p4', label: 'P4', state: 'fulfilled', value: '[{totals}]' },
            { id: 'p5', label: 'P5', state: 'fulfilled', value: '[sorted]' },
            { id: 'p6', label: 'P6', state: 'fulfilled', value: '[top 5]' }
          ],
          currentlyExecuting: null,
          output: ['Top 5 purchases: [{ name: "Laptop", total: 1299 }, ...]']
        }
      ],
      insight: 'Long chains are readable as a data pipeline. Each step does ONE thing. Easy to debug, test, and modify independently.'
    },
    {
      id: 'branching-chain',
      title: 'Conditional Branching',
      code: [
        'getUser(id)',
        '  .then(user => {',
        '    if (user.isAdmin) {',
        '      return getAdminDashboard();',
        '    } else {',
        '      return getUserDashboard(user.id);',
        '    }',
        '  })',
        '  .then(dashboard => render(dashboard));'
      ],
      steps: [
        {
          id: 0,
          phase: 'Fetch User',
          description: 'Fetch user data to determine which dashboard to load',
          highlightLines: [0],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'pending', waitingFor: 'Auth service' }
          ],
          currentlyExecuting: 'p1',
          output: []
        },
        {
          id: 1,
          phase: 'Check Role',
          description: 'User fetched. Now check: is this user an admin?',
          highlightLines: [1, 2],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (check)', state: 'pending', waitingFor: 'Branch decision' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 2,
          phase: 'Branch',
          description: 'user.isAdmin = false. Taking the ELSE branch - getUserDashboard()',
          highlightLines: [4, 5],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (branch)', state: 'pending', waitingFor: 'getUserDashboard()' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 3,
          phase: 'Load',
          description: 'getUserDashboard() returned a Promise. P2 waits for it to resolve.',
          highlightLines: [5],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (dashboard)', state: 'pending', waitingFor: 'Dashboard API' }
          ],
          currentlyExecuting: 'p2',
          output: []
        },
        {
          id: 4,
          phase: 'Render',
          description: 'Dashboard loaded! Final .then() renders it.',
          highlightLines: [8],
          promiseChain: [
            { id: 'p1', label: 'P1 (user)', state: 'fulfilled', value: '{user}' },
            { id: 'p2', label: 'P2 (dashboard)', state: 'fulfilled', value: '{dashboard}' },
            { id: 'p3', label: 'P3 (render)', state: 'fulfilled' }
          ],
          currentlyExecuting: 'p3',
          output: ['Rendered user dashboard']
        }
      ],
      insight: 'You can branch inside .then() by returning different Promises based on conditions. The chain continues with whichever Promise you return.'
    }
  ]
}

export function PromisesChainingViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

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
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Start': return 'var(--color-blue-400)'
      case 'Fetch': return 'var(--color-blue-400)'
      case 'Fetch User': return 'var(--color-blue-400)'
      case 'Resolve': return 'var(--color-emerald-500)'
      case 'Parse': return 'var(--color-violet-300-40)'
      case 'Data': return 'var(--color-violet-300-40)'
      case 'User': return 'var(--color-blue-400)'
      case 'Posts': return 'var(--color-violet-300-40)'
      case 'Comments': return 'var(--color-violet-300-40)'
      case 'Filter': return 'var(--color-amber-500)'
      case 'Flatten': return 'var(--color-amber-500)'
      case 'Map': return 'var(--color-amber-500)'
      case 'Extract': return 'var(--color-amber-500)'
      case 'Count': return 'var(--color-amber-500)'
      case 'Calculate': return 'var(--color-amber-500)'
      case 'Reduce': return 'var(--color-amber-500)'
      case 'Sort': return 'var(--color-amber-500)'
      case 'Slice': return 'var(--color-amber-500)'
      case 'Check Role': return 'var(--color-amber-500)'
      case 'Branch': return 'var(--color-amber-500)'
      case 'Load': return 'var(--color-violet-300-40)'
      case 'Render': return 'var(--color-emerald-500)'
      case 'Output': return 'var(--color-emerald-500)'
      case 'Complete': return 'var(--color-emerald-500)'
      default: return 'var(--color-gray-500)'
    }
  }

  const getPromiseStateColor = (state: 'pending' | 'fulfilled' | 'rejected') => {
    switch (state) {
      case 'pending': return 'var(--color-amber-500)'
      case 'fulfilled': return 'var(--color-emerald-500)'
      case 'rejected': return 'var(--color-red-500)'
    }
  }

  return (
    <div className={styles.container}>
      {/* Level selector */}
      <div className={styles.levelSelector}>
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`${styles.exampleBtn} ${exampleIndex === i ? styles.active : ''}`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className={styles.codePanel}>
        <div className={styles.codeHeader}>
          <span>Code</span>
          <span className={styles.phaseBadge} style={{ background: getPhaseColor(currentStep.phase) }}>
            {currentStep.phase}
          </span>
        </div>
        <pre className={styles.code}>
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`${styles.codeLine} ${currentStep.highlightLines.includes(i) ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Promise Pipeline Visualization */}
      <div className={styles.promiseContainer}>
        <div className={styles.promiseHeader}>Promise Pipeline</div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px 0'
        }}>
          <AnimatePresence mode="popLayout">
            {currentStep.promiseChain.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {/* Step number */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: currentStep.currentlyExecuting === p.id
                    ? 'var(--color-amber-500)'
                    : p.state === 'fulfilled'
                      ? 'var(--color-emerald-30)'
                      : 'var(--color-white-10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: currentStep.currentlyExecuting === p.id
                    ? '#000'
                    : 'var(--color-gray-400)',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>

                {/* Promise card */}
                <motion.div
                  className={styles.promiseCard}
                  style={{
                    flex: 1,
                    minWidth: 'unset',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderColor: currentStep.currentlyExecuting === p.id
                      ? 'var(--color-amber-500)'
                      : getPromiseStateColor(p.state),
                    boxShadow: currentStep.currentlyExecuting === p.id
                      ? '0 0 20px rgba(245, 158, 11, 0.4)'
                      : `0 0 10px ${getPromiseStateColor(p.state)}20`
                  }}
                  layout
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.promiseLabel} style={{ marginBottom: 0 }}>
                      {p.label}
                    </div>
                    <motion.div
                      className={styles.promiseState}
                      style={{
                        color: getPromiseStateColor(p.state),
                        fontSize: 'var(--text-2xs)'
                      }}
                      key={p.state}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {p.state.toUpperCase()}
                    </motion.div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Waiting indicator */}
                    {p.waitingFor && p.state === 'pending' && (
                      <motion.div
                        style={{
                          fontSize: 'var(--text-2xs)',
                          color: 'var(--color-amber-500)',
                          padding: '2px 8px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          Waiting for {p.waitingFor}
                        </motion.span>
                      </motion.div>
                    )}

                    {/* Value badge */}
                    {p.value && (
                      <motion.div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--color-emerald-500)',
                          padding: '2px 8px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          borderRadius: '4px'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {p.value}
                      </motion.div>
                    )}
                  </div>

                  <div
                    className={styles.stateIndicator}
                    style={{ background: getPromiseStateColor(p.state) }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Console Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>-</span>
          ) : (
            currentStep.output.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.outputLine}
              >
                {o}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className={styles.description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <span className={styles.stepBadge}>Step {stepIndex + 1}/{currentExample.steps.length}</span>
          {currentStep.description}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <StepControls
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        canPrev={stepIndex > 0}
        canNext={stepIndex < currentExample.steps.length - 1}
        stepInfo={{ current: stepIndex + 1, total: currentExample.steps.length }}
      />

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
