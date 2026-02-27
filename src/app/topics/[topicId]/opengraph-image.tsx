import { ImageResponse } from 'next/og'
import { topicHubs, getTopicHub } from '@/data/topicHubs'

export const alt = 'Topic Guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams(): Promise<Array<{ topicId: string }>> {
  return topicHubs.map((hub) => ({ topicId: hub.id }))
}

export default async function Image({
  params,
}: {
  params: { topicId: string }
}) {
  const hub = getTopicHub(params.topicId)
  const conceptCount = hub ? hub.relatedConceptIds.length + 1 : 0
  const problemCount = hub ? hub.relatedProblemIds.length : 0

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
          Complete Visual Guide
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
          {hub?.name || 'Topic'}
        </div>
        <div
          style={{
            color: '#888',
            fontSize: 24,
            marginTop: 24,
            display: 'flex',
          }}
        >
          {`${conceptCount} Concepts · ${problemCount} Problems · JS Interview Prep`}
        </div>
      </div>
    ),
    { ...size }
  )
}
