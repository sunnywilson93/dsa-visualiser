import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JavaScript Concepts - Interactive Visualizations | JS Interview Prep',
  description: 'Master JavaScript concepts with interactive visualizations. Learn closures, hoisting, the event loop, prototypes, the this keyword, and more with step-by-step animations.',
  keywords: 'javascript concepts, closures explained, event loop visualization, hoisting javascript, this keyword, prototypes, scope chain, call stack, async javascript',
  openGraph: {
    title: 'JavaScript Concepts - Interactive Visualizations',
    description: 'Master JavaScript concepts with interactive visualizations. Learn closures, hoisting, event loop, and more.',
    url: 'https://jsinterview.dev/concepts',
  },
  alternates: {
    canonical: '/concepts',
  },
}

export default function ConceptsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
