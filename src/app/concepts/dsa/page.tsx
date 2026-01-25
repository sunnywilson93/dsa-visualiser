import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import DSAConceptsClient from './DSAConceptsClient'

export const metadata: Metadata = {
  title: 'DSA Concepts - Data Structures & Algorithms | JS Interview Prep',
  description: 'Master data structures and algorithms with interactive visualizations. Learn arrays, linked lists, trees, graphs, and algorithm patterns with step-by-step animations.',
  keywords: 'data structures, algorithms, dsa concepts, arrays, linked lists, trees, graphs, sorting, searching, algorithm patterns, coding interview',
  openGraph: {
    title: 'DSA Concepts - Data Structures & Algorithms',
    description: 'Master data structures and algorithms with interactive visualizations and step-by-step animations.',
    url: 'https://jsinterview.dev/concepts/dsa',
  },
  alternates: {
    canonical: '/concepts/dsa',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: 'DSA' },
])

export default function DSAConceptsPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <DSAConceptsClient />
    </>
  )
}
