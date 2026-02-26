'use client'

import { cn } from '@/utils/cn'
import styles from './FilterBar.module.css'

interface FilterOption {
  id: string
  label: string
  count?: number
}

type FilterBarVariant = 'pill' | 'tab'

interface FilterBarProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (id: string) => void
  variant?: FilterBarVariant
  className?: string
}

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  variant = 'pill',
  className,
}: FilterBarProps) {
  const buttonClass = variant === 'pill' ? styles.pill : styles.tab
  const activeClass = variant === 'pill' ? styles.pillActive : styles.tabActive

  return (
    <div className={cn(styles.container, className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={cn(buttonClass, activeFilter === filter.id && activeClass)}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
          {filter.count !== undefined && ` (${filter.count})`}
        </button>
      ))}
    </div>
  )
}

export type { FilterBarProps, FilterBarVariant, FilterOption }
