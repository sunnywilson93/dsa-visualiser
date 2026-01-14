import type { Metadata } from 'next'
import { getConceptById, concepts } from '@/data/concepts'
import ConceptPageClient from './ConceptPageClient'

interface Props {
  params: { conceptId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getConceptById(params.conceptId)

  if (!concept) {
    return {
      title: 'Concept Not Found | JS Interview Prep',
    }
  }

  return {
    title: `${concept.title} - JavaScript Concept Explained | JS Interview Prep`,
    description: `${concept.description} Learn with interactive visualizations, code examples, and interview tips.`,
    keywords: `${concept.title.toLowerCase()}, javascript ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, javascript interview, frontend interview`,
    openGraph: {
      title: `${concept.title} - JavaScript Concept Explained`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/${concept.id}`,
    },
  }
}

export async function generateStaticParams() {
  return concepts.map((concept) => ({
    conceptId: concept.id,
  }))
}

export default function ConceptPage() {
  return <ConceptPageClient />
}
