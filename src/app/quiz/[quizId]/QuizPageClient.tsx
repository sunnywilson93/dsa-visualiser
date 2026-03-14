'use client'

import { useState, useCallback } from 'react'
import { ArrowRight, Clock, HelpCircle, CheckCircle, XCircle, Share2 } from 'lucide-react'
import clsx from 'clsx'
import { NavBar } from '@/components/NavBar'
import type { Quiz, QuizQuestion } from '@/data/quizzes'
import styles from './QuizPage.module.css'

interface QuizPageClientProps {
  quiz: Quiz
}

type QuizState = 'start' | 'question' | 'results'

interface QuizAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function getPerformanceMessage(percentage: number): { message: string; subMessage: string } {
  if (percentage === 100) {
    return { message: 'Perfect Score!', subMessage: 'You nailed every single question.' }
  }
  if (percentage >= 80) {
    return { message: 'Excellent!', subMessage: 'You have a strong grasp of these concepts.' }
  }
  if (percentage >= 60) {
    return { message: 'Good job!', subMessage: 'Solid understanding with some room to grow.' }
  }
  if (percentage >= 40) {
    return { message: 'Keep practicing!', subMessage: 'Review the explanations below to strengthen your knowledge.' }
  }
  return { message: 'Time to study up!', subMessage: 'Check out the concept pages to build a stronger foundation.' }
}

function StartScreen({ quiz, onStart }: { quiz: Quiz; onStart: () => void }): React.ReactElement {
  const difficultyLabel = quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)

  return (
    <div className={styles.startScreen}>
      <span className={styles.startBadge}>
        {quiz.domain.toUpperCase()} Quiz
      </span>
      <h1 className={styles.startTitle}>{quiz.title}</h1>
      <p className={styles.startDescription}>{quiz.description}</p>
      <div className={styles.startMeta}>
        <span className={styles.startMetaItem}>
          <HelpCircle size={16} />
          {quiz.questions.length} questions
        </span>
        <span className={styles.startMetaItem}>
          <Clock size={16} />
          ~{quiz.estimatedTime} minutes
        </span>
        <span className={styles.startMetaItem}>
          {difficultyLabel}
        </span>
      </div>
      <button className={styles.startBtn} onClick={onStart}>
        Start Quiz
      </button>
    </div>
  )
}

function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onNext,
  selectedIndex,
}: {
  question: QuizQuestion
  questionIndex: number
  totalQuestions: number
  onAnswer: (index: number) => void
  onNext: () => void
  selectedIndex: number | null
}): React.ReactElement {
  const hasAnswered = selectedIndex !== null
  const isCorrect = hasAnswered && selectedIndex === question.correctIndex
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <div className={styles.questionScreen}>
      <div className={styles.progressBar}>
        <div className={styles.progressTrack}>
          <div
              className={styles.progressFill}
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            />
        </div>
        <span className={styles.progressText}>
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className={styles.questionCard}>
        <h2 className={styles.questionText}>{question.question}</h2>

        {question.codeSnippet && (
          <div className={styles.codeBlock}>
            <pre><code>{question.codeSnippet}</code></pre>
          </div>
        )}

        <div className={styles.options}>
          {question.options.map((option, idx) => {
            let optionClass = styles.optionBtn
            if (hasAnswered) {
              if (idx === question.correctIndex) {
                optionClass = clsx(styles.optionBtn, styles.optionCorrect)
              } else if (idx === selectedIndex) {
                optionClass = clsx(styles.optionBtn, styles.optionWrong)
              } else {
                optionClass = clsx(styles.optionBtn, styles.optionDisabled)
              }
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => onAnswer(idx)}
                disabled={hasAnswered}
              >
                <span className={styles.optionLabel}>{OPTION_LABELS[idx]}</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            )
          })}
        </div>

        {hasAnswered && (
          <div className={clsx(styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong)}>
            <div className={clsx(styles.feedbackLabel, isCorrect ? styles.feedbackLabelCorrect : styles.feedbackLabelWrong)}>
              {isCorrect ? (
                <>
                  <CheckCircle size={18} />
                  Correct!
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Incorrect
                </>
              )}
            </div>
            <p className={styles.feedbackExplanation}>{question.explanation}</p>
          </div>
        )}

        {hasAnswered && (
          <button className={styles.nextBtn} onClick={onNext}>
            {questionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function ResultsScreen({
  quiz,
  answers,
  onRetry,
}: {
  quiz: Quiz
  answers: QuizAnswer[]
  onRetry: () => void
}): React.ReactElement {
  const [copied, setCopied] = useState(false)
  const correctCount = answers.filter(a => a.isCorrect).length
  const total = quiz.questions.length
  const percentage = Math.round((correctCount / total) * 100)
  const { message, subMessage } = getPerformanceMessage(percentage)

  const wrongAnswers = answers
    .map((answer, idx) => ({ answer, question: quiz.questions[idx] }))
    .filter(item => !item.answer.isCorrect)

  const handleShare = useCallback((): void => {
    const text = `I scored ${correctCount}/${total} on the ${quiz.title}! jsinterview.dev/quiz/${quiz.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [correctCount, total, quiz.title, quiz.id])

  return (
    <div className={styles.resultsScreen}>
      <div className={styles.resultsCard}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreValue}>{correctCount}/{total}</span>
          <span className={styles.scorePercent}>{percentage}%</span>
        </div>
        <h2 className={styles.resultsMessage}>{message}</h2>
        <p className={styles.resultsSubMessage}>{subMessage}</p>
      </div>

      <div className={styles.resultsActions}>
        <button className={styles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
        <button
          className={clsx(styles.shareBtn, copied && styles.shareCopied)}
          onClick={handleShare}
        >
          <Share2 size={16} />
          {copied ? 'Copied!' : 'Share Score'}
        </button>
      </div>

      {wrongAnswers.length > 0 && (
        <div className={styles.reviewSection}>
          <h3 className={styles.reviewTitle}>
            Review Wrong Answers ({wrongAnswers.length})
          </h3>
          {wrongAnswers.map(({ answer, question }) => (
            <div key={answer.questionId} className={styles.reviewItem}>
              <p className={styles.reviewQuestion}>{question.question}</p>
              <div className={styles.reviewAnswers}>
                <span className={styles.reviewYourAnswer}>
                  Your answer: {OPTION_LABELS[answer.selectedIndex]}. {question.options[answer.selectedIndex]}
                </span>
                <span className={styles.reviewCorrectAnswer}>
                  Correct: {OPTION_LABELS[question.correctIndex]}. {question.options[question.correctIndex]}
                </span>
              </div>
              <p className={styles.reviewExplanation}>{question.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function QuizPageClient({ quiz }: QuizPageClientProps): React.ReactElement {
  const [state, setState] = useState<QuizState>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleStart = useCallback((): void => {
    setState('question')
    setCurrentIndex(0)
    setAnswers([])
    setSelectedIndex(null)
  }, [])

  const handleAnswer = useCallback((index: number): void => {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    const question = quiz.questions[currentIndex]
    setAnswers(prev => [
      ...prev,
      {
        questionId: question.id,
        selectedIndex: index,
        isCorrect: index === question.correctIndex,
      },
    ])
  }, [selectedIndex, quiz.questions, currentIndex])

  const handleNext = useCallback((): void => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedIndex(null)
    } else {
      setState('results')
    }
  }, [currentIndex, quiz.questions.length])

  return (
    <div className={styles.page}>
      <NavBar
        breadcrumbs={[
          { label: 'Quizzes', path: '/quiz' },
          { label: quiz.title },
        ]}
      />
      <main className={styles.main}>
        {state === 'start' && (
          <StartScreen quiz={quiz} onStart={handleStart} />
        )}
        {state === 'question' && (
          <QuestionScreen
            question={quiz.questions[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            selectedIndex={selectedIndex}
          />
        )}
        {state === 'results' && (
          <ResultsScreen
            quiz={quiz}
            answers={answers}
            onRetry={handleStart}
          />
        )}
      </main>
    </div>
  )
}
