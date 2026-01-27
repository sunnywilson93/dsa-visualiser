# Phase 16: Config & Token Migration - Research

**Researched:** 2026-01-27
**Domain:** Tailwind CSS v4 CSS-first configuration, @theme design tokens
**Confidence:** HIGH

## Summary

This phase migrates the project from a legacy Tailwind v3-style setup (JS config + `@tailwind` directives + `autoprefixer`) to Tailwind v4's CSS-first configuration using `@theme` blocks. The project already has `tailwindcss@^4.1.18` and `@tailwindcss/postcss@^4.1.18` installed but still uses the old `tailwind.config.js`, `@tailwind base/components/utilities` directives, and `autoprefixer`.

The codebase has approximately 246 design tokens defined as CSS custom properties in `:root` within `src/styles/globals.css`. These include colors (~130 tokens including opacity variants), spacing (12 named + 7 numeric), border-radius (10), shadows (4+6 glows), typography (fonts, sizes, weights, line heights), transitions, gradients, and semantic tokens. There are 26 `@keyframes` definitions across 16 CSS files, with significant duplication (e.g., `pulse` defined 10 times, `fadeIn` 3 times, `spin` 2 times).

**Primary recommendation:** Delete `tailwind.config.js` and replace `@tailwind` directives first (clean break), then systematically migrate token groups into `@theme` using Tailwind v4's namespaced custom properties. Keep keyframe animations in CSS Modules where they are component-specific, but promote shared/duplicated ones to `@theme`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | ^4.1.18 | CSS framework with @theme | Already installed, CSS-first config |
| @tailwindcss/postcss | ^4.1.18 | PostCSS integration | Already installed, replaces old tailwindcss PostCSS plugin |
| clsx | ^2.1 | Conditional className composition | Decision: TW-04 requires installation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| postcss | ^8.5.6 | CSS processing pipeline | Already installed, required by @tailwindcss/postcss |

### Removals
| Library | Reason |
|---------|--------|
| autoprefixer | Tailwind v4 handles vendor prefixing automatically via @tailwindcss/postcss |
| tailwind.config.js | Replaced by @theme CSS blocks |

**Installation:**
```bash
npm install clsx
npm uninstall autoprefixer
```

## Architecture Patterns

### Pattern 1: @theme Namespace Mapping

**What:** Tailwind v4 uses CSS property namespaces to generate utility classes. Each `--namespace-name` in `@theme` creates corresponding utility classes.

**Namespace mapping for this project's tokens:**

| Current Token Pattern | @theme Namespace | Generated Utility | Example |
|----------------------|-----------------|-------------------|---------|
| `--bg-primary`, `--accent-blue` | `--color-*` | `bg-*`, `text-*`, `border-*` | `--color-bg-primary: #0f1419` |
| `--space-xs`, `--space-sm` | `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*` | `--spacing-xs: 4px` |
| `--radius-sm`, `--radius-lg` | `--radius-*` | `rounded-*` | `--radius-sm: 4px` |
| `--shadow-sm`, `--shadow-lg` | `--shadow-*` | `shadow-*` | `--shadow-sm: 0 1px 2px rgba(0,0,0,0.3)` |
| `--font-sans`, `--font-mono` | `--font-*` | `font-*` | `--font-sans: -apple-system, ...` |
| `--text-xs`, `--text-lg` | `--text-*` | `text-*` | `--text-xs: 0.7rem` |
| `--font-normal`, `--font-bold` | `--font-weight-*` | `font-*` | `--font-weight-normal: 400` |
| `--leading-tight` | `--leading-*` | `leading-*` | `--leading-tight: 1.25` |
| `--animate-pulse` | `--animate-*` | `animate-*` | `--animate-pulse: pulse 2s ease-in-out infinite` |
| custom breakpoints | `--breakpoint-*` | responsive variants | `--breakpoint-xs: 360px` |

**Source:** https://tailwindcss.com/docs/theme (verified 2026-01-27)

### Pattern 2: Dual-Purpose Tokens (CSS Vars + Utility Classes)

**What:** `@theme` variables are emitted as `:root` custom properties AND generate utility classes. This means existing `var(--color-bg-primary)` references in CSS Modules continue working while also enabling Tailwind utility usage.

**Critical insight:** The existing codebase defines tokens in `:root` inside `@layer base`. When migrated to `@theme`, these same tokens will be available as both CSS variables AND Tailwind utilities. CSS Modules using `var(--color-bg-primary)` will resolve correctly because `@theme` generates `:root` custom properties.

**Example:**
```css
/* @theme generates BOTH: */
/* 1. :root { --color-bg-primary: #0f1419; } */
/* 2. .bg-bg-primary { background-color: var(--color-bg-primary); } */
```

### Pattern 3: Non-Namespaced Tokens via @theme inline

**What:** Some tokens (gradients, glows, semantic card tokens, transition durations) do not fit Tailwind's namespaces. These should remain as plain CSS custom properties in a `@layer base { :root {} }` block, NOT in `@theme`.

**Tokens that stay outside @theme:**
- Gradients (`--gradient-brand`, `--gradient-brand-subtle`)
- Complex glows (`--glow-brand`, `--glow-brand-strong`)
- Card semantic tokens (`--surface-card`, `--border-card`)
- Legacy aliases (`--theme-cyan`, `--gradient-neon`)
- Execution state colors (`--exec-current`, `--exec-breakpoint`)
- Stack frame colors (`--stack-frame-1` through `--stack-frame-5`)
- Difficulty tokens (`--difficulty-easy`, etc.)
- Glow size tokens (`--glow-xs` through `--glow-2xl`)
- Border width tokens (`--border-width-1` through `--border-width-4`)
- Transition tokens (`--transition-fast`, `--transition-normal`, `--transition-slow`)

**Why:** These are either composite values that don't map to a single Tailwind namespace, or are semantic/domain-specific tokens that don't need utility class generation.

### Pattern 4: Spacing Multiplier

**What:** Tailwind v4 supports a base `--spacing` value that acts as a multiplier for numeric spacing utilities.

```css
@theme {
  --spacing: 4px; /* Base unit: p-1 = 4px, p-2 = 8px, p-4 = 16px */
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
}
```

**Decision:** Adopt 4px base spacing. Existing named tokens map well: xs=4px (1x), sm=8px (2x), md=12px (3x), lg=16px (4x), xl=24px (6x), 2xl=32px (8x).

### Pattern 5: @keyframes in @theme

**What:** Keyframes can be defined inside `@theme` blocks alongside `--animate-*` tokens.

```css
@theme {
  --animate-fade-in: fadeIn 0.2s ease-out;
  --animate-slide-in: slideIn 0.2s ease-out;
  --animate-pulse: pulse 2s ease-in-out infinite;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
}
```

**Source:** https://tailwindcss.com/docs/theme (verified 2026-01-27)

### Pattern 6: Clearing Default Theme Namespaces

**What:** Use `--namespace-*: initial` to remove Tailwind's default values for a namespace before defining custom ones.

```css
@theme {
  --color-*: initial; /* Remove all default Tailwind colors */
  /* Then define only project colors */
  --color-bg-primary: #0f1419;
  /* ... */
}
```

**Recommendation:** Clear `--color-*` defaults since this project uses a custom dark color system. Keep default spacing numeric scale alongside custom named tokens. Keep default breakpoints alongside custom ones.

### Recommended globals.css Structure

```
@import "tailwindcss";

@theme {
  /* === Colors === */
  --color-*: initial;
  --color-bg-primary: #0f1419;
  /* ... all color tokens ... */

  /* === Spacing === */
  --spacing: 4px;
  --spacing-xs: 4px;
  /* ... named spacing tokens ... */

  /* === Typography === */
  --font-sans: -apple-system, ...;
  --font-mono: 'JetBrains Mono', ...;
  --text-2xs: 0.625rem;
  /* ... size tokens ... */
  --font-weight-normal: 400;
  /* ... weight tokens ... */
  --leading-none: 1;
  /* ... line height tokens ... */

  /* === Border Radius === */
  --radius-*: initial;
  --radius-none: 0;
  --radius-xs: 2px;
  /* ... */

  /* === Shadows === */
  --shadow-*: initial;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  /* ... */

  /* === Breakpoints === */
  --breakpoint-2xs: 360px;
  --breakpoint-xs: 400px;
  --breakpoint-mobile: 480px;

  /* === Easing === */
  --ease-default: ease;
  --ease-in-out: ease-in-out;
  --ease-out: ease-out;

  /* === Animations === */
  --animate-fade-in: fadeIn 0.2s ease-out;
  --animate-slide-in: slideIn 0.2s ease-out;
  --animate-pulse: pulse 2s ease-in-out infinite;
  --animate-spin: spin 1s linear infinite;
  /* ... component-specific animations ... */

  @keyframes fadeIn { /* ... */ }
  @keyframes slideIn { /* ... */ }
  @keyframes pulse { /* ... */ }
  @keyframes spin { /* ... */ }
  /* ... all keyframe definitions ... */
}

/* Duration tokens (no Tailwind namespace, use as CSS vars) */
@layer base {
  :root {
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 350ms;

    /* Gradients, glows, semantic tokens */
    --gradient-brand: linear-gradient(...);
    /* ... non-namespaced tokens ... */
  }
}

/* Global base styles */
@layer base {
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* ... rest of base styles ... */
}

@layer components {
  /* .panel, .icon-btn, .badge, .tooltip */
}

@layer utilities {
  /* Layout utilities */
}
```

### Anti-Patterns to Avoid

- **Putting non-token values in @theme:** `@theme` is for design tokens that generate utilities. Don't put gradients, composite shadows, or domain-specific semantic tokens in `@theme`.
- **Forgetting to clear defaults:** If you define `--color-bg-primary` without `--color-*: initial`, Tailwind's default color palette (red-50 through red-950, etc.) remains, bloating CSS output.
- **Using @theme inline unnecessarily:** Only use `inline` when the value references another CSS variable that would create a circular reference. Literal values do not need `inline`.
- **Nesting @theme inside selectors:** `@theme` must be top-level. It cannot be inside `:root`, `@layer`, or any selector.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional classNames | String concatenation | `clsx` | Edge cases with falsy values, readability |
| Vendor prefixing | Manual -webkit- prefixes | `@tailwindcss/postcss` (automatic) | v4 handles this; autoprefixer is redundant |
| Animation utility classes | Manual `.animate-*` CSS classes | `@theme --animate-*` tokens | Generates utilities automatically with proper cascade |
| Custom breakpoint media queries | Manual `@media (min-width: 480px)` | `@theme --breakpoint-*` + `mobile:` prefix | Enables responsive variant syntax |
| Spacing scale | Manual CSS var math | `--spacing: 4px` multiplier | Automatic numeric utilities (p-1, p-2, etc.) |

**Key insight:** Tailwind v4's `@theme` generates both CSS custom properties AND utility classes. Every token in `@theme` does double duty -- existing `var()` references in CSS Modules work AND new utility classes become available.

## Common Pitfalls

### Pitfall 1: @theme vs :root Confusion
**What goes wrong:** Developers put tokens in `:root` instead of `@theme`, so utility classes are not generated.
**Why it happens:** Old habit from v3 where tokens were in `:root` and JS config mapped them.
**How to avoid:** All tokens that should generate Tailwind utilities go in `@theme`. Only non-utility tokens (gradients, composite values, domain tokens) stay in `:root`.
**Warning signs:** `bg-bg-primary` class doesn't work but `var(--color-bg-primary)` does.

### Pitfall 2: Namespace Collision with Tailwind Defaults
**What goes wrong:** Custom `--color-*` tokens coexist with Tailwind's default colors, generating hundreds of unused color utilities.
**Why it happens:** Not clearing the namespace with `--color-*: initial`.
**How to avoid:** Add `--color-*: initial` before custom color definitions. Same for `--radius-*`, `--shadow-*` if replacing entirely.
**Warning signs:** Large CSS bundle size, unexpected utility classes available.

### Pitfall 3: CSS Module Keyframe Scoping
**What goes wrong:** Moving a `@keyframes` from a CSS Module to `@theme` breaks the animation because CSS Modules auto-scope keyframe names.
**Why it happens:** CSS Modules transforms `@keyframes pulse` to `@keyframes _pulse_abc123`. When the keyframe moves to `@theme`, the scoped reference in the module no longer matches.
**How to avoid:** When promoting a keyframe to `@theme`, also update the CSS Module's `animation` property to reference the global keyframe name. Use `:global` syntax or remove the local `@keyframes` and rely on the `@theme`-generated one.
**Warning signs:** Animation stops working after migration.

### Pitfall 4: @tailwind Directives Left Behind
**What goes wrong:** Build fails or double-imports occur if `@tailwind base/components/utilities` coexists with `@import "tailwindcss"`.
**Why it happens:** Partial migration.
**How to avoid:** Replace all three `@tailwind` directives with the single `@import "tailwindcss"` in one atomic change.
**Warning signs:** Build warnings about duplicate layers.

### Pitfall 5: Font Weight Namespace Change
**What goes wrong:** Existing `--font-normal: 400` conflicts with `--font-*` namespace (which is for font families).
**Why it happens:** Tailwind v4 uses `--font-weight-*` for weights, not `--font-*`.
**How to avoid:** Rename `--font-normal` to `--font-weight-normal`, `--font-bold` to `--font-weight-bold`, etc.
**Warning signs:** `font-normal` utility sets font-family instead of font-weight.

### Pitfall 6: Text Size Namespace Overlap
**What goes wrong:** `--text-primary` (a color token) collides with `--text-*` namespace (which is for font sizes in Tailwind v4).
**Why it happens:** The project uses `--text-primary` for text color, but Tailwind v4's `--text-*` namespace generates `text-*` font-size utilities.
**How to avoid:** Rename text color tokens to use the `--color-*` namespace: `--color-text-primary`, `--color-text-secondary`, etc. This generates `text-text-primary` utility (or use `bg-text-primary`, `text-text-primary`).
**Warning signs:** `text-primary` sets font-size instead of color.

### Pitfall 7: Spacing Token Naming
**What goes wrong:** Numeric spacing tokens (--space-0, --space-1, --space-2) conflict with Tailwind's auto-generated numeric spacing from the `--spacing` multiplier.
**Why it happens:** Tailwind v4 generates `p-1`, `p-2`, etc. from the `--spacing` base multiplier. If you also define `--spacing-1: 3px`, it overrides the multiplied value.
**How to avoid:** Only define *named* spacing tokens (xs, sm, md, lg, xl, 2xl, etc.) in `@theme`. Let the `--spacing: 4px` multiplier handle numeric utilities. Remove the numeric `--space-0`, `--space-1`, etc. tokens and let components use the scale.
**Warning signs:** `p-2` produces unexpected value.

## Code Examples

### Example 1: Complete @import + @theme Setup
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  --color-*: initial;

  /* Background colors */
  --color-bg-primary: #0f1419;
  --color-bg-secondary: #1a1f26;
  --color-bg-tertiary: #242b33;
  --color-bg-elevated: #2d353f;
  --color-bg-page: #0f0f1a;
  --color-bg-page-secondary: #1a1a2e;

  /* Text colors */
  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-muted: #6e7681;
  --color-text-bright: #f5f7ff;

  /* Accent colors */
  --color-accent-blue: #58a6ff;
  --color-accent-green: #3fb950;
  --color-accent-yellow: #d29922;
  --color-accent-red: #f85149;
  --color-accent-purple: #a371f7;
  --color-accent-cyan: #39c5cf;
  --color-accent-orange: #db6d28;

  /* Brand colors */
  --color-brand-primary: #a855f7;
  --color-brand-secondary: #ec4899;
  --color-brand-light: #c4b5fd;

  /* Border colors */
  --color-border-primary: #30363d;
  --color-border-secondary: #21262d;
}
```

### Example 2: Spacing with Base Multiplier
```css
/* Source: https://tailwindcss.com/docs/theme */
@theme {
  --spacing: 4px;
  /* Named aliases - these override numeric equivalents */
  --spacing-xs: 4px;   /* = 1 unit */
  --spacing-sm: 8px;   /* = 2 units */
  --spacing-md: 12px;  /* = 3 units */
  --spacing-lg: 16px;  /* = 4 units */
  --spacing-xl: 24px;  /* = 6 units */
  --spacing-2xl: 32px; /* = 8 units */
  --spacing-3xl: 40px; /* = 10 units */
  --spacing-4xl: 48px; /* = 12 units */
  --spacing-5xl: 64px; /* = 16 units */
  --spacing-6xl: 80px; /* = 20 units */
}
```

### Example 3: Typography Tokens
```css
@theme {
  /* Font families */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', monospace;

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

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.4;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
}
```

### Example 4: Custom Breakpoints
```css
/* Source: https://tailwindcss.com/docs/theme */
@theme {
  /* Custom small breakpoints alongside defaults */
  --breakpoint-2xs: 360px;
  --breakpoint-xs: 400px;
  --breakpoint-mobile: 480px;
  /* Tailwind defaults (sm:640, md:768, lg:1024, xl:1280, 2xl:1536) remain */
}

/* Usage: <div class="mobile:grid-cols-2 xs:p-4"> */
```

### Example 5: Animation Tokens with Keyframes
```css
@theme {
  /* Animation shorthand tokens */
  --animate-fade-in: fadeIn 0.2s ease-out;
  --animate-slide-in: slideIn 0.2s ease-out;
  --animate-pulse: pulse 2s ease-in-out infinite;
  --animate-spin: spin 1s linear infinite;
  --animate-float: float 1s ease-in-out infinite;
  --animate-pointer-pulse: pointerPulse 1.5s ease-in-out infinite;
  --animate-border-pulse: borderPulse 2s ease-in-out infinite;
  --animate-icon-pulse: iconPulse 1.5s ease-in-out infinite;
  --animate-warning-pulse: warningPulse 1.5s ease-in-out infinite;
  --animate-spread-out: spreadOut 0.5s ease-out;
  --animate-spread-in: spreadIn 0.6s ease-out;
  --animate-extract-pulse: extractPulse 0.8s ease-in-out infinite;
  --animate-fade-in-scale: fadeInScale 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  /* ... remaining keyframes ... */
}
```

### Example 6: PostCSS Config After Migration
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Example 7: Non-@theme Tokens (remain in :root)
```css
@layer base {
  :root {
    /* Duration tokens */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 350ms;

    /* Gradients (composite values) */
    --gradient-brand: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%);

    /* Semantic surface tokens */
    --surface-card: rgba(255, 255, 255, 0.03);
    --border-card: rgba(255, 255, 255, 0.08);

    /* Execution/domain colors */
    --exec-current: #388bfd33;
    --stack-frame-1: #58a6ff;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4.0 | Single import replaces three directives |
| `tailwind.config.js` theme extension | `@theme` CSS block | Tailwind v4.0 | No JS config needed |
| `autoprefixer` in PostCSS | Built into `@tailwindcss/postcss` | Tailwind v4.0 | Vendor prefixing is automatic |
| `theme()` function in CSS | `var(--token-name)` | Tailwind v4.0 | CSS-native custom properties |
| `@layer utilities` for custom utils | `@utility` directive | Tailwind v4.0 | Better sorting, variant support |
| JS-defined keyframes | `@keyframes` inside `@theme` | Tailwind v4.0 | CSS-native, generates animate-* utilities |

**Deprecated/outdated:**
- `tailwind.config.js`: Replaced by `@theme` CSS blocks. Can still be loaded via `@config` directive but is not the recommended path.
- `theme()` function: Still works but `var()` is preferred. CSS custom properties are the native approach.
- `@tailwind` directives: Replaced by `@import "tailwindcss"`.
- `autoprefixer`: Redundant with `@tailwindcss/postcss`.

## Token Inventory & Migration Map

### Current Token Count by Category

| Category | Count | @theme Namespace | Notes |
|----------|-------|-----------------|-------|
| Background colors | 6 | `--color-bg-*` | All semantic |
| Text colors | 4 | `--color-text-*` | Rename from --text-* to avoid --text-* font-size collision |
| Core colors | 2 | `--color-white`, `--color-black` | Simple |
| Gray scale | 8 | `--color-gray-*` | Opacity variants stay as-is |
| Accent colors | 7 solid + ~18 opacity | `--color-accent-*` | Opacity variants use --color-accent-blue-20, etc. |
| White/Black opacity | 11 + 4 | `--color-white-*`, `--color-black-*` | Keep in :root (not standard utilities) |
| Emerald/Teal/Blue/Red/Amber/Orange scales | ~40 | `--color-*` | Visualization-specific, many opacity variants |
| Brand/Primary/Secondary | 3 + ~13 opacity | `--color-brand-*` | Includes primary/secondary opacity variants |
| Neon viz colors | 4 | Keep in :root | Domain-specific |
| Gradients | 4 | Keep in :root | Composite values |
| Glow/shadow semantics | 6 | Keep in :root | Composite values |
| Surface/card tokens | ~10 | Keep in :root | Semantic, composite |
| Legacy aliases | ~12 | Keep in :root (temporary) | Will be removed later |
| Difficulty tokens | 8 | Keep in :root | Domain-specific |
| Border colors | 2 | `--color-border-*` | Semantic |
| Exec/stack colors | 8 | Keep in :root | Domain-specific |
| Spacing (named) | 10 | `--spacing-*` | xs through 6xl |
| Spacing (numeric) | 7 | Remove (use multiplier) | --space-0 through --space-2-5 |
| Border radius | 10 | `--radius-*` | Full scale |
| Shadows | 4 | `--shadow-*` | sm through xl |
| Glow sizes | 6 | Keep in :root | Not standard shadow |
| Border widths | 4 | Keep in :root | Simple, rarely used |
| Transitions | 3 | Keep in :root | Duration + easing combos |
| Font families | 2 | `--font-*` | sans + mono |
| Font sizes | 9 | `--text-*` | 2xs through 3xl |
| Font weights | 4 | `--font-weight-*` | Renamed from --font-* |
| Line heights | 5 | `--leading-*` | Standard Tailwind names |

### Keyframe Deduplication Summary

| Keyframe Name | Occurrences | Unique Variants | Action |
|--------------|-------------|-----------------|--------|
| `pulse` | 10 (globals + 9 modules) | 3 variants (opacity, box-shadow teal, box-shadow orange) | Promote generic opacity pulse to @theme; keep box-shadow variants in modules |
| `fadeIn` | 3 (globals + 2 modules) | 2 (simple opacity vs opacity+scale) | Promote both as fadeIn and fadeInScale |
| `spin` | 2 modules | 1 (identical) | Promote to @theme |
| `slideIn` | 1 (globals) | 1 | Promote to @theme |
| `float` | 1 module | 1 | Promote to @theme |
| `pointerPulse` | 1 module | 1 | Promote to @theme |
| `borderPulse` | 1 module | 1 | Promote to @theme |
| `iconPulse` | 1 module | 1 | Promote to @theme |
| `warningPulse` | 2 modules | 1 (identical) | Promote to @theme |
| `extractPulse` | 1 module | 1 | Promote to @theme |
| `spreadOut` | 1 module | 1 | Promote to @theme |
| `spreadIn` | 1 module | 1 | Promote to @theme |

**Note on CSS Module scoping:** When keyframes are in CSS Modules, the names are auto-scoped. After promoting to @theme, the CSS Module animation references need updating to use the global name (via `:global()` or by referencing the `--animate-*` custom property).

## Recommended Migration Order

Per the decision to split by token group and delete config first:

1. **Plan A: Config Teardown** -- Delete `tailwind.config.js`, replace `@tailwind` directives with `@import "tailwindcss"`, remove `autoprefixer`, install `clsx`. Establish empty `@theme {}` block. App must build and look identical.

2. **Plan B: Color Tokens** -- Migrate all color tokens to `@theme --color-*` namespace. Rename `--text-primary` to `--color-text-primary`, etc. Update all `var()` references in CSS Modules. Clear Tailwind default colors.

3. **Plan C: Spacing & Layout Tokens** -- Migrate spacing tokens to `@theme --spacing-*`. Set `--spacing: 4px` base multiplier. Remove numeric spacing tokens.

4. **Plan D: Typography Tokens** -- Migrate font families, sizes, weights, line heights to their respective `@theme` namespaces.

5. **Plan E: Visual Tokens** -- Migrate radius, shadow tokens to `@theme`. Move non-namespaced tokens to `:root` in `@layer base`.

6. **Plan F: Breakpoints & Animations** -- Add custom breakpoints. Consolidate keyframe animations into `@theme`. Update CSS Module animation references.

## Open Questions

1. **Opacity variant tokens -- @theme or :root?**
   - What we know: ~50 tokens like `--accent-blue-20: rgba(88, 166, 255, 0.2)` exist. Tailwind v4 has built-in opacity modifier syntax (`bg-accent-blue/20`).
   - What's unclear: Whether to keep these as explicit tokens or rely on Tailwind's opacity modifier syntax.
   - Recommendation: Keep as explicit `--color-*` tokens in `@theme` for now. CSS Modules use `var(--accent-blue-20)` directly. Migration to opacity modifier syntax is a component-level concern for v2.1+.

2. **CSS Module @keyframes after promotion to @theme**
   - What we know: CSS Modules auto-scope keyframe names. Promoting to @theme makes them global.
   - What's unclear: Whether removing the local `@keyframes` from CSS Modules and relying on global keyframes will cause issues with CSS Module scoping.
   - Recommendation: Test with one module first. The CSS Module's `animation:` property will need to use the unscoped global keyframe name. Since these modules already reference global CSS vars, this should work. Use `animation-name` with the global name directly.

3. **Legacy alias tokens**
   - What we know: 12 legacy aliases (--theme-cyan, --gradient-neon, etc.) exist for gradual migration.
   - What's unclear: Whether any CSS Modules still reference the legacy names.
   - Recommendation: Grep for usage before deciding. If unused, remove. If used, keep in `:root` and schedule removal for a later phase.

## Sources

### Primary (HIGH confidence)
- https://tailwindcss.com/docs/theme -- @theme directive syntax, namespaces, keyframes, inline/static modifiers, namespace clearing
- https://tailwindcss.com/docs/upgrade-guide -- Migration from v3 to v4, PostCSS changes, @import replacement
- Project files: `tailwind.config.js`, `postcss.config.js`, `src/styles/globals.css`, `package.json` -- Current state inventory

### Secondary (MEDIUM confidence)
- Tailwind v4 upgrade guide via WebFetch -- PostCSS config simplification, autoprefixer removal confirmed

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Verified against official Tailwind v4 docs and project's installed versions
- Architecture: HIGH -- @theme namespace mapping verified against official docs; token inventory from codebase analysis
- Pitfalls: HIGH -- Namespace collisions (--text-*, --font-*) identified from cross-referencing project tokens with Tailwind v4 namespace rules
- Migration order: MEDIUM -- Logical ordering based on dependency analysis, but exact breakpoints between plans may shift

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (stable -- Tailwind v4 is production release)
