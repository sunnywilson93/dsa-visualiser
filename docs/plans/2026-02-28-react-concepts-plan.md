# React Concepts Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full `/concepts/react/` section with 30 interactive concept pages across 6 categories, mirroring the JS and DSA concept architecture.

**Architecture:** Create a standalone React concept system (`reactConcepts.ts` data file, `/concepts/react/` route group, `React/` visualization components) following the same server/client page split, dynamic imports, and SEO patterns as `/concepts/js/`.

**Tech Stack:** Next.js App Router, TypeScript, CSS Modules, Tailwind v4, Framer Motion, Lucide icons

---

## Task 1: Create React concept data file with types and categories

**Files:**
- Create: `src/data/reactConcepts.ts`

**Step 1: Create the data file with interface, categories, and first 5 foundation concepts**

Create `src/data/reactConcepts.ts` with:

```typescript
export interface ReactConceptExample {
  title: string
  code: string
  explanation: string
}

export interface ReactConceptQuestion {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type ReactConceptCategory =
  | 'react-foundations'
  | 'hooks-basic'
  | 'hooks-advanced'
  | 'rendering'
  | 'patterns'
  | 'react-performance'

export interface ReactConcept {
  id: string
  title: string
  category: ReactConceptCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: ReactConceptExample[]
  commonMistakes?: string[]
  interviewTips?: string[]
  prerequisites?: string[]
  nextConcepts?: string[]
  interviewFrequency?: 'very-high' | 'high' | 'medium' | 'low'
  estimatedReadTime?: number
  commonQuestions?: ReactConceptQuestion[]
}

export interface ReactConceptCategoryInfo {
  id: ReactConceptCategory
  name: string
  description: string
  order: number
}

export const reactConceptCategories: ReactConceptCategoryInfo[] = [
  { id: 'react-foundations', name: 'Foundations', description: 'Core React building blocks', order: 0 },
  { id: 'hooks-basic', name: 'Basic Hooks', description: 'Essential React hooks', order: 1 },
  { id: 'hooks-advanced', name: 'Advanced Hooks', description: 'Performance and complex state hooks', order: 2 },
  { id: 'rendering', name: 'Rendering', description: 'How React renders and updates the DOM', order: 3 },
  { id: 'patterns', name: 'Patterns', description: 'Component design patterns', order: 4 },
  { id: 'react-performance', name: 'Performance', description: 'Optimization and advanced features', order: 5 },
]

export const reactConcepts: ReactConcept[] = [
  // populate with all 30 concepts
]

export function getReactConceptById(id: string): ReactConcept | undefined {
  return reactConcepts.find((c) => c.id === id)
}
```

Fill in all 30 concepts across 6 categories using these IDs:

**react-foundations (5):** `jsx-rendering`, `components-props`, `children-composition`, `conditional-rendering`, `lists-keys`

**hooks-basic (4):** `use-state`, `use-effect`, `use-ref`, `use-context`

**hooks-advanced (5):** `use-reducer`, `use-memo`, `use-callback`, `use-layout-effect`, `custom-hooks`

**rendering (5):** `virtual-dom`, `component-lifecycle`, `rerender-triggers`, `controlled-uncontrolled`, `refs-dom-access`

**patterns (6):** `compound-components`, `render-props`, `higher-order-components`, `error-boundaries`, `context-patterns`, `portals`

**react-performance (5):** `react-memo`, `code-splitting`, `suspense`, `concurrent-features`, `server-components`

Each concept needs: `id`, `title`, `category`, `difficulty`, `description` (2-3 sentences), `shortDescription` (5-10 words), `keyPoints` (5-7 items), `examples` (2-3 with code/explanation), `commonMistakes` (2-3), `interviewTips` (2-3), `interviewFrequency`, `estimatedReadTime`.

Reference `src/data/reactInterviewQuestions.ts` for content inspiration — the topics and answers there contain solid React explanations that can inform the concept data.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/data/reactConcepts.ts
git commit -m "feat(react): add React concept data with 30 concepts across 6 categories"
```

---

## Task 2: Create React concepts listing page

**Files:**
- Create: `src/app/concepts/react/page.tsx`
- Create: `src/app/concepts/react/ReactConceptsClient.tsx`
- Reference: `src/app/concepts/js/page.tsx` (server page pattern)
- Reference: `src/app/concepts/js/JSConceptsClient.tsx` (client listing pattern)

**Step 1: Create server page**

Create `src/app/concepts/react/page.tsx` following the exact pattern of `src/app/concepts/js/page.tsx`:
- Static metadata with React-focused title/description/keywords
- Breadcrumb schema: Home > Concepts > React
- Render `<ReactConceptsClient />`

**Step 2: Create client listing page**

Create `src/app/concepts/react/ReactConceptsClient.tsx` following `JSConceptsClient.tsx`:
- Import `reactConcepts`, `reactConceptCategories` from `@/data/reactConcepts`
- Use `usePageSearch('react')` for search/filtering
- Display categories as sections with `CardCarousel` of concept cards
- Each card links to `/concepts/react/{conceptId}`
- NavBar breadcrumbs: `Concepts > React`
- Header: "React Concepts" with gradient text

**Step 3: Verify page renders**

Run: `npm run dev` and visit `http://localhost:3000/concepts/react`
Expected: Page renders with all 6 categories and 30 concept cards

**Step 4: Commit**

```bash
git add src/app/concepts/react/
git commit -m "feat(react): add React concepts listing page with search and category filtering"
```

---

## Task 3: Create React concept detail page

**Files:**
- Create: `src/app/concepts/react/[conceptId]/page.tsx`
- Create: `src/app/concepts/react/[conceptId]/ReactConceptPageClient.tsx`
- Reference: `src/app/concepts/js/[conceptId]/page.tsx` (server page with SEO)
- Reference: `src/app/concepts/js/[conceptId]/ConceptPageClient.tsx` (client page with viz)

**Step 1: Create server page with SEO**

Create `src/app/concepts/react/[conceptId]/page.tsx` following the JS pattern:
- `generateMetadata()` — creates React-specific title/description/OG tags
- `generateStaticParams()` — maps all react concept IDs
- FAQ, Article, LearningResource, Breadcrumb schemas
- Breadcrumbs: Home > Concepts > React > {title}
- Last-updated timestamp
- Import from `@/data/reactConcepts` instead of `@/data/concepts`
- URL pattern: `https://jsinterview.dev/concepts/react/{id}`
- Article section: 'React Tutorials'
- Learning resource teaches: `{title} in React`

**Step 2: Create client page with visualization mapping**

Create `src/app/concepts/react/[conceptId]/ReactConceptPageClient.tsx` following `ConceptPageClient.tsx`:
- Import `getReactConceptById`, `reactConcepts` from `@/data/reactConcepts`
- Create `visualizations` record mapping concept IDs to `dynamic()` imports from `@/components/Concepts/React/`
- Render: visualization (if exists), description, key points, examples (with CodeBlock), common mistakes, interview tips, related concepts
- Use same section layout, icons, and animations as JS version
- Link related concepts to `/concepts/react/` paths

**Step 3: Verify page renders with concept data (no viz yet)**

Run: `npm run dev` and visit `http://localhost:3000/concepts/react/jsx-rendering`
Expected: Page renders with concept content (viz area will be empty)

**Step 4: Commit**

```bash
git add src/app/concepts/react/[conceptId]/
git commit -m "feat(react): add React concept detail page with SEO and content rendering"
```

---

## Task 4: Create OG image generation

**Files:**
- Create: `src/app/concepts/react/[conceptId]/opengraph-image.tsx`
- Reference: `src/app/concepts/js/[conceptId]/opengraph-image.tsx`

**Step 1: Create OG image component**

Follow the JS OG image pattern exactly but change:
- Label text: "React Concept" (instead of "JavaScript Concept")
- Brand color: use a React-appropriate color (e.g., `#61dafb` React blue)
- Import from `@/data/reactConcepts`

**Step 2: Commit**

```bash
git add src/app/concepts/react/[conceptId]/opengraph-image.tsx
git commit -m "feat(react): add dynamic OG image generation for React concepts"
```

---

## Task 5: Create visualization components (30 total)

**Files:**
- Create: `src/components/Concepts/React/` directory with 30 viz components
- Each component: `{ConceptName}Viz.tsx`

**Step 1: Create the React viz directory and first batch (foundations — 5 components)**

Create `src/components/Concepts/React/` and build:
- `JsxRenderingViz.tsx`
- `ComponentsPropsViz.tsx`
- `ChildrenCompositionViz.tsx`
- `ConditionalRenderingViz.tsx`
- `ListsKeysViz.tsx`

Each viz follows the step-through pattern (Previous/Next with `CodeBlock`):
- Import `CodeBlock` from `@/components/ui`
- Define `Step` interface with `label`, `code`, `output[]`
- 3-5 tabs with 3-4 steps each
- Named export: `export function ComponentNameViz()`

**Step 2: Build hooks-basic batch (4 components)**

- `UseStateViz.tsx`
- `UseEffectViz.tsx`
- `UseRefViz.tsx`
- `UseContextViz.tsx`

**Step 3: Build hooks-advanced batch (5 components)**

- `UseReducerViz.tsx`
- `UseMemoViz.tsx`
- `UseCallbackViz.tsx`
- `UseLayoutEffectViz.tsx`
- `CustomHooksViz.tsx`

**Step 4: Build rendering batch (5 components)**

- `VirtualDomViz.tsx`
- `ComponentLifecycleViz.tsx`
- `RerenderTriggersViz.tsx`
- `ControlledUncontrolledViz.tsx`
- `RefsDomAccessViz.tsx`

**Step 5: Build patterns batch (6 components)**

- `CompoundComponentsViz.tsx`
- `RenderPropsViz.tsx`
- `HigherOrderComponentsViz.tsx`
- `ErrorBoundariesViz.tsx`
- `ContextPatternsViz.tsx`
- `PortalsViz.tsx`

**Step 6: Build performance batch (5 components)**

- `ReactMemoViz.tsx`
- `CodeSplittingViz.tsx`
- `SuspenseViz.tsx`
- `ConcurrentFeaturesViz.tsx`
- `ServerComponentsViz.tsx`

**Step 7: Wire up all visualizations in ReactConceptPageClient.tsx**

Update the `visualizations` record in `ReactConceptPageClient.tsx` to map all 30 concept IDs to their dynamic imports.

**Step 8: Verify a few concept pages with visualizations**

Run: `npm run dev` and spot-check 3-4 pages across different categories.

**Step 9: Commit**

```bash
git add src/components/Concepts/React/
git commit -m "feat(react): add 30 interactive visualization components for React concepts"
```

**Note:** This is the largest task. Consider using parallel subagents (5-6 batches) to build the viz components concurrently since they're independent.

---

## Task 6: Update landing page and navigation

**Files:**
- Modify: `src/app/concepts/page.tsx` — add React card
- Reference: existing JS and DSA cards for styling

**Step 1: Add React Concepts card to landing page**

In `src/app/concepts/page.tsx`:
- Import `reactConcepts`, `reactConceptCategories` from `@/data/reactConcepts`
- Add a third card to the grid (change grid from `grid-cols-2` to `grid-cols-3` with responsive `max-md:grid-cols-1`)
- Card links to `/concepts/react`
- Shows category tags with counts
- Use a React-themed icon
- Update `totalTopics` count to include React concepts

**Step 2: Verify landing page**

Run: `npm run dev` and visit `http://localhost:3000/concepts`
Expected: Three cards side by side — JS, DSA, React

**Step 3: Commit**

```bash
git add src/app/concepts/page.tsx
git commit -m "feat(react): add React concepts card to concepts landing page"
```

---

## Task 7: Update sitemap and indexing

**Files:**
- Modify: `src/app/sitemap.ts` — add React concept URLs
- Modify: `scripts/google-index.ts` — add React concept URLs

**Step 1: Update sitemap**

In `src/app/sitemap.ts`:
- Import `reactConcepts` from `@/data/reactConcepts`
- Add `/concepts/react` to static pages (priority 0.9)
- Add React concept pages section:
  ```typescript
  const reactConceptPages: MetadataRoute.Sitemap = reactConcepts.map((concept) => ({
    url: `${BASE_URL}/concepts/react/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  ```
- Add to return array

**Step 2: Update indexing script**

In `scripts/google-index.ts`:
- Import `reactConcepts` from `../src/data/reactConcepts`
- Add `/concepts/react` to static paths
- Add React concept URL generation:
  ```typescript
  reactConcepts.forEach((c) => urls.push(`${BASE_URL}/concepts/react/${c.id}`))
  ```

**Step 3: Run dry-run to verify**

Run: `npm run index:dry-run`
Expected: URL count increases by ~31 (1 listing + 30 concepts)

**Step 4: Commit**

```bash
git add src/app/sitemap.ts scripts/google-index.ts
git commit -m "feat(react): add React concept URLs to sitemap and indexing script"
```

---

## Task 8: Build and lint verification

**Step 1: Run linter**

Run: `npm run lint`
Expected: No errors

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with all React concept pages statically generated

**Step 3: Run existing tests**

Run: `npm run test:run`
Expected: All existing tests pass

**Step 4: Final commit**

```bash
git commit -m "chore: verify React concepts build passes"
```

---

## Execution Notes

- **Task 5 is the bulk of the work** (30 visualization components). Use parallel subagents to build each category batch simultaneously.
- **Task 1 depends on nothing** and should be done first as all other tasks import from it.
- **Tasks 2, 3, 4 depend on Task 1** but are independent of each other — can be parallelized.
- **Task 5 depends on Task 3** (needs `ReactConceptPageClient.tsx` to wire into).
- **Task 6 and 7 are independent** and can run in parallel after Task 1.
- **Task 8 is the final gate** — must pass before merging.
