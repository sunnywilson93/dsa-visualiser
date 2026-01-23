# Coding Conventions

**Analysis Date:** 2026-01-23

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `Controls.tsx`, `Variables.tsx`)
- Non-React modules: camelCase with `.ts` extension (e.g., `parser.ts`, `runtime.ts`)
- Barrel exports: `index.ts` files re-export from modules in the directory (e.g., `src/components/index.ts`)
- CSS modules: `ComponentName.module.css` imported as `styles` object

**Functions:**
- camelCase: `parseCode()`, `formatValue()`, `createInterpreter()`, `toggleBreakpoint()`
- Type constructors: `createPrimitive()`, `createArray()`, `createObject()`, `createFunction()`
- Helper functions with clear single responsibility: `nodeToSource()`, `getNodeLocation()`, `isTruthy()`

**Variables:**
- camelCase throughout: `editorRef`, `monacoRef`, `consoleOutput`, `currentStep`
- React hooks: `useExecutionStore()`, `useCurrentStep()`, `useCurrentScopes()`
- Boolean prefixes: `isPlaying`, `isExpandable`, `isLikelyJavaScript`
- Temporary loop/index variables: `i`, `j`, `k` (acceptable in tight loops)

**Types:**
- PascalCase for type/interface names: `ExecutionStep`, `RuntimeValue`, `StackFrame`, `ScopeChain`
- Union types: `type StepType = 'declaration' | 'assignment' | ...`
- Prefix for interfaces with implementation contracts: `InterpreterState`, `CodeEditorProps`

**Constants:**
- UPPER_SNAKE_CASE for module-level constants: `MAX_STEPS = 10000`, `MAX_CALL_DEPTH = 100`
- Example data: `EXAMPLE_CODE` constant in store initialization

## Code Style

**Formatting:**
- 2 spaces for indentation (enforced by project standards)
- Single quotes for strings (`'use client'`, `'vitest'`)
- No semicolons at end of statements
- Line wrapping at reasonable lengths; destructuring on multiple lines when needed

**Imports:**
- Order: React/Next, third-party, internal aliases, type imports
- Example from `CodeEditor.tsx`:
  ```typescript
  import { useRef, useEffect, useCallback } from 'react'
  import Link from 'next/link'
  import Editor, { OnMount, Monaco } from '@monaco-editor/react'
  import type { editor } from 'monaco-editor'
  import { Lightbulb } from 'lucide-react'
  import { useExecutionStore, useCurrentStep } from '@/store'
  import styles from './CodeEditor.module.css'
  ```

**Linting:**
- ESLint configuration from Next.js (`eslint-config-next`)
- Explicit eslint-disable comments for unavoidable patterns:
  ```typescript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ASTNode = Node & Record<string, any>
  ```
- No unwanted comments; comments only for non-obvious logic

## Import Organization

**Order:**
1. React/Next.js imports (hooks, components, types)
2. Third-party UI libraries (lucide-react, framer-motion)
3. Third-party utilities (zustand, acorn)
4. Monaco Editor types
5. Internal store and engine imports via `@/` alias
6. Type imports with `import type`
7. CSS Modules imported as `styles`

**Path Aliases:**
- `@/` maps to `src/` (configured in `tsconfig.json` and `vitest.config.ts`)
- Use `@/types`, `@/store`, `@/engine`, `@/components`, `@/lib` throughout codebase

## Error Handling

**Patterns:**
- Parse errors: Structured with `ParseResult` interface containing `success`, `ast`, and optional `error`
  ```typescript
  export interface ParseResult {
    success: boolean
    ast?: Program
    error?: ExecutionError
  }
  ```
- Error formatting: Dedicated `src/engine/errorFormatter.ts` module with specific patterns (syntax, language, runtime, unsupported, limit)
- Try-catch blocks used selectively; errors wrapped with context (e.g., line/column info)
- Custom control flow signals for break/continue: `BreakSignal` and `ContinueSignal` classes extending Error
- Validation via `validateCode()` for warnings before execution (infinite loops, restricted APIs)

**Error Messages:**
- Friendly, actionable messages for users
- Suggestions included in `FormattedError` interface
- Pattern matching against known error types with helpful context
- Language detection to suggest JavaScript if non-JS code detected

## Logging

**Framework:** `console` methods (no dedicated logging library)

**Patterns:**
- `console.log()` calls are tracked in execution interpreter as `consoleOutput` array
- Each execution step captures console output: `consoleOutputCount` tracks queue length
- Console output rendered in dedicated `Console` component
- No debug logging in production; interpreter outputs to trackable execution state

## Comments

**When to Comment:**
- Complex AST-to-source conversion logic (e.g., `nodeToSource()` function in `src/engine/interpreter.ts`)
- Non-obvious interpretation rules (e.g., breakpoint/continue signals)
- Public function documentation with block comments explaining purpose and parameters
- Type guard patterns and complex type coercions

**JSDoc/TSDoc:**
- Used for public functions and type constructors:
  ```typescript
  /**
   * Parse JavaScript code into an AST using Acorn
   */
  export function parseCode(code: string): ParseResult {
  ```
- Parameter and return type documentation in complex helpers
- Not required for simple utility functions or obvious method implementations

## Function Design

**Size:**
- Most functions kept under 50 lines
- Complex visitors (e.g., AST execution) broken into smaller methods
- Interpreter state manipulation isolated in helper functions

**Parameters:**
- Use destructuring for objects with multiple properties
- Props interfaces defined for React components with optional/required fields
- Callback functions passed as parameters named with clear intent (`onToggle`, `handleEditorMount`)

**Return Values:**
- Explicit return types on all public functions
- Early returns used to flatten conditional nesting
- Nullable returns minimized; prefer `null`/`undefined` explicit in type union

## Module Design

**Exports:**
- Barrel exports in `index.ts` files group related functionality:
  - `src/engine/index.ts` exports parser, interpreter, runtime
  - `src/components/index.ts` exports main UI components
  - `src/store/index.ts` exports Zustand store and hooks
- Named exports preferred; default exports avoided
- Type exports use `export type` syntax

**File Organization:**
- `src/engine/` - core interpreter, parser, runtime, error handling
- `src/components/` - React components organized by feature (CodeEditor, Variables, Controls, etc.)
- `src/store/` - Zustand execution state management
- `src/types/` - TypeScript type definitions
- `src/data/` - static data (concepts, examples)
- `src/app/` - Next.js App Router pages

**Circular Dependencies:**
- Avoided by proper layering: types → engine → components → pages
- Store is central hub for state; components consume via hooks

---

*Convention analysis: 2026-01-23*
