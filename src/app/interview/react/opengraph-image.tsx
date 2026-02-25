import { ImageResponse } from 'next/og'
import { reactInterviewQuestions } from '@/data/reactInterviewQuestions'

export const alt = 'React Interview Questions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const questionCount = reactInterviewQuestions.length

export default async function Image() {
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
          {`${questionCount} Curated Questions`}
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
          React Interview Questions
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
    { ...size },
  )
}
