import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import TSConceptsClient from './TSConceptsClient'

export const metadata: Metadata = {
  title: 'TypeScript Concepts - Interactive Visualizations | JS Interview Prep',
  description: 'Master TypeScript concepts with interactive visualizations. Learn type narrowing, generics, utility types, mapped types, conditional types, and React + TypeScript patterns.',
  keywords: 'typescript concepts, typescript generics, utility types, type narrowing, conditional types, typescript interview, typescript react',
  openGraph: {
    title: 'TypeScript Concepts - Interactive Visualizations',
    description: 'Master TypeScript concepts with interactive visualizations. Learn type narrowing, generics, utility types, and advanced patterns.',
    url: 'https://jsinterview.dev/concepts/ts',
  },
  alternates: {
    canonical: '/concepts/ts',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: 'TypeScript' },
])

export default function TSConceptsPage(): JSX.Element {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <TSConceptsClient />
    </>
  )
}
