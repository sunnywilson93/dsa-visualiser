---
phase: 16-config-token-migration
plan: 01
subsystem: build-config
tags: [tailwind-v4, postcss, css-first, clsx]
completed: 2026-01-27
duration: ~2 min
dependency_graph:
  requires: []
  provides: [css-first-tailwind-config, empty-theme-block, clsx-dependency]
  affects: [16-02, 16-03, 16-04, 16-05, 16-06]
tech_stack:
  added: [clsx]
  removed: [autoprefixer]
  patterns: [css-first-tailwind-v4, @import-directive, @theme-block]
key_files:
  created: []
  modified: [src/styles/globals.css, postcss.config.js, package.json, package-lock.json]
  deleted: [tailwind.config.js]
decisions:
  - decision: "Empty @theme block placement"
    choice: "Immediately after @import directive, before @layer blocks"
    reason: "Subsequent plans (02-06) populate @theme with token groups"
metrics:
  tasks_completed: 1
  tasks_total: 1
  deviations: 0
commits:
  - hash: 8c33a93
    message: "feat(16-01): replace Tailwind v3 config with CSS-first v4 setup"
---

# Phase 16 Plan 01: Config Teardown Summary

**One-liner:** Replaced Tailwind v3 JS config with CSS-first v4 @import directive, removed autoprefixer, installed clsx, and established empty @theme block for token migration.

## What Was Done

### Task 1: Replace directives, delete config, update PostCSS

- Replaced `@tailwind base/components/utilities` directives with single `@import "tailwindcss"` in globals.css
- Added empty `@theme { }` block after the import for subsequent plans to populate
- Deleted `tailwind.config.js` entirely (75 lines of JS config no longer needed)
- Removed `autoprefixer` from postcss.config.js and uninstalled from dependencies
- Installed `clsx` for conditional class composition in future component work
- All existing `:root` tokens, `@layer base`, `@layer components`, and `@layer utilities` blocks preserved exactly as they were

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` | Passed (61 pages generated) |
| `npm run lint` | No warnings or errors |
| tailwind.config.js deleted | Confirmed |
| autoprefixer removed from postcss.config.js | 0 occurrences |
| @tailwind directives removed from globals.css | 0 occurrences |
| @import directive present in globals.css | 1 occurrence |
| clsx in package.json dependencies | Present (^2.1.1) |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Empty @theme placement | After @import, before @layer blocks | Clean separation: import -> theme tokens -> layer rules |

## Next Phase Readiness

Plans 02-06 can now add token groups to the `@theme { }` block. The CSS-first configuration is fully operational with no legacy artifacts.
