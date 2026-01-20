'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import type { Concept } from '@/data/concepts'
import styles from './ConceptCarousel.module.css'

interface ConceptCarouselProps {
  concepts: Concept[]
  basePath?: string
}

export function ConceptCarousel({ concepts, basePath = '/concepts' }: ConceptCarouselProps) {
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

    // Calculate active index based on scroll position
    const cardWidth = container.firstElementChild?.clientWidth || 300
    const gap = 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(newIndex, concepts.length - 1))
  }, [concepts.length])

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
      {/* Navigation arrows */}
      <button
        className={`${styles.navButton} ${styles.navLeft}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous concept"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className={`${styles.navButton} ${styles.navRight}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next concept"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable cards */}
      <div className={styles.scrollContainer} ref={scrollRef}>
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.id}
            className={`${styles.cardWrapper} ${index === activeIndex ? styles.active : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`${basePath}/${concept.id}`} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>
                    <ConceptIcon conceptId={concept.id} size={32} />
                  </span>
                  <DifficultyIndicator level={concept.difficulty} size="md" />
                </div>
                <h3 className={styles.cardTitle}>{concept.title}</h3>
                <p className={styles.cardDescription}>{concept.shortDescription}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.stat}>
                    {concept.keyPoints.length} key points
                  </span>
                  <span className={styles.stat}>
                    {concept.examples.length} examples
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div className={styles.dots}>
        {concepts.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to concept ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
