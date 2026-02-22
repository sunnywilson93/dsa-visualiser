import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import ReactInterviewClient from './ReactInterviewClient'

export const metadata: Metadata = {
  title: 'React Interview Questions - 100 Questions by Topic & Difficulty',
  description:
    'Master React interviews with 100 curated questions covering hooks, state management, component patterns, Server Components, React 19 APIs, and performance optimization. Organized by topic and difficulty.',
  keywords:
    'React interview questions, React interview prep, hooks interview, useState interview, useEffect interview, Server Components interview, React 19 interview, frontend interview, web developer interview',
  openGraph: {
    title: 'React Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master React interviews with 100 curated questions covering hooks, patterns, Server Components, and performance.',
    url: 'https://jsinterview.dev/interview/react',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master React interviews with 100 curated questions covering hooks, patterns, Server Components, and performance.',
  },
  alternates: {
    canonical: '/interview/react',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'React' },
])

export default function ReactInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <ReactInterviewClient />
    </>
  )
}
