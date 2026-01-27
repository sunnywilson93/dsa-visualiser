import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

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

  return (
    <div className="flex gap-2 justify-center items-center sm:gap-1.5">
      <button
        className="px-3 py-2 text-xs bg-white-5 border border-white-10 rounded-md text-gray-500 cursor-pointer min-h-[44px] touch-manipulation hover:not-disabled:bg-white-10 hover:not-disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed sm:px-2 sm:text-2xs"
        onClick={handlePrev}
        disabled={!canPrev}
      >
        Prev
      </button>

      {showPlayPause && onPlayPause && (
        <button
          className="flex items-center justify-center p-2 bg-white-5 border border-white-10 rounded-md text-gray-500 cursor-pointer min-w-[44px] min-h-[44px] touch-manipulation hover:bg-white-10 hover:text-white"
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      <motion.button
        className="px-4 py-2 text-base font-medium bg-gradient-brand border-none rounded-md text-white cursor-pointer min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={!canNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {computedNextLabel}
      </motion.button>

      <button
        className="px-3 py-2 text-xs bg-white-5 border border-white-10 rounded-md text-gray-500 cursor-pointer min-h-[44px] touch-manipulation hover:not-disabled:bg-white-10 hover:not-disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed sm:px-2 sm:text-2xs"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}
