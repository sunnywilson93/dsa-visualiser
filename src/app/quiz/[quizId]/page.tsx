import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { quizzes, getQuizById } from '@/data/quizzes'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { QuizPageClient } from './QuizPageClient'

interface Props {
  params: { quizId: string }
}

export async function generateStaticParams(): Promise<Array<{ quizId: string }>> {
  return quizzes.map(q => ({ quizId: q.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quiz = getQuizById(params.quizId)

  if (!quiz) {
    return { title: 'Quiz Not Found | JS Interview Prep' }
  }

  const difficultyLabel = quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)

  return {
    title: `${quiz.title} — ${quiz.questions.length}-Question ${quiz.domain.toUpperCase()} Quiz | JS Interview Prep`,
    description: `${quiz.description} ${difficultyLabel} difficulty, ${quiz.questions.length} questions, ~${quiz.estimatedTime} minutes.`,
    keywords: quiz.targetKeywords.join(', '),
    openGraph: {
      title: `${quiz.title} — ${quiz.domain.toUpperCase()} Quiz`,
      description: quiz.shortDescription,
      url: `https://jsinterview.dev/quiz/${quiz.id}`,
    },
    alternates: {
      canonical: `/quiz/${quiz.id}`,
    },
  }
}

function generateFAQSchema(quiz: NonNullable<ReturnType<typeof getQuizById>>): object {
  const faqs = [
    {
      question: `What does the "${quiz.title}" quiz cover?`,
      answer: quiz.description,
    },
    {
      question: `How many questions are in the ${quiz.title} quiz?`,
      answer: `The quiz contains ${quiz.questions.length} questions and takes approximately ${quiz.estimatedTime} minutes to complete. Difficulty: ${quiz.difficulty}.`,
    },
    {
      question: `Who should take the ${quiz.title} quiz?`,
      answer: `This quiz is designed for developers preparing for frontend interviews who want to test their ${quiz.domain === 'js' ? 'JavaScript' : quiz.domain === 'react' ? 'React' : quiz.domain === 'ts' ? 'TypeScript' : 'DSA'} knowledge. It is rated ${quiz.difficulty} difficulty.`,
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function generateArticleSchema(quiz: NonNullable<ReturnType<typeof getQuizById>>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${quiz.title} - Interactive ${quiz.domain.toUpperCase()} Quiz`,
    description: quiz.description,
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
      '@id': `https://jsinterview.dev/quiz/${quiz.id}`,
    },
    articleSection: 'Interactive Quizzes',
    keywords: quiz.targetKeywords.join(', '),
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default function QuizDetailPage({ params }: Props): React.ReactElement {
  const quiz = getQuizById(params.quizId)

  if (!quiz) {
    notFound()
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Quizzes', path: '/quiz' },
    { name: quiz.title },
  ])
  const faqSchema = generateFAQSchema(quiz)
  const articleSchema = generateArticleSchema(quiz)

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={articleSchema} />
      <QuizPageClient quiz={quiz} />
    </>
  )
}
