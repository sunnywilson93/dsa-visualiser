import type { Metadata } from 'next'
import { getConceptById, concepts } from '@/data/concepts'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import ConceptPageClient from './ConceptPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: { conceptId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getConceptById(params.conceptId)

  if (!concept) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  return {
    title: `${concept.title} - JavaScript Concept Explained | JS Interview Prep`,
    description: `${concept.description} Learn with interactive visualizations, code examples, and interview tips.`,
    keywords: `${concept.title.toLowerCase()}, javascript ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, javascript interview, frontend interview`,
    openGraph: {
      title: `${concept.title} - JavaScript Concept Explained`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/js/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/js/${concept.id}`,
    },
  }
}

export async function generateStaticParams() {
  return concepts.map((concept) => ({
    conceptId: concept.id,
  }))
}

function generateFAQSchema(concept: NonNullable<ReturnType<typeof getConceptById>>) {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `What is ${concept.title} in JavaScript?`,
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


function generateArticleSchema(concept: NonNullable<ReturnType<typeof getConceptById>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${concept.title} - JavaScript Concept Explained`,
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
      '@id': `https://jsinterview.dev/concepts/js/${concept.id}`,
    },
    articleSection: 'JavaScript Tutorials',
    keywords: `${concept.title}, JavaScript, interview preparation, coding`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default function ConceptPage({ params }: Props) {
  const concept = getConceptById(params.conceptId)

  if (!concept) {
    return <ConceptPageClient />
  }

  const faqSchema = generateFAQSchema(concept)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'JavaScript', path: '/concepts/js' },
    { name: concept.title },
  ])
  const articleSchema = generateArticleSchema(concept)

  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <ConceptPageClient />
      <div className="sr-only">
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Updated {formattedDate}</time>
      </div>
    </>
  )
}
