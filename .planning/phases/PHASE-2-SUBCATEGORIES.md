# Phase 2: Reorganize into Subcategories

> Split "fundamentals" category into logical subcategories for better UX

**Goal:** Clear category structure with <15 concepts per subcategory  
**Estimated Duration:** 3 hours  
**Status:** ⏳ Not Started (Blocked on Phase 1)

---

## Step 1: Research

**Objective:** Analyze current category distribution and design subcategory structure

### Tasks
- [ ] Count concepts per category
- [ ] Identify logical groupings within "fundamentals" (48 concepts)
- [ ] Research competitor categorization
- [ ] Design subcategory hierarchy

### Current State
```
fundamentals: 48 concepts (57%) - TOO MANY
basics: 12 concepts
core: 10 concepts
advanced: 4 concepts
...
```

### Proposed Subcategories
```
fundamentals/scope-hoisting: 5 concepts
fundamentals/async-patterns: 11 concepts
fundamentals/array-methods: 7 concepts
fundamentals/prototypes-oop: 12 concepts
fundamentals/types-coercion: 8 concepts
```

### Research Output
- Proposed subcategory structure
- Concept assignment to each subcategory
- UI mock for subcategory display

---

## Step 2: Research Complete

**Sign-off Gate:** Confirm subcategory structure before implementing

### Checklist
- [ ] Subcategories defined (5-6 max)
- [ ] Concepts assigned to subcategories
- [ ] UI approach decided
- [ ] No blockers identified

### Sign-off
- [ ] Ready to proceed to planning
- [ ] Need more research

---

## Step 3: Plan

**Objective:** Create implementation plan for category reorganization

### Plan Checklist
- [ ] Document category field updates for each concept
- [ ] Plan UI changes for /concepts/js page
- [ ] Plan subcategory grouping logic
- [ ] Define test plan

### Files to Modify
1. `src/data/concepts.ts` - Update category field (~40 concepts)
2. `src/app/concepts/js/page.tsx` - Add subcategory grouping
3. `src/app/concepts/js/JSConceptsClient.tsx` - Update display

### Exit Criteria
- [ ] Category assignments documented
- [ ] UI changes planned
- [ ] Test plan defined

---

## Step 4: Implement

**Objective:** Reorganize categories and update UI

### Implementation Tasks
- [ ] Update category field for all ~40 fundamental concepts
- [ ] Add subcategory grouping to /concepts/js page
- [ ] Update concept cards to show subcategory
- [ ] Run build and verify
- [ ] Test navigation

### Verification
```bash
npm run build      # Should pass
npm run test:run   # 78 tests should pass
```

### Manual Check
- [ ] /concepts/js shows subcategories
- [ ] Each subcategory has correct concepts
- [ ] Click through to concepts works

### Exit Criteria
- [ ] No category has >15 concepts
- [ ] Subcategories visible in UI
- [ ] Build passes
- [ ] Manual verification complete

---

## Status

| Step | Status | Owner |
|------|--------|-------|
| Research | ⏳ Not Started | TBD |
| Research Complete | ⏳ Blocked | TBD |
| Plan | ⏳ Blocked | TBD |
| Implement | ⏳ Blocked | TBD |

**Prerequisite:** Phase 1 must be complete  
**Next Action:** Await Phase 1 completion
