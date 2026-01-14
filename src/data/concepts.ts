// JavaScript Concepts - Interactive Learning Module

export interface ConceptExample {
  title: string
  code: string
  explanation: string
}

export interface Concept {
  id: string
  title: string
  icon: string
  category: 'fundamentals' | 'core' | 'advanced' | 'runtime' | 'backend' | 'browser'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  shortDescription: string
  keyPoints: string[]
  examples: ConceptExample[]
  commonMistakes?: string[]
  interviewTips?: string[]
}

export const concepts: Concept[] = [
  {
    id: 'hoisting',
    title: 'Hoisting',
    icon: '🎈',
    category: 'fundamentals',
    difficulty: 'beginner',
    description: 'Hoisting is JavaScript\'s default behavior of moving declarations to the top of their scope before code execution. Understanding hoisting helps you predict how variables and functions behave before they\'re defined in your code.',
    shortDescription: 'How JS moves declarations to the top',
    keyPoints: [
      'Variable declarations (var) are hoisted, but not their assignments',
      'Function declarations are fully hoisted (name + body)',
      'let and const are hoisted but stay in the "Temporal Dead Zone" until declared',
      'Function expressions are NOT hoisted like function declarations',
    ],
    examples: [
      // Beginner
      { title: 'var Hoisting', code: `console.log(x);  // undefined
var x = 5;
console.log(x);  // 5

// JS interprets as:
// var x;
// console.log(x);
// x = 5;`, explanation: 'var declarations are hoisted, but not assignments' },
      { title: 'Function Declaration', code: `sayHi();  // "Hello!"

function sayHi() {
  console.log("Hello!");
}

// Works because function
// declarations are fully hoisted`, explanation: 'Function declarations are fully hoisted' },
      // Intermediate
      { title: 'let & TDZ', code: `console.log(x);  // ReferenceError!
let x = 5;

// let/const are hoisted but
// remain in "Temporal Dead Zone"
// until the declaration line`, explanation: 'let/const have Temporal Dead Zone' },
      { title: 'var vs let in Loops', code: `// var - shared across iterations
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// Output: 3, 3, 3

// let - new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// Output: 0, 1, 2`, explanation: 'Different scoping behaviors' },
      { title: 'Function Expressions', code: `sayHi();  // TypeError!

var sayHi = function() {
  console.log("Hello!");
};

// Only the variable declaration
// is hoisted, not the function`, explanation: 'Expressions are NOT hoisted like declarations' },
      // Advanced
      { title: 'Mixed Declarations', code: `console.log(a);  // undefined
console.log(b);  // ReferenceError
console.log(c);  // [Function: c]

var a = 1;
let b = 2;
function c() {}`, explanation: 'Understanding declaration order' },
      { title: 'var Redeclaration', code: `var x = 1;
var x = 2;  // OK with var
console.log(x);  // 2

let y = 1;
let y = 2;  // SyntaxError!
// Cannot redeclare with let`, explanation: 'var allows redeclaration, let does not' },
      { title: 'Block Scope', code: `if (true) {
  var a = 1;   // function-scoped
  let b = 2;   // block-scoped
}
console.log(a);  // 1
console.log(b);  // ReferenceError!

// let/const respect {} blocks
// var ignores them`, explanation: 'let/const are block-scoped' },
    ],
    commonMistakes: [
      'Assuming let/const don\'t hoist (they do, but have TDZ)',
      'Using var in loops and expecting block scope',
      'Relying on hoisting instead of declaring variables at the top',
    ],
    interviewTips: [
      'Explain the difference between declaration and initialization',
      'Know what TDZ means and when it applies',
      'Be able to predict output of hoisting quiz questions',
    ],
  },
  {
    id: 'closures',
    title: 'Closures',
    icon: '🎒',
    category: 'core',
    difficulty: 'intermediate',
    description: 'A closure is a function that remembers the variables from its outer scope even after the outer function has returned. Think of it as a function carrying a "backpack" of variables wherever it goes.',
    shortDescription: 'Functions that remember their scope',
    keyPoints: [
      'A closure is created every time a function is created',
      'Inner functions have access to outer function variables',
      'The outer variables are captured by reference, not by value',
      'Closures enable data privacy and stateful functions',
    ],
    examples: [
      // Beginner
      { title: 'Basic Closure', code: `function outer() {
  let count = 0;

  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3`, explanation: 'Inner function remembers outer variables' },
      { title: 'Counter Example', code: `function createCounter(start) {
  let count = start;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counter = createCounter(10);
counter.increment();  // 11
counter.increment();  // 12
counter.getValue();   // 12`, explanation: 'Each call uses the same closed-over variable' },
      // Intermediate
      { title: 'Private Variables', code: `function createAccount(initial) {
  let balance = initial;  // private!

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        return "Insufficient funds";
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createAccount(100);
account.deposit(50);   // 150
account.balance;       // undefined (private!)`, explanation: 'Closures enable data privacy' },
      { title: 'Multiple Closures', code: `function createCounter(start) {
  let count = start;
  return () => count++;
}

const counterA = createCounter(0);
const counterB = createCounter(100);

counterA();  // 0
counterA();  // 1
counterB();  // 100
counterB();  // 101

// Each closure has independent state`, explanation: 'Each closure has its own independent state' },
      // Advanced
      { title: 'Loop Closure Bug', code: `// THE BUG: All callbacks share same i
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 3, 3, 3

// Why? var is function-scoped
// All 3 closures reference the
// SAME i, which is 3 after loop`, explanation: 'Classic var loop closure problem' },
      { title: 'Loop Fix with let', code: `// THE FIX: let creates new binding
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 0, 1, 2

// Why? let is block-scoped
// Each iteration gets its own i
// Each closure captures different i`, explanation: 'let creates new binding per iteration' },
    ],
    commonMistakes: [
      'Loop variable capture - all callbacks share the same variable',
      'Memory leaks from closures holding large objects',
      'Forgetting that closures capture by reference, not value',
    ],
    interviewTips: [
      'Use the "backpack" metaphor to explain closures',
      'Show practical uses: data privacy, function factories, memoization',
      'Be ready to solve the classic loop closure problem',
    ],
  },
  {
    id: 'this-keyword',
    title: 'The "this" Keyword',
    icon: '👆',
    category: 'core',
    difficulty: 'intermediate',
    description: 'The `this` keyword refers to the object that is executing the current function. Its value is determined by HOW a function is called, not where it\'s defined. There are 4 main rules that determine what `this` refers to.',
    shortDescription: 'Context binding rules',
    keyPoints: [
      'this is determined at call time, not definition time',
      'Rule 1: new binding - this = new instance',
      'Rule 2: Explicit binding (call/apply/bind) - this = specified object',
      'Rule 3: Implicit binding (obj.method()) - this = object left of dot',
      'Rule 4: Default binding - this = window (or undefined in strict mode)',
      'Arrow functions inherit this from enclosing scope',
    ],
    examples: [
      // Beginner
      { title: 'Object Method', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, I'm " + this.name);
  }
};

person.greet();
// "Hi, I'm Alice"

// this = object left of the dot`, explanation: 'Implicit binding: object left of dot' },
      { title: 'Standalone Function', code: `function showThis() {
  console.log(this);
}

showThis();
// In browser: Window object
// In strict mode: undefined

// No object = default binding`, explanation: 'Default binding: no object = global' },
      // Intermediate
      { title: 'call() / apply()', code: `function greet(greeting) {
  console.log(greeting + ", " + this.name);
}

const bob = { name: "Bob" };
const sue = { name: "Sue" };

greet.call(bob, "Hello");
// "Hello, Bob"

greet.apply(sue, ["Hi"]);
// "Hi, Sue"

// First argument becomes 'this'`, explanation: 'Explicit binding: first arg = this' },
      { title: 'bind()', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

const greet = person.greet;
greet();  // undefined (lost binding!)

const boundGreet = person.greet.bind(person);
boundGreet();  // "Hi, Alice"

// bind() permanently sets 'this'`, explanation: 'Hard binding: permanently set this' },
      { title: 'Arrow Functions', code: `const person = {
  name: "Alice",
  regularFunc() {
    console.log(this.name);  // "Alice"

    const arrow = () => {
      console.log(this.name);  // "Alice"
    };
    arrow();
  }
};

// Arrow functions inherit 'this'
// from their enclosing scope`, explanation: 'Lexical this: inherits from enclosing scope' },
      // Advanced
      { title: 'new Keyword', code: `function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log("Hi, " + this.name);
  };
}

const alice = new Person("Alice");
alice.greet();  // "Hi, Alice"

// 'new' creates fresh object
// and binds it to 'this'`, explanation: 'Constructor binding: this = new instance' },
      { title: 'Lost Binding', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

// BUG: 'this' is lost in callback
setTimeout(person.greet, 100);
// "Hi, undefined"

// The method is passed as plain
// function, losing its context`, explanation: 'Common bug: callback loses context' },
      { title: 'Fixed with Arrow', code: `const person = {
  name: "Alice",
  greet() {
    console.log("Hi, " + this.name);
  }
};

// FIX 1: Arrow function wrapper
setTimeout(() => person.greet(), 100);
// "Hi, Alice"

// FIX 2: Use bind
setTimeout(person.greet.bind(person), 100);
// "Hi, Alice"`, explanation: 'Arrow function preserves this' },
    ],
    commonMistakes: [
      'Losing this when passing methods as callbacks',
      'Using arrow functions as object methods',
      'Forgetting that this in nested functions is different',
    ],
    interviewTips: [
      'Know all 4 binding rules in order of precedence',
      'Explain why arrow functions are useful in callbacks',
      'Be able to fix "this" issues with bind or arrow functions',
    ],
  },
  {
    id: 'event-loop',
    title: 'Event Loop',
    icon: '🔄',
    category: 'advanced',
    difficulty: 'advanced',
    description: 'The Event Loop is how JavaScript handles asynchronous operations despite being single-threaded. It continuously checks if the call stack is empty, then moves callbacks from the task queues to the stack for execution.',
    shortDescription: 'How async JavaScript works',
    keyPoints: [
      'JavaScript is single-threaded (one call stack)',
      'Web APIs handle async operations (setTimeout, fetch, etc.)',
      'Task Queue (Macrotasks): setTimeout, setInterval, I/O',
      'Microtask Queue: Promises, queueMicrotask, MutationObserver',
      'Microtasks run before the next macrotask',
      'Event loop: Stack empty? → Run all microtasks → Run one macrotask → Repeat',
    ],
    examples: [
      // Beginner
      { title: 'Promise vs setTimeout', code: `console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");

// Output: 1, 4, 3, 2
// Microtasks before macrotasks!`, explanation: 'Microtasks (Promise) run before macrotasks (setTimeout)' },
      { title: 'Sync Code Flow', code: `function greet() {
  console.log("Hello");
}

console.log("Start");
greet();
console.log("End");

// Output: Start, Hello, End
// Synchronous = line by line`, explanation: 'Synchronous code executes line by line on call stack' },
      // Intermediate
      { title: 'Chained Promises', code: `Promise.resolve(1)
  .then(x => {
    console.log(x);  // 1
    return x + 1;
  })
  .then(x => {
    console.log(x);  // 2
    return x + 1;
  })
  .then(x => {
    console.log(x);  // 3
  });

// Each .then queues a microtask
// when the previous resolves`, explanation: 'Each .then queues when previous resolves' },
      { title: 'async/await', code: `async function example() {
  console.log("1");

  await Promise.resolve();
  // Everything after await becomes
  // a microtask

  console.log("2");
}

console.log("A");
example();
console.log("B");

// Output: A, 1, B, 2`, explanation: 'await pauses function, queues continuation as microtask' },
      { title: 'Nested setTimeout', code: `setTimeout(() => {
  console.log("First macrotask");

  setTimeout(() => {
    console.log("Second macrotask");
  }, 0);

}, 0);

console.log("Sync");

// Output: Sync, First, Second
// Each setTimeout queues one
// macrotask for next loop cycle`, explanation: 'Nested creates new macrotask for next iteration' },
      // Advanced
      { title: 'Microtask in Macrotask', code: `setTimeout(() => {
  console.log("Macro 1");

  Promise.resolve().then(() => {
    console.log("Micro inside");
  });

  console.log("Macro 1 end");
}, 0);

setTimeout(() => {
  console.log("Macro 2");
}, 0);

// Output: Macro 1, Macro 1 end,
//         Micro inside, Macro 2`, explanation: 'Microtasks created during macrotask run before next macrotask' },
      { title: 'queueMicrotask', code: `queueMicrotask(() => {
  console.log("Microtask 1");

  queueMicrotask(() => {
    console.log("Microtask 2");
  });
});

console.log("Sync");

// Output: Sync, Microtask 1, Microtask 2
// All microtasks drain before
// any macrotask runs`, explanation: 'Direct microtask scheduling, can queue more microtasks' },
      { title: 'Microtask Starvation', code: `// DANGER: This blocks forever!
function recursive() {
  Promise.resolve().then(recursive);
}

recursive();
setTimeout(() => {
  console.log("Never runs!");
}, 0);

// Microtasks keep adding more
// macrotasks are STARVED`, explanation: 'Infinite microtasks block all macrotasks forever!' },
    ],
    commonMistakes: [
      'Thinking setTimeout(fn, 0) runs immediately',
      'Not understanding microtask priority over macrotasks',
      'Blocking the event loop with long-running synchronous code',
    ],
    interviewTips: [
      'Draw the event loop diagram (stack, queues, Web APIs)',
      'Know the order: sync → microtasks → macrotasks',
      'Explain why Promises are faster than setTimeout',
    ],
  },
  {
    id: 'prototypes',
    title: 'Prototypes',
    icon: '🔗',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Prototypes are JavaScript\'s mechanism for inheritance. Every object has a hidden [[Prototype]] link to another object. When you access a property, JS looks up the prototype chain until it finds it or reaches null.',
    shortDescription: 'JavaScript inheritance mechanism',
    keyPoints: [
      'Every object has a [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf)',
      'Property lookup walks up the prototype chain',
      'Functions have a .prototype property used for constructor instances',
      'Object.create() creates objects with a specific prototype',
      'ES6 classes are syntactic sugar over prototypes',
    ],
    examples: [
      // Beginner
      { title: 'Basic Prototype Chain', code: `const animal = {
  eats: true,
  walk() {
    console.log("Walking");
  }
};

const dog = {
  barks: true
};

dog.__proto__ = animal;

dog.barks;  // true (own property)
dog.eats;   // true (from prototype)
dog.walk(); // "Walking" (from prototype)`, explanation: 'JS walks up __proto__ links to find properties' },
      { title: 'Simple Object Literal', code: `const obj = { x: 1 };

// All objects inherit from Object.prototype
obj.__proto__ === Object.prototype  // true

// That's why we can use:
obj.toString();      // "[object Object]"
obj.hasOwnProperty("x");  // true

// These methods come from Object.prototype`, explanation: 'Object literals inherit from Object.prototype' },
      // Intermediate
      { title: 'Object.create()', code: `const parent = {
  greet() {
    console.log("Hello from " + this.name);
  }
};

const child = Object.create(parent);
child.name = "Child";

child.greet();  // "Hello from Child"

// Object.create() sets the prototype
Object.getPrototypeOf(child) === parent  // true`, explanation: 'Create object with specific prototype' },
      { title: 'Property Shadowing', code: `const parent = {
  name: "Parent",
  greet() {
    return "Hi from " + this.name;
  }
};

const child = Object.create(parent);
child.name = "Child";  // shadows parent.name

child.greet();  // "Hi from Child"

// child.name shadows parent.name
// but greet() is still from parent`, explanation: 'Child property hides parent property' },
      { title: 'Constructor Function', code: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log("Hi, I'm " + this.name);
};

const alice = new Person("Alice");
const bob = new Person("Bob");

alice.greet();  // "Hi, I'm Alice"
bob.greet();    // "Hi, I'm Bob"

// Both share the same greet method!
alice.greet === bob.greet  // true`, explanation: 'Instances inherit from Constructor.prototype' },
      // Advanced
      { title: 'hasOwnProperty Check', code: `const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

// hasOwnProperty: only own properties
child.hasOwnProperty("own");       // true
child.hasOwnProperty("inherited"); // false

// 'in' operator: checks entire chain
"own" in child;        // true
"inherited" in child;  // true

// Useful for safe iteration
for (let key in child) {
  if (child.hasOwnProperty(key)) {
    console.log(key);  // only "own"
  }
}`, explanation: 'hasOwnProperty checks only object, "in" checks chain' },
      { title: 'Object.create(null)', code: `// Normal object has prototype
const normal = {};
normal.toString;  // [Function]

// Null prototype = truly empty
const dict = Object.create(null);
dict.toString;    // undefined

// Safe dictionary (no collisions)
dict["hasOwnProperty"] = "safe!";
dict.hasOwnProperty;  // "safe!"

// With normal object this would
// shadow the built-in method`, explanation: 'No prototype = no inherited methods, safe dictionaries' },
      { title: 'Class Syntax (ES6)', code: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks");
  }
}

const dog = new Dog("Rex");
dog.speak();  // "Rex barks"

// Classes are syntactic sugar!
// Under the hood: prototypes`, explanation: 'Classes are syntactic sugar over prototypes' },
    ],
    commonMistakes: [
      'Confusing __proto__ with .prototype',
      'Modifying Object.prototype (affects all objects!)',
      'Not understanding that arrays/functions are also objects with prototypes',
    ],
    interviewTips: [
      'Draw the prototype chain for a given object',
      'Explain the difference between __proto__ and .prototype',
      'Know how ES6 classes relate to prototypes',
    ],
  },
  {
    id: 'recursion',
    title: 'Recursion',
    icon: '🔁',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Recursion is when a function calls itself to solve smaller instances of the same problem. Every recursive function needs a base case (stopping condition) and a recursive case. Understanding the call stack is key to mastering recursion.',
    shortDescription: 'Functions that call themselves',
    keyPoints: [
      'A recursive function calls itself with a smaller/simpler input',
      'Every recursion needs a BASE CASE to stop (or you get infinite recursion)',
      'The call stack grows with each recursive call, then unwinds as functions return',
      'Recursion can be converted to iteration (and vice versa)',
      'Memoization can optimize recursive functions with overlapping subproblems',
    ],
    examples: [
      // Beginner
      { title: 'Factorial', code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`, explanation: 'Classic recursion: multiply n by factorial of (n-1)' },
      { title: 'Countdown', code: `function countdown(n) {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}`, explanation: 'Simple recursion with side effects' },
      // Intermediate - Branching Recursion
      { title: 'Fibonacci', code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`, explanation: 'Tree recursion: TWO recursive calls combine results' },
      { title: 'Climbing Stairs', code: `function climbStairs(n) {
  if (n <= 1) return 1;
  return climbStairs(n - 1)
       + climbStairs(n - 2);
}`, explanation: 'Ways to climb: take 1 step OR 2 steps (branching)' },
      { title: 'Max Tree Depth', code: `function maxDepth(node) {
  if (!node) return 0;
  let left = maxDepth(node.left);
  let right = maxDepth(node.right);
  return Math.max(left, right) + 1;
}`, explanation: 'Compare TWO recursive results, take the max' },
      // Advanced - Complex Branching
      { title: 'Subsets', code: `function subsets(nums, i = 0, curr = []) {
  if (i === nums.length) {
    return [curr.slice()];
  }
  // Branch 1: exclude nums[i]
  let without = subsets(nums, i + 1, curr);
  // Branch 2: include nums[i]
  curr.push(nums[i]);
  let with_ = subsets(nums, i + 1, curr);
  curr.pop();
  return [...without, ...with_];
}`, explanation: 'Include OR exclude each element - exponential branching' },
      { title: 'Memoization', code: `function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo)
          + fibMemo(n - 2, memo);
  return memo[n];
}`, explanation: 'Cache results to avoid recalculating branches' },
      { title: 'Tree DFS', code: `function dfs(node) {
  if (!node) return;
  console.log(node.val);
  dfs(node.left);   // Branch 1
  dfs(node.right);  // Branch 2
}`, explanation: 'Visit node, then recurse on BOTH children' },
    ],
    commonMistakes: [
      'Forgetting the base case (causes infinite recursion / stack overflow)',
      'Base case that is never reached',
      'Not reducing the problem size in recursive call',
      'Using recursion when simple iteration would be clearer',
    ],
    interviewTips: [
      'Always identify the base case first',
      'Trace through with a small example on paper',
      'Know when to use memoization (overlapping subproblems)',
      'Be able to convert between recursion and iteration',
    ],
  },
  // Runtime Internals
  {
    id: 'memory-model',
    title: 'Memory Model',
    icon: '🧠',
    category: 'runtime',
    difficulty: 'intermediate',
    description: 'JavaScript uses two memory regions: the Stack for primitives and function calls, and the Heap for objects and dynamic data. Understanding this helps you predict performance, avoid memory leaks, and understand how garbage collection works.',
    shortDescription: 'Stack vs Heap and garbage collection',
    keyPoints: [
      'Stack: stores primitives (numbers, booleans, strings) and function call frames',
      'Heap: stores objects, arrays, and functions (dynamic allocation)',
      'Variables hold references (pointers) to heap objects, not the objects themselves',
      'Garbage Collection: V8 uses mark-and-sweep to free unreachable objects',
      'Memory leaks occur when objects remain referenced but are no longer needed',
    ],
    examples: [
      { title: 'Primitives vs Objects', code: `// Primitives stored in stack
let a = 10;
let b = a;    // Copy of value
b = 20;
console.log(a);  // 10 (unchanged)

// Objects stored in heap
let obj1 = { x: 1 };
let obj2 = obj1;  // Copy of reference
obj2.x = 99;
console.log(obj1.x);  // 99 (same object!)`, explanation: 'Primitives are copied by value, objects by reference' },
      { title: 'Stack Frames', code: `function outer() {
  let x = 1;  // Frame 1
  inner();
}

function inner() {
  let y = 2;  // Frame 2
  // Stack: [global, outer, inner]
}

outer();
// inner() returns → frame popped
// outer() returns → frame popped`, explanation: 'Each function call creates a stack frame' },
      { title: 'Heap Allocation', code: `// Each {} creates new heap object
function createUser(name) {
  return {
    name: name,
    data: new Array(1000)
  };
}

let user1 = createUser("Alice");
let user2 = createUser("Bob");
// Two separate objects on heap`, explanation: 'Objects allocated on heap persist until GC' },
      { title: 'Garbage Collection', code: `let obj = { data: "important" };

// obj is reachable → NOT collected

obj = null;

// Original object now unreachable
// GC will reclaim this memory
// in next collection cycle`, explanation: 'Unreachable objects are garbage collected' },
      { title: 'Memory Leak', code: `const cache = [];

function processData(data) {
  // BUG: cache grows forever!
  cache.push(data);
  return data.value * 2;
}

// Fix: limit cache size or use WeakMap
const weakCache = new WeakMap();`, explanation: 'Unbounded caches cause memory leaks' },
      { title: 'Closures & Memory', code: `function createCounter() {
  let count = 0;  // Kept alive by closure

  return () => ++count;
}

const counter = createCounter();
// 'count' lives in heap as long
// as 'counter' function exists`, explanation: 'Closures keep variables alive on heap' },
    ],
    commonMistakes: [
      'Thinking primitives and objects are stored the same way',
      'Forgetting that object assignment copies references, not values',
      'Creating memory leaks with event listeners, closures, or global caches',
      'Not understanding that garbage collection is non-deterministic',
    ],
    interviewTips: [
      'Draw stack and heap diagrams for given code',
      'Explain why === behaves differently for primitives vs objects',
      'Know common memory leak patterns and how to fix them',
      'Understand WeakMap/WeakSet for cache scenarios',
    ],
  },
  {
    id: 'v8-engine',
    title: 'V8 Engine',
    icon: '🚀',
    category: 'runtime',
    difficulty: 'advanced',
    description: 'V8 is the JavaScript engine powering Chrome and Node.js. It compiles JavaScript to machine code using a two-tier approach: Ignition (interpreter) for quick startup, and TurboFan (JIT compiler) for hot code optimization.',
    shortDescription: 'JIT compilation and optimization',
    keyPoints: [
      'Parser converts source code to Abstract Syntax Tree (AST)',
      'Ignition: interpreter that generates bytecode for fast startup',
      'TurboFan: JIT compiler that optimizes "hot" frequently-run code',
      'Hidden Classes: V8 creates shapes for objects to optimize property access',
      'Inline Caching: remembers where to find properties on repeated access',
      'Deoptimization: falls back to interpreter when assumptions break',
    ],
    examples: [
      { title: 'Compilation Pipeline', code: `// Your code goes through:
// 1. Parser → AST
// 2. Ignition → Bytecode
// 3. (If hot) TurboFan → Machine Code

function add(a, b) {
  return a + b;
}

// Called once: interpreted
add(1, 2);

// Called 1000x: JIT compiled!
for (let i = 0; i < 1000; i++) {
  add(i, i);
}`, explanation: 'Hot functions get JIT compiled for speed' },
      { title: 'Hidden Classes', code: `// V8 creates hidden classes for shapes
function Point(x, y) {
  this.x = x;  // Hidden class C0 → C1
  this.y = y;  // Hidden class C1 → C2
}

// Same shape = same hidden class
let p1 = new Point(1, 2);
let p2 = new Point(3, 4);

// p1 and p2 share hidden class!
// Fast property access`, explanation: 'Same property order = same hidden class' },
      { title: 'Breaking Hidden Classes', code: `function Point(x, y) {
  this.x = x;
  this.y = y;
}

let p1 = new Point(1, 2);
let p2 = new Point(3, 4);

// BAD: Adding property breaks class
p1.z = 5;  // p1 gets new hidden class

// Now p1 and p2 have DIFFERENT
// hidden classes = slower access`, explanation: 'Adding properties creates new hidden classes' },
      { title: 'Monomorphic Calls', code: `// FAST: Always same type (monomorphic)
function getX(point) {
  return point.x;
}

let p = { x: 1, y: 2 };
for (let i = 0; i < 1000; i++) {
  getX(p);  // Same shape every time
}

// SLOW: Different types (polymorphic)
getX({ x: 1 });
getX({ x: 1, y: 2 });
getX({ x: 1, y: 2, z: 3 });`, explanation: 'Consistent object shapes enable optimization' },
      { title: 'Deoptimization', code: `function add(a, b) {
  return a + b;
}

// V8 optimizes for numbers
for (let i = 0; i < 10000; i++) {
  add(i, i);  // TurboFan optimizes
}

// Type change triggers deopt!
add("hello", "world");

// V8 must deoptimize and
// recompile with new assumptions`, explanation: 'Changing types causes deoptimization' },
      { title: 'Optimization Tips', code: `// 1. Initialize all properties in constructor
function User(name, age) {
  this.name = name;
  this.age = age;
  this.email = null;  // Even if null!
}

// 2. Keep types consistent
function process(x) {
  return x * 2;  // Always pass numbers!
}

// 3. Avoid delete (breaks hidden class)
user.email = undefined;  // Better
// delete user.email;     // Slower`, explanation: 'Tips for V8-friendly code' },
    ],
    commonMistakes: [
      'Adding properties to objects after creation (breaks hidden classes)',
      'Passing different types to the same function (polymorphic = slow)',
      'Using delete instead of setting to undefined',
      'Premature optimization without measuring',
    ],
    interviewTips: [
      'Explain the difference between interpreter and JIT compiler',
      'Know why consistent object shapes matter for performance',
      'Understand when deoptimization happens',
      'Be able to discuss hidden classes and inline caching',
    ],
  },
  // Backend (Node.js)
  {
    id: 'nodejs-event-loop',
    title: 'Node.js Event Loop',
    icon: '♻️',
    category: 'backend',
    difficulty: 'advanced',
    description: 'Node.js uses libuv to implement its event loop, which has 6 distinct phases. Understanding these phases helps you predict execution order and avoid blocking the server.',
    shortDescription: 'Libuv phases and async patterns',
    keyPoints: [
      'Node.js event loop has 6 phases (not just micro/macro queues)',
      'Timers phase: executes setTimeout/setInterval callbacks',
      'Poll phase: retrieves new I/O events, executes I/O callbacks',
      'Check phase: executes setImmediate callbacks',
      'process.nextTick runs BETWEEN phases (highest priority)',
      'Blocking the event loop freezes your entire server',
    ],
    examples: [
      { title: 'Event Loop Phases', code: `// Phase 1: Timers (setTimeout)
setTimeout(() => console.log("timer"), 0);

// Phase 4: Poll (I/O callbacks)
fs.readFile("file.txt", () => {
  console.log("file read");
});

// Phase 5: Check (setImmediate)
setImmediate(() => console.log("immediate"));

// Between phases: process.nextTick
process.nextTick(() => console.log("nextTick"));

// Output order depends on I/O!`, explanation: 'Different callbacks run in different phases' },
      { title: 'setTimeout vs setImmediate', code: `// In main module: order varies!
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));

// Inside I/O callback: immediate first!
fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// Output: immediate, timeout
// (Check phase runs before Timers)`, explanation: 'setImmediate runs before setTimeout in I/O callbacks' },
      { title: 'process.nextTick', code: `// nextTick runs BETWEEN phases
// (even before Promises!)

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

// Output: nextTick, promise
// nextTick has highest priority!`, explanation: 'process.nextTick runs before Promise callbacks' },
      { title: 'nextTick Starvation', code: `// DANGER: Recursive nextTick
// blocks the event loop forever!

function recurse() {
  process.nextTick(recurse);
}
recurse();

// I/O callbacks will NEVER run
// Server becomes unresponsive!

// Fix: use setImmediate instead
function safeRecurse() {
  setImmediate(safeRecurse);
}`, explanation: 'nextTick can starve I/O if abused' },
      { title: 'Blocking the Event Loop', code: `// BAD: Blocks entire server!
app.get("/slow", (req, res) => {
  // 10 billion iterations
  for (let i = 0; i < 1e10; i++) {}
  res.send("done");
});

// GOOD: Use Worker Threads
const { Worker } = require("worker_threads");

app.get("/fast", (req, res) => {
  const worker = new Worker("./heavy.js");
  worker.on("message", () => res.send("done"));
});`, explanation: 'CPU-heavy work blocks all requests' },
      { title: 'Event Loop Monitoring', code: `// Monitor event loop lag
const start = process.hrtime();

setImmediate(() => {
  const [s, ns] = process.hrtime(start);
  const lag = s * 1000 + ns / 1e6;
  console.log(\`Event loop lag: \${lag}ms\`);
});

// High lag = event loop blocked
// Target: < 100ms for responsive server`, explanation: 'Monitor lag to detect blocking issues' },
    ],
    commonMistakes: [
      'Confusing browser event loop with Node.js event loop',
      'Using recursive process.nextTick (causes starvation)',
      'Blocking the event loop with CPU-intensive code',
      'Assuming setTimeout(fn, 0) runs immediately',
    ],
    interviewTips: [
      'Know all 6 phases of the libuv event loop',
      'Explain the difference between setImmediate and setTimeout',
      'Understand why process.nextTick exists and when to use it',
      'Know how to handle CPU-intensive tasks (Worker Threads)',
    ],
  },
  {
    id: 'streams-buffers',
    title: 'Streams & Buffers',
    icon: '🌊',
    category: 'backend',
    difficulty: 'intermediate',
    description: 'Streams let you process data piece by piece instead of loading everything into memory. Buffers hold binary data. Together they enable efficient handling of files, network requests, and real-time data.',
    shortDescription: 'Efficient data processing',
    keyPoints: [
      'Streams process data in chunks (memory efficient)',
      'Four types: Readable, Writable, Duplex, Transform',
      'Buffers are fixed-size chunks of binary data',
      'Backpressure: slow consumer signals fast producer to pause',
      'pipe() handles backpressure automatically',
      'highWaterMark controls internal buffer size (default 16KB)',
    ],
    examples: [
      { title: 'Reading a File Stream', code: `const fs = require("fs");

// BAD: Loads entire file into memory
const data = fs.readFileSync("huge.txt");

// GOOD: Stream processes chunks
const stream = fs.createReadStream("huge.txt");

stream.on("data", (chunk) => {
  console.log(\`Received \${chunk.length} bytes\`);
});

stream.on("end", () => {
  console.log("Done reading");
});`, explanation: 'Streams process large files without loading into memory' },
      { title: 'Piping Streams', code: `const fs = require("fs");
const zlib = require("zlib");

// Read → Compress → Write
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("output.gz"));

// pipe() handles backpressure!
// If write is slow, read pauses`, explanation: 'pipe() chains streams with automatic backpressure' },
      { title: 'Transform Stream', code: `const { Transform } = require("stream");

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    // Modify data as it flows through
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

process.stdin
  .pipe(upperCase)
  .pipe(process.stdout);

// Type lowercase → outputs UPPERCASE`, explanation: 'Transform streams modify data in flight' },
      { title: 'Buffer Basics', code: `// Create buffer from string
const buf1 = Buffer.from("Hello");
console.log(buf1);  // <Buffer 48 65 6c 6c 6f>

// Create empty buffer
const buf2 = Buffer.alloc(10);

// Buffer operations
buf1.toString();     // "Hello"
buf1.length;         // 5
buf1[0];             // 72 (ASCII 'H')

// Concatenate buffers
const combined = Buffer.concat([buf1, buf2]);`, explanation: 'Buffers hold raw binary data' },
      { title: 'Backpressure Handling', code: `const readable = getReadableStream();
const writable = getWritableStream();

readable.on("data", (chunk) => {
  // write() returns false if buffer full
  const ok = writable.write(chunk);

  if (!ok) {
    // Pause reading until drain
    readable.pause();
    writable.once("drain", () => {
      readable.resume();
    });
  }
});

// Or just use pipe() which does this!`, explanation: 'Manual backpressure handling (or use pipe)' },
      { title: 'HTTP Streaming', code: `const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
  // Stream file directly to response
  const stream = fs.createReadStream("video.mp4");

  res.writeHead(200, {
    "Content-Type": "video/mp4"
  });

  stream.pipe(res);

  // Video starts playing immediately!
  // No need to load entire file first
}).listen(3000);`, explanation: 'Stream large files in HTTP responses' },
    ],
    commonMistakes: [
      'Loading entire files into memory instead of streaming',
      'Ignoring backpressure (causes memory issues)',
      'Not handling stream errors (crashes server)',
      'Confusing Buffer.alloc() with Buffer.allocUnsafe()',
    ],
    interviewTips: [
      'Know the four stream types and when to use each',
      'Explain backpressure and how pipe() handles it',
      'Understand why streams are memory-efficient',
      'Be able to implement a custom Transform stream',
    ],
  },
  // Browser
  {
    id: 'critical-render-path',
    title: 'Critical Render Path',
    icon: '🎨',
    category: 'browser',
    difficulty: 'intermediate',
    description: 'The Critical Render Path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen. Optimizing it is key to fast page loads and smooth interactions.',
    shortDescription: 'How browsers render pages',
    keyPoints: [
      'HTML parsing builds the DOM (Document Object Model)',
      'CSS parsing builds the CSSOM (CSS Object Model)',
      'DOM + CSSOM = Render Tree (only visible elements)',
      'Layout: calculates exact position and size of each element',
      'Paint: fills in pixels (colors, images, text)',
      'Composite: layers are combined and sent to GPU',
    ],
    examples: [
      { title: 'Render Pipeline', code: `<!-- Browser processes this: -->
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="box">Hello</div>
    <script src="app.js"></script>
  </body>
</html>

<!-- Pipeline:
1. Parse HTML → Build DOM
2. Parse CSS → Build CSSOM
3. Combine → Render Tree
4. Layout → Calculate positions
5. Paint → Fill pixels
6. Composite → Send to GPU -->`, explanation: 'The browser pipeline from HTML to pixels' },
      { title: 'Render-Blocking CSS', code: `<!-- CSS blocks rendering! -->
<head>
  <!-- This blocks paint until loaded -->
  <link rel="stylesheet" href="styles.css">

  <!-- This doesn't block (print only) -->
  <link rel="stylesheet" href="print.css" media="print">

  <!-- Preload critical CSS -->
  <link rel="preload" href="critical.css" as="style">
</head>

<!-- Browser waits for CSS before
     painting anything to avoid FOUC
     (Flash of Unstyled Content) -->`, explanation: 'CSS blocks rendering until fully loaded' },
      { title: 'Parser-Blocking JavaScript', code: `<!-- JS blocks HTML parsing! -->
<body>
  <div>Content above</div>

  <!-- Blocks parsing until executed -->
  <script src="app.js"></script>

  <!-- Use defer: loads async, runs after HTML -->
  <script defer src="app.js"></script>

  <!-- Use async: loads async, runs immediately -->
  <script async src="analytics.js"></script>

  <div>Content below (blocked by script)</div>
</body>`, explanation: 'Scripts block HTML parsing unless defer/async' },
      { title: 'Reflow (Layout)', code: `// EXPENSIVE: Triggers layout recalculation

// Reading layout properties:
element.offsetHeight;
element.getBoundingClientRect();

// Changing layout properties:
element.style.width = "100px";
element.style.margin = "10px";

// BAD: Layout thrashing
for (let i = 0; i < 100; i++) {
  el.style.width = el.offsetWidth + 10 + "px";
  // Read → Write → Read → Write...
}

// GOOD: Batch reads, then writes
const width = el.offsetWidth;
el.style.width = width + 1000 + "px";`, explanation: 'Avoid layout thrashing by batching DOM operations' },
      { title: 'Repaint vs Reflow', code: `// REPAINT only (cheap)
// Changes visual properties, not layout
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.visibility = "hidden";

// REFLOW + REPAINT (expensive)
// Changes geometry/layout
element.style.width = "200px";
element.style.fontSize = "20px";
element.style.display = "none";

// NEITHER (use transform/opacity)
element.style.transform = "translateX(100px)";
element.style.opacity = "0.5";
// Compositor-only, no layout/paint!`, explanation: 'Prefer compositor properties for animations' },
      { title: 'Optimize Critical Path', code: `<!-- 1. Inline critical CSS -->
<style>
  /* Above-the-fold styles only */
  .header { ... }
</style>

<!-- 2. Defer non-critical CSS -->
<link rel="preload" href="full.css" as="style"
      onload="this.rel='stylesheet'">

<!-- 3. Defer JavaScript -->
<script defer src="app.js"></script>

<!-- 4. Lazy load images -->
<img loading="lazy" src="below-fold.jpg">

<!-- 5. Use resource hints -->
<link rel="preconnect" href="https://api.com">`, explanation: 'Techniques to speed up initial render' },
    ],
    commonMistakes: [
      'Putting blocking scripts in <head> without defer/async',
      'Not inlining critical CSS for above-the-fold content',
      'Causing layout thrashing by mixing reads and writes',
      'Animating layout properties instead of transform/opacity',
    ],
    interviewTips: [
      'Draw the render pipeline from HTML to pixels',
      'Explain the difference between reflow and repaint',
      'Know which CSS properties trigger layout vs paint vs composite',
      'Understand defer vs async for script loading',
    ],
  },
  {
    id: 'web-workers',
    title: 'Web Workers',
    icon: '👷',
    category: 'browser',
    difficulty: 'advanced',
    description: 'Web Workers enable multi-threading in JavaScript by running scripts in background threads. This keeps the main thread free for UI updates, preventing the page from freezing during heavy computations.',
    shortDescription: 'Multi-threading in the browser',
    keyPoints: [
      'Workers run in separate threads (true parallelism)',
      'Main thread stays responsive during heavy computation',
      'Communication via postMessage (data is copied, not shared)',
      'Workers have no DOM access (no document, window, etc.)',
      'SharedArrayBuffer allows shared memory between threads',
      'Service Workers: special workers for offline caching and network interception',
    ],
    examples: [
      { title: 'Basic Worker', code: `// main.js
const worker = new Worker("worker.js");

// Send data to worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

// Receive result from worker
worker.onmessage = (e) => {
  console.log("Sum:", e.data.sum);
};

// worker.js
self.onmessage = (e) => {
  const sum = e.data.numbers.reduce((a, b) => a + b);
  self.postMessage({ sum: sum });
};`, explanation: 'Worker runs in background thread' },
      { title: 'Heavy Computation', code: `// Without worker: UI freezes!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
fibonacci(45);  // Blocks for seconds!

// With worker: UI stays responsive
const worker = new Worker("fib-worker.js");
worker.postMessage(45);
worker.onmessage = (e) => {
  console.log("Result:", e.data);
};

// User can still click buttons!`, explanation: 'Offload heavy work to keep UI responsive' },
      { title: 'Transferable Objects', code: `// postMessage copies data (slow for large data)

const bigArray = new Float32Array(1000000);

// SLOW: Data is copied
worker.postMessage(bigArray);

// FAST: Transfer ownership (zero-copy)
worker.postMessage(bigArray, [bigArray.buffer]);

// After transfer, bigArray is empty!
console.log(bigArray.length);  // 0

// Worker now owns the buffer`, explanation: 'Transfer large data without copying' },
      { title: 'SharedArrayBuffer', code: `// Create shared memory
const shared = new SharedArrayBuffer(4);
const view = new Int32Array(shared);

// Pass to worker (no copy!)
worker.postMessage(shared);

// Both threads see same memory
view[0] = 42;  // Worker sees this!

// Use Atomics for thread-safe access
Atomics.add(view, 0, 1);
Atomics.load(view, 0);  // 43

// Note: Requires COOP/COEP headers`, explanation: 'SharedArrayBuffer for shared memory' },
      { title: 'Worker Pool', code: `class WorkerPool {
  constructor(size, script) {
    this.workers = Array(size).fill(null)
      .map(() => new Worker(script));
    this.queue = [];
    this.available = [...this.workers];
  }

  run(data) {
    return new Promise((resolve) => {
      const task = { data, resolve };

      if (this.available.length > 0) {
        this.dispatch(task);
      } else {
        this.queue.push(task);
      }
    });
  }

  dispatch(task) {
    const worker = this.available.pop();
    worker.onmessage = (e) => {
      task.resolve(e.data);
      this.available.push(worker);
      if (this.queue.length > 0) {
        this.dispatch(this.queue.shift());
      }
    };
    worker.postMessage(task.data);
  }
}`, explanation: 'Pool workers for efficient parallel processing' },
      { title: 'Service Worker', code: `// Register service worker
navigator.serviceWorker.register("/sw.js");

// sw.js - Intercept network requests
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Return cached version or fetch
      return cached || fetch(e.request);
    })
  );
});

// Cache resources for offline use
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/app.js"]);
    })
  );
});`, explanation: 'Service Workers enable offline-first apps' },
    ],
    commonMistakes: [
      'Trying to access DOM from a worker (not allowed)',
      'Sending large data without using Transferable objects',
      'Not handling worker errors (silent failures)',
      'Creating too many workers (overhead)',
    ],
    interviewTips: [
      'Explain when to use Web Workers vs main thread',
      'Know the difference between copying and transferring data',
      'Understand SharedArrayBuffer and Atomics for thread safety',
      'Explain Service Workers and their use cases (PWA, offline)',
    ],
  },
]

export const conceptCategories = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '🟢', description: 'Core JS basics' },
  { id: 'core', name: 'Core Mechanics', icon: '🟡', description: 'How JS really works' },
  { id: 'advanced', name: 'Advanced', icon: '🔴', description: 'Deep dive topics' },
  { id: 'runtime', name: 'Runtime Internals', icon: '⚙️', description: 'How JS engines work' },
  { id: 'backend', name: 'Node.js', icon: '🟢', description: 'Server-side JavaScript' },
  { id: 'browser', name: 'Browser', icon: '🌐', description: 'Frontend rendering' },
]

// Related concepts mapping for internal linking (SEO)
const relatedConceptsMap: Record<string, string[]> = {
  'hoisting': ['closures', 'this-keyword', 'memory-model'],
  'closures': ['hoisting', 'this-keyword', 'memory-model', 'recursion'],
  'this-keyword': ['closures', 'prototypes', 'event-loop'],
  'event-loop': ['this-keyword', 'nodejs-event-loop', 'web-workers'],
  'prototypes': ['this-keyword', 'closures', 'memory-model'],
  'recursion': ['closures', 'memory-model', 'event-loop'],
  'memory-model': ['hoisting', 'closures', 'v8-engine', 'streams-buffers'],
  'v8-engine': ['memory-model', 'event-loop', 'nodejs-event-loop'],
  'nodejs-event-loop': ['event-loop', 'v8-engine', 'streams-buffers', 'web-workers'],
  'streams-buffers': ['memory-model', 'nodejs-event-loop'],
  'critical-render-path': ['event-loop', 'web-workers', 'memory-model'],
  'web-workers': ['event-loop', 'nodejs-event-loop', 'critical-render-path'],
}

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id)
}

export function getConceptsByCategory(category: string): Concept[] {
  return concepts.filter(c => c.category === category)
}

export function getRelatedConcepts(id: string): Concept[] {
  const relatedIds = relatedConceptsMap[id] || []
  return relatedIds
    .map(relatedId => concepts.find(c => c.id === relatedId))
    .filter((c): c is Concept => c !== undefined)
}
