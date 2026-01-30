# Visualization Development Workflow

> 4-step workflow for creating concept visualizations

## Overview

This workflow ensures visualizations are:
- **Pedagogically sound** - Teach the right concepts in the right order
- **Visually consistent** - Match the design system
- **Technically robust** - Follow component patterns
- **Complete** - Icons + Visualizations for every concept

---

## The 4 Steps

### Step 1: Research
**Goal**: Understand what needs to be visualized

**Tasks**:
- [ ] Audit existing visualizations for patterns
- [ ] Identify learning blocks for each concept
- [ ] Determine what makes a good visualization vs bad
- [ ] Check if existing viz can be reused/adapted

**Deliverable**: `RESEARCH-{phase}.md`

---

### Step 2: Research Complete (Sign-off Gate)
**Goal**: Validate research before designing

**Checklist**:
- [ ] Learning blocks documented for each concept
- [ ] Visualization approach identified for each
- [ ] Reuse opportunities noted
- [ ] Icon selection rationale documented

**Deliverable**: Sign-off from reviewer

---

### Step 3: Plan
**Goal**: Design the visualizations

**Tasks**:
- [ ] Sketch visualization layout
- [ ] Define component structure
- [ ] Plan animation/interaction states
- [ ] Map icons to concepts

**Deliverable**: `PLAN-{phase}.md` + component skeletons

---

### Step 4: Implement
**Goal**: Build and integrate

**Tasks**:
- [ ] Create visualization components
- [ ] Add icon mappings
- [ ] Register in ConceptPageClient.tsx
- [ ] Test build and functionality

**Deliverable**: Working visualizations

---

## Visualization Types

### Type A: Static Educational
- Simple diagrams with labels
- No interaction needed
- Examples: V8EngineViz, JSPhilosophyViz

### Type B: Step-by-Step
- Progress through states
- Manual or auto-advance
- Examples: HoistingViz, EventLoopViz

### Type C: Interactive Playground
- User can manipulate
- Real-time feedback
- Examples: ClosuresViz, PromisesViz

### Type D: Code Execution
- Show code + output together
- Step through execution
- Examples: TypeCoercionViz

---

## Icon Selection Guide

| Concept Category | Icon Pattern | Examples |
|-----------------|--------------|----------|
| Scope/Variables | Containers/Boxes | Box, Package, Layers |
| Functions | Function blocks | FunctionSquare, Code2 |
| Async | Time/Cycles | Clock, RotateCw, Timer |
| Arrays | Lists/Grids | ListOrdered, TableProperties |
| Objects | Structures | Package, Box, Link |
| Error Handling | Alerts | AlertTriangle, AlertCircle |
| Operators | Math symbols | Plus, Minus, Equal |

---

## Component Patterns

```tsx
// Standard structure for visualization components
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function ConceptNameViz() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Step content definitions
  const steps = [
    { title: 'Step 1', content: '...' },
    // ...
  ]
  
  return (
    <div className="viz-container">
      {/* Controls */}
      {/* Visualization */}
      {/* Explanation */}
    </div>
  )
}
```

---

## Quality Checklist

Before marking complete:
- [ ] Component renders without errors
- [ ] Responsive (works on mobile)
- [ ] Accessible (keyboard navigation)
- [ ] Consistent with existing viz style
- [ ] Icon displays correctly
- [ ] Registered in ConceptPageClient.tsx
