# Feature Landscape: JS Concept Visualizations

**Domain:** JavaScript educational visualizations for async, OOP/prototypes, and closures
**Researched:** 2026-01-30
**Context:** Adding ~26 new step-through visualizations to existing educational platform

## Existing Platform Features (Already Built)

The platform already provides these capabilities:

| Feature | Implementation | Reuse Potential |
|---------|---------------|-----------------|
| Step-through execution | prev/next/reset controls, step index state | HIGH - pattern established |
| Code highlighting sync | `highlightLines[]` per step | HIGH - use directly |
| Difficulty levels | beginner/intermediate/advanced tabs | HIGH - pattern established |
| Memory visualization | Call stack, heap, variables panels | HIGH - reuse for closures/OOP |
| Animated transitions | framer-motion AnimatePresence | HIGH - consistent UX |
| Queue visualization | Event loop with micro/macro queues | HIGH - extend for async |
| Promise state cards | pending/fulfilled/rejected visual states | HIGH - already built |
| Prototype chain visual | Vertical chain with __proto__ links | HIGH - already built |
| Key insight box | Educational takeaway per example | HIGH - pattern established |

---

## Table Stakes

Features users expect from educational visualizations. Missing = incomplete or confusing product.

### Core Step-Through Mechanics

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Previous/Next navigation** | Standard debugger pattern | LOW | Already exists |
| **Step counter** | Progress awareness | LOW | Already exists |
| **Reset to beginning** | Restart learning flow | LOW | Already exists |
| **Code-to-visual sync** | Must show what code line produces what state | LOW | Already exists |
| **Animation between states** | Static jumps confuse learners | LOW | framer-motion exists |
| **Multiple examples per concept** | One example insufficient to generalize | MED | Pattern exists in ClosuresViz |
| **Difficulty progression** | Match content to learner level | MED | Pattern exists |
| **Auto-scroll to highlighted line** | Prevents "where am I" confusion | LOW | Already exists |

### Async-Specific Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Event loop visualization** | Core async mental model | MED | EventLoopViz exists - extend |
| **Microtask vs macrotask distinction** | Common interview question | MED | Already in EventLoopViz |
| **Promise state transitions** | pending -> fulfilled/rejected flow | LOW | PromisesViz exists |
| **Call stack during async** | Shows JS single-threaded nature | LOW | Already exists |
| **Console output in order** | Shows actual execution sequence | LOW | Already exists |
| **Queue FIFO behavior** | Shows task ordering | LOW | Already visualized |

### Closure-Specific Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Scope chain visualization** | Core closure concept | MED | ClosuresViz exists - extend |
| **[[Scope]] internal property** | Shows how closures "capture" | MED | Already in ClosuresViz |
| **Heap memory for closed-over scopes** | Shows scope survives function return | MED | Already exists |
| **Variable mutation in closure** | Counter pattern understanding | LOW | Already exists |
| **Multiple closure instances** | Each call creates new scope | MED | Already in ClosuresViz |

### OOP/Prototype-Specific Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Prototype chain traversal** | Core lookup algorithm | MED | PrototypesViz exists |
| **__proto__ link arrows** | Visual chain connection | LOW | Already exists |
| **Property found/not found state** | Lookup result visualization | LOW | Already exists |
| **Object.prototype terminus** | Chain always ends here (or null) | LOW | Already exists |
| **Property shadowing demo** | Common interview topic | MED | Already in PrototypesViz |

---

## Differentiators

Features that set the platform apart from competitors like JavaScript Visualizer, PromiViz, JSV9000.

### Learning Experience Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Callback hell pyramid visual** | Show indentation problem spatially | LOW | Draw pyramid shape before flattening |
| **Side-by-side code transformation** | callbacks -> promises -> async/await | MED | AsyncEvolutionViz pattern exists |
| **"What if" scenarios** | Show bugs from common mistakes | MED | e.g., forgetting await, var in loop |
| **Memory leak warning indicators** | Show when closures retain too much | MED | Educational safety net |
| **Interview question mode** | "What logs?" before showing answer | MED | Hide output until reveal |
| **Anti-pattern call-outs** | Explicit "don't do this" sections | LOW | Red warning styling exists |

### Async Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Callback hell pyramid depth meter** | Show nesting level increasing | LOW | Visual urgency |
| **Promise.all racing animation** | Show parallel execution visually | MED | Multiple promise cards moving |
| **Microtask starvation warning** | Show blocked macrotasks dramatically | MED | Flash/pulse warning on queue |
| **await suspension point marker** | Show exactly where function pauses | LOW | Special step marker |
| **"After await continues" flow** | Show code after await continuing first | MED | Critical async/await insight |
| **Callback return value ignored** | Show callbacks don't return to caller | MED | Common misconception |

### Closure Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **let vs var loop comparison** | Most common closure interview Q | MED | Split-screen comparison |
| **Memory leak detector** | Show unreleased closures accumulating | HIGH | Heap growth animation |
| **Module pattern reveal** | Show private state encapsulation | MED | Before/after access demo |
| **Partial application step-through** | Show arguments being "pre-filled" | MED | Functional programming bridge |
| **Factory function vs class comparison** | Closure vs prototype approach | MED | Side-by-side |
| **IIFE scope isolation** | Legacy pattern still in interviews | LOW | Wrap-and-invoke visual |

### OOP/Prototype Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Class desugaring reveal** | Show class is prototype sugar | HIGH | Transform class -> prototype |
| **instanceof chain walk** | Step through instanceof algorithm | MED | Trace prototype chain |
| **super() initialization order** | Show derived constructor flow | MED | Critical ES6 class concept |
| **Prototype pollution attack demo** | Security awareness | MED | Show how __proto__ pollution works |
| **Object.create(null) benefits** | Show "truly empty" object | LOW | Already in PrototypesViz |
| **Constructor function anatomy** | new keyword mechanics | MED | 4-step new process |
| **Static vs instance placement** | Where methods live on prototype | MED | Diagram method placement |

### Interactive Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Speed control (slow/medium/fast)** | Match learner pace | LOW | Already in executionStore |
| **Auto-play mode** | Hands-free visualization | LOW | Already exists |
| **Clickable chain links** | Jump to specific scope/prototype | MED | Direct navigation |
| **Hover tooltips on variables** | Explain value without cluttering | LOW | Standard pattern |
| **Fullscreen mode** | Focus on complex visualizations | LOW | Simple CSS change |

---

## Anti-Features

Features to explicitly NOT build. Would hurt UX, add complexity without value, or misrepresent JS behavior.

### Over-Complexity Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Custom code editor** | Scope creep, not core value | Predefined examples only |
| **Real code execution** | Security risk, unpredictable | Scripted step data |
| **Infinite example editing** | Testing nightmare | Curated, tested examples |
| **Full debugger emulation** | DevTools does this better | Focused concept visualization |
| **All V8 internals** | TMI for learners | Abstract to educational level |
| **Browser comparison mode** | Adds confusion, edge cases | Focus on spec behavior |

### Misleading Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Exact timing simulation** | setTimeout 0 isn't really 0ms | Note "conceptual" timing |
| **Garbage collection animation** | Non-deterministic, varies by engine | Show "eligible for GC" only |
| **Exact memory addresses** | Meaningless to learners | Symbolic references |
| **Stack frame sizes** | Implementation detail | Focus on call order |
| **JIT compilation steps** | V8 specific, irrelevant | Interpretation model only |

### Redundant Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Duplicate event loop viz** | Already exists and is excellent | Extend existing, don't duplicate |
| **Separate promises viz** | Already exists | Add chaining/static method examples |
| **New prototype viz from scratch** | Already comprehensive | Add new examples/lookups |
| **Separate async/await viz** | Can extend EventLoopViz | Add await suspension examples |

### Maintenance Burden Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Animated character/mascot** | Expensive to maintain, can distract | Clean abstract shapes |
| **Voice narration** | Accessibility complexity, localization | Text descriptions |
| **Achievement system** | Gamification scope creep | Simple progress indicator |
| **Social sharing** | Privacy concerns, scope creep | Focus on learning |

---

## Feature Dependencies

```
Existing Features (already built)
        |
        v
+-------+-------+
|               |
v               v
Async           Closure           Prototype
Extensions      Extensions        Extensions
     |              |                  |
     v              v                  v
+----+----+   +-----+-----+    +------+------+
|Callbacks|   |Memory     |    |Class        |
|Callback |   |Leak Demo  |    |Desugaring   |
|Hell Viz |   |           |    |             |
+---------+   +-----------+    +-------------+
     |              |                  |
     v              v                  v
+----+----+   +-----+-----+    +------+------+
|Promise  |   |Loop       |    |instanceof   |
|Chaining |   |Gotcha     |    |Walkthrough  |
|Static   |   |var vs let |    |             |
+---------+   +-----------+    +-------------+
     |              |                  |
     v              v                  v
+----+----+   +-----+-----+    +------+------+
|async/   |   |Module     |    |super()      |
|await    |   |Pattern    |    |Order        |
|Suspend  |   |Reveal     |    |             |
+---------+   +-----------+    +-------------+
     |              |                  |
     v              v                  v
+----+----+   +-----+-----+    +------+------+
|Microtask|   |Partial    |    |Prototype    |
|Queue    |   |Application|    |Pollution    |
|Deep Dive|   |           |    |(Security)   |
+---------+   +-----------+    +-------------+
```

### Build Order Recommendation

**Phase 1: Extend Existing** (leverage existing components)
- Callback hell visualization (uses existing event loop viz)
- Promise chaining examples (uses existing promise viz)
- Loop closure gotcha (uses existing closure viz)
- More prototype lookups (uses existing prototype viz)

**Phase 2: New Core Patterns**
- async/await suspension points (new step type in event loop)
- Memory leak closure demo (extend heap visualization)
- Class desugaring (extend prototype viz)
- Module pattern reveal (extend closure viz)

**Phase 3: Advanced/Security**
- Prototype pollution demo
- Microtask starvation deep dive
- Partial application functional
- instanceof algorithm walkthrough

---

## Concept-to-Feature Mapping

Based on the project context listing ~26 concepts, here is how features map:

### Async Concepts (10 concepts)

| Concept | Key Features Needed | Existing Reuse |
|---------|---------------------|----------------|
| Callbacks | Callback execution flow, return-to-caller-ignored | EventLoopViz |
| Callback Hell | Pyramid depth visual, nesting indicator | NEW (simple) |
| Promise Creation | State transitions, executor function | PromisesViz |
| Promise Chaining | Chain step-through, value transformation | PromisesViz |
| Promise Static Methods | all/race/allSettled/any comparison | PromisesViz |
| async/await | Suspension marker, continuation flow | EventLoopViz |
| Microtask Queue | Priority visualization, starvation warning | EventLoopViz |

### OOP/Prototype Concepts (6 concepts)

| Concept | Key Features Needed | Existing Reuse |
|---------|---------------------|----------------|
| Prototype Chain | Chain traversal visualization | PrototypesViz |
| Property Lookup | Found/not-found states, shadowing | PrototypesViz |
| instanceof | Chain walk algorithm step-through | PrototypesViz + NEW |
| Classes | Desugaring reveal, constructor flow | NEW + PrototypesViz |
| Inheritance (extends/super) | Derived constructor order | NEW |
| Prototype Pollution | Security attack demo | NEW |

### Closure Concepts (10 concepts)

| Concept | Key Features Needed | Existing Reuse |
|---------|---------------------|----------------|
| Closure Definition | Scope chain, [[Scope]] capture | ClosuresViz |
| Practical Uses | Counter, private state examples | ClosuresViz |
| Loop Gotchas (var vs let) | Side-by-side comparison | ClosuresViz + NEW |
| Memory Leaks | Heap growth, retained scope warning | NEW |
| Module Pattern | IIFE, private state encapsulation | ClosuresViz + NEW |
| Partial Application | Argument pre-filling step-through | NEW |

---

## MVP Recommendation

For MVP, prioritize:

1. **Callback hell pyramid** - High visual impact, common interview topic
2. **async/await suspension** - Most common modern async pattern
3. **Loop closure var vs let** - #1 closure interview question
4. **Class to prototype desugaring** - Demystifies ES6 classes

Defer to post-MVP:
- Memory leak visualization: Complex, requires heap growth animation
- Partial application: Niche functional programming
- Prototype pollution: Security topic, not core education
- AbortController: Too modern, less interview relevant

---

## Sources

### Promise/Async Visualization Tools
- [PromiViz](https://blog.greenroots.info/introducing-promiviz-visualize-and-learn-javascript-promise-apis) - Promise API visualization
- [Promisees](https://github.com/bevacqua/promisees) - Promise playground
- [Lydia Hallie's JS Visualized](https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke) - Animated promise/async guides
- [JSV9000](https://www.jsv9000.app/) - Event loop visualizer

### Closure Resources
- [Fireship JavaScript Visualizer](https://fireship.dev/javascript-visualizer) - Closure scope visualization
- [MDN Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) - Authoritative reference
- [Jake Archibald on Closures and GC](https://jakearchibald.com/2024/garbage-collection-and-closures/) - Memory leak edge cases

### Prototype Resources
- [jsinheritance visualization](https://github.com/rus0000/jsinheritance) - Prototype chain diagrams
- [Lydia Hallie Prototypal Inheritance](https://dev.to/lydiahallie/javascript-visualized-prototypal-inheritance-47co) - Visual walkthrough
- [MDN Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)

### Event Loop Resources
- [Jake Archibald Tasks/Microtasks](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) - Definitive step-through explanation
- [Artur Basak Event Loop](https://arturbasak.dev/event-loop) - Interactive visualization
- [javascript.info Event Loop](https://javascript.info/event-loop) - Microtask/macrotask explanation

### Memory Management
- [Auth0 Memory Leaks](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/) - Common leak patterns
- [MDN Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) - GC fundamentals

### Callback Hell
- [Callback Hell](https://callbackhell.com/) - Dedicated educational resource
- [DEV Pyramid of Doom](https://dev.to/junihoj/the-perils-of-callback-hell-navigating-the-pyramid-of-doom-in-javascript-alj) - Visual explanation
