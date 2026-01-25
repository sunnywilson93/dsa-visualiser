import Link from 'next/link'
import styles from './SiteFooter.module.css'

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
      { label: 'Closures', href: '/concepts/closures' },
      { label: 'Promises', href: '/concepts/promises-deep-dive' },
      { label: 'DSA Problems', href: '/concepts/dsa' },
    ],
  },
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {Object.entries(footerLinks).map(([key, category]) => (
            <div key={key} className={styles.column}>
              <h3 className={styles.columnTitle}>{category.title}</h3>
              <ul className={styles.linkList}>
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={styles.bottom}>
          <p className={styles.tagline}>
            JS Interview Prep - Master JavaScript with Interactive Visualization
          </p>
        </div>
      </div>
    </footer>
  )
}
