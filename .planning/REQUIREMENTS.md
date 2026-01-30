# Requirements: DSA Visualizer

**Defined:** 2026-01-30
**Core Value:** Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood

## v3.0 Requirements — Complete Concept Visualizations

Add step-through visualizations for all remaining JS concepts — async patterns, OOP/prototypes, and closures. Each matches existing Viz quality with beginner/intermediate/advanced difficulty levels.

### Async Visualizations

- [ ] **ASYNC-01**: CallbacksBasicsViz — step-through of callback function passing and invocation
- [ ] **ASYNC-02**: CallbackHellViz — pyramid visualization of nested callbacks with readability issues
- [ ] **ASYNC-03**: ErrorFirstCallbacksViz — Node.js error-first pattern with error propagation
- [ ] **ASYNC-04**: PromisesCreationViz — new Promise constructor, resolve/reject mechanics
- [ ] **ASYNC-05**: PromisesThenCatchViz — then/catch chaining with return value flow
- [ ] **ASYNC-06**: PromisesChainingViz — sequential promise chaining with transformations
- [ ] **ASYNC-07**: PromisesStaticViz — Promise.all, Promise.race, Promise.allSettled comparison
- [ ] **ASYNC-08**: AsyncAwaitSyntaxViz — async function suspension and resumption points
- [ ] **ASYNC-09**: AsyncAwaitErrorsViz — try/catch with async/await, error propagation
- [ ] **ASYNC-10**: AsyncAwaitParallelViz — Promise.all with async/await for concurrent execution
- [ ] **ASYNC-11**: MicrotaskQueueViz — microtask queue processing, promise callbacks
- [ ] **ASYNC-12**: TaskQueueViz — macrotask queue (setTimeout, setInterval, I/O)
- [ ] **ASYNC-13**: EventLoopTickViz — granular event loop tick showing task selection

### OOP/Prototype Visualizations

- [ ] **OOP-01**: PrototypeChainBasicsViz — object → prototype → Object.prototype → null chain
- [ ] **OOP-02**: PropertyLookupViz — property access walking the prototype chain
- [ ] **OOP-03**: InstanceofViz — instanceof operator checking prototype chain membership
- [ ] **OOP-04**: ClassSyntaxViz — ES6 class as syntactic sugar over prototypes
- [ ] **OOP-05**: PrototypeInheritanceViz — extends keyword and prototype linking
- [ ] **OOP-06**: PrototypePollutionViz — dangers of modifying Object.prototype

### Closure Visualizations

- [ ] **CLOS-01**: ClosureDefinitionViz — lexical environment capture at function creation
- [ ] **CLOS-02**: ClosurePracticalViz — data privacy, factory functions, state encapsulation
- [ ] **CLOS-03**: ClosureLoopGotchaViz — var vs let in loops, closure over single binding
- [ ] **CLOS-04**: ClosureMemoryLeaksViz — DOM references, large objects held by closures
- [ ] **CLOS-05**: ClosureModulePatternViz — IIFE revealing module pattern
- [ ] **CLOS-06**: ClosurePartialApplicationViz — currying and partial function application

### Quality Requirements

- [ ] **QUAL-01**: All visualizations have beginner/intermediate/advanced difficulty levels
- [ ] **QUAL-02**: All visualizations use SharedViz components (CodePanel, StepControls, StepProgress)
- [ ] **QUAL-03**: Code highlighting synced with visualization step
- [ ] **QUAL-04**: Mobile responsive layout for all new visualizations

## v2.0 Requirements (Complete)

<details>
<summary>v2.0 Design System Foundation — All requirements complete</summary>

### Tailwind v4 Configuration

- [x] **TW-01**: Replace `@tailwind base/components/utilities` directives with `@import "tailwindcss"`
- [x] **TW-02**: Delete `tailwind.config.js` -- no JS config file exists
- [x] **TW-03**: Remove `autoprefixer` from PostCSS config and `package.json`
- [x] **TW-04**: Install `clsx` for conditional className composition

### Design Token Migration

- [x] **TOK-01**: Map all color tokens to `@theme` with correct namespace (`--color-*`)
- [x] **TOK-02**: Map all spacing tokens to `@theme` (`--spacing-*`)
- [x] **TOK-03**: Map all typography tokens to `@theme` (font families, sizes, weights, line heights)
- [x] **TOK-04**: Map shadow, radius, and border tokens to `@theme`
- [x] **TOK-05**: Consolidate keyframe animations into `@theme` block
- [x] **TOK-06**: Define custom breakpoints in `@theme` (480px, 400px, 360px)

### Compatibility & Verification

- [x] **VER-01**: All existing `var()` references in CSS Modules resolve correctly
- [x] **VER-02**: Preflight overrides added to prevent style changes
- [x] **VER-03**: `npm run build` passes with zero errors
- [x] **VER-04**: All pages render identically to pre-migration state

</details>

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

## v3.1+ Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Component Migration

- **MIG-01**: Migrate CSS Module files to Tailwind utility classes
- **MIG-02**: Replace dynamic bracket-notation class access with mapping objects
- **MIG-03**: Extract shared Viz UI components (LevelSelector, ExampleSelector)

### Additional DSA Patterns

- **PAT-01**: Sliding Window pattern visualization
- **PAT-02**: Binary Search pattern visualization
- **PAT-03**: Dynamic Programming pattern visualization

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Shared UI extraction | Copy-paste approach chosen; each Viz self-contained |
| Real code execution | Use simulation with explicit disclaimers |
| GC animation | Misleading; hard to visualize accurately |
| Custom code editor | Existing CodePanel sufficient |
| New DSA patterns | Deferred to future milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ASYNC-01..13 | TBD | Pending |
| OOP-01..06 | TBD | Pending |
| CLOS-01..06 | TBD | Pending |
| QUAL-01..04 | All phases | Pending |

**Coverage:**
- v3.0 requirements: 29 total (25 viz + 4 quality)
- Mapped to phases: 0
- Unmapped: 29

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-01-30 — v3.0 requirements defined*
