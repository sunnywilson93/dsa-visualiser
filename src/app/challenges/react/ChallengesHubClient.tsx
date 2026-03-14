'use client'

import { useState } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { ArrowRight, Clock } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { reactChallenges } from '@/data/reactChallenges'
import type { ReactChallenge } from '@/data/reactChallenges'
import styles from './ChallengesHub.module.css'

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

const DIFFICULTY_ORDER: Array<ReactChallenge['difficulty']> = ['easy', 'medium', 'hard']

const DIFFICULTY_LABELS: Record<ReactChallenge['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const FILTER_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

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

export function ChallengesHubClient(): JSX.Element {
  const [filter, setFilter] = useState<DifficultyFilter>('all')

  const filteredChallenges =
    filter === 'all'
      ? reactChallenges
      : reactChallenges.filter((c) => c.difficulty === filter)

  const groupedByDifficulty = DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    label: DIFFICULTY_LABELS[difficulty],
    challenges: filteredChallenges.filter((c) => c.difficulty === difficulty),
  })).filter((group) => group.challenges.length > 0)

  return (
    <div className={styles.container}>
      <NavBar
        breadcrumbs={[
          { label: 'Challenges', path: '/challenges/react' },
          { label: 'React' },
        ]}
      />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>React Coding Challenges</h1>
          <p className={styles.subtitle}>
            Practice building real React components. {reactChallenges.length} challenges across easy, medium, and hard difficulty levels.
          </p>
        </header>

        <div className={styles.filterBar}>
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={clsx(
                styles.filterButton,
                filter === option.value && styles.filterButtonActive
              )}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {groupedByDifficulty.map((group) => (
          <section key={group.difficulty} className={styles.difficultySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{group.label}</h2>
              <span className={styles.sectionCount}>
                {group.challenges.length}
              </span>
            </div>
            <div className={styles.grid}>
              {group.challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/react/${challenge.id}`}
                  className={styles.card}
                >
                  <div className={styles.cardTop}>
                    <span
                      className={clsx(
                        styles.difficultyBadge,
                        getDifficultyClass(challenge.difficulty)
                      )}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className={styles.estimatedTime}>
                      <Clock size={12} /> {challenge.estimatedTime}m
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{challenge.title}</h3>
                  <p className={styles.cardDescription}>
                    {challenge.shortDescription}
                  </p>
                  <div className={styles.skillsList}>
                    {challenge.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          {reactChallenges.length} challenges to master React
        </p>
        <Link href="/concepts/react" className={styles.footerLink}>
          Explore React Concepts
          <ArrowRight size={14} />
        </Link>
      </footer>
    </div>
  )
}
