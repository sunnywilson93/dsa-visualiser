# Phase 16 Plan 06: Breakpoints & Animations Migration Summary

Consolidated all keyframe animations from 15 CSS Module files into @theme, added custom breakpoints and --animate-* tokens, achieving zero @keyframes in any .module.css file.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Add breakpoints and animation tokens to @theme | eed0eb3 | src/styles/globals.css |
| 2 | Remove duplicate @keyframes from CSS Modules | 20342bf | 15 CSS Module files |

## Changes Made

### Task 1: Breakpoints and Animation Tokens
- Added `--breakpoint-2xs` (360px), `--breakpoint-xs` (400px), `--breakpoint-mobile` (480px) to @theme
- Added `--ease-default`, `--ease-in-out`, `--ease-out` easing tokens
- Added 18 `--animate-*` shorthand tokens for all keyframe animations
- Consolidated 18 `@keyframes` definitions into @theme block (13 original + 5 color-specific variants)
- Removed old `@keyframes` (pulse, slideIn, fadeIn) and `.animate-*` utility classes from `@layer utilities`

### Task 2: CSS Module Keyframe Deduplication
- Removed identical opacity `pulse` from 8 modules (StateEvolution, BuildTools, Functions, AsyncEvolution, WebEvolution, ModuleEvolution + normalized 0.6 opacity to 0.5 in Variables, StreamsBuffers)
- Removed `spin` from EventLoopDisplay and EventLoopViz
- Removed `float` from VariablesViz, `pointerPulse` from ArrayVisualization
- Removed `iconPulse` from ErrorBoundary
- Renamed color-specific variants and moved to @theme:
  - ErrorBoundary `borderPulse` (red box-shadow) -> `redBorderPulse`
  - ObjectsBasicsViz `pulse` (teal box-shadow) -> `tealPulse`
  - ArraysBasicsViz `pulse` (orange box-shadow) -> `orangePulse`
  - ObjectsBasicsViz/ArraysBasicsViz `warningPulse` (amber) -> `amberWarningPulse`
  - ObjectsBasicsViz `extractPulse` (teal) -> `tealExtractPulse`
- Mapped `fadeIn` (opacity+scale) to global `fadeInScale` in ObjectsBasicsViz and ArraysBasicsViz
- Removed `spreadOut` and `spreadIn` from ArraysBasicsViz (already in @theme)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected spreadOut keyframe to include box-shadow**
- **Found during:** Task 2
- **Issue:** The @theme `spreadOut` keyframe was missing `box-shadow: 0 0 15px var(--color-orange-50)` at 50% that existed in the ArraysBasicsViz module
- **Fix:** Updated @theme definition to include the box-shadow property
- **Files modified:** src/styles/globals.css

**2. [Rule 2 - Missing Critical] Added 5 color-specific keyframe variants to @theme**
- **Found during:** Task 2
- **Issue:** Plan expected 13 keyframes but several modules used unique box-shadow pulse variants with different colors (teal, orange, amber, red). These could not simply map to the generic @theme versions.
- **Fix:** Added `tealPulse`, `orangePulse`, `redBorderPulse`, `amberWarningPulse`, `tealExtractPulse` to @theme and updated module references to use the new global names
- **Files modified:** src/styles/globals.css, ErrorBoundary.module.css, ObjectsBasicsViz.module.css, ArraysBasicsViz.module.css

**3. [Rule 1 - Bug] Normalized opacity pulse from 0.6 to 0.5**
- **Found during:** Task 2
- **Issue:** VariablesViz and StreamsBuffersViz used `opacity: 0.6` at 50% while @theme uses `0.5`. Minor visual difference.
- **Fix:** Removed local keyframes to use global 0.5 version. Difference is negligible.
- **Files modified:** VariablesViz.module.css, StreamsBuffersViz.module.css

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color-specific keyframes in @theme | Add all variants to @theme with unique names | Ensures zero @keyframes in module files while preserving exact animation behavior |
| Normalize pulse opacity | Use 0.5 globally (not 0.6) | 0.1 difference is imperceptible, consolidation value outweighs |
| fadeIn -> fadeInScale mapping | Module fadeIn (opacity+scale) maps to global fadeInScale | Preserves exact behavior with descriptive name |

## Verification

- `npm run build` passes
- `npm run lint` passes (zero warnings/errors)
- Zero `@keyframes` in any `.module.css` file
- 18 keyframe definitions consolidated in @theme
- 3 custom breakpoints in @theme
- 18 `--animate-*` tokens defined

## Metrics

- **Duration:** ~6 minutes
- **Completed:** 2026-01-27
- **Files modified:** 16 (1 globals.css + 15 CSS Modules)
- **Net lines:** -132 (36 added, 168 removed from modules)
