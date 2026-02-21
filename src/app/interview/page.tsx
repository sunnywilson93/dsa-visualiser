import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import InterviewLanding from './InterviewLanding'

export const metadata: Metadata = {
  title: 'Interview Prep - HTML, CSS & JavaScript Questions',
  description:
    'Prepare for frontend interviews with 200+ curated HTML, CSS, and JavaScript questions organized by topic and difficulty. Covers semantics, accessibility, box model, flexbox, grid, and modern APIs.',
  keywords:
    'frontend interview questions, HTML interview, CSS interview, JavaScript interview, web developer interview prep, interview questions by topic, interview questions by difficulty',
  openGraph: {
    title: 'Interview Prep - HTML, CSS & JavaScript Questions',
    description:
      'Prepare for frontend interviews with 200+ curated questions organized by topic and difficulty.',
    url: 'https://jsinterview.dev/interview',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interview Prep - HTML, CSS & JavaScript Questions',
    description:
      'Prepare for frontend interviews with 200+ curated questions organized by topic and difficulty.',
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
