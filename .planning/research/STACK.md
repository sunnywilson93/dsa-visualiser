# Technology Stack: Step-Through Code Visualization

**Project:** DSA Visualizer - Enhanced JS Concept Visualizations
**Researched:** 2026-01-24
**Confidence:** HIGH (existing stack verified + ecosystem research)

## Recommendation Summary

**Continue with the existing stack.** The codebase already has an excellent foundation for step-through visualizations. No new dependencies are needed.

| Category | Recommendation | Rationale |
|----------|---------------|-----------|
| Animation | Framer Motion (existing) | Already in use, 30k+ stars, 120fps GPU-accelerated |
| Code Display | Custom `<pre>` with CSS | Simpler than Monaco for static examples, matches EventLoopViz pattern |
| Code Editor | Monaco (existing) | Already integrated with line decorations, breakpoints |
| State | Zustand (existing) | Perfect for step index, playback state |
| Styling | CSS Modules (existing) | Consistent with codebase patterns |

---

## Detailed Recommendations

### 1. Animation Library

**Use: Framer Motion v11+ (existing `framer-motion` package)**

| Aspect | Details |
|--------|---------|
| Current Version | ^11.0.0 in package.json |
| Purpose | Smooth transitions between execution steps |
| Why Keep | Already powers EventLoopViz, ClosuresViz, VariablesViz perfectly |

**Key Features Already Being Used:**
```typescript
// Step transitions (from EventLoopViz)
<AnimatePresence mode="wait">
  <motion.div
    key={`${level}-${exampleIndex}-${stepIndex}`}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
  >
    {currentStep.description}
  </motion.div>
</AnimatePresence>

// Layout animations for call stack (from ClosuresViz)
<AnimatePresence mode="popLayout">
  {currentStep.callStack.map((item) => (
    <motion.div layout key={item.id}>
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
```

**Why NOT add a new library:**
- Motion provides everything needed: springs, layout animations, AnimatePresence
- Existing visualizations already demonstrate the patterns work well
- Adding react-spring or GSAP would create inconsistency

---

### 2. Code Syntax Display (for visualizations)

**Use: Custom `<pre>` with CSS line highlighting (existing pattern)**

The EventLoopViz pattern is ideal for step-through visualizations:

```typescript
// Pattern from EventLoopViz.tsx - simple and effective
<pre className={styles.code}>
  {currentExample.code.map((line, i) => (
    <div
      key={i}
      ref={el => { lineRefs.current[i] = el }}
      className={`${styles.codeLine} ${currentStep.codeLine === i ? styles.activeLine : ''}`}
    >
      <span className={styles.lineNum}>{i + 1}</span>
      <span className={styles.lineCode}>{line || ' '}</span>
    </div>
  ))}
</pre>
```

**Why NOT use syntax highlighting libraries for visualizations:**

| Library | Why Not |
|---------|---------|
| react-syntax-highlighter | Overkill for curated examples, maintenance issues with Next.js SSG |
| prism-react-renderer | Adds complexity, harder to control line highlighting animation |
| shiki | Server-side focused, bundle size (~695KB-1.2MB), harder to animate |

**Why the custom approach works:**
1. **Full animation control** - Each line is a motion target
2. **Curated examples** - Code is predefined, not user-entered
3. **Visual consistency** - CSS Modules match component styling
4. **No bundle bloat** - Zero additional dependencies
5. **Auto-scroll support** - `scrollIntoView` with refs (already implemented)

---

### 3. Code Editor (for practice pages)

**Keep: @monaco-editor/react (existing)**

| Aspect | Details |
|--------|---------|
| Current Version | ^4.6.0 in package.json |
| Purpose | User code editing on practice pages |
| Line Highlighting | Already implemented via deltaDecorations |

**Existing Implementation (from CodeEditor.tsx):**
```typescript
// Line decoration for current execution step
decorations.push({
  range: new monaco.Range(line, 1, line, 1),
  options: {
    isWholeLine: true,
    className: styles.currentLine,
    glyphMarginClassName: styles.currentLineGlyph,
  },
})

decorationsRef.current = editor.deltaDecorations(
  decorationsRef.current,
  decorations
)
```

**Do NOT use Monaco for concept visualizations:**
- Monaco is ~2MB (heavy for static examples)
- Overkill when code is read-only and curated
- Harder to animate individual lines with Framer Motion

---

### 4. State Management

**Keep: Zustand (existing)**

| Aspect | Details |
|--------|---------|
| Current Version | ^4.5.2 in package.json |
| Purpose | Step index, playback state, execution state |

**Pattern for visualizations (local state preferred):**
```typescript
// From EventLoopViz - local state for isolated visualizations
const [stepIndex, setStepIndex] = useState(0)
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
```

**When to use Zustand vs local state:**
- **Local state:** Isolated visualization components (like EventLoopViz)
- **Zustand:** Shared state across components (like interpreter execution)

---

### 5. Styling

**Keep: CSS Modules (existing pattern)**

Consistent with codebase style: `Component.module.css`

**Key styling patterns for step-through:**
```css
/* Active line highlighting */
.activeLine {
  background: rgba(102, 126, 234, 0.15);
  border-left: 3px solid #667eea;
}

/* Step transitions */
.codeLine {
  transition: background-color 0.2s ease;
}

/* Neon box pattern for state panels */
.neonBox {
  background: #161b22;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
}
```

---

## Alternatives Considered

| Category | Considered | Rejected Because |
|----------|------------|------------------|
| Animation | react-spring | Would create inconsistency, Motion already works |
| Animation | GSAP | License concerns, heavier, Motion sufficient |
| Syntax | react-syntax-highlighter | Maintenance issues, harder to animate lines |
| Syntax | prism-react-renderer | Overkill for static code, adds bundle weight |
| Syntax | shiki | Server-focused, 700KB+ bundle, not needed |
| State | Redux Toolkit | Zustand simpler, already working |
| State | Jotai | No benefit over Zustand for this use case |

---

## What NOT to Add

**Do NOT add these libraries:**

1. **react-syntax-highlighter** - Not actively maintained, SSG issues
2. **shiki/react-shiki** - Overkill bundle size for curated static examples
3. **prism-react-renderer** - Adds complexity without benefit
4. **GSAP** - License concerns, Motion is sufficient
5. **react-spring** - Would create inconsistency with existing Motion usage
6. **pythontutor-style libraries** - Build custom, they don't fit React patterns

---

## Implementation Guidance

### Pattern to Follow (EventLoopViz exemplar)

The EventLoopViz component is the gold standard. New visualizations should follow its pattern:

```typescript
interface Step {
  description: string
  codeLine: number  // or highlightLines: number[]
  // ... concept-specific state
}

interface Example {
  id: string
  title: string
  code: string[]
  steps: Step[]
  insight: string
}

// Component structure
export function ConceptViz() {
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-scroll to highlighted line
  useEffect(() => {
    if (highlightedLine >= 0 && lineRefs.current[highlightedLine]) {
      lineRefs.current[highlightedLine]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [stepIndex, highlightedLine])

  // ... rest follows EventLoopViz pattern
}
```

### Step Controls Pattern

```typescript
const handleNext = () => {
  if (stepIndex < steps.length - 1) setStepIndex(s => s + 1)
}

const handlePrev = () => {
  if (stepIndex > 0) setStepIndex(s => s - 1)
}

const handleReset = () => setStepIndex(0)

// Controls UI
<div className={styles.controls}>
  <button onClick={handlePrev} disabled={stepIndex === 0}>Prev</button>
  <motion.button onClick={handleNext} disabled={stepIndex >= steps.length - 1}>
    {stepIndex >= steps.length - 1 ? 'Done' : 'Next'}
  </motion.button>
  <button onClick={handleReset}>Reset</button>
</div>
```

### Auto-play Pattern (if needed)

```typescript
const [isPlaying, setIsPlaying] = useState(false)

useEffect(() => {
  if (!isPlaying) return

  const timer = setInterval(() => {
    setStepIndex(s => {
      if (s >= steps.length - 1) {
        setIsPlaying(false)
        return s
      }
      return s + 1
    })
  }, 1500) // Adjust timing as needed

  return () => clearInterval(timer)
}, [isPlaying, steps.length])
```

---

## Installation

**No new packages required.** The existing stack is complete.

Current relevant dependencies:
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.2"
  }
}
```

---

## Sources

### HIGH Confidence (verified from codebase)
- Existing EventLoopViz.tsx, ClosuresViz.tsx, VariablesViz.tsx implementations
- Existing CodeEditor.tsx Monaco integration
- Current package.json dependencies

### MEDIUM Confidence (verified from official sources)
- [Motion GitHub](https://github.com/motiondivision/motion) - 30.8k stars, hybrid engine, 120fps
- [Monaco Editor Decorations](https://medium.com/@lyuda.dzyubinska/monaco-editor-decorator-385ba6aa90b8) - deltaDecorations API

### LOW Confidence (WebSearch only - included for completeness)
- [react-syntax-highlighter maintenance issues](https://best-of-web.builder.io/library/react-syntax-highlighter/react-syntax-highlighter)
- [shiki bundle sizes](https://github.com/AVGVSTVS96/react-shiki) - 695KB-1.2MB range
- [prism-react-renderer vs alternatives](https://npm-compare.com/prism-react-renderer,react-highlight,react-syntax-highlighter)

---

## Summary

**The existing stack is optimal.** The codebase has battle-tested patterns for step-through visualizations:

1. **Framer Motion** handles all animation needs (layout, presence, springs)
2. **Custom `<pre>` with CSS** provides full control over line highlighting
3. **Monaco Editor** (for practice pages) already has line decorations working
4. **Zustand** manages state efficiently
5. **CSS Modules** maintains styling consistency

New foundational concept visualizations should copy the EventLoopViz pattern exactly. No new dependencies are needed - focus on content quality and step data structure design.
