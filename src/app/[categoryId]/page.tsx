import type { Metadata } from 'next'
import { exampleCategories, dsaSubcategories, getExamplesByCategory } from '@/data/examples'
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

  const problemCount = getExamplesByCategory(params.categoryId).length

  const isDsa = params.categoryId === 'dsa'
  const isSubcategory = isDsaSubcategory(params.categoryId)
  const titlePrefix = isDsa ? 'DSA Problems' : category.name

  return {
    title: `${titlePrefix} - ${problemCount} Coding Challenges | JS Interview Prep`,
    description: `${category.description}. Practice ${problemCount} interactive coding problems with step-by-step execution visualization.`,
    keywords: `${category.name.toLowerCase()}, javascript ${category.name.toLowerCase()}, coding interview, ${isDsa || isSubcategory ? 'data structures algorithms leetcode' : 'javascript practice'}`,
    openGraph: {
      title: `${titlePrefix} - JavaScript Coding Challenges`,
      description: `${category.description}. ${problemCount} problems with visualization.`,
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

export default function CategoryPage({ params }: Props) {
  const category = findCategory(params.categoryId)

  const breadcrumbSchema = category
    ? generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: category.name },
      ])
    : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <CategoryPageClient />
    </>
  )
}
