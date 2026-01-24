# Phase 5: ArraysBasicsViz - Research

**Researched:** 2026-01-24
**Domain:** React step-through visualization with memory model concepts
**Confidence:** HIGH

## Summary

This research analyzes the existing codebase patterns to inform the ArraysBasicsViz implementation. The current ArraysBasicsViz component is a simple tab-based static display that needs to be replaced with a step-through visualization following the established patterns from LoopsViz, VariablesViz, and FunctionsViz.

The key technical challenge is visualizing JavaScript's reference semantics: showing primitives copied by value vs arrays copied by reference, with animated arrows connecting stack variables to heap objects. The MemoryModelViz component already implements stack/heap visualization with references and can inform the approach.

The implementation follows three established patterns:
1. **SharedViz components** for code display and step controls
2. **Step-based data model** with typed interfaces for each step's state
3. **Framer Motion animations** for visual transitions

**Primary recommendation:** Rewrite ArraysBasicsViz using the FunctionsViz pattern with level/example selectors, step-based data model, and integrated memory visualization (stack references pointing to heap arrays).

## Standard Stack

This phase uses existing project dependencies - no new packages needed.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component framework | Already in project |
| Framer Motion | 10.x+ | Animations | Already used by all Viz components |
| CSS Modules | - | Component styling | Project convention |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | existing | Icons (if needed) | Optional for visual indicators |

### Existing SharedViz Components
| Component | Purpose | Usage Pattern |
|-----------|---------|---------------|
| `CodePanel` | Display code with line highlighting | `<CodePanel code={string[]} highlightedLine={number} />` |
| `StepProgress` | Show step counter and description | `<StepProgress current={n} total={n} description={string} />` |
| `StepControls` | Prev/Next/Reset buttons with optional Play | `<StepControls onPrev onNext onReset canPrev canNext />` |
| `useAutoPlay` | Hook for auto-advancing steps | Optional for method iteration auto-animate |

**Installation:** None required - all dependencies exist.

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── ArraysBasicsViz.tsx        # Main component (replace existing)
├── ArraysBasicsViz.module.css # Styling (replace existing)
```

### Pattern 1: Level/Example/Step Data Model
**What:** Three-tier navigation with static data defining all visualization states
**When to use:** Every *Viz component in Concepts/
**Example (from FunctionsViz):**
```typescript
// Source: src/components/Concepts/FunctionsViz.tsx
type Level = 'beginner' | 'intermediate' | 'advanced'

interface ArrayStep {
  id: number
  codeLine: number
  description: string
  // Phase-specific state...
}

interface ArrayExample {
  id: string
  title: string
  code: string[]
  steps: ArrayStep[]
  insight: string
}

const examples: Record<Level, ArrayExample[]> = {
  beginner: [...],
  intermediate: [...],
  advanced: [...]
}
```

### Pattern 2: Stack/Heap Memory Visualization
**What:** Two-panel display showing stack variables with references pointing to heap objects
**When to use:** When visualizing reference semantics (arrays, objects)
**Example (from MemoryModelViz):**
```typescript
// Source: src/components/Concepts/MemoryModelViz.tsx
interface StackItem {
  name: string
  value: string | number
  isReference?: boolean
  refId?: string  // Links to heap object ID
}

interface HeapObject {
  id: string
  type: 'object' | 'array' | 'function'
  label: string
  elements?: (string | number)[]  // For arrays
  marked?: boolean  // Visual highlight state
}

interface Step {
  stack: StackItem[]
  heap: HeapObject[]
  // ...
}
```

### Pattern 3: Binding Visualization (for References)
**What:** Visual arrows/connections showing which stack variables point to which heap objects
**When to use:** Multiple variables referencing same array, mutation effects
**Example (from LoopsViz bindings panel):**
```typescript
// Source: src/components/Concepts/LoopsViz.tsx
interface LoopBinding {
  iteration: number
  variableName: string
  value: number | string
  callbacks?: string[]  // Other things pointing to this binding
}
// Visual: boxes with connecting lines showing shared state
```

### Pattern 4: Component State Management
**What:** useState for level, exampleIndex, stepIndex with handlers for navigation
**When to use:** All step-through visualization components
**Example:**
```typescript
// Source: Common pattern across all *Viz components
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)

const currentExamples = examples[level]
const currentExample = currentExamples[exampleIndex]
const currentStep = currentExample.steps[stepIndex]

const handleLevelChange = (newLevel: Level) => {
  setLevel(newLevel)
  setExampleIndex(0)
  setStepIndex(0)
}
```

### Pattern 5: CSS Variable Scoping for Accent Colors
**What:** Component-local CSS variables for theming
**When to use:** Each *Viz component
**Example:**
```css
/* Source: Established convention */
.container {
  --js-viz-bg: #0d1117;
  --js-viz-border: rgba(255, 255, 255, 0.08);
  --js-viz-accent: #3b82f6;  /* Blue for arrays - differentiate from loops/functions */
}
```
Note: Prior decisions suggest purple (#8b5cf6) was used for FunctionsViz. For ArraysBasicsViz, recommend blue (#3b82f6) to differentiate.

### Anti-Patterns to Avoid
- **Mixing static and step-through patterns:** Current ArraysBasicsViz uses tabs with static content. Replace entirely with step-through.
- **Inline SVG for arrows:** Use CSS/Framer Motion for reference arrows, not SVG paths.
- **Manual DOM manipulation:** All animations via Framer Motion, not direct DOM access.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom tokenizer | `CodePanel` from SharedViz | Already handles line highlighting |
| Step navigation | Custom button logic | `StepControls` from SharedViz | Handles edge cases, optional Play |
| Step description display | Custom text animation | `StepProgress` from SharedViz | Consistent animation, styling |
| Reference arrows | SVG path drawing | CSS pseudo-elements + Framer Motion | Simpler, more maintainable |
| Auto-play iteration | Custom interval | `useAutoPlay` hook | Handles cleanup, pause state |

**Key insight:** The SharedViz components exist specifically to prevent reimplementation. Use them for all standard visualization chrome.

## Common Pitfalls

### Pitfall 1: Forgetting to Reset Step on Example/Level Change
**What goes wrong:** User changes example but step stays at 5, causing undefined currentStep
**Why it happens:** Only updating exampleIndex without resetting stepIndex
**How to avoid:** Always reset stepIndex to 0 when level or example changes (see handleLevelChange pattern)
**Warning signs:** "Cannot read properties of undefined" errors on step navigation

### Pitfall 2: Animating Too Many Elements
**What goes wrong:** UI becomes janky, animations feel overwhelming
**Why it happens:** Every element animating simultaneously with different delays
**How to avoid:** Use AnimatePresence mode="popLayout" for list changes; coordinate related animations with stagger
**Warning signs:** Animation feels busy, layout shifts unexpectedly

### Pitfall 3: Reference Arrow Complexity
**What goes wrong:** SVG arrows become maintenance burden, don't scale with layout
**Why it happens:** Trying to draw actual lines between DOM elements
**How to avoid:** Use visual proximity and matching colors/IDs instead of actual connecting lines. MemoryModelViz uses refId matching, not drawn lines.
**Warning signs:** Arrow positions break on resize, need complex position calculations

### Pitfall 4: Inconsistent State During Method Iteration Animation
**What goes wrong:** Step advances during auto-animation but UI doesn't sync
**Why it happens:** Animation callbacks and step state out of sync
**How to avoid:** For auto-animated iterations (map/filter/reduce), use a single step with internal animation state, not multiple steps
**Warning signs:** User can click Next during animation, breaking sequence

### Pitfall 5: Heap Object Mutation Without Visual Feedback
**What goes wrong:** Array content changes but user doesn't notice
**Why it happens:** Only updating data, no visual indication of change
**How to avoid:** Flash highlight or pulse animation on mutated elements. Use `marked` flag pattern from MemoryModelViz.
**Warning signs:** User confusion about what changed

## Code Examples

### Example 1: Step Interface for ArraysBasicsViz
```typescript
// Recommended interface structure
interface ArrayVisualizationStep {
  id: number
  codeLine: number
  description: string
  phase: 'setup' | 'access' | 'reference' | 'mutate' | 'iterate' | 'result'

  // Memory state
  stack: {
    name: string
    value: string
    isReference?: boolean
    refId?: string
    highlight?: 'new' | 'changed' | 'none'
  }[]

  heap: {
    id: string
    type: 'array' | 'primitive'
    elements: (string | number)[]
    label: string
    highlight?: 'mutated' | 'new' | 'none'
  }[]

  // For method iteration visualization
  iterationState?: {
    method: 'map' | 'filter' | 'reduce'
    currentIndex: number
    accumulator?: string | number  // For reduce
    resultArray?: (string | number)[]  // Growing result
    rejected?: number[]  // Indices rejected by filter
  }

  output: string[]
}
```

### Example 2: Reference Copy Animation Pattern
```typescript
// Step showing reference copy (arr2 = arr1)
{
  id: 3,
  codeLine: 2,
  description: 'arr2 = arr1 - arr2 now points to the SAME array in memory',
  phase: 'reference',
  stack: [
    { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
    { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1', highlight: 'new' }
  ],
  heap: [
    { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1', highlight: 'none' }
  ],
  output: []
}
```

### Example 3: Mutation Effect Pattern
```typescript
// Step showing mutation through reference
{
  id: 4,
  codeLine: 3,
  description: 'arr2.push(4) - Mutates the shared array. arr1 sees the change!',
  phase: 'mutate',
  stack: [
    { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
    { name: 'arr2', value: '-> #1', isReference: true, refId: 'array1' }
  ],
  heap: [
    { id: 'array1', type: 'array', elements: [1, 2, 3, 4], label: '#1', highlight: 'mutated' }
  ],
  output: []
}
```

### Example 4: Spread Operator Pattern
```typescript
// Step showing spread creating new array
{
  id: 3,
  codeLine: 2,
  description: '[...arr1] creates a NEW array with copied values',
  phase: 'reference',
  stack: [
    { name: 'arr1', value: '-> #1', isReference: true, refId: 'array1' },
    { name: 'arr2', value: '-> #2', isReference: true, refId: 'array2', highlight: 'new' }
  ],
  heap: [
    { id: 'array1', type: 'array', elements: [1, 2, 3], label: '#1 (source)' },
    { id: 'array2', type: 'array', elements: [1, 2, 3], label: '#2 (copy)', highlight: 'new' }
  ],
  output: []
}
```

### Example 5: Map Iteration State
```typescript
// Step showing map in progress
{
  id: 5,
  codeLine: 2,
  description: 'map() is processing each element, doubling the values',
  phase: 'iterate',
  stack: [
    { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' },
    { name: 'doubled', value: '-> #2', isReference: true, refId: 'result' }
  ],
  heap: [
    { id: 'nums', type: 'array', elements: [1, 2, 3], label: 'source' },
    { id: 'result', type: 'array', elements: [2, 4], label: 'result (building...)' }
  ],
  iterationState: {
    method: 'map',
    currentIndex: 2,  // Currently processing index 2
    resultArray: [2, 4]  // Result so far
  },
  output: []
}
```

### Example 6: Reduce Accumulator Display
```typescript
// Step showing reduce with accumulator
{
  id: 4,
  codeLine: 2,
  description: 'reduce() adding each element to accumulator',
  phase: 'iterate',
  stack: [
    { name: 'nums', value: '-> #1', isReference: true, refId: 'nums' }
  ],
  heap: [
    { id: 'nums', type: 'array', elements: [1, 2, 3, 4], label: 'array' }
  ],
  iterationState: {
    method: 'reduce',
    currentIndex: 2,
    accumulator: 6  // 0 + 1 + 2 + 3 so far
  },
  output: []
}
```

## Discretionary Decisions

Based on CONTEXT.md "Claude's Discretion" items and research of existing patterns:

### Memory Address Representation
**Decision:** Use heap boxes with ID labels (like MemoryModelViz "#1", "#2")
**Rationale:** Consistent with MemoryModelViz pattern, simpler than inline addresses

### Mutation Highlight Approach
**Decision:** Color flash (green border pulse) + background color change
**Rationale:** MemoryModelViz uses `marked` flag with CSS styling. Combine brief animation with persistent color for visibility.

### Warning for Shared Reference Mutation
**Decision:** Add warning badge when mutation affects multiple references
**Rationale:** This is the key learning moment - make it explicit with a small badge like "Both arr1 and arr2 affected!"

### Example Structure
**Decision:** Separate examples for mutating vs non-mutating, grouped by level
**Rationale:** Consistent with other *Viz components using level/example structure. Each example focuses on one concept.

### Method Iteration Animation
**Decision:** Use `useAutoPlay` for animated iteration with visible pause state
**Rationale:** CONTEXT.md says "animate automatically" - hook provides proper cleanup and pause capability

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tab-based static display | Step-through with data model | This phase | Full rewrite of ArraysBasicsViz |
| N/A (new capability) | Memory stack/heap visualization | This phase | Shows reference semantics visually |

**Current implementation (to be replaced):**
- Tab-based with 'access', 'methods', 'transform' tabs
- Static display, no step-through
- No memory model visualization
- No level progression

## Open Questions

1. **Auto-play Speed for Iterations**
   - What we know: useAutoPlay hook exists with configurable interval
   - What's unclear: Optimal speed for map/filter/reduce animations (500ms? 750ms?)
   - Recommendation: Start with 750ms, can be adjusted

2. **Heap Object Sizing**
   - What we know: MemoryModelViz uses fixed-size boxes
   - What's unclear: How to handle long arrays (e.g., 10+ elements)
   - Recommendation: Truncate display with "..." after 6 elements

## Sources

### Primary (HIGH confidence)
- `/src/components/Concepts/FunctionsViz.tsx` - Level/example/step pattern reference
- `/src/components/Concepts/LoopsViz.tsx` - Bindings visualization pattern
- `/src/components/Concepts/VariablesViz.tsx` - State/scope visualization pattern
- `/src/components/Concepts/MemoryModelViz.tsx` - Stack/heap with reference arrows
- `/src/components/SharedViz/` - Reusable components (CodePanel, StepProgress, StepControls)
- `/src/components/Concepts/ArraysBasicsViz.tsx` - Current implementation to replace

### Secondary (MEDIUM confidence)
- CONTEXT.md Phase 5 - User decisions and discretionary items
- Prior STATE.md decisions - CSS variable scoping, accent colors

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already exist
- Architecture: HIGH - patterns clearly established in codebase
- Pitfalls: HIGH - derived from direct code analysis
- Discretionary decisions: MEDIUM - recommendations based on patterns

**Research date:** 2026-01-24
**Valid until:** Stable - internal patterns unlikely to change
