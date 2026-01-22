# Architecture

**Analysis Date:** 2026-01-22

## Pattern Overview

**Overall:** Layered Client-Side Web Application with State Management Hub

**Key Characteristics:**
- Next.js 13+ App Router for routing and SSR
- Zustand for centralized execution state management
- Interpreter engine decoupled from UI layer
- Data-driven visualization patterns
- Clear separation between code execution logic and presentation

## Layers

**UI Layer (React Components):**
- Purpose: Render execution state, handle user input, display visualizations
- Location: `src/components/`
- Contains: Page layouts, editor integrations, visualization panels, debugging UI
- Depends on: Zustand store (for state), engine (indirectly via store), type definitions
- Used by: Next.js pages via `'use client'` directives

**State Management Layer (Zustand Store):**
- Purpose: Centralized state hub for code execution, step tracking, playback control, debugging
- Location: `src/store/executionStore.ts`
- Contains: Execution steps, breakpoints, watch expressions, console output, current step tracking
- Depends on: Engine layer (parser, interpreter), types
- Used by: All interactive components, page components

**Engine Layer (Execution & Parsing):**
- Purpose: Parse JavaScript code to AST, execute AST step-by-step, track execution state
- Location: `src/engine/`
- Contains: Parser (Acorn wrapper), Interpreter (AST walker), Runtime (value representations), error formatting
- Depends on: `acorn` library, type definitions
- Used by: Zustand store only

**Data Layer (Static Content):**
- Purpose: Store problem definitions, concept explanations, visualization templates
- Location: `src/data/`
- Contains: Problems (examples.ts), concepts (concepts.ts, dsaConcepts.ts), algorithm patterns (algorithmConcepts.ts)
- Depends on: None
- Used by: Page components, TypeScript types

**Routing Layer (Next.js App Router):**
- Purpose: Map URLs to pages, manage server/client boundaries
- Location: `src/app/`
- Contains: Page structures using dynamic segments ([categoryId], [problemId], etc.)
- Depends on: Components, store, data
- Used by: Browser navigation

## Data Flow

**Interactive Code Execution Workflow:**

1. **User Input** (CodeEditor component)
   - User types or pastes code into Monaco editor
   - `setCode()` store action updates state

2. **Parse** (`parseCode()` store action)
   - Store calls `parseCode()` from `src/engine/parser.ts`
   - Acorn parses JavaScript to AST
   - Result stored in `parsedAST` and `parseError`

3. **Interpret** (`startExecution()` store action)
   - Store calls `createInterpreter()` from `src/engine/interpreter.ts`
   - Interpreter walks AST node-by-node
   - Generates `ExecutionStep[]` array (one per semantic operation)
   - Each step captures: code location, call stack, variable scopes, console output
   - Steps and console output stored in store

4. **Visualize** (Component Rendering)
   - Components subscribe to specific store slices via selector hooks
   - `useCurrentStep()`, `useCallStack()`, `useCurrentScopes()` extract data for current step index
   - Components render based on execution state:
     - `CallStack` shows stack frames
     - `Variables` shows scopes
     - `Console` shows step-visible output
     - `VisualizationPanel` detects arrays/data structures and renders them

5. **Playback Control**
   - User clicks step/play buttons → store actions: `stepForward()`, `stepBackward()`, `runToCompletion()`
   - Store updates `currentStep` index
   - Components re-render with new step data

**State Management:**

- Single source of truth: `ExecutionStore` in `src/store/executionStore.ts`
- State shape: Code, parsed AST, execution steps array, current step index, breakpoints, watch expressions, playback state
- Actions: Parse, execute, step, jump, set breakpoints, manage watches
- Performance: Zustand selector hooks prevent unnecessary re-renders (each component subscribes to specific slice)

## Key Abstractions

**ExecutionStep:**
- Purpose: Represents one discrete operation in code execution
- Location: `src/types/index.ts`
- Pattern: Immutable snapshot of interpreter state at a point in code
- Content: Node reference, source location, call stack, scopes, step type, human description
- Example: "assignment to variable x = 5" is one step

**RuntimeValue (Discriminated Union):**
- Purpose: Represents runtime values during execution
- Pattern: Discriminated union (type + data structure)
- Types: PrimitiveValue, ArrayValue, ObjectValue, FunctionValue, NullValue, UndefinedValue
- Used by: Interpreter to track variable values, Components to render state

**ScopeChain:**
- Purpose: Model variable scope hierarchy
- Pattern: Array of `Scope` objects (global → function → block scopes)
- Each scope has: type (global/function/block), variable names → RuntimeValues
- Used by: Interpreter (scope lookup), Variables component (variable display)

**StackFrame:**
- Purpose: Represent single function call context
- Pattern: Immutable record with frame ID, function name, params, locals, call site location
- Used by: CallStack component (display stack traces)

**ConceptType & ConceptStep:**
- Purpose: Decouple algorithm visualization from code execution
- Pattern: Problem-specific step sequences with visual state
- Used by: ConceptPanel to teach algorithm patterns (two-pointers, bit-manipulation, etc.)
- Examples: `src/data/algorithmConcepts.ts` defines step sequences for 2-sum, valid palindrome, etc.

## Entry Points

**Home Page (`/`):**
- Location: `src/app/page.tsx`
- Triggers: User visits root URL
- Responsibilities: Render category grid, concept overview, link to practice areas

**Practice Page (`/[categoryId]/[problemId]`):**
- Location: `src/app/[categoryId]/[problemId]/page.tsx` (server component)
- Actual logic: `src/app/[categoryId]/[problemId]/PracticePageClient.tsx` (client component)
- Triggers: User clicks problem link
- Responsibilities: Load problem code into editor, set up execution store, render editor + debugger UI

**Category Page (`/[categoryId]`):**
- Location: `src/app/[categoryId]/page.tsx` + `CategoryPageClient.tsx`
- Triggers: User browses category (e.g., /arrays-hashing)
- Responsibilities: List problems, filter by subcategory, navigate to problem pages

**Concept Pages:**
- JS Concept: `/concepts/[conceptId]` → `src/app/concepts/[conceptId]/page.tsx` + `ConceptPageClient.tsx`
- Algorithm Concept: `/concepts/dsa/[conceptId]` → `src/app/concepts/dsa/[conceptId]/page.tsx` + `DSAConceptPageClient.tsx`
- Triggers: User wants to understand a concept
- Responsibilities: Render interactive concept visualizations with key points, examples

**Event Loop Playground:** `/playground/event-loop` → Interactive microtask queue visualizer

## Error Handling

**Strategy:** Multi-layer validation with user feedback

**Patterns:**

1. **Parse Errors:** Acorn throws on invalid syntax
   - Caught in `parseCode()` function in `src/engine/parser.ts`
   - Returned as `ExecutionError { message, line, column }`
   - Store sets `parseError` state
   - CodeEditor displays error inline

2. **Runtime Errors:** Interpreter throws during execution
   - Try-catch in `createInterpreter().execute()`
   - Formatted by `src/engine/errorFormatter.ts`
   - Execution halted, error shown to user

3. **Infinite Loop Protection:** Interpreter enforces `MAX_STEPS = 10000`
   - If exceeded, execution stops with "Maximum steps exceeded" message
   - Prevents browser freeze from bad code

4. **Code Validation Warnings:** `validateCode()` function checks for risky patterns
   - Detects: `while(true)` without break, fetch/require/import
   - Returns warnings but allows execution
   - CodeEditor can display hints to user

## Cross-Cutting Concerns

**Logging:** `console.log/error/warn` calls during code execution
- Captured in interpreter's `consoleOutput` array
- Each output tagged with step number via `consoleOutputCount`
- Console component shows only outputs visible at current step

**Validation:** Code parsing and execution validation
- Syntax validation via Acorn (parse-time)
- Runtime validation via interpreter (execution-time)
- Static analysis via `validateCode()` (warning-time)

**Authentication:** Not applicable (no backend)

**Performance Optimization:**
- Selector hooks in Zustand prevent unnecessary renders
- `useMemo` in components prevents recalculation
- Monaco editor lazy-loaded via `dynamic()` import
- Visualization detection in VisualizationPanel uses `useMemo` to avoid re-scanning on every render

---

*Architecture analysis: 2026-01-22*
