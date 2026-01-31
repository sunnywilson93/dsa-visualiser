'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

interface CarouselConcept {
  id: string
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  shortDescription: string
  keyPoints: string[]
  examples: { title: string; code: string; explanation: string }[]
}

interface ConceptCarouselProps {
  concepts: CarouselConcept[]
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
    <div className="relative group">
      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 -translate-y-[60%] z-10 w-10 h-10 rounded-full border-none bg-[rgba(15,15,26,0.9)] text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 left-2 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-9 max-md:h-9 max-sm:hidden"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous concept"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute top-1/2 -translate-y-[60%] z-10 w-10 h-10 rounded-full border-none bg-[rgba(15,15,26,0.9)] text-brand-primary cursor-pointer flex items-center justify-center transition-all duration-200 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 right-2 hover:not(:disabled):bg-brand-primary-50 hover:not(:disabled):text-text-bright hover:not(:disabled):scale-110 disabled:opacity-0 disabled:cursor-not-allowed max-md:w-9 max-md:h-9 max-sm:hidden"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next concept"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable cards */}
      <div 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-2 -mx-2 scrollbar-hide" 
        ref={scrollRef}
      >
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.id}
            className={`flex-none w-[340px] snap-start transition-all duration-300 max-md:w-[300px] max-sm:w-[calc(100vw-2rem)] ${index === activeIndex ? 'scale-[1.02]' : 'opacity-75'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              href={`${basePath}/${concept.id}`} 
              className="relative block h-full rounded-2xl p-0.5 bg-gradient-to-br from-brand-primary-15 to-brand-secondary-15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(168,85,247,0.25),0_0_50px_rgba(236,72,153,0.15)] card-gradient-border"
            >
              <div className="bg-bg-page-secondary rounded-[14px] p-6 flex flex-col gap-3 h-full min-h-[200px] max-sm:p-5 max-sm:min-h-[180px]">
                <div className="flex items-center justify-between">
                  <span className="text-3xl leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    <ConceptIcon conceptId={concept.id} size={32} />
                  </span>
                  <DifficultyIndicator level={concept.difficulty} size="md" />
                </div>
                <h3 className="text-[1.2rem] font-semibold text-text-bright mt-1 m-0 max-sm:text-lg">{concept.title}</h3>
                <p className="text-base text-text-secondary m-0 leading-normal flex-1 max-sm:text-base">{concept.shortDescription}</p>
                <div className="flex gap-4 mt-auto pt-3 border-t border-[rgba(255,255,255,0.08)]">
                  <span className="text-sm text-brand-primary font-medium">
                    {concept.keyPoints.length} key points
                  </span>
                  <span className="text-sm text-brand-primary font-medium">
                    {concept.examples.length} examples
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4 max-sm:mt-3">
        {concepts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-200 p-0 hover:bg-brand-primary-50 ${index === activeIndex ? 'bg-gradient-to-br from-brand-primary to-brand-secondary w-6 rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-brand-primary-30'}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to concept ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
