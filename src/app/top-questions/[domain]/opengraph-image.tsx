import { ImageResponse } from 'next/og'
import { concepts } from '@/data/concepts'
import { reactConcepts } from '@/data/reactConcepts'
import { dsaConcepts } from '@/data/dsaConcepts'

export const alt = 'Top Interview Questions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface DomainOGConfig {
  title: string
  subtitle: string
  questionCount: number
  accentColor: string
}

function getDomainConfig(domain: string): DomainOGConfig {
  switch (domain) {
    case 'javascript': {
      let count = 0
      for (const c of concepts) {
        count += c.commonQuestions?.length ?? 0
      }
      return {
        title: 'Top JavaScript Interview Questions',
        subtitle: 'Most asked questions with detailed answers',
        questionCount: count,
        accentColor: '#eab308',
      }
    }
    case 'react':
      return {
        title: 'Top React Interview Questions',
        subtitle: 'Hooks, rendering, patterns & performance',
        questionCount: reactConcepts.length * 2,
        accentColor: '#38bdf8',
      }
    case 'dsa':
      return {
        title: 'Top DSA Questions',
        subtitle: 'Data structures & algorithms for frontend',
        questionCount: dsaConcepts.length * 2,
        accentColor: '#34d399',
      }
    default:
      return {
        title: 'Top Interview Questions',
        subtitle: 'Prepare for your next interview',
        questionCount: 0,
        accentColor: '#6366f1',
      }
  }
}

const validDomains = ['javascript', 'react', 'dsa'] as const

export async function generateStaticParams(): Promise<Array<{ domain: string }>> {
  return validDomains.map((domain) => ({ domain }))
}

export default async function Image({
  params,
}: {
  params: { domain: string }
}) {
  const { domain } = params
  const config = getDomainConfig(domain)

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
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: config.accentColor,
              fontSize: 22,
              fontWeight: 600,
              border: `2px solid ${config.accentColor}`,
              borderRadius: 8,
              padding: '6px 20px',
            }}
          >
            {config.questionCount}+ Questions
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: 'white',
            fontSize: 56,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          {config.title}
        </div>
        <div
          style={{
            display: 'flex',
            color: '#a0a0b0',
            fontSize: 24,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 32,
          }}
        >
          {config.subtitle}
        </div>
        <div
          style={{
            display: 'flex',
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
