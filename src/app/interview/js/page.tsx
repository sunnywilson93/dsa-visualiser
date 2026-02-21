import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import JSInterviewClient from './JSInterviewClient'

export const metadata: Metadata = {
  title: 'JavaScript Interview Questions - 100 Questions by Topic & Difficulty',
  description:
    'Master JavaScript interviews with 100 curated questions covering closures, prototypes, async/await, event loop, ES6+ features, and modern patterns. Organized by topic and difficulty.',
  keywords:
    'JavaScript interview questions, JavaScript interview prep, closures interview, prototypes interview, async await interview, event loop interview, ES6 interview, frontend interview, web developer interview',
  openGraph: {
    title: 'JavaScript Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master JavaScript interviews with 100 curated questions covering fundamentals, functions, async patterns, and modern JS.',
    url: 'https://jsinterview.dev/interview/js',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JavaScript Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master JavaScript interviews with 100 curated questions covering fundamentals, functions, async patterns, and modern JS.',
  },
  alternates: {
    canonical: '/interview/js',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'JavaScript' },
])

export default function JSInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <JSInterviewClient />
    </>
  )
}
