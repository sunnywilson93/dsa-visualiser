'use client'

import { useState, useMemo } from 'react'
import { NavBar } from '@/components/NavBar'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  reactInterviewQuestions,
  reactTopics,
  reactTopicMap,
  filterReactQuestions,
} from '@/data/reactInterviewQuestions'
import styles from './ReactInterviewClient.module.css'

export default function ReactInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterReactQuestions(reactInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar
        breadcrumbs={[
          { label: 'Interview', path: '/interview' },
          { label: 'React' },
        ]}
      />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>React Interview Prep</h1>
          <p className={styles.subtitle}>
            {reactInterviewQuestions.length} questions across hooks, state management, patterns, and performance
          </p>
        </div>

        <InterviewFilterBar
          difficulty={difficulty}
          topic={topic}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          topics={reactTopics}
          totalCount={reactInterviewQuestions.length}
          filteredCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className={styles.questionsGrid}>
            {filtered.map((q) => (
              <InterviewQuestionCard key={q.id} question={q} topicMap={reactTopicMap} />
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
