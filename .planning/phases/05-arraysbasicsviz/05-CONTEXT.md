# Phase 5: ArraysBasicsViz - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through visualization of array operations. Learners understand references vs values, mutation effects through shared references, and how array methods (map/filter/reduce) iterate. Creating arrays and basic syntax are assumed knowledge.

</domain>

<decisions>
## Implementation Decisions

### Reference visualization
- Animate arrows when copying array by reference — new arrow appears connecting to same heap object
- Primitives (value copy) show duplication animation — value visually "clones" into new box
- Spread operator animates elements "flying out" of source array into new array

### Mutation effects
- Claude decides: highlight approach for mutations (flash, color change, or both)
- Claude decides: whether to show warning badge when mutation affects shared references
- Claude decides: step-by-step vs before/after for mutating methods
- Claude decides: whether to contrast mutating vs non-mutating methods in same example

### Method iteration (map/filter/reduce)
- Callback iterations animate automatically (not manual step-through per element)
- Reduce: prominently display accumulator value updating each iteration
- Result array grows progressively as map/filter processes elements
- Filter: rejected elements are visually shown being rejected (fade out, cross out, or move aside)

### Claude's Discretion
- Memory address representation style (heap boxes vs inline addresses)
- Mutation highlight approach (flash, color, or both)
- Warning indicators for shared reference mutation
- Example structure (contrast mutating/non-mutating or separate)

</decisions>

<specifics>
## Specific Ideas

- Arrow animation when multiple variables point to same array (like LoopsViz bindings visualization)
- Spread operator should feel like "unpacking" — elements flowing out
- Reduce accumulator should be prominent, possibly in its own panel like call stack

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-arraysbasicsviz*
*Context gathered: 2026-01-24*
