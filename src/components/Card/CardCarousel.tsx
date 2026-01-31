'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="relative group">
      <button
        className="absolute top-1/2 -translate-y-[60%] z-10 w-10 h-10 rounded-full border-none bg-[rgba(15,15,26,0.9)] text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 left-2 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-9 max-md:h-9 max-sm:hidden"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute top-1/2 -translate-y-[60%] z-10 w-10 h-10 rounded-full border-none bg-[rgba(15,15,26,0.9)] text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 right-2 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-9 max-md:h-9 max-sm:hidden"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 scrollbar-hide"
          ref={scrollRef}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 max-sm:mt-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-200 p-0 ${
              index === activeIndex
                ? 'bg-gradient-to-br from-brand-primary to-brand-secondary w-6 rounded-sm shadow-[0_0_8px_var(--color-brand-primary-50)]'
                : 'bg-brand-primary-30 hover:bg-brand-primary-50'
            }`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
