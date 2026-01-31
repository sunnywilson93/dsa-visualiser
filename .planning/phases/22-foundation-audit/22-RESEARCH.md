# Phase 22: Foundation & Audit - Research

**Researched:** 2026-01-31
**Domain:** Design token infrastructure and visual regression baseline for React visualization components
**Confidence:** HIGH

## Summary

This phase establishes shared infrastructure (TypeScript modules for color patterns) and captures a visual regression baseline before any migration work begins. The research confirms that no new libraries are needed -- the existing stack (Tailwind v4 @theme + TypeScript + Playwright) provides everything required.

Three shared modules need creation: `levelInfo.ts` (difficulty colors used in 42 components), `phaseColors.ts` (execution phase colors in 20 components), and `statusColors.ts` (variable state colors in 4 components). All modules export CSS variable references as typed constants, enabling compile-time validation without runtime overhead.

The @theme block already defines most opacity variants needed, but is missing some combinations (e.g., `--color-red-40`, `--color-blue-30`, `--color-blue-40`). These gaps must be filled before migration. Visual regression infrastructure exists (321 baseline snapshots) but should be verified current before migration begins.

**Primary recommendation:** Create shared modules exporting CSS var references with TypeScript types, add missing opacity variants to @theme, then capture fresh visual regression baseline.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^4.1.18 | @theme block for CSS custom properties | Already configured, 130+ tokens defined |
| TypeScript | ~5.5.0 | Type-safe color constants | Existing configuration, zero runtime cost |
| Playwright | ^1.58.0 | Visual regression testing | Already configured with 3 viewports |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | ^4.0.16 | Unit testing for color modules | Validate module exports |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript constants | vanilla-extract | Adds build complexity, overkill for this use case |
| CSS variables | Style Dictionary | Adds transformation pipeline, CSS-native approach simpler |
| Manual @theme tokens | Generated types | Over-engineering, tokens are stable |

**Installation:**
```bash
# No new packages needed - stack is complete
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  constants/
    levelInfo.ts        # Beginner/intermediate/advanced colors
    phaseColors.ts      # Execution phase colors (creation/execution/return)
    statusColors.ts     # Variable state colors (hoisted/tdz/initialized)
    animationColors.ts  # Hex constants for Framer Motion (Phase 25)
    index.ts            # Barrel export
  styles/
    globals.css         # @theme block (existing, add missing variants)
```

### Pattern 1: CSS Variable Reference Objects
**What:** TypeScript modules export objects with CSS `var()` references as string values
**When to use:** All shared color patterns (levelInfo, phaseColors, statusColors)
**Example:**
```typescript
// Source: Codebase analysis + STACK-DESIGN-TOKENS.md
export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelConfig {
  label: string
  color: string  // CSS var reference
  bg: string     // Background variant (15% opacity)
  border: string // Border variant (40% opacity)
}

export const LEVEL_INFO: Record<Level, LevelConfig> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-15)',
    border: 'var(--color-emerald-40)',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-amber-500)',
    bg: 'var(--color-amber-15)',
    border: 'var(--color-amber-40)',
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-red-500)',
    bg: 'var(--color-red-15)',
    border: 'var(--color-red-40)',
  },
} as const
```

### Pattern 2: Phase Color Function
**What:** TypeScript function returning CSS var reference based on phase name
**When to use:** Execution phase indicators in async/promise visualizations
**Example:**
```typescript
// Source: PromisesCreationViz.tsx analysis
type Phase = 'Creation' | 'Executor' | 'Resolve' | 'Complete' | 'Schedule' | 'Continue'

export const getPhaseColor = (phase: Phase): string => {
  const phaseColors: Record<Phase, string> = {
    Creation: 'var(--color-blue-400)',     // #60a5fa
    Executor: 'var(--color-amber-500)',    // #f59e0b
    Resolve: 'var(--color-emerald-500)',   // #10b981
    Complete: 'var(--color-emerald-500)',  // #10b981
    Schedule: 'var(--color-purple-400)',   // #c4b5fd
    Continue: 'var(--color-gray-400)',     // #94a3b8
  }
  return phaseColors[phase] ?? 'var(--color-gray-400)'
}
```

### Pattern 3: Opacity Variant Pre-definition
**What:** Define all required opacity variants in @theme to avoid runtime template literal construction
**When to use:** All colors that need transparency (backgrounds, box-shadows, borders)
**Example:**
```css
/* Source: globals.css existing pattern, extended */
@theme {
  /* Emerald already complete */
  --color-emerald-15: rgba(52, 211, 153, 0.15);
  --color-emerald-40: rgba(52, 211, 153, 0.4);

  /* Amber already complete */
  --color-amber-15: rgba(251, 191, 36, 0.15);
  --color-amber-40: rgba(251, 191, 36, 0.4);

  /* Red NEEDS 40 variant */
  --color-red-40: rgba(251, 113, 133, 0.4);  /* ADD THIS */

  /* Blue NEEDS 30, 40 variants */
  --color-blue-30: rgba(56, 189, 248, 0.3);  /* ADD THIS */
  --color-blue-40: rgba(56, 189, 248, 0.4);  /* ADD THIS */
}
```

### Anti-Patterns to Avoid
- **Template literal opacity suffixes:** `${color}15` breaks with CSS vars; pre-define all opacity variants
- **getComputedStyle in render:** Causes layout thrashing; cache results or use static references
- **CSS vars in Framer Motion animate:** Framer cannot interpolate; use hex constants for animations
- **Component-scoped tokens:** Fragments the system; use shared modules

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color opacity variants | Runtime opacity calculation | Pre-defined @theme variants | Template literals break with CSS vars |
| Type-safe color references | Complex generic types | Simple string types with `as const` | Over-engineering for stable tokens |
| Visual regression testing | Custom screenshot comparison | Playwright's built-in snapshot testing | Already configured, handles diffs |
| CSS variable resolution | getComputedStyle per-render | Static CSS var references | Performance; layout thrashing |
| Color animation | CSS var in Framer Motion | Hex constants file (Phase 25) | Framer Motion cannot interpolate CSS vars |

**Key insight:** The @theme block already has most infrastructure. The work is creating TypeScript convenience wrappers, not building new systems.

## Common Pitfalls

### Pitfall 1: Template Literal Opacity Suffix Pattern
**What goes wrong:** Migrating `${levelInfo[lvl].color}15` to use CSS var produces `var(--color-emerald-500)15` - invalid CSS
**Why it happens:** Developers assume string concatenation works the same way with CSS vars
**How to avoid:** Pre-define all opacity variants in @theme (15, 20, 30, 40 for each accent color); export object with `color`, `bg`, `border` properties
**Warning signs:** Backgrounds appear solid instead of semi-transparent; console may show no error

### Pitfall 2: Missing Opacity Variants in @theme
**What goes wrong:** Migration blocked because component needs `--color-red-40` but only `--color-red-30` exists
**Why it happens:** @theme was built incrementally; not all combinations exist
**How to avoid:** Audit existing codebase for all `${color}XX` patterns; add missing variants before migration
**Warning signs:** Build succeeds but colors render wrong; need to add tokens mid-migration

### Pitfall 3: Color Value Mismatch
**What goes wrong:** `#10b981` (emerald-500) migrated to `--color-accent-green` which is `#34d399` - different shade
**Why it happens:** Multiple similar tokens exist; no documented mapping
**How to avoid:** Create explicit mapping document; use exact matches only
**Warning signs:** Colors appear "slightly off"; visual regression tests fail

### Pitfall 4: Stale Visual Baseline
**What goes wrong:** Visual regression tests fail but it's unclear if failure is from migration or pre-existing difference
**Why it happens:** Baseline was captured at different code state; new components added since
**How to avoid:** Capture fresh baseline immediately before migration; verify baseline covers all 56 viz components
**Warning signs:** Tests fail on first run before any changes; snapshots don't match current routes

### Pitfall 5: Inconsistent Type Definitions
**What goes wrong:** One file uses `Level = 'beginner' | 'intermediate' | 'advanced'`, another uses `DifficultyLevel` enum
**Why it happens:** No centralized type definition; each file defines its own
**How to avoid:** Export types from shared module; all consumers import from single source
**Warning signs:** TypeScript errors after migration; need to maintain multiple type definitions

## Code Examples

Verified patterns from codebase analysis:

### levelInfo Module Structure
```typescript
// src/constants/levelInfo.ts
// Source: Pattern from 42 components in codebase

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelConfig {
  label: string
  color: string
  bg: string
  border: string
}

export const LEVEL_INFO: Record<Level, LevelConfig> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-emerald-500)',
    bg: 'var(--color-emerald-15)',
    border: 'var(--color-emerald-40)',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-amber-500)',
    bg: 'var(--color-amber-15)',
    border: 'var(--color-amber-40)',
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-red-500)',
    bg: 'var(--color-red-15)',
    border: 'var(--color-red-40)',
  },
} as const
```

### Component Usage After Migration
```typescript
// Before (current):
const levelInfo = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

<button
  style={{
    borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
    background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
  }}
>

// After (migrated):
import { LEVEL_INFO } from '@/constants/levelInfo'

<button
  style={{
    borderColor: level === lvl ? LEVEL_INFO[lvl].color : 'transparent',
    background: level === lvl ? LEVEL_INFO[lvl].bg : 'transparent'
  }}
>
```

### Missing @theme Variants to Add
```css
/* Source: globals.css gap analysis */
@theme {
  /* Red scale - add missing 40 variant */
  --color-red-40: rgba(251, 113, 133, 0.4);

  /* Blue scale - add missing 30, 40 variants */
  --color-blue-30: rgba(56, 189, 248, 0.3);
  --color-blue-40: rgba(56, 189, 248, 0.4);
}
```

### Visual Regression Verification
```bash
# Capture fresh baseline before migration
npm run test:visual:update

# After each migration batch, compare
npm run test:visual

# View diff report
npx playwright show-report
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline `levelInfo` objects per component | Shared module import | This phase | Eliminates 42 duplications |
| `${color}15` template literals | Pre-defined `--color-*-15` tokens | This phase | Fixes CSS var compatibility |
| Per-component type definitions | Centralized `Level` type export | This phase | Single source of truth |

**Deprecated/outdated:**
- Inline hex colors in TypeScript: Being replaced with CSS var references
- Template literal opacity construction: Breaks with CSS vars, use pre-defined variants

## Open Questions

Things that couldn't be fully resolved:

1. **Exact color mapping for edge cases**
   - What we know: Most colors have direct token matches (#10b981 = --color-emerald-500)
   - What's unclear: 8-10 unique hex values in codebase don't have exact token matches
   - Recommendation: Create mapping document during implementation; add new tokens only if truly distinct

2. **Visual baseline coverage completeness**
   - What we know: 321 snapshots exist covering static routes, patterns, concepts, categories
   - What's unclear: Whether all 56 visualization component states are captured
   - Recommendation: Verify baseline captures all difficulty levels and example variants

3. **phaseColors phase name variations**
   - What we know: 20 components use getPhaseColor with ~15 different phase names
   - What's unclear: Full exhaustive list of all phase names used
   - Recommendation: Grep exhaustively during implementation; create comprehensive Phase union type

## Sources

### Primary (HIGH confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/styles/globals.css` - @theme block analysis
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/research/PITFALLS-DESIGN-TOKENS.md` - Verified pitfalls
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/research/STACK-DESIGN-TOKENS.md` - Architecture patterns
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/e2e/visual-regression.spec.ts` - Existing test infrastructure
- Codebase grep analysis: 42 levelInfo instances, 20 phaseColors instances, 4 statusColors instances

### Secondary (MEDIUM confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/research/FEATURES-TOKENS.md` - Feature landscape
- Framer Motion GitHub issues #1652, #2390 - CSS variable animation limitations

### Tertiary (LOW confidence)
- None - all findings verified against codebase or official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified against existing package.json and globals.css
- Architecture: HIGH - Patterns derived from codebase analysis of 42+ components
- Pitfalls: HIGH - Verified in PITFALLS-DESIGN-TOKENS.md and cross-referenced with codebase

**Research date:** 2026-01-31
**Valid until:** 2026-02-28 (30 days - stable domain, no external dependencies)

## Implementation Checklist

Phase 22 specific preparation for planner:

### INFRA-01: levelInfo Module
- [ ] Create `src/constants/levelInfo.ts`
- [ ] Export `Level` type
- [ ] Export `LevelConfig` interface
- [ ] Export `LEVEL_INFO` constant with CSS var references
- [ ] Include `color`, `bg` (15%), `border` (40%) properties

### INFRA-02: phaseColors and statusColors Modules
- [ ] Grep all `getPhaseColor` usage to build exhaustive Phase union type
- [ ] Create `src/constants/phaseColors.ts`
- [ ] Grep all `stateColors`/`getStatusColor` usage
- [ ] Create `src/constants/statusColors.ts`

### INFRA-03: Opacity Variants in @theme
- [ ] Add `--color-red-40`
- [ ] Add `--color-blue-30`
- [ ] Add `--color-blue-40`
- [ ] Verify all 4 accent colors have 15, 20, 30, 40 variants

### INFRA-04: TypeScript Type Safety
- [ ] Use `as const` for compile-time literal types
- [ ] Export types from shared modules
- [ ] Barrel export via `src/constants/index.ts`

### MIG-04: Visual Regression Baseline
- [ ] Verify 321 existing snapshots are current
- [ ] Run `npm run test:visual` to confirm clean baseline
- [ ] If failures, run `npm run test:visual:update`
- [ ] Document baseline state before migration begins
