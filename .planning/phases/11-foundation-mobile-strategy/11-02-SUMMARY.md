---
phase: 11
plan: 02
subsystem: cross-linking
tags: [utility, data-relationships, navigation]
depends_on:
  requires: []
  provides: [getCrossLinks, getRelatedPatterns, getRelatedProblems, CrossLink]
  affects: [13-cross-linking]
tech-stack:
  added: []
  patterns: [utility-module, data-aggregation]
key-files:
  created:
    - src/utils/getCrossLinks.ts
  modified: []
decisions:
  - choice: "Pattern ID extraction via split('-').slice(0,2).join('-')"
    reason: "Maps concept.pattern values like 'two-pointers-converge' to dsaPatterns IDs like 'two-pointers'"
  - choice: "Combine both explicit relatedProblems and derived problemConcepts relationships"
    reason: "Maximizes coverage - explicit relationships may miss some, derived may miss others"
metrics:
  duration: ~2 min
  completed: 2026-01-25
---

# Phase 11 Plan 02: Cross-Link Utilities Summary

Cross-link utility functions for bidirectional pattern-problem navigation.

## One-Liner

Utility module with getRelatedPatterns/getRelatedProblems for Phase 13 cross-linking UI.

## What Was Done

### Task 1: Create cross-link utility module

Created `src/utils/getCrossLinks.ts` with:

- **CrossLink interface**: Standardized link structure with type, id, name, href, description
- **getRelatedPatterns(problemId)**: Finds patterns for a problem via:
  - Pattern ID extraction from concept.pattern (e.g., 'two-pointers-converge' -> 'two-pointers')
  - Matching against dsaPatterns.id
  - Checking dsaPatterns.relatedProblems array
- **getRelatedProblems(patternId)**: Finds problems for a pattern via:
  - Scanning problemConcepts for patterns starting with patternId
  - Including dsaPatterns.relatedProblems array
  - Deduplicating via Set
- **getCrossLinks(context)**: Unified interface for either direction

### Task 2: Verification

- Build passes
- Lint passes with no warnings
- 92 lines (above 50 minimum)
- All three functions exported
- Href patterns verified against codebase:
  - Patterns: `/concepts/dsa/patterns/${slug}`
  - Problems: `/${category}/${id}`

## Commits

| Commit | Message |
|--------|---------|
| c1fedf9 | feat(11-02): create cross-link utility module |

## Key Files

| File | Purpose |
|------|---------|
| src/utils/getCrossLinks.ts | Cross-link utility functions |

## Technical Notes

**Pattern ID Mapping:**
```
concept.pattern.split('-').slice(0, 2).join('-')
```
- 'two-pointers-converge' -> 'two-pointers'
- 'two-pointers-same-dir' -> 'two-pointers'
- 'bit-manipulation' -> 'bit-manipulation'

**Data Sources:**
- `dsaPatterns` from @/data/dsaPatterns (pattern definitions)
- `problemConcepts` from @/data/algorithmConcepts (problem-to-pattern mapping)
- `codeExamples` from @/data/examples (problem metadata)

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Phase 13 (Cross-Linking) can now:
- Import `getRelatedPatterns(problemId)` to show "Learn the Pattern" links on problem pages
- Import `getRelatedProblems(patternId)` to show "Practice this Pattern" links on pattern pages
- Use `getCrossLinks(context)` for unified access

All utilities are pure functions with no side effects, ready for direct use in React components.
