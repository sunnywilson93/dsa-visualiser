# Phase 16: Config & Token Migration - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate from Tailwind JS config (`tailwind.config.js`) to Tailwind v4 CSS-first `@theme` configuration. All 246 design tokens are mapped into `@theme` namespaces. Existing CSS Modules continue working via `@theme`-generated custom properties. No component migration — foundation only.

</domain>

<decisions>
## Implementation Decisions

### Token naming convention
- Claude's discretion on whether to use Tailwind v4 namespaces, keep existing names, or go hybrid — decide based on codebase analysis
- Use semantic grouping for token names: encode purpose in the name (e.g., `--color-bg-primary`, `--color-text-muted`, `--color-border-default`) rather than flat names
- App is dark-themed by default — no light/dark toggle or `prefers-color-scheme` handling needed. Single theme only.
- Custom breakpoints (480px, 400px, 360px) added alongside Tailwind's defaults (sm/md/lg/xl), not replacing them

### Token consolidation strategy
- Consolidate duplicate tokens — merge tokens with **exact matching values only** (no perceptual/approximate merging)
- Claude's discretion on single-use tokens: decide whether to keep as @theme token or inline based on whether the value represents a design decision vs implementation detail
- Adopt a spacing scale (e.g., 4px base). Map existing spacing values to nearest scale points rather than preserving arbitrary values

### Keyframe animation handling
- Prune unused animations — only migrate keyframes that are actively referenced in the codebase
- Prefix animation names by purpose (e.g., `--animate-fade-in`, `--animate-slide-up`, `--animate-pulse`)
- Define animation duration and easing tokens in @theme alongside keyframes (e.g., `--duration-fast: 150ms`, `--ease-default: ease-in-out`)
- Promote ALL animations to @theme, including component-specific ones (pointer movement, highlight pulse, etc.) — one source of truth

### Migration ordering
- Split into multiple plans by token group — not a big-bang migration
- Claude's discretion on which group comes first (colors, config teardown, etc.) — determine optimal order during research
- Each plan must produce a buildable, visually correct app — no intermediate breakage allowed
- Delete `tailwind.config.js` and remove `autoprefixer` in the first plan (clean break), not deferred to the end

### Claude's Discretion
- Whether to use Tailwind v4 namespaces, keep existing var names, or hybrid approach for token naming
- Which token group to migrate first (ordering within the multi-plan structure)
- Whether single-use tokens should be promoted to @theme or inlined

</decisions>

<specifics>
## Specific Ideas

- The app is dark-themed — all tokens reflect a single dark color scheme
- Spacing should feel systematic (scale-based) not ad-hoc
- Animation naming should describe purpose, not implementation (fade-in not keyframe-1)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 16-config-token-migration*
*Context gathered: 2026-01-27*
