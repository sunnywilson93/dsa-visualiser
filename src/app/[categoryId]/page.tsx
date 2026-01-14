import type { Metadata } from 'next'
import { exampleCategories, getExamplesByCategory } from '@/data/examples'
import CategoryPageClient from './CategoryPageClient'

interface Props {
  params: { categoryId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = exampleCategories.find((c) => c.id === params.categoryId)

  if (!category) {
    return {
      title: 'Category Not Found | JS Interview Prep',
    }
  }

  const problemCount = getExamplesByCategory(params.categoryId).length

  const isDsa = params.categoryId === 'dsa'
  const titlePrefix = isDsa ? 'DSA Problems' : category.name

  return {
    title: `${titlePrefix} - ${problemCount} Coding Challenges | JS Interview Prep`,
    description: `${category.description}. Practice ${problemCount} interactive coding problems with step-by-step execution visualization.`,
    keywords: `${category.name.toLowerCase()}, javascript ${category.name.toLowerCase()}, coding interview, ${isDsa ? 'data structures algorithms leetcode' : 'javascript practice'}`,
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
  return exampleCategories.map((category) => ({
    categoryId: category.id,
  }))
}

export default function CategoryPage() {
  return <CategoryPageClient />
}
