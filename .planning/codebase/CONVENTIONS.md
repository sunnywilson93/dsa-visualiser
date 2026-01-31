# Coding Conventions

**Analysis Date:** 2026-01-31

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (`CallStack.tsx`, `HoistingViz.tsx`, `EventLoopViz.tsx`)
- Utility modules: camelCase with `.ts` extension (`parser.ts`, `interpreter.ts`, `getCrossLinks.ts`)
- Type definitions: `index.ts` or named files (`types.ts`)
- CSS Modules: `ComponentName.module.css` (e.g., `ClosuresViz.module.css`, `PrototypesViz.module.css`)
- Client components: Suffixed with `Client` (`PracticePageClient.tsx`, `EventLoopPlaygroundClient.tsx`, `DSAConceptPageClient.tsx`)
- Page components: `page.tsx` (Next.js App Router convention)
- Test files: `.test.ts` or `.test.tsx` suffix (`interpreter.test.ts`, `languageDetector.test.ts`, `eventLoopAnalyzer.test.ts`)
- Barrel exports: `index.ts` in component/module directories

**Functions:**
- Exported functions: camelCase (`parseCode`, `createInterpreter`, `formatValue`, `analyzeEventLoop`)
- React components: PascalCase (`CallStack`, `ValueDisplay`, `StackFrameCard`)
- Hooks: Prefixed with `use` (`useExecutionStore`, `useCallStack`, `useAutoPlay`, `useSearch`)
- Event handlers: Prefixed with `handle` (`handleNext`, `handlePrev`, `handleReset`, `handleLevelChange`, `handleEditorMount`)
- Internal helpers: camelCase (`getFrameColor`, `getStatusColor`, `nodeToSource`)
- Generator functions: `generateId()` pattern

**Variables:**
- Constants: SCREAMING_SNAKE_CASE for true constants (`MAX_STEPS`, `MAX_CALL_DEPTH`, `EXAMPLE_CODE`, `FRAME_COLORS`)
- Local variables: camelCase (`currentStep`, `stepIndex`, `callStack`, `exampleIndex`)
- Component state: camelCase (`isPlaying`, `currentStep`, `exampleIndex`, `level`)
- Boolean variables: Prefixed with `is`, `has`, or `should` (`isActive`, `isEmpty`, `isRecursive`, `isExpandable`, `hasError`)
- Refs: Suffixed with `Ref` (`editorRef`, `monacoRef`, `lineRefs`)

**Types:**
- Interfaces: PascalCase (`StackFrame`, `ExecutionStep`, `RuntimeValue`, `Scope`, `ConceptExample`)
- Type aliases: PascalCase (`StepType`, `RuntimeValue`, `ScopeChain`, `Level`)
- Enum-like types: String literal unions with kebab-case values (`'beginner' | 'intermediate' | 'advanced'`)
- Props interfaces: Suffixed with `Props` (`VariableDisplayProps`, `StackFrameCardProps`, `ValueDisplayProps`)
- Generic type names: Single uppercase letter or descriptive PascalCase (`T`, `ClassValue`)

## Code Style

**Formatting:**
- Indentation: 2 spaces (consistent across all files)
- Quotes: Single quotes for strings
- Semicolons: Not used (consistent omission across entire codebase)
- Line length: No strict limit, but reasonable line breaks for readability
- Trailing commas: Used in multi-line arrays and objects
- Object/array formatting: Multi-line for readability when > 3 items

**Linting:**
- ESLint with `next/core-web-vitals` config (`.eslintrc.json`)
- Run command: `npm run lint`
- Minimal eslint-disable comments (only for unavoidable `any` types in Acorn AST handling)

**TypeScript:**
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- Target: ES2017
- Module: esnext with bundler resolution
- No explicit semicolons
- Type imports use `import type` syntax for type-only imports
- Type inference preferred, explicit types for public APIs

**CSS Approach:**
- **Primary**: Tailwind CSS v4 with utility-first methodology
- **Secondary**: CSS Modules for legacy component-specific styles (being phased out)
- CSS custom properties defined in `@theme` block in `src/styles/globals.css`
- Utility classes applied via `className` prop
- Conditional classes using template literals with ternary operators
- Dynamic styles via inline `style` prop for computed values (colors, animations)
- Helper utility: `cn()` function from `src/utils/cn.ts` (wraps `clsx` for conditional class merging)

## Import Organization

**Order:**
1. React and Next.js core imports (`react`, `next/link`, `next/image`)
2. External UI/animation libraries (`framer-motion`, `lucide-react`)
3. External utilities (`acorn`, `zustand`, `clsx`)
4. Type-only imports from external libraries (`import type { Node } from 'acorn'`)
5. Internal imports with `@/` path alias (`@/store`, `@/engine`, `@/components`, `@/data`)
6. Type imports from internal modules (`import type { ExecutionStep } from '@/types'`)
7. CSS/style imports (when using CSS Modules, e.g., `import styles from './Component.module.css'`)

**Path Aliases:**
- `@/*` maps to `src/*` (configured in `tsconfig.json` baseUrl and paths)
- Consistently used throughout codebase
- Examples:
  - `import { parseCode } from '@/engine'`
  - `import { useExecutionStore } from '@/store'`
  - `import type { RuntimeValue } from '@/types'`
  - `import { concepts } from '@/data/concepts'`

**Module Exports:**
- Barrel exports via `index.ts` files for cleaner imports
- Named exports strongly preferred over default exports
- Exception: Page components and layouts use default exports (Next.js App Router requirement)
- Pattern: `export { ComponentName } from './ComponentName'`
- Type exports: `export type { TypeName } from './types'`

## Error Handling

**Patterns:**
- Custom Error subclasses for control flow signals (`BreakSignal`, `ContinueSignal`, `ReturnSignal` in `src/engine/interpreter.ts`)
- Structured error results: `{ success: boolean, error?: string, ast?: Program }`
- Dedicated error formatter: `src/engine/errorFormatter.ts` with categorized errors
- Error state in Zustand stores (`parseError`, `status: 'error'`)
- Try-catch blocks for parsing and execution critical paths
- Type guards for runtime safety (`value.type === 'array'`, discriminated unions)

**Error Messages:**
- User-friendly, actionable messages
- Include context: line numbers, error type, suggestions
- Error categories: `syntax`, `runtime`, `unsupported`, `reference`, `type`, `limit`
- Formatted errors contain: category, message, line, column, suggestions, severity
- Language detection errors suggest JavaScript if non-JS code detected

## Logging

**Framework:** Standard `console` methods

**Patterns:**
- Console output captured by interpreter for visualization (not for debugging)
- `consoleOutput` array in execution state tracks all `console.log()` calls
- Each `ExecutionStep` has `consoleOutputCount` field
- Console component renders tracked output
- No production logging framework
- Development debugging via browser DevTools

**Usage:**
- Minimal console logging in production code
- Interpreter simulates `console.log`, `console.error`, `console.warn`
- Test output via Vitest runner

## Comments

**When to Comment:**
- Complex algorithms requiring explanation (AST walking, interpreter logic)
- Non-obvious business logic or workarounds
- Section headers in large files (e.g., `// ============================================================================`)
- Edge case handling and rationale
- Control flow patterns (break/continue signals)
- Temporary code or TODO items (rare)

**JSDoc/TSDoc:**
- Used sparingly, primarily for key utility functions
- Example from `src/utils/cn.ts`:
  ```typescript
  /**
   * Utility to conditionally join classNames together
   * Uses clsx for conditional class merging
   */
  export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
  }
  ```
- Example from `src/engine/parser.ts`:
  ```typescript
  /**
   * Parse JavaScript code into an AST using Acorn
   */
  export function parseCode(code: string): ParseResult {
  ```
- Type annotations via TypeScript generally preferred over JSDoc

**Comment Style:**
- Single-line: `// Comment text`
- Multi-line: Standard `/* */` blocks
- Section dividers: `// ===` pattern for major sections
- Inline explanations for tricky code
- No emoji in comments (professional tone)

## Function Design

**Size:**
- Most functions kept under 100 lines
- Small, focused functions preferred
- Complex logic extracted into helper functions
- React components: Sub-components extracted for clarity (`VariableDisplay`, `StackFrameCard` within parent)
- Engine functions can be larger if implementing cohesive algorithms (e.g., `interpreter.ts` visitor methods)

**Parameters:**
- TypeScript interfaces for complex parameter objects
- Props interfaces for all React components
- Destructuring in function signatures common
- Optional parameters marked with `?`
- Default values using `=` syntax
- Callback naming: clear intent (`onToggle`, `onChange`, `onMount`)

**Return Values:**
- Explicit return types for public/exported functions
- Type inference acceptable for internal/private functions
- Structured returns for fallible operations: `{ success, error, result }`
- Early returns for guard clauses (flattens nesting)
- React components return JSX.Element implicitly

## Module Design

**Exports:**
- Named exports for most modules
- Default exports only for Next.js pages, layouts, and route handlers
- Barrel exports (`index.ts`) for major directories
- Type-only exports use `export type` syntax
- Re-export pattern in barrel files

**Barrel Files:**
- Used extensively: `src/components/index.ts`, `src/store/index.ts`, `src/engine/index.ts`
- Pattern: `export { Name } from './Name'`
- Include type exports: `export type { TypeName } from './types'`
- Simplifies imports: `import { CallStack, Variables } from '@/components'`

**Module Structure:**
- One primary export per file (component, utility, store)
- Related helpers and types co-located in same file
- Shared types centralized in `src/types/index.ts`
- Store hooks defined alongside store creation
- Data files export arrays/objects of structured content

## React Patterns

**Component Structure:**
- Functional components exclusively (no class components)
- `'use client'` directive for client-side components in App Router
- Props destructuring in function signature
- Type-safe props with TypeScript interfaces
- Sub-components defined within same file when tightly coupled

**Hooks Usage:**
- Custom hooks for reusable logic (`useCallStack`, `useCurrentStep`, `useAutoPlay`, `useSearch`)
- Zustand stores for global state management
- React built-in hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`
- Hook dependencies explicitly listed and exhaustive
- Hook call order consistent with Rules of Hooks

**State Management:**
- **Global state**: Zustand stores (`src/store/executionStore.ts`, `src/store/panelStore.ts`)
- **Local state**: `useState` for component-specific UI state
- Immer integration with Zustand for immutable updates
- Store selectors for granular subscriptions (performance optimization)
- Derived state via custom hooks (`useCurrentStep`, `useExecutionProgress`)

**Event Handlers:**
- Arrow functions for inline handlers when simple
- Named handler functions for complex logic
- Naming convention: `handleActionName` pattern
- Event types: React synthetic events (implicit typing)
- Callbacks passed as props: `onToggle`, `onChange`, `onMount`

**Styling Patterns:**
- Tailwind utility classes via `className` prop
- Conditional classes with template literals: `className={\`base ${condition ? 'active' : 'inactive'}\`}`
- `cn()` utility for complex conditional logic
- Dynamic values via inline `style` prop: `style={{ background: color }}`
- CSS custom properties for theming: `var(--color-text-primary)`
- CSS Modules used in legacy components (being migrated)

**Animation:**
- Framer Motion for declarative animations
- `AnimatePresence` for enter/exit animations
- Motion components: `motion.div`, `motion.button`
- Animation props: `initial`, `animate`, `exit`, `transition`, `layout`
- Subtle animations preferred (200-300ms durations)

## Type Safety

**Type Annotations:**
- Explicit types for all function parameters
- Return type inference common, explicit for public APIs
- Props interfaces for all React components
- Generic types where appropriate (`create<ExecutionStore>`)

**Type Guards:**
- Runtime checks for discriminated unions (`value.type === 'array'`)
- Helper functions for type validation (`isTruthy`, `isExpandable`)
- Pattern: narrow types in conditionals before accessing fields

**Discriminated Unions:**
- Primary pattern for runtime values (`RuntimeValue` type)
- `type` field as discriminator
- Example:
  ```typescript
  type RuntimeValue =
    | { type: 'primitive'; dataType: 'number' | 'string' | 'boolean'; value: any }
    | { type: 'array'; id: string; elements: RuntimeValue[]; heapAddress: string }
    | { type: 'object'; id: string; properties: Record<string, RuntimeValue>; heapAddress: string }
    | { type: 'function'; name: string; params: string[]; body: Node; closure: ScopeChain }
    | { type: 'null' }
    | { type: 'undefined' }
  ```
- Enables exhaustive type checking in switch statements

**Any Usage:**
- Minimal and justified
- Primary use: Acorn AST nodes (complex third-party types)
- Always commented with explanation:
  ```typescript
  // Using any here because Acorn's AST types are complex
  type ASTNode = Node & Record<string, any>
  ```
- Type assertions (`as Type`) preferred where possible over `any`

---

*Convention analysis: 2026-01-31*
