'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PageLayout, PageHeader } from '@/components/ui'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  cssInterviewQuestions,
  cssTopics,
  cssTopicMap,
  filterCSSQuestions,
} from '@/data/cssInterviewQuestions'
import { staggerContainer, staggerItem } from '@/lib/motion'

export default function CSSInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterCSSQuestions(cssInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <PageLayout
      variant="wide"
      breadcrumbs={[
        { label: 'Interview', path: '/interview' },
        { label: 'CSS' },
      ]}
    >
      <PageHeader
        variant="section"
        title="CSS Interview Prep"
        subtitle={`${cssInterviewQuestions.length} questions across fundamentals, layout, modern CSS, and architecture`}
      />

      <InterviewFilterBar
        difficulty={difficulty}
        topic={topic}
        onDifficultyChange={setDifficulty}
        onTopicChange={setTopic}
        topics={cssTopics}
        totalCount={cssInterviewQuestions.length}
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
              <InterviewQuestionCard question={q} topicMap={cssTopicMap} />
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
