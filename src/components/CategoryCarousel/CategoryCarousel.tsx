'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CategoryCarousel.module.css'

interface CategoryCarouselProps {
  children: ReactNode[]
}

export function CategoryCarousel({ children }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calculate active index based on scroll position
    const cardWidth = container.firstElementChild?.clientWidth || 280
    const gap = 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(newIndex, children.length - 1))
  }, [children.length])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()

    // Check on resize
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const cardWidth = container.firstElementChild?.clientWidth || 280
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

    const cardWidth = container.firstElementChild?.clientWidth || 280
    const gap = 16

    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    })
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Navigation arrows */}
      <button
        className={`${styles.navButton} ${styles.navLeft}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous category"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className={`${styles.navButton} ${styles.navRight}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next category"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable cards */}
      <div className={styles.scrollContainer} ref={scrollRef}>
        {children.map((child, index) => (
          <div
            key={index}
            className={`${styles.cardWrapper} ${index === activeIndex ? styles.active : ''}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Progress dots */}
      {children.length > 4 && (
        <div className={styles.dots}>
          {children.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
