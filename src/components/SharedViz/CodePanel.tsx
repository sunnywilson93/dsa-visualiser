'use client'

import { useRef, useEffect } from 'react'
import styles from './CodePanel.module.css'

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
    <div className={styles.codePanel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{title}</span>
        {rightElement}
      </div>
      <pre className={styles.code} style={{ maxHeight }}>
        {code.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            className={`${styles.codeLine} ${highlightedLine === i ? styles.activeLine : ''}`}
          >
            {showLineNumbers && (
              <span className={styles.lineNum}>{i + 1}</span>
            )}
            <span className={styles.lineCode}>{line || ' '}</span>
          </div>
        ))}
      </pre>
    </div>
  )
}
