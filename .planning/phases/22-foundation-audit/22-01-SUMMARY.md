---
phase: 22-foundation-audit
plan: 01
subsystem: ui
tags: [css-vars, design-tokens, typescript]

requires: []
provides:
  - Complete opacity variants for emerald/amber/red/blue (15, 20, 30, 40)
  - Shared levelInfo module with CSS var references
  - Level type and LevelConfig interface
affects:
  - 22-02 (phaseColors module)
  - 22-03 (statusColors module)
  - 23-01..03 (level indicators migration)

tech-stack:
  added: []
  patterns:
    - CSS var references in TypeScript constants
    - Opacity variant naming convention (color-N where N is percentage)

key-files:
  created:
    - src/constants/levelInfo.ts
  modified:
    - src/styles/globals.css

key-decisions:
  - "bg uses 15% opacity, border uses 40% opacity for level indicators"
  - "CSS vars reference --color-{color}-{shade} format from @theme"

patterns-established:
  - "Shared constants use CSS var() references, not hex codes"
  - "Level types: beginner/intermediate/advanced with emerald/amber/red colors"

duration: 5min
completed: 2026-01-31
---

# Phase 22 Plan 01: Add Opacity Variants and LevelInfo Module Summary

**Complete @theme opacity matrix (4 colors x 4 variants) and shared levelInfo constant with CSS var references for difficulty level styling**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-31T13:09:25Z
- **Completed:** 2026-01-31T13:14:30Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added missing opacity variants to @theme (blue-30, blue-40, red-40)
- Complete 16-variant matrix for level indicator colors (emerald/amber/red/blue x 15/20/30/40)
- Created shared levelInfo.ts module with typed exports
- LEVEL_INFO uses CSS var references for consistency with design tokens

## Task Commits

Each task was committed atomically:

1. **Task 1: Add missing opacity variants to @theme** - `2a39a1c` (feat)
2. **Task 2: Create levelInfo module with CSS var references** - `1143037` (feat)

## Files Created/Modified

- `src/styles/globals.css` - Added --color-blue-30, --color-blue-40, --color-red-40 opacity variants
- `src/constants/levelInfo.ts` - New module exporting Level type, LevelConfig interface, LEVEL_INFO constant

## Decisions Made

- bg property uses 15% opacity (var(--color-{color}-15)) for subtle backgrounds
- border property uses 40% opacity (var(--color-{color}-40)) for visible borders
- Optional description field included for backward compatibility with components using tooltips

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Opacity variants ready for levelInfo CSS var references
- levelInfo module ready for import by 42+ components
- Foundation complete for 22-02 (phaseColors) and 22-03 (statusColors)

---
*Phase: 22-foundation-audit*
*Completed: 2026-01-31*
