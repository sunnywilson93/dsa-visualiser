'use client'

import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ProblemListingLayout,
  type CategoryInfo,
} from '@/components/ProblemListingLayout'
import {
  exampleCategories,
  getAllJsExamples,
  type CodeExample,
} from '@/data/examples'

const jsCategories = exampleCategories.filter((category) => category.id !== 'dsa')
const jsCategoryMap = new Map(jsCategories.map((category) => [category.id, category]))

const getProblemCategories = (problem: CodeExample) => problem.categories || [problem.category]

export default function JSProblemsPageClient() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allProblems = useMemo(() => getAllJsExamples(), [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProblems.forEach((problem) => {
      getProblemCategories(problem).forEach((categoryId) => {
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })
    })
    return counts
  }, [allProblems])

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return allProblems
    return allProblems.filter((problem) =>
      getProblemCategories(problem).includes(selectedCategory)
    )
  }, [allProblems, selectedCategory])

  const categoryFilters = useMemo(
    () =>
      jsCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: categoryCounts[cat.id] || 0,
      })),
    [categoryCounts]
  )

  const getCategoryForProblem = useCallback((problem: CodeExample): CategoryInfo => {
    const category = jsCategoryMap.get(problem.category)
    return {
      id: category?.id || 'js-core',
      name: category?.name || 'JavaScript',
    }
  }, [])

  const getProblemHref = useCallback(
    (problem: CodeExample) => {
      const targetCategory = selectedCategory || problem.category
      return `/${targetCategory}/${problem.id}`
    },
    [selectedCategory]
  )

  const handleCategoryClick = useCallback(
    (_problem: CodeExample, category: CategoryInfo) => {
      setSelectedCategory((current) =>
        current === category.id ? null : category.id
      )
    },
    []
  )

  const handleCategoryFilterChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }, [])

  return (
    <ProblemListingLayout
      config={{
        title: 'All JavaScript Problems',
        subtitle: `${allProblems.length} problems across ${jsCategories.length} categories`,
        iconId: 'js-core',
        breadcrumbs: [{ label: 'All JS Problems' }],
      }}
      problems={filteredByCategory}
      getCategoryForProblem={getCategoryForProblem}
      getProblemHref={getProblemHref}
      onCategoryClick={handleCategoryClick}
      categoryFilters={categoryFilters}
      selectedCategory={selectedCategory}
      onCategoryFilterChange={handleCategoryFilterChange}
    />
  )
}
