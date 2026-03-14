import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { QuizHubClient } from './QuizHubClient'

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Quizzes' },
])

const learningResourceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Frontend Interview Quizzes',
  description: 'Interactive quizzes covering JavaScript, React, TypeScript, and Data Structures & Algorithms for frontend interview preparation.',
  educationalLevel: 'intermediate',
  learningResourceType: 'quiz',
  inLanguage: 'en',
  provider: {
    '@type': 'Organization',
    name: 'JS Interview Prep',
    url: 'https://jsinterview.dev',
  },
}

export default function QuizPage(): React.ReactElement {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={learningResourceSchema} />
      <QuizHubClient />
    </>
  )
}
