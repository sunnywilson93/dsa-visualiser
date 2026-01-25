'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import { CallStack } from '@/components/CallStack'
import { Controls } from '@/components/Controls'
import { Variables } from '@/components/Variables'
import { Console } from '@/components/Console'
import { VisualizationPanel } from '@/components/Visualization'
import { StepDescription } from '@/components/StepDescription'
import { useExecutionStore } from '@/store'
import { codeExamples, exampleCategories, dsaSubcategories, isDsaSubcategory } from '@/data/examples'
import { getConceptForProblem } from '@/data/algorithmConcepts'
import { ReadOnlyCode } from '@/components/ReadOnlyCode'
import styles from './page.module.css'

// Dynamic import for Monaco editor (heavy, browser-only)
const CodeEditor = dynamic(
  () => import('@/components/CodeEditor').then(mod => mod.CodeEditor),
  { ssr: false, loading: () => <div className={styles.editorLoading}>Loading editor...</div> }
)

export default function PracticePageClient() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const problemId = params.problemId as string

  const setCode = useExecutionStore((state) => state.setCode)
  const reset = useExecutionStore((state) => state.reset)

  const problem = codeExamples.find((p) => p.id === problemId)

  // Get the main category from URL param
  const mainCategory = exampleCategories.find((c) => c.id === categoryId)

  const getSubcategoryName = () => {
    if (!problem || !isDsaSubcategory(problem.category)) return null
    const sub = dsaSubcategories.find((s) => s.id === problem.category)
    return sub?.name
  }

  const subcategoryName = getSubcategoryName()

  // Check if problem has concept visualization
  const { categoryConcept, insight } = problem
    ? getConceptForProblem(problem.id, problem.category)
    : { categoryConcept: null, insight: null }
  const hasConcept = !!(categoryConcept && insight)

  useEffect(() => {
    if (problem) {
      reset()
      setCode(problem.code)
    }
  }, [problem, setCode, reset])

  if (!problem) {
    return (
      <div className={styles.notFound}>
        <h2>Problem not found</h2>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={16} />
          </button>
          <div className={styles.problemInfo}>
            <div className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              {mainCategory && (
                <>
                  <Link href={`/${mainCategory.id}`} className={styles.breadcrumbLink}>
                    {mainCategory.name}
                  </Link>
                  {subcategoryName && (
                    <>
                      <span className={styles.breadcrumbSep}>/</span>
                      <span className={styles.breadcrumbCurrent}>{subcategoryName}</span>
                    </>
                  )}
                </>
              )}
            </div>
            <h1 className={styles.title}>{problem.name}</h1>
          </div>
          <span className={`${styles.difficulty} ${styles[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className={styles.description}>{problem.description}</p>
      </header>

      <main className={styles.main}>
        <section className={styles.editorPanel}>
          {/* Desktop: Monaco Editor (hidden on mobile via CSS) */}
          <div className={styles.desktopEditor}>
            <CodeEditor
              readOnly
              conceptLink={hasConcept ? `/${categoryId}/${problemId}/concept` : undefined}
            />
          </div>

          {/* Mobile: Simple read-only code (hidden on desktop via CSS) */}
          <div className={styles.mobileCode}>
            <ReadOnlyCode code={problem.code} />
          </div>
        </section>

        <section className={styles.centerPanel}>
          <div className={styles.controlsWrapper}>
            <Controls />
          </div>
          <div className={styles.stepDescriptionWrapper}>
            <StepDescription />
          </div>

          <div className={styles.visualizationWrapper}>
            <VisualizationPanel />
          </div>
          <div className={styles.consoleWrapper}>
            <Console />
          </div>
        </section>

        <section className={styles.inspectorPanel}>
          <div className={styles.callStackWrapper}>
            <CallStack />
          </div>
          <div className={styles.variablesWrapper}>
            <Variables />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          Press <kbd>Space</kbd> to run • <kbd>←</kbd><kbd>→</kbd> to step • Click
          gutter to set breakpoints
        </span>
      </footer>
    </div>
  )
}
