'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted'

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  icon: LucideIcon
  size?: IconSize | number
  variant?: IconVariant
  interactive?: boolean
  spin?: boolean
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
}

const variantStyles: Record<IconVariant, string> = {
  default: 'text-text-secondary',
  primary: 'text-brand-primary',
  secondary: 'text-brand-secondary',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-red-400',
  muted: 'text-text-muted',
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 'md', variant = 'default', interactive = false, spin = false, className, ...props }, ref) => {
    const iconSize = typeof size === 'number' ? size : sizeMap[size]

    return (
      <IconComponent
        ref={ref}
        size={iconSize}
        className={cn(
          'shrink-0',
          variantStyles[variant],
          interactive && 'transition-all duration-fast hover:scale-110',
          spin && 'animate-spin',
          className
        )}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'

// Convenience exports for common icon combinations
export const InteractiveIcon = (props: Omit<IconProps, 'interactive'>) => (
  <Icon {...props} interactive />
)
