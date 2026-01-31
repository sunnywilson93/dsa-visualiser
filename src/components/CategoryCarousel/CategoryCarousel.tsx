'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    const card = container.firstElementChild as HTMLElement | null
    if (card) {
      const cardWidth = card.offsetWidth
      const gap = 16
      const newIndex = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(newIndex, children.length - 1))
    }
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

    const card = container.firstElementChild as HTMLElement | null
    if (card) {
      const cardWidth = card.offsetWidth
      const gap = 16
      const scrollAmount = cardWidth + gap

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return

    const card = container.firstElementChild as HTMLElement | null
    if (card) {
      const cardWidth = card.offsetWidth
      const gap = 16

      container.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative group">
      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border-none bg-black-50 text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 -left-3 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-10 max-md:h-10 max-sm:hidden"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous category"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border-none bg-black-50 text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 -right-3 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-10 max-md:h-10 max-sm:hidden"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next category"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable cards */}
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-2 -mx-2 scrollbar-hide max-sm:py-2 max-sm:px-0 max-sm:mx-0"
        ref={scrollRef}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-[0_0_calc(25%-12px)] snap-start transition-all duration-300 max-lg:flex-[0_0_calc(33.333%-11px)] max-md:flex-[0_0_calc(50%-8px)] max-sm:flex-[0_0_calc(100vw-32px)]"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Progress dots */}
      {children.length > 4 && (
        <div className="flex justify-center gap-2 mt-3">
          {children.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-all duration-200 p-0 ${
                index === activeIndex
                  ? 'bg-gradient-to-br from-brand-primary to-brand-secondary w-[18px] rounded-sm shadow-[0_0_6px_var(--color-brand-primary-50)]'
                  : 'bg-brand-primary-30 hover:bg-brand-primary-50'
              }`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
