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
      { title: 'var Hoisting', code: 'console.log(x); var x = 5;', explanation: 'var declarations are hoisted, but not assignments' },
      { title: 'Function Declaration', code: 'sayHi(); function sayHi() {}', explanation: 'Function declarations are fully hoisted' },
      // Intermediate
      { title: 'let & TDZ', code: 'console.log(x); let x = 5;', explanation: 'let/const have Temporal Dead Zone' },
      { title: 'var vs let', code: 'var x vs let x in loops', explanation: 'Different scoping behaviors' },
      { title: 'Function Expressions', code: 'sayHi(); var sayHi = function() {}', explanation: 'Expressions are NOT hoisted like declarations' },
      // Advanced
      { title: 'Mixed Declarations', code: 'Complex var/let/function mix', explanation: 'Understanding declaration order' },
      { title: 'var Redeclaration', code: 'var x = 1; var x = 2;', explanation: 'var allows redeclaration, let does not' },
      { title: 'Block Scope', code: 'if/for block scoping', explanation: 'let/const are block-scoped' },
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
      { title: 'Basic Closure', code: 'function outer() { let x = 0; return function() { return x++; } }', explanation: 'Inner function remembers outer variables' },
      { title: 'Counter Example', code: 'const counter = outer(); counter(); counter();', explanation: 'Each call uses the same closed-over variable' },
      // Intermediate
      { title: 'Private Variables', code: 'function createAccount() { let balance = 0; return { deposit, withdraw } }', explanation: 'Closures enable data privacy' },
      { title: 'Multiple Closures', code: 'const a = createCounter(0); const b = createCounter(100);', explanation: 'Each closure has its own independent state' },
      // Advanced
      { title: 'Loop Closure Bug', code: 'for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)) }', explanation: 'Classic var loop closure problem' },
      { title: 'Loop Fix with let', code: 'for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i)) }', explanation: 'let creates new binding per iteration' },
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
      { title: 'Object Method', code: 'person.greet(); // this = person', explanation: 'Implicit binding: object left of dot' },
      { title: 'Standalone Function', code: 'showThis(); // this = window', explanation: 'Default binding: no object = global' },
      // Intermediate
      { title: 'call() / apply()', code: 'greet.call(bob, "Hi"); greet.apply(sue, ["Hi"]);', explanation: 'Explicit binding: first arg = this' },
      { title: 'bind()', code: 'const boundGreet = greet.bind(person);', explanation: 'Hard binding: permanently set this' },
      { title: 'Arrow Functions', code: 'const arrow = () => console.log(this);', explanation: 'Lexical this: inherits from enclosing scope' },
      // Advanced
      { title: 'new Keyword', code: 'const p = new Person("Alice");', explanation: 'Constructor binding: this = new instance' },
      { title: 'Lost Binding', code: 'setTimeout(person.greet, 100);', explanation: 'Common bug: callback loses context' },
      { title: 'Fixed with Arrow', code: 'setTimeout(() => person.greet(), 100);', explanation: 'Arrow function preserves this' },
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
      { title: 'Promise vs setTimeout', code: 'setTimeout(...); Promise.resolve().then(...);', explanation: 'Microtasks (Promise) run before macrotasks (setTimeout)' },
      { title: 'Sync Code Flow', code: 'console.log("start"); fn(); console.log("end");', explanation: 'Synchronous code executes line by line on call stack' },
      // Intermediate
      { title: 'Chained Promises', code: '.then(() => ...).then(() => ...)', explanation: 'Each .then queues when previous resolves' },
      { title: 'async/await', code: 'async function f() { await Promise.resolve(); }', explanation: 'await pauses function, queues continuation as microtask' },
      { title: 'Nested setTimeout', code: 'setTimeout(() => { setTimeout(...) });', explanation: 'Nested creates new macrotask for next iteration' },
      // Advanced
      { title: 'Microtask in Macrotask', code: 'setTimeout(() => { Promise.resolve().then(...) });', explanation: 'Microtasks created during macrotask run before next macrotask' },
      { title: 'queueMicrotask', code: 'queueMicrotask(() => { queueMicrotask(...) });', explanation: 'Direct microtask scheduling, can queue more microtasks' },
      { title: 'Microtask Starvation', code: 'function recursive() { Promise.resolve().then(recursive) }', explanation: 'Infinite microtasks block all macrotasks forever!' },
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
      { title: 'Basic Prototype Chain', code: 'dog.__proto__ = Animal.prototype', explanation: 'JS walks up __proto__ links to find properties' },
      { title: 'Simple Object Literal', code: 'const obj = {}; obj.__proto__ === Object.prototype', explanation: 'Object literals inherit from Object.prototype' },
      // Intermediate
      { title: 'Object.create()', code: 'const child = Object.create(parent);', explanation: 'Create object with specific prototype' },
      { title: 'Property Shadowing', code: 'child.toString overrides Object.prototype.toString', explanation: 'Child property hides parent property' },
      { title: 'Constructor Function', code: 'new Person("Alice")', explanation: 'Instances inherit from Constructor.prototype' },
      // Advanced
      { title: 'hasOwnProperty Check', code: 'obj.hasOwnProperty("x") vs "x" in obj', explanation: 'hasOwnProperty checks only object, "in" checks chain' },
      { title: 'Object.create(null)', code: 'const dict = Object.create(null);', explanation: 'No prototype = no inherited methods, safe dictionaries' },
      { title: 'Class Syntax (ES6)', code: 'class Animal { speak() {} }', explanation: 'Classes are syntactic sugar over prototypes' },
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
