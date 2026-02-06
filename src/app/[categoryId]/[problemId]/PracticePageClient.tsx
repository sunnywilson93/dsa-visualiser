'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/NavBar'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import { ExecutionBar } from '@/components/ExecutionBar'
import { UnifiedVisualization } from '@/components/UnifiedVisualization'
import { useExecutionStore } from '@/store'
import { codeExamples, exampleCategories, dsaSubcategories, isDsaSubcategory } from '@/data/examples'
import { getConceptForProblem } from '@/data/algorithmConcepts'

const CodeEditor = dynamic(
  () => import('@/components/CodeEditor').then(mod => mod.CodeEditor),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg bg-bg-secondary text-text-muted">
        Loading editor...
      </div>
    ) 
  }
)

export default function PracticePageClient() {
  const params = useParams()
  const categoryId = params.categoryId as string
  const problemId = params.problemId as string

  const setCode = useExecutionStore((state) => state.setCode)
  const reset = useExecutionStore((state) => state.reset)
  const startExecution = useExecutionStore((state) => state.startExecution)
  const status = useExecutionStore((state) => state.status)

  const problem = codeExamples.find((p) => p.id === problemId)
  const mainCategory = exampleCategories.find((c) => c.id === categoryId)

  const getSubcategoryName = () => {
    if (!problem || !isDsaSubcategory(problem.category)) return null
    const sub = dsaSubcategories.find((s) => s.id === problem.category)
    return sub?.name
  }

  const subcategoryName = getSubcategoryName()

  // Build breadcrumbs for NavBar
  const breadcrumbs = [
    ...(mainCategory ? [{ label: mainCategory.name, path: `/${mainCategory.id}` }] : []),
    ...(subcategoryName ? [{ label: subcategoryName }] : []),
    { label: problem?.name || problemId },
  ]

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

  const handleAnalyze = () => {
    startExecution()
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-primary">
        <NavBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-text-muted">
          <h2>Problem not found</h2>
          <Link href="/" className="text-accent-blue">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isIdle = status === 'idle'

  return (
    <div className="flex h-screen flex-col bg-bg-primary overflow-hidden">
      {/* Standard NavBar */}
      <NavBar breadcrumbs={breadcrumbs} />

      {/* Problem info bar */}
      <header className="flex items-center gap-4 px-4 py-2 border-b border-border-primary bg-bg-secondary/50">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-semibold text-text-primary truncate">{problem.name}</h1>
          <DifficultyIndicator level={problem.difficulty} size="sm" />
        </div>

        <div className="flex-1" />

        {hasConcept && (
          <Link
            href={`/${categoryId}/${problemId}/concept`}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-lg hover:bg-brand-primary/20 transition-colors flex-shrink-0"
          >
            <span>Concept</span>
          </Link>
        )}
      </header>

      {/* Main content - Two column like Event Loop */}
      <main className="flex-1 min-h-0 grid grid-cols-2 max-lg:grid-cols-1">
        {/* Left: Code Editor */}
        <div className="flex flex-col min-h-0 border-r border-border-primary">
          {/* Code panel header */}
          <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border-primary">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Code</span>
            
            {isIdle ? (
              <motion.button
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 transition-all"
                onClick={handleAnalyze}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={14} />
                <span>Analyze</span>
              </motion.button>
            ) : (
              <span className="text-xs text-text-muted">
                Press <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-text-secondary font-mono">Space</kbd> to play
              </span>
            )}
          </div>
          
          {/* Code editor */}
          <div className="flex-1 min-h-0 p-4">
            <CodeEditor readOnly />
          </div>
        </div>

        {/* Right: Unified Visualization */}
        <div className="flex flex-col min-h-0 bg-bg-secondary/30">
          <UnifiedVisualization />
        </div>
      </main>

      {/* Bottom: Execution Controls */}
      <ExecutionBar />
    </div>
  )
}
