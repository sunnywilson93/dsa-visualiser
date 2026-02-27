import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { topicHubs, getTopicHub } from '@/data/topicHubs'
import { getConceptById } from '@/data/concepts'
import { getDSAConceptById } from '@/data/dsaConcepts'
import { codeExamples } from '@/data/examples'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

interface Props {
  params: { topicId: string }
}

export async function generateStaticParams(): Promise<Array<{ topicId: string }>> {
  return topicHubs.map((hub) => ({ topicId: hub.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = getTopicHub(params.topicId)
  if (!hub) return { title: 'Topic Not Found | JS Interview Prep' }

  const conceptCount = hub.relatedConceptIds.length + 1
  const problemCount = hub.relatedProblemIds.length

  const description = hub.metaDescriptionTemplate
    .replace('{conceptCount}', String(conceptCount))
    .replace('{problemCount}', String(problemCount))

  return {
    title: hub.h1Template,
    description,
    keywords: hub.targetKeywords.join(', '),
    openGraph: {
      title: hub.name,
      description,
      url: `https://jsinterview.dev/topics/${hub.id}`,
    },
    alternates: {
      canonical: `/topics/${hub.id}`,
    },
  }
}

function resolvePrimaryConcept(hub: NonNullable<ReturnType<typeof getTopicHub>>) {
  if (hub.type === 'js') {
    return getConceptById(hub.primaryConceptId)
  }
  return getDSAConceptById(hub.primaryConceptId)
}

function generateCourseSchema(
  hub: NonNullable<ReturnType<typeof getTopicHub>>,
  description: string,
  difficulty: string,
  conceptCount: number,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: hub.name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
    educationalLevel: difficulty,
    numberOfLessons: conceptCount,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${conceptCount * 10}M`,
    },
  }
}

function generateFAQSchema(primaryConcept: { title: string; description: string; keyPoints: string[]; commonMistakes?: string[]; interviewTips?: string[] }) {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `What is ${primaryConcept.title}?`,
    answer: primaryConcept.description,
  })

  faqs.push({
    question: `What are the key points about ${primaryConcept.title}?`,
    answer: primaryConcept.keyPoints.join('. '),
  })

  if (primaryConcept.commonMistakes && primaryConcept.commonMistakes.length > 0) {
    faqs.push({
      question: `What are common mistakes with ${primaryConcept.title}?`,
      answer: primaryConcept.commonMistakes.join('. '),
    })
  }

  if (primaryConcept.interviewTips && primaryConcept.interviewTips.length > 0) {
    faqs.push({
      question: `What are interview tips for ${primaryConcept.title}?`,
      answer: primaryConcept.interviewTips.join('. '),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export default function TopicHubPage({ params }: Props) {
  const hub = getTopicHub(params.topicId)
  if (!hub) notFound()

  const primaryConcept = resolvePrimaryConcept(hub)
  if (!primaryConcept) notFound()

  const conceptCount = hub.relatedConceptIds.length + 1
  const problemCount = hub.relatedProblemIds.length
  const description = hub.metaDescriptionTemplate
    .replace('{conceptCount}', String(conceptCount))
    .replace('{problemCount}', String(problemCount))

  const relatedConcepts = hub.relatedConceptIds
    .map((id) => {
      const jsConcept = getConceptById(id)
      if (jsConcept) return { ...jsConcept, conceptType: 'js' as const }
      const dsaConcept = getDSAConceptById(id)
      if (dsaConcept) return { ...dsaConcept, conceptType: 'dsa' as const }
      return null
    })
    .filter(Boolean)

  const relatedProblems = hub.relatedProblemIds
    .map((id) => codeExamples.find((p) => p.id === id))
    .filter(Boolean)

  const difficultyLabel = primaryConcept.difficulty.charAt(0).toUpperCase() + primaryConcept.difficulty.slice(1)
  const conceptBasePath = hub.type === 'js' ? '/concepts/js' : '/concepts/dsa'

  const courseSchema = generateCourseSchema(hub, description, primaryConcept.difficulty, conceptCount)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: hub.name },
  ])
  const faqSchema = generateFAQSchema(primaryConcept)

  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <StructuredData data={courseSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />

      <main className="max-w-[900px] mx-auto px-[var(--spacing-lg)] py-[var(--spacing-2xl)]">
        {/* Hero */}
        <header className="mb-[var(--spacing-2xl)]">
          <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
            <span className="text-[length:var(--text-sm)] text-[color:var(--color-text-muted)] uppercase tracking-[var(--letter-spacing-wide)]">
              {hub.type === 'js' ? 'JavaScript' : 'Data Structures & Algorithms'}
            </span>
            <DifficultyIndicator level={primaryConcept.difficulty} size="sm" />
          </div>
          <h1 className="text-[length:var(--text-4xl)] font-bold text-text-bright leading-tight mb-[var(--spacing-lg)]">
            {hub.h1Template}
          </h1>
          <p className="text-[length:var(--text-base)] text-[color:var(--color-text-muted)] leading-[var(--leading-normal)] mb-[var(--spacing-lg)]">
            {primaryConcept.description}
          </p>
          <div className="flex items-center gap-[var(--spacing-lg)] text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
            <span>{conceptCount} concepts</span>
            <span className="text-[color:var(--color-border-primary)]">·</span>
            <span>{problemCount} practice problems</span>
            <span className="text-[color:var(--color-border-primary)]">·</span>
            <span>{difficultyLabel} level</span>
          </div>
        </header>

        {/* Key Points */}
        {primaryConcept.keyPoints.length > 0 && (
          <section className="mb-[var(--spacing-2xl)]">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
              Key Concepts
            </h2>
            <ul className="space-y-[var(--spacing-sm)] list-none p-0 m-0">
              {primaryConcept.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-[var(--spacing-sm)] text-[length:var(--text-base)] text-[color:var(--color-text-secondary)] leading-[var(--leading-normal)]"
                >
                  <span className="text-[color:var(--color-brand-primary)] mt-[2px] shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Concepts */}
        {relatedConcepts.length > 0 && (
          <section className="mb-[var(--spacing-2xl)]">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
              Topics Covered
            </h2>
            <div className="grid grid-cols-1 gap-[var(--spacing-md)] min-[640px]:grid-cols-2">
              {/* Primary concept card */}
              <Link
                href={`${conceptBasePath}/${hub.primaryConceptId}`}
                className="block p-[var(--spacing-lg)] rounded-[var(--radius-xl)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] no-underline text-inherit transition-all duration-150 hover:border-[var(--color-brand-primary-30)] hover:bg-[var(--color-white-5)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                <span className="text-[length:var(--text-sm)] font-medium text-text-bright block mb-[var(--spacing-xs)]">
                  {primaryConcept.title}
                </span>
                <span className="text-[length:var(--text-xs)] text-[color:var(--color-text-muted)] block leading-[var(--leading-snug)]">
                  {primaryConcept.shortDescription}
                </span>
              </Link>

              {relatedConcepts.map((concept) => (
                <Link
                  key={concept!.id}
                  href={`/concepts/${concept!.conceptType}/${concept!.id}`}
                  className="block p-[var(--spacing-lg)] rounded-[var(--radius-xl)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] no-underline text-inherit transition-all duration-150 hover:border-[var(--color-brand-primary-30)] hover:bg-[var(--color-white-5)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                >
                  <span className="text-[length:var(--text-sm)] font-medium text-text-bright block mb-[var(--spacing-xs)]">
                    {concept!.title}
                  </span>
                  <span className="text-[length:var(--text-xs)] text-[color:var(--color-text-muted)] block leading-[var(--leading-snug)]">
                    {concept!.shortDescription}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Practice Problems */}
        {relatedProblems.length > 0 && (
          <section className="mb-[var(--spacing-2xl)]">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
              Practice Problems
            </h2>
            <div className="grid grid-cols-1 gap-[var(--spacing-md)] min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
              {relatedProblems.map((problem) => (
                <Link
                  key={problem!.id}
                  href={`/${problem!.category}/${problem!.id}`}
                  className="flex items-center justify-between gap-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)] no-underline text-inherit transition-all duration-150 hover:border-[var(--color-brand-primary-30)] hover:bg-[var(--color-white-5)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                >
                  <span className="text-[length:var(--text-sm)] font-medium text-text-bright truncate">
                    {problem!.name}
                  </span>
                  <DifficultyIndicator level={problem!.difficulty} size="sm" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        {primaryConcept.commonMistakes && primaryConcept.commonMistakes.length > 0 && (
          <section className="mb-[var(--spacing-2xl)]">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
              Common Mistakes to Avoid
            </h2>
            <ul className="space-y-[var(--spacing-sm)] list-none p-0 m-0">
              {primaryConcept.commonMistakes.map((mistake, i) => (
                <li
                  key={i}
                  className="flex items-start gap-[var(--spacing-sm)] text-[length:var(--text-base)] text-[color:var(--color-text-secondary)] leading-[var(--leading-normal)]"
                >
                  <span className="text-[color:var(--color-difficulty-hard)] mt-[2px] shrink-0">×</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {primaryConcept.interviewTips && primaryConcept.interviewTips.length > 0 && (
          <section className="mb-[var(--spacing-2xl)]">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-text-bright mb-[var(--spacing-lg)]">
              Interview Tips
            </h2>
            <ul className="space-y-[var(--spacing-sm)] list-none p-0 m-0">
              {primaryConcept.interviewTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-[var(--spacing-sm)] text-[length:var(--text-base)] text-[color:var(--color-text-secondary)] leading-[var(--leading-normal)]"
                >
                  <span className="text-[color:var(--color-difficulty-easy)] mt-[2px] shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Last Updated */}
        <div className="text-center py-[var(--spacing-lg)] text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
          <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Last updated {formattedDate}</time>
        </div>
      </main>
    </>
  )
}
