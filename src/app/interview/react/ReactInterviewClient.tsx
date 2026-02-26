'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PageLayout, PageHeader } from '@/components/ui'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  reactInterviewQuestions,
  reactTopics,
  reactTopicMap,
  filterReactQuestions,
} from '@/data/reactInterviewQuestions'
import { staggerContainer, staggerItem } from '@/lib/motion'

export default function ReactInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterReactQuestions(reactInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <PageLayout
      variant="wide"
      breadcrumbs={[
        { label: 'Interview', path: '/interview' },
        { label: 'React' },
      ]}
    >
      <PageHeader
        variant="section"
        title="React Interview Prep"
        subtitle={`${reactInterviewQuestions.length} questions across hooks, state management, patterns, and performance`}
      />

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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {filtered.map((q) => (
            <motion.div key={q.id} variants={staggerItem}>
              <InterviewQuestionCard question={q} topicMap={reactTopicMap} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-6 text-text-muted">
          No questions match the selected filters.
        </div>
      )}
    </PageLayout>
  )
}
