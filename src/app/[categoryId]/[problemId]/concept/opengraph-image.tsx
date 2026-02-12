import { ImageResponse } from 'next/og'
import { codeExamples } from '@/data/examples'
import { problemConcepts } from '@/data/algorithmConcepts'

export const alt = 'Algorithm Concept Visualization'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ categoryId: string; problemId: string }>
}) {
  const { problemId } = await params
  const problem = codeExamples.find((p) => p.id === problemId)
  const concept = problemConcepts[problemId]

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
            color: '#a855f7',
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          Algorithm Concept
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 56,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {problem?.name || 'Algorithm'}
        </div>
        {concept && (
          <div
            style={{
              color: '#a78bfa',
              fontSize: 24,
              marginTop: 16,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            {concept.title}
          </div>
        )}
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
