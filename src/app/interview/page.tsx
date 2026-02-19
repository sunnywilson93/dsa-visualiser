import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import InterviewLanding from './InterviewLanding'

export const metadata: Metadata = {
  title: 'Interview Prep - CSS & JavaScript Questions',
  description:
    'Prepare for frontend interviews with curated CSS and JavaScript questions organized by topic and difficulty.',
  openGraph: {
    title: 'Interview Prep - CSS & JavaScript Questions',
    description:
      'Prepare for frontend interviews with curated questions organized by topic and difficulty.',
    url: 'https://jsinterview.dev/interview',
  },
  alternates: {
    canonical: '/interview',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview' },
])

export default function InterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <InterviewLanding />
    </>
  )
}
