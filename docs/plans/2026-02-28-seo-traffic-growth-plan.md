# SEO & Organic Traffic Growth — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Maximize organic search traffic from 1,844 existing pages through long-tail keyword targeting, cross-linking, topic hub pages, and content freshness signals.

**Architecture:** Programmatic SEO changes across metadata templates, a new ConceptFooterLinks component for internal linking, a new `/topics/[topicId]` route for pillar pages generated from `src/data/topicHubs.ts`, and a `/updates` changelog page. All content is auto-generated from existing data.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS with token system, existing Zustand stores and data files.

**Design doc:** `docs/plans/2026-02-28-seo-traffic-growth-design.md`

---

### Task 1: Fix Stale Sitemap Timestamps + Priority Tuning

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Update timestamp to build-time**

Replace the hardcoded date with a build-time `new Date()`:

```typescript
// Before (line 17):
export const CONTENT_LAST_UPDATED = new Date('2026-02-22')

// After:
export const CONTENT_LAST_UPDATED = new Date()
```

**Step 2: Tune priorities**

Update priority values throughout the file:

| Page type | Old priority | New priority |
|-----------|-------------|-------------|
| Static hub pages (/concepts, /concepts/js, /concepts/dsa) | 0.9 | 0.9 (keep) |
| Individual concept pages | 0.8 | 0.8 (keep) |
| Category pages | 0.8 | 0.7 |
| DSA subcategory pages | 0.7 | 0.7 (keep) |
| Problem practice pages | 0.7 | 0.6 |
| Concept visualization pages | 0.7 | 0.5 |

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "fix(seo): use build-time sitemap timestamps and tune page priorities"
```

---

### Task 2: Rewrite Metadata — JS Concept Pages

**Files:**
- Modify: `src/app/concepts/js/[conceptId]/page.tsx` (lines 21-33 in `generateMetadata`)

**Step 1: Update generateMetadata return object**

Replace the current metadata return (lines 21-33) with:

```typescript
  const difficultyLabel = concept.difficulty.charAt(0).toUpperCase() + concept.difficulty.slice(1)
  const keyPointCount = concept.keyPoints.length
  const exampleCount = concept.examples.length

  return {
    title: `JavaScript ${concept.title} Explained — How ${concept.title} Works (Visual Guide)`,
    description: `Learn ${concept.title} with ${keyPointCount} key concepts, ${exampleCount} interactive examples, and interview tips. ${difficultyLabel} level.`,
    keywords: `javascript ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, how ${concept.title.toLowerCase()} works, ${concept.title.toLowerCase()} interview question, javascript interview, frontend interview`,
    openGraph: {
      title: `JavaScript ${concept.title} — Visual Guide`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/js/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/js/${concept.id}`,
    },
  }
```

**Step 2: Add LearningResource schema**

Add this function after the existing `generateArticleSchema` function:

```typescript
function generateLearningResourceSchema(concept: NonNullable<ReturnType<typeof getConceptById>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `JavaScript ${concept.title}`,
    description: concept.description,
    educationalLevel: concept.difficulty,
    teaches: `${concept.title} in JavaScript`,
    timeRequired: concept.estimatedReadTime ? `PT${concept.estimatedReadTime}M` : 'PT10M',
    learningResourceType: 'interactive visualization',
    inLanguage: 'en',
    provider: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
  }
}
```

Then render it in the page component alongside the existing structured data:

```tsx
const learningResourceSchema = generateLearningResourceSchema(concept)

// Add to the JSX:
<StructuredData data={learningResourceSchema} />
```

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`
Expected: Build passes.

**Step 4: Commit**

```bash
git add "src/app/concepts/js/[conceptId]/page.tsx"
git commit -m "feat(seo): optimize JS concept metadata for long-tail keywords and add LearningResource schema"
```

---

### Task 3: Rewrite Metadata — DSA Concept Pages

**Files:**
- Modify: `src/app/concepts/dsa/[conceptId]/page.tsx` (lines 21-33 in `generateMetadata`)

**Step 1: Update generateMetadata return object**

Replace lines 21-33 with:

```typescript
  const difficultyLabel = concept.difficulty.charAt(0).toUpperCase() + concept.difficulty.slice(1)
  const keyPointCount = concept.keyPoints.length
  const exampleCount = concept.examples.length

  return {
    title: `${concept.title} in JavaScript — Data Structure Guide with Visualizations`,
    description: `Learn ${concept.title} with ${keyPointCount} key concepts, ${exampleCount} code examples, and complexity analysis. ${difficultyLabel} level.`,
    keywords: `${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} javascript, data structures ${concept.title.toLowerCase()}, ${concept.title.toLowerCase()} explained, coding interview, dsa`,
    openGraph: {
      title: `${concept.title} — DSA Visual Guide`,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/dsa/${concept.id}`,
    },
    alternates: {
      canonical: `/concepts/dsa/${concept.id}`,
    },
  }
```

**Step 2: Add LearningResource schema**

Same pattern as Task 2 — add `generateLearningResourceSchema` function and render it. Import `DSAConcept` type:

```typescript
function generateLearningResourceSchema(concept: NonNullable<ReturnType<typeof getDSAConceptById>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: concept.title,
    description: concept.description,
    educationalLevel: concept.difficulty,
    teaches: concept.title,
    timeRequired: 'PT15M',
    learningResourceType: 'interactive visualization',
    inLanguage: 'en',
    provider: {
      '@type': 'Organization',
      name: 'JS Interview Prep',
      url: 'https://jsinterview.dev',
    },
  }
}
```

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 4: Commit**

```bash
git add "src/app/concepts/dsa/[conceptId]/page.tsx"
git commit -m "feat(seo): optimize DSA concept metadata for long-tail keywords and add LearningResource schema"
```

---

### Task 4: Rewrite Metadata — Problem Pages

**Files:**
- Modify: `src/app/[categoryId]/[problemId]/page.tsx` (lines 33-61 in `generateMetadata`)

**Step 1: Update generateMetadata return object**

Replace lines 43-61 with:

```typescript
  const difficultyLabel = problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)
  const patternInfo = problem.patternName ? ` using ${problem.patternName} pattern` : ''
  const complexityInfo = problem.timeComplexity ? ` Time: ${problem.timeComplexity}.` : ''

  const description = problem.approach
    ? `Solve ${problem.name} (${difficultyLabel})${patternInfo}. ${problem.approach.slice(0, 120)}${complexityInfo}`
    : `${problem.description}. Practice with interactive code visualization, step-by-step execution, and call stack analysis.`

  return {
    title: `${problem.name} — ${difficultyLabel} JavaScript Solution (Step-by-Step) | JS Interview Prep`,
    description,
    keywords: `${problem.name.toLowerCase()}, ${problem.name.toLowerCase()} javascript solution, ${category?.name.toLowerCase() || ''}, coding interview, ${problem.difficulty} difficulty${problem.patternName ? `, ${problem.patternName.toLowerCase()}` : ''}`,
    openGraph: {
      title: `${problem.name} — ${difficultyLabel} JavaScript Solution`,
      description: problem.approach || problem.description,
      url: `https://jsinterview.dev/${params.categoryId}/${params.problemId}`,
    },
    alternates: {
      canonical: `/${params.categoryId}/${params.problemId}`,
    },
  }
```

**Step 2: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 3: Commit**

```bash
git add "src/app/[categoryId]/[problemId]/page.tsx"
git commit -m "feat(seo): optimize problem page metadata for long-tail keywords"
```

---

### Task 5: Rewrite Metadata — Category Pages + Home Page

**Files:**
- Modify: `src/app/[categoryId]/page.tsx` (lines 39-51 in `generateMetadata`)
- Modify: `src/app/page.tsx` (H1 text and home metadata in layout)

**Step 1: Update category page generateMetadata**

Replace lines 39-51 with:

```typescript
  const problems = getExamplesByCategory(params.categoryId)
  const problemCount = problems.length
  const easyCount = problems.filter(p => p.difficulty === 'easy').length
  const medCount = problems.filter(p => p.difficulty === 'medium').length
  const hardCount = problems.filter(p => p.difficulty === 'hard').length

  const isDsa = params.categoryId === 'dsa'
  const isSubcategory = isDsaSubcategory(params.categoryId)
  const titlePrefix = isDsa ? 'DSA Problems' : category.name

  return {
    title: `${titlePrefix} — ${problemCount} JavaScript Practice Problems with Visual Explanations`,
    description: `${problemCount} ${titlePrefix} problems (${easyCount} easy, ${medCount} medium, ${hardCount} hard). Practice with step-by-step execution visualization.`,
    keywords: `${category.name.toLowerCase()}, javascript ${category.name.toLowerCase()} practice, ${category.name.toLowerCase()} interview questions, coding interview, ${isDsa || isSubcategory ? 'data structures algorithms leetcode' : 'javascript practice'}`,
    openGraph: {
      title: `${titlePrefix} — JavaScript Practice Problems`,
      description: `${category.longDescription || category.description}. ${problemCount} problems with visualization.`,
      url: `https://jsinterview.dev/${category.id}`,
    },
    alternates: {
      canonical: `/${category.id}`,
    },
  }
```

Note: `getExamplesByCategory` is already imported. The `problems` local replaces the existing `problemCount` local on line 33.

**Step 2: Update home page H1**

In `src/app/page.tsx`, find the main H1 heading and change it from:

```
Master JavaScript with Interactive Visualizations
```

To:

```
JavaScript Interview Prep — Interactive Visualizations & {totalProblems}+ Practice Problems
```

Where `totalProblems` is the existing dynamic count already computed on that page.

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 4: Commit**

```bash
git add "src/app/[categoryId]/page.tsx" src/app/page.tsx
git commit -m "feat(seo): optimize category and home page metadata for long-tail keywords"
```

---

### Task 6: Build ConceptFooterLinks Component

**Files:**
- Create: `src/components/ConceptFooterLinks/ConceptFooterLinks.tsx`
- Create: `src/components/ConceptFooterLinks/index.ts`
- Modify: `src/components/index.ts` (add re-export)

**Step 1: Create the component**

Create `src/components/ConceptFooterLinks/ConceptFooterLinks.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Concept } from '@/data/concepts'
import { concepts } from '@/data/concepts'
import { codeExamples } from '@/data/examples'
import { DifficultyIndicator } from '@/components/DifficultyIndicator'

interface ConceptFooterLinksProps {
  prerequisites?: string[]
  nextConcepts?: string[]
  relatedProblems?: string[]
  conceptType: 'js' | 'dsa'
}

export function ConceptFooterLinks({
  prerequisites,
  nextConcepts,
  relatedProblems,
  conceptType,
}: ConceptFooterLinksProps) {
  const prereqConcepts = (prerequisites || [])
    .map(id => concepts.find(c => c.id === id))
    .filter((c): c is Concept => c !== undefined)

  const nextConceptsList = (nextConcepts || [])
    .map(id => concepts.find(c => c.id === id))
    .filter((c): c is Concept => c !== undefined)

  const problems = (relatedProblems || [])
    .map(id => codeExamples.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 6)

  const hasContent = prereqConcepts.length > 0 || nextConceptsList.length > 0 || problems.length > 0

  if (!hasContent) return null

  const conceptBasePath = conceptType === 'js' ? '/concepts/js' : '/concepts/dsa'

  return (
    <nav aria-label="Related content" className="mt-8 space-y-8 border-t border-border-card pt-8">
      {prereqConcepts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-bright mb-4">Prerequisites</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prereqConcepts.map(c => (
              <Link
                key={c.id}
                href={`${conceptBasePath}/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-card bg-surface-card no-underline text-inherit transition-all duration-150 hover:border-brand-primary-30 hover:bg-white-5"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-text-bright block truncate">{c.title}</span>
                  <span className="text-xs text-text-muted block truncate">{c.shortDescription}</span>
                </div>
                <ChevronRight size={14} className="text-text-muted shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {nextConceptsList.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-bright mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {nextConceptsList.map(c => (
              <Link
                key={c.id}
                href={`${conceptBasePath}/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-card bg-surface-card no-underline text-inherit transition-all duration-150 hover:border-brand-primary-30 hover:bg-white-5"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-text-bright block truncate">{c.title}</span>
                  <span className="text-xs text-text-muted block truncate">{c.shortDescription}</span>
                </div>
                <ChevronRight size={14} className="text-text-muted shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {problems.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-bright mb-4">Practice These Problems</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map(problem => (
              <Link
                key={problem!.id}
                href={`/${problem!.category}/${problem!.id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border-card bg-surface-card no-underline text-inherit transition-all duration-150 hover:border-brand-primary-30 hover:bg-white-5"
              >
                <span className="text-sm font-medium text-text-bright truncate">{problem!.name}</span>
                <DifficultyIndicator level={problem!.difficulty} size="sm" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </nav>
  )
}
```

**Step 2: Create barrel export**

Create `src/components/ConceptFooterLinks/index.ts`:

```typescript
export { ConceptFooterLinks } from './ConceptFooterLinks'
```

**Step 3: Add re-export to components index**

Add to `src/components/index.ts`:

```typescript
export { ConceptFooterLinks } from './ConceptFooterLinks'
```

**Step 4: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 5: Commit**

```bash
git add src/components/ConceptFooterLinks/ src/components/index.ts
git commit -m "feat(seo): add ConceptFooterLinks component for internal cross-linking"
```

---

### Task 7: Integrate ConceptFooterLinks into Concept Pages

**Files:**
- Modify: `src/app/concepts/js/[conceptId]/ConceptPageClient.tsx`
- Modify: `src/app/concepts/dsa/[conceptId]/DSAConceptPageClient.tsx`

**Step 1: Add to JS concept page**

In `ConceptPageClient.tsx`, import and render at the bottom of the page (just before the closing `</main>` tag):

```tsx
import { ConceptFooterLinks } from '@/components/ConceptFooterLinks'

// Inside the component, after all existing sections but before </main>:
<ConceptFooterLinks
  prerequisites={concept.prerequisites}
  nextConcepts={concept.nextConcepts}
  relatedProblems={concept.relatedProblems}
  conceptType="js"
/>
```

Note: The concept object is already available in the component — check where it's accessed (likely via the concepts data import). Make sure `concept` variable is in scope at the insertion point.

**Step 2: Add to DSA concept page**

In `DSAConceptPageClient.tsx`, same pattern:

```tsx
import { ConceptFooterLinks } from '@/components/ConceptFooterLinks'

// At the bottom before </main>:
<ConceptFooterLinks
  relatedProblems={concept.relatedProblems}
  conceptType="dsa"
/>
```

Note: DSAConcept type doesn't have `prerequisites` or `nextConcepts` fields, so only pass `relatedProblems`.

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`

Run: `npm run dev` and check `/concepts/js/closures` to see cross-links rendered.

**Step 4: Commit**

```bash
git add "src/app/concepts/js/[conceptId]/ConceptPageClient.tsx" "src/app/concepts/dsa/[conceptId]/DSAConceptPageClient.tsx"
git commit -m "feat(seo): render cross-links on concept pages for internal linking"
```

---

### Task 8: Create Topic Hub Data File

**Files:**
- Create: `src/data/topicHubs.ts`

**Step 1: Create the data file**

```typescript
export interface TopicHub {
  id: string
  name: string
  type: 'js' | 'dsa'
  primaryConceptId: string
  relatedConceptIds: string[]
  relatedProblemIds: string[]
  targetKeywords: string[]
  h1Template: string
  metaDescriptionTemplate: string
}

export const topicHubs: TopicHub[] = [
  // === JS Topics ===
  {
    id: 'closures',
    name: 'JavaScript Closures',
    type: 'js',
    primaryConceptId: 'closures',
    relatedConceptIds: ['scope-chain', 'scope-basics', 'lexical-scope', 'closure-definition', 'closure-practical-uses', 'closure-in-loops', 'closure-memory', 'closure-patterns', 'module-pattern'],
    relatedProblemIds: ['closure-counter', 'create-counter', 'once-function', 'memoize'],
    targetKeywords: ['javascript closures', 'closures explained', 'how closures work', 'closure interview question'],
    h1Template: 'JavaScript Closures — Complete Guide with Interactive Visualizations',
    metaDescriptionTemplate: 'Master JavaScript closures with {conceptCount} concepts, {problemCount} practice problems, and step-by-step visual explanations. From beginner to advanced.',
  },
  {
    id: 'event-loop',
    name: 'JavaScript Event Loop',
    type: 'js',
    primaryConceptId: 'event-loop',
    relatedConceptIds: ['call-stack-basics', 'web-apis-overview', 'task-queue-macrotasks', 'microtask-queue', 'event-loop-tick', 'event-loop-priority', 'nodejs-event-loop', 'promises'],
    relatedProblemIds: ['promise-resolve-order', 'settimeout-order', 'promise-all'],
    targetKeywords: ['javascript event loop', 'event loop explained', 'how event loop works', 'microtask vs macrotask'],
    h1Template: 'JavaScript Event Loop — How It Works (Visual Step-by-Step)',
    metaDescriptionTemplate: 'Understand the JavaScript event loop with {conceptCount} concepts, interactive visualizations, and {problemCount} practice problems.',
  },
  {
    id: 'promises',
    name: 'JavaScript Promises',
    type: 'js',
    primaryConceptId: 'promises',
    relatedConceptIds: ['promises-deep-dive', 'promises-creation', 'promise-chaining', 'promises-then-catch', 'promise-static-methods', 'async-await-basics', 'async-await-parallel', 'async-await-error-handling'],
    relatedProblemIds: ['implement-promise', 'promise-all', 'promise-race', 'promise-any', 'promise-allsettled', 'async-retry'],
    targetKeywords: ['javascript promises', 'promises explained', 'async await', 'promise interview questions'],
    h1Template: 'JavaScript Promises & Async/Await — Complete Visual Guide',
    metaDescriptionTemplate: 'Master JavaScript promises and async/await with {conceptCount} concepts, {problemCount} practice problems, and real-time execution visualization.',
  },
  {
    id: 'prototypes',
    name: 'JavaScript Prototypes',
    type: 'js',
    primaryConceptId: 'prototypes',
    relatedConceptIds: ['prototype-chain-basics', 'property-lookup', 'class-syntax-sugar', 'instanceof-operator', 'object-create', 'prototype-pollution', 'prototype-inheritance'],
    relatedProblemIds: ['prototype-chain', 'implement-instanceof', 'implement-new'],
    targetKeywords: ['javascript prototypes', 'prototype chain', 'prototypal inheritance', 'class vs prototype'],
    h1Template: 'JavaScript Prototypes — Prototype Chain & Inheritance Explained',
    metaDescriptionTemplate: 'Understand JavaScript prototypes with {conceptCount} visual concepts, {problemCount} coding challenges, and interview tips.',
  },
  {
    id: 'hoisting',
    name: 'JavaScript Hoisting',
    type: 'js',
    primaryConceptId: 'hoisting',
    relatedConceptIds: ['hoisting-variables', 'hoisting-functions', 'temporal-dead-zone', 'scope-basics', 'lexical-scope'],
    relatedProblemIds: [],
    targetKeywords: ['javascript hoisting', 'hoisting explained', 'var let const hoisting', 'temporal dead zone'],
    h1Template: 'JavaScript Hoisting — var, let, const & Function Hoisting Explained',
    metaDescriptionTemplate: 'Learn JavaScript hoisting with {conceptCount} visual concepts covering var, let, const, function declarations, and the temporal dead zone.',
  },
  {
    id: 'this-keyword',
    name: 'JavaScript this Keyword',
    type: 'js',
    primaryConceptId: 'this-keyword',
    relatedConceptIds: ['closures', 'scope-chain'],
    relatedProblemIds: ['this-binding', 'implement-bind', 'implement-call', 'implement-apply'],
    targetKeywords: ['javascript this keyword', 'this explained', 'bind call apply', 'this in arrow functions'],
    h1Template: 'JavaScript this Keyword — How this Works in Every Context',
    metaDescriptionTemplate: 'Master the JavaScript this keyword with visual explanations, {problemCount} coding challenges including bind/call/apply, and interview tips.',
  },
  {
    id: 'scope-chain',
    name: 'JavaScript Scope',
    type: 'js',
    primaryConceptId: 'scope-chain',
    relatedConceptIds: ['scope-basics', 'lexical-scope', 'closures', 'hoisting'],
    relatedProblemIds: [],
    targetKeywords: ['javascript scope', 'scope chain', 'lexical scope', 'block scope vs function scope'],
    h1Template: 'JavaScript Scope — Scope Chain, Lexical Scope & Block Scope',
    metaDescriptionTemplate: 'Understand JavaScript scope with {conceptCount} visual concepts covering scope chain, lexical scope, block scope, and closures.',
  },
  {
    id: 'type-coercion',
    name: 'JavaScript Type Coercion',
    type: 'js',
    primaryConceptId: 'type-coercion',
    relatedConceptIds: ['implicit-coercion-rules', 'coercion-edge-cases', 'data-types'],
    relatedProblemIds: [],
    targetKeywords: ['javascript type coercion', 'implicit coercion', '== vs ===', 'type conversion'],
    h1Template: 'JavaScript Type Coercion — Implicit vs Explicit Conversion Explained',
    metaDescriptionTemplate: 'Master JavaScript type coercion with {conceptCount} visual concepts, edge cases, and interview questions about == vs ===.',
  },
  {
    id: 'memory-model',
    name: 'JavaScript Memory Model',
    type: 'js',
    primaryConceptId: 'memory-model',
    relatedConceptIds: ['garbage-collection', 'v8-engine', 'closure-memory', 'values-and-memory'],
    relatedProblemIds: [],
    targetKeywords: ['javascript memory', 'memory management', 'garbage collection', 'memory leaks'],
    h1Template: 'JavaScript Memory Model — How Memory Works & Common Leaks',
    metaDescriptionTemplate: 'Understand JavaScript memory management with {conceptCount} visual concepts covering heap, stack, garbage collection, and memory leak prevention.',
  },
  {
    id: 'async-await',
    name: 'JavaScript Async/Await',
    type: 'js',
    primaryConceptId: 'async-await-basics',
    relatedConceptIds: ['async-await-parallel', 'async-await-error-handling', 'promises', 'promises-deep-dive', 'event-loop'],
    relatedProblemIds: ['async-retry', 'promise-all', 'sleep-function', 'throttle', 'debounce'],
    targetKeywords: ['javascript async await', 'async await explained', 'async await error handling', 'async patterns'],
    h1Template: 'JavaScript Async/Await — From Basics to Advanced Patterns',
    metaDescriptionTemplate: 'Master async/await with {conceptCount} concepts, {problemCount} practice problems, and visual explanations of parallel execution and error handling.',
  },

  // === DSA Topics ===
  {
    id: 'two-pointers',
    name: 'Two Pointers Pattern',
    type: 'dsa',
    primaryConceptId: 'two-pointers',
    relatedConceptIds: [],
    relatedProblemIds: ['two-sum-ii', 'three-sum', 'container-with-most-water', 'valid-palindrome', 'remove-duplicates-sorted'],
    targetKeywords: ['two pointers algorithm', 'two pointer technique', 'two pointers leetcode', 'two pointers pattern'],
    h1Template: 'Two Pointers Pattern — Algorithm Technique with Visual Examples',
    metaDescriptionTemplate: 'Master the Two Pointers pattern with {problemCount} JavaScript practice problems, visual step-by-step walkthroughs, and complexity analysis.',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    type: 'dsa',
    primaryConceptId: 'binary-search',
    relatedConceptIds: [],
    relatedProblemIds: ['binary-search', 'search-insert-position', 'find-minimum-rotated', 'search-rotated-sorted'],
    targetKeywords: ['binary search algorithm', 'binary search javascript', 'binary search explained', 'binary search leetcode'],
    h1Template: 'Binary Search — Algorithm Explained with JavaScript Visualizations',
    metaDescriptionTemplate: 'Learn binary search with {problemCount} JavaScript problems, visual walkthroughs, and complexity analysis. From basic to rotated array variants.',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window Pattern',
    type: 'dsa',
    primaryConceptId: 'sliding-window',
    relatedConceptIds: [],
    relatedProblemIds: ['max-subarray-sum-k', 'longest-substring-no-repeat', 'minimum-window-substring'],
    targetKeywords: ['sliding window algorithm', 'sliding window technique', 'sliding window leetcode', 'sliding window pattern'],
    h1Template: 'Sliding Window Pattern — Algorithm with Visual Step-by-Step',
    metaDescriptionTemplate: 'Master the Sliding Window pattern with {problemCount} JavaScript problems, visual animations, and time complexity analysis.',
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    type: 'dsa',
    primaryConceptId: 'linked-lists',
    relatedConceptIds: [],
    relatedProblemIds: ['reverse-linked-list', 'merge-two-sorted-lists', 'linked-list-cycle', 'remove-nth-from-end'],
    targetKeywords: ['linked list javascript', 'linked list data structure', 'linked list interview questions', 'singly linked list'],
    h1Template: 'Linked Lists — Data Structure Guide with JavaScript Visualizations',
    metaDescriptionTemplate: 'Master linked lists with {problemCount} JavaScript practice problems, visual node traversal, and complexity analysis.',
  },
  {
    id: 'arrays-dsa',
    name: 'Arrays & Hashing',
    type: 'dsa',
    primaryConceptId: 'arrays',
    relatedConceptIds: ['hash-tables'],
    relatedProblemIds: ['two-sum', 'contains-duplicate', 'valid-anagram', 'group-anagrams', 'top-k-frequent'],
    targetKeywords: ['array algorithms', 'hash map problems', 'arrays hashing leetcode', 'array interview questions'],
    h1Template: 'Arrays & Hashing — Data Structures with JavaScript Visualizations',
    metaDescriptionTemplate: 'Master arrays and hash maps with {problemCount} JavaScript problems, visual hash table walkthroughs, and complexity analysis.',
  },
]

export function getTopicHub(topicId: string): TopicHub | undefined {
  return topicHubs.find(t => t.id === topicId)
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: No type errors.

**Step 3: Commit**

```bash
git add src/data/topicHubs.ts
git commit -m "feat(seo): add topic hub data for 15 pillar page topics"
```

---

### Task 9: Create Topic Hub Page Route

**Files:**
- Create: `src/app/topics/[topicId]/page.tsx`

**Step 1: Create the page**

This page is a server component that:
1. Looks up the topic hub from `topicHubs.ts`
2. Resolves the primary concept from `concepts.ts` or `dsaConcepts.ts`
3. Resolves related concepts and problems
4. Generates comprehensive metadata and structured data
5. Renders a full pillar page

The page should follow existing patterns (see `src/app/concepts/js/[conceptId]/page.tsx` for metadata/schema patterns and `src/app/concepts/dsa/DSAConceptsClient.tsx` for card grid patterns).

Key elements:
- `generateStaticParams()` from `topicHubs`
- `generateMetadata()` using the hub's templates with interpolated counts
- Course + ItemList + BreadcrumbList + FAQPage schemas
- Hero section with h1, difficulty, time estimate
- Key points section
- Related concepts grid (using Card or Link components)
- Practice problems grid (using ProblemCard or similar)
- Common mistakes section (if available)
- ConceptFooterLinks at the bottom

Note: The implementer should check which existing components can be reused (Card, ProblemCard, etc.) and follow the established styling patterns.

**Step 2: Verify**

Run: `npm run build 2>&1 | grep "topics"`
Expected: Topic pages appear in the build output.

**Step 3: Commit**

```bash
git add "src/app/topics/[topicId]/page.tsx"
git commit -m "feat(seo): add topic hub pillar pages for topical authority"
```

---

### Task 10: Create Topic Hub OG Image

**Files:**
- Create: `src/app/topics/[topicId]/opengraph-image.tsx`

**Step 1: Create the OG image generator**

Follow the pattern from `src/app/[categoryId]/opengraph-image.tsx`. The OG image should show:
- Topic name as the title
- Number of concepts and problems
- "Complete Visual Guide" tagline
- Brand colors

**Step 2: Verify**

Run: `npm run build 2>&1 | grep "topics"`

**Step 3: Commit**

```bash
git add "src/app/topics/[topicId]/opengraph-image.tsx"
git commit -m "feat(seo): add dynamic OG images for topic hub pages"
```

---

### Task 11: Add Topic Hubs to Sitemap + Nav

**Files:**
- Modify: `src/app/sitemap.ts` (add topic hub entries)
- Modify: `src/components/NavBar/NavBar.tsx` (optional: add Topics link)

**Step 1: Add topic hubs to sitemap**

In `src/app/sitemap.ts`, import `topicHubs` and add a new section:

```typescript
import { topicHubs } from '@/data/topicHubs'

// Add after dsaPatternPages:
const topicHubPages: MetadataRoute.Sitemap = topicHubs.map((hub) => ({
  url: `${BASE_URL}/topics/${hub.id}`,
  lastModified: CONTENT_LAST_UPDATED,
  changeFrequency: 'weekly' as const,
  priority: 0.9,
}))
```

Add `...topicHubPages` to the return array.

**Step 2: Optionally add to nav**

Add a "Topics" link to the NavBar if desired. This is optional — the implementer should check the existing nav structure.

**Step 3: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 4: Commit**

```bash
git add src/app/sitemap.ts src/components/NavBar/NavBar.tsx
git commit -m "feat(seo): add topic hubs to sitemap with high priority"
```

---

### Task 12: Create Changelog Data + Page

**Files:**
- Create: `src/data/changelog.ts`
- Create: `src/app/updates/page.tsx`

**Step 1: Create changelog data file**

```typescript
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
    title: 'Launched jsinterview.dev with 88 JS concepts, 14 DSA concepts, and 275 practice problems',
    type: 'added',
    links: [
      { label: 'Browse All Concepts', href: '/concepts' },
      { label: 'Practice Problems', href: '/js-problems' },
      { label: 'Interview Prep', href: '/interview' },
    ],
  },
]
```

**Step 2: Create the updates page**

Create `src/app/updates/page.tsx` as a server component with:
- `generateMetadata()` with title "Updates & Changelog | JS Interview Prep"
- BreadcrumbList schema
- A simple chronological list of changelog entries with links
- Follow existing page patterns (NavBar, footer, etc.)

**Step 3: Add updates page to sitemap**

Add to the static pages array in `src/app/sitemap.ts`:

```typescript
{
  url: `${BASE_URL}/updates`,
  lastModified: CONTENT_LAST_UPDATED,
  changeFrequency: 'weekly',
  priority: 0.5,
},
```

**Step 4: Verify**

Run: `npm run build 2>&1 | grep "updates"`

**Step 5: Commit**

```bash
git add src/data/changelog.ts src/app/updates/page.tsx src/app/sitemap.ts
git commit -m "feat(seo): add changelog page for content freshness signals"
```

---

### Task 13: Make "Last Updated" Visible on Concept Pages

**Files:**
- Modify: `src/app/concepts/js/[conceptId]/page.tsx`
- Modify: `src/app/concepts/dsa/[conceptId]/page.tsx`

**Step 1: Make the existing sr-only date visible**

Both files already have a `<time>` element wrapped in `<div className="sr-only">`. Change from `sr-only` to visible:

```tsx
// Before:
<div className="sr-only">
  <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Updated {formattedDate}</time>
</div>

// After:
<div className="text-center py-4 text-sm text-text-muted">
  <time dateTime={CONTENT_LAST_UPDATED.toISOString()}>Last updated {formattedDate}</time>
</div>
```

**Step 2: Verify**

Run: `npm run build 2>&1 | tail -5`

**Step 3: Commit**

```bash
git add "src/app/concepts/js/[conceptId]/page.tsx" "src/app/concepts/dsa/[conceptId]/page.tsx"
git commit -m "feat(seo): make last-updated dates visible on concept pages"
```

---

### Task 14: Final Verification

**Step 1: Full build**

Run: `npm run build 2>&1 | tail -20`

Expected: Build passes, topic hub pages appear in output, total page count increases.

**Step 2: Lint**

Run: `npm run lint`

Expected: No errors.

**Step 3: Spot-check schema**

Start dev server and check a few pages for correct structured data:
- `/concepts/js/closures` — should have FAQPage + Article + LearningResource + Breadcrumb
- `/topics/closures` — should have Course + ItemList + FAQPage + Breadcrumb
- `/updates` — should have Breadcrumb

**Step 4: Spot-check cross-links**

Check `/concepts/js/closures` — should show Prerequisites, Next Steps, and Practice Problems sections at the bottom.

**Step 5: Commit everything**

If any uncommitted changes remain from verification fixes.
