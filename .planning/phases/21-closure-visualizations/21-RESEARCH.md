# Phase 21: Closure Visualizations - Research

**Researched:** 2026-01-31
**Domain:** JavaScript Closures Visualization Components (React/Framer Motion)
**Confidence:** HIGH

## Summary

This research investigates how to build 6 visualization components (CLOS-01 through CLOS-06) for teaching JavaScript closures, lexical scope, memory implications, and practical patterns. The phase builds directly on the existing ClosuresViz.tsx which provides an excellent foundation with call stack, heap memory visualization, and [[Scope]] reference arrows.

The codebase has established patterns from ClosuresViz.tsx:
1. ExecutionContext interface with outerRef for scope chain visualization
2. HeapObject interface with scopeRef for [[Scope]] reference arrows
3. Three difficulty levels (beginner/intermediate/advanced) with color-coded indicators
4. SharedViz components (CodePanel, StepControls, StepProgress) for consistent UX
5. Neon box visual containers with gradient borders (Call Stack, Heap Memory, Output)
6. Framer Motion AnimatePresence for step transitions

Key decisions from STATE.md:
- **Closures show references not values** - Arrows to scope objects, include mutation examples
- **Simulation over real execution** - Viz uses static step data with disclaimer
- **Reuse SharedViz for all new Viz** - Consistent UX, avoid duplication
- **Memory leak heap visualization may need architectural spike** - Flagged concern

**Primary recommendation:** Extend ClosuresViz.tsx patterns for all 6 components. Use the existing ExecutionContext/HeapObject interfaces and scope chain visualization with [[Scope]] arrows. For CLOS-03 (loop gotcha), use side-by-side comparison showing var (single binding) vs let (per-iteration bindings). For CLOS-04 (memory leaks), add GC root visualization with reference chain path display.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component framework | Already in use project-wide |
| Framer Motion | 10.x+ | Animation library | Used in ALL existing Viz components |
| Next.js | 14.x | Framework | 'use client' directive pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lucide React | latest | Icons | AlertTriangle for memory leaks, Lock for private scope |
| SharedViz | n/a | Shared UI components | CodePanel, StepControls, StepProgress - use for all new Viz |
| Tailwind | 3.x | Utility classes | For inline styling (project standard) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static step data | Real interpreter | Simulation safer, more predictable (user decision) |
| Arrow indicators | Animated lines/SVG | Text arrows simpler, matches existing ClosuresViz |
| Side-by-side for loop gotcha | Sequential tabs | Side-by-side allows direct comparison |

**Installation:**
```bash
# No new dependencies required - all already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── ClosureDefinitionViz.tsx           # CLOS-01: Lexical environment capture
├── ClosurePracticalViz.tsx            # CLOS-02: Data privacy, factories, state
├── ClosureLoopGotchaViz.tsx           # CLOS-03: var vs let side-by-side
├── ClosureMemoryLeaksViz.tsx          # CLOS-04: Reference chains, GC roots
├── ClosureModulePatternViz.tsx        # CLOS-05: IIFE private scope
├── ClosurePartialApplicationViz.tsx   # CLOS-06: Currying, intermediate closures
└── ClosuresViz.tsx                    # Existing template - reference patterns
```

### Pattern 1: Scope Chain with [[Scope]] References (From ClosuresViz - Primary Pattern)
**What:** Call stack + heap memory visualization with [[Scope]] arrows showing closure capture
**When to use:** ALL 6 new components
**Example:**
```typescript
// Source: ClosuresViz.tsx
interface ExecutionContext {
  id: string
  name: string
  variables: { name: string; value: string }[]
  outerRef: string | null  // Points to enclosing scope
}

interface HeapObject {
  id: string
  label: string
  type: 'scope' | 'function'
  vars: { name: string; value: string }[]
  scopeRef?: string  // [[Scope]] reference to parent scope
}

interface Step {
  id: number
  phase: string  // 'Creation' | 'Execution' | 'Return'
  description: string
  highlightLines: number[]
  callStack: ExecutionContext[]
  heap: HeapObject[]
  output: string[]
}

// Heap object with [[Scope]] reference:
{
  id: 'innerFn',
  label: 'inner Function',
  type: 'function',
  vars: [{ name: '[[Scope]]', value: '-> outer Scope' }],
  scopeRef: 'scope1'  // Visual link to closed-over scope
}
```

### Pattern 2: "CLOSED OVER" Badge (From ClosuresViz)
**What:** Visual badge indicating when a scope survives after function return
**When to use:** CLOS-01, CLOS-02, CLOS-05
**Example:**
```typescript
// Source: ClosuresViz.tsx
// When outer function returns but scope survives:
{
  id: 'scope1',
  label: 'outer Scope (CLOSED OVER)',  // Badge text in label
  type: 'scope',
  vars: [{ name: 'x', value: '10' }]
}

// Visual treatment:
{obj.label.includes('CLOSED') && (
  <motion.div
    className="absolute -top-1.5 right-1.5 px-1.5 py-0.5 bg-amber-500 rounded text-xs font-bold text-black"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
  >
    Closure!
  </motion.div>
)}
```

### Pattern 3: Side-by-Side Comparison (For Loop Gotcha - CLOS-03)
**What:** Two-column view showing var (single binding) vs let (per-iteration bindings)
**When to use:** CLOS-03 (ClosureLoopGotchaViz)
**Example:**
```typescript
// Source: Inspired by existing var vs let examples in ClosuresViz advanced level
interface LoopStep {
  description: string
  iteration: number
  varBinding: {
    code: string[]
    highlightLine: number
    heap: HeapObject[]  // Single shared i in global
    callbacks: { id: string; scopeRef: string }[]
  }
  letBinding: {
    code: string[]
    highlightLine: number
    heap: HeapObject[]  // Multiple block scopes, each with own i
    callbacks: { id: string; scopeRef: string }[]
  }
  phase: 'loop-start' | 'iteration' | 'callback-created' | 'loop-end' | 'callbacks-run'
  output: { var: string[]; let: string[] }
}

// Visual layout:
<div className="grid grid-cols-2 gap-4">
  {/* var panel - red/warning tinted */}
  <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
    <div className="mb-2 text-center text-sm font-semibold text-red-400">
      var i (Single Binding)
    </div>
    <CodePanel code={step.varBinding.code} />
    <HeapVisualization heap={step.varBinding.heap} />
  </div>

  {/* let panel - green/success tinted */}
  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
    <div className="mb-2 text-center text-sm font-semibold text-emerald-400">
      let i (Per-Iteration Binding)
    </div>
    <CodePanel code={step.letBinding.code} />
    <HeapVisualization heap={step.letBinding.heap} />
  </div>
</div>
```

### Pattern 4: GC Root Reference Chain (For Memory Leaks - CLOS-04)
**What:** Visual path from GC root through closures to leaked objects
**When to use:** CLOS-04 (ClosureMemoryLeaksViz)
**Example:**
```typescript
// Source: Inspired by MemoryModelViz.tsx garbage collection pattern
interface MemoryLeakStep {
  description: string
  codeLine: number
  gcRoot: string  // 'Global' or specific variable
  referenceChain: {
    from: string
    to: string
    label: string  // e.g., 'closure scope', 'event listener', 'timer callback'
  }[]
  heapObjects: {
    id: string
    label: string
    type: 'closure' | 'function' | 'object' | 'dom'
    reachable: boolean  // Can GC reach this from root?
    leaked: boolean     // Object that SHOULD be collected but can't
    size?: string       // e.g., '10MB' for visual impact
  }[]
  phase: 'normal' | 'leak-created' | 'gc-attempt' | 'leak-detected' | 'fixed'
  showWarning: boolean
}

// Reference chain visualization:
<div className="flex flex-col items-center gap-2">
  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded text-sm font-mono">
    Root (Global)
  </div>
  {step.referenceChain.map((ref, i) => (
    <div key={i} className="flex flex-col items-center">
      <div className="text-xs text-gray-500">|</div>
      <div className="text-xs text-purple-400">{ref.label}</div>
      <div className="text-xs text-gray-500">v</div>
      <div className={`px-3 py-1 border rounded text-sm font-mono ${
        step.heapObjects.find(o => o.id === ref.to)?.leaked
          ? 'bg-red-500/20 border-red-500/40 text-red-400'
          : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
      }`}>
        {ref.to}
      </div>
    </div>
  ))}
</div>
```

### Pattern 5: IIFE Execution Flow (For Module Pattern - CLOS-05)
**What:** Show IIFE executing immediately, creating private scope, returning public interface
**When to use:** CLOS-05 (ClosureModulePatternViz)
**Example:**
```typescript
// Source: Based on ClosuresViz execution flow pattern
interface ModuleStep {
  description: string
  highlightLines: number[]
  callStack: ExecutionContext[]
  privateScope: {
    id: string
    vars: { name: string; value: string; isPrivate: boolean }[]
  }
  publicInterface: {
    methods: string[]
    visible: boolean  // Shows after IIFE returns
  }
  phase: 'iife-definition' | 'iife-executing' | 'private-vars-created' | 'public-returned' | 'usage'
  output: string[]
}

// Visual: Private scope box with lock icon, public interface below
<div className="flex flex-col gap-4">
  {/* Private Scope - dashed border with lock */}
  <div className="relative rounded-xl border-2 border-dashed border-purple-500/40 bg-purple-500/5 p-4">
    <div className="absolute -top-3 left-4 px-2 bg-gray-900 text-purple-400 text-xs font-semibold flex items-center gap-1">
      <Lock size={12} /> Private Scope
    </div>
    {step.privateScope.vars.map(v => (
      <div key={v.name} className="flex justify-between font-mono text-xs">
        <span className="text-gray-500">{v.name}:</span>
        <span className="text-emerald-500">{v.value}</span>
      </div>
    ))}
  </div>

  {/* Public Interface - solid border */}
  {step.publicInterface.visible && (
    <motion.div
      className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-emerald-400 text-xs font-semibold mb-2">Public Interface</div>
      {step.publicInterface.methods.map(m => (
        <div key={m} className="font-mono text-xs text-gray-300">{m}()</div>
      ))}
    </motion.div>
  )}
</div>
```

### Pattern 6: Currying Chain Visualization (For Partial Application - CLOS-06)
**What:** Show intermediate functions capturing arguments at each step
**When to use:** CLOS-06 (ClosurePartialApplicationViz)
**Example:**
```typescript
// Source: Based on closure scope chain pattern
interface CurryStep {
  description: string
  highlightLines: number[]
  callSequence: string  // e.g., 'add(1)(2)(3)'
  currentCall: string   // e.g., 'add(1)'
  intermediateFunctions: {
    id: string
    label: string       // e.g., 'fn after add(1)'
    capturedArgs: { name: string; value: string }[]
    remainingParams: string[]
  }[]
  returnedValue: string | null  // Final result when all args provided
  phase: 'definition' | 'first-call' | 'intermediate' | 'final-call' | 'result'
  output: string[]
}

// Visual: Chain of functions with captured args
<div className="flex items-center gap-2 flex-wrap">
  {step.intermediateFunctions.map((fn, i) => (
    <React.Fragment key={fn.id}>
      {i > 0 && <span className="text-gray-600">-></span>}
      <motion.div
        className="px-3 py-2 rounded-lg border border-purple-500/40 bg-purple-500/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-purple-400 text-xs font-semibold">{fn.label}</div>
        <div className="text-2xs text-gray-500 mt-1">
          Captured: {fn.capturedArgs.map(a => `${a.name}=${a.value}`).join(', ')}
        </div>
        {fn.remainingParams.length > 0 && (
          <div className="text-2xs text-amber-400 mt-0.5">
            Awaiting: {fn.remainingParams.join(', ')}
          </div>
        )}
      </motion.div>
    </React.Fragment>
  ))}
  {step.returnedValue && (
    <>
      <span className="text-gray-600">=</span>
      <motion.div
        className="px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <div className="text-emerald-400 font-mono">{step.returnedValue}</div>
      </motion.div>
    </>
  )}
</div>
```

### Anti-Patterns to Avoid
- **Showing values instead of references:** User decision is closures show references, not values
- **Real code execution:** Simulation only, with disclaimer about real JS behavior
- **Skipping [[Scope]] visualization:** Must show the internal reference to parent scope
- **Horizontal scope chain:** Keep vertical for consistency with ClosuresViz
- **Missing mutation examples:** Show how closed-over variables can be modified
- **Memory leak without prevention:** CLOS-04 must show cleanup techniques

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom parser | CodePanel from SharedViz | Already handles line refs, scrolling |
| Step navigation | Complex reducer | StepControls from SharedViz | Consistent buttons, keyboard support |
| Step description | Custom component | StepProgress from SharedViz | Animated transitions built-in |
| Scope chain animations | Manual setTimeout | Framer Motion AnimatePresence | Cancellation, interruption handling |
| Call stack visualization | New component | Existing ClosuresViz pattern | Proven layout with outerRef arrows |
| Heap object animations | CSS transitions | Framer Motion scale + opacity | Coordinated enter/exit |
| [[Scope]] reference display | Custom arrow drawing | Text arrow pattern from ClosuresViz | Simple, readable, consistent |

**Key insight:** ClosuresViz.tsx has already solved scope chain visualization with [[Scope]] references, call stack, and heap memory display. Extend these patterns directly.

## Common Pitfalls

### Pitfall 1: Forgetting 'use client' Directive
**What goes wrong:** Component won't render, cryptic Next.js errors
**Why it happens:** All Viz components use hooks, must be client components
**How to avoid:** First line of every new component: `'use client'`
**Warning signs:** "useState is not defined" errors

### Pitfall 2: Showing Closure Values Instead of References
**What goes wrong:** Visualization suggests closures copy values
**Why it happens:** Easier to show final values than references
**How to avoid:** Always show [[Scope]] arrows pointing to scope objects; include mutation examples showing that the reference, not a copy, is captured
**Warning signs:** Example doesn't demonstrate that modifying closed-over variable affects all closures sharing it

### Pitfall 3: var vs let Loop Bug Misexplanation
**What goes wrong:** Showing wrong number of bindings or wrong timing
**Why it happens:** Confusing when bindings are created vs when values are captured
**How to avoid:** For var, show ONE binding in global/function scope that all callbacks reference. For let, show NEW block scope created per iteration with its own i.
**Warning signs:** var example showing multiple i variables, or let example showing single shared i

### Pitfall 4: Memory Leak Without Reference Chain
**What goes wrong:** Leak shown but root cause unclear
**Why it happens:** Skipping the "why is GC blocked?" explanation
**How to avoid:** Always show complete reference path: Root -> Closure -> Leaked Object. Highlight which reference prevents collection.
**Warning signs:** User can't answer "what do I remove to fix this leak?"

### Pitfall 5: IIFE Not Showing Immediate Execution
**What goes wrong:** IIFE looks like a regular function
**Why it happens:** Not highlighting the () that executes immediately
**How to avoid:** Show step where IIFE executes, stack frame appears and disappears, leaving only the returned object
**Warning signs:** Call stack shows IIFE waiting to be called

### Pitfall 6: Currying Without Intermediate Functions
**What goes wrong:** Jump from curry(1)(2) to result without showing intermediate
**Why it happens:** Only showing start and end state
**How to avoid:** Each partial application creates a new function visualized in heap with its captured args
**Warning signs:** No intermediate function objects shown between calls

### Pitfall 7: State Reset on Level/Example Change
**What goes wrong:** Step index out of bounds, crashes
**Why it happens:** Forgot to reset stepIndex when changing level/example
**How to avoid:** Always setStepIndex(0) in level/example change handlers (pattern from ClosuresViz)
**Warning signs:** Crash when switching examples

### Pitfall 8: Missing Disclaimer for Simulated Execution
**What goes wrong:** Users think visualization is running real JS
**Why it happens:** Not adding simulation disclaimer
**How to avoid:** Include subtle note like "Simulated for educational purposes"
**Warning signs:** Users expect interactive code execution

## Code Examples

Verified patterns from official sources and existing codebase:

### Basic Closure Definition (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
// CLOS-01: ClosureDefinitionViz

// The classic closure example:
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    console.log(name);  // Captures 'name' via [[Scope]]
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc(); // "Mozilla" - closure retains access to 'name'

// Step data representation:
const steps: Step[] = [
  {
    id: 0,
    phase: 'Creation',
    description: 'makeFunc is defined in global scope',
    highlightLines: [],
    callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'myFunc', value: 'undefined' }], outerRef: null }],
    heap: [],
    output: []
  },
  {
    id: 1,
    phase: 'Execution',
    description: 'makeFunc() called - new execution context created',
    highlightLines: [7],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'myFunc', value: 'undefined' }], outerRef: null },
      { id: 'makeFunc', name: 'makeFunc() EC', variables: [{ name: 'name', value: '"Mozilla"' }], outerRef: 'global' }
    ],
    heap: [{ id: 'scope1', label: 'makeFunc Scope', type: 'scope', vars: [{ name: 'name', value: '"Mozilla"' }] }],
    output: []
  },
  {
    id: 2,
    phase: 'Execution',
    description: 'displayName function created - captures reference to makeFunc scope via [[Scope]]',
    highlightLines: [2, 3, 4],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'myFunc', value: 'undefined' }], outerRef: null },
      { id: 'makeFunc', name: 'makeFunc() EC', variables: [{ name: 'name', value: '"Mozilla"' }], outerRef: 'global' }
    ],
    heap: [
      { id: 'scope1', label: 'makeFunc Scope', type: 'scope', vars: [{ name: 'name', value: '"Mozilla"' }] },
      { id: 'displayName', label: 'displayName Function', type: 'function', vars: [{ name: '[[Scope]]', value: '-> makeFunc Scope' }], scopeRef: 'scope1' }
    ],
    output: []
  },
  {
    id: 3,
    phase: 'Return',
    description: 'makeFunc returns displayName - EC destroyed, but scope SURVIVES because displayName references it!',
    highlightLines: [5],
    callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'myFunc', value: 'fn()' }], outerRef: null }],
    heap: [
      { id: 'scope1', label: 'makeFunc Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'name', value: '"Mozilla"' }] },
      { id: 'displayName', label: 'myFunc Function', type: 'function', vars: [{ name: '[[Scope]]', value: '-> makeFunc Scope' }], scopeRef: 'scope1' }
    ],
    output: []
  },
  {
    id: 4,
    phase: 'Execution',
    description: 'myFunc() called - accesses name through [[Scope]] reference',
    highlightLines: [8],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'myFunc', value: 'fn()' }], outerRef: null },
      { id: 'myFunc', name: 'myFunc() EC', variables: [], outerRef: 'scope1' }
    ],
    heap: [
      { id: 'scope1', label: 'makeFunc Scope (CLOSED OVER)', type: 'scope', vars: [{ name: 'name', value: '"Mozilla"' }] },
      { id: 'displayName', label: 'myFunc Function', type: 'function', vars: [{ name: '[[Scope]]', value: '-> makeFunc Scope' }], scopeRef: 'scope1' }
    ],
    output: ['Mozilla']
  }
]
```

### Loop Closure Bug - var vs let (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#creating_closures_in_loops_a_common_mistake
// CLOS-03: ClosureLoopGotchaViz

// THE BUG - var creates single binding:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

// THE FIX - let creates per-iteration binding:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

// Side-by-side step data:
const loopSteps: LoopStep[] = [
  {
    description: 'Loop starts - var hoists i to function scope, let creates block scope',
    iteration: 0,
    varBinding: {
      code: ['for (var i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}'],
      highlightLine: 0,
      heap: [{ id: 'global', label: 'Global Scope', type: 'scope', vars: [{ name: 'i', value: '0' }] }],
      callbacks: []
    },
    letBinding: {
      code: ['for (let i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}'],
      highlightLine: 0,
      heap: [{ id: 'block0', label: 'Block Scope (iter 0)', type: 'scope', vars: [{ name: 'i', value: '0' }] }],
      callbacks: []
    },
    phase: 'loop-start',
    output: { var: [], let: [] }
  },
  // ... more steps showing callbacks capturing different scopes
  {
    description: 'Loop complete - var: i=3, all callbacks share it. let: 3 separate block scopes',
    iteration: 3,
    varBinding: {
      code: ['for (var i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}', '// i is now 3'],
      highlightLine: 3,
      heap: [{ id: 'global', label: 'Global Scope', type: 'scope', vars: [{ name: 'i', value: '3' }] }],
      callbacks: [
        { id: 'cb0', scopeRef: 'global' },
        { id: 'cb1', scopeRef: 'global' },
        { id: 'cb2', scopeRef: 'global' }  // All point to SAME scope!
      ]
    },
    letBinding: {
      code: ['for (let i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}'],
      highlightLine: 2,
      heap: [
        { id: 'block0', label: 'Closure (i=0)', type: 'scope', vars: [{ name: 'i', value: '0' }] },
        { id: 'block1', label: 'Closure (i=1)', type: 'scope', vars: [{ name: 'i', value: '1' }] },
        { id: 'block2', label: 'Closure (i=2)', type: 'scope', vars: [{ name: 'i', value: '2' }] }
      ],
      callbacks: [
        { id: 'cb0', scopeRef: 'block0' },
        { id: 'cb1', scopeRef: 'block1' },
        { id: 'cb2', scopeRef: 'block2' }  // Each has OWN scope!
      ]
    },
    phase: 'loop-end',
    output: { var: [], let: [] }
  },
  {
    description: 'Callbacks execute - var: all read i=3. let: each reads own i',
    iteration: 3,
    varBinding: {
      // ... heap same
      callbacks: []
    },
    letBinding: {
      // ... heap same
      callbacks: []
    },
    phase: 'callbacks-run',
    output: { var: ['3', '3', '3'], let: ['0', '1', '2'] }
  }
]
```

### Module Pattern with IIFE (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#emulating_private_methods_with_closures
// CLOS-05: ClosureModulePatternViz

const counter = (function () {
  let privateCounter = 0;  // Private variable

  function changeBy(val) {  // Private function
    privateCounter += val;
  }

  return {  // Public interface
    increment() { changeBy(1); },
    decrement() { changeBy(-1); },
    value() { return privateCounter; }
  };
})();

counter.value();     // 0
counter.increment();
counter.value();     // 1

// Step data showing IIFE execution:
const moduleSteps: ModuleStep[] = [
  {
    description: 'IIFE defined - note the () at the end that executes immediately',
    highlightLines: [0, 14],
    callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null }],
    privateScope: { id: 'none', vars: [] },
    publicInterface: { methods: [], visible: false },
    phase: 'iife-definition',
    output: []
  },
  {
    description: 'IIFE executes immediately - creates private scope with privateCounter and changeBy',
    highlightLines: [1, 3, 4, 5],
    callStack: [
      { id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: 'undefined' }], outerRef: null },
      { id: 'iife', name: '(anonymous)() EC', variables: [{ name: 'privateCounter', value: '0' }, { name: 'changeBy', value: 'fn' }], outerRef: 'global' }
    ],
    privateScope: {
      id: 'private',
      vars: [
        { name: 'privateCounter', value: '0', isPrivate: true },
        { name: 'changeBy', value: 'function', isPrivate: true }
      ]
    },
    publicInterface: { methods: [], visible: false },
    phase: 'iife-executing',
    output: []
  },
  {
    description: 'IIFE returns object - EC destroyed, but private scope survives!',
    highlightLines: [7, 8, 9, 10, 11, 12],
    callStack: [{ id: 'global', name: 'Global EC', variables: [{ name: 'counter', value: '{...}' }], outerRef: null }],
    privateScope: {
      id: 'private',
      vars: [
        { name: 'privateCounter', value: '0', isPrivate: true },
        { name: 'changeBy', value: 'function', isPrivate: true }
      ]
    },
    publicInterface: {
      methods: ['increment', 'decrement', 'value'],
      visible: true
    },
    phase: 'public-returned',
    output: []
  }
]
```

### Closure Memory Leak Pattern
```typescript
// Source: https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/
// CLOS-04: ClosureMemoryLeaksViz

// LEAK: Closure captures reference to large object
function createLeak() {
  const largeData = new Array(1000000).fill('data');  // 1MB

  return function processData() {
    // Uses largeData - keeps it in memory!
    return largeData.length;
  };
}

const leakyFunction = createLeak();
// largeData still in memory even if we never call leakyFunction again!

// FIX: Nullify when done
function createSafe() {
  let largeData = new Array(1000000).fill('data');

  return {
    process() {
      const len = largeData.length;
      largeData = null;  // Release reference!
      return len;
    }
  };
}

// Memory leak step data showing reference chain:
const memorySteps: MemoryLeakStep[] = [
  {
    description: 'createLeak() called - largeData allocated in heap',
    codeLine: 2,
    gcRoot: 'Global',
    referenceChain: [
      { from: 'Global', to: 'leakyFunction', label: 'variable' }
    ],
    heapObjects: [
      { id: 'largeData', label: 'Array (1MB)', type: 'object', reachable: true, leaked: false, size: '1MB' }
    ],
    phase: 'normal',
    showWarning: false
  },
  {
    description: 'Function returned with closure - largeData STILL reachable via closure!',
    codeLine: 10,
    gcRoot: 'Global',
    referenceChain: [
      { from: 'Global', to: 'leakyFunction', label: 'variable' },
      { from: 'leakyFunction', to: 'closure', label: '[[Scope]]' },
      { from: 'closure', to: 'largeData', label: 'captured reference' }
    ],
    heapObjects: [
      { id: 'closure', label: 'Closure Scope', type: 'closure', reachable: true, leaked: false },
      { id: 'largeData', label: 'Array (1MB)', type: 'object', reachable: true, leaked: true, size: '1MB' }
    ],
    phase: 'leak-created',
    showWarning: true
  },
  {
    description: 'GC cannot collect largeData - reference chain from root keeps it alive!',
    codeLine: -1,
    gcRoot: 'Global',
    referenceChain: [
      { from: 'Global', to: 'leakyFunction', label: 'variable' },
      { from: 'leakyFunction', to: 'closure', label: '[[Scope]]' },
      { from: 'closure', to: 'largeData', label: 'BLOCKING GC!' }
    ],
    heapObjects: [
      { id: 'closure', label: 'Closure Scope', type: 'closure', reachable: true, leaked: false },
      { id: 'largeData', label: 'Array (1MB) LEAKED!', type: 'object', reachable: true, leaked: true, size: '1MB' }
    ],
    phase: 'gc-attempt',
    showWarning: true
  }
]
```

### Currying with Intermediate Closures
```typescript
// Source: https://javascript.info/currying-partials
// CLOS-06: ClosurePartialApplicationViz

function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
curriedSum(1)(2)(3);  // 6

// Step data showing intermediate functions:
const currySteps: CurryStep[] = [
  {
    description: 'curriedSum(1) called - returns new function with a=1 captured',
    highlightLines: [5, 6, 7],
    callSequence: 'curriedSum(1)(2)(3)',
    currentCall: 'curriedSum(1)',
    intermediateFunctions: [
      {
        id: 'fn1',
        label: 'After curriedSum(1)',
        capturedArgs: [{ name: 'a', value: '1' }],
        remainingParams: ['b', 'c']
      }
    ],
    returnedValue: null,
    phase: 'first-call',
    output: []
  },
  {
    description: 'fn(2) called - returns new function with a=1, b=2 captured',
    highlightLines: [5, 6, 7],
    callSequence: 'curriedSum(1)(2)(3)',
    currentCall: '...(2)',
    intermediateFunctions: [
      {
        id: 'fn1',
        label: 'After (1)',
        capturedArgs: [{ name: 'a', value: '1' }],
        remainingParams: ['b', 'c']
      },
      {
        id: 'fn2',
        label: 'After (1)(2)',
        capturedArgs: [{ name: 'a', value: '1' }, { name: 'b', value: '2' }],
        remainingParams: ['c']
      }
    ],
    returnedValue: null,
    phase: 'intermediate',
    output: []
  },
  {
    description: 'fn(3) called - all args present, original function executes!',
    highlightLines: [3, 4],
    callSequence: 'curriedSum(1)(2)(3)',
    currentCall: '...(3)',
    intermediateFunctions: [
      {
        id: 'fn1',
        label: 'After (1)',
        capturedArgs: [{ name: 'a', value: '1' }],
        remainingParams: ['b', 'c']
      },
      {
        id: 'fn2',
        label: 'After (1)(2)',
        capturedArgs: [{ name: 'a', value: '1' }, { name: 'b', value: '2' }],
        remainingParams: ['c']
      },
      {
        id: 'fn3',
        label: 'After (1)(2)(3)',
        capturedArgs: [{ name: 'a', value: '1' }, { name: 'b', value: '2' }, { name: 'c', value: '3' }],
        remainingParams: []
      }
    ],
    returnedValue: '6',
    phase: 'final-call',
    output: ['6']
  }
]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| var in loops | let in loops | ES2015 | Per-iteration scope solves closure bug |
| IIFE for modules | ES6 modules | ES2015 | Native import/export, but IIFE still taught |
| Manual cleanup | WeakMap/WeakSet | ES2015 | Better memory management for caches |
| Global event handlers | Scoped handlers + cleanup | Modern best practice | Prevents closure memory leaks |

**Deprecated/outdated:**
- Using var in loops with closures - use let instead
- Module pattern for new code - use ES6 modules, but pattern still valuable for understanding closures
- Assuming closures are "slow" - V8 optimizes closure access well

## Specific Component Templates

### CLOS-01: ClosureDefinitionViz
**Template:** ClosuresViz.tsx basic-closure example
**Key visual elements:**
- Call stack showing function creation/execution
- Heap with scope object and function with [[Scope]]
- "CLOSED OVER" badge when scope survives function return
- Phase indicator (Creation/Execution/Return)
**Difficulty levels:**
- Beginner: Basic makeFunc example (single variable capture)
- Intermediate: Multiple variables captured, mutations shown
- Advanced: Nested closures (closure over closure)

### CLOS-02: ClosurePracticalViz
**Template:** ClosuresViz.tsx private-vars and counter examples
**Key visual elements:**
- Factory function creating multiple independent closures
- Data privacy visualization (private vs public vars)
- State encapsulation with shared private scope
**Difficulty levels:**
- Beginner: Counter with increment
- Intermediate: Object with private variables (createPerson pattern)
- Advanced: Event handler factory

### CLOS-03: ClosureLoopGotchaViz
**Template:** Side-by-side comparison (new pattern)
**Key visual elements:**
- Two-column: var (red tint) vs let (green tint)
- var shows single binding, let shows per-iteration bindings
- All callbacks pointing to same scope (var) vs different scopes (let)
- Output comparison at end
**Difficulty levels:**
- Beginner: Simple setTimeout loop
- Intermediate: Array.push pattern with closures
- Advanced: IIFE workaround explanation

### CLOS-04: ClosureMemoryLeaksViz
**Template:** MemoryModelViz.tsx garbage collection pattern + reference chain
**Key visual elements:**
- GC Root -> Reference Chain -> Leaked Object path
- Warning badge for memory leak detection
- Objects marked as "leaked" with red styling
- Prevention techniques (nullify, WeakMap)
**Difficulty levels:**
- Beginner: Simple closure keeping large object alive
- Intermediate: Event listener closure leak
- Advanced: Timer callback closure leak + cleanup patterns

### CLOS-05: ClosureModulePatternViz
**Template:** ClosuresViz.tsx + IIFE execution flow
**Key visual elements:**
- IIFE executing immediately (call stack shows anonymous function)
- Private scope box (dashed border, lock icon)
- Public interface box (solid border, exposed methods)
- Arrows showing public methods accessing private scope
**Difficulty levels:**
- Beginner: Simple counter module
- Intermediate: Module with multiple private functions
- Advanced: Revealing module pattern

### CLOS-06: ClosurePartialApplicationViz
**Template:** New pattern - intermediate function chain
**Key visual elements:**
- Horizontal chain of intermediate functions
- Each function shows captured args and remaining params
- Final result badge when all args provided
- Arrows showing how each function creates the next
**Difficulty levels:**
- Beginner: Simple add currying (3 args)
- Intermediate: Partial application with _.partial style
- Advanced: Generic curry function

## Open Questions

Things that couldn't be fully resolved:

1. **Memory leak heap visualization complexity**
   - What we know: Need to show reference chains from GC root to leaked objects
   - What's unclear: How detailed should heap visualization be? Full heap graph or simplified path view?
   - Recommendation: Use simplified path view (Root -> Closure -> Leaked Object) rather than full heap graph. Flagged in STATE.md as potential architectural spike.

2. **Animation timing for side-by-side comparison**
   - What we know: Both columns need to animate in sync
   - What's unclear: Should steps be shared or independent for var/let columns?
   - Recommendation: Shared steps that update both columns simultaneously

3. **Currying vs partial application distinction**
   - What we know: They're related but distinct concepts
   - What's unclear: How much to emphasize the difference in CLOS-06?
   - Recommendation: Focus on currying (more common in interviews), mention partial application as related technique

## Sources

### Primary (HIGH confidence)
- MDN Closures: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
- Existing ClosuresViz.tsx - Call stack, heap, [[Scope]] visualization patterns
- Existing MemoryModelViz.tsx - Stack/heap layout, GC visualization

### Secondary (MEDIUM confidence)
- Auth0 Memory Leaks: https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/
- JavaScript.info Currying: https://javascript.info/currying-partials
- Jake Archibald GC and Closures: https://jakearchibald.com/2024/garbage-collection-and-closures/

### Tertiary (LOW confidence)
- WebSearch results for visualization patterns
- Medium/dev.to articles for mental models

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly observed in existing components
- Scope chain pattern: HIGH - Existing ClosuresViz.tsx provides complete template
- [[Scope]] visualization: HIGH - Already implemented in ClosuresViz.tsx
- Loop gotcha side-by-side: MEDIUM - Pattern extrapolated from existing examples
- Memory leak visualization: MEDIUM - Based on MemoryModelViz.tsx GC patterns, flagged for spike
- Currying visualization: MEDIUM - New pattern, but follows established heap object display

**Research date:** 2026-01-31
**Valid until:** 60 days (stable JavaScript spec, internal patterns stable)
