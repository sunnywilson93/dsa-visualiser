import type { Metadata } from 'next'
import { getSystemDesignConceptById, systemDesignConcepts } from '@/data/systemDesignConcepts'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import SystemDesignConceptPageClient from './SystemDesignConceptPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: { conceptId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getSystemDesignConceptById(params.conceptId)

  if (!concept) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  const difficultyLabel = concept.difficulty.charAt(0).toUpperCase() + concept.difficulty.slice(1)
  const keyPointCount = concept.keyPoints.length
  const exampleCount = concept.examples.length

  return {
    title: `Frontend System Design: ${concept.title} — Visual Guide`,
    description: `Learn ${concept.title} with ${keyPointCount} key concepts, ${exampleCount} interactive examples, and interview tips. ${difficultyLabel} level.`,
    keywords: `frontend system design ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, ${concept.title.toLowerCase()} interview question, system design interview, frontend interview`,
    openGraph: {
      title: `Frontend System Design: ${concept.title} — Visual Guide`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/system-design/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/system-design/${concept.id}`,
    },
  }
}

export async function generateStaticParams(): Promise<Array<{ conceptId: string }>> {
  return systemDesignConcepts.map((concept) => ({
    conceptId: concept.id,
  }))
}

function generateFAQSchema(concept: NonNullable<ReturnType<typeof getSystemDesignConceptById>>): object {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `What is ${concept.title} in frontend system design?`,
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

function generateArticleSchema(concept: NonNullable<ReturnType<typeof getSystemDesignConceptById>>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${concept.title} - Frontend System Design Explained`,
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
      '@id': `https://jsinterview.dev/concepts/system-design/${concept.id}`,
    },
    articleSection: 'Frontend System Design',
    keywords: `${concept.title}, System Design, interview preparation, frontend`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

function generateLearningResourceSchema(concept: NonNullable<ReturnType<typeof getSystemDesignConceptById>>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `Frontend System Design: ${concept.title}`,
    description: concept.description,
    educationalLevel: concept.difficulty,
    teaches: `${concept.title} in frontend system design`,
    timeRequired: concept.estimatedReadTime ? `PT${concept.estimatedReadTime}M` : 'PT15M',
    learningResourceType: 'interactive visualization',
    inLanguage: 'en',
    provider: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
  }
}

export default function SystemDesignConceptPage({ params }: Props): JSX.Element {
  const concept = getSystemDesignConceptById(params.conceptId)

  if (!concept) {
    return <SystemDesignConceptPageClient />
  }

  const faqSchema = generateFAQSchema(concept)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'System Design', path: '/concepts/system-design' },
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
      <SystemDesignConceptPageClient />
      <div className="text-center py-[var(--spacing-lg)] text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Last updated {formattedDate}</time>
      </div>
    </>
  )
}
