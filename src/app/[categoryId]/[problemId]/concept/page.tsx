import type { Metadata } from 'next'
import { codeExamples } from '@/data/examples'
import { getConceptForProblem } from '@/data/algorithmConcepts'
import ConceptVizPageClient from './ConceptVizPageClient'

interface Props {
  params: { categoryId: string; problemId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = codeExamples.find((p) => p.id === params.problemId)

  if (!problem) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  const { categoryConcept } = getConceptForProblem(problem.id, problem.category)

  return {
    title: `${problem.name} - Algorithm Concept Explained | JS Interview Prep`,
    description: `Understand the algorithm behind ${problem.name}. ${categoryConcept?.title || 'Step-by-step'} visualization with key insights and patterns.`,
    keywords: `${problem.name.toLowerCase()}, algorithm visualization, ${categoryConcept?.title.toLowerCase() || 'algorithm'}, coding interview patterns`,
    openGraph: {
      title: `${problem.name} - Algorithm Concept`,
      description: `Learn the algorithm pattern for ${problem.name}`,
      url: `https://jsinterview.dev/${params.categoryId}/${params.problemId}/concept`,
    },
    alternates: {
      canonical: `/${params.categoryId}/${params.problemId}/concept`,
    },
  }
}

export default function ConceptVisualizationPage() {
  return <ConceptVizPageClient />
}
