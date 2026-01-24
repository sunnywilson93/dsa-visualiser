# Phase 8: TwoPointersViz - Research

**Researched:** 2026-01-24
**Domain:** React visualization component with step-through animation
**Confidence:** HIGH

## Summary

Phase 8 builds TwoPointersViz following the established v1.0 visualization pattern. The codebase already has mature patterns for step-through visualizations (LoopsViz, ArraysBasicsViz, etc.) that serve as the template.

The primary research focus is confirming:
1. Existing SharedViz integration patterns
2. Animation patterns using framer-motion
3. Step data structure for pointer visualization
4. Tab-based navigation for variants

**Primary recommendation:** Follow LoopsViz/ArraysBasicsViz patterns exactly, adding pointer-specific visualizations for array indices and decision logic display.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component framework | Project standard |
| framer-motion | 10.x+ | Animation | Already used in all v1.0 visualizations |
| CSS Modules | N/A | Scoped styling | Project standard (*.module.css) |

### Supporting

| Library | Purpose | When to Use |
|---------|---------|-------------|
| SharedViz (internal) | CodePanel, StepControls, StepProgress | Step-through UI integration |
| lucide-react | Icons | UI elements (already in project) |

### Alternatives Considered

None - the project has established patterns that must be followed for consistency.

## Architecture Patterns

### Recommended Component Structure

```
src/components/DSAPatterns/
├── TwoPointersViz/
│   ├── TwoPointersViz.tsx          # Main component
│   ├── TwoPointersViz.module.css   # Styles
│   ├── ArrayDisplay.tsx            # Array with pointer indicators (optional subcomponent)
│   └── DecisionLogic.tsx           # Decision logic panel (optional subcomponent)
└── index.ts                        # Updated barrel export
```

### Pattern 1: Step-Through Visualization (v1.0 Pattern)

**What:** Component manages step state, renders visualization based on current step data
**When to use:** All DSA pattern visualizations
**Example:**
```typescript
// Source: src/components/Concepts/LoopsViz.tsx
type Level = 'beginner' | 'intermediate' | 'advanced'

interface TwoPointerStep {
  id: number
  codeLine: number
  description: string
  phase: 'init' | 'compare' | 'move' | 'done'
  pointers: {
    left: number
    right: number
    // or slow/fast for same-direction variant
  }
  decision?: {
    condition: string      // "Is sum > target?"
    conditionMet: boolean  // true/false
    action: string         // "Move right pointer left"
  }
  array: (number | string)[]
  highlightedCells?: number[]  // Cells being compared
  output?: string[]
}

interface TwoPointerExample {
  id: string
  title: string
  variant: 'converging' | 'same-direction' | 'partition'
  code: string[]
  steps: TwoPointerStep[]
  insight: string
}

const examples: Record<Level, TwoPointerExample[]> = { ... }
```

### Pattern 2: Variant Tab Structure

**What:** Tabs at top for variants, difficulty tabs below, example selector within
**When to use:** This phase per CONTEXT.md decisions
**Example:**
```typescript
// Variant tabs at top level
const [activeVariant, setActiveVariant] = useState<'converging' | 'same-direction' | 'partition'>('converging')

// Difficulty tabs within each variant
const [level, setLevel] = useState<Level>('beginner')

// Example selector within difficulty
const [activeExampleId, setActiveExampleId] = useState<string>(...)
```

### Pattern 3: Animation with framer-motion

**What:** Animate pointer movement and cell highlighting
**When to use:** Pointer position changes, cell state transitions
**Example:**
```typescript
// Source: src/components/Concepts/ArraysBasicsViz.tsx pattern
<motion.div
  key={pointer.position}
  initial={{ x: 0 }}
  animate={{ x: targetX }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  {pointer.label}
</motion.div>
```

### Anti-Patterns to Avoid

- **Storing step data in data file:** Keep steps inside component (v1.0 pattern)
- **Auto-play by default:** User must actively step through (per requirements)
- **Over-abstracting:** Don't create generic "DSAViz" base - each viz is self-contained

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Step controls | Custom buttons | SharedViz/StepControls | Consistent UX |
| Code highlighting | Custom highlighter | SharedViz/CodePanel | Already handles line sync |
| Animation | Manual CSS transitions | framer-motion | Smoother, easier to maintain |
| Tab component | Custom tabs | Native HTML + CSS | Simple, accessible (see LoopsViz level buttons) |

**Key insight:** The v1.0 visualizations already solved the step-through UX. Focus on the Two Pointers-specific visualization logic.

## Common Pitfalls

### Pitfall 1: Animation timing mismatch

**What goes wrong:** Decision logic appears after pointer already moved
**Why it happens:** Animation and state update not coordinated
**How to avoid:** Show decision in same step as the move, animation shows the result
**Warning signs:** Decision text feels "late" or disconnected

### Pitfall 2: Pointer collision display

**What goes wrong:** When pointers meet at same index, labels overlap
**Why it happens:** Both pointers rendered at same position
**How to avoid:** Use combined label ("L,R") per CONTEXT.md decision
**Warning signs:** Visual overlap, unclear which pointer is which

### Pitfall 3: Step count explosion

**What goes wrong:** Full trace of complex algorithms creates 100+ steps
**Why it happens:** Every operation is a step
**How to avoid:** Group logical operations; full trace is fine per CONTEXT.md but keep steps meaningful
**Warning signs:** Users lose engagement, can't see the pattern

### Pitfall 4: Variant switching state leak

**What goes wrong:** Switching variant keeps old step index, causes out-of-bounds
**Why it happens:** Step state not reset
**How to avoid:** Reset to step 0 on variant switch (per CONTEXT.md)
**Warning signs:** Blank visualization or crash after tab switch

## Code Examples

### Array Cell with Pointer Indicator

```typescript
// Based on project styling patterns
<div className={styles.arrayContainer}>
  {array.map((value, index) => (
    <div
      key={index}
      className={cn(
        styles.cell,
        highlightedCells?.includes(index) && styles.active,
        index < left && styles.processed
      )}
    >
      <span className={styles.value}>{value}</span>
      <div className={styles.pointerContainer}>
        {index === left && <span className={styles.pointer}>L</span>}
        {index === right && <span className={styles.pointer}>R</span>}
        {index === left && index === right && (
          <span className={styles.pointer}>L,R</span>
        )}
      </div>
    </div>
  ))}
</div>
```

### Decision Logic Display

```typescript
// Per CONTEXT.md: Above array, question + answer format
{step.decision && (
  <motion.div
    className={styles.decisionPanel}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <span className={styles.question}>{step.decision.condition}</span>
    <span className={styles.answer}>
      {step.decision.conditionMet ? 'Yes' : 'No'} → {step.decision.action}
    </span>
  </motion.div>
)}
```

### SharedViz Integration

```typescript
// Source: src/components/Concepts/LoopsViz.tsx pattern
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

// In render:
<CodePanel code={example.code} currentLine={step.codeLine} />
<StepProgress current={currentStepIndex + 1} total={example.steps.length} />
<StepControls
  onPrev={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
  onNext={() => setCurrentStepIndex(i => Math.min(steps.length - 1, i + 1))}
  onReset={() => setCurrentStepIndex(0)}
  canPrev={currentStepIndex > 0}
  canNext={currentStepIndex < steps.length - 1}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-play default | Manual step-through | v1.0 design | Better learning outcomes |
| Generic viz base | Self-contained components | v1.0 architecture | Easier maintenance |

## Open Questions

None significant. The patterns are well-established from v1.0 and CONTEXT.md decisions cover the gray areas.

## Sources

### Primary (HIGH confidence)

- `src/components/Concepts/LoopsViz.tsx` - Step-through pattern reference
- `src/components/Concepts/ArraysBasicsViz.tsx` - Array visualization pattern
- `src/components/SharedViz/` - Reusable components
- `.planning/phases/08-twopointerviz/08-CONTEXT.md` - User decisions

### Secondary (MEDIUM confidence)

- `src/data/dsaPatterns.ts` - Pattern metadata and variants

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses only existing project dependencies
- Architecture: HIGH - Follows established v1.0 patterns exactly
- Pitfalls: HIGH - Based on v1.0 development experience

**Research date:** 2026-01-24
**Valid until:** Indefinite (internal patterns, not external dependencies)
