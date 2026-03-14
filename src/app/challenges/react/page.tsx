import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { ChallengesHubClient } from './ChallengesHubClient'

export const metadata: Metadata = {
  title: 'React Coding Challenges — Build Real Components | JS Interview Prep',
  description:
    'Practice React skills with 15 hands-on coding challenges. Build counters, todo lists, modals, data tables, and more — from easy to hard difficulty.',
  keywords:
    'react challenges, react coding exercises, react practice, build react components, react interview challenges, react hooks practice',
  openGraph: {
    title: 'React Coding Challenges — Build Real Components',
    description:
      'Practice React with 15 hands-on coding challenges from easy to hard. Build real components with interactive code editors.',
    url: 'https://jsinterview.dev/challenges/react',
  },
  alternates: {
    canonical: '/challenges/react',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'React Challenges' },
])

const learningResourceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'React Coding Challenges',
  description:
    'Practice React skills with 15 hands-on coding challenges covering hooks, state management, and component patterns.',
  educationalLevel: 'Beginner to Advanced',
  teaches: 'React component development',
  learningResourceType: 'coding challenge',
  numberOfItems: 15,
  inLanguage: 'en',
  provider: {
    '@type': 'Organization',
    name: 'JS Interview Prep',
    url: 'https://jsinterview.dev',
  },
}

export default function ReactChallengesPage(): JSX.Element {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={learningResourceSchema} />
      <ChallengesHubClient />
    </>
  )
}
