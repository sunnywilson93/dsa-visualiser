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
import { reactConcepts } from '@/data/reactConcepts'
import { tsConcepts } from '@/data/tsConcepts'
import { systemDesignConcepts } from '@/data/systemDesignConcepts'
import { problemConcepts } from '@/data/algorithmConcepts'
import { topicHubs } from '@/data/topicHubs'
import { comparisons } from '@/data/comparisons'
import { reactChallenges } from '@/data/reactChallenges'
import { quizzes } from '@/data/quizzes'

// Content milestone dates — update when meaningful content is added or revised
const JS_DSA_LAST_UPDATED = new Date('2026-03-11')
const REACT_LAST_UPDATED = new Date('2026-03-11')

// Exported for concept page schemas; points to the most recent content update
export const CONTENT_LAST_UPDATED = REACT_LAST_UPDATED

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
      url: `${BASE_URL}/concepts/react`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concepts/ts`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concepts/system-design`,
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
      url: `${BASE_URL}/playground/async-visualizer`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/challenges/react`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
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
    {
      url: `${BASE_URL}/top-questions/javascript`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/top-questions/react`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/top-questions/dsa`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/concepts/dsa/cheatsheet`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/concepts/react/cheatsheet`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // JS Concept pages (/concepts/js/[conceptId])
  const jsConceptPages: MetadataRoute.Sitemap = concepts.map((concept) => ({
    url: `${BASE_URL}/concepts/js/${concept.id}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // DSA Concept pages (/concepts/dsa/[conceptId])
  const dsaConceptPages: MetadataRoute.Sitemap = dsaConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/dsa/${concept.id}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // React Concept pages (/concepts/react/[conceptId])
  const reactConceptPages: MetadataRoute.Sitemap = reactConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/react/${concept.id}`,
    lastModified: REACT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // TypeScript Concept pages (/concepts/ts/[conceptId])
  const tsConceptPages: MetadataRoute.Sitemap = tsConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/ts/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // System Design Concept pages (/concepts/system-design/[conceptId])
  const systemDesignConceptPages: MetadataRoute.Sitemap = systemDesignConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/system-design/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // DSA Pattern pages (/concepts/dsa/patterns/[patternId])
  const dsaPatternPages: MetadataRoute.Sitemap = dsaPatterns.map((pattern) => ({
    url: `${BASE_URL}/concepts/dsa/patterns/${pattern.slug}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Problem category pages (/{categoryId}) — main categories + DSA subcategories
  const categoryPages: MetadataRoute.Sitemap = exampleCategories.map((category) => ({
    url: `${BASE_URL}/${category.id}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // DSA subcategory pages (/{subcategoryId}) — e.g. /sorting, /two-pointers
  const dsaSubcategoryPages: MetadataRoute.Sitemap = dsaSubcategories.map((sub) => ({
    url: `${BASE_URL}/${sub.id}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Problem practice pages (/{categoryId}/{problemId})
  const categoryUrls = new Map([...exampleCategories, ...dsaSubcategories].map((cat) => [cat.id, cat.id]))
  const problemPages: MetadataRoute.Sitemap = codeExamples.flatMap((problem) =>
    getProblemRouteCategoryIds(problem).map((categoryId) => ({
      url: `${BASE_URL}/${categoryUrls.get(categoryId) || problem.category}/${problem.id}`,
      lastModified: JS_DSA_LAST_UPDATED,
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
        lastModified: JS_DSA_LAST_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    })

  // Topic hub pages (/topics/[topicId])
  const topicHubPages: MetadataRoute.Sitemap = topicHubs.map((hub) => ({
    url: `${BASE_URL}/topics/${hub.id}`,
    lastModified: JS_DSA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Comparison pages (/compare/[comparisonId])
  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${BASE_URL}/compare/${c.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // React challenge pages (/challenges/react/[challengeId])
  const challengePages: MetadataRoute.Sitemap = reactChallenges.map((challenge) => ({
    url: `${BASE_URL}/challenges/react/${challenge.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Quiz pages (/quiz/[quizId])
  const quizPages: MetadataRoute.Sitemap = quizzes.map((quiz) => ({
    url: `${BASE_URL}/quiz/${quiz.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Updates/changelog page
  const updatesPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/updates`,
      lastModified: REACT_LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]

  return [
    ...staticPages,
    ...topicHubPages,
    ...jsConceptPages,
    ...dsaConceptPages,
    ...reactConceptPages,
    ...tsConceptPages,
    ...systemDesignConceptPages,
    ...dsaPatternPages,
    ...categoryPages,
    ...dsaSubcategoryPages,
    ...problemPages,
    ...conceptVizPages,
    ...comparisonPages,
    ...challengePages,
    ...quizPages,
    ...updatesPage,
  ]
}
