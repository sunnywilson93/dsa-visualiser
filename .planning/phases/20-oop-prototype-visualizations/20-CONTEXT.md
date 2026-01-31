# Phase 20: OOP/Prototype Visualizations - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through visualizations showing JavaScript's prototype chain, property lookup, instanceof checks, ES6 class syntax as syntactic sugar, inheritance mechanics, and prototype pollution dangers. 6 visualizations total matching existing quality (difficulty levels, SharedViz components, mobile responsive).

</domain>

<decisions>
## Implementation Decisions

### Chain Layout
- Vertical stack orientation — object at top, prototype below, null at bottom (matches mental model of "looking up" the chain)
- Claude's discretion: node content (full properties vs compact), arrow labeling, progressive reveal vs always-visible chain

### Property Lookup Animation
- Shadowing must be explicitly called out with visual indicator (grayed out or crossed property in prototype when own property found)
- Claude's discretion: highlight vs animated cursor approach, success/not-found indicators

### Class ↔ Prototype Relationship
- Both constructor call mechanics AND prototype chain structure shown for inheritance
- super() invocation flow AND Child.prototype.__proto__ === Parent.prototype linking
- Claude's discretion: side-by-side vs toggle vs annotation approach for sugar comparison, instanceof visualization approach, static methods inclusion

### Pollution/Danger Messaging
- Include at intermediate AND advanced difficulty levels (simpler pollution at intermediate, security implications at advanced)
- Show prevention (Object.freeze, Object.seal) as final steps after demonstrating the danger
- Claude's discretion: warning style (badge/red/animation), real vs simulated pollution, specific visual approach

### Claude's Discretion
- Node content density and arrow labeling
- Progressive reveal vs always-visible chain levels
- Lookup animation approach (highlight vs cursor)
- Success and not-found visual indicators
- Class/prototype comparison format (side-by-side, toggle, or annotation)
- instanceof visualization depth
- Static method inclusion
- Pollution visualization approach (warning badges, before/after, ripple effect)
- Real vs simulated pollution execution

</decisions>

<specifics>
## Specific Ideas

- Vertical chain matches the mental model of "looking up" — keep this consistent across all OOP visualizations
- Shadowing is a key concept that should never be implicit — users need to see why the prototype property isn't used
- Prevention techniques (Object.freeze/seal) should feel like a "resolution" after showing the problem

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-oop-prototype-visualizations*
*Context gathered: 2026-01-31*
