# Stack Research: DSA Visualizations

**Project:** DSA Visualiser - Algorithm Pattern Upgrades
**Researched:** 2026-01-24
**Confidence:** HIGH

## Recommendation

**No new dependencies needed.** The existing stack (React 18, Framer Motion 11, Lucide React, CSS Modules) is fully capable of supporting enhanced DSA algorithm visualizations. The upgrade path is architectural (applying proven patterns from JS Concepts), not technological.

## Current Stack Analysis

### What We Have

| Technology | Version | Current Use | DSA Viz Applicability |
|------------|---------|-------------|----------------------|
| **framer-motion** | 11.18.2 | All animations in JS Concepts, ConceptPanel components | Fully sufficient - spring animations, AnimatePresence, layout animations all work |
| **React** | 18.3.1 | Component architecture | Functional components with hooks pattern proven |
| **lucide-react** | 0.400.0 | Icons (Play, Pause) | May need additional icons for DSA (ArrowRight, ArrowLeft, Hash, Binary) |
| **CSS Modules** | native | Scoped styling | Pattern well-established |
| **TypeScript** | 5.5.0 | Type safety | Types already defined in `types/index.ts` |

### Proven Patterns Already Working

1. **SharedViz Components** (`src/components/SharedViz/`)
   - `CodePanel` - Code display with line highlighting
   - `StepProgress` - Step counter with description
   - `StepControls` - Navigation (Prev/Next/Reset/Play)
   - `useAutoPlay` - Auto-advance hook

2. **Animation Patterns** (from `ArraysBasicsViz.tsx`, `EventLoopViz.tsx`)
   - `motion.div` with spring transitions for element entry/exit
   - `AnimatePresence` with `mode="popLayout"` for list animations
   - `whileHover`, `whileTap` for interactions
   - Layout animations for smooth reordering

3. **Multi-Level Examples** (from `ArraysBasicsViz.tsx`)
   - Beginner/Intermediate/Advanced difficulty selection
   - Multiple examples per level
   - Step-through with state management

### Existing DSA Components (Need Upgrade)

| Component | Current State | Gap |
|-----------|--------------|-----|
| `TwoPointersConcept.tsx` | Basic array + pointers | No difficulty levels, no SharedViz integration, single example |
| `HashMapConcept.tsx` | Array + hash map entries | No difficulty levels, limited examples |
| `BitManipulationConcept.tsx` | Binary representation | No difficulty levels, limited interactivity |

## Additions Needed

### Required: None

The existing stack handles all DSA visualization needs:

| DSA Visualization Need | Existing Solution |
|-----------------------|-------------------|
| Array with pointer animations | `motion.div` with spring (already in TwoPointersConcept) |
| Binary number display | Already implemented in BitManipulationConcept |
| Hash table visualization | Already implemented in HashMapConcept |
| Step-through navigation | SharedViz StepControls |
| Difficulty levels | Pattern from ArraysBasicsViz |
| Auto-play | useAutoPlay hook |

### Optional Enhancement: Icon Additions

Lucide React already installed. May use additional icons for DSA context:

```typescript
// Already available in lucide-react, just need to import
import {
  ArrowRight, ArrowLeft,     // Pointer direction
  ArrowLeftRight,            // Converging pointers
  Hash,                      // Hash map operations
  Binary,                    // Bit manipulation
  Crosshair                  // Current position
} from 'lucide-react'
```

**Verdict:** No `npm install` required.

## What NOT to Add

### Rejected: D3.js or Similar

**Why considered:** Complex graph/tree visualizations
**Why rejected:**
- Framer Motion handles all current needs (arrays, hash maps, binary)
- D3 adds 280KB+ bundle size
- Learning curve for team
- Existing patterns prove React + Framer Motion sufficient
- No tree/graph structures in current DSA scope (Two Pointers, Hash Map, Bit Manipulation)

### Rejected: Canvas/WebGL Libraries

**Why considered:** Performance for large visualizations
**Why rejected:**
- DSA examples are small (< 20 elements typically)
- DOM-based animations perform fine
- Accessibility better with DOM elements
- Existing components prove this works

### Rejected: Animation State Libraries (XState, Zustand for animation)

**Why considered:** Complex animation sequencing
**Why rejected:**
- `useState` + `useAutoPlay` hook handle state fine
- Framer Motion's built-in sequencing sufficient
- Would add complexity without benefit

### Rejected: CSS Animation Libraries (Tailwind Animate, Animate.css)

**Why considered:** Quick animation presets
**Why rejected:**
- Framer Motion already provides spring physics (better UX)
- CSS Modules pattern established
- Would create inconsistency with existing components

## Integration Points

### How DSA Viz Will Use Existing SharedViz

```typescript
// Example: Enhanced TwoPointersConcept structure
import { CodePanel, StepProgress, StepControls, useAutoPlay } from '@/components/SharedViz'

function TwoPointersViz() {
  // Same pattern as ArraysBasicsViz
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  // Auto-play integration
  const { isPlaying, toggle } = useAutoPlay({
    onTick: () => setStepIndex(s => s + 1),
    canAdvance: stepIndex < currentExample.steps.length - 1
  })

  return (
    <>
      {/* Level selector - same pattern as ArraysBasicsViz */}
      <LevelSelector level={level} onChange={handleLevelChange} />

      {/* Code panel - from SharedViz */}
      <CodePanel code={currentExample.code} highlightedLine={currentStep.codeLine} />

      {/* DSA-specific visualization - ENHANCED existing component */}
      <TwoPointersVisualization step={currentStep} type={currentExample.pattern} />

      {/* Step controls - from SharedViz */}
      <StepProgress current={stepIndex} total={steps.length} description={description} />
      <StepControls
        onPrev={() => setStepIndex(s => s - 1)}
        onNext={() => setStepIndex(s => s + 1)}
        onReset={() => setStepIndex(0)}
        canPrev={stepIndex > 0}
        canNext={stepIndex < steps.length - 1}
        showPlayPause
        isPlaying={isPlaying}
        onPlayPause={toggle}
      />
    </>
  )
}
```

### Data Structure Reuse

The existing `ConceptStep` and `ConceptVisualState` types in `types/index.ts` already support:

```typescript
// Already defined and working
interface ConceptVisualState {
  array?: (number | string)[]        // For Two Pointers
  pointers?: Record<string, number>  // For pointer positions
  highlights?: number[]              // For highlighting elements
  binary?: BinaryConceptState        // For Bit Manipulation
  hashMap?: HashMapVisualState       // For Hash Map
  annotations?: string[]             // For explanatory text
  result?: number | string | boolean // For final answer
}
```

### Animation Pattern Reuse

From `ArraysBasicsViz.tsx` - apply to DSA components:

```typescript
// Entry animation for array elements
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  layout  // Smooth position changes
>

// Highlight animation (already in TwoPointersConcept)
animate={{
  scale: isHighlighted ? 1.05 : 1,
  boxShadow: isHighlighted
    ? '0 0 12px rgba(96, 165, 250, 0.5)'
    : '0 1px 2px rgba(0, 0, 0, 0.1)',
}}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}

// Pointer movement (already working)
<motion.div
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
```

## Sources

- **Codebase analysis:** Direct inspection of existing components
- **Framer Motion docs:** Version 11 capabilities verified via Context7 (supports all needed features)
- **package.json:** Confirmed versions and dependencies

## Summary for Roadmap

**Technology decisions are settled.** The upgrade work is:

1. **Refactor DSA components** to use SharedViz (CodePanel, StepControls, StepProgress)
2. **Add difficulty levels** following ArraysBasicsViz pattern
3. **Expand step data** in algorithmConcepts.ts with multiple examples per problem
4. **Apply animation patterns** already proven in JS Concept visualizations

No stack changes. No new dependencies. Pure architectural alignment.
