# Technology Stack: Design Token Consistency

**Project:** DSA Visualiser - Design Token Migration
**Researched:** 2026-01-31
**Scope:** Replacing 700+ hardcoded hex colors with CSS custom property references

## Executive Summary

**NO new libraries needed.** The existing stack (Tailwind v4 + TypeScript + React) provides everything required. This is a refactoring task, not a technology adoption task.

The solution is:
1. Create TypeScript modules exporting color objects that reference existing CSS vars
2. Replace inline `style={{ color: '#10b981' }}` with `style={{ color: 'var(--color-emerald-500)' }}`
3. Extract shared `levelInfo` patterns to reusable modules

## Recommended Stack (No Changes)

### Core Framework (Existing)
| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Tailwind CSS | ^4.1.18 | CSS framework with @theme | Already has 130+ tokens defined |
| TypeScript | ~5.5.0 | Type safety | Already configured |
| React | ^18.3.1 | UI framework | N/A for this milestone |
| Next.js | ^14.2.0 | Framework | N/A for this milestone |

### Why No New Libraries

**Evaluated and rejected:**

| Library | Why Not |
|---------|---------|
| vanilla-extract | Overkill - requires build pipeline changes, we already have @theme tokens |
| Style Dictionary | Design tool integration - not needed for React-only project |
| Stitches | CSS-in-JS runtime - contradicts existing Tailwind approach |
| Theme UI | Another theming system - would conflict with Tailwind |
| CSS Modules typed | Already phasing out CSS Modules |

**The project already has:**
- 130+ color tokens in `src/styles/globals.css` @theme block
- Semantic naming (`--color-emerald-500`, `--color-accent-green`)
- Opacity variants (`--color-emerald-20`, `--color-amber-30`)
- Difficulty levels (`--difficulty-easy: #22c55e`)

## Implementation Architecture

### Pattern 1: Shared Color Constants (TypeScript)

Create type-safe color reference modules:

```typescript
// src/constants/colors.ts (NEW FILE)

/**
 * CSS variable references for visualization colors.
 * These map to tokens defined in src/styles/globals.css @theme block.
 */

export const VIZ_COLORS = {
  // Level indicators (beginner/intermediate/advanced)
  level: {
    beginner: 'var(--color-emerald-500)',     // #10b981
    intermediate: 'var(--color-amber-500)',   // #f59e0b
    advanced: 'var(--color-red-500)',         // #ef4444
  },

  // Phase indicators
  phase: {
    creation: 'var(--color-blue-400)',        // #60a5fa
    execution: 'var(--color-emerald-500)',    // #10b981
    return: 'var(--color-amber-500)',         // #f59e0b
  },

  // Status indicators
  status: {
    hoisted: 'var(--color-amber-500)',
    initialized: 'var(--color-emerald-500)',
    tdz: 'var(--color-red-500)',
  },
} as const

// Type for color values (ensures only valid CSS var references)
export type CSSVarColor = `var(--color-${string})`
```

### Pattern 2: Typed LevelInfo Objects

Standardize the repeated `levelInfo` pattern across 56+ components:

```typescript
// src/constants/levelInfo.ts (NEW FILE)

import { VIZ_COLORS, type CSSVarColor } from './colors'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelConfig {
  label: string
  color: CSSVarColor
  description?: string
}

export const LEVEL_INFO: Record<Level, LevelConfig> = {
  beginner: {
    label: 'Beginner',
    color: VIZ_COLORS.level.beginner,
    description: 'Foundational concepts',
  },
  intermediate: {
    label: 'Intermediate',
    color: VIZ_COLORS.level.intermediate,
    description: 'Applied patterns',
  },
  advanced: {
    label: 'Advanced',
    color: VIZ_COLORS.level.advanced,
    description: 'Edge cases and optimizations',
  },
} as const
```

### Pattern 3: Component Usage

Before (current):
```tsx
const levelInfo = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

<span style={{ background: levelInfo[level].color }}>
```

After (migrated):
```tsx
import { LEVEL_INFO } from '@/constants/levelInfo'

<span style={{ background: LEVEL_INFO[level].color }}>
```

## Type Safety Strategy

### Option A: Minimal (Recommended)

Use `as const` assertions and simple string types:

```typescript
export type CSSVarColor = `var(--color-${string})`

const colors = {
  primary: 'var(--color-brand-primary)' as CSSVarColor,
} as const
```

**Why:** Simple, zero runtime cost, catches typos in color references.

### Option B: Full Validation (Not Recommended)

Would require:
1. Build-time script to parse globals.css and generate types
2. Complex generic types to validate var() references
3. Additional tooling maintenance

**Why not:** Over-engineering for this scope. The existing tokens are stable and well-named.

## CSS Variable Access in React

### Inline Styles (Primary Method)

```tsx
// Direct reference - works everywhere
<div style={{ backgroundColor: 'var(--color-emerald-500)' }}>

// With opacity using existing tokens
<div style={{ backgroundColor: 'var(--color-emerald-20)' }}>
```

### Dynamic Styles with Framer Motion

```tsx
// Framer Motion supports CSS variables
<motion.div
  animate={{ backgroundColor: 'var(--color-emerald-500)' }}
/>

// For transitions between colors
<motion.span
  initial={{ color: 'var(--color-amber-500)' }}
  animate={{ color: 'var(--color-emerald-500)' }}
/>
```

### Computed Values (Rare Cases)

```tsx
// Only if you need the resolved hex value
const getResolvedColor = (varName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
}
```

## File Structure

```
src/
  constants/
    colors.ts           # CSS var references, semantic groupings
    levelInfo.ts        # Shared level configuration
    phaseColors.ts      # Execution phase colors (optional)
    index.ts            # Barrel export
  styles/
    globals.css         # @theme block (existing, no changes needed)
```

## What NOT To Do

### Do NOT Create a CSS-in-JS Migration

**Bad:**
```tsx
// Don't add styled-components or emotion
import styled from 'styled-components'
const Box = styled.div`background: ${props => props.theme.colors.primary};`
```

**Why:** Adds runtime cost, conflicts with Tailwind, unnecessary abstraction.

### Do NOT Generate TypeScript Types from CSS

**Bad:**
```bash
# Don't add build scripts to parse CSS
npm run generate-types
```

**Why:** Over-engineering. Manual TypeScript constants are sufficient and more maintainable.

### Do NOT Create Component-Scoped CSS Variables

**Bad:**
```tsx
// Don't shadow global tokens with component-scoped ones
<div style={{ '--component-color': 'var(--color-emerald-500)' }}>
```

**Why:** Adds indirection. Reference global tokens directly.

### Do NOT Use Tailwind Utilities for Dynamic Colors

**Bad:**
```tsx
// Don't try to use Tailwind classes for data-driven colors
className={`bg-${level === 'beginner' ? 'emerald' : 'amber'}-500`}
```

**Why:** Tailwind purges unused classes. Dynamic class names don't work.

## Migration Scope

### Files to Create
- `src/constants/colors.ts` - Color token references
- `src/constants/levelInfo.ts` - Shared level configuration
- `src/constants/index.ts` - Barrel export

### Files to Modify
- 61 visualization components (per grep count)
- Replace hardcoded hex colors with CSS var references
- Import shared constants instead of inline `levelInfo` objects

### Files to NOT Modify
- `src/styles/globals.css` - Tokens already defined
- `package.json` - No new dependencies

## Confidence Assessment

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| No new libraries | HIGH | @theme already provides tokens, adding libraries increases complexity |
| TypeScript constants | HIGH | Simple, type-safe, zero runtime cost |
| CSS var syntax | HIGH | Native browser support, Framer Motion compatible |
| Shared levelInfo | HIGH | Clear pattern repeated across 56+ components |

## Sources

- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) - Official documentation on @theme directive
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) - CSS-first configuration details
- [Type-Safe Design Tokens in Tailwind 4](https://dev.to/wearethreebears/exploring-typesafe-design-tokens-in-tailwind-4-372d) - TypeScript patterns
- [vanilla-extract](https://vanilla-extract.style/) - Evaluated and rejected (too complex for this use case)
- [TypeScript CSS Variables in React](https://8hob.io/posts/type-css-variables-react/) - CSSProperties typing patterns
