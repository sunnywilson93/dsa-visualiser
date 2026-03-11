'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, Award, Gamepad2, Code2, Link2 } from 'lucide-react'
import { PageLayout, CodeBlock } from '@/components/ui'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import { getTSConceptById, tsConcepts } from '@/data/tsConcepts'

const TypeScriptViz = dynamic(
  () => import('@/components/Concepts/TypeScript/TypeScriptViz').then(m => ({ default: m.TypeScriptViz })),
  { ssr: false }
)

const visualizations: Record<string, React.ComponentType> = {
  'ts-basics': TypeScriptViz,
  'ts-type-narrowing': TypeScriptViz,
  'ts-generics': TypeScriptViz,
  'ts-utility-types': TypeScriptViz,
  'ts-mapped-types': TypeScriptViz,
  'ts-conditional-types': TypeScriptViz,
  'ts-advanced-generics': TypeScriptViz,
  'ts-type-assertions': TypeScriptViz,
  'ts-declaration-files': TypeScriptViz,
  'ts-react-components': TypeScriptViz,
  'ts-react-hooks': TypeScriptViz,
  'ts-react-patterns': TypeScriptViz,
  'ts-tricky-questions': TypeScriptViz,
  'ts-strict-mode': TypeScriptViz,
  'ts-migration': TypeScriptViz,
}

export default function TSConceptPageClient(): JSX.Element {
  const params = useParams()
  const conceptId = params.conceptId as string

  const concept = conceptId ? getTSConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <PageLayout variant="content">
        <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-lg)] text-text-muted">
          <h1>Concept not found</h1>
          <Link href="/concepts/ts" className="text-[color:var(--color-brand-primary)]">Back to TypeScript Concepts</Link>
        </div>
      </PageLayout>
    )
  }

  const Visualization = visualizations[concept.id]

  return (
    <PageLayout
      variant="content"
      article
      breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: 'TypeScript', path: '/concepts/ts' },
        { label: concept.title },
      ]}
    >
        {/* Header */}
        <header className="mb-8">
          <div className="mb-[var(--spacing-lg)] flex items-center gap-[var(--spacing-md)] max-md:flex-wrap">
            <span className="text-4xl leading-none">
              <ConceptIcon conceptId={concept.id} size={32} />
            </span>
            <h1 className="m-0 text-3xl font-bold text-text-bright max-md:text-2xl">
              {concept.title}
            </h1>
            <DifficultyIndicator level={concept.difficulty} size="md" />
          </div>

          <p className="m-0 text-[length:var(--text-md)] leading-[1.7] text-text-muted max-md:text-base">
            {concept.description}
          </p>
        </header>

        {/* Interactive Visualization */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Gamepad2 size={20} className="text-[color:var(--color-brand-primary)]" />
            Interactive Visualization
          </h2>
          <div className="min-h-[300px] rounded-[var(--radius-xl)] border border-[var(--color-border-card)] bg-[var(--color-black-30)] p-[var(--spacing-xl)] max-md:min-h-[200px] max-md:p-[var(--spacing-lg)]">
            {Visualization ? (
              <ErrorBoundary>
                <Visualization />
              </ErrorBoundary>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-text-muted">
                Visualization coming soon
              </div>
            )}
          </div>
        </section>

        {/* Key Points */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Lightbulb size={20} className="text-[color:var(--color-brand-primary)]" />
            Key Points
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                className="relative pl-6 leading-[var(--leading-normal)] text-text-secondary before:absolute before:left-0 before:font-bold before:text-[color:var(--color-brand-primary)] before:content-['\u2192']"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Code Examples */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Code2 size={20} className="text-[color:var(--color-brand-primary)]" />
            Code Examples
          </h2>
          <div className="flex flex-col gap-[var(--spacing-xl)]">
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="m-0 border-b border-[var(--color-border-card)] bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-[0.95rem] font-semibold text-white">
                  {example.title}
                </h3>
                <CodeBlock code={example.code} />
                <p className="m-0 border-t border-[var(--color-white-5)] bg-[var(--color-brand-primary-5)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-base leading-[var(--leading-relaxed)] text-text-muted">
                  {example.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
              <AlertTriangle size={20} className="text-[color:var(--color-brand-primary)]" />
              Common Mistakes
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.commonMistakes.map((mistake, i) => (
                <li
                  key={i}
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-red-500)] bg-[var(--color-red-10)] py-1.5 pl-8 pr-3 text-base text-red-300 before:absolute before:left-2.5 before:text-[color:var(--color-accent-red)] before:content-['✗']"
                >
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
              <Award size={20} className="text-[color:var(--color-brand-primary)]" />
              Interview Tips
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.interviewTips.map((tip, i) => (
                <li
                  key={i}
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-emerald-500)] bg-[var(--color-emerald-10)] py-1.5 pl-8 pr-3 text-base text-[color:var(--color-emerald-400)] before:absolute before:left-2.5 before:text-[var(--difficulty-1)] before:content-['✓']"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Concepts — built from prerequisites + nextConcepts */}
        {(() => {
          const relatedIds = [...(concept.prerequisites || []), ...(concept.nextConcepts || [])]
          const relatedConcepts = relatedIds
            .map(id => getTSConceptById(id))
            .filter((c): c is NonNullable<ReturnType<typeof getTSConceptById>> => c !== undefined)
          if (relatedConcepts.length === 0) return null
          return (
            <section className="mb-10">
              <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-border-card)] pb-2.5 text-lg font-semibold text-text-bright">
                <Link2 size={20} className="text-[color:var(--color-brand-primary)]" />
                Related Concepts
              </h2>
              <div className="grid grid-cols-auto-sm gap-[var(--spacing-lg)]">
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/concepts/ts/${related.id}`}
                    className="flex items-center gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] p-[var(--spacing-lg)] no-underline transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-white-5)] hover:border-[var(--color-brand-primary-40)]"
                  >
                    <span className="text-[1.75rem] leading-none">
                      <ConceptIcon conceptId={related.id} size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-[0.95rem] font-semibold text-text-bright">{related.title}</h3>
                      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--text-base)] text-text-muted">
                        {related.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}

        {/* Footer — concept count */}
        <footer className="mt-[var(--spacing-2xl)] border-t border-[var(--color-border-card)] pt-[var(--spacing-xl)] text-center">
          <Link
            href="/concepts/ts"
            className="text-[color:var(--color-brand-primary)] no-underline transition-colors duration-[var(--transition-fast)] hover:text-[color:var(--color-brand-primary-light)]"
          >
            Browse all {tsConcepts.length} TypeScript concepts
          </Link>
        </footer>
    </PageLayout>
  )
}
