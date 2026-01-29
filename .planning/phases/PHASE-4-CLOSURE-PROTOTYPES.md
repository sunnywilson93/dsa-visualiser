# Phase 4: Closure & Prototypes Mastery

**Status:** Planned  
**Priority:** P1 (High)  
**Estimated Time:** 2 weeks  
**Concepts:** 12 new granular topics

---

## Overview

Split "closures" and "prototypes" into granular topics. These separate junior from senior developers in interviews.

---

## Part A: Closure Deep Dive (6 concepts)

### 4.1 Closure Definition
**ID:** `closure-definition`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min  
**Prerequisites:** lexical-scope

**Content:**
- Simple definition: function + surrounding state
- Visual representation of closure scope
- Closure is created at function creation, not call
- Every function in JS forms a closure

**Examples:**
1. Simple counter closure
2. Function returning function
3. Multiple closures sharing scope
4. Closure in setTimeout

**Interview Question:**
- "What is a closure in JavaScript?"
- "When is a closure created?"

---

### 4.2 Closure Practical Uses
**ID:** `closure-practical-uses`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min

**Patterns Covered:**
1. Data encapsulation (private variables)
2. Function factories
3. Maintaining state in async
4. Memoization foundation
5. Event handler callbacks

**Examples:**
1. Private counter
2. Multiplier factory
3. Once function (runs only once)
4. Debounce (intro, detailed in timing-control)

---

### 4.3 Closure in Loops (Classic Bug)
**ID:** `closure-loops-classic`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min

**Content:**
- The infamous var + setTimeout loop bug
- Why it happens (shared scope)
- Solutions: let, IIFE, forEach

**Examples:**
```javascript
// The Bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Solution 1: let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// Solution 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

**Interview Question:**
- "What's the output? How do you fix it?"
- "Why does let fix it but var doesn't?"

---

### 4.4 Closure Memory Management
**ID:** `closure-memory-leaks`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 8 min

**Content:**
- Closures keep variables alive
- Accidental large memory retention
- DOM element references in closures
- Breaking closures (nulling references)

**Examples:**
1. Large array trapped in closure
2. Event listener with closure holding DOM
3. Memory profiling demonstration

---

### 4.5 Module Pattern
**ID:** `closure-module-pattern`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 10 min

**Content:**
- IIFE + Closure = Encapsulation
- Revealing module pattern
- Public vs private methods
- ES6 modules vs module pattern

**Examples:**
1. Counter module
2. Calculator module
3. Singleton pattern

---

### 4.6 Partial Application & Currying
**ID:** `closure-partial-application`  
**Category:** advanced  
**Difficulty:** advanced  
**Time:** 12 min

**Content:**
- Partial application: fix some arguments
- Currying: transform f(a,b,c) to f(a)(b)(c)
- Practical uses in functional programming
- bind() for partial application

**Examples:**
1. Partial application with bind
2. Manual partial function
3. Simple curry implementation
4. Practical use: logger prefix

---

## Part B: Prototype Chain (6 concepts)

### 4.7 Prototype Chain Basics
**ID:** `prototype-chain-basics`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min  
**Prerequisites:** objects-basics

**Content:**
- __proto__ (object's prototype)
- prototype (function's prototype property)
- constructor (reference back)
- Object.getPrototypeOf()

**Visual:**
```
instance --__proto__--> Constructor.prototype
```

**Examples:**
1. Create object, check __proto__
2. Function prototype property
3. Constructor relationship
4. prototype chain visualization

**Interview Question:**
- "What's the difference between __proto__ and prototype?"

---

### 4.8 Property Lookup
**ID:** `property-lookup`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min

**Content:**
- How JS looks up properties (delegation)
- HasOwnProperty vs inherited
- Shadowing properties
- Setting properties always on instance

**Examples:**
1. Property found on instance
2. Property found on prototype
3. Property not found (undefined)
4. Shadowing demonstration

---

### 4.9 instanceof Operator
**ID:** `instanceof-operator`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 8 min

**Content:**
- How instanceof works (checks prototype chain)
- obj instanceof Constructor
- Limitations (iframes, primitives)
- Alternative: Object.prototype.toString

**Examples:**
1. Basic instanceof checks
2. Prototype chain walking
3. iframe instanceof issue
4. Array.isArray vs instanceof

**Interview Question:**
- "How does instanceof work under the hood?"
- "Why doesn't instanceof work across iframes?"

---

### 4.10 ES6 Classes as Prototype Sugar
**ID:** `class-syntax-prototypes`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Time:** 10 min

**Content:**
- class is syntactic sugar over prototypes
- What class desugars to
- constructor, methods, static
- Still prototype-based under the hood

**Examples:**
1. Class definition
2. Desugared to prototype equivalent
3. typeof Class === 'function'
4. Class methods on prototype

---

### 4.11 Classical Inheritance in JS
**ID:** `prototype-inheritance`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 12 min

**Content:**
- Object.create() for inheritance
- Setting up prototype chain
- Calling parent constructor
- Method overriding

**Examples:**
1. Object.create() inheritance
2. Constructor inheritance pattern
3. ES6 extends desugared
4. Diamond problem discussion

---

### 4.12 Prototype Pollution
**ID:** `prototype-pollution`  
**Category:** fundamentals  
**Difficulty:** advanced  
**Time:** 10 min

**Content:**
- What is prototype pollution
- How it happens (merge, clone operations)
- Security implications
- Prevention techniques

**Examples:**
1. lodash merge vulnerability
2. JSON.parse with __proto__
3. Object.freeze(Object.prototype)

---

## Implementation Checklist

### Closure (6 concepts)
- [ ] Create `closure-definition`
- [ ] Create `closure-practical-uses`
- [ ] Create `closure-loops-classic`
- [ ] Create `closure-memory-leaks`
- [ ] Create `closure-module-pattern`
- [ ] Create `closure-partial-application`

### Prototypes (6 concepts)
- [ ] Create `prototype-chain-basics`
- [ ] Create `property-lookup`
- [ ] Create `instanceof-operator`
- [ ] Create `class-syntax-prototypes`
- [ ] Create `prototype-inheritance`
- [ ] Create `prototype-pollution`

---

## Learning Paths

### Closure Path
```
lexical-scope → closure-definition → closure-practical-uses
                                    ↓
              closure-loops-classic → closure-memory-leaks
                                    ↓
                    closure-module-pattern
                                    ↓
                    closure-partial-application
```

### Prototype Path
```
objects-basics → prototype-chain-basics → property-lookup
                ↓
    instanceof-operator → class-syntax-prototypes
                ↓
        prototype-inheritance → prototype-pollution
```

---

## Interview Coverage

### Closure Questions
1. ✅ "What is a closure? Give an example."
2. ✅ "What's wrong with var in this loop with setTimeout?"
3. ✅ "How do you create private variables in JS?"
4. ✅ "Explain the module pattern."
5. ✅ "Can closures cause memory leaks?"
6. ✅ "What is partial application?"

### Prototype Questions
1. ✅ "Explain prototypal inheritance"
2. ✅ "Difference between __proto__ and prototype"
3. ✅ "How does instanceof work?"
4. ✅ "Is ES6 class just syntax sugar?"
5. ✅ "How do you check if a property is own vs inherited?"
6. ✅ "What is prototype pollution?"
