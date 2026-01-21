import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TimingViz.module.css'

interface TimelineEvent {
  time: number // 0-100 position on timeline
  type: 'call' | 'execute' | 'cancel'
  label?: string
}

interface ClosureState {
  timeoutId: string
  lastTime?: string
}

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  timeline: TimelineEvent[]
  closureState?: ClosureState
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
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'debounce-basic',
      title: 'Debounce Basics',
      code: [
        'function debounce(fn, wait) {',
        '  let timeoutId;',
        '  return function(...args) {',
        '    clearTimeout(timeoutId);',
        '    timeoutId = setTimeout(',
        '      () => fn.apply(this, args),',
        '      wait',
        '    );',
        '  };',
        '}',
        '',
        '// Usage: search input',
        'const search = debounce(query => {',
        '  fetch(`/api?q=${query}`);',
        '}, 300);'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'debounce() creates closure with timeoutId variable',
          highlightLines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          timeline: [],
          closureState: { timeoutId: 'null' },
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'User types "a" - timer set for 300ms',
          highlightLines: [4, 5, 6, 7],
          timeline: [
            { time: 10, type: 'call', label: 'a' }
          ],
          closureState: { timeoutId: 'timer1' },
          output: []
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'User types "ab" (100ms later) - timer RESET!',
          highlightLines: [3],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'call', label: 'ab' }
          ],
          closureState: { timeoutId: 'timer2' },
          output: []
        },
        {
          id: 3,
          phase: 'Call 3',
          description: 'User types "abc" (100ms later) - timer RESET again!',
          highlightLines: [3],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'cancel', label: 'ab' },
            { time: 30, type: 'call', label: 'abc' }
          ],
          closureState: { timeoutId: 'timer3' },
          output: []
        },
        {
          id: 4,
          phase: 'Wait',
          description: 'User stops typing... waiting 300ms...',
          highlightLines: [],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'cancel', label: 'ab' },
            { time: 30, type: 'call', label: 'abc' }
          ],
          closureState: { timeoutId: 'timer3' },
          output: []
        },
        {
          id: 5,
          phase: 'Execute',
          description: '300ms passed with no new calls - fn("abc") executes!',
          highlightLines: [5],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'cancel', label: 'ab' },
            { time: 30, type: 'call', label: 'abc' },
            { time: 75, type: 'execute', label: 'abc' }
          ],
          closureState: { timeoutId: 'null' },
          output: ['fetch("/api?q=abc")']
        }
      ],
      insight: 'Debounce waits for a "pause" in activity. Each new call resets the timer. Only the LAST call executes.'
    },
    {
      id: 'throttle-basic',
      title: 'Throttle Basics',
      code: [
        'function throttle(fn, wait) {',
        '  let lastTime = 0;',
        '  return function(...args) {',
        '    const now = Date.now();',
        '    if (now - lastTime >= wait) {',
        '      lastTime = now;',
        '      fn.apply(this, args);',
        '    }',
        '  };',
        '}',
        '',
        '// Usage: scroll handler',
        'const onScroll = throttle(() => {',
        '  updatePosition();',
        '}, 100);'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'throttle() creates closure with lastTime = 0',
          highlightLines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          timeline: [],
          closureState: { timeoutId: 'N/A', lastTime: '0' },
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'First scroll event - executes immediately!',
          highlightLines: [4, 5, 6],
          timeline: [
            { time: 10, type: 'execute', label: '1' }
          ],
          closureState: { timeoutId: 'N/A', lastTime: '0ms' },
          output: ['updatePosition() #1']
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'Scroll again (30ms later) - BLOCKED! Only 30ms passed',
          highlightLines: [4],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 20, type: 'cancel', label: '2' }
          ],
          closureState: { timeoutId: 'N/A', lastTime: '0ms' },
          output: ['updatePosition() #1']
        },
        {
          id: 3,
          phase: 'Call 3',
          description: 'Scroll again (60ms later) - BLOCKED! Only 60ms passed',
          highlightLines: [4],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 20, type: 'cancel', label: '2' },
            { time: 30, type: 'cancel', label: '3' }
          ],
          closureState: { timeoutId: 'N/A', lastTime: '0ms' },
          output: ['updatePosition() #1']
        },
        {
          id: 4,
          phase: 'Call 4',
          description: 'Scroll again (110ms later) - EXECUTES! 100ms threshold passed',
          highlightLines: [5, 6],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 20, type: 'cancel', label: '2' },
            { time: 30, type: 'cancel', label: '3' },
            { time: 55, type: 'execute', label: '4' }
          ],
          closureState: { timeoutId: 'N/A', lastTime: '110ms' },
          output: ['updatePosition() #1', 'updatePosition() #4']
        },
        {
          id: 5,
          phase: 'Summary',
          description: '4 calls → only 2 executions (rate limited to every 100ms)',
          highlightLines: [],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 20, type: 'cancel', label: '2' },
            { time: 30, type: 'cancel', label: '3' },
            { time: 55, type: 'execute', label: '4' }
          ],
          closureState: { timeoutId: 'N/A', lastTime: '110ms' },
          output: ['updatePosition() #1', 'updatePosition() #4']
        }
      ],
      insight: 'Throttle ensures at most ONE execution per time window. Calls within the window are ignored.'
    }
  ],
  intermediate: [
    {
      id: 'debounce-leading',
      title: 'Debounce: Leading Edge',
      code: [
        'function debounce(fn, wait, opts = {}) {',
        '  let timeoutId;',
        '  const { leading = false } = opts;',
        '',
        '  return function(...args) {',
        '    const shouldCallNow = leading && !timeoutId;',
        '    clearTimeout(timeoutId);',
        '    timeoutId = setTimeout(() => {',
        '      timeoutId = null;',
        '    }, wait);',
        '    if (shouldCallNow) fn.apply(this, args);',
        '  };',
        '}',
        '',
        'const save = debounce(saveDoc, 1000, { leading: true });'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Leading edge: execute IMMEDIATELY on first call',
          highlightLines: [2, 5],
          timeline: [],
          closureState: { timeoutId: 'null' },
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'First call - no timeout exists, execute NOW!',
          highlightLines: [5, 10],
          timeline: [
            { time: 10, type: 'execute', label: '1' }
          ],
          closureState: { timeoutId: 'timer1' },
          output: ['saveDoc() #1 (immediate)']
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'Second call (200ms later) - timeout exists, BLOCKED',
          highlightLines: [5, 6],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' }
          ],
          closureState: { timeoutId: 'timer2' },
          output: ['saveDoc() #1 (immediate)']
        },
        {
          id: 3,
          phase: 'Call 3',
          description: 'Third call (400ms later) - timeout still exists, BLOCKED',
          highlightLines: [5, 6],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' },
            { time: 40, type: 'cancel', label: '3' }
          ],
          closureState: { timeoutId: 'timer3' },
          output: ['saveDoc() #1 (immediate)']
        },
        {
          id: 4,
          phase: 'Reset',
          description: '1000ms after last call - timeout clears, ready for next burst',
          highlightLines: [8],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' },
            { time: 40, type: 'cancel', label: '3' }
          ],
          closureState: { timeoutId: 'null' },
          output: ['saveDoc() #1 (immediate)']
        },
        {
          id: 5,
          phase: 'Call 4',
          description: 'New burst! First call of new burst executes immediately',
          highlightLines: [5, 10],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' },
            { time: 40, type: 'cancel', label: '3' },
            { time: 80, type: 'execute', label: '4' }
          ],
          closureState: { timeoutId: 'timer4' },
          output: ['saveDoc() #1 (immediate)', 'saveDoc() #4 (immediate)']
        }
      ],
      insight: 'Leading edge fires immediately on FIRST call, then debounces. Great for immediate feedback with rate limiting.'
    },
    {
      id: 'comparison',
      title: 'Debounce vs Throttle',
      code: [
        '// User types: a...b...c...d (each 50ms apart)',
        '// wait = 200ms',
        '',
        '// DEBOUNCE (trailing): waits for pause',
        '// a--b--c--d-------[execute "d"]',
        '// Only 1 execution after all typing stops',
        '',
        '// THROTTLE: rate limits',
        '// a--b--c--d--[exec]--e--f--[exec]',
        '// Executes every 200ms during activity'
      ],
      steps: [
        {
          id: 0,
          phase: 'Debounce',
          description: 'DEBOUNCE: User types a, b, c, d quickly...',
          highlightLines: [3, 4, 5],
          timeline: [
            { time: 10, type: 'call', label: 'a' },
            { time: 20, type: 'call', label: 'b' },
            { time: 30, type: 'call', label: 'c' },
            { time: 40, type: 'call', label: 'd' }
          ],
          output: []
        },
        {
          id: 1,
          phase: 'Debounce',
          description: 'Each keystroke resets the timer. Only "d" will fire.',
          highlightLines: [4],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'cancel', label: 'b' },
            { time: 30, type: 'cancel', label: 'c' },
            { time: 40, type: 'call', label: 'd' }
          ],
          output: []
        },
        {
          id: 2,
          phase: 'Debounce',
          description: 'After 200ms pause, "d" executes. Total: 1 execution',
          highlightLines: [5],
          timeline: [
            { time: 10, type: 'cancel', label: 'a' },
            { time: 20, type: 'cancel', label: 'b' },
            { time: 30, type: 'cancel', label: 'c' },
            { time: 40, type: 'call', label: 'd' },
            { time: 80, type: 'execute', label: 'd' }
          ],
          output: ['search("d")']
        },
        {
          id: 3,
          phase: 'Throttle',
          description: 'THROTTLE: Same typing pattern a, b, c, d...',
          highlightLines: [7, 8, 9],
          timeline: [
            { time: 10, type: 'execute', label: 'a' },
            { time: 20, type: 'call', label: 'b' },
            { time: 30, type: 'call', label: 'c' },
            { time: 40, type: 'call', label: 'd' }
          ],
          output: ['search("a")']
        },
        {
          id: 4,
          phase: 'Throttle',
          description: '"a" executes immediately. b, c, d blocked (within 200ms)',
          highlightLines: [8],
          timeline: [
            { time: 10, type: 'execute', label: 'a' },
            { time: 20, type: 'cancel', label: 'b' },
            { time: 30, type: 'cancel', label: 'c' },
            { time: 40, type: 'cancel', label: 'd' }
          ],
          output: ['search("a")']
        },
        {
          id: 5,
          phase: 'Throttle',
          description: 'After 200ms, next call executes. Rate-limited execution!',
          highlightLines: [8, 9],
          timeline: [
            { time: 10, type: 'execute', label: 'a' },
            { time: 20, type: 'cancel', label: 'b' },
            { time: 30, type: 'cancel', label: 'c' },
            { time: 40, type: 'cancel', label: 'd' },
            { time: 70, type: 'execute', label: 'e' }
          ],
          output: ['search("a")', 'search("e")']
        }
      ],
      insight: 'DEBOUNCE: "wait for pause, then execute once". THROTTLE: "execute at most every N ms".'
    }
  ],
  advanced: [
    {
      id: 'cancel',
      title: 'Cancel Method',
      code: [
        'function debounce(fn, wait) {',
        '  let timeoutId;',
        '',
        '  function debounced(...args) {',
        '    clearTimeout(timeoutId);',
        '    timeoutId = setTimeout(',
        '      () => fn.apply(this, args),',
        '      wait',
        '    );',
        '  }',
        '',
        '  debounced.cancel = function() {',
        '    clearTimeout(timeoutId);',
        '    timeoutId = null;',
        '  };',
        '',
        '  return debounced;',
        '}'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Add cancel method to clear pending execution',
          highlightLines: [11, 12, 13, 14],
          timeline: [],
          closureState: { timeoutId: 'null' },
          output: []
        },
        {
          id: 1,
          phase: 'Usage',
          description: 'User types, creating pending execution',
          highlightLines: [5, 6, 7, 8],
          timeline: [
            { time: 10, type: 'call', label: 'search' }
          ],
          closureState: { timeoutId: 'timer1' },
          output: []
        },
        {
          id: 2,
          phase: 'Cancel',
          description: 'Component unmounts - call cancel() to prevent stale execution!',
          highlightLines: [11, 12, 13],
          timeline: [
            { time: 10, type: 'call', label: 'search' },
            { time: 50, type: 'cancel', label: 'unmount' }
          ],
          closureState: { timeoutId: 'null' },
          output: ['(cancelled - no stale state update)']
        },
        {
          id: 3,
          phase: 'React',
          description: 'In React: cleanup in useEffect return',
          highlightLines: [],
          timeline: [
            { time: 10, type: 'call', label: 'search' },
            { time: 50, type: 'cancel', label: 'unmount' }
          ],
          closureState: { timeoutId: 'null' },
          output: ['useEffect(() => {', '  return () => debouncedSearch.cancel();', '}, []);']
        }
      ],
      insight: 'Cancel prevents stale executions. Essential for React cleanup to avoid updating unmounted components!'
    },
    {
      id: 'throttle-trailing',
      title: 'Throttle with Trailing',
      code: [
        'function throttle(fn, wait, opts = {}) {',
        '  let lastTime = 0;',
        '  let timeoutId;',
        '  const { trailing = true } = opts;',
        '',
        '  return function(...args) {',
        '    const now = Date.now();',
        '    const remaining = wait - (now - lastTime);',
        '',
        '    if (remaining <= 0) {',
        '      lastTime = now;',
        '      fn.apply(this, args);',
        '    } else if (!timeoutId && trailing) {',
        '      timeoutId = setTimeout(() => {',
        '        lastTime = Date.now();',
        '        timeoutId = null;',
        '        fn.apply(this, args);',
        '      }, remaining);',
        '    }',
        '  };',
        '}'
      ],
      steps: [
        {
          id: 0,
          phase: 'Setup',
          description: 'Trailing ensures the LAST call in a burst executes',
          highlightLines: [3, 12, 13, 14, 15, 16, 17, 18],
          timeline: [],
          closureState: { timeoutId: 'null', lastTime: '0' },
          output: []
        },
        {
          id: 1,
          phase: 'Call 1',
          description: 'First call - executes immediately (leading)',
          highlightLines: [9, 10, 11],
          timeline: [
            { time: 10, type: 'execute', label: '1' }
          ],
          closureState: { timeoutId: 'null', lastTime: '0ms' },
          output: ['fn() #1']
        },
        {
          id: 2,
          phase: 'Call 2',
          description: 'Second call (50ms) - schedules trailing execution',
          highlightLines: [12, 13],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'call', label: '2 (trailing)' }
          ],
          closureState: { timeoutId: 'timer1', lastTime: '0ms' },
          output: ['fn() #1']
        },
        {
          id: 3,
          phase: 'Call 3',
          description: 'Third call (80ms) - updates args for pending trailing',
          highlightLines: [12],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' },
            { time: 35, type: 'call', label: '3 (trailing)' }
          ],
          closureState: { timeoutId: 'timer1', lastTime: '0ms' },
          output: ['fn() #1']
        },
        {
          id: 4,
          phase: 'Trailing',
          description: 'After wait period - trailing executes with LAST args!',
          highlightLines: [14, 15, 16],
          timeline: [
            { time: 10, type: 'execute', label: '1' },
            { time: 25, type: 'cancel', label: '2' },
            { time: 35, type: 'call', label: '3' },
            { time: 55, type: 'execute', label: '3' }
          ],
          closureState: { timeoutId: 'null', lastTime: '100ms' },
          output: ['fn() #1', 'fn() #3 (trailing)']
        }
      ],
      insight: 'Trailing ensures the final call is not lost. Great for resize handlers where you need the final dimensions!'
    }
  ]
}

export function TimingViz() {
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
      case 'Setup': return '#60a5fa'
      case 'Call 1':
      case 'Call 2':
      case 'Call 3':
      case 'Call 4': return '#f59e0b'
      case 'Wait': return '#888'
      case 'Execute': return '#10b981'
      case 'Reset': return '#60a5fa'
      case 'Debounce': return '#a78bfa'
      case 'Throttle': return '#f59e0b'
      case 'Cancel': return '#ef4444'
      case 'Usage': return '#60a5fa'
      case 'React': return '#61dafb'
      case 'Summary': return '#10b981'
      case 'Trailing': return '#a78bfa'
      default: return '#888'
    }
  }

  const getEventColor = (type: 'call' | 'execute' | 'cancel') => {
    switch (type) {
      case 'call': return '#f59e0b'
      case 'execute': return '#10b981'
      case 'cancel': return '#ef4444'
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

      {/* Timeline Visualization */}
      <div className={styles.timelineContainer}>
        <div className={styles.timelineHeader}>Timeline</div>
        <div className={styles.timeline}>
          <div className={styles.timelineTrack}>
            <AnimatePresence>
              {currentStep.timeline.map((event, idx) => (
                <motion.div
                  key={`${event.time}-${event.type}-${idx}`}
                  className={styles.timelineEvent}
                  style={{ left: `${event.time}%` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className={styles.eventMarker}
                    style={{ background: getEventColor(event.type) }}
                  >
                    {event.type === 'execute' ? '✓' : event.type === 'cancel' ? '✗' : '•'}
                  </div>
                  {event.label && (
                    <div className={styles.eventLabel}>{event.label}</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className={styles.timelineLabels}>
            <span>0ms</span>
            <span>time →</span>
          </div>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#f59e0b' }}></span>
            Call
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#10b981' }}></span>
            Execute
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ef4444' }}></span>
            Cancelled
          </span>
        </div>
      </div>

      {/* Closure State */}
      {currentStep.closureState && (
        <div className={styles.closurePanel}>
          <div className={styles.closureHeader}>Closure State</div>
          <div className={styles.closureContent}>
            <div className={styles.closureVar}>
              <span className={styles.varName}>timeoutId:</span>
              <motion.span
                className={styles.varValue}
                key={currentStep.closureState.timeoutId}
                initial={{ scale: 1.2, color: '#f59e0b' }}
                animate={{ scale: 1, color: '#10b981' }}
              >
                {currentStep.closureState.timeoutId}
              </motion.span>
            </div>
            {currentStep.closureState.lastTime && (
              <div className={styles.closureVar}>
                <span className={styles.varName}>lastTime:</span>
                <motion.span
                  className={styles.varValue}
                  key={currentStep.closureState.lastTime}
                  initial={{ scale: 1.2, color: '#f59e0b' }}
                  animate={{ scale: 1, color: '#10b981' }}
                >
                  {currentStep.closureState.lastTime}
                </motion.span>
              </div>
            )}
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
      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={handlePrev} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <motion.button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={stepIndex >= currentExample.steps.length - 1}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {stepIndex >= currentExample.steps.length - 1 ? 'Done' : 'Next →'}
        </motion.button>
        <button className={styles.btnSecondary} onClick={handleReset}>
          ↻ Reset
        </button>
      </div>

      {/* Key insight */}
      <div className={styles.insight}>
        <strong>Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
