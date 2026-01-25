---
phase: 12
plan: 01
subsystem: seo
tags: [seo, breadcrumbs, sitemap, structured-data]

dependency-graph:
  requires: []
  provides:
    - breadcrumb schema utility
    - enhanced sitemap with all routes
    - CONTENT_LAST_UPDATED constant
  affects:
    - 12-02 (breadcrumb implementation uses generateBreadcrumbSchema)
    - 12-03 (concepts pages will import breadcrumb utility)
    - 12-04 (static pages will import breadcrumb utility)

tech-stack:
  added: []
  patterns:
    - JSON-LD structured data generation
    - Centralized content timestamp management

key-files:
  created:
    - src/lib/seo/breadcrumb.ts
  modified:
    - src/app/sitemap.ts

decisions:
  - id: breadcrumb-base-url
    choice: Hardcode https://jsinterview.dev in utility
    reason: Consistent with existing sitemap pattern, no env var complexity

metrics:
  duration: ~2 min
  completed: 2026-01-25
---

# Phase 12 Plan 01: SEO Foundation Summary

Created SEO infrastructure with breadcrumb utility and comprehensive sitemap for all routes.

## One-liner

Breadcrumb schema generator with valid JSON-LD output and sitemap covering 100+ routes including DSA patterns and concepts.

## What Was Built

### Task 1: Breadcrumb Utility

Created `src/lib/seo/breadcrumb.ts` with:
- `BreadcrumbItem` interface for type-safe breadcrumb items
- `generateBreadcrumbSchema()` function producing valid schema.org BreadcrumbList JSON-LD
- Handles both relative paths (auto-prefixed with BASE_URL) and absolute URLs

```typescript
export interface BreadcrumbItem {
  name: string
  path?: string  // Optional for current page
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema
```

### Task 2: Enhanced Sitemap

Updated `src/app/sitemap.ts` with:
- `CONTENT_LAST_UPDATED` constant for consistent timestamps
- DSA pattern pages (`/concepts/dsa/patterns/[patternId]`)
- DSA concept pages (`/concepts/dsa/[conceptId]`)
- Missing static pages: `/concepts/js`, `/concepts/dsa`, `/js-problems`, `/playground/event-loop`
- Cleaner code structure with `BASE_URL` constant

## Verification

All success criteria met:
- [x] Breadcrumb utility generates valid BreadcrumbList JSON-LD (verified `@type: 'BreadcrumbList'` in output)
- [x] Sitemap includes all DSA pattern routes (3 patterns)
- [x] Sitemap includes all `/concepts/dsa/*` routes (7 concepts + 3 patterns)
- [x] Sitemap uses consistent CONTENT_LAST_UPDATED timestamp

## Commits

| Commit | Description |
|--------|-------------|
| 0c02ccb | feat(12-01): create breadcrumb schema utility |
| 40dba4c | feat(12-01): enhance sitemap with DSA routes and CONTENT_LAST_UPDATED |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Ready for 12-02:
- `generateBreadcrumbSchema` function exported and ready for use
- Utility follows established patterns (similar to search utilities in `src/lib/search/`)
- No blockers or concerns identified
