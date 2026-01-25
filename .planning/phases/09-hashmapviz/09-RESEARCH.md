# Phase 9: HashMapViz - Research

**Researched:** 2026-01-25
**Domain:** React visualization component with step-through animation, bucket-based hash map visualization
**Confidence:** HIGH

## Summary

Phase 9 builds HashMapViz following the established v1.0 visualization pattern and directly modeling after the recently completed TwoPointersViz (Phase 8). The codebase has mature patterns for step-through visualizations that serve as the template.

The HashMapViz introduces unique visualization requirements compared to array-based visualizers:
1. **Bucket grid layout** showing 8-10 indexed buckets with expandable entries
2. **Hash function visualization** showing step-by-step calculation (sum of char codes % bucket count)
3. **Animated lookup path** tracing key -> hash -> bucket -> value flow
4. **Frequency counter animations** with number increment + entry flash

The primary research focus confirms existing patterns apply cleanly, with bucket visualization being the main novel element requiring new CSS patterns.

**Primary recommendation:** Follow TwoPointersViz structure exactly. The bucket visualization is a straightforward grid layout with CSS; no new libraries needed. The animated path can use framer-motion's existing capabilities.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component framework | Project standard |
| framer-motion | 10.x+ | Animation | Already used in all v1.0 visualizations |
| CSS Modules | N/A | Scoped styling | Project standard (*.module.css) |

### Supporting

| Library | Purpose | When to Use |
|---------|---------|-------------|
| SharedViz (internal) | CodePanel, StepControls, StepProgress, useAutoPlay | Step-through UI integration |
| lucide-react | Icons | UI elements if needed (already in project) |

### Alternatives Considered

None - the project has established patterns that must be followed for consistency.

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Component Structure

```
src/components/DSAPatterns/
├── HashMapViz/
│   ├── HashMapViz.tsx          # Main component
│   ├── HashMapViz.module.css   # Styles including bucket grid
│   └── index.ts                # Barrel export
└── index.ts                    # Updated barrel export
```

### Pattern 1: Step-Through Visualization (v1.0 Pattern)

**What:** Component manages step state, renders visualization based on current step data
**When to use:** All DSA pattern visualizations
**Example:**
```typescript
// Source: src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.tsx pattern
type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'complement-lookup' | 'frequency-counter' | 'index-storage'
type Phase = 'read-key' | 'calculate-hash' | 'access-bucket' | 'return-value' | 'done'

interface HashMapStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  currentKey?: string | number
  currentValue?: number | string
  hashCalculation?: {
    key: string
    charCodes: number[]      // For educational display
    sum: number
    bucketCount: number
    result: number           // Final bucket index
  }
  buckets: Bucket[]          // Current state of all buckets
  highlightedBucket?: number // Which bucket is being accessed
  highlightedEntry?: string  // Which key in the bucket is highlighted
  decision?: {
    condition: string        // "Is key in map?"
    conditionMet: boolean    // true/false
    action: string           // "Insert new entry"
  }
  input?: (number | string)[] // Input array being processed
  currentInputIndex?: number  // Which element we're processing
  output?: string[]
}

interface Bucket {
  index: number
  entries: BucketEntry[]
}

interface BucketEntry {
  key: string | number
  value: number | string
  originalIndex?: number     // For index-tracking problems like Two Sum
  isNew?: boolean            // Just inserted (for animation)
  isHighlighted?: boolean    // Being accessed
}

interface HashMapExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: HashMapStep[]
  insight: string
}

const examples: Record<Variant, Record<Level, HashMapExample[]>> = { ... }
```

### Pattern 2: Variant Tab Structure (Match TwoPointersViz)

**What:** Tabs at top for variants, difficulty tabs below, example selector within
**When to use:** This phase per CONTEXT.md decisions
**Example:**
```typescript
// Match TwoPointersViz pattern exactly
const variantInfo: Record<Variant, { label: string; description: string }> = {
  'complement-lookup': {
    label: 'Complement Lookup',
    description: 'Store complement values to find pairs in single pass'
  },
  'frequency-counter': {
    label: 'Frequency Counter',
    description: 'Count occurrences of each element'
  },
  'index-storage': {
    label: 'Index Storage',
    description: 'Store indices of elements for later reference'
  }
}

const [variant, setVariant] = useState<Variant>('complement-lookup')
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)
```

### Pattern 3: Bucket Grid Layout

**What:** CSS Grid displaying buckets with expandable entry lists
**When to use:** Main visualization area
**Example:**
```typescript
// Bucket grid with indices
<div className={styles.bucketGrid}>
  {buckets.map((bucket, index) => (
    <div
      key={index}
      className={cn(
        styles.bucket,
        step.highlightedBucket === index && styles.activeBucket
      )}
    >
      <span className={styles.bucketIndex}>{index}</span>
      <div className={styles.bucketEntries}>
        {bucket.entries.length === 0 ? (
          <span className={styles.emptyBucket}>empty</span>
        ) : (
          bucket.entries.map(entry => (
            <motion.div
              key={entry.key}
              className={cn(
                styles.entry,
                entry.isHighlighted && styles.activeEntry,
                entry.isNew && styles.newEntry
              )}
              initial={entry.isNew ? { scale: 0.8, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className={styles.entryKey}>{entry.key}</span>
              <span className={styles.entryValue}>{entry.value}</span>
              {entry.originalIndex !== undefined && (
                <span className={styles.entryIndex}>@{entry.originalIndex}</span>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  ))}
</div>
```

### Pattern 4: Hash Calculation Display

**What:** Step-by-step breakdown of hash function for educational value
**When to use:** During calculate-hash phase
**Example:**
```typescript
// Per CONTEXT.md: Show calculation inline with animation
{step.hashCalculation && (
  <motion.div
    className={styles.hashCalculation}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <span className={styles.hashKey}>"{step.hashCalculation.key}"</span>
    <span className={styles.hashArrow}>→</span>
    {/* Full breakdown for short keys */}
    {step.hashCalculation.charCodes.length <= 5 ? (
      <span className={styles.hashFormula}>
        ({step.hashCalculation.charCodes.join(' + ')}) % {step.hashCalculation.bucketCount}
      </span>
    ) : (
      <span className={styles.hashFormula}>
        {step.hashCalculation.sum} % {step.hashCalculation.bucketCount}
      </span>
    )}
    <span className={styles.hashArrow}>→</span>
    <span className={styles.hashResult}>bucket[{step.hashCalculation.result}]</span>
  </motion.div>
)}
```

### Pattern 5: Animated Lookup/Insert Path

**What:** Visual trace showing key -> hash -> bucket -> value flow
**When to use:** During operation steps (per CONTEXT.md decision)
**Example:**
```typescript
// Path indicator using CSS arrows or SVG line
// The hash calculation panel appears inline during the animation
// Combined with bucket glow effect for destination

<div className={styles.operationPath}>
  <motion.div
    className={styles.pathStep}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0 }}
  >
    Key: "{currentKey}"
  </motion.div>
  <motion.span className={styles.pathArrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>→</motion.span>
  <motion.div className={styles.pathStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
    Hash: bucket[{hashResult}]
  </motion.div>
  <motion.span className={styles.pathArrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>→</motion.span>
  <motion.div className={styles.pathStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
    Value: {value}
  </motion.div>
</div>
```

### Anti-Patterns to Avoid

- **Storing step data in separate data file:** Keep steps inside component (v1.0 pattern)
- **Auto-play by default:** User must actively step through
- **Over-abstracting:** Don't create generic "DSAViz" base - each viz is self-contained
- **Showing collision handling:** Per CONTEXT.md, simplified - no collisions in visualization
- **Real hash function:** Use educational formula (char codes sum % bucket count), not actual JS hashing

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Step controls | Custom buttons | SharedViz/StepControls | Consistent UX |
| Code highlighting | Custom highlighter | SharedViz/CodePanel | Already handles line sync |
| Animation | Manual CSS transitions | framer-motion | Smoother, easier to maintain |
| Step progress | Custom progress | SharedViz/StepProgress | Consistent with other vizs |
| Tab component | Complex tab library | Native HTML + CSS | Simple, accessible (see TwoPointersViz) |
| Auto-play | Custom interval | SharedViz/useAutoPlay | Already tested |

**Key insight:** The v1.0 visualizations and TwoPointersViz already solved the step-through UX. Focus on the Hash Map-specific visualization logic (buckets, hash display).

## Common Pitfalls

### Pitfall 1: Hash calculation display overload

**What goes wrong:** Long keys produce verbose char code displays that overwhelm the UI
**Why it happens:** Showing every character code for strings like "anagram"
**How to avoid:** Per CONTEXT.md: full breakdown for keys under 5 chars, abbreviated for longer
**Warning signs:** Hash calculation taking up more screen space than the bucket visualization

### Pitfall 2: Bucket overflow display

**What goes wrong:** Bucket with many entries makes the grid layout break
**Why it happens:** Real hash maps can have many entries per bucket
**How to avoid:** Limit examples to max 2-3 entries per bucket, use compact entry display
**Warning signs:** Entries wrapping or grid layout becoming irregular

### Pitfall 3: Animation timing for multi-step operations

**What goes wrong:** Insert animation shows entry appearing before hash calculation completes
**Why it happens:** All state updates at once, animations not sequenced
**How to avoid:** Use the phase field to control what's visible; hash display in calculate-hash phase, bucket highlight in access-bucket phase, entry insert in return-value phase
**Warning signs:** Visual jumps, out-of-order appearance

### Pitfall 4: Frequency counter value update visibility

**What goes wrong:** Count increment not noticeable when value changes from 1 to 2
**Why it happens:** Just changing a number in the UI
**How to avoid:** Per CONTEXT.md: animate number change AND flash the entry; use framer-motion's `initial` trigger on value change
**Warning signs:** Users don't notice the count changed

### Pitfall 5: Variant switching state leak

**What goes wrong:** Switching variant keeps old step index, causes out-of-bounds
**Why it happens:** Step state not reset
**How to avoid:** Reset to step 0 on variant/level/example switch (copy TwoPointersViz pattern)
**Warning signs:** Blank visualization or crash after tab switch

### Pitfall 6: Empty bucket visual clutter

**What goes wrong:** Showing all 8-10 empty buckets creates sparse, confusing display
**Why it happens:** Uniform treatment of all buckets
**How to avoid:** Per Claude's Discretion - recommend showing all buckets but with subtle "empty" indicator; this teaches bucket distribution concept
**Warning signs:** User confusion about which buckets exist vs which have data

## Code Examples

### Bucket Entry with Animation

```typescript
// Based on TwoPointersViz cell pattern
<motion.div
  key={`${entry.key}-${entry.value}`}
  className={cn(
    styles.entry,
    entry.isHighlighted && styles.activeEntry
  )}
  initial={entry.isNew ? { scale: 0.8, opacity: 0 } : false}
  animate={{
    scale: entry.isHighlighted ? 1.05 : 1,
    opacity: 1
  }}
  transition={{ duration: 0.2 }}
>
  <span className={styles.entryKey}>{entry.key}</span>
  <motion.span
    key={entry.value} // Re-animate on value change
    className={styles.entryValue}
    initial={{ scale: 1.3, color: '#10b981' }}
    animate={{ scale: 1, color: 'inherit' }}
    transition={{ duration: 0.3 }}
  >
    {entry.value}
  </motion.span>
</motion.div>
```

### Decision Logic Display (Match TwoPointersViz)

```typescript
// Per CONTEXT.md: Same pattern as TwoPointersViz
{step.decision && (
  <motion.div
    key={`decision-${step.id}`}
    className={styles.decisionPanel}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <span className={styles.decisionQuestion}>{step.decision.condition}</span>
    <span className={cn(
      styles.decisionAnswer,
      step.decision.conditionMet ? styles.conditionTrue : styles.conditionFalse
    )}>
      {step.decision.conditionMet ? 'Yes' : 'No'} → {step.decision.action}
    </span>
  </motion.div>
)}
```

### SharedViz Integration (Match TwoPointersViz)

```typescript
// Source: src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.tsx
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'

// In render:
<div className={styles.mainGrid}>
  <CodePanel
    code={currentExample.code}
    highlightedLine={currentStep.codeLine}
    title="Code"
  />

  <div className={styles.vizPanel}>
    {/* Decision panel */}
    {/* Hash calculation display */}
    {/* Bucket grid */}
    {/* Input array with current element indicator */}
    {/* Output box */}
  </div>
</div>

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

### Input Array with Current Element Indicator

```typescript
// Show the input array being processed (e.g., for Two Sum)
<div className={styles.inputArray}>
  <div className={styles.arrayLabel}>Input</div>
  <div className={styles.arrayCells}>
    {step.input?.map((value, index) => (
      <div
        key={index}
        className={cn(
          styles.inputCell,
          index === step.currentInputIndex && styles.activeInput,
          index < (step.currentInputIndex ?? 0) && styles.processedInput
        )}
      >
        <span className={styles.inputValue}>{value}</span>
        <span className={styles.inputIndex}>{index}</span>
      </div>
    ))}
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-play default | Manual step-through | v1.0 design | Better learning outcomes |
| Generic viz base | Self-contained components | v1.0 architecture | Easier maintenance |
| Abstract hash function | Educational formula display | This phase | Clearer understanding |

**Deprecated/outdated:**
- N/A - following established patterns

## Open Questions

### Claude's Discretion Items (to be decided during implementation)

1. **Empty bucket visibility**
   - Recommendation: Show all buckets with subtle "empty" indicator
   - Rationale: Teaches bucket distribution concept; users see where entries DON'T go

2. **Visual distinction between insert/lookup operations**
   - Recommendation: Use color coding - green for insert, blue for lookup
   - Rationale: Operations have different semantics; visual distinction aids learning

3. **Map size/count indicator**
   - Recommendation: Include a small "size: N" badge
   - Rationale: Frequency counter problems benefit from seeing total unique keys

## Sources

### Primary (HIGH confidence)

- `src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.tsx` - Direct pattern reference
- `src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.module.css` - Styling patterns
- `src/components/SharedViz/` - Reusable components
- `.planning/phases/09-hashmapviz/09-CONTEXT.md` - User decisions
- `.planning/phases/08-twopointerviz/08-RESEARCH.md` - Prior phase research

### Secondary (MEDIUM confidence)

- `src/data/dsaPatterns.ts` - Pattern metadata and variants (hash-map variants defined)
- `src/app/concepts/dsa/patterns/[patternId]/PatternPageClient.tsx` - Integration point

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses only existing project dependencies
- Architecture: HIGH - Follows established v1.0 patterns exactly (TwoPointersViz as template)
- Bucket visualization: HIGH - Standard CSS Grid, no novel patterns needed
- Pitfalls: HIGH - Based on v1.0 development experience and Phase 8

**Research date:** 2026-01-25
**Valid until:** Indefinite (internal patterns, not external dependencies)
