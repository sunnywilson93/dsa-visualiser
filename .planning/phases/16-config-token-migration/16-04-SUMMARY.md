# Phase 16 Plan 04: Typography Token Migration Summary

**One-liner:** Font families, sizes, weights, and line heights migrated to @theme with --font-weight-* rename across 84 files (506 occurrences)

## Metadata

- **Phase:** 16-config-token-migration
- **Plan:** 04
- **Subsystem:** design-tokens / typography
- **Tags:** css, tailwind-v4, @theme, typography, font-weight, migration
- **Duration:** ~2 min
- **Completed:** 2026-01-27

## What Was Done

### Task 1: Migrate typography tokens to @theme
- Added font families (--font-sans, --font-mono) to @theme block
- Added font sizes (--text-2xs through --text-3xl) to @theme block
- Added font weights with new --font-weight-* namespace (renamed from --font-*)
- Added line heights (--leading-none through --leading-relaxed) to @theme block
- Removed all typography tokens from :root in @layer base
- Updated 3 font-weight references in globals.css itself
- **Commit:** `4e6b0bd`

### Task 2: Update font-weight var() references across CSS files
- Replaced `var(--font-normal)` with `var(--font-weight-normal)` across all CSS modules
- Replaced `var(--font-medium)` with `var(--font-weight-medium)` across all CSS modules
- Replaced `var(--font-semibold)` with `var(--font-weight-semibold)` across all CSS modules
- Replaced `var(--font-bold)` with `var(--font-weight-bold)` across all CSS modules
- Font family references (--font-sans, --font-mono) left unchanged (correct namespace already)
- 503 replacements across 83 module CSS files (+ 3 in globals.css = 506 total)
- **Commit:** `bd5da3a`

## Namespace Summary

Four typography namespaces now in @theme:

| Namespace | Purpose | Example |
|-----------|---------|---------|
| --font-* | Font families | --font-sans, --font-mono |
| --text-* | Font sizes | --text-sm, --text-lg |
| --font-weight-* | Font weights | --font-weight-semibold |
| --leading-* | Line heights | --leading-tight, --leading-normal |

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| --font-weight-* namespace | Rename weights from --font-* to --font-weight-* | Avoids collision with --font-* family namespace in Tailwind v4 |
| Font families keep --font-* | --font-sans and --font-mono unchanged | Already correct for Tailwind v4 font-family utilities |

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- Build: PASS (zero errors)
- Lint: PASS (zero warnings)
- Zero remaining `var(--font-normal)`, `var(--font-medium)`, `var(--font-semibold)`, `var(--font-bold)` references
- `var(--font-sans)` and `var(--font-mono)` still present (correct, not renamed)
- All 4 typography namespaces present in @theme

## Key Files

### Modified
- `src/styles/globals.css` -- typography tokens moved from :root to @theme
- 83 CSS module files -- font-weight var() references updated

## Dependencies

- **Requires:** 16-01 (@theme block exists), 16-03 (spacing already in @theme)
- **Provides:** Typography tokens in @theme with correct Tailwind v4 namespaces
- **Affects:** 16-05 (remaining token categories), 16-06 (verification)
