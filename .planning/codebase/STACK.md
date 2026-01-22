# Technology Stack

**Analysis Date:** 2026-01-22

## Languages

**Primary:**
- TypeScript 5.5 - All source code, components, and engine logic
- JSX - React component definitions in `.tsx` files
- JavaScript - Client-side code execution and visualization

**Secondary:**
- CSS Modules - Component styling (`*.module.css`)
- HTML - Metadata and structured data (JSON-LD)

## Runtime

**Environment:**
- Node.js - Development and build environment
- Web Browser - Client-side execution (ES2017+)

**Package Manager:**
- npm - Dependency management
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.0 - Full-stack React framework with App Router
- React 18.3.1 - UI component library
- Zustand 4.5.2 - State management (executionStore for interpreter state)

**UI/Visualization:**
- Framer Motion 11.0.0 - Animation library for smooth transitions
- Lucide React 0.400.0 - Icon library
- @monaco-editor/react 4.6.0 - Code editor component integration

**Code Analysis:**
- Acorn 8.11.3 - JavaScript parser (AST generation from source code)
- Acorn-walk 8.3.2 - AST tree walker for interpretation
- Immer 10.0.4 - Immutable state updates

**Testing:**
- Vitest 4.0.16 - Fast unit test runner
- @testing-library/react 16.3.1 - React component testing utilities
- @testing-library/jest-dom 6.9.1 - DOM matchers
- @testing-library/user-event 14.6.1 - User interaction simulation
- jsdom 27.4.0 - DOM environment for tests
- @vitest/coverage-v8 4.0.16 - Code coverage reporting

**Build/Dev:**
- TypeScript 5.5 - Type checking and transpilation
- @vitejs/plugin-react 4.3.1 - Vite React integration for tests
- ESLint 8.57.0 - Linting (`next lint`)
- eslint-config-next 14.2.0 - Next.js ESLint configuration

## Key Dependencies

**Critical:**
- `acorn` & `acorn-walk` - Parse JavaScript code to AST and walk the tree for step-by-step execution
- `zustand` - Manage interpreter execution state (code, AST, execution steps, current step index)
- `@monaco-editor/react` - Code editor UI for writing and debugging JavaScript
- `framer-motion` - Animation for visualizations and UI interactions

**Infrastructure:**
- `next` - Server-side rendering, routing, and deployment preparation
- `react` & `react-dom` - Component rendering and DOM updates

## Configuration

**Environment:**
- Configured via Next.js metadata API in `src/app/layout.tsx`
- Google Analytics enabled via environment variable `GA_MEASUREMENT_ID` (hardcoded as `G-W2VCY1D7Y7`)
- Google Search Console verification enabled
- No `.env` file required for core functionality

**Build:**
- TypeScript config: `tsconfig.json`
  - Target: ES2017
  - Strict mode enabled
  - Path alias: `@/*` → `src/*`
  - Module: ESNext
  - JSX: preserve (processed by Next.js)
- Vitest config: `vitest.config.ts`
  - Environment: jsdom
  - Setup file: `src/__tests__/setup.ts`
  - Coverage provider: v8
- Next.js config: `next.config.js`
  - React Strict Mode enabled
  - Default configuration

## Platform Requirements

**Development:**
- Node.js (version not locked, npm latest)
- TypeScript 5.5 compatible environment
- Browser with ES2017 support

**Production:**
- Deployment target: Vercel (`.vercel/` directory present)
- Static site generation + SSR via Next.js
- Browser requirements: Modern JavaScript support (closures, async/await, Promises, prototypes)
- No backend server required (client-side only after initial HTML)
- No database required (static content + client-side state)

## Build Output

**Development:**
```bash
npm run dev           # Start Next.js dev server on port 3000
```

**Production:**
```bash
npm run build         # Next.js production build → .next/
npm start            # Start production server
npm run lint         # ESLint + Next.js lint checks
```

**Testing:**
```bash
npm test             # Vitest watch mode
npm run test:run     # Single test run (CI mode)
npm run test:coverage # Generate coverage report
```

---

*Stack analysis: 2026-01-22*
