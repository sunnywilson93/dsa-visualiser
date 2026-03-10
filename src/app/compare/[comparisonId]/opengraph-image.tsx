import { ImageResponse } from 'next/og'
import { comparisons, getComparison } from '@/data/comparisons'

export const alt = 'Comparison'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams(): Promise<Array<{ comparisonId: string }>> {
  return comparisons.map((c) => ({ comparisonId: c.id }))
}

export default async function Image({
  params,
}: {
  params: { comparisonId: string }
}) {
  const { comparisonId } = params
  const comparison = getComparison(comparisonId)

  const domainLabel = comparison?.domain === 'js'
    ? 'JavaScript'
    : comparison?.domain === 'react'
      ? 'React'
      : 'DSA'

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
              color: '#38bdf8',
              fontSize: 20,
              fontWeight: 600,
              border: '2px solid #38bdf8',
              borderRadius: 8,
              padding: '4px 16px',
            }}
          >
            Comparison
          </div>
          <div
            style={{
              color: '#a855f7',
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {domainLabel}
          </div>
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 56,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          {comparison?.title || 'Comparison'}
        </div>
        {comparison?.shortDescription && (
          <div
            style={{
              color: '#a0a0b0',
              fontSize: 24,
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
              marginBottom: 24,
            }}
          >
            {comparison.shortDescription}
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
    { ...size },
  )
}
