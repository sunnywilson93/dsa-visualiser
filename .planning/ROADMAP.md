# Roadmap: DSA Visualizer

## Milestones

- [x] **v1.0 JS Concept Visualizations** - Phases 1-6 (shipped 2026-01-24)
- [ ] **v1.1 DSA Pattern Visualizations** - Phases 7-10 (in progress)

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

### v1.1 DSA Pattern Visualizations (In Progress)

**Milestone Goal:** Learners can step through algorithm patterns visually, understanding decision logic rather than just memorizing steps. Three core patterns: Two Pointers, Hash Map, and Bit Manipulation.

- [x] **Phase 7: Foundation** - DSAPatterns structure, routing, and pattern metadata
- [x] **Phase 8: TwoPointersViz** - Complete Two Pointers pattern page with variants
- [ ] **Phase 9: HashMapViz** - Complete Hash Map pattern page with bucket visualization
- [ ] **Phase 10: BitManipulationViz** - Complete Bit Manipulation pattern page with operation animation

## Phase Details

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
**Plans**: TBD

Plans:
- [ ] 09-01-PLAN.md - HashMapViz core component with bucket structure
- [ ] 09-02-PLAN.md - Beginner examples with basic lookup/insert
- [ ] 09-03-PLAN.md - Intermediate/advanced examples with frequency counter

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
**Plans**: TBD

Plans:
- [ ] 10-01-PLAN.md - BitManipulationViz core component with binary display
- [ ] 10-02-PLAN.md - Beginner examples with basic operations
- [ ] 10-03-PLAN.md - Intermediate/advanced examples with complex bit patterns

## Progress

**Execution Order:**
Phases execute in numeric order: 7 -> 8 -> 9 -> 10

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
| 9. HashMapViz | v1.1 | 0/3 | Not started | - |
| 10. BitManipulationViz | v1.1 | 0/3 | Not started | - |

---
*Roadmap created: 2026-01-24*
*Last updated: 2026-01-25 — Phase 8 complete (7 examples across 3 variants and 3 difficulty levels)*
