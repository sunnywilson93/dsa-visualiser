import type { Metadata } from 'next'
import { getPatternBySlug, dsaPatterns } from '@/data/dsaPatterns'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import PatternPageClient from './PatternPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: Promise<{ patternId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { patternId } = await params
  const pattern = getPatternBySlug(patternId)

  if (!pattern) {
    return {
      title: 'Pattern Not Found | DSA Interview Prep',
    }
  }

  return {
    title: `${pattern.name} Pattern - Algorithm Visualization | DSA Interview Prep`,
    description: `${pattern.description} Learn with interactive step-through visualizations and code examples.`,
    keywords: `${pattern.name.toLowerCase()}, ${pattern.slug} algorithm, dsa pattern, coding interview, leetcode`,
    openGraph: {
      title: `${pattern.name} Pattern - Algorithm Visualization`,
      description: pattern.description,
      url: `https://jsinterview.dev/concepts/dsa/patterns/${pattern.slug}`,
    },
    alternates: {
      canonical: `/concepts/dsa/patterns/${pattern.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return dsaPatterns.map((pattern) => ({
    patternId: pattern.slug,
  }))
}


function generateFAQSchema(pattern: NonNullable<ReturnType<typeof getPatternBySlug>>) {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `When should I use the ${pattern.name} pattern?`,
    answer: pattern.whenToUse.join('. ') + '.',
  })

  if (pattern.variants.length > 0) {
    faqs.push({
      question: `What are the variants of the ${pattern.name} pattern?`,
      answer: pattern.variants
        .map((v) => `${v.name}: ${v.description}`)
        .join(' '),
    })
  }

  faqs.push({
    question: `What is the time and space complexity of the ${pattern.name} pattern?`,
    answer: `The typical time complexity is ${pattern.complexity.time} and the space complexity is ${pattern.complexity.space}.`,
  })

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  }
}

function generateArticleSchema(pattern: NonNullable<ReturnType<typeof getPatternBySlug>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${pattern.name} Pattern - Algorithm Visualization`,
    description: pattern.description,
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
      '@id': `https://jsinterview.dev/concepts/dsa/patterns/${pattern.slug}`,
    },
    articleSection: 'Algorithm Tutorials',
    keywords: `${pattern.name}, algorithm, DSA, coding interview`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default async function PatternPage({ params }: Props) {
  const { patternId } = await params
  const pattern = getPatternBySlug(patternId)

  if (!pattern) {
    return <PatternPageClient patternId={patternId} />
  }

  const faqSchema = generateFAQSchema(pattern)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'DSA Patterns', path: '/concepts/dsa' },
    { name: pattern.name },
  ])
  const articleSchema = generateArticleSchema(pattern)

  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <PatternPageClient patternId={patternId} />
      <div className="sr-only">
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Updated {formattedDate}</time>
      </div>
    </>
  )
}
