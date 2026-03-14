import { ImageResponse } from 'next/og'
import { reactChallenges, getReactChallengeById } from '@/data/reactChallenges'

export const alt = 'React Coding Challenge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const difficultyColors: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
}

export async function generateStaticParams(): Promise<Array<{ challengeId: string }>> {
  return reactChallenges.map((challenge) => ({ challengeId: challenge.id }))
}

export default async function Image({
  params,
}: {
  params: { challengeId: string }
}): Promise<ImageResponse> {
  const { challengeId } = params
  const challenge = getReactChallengeById(challengeId)

  const difficulty = challenge?.difficulty || 'medium'
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  const difficultyColor = difficultyColors[difficulty] || '#eab308'
  const title = challenge?.title || 'Challenge'
  const description = challenge?.shortDescription || ''
  const skills = challenge?.skills.join(' \u00b7 ') || ''
  const time = challenge ? `${challenge.estimatedTime} min` : ''

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
              color: '#61dafb',
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            React Challenge
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
          {title}
        </div>
        <div
          style={{
            color: '#a0a0b0',
            fontSize: 26,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
            marginBottom: 16,
          }}
        >
          {description}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ color: '#64748b', fontSize: 18 }}>{time}</div>
          <div style={{ color: '#64748b', fontSize: 18 }}>{skills}</div>
        </div>
        <div style={{ color: '#555', fontSize: 22 }}>jsinterview.dev</div>
      </div>
    ),
    { ...size }
  )
}
