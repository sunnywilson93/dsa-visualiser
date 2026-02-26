'use client'

import { forwardRef, ReactNode, CSSProperties } from 'react'
import { cn } from '@/utils/cn'

export interface CodePanelProps {
  title?: string
  badge?: ReactNode
  badgeColor?: string
  children: ReactNode
  className?: string
  maxHeight?: string | number
}

export function CodePanel({
  title = 'Code',
  badge,
  badgeColor,
  children,
  className,
  maxHeight = 200,
}: CodePanelProps) {
  return (
    <div
      className={cn(
        'bg-black/40 border border-white/8 rounded-xl overflow-hidden',
        className
      )}
    >
      <div className="flex justify-between items-center px-3 py-2 text-sm font-medium text-text-muted bg-white/5">
        <span>{title}</span>
        {badge && (
          <span
            className="px-2 py-0.5 rounded-full text-2xs font-semibold text-black"
            style={{ background: badgeColor }}
          >
            {badge}
          </span>
        )}
      </div>
      <pre
        className="m-0 py-2 overflow-y-auto"
        style={{ maxHeight }}
      >
        {children}
      </pre>
    </div>
  )
}

export interface CodeLineProps {
  lineNumber: number
  isActive?: boolean
  children: ReactNode
  className?: string
}

export const CodeLine = forwardRef<HTMLDivElement, CodeLineProps>(
  ({ lineNumber, isActive, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex px-2 py-px transition-colors duration-200',
          isActive && 'bg-brand-primary/20',
          className
        )}
      >
        <span className="w-6 shrink-0 text-text-muted font-mono text-2xs select-none">
          {lineNumber}
        </span>
        <span
          className={cn(
            'font-mono text-xs text-text-secondary',
            isActive && 'text-brand-light'
          )}
        >
          {children}
        </span>
      </div>
    )
  }
)

CodeLine.displayName = 'CodeLine'
