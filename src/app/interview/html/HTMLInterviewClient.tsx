'use client'

import { useState, useMemo } from 'react'
import { NavBar } from '@/components/NavBar'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  htmlInterviewQuestions,
  htmlTopics,
  htmlTopicMap,
  filterHTMLQuestions,
} from '@/data/htmlInterviewQuestions'
import styles from './HTMLInterviewClient.module.css'

export default function HTMLInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterHTMLQuestions(htmlInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar
        breadcrumbs={[
          { label: 'Interview', path: '/interview' },
          { label: 'HTML' },
        ]}
      />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>HTML Interview Prep</h1>
          <p className={styles.subtitle}>
            {htmlInterviewQuestions.length} questions across fundamentals, semantics, accessibility, forms, and modern APIs
          </p>
        </div>

        <InterviewFilterBar
          difficulty={difficulty}
          topic={topic}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          topics={htmlTopics}
          totalCount={htmlInterviewQuestions.length}
          filteredCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className={styles.questionsGrid}>
            {filtered.map((q) => (
              <InterviewQuestionCard key={q.id} question={q} topicMap={htmlTopicMap} />
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
