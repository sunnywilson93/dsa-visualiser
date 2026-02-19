'use client'

import { cn } from '@/utils/cn'
import type { CSSInterviewTopic } from '@/data/cssInterviewQuestions'
import { cssTopics } from '@/data/cssInterviewQuestions'
import styles from './InterviewFilterBar.module.css'

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'
type TopicFilter = 'all' | CSSInterviewTopic

export interface InterviewFilterBarProps {
  difficulty: DifficultyFilter
  topic: TopicFilter
  onDifficultyChange: (value: DifficultyFilter) => void
  onTopicChange: (value: TopicFilter) => void
  totalCount: number
  filteredCount: number
}

const difficultyOptions: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export function InterviewFilterBar({
  difficulty,
  topic,
  onDifficultyChange,
  onTopicChange,
  totalCount,
  filteredCount,
}: InterviewFilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterRow}>
        {difficultyOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(
              styles.filterBtn,
              difficulty === opt.value && styles.filterBtnActive,
            )}
            onClick={() => onDifficultyChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={styles.filterRow}>
        <button
          type="button"
          className={cn(
            styles.filterBtn,
            topic === 'all' && styles.filterBtnActive,
          )}
          onClick={() => onTopicChange('all')}
        >
          All Topics
        </button>
        {cssTopics.map((t) => (
          <button
            key={t.id}
            type="button"
            className={cn(
              styles.filterBtn,
              topic === t.id && styles.filterBtnActive,
            )}
            onClick={() => onTopicChange(t.id)}
          >
            {t.label}
          </button>
        ))}

        <div className={styles.stats}>
          Showing <span className={styles.statsCount}>{filteredCount}</span> of {totalCount} questions
        </div>
      </div>
    </div>
  )
}
