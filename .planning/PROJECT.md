# DSA Visualiser - Enhanced JS Concept Visualizations

## What This Is

A visual learning platform for JavaScript concepts and DSA interview preparation. This milestone focuses on upgrading the interactive visualizations for foundational JS concepts (Variables, Functions, Arrays/Objects, Loops) to have rich step-by-step execution similar to the EventLoopViz gold standard.

## Core Value

Learners can step through code execution visually, seeing exactly how JavaScript works under the hood — not just reading about it.

## Requirements

### Validated

- ✓ Custom JavaScript interpreter with step-by-step execution — existing
- ✓ 28 JS concept pages with visualizations — existing
- ✓ Rich EventLoopViz with step controls, code highlighting, queues — existing
- ✓ Problem practice pages with code editor and debugger — existing
- ✓ Algorithm concept visualizations (two-pointers, hash-map, etc.) — existing

### Active

- [ ] Enhanced VariablesViz with step-through execution showing scope chain, hoisting phases, TDZ
- [ ] Enhanced FunctionsViz with execution context, parameter binding, return flow
- [ ] Enhanced ArraysBasicsViz with reference vs value, mutation, spread visualization
- [ ] Enhanced ObjectsBasicsViz with property access, mutation, reference sharing
- [ ] Enhanced LoopsViz with iteration stepping, break/continue flow, closure capture bug

### Out of Scope

- New JS concepts — focus on enhancing existing 4 concept areas
- DSA algorithm visualizations — separate milestone
- Interpreter feature additions — unless needed for visualizations
- Mobile responsiveness — desktop-first learning tool

## Context

**Existing pattern (EventLoopViz):**
- Step interface with description, codeLine, state snapshots
- Multiple examples organized by difficulty level
- Forward/back step controls
- Code panel with line highlighting
- State panels (call stack, queues, memory)
- Explanation per step

**Current simple visualizations (LoopsViz, etc.):**
- Auto-play animation only
- Single example
- No step controls
- No code line highlighting
- Minimal state visualization

**Gap:** Foundational concepts need the same depth as advanced concepts to build proper mental models.

## Constraints

- **Tech stack**: React + TypeScript + Framer Motion + CSS Modules (existing patterns)
- **Visualization pattern**: Follow EventLoopViz structure for consistency
- **Data-driven**: Steps defined as data, not hardcoded in render logic
- **Performance**: Lazy load visualizations (already using dynamic imports)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Enhance existing viz components | Preserve URLs, avoid breaking changes | — Pending |
| Follow EventLoopViz pattern | Proven UX, consistent experience | — Pending |
| 4 concept areas in scope | Variables, Functions, Arrays/Objects, Loops are foundational | — Pending |

---
*Last updated: 2026-01-24 after initialization*
