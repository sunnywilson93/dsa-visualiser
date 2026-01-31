# DSA Visualiser - Enhanced Concept Visualizations

## What This Is

A visual learning platform for JavaScript concepts and DSA interview preparation. Features interactive step-through visualizations for both JS concepts (Variables, Functions, Arrays, Objects, Loops) and DSA patterns (Two Pointers, Hash Map, Bit Manipulation).

## Core Value

Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood — not just reading about them.

## Current Milestone: v4.0 Design Token Consistency

**Goal:** Replace all hardcoded colors with @theme tokens — single source of truth for design consistency.

**Target features:**
- Replace 700+ hardcoded hex colors with @theme CSS custom property references
- Extract shared color objects (levelInfo, stateColors) to reusable modules
- Ensure all 56 visualization components use consistent token patterns
- Validate visual parity before/after migration (no appearance changes)

## Previous Milestone: v3.0 Complete Concept Visualizations (Paused)

**Status:** Paused at Phase 21 (Closures) — 3/4 phases complete

**Completed:**
- Phase 18: Callbacks & Promises (6 visualizations)
- Phase 19: Async/Await & Queues (7 visualizations)
- Phase 20: OOP/Prototypes (6 visualizations)

**Remaining:**
- Phase 21: Closures (6 visualizations) — deferred to after v4.0

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
- ✓ Tailwind v4 @theme design tokens foundation — v2.0

### Active

(Defined in REQUIREMENTS.md)

### Out of Scope

- New DSA patterns (Sliding Window, Binary Search, etc.) — future milestone
- Interpreter feature additions — unless needed for visualizations
- Advanced interactivity (prediction prompts, quizzes) — future milestone
- CSS Module to Tailwind utility migration — deferred to v3.1+
- Visual redesign — maintain current appearance

## Context

**Current state:**
- Full platform complete (JS concepts + DSA patterns + responsive + SEO)
- 37 concept Viz components with step-through visualizations
- 83+ concept definitions in concepts.ts (data exists, some lack Viz)
- Tailwind v4 @theme design system foundation complete
- SharedViz components proven (CodePanel, StepControls, StepProgress)
- Framer Motion for animations
- CSS Modules for component styling

**Gap:** ~46 concepts have data definitions but no dedicated step-through visualization. Users see static content instead of interactive learning. v3.0 adds visualizations for the missing async, OOP, and closure concepts.

## Constraints

- **Tech stack**: React + TypeScript + Framer Motion + CSS Modules
- **Quality parity**: Match existing Viz quality (difficulty levels, step-through, code highlighting)
- **Reuse SharedViz**: All new Viz use CodePanel, StepControls, StepProgress
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
| Tailwind v4 @theme foundation first | Establish design tokens before component migration | ✓ Good |
| CSS Modules coexist with @theme | Existing var() references resolve from @theme-generated properties | ✓ Good |
| No @apply usage | Tailwind v4 discourages it; use utilities or @layer components | ✓ Good |
| clsx for className composition | Replaces template literal concatenation cleanly | ✓ Good |
| Component migration deferred to v3.1+ | Add visualizations first, migrate CSS later | — Decided |
| Reuse SharedViz for all new Viz | Consistent UX, avoid duplication | — Decided |

---
*Last updated: 2026-01-31 — v4.0 milestone started (Design Token Consistency), v3.0 paused*
