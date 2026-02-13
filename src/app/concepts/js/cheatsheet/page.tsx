import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { concepts } from '@/data/concepts'

export const metadata: Metadata = {
  title: 'JavaScript Interview Cheatsheet - Quick Reference | JS Interview Prep',
  description:
    'A comprehensive JavaScript interview cheatsheet covering closures, prototypes, the event loop, async patterns, and more. Key points from all concepts in one scannable page.',
  keywords:
    'javascript interview cheatsheet, js cheatsheet, javascript quick reference, frontend interview prep, javascript concepts summary',
  openGraph: {
    title: 'JavaScript Interview Cheatsheet',
    description:
      'Key points from all JavaScript concepts in one scannable reference page.',
    url: 'https://jsinterview.dev/concepts/js/cheatsheet',
  },
  alternates: {
    canonical: '/concepts/js/cheatsheet',
  },
}

interface TopicGroup {
  label: string
  filter: (c: typeof concepts[number]) => boolean
}

const topicGroups: TopicGroup[] = [
  {
    label: 'Scope & Hoisting',
    filter: (c) => c.subcategory === 'scope-hoisting' || c.id === 'scope-basics',
  },
  {
    label: 'Closures',
    filter: (c) => c.id.startsWith('closure') || c.id === 'closures',
  },
  {
    label: 'Prototypes & OOP',
    filter: (c) => c.subcategory === 'prototypes-oop' || c.id === 'prototypes',
  },
  {
    label: 'Event Loop & Async',
    filter: (c) =>
      c.subcategory === 'event-loop' ||
      c.subcategory === 'async-patterns' ||
      c.id === 'event-loop' ||
      c.id === 'async-evolution',
  },
  {
    label: 'Array Methods',
    filter: (c) => c.subcategory === 'array-methods' || c.id.startsWith('array-'),
  },
  {
    label: 'Modern JavaScript (ES6+)',
    filter: (c) => c.subcategory === 'modern-js',
  },
]

function getGroupedConcepts(): { label: string; concepts: typeof concepts }[] {
  const usedIds = new Set<string>()

  const groups = topicGroups.map((group) => {
    const matched = concepts.filter((c) => {
      if (usedIds.has(c.id)) return false
      return group.filter(c)
    })
    matched.forEach((c) => usedIds.add(c.id))
    return { label: group.label, concepts: matched }
  })

  const remaining = concepts.filter((c) => !usedIds.has(c.id))
  if (remaining.length > 0) {
    groups.push({ label: 'Other Topics', concepts: remaining })
  }

  return groups.filter((g) => g.concepts.length > 0)
}

function generateFAQSchema() {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: [
      {
        '@type': 'Question' as const,
        name: 'What JavaScript topics are most important for interviews?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: 'The most frequently tested JavaScript topics in interviews are closures, the event loop, prototypes and the prototype chain, the "this" keyword, promises and async/await, and scope/hoisting. Understanding these concepts deeply and being able to explain them is essential for frontend engineering roles.',
        },
      },
      {
        '@type': 'Question' as const,
        name: 'How many JavaScript concepts does this cheatsheet cover?',
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: `This cheatsheet covers key points from ${concepts.length} JavaScript concepts, organized by topic. Each section links to a detailed interactive explanation with code examples and visualizations.`,
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
    { name: 'JavaScript', path: '/concepts/js' },
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
            JavaScript Interview Cheatsheet
          </h1>
          <p className="text-text-secondary text-md max-w-[40rem] mx-auto">
            Key points from {concepts.length} JavaScript concepts in one
            scannable reference. Click any topic to explore the full interactive
            explanation.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xl font-bold text-text-bright mb-4 pb-2 border-b border-white-10">
                {group.label}
              </h2>

              <div className="flex flex-col gap-4">
                {group.concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="rounded-xl p-4 border border-white-10 bg-white-3"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2 max-sm:flex-col max-sm:gap-1">
                      <Link
                        href={`/concepts/js/${concept.id}`}
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
