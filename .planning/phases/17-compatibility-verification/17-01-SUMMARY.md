---
phase: 17-compatibility-verification
plan: 01
subsystem: tooling
tags: [postcss, postcss-value-parser, css-custom-properties, static-analysis, lint]

requires:
  - phase: 16-config-token-migration
    provides: "@theme tokens and consolidated keyframes in globals.css"
provides:
  - "npm run check:vars -- static var() reference validation"
  - "npm run check:keyframes -- @keyframes module lint"
  - "npm run tokens:audit -- token usage report"
affects: [17-03-var-reference-fixes, 17-04-data-file-audit]

tech-stack:
  added: [postcss-value-parser]
  patterns: [PostCSS AST analysis scripts, cross-module property inheritance detection]

key-files:
  created:
    - scripts/check-vars.ts
    - scripts/check-keyframes.ts
    - scripts/tokens-audit.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Cross-module CSS inheritance: check-vars resolves properties defined in any module file, not just the consuming file"
  - "Dynamic allowlist for inline-style-injected properties kept separate from cross-module detection"

patterns-established:
  - "PostCSS scripts pattern: scripts/*.ts using postcss + postcss-value-parser + fs.globSync"
  - "npm script naming: check:* for linting gates, tokens:* for informational reports"

duration: 4min
completed: 2026-01-27
---

# Phase 17 Plan 01: Static Analysis Scripts Summary

**Three PostCSS-based CI scripts: var() reference checker (9122 refs across 88 files), keyframes module lint, and token usage audit (263 defined, 209 referenced)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-27T09:20:54Z
- **Completed:** 2026-01-27T09:24:33Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- check:vars validates all var() references resolve from globals.css, cross-module definitions, or dynamic allowlist -- found 1 genuinely orphaned reference (--rule-color)
- check:keyframes confirms zero @keyframes in CSS Modules post-Phase-16 consolidation
- tokens:audit reports 263 global tokens, 75 unused, 21 cross-module (non-global) references, 14 component-scoped tokens

## Task Commits

Each task was committed atomically:

1. **Task 1: Create static var() reference checker script** - `f5a43c3` (feat)
2. **Task 2: Create keyframes lint and token audit scripts** - `335a102` (feat)

## Files Created/Modified
- `scripts/check-vars.ts` - PostCSS-based var() reference checker with globals, cross-module, allowlist, and fallback resolution
- `scripts/check-keyframes.ts` - @keyframes at-rule detector for CSS Module files
- `scripts/tokens-audit.ts` - Token usage audit comparing globals.css definitions against module file references
- `package.json` - Added check:vars, check:keyframes, tokens:audit npm scripts + postcss-value-parser devDependency

## Decisions Made
- Cross-module CSS inheritance detection: Rather than only checking local file definitions, check-vars collects custom properties from ALL module files to account for DOM cascade inheritance (e.g., --js-viz-* set in SharedViz/CodePanel.module.css, consumed in EventLoopViz.module.css)
- Dynamic allowlist kept for truly inline-style-injected properties (--era-color, --stagger, etc.) as a separate mechanism from cross-module detection

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used fileURLToPath instead of import.meta.dirname**
- **Found during:** Task 1 (check-vars.ts initial run)
- **Issue:** `import.meta.dirname` returned undefined when run via tsx, causing path resolution to fail
- **Fix:** Used `fileURLToPath(import.meta.url)` + `dirname()` for __dirname equivalent
- **Files modified:** scripts/check-vars.ts
- **Verification:** Script runs successfully
- **Committed in:** f5a43c3

**2. [Rule 1 - Bug] Added cross-module property resolution to avoid false positives**
- **Found during:** Task 1 (check-vars.ts initial run)
- **Issue:** 63 false positives for --js-viz-* properties that are defined in parent CSS Modules and inherited via DOM cascade
- **Fix:** Added `collectAllModuleProperties()` to gather definitions from all module files, merging with globals for resolution
- **Files modified:** scripts/check-vars.ts
- **Verification:** False positives reduced from 63 to 1 (the genuinely orphaned --rule-color)
- **Committed in:** f5a43c3

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct operation. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- check:vars identified 1 unresolved reference (--rule-color in SharedViz.module.css) for Plan 03 to fix
- tokens:audit identified 75 unused global tokens and 3 non-prefixed --text-* references in patternId page for Plan 03/04 to address
- All three scripts ready for CI integration

---
*Phase: 17-compatibility-verification*
*Completed: 2026-01-27*
