# Phase 17: Compatibility Verification - Research

**Researched:** 2026-01-27
**Domain:** CSS custom property verification, Tailwind v4 preflight overrides, visual regression testing
**Confidence:** HIGH

## Summary

Phase 17 verifies that the Phase 16 token migration (201 @theme tokens + 18 keyframes) produces zero visual changes across the entire application. The codebase has 88 CSS Module files containing 8,252 `var()` references against 260 defined custom properties. 209 unique property names are referenced from CSS Modules; of these, 21 are not defined in `globals.css` but are safely handled: most are component-scoped vars set via inline styles from React (e.g., `--era-color`, `--frame-color`, `--js-viz-*`, `--neon-start/end`), and a few use CSS `var()` fallback values (e.g., `--text-muted` with `, #888` fallback). The build currently passes cleanly.

The verification phase has four pillars: (1) static + runtime var() analysis, (2) Tailwind v4 preflight overrides, (3) build/lint validation, and (4) Playwright visual regression testing across 12 route templates generating ~38 static pages at 3 viewports.

**Primary recommendation:** Use Playwright's built-in `toHaveScreenshot()` for visual regression, a Node.js script using PostCSS AST walking for static var() analysis, and surgical preflight overrides in `globals.css` within the existing `@layer base` block.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@playwright/test` | latest (1.50+) | Visual regression testing with screenshot comparison | Built-in `toHaveScreenshot()`, pixelmatch diffing, multi-viewport support, headless consistency |
| `postcss` | ^8.5.6 (already installed) | CSS AST parsing for static var() analysis | Already a project dependency via @tailwindcss/postcss |
| `postcss-value-parser` | latest | Parse CSS values to extract var() references | Standard companion to PostCSS for value-level analysis |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `pixelmatch` | (bundled with Playwright) | Pixel-by-pixel image comparison | Automatically used by `toHaveScreenshot()` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright screenshots | Percy / Chromatic | Overkill for this project; adds external dependency and cost. Playwright is free, local, and sufficient |
| PostCSS AST walking | Regex-based grep script | Regex misses edge cases (nested vars, multi-line values, comments); PostCSS parsing is authoritative |
| postcss-value-parser | Manual string parsing | Value parser handles nested `var()`, fallbacks, and complex expressions correctly |

**Installation:**
```bash
npm install -D @playwright/test postcss-value-parser
npx playwright install chromium
```

## Architecture Patterns

### Recommended Project Structure
```
project-root/
├── scripts/
│   ├── check-vars.ts          # Static var() analysis (npm run check:vars)
│   ├── check-keyframes.ts     # Lint: no @keyframes in .module.css
│   └── tokens-audit.ts        # Token usage audit (npm run tokens:audit)
├── e2e/
│   ├── visual-regression.spec.ts  # Screenshot comparison tests
│   └── visual-regression.spec.ts-snapshots/  # Baseline screenshots (git-tracked)
├── playwright.config.ts       # Playwright configuration
└── src/styles/globals.css     # Preflight overrides added here
```

### Pattern 1: Static var() Analysis with PostCSS
**What:** Parse all CSS Module files using PostCSS + postcss-value-parser to extract every `var()` reference, then compare against defined properties in globals.css.
**When to use:** Fast CI check that catches missing/renamed custom properties without running the app.
**Example:**
```typescript
// scripts/check-vars.ts
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import valueParser from 'postcss-value-parser'
import { glob } from 'glob'

// 1. Parse globals.css to collect all defined custom properties
// 2. Walk all .module.css files, extract var(--*) references
// 3. Skip component-scoped vars (defined in same file)
// 4. Skip vars with fallback values
// 5. Report any unresolved references as errors
// 6. Exit with code 1 if any found
```

### Pattern 2: Playwright Visual Regression with Viewport Matrix
**What:** Screenshot every page at 360px, 768px, and 1440px viewports, compare against baselines.
**When to use:** Catch any visual change caused by token migration, preflight, or CSS cascade issues.
**Example:**
```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test'

const routes = [
  '/',
  '/concepts',
  '/concepts/js',
  '/concepts/hoisting',  // ... all concept IDs
  '/concepts/dsa',
  '/concepts/dsa/arrays',  // ... all DSA concept IDs
  '/concepts/dsa/patterns/two-pointers',
  // ... all pattern slugs
  '/arrays-hashing',  // ... all category IDs
  '/playground/event-loop',
]

const viewports = [
  { width: 360, height: 800, name: '360px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1440, height: 900, name: '1440px' },
]

for (const route of routes) {
  for (const vp of viewports) {
    test(`${route} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      // Mask dynamic content if needed
      await expect(page).toHaveScreenshot(
        `${route.replace(/\//g, '_')}-${vp.name}.png`,
        { maxDiffPixels: 0 }
      )
    })
  }
}
```

### Pattern 3: Preflight Surgical Overrides
**What:** Keep Tailwind v4 preflight active but override specific rules that conflict with existing component styles.
**When to use:** When you want Tailwind's modern-normalize benefits but need to protect unmigrated component styles.
**Example:**
```css
/* In @layer base block of globals.css, AFTER the existing * reset */
/* Preflight overrides - protect existing component styles */
h1, h2, h3, h4, h5, h6 {
  font-size: revert;
  font-weight: var(--font-weight-semibold);
  /* Already handled: line-height: 1.25 is set on h1-h6 in existing base */
}

img, svg, video, canvas, audio, iframe, embed, object {
  display: revert;
  vertical-align: revert;
}

img, video {
  max-width: revert;
  height: revert;
}
```

### Anti-Patterns to Avoid
- **Disabling preflight entirely:** Using the split import approach (`@import "tailwindcss/theme.css"` + `@import "tailwindcss/utilities.css"`) removes modern-normalize benefits. Since the existing `@layer base` already applies `* { margin: 0; padding: 0; box-sizing: border-box; }`, there is significant overlap. But fully disabling risks losing lesser-known normalize behaviors. Surgical overrides are safer.
- **Using regex-only for var() scanning:** Regular expressions cannot handle nested `var()` (e.g., `var(--a, var(--b, red))`), multi-line declarations, or comments. Always use proper CSS parsing.
- **Setting non-zero maxDiffPixels threshold:** The requirement is zero tolerance. Any pixel threshold masks real regressions. Use `maxDiffPixels: 0`.
- **Running visual tests against dev server:** Font loading timing and HMR overlay can cause flakes. Use `npm run build && npm start` (production build) for consistent results.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS value parsing | Custom regex parser | `postcss-value-parser` | Handles nested vars, fallbacks, functions, edge cases |
| Screenshot comparison | Custom pixel diffing | Playwright `toHaveScreenshot()` | Pixelmatch integration, diff image generation, threshold control |
| CSS file parsing | String splitting | `postcss.parse()` | Handles comments, at-rules, nested selectors correctly |
| Route enumeration for tests | Hardcoded list only | Derive from Next.js build output + data files | The app has ~38 static pages from 12 route templates; hardcoding risks drift |

**Key insight:** CSS parsing is deceptively complex. Comments, nested functions, multi-line values, and escape sequences break naive string approaches. PostCSS + postcss-value-parser are battle-tested.

## Common Pitfalls

### Pitfall 1: Component-Scoped Custom Properties Flagged as Missing
**What goes wrong:** Static analysis flags `--era-color`, `--frame-color`, `--neon-start`, `--neon-end`, `--js-viz-*`, `--columns`, etc. as unresolved because they are not in globals.css.
**Why it happens:** These 21 properties are set via React inline styles (`style={{ '--era-color': color }}`), within the same CSS Module scope, or use `var()` fallback values.
**How to avoid:** The var() checker must:
1. Collect properties defined within the SAME CSS Module file (local scope)
2. Detect and allow fallback values in `var(--prop, fallback)`
3. Maintain a known-dynamic-props allowlist for inline-style-injected properties
**Warning signs:** False positives in the var() check output for well-known component vars.

### Pitfall 2: Tailwind v4 Preflight Resetting Headings/Images
**What goes wrong:** Tailwind v4 preflight sets `h1-h6 { font-size: inherit; font-weight: inherit; }` and `img { display: block; max-width: 100% }`. Existing component styles in CSS Modules override these, but any element NOT covered by a module class falls through to preflight defaults.
**Why it happens:** The existing globals.css sets `h1-h6 { font-weight: var(--font-weight-semibold); line-height: 1.25 }` but does NOT set `font-size` -- it relies on browser defaults for heading sizes.
**How to avoid:** Add explicit `font-size` overrides for headings in the base layer, or confirm all headings are styled via CSS Module classes. Audit every `<h1>` through `<h6>` usage.
**Warning signs:** Headings appearing as body-text size; images collapsing to 100% width unexpectedly.

### Pitfall 3: Preflight Border Reset Breaking Component Borders
**What goes wrong:** Tailwind v4 preflight sets `* { border: 0 solid }`. This changes the default `border-style` from `none` to `solid` and `border-width` to `0`. If any CSS Module uses `border-color` without also setting `border-width` and `border-style`, the rendering changes.
**Why it happens:** Pre-migration code may have relied on browser-default `border-style: none` for elements that set `border-color`.
**How to avoid:** The globals.css already has `button { border: none }` which is correct. Check all CSS Module files that set `border-color` without `border-width`.
**Warning signs:** Unexpected thin borders appearing on elements.

### Pitfall 4: OS-Dependent Rendering in Playwright
**What goes wrong:** Baseline screenshots generated on macOS don't match CI (Linux). Font rendering, anti-aliasing, and sub-pixel positioning differ.
**Why it happens:** Different OS font stacks, GPU rendering paths, and sub-pixel antialiasing algorithms.
**How to avoid:** Always run Playwright in Docker (or same OS as CI) for baseline generation. Use `--update-snapshots` to regenerate. Store OS-specific snapshot directories if needed.
**Warning signs:** Tests pass locally but fail in CI with single-pixel diffs on text edges.

### Pitfall 5: Animation State Captured in Screenshots
**What goes wrong:** Elements with CSS animations (`--animate-pulse`, `--animate-spin`, etc.) are captured mid-animation, causing non-deterministic screenshots.
**Why it happens:** The 18 keyframe animations in @theme run continuously on various elements.
**How to avoid:** Use `reducedMotion: 'reduce'` in Playwright context options (emulates `prefers-reduced-motion: reduce`). If the app doesn't respect this media query, inject a stylesheet via `stylePath` that pauses animations:
```css
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```
**Warning signs:** Flaky tests where the same page passes sometimes and fails other times.

### Pitfall 6: @theme Wildcard Resets and Tailwind Utility Generation
**What goes wrong:** The `--color-*: initial` and `--radius-*: initial` wildcard resets in @theme clear Tailwind's default palette. If any code uses Tailwind utility classes like `bg-blue-500` (expecting Tailwind's default blue), they resolve to nothing.
**Why it happens:** Phase 16 intentionally cleared defaults to use custom tokens only.
**How to avoid:** Verify no Tailwind utility classes reference cleared default namespaces. All CSS Modules use `var()` directly, so this is mainly a concern for any inline Tailwind classes in JSX.
**Warning signs:** Elements with transparent/missing backgrounds where color was expected.

## Code Examples

### Static var() Checker Script
```typescript
// scripts/check-vars.ts
// Source: PostCSS API + postcss-value-parser API
import fs from 'fs'
import postcss from 'postcss'
import valueParser from 'postcss-value-parser'

function extractDefinedProps(css: string): Set<string> {
  const defined = new Set<string>()
  const root = postcss.parse(css)
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      defined.add(decl.prop)
    }
  })
  return defined
}

function extractVarReferences(css: string): Array<{ prop: string; hasFallback: boolean; source: string }> {
  const refs: Array<{ prop: string; hasFallback: boolean; source: string }> = []
  const root = postcss.parse(css)
  root.walkDecls((decl) => {
    const parsed = valueParser(decl.value)
    parsed.walk((node) => {
      if (node.type === 'function' && node.value === 'var') {
        const propNode = node.nodes[0]
        if (propNode && propNode.value.startsWith('--')) {
          refs.push({
            prop: propNode.value,
            hasFallback: node.nodes.length > 2, // has comma + fallback
            source: `${decl.prop}: ${decl.value}`,
          })
        }
      }
    })
  })
  return refs
}
```

### Playwright Config for Visual Regression
```typescript
// playwright.config.ts
// Source: https://playwright.dev/docs/test-snapshots
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
  ],
})
```

### Preflight Override Pattern
```css
/* Inside @layer base { ... } in globals.css */
/* Preflight overrides - preserve pre-migration heading rendering */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: 1.25;
  /* font-size is NOT reset by our base styles; CSS Modules handle it */
}

/* Prevent preflight from making images block-level */
img, svg, video, canvas, audio, iframe, embed, object {
  display: revert;
  vertical-align: revert;
}
img, video {
  max-width: revert;
  height: revert;
}

/* Preserve button reset */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  font-size: inherit;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `preflight: false` in JS config | Omit `@import "tailwindcss/preflight.css"` or surgical overrides in `@layer base` | Tailwind v4 (2025) | No JS config to disable; must use CSS-only approaches |
| Manual screenshot diffing tools | Playwright `toHaveScreenshot()` built-in | Playwright 1.22+ (2022) | No external dependencies needed for visual regression |
| grep-based CSS analysis | PostCSS AST parsing | Always available | Authoritative parsing vs. pattern matching |

**Deprecated/outdated:**
- `corePlugins: { preflight: false }` in `tailwind.config.js` - No longer works in Tailwind v4 (no JS config)
- `@tailwind base` / `@tailwind utilities` directives - Replaced by `@import "tailwindcss"` in v4

## Codebase-Specific Findings

### Current Token State (Post Phase 16)
- **260 custom properties** defined in `globals.css` (201 in @theme + 59 in @layer base :root)
- **209 unique var() references** across 88 CSS Module files (8,252 total references)
- **21 component-scoped vars** used in modules but defined locally or via inline styles:
  - React inline styles: `--era-color`, `--frame-color`, `--neon-start`, `--neon-end`, `--columns`
  - Module-local: `--js-viz-accent`, `--js-viz-border`, `--js-viz-muted`, `--js-viz-pill-bg`, `--js-viz-pill-border`, `--js-viz-radius`, `--js-viz-surface`, `--js-viz-surface-2`, `--js-viz-text`
  - Fallback-protected: `--text-muted`, `--text-primary`, `--text-secondary` (all have `, #xxx` fallbacks)
  - Layout vars: `--decimal-width`, `--equals-width`, `--label-width`, `--rule-color`
- **0 @keyframes** in CSS Module files (all consolidated in @theme)
- **Build passes** cleanly with zero errors
- **Lint passes** with zero warnings

### Route Inventory for Visual Testing
12 route templates producing ~38 static pages:
1. `/` - Home page
2. `/concepts` - Concepts overview
3. `/concepts/js` - JS concepts listing
4. `/concepts/[conceptId]` - ~32 individual JS concept pages
5. `/concepts/dsa` - DSA concepts listing
6. `/concepts/dsa/[conceptId]` - ~8 DSA concept pages
7. `/concepts/dsa/patterns/[patternId]` - 3 pattern pages
8. `/[categoryId]` - Category listings (multiple categories)
9. `/[categoryId]/[problemId]` - Practice pages (many problems)
10. `/[categoryId]/[problemId]/concept` - Algorithm visualization pages
11. `/js-problems` - JS problems listing
12. `/playground/event-loop` - Event loop playground

### Preflight Impact Assessment (HIGH confidence)
The existing `@layer base` block in globals.css already covers:
- `* { margin: 0; padding: 0; box-sizing: border-box; }` -- overlaps with preflight's universal reset
- `h1-h6 { font-weight: semibold; line-height: 1.25 }` -- partially overlaps, BUT does NOT set `font-size`
- `button { font-family: inherit; cursor: pointer; border: none; background: none; }` -- fully overlaps with preflight's button reset
- `code, pre { font-family: var(--font-mono) }` -- not affected by preflight

**Missing from existing base (potential preflight conflicts):**
- No heading `font-size` override (preflight sets `font-size: inherit` on h1-h6)
- No image/media display override (preflight sets `display: block`)
- No list-style override (preflight removes bullets -- but this matches existing component styles)
- `border: 0 solid` universal reset may affect components using shorthand border declarations

## Open Questions

1. **How many pages to screenshot in practice?**
   - What we know: 12 route templates produce ~38 static pages. Dynamic routes like `[categoryId]/[problemId]` could produce 100+ pages.
   - What's unclear: Whether ALL problem pages need visual testing or just a representative sample per template.
   - Recommendation: Screenshot ALL statically generated pages (what the build produces). Skip dynamic-only routes that require specific problem IDs. The build output shows exactly which pages are pre-rendered.

2. **Docker vs. local for Playwright baseline?**
   - What we know: OS-level rendering differences cause false diffs. The project has no existing Docker setup.
   - What's unclear: Whether CI is used (no CI config files found in repo).
   - Recommendation: Start with local baselines on the developer's machine. If CI is added later, regenerate baselines in that environment. Document the environment in the snapshot directory.

3. **Surgical overrides vs. full preflight disable?**
   - What we know: The existing base styles overlap significantly with preflight. The key conflicts are headings (font-size), images (display: block), and the universal border reset.
   - Recommendation: **Surgical overrides** -- keep preflight for its normalize benefits, override the 3-4 specific rules that conflict. This is more maintainable than the split-import approach which has known issues in Tailwind v4.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/styles/globals.css` (643 lines, 260 custom properties)
- Codebase analysis: 88 CSS Module files (8,252 var() references, 209 unique)
- Phase 16 Verification Report: `.planning/phases/16-config-token-migration/16-VERIFICATION.md`
- [Tailwind CSS v4 Preflight docs](https://tailwindcss.com/docs/preflight) - What preflight resets, how to disable/override
- [Playwright Visual Comparisons docs](https://playwright.dev/docs/test-snapshots) - `toHaveScreenshot()` API, thresholds, snapshot management
- [Next.js Playwright Testing guide](https://nextjs.org/docs/pages/guides/testing/playwright) - webServer config, Next.js integration

### Secondary (MEDIUM confidence)
- [Tailwind v4 preflight disable discussion](https://github.com/tailwindlabs/tailwindcss/discussions/17481) - Community issues with split imports
- [Playwright visual regression in Next.js](https://ashconnolly.com/blog/playwright-visual-regression-testing-in-next) - reducedMotion, animation handling, devIndicators
- [Playwright snapshot testing guide](https://www.browserstack.com/guide/playwright-snapshot-testing) - Best practices for 2026

### Tertiary (LOW confidence)
- None -- all findings verified against official documentation or codebase analysis.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Playwright and PostCSS are the obvious choices; both verified against official docs
- Architecture: HIGH - Patterns derived from official Playwright docs + codebase-specific analysis
- Pitfalls: HIGH - All pitfalls identified from codebase analysis (component-scoped vars, heading font-size gap) or official Tailwind docs (preflight behavior)

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (stable domain; Tailwind v4 and Playwright APIs are mature)
