export interface ChangelogEntry {
  date: string
  title: string
  type: 'added' | 'updated' | 'improved'
  links: { label: string; href: string }[]
}

export const changelog: ChangelogEntry[] = [
  {
    date: '2026-02-28',
    title: 'Added 15 topic hub pages for comprehensive learning paths',
    type: 'added',
    links: [
      { label: 'JavaScript Closures Guide', href: '/topics/closures' },
      { label: 'Event Loop Deep Dive', href: '/topics/event-loop' },
      { label: 'Promises & Async/Await', href: '/topics/promises' },
    ],
  },
  {
    date: '2026-02-28',
    title: 'Improved SEO with long-tail keyword targeting and cross-links',
    type: 'improved',
    links: [
      { label: 'All JavaScript Concepts', href: '/concepts/js' },
      { label: 'All DSA Concepts', href: '/concepts/dsa' },
    ],
  },
  {
    date: '2026-02-22',
    title: 'Launched jsinterview.dev with 88 JS concepts, 14 DSA concepts, and 275+ practice problems',
    type: 'added',
    links: [
      { label: 'Browse All Concepts', href: '/concepts' },
      { label: 'Practice Problems', href: '/js-problems' },
      { label: 'Interview Prep', href: '/interview' },
    ],
  },
]
