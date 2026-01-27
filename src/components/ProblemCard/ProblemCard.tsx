'use client'

import Link from 'next/link'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import type { CodeExample } from '@/data/examples'

interface ProblemCategory {
  id: string
  name: string
}

interface ProblemCardBaseProps {
  problem: CodeExample
  category?: ProblemCategory
  onCategoryClick?: () => void
  categoryAriaLabel?: string
  showCategory?: boolean
}

interface ProblemCardLinkProps extends ProblemCardBaseProps {
  href: string
  onClick?: never
}

interface ProblemCardButtonProps extends ProblemCardBaseProps {
  href?: never
  onClick: () => void
}

type ProblemCardProps = ProblemCardLinkProps | ProblemCardButtonProps

export function ProblemCard({
  problem,
  href,
  onClick,
  category,
  onCategoryClick,
  categoryAriaLabel,
  showCategory = true,
}: ProblemCardProps) {
  const cardContent = (
    <div className="relative h-full">
      <div className="flex justify-between items-start gap-3 mb-2">
        <span className="font-medium text-white text-base">{problem.name}</span>
        <DifficultyIndicator level={problem.difficulty} size="sm" />
      </div>
      {showCategory && category && (
        <div className="flex items-center gap-2 mb-2">
          {onCategoryClick ? (
            <button
              type="button"
              className="relative z-[2] inline-flex items-center gap-[3px] text-xs font-medium text-brand-light bg-brand-primary-10 border border-brand-primary-20 py-0.5 px-2 rounded-md cursor-pointer font-inherit hover:bg-brand-primary-20 hover:border-brand-primary-30"
              onClick={(e) => {
                e.stopPropagation()
                onCategoryClick()
              }}
              aria-label={categoryAriaLabel || `Filter to ${category.name}`}
            >
              <ConceptIcon conceptId={category.id} size={14} />
              {category.name}
            </button>
          ) : (
            <span className="inline-flex items-center gap-[3px] text-xs font-medium text-brand-light bg-brand-primary-10 border border-brand-primary-20 py-0.5 px-2 rounded-md">
              <ConceptIcon conceptId={category.id} size={14} />
              {category.name}
            </span>
          )}
        </div>
      )}
      <p className="text-gray-500 text-base m-0 leading-snug max-md:text-sm">
        {problem.description}
      </p>
    </div>
  )

  if (href) {
    return (
      <div className="relative bg-white-3 border border-white-8 rounded-xl p-4 text-left cursor-pointer transition-all duration-fast w-full font-inherit text-inherit hover:bg-white-8 hover:border-brand-primary-30 focus-visible:outline-2 focus-visible:outline-brand-primary-50 focus-visible:outline-offset-2 max-md:p-3">
        <Link
          href={href}
          className="absolute inset-0 rounded-xl no-underline text-inherit z-[1] focus-visible:outline-2 focus-visible:outline-brand-primary-50 focus-visible:outline-offset-2"
          aria-label={`Open ${problem.name}`}
        />
        {cardContent}
      </div>
    )
  }

  return (
    <button
      type="button"
      className="relative bg-white-3 border border-white-8 rounded-xl p-4 text-left cursor-pointer transition-all duration-fast w-full font-inherit text-inherit hover:bg-white-8 hover:border-brand-primary-30 focus-visible:outline-2 focus-visible:outline-brand-primary-50 focus-visible:outline-offset-2 max-md:p-3"
      onClick={onClick}
      aria-label={`Open ${problem.name}`}
    >
      {cardContent}
    </button>
  )
}
