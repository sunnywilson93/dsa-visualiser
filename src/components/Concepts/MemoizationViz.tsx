import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'
import styles from './MemoizationViz.module.css'

interface CacheEntry {
  key: string
  value: string
  isHit?: boolean
  isNew?: boolean
}

interface FunctionCall {
  args: string
  result: string
  isCached: boolean
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  cache: CacheEntry[]
  currentCall?: FunctionCall
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
      id: 'basic-memo',
      title: 'Basic Memoization',
      code: [
        'function memoize(fn) {',
        '  const cache = new Map();',
        '  return function(...args) {',
        '    const key = JSON.stringify(args);',
        '    if (cache.has(key)) {',
        '      return cache.get(key);  // Cache HIT',
        '    }',
        '    const result = fn(...args);',
        '    cache.set(key, result);',
        '    return result;            // Cache MISS',
        '  };',
        '}',
        '',
        'const square = memoize(n => n * n);',
        'square(5);  // computes: 25',
        'square(5);  // cached: 25',
        'square(3);  // computes: 9'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'memoize() creates a closure with an empty Map cache',
          highlightLines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          cache: [],
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'square(5) - check cache for key "[5]"',
          highlightLines: [4],
          cache: [],
          currentCall: { args: '[5]', result: '?', isCached: false },
          output: []
        },
        {
          id: 2,
          phase: 'Miss',
          description: 'Cache MISS! Compute 5 * 5 = 25, store in cache',
          highlightLines: [7, 8, 9],
          cache: [
            { key: '[5]', value: '25', isNew: true }
          ],
          currentCall: { args: '[5]', result: '25', isCached: false },
          output: ['Computing 5 * 5 = 25']
        },
        {
          id: 3,
          phase: 'Call 2',
          description: 'square(5) again - check cache for key "[5]"',
          highlightLines: [4, 5],
          cache: [
            { key: '[5]', value: '25', isHit: true }
          ],
          currentCall: { args: '[5]', result: '25', isCached: true },
          output: ['Computing 5 * 5 = 25']
        },
        {
          id: 4,
          phase: 'Hit',
          description: 'Cache HIT! Return 25 directly (no computation)',
          highlightLines: [5],
          cache: [
            { key: '[5]', value: '25' }
          ],
          currentCall: { args: '[5]', result: '25', isCached: true },
          output: ['Computing 5 * 5 = 25', '→ 25 (cached!)']
        },
        {
          id: 5,
          phase: 'Call 3',
          description: 'square(3) - new key "[3]", cache miss',
          highlightLines: [7, 8, 9],
          cache: [
            { key: '[5]', value: '25' },
            { key: '[3]', value: '9', isNew: true }
          ],
          currentCall: { args: '[3]', result: '9', isCached: false },
          output: ['Computing 5 * 5 = 25', '→ 25 (cached!)', 'Computing 3 * 3 = 9']
        }
      ],
      insight: 'Memoization caches results by arguments. Same input = instant return. New input = compute and store.'
    },
    {
      id: 'fibonacci',
      title: 'Fibonacci Optimization',
      code: [
        '// Without memo: O(2^n) exponential!',
        'function fib(n) {',
        '  if (n <= 1) return n;',
        '  return fib(n-1) + fib(n-2);',
        '}',
        '',
        '// With memo: O(n) linear!',
        'const memoFib = memoize((n) => {',
        '  if (n <= 1) return n;',
        '  return memoFib(n-1) + memoFib(n-2);',
        '});',
        '',
        'memoFib(5);  // 5 computations, not 15!'
      ],
      steps: [
        {
          id: 0,
          phase: 'Problem',
          description: 'Without memoization, fib(5) calls fib(3) twice, fib(2) three times...',
          highlightLines: [1, 2, 3, 4],
          cache: [],
          output: ['fib(5) = fib(4) + fib(3)', '       = (fib(3) + fib(2)) + (fib(2) + fib(1))', '       = ... 15 total calls!']
        },
        {
          id: 1,
          phase: 'Memo',
          description: 'With memoization: memoFib(5) starts computation',
          highlightLines: [7, 8, 9, 10],
          cache: [],
          currentCall: { args: '5', result: '?', isCached: false },
          output: []
        },
        {
          id: 2,
          phase: 'Build',
          description: 'Base cases cached: fib(0)=0, fib(1)=1',
          highlightLines: [8],
          cache: [
            { key: '0', value: '0', isNew: true },
            { key: '1', value: '1', isNew: true }
          ],
          output: []
        },
        {
          id: 3,
          phase: 'Build',
          description: 'fib(2) = fib(1) + fib(0) = 1 + 0 = 1 → cached',
          highlightLines: [9],
          cache: [
            { key: '0', value: '0' },
            { key: '1', value: '1' },
            { key: '2', value: '1', isNew: true }
          ],
          output: []
        },
        {
          id: 4,
          phase: 'Build',
          description: 'fib(3) = fib(2) [HIT!] + fib(1) [HIT!] = 1 + 1 = 2',
          highlightLines: [9],
          cache: [
            { key: '0', value: '0' },
            { key: '1', value: '1', isHit: true },
            { key: '2', value: '1', isHit: true },
            { key: '3', value: '2', isNew: true }
          ],
          output: []
        },
        {
          id: 5,
          phase: 'Complete',
          description: 'fib(5) = 5, with only 6 computations instead of 15!',
          highlightLines: [12],
          cache: [
            { key: '0', value: '0' },
            { key: '1', value: '1' },
            { key: '2', value: '1' },
            { key: '3', value: '2' },
            { key: '4', value: '3' },
            { key: '5', value: '5', isNew: true }
          ],
          output: ['memoFib(5) = 5', '(6 computations, not 15!)']
        }
      ],
      insight: 'Memoization transforms overlapping recursive problems from exponential O(2^n) to linear O(n).'
    }
  ],
  intermediate: [
    {
      id: 'memoize-one',
      title: 'memoizeOne Pattern',
      code: [
        'function memoizeOne(fn) {',
        '  let lastArgs = null;',
        '  let lastResult;',
        '',
        '  return function(...args) {',
        '    if (lastArgs && argsEqual(lastArgs, args)) {',
        '      return lastResult;  // Same as last call',
        '    }',
        '    lastArgs = args;',
        '    lastResult = fn(...args);',
        '    return lastResult;',
        '  };',
        '}',
        '',
        'const filter = memoizeOne((users, q) =>',
        '  users.filter(u => u.name.includes(q))',
        ');'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'memoizeOne only caches the LAST result (not all results)',
          highlightLines: [0, 1, 2],
          cache: [],
          output: ['lastArgs = null', 'lastResult = undefined']
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'filter(users, "A") - no lastArgs, must compute',
          highlightLines: [5, 8, 9],
          cache: [
            { key: 'users, "A"', value: '[Alice, Amy]', isNew: true }
          ],
          currentCall: { args: 'users, "A"', result: '[Alice, Amy]', isCached: false },
          output: ['Computing filter...']
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'filter(users, "A") again - same args! Cache hit',
          highlightLines: [5, 6],
          cache: [
            { key: 'users, "A"', value: '[Alice, Amy]', isHit: true }
          ],
          currentCall: { args: 'users, "A"', result: '[Alice, Amy]', isCached: true },
          output: ['Computing filter...', '→ cached (same args)']
        },
        {
          id: 3,
          phase: 'Call 3',
          description: 'filter(users, "B") - different args! Must recompute',
          highlightLines: [8, 9],
          cache: [
            { key: 'users, "B"', value: '[Bob]', isNew: true }
          ],
          currentCall: { args: 'users, "B"', result: '[Bob]', isCached: false },
          output: ['Computing filter...', '→ cached (same args)', 'Computing filter...']
        },
        {
          id: 4,
          phase: 'Call 4',
          description: 'filter(users, "A") - args changed from last call! Recompute',
          highlightLines: [8, 9],
          cache: [
            { key: 'users, "A"', value: '[Alice, Amy]', isNew: true }
          ],
          currentCall: { args: 'users, "A"', result: '[Alice, Amy]', isCached: false },
          output: ['Computing filter...', '→ cached (same args)', 'Computing filter...', 'Computing filter...']
        }
      ],
      insight: 'memoizeOne is perfect for React: components often re-render with same props. Only last call matters!'
    },
    {
      id: 'custom-key',
      title: 'Custom Cache Key',
      code: [
        'function memoize(fn, keyFn = JSON.stringify) {',
        '  const cache = new Map();',
        '  return function(...args) {',
        '    const key = keyFn(args);',
        '    if (cache.has(key)) return cache.get(key);',
        '    const result = fn(...args);',
        '    cache.set(key, result);',
        '    return result;',
        '  };',
        '}',
        '',
        '// Use user.id as cache key, not entire object',
        'const fetchUser = memoize(',
        '  async (user) => api.get(`/users/${user.id}`),',
        '  ([user]) => user.id',
        ');'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Custom keyFn extracts just user.id for cache key',
          highlightLines: [12, 13, 14],
          cache: [],
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'fetchUser({ id: 1, name: "Alice" }) → key = 1',
          highlightLines: [3, 4],
          cache: [
            { key: '1', value: '{userData}', isNew: true }
          ],
          currentCall: { args: '{ id: 1, name: "Alice" }', result: '{userData}', isCached: false },
          output: ['API call: /users/1']
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'fetchUser({ id: 1, name: "Bob" }) → key = 1 (same!)',
          highlightLines: [4],
          cache: [
            { key: '1', value: '{userData}', isHit: true }
          ],
          currentCall: { args: '{ id: 1, name: "Bob" }', result: '{userData}', isCached: true },
          output: ['API call: /users/1', '→ cached (same id!)']
        },
        {
          id: 3,
          phase: 'Why',
          description: 'Without custom key: { id:1, name:"Alice" } ≠ { id:1, name:"Bob" }',
          highlightLines: [14],
          cache: [
            { key: '1', value: '{userData}' }
          ],
          output: ['Default JSON.stringify:', '  "[{id:1,name:Alice}]" ≠ "[{id:1,name:Bob}]"', '', 'Custom keyFn:', '  "1" === "1" ✓']
        }
      ],
      insight: 'Custom keyFn lets you cache by meaningful identity (like ID), not object structure.'
    }
  ],
  advanced: [
    {
      id: 'lru-cache',
      title: 'LRU Cache (Max Size)',
      code: [
        'function memoize(fn, maxSize = 3) {',
        '  const cache = new Map();',
        '  return function(...args) {',
        '    const key = JSON.stringify(args);',
        '    if (cache.has(key)) {',
        '      const val = cache.get(key);',
        '      cache.delete(key);  // Move to end',
        '      cache.set(key, val);',
        '      return val;',
        '    }',
        '    const result = fn(...args);',
        '    if (cache.size >= maxSize) {',
        '      const oldest = cache.keys().next().value;',
        '      cache.delete(oldest);  // Evict oldest',
        '    }',
        '    cache.set(key, result);',
        '    return result;',
        '  };',
        '}'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'LRU Cache with maxSize=3 (Least Recently Used eviction)',
          highlightLines: [0, 1, 11, 12, 13, 14],
          cache: [],
          output: ['maxSize = 3']
        },
        {
          id: 1,
          phase: 'Fill',
          description: 'Add A, B, C - cache is now full',
          highlightLines: [15],
          cache: [
            { key: 'A', value: '1' },
            { key: 'B', value: '2' },
            { key: 'C', value: '3', isNew: true }
          ],
          output: ['Cache: A, B, C (full)']
        },
        {
          id: 2,
          phase: 'Access',
          description: 'Access A - move to end (most recently used)',
          highlightLines: [5, 6, 7],
          cache: [
            { key: 'B', value: '2' },
            { key: 'C', value: '3' },
            { key: 'A', value: '1', isHit: true }
          ],
          output: ['Cache: A, B, C (full)', 'Get A → move to end: B, C, A']
        },
        {
          id: 3,
          phase: 'Add D',
          description: 'Add D - cache full! Evict B (oldest/least recent)',
          highlightLines: [11, 12, 13],
          cache: [
            { key: 'C', value: '3' },
            { key: 'A', value: '1' },
            { key: 'D', value: '4', isNew: true }
          ],
          output: ['Cache: A, B, C (full)', 'Get A → move to end: B, C, A', 'Add D → evict B: C, A, D']
        },
        {
          id: 4,
          phase: 'Add E',
          description: 'Add E - evict C (now oldest)',
          highlightLines: [12, 13],
          cache: [
            { key: 'A', value: '1' },
            { key: 'D', value: '4' },
            { key: 'E', value: '5', isNew: true }
          ],
          output: ['Cache: A, B, C (full)', 'Get A → move to end: B, C, A', 'Add D → evict B: C, A, D', 'Add E → evict C: A, D, E']
        }
      ],
      insight: 'LRU evicts least-recently-used entries when full. Map insertion order makes this easy in JS!'
    },
    {
      id: 'react-memo',
      title: 'React Memoization',
      code: [
        'function UserList({ users, filter }) {',
        '  // useMemo: memoize computed value',
        '  const filtered = useMemo(() => {',
        '    return users.filter(u => ',
        '      u.name.includes(filter)',
        '    );',
        '  }, [users, filter]);',
        '',
        '  // useCallback: memoize function',
        '  const handleClick = useCallback((id) => {',
        '    console.log("clicked", id);',
        '  }, []);  // stable reference',
        '',
        '  return filtered.map(u => (',
        '    <UserRow key={u.id} onClick={handleClick} />',
        '  ));',
        '}',
        '',
        '// React.memo: memoize component',
        'const UserRow = React.memo(({ onClick }) => ...);'
      ],
      steps: [
        {
          id: 0,
          phase: 'useMemo',
          description: 'useMemo: cache expensive computation between renders',
          highlightLines: [2, 3, 4, 5, 6],
          cache: [
            { key: '[users, filter]', value: 'filteredUsers' }
          ],
          output: ['deps: [users, filter]', 'If deps unchanged → return cached value', 'If deps changed → recompute']
        },
        {
          id: 1,
          phase: 'Render 1',
          description: 'First render: filter="A", must compute filtered list',
          highlightLines: [3, 4, 5],
          cache: [
            { key: '[users, "A"]', value: '[Alice, Amy]', isNew: true }
          ],
          output: ['Render #1: filter="A"', 'useMemo: computing...']
        },
        {
          id: 2,
          phase: 'Render 2',
          description: 'Re-render with same filter - useMemo returns cached!',
          highlightLines: [2, 6],
          cache: [
            { key: '[users, "A"]', value: '[Alice, Amy]', isHit: true }
          ],
          output: ['Render #1: filter="A"', 'useMemo: computing...', 'Render #2: filter="A"', 'useMemo: cached!']
        },
        {
          id: 3,
          phase: 'useCallback',
          description: 'useCallback: stable function reference for child props',
          highlightLines: [9, 10, 11],
          cache: [
            { key: '[]', value: 'handleClick fn' }
          ],
          output: ['Empty deps = same function every render', 'Why? Prevents UserRow re-renders!']
        },
        {
          id: 4,
          phase: 'React.memo',
          description: 'React.memo: skip re-render if props unchanged',
          highlightLines: [19],
          cache: [
            { key: 'props', value: 'prev render' }
          ],
          output: ['React.memo does shallow prop comparison', 'Same props → skip render', 'Works best with useCallback!']
        }
      ],
      insight: 'useMemo = cache value, useCallback = cache function, React.memo = cache component. Use together!'
    }
  ]
}

export function MemoizationViz() {
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
      case 'Setup': return 'var(--color-blue-400)'
      case 'Call 1':
      case 'Call 2':
      case 'Call 3':
      case 'Call 4': return 'var(--color-amber-500)'
      case 'Miss': return 'var(--color-red-500)'
      case 'Hit': return 'var(--color-emerald-500)'
      case 'Complete': return 'var(--color-emerald-500)'
      case 'Problem': return 'var(--color-red-500)'
      case 'Memo': return 'var(--color-violet-300-40)'
      case 'Build': return 'var(--color-amber-500)'
      case 'Why': return 'var(--color-blue-400)'
      case 'Fill': return 'var(--color-amber-500)'
      case 'Access': return 'var(--color-emerald-500)'
      case 'Add D':
      case 'Add E': return 'var(--color-violet-300-40)'
      case 'useMemo':
      case 'useCallback': return '#61dafb'
      case 'Render 1':
      case 'Render 2': return 'var(--color-amber-500)'
      case 'React.memo': return 'var(--color-emerald-500)'
      default: return 'var(--color-gray-500)'
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

      {/* Cache Visualization */}
      <div className={styles.cacheContainer}>
        <div className={styles.cacheHeader}>Cache</div>
        <div className={styles.cacheGrid}>
          <AnimatePresence mode="popLayout">
            {currentStep.cache.length === 0 ? (
              <motion.div
                className={styles.emptyCache}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                (empty)
              </motion.div>
            ) : (
              currentStep.cache.map(entry => (
                <motion.div
                  key={entry.key}
                  className={`${styles.cacheEntry} ${entry.isHit ? styles.hit : ''} ${entry.isNew ? styles.new : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  layout
                >
                  <div className={styles.cacheKey}>{entry.key}</div>
                  <div className={styles.cacheArrow}>→</div>
                  <div className={styles.cacheValue}>{entry.value}</div>
                  {entry.isHit && <span className={styles.hitBadge}>HIT</span>}
                  {entry.isNew && <span className={styles.newBadge}>NEW</span>}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Current Call */}
      {currentStep.currentCall && (
        <div className={styles.callPanel}>
          <div className={styles.callHeader}>Current Call</div>
          <div className={styles.callContent}>
            <div className={styles.callArgs}>
              <span className={styles.callLabel}>args:</span>
              <span className={styles.callValue}>{currentStep.currentCall.args}</span>
            </div>
            <div className={styles.callResult}>
              <span className={styles.callLabel}>result:</span>
              <motion.span
                className={`${styles.callValue} ${currentStep.currentCall.isCached ? styles.cached : styles.computed}`}
                key={currentStep.currentCall.result}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {currentStep.currentCall.result}
                {currentStep.currentCall.isCached && ' (cached)'}
              </motion.span>
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>Output</div>
        <div className={styles.output}>
          {currentStep.output.length === 0 ? (
            <span className={styles.emptyOutput}>—</span>
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
