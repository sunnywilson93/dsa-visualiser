'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptPanel } from '@/components/ConceptPanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RelatedPatterns } from '@/components/CrossLinks'
import { codeExamples, dsaSubcategories, isDsaSubcategory } from '@/data/examples'
import { getConceptForProblem, getConceptSteps } from '@/data/algorithmConcepts'

export default function ConceptVizPageClient() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const problemId = params.problemId as string

  const problem = codeExamples.find((p) => p.id === problemId)

  const getSubcategoryName = () => {
    if (!problem || !isDsaSubcategory(problem.category)) return null
    const sub = dsaSubcategories.find((s) => s.id === problem.category)
    return sub?.name
  }

  const subcategoryName = getSubcategoryName()

  // Get concept data
  const { categoryConcept, insight } = problem
    ? getConceptForProblem(problem.id, problem.category)
    : { categoryConcept: null, insight: null }

  const conceptSteps = problem ? getConceptSteps(problem.id, problem.category) : []
  const hasConcept = categoryConcept && insight && conceptSteps.length > 0

  // Build breadcrumbs
  const breadcrumbs = [
    { label: 'DSA', path: `/${categoryId}` },
    ...(subcategoryName ? [{ label: subcategoryName }] : []),
    { label: problem?.name || problemId },
  ]

  const difficultyBgColors: Record<string, string> = {
    easy: 'bg-emerald-500/15 text-emerald-400',
    medium: 'bg-amber-500/15 text-amber-400',
    hard: 'bg-red-500/15 text-red-400',
  }

  if (!problem || !hasConcept) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-[var(--spacing-lg)] bg-[var(--color-bg-primary)] text-[var(--color-gray-500)]">
        <h2>Concept not found</h2>
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-accent-blue)]">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-[var(--spacing-lg)] bg-[var(--color-bg-primary)] p-[var(--spacing-lg)] max-md:gap-[var(--spacing-sm)] max-md:p-[var(--spacing-sm)]">
      <NavBar breadcrumbs={breadcrumbs} />

      <header className="mb-[var(--spacing-lg)] flex flex-shrink-0 items-center justify-between gap-[var(--spacing-lg)] max-md:mb-[var(--spacing-sm)] max-md:gap-[var(--spacing-sm)]">
        <div className="flex items-center gap-[var(--spacing-md)] max-md:min-w-0 max-md:flex-1">
          <button 
            onClick={() => router.back()} 
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-all duration-[var(--transition-fast)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col gap-0.5 max-md:min-w-0">
            <h1 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-[var(--color-text-primary)] max-md:text-[var(--spacing-lg)]">
              {problem.name}
            </h1>
          </div>
          <span className={`rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium uppercase ${difficultyBgColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="m-0 text-xs text-[var(--color-text-muted)] max-md:hidden">{problem.description}</p>
      </header>

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center gap-[var(--spacing-lg)] max-md:gap-[var(--spacing-sm)]">
        <div className="w-full">
          <ErrorBoundary>
            <ConceptPanel
              title={categoryConcept!.title}
              keyInsight={insight!.keyInsight}
              type={insight!.pattern}
              steps={conceptSteps}
            />
          </ErrorBoundary>
        </div>

        <RelatedPatterns problemId={problemId} />

        <Link
          href={`/${categoryId}/${problemId}`}
          className="flex items-center justify-center gap-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] px-[var(--spacing-xl)] py-[var(--spacing-md)] text-sm font-semibold text-white no-underline transition-all duration-[var(--transition-fast)] hover:brightness-110 hover:-translate-y-0.5 max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)] max-md:text-[13px]"
        >
          <Code size={16} />
          <span>Practice the Code</span>
        </Link>
      </main>
    </div>
  )
}
