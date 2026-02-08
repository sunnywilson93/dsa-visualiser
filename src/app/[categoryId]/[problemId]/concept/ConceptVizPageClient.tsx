'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Code } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptPanel } from '@/components/ConceptPanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RelatedPatterns } from '@/components/CrossLinks'
import { codeExamples, dsaSubcategories, isDsaSubcategory } from '@/data/examples'
import { getConceptForProblem, getConceptSteps } from '@/data/algorithmConcepts'

export default function ConceptVizPageClient() {
  const params = useParams()
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
    ...(subcategoryName ? [{ label: subcategoryName, path: `/${categoryId}` }] : []),
    { label: problem?.name || problemId, path: `/${categoryId}/${problemId}` },
  ]

  const difficultyBgColors: Record<string, string> = {
    easy: 'bg-emerald-500/15 text-emerald-400',
    medium: 'bg-amber-500/15 text-amber-400',
    hard: 'bg-red-500/15 text-red-400',
  }

  if (!problem || !hasConcept) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-primary">
        <NavBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-text-muted">
          <h2>Concept not found</h2>
          <Link href="/" className="text-accent-blue">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-[var(--spacing-lg)] bg-[var(--color-bg-primary)] p-[var(--spacing-lg)] max-md:gap-[var(--spacing-sm)] max-md:p-[var(--spacing-sm)]">
      <NavBar breadcrumbs={breadcrumbs} />

      {/* Problem info bar */}
      <header className="flex items-center gap-4 px-4 py-2 border-b border-border-primary bg-bg-secondary/50 rounded-lg mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-semibold text-text-primary truncate m-0">{problem.name}</h1>
          <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${difficultyBgColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex-1" />
        <p className="m-0 text-xs text-text-muted max-md:hidden">{problem.description}</p>
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
          className="flex items-center justify-center gap-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] px-[var(--spacing-xl)] py-[var(--spacing-md)] text-sm font-semibold text-white no-underline transition-all duration-[var(--transition-fast)] hover:brightness-110 max-md:px-[var(--spacing-md)] max-md:py-[var(--spacing-sm)] max-md:text-[13px]"
        >
          <Code size={16} />
          <span>Practice the Code</span>
        </Link>
      </main>
    </div>
  )
}
