'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Lightbulb } from 'lucide-react'
import type { ConceptStep, ConceptType } from '@/types'
import { useKeyboardShortcuts } from '@/hooks'
import type { ShortcutMap } from '@/hooks'
import { TwoPointersConcept } from './TwoPointersConcept'
import { BitManipulationConcept } from './BitManipulationConcept'

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

  // Keyboard shortcuts (unified with rest of app)
  const shortcuts = useMemo<ShortcutMap>(() => ({
    'ArrowRight': {
      action: handleNext,
      description: 'Next step',
      group: 'Navigation',
    },
    'ArrowLeft': {
      action: handlePrev,
      description: 'Previous step',
      group: 'Navigation',
    },
    'Space': {
      action: handlePlayPause,
      description: 'Play / Pause',
      group: 'Playback',
    },
    'Escape': {
      action: handleReset,
      description: 'Reset',
      group: 'Navigation',
    },
  }), [handleNext, handlePrev, handlePlayPause, handleReset])

  useKeyboardShortcuts(shortcuts)

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
    <div className="relative flex flex-col gap-0 p-[3px] bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-xl">
      <div className="flex flex-col gap-3 p-4 bg-[var(--color-bg-page-secondary)] rounded-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Lightbulb size={16} className="text-amber-400" style={{ filter: 'drop-shadow(var(--glow-xs) var(--color-amber-40))' }} />
            <h3 className="text-base font-semibold text-white m-0">{title}</h3>
          </div>
        </div>

        <div className="relative flex flex-col gap-1 p-[3px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
          <div className="p-2 bg-[var(--color-bg-page-secondary)] rounded-lg">
            <span className="text-2xs font-semibold uppercase tracking-wide text-amber-400">Key Insight</span>
            <p className="text-sm font-medium text-white m-0 font-mono">{keyInsight}</p>
          </div>
        </div>

        <div className="relative min-h-[180px] flex flex-col p-[3px] bg-[var(--gradient-brand)] rounded-lg">
          <div className="flex-1 flex flex-col bg-[var(--color-bg-page-secondary)] rounded-lg p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-semibold px-2 py-0.5 bg-[var(--color-brand-primary-30)] border border-[var(--color-brand-primary-50)] text-[var(--color-brand-light)] rounded-full shadow-[var(--glow-md)_var(--color-brand-primary-20)]">
                    Step {currentStep + 1}
                  </span>
                  <span className="text-base font-semibold text-white">{step.title}</span>
                </div>

                <div className="flex-1 flex items-center justify-center p-2 bg-black/30 border border-dashed border-white/10 rounded-lg min-h-[100px]">
                  {renderVisualization()}
                </div>

                <p className="text-sm text-gray-400 m-0 leading-normal">{step.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center justify-center w-7 h-7 bg-white/5 border border-white/15 rounded-md text-gray-400 hover:not-disabled:bg-[var(--color-brand-primary-15)] hover:not-disabled:border-[var(--color-brand-primary-40)] hover:not-disabled:text-white hover:not-disabled:shadow-[var(--glow-md)_var(--color-brand-primary-20)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              onClick={handleReset}
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>

            <button
              className="flex items-center justify-center w-7 h-7 bg-white/5 border border-white/15 rounded-md text-gray-400 hover:not-disabled:bg-[var(--color-brand-primary-15)] hover:not-disabled:border-[var(--color-brand-primary-40)] hover:not-disabled:text-white hover:not-disabled:shadow-[var(--glow-md)_var(--color-brand-primary-20)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              onClick={handlePrev}
              disabled={currentStep === 0}
              title="Previous (←)"
            >
              <SkipBack size={14} />
            </button>

            <button
              className="flex items-center justify-center w-[34px] h-[34px] bg-[var(--gradient-brand)] rounded-md text-white shadow-[var(--glow-xl)_var(--color-brand-primary-40)] hover:shadow-[var(--glow-2xl)_var(--color-brand-primary-50)] hover:scale-105 transition-all duration-150 border-0"
              onClick={handlePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              className="flex items-center justify-center w-7 h-7 bg-white/5 border border-white/15 rounded-md text-gray-400 hover:not-disabled:bg-[var(--color-brand-primary-15)] hover:not-disabled:border-[var(--color-brand-primary-40)] hover:not-disabled:text-white hover:not-disabled:shadow-[var(--glow-md)_var(--color-brand-primary-20)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              onClick={handleNext}
              disabled={currentStep === totalSteps - 1}
              title="Next (→)"
            >
              <SkipForward size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-1 bg-white/10 rounded-xs overflow-hidden">
              <div
                className="h-full bg-[var(--gradient-brand)] rounded-xs shadow-[var(--glow-md)_var(--color-brand-primary-50)] transition-all duration-150"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-2xs font-mono text-gray-600 whitespace-nowrap">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-2xs font-semibold uppercase text-gray-600 hidden sm:inline">Speed:</span>
            <div className="flex gap-0.5 bg-white/5 border border-white/10 rounded-full p-[3px]">
              {[
                { label: '0.5x', value: 2500 },
                { label: '1x', value: 1500 },
                { label: '2x', value: 750 },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  className={`
                    px-2.5 py-0.5 text-2xs font-medium rounded-full transition-all duration-150
                    ${playbackSpeed === value 
                      ? 'bg-[var(--color-brand-primary-20)] border border-[var(--color-brand-primary-50)] text-white shadow-[var(--glow-md)_var(--color-brand-primary-25)]' 
                      : 'text-gray-600 hover:text-gray-400 bg-transparent border border-transparent'
                    }
                  `}
                  onClick={() => setPlaybackSpeed(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
