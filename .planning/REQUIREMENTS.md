# Requirements: DSA Visualizer

**Defined:** 2026-01-25
**Core Value:** Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood

## v2.0 Requirements — Design System Foundation

Establish Tailwind v4 `@theme` as single source of truth for all design tokens. Existing CSS Modules continue working via `@theme`-generated custom properties. No component migration — foundation only.

### Tailwind v4 Configuration

- [ ] **TW-01**: Replace `@tailwind base/components/utilities` directives with `@import "tailwindcss"`
- [ ] **TW-02**: Delete `tailwind.config.js` — no JS config file exists
- [ ] **TW-03**: Remove `autoprefixer` from PostCSS config and `package.json`
- [ ] **TW-04**: Install `clsx` for conditional className composition

### Design Token Migration

- [ ] **TOK-01**: Map all color tokens to `@theme` with correct namespace (`--color-*`)
- [ ] **TOK-02**: Map all spacing tokens to `@theme` (`--spacing-*`)
- [ ] **TOK-03**: Map all typography tokens to `@theme` (font families, sizes, weights, line heights)
- [ ] **TOK-04**: Map shadow, radius, and border tokens to `@theme`
- [ ] **TOK-05**: Consolidate keyframe animations into `@theme` block
- [ ] **TOK-06**: Define custom breakpoints in `@theme` (480px, 400px, 360px)

### Compatibility & Verification

- [ ] **VER-01**: All existing `var()` references in CSS Modules resolve correctly from `@theme`-generated properties
- [ ] **VER-02**: Preflight overrides added to prevent style changes to unmigrated components
- [ ] **VER-03**: `npm run build` passes with zero errors
- [ ] **VER-04**: All pages render identically to pre-migration state

## v1.2 Requirements (Complete)

<details>
<summary>v1.2 Polish & Production — All 13 requirements complete</summary>

### Responsive Design

- [x] **RESP-01**: Standardized breakpoints (640/768/1024px) across all CSS files
- [x] **RESP-02**: Mobile navigation (hamburger menu or bottom nav) replaces hidden nav
- [x] **RESP-03**: Touch-friendly controls (44px minimum tap targets)
- [x] **RESP-04**: Responsive visualizations adapt to screen width
- [x] **RESP-05**: Monaco Editor hidden on mobile, replaced with read-only code display

### SEO & Meta

- [x] **SEO-01**: generateMetadata on all dynamic routes
- [x] **SEO-02**: Breadcrumb schema (JSON-LD) on all pages
- [x] **SEO-03**: Dynamic OpenGraph images for social sharing

### Cross-Linking

- [x] **LINK-01**: Pattern -> Problem links ("Practice this pattern" sections)
- [x] **LINK-02**: Problem -> Pattern links ("Learn the pattern" sections)
- [x] **LINK-03**: Footer navigation with site-wide links

### Page Consistency

- [x] **PAGE-01**: Consistent headers on DSA pattern pages matching concept pages
- [x] **PAGE-02**: NavBar breadcrumbs present on all page types

</details>

## v2.1+ Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Component Migration

- **MIG-01**: Migrate all 74 CSS Module files to Tailwind utility classes
- **MIG-02**: Replace dynamic bracket-notation class access with mapping objects
- **MIG-03**: Convert pseudo-element gradient border patterns to `@layer components`
- **MIG-04**: Convert desktop-first media queries to Tailwind responsive prefixes
- **MIG-05**: Refactor NavBar CSS-only checkbox hack to React state
- **MIG-06**: Delete all `*.module.css` files and remove orphaned imports

### Enhanced Interactivity

- **INT-01**: Prediction prompts before revealing next step
- **INT-02**: Keyboard shortcuts for stepping
- **INT-03**: Pattern recognition quizzes

### Additional DSA Patterns

- **PAT-01**: Sliding Window pattern visualization
- **PAT-02**: Binary Search pattern visualization
- **PAT-03**: Dynamic Programming pattern visualization

### Advanced Polish

- **ADV-01**: PWA offline mode with service worker
- **ADV-02**: Dark/light mode toggle
- **ADV-03**: Learning path progress tracking

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| `@apply` usage | Tailwind v4 discourages it; use utility classes or `@layer components` |
| Component migration | Deferred to v2.1+ — foundation only in v2.0 |
| Visual redesign | Maintain current appearance exactly |
| `tailwind-merge` / `prettier-plugin-tailwindcss` | Evaluate post-foundation |
| New component features | Foundation scope only — no new functionality |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TW-01 | TBD | Pending |
| TW-02 | TBD | Pending |
| TW-03 | TBD | Pending |
| TW-04 | TBD | Pending |
| TOK-01 | TBD | Pending |
| TOK-02 | TBD | Pending |
| TOK-03 | TBD | Pending |
| TOK-04 | TBD | Pending |
| TOK-05 | TBD | Pending |
| TOK-06 | TBD | Pending |
| VER-01 | TBD | Pending |
| VER-02 | TBD | Pending |
| VER-03 | TBD | Pending |
| VER-04 | TBD | Pending |
| RESP-01 | Phase 11 | Complete |
| RESP-02 | Phase 15 | Complete |
| RESP-03 | Phase 15 | Complete |
| RESP-04 | Phase 15 | Complete |
| RESP-05 | Phase 11 | Complete |
| SEO-01 | Phase 12 | Complete |
| SEO-02 | Phase 12 | Complete |
| SEO-03 | Phase 12 | Complete |
| LINK-01 | Phase 13 | Complete |
| LINK-02 | Phase 13 | Complete |
| LINK-03 | Phase 13 | Complete |
| PAGE-01 | Phase 14 | Complete |
| PAGE-02 | Phase 14 | Complete |

**Coverage:**
- v2.0 requirements: 14 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 14

---
*Requirements defined: 2026-01-25*
*Last updated: 2026-01-27 — v2.0 rescoped to Design System Foundation (14 requirements)*
