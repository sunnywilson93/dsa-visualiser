import type { Metadata } from 'next'
import Link from 'next/link'
import { changelog } from '@/data/changelog'
import { StructuredData } from '@/components/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'

export const metadata: Metadata = {
  title: 'Updates & Changelog | JS Interview Prep',
  description: 'Latest updates, new features, and improvements to JS Interview Prep — interactive JavaScript visualizations and practice problems.',
  alternates: {
    canonical: '/updates',
  },
}

const typeLabels: Record<string, string> = {
  added: 'New',
  updated: 'Updated',
  improved: 'Improved',
}

const typeColors: Record<string, string> = {
  added: 'text-[color:var(--color-difficulty-easy)] bg-[var(--difficulty-easy-bg)]',
  updated: 'text-[color:var(--color-accent-blue)] bg-[var(--color-accent-blue-10)]',
  improved: 'text-[color:var(--color-difficulty-medium)] bg-[var(--difficulty-medium-bg)]',
}

export default function UpdatesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Updates' },
  ])

  return (
    <>
      <StructuredData data={breadcrumbSchema} />

      <main className="max-w-[900px] mx-auto px-[var(--spacing-lg)] py-[var(--spacing-2xl)]">
        <h1 className="text-[length:var(--text-4xl)] font-bold text-text-bright mb-[var(--spacing-lg)]">
          Updates & Changelog
        </h1>
        <p className="text-[length:var(--text-base)] text-[color:var(--color-text-muted)] mb-[var(--spacing-2xl)] leading-[var(--leading-normal)]">
          Latest changes and improvements to JS Interview Prep.
        </p>

        <div className="space-y-[var(--spacing-xl)]">
          {changelog.map((entry, i) => (
            <article
              key={i}
              className="p-[var(--spacing-lg)] rounded-[var(--radius-xl)] border border-[var(--color-border-card)] bg-[var(--color-surface-card)]"
            >
              <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
                <time
                  dateTime={entry.date}
                  className="text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]"
                >
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className={`text-[length:var(--text-xs)] font-medium px-[var(--spacing-sm)] py-[var(--spacing-0.5)] rounded-[var(--radius-sm)] ${typeColors[entry.type]}`}>
                  {typeLabels[entry.type]}
                </span>
              </div>

              <h2 className="text-[length:var(--text-base)] font-semibold text-text-bright mb-[var(--spacing-md)]">
                {entry.title}
              </h2>

              {entry.links.length > 0 && (
                <div className="flex flex-wrap gap-[var(--spacing-sm)]">
                  {entry.links.map((link, j) => (
                    <Link
                      key={j}
                      href={link.href}
                      className="text-[length:var(--text-sm)] text-[color:var(--color-brand-primary)] no-underline hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
