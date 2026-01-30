# Phase 18: Callbacks & Promises Foundation - Research

**Researched:** 2026-01-30
**Domain:** JavaScript Async Visualization Components (React/Framer Motion)
**Confidence:** HIGH

## Summary

This research investigates how to build 6 new visualization components (ASYNC-01 through ASYNC-06) for teaching callbacks and promises fundamentals. The project already has 37+ existing Viz components with established patterns, including highly relevant templates: `EventLoopViz` (queue-based), `PromisesViz` (promise state-based), and `ClosuresViz` (scope chain visualization).

The existing codebase establishes a clear, consistent pattern:
1. Self-contained components with inline step data arrays
2. Three difficulty levels (beginner/intermediate/advanced)
3. Framer Motion for animations with AnimatePresence for step transitions
4. Either CSS Modules or inline Tailwind classes for styling
5. Step controls (Prev/Next/Reset) with codeLine highlighting
6. "Key Insight" section at the bottom of each visualization

**Primary recommendation:** Copy the existing `EventLoopViz.tsx` and `PromisesViz.tsx` patterns verbatim, adapting only the step data and visual elements for each new concept. Do NOT introduce new architectural patterns or shared components.

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
| Lucide React | latest | Icons | RefreshCw icon for event loop spinner |
| CSS Modules | n/a | Styling | When complex styles needed (see PromisesViz) |
| Tailwind | 3.x | Utility classes | For inline styling (see EventLoopViz, ClosuresViz) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Modules | Pure Tailwind | All recent Viz components use Tailwind inline - prefer Tailwind for consistency |
| Custom animation | Framer Motion | Never hand-roll - Framer Motion is the project standard |

**Installation:**
```bash
# No new dependencies required - all already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── CallbacksBasicsViz.tsx        # ASYNC-01
├── CallbackHellViz.tsx           # ASYNC-02
├── ErrorFirstCallbacksViz.tsx    # ASYNC-03
├── PromisesCreationViz.tsx       # ASYNC-04
├── PromisesThenCatchViz.tsx      # ASYNC-05
├── PromisesChainingViz.tsx       # ASYNC-06
└── [existing 37+ Viz components]
```

### Pattern 1: Step-Based Visualization (Primary Pattern)
**What:** Each Viz component defines inline `examples` data with `steps` arrays containing all visualization state
**When to use:** ALL 6 new components
**Example:**
```typescript
// Source: EventLoopViz.tsx, PromisesViz.tsx, ClosuresViz.tsx
interface Step {
  description: string
  codeLine: number | number[]     // Can be single line or highlightLines array
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

type Level = 'beginner' | 'intermediate' | 'advanced'

const examples: Record<Level, Example[]> = {
  beginner: [...],
  intermediate: [...],
  advanced: [...]
}
```

### Pattern 2: Level + Example Selection UI
**What:** Top-level selector for difficulty, then example tabs
**When to use:** ALL 6 new components (mandatory)
**Example:**
```typescript
// Source: All existing Viz components
const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}
```

### Pattern 3: Neon Box Visual Containers
**What:** Gradient-bordered containers with floating labels
**When to use:** Major visual sections (queues, stacks, promise states)
**Example:**
```typescript
// Source: EventLoopViz.tsx, ClosuresViz.tsx
<div className="relative rounded-xl p-[3px]"
  style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}>
  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-[var(--spacing-lg)] py-[5px] bg-[var(--color-bg-tertiary)] rounded-b-lg text-sm font-semibold text-white whitespace-nowrap z-10">
    Section Label
  </div>
  <div className="bg-[var(--color-bg-page-secondary)] rounded-lg min-h-[200px] p-[var(--spacing-md)] pt-6">
    {/* Content */}
  </div>
</div>
```

### Pattern 4: AnimatePresence for Step Transitions
**What:** Framer Motion AnimatePresence with mode="popLayout" or mode="wait"
**When to use:** Any list of items that changes between steps
**Example:**
```typescript
// Source: EventLoopViz.tsx, PromisesViz.tsx
<AnimatePresence mode="popLayout">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      layout
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

### Anti-Patterns to Avoid
- **Shared visualization components:** The project explicitly uses copy-paste approach. Do NOT create a `SharedVizWrapper` or similar.
- **External state management:** Steps are inline data, NOT fetched or stored in zustand/context.
- **New animation libraries:** Framer Motion only. Do NOT add react-spring, CSS animations, etc.
- **Mode props for switching:** Each concept gets its OWN component file. Do NOT add `mode` prop to existing components.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation timing | Manual setTimeout | Framer Motion `animate`/`transition` | Cancellation, interruption handling |
| List animations | CSS transitions | AnimatePresence + layout | Exit animations, reordering |
| State transitions | Custom state machine | useState with step index | Simpler, matches existing code |
| Code highlighting | Custom parser | `highlightLines` array pattern | Already solved in all components |
| Step navigation | Complex reducer | Simple prev/next/reset handlers | Matches existing pattern |

**Key insight:** The existing 37+ components have solved all visualization challenges. Copy their patterns exactly rather than inventing new approaches.

## Common Pitfalls

### Pitfall 1: Forgetting 'use client' Directive
**What goes wrong:** Component won't render, cryptic Next.js errors
**Why it happens:** All Viz components use hooks, must be client components
**How to avoid:** First line of every new component: `'use client'`
**Warning signs:** "useState is not defined" errors

### Pitfall 2: Inconsistent Level/Example Structure
**What goes wrong:** Level selector breaks, examples don't show
**Why it happens:** Missing one of the three levels or empty example arrays
**How to avoid:** Always provide beginner, intermediate, AND advanced examples (minimum 1 each)
**Warning signs:** TypeScript errors about missing keys in Record

### Pitfall 3: Step Data Missing Required Fields
**What goes wrong:** Component crashes on step navigation
**Why it happens:** Each step must have all fields the template expects
**How to avoid:** Define interface for Step, ensure all steps match
**Warning signs:** "Cannot read property of undefined" on step navigation

### Pitfall 4: Incorrect AnimatePresence Keys
**What goes wrong:** Animations don't trigger, items don't animate out
**Why it happens:** Framer Motion needs stable, unique keys for tracking
**How to avoid:** Use `key={item.id}` or `key={item + index}` pattern from existing code
**Warning signs:** Items "jump" instead of animating

### Pitfall 5: Breaking Tailwind Variable Pattern
**What goes wrong:** Styles don't match rest of project
**Why it happens:** Project uses CSS variables like `var(--spacing-md)`, `var(--color-brand-primary)`
**How to avoid:** Copy style classes exactly from reference components
**Warning signs:** Colors or spacing look different from existing components

### Pitfall 6: State Reset on Level/Example Change
**What goes wrong:** Step index out of bounds, crashes
**Why it happens:** Forgot to reset stepIndex when changing level/example
**How to avoid:** Always setStepIndex(0) in level/example change handlers
**Warning signs:** Crash when switching examples

## Code Examples

Verified patterns from existing codebase:

### Level Selector Component
```typescript
// Source: EventLoopViz.tsx lines 986-1004
<div className="flex gap-[var(--spacing-sm)] justify-center mb-1 bg-[var(--js-viz-surface-2)] border border-[var(--js-viz-border)] rounded-full p-[0.35rem] shadow-[inset_0_0_0_1px_var(--color-white-2)]">
  {(Object.keys(levelInfo) as Level[]).map(lvl => (
    <button
      key={lvl}
      className={`flex items-center gap-1.5 px-[var(--spacing-md)] py-1.5 text-sm font-medium rounded-full transition-all duration-fast cursor-pointer
        ${level === lvl
          ? 'bg-[var(--color-neon-viz-18)] border border-[var(--color-neon-viz-70)] text-[var(--color-text-bright)] shadow-[var(--glow-xl)_var(--color-neon-viz-25)]'
          : 'bg-[var(--color-white-4)] border border-[var(--js-viz-border)] text-[var(--js-viz-muted)] hover:bg-[var(--color-white-8)] hover:text-[var(--js-viz-text)]'
        }`}
      onClick={() => handleLevelChange(lvl)}
      style={{
        borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
        background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
      }}
    >
      <span className="w-[var(--spacing-sm)] h-[var(--spacing-sm)] rounded-full" style={{ background: levelInfo[lvl].color }} />
      {levelInfo[lvl].label}
    </button>
  ))}
</div>
```

### Step Navigation Handlers
```typescript
// Source: PromisesViz.tsx, EventLoopViz.tsx, ClosuresViz.tsx
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
```

### Promise State Card (for ASYNC-04, ASYNC-05, ASYNC-06)
```typescript
// Source: PromisesViz.tsx lines 561-607
<motion.div
  key={p.id}
  className={styles.promiseCard}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  layout
  style={{
    borderColor: getPromiseStateColor(p.state),
    boxShadow: `0 0 20px ${getPromiseStateColor(p.state)}40`
  }}
>
  <div className={styles.promiseLabel}>{p.label}</div>
  <motion.div
    className={styles.promiseState}
    style={{ color: getPromiseStateColor(p.state) }}
    key={p.state}
    initial={{ scale: 1.2 }}
    animate={{ scale: 1 }}
  >
    {p.state.toUpperCase()}
  </motion.div>
  {/* value/reason display */}
</motion.div>
```

### Callback Queue Visualization (for ASYNC-01, ASYNC-02, ASYNC-03)
```typescript
// Source: EventLoopViz.tsx - macroQueue pattern
<div className="flex flex-col gap-1.5">
  <AnimatePresence mode="popLayout">
    {queue.length === 0 ? (
      <div className="text-[var(--color-gray-800)] text-sm text-center py-[var(--spacing-lg)]">(empty)</div>
    ) : (
      queue.map((item, i) => (
        <motion.div
          key={item + i}
          className="px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-amber-15)] border border-[var(--color-amber-40)] rounded-md font-mono text-xs text-[var(--color-amber-400)] text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          layout
        >
          {item}
        </motion.div>
      ))
    )}
  </AnimatePresence>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS Modules everywhere | Tailwind inline classes | Recent Viz components | Easier to maintain, copy patterns |
| Separate SharedViz components | Copy-paste self-contained | Project decision | Each Viz independent, no coupling |
| Complex state machines | Simple useState + stepIndex | Always | Simpler debugging |

**Deprecated/outdated:**
- AsyncPatternsViz.tsx is a simple/incomplete version - NOT a template to follow
- ErrorHandlingViz.tsx uses simple mode-based switching - NOT the pattern for new components

## Specific Component Templates

### ASYNC-01: CallbacksBasicsViz
**Template:** EventLoopViz.tsx (simplified)
**Key visual elements:**
- Code panel with line highlighting
- "Function Being Called" area showing which function is executing
- "Callback Queue" showing registered callbacks
- "When Callback Runs" indicator
**Step structure:**
```typescript
interface Step {
  description: string
  codeLine: number
  executingFunction: string | null
  registeredCallbacks: { name: string; waiting: boolean }[]
  output: string[]
  phase: 'sync' | 'registering' | 'invoking'
}
```

### ASYNC-02: CallbackHellViz
**Template:** ClosuresViz.tsx (nesting visualization)
**Key visual elements:**
- Code panel with pyramid indentation clearly visible
- "Nesting Depth" indicator (1, 2, 3... levels)
- Visual pyramid showing depth progression
- "Readability Score" that degrades with depth
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  nestingDepth: number
  readabilityIssues: string[]
  output: string[]
  phase: 'normal' | 'nested' | 'pyramid'
}
```

### ASYNC-03: ErrorFirstCallbacksViz
**Template:** EventLoopViz.tsx + error handling
**Key visual elements:**
- Code panel showing error-first pattern
- "Error Path" vs "Success Path" visual branch
- Error propagation through callback chain
- Error object structure display
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  errorPath: { active: boolean; errorValue?: string }
  successPath: { active: boolean; value?: string }
  callbackChain: { name: string; hasError: boolean }[]
  output: string[]
  phase: 'calling' | 'error-check' | 'success' | 'error'
}
```

### ASYNC-04: PromisesCreationViz
**Template:** PromisesViz.tsx
**Key visual elements:**
- Code panel highlighting executor function
- Promise state card (pending -> fulfilled/rejected)
- "Executor Runs Synchronously" indicator
- resolve/reject call highlighting
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  promises: { id: string; label: string; state: 'pending' | 'fulfilled' | 'rejected'; value?: string }[]
  executorPhase: 'running' | 'complete'
  output: string[]
  phase: string
}
```

### ASYNC-05: PromisesThenCatchViz
**Template:** PromisesViz.tsx
**Key visual elements:**
- Promise chain visualization (P1 -> P2 -> P3)
- Value flow arrows between promises
- .then()/.catch() handler highlighting
- Return value transformation display
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  promises: { id: string; label: string; state: 'pending' | 'fulfilled' | 'rejected'; value?: string }[]
  valueFlow: { from: string; to: string; value: string }[]
  activeHandler: 'then' | 'catch' | 'finally' | null
  output: string[]
  phase: string
}
```

### ASYNC-06: PromisesChainingViz
**Template:** PromisesViz.tsx (chained-promises example extended)
**Key visual elements:**
- Sequential promise chain (P1 -> P2 -> P3 -> ...)
- "Waiting for Previous" indicator
- Value transformation at each step
- State transitions timeline
**Step structure:**
```typescript
interface Step {
  description: string
  highlightLines: number[]
  promiseChain: { id: string; state: 'pending' | 'fulfilled'; value?: string; waitingFor?: string }[]
  currentlyExecuting: string | null
  output: string[]
  phase: string
}
```

## Open Questions

Things that couldn't be fully resolved:

1. **Exact CSS variable names**
   - What we know: Project uses CSS variables extensively (`var(--spacing-md)`, `var(--color-brand-primary)`)
   - What's unclear: Full list of available variables (need to check globals.css)
   - Recommendation: Copy classes directly from EventLoopViz.tsx, they work

2. **Icon requirements**
   - What we know: VISUALIZATION-RESEARCH.md specifies icons per concept
   - What's unclear: Whether icons are needed IN the Viz component or just in navigation
   - Recommendation: Focus on Viz content first, icons are likely for concept cards not visualizations

## Sources

### Primary (HIGH confidence)
- EventLoopViz.tsx - Queue-based animation patterns, step structure
- PromisesViz.tsx - Promise state visualization, CSS Modules pattern
- ClosuresViz.tsx - Scope/heap visualization, neon box pattern
- RecursionViz.tsx - Call stack visualization pattern

### Secondary (MEDIUM confidence)
- PHASE-2-ASYNC-FOUNDATION.md - Content requirements, learning objectives
- VISUALIZATION-RESEARCH.md - Overall viz strategy, reuse decisions

### Tertiary (LOW confidence)
- AsyncPatternsViz.tsx - Simple placeholder, NOT a template (too basic)
- ErrorHandlingViz.tsx - Different pattern (mode-based), not recommended

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly observed in 37+ existing components
- Architecture patterns: HIGH - Consistent across ALL reviewed components
- Pitfalls: HIGH - Derived from actual code patterns and TypeScript requirements
- Component templates: MEDIUM - Extrapolated from existing patterns

**Research date:** 2026-01-30
**Valid until:** 60 days (stable internal patterns, no external dependencies)
