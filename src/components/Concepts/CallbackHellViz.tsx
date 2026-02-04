'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '@/components/SharedViz'

interface PyramidLevel {
  level: number
  code: string
  indent: number
}

interface Step {
  description: string
  highlightLines: number[]
  nestingDepth: number
  readabilityScore: number
  pyramidLevels: PyramidLevel[]
  output: string[]
  phase: 'normal' | 'nested' | 'pyramid' | 'refactored'
  issues: string[]
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
      id: 'first-nesting',
      title: 'First Nesting',
      code: [
        'getData(function(a) {',
        '  getMoreData(a, function(b) {',
        '    console.log(b);',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'We start with a simple async call. getData takes a callback.',
          highlightLines: [0],
          nestingDepth: 1,
          readabilityScore: 90,
          pyramidLevels: [
            { level: 1, code: 'getData(callback)', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: [],
        },
        {
          description: 'Inside the callback, we need MORE data. We nest another async call.',
          highlightLines: [1],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'getData(callback)', indent: 0 },
            { level: 2, code: 'getMoreData(callback)', indent: 2 }
          ],
          output: [],
          phase: 'nested',
          issues: ['Indentation growing'],
        },
        {
          description: 'Finally we can use the result. But look at that indentation!',
          highlightLines: [2],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'getData(callback)', indent: 0 },
            { level: 2, code: 'getMoreData(callback)', indent: 2 }
          ],
          output: ['result'],
          phase: 'nested',
          issues: ['Indentation growing', 'Logic buried inside callbacks'],
        },
        {
          description: 'With just 2 levels, code is still readable. But what happens with more?',
          highlightLines: [],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'getData(callback)', indent: 0 },
            { level: 2, code: 'getMoreData(callback)', indent: 2 }
          ],
          output: ['result'],
          phase: 'nested',
          issues: ['Indentation growing', 'Logic buried inside callbacks'],
        },
      ],
      insight: 'Each nested callback adds indentation. This is the start of the "pyramid" shape.'
    },
    {
      id: 'growing-pyramid',
      title: 'Growing Pyramid',
      code: [
        'step1(function(a) {',
        '  step2(a, function(b) {',
        '    step3(b, function(c) {',
        '      console.log(c);',
        '    });',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'First async operation - depth 1, readability still good.',
          highlightLines: [0],
          nestingDepth: 1,
          readabilityScore: 90,
          pyramidLevels: [
            { level: 1, code: 'step1', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: [],
        },
        {
          description: 'Second operation nested - depth 2, starting to indent.',
          highlightLines: [1],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'step1', indent: 0 },
            { level: 2, code: 'step2', indent: 2 }
          ],
          output: [],
          phase: 'nested',
          issues: ['Indentation at 2 spaces'],
        },
        {
          description: 'Third operation - depth 3. The pyramid shape emerges!',
          highlightLines: [2],
          nestingDepth: 3,
          readabilityScore: 50,
          pyramidLevels: [
            { level: 1, code: 'step1', indent: 0 },
            { level: 2, code: 'step2', indent: 2 },
            { level: 3, code: 'step3', indent: 4 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Indentation at 4 spaces', 'Hard to follow flow', 'Error handling is tricky'],
        },
        {
          description: 'The actual logic is buried at the deepest level.',
          highlightLines: [3],
          nestingDepth: 3,
          readabilityScore: 50,
          pyramidLevels: [
            { level: 1, code: 'step1', indent: 0 },
            { level: 2, code: 'step2', indent: 2 },
            { level: 3, code: 'step3', indent: 4 }
          ],
          output: ['final result'],
          phase: 'pyramid',
          issues: ['Indentation at 4 spaces', 'Hard to follow flow', 'Error handling is tricky'],
        },
      ],
      insight: 'With 3 levels, the "pyramid of doom" shape is clear. This is called callback hell!'
    },
  ],
  intermediate: [
    {
      id: 'api-sequence',
      title: 'API Sequence',
      code: [
        'fetchUser(userId, function(user) {',
        '  fetchOrders(user.id, function(orders) {',
        '    fetchOrderDetails(orders[0], function(details) {',
        '      fetchShipping(details.id, function(shipping) {',
        '        console.log(shipping);',
        '      });',
        '    });',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'Real-world scenario: Fetch user data first.',
          highlightLines: [0],
          nestingDepth: 1,
          readabilityScore: 90,
          pyramidLevels: [
            { level: 1, code: 'fetchUser', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: [],
        },
        {
          description: 'Then fetch orders for that user.',
          highlightLines: [1],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'fetchUser', indent: 0 },
            { level: 2, code: 'fetchOrders', indent: 2 }
          ],
          output: [],
          phase: 'nested',
          issues: ['Growing indentation'],
        },
        {
          description: 'Then fetch details for an order.',
          highlightLines: [2],
          nestingDepth: 3,
          readabilityScore: 50,
          pyramidLevels: [
            { level: 1, code: 'fetchUser', indent: 0 },
            { level: 2, code: 'fetchOrders', indent: 2 },
            { level: 3, code: 'fetchOrderDetails', indent: 4 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Growing indentation', 'Sequential logic hard to follow'],
        },
        {
          description: 'Finally fetch shipping - 4 levels deep!',
          highlightLines: [3],
          nestingDepth: 4,
          readabilityScore: 30,
          pyramidLevels: [
            { level: 1, code: 'fetchUser', indent: 0 },
            { level: 2, code: 'fetchOrders', indent: 2 },
            { level: 3, code: 'fetchOrderDetails', indent: 4 },
            { level: 4, code: 'fetchShipping', indent: 6 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Deep nesting', 'Error handling nightmare', 'Hard to modify', 'Testing is difficult'],
        },
        {
          description: 'The actual goal (showing shipping) is buried 4 levels deep.',
          highlightLines: [4],
          nestingDepth: 4,
          readabilityScore: 30,
          pyramidLevels: [
            { level: 1, code: 'fetchUser', indent: 0 },
            { level: 2, code: 'fetchOrders', indent: 2 },
            { level: 3, code: 'fetchOrderDetails', indent: 4 },
            { level: 4, code: 'fetchShipping', indent: 6 }
          ],
          output: ['shipping info'],
          phase: 'pyramid',
          issues: ['Deep nesting', 'Error handling nightmare', 'Hard to modify', 'Testing is difficult'],
        },
      ],
      insight: 'Sequential API calls create deep nesting. Each call depends on the previous result.'
    },
    {
      id: 'file-operations',
      title: 'File Operations',
      code: [
        "fs.readFile('config.json', function(err, config) {",
        '  if (err) return console.error(err);',
        "  fs.readFile(config.dataPath, function(err, data) {",
        '    if (err) return console.error(err);',
        "    fs.writeFile('output.json', data, function(err) {",
        '      if (err) return console.error(err);',
        "      console.log('Done!');",
        '    });',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'Node.js file operations - read config first.',
          highlightLines: [0],
          nestingDepth: 1,
          readabilityScore: 80,
          pyramidLevels: [
            { level: 1, code: 'readFile(config)', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: [],
        },
        {
          description: 'Error handling adds complexity. Notice the if(err) check.',
          highlightLines: [1],
          nestingDepth: 1,
          readabilityScore: 75,
          pyramidLevels: [
            { level: 1, code: 'readFile(config)', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: ['Repeated error handling pattern'],
        },
        {
          description: 'Read data file based on config. Another nested callback!',
          highlightLines: [2, 3],
          nestingDepth: 2,
          readabilityScore: 55,
          pyramidLevels: [
            { level: 1, code: 'readFile(config)', indent: 0 },
            { level: 2, code: 'readFile(data)', indent: 2 }
          ],
          output: [],
          phase: 'nested',
          issues: ['Repeated error handling', 'Growing indentation'],
        },
        {
          description: 'Write output file. Third level of nesting.',
          highlightLines: [4, 5],
          nestingDepth: 3,
          readabilityScore: 40,
          pyramidLevels: [
            { level: 1, code: 'readFile(config)', indent: 0 },
            { level: 2, code: 'readFile(data)', indent: 2 },
            { level: 3, code: 'writeFile(output)', indent: 4 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Error handling repeated 3x', 'Deep nesting', 'Hard to add steps'],
        },
        {
          description: 'Success message at the deepest level.',
          highlightLines: [6],
          nestingDepth: 3,
          readabilityScore: 40,
          pyramidLevels: [
            { level: 1, code: 'readFile(config)', indent: 0 },
            { level: 2, code: 'readFile(data)', indent: 2 },
            { level: 3, code: 'writeFile(output)', indent: 4 }
          ],
          output: ['Done!'],
          phase: 'pyramid',
          issues: ['Error handling repeated 3x', 'Deep nesting', 'Hard to add steps'],
        },
      ],
      insight: 'Node.js "error-first callbacks" make it worse - each level needs error handling!'
    },
  ],
  advanced: [
    {
      id: 'full-pyramid',
      title: 'Full Pyramid of Doom',
      code: [
        'authenticate(user, pass, function(err, token) {',
        '  if (err) return handleError(err);',
        '  getUserProfile(token, function(err, profile) {',
        '    if (err) return handleError(err);',
        '    getPermissions(profile, function(err, perms) {',
        '      if (err) return handleError(err);',
        '      loadDashboard(perms, function(err, dashboard) {',
        '        if (err) return handleError(err);',
        '        fetchNotifications(profile, function(err, notifs) {',
        '          if (err) return handleError(err);',
        '          render(dashboard, notifs);',
        '        });',
        '      });',
        '    });',
        '  });',
        '});',
      ],
      steps: [
        {
          description: 'A real authentication flow. It starts innocently...',
          highlightLines: [0, 1],
          nestingDepth: 1,
          readabilityScore: 85,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 }
          ],
          output: [],
          phase: 'normal',
          issues: [],
        },
        {
          description: 'Get user profile after auth.',
          highlightLines: [2, 3],
          nestingDepth: 2,
          readabilityScore: 70,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 },
            { level: 2, code: 'getUserProfile', indent: 2 }
          ],
          output: [],
          phase: 'nested',
          issues: ['2 levels of error handling'],
        },
        {
          description: 'Get permissions based on profile.',
          highlightLines: [4, 5],
          nestingDepth: 3,
          readabilityScore: 50,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 },
            { level: 2, code: 'getUserProfile', indent: 2 },
            { level: 3, code: 'getPermissions', indent: 4 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Deep nesting', 'Repeated error pattern', 'Hard to test'],
        },
        {
          description: 'Load dashboard with permissions.',
          highlightLines: [6, 7],
          nestingDepth: 4,
          readabilityScore: 35,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 },
            { level: 2, code: 'getUserProfile', indent: 2 },
            { level: 3, code: 'getPermissions', indent: 4 },
            { level: 4, code: 'loadDashboard', indent: 6 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Very deep nesting', '4x error handling', 'Nearly unreadable'],
        },
        {
          description: 'Fetch notifications - 5 levels deep! This is callback hell.',
          highlightLines: [8, 9],
          nestingDepth: 5,
          readabilityScore: 20,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 },
            { level: 2, code: 'getUserProfile', indent: 2 },
            { level: 3, code: 'getPermissions', indent: 4 },
            { level: 4, code: 'loadDashboard', indent: 6 },
            { level: 5, code: 'fetchNotifications', indent: 8 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['Extreme nesting', '5x error handling', 'Impossible to maintain', 'Bug-prone'],
        },
        {
          description: 'Finally render! But good luck debugging this...',
          highlightLines: [10],
          nestingDepth: 5,
          readabilityScore: 20,
          pyramidLevels: [
            { level: 1, code: 'authenticate', indent: 0 },
            { level: 2, code: 'getUserProfile', indent: 2 },
            { level: 3, code: 'getPermissions', indent: 4 },
            { level: 4, code: 'loadDashboard', indent: 6 },
            { level: 5, code: 'fetchNotifications', indent: 8 }
          ],
          output: ['rendered!'],
          phase: 'pyramid',
          issues: ['Extreme nesting', '5x error handling', 'Impossible to maintain', 'Bug-prone'],
        },
      ],
      insight: 'This is the "Pyramid of Doom" - deeply nested callbacks that are nearly impossible to read or maintain.'
    },
    {
      id: 'before-after',
      title: 'Before/After: Promises',
      code: [
        '// CALLBACK HELL:',
        'getUser(id, function(user) {',
        '  getOrders(user, function(orders) {',
        '    getDetails(orders[0], function(details) {',
        '      console.log(details);',
        '    });',
        '  });',
        '});',
        '',
        '// WITH PROMISES:',
        'getUser(id)',
        '  .then(user => getOrders(user))',
        '  .then(orders => getDetails(orders[0]))',
        '  .then(details => console.log(details));',
      ],
      steps: [
        {
          description: 'The callback version - nested and indented.',
          highlightLines: [1, 2, 3, 4, 5, 6, 7],
          nestingDepth: 3,
          readabilityScore: 45,
          pyramidLevels: [
            { level: 1, code: 'getUser', indent: 0 },
            { level: 2, code: 'getOrders', indent: 2 },
            { level: 3, code: 'getDetails', indent: 4 }
          ],
          output: [],
          phase: 'pyramid',
          issues: ['3 levels deep', 'Pyramid shape', 'Hard to add error handling'],
        },
        {
          description: 'Now look at the Promise version - flat and readable!',
          highlightLines: [10, 11, 12, 13],
          nestingDepth: 1,
          readabilityScore: 95,
          pyramidLevels: [
            { level: 1, code: '.then(getUser)', indent: 0 },
            { level: 1, code: '.then(getOrders)', indent: 0 },
            { level: 1, code: '.then(getDetails)', indent: 0 }
          ],
          output: [],
          phase: 'refactored',
          issues: [],
        },
        {
          description: 'Promises flatten the pyramid into a chain. Same logic, way cleaner!',
          highlightLines: [10, 11, 12, 13],
          nestingDepth: 1,
          readabilityScore: 95,
          pyramidLevels: [
            { level: 1, code: '.then(getUser)', indent: 0 },
            { level: 1, code: '.then(getOrders)', indent: 0 },
            { level: 1, code: '.then(getDetails)', indent: 0 }
          ],
          output: ['details'],
          phase: 'refactored',
          issues: [],
        },
      ],
      insight: 'Promises solve callback hell by flattening the pyramid. Each .then() chains sequentially without nesting!'
    },
  ],
}

export function CallbackHellViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  useEffect(() => {
    if (currentStep.highlightLines.length > 0) {
      const firstLine = currentStep.highlightLines[0]
      if (lineRefs.current[firstLine]) {
        lineRefs.current[firstLine]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
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

  const getDepthColor = (depth: number) => {
    if (depth <= 1) return 'var(--color-emerald-500)'
    if (depth <= 2) return '#84cc16'
    if (depth <= 3) return 'var(--color-amber-500)'
    if (depth <= 4) return '#f97316'
    return 'var(--color-red-500)'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--color-emerald-500)'
    if (score >= 60) return '#84cc16'
    if (score >= 40) return 'var(--color-amber-500)'
    if (score >= 20) return '#f97316'
    return 'var(--color-red-500)'
  }

  const getPhaseLabel = (phase: Step['phase']) => {
    switch (phase) {
      case 'normal': return 'Normal'
      case 'nested': return 'Nesting'
      case 'pyramid': return 'Pyramid!'
      case 'refactored': return 'Refactored'
    }
  }

  const getPhaseColor = (phase: Step['phase']) => {
    switch (phase) {
      case 'normal': return 'var(--color-emerald-500)'
      case 'nested': return 'var(--color-amber-500)'
      case 'pyramid': return 'var(--color-red-500)'
      case 'refactored': return '#3b82f6'
    }
  }

  return (
    <div className="flex flex-col gap-5 text-[var(--js-viz-text)]">
      {/* Level selector */}
      <div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {(Object.keys(levelInfo) as Level[]).map(lvl => (
          <button
            key={lvl}
            className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer
              ${level === lvl
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleLevelChange(lvl)}
            style={{
              borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
              background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
            }}
          >
            <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
            {levelInfo[lvl].label}
          </button>
        ))}
      </div>

      {/* Example selector */}
      <div className="flex gap-[var(--spacing-sm)] flex-wrap justify-center bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
        {currentExamples.map((ex, i) => (
          <button
            key={ex.id}
            className={`px-[var(--spacing-md)] py-1.5 font-mono text-sm rounded-full transition-all duration-150 cursor-pointer
              ${exampleIndex === i
                ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
                : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
              }`}
            onClick={() => handleExampleChange(i)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-3 gap-[var(--spacing-lg)] max-md:grid-cols-1">
        {/* Nesting Depth Indicator */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: `linear-gradient(135deg, ${getDepthColor(currentStep.nestingDepth)}, ${getDepthColor(currentStep.nestingDepth)}88)`
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Nesting Depth
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[120px] p-[var(--spacing-md)] pt-6 flex flex-col items-center justify-center">
            <motion.div
              key={currentStep.nestingDepth}
              className="text-5xl font-bold"
              style={{ color: getDepthColor(currentStep.nestingDepth) }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {currentStep.nestingDepth}
            </motion.div>
            <div className="text-sm text-[var(--color-gray-500)] mt-1">
              level{currentStep.nestingDepth > 1 ? 's' : ''} deep
            </div>
          </div>
        </div>

        {/* Readability Score */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: `linear-gradient(135deg, ${getScoreColor(currentStep.readabilityScore)}, ${getScoreColor(currentStep.readabilityScore)}88)`
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Readability
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[120px] p-[var(--spacing-md)] pt-6 flex flex-col items-center justify-center">
            <motion.div
              key={currentStep.readabilityScore}
              className="text-4xl font-bold"
              style={{ color: getScoreColor(currentStep.readabilityScore) }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {currentStep.readabilityScore}%
            </motion.div>
            <div className="w-full mt-2 h-2 bg-[var(--color-black-30)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: getScoreColor(currentStep.readabilityScore) }}
                initial={{ width: 0 }}
                animate={{ width: `${currentStep.readabilityScore}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Issues Panel */}
        <div className="relative rounded-xl p-[3px]"
          style={{
            background: currentStep.issues.length > 0
              ? 'linear-gradient(135deg, var(--color-red-500), var(--color-amber-500))'
              : 'linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-400))'
          }}>
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
            Issues
          </div>
          <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[120px] p-[var(--spacing-md)] pt-6">
            <AnimatePresence mode="popLayout">
              {currentStep.issues.length === 0 ? (
                <motion.div
                  key="none"
                  className="text-[var(--color-emerald-400)] text-sm text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No issues yet
                </motion.div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {currentStep.issues.map((issue, i) => (
                    <motion.div
                      key={issue}
                      className="px-2 py-1 bg-[var(--color-red-15)] border border-[var(--color-red-40)] rounded text-xs text-[var(--color-red-400)]"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {issue}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pyramid Visualization */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
        <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
          Pyramid Shape
        </div>
        <div className="flex flex-col gap-1 py-2">
          <AnimatePresence mode="popLayout">
            {currentStep.pyramidLevels.map((pl, i) => (
              <motion.div
                key={pl.code + pl.level}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                layout
              >
                <div
                  className="h-6 rounded transition-all"
                  style={{
                    width: `${pl.indent * 12 + 4}px`,
                    backgroundColor: getDepthColor(pl.level),
                    opacity: 0.3
                  }}
                />
                <span
                  className="font-mono text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${getDepthColor(pl.level)}20`,
                    color: getDepthColor(pl.level),
                    borderLeft: `3px solid ${getDepthColor(pl.level)}`
                  }}
                >
                  {pl.code}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Code panel */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] shadow-[0_10px_24px_rgba(2,4,10,0.35)] overflow-hidden">
        <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-white-3)]">
          <span className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
            Code
          </span>
          <span className="px-[var(--spacing-sm)] py-0.5 rounded-full text-2xs font-semibold text-black" style={{ background: getPhaseColor(currentStep.phase) }}>
            {getPhaseLabel(currentStep.phase)}
          </span>
        </div>
        <pre className="m-0 py-[var(--spacing-sm)] max-h-56 overflow-y-auto">
          {currentExample.code.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el }}
              className={`flex px-[var(--spacing-sm)] py-0.5 transition-colors ${currentStep.highlightLines.includes(i) ? 'bg-[var(--color-brand-primary-20)]' : ''}`}
            >
              <span className="w-6 text-[var(--color-gray-800)] font-mono text-2xs select-none">{i + 1}</span>
              <span className={`font-mono text-2xs ${currentStep.highlightLines.includes(i) ? 'text-[var(--color-brand-light)]' : 'text-[var(--color-gray-300)]'}`}>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Output Section */}
      <div className="bg-[var(--js-viz-surface)] border border-[var(--js-viz-border)] rounded-[var(--js-viz-radius)] p-[var(--spacing-md)]">
        <div className="inline-flex items-center gap-[5px] px-[var(--spacing-md)] py-[3px] mb-[var(--spacing-sm)] text-2xs font-semibold uppercase tracking-wider text-[var(--js-viz-text)] bg-[var(--js-viz-pill-bg)] border border-[var(--js-viz-pill-border)] rounded-full">
          Output
        </div>
        <div className="font-mono text-sm text-[var(--difficulty-1)] min-h-6">
          {currentStep.output.length === 0 ? (
            <span className="text-[var(--color-gray-800)]">-</span>
          ) : (
            currentStep.output.map((item, i) => (
              <motion.div
                key={i}
                className="py-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${level}-${exampleIndex}-${stepIndex}`}
          className="px-[var(--spacing-md)] py-2.5 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-lg text-base text-[var(--js-viz-muted)] text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
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
      <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-brand-primary-8)] border border-[var(--color-brand-primary-20)] rounded-lg text-xs text-[var(--color-gray-500)] text-center">
        <strong className="text-[var(--color-brand-primary)]">Key Insight:</strong> {currentExample.insight}
      </div>
    </div>
  )
}
