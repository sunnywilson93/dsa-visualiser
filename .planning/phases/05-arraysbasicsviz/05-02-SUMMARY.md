---
phase: 05-arraysbasicsviz
plan: 02
subsystem: visualization
tags: [spread-operator, shallow-copy, warning-badge, arrays]
dependency-graph:
  requires: [05-01]
  provides: [intermediate-spread-examples, shared-ref-warning]
  affects: [05-03]
tech-stack:
  added: []
  patterns: [shared-ref-detection, warning-badge-ui]
file-tracking:
  key-files:
    created: []
    modified:
      - src/components/Concepts/ArraysBasicsViz.tsx
      - src/components/Concepts/ArraysBasicsViz.module.css
decisions:
  - id: warning-badge-detection
    choice: Detect shared refs by counting refId occurrences during mutate phase
    rationale: Simple and effective for showing when mutation affects multiple variables
metrics:
  duration: ~4 min
  completed: 2026-01-24
---

# Phase 05 Plan 02: Spread Operator Examples Summary

**One-liner:** Intermediate examples showing spread operator creates independent copies vs reference copies sharing same heap object, with warning badge on shared reference mutations.

## What Was Built

### 1. Intermediate Examples (3 total)

**Example 1: "Spread creates a copy"**
- Code: `let arr2 = [...arr1]` followed by `arr2.push(4)`
- Visualization: TWO distinct heap objects (#1 and #2)
- Shows arr1 unchanged after arr2 mutation
- Insight: "The spread operator [...arr] creates a NEW array in memory"

**Example 2: "Reference copy vs Spread copy"**
- Side-by-side comparison of `refCopy = original` vs `spreadCopy = [...original]`
- refCopy mutation affects original, spreadCopy mutation does not
- Clear visual distinction: one heap object vs two

**Example 3: "Shallow copy warning"**
- Nested arrays: `matrix = [[1,2], [3,4]]`
- Shows spread creates new outer array but inner arrays still shared
- Both matrix[0] and copy[0] affected by mutation

### 2. Warning Badge

**Implementation:**
- Detects when multiple stack items share same refId
- Appears during `phase === 'mutate'` only
- Shows: "Both {var1} and {var2} affected!"
- Amber/orange styling with pulse animation

**CSS additions:**
- `.warningBadge` - Main badge container with amber colors
- `.warningIcon` - Exclamation mark styling
- `.warningText` - Bold text for variable names
- `@keyframes warningPulse` - Subtle pulsing animation
- `.spreadSource` / `.spreadTarget` - Animation utilities for spread visualization

## Technical Details

### Shared Reference Detection Logic
```typescript
const getSharedRefWarning = () => {
  if (!currentStep || currentStep.phase !== 'mutate') return null

  const refCounts = new Map<string, string[]>()
  currentStep.stack.forEach(item => {
    if (item.isReference && item.refId) {
      const existing = refCounts.get(item.refId) || []
      existing.push(item.name)
      refCounts.set(item.refId, existing)
    }
  })

  for (const [, names] of refCounts) {
    if (names.length > 1) {
      return names
    }
  }
  return null
}
```

### Key Data Patterns

Spread example heap state showing TWO objects:
```typescript
heap: [
  { id: 'array1', elements: [1, 2, 3], label: '#1' },
  { id: 'array2', elements: [1, 2, 3], label: '#2', highlight: 'new' },
]
```

Shallow copy nested arrays:
```typescript
heap: [
  { id: 'outer1', elements: ['-> #2', '-> #3'], label: '#1' },
  { id: 'inner1', elements: [1, 2], label: '#2' },
  { id: 'inner2', elements: [3, 4], label: '#3' },
  { id: 'outer2', elements: ['-> #2', '-> #3'], label: '#4' },
]
```

## Verification Results

- [x] Build completes without errors
- [x] Intermediate level accessible with 3 examples
- [x] Spread operator shows TWO separate heap objects
- [x] Warning badge appears: "Both refCopy and original affected!"
- [x] Shallow copy demonstrates nested array sharing

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| 8c5380c | feat(05-02): add spread operator examples and warning badge |

## Next Phase Readiness

Phase 05-03 can proceed - all intermediate examples complete. The warning badge pattern can be reused for other visualizations showing shared state.
