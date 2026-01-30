# Phase 19: Async/Await & Event Loop Deep Dive - Research

**Researched:** 2026-01-30
**Domain:** JavaScript Async Visualization Components (React/Framer Motion)
**Confidence:** HIGH

## Summary

This research investigates how to build 7 new visualization components (ASYNC-07 through ASYNC-13) for teaching async/await syntax and microtask/macrotask queue ordering. The phase builds directly on Phase 18 patterns and the existing EventLoopViz.tsx, which already demonstrates queue-based animations with microtask/macrotask separation.

The codebase has established patterns:
1. Self-contained components with inline step data arrays
2. Three difficulty levels (beginner/intermediate/advanced)
3. SharedViz components (CodePanel, StepControls, StepProgress) for consistent UX
4. Framer Motion for animations with AnimatePresence for step transitions
5. Neon box visual containers with gradient borders
6. Phase 18's fork diagram pattern for error/success path branching

Key JavaScript spec findings verified against MDN and ECMAScript specification:
- Microtasks drain completely before ANY macrotask runs (verified)
- Microtasks can spawn more microtasks that run before next macrotask (verified)
- Promise.any (ES2021) returns first fulfillment, rejects with AggregateError if all fail (verified)
- await pauses async function, schedules continuation as microtask (verified)

**Primary recommendation:** Extend EventLoopViz.tsx patterns for queue visualizations, reuse Phase 18 ErrorFirstCallbacksViz fork pattern for async error handling, and use SharedViz components for consistent UX across all 7 new visualizations.

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
| Lucide React | latest | Icons | RefreshCw for event loop, AlertCircle/CheckCircle for error/success |
| SharedViz | n/a | Shared UI components | CodePanel, StepControls, StepProgress - use for all new Viz |
| Tailwind | 3.x | Utility classes | For inline styling (project standard) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SharedViz components | Inline implementations | SharedViz is project requirement (QUAL-02), provides consistency |
| Single color scheme | Multiple color schemes per method | Keep consistent with EventLoopViz for queue colors |

**Installation:**
```bash
# No new dependencies required - all already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── PromisesStaticViz.tsx         # ASYNC-07: Promise.all/race/allSettled/any
├── AsyncAwaitSyntaxViz.tsx       # ASYNC-08: async function suspension points
├── AsyncAwaitErrorsViz.tsx       # ASYNC-09: try/catch with async/await
├── AsyncAwaitParallelViz.tsx     # ASYNC-10: Promise.all with async/await
├── MicrotaskQueueViz.tsx         # ASYNC-11: microtask queue deep dive
├── TaskQueueViz.tsx              # ASYNC-12: macrotask queue (setTimeout, setInterval)
├── EventLoopTickViz.tsx          # ASYNC-13: granular event loop tick cycle
└── [existing Viz components]
```

### Pattern 1: Step-Based Visualization with SharedViz (Primary Pattern)
**What:** Each Viz component uses SharedViz for consistent code panel, controls, and step progress
**When to use:** ALL 7 new components (QUAL-02 requirement)
**Example:**
```typescript
// Source: VariablesViz.tsx, ArraysBasicsViz.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

interface Step {
  description: string
  codeLine: number
  // Domain-specific state fields...
  output: string[]
  phase: string
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

// Use SharedViz components in render:
<CodePanel
  code={currentExample.code}
  highlightedLine={currentStep.codeLine}
  title="Code"
/>

<StepProgress
  current={stepIndex}
  total={currentExample.steps.length}
  description={currentStep.description}
/>

<StepControls
  onPrev={handlePrev}
  onNext={handleNext}
  onReset={handleReset}
  canPrev={stepIndex > 0}
  canNext={stepIndex < currentExample.steps.length - 1}
/>
```

### Pattern 2: Queue Animation (From EventLoopViz)
**What:** AnimatePresence with slide-out animation for FIFO queue visualization
**When to use:** MicrotaskQueueViz, TaskQueueViz, EventLoopTickViz
**Example:**
```typescript
// Source: EventLoopViz.tsx - macroQueue and microQueue patterns
<div className="flex flex-col gap-1.5">
  <AnimatePresence mode="popLayout">
    {queue.length === 0 ? (
      <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(empty)</div>
    ) : (
      queue.map((item, i) => (
        <motion.div
          key={item.id || `${item}-${i}`}
          className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-15)] border border-[var(--color-amber-40)] rounded-md font-mono text-xs text-[var(--color-amber-400)] text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}  // Slide out left (FIFO removal)
          layout
        >
          {item.label}
        </motion.div>
      ))
    )}
  </AnimatePresence>
</div>
```

### Pattern 3: Fork Diagram (From Phase 18)
**What:** Error path vs success path branching visualization
**When to use:** AsyncAwaitErrorsViz (ASYNC-09)
**Example:**
```typescript
// Source: ErrorFirstCallbacksViz.tsx - fork pattern
interface Step {
  errorPath: { active: boolean; errorValue?: string }
  successPath: { active: boolean; value?: string }
  phase: 'calling' | 'error-check' | 'success' | 'error'
}

// Render branching paths:
<div className="grid grid-cols-2 gap-4">
  {/* Error Path */}
  <div style={{ opacity: step.errorPath.active ? 1 : 0.3 }}>
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
      <AlertCircle className="text-red-400" />
      <span>Error Path</span>
      {step.errorPath.errorValue && (
        <code className="text-red-300">{step.errorPath.errorValue}</code>
      )}
    </div>
  </div>

  {/* Success Path */}
  <div style={{ opacity: step.successPath.active ? 1 : 0.3 }}>
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
      <CheckCircle className="text-emerald-400" />
      <span>Success Path</span>
      {step.successPath.value && (
        <code className="text-emerald-300">{step.successPath.value}</code>
      )}
    </div>
  </div>
</div>
```

### Pattern 4: Promise Static Methods Comparison Layout
**What:** Side-by-side or tabbed comparison of Promise.all/race/allSettled/any
**When to use:** PromisesStaticViz (ASYNC-07)
**Recommendation:** Side-by-side columns with settlement timeline animation
**Example:**
```typescript
// Settlement order timeline for Promise.race understanding
interface PromiseItem {
  id: string
  label: string
  state: 'pending' | 'fulfilled' | 'rejected'
  settleTime?: number  // ms for animation timing
  value?: string
  reason?: string
}

interface Step {
  promises: PromiseItem[]
  resultMethod: 'all' | 'race' | 'allSettled' | 'any'
  resultState: 'pending' | 'fulfilled' | 'rejected'
  resultValue?: string
  aggregateError?: string[]  // For Promise.any when all reject
}
```

### Pattern 5: Suspension Point Visualization
**What:** Visual indicator showing where async function pauses at await
**When to use:** AsyncAwaitSyntaxViz (ASYNC-08)
**Example:**
```typescript
// Suspension state for async functions
interface AsyncFunction {
  name: string
  state: 'running' | 'suspended' | 'completed'
  awaitLine?: number
  continuation?: string  // What's in the microtask queue
}

// Visual treatment options (Claude's discretion):
// Option A: Grayed function body with "SUSPENDED" badge
// Option B: Highlighted await line with pulsing animation
// Option C: Call stack shows "fn (suspended)" with distinct styling

// Beginner: Hide promise internals, show just "paused" vs "running"
// Advanced: Show implicit promise creation at await point
```

### Anti-Patterns to Avoid
- **Skipping SharedViz:** QUAL-02 requires SharedViz components - do NOT inline implementations
- **Inconsistent queue colors:** Use EventLoopViz color scheme (purple microtasks, amber macrotasks)
- **Flash-and-remove animation:** Use slide-out animation for FIFO queues, not instant removal
- **Overcomplicated beginner examples:** Keep beginner single-function, simple await chain

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom parser | CodePanel from SharedViz | Already handles line refs, scrolling |
| Step navigation | Complex reducer | StepControls from SharedViz | Consistent buttons, keyboard support |
| Step description | Custom component | StepProgress from SharedViz | Animated transitions built-in |
| Queue animations | Manual setTimeout | Framer Motion AnimatePresence | Cancellation, interruption handling |
| List reordering | CSS transitions | AnimatePresence + layout prop | Exit animations, stable keys |
| Promise state colors | Inline conditionals | Consistent helper function | Match existing PromisesViz pattern |

**Key insight:** Phase 18 and EventLoopViz have solved queue and promise visualization. SharedViz provides consistent step controls. Copy patterns exactly.

## Common Pitfalls

### Pitfall 1: Forgetting 'use client' Directive
**What goes wrong:** Component won't render, cryptic Next.js errors
**Why it happens:** All Viz components use hooks, must be client components
**How to avoid:** First line of every new component: `'use client'`
**Warning signs:** "useState is not defined" errors

### Pitfall 2: Incorrect Microtask Scheduling Understanding
**What goes wrong:** Steps show wrong execution order
**Why it happens:** Forgetting microtasks drain completely before ANY macrotask
**How to avoid:** Verify against spec: microtasks -> (all) -> macrotask -> (one) -> repeat
**Warning signs:** Examples show setTimeout before Promise.then with same delay

### Pitfall 3: Promise.any vs Promise.race Confusion
**What goes wrong:** Showing wrong settlement behavior
**Why it happens:** race = first to settle (either), any = first to fulfill (ignores rejections)
**How to avoid:** Explicitly show rejection being ignored by Promise.any
**Warning signs:** Promise.any settling on first rejection

### Pitfall 4: Missing AggregateError for Promise.any
**What goes wrong:** Empty iterable or all-reject case not handled
**Why it happens:** Forgetting Promise.any edge cases
**How to avoid:** Include examples: empty array rejects, all-reject shows AggregateError.errors
**Warning signs:** Promise.any with no fulfillments showing undefined instead of AggregateError

### Pitfall 5: await Without async Context
**What goes wrong:** Examples show await used incorrectly
**Why it happens:** Forgetting await requires async function (except top-level in modules)
**How to avoid:** All await examples wrap in async function, beginner shows the async keyword prominently
**Warning signs:** Syntax errors or confusing example code

### Pitfall 6: Microtask Starvation Not Explained
**What goes wrong:** Advanced users don't understand the danger
**Why it happens:** Only showing happy path, not recursive microtask case
**How to avoid:** Include advanced example showing infinite microtask loop risk
**Warning signs:** No warning about queueMicrotask recursion blocking macrotasks

### Pitfall 7: State Reset on Level/Example Change
**What goes wrong:** Step index out of bounds, crashes
**Why it happens:** Forgot to reset stepIndex when changing level/example
**How to avoid:** Always setStepIndex(0) in level/example change handlers
**Warning signs:** Crash when switching examples

## Code Examples

Verified patterns from official sources and existing codebase:

### Promise.any Behavior (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
// ASYNC-07: PromisesStaticViz

// First fulfillment wins (rejections ignored)
const pErr = Promise.reject(new Error("Fails"));
const pSlow = new Promise(r => setTimeout(() => r("slow"), 2000));
const pFast = new Promise(r => setTimeout(() => r("fast"), 500));

Promise.any([pErr, pSlow, pFast])
  .then(value => console.log(value)); // "fast" (not the error!)

// All reject -> AggregateError
Promise.any([
  Promise.reject("A"),
  Promise.reject("B"),
]).catch(err => {
  console.log(err instanceof AggregateError); // true
  console.log(err.errors); // ["A", "B"] - in original promise order
});

// Empty iterable -> immediate rejection
Promise.any([]).catch(err => {
  console.log(err.message); // "No Promise in Promise.any was resolved"
});
```

### Async/Await Suspension (V8 Blog Verified)
```typescript
// Source: https://v8.dev/blog/fast-async
// ASYNC-08: AsyncAwaitSyntaxViz

async function fetchData() {
  console.log('fetching');     // Runs synchronously
  await Promise.resolve();     // PAUSES HERE - rest becomes microtask
  console.log('done');         // Runs in microtask
}

console.log('start');
fetchData();                   // Starts, but pauses at await
console.log('end');            // Runs before 'done'!

// Output: start, fetching, end, done
```

### Microtask Draining Behavior (javascript.info Verified)
```typescript
// Source: https://javascript.info/event-loop
// ASYNC-11: MicrotaskQueueViz

// Microtasks run until queue empty, even newly added ones
queueMicrotask(() => {
  console.log('micro 1');
  queueMicrotask(() => {
    console.log('micro 2');  // Added DURING micro 1, still runs before any macrotask
  });
});

setTimeout(() => console.log('macro'), 0);

// Output: micro 1, micro 2, macro
// Key insight: micro 2 runs before macro even though it was queued later
```

### Event Loop Tick Cycle (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth
// ASYNC-13: EventLoopTickViz

// One complete event loop iteration:
// 1. Run one macrotask (if available)
// 2. Run ALL microtasks (drain queue completely)
// 3. Render if needed
// 4. Repeat

// Visual representation for progressive disclosure:
// Beginner: "Check queues -> Run one task -> Repeat"
// Intermediate: "Macrotask -> All Microtasks -> Macrotask -> ..."
// Advanced: "Macrotask -> All Microtasks -> Render -> Idle -> Macrotask"
```

### Try/Catch with Async/Await (Spec Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
// ASYNC-09: AsyncAwaitErrorsViz

async function fetchWithError() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    // Catches both network errors and JSON parse errors
    console.error('Failed:', error.message);
    throw error; // Re-throw to propagate
  }
}

// Error propagation through async chain
async function main() {
  try {
    await fetchWithError();  // Error bubbles up
  } catch (error) {
    // Caught here
  }
}
```

### Promise.all with Async/Await (Parallel Pattern)
```typescript
// ASYNC-10: AsyncAwaitParallelViz

// WRONG: Sequential (slow)
async function sequential() {
  const a = await fetch('/a');
  const b = await fetch('/b');
  return [a, b];
}

// RIGHT: Parallel (fast)
async function parallel() {
  const [a, b] = await Promise.all([
    fetch('/a'),
    fetch('/b')
  ]);
  return [a, b];
}

// Key insight: Start all promises first, then await Promise.all
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Promise libraries (Q, Bluebird) | Native Promise | ES2015 | No polyfills needed |
| Promise.all + filtering | Promise.allSettled | ES2020 | No need to catch-and-filter |
| Promise.race for first success | Promise.any | ES2021 | First fulfillment without rejection handling |
| Generator-based async (co) | Native async/await | ES2017 | Cleaner syntax, better stack traces |
| Multiple microtask ticks for await | Single microtask for await | V8 v7.2+ (2019) | Performance improvement |

**Deprecated/outdated:**
- AsyncPatternsViz.tsx: Simple placeholder with mode prop, NOT a template
- Bluebird/Q promise libraries: Native promises sufficient now
- Generator + co pattern: async/await is the standard

## Specific Component Templates

### ASYNC-07: PromisesStaticViz
**Template:** PromisesViz.tsx extended with comparison layout
**Key visual elements:**
- Four-column comparison (all, race, allSettled, any)
- Settlement timeline showing which resolves first
- Result state for each method given same input promises
- AggregateError display for Promise.any edge case
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  inputPromises: { id: string; state: 'pending' | 'fulfilled' | 'rejected'; value?: string; settleOrder?: number }[]
  results: {
    all: { state: 'pending' | 'fulfilled' | 'rejected'; value?: string }
    race: { state: 'pending' | 'fulfilled' | 'rejected'; value?: string }
    allSettled: { state: 'pending' | 'fulfilled'; value?: { status: string; value?: string; reason?: string }[] }
    any: { state: 'pending' | 'fulfilled' | 'rejected'; value?: string; aggregateError?: string[] }
  }
  output: string[]
  phase: string
}
```

### ASYNC-08: AsyncAwaitSyntaxViz
**Template:** EventLoopViz.tsx with suspension indicators
**Key visual elements:**
- Code panel with await line highlighting
- "Async Function State" indicator (running/suspended/completed)
- Microtask queue showing continuation
- Call stack showing suspended functions
**Step structure:**
```typescript
interface Step {
  description: string
  codeLine: number
  asyncFunctions: { name: string; state: 'running' | 'suspended' | 'completed'; awaitLine?: number }[]
  callStack: string[]
  microQueue: string[]  // Shows continuations
  output: string[]
  phase: 'sync' | 'await' | 'resume' | 'complete'
}
```

### ASYNC-09: AsyncAwaitErrorsViz
**Template:** ErrorFirstCallbacksViz.tsx (fork diagram)
**Key visual elements:**
- try/catch block highlighting
- Error path vs success path fork (red/green)
- Error propagation through async chain
- Stack trace visualization (advanced)
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  errorPath: { active: boolean; errorValue?: string; caught?: boolean }
  successPath: { active: boolean; value?: string }
  asyncChain: { name: string; state: 'pending' | 'success' | 'error' }[]
  output: string[]
  phase: 'calling' | 'try' | 'catch' | 'success' | 'error' | 'propagate'
}
```

### ASYNC-10: AsyncAwaitParallelViz
**Template:** EventLoopViz.tsx + PromisesViz.tsx hybrid
**Key visual elements:**
- Sequential vs parallel comparison (split view)
- Timeline showing total execution time
- Promise.all aggregation visualization
- "All started" indicator vs "waiting for each"
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  mode: 'sequential' | 'parallel'
  promises: { id: string; state: 'pending' | 'fulfilled'; startTime: number; endTime?: number }[]
  totalTime?: number
  output: string[]
  phase: string
}
```

### ASYNC-11: MicrotaskQueueViz
**Template:** EventLoopViz.tsx focused on microtask queue
**Key visual elements:**
- Prominent microtask queue with slide-out animation
- "Draining" indicator when processing
- New microtasks appearing during processing
- Macrotask queue dimmed (waiting)
**Step structure:**
```typescript
interface Step {
  description: string
  codeLine: number
  microQueue: { id: string; source: string; label: string }[]
  macroQueue: { id: string; source: string; label: string }[]
  currentlyDraining: boolean
  spawnedDuringDrain: string[]  // New microtasks added during processing
  output: string[]
  phase: 'sync' | 'draining' | 'spawning' | 'complete'
}
```

### ASYNC-12: TaskQueueViz
**Template:** EventLoopViz.tsx focused on macrotask queue
**Key visual elements:**
- Prominent macrotask queue with sources labeled (setTimeout, setInterval, I/O)
- Delay timers showing countdown
- "One at a time" indicator
- Microtask checkpoint after each macrotask
**Step structure:**
```typescript
interface Step {
  description: string
  codeLine: number
  macroQueue: { id: string; source: 'setTimeout' | 'setInterval' | 'I/O'; label: string; delay?: number }[]
  microQueue: string[]
  currentMacrotask?: string
  microCheckpoint: boolean  // True when checking microtasks between macrotasks
  output: string[]
  phase: 'sync' | 'macro' | 'micro-check' | 'idle'
}
```

### ASYNC-13: EventLoopTickViz
**Template:** EventLoopGranularViz.tsx extended
**Key visual elements:**
- Circular event loop diagram with current phase indicator
- Phase labels: Task, Microtasks, Render, Idle
- Progressive detail:
  - Beginner: check -> run -> repeat
  - Intermediate: task -> all microtasks -> task
  - Advanced: task -> microtasks -> render -> idle callbacks
**Step structure:**
```typescript
interface Step {
  description: string
  codeLine: number
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  currentPhase: 'idle' | 'task' | 'microtasks' | 'render' | 'idle-callbacks'
  loopIteration: number
  output: string[]
  phaseDetail: string  // Human-readable phase explanation
}
```

## Open Questions

Things that couldn't be fully resolved:

1. **Render timing in event loop**
   - What we know: Render happens after microtasks, before next macrotask
   - What's unclear: Exact browser implementation varies (requestAnimationFrame timing)
   - Recommendation: Show simplified model at beginner/intermediate, note browser differences at advanced

2. **Node.js vs Browser event loop differences**
   - What we know: Node has additional phases (setImmediate, process.nextTick)
   - What's unclear: How much Node detail to include
   - Recommendation: Focus on browser model, add Note for Node differences at advanced level

3. **Layout choice for PromisesStaticViz**
   - What we know: Need to compare 4 methods
   - What's unclear: Side-by-side columns vs tabbed view
   - Recommendation: Side-by-side for desktop (shows comparison at once), stack for mobile

## Sources

### Primary (HIGH confidence)
- MDN Promise.any: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
- MDN Microtask guide: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth
- V8 Fast Async: https://v8.dev/blog/fast-async
- javascript.info Event Loop: https://javascript.info/event-loop
- javascript.info Microtasks: https://javascript.info/microtask-queue
- Existing EventLoopViz.tsx - Queue animation patterns
- Existing ErrorFirstCallbacksViz.tsx - Fork diagram pattern
- Existing SharedViz components - CodePanel, StepControls, StepProgress

### Secondary (MEDIUM confidence)
- ECMAScript Specification: https://tc39.es/ecma262/ (Promise.any, microtask queue spec)
- Phase 18 RESEARCH.md - Established patterns for this phase

### Tertiary (LOW confidence)
- WebSearch results for "event loop 2026" - General patterns verified against primary sources
- AsyncPatternsViz.tsx - Simple placeholder, NOT a template

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly observed in existing components
- Architecture patterns: HIGH - EventLoopViz and ErrorFirstCallbacksViz provide templates
- Microtask/macrotask behavior: HIGH - Verified against MDN and ECMAScript spec
- Component templates: MEDIUM - Extrapolated from existing patterns + spec knowledge
- Edge cases (starvation, AggregateError): HIGH - Verified against MDN

**Research date:** 2026-01-30
**Valid until:** 60 days (stable JavaScript spec, internal patterns stable)
