# React Interview Questions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a React interview page with 100 questions across 4 topics, following the exact same pattern as the existing HTML/CSS/JS interview pages.

**Architecture:** Data file exports typed questions + topics + filter function. Server component handles SEO metadata + breadcrumb schema. Client component handles filter state + rendering via shared `InterviewFilterBar` and `InterviewQuestionCard` components. Homepage, interview landing, and sitemap are updated to link to the new page.

**Tech Stack:** Next.js App Router, TypeScript, CSS Modules, Tailwind v4 design tokens

---

### Task 1: Create React Interview Data File (Questions 1-25: Core & Rendering)

**Files:**
- Create: `src/data/reactInterviewQuestions.ts`

**Step 1: Create the data file with types, config, and first 25 questions**

Create `src/data/reactInterviewQuestions.ts` with this exact structure (matching `src/data/jsInterviewQuestions.ts`):

```typescript
export type ReactInterviewTopic =
  | 'core-rendering'
  | 'hooks-state'
  | 'patterns-architecture'
  | 'performance-advanced'

export interface ReactInterviewQuestion {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: ReactInterviewTopic
  subtopic: string
  answer: string
  codeExample?: string
  followUp: string
  keyTakeaway: string
}

export interface ReactTopicConfig {
  id: ReactInterviewTopic
  label: string
  description: string
}

export const reactTopics: ReactTopicConfig[] = [
  {
    id: 'core-rendering',
    label: 'Core & Rendering',
    description: 'JSX, virtual DOM, reconciliation, keys, refs, portals, error boundaries',
  },
  {
    id: 'hooks-state',
    label: 'Hooks & State',
    description: 'useState, useEffect, useReducer, useContext, custom hooks, rules of hooks',
  },
  {
    id: 'patterns-architecture',
    label: 'Patterns & Architecture',
    description: 'Composition, HOCs, render props, compound components, Server Components',
  },
  {
    id: 'performance-advanced',
    label: 'Performance & Advanced',
    description: 'Memoization, concurrent features, React 19 APIs, profiling, testing',
  },
]

export const reactTopicMap: Record<ReactInterviewTopic, ReactTopicConfig> =
  Object.fromEntries(reactTopics.map((t) => [t.id, t])) as Record<ReactInterviewTopic, ReactTopicConfig>

export const reactInterviewQuestions: ReactInterviewQuestion[] = [
  // Questions 1-25: core-rendering topic
  // 8 easy, 10 medium, 7 hard
  // Subtopics: jsx, virtual-dom, reconciliation, keys, refs, portals, error-boundaries, suspense, strict-mode, fragments, events, controlled-components
]
```

Write 25 high-quality questions for the `core-rendering` topic. Each question needs:
- `id`: 1-25
- `title`: The interview question text
- `difficulty`: Match distribution (8 easy, 10 medium, 7 hard)
- `topic`: `'core-rendering'`
- `subtopic`: One of: `jsx`, `virtual-dom`, `reconciliation`, `keys`, `refs`, `portals`, `error-boundaries`, `suspense`, `strict-mode`, `fragments`, `events`, `controlled-components`
- `answer`: 2-4 sentence technical answer (use backticks for inline code references)
- `codeExample`: Optional TypeScript/JSX code snippet. Use `\n` for newlines. Include comments.
- `followUp`: A natural follow-up question an interviewer would ask
- `keyTakeaway`: One-sentence summary starting with emoji-free factual statement

**Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/data/reactInterviewQuestions.ts 2>&1 || echo "Check types"`

---

### Task 2: Add Questions 26-50 (Hooks & State)

**Files:**
- Modify: `src/data/reactInterviewQuestions.ts`

**Step 1: Append 25 questions to the array**

Add questions 26-50 to the `reactInterviewQuestions` array. Topic: `'hooks-state'`. Distribution: 7 easy, 11 medium, 7 hard.

Subtopics: `useState`, `useEffect`, `useReducer`, `useContext`, `useMemo`, `useCallback`, `useRef`, `custom-hooks`, `rules-of-hooks`, `useId`, `useLayoutEffect`, `useSyncExternalStore`

Each question follows the same `ReactInterviewQuestion` interface. Code examples should demonstrate real React patterns (not toy examples). Focus on common interview gotchas: stale closures in useEffect, dependency array pitfalls, when to use useReducer vs useState, custom hook extraction patterns.

**Step 2: Verify compilation**

Run: `npx tsc --noEmit src/data/reactInterviewQuestions.ts 2>&1 || echo "Check types"`

---

### Task 3: Add Questions 51-75 (Patterns & Architecture)

**Files:**
- Modify: `src/data/reactInterviewQuestions.ts`

**Step 1: Append 25 questions to the array**

Add questions 51-75. Topic: `'patterns-architecture'`. Distribution: 5 easy, 12 medium, 8 hard.

Subtopics: `composition`, `higher-order-components`, `render-props`, `compound-components`, `provider-pattern`, `controlled-uncontrolled`, `lifting-state`, `state-machines`, `code-splitting`, `lazy-loading`, `server-components`, `rsc-data-flow`, `context-patterns`

Focus on architectural decision-making: when to use composition vs HOCs, Server Components vs Client Components boundary decisions, state management patterns (context vs external stores), code splitting strategies.

**Step 2: Verify compilation**

Run: `npx tsc --noEmit src/data/reactInterviewQuestions.ts 2>&1 || echo "Check types"`

---

### Task 4: Add Questions 76-100 (Performance & Advanced) + Filter Function

**Files:**
- Modify: `src/data/reactInterviewQuestions.ts`

**Step 1: Append 25 questions to the array**

Add questions 76-100. Topic: `'performance-advanced'`. Distribution: 3 easy, 10 medium, 12 hard.

Subtopics: `react-memo`, `useMemo-useCallback`, `re-renders`, `profiler`, `concurrent-features`, `useTransition`, `useDeferredValue`, `suspense-data`, `react-19-use`, `react-19-actions`, `useOptimistic`, `useFormStatus`, `useActionState`, `testing`, `accessibility`

Focus on senior-level topics: when memoization hurts performance, concurrent rendering mental model, React 19 form Actions pattern, testing strategies with React Testing Library.

**Step 2: Add the filter function at the end of the file**

```typescript
export function filterReactQuestions(
  questions: ReactInterviewQuestion[],
  difficulty: 'all' | 'easy' | 'medium' | 'hard',
  topic: string,
): ReactInterviewQuestion[] {
  return questions.filter((q) => {
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false
    if (topic !== 'all' && q.topic !== topic) return false
    return true
  })
}
```

**Step 3: Verify compilation and question count**

Run: `npx tsc --noEmit src/data/reactInterviewQuestions.ts 2>&1 || echo "Check types"`

Verify 100 questions: `grep -c "id:" src/data/reactInterviewQuestions.ts` should output approximately 100.

---

### Task 5: Create React Interview Page (Server + Client Components)

**Files:**
- Create: `src/app/interview/react/page.tsx`
- Create: `src/app/interview/react/ReactInterviewClient.tsx`
- Create: `src/app/interview/react/ReactInterviewClient.module.css`

**Step 1: Create the server component with SEO metadata**

Create `src/app/interview/react/page.tsx` — copy the exact pattern from `src/app/interview/js/page.tsx`, replacing:
- All "JavaScript" → "React"
- All "JS" → "React" in descriptions
- Canonical: `/interview/react`
- URL: `https://jsinterview.dev/interview/react`
- Keywords: `React interview questions, React interview prep, hooks interview, useState interview, useEffect interview, Server Components interview, React 19 interview, frontend interview, web developer interview`
- Description mentions: hooks, state management, Server Components, React 19 APIs, and performance optimization
- Breadcrumb: `{ name: 'React' }` instead of `{ name: 'JavaScript' }`
- Import: `ReactInterviewClient` from `'./ReactInterviewClient'`

**Step 2: Create the client component**

Create `src/app/interview/react/ReactInterviewClient.tsx` — copy exact pattern from `src/app/interview/js/JSInterviewClient.tsx`, replacing:
- Import from `'@/data/reactInterviewQuestions'` (reactInterviewQuestions, reactTopics, reactTopicMap, filterReactQuestions)
- CSS import: `'./ReactInterviewClient.module.css'`
- Component name: `ReactInterviewClient`
- NavBar breadcrumb label: `'React'`
- Title: `'React Interview Prep'`
- Subtitle: mentions hooks, state, patterns, and performance
- Filter function: `filterReactQuestions`

**Step 3: Create the CSS module**

Create `src/app/interview/react/ReactInterviewClient.module.css` — exact copy of `src/app/interview/js/JSInterviewClient.module.css` (identical styles).

**Step 4: Verify build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, `/interview/react` appears in route list.

---

### Task 6: Update InterviewLanding, Homepage, Sitemap, and SEO

**Files:**
- Modify: `src/app/interview/InterviewLanding.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/Icons/ConceptIcon.tsx` (add `react` icon mapping)

**Step 1: Add React card to InterviewLanding.tsx**

In `src/app/interview/InterviewLanding.tsx`:
- Add import: `import { reactInterviewQuestions } from '@/data/reactInterviewQuestions'`
- Add a new `<Link>` card after the JS card:

```tsx
<Link href="/interview/react" className={styles.topicCard}>
  <div className={styles.topicName}>React</div>
  <div className={styles.topicDescription}>
    Hooks, state management, component patterns, Server Components, and React 19 features
  </div>
  <div className={styles.topicCount}>
    {reactInterviewQuestions.length} questions
  </div>
</Link>
```

**Step 2: Update homepage (src/app/page.tsx)**

1. Add import: `import { reactInterviewQuestions, reactTopics } from '@/data/reactInterviewQuestions'`

2. Update `totalInterviewQuestions` to include React:
```typescript
const totalInterviewQuestions = htmlInterviewQuestions.length + cssInterviewQuestions.length + jsInterviewQuestions.length + reactInterviewQuestions.length
```

3. Update FAQ schema question `'Does JS Interview Prep have HTML, CSS, and JavaScript interview questions?'`:
   - Change name to: `'Does JS Interview Prep have HTML, CSS, JavaScript, and React interview questions?'`
   - Update answer text to include: `${reactInterviewQuestions.length} React questions covering hooks, state management, Server Components, and React 19 features`

4. Update FAQ schema question `'What topics are covered on JS Interview Prep?'`:
   - Change `"and ${totalInterviewQuestions} interview questions for HTML, CSS, and JavaScript"` to `"and ${totalInterviewQuestions} interview questions for HTML, CSS, JavaScript, and React"`

5. Change the interview grid from `grid-cols-3` to `grid-cols-4` (with `max-lg:grid-cols-2` breakpoint):
```
<div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 items-stretch">
```

6. Add React card after the JS card in the interview section — same pattern as existing cards:
```tsx
<Link href="/interview/react" className="relative block rounded-2xl p-0.5 no-underline text-inherit transition-all duration-200 border border-white-10 hover:bg-white-5 hover:border-brand-primary-40 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] h-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none">
  <div className="bg-bg-page-secondary rounded-xl p-6 flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between">
      <span className="flex items-center justify-center text-brand-primary">
        <ConceptIcon conceptId="react" size={28} />
      </span>
      <span className="text-sm font-semibold py-0.5 px-3 bg-brand-primary-15 rounded-3xl text-brand-primary">{reactInterviewQuestions.length} questions</span>
    </div>
    <h3 className="text-xl font-bold text-text-bright m-0">React Interview Questions</h3>
    <p className="text-base text-text-secondary m-0 leading-normal flex-1">
      {reactTopics.map(t => t.label).join(', ')}
    </p>
  </div>
</Link>
```

**Step 3: Add React icon to ConceptIcon map**

In `src/components/Icons/ConceptIcon.tsx`:
- Import `Component` from `lucide-react` (add to existing import block)
- Add entry to `conceptIconMap`: `'react': Component,`

**Step 4: Update sitemap**

In `src/app/sitemap.ts`:
- Add after the `/interview/js` entry:
```typescript
{
  url: `${BASE_URL}/interview/react`,
  lastModified: CONTENT_LAST_UPDATED,
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

**Step 5: Clean up dead CSS**

In `src/app/interview/InterviewLanding.module.css`:
- Remove `.comingSoon` and `.comingSoonBadge` rules (lines 63-72) — they are unused since all topics are now active.

**Step 6: Build and lint**

Run: `npm run build 2>&1 | tail -5` — must succeed
Run: `npm run lint 2>&1 | tail -3` — must have no errors

---

### Task 7: Update Visual Snapshots and Commit

**Step 1: Update visual regression snapshots**

Run: `PLAYWRIGHT_SKIP_SERVER=1 npx playwright test --config playwright.smoke.config.ts --update-snapshots`
Expected: All 10 tests pass, home snapshot regenerated.

**Step 2: Verify snapshots pass**

Run: `PLAYWRIGHT_SKIP_SERVER=1 npx playwright test --config playwright.smoke.config.ts`
Expected: 10 passed, 0 failed.

**Step 3: Commit everything**

```bash
git add src/data/reactInterviewQuestions.ts \
  src/app/interview/react/ \
  src/app/interview/InterviewLanding.tsx \
  src/app/interview/InterviewLanding.module.css \
  src/app/page.tsx \
  src/app/sitemap.ts \
  src/components/Icons/ConceptIcon.tsx \
  e2e/visual-smoke.spec.ts-snapshots/
git commit -m "feat(interview): add 100 React questions, update SEO and homepage"
```

**Step 4: Push**

```bash
git push
```
