'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, Sparkles } from 'lucide-react'
import { useExecutionStore, useExecutionProgress, useCurrentStep } from '@/store'
import type { PlaybackSpeed } from '@/types'

const SPEED_MS: Record<PlaybackSpeed, number> = {
  slow: 1000,
  medium: 400,
  fast: 100,
}

export function ExecutionBar() {
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
        if (status !== 'idle') stepForward()
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (status !== 'idle') stepBackward()
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

  const isIdle = status === 'idle'
  const isCompleted = status === 'completed'
  const canStepForward = !isIdle && current < total - 1
  const canStepBackward = !isIdle && current > 0

  if (isIdle) {
    return (
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-bg-secondary border-t border-border-primary text-sm text-text-muted">
        <span>Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">Space</kbd> to start</span>
        <span>•</span>
        <span><kbd className="px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">←</kbd> <kbd className="px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">→</kbd> to step</span>
        <span>•</span>
        <span><kbd className="px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">Esc</kbd> to reset</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-bg-secondary border-t border-border-primary">
      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-accent-red hover:bg-red-8 transition-all duration-150"
          onClick={reset}
          title="Reset (Esc)"
        >
          <RotateCcw size={16} />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary-10 transition-all duration-150 disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent"
          onClick={stepBackward}
          disabled={!canStepBackward}
          title="Step Back (←)"
        >
          <SkipBack size={16} />
        </button>

        <button
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white hover:brightness-110 transition-all duration-150 disabled:opacity-50 shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-105 active:scale-95"
          onClick={togglePlayback}
          disabled={isCompleted}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary-10 transition-all duration-150 disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent"
          onClick={stepForward}
          disabled={!canStepForward}
          title="Step Forward (→)"
        >
          <SkipForward size={16} />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-emerald-400 hover:bg-emerald-8 transition-all duration-150 disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent"
          onClick={runToCompletion}
          disabled={isCompleted}
          title="Run to End"
        >
          <Sparkles size={16} />
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-xs font-mono text-brand-primary whitespace-nowrap">
          Step {current + 1}/{total}
        </span>
        <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(0, total - 1)}
            value={current}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
          />
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-[width] duration-100"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-0.5">
        {(['slow', 'medium', 'fast'] as PlaybackSpeed[]).map(speed => (
          <button
            key={speed}
            className={`py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              playbackSpeed === speed
                ? 'bg-brand-primary text-white'
                : 'text-text-muted hover:text-text-secondary'
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
  )
}
