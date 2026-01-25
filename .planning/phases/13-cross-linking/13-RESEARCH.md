# Phase 13: Cross-Linking - Research

**Researched:** 2026-01-25
**Domain:** Internal navigation, UI components, SEO
**Confidence:** HIGH

## Summary

This phase implements bidirectional cross-linking between pattern pages and problem pages, plus a site-wide footer for navigation. The existing `getCrossLinks.ts` utility (from Phase 11) provides all data resolution logic, so this phase focuses purely on rendering these links in appropriate UI components.

Research identified that Next.js 14's Link component handles all internal navigation needs with built-in prefetching and client-side transitions. No additional libraries required. The codebase already has established card/link styling patterns that should be reused.

Key findings:
- Reuse existing `ProblemCard` component for displaying related problems on pattern pages
- Create a simpler `PatternLink` component for the "Learn the pattern" section on problem pages
- Footer component should be minimal with grouped navigation links

**Primary recommendation:** Create three components (`RelatedProblems`, `RelatedPatterns`, `SiteFooter`) using existing CSS patterns and the `getCrossLinks.ts` utility.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/link | 14.2.0 | Internal navigation | Built-in prefetching, client-side routing |
| lucide-react | (existing) | Icons | Already used throughout codebase |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Modules | (built-in) | Component styling | Standard pattern in this codebase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Link wrapper | next/link directly | Direct usage is simpler, wrapper adds no value here |
| External footer library | CSS Modules | Existing patterns sufficient, no need for external deps |

**Installation:**
```bash
# No new packages required
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── CrossLinks/
│   │   ├── index.ts                    # Barrel export
│   │   ├── RelatedProblems.tsx         # For pattern pages
│   │   ├── RelatedProblems.module.css
│   │   ├── RelatedPatterns.tsx         # For problem pages
│   │   └── RelatedPatterns.module.css
│   └── SiteFooter/
│       ├── index.ts
│       ├── SiteFooter.tsx
│       └── SiteFooter.module.css
└── utils/
    └── getCrossLinks.ts                # Already exists from Phase 11
```

### Pattern 1: Container Component Pattern
**What:** Cross-link components fetch their own data and render link lists
**When to use:** When the parent page has access to the context (patternId or problemId)
**Example:**
```typescript
// RelatedProblems.tsx - used on pattern pages
import { getRelatedProblems, CrossLink } from '@/utils/getCrossLinks'
import Link from 'next/link'

interface Props {
  patternId: string
}

export function RelatedProblems({ patternId }: Props) {
  const problems = getRelatedProblems(patternId)

  if (problems.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Practice this Pattern</h2>
      <div className={styles.grid}>
        {problems.map((problem) => (
          <Link key={problem.id} href={problem.href} className={styles.card}>
            <span className={styles.name}>{problem.name}</span>
            {problem.description && (
              <span className={styles.description}>{problem.description}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Pattern 2: Prominent CTA Link Pattern
**What:** Single prominent link for "Learn the pattern" with icon
**When to use:** Problem pages linking to pattern pages
**Example:**
```typescript
// RelatedPatterns.tsx - used on problem pages
import { getRelatedPatterns } from '@/utils/getCrossLinks'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

interface Props {
  problemId: string
}

export function RelatedPatterns({ problemId }: Props) {
  const patterns = getRelatedPatterns(problemId)

  if (patterns.length === 0) return null

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Learn the Pattern</h3>
      {patterns.map((pattern) => (
        <Link key={pattern.id} href={pattern.href} className={styles.patternLink}>
          <Lightbulb size={16} />
          <div className={styles.patternInfo}>
            <span className={styles.patternName}>{pattern.name}</span>
            {pattern.description && (
              <span className={styles.patternDesc}>{pattern.description}</span>
            )}
          </div>
        </Link>
      ))}
    </section>
  )
}
```

### Pattern 3: Site Footer with Link Groups
**What:** Footer with categorized navigation links
**When to use:** Root layout to appear on all pages
**Example:**
```typescript
// SiteFooter.tsx
import Link from 'next/link'

const footerLinks = {
  concepts: [
    { name: 'JavaScript Deep Dive', href: '/concepts/js' },
    { name: 'DSA Fundamentals', href: '/concepts/dsa' },
  ],
  patterns: [
    { name: 'Two Pointers', href: '/concepts/dsa/patterns/two-pointers' },
    { name: 'Hash Map', href: '/concepts/dsa/patterns/hash-map' },
    { name: 'Bit Manipulation', href: '/concepts/dsa/patterns/bit-manipulation' },
  ],
  categories: [
    { name: 'Arrays & Hashing', href: '/arrays-hashing' },
    { name: 'DSA Problems', href: '/dsa' },
    { name: 'JavaScript Problems', href: '/js-problems' },
  ],
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className={styles.column}>
              <h4 className={styles.columnTitle}>{category}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={styles.bottom}>
          <p className={styles.copyright}>JS Interview Prep</p>
        </div>
      </div>
    </footer>
  )
}
```

### Anti-Patterns to Avoid
- **Inline getCrossLinks calls in render:** Pre-calculate in component body, not during render
- **Over-styling cross-links:** Keep consistent with existing card patterns
- **Footer in every page component:** Add once in root layout.tsx
- **Redundant data passing:** Components should call getCrossLinks internally, not receive data as props

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-link data resolution | Manual pattern/problem mapping | `getCrossLinks.ts` | Already handles all edge cases |
| Link prefetching | Custom preload logic | `next/link` | Built-in prefetching optimal |
| Card styling | New CSS from scratch | Existing ProblemCard styles | Consistency, reuse |
| Active link detection | Manual pathname matching | `usePathname()` hook | Next.js standard approach |

**Key insight:** Phase 11 already built the hard part (data resolution). This phase is purely UI rendering.

## Common Pitfalls

### Pitfall 1: Empty State Not Handled
**What goes wrong:** Component renders empty section headers when no related items exist
**Why it happens:** Forgetting to check array length before rendering
**How to avoid:** Always return null early when `links.length === 0`
**Warning signs:** Empty sections visible on pages with no cross-links

### Pitfall 2: Footer Added Multiple Times
**What goes wrong:** Footer appears multiple times on nested layouts
**Why it happens:** Adding footer to multiple layout.tsx files
**How to avoid:** Add SiteFooter ONLY in root `src/app/layout.tsx`
**Warning signs:** Multiple footers stacked on nested pages

### Pitfall 3: Inconsistent Styling Between Link Types
**What goes wrong:** Pattern links look different from problem links
**Why it happens:** Creating separate styles without referencing existing patterns
**How to avoid:** Reference `ProblemCard.module.css` and `page.module.css` for color variables and spacing
**Warning signs:** Visual inconsistency between cross-link sections

### Pitfall 4: Missing href on Links (SEO Impact)
**What goes wrong:** Crawlers can't discover linked pages
**Why it happens:** Using onClick handlers instead of Link component
**How to avoid:** Always use `<Link href={...}>` for internal navigation
**Warning signs:** Links work but aren't indexed, orphan pages in SEO audit

### Pitfall 5: Orphan Pages Remain
**What goes wrong:** Some pages still have no incoming links
**Why it happens:** Incomplete coverage - not all patterns/problems connected
**How to avoid:** Audit all pages after implementation, ensure footer provides fallback
**Warning signs:** SEO tools report orphan pages

## Code Examples

Verified patterns from this codebase:

### Existing Card Link Pattern (from ProblemCard)
```typescript
// Source: src/components/ProblemCard/ProblemCard.tsx
// Uses overlay link for entire card clickable area
<div className={styles.card}>
  <Link href={href} className={styles.link} aria-label={`Open ${problem.name}`} />
  {cardContent}
</div>

// Corresponding CSS (from ProblemCard.module.css):
.card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.2s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(102, 126, 234, 0.3);
}

.link {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  text-decoration: none;
  z-index: 1;
}
```

### Existing Section Pattern (from PatternPageClient)
```typescript
// Source: src/app/concepts/dsa/patterns/[patternId]/PatternPageClient.tsx
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Pattern Variants</h2>
  <div className={styles.variants}>
    {pattern.variants.map((variant) => (
      <div key={variant.id} className={styles.variantCard}>
        ...
      </div>
    ))}
  </div>
</section>

// Corresponding CSS (from page.module.css):
.section {
  margin-bottom: 2rem;
}

.sectionTitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary, #e5e7eb);
}
```

### Existing CTA Link Pattern (from ConceptVizPageClient)
```typescript
// Source: src/app/[categoryId]/[problemId]/concept/ConceptVizPageClient.tsx
<Link href={`/${categoryId}/${problemId}`} className={styles.practiceLink}>
  <Code size={16} />
  <span>Practice the Code</span>
</Link>

// Corresponding CSS:
.practiceLink {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-md);
  color: white;
  font-size: 14px;
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.practiceLink:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
```

### Existing Footer Pattern (from HomePage)
```typescript
// Source: src/app/page.tsx
<footer className={styles.footer}>
  <p>Understand concepts -> Build implementations -> Solve problems</p>
</footer>

// Corresponding CSS:
.footer {
  text-align: center;
  padding: 1.5rem 2rem;
  color: var(--text-muted);
  font-size: var(--text-base);
  border-top: 1px solid var(--border-card);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hash-based SPA routing | Clean URL routing | Next.js App Router | Full SEO indexing of all pages |
| Manual link preloading | `<Link>` automatic prefetch | Next.js 13+ | Better performance out of box |
| `<a>` tags for internal links | `<Link>` component | Always in Next.js | Client-side transitions |

**Deprecated/outdated:**
- `passHref` prop: No longer needed since Next.js 13 (Link no longer requires child `<a>`)
- `<a>` tags for internal navigation: Use `<Link>` for prefetching benefits

## Open Questions

No major open questions - this phase is straightforward given existing patterns.

Minor consideration:
1. **Footer link organization**
   - What we know: Footer should have navigation links for discoverability
   - What's unclear: Exact grouping categories (Concepts/Patterns/Problems vs other organization)
   - Recommendation: Follow the site's existing three-section structure (Understand/Build/Solve)

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/utils/getCrossLinks.ts`, `src/components/ProblemCard/`, `src/app/page.tsx`
- Next.js official docs: https://nextjs.org/docs/app/api-reference/components/link

### Secondary (MEDIUM confidence)
- Web search: Internal linking SEO best practices 2026
- Web search: React footer component design patterns 2026

### Tertiary (LOW confidence)
- None required - codebase patterns well-established

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using only existing dependencies (next/link, CSS Modules)
- Architecture: HIGH - Following established codebase patterns
- Pitfalls: HIGH - Based on analysis of similar implementations in codebase

**Research date:** 2026-01-25
**Valid until:** 60 days (stable patterns, no fast-moving dependencies)
