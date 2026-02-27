import type { MetadataRoute } from 'next'
import { concepts } from '@/data/concepts'
import {
  exampleCategories,
  dsaSubcategories,
  codeExamples,
  getProblemRouteCategoryIds,
} from '@/data/examples'
import { dsaPatterns } from '@/data/dsaPatterns'
import { dsaConcepts } from '@/data/dsaConcepts'
import { problemConcepts } from '@/data/algorithmConcepts'

/**
 * Build-time timestamp so the sitemap always reflects the latest deploy.
 */
export const CONTENT_LAST_UPDATED = new Date()

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
      url: `${BASE_URL}/interview`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interview/html`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interview/css`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interview/js`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interview/react`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interview/bundlers`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/playground/event-loop`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/concepts/dsa/roadmap`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/concepts/js/cheatsheet`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
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

  // Problem category pages (/{categoryId}) — main categories + DSA subcategories
  const categoryPages: MetadataRoute.Sitemap = exampleCategories.map((category) => ({
    url: `${BASE_URL}/${category.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // DSA subcategory pages (/{subcategoryId}) — e.g. /sorting, /two-pointers
  const dsaSubcategoryPages: MetadataRoute.Sitemap = dsaSubcategories.map((sub) => ({
    url: `${BASE_URL}/${sub.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Problem practice pages (/{categoryId}/{problemId})
  const categoryUrls = new Map([...exampleCategories, ...dsaSubcategories].map((cat) => [cat.id, cat.id]))
  const problemPages: MetadataRoute.Sitemap = codeExamples.flatMap((problem) =>
    getProblemRouteCategoryIds(problem).map((categoryId) => ({
      url: `${BASE_URL}/${categoryUrls.get(categoryId) || problem.category}/${problem.id}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  )

  // Concept visualization pages (/{categoryId}/{problemId}/concept)
  const conceptVizPages: MetadataRoute.Sitemap = Object.keys(problemConcepts)
    .flatMap((problemId) => {
      const problem = codeExamples.find((p) => p.id === problemId)
      if (!problem) return []
      return getProblemRouteCategoryIds(problem).map((categoryId) => ({
        url: `${BASE_URL}/${categoryUrls.get(categoryId) || problem.category}/${problem.id}/concept`,
        lastModified: CONTENT_LAST_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    })

  return [
    ...staticPages,
    ...jsConceptPages,
    ...dsaConceptPages,
    ...dsaPatternPages,
    ...categoryPages,
    ...dsaSubcategoryPages,
    ...problemPages,
    ...conceptVizPages,
  ]
}
