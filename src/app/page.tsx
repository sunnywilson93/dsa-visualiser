import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { CategoryCarousel } from '@/components/CategoryCarousel'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyMiniBar } from '@/components/DifficultyIndicator'
import { HeroStats } from '@/components/HeroStats'
import { StructuredData } from '@/components/StructuredData'
import { SectionContainer, ContentCard } from '@/components/ui'
import { exampleCategories, dsaSubcategories, getExamplesByCategory, getAllJsExamples, getProblemCountByCategory } from '@/data/examples'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import { cssInterviewQuestions, cssTopics } from '@/data/cssInterviewQuestions'
import { htmlInterviewQuestions, htmlTopics } from '@/data/htmlInterviewQuestions'
import { jsInterviewQuestions, jsTopics } from '@/data/jsInterviewQuestions'
import { reactInterviewQuestions, reactTopics } from '@/data/reactInterviewQuestions'
import { bundlerInterviewQuestions, bundlerTopics } from '@/data/bundlerInterviewQuestions'


// JS implementation categories (exclude DSA - it gets its own section)
const jsCategories = exampleCategories.filter(c => c.id !== 'dsa')
const dsaProblems = getExamplesByCategory('dsa')
const allJsProblems = getAllJsExamples()
const totalProblems = allJsProblems.length + dsaProblems.length
const totalConcepts = concepts.length + dsaConcepts.length + dsaPatterns.length
const totalInterviewQuestions = htmlInterviewQuestions.length + cssInterviewQuestions.length + jsInterviewQuestions.length + reactInterviewQuestions.length + bundlerInterviewQuestions.length

const homeFAQSchema = {
  '@context': 'https://schema.org' as const,
  '@type': 'FAQPage' as const,
  mainEntity: [
    {
      '@type': 'Question' as const,
      name: 'How should I prepare for JavaScript coding interviews?',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `Start by understanding core JavaScript concepts like closures, prototypes, and the event loop. Then practice implementing common utilities (debounce, throttle, deep clone) and array polyfills (map, filter, reduce). Finally, solve data structure and algorithm problems. JS Interview Prep covers ${totalConcepts} concepts and ${totalProblems} interactive problems with step-by-step visualization.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: 'What topics are covered on JS Interview Prep?',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `The platform covers ${concepts.length} JavaScript concepts (closures, event loop, prototypes, async patterns), ${dsaConcepts.length + dsaPatterns.length} DSA topics (arrays, trees, graphs, dynamic programming), ${totalProblems} coding problems across ${jsCategories.length + dsaSubcategories.length} categories, and ${totalInterviewQuestions} interview questions for HTML, CSS, JavaScript, React, and Bundlers. Every problem includes an interactive step-through debugger that visualizes execution.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: 'Does JS Interview Prep have HTML, CSS, JavaScript, React, and Bundler interview questions?',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `Yes, JS Interview Prep includes ${totalInterviewQuestions} curated interview questions: ${htmlInterviewQuestions.length} HTML questions covering semantics, accessibility, forms, and modern APIs, ${cssInterviewQuestions.length} CSS questions covering box model, flexbox, grid, specificity, and architecture, ${jsInterviewQuestions.length} JavaScript questions covering closures, async patterns, prototypes, and modern ES6+ features, ${reactInterviewQuestions.length} React questions covering hooks, state management, Server Components, and React 19 features, plus ${bundlerInterviewQuestions.length} Bundler questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown. Each question includes an answer, code example, follow-up question, and key takeaway.`,
      },
    },
    {
      '@type': 'Question' as const,
      name: 'Is JS Interview Prep free?',
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: 'Yes, JS Interview Prep is completely free. All concepts, problems, and interactive visualizations are available without any account or payment. The platform is designed to help developers prepare for frontend and coding interviews with hands-on practice.',
      },
    },
  ],
}

// Featured concepts: very-high interview frequency, diverse topics
const featuredConceptIds = ['scope-basics', 'closure-definition', 'array-iteration-methods', 'microtask-queue']
const featuredConcepts = featuredConceptIds
  .map(id => concepts.find(c => c.id === id))
  .filter(Boolean) as typeof concepts

// First 8 DSA subcategories for preview grid
const dsaPreviewSubcategories = dsaSubcategories.slice(0, 8)

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <StructuredData data={homeFAQSchema} />
      <NavBar />

      {/* Hero */}
      <header className="text-center py-10 px-8">
        <h1 className="text-3xl font-bold text-brand-light m-0 mb-3 max-md:text-2xl">
          JavaScript Interview Prep — Interactive Visualizations & {totalProblems}+ Practice Problems
        </h1>
        <p className="text-text-secondary text-md m-0 max-w-[36rem] mx-auto">
          Step through code execution, explore {concepts.length} concepts, and solve {allJsProblems.length + dsaProblems.length} problems with visual explanations
        </p>
        <HeroStats stats={[
          { value: concepts.length, label: 'Concepts' },
          { value: allJsProblems.length + dsaProblems.length, label: 'Problems' },
          { value: jsCategories.length + dsaSubcategories.length, label: 'Categories' },
        ]} />
        <div className="flex items-center justify-center gap-4 mt-6 max-sm:flex-col max-sm:gap-3">
          <Link
            href="/concepts"
            className="inline-block py-2.5 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg text-base font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            Start Learning
          </Link>
          <Link
            href="/js-problems"
            className="inline-block py-2.5 px-6 rounded-lg text-base font-semibold text-brand-primary no-underline border border-brand-primary-40 transition-all duration-300 hover:bg-brand-primary-10 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            Browse Problems
          </Link>
        </div>
      </header>

      <main className="flex-1 py-6 px-8 pb-8 container-default mx-auto w-full">
        {/* Popular Starting Points */}
        <SectionContainer title="Popular Starting Points">
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {featuredConcepts.map(concept => (
              <ContentCard
                key={concept.id}
                href={`/concepts/js/${concept.id}`}
                variant="interactive"
              >
                <h3 className="text-base font-semibold text-text-bright m-0 mb-1">{concept.title}</h3>
                <p className="text-sm text-text-secondary m-0 leading-normal">{concept.shortDescription}</p>
                <span className="text-xs text-text-muted mt-2 block">{concept.estimatedReadTime} min read</span>
              </ContentCard>
            ))}
          </div>
        </SectionContainer>

        {/* Section 1: UNDERSTAND - Concepts */}
        <SectionContainer
          number={1}
          title="Understand"
          subtitle={<>What interviewers ask you to <strong>explain</strong></>}
          viewAllHref="/concepts"
          viewAllLabel="View All →"
        >
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-4 items-stretch">
            <ContentCard href="/concepts/js" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="js-core" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{concepts.length} topics</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">JavaScript Deep Dive</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                Closures, Event Loop, Prototypes, This, V8 Engine
              </p>
            </ContentCard>

            <ContentCard href="/concepts/dsa" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="data-structures" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{dsaConcepts.length + dsaPatterns.length} topics</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">DSA Fundamentals</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                Big O, Arrays, Hash Tables, Stacks, Queues, Linked Lists
              </p>
            </ContentCard>
          </div>
        </SectionContainer>

        {/* Section 2: BUILD - JavaScript Implementations */}
        <SectionContainer
          number={2}
          title="Build"
          subtitle={<>What interviewers ask you to <strong>implement</strong></>}
          viewAllHref="/js-problems"
          viewAllLabel={`All ${allJsProblems.length} Problems →`}
        >
          <CategoryCarousel>
            {jsCategories.map((category) => {
              const problems = getExamplesByCategory(category.id)
              const easyCount = problems.filter(p => p.difficulty === 'easy').length
              const mediumCount = problems.filter(p => p.difficulty === 'medium').length
              const hardCount = problems.filter(p => p.difficulty === 'hard').length
              return (
                <ContentCard
                  key={category.id}
                  href={`/${category.id}`}
                  variant="feature"
                  className="h-full min-h-[200px] max-md:min-h-[180px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl leading-none text-brand-primary">
                      <ConceptIcon conceptId={category.id} size={32} />
                    </span>
                    <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">
                      {problems.length} problems
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0">{category.name}</h3>
                  <p className="text-base text-text-secondary m-0 leading-normal flex-1">{category.description}</p>
                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border-card">
                    <span className="text-sm text-text-secondary font-medium">
                      {easyCount}E · {mediumCount}M · {hardCount}H
                    </span>
                    <DifficultyMiniBar easy={easyCount} medium={mediumCount} hard={hardCount} />
                  </div>
                </ContentCard>
              )
            })}
          </CategoryCarousel>
        </SectionContainer>

        {/* Section 3: SOLVE - Data Structures & Algorithms */}
        <SectionContainer
          number={3}
          title="Solve"
          subtitle={<>For <strong>algorithm-focused</strong> interview rounds</>}
        >
          <div className="rounded-2xl border border-border-card bg-bg-page-secondary p-6">
            <div className="flex justify-between items-center mb-6 max-lg:flex-col max-lg:items-start max-lg:gap-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="dsa" size={32} />
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-text-bright m-0 mb-1 max-md:text-xl">Data Structures & Algorithms</h3>
                  <p className="text-base text-text-secondary m-0">
                    Arrays, Trees, Graphs, Dynamic Programming, and more
                  </p>
                </div>
              </div>
              <div className="flex gap-8 max-lg:w-full max-lg:justify-start max-lg:gap-10">
                <div className="text-center">
                  <span className="block text-3xl font-bold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-none">{dsaProblems.length}</span>
                  <span className="text-sm text-text-secondary uppercase tracking-wide">Problems</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-none">{dsaSubcategories.length}</span>
                  <span className="text-sm text-text-secondary uppercase tracking-wide">Topics</span>
                </div>
              </div>
            </div>

            {/* Subcategory preview grid */}
            <div className="grid grid-cols-4 gap-3 mb-6 max-lg:grid-cols-3 max-md:grid-cols-2">
              {dsaPreviewSubcategories.map(sub => {
                const count = getProblemCountByCategory(sub.id)
                return (
                  <ContentCard
                    key={sub.id}
                    href={`/${sub.id}`}
                    variant="compact"
                  >
                    <span className="flex-shrink-0 text-brand-primary">
                      <ConceptIcon conceptId={sub.id} size={20} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-text-bright block truncate">{sub.name}</span>
                      <span className="text-xs text-text-muted">{count} problems</span>
                    </div>
                  </ContentCard>
                )
              })}
            </div>

            <div className="text-center">
              <Link
                href="/dsa"
                className="inline-block py-2.5 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg text-base font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                Explore All DSA Topics →
              </Link>
            </div>
          </div>
        </SectionContainer>

        {/* Section 4: ANSWER - Interview Prep */}
        <SectionContainer
          number={4}
          title="Answer"
          subtitle={<>What interviewers ask you to <strong>explain verbally</strong></>}
          viewAllHref="/interview"
          viewAllLabel="View All →"
        >
          <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 items-stretch">
            <ContentCard href="/interview/html" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="html" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{htmlInterviewQuestions.length} questions</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">HTML Interview Questions</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                {htmlTopics.map(t => t.label).join(', ')}
              </p>
            </ContentCard>

            <ContentCard href="/interview/css" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="css" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{cssInterviewQuestions.length} questions</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">CSS Interview Questions</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                {cssTopics.map(t => t.label).join(', ')}
              </p>
            </ContentCard>

            <ContentCard href="/interview/js" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="js-core" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{jsInterviewQuestions.length} questions</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">JavaScript Interview Questions</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                {jsTopics.map(t => t.label).join(', ')}
              </p>
            </ContentCard>

            <ContentCard href="/interview/react" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="react" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{reactInterviewQuestions.length} questions</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">React Interview Questions</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                {reactTopics.map(t => t.label).join(', ')}
              </p>
            </ContentCard>

            <ContentCard href="/interview/bundlers" variant="feature" className="h-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center text-brand-primary">
                  <ConceptIcon conceptId="bundlers" size={28} />
                </span>
                <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{bundlerInterviewQuestions.length} questions</span>
              </div>
              <h3 className="text-xl font-bold text-text-bright m-0">Bundler Interview Questions</h3>
              <p className="text-base text-text-secondary m-0 leading-normal flex-1">
                {bundlerTopics.map(t => t.label).join(', ')}
              </p>
            </ContentCard>
          </div>
        </SectionContainer>
      </main>

      {/* Utility footer */}
      <footer className="text-center py-4 px-8 text-text-muted text-sm max-md:py-3 max-md:px-4">
        <div className="flex items-center justify-center gap-4 max-sm:flex-col max-sm:gap-2">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="inline-block px-1.5 py-0.5 rounded bg-white-8 text-text-secondary text-xs font-mono border border-border-card">⌘K</kbd>
            <span>to search</span>
          </span>
          <span className="text-white-20 max-sm:hidden">·</span>
          <Link href="/playground/event-loop" className="text-text-muted no-underline hover:text-brand-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none focus-visible:rounded">
            Open Playground
          </Link>
        </div>
      </footer>
    </div>
  )
}
