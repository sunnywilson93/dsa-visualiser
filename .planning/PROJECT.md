# DSA Visualiser - Enhanced Concept Visualizations

## What This Is

A visual learning platform for JavaScript concepts and DSA interview preparation. Features interactive step-through visualizations for both JS concepts (Variables, Functions, Arrays, Objects, Loops) and DSA patterns (Two Pointers, Hash Map, Bit Manipulation).

## Core Value

Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood — not just reading about them.

## Current Milestone: v1.1 Enhanced DSA Concept Visualizations

**Goal:** Upgrade DSA pattern visualizations to match the quality of JS concept visualizations — step-through, difficulty levels, code panel, SharedViz integration.

**Target features:**
- TwoPointersViz — pattern page with beginner/intermediate/advanced examples
- HashMapViz — same treatment
- BitManipulationViz — same treatment

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

### Active

- [ ] Enhanced TwoPointersViz with pattern page, difficulty levels, SharedViz
- [ ] Enhanced HashMapViz with pattern page, difficulty levels, SharedViz
- [ ] Enhanced BitManipulationViz with pattern page, difficulty levels, SharedViz

### Out of Scope

- New DSA patterns (Sliding Window, Binary Search, etc.) — future milestone after establishing design
- Interpreter feature additions — unless needed for visualizations
- Mobile responsiveness — desktop-first learning tool

## Context

**Proven pattern (EventLoopViz, LoopsViz, VariablesViz, etc.):**
- Step interface with description, codeLine, state snapshots
- Multiple examples organized by difficulty level (beginner/intermediate/advanced)
- Forward/back step controls via SharedViz components
- Code panel with line highlighting
- Domain-specific state panels
- Explanation per step with insights

**Current DSA visualizations (TwoPointersConcept, etc.):**
- Simpler components receiving step from outside
- No difficulty levels or example tabs
- No SharedViz integration
- Problem-specific, not pattern-focused

**Gap:** DSA patterns need the same interactive step-through experience as JS concepts.

## Constraints

- **Tech stack**: React + TypeScript + Framer Motion + CSS Modules (existing patterns)
- **Visualization pattern**: Follow EventLoopViz structure for consistency
- **Data-driven**: Steps defined as data, not hardcoded in render logic
- **Performance**: Lazy load visualizations (already using dynamic imports)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Enhance existing viz components | Preserve URLs, avoid breaking changes | ✓ Good |
| Follow EventLoopViz pattern | Proven UX, consistent experience | ✓ Good |
| SharedViz components for reuse | Avoid duplication across visualizations | ✓ Good |
| Pattern pages for DSA (not problem-specific) | Matches JS concept structure, teaches transferable skills | — Pending |
| 3 DSA patterns first (Two Pointers, Hash Map, Bit Manipulation) | Establish design before expanding | — Pending |

---
*Last updated: 2026-01-24 after v1.1 milestone start*
