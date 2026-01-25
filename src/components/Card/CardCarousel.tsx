'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CardCarousel.module.css'

interface CardCarouselProps {
  children: ReactNode
  itemCount: number
}

export function CardCarousel({ children, itemCount }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    const cardWidth = container.firstElementChild?.clientWidth || 300
    const gap = 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(newIndex, itemCount - 1))
  }, [itemCount])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()

    return () => container.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const cardWidth = container.firstElementChild?.clientWidth || 300
    const gap = 16
    const scrollAmount = cardWidth + gap

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return

    const cardWidth = container.firstElementChild?.clientWidth || 300
    const gap = 16

    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    })
  }

  return (
    <div className={styles.carouselContainer}>
      <button
        className={`${styles.navButton} ${styles.navLeft}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className={`${styles.navButton} ${styles.navRight}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      <div className={styles.scrollContainer} ref={scrollRef}>
        {children}
      </div>

      <div className={styles.dots}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
