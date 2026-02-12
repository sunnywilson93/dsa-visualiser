import type { MetadataRoute } from 'next'
import { concepts } from '@/data/concepts'
import { exampleCategories, codeExamples, isDsaSubcategory } from '@/data/examples'
import { dsaPatterns } from '@/data/dsaPatterns'
import { dsaConcepts } from '@/data/dsaConcepts'
import { problemConcepts } from '@/data/algorithmConcepts'

/**
 * Last content update timestamp.
 * Update this when making significant content changes.
 */
export const CONTENT_LAST_UPDATED = new Date('2026-02-12')

const BASE_URL = 'https://jsinterview.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/concepts`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concepts/js`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concepts/dsa`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/js-problems`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/playground/event-loop`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // JS Concept pages (/concepts/js/[conceptId])
  const jsConceptPages: MetadataRoute.Sitemap = concepts.map((concept) => ({
    url: `${BASE_URL}/concepts/js/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // DSA Concept pages (/concepts/dsa/[conceptId])
  const dsaConceptPages: MetadataRoute.Sitemap = dsaConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/dsa/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // DSA Pattern pages (/concepts/dsa/patterns/[patternId])
  const dsaPatternPages: MetadataRoute.Sitemap = dsaPatterns.map((pattern) => ({
    url: `${BASE_URL}/concepts/dsa/patterns/${pattern.slug}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Problem category pages (/{categoryId})
  const categoryPages: MetadataRoute.Sitemap = exampleCategories.map((category) => ({
    url: `${BASE_URL}/${category.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Problem practice pages (/{categoryId}/{problemId})
  const problemPages: MetadataRoute.Sitemap = codeExamples.map((problem) => {
    const category = exampleCategories.find(
      (cat) => cat.id === problem.category ||
      (cat.id === 'dsa' && problem.category.startsWith('dsa-'))
    )
    const categoryId = category?.id || 'dsa'

    return {
      url: `${BASE_URL}/${categoryId}/${problem.id}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // Concept visualization pages (/{categoryId}/{problemId}/concept)
  const conceptVizPages: MetadataRoute.Sitemap = Object.keys(problemConcepts)
    .map((problemId) => {
      const problem = codeExamples.find((p) => p.id === problemId)
      if (!problem) return null
      const category = exampleCategories.find(
        (cat) => cat.id === problem.category ||
        (cat.id === 'dsa' && isDsaSubcategory(problem.category))
      )
      const categoryId = category?.id || problem.category
      return {
        url: `${BASE_URL}/${categoryId}/${problem.id}/concept`,
        lastModified: CONTENT_LAST_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  return [
    ...staticPages,
    ...jsConceptPages,
    ...dsaConceptPages,
    ...dsaPatternPages,
    ...categoryPages,
    ...problemPages,
    ...conceptVizPages,
  ]
}
