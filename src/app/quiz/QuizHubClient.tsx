'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, HelpCircle, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { NavBar } from '@/components/NavBar'
import { quizzes } from '@/data/quizzes'
import type { Quiz } from '@/data/quizzes'
import styles from './QuizHub.module.css'

type DomainFilter = 'all' | 'js' | 'react' | 'ts' | 'dsa'

const domainLabels: Record<DomainFilter, string> = {
  all: 'All',
  js: 'JavaScript',
  react: 'React',
  ts: 'TypeScript',
  dsa: 'DSA',
}

const domainStyleMap: Record<Quiz['domain'], string> = {
  js: styles.domainJs,
  react: styles.domainReact,
  ts: styles.domainTs,
  dsa: styles.domainDsa,
}

const difficultyLabels: Record<Quiz['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function QuizHubClient(): React.ReactElement {
  const [filter, setFilter] = useState<DomainFilter>('all')

  const filtered = filter === 'all'
    ? quizzes
    : quizzes.filter(q => q.domain === filter)

  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[{ label: 'Quizzes' }]} />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Interactive Quizzes</h1>
          <p className={styles.subtitle}>
            Test your frontend knowledge with timed quizzes.
            Get instant feedback with detailed explanations.
          </p>
        </header>

        <div className={styles.filters}>
          {(Object.keys(domainLabels) as DomainFilter[]).map(domain => (
            <button
              key={domain}
              className={clsx(styles.filterBtn, filter === domain && styles.filterBtnActive)}
              onClick={() => setFilter(domain)}
            >
              {domainLabels[domain]}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map(quiz => (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={clsx(styles.domainBadge, domainStyleMap[quiz.domain])}>
                  {quiz.domain.toUpperCase()}
                </span>
                <span className={styles.difficultyBadge}>
                  {difficultyLabels[quiz.difficulty]}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{quiz.title}</h2>
              <p className={styles.cardDescription}>{quiz.shortDescription}</p>
              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <HelpCircle size={14} />
                  {quiz.questions.length} questions
                </span>
                <span className={styles.metaItem}>
                  <Clock size={14} />
                  ~{quiz.estimatedTime} min
                </span>
                <span className={styles.startLink}>
                  Start <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
