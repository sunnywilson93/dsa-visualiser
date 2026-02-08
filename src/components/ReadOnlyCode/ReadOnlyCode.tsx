'use client'

interface ReadOnlyCodeProps {
  code: string
  className?: string
}

export function ReadOnlyCode({ code, className }: ReadOnlyCodeProps) {
  return (
    <div className={`flex flex-col h-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border-primary)] flex-shrink-0">
        <span className="text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.5px] text-[color:var(--color-text-secondary)]">Code</span>
        <span className="text-[length:var(--text-xs)] font-medium px-[6px] py-[2px] rounded-[var(--radius-sm)] bg-[var(--color-bg-elevated)] text-[color:var(--color-text-muted)] uppercase tracking-[0.3px]">Read Only</span>
      </div>
      <pre className="flex-1 m-0 p-[var(--spacing-md)] font-mono text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[color:var(--color-text-primary)] overflow-auto whitespace-pre [-webkit-overflow-scrolling:touch]">
        <code className="block">{code}</code>
      </pre>
    </div>
  )
}
