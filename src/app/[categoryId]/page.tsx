import type { Metadata } from 'next'
import { exampleCategories, dsaSubcategories, getExamplesByCategory } from '@/data/examples'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import CategoryPageClient from './CategoryPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

interface Props {
  params: { categoryId: string }
}

// Combine main categories and DSA subcategories for lookups
const allCategories = [
  ...exampleCategories,
  ...dsaSubcategories.map(sub => ({ ...sub, description: `Practice ${sub.name} problems` })),
]

// Helper to find category in combined list
const findCategory = (id: string) => allCategories.find((c) => c.id === id)

// Check if this is a DSA subcategory
const isDsaSubcategory = (id: string) => dsaSubcategories.some((s) => s.id === id)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = findCategory(params.categoryId)

  if (!category) {
    return {
      title: 'Category Not Found | JS Interview Prep',
    }
  }

  const problems = getExamplesByCategory(params.categoryId)
  const problemCount = problems.length
  const easyCount = problems.filter(p => p.difficulty === 'easy').length
  const medCount = problems.filter(p => p.difficulty === 'medium').length
  const hardCount = problems.filter(p => p.difficulty === 'hard').length

  const isDsa = params.categoryId === 'dsa'
  const isSubcategory = isDsaSubcategory(params.categoryId)
  const titlePrefix = isDsa ? 'DSA Problems' : category.name

  return {
    title: `${titlePrefix} — ${problemCount} JavaScript Practice Problems with Visual Explanations`,
    description: `${problemCount} ${titlePrefix} problems (${easyCount} easy, ${medCount} medium, ${hardCount} hard). Practice with step-by-step execution visualization.`,
    keywords: `${category.name.toLowerCase()}, javascript ${category.name.toLowerCase()} practice, ${category.name.toLowerCase()} interview questions, coding interview, ${isDsa || isSubcategory ? 'data structures algorithms leetcode' : 'javascript practice'}`,
    openGraph: {
      title: `${titlePrefix} — JavaScript Practice Problems`,
      description: `${category.longDescription || category.description}. ${problemCount} problems with visualization.`,
      url: `https://jsinterview.dev/${category.id}`,
    },
    alternates: {
      canonical: `/${category.id}`,
    },
  }
}

export async function generateStaticParams() {
  return allCategories.map((category) => ({
    categoryId: category.id,
  }))
}

function generateArticleSchema(
  category: NonNullable<ReturnType<typeof findCategory>>,
  problemCount: number,
) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Article' as const,
    headline: `${category.name} - JavaScript Coding Challenges`,
    description: category.longDescription || category.description,
    author: {
      '@type': 'Organization' as const,
      name: 'JS Interview Prep',
    },
    publisher: {
      '@type': 'Organization' as const,
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `https://jsinterview.dev/${category.id}`,
    },
    articleSection: 'Coding Challenges',
    keywords: `${category.name}, JavaScript, coding interview, practice problems`,
    datePublished: CONTENT_LAST_UPDATED.toISOString(),
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
    about: {
      '@type': 'Thing' as const,
      name: category.name,
      description: `${problemCount} interactive coding problems with step-by-step visualization`,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const category = findCategory(params.categoryId)
  const problemCount = category ? getExamplesByCategory(params.categoryId).length : 0

  const breadcrumbSchema = category
    ? generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: category.name },
      ])
    : null
  const articleSchema = category ? generateArticleSchema(category, problemCount) : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      {articleSchema && <StructuredData data={articleSchema} />}
      {category?.longDescription && (
        <section className="sr-only">
          <h2>About {category.name}</h2>
          <p>{category.longDescription}</p>
          <p>Practice {problemCount} interactive coding problems with step-by-step execution visualization.</p>
        </section>
      )}
      <CategoryPageClient />
    </>
  )
}
