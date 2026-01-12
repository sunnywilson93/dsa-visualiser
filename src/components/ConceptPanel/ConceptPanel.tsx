import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Lightbulb } from 'lucide-react'
import type { ConceptStep, ConceptType } from '@/types'
import { TwoPointersConcept } from './TwoPointersConcept'
import { BitManipulationConcept } from './BitManipulationConcept'
import styles from './ConceptPanel.module.css'

interface ConceptPanelProps {
  title: string
  keyInsight: string
  type: ConceptType
  steps: ConceptStep[]
  onClose?: () => void
}

export function ConceptPanel({
  title,
  keyInsight,
  type,
  steps,
}: ConceptPanelProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1500) // ms per step

  const step = steps[currentStep]
  const totalSteps = steps.length

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, playbackSpeed)

    return () => clearInterval(timer)
  }, [isPlaying, totalSteps, playbackSpeed])

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))
  }, [totalSteps])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0)
    }
    setIsPlaying((prev) => !prev)
  }, [currentStep, totalSteps])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight' && e.shiftKey) {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  const renderVisualization = () => {
    switch (type) {
      case 'two-pointers-converge':
      case 'two-pointers-same-dir':
      case 'two-pointers-partition':
        return <TwoPointersConcept step={step} type={type} />
      case 'bit-manipulation':
        return <BitManipulationConcept step={step} />
      default:
        return <TwoPointersConcept step={step} type={type} />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Lightbulb size={16} className={styles.icon} />
          <h3 className={styles.title}>{title}</h3>
        </div>
      </div>

      <div className={styles.insightBox}>
        <span className={styles.insightLabel}>Key Insight</span>
        <p className={styles.insightText}>{keyInsight}</p>
      </div>

      <div className={styles.visualizationArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>Step {currentStep + 1}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>

            <div className={styles.visualization}>
              {renderVisualization()}
            </div>

            <p className={styles.stepDescription}>{step.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <div className={styles.playbackControls}>
          <button
            className={styles.controlBtn}
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>

          <button
            className={styles.controlBtn}
            onClick={handlePrev}
            disabled={currentStep === 0}
            title="Previous (Shift+Left)"
          >
            <SkipBack size={14} />
          </button>

          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            className={styles.controlBtn}
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            title="Next (Shift+Right)"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        <div className={styles.speedControl}>
          <span className={styles.speedLabel}>Speed:</span>
          <div className={styles.speedButtons}>
            {[
              { label: '0.5x', value: 2500 },
              { label: '1x', value: 1500 },
              { label: '2x', value: 750 },
            ].map(({ label, value }) => (
              <button
                key={label}
                className={`${styles.speedBtn} ${playbackSpeed === value ? styles.active : ''}`}
                onClick={() => setPlaybackSpeed(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
