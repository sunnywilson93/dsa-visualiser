'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, entranceTransition } from '@/lib/motion'
import { cn } from '@/utils/cn'
import styles from './PageHeader.module.css'

type PageHeaderVariant = 'hero' | 'section' | 'compact'

interface PageHeaderProps {
  variant: PageHeaderVariant
  title: string
  subtitle?: string
  icon?: ReactNode
  metadata?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  variant,
  title,
  subtitle,
  icon,
  metadata,
  actions,
  className,
}: PageHeaderProps) {
  if (variant === 'hero') {
    return (
      <motion.header
        className={cn(styles.hero, className)}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={entranceTransition}
      >
        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
        {metadata}
        {actions}
      </motion.header>
    )
  }

  if (variant === 'compact') {
    return (
      <header className={cn(styles.compact, className)}>
        {icon}
        <h1 className={styles.compactTitle}>{title}</h1>
        {metadata}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </header>
    )
  }

  // Section variant
  return (
    <motion.header
      className={cn(styles.section, className)}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={entranceTransition}
    >
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1">
          <h1 className={styles.sectionTitle}>{title}</h1>
          {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
          {metadata}
        </div>
        {actions}
      </div>
    </motion.header>
  )
}

export type { PageHeaderProps, PageHeaderVariant }
