import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { concepts } from '@/data/concepts'
import { reactConcepts } from '@/data/reactConcepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { TopQuestionsPageClient } from './TopQuestionsPageClient'
import type { AggregatedQuestion } from './TopQuestionsPageClient'

type Domain = 'javascript' | 'react' | 'dsa'

interface DomainConfig {
  title: string
  metaTitle: string
  description: string
  breadcrumbLabel: string
}

const domainConfigs: Record<Domain, DomainConfig> = {
  javascript: {
    title: 'Top JavaScript Interview Questions',
    metaTitle: 'Top 50 JavaScript Interview Questions (2026)',
    description:
      'The most common JavaScript interview questions with detailed answers. Filter by difficulty, search by keyword, and link to interactive explanations.',
    breadcrumbLabel: 'JavaScript',
  },
  react: {
    title: 'Top React Interview Questions',
    metaTitle: 'Top 30 React Interview Questions (2026)',
    description:
      'Essential React interview questions covering hooks, rendering, patterns, and performance. Each answer links to an interactive visualization.',
    breadcrumbLabel: 'React',
  },
  dsa: {
    title: 'Top DSA Questions for Frontend Interviews',
    metaTitle: 'Top 30 DSA Questions for Frontend Interviews',
    description:
      'Data structures and algorithms questions commonly asked in frontend engineering interviews. Master the fundamentals with interactive explanations.',
    breadcrumbLabel: 'DSA',
  },
}

const validDomains = ['javascript', 'react', 'dsa'] as const

function isDomain(value: string): value is Domain {
  return (validDomains as readonly string[]).includes(value)
}

function aggregateJSQuestions(): AggregatedQuestion[] {
  const questions: AggregatedQuestion[] = []
  for (const concept of concepts) {
    if (concept.commonQuestions) {
      for (const q of concept.commonQuestions) {
        questions.push({
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty,
          sourceConceptId: concept.id,
          sourceDomain: 'javascript',
        })
      }
    }
  }
  return questions
}

function aggregateReactQuestions(): AggregatedQuestion[] {
  const questions: AggregatedQuestion[] = []
  for (const concept of reactConcepts) {
    const tips = concept.interviewTips ?? []
    const keyPoints = concept.keyPoints ?? []
    const combined = [...tips, ...keyPoints]
    if (combined.length === 0) continue

    const topItems = combined.slice(0, 2)
    for (const item of topItems) {
      questions.push({
        question: `What is important to know about ${concept.title}?`,
        answer: item,
        difficulty: concept.difficulty === 'beginner' ? 'easy' : concept.difficulty === 'intermediate' ? 'medium' : 'hard',
        sourceConceptId: concept.id,
        sourceDomain: 'react',
      })
    }
  }
  return deduplicateQuestions(questions)
}

function aggregateDSAQuestions(): AggregatedQuestion[] {
  const questions: AggregatedQuestion[] = []
  for (const concept of dsaConcepts) {
    const tips = concept.interviewTips ?? []
    const keyPoints = concept.keyPoints ?? []
    const combined = [...tips, ...keyPoints]
    if (combined.length === 0) continue

    const topItems = combined.slice(0, 2)
    for (const item of topItems) {
      questions.push({
        question: `What should you know about ${concept.title}?`,
        answer: item,
        difficulty: concept.difficulty === 'beginner' ? 'easy' : concept.difficulty === 'intermediate' ? 'medium' : 'hard',
        sourceConceptId: concept.id,
        sourceDomain: 'dsa',
      })
    }
  }
  return deduplicateQuestions(questions)
}

function deduplicateQuestions(questions: AggregatedQuestion[]): AggregatedQuestion[] {
  const seen = new Set<string>()
  return questions.filter((q) => {
    const key = q.question + q.answer
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getQuestions(domain: Domain): AggregatedQuestion[] {
  switch (domain) {
    case 'javascript':
      return aggregateJSQuestions()
    case 'react':
      return aggregateReactQuestions()
    case 'dsa':
      return aggregateDSAQuestions()
  }
}

function generateFAQSchema(questions: AggregatedQuestion[]) {
  const faqEntries = questions.slice(0, 20)
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqEntries.map((q) => ({
      '@type': 'Question' as const,
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: q.answer,
      },
    })),
  }
}

export function generateStaticParams(): Array<{ domain: string }> {
  return validDomains.map((domain) => ({ domain }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const { domain } = await params
  if (!isDomain(domain)) return {}

  const config = domainConfigs[domain]
  return {
    title: config.metaTitle,
    description: config.description,
    openGraph: {
      title: config.metaTitle,
      description: config.description,
      url: `https://jsinterview.dev/top-questions/${domain}`,
    },
    alternates: {
      canonical: `/top-questions/${domain}`,
    },
  }
}

export default async function TopQuestionsPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain } = await params
  if (!isDomain(domain)) notFound()

  const config = domainConfigs[domain]
  const questions = getQuestions(domain)
  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Top Questions', path: '/top-questions' },
    { name: config.breadcrumbLabel },
  ])
  const faqSchema = generateFAQSchema(questions)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      <NavBar />

      <TopQuestionsPageClient
        title={config.title}
        description={config.description}
        questions={questions}
        domain={domain}
      />

      <footer className="py-6 text-center text-xs text-text-muted">
        <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>
          Updated {formattedDate}
        </time>
      </footer>
    </div>
  )
}
