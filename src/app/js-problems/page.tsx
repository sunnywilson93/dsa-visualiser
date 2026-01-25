import type { Metadata } from 'next'
import { exampleCategories, getAllJsExamples } from '@/data/examples'
import JSProblemsPageClient from './JSProblemsPageClient'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

const jsCategories = exampleCategories.filter((category) => category.id !== 'dsa')

export async function generateMetadata(): Promise<Metadata> {
  const problemCount = getAllJsExamples().length
  const categoryNames = jsCategories.map((category) => category.name).join(', ')

  return {
    title: `All JavaScript Problems - ${problemCount} Coding Challenges | JS Interview Prep`,
    description: `Practice ${problemCount} JavaScript problems across ${jsCategories.length} categories like ${categoryNames}.`,
    keywords: `javascript problems, ${categoryNames.toLowerCase()}, coding interview, frontend interview`,
    openGraph: {
      title: 'All JavaScript Problems - JS Interview Prep',
      description: `Practice ${problemCount} JavaScript problems with interactive visualization.`,
      url: 'https://jsinterview.dev/js-problems',
    },
    alternates: {
      canonical: '/js-problems',
    },
  }
}

export default function JSProblemsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'JavaScript Problems' },
  ])

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <JSProblemsPageClient />
    </>
  )
}
