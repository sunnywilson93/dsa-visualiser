import { ImageResponse } from 'next/og'
import { codeExamples, exampleCategories, dsaSubcategories, isDsaSubcategory, getProblemRouteCategoryIds } from '@/data/examples'

export const alt = 'JavaScript Coding Problem'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const difficultyColors: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
}

export async function generateStaticParams(): Promise<Array<{ categoryId: string; problemId: string }>> {
  const routeParams: Array<{ categoryId: string; problemId: string }> = []
  codeExamples.forEach((problem) => {
    getProblemRouteCategoryIds(problem).forEach((categoryId) => {
      routeParams.push({ categoryId, problemId: problem.id })
    })
  })
  return routeParams
}

export default async function Image({
  params,
}: {
  params: { categoryId: string; problemId: string }
}) {
  const { categoryId, problemId } = params
  const problem = codeExamples.find((p) => p.id === problemId)
  const category = exampleCategories.find(
    (c) => c.id === categoryId ||
    (c.id === 'dsa' && isDsaSubcategory(categoryId))
  )

  const difficulty = problem?.difficulty || 'medium'
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)

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
            marginBottom: 16,
          }}
        >
          <div
            style={{
              color: difficultyColors[difficulty] || '#eab308',
              fontSize: 22,
              fontWeight: 600,
              border: `2px solid ${difficultyColors[difficulty] || '#eab308'}`,
              borderRadius: 8,
              padding: '4px 16px',
            }}
          >
            {difficultyLabel}
          </div>
          <div
            style={{
              color: '#a855f7',
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            {category?.name || 'Practice'}
          </div>
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
          {problem?.name || 'Coding Problem'}
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
