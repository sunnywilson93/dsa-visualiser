import type { MetadataRoute } from 'next'
import { concepts } from '@/data/concepts'
import { exampleCategories, codeExamples } from '@/data/examples'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jsinterview.dev'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/concepts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Concept pages
  const conceptPages: MetadataRoute.Sitemap = concepts.map((concept) => ({
    url: `${baseUrl}/concepts/${concept.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = exampleCategories.map((category) => ({
    url: `${baseUrl}/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Problem pages
  const problemPages: MetadataRoute.Sitemap = codeExamples.map((problem) => {
    // Find the category for this problem
    const category = exampleCategories.find(
      (cat) => cat.id === problem.category ||
      (cat.id === 'dsa' && problem.category.startsWith('dsa-'))
    )
    const categoryId = category?.id || 'dsa'

    return {
      url: `${baseUrl}/${categoryId}/${problem.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...conceptPages, ...categoryPages, ...problemPages]
}
