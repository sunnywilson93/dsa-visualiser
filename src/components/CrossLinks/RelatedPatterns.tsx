'use client'

import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { getRelatedPatterns } from '@/utils/getCrossLinks'

interface Props {
  problemId: string
}

export function RelatedPatterns({ problemId }: Props) {
  const patterns = getRelatedPatterns(problemId)

  if (patterns.length === 0) {
    return null
  }

  return (
    <section className="mb-[var(--spacing-lg)] w-full max-[768px]:mb-[var(--spacing-md)]">
      <h3 className="text-[length:var(--text-base)] font-medium text-[color:var(--color-text-muted)] mb-[var(--spacing-sm)] m-0">Learn the Pattern</h3>
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        {patterns.map((pattern) => (
          <Link
            key={pattern.id}
            href={pattern.href}
            className="flex items-start gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-brand-primary-10)] border border-[var(--color-brand-primary-20)] rounded-[var(--radius-md)] no-underline transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-brand-primary-15)] hover:border-[var(--color-brand-primary-40)] focus-visible:outline focus-visible:outline-[var(--border-width-2)] focus-visible:outline-[var(--color-accent-blue)] focus-visible:outline-offset-2 max-[768px]:px-[var(--spacing-md)] max-[768px]:py-[var(--spacing-sm)]"
          >
            <Lightbulb size={18} className="text-[var(--color-brand-primary)] flex-shrink-0 mt-[2px]" />
            <div className="flex flex-col gap-[2px]">
              <span className="text-[length:var(--text-base)] font-semibold text-[color:var(--color-text-primary)] max-[768px]:text-[length:var(--text-base)]">{pattern.name}</span>
              {pattern.description && (
                <span className="text-[length:var(--text-sm)] text-[color:var(--color-text-secondary)] leading-[var(--leading-snug)] max-[768px]:text-[length:var(--text-sm)]">
                  {pattern.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
