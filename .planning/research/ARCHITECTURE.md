# Architecture Patterns: Step-Through Code Visualizations

**Domain:** Interactive code step-through visualization components
**Researched:** 2026-01-24
**Confidence:** HIGH (based on existing codebase patterns and analysis)

## Executive Summary

The codebase already has **two proven patterns** for step-through visualizations:

1. **Self-Contained Viz Components** (`EventLoopViz`, `HoistingViz`, `ClosuresViz`, `PromisesViz`) - All-in-one components with embedded step data, local state, and domain-specific visual panels.

2. **Composable Panel Components** (`ConceptPanel` + `TwoPointersConcept`, `HashMapConcept`) - Generic controller with pluggable visualization components receiving step data as props.

For enhanced visualizations, **follow Pattern 1** (self-contained) for complex, unique visualizations. Use **Pattern 2** (composable) when building variations of similar patterns (e.g., multiple two-pointer problems).

---

## Recommended Architecture

### High-Level Component Structure

```
StepThroughVisualization
├── StateSelector         # Level/example/difficulty tabs
├── CodePanel             # Code display with line highlighting
├── VisualPanels[]        # Domain-specific visual state panels
│   ├── CallStackPanel
│   ├── VariablesPanel
│   ├── QueuePanel
│   ├── HeapPanel
│   └── [Custom]Panel
├── DescriptionPanel      # Current step explanation
├── OutputPanel           # Console/result output
├── ControlBar            # Prev/Play/Next/Reset + progress
└── InsightPanel          # Key learning takeaway
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Container Viz** | Owns state (level, example, step), defines Step interface | All child panels via props/direct access |
| **CodePanel** | Renders code with line numbers, highlights current line | Receives `code[]`, `highlightLines[]` from parent |
| **VisualPanel** | Renders domain-specific state (stack, heap, queues, etc.) | Receives step's visual state slice |
| **ControlBar** | Prev/Next/Play/Reset buttons, progress indicator | Calls parent's step navigation handlers |
| **DescriptionPanel** | Shows step description with animation | Receives `currentStep.description` |

### Data Flow Direction

```
┌────────────────────────────────────────────────────────────────────┐
│                        Container Component                          │
│  ┌─────────────────┐                                               │
│  │  Static Data    │   examples: Record<Level, Example[]>          │
│  │  (embedded)     │   Each Example has: code[], steps[], insight  │
│  └────────┬────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────┐                                               │
│  │  Local State    │   level, exampleIndex, stepIndex, isPlaying  │
│  │  (useState)     │                                               │
│  └────────┬────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────┐                                               │
│  │  Derived State  │   currentExample = examples[level][exampleIndex]│
│  │  (computed)     │   currentStep = currentExample.steps[stepIndex]│
│  └────────┬────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Child Components                          │   │
│  │  CodePanel(code, highlightLine)                             │   │
│  │  VisualPanels(currentStep.visualState)                      │   │
│  │  DescriptionPanel(currentStep.description)                  │   │
│  │  ControlBar(handlers, stepIndex, totalSteps)                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

**Key principle:** Data flows DOWN. Events flow UP. Step changes trigger re-renders of all visual panels.

---

## Step Data Structure (Core Interface)

Based on analysis of 5+ existing visualization components, here is the recommended Step interface:

```typescript
interface Step {
  id: number

  // Code highlighting
  codeLine: number              // Single line to highlight (-1 for none)
  highlightLines?: number[]     // Multiple lines (for complex highlights)

  // Explanation
  phase: string                 // e.g., 'Creation', 'Execution', 'Return'
  description: string           // Human-readable explanation

  // Visual state (domain-specific, varies by visualization type)
  // Pick what your viz needs:

  // For execution visualizations:
  callStack?: StackFrame[]
  variables?: Variable[]
  scopes?: Scope[]

  // For queue/async visualizations:
  microQueue?: string[]
  macroQueue?: string[]

  // For memory/closure visualizations:
  heap?: HeapObject[]

  // For algorithm visualizations:
  array?: (number | string)[]
  pointers?: Record<string, number>
  highlights?: number[]

  // Common across all:
  output?: string[]             // Console output at this step
  error?: string                // Error message if applicable
  annotations?: string[]        // Text labels on visuals
  result?: unknown              // Final result display
}
```

### Example-Level Structure

```typescript
interface Example {
  id: string
  title: string
  code: string[]                // Lines of code
  steps: Step[]                 // All steps for this example
  insight: string               // Key learning takeaway
}

// Organize by difficulty
type Level = 'beginner' | 'intermediate' | 'advanced'
const examples: Record<Level, Example[]> = { ... }
```

---

## Patterns to Follow

### Pattern 1: Self-Contained Visualization Component

**When:** Complex, unique visualization with domain-specific panels.
**Examples:** `EventLoopViz`, `HoistingViz`, `ClosuresViz`

```typescript
export function ConceptViz() {
  // State
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Derived
  const currentExamples = examples[level]
  const currentExample = currentExamples[exampleIndex]
  const currentStep = currentExample.steps[stepIndex]

  // Reset on level/example change
  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel)
    setExampleIndex(0)
    setStepIndex(0)
  }

  // Auto-scroll to highlighted line
  useEffect(() => {
    if (currentStep.codeLine >= 0) {
      lineRefs.current[currentStep.codeLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, currentStep.codeLine])

  // Navigation handlers
  const handleNext = () => {
    if (stepIndex < currentExample.steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  // ... render
}
```

### Pattern 2: Composable Panel with Pluggable Visualization

**When:** Multiple visualizations share controls but have different visual renderers.
**Examples:** `ConceptPanel` with `TwoPointersConcept`, `HashMapConcept`

```typescript
// Generic controller
interface ConceptPanelProps {
  title: string
  keyInsight: string
  type: ConceptType
  steps: ConceptStep[]
}

export function ConceptPanel({ type, steps }: ConceptPanelProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentStep(prev => prev >= steps.length - 1
        ? (setIsPlaying(false), prev)
        : prev + 1
      )
    }, playbackSpeed)
    return () => clearInterval(timer)
  }, [isPlaying, steps.length])

  // Render appropriate visualization
  const renderVisualization = () => {
    switch (type) {
      case 'two-pointers-converge':
      case 'two-pointers-same-dir':
        return <TwoPointersConcept step={steps[currentStep]} type={type} />
      case 'bit-manipulation':
        return <BitManipulationConcept step={steps[currentStep]} />
      default:
        return null
    }
  }
}

// Pluggable visualization (receives step as prop)
interface TwoPointersConceptProps {
  step: ConceptStep
  type: ConceptType
}

export function TwoPointersConcept({ step, type }: TwoPointersConceptProps) {
  const { visual } = step
  // Pure render based on step.visual
}
```

### Pattern 3: Animation Coordination with Framer Motion

**Established pattern:** Use `AnimatePresence` with `mode="popLayout"` for smooth step transitions.

```typescript
// Step description animation
<AnimatePresence mode="wait">
  <motion.div
    key={`${level}-${exampleIndex}-${stepIndex}`}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
  >
    {currentStep.description}
  </motion.div>
</AnimatePresence>

// List items (stack, queue) animation
<AnimatePresence mode="popLayout">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Global Store for Standalone Visualizations

**What:** Using Zustand/Redux for self-contained visualization state.
**Why bad:** Adds complexity without benefit. Each viz is independent with no shared state needs.
**Instead:** Use `useState` for local state. The codebase's `executionStore` is for the interpreter feature only.

### Anti-Pattern 2: Fetching Step Data Dynamically

**What:** Loading steps from API or computing them on-the-fly.
**Why bad:** Adds latency, error handling, loading states. Step data is static and known at build time.
**Instead:** Embed step data directly in the component as a constant.

### Anti-Pattern 3: Shared Mutable Step State

**What:** Mutating the step object during visualization.
**Why bad:** Breaks stepping backward, causes stale state bugs.
**Instead:** Steps are immutable snapshots. Each step contains complete state for that moment.

### Anti-Pattern 4: Over-Generalization

**What:** Building an abstract "universal step-through engine" that handles all visualization types.
**Why bad:** The codebase has 30+ visualizations with different Step shapes. Abstraction adds complexity.
**Instead:** Let each visualization define its own Step interface. Share only truly common pieces (controls, code panel).

---

## Component Decomposition Recommendations

### Extractable Shared Components (DO extract these)

| Component | Purpose | Already Exists? |
|-----------|---------|-----------------|
| `LevelSelector` | beginner/intermediate/advanced tabs | No (repeated inline) |
| `ExampleSelector` | Tab buttons for examples within level | No (repeated inline) |
| `CodePanel` | Code display with line highlighting | No (repeated inline) |
| `StepControls` | Prev/Play/Next/Reset buttons | Partial (`ConceptPanel`) |
| `StepDescription` | Animated step explanation | No (repeated inline) |
| `KeyInsight` | Bottom insight box | No (repeated inline) |

### Keep Domain-Specific (DO NOT extract)

| Component | Why Keep Separate |
|-----------|-------------------|
| Visual panels (stack, heap, queues) | Each has unique layout, animations, data shape |
| Phase badge colors | Different semantics per visualization |
| Step interface | Varies significantly by domain |

### Suggested Extraction Priority

1. **CodePanel** - Identical across all visualizations
2. **StepControls** - Identical logic, minor styling differences
3. **LevelSelector + ExampleSelector** - Identical pattern
4. **StepDescription with AnimatePresence** - Identical animation pattern

---

## Suggested Build Order

Based on dependencies and complexity:

### Phase 1: Foundation (build first)

1. **Define Step interfaces** for each new visualization type
2. **Create example data** - The hardest part is authoring good step-by-step content
3. **Scaffold container component** with local state pattern

### Phase 2: Core Panels

4. **CodePanel** (or extract shared version)
5. **Domain-specific visual panel(s)** - The unique value of each visualization
6. **Output/console panel**

### Phase 3: Controls & Polish

7. **StepControls** with navigation handlers
8. **Auto-play with interval** (copy from `ConceptPanel`)
9. **Keyboard shortcuts** (Shift+Left/Right pattern)
10. **Auto-scroll to highlighted line**

### Phase 4: Enhancement (optional)

11. **Speed controls** (0.5x, 1x, 2x)
12. **Progress bar**
13. **Responsive layout** (mobile considerations)

---

## State Management Recommendations

### For Self-Contained Visualizations

```typescript
// All state is local - no store needed
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)
const [isPlaying, setIsPlaying] = useState(false)
const [playbackSpeed, setPlaybackSpeed] = useState(1500) // ms
```

### For Cross-Component Communication (rare)

If visualization needs to communicate with other page components (e.g., code editor), use:
- **Props drilling** for simple cases
- **Context** for deeply nested components
- **Zustand** only if truly shared state (interpreter feature uses this)

### Do NOT Need

- React Query (no data fetching)
- Redux (overkill for local state)
- URL state (steps are ephemeral, not deep-linked)

---

## Animation Coordination Strategy

### Principle: Animate State Changes, Not Step Transitions

```typescript
// GOOD: Animate when visual state changes
<motion.div
  animate={{
    scale: isHighlighted ? 1.1 : 1,
    boxShadow: isHighlighted ? '0 0 16px var(--accent)' : 'none',
  }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  {value}
</motion.div>

// GOOD: Animate list additions/removals
<AnimatePresence mode="popLayout">
  {stack.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      layout
    />
  ))}
</AnimatePresence>
```

### Animation Constants (established in codebase)

```typescript
// Spring for interactive elements
const springConfig = { type: 'spring', stiffness: 400, damping: 25 }

// Fade for descriptions
const fadeConfig = { duration: 0.2 }

// Stagger for lists (delay between items)
const staggerDelay = 0.1
```

---

## CSS Architecture

### Established Pattern: CSS Modules

Each visualization has its own `.module.css` file:
- `EventLoopViz.module.css`
- `HoistingViz.module.css`
- etc.

### Shared Styles

`SharedViz.module.css` contains common patterns:
- `.container` - Flex column with gap
- `.controls` - Button row styling
- `.btn`, `.btnSecondary` - Button variants
- `.codeDisplay`, `.codeBlock` - Code panel styles

### Neon Box Pattern (visual panels)

```css
.neonBox {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.neonBoxHeader {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent-blue);
  background: rgba(102, 126, 234, 0.1);
}

.neonBoxInner {
  padding: var(--space-md);
}
```

---

## Roadmap Implications

### Build Order Based on Dependencies

1. **Step interface + example data** - Must come first (everything depends on this)
2. **Container with state** - Provides the step navigation foundation
3. **Visual panels** - The core value; can be built in parallel with controls
4. **Controls + polish** - Can be added incrementally

### Phases That Likely Need Research

- **New visualization types** (e.g., graph traversal) - Need to design Step interface
- **Performance optimization** - Only if step counts exceed ~100

### Standard Patterns (No Research Needed)

- State management (useState pattern proven)
- Animation (Framer Motion patterns proven)
- Styling (CSS Modules + SharedViz proven)
- Controls (ConceptPanel pattern proven)

---

## Sources

**Primary (HIGH confidence):**
- Existing codebase analysis:
  - `/src/components/Concepts/EventLoopViz.tsx` (1212 lines)
  - `/src/components/Concepts/HoistingViz.tsx` (643 lines)
  - `/src/components/Concepts/ClosuresViz.tsx` (857 lines)
  - `/src/components/Concepts/PromisesViz.tsx` (672 lines)
  - `/src/components/ConceptPanel/ConceptPanel.tsx` (217 lines)
  - `/src/components/ConceptPanel/TwoPointersConcept.tsx` (171 lines)
  - `/src/components/ConceptPanel/HashMapConcept.tsx` (229 lines)
  - `/src/store/executionStore.ts` (301 lines)
  - `/src/types/index.ts` (327 lines)

**Supporting:**
- Framer Motion patterns used consistently across all visualization components
- CSS Modules with SharedViz.module.css for common styles
