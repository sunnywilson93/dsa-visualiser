# Phase 10: BitManipulationViz - Research

**Researched:** 2026-01-25
**Domain:** React bit manipulation visualization with step-through animation
**Confidence:** HIGH

## Summary

Phase 10 builds BitManipulationViz following the established DSAPatterns visualization pattern from Phases 8 (TwoPointersViz) and 9 (HashMapViz). The codebase already has mature patterns for step-through visualizations with SharedViz integration.

The visualization is unique in that it displays binary representations instead of arrays. The project already has a `BitManipulationConcept` component (`src/components/ConceptPanel/BitManipulationConcept.tsx`) that handles binary display with bit highlighting, which provides a proven rendering approach. However, this component is designed for the older `ConceptStep` interface. For BitManipulationViz, we need a standalone pattern visualization component following the TwoPointersViz/HashMapViz pattern with its own step interface and complete SharedViz integration.

**Primary recommendation:** Create BitManipulationViz in `src/components/DSAPatterns/BitManipulationViz/` following the HashMapViz structure exactly, adapting the binary rendering patterns from the existing BitManipulationConcept component.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | Component framework | Project standard |
| framer-motion | ^11.0.0 | Animation | Already used in all DSAPatterns visualizations |
| CSS Modules | N/A | Scoped styling | Project standard (*.module.css) |

### Supporting

| Library | Purpose | When to Use |
|---------|---------|-------------|
| SharedViz (internal) | CodePanel, StepControls, StepProgress | Step-through UI integration |
| lucide-react | Icons | UI elements if needed |

### Alternatives Considered

None - the project has established patterns that must be followed for consistency.

**Installation:**
```bash
# No new packages needed - all dependencies already installed
```

## Architecture Patterns

### Recommended Component Structure

```
src/components/DSAPatterns/
├── BitManipulationViz/
│   ├── BitManipulationViz.tsx          # Main component
│   └── BitManipulationViz.module.css   # Styles
└── index.ts                             # Updated barrel export
```

### Pattern 1: DSAPatterns Visualization Pattern (from TwoPointersViz/HashMapViz)

**What:** Self-contained component with variant tabs, difficulty levels, example selector, and step-through visualization
**When to use:** All DSA pattern visualizations
**Example:**
```typescript
// Source: src/components/DSAPatterns/HashMapViz/HashMapViz.tsx
type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'xor-tricks' | 'bit-masks' | 'shift-operations'
type Phase = 'read-value' | 'show-binary' | 'apply-operation' | 'show-result' | 'done'

interface BitStep {
  id: number
  codeLine: number
  description: string
  phase: Phase
  numbers: BinaryNumber[]          // Numbers being operated on
  operator?: string                // '&' | '|' | '^' | '<<' | '>>'
  result?: number                  // Result of operation
  activeBits?: number[]            // Bit positions to highlight
  bitWidth: 4 | 8 | 16 | 32        // Configurable display width
  decision?: {
    condition: string              // "Is bit 3 set?"
    conditionMet: boolean
    action: string                 // "XOR with mask clears it"
  }
  output?: string[]
}

interface BinaryNumber {
  label: string                    // Variable name or expression
  value: number                    // Decimal value
}

interface BitExample {
  id: string
  title: string
  variant: Variant
  code: string[]
  steps: BitStep[]
  insight: string
}

const examples: Record<Variant, Record<Level, BitExample[]>> = { ... }
```

### Pattern 2: Binary Rendering (from BitManipulationConcept)

**What:** Display numbers as binary with position highlighting
**When to use:** All bit visualization steps
**Example:**
```typescript
// Source: src/components/ConceptPanel/BitManipulationConcept.tsx
function toBinary(num: number, bits: number): string {
  if (num < 0) {
    // Two's complement for negative numbers
    return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
  }
  return num.toString(2).padStart(bits, '0')
}

const renderBitRow = (label: string, value: number, bits: number, activeBits: number[]) => {
  const binaryStr = toBinary(value, bits)
  return (
    <div className={styles.bitRow}>
      <div className={styles.label}>{label}</div>
      <div className={styles.decimal}>{value}</div>
      <div className={styles.bits}>
        {binaryStr.split('').map((bit, i) => {
          const bitPosition = bits - 1 - i
          const isActive = activeBits.includes(bitPosition)
          const isOne = bit === '1'
          return (
            <motion.div
              key={i}
              className={cn(
                styles.bit,
                isOne ? styles.one : styles.zero,
                isActive && styles.active
              )}
            >
              {bit}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
```

### Pattern 3: Variant and Level Tabs (from HashMapViz)

**What:** Three-level navigation: Variant tabs -> Difficulty levels -> Example tabs
**When to use:** This phase
**Example:**
```typescript
// Source: src/components/DSAPatterns/HashMapViz/HashMapViz.tsx
const [variant, setVariant] = useState<Variant>('xor-tricks')
const [level, setLevel] = useState<Level>('beginner')
const [exampleIndex, setExampleIndex] = useState(0)
const [stepIndex, setStepIndex] = useState(0)

const handleVariantChange = (newVariant: Variant) => {
  setVariant(newVariant)
  setLevel('beginner')
  setExampleIndex(0)
  setStepIndex(0)
}
```

### Pattern 4: Bit Width Configuration

**What:** Allow user to switch between 4, 8, 16, and 32-bit display widths
**When to use:** To accommodate different example complexity levels
**Example:**
```typescript
// New pattern for BitManipulationViz
const [bitWidth, setBitWidth] = useState<4 | 8 | 16 | 32>(8)

// Render bit width selector
<div className={styles.bitWidthSelector}>
  {[4, 8, 16, 32].map(width => (
    <button
      key={width}
      className={cn(styles.widthBtn, bitWidth === width && styles.active)}
      onClick={() => setBitWidth(width as 4 | 8 | 16 | 32)}
    >
      {width}-bit
    </button>
  ))}
</div>
```

### Anti-Patterns to Avoid

- **Using ConceptStep interface:** Create dedicated BitStep interface for this visualization
- **Storing step data in data file:** Keep steps inside component (established DSAPatterns pattern)
- **Reusing BitManipulationConcept directly:** Extract rendering logic, don't wrap the component
- **Hard-coding bit width:** Make it configurable per requirements (BM-03)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Step controls | Custom buttons | SharedViz/StepControls | Consistent UX |
| Code highlighting | Custom highlighter | SharedViz/CodePanel | Already handles line sync |
| Animation | Manual CSS transitions | framer-motion | Smoother, easier to maintain |
| Tab component | Custom tabs | Existing pattern from HashMapViz | Proven, consistent |
| Binary conversion | Complex bit math | `num.toString(2).padStart()` | Native, reliable |
| Two's complement | Custom implementation | `(num >>> 0).toString(2)` | JavaScript unsigned shift trick |

**Key insight:** The binary rendering logic from BitManipulationConcept is battle-tested. Adapt it rather than reinvent.

## Common Pitfalls

### Pitfall 1: Bit position indexing confusion

**What goes wrong:** activeBits array uses wrong indexing (MSB vs LSB)
**Why it happens:** Binary strings read left-to-right but bits are indexed 0 from right
**How to avoid:** Always calculate position as `bits - 1 - stringIndex`
**Warning signs:** Wrong bits highlighted, off-by-one errors
**Example:**
```typescript
// Correct: Position calculation
binaryStr.split('').map((bit, i) => {
  const bitPosition = bits - 1 - i  // This is correct
  const isActive = activeBits.includes(bitPosition)
})
```

### Pitfall 2: Negative number display

**What goes wrong:** Negative numbers display wrong binary or crash
**Why it happens:** JavaScript's toString(2) doesn't handle negative properly
**How to avoid:** Use unsigned right shift: `(num >>> 0).toString(2)`
**Warning signs:** Negative numbers show "-" prefix, wrong bit patterns
**Example:**
```typescript
// From BitManipulationConcept.tsx - proven solution
if (num < 0) {
  return (num >>> 0).toString(2).slice(-bits).padStart(bits, '1')
}
```

### Pitfall 3: Animation timing for bit operations

**What goes wrong:** All bits animate simultaneously, losing educational value
**Why it happens:** No staggered animation
**How to avoid:** Use staggered delays per bit position
**Warning signs:** Animation feels instant, hard to follow
**Example:**
```typescript
// From BitManipulationConcept.tsx - uses delay per bit
<motion.div
  initial={isResult ? { scale: 0.8, opacity: 0 } : false}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: isResult ? i * 0.05 : 0 }}
>
```

### Pitfall 4: Operator symbol display

**What goes wrong:** Raw operators like "&" confuse learners
**Why it happens:** No human-readable translation
**How to avoid:** Map operators to names per existing pattern
**Warning signs:** Users confused by "&" vs "AND"
**Example:**
```typescript
// From BitManipulationConcept.tsx
function getOperatorSymbol(op: string): string {
  switch (op) {
    case '&': return 'AND'
    case '|': return 'OR'
    case '^': return 'XOR'
    case '<<': return 'LEFT SHIFT'
    case '>>': return 'RIGHT SHIFT'
    case '~': return 'NOT'
    default: return op
  }
}
```

### Pitfall 5: Large bit widths causing layout issues

**What goes wrong:** 32-bit display overflows container
**Why it happens:** Fixed cell sizes don't scale
**How to avoid:** Adjust cell size based on bit width or use responsive sizing
**Warning signs:** Horizontal scroll appears, layout breaks on mobile
**Example:**
```css
/* Responsive bit sizing */
.bit {
  width: 20px;
  /* For 32-bit, reduce to 14px */
}
.container[data-width="32"] .bit {
  width: 14px;
}
```

## Code Examples

### Main Component Structure

```typescript
// Source: Based on HashMapViz.tsx pattern
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodePanel, StepProgress, StepControls } from '@/components/SharedViz'
import styles from './BitManipulationViz.module.css'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Variant = 'xor-tricks' | 'bit-masks' | 'shift-operations'

export function BitManipulationViz() {
  const [variant, setVariant] = useState<Variant>('xor-tricks')
  const [level, setLevel] = useState<Level>('beginner')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  // ... examples data structure (inside component)

  return (
    <div className={styles.container}>
      {/* Variant selector */}
      {/* Level selector */}
      {/* Example tabs (if multiple) */}
      {/* Main grid: CodePanel + Viz */}
      {/* StepProgress */}
      {/* StepControls */}
      {/* Insight box */}
    </div>
  )
}
```

### Binary Display Grid

```typescript
// Adapted from BitManipulationConcept.tsx patterns
const renderBinaryGrid = (step: BitStep) => {
  const { numbers, operator, result, activeBits = [], bitWidth } = step

  return (
    <div className={styles.binaryGrid}>
      {numbers.map((num, i) => (
        <div key={i}>
          {renderBitRow(num.label, num.value, bitWidth, activeBits)}
          {i < numbers.length - 1 && operator && (
            <div className={styles.operatorRow}>
              <span className={styles.operatorSymbol}>{operator}</span>
              <span className={styles.operatorName}>{getOperatorSymbol(operator)}</span>
            </div>
          )}
        </div>
      ))}

      {result !== undefined && (
        <>
          <div className={styles.divider} />
          {renderBitRow('result', result, bitWidth, activeBits, true)}
        </>
      )}

      {/* Bit position labels */}
      <div className={styles.bitPositions}>
        {Array.from({ length: bitWidth }, (_, i) => bitWidth - 1 - i).map(pos => (
          <span
            key={pos}
            className={cn(
              styles.bitPosition,
              activeBits.includes(pos) && styles.activeBitPos
            )}
          >
            {pos}
          </span>
        ))}
      </div>
    </div>
  )
}
```

### Example Step Data Structure

```typescript
// XOR Tricks - Single Number problem
const xorTricksBeginnerExample: BitExample = {
  id: 'single-number',
  title: 'Single Number',
  variant: 'xor-tricks',
  code: [
    'function singleNumber(nums) {',
    '  let result = 0',
    '',
    '  for (const num of nums) {',
    '    result = result ^ num',
    '  }',
    '',
    '  return result',
    '}'
  ],
  steps: [
    {
      id: 0,
      codeLine: 0,
      description: 'Find the number that appears only once. XOR trick: a ^ a = 0, a ^ 0 = a.',
      phase: 'read-value',
      numbers: [],
      bitWidth: 8,
      output: ['Input: [2, 1, 2]']
    },
    {
      id: 1,
      codeLine: 1,
      description: 'Initialize result to 0. In binary: 00000000.',
      phase: 'show-binary',
      numbers: [{ label: 'result', value: 0 }],
      bitWidth: 8,
      output: ['result = 0']
    },
    {
      id: 2,
      codeLine: 3,
      description: 'First iteration: num = 2.',
      phase: 'read-value',
      numbers: [
        { label: 'result', value: 0 },
        { label: 'num', value: 2 }
      ],
      bitWidth: 8,
      output: ['Processing: 2']
    },
    {
      id: 3,
      codeLine: 4,
      description: 'XOR: 0 ^ 2. Different bits become 1.',
      phase: 'apply-operation',
      numbers: [
        { label: 'result', value: 0 },
        { label: 'num', value: 2 }
      ],
      operator: '^',
      result: 2,
      activeBits: [1],
      bitWidth: 8,
      decision: {
        condition: '0 XOR 2?',
        conditionMet: true,
        action: 'Bit 1 differs, result = 2'
      },
      output: ['0 ^ 2 = 2']
    },
    // ... more steps
  ],
  insight: 'XOR cancels paired numbers: a ^ a = 0. After XORing all, only the single number remains.'
}
```

### Bit Width Selector

```typescript
// Per requirement BM-03: configurable bit width
<div className={styles.bitWidthSelector}>
  <span className={styles.widthLabel}>Bit Width:</span>
  {([4, 8, 16, 32] as const).map(width => (
    <button
      key={width}
      className={cn(styles.widthBtn, currentExample.bitWidth === width && styles.active)}
      onClick={() => handleBitWidthChange(width)}
      disabled  // Bit width is per-example, not user-selectable during playback
    >
      {width}
    </button>
  ))}
</div>
```

### Decision Panel (Per requirement BM-06)

```typescript
// Show what operation does and why
{step.decision && (
  <motion.div
    className={styles.decisionPanel}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <span className={styles.decisionQuestion}>{step.decision.condition}</span>
    <span className={cn(
      styles.decisionAnswer,
      step.decision.conditionMet ? styles.conditionTrue : styles.conditionFalse
    )}>
      {step.decision.conditionMet ? 'Yes' : 'No'} {'\u2192'} {step.decision.action}
    </span>
  </motion.div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ConceptPanel integration | Self-contained DSAPatterns | Phase 7 | More maintainable |
| Single difficulty | Three levels (beginner/intermediate/advanced) | Phase 8 | Better learning curve |
| Generic concept steps | Pattern-specific step interfaces | Phase 8 | Type safety |

**Deprecated/outdated:**
- BitManipulationConcept: Still used in practice page, but DSAPatterns page uses self-contained viz

## Open Questions

1. **Bit width per-example vs user-selectable**
   - What we know: Requirement says "configurable bit width (4, 8, 16, or 32 bits)"
   - What's unclear: Is this user-controlled or author-controlled per example?
   - Recommendation: Make it author-controlled per example (like TwoPointers variants), display current width but don't allow changing mid-example

2. **Shift operations animation**
   - What we know: Need to show bits moving left/right
   - What's unclear: Best animation approach for shift vs static operations
   - Recommendation: Use framer-motion's `layout` for smooth repositioning, or animate individual bit movement

## Sources

### Primary (HIGH confidence)

- `src/components/DSAPatterns/HashMapViz/HashMapViz.tsx` - Primary pattern template
- `src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.tsx` - Step-through pattern
- `src/components/ConceptPanel/BitManipulationConcept.tsx` - Binary rendering patterns
- `src/components/SharedViz/` - Reusable step-through components
- `src/data/dsaPatterns.ts` - Variant definitions (xor-tricks, bit-masks, shift-operations)

### Secondary (MEDIUM confidence)

- `src/components/DSAConcepts/BinarySystemViz.tsx` - Alternative binary viz approach
- `.planning/phases/08-twopointerviz/08-RESEARCH.md` - Prior phase research

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses only existing project dependencies
- Architecture: HIGH - Follows established DSAPatterns pattern exactly
- Pitfalls: HIGH - Based on existing BitManipulationConcept implementation

**Research date:** 2026-01-25
**Valid until:** Indefinite (internal patterns, not external dependencies)
