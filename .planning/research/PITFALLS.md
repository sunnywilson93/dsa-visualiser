# Domain Pitfalls: CSS Modules to Tailwind v4 Migration

**Domain:** Migrating 74 CSS Module files (~25,000 lines) to Tailwind v4 utility classes in Next.js 14
**Researched:** 2026-01-27
**Confidence:** HIGH (verified against codebase patterns, Tailwind v4 official docs, and community reports)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken layouts, or blocked progress.

---

### Pitfall 1: `@apply` Is Broken in CSS Module Files Without `@reference` (CRITICAL)

**What goes wrong:** During incremental migration, you keep some `.module.css` files and try to use `@apply` with Tailwind v4 utilities inside them. Every `@apply` call fails with `Cannot apply unknown utility class`. Custom theme classes (e.g., `@apply text-brand-primary`) and dark mode variants (`@apply dark:bg-blue-500`) silently break or always apply the dark variant.

**Why it happens:** Tailwind v4 moved to CSS-first configuration. Each CSS file is now independently compiled. Unlike v3, CSS module files have no implicit access to the Tailwind theme or utilities. The module file does not know about `@theme` variables defined in `globals.css`.

**Consequences:** Every CSS module file that uses `@apply` during the transition period will produce build errors or silently broken styles. This blocks incremental migration entirely if not addressed.

**Warning signs:**
- Build errors: `Cannot apply unknown utility class: text-primary`
- Dark mode variants always stuck in one mode
- Styles that worked in v3 `@apply` silently produce no output

**Prevention:**
1. If keeping any `.module.css` file during transition, add `@reference "tailwindcss";` at the top of each file
2. For files using custom `@theme` variables, use `@reference "../app/globals.css";` instead (points to the file with `@theme` definitions)
3. Better approach: skip `@apply` entirely during migration -- convert CSS module classes directly to inline utility classes in JSX

**Detection:** Run `npm run build` after any CSS module change. Check for `Cannot apply unknown utility class` errors.

**Which phase should address it:** Phase 1 (Foundation) -- establish the migration pattern before touching any component files

**Confidence:** HIGH -- [verified via Tailwind v4 issue #15814](https://github.com/tailwindlabs/tailwindcss/issues/15814) and [discussion #16429](https://github.com/tailwindlabs/tailwindcss/discussions/16429)

---

### Pitfall 2: Dynamic CSS Module Class Access Breaks with Tailwind (CRITICAL)

**What goes wrong:** The codebase uses dynamic bracket notation to apply CSS module classes: `styles[problem.difficulty]`, `styles[state]`, `styles[ptr.type]`, `styles[highlightType]`, `styles[\`width${bitWidth}\`]`. These patterns have no direct Tailwind equivalent. Moving to utility classes loses the ability to dynamically select a class by runtime string key.

**Why it happens:** CSS Modules export an object where keys are class names. You can access any key dynamically via `styles[variable]`. Tailwind utility classes are strings in JSX -- you cannot "look up" a Tailwind class by variable name without a mapping object.

**Consequences:** 10+ components use this pattern. Naive migration (delete module file, add Tailwind classes) will break all dynamic styling in visualization components, difficulty badges, and call stack displays.

**Affected files (verified in codebase):**
- `ArrayVisualization.tsx` -- `styles[state]` for element highlight states
- `BinaryVisualization.tsx` -- `styles[highlightType]` for bit highlight types
- `BitManipulationViz.tsx` -- `styles[`width${bitWidth}`]` for dynamic widths
- `CallStack.tsx` -- `styles[type]` for variable type colors
- `Variables.tsx` -- `styles[value.type]` for value type styling
- `PracticePageClient.tsx` / `ConceptVizPageClient.tsx` -- `styles[problem.difficulty]` for difficulty badges

**Prevention:**
1. Create a mapping utility pattern before migration:
   ```tsx
   const difficultyStyles = {
     easy: 'text-accent-green bg-accent-green/10',
     medium: 'text-accent-yellow bg-accent-yellow/10',
     hard: 'text-accent-red bg-accent-red/10',
   } as const
   // Usage: className={difficultyStyles[problem.difficulty]}
   ```
2. Identify ALL dynamic class access patterns before starting migration
3. Create mapping objects as the FIRST step for each affected component
4. Consider `clsx` or `cva` (class-variance-authority) for complex variant mapping

**Detection:** Search codebase for `styles[` (bracket notation) -- every instance needs a migration plan.

**Which phase should address it:** Phase 1 (Foundation) -- document the pattern; Phase 2+ (per-component migration) -- implement mappings

**Confidence:** HIGH -- verified 10 instances in codebase via grep

---

### Pitfall 3: CSS-Only Checkbox Hack for Mobile Navigation (CRITICAL)

**What goes wrong:** The NavBar uses a CSS-only checkbox hack for the mobile menu. Selectors like `.mobileMenuToggle:checked + .hamburgerBtn .hamburgerIcon` and `.mobileMenuToggle:checked ~ .mobileNav` rely on CSS sibling combinators and the `:checked` pseudo-class targeting a hidden input. This pattern cannot be expressed as Tailwind utility classes.

**Why it happens:** Tailwind provides `peer-checked:` variants, but they require specific DOM structure (`peer` class on the input, sibling relationship). The existing hamburger-to-X animation uses `::before` and `::after` pseudo-elements with `transform` on `:checked`, combined with `content: ''` and absolute positioning. This level of CSS interplay does not translate to utilities.

**Consequences:** Attempting to migrate the NavBar CSS module to Tailwind utilities will either break the mobile menu entirely or require a complete rewrite of the navigation approach (e.g., converting to React state-based toggle).

**Warning signs:**
- Mobile menu stops opening/closing
- Hamburger icon animation breaks
- Overlay no longer appears when menu is open

**Prevention:**
1. **Option A (recommended):** Keep `NavBar.module.css` as a hybrid file -- migrate simple layout utilities to Tailwind but keep the checkbox hack selectors in CSS
2. **Option B:** Rewrite to React state-based mobile menu (adds JS, loses CSS-only benefit, but cleaner Tailwind integration). This changes behavior and should be a deliberate decision, not a side effect of migration
3. Do NOT attempt to convert the checkbox hack to Tailwind `peer-checked:` without a working prototype first

**Detection:** Test mobile menu after any NavBar CSS changes on actual narrow viewports (< 767px).

**Which phase should address it:** Dedicated NavBar migration phase -- do NOT bundle with other component migrations

**Confidence:** HIGH -- verified complex selector chain in `NavBar.module.css` (lines 188-319)

---

### Pitfall 4: Loss of CSS Scoping Causes Style Collisions (CRITICAL)

**What goes wrong:** CSS Modules automatically scope class names (`.container` becomes `.NavBar_container_a1b2c3`). Two components can both have `.container` without conflict. Tailwind utilities are global. If you partially migrate (some components use Tailwind, some still use modules), the global Tailwind utilities and remaining module styles can interact unexpectedly.

**Why it happens:** CSS Modules guarantee isolation. Tailwind's global utilities have flat specificity. During incremental migration, you have both systems active. A global reset or Tailwind's preflight can override module styles you haven't migrated yet.

**Consequences:** Components that haven't been migrated yet suddenly look different because Tailwind's preflight CSS (base resets) changed their default styles. Buttons lose cursor: pointer (v4 preflight changes `cursor` to `default`). Placeholder text changes color (v4 uses `currentColor` at 50% opacity instead of `gray-400`).

**Warning signs:**
- Unmigrated components suddenly look different
- Buttons have default cursor instead of pointer
- Placeholder text color changes
- Border colors change (v4 defaults differ from v3)

**Prevention:**
1. Be aware that Tailwind v4 preflight changes defaults: buttons use `cursor: default`, placeholders use `currentColor` at 50% opacity, borders no longer default to `gray-200`
2. Add explicit `cursor-pointer` to all interactive elements during migration
3. Test unmigrated components after each migration batch -- not just the migrated ones
4. Consider adding global overrides for preflight differences to maintain visual parity during transition

**Detection:** Visual comparison of ALL pages after each migration batch, not just the pages with migrated components.

**Which phase should address it:** Phase 1 (Foundation) -- add preflight overrides before any component migration

**Confidence:** HIGH -- [verified in Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 5: 8,500+ CSS Variable References Need `@theme` Mapping (CRITICAL)

**What goes wrong:** The codebase has 8,529 references to CSS custom properties (`var(--...)`) across module files. These reference 246+ variables defined in globals.css. When migrating to Tailwind utilities, every `var(--text-primary)` must map to a Tailwind utility like `text-text-primary`. If the `@theme` configuration is wrong or incomplete, utilities for custom tokens simply do not exist.

**Why it happens:** The existing `tailwind.config.js` maps CSS variables to Tailwind tokens, but Tailwind v4 replaces `tailwind.config.js` with `@theme` in CSS. The migration from JS config to CSS `@theme` must be exact -- any missing namespace means missing utility classes.

**Consequences:** Hundreds of components reference custom design tokens. If `@theme` is incomplete, you will discover missing utilities only when you try to use them, creating a drip-feed of errors throughout the entire migration.

**Warning signs:**
- `text-text-primary` class has no effect (token not in `@theme`)
- Colors revert to browser defaults
- Spacing values produce no output

**Prevention:**
1. Convert `tailwind.config.js` to `@theme` block FIRST, before any component migration
2. Verify every token namespace:
   - `--color-brand-*` -> generates `bg-brand-*`, `text-brand-*`, etc.
   - `--color-text-*` -> generates `text-text-*` (note the double "text" -- may want to rename)
   - `--color-bg-*` -> generates `bg-bg-*` (awkward -- consider renaming to `--color-surface-*`)
   - `--spacing-*` -> generates spacing utilities
   - `--radius-*` -> generates rounded utilities
   - `--shadow-*` -> generates shadow utilities
   - `--font-*` -> generates font-family utilities
3. Write a verification test: for each token in globals.css, confirm the corresponding Tailwind utility exists
4. Consider the naming conflict: Tailwind has built-in `text-primary` for text color AND the project has `--text-primary`. The `@theme` namespace `--color-text-primary` generates `text-text-primary` which is verbose. Plan the naming strategy before migrating.

**Detection:** Create a token audit spreadsheet mapping every CSS variable to its Tailwind v4 `@theme` equivalent before writing any code.

**Which phase should address it:** Phase 1 (Foundation) -- this is THE foundation task

**Confidence:** HIGH -- verified 8,529 `var(--` references and current `tailwind.config.js` structure

---

## Moderate Pitfalls

Mistakes that cause delays, rework, or accumulated technical debt.

---

### Pitfall 6: Pseudo-Elements Cannot Be Fully Expressed in Tailwind

**What goes wrong:** The codebase uses `::before` and `::after` pseudo-elements extensively for decorative effects (gradient overlays on cards, list markers, hamburger icon lines). While Tailwind supports `before:` and `after:` prefixes, complex pseudo-element patterns with multiple CSS properties become extremely long class strings that are harder to read and maintain than CSS.

**Verified patterns that are problematic:**
- Card gradient borders using `::before` with `background: var(--card-gradient-border)` + mask technique (page.module.css lines 177-198)
- List item custom markers with `::before` content, absolute positioning, width, height, background, border-radius (conceptId page.module.css lines 150-160)
- Hamburger icon lines with `::before`/`::after` with transform animations on `:checked` state

**Prevention:**
1. Accept that some pseudo-element patterns should remain in CSS (either a small utility CSS file or kept in module)
2. For simple `::before`/`::after` (content only), use Tailwind: `before:content-[''] before:absolute before:bg-blue-500`
3. For complex patterns (3+ properties on pseudo-element), keep in a `@utility` block or a thin CSS file
4. Establish a threshold: if a pseudo-element needs more than 4 Tailwind classes, keep it in CSS

**Which phase should address it:** Phase 2+ (per-component migration) -- decide per component

**Confidence:** HIGH -- verified 40+ pseudo-element usages in codebase

---

### Pitfall 7: Non-Standard Media Query Breakpoints

**What goes wrong:** The codebase uses media queries at non-Tailwind breakpoints: `max-width: 1200px`, `900px`, `480px`, `400px`, `360px`, `767px`. Tailwind's default breakpoints are `640px (sm)`, `768px (md)`, `1024px (lg)`, `1280px (xl)`. Converting to Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) shifts breakpoint boundaries, causing visual regressions at specific viewport widths.

**Why it happens:** The CSS modules use desktop-first `max-width` queries. Tailwind uses mobile-first `min-width` by default. The logic must be inverted AND the breakpoint values aligned.

**Consequences:** Layouts that currently break at 1200px will break at 1280px (Tailwind `xl`). The 767px/768px split for mobile menu will work differently with Tailwind's `md:` (768px min-width). Subtle layout shifts at every breakpoint.

**Prevention:**
1. Map existing breakpoints to nearest Tailwind equivalents:
   - `max-width: 1200px` -> use custom breakpoint or accept `xl:` (1280px)
   - `max-width: 1024px` -> `lg:` (exact match)
   - `max-width: 768px` -> `md:` (exact match, but inverted direction)
   - `max-width: 640px` -> `sm:` (exact match, but inverted direction)
   - `max-width: 480px`, `400px`, `360px` -> need custom breakpoints in `@theme`
2. Add custom breakpoints to `@theme` for non-standard values
3. Remember to invert the logic: `max-width: 768px { display: none }` becomes visible by default, hidden below md -> `md:block hidden` (mobile-first)
4. Test at EVERY existing breakpoint value, not just Tailwind defaults

**Detection:** Resize browser slowly through all current breakpoint values. Compare before/after at each pixel threshold.

**Which phase should address it:** Phase 1 (Foundation) -- define custom breakpoints in `@theme`

**Confidence:** HIGH -- verified 30+ non-standard media queries in codebase

---

### Pitfall 8: Complex Grid Layouts Become Unreadable in Tailwind

**What goes wrong:** The practice page has a responsive three-column grid that changes at three breakpoints:
```css
/* Desktop: 3 columns */
grid-template-columns: 1fr 400px 320px;
/* 1200px: narrower sidebars */
grid-template-columns: 1fr 280px 300px;
/* 1024px: 2 columns with row spanning */
grid-template-columns: 1fr 280px;
grid-template-rows: 1fr auto;
grid-column: 2; grid-row: 1 / 3;
/* 768px: single column, 3 rows */
grid-template-columns: 1fr;
grid-template-rows: auto auto auto;
```

Expressing this as Tailwind utilities on a single element produces an unreadable class string with 15+ responsive grid utilities.

**Why it happens:** Grid layouts with named areas, row spanning, and multiple breakpoint changes are inherently complex. Tailwind utilities are optimized for single-property changes, not multi-property responsive reconfiguration.

**Prevention:**
1. Keep complex grid layouts in CSS (either `@utility` blocks or a thin `layout.css` file)
2. Use Tailwind for the content INSIDE grid cells, not the grid structure itself
3. Alternatively, use Tailwind's arbitrary values: `grid-cols-[1fr_400px_320px]` but accept reduced readability
4. For the practice page specifically, consider a dedicated `practiceLayout` utility class defined in `@utility`

**Which phase should address it:** Per-page migration phases -- the practice page layout should be migrated last due to complexity

**Confidence:** HIGH -- verified in `/src/app/[categoryId]/[problemId]/page.module.css`

---

### Pitfall 9: Keyframe Animations Require `@theme` or `@utility` Definitions

**What goes wrong:** The codebase defines 15+ `@keyframes` animations in CSS module files (`pulse`, `fadeIn`, `float`, `pointerPulse`, `borderPulse`, `warningPulse`, `extractPulse`, etc.). These cannot be expressed as Tailwind utility classes. They must be defined somewhere in CSS.

**Why it happens:** Tailwind provides `animate-spin`, `animate-bounce`, `animate-pulse`, `animate-ping` out of the box, but custom keyframes require CSS definition. In v4, custom keyframes go in `@theme` (for the animation name/timing) and a regular CSS block for the `@keyframes` rule.

**Prevention:**
1. Collect all custom `@keyframes` into a single `animations.css` file or define them in `globals.css`
2. Register animation names in `@theme`:
   ```css
   @theme {
     --animate-pulse-custom: pulse-custom 1.5s ease-in-out infinite;
   }
   ```
3. Keep `@keyframes` definitions alongside `@theme` in globals.css
4. Components can then use `animate-pulse-custom` as a Tailwind utility
5. Note: same-named keyframes in different modules (e.g., multiple files define `@keyframes pulse` with different values) will conflict when consolidated -- rename them to be unique

**Detection:** Search for `@keyframes` in all module files. Check for naming collisions.

**Which phase should address it:** Phase 1 (Foundation) -- consolidate keyframes before component migration

**Confidence:** HIGH -- verified 15+ keyframe definitions with naming collisions (3 files define different `pulse` keyframes)

---

### Pitfall 10: `!important` Overrides in CSS Modules

**What goes wrong:** The codebase uses `!important` in 10+ places, primarily for overriding Monaco Editor internal styles and forcing mobile menu display states. Tailwind v4 uses CSS cascade layers, which changes how `!important` interacts with utility specificity.

**Why it happens:** CSS Modules have predictable specificity (single class). Monaco Editor injects its own styles that must be overridden. The mobile menu uses `display: none !important` to force-hide on desktop. Tailwind v4's cascade layers mean that `@layer utilities` styles have lower specificity than un-layered styles.

**Affected patterns:**
- `CodeEditor.module.css` -- overriding Monaco Editor internal styles (6 instances)
- `NavBar.module.css` -- `display: none !important` for mobile menu on desktop
- `CardCarousel.module.css` -- `opacity: 0 !important`

**Prevention:**
1. For Monaco Editor overrides: keep in a dedicated CSS file outside of Tailwind's layer system. Un-layered CSS beats Tailwind's layered utilities.
2. For mobile menu: if keeping CSS-only approach, keep `!important` rules in CSS
3. Use Tailwind's `!` prefix for important utilities: `!hidden` generates `display: none !important`
4. Be aware that `@layer` changes mean un-layered CSS > Tailwind utilities in specificity

**Which phase should address it:** Phase 1 (Foundation) -- identify which `!important` rules must stay in CSS

**Confidence:** HIGH -- verified 10+ `!important` usages in codebase

---

### Pitfall 11: Framer Motion + Tailwind Class Merging Issues

**What goes wrong:** 60 components use Framer Motion. When a `motion.div` has both a `className` with Tailwind utilities and Framer Motion's `style` prop for animations, the inline `style` always wins. This is correct behavior, but during migration, if you move properties from CSS modules to Tailwind utilities that Framer Motion also animates (e.g., `opacity`, `transform`, `background`), the Tailwind class gets overridden by Framer Motion's inline style.

**Why it happens:** Framer Motion applies animations via the `style` attribute, which has higher specificity than class-based styles. In CSS Modules, this was fine because the module styles were "base" styles. With Tailwind, the same properties are still class-based and still get overridden, but the mental model changes -- you expect to "see" the Tailwind class working.

**Prevention:**
1. Do not put animation-target properties in Tailwind classes if Framer Motion animates them
2. Use Framer Motion's `initial` prop for initial states rather than Tailwind classes for animated properties
3. Use Tailwind for non-animated properties (layout, typography, colors that don't animate)
4. Keep the existing pattern: CSS module provides base styles, Framer Motion overrides for animation

**Which phase should address it:** All component migration phases -- check for Framer Motion usage before migrating each component

**Confidence:** MEDIUM -- logical inference from how both systems work, not a reported bug

---

### Pitfall 12: Tailwind v4 Renamed Utility Classes

**What goes wrong:** You use familiar Tailwind v3 class names during migration and they produce wrong results. `shadow-sm` in v3 became `shadow-xs` in v4. `rounded-sm` became `rounded-xs`. The old names now map to DIFFERENT values.

**Renamed utilities (v3 -> v4):**
- `shadow-sm` -> `shadow-xs` (old `shadow-sm` is now what was `shadow`)
- `shadow` -> `shadow-sm`
- `rounded-sm` -> `rounded-xs`
- `rounded` -> `rounded-sm`
- `outline-none` -> `outline-hidden`
- `ring` -> `ring-3`

**Why it happens:** Tailwind v4 standardized naming. The migration tool handles this in existing codebases but you are WRITING NEW Tailwind code during migration. If you reference v3 documentation or your muscle memory uses v3 names, you get subtly wrong values.

**Prevention:**
1. Use Tailwind v4 documentation exclusively (not v3)
2. Bookmark https://tailwindcss.com/docs/upgrade-guide for the rename table
3. If using a Tailwind IntelliSense VS Code extension, ensure it is updated to v4
4. Add a codebase-level comment or doc noting the rename gotchas

**Detection:** Visual comparison -- shadows and border-radius will be slightly different sizes than expected.

**Which phase should address it:** All phases -- developer awareness

**Confidence:** HIGH -- [documented in official upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 13: Custom Scrollbar Styles Cannot Be Tailwind Utilities

**What goes wrong:** The codebase has custom scrollbar styling using `::-webkit-scrollbar`, `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`, and `scrollbar-width`. These are vendor-prefixed pseudo-elements with no Tailwind utility equivalent.

**Affected files:**
- `globals.css` -- global scrollbar theme
- `CardCarousel.module.css` -- hidden scrollbar for horizontal scroll
- `ErrorBoundary.module.css` -- custom scrollbar for stack trace

**Prevention:**
1. Keep scrollbar styles in CSS (globals.css or component-specific CSS files)
2. Use the `scrollbar-*` standard properties where possible (Firefox supports them)
3. These are "keep in CSS" patterns -- do not attempt to convert

**Which phase should address it:** Mark as "no migration needed" during planning

**Confidence:** HIGH -- no Tailwind scrollbar utilities exist

---

## Minor Pitfalls

Mistakes that cause annoyance but are quickly fixable.

---

### Pitfall 14: CSS Variable Arbitrary Value Syntax Changed in v4

**What goes wrong:** In v3, you could write `bg-[--brand-color]`. In v4, the syntax is `bg-(--brand-color)` (parentheses instead of square brackets). Using the old syntax silently fails.

**Prevention:**
1. Use v4 syntax: `bg-(--brand-color)` with parentheses
2. For complex values, still use square brackets: `bg-[var(--brand-color)]`
3. Update any Tailwind snippets or templates to v4 syntax

**Which phase should address it:** Phase 1 (Foundation) -- developer onboarding

**Confidence:** HIGH -- [documented in official upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 15: `transition: all` Pattern Is Wasteful in Tailwind

**What goes wrong:** The codebase uses `transition: all var(--transition-fast)` extensively (15+ instances). Migrating this to Tailwind's `transition-all` works but is a known anti-pattern -- it transitions ALL properties including layout properties, causing jank.

**Prevention:**
1. During migration, replace `transition: all` with specific property transitions: `transition-colors`, `transition-opacity`, `transition-transform`
2. This is an opportunity to IMPROVE during migration, not just replicate
3. Audit each `transition: all` to determine which properties actually animate

**Which phase should address it:** Per-component migration -- low priority improvement

**Confidence:** HIGH -- performance best practice

---

### Pitfall 16: Gradient Behavior Changed in v4

**What goes wrong:** In v3, overriding part of a gradient with a variant would reset the entire gradient. In v4, partial values are preserved. If you have hover states that change one gradient stop, the result differs from v3.

**Prevention:**
1. Test all gradient hover states after migration
2. Use `via-none` to explicitly unset a three-stop gradient if needed
3. This codebase uses CSS variable-based gradients (`var(--gradient-neon)`) which are unaffected -- only Tailwind gradient utilities are impacted

**Which phase should address it:** Per-component migration -- test during each component

**Confidence:** MEDIUM -- codebase uses CSS variable gradients, not Tailwind gradient utilities

---

## Phase-Specific Warning Matrix

| Phase | Likely Pitfall | Severity | Mitigation |
|-------|---------------|----------|------------|
| Foundation (Phase 1) | `@theme` config incomplete (P5) | CRITICAL | Audit all 246 CSS variables, map to `@theme` namespaces |
| Foundation (Phase 1) | Preflight style changes (P4) | CRITICAL | Add preflight overrides before component work |
| Foundation (Phase 1) | Keyframe name collisions (P9) | MODERATE | Rename all `pulse` variants to unique names |
| Foundation (Phase 1) | Non-standard breakpoints (P7) | MODERATE | Define custom breakpoints in `@theme` |
| Component Migration | Dynamic class access breaks (P2) | CRITICAL | Create mapping objects before converting each component |
| Component Migration | Pseudo-element complexity (P6) | MODERATE | Keep complex pseudo-elements in CSS |
| Component Migration | Framer Motion conflicts (P11) | MODERATE | Check for animation overlap before converting |
| NavBar Migration | Checkbox hack breaks (P3) | CRITICAL | Keep in CSS or explicitly rewrite to React state |
| Practice Page | Grid layout unreadable (P8) | MODERATE | Keep grid structure in `@utility`, use Tailwind for content |
| All Phases | Renamed utility classes (P12) | LOW | Use v4 docs, not v3 |
| All Phases | Style collision during transition (P4) | CRITICAL | Test ALL pages after each batch, not just migrated ones |

---

## Pre-Migration Checklist

Before starting any component migration:

- [ ] `@theme` block configured with ALL design tokens from globals.css (P5)
- [ ] Preflight differences documented and overridden if needed (P4)
- [ ] Custom breakpoints added to `@theme` for 480px, 400px, 360px (P7)
- [ ] All `@keyframes` consolidated with unique names (P9)
- [ ] Dynamic class access patterns inventoried with migration strategy per component (P2)
- [ ] Decision made on NavBar mobile menu approach (P3)
- [ ] Monaco Editor CSS override strategy decided (P10)
- [ ] Renamed utility class reference card created (P12)
- [ ] CSS variable arbitrary value syntax documented as v4 `()` not v3 `[]` (P14)
- [ ] Visual baseline screenshots taken for ALL pages at ALL breakpoints

---

## Sources

### Tailwind v4 Official
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 Release Blog](https://tailwindcss.com/blog/tailwindcss-v4)

### Known Issues and Discussions
- [v4 @apply broken in CSS Modules -- Issue #15814](https://github.com/tailwindlabs/tailwindcss/issues/15814)
- [@apply broken in v4 -- Discussion #16429](https://github.com/tailwindlabs/tailwindcss/discussions/16429)
- [Using Tailwind v4 with Next CSS modules -- Discussion #17342](https://github.com/tailwindlabs/tailwindcss/discussions/17342)
- [Missing defaults and broken dark mode -- Discussion #16517](https://github.com/tailwindlabs/tailwindcss/discussions/16517)
- [Still need tailwind.config.js in v4 -- Discussion #16642](https://github.com/tailwindlabs/tailwindcss/discussions/16642)

### Migration Guides
- [Tailwind v4 Migration: JS Config to CSS-First](https://medium.com/better-dev-nextjs-react/tailwind-v4-migration-from-javascript-config-to-css-first-in-2025-ff3f59b215ca)
- [Complete Developer's Migration Guide](https://dev.to/elechipro/migrating-from-tailwind-css-v3-to-v4-a-complete-developers-guide-cjd)
- [v4 Migration Fix for @apply in Next.js](https://iifx.dev/en/articles/460064634/v4-migration-guide-the-essential-fix-for-tailwind-s-apply-error-in-next-js-projects)
