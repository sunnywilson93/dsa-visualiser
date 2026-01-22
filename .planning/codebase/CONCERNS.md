# Codebase Concerns

**Analysis Date:** 2026-01-22

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

## Test Coverage Gaps

**Minimal Test Coverage**
- What's not tested: Only 3 test files for 137 source files
- Files: Only `src/engine/interpreter.test.ts`, `src/engine/eventLoopAnalyzer.test.ts`, `src/engine/languageDetector.test.ts` have tests
- Gap areas: No tests for visualization components (31 concept visualization components), no tests for Zustand store actions, no tests for parser edge cases, no tests for error boundary
- Risk: UI regressions not caught. Store state mutations could break silently. Parser bugs only discovered in production
- Priority: High

**Parser Validation Weaknesses**
- Issue: `src/engine/parser.ts` validates with simple regex patterns (e.g., `/while\s*\(\s*true\s*\)/.test(code)`) which are not reliable
- Files: `src/engine/parser.ts:56-72`
- Risk: Infinite loops not detected properly. User-written code might trigger uncaught errors
- Recommendations: Use AST analysis instead of regex for detecting problematic patterns. Add property guards for undefined/null node properties

**Missing Integration Tests**
- Issue: No tests verify parser → interpreter → step generation pipeline works end-to-end
- Impact: Code changes to any layer could break visualization without detection
- Recommendation: Add tests for full execution flow: parse → execute → verify steps are generated correctly

## Performance Bottlenecks

**Memory Cloning on Every Step**
- Problem: Interpreter clones entire call stack and scopes on every step via `cloneCallStack()` and `cloneScopes()`
- Files: `src/engine/interpreter.ts:1307-1321`
- Cause: Deep cloning for state capture happens for every recorded step (up to MAX_STEPS=10000). This includes cloning all RuntimeValue objects recursively
- Observation: This is by design for step-by-step state inspection, but could be optimized with structural sharing or snapshot indexing
- Improvement path: Consider copy-on-write semantics or only capturing changed values. Profile to measure actual impact on large programs

**No Lazy Loading for Visualization Examples**
- Problem: All concept and algorithm examples are loaded at startup, even if user never visits those pages
- Files: `src/data/concepts.ts`, `src/data/algorithmConcepts.ts`, `src/data/dsaConcepts.ts`
- Impact: Large JavaScript bundle, slow initial page load
- Improvement path: Use dynamic imports in Next.js page components to load examples on-demand

**Event Loop Analyzer Iteration Limits**
- Problem: `src/engine/eventLoopAnalyzer.ts` has hard limits (MAX_STEPS=500, MAX_ITERATIONS=50) that silently truncate output
- Files: `src/engine/eventLoopAnalyzer.ts:44-45`
- Impact: Complex async code with many iterations produces incomplete visualization without clear error message
- Improvement path: Add user feedback when limits are hit. Consider optimizing analysis to handle more iterations

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
- Current mitigation: MAX_STEPS limit in interpreter
- Recommendations: Add code length limit (e.g., 100KB max). Add timeout for parsing

## Fragile Areas

**Event Loop Analyzer Pattern Matching**
- Files: `src/engine/eventLoopAnalyzer.ts:100-750` (entire analysis logic)
- Why fragile: Uses string analysis and AST inspection without full semantic understanding. Detects patterns like setTimeout/Promise but doesn't handle:
  - setTimeout with 0 delay fallback to 4ms
  - Promise.resolve() immediate vs queued behavior
  - async/await desugaring details
- Safe modification: Only change warning messages. Don't extend pattern detection without adding corresponding test cases
- Test coverage: Has unit tests (eventLoopAnalyzer.test.ts) but gaps remain

**Function Expression Closure Capture**
- Files: `src/engine/interpreter.ts:400-450` (function declaration/expression handling)
- Why fragile: Closure capture depends on proper scope chain maintenance. Related bugs fixed in recent commits ("Fix interpreter for function expressions and closures")
- Safe modification: Add tests before modifying scope handling. Current test is `interpreter.test.ts` but gaps in closure edge cases
- Test coverage: Limited to basic cases

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
- Scaling path: Increase limit but monitor memory. Consider streaming steps or storing to IndexedDB instead of memory array

**Event Loop Analysis Max Iterations = 50**
- Current capacity: Event loop analyzer truncates output at 50 iterations
- Limit: Complex async flows with many task iterations produce incomplete visualizations
- Scaling path: Increase limit with profiling. Consider online/streaming algorithm instead of batch analysis

**Browser Memory Constraints**
- Current capacity: Depends on available RAM. Large array programs can exhaust memory during cloning
- Limit: 10,000 complex runtime objects with deep cloning will cause OOM
- Scaling path: Implement memory pooling or off-heap storage (IndexedDB). Use structural sharing instead of deep cloning

## Missing Critical Features

**No Step Search / Filter**
- Problem: Can't search/jump to specific step matching criteria (e.g., "find where variable x changed")
- Blocks: Advanced debugging workflows, hard to find relevant code flow in 1000+ step programs

**No Breakpoint Conditions**
- Problem: `src/store/executionStore.ts:190-196` defines `setBreakpointCondition()` method but conditions are never evaluated
- Blocks: Can't pause on "when x > 10" – only can pause on line number
- Impact: Foundational feature for effective debugging in large programs

**No Timeline/Snapshot History**
- Problem: Can step forward/backward but can't view all states like a timeline or create bookmarks
- Blocks: Hard to compare state at different points in execution

**Limited Built-in Functions**
- Problem: Interpreter implements only array methods, string methods, and basic math
- Impact: User code using Object methods (Object.keys, Object.assign, etc.) will fail silently or return undefined
- Files: `src/engine/interpreter.ts:900-1230` (method implementations)

**No Syntax Highlighting in Code Editor**
- Problem: `src/components/CodeEditor/CodeEditor.tsx` uses plain textarea-like interface
- Impact: Makes reading complex code harder. User mistakes (typos) harder to spot visually

## Known Bugs

**Loop Variable Closure Bug - Documented but Unfixed in Interpreter**
- Symptoms: User code with loop closures over `var` doesn't execute correctly in interpreter
- Files: `src/data/concepts.ts:1051-1073` (problem documented as example), `src/engine/interpreter.ts` (interpreter)
- Trigger: Code like `for (var i=0; i<3; i++) { setTimeout(() => console.log(i), 0) }`
- Status: The concept is taught but interpreter's handling of `var` hoisting may not match browser behavior exactly
- Workaround: Use `let` instead or be aware of discrepancies

**Promise Microtask Timing Inaccuracies**
- Symptoms: Event loop visualizer treats Promise.resolve().then() as immediate but browser implementation has subtle timing differences
- Files: `src/engine/eventLoopAnalyzer.ts:82` (warning about Promise.all/race/any)
- Status: Known limitation with warning shown to user
- Recommendation: Add more warnings for Promise timing edge cases

## Dependencies at Risk

**Acorn Parser (Outdated Pattern)**
- Risk: Parser uses older configuration (ecmaVersion: 2022). Newer JavaScript features may not parse correctly
- Files: `src/engine/parser.ts:16-21`
- Impact: Code using recent ES2023+ syntax will fail silently
- Migration plan: Update to `ecmaVersion: 2024` and test with latest features. Consider using @babel/parser if more advanced transformation needed

**Zustand Version Lock**
- Risk: State management depends on current Zustand API. No version flexibility
- Impact: Upgrade path unclear if major version bump needed
- Recommendation: Pin version. Add integration tests to detect breaking changes early

## Missing Error Context

**Parser Errors Lose Location Info**
- Problem: When catch block in `src/engine/parser.ts:24-34` catches parse error, location info may be incomplete
- Impact: User sees "Syntax error" without knowing which line in their code caused it
- Fix: Ensure all error paths preserve line/column information

**Interpreter Runtime Errors Not Caught**
- Problem: If interpreter encounters undefined method or invalid operation, it may return `null` or `undefined` silently
- Files: `src/engine/interpreter.ts:1089-1091` (returns null for unknown array methods)
- Impact: User code silently produces wrong results instead of clear error message
- Recommendation: Throw explicit errors with context instead of returning null

---

*Concerns audit: 2026-01-22*
