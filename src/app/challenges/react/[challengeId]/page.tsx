import type { Metadata } from 'next'
import { reactChallenges, getReactChallengeById } from '@/data/reactChallenges'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { ChallengePageClient } from './ChallengePageClient'

interface Props {
  params: { challengeId: string }
}

export async function generateStaticParams(): Promise<Array<{ challengeId: string }>> {
  return reactChallenges.map((challenge) => ({
    challengeId: challenge.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const challenge = getReactChallengeById(params.challengeId)

  if (!challenge) {
    return {
      title: 'Challenge Not Found | JS Interview Prep',
    }
  }

  const difficultyLabel =
    challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)

  return {
    title: `${challenge.title} — React Coding Challenge (${difficultyLabel}) | JS Interview Prep`,
    description: `${challenge.description.slice(0, 150)}... Practice with an interactive code editor.`,
    keywords: `react challenge, ${challenge.title.toLowerCase()}, react practice, ${challenge.skills.join(', ')}, react interview`,
    openGraph: {
      title: `${challenge.title} — React Coding Challenge`,
      description: challenge.shortDescription,
      url: `https://jsinterview.dev/challenges/react/${challenge.id}`,
    },
    alternates: {
      canonical: `/challenges/react/${challenge.id}`,
    },
  }
}

function generateFAQSchema(
  challenge: NonNullable<ReturnType<typeof getReactChallengeById>>
): Record<string, unknown> {
  const faqs = [
    {
      question: `What does the "${challenge.title}" challenge involve?`,
      answer: challenge.description,
    },
    {
      question: `What React skills does "${challenge.title}" practice?`,
      answer: `This challenge practices: ${challenge.skills.join(', ')}. It is rated ${challenge.difficulty} difficulty and takes approximately ${challenge.estimatedTime} minutes.`,
    },
    {
      question: `What are the hints for "${challenge.title}"?`,
      answer: challenge.hints.join(' '),
    },
  ]

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

function generateArticleSchema(
  challenge: NonNullable<ReturnType<typeof getReactChallengeById>>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${challenge.title} — React Coding Challenge`,
    description: challenge.description,
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
      '@id': `https://jsinterview.dev/challenges/react/${challenge.id}`,
    },
    articleSection: 'React Challenges',
    keywords: `${challenge.title}, React, coding challenge, practice`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default function ReactChallengePage({ params }: Props): JSX.Element {
  const challenge = getReactChallengeById(params.challengeId)

  if (!challenge) {
    return <ChallengePageClient />
  }

  const faqSchema = generateFAQSchema(challenge)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'React Challenges', path: '/challenges/react' },
    { name: challenge.title },
  ])
  const articleSchema = generateArticleSchema(challenge)

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <ChallengePageClient challenge={challenge} />
    </>
  )
}
