import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import ReactConceptsClient from './ReactConceptsClient'

export const metadata: Metadata = {
  title: 'React Concepts - Interactive Visualizations | JS Interview Prep',
  description: 'Master React concepts with interactive visualizations. Learn hooks, rendering, component patterns, and performance optimization with step-by-step examples.',
  keywords: 'react concepts, react hooks, virtual dom, react patterns, react performance, react interview',
  openGraph: {
    title: 'React Concepts - Interactive Visualizations',
    description: 'Master React concepts with interactive visualizations. Learn hooks, rendering, component patterns, and performance optimization.',
    url: 'https://jsinterview.dev/concepts/react',
  },
  alternates: {
    canonical: '/concepts/react',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: 'React' },
])

export default function ReactConceptsPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <ReactConceptsClient />
    </>
  )
}
