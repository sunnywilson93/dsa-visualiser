import { useState, useRef, useEffect, useCallback } from 'react'

export interface UseAutoPlayOptions {
  speed?: number
  onEnd?: () => void
}

export function useAutoPlay(
  totalSteps: number,
  currentStep: number,
  setStep: (step: number) => void,
  options?: UseAutoPlayOptions
) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(options?.speed ?? 1000)

  const currentStepRef = useRef(currentStep)
  const setStepRef = useRef(setStep)
  const onEndRef = useRef(options?.onEnd)

  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  useEffect(() => {
    setStepRef.current = setStep
  }, [setStep])

  useEffect(() => {
    onEndRef.current = options?.onEnd
  }, [options?.onEnd])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const current = currentStepRef.current
      const lastStep = totalSteps - 1

      if (current >= lastStep) {
        onEndRef.current?.()
        setIsPlaying(false)
        return
      }

      setStepRef.current(current + 1)
    }, speed)

    return () => clearInterval(interval)
  }, [isPlaying, speed, totalSteps])

  return {
    isPlaying,
    play,
    pause,
    toggle,
    speed,
    setSpeed,
  }
}
