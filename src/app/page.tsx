import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { CategoryCarousel } from '@/components/CategoryCarousel'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator, DifficultyMiniBar } from '@/components/DifficultyIndicator'
import { exampleCategories, getExamplesByCategory, getAllJsExamples } from '@/data/examples'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'


// JS implementation categories (exclude DSA - it gets its own section)
const jsCategories = exampleCategories.filter(c => c.id !== 'dsa')
const dsaCategory = exampleCategories.find(c => c.id === 'dsa')!
const dsaProblems = getExamplesByCategory('dsa')
const allJsProblems = getAllJsExamples()

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar />

      <header className="text-center py-8 px-8 pt-8">
        <h1 className="text-3xl font-bold text-brand-light m-0 mb-3">JS Interview Prep</h1>
        <p className="text-text-secondary text-md m-0">
          Master JavaScript for frontend interviews with interactive visualizations
        </p>
      </header>

      <main className="flex-1 py-6 px-8 pb-8 container-default mx-auto w-full">
        {/* Section 1: UNDERSTAND - Concepts */}
        <section className="mb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-text-bright m-0">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-brand-primary rounded-lg text-base font-bold text-white">1</span>
                Understand
              </h2>
              <p className="text-base text-text-secondary mt-1 mb-0">
                What interviewers ask you to <strong>explain</strong>
              </p>
            </div>
            <Link href="/concepts" className="text-base text-brand-primary no-underline py-2 px-0 hover:text-brand-secondary transition-colors duration-250">
              View All →
            </Link>
          </div>

          {/* Two concept category cards */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-4 items-stretch">
            <Link href="/concepts/js" className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-300 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40 h-full">
              <div className="bg-bg-page-secondary rounded-xl p-6 flex flex-col gap-3 h-full">
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
              </div>
            </Link>

            <Link href="/concepts/dsa" className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-300 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40 h-full">
              <div className="bg-bg-page-secondary rounded-xl p-6 flex flex-col gap-3 h-full">
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
              </div>
            </Link>
          </div>
        </section>

        {/* Section 2: BUILD - JavaScript Implementations */}
        <section className="mb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-text-bright m-0">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-brand-primary rounded-lg text-base font-bold text-white">2</span>
                Build
              </h2>
              <p className="text-base text-text-secondary mt-1 mb-0">
                What interviewers ask you to <strong>implement</strong>
              </p>
            </div>
            <Link href="/js-problems" className="text-base text-brand-primary no-underline py-2 px-0 hover:text-brand-secondary transition-colors duration-250">
              All {allJsProblems.length} Problems →
            </Link>
          </div>

          <CategoryCarousel>
            {jsCategories.map((category) => {
              const problems = getExamplesByCategory(category.id)
              const easyCount = problems.filter(p => p.difficulty === 'easy').length
              const mediumCount = problems.filter(p => p.difficulty === 'medium').length
              const hardCount = problems.filter(p => p.difficulty === 'hard').length
              return (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-300 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40 h-full"
                >
                  <div className="bg-bg-page-secondary rounded-xl p-6 flex flex-col gap-3 h-full min-h-[200px] max-md:min-h-[180px]">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl leading-none">
                        <ConceptIcon conceptId={category.id} size={32} />
                      </span>
                      <DifficultyIndicator
                        level={hardCount > 0 ? 'hard' : mediumCount > 0 ? 'medium' : 'easy'}
                        size="md"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0">{category.name}</h3>
                    <p className="text-base text-text-secondary m-0 leading-normal flex-1">{category.description}</p>
                    <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border-card">
                      <span className="text-sm text-brand-primary font-medium">{problems.length} problems</span>
                      <DifficultyMiniBar easy={easyCount} medium={mediumCount} hard={hardCount} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </CategoryCarousel>
        </section>

        {/* Section 3: SOLVE - Data Structures & Algorithms */}
        <section className="mb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-text-bright m-0">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-brand-primary rounded-lg text-base font-bold text-white">3</span>
                Solve
              </h2>
              <p className="text-base text-text-secondary mt-1 mb-0">
                For <strong>algorithm-focused</strong> interview rounds
              </p>
            </div>
          </div>

          <Link href="/dsa" className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-300 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40">
            <div className="bg-bg-page-secondary rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 max-lg:flex-col max-lg:items-start max-lg:gap-4">
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
                    <span className="block text-3xl font-bold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-none">19</span>
                    <span className="text-sm text-text-secondary uppercase tracking-wide">Topics</span>
                  </div>
                </div>
              </div>
              <span className="inline-block py-2.5 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg text-base font-semibold text-white">Explore DSA Problems →</span>
            </div>
          </Link>
        </section>
      </main>

      <footer className="text-center py-6 px-8 text-text-muted text-base border-t border-border-card max-md:py-4 max-md:px-4">
        <p>Understand concepts → Build implementations → Solve problems</p>
      </footer>
    </div>
  )
}
