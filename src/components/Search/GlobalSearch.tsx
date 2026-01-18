'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useSearch } from '@/lib/search'
import { SearchResultsList } from './SearchResults'
import styles from './GlobalSearch.module.css'

export function GlobalSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { query, setQuery, results, isSearching } = useSearch()

  // Show dropdown when there's a query and results
  const showDropdown = isOpen && isSearching

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }

      // Cmd/Ctrl + K to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setInputFocused(true)
    setIsOpen(true)
  }

  const handleInputBlur = () => {
    setInputFocused(false)
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={`${styles.inputWrapper} ${inputFocused ? styles.focused : ''}`}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search concepts..."
          className={styles.input}
          aria-label="Search concepts"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <kbd className={styles.shortcut}>⌘K</kbd>
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          <SearchResultsList
            results={results}
            onItemClick={handleResultClick}
            maxItems={8}
            compact
            emptyMessage="No concepts found"
          />
        </div>
      )}
    </div>
  )
}
