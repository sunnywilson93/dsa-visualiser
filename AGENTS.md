# Repository Guidelines

## Project Overview

JS Interview Prep is an interactive learning platform for JavaScript interview preparation. It features a custom JavaScript interpreter with step-by-step code execution visualization, interactive concept explanations, and DSA (Data Structures & Algorithms) problem visualizations.

Live at: https://jsinterview.dev

## Technology Stack

- **Framework**: Next.js 14.2+ with App Router
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS v4 with CSS-first configuration
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Parser**: Acorn (AST parsing)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + jsdom + Playwright (E2E)

## Build, Test, and Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server on localhost:3000

# Build & Production
npm run build            # Create production build
npm run start            # Run production build locally

# Code Quality
npm run lint             # Run ESLint checks

# Unit & Integration Testing (Vitest)
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once (CI-friendly)
npm run test:coverage    # Generate coverage reports (text/json/html)

# E2E Visual Regression Testing (Playwright)
npm run test:visual      # Run visual regression tests
npm run test:visual:update  # Update visual test snapshots

# Maintenance Scripts
npm run check:vars       # Check CSS custom properties usage
npm run check:keyframes  # Validate CSS animation keyframes
npm run tokens:audit     # Audit design tokens for consistency
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with metadata
│   ├── [categoryId]/      # Problem category routes
│   ├── [categoryId]/[problemId]/   # Individual problem pages
│   ├── concepts/          # Concept learning pages
│   └── playground/        # Interactive playgrounds (event-loop)
├── components/            # React components
│   ├── Concepts/          # JS concept visualizations (HoistingViz, ClosuresViz, etc.)
│   ├── DSAPatterns/       # Algorithm pattern visualizers
│   ├── DSAConcepts/       # Data structure visualizers
│   ├── ConceptPanel/      # Problem-specific concept panels
│   ├── CodeEditor/        # Monaco Editor wrapper
│   ├── Visualization/     # Array/binary visualizations
│   └── */index.ts         # Barrel exports for each component
├── engine/                # JavaScript interpreter core
│   ├── parser.ts          # Acorn-based AST parser
│   ├── interpreter.ts     # Step-by-step code execution
│   ├── runtime.ts         # Runtime value representations
│   ├── eventLoopAnalyzer.ts  # Event loop visualization logic
│   └── *.test.ts          # Co-located tests
├── store/                 # Zustand state management
│   └── executionStore.ts  # Code execution state and actions
├── data/                  # Static data
│   ├── concepts.ts        # JS concept definitions
│   ├── algorithmConcepts.ts  # Algorithm problem visualizations
│   ├── dsaConcepts.ts     # DSA concept explanations
│   ├── dsaPatterns.ts     # Algorithm pattern definitions
│   └── examples.ts        # Code problem examples
├── types/                 # TypeScript type definitions
│   └── index.ts           # All shared types
├── lib/                   # Utility libraries
│   ├── search/            # Search functionality
│   └── seo/               # SEO utilities
├── utils/                 # Helper utilities
├── styles/                # Global styles
│   └── globals.css        # Tailwind v4 config + theme tokens
└── __tests__/             # Test setup
    └── setup.ts           # Vitest setup and mocks
```

## Code Style Guidelines

### TypeScript & React
- **Components**: Functional components with explicit return types
- **File naming**: PascalCase for components (e.g., `CodeEditor.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useExecutionStore`)
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: No semicolons

### Styling (Tailwind CSS v4)
- Uses CSS-first configuration in `src/styles/globals.css`
- Custom theme tokens defined via `@theme` directive
- Semantic color naming: `--color-bg-*`, `--color-text-*`, `--color-accent-*`
- Brand colors: `--color-brand-primary` (purple), `--color-brand-secondary` (pink)
- Component utilities in `@layer components`
- Animation keyframes in `@theme`

### Component Structure
Each component typically lives in its own directory:
```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.module.css   # CSS Modules (if needed)
└── index.ts               # Barrel export
```

### Path Aliases
- `@/` maps to `src/`
- Used for all imports: `import { X } from '@/components/X'`

## Testing Guidelines

### Test Framework: Vitest
- **Setup**: `src/__tests__/setup.ts`
- **Environment**: jsdom
- **Location**: Co-located with source files (`*.test.ts` or `*.test.tsx`)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)

### Test Types

1. **Engine Tests** (Critical)
   - `src/engine/interpreter.test.ts` - Core interpreter logic
   - `src/engine/eventLoopAnalyzer.test.ts` - Event loop analysis
   - `src/engine/languageDetector.test.ts` - Language detection

2. **Component Tests**
   - Co-located with components
   - Use React Testing Library
   - Mock browser APIs (matchMedia, ResizeObserver, IntersectionObserver)

3. **E2E Visual Tests** (Playwright)
   - Located in `e2e/`
   - Tests responsive breakpoints: desktop (1440px), tablet (768px), mobile (360px)
   - Visual regression with screenshot comparisons

### Running Tests
```bash
# Run specific test file
npm test -- interpreter.test.ts

# Run with coverage
npm run test:coverage

# Update snapshots
npm run test:visual:update
```

## Architecture Overview

### Core Systems

**JavaScript Interpreter Engine** (`src/engine/`)
- `parser.ts` - Parses JavaScript code to AST using Acorn
- `interpreter.ts` - Executes AST step-by-step, tracks execution state (scopes, call stack, variables)
- `runtime.ts` - Runtime value representations and formatting
- Generates execution "steps" that power the visualizations

**Execution State** (`src/store/executionStore.ts`)
- Zustand store managing: code, parsed AST, execution steps, current step index
- Playback state (play/pause/speed), breakpoints, console output
- Components subscribe to specific slices for reactive updates

**Two Concept Systems**:
1. **JavaScript Concepts** (`src/data/concepts.ts`) - Interactive learning modules for JS fundamentals (hoisting, closures, event loop, prototypes, etc.)
2. **Algorithm Concepts** (`src/data/algorithmConcepts.ts`) - Problem-specific step-by-step visualizations for DSA patterns (hash-map, two-pointers, bit-manipulation)

### Data Flow
1. User writes code in `CodeEditor`
2. Code is parsed via `parser.ts` -> AST stored in executionStore
3. Interpreter walks AST, produces array of execution steps
4. User steps through execution; `currentStep` index updates
5. Components (`CallStack`, `Variables`, `Console`, `VisualizationPanel`) render current step's state

### Routing Structure
- `/` - Home page with category grid
- `/concepts` - JS concepts overview
- `/concepts/[conceptId]` - Individual JS concept page
- `/concepts/dsa` - DSA concepts listing
- `/concepts/dsa/patterns/[patternId]` - Algorithm pattern pages
- `/[categoryId]` - Problem category listing (e.g., `/js-core`)
- `/[categoryId]/[problemId]` - Practice page with code editor + interpreter
- `/[categoryId]/[problemId]/concept` - Algorithm visualization for specific problem
- `/playground/event-loop` - Interactive event loop playground

## Key Types

Located in `src/types/index.ts`:

- `ExecutionStep` - Single step in code execution with call stack, scopes, line location
- `RuntimeValue` - Union type for all runtime values (primitives, arrays, objects, functions)
- `StackFrame` - Function call frame with params, locals, and return value
- `ConceptType` - Algorithm pattern types (hash-map, two-pointers, bit-manipulation, etc.)
- `ConceptStep` - Single step in algorithm visualization with visual state

## SEO & Metadata

- Static metadata in `src/app/layout.tsx`
- Dynamic OpenGraph images via `opengraph-image.tsx` in route segments
- Sitemap generation in `src/app/sitemap.ts`
- Robots configuration in `src/app/robots.ts`
- JSON-LD structured data for Website, EducationalOrganization, and SoftwareApplication

## Deployment

- **Platform**: Vercel
- **Config**: `vercel.json` (framework: nextjs)
- **Build Output**: `.next/` directory

## Security Considerations

- Code validation in `parser.ts` checks for restricted patterns (fetch, require, import)
- No user data persistence; all execution happens client-side
- Monaco Editor runs in sandboxed iframe context

## Commit & Pull Request Guidelines

- Commit messages: short, imperative, sentence case (e.g., "Add concept visualizations", "Fix Vercel config")
- PRs should include:
  - Clear summary of changes
  - Screenshots for UI changes
  - Confirmation that tests pass (`npm run test:run`, `npm run lint`)
