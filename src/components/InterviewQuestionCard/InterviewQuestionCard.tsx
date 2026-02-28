'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { CodeBlock } from '@/components/ui'
import type { InterviewQuestion, InterviewTopicConfig } from '@/types'
import styles from './InterviewQuestionCard.module.css'

export interface InterviewQuestionCardProps {
  question: InterviewQuestion
  topicMap: Record<string, InterviewTopicConfig>
}

const difficultyClass: Record<string, string> = {
  easy: styles.badgeEasy,
  medium: styles.badgeMedium,
  hard: styles.badgeHard,
}

function renderWithCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}


export function InterviewQuestionCard({ question, topicMap }: InterviewQuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const topicLabel = topicMap[question.topic]?.label ?? question.topic

  function handleToggle(): void {
    setIsOpen((prev) => {
      if (prev) setShowAnswer(false)
      return !prev
    })
  }

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.cardHeader}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.questionNumber}>
          {String(question.id).padStart(2, '0')}
        </span>

        <div className={styles.questionMain}>
          <div className={styles.questionTitle}>{question.title}</div>
          <div className={styles.metaRow}>
            <span className={cn(styles.badge, difficultyClass[question.difficulty])}>
              {question.difficulty}
            </span>
            <span className={cn(styles.badge, styles.badgeTopic)}>
              {topicLabel}
            </span>
            <span className={cn(styles.badge, styles.badgeSubtopic)}>
              {question.subtopic}
            </span>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={cn(styles.chevron, isOpen && styles.chevronOpen)}
        />
      </button>

      {isOpen && (
        <div className={styles.cardBody}>
          {!showAnswer ? (
            <button
              type="button"
              className={styles.revealBtn}
              onClick={() => setShowAnswer(true)}
            >
              Reveal Answer
            </button>
          ) : (
            <>
              <div>
                <div className={styles.sectionLabel}>Answer</div>
                <div className={styles.answerText}>
                  {renderWithCode(question.answer)}
                </div>
              </div>

              {question.codeExample && (
                <div>
                  <div className={styles.sectionLabel}>Example</div>
                  <CodeBlock code={question.codeExample} />
                </div>
              )}

              <div className={styles.followUpBox}>
                <div className={styles.followUpLabel}>Interviewer might ask...</div>
                <div className={styles.followUpText}>{question.followUp}</div>
              </div>

              <div className={styles.takeaway}>{question.keyTakeaway}</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
