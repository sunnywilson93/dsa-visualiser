# Architecture: Viz Component Integration

**Milestone:** Adding ~26 New Step-Through Visualizations
**Researched:** 2026-01-30
**Confidence:** HIGH (based on direct codebase analysis of 37 existing Viz components)

## Executive Summary

The existing architecture follows a **self-contained component pattern** where each Viz component embeds its own type definitions, step data, and state management. There are no formal shared Viz wrapper components - instead, UI patterns are replicated across components.

**Recommendation:** Follow the established copy-and-adapt pattern for new visualizations. Extract 4 shared UI components (LevelSelector, ExampleSelector, StepControls, StepDescription) to reduce the ~120 lines of duplicated UI code per component.

---

## Current Architecture Analysis

### Existing Viz Component Count

| Category | Components | LOC Range | Examples |
|----------|------------|-----------|----------|
| Async Concepts | 7 | 130-1269 | PromisesViz, EventLoopViz, AsyncPatternsViz |
| OOP Concepts | 4 | 389-886 | PrototypesViz, ThisKeywordViz, ClosuresViz |
| Core Fundamentals | 11 | 77-1569 | VariablesViz, FunctionsViz, LoopsViz |
| Runtime/Browser | 6 | 262-700 | V8EngineViz, NodeEventLoopViz, WebWorkersViz |
| Evolution/History | 5 | 262-365 | AsyncEvolutionViz, ModuleEvolutionViz |
| Modern JS | 4 | 31-68 | ModernJSViz (mode-based), ErrorHandlingViz |
| **Total** | **37** | | |

### Component Structure Pattern

Every existing Viz component follows this canonical structure:

```typescript
// =============================================================
// SECTION 1: Type Definitions (embedded in component file)
// =============================================================

interface Step {
  id: number
  phase: string
  description: string
  highlightLines: number[]
  // Domain-specific fields vary:
  // - Async: callStack, microQueue, macroQueue, output, promises
  // - OOP: heap, thisValue, checkedObjects, foundAt
  // - Memory: stack, references
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

type Level = 'beginner' | 'intermediate' | 'advanced'

// =============================================================
// SECTION 2: Static Configuration
// =============================================================

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

// =============================================================
// SECTION 3: Examples Data (bulk of file - 100-800+ lines)
// =============================================================

const examples: Record<Level, Example[]> = {
  beginner: [
    {
      id: 'basic-example',
      title: 'Basic Example',
      code: [...],
      steps: [...],
      insight: '...'
    }
  ],
  intermediate: [...],
  advanced: [...]
}

// =============================================================
// SECTION 4: Component with Internal State
// =============================================================

export function ConceptViz() {
  // State
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Derived state (computed on every render)
  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  // Auto-scroll effect
  useEffect(() => {
    const firstHighlightedLine = currentStep.highlightLines[0]
    if (firstHighlightedLine !== undefined && lineRefs.current[firstHighlightedLine]) {
      lineRefs.current[firstHighlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.highlightLines])

  // Handlers
  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  const handleExampleChange = (index: number) => {
    setExampleIndex(index)
    setStepIndex(0)
  }

  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) setStepIndex(s => s + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1)
  }

  const handleReset = () => setStepIndex(0)

  // Render
  return (
    <div className="flex flex-col gap-6">
      {/* Level selector - ~20 lines */}
      {/* Example selector - ~15 lines */}
      {/* Code panel with line highlighting - ~25 lines */}
      {/* Domain-specific visualization - varies */}
      {/* Step description with animation - ~15 lines */}
      {/* Navigation controls - ~20 lines */}
      {/* Key insight box - ~5 lines */}
    </div>
  )
}
```

### CSS Module Usage

| Pattern | Files | Notes |
|---------|-------|-------|
| Pure Tailwind (inline) | 18 | Most recent components |
| CSS Module + Tailwind | 12 | Hybrid approach |
| Pure CSS Module | 7 | Older components |

**Trend:** Newer components use inline Tailwind. The project is migrating toward Tailwind-only.

---

## Integration Points

### 1. ConceptPageClient Registration

**File:** `src/app/concepts/[conceptId]/ConceptPageClient.tsx`

Every visualization must be registered here with a dynamic import:

```typescript
const vizComponents: Record<string, ComponentType> = {
  // Existing mappings...
  'closures': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),

  // Multiple concept IDs can map to same component with different modes
  'closure-definition': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
  'closure-practical-uses': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
}
```

**Pattern for Mode-Based Components:**
Some visualizations (AsyncPatternsViz, ModernJSViz, ArrayMethodsViz) accept a `mode` prop to show different content. This is useful when similar concepts share visualization patterns:

```typescript
// Registration
'callbacks-fundamentals': dynamic(() => import('@/components/Concepts/AsyncPatternsViz').then(m => m.AsyncPatternsViz)),

// Component accepts mode
export function AsyncPatternsViz({ mode = 'callbacks' }: { mode?: 'callbacks' | 'promises' | 'async-await' })
```

### 2. Index.ts Re-export

**File:** `src/components/Concepts/index.ts`

```typescript
export { NewConceptViz } from './NewConceptViz'
```

### 3. Concepts Data Definition

**File:** `src/data/concepts.ts`

Each concept needs a data definition with matching `id`:

```typescript
{
  id: 'new-concept',
  title: 'New Concept Title',
  category: 'fundamentals' | 'core' | 'advanced' | 'runtime' | 'backend' | 'browser',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  description: '...',
  shortDescription: '...',
  keyPoints: [...],
  examples: [...],
  // Optional
  commonMistakes?: [...],
  interviewTips?: [...],
  prerequisites?: [...],
  nextConcepts?: [...]
}
```

---

## Shared Patterns Analysis

### Async Visualizations

**Current Components:**
| Component | Purpose | Unique Elements |
|-----------|---------|-----------------|
| PromisesViz | Promise state transitions | Promise cards with pending/fulfilled/rejected |
| EventLoopViz | Event loop full visualization | Call stack, task queues, Web APIs |
| AsyncPatternsViz | Callback vs Promise vs async/await | Comparison layout |
| EventLoopGranularViz | Event loop deep dive | Mode-based (call-stack, micro, macro) |
| NodeEventLoopViz | Node.js event loop phases | Phase diagram |
| AsyncEvolutionViz | History of async patterns | Timeline view |

**Shared Step Data Structure:**
```typescript
interface AsyncStep {
  id: number
  phase: 'sync' | 'micro' | 'macro' | 'idle'
  description: string
  codeLine: number
  highlightLines: number[]
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  activeWebApi?: string        // For EventLoopViz
  promises?: PromiseState[]    // For PromisesViz
}
```

**Shared Visual Elements:**
1. **Queue Visualization** - Horizontal/vertical list of task names
2. **Call Stack** - LIFO stack of execution contexts
3. **Promise Cards** - State indicator with value/reason
4. **Phase Badge** - Colored pill showing current phase
5. **Output Console** - Sequential log output

**New Async Concepts to Build:**
- Generators (iterator protocol)
- AsyncIterators (for await...of)
- AbortController (cancellation)
- Fetch API patterns

**Template Recommendation:** Use EventLoopViz as template for queue-based concepts, PromisesViz for state-based concepts.

### OOP Visualizations

**Current Components:**
| Component | Purpose | Unique Elements |
|-----------|---------|-----------------|
| PrototypesViz | Prototype chain lookup | Chain visualization with arrow connections |
| ThisKeywordViz | Binding rules | Execution context box with this value |
| ClosuresViz | Scope chain, closures | Heap memory with scope references |
| CompositionViz | Function composition | Pipeline visualization |

**Shared Step Data Structure:**
```typescript
interface OOPStep {
  id: number
  phase: string
  description: string
  highlightLines: number[]

  // Closure/Scope
  callStack?: ExecutionContext[]
  heap?: HeapObject[]
  output?: string[]

  // Prototype
  checkedObjects?: string[]
  foundAt?: string | null

  // this keyword
  thisValue?: string
  thisExplanation?: string
}

interface ExecutionContext {
  id: string
  name: string
  variables: { name: string; value: string }[]
  outerRef: string | null
}

interface HeapObject {
  id: string
  label: string
  type: 'scope' | 'function' | 'prototype' | 'instance'
  vars: { name: string; value: string }[]
  protoRef?: string
  scopeRef?: string
  color?: string
}
```

**Shared Visual Elements:**
1. **Heap Memory Box** - Neon-bordered container with objects
2. **Call Stack** - Vertical stack of execution contexts
3. **Scope/Prototype Arrows** - References between objects
4. **"Found!" Badge** - Success indicator for lookups
5. **Property List** - Key-value pairs inside objects

**New OOP Concepts to Build:**
- ES6 Classes (class syntax sugar)
- Class Inheritance (extends, super)
- Static Methods/Properties
- Private Fields (#)
- Getters/Setters
- Mixins pattern

**Template Recommendation:** Use PrototypesViz as template for inheritance, ThisKeywordViz for context-based concepts, ClosuresViz for scope visualization.

---

## Component Composition Recommendations

### Tier 1: Extract Immediately (High ROI)

These patterns are duplicated across all 37 components with minimal variation:

| Component | Current Lines | Reuse Count | Savings |
|-----------|--------------|-------------|---------|
| `LevelSelector` | ~20 | 37 | ~740 lines |
| `ExampleSelector` | ~15 | 37 | ~555 lines |
| `StepControls` | ~25 | 37 | ~925 lines |
| `StepDescription` | ~15 | 37 | ~555 lines |
| **Total** | ~75 | | **~2,775 lines** |

**Proposed Interface:**

```typescript
// src/components/Concepts/shared/LevelSelector.tsx
interface LevelSelectorProps {
  level: 'beginner' | 'intermediate' | 'advanced'
  onChange: (level: 'beginner' | 'intermediate' | 'advanced') => void
}

// src/components/Concepts/shared/ExampleSelector.tsx
interface ExampleSelectorProps {
  examples: { id: string; title: string }[]
  currentIndex: number
  onChange: (index: number) => void
}

// src/components/Concepts/shared/StepControls.tsx
interface StepControlsProps {
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  isComplete?: boolean
}

// src/components/Concepts/shared/StepDescription.tsx
interface StepDescriptionProps {
  stepIndex: number
  totalSteps: number
  description: string
  animationKey: string  // For AnimatePresence
}
```

### Tier 2: Extract After 3+ Uses

| Component | Use Case | Extract When |
|-----------|----------|--------------|
| `AsyncQueueViz` | Micro/macro task queue cards | After 3 async visualizations |
| `HeapMemoryViz` | Heap object visualization | After 3 scope/closure visualizations |
| `PrototypeChainViz` | Linked prototype objects | After 2+ prototype visualizations |
| `CodePanelWithHighlight` | Syntax-highlighted code | Could extract now, moderate priority |

### Tier 3: Do Not Abstract

| Pattern | Reason |
|---------|--------|
| Step data structures | Too domain-specific per concept |
| Animation sequences | Custom per visualization |
| Layout grids | Varies by visualization complexity |
| Color schemes | Domain-specific (async=blue, OOP=purple) |

---

## Data Structure for New Visualizations

### Base Types (shared/types.ts)

```typescript
// Base interfaces that all step types extend
export interface BaseStep {
  id: number
  phase: string
  description: string
}

export interface CodeStep extends BaseStep {
  highlightLines: number[]
  codeLine?: number  // Single line focus
}

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface BaseExample<TStep extends BaseStep> {
  id: string
  title: string
  code: string[]
  steps: TStep[]
  insight: string
}

export const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}
```

### Domain Extensions

```typescript
// Async domain
export interface AsyncStep extends CodeStep {
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  phase: 'sync' | 'micro' | 'macro' | 'idle'
}

// OOP domain
export interface OOPStep extends CodeStep {
  heap: HeapObject[]
  callStack?: ExecutionContext[]
}

// Prototype domain
export interface PrototypeStep extends CodeStep {
  prototypeChain: ProtoNode[]
  checkedObjects: string[]
  foundAt: string | null
}

// this keyword domain
export interface ThisStep extends CodeStep {
  thisValue: string
  thisExplanation: string
  bindingType: 'implicit' | 'explicit' | 'new' | 'default' | 'arrow'
}
```

---

## Suggested Build Order

### Phase 1: Extract Shared UI (Do First)

1. Create `src/components/Concepts/shared/` directory
2. Extract `LevelSelector.tsx`
3. Extract `ExampleSelector.tsx`
4. Extract `StepControls.tsx`
5. Extract `StepDescription.tsx`
6. Create `src/components/Concepts/shared/types.ts` with base types
7. Update 2-3 existing Viz components to use shared components (validation)

**Estimated effort:** 1-2 hours
**Validation:** Existing visualizations work identically

### Phase 2: Async Visualizations (Template: EventLoopViz/PromisesViz)

Build order based on complexity and template reuse:

| Order | Component | Template | Notes |
|-------|-----------|----------|-------|
| 1 | GeneratorsViz | PromisesViz | Iterator state visualization |
| 2 | AsyncIteratorsViz | GeneratorsViz | Extends generator pattern |
| 3 | AbortControllerViz | EventLoopViz | Cancellation token visualization |
| 4 | FetchAPIViz | PromisesViz | Request/response lifecycle |

### Phase 3: OOP Visualizations (Template: PrototypesViz/ClosuresViz)

| Order | Component | Template | Notes |
|-------|-----------|----------|-------|
| 1 | ClassSyntaxViz | PrototypesViz | ES6 class as sugar over prototypes |
| 2 | ClassInheritanceViz | PrototypesViz | extends/super visualization |
| 3 | StaticMembersViz | ClassSyntaxViz | Static methods/properties |
| 4 | PrivateFieldsViz | ClosuresViz | # fields as closure-like behavior |
| 5 | GettersSettersViz | ClassSyntaxViz | Property descriptors |

### Phase 4: Additional Concepts

Lower coupling, can parallelize:

| Order | Component | Template | Notes |
|-------|-----------|----------|-------|
| 1 | ProxyReflectViz | New | Intercept operations visualization |
| 2 | SymbolsViz | DataTypesViz | Symbol registry, well-known symbols |
| 3 | WeakMapSetViz | MemoryModelViz | GC-friendly references |
| 4 | IteratorsViz | GeneratorsViz | Iterator protocol |
| 5 | MapSetViz | ObjectsBasicsViz | Collection visualization |

---

## File Organization for New Visualizations

```
src/components/Concepts/
  shared/
    types.ts                    # Base interfaces, Level type
    LevelSelector.tsx           # Level toggle component
    ExampleSelector.tsx         # Example pills component
    StepControls.tsx            # Navigation controls
    StepDescription.tsx         # Animated step text
    index.ts                    # Re-exports

  NewConceptViz.tsx             # Main component with embedded data
  NewConceptViz.module.css      # (Optional, prefer Tailwind)

  index.ts                      # Add export
```

**Registration checklist for each new visualization:**

- [ ] Create `NewConceptViz.tsx` in `src/components/Concepts/`
- [ ] Add export to `src/components/Concepts/index.ts`
- [ ] Add dynamic import to `src/app/concepts/[conceptId]/ConceptPageClient.tsx`
- [ ] Add concept definition to `src/data/concepts.ts`
- [ ] Test rendering at `/concepts/[new-concept-id]`

---

## Anti-Patterns to Avoid

### 1. Over-Abstraction of Step Data

**DON'T:**
```typescript
// Generic step renderer
function renderStep(step: GenericStep) {
  return step.type === 'async' ? <AsyncViz step={step} /> : <OOPViz step={step} />
}
```

**WHY:** Step visualization IS the educational value. Generic rendering dilutes clarity.

**DO:** Hand-craft each visualization section for maximum educational impact.

### 2. Shared State Stores

**DON'T:**
```typescript
// Global visualization store
const useVizStore = create((set) => ({
  level: 'beginner',
  stepIndex: 0,
  // ...
}))
```

**WHY:** Each visualization is self-contained. Shared state adds complexity without benefit.

**DO:** Use component-local `useState`. State resets when navigating between concepts.

### 3. Over-Dynamic Step Rendering

**DON'T:**
```typescript
// Dynamically render based on step.visualElements array
step.visualElements.map((el) => renderElement(el))
```

**WHY:** Visualization layout is intentionally designed per concept. Dynamic rendering loses educational structure.

**DO:** Explicit JSX for each visualization section.

### 4. Premature Extraction

**DON'T:** Extract domain-specific components (AsyncQueueViz, HeapViz) before confirming the pattern appears 3+ times.

**WHY:** First implementation is often wrong. Wait for patterns to emerge.

**DO:** Copy-paste for first 2 implementations, then extract if pattern stabilizes.

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| Component Pattern | Self-contained with embedded data, copy-and-adapt |
| State Management | Local useState, no global state |
| Styling | Inline Tailwind (follow project trend) |
| Data Structure | Extend base Step/Example interfaces per domain |
| Shared Components | Extract Tier 1 UI (LevelSelector, etc.), defer domain-specific |
| Build Order | Shared UI -> Async -> OOP -> Remaining |
| Registration | Dynamic import in ConceptPageClient + index.ts + concepts.ts |

**Key Insight:** The existing architecture prioritizes educational clarity over DRY. Each visualization is optimized for its specific concept. Follow this philosophy: share UI chrome, but keep domain visualization logic in individual components.

---

## Appendix: Existing Component Templates

### Template A: Full Step-Through (ClosuresViz pattern)

Best for: Concepts with call stack, heap memory, scope chain visualization

**LOC:** 600-900
**Features:**
- Level selector with 3 levels
- Multiple examples per level
- Code panel with line highlighting
- Call Stack visualization
- Heap Memory visualization
- Output console
- Animated step description

### Template B: Lookup Animation (PrototypesViz pattern)

Best for: Concepts with chain traversal, property lookup

**LOC:** 580-800
**Features:**
- Level selector with 3 levels
- Multiple examples per level
- Property lookup selector
- Chain visualization with highlighting
- Step-by-step lookup animation
- "Found!" indicator

### Template C: Queue-Based (EventLoopViz pattern)

Best for: Async concepts with task queues, microtask/macrotask

**LOC:** 920-1270
**Features:**
- Level selector with 3 levels
- Multiple examples per level
- Code panel with phase indicator
- Call Stack visualization
- Microtask Queue visualization
- Macrotask (Task) Queue visualization
- Web APIs sidebar
- Event Loop animation
- Output console
- Phase-colored badges

### Template D: Mode-Based Simple (AsyncPatternsViz pattern)

Best for: Quick comparisons, pattern overviews without deep step-through

**LOC:** 60-130
**Features:**
- Mode prop for different views
- Simplified step navigation
- Code comparison layout
- Good for overview concepts

### Template E: Single Focus (DataTypesViz pattern)

Best for: Simple concepts with interactive exploration

**LOC:** 77-400
**Features:**
- Interactive elements to try
- Simple output display
- No level/example nesting
- Quick reference format
