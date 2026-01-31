# Phase 20: OOP/Prototype Visualizations - Research

**Researched:** 2026-01-31
**Domain:** JavaScript Prototype Chain Visualization Components (React/Framer Motion)
**Confidence:** HIGH

## Summary

This research investigates how to build 6 visualization components (OOP-01 through OOP-06) for teaching JavaScript's prototype-based inheritance model. The phase builds directly on the existing PrototypesViz.tsx which already demonstrates vertical chain layout with property lookup animation - a strong foundation to extend.

The codebase has established patterns:
1. PrototypesViz.tsx already shows prototype chain with vertical layout and lookup stepping
2. Three difficulty levels (beginner/intermediate/advanced) with color-coded indicators
3. SharedViz components (CodePanel, StepControls, StepProgress) for consistent UX
4. Framer Motion AnimatePresence for step transitions and scale animations
5. Neon box visual containers with gradient borders

Key user decisions from CONTEXT.md:
- **Vertical stack orientation** - object at top, prototype below, null at bottom (locked)
- **Shadowing must be explicit** - visual indicator for shadowed properties (locked)
- **Both constructor call AND prototype chain** shown for class inheritance (locked)
- **Pollution at intermediate AND advanced** - with prevention techniques as resolution (locked)

**Primary recommendation:** Extend PrototypesViz.tsx patterns for all 6 components, using vertical chain layout consistently. Add class/prototype side-by-side comparison for OOP-04 and OOP-05. Use warning/danger styling for OOP-06 (pollution visualization) with red borders and ripple effects.

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
| Lucide React | latest | Icons | AlertTriangle for pollution warning, Shield for freeze/seal |
| SharedViz | n/a | Shared UI components | CodePanel, StepControls, StepProgress - use for all new Viz |
| Tailwind | 3.x | Utility classes | For inline styling (project standard) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vertical chain layout | Horizontal chain | User decision: vertical matches "looking up" mental model |
| Side-by-side class/prototype | Tab toggle | Side-by-side allows direct comparison (Claude's discretion) |
| Real prototype pollution | Simulated only | Simulated safer for learner environment (Claude's discretion) |

**Installation:**
```bash
# No new dependencies required - all already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/components/Concepts/
├── PrototypeChainBasicsViz.tsx      # OOP-01: Basic chain traversal
├── PropertyLookupViz.tsx            # OOP-02: Step-by-step lookup with shadowing
├── InstanceofViz.tsx                # OOP-03: instanceof chain membership check
├── ClassSyntaxViz.tsx               # OOP-04: ES6 class as syntactic sugar
├── PrototypeInheritanceViz.tsx      # OOP-05: extends keyword and super()
├── PrototypePollutionViz.tsx        # OOP-06: Pollution dangers and prevention
├── PrototypesViz.tsx                # Existing - can reference patterns
└── PrototypesViz.module.css         # Existing - can reference styles
```

### Pattern 1: Vertical Chain Layout (From PrototypesViz - Primary Pattern)
**What:** Vertical stack of prototype nodes with __proto__ arrows between them
**When to use:** ALL 6 new components (user decision)
**Example:**
```typescript
// Source: PrototypesViz.tsx
interface HeapObject {
  id: string
  name: string
  type: 'instance' | 'prototype' | 'null'
  props: { name: string; value: string }[]
  protoRef: string | null
  color: string
}

// Render chain:
<div className="flex flex-col items-center gap-1">
  {heap.map((obj, index) => (
    <div key={obj.id} className="w-full max-w-[280px]">
      <motion.div
        className={`w-full bg-black/30 border-2 rounded-lg overflow-hidden`}
        style={{ borderColor: obj.color }}
      >
        <div className="px-2 py-1 text-2xs font-semibold text-black text-center" style={{ background: obj.color }}>
          {obj.name}
        </div>
        <div className="p-2">
          {obj.props.map(p => (
            <div key={p.name} className="flex justify-between px-1 py-0.5 bg-black/30 rounded font-mono text-2xs">
              <span className="text-gray-500">{p.name}:</span>
              <span className="text-emerald-500">{p.value}</span>
            </div>
          ))}
          {obj.protoRef && (
            <div className="font-mono text-xs text-purple-400 pt-1 border-t border-white/5">
              __proto__: -> {obj.protoRef}
            </div>
          )}
        </div>
      </motion.div>
      {index < heap.length - 1 && (
        <div className="text-center text-xs py-0.5 text-gray-600">
          v __proto__
        </div>
      )}
    </div>
  ))}
</div>
```

### Pattern 2: Property Lookup Step Animation (From PrototypesViz)
**What:** Highlight objects as lookup walks the chain, show "Found!" badge
**When to use:** OOP-01, OOP-02, OOP-03
**Example:**
```typescript
// Source: PrototypesViz.tsx - lookup visualization
interface Lookup {
  prop: string
  label: string
  steps: {
    description: string
    foundAt: string | null       // null = still searching, object id = found, 'NOT_FOUND' = failed
    checkedObjects: string[]     // Objects visited so far
  }[]
}

// Visual treatment:
<motion.div
  className={`border-2 rounded-lg ${
    currentStep?.checkedObjects.includes(obj.id) ? 'bg-white/5' : 'border-white/10'
  } ${currentStep?.foundAt === obj.id ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}`}
  style={{ borderColor: currentStep?.checkedObjects.includes(obj.id) ? obj.color : 'rgba(255,255,255,0.1)' }}
  animate={{ scale: currentStep?.foundAt === obj.id ? 1.02 : 1 }}
>
  {currentStep?.foundAt === obj.id && currentStep.foundAt !== 'NOT_FOUND' && (
    <motion.div
      className="absolute -top-2 right-2 px-1.5 py-0.5 bg-emerald-500 rounded text-xs font-bold text-black"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      Found!
    </motion.div>
  )}
</motion.div>
```

### Pattern 3: Shadowing Indicator (User Requirement)
**What:** Visual indicator showing shadowed property in prototype when own property found
**When to use:** OOP-02 specifically, others when shadowing demonstrated
**Example:**
```typescript
// Source: Claude's discretion based on user requirement
interface Property {
  name: string
  value: string
  shadowed?: boolean  // True when this property is shadowed by child's own property
}

// Visual treatment:
<div
  className={`flex justify-between px-1 py-0.5 rounded font-mono text-2xs ${
    prop.shadowed
      ? 'bg-gray-500/10 line-through text-gray-600'
      : 'bg-black/30'
  }`}
>
  <span className={prop.shadowed ? 'text-gray-600' : 'text-gray-500'}>{prop.name}:</span>
  <span className={prop.shadowed ? 'text-gray-600' : 'text-emerald-500'}>{prop.value}</span>
  {prop.shadowed && (
    <span className="text-xs text-amber-500 ml-1">(shadowed)</span>
  )}
</div>
```

### Pattern 4: Side-by-Side Comparison (For Class/Prototype)
**What:** Two-column view showing class syntax alongside prototype reality
**When to use:** OOP-04 (ClassSyntaxViz), OOP-05 (PrototypeInheritanceViz)
**Example:**
```typescript
// Source: Inspired by AsyncAwaitParallelViz sequential/parallel comparison
interface Step {
  description: string
  classCode: string[]       // ES6 class syntax
  prototypeCode: string[]   // Equivalent prototype setup
  highlightClassLine?: number
  highlightPrototypeLine?: number
  chain: HeapObject[]       // The resulting prototype chain (same either way!)
  output: string[]
  phase: string
}

// Visual layout:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Class Syntax Panel */}
  <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
    <div className="mb-3 text-center text-sm font-semibold text-purple-400">
      ES6 Class Syntax
    </div>
    <CodePanel code={step.classCode} highlightedLine={step.highlightClassLine} />
  </div>

  {/* Prototype Reality Panel */}
  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
    <div className="mb-3 text-center text-sm font-semibold text-amber-400">
      Prototype Reality
    </div>
    <CodePanel code={step.prototypeCode} highlightedLine={step.highlightPrototypeLine} />
  </div>
</div>

{/* Single chain visualization - same for both */}
<div className="mt-4">
  <ChainVisualization chain={step.chain} />
</div>
```

### Pattern 5: instanceof Chain Walk
**What:** Visual traversal showing instanceof checking each prototype in chain
**When to use:** OOP-03 (InstanceofViz)
**Example:**
```typescript
// Source: Inspired by PrototypesViz lookup + instanceof semantics from MDN
interface InstanceofStep {
  description: string
  object: string           // e.g., 'dog'
  constructor: string      // e.g., 'Animal'
  currentlyChecking: string | null  // Prototype being compared
  targetPrototype: string  // Constructor.prototype being searched for
  checkedPrototypes: string[]
  result: boolean | null   // null = still checking, true/false = done
  phase: 'checking' | 'found' | 'not-found'
}

// Visual: Chain nodes with "checking..." badge on current prototype
// Target prototype (Constructor.prototype) shown with distinct highlighting
```

### Pattern 6: Pollution Warning/Danger Styling
**What:** Red warning borders, AlertTriangle icons, ripple effect for affected objects
**When to use:** OOP-06 (PrototypePollutionViz)
**Example:**
```typescript
// Source: Pattern derived from WebSearch findings on educational security visualization
interface PollutionStep {
  description: string
  codeLine: number
  pollutedProperty?: { name: string; value: string }
  affectedObjects: string[]      // Objects inheriting the pollution
  showWarning: boolean
  preventionShown?: 'freeze' | 'seal' | null
  phase: 'normal' | 'polluting' | 'affected' | 'prevention'
}

// Warning badge for pollution:
{step.showWarning && (
  <motion.div
    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <AlertTriangle className="text-red-400" size={20} />
    <span className="text-red-400 font-medium">Prototype Pollution!</span>
  </motion.div>
)}

// Affected object styling - ripple/pulse effect:
<motion.div
  className="border-2 border-red-500/50 bg-red-500/5 rounded-lg"
  animate={{
    boxShadow: step.affectedObjects.includes(obj.id)
      ? ['0 0 0 rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.3)', '0 0 0 rgba(239,68,68,0)']
      : '0 0 0 rgba(239,68,68,0)'
  }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  {/* Polluted property appears with danger indicator */}
  <div className="flex items-center gap-1 px-1 py-0.5 bg-red-500/20 rounded">
    <span className="text-red-400 font-mono text-2xs">{pollutedProp.name}:</span>
    <span className="text-red-300 font-mono text-2xs">{pollutedProp.value}</span>
    <span className="text-xs">(!)</span>
  </div>
</motion.div>

// Prevention resolution - freeze/seal shown positively:
{step.preventionShown && (
  <motion.div
    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Shield className="text-emerald-400" size={20} />
    <span className="text-emerald-400 font-medium">
      {step.preventionShown === 'freeze' ? 'Object.freeze() prevents modification!' : 'Object.seal() prevents new properties!'}
    </span>
  </motion.div>
)}
```

### Anti-Patterns to Avoid
- **Horizontal chain layout:** User decision is vertical - do NOT use horizontal
- **Implicit shadowing:** User requires explicit shadowing indicator - never hide this
- **Class-only view:** Must show prototype reality alongside class syntax
- **Skipping prevention:** Pollution examples MUST end with freeze/seal prevention techniques
- **Over-complicated beginner:** Keep beginner examples to simple 2-3 node chains

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code highlighting | Custom parser | CodePanel from SharedViz | Already handles line refs, scrolling |
| Step navigation | Complex reducer | StepControls from SharedViz | Consistent buttons, keyboard support |
| Step description | Custom component | StepProgress from SharedViz | Animated transitions built-in |
| Chain animations | Manual setTimeout | Framer Motion AnimatePresence | Cancellation, interruption handling |
| Property lookup animation | CSS transitions | Framer Motion scale + opacity | Coordinated enter/exit |
| Prototype chain traversal | Custom DOM walk | Step array with checkedObjects | Data-driven, debuggable |

**Key insight:** PrototypesViz.tsx has already solved vertical chain visualization with lookup animation. Extend these patterns rather than reimplementing.

## Common Pitfalls

### Pitfall 1: Forgetting 'use client' Directive
**What goes wrong:** Component won't render, cryptic Next.js errors
**Why it happens:** All Viz components use hooks, must be client components
**How to avoid:** First line of every new component: `'use client'`
**Warning signs:** "useState is not defined" errors

### Pitfall 2: Confusing __proto__ vs .prototype
**What goes wrong:** Incorrect chain visualization
**Why it happens:** `__proto__` is the internal link, `.prototype` is the property on functions
**How to avoid:** Clearly label: instance.__proto__ === Constructor.prototype
**Warning signs:** Chains that skip levels or show wrong relationships

### Pitfall 3: instanceof Returning Wrong Results
**What goes wrong:** instanceof check shows incorrect boolean
**Why it happens:** instanceof checks if Constructor.prototype is IN the chain, not at a specific position
**How to avoid:** Walk entire chain, check at each level: `Object.getPrototypeOf(o) === Constructor.prototype`
**Warning signs:** `dog instanceof Object` returning false

### Pitfall 4: Class Methods Not on Prototype
**What goes wrong:** Showing methods on instance instead of prototype
**Why it happens:** Class methods go on prototype, instance properties from constructor go on instance
**How to avoid:** Clearly show: `class { method() {} }` puts method on Constructor.prototype
**Warning signs:** Instance visualization showing methods as own properties

### Pitfall 5: Missing null at End of Chain
**What goes wrong:** Chain appears infinite or truncated
**Why it happens:** Forgetting Object.prototype.__proto__ === null
**How to avoid:** Every chain MUST end with null node
**Warning signs:** Chain ending at Object.prototype without null

### Pitfall 6: super() Not Calling Parent Constructor
**What goes wrong:** Inheritance example shows wrong initialization
**Why it happens:** `super()` must be called before using `this` in derived class
**How to avoid:** Show super() step explicitly in OOP-05
**Warning signs:** `this` used before super() call shown

### Pitfall 7: Pollution Example Affecting Real Code
**What goes wrong:** User's browser state corrupted
**Why it happens:** Actually modifying Object.prototype
**How to avoid:** Use SIMULATED pollution - show data representing the pollution without executing it
**Warning signs:** Other visualizations breaking after viewing pollution example

### Pitfall 8: State Reset on Level/Example Change
**What goes wrong:** Step index out of bounds, crashes
**Why it happens:** Forgot to reset stepIndex when changing level/example
**How to avoid:** Always setStepIndex(0) in level/example change handlers
**Warning signs:** Crash when switching examples

## Code Examples

Verified patterns from official sources and existing codebase:

### Prototype Chain Traversal (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
// OOP-01: PrototypeChainBasicsViz

// The chain:
// dog ---> Animal.prototype ---> Object.prototype ---> null

const dog = new Animal('Rex')

// Accessing property walks the chain:
dog.name      // Own property - found on dog
dog.speak()   // Not on dog, found on Animal.prototype
dog.toString()  // Not on dog or Animal.prototype, found on Object.prototype
dog.fly       // Not found anywhere, returns undefined

// Chain representation:
const chain = [
  { id: 'dog', name: 'dog', props: [{ name: 'name', value: '"Rex"' }], protoRef: 'Animal.prototype' },
  { id: 'Animal.prototype', name: 'Animal.prototype', props: [{ name: 'speak', value: 'fn()' }], protoRef: 'Object.prototype' },
  { id: 'Object.prototype', name: 'Object.prototype', props: [{ name: 'toString', value: 'fn()' }], protoRef: 'null' },
  { id: 'null', name: 'null', props: [], protoRef: null }
]
```

### Property Shadowing (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
// OOP-02: PropertyLookupViz

const parent = { value: 2 }
const child = Object.create(parent)

child.value  // 2 (from parent)
child.value = 4  // Creates OWN property on child
child.value  // 4 (own property SHADOWS parent's)

// Parent's value still exists but is unreachable through child:
Object.getPrototypeOf(child).value  // 2

// Visual representation:
const shadowingExample = {
  chain: [
    {
      id: 'child',
      props: [{ name: 'value', value: '4' }],  // Own property
      protoRef: 'parent'
    },
    {
      id: 'parent',
      props: [{ name: 'value', value: '2', shadowed: true }],  // Shadowed!
      protoRef: 'Object.prototype'
    }
  ]
}
```

### instanceof Operator (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
// OOP-03: InstanceofViz

// instanceof checks if Constructor.prototype appears anywhere in the chain
dog instanceof Animal  // true - Animal.prototype IS in dog's chain
dog instanceof Object  // true - Object.prototype IS in dog's chain
dog instanceof Array   // false - Array.prototype is NOT in dog's chain

// How it works internally:
function instanceofCheck(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj)
  const target = Constructor.prototype

  while (proto !== null) {
    if (proto === target) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```

### ES6 Class as Syntactic Sugar (Verified Multiple Sources)
```typescript
// Source: https://prateeksurana.me/blog/how-javascript-classes-work-under-the-hood/
// OOP-04: ClassSyntaxViz

// ES6 Class Syntax:
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    console.log(`${this.name} makes a sound`)
  }
}

// Equivalent Prototype Setup:
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`)
}

// BOTH create the same prototype chain:
const animal = new Animal('Generic')
// animal ---> Animal.prototype ---> Object.prototype ---> null

// Key insight: The class keyword is SYNTACTIC SUGAR
// Under the hood, it creates the same prototype-based inheritance
```

### Class Inheritance with extends (MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
// OOP-05: PrototypeInheritanceViz

class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    console.log(`${this.name} makes a sound`)
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name)  // MUST call super() before using 'this'
    this.isGoodBoy = true
  }
  bark() {
    console.log('Woof!')
  }
}

// Two things happen:
// 1. Dog.prototype.__proto__ === Animal.prototype (prototype chain)
// 2. super(name) calls Animal constructor (initialization)

// Resulting chain:
// new Dog() ---> Dog.prototype ---> Animal.prototype ---> Object.prototype ---> null
```

### Prototype Pollution Attack (Security/MDN Verified)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution
// OOP-06: PrototypePollutionViz

// DANGER: Polluting Object.prototype
Object.prototype.isAdmin = true

// Now ALL objects have isAdmin!
const user = { name: 'Alice' }
user.isAdmin  // true - DANGEROUS!

const config = {}
config.isAdmin  // true - DANGEROUS!

// Real security implications:
function checkAccess(user) {
  if (user.isAdmin) {  // Always true now!
    return 'ACCESS GRANTED'
  }
}

// PREVENTION TECHNIQUES:
// 1. Object.create(null) - no prototype
const safeConfig = Object.create(null)
safeConfig.isAdmin  // undefined (no prototype chain!)

// 2. Object.freeze() - prevents modification
Object.freeze(Object.prototype)
Object.prototype.newProp = 'x'  // Silently fails (or throws in strict mode)

// 3. Object.hasOwn() check
if (Object.hasOwn(user, 'isAdmin') && user.isAdmin) {
  // Only true if isAdmin is user's OWN property
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Object.setPrototypeOf() | Set at creation with class/Object.create | Always preferred | Performance - avoid runtime prototype changes |
| obj.__proto__ | Object.getPrototypeOf(obj) | ES5+ | Standards compliance |
| for...in iteration | Object.keys() + for...of | ES5+ | Avoids inherited properties |
| hasOwnProperty() | Object.hasOwn() | ES2022 | Safer (works on null-prototype objects) |
| Constructor functions | ES6 class syntax | ES2015 | Cleaner syntax, same semantics |

**Deprecated/outdated:**
- `__proto__` accessor: Non-standard, prefer Object.getPrototypeOf/setPrototypeOf
- Monkey patching built-in prototypes: Risky for forward compatibility
- Object.create(Object.prototype) vs class: class is cleaner for inheritance

## Specific Component Templates

### OOP-01: PrototypeChainBasicsViz
**Template:** PrototypesViz.tsx simplified for pure chain visualization
**Key visual elements:**
- Vertical chain: object -> prototype -> Object.prototype -> null
- Property display in each node
- __proto__ arrows between nodes
- Progressive reveal option (show nodes one by one)
**Step structure:**
```typescript
interface Step {
  description: string
  visibleNodes: string[]  // Progressive reveal
  highlightNode?: string
  output: string[]
  phase: 'creation' | 'chain-reveal' | 'complete'
}
```

### OOP-02: PropertyLookupViz
**Template:** PrototypesViz.tsx lookup mechanism
**Key visual elements:**
- Property lookup animation walking the chain
- Shadowing indicator (grayed/crossed property in prototype)
- "Found!" and "Not Found" badges
- Success (green) vs failure (red) final state
**Step structure:**
```typescript
interface Property {
  name: string
  value: string
  shadowed?: boolean
}

interface Step {
  description: string
  searchProperty: string
  currentlyChecking: string | null
  checkedObjects: string[]
  foundAt: string | null  // null = still looking, 'NOT_FOUND' = failed
  shadowedIn?: string  // ID of object where shadowed property exists
  output: string[]
  phase: 'searching' | 'found' | 'not-found'
}
```

### OOP-03: InstanceofViz
**Template:** PrototypesViz.tsx + instanceof semantics
**Key visual elements:**
- Two-part visualization: object chain AND target Constructor.prototype
- Step-by-step chain walk comparing each prototype
- Target prototype highlighted distinctly
- Result: true (green check) or false (red X)
**Step structure:**
```typescript
interface Step {
  description: string
  object: string
  constructor: string
  targetPrototype: string
  currentlyChecking: string | null
  checkedPrototypes: string[]
  result: boolean | null
  phase: 'setup' | 'checking' | 'result'
}
```

### OOP-04: ClassSyntaxViz
**Template:** Side-by-side comparison layout
**Key visual elements:**
- Left: ES6 class code panel
- Right: Equivalent prototype code panel
- Below: Resulting prototype chain (same for both)
- Highlight corresponding lines as steps progress
- "Syntactic Sugar" badge/callout
**Step structure:**
```typescript
interface Step {
  description: string
  classHighlight?: number
  prototypeHighlight?: number
  chain: HeapObject[]
  createdInstances: string[]
  output: string[]
  phase: 'class-definition' | 'equivalent-prototype' | 'instantiation' | 'method-call'
}
```

### OOP-05: PrototypeInheritanceViz
**Template:** Side-by-side + chain + super() flow
**Key visual elements:**
- Class extends syntax panel
- Prototype linking visualization: Child.prototype.__proto__ === Parent.prototype
- super() call flow animation
- Full inheritance chain: instance -> Child.prototype -> Parent.prototype -> Object.prototype -> null
**Step structure:**
```typescript
interface Step {
  description: string
  codeHighlight?: number
  superCallActive?: boolean
  prototypeLink?: { from: string; to: string }
  chain: HeapObject[]
  constructorStack?: string[]  // Shows super() calling parent constructor
  output: string[]
  phase: 'class-definition' | 'prototype-linking' | 'super-call' | 'instance-creation'
}
```

### OOP-06: PrototypePollutionViz
**Template:** Warning-styled prototype chain
**Key visual elements:**
- Normal state -> Pollution happening -> Affected objects -> Prevention
- Red warning badge with AlertTriangle icon
- Ripple effect on affected objects
- Prevention resolution with Shield icon (Object.freeze/seal)
- Object.create(null) as safe alternative shown
**Step structure:**
```typescript
interface Step {
  description: string
  codeHighlight?: number
  pollutedProperty?: { name: string; value: string }
  affectedObjects: string[]
  showWarning: boolean
  showAffectedRipple: boolean
  prevention?: 'freeze' | 'seal' | 'hasOwn' | 'createNull'
  output: string[]
  phase: 'normal' | 'polluting' | 'affected' | 'prevention'
}
```
**Difficulty progression:**
- Intermediate: Simple pollution example, show Object.create(null) prevention
- Advanced: Security implications, multiple prevention techniques

## Open Questions

Things that couldn't be fully resolved:

1. **Static methods visualization**
   - What we know: Class static methods go on Constructor itself, not Constructor.prototype
   - What's unclear: How much detail to show in OOP-04/05
   - Recommendation: Claude's discretion - include if it fits naturally, otherwise defer

2. **Private fields (#) in classes**
   - What we know: Private fields are truly private, not on prototype
   - What's unclear: Whether to include in OOP-04 visualization
   - Recommendation: Keep focus on prototype mechanics, mention private fields in insight text

3. **Symbol properties in prototype chain**
   - What we know: Symbols are valid property keys, inherited through chain
   - What's unclear: Whether to include in any visualization
   - Recommendation: Omit - adds complexity without core educational value

## Sources

### Primary (HIGH confidence)
- MDN Inheritance and Prototype Chain: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
- MDN Prototype Pollution: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution
- MDN instanceof: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
- Existing PrototypesViz.tsx - Vertical chain layout and lookup animation patterns
- Existing PrototypesViz.module.css - Neon box and property styling

### Secondary (MEDIUM confidence)
- How JavaScript Classes Work Under the Hood (prateeksurana.me) - Class/prototype equivalence visualization
- Lydia Hallie's JavaScript Visualized: Prototypal Inheritance (dev.to) - Visual patterns for chain diagrams
- Exploring JavaScript (exploringjs.com) - Class internals documentation

### Tertiary (LOW confidence)
- WebSearch results for visualization patterns - General UI approaches
- React2Shell CVE visualization - Inspiration for security warning styling

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly observed in existing components
- Vertical chain pattern: HIGH - Existing PrototypesViz.tsx provides template
- Property lookup animation: HIGH - Already implemented in PrototypesViz.tsx
- Shadowing visualization: HIGH - User requirement, clear implementation path
- Class/prototype comparison: MEDIUM - Pattern extrapolated from AsyncAwaitParallelViz
- Pollution warning styling: MEDIUM - Pattern derived from security visualization research
- instanceof mechanics: HIGH - Verified against MDN documentation

**Research date:** 2026-01-31
**Valid until:** 60 days (stable JavaScript spec, internal patterns stable)
