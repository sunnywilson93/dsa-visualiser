import { ImageResponse } from 'next/og'
import { reactConcepts, getReactConceptById } from '@/data/reactConcepts'

export const alt = 'React Concept'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams(): Promise<Array<{ conceptId: string }>> {
  return reactConcepts.map((concept) => ({ conceptId: concept.id }))
}

export default async function Image({
  params,
}: {
  params: { conceptId: string }
}) {
  const { conceptId } = params
  const concept = getReactConceptById(conceptId)

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
            color: '#61dafb',
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          React Concept
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {concept?.title || 'Concept'}
        </div>
        <div
          style={{
            color: '#888',
            fontSize: 24,
            marginTop: 24,
          }}
        >
          JS Interview Prep
        </div>
      </div>
    ),
    { ...size }
  )
}
