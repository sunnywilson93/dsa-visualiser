# Roadmap: Enhanced JS Concept Visualizations

## Overview

This roadmap transforms simple auto-play visualizations into rich step-through experiences matching the EventLoopViz gold standard. Starting with shared foundation components, we systematically upgrade LoopsViz, VariablesViz, FunctionsViz, ArraysBasicsViz, and ObjectsBasicsViz to provide learners with interactive, step-controlled exploration of JavaScript execution.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Shared reusable components for all visualizations ✓
- [x] **Phase 2: LoopsViz** - Step-through loop iteration with closure capture examples ✓
- [x] **Phase 3: VariablesViz** - Hoisting, TDZ, and scope chain visualization ✓
- [x] **Phase 4: FunctionsViz** - Execution context and call stack visualization ✓
- [x] **Phase 5: ArraysBasicsViz** - Reference semantics and method iteration stepping ✓
- [ ] **Phase 6: ObjectsBasicsViz** - Property mutation and reference sharing visualization

## Phase Details

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
- [x] 01-01-PLAN.md - CodePanel and StepProgress display components ✓
- [x] 01-02-PLAN.md - StepControls and useAutoPlay hook ✓

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
- [x] 02-01-PLAN.md — Core LoopsViz rewrite with types, state, SharedViz integration, and beginner examples ✓
- [x] 02-02-PLAN.md — Intermediate/advanced examples with closure capture visualization ✓

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
- [x] 03-01-PLAN.md — Types, beginner examples, core component with level selector and SharedViz integration ✓
- [x] 03-02-PLAN.md — Intermediate examples with scope chain visualization and lookup animation ✓
- [x] 03-03-PLAN.md — Advanced examples with error states, hoisting animation, and phase badge ✓

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
- [x] 04-01-PLAN.md — Types, beginner examples, call stack panel, execution context display ✓
- [x] 04-02-PLAN.md — Parameter binding animation with intermediate examples ✓
- [x] 04-03-PLAN.md — This binding visualization with advanced examples ✓

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
- [x] 05-01-PLAN.md — Types, beginner examples, core component rewrite with stack/heap visualization ✓
- [x] 05-02-PLAN.md — Intermediate examples with spread operator and warning badges ✓
- [x] 05-03-PLAN.md — Advanced examples with method iteration (map/filter/reduce) ✓

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
- [ ] 06-01-PLAN.md - Types, beginner examples, core component rewrite with stack/heap visualization
- [ ] 06-02-PLAN.md - Intermediate examples with spread operator and warning badges
- [ ] 06-03-PLAN.md - Advanced examples with destructuring visualization

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | ✓ Complete | 2026-01-24 |
| 2. LoopsViz | 2/2 | ✓ Complete | 2026-01-24 |
| 3. VariablesViz | 3/3 | ✓ Complete | 2026-01-24 |
| 4. FunctionsViz | 3/3 | ✓ Complete | 2026-01-24 |
| 5. ArraysBasicsViz | 3/3 | ✓ Complete | 2026-01-24 |
| 6. ObjectsBasicsViz | 0/? | Not started | - |

---
*Roadmap created: 2026-01-24*
*Last updated: 2026-01-24 — Phase 5 complete*
