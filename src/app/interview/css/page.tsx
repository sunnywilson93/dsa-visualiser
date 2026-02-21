import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import CSSInterviewClient from './CSSInterviewClient'

export const metadata: Metadata = {
  title: 'CSS Interview Questions - 105 Questions by Topic & Difficulty',
  description:
    'Master CSS interviews with 105 curated questions covering box model, flexbox, grid, specificity, animations, performance, and modern CSS features. Organized by topic and difficulty.',
  keywords:
    'CSS interview questions, CSS interview prep, flexbox interview, grid interview, CSS specificity, CSS animations, CSS performance, frontend interview, web developer interview',
  openGraph: {
    title: 'CSS Interview Questions - 105 Questions by Topic & Difficulty',
    description:
      'Master CSS interviews with 105 curated questions covering fundamentals, layout, modern CSS, and architecture.',
    url: 'https://jsinterview.dev/interview/css',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Interview Questions - 105 Questions by Topic & Difficulty',
    description:
      'Master CSS interviews with 105 curated questions covering fundamentals, layout, modern CSS, and architecture.',
  },
  alternates: {
    canonical: '/interview/css',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'CSS' },
])

export default function CSSInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <CSSInterviewClient />
    </>
  )
}
