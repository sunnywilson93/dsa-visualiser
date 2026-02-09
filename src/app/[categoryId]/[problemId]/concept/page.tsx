import type { Metadata } from 'next'
import { codeExamples, exampleCategories, dsaSubcategories, isDsaSubcategory } from '@/data/examples'
import { getConceptForProblem, problemConcepts, type ProblemConcept } from '@/data/algorithmConcepts'
import ConceptVizPageClient from './ConceptVizPageClient'
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
  return codeExamples
    .filter((problem) => problemConcepts[problem.id])
    .map((problem) => {
      const category = exampleCategories.find(
        (cat) => cat.id === problem.category ||
        (cat.id === 'dsa' && isDsaSubcategory(problem.category))
      )
      return {
        categoryId: category?.id || problem.category,
        problemId: problem.id,
      }
    })
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

function generateHowToSchema(problemName: string, concept: ProblemConcept) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to solve ${problemName} using ${concept.title}`,
    description: concept.keyInsight,
    step: concept.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description || step.title,
    })),
  }
}

export default function ConceptVisualizationPage({ params }: Props) {
  const problem = codeExamples.find((p) => p.id === params.problemId)
  const category = allCategories.find((c) => c.id === params.categoryId)
  const concept = problem ? problemConcepts[problem.id] : null

  const breadcrumbSchema =
    problem && category
      ? generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.id}` },
          { name: problem.name, path: `/${params.categoryId}/${params.problemId}` },
          { name: 'Algorithm Concept' },
        ])
      : null

  const howToSchema = problem && concept ? generateHowToSchema(problem.name, concept) : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      {howToSchema && <StructuredData data={howToSchema} />}
      <ConceptVizPageClient />
      {concept && (
        <section className="bg-bg-secondary border-t border-white-8 px-lg py-xl">
          <div className="mx-auto flex max-w-[800px] flex-col gap-xl">
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              Step-by-Step Walkthrough: {concept.title}
            </h2>
            <p className="text-base leading-relaxed text-text-primary">
              {concept.keyInsight}
            </p>
            <ol className="flex list-decimal flex-col gap-lg pl-lg">
              {concept.steps.map((step) => (
                <li key={step.id} className="text-text-secondary">
                  <strong className="text-text-primary">{step.title}</strong>
                  {step.description && (
                    <p className="mt-xs text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </>
  )
}
