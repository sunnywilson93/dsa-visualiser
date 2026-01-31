# Roadmap: DSA Visualizer

## Milestones

- [x] **v1.0 JS Concept Visualizations** - Phases 1-6 (shipped 2026-01-24)
- [x] **v1.1 DSA Pattern Visualizations** - Phases 7-10 (shipped 2026-01-25)
- [x] **v1.2 Polish & Production** - Phases 11-15 (shipped 2026-01-25)
- [x] **v2.0 Design System Foundation** - Phases 16-17 (shipped 2026-01-27)
- [ ] **v3.0 Complete Concept Visualizations** - Phases 18-21 (paused at Phase 21)
- [ ] **v4.0 Design Token Consistency** - Phases 22-26 (in progress)

## Phases

<details>
<summary>v1.0 JS Concept Visualizations (Phases 1-6) - SHIPPED 2026-01-24</summary>

### Phase 1: Foundation
**Goal**: Reusable components exist for consistent step-through UX across all visualizations
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. CodePanel component renders code with line highlighting and auto-scrolls to current line
  2. StepControls component provides Prev/Next/Reset buttons that disable appropriately at boundaries
  3. Progress indicator shows "Step X/Y" synchronized with step state
  4. Auto-play mode advances steps at configurable intervals and pauses on user interaction
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md - CodePanel and StepProgress display components
- [x] 01-02-PLAN.md - StepControls and useAutoPlay hook

### Phase 2: LoopsViz
**Goal**: Learners can step through loop iterations to understand control flow and closure capture
**Depends on**: Phase 1
**Requirements**: LOOP-01, LOOP-02, LOOP-03, LOOP-04, LOOP-05
**Success Criteria** (what must be TRUE):
  1. User can step forward and backward through loop iterations without auto-play
  2. Each step displays an explanation of what the loop is doing (iteration count, condition check, body execution)
  3. Current code line highlights in sync with step, including loop body and condition
  4. User can select from beginner/intermediate/advanced examples with progressively complex loops
  5. Closure capture bug example clearly shows var creating one shared binding vs let creating per-iteration bindings
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md - Core LoopsViz rewrite with types, state, SharedViz integration, and beginner examples
- [x] 02-02-PLAN.md - Intermediate/advanced examples with closure capture visualization

### Phase 3: VariablesViz
**Goal**: Learners can step through variable lifecycle to understand hoisting, TDZ, and scope
**Depends on**: Phase 1
**Requirements**: VAR-01, VAR-02, VAR-03, VAR-04
**Success Criteria** (what must be TRUE):
  1. Hoisting visualization shows declaration phase separate from initialization phase
  2. TDZ step-through shows let/const variables existing but inaccessible before initialization
  3. Scope chain visualization shows variable lookup traversing nested scopes
  4. Block scope vs function scope examples demonstrate var escaping blocks while let/const do not
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md - Types, beginner examples, core component with level selector and SharedViz integration
- [x] 03-02-PLAN.md - Intermediate examples with scope chain visualization and lookup animation
- [x] 03-03-PLAN.md - Advanced examples with error states, hoisting animation, and phase badge

### Phase 4: FunctionsViz
**Goal**: Learners can step through function execution to understand contexts and the call stack
**Depends on**: Phase 1
**Requirements**: FUNC-01, FUNC-02, FUNC-03, FUNC-04
**Success Criteria** (what must be TRUE):
  1. Execution context creation and teardown steps show what happens when functions are called and return
  2. Parameter binding visualization shows arguments flowing into function parameters
  3. Call stack panel shows stack frames being pushed and popped during nested calls
  4. Arrow vs regular function examples demonstrate different this binding behavior
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md - Types, beginner examples, call stack panel, execution context display
- [x] 04-02-PLAN.md - Parameter binding animation with intermediate examples
- [x] 04-03-PLAN.md - This binding visualization with advanced examples

### Phase 5: ArraysBasicsViz
**Goal**: Learners can step through array operations to understand references, mutation, and iteration
**Depends on**: Phase 1
**Requirements**: ARR-01, ARR-02, ARR-03, ARR-04
**Success Criteria** (what must be TRUE):
  1. Reference vs value visualization shows primitives copied by value, arrays by reference with memory arrows
  2. Mutation effect steps show original array changing when mutated through reference
  3. Spread operator visualization shows elements being unpacked into new array
  4. Array method iteration (map/filter/reduce) steps through each callback invocation
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md - Types, beginner examples, core component rewrite with stack/heap visualization
- [x] 05-02-PLAN.md - Intermediate examples with spread operator and warning badges
- [x] 05-03-PLAN.md - Advanced examples with method iteration (map/filter/reduce)

### Phase 6: ObjectsBasicsViz
**Goal**: Learners can step through object operations to understand references and mutation
**Depends on**: Phase 1
**Requirements**: OBJ-01, OBJ-02, OBJ-03, OBJ-04
**Success Criteria** (what must be TRUE):
  1. Reference vs value visualization shows objects as references with arrows to heap representation
  2. Property mutation steps show changes to object properties affecting all references
  3. Destructuring visualization shows properties being extracted into new variables
  4. Object spread visualization shows shallow copy creating new object with copied references
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md - Types, beginner examples, core component rewrite with stack/heap visualization
- [x] 06-02-PLAN.md - Intermediate examples with spread operator and warning badges
- [x] 06-03-PLAN.md - Advanced examples with destructuring visualization

</details>

<details>
<summary>v1.1 DSA Pattern Visualizations (Phases 7-10) - SHIPPED 2026-01-25</summary>

**Milestone Goal:** Learners can step through algorithm patterns visually, understanding decision logic rather than just memorizing steps. Three core patterns: Two Pointers, Hash Map, and Bit Manipulation.

### Phase 7: Foundation
**Goal**: DSAPatterns infrastructure exists for pattern pages with shared types and routing
**Depends on**: Phase 6 (v1.0 complete)
**Requirements**: DSA-01, DSA-02, DSA-03
**Success Criteria** (what must be TRUE):
  1. DSAPatterns directory exists with shared types for pattern visualizations
  2. User can navigate to /concepts/dsa/patterns/[patternId] and see a pattern page shell
  3. dsaPatterns.ts exports pattern metadata (name, description, when to use, variants)
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md - DSAPatterns directory structure, shared types, and dsaPatterns.ts data file
- [x] 07-02-PLAN.md - Pattern page routing and page shell at /concepts/dsa/patterns/[patternId]

### Phase 8: TwoPointersViz
**Goal**: Learners can step through Two Pointers pattern with decision logic visible before movement
**Depends on**: Phase 7
**Requirements**: TP-01, TP-02, TP-03, TP-04, TP-05, TP-06
**Success Criteria** (what must be TRUE):
  1. User can navigate to /concepts/dsa/patterns/two-pointers and see TwoPointersViz component
  2. User can switch between beginner, intermediate, and advanced difficulty levels
  3. Pointer positions animate smoothly with movement direction clear
  4. Decision logic (why pointer moved) displays before movement animation completes
  5. Code panel highlights current line synced with visualization step
  6. User can see all three variants: converging (left/right), same-direction (slow/fast), partition
**Plans**: 3 plans

Plans:
- [x] 08-01-PLAN.md - Core TwoPointersViz component with types, variant tabs, beginner examples
- [x] 08-02-PLAN.md - Intermediate examples (Container With Most Water, 3Sum, Remove Duplicates)
- [x] 08-03-PLAN.md - Advanced examples (Sort Colors, Trapping Rain Water)

### Phase 9: HashMapViz
**Goal**: Learners can step through Hash Map pattern seeing bucket mechanism, not just key-value pairs
**Depends on**: Phase 7
**Requirements**: HM-01, HM-02, HM-03, HM-04, HM-05, HM-06
**Success Criteria** (what must be TRUE):
  1. User can navigate to /concepts/dsa/patterns/hash-map and see HashMapViz component
  2. User can switch between beginner, intermediate, and advanced difficulty levels
  3. Key-value pairs display within bucket structure showing hash relationship
  4. Bucket visualization shows hash function converting key to bucket index
  5. Frequency counter examples show count incrementing with visual feedback
  6. Lookup and insert operations step through with hash -> bucket -> entry flow
**Plans**: 3 plans

Plans:
- [x] 09-01-PLAN.md - Core HashMapViz component with bucket grid, hash calculation display, wiring, and beginner examples
- [x] 09-02-PLAN.md - Intermediate examples (Valid Anagram with frequency counting)
- [x] 09-03-PLAN.md - Advanced examples (Group Anagrams with sorted key technique)

### Phase 10: BitManipulationViz
**Goal**: Learners can step through Bit Manipulation seeing each bit position as independent flag
**Depends on**: Phase 7
**Requirements**: BM-01, BM-02, BM-03, BM-04, BM-05, BM-06
**Success Criteria** (what must be TRUE):
  1. User can navigate to /concepts/dsa/patterns/bit-manipulation and see BitManipulationViz component
  2. User can switch between beginner, intermediate, and advanced difficulty levels
  3. Binary representation displays with configurable bit width (4, 8, 16, or 32 bits)
  4. Active bit position highlights during operations with distinct visual indicator
  5. Bit-by-bit operation animation shows AND, OR, XOR, and shift operations step by step
  6. Operation result displays with explanation of what changed and why
**Plans**: 3 plans

Plans:
- [x] 10-01-PLAN.md - Core BitManipulationViz component with types, binary grid, SharedViz integration, wiring
- [x] 10-02-PLAN.md - Beginner examples (Single Number, Power of Two, Multiply/Divide)
- [x] 10-03-PLAN.md - Intermediate/advanced examples (Missing Number, Counting Bits, Reverse Bits, Subset Generation)

</details>

<details>
<summary>v1.2 Polish & Production (Phases 11-15) - SHIPPED 2026-01-25</summary>

**Milestone Goal:** Make the platform production-ready with responsive design, consistent page structure, cross-linking between pattern and problem pages, and SEO optimization.

### Phase 11: Foundation & Mobile Strategy
**Goal**: Establish responsive foundations and mobile editor strategy before building presentation layers
**Depends on**: Phase 10 (v1.1 complete)
**Requirements**: RESP-01, RESP-05
**Success Criteria** (what must be TRUE):
  1. Breakpoint system documented (640px/768px/1024px) with CSS variables or constants
  2. Mobile editor strategy decided and implemented (read-only code display below 768px)
  3. Cross-link utility functions exist (getCrossLinks.ts for pattern-problem relationships)
  4. SSR-safe responsive coding standards documented (CSS-only media queries, no JS viewport detection)
**Plans**: 2 plans

Plans:
- [x] 11-01-PLAN.md - Breakpoint documentation, ReadOnlyCode component, mobile editor fallback
- [x] 11-02-PLAN.md - Cross-link utility functions (getCrossLinks.ts)

### Phase 12: SEO Standardization
**Goal**: All pages have proper metadata, structured data, and social sharing images
**Depends on**: Nothing (independent of Phase 11, can run parallel)
**Requirements**: SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. All dynamic routes have generateMetadata exporting unique title, description, canonical URL
  2. Breadcrumb schema (JSON-LD) present on all page types (concepts, patterns, problems)
  3. Dynamic OpenGraph images generated for pattern pages and concept pages
  4. Sitemap includes all pages with correct lastmod dates
**Plans**: 4 plans

Plans:
- [x] 12-01-PLAN.md - Breadcrumb utility and sitemap enhancement
- [x] 12-02-PLAN.md - Breadcrumb schema on category and problem pages
- [x] 12-03-PLAN.md - Metadata for client-only concept pages (JS, DSA)
- [x] 12-04-PLAN.md - Dynamic OpenGraph images for patterns, concepts, categories

### Phase 13: Cross-Linking
**Goal**: Users can navigate between pattern pages and problem pages bidirectionally
**Depends on**: Phase 11 (uses cross-link utilities)
**Requirements**: LINK-01, LINK-02, LINK-03
**Success Criteria** (what must be TRUE):
  1. Pattern pages show "Practice this pattern" section with linked problems
  2. Problem pages show "Learn the pattern" link to relevant pattern page
  3. Footer navigation exists with site-wide links for discoverability
  4. No orphaned pages (every page has at least 2 incoming internal links)
**Plans**: 3 plans

Plans:
- [x] 13-01-PLAN.md - RelatedProblems and RelatedPatterns cross-link components
- [x] 13-02-PLAN.md - Footer navigation component and integration
- [x] 13-03-PLAN.md - Gap closure: Fix footer links and add missing problem mappings

### Phase 14: Page Consistency
**Goal**: All DSA pattern pages have consistent headers matching JS concept pages
**Depends on**: Nothing (independent, can run parallel with Phase 13)
**Requirements**: PAGE-01, PAGE-02
**Success Criteria** (what must be TRUE):
  1. DSA pattern pages use same header structure as JS concept pages (title, description, when-to-use)
  2. NavBar breadcrumbs present and working on all page types (home > category > page)
  3. Consistent spacing using CSS variables across pattern and concept pages
**Plans**: 1 plan

Plans:
- [x] 14-01-PLAN.md - Update PatternPageClient and ConceptVizPageClient with NavBar breadcrumbs and consistent headers

### Phase 15: Responsive Implementation
**Goal**: Platform works seamlessly on mobile, tablet, and desktop with touch-friendly controls
**Depends on**: Phase 11 (uses breakpoint system), Phase 13, Phase 14 (content finalized)
**Requirements**: RESP-02, RESP-03, RESP-04
**Success Criteria** (what must be TRUE):
  1. Mobile navigation works (hamburger menu or bottom nav replaces hidden nav items)
  2. All interactive elements have 44px minimum tap targets
  3. Visualizations adapt to screen width without horizontal scroll
  4. Practice page panels collapse appropriately on tablet/mobile
  5. Step controls remain usable on touch devices
**Plans**: 3 plans

Plans:
- [x] 15-01-PLAN.md - CSS-only hamburger menu for mobile navigation
- [x] 15-02-PLAN.md - 44px touch targets on all visualization controls
- [x] 15-03-PLAN.md - Responsive visualization containers with horizontal scroll

</details>

<details>
<summary>v2.0 Design System Foundation (Phases 16-17) - SHIPPED 2026-01-27</summary>

**Milestone Goal:** Establish Tailwind v4 `@theme` as the single source of truth for all design tokens. Existing CSS Modules continue working via `@theme`-generated custom properties. No component migration -- foundation only.

**Execution Order:** Phase 16 first (config + tokens), then Phase 17 (verification + hardening). Sequential -- Phase 17 depends on Phase 16.

```
16 -> 17
```

### Phase 16: Config & Token Migration
**Goal**: Tailwind v4 CSS-first config exists with all design tokens mapped to @theme namespaces
**Depends on**: Phase 15 (v1.2 complete)
**Requirements**: TW-01, TW-02, TW-03, TW-04, TOK-01, TOK-02, TOK-03, TOK-04, TOK-05, TOK-06
**Success Criteria** (what must be TRUE):
  1. `@import "tailwindcss"` replaces legacy `@tailwind base/components/utilities` directives in globals.css
  2. `tailwind.config.js` is deleted and no JS config file exists in the project
  3. `autoprefixer` is removed from PostCSS config and package.json; `clsx` is installed
  4. `@theme` block defines all color tokens (`--color-*`), spacing tokens (`--spacing-*`), typography tokens (font families, sizes, weights, line heights), shadow/radius/border tokens, and custom breakpoints (480px, 400px, 360px)
  5. All keyframe animations are consolidated into the `@theme` block (no scattered `@keyframes` outside of it)
**Plans**: 6 plans

Plans:
- [x] 16-01-PLAN.md -- Config teardown: delete JS config, replace directives, remove autoprefixer, install clsx
- [x] 16-02-PLAN.md -- Color tokens: migrate ~130 colors to @theme --color-*, rename --text-* to --color-text-*
- [x] 16-03-PLAN.md -- Spacing tokens: migrate to @theme --spacing-* with 4px base multiplier
- [x] 16-04-PLAN.md -- Typography tokens: migrate fonts, sizes, weights, line heights; rename --font-* weights to --font-weight-*
- [x] 16-05-PLAN.md -- Visual tokens: migrate radius and shadow to @theme --radius-* and --shadow-*
- [x] 16-06-PLAN.md -- Breakpoints and animations: add custom breakpoints, consolidate 26 @keyframes into @theme

### Phase 17: Compatibility Verification
**Goal**: All existing CSS Modules resolve correctly from @theme-generated properties with zero visual changes
**Depends on**: Phase 16
**Requirements**: VER-01, VER-02, VER-03, VER-04
**Success Criteria** (what must be TRUE):
  1. All 8,500+ `var()` references in CSS Modules resolve correctly -- no missing or broken custom properties
  2. Preflight overrides are in place to prevent Tailwind v4 defaults from altering unmigrated component styles (buttons, borders, placeholders)
  3. `npm run build` passes with zero errors and `npm run lint` produces no new warnings
  4. Every page renders identically to the pre-migration state at 360px, 768px, and 1440px viewports
**Plans**: 5 plans

Plans:
- [x] 17-01-PLAN.md -- Static analysis tooling (check-vars, check-keyframes, tokens-audit scripts)
- [x] 17-02-PLAN.md -- Preflight surgical overrides in globals.css
- [x] 17-03-PLAN.md -- Run analysis, fix issues, verify build/lint clean
- [x] 17-04-PLAN.md -- Playwright visual regression infrastructure and tests
- [x] 17-05-PLAN.md -- Final comprehensive verification and human sign-off

</details>

<details>
<summary>v3.0 Complete Concept Visualizations (Phases 18-21) - PAUSED</summary>

**Milestone Goal:** Add step-through visualizations for all remaining JS concepts -- async patterns, OOP/prototypes, and closures. Each visualization matches existing quality with beginner/intermediate/advanced difficulty levels, uses SharedViz components, and is mobile responsive.

**Status:** Paused at Phase 21 (Closures) to complete v4.0 Design Token Consistency first.

**Execution Order:** Phase 18 first (callbacks/promises foundation), then Phase 19 (async/await and queues), then Phase 20 (OOP/prototypes), then Phase 21 (closures). Sequential -- each phase builds on patterns established in previous phases.

```
18 -> 19 -> 20 -> 21
```

**Quality Requirements (apply to all phases):**
- QUAL-01: All visualizations have beginner/intermediate/advanced difficulty levels
- QUAL-02: All visualizations use SharedViz components (CodePanel, StepControls, StepProgress)
- QUAL-03: Code highlighting synced with visualization step
- QUAL-04: Mobile responsive layout for all new visualizations

### Phase 18: Callbacks & Promises Foundation
**Goal**: Learners can step through callback patterns and promise fundamentals to understand async building blocks
**Depends on**: Phase 17 (v2.0 complete)
**Requirements**: ASYNC-01, ASYNC-02, ASYNC-03, ASYNC-04, ASYNC-05, ASYNC-06
**Template**: EventLoopViz (queue-based), PromisesViz (state-based)
**Success Criteria** (what must be TRUE):
  1. User can step through callback function passing and see when callbacks are invoked vs registered
  2. Callback hell pyramid visualization shows nesting depth and readability degradation
  3. Error-first callback pattern shows error propagation path through callback chain
  4. Promise creation visualization shows executor running synchronously, resolve/reject triggering state change
  5. Promise then/catch chaining shows return values flowing through chain with state transitions
  6. Sequential promise chaining shows how each .then() waits for previous promise to settle

Plans:
- [x] 18-01-PLAN.md - CallbacksBasicsViz and CallbackHellViz (ASYNC-01, ASYNC-02)
- [x] 18-02-PLAN.md - ErrorFirstCallbacksViz (ASYNC-03)
- [x] 18-03-PLAN.md - PromisesCreationViz (ASYNC-04)
- [x] 18-04-PLAN.md - PromisesThenCatchViz and PromisesChainingViz (ASYNC-05, ASYNC-06)

### Phase 19: Async/Await & Event Loop Deep Dive
**Goal**: Learners can step through async/await syntax and understand microtask/macrotask queue ordering
**Depends on**: Phase 18
**Requirements**: ASYNC-07, ASYNC-08, ASYNC-09, ASYNC-10, ASYNC-11, ASYNC-12, ASYNC-13
**Template**: EventLoopViz (granular queue animations)
**Success Criteria** (what must be TRUE):
  1. Promise.all/race/allSettled comparison shows different settlement behaviors with concurrent promises
  2. Async function visualization shows suspension points where execution pauses at await
  3. Try/catch with async/await shows error propagation through async call chain
  4. Parallel async execution shows Promise.all with async/await for concurrent operations
  5. Microtask queue visualization shows promise callbacks draining completely before any macrotask runs
  6. Task queue visualization shows setTimeout/setInterval callbacks as macrotasks
  7. Event loop tick visualization shows granular task selection: check queues -> run one task -> repeat

Plans:
- [x] 19-01-PLAN.md - PromisesStaticViz (ASYNC-07)
- [x] 19-02-PLAN.md - AsyncAwaitSyntaxViz (ASYNC-08)
- [x] 19-03-PLAN.md - AsyncAwaitErrorsViz and AsyncAwaitParallelViz (ASYNC-09, ASYNC-10)
- [x] 19-04-PLAN.md - MicrotaskQueueViz and TaskQueueViz (ASYNC-11, ASYNC-12)
- [x] 19-05-PLAN.md - EventLoopTickViz (ASYNC-13)

### Phase 20: OOP/Prototype Visualizations
**Goal**: Learners can step through prototype chain and class syntax to understand JavaScript's object model
**Depends on**: Phase 19
**Requirements**: OOP-01, OOP-02, OOP-03, OOP-04, OOP-05, OOP-06
**Template**: PrototypesViz (chain visualization with arrows)
**Success Criteria** (what must be TRUE):
  1. Prototype chain visualization shows object -> prototype -> Object.prototype -> null traversal
  2. Property lookup visualization shows step-by-step walking up the prototype chain until property found or null reached
  3. instanceof visualization shows prototype chain membership check with visual chain traversal
  4. Class syntax visualization shows ES6 class as syntactic sugar with underlying prototype structure visible
  5. Extends/super visualization shows prototype linking between parent and child classes
  6. Prototype pollution visualization shows dangers of modifying Object.prototype with affected objects highlighted

Plans:
- [x] 20-01-PLAN.md - PrototypeChainBasicsViz and PropertyLookupViz (OOP-01, OOP-02)
- [x] 20-02-PLAN.md - InstanceofViz (OOP-03)
- [x] 20-03-PLAN.md - ClassSyntaxViz (OOP-04)
- [x] 20-04-PLAN.md - PrototypeInheritanceViz and PrototypePollutionViz (OOP-05, OOP-06)

### Phase 21: Closure Visualizations
**Goal**: Learners can step through closure patterns to understand lexical scope, memory implications, and practical uses
**Depends on**: Phase 20
**Requirements**: CLOS-01, CLOS-02, CLOS-03, CLOS-04, CLOS-05, CLOS-06
**Template**: ClosuresViz (scope chain with [[Scope]] references)
**Plans**: 5 plans
**Success Criteria** (what must be TRUE):
  1. Closure definition visualization shows lexical environment capture at function creation with arrows to parent scope
  2. Practical closures visualization shows data privacy, factory functions, and state encapsulation patterns
  3. Loop gotcha visualization shows var creating single shared binding vs let creating per-iteration bindings side-by-side
  4. Memory leak visualization shows reference chains preventing garbage collection with Root -> Closure -> Leaked Object path
  5. Module pattern visualization shows IIFE creating private scope with returned public interface
  6. Partial application visualization shows currying with intermediate closures capturing arguments

Plans:
- [ ] 21-01-PLAN.md - ClosureDefinitionViz (CLOS-01)
- [ ] 21-02-PLAN.md - ClosurePracticalViz (CLOS-02)
- [ ] 21-03-PLAN.md - ClosureLoopGotchaViz (CLOS-03)
- [ ] 21-04-PLAN.md - ClosureMemoryLeaksViz (CLOS-04)
- [ ] 21-05-PLAN.md - ClosureModulePatternViz and ClosurePartialApplicationViz (CLOS-05, CLOS-06)

</details>

### v4.0 Design Token Consistency (In Progress)

**Milestone Goal:** Replace all hardcoded colors with @theme tokens -- single source of truth for design consistency across 56 visualization components. Eliminate 700+ hardcoded hex colors and extract shared color patterns (levelInfo, phaseColors, statusColors) into reusable TypeScript modules.

**Execution Order:** Phase 22 first (foundation before migration), then Phases 23-24 (high-duplication patterns), then Phase 25 (Framer Motion special handling), finally Phase 26 (cleanup and validation).

```
22 -> 23 -> 24 -> 25 -> 26
```

**Quality Requirements (apply to all phases):**
- QUAL-01: All 56 visualization components reference @theme tokens (no hardcoded hex)
- QUAL-02: Visual parity verified -- no appearance changes after migration
- QUAL-03: `npm run build` passes with zero errors

## Phase Details

### Phase 22: Foundation & Audit
**Goal**: Shared infrastructure exists and visual regression baseline captured before any migration begins
**Depends on**: Phase 17 (v2.0 @theme foundation complete)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, MIG-04
**Success Criteria** (what must be TRUE):
  1. Shared `levelInfo` module exports beginner/intermediate/advanced colors as CSS var references with TypeScript types
  2. Shared `phaseColors` and `statusColors` modules export execution phase and variable state colors as CSS var references
  3. All required opacity variants (15, 20, 30, 40) are defined in @theme for emerald, amber, red, blue accent colors
  4. TypeScript types provide compile-time validation when referencing token names
  5. Visual regression baseline screenshots captured for all 56 visualization components before any migration

Plans:
- [ ] 22-01-PLAN.md - Opacity variants in @theme and levelInfo module (INFRA-03, INFRA-01)
- [ ] 22-02-PLAN.md - phaseColors and statusColors modules (INFRA-02)
- [ ] 22-03-PLAN.md - TypeScript type safety and barrel exports (INFRA-04)
- [ ] 22-04-PLAN.md - Visual regression baseline (MIG-04)

### Phase 23: Level Indicators Migration
**Goal**: All 39 components with levelInfo duplications migrated to shared import
**Depends on**: Phase 22
**Requirements**: MIG-01
**Success Criteria** (what must be TRUE):
  1. All 39 components importing levelInfo from src/constants/levelInfo.ts instead of inline definitions
  2. Beginner/intermediate/advanced difficulty badges render with correct emerald/amber/red colors
  3. No inline levelInfo object definitions remain in any visualization component
  4. Visual regression tests pass -- difficulty indicators render identically to baseline

Plans:
- [ ] 23-01-PLAN.md - Migrate first 13 visualization components to shared levelInfo
- [ ] 23-02-PLAN.md - Migrate next 13 visualization components to shared levelInfo
- [ ] 23-03-PLAN.md - Migrate final 13 visualization components to shared levelInfo and validate

### Phase 24: Phase/Status Colors Migration
**Goal**: All 21 components with getPhaseColor/getStatusColor functions migrated to shared import
**Depends on**: Phase 22
**Requirements**: MIG-02
**Success Criteria** (what must be TRUE):
  1. All components with getPhaseColor functions import from src/constants/phaseColors.ts
  2. All components with getStatusColor/stateColors import from src/constants/statusColors.ts
  3. No inline phase/status color function definitions remain in visualization components
  4. Execution phase badges (creation/execution/return) render with correct colors
  5. Variable state badges (hoisted/initialized/TDZ) render with correct colors

Plans:
- [ ] 24-01-PLAN.md - Migrate phaseColors from 11 components
- [ ] 24-02-PLAN.md - Migrate statusColors from 10 components and validate

### Phase 25: Animation Colors Handling
**Goal**: Framer Motion animation colors documented and handled correctly without breaking interpolation
**Depends on**: Phase 24 (static styles migrated first)
**Requirements**: ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (what must be TRUE):
  1. Animation constants file exists with hex values that mirror corresponding @theme tokens
  2. All 18 components with Framer Motion animated colors identified and cataloged
  3. Hybrid pattern documented: static styles use CSS vars, animated styles use hex constants
  4. Animation interpolation verified working in all animated components (no "not animatable" errors)
  5. Animation constants file includes comment linking each hex to its @theme source token

Plans:
- [ ] 25-01-PLAN.md - Animation constants file and catalog of animated components (ANIM-01, ANIM-02)
- [ ] 25-02-PLAN.md - Document hybrid pattern and verify animation interpolation (ANIM-03)

### Phase 26: Inline Styles Cleanup
**Goal**: All remaining inline style hex values replaced with CSS var references
**Depends on**: Phase 25
**Requirements**: MIG-03, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. All 147 inline style hex values replaced with CSS var references (excluding Framer Motion animations)
  2. Grep for hex color patterns (#[0-9a-fA-F]{6}) returns zero matches outside animation constants file
  3. All 56 visualization components reference @theme tokens with no hardcoded hex
  4. Final visual regression comparison shows zero visual differences from baseline
  5. `npm run build` passes with zero errors

Plans:
- [ ] 26-01-PLAN.md - Replace inline style hex values in first 19 components
- [ ] 26-02-PLAN.md - Replace inline style hex values in next 19 components
- [ ] 26-03-PLAN.md - Replace inline style hex values in final 18 components and run final validation

## Progress

**Execution Order:**
Phases 1-20 complete (v1.0-v3.0 partial). Phase 21 paused. Phases 22-26 (v4.0) in sequence.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-01-24 |
| 2. LoopsViz | v1.0 | 2/2 | Complete | 2026-01-24 |
| 3. VariablesViz | v1.0 | 3/3 | Complete | 2026-01-24 |
| 4. FunctionsViz | v1.0 | 3/3 | Complete | 2026-01-24 |
| 5. ArraysBasicsViz | v1.0 | 3/3 | Complete | 2026-01-24 |
| 6. ObjectsBasicsViz | v1.0 | 3/3 | Complete | 2026-01-24 |
| 7. Foundation | v1.1 | 2/2 | Complete | 2026-01-24 |
| 8. TwoPointersViz | v1.1 | 3/3 | Complete | 2026-01-25 |
| 9. HashMapViz | v1.1 | 3/3 | Complete | 2026-01-25 |
| 10. BitManipulationViz | v1.1 | 3/3 | Complete | 2026-01-25 |
| 11. Foundation & Mobile | v1.2 | 2/2 | Complete | 2026-01-25 |
| 12. SEO Standardization | v1.2 | 4/4 | Complete | 2026-01-25 |
| 13. Cross-Linking | v1.2 | 3/3 | Complete | 2026-01-25 |
| 14. Page Consistency | v1.2 | 1/1 | Complete | 2026-01-25 |
| 15. Responsive Implementation | v1.2 | 3/3 | Complete | 2026-01-25 |
| 16. Config & Token Migration | v2.0 | 6/6 | Complete | 2026-01-27 |
| 17. Compatibility Verification | v2.0 | 5/5 | Complete | 2026-01-27 |
| 18. Callbacks & Promises | v3.0 | 4/4 | Complete | 2026-01-30 |
| 19. Async/Await & Queues | v3.0 | 5/5 | Complete | 2026-01-30 |
| 20. OOP/Prototypes | v3.0 | 4/4 | Complete | 2026-01-31 |
| 21. Closures | v3.0 | 0/5 | Paused | - |
| 22. Foundation & Audit | v4.0 | 0/4 | Planned | - |
| 23. Level Indicators Migration | v4.0 | 0/3 | Planned | - |
| 24. Phase/Status Colors Migration | v4.0 | 0/2 | Planned | - |
| 25. Animation Colors Handling | v4.0 | 0/2 | Planned | - |
| 26. Inline Styles Cleanup | v4.0 | 0/3 | Planned | - |

---
*Roadmap created: 2026-01-24*
*Last updated: 2026-01-31 -- v4.0 Design Token Consistency phases added (Phases 22-26)*
