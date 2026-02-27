'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Concept } from '@/data/concepts'
import type { CodeExample } from '@/data/examples'
import { concepts } from '@/data/concepts'
import { codeExamples } from '@/data/examples'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

interface ConceptFooterLinksProps {
  prerequisites?: string[]
  nextConcepts?: string[]
  relatedProblems?: string[]
  conceptType: 'js' | 'dsa'
}

function resolveConceptIds(ids: string[] | undefined): Concept[] {
  return (ids || [])
    .map(id => concepts.find(c => c.id === id))
    .filter((c): c is Concept => c !== undefined)
}

function resolveProblemIds(ids: string[] | undefined): CodeExample[] {
  return (ids || [])
    .map(id => codeExamples.find(p => p.id === id))
    .filter((c): c is CodeExample => c !== undefined)
    .slice(0, 6)
}

const linkClasses = [
  'flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)]',
  'rounded-[var(--radius-xl)] border border-[var(--color-border-card)]',
  'bg-[var(--color-surface-card)] no-underline text-inherit',
  'transition-all duration-150',
  'hover:border-[var(--color-brand-primary-30)] hover:bg-[var(--color-white-5)]',
  'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none',
].join(' ')

export function ConceptFooterLinks({
  prerequisites,
  nextConcepts,
  relatedProblems,
  conceptType,
}: ConceptFooterLinksProps) {
  const prereqConcepts = resolveConceptIds(prerequisites)
  const nextConceptsList = resolveConceptIds(nextConcepts)
  const problems = resolveProblemIds(relatedProblems)

  const hasContent = prereqConcepts.length > 0 || nextConceptsList.length > 0 || problems.length > 0

  if (!hasContent) return null

  const conceptBasePath = conceptType === 'js' ? '/concepts/js' : '/concepts/dsa'

  return (
    <nav
      aria-label="Related content"
      className="mt-[var(--spacing-2xl)] space-y-[var(--spacing-2xl)] border-t border-[var(--color-border-card)] pt-[var(--spacing-2xl)]"
    >
      {prereqConcepts.length > 0 && (
        <ConceptSection title="Prerequisites" basePath={conceptBasePath} items={prereqConcepts} />
      )}

      {nextConceptsList.length > 0 && (
        <ConceptSection title="Next Steps" basePath={conceptBasePath} items={nextConceptsList} />
      )}

      {problems.length > 0 && (
        <section>
          <h2 className="text-[length:var(--text-lg)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
            Practice These Problems
          </h2>
          <div className="grid grid-cols-1 gap-[var(--spacing-md)] min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
            {problems.map(problem => (
              <Link
                key={problem.id}
                href={`/${problem.category}/${problem.id}`}
                className={`${linkClasses} justify-between`}
              >
                <span className="text-[length:var(--text-sm)] font-medium text-text-bright truncate">
                  {problem.name}
                </span>
                <DifficultyIndicator level={problem.difficulty} size="sm" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </nav>
  )
}

interface ConceptSectionProps {
  title: string
  basePath: string
  items: Concept[]
}

function ConceptSection({ title, basePath, items }: ConceptSectionProps) {
  return (
    <section>
      <h2 className="text-[length:var(--text-lg)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-[var(--spacing-md)] min-[640px]:grid-cols-2">
        {items.map(c => (
          <Link
            key={c.id}
            href={`${basePath}/${c.id}`}
            className={linkClasses}
          >
            <div className="flex-1 min-w-0">
              <span className="text-[length:var(--text-sm)] font-medium text-text-bright block truncate">
                {c.title}
              </span>
              <span className="text-[length:var(--text-xs)] text-text-muted block truncate">
                {c.shortDescription}
              </span>
            </div>
            <ChevronRight size={14} className="text-text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  )
}
