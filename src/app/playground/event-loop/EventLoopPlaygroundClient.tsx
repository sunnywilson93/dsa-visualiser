'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Play, SkipBack, SkipForward, RotateCcw, AlertTriangle, Pause } from 'lucide-react'
import { analyzeEventLoop, EventLoopStep, AnalyzerWarning } from '@/engine/eventLoopAnalyzer'
import { NavBar } from '@/components/NavBar'
import { PlaygroundEditor } from '@/components/EventLoopPlayground/PlaygroundEditor'
import { EventLoopDisplay } from '@/components/EventLoopPlayground/EventLoopDisplay'


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
      <div className="flex flex-col gap-5 container-wide mx-auto p-6 text-text-primary max-[600px]:p-4">
        <header className="text-center mb-2">
        <h1 className="text-2xl font-bold m-0 mb-2 bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent">Event Loop Playground</h1>
        <p className="text-base text-text-secondary m-0">
          Write JavaScript code and visualize how the event loop processes it
        </p>
      </header>

      {/* Example selector */}
      <div className="flex items-center gap-3 flex-wrap justify-center p-3 bg-bg-secondary border border-border-secondary rounded-lg">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Examples:</span>
        <div className="flex gap-2 flex-wrap max-[600px]:justify-center">
          {examples.map(ex => (
            <button
              key={ex.id}
              className={`py-1 px-3 font-sans text-xs bg-white-4 border border-border-secondary rounded-full text-text-muted cursor-pointer transition-all duration-150 hover:bg-white-8 hover:text-text-primary ${selectedExample === ex.id ? 'bg-brand-primary-20 border-brand-primary-50 text-text-bright shadow-[0_0_10px_var(--color-brand-primary-20)]' : ''}`}
              onClick={() => handleExampleChange(ex.id)}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-2 gap-5 min-h-[500px] max-[900px]:grid-cols-1">
        {/* Left side: Editor */}
        <div className="flex flex-col gap-3 min-h-[500px] max-[900px]:min-h-[350px]">
          <PlaygroundEditor
            code={code}
            onChange={setCode}
            onAnalyze={handleAnalyze}
            currentLine={currentStep?.codeLine}
            error={error}
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-3 bg-amber-8 border border-amber-20 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mb-2">
                <AlertTriangle size={14} />
                <span>Limitations</span>
              </div>
              <ul className="m-0 pl-5 text-xs text-text-secondary [&>li]:my-0.5">
                {warnings.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right side: Visualization */}
        <div className="bg-bg-secondary border border-border-secondary rounded-lg p-4 overflow-auto max-[900px]:min-h-[450px]">
          {steps.length > 0 && currentStep ? (
            <EventLoopDisplay step={currentStep} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
              <div className="text-5xl mb-6">⚡</div>
              <p>Click <strong>Analyze</strong> to visualize the event loop</p>
              <p className="text-sm opacity-70">
                Or select an example above to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-3 p-3 bg-bg-secondary border border-border-secondary rounded-lg">
          <button
            className="flex items-center justify-center w-9 h-9 bg-white-5 border border-border-secondary rounded-lg text-text-muted cursor-pointer transition-all duration-150 hover:bg-white-10 hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 bg-white-5 border border-border-secondary rounded-lg text-text-muted cursor-pointer transition-all duration-150 hover:bg-white-10 hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            title="Previous step"
          >
            <SkipBack size={16} />
          </button>
          <button
            className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-brand-primary to-brand-secondary border-none text-white cursor-pointer transition-all duration-150 hover:brightness-110 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 bg-white-5 border border-border-secondary rounded-lg text-text-muted cursor-pointer transition-all duration-150 hover:bg-white-10 hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={currentStepIndex >= steps.length - 1}
            title="Next step"
          >
            <SkipForward size={16} />
          </button>
          <div className="text-sm font-medium text-text-muted min-w-20 text-center">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      )}

        {/* Step description */}
        {steps.length > 0 && currentStep && (
          <div className="flex items-center gap-3 p-3 px-4 bg-bg-secondary border border-border-secondary rounded-lg">
            <span className="py-0.5 px-2.5 rounded-full text-2xs font-semibold text-white flex-shrink-0 [&[data-phase='sync']]:bg-brand-primary [&[data-phase='micro']]:bg-brand-primary [&[data-phase='macro']]:bg-amber-500 [&[data-phase='idle']]:bg-gray-800" data-phase={currentStep.phase}>
              {currentStep.phase === 'sync' ? 'Sync' :
               currentStep.phase === 'micro' ? 'Microtask' :
               currentStep.phase === 'macro' ? 'Macrotask' : 'Idle'}
            </span>
            <span className="text-base text-text-primary">{currentStep.description}</span>
          </div>
        )}
      </div>
    </>
  )
}
