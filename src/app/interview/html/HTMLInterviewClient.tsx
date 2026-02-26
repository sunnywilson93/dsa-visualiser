'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PageLayout, PageHeader } from '@/components/ui'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  htmlInterviewQuestions,
  htmlTopics,
  htmlTopicMap,
  filterHTMLQuestions,
} from '@/data/htmlInterviewQuestions'
import { staggerContainer, staggerItem } from '@/lib/motion'

export default function HTMLInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterHTMLQuestions(htmlInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <PageLayout
      variant="wide"
      breadcrumbs={[
        { label: 'Interview', path: '/interview' },
        { label: 'HTML' },
      ]}
    >
      <PageHeader
        variant="section"
        title="HTML Interview Prep"
        subtitle={`${htmlInterviewQuestions.length} questions across fundamentals, semantics, accessibility, forms, and modern APIs`}
      />

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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {filtered.map((q) => (
            <motion.div key={q.id} variants={staggerItem}>
              <InterviewQuestionCard question={q} topicMap={htmlTopicMap} />
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
