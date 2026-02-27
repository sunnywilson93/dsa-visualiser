'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/NavBar'
import { cn } from '@/utils/cn'
import { pageEnter, entranceTransition } from '@/lib/motion'

type PageLayoutVariant = 'wide' | 'content' | 'narrow'

interface Breadcrumb {
  label: string
  path?: string
}

interface PageLayoutProps {
  variant: PageLayoutVariant
  breadcrumbs?: Breadcrumb[]
  children: ReactNode
  className?: string
  article?: boolean
}

const containerClass: Record<PageLayoutVariant, string> = {
  wide: 'container-default',
  content: 'container-content',
  narrow: 'container-narrow',
}

export function PageLayout({ variant, breadcrumbs, children, className, article }: PageLayoutProps) {
  const content = article ? <article>{children}</article> : children
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={breadcrumbs} />
      <motion.main
        className={cn(
          'flex-1 py-8 px-8 max-md:px-4 mx-auto w-full',
          containerClass[variant],
          className,
        )}
        variants={pageEnter}
        initial="hidden"
        animate="visible"
        transition={entranceTransition}
      >
        {content}
      </motion.main>
    </div>
  )
}

export type { PageLayoutProps, PageLayoutVariant }
