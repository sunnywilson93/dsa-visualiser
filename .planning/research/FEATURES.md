# Feature Landscape: Educational Code Step-Through Visualizations

**Domain:** Interactive code execution visualization for JavaScript learning
**Researched:** 2026-01-24
**Overall Confidence:** HIGH (based on analysis of Python Tutor, JS Visualizer 9000, Loupe, ui.dev JavaScript Visualizer, CS50 debugging tools, and academic research on program visualization effectiveness)

---

## Executive Summary

Educational code visualizations help learners build accurate mental models of program execution. Research shows that well-designed visualizations with features like variable tracking, line highlighting, and step controls significantly improve learning outcomes (82.69% vs 51.41% in one study). The key differentiator is not just *showing* state, but *explaining* state transitions in sync with code execution.

**Your existing EventLoopViz is already at the "gold standard" level.** The gap is that simpler visualizations (VariablesViz, LoopsViz, ArraysBasicsViz) lack the rich step-through pattern.

---

## Table Stakes

Features users expect. Missing = learners struggle to build mental models.

| Feature | Why Expected | Complexity | Current State | Notes |
|---------|--------------|------------|---------------|-------|
| **Code Line Highlighting** | Shows "where we are" in execution | Low | EventLoopViz has it; others partial | Synchronize highlight with step state |
| **Step Forward/Back Controls** | Learners need to pause, review, re-examine | Low | EventLoopViz has it; LoopsViz lacks back | Critical for self-paced learning |
| **Current Step Indicator** | "Step 3/10" orientation prevents getting lost | Low | EventLoopViz has it | Simple badge, high value |
| **Variable State Panel** | Shows current values of variables | Medium | VariablesViz has it statically | Must update per-step, not just per-example |
| **Per-Step Explanation** | Text describing what's happening NOW | Low | EventLoopViz excellent | The "why" behind each state change |
| **Reset/Restart** | Return to beginning without reloading | Low | All have it | Essential for re-watching |
| **Console/Output Panel** | Shows what would print | Low | Most have it | Shows effect of code execution |
| **Multiple Examples** | One example isn't enough for concept mastery | Medium | EventLoopViz has levels + examples | At minimum 2-3 examples per concept |

### Why These Are Table Stakes

From [Python Tutor](https://pythontutor.com/), the most widely-used code visualization tool (20M+ users):
- Step-by-step execution with forward/back
- Line highlighting synchronized with execution
- Variable panel showing current state
- Call stack visualization

From academic research on program visualization effectiveness:
- "Visualizations that displayed pseudocode with steps highlighted as executed, changing variable values and comments resulted in significantly higher post-test scores"
- Learners need to see "qualitatively different representations of the same process" to build mental models

---

## Differentiators

Features that set your platform apart. Not expected, but create "aha moments."

| Feature | Value Proposition | Complexity | Priority | Notes |
|---------|-------------------|------------|----------|-------|
| **Difficulty Levels** | Beginner/Intermediate/Advanced progression | Medium | High | EventLoopViz pattern: same concept, increasing complexity |
| **Key Insight Summary** | One-liner that crystallizes the concept | Low | High | EventLoopViz has this; very high value |
| **Animated State Transitions** | Smooth animations showing changes | Medium | High | Already using Framer Motion; leverage it |
| **Phase/Context Indicators** | "Sync phase" / "Microtask phase" badges | Low | High | Helps learners understand context |
| **Visual Memory Model** | Show heap vs stack, references vs values | High | Medium | Python Tutor's signature feature |
| **Interactive Data Structures** | Click on array element to see operations | Medium | Medium | ArraysBasicsViz has basic version |
| **Execution Speed Control** | Slow/Medium/Fast playback | Low | Medium | Loupe has this; good for different learning paces |
| **Auto-Play with Pause** | Let it run, pause when interesting | Low | Medium | Current LoopsViz auto-runs but can't pause mid-way |
| **Error State Visualization** | Show what happens when code throws | Medium | Medium | VariablesViz hints at this with error message |
| **Scope Visualization** | Visual nesting of scopes/closures | High | Medium | ClosuresViz could benefit from this |
| **Code + Diagram Split View** | See code and visual simultaneously | Low | High | EventLoopViz does this well |

### Differentiator Analysis

**Highest Impact (implement first):**
1. **Difficulty Levels** - EventLoopViz pattern is proven. Apply to other concepts.
2. **Key Insight Summary** - Low effort, high retention impact.
3. **Code + Diagram Split** - Already works; ensure all visualizations use it.

**Medium Impact (implement second):**
4. **Animated State Transitions** - You have Framer Motion; animate variable value changes.
5. **Phase/Context Indicators** - Visual badges showing "what kind of thing is happening."

**Nice to Have (future):**
6. **Visual Memory Model** - Complex but powerful for references/values distinction.
7. **Scope Visualization** - Nested boxes showing scope hierarchy.

---

## Anti-Features

Features to deliberately NOT build. Common mistakes in educational visualization.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Free-Form Code Input** | Arbitrary code breaks curated examples; edge cases create confusion | Use curated examples with known execution paths |
| **Real-Time Interpretation** | Performance issues, security concerns, unpredictable output | Pre-compute step data; store as static data |
| **Complex Syntax Highlighting** | Distracts from execution understanding | Simple monochrome with line highlight only |
| **Too Many Simultaneous Panels** | Cognitive overload | Max 3-4 visible panels; progressive disclosure |
| **Auto-Advance Without User Control** | Learners can't keep up; miss key moments | Always require explicit step-forward action |
| **Overwhelming Initial State** | All code visible at once is intimidating | Start simple; reveal complexity through steps |
| **Sound Effects/Excessive Animation** | Distracting, accessibility issues | Subtle transitions only; respect reduced-motion |
| **Live Collaboration** | Scope creep; complex state sync | Focus on individual learning path first |
| **Gamification (points, badges)** | Shifts focus from understanding to achievements | Learning is intrinsic reward |
| **Mobile-First Layout** | Visualizations need horizontal space | Desktop-first; responsive collapse for mobile |

### Why These Are Anti-Features

**Free-Form Code Input:**
- Python Tutor allows this but handles it server-side with sandboxing
- Your interpreter already exists but maintenance burden for arbitrary code is high
- Curated examples ensure consistent learning progression

**Auto-Advance:**
- Research shows learners need control over pace
- "What just happened?" is the most common question when advancing too fast
- Let learners control timing; they'll learn faster

**Too Many Panels:**
- EventLoopViz has 5+ panels but they're well-organized
- Cognitive load research: 3-4 items is working memory limit
- Use progressive disclosure: show more detail as learner advances

---

## Feature Dependencies

```
Step Controls (base)
    |
    +-- Code Line Highlighting (requires: step state)
    |
    +-- Variable State Panel (requires: step state)
    |
    +-- Per-Step Explanation (requires: step state)
    |
    +-- Console Output (requires: step state)

Multiple Examples (independent)
    |
    +-- Difficulty Levels (requires: example grouping)
    |
    +-- Key Insight per Example (requires: example structure)

Animation System (base - Framer Motion)
    |
    +-- Animated State Transitions
    |
    +-- Smooth Panel Updates
```

### Critical Path

1. **Step State Model** - Define step data structure (already exists in EventLoopViz)
2. **Step Controls** - Forward/Back/Reset buttons
3. **Line Highlighting** - Connect step.codeLine to code display
4. **Variable Panel** - Show step.variables state
5. **Explanation** - Show step.description
6. **Multiple Examples** - Add example selector
7. **Difficulty Levels** - Group examples by level

---

## MVP Recommendation

For each visualization upgrade, prioritize in this order:

### Must Have (MVP)

1. **Step-through controls** (Prev/Next/Reset)
2. **Code line highlighting** synchronized with step
3. **Step indicator** ("Step 3/10")
4. **Per-step explanation** text
5. **At least 3 examples** per concept

### Should Have (V1)

6. **Difficulty levels** (beginner/intermediate/advanced)
7. **Key insight summary** per example
8. **Animated state transitions** for variable changes
9. **Output/Console panel** showing execution results

### Nice to Have (V2)

10. **Keyboard navigation** (arrow keys for step control)
11. **Auto-scroll to highlighted line** (EventLoopViz has this)
12. **Phase indicators** where relevant

---

## Gap Analysis: Current Visualizations

### EventLoopViz (Gold Standard)
- Has all table stakes features
- Has most differentiators
- Use as pattern template

### VariablesViz (Needs Upgrade)
| Feature | Status | Gap |
|---------|--------|-----|
| Step controls | Has | - |
| Line highlighting | Has | - |
| Variable panel | Has | Static, not per-step updated with animations |
| Difficulty levels | Missing | Add beginner/intermediate/advanced |
| Key insight | Missing | Add per-example |

### FunctionsViz (Needs Upgrade)
| Feature | Status | Gap |
|---------|--------|-----|
| Step controls | Has (in call mode) | Syntax mode lacks steps |
| Line highlighting | Has | - |
| Call stack visual | Missing | Would strengthen mental model |
| Difficulty levels | Missing | Add levels |

### LoopsViz (Needs Significant Upgrade)
| Feature | Status | Gap |
|---------|--------|-----|
| Step controls | Missing | Only auto-play, no back/pause |
| Line highlighting | Missing | No code stepping |
| Variable panel | Partial | Shows iteration but not variable state |
| Step explanation | Missing | No per-step text |

### ArraysBasicsViz (Needs Upgrade)
| Feature | Status | Gap |
|---------|--------|-----|
| Step controls | Missing | Tab-based, not step-based |
| Line highlighting | Missing | No code execution shown |
| Step explanation | Missing | Method descriptions are static |
| Iteration visualization | Missing | map/filter/reduce should show iteration |

---

## Implementation Complexity Estimates

| Visualization | Current State | Effort to Upgrade | Priority |
|---------------|---------------|-------------------|----------|
| LoopsViz | Auto-play only | Medium (add step state) | High - loops are foundational |
| VariablesViz | Good base | Low (add levels, polish) | High - first concept learners encounter |
| ArraysBasicsViz | Tab-based | Medium (restructure to steps) | Medium |
| FunctionsViz | Two modes | Low-Medium (unify into steps) | Medium |
| ObjectsBasicsViz | Likely similar to Arrays | Medium | Medium |

---

## Sources

### Primary Sources (HIGH Confidence)

- [Python Tutor](https://pythontutor.com/) - 20M+ users, gold standard for code visualization
- [JavaScript Visualizer 9000](https://www.jsv9000.app/) - Event loop specific visualization
- [ui.dev JavaScript Visualizer](https://ui.dev/javascript-visualizer) (now at fireship.dev) - Execution context, hoisting, closures, scopes
- [Loupe by Philip Roberts](http://latentflip.com/loupe/) - Event loop visualization from JSConf talk
- [CS50 Debug50](https://cs50.harvard.edu/ap/2020/assets/pdfs/bugs_and_debugging.pdf) - Harvard's debugging curriculum

### Academic Sources (MEDIUM Confidence)

- "Designing Educationally Effective Algorithm Visualizations" - Auburn University research
- "Exploring the role of visualization and engagement in computer science education" - ACM SIGCSE
- "The impact of using program visualization techniques on learning basic programming concepts at the K-12 level" - Wiley research
- "A Review of Generic Program Visualization Systems for Introductory Programming Education" - ACM Computing Education

### Implementation References (HIGH Confidence)

- Your existing EventLoopViz.tsx - Best-in-class pattern already implemented
- Your existing VariablesViz.tsx, FunctionsViz.tsx - Good foundations to extend
