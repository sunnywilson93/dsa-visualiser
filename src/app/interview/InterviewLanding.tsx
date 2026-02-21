'use client'

import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { cssInterviewQuestions } from '@/data/cssInterviewQuestions'
import { htmlInterviewQuestions } from '@/data/htmlInterviewQuestions'
import { jsInterviewQuestions } from '@/data/jsInterviewQuestions'
import styles from './InterviewLanding.module.css'

export default function InterviewLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={[{ label: 'Interview' }]} />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>Interview Prep</h1>
          <p className={styles.subtitle}>
            Curated questions organized by topic and difficulty
          </p>
        </div>

        <div className={styles.grid}>
          <Link href="/interview/html" className={styles.topicCard}>
            <div className={styles.topicName}>HTML</div>
            <div className={styles.topicDescription}>
              Document structure, semantic elements, accessibility, ARIA, forms, media, Web Components, and modern APIs
            </div>
            <div className={styles.topicCount}>
              {htmlInterviewQuestions.length} questions
            </div>
          </Link>

          <Link href="/interview/css" className={styles.topicCard}>
            <div className={styles.topicName}>CSS</div>
            <div className={styles.topicDescription}>
              Box model, flexbox, grid, specificity, animations, performance, and modern CSS features
            </div>
            <div className={styles.topicCount}>
              {cssInterviewQuestions.length} questions
            </div>
          </Link>

          <Link href="/interview/js" className={styles.topicCard}>
            <div className={styles.topicName}>JavaScript</div>
            <div className={styles.topicDescription}>
              Closures, prototypes, async/await, event loop, this keyword, and ES6+ features
            </div>
            <div className={styles.topicCount}>
              {jsInterviewQuestions.length} questions
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
