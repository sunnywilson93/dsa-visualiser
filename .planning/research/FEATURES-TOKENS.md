# Feature Landscape: Design Token Consistency

**Domain:** Design token migration for React visualization components
**Researched:** 2026-01-31
**Context:** 56 visualization components with 700+ hardcoded hex colors

## Table Stakes

Features that are essential for a successful token migration. Missing any of these = migration incomplete or creates new maintenance burden.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Semantic token layer** | Maps purpose to color (e.g., `--color-difficulty-beginner` not raw hex). Without this, you just move magic numbers elsewhere | Low | Already have 130+ tokens in @theme; need semantic aliases |
| **Consistent naming convention** | `--color-[category]-[concept]-[variant]` format enables discoverability and prevents naming drift | Low | Audit existing globals.css names, document convention |
| **Single source of truth** | All color values defined once in @theme, components reference only tokens | Medium | Eliminates the 37x duplication problem |
| **Difficulty level tokens** | `--difficulty-1/2/3` already exist but underutilized; semantic names like `--color-level-beginner` more discoverable | Low | Map to existing `#10b981`, `#f59e0b`, `#ef4444` |
| **Phase/state tokens** | Visualization phases (Creation/Execution/Return) need semantic tokens for consistent step indicators | Low | Currently hardcoded per component |
| **Gradient token system** | Neon box gradients repeated 15+ times (`linear-gradient(135deg, #f97316, #fbbf24)`) need tokens | Medium | Create `--gradient-neon-orange`, `--gradient-neon-purple` etc. |
| **Documentation of tokens** | Clear comments in globals.css explaining when to use each token category | Low | Prevents future hardcoding |
| **Tailwind v4 @theme integration** | Use native @theme block for all tokens, enabling Tailwind utility generation | Already done | Existing pattern in globals.css |

## Differentiators

Nice-to-have patterns that improve DX or enable future capabilities. Not blocking for MVP migration.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Component-scoped token overrides** | Allow `--js-viz-accent` pattern for per-visualization customization | Low | One component (ObjectsBasicsViz) already uses this |
| **TypeScript token constants** | Export token names as TS const for autocomplete in inline styles | Medium | Enables `style={{ color: tokens.levelBeginner }}` |
| **Dark/light mode preparation** | Structure tokens to support future theming (not implementing themes now) | Low | Use semantic names that don't assume dark mode |
| **Animation timing tokens** | Centralize animation durations used across visualizations | Low | Some exist already (`--animate-*`), extend pattern |
| **Opacity scale tokens** | Complete the `-10`, `-20`, `-30` pattern for all accent colors | Low | Partially done, gaps exist |
| **Gradient utility classes** | `.gradient-neon-orange` classes for common patterns | Low | Reduces inline style verbosity |
| **ESLint rule for hardcoded colors** | Warn on `#[0-9a-f]{6}` patterns in TSX files | Medium | Prevents regression after migration |
| **Token usage heatmap** | Script to report which tokens are used where | Medium | Useful for pruning unused tokens |

## Anti-Features

Things to deliberately NOT build. These patterns lead to over-engineering or create more problems than they solve.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Component-level token definitions** | 56 components x 12+ tokens each = 672+ tokens to maintain. Creates "token explosion" problem | Use shared semantic tokens; components reference common layer |
| **Token transformation pipeline** | Style Dictionary, token transformers add build complexity for no benefit when already using CSS-native @theme | Keep tokens in CSS; Tailwind v4 handles transformation |
| **Design token JSON/YAML source** | Adds translation step, potential drift, build dependency | Source of truth stays in CSS (globals.css @theme block) |
| **Figma token sync automation** | No Figma source files for this project; automation without source is overhead | Manual token definition is fine for project scale |
| **Per-component CSS modules for tokens** | Fragments the system; defeats purpose of centralization | All tokens in globals.css, components import via CSS vars |
| **Runtime token switching** | Theme provider, context, JS token injection adds React complexity | CSS custom properties already support runtime updates via :root |
| **Token versioning/deprecation system** | Over-engineering for 56-component project; adds process overhead | Simple migration: find/replace old tokens, remove when done |
| **Strict component/semantic/primitive 3-tier hierarchy** | Overkill for visualization components; adds mental overhead | 2-tier is sufficient: primitives + semantic |
| **Token abstraction layer (JS objects mapping to CSS vars)** | Adds indirection; harder to debug; breaks native CSS tooling | Use CSS vars directly via `var(--token-name)` |

## Feature Dependencies

```
Semantic token layer
    |
    +---> Difficulty level tokens (uses semantic layer)
    +---> Phase/state tokens (uses semantic layer)
    +---> Gradient token system (uses semantic layer)
          |
          +---> Gradient utility classes (optional, uses gradients)

Naming convention (parallel requirement, no dependencies)

Documentation (comes last, documents final token set)
```

## MVP Recommendation

For MVP token migration, prioritize in this order:

### Phase 1: Foundation (Do First)
1. **Audit existing tokens** - Map current usage of `#10b981`, `#f59e0b`, `#ef4444`
2. **Semantic token layer** - Add semantic aliases in @theme block
3. **Naming convention** - Document and apply consistently

### Phase 2: Migration (Bulk Work)
4. **Difficulty level tokens** - Migrate the 402 occurrences across 49 files
5. **Phase/state tokens** - Standardize Creation/Execution/Return colors
6. **Gradient token system** - Replace repeated gradient patterns

### Phase 3: Polish (If Time Permits)
7. **Documentation** - Add inline comments to globals.css
8. **Gradient utility classes** - Convert common patterns to utilities

**Defer to post-MVP:**
- TypeScript token constants (nice DX but not essential)
- ESLint rule (good for maintenance but adds tooling complexity)
- Component-scoped overrides (only 1 component uses this pattern)
- Token usage heatmap (useful for future cleanup, not blocking)

## Complexity Estimates for 56-Component Migration

| Task | Estimated Effort | Risk |
|------|-----------------|------|
| Define semantic tokens | 1-2 hours | Low - additive, no breaking changes |
| Find/replace in 1 component | 5-15 min per file | Low - mechanical |
| Full migration (56 files) | 8-16 hours | Medium - tedious but straightforward |
| Testing after migration | 2-4 hours | Low - visual verification |
| Gradient token migration | 2-3 hours | Low - fewer occurrences, pattern-based |

**Total estimate:** 15-25 hours for complete migration

**Risk mitigation:**
- Migrate in batches (10-15 components at a time)
- Visual diff testing per batch
- Keep old hex values as comments initially for verification

## Token Categories Needed

Based on codebase analysis, these semantic token categories are needed:

### Difficulty/Level Colors
```css
--color-level-beginner: var(--color-emerald-500);    /* #10b981 */
--color-level-intermediate: var(--color-amber-500);  /* #f59e0b */
--color-level-advanced: var(--color-red-500);        /* #ef4444 */
```

### Execution Phase Colors
```css
--color-phase-creation: var(--color-blue-400);   /* #60a5fa */
--color-phase-execution: var(--color-emerald-500); /* #10b981 */
--color-phase-return: var(--color-amber-500);    /* #f59e0b */
```

### Variable State Colors
```css
--color-state-hoisted: var(--color-amber-500);   /* #f59e0b */
--color-state-initialized: var(--color-emerald-500); /* #10b981 */
--color-state-tdz: var(--color-red-500);         /* #ef4444 */
```

### Visualization Box Gradients
```css
--gradient-viz-orange: linear-gradient(135deg, #f97316, #fbbf24);
--gradient-viz-purple: linear-gradient(135deg, #a855f7, #ec4899);
--gradient-viz-teal: linear-gradient(135deg, #10b981, #06b6d4);
--gradient-viz-blue: linear-gradient(135deg, #3b82f6, var(--color-brand-primary));
```

## Current State Analysis

### Existing Token Infrastructure (globals.css)
The project already has a mature token system with 130+ tokens:
- Background colors: `--color-bg-primary`, `--color-bg-secondary`, etc.
- Text colors: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- Accent colors: `--color-accent-blue`, `--color-accent-green`, `--color-accent-yellow`, etc.
- Color scales: `--color-emerald-*`, `--color-amber-*`, `--color-red-*` with opacity variants
- Difficulty tokens exist but are underutilized: `--difficulty-1`, `--difficulty-2`, `--difficulty-3`

### The Problem
Despite 130+ available tokens, visualization components hardcode hex values:
- `levelInfo` objects define colors inline: `{ color: '#10b981' }`, `{ color: '#f59e0b' }`, `{ color: '#ef4444' }`
- `getPhaseColor()` functions return hex strings: `case 'Creation': return '#60a5fa'`
- `getStatusColor()` functions use raw hex: `case 'hoisted': return '#f59e0b'`
- Gradient backgrounds use inline hex: `style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}`

### Why This Happens
1. **Inline styles can't reference CSS vars easily** - `style={{ color: levelInfo[lvl].color }}` needs a JS value
2. **Pattern was established early** - First components set the pattern, others copied
3. **Tokens not discoverable** - 130 tokens but no clear "use this for difficulty" documentation

### Migration Strategy
Two approaches for inline style usage:

**Approach A: Keep inline styles, reference CSS vars**
```tsx
style={{ color: 'var(--color-level-beginner)' }}
```
Pros: Minimal change, still works
Cons: String-based, no autocomplete, typo-prone

**Approach B: Move to className with Tailwind utilities**
```tsx
className="text-[var(--color-level-beginner)]"
// or with @theme integration:
className="text-level-beginner"
```
Pros: Consistent with Tailwind v4, enables responsive/hover variants
Cons: Larger refactor per component

**Recommendation:** Approach B for static colors, Approach A for truly dynamic (state-dependent) colors.

## Sources

Research informed by:
- [What Are Design Tokens in React? | UXPin](https://www.uxpin.com/studio/blog/what-are-design-tokens-in-react/)
- [Tailwind CSS v4.0 - Tailwind CSS](https://tailwindcss.com/blog/tailwindcss-v4)
- [Exploring Typesafe design tokens in Tailwind 4 - DEV Community](https://dev.to/wearethreebears/exploring-typesafe-design-tokens-in-tailwind-4-372d)
- [Design tokens overview | Pajamas Design System](https://design.gitlab.com/product-foundations/design-tokens/)
- [Crafting a semantic colour system](https://www.fourzerothree.in/p/crafting-a-semantic-colour-system)
- [Component-level Design Tokens: are they worth it? | Medium](https://medium.com/@NateBaldwin/component-level-design-tokens-are-they-worth-it-d1ae4c6b19d4)
- [The Design System Guide](https://thedesignsystem.guide/design-tokens)
- Codebase analysis of `/src/components/Concepts/*.tsx` and `/src/styles/globals.css`
