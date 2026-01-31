# Requirements: DSA Visualizer

**Defined:** 2026-01-31
**Core Value:** Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood

## v4.0 Requirements — Design Token Consistency

Replace all hardcoded colors with @theme tokens — single source of truth for design consistency across 56 visualization components.

### Shared Infrastructure

- [ ] **INFRA-01**: Create shared `levelInfo` module with CSS var references for beginner/intermediate/advanced colors
- [ ] **INFRA-02**: Create shared `phaseColors` and `statusColors` modules for phase/status color functions
- [ ] **INFRA-03**: Define all required opacity variants in @theme (15, 20, 30, 40 for each accent color)
- [ ] **INFRA-04**: TypeScript type safety for token name references with compile-time validation

### Component Migration

- [ ] **MIG-01**: Migrate 39 `levelInfo` duplications to shared import
- [ ] **MIG-02**: Migrate 21 `phaseColors`/`statusColors` function duplications to shared import
- [ ] **MIG-03**: Replace 147 inline style hex values with CSS var references
- [ ] **MIG-04**: Establish visual regression baseline with before/after screenshot comparisons

### Animation Handling

- [ ] **ANIM-01**: Create animation constants file with hex values that mirror @theme tokens
- [ ] **ANIM-02**: Identify and catalog 18 components with Framer Motion animated colors
- [ ] **ANIM-03**: Document hybrid pattern for when to use CSS vars vs hex constants

### Quality Requirements

- [ ] **QUAL-01**: All 56 visualization components reference @theme tokens (no hardcoded hex)
- [ ] **QUAL-02**: Visual parity verified — no appearance changes after migration
- [ ] **QUAL-03**: `npm run build` passes with zero errors

## v3.0 Requirements (Paused)

<details>
<summary>v3.0 Complete Concept Visualizations — Phase 21 remaining</summary>

### Async Visualizations (Complete)

- [x] **ASYNC-01**: CallbacksBasicsViz — Phase 18
- [x] **ASYNC-02**: CallbackHellViz — Phase 18
- [x] **ASYNC-03**: ErrorFirstCallbacksViz — Phase 18
- [x] **ASYNC-04**: PromisesCreationViz — Phase 18
- [x] **ASYNC-05**: PromisesThenCatchViz — Phase 18
- [x] **ASYNC-06**: PromisesChainingViz — Phase 18
- [x] **ASYNC-07**: PromisesStaticViz — Phase 19
- [x] **ASYNC-08**: AsyncAwaitSyntaxViz — Phase 19
- [x] **ASYNC-09**: AsyncAwaitErrorsViz — Phase 19
- [x] **ASYNC-10**: AsyncAwaitParallelViz — Phase 19
- [x] **ASYNC-11**: MicrotaskQueueViz — Phase 19
- [x] **ASYNC-12**: TaskQueueViz — Phase 19
- [x] **ASYNC-13**: EventLoopTickViz — Phase 19

### OOP/Prototype Visualizations (Complete)

- [x] **OOP-01**: PrototypeChainBasicsViz — Phase 20
- [x] **OOP-02**: PropertyLookupViz — Phase 20
- [x] **OOP-03**: InstanceofViz — Phase 20
- [x] **OOP-04**: ClassSyntaxViz — Phase 20
- [x] **OOP-05**: PrototypeInheritanceViz — Phase 20
- [x] **OOP-06**: PrototypePollutionViz — Phase 20

### Closure Visualizations (Paused — Phase 21)

- [ ] **CLOS-01**: ClosureDefinitionViz
- [ ] **CLOS-02**: ClosurePracticalViz
- [ ] **CLOS-03**: ClosureLoopGotchaViz
- [ ] **CLOS-04**: ClosureMemoryLeaksViz
- [ ] **CLOS-05**: ClosureModulePatternViz
- [ ] **CLOS-06**: ClosurePartialApplicationViz

</details>

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

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full Tailwind utility migration | Deferred to v4.1+ — focus on token consistency first |
| Theme switching (dark/light) | Not needed for current single-theme design |
| CSS-in-JS solution | Adds complexity; CSS vars sufficient |
| ESLint rule for hex colors | Nice-to-have but not critical for v4.0 |
| Automated migration scripts | Manual migration preferred for control |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | TBD | Pending |
| INFRA-02 | TBD | Pending |
| INFRA-03 | TBD | Pending |
| INFRA-04 | TBD | Pending |
| MIG-01 | TBD | Pending |
| MIG-02 | TBD | Pending |
| MIG-03 | TBD | Pending |
| MIG-04 | TBD | Pending |
| ANIM-01 | TBD | Pending |
| ANIM-02 | TBD | Pending |
| ANIM-03 | TBD | Pending |
| QUAL-01 | All phases | Pending |
| QUAL-02 | All phases | Pending |
| QUAL-03 | All phases | Pending |

**Coverage:**
- v4.0 requirements: 14 total (4 infra + 4 migration + 3 animation + 3 quality)
- Mapped to phases: 0
- Unmapped: 14

---
*Requirements defined: 2026-01-31*
*Last updated: 2026-01-31 — v4.0 requirements defined*
