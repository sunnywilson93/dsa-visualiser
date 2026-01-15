import type { Metadata } from 'next'
import { getDSAConceptById, dsaConcepts } from '@/data/dsaConcepts'
import DSAConceptPageClient from './DSAConceptPageClient'
import { StructuredData } from '@/components/StructuredData'

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

function generateBreadcrumbSchema(concept: NonNullable<ReturnType<typeof getDSAConceptById>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jsinterview.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Concepts',
        item: 'https://jsinterview.dev/concepts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'DSA',
        item: 'https://jsinterview.dev/concepts/dsa',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: concept.title,
        item: `https://jsinterview.dev/concepts/dsa/${concept.id}`,
      },
    ],
  }
}

export default function DSAConceptPage({ params }: Props) {
  const concept = getDSAConceptById(params.conceptId)

  if (!concept) {
    return <DSAConceptPageClient />
  }

  const faqSchema = generateFAQSchema(concept)
  const breadcrumbSchema = generateBreadcrumbSchema(concept)

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <DSAConceptPageClient />
    </>
  )
}
