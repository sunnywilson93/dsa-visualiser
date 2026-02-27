'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

export interface CardStat {
  label: string
  value: string | number
}

export interface CardProps {
  href: string
  title: string
  description: string
  icon?: ReactNode
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  stats?: CardStat[]
  meta?: ReactNode
  index?: number
  isActive?: boolean
}

export function Card({
  href,
  title,
  description,
  icon,
  difficulty,
  stats,
  meta,
  isActive = false,
}: CardProps) {
  return (
    <div
      className={`
        flex-[0_0_calc(25%-12px)] snap-start transition-all duration-300
        max-lg:flex-[0_0_calc(33.333%-11px)]
        max-md:flex-[0_0_calc(50%-8px)]
        max-sm:flex-[0_0_calc(100vw-48px)]
      `}
    >
      <Link
        href={href}
        className="group relative block h-full p-[2px] rounded-2xl no-underline text-inherit transition-all duration-150 border border-border-card hover:bg-white-5 hover:border-brand-primary-30"
      >
        <div
          className="h-full p-6 flex flex-col gap-3 rounded-xl max-[480px]:min-h-[180px]"
          style={{
            background: 'var(--color-bg-page-secondary)',
            minHeight: '200px',
          }}
        >
          <div className="flex items-center justify-between">
            {icon && (
              <span className="text-3xl leading-none">
                {icon}
              </span>
            )}
            {difficulty && <DifficultyIndicator level={difficulty} size="md" />}
          </div>
          <h3 className="text-lg font-semibold text-text-bright mt-1">{title}</h3>
          <p className="text-base text-text-secondary leading-normal flex-1 m-0">{description}</p>
          {(stats || meta) && (
            <div className="flex gap-4 mt-auto pt-3 border-t border-border-card">
              {stats?.map((stat, i) => (
                <span key={i} className="text-sm font-medium text-brand-primary">
                  {stat.value} {stat.label}
                </span>
              ))}
              {meta}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
