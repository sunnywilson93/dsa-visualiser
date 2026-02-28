# React Concepts Section — Design

## Goal

Add a full `/concepts/react/` section mirroring the existing JS and DSA concept systems, with interactive visualizations, SEO metadata, and 25-30 concepts across 6 categories.

## Architecture

Mirror the JS concept architecture exactly:

```
src/data/reactConcepts.ts              — concept data (reuses Concept interface)
src/app/concepts/react/
├── page.tsx                            — listing page (server, SEO metadata)
├── ReactConceptsClient.tsx             — listing UI (client, filtering/category tabs)
├── [conceptId]/
│   ├── page.tsx                        — concept detail (server, metadata + schema)
│   ├── ReactConceptPageClient.tsx      — concept detail (client, viz + content)
│   └── opengraph-image.tsx             — dynamic OG images
src/components/Concepts/React/          — visualization components (1 per concept)
```

### Files to modify

- `src/data/concepts.ts` — extend `category` type union for React categories
- `src/app/concepts/page.tsx` — add React card alongside JS and DSA
- `src/app/sitemap.ts` — add React concept URLs
- `scripts/google-index.ts` — add React concept URLs to indexing

## Data Model

Reuse the existing `Concept` interface from `concepts.ts`. Store React concepts in a separate `reactConcepts.ts` with its own `reactConceptCategories` array.

New category values: `'react-foundations' | 'hooks-basic' | 'hooks-advanced' | 'rendering' | 'patterns' | 'react-performance'`

Each concept includes: `id`, `title`, `category`, `difficulty`, `description`, `shortDescription`, `keyPoints`, `examples`, `commonMistakes`, `interviewTips`, `relatedProblems`, `prerequisites`, `nextConcepts`, `interviewFrequency`, `estimatedReadTime`, `commonQuestions`.

## Categories & Concepts

### 1. foundations (5 concepts)
- `jsx-rendering` — JSX & How React Renders
- `components-props` — Components & Props
- `children-composition` — Children & Composition
- `conditional-rendering` — Conditional Rendering Patterns
- `lists-keys` — Lists & Keys

### 2. hooks-basic (4 concepts)
- `use-state` — useState & State Updates
- `use-effect` — useEffect & Side Effects
- `use-ref` — useRef & Mutable Refs
- `use-context` — useContext & Context API

### 3. hooks-advanced (5 concepts)
- `use-reducer` — useReducer & Complex State
- `use-memo` — useMemo & Expensive Computations
- `use-callback` — useCallback & Stable References
- `use-layout-effect` — useLayoutEffect & DOM Measurements
- `custom-hooks` — Building Custom Hooks

### 4. rendering (5 concepts)
- `virtual-dom` — Virtual DOM & Reconciliation
- `component-lifecycle` — Component Lifecycle
- `rerender-triggers` — Re-render Triggers & Batching
- `controlled-uncontrolled` — Controlled vs Uncontrolled Components
- `refs-dom-access` — Refs & Direct DOM Access

### 5. patterns (6 concepts)
- `compound-components` — Compound Components
- `render-props` — Render Props Pattern
- `higher-order-components` — Higher-Order Components (HOCs)
- `error-boundaries` — Error Boundaries
- `context-patterns` — Context Patterns & Optimization
- `portals` — Portals & Rendering Outside the Tree

### 6. react-performance (5 concepts)
- `react-memo` — React.memo & Shallow Comparison
- `code-splitting` — Code Splitting & React.lazy
- `suspense` — Suspense & Data Fetching
- `concurrent-features` — Concurrent Rendering
- `server-components` — React Server Components

**Total: 30 concepts**

## Visualization Pattern

Each concept gets a `*Viz.tsx` component using the step-through educational pattern (Previous/Next navigation with CodeBlock). Components live in `src/components/Concepts/React/`.

The `ReactConceptPageClient.tsx` maps concept IDs to visualization components using Next.js `dynamic()` imports, identical to the JS pattern in `ConceptPageClient.tsx`.

## SEO

- `generateMetadata()` on server page creates title, description, OG tags, canonical URL
- `generateStaticParams()` maps all concept IDs for static generation
- Structured data: FAQPage, Article, LearningResource, BreadcrumbList schemas
- Dynamic OG images via `opengraph-image.tsx`
- Sitemap includes all `/concepts/react/*` URLs
- Indexing script updated to submit React concept URLs

## Routing

- `/concepts/react` — React concepts listing page
- `/concepts/react/[conceptId]` — Individual concept page

## Landing Page Update

Add a third card to `/concepts` page for React Concepts, matching the style of JS and DSA cards. Update topic counts.
