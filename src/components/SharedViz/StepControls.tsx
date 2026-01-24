import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import styles from './StepControls.module.css'

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
    <div className={styles.controls}>
      <button
        className={styles.btnSecondary}
        onClick={handlePrev}
        disabled={!canPrev}
      >
        Prev
      </button>

      {showPlayPause && onPlayPause && (
        <button
          className={styles.playPauseBtn}
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      <motion.button
        className={styles.btnPrimary}
        onClick={handleNext}
        disabled={!canNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {computedNextLabel}
      </motion.button>

      <button
        className={styles.btnSecondary}
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}
