'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  label: string
}

interface HeroStatsProps {
  stats: Stat[]
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function HeroStats({ stats }: HeroStatsProps) {
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0))
  const statsRef = useRef(stats)

  useEffect(() => {
    const currentStats = statsRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setCounts(currentStats.map(s => s.value))
      return
    }

    const duration = 1500
    let start: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)

      setCounts(currentStats.map(s => Math.round(eased * s.value)))

      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex items-center justify-center gap-8 max-sm:flex-col max-sm:gap-4 mt-6">
      {stats.map((stat, i) => (
        <div key={stat.label} className="text-center">
          <span className="block text-3xl font-bold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-none">
            {counts[i]}
          </span>
          <span className="text-sm text-text-secondary uppercase tracking-wide mt-1 block">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
