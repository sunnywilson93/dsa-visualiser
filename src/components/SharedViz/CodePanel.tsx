'use client'

import { useRef, useEffect } from 'react'

export interface CodePanelProps {
  code: string[]
  highlightedLine?: number
  showLineNumbers?: boolean
  maxHeight?: string
  title?: string
  rightElement?: React.ReactNode
}

export function CodePanel({
  code,
  highlightedLine,
  showLineNumbers = true,
  maxHeight = '160px',
  title = 'Code',
  rightElement,
}: CodePanelProps) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (
      highlightedLine !== undefined &&
      highlightedLine >= 0 &&
      lineRefs.current[highlightedLine]
    ) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [highlightedLine])

  return (
    <div className="bg-bg-page-secondary border border-border-card rounded-lg shadow-lg overflow-hidden">
      {(title || rightElement) && (
        <div className="flex justify-between items-center px-3 py-2 bg-surface-card">
          {title ? (
            <span className="inline-flex items-center gap-[3px] px-1.5 py-[3px] text-2xs font-semibold uppercase tracking-[0.08em] text-text-primary bg-brand-primary-10 border border-brand-primary-30 rounded-full">
              {title}
            </span>
          ) : <span />}
          {rightElement}
        </div>
      )}
      <pre className="m-0 py-2 overflow-y-auto" style={{ maxHeight }}>
        {code.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            className={`flex px-2 py-[2px] transition-colors duration-150 ${
              highlightedLine === i ? 'bg-brand-primary-20' : ''
            }`}
          >
            {showLineNumbers && (
              <span className="w-6 text-text-muted font-mono text-2xs text-right select-none mr-2">
                {i + 1}
              </span>
            )}
            <span
              className={`font-mono text-2xs ${
                highlightedLine === i ? 'text-brand-light' : 'text-text-secondary'
              }`}
            >
              {line || ' '}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}
