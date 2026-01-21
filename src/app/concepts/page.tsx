'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Box } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import styles from './page.module.css'

export default function ConceptsPage() {
  return (
    <div className={styles.page}>
      <NavBar breadcrumbs={[{ label: 'Concepts' }]} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Learn Concepts</h1>
          <p className={styles.subtitle}>
            Visual, interactive explanations of core concepts.
            <br />
            Understand the &quot;why&quot; before practicing the &quot;how&quot;.
          </p>
        </header>

        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <Link href="/concepts/js" className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>
                    <Zap size={28} />
                  </span>
                  <span className={styles.topicCount}>{concepts.length} topics</span>
                </div>
                <h3 className={styles.cardTitle}>JavaScript Concepts</h3>
                <p className={styles.cardDescription}>
                  Core JS mechanics: Closures, Event Loop, Prototypes, This keyword, and runtime internals.
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.keyPoints}>Language deep-dive</span>
                  <span className={styles.examples}>Interview essentials</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <Link href="/concepts/dsa" className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>
                    <Box size={28} />
                  </span>
                  <span className={styles.topicCount}>{dsaConcepts.length} topics</span>
                </div>
                <h3 className={styles.cardTitle}>DSA Concepts</h3>
                <p className={styles.cardDescription}>
                  Data Structures &amp; Algorithms fundamentals: Arrays, Hash Tables, Stacks, Queues, Big O, and more.
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.keyPoints}>Foundations first</span>
                  <span className={styles.examples}>Then patterns</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>More concepts coming soon!</p>
      </footer>
    </div>
  )
}
