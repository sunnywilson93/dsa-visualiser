# Content Deepening Design — ROI-Ranked Roadmap

> Approved: 2026-03-10
> Goal: Maximize organic traffic by deepening existing concepts, adding new content domains, and introducing new content formats — prioritized by traffic ROI.

---

## Phase 1 — Quick Wins (Highest ROI, Lowest Effort)

### 1A. "X vs Y" Comparison Pages

**Route:** `/compare/[comparisonId]`
**Data file:** `src/data/comparisons.ts`

10 comparison pages ranked by search volume:

| ID | Title | Domain |
|----|-------|--------|
| `var-let-const` | var vs let vs const | JS |
| `debounce-vs-throttle` | Debounce vs Throttle | JS |
| `usememo-vs-usecallback` | useMemo vs useCallback | React |
| `equality-operators` | == vs === in JavaScript | JS |
| `promise-vs-async-await` | Promises vs async/await | JS |
| `map-vs-foreach` | map() vs forEach() | JS |
| `null-vs-undefined` | null vs undefined | JS |
| `call-apply-bind` | call vs apply vs bind | JS |
| `shallow-vs-deep-copy` | Shallow vs Deep Copy | JS |
| `react-memo-vs-usememo` | React.memo vs useMemo | React |

**Data model:**

```typescript
interface Comparison {
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

interface ComparisonItem {
  id: string
  title: string
  keyPoints: string[]
  codeExample: string
}

interface ComparisonDimension {
  dimension: string
  aspects: Record<string, string>
}
```

**Page structure:**
- Side-by-side comparison table
- Code examples for each side
- "When to use which" decision guide
- FAQ schema for rich snippets
- Links to full concept pages

### 1B. "Top N Questions" Aggregator Pages

**Route:** `/top-questions/[domain]`

3 pages:
- `/top-questions/javascript` — Top 50 JavaScript Interview Questions
- `/top-questions/react` — Top 30 React Interview Questions
- `/top-questions/dsa` — Top 30 DSA Questions for Frontend

Curates `commonQuestions` from existing concepts + `jsInterviewQuestions.ts`. Grouped by topic, difficulty filters. FAQPage schema for rich snippets.

### 1C. Cheat Sheets

- `/concepts/dsa/cheatsheet` — mirrors existing JS cheatsheet pattern
- `/concepts/react/cheatsheet` — same pattern

### 1D. FAQ Schema Enrichment

No new pages. Add `commonQuestions` to every concept lacking it (especially DSA and React). Enables FAQPage structured data on existing pages.

---

## Phase 2 — Deepen Existing Strengths

### 2A. Interactive DSA Visualizations

Add interactive visualization components to 10 DSA concept pages (priority order):

1. `arrays` — operation animator (insert, delete, shift, access)
2. `hash-tables` — hash function + collision resolution
3. `trees` — DFS/BFS traversal animator
4. `graphs` — BFS/DFS with visited-node highlighting
5. `linked-lists` — pointer manipulation (reverse, cycle detection)
6. `sorting-algorithms` — side-by-side sorting race
7. `stacks` — push/pop frame visualizer
8. `queues` — enqueue/dequeue with circular buffer
9. `heap` — insertion + heapify animation
10. `recursion` — call stack + recursion tree

Architecture: Follow React concepts pattern — `ssr: false` dynamic imports, components in `src/components/concepts/dsa/`.

### 2B. Dynamic Programming Expansion

New concept page in `dsaConcepts.ts`:
- `dynamic-programming` — memoization vs tabulation, DP classification, state transition diagrams

15-20 new problems: Fibonacci, Climbing Stairs, Coin Change, LCS, 0/1 Knapsack, House Robber, Unique Paths, Word Break, LIS, Edit Distance expansion, Max Product Subarray, Partition Equal Subset Sum, Target Sum, Decode Ways, Min Cost Climbing Stairs.

### 2C. Sliding Window Concept Page

New in `dsaConcepts.ts`:
- `sliding-window` — fixed vs variable window, expansion/contraction animation, template patterns
- Links to existing 10 sliding window problems

### 2D. React 19 Deep Dive

3 new pages under `/concepts/react/`:

| ID | Topic |
|----|-------|
| `react-19-hooks` | useActionState, useFormStatus, useOptimistic, use |
| `react-compiler` | React Compiler (auto-memoization) |
| `server-actions` | Server Actions (form handling without API routes) |

Each with interactive before/after visualizations.

### 2E. Async/Await Advanced Patterns

2 new pages under `/concepts/js/`:

| ID | Topic |
|----|-------|
| `async-patterns-advanced` | Race conditions, retry with backoff, AbortController |
| `async-error-boundaries` | Error propagation in async chains, graceful degradation |

---

## Phase 3 — New Domains

### 3A. JavaScript Design Patterns (`/concepts/js/`)

8 new concept pages with `subcategory: 'design-patterns'`:

| ID | Title | Difficulty |
|----|-------|------------|
| `design-pattern-module` | Module Pattern | Beginner |
| `design-pattern-singleton` | Singleton Pattern | Intermediate |
| `design-pattern-factory` | Factory Pattern | Intermediate |
| `design-pattern-observer` | Observer Pattern | Intermediate |
| `design-pattern-strategy` | Strategy Pattern | Intermediate |
| `design-pattern-decorator` | Decorator Pattern | Advanced |
| `design-pattern-proxy` | Proxy Pattern | Advanced |
| `design-pattern-mediator` | Mediator / Pub-Sub Pattern | Advanced |

### 3B. TypeScript Concepts (`/concepts/ts/`)

New domain. Route: `/concepts/ts/[conceptId]`
Data file: `src/data/tsConcepts.ts`

15 concept pages:

**Foundations:** `ts-basics`, `ts-type-narrowing`, `ts-generics`
**Utility Types:** `ts-utility-types`, `ts-mapped-types`, `ts-conditional-types`
**Advanced:** `ts-advanced-generics`, `ts-type-assertions`, `ts-declaration-files`
**React + TS:** `ts-react-components`, `ts-react-hooks`, `ts-react-patterns`
**Interview:** `ts-tricky-questions`, `ts-strict-mode`, `ts-migration`

Architecture:
- New hub page: `/concepts/ts`
- New OG images: `src/app/concepts/ts/[conceptId]/opengraph-image.tsx`
- Add to sitemap, indexing script, concepts hub

### 3C. Frontend System Design (`/concepts/system-design/`)

New domain. Route: `/concepts/system-design/[conceptId]`
Data file: `src/data/systemDesignConcepts.ts`

10 concept pages:

**Framework:** `sd-radio-framework`, `sd-component-architecture`
**Core Patterns:** `sd-data-fetching`, `sd-state-management`, `sd-real-time`
**Performance:** `sd-rendering-strategies`, `sd-performance-budget`, `sd-accessibility`
**Case Studies:** `sd-design-feed`, `sd-design-autocomplete`

---

## Phase 4 — Engagement & Differentiation

### 4A. React Coding Challenges

Route: `/challenges/react/[challengeId]`
Data file: `src/data/reactChallenges.ts`

15 challenges across Easy (5), Medium (5), Hard (5):

**Easy:** build-counter, build-toggle, build-character-count, build-accordion, build-tabs
**Medium:** build-todo-list, build-debounced-search, build-infinite-scroll, build-modal, build-form-validation
**Hard:** build-data-table, build-drag-and-drop, build-virtualized-list, build-undo-redo, build-real-time-chat

Uses existing Monaco editor. Problem + starter code + in-browser tests + solution reveal.

### 4B. Promise/Async Execution Visualizer

Route: `/playground/async-visualizer`

Interactive tool showing call stack, microtask queue, macrotask queue, Web API timers — animated step-by-step. Extends existing event loop playground. Pre-loaded examples for common interview puzzles.

### 4C. Interactive Quizzes

Route: `/quiz/[quizId]`
Data file: `src/data/quizzes.ts`

5 quizzes:
- `js-output-quiz` — "What's the Output?" (20 questions)
- `react-rerender-quiz` — "Will It Re-render?" (15 questions)
- `promise-order-quiz` — "Promise Execution Order" (10 questions)
- `ts-type-quiz` — "What's the Type?" (15 questions)
- `big-o-quiz` — "What's the Time Complexity?" (15 questions)

One-at-a-time format, instant feedback, shareable scores.

---

## Architecture Notes

### Shared Patterns Across All Phases

- Static generation via `generateStaticParams()` + `generateMetadata()`
- Structured data: FAQPage, Article, LearningResource, Breadcrumb
- OG images per route using `next/og` ImageResponse
- Sitemap integration (update `sitemap.ts`)
- Google Indexing API integration (update `google-index.ts`)
- CSS Modules + Tailwind v4 design tokens
- Interactive components via `ssr: false` dynamic imports

### New Data Files Required

| File | Phase | Content |
|------|-------|---------|
| `src/data/comparisons.ts` | 1 | Comparison page data |
| `src/data/tsConcepts.ts` | 3 | TypeScript concept data |
| `src/data/systemDesignConcepts.ts` | 3 | System design concept data |
| `src/data/reactChallenges.ts` | 4 | React coding challenges |
| `src/data/quizzes.ts` | 4 | Interactive quiz data |

### New Routes Required

| Route | Phase |
|-------|-------|
| `/compare/[comparisonId]` | 1 |
| `/top-questions/[domain]` | 1 |
| `/concepts/dsa/cheatsheet` | 1 |
| `/concepts/react/cheatsheet` | 1 |
| `/concepts/ts` | 3 |
| `/concepts/ts/[conceptId]` | 3 |
| `/concepts/system-design` | 3 |
| `/concepts/system-design/[conceptId]` | 3 |
| `/challenges/react/[challengeId]` | 4 |
| `/playground/async-visualizer` | 4 |
| `/quiz/[quizId]` | 4 |

---

## Summary

| Phase | New/Enriched Pages | Traffic Impact | Effort |
|-------|-------------------|---------------|--------|
| 1 — Quick Wins | ~15 | Very High | Low |
| 2 — Deepen Existing | ~25 enriched + 5 new | High | Medium-High |
| 3 — New Domains | ~33 | Very High | High |
| 4 — Engagement | ~22 | High | High |
| **Total** | **~95** | — | — |

Priority order: Phase 1 → 2 → 3 → 4 (traffic per unit effort).
