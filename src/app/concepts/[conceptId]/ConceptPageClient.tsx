'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, AlertTriangle, Award, Gamepad2, Code2, Link2, Hammer } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConceptIcon } from '@/components/Icons'
import { getConceptById, getRelatedConcepts, getRelatedProblems } from '@/data/concepts'
import { codeExamples } from '@/data/examples'

import styles from './page.module.css'

// Lazy load visualizations - each loads only when its concept page is visited
const visualizations: Record<string, React.ComponentType> = {
  // Beginner
  'js-philosophy': dynamic(() => import('@/components/Concepts/JSPhilosophyViz').then(m => m.JSPhilosophyViz)),
  'variables': dynamic(() => import('@/components/Concepts/VariablesViz').then(m => m.VariablesViz)),
  'data-types': dynamic(() => import('@/components/Concepts/DataTypesViz').then(m => m.DataTypesViz)),
  'operators': dynamic(() => import('@/components/Concepts/OperatorsViz').then(m => m.OperatorsViz)),
  'functions': dynamic(() => import('@/components/Concepts/FunctionsViz').then(m => m.FunctionsViz)),
  'conditionals': dynamic(() => import('@/components/Concepts/ConditionalsViz').then(m => m.ConditionalsViz)),
  'loops': dynamic(() => import('@/components/Concepts/LoopsViz').then(m => m.LoopsViz)),
  'arrays-basics': dynamic(() => import('@/components/Concepts/ArraysBasicsViz').then(m => m.ArraysBasicsViz)),
  'objects-basics': dynamic(() => import('@/components/Concepts/ObjectsBasicsViz').then(m => m.ObjectsBasicsViz)),
  // Intermediate/Advanced
  'hoisting': dynamic(() => import('@/components/Concepts/HoistingViz').then(m => m.HoistingViz)),
  'type-coercion': dynamic(() => import('@/components/Concepts/TypeCoercionViz').then(m => m.TypeCoercionViz)),
  'closures': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'this-keyword': dynamic(() => import('@/components/Concepts/ThisKeywordViz').then(m => m.ThisKeywordViz)),
  'event-loop': dynamic(() => import('@/components/Concepts/EventLoopViz').then(m => m.EventLoopViz)),
  'prototypes': dynamic(() => import('@/components/Concepts/PrototypesViz').then(m => m.PrototypesViz)),
  'recursion': dynamic(() => import('@/components/Concepts/RecursionViz').then(m => m.RecursionViz)),
  'memory-model': dynamic(() => import('@/components/Concepts/MemoryModelViz').then(m => m.MemoryModelViz)),
  'v8-engine': dynamic(() => import('@/components/Concepts/V8EngineViz').then(m => m.V8EngineViz)),
  'nodejs-event-loop': dynamic(() => import('@/components/Concepts/NodeEventLoopViz').then(m => m.NodeEventLoopViz)),
  'streams-buffers': dynamic(() => import('@/components/Concepts/StreamsBuffersViz').then(m => m.StreamsBuffersViz)),
  'critical-render-path': dynamic(() => import('@/components/Concepts/CriticalRenderPathViz').then(m => m.CriticalRenderPathViz)),
  'web-workers': dynamic(() => import('@/components/Concepts/WebWorkersViz').then(m => m.WebWorkersViz)),
  'web-evolution': dynamic(() => import('@/components/Concepts/WebEvolutionViz').then(m => m.WebEvolutionViz)),
  'module-evolution': dynamic(() => import('@/components/Concepts/ModuleEvolutionViz').then(m => m.ModuleEvolutionViz)),
  'async-evolution': dynamic(() => import('@/components/Concepts/AsyncEvolutionViz').then(m => m.AsyncEvolutionViz)),
  'state-evolution': dynamic(() => import('@/components/Concepts/StateEvolutionViz').then(m => m.StateEvolutionViz)),
  'build-tools-evolution': dynamic(() => import('@/components/Concepts/BuildToolsEvolutionViz').then(m => m.BuildToolsEvolutionViz)),
  // Phase 1: JavaScript Deep Dive
  'promises-deep-dive': dynamic(() => import('@/components/Concepts/PromisesViz').then(m => m.PromisesViz)),
  'function-composition': dynamic(() => import('@/components/Concepts/CompositionViz').then(m => m.CompositionViz)),
  'timing-control': dynamic(() => import('@/components/Concepts/TimingViz').then(m => m.TimingViz)),
  'memoization': dynamic(() => import('@/components/Concepts/MemoizationViz').then(m => m.MemoizationViz)),
}

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function ConceptPageClient(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const conceptId = params.conceptId as string

  const concept = conceptId ? getConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.notFound}>
          <h1>Concept not found</h1>
          <Link href="/concepts">Back to Concepts</Link>
        </div>
      </div>
    )
  }

  const Visualization = visualizations[concept.id]

  return (
    <div className={styles.page}>
      <NavBar
        breadcrumbs={[
          { label: 'Concepts', path: '/concepts' },
          { label: concept.title },
        ]}
      />

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.push('/concepts')}>
            <ArrowLeft size={18} />
            <span>All Concepts</span>
          </button>

          <div className={styles.titleRow}>
            <span className={styles.icon}>
              <ConceptIcon conceptId={concept.id} size={32} />
            </span>
            <h1 className={styles.title}>{concept.title}</h1>
            <span
              className={styles.difficulty}
              style={{ background: difficultyColors[concept.difficulty] }}
            >
              {concept.difficulty}
            </span>
          </div>

          <p className={styles.description}>{concept.description}</p>
        </header>

        {/* Interactive Visualization */}
        <section className={styles.vizSection}>
          <h2 className={styles.sectionTitle}>
            <Gamepad2 size={20} className={styles.sectionIconSvg} />
            Interactive Visualization
          </h2>
          <div className={styles.vizContainer}>
            {Visualization ? (
              <ErrorBoundary>
                <Visualization />
              </ErrorBoundary>
            ) : (
              <div className={styles.vizPlaceholder}>
                Visualization coming soon
              </div>
            )}
          </div>
        </section>

        {/* Key Points */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={20} className={styles.sectionIconSvg} />
            Key Points
          </h2>
          <ul className={styles.keyPoints}>
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Code Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Code2 size={20} className={styles.sectionIconSvg} />
            Code Examples
          </h2>
          <div className={styles.examples}>
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className={styles.example}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className={styles.exampleTitle}>{example.title}</h3>
                <pre className={styles.code}>
                  <code>{example.code}</code>
                </pre>
                <p className={styles.explanation}>{example.explanation}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} className={styles.sectionIconSvg} />
              Common Mistakes
            </h2>
            <ul className={styles.mistakes}>
              {concept.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Award size={20} className={styles.sectionIconSvg} />
              Interview Tips
            </h2>
            <ul className={styles.tips}>
              {concept.interviewTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Practice Problems - Link to problems this concept helps solve */}
        {(() => {
          const problemIds = getRelatedProblems(concept.id)
          const problems = problemIds
            .map(id => codeExamples.find(e => e.id === id))
            .filter((p): p is typeof codeExamples[0] => p !== undefined)
          if (problems.length === 0) return null
          return (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Hammer size={20} className={styles.sectionIconSvg} />
                Practice Problems
              </h2>
              <p className={styles.sectionSubtitle}>
                Apply this concept by solving these {problems.length} problems
              </p>
              <div className={styles.problemsGrid}>
                {problems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/${problem.category}/${problem.id}`}
                    className={styles.problemCard}
                  >
                    <div className={styles.problemHeader}>
                      <h3 className={styles.problemTitle}>{problem.name}</h3>
                      <span className={`${styles.problemDifficulty} ${styles[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className={styles.problemDesc}>{problem.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}

        {/* Related Concepts - Internal Linking for SEO */}
        {(() => {
          const relatedConcepts = getRelatedConcepts(concept.id)
          if (relatedConcepts.length === 0) return null
          return (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Link2 size={20} className={styles.sectionIconSvg} />
                Related Concepts
              </h2>
              <div className={styles.relatedConcepts}>
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/concepts/${related.id}`}
                    className={styles.relatedCard}
                  >
                    <span className={styles.relatedIcon}>
                      <ConceptIcon conceptId={related.id} size={24} />
                    </span>
                    <div className={styles.relatedInfo}>
                      <h3 className={styles.relatedTitle}>{related.title}</h3>
                      <p className={styles.relatedDesc}>{related.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
      </main>
    </div>
  )
}
