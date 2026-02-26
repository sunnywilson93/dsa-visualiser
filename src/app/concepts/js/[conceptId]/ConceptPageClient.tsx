'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, Award, Gamepad2, Code2, Link2, Hammer, BookOpen } from 'lucide-react'
import { PageLayout } from '@/components/ui'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import { getConceptById, getRelatedConcepts, getRelatedProblems, concepts as jsConcepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { codeExamples } from '@/data/examples'

// Lazy load visualizations - each loads only when its concept page is visited
const visualizations: Record<string, React.ComponentType> = {
  // Philosophy
  'js-philosophy': dynamic(() => import('@/components/Concepts/JSPhilosophyViz').then(m => m.JSPhilosophyViz)),

  // Engineering Foundations
  'mental-execution-model': dynamic(() => import('@/components/Concepts/MentalExecutionModelViz').then(m => m.MentalExecutionModelViz)),
  'values-and-memory': dynamic(() => import('@/components/Concepts/ValuesAndMemoryViz').then(m => m.ValuesAndMemoryViz)),
  'expressions-vs-statements': dynamic(() => import('@/components/Concepts/ExpressionsVsStatementsViz').then(m => m.ExpressionsVsStatementsViz)),
  'reading-code': dynamic(() => import('@/components/Concepts/ReadingCodeViz').then(m => m.ReadingCodeViz)),
  'debugging-mindset': dynamic(() => import('@/components/Concepts/DebuggingMindsetViz').then(m => m.DebuggingMindsetViz)),

  // Beginner Basics
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
  
  // Phase 1: Scope & Hoisting
  'scope-basics': dynamic(() => import('@/components/Concepts/ScopeHoistingViz').then(m => m.ScopeHoistingViz)),
  'hoisting-variables': dynamic(() => import('@/components/Concepts/HoistingViz').then(m => m.HoistingViz)),
  'hoisting-functions': dynamic(() => import('@/components/Concepts/HoistingViz').then(m => m.HoistingViz)),
  'temporal-dead-zone': dynamic(() => import('@/components/Concepts/ScopeHoistingViz').then(m => m.ScopeHoistingViz)),
  'lexical-scope': dynamic(() => import('@/components/Concepts/ScopeHoistingViz').then(m => m.ScopeHoistingViz)),
  
  // Phase 2: Async Foundation
  'callbacks-basics': dynamic(() => import('@/components/Concepts/CallbacksBasicsViz').then(m => m.CallbacksBasicsViz)),
  'error-first-callbacks': dynamic(() => import('@/components/Concepts/ErrorFirstCallbacksViz').then(m => m.ErrorFirstCallbacksViz)),
  'callback-hell': dynamic(() => import('@/components/Concepts/CallbackHellViz').then(m => m.CallbackHellViz)),
  'promises-creation': dynamic(() => import('@/components/Concepts/PromisesCreationViz').then(m => m.PromisesCreationViz)),
  'promises-chaining': dynamic(() => import('@/components/Concepts/PromisesChainingViz').then(m => m.PromisesChainingViz)),
  'promises-then-catch': dynamic(() => import('@/components/Concepts/PromisesThenCatchViz').then(m => m.PromisesThenCatchViz)),
  'promises-static-methods': dynamic(() => import('@/components/Concepts/PromisesStaticViz').then(m => m.PromisesStaticViz)),
  'async-await-basics': dynamic(() => import('@/components/Concepts/AsyncAwaitSyntaxViz').then(m => m.AsyncAwaitSyntaxViz)),
  'async-await-parallel': dynamic(() => import('@/components/Concepts/AsyncAwaitParallelViz').then(m => m.AsyncAwaitParallelViz)),
  'async-await-error-handling': dynamic(() => import('@/components/Concepts/AsyncAwaitErrorsViz').then(m => m.AsyncAwaitErrorsViz)),
  
  // Phase 3: Array Mastery
  'array-mutation-methods': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-iteration-methods': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-transformation': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-searching': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-sorting': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-searching-sorting': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-reduce-patterns': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  'array-immutable-patterns': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
  
  // Phase 4: Closure & Prototypes
  'closure-definition': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-practical-uses': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-in-loops': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-loops-classic': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-memory': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-memory-leaks': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-patterns': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-module-pattern': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-partial-application': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'module-pattern': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'prototype-chain-basics': dynamic(() => import('@/components/Concepts/PrototypeChainBasicsViz').then(m => m.PrototypeChainBasicsViz)),
  'property-lookup': dynamic(() => import('@/components/Concepts/PropertyLookupViz').then(m => m.PropertyLookupViz)),
  'class-syntax-sugar': dynamic(() => import('@/components/Concepts/ClassSyntaxViz').then(m => m.ClassSyntaxViz)),
  'class-syntax-prototypes': dynamic(() => import('@/components/Concepts/ClassSyntaxViz').then(m => m.ClassSyntaxViz)),
  'instanceof-operator': dynamic(() => import('@/components/Concepts/InstanceofViz').then(m => m.InstanceofViz)),
  'object-create': dynamic(() => import('@/components/Concepts/PrototypesViz').then(m => m.PrototypesViz)),
  'prototype-inheritance': dynamic(() => import('@/components/Concepts/PrototypeInheritanceViz').then(m => m.PrototypeInheritanceViz)),
  'prototype-pollution': dynamic(() => import('@/components/Concepts/PrototypePollutionViz').then(m => m.PrototypePollutionViz)),
  
  // Phase 5: Event Loop
  'call-stack-basics': dynamic(() => import('@/components/Concepts/EventLoopGranularViz').then(m => m.EventLoopGranularViz)),
  'web-apis-overview': dynamic(() => import('@/components/Concepts/EventLoopViz').then(m => m.EventLoopViz)),
  'task-queue-macrotasks': dynamic(() => import('@/components/Concepts/TaskQueueViz').then(m => m.TaskQueueViz)),
  'microtask-queue': dynamic(() => import('@/components/Concepts/MicrotaskQueueViz').then(m => m.MicrotaskQueueViz)),
  'event-loop-tick': dynamic(() => import('@/components/Concepts/EventLoopTickViz').then(m => m.EventLoopTickViz)),
  'event-loop-priority': dynamic(() => import('@/components/Concepts/EventLoopGranularViz').then(m => m.EventLoopGranularViz)),
  'javascript-runtime-model': dynamic(() => import('@/components/Concepts/EventLoopViz').then(m => m.EventLoopViz)),
  'event-loop-starvation': dynamic(() => import('@/components/Concepts/EventLoopGranularViz').then(m => m.EventLoopGranularViz)),
  
  // Phase 6: Modern JS
  'destructuring-complete': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'spread-operator-patterns': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'rest-parameters': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'template-literals': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'optional-chaining': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'nullish-coalescing': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  'logical-assignment': dynamic(() => import('@/components/Concepts/ModernJSViz').then(m => m.ModernJSViz)),
  
  // Phase 7: Error Handling
  'try-catch-finally': dynamic(() => import('@/components/Concepts/ErrorHandlingViz').then(m => m.ErrorHandlingViz)),
  'error-types-native': dynamic(() => import('@/components/Concepts/ErrorHandlingViz').then(m => m.ErrorHandlingViz)),
  'throwing-custom-errors': dynamic(() => import('@/components/Concepts/ErrorHandlingViz').then(m => m.ErrorHandlingViz)),
  
  // Phase 8: Type Coercion
  'implicit-coercion-rules': dynamic(() => import('@/components/Concepts/TypeCoercionViz').then(m => m.TypeCoercionViz)),
  'coercion-edge-cases': dynamic(() => import('@/components/Concepts/TypeCoercionViz').then(m => m.TypeCoercionViz)),
}

// Helper to determine if a concept is a JS concept or DSA concept
function getConceptParentSection(conceptId: string): { label: string; path: string } {
  const isJsConcept = jsConcepts.some(c => c.id === conceptId)
  if (isJsConcept) {
    return { label: 'JS Concepts', path: '/concepts/js' }
  }
  const isDsaConcept = dsaConcepts.some(c => c.id === conceptId)
  if (isDsaConcept) {
    return { label: 'DSA Concepts', path: '/concepts/dsa' }
  }
  return { label: 'Concepts', path: '/concepts' }
}

export default function ConceptPageClient(): JSX.Element {
  const params = useParams()
  const conceptId = params.conceptId as string

  const concept = conceptId ? getConceptById(conceptId) : undefined

  if (!concept) {
    return (
      <PageLayout variant="content">
        <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-lg)] text-text-muted">
          <h1>Concept not found</h1>
          <Link href="/concepts" className="text-[color:var(--color-brand-primary)]">Back to Concepts</Link>
        </div>
      </PageLayout>
    )
  }

  const Visualization = visualizations[concept.id]
  const parentSection = getConceptParentSection(concept.id)

  return (
    <PageLayout
      variant="content"
      breadcrumbs={[
        { label: 'Concepts', path: '/concepts' },
        { label: parentSection.label, path: parentSection.path },
        { label: concept.title },
      ]}
    >
        {/* Header */}
        <header className="mb-8">
          <div className="mb-[var(--spacing-lg)] flex items-center gap-[var(--spacing-md)] max-md:flex-wrap">
            <span className="text-4xl leading-none">
              <ConceptIcon conceptId={concept.id} size={32} />
            </span>
            <h1 className="m-0 text-3xl font-bold text-text-bright max-md:text-2xl">
              {concept.title}
            </h1>
            <DifficultyIndicator level={concept.difficulty} size="md" />
          </div>

          <p className="m-0 text-[length:var(--text-md)] leading-[1.7] text-text-muted max-md:text-base">
            {concept.description}
          </p>
        </header>

        {/* Interactive Visualization */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Gamepad2 size={20} className="text-[color:var(--color-brand-primary)]" />
            Interactive Visualization
          </h2>
          <div className="min-h-[300px] rounded-[var(--radius-xl)] border border-[var(--border-card)] bg-[var(--color-black-30)] p-[var(--spacing-xl)] max-md:min-h-[200px] max-md:p-[var(--spacing-lg)]">
            {Visualization ? (
              <ErrorBoundary>
                <Visualization />
              </ErrorBoundary>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-text-muted">
                Visualization coming soon
              </div>
            )}
          </div>
        </section>

        {/* Understanding Section — SEO prose content */}
        {concept.explanation && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
              <BookOpen size={20} className="text-[color:var(--color-brand-primary)]" />
              Understanding {concept.title}
            </h2>
            <div className="flex flex-col gap-[var(--spacing-lg)]">
              {concept.explanation.split('\n\n').map((paragraph, i) => (
                <p key={i} className="m-0 text-base leading-[1.8] text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Key Points */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Lightbulb size={20} className="text-[color:var(--color-brand-primary)]" />
            Key Points
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {concept.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                className="relative pl-6 leading-[var(--leading-normal)] text-text-secondary before:absolute before:left-0 before:font-bold before:text-[color:var(--color-brand-primary)] before:content-['→']"
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
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
            <Code2 size={20} className="text-[color:var(--color-brand-primary)]" />
            Code Examples
          </h2>
          <div className="flex flex-col gap-[var(--spacing-xl)]">
            {concept.examples.map((example, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-card)] bg-[var(--surface-card)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="m-0 border-b border-[var(--border-card)] bg-[var(--color-brand-primary-15)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-[0.95rem] font-semibold text-white">
                  {example.title}
                </h3>
                <pre className="m-0 overflow-x-auto bg-[var(--color-black-40)] p-[var(--spacing-lg)] font-mono text-base leading-[var(--leading-relaxed)] text-text-secondary max-md:p-[var(--spacing-md)] max-md:text-[length:var(--text-sm)]">
                  <code className="whitespace-pre">{example.code}</code>
                </pre>
                <p className="m-0 border-t border-[var(--color-white-5)] bg-[var(--color-brand-primary-5)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-base leading-[var(--leading-relaxed)] text-text-muted">
                  {example.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        {concept.commonMistakes && concept.commonMistakes.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
              <AlertTriangle size={20} className="text-[color:var(--color-brand-primary)]" />
              Common Mistakes
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.commonMistakes.map((mistake, i) => (
                <li 
                  key={i} 
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-red-500)] bg-[var(--color-red-10)] py-1.5 pl-8 pr-3 text-base text-red-300 before:absolute before:left-2.5 before:text-[color:var(--color-accent-red)] before:content-['✗']"
                >
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interview Tips */}
        {concept.interviewTips && concept.interviewTips.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
              <Award size={20} className="text-[color:var(--color-brand-primary)]" />
              Interview Tips
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[var(--spacing-sm)] p-0">
              {concept.interviewTips.map((tip, i) => (
                <li 
                  key={i} 
                  className="relative rounded-r-md border-l-4 border-l-[var(--color-emerald-500)] bg-[var(--color-emerald-10)] py-1.5 pl-8 pr-3 text-base text-[color:var(--color-emerald-400)] before:absolute before:left-2.5 before:text-[var(--difficulty-1)] before:content-['✓']"
                >
                  {tip}
                </li>
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
            <section className="mb-10">
              <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
                <Hammer size={20} className="text-[color:var(--color-brand-primary)]" />
                Practice Problems
              </h2>
              <p className="mb-4 -mt-2 text-base text-text-muted">
                Apply this concept by solving these {problems.length} problems
              </p>
              <div className="grid grid-cols-auto-md gap-[var(--spacing-md)]">
                {problems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/${problem.category}/${problem.id}`}
                    className="flex flex-col gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-[var(--border-card)] bg-[var(--surface-card)] p-[var(--spacing-md)] px-[var(--spacing-lg)] no-underline transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-white-5)] hover:border-[var(--color-brand-primary-40)]"
                  >
                    <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
                      <h3 className="m-0 text-[0.95rem] font-semibold text-text-bright">{problem.name}</h3>
                      <DifficultyIndicator level={problem.difficulty} size="sm" />
                    </div>
                    <p className="m-0 text-[length:var(--text-sm)] leading-[var(--leading-snug)] text-text-muted">
                      {problem.description}
                    </p>
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
            <section className="mb-10">
              <h2 className="mb-4 flex items-center gap-2.5 border-b border-[var(--border-card)] pb-2.5 text-lg font-semibold text-text-bright">
                <Link2 size={20} className="text-[color:var(--color-brand-primary)]" />
                Related Concepts
              </h2>
              <div className="grid grid-cols-auto-sm gap-[var(--spacing-lg)]">
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/concepts/js/${related.id}`}
                    className="flex items-center gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--border-card)] bg-[var(--surface-card)] p-[var(--spacing-lg)] no-underline transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-white-5)] hover:border-[var(--color-brand-primary-40)]"
                  >
                    <span className="text-[1.75rem] leading-none">
                      <ConceptIcon conceptId={related.id} size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-[0.95rem] font-semibold text-text-bright">{related.title}</h3>
                      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--text-base)] text-text-muted">
                        {related.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
    </PageLayout>
  )
}
