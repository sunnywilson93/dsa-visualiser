# Phase 2: LoopsViz - Research

**Researched:** 2026-01-24
**Domain:** Loop iteration step-through visualization with closure capture demonstration
**Confidence:** HIGH

## Summary

This research analyzed the existing codebase to understand how to build LoopsViz, a step-through loop visualization component. The codebase has a well-established pattern for visualization components demonstrated by EventLoopViz (gold standard) and ClosuresViz (which already contains the var vs let closure bug examples). Phase 1 has produced SharedViz components (CodePanel, StepProgress, StepControls, useAutoPlay) that provide the foundation for this phase.

The existing LoopsViz component is a simple auto-play animation without step controls. This phase will completely rewrite it to follow the EventLoopViz pattern: step-based navigation, difficulty levels (beginner/intermediate/advanced), multiple examples per level, and educational descriptions per step. The closure capture bug visualization already exists in ClosuresViz and can serve as a reference pattern for the loop-specific implementation.

**Primary recommendation:** Build LoopsViz following the EventLoopViz architecture pattern: Level type selectors, Example selectors within each level, Step state management, SharedViz components for code/controls/progress, and animated state visualization panels.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | Component framework | Project standard |
| TypeScript | ~5.5.0 | Type safety | Project-wide TypeScript |
| framer-motion | ^11.0.0 | Step animations | Used in EventLoopViz, ClosuresViz |
| CSS Modules | (native) | Scoped styling | `.module.css` pattern throughout |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.400.0 | Icons | Optional loop indicator icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual step data | Interpreter engine | Interpreter engine is for arbitrary code; curated examples need hand-crafted steps for educational clarity |

**Installation:**
No new packages needed - all dependencies already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/components/
├── SharedViz/                    # From Phase 1 (READY)
│   ├── CodePanel.tsx             # Code display with line highlighting
│   ├── StepProgress.tsx          # "Step X/Y" with description
│   ├── StepControls.tsx          # Prev/Next/Reset buttons
│   ├── useAutoPlay.ts            # Auto-play hook (not used for LOOP-01)
│   └── index.ts
└── Concepts/
    ├── EventLoopViz.tsx          # Pattern reference (1200+ lines)
    ├── ClosuresViz.tsx           # Has closure capture examples to reference
    └── LoopsViz.tsx              # REWRITE this file
```

### Pattern 1: Level + Example + Step State Management
**What:** Three levels of state: difficulty level, example within level, step within example
**When to use:** All visualization components with progressive difficulty
**Example:**
```typescript
// Source: EventLoopViz.tsx
type Level = 'beginner' | 'intermediate' | 'advanced'

const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)

// Reset cascades down
const handleLevelChange = (newLevel: Level) => {
  setLevel(newLevel)
  setExampleIndex(0)
  setStepIndex(0)
}

const handleExampleChange = (index: number) => {
  setExampleIndex(index)
  setStepIndex(0)
}
```

### Pattern 2: Loop-Specific Step Interface
**What:** Define step data shape for loop visualizations
**When to use:** LoopsViz step data
**Example:**
```typescript
interface LoopStep {
  id: number
  codeLine: number           // Line to highlight (-1 for none)
  description: string        // Educational explanation
  phase: 'init' | 'condition' | 'body' | 'update' | 'done'
  loopState: {
    iteration: number        // Current iteration (0-indexed)
    variable: string         // Loop variable name (i, j, item, key)
    value: number | string   // Current value
    condition: string        // e.g., "i < 3"
    conditionMet: boolean    // true/false
  }
  output: string[]           // Console output accumulated
  currentOutputIndex?: number // Which output was just added (for highlighting)
  // For closure examples
  bindings?: LoopBinding[]   // var: shared binding, let: per-iteration
}

interface LoopBinding {
  iteration: number
  variableName: string
  value: number | string
  callbacks?: string[]       // Callbacks referencing this binding
}
```

### Pattern 3: Example Data Structure
**What:** Examples organized by difficulty with loop-specific metadata
**When to use:** Defining example data
**Example:**
```typescript
interface LoopExample {
  id: string
  title: string
  loopType: 'for' | 'while' | 'do-while' | 'for-of' | 'for-in'
  code: string[]             // Code lines as array
  steps: LoopStep[]
  insight: string            // Key takeaway
  whyItMatters?: string      // Educational context for beginners
}

const examples: Record<Level, LoopExample[]> = {
  beginner: [/* 4-5 examples */],
  intermediate: [/* 4-5 examples */],
  advanced: [/* 4-5 examples including closure capture */]
}
```

### Pattern 4: Output Display with Current Highlight
**What:** Show all output but visually distinguish what the current step produced
**When to use:** Per user decision on output display
**Example:**
```typescript
// Source: Derived from context decision
<div className={styles.outputContent}>
  {step.output.map((line, i) => (
    <motion.div
      key={i}
      className={`${styles.outputLine} ${
        i === step.currentOutputIndex ? styles.currentOutput : ''
      }`}
      initial={{ opacity: i === step.currentOutputIndex ? 0 : 1, x: i === step.currentOutputIndex ? -10 : 0 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {line}
    </motion.div>
  ))}
</div>
```

### Pattern 5: Difficulty-Adapted Explanations
**What:** Simpler explanations for beginners, more technical for advanced
**When to use:** Step descriptions
**Example:**
```typescript
// Beginner: More context, why it matters
{
  description: "The loop checks if i (currently 0) is less than 3. Since 0 < 3 is true, we enter the loop body. This is called the 'condition check' - it runs BEFORE each iteration.",
  // ...
}

// Advanced: Terse, assumes knowledge
{
  description: "Condition check: i < 3 (0 < 3 = true). Enter body.",
  // ...
}
```

### Anti-Patterns to Avoid
- **Not using SharedViz components:** Use CodePanel, StepProgress, StepControls from Phase 1
- **Mixing loop types in one example:** Each example should demonstrate one loop type clearly
- **Skipping condition check steps:** Always show condition evaluation explicitly
- **Forgetting reset on level/example change:** Always reset stepIndex when changing context

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code panel with line highlight | Custom code display | SharedViz CodePanel | Already handles scrollIntoView, line numbers, highlighting |
| Step navigation controls | Custom buttons | SharedViz StepControls | Consistent styling, auto-pause on manual control |
| Step progress indicator | Custom badge | SharedViz StepProgress | Animated transitions, consistent look |
| Closure capture visualization | New component from scratch | ClosuresViz pattern | Advanced examples in ClosuresViz already show var vs let loop bug |
| Level selector buttons | Custom implementation | Copy from EventLoopViz | Pill-style buttons with color coding |

**Key insight:** EventLoopViz and ClosuresViz already implement the exact patterns needed. Extract and adapt, don't reinvent.

## Common Pitfalls

### Pitfall 1: Not Showing Condition Check Separately
**What goes wrong:** Loop jumps from update to body without showing condition evaluation
**Why it happens:** Tendency to skip "obvious" steps
**How to avoid:** Always include explicit condition check step between iterations
**Warning signs:** Users confused about when/how loops decide to continue

### Pitfall 2: Closure Example Without setTimeout
**What goes wrong:** Closure bug example doesn't actually show the async behavior
**Why it happens:** Simplifying too much loses the "aha moment"
**How to avoid:** Include setTimeout/async to show callbacks firing after loop completes
**Warning signs:** Users don't understand WHY all callbacks see final value

### Pitfall 3: Too Many Iterations
**What goes wrong:** Example has 10 iterations, user loses patience
**Why it happens:** Trying to show "realistic" loops
**How to avoid:** Use 3-4 iterations max; learning happens in first few
**Warning signs:** Users skip ahead, don't step through carefully

### Pitfall 4: Missing "Why This Matters" Context
**What goes wrong:** Beginner doesn't understand relevance of what they're seeing
**Why it happens:** Focusing on mechanics over motivation
**How to avoid:** Include whyItMatters field for beginner examples; reference interview questions
**Warning signs:** Users say "so what?" after completing example

### Pitfall 5: Inconsistent Visual Style with Other Viz Components
**What goes wrong:** LoopsViz looks different from EventLoopViz, ClosuresViz
**Why it happens:** Not reusing CSS patterns
**How to avoid:** Use same CSS variable names, neonBox pattern, levelSelector pattern
**Warning signs:** Visual jarring when navigating between concept pages

### Pitfall 6: Not Highlighting Current Output
**What goes wrong:** All output shown but user doesn't know what just happened
**Why it happens:** Forgetting per-context decision to highlight current step's output
**How to avoid:** Track currentOutputIndex and apply highlight styling
**Warning signs:** User confused about which output line corresponds to current step

## Code Examples

Verified patterns from existing codebase:

### Level Selector (from EventLoopViz)
```typescript
// Source: EventLoopViz.tsx lines 986-1000
type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

<div className={styles.levelSelector}>
  {(Object.keys(levelInfo) as Level[]).map(lvl => (
    <button
      key={lvl}
      className={`${styles.levelBtn} ${level === lvl ? styles.activeLevel : ''}`}
      onClick={() => handleLevelChange(lvl)}
      style={{
        borderColor: level === lvl ? levelInfo[lvl].color : 'transparent',
        background: level === lvl ? `${levelInfo[lvl].color}15` : 'transparent'
      }}
    >
      <span className={styles.levelDot} style={{ background: levelInfo[lvl].color }}></span>
      {levelInfo[lvl].label}
    </button>
  ))}
</div>
```

### Using SharedViz Components
```typescript
// Source: SharedViz from Phase 1
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

// In component:
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
  onPrev={() => setStepIndex(s => s - 1)}
  onNext={() => setStepIndex(s => s + 1)}
  onReset={() => setStepIndex(0)}
  canPrev={stepIndex > 0}
  canNext={stepIndex < currentExample.steps.length - 1}
/>
```

### Loop State Visualization Panel
```typescript
// Source: Derived from EventLoopViz pattern
<div className={styles.loopStateBox}>
  <div className={styles.boxHeader}>Loop State</div>
  <div className={styles.boxContent}>
    <div className={styles.stateRow}>
      <span className={styles.stateLabel}>Iteration:</span>
      <motion.span
        key={step.loopState.iteration}
        className={styles.stateValue}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
      >
        {step.loopState.iteration}
      </motion.span>
    </div>
    <div className={styles.stateRow}>
      <span className={styles.stateLabel}>{step.loopState.variable}:</span>
      <motion.span
        key={step.loopState.value}
        className={styles.stateValue}
        initial={{ color: '#f59e0b' }}
        animate={{ color: '#10b981' }}
      >
        {step.loopState.value}
      </motion.span>
    </div>
    <div className={styles.conditionRow}>
      <span className={`${styles.condition} ${step.loopState.conditionMet ? styles.conditionTrue : styles.conditionFalse}`}>
        {step.loopState.condition} = {step.loopState.conditionMet ? 'true' : 'false'}
      </span>
    </div>
  </div>
</div>
```

### Closure Binding Visualization (for var vs let)
```typescript
// Source: Derived from ClosuresViz heap visualization pattern
// Show multiple bindings for let (one per iteration) vs single for var
{step.bindings && (
  <div className={styles.bindingsPanel}>
    <div className={styles.boxHeader}>
      {step.bindings.length === 1 ? 'Single Binding (var)' : 'Per-Iteration Bindings (let)'}
    </div>
    <div className={styles.bindingsGrid}>
      {step.bindings.map((binding, i) => (
        <motion.div
          key={i}
          className={styles.bindingBox}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.bindingHeader}>Iteration {binding.iteration}</div>
          <div className={styles.bindingValue}>
            {binding.variableName} = {binding.value}
          </div>
          {binding.callbacks?.map(cb => (
            <div key={cb} className={styles.callbackRef}>
              {cb} -> {binding.variableName}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  </div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-play only (current LoopsViz) | Step-through with controls | This phase | User control over learning pace |
| Single example | Multiple examples by difficulty | EventLoopViz pattern | Progressive learning path |
| No closure examples | var vs let comparison | This phase | Addresses common interview topic |

**Deprecated/outdated:**
- Current LoopsViz.tsx: Simple auto-play animation, will be completely rewritten

## Open Questions

Things that couldn't be fully resolved:

1. **Closure Capture Placement**
   - What we know: Context says "Claude's discretion" on whether to feature prominently or include in advanced
   - What's unclear: Whether to duplicate from ClosuresViz or reference it
   - Recommendation: Include 1-2 loop-specific closure examples in advanced level, but focus on loop mechanics (ClosuresViz already covers closure theory deeply)

2. **Nested Loop Examples**
   - What we know: Context says "Claude's discretion" on whether to include
   - What's unclear: Whether nested loops are too complex for this visualization
   - Recommendation: Include ONE nested loop example in advanced level (simple 2x2 matrix traversal); helps with interview prep

3. **do-while Visual Distinction**
   - What we know: do-while executes body before condition check
   - What's unclear: How to visually emphasize this difference
   - Recommendation: Use different phase colors and explicit "body first, then condition" step description

## Sources

### Primary (HIGH confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/EventLoopViz.tsx` - Gold standard visualization pattern
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/ClosuresViz.tsx` - Loop closure bug examples (advanced section)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/SharedViz/*.tsx` - Phase 1 foundation components
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/phases/01-foundation/01-RESEARCH.md` - Phase 1 research findings
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/phases/02-loopsviz/02-CONTEXT.md` - User decisions for this phase

### Secondary (MEDIUM confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/LoopsViz.tsx` - Current simple implementation to replace
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/EventLoopViz.module.css` - CSS patterns to match

### Tertiary (LOW confidence)
- None - all findings from codebase analysis

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Direct from package.json and existing code
- Architecture: HIGH - Patterns extracted from EventLoopViz, ClosuresViz
- Pitfalls: HIGH - Based on context decisions and observed patterns
- Closure capture: MEDIUM - ClosuresViz has the examples, but loop-specific framing needs planning

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable internal patterns)

---

## Example Coverage Plan

Based on context decisions (4-5 examples per level, comprehensive loop types):

### Beginner Level (~4 examples)
1. **Basic for loop** - Classic `for (let i = 0; i < 3; i++)` with console.log
2. **while loop** - Counter-based while with clear condition
3. **for...of array** - Iterating array values directly
4. **for...in object** - Iterating object keys

### Intermediate Level (~4 examples)
1. **for loop with break** - Early termination concept
2. **for loop with continue** - Skip iteration concept
3. **while with complex condition** - Multiple conditions
4. **for...of with index** - Using entries() or manual index

### Advanced Level (~4 examples)
1. **Nested for loop** - Simple 2x2 matrix (i, j pattern)
2. **Closure capture bug (var)** - setTimeout in loop with var
3. **Closure capture fix (let)** - Same example with let
4. **do-while** - Body-first execution pattern

### Loop Step Phases
Each loop iteration should show these phases explicitly:
- `init` - Variable initialization (first iteration only)
- `condition` - Condition check
- `body` - Loop body execution
- `update` - Variable update (for traditional for loop)
- `done` - Loop completion

This gives users a clear mental model of loop execution mechanics.
