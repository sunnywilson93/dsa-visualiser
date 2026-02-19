'use client'

import { useState, useMemo } from 'react'
import { NavBar } from '@/components/NavBar'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  cssInterviewQuestions,
  filterCSSQuestions,
  type CSSInterviewTopic,
} from '@/data/cssInterviewQuestions'
import styles from './CSSInterviewClient.module.css'

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'
type TopicFilter = 'all' | CSSInterviewTopic

export default function CSSInterviewClient() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [topic, setTopic] = useState<TopicFilter>('all')

  const filtered = useMemo(
    () => filterCSSQuestions(cssInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar
        breadcrumbs={[
          { label: 'Interview', path: '/interview' },
          { label: 'CSS' },
        ]}
      />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>CSS Interview Prep</h1>
          <p className={styles.subtitle}>
            {cssInterviewQuestions.length} questions across fundamentals, layout, modern CSS, and architecture
          </p>
        </div>

        <InterviewFilterBar
          difficulty={difficulty}
          topic={topic}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          totalCount={cssInterviewQuestions.length}
          filteredCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className={styles.questionsGrid}>
            {filtered.map((q) => (
              <InterviewQuestionCard key={q.id} question={q} />
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
