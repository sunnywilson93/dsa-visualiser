import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useKeyboardShortcuts } from '@/hooks'
import type { ShortcutMap } from '@/hooks'

export interface StepControlsProps {
  onPrev: () => void
  onNext: () => void
  onReset: () => void
  canPrev: boolean
  canNext: boolean
  prevLabel?: string
  nextLabel?: string
  isPlaying?: boolean
  onPlayPause?: () => void
  showPlayPause?: boolean
  /** Show step counter between prev and next */
  stepInfo?: { current: number; total: number }
}

export function StepControls({
  onPrev,
  onNext,
  onReset,
  canPrev,
  canNext,
  prevLabel = 'Prev',
  nextLabel,
  isPlaying = false,
  onPlayPause,
  showPlayPause = false,
  stepInfo,
}: StepControlsProps) {
  const computedNextLabel = nextLabel ?? (canNext ? 'Next' : 'Done')

  // Keyboard shortcuts for all concept visualizations
  const shortcuts = useMemo<ShortcutMap>(() => ({
    'ArrowRight': {
      action: () => { if (canNext) onNext() },
      description: 'Next step',
      group: 'Navigation',
    },
    'ArrowLeft': {
      action: () => { if (canPrev) onPrev() },
      description: 'Previous step',
      group: 'Navigation',
    },
    'Space': {
      action: () => {
        if (onPlayPause) onPlayPause()
        else if (canNext) onNext()
      },
      description: onPlayPause ? 'Play / Pause' : 'Next step',
      group: 'Playback',
    },
    'Escape': {
      action: onReset,
      description: 'Reset',
      group: 'Navigation',
    },
  }), [canNext, canPrev, onNext, onPrev, onPlayPause, onReset])

  const handlePrev = () => {
    if (isPlaying && onPlayPause) {
      onPlayPause()
    }
    onPrev()
  }

  const handleNext = () => {
    if (isPlaying && onPlayPause) {
      onPlayPause()
    }
    onNext()
  }

  const handleReset = () => {
    if (isPlaying && onPlayPause) {
      onPlayPause()
    }
    onReset()
  }

  useKeyboardShortcuts(shortcuts)

  const secondaryButtonClass = cn(
    'flex items-center justify-center gap-1 px-3 py-2 text-sm min-h-[44px]',
    'bg-white-5 border border-white-10 rounded-md text-text-muted',
    'cursor-pointer touch-manipulation transition-colors',
    'hover:not-disabled:bg-white-10 hover:not-disabled:text-text-bright',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  )

  const primaryButtonClass = cn(
    'flex items-center justify-center gap-1 px-5 py-2 text-base min-h-[44px]',
    'font-medium bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] border-none rounded-md text-white',
    'cursor-pointer touch-manipulation',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  )

  return (
    <div className="flex justify-center items-center gap-3">
      <button
        className={secondaryButtonClass}
        onClick={handlePrev}
        disabled={!canPrev}
      >
        <ChevronLeft size={16} />
        {prevLabel}
      </button>

      {stepInfo && (
        <span className="text-sm text-text-muted tabular-nums min-w-[48px] text-center">
          {stepInfo.current} / {stepInfo.total}
        </span>
      )}

      {showPlayPause && onPlayPause && (
        <button
          className={cn(secondaryButtonClass, 'px-2')}
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      <button
        className={secondaryButtonClass}
        onClick={handleReset}
      >
        <RotateCcw size={14} />
        Reset
      </button>

      <motion.button
        className={primaryButtonClass}
        onClick={handleNext}
        disabled={!canNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {computedNextLabel}
        {canNext && <ChevronRight size={16} className="inline" />}
      </motion.button>
    </div>
  )
}
