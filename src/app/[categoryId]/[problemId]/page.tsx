import type { Metadata } from 'next'
import { type CodeExample, codeExamples, exampleCategories, dsaSubcategories, getProblemRouteCategoryIds } from '@/data/examples'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import PracticePageClient from './PracticePageClient'
import { ProblemSEOContent } from '@/components/ProblemSEOContent/ProblemSEOContent'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

const allCategories = [
  ...exampleCategories,
  ...dsaSubcategories.map(sub => ({ ...sub, description: `Practice ${sub.name} problems` })),
]

interface Props {
  params: { categoryId: string; problemId: string }
}

export async function generateStaticParams() {
  const routeParams: Array<{ categoryId: string; problemId: string }> = []

  codeExamples.forEach((problem) => {
    getProblemRouteCategoryIds(problem).forEach((categoryId) => {
      routeParams.push({
        categoryId,
        problemId: problem.id,
      })
    })
  })

  return routeParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = codeExamples.find((p) => p.id === params.problemId)
  const category = allCategories.find((c) => c.id === params.categoryId)

  if (!problem) {
    return {
      title: 'Problem Not Found | JS Interview Prep',
    }
  }

  const difficultyLabel = problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)
  const description = problem.approach
    ? `${problem.approach} ${problem.patternName ? `Uses ${problem.patternName} pattern.` : ''} Practice with visualization.`
    : `${problem.description}. Practice with interactive code visualization, step-by-step execution, and call stack analysis.`

  return {
    title: `${problem.name} - ${difficultyLabel} | JS Interview Prep`,
    description,
    keywords: `${problem.name.toLowerCase()}, javascript coding problem, ${category?.name.toLowerCase() || ''}, coding interview, ${problem.difficulty} difficulty`,
    openGraph: {
      title: `${problem.name} - JavaScript Coding Challenge`,
      description: problem.approach || problem.description,
      url: `https://jsinterview.dev/${params.categoryId}/${params.problemId}`,
    },
    alternates: {
      canonical: `/${params.categoryId}/${params.problemId}`,
    },
  }
}

function generateFAQSchema(problem: CodeExample) {
  const faqs: { question: string; answer: string }[] = []

  if (problem.approach) {
    faqs.push({
      question: `How do you solve ${problem.name}?`,
      answer: problem.approach,
    })
  }

  if (problem.timeComplexity || problem.spaceComplexity) {
    const parts: string[] = []
    if (problem.timeComplexity) parts.push(`Time complexity: ${problem.timeComplexity}`)
    if (problem.spaceComplexity) parts.push(`Space complexity: ${problem.spaceComplexity}`)
    faqs.push({
      question: `What is the time and space complexity of ${problem.name}?`,
      answer: parts.join('. ') + '.',
    })
  }

  if (problem.whyItWorks) {
    faqs.push({
      question: `Why does the ${problem.name} solution work?`,
      answer: problem.whyItWorks,
    })
  }

  if (faqs.length === 0) return null

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

function generateArticleSchema(problem: CodeExample, categoryId: string) {
  if (!problem.approach) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${problem.name} - JavaScript Solution Explained`,
    description: problem.approach,
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
      '@id': `https://jsinterview.dev/${categoryId}/${problem.id}`,
    },
    articleSection: 'Coding Challenges',
    keywords: `${problem.name}, JavaScript, ${problem.patternName || 'coding'}, interview preparation`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
  }
}

export default function PracticePage({ params }: Props) {
  const problem = codeExamples.find((p) => p.id === params.problemId)
  const category = allCategories.find((c) => c.id === params.categoryId)

  const breadcrumbSchema =
    problem && category
      ? generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.id}` },
          { name: problem.name },
        ])
      : null

  const faqSchema = problem ? generateFAQSchema(problem) : null
  const articleSchema = problem ? generateArticleSchema(problem, params.categoryId) : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      {faqSchema && <StructuredData data={faqSchema} />}
      {articleSchema && <StructuredData data={articleSchema} />}
      <PracticePageClient />
      {problem?.approach && <ProblemSEOContent problem={problem} />}
    </>
  )
}
