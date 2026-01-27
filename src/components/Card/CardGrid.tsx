'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  return (
    <div
      className={clsx(
        'grid gap-4',
        columns === 2 && 'grid-cols-2 max-md:grid-cols-1',
        columns === 3 && 'grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1',
        columns === 4 && 'grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1'
      )}
    >
      {children}
    </div>
  )
}
