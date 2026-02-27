'use client'

import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, HardDrive, CheckCircle } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { getPatternBySlug } from '@/data/dsaPatterns'
import { TwoPointersViz, HashMapViz, BitManipulationViz } from '@/components/DSAPatterns'
import { RelatedProblems } from '@/components/CrossLinks'

interface Props {
  patternId: string
}

export default function PatternPageClient({ patternId }: Props) {
  const router = useRouter()
  const pattern = getPatternBySlug(patternId)

  if (!pattern) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gradient-page)]">
      <NavBar
        breadcrumbs={[
          { label: 'Concepts', path: '/concepts' },
          { label: 'DSA', path: '/concepts/dsa' },
          { label: 'Patterns', path: '/concepts/dsa' },
          { label: pattern.name },
        ]}
      />

      <main className="mx-auto w-full container-content flex-1 px-8 pb-12 pt-6 max-md:px-[var(--spacing-lg)]">
        <header className="mb-8">
          <button 
            className="mb-[var(--spacing-lg)] inline-flex items-center gap-[var(--spacing-sm)] border-0 bg-transparent p-0 py-[var(--spacing-sm)] text-base text-text-muted transition-colors duration-200 hover:text-[color:var(--color-brand-primary)]" 
            onClick={() => router.push('/concepts/dsa')}
          >
            <ArrowLeft size={18} />
            <span>All Patterns</span>
          </button>

          <div className="mb-[var(--spacing-lg)] flex items-center gap-[var(--spacing-md)] max-md:flex-wrap">
            <span className="text-4xl leading-none text-[color:var(--color-brand-primary)]">
              <ConceptIcon conceptId={patternId} size={32} />
            </span>
            <h1 className="m-0 bg-[var(--gradient-brand)] bg-clip-text text-[length:var(--text-3xl)] font-bold text-transparent max-md:text-[length:var(--text-2xl)]">
              {pattern.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-brand-primary-15)] px-2.5 py-[var(--spacing-xs)] text-[length:var(--text-sm)] font-semibold text-[color:var(--color-brand-primary)]">
              <Clock size={14} />
              {pattern.complexity.time}
            </span>
          </div>

          <p className="mb-[var(--spacing-lg)] text-[length:var(--text-lg)] leading-[var(--leading-relaxed)] text-[color:var(--color-text-secondary)] max-md:text-base">
            {pattern.description}
          </p>

          <div className="flex gap-[var(--spacing-xl)] max-md:flex-wrap max-md:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-card)] bg-[var(--color-white-5)] px-3 py-1.5 text-sm text-[color:var(--color-text-muted)]">
              <Clock size={14} />
              Time: {pattern.complexity.time}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-card)] bg-[var(--color-white-5)] px-3 py-1.5 text-sm text-[color:var(--color-text-muted)]">
              <HardDrive size={14} />
              Space: {pattern.complexity.space}
            </span>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="mb-[var(--spacing-lg)] text-[length:var(--text-xl)] font-semibold text-[color:var(--color-text-primary)]">
            When to Use
          </h2>
          <ul className="m-0 list-none p-0">
            {pattern.whenToUse.map((use, index) => (
              <li key={index} className="flex items-start gap-3 py-[var(--spacing-sm)] text-[color:var(--color-text-secondary)]">
                <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-[color:var(--color-emerald-500)]" />
                {use}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-[var(--spacing-lg)] text-[length:var(--text-xl)] font-semibold text-[color:var(--color-text-primary)]">
            Pattern Variants
          </h2>
          <div className="grid gap-[var(--spacing-lg)]">
            {pattern.variants.map((variant) => (
              <div 
                key={variant.id} 
                className="rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)] p-5"
              >
                <h3 className="mb-[var(--spacing-sm)] text-[length:var(--text-md)] font-semibold text-[color:var(--color-text-primary)]">
                  {variant.name}
                </h3>
                <p className="mb-[var(--spacing-sm)] text-sm leading-[var(--leading-normal)] text-[color:var(--color-text-secondary)]">
                  {variant.description}
                </p>
                <p className="text-xs text-[color:var(--color-text-muted)]">
                  <strong className="text-[color:var(--color-text-secondary)]">Use for:</strong> {variant.whenToUse}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-[var(--spacing-lg)] text-[length:var(--text-xl)] font-semibold text-[color:var(--color-text-primary)]">
            Interactive Visualization
          </h2>
          {patternId === 'two-pointers' ? (
            <TwoPointersViz />
          ) : patternId === 'hash-map' ? (
            <HashMapViz />
          ) : patternId === 'bit-manipulation' ? (
            <BitManipulationViz />
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--color-brand-primary-30)] bg-[var(--color-brand-primary-10)] p-[var(--spacing-2xl)] text-center text-[color:var(--color-text-secondary)]">
              <p>Step-through visualization coming soon...</p>
              <p className="mt-[var(--spacing-sm)] text-sm text-[color:var(--color-text-muted)]">
                This will include beginner, intermediate, and advanced examples with code highlighting.
              </p>
            </div>
          )}
        </section>

        <RelatedProblems patternId={patternId} />
      </main>
    </div>
  )
}
