'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, entranceTransition } from '@/lib/motion'

interface SectionContainerProps {
  title: string
  subtitle?: ReactNode
  number?: number
  viewAllHref?: string
  viewAllLabel?: string
  children: ReactNode
}

export function SectionContainer({
  title,
  subtitle,
  number,
  viewAllHref,
  viewAllLabel,
  children,
}: SectionContainerProps) {
  return (
    <motion.section
      className="mb-10"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={entranceTransition}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-text-bright m-0">
            {number !== undefined && (
              <span className="inline-flex items-center justify-center w-7 h-7 bg-brand-primary rounded-lg text-base font-bold text-white">
                {number}
              </span>
            )}
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-text-secondary mt-1 mb-0">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-base text-brand-primary no-underline py-2 px-0 hover:text-brand-secondary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none focus-visible:rounded"
          >
            {viewAllLabel ?? 'View All \u2192'}
          </Link>
        )}
      </div>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {children}
      </motion.div>
    </motion.section>
  )
}

export type { SectionContainerProps }
