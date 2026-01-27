# DSA Visualiser - Enhanced Concept Visualizations

## What This Is

A visual learning platform for JavaScript concepts and DSA interview preparation. Features interactive step-through visualizations for both JS concepts (Variables, Functions, Arrays, Objects, Loops) and DSA patterns (Two Pointers, Hash Map, Bit Manipulation).

## Core Value

Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood — not just reading about them.

## Current Milestone: v2.0 Design System Foundation

**Goal:** Establish Tailwind v4 `@theme` as the single source of truth for all design tokens, with existing CSS Modules resolving from it.

**Target features:**
- Configure Tailwind v4 CSS-first (`@import "tailwindcss"`, `@theme` block, delete `tailwind.config.js`)
- Map all 246 design tokens (colors, spacing, typography, shadows, radius, animations) to `@theme` namespaces
- Existing CSS Module `var()` references continue working via `@theme`-generated custom properties
- Remove `autoprefixer`, install `clsx`
- Maintain visual parity — no user-facing changes

## Requirements

### Validated

- ✓ Custom JavaScript interpreter with step-by-step execution — v1.0
- ✓ 28 JS concept pages with visualizations — v1.0
- ✓ Rich EventLoopViz with step controls, code highlighting, queues — v1.0
- ✓ Problem practice pages with code editor and debugger — v1.0
- ✓ Enhanced VariablesViz with step-through, hoisting, TDZ, scope chain — v1.0
- ✓ Enhanced FunctionsViz with execution context, call stack, this binding — v1.0
- ✓ Enhanced ArraysBasicsViz with reference semantics, spread, method iteration — v1.0
- ✓ Enhanced ObjectsBasicsViz with references, mutation, destructuring — v1.0
- ✓ Enhanced LoopsViz with iteration stepping, closure capture visualization — v1.0
- ✓ SharedViz components (CodePanel, StepControls, StepProgress) — v1.0
- ✓ TwoPointersViz with pattern page, difficulty levels, variants — v1.1
- ✓ HashMapViz with bucket visualization, frequency counting — v1.1
- ✓ BitManipulationViz with binary grid, bit operations — v1.1
- ✓ Mobile responsive layouts (phone, tablet, desktop) — v1.2
- ✓ Consistent headers on DSA pattern pages — v1.2
- ✓ Bidirectional cross-linking (pattern ↔ problem pages) — v1.2
- ✓ SEO meta tags and OpenGraph images — v1.2

### Active

(Defined in REQUIREMENTS.md)

### Out of Scope

- New DSA patterns (Sliding Window, Binary Search, etc.) — future milestone
- Interpreter feature additions — unless needed for visualizations
- Advanced interactivity (prediction prompts, quizzes) — future milestone
- Visual redesign — migration must maintain current appearance

## Context

**Current state:**
- Full platform complete (JS concepts + DSA patterns + responsive + SEO)
- 74 CSS Module files (~25,000 lines) across components
- 246 CSS custom properties in globals.css (colors, spacing, typography, shadows)
- 8,500+ var() references across module files
- Tailwind v4.1.18 installed but using v3 syntax (tailwind.config.js, @tailwind directives)
- Zero Tailwind utility classes in TSX files
- Framer Motion for animations
- CSS-only responsive patterns (media queries, checkbox hack for mobile nav)
- 17 dynamic bracket-notation class accesses (styles[variable])
- 284 template literal className compositions

**Gap:** Design system scattered across 74 CSS Modules and 246 CSS variables. No single source of truth for design tokens. Tailwind v4 `@theme` consolidates tokens into one place. v2.0 establishes the foundation; component migration deferred to v2.1+.

## Constraints

- **Tech stack**: React + TypeScript + Framer Motion + Tailwind v4 (migrating from CSS Modules)
- **Visual parity**: Zero user-facing changes — migration only
- **Tailwind v4**: CSS-first config, @theme directive, no tailwind.config.js
- **Performance**: Maintain lazy loading, optimize bundle size

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Enhance existing viz components | Preserve URLs, avoid breaking changes | ✓ Good |
| Follow EventLoopViz pattern | Proven UX, consistent experience | ✓ Good |
| SharedViz components for reuse | Avoid duplication across visualizations | ✓ Good |
| Pattern pages for DSA (not problem-specific) | Matches JS concept structure, teaches transferable skills | ✓ Good |
| 3 DSA patterns first (Two Pointers, Hash Map, Bit Manipulation) | Establish design before expanding | ✓ Good |
| CSS-first responsive | Avoid layout shift, use media queries | ✓ Good |
| Bidirectional cross-linking | Both directions for discoverability | ✓ Good |
| Tailwind v4 @theme foundation first | Establish design tokens before component migration | — In Progress |
| CSS Modules coexist with @theme | Existing var() references resolve from @theme-generated properties | — Decided |
| No @apply usage | Tailwind v4 discourages it; use utilities or @layer components | — Decided |
| clsx for className composition | Replaces template literal concatenation cleanly | — Decided |
| Component migration deferred to v2.1+ | Foundation first, migrate components later | — Decided |

---
*Last updated: 2026-01-27 — v2.0 rescoped to Design System Foundation*
