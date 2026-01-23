# Architecture

**Analysis Date:** 2026-01-23

## Pattern Overview

**Overall:** Event-driven state machine with AST-based interpreter engine, coupled with a modular component visualization system.

**Key Characteristics:**
- Zustand-based execution state management (single source of truth)
- Custom JavaScript interpreter that executes AST and generates step-by-step execution trace
- Layered separation between interpreter engine (pure logic), state management, and UI components
- Dynamic component imports for visualization (lazy loading by concept ID)
- Three distinct learning modes: Understand (concepts), Build (implementations), Solve (DSA problems)

## Layers

**Interpreter Engine (Core):**
- Purpose: Parse JavaScript code to AST and execute it step-by-step, generating execution states for visualization
- Location: `src/engine/`
- Contains: Parser (via Acorn), interpreter state machine, runtime value representations, error formatting
- Depends on: Acorn AST library, types from `src/types`
- Used by: Execution store actions

**Execution State Management:**
- Purpose: Centralized state management for code, execution steps, playback control, breakpoints, console output
- Location: `src/store/executionStore.ts`
- Contains: Zustand store with actions for code control, stepping, breakpoint management, playback
- Depends on: Interpreter engine, types
- Used by: All UI components via hooks (`useExecutionStore`, `useCurrentStep`, `useCallStack`, etc.)

**Data & Content Layer:**
- Purpose: Static definitions of problems, concepts, examples, and algorithm pattern visualizations
- Location: `src/data/`
- Contains:
  - `concepts.ts` - JS fundamental concepts (closures, hoisting, etc.) with explanations
  - `examples.ts` - Coding problems organized by category (arrays, async, functional, DSA)
  - `algorithmConcepts.ts` - DSA pattern visualizations (two-pointers, hash-map, bit-manipulation)
  - `dsaConcepts.ts` - Data structure reference materials
- Depends on: Types
- Used by: Pages, problem selector components

**UI Component Layer:**
- Purpose: React components for rendering code editor, execution visualization, controls, concept explanations
- Location: `src/components/`
- Contains:
  - Editor: `CodeEditor/` - Monaco editor integration with breakpoint UI
  - Debugging: `CallStack/`, `Variables/`, `Console/` - render execution state
  - Visualization: `Visualization/` - array/binary visualizations from interpreter output
  - Concepts: `Concepts/` - interactive visualizations for JS concepts (HoistingViz, ClosuresViz, etc.)
  - Algorithm concepts: `ConceptPanel/`, `DSAConcepts/` - algorithm pattern visualizations
  - Navigation: `NavBar/`, `CategoryCarousel/`, `ProblemCard/`, `Search/`
- Depends on: Execution store hooks, data layer, types
- Used by: Pages (app router)

**Pages & Routing (Next.js App Router):**
- Purpose: Define routes and page layouts for learning journey
- Location: `src/app/`
- Key routes:
  - `/` - Home (3 learning sections)
  - `/concepts` - Concept overview; `/concepts/[conceptId]` - individual JS concept
  - `/concepts/dsa` - DSA concepts overview
  - `/js-problems` - all JS implementation problems
  - `/[categoryId]` - problem listing by category; `/[categoryId]/[problemId]` - practice page
  - `/[categoryId]/[problemId]/concept` - algorithm visualization for problem
  - `/playground/event-loop` - interactive event loop visualizer
- Depends on: Components, store, data
- Used by: Router (entry points)

## Data Flow

**Code Execution Flow:**

1. User enters code in `CodeEditor` (Monaco)
2. `CodeEditor` calls `setCode()` on store
3. User clicks "Run" or "Step Forward"
4. `startExecution()` or `stepForward()` called on store
5. Store calls `parseCode()` from engine → AST generated
6. Store creates interpreter, calls `interpreter.execute(ast)`
7. Interpreter walks AST, produces `ExecutionStep[]` array (each step = single operation)
8. Store sets: `steps[]`, `currentStep: 0`, `status: 'paused'`, `consoleOutput[]`
9. Components subscribe to store slices via hooks
10. `CallStack`, `Variables`, `Console`, `Visualization` render current step's state

**Concept Visualization Flow:**

1. User navigates to `/concepts/[conceptId]`
2. Page loads concept definition from `concepts.ts`
3. Page dynamically imports matching viz component (e.g., `HoistingViz`)
4. Component renders interactive explanation + code examples
5. User can click examples → code is set in store → execution flow starts

**Algorithm Concept Visualization Flow:**

1. User practices problem on `/[categoryId]/[problemId]`
2. Page detects problem has algorithm insight (from `algorithmConcepts.ts`)
3. Page shows "View Concept" link → `/[categoryId]/[problemId]/concept`
4. Page loads `ProblemConcept` from `problemConcepts[]` matching problem ID
5. `ConceptPanel` renders step-by-step visualization with pattern-specific UI (two-pointer arrows, hash-map table, etc.)

**State Management:**

- Execution store holds all runtime state
- Components select only needed slices (via hooks) for performance
- No prop drilling; everything flows through store
- Breakpoints and watch expressions persisted in store during session
- Console output accumulated and filtered by visible step

## Key Abstractions

**ExecutionStep:**
- Purpose: Immutable snapshot of one atomic operation in the code
- Examples: `src/engine/interpreter.ts` produces these
- Pattern: Contains AST node, source location, call stack, all scopes, description, step type

**RuntimeValue:**
- Purpose: Typed representation of JavaScript runtime values (primitives, arrays, objects, functions, null, undefined)
- Examples: `src/engine/runtime.ts` creates/clones these
- Pattern: Type-tagged union; enables accurate memory visualization

**Concept & CategoryConcept:**
- Purpose: Structured definition of a JS/DSA concept with examples and visualizations
- Examples: `src/data/concepts.ts`, `src/data/algorithmConcepts.ts`
- Pattern: Declarative content definitions; components find and render via concept ID

**StackFrame:**
- Purpose: Represents one function call on the call stack with parameters, locals, return value
- Examples: Tracked in each `ExecutionStep.callStack`
- Pattern: Immutable; one per function invocation; tracks scopes for variable lookup

## Entry Points

**Web Application:**
- Location: `src/app/layout.tsx`, `src/app/page.tsx`
- Triggers: User navigates to domain
- Responsibilities: Render root layout, home page with learning sections

**Problem Practice:**
- Location: `src/app/[categoryId]/[problemId]/PracticePageClient.tsx`
- Triggers: User clicks on a problem from category listing
- Responsibilities: Load problem code, set up code editor + debugger UI, link to concept visualization

**Concept Learning:**
- Location: `src/app/concepts/[conceptId]/ConceptPageClient.tsx`
- Triggers: User navigates to `/concepts/[conceptId]`
- Responsibilities: Load concept definition, dynamically import visualization component, render explanation + interactive demo

**DSA Problems:**
- Location: `src/app/[categoryId]/CategoryPageClient.tsx`
- Triggers: User selects a problem category from home or browsing
- Responsibilities: Filter and display problems by category, show difficulty indicators, handle search

## Error Handling

**Strategy:** Defensive parsing with error recovery; execution stops on first error; errors displayed in editor and console.

**Patterns:**
- Parser errors caught in `parseCode()` → return `{ success: false, error }` → store sets `parseError`, `status: 'error'`
- Runtime errors (ReferenceError, TypeError) thrown during execution → caught at top of `interpreter.execute()` → wrapped in `ExecutionError`
- Division by zero, stack overflow (MAX_CALL_DEPTH) → caught in interpreter → friendly error message
- Parse/execution errors displayed in `CodeEditor` error zone and console output
- ErrorBoundary component wraps concept visualizations to catch component render errors

## Cross-Cutting Concerns

**Logging:** No structured logging; uses `console.log()` calls in user code → captured in store's `consoleOutput[]` and rendered in Console component

**Validation:**
- Code syntax validation via Acorn parser
- Breakpoint line numbers validated against actual code lines
- Watch expressions validated at current step via scope lookup

**Authentication:** Not applicable; pure client-side learning tool

**Step Limits:** `MAX_STEPS = 10000` prevents infinite loops from hanging browser; execution stops when limit reached

**Call Depth:** `MAX_CALL_DEPTH = 100` prevents stack overflow from deep recursion; throws error if exceeded

---

*Architecture analysis: 2026-01-23*
