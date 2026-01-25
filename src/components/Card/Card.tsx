'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import styles from './Card.module.css'

export interface CardStat {
  label: string
  value: string | number
}

export interface CardProps {
  href: string
  title: string
  description: string
  icon?: ReactNode
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  stats?: CardStat[]
  meta?: ReactNode
  index?: number
  isActive?: boolean
}

export function Card({
  href,
  title,
  description,
  icon,
  difficulty,
  stats,
  meta,
  index = 0,
  isActive = false,
}: CardProps) {
  return (
    <motion.div
      className={`${styles.cardWrapper} ${isActive ? styles.active : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href} className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            {icon && <span className={styles.cardIcon}>{icon}</span>}
            {difficulty && <DifficultyIndicator level={difficulty} size="md" />}
          </div>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
          {(stats || meta) && (
            <div className={styles.cardFooter}>
              {stats?.map((stat, i) => (
                <span key={i} className={styles.stat}>
                  {stat.value} {stat.label}
                </span>
              ))}
              {meta}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
