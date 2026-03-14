import { ImageResponse } from 'next/og'
import { quizzes, getQuizById } from '@/data/quizzes'

export const alt = 'Quiz'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const domainColors: Record<string, string> = {
  js: '#fbbf24',
  react: '#38bdf8',
  ts: '#3b82f6',
  dsa: '#34d399',
}

export async function generateStaticParams(): Promise<Array<{ quizId: string }>> {
  return quizzes.map(q => ({ quizId: q.id }))
}

export default async function Image({
  params,
}: {
  params: { quizId: string }
}): Promise<ImageResponse> {
  const quiz = getQuizById(params.quizId)
  const accentColor = '#8b5cf6'
  const domainColor = quiz ? (domainColors[quiz.domain] || accentColor) : accentColor

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
              color: domainColor,
              fontSize: 20,
              fontWeight: 600,
              border: `2px solid ${domainColor}`,
              borderRadius: 8,
              padding: '4px 16px',
            }}
          >
            {quiz?.domain.toUpperCase() || 'QUIZ'}
          </div>
          <div
            style={{
              color: accentColor,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Interactive Quiz
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
          {quiz?.title || 'Quiz'}
        </div>
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
          {quiz ? `${quiz.questions.length} questions · ~${quiz.estimatedTime} min` : 'Interactive Quiz'}
        </div>
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
