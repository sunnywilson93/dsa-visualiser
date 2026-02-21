import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import HTMLInterviewClient from './HTMLInterviewClient'

export const metadata: Metadata = {
  title: 'HTML Interview Questions - 100 Questions by Topic & Difficulty',
  description:
    'Master HTML interviews with 100 curated questions covering document structure, semantic elements, accessibility, ARIA, forms, media, Web Components, and modern HTML APIs. Organized by topic and difficulty.',
  keywords:
    'HTML interview questions, HTML interview prep, semantic HTML, accessibility interview, ARIA interview, HTML forms, Web Components, frontend interview, HTML5 interview, web developer interview',
  openGraph: {
    title: 'HTML Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master HTML interviews with 100 curated questions covering fundamentals, semantics, accessibility, forms, and modern APIs.',
    url: 'https://jsinterview.dev/interview/html',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML Interview Questions - 100 Questions by Topic & Difficulty',
    description:
      'Master HTML interviews with 100 curated questions covering fundamentals, semantics, accessibility, forms, and modern APIs.',
  },
  alternates: {
    canonical: '/interview/html',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'HTML' },
])

export default function HTMLInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <HTMLInterviewClient />
    </>
  )
}
