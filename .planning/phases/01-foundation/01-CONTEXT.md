# Phase 1: Foundation - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Shared reusable components (CodePanel, StepControls, progress indicator, auto-play) for consistent step-through UX across all concept visualizations. These components will be used by LoopsViz, VariablesViz, FunctionsViz, ArraysBasicsViz, and ObjectsBasicsViz in subsequent phases.

</domain>

<decisions>
## Implementation Decisions

### Visual Styling
- Match EventLoopViz styling exactly — same colors, borders, spacing, proven design
- Dark theme only — no light theme support needed (current site is dark-themed)

### Line Highlighting
- Use brand accent color (blue/purple) for highlighted lines — consistent with site identity

### Claude's Discretion
The following decisions are left to Claude's judgment during implementation:

**Visual Styling:**
- Panel border/container prominence (subtle vs defined)
- Step explanation visual treatment (inline, separate panel, or tooltip)

**Line Highlighting:**
- Animation when changing lines (instant, fade, or pulse)
- Scroll behavior when highlighted line is off-screen
- Whether to show line numbers in code panel

**Control Layout:**
- Position of controls (below, above, or floating)
- Icons vs text labels vs both
- Progress indicator prominence
- Keyboard shortcut implementation

**Auto-play:**
- Speed options (single, three speeds, or slider)
- What triggers pause (any interaction vs explicit button)
- Playing state indicator style
- End behavior (stop vs loop)

</decisions>

<specifics>
## Specific Ideas

- "Match EventLoopViz" — the existing EventLoopViz component is the gold standard; new components should feel like they belong in the same family
- Components must be truly reusable — designed for 5 different visualization contexts with varying step data shapes

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-01-24*
