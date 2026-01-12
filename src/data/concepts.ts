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
  category: 'fundamentals' | 'core' | 'advanced'
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
]

export const conceptCategories = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '🟢', description: 'Core JS basics' },
  { id: 'core', name: 'Core Mechanics', icon: '🟡', description: 'How JS really works' },
  { id: 'advanced', name: 'Advanced', icon: '🔴', description: 'Deep dive topics' },
]

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id)
}

export function getConceptsByCategory(category: string): Concept[] {
  return concepts.filter(c => c.category === category)
}
