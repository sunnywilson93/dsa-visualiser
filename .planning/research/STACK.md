# Stack Research: CSS Module to Tailwind v4 Migration

**Project:** DSA Visualiser
**Researched:** 2026-01-27
**Focus:** Tailwind v4 configuration, migration tooling, CSS Modules coexistence
**Confidence:** HIGH

## Executive Decision: Use CSS-First @theme, NOT tailwind.config.js

**Verdict:** Delete `tailwind.config.js`. Move all design tokens into `@theme` blocks in `globals.css`. This is the canonical Tailwind v4 approach.

**Why:**
1. Tailwind v4 does NOT auto-detect `tailwind.config.js` -- it requires an explicit `@config` directive to load it, making it a legacy compatibility path, not a first-class citizen.
2. The project already defines all design tokens as CSS custom properties in `globals.css :root`. The `tailwind.config.js` is just a mirror that wraps those same variables in `var()` calls. This is double-bookkeeping that `@theme` eliminates entirely.
3. The `@theme` directive simultaneously creates CSS custom properties AND generates utility classes. One definition, two outputs -- exactly what the current setup tries to achieve with two files.
4. v4's CSS-first config gives 3-10x faster full builds and up to 100x faster incremental builds vs the JS config path.

---

## Current State Analysis

### What is installed (CORRECT)

| Package | Version | Status |
|---------|---------|--------|
| `tailwindcss` | ^4.1.18 | Correct -- v4 package |
| `@tailwindcss/postcss` | ^4.1.18 | Correct -- v4 PostCSS integration |
| `postcss` | ^8.5.6 | Correct -- required by @tailwindcss/postcss |

### What needs CHANGING

| Item | Current (WRONG for v4) | Target (CORRECT for v4) |
|------|------------------------|-------------------------|
| `globals.css` imports | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| Design tokens | Separate `:root` block + `tailwind.config.js` mirror | Single `@theme` block |
| PostCSS config | Includes `autoprefixer` | Remove `autoprefixer` (v4 handles vendor prefixing) |
| `tailwind.config.js` | Exists with `content` + `theme.extend` | DELETE entirely |
| Content paths | Manually specified in config | v4 auto-discovers (uses `.gitignore` for exclusions) |

### What to REMOVE

| Package | Why Remove |
|---------|-----------|
| `autoprefixer` | Tailwind v4 includes vendor prefixing via Lightning CSS. Keeping it adds redundant processing. |

```bash
npm uninstall autoprefixer
```

### What to KEEP as-is

| Package | Why Keep |
|---------|---------|
| `postcss` | Still required by `@tailwindcss/postcss` |
| `@tailwindcss/postcss` | Correct v4 PostCSS plugin for Next.js |
| `tailwindcss` | Core framework |

### What NOT to add

| Package | Why NOT |
|---------|---------|
| `@tailwindcss/vite` | Project uses Next.js (webpack/turbopack), not Vite. The PostCSS path is correct. |
| `prettier-plugin-tailwindcss` | Nice-to-have but not needed for migration. Add post-migration if desired. |
| `tailwind-merge` | Only needed if dynamically composing class strings in JS. Evaluate post-migration. |
| `clsx` / `classnames` | Same rationale -- evaluate after migration, not during. |
| `@tailwindcss/upgrade` | Do NOT install as dependency. Run with `npx` only if needed (see Migration Tooling). |

---

## Required Configuration Changes

### 1. PostCSS Config (postcss.config.js)

**Before:**
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**After:**
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 2. globals.css -- Replace @tailwind with @import and @theme

**Before (current):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
:root {
  --bg-primary: #0f1419;
  --text-primary: #e6edf3;
  --color-primary: #a855f7;
  /* ...200+ CSS variables... */
}
}
```

**After (target):**
```css
@import "tailwindcss";

@theme {
  /* Colors -- generates bg-*, text-*, border-* utilities */
  --color-brand-primary: #a855f7;
  --color-brand-secondary: #ec4899;
  --color-brand-light: #c4b5fd;

  --color-bg-primary: #0f1419;
  --color-bg-secondary: #1a1f26;
  --color-bg-tertiary: #242b33;
  --color-bg-elevated: #2d353f;
  --color-bg-page: #0f0f1a;
  --color-bg-page-secondary: #1a1a2e;

  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-muted: #6e7681;
  --color-text-bright: #f5f7ff;

  --color-accent-blue: #58a6ff;
  --color-accent-green: #3fb950;
  --color-accent-yellow: #d29922;
  --color-accent-red: #f85149;
  --color-accent-purple: #a371f7;
  --color-accent-cyan: #39c5cf;
  --color-accent-orange: #db6d28;

  --color-border-primary: #30363d;
  --color-border-secondary: #21262d;

  /* Spacing -- generates p-*, m-*, gap-*, w-*, h-* utilities */
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

  /* Border radius -- generates rounded-* utilities */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
  --radius-4xl: 24px;
  --radius-full: 999px;

  /* Shadows -- generates shadow-* utilities */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 4px 12px rgba(0, 0, 0, 0.5);

  /* Fonts -- generates font-* utilities */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

/* Variables that should NOT generate utility classes stay in :root */
:root {
  /* Gradients (not a @theme namespace) */
  --gradient-brand: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%);
  --gradient-brand-subtle: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);

  /* Opacity variants for glows/backgrounds */
  --color-primary-20: rgba(168, 85, 247, 0.2);
  --color-primary-30: rgba(168, 85, 247, 0.3);
  /* ...other computed/composite tokens... */

  /* Glows/Shadows (complex composite values) */
  --glow-brand: 0 0 20px rgba(168, 85, 247, 0.2), 0 0 40px rgba(236, 72, 153, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;

  /* Execution state colors (domain-specific, no utility needed) */
  --exec-current: #388bfd33;
  --exec-breakpoint: #f8514933;
  --exec-return: #3fb95033;
}
```

### Critical: @theme Namespace Conventions

Variables in `@theme` MUST follow Tailwind's namespace convention to generate utilities:

| Namespace | Generates | Example Variable | Example Utility |
|-----------|-----------|-----------------|-----------------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*` | `--color-accent-blue` | `bg-accent-blue` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` | `--spacing-lg` | `p-lg`, `gap-lg` |
| `--radius-*` | `rounded-*` | `--radius-lg` | `rounded-lg` |
| `--shadow-*` | `shadow-*` | `--shadow-md` | `shadow-md` |
| `--font-*` | `font-*` | `--font-mono` | `font-mono` |
| `--text-*` | Font size | `--text-xl` | `text-xl` |
| `--font-weight-*` | Font weight | `--font-weight-bold` | `font-bold` |
| `--breakpoint-*` | Responsive variants | `--breakpoint-md` | `md:*` |

Variables that don't follow these namespaces (gradients, opacity variants, transitions, glows) belong in `:root`, not `@theme`.

### Important Naming Impact

The current variable `--bg-primary` becomes `--color-bg-primary` in `@theme`. This changes the generated utility from what was `bg-primary` (via tailwind.config.js mapping) to `bg-bg-primary` -- OR the naming can be restructured. Recommended approach:

**Option A (minimal rename):** Keep semantic grouping, accept `bg-bg-*` pattern
- `--color-bg-primary` generates `bg-bg-primary`

**Option B (restructure):** Use flat color names, reference semantically
- `--color-surface-primary` generates `bg-surface-primary`
- `--color-content-primary` generates `text-content-primary`

**Recommendation:** Option B is cleaner. Rename during the `@theme` migration to avoid `bg-bg-*` stuttering.

### 3. Delete tailwind.config.js

The entire file becomes unnecessary once `@theme` is set up. Every mapping it currently defines will be handled by namespace conventions.

---

## Migration Tooling

### Official Upgrade Tool

```bash
npx @tailwindcss/upgrade
```

**What it does:**
- Converts `@tailwind` directives to `@import "tailwindcss"`
- Migrates `tailwind.config.js` theme values to `@theme` CSS blocks
- Updates template files (e.g., `!flex` to `flex!`, gradient class renames)
- Updates PostCSS config to remove autoprefixer

**What it does NOT do:**
- Convert CSS Module files to Tailwind utility classes
- Handle complex computed tokens or dynamic theme references
- Restructure CSS variable naming to match `@theme` namespaces optimally

**Limitation for this project:** The tool is designed for v3-to-v4 config migration. However, this project's config wraps `var()` references (not raw values), which may not convert cleanly. The upgrade tool expects static values in `tailwind.config.js`, not `var()` indirection.

**Recommendation:** Run `npx @tailwindcss/upgrade` on a branch to see what it produces, but expect to manually refine the `@theme` block. The tool will correctly handle the `@tailwind` to `@import` conversion and PostCSS cleanup.

**Requirement:** Node.js 20+.

### No Automated CSS-Module-to-Utility Converter Exists

There is no reliable tool that reads `.module.css` files and converts them to Tailwind utility classes. This is inherently manual because:
1. CSS properties map to multiple possible Tailwind utilities
2. Responsive breakpoints need manual mapping to Tailwind variants
3. Pseudo-selectors and state classes need variant mapping
4. Animation/keyframe CSS and complex selectors cannot be expressed purely in utility classes
5. Context-dependent decisions (when to use component classes vs utilities)

**TWShift** (twshift.com) is an AI-powered tool for v3-to-v4 class syntax changes, not CSS-to-utility conversion.

---

## CSS Modules Coexistence Strategy

During migration (which will span multiple phases), CSS Modules and Tailwind will coexist. Here is the approach.

### The @reference Directive

CSS Module files in Tailwind v4 are each compiled independently. They have no access to `@theme` tokens unless explicitly imported. If any CSS Module file needs `@apply`:

```css
/* Component.module.css */
@reference "tailwindcss";

.myClass {
  @apply bg-surface-primary text-content-primary;
}
```

### Why to AVOID @apply in CSS Modules

Each CSS Module file that references Tailwind triggers a separate Tailwind compilation pass. With 74 CSS Module files, this means 74 separate Tailwind runs during build -- catastrophic for build performance.

**Correct coexistence strategy:**
1. **Files being migrated:** Convert to inline Tailwind utility classes in JSX, DELETE the `.module.css` file entirely
2. **Files not yet migrated:** Leave as CSS Modules using `var()` references directly (these work without Tailwind processing and cost zero build overhead)
3. **Never add `@apply` or `@reference` to existing CSS Module files** -- this pulls them into Tailwind's compilation pipeline for no benefit

### The var() Bridge

Because `@theme` variables are also CSS custom properties, existing CSS Modules can reference them via `var()` without any Tailwind processing:

```css
/* Already works -- no @reference needed */
.container {
  background: var(--color-surface-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}
```

This means the migration is non-breaking: update `@theme`, rename variables, update `var()` references in CSS Modules, then progressively convert modules to utility classes.

---

## Migration Sequence for Config

**Phase 0 (config foundation):**
1. Run `npx @tailwindcss/upgrade` on a branch, inspect output
2. Replace `@tailwind` directives with `@import "tailwindcss"`
3. Create `@theme` block with properly namespaced variables
4. Move non-utility variables to `:root`
5. Update PostCSS config (remove autoprefixer)
6. Delete `tailwind.config.js`
7. Run `npm uninstall autoprefixer`
8. Update all `var()` references in existing CSS Modules to use new variable names
9. Verify build passes, no visual regressions

**Phase 1+ (progressive migration):**
- Convert CSS Modules to Tailwind utilities one component at a time
- Delete `.module.css` files as components are converted
- Each conversion reduces build overhead

---

## Confidence Assessment

| Decision | Confidence | Source |
|----------|-----------|--------|
| Use `@theme` over `tailwind.config.js` | HIGH | Official Tailwind v4 docs, upgrade guide |
| Remove `autoprefixer` | HIGH | Official upgrade guide states v4 handles prefixing |
| `@import "tailwindcss"` replaces `@tailwind` | HIGH | Official docs, verified |
| No automated CSS-to-utility converter exists | HIGH | Ecosystem survey, no credible tool found |
| `@reference` directive for coexistence | HIGH | Official compatibility docs |
| Variable namespace conventions | HIGH | Official @theme documentation |
| Performance impact of CSS modules + Tailwind | MEDIUM | Official compatibility page warning, not benchmarked for this project |
| Upgrade tool handling of var() config | MEDIUM | Tool expects static values; var() indirection is edge case |

---

## Sources

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- Official migration steps
- [Tailwind CSS v4 Theme Documentation](https://tailwindcss.com/docs/theme) -- @theme namespace reference
- [Tailwind CSS Compatibility Page](https://tailwindcss.com/docs/compatibility) -- CSS Modules guidance, @reference directive
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) -- Performance claims, architecture overview
- [GitHub Discussion: CSS Modules with Tailwind v4](https://github.com/tailwindlabs/tailwindcss/discussions/17342) -- Community experience with modules
- [GitHub Discussion: v4 config file status](https://github.com/tailwindlabs/tailwindcss/discussions/17168) -- Confirms JS config is legacy path
- [GitHub Discussion: Migration still needing config](https://github.com/tailwindlabs/tailwindcss/discussions/16642) -- Edge cases for JS config retention
