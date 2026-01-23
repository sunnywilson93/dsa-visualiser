# Codebase Structure

**Analysis Date:** 2026-01-23

## Directory Layout

```
src/
├── app/                           # Next.js App Router pages and layouts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (/)
│   ├── [categoryId]/             # Dynamic problem category routes
│   │   ├── page.tsx              # Category listing page
│   │   ├── CategoryPageClient.tsx # Client component with search, filtering
│   │   └── [problemId]/          # Individual problem practice page
│   │       ├── page.tsx
│   │       ├── PracticePageClient.tsx
│   │       ├── page.module.css
│   │       └── concept/          # Algorithm concept visualization
│   │           ├── page.tsx
│   │           └── ConceptVizPageClient.tsx
│   ├── concepts/                 # JS concept learning pages
│   │   ├── page.tsx              # Concepts overview
│   │   ├── layout.tsx
│   │   ├── js/                   # JS concepts category
│   │   │   └── page.tsx
│   │   ├── dsa/                  # DSA concepts category
│   │   │   ├── page.tsx
│   │   │   └── [conceptId]/
│   │   │       ├── page.tsx
│   │   │       └── DSAConceptPageClient.tsx
│   │   └── [conceptId]/          # JS concept detail pages
│   │       ├── page.tsx
│   │       └── ConceptPageClient.tsx
│   ├── js-problems/              # All JS problems listing
│   │   ├── page.tsx
│   │   └── JSProblemsPageClient.tsx
│   ├── playground/               # Interactive playgrounds
│   │   └── event-loop/           # Event loop visualizer
│   │       ├── page.tsx
│   │       └── EventLoopPlaygroundClient.tsx
│   ├── robots.ts                 # SEO robots file
│   └── sitemap.ts                # SEO sitemap generation
│
├── components/                   # Reusable React components
│   ├── CallStack/               # Execution call stack display
│   │   ├── CallStack.tsx
│   │   └── index.ts
│   ├── CodeEditor/              # Monaco code editor integration
│   │   ├── CodeEditor.tsx
│   │   ├── CodeEditor.module.css
│   │   └── index.ts
│   ├── Console/                 # Console output display
│   │   ├── Console.tsx
│   │   └── index.ts
│   ├── Controls/                # Playback controls (play, pause, step)
│   │   ├── Controls.tsx
│   │   └── index.ts
│   ├── Variables/               # Variable inspector display
│   │   ├── Variables.tsx
│   │   └── index.ts
│   ├── Visualization/           # Data structure visualizations
│   │   ├── ArrayVisualization.tsx
│   │   ├── BinaryVisualization.tsx
│   │   ├── VisualizationPanel.tsx
│   │   ├── Visualization.module.css
│   │   └── index.ts
│   ├── Concepts/                # JS concept visualizations
│   │   ├── HoistingViz.tsx
│   │   ├── ClosuresViz.tsx
│   │   ├── EventLoopViz.tsx
│   │   ├── PrototypesViz.tsx
│   │   ├── ThisKeywordViz.tsx
│   │   ├── RecursionViz.tsx
│   │   ├── (other concept vizs...)
│   │   └── index.ts
│   ├── ConceptPanel/            # Algorithm concept visualizers
│   │   ├── ConceptPanel.tsx
│   │   ├── HashMapConcept.tsx
│   │   ├── TwoPointersConcept.tsx
│   │   ├── BitManipulationConcept.tsx
│   │   └── index.ts
│   ├── DSAConcepts/             # Data structure visualizations
│   │   ├── ArrayViz.tsx
│   │   ├── StackViz.tsx
│   │   ├── QueueViz.tsx
│   │   ├── LinkedListViz.tsx
│   │   ├── HashTableViz.tsx
│   │   ├── BigOViz.tsx
│   │   └── index.ts
│   ├── NavBar/                  # Navigation bar
│   │   ├── NavBar.tsx
│   │   └── index.ts
│   ├── Search/                  # Global and page search
│   │   ├── GlobalSearch.tsx
│   │   ├── PageSearch.tsx
│   │   ├── PageSearchControls.tsx
│   │   ├── SearchResults.tsx
│   │   └── index.ts
│   ├── CategoryCarousel/        # Scrollable category cards
│   │   ├── CategoryCarousel.tsx
│   │   └── index.ts
│   ├── ConceptCarousel/         # Concept cards carousel
│   │   ├── ConceptCarousel.tsx
│   │   └── index.ts
│   ├── ProblemCard/             # Individual problem card
│   │   ├── ProblemCard.tsx
│   │   └── index.ts
│   ├── ProblemListingLayout/    # Shared layout for problem listings
│   │   ├── ProblemListingLayout.tsx
│   │   └── index.ts
│   ├── DifficultyIndicator/     # Difficulty badge (easy/medium/hard)
│   │   ├── DifficultyIndicator.tsx
│   │   └── index.ts
│   ├── Icons/                   # SVG icons
│   │   ├── ConceptIcon.tsx
│   │   └── index.ts
│   ├── ErrorBoundary/           # Error boundary wrapper
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── ExampleSelector/         # Example code selector
│   │   ├── ExampleSelector.tsx
│   │   └── index.ts
│   ├── ExpandableGrid/          # Expandable grid layout
│   │   ├── ExpandableGrid.tsx
│   │   └── index.ts
│   ├── EventLoopPlayground/     # Event loop playground
│   │   ├── EventLoopDisplay.tsx
│   │   ├── PlaygroundEditor.tsx
│   │   └── index.ts
│   ├── StepDescription/         # Current step description
│   │   ├── StepDescription.tsx
│   │   └── index.ts
│   ├── Analytics.tsx            # Analytics wrapper
│   ├── ScrollToTop.tsx          # Scroll to top button
│   ├── StructuredData.tsx       # JSON-LD structured data
│   └── index.ts                # Component barrel export
│
├── engine/                      # JavaScript interpreter engine
│   ├── interpreter.ts          # Main interpreter (AST walker)
│   ├── parser.ts               # Code parser (wrapper around Acorn)
│   ├── runtime.ts              # Runtime value creators and utilities
│   ├── eventLoopAnalyzer.ts    # Event loop analysis for visualization
│   ├── languageDetector.ts     # Language detection (JS vs other)
│   ├── errorFormatter.ts       # Format execution errors
│   ├── interpreter.test.ts     # Interpreter tests
│   ├── eventLoopAnalyzer.test.ts
│   ├── languageDetector.test.ts
│   └── index.ts               # Engine barrel export
│
├── data/                       # Static content and definitions
│   ├── examples.ts            # Code problems (all categories)
│   ├── concepts.ts            # JS concepts (closures, hoisting, etc.)
│   ├── algorithmConcepts.ts   # Algorithm pattern visualizations
│   └── dsaConcepts.ts         # DSA data structures reference
│
├── store/                      # State management
│   ├── executionStore.ts      # Zustand execution state store
│   └── index.ts               # Store barrel export
│
├── types/                      # TypeScript type definitions
│   └── index.ts               # All types (ExecutionStep, RuntimeValue, etc.)
│
├── lib/                        # Utilities and helpers
│   └── search/                # Search functionality
│       ├── searchUtils.ts    # Search algorithms
│       ├── useSearch.ts      # Search hook
│       ├── types.ts          # Search types
│       └── index.ts
│
└── __tests__/                 # Test setup and test flows
    ├── setup.ts               # Vitest + jsdom setup
    └── flows/                 # Integration test flows

public/
├── (static assets - images, fonts, etc.)

.planning/
├── codebase/                  # This analysis
│   ├── ARCHITECTURE.md
│   └── STRUCTURE.md
```

## Directory Purposes

**`src/app/`**
- Purpose: Page routing and layouts using Next.js App Router
- Contains: Server and client page components, dynamic routes
- Key files: Root `layout.tsx` wraps all pages; each route has `page.tsx` entry point
- Pattern: "PageClient.tsx" suffix indicates client component; `page.tsx` wrapper for static/SSR

**`src/components/`**
- Purpose: Reusable React components, organized by feature/domain
- Contains: UI elements, visualizations, concept demos, navigation
- Key structure: Each component in its own folder with `index.ts` barrel export
- Pattern: Large components like `Concepts/` have multiple sub-components

**`src/engine/`**
- Purpose: Core JavaScript interpreter - parses code and executes step-by-step
- Contains: AST parser, interpreter state machine, runtime value abstractions
- Key files: `interpreter.ts` (main), `parser.ts` (Acorn wrapper), `runtime.ts` (value creators)
- Tests: Colocated `.test.ts` files

**`src/data/`**
- Purpose: Static content - problems, concepts, algorithm patterns
- Contains: Declarative data structures (arrays of examples, concepts, visualizations)
- Key files: `examples.ts` (problem catalog), `concepts.ts` (learning content), `algorithmConcepts.ts` (visualization patterns)
- Pattern: No logic; pure data definitions

**`src/store/`**
- Purpose: State management using Zustand
- Contains: Execution state store with actions for code, stepping, breakpoints
- Key files: `executionStore.ts` (single store + hook selectors)
- Pattern: Actions modify state; components subscribe via hooks

**`src/types/`**
- Purpose: Centralized TypeScript type definitions
- Contains: All types (ExecutionStep, RuntimeValue, Concept, etc.)
- Key file: `index.ts` (single file with all exports)
- Pattern: Types describe shape of execution state, runtime values, content

**`src/lib/`**
- Purpose: Utility libraries and helpers
- Contains: Search functionality, hooks, helper functions
- Key structure: `search/` subfolder for search-specific utils

**`src/__tests__/`**
- Purpose: Test setup and integration test flows
- Contains: Vitest configuration, test utilities, example test flows
- Key file: `setup.ts` (jsdom setup)

## Key File Locations

**Entry Points:**
- `src/app/page.tsx` - Home page (3 learning sections)
- `src/app/layout.tsx` - Root layout wrapper
- `src/app/[categoryId]/[problemId]/PracticePageClient.tsx` - Problem practice
- `src/app/concepts/[conceptId]/ConceptPageClient.tsx` - Concept detail

**Core Logic:**
- `src/engine/interpreter.ts` - AST execution engine (600+ lines)
- `src/store/executionStore.ts` - State management (266 lines)
- `src/engine/runtime.ts` - Runtime value factories

**Configuration:**
- `src/types/index.ts` - All TypeScript types
- `package.json` - Dependencies (Next.js, React, Zustand, Acorn, Monaco)
- `tsconfig.json` - TS config with path alias `@/` → `src/`

**Content:**
- `src/data/examples.ts` - Problem catalog
- `src/data/concepts.ts` - JS concepts with explanations
- `src/data/algorithmConcepts.ts` - Algorithm visualizations

**Testing:**
- `src/__tests__/setup.ts` - Vitest setup
- `src/engine/interpreter.test.ts` - Interpreter tests
- Any `*.test.ts` or `*.test.tsx` files

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention)
- Client components: `*Client.tsx` (for `'use client'` markers)
- Components: `PascalCase.tsx` (e.g., `HoistingViz.tsx`)
- Styles: `*.module.css` (CSS Modules)
- Tests: `*.test.ts` or `*.test.tsx`
- Exports/barrels: `index.ts`

**Directories:**
- Components: PascalCase (e.g., `CallStack/`, `CodeEditor/`)
- Features/layers: camelCase (e.g., `concepts/`, `engine/`, `store/`)
- Route segments: square brackets for dynamic (e.g., `[categoryId]/`)

**Exports:**
- Components use barrel exports via `index.ts`
- Example: `import { CallStack } from '@/components/CallStack'` resolves to `src/components/CallStack/index.ts`

## Where to Add New Code

**New JavaScript Concept:**
1. Add concept definition to `src/data/concepts.ts` (id, title, examples, keyPoints, etc.)
2. Create visualization component: `src/components/Concepts/[YourConcept]Viz.tsx`
3. Add import to visualizations map in `src/app/concepts/[conceptId]/ConceptPageClient.tsx` (lazy import via `dynamic()`)
4. Component follows pattern: import hooks, use `useExecutionStore` to set example code

**New Problem Category:**
1. Add category to `exampleCategories` in `src/data/examples.ts`
2. Add problems to `codeExamples[]` with matching `category` field
3. Route automatically available at `/[categoryId]` via dynamic route
4. If DSA problem, optionally add algorithm concept to `src/data/algorithmConcepts.ts`

**New Algorithm Visualization:**
1. Define `ProblemConcept` in `src/data/algorithmConcepts.ts` with steps and visual state
2. Map problem ID in `getConceptForProblem()` function
3. Create component if needed (or reuse `ConceptPanel.tsx` with pattern type)
4. Component automatically linked from practice page

**New Utility/Helper:**
1. Pure functions: `src/lib/[feature]/[util].ts`
2. Custom hooks: `src/lib/[feature]/use[Hook].ts` or in respective feature folder
3. Currently no `src/hooks/` folder - hooks live in component/lib folders

**New Component:**
1. Create folder: `src/components/[ComponentName]/`
2. Main file: `src/components/[ComponentName]/[ComponentName].tsx`
3. Styles: `src/components/[ComponentName]/[ComponentName].module.css` (CSS Modules)
4. Export: `src/components/[ComponentName]/index.ts` (barrel export)
5. Add to `src/components/index.ts` if widely used

**New Test:**
1. Co-locate with source: `src/engine/[module].test.ts` next to `src/engine/[module].ts`
2. Import from `src/__tests__/setup.ts` for test utilities
3. Run: `npm test` or `npm test -- [filename].test.ts`

## Special Directories

**`src/__tests__/`:**
- Purpose: Shared test utilities and integration test flows
- Generated: No (manually created)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output (dev cache and production build)
- Generated: Yes (by `npm run build` or dev server)
- Committed: No

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (by npm/package manager)
- Committed: No

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: No (manually created by analysis)
- Committed: Yes (planning reference)

---

*Structure analysis: 2026-01-23*
