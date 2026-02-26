'use client'

import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/utils/cn'

export type NeonBoxVariant =
  | 'stack'
  | 'heap'
  | 'output'
  | 'webapis'
  | 'taskqueue'
  | 'microtask'
  | 'custom'

interface VariantConfig {
  start: string
  end: string
}

const variantGradients: Record<Exclude<NeonBoxVariant, 'custom'>, VariantConfig> = {
  stack: {
    start: 'var(--color-orange-500)',
    end: 'var(--color-amber-400)',
  },
  heap: {
    start: 'var(--color-brand-primary)',
    end: 'var(--color-brand-secondary)',
  },
  output: {
    start: 'var(--color-emerald-500)',
    end: 'var(--color-accent-cyan)',
  },
  webapis: {
    start: 'var(--color-blue-500)',
    end: 'var(--color-sky-400)',
  },
  taskqueue: {
    start: 'var(--color-amber-500)',
    end: 'var(--color-orange-400)',
  },
  microtask: {
    start: 'var(--color-purple-500)',
    end: 'var(--color-brand-primary)',
  },
}

export interface NeonBoxProps {
  variant?: NeonBoxVariant
  title?: string
  children: ReactNode
  className?: string
  innerClassName?: string
  minHeight?: string | number
  gradientStart?: string
  gradientEnd?: string
  style?: CSSProperties
}

export function NeonBox({
  variant = 'heap',
  title,
  children,
  className,
  innerClassName,
  minHeight = 120,
  gradientStart,
  gradientEnd,
  style,
}: NeonBoxProps) {
  const colors =
    variant === 'custom'
      ? { start: gradientStart || 'var(--color-brand-primary)', end: gradientEnd || 'var(--color-brand-secondary)' }
      : variantGradients[variant]

  return (
    <div
      className={cn('relative rounded-xl p-[3px]', className)}
      style={{
        background: `linear-gradient(135deg, ${colors.start}, ${colors.end})`,
        ...style,
      }}
    >
      <div
        className={cn(
          'bg-bg-page-secondary rounded-lg px-3 py-3 pt-6',
          innerClassName
        )}
        style={{ minHeight }}
      >
        {title && (
          <div
            className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-bg-tertiary rounded-b-lg text-sm font-semibold text-text-bright whitespace-nowrap z-10"
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
