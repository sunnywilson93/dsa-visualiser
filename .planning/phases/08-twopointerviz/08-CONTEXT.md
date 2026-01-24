# Phase 8: TwoPointersViz — Context

Captured from `/gsd:discuss-phase 8` on 2026-01-24.

## Gray Areas Discussed

### 1. Array Visualization Style

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cell display | Claude decides | Flexible based on implementation |
| Pointer labels | Below cell with arrow | L/R for converging, slow/fast for same-direction |
| Pointer collision | Combined label ("L,R") | Clear when pointers meet |
| Cell states | Color coding | Active=accent, processed=muted, pending=default |

### 2. Decision Logic Presentation

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Placement | Above array | Natural reading order, see decision before movement |
| Format | Question + answer | "Is sum > target? Yes → move right pointer left" |
| Value highlight | Both options | Show concrete values AND general pattern |
| Visual connection | Highlight referenced cells | Subtle glow on cells mentioned in decision |

### 3. Example Problem Selection

| Difficulty | Problems | Step Count |
|------------|----------|------------|
| Beginner | Two Sum II, Valid Palindrome | Full trace |
| Intermediate | Container With Most Water, 3Sum, Remove Duplicates | Full trace |
| Advanced | Sort Colors (Dutch Flag), Trapping Rain Water | Full trace |

**Total:** 7 examples across 3 difficulty levels, all with full execution traces.

### 4. Variant Switching UX

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Switch method | Tabs at top | Converging \| Same Direction \| Partition |
| Tab content | Variant names | Clear text labels, consistent with codebase |
| Step on switch | Reset to step 0 | Fresh start for each variant's example |
| Tab hover | Brief tooltip | Shows variant description on hover |

## Implementation Notes

- SharedViz integration following v1.0 patterns (CodePanel, StepControls, StepProgress)
- Decision logic displays BEFORE pointer movement animation completes
- Pointer movement should animate smoothly (CSS transitions)
- Each variant tab contains its own set of difficulty levels and examples
- Tab structure: Variant tabs → Difficulty tabs (beginner/intermediate/advanced) → Example selector

## Requirements Coverage

This phase covers: TP-01, TP-02, TP-03, TP-04, TP-05, TP-06

---
*Context captured: 2026-01-24*
