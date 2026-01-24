# Architecture Research: DSA Pattern Visualizations

**Researched:** 2026-01-24
**Confidence:** HIGH (based on existing codebase patterns)
**Scope:** Integrating pattern-based DSA visualizations (two-pointers, hash-map, etc.) following user decision to use pattern-based pages like JS concepts

## Executive Summary

The codebase has two established visualization systems:

1. **JS Concepts** (`/concepts/[conceptId]`): Pattern-level pages with embedded step data in `*Viz.tsx` components
2. **DSA Concepts** (`/concepts/dsa/[conceptId]`): Data structure pages (arrays, hash-tables, stacks) with interactive visualizers
3. **Problem-specific Algorithm Visualizations** (`/[categoryId]/[problemId]/concept`): Uses `ConceptPanel` with step data from `algorithmConcepts.ts`

The new DSA pattern visualizations should follow the JS Concepts pattern, creating pattern-level pages at `/concepts/dsa/patterns/[patternId]` (e.g., `/concepts/dsa/patterns/two-pointers`).

---

## Recommended Structure

### Directory Organization

```
src/
  data/
    dsaConcepts.ts          # Existing - data structures (arrays, stacks, etc.)
    dsaPatterns.ts          # NEW - pattern metadata (two-pointers, sliding-window, etc.)
    algorithmConcepts.ts    # Existing - problem-specific step data (keep for problem pages)

  components/
    DSAConcepts/            # Existing - data structure visualizers (ArrayViz, StackViz)
    DSAPatterns/            # NEW - pattern-focused visualizers
      TwoPointersPatternViz.tsx
      TwoPointersPatternViz.module.css
      HashMapPatternViz.tsx
      HashMapPatternViz.module.css
      BitManipulationPatternViz.tsx
      BitManipulationPatternViz.module.css
      SlidingWindowPatternViz.tsx
      SlidingWindowPatternViz.module.css
      BinarySearchPatternViz.tsx
      BinarySearchPatternViz.module.css
      index.ts

    ConceptPanel/           # Existing - problem-specific visualizers (keep as-is)

  app/
    concepts/
      dsa/
        [conceptId]/        # Existing - data structure pages (arrays, stacks)
        patterns/           # NEW - pattern pages
          page.tsx          # Pattern listing page
          [patternId]/      # Pattern detail pages
            page.tsx
            PatternPageClient.tsx
            page.module.css
```

### Data Model

**New file: `src/data/dsaPatterns.ts`**

```typescript
export interface PatternExample {
  problemId: string        // Links to algorithmConcepts.ts
  problemName: string
  difficulty: 'easy' | 'medium' | 'hard'
  keyInsight: string
}

export interface DSAPattern {
  id: string               // 'two-pointers', 'hash-map', 'sliding-window'
  title: string
  category: 'array-patterns' | 'string-patterns' | 'bit-patterns'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  whenToUse: string[]      // Pattern recognition triggers
  variants: {              // Sub-patterns with difficulty levels
    id: string
    name: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }[]
  examples: PatternExample[]  // Linked problems for practice
  commonMistakes?: string[]
  interviewTips?: string[]
  complexity: {
    time: string
    space: string
  }
}
```

---

## Integration Points

### 1. Routing Integration

**Current routes:**
- `/concepts` - Concepts hub (JS and DSA cards)
- `/concepts/js` - JS concepts listing
- `/concepts/dsa` - DSA concepts listing (data structures only)
- `/concepts/[conceptId]` - Individual JS concept
- `/concepts/dsa/[conceptId]` - Individual DSA data structure concept

**New routes to add:**
- `/concepts/dsa/patterns` - Pattern listing page
- `/concepts/dsa/patterns/[patternId]` - Individual pattern page

**Update needed:** `/concepts/dsa/page.tsx` to add link to patterns section

### 2. Data Integration

**Keep existing `algorithmConcepts.ts`:**
- Problem-specific step data remains valuable for `/[categoryId]/[problemId]/concept` pages
- Pattern pages can reference these via `patternId` in step data

**New `dsaPatterns.ts`:**
- Pattern-level metadata (when to use, variants, complexity)
- Links to example problems
- Pattern visualizations embed their own step data (like JS Concepts do)

### 3. Component Integration

**Reuse SharedViz components:**
- `CodePanel` - Show pattern template code
- `StepProgress` - Step indicators
- `StepControls` - Play/pause/step navigation
- `useAutoPlay` hook - Auto-advance through steps

**New pattern visualizers follow JS Concepts pattern:**
- Self-contained `*PatternViz.tsx` components
- Embed step data directly in component (like `HoistingViz.tsx`)
- Include difficulty-level tabs (beginner/intermediate/advanced)
- CSS Module for styling with pattern-specific accent colors

### 4. Type Integration

**Extend existing types in `src/types/index.ts`:**
```typescript
// Existing ConceptType already covers patterns:
export type ConceptType =
  | 'two-pointers-converge'
  | 'two-pointers-same-dir'
  | 'two-pointers-partition'
  | 'bit-manipulation'
  | 'sliding-window'
  | 'binary-search'
  | 'hash-map'  // Add if not present

// Existing ConceptStep and ConceptVisualState work as-is
```

---

## Component Inventory

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `TwoPointersPatternViz` | `src/components/DSAPatterns/` | Two-pointer pattern visualization with variants |
| `HashMapPatternViz` | `src/components/DSAPatterns/` | Hash map pattern visualization |
| `BitManipulationPatternViz` | `src/components/DSAPatterns/` | Bit manipulation pattern visualization |
| `SlidingWindowPatternViz` | `src/components/DSAPatterns/` | Sliding window pattern visualization |
| `BinarySearchPatternViz` | `src/components/DSAPatterns/` | Binary search pattern visualization |
| `PatternPageClient` | `src/app/concepts/dsa/patterns/[patternId]/` | Pattern page client component |

### Modified Components

| Component | Location | Modification |
|-----------|----------|--------------|
| DSA concepts listing | `src/app/concepts/dsa/page.tsx` | Add "Patterns" section/link |
| Concepts hub | `src/app/concepts/page.tsx` | Optionally update DSA card description |

### Existing Components to Reuse (No Changes)

| Component | Location | Usage |
|-----------|----------|-------|
| `CodePanel` | `src/components/SharedViz/` | Show template code in pattern pages |
| `StepProgress` | `src/components/SharedViz/` | Step indicators |
| `StepControls` | `src/components/SharedViz/` | Navigation controls |
| `useAutoPlay` | `src/components/SharedViz/` | Auto-advance hook |
| `NavBar` | `src/components/NavBar/` | Breadcrumb navigation |
| `ConceptIcon` | `src/components/Icons/` | May need new icons for patterns |
| `ConceptPanel` | `src/components/ConceptPanel/` | Keep for problem-specific pages |

---

## Build Order

Based on dependencies and incremental value delivery:

### Phase 1: Foundation (No Breaking Changes)

1. **Create `src/data/dsaPatterns.ts`**
   - Define `DSAPattern` interface
   - Add metadata for first pattern (two-pointers)
   - No routes yet, just data

2. **Create `src/components/DSAPatterns/` directory**
   - Create `index.ts` barrel export
   - Create base CSS variables file for consistent styling

### Phase 2: First Pattern Page

3. **Create `TwoPointersPatternViz.tsx`**
   - Follow `HoistingViz.tsx` structure:
     - Difficulty-level tabs (beginner/intermediate/advanced)
     - Embedded step data for each variant
     - Self-contained visualization
   - Reuse TwoPointersConcept rendering logic where applicable

4. **Create route structure:**
   - `src/app/concepts/dsa/patterns/page.tsx` (listing)
   - `src/app/concepts/dsa/patterns/[patternId]/page.tsx`
   - `src/app/concepts/dsa/patterns/[patternId]/PatternPageClient.tsx`

5. **Update `/concepts/dsa/page.tsx`**
   - Add patterns section linking to new route

### Phase 3: Additional Patterns (Parallelizable)

6. **Create remaining pattern visualizers:**
   - `HashMapPatternViz.tsx` (leverage existing HashMapConcept)
   - `BitManipulationPatternViz.tsx` (leverage existing BitManipulationConcept)
   - `SlidingWindowPatternViz.tsx` (new)
   - `BinarySearchPatternViz.tsx` (new)

7. **Expand `dsaPatterns.ts`**
   - Add metadata for all patterns
   - Link example problems from `algorithmConcepts.ts`

### Phase 4: Polish and Integration

8. **Add pattern icons to `ConceptIcon`**
   - Pattern-specific icons for navigation

9. **Cross-link patterns with problems**
   - On pattern pages: "Practice this pattern" section
   - On problem concept pages: "Learn this pattern" link

10. **SEO and metadata**
    - Structured data for pattern pages
    - OpenGraph images

---

## Key Architectural Decisions

### Decision 1: Separate DSAPatterns Directory

**Rationale:** Pattern visualizers are conceptually different from data structure visualizers (DSAConcepts). Patterns show algorithmic techniques applied to data; data structures show the structures themselves.

**Alternative considered:** Add to existing DSAConcepts folder.
**Why rejected:** Would conflate two different concept types and make the folder harder to navigate.

### Decision 2: Embed Step Data in Viz Components

**Rationale:** Follows proven JS Concepts pattern. Each `*Viz.tsx` component is self-contained with its step data, making it easy to understand, test, and modify.

**Alternative considered:** Central data file for all pattern steps.
**Why rejected:** JS Concepts pattern works well; step data is tightly coupled to visualization logic.

### Decision 3: Keep algorithmConcepts.ts for Problem Pages

**Rationale:** Problem-specific concept pages (`/[categoryId]/[problemId]/concept`) serve a different purpose than pattern pages. They show how a specific problem maps to a pattern with that problem's exact data.

**Relationship:**
- Pattern pages: "Here's how two-pointers works" (generic examples)
- Problem pages: "Here's how two-pointers solves Two Sum II" (specific)

### Decision 4: Nested Route `/concepts/dsa/patterns/[patternId]`

**Rationale:** Maintains clear URL hierarchy. DSA has two sub-categories: data structures (`/concepts/dsa/arrays`) and patterns (`/concepts/dsa/patterns/two-pointers`).

**Alternative considered:** Flat `/concepts/patterns/[patternId]`.
**Why rejected:** Patterns are DSA-specific, not general JS concepts.

---

## Risk Areas and Mitigations

### Risk 1: Duplicate Visualization Code

**Risk:** Pattern visualizers might duplicate code from existing `ConceptPanel` components.

**Mitigation:**
- Extract shared rendering logic into utility functions
- Pattern components can compose existing low-level visualizers
- Example: `TwoPointersPatternViz` uses array rendering from `TwoPointersConcept`

### Risk 2: Data Inconsistency

**Risk:** Pattern metadata in `dsaPatterns.ts` might drift from problem data in `algorithmConcepts.ts`.

**Mitigation:**
- Use TypeScript to link pattern IDs
- Pattern pages reference problem IDs, don't duplicate content
- Consider generating links from single source of truth

### Risk 3: Navigation Complexity

**Risk:** Users might get lost between concepts/dsa/patterns vs [categoryId]/[problemId]/concept.

**Mitigation:**
- Clear naming: "Learn Pattern" vs "See Solution"
- Cross-linking between pages
- Breadcrumbs show current location

---

## File Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `src/data/dsaPatterns.ts` | Pattern metadata |
| `src/components/DSAPatterns/index.ts` | Barrel export |
| `src/components/DSAPatterns/TwoPointersPatternViz.tsx` | Two-pointers viz |
| `src/components/DSAPatterns/TwoPointersPatternViz.module.css` | Styling |
| `src/components/DSAPatterns/HashMapPatternViz.tsx` | Hash map viz |
| `src/components/DSAPatterns/HashMapPatternViz.module.css` | Styling |
| `src/components/DSAPatterns/BitManipulationPatternViz.tsx` | Bit manipulation viz |
| `src/components/DSAPatterns/BitManipulationPatternViz.module.css` | Styling |
| `src/components/DSAPatterns/SlidingWindowPatternViz.tsx` | Sliding window viz |
| `src/components/DSAPatterns/SlidingWindowPatternViz.module.css` | Styling |
| `src/components/DSAPatterns/BinarySearchPatternViz.tsx` | Binary search viz |
| `src/components/DSAPatterns/BinarySearchPatternViz.module.css` | Styling |
| `src/app/concepts/dsa/patterns/page.tsx` | Pattern listing |
| `src/app/concepts/dsa/patterns/[patternId]/page.tsx` | Pattern SSR page |
| `src/app/concepts/dsa/patterns/[patternId]/PatternPageClient.tsx` | Pattern client |
| `src/app/concepts/dsa/patterns/[patternId]/page.module.css` | Styling |

### Modified Files

| File | Change |
|------|--------|
| `src/app/concepts/dsa/page.tsx` | Add patterns section |
| `src/types/index.ts` | Potentially add 'hash-map' to ConceptType if missing |
| `src/components/Icons/ConceptIcon.tsx` | Add pattern icons |

### Unchanged Files

| File | Reason |
|------|--------|
| `src/data/algorithmConcepts.ts` | Keep for problem-specific pages |
| `src/components/ConceptPanel/*` | Keep for problem-specific visualization |
| `src/app/[categoryId]/[problemId]/concept/*` | Problem-specific concept pages unchanged |

---

## Pattern Pages vs Problem Pages: Comparison

| Aspect | Pattern Page | Problem Page |
|--------|--------------|--------------|
| URL | `/concepts/dsa/patterns/two-pointers` | `/arrays-hashing/two-sum-ii/concept` |
| Purpose | Teach the pattern generically | Show pattern applied to specific problem |
| Data Source | `dsaPatterns.ts` + embedded steps | `algorithmConcepts.ts` |
| Component | `TwoPointersPatternViz` | `ConceptPanel` + `TwoPointersConcept` |
| Examples | Multiple generic examples | Single problem-specific example |
| Difficulty | Tabs for beginner/intermediate/advanced | Single difficulty (problem's difficulty) |
| Navigation from | Learn Concepts flow | Practice Problems flow |

This separation allows users to:
1. Learn patterns conceptually first (pattern pages)
2. See patterns applied in practice (problem pages)
3. Navigate between both via cross-links

---

## Sources

- Existing codebase analysis (HIGH confidence)
- `/src/components/Concepts/HoistingViz.tsx` - JS concept pattern template
- `/src/data/algorithmConcepts.ts` - Existing problem-specific data
- `/src/components/ConceptPanel/` - Existing algorithm visualizers
- `/src/app/concepts/dsa/[conceptId]/` - Existing DSA page structure
