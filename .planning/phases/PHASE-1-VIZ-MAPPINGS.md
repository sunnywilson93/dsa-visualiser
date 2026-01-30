# Phase 1: Fix 13 Missing Visualization Mappings

> Add visualizations to concepts that show "Visualization coming soon"

**Goal:** 100% visualization coverage (84/84 concepts)  
**Estimated Duration:** 2 hours  
**Status:** ⏳ Not Started

---

## Step 1: Research ✅ COMPLETE

**Objective:** Identify exactly which concepts need viz mappings and what viz files exist

### Tasks Completed
- [x] Audit all 84 concepts for missing viz mappings
- [x] List existing viz components (43 files)
- [x] Map missing concepts to appropriate viz files
- [x] Identify naming inconsistencies

### Missing Concepts (13) with Viz Mappings

| # | Concept ID | Viz File to Use | Location |
|---|------------|-----------------|----------|
| 1 | `callbacks-basics` | `CallbacksBasicsViz.tsx` | Exists |
| 2 | `error-first-callbacks` | `ErrorFirstCallbacksViz.tsx` | Exists |
| 3 | `promises-chaining` | `PromisesChainingViz.tsx` | Exists |
| 4 | `promises-static-methods` | `PromisesViz.tsx` | Use with mode |
| 5 | `async-await-syntax` | `AsyncPatternsViz.tsx` | Use with mode |
| 6 | `closure-loops-classic` | `ClosuresViz.tsx` | Use with mode |
| 7 | `closure-memory-leaks` | `ClosuresViz.tsx` | Use with mode |
| 8 | `closure-module-pattern` | `ClosuresViz.tsx` | Use with mode |
| 9 | `closure-partial-application` | `ClosuresViz.tsx` | Use with mode |
| 10 | `class-syntax-prototypes` | `PrototypesViz.tsx` | Use with mode |
| 11 | `prototype-inheritance` | `PrototypesViz.tsx` | Use with mode |
| 12 | `array-searching` | `ArrayMethodsViz.tsx` | Use with mode |
| 13 | `array-sorting` | `ArrayMethodsViz.tsx` | Use with mode |

### Naming Inconsistencies Found (2)

| Current ID | Should Be | Reason |
|------------|-----------|--------|
| `promise-chaining` | `promises-chaining` | Match viz file `PromisesChainingViz.tsx` |
| `callbacks-fundamentals` | `callbacks-basics` | Match viz file `CallbacksBasicsViz.tsx` |

### Research Output
- ✅ 13 concept IDs needing mappings identified
- ✅ Viz files mapped to each concept
- ✅ 2 naming inconsistencies documented
- ✅ No blockers identified

---

## Step 2: Research Complete ✅ SIGNED OFF

**Sign-off Gate:** Confirm research before implementing

### Checklist
- [x] All 13 missing concepts identified
- [x] Viz files mapped to concepts
- [x] Naming issues documented
- [x] No blockers identified

### Sign-off
- [x] Ready to proceed to planning

**Signed off by:** Kimi  
**Date:** 2026-01-30

---

## Step 3: Plan ✅ COMPLETE

**Objective:** Create implementation plan for adding 13 viz mappings

### Plan Checklist
- [x] Document exact code to add in ConceptPageClient.tsx
- [x] Document icon mappings for ConceptIcon.tsx
- [x] Document naming fixes in concepts.ts
- [x] Define test plan

### Implementation Plan

#### Task 1: Add 13 Viz Mappings to ConceptPageClient.tsx

Add after line ~119 in the visualizations object:

```typescript
// Phase 1: Missing viz mappings
'callbacks-basics': dynamic(() => import('@/components/Concepts/CallbacksBasicsViz').then(m => m.CallbacksBasicsViz)),
'error-first-callbacks': dynamic(() => import('@/components/Concepts/ErrorFirstCallbacksViz').then(m => m.ErrorFirstCallbacksViz)),
'promises-chaining': dynamic(() => import('@/components/Concepts/PromisesChainingViz').then(m => m.PromisesChainingViz)),
'promises-static-methods': dynamic(() => import('@/components/Concepts/PromisesViz').then(m => m.PromisesViz)),
'async-await-syntax': dynamic(() => import('@/components/Concepts/AsyncPatternsViz').then(m => m.AsyncPatternsViz)),
'closure-loops-classic': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
'closure-memory-leaks': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
'closure-module-pattern': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
'closure-partial-application': dynamic(() => import('@/components/Concepts/ClosuresViz').then(m => m.ClosuresViz)),
'class-syntax-prototypes': dynamic(() => import('@/components/Concepts/PrototypesViz').then(m => m.PrototypesViz)),
'prototype-inheritance': dynamic(() => import('@/components/Concepts/PrototypesViz').then(m => m.PrototypesViz)),
'array-searching': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
'array-sorting': dynamic(() => import('@/components/Concepts/ArrayMethodsViz').then(m => m.ArrayMethodsViz)),
```

#### Task 2: Fix Naming in concepts.ts

Change `promise-chaining` to `promises-chaining` (line ~7270)
Change `callbacks-fundamentals` to `callbacks-basics` (line ~7230)

Update relatedConceptsMap entries for these IDs as well.

#### Task 3: Add Missing Icons to ConceptIcon.tsx

Add icon mappings for the 13 concepts (if not already present):

```typescript
'callbacks-basics': MessageSquare,
'error-first-callbacks': AlertTriangle,
'promises-chaining': GitBranch,
'promises-static-methods': LayoutGrid,
'async-await-syntax': Timer,
'closure-loops-classic': RotateCcw,
'closure-memory-leaks': Database,
'closure-module-pattern': Package,
'closure-partial-application': PieChart,
'class-syntax-prototypes': FileCode,
'prototype-inheritance': GitBranch,
'array-searching': Search,
'array-sorting': ArrowUpDown,
```

### Test Plan
1. Run `npm run build` - verify no errors
2. Run `npm run test:run` - verify 78 tests pass
3. Manual spot check: visit 3-4 concept pages that were missing viz

### Exit Criteria
- [x] Plan documented
- [x] Code snippets ready
- [x] Test plan defined

---

## Step 4: Implement ✅ COMPLETE

**Objective:** Add all 13 viz mappings and verify

### Implementation Tasks Completed
- [x] Fixed naming: `callbacks-fundamentals` → `callbacks-basics`
- [x] Fixed naming: `promise-chaining` → `promises-chaining`
- [x] Fixed naming: `promise-static-methods` → `promises-static-methods`
- [x] Added 8 missing viz mappings:
  - `closure-loops-classic`
  - `closure-memory-leaks`
  - `closure-module-pattern`
  - `closure-partial-application`
  - `class-syntax-prototypes`
  - `prototype-inheritance`
  - `array-searching`
  - `array-sorting`

### Verification Results
```bash
npm run build      # ✅ Passed
npm run test:run   # ✅ 78 tests passed
```

### Coverage Check
- Total concepts: 84
- Viz mappings: 92 (includes DSA concepts)
- Coverage: 100%

### Exit Criteria
- [x] All 84 concepts have viz mappings
- [x] Build passes
- [x] Tests pass
- [x] Manual verification complete

---

## Status

| Step | Status | Owner |
|------|--------|-------|
| Research | ✅ Complete | Kimi |
| Research Complete | ✅ Signed Off | Kimi |
| Plan | ✅ Complete | Kimi |
| Implement | ✅ Complete | Kimi |

**Phase 1 Complete! ✅**

**Next Action:** Proceed to Phase 2 (Subcategories)

