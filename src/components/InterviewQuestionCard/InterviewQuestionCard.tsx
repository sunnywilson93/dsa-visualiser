'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
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

const SYNTAX_REGEX =
  /(\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|\/\/[^\n]*)|("[^"]*"|'[^']*')|(<!DOCTYPE\s+\w+)|(<\/?[\w-]+)|(\/>|>)|(\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|true|false|null|undefined|type|interface)\b)|(\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr)?\b)/g

function highlightSyntax(code: string): ReactNode[] {
  const result: ReactNode[] = []
  const regex = new RegExp(SYNTAX_REGEX.source, 'g')
  let lastIndex = 0
  let key = 0

  for (;;) {
    const match = regex.exec(code)
    if (!match) break

    if (match.index > lastIndex) {
      result.push(code.slice(lastIndex, match.index))
    }

    let className: string
    if (match[1]) className = styles.syntaxComment
    else if (match[2]) className = styles.syntaxString
    else if (match[3]) className = styles.syntaxKeyword
    else if (match[4]) className = styles.syntaxTag
    else if (match[5]) className = styles.syntaxTag
    else if (match[6]) className = styles.syntaxKeyword
    else if (match[7]) className = styles.syntaxNumber
    else className = ''

    result.push(
      <span key={key++} className={className}>
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < code.length) {
    result.push(code.slice(lastIndex))
  }

  return result
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
                  <pre className={styles.codeBlock}>
                    {highlightSyntax(question.codeExample)}
                  </pre>
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
