'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Play, SkipBack, SkipForward, RotateCcw, AlertTriangle, Pause } from 'lucide-react'
import { analyzeEventLoop, EventLoopStep, AnalyzerWarning } from '@/engine/eventLoopAnalyzer'
import { NavBar } from '@/components/NavBar'
import { PlaygroundEditor } from '@/components/EventLoopPlayground/PlaygroundEditor'
import { EventLoopDisplay } from '@/components/EventLoopPlayground/EventLoopDisplay'
import styles from './page.module.css'

interface Example {
  id: string
  title: string
  code: string
}

const examples: Example[] = [
  {
    id: 'promise-vs-timeout',
    title: 'Promise vs setTimeout',
    code: `console.log('1')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve()
  .then(() => console.log('promise'))

console.log('2')`,
  },
  {
    id: 'chained-promises',
    title: 'Chained Promises',
    code: `console.log('start')

Promise.resolve()
  .then(() => console.log('then 1'))
  .then(() => console.log('then 2'))
  .then(() => console.log('then 3'))

console.log('end')`,
  },
  {
    id: 'nested-timeout',
    title: 'Nested setTimeout',
    code: `console.log('start')

setTimeout(() => {
  console.log('outer')
  setTimeout(() => {
    console.log('inner')
  }, 0)
}, 0)

console.log('end')`,
  },
  {
    id: 'micro-in-macro',
    title: 'Microtask in Macrotask',
    code: `console.log('start')

setTimeout(() => {
  console.log('timeout')
  Promise.resolve().then(() => {
    console.log('promise in timeout')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')`,
  },
  {
    id: 'queue-microtask',
    title: 'queueMicrotask',
    code: `console.log('1')

queueMicrotask(() => {
  console.log('microtask 1')
  queueMicrotask(() => {
    console.log('microtask 2')
  })
})

console.log('2')`,
  },
]

export default function EventLoopPlaygroundClient() {
  const [code, setCode] = useState(examples[0].code)
  const [steps, setSteps] = useState<EventLoopStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [warnings, setWarnings] = useState<AnalyzerWarning[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedExample, setSelectedExample] = useState(examples[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentStep = steps[currentStepIndex]

  const handleAnalyze = useCallback(() => {
    setIsPlaying(false)
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
    }

    const result = analyzeEventLoop(code)

    if (!result.success) {
      setError(result.error ?? 'Analysis failed')
      setSteps([])
      setWarnings([])
      return
    }

    setError(null)
    setSteps(result.steps)
    setWarnings(result.warnings)
    setCurrentStepIndex(0)
  }, [code])

  const handleExampleChange = (exampleId: string) => {
    const example = examples.find(e => e.id === exampleId)
    if (example) {
      setSelectedExample(exampleId)
      setCode(example.code)
      setSteps([])
      setCurrentStepIndex(0)
      setError(null)
      setWarnings([])
      setIsPlaying(false)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1)
    }
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1)
    }
  }

  const handleReset = () => {
    setCurrentStepIndex(0)
    setIsPlaying(false)
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
    } else {
      if (currentStepIndex >= steps.length - 1) {
        setCurrentStepIndex(0)
      }
      setIsPlaying(true)
    }
  }

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex(i => {
          if (i >= steps.length - 1) {
            setIsPlaying(false)
            return i
          }
          return i + 1
        })
      }, 1000)
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
    }
  }, [isPlaying, steps.length])

  // Stop playing when reaching the end
  useEffect(() => {
    if (currentStepIndex >= steps.length - 1 && isPlaying) {
      setIsPlaying(false)
    }
  }, [currentStepIndex, steps.length, isPlaying])

  return (
    <>
      <NavBar breadcrumbs={[
        { label: 'Playground' },
        { label: 'Event Loop' }
      ]} />
      <div className={styles.container}>
        <header className={styles.header}>
        <h1 className={styles.title}>Event Loop Playground</h1>
        <p className={styles.subtitle}>
          Write JavaScript code and visualize how the event loop processes it
        </p>
      </header>

      {/* Example selector */}
      <div className={styles.exampleSelector}>
        <span className={styles.exampleLabel}>Examples:</span>
        <div className={styles.exampleButtons}>
          {examples.map(ex => (
            <button
              key={ex.id}
              className={`${styles.exampleBtn} ${selectedExample === ex.id ? styles.active : ''}`}
              onClick={() => handleExampleChange(ex.id)}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Left side: Editor */}
        <div className={styles.editorSection}>
          <PlaygroundEditor
            code={code}
            onChange={setCode}
            onAnalyze={handleAnalyze}
            currentLine={currentStep?.codeLine}
            error={error}
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className={styles.warnings}>
              <div className={styles.warningsHeader}>
                <AlertTriangle size={14} />
                <span>Limitations</span>
              </div>
              <ul className={styles.warningsList}>
                {warnings.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right side: Visualization */}
        <div className={styles.vizSection}>
          {steps.length > 0 && currentStep ? (
            <EventLoopDisplay step={currentStep} />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⚡</div>
              <p>Click <strong>Analyze</strong> to visualize the event loop</p>
              <p className={styles.emptyHint}>
                Or select an example above to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {steps.length > 0 && (
        <div className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            className={styles.controlBtn}
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            title="Previous step"
          >
            <SkipBack size={16} />
          </button>
          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className={styles.controlBtn}
            onClick={handleNext}
            disabled={currentStepIndex >= steps.length - 1}
            title="Next step"
          >
            <SkipForward size={16} />
          </button>
          <div className={styles.stepCounter}>
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      )}

        {/* Step description */}
        {steps.length > 0 && currentStep && (
          <div className={styles.description}>
            <span className={styles.phaseBadge} data-phase={currentStep.phase}>
              {currentStep.phase === 'sync' ? 'Sync' :
               currentStep.phase === 'micro' ? 'Microtask' :
               currentStep.phase === 'macro' ? 'Macrotask' : 'Idle'}
            </span>
            <span className={styles.descriptionText}>{currentStep.description}</span>
          </div>
        )}
      </div>
    </>
  )
}
