'use client'

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './CodeBlock.module.css'

export interface CodeBlockProps {
  code: string
  className?: string
}

const SYNTAX_REGEX =
  /(\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|\/\/[^\n]*)|("[^"]*"|'[^']*')|(<!DOCTYPE\s+\w+)|(<\/?[\w-]+)|(\/>|>)|(\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|true|false|null|undefined|type|interface)\b)|(\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr)?\b)/g

function highlightSyntax(code: string): ReactNode[] {
  const result: ReactNode[] = []
  const regex = new RegExp(SYNTAX_REGEX.source, 'g')
  let lastIndex = 0
  let key = 0

  for (;;) {
    const match = regex.exec(code)
    if (!match) break

    if (match.index > lastIndex) {
      result.push(code.slice(lastIndex, match.index))
    }

    let className: string
    if (match[1]) className = styles.syntaxComment
    else if (match[2]) className = styles.syntaxString
    else if (match[3]) className = styles.syntaxKeyword
    else if (match[4]) className = styles.syntaxTag
    else if (match[5]) className = styles.syntaxTag
    else if (match[6]) className = styles.syntaxKeyword
    else if (match[7]) className = styles.syntaxNumber
    else className = ''

    result.push(
      <span key={key++} className={className}>
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < code.length) {
    result.push(code.slice(lastIndex))
  }

  return result
}

export function CodeBlock({ code, className }: CodeBlockProps): JSX.Element {
  return (
    <pre className={cn(styles.codeBlock, className)}>
      {highlightSyntax(code)}
    </pre>
  )
}
