import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { dsaConcepts } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import { dsaSubcategories, getExamplesByCategory } from '@/data/examples'

export const metadata: Metadata = {
  title: 'DSA Roadmap - Step-by-Step Learning Path | JS Interview Prep',
  description:
    'Follow a structured roadmap to learn Data Structures and Algorithms for coding interviews. Start with Big O, progress through arrays, trees, and graphs, then master patterns like two pointers and binary search.',
  keywords:
    'dsa roadmap, data structures roadmap, algorithm learning path, coding interview preparation, leetcode roadmap',
  openGraph: {
    title: 'DSA Roadmap - Step-by-Step Learning Path',
    description:
      'A structured guide to mastering DSA for coding interviews with interactive visualizations.',
    url: 'https://jsinterview.dev/concepts/dsa/roadmap',
  },
  alternates: {
    canonical: '/concepts/dsa/roadmap',
  },
}

const foundations = dsaConcepts.filter((c) => c.category === 'foundations')
const dataStructures = dsaConcepts.filter(
  (c) => c.category === 'data-structures',
)
const algorithms = dsaConcepts.filter((c) => c.category === 'algorithms')

const stages = [
  {
    number: 1,
    title: 'Foundations',
    description:
      'Understand how to measure algorithm efficiency and how data is represented at the binary level.',
    concepts: foundations,
    basePath: '/concepts/dsa',
  },
  {
    number: 2,
    title: 'Core Data Structures',
    description:
      'Learn the data structures that form the building blocks of every algorithm. Start with arrays and hash tables, then progress to stacks, queues, and linked lists.',
    concepts: dataStructures,
    basePath: '/concepts/dsa',
  },
  {
    number: 3,
    title: 'Algorithms',
    description:
      'Master the fundamental algorithmic techniques: graph traversals, recursion, backtracking, and sorting. These form the backbone of interview problem-solving.',
    concepts: algorithms,
    basePath: '/concepts/dsa',
  },
  {
    number: 4,
    title: 'Problem-Solving Patterns',
    description:
      'Learn reusable patterns that apply across dozens of problems. Recognizing these patterns is the key skill interviewers test for.',
    patterns: dsaPatterns,
    basePath: '/concepts/dsa/patterns',
  },
]

const recommendedProblems: { stage: string; categoryId: string; count: number }[] = [
  { stage: 'Start here', categoryId: 'arrays-hashing', count: getExamplesByCategory('arrays-hashing').length },
  { stage: 'Then try', categoryId: 'two-pointers', count: getExamplesByCategory('two-pointers').length },
  { stage: 'Level up', categoryId: 'binary-search', count: getExamplesByCategory('binary-search').length },
  { stage: 'Challenge', categoryId: 'dynamic-programming', count: getExamplesByCategory('dynamic-programming').length },
]

function generateHowToSchema() {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'HowTo' as const,
    name: 'How to Learn Data Structures and Algorithms Step by Step',
    description:
      'A structured learning path for mastering DSA for coding interviews, from Big O notation through advanced patterns.',
    step: stages.map((stage) => ({
      '@type': 'HowToStep' as const,
      name: `Stage ${stage.number}: ${stage.title}`,
      text: stage.description,
    })),
    totalTime: 'P8W',
  }
}

const difficultyColor: Record<string, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-amber-400',
  advanced: 'text-red-400',
}

export default function DSARoadmapPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'DSA', path: '/concepts/dsa' },
    { name: 'Roadmap' },
  ])
  const howToSchema = generateHowToSchema()
  const formattedDate = CONTENT_LAST_UPDATED.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={howToSchema} />
      <NavBar />

      <main className="flex-1 py-8 px-8 pb-12 container-default mx-auto w-full">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-bright mb-3 max-md:text-2xl">
            DSA Learning Roadmap
          </h1>
          <p className="text-text-secondary text-md max-w-[40rem] mx-auto">
            A structured path from foundations to advanced patterns. Follow this
            roadmap to build interview-ready DSA skills with interactive
            visualizations.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {stages.map((stage) => (
            <section key={stage.number}>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-primary rounded-lg text-base font-bold text-white">
                  {stage.number}
                </span>
                <h2 className="text-xl font-bold text-text-bright">
                  {stage.title}
                </h2>
              </div>
              <p className="text-base text-text-secondary mb-4 max-w-[48rem]">
                {stage.description}
              </p>

              <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                {stage.concepts?.map((concept) => (
                  <Link
                    key={concept.id}
                    href={`${stage.basePath}/${concept.id}`}
                    className="flex flex-col gap-1 rounded-xl p-4 no-underline text-inherit border border-white-10 bg-white-3 transition-all duration-200 hover:border-brand-primary-40 hover:bg-brand-primary-5 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                  >
                    <span className="text-base font-semibold text-text-bright">
                      {concept.title}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {concept.shortDescription}
                    </span>
                    <span
                      className={`text-xs font-medium mt-1 ${difficultyColor[concept.difficulty]}`}
                    >
                      {concept.difficulty}
                    </span>
                  </Link>
                ))}

                {stage.patterns?.map((pattern) => (
                  <Link
                    key={pattern.id}
                    href={`${stage.basePath}/${pattern.slug}`}
                    className="flex flex-col gap-1 rounded-xl p-4 no-underline text-inherit border border-white-10 bg-white-3 transition-all duration-200 hover:border-brand-primary-40 hover:bg-brand-primary-5 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                  >
                    <span className="text-base font-semibold text-text-bright">
                      {pattern.name}
                    </span>
                    <span className="text-sm text-text-secondary line-clamp-2">
                      {pattern.description}
                    </span>
                    <span className="text-xs text-text-muted mt-1">
                      {pattern.complexity.time} time · {pattern.complexity.space}{' '}
                      space
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-text-bright mb-4">
              Recommended Practice Order
            </h2>
            <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {recommendedProblems.map((rec) => {
                const sub = dsaSubcategories.find((s) => s.id === rec.categoryId)
                return (
                  <Link
                    key={rec.categoryId}
                    href={`/${rec.categoryId}`}
                    className="flex flex-col gap-1 rounded-xl p-4 no-underline text-inherit border border-brand-primary-20 bg-brand-primary-5 transition-all duration-200 hover:border-brand-primary-40 hover:bg-brand-primary-10 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                  >
                    <span className="text-xs font-medium text-brand-primary uppercase tracking-wide">
                      {rec.stage}
                    </span>
                    <span className="text-base font-semibold text-text-bright">
                      {sub?.name ?? rec.categoryId}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {rec.count} problems
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-xs text-text-muted">
          <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>
            Updated {formattedDate}
          </time>
        </footer>
      </main>
    </div>
  )
}
