# Phase 3: Array Methods Mastery

**Status:** Planned  
**Priority:** P1 (High)  
**Estimated Time:** 2 weeks  
**Concepts:** 7 new granular topics

---

## Overview

Expand "arrays-basics" into 7 focused topics. Arrays are daily tools AND interview favorites.

---

## Concepts to Create

### 3.1 Array Mutation Methods
**ID:** `array-mutation-methods`  
**Category:** basics  
**Difficulty:** beginner  
**Time:** 6 min

**Learning Objectives:**
- Know which methods mutate the original array
- Return values of mutating methods
- When to use mutation vs immutability

**Methods Covered:**
- push() - add to end, returns new length
- pop() - remove from end, returns element
- shift() - remove from start, returns element
- unshift() - add to start, returns new length
- splice() - add/remove at index, returns removed
- sort() - sorts in place, returns sorted array
- reverse() - reverses in place

**Examples:**
1. push/pop stack operations
2. shift/unshift queue operations
3. splice for insert/delete/replace
4. Mutation side effects demonstration

**Common Mistakes:**
- Forgetting sort() mutates AND returns
- Confusing splice parameters (start, deleteCount, ...items)
- Not handling return values properly

---

### 3.2 Array Iteration Methods
**ID:** `array-iteration-methods`  
**Category:** basics  
**Difficulty:** intermediate  
**Time:** 12 min

**Learning Objectives:**
- Choose the right iteration method for the task
- Understand callback signatures
- Know which methods return what

**Methods Covered:**
- forEach() - execute for each, returns undefined
- map() - transform each, returns new array
- filter() - keep some, returns new array
- find() - find first match, returns element
- findIndex() - find index, returns number
- some() - any match? returns boolean
- every() - all match? returns boolean

**Examples:**
1. forEach vs map (side effects vs transformation)
2. Chaining: map + filter
3. find vs filter (one vs many)
4. some/every for validation
5. findIndex for deletion/replacement

**Interview Questions:**
- "What's the difference between map and forEach?"
- "When would you use filter vs find?"
- "Can you break out of forEach?"

---

### 3.3 Array.reduce() Mastery
**ID:** `array-reduce-patterns`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 15 min

**Learning Objectives:**
- Understand reduce as "transform array to anything"
- Master common reduce patterns
- Know when NOT to use reduce

**Patterns Covered:**
1. Sum/product (number)
2. Max/min (number)
3. GroupBy (object)
4. Flatten (array)
5. Pipeline (function composition)
6. Count occurrences (object)
7. Async reduce patterns

**Examples:**
1. Simple sum
2. Group users by city
3. Flatten nested arrays
4. Compose functions pipeline
5. Count word frequency

**Common Mistakes:**
- Forgetting initial value (empty array/object bugs)
- Not returning accumulator
- Using reduce when map/filter is clearer

**Interview Questions:**
- "Implement groupBy using reduce"
- "What's the purpose of the initial value?"
- "Can you use async functions in reduce?"

---

### 3.4 Array Searching
**ID:** `array-searching`  
**Category:** basics  
**Difficulty:** intermediate  
**Time:** 8 min

**Methods Covered:**
- indexOf() / lastIndexOf() - primitive search
- includes() - has element? (primitive)
- find() / findIndex() - predicate search
- findLast() / findLastIndex() (ES2023)

**Content:**
- Strict equality (===) comparisons
- Reference equality for objects
- NaN behavior differences (indexOf vs includes)

**Examples:**
1. Find primitive in array
2. Find object by property
3. NaN search behavior
4. Search from end

---

### 3.5 Array Transformation
**ID:** `array-transformation`  
**Category:** basics  
**Difficulty:** intermediate  
**Time:** 8 min

**Methods Covered:**
- slice() - copy portion (immutable)
- concat() - combine arrays (immutable)
- flat() - flatten nested arrays
- flatMap() = map + flat
- join() - to string with separator
- toString() - comma-separated

**Examples:**
1. slice for copying
2. concat vs spread
3. flat with depth
4. flatMap for filtering + mapping
5. join for CSV-like output

---

### 3.6 Array Sorting
**ID:** `array-sorting`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min

**Content:**
- Default sort() converts to strings!
- Number comparator: (a, b) => a - b
- String localeCompare
- Object sorting by property
- toSorted() ES2023 (immutable)

**Examples:**
1. Numbers sorted wrong (default)
2. Numbers sorted correctly
3. String sort case-insensitive
4. Sort objects by date
5. Multi-field sort

**Common Mistakes:**
- Expecting numeric sort by default
- Forgetting comparator for numbers
- Not handling undefined/null

**Interview Questions:**
- "Why is [10, 2, 1].sort() returning [1, 10, 2]?"
- "Sort array of objects by multiple fields"

---

### 3.7 Immutable Array Patterns (ES2023)
**ID:** `array-immutable-patterns`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min

**New Methods (ES2023):**
- toReversed() - immutable reverse
- toSorted() - immutable sort
- toSpliced() - immutable splice
- with() - immutable index replacement

**Content:**
- Why immutability matters
- Copying with spread [...arr]
- StructuredClone for deep copy

**Examples:**
1. Old way: [...arr].reverse()
2. New way: arr.toReversed()
3. Immutable update with with()
4. Deep copy patterns

---

## Implementation Checklist

- [ ] Create `array-mutation-methods`
- [ ] Create `array-iteration-methods`
- [ ] Create `array-reduce-patterns`
- [ ] Create `array-searching`
- [ ] Create `array-transformation`
- [ ] Create `array-sorting`
- [ ] Create `array-immutable-patterns`

---

## Learning Path

```
array-mutation-methods
    ↓
array-iteration-methods
    ↓
array-reduce-patterns (depends on iteration)
    ↓
array-searching + array-transformation (parallel)
    ↓
array-sorting
    ↓
array-immutable-patterns
```

---

## Interview Questions Covered

1. ✅ "What's the difference between map and forEach?"
2. ✅ "Implement your own reduce"
3. ✅ "Group this array of objects by a property"
4. ✅ "Why does [1,10,2].sort() not work as expected?"
5. ✅ "Find the intersection of two arrays"
6. ✅ "Remove duplicates from an array (multiple ways)"
7. ✅ "Flatten a nested array"
