# Phase 17: Compatibility Verification - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify that all existing CSS Modules resolve correctly from @theme-generated custom properties after Phase 16's token migration. Add preflight overrides to prevent Tailwind v4 defaults from altering unmigrated component styles. Confirm zero visual changes across all pages at 360px, 768px, and 1440px viewports. Establish permanent regression safety nets (CI checks, lint rules, audit tooling).

</domain>

<decisions>
## Implementation Decisions

### Preflight Strategy
- Claude's discretion on approach (surgical overrides vs. full disable) — pick what fits the codebase best
- Claude's discretion on file location (globals.css vs. separate file)
- Zero tolerance for visual changes — if any element looks different after preflight, override it. Existing styles are sacred.
- Preflight overrides are **permanent foundation** — they become part of the design system baseline, not temporary migration artifacts

### Visual Parity Definition
- **Automated screenshot diff** using Playwright for all verification
- **All pages exhaustively** compared at 3 viewports (360px, 768px, 1440px)
- **Zero tolerance** pixel-diff threshold — any pixel difference is a failure
- Playwright headless browser for screenshot capture

### Broken var() Handling
- **Both** static analysis and runtime verification — static first (fast, catches obvious breaks), then runtime (catches cascade issues)
- **Fix all immediately** — zero tolerance for broken references, every one gets fixed before phase is complete
- Static analysis script becomes a **reusable npm script** (`npm run check:vars`)
- var() checker includes **value verification** — compare resolved values against baseline to catch tokens that exist but have wrong values

### Regression Safety Net
- Playwright visual tests become **permanent CI tests** — run on every PR to prevent future token changes from breaking pages
- **Lint rule enforcement** — custom lint rule prevents new CSS files from defining @keyframes in .module.css (must use @theme)
- var() checker (`npm run check:vars`) **runs in CI** alongside build and lint
- **Token audit script** (`npm run tokens:audit`) — lists all @theme tokens vs. var() usage, shows defined vs. used, unused tokens, unresolved references

### Claude's Discretion
- Preflight approach (surgical vs. full disable)
- Preflight file location
- Playwright test infrastructure setup details
- Lint rule implementation approach (Stylelint custom rule vs. script-based check)

</decisions>

<specifics>
## Specific Ideas

- Visual parity means every page, every viewport — no sampling, no exceptions
- Token value verification catches subtle bugs where a token exists but maps to a different hex value
- All tooling should be reusable for v2.1 component migration (npm scripts, CI checks persist)
- Preflight overrides are architectural, not temporary — they define the design system's relationship with Tailwind's reset layer

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-compatibility-verification*
*Context gathered: 2026-01-27*
