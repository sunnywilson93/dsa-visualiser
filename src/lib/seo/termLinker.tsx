import type { ReactNode } from 'react'

interface TermMapping {
  terms: string[]
  url: string
  label: string
}

const TERM_MAPPINGS: TermMapping[] = [
  // DSA Patterns (more specific first to avoid partial matches)
  { terms: ['two pointers', 'two-pointer', 'two pointer'], url: '/concepts/dsa/patterns/two-pointers', label: 'Two Pointers pattern' },
  { terms: ['binary search'], url: '/concepts/dsa/patterns/binary-search', label: 'Binary Search pattern' },
  { terms: ['bit manipulation', 'bitwise'], url: '/concepts/dsa/patterns/bit-manipulation', label: 'Bit Manipulation pattern' },
  // DSA Concepts (longer phrases first)
  { terms: ['hash map', 'hash table', 'hash maps', 'hash tables', 'hashmap'], url: '/concepts/dsa/hash-tables', label: 'Hash Tables concept' },
  { terms: ['linked list', 'linked lists'], url: '/concepts/dsa/linked-lists', label: 'Linked Lists concept' },
  { terms: ['priority queue', 'min-heap', 'max-heap', 'min heap', 'max heap'], url: '/concepts/dsa/heap', label: 'Heap concept' },
  { terms: ['binary tree', 'binary trees'], url: '/concepts/dsa/trees', label: 'Trees concept' },
  { terms: ['recursion', 'recursive'], url: '/concepts/dsa/recursion', label: 'Recursion concept' },
  { terms: ['backtracking'], url: '/concepts/dsa/backtracking', label: 'Backtracking concept' },
  { terms: ['stack', 'stacks'], url: '/concepts/dsa/stacks', label: 'Stacks concept' },
  { terms: ['queue', 'queues'], url: '/concepts/dsa/queues', label: 'Queues concept' },
  { terms: ['trie', 'prefix tree'], url: '/concepts/dsa/trie', label: 'Trie concept' },
  { terms: ['graph', 'graphs'], url: '/concepts/dsa/graphs', label: 'Graphs concept' },
]

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Replace the first occurrence of each known technical term in text
 * with a React anchor element linking to the concept/pattern page.
 * Only links the first match per mapping to avoid over-linking.
 */
export function linkTerms(text: string): ReactNode[] {
  const linkedUrls = new Set<string>()
  let segments: { text: string; linked: boolean; url?: string }[] = [
    { text, linked: false },
  ]

  for (const mapping of TERM_MAPPINGS) {
    if (linkedUrls.has(mapping.url)) continue

    const pattern = new RegExp(
      `\\b(${mapping.terms.map(escapeRegex).join('|')})\\b`,
      'i',
    )

    let matched = false
    const nextSegments: typeof segments = []

    for (const segment of segments) {
      if (segment.linked || matched) {
        nextSegments.push(segment)
        continue
      }

      const match = segment.text.match(pattern)
      if (!match || match.index === undefined) {
        nextSegments.push(segment)
        continue
      }

      matched = true
      linkedUrls.add(mapping.url)

      const before = segment.text.slice(0, match.index)
      const term = match[0]
      const after = segment.text.slice(match.index + term.length)

      if (before) nextSegments.push({ text: before, linked: false })
      nextSegments.push({ text: term, linked: true, url: mapping.url })
      if (after) nextSegments.push({ text: after, linked: false })
    }

    segments = nextSegments
  }

  return segments.map((seg, i) =>
    seg.linked && seg.url ? (
      <a key={i} href={seg.url}>
        {seg.text}
      </a>
    ) : (
      seg.text
    ),
  )
}
