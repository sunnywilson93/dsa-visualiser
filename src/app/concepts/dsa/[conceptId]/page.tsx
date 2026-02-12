import type { Metadata } from 'next'
import { getDSAConceptById, dsaConcepts } from '@/data/dsaConcepts'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import DSAConceptPageClient from './DSAConceptPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: { conceptId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getDSAConceptById(params.conceptId)

  if (!concept) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  return {
    title: `${concept.title} - DSA Concept Explained | JS Interview Prep`,
    description: `${concept.description} Learn with code examples, complexity analysis, and interview tips.`,
    keywords: `${concept.title.toLowerCase()}, data structures, algorithms, ${concept.title.toLowerCase()} explained, coding interview, dsa`,
    openGraph: {
      title: `${concept.title} - DSA Concept Explained`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/dsa/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/dsa/${concept.id}`,
    },
  }
}

export async function generateStaticParams() {
  return dsaConcepts.map((concept) => ({
    conceptId: concept.id,
  }))
}

function generateFAQSchema(concept: NonNullable<ReturnType<typeof getDSAConceptById>>) {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `What is ${concept.title}?`,
    answer: concept.description,
  })

  faqs.push({
    question: `What are the key points about ${concept.title}?`,
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
      question: `What are interview tips for ${concept.title}?`,
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

function generateArticleSchema(concept: NonNullable<ReturnType<typeof getDSAConceptById>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${concept.title} - DSA Concept Explained`,
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
      '@id': `https://jsinterview.dev/concepts/dsa/${concept.id}`,
    },
    articleSection: 'DSA Tutorials',
    keywords: `${concept.title}, data structures, algorithms, coding interview`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default function DSAConceptPage({ params }: Props) {
  const concept = getDSAConceptById(params.conceptId)

  if (!concept) {
    return <DSAConceptPageClient />
  }

  const faqSchema = generateFAQSchema(concept)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'DSA', path: '/concepts/dsa' },
    { name: concept.title },
  ])
  const articleSchema = generateArticleSchema(concept)

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <DSAConceptPageClient />
    </>
  )
}
