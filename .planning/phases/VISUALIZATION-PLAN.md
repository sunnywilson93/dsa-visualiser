# Visualization Implementation Plan

> Step 3: Detailed plan for creating visualizations

**Date**: 2026-01-30  
**Scope**: All missing visualizations and icons  
**Approach**: Extend existing components with mode props where possible

---

## Implementation Strategy

### Pattern: Mode-Based Components

Instead of 50+ separate files, use mode props:

```tsx
// Example: EventLoopViz extended
interface EventLoopVizProps {
  mode?: 'full' | 'call-stack' | 'task-queue' | 'microtask' | 'tick' | 'starvation'
}

// Example: ArraysBasicsViz extended  
interface ArraysBasicsVizProps {
  mode?: 'basics' | 'mutation' | 'iteration' | 'transformation' | 'searching' | 'sorting' | 'reduce'
}
```

### Pattern: Icon Mappings

Add all 52 new icon mappings to `ConceptIcon.tsx`:

```tsx
// Group by phase for organization
// Phase 1: Scope
'scope-basics': Layers,
'hoisting-variables': ArrowUp,
// ... etc
```

---

## Detailed Component Plan

### 1. ScopeHoistingViz (New Component)

**Concepts**: scope-basics, hoisting-variables, hoisting-functions, temporal-dead-zone, lexical-scope

**Modes**:
- `scope` - Visual scope nesting diagram
- `hoisting-vars` - var vs let vs const comparison
- `hoisting-funcs` - Function declaration vs expression
- `tdz` - Temporal dead zone timeline
- `lexical` - Scope chain walkthrough

**Structure**:
```tsx
export function ScopeHoistingViz({ mode = 'scope' }: { mode?: string }) {
  const [step, setStep] = useState(0)
  
  const modes = {
    scope: { steps: [...], render: ScopeNestingDiagram },
    'hoisting-vars': { steps: [...], render: HoistingComparison },
    // ...
  }
  
  return modes[mode].render()
}
```

---

### 2. PromisesViz (Extend)

**New Modes**: creation, then-catch, chaining, static, async-await, parallel, error-handling

**Add to existing PromisesViz**:
- `creation` - new Promise(executor) visualization
- `chaining` - .then().then() flow
- `static` - Promise.all/race visualization
- `async-await` - Sugar transformation view
- `parallel` - Promise.all with async/await
- `error-handling` - try/catch flow

---

### 3. ArraysBasicsViz (Extend)

**New Modes**: mutation, iteration, transformation, searching, sorting, reduce, immutable

**Visual Elements**:
- Array as horizontal blocks
- Method operations animate transformations
- Before/After states

---

### 4. ClosuresViz (Extend)

**New Modes**: definition, practical, loops, memory, partial, module

**Leverage existing**: Scope visualization + closed-over variables

---

### 5. PrototypesViz (Extend)

**New Modes**: chain, lookup, class-syntax, instanceof, inheritance, pollution

**Visual Elements**:
- Object boxes with __proto__ links
- Method lookup walk animation
- Class diagram with prototype chain

---

### 6. EventLoopViz (Extend)

**New Modes**: call-stack, task-queue, microtask, tick, starvation

**Leverage existing**: Full event loop visualization, zoom into specific parts

---

### 7. ModernJSViz (New Component)

**Concepts**: All 7 modern JS features

**Modes**:
- `destructuring` - Object/array unpacking
- `spread` - Element expansion animation
- `rest` - Argument collection
- `template` - Interpolation highlighting
- `optional-chain` - ?. short-circuit
- `nullish` - ?? comparison
- `logical-assign` - ??= ||= &&=

---

### 8. ErrorHandlingViz (New Component)

**Concepts**: try-catch-finally, error-types, custom-errors

**Modes**:
- `try-catch` - Flow control diagram
- `types` - Error hierarchy tree
- `custom` - Custom error class structure

---

### 9. TypeCoercionViz (Extend)

**New Modes**: implicit-rules, edge-cases

**Add to existing**:
- `implicit` - +, -, == coercion table
- `edge-cases` - [] + [], typeof null, etc

---

## Icon Mapping Implementation

### Phase 1: Scope & Hoisting
```tsx
'scope-basics': Layers,
'hoisting-variables': ArrowUp,
'hoisting-functions': ArrowUpCircle,
'temporal-dead-zone': ShieldAlert,
'lexical-scope': Parentheses,
```

### Phase 2: Async
```tsx
'callbacks-basics': MessageSquare,
'error-first-callbacks': AlertTriangle,
'callback-hell': GitCommitVertical,
'promises-creation': Clock,
'promises-then-catch': GitBranch,
'promises-chaining': Link2,
'promises-static-methods': LayoutGrid,
'async-await-syntax': Timer,
'async-await-parallel': GitFork,
'async-await-error-handling': Shield,
```

### Phase 3: Arrays
```tsx
'array-mutation-methods': Pencil,
'array-iteration-methods': Repeat,
'array-transformation': Shuffle,
'array-searching': Search,
'array-sorting': ArrowUpDown,
'array-reduce-patterns': Minus,
'array-immutable-patterns': Copy,
```

### Phase 4: Closure & Prototypes
```tsx
// Closure
'closure-definition': Lock,
'closure-practical-uses': Key,
'closure-in-loops': RotateCcw,
'closure-memory': Database,
'closure-partial-application': PieChart,
'closure-module-pattern': Package,

// Prototypes
'prototype-chain-basics': Link,
'property-lookup': Search,
'class-syntax-prototypes': FileCode,
'instanceof-operator': CheckCircle2,
'prototype-inheritance': GitBranch,
'prototype-pollution': Skull,
```

### Phase 5: Event Loop
```tsx
'call-stack-basics': Layers,
'javascript-runtime-model': Cpu,
'task-queue-macrotasks': List,
'microtask-queue': ListOrdered,
'event-loop-tick': RotateCw,
'event-loop-starvation': AlertOctagon,
```

### Phase 6: Modern JS
```tsx
'destructuring-complete': UnfoldVertical,
'spread-operator-patterns': Maximize2,
'rest-parameters': Minimize2,
'template-literals': Quote,
'optional-chaining': Link2,
'nullish-coalescing': Filter,
'logical-assignment': Zap,
```

### Phase 7: Errors
```tsx
'try-catch-finally': ShieldCheck,
'error-types-native': AlertCircle,
'throwing-custom-errors': BadgeAlert,
```

### Phase 8: Coercion
```tsx
'implicit-coercion-rules': Shuffle,
'coercion-edge-cases': Bomb,
```

---

## Registration in ConceptPageClient.tsx

### Pattern for Mode-Based Components

```tsx
// Map multiple concept IDs to same component with different modes
'scope-basics': dynamic(() => import('@/components/Concepts/ScopeHoistingViz').then(m => ({ 
  default: () => m.ScopeHoistingViz({ mode: 'scope' }) 
}))),
'hoisting-variables': dynamic(() => import('@/components/Concepts/ScopeHoistingViz').then(m => ({ 
  default: () => m.ScopeHoistingViz({ mode: 'hoisting-vars' }) 
}))),
// ... etc
```

---

## Build Order

### Phase A: Icons (Quick Win)
1. Add all 52 icon mappings to ConceptIcon.tsx
2. Test icons render correctly

### Phase B: Extend Existing Components
1. PromisesViz - add async/await modes
2. ArraysBasicsViz - add method category modes
3. EventLoopViz - add granular modes
4. TypeCoercionViz - add edge cases mode

### Phase C: Create New Components
1. ScopeHoistingViz
2. ClosuresViz (extend from existing)
3. PrototypesViz (extend from existing)
4. ModernJSViz
5. ErrorHandlingViz

### Phase D: Registration
1. Register all in ConceptPageClient.tsx
2. Test all routes

---

## Testing Checklist

Per component:
- [ ] Renders without errors
- [ ] Mode switching works
- [ ] Responsive on mobile
- [ ] Animations work
- [ ] Icon displays

Per concept page:
- [ ] Visualization loads
- [ ] Content displays correctly
- [ ] No console errors

---

## Success Criteria

- [ ] All 91 concepts have icons
- [ ] All 91 concepts have visualizations
- [ ] Build passes
- [ ] No console errors
- [ ] Mobile responsive
