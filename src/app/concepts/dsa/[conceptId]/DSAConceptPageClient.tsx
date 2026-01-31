'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, AlertTriangle, Award, Clock, Gamepad2, Code2, Target, Link2 } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons'
import { getDSAConceptById, getRelatedDSAConcepts } from '@/data/dsaConcepts'
import {
  HashTableViz,
  StackViz,
  BigOViz,
  ArrayViz,
  QueueViz,
  LinkedListViz,
  BinarySystemViz,
} from '@/components/DSAConcepts'

// Map concept IDs to their visualization components
const visualizations: Record<string, React.ComponentType> = {
  'big-o-notation': BigOViz,
  'binary-system': BinarySystemViz,
  'arrays': ArrayViz,
  'hash-tables': HashTableViz,
  'stacks': StackViz,
  'queues': QueueViz,
  'linked-lists': LinkedListViz,
}

const difficultyColors = {
  beginner: 'var(--color-emerald-500)',
  intermediate: 'var(--color-amber-500)',
  advanced: 'var(--color-red-500)',
}

export default function DSAConceptPageClient(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const conceptId = params.conceptId as string

  const concept = conceptId ? getDSAConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--gradient-page)]">
        <NavBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-lg)] text-[var(--color-gray-500)]">
          <h1>Concept not found</h1>
          <Link href="/concepts/dsa" className="text-[var(--color-brand-primary)]">Back to DSA Concepts</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gradient-page)]">
      <NavBar
        breadcrumbs={[
          { label: 'Concepts', path: '/concepts' },
          { label: 'DSA', path: '/concepts/dsa' },
          { label: concept.title },
        ]}
      />

      <main className="mx-auto w-full container-content flex-1 px-8 pb-12 pt-6 max-md:px-[var(--spacing-lg)]">
        {/* Header */}
        <header className="mb-8">
          <button 
            className="mb-[var(--spacing-lg)] inline-flex items-center gap-[var(--spacing-sm)] border-0 bg-transparent p-0 py-[var(--spacing-sm)] text-base text-[var(--color-gray-500)] transition-colors duration-200 hover:text-[var(--color-brand-primary)]" 
            onClick={() => router.push('/concepts/dsa')}
          >
            <ArrowLeft size={18} />
            <span>All DSA Concepts</span>
          </button>

          <div className="mb-[var(--spacing-lg)] flex items-center gap-[var(--spacing-md)] max-md:flex-wrap">
            <span className="text-4xl leading-none">
              <ConceptIcon conceptId={conceptId} size={32} />
            </span>
            <h1 className="m-0 text-[var(--text-3xl)] font-bold text-white max-md:text-[var(--text-2xl)]">
              {concept.title}
            </h1>
            <span
              className="rounded-[var(--radius-sm)] px-2.5 py-[var(--spacing-xs)] text-[var(--text-xs)] font-semibold uppercase tracking-wide text-white"
              style={{ background: difficultyColors[concept.difficulty] }}
            >
              {concept.difficulty}
            </span>
          </div>

          <p className="mb-[var(--spacing-lg)] text-[var(--text-md)] leading-[1.7] text-[var(--color-gray-400)] max-md:text-base">
            {concept.description}
          </p>
        </header>

        {/* Interactive Visualization */}
        {(() => {
          const Visualization = visualizations[concept.id]
          if (!Visualization) return null
          return (
            <section className="mb-10">
              <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
                <Gamepad2 size={20} className="text-[var(--color-brand-primary)]" />
                Interactive Visualization
              </h2>
              <div className="min-h-[300px] rounded-[var(--radius-xl)] border border-[var(--color-white-10)] bg-[var(--color-black-30)] p-[var(--spacing-xl)] max-md:min-h-[200px] max-md:p-[var(--spacing-lg)]">
                <Visualization />
              </div>
            </section>
          )
        })()}

        {/* Complexity Table (for data structures) */}
        {concept.complexity && (
          <section className="mb-8">
            <h2 className="mb-[var(--spacing-lg)] flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
              <Clock size={20} className="text-[var(--color-brand-primary)]" />
              Time Complexity
            </h2>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-white-10)] bg-[var(--color-black-30)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-base font-semibold text-white max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                      Operation
                    </th>
                    {concept.complexity.average && (
                      <th className="bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-base font-semibold text-white max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                        Average
                      </th>
                    )}
                    {concept.complexity.worst && (
                      <th className="bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-base font-semibold text-white max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                        Worst
                      </th>
                    )}
                    {concept.complexity.best && (
                      <th className="bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-left text-base font-semibold text-white max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                        Best
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(concept.complexity.average || concept.complexity.worst || {}).map((op) => (
                    <tr key={op} className="hover:bg-[var(--color-white-2)]">
                      <td className="border-b border-white/[0.06] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-base text-[var(--color-gray-300)] max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                        {op}
                      </td>
                      {concept.complexity?.average && (
                        <td className="border-b border-white/[0.06] px-[var(--spacing-lg)] py-[var(--spacing-md)] font-mono font-medium text-[var(--color-emerald-500)] max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                          {concept.complexity.average[op]}
                        </td>
                      )}
                      {concept.complexity?.worst && (
                        <td className="border-b border-white/[0.06] px-[var(--spacing-lg)] py-[var(--spacing-md)] font-mono font-medium text-[var(--color-amber-500)] max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                          {concept.complexity.worst[op]}
                        </td>
                      )}
                      {concept.complexity?.best && (
                        <td className="border-b border-white/[0.06] px-[var(--spacing-lg)] py-[var(--spacing-md)] font-mono font-medium text-[var(--color-emerald-500)] max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)]">
                          {concept.complexity.best[op]}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Key Points */}
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
            <Lightbulb size={20} className="text-[var(--color-brand-primary)]" />
            Key Points
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                className="relative pl-6 leading-[var(--leading-normal)] text-[var(--color-gray-300)] before:absolute before:left-0 before:font-bold before:text-[var(--color-brand-primary)] before:content-['→']"
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
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
            <Code2 size={20} className="text-[var(--color-brand-primary)]" />
            Code Examples
          </h2>
          <div className="flex flex-col gap-[var(--spacing-xl)]">
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-white-8)] bg-[var(--color-white-3)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="m-0 border-b border-[var(--color-white-8)] bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-[0.95rem] font-semibold text-white">
                  {example.title}
                </h3>
                <pre className="m-0 overflow-x-auto bg-[var(--color-black-40)] p-[var(--spacing-lg)] font-mono text-base leading-[var(--leading-relaxed)] text-gray-300 max-md:p-[var(--spacing-md)] max-md:text-[var(--text-sm)]">
                  <code className="whitespace-pre">{example.code}</code>
                </pre>
                <p className="m-0 border-t border-[var(--color-white-5)] bg-[var(--color-brand-primary-5)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-base leading-[var(--leading-relaxed)] text-[var(--color-gray-400)]">
                  {example.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
              <AlertTriangle size={20} className="text-[var(--color-brand-primary)]" />
              Common Mistakes
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.commonMistakes.map((mistake, i) => (
                <li 
                  key={i} 
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-red-500)] bg-[var(--color-red-10)] py-1.5 pl-8 pr-3 text-base text-red-300 before:absolute before:left-2.5 before:text-[var(--color-accent-red)] before:content-['✗']"
                >
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
              <Award size={20} className="text-[var(--color-brand-primary)]" />
              Interview Tips
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.interviewTips.map((tip, i) => (
                <li 
                  key={i} 
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-emerald-500)] bg-[var(--color-emerald-10)] py-1.5 pl-8 pr-3 text-base text-[var(--color-emerald-400)] before:absolute before:left-2.5 before:text-[var(--difficulty-1)] before:content-['✓']"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Problems */}
        {concept.relatedProblems && concept.relatedProblems.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
              <Target size={20} className="text-[var(--color-brand-primary)]" />
              Practice Problems
            </h2>
            <div className="flex flex-wrap gap-[var(--spacing-md)]">
              {concept.relatedProblems.map((problemId) => (
                <Link
                  key={problemId}
                  href={`/dsa/${problemId}`}
                  className="inline-flex items-center rounded-[var(--radius-3xl)] border border-[var(--color-brand-primary-30)] bg-[var(--color-brand-primary-10)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-base font-medium text-[var(--color-brand-primary)] no-underline transition-all duration-[var(--transition-fast)] hover:-translate-y-px hover:border-[var(--color-brand-primary-50)] hover:bg-[var(--color-brand-primary-20)] max-md:px-3 max-md:py-1 max-md:text-[var(--text-base)]"
                >
                  {problemId.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Concepts */}
        {(() => {
          const relatedConcepts = getRelatedDSAConcepts(concept.id)
          if (relatedConcepts.length === 0) return null
          return (
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--color-white-10)] pb-2.5 text-[1.15rem] font-semibold text-white">
                <Link2 size={20} className="text-[var(--color-brand-primary)]" />
                Related Concepts
              </h2>
              <div className="grid grid-cols-auto-sm gap-[var(--spacing-lg)]">
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/concepts/dsa/${related.id}`}
                    className="flex items-center gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--color-white-8)] bg-[var(--color-white-3)] p-[var(--spacing-lg)] no-underline transition-all duration-[var(--transition-fast)] hover:-translate-y-0.5 hover:border-[var(--color-brand-primary-30)] hover:bg-[var(--color-brand-primary-10)]"
                  >
                    <span className="text-[1.75rem] leading-none">
                      <ConceptIcon conceptId={related.id} size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-[0.95rem] font-semibold text-white">{related.title}</h3>
                      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--text-base)] text-[var(--color-gray-500)]">
                        {related.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
      </main>
    </div>
  )
}
