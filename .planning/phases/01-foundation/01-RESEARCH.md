# Phase 1: Foundation - Research

**Researched:** 2026-01-24
**Domain:** Reusable React components for step-through visualization UX
**Confidence:** HIGH

## Summary

This research analyzed the existing EventLoopViz.tsx component (the gold standard) to extract patterns for building reusable foundation components. The codebase uses a consistent stack: React 18, TypeScript, Framer Motion 11, CSS Modules, and Lucide React icons.

EventLoopViz demonstrates a mature pattern for step-based visualizations: it manages step state internally, provides code panel with line highlighting, step controls (prev/next/reset), a step badge showing "Step X/Y", and animated transitions between steps. The visualization components across the codebase (LoopsViz, VariablesViz, FunctionsViz, ArraysBasicsViz, ObjectsBasicsViz) each re-implement these patterns with slight variations - confirming the need for shared foundation components.

**Primary recommendation:** Extract the code panel, step controls, progress indicator, and auto-play logic from EventLoopViz into reusable components, using generic TypeScript interfaces that work with any step data shape.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | Component framework | Already in use across codebase |
| TypeScript | ~5.5.0 | Type safety | Project-wide TypeScript |
| framer-motion | ^11.0.0 | Animations | Used in all existing Viz components |
| CSS Modules | (native) | Scoped styling | `.module.css` pattern throughout |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.400.0 | Icons | Step control buttons (play/pause/prev/next) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Modules | Tailwind | CSS Modules already established in project |
| framer-motion | CSS animations | framer-motion provides AnimatePresence, layout animations |

**Installation:**
No new packages needed - all dependencies already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/components/
├── SharedViz/                    # New shared components
│   ├── CodePanel.tsx             # FOUND-01: Code display with line highlighting
│   ├── CodePanel.module.css
│   ├── StepControls.tsx          # FOUND-02: Prev/Next/Reset buttons
│   ├── StepControls.module.css
│   ├── StepProgress.tsx          # FOUND-03: "Step X/Y" indicator
│   ├── StepProgress.module.css
│   ├── useAutoPlay.ts            # FOUND-04: Auto-play hook with speed control
│   └── index.ts                  # Barrel export
└── Concepts/
    └── EventLoopViz.tsx          # Gold standard to match
```

### Pattern 1: Generic Step Interface
**What:** Define a minimal interface that all step types must implement, while allowing visualization-specific extensions.
**When to use:** All shared components accept steps matching this base interface.
**Example:**
```typescript
// Source: Extracted from EventLoopViz.tsx patterns
interface BaseStep {
  codeLine: number        // -1 means no line highlighted
  description: string     // Step explanation text
}

// Visualizations extend this:
interface EventLoopStep extends BaseStep {
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  phase: 'sync' | 'micro' | 'macro' | 'idle'
}

interface VariableStep extends BaseStep {
  variables: Variable[]
  output: string[]
  error?: string
}
```

### Pattern 2: Controlled vs Uncontrolled Mode
**What:** Components support both controlled (parent manages state) and uncontrolled (internal state) modes.
**When to use:** StepControls needs to work in visualizations that manage their own step state.
**Example:**
```typescript
// Source: Common React pattern
interface StepControlsProps {
  // Uncontrolled mode
  totalSteps: number
  defaultStep?: number
  onStepChange?: (step: number) => void

  // Controlled mode
  currentStep?: number
  setCurrentStep?: (step: number) => void
}
```

### Pattern 3: EventLoopViz CSS Variable System
**What:** Uses CSS custom properties for theming consistency.
**When to use:** All shared components should use same variables for matching look.
**Example:**
```css
/* Source: EventLoopViz.module.css */
/* Surface colors */
--js-viz-surface: rgba(26, 26, 46, 1);      /* Dark surface */
--js-viz-surface-2: rgba(26, 26, 46, 0.8);  /* Slightly transparent */
--js-viz-border: rgba(255, 255, 255, 0.1);  /* Subtle border */
--js-viz-text: #e5e7eb;                      /* Primary text */
--js-viz-muted: #888;                        /* Secondary text */
--js-viz-radius: var(--radius-lg);           /* 8px */

/* Pill/badge styling */
--js-viz-pill-bg: rgba(102, 126, 234, 0.1);
--js-viz-pill-border: rgba(102, 126, 234, 0.3);

/* Code highlight color - brand accent blue/purple */
.activeLine {
  background: rgba(102, 126, 234, 0.2);
}

.activeLine .lineCode {
  color: #a5b4fc;
}
```

### Pattern 4: Composition over Configuration
**What:** Components compose together rather than one mega-component with many props.
**When to use:** Each component has single responsibility.
**Example:**
```typescript
// Source: EventLoopViz.tsx structure
// Good: Compose components
<VizContainer>
  <CodePanel code={code} highlightedLine={step.codeLine} />
  <StepDescription step={step} totalSteps={steps.length} currentStep={stepIndex} />
  <StepControls
    onPrev={handlePrev}
    onNext={handleNext}
    onReset={handleReset}
    canPrev={stepIndex > 0}
    canNext={stepIndex < steps.length - 1}
  />
</VizContainer>

// Bad: One giant component
<Visualization
  code={code}
  steps={steps}
  showControls
  showDescription
  showProgress
  // ... many more props
/>
```

### Anti-Patterns to Avoid
- **Hardcoded colors:** Use CSS variables from index.css (--bg-page-secondary, --gray-*, etc.)
- **Inline styles for layout:** Use CSS Modules for all styling
- **Passing full step object to CodePanel:** Only pass what CodePanel needs (code lines, highlighted line index)
- **Tight coupling to step shape:** Generic components should not know about callStack, microQueue, etc.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation on step change | Manual CSS transitions | framer-motion AnimatePresence | Handles enter/exit animations, layout shifts |
| Auto-scroll to line | Custom scroll logic | `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` | Browser native, performant |
| Icon buttons | Custom SVG | lucide-react icons | Consistent with project, accessible |
| Timer cleanup | setInterval only | useEffect cleanup | Memory leaks without cleanup |

**Key insight:** EventLoopViz already solves these problems correctly. Extract patterns, don't reinvent.

## Common Pitfalls

### Pitfall 1: Stale Closure in Auto-play
**What goes wrong:** Auto-play interval references stale step state, causing skips or loops.
**Why it happens:** setInterval callback closes over initial state value.
**How to avoid:** Use useRef for current step, or use functional setState: `setStep(s => s + 1)`.
**Warning signs:** Steps skip unexpectedly, or loop restarts from wrong position.

### Pitfall 2: Prop Drilling Step State
**What goes wrong:** Parent component manages step state but needs to pass it through many layers.
**Why it happens:** Shared components need access to step state for coordination.
**How to avoid:** Design components to accept callbacks (onNext, onPrev) rather than managing state. Let parent own the state.
**Warning signs:** Props being passed through 3+ component levels.

### Pitfall 3: Line Highlight Flash on Fast Navigation
**What goes wrong:** Rapidly clicking next causes visual stuttering.
**Why it happens:** Animation duration conflicts with user input speed.
**How to avoid:** Use `AnimatePresence mode="wait"` for description changes, instant highlight for code lines.
**Warning signs:** UI feels laggy during fast step-through.

### Pitfall 4: CSS Module Class Conflicts
**What goes wrong:** Shared component styles don't match EventLoopViz styling.
**Why it happens:** Different CSS variable values or specificity issues.
**How to avoid:** Use same CSS variable names as EventLoopViz.module.css. Define fallbacks in shared component CSS.
**Warning signs:** Colors, spacing, or borders look different between components.

### Pitfall 5: Accessibility Oversight
**What goes wrong:** Keyboard navigation doesn't work, screen readers don't announce step changes.
**Why it happens:** Focus on visual implementation only.
**How to avoid:** Add keyboard shortcuts (arrow keys), aria-live for step announcements, button labels.
**Warning signs:** Can't navigate with keyboard only.

## Code Examples

Verified patterns from existing codebase:

### Code Panel with Line Highlighting
```typescript
// Source: EventLoopViz.tsx lines 1137-1148
<div className={styles.codePanel}>
  <div className={styles.panelHeader}>
    <span className={styles.panelHeaderLeft}>Code</span>
  </div>
  <pre className={styles.code}>
    {code.map((line, i) => (
      <div
        key={i}
        ref={el => { lineRefs.current[i] = el }}
        className={`${styles.codeLine} ${highlightedLine === i ? styles.activeLine : ''}`}
      >
        <span className={styles.lineNum}>{i + 1}</span>
        <span className={styles.lineCode}>{line || ' '}</span>
      </div>
    ))}
  </pre>
</div>
```

### Step Controls
```typescript
// Source: EventLoopViz.tsx lines 1187-1203
<div className={styles.controls}>
  <button
    className={styles.btnSecondary}
    onClick={handlePrev}
    disabled={stepIndex === 0}
  >
    Prev
  </button>
  <motion.button
    className={styles.btnPrimary}
    onClick={handleNext}
    disabled={stepIndex >= steps.length - 1}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {stepIndex >= steps.length - 1 ? 'Done' : 'Next'}
  </motion.button>
  <button className={styles.btnSecondary} onClick={handleReset}>
    Reset
  </button>
</div>
```

### Step Badge/Progress Indicator
```typescript
// Source: EventLoopViz.tsx lines 1173-1184
<AnimatePresence mode="wait">
  <motion.div
    key={`${exampleIndex}-${stepIndex}`}
    className={styles.description}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
  >
    <span className={styles.stepBadge}>
      Step {stepIndex + 1}/{steps.length}
    </span>
    {step.description}
  </motion.div>
</AnimatePresence>
```

### Auto-scroll to Highlighted Line
```typescript
// Source: EventLoopViz.tsx lines 936-944
useEffect(() => {
  const highlightedLine = currentStep.codeLine
  if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
    lineRefs.current[highlightedLine]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}, [stepIndex, currentStep.codeLine])
```

### Auto-play Hook Pattern
```typescript
// Source: Derived from common React patterns
function useAutoPlay(
  isPlaying: boolean,
  onStep: () => void,
  speed: number = 1000,
  canStep: boolean = true
) {
  useEffect(() => {
    if (!isPlaying || !canStep) return

    const interval = setInterval(onStep, speed)
    return () => clearInterval(interval)
  }, [isPlaying, onStep, speed, canStep])
}
```

### Button Styling (Primary/Secondary)
```css
/* Source: EventLoopViz.module.css */
.btnPrimary {
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
}

.btnPrimary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btnSecondary {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-xs);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--gray-500);
  cursor: pointer;
}

.btnSecondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline event handlers | useCallback with deps | React 18 | Better memoization |
| Class components | Functional + hooks | React 16.8+ | Simpler code, hooks for state |
| CSS-in-JS (styled-components) | CSS Modules | Project convention | Scoped styles, no runtime |

**Deprecated/outdated:**
- None in current stack - project uses modern patterns

## Open Questions

Things that couldn't be fully resolved:

1. **CSS Variable Definitions**
   - What we know: EventLoopViz uses `--js-viz-*` variables that aren't defined in index.css
   - What's unclear: Whether these should be added to index.css or defined locally in shared components
   - Recommendation: Define locally in SharedViz CSS with fallbacks to existing variables

2. **Auto-play Speed Options**
   - What we know: User context says "configurable speed control"
   - What's unclear: Whether to use discrete speeds (slow/medium/fast) or continuous slider
   - Recommendation: Start with 3 discrete speeds (500ms/1000ms/2000ms) - simpler UX, can add slider later

3. **Keyboard Shortcuts**
   - What we know: Common pattern is arrow keys for prev/next
   - What's unclear: Whether shortcuts should be global or require focus
   - Recommendation: Require focus on component - prevents conflicts with page navigation

## Sources

### Primary (HIGH confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/EventLoopViz.tsx` - Gold standard implementation
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/EventLoopViz.module.css` - Complete styling patterns
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/index.css` - Global CSS variables
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/package.json` - Dependency versions

### Secondary (MEDIUM confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/VariablesViz.tsx` - Different step shape example
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/LoopsViz.tsx` - Auto-play animation pattern
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/FunctionsViz.tsx` - Alternate control pattern

### Tertiary (LOW confidence)
- None - all findings from codebase analysis

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Direct from package.json and existing code
- Architecture: HIGH - Patterns extracted from gold standard EventLoopViz
- Pitfalls: MEDIUM - Based on common React patterns and observed code

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable internal patterns)

---

## Component Interface Specifications

### CodePanel Props
```typescript
interface CodePanelProps {
  code: string[]                    // Array of code lines
  highlightedLine?: number          // -1 or undefined = no highlight
  showLineNumbers?: boolean         // Default: true
  maxHeight?: string                // Default: '160px'
  title?: string                    // Default: 'Code'
  rightElement?: React.ReactNode    // Optional badge/indicator in header
}
```

### StepControls Props
```typescript
interface StepControlsProps {
  onPrev: () => void
  onNext: () => void
  onReset: () => void
  canPrev: boolean
  canNext: boolean
  nextLabel?: string                // Default: 'Next' / 'Done' when !canNext
  // Auto-play support
  isPlaying?: boolean
  onPlayPause?: () => void
  showPlayPause?: boolean           // Default: false
}
```

### StepProgress Props
```typescript
interface StepProgressProps {
  current: number                   // 0-indexed
  total: number
  description: string
  animated?: boolean                // Default: true (AnimatePresence)
}
```

### useAutoPlay Hook
```typescript
interface UseAutoPlayOptions {
  speed?: number                    // Milliseconds, default 1000
  onEnd?: () => void               // Called when reaching last step
}

function useAutoPlay(
  totalSteps: number,
  currentStep: number,
  setStep: (step: number) => void,
  options?: UseAutoPlayOptions
): {
  isPlaying: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  speed: number
  setSpeed: (ms: number) => void
}
```
