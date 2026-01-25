# Roadmap: DSA Visualizer

## Milestones

- [x] **v1.0 JS Concept Visualizations** - Phases 1-6 (shipped 2026-01-24)
- [x] **v1.1 DSA Pattern Visualizations** - Phases 7-10 (shipped 2026-01-25)
- [ ] **v1.2 Polish & Production** - Phases 11-15 (in progress)

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

### v1.2 Polish & Production (In Progress)

**Milestone Goal:** Make the platform production-ready with responsive design, consistent page structure, cross-linking between pattern and problem pages, and SEO optimization.

- [x] **Phase 11: Foundation & Mobile Strategy** - Breakpoint standardization, mobile editor strategy, cross-link utilities
- [x] **Phase 12: SEO Standardization** - Metadata on all routes, breadcrumb schema, OpenGraph images
- [x] **Phase 13: Cross-Linking** - Pattern-problem bidirectional links, footer navigation
- [ ] **Phase 14: Page Consistency** - Consistent headers, NavBar breadcrumbs across all pages
- [ ] **Phase 15: Responsive Implementation** - Mobile navigation, touch targets, responsive visualizations

## Phase Details

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
- [ ] 14-01-PLAN.md - Update PatternPageClient and ConceptVizPageClient with NavBar breadcrumbs and consistent headers

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
**Plans**: TBD

Plans:
- [ ] 15-01-PLAN.md - Mobile navigation and touch target audit
- [ ] 15-02-PLAN.md - Responsive visualizations and panel collapse
- [ ] 15-03-PLAN.md - Practice page responsive layout

## Progress

**Execution Order:**
Phases execute in numeric order: 11 -> 12 (parallel) -> 13 -> 14 (parallel) -> 15

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
| 14. Page Consistency | v1.2 | 0/1 | Not started | - |
| 15. Responsive Implementation | v1.2 | 0/3 | Not started | - |

---
*Roadmap created: 2026-01-24*
*Last updated: 2026-01-25 — Phase 14 planned*
