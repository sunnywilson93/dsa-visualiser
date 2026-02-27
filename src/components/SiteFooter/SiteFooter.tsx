import Link from 'next/link'

const footerLinks = {
  concepts: {
    title: 'Concepts',
    links: [
      { label: 'JavaScript Deep Dive', href: '/concepts/js' },
      { label: 'DSA Fundamentals', href: '/concepts/dsa' },
      { label: 'All Concepts', href: '/concepts' },
    ],
  },
  patterns: {
    title: 'Patterns',
    links: [
      { label: 'Two Pointers', href: '/concepts/dsa/patterns/two-pointers' },
      { label: 'Hash Map', href: '/concepts/dsa/patterns/hash-map' },
      { label: 'Bit Manipulation', href: '/concepts/dsa/patterns/bit-manipulation' },
    ],
  },
  practice: {
    title: 'Practice',
    links: [
      { label: 'Arrays & Hashing', href: '/arrays-hashing' },
      { label: 'Closures', href: '/concepts/js/closures' },
      { label: 'Promises', href: '/concepts/js/promises-deep-dive' },
      { label: 'DSA Problems', href: '/concepts/dsa' },
    ],
  },
}

export function SiteFooter() {
  return (
    <footer className="bg-black-30 py-8 px-0 mt-auto">
      <div className="max-w-[1400px] mx-auto py-0 px-8">
        <nav className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6 max-md:px-0">
          {Object.entries(footerLinks).map(([key, category]) => (
            <div key={key} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
                {category.title}
              </h3>
              <ul className="list-none flex flex-col gap-2">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary no-underline transition-colors duration-150 hover:text-brand-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-8 pt-4 text-center">
          <p className="text-xs text-text-muted">
            JS Interview Prep - Master JavaScript with Interactive Visualization
          </p>
        </div>
      </div>
    </footer>
  )
}
