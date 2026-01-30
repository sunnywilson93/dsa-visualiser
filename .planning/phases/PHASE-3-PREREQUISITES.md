# Phase 3: Add Prerequisite Learning Paths

> Create prerequisite chains so users can follow logical learning paths

**Goal:** Every concept has prerequisites and nextConcepts defined  
**Estimated Duration:** 2 hours  
**Status:** ⏳ Not Started (Blocked on Phase 2)

---

## Step 1: Research

**Objective:** Design logical learning paths through all concepts

### Tasks
- [ ] Analyze concept dependencies
- [ ] Define 3 main learning paths (beginner, intermediate, advanced)
- [ ] Map prerequisites for each concept
- [ ] Identify circular dependency risks

### Learning Paths
```
Path 1: Beginner → Intermediate
variables → scope-basics → hoisting → functions → 
arrays → objects → closures → promises → async-await

Path 2: Advanced Topics
event-loop → microtasks → v8-engine → memory-model → 
prototypes → class-syntax → closure-patterns

Path 3: Interview Prep
this-keyword → closures → event-loop → promises → 
async-errors → coercion-edge-cases
```

### Research Output
- Prerequisite chains for all 84 concepts
- Learning path diagrams
- NextConcepts mappings

---

## Step 2: Research Complete

**Sign-off Gate:** Confirm learning paths before implementing

### Checklist
- [ ] Prerequisites defined for all concepts
- [ ] Learning paths are logical
- [ ] No circular dependencies
- [ ] Paths cover all concepts

### Sign-off
- [ ] Ready to proceed to planning
- [ ] Need more research

---

## Step 3: Plan

**Objective:** Create implementation plan for prerequisite system

### Plan Checklist
- [ ] Document prerequisites array for each concept
- [ ] Document nextConcepts array for each concept
- [ ] Plan prev/next navigation UI
- [ ] Define test plan

### Files to Modify
1. `src/data/concepts.ts` - Add prerequisites/nextConcepts to 84 concepts
2. `src/app/concepts/[conceptId]/ConceptPageClient.tsx` - Add prev/next nav
3. `src/lib/concepts.ts` - Add helper functions (getPrevConcept, getNextConcept)

### Exit Criteria
- [ ] All prerequisites documented
- [ ] Navigation UI planned
- [ ] Test plan defined

---

## Step 4: Implement

**Objective:** Add prerequisites and navigation to all concepts

### Implementation Tasks
- [ ] Add prerequisites[] to all 84 concepts
- [ ] Add nextConcepts[] to all 84 concepts
- [ ] Add prev/next navigation to concept pages
- [ ] Add helper functions
- [ ] Run build and verify

### Verification
```bash
npm run build      # Should pass
npm run test:run   # 78 tests should pass
```

### Manual Check
- [ ] Visit concept pages
- [ ] Click prev/next navigation
- [ ] Verify logical flow

### Exit Criteria
- [ ] All concepts have prerequisites
- [ ] All concepts have nextConcepts
- [ ] Prev/next navigation works
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

**Prerequisite:** Phase 2 must be complete  
**Next Action:** Await Phase 2 completion
