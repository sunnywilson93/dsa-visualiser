import type { Metadata } from 'next'
import { getTSConceptById, tsConcepts } from '@/data/tsConcepts'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import TSConceptPageClient from './TSConceptPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: { conceptId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getTSConceptById(params.conceptId)

  if (!concept) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  const difficultyLabel = concept.difficulty.charAt(0).toUpperCase() + concept.difficulty.slice(1)
  const keyPointCount = concept.keyPoints.length
  const exampleCount = concept.examples.length

  return {
    title: `TypeScript ${concept.title} Explained — How ${concept.title} Works (Visual Guide)`,
    description: `Learn ${concept.title} with ${keyPointCount} key concepts, ${exampleCount} interactive examples, and interview tips. ${difficultyLabel} level.`,
    keywords: `typescript ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, how ${concept.title.toLowerCase()} works, ${concept.title.toLowerCase()} interview question, typescript interview, frontend interview`,
    openGraph: {
      title: `TypeScript ${concept.title} — Visual Guide`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/ts/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/ts/${concept.id}`,
    },
  }
}

export async function generateStaticParams(): Promise<Array<{ conceptId: string }>> {
  return tsConcepts.map((concept) => ({
    conceptId: concept.id,
  }))
}

function generateFAQSchema(concept: NonNullable<ReturnType<typeof getTSConceptById>>): Record<string, unknown> {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `What is ${concept.title} in TypeScript?`,
    answer: concept.description,
  })

  faqs.push({
    question: `What are the key points to understand about ${concept.title}?`,
    answer: concept.keyPoints.join('. '),
  })

  if (concept.commonMistakes && concept.commonMistakes.length > 0) {
    faqs.push({
      question: `What are common mistakes with ${concept.title}?`,
      answer: concept.commonMistakes.join('. '),
    })
  }

  if (concept.interviewTips && concept.interviewTips.length > 0) {
    faqs.push({
      question: `What are the interview tips for ${concept.title}?`,
      answer: concept.interviewTips.join('. '),
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

function generateArticleSchema(concept: NonNullable<ReturnType<typeof getTSConceptById>>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${concept.title} - TypeScript Concept Explained`,
    description: concept.description,
    author: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
    },
    publisher: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jsinterview.dev/concepts/ts/${concept.id}`,
    },
    articleSection: 'TypeScript Tutorials',
    keywords: `${concept.title}, TypeScript, interview preparation, coding`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

function generateLearningResourceSchema(concept: NonNullable<ReturnType<typeof getTSConceptById>>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `TypeScript ${concept.title}`,
    description: concept.description,
    educationalLevel: concept.difficulty,
    teaches: `${concept.title} in TypeScript`,
    timeRequired: concept.estimatedReadTime ? `PT${concept.estimatedReadTime}M` : 'PT10M',
    learningResourceType: 'interactive visualization',
    inLanguage: 'en',
    provider: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
  }
}

export default function TSConceptPage({ params }: Props): JSX.Element {
  const concept = getTSConceptById(params.conceptId)

  if (!concept) {
    return <TSConceptPageClient />
  }

  const faqSchema = generateFAQSchema(concept)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'TypeScript', path: '/concepts/ts' },
    { name: concept.title },
  ])
  const articleSchema = generateArticleSchema(concept)
  const learningResourceSchema = generateLearningResourceSchema(concept)

  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <StructuredData data={learningResourceSchema} />
      <TSConceptPageClient />
      <div className="text-center py-[var(--spacing-lg)] text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Last updated {formattedDate}</time>
      </div>
    </>
  )
}
