# Phase 6: ObjectsBasicsViz - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through visualization of object operations. Learners understand references vs values for objects, property mutation effects through shared references, destructuring, and object spread (shallow copy). Creating objects and basic syntax are assumed knowledge.

</domain>

<decisions>
## Implementation Decisions

### Reference visualization
- Mirror ArraysBasicsViz stack/heap layout exactly for consistency
- Nested objects use inline arrow notation (property shows '-> #2' pointing to nested object in heap)
- Claude decides: property display format (key-value pairs vs values-only)
- Claude decides: accent color differentiation from ArraysBasicsViz orange

### Property mutation
- Warning badge behavior matches ArraysBasicsViz ("Both obj1 and obj2 affected!")
- Include examples showing property addition (obj.newProp = value)
- Include examples showing property deletion (delete obj.prop)
- Claude decides: mutation highlight animation (consistent with ArraysBasicsViz style)

### Destructuring animation
- Properties animate "flying out" from object to new stack variables
- Include renaming syntax (const { name: firstName } = person)
- Include default values (const { name = 'Unknown' } = person)
- Include nested destructuring (const { address: { city } } = person)

### Object spread
- Animation mirrors ArraysBasicsViz spread (properties fly out into new heap object)
- Include object merging ({ ...obj1, ...obj2 })
- Include property override ({ ...obj, name: 'New' })
- Shallow copy warning matches ArraysBasicsViz pattern

### Claude's Discretion
- Property display format (key-value pairs vs values-only with hover)
- Accent color choice (differentiate from orange)
- Mutation highlight animation specifics
- Nested object reference display details

</decisions>

<specifics>
## Specific Ideas

- Stack/heap layout should feel identical to ArraysBasicsViz for learner consistency
- Destructuring "fly out" animation should make the property extraction visually clear
- Object spread should visually show properties unpacking similar to array spread

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-objectsbasicsviz*
*Context gathered: 2026-01-24*
