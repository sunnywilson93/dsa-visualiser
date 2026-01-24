# Phase 4: FunctionsViz - Research

**Researched:** 2026-01-24
**Domain:** JavaScript function execution visualization (execution contexts, call stack, parameter binding, `this` binding)
**Confidence:** HIGH

## Summary

This phase enhances the existing `FunctionsViz.tsx` component to provide step-through visualization of function execution, building on the established patterns from `LoopsViz` and `VariablesViz`. The research analyzed the existing codebase to identify reusable patterns, SharedViz components, and styling conventions.

The existing FunctionsViz has a basic implementation showing function types (declaration, expression, arrow) with syntax and call steps. The enhancement will transform this into a comprehensive step-through experience covering execution contexts, call stack, parameter binding, and `this` binding - following the same structure as LoopsViz/VariablesViz with level selectors, example tabs, and SharedViz components.

**Primary recommendation:** Follow the established LoopsViz/VariablesViz pattern exactly - use SharedViz components (CodePanel, StepProgress, StepControls), implement data-driven steps with explicit state objects, and use framer-motion for all animations. The call stack visualization should use a vertical layout with push/pop animations similar to the existing CallStack component.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | Component framework | Project standard |
| framer-motion | Latest | Animations (AnimatePresence, motion) | Used in all Viz components |
| CSS Modules | N/A | Component-scoped styling | Project pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| SharedViz/CodePanel | N/A | Code display with line highlighting | All code visualization |
| SharedViz/StepProgress | N/A | Step counter + description display | Step navigation UI |
| SharedViz/StepControls | N/A | Prev/Next/Reset buttons with optional play/pause | Step navigation |
| SharedViz/useAutoPlay | N/A | Auto-advance hook | Optional autoplay feature |
| lucide-react | Latest | Icons (Play, Pause) | If adding autoplay to controls |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom step controls | SharedViz/StepControls | SharedViz ensures consistency, always prefer |
| Manual animation | framer-motion | Project already uses framer-motion everywhere |
| Inline styles | CSS Modules | CSS Modules is project standard |

**Installation:**
No additional packages needed - all dependencies already in project.

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
  FunctionsViz.tsx           # Main component (enhance existing)
  FunctionsViz.module.css    # Component styles (enhance existing)
```

### Pattern 1: Data-Driven Step Visualization
**What:** Steps are defined as data objects with all visual state, components render current step
**When to use:** All step-through visualizations
**Example:**
```typescript
// Source: LoopsViz.tsx, VariablesViz.tsx pattern
interface FunctionStep {
  id: number
  codeLine: number
  description: string
  phase: 'creation' | 'call' | 'execution' | 'return' | 'cleanup'
  action: 'enter' | 'bind-params' | 'execute' | 'return' | 'pop'
  callStack: CallStackFrame[]
  executionContext: ExecutionContextState
  thisBinding?: ThisBindingState
  output: string[]
  parameterBindings?: ParameterBinding[]
}

interface CallStackFrame {
  id: string
  name: string
  params: Record<string, string>
  locals: Record<string, string>
  thisValue: string
  outerRef: string | null
  isActive: boolean
}

interface ExecutionContextState {
  phase: 'creating' | 'active' | 'destroying' | 'destroyed'
  localVariables: { name: string; value: string }[]
  thisBinding: string
  outerReference: string | null
}

interface ParameterBinding {
  argumentName: string
  argumentValue: string
  parameterName: string
  isFlowing: boolean  // for animation
}

interface ThisBindingState {
  value: string
  rule: 'implicit' | 'explicit' | 'new' | 'default' | 'lexical'
  explanation: string
}
```

### Pattern 2: Level + Example + Step Navigation
**What:** Three-tier navigation: difficulty level, example selection, step progression
**When to use:** Complex concept visualizations with multiple examples
**Example:**
```typescript
// Source: LoopsViz.tsx, VariablesViz.tsx pattern
type Level = 'beginner' | 'intermediate' | 'advanced'

const levelInfo: Record<Level, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' }
}

const examples: Record<Level, FunctionExample[]> = {
  beginner: [...],
  intermediate: [...],
  advanced: [...]
}

// State management
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)

const currentExamples = examples[level]
const currentExample = currentExamples[exampleIndex]
const currentStep = currentExample.steps[stepIndex]
```

### Pattern 3: SharedViz Component Usage
**What:** Use SharedViz components for consistent UI
**When to use:** Always for code display, step progress, and controls
**Example:**
```typescript
// Source: LoopsViz.tsx
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

// In render:
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

### Pattern 4: CSS Variable Scoping
**What:** Component-local CSS variables for theming
**When to use:** Each Viz component defines its own accent color
**Example:**
```css
/* Source: LoopsViz.module.css, VariablesViz.module.css pattern */
.container {
  --js-viz-bg: #0d1117;
  --js-viz-border: rgba(255, 255, 255, 0.08);
  --js-viz-accent: #8b5cf6;  /* Purple for functions - distinct from green (loops) and blue (variables) */

  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
```

### Pattern 5: Animated State Transitions with framer-motion
**What:** Use AnimatePresence + motion.div for smooth transitions
**When to use:** Any visual element that changes between steps
**Example:**
```typescript
// Source: VariablesViz.tsx, ClosuresViz.tsx
<AnimatePresence mode="popLayout">
  {currentStep.callStack.map((frame) => (
    <motion.div
      key={frame.id}
      className={styles.stackFrame}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      {/* frame content */}
    </motion.div>
  ))}
</AnimatePresence>
```

### Anti-Patterns to Avoid
- **Inline styles for theming:** Use CSS variables and CSS Modules instead
- **Hardcoded step data in render:** Define all steps as data objects outside render
- **Custom navigation UI:** Use SharedViz components for consistency
- **Imperative animation:** Use framer-motion's declarative API
- **Mixing concerns:** Keep step data, rendering, and state management separate

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom line highlighting | SharedViz/CodePanel | Handles scrolling, line numbers |
| Step navigation | Custom buttons | SharedViz/StepControls | Consistent styling, play/pause support |
| Step counter | Custom badge | SharedViz/StepProgress | Animated transitions built-in |
| Push/pop animations | Manual CSS transitions | framer-motion AnimatePresence | layout animations, exit support |
| Auto-advance | setInterval logic | SharedViz/useAutoPlay | Handles edge cases, cleanup |

**Key insight:** The SharedViz components and framer-motion handle all the tricky edge cases around animations, cleanup, and consistent UX. Custom solutions will have bugs and inconsistencies.

## Common Pitfalls

### Pitfall 1: Stack Direction Confusion
**What goes wrong:** Rendering call stack top-down but conceptually it grows upward
**Why it happens:** Array order vs visual representation mismatch
**How to avoid:** Use `slice().reverse()` for display (newest on top), document the decision
**Warning signs:** Stack frames appear in wrong order, exit animations go wrong direction

### Pitfall 2: Lost Animation Context
**What goes wrong:** Elements flash or jump instead of animating smoothly
**Why it happens:** Key changes unexpectedly, AnimatePresence not wrapping correctly
**How to avoid:** Use stable, unique keys based on frame.id, always wrap animated lists in AnimatePresence
**Warning signs:** Flash of content on step change, no exit animations

### Pitfall 3: State Reset on Level/Example Change
**What goes wrong:** Step index not reset when switching examples, showing invalid step
**Why it happens:** Forgetting to reset stepIndex when level or exampleIndex changes
**How to avoid:** Reset stepIndex to 0 in level/example change handlers
**Warning signs:** Blank content, accessing undefined array index

### Pitfall 4: Missing Null Guards
**What goes wrong:** Component crashes when currentStep is undefined
**Why it happens:** Edge case where step array is empty or index out of bounds
**How to avoid:** Add early return with fallback UI if !currentStep
**Warning signs:** Runtime errors on initial render or edge cases

### Pitfall 5: Inconsistent Accent Colors
**What goes wrong:** Component doesn't visually differentiate from other Viz components
**Why it happens:** Using same colors as LoopsViz (green) or VariablesViz (blue)
**How to avoid:** Use purple (#8b5cf6) as accent color - already established in FunctionsViz.module.css
**Warning signs:** Visual confusion between different concept pages

### Pitfall 6: Parameter Binding Animation Timing
**What goes wrong:** Argument->parameter flow animation doesn't feel natural
**Why it happens:** Animation starts/ends at wrong moment, no staggered timing
**How to avoid:** Use transition.delay for staggered parameter bindings, ensure animation completes before step description updates
**Warning signs:** Choppy or abrupt parameter binding visualization

## Code Examples

Verified patterns from the codebase:

### Call Stack Frame Rendering (from CallStack.tsx)
```typescript
// Source: /src/components/CallStack/CallStack.tsx
function StackFrameCard({ frame, isActive, total }: StackFrameCardProps) {
  const color = getFrameColor(frame.depth)

  return (
    <motion.div
      className={`${styles.frame} ${isActive ? styles.active : ''}`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ '--frame-color': color } as React.CSSProperties}
    >
      <div className={styles.frameHeader}>
        <div className={styles.frameIndicator} />
        <span className={styles.frameName}>{frame.name}</span>
        <span className={styles.frameDepth}>#{frame.depth}</span>
      </div>

      {/* Parameters */}
      {Object.keys(frame.params).length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Parameters</div>
          <div className={styles.variables}>
            {Object.entries(frame.params).map(([name, value]) => (
              <VariableDisplay key={name} name={name} value={value} type="param" />
            ))}
          </div>
        </div>
      )}

      {/* Return Value */}
      {frame.returnValue && (
        <div className={styles.returnSection}>
          <span className={styles.returnLabel}>return</span>
          <span className={styles.returnValue}>{formatValue(frame.returnValue)}</span>
        </div>
      )}
    </motion.div>
  )
}
```

### Execution Context from ClosuresViz
```typescript
// Source: /src/components/Concepts/ClosuresViz.tsx
interface ExecutionContext {
  id: string
  name: string
  variables: { name: string; value: string }[]
  outerRef: string | null
}

// In render:
<AnimatePresence mode="popLayout">
  {currentStep.callStack.slice().reverse().map((ec) => (
    <motion.div
      key={ec.id}
      className={`${styles.executionContext} ${ec.id === 'global' ? styles.globalEc : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <div className={styles.ecHeader}>{ec.name}</div>
      <div className={styles.ecContent}>
        <div className={styles.ecSection}>
          <span className={styles.ecLabel}>Variables:</span>
          {ec.variables.map(v => (
            <div key={v.name} className={styles.ecVar}>
              <span className={styles.ecVarName}>{v.name}</span>
              <span className={styles.ecVarValue}>{v.value}</span>
            </div>
          ))}
        </div>
        {ec.outerRef && (
          <div className={styles.ecSection}>
            <span className={styles.ecLabel}>Outer:</span>
            <span className={styles.ecRef}>{ec.outerRef}</span>
          </div>
        )}
      </div>
    </motion.div>
  ))}
</AnimatePresence>
```

### Scope Type Colors (from VariablesViz.module.css)
```css
/* Source: /src/components/Concepts/VariablesViz.module.css */
.scopeLabel.global {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.scopeLabel.function {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

.scopeLabel.block {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
}
```

### This Binding Visualization Pattern (from ThisKeywordViz.tsx)
```typescript
// Source: /src/components/Concepts/ThisKeywordViz.tsx
interface Step {
  description: string
  thisValue: string
  thisExplanation: string
  highlightLine?: number
}

// In render:
<div className={styles.thisBinding}>
  <div className={styles.thisLabel}>this =</div>
  <AnimatePresence mode="wait">
    <motion.div
      key={`${level}-${exampleIndex}-${stepIndex}-${currentStep.thisValue}`}
      className={styles.thisValue}
      style={{ borderColor: currentExample.color, color: currentExample.color }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {currentStep.thisValue}
    </motion.div>
  </AnimatePresence>
</div>
<div className={styles.thisExplanation}>
  {currentStep.thisExplanation}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom step controls | SharedViz/StepControls | Phase 1 | Consistent controls across all Viz |
| Manual code highlighting | SharedViz/CodePanel | Phase 1 | Auto-scroll, line numbers |
| CSS animations | framer-motion | Project inception | Smoother, declarative animations |
| Single example per concept | Level+Example hierarchy | LoopsViz/VariablesViz | Progressive disclosure |

**Deprecated/outdated:**
- Original FunctionsViz pattern (toggle between Syntax/How Calls Work) - replaced by level/example/step pattern
- Manual step counter - use SharedViz/StepProgress instead

## Open Questions

Things that couldn't be fully resolved:

1. **Stack Layout Direction**
   - What we know: CallStack.tsx uses top-down with newest on top (reversed array)
   - What's unclear: Whether FunctionsViz should match this exactly or use bottom-up for pedagogical clarity
   - Recommendation: Use top-down (newest on top) to match existing CallStack component - learners may switch between practice page and concept page

2. **Execution Context Location**
   - What we know: ClosuresViz shows context as part of call stack, CallStack.tsx shows params/locals inline
   - What's unclear: Whether to embed full context in frames or show as separate panel
   - Recommendation: Embed in frames (like CallStack) for simplicity, with outer reference shown as labeled arrow/text

3. **Parameter Binding Animation Details**
   - What we know: Requirements specify animate arguments "flowing" into parameters
   - What's unclear: Exact animation approach (arrows? lines? motion paths?)
   - Recommendation: Use staggered fade-in with slight x-translation from argument column to parameter column, keep it simple

## Sources

### Primary (HIGH confidence)
- `/src/components/SharedViz/` - CodePanel, StepProgress, StepControls, useAutoPlay APIs
- `/src/components/Concepts/LoopsViz.tsx` - Level/Example/Step pattern, step data structure
- `/src/components/Concepts/VariablesViz.tsx` - Scope visualization, variable state types
- `/src/components/Concepts/ClosuresViz.tsx` - Execution context visualization, heap/stack model
- `/src/components/Concepts/ThisKeywordViz.tsx` - `this` binding visualization patterns
- `/src/components/CallStack/CallStack.tsx` - Stack frame rendering, animation patterns

### Secondary (MEDIUM confidence)
- `/src/types/index.ts` - Existing StackFrame, ScopeChain, ExecutionStep types
- CONTEXT.md decisions - Locked choices for animations, content, lifecycle display

### Tertiary (LOW confidence)
- None - all findings verified against existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, patterns established
- Architecture: HIGH - Direct extrapolation from LoopsViz, VariablesViz, ClosuresViz patterns
- Pitfalls: HIGH - Based on analysis of existing component implementations

**Research date:** 2026-01-24
**Valid until:** 60 days (stable internal patterns, no external dependencies)
