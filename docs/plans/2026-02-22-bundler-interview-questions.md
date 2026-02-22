# Bundler Interview Questions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a bundler interview questions page at `/interview/bundlers` with ~88 questions across 9 topics (common concepts + 8 individual bundlers), following the exact pattern established by the HTML/CSS/JS/React interview pages.

**Architecture:** Single data file exports typed questions, topic config, topic map, and a filter function. A server component (`page.tsx`) provides SEO metadata + breadcrumb structured data. A client component (`BundlersInterviewClient.tsx`) wires up `InterviewFilterBar` and `InterviewQuestionCard` — the same shared components used by all other interview pages. Homepage, interview landing, sitemap, and icon map are updated to include the new page.

**Tech Stack:** Next.js App Router, TypeScript (strict), CSS Modules with design tokens, lucide-react icons

---

### Task 1: Create the Bundler Data File — Types, Config, and Topic Map

**Files:**
- Create: `src/data/bundlerInterviewQuestions.ts`

This is the largest task. The file follows the exact pattern of `src/data/reactInterviewQuestions.ts`.

**Step 1: Create the data file with types, config, topic map, and empty questions array**

```typescript
// src/data/bundlerInterviewQuestions.ts

export type BundlerInterviewTopic =
  | 'common-concepts'
  | 'webpack'
  | 'vite'
  | 'rollup'
  | 'esbuild'
  | 'parcel'
  | 'turbopack'
  | 'rspack'
  | 'rolldown'

export interface BundlerInterviewQuestion {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: BundlerInterviewTopic
  subtopic: string
  answer: string
  codeExample?: string
  followUp: string
  keyTakeaway: string
}

export interface BundlerTopicConfig {
  id: BundlerInterviewTopic
  label: string
  description: string
}

export const bundlerTopics: BundlerTopicConfig[] = [
  {
    id: 'common-concepts',
    label: 'Common Concepts',
    description: 'Tree shaking, code splitting, HMR, module formats, source maps, dependency graphs',
  },
  {
    id: 'webpack',
    label: 'Webpack',
    description: 'Loaders, plugins, Module Federation, chunk splitting, optimization',
  },
  {
    id: 'vite',
    label: 'Vite',
    description: 'ESM dev server, Rollup production builds, plugin API, dependency pre-bundling',
  },
  {
    id: 'rollup',
    label: 'Rollup',
    description: 'ESM-first output, tree shaking, plugin hooks, output formats',
  },
  {
    id: 'esbuild',
    label: 'esbuild',
    description: 'Go-based speed, bundling and minification, JSX handling, plugin API',
  },
  {
    id: 'parcel',
    label: 'Parcel',
    description: 'Zero-config philosophy, asset graph, transformers, scope hoisting',
  },
  {
    id: 'turbopack',
    label: 'Turbopack',
    description: 'Rust-based architecture, incremental computation, Next.js integration',
  },
  {
    id: 'rspack',
    label: 'Rspack',
    description: 'Rust-based Webpack-compatible bundler, loader and plugin compatibility',
  },
  {
    id: 'rolldown',
    label: 'Rolldown',
    description: 'Rust-based Rollup replacement, Vite integration, compatibility goals',
  },
]

export const bundlerTopicMap: Record<BundlerInterviewTopic, BundlerTopicConfig> =
  Object.fromEntries(bundlerTopics.map((t) => [t.id, t])) as Record<BundlerInterviewTopic, BundlerTopicConfig>

export const bundlerInterviewQuestions: BundlerInterviewQuestion[] = [
  // Questions go here — see Step 2
]

export function filterBundlerQuestions(
  questions: BundlerInterviewQuestion[],
  difficulty: 'all' | 'easy' | 'medium' | 'hard',
  topic: string,
): BundlerInterviewQuestion[] {
  return questions.filter((q) => {
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false
    if (topic !== 'all' && q.topic !== topic) return false
    return true
  })
}
```

**Step 2: Write all ~88 questions**

Questions are written in batches by topic. Each question has this shape:

```typescript
{
  id: 1,
  title: 'What is the primary purpose of a JavaScript bundler?',
  difficulty: 'easy',
  topic: 'common-concepts',
  subtopic: 'bundling-basics',
  answer: '...',
  codeExample: '// optional code ...',
  followUp: '...',
  keyTakeaway: '...',
},
```

Question distribution (approximate — organic, not forced):

| Topic | IDs | Count |
|---|---|---|
| common-concepts | 1–15 | ~15 |
| webpack | 16–29 | ~14 |
| vite | 30–40 | ~11 |
| rollup | 41–50 | ~10 |
| esbuild | 51–59 | ~9 |
| parcel | 60–67 | ~8 |
| turbopack | 68–74 | ~7 |
| rspack | 75–81 | ~7 |
| rolldown | 82–88 | ~7 |

**Subtopics to cover per topic:**

- **common-concepts**: bundling-basics, tree-shaking, code-splitting, hmr, source-maps, module-formats, dependency-graph, lazy-loading, asset-pipeline, loaders-vs-plugins, minification, bundler-comparison
- **webpack**: entry-output, loaders, plugins, module-federation, chunk-splitting, dev-server, optimization, caching, resolve-config, webpack5, code-splitting, tree-shaking, hot-module-replacement
- **vite**: esm-dev-server, rollup-production, plugin-api, hmr, config, ssr, library-mode, env-variables, dependency-prebundling, css-handling
- **rollup**: esm-output, tree-shaking, plugin-hooks, code-splitting, output-formats, external-deps, rollup-vs-webpack, configuration
- **esbuild**: go-speed, build-api, bundling, minification, jsx-handling, limitations, plugin-api, incremental-builds, content-types
- **parcel**: zero-config, asset-graph, transformers, packagers, caching, scope-hoisting, parcel2-architecture, code-splitting
- **turbopack**: rust-architecture, incremental-computation, nextjs-integration, turbopack-vs-webpack, turbopack-vs-vite, dev-mode, function-level-hmr
- **rspack**: webpack-compatibility, rust-performance, loader-support, plugin-support, migration-from-webpack, module-federation, build-performance
- **rolldown**: rollup-replacement, rust-performance, vite-integration, compatibility-goals, plugin-compatibility, oxc-integration, build-performance

Each answer should be 3–6 sentences, technically accurate. Code examples should be real config snippets or code where relevant. Follow-up questions should probe deeper. Key takeaways should be one concise sentence.

**Step 3: Verify the file compiles**

Run: `npx tsc --noEmit src/data/bundlerInterviewQuestions.ts 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add src/data/bundlerInterviewQuestions.ts
git commit -m "feat(interview): add bundler interview questions data file"
```

---

### Task 2: Create the Bundlers Interview Page (Server Component)

**Files:**
- Create: `src/app/interview/bundlers/page.tsx`

**Step 1: Create the server component**

Follow the exact pattern from `src/app/interview/react/page.tsx`:

```typescript
// src/app/interview/bundlers/page.tsx
import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb'
import { StructuredData } from '@/components/StructuredData'
import BundlersInterviewClient from './BundlersInterviewClient'

export const metadata: Metadata = {
  title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
  description:
    'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown. Organized by bundler and difficulty.',
  keywords:
    'bundler interview questions, webpack interview, vite interview, rollup interview, esbuild interview, parcel interview, turbopack interview, rspack interview, frontend interview, build tools interview',
  openGraph: {
    title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
    description:
      'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown.',
    url: 'https://jsinterview.dev/interview/bundlers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bundler Interview Questions - Webpack, Vite, Rollup & More',
    description:
      'Master bundler interviews with curated questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown.',
  },
  alternates: {
    canonical: '/interview/bundlers',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Interview', path: '/interview' },
  { name: 'Bundlers' },
])

export default function BundlersInterviewPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <BundlersInterviewClient />
    </>
  )
}
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors (will fail until Task 3 creates BundlersInterviewClient — that's OK)

---

### Task 3: Create the Client Component

**Files:**
- Create: `src/app/interview/bundlers/BundlersInterviewClient.tsx`
- Create: `src/app/interview/bundlers/BundlersInterviewClient.module.css`

**Step 1: Create the CSS module**

Copy exactly from `src/app/interview/react/ReactInterviewClient.module.css`:

```css
/* src/app/interview/bundlers/BundlersInterviewClient.module.css */
.header {
  margin-bottom: var(--spacing-sm);
}

.title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.subtitle {
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
}

.questionsGrid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.emptyState {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
```

**Step 2: Create the client component**

Follow the exact pattern from `src/app/interview/react/ReactInterviewClient.tsx`:

```typescript
// src/app/interview/bundlers/BundlersInterviewClient.tsx
'use client'

import { useState, useMemo } from 'react'
import { NavBar } from '@/components/NavBar'
import { InterviewFilterBar } from '@/components/InterviewFilterBar'
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard'
import {
  bundlerInterviewQuestions,
  bundlerTopics,
  bundlerTopicMap,
  filterBundlerQuestions,
} from '@/data/bundlerInterviewQuestions'
import styles from './BundlersInterviewClient.module.css'

export default function BundlersInterviewClient() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [topic, setTopic] = useState<string>('all')

  const filtered = useMemo(
    () => filterBundlerQuestions(bundlerInterviewQuestions, difficulty, topic),
    [difficulty, topic],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar
        breadcrumbs={[
          { label: 'Interview', path: '/interview' },
          { label: 'Bundlers' },
        ]}
      />

      <main className="flex-1 p-8 container-default mx-auto w-full max-md:p-6">
        <div className={styles.header}>
          <h1 className={styles.title}>Bundler Interview Prep</h1>
          <p className={styles.subtitle}>
            {bundlerInterviewQuestions.length} questions across Webpack, Vite, Rollup, esbuild, Parcel, and more
          </p>
        </div>

        <InterviewFilterBar
          difficulty={difficulty}
          topic={topic}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          topics={bundlerTopics}
          totalCount={bundlerInterviewQuestions.length}
          filteredCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className={styles.questionsGrid}>
            {filtered.map((q) => (
              <InterviewQuestionCard key={q.id} question={q} topicMap={bundlerTopicMap} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No questions match the selected filters.
          </div>
        )}
      </main>
    </div>
  )
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/interview/bundlers/
git commit -m "feat(interview): add bundlers interview page and client component"
```

---

### Task 4: Update InterviewLanding, ConceptIcon, and Sitemap

**Files:**
- Modify: `src/app/interview/InterviewLanding.tsx`
- Modify: `src/components/Icons/ConceptIcon.tsx`
- Modify: `src/app/sitemap.ts`

**Step 1: Add bundlers card to InterviewLanding**

In `src/app/interview/InterviewLanding.tsx`:

1. Add import: `import { bundlerInterviewQuestions } from '@/data/bundlerInterviewQuestions'`
2. Add a new `<Link>` card after the React card in the grid:

```tsx
<Link href="/interview/bundlers" className={styles.topicCard}>
  <div className={styles.topicName}>Bundlers</div>
  <div className={styles.topicDescription}>
    Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, Rolldown, and common bundling concepts
  </div>
  <div className={styles.topicCount}>
    {bundlerInterviewQuestions.length} questions
  </div>
</Link>
```

**Step 2: Add bundlers icon to ConceptIcon**

In `src/components/Icons/ConceptIcon.tsx`, find the interview categories section (after `'react': Component,`) and add:

```typescript
  'bundlers': Package,
```

`Package` is already imported (line 8 of the file).

**Step 3: Add /interview/bundlers to sitemap**

In `src/app/sitemap.ts`, add after the `/interview/react` entry (line 83):

```typescript
    {
      url: `${BASE_URL}/interview/bundlers`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

**Step 5: Commit**

```bash
git add src/app/interview/InterviewLanding.tsx src/components/Icons/ConceptIcon.tsx src/app/sitemap.ts
git commit -m "feat(interview): add bundlers to landing page, sitemap, and icon map"
```

---

### Task 5: Update Homepage — Import, Count, FAQ, and Interview Card

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add bundler imports**

At the top of `src/app/page.tsx`, after the react import line (line 15), add:

```typescript
import { bundlerInterviewQuestions, bundlerTopics } from '@/data/bundlerInterviewQuestions'
```

**Step 2: Update totalInterviewQuestions**

Change line 24 from:
```typescript
const totalInterviewQuestions = htmlInterviewQuestions.length + cssInterviewQuestions.length + jsInterviewQuestions.length + reactInterviewQuestions.length
```
to:
```typescript
const totalInterviewQuestions = htmlInterviewQuestions.length + cssInterviewQuestions.length + jsInterviewQuestions.length + reactInterviewQuestions.length + bundlerInterviewQuestions.length
```

**Step 3: Update FAQ schema text**

In the FAQ schema (around lines 43-51), update the answer for "What topics are covered" to mention Bundlers:
- Change `"HTML, CSS, JavaScript, and React"` references to include `", and Bundlers"`
- Add bundler question count: `plus ${bundlerInterviewQuestions.length} Bundler questions covering Webpack, Vite, Rollup, esbuild, and more`

In the third FAQ question (line 48), update:
- Title: `'Does JS Interview Prep have HTML, CSS, JavaScript, React, and Bundler interview questions?'`
- Answer: Add `${bundlerInterviewQuestions.length} Bundler questions covering Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, and Rolldown`

**Step 4: Update interview grid to 5 columns**

Change the interview section grid (line 321) from:
```html
<div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 items-stretch">
```
to:
```html
<div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 items-stretch">
```

**Step 5: Add bundlers interview card**

After the React interview card `</Link>` (after line 380), add:

```tsx
<Link href="/interview/bundlers" className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-200 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] h-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none">
  <div className="bg-bg-page-secondary rounded-xl p-6 flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between">
      <span className="flex items-center justify-center text-brand-primary">
        <ConceptIcon conceptId="bundlers" size={28} />
      </span>
      <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{bundlerInterviewQuestions.length} questions</span>
    </div>
    <h3 className="text-xl font-bold text-text-bright m-0">Bundler Interview Questions</h3>
    <p className="text-base text-text-secondary m-0 leading-normal flex-1">
      {bundlerTopics.map(t => t.label).join(', ')}
    </p>
  </div>
</Link>
```

**Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

**Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(interview): add bundlers to homepage interview section and FAQ"
```

---

### Task 6: Build, Lint, Update Snapshots, and Final Commit

**Files:**
- No new files — verification only

**Step 1: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds. If stale `.next` cache causes issues, run `rm -rf .next && npm run build`.

**Step 3: Update visual snapshots**

Run: `npm test -- --update-snapshots`
Expected: Snapshots updated (homepage height changes from adding 5th card)

**Step 4: Commit snapshots if changed**

```bash
git add -A
git commit -m "chore: update visual snapshots for bundler interview page"
```

**Step 5: Push**

```bash
git push
```
