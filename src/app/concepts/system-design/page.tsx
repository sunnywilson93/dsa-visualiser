import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import SystemDesignConceptsClient from './SystemDesignConceptsClient'

export const metadata: Metadata = {
  title: 'Frontend System Design - Interactive Visualizations | JS Interview Prep',
  description: 'Master frontend system design with interactive visualizations. Learn the RADIO framework, component architecture, data fetching, state management, and real-world case studies.',
  keywords: 'frontend system design, system design interview, RADIO framework, component architecture, data fetching patterns, state management, performance optimization, accessibility',
  openGraph: {
    title: 'Frontend System Design - Interactive Visualizations',
    description: 'Master frontend system design with interactive visualizations. Learn architecture patterns, performance optimization, and real-world case studies.',
    url: 'https://jsinterview.dev/concepts/system-design',
  },
  alternates: {
    canonical: '/concepts/system-design',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: 'System Design' },
])

export default function SystemDesignConceptsPage(): JSX.Element {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <SystemDesignConceptsClient />
    </>
  )
}
