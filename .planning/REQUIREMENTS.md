# Requirements: DSA Visualizer

**Defined:** 2026-01-25
**Core Value:** Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood

## v2.0 Requirements — Tailwind Migration

Full migration from CSS Modules to Tailwind v4. Single design system source of truth via `@theme`. Visual parity — zero user-facing changes.

### Foundation & Configuration

- [ ] **TW-01**: Convert to Tailwind v4 CSS-first config (`@import "tailwindcss"`, `@theme` block, delete `tailwind.config.js`)
- [ ] **TW-02**: Map all design tokens to `@theme` namespaces (colors, spacing, typography, shadows, radius, animations)
- [ ] **TW-03**: Remove `autoprefixer` from PostCSS config (Tailwind v4 handles vendor prefixing)
- [ ] **TW-04**: Install `clsx` for conditional className composition

### Component Migration — Leaf

- [ ] **MIG-01**: Migrate 14 simple leaf components to Tailwind utility classes (ErrorBoundary, Console, Variables, CallStack, Controls, DifficultyIndicator, StepDescription, ReadOnlyCode, ExampleSelector, SiteFooter, RelatedPatterns, RelatedProblems, StepControls, StepProgress)
- [ ] **MIG-02**: Replace dynamic bracket-notation class access (`styles[variable]`) with mapping objects

### Component Migration — Medium

- [ ] **MIG-03**: Migrate 12 responsive/pseudo-element components (Card system, Carousels, Search, CodePanel, ProblemCard, ProblemListingLayout, ExpandableGrid)
- [ ] **MIG-04**: Convert pseudo-element gradient border patterns to `@layer components` rules
- [ ] **MIG-05**: Convert desktop-first media queries to Tailwind responsive prefixes

### NavBar & Complex Layout

- [ ] **MIG-06**: Refactor NavBar CSS-only checkbox hack to React state for mobile menu
- [ ] **MIG-07**: Migrate NavBar, CodeEditor, ConceptPanel, PlaygroundEditor CSS modules

### Concepts Visualization

- [ ] **MIG-08**: Extract shared viz patterns (level selector, example selector, step controls) to `@utility` directives
- [ ] **MIG-09**: Migrate 30 Concepts Viz CSS module files in 6 sub-batches

### DSA & Visualization

- [ ] **MIG-10**: Migrate 17 DSA pattern viz and visualization component CSS modules
- [ ] **MIG-11**: Handle dynamic `styles[state]` and `styles[width${n}]` patterns with mapping objects

### App Page Layouts

- [ ] **MIG-12**: Migrate 9 app page-level CSS modules to Tailwind utility classes

### Cleanup & Verification

- [ ] **MIG-13**: Delete all `*.module.css` files and remove orphaned imports
- [ ] **MIG-14**: Remove legacy CSS variable aliases from globals.css
- [ ] **MIG-15**: Full visual regression — all routes render identically at 360px, 768px, 1440px
- [ ] **MIG-16**: Build verification passes (`npm run build`, `npm run lint`, `npm run test:run`)

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
| Hybrid CSS Modules + Tailwind per component | Each component must be fully one or the other during migration |
| `@reference` for CSS Modules coexistence | Per-file compilation overhead, not recommended |
| Visual redesign | Migration only — maintain current appearance exactly |
| New component features | Migration scope only — no new functionality |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TW-01 | Phase 16 | Pending |
| TW-02 | Phase 16 | Pending |
| TW-03 | Phase 16 | Pending |
| TW-04 | Phase 16 | Pending |
| MIG-01 | Phase 17 | Pending |
| MIG-02 | Phase 17 | Pending |
| MIG-03 | Phase 18 | Pending |
| MIG-04 | Phase 18 | Pending |
| MIG-05 | Phase 18 | Pending |
| MIG-06 | Phase 19 | Pending |
| MIG-07 | Phase 19 | Pending |
| MIG-08 | Phase 20 | Pending |
| MIG-09 | Phase 20 | Pending |
| MIG-10 | Phase 21 | Pending |
| MIG-11 | Phase 21 | Pending |
| MIG-12 | Phase 22 | Pending |
| MIG-13 | Phase 23 | Pending |
| MIG-14 | Phase 23 | Pending |
| MIG-15 | Phase 23 | Pending |
| MIG-16 | Phase 23 | Pending |
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
- v2.0 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-01-25*
*Last updated: 2026-01-27 — v2.0 Tailwind Migration requirements added*
