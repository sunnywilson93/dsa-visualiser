# Architecture: CSS Module to Tailwind v4 Migration

**Project:** DSA Visualiser - Tailwind Migration
**Researched:** 2026-01-27
**Confidence:** HIGH (based on direct codebase analysis + verified Tailwind v4 docs)

## Current State Analysis

### Inventory

| Category | Count | Total CSS Lines | Complexity |
|----------|-------|----------------|------------|
| Concepts Viz (`src/components/Concepts/`) | 30 files | ~12,756 | HIGH - animations, grids, pseudo-elements |
| App Pages (`src/app/`) | 8 files | ~2,400 | MEDIUM - layouts, responsive |
| DSA Patterns (`src/components/DSAPatterns/`) | 3 files | ~1,587 | HIGH - complex grids, animations |
| Shared/UI Components | 24 files | ~3,500 | LOW-MEDIUM - standard layouts |
| SharedViz (`src/components/SharedViz/`) | 3 files | ~700 | MEDIUM - reusable step controls |
| ConceptPanel | 4 files | ~1,000 | MEDIUM |
| **Total** | **~82 files** | **~25,000 lines** | |

### Current Architecture

```
globals.css (@tailwind directives, v3 syntax)
  |-- 246 CSS custom properties in :root
  |-- @layer base (resets, typography)
  |-- @layer components (panel, badge, tooltip, icon-btn)
  |-- @layer utilities (animations, layout helpers)
  |
tailwind.config.js (v3 JS config)
  |-- colors mapping to CSS vars
  |-- spacing mapping to CSS vars
  |-- borderRadius mapping to CSS vars
  |
*.module.css files (74+ files)
  |-- Import as `styles` object in TSX
  |-- Use CSS custom properties from globals.css
  |-- Local class names (scoped by CSS Modules)
  |-- Some use `--js-viz-*` scoped variables (14 files)
```

### Critical Patterns Found

**1. No Tailwind utilities in markup.** Zero TSX files use Tailwind classes. The entire project is CSS Modules + CSS custom properties. Tailwind v4 is installed but only serves as the PostCSS pipeline -- the `@tailwind` directives in globals.css pull in base/reset styles.

**2. Dynamic class access via bracket notation.** 17 instances of `styles[variable]` where a runtime string selects a CSS class. Example: `className={styles[state]}` where `state` is `"comparing"` | `"swapping"` | `"accessed"`. These CANNOT be directly replaced with Tailwind utilities -- they need a mapping object or conditional classes.

**3. Template literal className composition.** 284 instances of `` className={`${styles.x} ${styles.y}`} ``. These concatenate multiple module classes and will each need rewriting to Tailwind utility strings.

**4. CSS-only checkbox hack (NavBar).** The mobile menu uses `:checked` sibling selectors (`~`) on a hidden checkbox input. This is a pure CSS pattern that has no direct Tailwind utility equivalent. Options: keep as custom CSS with `@layer`, or refactor to React state (recommended -- cleaner, more maintainable).

**5. Massive duplication in Concepts Viz.** 21 of 30 Concepts Viz files share identical `.levelSelector`, `.levelBtn`, `.exampleSelector`, `.exampleBtn` patterns. This is ~40 lines duplicated 21 times. Migration should extract shared utility patterns.

**6. Inline styles for dynamic values.** Components like `CallStack`, `CardGrid`, and DSAPattern visualizations pass CSS custom properties via `style={{ '--frame-color': color }}`. These are fine with Tailwind -- arbitrary properties work: `style={{ '--frame-color': color }}` stays, utility classes reference the var.

**7. `--js-viz-*` scoped variables.** 14 files reference visualization-specific variables that are NOT defined in globals.css. These appear to be inherited from parent component contexts or defined locally. Need to trace their definition source before migration.

---

# Architecture: Design Token Consistency

**Addendum:** 2026-01-31
**Focus:** TypeScript design token objects for visualization components
**Confidence:** HIGH (based on direct codebase analysis)

## Problem Statement

56 visualization components in `src/components/Concepts/` hardcode color values that duplicate tokens already defined in `globals.css`:

| Pattern | Occurrences | Duplicated Value |
|---------|-------------|------------------|
| `levelInfo` object | 39 files | `#10b981`, `#f59e0b`, `#ef4444` |
| Inline `style={{ }}` | 147 instances | Various hex colors |
| `getPhaseColor` functions | 21 files | `#60a5fa`, `#10b981`, `#f59e0b` |
| `getStatusColor` functions | Multiple | `#f59e0b`, `#10b981`, `#ef4444` |

**Token mapping:**
- `#10b981` = `--color-emerald-500` = `--difficulty-1`
- `#f59e0b` = `--color-amber-500` = `--difficulty-2`
- `#ef4444` = `--difficulty-hard` / `--color-red-500`

## Recommended File Structure

```
src/
  styles/
    globals.css              # Existing - CSS custom properties (source of truth)
    tokens.ts                # NEW - TypeScript token accessors
  components/
    Concepts/
      _shared/               # NEW - Shared visualization utilities
        index.ts             # Barrel export
        levelInfo.ts         # Shared level configuration
        phaseColors.ts       # Shared phase color mappings
        statusColors.ts      # Shared status color mappings
      ClosuresViz.tsx        # Modified - imports from _shared
      HoistingViz.tsx        # Modified - imports from _shared
      ...
```

## Integration Points

### 1. TypeScript Token Accessor (`src/styles/tokens.ts`)

Provides TypeScript access to CSS custom properties with type safety.

```typescript
export const cssVar = (name: string) => `var(--${name})`

export const colors = {
  difficulty: {
    easy: cssVar('difficulty-1'),
    medium: cssVar('difficulty-2'),
    hard: cssVar('difficulty-hard'),
  },
  emerald: { 500: cssVar('color-emerald-500') },
  amber: { 500: cssVar('color-amber-500') },
} as const

export const colorValues = {
  difficulty: {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  },
} as const
```

**Why two exports:**
- `colors` uses `var(--name)` for CSS compatibility
- `colorValues` has actual hex values for dynamic inline styles that construct gradients or need string manipulation

### 2. Shared Level Configuration (`src/components/Concepts/_shared/levelInfo.ts`)

```typescript
import { colorValues } from '@/styles/tokens'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: colorValues.difficulty.easy },
  intermediate: { label: 'Intermediate', color: colorValues.difficulty.medium },
  advanced: { label: 'Advanced', color: colorValues.difficulty.hard },
}

export const levelClasses: Record<Level, { bg: string; border: string; text: string }> = {
  beginner: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/70',
    text: 'text-emerald-400',
  },
  intermediate: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/70',
    text: 'text-amber-400',
  },
  advanced: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/70',
    text: 'text-red-400',
  },
}
```

### 3. Shared Phase Colors (`src/components/Concepts/_shared/phaseColors.ts`)

```typescript
export type ExecutionPhase = 'Creation' | 'Execution' | 'Return' | 'sync' | 'micro' | 'macro' | 'idle'

export const phaseColors: Record<string, string> = {
  Creation: '#60a5fa',
  Execution: '#10b981',
  Return: '#f59e0b',
  sync: '#a855f7',
  micro: '#a855f7',
  macro: '#f59e0b',
  idle: '#555555',
}

export const getPhaseColor = (phase: string): string => phaseColors[phase] ?? '#888888'
```

### 4. Shared Status Colors (`src/components/Concepts/_shared/statusColors.ts`)

```typescript
export type VariableStatus = 'hoisted' | 'initialized' | 'tdz'

export const statusColors: Record<VariableStatus, string> = {
  hoisted: '#f59e0b',
  initialized: '#10b981',
  tdz: '#ef4444',
}

export const getStatusColor = (status: VariableStatus): string => statusColors[status]
```

### 5. Barrel Export (`src/components/Concepts/_shared/index.ts`)

```typescript
export { levelInfo, levelClasses, type Level } from './levelInfo'
export { phaseColors, getPhaseColor, type ExecutionPhase } from './phaseColors'
export { statusColors, getStatusColor, type VariableStatus } from './statusColors'
```

## Component Usage Patterns

### Before (Current State)

```tsx
const levelInfo = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' },
}

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'Creation': return '#60a5fa'
    case 'Execution': return '#10b981'
    default: return '#888'
  }
}

<span style={{ background: levelInfo[level].color }} />
```

### After (Migrated)

```tsx
import { levelInfo, getPhaseColor } from './_shared'

<span style={{ background: levelInfo[level].color }} />
```

## Build Order (Dependencies)

```
Phase 1: Create shared modules (no dependencies)
    src/styles/tokens.ts
    |
    v
Phase 2: Create _shared utilities (depends on tokens.ts)
    src/components/Concepts/_shared/levelInfo.ts
    src/components/Concepts/_shared/phaseColors.ts
    src/components/Concepts/_shared/statusColors.ts
    src/components/Concepts/_shared/index.ts
    |
    v
Phase 3: Migrate components (depends on _shared/)
    39 files with levelInfo
    21 files with getPhaseColor
    ~10 files with getStatusColor
    |
    v
Phase 4: Audit remaining inline styles
    147 style={{ }} instances
```

## Migration Strategy: Incremental

**Rationale:** 56 components with 400+ hardcoded values. Big-bang migration is risky.

| Phase | Focus | Files | Risk |
|-------|-------|-------|------|
| 1 | Create shared modules | 5 new files | LOW |
| 2 | Migrate levelInfo | 39 files | LOW |
| 3 | Migrate phaseColors | 21 files | LOW |
| 4 | Migrate statusColors | ~10 files | LOW |
| 5 | Audit remaining inline | All | MEDIUM |

### Per-File Migration Steps

1. Add import: `import { levelInfo } from './_shared'`
2. Remove local `const levelInfo = { ... }` definition
3. Verify no compilation errors
4. Visual verification (same appearance)

## Anti-Patterns to Avoid

### 1. Duplicating Token Values

**Bad:**
```typescript
// tokens.ts
export const colors = { emerald500: '#10b981' }

// levelInfo.ts
export const levelInfo = { beginner: { color: '#10b981' } } // Duplicated!
```

**Good:**
```typescript
// tokens.ts
export const colorValues = { emerald500: '#10b981' }

// levelInfo.ts
import { colorValues } from '@/styles/tokens'
export const levelInfo = { beginner: { color: colorValues.emerald500 } }
```

### 2. Breaking CSS Variable Chain

**Bad:**
```tsx
<div style={{ background: '#10b981' }} />
```

**Good:**
```tsx
<div className="bg-emerald-500" />
// Or when dynamic is needed:
<div style={{ background: 'var(--color-emerald-500)' }} />
```

### 3. Over-engineering

**Bad:**
```typescript
const useThemeAwareColor = (level: Level, variant: ColorVariant) => { ... }
```

**Good:**
```typescript
import { levelInfo } from './_shared'
const color = levelInfo[level].color
```

## Validation Strategy

For each migrated component:

1. **Grep check:** No hex colors remain in file
   ```bash
   grep -E "#[0-9a-fA-F]{6}" ComponentViz.tsx
   ```
2. **Visual verification:** Component renders identically
3. **Type check:** `npm run build` passes

## Open Questions

1. **Opacity variants:** Current code uses `${color}15` for 15% opacity. Should `levelInfo` include pre-computed background variants?

2. **Future Tailwind migration:** These shared objects support the eventual Tailwind v4 migration by centralizing color values. When Tailwind utilities replace inline styles, only `_shared/*.ts` files need updating.

---

## Recommended Migration Order (Updated)

The original Tailwind v4 migration plan (Phases 1-8) should incorporate design token consistency as a **pre-requisite step before Phase 5 (Concepts Viz)**.

**Revised Phase Order:**

| Phase | Scope | Notes |
|-------|-------|-------|
| 1 | Foundation (@theme + config) | Original |
| 2 | Simple leaf components | Original |
| 3 | Responsive + pseudo-element | Original |
| 4 | NavBar + complex layout | Original |
| **4.5** | **Design Token Shared Modules** | **NEW: Create _shared/, migrate levelInfo** |
| 5 | Concepts Viz (bulk) | Now uses _shared/ |
| 6 | DSA + Visualization | Original |
| 7 | App page layouts | Original |
| 8 | Cleanup + audit | Original |

---

## Sources

**Codebase Analysis (HIGH confidence):**
- Direct inspection of 56 Concepts Viz components
- Grep analysis: 402 occurrences of `#10b981`, `#f59e0b`, `#ef4444`
- Pattern analysis of `levelInfo`, `getPhaseColor`, `getStatusColor`
- `globals.css` token inventory (130+ tokens in @theme block)

**TypeScript Best Practices (HIGH confidence):**
- Barrel export pattern for module organization
- Type-safe color mapping with `as const`
- Path alias usage (`@/styles/tokens`)
