'use client'

import { useState, useMemo } from 'react'
import { NavBar } from '@/components/NavBar'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  bundlerInterviewQuestions,
  bundlerTopics,
  bundlerTopicMap,
  filterBundlerQuestions,
} from '@/data/bundlerInterviewQuestions'
import styles from './BundlersInterviewClient.module.css'

export default function BundlersInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterBundlerQuestions(bundlerInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar
        breadcrumbs={[
          { label: 'Interview', path: '/interview' },
          { label: 'Bundlers' },
        ]}
      />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>Bundler Interview Prep</h1>
          <p className={styles.subtitle}>
            {bundlerInterviewQuestions.length} questions across Webpack, Vite, Rollup, esbuild, Parcel, and more
          </p>
        </div>

        <InterviewFilterBar
          difficulty={difficulty}
          topic={topic}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          topics={bundlerTopics}
          totalCount={bundlerInterviewQuestions.length}
          filteredCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className={styles.questionsGrid}>
            {filtered.map((q) => (
              <InterviewQuestionCard key={q.id} question={q} topicMap={bundlerTopicMap} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No questions match the selected filters.
          </div>
        )}
      </main>
    </div>
  )
}
