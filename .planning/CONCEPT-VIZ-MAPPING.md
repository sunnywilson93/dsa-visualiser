# Concept to Visualization Mapping

> Complete mapping of all concepts to their visualizations

## Missing Mappings (Fix Immediately)

| # | Concept ID | Viz File to Use | Mode/Props | Action |
|---|------------|-----------------|------------|--------|
| 1 | `callbacks-basics` | `CallbacksBasicsViz.tsx` | default | Add to ConceptPageClient |
| 2 | `error-first-callbacks` | `ErrorFirstCallbacksViz.tsx` | default | Add to ConceptPageClient |
| 3 | `promises-chaining` | `PromisesChainingViz.tsx` | default | Add to ConceptPageClient |
| 4 | `promises-static-methods` | `PromisesViz.tsx` | mode='static' | Extend PromisesViz |
| 5 | `async-await-syntax` | `AsyncPatternsViz.tsx` | mode='async-await' | Add to ConceptPageClient |
| 6 | `closure-loops-classic` | `ClosuresViz.tsx` | mode='loops' | Extend ClosuresViz |
| 7 | `closure-memory-leaks` | `ClosuresViz.tsx` | mode='memory' | Extend ClosuresViz |
| 8 | `closure-module-pattern` | `ClosuresViz.tsx` | mode='module' | Extend ClosuresViz |
| 9 | `closure-partial-application` | `ClosuresViz.tsx` | mode='partial' | Extend ClosuresViz |
| 10 | `class-syntax-prototypes` | `PrototypesViz.tsx` | mode='class-syntax' | Extend PrototypesViz |
| 11 | `prototype-inheritance` | `PrototypesViz.tsx` | mode='inheritance' | Extend PrototypesViz |
| 12 | `array-searching` | `ArrayMethodsViz.tsx` | mode='searching' | Add mode to ArrayMethodsViz |
| 13 | `array-sorting` | `ArrayMethodsViz.tsx` | mode='sorting' | Add mode to ArrayMethodsViz |

## Naming Inconsistencies to Fix

| Current ID | Should Be | Viz File | Action |
|------------|-----------|----------|--------|
| `promise-chaining` | `promises-chaining` | `PromisesChainingViz.tsx` | Rename concept ID |
| `callbacks-fundamentals` | `callbacks-basics` | `CallbacksBasicsViz.tsx` | Rename concept ID |

## Current Proper Mappings (Verify)

```typescript
// Phase 1: Scope & Hoisting
'scope-basics' → ScopeHoistingViz (mode='scope')
'hoisting-variables' → HoistingViz
'hoisting-functions' → HoistingViz
'temporal-dead-zone' → ScopeHoistingViz (mode='tdz')
'lexical-scope' → ScopeHoistingViz (mode='lexical')

// Phase 2: Async (FIX NEEDED)
'callbacks-fundamentals' → ❌ NOT MAPPED (should be CallbacksBasicsViz)
'error-first-callbacks' → ❌ NOT MAPPED (should be ErrorFirstCallbacksViz)
'callback-hell' → CallbackHellViz
'promises-creation' → PromisesCreationViz
'promise-chaining' → ❌ NOT MAPPED (naming issue)
'promises-then-catch' → PromisesThenCatchViz
'promise-static-methods' → ❌ NOT MAPPED
'async-await-basics' → ❌ NOT MAPPED (should be AsyncPatternsViz)
'async-await-parallel' → AsyncPatternsViz (mode='parallel')
'async-await-error-handling' → AsyncPatternsViz

// Phase 3: Arrays (FIX NEEDED)
'array-mutation-methods' → ArrayMethodsViz
'array-iteration-methods' → ArrayMethodsViz
'array-transformation' → ArrayMethodsViz
'array-searching-sorting' → ❌ NOT MAPPED (split into 2)
'array-reduce-patterns' → ArrayMethodsViz
'array-immutable-patterns' → ArrayMethodsViz

// Phase 4: Closure (FIX NEEDED)
'closure-definition' → ❌ NOT MAPPED
'closure-practical-uses' → ClosuresViz
'closure-in-loops' → ClosuresViz
'closure-memory' → ClosuresViz
'closure-patterns' → ClosuresViz
'module-pattern' → ❌ NOT MAPPED

// Phase 4: Prototypes (FIX NEEDED)
'prototype-chain-basics' → PrototypesViz
'property-lookup' → PrototypesViz
'class-syntax-sugar' → PrototypesViz
'instanceof-operator' → PrototypesViz
'object-create' → PrototypesViz
'prototype-pollution' → PrototypesViz

// Phase 5-8: (Mostly OK)
```

## Implementation Priority

### P0 (Fix Today)
1. Add missing 13 concept → viz mappings
2. Fix 2 naming inconsistencies

### P1 (This Week)
1. Add modes to existing viz components
2. Extend viz components for granular concepts

### P2 (Next Week)
1. Improve mobile responsiveness
2. Standardize content depth
