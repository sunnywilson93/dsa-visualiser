# Visualization Research Document

> Research phase for missing concept visualizations

**Date**: 2026-01-30  
**Auditor**: Kimi  
**Scope**: All 55 concepts missing visualizations

---

## Existing Visualization Audit

### Current Visualizations (30 total)

| Component | Type | Concepts Covered | Reusable? |
|-----------|------|-----------------|-----------|
| HoistingViz | Step-by-Step | hoisting | ✅ For scope concepts |
| ClosuresViz | Interactive | closures | ✅ For closure concepts |
| EventLoopViz | Step-by-Step | event-loop | ✅ For event loop concepts |
| PromisesViz | Interactive | promises-deep-dive | ✅ For async concepts |
| TypeCoercionViz | Code Execution | type-coercion | ✅ For coercion concepts |
| PrototypesViz | Step-by-Step | prototypes | ✅ For prototype concepts |
| ArraysBasicsViz | Static | arrays-basics | ✅ For array concepts |
| ObjectsBasicsViz | Static | objects-basics | ✅ For object concepts |
| MemoryModelViz | Static | memory-model | ✅ For memory concepts |
| V8EngineViz | Static | v8-engine | ❌ Specific |

### Reuse Opportunities

**High Reuse Potential**:
1. `EventLoopViz` → Can adapt for call-stack-basics, task-queue, microtask-queue
2. `PromisesViz` → Can adapt for promises-creation, chaining, static-methods
3. `HoistingViz` → Can adapt for scope-basics, lexical-scope, tdz
4. `TypeCoercionViz` → Can adapt for coercion rules, edge cases
5. `PrototypesViz` → Can adapt for prototype-chain, property-lookup, class-syntax
6. `ArraysBasicsViz` → Can adapt for all array method concepts

---

## Missing Visualizations Analysis

### Phase 1: Scope & Hoisting (5 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| scope-basics | Visualizing scope nesting, lexical boundaries | Step-by-Step | HoistingViz pattern |
| hoisting-variables | var vs let vs const hoisting differences | Step-by-Step | HoistingViz |
| hoisting-functions | Function declaration vs expression | Step-by-Step | HoistingViz |
| temporal-dead-zone | TDZ visualization with errors | Step-by-Step | HoistingViz |
| lexical-scope | Scope chain lookup | Step-by-Step | HoistingViz |

**Decision**: Create `ScopeHoistingViz` - one component handling all 5 concepts via mode prop

### Phase 2: Async Foundation (11 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| callbacks-basics | Async flow understanding | Step-by-Step | New simple |
| error-first-callbacks | Error handling pattern | Static | New simple |
| callback-hell | Pyramid of doom visualization | Static | New simple |
| promises-creation | new Promise executor | Step-by-Step | PromisesViz |
| promises-then-catch | Chaining flow | Step-by-Step | PromisesViz |
| promises-chaining | Multiple .then() flow | Step-by-Step | PromisesViz |
| promises-static-methods | Promise.all/race/allSettled | Step-by-Step | PromisesViz |
| async-await-syntax | Syntactic sugar visualization | Step-by-Step | PromisesViz |
| async-await-parallel | Promise.all with async | Step-by-Step | PromisesViz |
| async-await-error-handling | try/catch with async | Step-by-Step | PromisesViz |

**Decision**: Extend `PromisesViz` with modes: 'creation' | 'chaining' | 'static' | 'async-await'

### Phase 3: Array Mastery (6 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| array-mutation-methods | push/pop/splice visualization | Interactive | ArraysBasicsViz |
| array-iteration-methods | forEach/map/filter | Step-by-Step | ArraysBasicsViz |
| array-transformation | map/filter/flatMap | Step-by-Step | ArraysBasicsViz |
| array-searching | find/indexOf/includes | Step-by-Step | ArraysBasicsViz |
| array-sorting | sort with compare fn | Step-by-Step | ArraysBasicsViz |
| array-reduce-patterns | reduce accumulator | Step-by-Step | ArraysBasicsViz |
| array-immutable-patterns | [...arr], concat, etc | Step-by-Step | ArraysBasicsViz |

**Decision**: Extend `ArraysBasicsViz` with modes for each method category

### Phase 4: Closure & Prototypes (12 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| closure-definition | Scope capture visualization | Interactive | ClosuresViz |
| closure-practical-uses | Private variables, counters | Interactive | ClosuresViz |
| closure-in-loops | Classic var loop problem | Step-by-Step | ClosuresViz |
| closure-memory | Retained memory visualization | Static | MemoryModelViz |
| closure-partial-application | bind/curry patterns | Interactive | ClosuresViz |
| closure-module-pattern | IIFE/private scope | Step-by-Step | ClosuresViz |
| prototype-chain-basics | __proto__ chain | Step-by-Step | PrototypesViz |
| property-lookup | Prototype lookup walk | Step-by-Step | PrototypesViz |
| class-syntax-prototypes | Class vs prototype | Step-by-Step | PrototypesViz |
| instanceof-operator | Instance check algorithm | Step-by-Step | PrototypesViz |
| prototype-inheritance | extends/super | Step-by-Step | PrototypesViz |
| prototype-pollution | Malicious prototype mod | Static | New simple |

**Decision**: 
- Extend `ClosuresViz` with modes for closure concepts
- Extend `PrototypesViz` with modes for prototype concepts

### Phase 5: Event Loop (6 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| call-stack-basics | Stack push/pop animation | Step-by-Step | EventLoopViz |
| javascript-runtime-model | Stack + Heap + Queue | Static | MemoryModelViz |
| task-queue-macrotasks | setTimeout/setInterval | Step-by-Step | EventLoopViz |
| microtask-queue | Promises/nextTick | Step-by-Step | EventLoopViz |
| event-loop-tick | One iteration visualization | Step-by-Step | EventLoopViz |
| event-loop-starvation | Microtask blocking | Step-by-Step | EventLoopViz |

**Decision**: Extend `EventLoopViz` with modes for each aspect

### Phase 6: Modern JS (7 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| destructuring-complete | Object/array extraction | Interactive | New |
| spread-operator-patterns | ... spreading visualization | Interactive | New |
| rest-parameters | ...args collection | Interactive | New |
| template-literals | Interpolation visualization | Static | New simple |
| optional-chaining | ?. short-circuit | Step-by-Step | New |
| nullish-coalescing | ?? vs || comparison | Step-by-Step | New |
| logical-assignment | ??= ||= &&= | Step-by-Step | New |

**Decision**: Create `ModernJSViz` handling all 7 via modes

### Phase 7: Error Handling (3 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| try-catch-finally | Error flow control | Step-by-Step | New |
| error-types-native | Error hierarchy | Static | New simple |
| throwing-custom-errors | Custom error class | Step-by-Step | New |

**Decision**: Create `ErrorHandlingViz` with modes

### Phase 8: Type Coercion (2 concepts)

| Concept | Learning Blocks | Viz Type | Reuse From |
|---------|----------------|----------|------------|
| implicit-coercion-rules | +, -, == coercion | Step-by-Step | TypeCoercionViz |
| coercion-edge-cases | [] + [], typeof null | Step-by-Step | TypeCoercionViz |

**Decision**: Extend `TypeCoercionViz` with modes

---

## Icon Mapping Research

### New Icons Needed (52 concepts)

**Phase 1 - Scope/Hoisting**:
- scope-basics: `Layers` (scope nesting)
- hoisting-variables: `ArrowUp` (already have)
- hoisting-functions: `ArrowUpCircle` (function hoisting)
- temporal-dead-zone: `ShieldAlert` (dead zone warning)
- lexical-scope: `Parentheses` (lexical boundaries)

**Phase 2 - Async**:
- callbacks-basics: `MessageSquare` (callback pattern)
- error-first-callbacks: `AlertTriangle` (error handling)
- callback-hell: `GitCommitVertical` (nested pyramid)
- promises-creation: `Clock` (already have)
- promises-then-catch: `GitBranch` (branching flow)
- promises-chaining: `Link2` (chain links)
- promises-static-methods: `LayoutGrid` (multiple promises)
- async-await-syntax: `Timer` (already have)
- async-await-parallel: `GitFork` (parallel execution)
- async-await-error-handling: `Shield` (error protection)

**Phase 3 - Arrays**:
- array-mutation-methods: `Pencil` (modification)
- array-iteration-methods: `Repeat` (already have)
- array-transformation: `Shuffle` (transform)
- array-searching: `Search` (already have)
- array-sorting: `ArrowUpDown` (already have)
- array-reduce-patterns: `Minus` (accumulation)
- array-immutable-patterns: `Copy` (copying)

**Phase 4 - Closures**:
- closure-definition: `Lock` (already have)
- closure-practical-uses: `Key` (practical application)
- closure-in-loops: `RotateCcw` (loop closure)
- closure-memory: `Database` (memory retention)
- closure-partial-application: `PieChart` (partial)
- closure-module-pattern: `Package` (already have)

**Phase 4 - Prototypes**:
- prototype-chain-basics: `Link` (already have)
- property-lookup: `Search` (lookup)
- class-syntax-prototypes: `FileCode` (class syntax)
- instanceof-operator: `CheckCircle2` (instance check)
- prototype-inheritance: `GitBranch` (inheritance tree)
- prototype-pollution: `Skull` (danger/pollution)

**Phase 5 - Event Loop**:
- call-stack-basics: `Layers` (stack)
- javascript-runtime-model: `Cpu` (already have)
- task-queue-macrotasks: `List` (queue)
- microtask-queue: `ListOrdered` (ordered queue)
- event-loop-tick: `RotateCw` (already have)
- event-loop-starvation: `AlertOctagon` (blocking warning)

**Phase 6 - Modern JS**:
- destructuring-complete: `UnfoldVertical` (unpacking)
- spread-operator-patterns: `Maximize2` (spreading)
- rest-parameters: `Minimize2` (collecting)
- template-literals: `Quote` (template strings)
- optional-chaining: `Link2` (safe link)
- nullish-coalescing: `Filter` (nullish filter)
- logical-assignment: `Zap` (quick assignment)

**Phase 7 - Errors**:
- try-catch-finally: `ShieldCheck` (protection)
- error-types-native: `AlertCircle` (error types)
- throwing-custom-errors: `BadgeAlert` (custom errors)

**Phase 8 - Coercion**:
- implicit-coercion-rules: `Shuffle` (already have)
- coercion-edge-cases: `Bomb` (explosive edge cases)

---

## Summary

### Visualization Components to Create/Extend

| Component | Concepts | Type |
|-----------|----------|------|
| ScopeHoistingViz | 5 | Step-by-Step |
| PromisesViz (extend) | 10 | Interactive |
| ArraysBasicsViz (extend) | 7 | Interactive |
| ClosuresViz (extend) | 6 | Interactive |
| PrototypesViz (extend) | 6 | Step-by-Step |
| EventLoopViz (extend) | 6 | Step-by-Step |
| ModernJSViz (new) | 7 | Interactive |
| ErrorHandlingViz (new) | 3 | Step-by-Step |
| TypeCoercionViz (extend) | 2 | Step-by-Step |

**Total**: 9 component files handle all 52 concepts

### Icons to Add: 52 mappings

All Lucide icons are available, no new dependencies needed.

---

## Sign-off

Ready to proceed to Step 3 (Planning).

- [x] Learning blocks documented
- [x] Visualization approaches identified
- [x] Reuse opportunities noted
- [x] Icon selections documented
