# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A visual learning platform for JavaScript concepts and DSA (Data Structures & Algorithms) interview preparation. Features interactive visualizations, a custom JavaScript interpreter with step-by-step execution, and concept explanations.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint checks
npm test             # Vitest in watch mode
npm run test:run     # Single test run (CI)
npm run test:coverage # Coverage report
```

Run a single test file:
```bash
npm test -- interpreter.test.ts
```

## Architecture

### Core Systems

**JavaScript Interpreter Engine** (`src/engine/`)
- `parser.ts` - Parses code to AST using Acorn
- `interpreter.ts` - Executes AST step-by-step, tracks state (scopes, call stack, variables)
- `runtime.ts` - Runtime value representations and formatting
- The interpreter generates execution "steps" that power the visualizations

**Execution State** (`src/store/executionStore.ts`)
- Zustand store managing: code, parsed AST, execution steps, current step index, playback state, breakpoints
- Components subscribe to specific slices for reactive updates

**Two Concept Systems**:
1. **JavaScript Concepts** (`src/data/concepts.ts`) - Interactive learning modules for JS fundamentals (hoisting, closures, event loop, prototypes, etc.) with code examples and visualizations
2. **Algorithm Concepts** (`src/data/algorithmConcepts.ts`) - Problem-specific step-by-step visualizations for DSA patterns (hash-map, two-pointers, bit-manipulation)

### Routing Structure

- `/` - Home page with category grid
- `/concepts` - JS concepts overview
- `/concepts/[conceptId]` - Individual JS concept page
- `/[categoryId]` - Problem category listing (e.g., `/arrays-hashing`)
- `/[categoryId]/[problemId]` - Practice page with code editor + interpreter
- `/[categoryId]/[problemId]/concept` - Algorithm visualization for specific problem

### Component Patterns

- Visualization components in `src/components/Concepts/` (e.g., `HoistingViz.tsx`, `ClosuresViz.tsx`)
- Algorithm-specific visualizers in `src/components/ConceptPanel/` (e.g., `HashMapConcept.tsx`, `TwoPointersConcept.tsx`)
- `src/components/Visualization/` - Array and binary visualizations for interpreter output

### Data Flow

1. User writes code in `CodeEditor`
2. Code is parsed via `parser.ts` → AST stored in executionStore
3. Interpreter walks AST, produces array of execution steps
4. User steps through execution; `currentStep` index updates
5. Components (`CallStack`, `Variables`, `Console`, `VisualizationPanel`) render current step's state

## Code Style

- TypeScript + React functional components
- 2 spaces, single quotes, no semicolons
- CSS Modules: `Component.module.css` imported as `styles`
- Path aliases: `@/` maps to `src/`
- Components: PascalCase filenames; hooks: `useSomething`

## Testing

- Vitest + React Testing Library + jsdom
- Tests colocated with source: `*.test.ts` or `*.test.tsx`
- Setup in `src/__tests__/setup.ts`
- Critical tests: interpreter logic, parser, execution store

## Key Types (`src/types/index.ts`)

- `ConceptType` - Algorithm pattern types (hash-map, two-pointers, bit-manipulation, etc.)
- `ConceptStep` - Single step in algorithm visualization with visual state
- `Concept` - JS concept definition with examples, key points, interview tips
