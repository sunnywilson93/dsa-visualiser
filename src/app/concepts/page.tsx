'use client'

import Link from 'next/link'
import { Zap, Box } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'


export default function ConceptsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[{ label: 'Concepts' }]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <header className="text-center py-4 pb-8">
          <h1 className="text-[2.5rem] font-bold bg-gradient-to-br from-brand-primary from-0% to-brand-secondary to-100% bg-clip-text text-transparent m-0 mb-3 drop-shadow-glow-brand max-lg:text-3xl max-md:text-[1.75rem]">Learn Concepts</h1>
          <p className="text-text-secondary text-md m-0 leading-relaxed max-md:text-base">
            Visual, interactive explanations of core concepts.
            <br />
            Understand the &quot;why&quot; before practicing the &quot;how&quot;.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-5 [&>*]:flex max-md:grid-cols-1 max-md:gap-4">
          <div>
            <Link href="/concepts/js" className="relative flex-1 rounded-[14px] p-0.5 no-underline text-inherit transition-all duration-350 bg-gradient-to-br from-brand-primary-15 to-brand-secondary-15 card-gradient-border hover:-translate-y-1 hover:shadow-[0_0_20px_var(--color-brand-primary-20),0_0_40px_var(--color-brand-secondary-10)]">
              <div className="bg-bg-page-secondary rounded-xl p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[1.75rem] leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
                    <Zap size={28} />
                  </span>
                  <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-brand-primary-30 text-brand-light">{concepts.length} topics</span>
                </div>
                <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0 max-md:text-base">JavaScript Concepts</h3>
                <p className="text-base text-text-secondary m-0 leading-snug flex-1">
                  Core JS mechanics: Closures, Event Loop, Prototypes, This keyword, and runtime internals.
                </p>
                <div className="flex gap-4 mt-2 pt-2 border-t border-border-card">
                  <span className="text-xs text-brand-primary font-medium">Language deep-dive</span>
                  <span className="text-xs text-brand-primary font-medium">Interview essentials</span>
                </div>
              </div>
            </Link>
          </div>

          <div>
            <Link href="/concepts/dsa" className="relative flex-1 rounded-[14px] p-0.5 no-underline text-inherit transition-all duration-350 bg-gradient-to-br from-brand-primary-15 to-brand-secondary-15 card-gradient-border hover:-translate-y-1 hover:shadow-[0_0_20px_var(--color-brand-primary-20),0_0_40px_var(--color-brand-secondary-10)]">
              <div className="bg-bg-page-secondary rounded-xl p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[1.75rem] leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
                    <Box size={28} />
                  </span>
                  <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-brand-primary-30 text-brand-light">{dsaConcepts.length + dsaPatterns.length} topics</span>
                </div>
                <h3 className="text-lg font-semibold text-text-bright mt-1 mb-0 max-md:text-base">DSA Concepts</h3>
                <p className="text-base text-text-secondary m-0 leading-snug flex-1">
                  Data Structures &amp; Algorithms fundamentals: Arrays, Hash Tables, Stacks, Queues, Big O, and more.
                </p>
                <div className="flex gap-4 mt-2 pt-2 border-t border-border-card">
                  <span className="text-xs text-brand-primary font-medium">Foundations first</span>
                  <span className="text-xs text-brand-primary font-medium">Then patterns</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center p-8 text-text-muted text-base max-md:p-6">
        <p>More concepts coming soon!</p>
      </footer>
    </div>
  )
}
