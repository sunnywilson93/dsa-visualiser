# Project Research Summary

**Project:** DSA Visualiser - Tailwind v4 Migration
**Domain:** Frontend CSS framework migration (CSS Modules to Tailwind v4 utility classes)
**Researched:** 2026-01-27
**Confidence:** HIGH

## Executive Summary

This project is a full CSS architecture migration: converting 74+ CSS Module files (~25,000 lines) to Tailwind v4 utility classes in a Next.js 14 educational platform. Tailwind v4.1.18 is already installed but configured with v3 syntax (`@tailwind` directives, `tailwind.config.js`). Zero Tailwind utility classes exist in TSX files today -- the entire UI is powered by CSS Modules referencing 246+ CSS custom properties. The recommended approach is a CSS-first migration using Tailwind v4's `@theme` directive, which replaces both the JS config file and the duplicated `:root` variable system with a single source of truth that simultaneously generates CSS custom properties and utility classes.

The migration is fundamentally a manual, component-by-component process. No automated tool converts CSS Module classes to Tailwind utilities. The official `@tailwindcss/upgrade` tool handles only the v3-to-v4 config syntax changes (directives, config file), not the actual CSS-to-utility conversion. The architecture research confirms a clear dependency graph: foundation config must come first, then leaf components, then shared components, then page layouts. The codebase has significant structural duplication (21 of 30 Concepts Viz files share identical selector/level patterns), which the migration should consolidate via `@utility` definitions.

The top risks are: (1) incomplete `@theme` token mapping causing missing utilities across 8,500+ CSS variable references, (2) 17 instances of dynamic bracket-notation class access (`styles[state]`) that have no direct Tailwind equivalent and require mapping objects, (3) the CSS-only checkbox hack in NavBar that cannot be expressed as Tailwind utilities, and (4) Tailwind v4 preflight changes that will alter unmigrated components during the incremental migration window. All four are addressable with upfront planning in the foundation phase.

## Key Findings

### Recommended Stack

The stack is already in place. Tailwind v4.1.18 and `@tailwindcss/postcss` are correctly installed. The migration is about configuration and usage, not new dependencies.

**Core technologies:**
- **Tailwind CSS v4.1.18**: Already installed -- switch from v3 JS config to v4 CSS-first `@theme` directive
- **@tailwindcss/postcss v4.1.18**: Correct PostCSS plugin for Next.js integration -- keep as-is
- **clsx**: Install before component migration -- needed for conditional className composition replacing template literal patterns (284 instances)

**Remove:**
- `autoprefixer` -- Tailwind v4 handles vendor prefixing via Lightning CSS
- `tailwind.config.js` -- replaced entirely by `@theme` in globals.css

**Do NOT add:**
- `@tailwindcss/vite` (project uses Next.js, not Vite)
- `tailwind-merge`, `prettier-plugin-tailwindcss` (evaluate post-migration, not during)

### Expected Features

**Must have (table stakes -- migration is incomplete without these):**
- TS-1: Basic property-to-utility conversion for all 74 CSS Module files
- TS-2: CSS custom property migration to `@theme` with correct namespaces
- TS-3: Responsive breakpoint conversion (99 `@media` queries across 65 files)
- TS-4: Hover, focus, disabled state variant conversion
- TS-5: Pseudo-element handling (`::before`/`::after` -- 60 occurrences, 24 files)
- TS-6: Keyframe animation consolidation (23+ definitions, many duplicated)
- TS-8: Dynamic/conditional class application via mapping objects + clsx
- TS-13: Module import removal and className refactoring in every TSX file

**Should have (differentiators -- improvements over current system):**
- D-1: Elimination of style duplication (gradient border pattern in 4+ components -> single `@utility`)
- D-2: Colocation of style and markup (74 fewer CSS files)
- D-4: Single source of truth for design tokens (`@theme` replaces dual `globals.css` + `tailwind.config.js`)
- D-7: Consolidated animation system (23+ scattered keyframes -> single `@theme` block)

**Defer (handle during migration but do not optimize):**
- Framer Motion styles -- leave as-is, they coexist with Tailwind without changes
- Visual polish pass -- do after all components are migrated
- `prettier-plugin-tailwindcss` and `tailwind-merge` -- evaluate post-migration

**Anti-features (explicitly do NOT do):**
- Do NOT use `@apply` in CSS Module files (triggers separate Tailwind compilation per file)
- Do NOT inline every CSS property (complex pseudo-element patterns belong in `@utility` or `@layer components`)
- Do NOT convert the CSS checkbox hack to Tailwind utilities (refactor to React state instead)
- Do NOT create `@theme` entries for every CSS variable (composite values stay in `:root`)

### Architecture Approach

The migration follows a "leaves first, roots last" dependency graph. The foundation phase converts globals.css to v4 syntax and establishes `@theme` tokens. Then leaf components (no dependents) are migrated and tested in isolation. Shared components (Card, Search) follow, then layout-level components (NavBar), then the bulk Concepts Viz and DSA Viz components, and finally page-level layouts. Each component is migrated atomically -- fully converted or not at all, never a hybrid of CSS Modules and Tailwind within a single component.

**Major architectural components:**
1. **globals.css with @theme** -- single source of truth for all design tokens, replaces both `:root` variables and `tailwind.config.js`
2. **@utility / @layer components blocks** -- shared patterns too complex for inline utilities (gradient border, scrollbar, complex grid layouts)
3. **Inline Tailwind utilities in JSX** -- the primary styling mechanism for all components post-migration
4. **State mapping objects** -- typed Record objects that replace dynamic `styles[variable]` bracket access with explicit Tailwind class mappings

### Critical Pitfalls

1. **Incomplete @theme token mapping (P5)** -- 8,500+ CSS variable references depend on correct `@theme` namespaces. Missing tokens produce silent failures. Prevention: audit every variable and verify utility generation before any component work.

2. **Dynamic class bracket access breaks (P2)** -- 17 instances of `styles[state]` have no Tailwind equivalent. Prevention: create typed mapping objects (`const stateStyles = { comparing: '...', swapping: '...' } as const`) for each affected component before migration.

3. **CSS-only checkbox hack in NavBar (P3)** -- sibling selectors with `:checked` pseudo-class cannot be expressed as utilities. Prevention: refactor to React `useState` toggle during the dedicated NavBar phase.

4. **Preflight style collisions (P4)** -- Tailwind v4 preflight changes button cursors, placeholder colors, and border defaults, affecting unmigrated components during the transition. Prevention: add global preflight overrides in Phase 1 before any component migration.

5. **Tailwind v4 renamed utilities (P12)** -- `shadow-sm` is now `shadow-xs`, `rounded-sm` is now `rounded-xs`, `outline-none` is now `outline-hidden`. Prevention: use v4 docs exclusively and update IDE extensions to v4.

## Implications for Roadmap

Based on combined research, the migration naturally divides into 8 phases following the dependency graph. The architecture research provides the ordering, the features research defines scope per phase, and the pitfalls research identifies which phases need extra care.

### Phase 1: Foundation (Config + @theme)
**Rationale:** Everything depends on this. The `@theme` block must be complete and verified before any component can use Tailwind utilities. This is where all 5 critical pitfalls get their prevention measures established.
**Delivers:** Working Tailwind v4 CSS-first config with full token parity, preflight overrides, consolidated keyframe animations, custom breakpoints.
**Addresses:** TS-2 (@theme migration), TS-6 (animation consolidation), TS-9 (scrollbar utilities), TS-12 (component layer classes)
**Avoids:** P4 (preflight collisions), P5 (incomplete tokens), P7 (non-standard breakpoints), P9 (keyframe collisions)
**Effort:** Small | **Risk:** Low

### Phase 2: Simple Leaf Components
**Rationale:** Leaf components have no dependents -- migrating them first validates the approach without risk to the broader UI. Install `clsx` here.
**Delivers:** 14 fully migrated components with deleted module files, proving the migration pattern works end-to-end.
**Addresses:** TS-1 (basic conversion), TS-4 (state variants), TS-8 (conditional classes), TS-11 (transitions), TS-13 (module removal)
**Avoids:** P2 (dynamic class access -- CallStack has `styles[type]`), P11 (Framer Motion conflicts)
**Effort:** Medium | **Risk:** Low

### Phase 3: Responsive + Pseudo-Element Components
**Rationale:** Card system, Search, and Carousel components have responsive layouts and pseudo-elements that test the more complex migration patterns. Card's gradient border `::before` pattern must be extracted to `@utility` here.
**Delivers:** 12 migrated components including the Card system and Search.
**Addresses:** TS-3 (responsive breakpoints), TS-5 (pseudo-elements), TS-10 (gradients/filters)
**Avoids:** P6 (pseudo-element complexity -- keep mask-composite in CSS), P7 (breakpoint mapping)
**Effort:** Medium | **Risk:** Medium

### Phase 4: NavBar + Complex Layout
**Rationale:** NavBar depends on Search (Phase 3) and is the most architecturally complex single component. The checkbox hack refactor is a deliberate behavior change that must be isolated.
**Delivers:** 4 migrated components, NavBar refactored to React state-based mobile menu.
**Addresses:** TS-5 (hamburger pseudo-elements), AF-2 (checkbox hack refactor)
**Avoids:** P3 (checkbox hack -- refactor to React state), P10 (`!important` overrides for Monaco)
**Effort:** Medium | **Risk:** Medium (behavior change in NavBar)

### Phase 5: Concepts Viz (Bulk Migration)
**Rationale:** 30 files representing 51% of total CSS. Massive structural duplication means shared `@utility` patterns (viz-level-selector, viz-example-selector) can be extracted first, then batch-converted in groups of 5 by similarity.
**Delivers:** 30 migrated visualization components, ~12,756 lines of CSS eliminated.
**Addresses:** TS-1 (bulk conversion), D-1 (duplication elimination), D-7 (animation consolidation)
**Avoids:** P6 (pseudo-elements in viz), P11 (Framer Motion in 60 components)
**Effort:** Large | **Risk:** Medium (volume, but repetitive patterns)

### Phase 6: DSA + Visualization Components
**Rationale:** These contain the most complex dynamic class access patterns (BitManipulationViz, ArrayVisualization) and domain-specific CSS variables (`--js-viz-*`).
**Delivers:** 17 migrated components including all DSA pattern visualizers.
**Addresses:** TS-7 (complex grids), TS-8 (dynamic class mapping), P2 (bracket access)
**Avoids:** P2 (dynamic access -- most instances are here), P8 (complex grid readability)
**Effort:** Large | **Risk:** Medium (dynamic class patterns)

### Phase 7: App Page Layouts
**Rationale:** Page layouts depend on all child components being migrated. The home page (`page.module.css`, 632 lines) is the largest single file.
**Delivers:** 9 migrated page layouts, responsive grid structures.
**Addresses:** TS-3 (responsive), TS-7 (grid layouts), TS-5 (page-level pseudo-elements)
**Avoids:** P8 (complex grid -- practice page layout kept in `@utility`)
**Effort:** Medium | **Risk:** Low

### Phase 8: Cleanup + Verification
**Rationale:** Final sweep to remove all remnants of the CSS Module system.
**Delivers:** Zero CSS Module files remaining, clean globals.css, verified visual parity across all routes.
**Addresses:** Dead code removal, unused variable cleanup, full route visual regression
**Effort:** Small | **Risk:** Low

### Phase Ordering Rationale

- **Dependency-driven:** globals.css -> leaf components -> shared components -> layout components -> pages. Each phase only touches components whose dependencies are already migrated.
- **Risk-graduated:** Low-risk phases first (foundation, leaf components) build confidence and establish patterns. Complex phases (NavBar, Concepts Viz bulk) come after the approach is validated.
- **Duplication-aware:** Phase 5 extracts shared viz patterns before batch-converting 30 files, preventing the duplication from being replicated in Tailwind classes.
- **Pitfall-front-loaded:** All 5 critical pitfall mitigations are established in Phase 1, before any component is touched.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (NavBar):** The checkbox-to-React-state refactor changes behavior. Needs a prototype to verify accessibility (focus management, screen reader announcements) is preserved or improved.
- **Phase 5 (Concepts Viz):** The `--js-viz-*` scoped variables (14 files) need their definition source traced before migration. They may be set by parent component inline styles.
- **Phase 6 (DSA Viz):** The `styles[\`width${bitWidth}\`]` pattern in BitManipulationViz generates dynamic class names from a number. Needs a specific migration strategy (likely CSS custom property with inline style).

Phases with standard patterns (skip deep research):
- **Phase 1 (Foundation):** Well-documented in Tailwind v4 official docs. The `@theme` migration path is clear.
- **Phase 2 (Leaf Components):** Mechanical property-to-utility conversion. No special patterns.
- **Phase 8 (Cleanup):** Verification and deletion. No unknowns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Packages already installed, v4 config path documented by official sources |
| Features | HIGH | 13 table-stakes features identified with concrete Tailwind v4 patterns for each |
| Architecture | HIGH | Based on direct codebase analysis (82 files, 284 template literals, 17 bracket accesses) |
| Pitfalls | HIGH | 16 pitfalls identified, critical ones verified against official docs and GitHub issues |

**Overall confidence:** HIGH

### Gaps to Address

- **`--js-viz-*` variable origins:** 14 files reference visualization-scoped variables not defined in globals.css. Must trace definition source before migrating those components (Phase 5/6).
- **Token naming strategy:** `--color-bg-primary` generates `bg-bg-primary` (stuttering). Decision needed: accept the stutter or rename to `--color-surface-*`. STACK.md recommends `--color-surface-*` but this affects all existing `var()` references.
- **Build performance under coexistence:** The claim that CSS Module files with `@reference` trigger separate Tailwind compilation passes is from official docs but not benchmarked for this project. If any module files need `@apply` during transition, measure the impact.
- **Custom breakpoint strategy:** Project uses 480px, 400px, 360px breakpoints with no Tailwind defaults. Decision needed: define custom breakpoints in `@theme` or use arbitrary values (`max-[480px]:`) per usage site.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- config migration, renamed utilities, preflight changes
- [Tailwind CSS v4 Theme Documentation](https://tailwindcss.com/docs/theme) -- `@theme` namespace conventions, variable-to-utility mapping
- [Tailwind CSS v4 Compatibility Page](https://tailwindcss.com/docs/compatibility) -- CSS Modules guidance, `@reference` directive
- [Tailwind CSS v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives) -- `@utility`, `@layer`, `@import`
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) -- performance claims, architecture overview
- [Tailwind CSS v4.1 Release (masks)](https://tailwindcss.com/blog/tailwindcss-v4-1) -- mask-composite support

### Secondary (MEDIUM confidence)
- [v4 @apply broken in CSS Modules -- Issue #15814](https://github.com/tailwindlabs/tailwindcss/issues/15814) -- confirms `@reference` requirement
- [CSS Modules + Tailwind v4 Discussion #17342](https://github.com/tailwindlabs/tailwindcss/discussions/17342) -- community coexistence patterns
- [v4 config file status -- Discussion #17168](https://github.com/tailwindlabs/tailwindcss/discussions/17168) -- confirms JS config is legacy path
- [Migration edge cases -- Discussion #16642](https://github.com/tailwindlabs/tailwindcss/discussions/16642) -- when JS config is still needed

### Codebase Analysis (HIGH confidence)
- Direct inspection of 82 CSS module files, 246 CSS custom properties, 8,529 `var()` references
- Component TSX analysis: 284 template literal classNames, 17 bracket access patterns, 60 Framer Motion components
- Package.json: Tailwind v4.1.18, @tailwindcss/postcss v4.1.18, postcss 8.5.6

---
*Research completed: 2026-01-27*
*Ready for roadmap: yes*
