import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Code, Search, X } from 'lucide-react'
import { useExecutionStore } from '@/store'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import { codeExamples, exampleCategories, type CodeExample } from '@/data/examples'
import styles from './ExampleSelector.module.css'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

export function ExampleSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const setCode = useExecutionStore(state => state.setCode)
  const reset = useExecutionStore(state => state.reset)
  const status = useExecutionStore(state => state.status)

  const handleSelectExample = (example: CodeExample) => {
    if (status !== 'idle') {
      reset()
    }
    setCode(example.code)
    setIsOpen(false)
    setSelectedCategory(null)
    setSearchQuery('')
  }

  const filteredExamples = useMemo(() => {
    let examples = codeExamples

    // Filter by category
    if (selectedCategory) {
      examples = examples.filter(e => e.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      examples = examples.filter(e => e.difficulty === selectedDifficulty)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      examples = examples.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      )
    }

    return examples
  }, [selectedCategory, selectedDifficulty, searchQuery])

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {}
    codeExamples.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Browse problems"
        aria-label="Browse problems"
        aria-expanded={isOpen}
      >
        <Code size={16} />
        <span className={styles.triggerText}>Problems</span>
        <span className={styles.count}>{codeExamples.length}</span>
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Search bar with filters */}
            <div className={styles.searchBar}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search problems"
              />

              <div className={styles.divider} />

              <div className={styles.filterChips}>
                {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    className={`${styles.chip} ${selectedDifficulty === diff ? styles.chipActive : ''}`}
                    onClick={() => setSelectedDifficulty(diff)}
                    data-difficulty={diff}
                  >
                    {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedDifficulty !== 'all') && (
                <span className={styles.resultCount}>{filteredExamples.length}</span>
              )}

              {(searchQuery || selectedDifficulty !== 'all') && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedDifficulty('all')
                  }}
                  aria-label="Clear filters"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className={styles.categories}>
              <button
                className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All ({codeExamples.length})
              </button>
              {exampleCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <ConceptIcon conceptId={cat.id} size={16} />
                  <span>{cat.name}</span>
                  <span className={styles.catCount}>({categoryCount[cat.id] || 0})</span>
                </button>
              ))}
            </div>

            {/* Examples list */}
            <div className={styles.examples}>
              {filteredExamples.length === 0 ? (
                <div className={styles.noResults}>No problems found</div>
              ) : (
                filteredExamples.map(example => (
                  <button
                    key={example.id}
                    className={styles.exampleBtn}
                    onClick={() => handleSelectExample(example)}
                  >
                    <div className={styles.exampleHeader}>
                      <span className={styles.exampleName}>{example.name}</span>
                      <DifficultyIndicator level={example.difficulty} size="sm" />
                    </div>
                    <div className={styles.exampleDesc}>{example.description}</div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => {
            setIsOpen(false)
            setSelectedCategory(null)
            setSearchQuery('')
          }}
        />
      )}
    </div>
  )
}
