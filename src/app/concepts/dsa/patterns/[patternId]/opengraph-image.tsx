import { ImageResponse } from 'next/og'
import { getPatternBySlug } from '@/data/dsaPatterns'

export const alt = 'DSA Pattern Visualization'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ patternId: string }>
}) {
  const { patternId } = await params
  const pattern = getPatternBySlug(patternId)

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
            color: '#667eea',
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          DSA Pattern
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 72,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          {pattern?.name || 'Algorithm Pattern'}
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
