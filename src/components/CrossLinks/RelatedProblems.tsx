'use client'

import Link from 'next/link'
import { getRelatedProblems } from '@/utils/getCrossLinks'

interface Props {
  patternId: string
}

export function RelatedProblems({ patternId }: Props) {
  const problems = getRelatedProblems(patternId)

  if (problems.length === 0) {
    return null
  }

  return (
    <section className="mb-[var(--spacing-2xl)]">
      <h2 className="text-[length:var(--text-xl)] font-semibold mb-[var(--spacing-lg)] text-[color:var(--color-text-primary)]">Practice this Pattern</h2>
      <div className="grid grid-cols-1 gap-[var(--spacing-lg)] min-[640px]:grid-cols-2">
        {problems.map((problem) => (
          <div key={problem.id} className="relative bg-[var(--surface-card)] border border-[var(--border-card)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)] transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-white-8)] hover:border-[var(--color-brand-primary-30)] max-[768px]:p-[var(--spacing-md)]">
            <Link href={problem.href} className="absolute inset-0 rounded-[var(--radius-xl)]] no-underline z-[1] focus-visible:outline focus-visible:outline-[var(--border-width-2)] focus-visible:outline-[var(--color-brand-primary-50)] focus-visible:outline-offset-2">
              <span className="absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0">Go to {problem.name}</span>
            </Link>
            <div className="relative">
              <h3 className="font-medium text-white text-[length:var(--text-base)] mb-[var(--spacing-sm)] max-[768px]:text-[length:var(--text-base)]">{problem.name}</h3>
              {problem.description && (
                <p className="text-[color:var(--color-gray-500)] text-[length:var(--text-base)] m-0 leading-[var(--leading-snug)] max-[768px]:text-[length:var(--text-sm)]">{problem.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
