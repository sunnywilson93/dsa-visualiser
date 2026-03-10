'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface AggregatedQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  sourceConceptId?: string
  sourceDomain?: string
}

interface TopQuestionsPageClientProps {
  title: string
  description: string
  questions: AggregatedQuestion[]
  domain: 'javascript' | 'react' | 'dsa'
}

export type { AggregatedQuestion, TopQuestionsPageClientProps }

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

const difficultyOrder: Record<string, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
}

export function TopQuestionsPageClient({
  title,
  description,
  questions,
  domain,
}: TopQuestionsPageClientProps) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return questions
      .filter((q) => {
        if (difficulty !== 'all' && q.difficulty !== difficulty) return false
        if (term && !q.question.toLowerCase().includes(term) && !q.answer.toLowerCase().includes(term)) return false
        return true
      })
      .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
  }, [search, difficulty, questions])

  const domainPathMap: Record<string, string> = {
    javascript: 'js',
    react: 'react',
    dsa: 'dsa',
  }

  const filters: { label: string; value: DifficultyFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ]

  const filterColorMap: Record<DifficultyFilter, string> = {
    all: 'bg-brand-primary-20 text-brand-light border-brand-primary-30',
    easy: 'bg-accent-green-20 text-accent-green border-accent-green-30',
    medium: 'bg-accent-yellow-30 text-accent-yellow border-accent-yellow-30',
    hard: 'bg-accent-red-30 text-accent-red border-accent-red-30',
  }

  const difficultyColorMap: Record<string, string> = {
    easy: 'text-accent-green',
    medium: 'text-accent-yellow',
    hard: 'text-accent-red',
  }

  return (
    <div className="flex-1 py-8 px-8 pb-12 container-default mx-auto w-full max-md:px-4">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text-bright mb-3 max-md:text-2xl">
          {title}
        </h1>
        <p className="text-text-secondary text-md max-w-[40rem] mx-auto">
          {description}
        </p>
      </header>

      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full sm:max-w-[20rem] px-4 py-2 rounded-lg border border-border-primary bg-bg-secondary text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setDifficulty(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-200 cursor-pointer ${
                difficulty === f.value
                  ? filterColorMap[f.value]
                  : 'bg-transparent text-text-muted border-border-primary hover:text-text-secondary hover:border-border-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-text-muted mb-6">
        Showing {filtered.length} of {questions.length} questions
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted text-md">
            No questions match your filters. Try broadening your search.
          </p>
        </div>
      ) : (
        <ol className="flex flex-col gap-3 list-none m-0 p-0">
          {filtered.map((q, i) => (
            <li key={i}>
              <details className="rounded-xl border border-border-card bg-surface-card group">
                <summary className="flex items-start gap-3 px-4 py-3 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                  <span className="shrink-0 w-7 text-right text-sm font-semibold text-text-muted tabular-nums pt-0.5">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-base text-text-bright font-medium leading-relaxed">
                    {q.question}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-semibold uppercase tracking-wide pt-1 ${difficultyColorMap[q.difficulty]}`}
                  >
                    {q.difficulty}
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-0 ml-10 border-t border-border-primary mt-0">
                  <p className="text-sm text-text-secondary leading-relaxed mt-3">
                    {q.answer}
                  </p>
                  {q.sourceConceptId && q.sourceDomain && (
                    <Link
                      href={`/concepts/${domainPathMap[q.sourceDomain] ?? q.sourceDomain}/${q.sourceConceptId}`}
                      className="inline-block mt-3 text-sm text-brand-primary no-underline hover:text-brand-secondary transition-colors duration-200"
                    >
                      Learn more &rarr;
                    </Link>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
