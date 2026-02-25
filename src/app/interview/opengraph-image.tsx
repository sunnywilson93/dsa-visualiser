import { ImageResponse } from 'next/og'
import { htmlInterviewQuestions } from '@/data/htmlInterviewQuestions'
import { cssInterviewQuestions } from '@/data/cssInterviewQuestions'
import { jsInterviewQuestions } from '@/data/jsInterviewQuestions'
import { reactInterviewQuestions } from '@/data/reactInterviewQuestions'
import { bundlerInterviewQuestions } from '@/data/bundlerInterviewQuestions'

export const alt = 'Interview Prep - HTML, CSS, JavaScript, React & Bundler Questions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const totalQuestions = htmlInterviewQuestions.length + cssInterviewQuestions.length + jsInterviewQuestions.length + reactInterviewQuestions.length + bundlerInterviewQuestions.length

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
          {`${totalQuestions} Curated Questions`}
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
          Frontend Interview Prep
        </div>
        <div
          style={{
            color: '#94a3b8',
            fontSize: 26,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          HTML · CSS · JavaScript · React · Bundlers
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
