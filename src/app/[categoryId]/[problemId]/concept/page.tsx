import type { Metadata } from 'next'
import { codeExamples, exampleCategories } from '@/data/examples'
import { getConceptForProblem } from '@/data/algorithmConcepts'
import ConceptVizPageClient from './ConceptVizPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

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

export default function ConceptVisualizationPage({ params }: Props) {
  const problem = codeExamples.find((p) => p.id === params.problemId)
  const category = exampleCategories.find((c) => c.id === params.categoryId)

  const breadcrumbSchema =
    problem && category
      ? generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.id}` },
          { name: problem.name, path: `/${params.categoryId}/${params.problemId}` },
          { name: 'Algorithm Concept' },
        ])
      : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <ConceptVizPageClient />
    </>
  )
}
