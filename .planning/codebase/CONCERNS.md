# Codebase Concerns

**Analysis Date:** 2026-01-23

## Tech Debt

**Large Data Files (>3k lines) in src/data/**
- Issue: Three large data files (`examples.ts` at 5118 lines, `concepts.ts` at 3750 lines, `algorithmConcepts.ts` at 1921 lines) serve as inline databases storing example code, concept definitions, and algorithm visualizations
- Files: `src/data/examples.ts`, `src/data/concepts.ts`, `src/data/algorithmConcepts.ts`, `src/data/dsaConcepts.ts` (1210 lines)
- Impact: Makes bundle size larger, slows editor performance, difficult to maintain/search/update problem sets, no version control for problem content
- Fix approach: Migrate to external JSON/CMS or move to public/static directory loaded at build time. Consider splitting into multiple smaller files by category

**Oversized Visualization Components (750-1200 lines)**
- Issue: Many visualization components exceed 750 lines, approaching complexity limits. `EventLoopViz.tsx` (1211 lines), `NodeEventLoopViz.tsx` (939 lines), `MemoryModelViz.tsx` (933 lines)
- Files: `src/components/Concepts/EventLoopViz.tsx`, `src/components/Concepts/NodeEventLoopViz.tsx`, `src/components/Concepts/MemoryModelViz.tsx`, `src/components/Concepts/TimingViz.tsx` (866), `src/components/Concepts/ClosuresViz.tsx` (857), and 8+ others
- Impact: Difficult to test, debug, and maintain. High cognitive load. Risk of bugs in animation state management
- Fix approach: Extract shared logic into custom hooks (e.g., `useVisualizationState`, `useStepAnimation`). Extract repeated animation patterns into reusable components. Create smaller focused components

**Hardcoded Step Arrays in Visualization Components**
- Issue: Large visualization components like `EventLoopViz.tsx` contain inline `Record<Level, Example[]>` with 50+ hardcoded step objects containing exact state descriptions
- Files: `src/components/Concepts/EventLoopViz.tsx` (lines 45-450: examples with inline steps), `src/components/Concepts/PromisesViz.tsx`, `src/components/Concepts/MemoryModelViz.tsx`
- Impact: Any change to visualization logic requires updating hardcoded steps; error-prone state synchronization; difficult to add new examples
- Fix approach: Generate steps programmatically from state transitions; extract step definitions to separate JSON files; use state machine pattern instead of hardcoded arrays

**Type Safety Issues in Engine**
- Issue: Use of `any` type bypasses type checking. Line 51-52 in `src/engine/interpreter.ts`: `type ASTNode = Node & Record<string, any>`
- Files: `src/engine/interpreter.ts:51-52`, `src/engine/runtime.ts:58-59` (body and closure typed as `unknown`)
- Impact: Runtime errors not caught by TypeScript. Weak contracts between modules
- Fix approach: Replace `Record<string, any>` with proper discriminated union types or explicit AST node type. Improve FunctionValue closure typing to be more specific

**Loose Type Casting in Event Loop Analyzer**
- Issue: Multiple `as unknown as` casts indicate type mismatches not being properly resolved
- Files: `src/engine/eventLoopAnalyzer.ts:130, 221, 235, 237, 558, 664, 708`
- Impact: Bypasses type checking, risks incorrect runtime assumptions about node structure
- Fix approach: Create proper type guards and helper functions instead of unsafe casts

**Implicit ID Generation for Breakpoints/Watches**
- Issue: Uses `Math.random().toString(36).substring(2, 9)` for ID generation in `src/store/executionStore.ts:38`
- Files: `src/store/executionStore.ts:37-39`
- Impact: IDs could collide in long-running sessions. Not suitable for persistence or server sync
- Fix approach: Use UUID library (crypto.randomUUID or uuid package) or increment counter for unique IDs

## Known Bugs

**Potential Deep Clone Stack Overflow with Circular Structures**
- Symptoms: If interpreter encounters user code with circular object references, `cloneValue()` in `src/engine/runtime.ts` will infinitely recurse
- Files: `src/engine/runtime.ts` (lines 87-112: recursive cloning without cycle detection)
- Trigger: Code like `let a = {}; a.self = a;` followed by assignment or pass to array method
- Workaround: Currently none; user code validation doesn't prevent circular structures
- Fix approach: Use WeakMap or Set to track visited objects during cloning to detect and break cycles

**Array Index Bounds Not Validated**
- Symptoms: Accessing array with large indices creates sparse array entries without proper bounds checking
- Files: `src/engine/interpreter.ts` (lines 673-684: member assignment; 1001-1082: array method implementations)
- Trigger: Code like `let arr = [1,2,3]; arr[100] = 'x';` or `arr[-5] = 'y';` creates properties without clearing between them
- Workaround: None; behavior differs from actual JavaScript but doesn't crash
- Fix approach: Add explicit bounds validation; implement proper sparse array semantics; validate numeric indices are positive

**Event Loop Analyzer String Parsing Fragility**
- Symptoms: Pattern matching for setTimeout, Promise, and async operations uses regex and string search, missing edge cases
- Files: `src/engine/eventLoopAnalyzer.ts` (lines 100-750: pattern detection logic)
- Trigger: Code with nested or aliased callbacks (e.g., `const cb = setTimeout; cb(...)` or wrapped setTimeout)
- Workaround: Use direct setTimeout/Promise calls without aliasing
- Fix approach: Use AST analysis instead of string patterns; track actual function calls through scope chain

## Security Considerations

**Code Injection Potential via Watch Expressions**
- Risk: Watch expressions are looked up in scopes but no validation prevents malicious lookups
- Files: `src/store/executionStore.ts:204-234` (addWatchExpression)
- Current mitigation: Expressions are read-only (lookup only, not execution)
- Recommendations: Validate expression input (alphanumeric + dots only). Add unit tests for edge cases (null prototype pollution attempts)

**Console Output Rendering Security**
- Risk: User code runs in interpreter and produces console output. If output rendering uses string insertion without proper escaping, could be DOM injection vector
- Files: Console output displayed in multiple components, stored as strings in `src/engine/interpreter.ts`
- Current mitigation: All output converted to strings via `formatValue()`, stored as string primitives. React component rendering uses text nodes, not HTML
- Recommendations: Audit all console output display components to verify text-only rendering. Avoid any innerHTML or createElement patterns with user output

**No Input Validation for Code Size**
- Risk: User can paste very large code strings causing memory exhaustion or performance degradation
- Files: `src/store/executionStore.ts:58-60` (setCode)
- Current mitigation: MAX_STEPS limit in interpreter (10000 steps)
- Recommendations: Add code length limit (e.g., 100KB max). Add timeout for parsing and execution. Consider Web Worker sandboxing

**Infinite Loop Prevention is Incomplete**
- Risk: Parser validates for `while(true)` without break but misses `for(;;)`, `do...while(true)`, or computed conditions
- Files: `src/engine/parser.ts` (lines 56-59: basic infinite loop detection)
- Current mitigation: Hard MAX_STEPS limit stops execution after 10000 steps
- Recommendations: Improve pattern detection in parser; add timeout-based execution; implement step quota per user session

## Performance Bottlenecks

**Memory Cloning on Every Step**
- Problem: Interpreter clones entire call stack and scopes on every step via `cloneCallStack()` and `cloneScopes()`
- Files: `src/engine/interpreter.ts:1307-1321`, `recordStep()` at lines 1160-1175
- Cause: Deep cloning for state capture happens for every recorded step (up to MAX_STEPS=10000). This includes cloning all RuntimeValue objects recursively via `cloneValue()` at runtime.ts:87-112
- Observation: This is by design for step-by-step state inspection, but could be optimized with structural sharing or snapshot indexing
- Improvement path: Implement structural sharing (immutable data structures); only clone objects that changed; use copy-on-write semantics; consider storing deltas instead of full state

**Deep Recursive Cloning of Nested Structures**
- Problem: `cloneValue()` recursively clones arrays and objects without depth limits
- Files: `src/engine/runtime.ts` (lines 94-105: recursive cloning)
- Cause: Each array/object element is cloned recursively; deeply nested structures create memory overhead
- Improvement path: Implement iterative cloning with stack; add depth limits; use object pooling for frequently created values

**No Lazy Loading for Visualization Examples**
- Problem: All concept and algorithm examples are loaded at startup, even if user never visits those pages
- Files: `src/data/concepts.ts`, `src/data/algorithmConcepts.ts`, `src/data/dsaConcepts.ts`
- Impact: Large JavaScript bundle (~40KB+ of data), slow initial page load
- Improvement path: Use dynamic imports in Next.js page components to load examples on-demand; split by category; use route-based code splitting

**Event Loop Analyzer Iteration Limits**
- Problem: `src/engine/eventLoopAnalyzer.ts` has hard limits (MAX_STEPS=500, MAX_ITERATIONS=50) that silently truncate output
- Files: `src/engine/eventLoopAnalyzer.ts:44-45`
- Impact: Complex async code with many iterations produces incomplete visualization without clear error message
- Improvement path: Add user feedback when limits are hit. Consider optimizing analysis to handle more iterations

**Visualization Rendering of Large Arrays**
- Problem: Rendering arrays with 1000+ elements causes layout thrashing and slow interactions
- Files: `src/components/Visualization/ArrayVisualization.tsx`, `src/components/Visualization/VisualizationPanel.tsx`
- Cause: All array elements rendered in DOM; no virtualization or windowing
- Improvement path: Implement virtual scrolling; show array preview with pagination; limit visible elements to 100-200

## Fragile Areas

**Interpreter Expression Evaluation**
- Files: `src/engine/interpreter.ts` (lines 730-850+: binary, logical, unary expression handling)
- Why fragile: Many edge cases in JavaScript semantics; string concatenation, type coercion, operator precedence all have subtle rules
- Safe modification: Add comprehensive test cases before changing; use ECMAScript spec as reference; test with actual JS engine
- Test coverage: `src/engine/interpreter.test.ts` has basic tests but limited edge case coverage (no type coercion tests, no operator precedence verification)

**Scope and Variable Resolution**
- Files: `src/engine/interpreter.ts` (lines 1228-1275: scope management, variable lookup, closure capture)
- Why fragile: Closure capture depends on proper scope chain; let/const block scope creates new scopes; var hoisting behavior complex
- Safe modification: Write unit tests for each scope type (global, function, block); test closure capture with nested functions; verify hoisting behavior matches JS
- Test coverage: Basic function scope tests exist; no block scope tests; no closure tests; no hoisting verification

**Function Expression Closure Capture**
- Files: `src/engine/interpreter.ts:400-450` (function declaration/expression handling)
- Why fragile: Closure capture depends on proper scope chain maintenance. Related bugs fixed in recent commits ("Fix interpreter for function expressions and closures")
- Safe modification: Add tests before modifying scope handling. Current test is `interpreter.test.ts` but gaps in closure edge cases
- Test coverage: Limited to basic cases

**Event Loop Analyzer Pattern Matching**
- Files: `src/engine/eventLoopAnalyzer.ts:100-750` (entire analysis logic)
- Why fragile: Uses string analysis and AST inspection without full semantic understanding. Detects patterns like setTimeout/Promise but doesn't handle:
  - setTimeout with 0 delay fallback to 4ms
  - Promise.resolve() immediate vs queued behavior
  - async/await desugaring details
- Safe modification: Only change warning messages. Don't extend pattern detection without adding corresponding test cases
- Test coverage: Has unit tests (eventLoopAnalyzer.test.ts) but gaps remain

**State Evolution Visualization Reducer Logic**
- Files: `src/components/Concepts/StateEvolutionViz.tsx:160-225` (Redux example reducer)
- Why fragile: Embedded reducer implementation must match Redux semantics. Example shows `ADD_TODO` action but behavior is hardcoded
- Safe modification: Keep reducer logic minimal and exact. Any state shape changes will break visualization
- Test coverage: Visual inspection only, no unit tests

**Zustand Store Action Dependencies**
- Files: `src/store/executionStore.ts:100-250` (execution control methods)
- Why fragile: Actions like `stepForward()` and `runToBreakpoint()` depend on consistent step data. If interpreter produces malformed steps, store crashes silently
- Safe modification: Validate step structure before using. Add assertions for expected properties
- Test coverage: No unit tests for store actions

## Scaling Limits

**Max Steps = 10000**
- Current capacity: Interpreter stops recording after 10,000 steps
- Limit: Programs with deeper execution traces hit this limit silently
- Scaling path: Increase limit but monitor memory; consider streaming steps or storing to IndexedDB instead of memory array

**Event Loop Analysis Max Iterations = 50**
- Current capacity: Event loop analyzer truncates output at 50 iterations
- Limit: Complex async flows with many task iterations produce incomplete visualizations
- Scaling path: Increase limit with profiling; consider online/streaming algorithm instead of batch analysis

**Max Call Depth = 100**
- Current capacity: Interpreter enforces MAX_CALL_DEPTH = 100 (line 24 in interpreter.ts)
- Limit: Recursive functions or deeply nested calls above 100 levels will error
- Scaling path: Increase with caution; monitor memory overhead; implement tail-call optimization

**Browser Memory Constraints**
- Current capacity: Depends on available RAM. Large array programs can exhaust memory during cloning
- Limit: 10,000 complex runtime objects with deep cloning will cause OOM
- Scaling path: Implement memory pooling or off-heap storage (IndexedDB). Use structural sharing instead of deep cloning

## Missing Critical Features

**No Step Search / Filter**
- Problem: Can't search/jump to specific step matching criteria (e.g., "find where variable x changed")
- Blocks: Advanced debugging workflows, hard to find relevant code flow in 1000+ step programs
- Priority: Medium - Useful but not critical for basic learning

**No Breakpoint Conditions**
- Problem: `src/store/executionStore.ts:190-196` defines `setBreakpointCondition()` method but conditions are never evaluated
- Blocks: Can't pause on "when x > 10" – only can pause on line number
- Impact: Foundational feature for effective debugging in large programs
- Priority: High

**No Async/Await Native Support**
- Problem: Parser only supports `ecmaVersion: 2022` and doesn't fully parse/execute async/await; only shows Promise visualizations
- Blocks: Can't visualize modern async patterns; learning incorrect mental model vs real async/await
- Files: `src/engine/parser.ts:16-21`
- Priority: High - Critical for modern JavaScript teaching

**No Timeline/Snapshot History**
- Problem: Can step forward/backward but can't view all states like a timeline or create bookmarks
- Blocks: Hard to compare state at different points in execution
- Priority: Medium

**Limited Built-in Functions**
- Problem: Interpreter implements only array methods (push, pop, slice, splice, map, filter, reduce, find, includes, indexOf, join, reverse, sort), string methods, and basic math
- Impact: User code using Object methods (Object.keys, Object.assign, etc.) or other built-ins will fail silently or return undefined
- Files: `src/engine/interpreter.ts:900-1230` (method implementations)
- Priority: Medium - High impact on DSA problem solving

**No Module System Support**
- Problem: Parser rejects import/require statements; cannot load external code or libraries
- Files: `src/engine/parser.ts:62-66` (restricted patterns check)
- Impact: Can't demonstrate real-world patterns requiring modules
- Priority: Medium

## Test Coverage Gaps

**Interpreter Binary Operations:**
- What's not tested: Type coercion, operator precedence, associativity, string concatenation edge cases
- Files: `src/engine/interpreter.ts` (lines 730-850)
- Risk: Silent incorrect behavior; users learning wrong semantics
- Priority: High

**Closure and Scope Chain:**
- What's not tested: Nested closures, closure variable capture, let/const block scope, temporal dead zone, var hoisting
- Files: `src/engine/interpreter.ts` (lines 1228-1275)
- Risk: Fundamental JS concepts taught incorrectly
- Priority: High

**Array Method Edge Cases:**
- What's not tested: Empty array methods, sparse arrays, negative indices, undefined vs null handling
- Files: `src/engine/interpreter.ts` (lines 960-1090)
- Risk: Users see different behavior than real JavaScript
- Priority: High

**Parser Edge Cases:**
- What's not tested: Complex expressions, operator precedence, arrow functions, destructuring, spread operator
- Files: `src/engine/parser.ts`
- Risk: Code that should parse fails silently or parses incorrectly
- Priority: Medium

**Error Handling and Recovery:**
- What's not tested: Syntax error messages, runtime error propagation, error location reporting
- Files: `src/engine/parser.ts`, `src/engine/interpreter.ts` (error handling scattered)
- Risk: Poor developer experience when debugging user code
- Priority: Medium

**Component Integration:**
- What's not tested: Code editor state sync with interpreter; visualization updates on code changes; step controls; playback state management
- Files: `src/app/[categoryId]/[problemId]/PracticePageClient.tsx` (complex integration logic)
- Risk: Race conditions; stale state; UI not reflecting actual execution
- Priority: Medium - Currently relying on manual testing

**Visualization Component Tests:**
- What's not tested: All 30+ concept visualization components (EventLoopViz, PromisesViz, etc.) have no unit tests
- Files: `src/components/Concepts/*.tsx`
- Risk: Visual regressions not caught; step state mismatches undetected
- Priority: Medium - Visual components harder to test but important for correctness

---

*Concerns audit: 2026-01-23*
