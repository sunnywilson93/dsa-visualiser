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
import styles from './page.module.css'

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

  if (!problem || !hasConcept) {
    return (
      <div className={styles.notFound}>
        <h2>Concept not found</h2>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={breadcrumbs} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={16} />
          </button>
          <div className={styles.problemInfo}>
            <h1 className={styles.title}>{problem.name}</h1>
          </div>
          <span className={`${styles.difficulty} ${styles[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className={styles.description}>{problem.description}</p>
      </header>

      <main className={styles.main}>
        <div className={styles.conceptWrapper}>
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
          className={styles.practiceLink}
        >
          <Code size={16} />
          <span>Practice the Code</span>
        </Link>
      </main>
    </div>
  )
}
