'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { staggerItem, hoverLift, tapScale } from '@/lib/motion'
import styles from './ContentCard.module.css'

type ContentCardVariant = 'feature' | 'compact' | 'listing' | 'interactive'

interface ContentCardProps {
  href: string
  variant: ContentCardVariant
  children: ReactNode
  className?: string
}

export function ContentCard({ href, variant, children, className }: ContentCardProps) {
  return (
    <motion.div variants={staggerItem} {...hoverLift} {...tapScale}>
      <Link
        href={href}
        className={cn(styles.card, styles[variant], className)}
      >
        {variant === 'feature' ? (
          <div className={styles.featureInner}>{children}</div>
        ) : (
          children
        )}
      </Link>
    </motion.div>
  )
}

export type { ContentCardProps, ContentCardVariant }
