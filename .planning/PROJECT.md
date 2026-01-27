# DSA Visualiser - Enhanced Concept Visualizations

## What This Is

A visual learning platform for JavaScript concepts and DSA interview preparation. Features interactive step-through visualizations for both JS concepts (Variables, Functions, Arrays, Objects, Loops) and DSA patterns (Two Pointers, Hash Map, Bit Manipulation).

## Core Value

Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood — not just reading about them.

## Current Milestone: v2.0 Tailwind Migration

**Goal:** Full migration from CSS Modules to Tailwind v4, controlling the entire design system from one place.

**Target features:**
- Install and configure Tailwind v4 with CSS-first @theme configuration
- Migrate all design tokens (colors, spacing, typography) to Tailwind @theme
- Replace ALL CSS Module files with Tailwind utility classes
- Remove CSS Modules infrastructure entirely
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
- 50+ CSS Module files across components
- Semantic CSS variable system in globals.css (colors, spacing, typography)
- Framer Motion for animations
- CSS-only responsive patterns (media queries, checkbox hack for mobile nav)

**Gap:** Design system scattered across CSS Modules and CSS variables. No single source of truth for design tokens. Tailwind v4 consolidates everything under @theme.

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
| Tailwind v4 full migration | CSS-first config, single design system source | — Pending |
| Remove all CSS Modules | Full replacement, no hybrid approach | — Pending |

---
*Last updated: 2026-01-27 after v2.0 milestone start*
