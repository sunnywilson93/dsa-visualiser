import type { Metadata } from 'next'
import { codeExamples, exampleCategories } from '@/data/examples'
import PracticePageClient from './PracticePageClient'

interface Props {
  params: { categoryId: string; problemId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = codeExamples.find((p) => p.id === params.problemId)
  const category = exampleCategories.find((c) => c.id === params.categoryId)

  if (!problem) {
    return {
      title: 'Problem Not Found | JS Interview Prep',
    }
  }

  const difficultyLabel = problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)

  return {
    title: `${problem.name} - ${difficultyLabel} | JS Interview Prep`,
    description: `${problem.description}. Practice with interactive code visualization, step-by-step execution, and call stack analysis.`,
    keywords: `${problem.name.toLowerCase()}, javascript coding problem, ${category?.name.toLowerCase() || ''}, coding interview, ${problem.difficulty} difficulty`,
    openGraph: {
      title: `${problem.name} - JavaScript Coding Challenge`,
      description: problem.description,
      url: `https://jsinterview.dev/${params.categoryId}/${params.problemId}`,
    },
    alternates: {
      canonical: `/${params.categoryId}/${params.problemId}`,
    },
  }
}

export default function PracticePage() {
  return <PracticePageClient />
}
