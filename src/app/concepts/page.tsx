'use client'

import Link from 'next/link'
import { Clock, ArrowRight, Map, FileText } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { ConceptIcon } from '@/components/Icons/ConceptIcon'
import { concepts, conceptCategories } from '@/data/concepts'
import { dsaConcepts, dsaConceptCategories } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import { reactConcepts, reactConceptCategories } from '@/data/reactConcepts'

// Top 5 JS categories by concept count
const topJsCategories = conceptCategories
  .map(cat => ({
    ...cat,
    count: concepts.filter(c => c.category === cat.id).length,
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5)

// All DSA categories with counts
const dsaCatsWithCounts = dsaConceptCategories.map(cat => ({
  ...cat,
  count: dsaConcepts.filter(c => c.category === cat.id).length,
}))

// All React categories with counts
const reactCatsWithCounts = reactConceptCategories.map(cat => ({
  ...cat,
  count: reactConcepts.filter(c => c.category === cat.id).length,
}))

// Pick 3 diverse very-high interview concepts (different subcategories)
const quickStartConcepts = (() => {
  const veryHigh = concepts.filter(c => c.interviewFrequency === 'very-high')
  const seen = new Set<string>()
  const picks: typeof veryHigh = []
  for (const c of veryHigh) {
    const key = c.subcategory ?? c.category
    if (!seen.has(key) && picks.length < 3) {
      seen.add(key)
      picks.push(c)
    }
  }
  return picks
})()

// Total estimated learning time across all content
const totalMinutes = concepts.reduce((sum, c) => sum + (c.estimatedReadTime ?? 0), 0)
const totalHours = Math.round(totalMinutes / 60)

const totalTopics = concepts.length + dsaConcepts.length + dsaPatterns.length + reactConcepts.length
const totalCategories = conceptCategories.length + dsaConceptCategories.length + reactConceptCategories.length

export default function ConceptsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[{ label: 'Concepts' }]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        {/* Header */}
        <header className="text-center py-4 pb-8 animate-[fadeIn_0.4s_ease-out]">
          <h1 className="text-[2.5rem] font-bold text-brand-light m-0 mb-3 max-lg:text-3xl max-md:text-[1.75rem]">Learn Concepts</h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Visual, interactive explanations of core concepts.
            <br />
            Understand the &quot;why&quot; before practicing the &quot;how&quot;.
          </p>
          <p className="text-text-muted text-sm m-0 mt-3">
            {totalTopics} interactive topics across {totalCategories} categories
          </p>
        </header>

        {/* Main cards */}
        <div className="grid grid-cols-3 gap-5 [&>*]:flex max-md:grid-cols-1 max-md:gap-4 animate-[fadeIn_0.4s_ease-out_100ms_both]">
          {/* JS Concepts Card */}
          <div>
            <Link
              href="/concepts/js"
              className="relative flex-1 rounded-2xl p-0.5 no-underline text-inherit transition-all duration-150 border border-border-card hover:bg-white-5 hover:border-brand-primary-30 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
            >
              <div className="bg-bg-page-secondary rounded-xl p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[1.75rem] leading-none text-brand-primary">
                    <ConceptIcon conceptId="advanced" size={28} />
                  </span>
                  <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-brand-primary-30 text-brand-light">{concepts.length} topics</span>
                </div>
                <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0 max-md:text-base">JavaScript Concepts</h3>
                <p className="text-base text-text-secondary m-0 leading-snug flex-1">
                  Core JS mechanics: Closures, Event Loop, Prototypes, This keyword, and runtime internals.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border-card">
                  {topJsCategories.map(cat => (
                    <span key={cat.id} className="text-xs text-text-muted bg-white-5 rounded-full py-0.5 px-2">
                      {cat.name} ({cat.count})
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* DSA Concepts Card */}
          <div>
            <Link
              href="/concepts/dsa"
              className="relative flex-1 rounded-2xl p-0.5 no-underline text-inherit transition-all duration-150 border border-border-card hover:bg-white-5 hover:border-brand-primary-30 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
            >
              <div className="bg-bg-page-secondary rounded-xl p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[1.75rem] leading-none text-brand-primary">
                    <ConceptIcon conceptId="data-structures" size={28} />
                  </span>
                  <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-brand-primary-30 text-brand-light">{dsaConcepts.length + dsaPatterns.length} topics</span>
                </div>
                <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0 max-md:text-base">DSA Concepts</h3>
                <p className="text-base text-text-secondary m-0 leading-snug flex-1">
                  Data Structures &amp; Algorithms fundamentals: Arrays, Hash Tables, Stacks, Queues, Big O, and more.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border-card">
                  {dsaCatsWithCounts.map(cat => (
                    <span key={cat.id} className="text-xs text-text-muted bg-white-5 rounded-full py-0.5 px-2">
                      {cat.name} ({cat.count})
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* React Concepts Card */}
          <div>
            <Link
              href="/concepts/react"
              className="relative flex-1 rounded-2xl p-0.5 no-underline text-inherit transition-all duration-150 border border-border-card hover:bg-white-5 hover:border-brand-primary-30 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
            >
              <div className="bg-bg-page-secondary rounded-xl p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[1.75rem] leading-none text-brand-primary">
                    <ConceptIcon conceptId="advanced" size={28} />
                  </span>
                  <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-brand-primary-30 text-brand-light">{reactConcepts.length} topics</span>
                </div>
                <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0 max-md:text-base">React Concepts</h3>
                <p className="text-base text-text-secondary m-0 leading-snug flex-1">
                  React fundamentals: Hooks, Virtual DOM, Component Patterns, Performance, and Server Components.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border-card">
                  {reactCatsWithCounts.map(cat => (
                    <span key={cat.id} className="text-xs text-text-muted bg-white-5 rounded-full py-0.5 px-2">
                      {cat.label} ({cat.count})
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mt-10 animate-[fadeIn_0.4s_ease-out_200ms_both]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text-bright m-0">Jump straight in</h2>
            <p className="text-sm text-text-muted m-0 mt-1">Top interview concepts</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {quickStartConcepts.map(concept => (
              <Link
                key={concept.id}
                href={`/concepts/js/${concept.id}`}
                className="block rounded-xl p-4 no-underline text-inherit border border-border-card bg-surface-card transition-all duration-150 hover:border-brand-primary-30 hover:bg-brand-primary-5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.15)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-brand-primary">
                    <ConceptIcon conceptId={concept.id} size={18} />
                  </span>
                  {concept.estimatedReadTime && (
                    <span className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                      <Clock size={12} />
                      {concept.estimatedReadTime}m
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-text-bright m-0 mb-1">{concept.title}</h3>
                <p className="text-xs text-text-secondary m-0 leading-snug">{concept.shortDescription}</p>
                <span className="inline-flex items-center gap-1 text-xs text-brand-primary mt-2">
                  Start learning <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-10 grid grid-cols-2 gap-4 max-md:grid-cols-1 animate-[fadeIn_0.4s_ease-out_300ms_both]">
          <Link
            href="/concepts/js/cheatsheet"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border-card bg-surface-card no-underline transition-all duration-150 hover:border-brand-primary-30 hover:bg-brand-primary-5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            <FileText size={18} className="text-brand-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-sm font-semibold text-text-bright block">JS Interview Cheatsheet</span>
              <span className="text-xs text-text-muted">All key points in one page</span>
            </div>
            <ArrowRight size={14} className="text-brand-primary ml-auto shrink-0" />
          </Link>
          <Link
            href="/concepts/dsa/roadmap"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border-card bg-surface-card no-underline transition-all duration-150 hover:border-brand-primary-30 hover:bg-brand-primary-5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            <Map size={18} className="text-brand-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-sm font-semibold text-text-bright block">DSA Learning Roadmap</span>
              <span className="text-xs text-text-muted">Step-by-step learning path</span>
            </div>
            <ArrowRight size={14} className="text-brand-primary ml-auto shrink-0" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-8 text-text-muted text-sm max-md:p-6 animate-[fadeIn_0.4s_ease-out_300ms_both]">
        <p className="m-0">~{totalHours} hours of interactive content</p>
      </footer>
    </div>
  )
}
