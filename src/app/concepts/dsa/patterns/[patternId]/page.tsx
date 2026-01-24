import type { Metadata } from 'next'
import { getPatternBySlug, dsaPatterns } from '@/data/dsaPatterns'
import PatternPageClient from './PatternPageClient'
import { StructuredData } from '@/components/StructuredData'

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

function generateBreadcrumbSchema(pattern: NonNullable<ReturnType<typeof getPatternBySlug>>) {
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
        name: 'DSA Patterns',
        item: 'https://jsinterview.dev/concepts/dsa/patterns',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: pattern.name,
        item: `https://jsinterview.dev/concepts/dsa/patterns/${pattern.slug}`,
      },
    ],
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
  }
}

export default async function PatternPage({ params }: Props) {
  const { patternId } = await params
  const pattern = getPatternBySlug(patternId)

  if (!pattern) {
    return <PatternPageClient patternId={patternId} />
  }

  const breadcrumbSchema = generateBreadcrumbSchema(pattern)
  const articleSchema = generateArticleSchema(pattern)

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <PatternPageClient patternId={patternId} />
    </>
  )
}
