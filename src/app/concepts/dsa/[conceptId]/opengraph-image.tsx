import { ImageResponse } from 'next/og'
import { dsaConcepts, getDSAConceptById } from '@/data/dsaConcepts'

export const alt = 'DSA Concept'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const difficultyColors: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
}

export async function generateStaticParams(): Promise<Array<{ conceptId: string }>> {
  return dsaConcepts.map((concept) => ({ conceptId: concept.id }))
}

export default async function Image({
  params,
}: {
  params: { conceptId: string }
}) {
  const { conceptId } = params
  const concept = getDSAConceptById(conceptId)

  const difficulty = concept?.difficulty || 'intermediate'
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  const difficultyColor = difficultyColors[difficulty] || '#eab308'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: difficultyColor,
              fontSize: 20,
              fontWeight: 600,
              border: `2px solid ${difficultyColor}`,
              borderRadius: 8,
              padding: '4px 16px',
            }}
          >
            {difficultyLabel}
          </div>
          <div
            style={{
              color: '#a855f7',
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            DSA Concept
          </div>
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          {concept?.title || 'Concept'}
        </div>
        {concept?.shortDescription && (
          <div
            style={{
              color: '#a0a0b0',
              fontSize: 26,
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
              marginBottom: 24,
            }}
          >
            {concept.shortDescription}
          </div>
        )}
        <div
          style={{
            color: '#555',
            fontSize: 22,
          }}
        >
          jsinterview.dev
        </div>
      </div>
    ),
    { ...size }
  )
}
