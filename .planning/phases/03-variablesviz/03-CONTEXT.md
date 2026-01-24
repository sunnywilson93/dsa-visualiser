# Phase 3: VariablesViz - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through variable lifecycle visualization for hoisting, TDZ, and scope chains. Users can step through examples to understand how var/let/const behave differently during declaration, initialization, and access. This phase uses the SharedViz foundation components from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Memory Model Representation
- Existence vs value representation: Claude's discretion (ghost boxes, timeline, etc.)
- Hoisting animation: Yes, animate var declarations "floating up" to top of scope
- undefined vs TDZ visual: Same style but different labels ("undefined" vs "TDZ")
- Memory addresses: Claude's discretion (abstract slots or simplified addresses)

### Scope Visualization
- Nested scope representation: Claude's discretion (nested boxes, columns, etc.)
- Scope chain lookup: Yes, animate the "search" moving from inner scope outward until variable found
- Nesting depth: Claude's discretion per example
- Shadowing: Yes, include at least one example showing inner scope hiding outer variable

### Error/TDZ States
- Error display approach: Claude's discretion (red box, inline warning, etc.)
- Error behavior: Simulate the throw — stop execution at that step, show error as if it happened
- const reassignment errors: Claude's discretion whether to include alongside TDZ
- Error difficulty placement: Save for advanced — beginner shows happy path, advanced shows errors

### Example Design
- Organization structure: Claude's discretion (difficulty levels like LoopsViz, or by concept)
- Comparison approach: Claude's discretion (side-by-side var/let/const or separate examples)
- Code naming style: Claude's discretion (abstract vs real-world flavor)
- Function hoisting: Claude's discretion whether to include function declaration hoisting

### Claude's Discretion
The following decisions are left to Claude's judgment during implementation:

**Memory Model:**
- Visual representation for variable existence before initialization
- Whether to use memory addresses or abstract slots
- Exact animation style for hoisting

**Scope Visualization:**
- Visual structure (nested boxes, columns, tree, etc.)
- Nesting depth per example

**Example Organization:**
- Difficulty structure (match LoopsViz or organize by concept)
- Code naming conventions
- Whether to include function hoisting
- Side-by-side comparisons vs separate examples

**Error Coverage:**
- Whether to include const reassignment errors
- Error display visual style

</decisions>

<specifics>
## Specific Ideas

- Use SharedViz components (CodePanel, StepProgress, StepControls) from Phase 1
- Match LoopsViz visual style for consistency
- Hoisting with animation will help learners visualize the "invisible" movement
- Shadowing example is important for understanding scope chain lookup
- TDZ errors should feel "real" — simulate the actual throw

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-variablesviz*
*Context gathered: 2026-01-24*
