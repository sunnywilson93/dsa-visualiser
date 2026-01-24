# Phase 6: ObjectsBasicsViz - Research

**Researched:** 2026-01-24
**Domain:** React step-through visualization for JavaScript object operations
**Confidence:** HIGH

## Summary

This research analyzes the established patterns from Phase 5 (ArraysBasicsViz) to inform the ObjectsBasicsViz implementation. The current ObjectsBasicsViz is a tab-based static display that must be replaced with a step-through visualization following the ArraysBasicsViz pattern exactly.

The key technical challenge is adapting the stack/heap memory model from arrays to objects. Objects add complexity: they have named properties (not indexed elements), can be nested with references to other objects, and support destructuring syntax that extracts multiple properties simultaneously. The "fly out" animation for destructuring is a new visual pattern not present in ArraysBasicsViz.

The implementation directly mirrors ArraysBasicsViz patterns:
1. **SharedViz components** for code display and step controls
2. **Step-based data model** with typed interfaces for object-specific state
3. **Stack/heap visualization** with reference arrows showing objects in heap
4. **Framer Motion animations** for visual transitions

**Primary recommendation:** Rewrite ObjectsBasicsViz using ArraysBasicsViz as the direct template. Adapt interfaces for object properties instead of array elements. Add destructuring-specific visualization state for the "fly out" animation.

## Standard Stack

This phase uses existing project dependencies - no new packages needed.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component framework | Already in project |
| Framer Motion | 10.x+ | Animations | Already used by ArraysBasicsViz |
| CSS Modules | - | Component styling | Project convention |

### Existing SharedViz Components
| Component | Purpose | Usage Pattern |
|-----------|---------|---------------|
| `CodePanel` | Display code with line highlighting | `<CodePanel code={string[]} highlightedLine={number} />` |
| `StepProgress` | Show step counter and description | `<StepProgress current={n} total={n} description={string} />` |
| `StepControls` | Prev/Next/Reset buttons | `<StepControls onPrev onNext onReset canPrev canNext />` |

### ArraysBasicsViz Components to Mirror
| Component Pattern | Purpose | Adaptation for Objects |
|-------------------|---------|------------------------|
| `StackItem` interface | Variable in stack | Same - objects stored as references |
| `HeapObject` interface | Object in heap | Change `elements` array to `properties` map |
| Level/Example/Step data model | Navigation structure | Same structure, object-specific content |
| Warning badge for shared refs | Mutation awareness | Same pattern, "Both obj1 and obj2 affected!" |

**Installation:** None required - all dependencies exist.

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── ObjectsBasicsViz.tsx        # Main component (replace existing)
├── ObjectsBasicsViz.module.css # Styling (replace existing)
```

### Pattern 1: Adapted Interface Structure
**What:** Type definitions adapted from ArraysBasicsViz for object-specific state
**When to use:** All step definitions in ObjectsBasicsViz
**Example:**
```typescript
// Source: Adapted from src/components/Concepts/ArraysBasicsViz.tsx

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface ObjectProperty {
  key: string
  value: string | number | boolean
  isReference?: boolean      // For nested objects: shows "-> #2"
  refId?: string             // Links to nested HeapObject
  highlight?: 'new' | 'changed' | 'deleted' | 'none'
}

interface HeapObject {
  id: string
  type: 'object'
  properties: ObjectProperty[]
  label: string              // "#1", "#2", etc.
  highlight?: 'mutated' | 'new' | 'none'
}

interface DestructureState {
  sourceRefId: string        // Object being destructured
  extractedProps: {
    propKey: string          // Key being extracted
    targetVar: string        // Variable name (may differ due to renaming)
    value: string            // Extracted value
    status: 'pending' | 'flying' | 'landed'
  }[]
}

interface ObjectStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'destructure' | 'spread' | 'result'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
  destructureState?: DestructureState
}
```

### Pattern 2: Property Display Format (Key-Value Pairs)
**What:** Objects display properties as key: value pairs inside heap box
**When to use:** HeapObject rendering
**Rationale:** Objects are fundamentally different from arrays - keys matter, order less so. Display as vertical key-value list.
**Example:**
```typescript
// Heap object rendering
<div className={styles.heapObject}>
  <div className={styles.objectLabel}>#1</div>
  <div className={styles.objectProperties}>
    {obj.properties.map(prop => (
      <div key={prop.key} className={styles.property}>
        <span className={styles.propKey}>{prop.key}:</span>
        <span className={styles.propValue}>
          {prop.isReference ? prop.value : JSON.stringify(prop.value)}
        </span>
      </div>
    ))}
  </div>
</div>
```

### Pattern 3: Nested Object Reference Display
**What:** Nested objects show inline arrow notation pointing to separate heap object
**When to use:** When object property contains another object
**Example (from CONTEXT.md decision):**
```typescript
// Stack shows: obj -> #1
// Heap shows: #1 with property address: "-> #2"
// Heap also shows: #2 (the nested address object)

const nestedExample = {
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'address', value: '-> #2', isReference: true, refId: 'address1' }
      ],
      label: '#1'
    },
    {
      id: 'address1',
      type: 'object',
      properties: [
        { key: 'city', value: 'NYC' },
        { key: 'zip', value: '10001' }
      ],
      label: '#2'
    }
  ]
}
```

### Pattern 4: Destructuring "Fly Out" Animation
**What:** Properties animate from object to new stack variables
**When to use:** Destructuring visualization steps
**Example:**
```typescript
// CSS keyframe for flying animation
@keyframes flyToStack {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateX(-100px) translateY(-30px);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-200px) translateY(0);
    opacity: 0;
  }
}

// Component usage
{destructureState?.extractedProps.map(prop => (
  prop.status === 'flying' && (
    <motion.div
      className={styles.flyingProperty}
      initial={{ x: 0, y: 0, opacity: 1 }}
      animate={{ x: -200, y: -20, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prop.propKey}: {prop.value}
    </motion.div>
  )
))}
```

### Pattern 5: Spread Operator Animation
**What:** Properties visually "unpack" into new heap object
**When to use:** Object spread steps
**Rationale:** Mirrors ArraysBasicsViz spread animation. Properties fly from source to new target heap object.
**Example:**
```typescript
// Step showing spread
{
  id: 2,
  codeLine: 1,
  description: 'const copy = { ...original } - Spread creates NEW object #2 with copied properties.',
  phase: 'spread',
  stack: [
    { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
    { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2', highlight: 'new' }
  ],
  heap: [
    { id: 'obj1', type: 'object', properties: [...], label: '#1' },
    { id: 'obj2', type: 'object', properties: [...], label: '#2', highlight: 'new' }
  ]
}
```

### Pattern 6: Property Mutation Display
**What:** Property changes shown with highlight states including deletion
**When to use:** Property mutation steps (add, modify, delete)
**Example:**
```typescript
// Adding property
properties: [
  { key: 'name', value: 'Alice' },
  { key: 'email', value: 'alice@test.com', highlight: 'new' }  // New property
]

// Modifying property
properties: [
  { key: 'name', value: 'Bob', highlight: 'changed' }  // Changed from Alice
]

// Deleting property (show with strikethrough before removal)
properties: [
  { key: 'name', value: 'Alice' },
  { key: 'temp', value: 'deleted', highlight: 'deleted' }  // About to be removed
]
```

### Anti-Patterns to Avoid
- **Reusing ArraysBasicsViz elements display for properties:** Objects need key-value pair display, not indexed array format.
- **SVG arrows for nested references:** Use text notation "-> #2" like ArraysBasicsViz, not drawn lines.
- **Complex destructuring in single step:** Break nested destructuring into multiple steps for clarity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom tokenizer | `CodePanel` from SharedViz | Established pattern |
| Step navigation | Custom button logic | `StepControls` from SharedViz | Handles edge cases |
| Step description display | Custom text animation | `StepProgress` from SharedViz | Consistent styling |
| Level/example state management | Custom solution | Copy ArraysBasicsViz pattern | Proven, tested |
| Reference notation | Custom arrow drawing | Text "-> #N" | Matches ArraysBasicsViz, simpler |

**Key insight:** ObjectsBasicsViz should feel like ArraysBasicsViz with object-specific content. Don't innovate on infrastructure.

## Common Pitfalls

### Pitfall 1: Forgetting to Reset Step on Example/Level Change
**What goes wrong:** User changes example but step stays at 5, causing undefined currentStep
**Why it happens:** Only updating exampleIndex without resetting stepIndex
**How to avoid:** Copy ArraysBasicsViz handler pattern exactly:
```typescript
const handleExampleChange = (index: number) => {
  setExampleIndex(index)
  setStepIndex(0)  // Always reset!
}
```
**Warning signs:** "Cannot read properties of undefined" errors

### Pitfall 2: Property Order Display Confusion
**What goes wrong:** Properties appear in different order than code, confusing learners
**Why it happens:** JavaScript objects don't guarantee property order (historically)
**How to avoid:** Display properties in code declaration order, not sorted. Use array of ObjectProperty, not Map.
**Warning signs:** Learner confusion about which property is which

### Pitfall 3: Destructuring Animation Timing
**What goes wrong:** Flying animation finishes but stack variable not visible yet
**Why it happens:** Animation and state update out of sync
**How to avoid:** Use onAnimationComplete callback to advance state:
```typescript
<motion.div
  onAnimationComplete={() => {
    setDestructureState(prev => ({
      ...prev,
      extractedProps: prev.extractedProps.map(p =>
        p.propKey === prop.propKey ? { ...p, status: 'landed' } : p
      )
    }))
  }}
/>
```
**Warning signs:** Properties appear to "jump" or disappear during animation

### Pitfall 4: Nested Object Reference Circular Dependencies
**What goes wrong:** Object A contains B, B contains A - infinite rendering
**Why it happens:** Not handling circular references in display
**How to avoid:** For this visualization, avoid circular reference examples entirely. They add complexity without teaching value at beginner/intermediate level.
**Warning signs:** React "maximum update depth exceeded" errors

### Pitfall 5: Shallow Copy Warning Missing for Nested Objects
**What goes wrong:** User doesn't understand why nested object mutation affects original
**Why it happens:** Warning badge only checks top-level references
**How to avoid:** Check if mutated property is a reference type and multiple heap objects share that refId:
```typescript
const getSharedRefWarning = () => {
  // Check both stack->heap AND heap->heap references
  const refCounts = new Map<string, string[]>()
  // ... similar to ArraysBasicsViz but also check heap property references
}
```
**Warning signs:** User confusion about nested mutation effects

### Pitfall 6: Inconsistent Accent Color
**What goes wrong:** Orange used (same as ArraysBasicsViz), visual confusion
**Why it happens:** Copy-paste without updating accent color
**How to avoid:** Use distinct accent color. CONTEXT.md leaves this to Claude's discretion.
**Recommendation:** Use teal/cyan (#14b8a6) to differentiate from ArraysBasicsViz orange (#f97316).
**Warning signs:** Screenshots of both components look too similar

## Code Examples

### Example 1: Complete Step Interface
```typescript
// Recommended interface structure for ObjectsBasicsViz

interface StackItem {
  name: string
  value: string
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'none'
}

interface ObjectProperty {
  key: string
  value: string | number | boolean
  isReference?: boolean
  refId?: string
  highlight?: 'new' | 'changed' | 'deleted' | 'none'
}

interface HeapObject {
  id: string
  type: 'object'
  properties: ObjectProperty[]
  label: string
  highlight?: 'mutated' | 'new' | 'none'
}

interface DestructureState {
  sourceRefId: string
  extractedProps: {
    propKey: string
    targetVar: string
    value: string
    status: 'pending' | 'flying' | 'landed'
  }[]
}

interface ObjectStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'destructure' | 'spread' | 'result'
  stack: StackItem[]
  heap: HeapObject[]
  output: string[]
  destructureState?: DestructureState
}

interface ObjectExample {
  id: string
  title: string
  code: string[]
  steps: ObjectStep[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'
```

### Example 2: Reference Copy Step (Beginner)
```typescript
// Step showing reference copy (obj2 = obj1)
{
  id: 3,
  codeLine: 2,
  description: 'const obj2 = obj1 - obj2 now points to the SAME object in memory',
  phase: 'reference',
  stack: [
    { name: 'obj1', value: '-> #1', isReference: true, refId: 'object1' },
    { name: 'obj2', value: '-> #1', isReference: true, refId: 'object1', highlight: 'new' }
  ],
  heap: [
    {
      id: 'object1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#1'
    }
  ],
  output: []
}
```

### Example 3: Property Mutation Step
```typescript
// Step showing property mutation through reference
{
  id: 4,
  codeLine: 3,
  description: 'obj2.name = "Bob" - Mutates the shared object. obj1.name is now "Bob" too!',
  phase: 'mutate',
  stack: [
    { name: 'obj1', value: '-> #1', isReference: true, refId: 'object1' },
    { name: 'obj2', value: '-> #1', isReference: true, refId: 'object1' }
  ],
  heap: [
    {
      id: 'object1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Bob', highlight: 'changed' },
        { key: 'age', value: 25 }
      ],
      label: '#1',
      highlight: 'mutated'
    }
  ],
  output: []
}
```

### Example 4: Property Addition Step
```typescript
// Step showing property addition
{
  id: 5,
  codeLine: 4,
  description: 'obj1.email = "bob@test.com" - Adding a new property to the object',
  phase: 'mutate',
  stack: [
    { name: 'obj1', value: '-> #1', isReference: true, refId: 'object1' }
  ],
  heap: [
    {
      id: 'object1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Bob' },
        { key: 'age', value: 25 },
        { key: 'email', value: 'bob@test.com', highlight: 'new' }
      ],
      label: '#1',
      highlight: 'mutated'
    }
  ],
  output: []
}
```

### Example 5: Property Deletion Step
```typescript
// Step showing property deletion
{
  id: 6,
  codeLine: 5,
  description: 'delete obj1.age - Removing the age property from the object',
  phase: 'mutate',
  stack: [
    { name: 'obj1', value: '-> #1', isReference: true, refId: 'object1' }
  ],
  heap: [
    {
      id: 'object1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Bob' },
        { key: 'age', value: 25, highlight: 'deleted' }  // Shows strikethrough before removal
      ],
      label: '#1',
      highlight: 'mutated'
    }
  ],
  output: []
}
```

### Example 6: Destructuring Step Sequence
```typescript
// Basic destructuring: const { name, age } = person

// Step 1: Setup
{
  id: 1,
  codeLine: 0,
  description: 'const person = { name: "Alice", age: 25 } - Object created in heap.',
  phase: 'setup',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1', highlight: 'new' }
  ],
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#1',
      highlight: 'new'
    }
  ],
  output: []
}

// Step 2: Destructuring begins
{
  id: 2,
  codeLine: 1,
  description: 'const { name, age } = person - Extracting name and age into separate variables',
  phase: 'destructure',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1' }
  ],
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice', highlight: 'changed' },  // Highlight source
        { key: 'age', value: 25, highlight: 'changed' }
      ],
      label: '#1'
    }
  ],
  output: [],
  destructureState: {
    sourceRefId: 'person1',
    extractedProps: [
      { propKey: 'name', targetVar: 'name', value: 'Alice', status: 'flying' },
      { propKey: 'age', targetVar: 'age', value: '25', status: 'pending' }
    ]
  }
}

// Step 3: Destructuring complete
{
  id: 3,
  codeLine: 1,
  description: 'Variables name and age now hold copies of the primitive values.',
  phase: 'result',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
    { name: 'name', value: '"Alice"', highlight: 'new' },
    { name: 'age', value: '25', highlight: 'new' }
  ],
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#1'
    }
  ],
  output: []
}
```

### Example 7: Destructuring with Renaming
```typescript
// const { name: firstName } = person

{
  id: 2,
  codeLine: 1,
  description: 'const { name: firstName } = person - Extract name property into variable called firstName',
  phase: 'destructure',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1' }
  ],
  heap: [...],
  destructureState: {
    sourceRefId: 'person1',
    extractedProps: [
      { propKey: 'name', targetVar: 'firstName', value: 'Alice', status: 'flying' }
    ]
  }
}
```

### Example 8: Object Spread Creating Copy
```typescript
// const copy = { ...original }

{
  id: 2,
  codeLine: 1,
  description: '{ ...original } - Spread creates a NEW object with copied properties.',
  phase: 'spread',
  stack: [
    { name: 'original', value: '-> #1', isReference: true, refId: 'obj1' },
    { name: 'copy', value: '-> #2', isReference: true, refId: 'obj2', highlight: 'new' }
  ],
  heap: [
    {
      id: 'obj1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#1'
    },
    {
      id: 'obj2',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#2',
      highlight: 'new'
    }
  ],
  output: []
}
```

### Example 9: Object Spread with Override
```typescript
// const updated = { ...person, name: 'Bob' }

{
  id: 2,
  codeLine: 1,
  description: '{ ...person, name: "Bob" } - Spread copies all properties, then overrides name.',
  phase: 'spread',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
    { name: 'updated', value: '-> #2', isReference: true, refId: 'updated1', highlight: 'new' }
  ],
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'age', value: 25 }
      ],
      label: '#1'
    },
    {
      id: 'updated1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Bob', highlight: 'changed' },  // Overridden
        { key: 'age', value: 25 }
      ],
      label: '#2',
      highlight: 'new'
    }
  ],
  output: []
}
```

### Example 10: Nested Object (Shallow Copy Warning)
```typescript
// Showing nested object reference sharing

{
  id: 2,
  codeLine: 1,
  description: 'const copy = { ...person } - Shallow copy! The address object is NOT copied.',
  phase: 'spread',
  stack: [
    { name: 'person', value: '-> #1', isReference: true, refId: 'person1' },
    { name: 'copy', value: '-> #3', isReference: true, refId: 'copy1', highlight: 'new' }
  ],
  heap: [
    {
      id: 'person1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'address', value: '-> #2', isReference: true, refId: 'address1' }
      ],
      label: '#1'
    },
    {
      id: 'address1',
      type: 'object',
      properties: [
        { key: 'city', value: 'NYC' }
      ],
      label: '#2'
    },
    {
      id: 'copy1',
      type: 'object',
      properties: [
        { key: 'name', value: 'Alice' },
        { key: 'address', value: '-> #2', isReference: true, refId: 'address1' }  // Same reference!
      ],
      label: '#3',
      highlight: 'new'
    }
  ],
  output: []
}
```

## Discretionary Decisions

Based on CONTEXT.md "Claude's Discretion" items:

### Property Display Format
**Decision:** Key-value pairs displayed vertically in heap box
**Rationale:** Objects are fundamentally about named properties. Vertical list makes keys prominent and readable.

### Accent Color
**Decision:** Teal/cyan (#14b8a6) for ObjectsBasicsViz
**Rationale:** Distinct from ArraysBasicsViz orange (#f97316). Teal is professional, readable, and creates visual separation between object and array concepts.

### Mutation Highlight Animation
**Decision:** Same pulse animation as ArraysBasicsViz, but with teal color
**Rationale:** Consistent behavior across concepts. Learners recognize the "mutation" visual cue.

### Nested Object Reference Display
**Decision:** Property value shows "-> #2" text, matching ArraysBasicsViz arrow notation
**Rationale:** Consistency with established pattern. Actual drawn arrows would add complexity without proportional benefit.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tab-based static display | Step-through with data model | This phase | Full rewrite of ObjectsBasicsViz |
| N/A (new capability) | Memory stack/heap visualization | This phase | Shows reference semantics visually |
| N/A (new capability) | Destructuring "fly out" animation | This phase | Visual extraction of properties |

**Current implementation (to be replaced):**
- Tab-based with 'access', 'methods', 'destructure' tabs
- Static display, no step-through
- No memory model visualization
- No level progression

## Open Questions

1. **Destructuring Animation Sequence**
   - What we know: Properties should "fly out" from object to stack
   - What's unclear: Should all properties fly simultaneously or sequentially?
   - Recommendation: Sequential with 200ms stagger for clarity

2. **Default Value Display in Destructuring**
   - What we know: Need to show `const { name = 'Unknown' } = person`
   - What's unclear: How to visually indicate default was used vs property existed
   - Recommendation: Add badge "default" next to value when default is applied

3. **Nested Destructuring Visual Depth**
   - What we know: Need `const { address: { city } } = person`
   - What's unclear: How deep to animate (just outer, or show nested too?)
   - Recommendation: Keep to 2 levels max, show intermediate state briefly

## Sources

### Primary (HIGH confidence)
- `/src/components/Concepts/ArraysBasicsViz.tsx` - Direct template for implementation
- `/src/components/Concepts/ArraysBasicsViz.module.css` - CSS patterns to adapt
- `/src/components/SharedViz/` - Reusable components (CodePanel, StepProgress, StepControls)
- `/src/components/Concepts/ObjectsBasicsViz.tsx` - Current implementation to replace

### Secondary (MEDIUM confidence)
- `.planning/phases/06-objectsbasicsviz/06-CONTEXT.md` - User decisions and discretionary items
- `.planning/phases/05-arraysbasicsviz/05-VERIFICATION.md` - Verification patterns to follow

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already exist
- Architecture: HIGH - patterns established in ArraysBasicsViz
- Code examples: HIGH - derived from direct ArraysBasicsViz analysis
- Discretionary decisions: MEDIUM - recommendations based on patterns and context

**Research date:** 2026-01-24
**Valid until:** Stable - internal patterns unlikely to change
