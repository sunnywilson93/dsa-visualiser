'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { clsx } from 'clsx'
import { Clock, CheckCircle2, Circle, Lightbulb, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import type { ReactChallenge } from '@/data/reactChallenges'
import styles from './ChallengePage.module.css'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
})

interface ChallengePageClientProps {
  challenge?: ReactChallenge
}

function getDifficultyClass(difficulty: ReactChallenge['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return styles.difficultyEasy
    case 'medium':
      return styles.difficultyMedium
    case 'hard':
      return styles.difficultyHard
  }
}

export function ChallengePageClient({ challenge }: ChallengePageClientProps): JSX.Element {
  const [code, setCode] = useState(challenge?.starterCode ?? '')
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (challenge) {
      setCode(challenge.starterCode)
      setShowSolution(false)
    }
  }, [challenge])

  const handleToggleSolution = useCallback(() => {
    if (!challenge) return
    if (showSolution) {
      setCode(challenge.starterCode)
      setShowSolution(false)
    } else {
      setCode(challenge.solutionCode)
      setShowSolution(true)
    }
  }, [challenge, showSolution])

  const handleRevealHint = useCallback(() => {
    if (!challenge) return
    if (!showHints) {
      setShowHints(true)
      setRevealedHints(1)
    } else if (revealedHints < challenge.hints.length) {
      setRevealedHints((prev) => prev + 1)
    }
  }, [challenge, showHints, revealedHints])

  if (!challenge) {
    return (
      <div className={styles.container}>
        <NavBar
          breadcrumbs={[
            { label: 'React Challenges', path: '/challenges/react' },
          ]}
        />
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Challenge Not Found</h1>
          <p className={styles.notFoundText}>
            The challenge you are looking for does not exist.
          </p>
          <Link href="/challenges/react" className={styles.backLink}>
            Back to Challenges
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <NavBar
        breadcrumbs={[
          { label: 'React Challenges', path: '/challenges/react' },
          { label: challenge.title },
        ]}
      />

      <main className={styles.main}>
        <div className={styles.splitLayout}>
          {/* Left Panel: Instructions */}
          <div className={styles.instructionsPanel}>
            <div className={styles.instructionsContent}>
              {/* Challenge Header */}
              <div className={styles.challengeHeader}>
                <div className={styles.challengeMeta}>
                  <span
                    className={clsx(
                      styles.difficultyBadge,
                      getDifficultyClass(challenge.difficulty)
                    )}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className={styles.timeEstimate}>
                    <Clock size={12} />
                    {challenge.estimatedTime} min
                  </span>
                </div>
                <h1 className={styles.challengeTitle}>{challenge.title}</h1>
                <p className={styles.challengeDescription}>
                  {challenge.description}
                </p>
              </div>

              {/* Skills */}
              <div className={styles.skillsSection}>
                <p className={styles.sectionLabel}>Skills</p>
                <div className={styles.skillsList}>
                  {challenge.skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tests */}
              <div className={styles.testsSection}>
                <p className={styles.sectionLabel}>Tests</p>
                <ul className={styles.testsList}>
                  {challenge.tests.map((test, index) => (
                    <li key={index} className={styles.testItem}>
                      <span className={clsx(styles.testIcon, showSolution ? styles.testPassed : styles.testFailed)}>
                        {showSolution ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Circle size={14} />
                        )}
                      </span>
                      <span>{test.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hints */}
              <div className={styles.hintsSection}>
                <button
                  className={styles.hintsToggle}
                  onClick={handleRevealHint}
                >
                  <Lightbulb size={14} />
                  {!showHints
                    ? 'Show Hints'
                    : revealedHints < challenge.hints.length
                      ? `Show Next Hint (${revealedHints}/${challenge.hints.length})`
                      : `All Hints Shown (${challenge.hints.length})`}
                </button>
                {showHints && (
                  <ul className={styles.hintsList}>
                    {challenge.hints.slice(0, revealedHints).map((hint, index) => (
                      <li key={index} className={styles.hintItem}>
                        {hint}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Code Editor */}
          <div className={styles.editorPanel}>
            <div className={styles.editorToolbar}>
              <span className={styles.editorLabel}>
                {showSolution ? 'Solution' : 'Your Code'}
              </span>
              <div className={styles.editorActions}>
                <button
                  className={clsx(styles.actionButton, styles.resetButton)}
                  onClick={handleReset}
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  className={clsx(
                    styles.actionButton,
                    styles.solutionButton,
                    showSolution && styles.solutionButtonActive
                  )}
                  onClick={handleToggleSolution}
                >
                  {showSolution ? (
                    <><EyeOff size={12} /> Hide Solution</>
                  ) : (
                    <><Eye size={12} /> Show Solution</>
                  )}
                </button>
              </div>
            </div>
            <div className={styles.editorWrapper}>
              <MonacoEditor
                height="100%"
                language="typescript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 12 },
                  renderLineHighlight: 'gutter',
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
