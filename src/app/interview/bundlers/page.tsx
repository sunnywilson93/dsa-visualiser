import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import BundlersInterviewClient from './BundlersInterviewClient'

export const metadata: Metadata = {
  title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
  description:
    'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown. Organized by bundler and difficulty.',
  keywords:
    'bundler interview questions, webpack interview, vite interview, rollup interview, esbuild interview, parcel interview, turbopack interview, rspack interview, frontend interview, build tools interview',
  openGraph: {
    title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
    description:
      'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown.',
    url: 'https://jsinterview.dev/interview/bundlers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
    description:
      'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown.',
  },
  alternates: {
    canonical: '/interview/bundlers',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'Bundlers' },
])

export default function BundlersInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <BundlersInterviewClient />
    </>
  )
}
