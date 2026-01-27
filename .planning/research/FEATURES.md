# Feature Landscape: CSS Modules to Tailwind v4 Migration

**Domain:** CSS Module migration in a Next.js 14 React application
**Researched:** 2026-01-27
**Overall confidence:** HIGH
**Scope:** 74 CSS Module files, 246+ CSS custom properties, complex visualization components

## Table Stakes

Features that MUST be handled for migration to be considered complete. Missing any of these means broken UI or incomplete migration.

### TS-1: Basic Property-to-Utility Conversion

**What:** Convert standard CSS properties (display, padding, margin, font-size, color, background, border, border-radius, gap, flex, grid) from CSS Module classes to Tailwind utility classes inline in JSX.
**Why Expected:** This is the core of the migration. ~70% of all CSS lines are basic properties.
**Complexity:** Low per-file, High in aggregate (74 files)
**Tailwind v4 Pattern:** Direct utility class application in className attributes.
**Existing dependency:** All 74 `.module.css` files use `styles.className` pattern in their corresponding TSX files. Every TSX file import must be updated.
**Notes:** The existing Tailwind config already maps CSS custom properties to Tailwind theme tokens (colors, spacing, borderRadius, shadows, fontFamily). These mappings carry over to v4's `@theme` directive.

### TS-2: CSS Custom Property System Migration to @theme

**What:** Migrate the 246+ CSS custom properties from `globals.css` `:root` block into Tailwind v4's `@theme` directive where appropriate, and keep non-utility variables in `:root`.
**Why Expected:** The design token system is the foundation. Every component references these variables. Breaking this breaks everything.
**Complexity:** Medium
**Tailwind v4 Pattern:**
```css
@import "tailwindcss";

@theme {
  --color-primary: #a855f7;
  --color-secondary: #ec4899;
  --color-bg-primary: #0f1419;
  /* tokens that should generate utility classes */
}

:root {
  /* Variables that do NOT need utility classes */
  --gradient-brand: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  --glow-brand: 0 0 20px ...;
}
```
**Existing dependency:** `tailwind.config.js` already maps CSS vars to Tailwind theme. In v4, this JS config is replaced entirely by `@theme` in CSS. The existing `@tailwind base/components/utilities` directives are replaced by `@import "tailwindcss"`.
**Key decision:** Variables in namespaces like `--color-*`, `--spacing-*`, `--font-*`, `--radius-*`, `--breakpoint-*` generate utility classes automatically in v4. Composite values (gradients, glows, shadows) stay in `:root` or as non-namespaced vars.

### TS-3: Responsive Breakpoint Media Queries

**What:** Convert 99 `@media` query occurrences across 65 files into Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
**Why Expected:** Responsive layout is a core user-facing feature. Every page has responsive adaptations.
**Complexity:** Medium
**Tailwind v4 Pattern:** Responsive prefixes in className: `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"`
**Existing dependency:** Current breakpoints are 400px, 480px, 640px, 768px, 1024px. Tailwind v4 defaults: sm=640px, md=768px, lg=1024px. The 400px and 480px breakpoints are non-standard and need custom breakpoints or arbitrary values.
**Custom breakpoints needed:**
```css
@theme {
  --breakpoint-xs: 25rem;   /* 400px */
  --breakpoint-sm: 30rem;   /* 480px */
  --breakpoint-md: 40rem;   /* 640px */
  --breakpoint-lg: 48rem;   /* 768px */
  --breakpoint-xl: 64rem;   /* 1024px */
}
```
**Or** use Tailwind defaults and map existing queries: 640px -> sm, 768px -> md, 1024px -> lg, with non-standard breakpoints handled via `max-[480px]:` arbitrary breakpoints.
**Important:** Many existing queries use `max-width` (mobile-first override), while Tailwind defaults to `min-width`. This affects migration logic -- `@media (max-width: 768px)` becomes applying base styles for mobile and using `md:` prefix for desktop overrides.

### TS-4: Hover, Focus, and Disabled State Variants

**What:** Convert `:hover`, `:focus`, `:disabled`, `:hover:not(:disabled)`, `.active` class-based states to Tailwind variant prefixes.
**Why Expected:** Interactive states are fundamental to every button, link, and card in the UI.
**Complexity:** Medium
**Tailwind v4 Pattern:** `hover:bg-elevated hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed`
**Existing dependency:** Many components use compound selectors like `.iconBtn:hover:not(:disabled)`. Tailwind handles this with stacked variants: `hover:enabled:bg-elevated`. The `.active` class pattern (applied via JS) uses conditional className logic.

### TS-5: Pseudo-Element Patterns (::before, ::after)

**What:** Convert 60 pseudo-element occurrences across 24 files to Tailwind's `before:` and `after:` variant prefixes or `@utility` definitions.
**Why Expected:** Pseudo-elements are used for decorative borders, gradient overlays, tooltips, and the hamburger menu icon.
**Complexity:** High (some patterns are very complex)
**Tailwind v4 Pattern:** `before:content-[''] before:absolute before:inset-0 before:rounded-2xl`
**Existing dependency:** The most complex pattern is the gradient border card effect using `::before` with `mask-composite: exclude`. This appears in Card, conceptCategoryCard, buildCard, and dsaBanner (4+ components sharing this pattern).
**Complex pattern example (gradient border):**
```css
/* Current CSS Module pattern */
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
  opacity: 0.5;
  transition: opacity var(--transition-slow);
}
```
**Migration approach:** This pattern is too complex for inline utilities. Define as `@utility gradient-border` or keep in `@layer components`.

### TS-6: CSS Keyframe Animations

**What:** Convert 23+ `@keyframes` definitions across module files into Tailwind v4's `@theme` animation system.
**Why Expected:** Animations are integral to the visualization experience (pulse, spin, fadeIn, slideIn, pointerPulse, warningPulse, spreadOut, float, etc.).
**Complexity:** Medium
**Tailwind v4 Pattern:**
```css
@theme {
  --animate-spin: spin 1s linear infinite;
  --animate-pulse: pulse 2s ease-in-out infinite;
  --animate-pointer-pulse: pointerPulse 1.5s ease-in-out infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pointerPulse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
}
```
**Usage:** `className="animate-spin"` or `className="animate-pointer-pulse"`
**Existing dependency:** Some animations are conditionally applied via class toggling (e.g., `.eventLoopIcon.active` gets faster spin). This requires conditional className logic in JSX.
**Notes:** Duplicate `@keyframes` definitions (e.g., `pulse` defined in 8+ files, `spin` in 2 files) will be consolidated into a single `@theme` block. This is a clear win.

### TS-7: CSS Grid Layouts

**What:** Convert complex grid layouts (template-columns, template-rows, template-areas, grid-area, grid-column spanning) to Tailwind grid utilities.
**Why Expected:** Grid layouts power the main page layout, visualization containers, and data structure displays.
**Complexity:** Medium-High
**Tailwind v4 Pattern:** `grid grid-cols-[1fr_1.5fr] grid-rows-[auto_auto_auto]` with arbitrary values.
**Existing dependency:** `grid-template-areas` with named areas (callstack, webapis, eventloop, taskqueue, microtask) is used in EventLoopViz. Tailwind has NO built-in utility for `grid-template-areas`. Options:
  - Arbitrary property: `[grid-template-areas:'callstack_webapis'_'eventloop_taskqueue'_'microtask_microtask']`
  - Custom `@utility` definition
  - Keep as `@layer components` class or inline style
**Notes:** Named grid areas (`grid-area: callstack`) also need arbitrary properties: `[grid-area:callstack]`.

### TS-8: Conditional/Compound Class Application

**What:** Convert the pattern of `.class.modifier` (e.g., `.element.comparing`, `.levelBtn.activeLevel`, `.speedBtn.active`) into Tailwind-compatible conditional className logic.
**Why Expected:** Dynamic styling based on component state is fundamental to all visualization components.
**Complexity:** Medium
**Tailwind v4 Pattern:** Use `clsx` or `cn()` utility for conditional classes:
```tsx
className={cn(
  'p-2 font-mono text-xs text-center rounded-md',
  isComparing && 'bg-yellow-500/30 border-yellow-500 text-yellow-500',
  isSwapping && 'bg-green-500/20 border-green-500 text-green-500'
)}
```
**Existing dependency:** Currently components use `${styles.element} ${isComparing ? styles.comparing : ''}` pattern. Migration requires changing the conditional logic to use Tailwind classes directly.

### TS-9: Scrollbar Styling

**What:** Convert custom `::-webkit-scrollbar` styles (global and per-component in GlobalSearch dropdown).
**Why Expected:** Custom scrollbars are part of the dark theme visual identity.
**Complexity:** Low
**Tailwind v4 Pattern:** Use `@utility` with nesting:
```css
@utility scrollbar-dark {
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-track { background: var(--color-bg-secondary); }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border-primary);
    border-radius: var(--radius-sm);
  }
  &::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }
}
```
**Notes:** Global scrollbar styles stay in `@layer base`. Component-specific scrollbar styles use `@utility`.

### TS-10: Background Gradients and Filters

**What:** Convert gradient backgrounds (`linear-gradient`, `background-clip: text`), `filter: brightness()`, `filter: drop-shadow()`, and `backdrop-filter: blur()` to Tailwind utilities.
**Why Expected:** Gradients are the visual identity of the app (brand gradient, neon effects, gradient text).
**Complexity:** Medium
**Tailwind v4 Pattern:**
- `backdrop-blur-[12px]` for backdrop-filter
- `brightness-110` for filter: brightness(1.1)
- `bg-linear-to-br from-purple-500 to-pink-500` for brand gradient (note: v4 renamed `bg-gradient-*` to `bg-linear-*`)
- Background-clip text: `bg-clip-text text-transparent bg-linear-to-br from-purple-500 to-pink-500`
**Existing dependency:** Many components use `var(--gradient-brand)` / `var(--gradient-neon)` which are composite CSS custom properties. These can remain as CSS variables referenced via arbitrary values: `bg-(--gradient-brand)`.

### TS-11: Transition Properties

**What:** Convert `transition: all var(--transition-fast)` and similar patterns to Tailwind transition utilities.
**Why Expected:** Smooth transitions are on almost every interactive element.
**Complexity:** Low
**Tailwind v4 Pattern:** `transition-all duration-150 ease-in-out`
**Notes:** Tailwind's built-in durations (150, 200, 300, 500, 700, 1000) cover most cases. Existing `--transition-fast` (150ms), `--transition-normal` (250ms), `--transition-slow` (350ms) map cleanly to `duration-150`, `duration-250` (or `duration-[250ms]`), `duration-350` (or `duration-[350ms]`).

### TS-12: Component Layer Classes (.panel, .badge, .tooltip, .icon-btn)

**What:** Migrate the existing `@layer components` definitions from globals.css into Tailwind v4's `@layer components` or `@utility` directives.
**Why Expected:** These shared component classes are used across multiple components.
**Complexity:** Low
**Tailwind v4 Pattern:** Keep in `@layer components` (still supported in v4) or convert to `@utility`:
```css
@utility panel {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
```
**Notes:** `@utility` is preferred when you want variant support (e.g., `hover:panel`). For pure component classes, `@layer components` remains appropriate in v4.

### TS-13: Module Import Removal and className Refactoring

**What:** Remove `import styles from './Component.module.css'` from every component file and replace all `styles.className` references with Tailwind utility strings.
**Why Expected:** This is the actual code change that makes migration real. Without this, CSS Modules are still in use.
**Complexity:** High in aggregate (74 files, every component)
**Notes:** Must be done per-component, not as a bulk find-replace. Each `styles.foo` reference maps to a specific set of CSS properties that must be translated to utilities. Zero `composes:` usage found, which simplifies migration (no CSS Module composition chains to untangle).

---

## Differentiators

Features where Tailwind v4 provides clear advantages over the current CSS Modules approach.

### D-1: Elimination of Style Duplication

**Value Proposition:** The current codebase has significant duplication. The gradient border `::before` pattern is copy-pasted across Card.module.css, page.module.css (conceptCategoryCard, buildCard, dsaBanner). With Tailwind, define once as `@utility gradient-border` and apply everywhere.
**Complexity:** Medium (initial setup), then Low (ongoing)
**Impact:** Reduces ~120 lines of duplicated CSS to ~20 lines of shared utility definition.

### D-2: Colocation of Style and Markup

**Value Proposition:** No more context-switching between TSX and CSS Module files. Styles are visible directly in the component JSX. Reading `className="sticky top-0 z-100 bg-[rgba(15,15,26,0.85)] backdrop-blur-[12px]"` shows the styling without opening NavBar.module.css.
**Complexity:** N/A (architectural benefit)
**Impact:** 74 fewer CSS files to maintain. Each component becomes self-contained.

### D-3: Automatic Responsive Utility Generation

**Value Proposition:** Instead of writing `@media (max-width: 768px) { .container { padding: ... } }` blocks, write `md:p-lg p-md` directly. Responsive changes are visible inline alongside the base styles.
**Complexity:** Low
**Impact:** Eliminates 99 @media blocks across 65 files. Responsive logic becomes scannable in JSX.

### D-4: Design Token Consistency via @theme

**Value Proposition:** Tailwind v4's `@theme` makes CSS custom properties automatically generate utility classes. Define `--color-primary: #a855f7` once in `@theme`, get `text-primary`, `bg-primary`, `border-primary` utilities for free.
**Complexity:** Low
**Impact:** Eliminates the current dual-maintenance of `globals.css` variables AND `tailwind.config.js` theme mapping. Single source of truth.

### D-5: Variant Composition

**Value Proposition:** Complex state combinations that currently require verbose CSS selectors become composable prefixes. `.mobileMenuToggle:checked + .hamburgerBtn .hamburgerIcon::before` becomes cleaner with data attributes and Tailwind variants.
**Complexity:** Medium

### D-6: Build Performance (v4 Engine)

**Value Proposition:** Tailwind v4's new engine delivers up to 5x faster full builds and 100x faster incremental builds. CSS Module processing overhead is eliminated.
**Complexity:** N/A (automatic benefit)

### D-7: Consolidated Animation System

**Value Proposition:** Instead of duplicate `@keyframes pulse` definitions in 8+ separate module files, define all animations once in `@theme`. Use `animate-pulse`, `animate-spin`, `animate-pointer-pulse` everywhere.
**Complexity:** Low
**Impact:** Eliminates 23+ duplicate/scattered keyframe definitions.

### D-8: Arbitrary Value Escape Hatch

**Value Proposition:** For one-off values, Tailwind v4's arbitrary value syntax (`[value]`) and arbitrary property syntax (`[property:value]`) provide an inline escape hatch without creating a CSS file.
**Complexity:** N/A
**Notes:** Use sparingly. If a value appears 3+ times, promote to `@theme` token.

---

## Anti-Features

Things to deliberately NOT do during migration. Common mistakes that create technical debt.

### AF-1: Do NOT Inline Every CSS Property as Utilities

**Why Avoid:** Some patterns are genuinely too complex for inline utilities. The gradient border `::before` with `mask-composite: exclude` pattern, `grid-template-areas`, and multi-step animation sequences will produce unreadable className strings if forced inline.
**What to Do Instead:** Use `@utility` or `@layer components` for complex patterns. Rule of thumb: if a className string exceeds ~10 utilities or involves pseudo-element nesting with 5+ properties, extract to a named utility.

### AF-2: Do NOT Convert the Checkbox Hack to Pure Tailwind

**Why Avoid:** The CSS-only hamburger menu uses `.mobileMenuToggle:checked + .hamburgerBtn .hamburgerIcon::before` and `.mobileMenuToggle:checked ~ .mobileNav` selectors. These sibling/child combinators with checked states are extremely awkward in Tailwind utilities.
**What to Do Instead:** Refactor the hamburger menu to use React state (`useState`) for open/close toggling. Apply Tailwind classes conditionally based on state. This is cleaner, more accessible, and the natural React pattern.

### AF-3: Do NOT Create Tailwind Theme Entries for Every CSS Custom Property

**Why Avoid:** The codebase has 246+ CSS custom properties. Many are composite values (gradients, box-shadows, glows) or fine-grained opacity variants (`--white-5`, `--emerald-30`). Creating `@theme` entries for all of them bloats the generated CSS and pollutes the utility namespace.
**What to Do Instead:** Only promote to `@theme` the tokens that benefit from utility class generation (core colors, spacing, radius, fonts, breakpoints). Keep composite values and opacity variants as plain CSS variables in `:root`. Reference them via `var()` in `@layer components` or arbitrary values.

### AF-4: Do NOT Remove CSS Modules Before the Component is Fully Migrated

**Why Avoid:** Partially migrated components (half Tailwind, half CSS Modules) are worse than either approach alone. They create confusion about which system owns which styles.
**What to Do Instead:** Migrate one component at a time, fully. Delete the `.module.css` file only when all its styles are accounted for in Tailwind utilities or shared definitions. Run visual checks per component.

### AF-5: Do NOT Use @apply Extensively as a Migration Shortcut

**Why Avoid:** Using `@apply` to replicate CSS Module class names (`.card { @apply bg-secondary border border-primary rounded-lg overflow-hidden; }`) defeats the purpose of migration. You end up with CSS files that reference Tailwind utilities indirectly. Additionally, `@apply` has had migration issues in v4.
**What to Do Instead:** Apply utilities directly in JSX. Reserve `@apply` only for third-party component styling where you cannot control the markup.

### AF-6: Do NOT Migrate Framer Motion Styles to Tailwind

**Why Avoid:** Framer Motion animations are controlled via JS objects (`animate={{ opacity: 1, y: 0 }}`). These are runtime-computed styles, not static CSS. Attempting to replace them with Tailwind classes breaks the animation system.
**What to Do Instead:** Leave Framer Motion animations as-is. They coexist perfectly with Tailwind. Only migrate the CSS Module styles that provide static base styling.

### AF-7: Do NOT Use Tailwind v3 Patterns in a v4 Project

**Why Avoid:** v3 patterns like `@tailwind base/components/utilities` directives, `tailwind.config.js` as primary config, `bg-gradient-to-r` (renamed to `bg-linear-to-r` in v4), and `content` path configuration are either deprecated or renamed.
**What to Do Instead:** Use v4 patterns: `@import "tailwindcss"`, `@theme` directive in CSS, `bg-linear-to-r`, automatic content detection. Remove `tailwind.config.js` entirely after migrating its theme to `@theme`.

---

## Feature Dependencies

```
@theme setup (TS-2) -----> All utility conversions (TS-1, TS-3, TS-4, TS-10, TS-11)
                    \
                     ----> Animation system (TS-6)
                     ----> Custom breakpoints (TS-3)

Complex patterns (TS-5, TS-7, TS-9, TS-12)
  --> Must define @utility/@layer before component migration

Conditional classes (TS-8)
  --> Install clsx/cn utility before component migration
  --> Refactor checkbox hack (AF-2) before NavBar migration

Module import removal (TS-13)
  --> Depends on ALL above being ready
  --> Order: shared utilities first, then leaf components, then page layouts
```

## MVP Migration Recommendation

**Phase 1 - Foundation (do first):**
1. TS-2: Migrate CSS custom properties to `@theme` + `:root`
2. TS-12: Define shared component utilities (`@utility` / `@layer components`)
3. TS-6: Consolidate all keyframe animations into `@theme`
4. TS-9: Define scrollbar utilities

**Phase 2 - Simple components (bulk migration):**
1. TS-1 + TS-13: Convert basic properties and remove module imports
2. TS-3: Convert responsive media queries to prefixes
3. TS-4: Convert interactive states to variants
4. TS-11: Convert transitions
5. TS-10: Convert gradients and filters
6. TS-8: Add clsx/cn for conditional class application

**Phase 3 - Complex components (careful migration):**
1. TS-5: Handle pseudo-element patterns (gradient borders, hamburger icon)
2. TS-7: Handle grid-template-areas and complex grid layouts
3. AF-2: Refactor checkbox hack menu to React state

**Defer to post-migration:**
- AF-6: Framer Motion styles remain as-is throughout
- Visual polish pass after all components are migrated

## Sources

- [Tailwind CSS v4.0 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Tailwind CSS v4 Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Animation Docs](https://tailwindcss.com/docs/animation)
- [Tailwind CSS v4 Mask Composite](https://tailwindcss.com/docs/mask-composite)
- [Tailwind CSS v4.1 Release (masks)](https://tailwindcss.com/blog/tailwindcss-v4-1)

## Confidence Assessment

| Feature Area | Confidence | Basis |
|-------------|-----------|-------|
| Basic utility conversion (TS-1) | HIGH | Official Tailwind docs, well-established pattern |
| @theme migration (TS-2) | HIGH | Official docs, verified `@theme` namespace behavior |
| Responsive prefixes (TS-3) | HIGH | Core Tailwind feature, custom breakpoints documented |
| State variants (TS-4) | HIGH | Core Tailwind feature |
| Pseudo-elements (TS-5) | MEDIUM | before:/after: variants confirmed; mask-composite pattern needs @utility |
| Animations (TS-6) | HIGH | Official `--animate-*` + `@keyframes` in `@theme` documented |
| Grid areas (TS-7) | MEDIUM | No native grid-template-areas utility; arbitrary properties needed |
| Conditional classes (TS-8) | HIGH | Standard clsx/cn pattern, widely used |
| Scrollbar (TS-9) | HIGH | @utility with nesting confirmed in docs |
| Gradients/filters (TS-10) | HIGH | bg-linear-*, backdrop-blur, brightness all built-in v4 |
| Transitions (TS-11) | HIGH | Built-in transition utilities |
| Component layer (TS-12) | HIGH | @layer components confirmed in v4 |
| Module removal (TS-13) | HIGH | Mechanical process, no uncertainty |
