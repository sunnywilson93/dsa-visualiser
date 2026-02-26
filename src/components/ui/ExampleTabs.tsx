'use client'

import { cn } from '@/utils/cn'

export interface ExampleTab {
  id: string
  title: string
}

export interface ExampleTabsProps {
  tabs: ExampleTab[]
  activeIndex: number
  onChange: (index: number) => void
  variant?: 'default' | 'mono'
  className?: string
}

export function ExampleTabs({
  tabs,
  activeIndex,
  onChange,
  variant = 'default',
  className,
}: ExampleTabsProps) {
  return (
    <div
      className={cn(
        'flex gap-2 flex-wrap justify-center bg-black/30 border border-white/8 rounded-full p-[var(--spacing-pill)]',
        className
      )}
    >
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              'min-h-[44px] px-3 py-1.5 text-sm rounded-full transition-all border touch-manipulation',
              variant === 'mono' && 'font-mono',
              isActive
                ? 'bg-[var(--color-neon-viz-18)] border-[var(--color-neon-viz-70)] text-white shadow-[0_0_20px_var(--color-neon-viz-25)]'
                : 'border-white/8 bg-white/5 text-text-muted hover:bg-white/8 hover:text-text-secondary'
            )}
          >
            {tab.title}
          </button>
        )
      })}
    </div>
  )
}
