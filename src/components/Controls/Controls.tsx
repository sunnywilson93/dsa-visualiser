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
} from 'lucide-react'
import { useExecutionStore, useExecutionProgress, useCurrentStep } from '@/store'
import type { PlaybackSpeed } from '@/types'
import styles from './Controls.module.css'

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

  const handleRun = () => {
    if (status === 'idle') {
      startExecution()
    }
  }

  const isIdle = status === 'idle'
  const isCompleted = status === 'completed'
  const canStepForward = !isIdle && current < total - 1
  const canStepBackward = !isIdle && current > 0

  return (
    <div className={styles.container}>
      {/* Main controls */}
      <div className={styles.mainControls}>
        {/* Run button (only when idle) */}
        {isIdle && (
          <motion.button
            className={`${styles.runButton}`}
            onClick={handleRun}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap size={16} />
            <span>Run Code</span>
          </motion.button>
        )}

        {/* Playback controls (when running) */}
        {!isIdle && (
          <>
            <button
              className={styles.iconBtn}
              onClick={reset}
              title="Reset (Esc)"
            >
              <RotateCcw size={16} />
            </button>

            <button
              className={styles.iconBtn}
              onClick={stepBackward}
              disabled={!canStepBackward}
              title="Step Back (←)"
            >
              <SkipBack size={16} />
            </button>

            <button
              className={`${styles.iconBtn} ${styles.primary}`}
              onClick={togglePlayback}
              disabled={isCompleted}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              className={styles.iconBtn}
              onClick={stepForward}
              disabled={!canStepForward}
              title="Step Forward (→)"
            >
              <SkipForward size={16} />
            </button>

            <button
              className={styles.iconBtn}
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
        <div className={styles.timeline}>
          <div className={styles.timelineInfo}>
            <span className={styles.stepCounter}>
              Step {current + 1} / {total}
            </span>
            {currentStep && (
              <span className={styles.stepDescription}>
                {currentStep.description}
              </span>
            )}
          </div>

          <div className={styles.sliderContainer}>
            <input
              type="range"
              min={0}
              max={Math.max(0, total - 1)}
              value={current}
              onChange={handleSliderChange}
              className={styles.slider}
            />
            <div
              className={styles.sliderProgress}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Speed control */}
      {!isIdle && (
        <div className={styles.speedControl}>
          <span className={styles.speedLabel}>Speed:</span>
          <div className={styles.speedButtons}>
            {(['slow', 'medium', 'fast'] as PlaybackSpeed[]).map(speed => (
              <button
                key={speed}
                className={`${styles.speedBtn} ${
                  playbackSpeed === speed ? styles.active : ''
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

      {/* Keyboard hints */}
      <div className={styles.hints}>
        <span className={styles.hint}>
          <kbd>Space</kbd> {isIdle ? 'Run' : 'Play/Pause'}
        </span>
        <span className={styles.hint}>
          <kbd>←</kbd><kbd>→</kbd> Step
        </span>
        <span className={styles.hint}>
          <kbd>Esc</kbd> Reset
        </span>
      </div>
    </div>
  )
}
