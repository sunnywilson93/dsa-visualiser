import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { comparisons, getComparison } from '@/data/comparisons'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { ComparisonPageClient } from './ComparisonPageClient'

interface Props {
  params: { comparisonId: string }
}

export async function generateStaticParams(): Promise<Array<{ comparisonId: string }>> {
  return comparisons.map((c) => ({ comparisonId: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = getComparison(params.comparisonId)
  if (!comparison) return { title: 'Comparison Not Found | JS Interview Prep' }

  const title = `${comparison.title} — Differences Explained | JS Interview`
  const description = comparison.shortDescription

  return {
    title,
    description,
    keywords: comparison.targetKeywords.join(', '),
    openGraph: {
      title,
      description,
      url: `https://jsinterview.dev/compare/${comparison.id}`,
      type: 'article',
    },
    alternates: {
      canonical: `/compare/${comparison.id}`,
    },
  }
}

function generateFAQSchema(comparison: NonNullable<ReturnType<typeof getComparison>>) {
  if (comparison.interviewQuestions.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: comparison.interviewQuestions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

function generateArticleSchema(comparison: NonNullable<ReturnType<typeof getComparison>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${comparison.title} — Differences Explained`,
    description: comparison.shortDescription,
    url: `https://jsinterview.dev/compare/${comparison.id}`,
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'JS Interview',
      url: 'https://jsinterview.dev',
    },
  }
}

export default function ComparisonPage({ params }: Props) {
  const comparison = getComparison(params.comparisonId)
  if (!comparison) notFound()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Comparisons' },
    { name: comparison.title },
  ])
  const faqSchema = generateFAQSchema(comparison)
  const articleSchema = generateArticleSchema(comparison)

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}
      <StructuredData data={articleSchema} />
      <ComparisonPageClient comparison={comparison} />
    </>
  )
}
