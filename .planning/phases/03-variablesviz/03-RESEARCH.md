# Phase 3: VariablesViz - Research

**Researched:** 2026-01-24
**Domain:** Variable lifecycle visualization for hoisting, TDZ, and scope chains
**Confidence:** HIGH

## Summary

This research analyzed the existing codebase to understand how to build an enhanced VariablesViz component for Phase 3. The codebase already contains two relevant components: VariablesViz.tsx (basic variable declaration visualization) and HoistingViz.tsx (hoisting with TDZ demonstration). Phase 1 produced SharedViz components (CodePanel, StepProgress, StepControls, useAutoPlay) that provide the foundation. Phase 2 established patterns for LoopsViz including level selectors, example tabs, animated state visualization, and binding visualizations.

The existing VariablesViz is a simple step-through component without difficulty levels or hoisting visualization. HoistingViz already has difficulty levels and TDZ visualization but lacks scope chain visualization or the hoisting animation mentioned in the context decisions. This phase will create a comprehensive VariablesViz that combines and extends these features: animated hoisting (var declarations "floating up"), TDZ step-through, scope chain lookup animation, and block scope vs function scope examples.

**Primary recommendation:** Enhance/rewrite VariablesViz following the LoopsViz pattern (Level -> Example -> Step architecture), incorporating the hoisting animation, TDZ visualization from HoistingViz, and adding scope chain lookup animation with nested scope visualization.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | Component framework | Project standard |
| TypeScript | ~5.5.0 | Type safety | Project-wide TypeScript |
| framer-motion | ^11.0.0 | Animations (hoisting float, scope lookup) | Used in EventLoopViz, LoopsViz, HoistingViz |
| CSS Modules | (native) | Scoped styling | `.module.css` pattern throughout |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.400.0 | Icons | Optional UI indicators |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| framer-motion for hoisting animation | CSS @keyframes | framer-motion provides better control, exit animations, and matches codebase |
| Nested scope boxes | Tree diagram | Nested boxes more intuitive for block scope concept |

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
│   ├── useAutoPlay.ts            # Auto-play hook
│   └── index.ts
└── Concepts/
    ├── LoopsViz.tsx              # Pattern reference
    ├── HoistingViz.tsx           # TDZ visualization reference
    └── VariablesViz.tsx          # REWRITE this file
```

### Pattern 1: Variable Step Interface
**What:** Define step data shape for variable lifecycle visualizations including lifecycle state
**When to use:** VariablesViz step data
**Example:**
```typescript
// Variable lifecycle states
type VariableState =
  | 'not-declared'      // Before code reaches declaration
  | 'hoisted-undefined' // var hoisted with undefined
  | 'hoisted-tdz'       // let/const hoisted in TDZ
  | 'initialized'       // Has actual value
  | 'error'             // Access in TDZ or const reassignment

interface Variable {
  name: string
  keyword: 'var' | 'let' | 'const'
  value: string | undefined
  state: VariableState
  scope: string           // 'global' | 'function:fnName' | 'block:0' etc.
  scopeLevel: number      // Nesting depth (0 = global)
}

interface VariableStep {
  id: number
  codeLine: number
  description: string
  phase: 'creation' | 'execution'     // JS execution phase
  action: 'declare' | 'hoist' | 'access' | 'assign' | 'lookup' | 'error'
  variables: Variable[]
  scopes: Scope[]           // For scope chain visualization
  lookupPath?: string[]     // For scope chain lookup animation
  output: string[]
  error?: string
}

interface Scope {
  id: string              // 'global' | 'function:fnName' | 'block:0'
  type: 'global' | 'function' | 'block'
  name: string            // Display name
  level: number           // Nesting depth
  variables: string[]     // Variable names in this scope
}
```

### Pattern 2: Hoisting Animation Pattern
**What:** Animate var declarations visually "floating" to top of scope during creation phase
**When to use:** When demonstrating hoisting behavior
**Example:**
```typescript
// In step data, include position/animation hints
interface HoistingAnimationStep extends VariableStep {
  hoistingAnimation?: {
    variableName: string
    fromLine: number      // Original declaration line
    toLine: number        // Top of scope (or conceptual "hoisted" position)
  }
}

// In component, use framer-motion to animate
<motion.div
  key={`hoist-${step.hoistingAnimation?.variableName}`}
  initial={{ y: fromY, opacity: 0.5 }}
  animate={{ y: toY, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
>
  var {variableName} = undefined
</motion.div>
```

### Pattern 3: Scope Chain Visualization
**What:** Show nested scopes as visual containers with lookup animation
**When to use:** Scope chain examples, shadowing demonstrations
**Example:**
```typescript
// Nested scope boxes pattern (from context: Claude's discretion)
// Recommendation: Use nested boxes for clarity

<div className={styles.scopeChain}>
  {scopes.map((scope, level) => (
    <motion.div
      key={scope.id}
      className={`${styles.scopeBox} ${styles[`level${level}`]}`}
      style={{ marginLeft: `${level * 20}px` }}
      animate={
        lookupPath?.includes(scope.id)
          ? { borderColor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }
          : {}
      }
    >
      <div className={styles.scopeLabel}>{scope.name}</div>
      <div className={styles.scopeVariables}>
        {scope.variables.map(varName => (
          <VariableBox
            key={varName}
            variable={getVariable(varName)}
            highlighted={lookupPath?.includes(varName)}
          />
        ))}
      </div>
    </motion.div>
  ))}
</div>
```

### Pattern 4: TDZ Error Visualization
**What:** Show TDZ errors by stopping execution and displaying error message
**When to use:** Advanced examples showing TDZ access attempts
**Example:**
```typescript
// From context: Error behavior: Simulate the throw
// Stop execution at that step, show error as if it happened

{currentStep.error && (
  <motion.div
    className={styles.errorPanel}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className={styles.errorIcon}>!</div>
    <div className={styles.errorType}>ReferenceError</div>
    <div className={styles.errorMessage}>
      Cannot access '{variableName}' before initialization
    </div>
    <div className={styles.errorHint}>
      Variable is in Temporal Dead Zone (TDZ)
    </div>
  </motion.div>
)}
```

### Pattern 5: Block vs Function Scope Comparison
**What:** Side-by-side or sequential examples showing var escaping blocks while let/const don't
**When to use:** Block scope examples (requirement VAR-04)
**Example:**
```typescript
// Example data structure for comparison
const blockScopeExamples: VariableExample[] = [
  {
    id: 'var-escapes-block',
    title: 'var escapes block',
    code: [
      'if (true) {',
      '  var x = 1;',
      '}',
      'console.log(x); // 1 (var escapes!)',
    ],
    steps: [/* steps showing x accessible outside block */],
    insight: 'var ignores block scope - it leaks out!',
  },
  {
    id: 'let-block-scoped',
    title: 'let stays in block',
    code: [
      'if (true) {',
      '  let y = 2;',
      '}',
      'console.log(y); // ReferenceError!',
    ],
    steps: [/* steps showing y gone after block */],
    insight: 'let respects block boundaries - safer!',
  },
]
```

### Anti-Patterns to Avoid
- **Not using SharedViz components:** Use CodePanel, StepProgress, StepControls from Phase 1
- **Skipping creation phase:** Always show hoisting happening before execution
- **TDZ without explanation:** When showing TDZ error, explain what TDZ is
- **Complex nested scopes:** Keep examples to 2-3 nesting levels maximum
- **Missing shadowing example:** At least one example should show inner variable hiding outer

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code panel with line highlight | Custom code display | SharedViz CodePanel | Already handles scrollIntoView, line numbers, highlighting |
| Step navigation controls | Custom buttons | SharedViz StepControls | Consistent styling, proven patterns |
| Step progress indicator | Custom badge | SharedViz StepProgress | Animated transitions, consistent look |
| Animation orchestration | Custom timers/RAF | framer-motion AnimatePresence | Handles enter/exit, layout animations |
| Level selector | New component | Copy from LoopsViz/HoistingViz | Pill-style buttons with color coding already implemented |

**Key insight:** LoopsViz and HoistingViz already implement most patterns needed. The main new work is the hoisting animation and scope chain lookup visualization.

## Common Pitfalls

### Pitfall 1: Hoisting Animation Overlapping with Code
**What goes wrong:** Hoisting animation element covers code panel or looks disconnected
**Why it happens:** Not planning animation positioning relative to other elements
**How to avoid:** Use a dedicated "hoisting zone" above code panel, or overlay with proper z-index and timing
**Warning signs:** Animation appears in wrong place or causes layout shifts

### Pitfall 2: TDZ Concept Unclear
**What goes wrong:** User doesn't understand why let/const throw but var doesn't
**Why it happens:** Just showing error without explaining the two-phase execution
**How to avoid:** Explicitly show "Creation Phase" vs "Execution Phase" (like HoistingViz does with phaseBadge)
**Warning signs:** Users confused about difference between undefined and TDZ

### Pitfall 3: Scope Visualization Overcomplicates
**What goes wrong:** Too many nested boxes become hard to read
**Why it happens:** Trying to show every possible scope structure
**How to avoid:** Limit examples to 2-3 scope levels; simpler is better for learning
**Warning signs:** Scope boxes take up most of screen, variable text too small

### Pitfall 4: Scope Lookup Animation Too Fast
**What goes wrong:** User can't see the "searching" animation moving through scopes
**Why it happens:** Animation duration too short, no pause on each scope
**How to avoid:** Use staggered animation (0.3s per scope level), highlight current scope being searched
**Warning signs:** Animation is over before user notices it

### Pitfall 5: Mixing Beginner and Advanced Errors
**What goes wrong:** Beginners encounter TDZ errors in early examples
**Why it happens:** Not following context decision: "Error difficulty placement: Save for advanced"
**How to avoid:** Beginner examples show happy path; advanced examples show errors
**Warning signs:** First examples have red error boxes

### Pitfall 6: Forgetting Reset Cascade
**What goes wrong:** Changing level keeps old example, changing example keeps old step
**Why it happens:** Not implementing cascade reset pattern
**How to avoid:** handleLevelChange resets both exampleIndex and stepIndex; handleExampleChange resets stepIndex
**Warning signs:** UI shows mismatched state after navigation

## Code Examples

Verified patterns from existing codebase:

### Level + Example + Step State (from LoopsViz)
```typescript
// Source: LoopsViz.tsx pattern
type Level = 'beginner' | 'intermediate' | 'advanced'

const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)

const handleLevelChange = (newLevel: Level) => {
  setLevel(newLevel)
  setExampleIndex(0)
  setStepIndex(0)  // Cascade reset
}

const handleExampleChange = (index: number) => {
  setExampleIndex(index)
  setStepIndex(0)  // Cascade reset
}
```

### TDZ Variable Display (from HoistingViz)
```typescript
// Source: HoistingViz.tsx lines 456-462
const getStatusColor = (status: Variable['status']) => {
  switch (status) {
    case 'hoisted': return '#f59e0b'    // Orange - var hoisted
    case 'initialized': return '#10b981' // Green - has value
    case 'tdz': return '#ef4444'         // Red - TDZ danger
  }
}

// Variable display with status badge
<motion.div
  className={styles.variable}
  style={{ borderColor: getStatusColor(v.status) }}
>
  <span className={styles.varName}>{v.name}</span>
  <motion.span
    className={styles.varValue}
    style={{ color: getStatusColor(v.status) }}
  >
    {v.value}
  </motion.span>
  <span className={styles.varStatus} style={{ background: getStatusColor(v.status) }}>
    {v.status === 'tdz' ? 'TDZ' : v.status}
  </span>
</motion.div>
```

### Phase Badge (from HoistingViz)
```typescript
// Source: HoistingViz.tsx - showing Creation vs Execution phase
<div className={styles.panelHeader}>
  <span>Code</span>
  <span
    className={styles.phaseBadge}
    style={{ background: currentStep.phase === 'Creation' ? '#60a5fa' : '#10b981' }}
  >
    {currentStep.phase} Phase
  </span>
</div>
```

### Error Display (from HoistingViz)
```typescript
// Source: HoistingViz.tsx lines 576-583
{currentStep.error && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={styles.errorLine}
  >
    {currentStep.error}
  </motion.div>
)}
```

### Neon Box Styling (from HoistingViz CSS)
```css
/* Source: HoistingViz.module.css - Neon box pattern */
.neonBox {
  position: relative;
  border-radius: var(--radius-xl);
  padding: 3px;
  background: linear-gradient(135deg, var(--neon-start), var(--neon-end));
}

.neonBoxInner {
  background: var(--bg-page-secondary);
  border-radius: var(--radius-lg);
  min-height: 100px;
  padding: var(--space-md);
  padding-top: 1.5rem;
}

/* Color variants for different panels */
.variablesBox {
  --neon-start: #3b82f6;  /* Blue */
  --neon-end: #8b5cf6;    /* Purple */
}

.outputBox {
  --neon-start: #10b981;  /* Green */
  --neon-end: #06b6d4;    /* Cyan */
}
```

### Legend Pattern (from HoistingViz)
```typescript
// Source: HoistingViz.tsx lines 625-638
<div className={styles.legend}>
  <div className={styles.legendItem}>
    <span className={styles.legendDot} style={{ background: '#f59e0b' }} />
    <span>Hoisted (undefined)</span>
  </div>
  <div className={styles.legendItem}>
    <span className={styles.legendDot} style={{ background: '#ef4444' }} />
    <span>TDZ (cannot access)</span>
  </div>
  <div className={styles.legendItem}>
    <span className={styles.legendDot} style={{ background: '#10b981' }} />
    <span>Initialized</span>
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single example set (current VariablesViz) | Difficulty levels with multiple examples (LoopsViz pattern) | Phase 2 | Progressive learning path |
| Static variable display | Animated state transitions | HoistingViz | Better understanding of changes |
| No hoisting animation | Hoisting "float up" animation | This phase | Visual understanding of invisible behavior |
| No scope chain visualization | Animated scope lookup | This phase | Understanding variable resolution |

**Deprecated/outdated:**
- Current VariablesViz.tsx: Basic 3-example component without difficulty levels or hoisting visualization, will be significantly enhanced

## Open Questions

Things that couldn't be fully resolved:

1. **Hoisting Animation Visual Design**
   - What we know: Context says "animate var declarations floating up to top of scope"
   - What's unclear: Whether to animate in-place (within code panel) or in a separate "memory" panel
   - Recommendation: Animate in a "Variable Environment" panel next to code, showing the variable appearing at "hoisted" position before execution

2. **Scope Chain Visual Structure**
   - What we know: Context says "Claude's discretion (nested boxes, columns, etc.)"
   - What's unclear: Best visual representation for nested scopes
   - Recommendation: Use nested boxes with indentation (similar to file tree structure) - most intuitive for block scope concept

3. **Example Organization**
   - What we know: Context says "Claude's discretion (difficulty levels like LoopsViz, or by concept)"
   - What's unclear: Whether to organize by difficulty or by concept (hoisting, TDZ, scope, shadowing)
   - Recommendation: Use difficulty levels (matches LoopsViz pattern, enables beginner happy-path first)

4. **Function Hoisting Inclusion**
   - What we know: Context says "Claude's discretion whether to include function declaration hoisting"
   - What's unclear: Whether function hoisting belongs in this component or stays in HoistingViz
   - Recommendation: Include 1 function hoisting example in advanced level for completeness, but keep focus on var/let/const

5. **const Reassignment Errors**
   - What we know: Context says "Claude's discretion whether to include alongside TDZ"
   - What's unclear: Whether to mix const reassignment with TDZ examples
   - Recommendation: Include as separate example in advanced level - different error type, worth understanding separately

## Sources

### Primary (HIGH confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/LoopsViz.tsx` - Level/Example/Step pattern, binding visualization
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/HoistingViz.tsx` - TDZ visualization, phase badge, variable status colors
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/VariablesViz.tsx` - Current simple implementation to enhance
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/SharedViz/` - Phase 1 foundation components
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/phases/03-variablesviz/03-CONTEXT.md` - User decisions for this phase
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/.planning/phases/02-loopsviz/02-RESEARCH.md` - Phase 2 patterns

### Secondary (MEDIUM confidence)
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/LoopsViz.module.css` - CSS patterns
- `/Users/sunnywilson/Documents/projects/dsa-visualiser-3/src/components/Concepts/HoistingViz.module.css` - Neon box styling

### Tertiary (LOW confidence)
- None - all findings from codebase analysis

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Direct from package.json and existing code
- Architecture: HIGH - Patterns extracted from LoopsViz, HoistingViz
- Pitfalls: HIGH - Based on context decisions and observed patterns
- Hoisting animation: MEDIUM - New feature, design based on context decisions and framer-motion capabilities

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable internal patterns)

---

## Example Coverage Plan

Based on context decisions and requirements (VAR-01 through VAR-04):

### Beginner Level (~3-4 examples) - Happy Path
1. **var declaration** - Basic var with hoisting animation showing undefined before assignment
2. **let declaration** - let with value, show it exists in scope
3. **const declaration** - const with object, show binding vs value mutation
4. **Basic block scope** - Simple if block with let, show variable disappearing after block

### Intermediate Level (~3-4 examples) - Comparisons
1. **var vs let hoisting** - Side-by-side showing undefined vs TDZ (no error yet, just showing state)
2. **Function scope vs block scope** - var escapes if block, let doesn't
3. **Scope chain lookup** - Nested scope accessing outer variable, animate the "search"
4. **Variable shadowing** - Inner scope hides outer variable, show both existing

### Advanced Level (~3-4 examples) - Errors and Edge Cases
1. **TDZ error** - Accessing let before initialization, show ReferenceError
2. **const reassignment error** - Trying to reassign const, show TypeError
3. **var redeclaration** - Multiple var declarations, show no error (vs let would error)
4. **Function hoisting** - (Optional) Function declaration fully hoisted vs function expression

### Variable States for Visualization
| State | Color | Badge Text | Description |
|-------|-------|------------|-------------|
| not-declared | Gray | — | Before declaration reached |
| hoisted-undefined | Orange (#f59e0b) | hoisted | var during creation phase |
| hoisted-tdz | Red (#ef4444) | TDZ | let/const during creation phase |
| initialized | Green (#10b981) | initialized | Has actual value |
| error | Red (#ef4444) | ERROR | Access attempt caused error |

### Scope Chain Phases
Each scope chain example should show:
1. Variable declared in outer scope
2. Inner scope entered, outer variable still accessible
3. Access attempt triggers lookup: animate "searching" from inner → outer
4. Variable found, value retrieved
5. (For shadowing) Inner variable hides outer, show both but only inner accessed
