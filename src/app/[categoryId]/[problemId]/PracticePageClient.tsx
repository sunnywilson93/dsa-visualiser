'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const router = useRouter()
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary text-text-muted">
        <h2>Problem not found</h2>
        <Link href="/" className="inline-flex items-center gap-2 text-accent-blue">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    )
  }

  const difficultyClasses: Record<string, string> = {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const isIdle = status === 'idle'

  return (
    <div className="flex h-screen flex-col bg-bg-primary overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border-primary bg-bg-secondary/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">{problem.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${difficultyClasses[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Link href="/" className="hover:text-text-secondary">Home</Link>
              <span>/</span>
              {mainCategory && (
                <>
                  <Link href={`/${mainCategory.id}`} className="hover:text-text-secondary">{mainCategory.name}</Link>
                  {subcategoryName && (
                    <>
                      <span>/</span>
                      <span className="text-text-secondary">{subcategoryName}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <p className="hidden md:block text-sm text-text-muted max-w-md truncate">
          {problem.description}
        </p>

        {hasConcept && (
          <Link
            href={`/${categoryId}/${problemId}/concept`}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-lg hover:bg-brand-primary/20 transition-colors"
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
