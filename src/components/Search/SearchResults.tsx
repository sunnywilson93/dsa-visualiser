'use client'

import Link from 'next/link'
import type { SearchResult } from '@/lib/search'
import styles from './SearchResults.module.css'

const difficultyColors = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

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
    <div className={styles.badges}>
      <span
        className={styles.sourceBadge}
        data-source={item.source}
      >
        {sourceLabels[item.source]}
      </span>
      <span
        className={styles.difficultyBadge}
        style={{ backgroundColor: difficultyColors[item.difficulty] }}
      >
        {item.difficulty}
      </span>
    </div>
  )

  // Compact mode uses CSS Grid: icon | title | badges
  if (compact) {
    return (
      <Link
        href={item.href}
        className={styles.itemCompact}
        onClick={onClick}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.title}>{item.title}</span>
        {badges}
      </Link>
    )
  }

  // Full mode uses flexbox with nested content
  return (
    <Link
      href={item.href}
      className={styles.item}
      onClick={onClick}
    >
      <span className={styles.icon}>{item.icon}</span>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{item.title}</span>
          {badges}
        </div>
        <p className={styles.description}>{item.shortDescription}</p>
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
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {displayedResults.map((result) => (
        <SearchResultItem
          key={`${result.item.source}-${result.item.id}`}
          result={result}
          onClick={onItemClick}
          compact={compact}
        />
      ))}
      {maxItems && results.length > maxItems && (
        <div className={styles.moreResults}>
          +{results.length - maxItems} more results
        </div>
      )}
    </div>
  )
}
