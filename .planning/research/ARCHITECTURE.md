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

## Recommended Architecture (Post-Migration)

### Target Structure

```
globals.css (Tailwind v4 CSS-first config)
  |
  |-- @import "tailwindcss"           (replaces 3 @tailwind directives)
  |-- @theme {                         (replaces tailwind.config.js)
  |     --color-primary: #a855f7;
  |     --color-bg-primary: #0f1419;
  |     --spacing-xs: 4px;
  |     ...all design tokens
  |   }
  |-- :root {                          (non-utility CSS vars)
  |     --gradient-brand: ...;
  |     --glow-brand: ...;
  |     --white-10: ...;
  |   }
  |-- @layer base { ... }             (resets, typography -- largely unchanged)
  |-- @layer components { ... }       (panel, badge, tooltip, card-gradient-border)
  |-- @layer utilities { ... }        (keyframes outside @theme)
  |
No tailwind.config.js                 (deleted)
No *.module.css files                 (deleted)
No PostCSS autoprefixer               (Tailwind v4 handles this)
  |
Components use className="..." with Tailwind utilities
  |-- Static: className="flex flex-col gap-lg p-md"
  |-- Dynamic: className={`pointer ${isPrimary ? 'bg-accent-blue' : 'bg-accent-purple'}`}
  |-- Complex state: className mapping objects for visualization states
```

### @theme Configuration Design

The current `tailwind.config.js` maps Tailwind tokens to CSS vars. In v4, the `@theme` directive defines CSS vars that ARE the tokens. This is a clean fit because the project already uses CSS vars everywhere.

```css
@import "tailwindcss";

@theme {
  /* Background palette */
  --color-bg-primary: #0f1419;
  --color-bg-secondary: #1a1f26;
  --color-bg-tertiary: #242b33;
  --color-bg-elevated: #2d353f;
  --color-bg-page: #0f0f1a;
  --color-bg-page-secondary: #1a1a2e;

  /* Text palette */
  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-muted: #6e7681;
  --color-text-bright: #f5f7ff;

  /* Brand colors */
  --color-primary: #a855f7;
  --color-secondary: #ec4899;
  --color-primary-light: #c4b5fd;

  /* Accent colors */
  --color-accent-blue: #58a6ff;
  --color-accent-green: #3fb950;
  --color-accent-yellow: #d29922;
  --color-accent-red: #f85149;
  --color-accent-purple: #a371f7;
  --color-accent-cyan: #39c5cf;
  --color-accent-orange: #db6d28;

  /* Spacing (using Tailwind namespace) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 40px;
  --spacing-4xl: 48px;
  --spacing-5xl: 64px;
  --spacing-6xl: 80px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
  --radius-4xl: 24px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 4px 12px rgba(0, 0, 0, 0.5);

  /* Font families */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, monospace;

  /* Font sizes */
  --text-2xs: 0.625rem;
  --text-xs: 0.7rem;
  --text-sm: 0.75rem;
  --text-base: 0.85rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;

  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.4;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Custom animations */
  --animate-pulse-custom: pulse-custom 2s ease-in-out infinite;
  --animate-slide-in: slideIn 0.2s ease-out;
  --animate-fade-in: fadeIn 0.2s ease-out;
  --animate-pointer-pulse: pointerPulse 1.5s ease-in-out infinite;

  @keyframes pulse-custom {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pointerPulse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
}
```

### What Goes Where: @theme vs :root

**Key decision:** Not every current CSS variable maps to a Tailwind utility namespace. Variables like `--glow-brand`, `--gradient-brand`, `--card-gradient-bg`, and the many opacity variants (`--emerald-20`, `--white-10`, etc.) have no natural Tailwind namespace. These should remain as `:root` CSS custom properties, referenced via arbitrary values: `bg-[var(--gradient-brand)]` or `shadow-[var(--glow-brand)]`.

| Current Variable | @theme? | Rationale |
|-----------------|---------|-----------|
| `--bg-primary`, `--bg-secondary`, etc. | YES as `--color-bg-*` | Maps to `bg-bg-primary` utilities |
| `--text-primary`, `--text-secondary`, etc. | YES as `--color-text-*` | Maps to `text-text-primary` utilities |
| `--color-primary`, `--color-secondary` | YES as `--color-primary` | Maps to `bg-primary`, `text-primary` |
| `--accent-blue`, etc. | YES as `--color-accent-*` | Maps to `bg-accent-blue` utilities |
| `--space-xs` through `--space-6xl` | YES as `--spacing-*` | Maps to `p-xs`, `gap-lg` etc. |
| `--radius-*` | YES as `--radius-*` | Maps to `rounded-lg` etc. |
| `--shadow-*` | YES as `--shadow-*` | Maps to `shadow-md` etc. |
| `--font-sans`, `--font-mono` | YES as `--font-*` | Maps to `font-sans`, `font-mono` |
| `--text-2xs` through `--text-3xl` | YES as `--text-*` | Maps to `text-2xs` etc. |
| `--leading-*` | YES as `--leading-*` | Maps to `leading-tight` etc. |
| `--gradient-brand`, `--gradient-*` | NO - `:root` | No gradient namespace in Tailwind |
| `--glow-brand`, `--glow-*` | NO - `:root` | Use via `shadow-[var(--glow-brand)]` |
| `--card-gradient-*`, `--surface-*` | NO - `:root` | Composite values, use via arbitrary |
| `--white-5`, `--black-30`, etc. | NO - `:root` | Opacity variants, use via arbitrary |
| `--emerald-*`, `--neon-viz-*` | NO - `:root` | Viz-specific, use via arbitrary |
| `--transition-*` | NO - `:root` | Tailwind has built-in transition utils |
| `--border-width-*` | NO - `:root` | Tailwind has built-in border utils |
| `--font-normal` through `--font-bold` | NO | Tailwind has built-in `font-bold` etc. |
| `--difficulty-*` | NO - `:root` | Domain-specific semantic vars |
| `--exec-*`, `--stack-frame-*` | NO - `:root` | Domain-specific, too narrow for utilities |

## Recommended Migration Order

### Principle: Leaves First, Roots Last

Migrate components with NO dependents first (leaf nodes), then work inward toward shared/layout components. This ensures each migrated component can be tested in isolation without disrupting others.

### Phase 1: Foundation (globals.css + config)

**What:** Convert globals.css to Tailwind v4 CSS-first config. Delete `tailwind.config.js`.

1. Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
2. Create `@theme { }` block with all design tokens (see design above)
3. Move remaining CSS variables to `:root` block
4. Keep `@layer base`, `@layer components`, `@layer utilities` blocks as-is
5. Delete `tailwind.config.js`
6. Remove `autoprefixer` from PostCSS config (Tailwind v4 includes it)

**Verification:** `npm run build` succeeds. All pages render identically (existing CSS Modules still work -- they reference CSS vars which now come from `@theme` and `:root` instead of only `:root`).

**Risk:** LOW. This is additive -- CSS Modules continue working alongside the new @theme config.

### Phase 2: Simple Leaf Components (Low Complexity)

**What:** Migrate components with straightforward layouts, no animations, no pseudo-elements, no dynamic class access.

**Components (14 files):**
1. `ErrorBoundary/ErrorBoundary.module.css` (~30 lines)
2. `DifficultyIndicator/DifficultyIndicator.module.css` (~40 lines)
3. `StepDescription/StepDescription.module.css` (~40 lines)
4. `ReadOnlyCode/ReadOnlyCode.module.css` (~40 lines)
5. `Console/Console.module.css` (~60 lines)
6. `Variables/Variables.module.css` (~80 lines)
7. `CallStack/CallStack.module.css` (~120 lines) -- has `styles[type]` dynamic access
8. `Controls/Controls.module.css` (~60 lines)
9. `ExampleSelector/ExampleSelector.module.css` (~50 lines)
10. `SiteFooter/SiteFooter.module.css` (~50 lines)
11. `CrossLinks/RelatedPatterns.module.css` (~60 lines)
12. `CrossLinks/RelatedProblems.module.css` (~60 lines)
13. `SharedViz/StepControls.module.css` (~80 lines)
14. `SharedViz/StepProgress.module.css` (~70 lines)

**Verification per component:**
- Visual diff (screenshot before/after)
- Responsive check at 360px, 768px, 1024px
- Interactive states (hover, focus, disabled) verified

**Risk:** LOW. These are small, self-contained files.

### Phase 3: Medium Components (Responsive + Pseudo-elements)

**What:** Components with media queries, hover states, `::before`/`::after` pseudo-elements.

**Components (12 files):**
1. `Card/Card.module.css` -- has `::before` gradient border trick
2. `Card/CardCarousel.module.css` -- scroll-snap, responsive
3. `Card/CardGrid.module.css` -- CSS var `--columns`, responsive
4. `ProblemCard/ProblemCard.module.css`
5. `CategoryCarousel/CategoryCarousel.module.css` -- responsive
6. `ConceptCarousel/ConceptCarousel.module.css` -- responsive
7. `ProblemListingLayout/ProblemListingLayout.module.css` -- responsive
8. `ExpandableGrid/ExpandableGrid.module.css`
9. `Search/GlobalSearch.module.css` -- responsive, hover states
10. `Search/PageSearch.module.css` -- responsive
11. `Search/SearchResults.module.css`
12. `SharedViz/CodePanel.module.css`

**Special handling for Card.module.css:** The gradient border trick using `::before` with mask-composite needs either:
- Verbose Tailwind `before:` utilities -- possible but unreadable (~8 chained utilities)
- OR keep as `@layer components` rule in globals.css -- recommended for readability

### Phase 4: NavBar + Layout (Complex Responsive + Checkbox Hack)

**What:** NavBar is the most architecturally complex single component. It uses the CSS-only checkbox hack for mobile menu which requires sibling selectors (`:checked ~ .mobileNav`).

**Components (4 files):**
1. `NavBar/NavBar.module.css` (319 lines) -- checkbox hack, hamburger animation, 4 breakpoints
2. `CodeEditor/CodeEditor.module.css` (128 lines) -- Monaco wrapper
3. `ConceptPanel/ConceptPanel.module.css` (328 lines)
4. `EventLoopPlayground/PlaygroundEditor.module.css`

**NavBar Decision Point:** The checkbox hack (`mobileMenuToggle:checked ~ .mobileNav`) cannot be expressed in Tailwind utilities. Two options:

- **Option A (Recommended): Refactor to React state.** Replace the hidden checkbox with `useState`, control visibility with conditional Tailwind classes. Cleaner, more idiomatic React. The checkbox hack was a CSS-only workaround that becomes unnecessary with Tailwind's conditional class approach.

- **Option B: Keep as custom CSS.** Move the checkbox-related styles to a `@layer components` block in globals.css. Apply Tailwind to everything else. Hybrid but safe.

### Phase 5: Concepts Viz Components (Bulk Migration)

**What:** The 30 Concepts Viz files represent ~12,756 lines of CSS (~51% of total). They share massive structural duplication but each has unique visualization-specific styles.

**Strategy: Extract shared patterns first, then batch-convert unique styles.**

1. **Create shared utility layer** in globals.css for common viz patterns using Tailwind v4's `@utility` directive:
   ```css
   @utility viz-level-selector {
     display: flex;
     gap: var(--spacing-sm);
     justify-content: center;
     /* ... */
   }
   ```
   This generates utility classes like `viz-level-selector` that are tree-shaken if unused.

2. **Migration sub-batches** (by shared structure similarity):
   - **Evolution Viz group** (5 files: AsyncEvolution, BuildToolsEvolution, ModuleEvolution, StateEvolution, WebEvolution) -- ~430 lines each, nearly identical structure
   - **Basic concept group** (5 files: DataTypes, Conditionals, Operators, TypeCoercion, JSPhilosophy) -- simpler layouts
   - **Step-through group** (5 files: Variables, Functions, ArraysBasics, ObjectsBasics, Loops) -- uses SharedViz, step controls
   - **Complex viz group** (5 files: EventLoop, NodeEventLoop, MemoryModel, Closures, Prototypes) -- unique layouts, animations
   - **Interactive group** (5 files: Hoisting, ThisKeyword, Memoization, Recursion, Promises) -- interactive states
   - **Remaining** (5 files: TimingViz, StreamsBuffers, CriticalRenderPath, Composition, WebWorkers)

**Verification:** Each sub-batch gets a visual regression check on the corresponding `/concepts/[conceptId]` page.

### Phase 6: DSA Pattern Viz + Visualization Components

**What:** The most complex visualization files plus all DSA components.

**Components (17 files):**
1. `DSAPatterns/BitManipulationViz/BitManipulationViz.module.css` (561 lines) -- has `styles[`width${bitWidth}`]` dynamic access
2. `DSAPatterns/HashMapViz/HashMapViz.module.css` (494 lines) -- complex bucket viz
3. `DSAPatterns/TwoPointersViz/TwoPointersViz.module.css`
4. `DSAConcepts/` (7 files: ArrayViz, BigOViz, BinarySystemViz, HashTableViz, LinkedListViz, QueueViz, StackViz)
5. `Visualization/ArrayVisualization.module.css` -- has `styles[state]` dynamic access
6. `Visualization/BinaryVisualization.module.css`
7. `Visualization/VisualizationPanel.module.css`
8. `ConceptPanel/HashMapConcept.module.css`
9. `ConceptPanel/TwoPointersConcept.module.css`
10. `ConceptPanel/BitManipulationConcept.module.css`

### Phase 7: App Page Layouts

**What:** Page-level CSS modules in `src/app/`.

**Files (9):**
1. `app/page.module.css` (632 lines -- largest single file)
2. `app/concepts/page.module.css`
3. `app/concepts/[conceptId]/page.module.css`
4. `app/concepts/dsa/[conceptId]/page.module.css`
5. `app/concepts/dsa/patterns/[patternId]/page.module.css`
6. `app/[categoryId]/page.module.css` (431 lines)
7. `app/[categoryId]/[problemId]/page.module.css`
8. `app/[categoryId]/[problemId]/concept/page.module.css`
9. `app/playground/event-loop/page.module.css`

### Phase 8: Cleanup

1. Delete all `*.module.css` files (verify no imports remain)
2. Remove legacy CSS variable aliases (`--theme-cyan`, `--gradient-neon`, etc.)
3. Remove redundant `:root` variables that are now in `@theme`
4. Audit globals.css for dead CSS in `@layer components`
5. Run full build + visual regression across all routes

## Handling Complex Patterns

### Pattern: Dynamic Class Access (`styles[variable]`)

**Current (17 instances):**
```tsx
<div className={`${styles.element} ${styles[state]}`}>
```
Where `state` is a runtime string like `"comparing"` | `"swapping"`.

**Tailwind approach -- mapping object:**
```tsx
const stateStyles = {
  comparing: 'bg-accent-yellow border-accent-yellow text-accent-yellow',
  swapping: 'bg-accent-green/20 border-accent-green text-accent-green',
  accessed: 'bg-accent-purple/20 border-accent-purple text-accent-purple',
  sorted: 'bg-accent-green/60',
} as const

<div className={`flex flex-col items-center min-w-2xl ${stateStyles[state] ?? ''}`}>
```

This is cleaner and more explicit than CSS Module bracket access.

### Pattern: Template Literal Composition (284 instances)

**Current:**
```tsx
className={`${styles.card} ${styles.active}`}
```

**Tailwind approach -- direct string or `clsx`:**
```tsx
className="relative bg-[var(--card-gradient-bg)] rounded-2xl p-0.5 block h-full transition-all duration-350"
```

For conditional classes, install `clsx` and use:
```tsx
className={clsx('relative rounded-2xl', isActive && 'scale-[1.02]', !isActive && 'opacity-75')}
```

**Recommendation:** Install `clsx` as a project dependency before starting Phase 2. It replaces template literal concatenation cleanly.

### Pattern: Pseudo-element Gradient Border (Card)

**Current:**
```css
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
  padding: var(--space-0-5);
  background: var(--card-gradient-border);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

**Recommendation: Keep as `@layer components` in globals.css.**
```css
@layer components {
  .card-gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-2xl);
    padding: 2px;
    background: var(--card-gradient-border);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
}
```
Then use: `className="card-gradient-border relative ..."`. This is a legitimate use of `@layer components` -- the mask-composite pattern is too complex for utility composition.

### Pattern: CSS-only Checkbox Hack (NavBar)

**Recommendation: Refactor to React state** during Phase 4.

Replace:
```tsx
<input type="checkbox" id={menuId} className={styles.mobileMenuToggle} />
<label htmlFor={menuId} className={styles.hamburgerBtn}>...</label>
<nav className={styles.mobileNav}>...</nav>
```

With:
```tsx
const [menuOpen, setMenuOpen] = useState(false)

<button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ...">
  <span className={clsx('block w-6 h-0.5 bg-text-secondary transition-transform',
    menuOpen && 'rotate-45 translate-y-[6px]')} />
</button>
<nav className={clsx('fixed top-0 right-0 w-70 h-screen bg-bg-secondary transition-transform',
  menuOpen ? 'translate-x-0' : 'translate-x-full',
  'md:hidden')}>
```

### Pattern: @keyframes Animations

**Current:** Defined in module.css files (14 files have animations).

**Tailwind v4 approach:** Define in `@theme` block for auto-generated utilities, or outside `@theme` for always-available keyframes.

```css
@theme {
  --animate-pointer-pulse: pointerPulse 1.5s ease-in-out infinite;
  @keyframes pointerPulse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
}
```
Usage in markup: `className="animate-pointer-pulse"`

### Pattern: Responsive Media Queries

**Current:** 65 files use `@media (max-width: ...)` breakpoints (desktop-first).

**Tailwind approach:** Tailwind uses mobile-first (`min-width`) by default. The project uses `max-width`. Two options:

- **Recommended:** Flip to mobile-first thinking during migration. Default styles = mobile, add `sm:`, `md:`, and `lg:` prefixes for larger screens.
- **Alternative:** Use Tailwind v4's `max-*` variant: `max-md:hidden` for desktop-first overrides.

Current breakpoints map to Tailwind defaults:
| Project | Tailwind |
|---------|----------|
| 480px | Custom (define as `--breakpoint-xs: 480px` in `@theme`) |
| 640px | `sm` (built-in) |
| 768px | `md` (built-in) |
| 1024px | `lg` (built-in) |

### Pattern: `--js-viz-*` Scoped Variables

14 files reference `--js-viz-text`, `--js-viz-surface-2`, `--js-viz-border`, `--js-viz-muted`. These are NOT in globals.css. They appear to be defined in a parent CSS context (likely a concept page layout CSS file).

**Action needed:** Trace where these are defined. If they are set via parent component inline styles or a wrapping element's CSS, they must be preserved as `:root` or scoped CSS variables. They CANNOT be @theme variables since they may vary per context.

## Visual Parity Verification Strategy

### Per-Component Verification

For each migrated component:

1. **Before screenshot** at 3 breakpoints (360px, 768px, 1440px)
2. Migrate CSS Module to Tailwind utilities
3. **After screenshot** at same breakpoints
4. Visual comparison (manual or diff tool)
5. Test interactive states: hover, focus, disabled, active
6. Test dynamic states (for viz components): step through all visualization states

### Full Route Verification (Per Phase)

After each phase completes, verify ALL affected routes:
- Home page (`/`)
- Concepts listing (`/concepts`)
- Any concept page (`/concepts/closures`)
- Problem listing (`/arrays-hashing`)
- Problem practice page (`/arrays-hashing/two-sum`)
- Algorithm concept page (`/arrays-hashing/two-sum/concept`)

### Build Verification

After each phase:
- `npm run build` succeeds with zero errors
- `npm run lint` passes
- `npm run test:run` passes
- No unused CSS module imports (search for orphaned `import styles`)

## Dependency Graph for Migration Order

```
globals.css (PHASE 1 -- foundation, everything depends on this)
    |
    +-- SharedViz (PHASE 2 -- used by Concepts Viz + DSAPatterns)
    |     |-- StepControls
    |     |-- StepProgress
    |     |-- CodePanel (PHASE 3)
    |
    +-- Simple leaf components (PHASE 2 -- no dependents)
    |     |-- ErrorBoundary, Console, Variables, CallStack
    |     |-- Controls, DifficultyIndicator, StepDescription
    |     |-- ReadOnlyCode, ExampleSelector, SiteFooter
    |     |-- CrossLinks/RelatedPatterns, CrossLinks/RelatedProblems
    |
    +-- Card system (PHASE 3 -- used by pages)
    |     |-- Card (has ::before trick)
    |     |-- CardCarousel, CardGrid
    |     |-- ProblemCard
    |
    +-- Search components (PHASE 3 -- used by NavBar)
    |     |-- GlobalSearch, PageSearch, SearchResults
    |
    +-- NavBar (PHASE 4 -- depends on Search, used by layout)
    |
    +-- Concepts Viz (PHASE 5 -- leaf pages, no dependents)
    |     |-- 30 individual viz components
    |
    +-- DSA components (PHASE 6 -- leaf pages)
    |     |-- DSAPatterns (3 pattern viz)
    |     |-- DSAConcepts (7 data structure viz)
    |     |-- Visualization (Array, Binary, Panel)
    |     |-- ConceptPanel (3 concept panels)
    |
    +-- App page layouts (PHASE 7 -- depend on all above)
          |-- app/page.module.css (home)
          |-- app/concepts/*.module.css
          |-- app/[categoryId]/*.module.css
```

## Build Order Summary

| Phase | Scope | Files | Effort | Risk |
|-------|-------|-------|--------|------|
| 1 | Foundation (@theme + config) | 2 | Small | Low |
| 2 | Simple leaf components | 14 | Medium | Low |
| 3 | Responsive + pseudo-element components | 12 | Medium | Medium |
| 4 | NavBar + complex layout | 4 | Medium | Medium (checkbox refactor) |
| 5 | Concepts Viz (bulk) | 30 | Large | Medium (volume) |
| 6 | DSA + Visualization components | 17 | Large | Medium (dynamic classes) |
| 7 | App page layouts | 9 | Medium | Low |
| 8 | Cleanup + audit | -- | Small | Low |

## Anti-Patterns to Avoid

### Do NOT use `@apply` in CSS files
Tailwind v4 discourages `@apply`. Write actual CSS properties in `@layer components` or use utility classes in markup. The `@apply` bridge was meant for v3 migration, not as a permanent pattern.

### Do NOT create a hybrid system within a single component
Every component should be fully migrated or fully CSS Modules. Do not mix `className={styles.foo}` with Tailwind utilities in the same component -- it makes reasoning about specificity impossible. The project-level hybrid (some components migrated, some not yet) is fine during the migration window.

### Do NOT put 50+ utility classes on one element
If a single element needs more than ~15 utility classes, extract to `@layer components` in globals.css or use `@utility` in v4. The Card gradient border trick is a good example of when component-layer CSS is appropriate.

### Do NOT replicate CSS Module scoping concerns
Tailwind utilities are global by design. You do not need to worry about class name collisions. The `.container` class appearing in 69 module files is a CSS Modules artifact -- with Tailwind, each component's `className` is self-contained in the JSX.

### Do NOT remove `:root` variables too aggressively
Many opacity variants (`--white-10`, `--emerald-20`, `--neon-viz-25`) are used extensively. Keep them as `:root` CSS vars and reference via arbitrary values `bg-[var(--white-10)]`. Trying to convert every opacity shade to a Tailwind color would bloat the theme.

## Sources

**Codebase Analysis (HIGH confidence):**
- Direct inspection of 82 CSS module files, 246 CSS custom properties
- Component TSX files analyzed for className patterns (284 template literals, 17 bracket accesses)
- Package.json confirms Tailwind v4.1.18 already installed with `@tailwindcss/postcss`

**Official Documentation (HIGH confidence):**
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Tailwind CSS v4 Hover, Focus, and States](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind CSS v4 Animation](https://tailwindcss.com/docs/animation)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)

**Community Sources (MEDIUM confidence):**
- [CSS Modules + Tailwind v4 Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/17342)
- [Migration from V3 to V4 Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/16642)
- [Theming Best Practices v4 Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/18471)
