'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import type { SearchResult } from '@/lib/search'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

const sourceLabels = {
  js: 'JS',
  dsa: 'DSA',
}

interface SearchResultItemProps {
  result: SearchResult
  onClick?: () => void
  compact?: boolean
}

export function SearchResultItem({ result, onClick, compact = false }: SearchResultItemProps) {
  const { item } = result

  const badges = (
    <div className="flex items-center gap-[3px] shrink-0 [&:not(.compact)]:ml-auto">
      <span
        className={`
          text-2xs font-semibold py-0.5 px-[3px] rounded-sm uppercase tracking-tight min-w-8 text-center
          ${item.source === 'dsa' ? 'bg-brand-secondary-30 text-brand-secondary' : 'bg-brand-primary-30 text-brand-light'}
        `}
      >
        {sourceLabels[item.source]}
      </span>
      <DifficultyIndicator level={item.difficulty} size="sm" />
    </div>
  )

  // Compact mode uses CSS Grid: icon | title | badges
  if (compact) {
    return (
      <Link
        href={item.href}
        className="grid grid-cols-[24px_1fr_auto] items-center gap-3 py-3 px-3 rounded-md no-underline text-inherit transition-colors duration-150 hover:bg-brand-primary-20"
        onClick={onClick}
      >
        <span className="text-lg w-6 text-center flex items-center justify-center shrink-0 leading-none">
          <ConceptIcon conceptId={item.id} size={18} />
        </span>
        <span className="text-base text-text-bright whitespace-nowrap overflow-hidden text-ellipsis">
          {item.title}
        </span>
        {badges}
      </Link>
    )
  }

  // Full mode uses flexbox with nested content
  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 p-3 rounded-lg no-underline text-inherit transition-colors duration-150 hover:bg-brand-primary-15"
      onClick={onClick}
    >
      <span className="text-xl leading-none shrink-0">
        <ConceptIcon conceptId={item.id} size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-medium text-text-bright">{item.title}</span>
          {badges}
        </div>
        <p className="text-base text-text-muted mt-1 m-0 leading-snug">{item.shortDescription}</p>
      </div>
    </Link>
  )
}

interface SearchResultsListProps {
  results: SearchResult[]
  onItemClick?: () => void
  maxItems?: number
  compact?: boolean
  emptyMessage?: string
}

export function SearchResultsList({
  results,
  onItemClick,
  maxItems,
  compact = false,
  emptyMessage = 'No results found',
}: SearchResultsListProps) {
  const displayedResults = maxItems ? results.slice(0, maxItems) : results

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-text-muted">
        <span className="text-3xl mb-2 opacity-50">
          <Search size={24} />
        </span>
        <p className="m-0 text-base">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {displayedResults.map((result) => (
        <SearchResultItem
          key={`${result.item.source}-${result.item.id}`}
          result={result}
          onClick={onItemClick}
          compact={compact}
        />
      ))}
      {maxItems && results.length > maxItems && (
        <div className="py-2 px-3 text-sm text-text-muted text-center border-t border-border-card mt-1">
          +{results.length - maxItems} more results
        </div>
      )}
    </div>
  )
}
