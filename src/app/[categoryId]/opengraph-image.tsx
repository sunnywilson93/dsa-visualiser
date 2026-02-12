import { ImageResponse } from 'next/og'
import { exampleCategories, dsaSubcategories, getExamplesByCategory } from '@/data/examples'

export const alt = 'JavaScript Practice Problems'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const category = exampleCategories.find((c) => c.id === categoryId)
    || dsaSubcategories.find((s) => s.id === categoryId)
  const problemCount = getExamplesByCategory(categoryId).length

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
          {problemCount} Coding Problems
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
          {category?.name || 'Practice Problems'}
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
