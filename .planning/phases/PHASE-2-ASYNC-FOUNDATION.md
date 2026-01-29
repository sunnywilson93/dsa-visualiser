# Phase 2: Async JS Foundation

**Status:** Planned  
**Priority:** P0 (Critical)  
**Estimated Time:** 2-3 weeks  
**Concepts:** 11 new granular topics

---

## Overview

Replace single "promises-deep-dive" with comprehensive async series. Async is the most tested topic in senior JS interviews.

---

## Concepts to Create

### 2.1 Callback Fundamentals

#### callbacks-basics
**ID:** `callbacks-basics`  
**Category:** fundamentals  
**Difficulty:** beginner  
**Time:** 5 min

**Content:**
- What is a callback (function passed to another function)
- Synchronous vs asynchronous callbacks
- Common built-in callbacks (setTimeout, addEventListener, array methods)
- Why callbacks exist (non-blocking operations)

**Examples:**
1. Synchronous callback (forEach)
2. Asynchronous callback (setTimeout)
3. Custom function accepting callback
4. Callback with parameters

---

#### callback-hell
**ID:** `callback-hell`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 7 min

**Prerequisites:** callbacks-basics

**Content:**
- Pyramid of doom visualization
- Error handling complexity
- Code readability issues
- Real-world scenarios (nested API calls)

**Examples:**
1. 3-level nested callbacks
2. 5-level pyramid of doom
3. Error handling in nested callbacks
4. Refactoring callback hell to promises (preview)

**Interview Questions:**
- "What is callback hell? How do you avoid it?"

---

#### error-first-callbacks
**ID:** `error-first-callbacks`  
**Category:** backend  
**Difficulty:** intermediate  
**Time:** 6 min

**Prerequisites:** callbacks-basics

**Content:**
- Node.js error-first convention (err, result) => {}
- Why this pattern exists
- How to handle errors properly
- fs.readFile, http.get examples

---

### 2.2 Promises Deep Dive

#### promises-creation
**ID:** `promises-creation`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 7 min

**Prerequisites:** callback-hell

**Content:**
- new Promise(executor) syntax
- resolve and reject functions
- Promise states: pending, fulfilled, rejected
- Creating promises from callbacks

**Examples:**
1. Basic promise creation
2. Promise with setTimeout
3. Converting callback to promise
4. Promise that resolves immediately
5. Promise that rejects with error

---

#### promises-then-catch
**ID:** `promises-then-catch`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min

**Prerequisites:** promises-creation

**Content:**
- .then() for fulfillment
- .catch() for rejection
- .finally() for cleanup
- Multiple handlers registration

**Examples:**
1. Basic then/catch flow
2. Error bubbling to catch
3. finally cleanup pattern
4. Multiple then handlers
5. Catching specific error types

**Interview Questions:**
- "What's the difference between .catch() and second .then() argument?"
- "Does .finally() receive the value?"

---

#### promises-chaining
**ID:** `promises-chaining`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min

**Prerequisites:** promises-then-catch

**Content:**
- Returning values from then()
- Returning promises from then()
- Flattening vs nesting
- Error propagation in chains

**Examples:**
1. Value transformation chain
2. Promise in promise (flattening)
3. Error in middle of chain
4. Breaking chains (common mistake)
5. Returning non-promise values

**Interview Questions:**
- "What happens if you return a promise in .then()?"
- "How do errors propagate in promise chains?"

---

#### promises-static-methods
**ID:** `promises-static-methods`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 12 min

**Prerequisites:** promises-chaining

**Content:**
- Promise.all() - wait for all
- Promise.race() - first to settle
- Promise.allSettled() - never rejects
- Promise.any() - first to fulfill
- Promise.resolve/reject

**Examples:**
1. Promise.all with array of promises
2. Promise.all with one rejection
3. Promise.race timeout pattern
4. Promise.allSettled for independent ops
5. Promise.any fallback pattern

**Interview Questions:**
- "What's the difference between Promise.all and Promise.allSettled?"
- "How would you implement a timeout with Promise.race?"
- "What happens if Promise.all has an empty array?"

---

#### promises-microtask-queue
**ID:** `promises-microtask-queue`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 10 min

**Prerequisites:** promises-then-catch, event-loop-tick

**Content:**
- Microtasks vs Macrotasks
- Promise.then() schedules microtask
- Microtask priority over macrotasks
- queueMicrotask() API

**Examples:**
1. Promise.then() vs setTimeout() order
2. Nested promise microtasks
3. Synchronous promise resolution
4. queueMicrotask() usage

**Interview Questions:**
- "What's the output order: setTimeout(() => console.log(1), 0); Promise.resolve().then(() => console.log(2)); console.log(3);"

---

### 2.3 Async/Await

#### async-await-syntax
**ID:** `async-await-syntax`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min

**Prerequisites:** promises-then-catch

**Content:**
- async function declaration
- await operator
- await can only be used in async functions
- Top-level await (ES2022)

**Examples:**
1. Basic async/await
2. Multiple awaits sequentially
3. Async function always returns promise
4. Awaiting non-promise values

---

#### async-await-error-handling
**ID:** `async-await-error-handling`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 9 min

**Prerequisites:** async-await-syntax

**Content:**
- try/catch with async/await
- Catching specific errors
- Re-throwing errors
- .catch() vs try/catch comparison

**Examples:**
1. Basic try/catch with await
2. Catching rejection reason
3. Multiple operations with one try/catch
4. Re-throwing with context
5. Mixing await and .catch()

**Interview Questions:**
- "How do you handle errors in async/await?"
- "Can you use .catch() with async/await?"

---

#### async-await-parallel
**ID:** `async-await-parallel`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 10 min

**Prerequisites:** async-await-syntax, promises-static-methods

**Content:**
- Sequential vs parallel execution
- Awaiting Promise.all()
- Common performance mistake (await in loop)
- When to use which pattern

**Examples:**
1. Sequential awaits (slow)
2. Parallel with Promise.all (fast)
3. Bad: for-await loop
4. Good: map + Promise.all
5. Partial parallelism patterns

**Interview Questions:**
- "How do you run async operations in parallel?"
- "What's wrong with: for (const url of urls) { await fetch(url); }"
- "When shouldn't you parallelize?"

---

#### async-await-sequential
**ID:** `async-await-sequential`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 8 min

**Prerequisites:** async-await-parallel

**Content:**
- When you need sequential execution
- Dependency between operations
- Reducing instead of Promise.all
- Pipeline patterns

**Examples:**
1. Sequential with dependencies
2. reduce() with async
3. for-await-of loop
4. Pipeline processing

---

## Implementation Checklist

- [ ] Create `callbacks-basics`
- [ ] Create `callback-hell`
- [ ] Create `error-first-callbacks`
- [ ] Create `promises-creation`
- [ ] Create `promises-then-catch`
- [ ] Create `promises-chaining`
- [ ] Create `promises-static-methods`
- [ ] Create `promises-microtask-queue`
- [ ] Create `async-await-syntax`
- [ ] Create `async-await-error-handling`
- [ ] Create `async-await-parallel`
- [ ] Create `async-await-sequential`

---

## Learning Path

```
callbacks-basics
    ↓
callback-hell
    ↓
promises-creation → promises-then-catch → promises-chaining
    ↓                   ↓
promises-static-methods  promises-microtask-queue
    ↓
async-await-syntax → async-await-error-handling
    ↓
async-await-parallel ↔ async-await-sequential
```

---

## Interview Coverage

This phase covers:

1. ✅ "Explain callbacks and callback hell"
2. ✅ "What are Promises? How do they work?"
3. ✅ "Promise.all vs Promise.race"
4. ✅ "What is async/await? Is it blocking?"
5. ✅ "Error handling in async/await"
6. ✅ "How to run async operations in parallel?"
7. ✅ "Event loop: microtasks vs macrotasks"
8. ✅ "Fix this slow code: [for-await loop]"
