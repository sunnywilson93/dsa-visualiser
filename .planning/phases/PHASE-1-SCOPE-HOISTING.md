# Phase 1: Scope & Hoisting Split

**Status:** Planned  
**Priority:** P0 (Critical)  
**Estimated Time:** 1 week  
**Concepts:** 5 new granular topics

---

## Overview

Replace the single "hoisting" concept with 5 granular topics that build upon each other. This is the #1 source of confusion in JS interviews.

---

## Concepts to Create

### 1. scope-basics
**ID:** `scope-basics`  
**Category:** fundamentals  
**Difficulty:** beginner  
**Estimated Read Time:** 5 min

**Learning Objectives:**
- Understand the 3 types of scope: global, function, block
- Visualize scope as "bubbles" or containers
- Know which declarations create which scope types

**Key Points:**
- Global scope: accessible everywhere
- Function scope: created by function declarations (var lives here)
- Block scope: created by { } (let/const live here)
- Scope nesting: inner scopes can access outer scopes

**Examples:**
1. Global variable access from function
2. Function scope with var
3. Block scope with let/const
4. Nested scope access pattern

**Common Mistakes:**
- Thinking all { } create scope (only with let/const)
- Not understanding scope lookup chain

**Interview Questions:**
- "What's the difference between function scope and block scope?"
- "Can you access a variable declared inside a function from outside?"

---

### 2. hoisting-variables
**ID:** `hoisting-variables`  
**Category:** fundamentals  
**Difficulty:** beginner  
**Estimated Read Time:** 7 min

**Prerequisites:** scope-basics

**Learning Objectives:**
- Understand that var, let, and const are all hoisted but behave differently
- Explain TDZ in simple terms
- Predict code output with hoisting

**Key Points:**
- All declarations are hoisted (moved to top of scope during compilation)
- var: hoisted and initialized with undefined
- let/const: hoisted but NOT initialized (TDZ)
- const must be initialized at declaration

**Examples:**
1. var hoisting with undefined
2. let hoisting with TDZ error
3. Temporal Dead Zone demonstration
4. Function-scope var leaking out of if blocks

**Common Mistakes:**
- Thinking let/const are NOT hoisted (they are, just not initialized)
- Using variables before declaration without understanding TDZ

**Interview Questions:**
- "What's the output: console.log(a); var a = 5;"
- "What's the output: console.log(b); let b = 5;"
- "Why does typeof undeclaredVariable return undefined but accessing letVariable before declaration throws?"

---

### 3. hoisting-functions
**ID:** `hoisting-functions`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Estimated Read Time:** 6 min

**Prerequisites:** hoisting-variables

**Learning Objectives:**
- Distinguish function declaration hoisting from function expression
- Understand why function expressions aren't hoisted
- Know when to use each pattern

**Key Points:**
- Function declarations: fully hoisted (can call before definition)
- Function expressions: NOT hoisted (behavior depends on var/let/const)
- Arrow functions: same as function expressions

**Examples:**
1. Function declaration called before definition
2. Function expression with var (hoisted but undefined)
3. Function expression with let (TDZ error)
4. Named function expressions for recursion

**Common Mistakes:**
- Calling function expressions before their line
- Confusing named function expressions with declarations

**Interview Questions:**
- "Can you call a function before it's declared? When?"
- "What's the difference: function foo() {} vs var foo = function() {}"
- "Why is foo() undefined but not an error in: var foo = function() {}; foo();"

---

### 4. temporal-dead-zone
**ID:** `temporal-dead-zone`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Estimated Read Time:** 8 min

**Prerequisites:** hoisting-variables

**Learning Objectives:**
- Deep understanding of TDZ mechanics
- Predict TDZ errors in various scenarios
- Understand why TDZ exists (prevents bugs)

**Key Points:**
- TDZ = time between entering scope and variable declaration
- Accessing variable in TDZ throws ReferenceError
- TDZ ends at declaration line, not initialization
- typeof in TDZ also throws (unlike undeclared variables)

**Examples:**
1. Simple TDZ error
2. TDZ with typeof operator
3. TDZ in loops (classic interview question)
4. TDZ across function calls
5. Temporal Dead Zone with default parameters

**Common Mistakes:**
- Thinking TDZ is just about hoisting
- Not realizing typeof behaves differently
- Overlooking TDZ in loop bodies

**Interview Questions:**
- "What is the Temporal Dead Zone?"
- "Why does this throw: let x = x;"
- "What's the output: typeof undeclared vs typeof tdzVariable"
- "Explain TDZ in: for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }"

---

### 5. lexical-scope
**ID:** `lexical-scope`  
**Category:** fundamentals  
**Difficulty:** intermediate  
**Estimated Read Time:** 7 min

**Prerequisites:** scope-basics, hoisting-variables

**Learning Objectives:**
- Understand scope is determined at write-time, not runtime
- Trace scope chain lookups
- Connect lexical scope to closure foundation

**Key Points:**
- Lexical = "where written" not "where called"
- Scope chain: inner scope → outer scope → global
- Variable lookup follows scope chain until found
- Scope is static (doesn't change based on how function is called)

**Examples:**
1. Nested functions accessing outer variables
2. Scope chain visualization
3. Same variable name in different scopes (shadowing)
4. Lexical vs dynamic scope comparison

**Common Mistakes:**
- Confusing lexical scope with this binding (this is dynamic)
- Not understanding scope chain lookup order

**Interview Questions:**
- "What is lexical scoping?"
- "How does JavaScript look up variables?"
- "What's scope shadowing?"

---

## Implementation Checklist

- [ ] Create `scope-basics` concept
- [ ] Create `hoisting-variables` concept
- [ ] Create `hoisting-functions` concept
- [ ] Create `temporal-dead-zone` concept
- [ ] Create `lexical-scope` concept
- [ ] Update existing concept links to point to new granular topics
- [ ] Add "deprecated" note to old "hoisting" concept (or redirect)
- [ ] Update category navigation to include new concepts
- [ ] Add cross-links between related concepts

---

## Cross-Links Needed

| From Concept | To Concept | Context |
|--------------|------------|---------|
| scope-basics | lexical-scope | "Learn how scope lookup works" |
| hoisting-variables | temporal-dead-zone | "Deep dive into TDZ" |
| hoisting-functions | closure-definition | Functions remember their scope |
| lexical-scope | closure-definition | Foundation for closures |
| temporal-dead-zone | promises-microtask-queue | Both involve execution timing |

---

## Interview Coverage

These 5 concepts cover these common interview questions:

1. ✅ "Explain hoisting in JavaScript"
2. ✅ "Difference between var, let, const"
3. ✅ "What is the Temporal Dead Zone?"
4. ✅ "Can function expressions be hoisted?"
5. ✅ "How does scope work in JavaScript?"
6. ✅ "What's the output: [various hoisting code]"
7. ✅ "Why is let better than var?"
