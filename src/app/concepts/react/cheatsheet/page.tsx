import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { reactConcepts, reactConceptCategories } from '@/data/reactConcepts'
import type { ReactConcept } from '@/data/reactConcepts'

export const metadata: Metadata = {
  title: 'React Interview Cheatsheet - Quick Reference | JS Interview Prep',
  description:
    'A comprehensive React interview cheatsheet covering hooks, rendering, performance, patterns, and more.',
  keywords:
    'react interview cheatsheet, react hooks cheatsheet, frontend interview prep',
  openGraph: {
    title: 'React Interview Cheatsheet',
    description:
      'Key points from all React concepts in one scannable reference page.',
    url: 'https://jsinterview.dev/concepts/react/cheatsheet',
  },
  alternates: {
    canonical: '/concepts/react/cheatsheet',
  },
}

function getGroupedConcepts(): { label: string; concepts: ReactConcept[] }[] {
  return reactConceptCategories
    .map((cat) => ({
      label: cat.label,
      concepts: reactConcepts.filter((c) => c.category === cat.id),
    }))
    .filter((g) => g.concepts.length > 0)
}

function generateFAQSchema() {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: [
      {
        '@type': 'Question' as const,
        name: 'What React topics are most important for interviews?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'The most frequently tested React topics in interviews are hooks (useState, useEffect, useRef), component lifecycle, rendering behavior, performance optimization (useMemo, useCallback, React.memo), and common patterns like compound components and custom hooks.',
        },
      },
      {
        '@type': 'Question' as const,
        name: 'How many React concepts does this cheatsheet cover?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: `This cheatsheet covers key points from ${reactConcepts.length} React concepts, organized by topic. Each section links to a detailed interactive explanation with code examples and visualizations.`,
        },
      },
    ],
  }
}

export default function CheatsheetPage() {
  const groups = getGroupedConcepts()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'React', path: '/concepts/react' },
    { name: 'Cheatsheet' },
  ])
  const faqSchema = generateFAQSchema()
  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      <NavBar />

      <main className="flex-1 py-8 px-8 pb-12 container-default mx-auto w-full">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-bright mb-3 max-md:text-2xl">
            React Interview Cheatsheet
          </h1>
          <p className="text-text-secondary text-md max-w-[40rem] mx-auto">
            Key points from {reactConcepts.length} React concepts in one
            scannable reference. Click any topic to explore the full interactive
            explanation.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xl font-bold text-text-bright mb-4 pb-2 border-b border-border-card">
                {group.label}
              </h2>

              <div className="flex flex-col gap-4">
                {group.concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="rounded-xl p-4 border border-border-card bg-surface-card"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2 max-sm:flex-col max-sm:gap-1">
                      <Link
                        href={`/concepts/react/${concept.id}`}
                        className="text-base font-semibold text-brand-primary no-underline hover:text-brand-secondary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none focus-visible:rounded"
                      >
                        {concept.title} →
                      </Link>
                      {concept.interviewFrequency && (
                        <span className="text-xs font-medium text-text-muted whitespace-nowrap">
                          {concept.interviewFrequency === 'very-high'
                            ? 'Very High'
                            : concept.interviewFrequency === 'high'
                              ? 'High'
                              : concept.interviewFrequency === 'medium'
                                ? 'Medium'
                                : 'Low'}{' '}
                          frequency
                        </span>
                      )}
                    </div>
                    <ul className="m-0 pl-4 flex flex-col gap-1">
                      {concept.keyPoints.slice(0, 4).map((point, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary leading-relaxed"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-text-muted">
          <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>
            Updated {formattedDate}
          </time>
        </footer>
      </main>
    </div>
  )
}
