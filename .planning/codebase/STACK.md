# Technology Stack

**Analysis Date:** 2026-01-23

## Languages

**Primary:**
- TypeScript 5.5 - All source code, components, and engine logic
- JavaScript - Build and configuration files

**Secondary:**
- CSS - Styling with CSS Modules (`.module.css` pattern)

## Runtime

**Environment:**
- Node.js (specified in package.json dependencies)
- Browser runtime (ES2017 target with DOM APIs)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.0 - Full-stack React framework with App Router
- React 18.3.1 - UI component library
- React DOM 18.3.1 - DOM rendering

**State Management:**
- Zustand 4.5.2 - Lightweight store management in `src/store/executionStore.ts`
- Immer 10.0.4 - Immutable state updates

**Visualization & Animation:**
- Framer Motion 11.0.0 - Component animations and transitions
- Lucide React 0.400.0 - Icon library

**Code Editing:**
- Monaco Editor (@monaco-editor/react 4.6.0) - Code editor component in CodeEditor

**Parsing & Interpretation:**
- Acorn 8.11.3 - JavaScript AST parser in `src/engine/parser.ts`
- Acorn-walk 8.3.2 - AST traversal utility used in interpreter

## Key Dependencies

**Critical:**
- `acorn` - Parses user-written JavaScript code to AST for step-by-step execution
- `zustand` - Manages execution state (code, steps, breakpoints, console output)
- `framer-motion` - Powers visualization animations and transitions
- `@monaco-editor/react` - Provides in-browser code editing experience

**Infrastructure:**
- `next` - Serves pages, handles routing, provides SSR/SSG
- `lucide-react` - UI icons throughout the app

## Configuration

**Environment:**
- No `.env` files detected in repository
- Google Analytics ID hardcoded: `G-W2VCY1D7Y7` in `src/components/Analytics.tsx`
- Vercel deployment configuration: `vercel.json` with `framework: nextjs`

**Build:**
- `next.config.js` - Next.js configuration with React strict mode enabled
- `tsconfig.json` - TypeScript configuration targeting ES2017, with path alias `@/*` → `src/*`

**Development:**
- `vitest.config.ts` - Test runner configuration
  - Environment: jsdom
  - Setup file: `src/__tests__/setup.ts`
  - Test discovery: `src/**/*.test.{ts,tsx}`
  - Coverage provider: v8
  - Coverage reporters: text, json, html

## Platform Requirements

**Development:**
- TypeScript ~5.5.0 (strict mode required)
- Node.js with npm
- jsdom for test environment (for DOM simulation)

**Production:**
- Deployment target: Vercel (indicated by `vercel.json`)
- Next.js 14 compatible hosting
- Modern browsers with ES2017 support (Arrow functions, async/await, classes, etc.)

---

*Stack analysis: 2026-01-23*
