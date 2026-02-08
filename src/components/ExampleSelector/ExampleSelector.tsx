import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Code, Search, X } from 'lucide-react'
import { useExecutionStore } from '@/store'
import { ConceptIcon } from '@/components/Icons'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'
import { codeExamples, exampleCategories, type CodeExample } from '@/data/examples'

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
    <div className="relative">
      <button
        className="flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-xs)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[color:var(--color-text-secondary)] text-[length:var(--text-base)] font-medium cursor-pointer transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-bg-elevated)] hover:text-[color:var(--color-text-primary)] max-[480px]:p-[var(--spacing-sm)]"
        onClick={() => setIsOpen(!isOpen)}
        title="Browse problems"
        aria-label="Browse problems"
        aria-expanded={isOpen}
      >
        <Code size={16} />
        <span className="max-[480px]:hidden">Problems</span>
        <span className="bg-[var(--color-accent-blue)] text-[color:var(--color-white)] px-[6px] py-[2px] rounded-[var(--radius-sm)] text-[length:var(--text-xs)] font-semibold">{codeExamples.length}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-[var(--transition-fast)] max-[480px]:hidden ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-[calc(100%+var(--spacing-sm))] right-0 w-[400px] max-w-[calc(100vw-var(--spacing-2xl))] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden z-[100] max-[480px]:fixed max-[480px]:top-auto max-[480px]:bottom-0 max-[480px]:left-0 max-[480px]:right-0 max-[480px]:w-full max-[480px]:max-w-full max-[480px]:rounded-t-[var(--radius-lg)] max-[480px]:max-h-[80vh]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Search bar with filters */}
            <div className="flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] max-[480px]:flex-wrap max-[480px]:gap-[var(--spacing-xs)] max-[480px]:p-[var(--spacing-sm)]">
              <Search size={14} className="text-[color:var(--color-text-muted)] flex-shrink-0 max-[480px]:order-0" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[var(--spacing-6xl)] px-0 py-[var(--spacing-xs)] bg-transparent border-none outline-none text-[color:var(--color-text-primary)] text-[length:var(--text-base)] placeholder:text-[color:var(--color-text-muted)] max-[480px]:order-1 max-[480px]:flex-[1_1_60%] max-[480px]:min-w-[100px]"
                aria-label="Search problems"
              />

              <div className="w-px h-[var(--spacing-lg)] bg-[var(--color-border-primary)] flex-shrink-0 max-[480px]:hidden" />

              <div className="flex items-center gap-[2px] flex-shrink-0 max-[480px]:order-3 max-[480px]:flex-[1_1_100%] max-[480px]:mt-[var(--spacing-xs)] max-[480px]:justify-start">
                {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    className={`flex items-center justify-center bg-transparent border-none text-[color:var(--color-text-muted)] text-[length:var(--text-xs)] font-medium px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] cursor-pointer transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-brand-primary-5)] hover:text-[color:var(--color-text-secondary)] max-[480px]:text-[length:var(--text-xs)] max-[480px]:px-[6px] max-[480px]:py-[3px] ${selectedDifficulty === diff ? 'bg-[var(--color-brand-primary-20)] text-[color:var(--color-brand-light)]' : ''} ${selectedDifficulty === diff && diff === 'easy' ? '!bg-[var(--difficulty-easy-bg)] !text-[var(--difficulty-easy)]' : ''} ${selectedDifficulty === diff && diff === 'medium' ? '!bg-[var(--difficulty-medium-bg)] !text-[var(--difficulty-medium)]' : ''} ${selectedDifficulty === diff && diff === 'hard' ? '!bg-[var(--difficulty-hard-bg)] !text-[var(--difficulty-hard)]' : ''}`}
                    onClick={() => setSelectedDifficulty(diff)}
                    data-difficulty={diff}
                  >
                    {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedDifficulty !== 'all') && (
                <span className="text-[length:var(--text-xs)] font-medium text-[color:var(--color-text-muted)] bg-[var(--color-brand-primary-10)] px-[6px] py-[2px] rounded-[var(--radius-sm)] flex-shrink-0 max-[480px]:order-4">{filteredExamples.length}</span>
              )}

              {(searchQuery || selectedDifficulty !== 'all') && (
                <button
                  type="button"
                  className="flex items-center justify-center bg-transparent border-none text-[color:var(--color-text-muted)] cursor-pointer p-[var(--spacing-xs)] rounded-[var(--radius-sm)] transition-all duration-[var(--transition-fast)] flex-shrink-0 hover:text-[var(--difficulty-hard)] hover:bg-[var(--difficulty-hard-bg)] max-[480px]:order-2"
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
            <div className="flex flex-wrap gap-[var(--spacing-xs)] p-[var(--spacing-sm)] bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border-primary)] max-h-[120px] overflow-y-auto max-[480px]:p-[var(--spacing-md)] max-[480px]:gap-[var(--spacing-sm)] max-[480px]:max-h-[100px] max-[480px]:flex-nowrap max-[480px]:overflow-x-auto max-[480px]:[-webkit-overflow-scrolling:touch]">
              <button
                className={`flex items-center gap-[var(--spacing-xs)] px-[10px] py-[var(--spacing-xs)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-sm)] text-[color:var(--color-text-muted)] text-[length:var(--text-xs)] font-medium cursor-pointer transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-bg-elevated)] hover:text-[color:var(--color-text-secondary)] max-[480px]:flex-shrink-0 max-[480px]:px-[var(--spacing-md)] max-[480px]:py-[6px] max-[480px]:text-[length:var(--text-sm)] ${!selectedCategory ? 'bg-[var(--color-accent-blue)] !border-[var(--color-accent-blue)] !text-[color:var(--color-white)]' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All ({codeExamples.length})
              </button>
              {exampleCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`flex items-center gap-[var(--spacing-xs)] px-[10px] py-[var(--spacing-xs)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-sm)] text-[color:var(--color-text-muted)] text-[length:var(--text-xs)] font-medium cursor-pointer transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-bg-elevated)] hover:text-[color:var(--color-text-secondary)] max-[480px]:flex-shrink-0 max-[480px]:px-[var(--spacing-md)] max-[480px]:py-[6px] max-[480px]:text-[length:var(--text-sm)] ${selectedCategory === cat.id ? 'bg-[var(--color-accent-blue)] !border-[var(--color-accent-blue)] !text-[color:var(--color-white)]' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <ConceptIcon conceptId={cat.id} size={16} />
                  <span>{cat.name}</span>
                  <span className="opacity-70 text-[length:var(--text-xs)]">({categoryCount[cat.id] || 0})</span>
                </button>
              ))}
            </div>

            {/* Examples list */}
            <div className="max-h-[350px] overflow-y-auto p-[var(--spacing-xs)] max-[480px]:max-h-[calc(80vh-200px)] max-[480px]:p-[var(--spacing-sm)]">
              {filteredExamples.length === 0 ? (
                <div className="p-[var(--spacing-lg)] text-center text-[color:var(--color-text-muted)] text-[length:var(--text-base)]">No problems found</div>
              ) : (
                filteredExamples.map(example => (
                  <button
                    key={example.id}
                    className="block w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-transparent border-none rounded-[var(--radius-md)] text-left cursor-pointer transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-bg-tertiary)] max-[480px]:p-[var(--spacing-md)]"
                    onClick={() => handleSelectExample(example)}
                  >
                    <div className="flex items-center justify-between gap-[var(--spacing-sm)] mb-[2px]">
                      <span className="text-[length:var(--text-base)] font-semibold text-[color:var(--color-text-primary)] max-[480px]:text-[length:var(--text-base)]">{example.name}</span>
                      <DifficultyIndicator level={example.difficulty} size="sm" />
                    </div>
                    <div className="text-[length:var(--text-xs)] text-[color:var(--color-text-muted)] max-[480px]:text-[length:var(--text-sm)] max-[480px]:mt-[var(--spacing-xs)]">{example.description}</div>
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
          className="fixed inset-0 z-[99]"
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
