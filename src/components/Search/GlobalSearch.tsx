'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useSearch } from '@/lib/search'
import { SearchResultsList } from './SearchResults'

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
    <div ref={containerRef} className="relative flex-1 max-w-[320px] mx-4 max-md:max-w-[200px] max-md:mx-2 max-sm:max-w-[100px]">
      <div
        className={`
          flex items-center gap-2 bg-white-5 border border-brand-primary-20 rounded-lg py-[3px] px-3 transition-all duration-150
          max-md:py-1 max-md:px-2
          hover:border-brand-primary-40
          ${inputFocused ? 'border-brand-primary-50 shadow-[0_0_0_3px_var(--color-brand-primary-15)] bg-white-8' : ''}
        `}
      >
        <Search
          size={16}
          className={`text-gray-400 shrink-0 transition-colors ${inputFocused ? 'text-brand-primary' : ''}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search concepts..."
          className="flex-1 bg-transparent border-none outline-none text-base text-text-bright min-w-0 placeholder:text-gray-600 max-sm:placeholder:overflow-hidden max-sm:placeholder:text-ellipsis"
          aria-label="Search concepts"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center bg-transparent border-none text-gray-600 cursor-pointer p-0.5 rounded-sm transition-all duration-150 hover:text-text-bright hover:bg-white-10"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <kbd className="text-2xs py-0.5 px-[3px] rounded-sm bg-white-10 text-gray-600 font-inherit border border-white-8 shrink-0 max-md:hidden">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-bg-page-secondary border border-brand-primary-30 rounded-lg shadow-lg z-[1000] p-2 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-primary-30 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-brand-primary-50"
          style={{
            boxShadow: '0 4px 24px var(--color-black-40), 0 0 20px var(--color-brand-primary-10)',
          }}
        >
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
