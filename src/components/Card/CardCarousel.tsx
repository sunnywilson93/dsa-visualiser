'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CardCarouselProps {
  children: ReactNode
  itemCount: number
}

function getCardMetrics(container: HTMLDivElement) {
  const card = container.firstElementChild as HTMLElement | null
  if (!card) return null
  const cardWidth = card.offsetWidth
  const cardStyle = window.getComputedStyle(card)
  const cardMarginRight = parseFloat(cardStyle.marginRight) || 0
  const cardMarginLeft = parseFloat(cardStyle.marginLeft) || 0
  const gap = cardMarginRight + cardMarginLeft + 16
  return { cardWidth, gap, fullWidth: cardWidth + gap }
}

export function CardCarousel({ children, itemCount }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const totalPages = Math.max(1, Math.ceil(itemCount / visibleCards))
  const activePage = Math.min(
    Math.floor(activeIndex / visibleCards),
    totalPages - 1
  )
  const showDots = totalPages > 1
  const showArrows = itemCount > 1

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    const metrics = getCardMetrics(container)
    if (metrics) {
      const visible = Math.max(1, Math.floor(clientWidth / metrics.fullWidth))
      setVisibleCards(visible)
      const newIndex = Math.round(scrollLeft / metrics.fullWidth)
      setActiveIndex(Math.min(newIndex, itemCount - 1))
    }
  }, [itemCount])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()

    const ro = new ResizeObserver(updateScrollState)
    ro.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const metrics = getCardMetrics(container)
    if (metrics) {
      container.scrollBy({
        left: direction === 'left' ? -metrics.fullWidth : metrics.fullWidth,
        behavior: 'smooth'
      })
    }
  }

  const scrollToPage = (page: number) => {
    const container = scrollRef.current
    if (!container) return

    const metrics = getCardMetrics(container)
    if (metrics) {
      container.scrollTo({
        left: page * visibleCards * metrics.fullWidth,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={`relative${showArrows ? ' group' : ''}`}>
      {showArrows && (
        <>
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
        </>
      )}

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

      {showDots && (
        <div className="flex justify-center gap-2 mt-4 max-sm:mt-3">
          {Array.from({ length: totalPages }).map((_, page) => (
            <button
              key={page}
              className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-200 p-0 ${
                page === activePage
                  ? 'bg-gradient-to-br from-brand-primary to-brand-secondary w-6 rounded-sm shadow-[0_0_8px_var(--color-brand-primary-50)]'
                  : 'bg-brand-primary-30 hover:bg-brand-primary-50'
              }`}
              onClick={() => scrollToPage(page)}
              aria-label={`Go to page ${page + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
