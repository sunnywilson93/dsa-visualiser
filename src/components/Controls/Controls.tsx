'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Zap,
  Eye,
} from 'lucide-react'
import { useExecutionStore, useExecutionProgress, useCurrentStep } from '@/store'
import type { PlaybackSpeed } from '@/types'

const SPEED_MS: Record<PlaybackSpeed, number> = {
  slow: 1000,
  medium: 400,
  fast: 100,
}

export function Controls() {
  const intervalRef = useRef<number | null>(null)

  const status = useExecutionStore(state => state.status)
  const isPlaying = useExecutionStore(state => state.isPlaying)
  const playbackSpeed = useExecutionStore(state => state.playbackSpeed)

  const startExecution = useExecutionStore(state => state.startExecution)
  const stepForward = useExecutionStore(state => state.stepForward)
  const stepBackward = useExecutionStore(state => state.stepBackward)
  const pause = useExecutionStore(state => state.pause)
  const reset = useExecutionStore(state => state.reset)
  const togglePlayback = useExecutionStore(state => state.togglePlayback)
  const setPlaybackSpeed = useExecutionStore(state => state.setPlaybackSpeed)
  const jumpToStep = useExecutionStore(state => state.jumpToStep)
  const runToCompletion = useExecutionStore(state => state.runToCompletion)

  const { current, total, percentage } = useExecutionProgress()
  const currentStep = useCurrentStep()

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && status === 'running') {
      intervalRef.current = window.setInterval(() => {
        const { currentStep, steps } = useExecutionStore.getState()
        if (currentStep < steps.length - 1) {
          stepForward()
        } else {
          pause()
        }
      }, SPEED_MS[playbackSpeed])
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, status, playbackSpeed, stepForward, pause])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key) {
      case ' ':
        e.preventDefault()
        if (status === 'idle') {
          startExecution()
        } else {
          togglePlayback()
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (status !== 'idle') {
          stepForward()
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (status !== 'idle') {
          stepBackward()
        }
        break
      case 'Escape':
        e.preventDefault()
        reset()
        break
    }
  }, [status, startExecution, togglePlayback, stepForward, stepBackward, reset])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value, 10)
    jumpToStep(step)
  }

  const handleRun = async () => {
    if (status === 'idle') {
      await startExecution()
      // Jump to end immediately after execution
      runToCompletion()
    }
  }

  const handleVisualize = async () => {
    if (status === 'idle') {
      await startExecution()
      // Stay at step 0 for visualization
    }
  }

  const isIdle = status === 'idle'
  const isCompleted = status === 'completed'
  const canStepForward = !isIdle && current < total - 1
  const canStepBackward = !isIdle && current > 0

  return (
    <div className="flex flex-col gap-3 p-3 px-4 bg-bg-secondary border border-border-primary rounded-lg">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Single Run button (only when idle) */}
        {isIdle && (
          <motion.button
            className="flex items-center gap-2 py-2 px-6 font-semibold text-base rounded-md border-none cursor-pointer transition-all duration-150 text-white bg-gradient-to-br from-accent-blue to-accent-purple hover:brightness-110 hover:-translate-y-0.5"
            onClick={handleVisualize}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Run and visualize code step by step"
          >
            <Play size={18} />
            <span>Run & Visualize</span>
          </motion.button>
        )}

        {/* Playback controls (when running) */}
        {!isIdle && (
          <>
            <button
              className="flex items-center justify-center w-10 h-10 bg-bg-tertiary border border-border-primary rounded-md text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary"
              onClick={reset}
              title="Reset (Esc)"
            >
              <RotateCcw size={16} />
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 bg-bg-tertiary border border-border-primary rounded-md text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={stepBackward}
              disabled={!canStepBackward}
              title="Step Back (←)"
            >
              <SkipBack size={16} />
            </button>

            <button
              className="flex items-center justify-center w-12 h-12 bg-accent-blue border border-accent-blue text-white rounded-md cursor-pointer transition-all duration-150 hover:brightness-115 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={togglePlayback}
              disabled={isCompleted}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 bg-bg-tertiary border border-border-primary rounded-md text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={stepForward}
              disabled={!canStepForward}
              title="Step Forward (→)"
            >
              <SkipForward size={16} />
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 bg-bg-tertiary border border-border-primary rounded-md text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={runToCompletion}
              disabled={isCompleted}
              title="Run to End"
            >
              <FastForward size={16} />
            </button>
          </>
        )}
      </div>

      {/* Timeline slider */}
      {!isIdle && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-accent-blue whitespace-nowrap">
              Step {current + 1} / {total}
            </span>
            {currentStep && (
              <span className="text-sm text-text-secondary text-right overflow-hidden text-ellipsis whitespace-nowrap">
                {currentStep.description}
              </span>
            )}
          </div>

          <div className="relative h-1.5 bg-bg-tertiary rounded-sm overflow-hidden">
            <input
              type="range"
              min={0}
              max={Math.max(0, total - 1)}
              value={current}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
            />
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-sm transition-[width] duration-100 pointer-events-none"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Speed control */}
      {!isIdle && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-text-muted">Speed:</span>
          <div className="flex gap-0.5 bg-bg-tertiary rounded-sm p-0.5">
            {(['slow', 'medium', 'fast'] as PlaybackSpeed[]).map(speed => (
              <button
                key={speed}
                className={`py-1 px-2.5 text-xs font-medium rounded-sm border-none cursor-pointer transition-all duration-150 ${
                  playbackSpeed === speed
                    ? 'bg-accent-blue text-white'
                    : 'bg-transparent text-text-muted hover:text-text-secondary'
                }`}
                onClick={() => setPlaybackSpeed(speed)}
              >
                {speed === 'slow' && '0.5x'}
                {speed === 'medium' && '1x'}
                {speed === 'fast' && '2x'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
