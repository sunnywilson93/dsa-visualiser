# Phase 4: FunctionsViz - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through function execution visualization for execution contexts and call stack. Users can step through examples to understand how functions create execution contexts, how parameters bind to arguments, how the call stack grows/shrinks with nested calls, and how `this` binding works differently for regular vs arrow functions. This phase uses the SharedViz foundation components from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Call Stack Visualization
- Stack frame animation: Yes, animate push/pop operations (frames slide in/out)
- Stack layout direction: Claude's discretion
- Stack frame content: Claude's discretion (function name, arguments, return value)
- Nesting depth per example: Claude's discretion based on difficulty level

### Execution Context Display
- Context content: Full context — show local variables, `this` binding, AND outer reference (scope chain)
- Context lifecycle: Yes, show both phases — explicit "Creating execution context..." step and "Context destroyed" step
- Context location (separate panel vs in frame): Claude's discretion
- Outer reference visualization (arrows vs labels): Claude's discretion

### Parameter Binding Animation
- Binding animation: Yes, animate arguments "flowing" into parameter slots
- Argument/parameter mismatch: Show both cases (undefined for missing args, extra args ignored)
- Default parameters: Include in intermediate examples (show fallback when arg missing/undefined)
- Rest parameters (...args): Save for advanced examples (collecting remaining args into array)

### `this` Binding Examples
- Visualization approach: Claude's discretion
- Scenarios to cover: All — methods, standalone functions, call/apply/bind, arrow functions
- Arrow function lexical `this`: Show side-by-side comparison with regular function
- `this` pitfalls (callback losing this, setTimeout): Save for advanced examples

### Claude's Discretion
The following decisions are left to Claude's judgment during implementation:

**Call Stack:**
- Stack layout direction (bottom-up vs top-down)
- Stack frame content level of detail
- Nesting depth choices per difficulty level

**Execution Context:**
- Whether context is separate panel or embedded in frames
- Outer reference visualization style (arrows vs labels)

**`this` Binding:**
- Visual representation of what `this` points to

</decisions>

<specifics>
## Specific Ideas

- Use SharedViz components (CodePanel, StepProgress, StepControls) from Phase 1
- Match LoopsViz/VariablesViz visual style for consistency
- Execution context creation/destruction should feel like "entering/exiting" the function
- Parameter binding animation should make the argument → parameter flow obvious to learners
- Side-by-side arrow vs regular function comparison is key for understanding lexical `this`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-functionsviz*
*Context gathered: 2026-01-24*
