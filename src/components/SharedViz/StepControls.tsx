import { motion } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface StepControlsProps {
  onPrev: () => void
  onNext: () => void
  onReset: () => void
  canPrev: boolean
  canNext: boolean
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
  nextLabel,
  isPlaying = false,
  onPlayPause,
  showPlayPause = false,
  stepInfo,
}: StepControlsProps) {
  const computedNextLabel = nextLabel ?? (canNext ? 'Next' : 'Done')

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

  const secondaryButtonClass = cn(
    'flex items-center justify-center gap-1 px-3 py-2 text-sm min-h-[44px]',
    'bg-white/5 border border-white/10 rounded-md text-gray-400',
    'cursor-pointer touch-manipulation transition-colors',
    'hover:not-disabled:bg-white/10 hover:not-disabled:text-white',
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
        Prev
      </button>

      {stepInfo && (
        <span className="text-sm text-gray-500 tabular-nums min-w-[48px] text-center">
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
