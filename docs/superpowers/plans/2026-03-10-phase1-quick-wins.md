# Phase 1: Quick Wins — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship ~15 high-SEO-value pages (comparison pages, aggregator pages, cheat sheets) by repackaging existing content into high-search-volume formats.

**Architecture:** New data-driven routes following existing TopicHub/Concept page patterns — static generation, structured data schemas, OG images, sitemap/indexing integration. All content draws from existing concept data where possible.

**Tech Stack:** Next.js App Router, TypeScript, CSS Modules + Tailwind v4 tokens, next/og for OG images

**Design Doc:** `docs/plans/2026-03-10-content-deepening-design.md`

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `src/data/comparisons.ts` | Comparison types + all 10 comparison data entries |
| `src/app/compare/[comparisonId]/page.tsx` | Server component: metadata, static params, schema generation |
| `src/app/compare/[comparisonId]/ComparisonPageClient.tsx` | Client component: interactive comparison rendering |
| `src/app/compare/[comparisonId]/ComparisonPageClient.module.css` | Comparison page styles |
| `src/app/compare/[comparisonId]/opengraph-image.tsx` | OG images for comparison pages |
| `src/app/top-questions/[domain]/page.tsx` | Top N aggregator page (server component) |
| `src/app/top-questions/[domain]/TopQuestionsPageClient.tsx` | Aggregator client component |
| `src/app/top-questions/[domain]/TopQuestionsPageClient.module.css` | Aggregator page styles |
| `src/app/top-questions/[domain]/opengraph-image.tsx` | OG images for aggregator pages |
| `src/app/concepts/dsa/cheatsheet/page.tsx` | DSA cheatsheet (mirrors JS cheatsheet) |
| `src/app/concepts/react/cheatsheet/page.tsx` | React cheatsheet (mirrors JS cheatsheet) |

### Modified Files

| File | Change |
|------|--------|
| `src/app/sitemap.ts` | Add comparison, top-questions, cheatsheet routes |
| `scripts/google-index.ts` | Add new URL patterns to `buildUrlList()` |
| `src/data/dsaConcepts.ts` | Add `commonQuestions` to entries missing them |
| `src/data/reactConcepts.ts` | Add `commonQuestions` to entries missing them |
| `src/app/concepts/page.tsx` | Add links to new comparison/cheatsheet pages (optional) |

---

## Chunk 1: Comparison Pages Infrastructure

### Task 1: Define Comparison Types and First Data Entry

**Files:**
- Create: `src/data/comparisons.ts`

- [ ] **Step 1: Create comparison data file with types and first entry**

Create `src/data/comparisons.ts` with the `Comparison` interface and the first comparison (`var-let-const`). Follow the pattern from `src/data/topicHubs.ts` — export typed array + lookup function.

```typescript
import type { ConceptQuestion } from '@/data/concepts'

export interface ComparisonItem {
  id: string
  title: string
  keyPoints: string[]
  codeExample: string
}

export interface ComparisonDimension {
  dimension: string
  aspects: Record<string, string>
}

export interface Comparison {
  id: string
  title: string
  domain: 'js' | 'react' | 'dsa'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  shortDescription: string
  items: ComparisonItem[]
  dimensions: ComparisonDimension[]
  whenToUse: { itemId: string; guidance: string }[]
  commonMistakes: string[]
  interviewQuestions: ConceptQuestion[]
  relatedConceptIds: string[]
  targetKeywords: string[]
}

export const comparisons: Comparison[] = [
  {
    id: 'var-let-const',
    title: 'var vs let vs const',
    domain: 'js',
    difficulty: 'beginner',
    shortDescription: 'Understand the differences between var, let, and const — scope, hoisting, reassignment, and when to use each.',
    items: [
      {
        id: 'var',
        title: 'var',
        keyPoints: [
          'Function-scoped (not block-scoped)',
          'Hoisted and initialized to undefined',
          'Can be redeclared in the same scope',
          'Can be reassigned',
        ],
        codeExample: `function example() {
  console.log(x) // undefined (hoisted)
  var x = 10
  if (true) {
    var x = 20 // same variable!
  }
  console.log(x) // 20
}`,
      },
      {
        id: 'let',
        title: 'let',
        keyPoints: [
          'Block-scoped (respects {curly braces})',
          'Hoisted but NOT initialized (TDZ)',
          'Cannot be redeclared in the same scope',
          'Can be reassigned',
        ],
        codeExample: `function example() {
  // console.log(x) // ReferenceError (TDZ)
  let x = 10
  if (true) {
    let x = 20 // different variable (block scope)
    console.log(x) // 20
  }
  console.log(x) // 10
}`,
      },
      {
        id: 'const',
        title: 'const',
        keyPoints: [
          'Block-scoped (like let)',
          'Hoisted but NOT initialized (TDZ)',
          'Cannot be redeclared or reassigned',
          'Object/array properties CAN still be mutated',
        ],
        codeExample: `const obj = { name: 'Alice' }
obj.name = 'Bob'    // OK — mutating property
// obj = {}          // TypeError — cannot reassign

const arr = [1, 2, 3]
arr.push(4)          // OK — mutating array
// arr = [5, 6]      // TypeError — cannot reassign`,
      },
    ],
    dimensions: [
      { dimension: 'Scope', aspects: { var: 'Function', let: 'Block', const: 'Block' } },
      { dimension: 'Hoisting', aspects: { var: 'Yes (undefined)', let: 'Yes (TDZ)', const: 'Yes (TDZ)' } },
      { dimension: 'Redeclaration', aspects: { var: 'Allowed', let: 'Not allowed', const: 'Not allowed' } },
      { dimension: 'Reassignment', aspects: { var: 'Allowed', let: 'Allowed', const: 'Not allowed' } },
      { dimension: 'Global object property', aspects: { var: 'Yes (window.x)', let: 'No', const: 'No' } },
    ],
    whenToUse: [
      { itemId: 'const', guidance: 'Default choice. Use for all values that won\'t be reassigned — objects, arrays, functions, primitives.' },
      { itemId: 'let', guidance: 'Use when the binding needs to change — loop counters, accumulators, conditional assignments.' },
      { itemId: 'var', guidance: 'Avoid in modern code. Only appears in legacy codebases or when you specifically need function-scoping.' },
    ],
    commonMistakes: [
      'Thinking const makes objects immutable — it only prevents reassignment of the binding',
      'Using var in for loops and expecting block scope — var leaks out of the loop body',
      'Not understanding TDZ — accessing let/const before declaration throws ReferenceError, not undefined',
    ],
    interviewQuestions: [
      {
        question: 'What is the Temporal Dead Zone (TDZ)?',
        answer: 'The TDZ is the period between entering a scope and the let/const declaration being reached. Accessing the variable during this period throws a ReferenceError. This exists because let/const are hoisted but not initialized.',
        difficulty: 'medium',
      },
      {
        question: 'Why does var in a for loop cause issues with closures?',
        answer: 'Because var is function-scoped, all iterations share the same variable. By the time callbacks execute, the loop has finished and the variable holds the final value. Using let creates a new binding per iteration, fixing this.',
        difficulty: 'medium',
      },
      {
        question: 'Can you change a property of a const object?',
        answer: 'Yes. const prevents reassignment of the binding, not mutation of the value. To make an object truly immutable, use Object.freeze() — but note it is shallow.',
        difficulty: 'easy',
      },
    ],
    relatedConceptIds: ['variables', 'scope-basics', 'hoisting-variables', 'temporal-dead-zone'],
    targetKeywords: ['var vs let vs const', 'javascript var let const difference', 'when to use let vs const', 'var vs let vs const interview'],
  },
]

export function getComparison(id: string): Comparison | undefined {
  return comparisons.find((c) => c.id === id)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/data/comparisons.ts` or check via IDE.

Check: The `ConceptQuestion` import from `@/data/concepts` resolves correctly. If it's not exported, check the actual type name in `concepts.ts` and adjust.

- [ ] **Step 3: Commit**

```bash
git add src/data/comparisons.ts
git commit -m "feat(comparisons): add comparison data types and first entry (var-let-const)"
```

---

### Task 2: Create Comparison Page Route (Server Component)

**Files:**
- Create: `src/app/compare/[comparisonId]/page.tsx`
- Reference: `src/app/topics/[topicId]/page.tsx` (follow this pattern exactly)

- [ ] **Step 1: Create the comparison page server component**

Follow the TopicHub page pattern for metadata, static params, and structured data. Key differences: uses `comparisons` data, generates ComparisonTable schema instead of Course schema.

```typescript
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { comparisons, getComparison } from '@/data/comparisons'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { CONTENT_LAST_UPDATED } from '@/app/sitemap'
import { ComparisonPageClient } from './ComparisonPageClient'

interface PageProps {
  params: Promise<{ comparisonId: string }>
}

export function generateStaticParams(): { comparisonId: string }[] {
  return comparisons.map((c) => ({ comparisonId: c.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { comparisonId } = await params
  const comparison = getComparison(comparisonId)
  if (!comparison) return {}

  const title = `${comparison.title} — Differences Explained | JS Interview`
  const description = comparison.shortDescription

  return {
    title,
    description,
    keywords: comparison.targetKeywords,
    openGraph: {
      title,
      description,
      url: `https://jsinterview.dev/compare/${comparison.id}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://jsinterview.dev/compare/${comparison.id}`,
    },
  }
}

function generateFAQSchema(comparison: ReturnType<typeof getComparison>) {
  if (!comparison || comparison.interviewQuestions.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: comparison.interviewQuestions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

function generateArticleSchema(comparison: ReturnType<typeof getComparison>) {
  if (!comparison) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${comparison.title} — Differences Explained`,
    description: comparison.shortDescription,
    url: `https://jsinterview.dev/compare/${comparison.id}`,
    dateModified: CONTENT_LAST_UPDATED.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'JS Interview',
      url: 'https://jsinterview.dev',
    },
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { comparisonId } = await params
  const comparison = getComparison(comparisonId)
  if (!comparison) notFound()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Comparisons' },
    { name: comparison.title },
  ])
  const faqSchema = generateFAQSchema(comparison)
  const articleSchema = generateArticleSchema(comparison)

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}
      {articleSchema && <StructuredData data={articleSchema} />}
      <ComparisonPageClient comparison={comparison} />
    </>
  )
}
```

- [ ] **Step 2: Verify the page file has no TypeScript errors**

Check that `generateBreadcrumbSchema`, `StructuredData`, `CONTENT_LAST_UPDATED` imports resolve. Adjust import paths if needed based on actual codebase (check `src/lib/seo/` and `src/components/StructuredData/`).

- [ ] **Step 3: Commit**

```bash
git add src/app/compare/[comparisonId]/page.tsx
git commit -m "feat(comparisons): add comparison page route with metadata and schemas"
```

---

### Task 3: Create Comparison Page Client Component

**Files:**
- Create: `src/app/compare/[comparisonId]/ComparisonPageClient.tsx`
- Create: `src/app/compare/[comparisonId]/ComparisonPageClient.module.css`

- [ ] **Step 1: Create the client component**

This renders: title, comparison table, code examples, "when to use" guide, common mistakes, and interview questions. Follow the styling patterns from TopicHub pages — CSS Modules + design tokens.

```typescript
'use client'

import Link from 'next/link'
import type { Comparison } from '@/data/comparisons'
import styles from './ComparisonPageClient.module.css'

interface ComparisonPageClientProps {
  comparison: Comparison
}

export function ComparisonPageClient({ comparison }: ComparisonPageClientProps) {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/concepts" className={styles.backLink}>
          ← Back to Concepts
        </Link>
        <h1 className={styles.title}>{comparison.title}</h1>
        <p className={styles.description}>{comparison.shortDescription}</p>
      </header>

      {/* Comparison Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Side-by-Side Comparison</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.dimensionHeader}>Feature</th>
                {comparison.items.map((item) => (
                  <th key={item.id} className={styles.itemHeader}>{item.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.dimensions.map((dim) => (
                <tr key={dim.dimension}>
                  <td className={styles.dimensionCell}>{dim.dimension}</td>
                  {comparison.items.map((item) => (
                    <td key={item.id} className={styles.aspectCell}>
                      {dim.aspects[item.id] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Examples */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Code Examples</h2>
        <div className={styles.codeGrid}>
          {comparison.items.map((item) => (
            <div key={item.id} className={styles.codeCard}>
              <h3 className={styles.codeCardTitle}>{item.title}</h3>
              <ul className={styles.keyPoints}>
                {item.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <pre className={styles.codeBlock}>
                <code>{item.codeExample}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* When to Use */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>When to Use Which</h2>
        <div className={styles.guidanceList}>
          {comparison.whenToUse.map((wu) => {
            const item = comparison.items.find((i) => i.id === wu.itemId)
            return (
              <div key={wu.itemId} className={styles.guidanceCard}>
                <h3 className={styles.guidanceTitle}>{item?.title || wu.itemId}</h3>
                <p className={styles.guidanceText}>{wu.guidance}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Common Mistakes */}
      {comparison.commonMistakes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Mistakes</h2>
          <ul className={styles.mistakesList}>
            {comparison.commonMistakes.map((mistake, i) => (
              <li key={i} className={styles.mistakeItem}>{mistake}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Interview Questions */}
      {comparison.interviewQuestions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interview Questions</h2>
          <div className={styles.faqList}>
            {comparison.interviewQuestions.map((q, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{q.question}</summary>
                <p className={styles.faqAnswer}>{q.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Concepts */}
      {comparison.relatedConceptIds.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Deep Dive</h2>
          <div className={styles.relatedLinks}>
            {comparison.relatedConceptIds.map((id) => (
              <Link
                key={id}
                href={`/concepts/${comparison.domain}/${id}`}
                className={styles.relatedLink}
              >
                {id.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Create the CSS Module**

Follow the project's token-first CSS rules. Use `var(--spacing-*)`, `var(--text-*)`, `var(--color-*)` tokens. Reference nearby CSS modules (e.g., TopicHub styles) for patterns.

Create `ComparisonPageClient.module.css` with styles for: `.container`, `.header`, `.title`, `.description`, `.section`, `.sectionTitle`, `.tableWrapper`, `.comparisonTable`, `.dimensionHeader`, `.itemHeader`, `.dimensionCell`, `.aspectCell`, `.codeGrid`, `.codeCard`, `.codeCardTitle`, `.keyPoints`, `.codeBlock`, `.guidanceList`, `.guidanceCard`, `.guidanceTitle`, `.guidanceText`, `.mistakesList`, `.mistakeItem`, `.faqList`, `.faqItem`, `.faqQuestion`, `.faqAnswer`, `.relatedLinks`, `.relatedLink`, `.backLink`.

Key token usage:
- Spacing: `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)`, `var(--spacing-xl)`
- Text: `var(--text-sm)`, `var(--text-base)`, `var(--text-lg)`, `var(--text-xl)`
- Colors: `var(--color-bg-primary)`, `var(--color-bg-secondary)`, `var(--color-text-primary)`, `var(--color-text-muted)`, `var(--color-border-primary)`, `var(--color-accent-blue)`
- Border: `var(--border-width-1) solid var(--color-border-primary)`
- Radius: `var(--radius-md)`, `var(--radius-lg)`
- Transition: `var(--transition-fast)`

- [ ] **Step 3: Verify the page renders locally**

Run: `npm run dev`
Navigate to: `http://localhost:3000/compare/var-let-const`
Verify: Page renders with comparison table, code examples, and FAQ sections.

- [ ] **Step 4: Commit**

```bash
git add src/app/compare/[comparisonId]/ComparisonPageClient.tsx
git add src/app/compare/[comparisonId]/ComparisonPageClient.module.css
git commit -m "feat(comparisons): add comparison page client component with styles"
```

---

### Task 4: Add OG Image for Comparison Pages

**Files:**
- Create: `src/app/compare/[comparisonId]/opengraph-image.tsx`
- Reference: `src/app/concepts/js/[conceptId]/opengraph-image.tsx` (follow this pattern exactly)

- [ ] **Step 1: Create OG image component**

Follow the existing OG image pattern — `next/og` `ImageResponse` (1200x630), inline styles only (no CSS variables or Tailwind), export `generateStaticParams()`.

```typescript
import { ImageResponse } from 'next/og'
import { comparisons, getComparison } from '@/data/comparisons'

export const runtime = 'edge'
export const alt = 'Comparison'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams(): { comparisonId: string }[] {
  return comparisons.map((c) => ({ comparisonId: c.id }))
}

export default async function Image({ params }: { params: Promise<{ comparisonId: string }> }) {
  const { comparisonId } = await params
  const comparison = getComparison(comparisonId)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#94a3b8',
            marginBottom: '20px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Comparison
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            color: '#f8fafc',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {comparison?.title || 'Comparison'}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#64748b',
            marginTop: '24px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {comparison?.shortDescription || ''}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#38bdf8',
            marginTop: '40px',
          }}
        >
          jsinterview.dev
        </div>
      </div>
    ),
    { ...size }
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/compare/[comparisonId]/opengraph-image.tsx
git commit -m "feat(comparisons): add OG image generation for comparison pages"
```

---

### Task 5: Add Remaining 9 Comparison Data Entries

**Files:**
- Modify: `src/data/comparisons.ts`

- [ ] **Step 1: Add all remaining comparisons to the data array**

Add entries for: `debounce-vs-throttle`, `usememo-vs-usecallback`, `equality-operators`, `promise-vs-async-await`, `map-vs-foreach`, `null-vs-undefined`, `call-apply-bind`, `shallow-vs-deep-copy`, `react-memo-vs-usememo`.

Each entry follows the exact same structure as `var-let-const`. For each:
- 2-3 `items` with `keyPoints` and `codeExample`
- 3-5 `dimensions` for the comparison table
- 2-3 `whenToUse` entries
- 2-3 `commonMistakes`
- 2-3 `interviewQuestions` (for FAQ schema)
- `relatedConceptIds` pointing to existing concept pages
- `targetKeywords` with high-volume search terms

Draw content from existing concept pages where possible:
- `debounce-vs-throttle`: reference `src/data/concepts.ts` entry for `timing-control`
- `usememo-vs-usecallback`: reference `src/data/reactConcepts.ts` entries for `use-memo` and `use-callback`
- `equality-operators`: reference `equality-comparisons` and `type-coercion`
- `promise-vs-async-await`: reference `promises-deep-dive` and `async-await-syntax`
- `map-vs-foreach`: reference `array-iteration-methods`
- `null-vs-undefined`: reference `data-types`
- `call-apply-bind`: reference `this-keyword`
- `shallow-vs-deep-copy`: reference `structured-clone`
- `react-memo-vs-usememo`: reference `react-memo` and `use-memo`

- [ ] **Step 2: Verify all pages render**

Run: `npm run dev`
Navigate to each comparison page and verify rendering:
- `/compare/debounce-vs-throttle`
- `/compare/usememo-vs-usecallback`
- `/compare/equality-operators`
- `/compare/promise-vs-async-await`
- `/compare/map-vs-foreach`
- `/compare/null-vs-undefined`
- `/compare/call-apply-bind`
- `/compare/shallow-vs-deep-copy`
- `/compare/react-memo-vs-usememo`

- [ ] **Step 3: Commit**

```bash
git add src/data/comparisons.ts
git commit -m "feat(comparisons): add 9 remaining comparison data entries"
```

---

## Chunk 2: Top Questions Aggregator Pages

### Task 6: Create Top Questions Data Aggregation Logic

**Files:**
- Create: `src/app/top-questions/[domain]/page.tsx`

- [ ] **Step 1: Create the aggregator page server component**

This page curates questions from existing data files. For JavaScript, pull from `jsInterviewQuestions.ts` + concept `commonQuestions`. For React/DSA, pull from concept `commonQuestions`.

```typescript
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { reactConcepts } from '@/data/reactConcepts'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import { TopQuestionsPageClient } from './TopQuestionsPageClient'

const DOMAINS = ['javascript', 'react', 'dsa'] as const
type Domain = (typeof DOMAINS)[number]

interface AggregatedQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  sourceConceptId?: string
  sourceDomain?: string
}

interface DomainConfig {
  title: string
  description: string
  keywords: string[]
  questionCount: number
}

const domainConfigs: Record<Domain, DomainConfig> = {
  javascript: {
    title: 'Top 50 JavaScript Interview Questions (2026)',
    description: 'The 50 most-asked JavaScript interview questions with detailed answers. Covers closures, promises, prototypes, event loop, and more.',
    keywords: ['javascript interview questions', 'js interview questions 2026', 'javascript interview prep'],
    questionCount: 50,
  },
  react: {
    title: 'Top 30 React Interview Questions (2026)',
    description: 'The 30 most-asked React interview questions with answers. Covers hooks, rendering, performance, patterns, and React 19.',
    keywords: ['react interview questions', 'react hooks interview questions', 'react interview prep 2026'],
    questionCount: 30,
  },
  dsa: {
    title: 'Top 30 DSA Questions for Frontend Interviews',
    description: 'The 30 most important data structures and algorithms questions asked in frontend interviews. JavaScript implementations.',
    keywords: ['dsa interview questions frontend', 'data structures algorithms javascript', 'frontend coding interview'],
    questionCount: 30,
  },
}

function aggregateQuestions(domain: Domain): AggregatedQuestion[] {
  const questions: AggregatedQuestion[] = []

  if (domain === 'javascript') {
    concepts.forEach((c) => {
      c.commonQuestions?.forEach((q) => {
        questions.push({ ...q, sourceConceptId: c.id, sourceDomain: 'js' })
      })
    })
  } else if (domain === 'react') {
    reactConcepts.forEach((c) => {
      c.commonQuestions?.forEach((q) => {
        questions.push({ ...q, sourceConceptId: c.id, sourceDomain: 'react' })
      })
    })
  } else if (domain === 'dsa') {
    dsaConcepts.forEach((c) => {
      c.commonQuestions?.forEach((q) => {
        questions.push({ ...q, sourceConceptId: c.id, sourceDomain: 'dsa' })
      })
    })
  }

  return questions.slice(0, domainConfigs[domain].questionCount)
}

interface PageProps {
  params: Promise<{ domain: string }>
}

export function generateStaticParams(): { domain: string }[] {
  return DOMAINS.map((d) => ({ domain: d }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  if (!DOMAINS.includes(domain as Domain)) return {}
  const config = domainConfigs[domain as Domain]

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `https://jsinterview.dev/top-questions/${domain}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://jsinterview.dev/top-questions/${domain}`,
    },
  }
}

export default async function TopQuestionsPage({ params }: PageProps) {
  const { domain } = await params
  if (!DOMAINS.includes(domain as Domain)) notFound()

  const config = domainConfigs[domain as Domain]
  const questions = aggregateQuestions(domain as Domain)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: config.title },
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.slice(0, 20).map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      <TopQuestionsPageClient
        title={config.title}
        description={config.description}
        questions={questions}
        domain={domain as Domain}
      />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/top-questions/[domain]/page.tsx
git commit -m "feat(top-questions): add aggregator page route with FAQ schema"
```

---

### Task 7: Create Top Questions Client Component

**Files:**
- Create: `src/app/top-questions/[domain]/TopQuestionsPageClient.tsx`
- Create: `src/app/top-questions/[domain]/TopQuestionsPageClient.module.css`

- [ ] **Step 1: Create the client component**

Renders a searchable, filterable list of questions with expandable answers. Include difficulty filter (Easy/Medium/Hard) and link back to source concept.

The component should accept `title`, `description`, `questions`, and `domain` as props. Use `useState` for search/filter state.

Key UI elements:
- Page title + description
- Search input (filter questions by text)
- Difficulty filter pills (All / Easy / Medium / Hard)
- Numbered question list with `<details>` for expandable answers
- "Learn more" link to source concept page for each question
- Question count display

- [ ] **Step 2: Create corresponding CSS Module**

Follow token-first CSS rules. Use same spacing/color tokens as comparison page styles.

- [ ] **Step 3: Verify locally**

Run: `npm run dev`
Navigate to:
- `http://localhost:3000/top-questions/javascript`
- `http://localhost:3000/top-questions/react`
- `http://localhost:3000/top-questions/dsa`

- [ ] **Step 4: Commit**

```bash
git add src/app/top-questions/[domain]/TopQuestionsPageClient.tsx
git add src/app/top-questions/[domain]/TopQuestionsPageClient.module.css
git commit -m "feat(top-questions): add filterable question list client component"
```

---

### Task 8: Add OG Images for Top Questions Pages

**Files:**
- Create: `src/app/top-questions/[domain]/opengraph-image.tsx`

- [ ] **Step 1: Create OG image**

Same pattern as comparison OG images. Display domain-specific title and question count.

- [ ] **Step 2: Commit**

```bash
git add src/app/top-questions/[domain]/opengraph-image.tsx
git commit -m "feat(top-questions): add OG image generation"
```

---

## Chunk 3: Cheat Sheets

### Task 9: Create DSA Cheatsheet Page

**Files:**
- Create: `src/app/concepts/dsa/cheatsheet/page.tsx`
- Reference: `src/app/concepts/js/cheatsheet/page.tsx` (mirror this file closely)

- [ ] **Step 1: Create DSA cheatsheet page**

Mirror the JS cheatsheet pattern exactly. Group DSA concepts by category (Data Structures, Algorithms, Patterns). Use `dsaConcepts` data source instead of `concepts`.

Key differences from JS cheatsheet:
- Import from `@/data/dsaConcepts` instead of `@/data/concepts`
- Group by DSA categories (arrays, trees, graphs, etc.)
- Breadcrumb: Home → Concepts → DSA → Cheatsheet
- Metadata targets "DSA cheatsheet interview" keywords

- [ ] **Step 2: Verify locally**

Run: `npm run dev`
Navigate to: `http://localhost:3000/concepts/dsa/cheatsheet`

- [ ] **Step 3: Commit**

```bash
git add src/app/concepts/dsa/cheatsheet/page.tsx
git commit -m "feat(cheatsheet): add DSA cheatsheet page mirroring JS pattern"
```

---

### Task 10: Create React Cheatsheet Page

**Files:**
- Create: `src/app/concepts/react/cheatsheet/page.tsx`
- Reference: `src/app/concepts/js/cheatsheet/page.tsx` (mirror this file closely)

- [ ] **Step 1: Create React cheatsheet page**

Mirror the JS cheatsheet pattern. Group React concepts by category (Foundations, Basic Hooks, Advanced Hooks, Rendering, Patterns, Performance).

Key differences:
- Import from `@/data/reactConcepts`
- Group by React concept categories
- Breadcrumb: Home → Concepts → React → Cheatsheet
- Metadata targets "React cheatsheet interview" keywords

- [ ] **Step 2: Verify locally**

Run: `npm run dev`
Navigate to: `http://localhost:3000/concepts/react/cheatsheet`

- [ ] **Step 3: Commit**

```bash
git add src/app/concepts/react/cheatsheet/page.tsx
git commit -m "feat(cheatsheet): add React cheatsheet page mirroring JS pattern"
```

---

## Chunk 4: FAQ Enrichment + Integration

### Task 11: Add commonQuestions to DSA Concepts

**Files:**
- Modify: `src/data/dsaConcepts.ts`

- [ ] **Step 1: Audit which DSA concepts lack commonQuestions**

Search `src/data/dsaConcepts.ts` for entries without `commonQuestions` field. Add 2-3 interview questions per concept.

Priority concepts (highest traffic):
- `arrays`, `hash-tables`, `trees`, `graphs`, `linked-lists`, `sorting-algorithms`, `stacks`, `queues`, `recursion`, `heap`

Each question follows the `ConceptQuestion` interface:
```typescript
{ question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard' }
```

- [ ] **Step 2: Verify data compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/dsaConcepts.ts
git commit -m "feat(seo): add commonQuestions to DSA concepts for FAQ schema"
```

---

### Task 12: Add commonQuestions to React Concepts

**Files:**
- Modify: `src/data/reactConcepts.ts`

- [ ] **Step 1: Audit which React concepts lack commonQuestions**

Same pattern as Task 11. Add 2-3 interview questions per concept.

Priority concepts: `use-state`, `use-effect`, `use-memo`, `use-callback`, `virtual-dom`, `react-memo`, `use-ref`, `custom-hooks`, `context-patterns`, `server-components`.

- [ ] **Step 2: Verify data compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/reactConcepts.ts
git commit -m "feat(seo): add commonQuestions to React concepts for FAQ schema"
```

---

### Task 13: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add new routes to sitemap**

Add these URL categories:

```typescript
// Comparison pages (priority 0.8)
...comparisons.map((c) => ({
  url: `${BASE_URL}/compare/${c.id}`,
  lastModified: CONTENT_LAST_UPDATED,
  changeFrequency: 'monthly' as const,
  priority: 0.8,
})),

// Top Questions pages (priority 0.9)
...['javascript', 'react', 'dsa'].map((d) => ({
  url: `${BASE_URL}/top-questions/${d}`,
  lastModified: CONTENT_LAST_UPDATED,
  changeFrequency: 'monthly' as const,
  priority: 0.9,
})),
```

Also add cheatsheet pages to the static paths section:
- `/concepts/dsa/cheatsheet` (priority 0.8)
- `/concepts/react/cheatsheet` (priority 0.8)

Import `comparisons` from `@/data/comparisons`.

- [ ] **Step 2: Verify sitemap generates correctly**

Run: `npm run build` (sitemap is generated at build time)
Check: `curl http://localhost:3000/sitemap.xml` includes new URLs.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add comparison, top-questions, and cheatsheet routes to sitemap"
```

---

### Task 14: Update Google Indexing Script

**Files:**
- Modify: `scripts/google-index.ts`

- [ ] **Step 1: Add new URL patterns to buildUrlList()**

Add after existing static paths:

```typescript
import { comparisons } from '../src/data/comparisons'

// In buildUrlList():

// Comparison pages
comparisons.forEach((c) => urls.push(`${BASE_URL}/compare/${c.id}`))

// Top Questions pages
;['javascript', 'react', 'dsa'].forEach((d) => urls.push(`${BASE_URL}/top-questions/${d}`))
```

Also add `/concepts/dsa/cheatsheet` and `/concepts/react/cheatsheet` to the static paths array.

- [ ] **Step 2: Verify URL count increases**

Run: `npx tsx scripts/google-index.ts --dry-run 2>&1 | head -5`
Expected: URL count should increase by ~15 (10 comparisons + 3 aggregators + 2 cheatsheets).

- [ ] **Step 3: Commit**

```bash
git add scripts/google-index.ts
git commit -m "feat(seo): add new Phase 1 pages to Google indexing script"
```

---

### Task 15: Build Verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: PASS with no errors

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS — all new pages statically generated

- [ ] **Step 3: Verify all new pages in production build**

Run: `npm run start` then spot-check:
- `http://localhost:3000/compare/var-let-const`
- `http://localhost:3000/compare/debounce-vs-throttle`
- `http://localhost:3000/top-questions/javascript`
- `http://localhost:3000/top-questions/react`
- `http://localhost:3000/concepts/dsa/cheatsheet`
- `http://localhost:3000/concepts/react/cheatsheet`

Verify: Pages render, OG images generate, structured data is present (check page source for `application/ld+json`).

- [ ] **Step 4: Final commit**

```bash
git commit -m "feat(phase1): complete Phase 1 quick wins — comparisons, aggregators, cheatsheets"
```

---

## Summary

| Task | Description | Files |
|------|------------|-------|
| 1 | Comparison types + first data entry | `src/data/comparisons.ts` |
| 2 | Comparison page server component | `src/app/compare/[comparisonId]/page.tsx` |
| 3 | Comparison client component + styles | `ComparisonPageClient.tsx` + `.module.css` |
| 4 | Comparison OG images | `opengraph-image.tsx` |
| 5 | Remaining 9 comparison data entries | `src/data/comparisons.ts` |
| 6 | Top Questions server component | `src/app/top-questions/[domain]/page.tsx` |
| 7 | Top Questions client + styles | `TopQuestionsPageClient.tsx` + `.module.css` |
| 8 | Top Questions OG images | `opengraph-image.tsx` |
| 9 | DSA cheatsheet page | `src/app/concepts/dsa/cheatsheet/page.tsx` |
| 10 | React cheatsheet page | `src/app/concepts/react/cheatsheet/page.tsx` |
| 11 | FAQ enrichment — DSA concepts | `src/data/dsaConcepts.ts` |
| 12 | FAQ enrichment — React concepts | `src/data/reactConcepts.ts` |
| 13 | Sitemap integration | `src/app/sitemap.ts` |
| 14 | Google indexing integration | `scripts/google-index.ts` |
| 15 | Build verification | — |

**Total new pages:** ~15 (10 comparisons + 3 aggregators + 2 cheatsheets)
**Total enriched pages:** ~20 (DSA + React concepts with FAQ schema)
