# Codebase Structure

**Analysis Date:** 2026-01-22

## Directory Layout

```
src/
├── app/                           # Next.js App Router pages and layouts
│   ├── layout.tsx                 # Root layout (metadata, Analytics)
│   ├── page.tsx                   # Home page (category grid, concept overview)
│   ├── robots.ts                  # robots.txt generation
│   ├── sitemap.ts                 # sitemap.xml generation
│   ├── [categoryId]/              # Dynamic category pages (e.g., /arrays-hashing)
│   │   ├── page.tsx               # Server component
│   │   ├── CategoryPageClient.tsx # Client component (filtering, problem list)
│   │   └── [problemId]/           # Dynamic problem pages
│   │       ├── page.tsx           # Server component
│   │       ├── PracticePageClient.tsx # Client component (editor + debugger)
│   │       └── concept/           # Concept visualization for specific problem
│   │           ├── page.tsx       # Server component
│   │           └── ConceptVizPageClient.tsx # Client component
│   ├── concepts/                  # JavaScript concept pages
│   │   ├── layout.tsx             # Concepts section layout
│   │   ├── page.tsx               # Concepts overview
│   │   ├── js/                    # JavaScript concepts listing
│   │   │   └── page.tsx
│   │   ├── dsa/                   # DSA concepts listing
│   │   │   ├── page.tsx
│   │   │   └── [conceptId]/       # Individual concept page
│   │   │       ├── page.tsx
│   │   │       └── DSAConceptPageClient.tsx
│   │   └── [conceptId]/           # Individual JS concept page
│   │       ├── page.tsx
│   │       └── ConceptPageClient.tsx
│   ├── js-problems/               # All JavaScript problems listing
│   │   ├── page.tsx
│   │   └── JSProblemsPageClient.tsx
│   └── playground/                # Interactive playgrounds
│       └── event-loop/            # Event loop visualization
│           ├── page.tsx
│           └── EventLoopPlaygroundClient.tsx
├── components/                    # React components
│   ├── index.ts                   # Barrel export
│   ├── Analytics.tsx              # Google Analytics wrapper
│   ├── ErrorBoundary/             # Error boundary wrapper
│   ├── NavBar/                    # Top navigation
│   ├── ScrollToTop.tsx            # Scroll-to-top on route change
│   ├── StructuredData.tsx         # SEO structured data (JSON-LD)
│   ├── CodeEditor/                # Monaco editor wrapper
│   │   ├── CodeEditor.tsx         # Editor with breakpoints, syntax highlighting
│   │   ├── CodeEditor.module.css
│   │   └── index.ts
│   ├── CallStack/                 # Execution call stack display
│   ├── Variables/                 # Variable scope display
│   ├── Console/                   # Console output display
│   ├── Controls/                  # Playback controls (play, step, etc.)
│   ├── StepDescription/           # Human-readable step descriptions
│   ├── Visualization/             # Data structure visualization panels
│   │   ├── VisualizationPanel.tsx # Main visualization switcher
│   │   ├── ArrayVisualization.tsx # Array/sorted data viz
│   │   ├── BinaryVisualization.tsx # Binary/bit operation viz
│   │   └── index.ts
│   ├── ConceptPanel/              # Algorithm visualization panels
│   │   ├── ConceptPanel.tsx       # Main concept player (controls, animations)
│   │   ├── TwoPointersConcept.tsx # Two-pointer animation
│   │   ├── BitManipulationConcept.tsx # Bit operation animation
│   │   ├── HashMapConcept.tsx     # Hash map operation animation
│   │   └── index.ts
│   ├── Concepts/                  # JavaScript concept visualizations
│   │   ├── HoistingViz.tsx        # Hoisting visualization
│   │   ├── ClosuresViz.tsx        # Closures explanation
│   │   ├── EventLoopViz.tsx       # Event loop diagram
│   │   ├── PromisesViz.tsx        # Promise states & microtasks
│   │   ├── PrototypesViz.tsx      # Prototype chain
│   │   ├── ThisKeywordViz.tsx     # This binding rules
│   │   ├── AsyncEvolutionViz.tsx  # Async/await evolution
│   │   ├── MemoryModelViz.tsx     # Stack vs heap
│   │   ├── ... (27 more concept visualizations)
│   │   └── index.ts
│   ├── DSAConcepts/               # DSA concept visualizations
│   │   ├── ArrayViz.tsx           # Array structure
│   │   ├── HashTableViz.tsx       # Hash table internals
│   │   ├── LinkedListViz.tsx      # Linked list structure
│   │   ├── StackViz.tsx           # Stack operations
│   │   ├── QueueViz.tsx           # Queue operations
│   │   ├── BigOViz.tsx            # Time/space complexity
│   │   ├── BinarySystemViz.tsx    # Binary number system
│   │   └── index.ts
│   ├── CategoryCarousel/          # Horizontal scrollable category cards
│   ├── ConceptCarousel/           # Horizontal scrollable concept cards
│   ├── ProblemCard/               # Individual problem card component
│   ├── ProblemListingLayout/      # Shared problem list with sorting
│   ├── ExampleSelector/           # Dropdown to select code examples
│   ├── ExpandableGrid/            # Auto-expanding grid layout
│   ├── Icons/                     # SVG icon components
│   ├── DifficultyIndicator/       # Easy/Medium/Hard badge
│   ├── EventLoopPlayground/       # Event loop playground components
│   └── Search/                    # Global and page search
│       ├── GlobalSearch.tsx
│       ├── PageSearch.tsx
│       ├── PageSearchControls.tsx
│       └── SearchResults.tsx
├── engine/                        # JavaScript execution engine
│   ├── index.ts                   # Barrel export
│   ├── parser.ts                  # Acorn wrapper (parseCode, validateCode, getNodeLocation)
│   ├── interpreter.ts             # AST executor (createInterpreter)
│   ├── runtime.ts                 # Runtime value constructors & utilities
│   ├── errorFormatter.ts          # Format execution errors for display
│   ├── eventLoopAnalyzer.ts       # Analyze microtask queue operations
│   ├── languageDetector.ts        # Detect JavaScript version/features
│   ├── interpreter.test.ts        # Interpreter unit tests
│   ├── eventLoopAnalyzer.test.ts  # Event loop analyzer tests
│   └── languageDetector.test.ts   # Language detector tests
├── store/                         # Zustand state management
│   ├── index.ts                   # Barrel export
│   └── executionStore.ts          # Main execution store (code, AST, steps, breakpoints, playback)
├── data/                          # Static content & configuration
│   ├── examples.ts                # JavaScript problem definitions (codeExamples array)
│   ├── concepts.ts                # JavaScript concept explanations (concepts array)
│   ├── dsaConcepts.ts             # DSA concept definitions
│   ├── algorithmConcepts.ts       # Problem-specific algorithm visualizations (problemConcepts)
│   └── ...other data files
├── lib/                           # Utility functions & hooks
│   ├── search/                    # Search functionality
│   │   ├── index.ts
│   │   ├── searchUtils.ts         # Search filtering logic
│   │   ├── types.ts               # Search type definitions
│   │   └── useSearch.ts           # useSearch hook
│   └── ...other utilities
├── types/                         # TypeScript type definitions
│   └── index.ts                   # Central types file (ExecutionStep, RuntimeValue, etc.)
├── __tests__/                     # Test utilities and fixtures
│   ├── setup.ts                   # Vitest setup (jsdom, React)
│   └── flows/                     # Integration test flows
├── index.css                      # Global styles
└── hooks/                         # Custom React hooks (if any)
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and route handling
- Contains: Page components, layouts, route segments
- Key files: `page.tsx` (pages), `layout.tsx` (layouts), `[dynamic].tsx` (dynamic segments)

**`src/components/`:**
- Purpose: Reusable React UI components
- Contains: Feature components (CodeEditor, CallStack, Variables), visualization components, page layouts
- Key files: Each component has a folder with `.tsx`, `.module.css`, and `index.ts` (barrel export)

**`src/engine/`:**
- Purpose: JavaScript execution engine (parser + interpreter)
- Contains: Code parsing, AST execution, runtime value tracking, error formatting
- Key files: `parser.ts` (Acorn wrapper), `interpreter.ts` (AST walker), `runtime.ts` (value types)

**`src/store/`:**
- Purpose: Zustand state management
- Contains: Centralized store for execution state, code, steps, playback
- Key files: `executionStore.ts` (main store with 250+ lines of state + actions)

**`src/data/`:**
- Purpose: Static problem, concept, and visualization definitions
- Contains: Problem code examples, concept explanations, algorithm visualization step sequences
- Key files: `examples.ts` (problems), `concepts.ts` (JS concepts), `algorithmConcepts.ts` (visualizations)

**`src/types/`:**
- Purpose: Central TypeScript type definitions
- Contains: ExecutionStep, RuntimeValue, Scope, StackFrame, ConceptStep, etc.
- Key files: `index.ts` (all types, 300+ lines)

**`src/lib/`:**
- Purpose: Utility functions and custom hooks
- Contains: Search logic, shared utilities
- Key files: Organized by feature (search/, etc.)

**`src/__tests__/`:**
- Purpose: Test setup and fixtures
- Contains: Vitest configuration, test utilities, integration test flows
- Key files: `setup.ts` (browser environment setup)

## Key File Locations

**Entry Points:**

- `src/app/layout.tsx` - Root layout (metadata, Analytics component)
- `src/app/page.tsx` - Home page (home: `/`)
- `src/app/[categoryId]/page.tsx` - Category listing (e.g.: `/arrays-hashing`)
- `src/app/[categoryId]/[problemId]/page.tsx` - Practice page (e.g.: `/arrays-hashing/two-sum`)
- `src/app/concepts/page.tsx` - Concepts overview (e.g.: `/concepts`)
- `src/app/concepts/[conceptId]/page.tsx` - Individual JS concept (e.g.: `/concepts/closures`)

**Core Execution Logic:**

- `src/engine/parser.ts` - Code parsing via Acorn
- `src/engine/interpreter.ts` - AST execution (step-by-step)
- `src/engine/runtime.ts` - Runtime value types and utilities
- `src/store/executionStore.ts` - Zustand store (state hub)

**Configuration & Data:**

- `src/data/examples.ts` - Problem definitions (codeExamples array)
- `src/data/concepts.ts` - JavaScript concepts (concepts array)
- `src/data/algorithmConcepts.ts` - Algorithm visualizations (problemConcepts map)
- `src/types/index.ts` - TypeScript type definitions

**UI Components:**

- `src/components/CodeEditor/CodeEditor.tsx` - Monaco editor integration
- `src/components/CallStack/CallStack.tsx` - Stack frames display
- `src/components/Variables/Variables.tsx` - Scope variables display
- `src/components/Console/Console.tsx` - Console output display
- `src/components/Controls/Controls.tsx` - Playback controls
- `src/components/Visualization/VisualizationPanel.tsx` - Visualization switcher
- `src/components/ConceptPanel/ConceptPanel.tsx` - Algorithm concept animator

**Testing:**

- `src/engine/interpreter.test.ts` - Interpreter unit tests
- `src/__tests__/setup.ts` - Vitest configuration (jsdom)

## Naming Conventions

**Files:**

- Page components: `page.tsx` (Next.js convention)
- Client components: `*PageClient.tsx` or `*Client.tsx` with `'use client'` directive
- Feature components: `FeatureName.tsx` (PascalCase)
- Styles: `FeatureName.module.css` (CSS Modules)
- Barrel exports: `index.ts` (re-exports component)
- Tests: `*.test.ts` or `*.test.tsx` (Vitest convention)
- Type definitions: `*.ts` (usually in `src/types/index.ts`)

**Directories:**

- Component folders: PascalCase (`CodeEditor/`, `CallStack/`)
- Feature folders: kebab-case (`concepts/`, `dsa/`)
- Type folders: kebab-case (`__tests__/`)

**JavaScript/TypeScript:**

- Component names: PascalCase (`CodeEditor`, `CallStack`)
- Functions/hooks: camelCase (`parseCode`, `useCurrentStep`)
- Constants: UPPER_SNAKE_CASE (`MAX_STEPS`, `EXAMPLE_CODE`)
- Types/Interfaces: PascalCase (`ExecutionStep`, `RuntimeValue`)
- CSS classes: kebab-case (via CSS Modules)

## Where to Add New Code

**New Feature (e.g., Step Filtering):**
- Primary code: `src/components/Features/FeatureName.tsx`
- Store additions (if needed): Add to `src/store/executionStore.ts` (state + actions)
- Tests: `src/components/Features/FeatureName.test.tsx`

**New Component/Module:**
- Implementation: `src/components/ComponentName/ComponentName.tsx`
- Styles: `src/components/ComponentName/ComponentName.module.css`
- Export: `src/components/ComponentName/index.ts` (barrel export)
- Tests (if critical): `src/components/ComponentName/ComponentName.test.tsx`

**New Engine Feature (e.g., Custom Operations):**
- Interpreter logic: `src/engine/interpreter.ts` (add case in node visitor)
- Runtime support: `src/engine/runtime.ts` (add value type if needed)
- Tests: `src/engine/interpreter.test.ts`

**Utilities/Helpers:**
- Shared utilities: `src/lib/` (create feature folder if grouping related functions)
- Custom hooks: `src/lib/hooks/` (e.g., `useSearch.ts`)

**Static Content (Problems, Concepts):**
- Problems: Add to `src/data/examples.ts` (codeExamples array)
- Concepts: Add to `src/data/concepts.ts` or `src/data/dsaConcepts.ts`
- Algorithm visualizations: Add to `src/data/algorithmConcepts.ts` (problemConcepts map)
- Types for new data: Update `src/types/index.ts`

## Special Directories

**`src/__tests__/`:**
- Purpose: Test infrastructure and test utilities
- Generated: No
- Committed: Yes
- Contents: Vitest setup, test fixtures, integration test flows

**`.next/`:**
- Purpose: Next.js build output (git-ignored)
- Generated: Yes (by `npm run build`)
- Committed: No

**`node_modules/`:**
- Purpose: npm dependencies (git-ignored)
- Generated: Yes (by `npm install`)
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents
- Generated: Yes (by `/gsd:map-codebase`)
- Committed: No (typically)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

## Code Organization Patterns

**Component Structure (Client Components):**
```
ComponentName/
├── ComponentName.tsx         # Main component logic (with 'use client')
├── ComponentName.module.css  # Scoped styles
└── index.ts                  # Barrel export (export { ComponentName })
```

**Page Structure (Server + Client):**
```
[dynamic-segment]/
├── page.tsx                  # Server component (metadata, data fetching)
└── PageNameClient.tsx        # Client component ('use client', interactivity)
```

**Feature Folder (Complex Feature):**
```
FeatureName/
├── FeatureName.tsx           # Main component
├── FeatureName.module.css
├── FeatureName.test.tsx      # Unit tests
├── hooks/                    # Feature-specific hooks
└── index.ts                  # Barrel export
```

---

*Structure analysis: 2026-01-22*
