'use client'

import { cn } from '@/utils/cn'

export interface VariantConfig {
  label: string
  description?: string
}

export interface VariantSelectorProps<T extends string> {
  value: T
  onChange: (variant: T) => void
  variants: T[]
  config: Record<T, VariantConfig>
  accentColor?: string
  className?: string
}

export function VariantSelector<T extends string>({
  value,
  onChange,
  variants,
  config,
  accentColor = 'var(--color-emerald-500)',
  className,
}: VariantSelectorProps<T>) {
  return (
    <div
      className={cn(
        'flex gap-2 flex-wrap justify-center bg-black/30 border border-white/8 rounded-full p-[var(--spacing-pill)]',
        className
      )}
    >
      {variants.map((variant) => {
        const { label, description } = config[variant]
        const isActive = value === variant

        return (
          <button
            key={variant}
            type="button"
            onClick={() => onChange(variant)}
            title={description}
            className={cn(
              'min-h-[44px] px-4 py-2 font-mono text-sm font-medium rounded-full transition-all border-2 touch-manipulation',
              isActive
                ? 'text-white'
                : 'border-transparent bg-white/5 text-gray-500 hover:bg-white/8 hover:text-gray-300'
            )}
            style={
              isActive
                ? {
                    borderColor: `color-mix(in srgb, ${accentColor} 50%, transparent)`,
                    background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                  }
                : undefined
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
