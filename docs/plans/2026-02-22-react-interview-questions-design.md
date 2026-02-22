# React Interview Questions — Design

## Summary

Add a React interview questions page with 100 questions across 4 topics, following the existing HTML/CSS/JS interview page pattern.

## Data Structure

File: `src/data/reactInterviewQuestions.ts`

```typescript
type ReactInterviewTopic =
  | 'core-rendering'
  | 'hooks-state'
  | 'patterns-architecture'
  | 'performance-advanced'
```

Topics:
- **Core & Rendering**: JSX, virtual DOM, reconciliation, keys, refs, portals, error boundaries, Suspense, StrictMode
- **Hooks & State**: useState, useEffect, useReducer, useContext, useMemo, useCallback, useRef, custom hooks, rules of hooks
- **Patterns & Architecture**: Composition, HOCs, render props, compound components, Server Components, RSC, code splitting
- **Performance & Advanced**: Memoization, concurrent features, React 19 APIs (use, Actions, useOptimistic), profiling, testing

## Question Distribution

25 questions per topic. Difficulty split per topic:

| Topic | Easy | Medium | Hard |
|---|---|---|---|
| Core & Rendering | 8 | 10 | 7 |
| Hooks & State | 7 | 11 | 7 |
| Patterns & Architecture | 5 | 12 | 8 |
| Performance & Advanced | 3 | 10 | 12 |

Covers React 19+ features including Server Components, use(), Actions, useOptimistic, useFormStatus, useActionState, and concurrent rendering.

## Files

| File | Action |
|---|---|
| `src/data/reactInterviewQuestions.ts` | Create — 100 questions + types + config + filter |
| `src/app/interview/react/page.tsx` | Create — server component with SEO metadata |
| `src/app/interview/react/ReactInterviewClient.tsx` | Create — client component with filters |
| `src/app/interview/react/ReactInterviewClient.module.css` | Create — page styles |
| `src/app/interview/InterviewLanding.tsx` | Modify — add React card |
| `src/app/page.tsx` | Modify — add React to interview section + FAQ |
| `src/app/sitemap.ts` | Modify — add /interview/react |
| Visual snapshots | Update |

## SEO

- Title: "React Interview Questions - 100 Questions by Topic & Difficulty"
- Canonical: /interview/react
- Breadcrumb: Home > Interview > React
- Added to sitemap, homepage FAQ schema, interview landing
