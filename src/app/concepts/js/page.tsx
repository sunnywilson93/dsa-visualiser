import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import JSConceptsClient from './JSConceptsClient'

export const metadata: Metadata = {
  title: 'JavaScript Concepts - Interactive Visualizations | JS Interview Prep',
  description: 'Master JavaScript concepts with interactive visualizations. Learn closures, hoisting, the event loop, prototypes, the this keyword, and more with step-by-step animations.',
  keywords: 'javascript concepts, closures explained, event loop visualization, hoisting javascript, this keyword, prototypes, scope chain, call stack, async javascript',
  openGraph: {
    title: 'JavaScript Concepts - Interactive Visualizations',
    description: 'Master JavaScript concepts with interactive visualizations. Learn closures, hoisting, event loop, and more.',
    url: 'https://jsinterview.dev/concepts/js',
  },
  alternates: {
    canonical: '/concepts/js',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: 'JavaScript' },
])

export default function JSConceptsPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <JSConceptsClient />
    </>
  )
}
