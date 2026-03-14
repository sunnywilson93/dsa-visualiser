import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Quizzes - Test Your Frontend Knowledge | JS Interview Prep',
  description: 'Test your JavaScript, React, TypeScript, and DSA knowledge with interactive quizzes. Instant feedback, detailed explanations, and score tracking.',
  keywords: 'javascript quiz, react quiz, typescript quiz, coding quiz, frontend interview quiz, big o quiz, promise quiz',
  openGraph: {
    title: 'Interactive Quizzes - Test Your Frontend Knowledge',
    description: 'Test your JavaScript, React, TypeScript, and DSA knowledge with interactive quizzes.',
    url: 'https://jsinterview.dev/quiz',
  },
  alternates: {
    canonical: '/quiz',
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
